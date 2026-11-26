"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import Link from "next/link"
import { Loader2, Upload } from "lucide-react"
import { MF_BASE_PATH, MF_PRODUCTS } from "@/lib/mf/config"
import type { MfStyle } from "@/lib/mf/content"
import { openBuy, logFunnel } from "@/components/mf/buy"
import { StyleGallery } from "@/components/mf/style-gallery"

// Darmowa próba w przeglądarce (00-PLAN 0e, UX: zlecenie Wiktorii 26.11):
// 1 Marka → 2 Styl → 3 Nagranie → 4 Montaż → 5 Rolka. Pliki idą prosto do Supabase Storage przez podpisany URL
// z Edge Function Coding Buildera (omija limit Vercela). Czas: etaSeconds z API, a do tego czasu szacunek z pomiarów.

type Status = {
  status: string
  progress?: number
  stage?: string | null
  stageKey?: string | null
  etaSeconds?: number | null
  error?: string | null
  expiresAt?: string | null
  purged?: boolean
  queuePosition?: number
  outputUrl?: string | null
  previewUrl?: string | null
  brandExportUrl?: string | null
  brand?: { name?: string; style?: string; font?: string; colors?: { accent?: string; text?: string; background?: string } } | null
}
type Auth = { trialId: string; token: string }
type Brand = { name: string; style: string; font: string; accent: string; text: string; background: string; tone: string; audience: string; terms: string }
type Limits = { videoMaxBytes: number; videoMinSeconds: number; videoMaxSeconds: number; logoMaxBytes: number }

const field = "min-h-12 w-full rounded-2xl bg-[var(--h-bg)] px-4 text-[16px] outline-none focus-visible:ring-2 focus-visible:ring-[var(--h-accent)]"
const primary =
  "mf-press inline-flex min-h-14 items-center justify-center gap-3 rounded-full bg-[var(--h-accent)] px-7 text-[17px] font-bold text-[#111111] disabled:opacity-60"
const card = "rounded-[28px] bg-[var(--h-surface)] p-6 md:p-9"

// Szacunek czasu (pomiary 26.11: 14,5 s nagrania → 150–204 s razem z kolejką). Zastępuje go etaSeconds z API, gdy jest.
const AVG_RENDER = 180
const estimateSeconds = (duration: number, queueAhead = 0) => Math.round(60 + duration * 8 + queueAhead * AVG_RENDER)
const minutes = (sec: number) => Math.max(1, Math.round(sec / 60))
const minLabel = (sec: number) => {
  if (sec < 60) return "mniej niż minutę"
  const m = minutes(sec)
  return `${m} ${m === 1 ? "minutę" : m % 10 >= 2 && m % 10 <= 4 && (m % 100 < 12 || m % 100 > 14) ? "minuty" : "minut"}`
}

const STAGES = [
  { key: "queued", label: "W kolejce" },
  { key: "transcription", label: "Transkrypcja" },
  { key: "captions", label: "Napisy" },
  { key: "montage", label: "Montaż" },
  { key: "quality", label: "Kontrola jakości" },
  { key: "done", label: "Gotowe" },
] as const
/** stageKey z API, a gdy go nie ma: rozpoznanie po tekście etapu (obecne etykiety workera). */
function stageIndex(s: Status | null) {
  if (!s) return 0
  if (s.status === "done") return 5
  if (s.stageKey === "upload") return 4
  const byKey = STAGES.findIndex((x) => x.key === s.stageKey)
  if (byKey >= 0) return byKey
  if (s.status === "queued") return 0
  const t = (s.stage ?? "").toLowerCase()
  if (/wysył|znak wodny/.test(t)) return 4
  if (/kontrol|krytyk|render/.test(t)) return 4
  if (/montaż|monta|ciszy|cięci/.test(t)) return 3
  if (/napis/.test(t)) return 2
  if (/transkry|pobieram/.test(t)) return 1
  return 1
}

async function callTrial<T>(base: string, route: string, body: unknown): Promise<T> {
  const res = await fetch(`${base}/${route}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.error || "Coś poszło nie tak. Spróbuj ponownie za chwilę.")
  return data as T
}

async function putFile(url: string, file: File, headers: Record<string, string>, onProgress: (p: number) => void) {
  return new Promise<void>((resolve, reject) => {
    const x = new XMLHttpRequest()
    x.open("PUT", url)
    Object.entries(headers).forEach(([k, v]) => x.setRequestHeader(k, v))
    x.upload.onprogress = (e) => e.lengthComputable && onProgress(Math.round((e.loaded / e.total) * 100))
    x.onload = () => (x.status < 300 ? resolve() : reject(new Error("Nie udało się wgrać pliku. Sprawdź internet i spróbuj jeszcze raz.")))
    x.onerror = () => reject(new Error("Połączenie przerwało się w trakcie wgrywania. Spróbuj jeszcze raz."))
    x.send(file)
  })
}

const videoSeconds = (file: File) =>
  new Promise<number>((resolve) => {
    const v = document.createElement("video")
    v.preload = "metadata"
    v.onloadedmetadata = () => {
      URL.revokeObjectURL(v.src)
      resolve(v.duration)
    }
    v.onerror = () => resolve(NaN)
    v.src = URL.createObjectURL(file)
  })

function CheckIcon({ className = "size-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" aria-hidden className={className}>
      <path d="M3 8.5l3.2 3L13 4.5" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

/** Przykład gotowej rolki próbnej (prawdziwy wynik próby ze znakiem wodnym). */
export function TrialExample() {
  return (
    <figure className="mx-auto w-full max-w-[300px]">
      <video src="/mf/proba-przyklad.mp4" poster="/mf/proba-przyklad.jpg" autoPlay muted loop playsInline controls className="aspect-[9/16] w-full rounded-[28px] bg-[#1d1d1f]" aria-label="Przykład gotowej rolki z darmowej próby" />
      <figcaption className="mt-3 text-center text-[15px] text-[var(--h-ink-2)]">Tak wygląda rolka z próby: Twoje logo, kolory i napisy, ze znakiem wodnym.</figcaption>
    </figure>
  )
}

/** Rejestracja: e-mail + osobna, niezaznaczona zgoda marketingowa. */
export function TrialStart() {
  const [email, setEmail] = useState("")
  const [marketing, setMarketing] = useState(false)
  const [state, setState] = useState<"idle" | "busy" | "sent">("idle")
  const [error, setError] = useState<string | null>(null)
  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) return setError("Wpisz pełny adres e-mail, np. jan@firma.pl.")
    setState("busy")
    const res = await fetch("/api/mf/trial/start", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, marketing }) })
    const data = await res.json().catch(() => ({}))
    if (!res.ok) {
      setError(data.error || "Nie udało się wysłać linku. Spróbuj za chwilę.")
      setState("idle")
      return
    }
    setState("sent")
  }
  if (state === "sent")
    return (
      <div role="status" className={card}>
        <p className="text-[24px] font-semibold">Sprawdź skrzynkę</p>
        <p className="mt-3 text-[17px] leading-[1.6]">
          Link do próby jest w drodze na <strong>{email}</strong>. Działa raz przez 30 minut. Nie widzisz go? Zajrzyj do spamu albo do zakładki Oferty.
        </p>
        <button type="button" onClick={() => setState("idle")} className="mt-5 text-[15px] font-semibold underline">Podaj inny adres</button>
      </div>
    )
  return (
    <form onSubmit={submit} className={card} noValidate>
      <label htmlFor="trial-email" className="text-[15px] font-semibold">Twój e-mail</label>
      <input id="trial-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" inputMode="email" placeholder="jan@firma.pl" className={`${field} mt-2`} />
      <label className="mt-4 flex min-h-11 cursor-pointer items-start gap-3 text-[15px] leading-[1.5]">
        <input type="checkbox" checked={marketing} onChange={(e) => setMarketing(e.target.checked)} className="mt-0.5 size-6 shrink-0 accent-[var(--h-accent)]" />
        <span>Chcę dostawać maile z nowościami i ofertami Wiktorii Skopek (dobrowolne, mogę cofnąć w każdej chwili).</span>
      </label>
      {error && <p role="alert" className="mt-4 rounded-2xl bg-[var(--h-accent)]/15 p-4 text-[15px] font-semibold">{error}</p>}
      <button type="submit" disabled={state === "busy"} className={`${primary} mt-5 w-full`}>
        {state === "busy" && <Loader2 className="size-5 animate-spin" />}
        {state === "busy" ? "Wysyłam link…" : "Wyślij mi link do próby"}
      </button>
      <p className="mt-3 text-[15px] leading-[1.5] text-[var(--h-ink-2)]">
        Bez karty i bez hasła. <Link className="underline" href={`${MF_BASE_PATH}/regulamin#proba`}>Zasady próby</Link> ·{" "}
        <Link className="underline" href="/pl/polityka-prywatnosci#proba">Prywatność</Link>
      </p>
    </form>
  )
}

/** Numerowane kroki: gotowe z ptaszkiem, bieżący wyróżniony. Wcześniejsze kroki można otworzyć, dopóki rolka się nie montuje. */
function Stepper({ step, maxStep, onGo }: { step: number; maxStep: number; onGo: (i: number) => void }) {
  const labels = ["Marka", "Styl", "Nagranie", "Montaż", "Rolka"]
  const locked = maxStep >= 3
  return (
    <ol className="flex flex-wrap gap-2" aria-label="Kroki próby">
      {labels.map((l, i) => {
        const done = i < step
        const current = i === step
        const canGo = !locked && i <= maxStep && i !== step
        const inner = (
          <>
            <span className={`grid size-7 place-items-center rounded-full text-[14px] font-bold ${current ? "bg-[var(--h-accent)] text-[#111111]" : done ? "bg-[var(--h-ink)] text-[var(--h-bg)]" : "bg-[var(--h-bg)] text-[var(--h-ink-2)]"}`}>
              {done ? <CheckIcon /> : i + 1}
            </span>
            <span className={current ? "font-semibold" : "text-[var(--h-ink-2)]"}>{l}</span>
          </>
        )
        return (
          <li key={l} aria-current={current ? "step" : undefined}>
            {canGo ? (
              <button type="button" onClick={() => onGo(i)} className="mf-press flex min-h-11 items-center gap-2 rounded-full bg-[var(--h-surface)] py-1 pl-1.5 pr-4 text-[15px] hover:bg-[var(--h-surface-hover)]">
                {inner}
              </button>
            ) : (
              <span className={`flex min-h-11 items-center gap-2 rounded-full py-1 pl-1.5 pr-4 text-[15px] ${current ? "bg-[var(--h-surface)]" : ""}`}>{inner}</span>
            )}
          </li>
        )
      })}
    </ol>
  )
}

/** Podgląd marki: kadr wybranego stylu i przykładowy napis w kolorach i foncie z kreatora (przybliżenie, nie render). */
function BrandPreview({ brand, fontFamily, styleName }: { brand: Brand; fontFamily?: string; styleName?: string }) {
  return (
    <figure className="w-full">
      <div className="relative aspect-[9/16] w-full overflow-hidden rounded-[24px]" style={{ background: brand.background }}>
        <div aria-hidden className="absolute inset-0" style={{ background: `radial-gradient(120% 80% at 50% 0%, ${brand.accent}33, transparent 60%), linear-gradient(180deg, transparent 40%, #00000055)` }} />
        <div className="absolute inset-x-0 top-[9%] text-center">
          <span className="rounded-md px-2 py-1 text-[13px] font-bold uppercase tracking-wide" style={{ background: brand.accent, color: brand.background, fontFamily }}>
            {brand.name || "Twoja marka"}
          </span>
        </div>
        <p className="absolute inset-x-4 bottom-[24%] text-center text-[clamp(1.4rem,5vw,1.9rem)] leading-[1.05]" style={{ fontFamily, color: brand.text }}>
          Montujesz sam,{" "}
          <span style={{ color: brand.accent, textDecoration: "underline", textDecorationColor: brand.accent, textUnderlineOffset: "0.15em" }}>bez montażysty</span>
        </p>
      </div>
      <figcaption className="mt-2 text-[13px] leading-[1.4] text-[var(--h-ink-2)]">
        Podgląd kolorów i fontu{styleName ? ` (styl: ${styleName})` : ""}. Animację stylu zobaczysz w gotowej rolce.
      </figcaption>
    </figure>
  )
}

/** Cała próba po zalogowaniu. */
export function TrialApp({ api, styles, fonts, fontFamilies, limits, consentText, consentVersion, mailWhenReady }: {
  api: string
  styles: MfStyle[]
  fonts: string[]
  fontFamilies: Record<string, string>
  limits: Limits
  consentText: string
  consentVersion: string
  /** Czy po montażu wysyłamy mail z linkiem (gdy backend daje znać o końcu montażu). */
  mailWhenReady: boolean
}) {
  const [status, setStatus] = useState<Status | null>(null)
  const [hasOrder, setHasOrder] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [step, setStep] = useState(-1)
  const [maxStep, setMaxStep] = useState(0)
  const [brand, setBrand] = useState<Brand>({ name: "", style: "czysty-minimal", font: fonts.includes("Montserrat") ? "Montserrat" : fonts[0], accent: "#FF6A13", text: "#FFFFFF", background: "#111111", tone: "", audience: "", terms: "" })
  const [logo, setLogo] = useState<File | null>(null)
  const [renderStart, setRenderStart] = useState<{ at: number; eta: number } | null>(null)
  const auth = useRef<Auth | null>(null)

  const go = (i: number) => {
    setStep(i)
    setMaxStep((m) => Math.max(m, i))
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const refresh = useCallback(async () => {
    if (!auth.current) return null
    const s = await callTrial<Status>(api, "status", auth.current)
    setStatus(s)
    return s
  }, [api])

  useEffect(() => {
    ;(async () => {
      try {
        const res = await fetch("/api/mf/trial/session", { cache: "no-store" })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error)
        setHasOrder(!!data.hasOrder)
        auth.current = { trialId: data.trialId, token: data.token }
        const s = await callTrial<Status>(api, "status", auth.current)
        setStatus(s)
        if (s.brand?.name) {
          setBrand((b) => ({
            ...b,
            name: s.brand?.name ?? b.name,
            style: s.brand?.style ?? b.style,
            font: s.brand?.font ?? b.font,
            accent: s.brand?.colors?.accent ?? b.accent,
            text: s.brand?.colors?.text ?? b.text,
            background: s.brand?.colors?.background ?? b.background,
          }))
        }
        const at = s.status === "done" ? 4 : s.status === "queued" || s.status === "processing" ? 3 : s.status === "awaiting_upload" && s.brand ? 2 : 0
        setStep(at)
        setMaxStep(at)
      } catch (e) {
        setError(e instanceof Error ? e.message : "Nie udało się wczytać próby. Odśwież stronę.")
      }
    })()
  }, [api])

  // Montaż: status co 12 s (Edge Function ma limit 60 zapytań na 10 min na próbę; częściej = odrzucone odpowiedzi i opóźnienie).
  useEffect(() => {
    if (step !== 3) return
    const id = setInterval(async () => {
      try {
        const s = await refresh()
        if (s?.status === "done") {
          logFunnel("trial_render_completed")
          go(4)
        }
        if (s?.status === "failed") logFunnel("trial_render_failed")
      } catch {
        /* chwilowy błąd sieci: kolejna próba za 4 s */
      }
    }, 12000)
    return () => clearInterval(id)
  }, [step, refresh])

  async function saveBrand() {
    const res = await fetch("/api/mf/trial/brand", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ brand: { name: brand.name, style: brand.style, font: brand.font, colors: { accent: brand.accent, text: brand.text, background: brand.background }, tone: brand.tone, audience: brand.audience, terms: brand.terms.split(/[,\n]/).map((x) => x.trim()).filter(Boolean).slice(0, 20).map((x) => x.slice(0, 40)) } }),
    })
    const t = await res.json()
    if (!res.ok) throw new Error(t.error || "Nie udało się zapisać marki.")
    auth.current = { trialId: t.trialId, token: t.token }
    if (logo) {
      const u = await callTrial<{ uploadUrl: string; headers: Record<string, string> }>(api, "upload-url", { ...auth.current, kind: "logo", contentType: logo.type, bytes: logo.size })
      await putFile(u.uploadUrl, logo, u.headers, () => {})
    }
  }

  if (error) return <p role="alert" className="rounded-2xl bg-[var(--h-accent)]/15 p-5 text-[17px] font-semibold">{error}</p>
  if (step < 0) return <p className="flex items-center gap-3 text-[17px]" role="status"><Loader2 className="size-5 animate-spin" />Wczytuję Twoją próbę…</p>

  const styleName = styles.find((s) => s.slug === brand.style)?.name

  const STEP_TITLES = ["Twoja marka", "Wybierz styl", "Wgraj nagranie", "Montaż", "Twoja rolka"]
  return (
    <div className="flex flex-col gap-6">
      <Stepper step={step} maxStep={maxStep} onGo={go} />
      <p className="text-[15px] font-semibold text-[var(--h-ink-2)]" aria-live="polite">
        Krok {step + 1} z 5 · {STEP_TITLES[step]}
      </p>
      {step === 0 && (
        <BrandStep brand={brand} setBrand={setBrand} fonts={fonts} fontFamily={fontFamilies[brand.font]} styleName={styleName} logo={logo} setLogo={setLogo} logoMax={limits.logoMaxBytes} onNext={() => go(1)} />
      )}
      {step === 1 && (
        <StyleStep
          styles={styles}
          brand={brand}
          fontFamily={fontFamilies[brand.font]}
          onPick={(slug) => setBrand((b) => ({ ...b, style: slug }))}
          onBack={() => go(0)}
          onNext={async () => {
            await saveBrand()
            go(2)
          }}
        />
      )}
      {step === 2 && auth.current && (
        <VideoStep
          api={api}
          auth={auth.current}
          limits={limits}
          consentText={consentText}
          consentVersion={consentVersion}
          onBack={() => go(1)}
          onSubmitted={(eta) => {
            logFunnel("trial_render_started")
            setRenderStart({ at: Date.now(), eta })
            go(3)
          }}
        />
      )}
      {step === 3 && <RenderStep status={status} start={renderStart} mailWhenReady={mailWhenReady} onRetry={() => go(2)} />}
      {step === 4 && status && <DoneStep status={status} hasOrder={hasOrder} />}
    </div>
  )
}

function BrandStep({ brand, setBrand, fonts, fontFamily, styleName, logo, setLogo, logoMax, onNext }: {
  brand: Brand
  setBrand: React.Dispatch<React.SetStateAction<Brand>>
  fonts: string[]
  fontFamily?: string
  styleName?: string
  logo: File | null
  setLogo: (f: File | null) => void
  logoMax: number
  onNext: () => void
}) {
  const [error, setError] = useState<string | null>(null)
  const set = (k: keyof Brand) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setBrand((b) => ({ ...b, [k]: e.target.value }))
  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault()
        if (!brand.name.trim()) return setError("Wpisz nazwę marki, np. nazwę firmy albo swoje imię i nazwisko.")
        if (logo && logo.size > logoMax) return setError("Logo jest za duże. Wgraj plik do 5 MB (PNG, JPG albo WEBP).")
        onNext()
      }}
      className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_300px]"
    >
      <div className={card}>
        <h2 className="text-[24px] font-semibold">Twoja marka</h2>
        <p className="mt-2 text-[17px] text-[var(--h-ink-2)]">Kolory i font trafią do napisów. Po zakupie przeniesiesz je do programu.</p>
        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <label className="flex flex-col gap-2 text-[15px] font-semibold sm:col-span-2">
            Nazwa marki
            <input required maxLength={80} value={brand.name} onChange={set("name")} placeholder="np. Studio Ania" className={`${field} font-normal`} />
          </label>
          <div className="grid grid-cols-3 gap-3 sm:col-span-2">
            {([["accent", "Kolor akcentu"], ["text", "Kolor napisów"], ["background", "Kolor tła kart"]] as const).map(([k, l]) => (
              <label key={k} className="flex flex-col gap-2 text-[15px] font-semibold">
                {l}
                <span className="flex items-center gap-2 rounded-2xl bg-[var(--h-bg)] p-1.5 pr-3">
                  <input type="color" value={brand[k]} onChange={(e) => setBrand((b) => ({ ...b, [k]: e.target.value.toUpperCase() }))} className="h-9 w-10 cursor-pointer rounded-xl border-0 bg-transparent p-0" />
                  <span className="text-[14px] font-normal tabular-nums text-[var(--h-ink-2)]">{brand[k]}</span>
                </span>
              </label>
            ))}
          </div>
          <label className="flex flex-col gap-2 text-[15px] font-semibold">
            Font napisów
            <select value={brand.font} onChange={set("font")} className={`${field} font-normal`}>
              {fonts.map((f) => <option key={f}>{f}</option>)}
            </select>
          </label>
          <label className="flex flex-col gap-2 text-[15px] font-semibold">
            Logo (opcjonalnie)
            <input type="file" accept="image/png,image/jpeg,image/webp" onChange={(e) => setLogo(e.target.files?.[0] ?? null)} className="min-h-12 text-[15px] font-normal file:mr-3 file:min-h-11 file:rounded-full file:border-0 file:bg-[var(--h-bg)] file:px-4 file:font-semibold" />
          </label>
          <details className="sm:col-span-2">
            <summary className="cursor-pointer text-[15px] font-semibold underline underline-offset-4">Ton, odbiorcy i słowa marki (opcjonalnie)</summary>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <label className="flex flex-col gap-2 text-[15px] font-semibold">
                Ton
                <input maxLength={300} value={brand.tone} onChange={set("tone")} placeholder="np. rzeczowy, bez wykrzykników" className={`${field} font-normal`} />
              </label>
              <label className="flex flex-col gap-2 text-[15px] font-semibold">
                Dla kogo
                <input maxLength={300} value={brand.audience} onChange={set("audience")} placeholder="np. właściciele małych firm" className={`${field} font-normal`} />
              </label>
              <label className="flex flex-col gap-2 text-[15px] font-semibold sm:col-span-2">
                Słowa, które mają być zapisane dokładnie tak
                <input maxLength={900} value={brand.terms} onChange={set("terms")} placeholder="np. GlowUp, MontageFrames, Katowice (po przecinku, do 20)" className={`${field} font-normal`} />
                <span className="text-[13px] font-normal text-[var(--h-ink-2)]">Nazwy produktów, nazwiska i miejsca. Transkrypcja zapisze je bez literówek.</span>
              </label>
            </div>
          </details>
        </div>
        {error && <p role="alert" className="mt-5 rounded-2xl bg-[var(--h-accent)]/15 p-4 text-[15px] font-semibold">{error}</p>}
        <button type="submit" className={`${primary} mt-7`}>Dalej: wybierz styl</button>
      </div>
      <div className="mx-auto w-full max-w-[300px] lg:sticky lg:top-6">
        <BrandPreview brand={brand} fontFamily={fontFamily} styleName={styleName} />
      </div>
    </form>
  )
}

function StyleStep({ styles, brand, fontFamily, onPick, onBack, onNext }: {
  styles: MfStyle[]
  brand: Brand
  fontFamily?: string
  onPick: (slug: string) => void
  onBack: () => void
  onNext: () => Promise<void>
}) {
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const current = styles.find((s) => s.slug === brand.style)
  return (
    <div className="flex flex-col gap-6">
      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_220px]">
        <div>
          <h2 className="text-[24px] font-semibold">Wybierz styl montażu</h2>
          <p className="mt-2 max-w-[60ch] text-[17px] text-[var(--h-ink-2)]">
            Styl to animacja napisów, hak, przejścia i tempo. Wybrany: <strong className="text-[var(--h-ink)]">{current?.name}</strong>
            {current?.inspired && <> (inspirowane stylem: {current.inspired})</>}.
          </p>
        </div>
        <div className="hidden w-[220px] lg:block">
          <BrandPreview brand={brand} fontFamily={fontFamily} styleName={current?.name} />
        </div>
      </div>
      <StyleGallery styles={styles} selected={brand.style} onSelect={onPick} initialCount={10} />
      {error && <p role="alert" className="rounded-2xl bg-[var(--h-accent)]/15 p-4 text-[15px] font-semibold">{error}</p>}
      <div className="sticky bottom-3 z-10 mx-auto flex w-fit max-w-full flex-wrap items-center justify-center gap-4 rounded-full bg-[var(--h-bg)]/95 p-2 pr-5 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.35)] backdrop-blur">
        <button
          type="button"
          disabled={busy}
          onClick={async () => {
            setError(null)
            setBusy(true)
            try {
              await onNext()
            } catch (e) {
              setError(e instanceof Error ? e.message : "Nie udało się zapisać marki. Spróbuj jeszcze raz.")
              setBusy(false)
            }
          }}
          className={primary}
        >
          {busy && <Loader2 className="size-5 animate-spin" />}
          {busy ? "Zapisuję…" : `Dalej z „${current?.name}”`}
        </button>
        <button type="button" onClick={onBack} className="px-3 text-[15px] font-semibold underline underline-offset-4">Wróć do marki</button>
      </div>
    </div>
  )
}

function VideoStep({ api, auth, limits, consentText, consentVersion, onBack, onSubmitted }: {
  api: string
  auth: Auth
  limits: Limits
  consentText: string
  consentVersion: string
  onBack: () => void
  onSubmitted: (etaSeconds: number) => void
}) {
  const [file, setFile] = useState<File | null>(null)
  const [duration, setDuration] = useState<number | null>(null)
  const [consent, setConsent] = useState(false)
  const [progress, setProgress] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [drag, setDrag] = useState(false)

  async function pick(f: File | null) {
    setError(null)
    setFile(null)
    setDuration(null)
    if (!f) return
    if (!["video/mp4", "video/quicktime"].includes(f.type)) return setError("To nie jest film MP4 ani MOV. Wybierz nagranie z galerii telefonu albo z dysku.")
    if (f.size > limits.videoMaxBytes)
      return setError(`Plik ma ${Math.round(f.size / 1024 / 1024)} MB, a limit to 50 MB. Nagraj w 1080p (nie w 4K) albo skróć nagranie.`)
    const sec = await videoSeconds(f)
    if (Number.isFinite(sec) && sec < limits.videoMinSeconds) return setError(`Nagranie ma ${Math.round(sec)} s. Potrzebujemy co najmniej ${limits.videoMinSeconds} s mówienia.`)
    if (Number.isFinite(sec) && sec > limits.videoMaxSeconds + 0.5)
      return setError(`Nagranie ma ${Math.round(sec)} s, a limit próby to ${limits.videoMaxSeconds} s. Przytnij je w telefonie (Edytuj → przytnij) i wgraj jeszcze raz.`)
    setFile(f)
    setDuration(Number.isFinite(sec) ? sec : null)
  }

  const [apiEta, setApiEta] = useState<number | null>(null)
  useEffect(() => {
    if (!duration) return
    let live = true
    callTrial<{ etaSeconds: number }>(api, "estimate", { ...auth, durationSeconds: Math.round(duration) })
      .then((r) => live && typeof r.etaSeconds === "number" && setApiEta(r.etaSeconds))
      .catch(() => {})
    return () => {
      live = false
    }
  }, [duration, api, auth])
  const eta = apiEta ?? estimateSeconds(duration ?? 30)

  async function send(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    if (!file) return setError("Najpierw wybierz nagranie.")
    if (!consent) return setError("Zaznacz zgodę na przetworzenie nagrania, żebyśmy mogli je zmontować.")
    try {
      setProgress(0)
      const u = await callTrial<{ uploadUrl: string; headers: Record<string, string> }>(api, "upload-url", { ...auth, kind: "video", contentType: file.type, bytes: file.size })
      await putFile(u.uploadUrl, file, u.headers, setProgress)
      logFunnel("trial_upload_completed")
      const r = await callTrial<{ etaSeconds?: number }>(api, "submit", { ...auth, consent: true, consentVersion, durationSeconds: duration ? Math.round(duration) : undefined })
      onSubmitted(typeof r.etaSeconds === "number" ? r.etaSeconds : eta)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Nie udało się wysłać nagrania. Spróbuj jeszcze raz.")
      setProgress(null)
    }
  }

  return (
    <form onSubmit={send} noValidate className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_300px]">
      <div className={card}>
        <h2 className="text-[24px] font-semibold">Wgraj nagranie</h2>
        <label
          onDragOver={(e) => {
            e.preventDefault()
            setDrag(true)
          }}
          onDragLeave={() => setDrag(false)}
          onDrop={(e) => {
            e.preventDefault()
            setDrag(false)
            pick(e.dataTransfer.files?.[0] ?? null)
          }}
          className={`mt-5 flex cursor-pointer flex-col items-center gap-3 rounded-[22px] border-2 border-dashed p-8 text-center transition-colors ${drag ? "border-[var(--h-accent)] bg-[var(--h-bg)]" : "border-black/15 bg-[var(--h-bg)]/60 hover:bg-[var(--h-bg)]"}`}
        >
          <Upload className="size-7" aria-hidden />
          <span className="text-[17px] font-semibold">{file ? file.name : "Wybierz nagranie albo upuść je tutaj"}</span>
          <span className="text-[15px] text-[var(--h-ink-2)]">
            {file
              ? `${duration ? `${Math.round(duration)} s · ` : ""}${(file.size / 1024 / 1024).toFixed(1)} MB · kliknij, żeby zmienić`
              : `MP4 albo MOV · ${limits.videoMinSeconds}–${limits.videoMaxSeconds} s · do 50 MB`}
          </span>
          <input type="file" accept="video/mp4,video/quicktime" onChange={(e) => pick(e.target.files?.[0] ?? null)} className="sr-only" aria-label="Nagranie" />
        </label>

        {file && (
          <p role="status" className="mt-5 rounded-2xl bg-[var(--h-bg)] p-4 text-[17px]">
            Twoja rolka będzie gotowa za {eta < 60 ? "" : "ok. "}<strong>{minLabel(eta)}</strong> (montujemy jedną rolkę naraz, więc przy kolejce może to potrwać dłużej).
          </p>
        )}

        <label className="mt-6 flex min-h-11 cursor-pointer items-start gap-3 text-[15px] leading-[1.5]">
          <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-0.5 size-6 shrink-0 accent-[var(--h-accent)]" />
          <span>
            {consentText}{" "}
            <Link className="underline" href="/pl/polityka-prywatnosci#proba" target="_blank">Prywatność</Link>
            <span className="text-[var(--h-accent-ink)]"> (wymagane)</span>
          </span>
        </label>

        {progress !== null && (
          <div className="mt-5" role="status">
            <div className="h-2 overflow-hidden rounded-full bg-[var(--h-bg)]"><div className="h-full bg-[var(--h-accent)] transition-[width]" style={{ width: `${progress}%` }} /></div>
            <p className="mt-2 text-[15px] tabular-nums">Wgrywam nagranie: {progress}%</p>
          </div>
        )}
        {error && <p role="alert" className="mt-5 rounded-2xl bg-[var(--h-accent)]/15 p-4 text-[15px] font-semibold">{error}</p>}
        <div className="mt-7 flex flex-wrap items-center gap-5">
          <button type="submit" disabled={progress !== null} className={primary}>
            {progress !== null && <Loader2 className="size-5 animate-spin" />}
            {progress !== null ? "Wysyłam…" : "Zmontuj moją rolkę"}
          </button>
          <button type="button" onClick={onBack} className="text-[15px] font-semibold underline underline-offset-4">Zmień styl</button>
        </div>
      </div>
      <aside className="rounded-[28px] bg-[var(--h-surface)] p-6">
        <h3 className="text-[19px] font-semibold">Jak nagrać, żeby wyszło dobrze</h3>
        <ul className="mt-4 flex flex-col gap-3 text-[15px] leading-[1.5]">
          {[
            "Telefon pionowo, na wysokości oczu.",
            "Mów do kamery: z Twojego głosu powstaną napisy.",
            "Cicho w tle, bez muzyki.",
            `Od ${limits.videoMinSeconds} do ${limits.videoMaxSeconds} sekund, najlepiej 20–40 s.`,
            "Nagraj w 1080p: plik będzie mniejszy niż w 4K.",
          ].map((t) => (
            <li key={t} className="flex gap-2.5">
              <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-[var(--h-accent)] text-[#111111]"><CheckIcon className="size-3" /></span>
              {t}
            </li>
          ))}
        </ul>
      </aside>
    </form>
  )
}

function RenderStep({ status, start, mailWhenReady, onRetry }: { status: Status | null; start: { at: number; eta: number } | null; mailWhenReady: boolean; onRetry: () => void }) {
  const [, tick] = useState(0)
  useEffect(() => {
    const id = setInterval(() => tick((x) => x + 1), 5000)
    return () => clearInterval(id)
  }, [])
  if (status?.status === "failed")
    return (
      <div role="alert" className={card}>
        <p className="text-[24px] font-semibold">Nie udało się zmontować rolki</p>
        <p className="mt-3 text-[17px] leading-[1.6]">{status.error || "Coś poszło nie tak po naszej stronie. Spróbuj z tym samym albo innym nagraniem."}</p>
        <button type="button" onClick={onRetry} className={`${primary} mt-6`}>Wgraj nagranie jeszcze raz</button>
      </div>
    )
  const idx = stageIndex(status)
  const remaining =
    status?.etaSeconds != null ? status.etaSeconds : start ? Math.max(30, start.eta - (Date.now() - start.at) / 1000) : null
  const pct = status?.status === "queued" ? 3 : Math.max(5, status?.progress ?? 0)
  return (
    <div role="status" aria-live="polite" className={card}>
      <p className="flex items-center gap-3 text-[24px] font-semibold"><Loader2 className="size-6 animate-spin" aria-hidden />Montuję Twoją rolkę</p>
      <p className="mt-2 text-[17px] text-[var(--h-ink-2)]">
        {status?.status === "queued" && status.queuePosition ? `Miejsce w kolejce: ${status.queuePosition}. ` : ""}
        {remaining != null ? <>Zostało {remaining < 60 ? "" : "ok. "}<strong className="text-[var(--h-ink)]">{minLabel(remaining)}</strong>.</> : "Zwykle trwa to 2–4 minuty."}
      </p>
      <div className="mt-6 h-2.5 overflow-hidden rounded-full bg-[var(--h-bg)]">
        <div className="h-full rounded-full bg-[var(--h-accent)] transition-[width] duration-700" style={{ width: `${pct}%` }} />
      </div>
      <ol className="mt-6 grid gap-2 sm:grid-cols-3 lg:grid-cols-6">
        {STAGES.map((s, i) => (
          <li key={s.key} className={`flex items-center gap-2 rounded-2xl p-3 text-[15px] ${i === idx ? "bg-[var(--h-bg)] font-semibold" : i < idx ? "text-[var(--h-ink)]" : "text-[var(--h-ink-2)]"}`}>
            <span className={`grid size-6 shrink-0 place-items-center rounded-full ${i < idx ? "bg-[var(--h-ink)] text-[var(--h-bg)]" : i === idx ? "bg-[var(--h-accent)] text-[#111111]" : "border border-black/20"}`}>
              {i < idx ? <CheckIcon className="size-3.5" /> : i === idx ? <Loader2 className="size-3.5 animate-spin" aria-hidden /> : null}
            </span>
            {s.label}
          </li>
        ))}
      </ol>
      <p className="mt-6 rounded-2xl bg-[var(--h-bg)] p-4 text-[15px] leading-[1.5]">
        {mailWhenReady
          ? "Możesz zamknąć kartę. Gdy rolka będzie gotowa, wyślemy Ci link mailem. Znajdziesz ją też na koncie."
          : "Możesz zamknąć kartę. Gotową rolkę znajdziesz na koncie (zaloguj się swoim adresem e-mail)."}
      </p>
    </div>
  )
}

function DoneStep({ status, hasOrder }: { status: Status; hasOrder: boolean }) {
  const until = status.expiresAt ? new Date(status.expiresAt).toLocaleDateString("pl-PL", { day: "numeric", month: "long" }) : null
  useEffect(() => logFunnel("trial_preview_viewed"), [])
  if (status.purged || !status.previewUrl)
    return <div className={card}><p className="text-[21px] font-semibold">Rolka z próby została już usunięta (minęło 7 dni). Limit to jedna rolka na konto.</p></div>
  return (
    <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,360px)_1fr]">
      <div>
        <video src={status.previewUrl} controls playsInline autoPlay muted className="aspect-[9/16] w-full rounded-[28px] bg-[#1d1d1f]" aria-label="Twoja rolka z próby" />
        {status.outputUrl && (
          <a href={status.outputUrl} onClick={() => logFunnel("trial_downloaded")} className="mf-press mt-4 flex min-h-12 items-center justify-center rounded-full bg-[var(--h-surface)] text-[17px] font-semibold hover:bg-[var(--h-surface-hover)]">
            Pobierz rolkę (MP4, ze znakiem wodnym)
          </a>
        )}
        <p className="mt-3 text-center text-[15px] text-[var(--h-ink-2)]">Wersja próbna ze znakiem wodnym. Usuniemy ją {until ?? "po 7 dniach"}.</p>
      </div>
      <div>
        <p className="text-[clamp(1.75rem,3.4vw,2.5rem)] font-bold leading-[1.1] tracking-[-0.02em]">Twoja rolka jest gotowa</p>
        {!hasOrder ? (
          <div className="mt-6 rounded-[28px] bg-[var(--h-surface)] p-6 md:p-8">
            <p className="text-[21px] font-semibold">Montuj tak każdą rolkę</p>
            <ul className="mt-4 flex flex-col gap-2.5 text-[17px] leading-[1.5]">
              {[
                "Bez znaku wodnego i bez limitu rolek",
                "Twoja marka i styl z próby przechodzą do programu",
                "Wszystkie style montażu, poprawki w panelu albo w rozmowie",
                "Gwarancja działania 14 dni",
              ].map((t) => (
                <li key={t} className="flex gap-2.5">
                  <span className="mt-1 grid size-5 shrink-0 place-items-center rounded-full bg-[var(--h-accent)] text-[#111111]"><CheckIcon className="size-3" /></span>
                  {t}
                </li>
              ))}
            </ul>
            <p className="mt-5 rounded-2xl bg-[var(--h-bg)] p-4 text-[16px] leading-[1.55]">
              <strong>Czego potrzebujesz:</strong> komputera z min. 15 GB miejsca i płatnego planu Claude Pro lub Max. Program działa w Claude Code na Twoim komputerze.
            </p>
            <button type="button" onClick={() => openBuy("paczka", "trial_preview")} className={`${primary} mt-5 w-full sm:w-auto`}>
              Kup pełną wersję za {MF_PRODUCTS.paczka.priceLabel}
            </button>
            <p className="mt-3 text-[15px] text-[var(--h-ink-2)]">Jednorazowo, bez abonamentu.</p>
            <button type="button" onClick={() => openBuy("konsultacja", "trial_preview")} className="mt-3 text-[15px] font-semibold underline underline-offset-4">
              Wolę zainstalować z Wiktorią: {MF_PRODUCTS.konsultacja.priceLabel}
            </button>
          </div>
        ) : (
          <div className="mt-6 rounded-[28px] bg-[var(--h-surface)] p-6">
            <p className="text-[17px] leading-[1.6]">Masz pełną wersję. Wczytaj markę z próby w programie komendą /marka albo poleceniem node scripts/mf/brand.mjs import marka-proba.json.</p>
            {status.brandExportUrl && (
              <a href={status.brandExportUrl} className="mf-press mt-4 inline-flex min-h-12 items-center rounded-full bg-[var(--h-bg)] px-6 text-[17px] font-semibold">Pobierz markę z próby</a>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
