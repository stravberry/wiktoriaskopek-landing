import { NextResponse, type NextRequest } from "next/server"
import { audit, csrfOk, currentAdmin } from "@/lib/admin/server"
import { sql } from "@/lib/mf/db"
import { origin } from "@/lib/mf/server"

export const dynamic = "force-dynamic"

const KINDS = new Set(["task_complete", "task_reopen", "sync_now"])
const BACK = new Set(["/admin/dzien", "/admin/clickup"])

// Polecenie z panelu do mostu na Macu (kolejka ws_commands). Sesja admina + CSRF + limit + dziennik.
// Lista zadania (list_id) bierzemy z kopii w bazie, nie z formularza.
export async function POST(request: NextRequest) {
  const h = request.headers
  const admin = await currentAdmin()
  if (!admin || !csrfOk(h)) {
    await audit("most_denied", admin, false, {}, h)
    return NextResponse.json({ error: "forbidden" }, { status: 403 })
  }
  const f = await request.formData()
  const kind = String(f.get("kind") ?? "")
  const back = BACK.has(String(f.get("back"))) ? String(f.get("back")) : "/admin/dzien"
  const go = (s: string) => NextResponse.redirect(`${origin()}${back}?s=${s}`, 303)
  if (!KINDS.has(kind)) return go("blad")
  const db = sql()
  const [{ n }] = await db`select count(*)::int as n from ws_commands where created_at > now() - interval '1 hour'`
  if (n >= 60) return go("limit")
  let payload: Record<string, string> = {}
  if (kind !== "sync_now") {
    const taskId = String(f.get("task_id") ?? "").slice(0, 200)
    const [t] = await db`select id, list_id from ws_tasks where id = ${taskId}`
    if (!t) return go("blad")
    payload = { task_id: t.id, list_id: t.list_id }
    const [dup] = await db`select 1 from ws_commands where kind = ${kind} and payload->>'task_id' = ${t.id} and status in ('pending', 'running')`
    if (dup) return go("w-toku")
  } else {
    const [dup] = await db`select 1 from ws_commands where kind = 'sync_now' and status in ('pending', 'running')`
    if (dup) return go("w-toku")
  }
  await db`insert into ws_commands (kind, payload, created_by) values (${kind}, ${db.json(payload)}, ${admin})`
  await audit(`most_${kind}`, admin, true, payload, h)
  return go("w-toku")
}
