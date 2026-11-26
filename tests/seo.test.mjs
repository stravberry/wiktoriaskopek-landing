// node --test: SEO strony głównej (26.11). /en/* ma dziś tę samą polską treść co /pl/*, więc kanoniczny adres to zawsze /pl.
import { test } from "node:test"
import assert from "node:assert/strict"
import { pageAlternates } from "../lib/seo.ts"
import sitemap from "../app/sitemap.ts"

test("pageAlternates: canonical na /pl, hreflang pl-PL i x-default, bez en-US", () => {
  const a = pageAlternates("/konsultacje")
  assert.equal(a.canonical, "https://www.wiktoriaskopek.pl/pl/konsultacje")
  assert.deepEqual(a.languages, { "pl-PL": "https://www.wiktoriaskopek.pl/pl/konsultacje", "x-default": "https://www.wiktoriaskopek.pl/pl/konsultacje" })
  assert.equal(pageAlternates("").canonical, "https://www.wiktoriaskopek.pl/pl")
})

test("sitemap: bez kopii /en i bez strony próby (noindex)", () => {
  const urls = sitemap().map((u) => u.url)
  assert.ok(urls.every((u) => !u.includes("/en")), "brak /en")
  assert.ok(!urls.some((u) => u.endsWith("/proba")), "brak /proba")
  assert.ok(urls.includes("https://www.wiktoriaskopek.pl/pl/montuj-bez-montazysty"))
})
