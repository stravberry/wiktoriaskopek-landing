// node --test: audyt IG v2 (lib/audyt/v2): limity kosztu, mapowanie ScrapeCreators, wybór rolek, oceny wideo, cały przebieg na podstawionym fetch.
import { test } from "node:test"
import assert from "node:assert/strict"
import { CostGuard, v2Config } from "../lib/audyt/v2/config.ts"
import { mapReel } from "../lib/audyt/v2/scrape.ts"
import { parseAnalysis, VIDEO_KEYS } from "../lib/audyt/v2/gemini.ts"
import { aggregateVideo, hookSentence, mergeObservations, pickReels, runAuditV2, renderMarkdown, applyTopic } from "../lib/audyt/v2/engine.ts"

const NOW = Date.parse("2026-11-27T12:00:00Z")
const day = 86_400_000

test("limity: zmienne mogą tylko obniżyć twarde limity", () => {
  const hi = v2Config({ AUDYT_V2_PER_AUDIT_USD: "50", AUDYT_V2_MONTHLY_USD: "999", AUDYT_V2_CREDITS: "500" })
  assert.equal(hi.perAuditUsd, 1.5)
  assert.equal(hi.monthlyUsd, 15)
  assert.equal(hi.creditsPerAudit, 20)
  const lo = v2Config({ AUDYT_V2_PER_AUDIT_USD: "0.5" })
  assert.equal(lo.perAuditUsd, 0.5)
})

test("CostGuard: kredyty i Gemini zatrzymują się na limicie audytu i miesiąca", () => {
  const g = new CostGuard(v2Config({ AUDYT_V2_CREDITS: "3" }))
  assert.ok(g.canCredits(3))
  g.addCredits(3)
  assert.equal(g.canCredits(1), false)
  const m = new CostGuard(v2Config({}), 14.999)
  assert.ok(m.limitUsd < 0.002)
  assert.equal(m.canGemini(60), false, "szacunek 60 s nie mieści się w resztce miesiąca")
  const full = new CostGuard(v2Config({}), 15)
  assert.equal(full.limitUsd, 0)
})

test("mapReel: pola w item.media albo w item; najmniejsza wersja wideo", () => {
  const a = mapReel({ media: { code: "AAA", taken_at: 1764000000, play_count: 1200, like_count: 50, comment_count: 4, video_duration: 31.5, video_versions: [{ url: "https://cdn/big.mp4", width: 1080 }, { url: "https://cdn/small.mp4", width: 480 }], caption: { text: "Hej" } } })
  assert.equal(a.code, "AAA")
  assert.equal(a.views, 1200)
  assert.equal(a.videoUrl, "https://cdn/small.mp4")
  assert.equal(a.caption, "Hej")
  const b = mapReel({ code: "BBB", created_at: "2026-11-20T10:00:00.000Z", ig_play_count: "900" })
  assert.equal(b.views, 900)
  assert.equal(b.timestamp, "2026-11-20T10:00:00.000Z")
  assert.equal(mapReel({}), null)
})

const reel = (code, daysAgo, views, extra = {}) => ({ code, timestamp: new Date(NOW - daysAgo * day).toISOString(), views, likes: Math.round(views * 0.04), comments: 2, caption: null, duration: 30, videoUrl: `https://cdn/${code}.mp4`, permalink: `https://www.instagram.com/reel/${code}/`, ...extra })

test("pickReels: najlepsza + najnowsze, bez rolek bez pliku i za długich", () => {
  const reels = [reel("n1", 1, 500), reel("n2", 3, 800, { videoUrl: null }), reel("n3", 5, 600, { duration: 400 }), reel("top", 9, 9000), reel("n4", 12, 700)]
  const picked = pickReels(reels, { ownReels: 3, maxVideoSeconds: 120 })
  assert.deepEqual(picked.map((p) => [p.reel.code, p.role]), [["top", "najlepsza"], ["n1", "najnowsza"], ["n4", "najnowsza"]])
})

const score = (o, rada = "Zacznij od pytania do widza.") => ({ ocena: o, dowod: "0–3 s: ujęcie biurka bez tekstu", rada })
const analysis = (o, overrides = {}) => ({ temat: "ceny usług", hook_tekst: "Ile kosztuje rolka?", ciecia_10s: 3, mowa: true, napisy_obecne: true, cta_obecne: false, ...Object.fromEntries(VIDEO_KEYS.map((k) => [k, score(o)])), ...overrides })

test("parseAnalysis: oceny 1–5, brak rady = odrzucenie", () => {
  const ok = parseAnalysis({ ...analysis(9), hook: { ocena: 0, dowod: "x", rada: "Zacznij od liczby." } })
  assert.equal(ok.hook.ocena, 1)
  assert.equal(ok.tempo.ocena, 5)
  assert.equal(parseAnalysis({ ...analysis(3), cta: { ocena: 3, dowod: "x", rada: "" } }), null)
})

test("aggregateVideo: średnia, status, dowód z najsłabszej rolki, zakazane słowa → rada zapasowa", () => {
  const reviews = [
    { code: "a", permalink: "", date: "20 listopada", views: 100, ratio: 1, role: "najlepsza", analysis: analysis(4) },
    { code: "b", permalink: "", date: "25 listopada", views: 80, ratio: 0.8, role: "najnowsza", analysis: analysis(4, { hook: score(1, "Warto zacząć od pytania.") }) },
  ]
  const v = aggregateVideo(reviews)
  const hook = v.find((x) => x.key === "hook")
  assert.equal(hook.avg, 2.5)
  assert.equal(hook.status, "srednio")
  assert.match(hook.tekst, /W rolce z 25 listopada/)
  assert.doesNotMatch(hook.tekst, /warto/i)
  const caps = aggregateVideo([{ ...reviews[0], analysis: analysis(1, { cta: score(1, "Dodaj planszę.") }) }].map((r) => ({ ...r, analysis: { ...r.analysis, cta: { ocena: 1, dowod: "W 00:28 film się kończy", rada: "Dodaj planszę." } } })))
  assert.match(caps.find((x) => x.key === "cta").tekst, /: w 00:28 film/)
  assert.equal(v.find((x) => x.key === "tempo").status, "dobrze")
})

test("mergeObservations: najwyżej 3, wideo trafia do maila, gdy jest słabe", () => {
  const m = { source: "scrape", enough: true, followers: 1000, reelsMedianViews: 500, best: null, criteria: [
    { id: 1, label: "Zasięg rolek", value: 0.1, valueText: "", status: "do_poprawy", weakness: 0.9, advice: "A.", task: "T1" },
    { id: 7, label: "Rozmowa pod rolkami", value: 0.2, valueText: "", status: "do_poprawy", weakness: 0.8, advice: "B.", task: "T7" },
    { id: 10, label: "Wezwanie w podpisach", value: 0, valueText: "", status: "do_poprawy", weakness: 1, advice: "C.", task: "T10" },
  ] }
  const video = [{ key: "hook", label: "Pierwsze 3 sekundy", avg: 3, status: "srednio", weakness: 0.25, tekst: "H.", task: "TH" }]
  const obs = mergeObservations(m, video)
  assert.equal(obs.length, 3)
  assert.ok(obs.some((o) => o.tytul === "Pierwsze 3 sekundy"))
})

// Podstawiony fetch: ScrapeCreators (profil, rolki, post), CDN wideo, Gemini. Zero sieci.
function fakeFetch({ credits402 = false } = {}) {
  const calls = []
  const reels = Array.from({ length: 8 }, (_, i) => ({ media: { code: `R${i}`, taken_at: Math.floor((NOW - (i * 4 + 1) * day) / 1000), play_count: i === 3 ? 12000 : 1000 + i * 50, like_count: 40, comment_count: 1, video_duration: 25, video_versions: [{ url: `https://cdn.test/R${i}.mp4`, width: 480 }] } }))
  const timeline = reels.map((r) => ({ node: { shortcode: r.media.code, taken_at_timestamp: r.media.taken_at, __typename: "GraphVideo", is_video: true, product_type: "clips", edge_media_to_caption: { edges: [{ node: { text: "Umów wizytę: link w bio" } }] } } }))
  const f = async (url, init = {}) => {
    const u = String(url)
    calls.push(u.split("?")[0])
    const json = (body, status = 200) => new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } })
    if (u.startsWith("https://api.scrapecreators.com")) {
      if (credits402) return json({ success: false, message: "payment required" }, 402)
      if (u.includes("/v1/instagram/profile")) return json({ success: true, credits_charged: 1, data: { user: { id: "42", username: "salon.test", biography: "Pomagam kobietom. Umów się: link", external_url: "https://x.pl", is_private: false, edge_followed_by: { count: 2000 }, edge_owner_to_timeline_media: { count: 80, edges: timeline } } } })
      if (u.includes("/v1/instagram/user/reels")) return json({ success: true, credits_charged: 1, items: reels })
      if (u.includes("/v1/instagram/post")) return json({ success: true, credits_charged: 1, data: { xdt_shortcode_media: { edge_media_to_caption: { edges: [{ node: { text: "Podpis" } }] } } } })
    }
    if (u.startsWith("https://cdn.test/")) return new Response(new Uint8Array(1000), { status: 200, headers: { "content-type": "video/mp4", "content-length": "1000" } })
    if (u.startsWith("https://generativelanguage.googleapis.com")) {
      assert.equal(init.headers["x-goog-api-key"], "g-test")
      return json({ candidates: [{ content: { parts: [{ text: JSON.stringify(analysis(2)) }] } }], usageMetadata: { promptTokenCount: 4000, candidatesTokenCount: 700, thoughtsTokenCount: 300 } })
    }
    throw new Error(`nieoczekiwany adres ${u}`)
  }
  return { f, calls }
}

test("runAuditV2: cały przebieg na podstawionym fetch, koszt i limit", async () => {
  const { f, calls } = fakeFetch()
  const o = await runAuditV2({ handle: "salon.test", now: NOW }, { SCRAPECREATORS_API_KEY: "sc-test", GEMINI_API_KEY: "g-test" }, f)
  assert.equal(o.ok, true, JSON.stringify(o))
  assert.equal(o.report.rolki.length, 3)
  assert.equal(o.report.rolki[0].role, "najlepsza")
  assert.equal(o.report.rolki[0].code, "R3")
  assert.ok(o.report.obserwacje.length >= 1 && o.report.obserwacje.length <= 3)
  assert.ok(o.report.obserwacje.some((x) => ["Pierwsze 3 sekundy", "Tempo", "Napisy", "Montaż", "Dźwięk", "Wezwanie w rolce"].includes(x.tytul)))
  // 2 kredyty (profil + rolki); podpisy są w profilu, więc bez dodatkowych zapytań o post.
  assert.equal(o.cost.credits, 2)
  // 3 × (4000 × 0,75 + 1000 × 3,75) / 1e6 = 0,02025 USD + 2 kredyty × 0,00188 (myślenie liczone jako wyjście)
  assert.ok(Math.abs(o.cost.usd - (0.02025 + 2 * 47 / 25000)) < 0.0001, String(o.cost.usd))
  assert.equal(calls.filter((c) => c.includes("generativelanguage")).length, 3)
  const md = renderMarkdown(o)
  assert.match(md, /Kryteria wideo/)
  assert.doesNotMatch(md, /sc-test|g-test/, "klucze nie trafiają do raportu")
})

test("runAuditV2: 402 od ScrapeCreators = brak kredytów, bez płacenia i bez Gemini", async () => {
  const { f, calls } = fakeFetch({ credits402: true })
  const o = await runAuditV2({ handle: "salon.test", now: NOW }, { SCRAPECREATORS_API_KEY: "sc-test", GEMINI_API_KEY: "g-test" }, f)
  assert.equal(o.ok, false)
  assert.equal(o.reason, "brak_kredytow")
  assert.equal(calls.filter((c) => c.includes("generativelanguage")).length, 0)
})

test("runAuditV2: wyczerpany limit miesięczny zatrzymuje audyt przed pierwszym zapytaniem", async () => {
  const { f, calls } = fakeFetch()
  const o = await runAuditV2({ handle: "salon.test", now: NOW, monthSpentUsd: 15 }, { SCRAPECREATORS_API_KEY: "sc-test", GEMINI_API_KEY: "g-test" }, f)
  assert.equal(o.ok, false)
  assert.equal(o.reason, "limit_miesieczny")
  assert.equal(calls.length, 0)
})

test("temat z wideo zamiast emoji z podpisu; zdanie o hooku bez „Brak tekstu”", () => {
  const m = { best: { words: "Ⓜ️4 CS ✈️…", date: "25 sierpnia", views: 1, ratio: 30, permalink: null }, criteria: [{ id: 5, label: "Jeden strzał", valueText: "rolka z 25 sierpnia (Ⓜ️4 CS ✈️…): 1", advice: "Nagraj 3 kolejne na ten sam temat (Ⓜ️4 CS ✈️…), w tym samym formacie.", task: "x" }] }
  applyTopic(m, "Drift samochodów BMW")
  assert.match(m.criteria[0].advice, /\(drift samochodów BMW\)/)
  assert.doesNotMatch(m.criteria[0].valueText, /Ⓜ️/)
  assert.equal(hookSentence({ hook_tekst: "Brak tekstu na ekranie i mowy", mowa: false, napisy_obecne: false }), "W pierwszych 3 sekundach nie ma tekstu na ekranie ani mowy.")
  assert.equal(hookSentence({ hook_tekst: "Ile kosztuje rolka?", mowa: true, napisy_obecne: true }), "Zaczyna się od: „Ile kosztuje rolka?”.")
})

test("runAuditV2: 503 na głównym modelu → model zapasowy, audyt dalej przechodzi", async () => {
  const { f } = fakeFetch()
  const used = []
  const flaky = async (url, init) => {
    const u = String(url)
    if (u.includes("generativelanguage")) {
      used.push(u.split("/models/")[1].split(":")[0])
      if (u.includes("gemini-3.6-flash")) return new Response(JSON.stringify({ error: { message: "high demand" } }), { status: 503 })
    }
    return f(url, init)
  }
  const o = await runAuditV2({ handle: "salon.test", now: NOW }, { SCRAPECREATORS_API_KEY: "sc-test", GEMINI_API_KEY: "g-test" }, flaky)
  assert.equal(o.ok, true)
  assert.equal(o.report.rolki.length, 3)
  assert.ok(o.report.rolki.every((r) => r.model === "gemini-3.5-flash-lite"))
  assert.equal(used.filter((m) => m === "gemini-3.6-flash").length, 3)
})
