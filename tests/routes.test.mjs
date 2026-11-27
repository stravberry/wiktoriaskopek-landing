// node --test: trasy po porządkach (27.11): polski w katalogu głównym, /pl/* → 301, usunięte podstrony → 301, /en zostaje.
import { test } from "node:test"
import assert from "node:assert/strict"
import { resolveRoute } from "../lib/routes.ts"

const r = (p) => resolveRoute(p)

test("polski w katalogu głównym: wewnętrzny rewrite na /pl", () => {
  assert.deepEqual(r("/"), { type: "rewrite", to: "/pl" })
  assert.deepEqual(r("/montuj-bez-montazysty"), { type: "rewrite", to: "/pl/montuj-bez-montazysty" })
  assert.deepEqual(r("/montuj-bez-montazysty/poradnik/instalacja"), { type: "rewrite", to: "/pl/montuj-bez-montazysty/poradnik/instalacja" })
  assert.deepEqual(r("/konsultacje"), { type: "rewrite", to: "/pl/konsultacje" })
})

test("stare /pl/* → 301 na adres bez /pl", () => {
  assert.deepEqual(r("/pl"), { type: "redirect", to: "/" })
  assert.deepEqual(r("/pl/"), { type: "redirect", to: "/" })
  assert.deepEqual(r("/pl/montuj-bez-montazysty/proba"), { type: "redirect", to: "/montuj-bez-montazysty/proba" })
  assert.deepEqual(r("/pl/polityka-prywatnosci"), { type: "redirect", to: "/polityka-prywatnosci" })
})

test("usunięte podstrony → 301 na najbliższą sensowną stronę (z /pl, /en i bez prefiksu)", () => {
  for (const p of ["/portfolio", "/pl/portfolio", "/blog", "/pl/blog/jakis-wpis", "/transmisje-live", "/old-mainpage", "/stara-strona", "/linki", "/podcasty", "/youtube", "/techno"])
    assert.deepEqual(r(p), { type: "redirect", to: "/" }, p)
  assert.deepEqual(r("/en/portfolio"), { type: "redirect", to: "/en" })
  assert.deepEqual(r("/pl/formaty-eksperckie"), { type: "redirect", to: "/konsultacje" })
  assert.deepEqual(r("/kursy-online"), { type: "redirect", to: "/montuj-bez-montazysty" })
  assert.deepEqual(r("/proba"), { type: "redirect", to: "/montuj-bez-montazysty/proba" })
  assert.deepEqual(r("/pl/proba"), { type: "redirect", to: "/montuj-bez-montazysty/proba" })
})

test("/en, /api, /admin i pliki przechodzą bez zmian", () => {
  for (const p of ["/en", "/en/konsultacje", "/api/mf/checkout", "/admin", "/admin/crm", "/_next/static/x.js", "/llms.txt", "/mf/kotek/kotek-bieg.webp"])
    assert.deepEqual(r(p), { type: "next" }, p)
})
