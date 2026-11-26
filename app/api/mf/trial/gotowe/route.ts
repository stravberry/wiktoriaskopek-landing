import { NextResponse, type NextRequest } from "next/server"
import { randomToken, sha256 } from "@/lib/mf/core"
import { sql } from "@/lib/mf/db"
import { mfEnv, origin, sendTrialReadyMail } from "@/lib/mf/server"

export const dynamic = "force-dynamic"

// POST /api/mf/trial/gotowe {trialId}: sygnał od workera Coding Buildera po końcu montażu (done albo failed).
// Bez sekretu: niczemu nie ufamy z treści, sprawdzamy stan w bazie i wysyłamy mail najwyżej raz (notified_at).
export async function POST(request: NextRequest) {
  if (mfEnv().disabled || process.env.MF_TRIAL_MAIL !== "1") return new NextResponse(null, { status: 204 })
  const body = await request.json().catch(() => ({}))
  const id = typeof body.trialId === "string" && /^[0-9a-f-]{36}$/.test(body.trialId) ? body.trialId : null
  if (!id) return NextResponse.json({ error: "trialId" }, { status: 400 })
  const db = sql()
  const [t] = await db`
    update mf_trials set notified_at = now()
    where id = ${id} and status in ('done', 'failed') and notified_at is null
    returning email, status, expires_at`
  if (!t) return new NextResponse(null, { status: 204 })
  const token = randomToken()
  const expires = t.expires_at ? new Date(t.expires_at as string) : new Date(Date.now() + 7 * 864e5)
  await db`insert into mf_login_tokens (token_hash, email, purpose, expires_at) values (${sha256(token)}, ${t.email}, 'trial_ready', ${expires})`
  try {
    await sendTrialReadyMail(t.email as string, `${origin()}/api/mf/auth?token=${token}`, t.status === "done", t.expires_at ? expires.toLocaleDateString("pl-PL", { day: "numeric", month: "long" }) : null)
  } catch (e) {
    console.error("[mf] trial ready mail failed:", e instanceof Error ? e.message : e)
    await db`update mf_trials set notified_at = null where id = ${id}` // pozwól ponowić
    return NextResponse.json({ error: "mail" }, { status: 502 })
  }
  return NextResponse.json({ ok: true })
}
