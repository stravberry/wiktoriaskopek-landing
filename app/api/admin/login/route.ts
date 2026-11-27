import { NextResponse, type NextRequest } from "next/server"
import { ADMIN_TOKEN_SECONDS, isAdminEmail, validEmail } from "@/lib/admin/core"
import { audit, csrfOk, ipHashOf, newToken, sendAdminLoginMail, sha256 } from "@/lib/admin/server"
import { sql } from "@/lib/mf/db"
import { clientIp, origin, rateLimited } from "@/lib/mf/server"

export const dynamic = "force-dynamic"

const SAME = { ok: true, message: "Jeśli ten adres ma dostęp do panelu, wysłaliśmy na niego link do logowania." }

// POST /api/admin/login {email}: link jednorazowy (15 min) tylko dla allowlisty. Odpowiedź zawsze ta sama.
export async function POST(request: NextRequest) {
  const h = request.headers
  if (!csrfOk(h)) {
    await audit("login_csrf_blocked", null, false, {}, h)
    return NextResponse.json({ error: "Nieprawidłowe żądanie." }, { status: 403 })
  }
  if (rateLimited(`adm-login:${clientIp(h)}`, 5, 15 * 60_000)) {
    return NextResponse.json({ error: "Zbyt wiele prób. Spróbuj za kilkanaście minut." }, { status: 429 })
  }
  const body = await request.json().catch(() => ({}))
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : ""
  if (!validEmail(email)) return NextResponse.json({ error: "Podaj prawidłowy adres e-mail" }, { status: 400 })

  const db = sql()
  if (!isAdminEmail(email)) {
    await audit("login_denied", null, false, { reason: "not_allowlisted" }, h)
    return NextResponse.json(SAME)
  }
  // Limit w bazie (działa między instancjami): najwyżej 5 linków na godzinę.
  const [{ n }] = await db`select count(*)::int as n from adm_login_tokens where email = ${email} and created_at > now() - interval '1 hour'`
  if (n >= 5) {
    await audit("login_rate_limited", email, false, {}, h)
    return NextResponse.json(SAME)
  }
  await db`delete from adm_login_tokens where expires_at < now() - interval '1 day'`
  const token = newToken()
  await db`insert into adm_login_tokens (token_hash, email, ip_hash, expires_at)
           values (${sha256(token)}, ${email}, ${ipHashOf(h)}, now() + make_interval(secs => ${ADMIN_TOKEN_SECONDS}))`
  try {
    await sendAdminLoginMail(email, `${origin()}/api/admin/auth?token=${token}`)
  } catch (e) {
    await audit("login_mail_failed", email, false, { error: e instanceof Error ? e.message : String(e) }, h)
    return NextResponse.json({ error: "Nie udało się wysłać maila. Spróbuj ponownie." }, { status: 502 })
  }
  await audit("login_link_sent", email, true, {}, h)
  return NextResponse.json(SAME)
}
