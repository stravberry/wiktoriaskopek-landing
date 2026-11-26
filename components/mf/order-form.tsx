"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowRight, Check, Loader2, X } from "lucide-react"
import { MF_BASE_PATH, MF_PRODUCTS, MF_TEXT, type MfProductId } from "@/lib/mf/config"
import { trackEvent } from "@/components/consent/consent-provider"

type Answer = "tak" | "nie" | null

function Choice({ value, set, label }: { value: Answer; set: (a: Answer) => void; label: string }) {
  return (
    <fieldset className="flex flex-col gap-3">
      <legend className="mb-3 text-[17px] font-semibold">{label}</legend>
      <div className="flex gap-3">
        {(["tak", "nie"] as const).map((a) => (
          <button
            key={a}
            type="button"
            aria-pressed={value === a}
            onClick={() => set(a)}
            className={`min-h-12 flex-1 rounded-full px-5 text-[17px] font-semibold transition-colors ${
              value === a ? "bg-[var(--h-ink)] text-[var(--h-bg)]" : "bg-[var(--h-bg)] hover:bg-[var(--h-surface-hover)]"
            }`}
          >
            {a === "tak" ? "Tak" : "Nie"}
          </button>
        ))}
      </div>
    </fieldset>
  )
}

function Consent({ checked, set, children, required }: { checked: boolean; set: (v: boolean) => void; children: React.ReactNode; required?: boolean }) {
  return (
    <label className="flex cursor-pointer items-start gap-3 text-[15px] leading-[1.5]">
      <input type="checkbox" checked={checked} onChange={(e) => set(e.target.checked)} className="mt-1 size-5 shrink-0 accent-[var(--h-accent)]" />
      <span>
        {children}
        {required && <span className="text-[var(--h-accent-ink)]"> (wymagane)</span>}
      </span>
    </label>
  )
}

export default function OrderForm({ initialProduct = "paczka" }: { initialProduct?: MfProductId }) {
  const [claude, setClaude] = useState<Answer>(null)
  const [computer, setComputer] = useState<Answer>(null)
  const [product, setProduct] = useState<MfProductId>(initialProduct)
  const [email, setEmail] = useState("")
  const [github, setGithub] = useState("")
  const [terms, setTerms] = useState(false)
  const [digital, setDigital] = useState(false)
  const [serviceStart, setServiceStart] = useState(false)
  const [marketing, setMarketing] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const onPick = (e: Event) => setProduct((e as CustomEvent<MfProductId>).detail)
    window.addEventListener("mf:pick", onPick)
    return () => window.removeEventListener("mf:pick", onPick)
  }, [])

  const fitDone = claude !== null && computer !== null
  const fitOk = claude === "tak" && computer === "tak"
  useEffect(() => {
    if (fitDone) trackEvent(fitOk ? "fit_check_pass" : "fit_check_fail")
  }, [fitDone, fitOk])

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    if (!terms || !digital) {
      setError("Zaznacz akceptację regulaminu i zgodę na natychmiastowe dostarczenie, żeby przejść do płatności.")
      return
    }
    setBusy(true)
    try {
      const utm = Object.fromEntries(
        [...new URLSearchParams(window.location.search)].filter(([k]) => k.startsWith("utm_")),
      )
      const res = await fetch("/api/mf/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product, email, githubLogin: github, terms, digital, serviceStart, marketing, utm }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok || !data.url) throw new Error(data.error || "Nie udało się rozpocząć płatności.")
      trackEvent("begin_checkout", { product })
      window.location.assign(data.url)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Nie udało się rozpocząć płatności.")
      setBusy(false)
    }
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_1.2fr]">
      <div className="rounded-[28px] bg-[var(--h-surface)] p-7 md:p-9">
        <h3 className="text-[24px] font-semibold tracking-[-0.02em]">1. Test zgodności</h3>
        <p className="mt-2 text-[17px] text-[var(--h-ink-2)]">Dwa pytania, żeby nie kupić czegoś, co u Ciebie nie zadziała.</p>
        <div className="mt-7 flex flex-col gap-7">
          <Choice value={claude} set={setClaude} label="Masz albo kupisz płatny plan Claude Pro lub Max?" />
          <Choice value={computer} set={setComputer} label="Masz komputer z macOS 14+, Windows 10/11 albo Linuksem i min. 15 GB wolnego miejsca?" />
        </div>
        {fitDone && (
          <div role="status" className={`mt-7 flex gap-3 rounded-[20px] p-5 text-[15px] leading-[1.5] ${fitOk ? "bg-[var(--h-bg)]" : "bg-[var(--h-accent)]/15"}`}>
            {fitOk ? <Check className="size-5 shrink-0 text-[var(--h-accent-ink)]" /> : <X className="size-5 shrink-0 text-[var(--h-accent-ink)]" />}
            {fitOk ? (
              <span>Spełniasz wymagania. Możesz zamówić.</span>
            ) : claude === "nie" ? (
              <span>Bez płatnego planu Claude program nie zadziała. Jeśli chcesz najpierw porozmawiać, <Link className="underline" href="/pl#rezerwacja">umów bezpłatną konsultację</Link>.</span>
            ) : (
              <span>
                Bez min. 15 GB wolnego miejsca i jednego z tych systemów program się nie zainstaluje. Jeśli nie masz pewności,{" "}
                <Link className="underline" href="/pl#rezerwacja">umów bezpłatną konsultację</Link> albo wybierz wariant z instalacją.
              </span>
            )}
          </div>
        )}
      </div>

      <form onSubmit={submit} className="rounded-[28px] bg-[var(--h-surface)] p-7 md:p-9" noValidate>
        <h3 className="text-[24px] font-semibold tracking-[-0.02em]">2. Zamówienie</h3>
        <div className="mt-6 grid gap-3 sm:grid-cols-2" role="radiogroup" aria-label="Wariant">
          {Object.values(MF_PRODUCTS).map((p) => (
            <button
              key={p.id}
              type="button"
              role="radio"
              aria-checked={product === p.id}
              onClick={() => setProduct(p.id)}
              className={`rounded-[20px] p-5 text-left transition-colors ${product === p.id ? "bg-[var(--h-bg)] outline outline-2 outline-[var(--h-accent)]" : "bg-[var(--h-bg)]/60 hover:bg-[var(--h-bg)]"}`}
            >
              <span className="block text-[15px] font-semibold">{p.id === "paczka" ? "Program" : "Program + konsultacja 1:1"}</span>
              <span className="mt-1 block text-[24px] font-bold tracking-[-0.03em]">{p.priceLabel}</span>
              <span className="mt-1 block text-[15px] leading-[1.4] text-[var(--h-ink-2)]">{p.short}</span>
            </button>
          ))}
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-2 text-[15px] font-semibold">
            E-mail (możesz też podać go w Stripe)
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" className="min-h-12 rounded-2xl bg-[var(--h-bg)] px-4 font-normal outline-none focus:ring-2 focus:ring-[var(--h-accent)]" />
          </label>
          <label className="flex flex-col gap-2 text-[15px] font-semibold">
            Login GitHub (opcjonalnie, do odbioru paczki)
            <input value={github} onChange={(e) => setGithub(e.target.value)} placeholder="np. jan-kowalski" autoComplete="off" className="min-h-12 rounded-2xl bg-[var(--h-bg)] px-4 font-normal outline-none focus:ring-2 focus:ring-[var(--h-accent)]" />
          </label>
        </div>

        <div className="mt-6 flex flex-col gap-4">
          <Consent checked={terms} set={setTerms} required>
            Akceptuję <Link className="underline" href={`${MF_BASE_PATH}/regulamin`} target="_blank">Regulamin sprzedaży MontageFrames</Link> i zapoznałem/-am się z{" "}
            <Link className="underline" href="/pl/polityka-prywatnosci" target="_blank">Polityką prywatności</Link>.
          </Consent>
          <Consent checked={digital} set={setDigital} required>{MF_TEXT.digital}</Consent>
          {product === "konsultacja" && (
            <Consent checked={serviceStart} set={setServiceStart}>{MF_TEXT.serviceStart} Bez tej zgody konsultację planujemy po 14 dniach.</Consent>
          )}
          <Consent checked={marketing} set={setMarketing}>{MF_TEXT.marketing}</Consent>
        </div>

        {error && <p role="alert" className="mt-5 rounded-2xl bg-[var(--h-accent)]/15 p-4 text-[15px] font-semibold">{error}</p>}

        <button
          type="submit"
          disabled={busy}
          className="mt-7 flex min-h-14 w-full items-center justify-center gap-3 rounded-full bg-[var(--h-accent)] px-7 text-[17px] font-bold text-[#111111] transition-transform active:scale-[0.98] disabled:opacity-60"
        >
          {busy ? <Loader2 className="size-5 animate-spin" /> : null}
          {MF_TEXT.orderButton} · {MF_PRODUCTS[product].priceLabel}
          {!busy && <ArrowRight className="size-5" />}
        </button>
        <p className="mt-3 text-center text-[15px] text-[var(--h-ink-2)]">
          Płacisz na stronie Stripe: BLIK, karta, Apple Pay, Google Pay i inne metody dostępne w Stripe.
        </p>
      </form>
    </div>
  )
}
