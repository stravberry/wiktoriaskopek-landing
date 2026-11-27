import { NextResponse, type NextRequest } from "next/server"
import { sql } from "@/lib/mf/db"
import { clientIp, ipHash, origin, rateLimited } from "@/lib/mf/server"
import { AUDYT_TEXT } from "@/lib/audyt/core"
import { confirmNewsletter, verifyPorady } from "@/lib/audyt/server"

export const dynamic = "force-dynamic"

// Zapis na porady z linku w mailu audytu (adres już potwierdzony tym mailem), po kliknięciu „Zapisuję się” na stronie.
export async function POST(request: NextRequest) {
  if (rateLimited(`audyt-porady:${clientIp(request.headers)}`, 10, 10 * 60_000)) return NextResponse.redirect(`${origin()}/audyt/gotowe?s=limit`, 303)
  const f = await request.formData().catch(() => null)
  const r = String(f?.get("r") ?? ""), x = String(f?.get("x") ?? ""), s = String(f?.get("s") ?? "")
  if (!verifyPorady(r, x, s)) return NextResponse.redirect(`${origin()}/audyt/gotowe?s=link`, 303)
  const db = sql()
  const [req] = await db`select id, email, segment from ws_audit_requests where id = ${r} and email is not null`
  if (!req) return NextResponse.redirect(`${origin()}/audyt/gotowe?s=link`, 303)
  const [c] = await db`insert into ws_consents (email, kind, text_version, text_snapshot, request_id, ip_hash)
                       values (${req.email}, 'newsletter', ${AUDYT_TEXT.newsletterVersion}, ${AUDYT_TEXT.newsletter}, ${req.id}, ${ipHash(request.headers)}) returning id`
  await confirmNewsletter(req.email, req.id, req.segment, c.id)
  return NextResponse.redirect(`${origin()}/audyt/gotowe?s=porady`, 303)
}
