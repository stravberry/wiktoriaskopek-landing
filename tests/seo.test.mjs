// node --test: SEO (27.11): polski w katalogu głównym, canonical na polski adres, /en ma dziś tę samą treść.
import { test } from "node:test"
import assert from "node:assert/strict"
import { pageAlternates } from "../lib/seo.ts"
import sitemap from "../app/sitemap.ts"

test("pageAlternates: canonical na polski adres bez /pl, hreflang pl-PL i x-default, bez en-US", () => {
  const a = pageAlternates("/konsultacje")
  assert.equal(a.canonical, "https://www.wiktoriaskopek.pl/konsultacje")
  assert.deepEqual(a.languages, { "pl-PL": "https://www.wiktoriaskopek.pl/konsultacje", "x-default": "https://www.wiktoriaskopek.pl/konsultacje" })
  assert.equal(pageAlternates("").canonical, "https://www.wiktoriaskopek.pl")
})

test("sitemap: bez /pl, bez kopii /en i bez strony próby (noindex)", () => {
  const urls = sitemap().map((u) => u.url)
  assert.ok(urls.every((u) => !u.includes("/en") && !u.includes("/pl")), "brak /en i /pl")
  assert.ok(!urls.some((u) => u.endsWith("/proba")), "brak /proba")
  assert.ok(urls.includes("https://www.wiktoriaskopek.pl/montuj-bez-montazysty"))
})
