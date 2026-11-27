// Ocena jednej rolki przez Gemini (Google AI, generateContent, wideo w zapytaniu). Klucz: GEMINI_API_KEY (tylko na serwerze).
// Plik wideo nie jest nigdzie zapisywany: bufor idzie w zapytaniu i znika po analizie.
import type { CostGuard } from "./config.ts"

type Env = Record<string, string | undefined>

export const VIDEO_KEYS = ["hook", "tempo", "napisy", "montaz", "dzwiek", "cta"] as const
export type VideoKey = (typeof VIDEO_KEYS)[number]
export const VIDEO_LABEL: Record<VideoKey, string> = { hook: "Pierwsze 3 sekundy", tempo: "Tempo", napisy: "Napisy", montaz: "Montaż", dzwiek: "Dźwięk", cta: "Wezwanie w rolce" }

export type VideoScore = { ocena: number; dowod: string; rada: string }
export type ReelAnalysis = Record<VideoKey, VideoScore> & {
  temat: string
  hook_tekst: string
  ciecia_10s: number
  mowa: boolean
  napisy_obecne: boolean
  cta_obecne: boolean
}

const S = (description: string) => ({ type: "STRING", description })
const SCORE = { type: "OBJECT", properties: { ocena: { type: "INTEGER", description: "1–5" }, dowod: S("sekunda i co widać lub słychać"), rada: S("jedno polecenie w trybie rozkazującym") }, required: ["ocena", "dowod", "rada"], propertyOrdering: ["ocena", "dowod", "rada"] }
export const SCHEMA = {
  type: "OBJECT",
  properties: {
    temat: S("temat rolki w 3–6 słowach"),
    hook_tekst: S("dosłownie, co pada lub widnieje w pierwszych 3 s"),
    ciecia_10s: { type: "INTEGER", description: "liczba cięć lub zmian ujęcia w pierwszych 10 s" },
    mowa: { type: "BOOLEAN" },
    napisy_obecne: { type: "BOOLEAN" },
    cta_obecne: { type: "BOOLEAN" },
    ...Object.fromEntries(VIDEO_KEYS.map((k) => [k, SCORE])),
  },
  required: ["temat", "hook_tekst", "ciecia_10s", "mowa", "napisy_obecne", "cta_obecne", ...VIDEO_KEYS],
  propertyOrdering: ["temat", "hook_tekst", "ciecia_10s", "mowa", "napisy_obecne", "cta_obecne", ...VIDEO_KEYS],
}

export const PROMPT = `Jesteś montażystką rolek dla małych firm. Oceń tę rolkę z Instagrama. Pisz po polsku.
Dla każdego kryterium: ocena 1–5 (1 = poważny problem, 3 = przeciętnie, 5 = wzorowo), dowód z nagrania (sekunda i co dokładnie widać lub słychać) i JEDNA rada.
- hook: pierwsze 3 sekundy. Czy od razu wiadomo, o czym jest rolka i dlaczego oglądać dalej (pierwsze zdanie, tekst na ekranie, ruch w kadrze).
- tempo: cięcia i zmiany ujęć, martwe momenty, długie pauzy.
- napisy: czy są, czy czytelne na telefonie, czy zgrane z mową, czy nie zasłania ich interfejs Instagrama.
- montaz: kadr 9:16, przebitki, grafiki, przejścia, ostrość i światło.
- dzwiek: zrozumiałość mowy, muzyka pod głosem, szumy, cisza.
- cta: czy rolka mówi widzowi, co zrobić dalej (komentarz, zapis, link, wiadomość).
Zasady rady: tryb rozkazujący („Zacznij”, „Dodaj”, „Utnij”), jedna czynność możliwa do zrobienia przy następnej rolce, z konkretem z tej rolki.
Zakazane słowa: „warto”, „lepiej”, „może”, „dobrze będzie”. Nie zgaduj: jeśli czegoś nie ma w nagraniu, napisz to wprost.
hook_tekst: dosłownie pierwsze zdanie lub tekst z ekranu. temat: 3–6 słów. ciecia_10s: policz cięcia w pierwszych 10 s.`

export type GeminiResult = { ok: true; analysis: ReelAnalysis; inTok: number; outTok: number; model: string } | { ok: false; reason: "brak_klucza" | "limit_audytu" | "blad"; detail?: string; inTok?: number; outTok?: number; retry?: boolean }

const clamp = (x: unknown) => Math.min(5, Math.max(1, Math.round(Number(x) || 1)))
const str = (x: unknown, max = 400) => (typeof x === "string" ? x.replace(/\s+/g, " ").trim().slice(0, max) : "")

/** Normalizuje odpowiedź modelu (oceny 1–5, teksty przycięte); brak pola = odrzucenie. */
export function parseAnalysis(raw: unknown): ReelAnalysis | null {
  if (!raw || typeof raw !== "object") return null
  const r = raw as Record<string, unknown>
  const out: Partial<ReelAnalysis> = {
    temat: str(r.temat, 80), hook_tekst: str(r.hook_tekst, 200), ciecia_10s: Math.max(0, Math.round(Number(r.ciecia_10s) || 0)),
    mowa: r.mowa === true, napisy_obecne: r.napisy_obecne === true, cta_obecne: r.cta_obecne === true,
  }
  for (const k of VIDEO_KEYS) {
    const v = r[k] as Record<string, unknown> | undefined
    if (!v || typeof v !== "object" || !str(v.rada)) return null
    out[k] = { ocena: clamp(v.ocena), dowod: str(v.dowod, 300), rada: str(v.rada, 300) }
  }
  return out as ReelAnalysis
}

export async function analyzeReel(video: { bytes: Uint8Array; mime: string; seconds: number }, guard: CostGuard, env: Env = process.env, fetchImpl: typeof fetch = fetch, timeoutMs = 75_000, modelOverride?: string): Promise<GeminiResult> {
  const key = env.GEMINI_API_KEY
  if (!key) return { ok: false, reason: "brak_klucza" }
  const est = guard.reserveGemini(video.seconds || 60)
  if (est === null) return { ok: false, reason: "limit_audytu" }
  const model = modelOverride || guard.cfg.model
  const body = {
    contents: [{ role: "user", parts: [{ inline_data: { mime_type: video.mime || "video/mp4", data: Buffer.from(video.bytes).toString("base64") } }, { text: PROMPT }] }],
    generationConfig: { responseMimeType: "application/json", responseSchema: SCHEMA, maxOutputTokens: guard.cfg.maxOutputTokens, temperature: 0.2, mediaResolution: "MEDIA_RESOLUTION_LOW" },
  }
  let r: Response
  try {
    r = await fetchImpl(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`, {
      method: "POST", headers: { "x-goog-api-key": key, "Content-Type": "application/json" }, body: JSON.stringify(body), signal: AbortSignal.timeout(timeoutMs),
    })
  } catch (e) {
    guard.settleGemini(est, 0, 0)
    return { ok: false, reason: "blad", detail: e instanceof Error ? e.message : "fetch", retry: true }
  }
  const j = (await r.json().catch(() => ({}))) as { candidates?: { content?: { parts?: { text?: string }[] } }[]; usageMetadata?: Record<string, number>; error?: { message?: string } }
  const u = j.usageMetadata ?? {}
  const inTok = u.promptTokenCount ?? 0
  const outTok = (u.candidatesTokenCount ?? 0) + (u.thoughtsTokenCount ?? 0)
  // Koszt liczymy zawsze, także przy błędzie po stronie odpowiedzi (tokeny i tak zostały zużyte).
  guard.settleGemini(est, inTok, outTok)
  if (!r.ok) return { ok: false, reason: "blad", detail: `${r.status} ${str(j.error?.message, 160)}`, inTok, outTok, retry: r.status === 429 || r.status >= 500 }
  const text = j.candidates?.[0]?.content?.parts?.map((p) => p.text ?? "").join("") ?? ""
  let parsed: unknown = null
  try { parsed = JSON.parse(text) } catch { /* zła odpowiedź */ }
  const analysis = parseAnalysis(parsed)
  if (!analysis) return { ok: false, reason: "blad", detail: "zly_json", inTok, outTok }
  return { ok: true, analysis, inTok, outTok, model }
}
