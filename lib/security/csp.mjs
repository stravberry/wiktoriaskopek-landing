// Content-Security-Policy całej strony. Plik .mjs, bo czyta go też next.config.mjs.
// Decyzja Dayli (26.11.2026): najpierw Report-Only, po sprawdzeniu przełączenie na wymuszanie (CSP_ENFORCE).
// 'unsafe-inline' w script-src: Next wstawia skrypty inline (RSC), a nonce wymusiłby renderowanie dynamiczne każdej strony.
// Mimo to CSP blokuje obce skrypty, ramki, połączenia, <object>, zmianę <base>, osadzanie strony i wysyłkę formularzy poza Stripe.

const SUPABASE = "https://ousslupqwtmxgxahdotd.supabase.co" // próba: Edge Function, wgrywanie nagrania, odtwarzanie rolki
const BLOB = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com" // filmy strony głównej
const CAL = ["https://app.cal.com", "https://cal.com"] // kalendarz konsultacji (osadzony)
const YT_IMG = ["https://img.youtube.com", "https://i.ytimg.com"]
const TURNSTILE = "https://challenges.cloudflare.com" // anty-bot w formularzach (lib/turnstile.ts)

export function contentSecurityPolicy({ enforce = false } = {}) {
  const d = {
    "default-src": ["'self'"],
    "script-src": ["'self'", "'unsafe-inline'", ...CAL, "https://va.vercel-scripts.com", TURNSTILE],
    "style-src": ["'self'", "'unsafe-inline'"],
    "img-src": ["'self'", "data:", "blob:", BLOB, ...YT_IMG, ...CAL],
    "font-src": ["'self'", "data:"],
    "media-src": ["'self'", "blob:", BLOB, SUPABASE],
    "connect-src": ["'self'", SUPABASE, ...CAL, "https://vitals.vercel-insights.com"],
    "frame-src": [...CAL, TURNSTILE],
    "worker-src": ["'self'", "blob:"],
    "object-src": ["'none'"],
    "base-uri": ["'self'"],
    "form-action": ["'self'", "https://checkout.stripe.com"],
    "frame-ancestors": ["'none'"],
  }
  const parts = Object.entries(d).map(([k, v]) => `${k} ${v.join(" ")}`)
  if (enforce) parts.push("upgrade-insecure-requests")
  parts.push("report-uri /api/csp-report")
  return parts.join("; ")
}

export function cspHeader({ enforce = false } = {}) {
  return { key: enforce ? "Content-Security-Policy" : "Content-Security-Policy-Report-Only", value: contentSecurityPolicy({ enforce }) }
}
