// node --test: nobr nie pozwala łamać wiersza na łączniku i półpauzie w zakresach i kodach.
import { test } from "node:test"
import assert from "node:assert/strict"
import { nobr } from "../lib/typo.ts"

test("nobr: po łączniku i półpauzie między znakami jest word joiner", () => {
  assert.equal(nobr("15–30 min"), "15–⁠30 min")
  assert.equal(nobr("43-180 Orzesze"), "43-⁠180 Orzesze")
  assert.equal(nobr("Apache-2.0"), "Apache-⁠2.0")
})

test("nobr: nie rusza myślnika ze spacjami ani tekstu bez łączników", () => {
  assert.equal(nobr("marka — nazwa"), "marka — nazwa")
  assert.equal(nobr("a - b"), "a - b")
  assert.equal(nobr("Montuj rolki"), "Montuj rolki")
})
