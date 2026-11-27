// node --test: darmowy audyt Instagrama (lib/audyt/core.ts): walidacja, segmenty, 10 kryteriów, scalanie odpowiedzi modelu.
import { test } from "node:test"
import assert from "node:assert/strict"
import { audytEnabled, computeManualMetrics, computeMetrics, draftReport, mergeAiReport, parseAuditInput, parseHandle, plural, segmentFor, wordsBeforeCta, costUsd } from "../lib/audyt/core.ts"
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
  assert.deepEqual(r.obserwacje.map((o) => o.tytul), ["Wezwanie w podpisach", "Bio", "Rozmowa pod rolkami"])
  assert.ok(r.obserwacje.every((o) => o.tytul === "Bio" || /\d/.test(o.tekst))) // bio to ocena tak/nie, bez liczby
  assert.ok(wordsBeforeCta(r) <= 200)
  for (const h of TEST_HANDLES) assert.equal(computeMetrics(testProfile(h, NOW), "test", NOW).enough, true)
})

test("wybór wg Kierownika: najpierw do poprawy, rytm jako jeden punkt, bez dopychania, jeden strzał jako słabość", () => {
  const t = (h) => draftReport(computeMetrics(testProfile(h, NOW), "test", NOW), h)
  assert.deepEqual(t("test_fizjo_marek").obserwacje.map((o) => o.tytul), ["Rytm", "Bio", "Kierunek ostatnio"])
  assert.match(t("test_fizjo_marek").obserwacje[0].tekst, /17 dni, a w ostatnich 30 dniach pojawiły się 3 publikacje/)
  const coach = t("test_coach_ola")
  assert.deepEqual(coach.obserwacje.map((o) => o.tytul), ["Jeden strzał", "Zasięg rolek"])
  assert.match(coach.zadanie, /^Nagraj w tym tygodniu 3 rolki na temat rolki z /)
  assert.ok(!/utrzymaj/i.test(JSON.stringify(coach)))
  assert.match(t("test_salon_ania").obserwacje.find((o) => o.tytul === "Bio").tekst, /^Bio mówi, co robisz, ale nie mówi/)
  assert.match(t("test_salon_ania").ocena, /85% obserwujących/)
  // Profil bez słabości: układ „następny poziom” (Kierownik, D)
  const p = testProfile("test_coach_ola", NOW)
  p.followers_count = 3000
  p.media = p.media.map((m) => (m.view_count === 52000 ? { ...m, view_count: 8000, like_count: 400, comments_count: 30 } : m))
  const d = draftReport(computeMetrics(p, "test", NOW), "x")
  assert.equal(d.obserwacje.length, 0)
  assert.match(d.ocena, /^Twój profil spełnia wszystkie/)
  assert.match(d.nastepny, /kandydatka na reklamę Meta/)
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
  const bad = mergeAiReport(d, { ocena: "Publikuj wartościowe treści.", obserwacje: [{ tekst: "Warto nagrywać 2 rolki." }], zadanie: "Może nagraj coś." })
  assert.equal(bad.report.zadanie, d.zadanie)
  assert.equal(bad.report.ocena, d.ocena)
  assert.equal(bad.report.obserwacje[0].tekst, d.obserwacje[0].tekst)
  const good = mergeAiReport(d, { ocena: "Masz 3 publikacje w 30 dni, zobacz https://zly.link", obserwacje: [{ tekst: `${d.obserwacje[0].tytul}: przerwa 17 dni to za dużo.` }], zadanie: "Nagraj 4 rolki." })
  assert.ok(!good.report.ocena.includes("http"))
  assert.equal(good.report.obserwacje[0].tekst, "przerwa 17 dni to za dużo.")
  assert.equal(mergeAiReport(d, null).usedAi, false)
  const bio = { ...d, obserwacje: [{ tytul: "Bio", tekst: "x 1" }] }
  assert.equal(mergeAiReport(bio, { obserwacje: [{ tekst: "Bio nie mówi, co zrobić, choć masz 2400 obserwujących." }] }).report.obserwacje[0].tekst, "Bio nie mówi, co zrobić, choć masz 2400 obserwujących.")
})

test("odmiana i koszt", () => {
  assert.equal(plural(1, "publikacja", "publikacje", "publikacji"), "publikacja")
  assert.equal(plural(3, "publikacja", "publikacje", "publikacji"), "publikacje")
  assert.equal(plural(12, "publikacja", "publikacje", "publikacji"), "publikacji")
  assert.equal(plural(22, "publikacja", "publikacje", "publikacji"), "publikacje")
  assert.equal(costUsd(1_000_000, 0), 0.75)
})

test("flaga audytu: domyślnie wyłączony, włącza tylko AUDYT_ENABLED=1", () => {
  assert.equal(audytEnabled({}), false)
  assert.equal(audytEnabled({ AUDYT_ENABLED: "0" }), false)
  assert.equal(audytEnabled({ AUDYT_ENABLED: "true" }), false)
  assert.equal(audytEnabled({ AUDYT_ENABLED: "1" }), true)
})
