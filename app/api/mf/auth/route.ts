import { NextResponse, type NextRequest } from "next/server"
import { MF_BASE_PATH } from "@/lib/mf/config"
import { sha256 } from "@/lib/mf/core"
import { consumeLoginTokenFull, sql, trialOpen } from "@/lib/mf/db"
import { logEvent } from "@/lib/mf/events"
import { mfEnv, origin, SESSION_COOKIE, sessionCookieOptions, sessionCookieValue } from "@/lib/mf/server"

export const dynamic = "force-dynamic"

// GET /api/mf/auth?token=…: zużywa token (raz) i ustawia ciasteczko sesji httpOnly.
// Token próby (purpose trial / trial_m) zakłada próbę po potwierdzeniu adresu i prowadzi na stronę próby.
export async function GET(request: NextRequest) {
  const { disabled } = mfEnv()
  const account = `${origin()}${MF_BASE_PATH}/konto`
  if (disabled) return NextResponse.redirect(`${account}?blad=niedostepne`)
  const token = request.nextUrl.searchParams.get("token") ?? ""
  if (token.length < 20 || token.length > 100) return NextResponse.redirect(`${account}?blad=link`)

  const t = await consumeLoginTokenFull(sql(), sha256(token))
  if (!t) return NextResponse.redirect(`${account}?blad=link`)

  let to = account
  if (t.purpose.startsWith("trial")) {
    to = `${origin()}${MF_BASE_PATH}/proba`
    if (t.purpose !== "trial_ready") {
      try {
        // null = nie zmieniaj zapisanej zgody marketingowej (tylko trial_m ją ustawia).
        await trialOpen(sql(), t.email, null, t.purpose === "trial_m" ? true : null)
      } catch (e) {
        console.error("[mf] trial open on verify failed:", e instanceof Error ? e.message : e)
      }
      await logEvent("trial_signup_verified", { marketing: t.purpose === "trial_m" }, t.email)
    }
  }
  const res = NextResponse.redirect(to)
  res.cookies.set(SESSION_COOKIE, sessionCookieValue(t.email), sessionCookieOptions)
  return res
}
