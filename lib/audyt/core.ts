// Darmowy audyt Instagrama (plan C, decyzje Wiktorii 27.11.2026): czysta logika bez Next i bazy.
// 10 kryteriów, progi i rady: Kierownik, Shared/wiktoriaskopek-audyt-ig-kryteria.md (progi startowe do kalibracji po 30 audytach).
// Bez importów aliasów, żeby `node --test` czytał plik bezpośrednio.

export type IgMedia = {
  timestamp: string
  media_type?: string
  media_product_type?: string
  like_count?: number | null
  comments_count?: number | null
  view_count?: number | null
  caption?: string | null
  permalink?: string | null
}
export type IgProfile = {
  username: string
  name?: string | null
  biography?: string | null
  website?: string | null
  followers_count: number
  media_count: number
  media: IgMedia[]
}
/** Konto prywatne albo brak danych z Meta: 4 liczby od właściciela profilu. */
export type ManualData = { followers: number; avgViews: number; posts30: number; reels30: number }

export type AuditInput = {
  handle: string
  email: string
  profileType: "firma" | "marka" | "prywatny"
  whoMakes: "ja" | "zespol" | "agencja" | "nikt"
  budget: "0" | "do1k" | "1-5k" | "5k+"
  ownerDeclared: true
  newsletter: boolean
  manual: ManualData | null
}

/**
 * Czy darmowy audyt IG jest włączony: formularz i sekcje na stronie głównej, przyjmowanie zgłoszeń, analiza w kolejce.
 * 27.11.2026 Wiktoria: „na razie to wyłącz ze strony głównej i ukryj sekcje z tym związane”. Domyślnie WYŁĄCZONY.
 * Przywrócenie: AUDYT_ENABLED=1 w Vercel (Production) i ponowne wdrożenie. Polityka (sekcja 8) i /admin/audyty działają zawsze.
 */
export const audytEnabled = (env: Record<string, string | undefined> = process.env) => env.AUDYT_ENABLED === "1"

export const AUDYT = {
  dailyCap: 15, // nowych zgłoszeń na dobę (darmowy Resend: 100 maili / dobę razem ze sklepem)
  mailDaily: 70, // maili funkcji audytu na dobę; sekwencja czeka, gdy limit się wyczerpie
  perIpDay: 5,
  repeatDays: 30, // 1 audyt na e-mail i na profil
  confirmHours: 24,
  reviewFirst: 30, // tyle pierwszych audytów akceptuje Wiktoria
  aiMonthlyUsd: 5, // twardy limit kosztu modelu w miesiącu
  model: "gpt-5.4-mini",
  // Cennik OpenAI (developers.openai.com/api/docs/models/gpt-5.4-mini), sprawdzony 27.11.2026: USD za 1 mln tokenów.
  price: { input: 0.75, output: 4.5 },
  maxOutputTokens: 2500,
} as const

export const AUDYT_TEXT = {
  owner: "To mój profil albo profil firmy, którym zarządzam.",
  newsletter:
    "Chcę dostawać porady o rolkach i marketingu od Wiktorii Skopek (najwyżej 1 mail w tygodniu, zgoda dobrowolna, mogę ją cofnąć w każdej chwili). Audyt dostanę bez względu na tę zgodę.",
  newsletterVersion: "porady-2026-11-27",
  notSeen: "Nie widzimy statystyk z Twojego panelu (zasięg, zapisy, udostępnienia, czas oglądania), więc ich nie oceniamy.",
  tooLittle: "Za mało danych do audytu. Opublikuj co najmniej 3 rolki albo przełącz konto na firmowe lub twórcy.",
} as const

const DISPOSABLE = ["mailinator.com", "10minutemail.com", "guerrillamail.com", "tempmail.com", "temp-mail.org", "yopmail.com", "trashmail.com", "sharklasers.com", "getnada.com", "dispostable.com"]

export const HANDLE_RE = /^[a-z0-9._]{1,30}$/

/** „@Ania.Studio”, „instagram.com/ania.studio/” → „ania.studio”. null = zła nazwa. */
export function parseHandle(raw: unknown): string | null {
  if (typeof raw !== "string") return null
  let s = raw.trim().toLowerCase()
  const m = s.match(/^(?:https?:\/\/)?(?:www\.)?instagram\.com\/([^/?#]+)/)
  if (m) s = m[1]
  s = s.replace(/^@/, "").replace(/\/+$/, "")
  if (!HANDLE_RE.test(s) || s.startsWith(".") || s.endsWith(".") || s.includes("..")) return null
  return s
}

const num = (v: unknown, max: number) => {
  const n = typeof v === "number" ? v : typeof v === "string" ? Number(v.replace(/\s/g, "").replace(",", ".")) : NaN
  return Number.isFinite(n) && n >= 0 && n <= max ? Math.round(n) : null
}

export function parseManual(raw: unknown): ManualData | null {
  if (!raw || typeof raw !== "object") return null
  const r = raw as Record<string, unknown>
  const followers = num(r.followers, 100_000_000)
  const avgViews = num(r.avgViews, 1_000_000_000)
  const posts30 = num(r.posts30, 300)
  const reels30 = num(r.reels30, 300)
  if (followers === null || avgViews === null || posts30 === null || reels30 === null) return null
  if (followers < 1 || reels30 > posts30) return null
  return { followers, avgViews, posts30, reels30 }
}

export type ParseResult = { ok: true; input: AuditInput } | { ok: false; error: string }

export function parseAuditInput(body: unknown): ParseResult {
  const b = (body && typeof body === "object" ? body : {}) as Record<string, unknown>
  const handle = parseHandle(b.handle)
  if (!handle) return { ok: false, error: "Podaj nazwę profilu na Instagramie, np. @twoja.firma." }
  const email = typeof b.email === "string" ? b.email.trim().toLowerCase() : ""
  if (!/^[^\s@]{1,64}@[^\s@]{1,255}\.[^\s@]{2,}$/.test(email)) return { ok: false, error: "Podaj prawidłowy adres e-mail." }
  if (DISPOSABLE.includes(email.split("@")[1] ?? "")) return { ok: false, error: "Podaj swój stały adres e-mail, nie jednorazowy." }
  const profileType = b.profileType
  if (profileType !== "firma" && profileType !== "marka" && profileType !== "prywatny") return { ok: false, error: "Zaznacz, jaki to profil." }
  const whoMakes = b.whoMakes
  if (whoMakes !== "ja" && whoMakes !== "zespol" && whoMakes !== "agencja" && whoMakes !== "nikt") return { ok: false, error: "Zaznacz, kto robi Twoje rolki." }
  const budget = b.budget
  if (budget !== "0" && budget !== "do1k" && budget !== "1-5k" && budget !== "5k+") return { ok: false, error: "Zaznacz miesięczny budżet na marketing." }
  if (b.owner !== true) return { ok: false, error: "Robimy audyt tylko Twojego profilu albo profilu, którym zarządzasz. Potwierdź to, zaznaczając pole." }
  let manual: ManualData | null = null
  if (b.manual != null) {
    manual = parseManual(b.manual)
    if (!manual) return { ok: false, error: "Sprawdź 4 liczby: obserwujący, średnie wyświetlenia rolki, publikacje i rolki z ostatnich 30 dni." }
  }
  return { ok: true, input: { handle, email, profileType, whoMakes, budget, ownerDeclared: true, newsletter: b.newsletter === true, manual } }
}

/** Segment z 3 pól (Kierownik, tabela „co komu”). */
export function segmentFor(i: Pick<AuditInput, "profileType" | "whoMakes" | "budget">): "rozmowa" | "mf" | "porady" {
  if (i.profileType === "prywatny" || i.budget === "0") return "porady"
  if (i.whoMakes === "ja") return "mf"
  if (i.budget === "1-5k" || i.budget === "5k+") return "rozmowa"
  return "porady"
}

// ---------- liczby ----------

/** Odmiana: 1 publikacja, 2–4 publikacje, 5+ publikacji (12–14 zawsze „publikacji”). */
export function plural(n: number, one: string, few: string, many: string) {
  if (n === 1) return one
  const d = n % 10, t = n % 100
  return d >= 2 && d <= 4 && (t < 12 || t > 14) ? few : many
}

export const median = (xs: number[]) => {
  if (!xs.length) return 0
  const s = [...xs].sort((a, b) => a - b)
  const m = Math.floor(s.length / 2)
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2
}

/** Liczba po polsku: 1 234, 0,8, 12%. */
export function fmt(n: number, digits = 0) {
  const v = Number.isFinite(n) ? n : 0
  return v.toLocaleString("pl-PL", { minimumFractionDigits: 0, maximumFractionDigits: digits }).replace(/ /g, " ")
}
/** „pojawiła się 1 publikacja”, „pojawiły się 3 publikacje”, „pojawiło się 5 publikacji”. */
export const postsPhrase = (n: number) =>
  n === 1 ? "pojawiła się 1 publikacja" : `${plural(n, "", "pojawiły się", "pojawiło się") || "pojawiło się"} ${fmt(n)} ${plural(n, "publikacja", "publikacje", "publikacji")}`

/** Proporcja słowami zamiast „0,38×”: „38%”; powyżej 100% też procentem („150%”). */
const pctOf = (x: number) => `${fmt(Math.round(x * 100))}%`
const pct = (x: number) => `${fmt(x * 100, x < 0.1 ? 1 : 0)}%`
const dateLabel = (iso: string) => new Date(iso).toLocaleDateString("pl-PL", { day: "numeric", month: "long", timeZone: "Europe/Warsaw" })
const firstWords = (s: string | null | undefined, n = 6) => {
  const w = (s ?? "").replace(/\s+/g, " ").trim().split(" ").filter(Boolean)
  return w.length ? `„${w.slice(0, n).join(" ")}${w.length > n ? "…" : ""}”` : "bez podpisu"
}

const CTA_WORDS = /(napisz|umów|umow|pobierz|sprawdź|sprawdz|kup|zapisz|link|zadzwoń|zadzwon|dm|wiadomość|wiadomosc|www\.|https?:\/\/|\.pl\b|\.com\b)/i
const CAPTION_CTA = /(napisz|skomentuj|komentarz|zapisz|link w bio|dm|wiadomość|wiadomosc|udostępnij|udostepnij|oznacz|\?)/i
const BIO_WHO = /(pomagam|dla |uczę|ucze|robię|robie|tworzę|tworze|specjaliz|oferuj|studio|salon|gabinet|sklep|agencja|usług|uslug|trener|coach|fizjo|kosmetolog|fotograf|architekt|prawnik|księgow|ksiegow)/i

export type CriterionId = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10
export type Criterion = {
  id: CriterionId
  label: string
  value: number | null
  valueText: string
  status: "dobrze" | "srednio" | "do_poprawy" | "brak"
  /** 0 = dobrze; im więcej, tym dalej od progu „dobrze”. */
  weakness: number
  /** Rada w trybie rozkazującym (Kierownik, poprawki 27.11: polecenie, nie „warto”). */
  advice: string
  /** Jedna czynność na ten tydzień, z liczbą. */
  task?: string
}

const isReel = (m: IgMedia) => m.media_product_type === "REELS" || (m.media_type === "VIDEO" && m.media_product_type !== "STORY")
const dayMs = 86_400_000

function rate(value: number, good: number, bad: number, higherBetter = true) {
  if (higherBetter) {
    const status = value >= good ? "dobrze" : value < bad ? "do_poprawy" : "srednio"
    return { status, weakness: value >= good ? 0 : (good - value) / good } as const
  }
  const status = value <= good ? "dobrze" : value > bad ? "do_poprawy" : "srednio"
  return { status, weakness: value <= good ? 0 : (value - good) / good } as const
}

export type Metrics = {
  source: "meta" | "reczne" | "test" | "scrape"
  enough: boolean
  followers: number
  reelsMedianViews: number | null
  best: { date: string; words: string; views: number; ratio: number; permalink: string | null } | null
  criteria: Criterion[]
}

/** 10 kryteriów z danych Business Discovery (okno: 12 ostatnich publikacji, 6 ostatnich rolek). */
export function computeMetrics(p: IgProfile, source: "meta" | "test" | "scrape", now = Date.now()): Metrics {
  const media = [...p.media].filter((m) => m.timestamp).sort((a, b) => +new Date(b.timestamp) - +new Date(a.timestamp))
  const last12 = media.slice(0, 12)
  const reels = media.filter(isReel).filter((m) => typeof m.view_count === "number").slice(0, 6)
  const followers = Math.max(1, p.followers_count)
  if (reels.length < 3) return { source, enough: false, followers, reelsMedianViews: null, best: null, criteria: [] }

  const views = reels.map((m) => m.view_count as number)
  const med = median(views)
  const c: Criterion[] = []

  // 1. Zasięg rolek poza obserwujących
  const reach = med / followers
  c.push({ id: 1, label: "Zasięg rolek", value: reach, valueText: `zwykłą rolkę ogląda ${fmt(med)} osób, czyli ${pctOf(reach)} obserwujących`, ...rate(reach, 1, 0.3),
    advice: `Zwykłą rolkę ogląda ${fmt(med)} osób, czyli ${pctOf(reach)} obserwujących. Zacznij każdą rolkę zdaniem o problemie widza, a nie o sobie.`,
    task: "Nagraj w tym tygodniu 2 rolki, które w pierwszym zdaniu nazywają problem widza." })

  // 2. Regularność: publikacje z 30 dni
  const posts30 = media.filter((m) => now - +new Date(m.timestamp) <= 30 * dayMs).length
  c.push({ id: 2, label: "Regularność", value: posts30, valueText: `${fmt(posts30)} ${plural(posts30, "publikacja", "publikacje", "publikacji")} w ostatnich 30 dniach`, ...rate(posts30, 8, 4),
    advice: `W ostatnich 30 dniach na profilu ${postsPhrase(posts30)}. Ustaw 2 rolki w tygodniu, w te same dni.`, task: "Nagraj w tym tygodniu 4 rolki naraz i zaplanuj je na 2 kolejne tygodnie." })

  // 3. Najdłuższa przerwa w 60 dniach (z przerwą od ostatniej publikacji do dziś)
  // Granica 60 dni tylko wtedy, gdy dane sięgają dalej (API zwraca 25 ostatnich publikacji).
  const in60 = media.filter((m) => now - +new Date(m.timestamp) <= 60 * dayMs).map((m) => +new Date(m.timestamp))
  const coversAll = media.some((m) => now - +new Date(m.timestamp) > 60 * dayMs)
  const points = coversAll ? [now, ...in60, now - 60 * dayMs] : [now, ...in60]
  let gap = 0
  for (let i = 1; i < points.length; i++) gap = Math.max(gap, (points[i - 1] - points[i]) / dayMs)
  gap = Math.round(gap)
  // Okno krótsze niż 60 dni (rzadkie publikacje, limit 25 z API): podajemy faktyczny zakres (Kierownik, F).
  const span = coversAll || !media.length ? 60 : Math.max(1, Math.round((now - +new Date(media[media.length - 1].timestamp)) / dayMs))
  c.push({ id: 3, label: "Przerwy w publikacjach", value: gap, valueText: `najdłuższa przerwa ${fmt(gap)} ${gap === 1 ? "dzień" : "dni"} w ostatnich ${fmt(span)} dniach`, ...rate(gap, 7, 14, false),
    advice: `Najdłuższa przerwa trwała ${fmt(gap)} ${gap === 1 ? "dzień" : "dni"}. Nagraj 4 rolki naraz, żeby mieć zapas na gorszy tydzień.`,
    task: "Nagraj w tym tygodniu 4 rolki naraz i zaplanuj je na 2 kolejne tygodnie." })

  // 4. Udział rolek w 12 ostatnich publikacjach
  const share = last12.length ? last12.filter(isReel).length / last12.length : 0
  c.push({ id: 4, label: "Udział rolek", value: share, valueText: `rolki to ${pct(share)} z ${fmt(last12.length)} ostatnich publikacji`, ...rate(share, 0.5, 0.25),
    advice: `Rolki to ${pct(share)} Twoich ostatnich publikacji. Zamień co drugi post graficzny na rolkę na ten sam temat.`, task: "Zamień w tym tygodniu 2 zaplanowane posty graficzne na rolki o tym samym temacie." })

  // 5. Najlepsza rolka i powtarzalność (zawsze w mailu jako pozytyw)
  const bestReel = reels.reduce((a, b) => ((b.view_count as number) > (a.view_count as number) ? b : a))
  const ratio = med > 0 ? (bestReel.view_count as number) / med : 1
  const best = { date: dateLabel(bestReel.timestamp), words: firstWords(bestReel.caption), views: bestReel.view_count as number, ratio, permalink: bestReel.permalink ?? null }
  // > 5× (jeden strzał) i < 1,3× (wszystko płasko) to słabości, które biorą udział w wyborze; 1,3–1,5 i 4–5 to „średnio” bez rady.
  const r5 = ratio > 5 ? { status: "do_poprawy" as const, weakness: (ratio - 4) / 4 } : ratio < 1.3 ? { status: "do_poprawy" as const, weakness: (1.5 - ratio) / 1.5 } : ratio <= 4 && ratio >= 1.5 ? { status: "dobrze" as const, weakness: 0 } : { status: "srednio" as const, weakness: 0 }
  const above = reels.filter((m) => (m.view_count as number) >= med * 1.5).length
  c.push({ id: 5, label: ratio < 1.3 ? "Żadna rolka się nie wyróżnia" : "Jeden strzał", value: ratio, valueText: `rolka z ${best.date} (${best.words}): ${fmt(best.views)} wyświetleń, ${fmt(ratio, 1)}× więcej niż zwykle`, ...r5,
    advice: ratio < 1.3
      ? `Najlepsza z 6 ostatnich rolek ma tylko ${fmt(ratio, 1)}× więcej wyświetleń niż zwykła. Nagraj 3 wersje tego samego tematu z różnym pierwszym zdaniem.`
      : `Tylko ${fmt(above)} z ${fmt(reels.length)} rolek ${above === 1 ? "wyszła" : plural(above, "wyszła", "wyszły", "wyszło")} ponad zwykły wynik. Nagraj 3 kolejne na ten sam temat (${best.words}), w tym samym formacie.`,
    task: ratio < 1.3 ? "Nagraj w tym tygodniu 3 wersje jednej rolki z różnym pierwszym zdaniem." : `Nagraj w tym tygodniu 3 rolki na temat rolki z ${best.date}.` })

  // 6. Zaangażowanie: (polubienia + komentarze) / wyświetlenia
  const eng = reels.filter((m) => (m.view_count as number) > 0 && typeof m.like_count === "number").map((m) => ((m.like_count as number) + (m.comments_count ?? 0)) / (m.view_count as number))
  if (eng.length >= 3) {
    const e = median(eng)
    c.push({ id: 6, label: "Reakcje widzów", value: e, valueText: `${pct(e)} widzów reaguje (polubienia i komentarze)`, ...rate(e, 0.04, 0.015),
      advice: `Na 100 widzów reaguje ${fmt(e * 100, 1)}. Daj widzowi powód do reakcji: konkretną wskazówkę, którą chce zapisać, albo pytanie na końcu.`, task: "Zakończ 3 kolejne rolki jedną konkretną wskazówką do zapisania." })
  } else c.push({ id: 6, label: "Reakcje widzów", value: null, valueText: "liczba polubień jest ukryta", status: "brak", weakness: 0, advice: "" })

  // 7. Komentarze na 1000 wyświetleń
  const com = reels.filter((m) => (m.view_count as number) > 0).map((m) => ((m.comments_count ?? 0) * 1000) / (m.view_count as number))
  const cm = median(com)
  c.push({ id: 7, label: "Rozmowa pod rolkami", value: cm, valueText: `${fmt(cm, 1)} komentarza na 1000 wyświetleń`, ...rate(cm, 2, 0.5),
    advice: `Pod rolkami jest ${fmt(cm, 1)} komentarza na 1000 wyświetleń. Kończ każdą rolkę pytaniem, na które da się odpowiedzieć jednym słowem.`, task: "Zakończ 3 kolejne rolki pytaniem, na które da się odpowiedzieć jednym słowem." })

  // 8. Kierunek: 3 najnowsze vs 3 wcześniejsze rolki
  if (reels.length >= 6) {
    const newer = median(views.slice(0, 3))
    const older = median(views.slice(3, 6))
    const dir = older > 0 ? newer / older : 1
    const drop = Math.round((1 - dir) * 100)
    c.push({ id: 8, label: "Kierunek ostatnio", value: dir, valueText: dir >= 1 ? `ostatnie 3 rolki mają o ${fmt(Math.round((dir - 1) * 100))}% więcej wyświetleń niż 3 wcześniejsze` : `ostatnie 3 rolki mają o ${fmt(drop)}% mniej wyświetleń niż 3 wcześniejsze`, ...rate(dir, 0.8, 0.5),
      advice: `Ostatnie 3 rolki mają o ${fmt(drop)}% mniej wyświetleń niż 3 wcześniejsze. Nagraj następną rolkę w formacie rolki z ${best.date}.`,
      task: `Nagraj w tym tygodniu 2 rolki w formacie rolki z ${best.date}.` })
  } else c.push({ id: 8, label: "Kierunek ostatnio", value: null, valueText: "za mało rolek do porównania", status: "brak", weakness: 0, advice: "" })

  // 9. Bio: dla kogo + wezwanie
  const bio = p.biography ?? ""
  const hasWho = BIO_WHO.test(bio)
  const hasCta = CTA_WORDS.test(bio) || Boolean(p.website)
  const missing = [!hasWho && "co robisz i dla kogo", !hasCta && "co ma zrobić odwiedzający"].filter(Boolean) as string[]
  c.push({ id: 9, label: "Bio", value: (hasWho ? 1 : 0) + (hasCta ? 1 : 0), valueText: missing.length ? `bio nie mówi: ${missing.join(" ani ")}` : "bio mówi, co robisz, i ma wezwanie albo link",
    status: missing.length === 0 ? "dobrze" : "do_poprawy", weakness: missing.length * 0.5,
    // Rada zależy od tego, czego brakuje (Kierownik, A5).
    advice: !hasWho && !hasCta
      ? "Bio nie mówi, co robisz i dla kogo, ani co ma zrobić odwiedzający. Wpisz: „Pomagam [komu] w [czym]. Umów się: [link]”."
      : !hasCta
        ? "Bio mówi, co robisz, ale nie mówi, co ma zrobić odwiedzający. Dopisz na końcu: „Umów się: [link]”."
        : "Bio nie mówi, komu pomagasz. Dopisz na początku: „Pomagam [komu] w [czym]”.",
    task: !hasCta ? "Dopisz dziś na końcu bio jeden krok i link, np. „Umów się: [link]”." : "Dopisz dziś na początku bio jedno zdanie: komu pomagasz i w czym." })

  // 10. Wezwanie w podpisach rolek
  const withCta = reels.filter((m) => CAPTION_CTA.test(m.caption ?? "")).length
  const capShare = withCta / reels.length
  c.push({ id: 10, label: "Wezwanie w podpisach", value: capShare, valueText: `${fmt(withCta)} z ${fmt(reels.length)} podpisów mówi widzowi, co zrobić dalej`, ...rate(capShare, 0.5, 0.2),
    advice: `${withCta === 0 ? `Żaden z ${fmt(reels.length)} ostatnich podpisów nie mówi` : `Tylko ${fmt(withCta)} z ${fmt(reels.length)} podpisów mówi`} widzowi, co ma zrobić dalej. Dopisz na końcu każdego jedno zdanie, np. „Umów się: link w bio”.`, task: `W ${fmt(reels.length)} kolejnych rolkach dopisz w podpisie jeden krok dla widza.` })

  return { source, enough: true, followers, reelsMedianViews: med, best, criteria: c }
}

/** Ścieżka ręczna (konto prywatne): kryteria 1, 2 i 4 z 4 liczb. */
export function computeManualMetrics(m: ManualData): Metrics {
  const reach = m.avgViews / Math.max(1, m.followers)
  const share = m.posts30 ? m.reels30 / m.posts30 : 0
  const c: Criterion[] = [
    { id: 1, label: "Zasięg rolek", value: reach, valueText: `rolkę ogląda średnio ${fmt(m.avgViews)} osób, czyli ${pctOf(reach)} obserwujących`, ...rate(reach, 1, 0.3),
      advice: `Rolkę ogląda średnio ${fmt(m.avgViews)} osób, czyli ${pctOf(reach)} obserwujących. Zacznij każdą rolkę zdaniem o problemie widza, a nie o sobie.`,
      task: "Nagraj w tym tygodniu 2 rolki, które w pierwszym zdaniu nazywają problem widza." },
    { id: 2, label: "Regularność", value: m.posts30, valueText: `${fmt(m.posts30)} ${plural(m.posts30, "publikacja", "publikacje", "publikacji")} w ostatnich 30 dniach`, ...rate(m.posts30, 8, 4),
      advice: `W ostatnich 30 dniach na profilu ${postsPhrase(m.posts30)}. Ustaw 2 rolki w tygodniu, w te same dni.`, task: "Nagraj w tym tygodniu 4 rolki naraz i zaplanuj je na 2 kolejne tygodnie." },
    { id: 4, label: "Udział rolek", value: share, valueText: `rolki to ${pct(share)} publikacji z 30 dni`, ...rate(share, 0.5, 0.25),
      advice: `Rolki to ${pct(share)} Twoich publikacji. Zamień co drugi post graficzny na rolkę na ten sam temat.`, task: "Zamień w tym tygodniu 2 zaplanowane posty graficzne na rolki o tym samym temacie." },
  ]
  return { source: "reczne", enough: true, followers: m.followers, reelsMedianViews: m.avgViews, best: null, criteria: c }
}

export type Report = {
  ocena: string
  najlepsza: string | null
  obserwacje: { tytul: string; tekst: string }[]
  /** Jedno zdanie bez numeru: co jest już ustawione (opcjonalnie). */
  pochwala?: string | null
  /** Profil bez słabości: „następny poziom”, najlepsza rolka jako kandydatka na reklamę Meta (Kierownik, D). */
  nastepny?: string | null
  zadanie: string
  uwaga: string
}

const RANK = { do_poprawy: 0, srednio: 1 } as const

/**
 * Wybór do maila (Kierownik, poprawki 27.11): najpierw „do poprawy”, potem „średnio”, w obrębie statusu wg odległości od progu;
 * najwyżej 3, bez dopychania „utrzymaj”; kryteria 2 i 3 to jeden punkt „Rytm”; kryterium 5 wchodzi tylko jako słabość (> 5× lub < 1,3×).
 */
export function pickObservations(m: Metrics) {
  const pool = m.criteria.filter((c) => (c.status === "do_poprawy" || c.status === "srednio") && !(c.id === 5 && c.status === "srednio"))
  const sorted = [...pool].sort((a, b) => RANK[a.status as keyof typeof RANK] - RANK[b.status as keyof typeof RANK] || b.weakness - a.weakness || a.id - b.id)
  const r2 = sorted.find((c) => c.id === 2), r3 = sorted.find((c) => c.id === 3)
  const picked: Criterion[] = []
  for (const c of sorted) {
    if (c.id === 2 || c.id === 3) {
      if (picked.some((p) => p.id === 2 || p.id === 3)) continue
      if (r2 && r3) {
        picked.push({ ...c, label: "Rytm", advice: `${r3.advice.split(". ")[0]}, a w ostatnich 30 dniach ${postsPhrase(r2.value ?? 0)}. Ustaw 2 rolki w tygodniu, w te same dni.`, task: r3.task })
        continue
      }
      picked.push({ ...c, label: "Rytm" })
      continue
    }
    picked.push(c)
  }
  return { weakest: picked.slice(0, 3), best: m.criteria.find((c) => c.id === 5) ?? null }
}

/** Wersja bez modelu (zapas i wzór dla modelu): polecenia z liczbami z tego profilu. */
export function draftReport(m: Metrics, handle: string): Report {
  const { weakest, best } = pickObservations(m)
  const obserwacje = weakest.map((c) => ({ tytul: c.label, tekst: c.advice }))
  const top = weakest[0]
  const good = m.criteria.filter((c) => c.status === "dobrze" && c.id !== 5)
  const reach = m.criteria.find((c) => c.id === 1)
  let najlepsza: string | null = null
  if (best && m.best) {
    const tail = best.status === "dobrze" ? " Ten temat i format powtórz." : best.value !== null && best.value > 5 ? ` Pozostałe rolki mają zwykle ${fmt(m.reelsMedianViews ?? 0)}.` : ""
    najlepsza = `Najlepsza rolka: ${best.valueText}.${tail}`
  }
  if (!top) {
    // Profil bez słabości: inny układ (Kierownik, D).
    const strongest = [...good].sort((a, b) => (b.value ?? 0) - (a.value ?? 0))[0]
    return {
      ocena: `Twój profil spełnia wszystkie ${m.criteria.filter((c) => c.status !== "brak").length} kryteriów, które sprawdzamy. Najmocniejsza liczba: ${strongest ? strongest.valueText : `${fmt(m.followers)} obserwujących`}.`,
      najlepsza: m.best ? `Najlepsza rolka: ${best?.valueText}. Ten temat i format powtórz.` : najlepsza,
      obserwacje: [],
      pochwala: null,
      nastepny: m.best ? `Rolka z ${m.best.date} zebrała ${fmt(m.best.views)} wyświetleń bez reklamy. To najlepsza kandydatka na reklamę Meta, bo już wiesz, że ten temat zatrzymuje widzów.` : null,
      zadanie: m.best ? `Nagraj w tym tygodniu 3 rolki na temat rolki z ${m.best.date}.` : "Nagraj w tym tygodniu 3 rolki na temat Twojej najlepszej rolki.",
      uwaga: AUDYT_TEXT.notSeen,
    }
  }
  const strong = reach && reach !== top && reach.status !== "do_poprawy" ? capitalize(reach.valueText) : m.reelsMedianViews !== null ? `Zwykłą rolkę ogląda ${fmt(m.reelsMedianViews)} osób` : `Masz ${fmt(m.followers)} obserwujących`
  const ocena = top.id === 5 && m.best && (top.value ?? 0) > 5
    ? `Rolka z ${m.best.date} miała ${fmt(m.best.views)} wyświetleń, ${fmt(m.best.ratio, 1)} raza więcej niż Twoja zwykła rolka, więc wiesz już, który temat działa.`
    : `${strong}, ale ${lower(top.advice.split(". ")[0].replace(/\.$/, ""))}.`
  const rest = good.filter((c) => !weakest.some((w) => w.id === c.id) && !(c.id === 3 && good.some((g) => g.id === 2)))
  const labels = rest.map((c) => (c.id === 2 ? `rytm (${c.valueText})` : c.label.toLowerCase())).slice(0, 3)
  const joined = labels.length > 1 ? `${labels.slice(0, -1).join(", ")} i ${labels[labels.length - 1]}` : labels[0]
  return {
    ocena,
    najlepsza,
    obserwacje,
    pochwala: labels.length ? `${capitalize(joined)} masz już ustawione.` : null,
    nastepny: null,
    zadanie: top.task ?? top.advice,
    uwaga: AUDYT_TEXT.notSeen,
  }
}
const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)
const lower = (s: string) => (/^[A-ZĄĆĘŁŃÓŚŹŻ][a-ząćęłńóśźż]/.test(s) ? s.charAt(0).toLowerCase() + s.slice(1) : s)

const URL_RE = /(https?:\/\/|www\.)\S+/gi
/** Tekst od modelu: bez linków i znaczników, przycięty. */
export const cleanAiText = (s: unknown, max = 420) => (typeof s === "string" ? s.replace(URL_RE, "").replace(/[<>]/g, "").replace(/\s+/g, " ").trim().slice(0, max) : "")

/** Łączy odpowiedź modelu z wersją bez modelu: każda część, która nie przejdzie kontroli, zostaje z wersji bazowej. */
export function mergeAiReport(draft: Report, ai: unknown): { report: Report; usedAi: boolean } {
  if (!ai || typeof ai !== "object") return { report: draft, usedAi: false }
  const a = ai as { ocena?: unknown; obserwacje?: unknown; zadanie?: unknown }
  // Zakazane słowa z zasad tonu (Kierownik, B): tekst z nimi zostaje z wersji bez modelu.
  const banned = /(?<!\p{L})(warto|lepiej|dobrze będzie|może|wygląda stabilnie|przestrzeń do|przy tym układzie)(?!\p{L})|\d+,\d+×/iu
  const hasNum = (s: string) => /\d/.test(s) && !banned.test(s)
  const ocena = cleanAiText(a.ocena, 300)
  const zadanie = cleanAiText(a.zadanie, 300)
  const obs = Array.isArray(a.obserwacje) ? a.obserwacje : []
  let used = false
  const obserwacje = draft.obserwacje.map((d, i) => {
    const o = obs[i] as { tekst?: unknown } | undefined
    const raw = cleanAiText(o?.tekst)
    // Tytuł zdejmujemy tylko jako nagłówek („Bio: …”), nie gdy jest podmiotem zdania („Bio nie mówi…”).
    const rest = raw.slice(d.tytul.length)
    const t = raw.toLowerCase().startsWith(d.tytul.toLowerCase()) && /^\s*[:–-]/.test(rest) ? rest.replace(/^\s*[:–-]\s*/, "") : raw
    if (t && hasNum(t)) { used = true; return { tytul: d.tytul, tekst: t } }
    return d
  })
  const okOcena = Boolean(ocena && hasNum(ocena) && ocena.split(/\s+/).length <= 25)
  const report: Report = {
    ...draft,
    ocena: okOcena ? ocena : draft.ocena,
    obserwacje,
    zadanie: zadanie && !banned.test(zadanie) ? zadanie : draft.zadanie,
  }
  return { report, usedAi: used || okOcena || report.zadanie !== draft.zadanie }
}

export const costUsd = (inputTokens: number, outputTokens: number) =>
  Math.round(((inputTokens * AUDYT.price.input + outputTokens * AUDYT.price.output) / 1_000_000) * 100000) / 100000

/** Słowa przed CTA (Kierownik: najwyżej 200). */
export const wordsBeforeCta = (r: Report) =>
  [r.ocena, r.najlepsza ?? "", ...r.obserwacje.map((o) => `${o.tytul} ${o.tekst}`), r.pochwala ?? "", r.nastepny ?? "", r.zadanie].join(" ").split(/\s+/).filter(Boolean).length
