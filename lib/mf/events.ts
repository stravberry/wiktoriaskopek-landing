import { sha256 } from "./core.ts"
import { sql } from "./db.ts"

// Własny dziennik zdarzeń lejka (00-PLAN 0e, audyt Ecom): bez ciasteczek i bez piksela, tylko po stronie serwera.
// Właściwości bez danych osobowych; zalogowani mają skrót e-maila, żeby liczyć próba → zakup.
export const CLIENT_EVENTS = ["landing_view", "buy_click", "quick_buy_opened", "consent_error_shown", "trial_click", "trial_upload_completed", "trial_render_started", "trial_render_completed", "trial_render_failed", "trial_preview_viewed", "trial_downloaded"] as const

export async function logEvent(event: string, props: Record<string, string | number | boolean | null> = {}, email?: string | null) {
  try {
    await sql()`insert into mf_events (event, props, email_hash) values (${event}, ${sql().json(props)}, ${email ? sha256(email.toLowerCase()) : null})`
  } catch (e) {
    console.error("[mf] event log failed:", event, e instanceof Error ? e.message : e)
  }
}

/** Właściwości z przeglądarki: tylko krótkie teksty z listy kluczy. */
export function cleanProps(raw: unknown) {
  const out: Record<string, string> = {}
  if (!raw || typeof raw !== "object") return out
  for (const k of ["placement", "offer", "device", "missing", "reason", "utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "ref"]) {
    const v = (raw as Record<string, unknown>)[k]
    if (typeof v === "string" && v.length > 0) out[k] = v.slice(0, 60).replace(/[^\p{L}\p{N}_.\-/ ]/gu, "")
  }
  return out
}
