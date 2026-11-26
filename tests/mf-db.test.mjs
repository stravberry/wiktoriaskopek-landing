// Testy na prawdziwym Postgresie z migracją (nie produkcja). Pomijane bez MF_TEST_DATABASE_URL.
import { test, before, after } from "node:test"
import assert from "node:assert/strict"
import postgres from "postgres"
import { pgStore, consumeLoginToken, takeResendSlot } from "../lib/mf/db.ts"
import { handleStripeEvent, sha256 } from "../lib/mf/core.ts"

const url = process.env.MF_TEST_DATABASE_URL
const skip = !url && "MF_TEST_DATABASE_URL not set"
let db

before(async () => {
  if (skip) return
  db = postgres(url, { max: 10, prepare: false, onnotice: () => {} })
  await db`truncate mf_orders, mf_stripe_events, mf_login_tokens, consent_events, mf_withdrawals cascade`
  await db`delete from mf_consents`
})
after(async () => db && db.end())

async function consent() {
  const [r] = await db`insert into mf_consents (product, terms_version, terms_accepted, digital_consent, digital_consent_text)
                       values ('paczka', 'v', true, true, 'txt') returning id`
  return r.id
}

function deps(mails, gh) {
  return {
    store: pgStore(db), secret: "s".repeat(40), origin: "http://x", basePath: "/pl/m", env: {},
    async sendAccessMail(m) { await new Promise((r) => setTimeout(r, 30)); mails.push(m) },
    github: { async invite(l) { gh.push(["invite", l]) }, async remove(l) { gh.push(["remove", l]) } },
  }
}

const ev = (id, sid, cid) => ({
  id, type: "checkout.session.completed",
  data: { object: { id: sid, payment_status: "paid", payment_intent: `pi_${sid}`, amount_total: 23800, currency: "pln",
    metadata: { mf_product: "paczka", consent_id: cid, github_login: "ala" }, customer_details: { email: "a@b.pl" } } },
})

test("20 równoległych dostarczeń tego samego zdarzenia → 1 mail, 1 zaproszenie", { skip }, async () => {
  const mails = [], gh = []
  const cid = await consent()
  const results = await Promise.allSettled(Array.from({ length: 20 }, () => handleStripeEvent(ev("evt_par", "cs_par", cid), deps(mails, gh))))
  const values = results.map((r) => (r.status === "fulfilled" ? r.value : "error"))
  assert.equal(values.filter((v) => v === "delivered").length, 1, values.join(","))
  assert.equal(mails.length, 1)
  assert.equal(gh.length, 1)
  // ponowienie po zakończeniu
  assert.equal(await handleStripeEvent(ev("evt_par", "cs_par", cid), deps(mails, gh)), "duplicate-event")
  assert.equal(await handleStripeEvent(ev("evt_par2", "cs_par", cid), deps(mails, gh)), "duplicate")
  const [o] = await db`select status, license_hash, github_status, consent_id from mf_orders where session_id = 'cs_par'`
  assert.equal(o.status, "delivered")
  assert.equal(o.github_status, "invited")
  assert.equal(o.consent_id, cid)
  assert.equal(o.license_hash, sha256(mails[0].licenseKey))
})

test("zgoda z inną sesją nie odblokowuje dostawy", { skip }, async () => {
  const cid = await consent()
  await db`update mf_consents set checkout_session_id = 'cs_other' where id = ${cid}`
  await assert.rejects(handleStripeEvent(ev("evt_x", "cs_x", cid), deps([], [])), /consent/)
  const [o] = await db`select status from mf_orders where session_id = 'cs_x'`
  assert.equal(o.status, "failed")
})

test("zwrot → status refunded, zdjęcie z GitHuba, idempotentnie", { skip }, async () => {
  const gh = []
  const refund = { id: "evt_ref", type: "charge.refunded", data: { object: { refunded: true, payment_intent: "pi_cs_par" } } }
  assert.equal(await handleStripeEvent(refund, deps([], gh)), "refunded")
  assert.equal(await handleStripeEvent(refund, deps([], gh)), "duplicate-event")
  assert.deepEqual(gh, [["remove", "ala"]])
  const [o] = await db`select status, github_status, revoked_at from mf_orders where session_id = 'cs_par'`
  assert.equal(o.status, "refunded")
  assert.equal(o.github_status, "removed")
  assert.ok(o.revoked_at)
})

test("token logowania działa raz i wygasa", { skip }, async () => {
  const store = pgStore(db)
  await store.storeLoginToken(sha256("tok1"), "a@b.pl", 60, "login")
  assert.equal(await consumeLoginToken(db, sha256("tok1")), "a@b.pl")
  assert.equal(await consumeLoginToken(db, sha256("tok1")), null)
  await db`insert into mf_login_tokens (token_hash, email, expires_at) values (${sha256("old")}, 'a@b.pl', now() - interval '1 minute')`
  assert.equal(await consumeLoginToken(db, sha256("old")), null)
})

test("„wyślij ponownie”: max 3 na godzinę", { skip }, async () => {
  const cid = await consent()
  await handleStripeEvent(ev("evt_rs", "cs_rs", cid), deps([], []))
  assert.equal(await takeResendSlot(db, "cs_rs"), 1)
  assert.equal(await takeResendSlot(db, "cs_rs"), 2)
  assert.equal(await takeResendSlot(db, "cs_rs"), 3)
  assert.equal(await takeResendSlot(db, "cs_rs"), 0)
  await db`update mf_orders set resend_window_start = now() - interval '61 minutes' where session_id = 'cs_rs'`
  assert.equal(await takeResendSlot(db, "cs_rs"), 1)
})
