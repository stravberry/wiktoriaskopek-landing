// node --test: darmowy audyt Instagrama (lib/audyt/core.ts): walidacja, segmenty, 10 kryteriów, scalanie odpowiedzi modelu.
import { test } from "node:test"
import assert from "node:assert/strict"
import { computeManualMetrics, computeMetrics, draftReport, mergeAiReport, parseAuditInput, parseHandle, plural, segmentFor, wordsBeforeCta, costUsd } from "../lib/audyt/core.ts"
import { TEST_HANDLES, testProfile } from "../lib/audyt/fixtures.ts"

const NOW = Date.parse("2026-11-27T12:00:00Z")
const base = { handle: "@Ania.Studio", email: "Ania@Example.com", profileType: "firma", whoMakes: "ja", budget: "do1k", owner: true }

test("nazwa profilu: @, adres, wielkość liter; złe nazwy odrzucone", () => {
  assert.equal(parseHandle("@Ania.Studio"), "ania.studio")
  assert.equal(parseHandle("https://www.instagram.com/ania_studio/?hl=pl"), "ania_studio")
  assert.equal(parseHandle("ania studio"), null)
  assert.equal(parseHandle(".ania"), null)
  assert.equal(parseHandle("a..b"), null)
  assert.equal(parseHandle("x".repeat(31)), null)
  assert.equal(parseHandle("ania){followers_count}"), null)
})

test("zgłoszenie: wymagane oświadczenie właściciela, newsletter dobrowolny, 4 liczby sprawdzone", () => {
  const ok = parseAuditInput(base)
  assert.equal(ok.ok, true)
  assert.equal(ok.input.newsletter, false)
  assert.equal(ok.input.email, "ania@example.com")
  assert.equal(parseAuditInput({ ...base, owner: false }).ok, false)
  assert.equal(parseAuditInput({ ...base, budget: "milion" }).ok, false)
  assert.equal(parseAuditInput({ ...base, email: "a@mailinator.com" }).ok, false)
  assert.equal(parseAuditInput({ ...base, manual: { followers: "1 200", avgViews: "800", posts30: "6", reels30: "3" } }).input.manual.followers, 1200)
  assert.equal(parseAuditInput({ ...base, manual: { followers: "0", avgViews: "800", posts30: "6", reels30: "3" } }).ok, false)
  assert.equal(parseAuditInput({ ...base, manual: { followers: "10", avgViews: "8", posts30: "2", reels30: "3" } }).ok, false)
})

test("segmenty jak w tabeli Kierownika", () => {
  assert.equal(segmentFor({ profileType: "prywatny", whoMakes: "nikt", budget: "5k+" }), "porady")
  assert.equal(segmentFor({ profileType: "firma", whoMakes: "nikt", budget: "0" }), "porady")
  assert.equal(segmentFor({ profileType: "marka", whoMakes: "ja", budget: "do1k" }), "mf")
  assert.equal(segmentFor({ profileType: "firma", whoMakes: "agencja", budget: "1-5k" }), "rozmowa")
  assert.equal(segmentFor({ profileType: "firma", whoMakes: "nikt", budget: "do1k" }), "porady")
})

test("10 kryteriów na fikcyjnych profilach: wartości i wybór 3 najsłabszych", () => {
  const salon = computeMetrics(testProfile("test_salon_ania", NOW), "test", NOW)
  assert.equal(salon.enough, true)
  assert.equal(salon.criteria.length, 10)
  const byId = Object.fromEntries(salon.criteria.map((c) => [c.id, c]))
  assert.equal(byId[2].value, 11)
  assert.equal(byId[3].value, 4)
  assert.equal(byId[10].value, 0)
  assert.equal(byId[5].status, "dobrze")
  const r = draftReport(salon, "test_salon_ania")
  assert.equal(r.obserwacje.length, 3)
  assert.equal(r.obserwacje[0].tytul, "Wezwanie w podpisach")
  assert.ok(r.obserwacje.every((o) => o.tytul === "Bio" || /\d/.test(o.tekst))) // bio to ocena tak/nie, bez liczby
  assert.ok(wordsBeforeCta(r) <= 200)
  for (const h of TEST_HANDLES) assert.equal(computeMetrics(testProfile(h, NOW), "test", NOW).enough, true)
})

test("za mało rolek = brak audytu; ścieżka ręczna liczy 3 kryteria", () => {
  const p = testProfile("test_salon_ania", NOW)
  p.media = p.media.filter((m) => m.media_product_type !== "REELS").concat(p.media.filter((m) => m.media_product_type === "REELS").slice(0, 2))
  assert.equal(computeMetrics(p, "test", NOW).enough, false)
  const m = computeManualMetrics({ followers: 2000, avgViews: 500, posts30: 4, reels30: 1 })
  assert.deepEqual(m.criteria.map((c) => c.id), [1, 2, 4])
  assert.equal(draftReport(m, "x").obserwacje.length, 3)
})

test("odpowiedź modelu: bez liczb i z linkami nie przechodzi, tytuł nie jest powtarzany", () => {
  const d = draftReport(computeMetrics(testProfile("test_fizjo_marek", NOW), "test", NOW), "test_fizjo_marek")
  const bad = mergeAiReport(d, { ocena: "Publikuj wartościowe treści.", obserwacje: [{ tekst: "Bądź autentyczny." }], zadanie: "" })
  assert.equal(bad.report.ocena, d.ocena)
  assert.equal(bad.report.obserwacje[0].tekst, d.obserwacje[0].tekst)
  const good = mergeAiReport(d, { ocena: "Masz 3 publikacje w 30 dni, zobacz https://zly.link", obserwacje: [{ tekst: `${d.obserwacje[0].tytul}: przerwa 17 dni to za dużo.` }], zadanie: "Nagraj 4 rolki." })
  assert.ok(!good.report.ocena.includes("http"))
  assert.equal(good.report.obserwacje[0].tekst, "przerwa 17 dni to za dużo.")
  assert.equal(mergeAiReport(d, null).usedAi, false)
})

test("odmiana i koszt", () => {
  assert.equal(plural(1, "publikacja", "publikacje", "publikacji"), "publikacja")
  assert.equal(plural(3, "publikacja", "publikacje", "publikacji"), "publikacje")
  assert.equal(plural(12, "publikacja", "publikacje", "publikacji"), "publikacji")
  assert.equal(plural(22, "publikacja", "publikacje", "publikacji"), "publikacje")
  assert.equal(costUsd(1_000_000, 0), 0.75)
})
