import { NextResponse, type NextRequest } from "next/server"
import { verifyTurnstile } from "@/lib/turnstile"
import { normalizedEmail, parseUtm, randomToken, sha256, testerAllowed } from "@/lib/mf/core"
import { saveAttribution, sql } from "@/lib/mf/db"
import { logEvent } from "@/lib/mf/events"
import { clientIp, mfEnv, origin, rateLimited, sendLoginMail } from "@/lib/mf/server"
import { isDisposable } from "@/lib/mf/trial"
import { MF_TTL } from "@/lib/mf/config"

export const dynamic = "force-dynamic"

// POST /api/mf/trial/start {email, marketing}: link do próby (magic link, to samo konto co sklep). Zawsze ta sama odpowiedź.
export async function POST(request: NextRequest) {
  if (mfEnv().disabled || process.env.MF_TRIAL_ENABLED !== "1") return NextResponse.json({ error: "Próba jest chwilowo niedostępna." }, { status: 503 })
  if (rateLimited(`trial:${clientIp(request.headers)}`, 5, 10 * 60_000)) return NextResponse.json({ error: "Zbyt wiele prób. Spróbuj za kilka minut." }, { status: 429 })
  const body = await request.json().catch(() => ({}))
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : ""
  if (!/^[^\s@]{1,64}@[^\s@]{1,255}\.[^\s@]{2,}$/.test(email)) return NextResponse.json({ error: "Podaj prawidłowy adres e-mail." }, { status: 400 })
  if (isDisposable(email)) return NextResponse.json({ error: "Podaj swój stały adres e-mail, nie jednorazowy." }, { status: 400 })
  const ts = await verifyTurnstile(body.turnstileToken, clientIp(request.headers))
  if (!ts.ok) return NextResponse.json({ error: ts.error }, { status: ts.status })

  const db = sql()
  // S5 (przegląd 26.11): limity liczone w bazie na adresie bez +aliasu (i bez kropek w Gmailu) oraz globalnie.
  const norm = normalizedEmail(email)
  const [lim] = await db`
    select count(*) filter (where (case when split_part(lower(email),'@',2) in ('gmail.com','googlemail.com') then replace(split_part(split_part(lower(email),'@',1),'+',1),'.','') || '@gmail.com' else split_part(split_part(lower(email),'@',1),'+',1) || '@' || split_part(lower(email),'@',2) end) = ${norm} and created_at > now() - interval '1 hour')::int as addr,
           count(*) filter (where purpose like 'trial%' and created_at > now() - interval '1 hour')::int as total,
           count(*) filter (where purpose like 'trial%' and lower(email) <> ${email} and (case when split_part(lower(email),'@',2) in ('gmail.com','googlemail.com') then replace(split_part(split_part(lower(email),'@',1),'+',1),'.','') || '@gmail.com' else split_part(split_part(lower(email),'@',1),'+',1) || '@' || split_part(lower(email),'@',2) end) = ${norm} and created_at > now() - interval '30 days')::int as alias
    from mf_login_tokens where created_at > now() - interval '30 days'`
  if (lim.total >= 60) return NextResponse.json({ error: "Dużo zgłoszeń do próby. Spróbuj za godzinę." }, { status: 429 })
  if (lim.alias > 0 && !testerAllowed(email, process.env)) {
    return NextResponse.json({ error: "Na ten adres (albo jego wersję z +) próba już była. Zaloguj się nim, żeby zobaczyć wynik." }, { status: 400 })
  }
  if (lim.addr < 5) {
    const token = randomToken()
    await db`
      insert into mf_login_tokens (token_hash, email, purpose, expires_at)
      values (${sha256(token)}, ${email}, ${body.marketing === true ? "trial_m" : "trial"}, now() + make_interval(secs => ${MF_TTL.loginToken}))`
    try {
      await sendLoginMail(email, `${origin()}/api/mf/auth?token=${token}`, true)
    } catch (e) {
      console.error("[mf] trial mail failed:", e instanceof Error ? e.message : e)
      return NextResponse.json({ error: "Nie udało się wysłać maila. Spróbuj ponownie." }, { status: 502 })
    }
    const utm = parseUtm(body.utm)
    await saveAttribution(db, email, utm)
    await logEvent("trial_signup_requested", { marketing: body.marketing === true, utm_source: utm.utm_source ?? null, utm_campaign: utm.utm_campaign ?? null })
  }
  return NextResponse.json({ ok: true })
}
