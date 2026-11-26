import postgres from "postgres"
import type { ClaimOutcome, MfStore } from "./core.ts"
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
      await db`
        update mf_orders set status = 'delivered', delivered_at = now(), lease_until = null
        where session_id = ${sessionId} and status = 'sending'`
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
export async function consumeLoginToken(db: postgres.Sql, tokenHash: string) {
  const [row] = await db`
    update mf_login_tokens set used_at = now()
    where token_hash = ${tokenHash} and used_at is null and expires_at > now()
    returning email`
  return (row?.email as string | undefined) ?? null
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
