import { NextResponse, type NextRequest } from "next/server"
import { ADMIN_COOKIE } from "@/lib/admin/core"
import { audit, csrfOk, currentAdmin } from "@/lib/admin/server"
import { origin } from "@/lib/mf/server"

export const dynamic = "force-dynamic"

// POST /api/admin/logout: kasuje sesję (formularz z panelu, ten sam serwis).
export async function POST(request: NextRequest) {
  if (!csrfOk(request.headers)) return NextResponse.json({ error: "Nieprawidłowe żądanie." }, { status: 403 })
  await audit("logout", await currentAdmin(), true, {}, request.headers)
  const res = NextResponse.redirect(`${origin()}/admin/login?wylogowano=1`, 303)
  res.cookies.set(ADMIN_COOKIE, "", { path: "/", maxAge: 0 })
  return res
}
