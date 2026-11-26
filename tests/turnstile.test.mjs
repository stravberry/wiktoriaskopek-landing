// node --test: Turnstile (decyzja z Coding Builderem 26.11). Bez kluczy wyłączony; z kluczami sprawdza token i NIE przepuszcza,
// gdy Cloudflare nie odpowiada (fail closed).
import { test } from "node:test"
import assert from "node:assert/strict"
import { verifyTurnstile, turnstileEnabled } from "../lib/turnstile.ts"

const ON = { TURNSTILE_SECRET_KEY: "s", NEXT_PUBLIC_TURNSTILE_SITE_KEY: "k" }
const reply = (body, status = 200) => async () => new Response(JSON.stringify(body), { status })

test("bez obu kluczy: wyłączony, przepuszcza (wdrożenie przed ustawieniem kluczy)", async () => {
  assert.equal(turnstileEnabled({ TURNSTILE_SECRET_KEY: "s" }), false)
  assert.deepEqual(await verifyTurnstile(undefined, "1.1.1.1", {}, reply({ success: false })), { ok: true })
})

test("z kluczami: brak tokenu = 400", async () => {
  const r = await verifyTurnstile("", "1.1.1.1", ON, reply({ success: true }))
  assert.equal(r.ok, false); assert.equal(r.status, 400)
})

test("z kluczami: token odrzucony = 400, przyjęty = ok", async () => {
  assert.equal((await verifyTurnstile("t", "ip", ON, reply({ success: false }))).status, 400)
  assert.deepEqual(await verifyTurnstile("t", "ip", ON, reply({ success: true })), { ok: true })
})

test("z kluczami: Cloudflare nie odpowiada albo zwraca błąd = 503, nie przepuszcza", async () => {
  const boom = async () => { throw new Error("timeout") }
  assert.equal((await verifyTurnstile("t", "ip", ON, boom)).status, 503)
  assert.equal((await verifyTurnstile("t", "ip", ON, reply({}, 500))).status, 503)
})

test("wysyła sekret i token do siteverify", async () => {
  let sent
  await verifyTurnstile("tok", "9.9.9.9", ON, async (url, init) => { sent = { url, body: String(init.body) }; return new Response('{"success":true}') })
  assert.equal(sent.url, "https://challenges.cloudflare.com/turnstile/v0/siteverify")
  assert.match(sent.body, /secret=s/); assert.match(sent.body, /response=tok/)
})
