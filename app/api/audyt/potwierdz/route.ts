import { after, NextResponse, type NextRequest } from "next/server"
import { clientIp, origin, rateLimited } from "@/lib/mf/server"
import { audytEnabled } from "@/lib/audyt/core"
import { confirmAudit, processOne } from "@/lib/audyt/server"

export const dynamic = "force-dynamic"
// Audyt v2 (rolki + Gemini) trwa do ok. 2 min; Fluid compute na planie Hobby pozwala do 300 s.
export const maxDuration = 300

// POST z przycisku „Potwierdzam” (formularz na /audyt/potwierdz). Po potwierdzeniu analiza rusza od razu (after).
export async function POST(request: NextRequest) {
  if (rateLimited(`audyt-ok:${clientIp(request.headers)}`, 10, 10 * 60_000)) return NextResponse.redirect(`${origin()}/audyt/gotowe?s=limit`, 303)
  // Audyt wyłączony: nie potwierdzamy i nie uruchamiamy analizy, zgłoszenie zostaje bez zmian.
  if (!audytEnabled()) return NextResponse.redirect(`${origin()}/audyt/gotowe?s=wylaczony`, 303)
  const form = await request.formData().catch(() => null)
  const id = await confirmAudit(String(form?.get("t") ?? ""))
  if (!id) return NextResponse.redirect(`${origin()}/audyt/gotowe?s=link`, 303)
  after(async () => {
    try {
      await processOne()
    } catch (e) {
      console.error("[audyt] after:", e instanceof Error ? e.message : e)
    }
  })
  return NextResponse.redirect(`${origin()}/audyt/gotowe?s=ok`, 303)
}
