import { NextResponse } from "next/server"
import { MF_BASE_PATH } from "@/lib/mf/config"
import { hasActiveOrder, sql } from "@/lib/mf/db"
import { currentBuyer, githubForShop, mfEnv, origin, rateLimited } from "@/lib/mf/server"

export const dynamic = "force-dynamic"

// GET /api/mf/download: tylko dla zalogowanego z aktywnym zakupem → tymczasowy link GitHuba do ZIP (nie zapisujemy go).
// Limit: 10 pobrań na dobę na kupującego (w pamięci instancji).
export async function GET() {
  const { disabled } = mfEnv()
  if (disabled) return new NextResponse("Niedostępne", { status: 503 })
  const email = await currentBuyer()
  if (!email) return NextResponse.redirect(`${origin()}${MF_BASE_PATH}/konto`)
  if (!(await hasActiveOrder(sql(), email))) return new NextResponse("Brak aktywnego zakupu", { status: 403 })
  if (rateLimited(`download:${email}`, 10, 24 * 60 * 60_000)) return new NextResponse("Limit pobrań na dziś", { status: 429 })
  const gh = githubForShop()
  if (!gh) return new NextResponse("Pobieranie jest chwilowo wyłączone", { status: 503 })
  try {
    const url = await gh.zipUrl()
    return NextResponse.redirect(url, { status: 302, headers: { "Cache-Control": "no-store" } })
  } catch (e) {
    console.error("[mf] zip failed:", e instanceof Error ? e.message : e)
    return new NextResponse("Nie udało się przygotować pliku. Spróbuj za chwilę.", { status: 502 })
  }
}
