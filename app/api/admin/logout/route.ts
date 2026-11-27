import { NextResponse, type NextRequest } from "next/server"
import { adminCookieName } from "@/lib/admin/core"
import { audit, csrfOk, currentAdmin } from "@/lib/admin/server"
import { sql } from "@/lib/mf/db"
import { origin } from "@/lib/mf/server"

export const dynamic = "force-dynamic"

// POST /api/admin/logout: podbija wersję sesji w bazie (unieważnia też skopiowane ciasteczka) i kasuje ciasteczko.
export async function POST(request: NextRequest) {
  if (!csrfOk(request.headers)) return NextResponse.json({ error: "Nieprawidłowe żądanie." }, { status: 403 })
  const email = await currentAdmin()
  if (email) await sql()`update adm_users set session_version = session_version + 1 where email = ${email}`
  await audit("logout", email, true, {}, request.headers)
  const res = NextResponse.redirect(`${origin()}/admin/login?wylogowano=1`, 303)
  res.cookies.set(adminCookieName(), "", { path: "/", maxAge: 0, httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax" })
  return res
}
