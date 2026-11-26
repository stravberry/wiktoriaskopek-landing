"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import Link from "next/link"
import { Loader2 } from "lucide-react"
import { MF_BASE_PATH, MF_PRODUCTS } from "@/lib/mf/config"
import { openBuy, logFunnel } from "@/components/mf/buy"

// Darmowa próba w przeglądarce (00-PLAN 0e): kreator marki → nagranie ze zgodą → status → podgląd ze znakiem wodnym → zakup.
// Pliki idą prosto do Supabase Storage przez podpisany URL z Edge Function Coding Buildera (omija limit Vercela).

type Style = { id: string; name: string; description: string; inspiredBy: string | null }
type Session = { trialId: string; token: string; status: string; expiresAt: string | null; hasOrder: boolean }
type Status = {
  status: string
  progress?: number
  stage?: string | null
  error?: string | null
  expiresAt?: string | null
  purged?: boolean
  queuePosition?: number
  outputUrl?: string | null
  previewUrl?: string | null
  brandExportUrl?: string | null
}

const field = "min-h-12 w-full rounded-2xl bg-[var(--h-bg)] px-4 text-[16px] outline-none focus:ring-2 focus:ring-[var(--h-accent)]"
const primary = "mf-press inline-flex min-h-14 items-center justify-center gap-3 rounded-full bg-[var(--h-accent)] px-7 text-[17px] font-bold text-[#111111] disabled:opacity-60"
const card = "rounded-[28px] bg-[var(--h-surface)] p-6 md:p-9"

async function callTrial<T>(base: string, route: string, body: unknown): Promise<T> {
  const res = await fetch(`${base}/${route}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.error || "Coś poszło nie tak. Spróbuj ponownie.")
  return data as T
}

function putFile(url: string, file: File, headers: Record<string, string>, onProgress: (p: number) => void) {
  return new Promise<void>((resolve, reject) => {
    const x = new XMLHttpRequest()
    x.open("PUT", url)
    Object.entries(headers).forEach(([k, v]) => x.setRequestHeader(k, v))
    x.upload.onprogress = (e) => e.lengthComputable && onProgress(Math.round((e.loaded / e.total) * 100))
    x.onload = () => (x.status < 300 ? resolve() : reject(new Error("Nie udało się wgrać pliku. Spróbuj ponownie.")))
    x.onerror = () => reject(new Error("Przerwane połączenie przy wgrywaniu. Spróbuj ponownie."))
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

/** Rejestracja: e-mail + osobna, niezaznaczona zgoda marketingowa. */
export function TrialStart() {
  const [email, setEmail] = useState("")
  const [marketing, setMarketing] = useState(false)
  const [state, setState] = useState<"idle" | "busy" | "sent">("idle")
  const [error, setError] = useState<string | null>(null)
  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setState("busy")
    const res = await fetch("/api/mf/trial/start", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, marketing }) })
    const data = await res.json().catch(() => ({}))
    if (!res.ok) {
      setError(data.error || "Nie udało się wysłać linku.")
      setState("idle")
      return
    }
    setState("sent")
  }
  if (state === "sent")
    return (
      <div role="status" className={card}>
        <p className="text-[24px] font-semibold">Sprawdź skrzynkę</p>
        <p className="mt-3 text-[17px] leading-[1.6]">Wysłaliśmy link do próby na {email}. Działa raz przez 30 minut. Zajrzyj też do spamu.</p>
      </div>
    )
  return (
    <form onSubmit={submit} className={card} noValidate>
      <label className="flex flex-col gap-2 text-[15px] font-semibold">
        Twój e-mail
        <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" className={field} />
      </label>
      <label className="mt-5 flex min-h-11 cursor-pointer items-start gap-3 text-[15px] leading-[1.5]">
        <input type="checkbox" checked={marketing} onChange={(e) => setMarketing(e.target.checked)} className="mt-0.5 size-6 shrink-0 accent-[var(--h-accent)]" />
        <span>Chcę dostawać maile z nowościami i ofertami Wiktorii Skopek (zgoda dobrowolna, mogę ją cofnąć w każdej chwili).</span>
      </label>
      {error && <p role="alert" className="mt-4 rounded-2xl bg-[var(--h-accent)]/15 p-4 text-[15px] font-semibold">{error}</p>}
      <button type="submit" disabled={state === "busy" || !email} className={`${primary} mt-6 w-full`}>
        {state === "busy" && <Loader2 className="size-5 animate-spin" />}
        Wyślij link do próby
      </button>
      <p className="mt-3 text-[15px] leading-[1.5] text-[var(--h-ink-2)]">
        Bez karty. Wysyłając, akceptujesz <Link className="underline" href={`${MF_BASE_PATH}/regulamin#proba`}>zasady próby</Link> i zapoznałeś/-aś się z{" "}
        <Link className="underline" href="/pl/polityka-prywatnosci">Polityką prywatności</Link>.
      </p>
    </form>
  )
}

/** Cała próba po zalogowaniu. */
export function TrialApp({ api, styles, fonts, limits, consentText, consentVersion }: {
  api: string
  styles: Style[]
  fonts: string[]
  limits: { videoMaxBytes: number; videoMinSeconds: number; videoMaxSeconds: number; logoMaxBytes: number }
  consentText: string
  consentVersion: string
}) {
  const [session, setSession] = useState<Session | null>(null)
  const [status, setStatus] = useState<Status | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [step, setStep] = useState<"load" | "brand" | "video" | "render" | "done">("load")
  const token = useRef<{ trialId: string; token: string } | null>(null)

  const apiUrl = api
  const refresh = useCallback(async () => {
    if (!token.current) return
    const s = await callTrial<Status>(apiUrl, "status", token.current)
    setStatus(s)
    return s
  }, [apiUrl])

  useEffect(() => {
    ;(async () => {
      try {
        const res = await fetch("/api/mf/trial/session", { cache: "no-store" })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error)
        setSession(data)
        token.current = { trialId: data.trialId, token: data.token }
        const s = await callTrial<Status>(apiUrl, "status", token.current)
        setStatus(s)
        setStep(s.status === "done" ? "done" : s.status === "queued" || s.status === "processing" ? "render" : s.status === "awaiting_upload" && (s as { brand?: unknown }).brand ? "video" : "brand")
      } catch (e) {
        setError(e instanceof Error ? e.message : "Nie udało się wczytać próby.")
      }
    })()
  }, [apiUrl])

  // Odpytywanie statusu co 4 s podczas montażu.
  useEffect(() => {
    if (step !== "render") return
    const id = setInterval(async () => {
      try {
        const s = await refresh()
        if (s?.status === "done") {
          logFunnel("trial_render_completed")
          setStep("done")
        }
        if (s?.status === "failed") logFunnel("trial_render_failed")
      } catch {
        /* chwilowy błąd sieci: kolejna próba za 4 s */
      }
    }, 4000)
    return () => clearInterval(id)
  }, [step, refresh])

  if (error) return <p role="alert" className="rounded-2xl bg-[var(--h-accent)]/15 p-5 text-[17px] font-semibold">{error}</p>
  if (step === "load" || !session) return <p className="flex items-center gap-3 text-[17px]"><Loader2 className="size-5 animate-spin" />Wczytuję próbę…</p>

  return (
    <div className="flex flex-col gap-6">
      <ol className="flex flex-wrap gap-2 text-[15px] font-semibold" aria-label="Etapy próby">
        {[["brand", "1. Marka"], ["video", "2. Nagranie"], ["render", "3. Montaż"], ["done", "4. Rolka"]].map(([k, l]) => (
          <li key={k} aria-current={step === k ? "step" : undefined} className={`rounded-full px-4 py-2 ${step === k ? "bg-[var(--h-ink)] text-[var(--h-bg)]" : "bg-[var(--h-surface)] text-[var(--h-ink-2)]"}`}>{l}</li>
        ))}
      </ol>
      {step === "brand" && (
        <BrandStep
          styles={styles}
          fonts={fonts}
          logoMax={limits.logoMaxBytes}
          api={apiUrl}
          onSaved={(t) => {
            token.current = t
            setStep("video")
          }}
        />
      )}
      {step === "video" && token.current && (
        <VideoStep
          api={apiUrl}
          auth={token.current}
          limits={limits}
          consentText={consentText}
          consentVersion={consentVersion}
          onBack={() => setStep("brand")}
          onSubmitted={() => {
            logFunnel("trial_render_started")
            setStep("render")
          }}
        />
      )}
      {step === "render" && <RenderStep status={status} onRetry={() => setStep("video")} />}
      {step === "done" && status && <DoneStep status={status} hasOrder={session.hasOrder} />}
    </div>
  )
}

function BrandStep({ styles, fonts, logoMax, api: apiUrl, onSaved }: { styles: Style[]; fonts: string[]; logoMax: number; api: string; onSaved: (t: { trialId: string; token: string }) => void }) {
  const [name, setName] = useState("")
  const [style, setStyle] = useState(styles[0]?.id ?? "")
  const [font, setFont] = useState(fonts.includes("Montserrat") ? "Montserrat" : fonts[0])
  const [accent, setAccent] = useState("#FF6A13")
  const [text, setText] = useState("#FFFFFF")
  const [background, setBackground] = useState("#111111")
  const [tone, setTone] = useState("")
  const [audience, setAudience] = useState("")
  const [logo, setLogo] = useState<File | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const current = styles.find((s) => s.id === style)

  async function save(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    if (logo && logo.size > logoMax) return setError("Logo może mieć najwyżej 5 MB.")
    setBusy(true)
    try {
      const res = await fetch("/api/mf/trial/brand", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ brand: { name, style, font, colors: { accent, text, background }, tone, audience } }),
      })
      const t = await res.json()
      if (!res.ok) throw new Error(t.error)
      const auth = { trialId: t.trialId, token: t.token }
      if (logo) {
        const u = await callTrial<{ uploadUrl: string; headers: Record<string, string> }>(apiUrl, "upload-url", { ...auth, kind: "logo", contentType: logo.type, bytes: logo.size })
        await putFile(u.uploadUrl, logo, u.headers, () => {})
      }
      onSaved(auth)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Nie udało się zapisać marki.")
      setBusy(false)
    }
  }

  return (
    <form onSubmit={save} className={card} noValidate>
      <h2 className="text-[24px] font-semibold">Twoja marka</h2>
      <p className="mt-2 text-[17px] text-[var(--h-ink-2)]">Te ustawienia trafią do rolki. Po zakupie przeniesiesz je do pełnej wersji.</p>
      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <label className="flex flex-col gap-2 text-[15px] font-semibold sm:col-span-2">
          Nazwa marki
          <input required maxLength={80} value={name} onChange={(e) => setName(e.target.value)} className={field} />
        </label>
        <label className="flex flex-col gap-2 text-[15px] font-semibold">
          Styl montażu
          <select value={style} onChange={(e) => setStyle(e.target.value)} className={field}>
            {styles.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </label>
        <label className="flex flex-col gap-2 text-[15px] font-semibold">
          Font napisów
          <select value={font} onChange={(e) => setFont(e.target.value)} className={field}>
            {fonts.map((f) => <option key={f}>{f}</option>)}
          </select>
        </label>
        {current && (
          <p className="text-[15px] leading-[1.5] text-[var(--h-ink-2)] sm:col-span-2">
            {current.description}
            {current.inspiredBy && <> Inspirowane stylem: {current.inspiredBy}.</>}
          </p>
        )}
        <div className="grid grid-cols-3 gap-3 sm:col-span-2">
          {([["Akcent", accent, setAccent], ["Tekst", text, setText], ["Tło kart", background, setBackground]] as const).map(([l, v, set]) => (
            <label key={l} className="flex flex-col gap-2 text-[15px] font-semibold">
              {l}
              <input type="color" value={v} onChange={(e) => set(e.target.value.toUpperCase())} className="h-12 w-full cursor-pointer rounded-2xl bg-[var(--h-bg)] p-1" />
            </label>
          ))}
        </div>
        <label className="flex flex-col gap-2 text-[15px] font-semibold">
          Ton (opcjonalnie)
          <input maxLength={300} value={tone} onChange={(e) => setTone(e.target.value)} placeholder="np. rzeczowy, bez wykrzykników" className={field} />
        </label>
        <label className="flex flex-col gap-2 text-[15px] font-semibold">
          Dla kogo (opcjonalnie)
          <input maxLength={300} value={audience} onChange={(e) => setAudience(e.target.value)} placeholder="np. właściciele małych firm" className={field} />
        </label>
        <label className="flex flex-col gap-2 text-[15px] font-semibold sm:col-span-2">
          Logo (opcjonalnie, PNG, JPG albo WEBP do 5 MB)
          <input type="file" accept="image/png,image/jpeg,image/webp" onChange={(e) => setLogo(e.target.files?.[0] ?? null)} className="text-[15px] font-normal" />
        </label>
      </div>
      {error && <p role="alert" className="mt-5 rounded-2xl bg-[var(--h-accent)]/15 p-4 text-[15px] font-semibold">{error}</p>}
      <button type="submit" disabled={busy || !name} className={`${primary} mt-7`}>
        {busy && <Loader2 className="size-5 animate-spin" />}Dalej: nagranie
      </button>
    </form>
  )
}

function VideoStep({ api: apiUrl, auth, limits, consentText, consentVersion, onBack, onSubmitted }: {
  api: string
  auth: { trialId: string; token: string }
  limits: { videoMaxBytes: number; videoMinSeconds: number; videoMaxSeconds: number }
  consentText: string
  consentVersion: string
  onBack: () => void
  onSubmitted: () => void
}) {
  const [file, setFile] = useState<File | null>(null)
  const [consent, setConsent] = useState(false)
  const [progress, setProgress] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function send(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    if (!file) return setError("Wybierz nagranie.")
    if (!["video/mp4", "video/quicktime"].includes(file.type)) return setError("Wgraj film MP4 albo MOV.")
    if (file.size > limits.videoMaxBytes) return setError("Nagranie może mieć najwyżej 50 MB. Zapisz je w 1080p albo skróć.")
    const sec = await videoSeconds(file)
    if (Number.isFinite(sec) && (sec < limits.videoMinSeconds || sec > limits.videoMaxSeconds + 0.5))
      return setError(`Nagranie musi mieć od ${limits.videoMinSeconds} do ${limits.videoMaxSeconds} sekund (to ma ${Math.round(sec)} s).`)
    if (!consent) return setError("Zaznacz zgodę na przetworzenie nagrania.")
    try {
      setProgress(0)
      const u = await callTrial<{ uploadUrl: string; headers: Record<string, string> }>(apiUrl, "upload-url", { ...auth, kind: "video", contentType: file.type, bytes: file.size })
      await putFile(u.uploadUrl, file, u.headers, setProgress)
      logFunnel("trial_upload_completed")
      await callTrial(apiUrl, "submit", { ...auth, consent: true, consentVersion })
      onSubmitted()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Nie udało się wysłać nagrania.")
      setProgress(null)
    }
  }

  return (
    <form onSubmit={send} className={card} noValidate>
      <h2 className="text-[24px] font-semibold">Twoje nagranie</h2>
      <p className="mt-2 text-[17px] leading-[1.6] text-[var(--h-ink-2)]">
        Pionowe nagranie z telefonu, od {limits.videoMinSeconds} do {limits.videoMaxSeconds} sekund, MP4 albo MOV do 50 MB. Mów do kamery: z tego program zrobi napisy.
      </p>
      <input type="file" accept="video/mp4,video/quicktime" onChange={(e) => setFile(e.target.files?.[0] ?? null)} className="mt-6 text-[15px]" aria-label="Nagranie" />
      <label className="mt-6 flex min-h-11 cursor-pointer items-start gap-3 text-[15px] leading-[1.5]">
        <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-0.5 size-6 shrink-0 accent-[var(--h-accent)]" />
        <span>
          {consentText} <Link className="underline" href="/pl/polityka-prywatnosci#proba" target="_blank">Więcej w polityce prywatności</Link>.
          <span className="text-[var(--h-accent-ink)]"> (wymagane)</span>
        </span>
      </label>
      {progress !== null && (
        <div className="mt-5" role="status">
          <div className="h-2 overflow-hidden rounded-full bg-[var(--h-bg)]"><div className="h-full bg-[var(--h-accent)] transition-[width]" style={{ width: `${progress}%` }} /></div>
          <p className="mt-2 text-[15px]">Wgrywam: {progress}%</p>
        </div>
      )}
      {error && <p role="alert" className="mt-5 rounded-2xl bg-[var(--h-accent)]/15 p-4 text-[15px] font-semibold">{error}</p>}
      <div className="mt-7 flex flex-wrap items-center gap-5">
        <button type="submit" disabled={progress !== null} className={primary}>
          {progress !== null && <Loader2 className="size-5 animate-spin" />}Zmontuj moją rolkę
        </button>
        <button type="button" onClick={onBack} className="text-[17px] font-semibold underline">Zmień markę</button>
      </div>
    </form>
  )
}

function RenderStep({ status, onRetry }: { status: Status | null; onRetry: () => void }) {
  if (status?.status === "failed")
    return (
      <div role="alert" className={card}>
        <p className="text-[24px] font-semibold">Nie udało się zmontować rolki</p>
        <p className="mt-3 text-[17px] leading-[1.6]">{status.error || "Spróbuj z innym nagraniem."}</p>
        <button type="button" onClick={onRetry} className={`${primary} mt-6`}>Wgraj nagranie jeszcze raz</button>
      </div>
    )
  return (
    <div role="status" className={card}>
      <p className="flex items-center gap-3 text-[24px] font-semibold"><Loader2 className="size-6 animate-spin" />Montuję Twoją rolkę</p>
      <p className="mt-3 text-[17px] leading-[1.6]">
        {status?.status === "queued"
          ? `Rolka czeka w kolejce${status.queuePosition ? ` (miejsce ${status.queuePosition})` : ""}. Montujemy jedną rolkę naraz.`
          : status?.stage || "Transkrypcja, napisy w Twoim stylu i render."}
      </p>
      <div className="mt-5 h-2 overflow-hidden rounded-full bg-[var(--h-bg)]"><div className="h-full bg-[var(--h-accent)] transition-[width] duration-700" style={{ width: `${status?.progress ?? 0}%` }} /></div>
      <p className="mt-4 text-[15px] text-[var(--h-ink-2)]">Możesz zamknąć stronę. Wróć tu z tego samego linku albo zaloguj się na koncie.</p>
    </div>
  )
}

function DoneStep({ status, hasOrder }: { status: Status; hasOrder: boolean }) {
  const until = status.expiresAt ? new Date(status.expiresAt).toLocaleDateString("pl-PL", { day: "numeric", month: "long" }) : null
  useEffect(() => logFunnel("trial_preview_viewed"), [])
  if (status.purged || !status.previewUrl)
    return <div className={card}><p className="text-[21px] font-semibold">Rolka z próby została już usunięta (po 7 dniach). Limit to jedna rolka na konto.</p></div>
  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,360px)_1fr] lg:items-start">
      <video src={status.previewUrl} controls playsInline className="aspect-[9/16] w-full rounded-[24px] bg-[#1d1d1f]" aria-label="Twoja rolka z próby" />
      <div>
        <p className="text-[28px] font-bold leading-[1.15] tracking-[-0.02em]">Twoja rolka jest gotowa</p>
        <p className="mt-3 text-[17px] leading-[1.6]">
          To wersja próbna ze znakiem wodnym. Nagranie i rolkę usuniemy{until ? ` ${until}` : " po 7 dniach"}, więc pobierz ją wcześniej.
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-5">
          {status.outputUrl && (
            <a href={status.outputUrl} onClick={() => logFunnel("trial_downloaded")} className="text-[17px] font-semibold underline">Pobierz rolkę</a>
          )}
          {hasOrder && status.brandExportUrl && <a href={status.brandExportUrl} className="text-[17px] font-semibold underline">Pobierz markę z próby</a>}
        </div>
        {!hasOrder ? (
          <div className="mt-8 rounded-[28px] bg-[var(--h-surface)] p-6">
            <button type="button" onClick={() => openBuy("paczka", "trial_preview")} className={primary}>
              Kup pełną wersję za {MF_PRODUCTS.paczka.priceLabel}
            </button>
            <p className="mt-4 text-[15px] leading-[1.6]">
              Bez znaku wodnego i bez limitu rolek. Program działa na Twoim komputerze w Claude Code (płatny plan Claude Pro lub Max, min. 15 GB miejsca).
              Gwarancja działania 14 dni.
            </p>
            <button type="button" onClick={() => openBuy("konsultacja", "trial_preview")} className="mt-3 text-[15px] font-semibold underline">
              Wolę zainstalować z Wiktorią: {MF_PRODUCTS.konsultacja.priceLabel}
            </button>
          </div>
        ) : (
          <p className="mt-8 text-[17px] leading-[1.6]">
            Masz pełną wersję. Markę z próby wczytasz w programie komendą /marka albo poleceniem node scripts/mf/brand.mjs import marka-proba.json.
          </p>
        )}
      </div>
    </div>
  )
}
