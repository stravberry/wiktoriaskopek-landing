// node --test: build ma zatrzymywać się na błędach typów (decyzja Dayli 26.11: ignoreBuildErrors wyłączone).
import { test } from "node:test"
import assert from "node:assert/strict"
import config from "../next.config.mjs"

test("next.config: TypeScript nie jest pomijany przy buildzie", () => {
  assert.notEqual(config.typescript?.ignoreBuildErrors, true)
})

test("next.config: CSP jest wymuszana (nie tylko raportowana)", async () => {
  const [{ headers }] = await config.headers()
  assert.ok(headers.some((h) => h.key === "Content-Security-Policy"))
})
