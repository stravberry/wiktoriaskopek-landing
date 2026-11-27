import { after, NextResponse, type NextRequest } from "next/server"
import { ADMIN_TOKEN_SECONDS, isAdminEmail, validEmail } from "@/lib/admin/core"
import { audit, csrfOk, hasAdminRole, ipHashOf, newToken, sendAdminLoginMail, sha256 } from "@/lib/admin/server"
import { sql } from "@/lib/mf/db"
import { clientIp, origin, rateLimited } from "@/lib/mf/server"

export const dynamic = "force-dynamic"

const SAME = { ok: true, message: "Jeśli ten adres ma dostęp do panelu, wysłaliśmy na niego link do logowania." }

// POST /api/admin/login {email}: zawsze ta sama, szybka odpowiedź. Sprawdzenie listy, limity, zapis linku i mail
// dzieją się po odpowiedzi (after), więc czas odpowiedzi nie zdradza, który adres ma dostęp.
export async function POST(request: NextRequest) {
  const h = request.headers
  if (rateLimited(`adm-login:${clientIp(h)}`, 5, 15 * 60_000)) {
    return NextResponse.json({ error: "Zbyt wiele prób. Spróbuj za kilkanaście minut." }, { status: 429 })
  }
  if (!csrfOk(h)) {
    await audit("login_csrf_blocked", null, false, {}, h)
    return NextResponse.json({ error: "Nieprawidłowe żądanie." }, { status: 403 })
  }
  const body = await request.json().catch(() => ({}))
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : ""
  if (!validEmail(email)) return NextResponse.json({ error: "Podaj prawidłowy adres e-mail" }, { status: 400 })
  const ip = ipHashOf(h)
  after(() => issueLink(email, ip, h))
  return NextResponse.json(SAME)
}

async function issueLink(email: string, ip: string, h: Headers) {
  if (!isAdminEmail(email) || !(await hasAdminRole(email))) {
    await audit("login_denied", null, false, { reason: "not_allowlisted" }, h)
    return
  }
  // Limit w jednej transakcji z blokadą (bez wyścigu): 5 linków/h na adres i IP, 30/h łącznie.
  const token = newToken()
  const issued = await sql().begin(async (tx) => {
    await tx`select pg_advisory_xact_lock(hashtext('adm-login'))`
    const [{ mine, total }] = await tx`
      select count(*) filter (where email = ${email} and ip_hash = ${ip})::int as mine, count(*)::int as total
      from adm_login_tokens where created_at > now() - interval '1 hour'`
    if (mine >= 5 || total >= 30) return false
    await tx`delete from adm_login_tokens where expires_at < now() - interval '1 day'`
    await tx`insert into adm_login_tokens (token_hash, email, ip_hash, expires_at)
             values (${sha256(token)}, ${email}, ${ip}, now() + make_interval(secs => ${ADMIN_TOKEN_SECONDS}))`
    return true
  })
  if (!issued) return audit("login_rate_limited", email, false, {}, h)
  try {
    await sendAdminLoginMail(email, `${origin()}/api/admin/auth?token=${token}`)
    await audit("login_link_sent", email, true, {}, h)
  } catch (e) {
    await audit("login_mail_failed", email, false, { error: e instanceof Error ? e.message : String(e) }, h)
  }
}
