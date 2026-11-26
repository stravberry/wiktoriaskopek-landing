// node --test: regresja przeglądu bezpieczeństwa 26.11 (S1, S2, S4). Bez sieci i kluczy.
import { test } from "node:test"
import assert from "node:assert/strict"
import { createHmac } from "node:crypto"
import { readFileSync, readdirSync, statSync } from "node:fs"
import { join } from "node:path"
import { createSessionCookie, verifySessionCookie, handleStripeEvent, shopTestLocked, testerAllowed, normalizedEmail } from "../lib/mf/core.ts"

const SECRET = "x".repeat(40)
const files = (dir) => readdirSync(dir).flatMap((f) => { const p = join(dir, f); return statSync(p).isDirectory() ? files(p) : [p] })

test("S1: sesję konta ustawia tylko link z maila (/api/mf/auth), nie strona po płatności", () => {
  const setters = files("app").filter((f) => /\.(ts|tsx)$/.test(f) && readFileSync(f, "utf8").includes("sessionCookieValue("))
  assert.deepEqual(setters, ["app/api/mf/auth/route.ts"])
  const po = readFileSync("app/api/mf/po-zakupie/route.ts", "utf8")
  assert.ok(!/cookies\.set|SESSION_COOKIE|stripe\(/.test(po), "po-zakupie nie może logować")
  const thanks = readFileSync("app/[lang]/montuj-bez-montazysty/dziekujemy/page.tsx", "utf8")
  assert.ok(!thanks.includes("/api/mf/po-zakupie"), "brak przycisku logowania po płatności")
})

test("S1: sesje wydane przed poprawką (stary podpis) są nieważne, nowe działają", () => {
  const now = 1_800_000_000_000
  const payload = Buffer.from(JSON.stringify({ e: "ofiara@x.pl", x: now + 60_000 })).toString("base64url")
  const old = `${payload}.${createHmac("sha256", SECRET).update(`session:${payload}`).digest("base64url")}`
  assert.equal(verifySessionCookie(old, SECRET, now), null)
  assert.equal(verifySessionCookie(createSessionCookie("a@b.pl", 60, SECRET, now), SECRET, now + 1000), "a@b.pl")
})

test("S2: lista testerów: skrzynka Wiktorii z aliasami i MF_TEST_ALLOWLIST", () => {
  assert.ok(testerAllowed("wskopek.all@gmail.com", {}))
  assert.ok(testerAllowed("Wskopek.All+proba-telefon@gmail.com", {}))
  assert.ok(!testerAllowed("wskopek.all@gmail.com.evil.pl", {}))
  assert.ok(!testerAllowed("ktos@gmail.com", {}))
  assert.ok(!testerAllowed("wskopek.all+x@evil.pl", {}))
  assert.ok(testerAllowed("qa@firma.pl", { MF_TEST_ALLOWLIST: " qa@firma.pl , x@y.pl" }))
  assert.ok(!testerAllowed(null, {}))
  assert.ok(shopTestLocked({ VERCEL_ENV: "production", STRIPE_SECRET_KEY: "sk_test_1" }))
  assert.ok(!shopTestLocked({ VERCEL_ENV: "preview", STRIPE_SECRET_KEY: "sk_test_1" }))
  assert.ok(!shopTestLocked({ VERCEL_ENV: "production", STRIPE_SECRET_KEY: "sk_live_1" }))
})

function deps(env) {
  const calls = { claim: 0, mails: [] }
  const store = {
    async beginEvent() { return true }, async finishEvent() {},
    async claim() { calls.claim++; return "claimed" },
    async saveOrderDetails() {}, async consentOk() { return true }, async storeLoginToken() {},
    async setGithubStatus() {}, async markDelivered() {}, async markFailed() {}, async revokeByPaymentIntent() { return null },
  }
  return { calls, deps: { store, secret: SECRET, origin: "https://x.pl", basePath: "/pl/m", env, github: null, async sendAccessMail(m) { calls.mails.push(m.email) } } }
}
const testPayment = (email, livemode = false) => ({ id: "evt_" + email, type: "checkout.session.completed",
  data: { object: { id: "cs_test_" + email.length, livemode, payment_status: "paid", payment_intent: "pi_1", amount_total: 23800, currency: "pln",
    metadata: { mf_product: "paczka", consent_id: "c1" }, customer_details: { email } } } })

test("S2: płatność testowa na produkcji spoza listy nie wydaje produktu ani maila", async () => {
  const m = deps({ VERCEL_ENV: "production" })
  assert.equal(await handleStripeEvent(testPayment("obcy@gmail.com"), m.deps), "test-blocked")
  assert.equal(m.calls.claim, 0)
  assert.deepEqual(m.calls.mails, [])
})

test("S2: tester na produkcji i płatność live dostają produkt", async () => {
  const t = deps({ VERCEL_ENV: "production" })
  assert.equal(await handleStripeEvent(testPayment("wskopek.all+qa@gmail.com"), t.deps), "delivered")
  const live = deps({ VERCEL_ENV: "production" })
  assert.equal(await handleStripeEvent(testPayment("klient@gmail.com", true), live.deps), "delivered")
  const preview = deps({ VERCEL_ENV: "preview" })
  assert.equal(await handleStripeEvent(testPayment("klient@gmail.com"), preview.deps), "delivered")
})

test("S4: formularz odstąpienia nie wysyła treści z formularza do kupującego i nie przyjmuje dowolnego odbiorcy", () => {
  const src = readFileSync("app/api/mf/withdrawal/route.ts", "utf8")
  const buyer = src.slice(src.indexOf("const buyerText"), src.indexOf("const sellerText"))
  assert.ok(!/\$\{(statement|name|orderRef)\}/.test(buyer), "potwierdzenie bez tekstu użytkownika")
  assert.ok(src.includes("select 1 from mf_orders where lower(email)"), "potwierdzenie tylko na adres z zamówienia")
  assert.ok(src.includes("from mf_withdrawals where created_at"), "limit liczony w bazie")
})

test("S5: limit próby liczy adres bez +aliasu i kropek Gmaila", () => {
  assert.equal(normalizedEmail("Jan.Kowalski+proba1@gmail.com"), "jankowalski@gmail.com")
  assert.equal(normalizedEmail("j.an+x@googlemail.com"), "jan@gmail.com")
  assert.equal(normalizedEmail("Ala.Nowak+a@firma.pl"), "ala.nowak@firma.pl")
  const src = readFileSync("app/api/mf/trial/start/route.ts", "utf8")
  assert.ok(src.includes("as alias") && src.includes("as total"), "limity aliasów i globalny w bazie")
})

test("S8: zwrot przed zapisem zamówienia MontageFrames wraca do Stripe (ponowienie), obcy zwrot nie", async () => {
  const m = deps({})
  const refund = (meta) => ({ id: "evt_r" + JSON.stringify(meta), type: "charge.refunded", data: { object: { refunded: true, payment_intent: "pi_x", metadata: meta } } })
  await assert.rejects(handleStripeEvent(refund({ mf_product: "paczka" }), m.deps), /retry/)
  assert.equal(await handleStripeEvent(refund({}), m.deps), "order-not-found")
})

test("S3: treść poradnika nie leży w repo", () => {
  const src = readFileSync("lib/mf/poradnik.ts", "utf8")
  assert.ok(src.includes("mf_content") && !src.includes("CHAPTERS: Chapter[] = ["))
})

test("S7: zmiana loginu GitHub pod blokadą wiersza, bez nadpisania przy błędzie usuwania", () => {
  const src = readFileSync("app/api/mf/github/route.ts", "utf8")
  assert.ok(src.includes("for update") && src.includes("db.begin"))
  const rm = src.slice(src.indexOf("await gh.remove"), src.indexOf("await gh.invite"))
  assert.ok(!rm.includes("github_login = ${login}"), "przy błędzie remove stary login zostaje")
})
