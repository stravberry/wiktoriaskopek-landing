"use client"

import { useEffect, useId, useRef, useState } from "react"
import Link from "next/link"
import { ArrowRight, Check, Info, Loader2, MailCheck } from "lucide-react"
import { Turnstile, TURNSTILE_SITE_KEY } from "@/components/turnstile"
import { getUtm } from "@/lib/mf/utm-client"
import { AUDYT_TEXT, parseHandle } from "@/lib/audyt/core"

type Choice = { v: string; label: string }
const PROFILE: Choice[] = [{ v: "firma", label: "Firmowy" }, { v: "marka", label: "Mojej marki osobistej" }, { v: "prywatny", label: "Prywatny" }]
const WHO: Choice[] = [{ v: "ja", label: "Ja sam(a)" }, { v: "zespol", label: "Ktoś z zespołu" }, { v: "agencja", label: "Agencja" }, { v: "nikt", label: "Nikt" }]
const BUDGET: Choice[] = [{ v: "0", label: "0 zł" }, { v: "do1k", label: "do 1 tys. zł" }, { v: "1-5k", label: "1–5 tys. zł" }, { v: "5k+", label: "powyżej 5 tys. zł" }]
const MANUAL = [
  { k: "followers", label: "Obserwujący" },
  { k: "avgViews", label: "Średnie wyświetlenia rolki" },
  { k: "posts30", label: "Publikacje z 30 dni" },
  { k: "reels30", label: "W tym rolki z 30 dni" },
] as const

type ProfileCheck = { status: "ok" | "malo_rolek" | "nie_znaleziono" | "nieznany" | "zla_nazwa"; username?: string; followers?: number | null }

const field = "min-h-14 w-full rounded-[16px] bg-[var(--h-bg)] px-4 text-[16px] text-[var(--h-ink)] outline-none ring-1 ring-inset ring-[var(--mf-line)] transition-shadow placeholder:text-[var(--h-ink-2)] focus:ring-2 focus:ring-[var(--h-accent)]"

function Segmented({ name, legend, options, value, onChange }: { name: string; legend: string; options: Choice[]; value: string; onChange: (v: string) => void }) {
  return (
    <fieldset className="min-w-0">
      <legend className="mb-2.5 text-[15px] font-semibold text-[var(--h-ink)]">{legend}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => (
          <label key={o.v} className={`mf-press inline-flex min-h-11 cursor-pointer items-center rounded-full px-4 text-[15px] font-semibold ring-1 ring-inset transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-[var(--h-accent)] ${value === o.v ? "bg-[var(--h-ink)] text-[var(--h-bg)] ring-[var(--h-ink)]" : "bg-[var(--h-bg)] text-[var(--h-ink)] ring-[var(--mf-line)] hover:bg-[var(--h-surface-hover)]"}`}>
            <input type="radio" name={name} value={o.v} checked={value === o.v} onChange={() => onChange(o.v)} className="sr-only" />
            {o.label}
          </label>
        ))}
      </div>
    </fieldset>
  )
}

/** Formularz darmowego audytu: krok 1 (profil + e-mail) w hero, krok 2 (3 pytania, zgody) rozwija się pod spodem. */
export function AuditForm({ place }: { place: "hero" | "end" }) {
  const uid = useId()
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [handle, setHandle] = useState("")
  const [email, setEmail] = useState("")
  const [profileType, setProfileType] = useState("")
  const [whoMakes, setWhoMakes] = useState("")
  const [budget, setBudget] = useState("")
  const [owner, setOwner] = useState(false)
  const [newsletter, setNewsletter] = useState(false)
  const [manualOpen, setManualOpen] = useState(false)
  const [manual, setManual] = useState<Record<string, string>>({})
  const [check, setCheck] = useState<ProfileCheck | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [resetKey, setResetKey] = useState(0)
  const [error, setError] = useState("")
  const [busy, setBusy] = useState(false)
  const step2 = useRef<HTMLDivElement>(null)

  // Link z maila „brak danych”: ?profil=nazwa&dane=1 → profil wpisany, pola z 4 liczbami otwarte.
  useEffect(() => {
    if (place !== "hero") return
    // Po hydracji (adres znany tylko w przeglądarce), poza synchronicznym przebiegiem efektu.
    const t = setTimeout(() => {
      const q = new URLSearchParams(window.location.search)
      const p = parseHandle(q.get("profil"))
      if (p) setHandle(p)
      if (q.get("dane") === "1") setManualOpen(true)
    }, 0)
    return () => clearTimeout(t)
  }, [place])

  const needManual = manualOpen || check?.status === "nie_znaleziono" || check?.status === "malo_rolek"

  async function next(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    const h = parseHandle(handle)
    if (!h) return setError("Podaj nazwę profilu na Instagramie, np. @twoja.firma.")
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) return setError("Podaj prawidłowy adres e-mail.")
    setHandle(h)
    setStep(2)
    setCheck(null)
    requestAnimationFrame(() => step2.current?.querySelector<HTMLInputElement>("input[type=radio]")?.focus({ preventScroll: true }))
    try {
      const r = await fetch(`/api/audyt/profil?u=${encodeURIComponent(h)}`)
      setCheck((await r.json()) as ProfileCheck)
    } catch {
      setCheck({ status: "nieznany" })
    }
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    if (!profileType || !whoMakes || !budget) return setError("Zaznacz odpowiedź na każde z 3 pytań.")
    if (!owner) return setError("Potwierdź, że to Twój profil albo profil firmy, którym zarządzasz.")
    if (needManual && MANUAL.some((m) => !manual[m.k]?.trim())) return setError("Wpisz wszystkie 4 liczby z panelu Instagrama.")
    if (TURNSTILE_SITE_KEY && !token) return setError("Chwilę, sprawdzamy, czy nie jesteś botem. Spróbuj za sekundę.")
    setBusy(true)
    try {
      const res = await fetch("/api/audyt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          handle, email: email.trim(), profileType, whoMakes, budget, owner, newsletter,
          manual: needManual ? manual : null, turnstileToken: token, utm: getUtm(),
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError(data.error || "Coś poszło nie tak. Spróbuj ponownie.")
        setResetKey((k) => k + 1)
        return
      }
      setStep(3)
    } catch {
      setError("Brak połączenia. Spróbuj ponownie.")
      setResetKey((k) => k + 1)
    } finally {
      setBusy(false)
    }
  }

  if (step === 3) {
    return (
      <div role="status" className="rounded-[28px] bg-[var(--h-surface)] p-6 md:p-8">
        <MailCheck className="size-8 text-[var(--h-accent-ink)]" strokeWidth={2} aria-hidden />
        <p className="mt-4 text-[24px] font-bold leading-[1.15] tracking-[-0.02em]">Sprawdź skrzynkę</p>
        <p className="mt-2 max-w-[48ch] text-[17px] leading-[1.55] text-[var(--h-ink-2)]">
          Wysłaliśmy link na <strong className="text-[var(--h-ink)]">{email.trim()}</strong>. Kliknij go, a zaczniemy audyt @{handle}. Nie widzisz maila? Zajrzyj do folderu Oferty lub Spam.
        </p>
      </div>
    )
  }

  const errId = `${uid}-err`
  return (
    <div className="rounded-[28px] bg-[var(--h-surface)] p-3 md:p-4">
      <form onSubmit={next} noValidate aria-describedby={error && step === 1 ? errId : undefined} className="grid gap-3 md:grid-cols-[1fr_1fr_auto] md:items-end">
        <label className="flex flex-col gap-1.5">
          <span className="px-1 text-[13px] font-semibold text-[var(--h-ink-2)]">Profil na Instagramie</span>
          <span className="relative">
          <span aria-hidden className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[16px] font-semibold text-[var(--h-ink-2)]">@</span>
          <input
            value={handle}
            onChange={(e) => { setHandle(e.target.value); if (step === 2) setStep(1) }}
            name="instagram" autoComplete="off" autoCapitalize="none" spellCheck={false} inputMode="url" maxLength={80}
            placeholder="twoja.firma" className={`${field} pl-9`}
          />
          </span>
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="px-1 text-[13px] font-semibold text-[var(--h-ink-2)]">Twój e-mail</span>
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" name="email" autoComplete="email" maxLength={254} placeholder="ania@twojafirma.pl" className={field} />
        </label>
        {step === 1 && (
          <button className="mf-press inline-flex min-h-14 items-center justify-center gap-2 rounded-full bg-[var(--h-accent)] px-7 text-[17px] font-bold text-[#111111] hover:brightness-95">
            Zrób mi darmowy audyt <ArrowRight className="size-5" strokeWidth={2.25} aria-hidden />
          </button>
        )}
      </form>
      {step === 1 && error && <p id={errId} role="alert" className="px-3 pt-3 text-[15px] font-semibold text-[var(--mf-danger)]">{error}</p>}
      {step === 1 && place === "hero" && (
        <p className="px-3 pb-1 pt-3 text-[14px] leading-[1.5] text-[var(--h-ink-2)]">Bez karty i bez zobowiązań. Wynik przyjdzie mailem.</p>
      )}

      {step === 2 && (
        <div ref={step2} className="px-2 pb-2 pt-5 md:px-3">
          <ProfileStatus check={check} handle={handle} />
          <form onSubmit={submit} noValidate aria-describedby={error ? errId : undefined} className="mt-5 flex flex-col gap-6">
            <Segmented name={`${uid}-pt`} legend="Ten profil jest" options={PROFILE} value={profileType} onChange={setProfileType} />
            <Segmented name={`${uid}-who`} legend="Kto dziś robi Twoje rolki?" options={WHO} value={whoMakes} onChange={setWhoMakes} />
            <Segmented name={`${uid}-bud`} legend="Miesięczny budżet na marketing" options={BUDGET} value={budget} onChange={setBudget} />

            {needManual ? (
              <fieldset className="rounded-[20px] bg-[var(--h-bg)] p-4">
                <legend className="sr-only">4 liczby z panelu Instagrama</legend>
                <p className="text-[15px] font-semibold">4 liczby z panelu Instagrama</p>
                <p className="mt-1 text-[14px] leading-[1.5] text-[var(--h-ink-2)]">Znajdziesz je w aplikacji: Profil → Panel profesjonalny albo Statystyki, ostatnie 30 dni.</p>
                <div className="mt-3 grid grid-cols-2 gap-3">
                  {MANUAL.map((m) => (
                    <label key={m.k} className="flex flex-col gap-1.5 text-[14px] font-semibold">
                      {m.label}
                      <input inputMode="numeric" value={manual[m.k] ?? ""} onChange={(e) => setManual((s) => ({ ...s, [m.k]: e.target.value.replace(/[^\d\s]/g, "").slice(0, 12) }))} className={`${field} min-h-12`} />
                    </label>
                  ))}
                </div>
              </fieldset>
            ) : (
              <button type="button" onClick={() => setManualOpen(true)} className="self-start text-[14px] font-semibold text-[var(--h-ink-2)] underline decoration-[var(--h-accent)] decoration-2 underline-offset-4">
                Masz konto prywatne? Podaj 4 liczby z panelu
              </button>
            )}

            <div className="flex flex-col gap-3">
              <label className="flex min-h-11 cursor-pointer items-start gap-3 py-1 text-[14px] leading-[21px]">
                <input type="checkbox" checked={owner} onChange={(e) => setOwner(e.target.checked)} className="mt-0.5 size-6 shrink-0 accent-[var(--h-accent)]" />
                <span><strong>{AUDYT_TEXT.owner}</strong> <span className="text-[var(--h-ink-2)]">(wymagane)</span></span>
              </label>
              <label className="flex min-h-11 cursor-pointer items-start gap-3 py-1 text-[14px] leading-[21px] text-[var(--h-ink-2)]">
                <input type="checkbox" checked={newsletter} onChange={(e) => setNewsletter(e.target.checked)} className="mt-0.5 size-6 shrink-0 accent-[var(--h-accent)]" />
                <span>{AUDYT_TEXT.newsletter}</span>
              </label>
            </div>

            <div className="-mt-2 flex flex-col gap-3 [&>div:empty]:hidden">
            <Turnstile action="audyt" onToken={setToken} resetKey={resetKey} />
            {error && <p id={errId} role="alert" className="text-[15px] font-semibold text-[var(--mf-danger)]">{error}</p>}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <button disabled={busy} className="mf-press inline-flex min-h-14 shrink-0 items-center whitespace-nowrap justify-center gap-2 rounded-full bg-[var(--h-accent)] px-7 text-[17px] font-bold text-[#111111] hover:brightness-95 disabled:opacity-60">
                {busy ? <Loader2 className="size-5 animate-spin" aria-hidden /> : null}
                {busy ? "Wysyłam…" : "Wyślij zgłoszenie"}
              </button>
              <p className="text-[14px] leading-[20px] text-[var(--h-ink-2)]">
                Potem kliknij link w mailu. Dane profilu kasujemy po 7 dniach, audyt po 30. <Link href="/polityka-prywatnosci#audyt" className="underline">Polityka prywatności</Link>
              </p>
            </div>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}

function ProfileStatus({ check, handle }: { check: ProfileCheck | null; handle: string }) {
  if (!check) return <p aria-live="polite" className="flex items-center gap-2 text-[15px] text-[var(--h-ink-2)]"><Loader2 className="size-4 animate-spin" aria-hidden /> Sprawdzamy profil @{handle}…</p>
  if (check.status === "ok") {
    return (
      <p aria-live="polite" className="flex items-center gap-2 text-[15px] font-semibold">
        <span className="grid size-6 place-items-center rounded-full bg-[var(--mf-success-soft)] text-[var(--mf-success)]"><Check className="size-4" strokeWidth={2.5} aria-hidden /></span>
        Widzimy profil @{check.username ?? handle}{typeof check.followers === "number" ? `: ${check.followers.toLocaleString("pl-PL")} obserwujących` : ""}. Jeszcze 3 pytania.
      </p>
    )
  }
  if (check.status === "nie_znaleziono" || check.status === "malo_rolek") {
    return (
      <div aria-live="polite" className="flex gap-3 rounded-[18px] bg-[var(--h-accent-soft,rgb(255_106_19/0.15))] p-4 text-[15px] leading-[1.5]">
        <Info className="mt-0.5 size-5 shrink-0 text-[var(--h-accent-ink)]" strokeWidth={2.25} aria-hidden />
        <p>
          {check.status === "nie_znaleziono"
            ? <>Nie widzimy publicznych danych @{handle}. Działa to tylko z kontami firmowymi i twórców. Przełącz konto w aplikacji (Ustawienia → Typ konta i narzędzia) albo wpisz niżej 4 liczby z panelu.</>
            : <>Profil @{handle} ma mniej niż 3 rolki, więc nie mamy z czego policzyć wyników. Wpisz niżej 4 liczby z panelu albo wróć, gdy opublikujesz kilka rolek.</>}
        </p>
      </div>
    )
  }
  return <p aria-live="polite" className="text-[15px] text-[var(--h-ink-2)]">Jeszcze 3 pytania o @{handle}.</p>
}
