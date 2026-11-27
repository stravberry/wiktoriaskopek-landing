import { NextResponse, type NextRequest } from "next/server"
import { sql } from "@/lib/mf/db"
import { metaConfigured } from "@/lib/audyt/meta"
import { cronAllowed, processOne, retention } from "@/lib/audyt/server"
import { runSequence } from "@/lib/audyt/sequence"

export const dynamic = "force-dynamic"
export const maxDuration = 60

// Wywołuje pg_cron (Supabase) co 10 minut: kolejka audytów (do 3), sekwencja porad, retencja.
export async function POST(request: NextRequest) {
  if (!(await cronAllowed(request.headers.get("x-cron-key")))) return NextResponse.json({ error: "forbidden" }, { status: 403 })
  const t0 = Date.now()
  if (metaConfigured(process.env)) await sql()`update ws_audit_requests set note = null where status = 'potwierdzony' and note = 'czeka_na_meta'`
  const audits: string[] = []
  for (let i = 0; i < 3 && Date.now() - t0 < 35_000; i++) {
    const o = await processOne()
    audits.push(o)
    if (o === "pusto" || o === "czeka_na_meta") break
  }
  const seq = await runSequence(Date.now() - t0 < 45_000 ? 10 : 0)
  const ret = await retention()
  return NextResponse.json({ audits, seq, ret, ms: Date.now() - t0 })
}
