import { NextResponse } from "next/server"
import { hasActiveOrder, sql, trialOpen, trialStatus } from "@/lib/mf/db"
import { currentBuyer, mfEnv } from "@/lib/mf/server"

export const dynamic = "force-dynamic"

// GET /api/mf/trial/session: dla zalogowanego świeży token próby do Edge Function (rotowany przy każdym wywołaniu) i stan.
export async function GET() {
  if (mfEnv().disabled || process.env.MF_TRIAL_ENABLED !== "1") return NextResponse.json({ error: "Próba jest chwilowo niedostępna." }, { status: 503 })
  const email = await currentBuyer()
  if (!email) return NextResponse.json({ error: "Zaloguj się linkiem z maila." }, { status: 401 })
  const db = sql()
  try {
    const t = await trialOpen(db, email)
    const st = await trialStatus(db, email)
    return NextResponse.json(
      { trialId: t.trial_id, token: t.token, status: t.status, expiresAt: st?.expires_at ?? null, hasOrder: await hasActiveOrder(db, email) },
      { headers: { "Cache-Control": "no-store" } },
    )
  } catch (e) {
    const m = e instanceof Error ? e.message : ""
    if (m.includes("mf_trial_daily_cap")) return NextResponse.json({ error: "Dzisiejszy limit prób się wyczerpał. Wróć jutro." }, { status: 429 })
    console.error("[mf] trial session failed:", m)
    return NextResponse.json({ error: "Próba jest chwilowo niedostępna." }, { status: 503 })
  }
}
