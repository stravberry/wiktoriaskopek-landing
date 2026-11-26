import { NextResponse, type NextRequest } from "next/server"
import { MF_BASE_PATH } from "@/lib/mf/config"
import { sha256 } from "@/lib/mf/core"
import { consumeLoginToken, sql } from "@/lib/mf/db"
import { mfEnv, origin, SESSION_COOKIE, sessionCookieOptions, sessionCookieValue } from "@/lib/mf/server"

export const dynamic = "force-dynamic"

// GET /api/mf/auth?token=…: zużywa token (raz) i ustawia ciasteczko sesji httpOnly.
export async function GET(request: NextRequest) {
  const { disabled } = mfEnv()
  const account = `${origin()}${MF_BASE_PATH}/konto`
  if (disabled) return NextResponse.redirect(`${account}?blad=niedostepne`)
  const token = request.nextUrl.searchParams.get("token") ?? ""
  if (token.length < 20 || token.length > 100) return NextResponse.redirect(`${account}?blad=link`)

  const email = await consumeLoginToken(sql(), sha256(token))
  if (!email) return NextResponse.redirect(`${account}?blad=link`)

  const res = NextResponse.redirect(account)
  res.cookies.set(SESSION_COOKIE, sessionCookieValue(email), sessionCookieOptions)
  return res
}
