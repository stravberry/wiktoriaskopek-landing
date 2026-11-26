import { NextResponse, type NextRequest } from "next/server"
import { CLIENT_EVENTS, cleanProps, logEvent } from "@/lib/mf/events"
import { sql } from "@/lib/mf/db"
import { clientIp, currentBuyer, mfEnv, rateLimited } from "@/lib/mf/server"

export const dynamic = "force-dynamic"

// POST /api/mf/event {event, props}: zdarzenia z przeglądarki (kliknięcia „Kup”, okienko zakupu). Bez identyfikatora urządzenia.
export async function POST(request: NextRequest) {
  if (mfEnv().disabled) return new NextResponse(null, { status: 204 })
  if (rateLimited(`event:${clientIp(request.headers)}`, 60, 60_000)) return new NextResponse(null, { status: 429 })
  const body = await request.json().catch(() => ({}))
  if (!CLIENT_EVENTS.includes(body?.event)) return NextResponse.json({ error: "unknown event" }, { status: 400 })
  await logEvent(body.event, cleanProps(body.props), await currentBuyer())
  if (Math.random() < 0.01) await sql()`delete from mf_events where ts < now() - interval '14 months'`.catch(() => {}) // retencja z polityki prywatności
  return new NextResponse(null, { status: 204 })
}
