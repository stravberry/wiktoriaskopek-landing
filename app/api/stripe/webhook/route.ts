import { NextResponse, type NextRequest } from "next/server"
import { handleStripeEvent } from "@/lib/mf/core"
import { mfDeps, mfEnv, stripe } from "@/lib/mf/server"

export const dynamic = "force-dynamic"

// Stripe → zamówienie → klucz → dostęp GitHub → mail. Idempotentne po event.id i ID sesji.
// Zdarzenia: checkout.session.completed, checkout.session.async_payment_succeeded, charge.refunded, charge.dispute.created.
export async function POST(request: NextRequest) {
  const { disabled } = mfEnv()
  if (disabled) return NextResponse.json({ error: "disabled" }, { status: 503 })

  const signature = request.headers.get("stripe-signature")
  if (!signature) return NextResponse.json({ error: "missing signature" }, { status: 400 })
  const raw = await request.text() // podpis liczy się z surowego body

  let event
  try {
    event = stripe().webhooks.constructEvent(raw, signature, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch {
    return NextResponse.json({ error: "invalid signature" }, { status: 400 })
  }

  try {
    const result = await handleStripeEvent(event as any, mfDeps())
    if (result === "busy") return NextResponse.json({ result }, { status: 409 }) // Stripe ponowi
    return NextResponse.json({ result })
  } catch (e) {
    // Bez danych osobowych w logach: tylko typ zdarzenia i komunikat.
    console.error(`[mf] webhook ${event.type} ${event.id} failed:`, e instanceof Error ? e.message : e)
    return NextResponse.json({ error: "processing failed" }, { status: 500 })
  }
}
