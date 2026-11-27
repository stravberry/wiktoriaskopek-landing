import { NextResponse, type NextRequest } from "next/server"
import { audit, csrfOk, currentAdmin } from "@/lib/admin/server"
import { sql } from "@/lib/mf/db"
import { origin } from "@/lib/mf/server"

export const dynamic = "force-dynamic"

const STAGES = new Set(["lead", "oferta", "aktywny", "wstrzymany", "zakonczony"])
const UUID = /^[0-9a-f-]{36}$/
const text = (v: FormDataEntryValue | null, max: number) => {
  const s = String(v ?? "").replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g, "").trim().slice(0, max)
  return s || null
}

// Klienci w CRM: tylko baza panelu. Nic tu nie zmienia Dysku Google ani nie wysyła maili. Sesja admina + CSRF + dziennik.
export async function POST(request: NextRequest) {
  const h = request.headers
  const admin = await currentAdmin()
  if (!admin || !csrfOk(h)) {
    await audit("crm_denied", admin, false, {}, h)
    return NextResponse.json({ error: "forbidden" }, { status: 403 })
  }
  const f = await request.formData()
  const action = String(f.get("action") ?? "")
  const id = String(f.get("id") ?? "")
  const db = sql()
  const card = (cid: string, s: string) => NextResponse.redirect(`${origin()}/admin/crm/klient/${cid}?s=${s}`, 303)
  const list = (s: string) => NextResponse.redirect(`${origin()}/admin/crm?s=${s}`, 303)

  if (action === "create" || action === "from_folder") {
    let name = text(f.get("name"), 200)
    let folder: string | null = null
    if (action === "from_folder") {
      const [d] = await db`select id, name from ws_drive where id = ${String(f.get("folder_id") ?? "")} and depth = 1 and mime = 'application/vnd.google-apps.folder'`
      if (!d) return list("blad")
      const [taken] = await db`select id from ws_clients where drive_folder_id = ${d.id}`
      if (taken) return card(taken.id, "jest")
      name = d.name
      folder = d.id
    }
    if (!name) return list("blad")
    const email = text(f.get("email"), 200)?.toLowerCase() ?? null
    const [c] = await db`insert into ws_clients (name, email, drive_folder_id) values (${name}, ${email}, ${folder}) returning id`
    await audit("crm_client_create", admin, true, { client: c.id, folder }, h)
    return card(c.id, "zapisany")
  }

  if (!UUID.test(id)) return list("blad")
  const [client] = await db`select id from ws_clients where id = ${id}`
  if (!client) return list("blad")

  if (action === "update") {
    const name = text(f.get("name"), 200)
    const stage = String(f.get("stage") ?? "")
    if (!name || !STAGES.has(stage)) return card(id, "blad")
    const folderIn = String(f.get("folder_id") ?? "")
    let folder: string | null = null
    if (folderIn) {
      const [d] = await db`select id from ws_drive where id = ${folderIn} and depth = 1 and mime = 'application/vnd.google-apps.folder'`
      const [taken] = d ? await db`select 1 from ws_clients where drive_folder_id = ${d.id} and id <> ${id}` : [null]
      if (!d || taken) return card(id, "folder-zajety")
      folder = d.id
    }
    await db`update ws_clients set name = ${name}, email = ${text(f.get("email"), 200)?.toLowerCase() ?? null}, phone = ${text(f.get("phone"), 40)},
             stage = ${stage}, note = ${text(f.get("note"), 4000)}, drive_folder_id = ${folder}, updated_at = now() where id = ${id}`
    await audit("crm_client_update", admin, true, { client: id, stage, folder }, h)
    return card(id, "zapisany")
  }

  if (action === "assign" || action === "unassign") {
    const item = String(f.get("drive_id") ?? "").slice(0, 200)
    if (action === "assign") {
      const [d] = await db`select id from ws_drive where id = ${item}`
      if (!d) return card(id, "blad")
      await db`insert into ws_client_items (client_id, drive_id) values (${id}, ${d.id}) on conflict do nothing`
    } else {
      await db`delete from ws_client_items where client_id = ${id} and drive_id = ${item}`
    }
    await audit(`crm_item_${action}`, admin, true, { client: id, drive_id: item }, h)
    return card(id, "zapisany")
  }
  return card(id, "blad")
}
