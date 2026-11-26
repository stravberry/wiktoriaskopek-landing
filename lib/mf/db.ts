import postgres from "postgres"
import { sha256, type ClaimOutcome, type MfStore } from "./core.ts"
import type { MfProductId } from "./config.ts"

let client: postgres.Sql | null = null

/** Jedno połączenie na instancję funkcji. `prepare: false` dla poolerów w trybie transakcji (Supabase 6543). */
export function sql(url = process.env.DATABASE_URL) {
  if (!url) throw new Error("DATABASE_URL is missing")
  if (!client) client = postgres(url, { max: 3, prepare: false, idle_timeout: 20, connect_timeout: 10 })
  return client
}

export function pgStore(db: postgres.Sql): MfStore {
  return {
    async beginEvent(eventId, type) {
      await db`insert into mf_stripe_events (event_id, type) values (${eventId}, ${type}) on conflict (event_id) do nothing`
      const [row] = await db`select processed_at from mf_stripe_events where event_id = ${eventId}`
      return !row?.processed_at
    },
    async finishEvent(eventId, result) {
      await db`update mf_stripe_events set processed_at = now(), result = ${result} where event_id = ${eventId}`
    },
    async claim(sessionId, product, email) {
      const [row] = await db`select outcome from mf_claim_order(${sessionId}, ${product}, ${email}, ${120})`
      return (row?.outcome ?? "busy") as ClaimOutcome
    },
    async saveOrderDetails(sessionId, d) {
      await db`
        update mf_orders set
          payment_intent = ${d.paymentIntent}, amount_total = ${d.amountTotal}, currency = ${d.currency},
          customer_name = ${d.name}, tax_id = ${d.taxId}, consent_id = ${d.consentId},
          github_login = coalesce(github_login, ${d.githubLogin}),
          license_hash = ${d.licenseHash}, license_hint = ${d.licenseHint}, utm = ${db.json(d.utm)}
        where session_id = ${sessionId}`
    },
    async consentOk(consentId, sessionId) {
      const rows = await db`
        select 1 from mf_consents
        where id = ${consentId} and digital_consent = true and terms_accepted = true
          and (checkout_session_id is null or checkout_session_id = ${sessionId})`
      if (!rows.length) return false
      await db`update mf_consents set checkout_session_id = ${sessionId} where id = ${consentId} and checkout_session_id is null`
      return true
    },
    async storeLoginToken(tokenHash, email, ttlSeconds, purpose) {
      await db`
        insert into mf_login_tokens (token_hash, email, purpose, expires_at)
        values (${tokenHash}, ${email}, ${purpose}, now() + make_interval(secs => ${ttlSeconds}))
        on conflict (token_hash) do nothing`
    },
    async setGithubStatus(sessionId, status, error = null) {
      await db`update mf_orders set github_status = ${status}, github_error = ${error} where session_id = ${sessionId}`
    },
    async markDelivered(sessionId) {
      const done = await db`
        update mf_orders set status = 'delivered', delivered_at = now(), lease_until = null
        where session_id = ${sessionId} and status = 'sending' returning product, amount_total, email, utm`
      // Dziennik lejka (zakup): raz na zamówienie, bo zmiana statusu z „sending” zachodzi raz.
      if (done.length) {
        const o = done[0] as unknown as { product: string; amount_total: number | null; email: string; utm: Record<string, string> | null }
        // Zakup bez logowania po próbie: źródło i próbę bierzemy z zapisanej atrybucji tego e-maila (first-touch).
        const a = await getAttribution(db, o.email)
        const utm: Record<string, string> = { ...(a?.utm ?? {}), ...(o.utm ?? {}) }
        if (!utm.mf_trial_id && a?.trial_id) Object.assign(utm, { mf_trial_id: a.trial_id, mf_trial_at: new Date(a.trial_at ?? Date.now()).toISOString() })
        o.utm = utm
        await db`insert into mf_events (event, props, email_hash)
          values ('purchase_completed', ${db.json(purchaseProps(o))}, encode(sha256(convert_to(lower(${o.email}), 'UTF8')), 'hex'))`.catch(() => {})
      }
    },
    async markFailed(sessionId, error) {
      await db`
        update mf_orders set status = 'failed', last_error = ${error.slice(0, 500)}, lease_until = null
        where session_id = ${sessionId} and status = 'sending'`
    },
    async revokeByPaymentIntent(paymentIntent, status) {
      const [row] = await db`
        update mf_orders set status = ${status}, revoked_at = coalesce(revoked_at, now())
        where payment_intent = ${paymentIntent}
        returning session_id, github_login, github_status`
      if (!row) return null
      return { sessionId: row.session_id, githubLogin: row.github_status === "removed" ? null : row.github_login }
    },
  }
}

export type AccountOrder = {
  session_id: string
  product: MfProductId
  status: string
  github_login: string | null
  github_status: string
  github_error: string | null
  license_hint: string | null
  created_at: Date
}

export async function ordersForEmail(db: postgres.Sql, email: string) {
  return db<AccountOrder[]>`
    select session_id, product, status, github_login, github_status, github_error, license_hint, created_at
    from mf_orders where lower(email) = ${email.toLowerCase()} and status in ('delivered', 'refunded', 'disputed')
    order by created_at desc`
}

export async function hasActiveOrder(db: postgres.Sql, email: string) {
  const rows = await db`select 1 from mf_orders where lower(email) = ${email.toLowerCase()} and status = 'delivered' limit 1`
  return rows.length > 0
}

/** Jednorazowe zużycie tokenu: zwraca e-mail albo null (zły, wygasły, użyty). */
/** Jednorazowe zużycie tokenu: e-mail i cel ('login', 'trial', 'trial_m' = próba ze zgodą marketingową) albo null. */
export async function consumeLoginTokenFull(db: postgres.Sql, tokenHash: string) {
  const [row] = await db`
    update mf_login_tokens set used_at = now()
    where token_hash = ${tokenHash} and used_at is null and expires_at > now()
    returning email, purpose`
  return row ? { email: row.email as string, purpose: row.purpose as string } : null
}

export async function consumeLoginToken(db: postgres.Sql, tokenHash: string) {
  return (await consumeLoginTokenFull(db, tokenHash))?.email ?? null
}

/** Darmowa próba (funkcje Coding Buildera w schemacie public): otwiera albo odświeża próbę i zwraca nowy token do Edge Function. */
/** Źródło wejścia (first-touch): zapisuje UTM tylko wtedy, gdy dla tego e-maila jeszcze go nie ma. */
export async function saveAttribution(db: postgres.Sql, email: string, utm: Record<string, string>) {
  if (!Object.keys(utm).length) return
  await db`
    insert into mf_attribution (email_hash, utm) values (${sha256(email.toLowerCase())}, ${db.json(utm)})
    on conflict (email_hash) do update set utm = excluded.utm where mf_attribution.utm = '{}'::jsonb`.catch((e) => console.error("[mf] attribution:", e?.message))
}

/** Pierwsza próba dla e-maila: zapisujemy jej id i czas (do liczenia dni od próby do zakupu). */
export async function markAttributionTrial(db: postgres.Sql, email: string, trialId: string) {
  await db`
    insert into mf_attribution (email_hash, trial_id, trial_at) values (${sha256(email.toLowerCase())}, ${trialId}, now())
    on conflict (email_hash) do update set trial_id = excluded.trial_id, trial_at = excluded.trial_at where mf_attribution.trial_id is null`.catch((e) => console.error("[mf] attribution:", e?.message))
}

export async function getAttribution(db: postgres.Sql, email: string) {
  const [row] = await db`
    select utm, trial_id, trial_at from mf_attribution
    where email_hash = ${sha256(email.toLowerCase())} and created_at > now() - interval '14 months'`.catch(() => [])
  return (row ?? null) as null | { utm: Record<string, string>; trial_id: string | null; trial_at: Date | null }
}

/** Zdarzenie zakupu (audyt Ecom 2, pkt 4): oferta, kwota, UTM, id próby i liczba dni od próby. */
export function purchaseProps(o: { product: string; amount_total: number | null; utm?: Record<string, string> | null }, now = Date.now()) {
  const u = o.utm ?? {}
  const props: Record<string, string | number | null> = { offer: o.product, amount: o.amount_total }
  for (const k of ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"]) if (u[k]) props[k] = u[k].slice(0, 100)
  if (u.fbclid) props.fbclid = "1"
  if (u.mf_trial_id) {
    props.trial_id = u.mf_trial_id
    const t = Date.parse(u.mf_trial_at ?? "")
    if (!Number.isNaN(t)) props.days_since_trial = Math.max(0, Math.floor((now - t) / 86_400_000))
  }
  return props
}

export async function trialOpen(db: postgres.Sql, email: string, brand: unknown = null, marketing: boolean | null = null) {
  const [row] = await db`select * from mf_trial_open(${email}, ${brand === null ? null : db.json(brand as never)}, ${marketing})`
  return row as { trial_id: string; token: string; status: string }
}

export async function trialStatus(db: postgres.Sql, email: string) {
  const [row] = await db`select * from mf_trial_status(${email})`
  return (row ?? null) as null | { trial_id: string; status: string; stage: string | null; progress: number; error: string | null; expires_at: string | null; purged: boolean }
}

export async function recentLoginTokens(db: postgres.Sql, email: string) {
  const [row] = await db`
    select count(*)::int as n from mf_login_tokens
    where lower(email) = ${email.toLowerCase()} and purpose = 'login' and created_at > now() - interval '1 hour'`
  return row.n as number
}

/** Limit „wyślij ponownie”: 3 na godzinę na zamówienie. true = wolno. */
export async function takeResendSlot(db: postgres.Sql, sessionId: string) {
  const [row] = await db`
    update mf_orders set
      resend_count = case when resend_window_start is null or resend_window_start < now() - interval '1 hour' then 1 else resend_count + 1 end,
      resend_window_start = case when resend_window_start is null or resend_window_start < now() - interval '1 hour' then now() else resend_window_start end
    where session_id = ${sessionId} and status = 'delivered'
      and (resend_window_start is null or resend_window_start < now() - interval '1 hour' or resend_count < 3)
    returning resend_count`
  return row ? (row.resend_count as number) : 0
}
