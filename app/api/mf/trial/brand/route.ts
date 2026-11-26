import { NextResponse, type NextRequest } from "next/server"
import { sql, trialOpen } from "@/lib/mf/db"
import { logEvent } from "@/lib/mf/events"
import { currentBuyer, mfEnv, rateLimited } from "@/lib/mf/server"
import { parseTrialBrand } from "@/lib/mf/trial"

export const dynamic = "force-dynamic"

// POST /api/mf/trial/brand {brand}: zapis kreatora marki w próbie (dopóki rolka nie powstała). Zwraca nowy token.
export async function POST(request: NextRequest) {
  if (mfEnv().disabled || process.env.MF_TRIAL_ENABLED !== "1") return NextResponse.json({ error: "Próba jest chwilowo niedostępna." }, { status: 503 })
  const email = await currentBuyer()
  if (!email) return NextResponse.json({ error: "Zaloguj się linkiem z maila." }, { status: 401 })
  if (rateLimited(`trial-brand:${email}`, 20, 60 * 60_000)) return NextResponse.json({ error: "Zbyt wiele zmian. Spróbuj za chwilę." }, { status: 429 })
  const brand = parseTrialBrand((await request.json().catch(() => ({}))).brand)
  if (!brand) return NextResponse.json({ error: "Uzupełnij nazwę marki, styl, font i kolory." }, { status: 400 })
  try {
    const t = await trialOpen(sql(), email, brand)
    await logEvent("trial_brand_completed", { style: brand.style }, email)
    return NextResponse.json({ trialId: t.trial_id, token: t.token, status: t.status }, { headers: { "Cache-Control": "no-store" } })
  } catch (e) {
    console.error("[mf] trial brand failed:", e instanceof Error ? e.message : e)
    return NextResponse.json({ error: "Nie udało się zapisać marki. Spróbuj ponownie." }, { status: 503 })
  }
}
