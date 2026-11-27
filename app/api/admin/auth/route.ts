import { NextResponse, type NextRequest } from "next/server"
import { adminCookieName, isAdminEmail } from "@/lib/admin/core"
import { adminCookieOptions, adminCookieValue, adminVersion, audit, csrfOk, sha256 } from "@/lib/admin/server"
import { sql } from "@/lib/mf/db"
import { clientIp, origin, rateLimited } from "@/lib/mf/server"

export const dynamic = "force-dynamic"

const validToken = (t: string) => t.length >= 30 && t.length <= 100 && /^[A-Za-z0-9_-]+$/.test(t)

// GET /api/admin/auth?token=…: link z maila niczego nie zużywa (skanery poczty otwierają linki),
// tylko prowadzi na stronę z przyciskiem „Zaloguj się”.
export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token") ?? ""
  const to = validToken(token) ? `${origin()}/admin/login/potwierdz?token=${token}` : `${origin()}/admin/login?blad=link`
  const res = NextResponse.redirect(to, 303)
  res.headers.set("Referrer-Policy", "no-referrer")
  return res
}

// POST /api/admin/auth (formularz z /admin/login/potwierdz): zużywa link (raz, 15 min) i ustawia sesję admina.
export async function POST(request: NextRequest) {
  const fail = NextResponse.redirect(`${origin()}/admin/login?blad=link`, 303)
  if (rateLimited(`adm-auth:${clientIp(request.headers)}`, 10, 15 * 60_000)) return fail
  if (!csrfOk(request.headers)) return fail
  const form = await request.formData().catch(() => null)
  const token = String(form?.get("token") ?? "")
  if (!validToken(token)) return fail
  const [row] = await sql()`
    update adm_login_tokens set used_at = now()
    where token_hash = ${sha256(token)} and used_at is null and expires_at > now()
    returning email`
  const email = row?.email as string | undefined
  const version = email && isAdminEmail(email) ? await adminVersion(email) : null
  if (!email || version === null) {
    await audit("auth_denied", null, false, {}, request.headers)
    return fail
  }
  // Pozostałe niewykorzystane linki tego adresu przestają działać.
  await sql()`update adm_login_tokens set used_at = now() where email = ${email} and used_at is null`
  await audit("login_ok", email, true, {}, request.headers)
  const res = NextResponse.redirect(`${origin()}/admin`, 303)
  res.cookies.set(adminCookieName(), adminCookieValue(email, version), adminCookieOptions)
  return res
}
