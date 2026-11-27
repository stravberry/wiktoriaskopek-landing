import { NextResponse, type NextRequest } from "next/server"
import { sql } from "@/lib/mf/db"
import { metaConfigured } from "@/lib/audyt/meta"
import { audytEnabled } from "@/lib/audyt/core"
import { cronAllowed, notifyPendingReviews, processOne, retention } from "@/lib/audyt/server"
import { runSequence } from "@/lib/audyt/sequence"

export const dynamic = "force-dynamic"
// Audyt v2 (rolki + Gemini) trwa do ok. 2 min; Fluid compute na planie Hobby pozwala do 300 s.
export const maxDuration = 300

// Wywołuje pg_cron (Supabase) co 10 minut: kolejka audytów (do 3), sekwencja porad, retencja.
export async function POST(request: NextRequest) {
  if (!(await cronAllowed(request.headers.get("x-cron-key")))) return NextResponse.json({ error: "forbidden" }, { status: 403 })
  const t0 = Date.now()
  if (metaConfigured(process.env)) await sql()`update ws_audit_requests set note = null where status = 'potwierdzony' and note = 'czeka_na_meta'`
  const audits: string[] = []
  for (let i = 0; i < 3 && Date.now() - t0 < 35_000; i++) {
    const o = await processOne()
    audits.push(o)
    if (o === "pusto" || o === "czeka_na_meta" || o === "wylaczony") break
  }
  const przeglad = audytEnabled() ? await notifyPendingReviews() : 0
  // Audyt wyłączony: porady też stoją (limit 0), żeby nic nie wyszło do osób ze zgłoszeń. Retencja działa zawsze (polityka, sekcja 8).
  const seq = await runSequence(audytEnabled() && Date.now() - t0 < 45_000 ? 10 : 0)
  const ret = await retention()
  return NextResponse.json({ audits, przeglad, seq, ret, ms: Date.now() - t0 })
}
