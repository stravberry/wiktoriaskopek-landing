import { NextResponse, type NextRequest } from "next/server"
import { verifyTurnstile } from "@/lib/turnstile"
import { parseUtm, testerAllowed } from "@/lib/mf/core"
import { clientIp, ipHash, rateLimited } from "@/lib/mf/server"
import { parseAuditInput } from "@/lib/audyt/core"
import { submitAudit } from "@/lib/audyt/server"

export const dynamic = "force-dynamic"

// POST /api/audyt: zgłoszenie darmowego audytu Instagrama. Audyt rusza dopiero po potwierdzeniu adresu.
export async function POST(request: NextRequest) {
  if (process.env.AUDYT_ENABLED === "0") return NextResponse.json({ error: "Audyty są chwilowo wstrzymane. Wróć za kilka godzin." }, { status: 503 })
  const h = request.headers
  if (rateLimited(`audyt:${clientIp(h)}`, 5, 10 * 60_000)) return NextResponse.json({ error: "Zbyt wiele prób. Spróbuj za kilka minut." }, { status: 429 })
  const body = await request.json().catch(() => null)
  const parsed = parseAuditInput(body)
  if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: 400 })
  const ts = await verifyTurnstile((body as { turnstileToken?: unknown }).turnstileToken, clientIp(h))
  if (!ts.ok) return NextResponse.json({ error: ts.error }, { status: ts.status })
  const res = await submitAudit(parsed.input, {
    ipHash: ipHash(h),
    utm: parseUtm((body as { utm?: unknown }).utm),
    tester: testerAllowed(parsed.input.email, process.env),
  })
  if (!res.ok) return NextResponse.json({ error: res.error }, { status: res.status })
  return NextResponse.json({ ok: true })
}
