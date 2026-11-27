import { NextResponse, type NextRequest } from "next/server"
import { clientIp, rateLimited } from "@/lib/mf/server"
import { audytEnabled, parseHandle } from "@/lib/audyt/core"
import { businessDiscovery, metaConfigured } from "@/lib/audyt/meta"
import { TEST_HANDLES } from "@/lib/audyt/fixtures"

export const dynamic = "force-dynamic"

// GET /api/audyt/profil?u=nazwa: czy profil jest firmowy lub twórcy (Business Discovery). Nic nie zapisujemy.
// „nieznany” = bez aplikacji Meta albo chwilowy błąd: formularz działa dalej, a profil sprawdzimy przy analizie.
export async function GET(request: NextRequest) {
  if (!audytEnabled()) return NextResponse.json({ status: "wylaczony" }, { status: 503 })
  if (rateLimited(`audyt-profil:${clientIp(request.headers)}`, 20, 10 * 60_000)) return NextResponse.json({ status: "nieznany" }, { status: 429 })
  const handle = parseHandle(request.nextUrl.searchParams.get("u"))
  if (!handle) return NextResponse.json({ status: "zla_nazwa" }, { status: 400 })
  if ((TEST_HANDLES as readonly string[]).includes(handle)) return NextResponse.json({ status: "ok", username: handle, followers: null, test: true })
  if (!metaConfigured(process.env)) return NextResponse.json({ status: "nieznany" })
  const d = await businessDiscovery(handle)
  if (d.ok) {
    const reels = d.profile.media.filter((m) => m.media_product_type === "REELS").length
    return NextResponse.json({ status: reels >= 3 ? "ok" : "malo_rolek", username: d.profile.username, followers: d.profile.followers_count })
  }
  return NextResponse.json({ status: d.reason === "nie_znaleziono" ? "nie_znaleziono" : "nieznany" })
}
