// node --test: logika sklepu MontageFrames bez sieci i kluczy.
import { test } from "node:test"
import assert from "node:assert/strict"
import {
  parseCheckoutInput, checkoutParams, licenseKeyFor, createSessionCookie, verifySessionCookie,
  handleStripeEvent, mfDisabledReason, InputError, GITHUB_LOGIN_RE,
} from "../lib/mf/core.ts"

const SECRET = "x".repeat(40)
const okBody = { product: "paczka", terms: true, digital: true, email: "Ala@Example.com", githubLogin: "@ala-dev" }

test("zgody: bez regulaminu albo zgody na natychmiastową dostawę → błąd (API 400)", () => {
  assert.throws(() => parseCheckoutInput({ ...okBody, terms: false }), InputError)
  assert.throws(() => parseCheckoutInput({ ...okBody, digital: undefined }), InputError)
  assert.throws(() => parseCheckoutInput({ ...okBody, digital: "true" }), InputError) // tylko prawdziwe true
  assert.throws(() => parseCheckoutInput({ ...okBody, product: "inne" }), InputError)
  const ok = parseCheckoutInput(okBody)
  assert.equal(ok.email, "ala@example.com")
  assert.equal(ok.githubLogin, "ala-dev")
  assert.equal(ok.serviceStart, false)
  assert.equal(parseCheckoutInput({ ...okBody, product: "konsultacja", serviceStart: true }).serviceStart, true)
  assert.equal(parseCheckoutInput({ ...okBody, serviceStart: true }).serviceStart, false) // tylko dla konsultacji
})

test("login GitHub: walidacja", () => {
  for (const ok of ["a", "ala-dev", "A1b2"]) assert.ok(GITHUB_LOGIN_RE.test(ok), ok)
  for (const bad of ["-ala", "ala-", "a--b", "a b", "x".repeat(40), "ala/../x"]) assert.ok(!GITHUB_LOGIN_RE.test(bad), bad)
})

test("checkout: PLN, zgoda w metadata, adres podziękowania z session_id, bez sztywnych metod płatności", () => {
  const p = checkoutParams(parseCheckoutInput(okBody), { priceId: "price_1", consentId: "c-1", origin: "https://x.pl", basePath: "/pl/m" })
  assert.equal(p.mode, "payment")
  assert.equal(p.currency, "pln")
  assert.equal(p.metadata.consent_id, "c-1")
  assert.equal(p.metadata.digital_consent, "true")
  assert.equal(p.metadata.github_login, "ala-dev")
  assert.ok(p.metadata.terms_version.startsWith("regulamin-mf-"))
  assert.equal(p.tax_id_collection, undefined) // bez pola NIP (działalność nierejestrowana)
  assert.equal(p.payment_method_types, undefined) // BLIK, karta itd. z konfiguracji konta Stripe
  assert.equal(p.success_url, "https://x.pl/pl/m/dziekujemy?session_id={CHECKOUT_SESSION_ID}")
})

test("klucz licencyjny: format i determinizm", () => {
  const k = licenseKeyFor("cs_test_1", SECRET)
  assert.match(k, /^MF1(-[A-HJ-NP-Z2-9]{5}){4}$/)
  assert.equal(k, licenseKeyFor("cs_test_1", SECRET))
  assert.notEqual(k, licenseKeyFor("cs_test_2", SECRET))
})

test("ciasteczko sesji: podpis i termin", () => {
  const now = 1_000_000
  const c = createSessionCookie("a@b.pl", 60, SECRET, now)
  assert.equal(verifySessionCookie(c, SECRET, now + 1000), "a@b.pl")
  assert.equal(verifySessionCookie(c, SECRET, now + 61_000), null)
  assert.equal(verifySessionCookie(c, "y".repeat(40), now), null)
  assert.equal(verifySessionCookie(c.replace(/^./, "Z"), SECRET, now), null)
})

test("wyłącznik: domyślnie wyłączone, klucz live blokowany na produkcji bez zgody", () => {
  assert.match(mfDisabledReason({}), /MF_SHOP_ENABLED/)
  const env = { MF_SHOP_ENABLED: "true", STRIPE_SECRET_KEY: "sk_test_1", STRIPE_WEBHOOK_SECRET: "w", MF_PRICE_PACZKA: "price_1",
    APP_ORIGIN: "x", DATABASE_URL: "x", MF_SECRET: SECRET, RESEND_API_KEY: "re_real" }
  assert.equal(mfDisabledReason(env), null)
  assert.match(mfDisabledReason({ ...env, STRIPE_SECRET_KEY: "sk_live_1", NODE_ENV: "production", VERCEL_ENV: "production" }), /live/)
})

// ── Webhook na magazynie w pamięci ──
function memoryDeps({ consent = true, inviteFails = false } = {}) {
  const events = new Map(), orders = new Map(), mails = [], gh = { invited: [], removed: [] }
  const store = {
    async beginEvent(id, type) { if (!events.has(id)) events.set(id, null); return events.get(id) === null },
    async finishEvent(id, r) { events.set(id, r) },
    async claim(sid, product, email) {
      if (!orders.has(sid)) orders.set(sid, { sid, product, email, status: "pending" })
      const o = orders.get(sid)
      if (o.status === "delivered") return "delivered"
      if (["refunded", "disputed"].includes(o.status)) return "revoked"
      if (o.status === "sending") return "busy"
      o.status = "sending"; return "claimed"
    },
    async saveOrderDetails(sid, d) { Object.assign(orders.get(sid), d) },
    async consentOk() { return consent },
    async storeLoginToken() {},
    async setGithubStatus(sid, s) { orders.get(sid).githubStatus = s },
    async markDelivered(sid) { orders.get(sid).status = "delivered" },
    async markFailed(sid, e) { const o = orders.get(sid); o.status = "failed"; o.error = e },
    async revokeByPaymentIntent(pi, status) {
      const o = [...orders.values()].find((x) => x.paymentIntent === pi)
      if (!o) return null
      o.status = status
      return { sessionId: o.sid, githubLogin: o.githubStatus === "removed" ? null : o.githubLogin }
    },
  }
  const deps = {
    store, secret: SECRET, origin: "https://x.pl", basePath: "/pl/m", env: {},
    async sendAccessMail(m) { mails.push(m) },
    github: {
      async invite(l) { if (inviteFails) throw new Error("GitHub: nie ma użytkownika " + l); gh.invited.push(l) },
      async remove(l) { gh.removed.push(l) },
    },
  }
  return { deps, orders, mails, gh, events }
}

const paidEvent = (id = "evt_1", sid = "cs_test_A") => ({
  id, type: "checkout.session.completed",
  data: { object: { id: sid, payment_status: "paid", payment_intent: "pi_1", amount_total: 23800, currency: "pln",
    metadata: { mf_product: "paczka", consent_id: "c1", github_login: "ala-dev", service_start_consent: "false" },
    customer_details: { email: "Ala@Example.com", name: "Ala", tax_ids: [] } } },
})

test("webhook: zamówienie → klucz → GitHub → mail; to samo zdarzenie drugi raz nic nie robi", async () => {
  const m = memoryDeps()
  assert.equal(await handleStripeEvent(paidEvent(), m.deps), "delivered")
  assert.equal(await handleStripeEvent(paidEvent(), m.deps), "duplicate-event")
  // drugie zdarzenie tej samej sesji (np. async_payment_succeeded) też nie dubluje
  assert.equal(await handleStripeEvent({ ...paidEvent("evt_2"), type: "checkout.session.async_payment_succeeded" }, m.deps), "duplicate")
  assert.equal(m.mails.length, 1)
  assert.deepEqual(m.gh.invited, ["ala-dev"])
  assert.equal(m.mails[0].email, "ala@example.com")
  assert.match(m.mails[0].licenseKey, /^MF1-/)
  assert.ok(m.mails[0].githubInvited)
  assert.equal(m.orders.get("cs_test_A").licenseHint, m.mails[0].licenseKey.slice(-5))
})

test("webhook: bez zapisanej zgody nie ma dostawy (500 → Stripe ponawia)", async () => {
  const m = memoryDeps({ consent: false })
  await assert.rejects(handleStripeEvent(paidEvent(), m.deps), /consent/)
  assert.equal(m.mails.length, 0)
  assert.equal(m.gh.invited.length, 0)
  assert.equal(m.orders.get("cs_test_A").status, "failed")
})

test("webhook: zły login GitHub nie blokuje maila", async () => {
  const m = memoryDeps({ inviteFails: true })
  assert.equal(await handleStripeEvent(paidEvent(), m.deps), "delivered")
  assert.equal(m.mails[0].githubInvited, false)
  assert.equal(m.orders.get("cs_test_A").githubStatus, "failed")
})

test("webhook: nieopłacona sesja (np. BLIK w toku) → bez dostawy", async () => {
  const m = memoryDeps()
  const e = paidEvent(); e.data.object.payment_status = "unpaid"
  assert.equal(await handleStripeEvent(e, m.deps), "unpaid")
  assert.equal(m.mails.length, 0)
})

test("zwrot pełny unieważnia dostęp i usuwa z GitHuba; częściowy nie", async () => {
  const m = memoryDeps()
  await handleStripeEvent(paidEvent(), m.deps)
  const partial = { id: "evt_r1", type: "charge.refunded", data: { object: { refunded: false, payment_intent: "pi_1" } } }
  assert.equal(await handleStripeEvent(partial, m.deps), "partial-refund")
  assert.equal(m.orders.get("cs_test_A").status, "delivered")
  const full = { id: "evt_r2", type: "charge.refunded", data: { object: { refunded: true, payment_intent: "pi_1" } } }
  assert.equal(await handleStripeEvent(full, m.deps), "refunded")
  assert.equal(await handleStripeEvent(full, m.deps), "duplicate-event")
  assert.equal(m.orders.get("cs_test_A").status, "refunded")
  assert.deepEqual(m.gh.removed, ["ala-dev"])
  // późne ponowienie zakupu po zwrocie nie przywraca dostępu
  assert.equal(await handleStripeEvent(paidEvent("evt_3"), m.deps), "revoked")
})

test("spór o płatność unieważnia dostęp", async () => {
  const m = memoryDeps()
  await handleStripeEvent(paidEvent(), m.deps)
  const d = { id: "evt_d", type: "charge.dispute.created", data: { object: { payment_intent: "pi_1" } } }
  assert.equal(await handleStripeEvent(d, m.deps), "disputed")
  assert.deepEqual(m.gh.removed, ["ala-dev"])
})

test("bez Resend: tylko tryb outbox i nigdy na produkcji", () => {
  const env = { MF_SHOP_ENABLED: "true", STRIPE_SECRET_KEY: "sk_test_1", STRIPE_WEBHOOK_SECRET: "w", MF_PRICE_PACZKA: "price_1",
    APP_ORIGIN: "x", DATABASE_URL: "x", MF_SECRET: SECRET }
  assert.match(mfDisabledReason(env), /RESEND/)
  assert.equal(mfDisabledReason({ ...env, MF_MAIL_MODE: "outbox", VERCEL_ENV: "preview" }), null)
  assert.match(mfDisabledReason({ ...env, MF_MAIL_MODE: "outbox", VERCEL_ENV: "production" }), /production/)
})

// Runda 2: odmiana liczby stylów i czyszczenie właściwości zdarzeń z przeglądarki.
import { stylesLabel } from "../lib/mf/content.ts"
import { cleanProps } from "../lib/mf/events.ts"

test("stylesLabel: poprawna odmiana", () => {
  assert.deepEqual([1, 2, 5, 12, 22, 33, 35].map((n) => stylesLabel(n)), ["1 styl", "2 style", "5 stylów", "12 stylów", "22 style", "33 style", "35 stylów"])
})

test("cleanProps: tylko znane klucze, krótkie teksty bez znaków specjalnych", () => {
  const p = cleanProps({ placement: "hero<script>", email: "a@b.pl", utm_source: "x".repeat(100), device: 5 })
  assert.equal(p.placement, "heroscript")
  assert.equal(p.email, undefined)
  assert.equal(p.utm_source.length, 60)
  assert.equal(p.device, undefined)
})
