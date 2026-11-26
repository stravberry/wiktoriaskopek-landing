// node --test: Content-Security-Policy (decyzja Dayli 26.11: najpierw Report-Only, potem wymuszanie).
import { test } from "node:test"
import assert from "node:assert/strict"
import { contentSecurityPolicy, cspHeader } from "../lib/security/csp.mjs"

const parse = (s) => Object.fromEntries(s.split(";").map((d) => d.trim()).filter(Boolean).map((d) => { const [k, ...v] = d.split(/\s+/); return [k, v] }))

test("CSP: twarde blokady (obiekty, base, osadzanie strony, formularze)", () => {
  const p = parse(contentSecurityPolicy())
  assert.deepEqual(p["object-src"], ["'none'"])
  assert.deepEqual(p["base-uri"], ["'self'"])
  assert.deepEqual(p["frame-ancestors"], ["'none'"])
  assert.deepEqual(p["form-action"], ["'self'", "https://checkout.stripe.com"])
  assert.deepEqual(p["default-src"], ["'self'"])
})

test("CSP: dopuszcza to, czego strona naprawdę używa (Supabase próby, wideo z Vercel Blob, Cal.com)", () => {
  const p = parse(contentSecurityPolicy())
  assert.ok(p["connect-src"].includes("https://ousslupqwtmxgxahdotd.supabase.co"))
  assert.ok(p["media-src"].includes("https://ousslupqwtmxgxahdotd.supabase.co"))
  assert.ok(p["media-src"].includes("https://hebbkx1anhila5yf.public.blob.vercel-storage.com"))
  assert.ok(p["script-src"].includes("https://app.cal.com"))
  assert.ok(p["frame-src"].includes("https://app.cal.com"))
  assert.ok(p["script-src"].includes("https://challenges.cloudflare.com") && p["frame-src"].includes("https://challenges.cloudflare.com"), "Turnstile")
  assert.ok(!p["script-src"].includes("'unsafe-eval'"), "bez unsafe-eval na produkcji")
})

test("CSP: tryb raportu ma report-uri i nie ma upgrade-insecure-requests (ignorowane w Report-Only)", () => {
  const h = cspHeader({ enforce: false })
  assert.equal(h.key, "Content-Security-Policy-Report-Only")
  const p = parse(h.value)
  assert.deepEqual(p["report-uri"], ["/api/csp-report"])
  assert.equal(p["upgrade-insecure-requests"], undefined)
})

test("CSP: tryb wymuszania ma właściwy nagłówek i upgrade-insecure-requests", () => {
  const h = cspHeader({ enforce: true })
  assert.equal(h.key, "Content-Security-Policy")
  assert.ok("upgrade-insecure-requests" in parse(h.value))
})
