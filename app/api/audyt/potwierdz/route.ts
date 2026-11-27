import { after, NextResponse, type NextRequest } from "next/server"
import { clientIp, origin, rateLimited } from "@/lib/mf/server"
import { confirmAudit, processOne } from "@/lib/audyt/server"

export const dynamic = "force-dynamic"
export const maxDuration = 60

// POST z przycisku „Potwierdzam” (formularz na /audyt/potwierdz). Po potwierdzeniu analiza rusza od razu (after).
export async function POST(request: NextRequest) {
  if (rateLimited(`audyt-ok:${clientIp(request.headers)}`, 10, 10 * 60_000)) return NextResponse.redirect(`${origin()}/audyt/gotowe?s=limit`, 303)
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
