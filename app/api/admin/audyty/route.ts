import { NextResponse, type NextRequest } from "next/server"
import { audit, csrfOk, currentAdmin } from "@/lib/admin/server"
import { sql } from "@/lib/mf/db"
import { origin } from "@/lib/mf/server"
import { AUDYT_TEXT, cleanAiText, type Report } from "@/lib/audyt/core"
import { rejectAudit, sendReport } from "@/lib/audyt/server"

export const dynamic = "force-dynamic"

// Akceptacja audytu przez admina: wyślij / zapisz poprawki / odrzuć. Sesja admina + CSRF + dziennik.
export async function POST(request: NextRequest) {
  const h = request.headers
  const admin = await currentAdmin()
  if (!admin || !csrfOk(h)) {
    await audit("audyt_denied", admin, false, {}, h)
    return NextResponse.json({ error: "forbidden" }, { status: 403 })
  }
  const f = await request.formData()
  const id = String(f.get("id") ?? "")
  const action = String(f.get("action") ?? "")
  if (!/^[0-9a-f-]{36}$/.test(id)) return NextResponse.redirect(`${origin()}/admin/audyty?s=blad`, 303)
  const back = (s: string) => NextResponse.redirect(`${origin()}/admin/audyty?id=${id}&s=${s}`, 303)
  if (action === "odrzuc") {
    const ok = await rejectAudit(id)
    await audit("audyt_odrzucony", admin, ok, { id }, h)
    return back(ok ? "odrzucony" : "blad")
  }
  const obserwacje: Report["obserwacje"] = []
  for (let i = 0; i < 3; i++) {
    const t = cleanAiText(f.get(`obs${i}`), 600)
    if (t) obserwacje.push({ tytul: cleanAiText(f.get(`tytul${i}`), 80), tekst: t })
  }
  const edited: Report = {
    ocena: cleanAiText(f.get("ocena"), 400),
    najlepsza: cleanAiText(f.get("najlepsza"), 400) || null,
    obserwacje,
    zadanie: cleanAiText(f.get("zadanie"), 400),
    uwaga: AUDYT_TEXT.notSeen,
  }
  if (!edited.ocena || !edited.zadanie || obserwacje.length === 0) return back("blad")
  if (action === "zapisz") {
    await sql()`update ws_audit_reports set report_edited = ${sql().json(edited as never)} where request_id = ${id}`
    await audit("audyt_poprawiony", admin, true, { id }, h)
    return back("zapisany")
  }
  if (action === "wyslij") {
    try {
      const ok = await sendReport(id, admin, edited)
      await audit("audyt_wyslany", admin, ok, { id }, h)
      return back(ok ? "wyslany" : "blad")
    } catch (e) {
      await audit("audyt_wyslany", admin, false, { id, error: e instanceof Error ? e.message : String(e) }, h)
      return back("blad")
    }
  }
  return back("blad")
}
