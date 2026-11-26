import { NextResponse, type NextRequest } from "next/server"
import { BANNER_VERSION, POLICY_VERSION } from "@/lib/mf/config"
import { sql } from "@/lib/mf/db"
import { clientIp, rateLimited } from "@/lib/mf/server"

export const dynamic = "force-dynamic"

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
const ACTIONS = ["accept_all", "reject_all", "custom", "withdraw"]

// POST /api/consent: dziennik zgód cookies (tylko dopisywanie, idempotentny po eventId). Bez IP i fingerprintu.
export async function POST(request: NextRequest) {
  if (rateLimited(`consent:${clientIp(request.headers)}`, 30, 60_000)) return NextResponse.json({ ok: false }, { status: 429 })
  if (!process.env.DATABASE_URL) return NextResponse.json({ ok: false, stored: false }, { status: 202 })
  const b = await request.json().catch(() => null)
  if (!b || !UUID.test(b.eventId ?? "") || !UUID.test(b.consentId ?? "") || !ACTIONS.includes(b.action)) {
    return NextResponse.json({ error: "bad request" }, { status: 400 })
  }
  const path = typeof b.path === "string" ? b.path.split("?")[0].slice(0, 200) : null
  const lang = b.lang === "en" ? "en" : "pl"
  await sql()`
    insert into consent_events (event_id, consent_id, action, analytics, marketing, external, banner_version, policy_version, lang, source, path)
    values (${b.eventId}, ${b.consentId}, ${b.action}, ${b.analytics === true}, ${b.marketing === true}, ${b.external === true},
            ${BANNER_VERSION}, ${POLICY_VERSION}, ${lang}, ${b.source === "settings" ? "settings" : "banner"}, ${path})
    on conflict (event_id) do nothing`
  return NextResponse.json({ ok: true })
}
