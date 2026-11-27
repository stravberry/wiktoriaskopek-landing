import { NextResponse, type NextRequest } from "next/server"
import { ADMIN_COOKIE, isAdminEmail } from "@/lib/admin/core"
import { adminCookieOptions, adminCookieValue, audit, sha256 } from "@/lib/admin/server"
import { sql } from "@/lib/mf/db"
import { origin } from "@/lib/mf/server"

export const dynamic = "force-dynamic"

// GET /api/admin/auth?token=…: zużywa link (raz, 15 min) i ustawia sesję admina (httpOnly, 8 h).
export async function GET(request: NextRequest) {
  const fail = NextResponse.redirect(`${origin()}/admin/login?blad=link`)
  const token = request.nextUrl.searchParams.get("token") ?? ""
  if (token.length < 30 || token.length > 100) return fail
  const [row] = await sql()`
    update adm_login_tokens set used_at = now()
    where token_hash = ${sha256(token)} and used_at is null and expires_at > now()
    returning email`
  if (!row || !isAdminEmail(row.email as string)) {
    await audit("auth_denied", null, false, {}, request.headers)
    return fail
  }
  await audit("login_ok", row.email as string, true, {}, request.headers)
  const res = NextResponse.redirect(`${origin()}/admin`)
  res.cookies.set(ADMIN_COOKIE, adminCookieValue(row.email as string), adminCookieOptions)
  res.headers.set("Referrer-Policy", "no-referrer")
  return res
}
