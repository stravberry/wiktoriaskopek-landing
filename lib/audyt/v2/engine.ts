// Audyt IG v2: 10 kryteriów liczbowych (core.computeMetrics) + 6 kryteriów wideo z oceny Gemini na wybranych rolkach.
// Kolejność kosztów: profil i rolki (2 kredyty) → wybór rolek → pobranie wideo z CDN (0 kr.) → Gemini (budżet przed każdym wywołaniem).
import { computeMetrics, draftReport, fmt, median, pickObservations, plural, type Metrics, type Report } from "../core.ts"
import { CostGuard, v2Config, type V2Config } from "./config.ts"
import { analyzeReel, VIDEO_KEYS, VIDEO_LABEL, type ReelAnalysis, type VideoKey } from "./gemini.ts"
import { downloadVideo, fetchCaption, fetchProfile, type ScReel } from "./scrape.ts"

type Env = Record<string, string | undefined>

export type ReelReview = { code: string; permalink: string; date: string; views: number | null; ratio: number | null; role: "najlepsza" | "najnowsza"; analysis: ReelAnalysis; model?: string }
export type VideoCriterion = { key: VideoKey; label: string; avg: number; status: "dobrze" | "srednio" | "do_poprawy"; weakness: number; tekst: string; task: string }
export type CompetitorSummary = { handle: string; followers: number; medianViews: number | null; reach: number | null; best: { date: string; views: number | null; hook: string; hookScore: number; temat: string } | null; note?: string }
export type V2Report = Report & { wideo: VideoCriterion[]; rolki: ReelReview[]; konkurencja: CompetitorSummary[] }
export type V2Outcome =
  | { ok: true; handle: string; metrics: Metrics; report: V2Report; cost: ReturnType<CostGuard["summary"]>; skipped: string[] }
  | { ok: false; reason: string; detail?: string; cost: ReturnType<CostGuard["summary"]> }

const dateLabel = (iso: string) => new Date(iso).toLocaleDateString("pl-PL", { day: "numeric", month: "long", timeZone: "Europe/Warsaw" })
const BANNED = /(?<!\p{L})(warto|lepiej|dobrze będzie|może|wygląda stabilnie|przestrzeń do|przy tym układzie)(?!\p{L})/iu
/** Rada zapasowa, gdy tekst modelu łamie zasady tonu (Kierownik, B). */
const FALLBACK: Record<VideoKey, string> = {
  hook: "Zacznij następną rolkę od zdania, które nazywa problem widza, i pokaż je też jako tekst na ekranie w 1. sekundzie.",
  tempo: "Utnij każdą pauzę dłuższą niż pół sekundy i zmieniaj ujęcie co 2–3 sekundy.",
  napisy: "Dodaj napisy do całej mowy, dużą czcionką w środkowej części kadru, poza paskiem przycisków Instagrama.",
  montaz: "Dodaj co najmniej 2 przebitki, które pokazują to, o czym mówisz.",
  dzwiek: "Nagrywaj mowę mikrofonem przypiętym do ubrania i ścisz muzykę pod głosem.",
  cta: "Powiedz na końcu rolki jedno zdanie, co widz ma zrobić, np. „Napisz w komentarzu SŁOWO, a wyślę Ci listę”.",
}
const clean = (s: string, key: VideoKey) => (s && !BANNED.test(s) ? s : FALLBACK[key])

/** Temat rolki z oceny wideo zamiast początku podpisu (podpisy bywają samymi emoji i hasztagami). */
export function applyTopic(m: Metrics, temat: string) {
  if (!m.best || !temat) return
  const from = `(${m.best.words})`
  const to = `(${temat.charAt(0).toLowerCase()}${temat.slice(1)})`
  m.best.words = temat
  for (const c of m.criteria) {
    c.valueText = c.valueText.split(from).join(to)
    c.advice = c.advice.split(from).join(to)
    if (c.task) c.task = c.task.split(from).join(to)
  }
}

/** Zdanie o początku najlepszej rolki; gdy w 3 s nie ma tekstu ani mowy, mówimy to wprost. */
export function hookSentence(a: Pick<ReelAnalysis, "hook_tekst" | "mowa" | "napisy_obecne">) {
  const t = a.hook_tekst.trim()
  if (!t || /^(brak|nie ma|bez )/i.test(t)) return "W pierwszych 3 sekundach nie ma tekstu na ekranie ani mowy."
  return `Zaczyna się od: „${t.replace(/[„”"]/g, "")}”.`
}

/** Rolki do analizy: najlepsza z 12 ostatnich (wyświetlenia) + najnowsze, które mają plik wideo i rozsądną długość. */
export function pickReels(reels: ScReel[], cfg: Pick<V2Config, "ownReels" | "maxVideoSeconds">): { reel: ScReel; role: ReelReview["role"] }[] {
  const pool = reels.slice(0, 12).filter((r) => r.videoUrl && (r.duration === null || r.duration <= cfg.maxVideoSeconds))
  if (!pool.length) return []
  const best = pool.filter((r) => r.views !== null).sort((a, b) => (b.views as number) - (a.views as number))[0] ?? null
  const out: { reel: ScReel; role: ReelReview["role"] }[] = best ? [{ reel: best, role: "najlepsza" }] : []
  for (const r of pool) {
    if (out.length >= cfg.ownReels) break
    if (!out.some((o) => o.reel.code === r.code)) out.push({ reel: r, role: "najnowsza" })
  }
  return out
}

/** Średnia ocen każdego kryterium wideo; rada i dowód z rolki z najniższą oceną (konkret z nagrania, nie ogólnik). */
export function aggregateVideo(reviews: ReelReview[]): VideoCriterion[] {
  if (!reviews.length) return []
  return VIDEO_KEYS.map((key) => {
    const scores = reviews.map((r) => r.analysis[key].ocena)
    const avg = Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 10) / 10
    const worst = [...reviews].sort((a, b) => a.analysis[key].ocena - b.analysis[key].ocena)[0]
    const status = avg < 2.5 ? "do_poprawy" : avg < 3.5 ? "srednio" : "dobrze"
    const s = worst.analysis[key]
    const rada = clean(s.rada, key)
    const n = reviews.length
    const d = s.dowod.replace(/\.$/, "")
    const dowod = /^[A-ZĄĆĘŁŃÓŚŹŻ](?=[a-ząćęłńóśźż ])/.test(d) ? d.charAt(0).toLowerCase() + d.slice(1) : d
    const tekst = `Ocena ${fmt(avg, 1).replace(".", ",")}/5 w ${fmt(n)} ${plural(n, "rolce", "rolkach", "rolkach")}. W rolce z ${worst.date}: ${dowod}. ${rada}`
    return { key, label: VIDEO_LABEL[key], avg, status, weakness: status === "dobrze" ? 0 : (4 - avg) / 4, tekst, task: `Przy 3 kolejnych rolkach: ${rada.charAt(0).toLowerCase()}${rada.slice(1)}` }
  })
}

const RANK = { do_poprawy: 0, srednio: 1 } as const
type Obs = { tytul: string; tekst: string; status: "do_poprawy" | "srednio"; weakness: number; task: string; video: boolean }

/** Punkty do maila: najwyżej 3 z kryteriów liczbowych i wideo razem (najpierw „do poprawy”); co najmniej 1 z wideo, jeśli jest słabe. */
export function mergeObservations(m: Metrics, video: VideoCriterion[]): Obs[] {
  const num: Obs[] = m.enough ? pickObservations(m).weakest.map((c) => ({ tytul: c.label, tekst: c.advice, status: c.status as Obs["status"], weakness: c.weakness, task: c.task ?? c.advice, video: false })) : []
  const vid: Obs[] = video.filter((v) => v.status !== "dobrze").map((v) => ({ tytul: v.label, tekst: v.tekst, status: v.status as Obs["status"], weakness: v.weakness, task: v.task, video: true }))
  const all = [...num, ...vid].sort((a, b) => RANK[a.status] - RANK[b.status] || b.weakness - a.weakness)
  const top = all.slice(0, 3)
  if (vid.length && !top.some((o) => o.video)) top[Math.min(2, top.length)] = vid.sort((a, b) => RANK[a.status] - RANK[b.status] || b.weakness - a.weakness)[0]
  return top.filter(Boolean)
}

async function reviewReel(reel: ScReel, role: ReelReview["role"], guard: CostGuard, env: Env, fetchImpl: typeof fetch, medianViews: number | null): Promise<ReelReview | string> {
  const cfg = guard.cfg
  if (!reel.videoUrl) return `${reel.code}: brak pliku wideo`
  if (!guard.canGemini(reel.duration ?? 60)) return `${reel.code}: limit kosztu audytu`
  const v = await downloadVideo(reel.videoUrl, cfg.maxVideoBytes, fetchImpl)
  if (!v.ok) return `${reel.code}: wideo ${v.reason}`
  const video = { bytes: v.bytes, mime: v.mime, seconds: reel.duration ?? 60 }
  let a = await analyzeReel(video, guard, env, fetchImpl, 45_000)
  // Przeciążenie (503/429) albo przekroczony czas: jedna próba na modelu zapasowym (koszt pierwszej próby już policzony w limicie).
  if (!a.ok && a.retry && cfg.fallbackModel && cfg.fallbackModel !== cfg.model) a = await analyzeReel(video, guard, env, fetchImpl, 60_000, cfg.fallbackModel)
  if (!a.ok) return `${reel.code}: Gemini ${a.reason}${a.detail ? ` (${a.detail})` : ""}`
  return { code: reel.code, permalink: reel.permalink, date: dateLabel(reel.timestamp), views: reel.views, ratio: medianViews && reel.views !== null ? reel.views / medianViews : null, role, analysis: a.analysis, model: a.model }
}

export async function runAuditV2(input: { handle: string; competitors?: string[]; monthSpentUsd?: number; now?: number }, env: Env = process.env, fetchImpl: typeof fetch = fetch): Promise<V2Outcome> {
  const cfg = v2Config(env)
  const guard = new CostGuard(cfg, input.monthSpentUsd ?? 0)
  if (guard.limitUsd <= 0) return { ok: false, reason: "limit_miesieczny", cost: guard.summary() }
  const skipped: string[] = []

  const p = await fetchProfile(input.handle, guard, env, fetchImpl)
  if (!p.ok) return { ok: false, reason: p.reason, detail: p.detail, cost: guard.summary() }
  if (p.data.isPrivate) return { ok: false, reason: "prywatny", cost: guard.summary() }
  const metrics = computeMetrics(p.data.profile, "scrape", input.now)

  const views = p.data.reels.slice(0, 6).map((r) => r.views).filter((x): x is number => x !== null)
  const med = views.length ? median(views) : null
  const reviews: ReelReview[] = []
  // Podpisy z profilu (0 kredytów); dopytujemy o post tylko, gdy podpisu nie ma ani w profilu, ani na liście rolek.
  const captions = new Map(p.data.profile.media.map((m) => [m.permalink?.split("/").filter(Boolean).pop(), m.caption]))
  const picked = pickReels(p.data.reels, cfg)
  for (const { reel } of picked) {
    reel.caption = reel.caption ?? captions.get(reel.code) ?? null
    if (!reel.caption && guard.canCredits(1)) reel.caption = await fetchCaption(reel.permalink, guard, env, fetchImpl)
  }
  // Rolki równolegle (czas funkcji Vercel); limit kosztu pilnuje rezerwacja przed każdym wywołaniem Gemini.
  const results = await Promise.all(picked.map(({ reel, role }) => reviewReel(reel, role, guard, env, fetchImpl, med)))
  for (const r of results) {
    if (typeof r === "string") skipped.push(r)
    else reviews.push(r)
  }
  reviews.sort((a, b) => (a.role === "najlepsza" ? -1 : b.role === "najlepsza" ? 1 : 0))

  const konkurencja: CompetitorSummary[] = []
  for (const h of (input.competitors ?? []).slice(0, cfg.maxCompetitors)) {
    const c = await fetchProfile(h, guard, env, fetchImpl)
    if (!c.ok || c.data.isPrivate) { konkurencja.push({ handle: h, followers: 0, medianViews: null, reach: null, best: null, note: c.ok ? "konto prywatne" : c.reason }); continue }
    const cv = c.data.reels.slice(0, 6).map((r) => r.views).filter((x): x is number => x !== null)
    const cm = cv.length ? median(cv) : null
    const top = pickReels(c.data.reels, { ...cfg, ownReels: 1 })[0]
    let best: CompetitorSummary["best"] = null
    if (top) {
      const r = await reviewReel(top.reel, "najlepsza", guard, env, fetchImpl, cm)
      if (typeof r === "string") skipped.push(`@${h} ${r}`)
      else best = { date: r.date, views: r.views, hook: r.analysis.hook_tekst, hookScore: r.analysis.hook.ocena, temat: r.analysis.temat }
    }
    konkurencja.push({ handle: h, followers: c.data.profile.followers_count, medianViews: cm, reach: cm !== null ? cm / Math.max(1, c.data.profile.followers_count) : null, best })
  }

  if (!metrics.enough && !reviews.length) return { ok: false, reason: "za_malo_danych", detail: skipped.join("; "), cost: guard.summary() }
  const bestReview = reviews.find((r) => r.role === "najlepsza")
  if (bestReview && metrics.best) applyTopic(metrics, bestReview.analysis.temat)
  const wideo = aggregateVideo(reviews)
  const base = metrics.enough ? draftReport(metrics, input.handle) : { ocena: "", najlepsza: null, obserwacje: [], pochwala: null, nastepny: null, zadanie: "", uwaga: "" }
  const obs = mergeObservations(metrics, wideo)
  const najlepsza = base.najlepsza && bestReview ? `${base.najlepsza} ${hookSentence(bestReview.analysis)}` : base.najlepsza
  const good = wideo.filter((v) => v.status === "dobrze").map((v) => v.label.toLowerCase())
  const report: V2Report = {
    ...base,
    ocena: base.ocena || (obs[0] ? obs[0].tekst.split(". ")[0] + "." : ""),
    najlepsza,
    obserwacje: obs.map((o) => ({ tytul: o.tytul, tekst: o.tekst })),
    pochwala: [base.pochwala, good.length ? `W rolkach dobrze wypadają: ${good.join(", ")}.` : null].filter(Boolean).join(" ") || null,
    zadanie: obs[0]?.task ?? base.zadanie,
    wideo,
    rolki: reviews,
    konkurencja,
  }
  return { ok: true, handle: input.handle, metrics, report, cost: guard.summary(), skipped }
}

/** Wersja do przeglądu (Markdown): mail 0 + pełne oceny rolek i koszty. Dla Wiktorii i panelu, nie dla klienta. */
export function renderMarkdown(o: Extract<V2Outcome, { ok: true }>): string {
  const r = o.report
  const L: string[] = []
  L.push(`# Audyt Instagrama v2: @${o.handle}`, "")
  L.push("## Mail do klienta (szkic)", "", r.ocena, "")
  if (r.najlepsza) L.push(r.najlepsza, "")
  r.obserwacje.forEach((x, i) => L.push(`**${i + 1}. ${x.tytul}.** ${x.tekst}`, ""))
  if (r.pochwala) L.push(r.pochwala, "")
  L.push(`**Zadanie na ten tydzień:** ${r.zadanie}`, "")
  L.push("## Kryteria wideo (średnia z analizowanych rolek)", "", "| Kryterium | Ocena | Status |", "|---|---|---|")
  for (const v of r.wideo) L.push(`| ${v.label} | ${String(v.avg).replace(".", ",")}/5 | ${v.status.replace("_", " ")} |`)
  L.push("", "## Ocenione rolki", "")
  for (const x of r.rolki) {
    L.push(`### ${x.date} · ${x.role} · ${x.views !== null ? `${fmt(x.views)} wyświetleń` : "bez liczby wyświetleń"}${x.ratio ? ` (${String(Math.round(x.ratio * 10) / 10).replace(".", ",")}× mediany)` : ""}`)
    L.push(`[link](${x.permalink}) · model: ${x.model ?? "?"} · temat: ${x.analysis.temat} · cięcia w 10 s: ${x.analysis.ciecia_10s} · mowa: ${x.analysis.mowa ? "tak" : "nie"} · napisy: ${x.analysis.napisy_obecne ? "tak" : "nie"} · CTA: ${x.analysis.cta_obecne ? "tak" : "nie"}`, "")
    L.push(`Pierwsze 3 s: „${x.analysis.hook_tekst}”`, "", "| Kryterium | Ocena | Dowód | Rada |", "|---|---|---|---|")
    for (const k of VIDEO_KEYS) L.push(`| ${VIDEO_LABEL[k]} | ${x.analysis[k].ocena}/5 | ${x.analysis[k].dowod} | ${x.analysis[k].rada} |`)
    L.push("")
  }
  if (r.konkurencja.length) {
    L.push("## Konkurencja", "")
    for (const c of r.konkurencja) L.push(`- @${c.handle}: ${c.note ?? `${fmt(c.followers)} obserwujących, zwykła rolka ${c.medianViews !== null ? fmt(c.medianViews) : "?"} wyświetleń${c.best ? `; najlepsza (${c.best.date}) zaczyna się od „${c.best.hook}” (hook ${c.best.hookScore}/5)` : ""}`}`)
    L.push("")
  }
  L.push("## 10 kryteriów liczbowych", "", "| # | Kryterium | Wartość | Status |", "|---|---|---|---|")
  for (const c of o.metrics.criteria) L.push(`| ${c.id} | ${c.label} | ${c.valueText} | ${c.status.replace("_", " ")} |`)
  L.push("", "## Koszt", "", `${fmt(o.cost.credits)} kredytów ScrapeCreators, Gemini ${fmt(o.cost.geminiIn)} tokenów wejścia i ${fmt(o.cost.geminiOut)} wyjścia, razem ${String(o.cost.usd).replace(".", ",")} USD (limit tego audytu ${String(Math.round(o.cost.limitUsd * 100) / 100).replace(".", ",")} USD).`)
  if (o.skipped.length) L.push("", `Pominięte: ${o.skipped.join("; ")}`)
  return L.join("\n")
}
