import { NextResponse, type NextRequest } from "next/server"
import { licenseKeyFor, randomToken, sha256 } from "@/lib/mf/core"
import type { MfProductId } from "@/lib/mf/config"
import { sql, takeResendSlot } from "@/lib/mf/db"
import { githubForShop, mfEnv, origin, secret, sendAccessMail, stripe } from "@/lib/mf/server"

export const dynamic = "force-dynamic"

// POST /api/mf/resend {sessionId}: ponowna wysyłka maila z dostępem, max 3 na godzinę na zamówienie.
// Sesję sprawdzamy w Stripe (adres strony podziękowania można otworzyć bez płacenia).
export async function POST(request: NextRequest) {
  const { disabled } = mfEnv()
  if (disabled) return NextResponse.json({ error: "Niedostępne" }, { status: 503 })
  const body = await request.json().catch(() => ({}))
  const sessionId = typeof body.sessionId === "string" ? body.sessionId : ""
  if (!/^cs_(test|live)_[A-Za-z0-9]+$/.test(sessionId)) return NextResponse.json({ error: "Nieprawidłowe zamówienie" }, { status: 400 })

  let session
  try {
    session = await stripe().checkout.sessions.retrieve(sessionId)
  } catch {
    return NextResponse.json({ error: "Nieprawidłowe zamówienie" }, { status: 400 })
  }
  if (session.payment_status !== "paid") return NextResponse.json({ error: "Płatność nie jest potwierdzona" }, { status: 409 })

  const db = sql()
  const n = await takeResendSlot(db, sessionId)
  if (!n) return NextResponse.json({ error: "Limit: 3 wysyłki na godzinę. Spróbuj później." }, { status: 429 })
  const [o] = await db`select product, email, github_login, github_status, status from mf_orders where session_id = ${sessionId}`
  if (!o || o.status !== "delivered") return NextResponse.json({ error: "Zamówienie nie jest zrealizowane" }, { status: 409 })

  // Nowy jednorazowy token (stary mógł zostać zużyty).
  const token = randomToken()
  await db`
    insert into mf_login_tokens (token_hash, email, purpose, expires_at)
    values (${sha256(token)}, ${o.email}, 'purchase', now() + interval '72 hours')`
  try {
    await sendAccessMail(
      {
        sessionId, product: o.product as MfProductId, email: o.email, licenseKey: licenseKeyFor(sessionId, secret()),
        loginUrl: `${origin()}/api/mf/auth?token=${token}`, githubLogin: o.github_login,
        githubInvited: o.github_status === "invited", githubConfigured: githubForShop() !== null, serviceStart: session.metadata?.service_start_consent === "true",
      },
      `mf-access/${sessionId}/resend-${Date.now()}`,
    )
  } catch (e) {
    console.error("[mf] resend failed:", e instanceof Error ? e.message : e)
    return NextResponse.json({ error: "Nie udało się wysłać. Spróbuj za chwilę." }, { status: 502 })
  }
  return NextResponse.json({ ok: true })
}
