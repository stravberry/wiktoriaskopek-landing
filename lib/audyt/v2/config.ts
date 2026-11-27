// Audyt IG v2 (zestaw zaakceptowany przez Wiktorię 27.11.2026, RESEARCH-AUDYT-IG.md):
// liczby z profilu (Meta Business Discovery, a bez tokena Meta: ScrapeCreators), wideo wybranych rolek (CDN Instagrama z linku
// ScrapeCreators, bez dodatkowych kredytów), ocena rolek przez Gemini Flash (hook 3 s, tempo, napisy, montaż, dźwięk, CTA).
// Czysta logika bez Next i bazy (node --test czyta plik bezpośrednio).

type Env = Record<string, string | undefined>
const num = (v: string | undefined, d: number) => (v !== undefined && v !== "" && Number.isFinite(Number(v)) ? Number(v) : d)

/** Silnik v2 włączony (wewnętrznie). Publiczny formularz i tak zależy od AUDYT_ENABLED=1 (core.audytEnabled). */
export const v2Enabled = (env: Env = process.env) => env.AUDYT_V2 === "1"
export const scrapeConfigured = (env: Env = process.env) => Boolean(env.SCRAPECREATORS_API_KEY)
export const geminiConfigured = (env: Env = process.env) => Boolean(env.GEMINI_API_KEY)

export function v2Config(env: Env = process.env) {
  // Twarde limity w kodzie: zmienne mogą je tylko obniżyć (Math.min), nigdy podnieść ponad wartości poniżej.
  const HARD = { perAuditUsd: 1.5, monthlyUsd: 15, creditsPerAudit: 20 }
  return {
    // Test 3 (27.11): 3.6 Flash trafniej ocenia montaż i tempo niż 3.5 Flash Lite (np. wykrył powtórzony dialog), ok. 0,01 USD za rolkę 30 s.
    model: env.AUDYT_GEMINI_MODEL || "gemini-3.6-flash",
    /** Zapas przy 503 „high demand”, 429 i przekroczeniu czasu (darmowy plan Gemini bywa przeciążony). Tańszy, więc limit liczony po cenie głównego modelu jest bezpieczny. */
    fallbackModel: env.AUDYT_GEMINI_FALLBACK || "gemini-3.5-flash-lite",
    /** USD za 1 mln tokenów (cennik Gemini 3.6 Flash, 27.11.2026); myślenie liczone jako wyjście. */
    price: { input: num(env.AUDYT_GEMINI_PRICE_IN, 0.75), output: num(env.AUDYT_GEMINI_PRICE_OUT, 3.75) },
    /** Kredyt ScrapeCreators w USD (paczka 25 000 kr. = 47 USD). Darmowe 100 kredytów liczymy po tej samej cenie, żeby limit był uczciwy. */
    usdPerCredit: 47 / 25000,
    perAuditUsd: Math.min(HARD.perAuditUsd, num(env.AUDYT_V2_PER_AUDIT_USD, HARD.perAuditUsd)),
    monthlyUsd: Math.min(HARD.monthlyUsd, num(env.AUDYT_V2_MONTHLY_USD, HARD.monthlyUsd)),
    creditsPerAudit: Math.min(HARD.creditsPerAudit, num(env.AUDYT_V2_CREDITS, HARD.creditsPerAudit)),
    /** Rolki do analizy wideo: najlepsza + najnowsze, razem najwyżej tyle. */
    ownReels: Math.min(4, num(env.AUDYT_V2_REELS, 3)),
    /** Konkurenci (opcjonalnie): najwyżej 3, z każdego 1 najlepsza rolka. */
    maxCompetitors: 3,
    maxVideoBytes: 18 * 1024 * 1024,
    maxVideoSeconds: 120,
    /** Szacunek tokenów wideo przy niskiej rozdzielczości mediów (do budżetu przed wywołaniem). */
    tokensPerSecond: 100,
    maxOutputTokens: 2500,
  }
}
export type V2Config = ReturnType<typeof v2Config>

/** Licznik kosztu jednego audytu: każde płatne wywołanie najpierw pyta, czy się zmieści. */
export class CostGuard {
  usd = 0
  credits = 0
  geminiIn = 0
  geminiOut = 0
  /** Szacunek wywołań Gemini w toku (równoległe rolki): limit liczy wydane + zarezerwowane. */
  reserved = 0
  readonly cfg: V2Config
  readonly monthSpentUsd: number
  constructor(cfg: V2Config, monthSpentUsd = 0) { this.cfg = cfg; this.monthSpentUsd = monthSpentUsd }
  get limitUsd() { return Math.max(0, Math.min(this.cfg.perAuditUsd, this.cfg.monthlyUsd - this.monthSpentUsd)) }
  canCredits(n: number) { return this.credits + n <= this.cfg.creditsPerAudit && this.usd + this.reserved + n * this.cfg.usdPerCredit <= this.limitUsd }
  addCredits(n: number) { this.credits += n; this.usd += n * this.cfg.usdPerCredit }
  geminiCost(inTok: number, outTok: number) { return (inTok * this.cfg.price.input + outTok * this.cfg.price.output) / 1_000_000 }
  estimateGemini(seconds: number) { return this.geminiCost(1200 + Math.ceil(seconds) * this.cfg.tokensPerSecond, this.cfg.maxOutputTokens) }
  canGemini(seconds: number) { return this.usd + this.reserved + this.estimateGemini(seconds) <= this.limitUsd }
  /** Rezerwuje szacunek przed wywołaniem; null = nie mieści się w limicie. */
  reserveGemini(seconds: number) {
    const est = this.estimateGemini(seconds)
    if (this.usd + this.reserved + est > this.limitUsd) return null
    this.reserved += est
    return est
  }
  /** Zamienia rezerwację na faktyczny koszt (także 0 tokenów przy błędzie sieci). */
  settleGemini(est: number, inTok: number, outTok: number) { this.reserved = Math.max(0, this.reserved - est); this.addGemini(inTok, outTok) }
  addGemini(inTok: number, outTok: number) { this.geminiIn += inTok; this.geminiOut += outTok; this.usd += this.geminiCost(inTok, outTok) }
  summary() { return { usd: Math.round(this.usd * 100000) / 100000, credits: this.credits, geminiIn: this.geminiIn, geminiOut: this.geminiOut, limitUsd: this.limitUsd } }
}
