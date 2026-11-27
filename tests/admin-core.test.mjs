// Panel admina: allowlista, podpis i ważność sesji, CSRF (Origin).
import test from "node:test"
import assert from "node:assert/strict"
import { adminEmails, createAdminCookie, isAdminEmail, sameOrigin, verifyAdminCookie } from "../lib/admin/core.ts"

const S = "x".repeat(40)
const env = { ADMIN_EMAILS: "wskopek.all@gmail.com" }

test("allowlista: domyślnie tylko adres Wiktorii, bez względu na wielkość liter", () => {
  assert.deepEqual(adminEmails({}), ["wskopek.all@gmail.com"])
  assert.equal(isAdminEmail(" WSKOPEK.all@gmail.com ", {}), true)
  assert.equal(isAdminEmail("obcy@example.com", {}), false)
})

test("sesja: poprawna przechodzi, podrobiona, wygasła i obca nie", () => {
  const now = Date.now()
  const c = createAdminCookie("wskopek.all@gmail.com", S, now)
  assert.equal(verifyAdminCookie(c, S, env, now + 1000), "wskopek.all@gmail.com")
  assert.equal(verifyAdminCookie(c, "y".repeat(40), env, now), null, "inny sekret")
  assert.equal(verifyAdminCookie(c.replace(/.$/, (ch) => (ch === "A" ? "B" : "A")), S, env, now), null, "zmieniony podpis")
  assert.equal(verifyAdminCookie(c, S, env, now + 8 * 3600_000 + 1), null, "po 8 godzinach")
  const stranger = createAdminCookie("obcy@example.com", S, now)
  assert.equal(verifyAdminCookie(stranger, S, env, now), null, "adres spoza allowlisty")
  assert.equal(verifyAdminCookie(c, S, { ADMIN_EMAILS: "ktos@inny.pl" }, now), null, "usunięty z allowlisty traci dostęp")
  assert.equal(verifyAdminCookie(undefined, S, env, now), null)
})

test("ciasteczko kupującego (inny format podpisu) nie daje dostępu", () => {
  const payload = Buffer.from(JSON.stringify({ e: "wskopek.all@gmail.com", x: Date.now() + 1e6 })).toString("base64url")
  assert.equal(verifyAdminCookie(`${payload}.abc`, S, env), null)
})

test("CSRF: tylko ten sam serwis", () => {
  const ok = ["https://www.wiktoriaskopek.pl", "https://wiktoriaskopek.pl"]
  assert.equal(sameOrigin("https://www.wiktoriaskopek.pl", ok), true)
  assert.equal(sameOrigin("https://evil.example", ok), false)
  assert.equal(sameOrigin(null, ok), false)
  assert.equal(sameOrigin("null", ok), false)
})
