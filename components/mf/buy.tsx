"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { ArrowDown, ArrowRight, Loader2, X } from "lucide-react"
import { MF_BASE_PATH, MF_PRODUCTS, MF_TEXT, type MfProductId } from "@/lib/mf/config"
import { trackEvent } from "@/components/consent/consent-provider"
import { captureUtm, getUtm, utmForEvents } from "@/lib/mf/utm-client"

// Szybki zakup (00-PLAN 0e, pkt 1): ten sam formularz w okienku (z każdego przycisku „Kup”) i w sekcji #zamowienie.
// Do kasy: wariant (domyślnie program) + 2 wymagane zgody + przycisk. E-mail podaje się w Stripe, login GitHub po zakupie na koncie.

const BUY_EVENT = "mf:buy"

/** Zdarzenie do własnego dziennika (serwer, bez ciasteczek) i do Vercel Analytics (tylko po zgodzie). */
export function logFunnel(event: string, props: Record<string, string> = {}) {
  const body = JSON.stringify({ event, props: { ...utmForEvents(), ...props, device: window.matchMedia("(max-width: 767px)").matches ? "mobile" : "desktop" } })
  if (!navigator.sendBeacon?.("/api/mf/event", new Blob([body], { type: "application/json" }))) {
    fetch("/api/mf/event", { method: "POST", headers: { "Content-Type": "application/json" }, body, keepalive: true }).catch(() => {})
  }
  trackEvent(event, props)
}

/** Zapisuje źródło wejścia (UTM, fbclid) przy pierwszym wejściu w tej karcie. Bez wyglądu. */
export function UtmCapture() {
  useEffect(() => {
    captureUtm()
    // Wejście do lejka (audyt Ecom 2, pkt 12): raz na kartę, bez ciasteczek.
    try {
      if (!sessionStorage.getItem("mf_seen")) {
        sessionStorage.setItem("mf_seen", "1")
        logFunnel("landing_view", { placement: window.location.pathname.split("/").pop() || "landing" })
      }
    } catch {}
  }, [])
  return null
}

export const openBuy = (product: MfProductId = "paczka", placement = "button") => {
  logFunnel("buy_click", { placement, offer: product })
  window.dispatchEvent(new CustomEvent(BUY_EVENT, { detail: product }))
}

function Consent({ checked, set, children, required, small }: { checked: boolean; set: (v: boolean) => void; children: React.ReactNode; required?: boolean; small?: boolean }) {
  return (
    <label className={`flex min-h-11 cursor-pointer items-start gap-3 rounded-xl py-1 leading-[1.45] ${small ? "text-[14px]" : "text-[15px]"}`}>
      <input type="checkbox" checked={checked} onChange={(e) => set(e.target.checked)} className="mt-0.5 size-6 shrink-0 accent-[var(--h-accent)]" />
      <span>
        {children}
        {required && <span className="text-[var(--h-accent-ink)]"> (wymagane)</span>}
      </span>
    </label>
  )
}

// Różnica w wartości, nie w godzinach (audyt Kierownika P2.10).
const VALUE: Record<MfProductId, string> = {
  paczka: "Instalujesz sam(a) z Claude Code w 15–30 min. Wsparcie mailowe w sprawie instalacji.",
  konsultacja: "Instalujemy razem na Twoim komputerze i robimy Twoją pierwszą rolkę. Kończysz spotkanie z gotowym programem i rolką.",
}

export function BuyForm({ initialProduct = "paczka", compact = false }: { initialProduct?: MfProductId; compact?: boolean }) {
  const [product, setProduct] = useState<MfProductId>(initialProduct)
  const [terms, setTerms] = useState(false)
  const [digital, setDigital] = useState(false)
  const [serviceStart, setServiceStart] = useState(false)
  const [marketing, setMarketing] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [waitlist, setWaitlist] = useState(false)
  // Zmiana produktu z zewnątrz (inny przycisk „Kupuję”): aktualizacja w trakcie renderu zamiast efektu.
  const [prevInitial, setPrevInitial] = useState(initialProduct)
  if (prevInitial !== initialProduct) {
    setPrevInitial(initialProduct)
    setProduct(initialProduct)
  }
  useEffect(() => {
    fetch("/api/mf/checkout", { cache: "no-store" }).then((r) => r.json()).then((d) => d.waitlist && setWaitlist(true)).catch(() => {})
  }, [])

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    if (!terms || !digital) {
      setError("Zaznacz akceptację regulaminu i zgodę na natychmiastowe dostarczenie, żeby przejść do płatności.")
      logFunnel("consent_error_shown", { missing: !terms && !digital ? "both" : !terms ? "terms" : "immediate" })
      return
    }
    setBusy(true)
    try {
      const utm = getUtm()
      const res = await fetch("/api/mf/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product, terms, digital, serviceStart, marketing, utm }),
      })
      const data = await res.json().catch(() => ({}))
      // Sklep w trybie testowym (S2): zamiast płatności zapis na listę „daj znać, gdy sprzedaż ruszy”.
      if (data.waitlist) {
        setWaitlist(true)
        setBusy(false)
        logFunnel("waitlist_shown", { product })
        return
      }
      if (!res.ok || !data.url) throw new Error(data.error || "Nie udało się rozpocząć płatności.")
      trackEvent("begin_checkout", { product })
      window.location.assign(data.url)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Nie udało się rozpocząć płatności.")
      setBusy(false)
    }
  }

  if (waitlist) return <WaitlistForm />

  return (
    <form onSubmit={submit} noValidate>
      <div className={`grid gap-3 ${compact ? "grid-cols-2" : "sm:grid-cols-2"}`} role="radiogroup" aria-label="Wariant">
        {Object.values(MF_PRODUCTS).map((p) => (
          <button
            key={p.id}
            type="button"
            role="radio"
            aria-checked={product === p.id}
            onClick={() => setProduct(p.id)}
            className={`rounded-[20px] text-left transition-colors ${compact ? "p-3 md:p-4" : "p-4 md:p-5"} ${product === p.id ? "bg-[var(--h-bg)] outline outline-2 outline-[var(--h-accent)]" : "bg-[var(--h-bg)]/60 hover:bg-[var(--h-bg)]"}`}
          >
            <span className="block text-[14px] font-semibold md:text-[15px]">{p.id === "paczka" ? "Program" : "Program + konsultacja 1:1"}</span>
            <span className="mt-1 block text-[24px] font-bold tracking-[-0.03em]">{p.priceLabel}</span>
            {!compact && <span className="mt-1 block text-[15px] leading-[1.4] text-[var(--h-ink-2)]">{VALUE[p.id]}</span>}
          </button>
        ))}
      </div>

      <div className={`flex flex-col ${compact ? "mt-4 gap-2" : "mt-5 gap-4"}`}>
        <Consent checked={terms} set={setTerms} required small={compact}>
          Akceptuję <Link className="underline" href={`${MF_BASE_PATH}/regulamin`} target="_blank">Regulamin sprzedaży MontageFrames</Link> i zapoznałem/-am się z{" "}
          <Link className="underline" href="/pl/polityka-prywatnosci" target="_blank">Polityką prywatności</Link>.
        </Consent>
        <Consent checked={digital} set={setDigital} required small={compact}>{MF_TEXT.digital}</Consent>
        {product === "konsultacja" && (
          <Consent checked={serviceStart} set={setServiceStart} small={compact}>{MF_TEXT.serviceStart} Bez tej zgody konsultację planujemy po 14 dniach.</Consent>
        )}
        <Consent checked={marketing} set={setMarketing} small={compact}>{MF_TEXT.marketing}</Consent>
      </div>

      <p className={`rounded-2xl bg-[var(--h-bg)] leading-[1.45] ${compact ? "mt-3 p-3 text-[14px]" : "mt-5 p-4 text-[15px]"}`}>
        <strong>Wymagania:</strong> płatny plan Claude Pro lub Max, macOS 14+ / Windows 10/11 / Linux, min. 15 GB miejsca.{" "}
        <a className="underline" href="#wymagania">Szczegóły</a>
      </p>

      {error && <p role="alert" className="mt-5 rounded-2xl bg-[var(--h-accent)]/15 p-4 text-[15px] font-semibold">{error}</p>}

      <button
        type="submit"
        disabled={busy}
        className="group mt-4 flex min-h-14 w-full items-center justify-center gap-3 rounded-full bg-[var(--h-accent)] px-7 text-[17px] font-bold text-[#111111] transition-transform active:scale-[0.98] disabled:opacity-60"
      >
        {busy ? <Loader2 className="size-5 animate-spin" /> : null}
        {MF_TEXT.orderButton} · {MF_PRODUCTS[product].priceLabel}
        {!busy && <ArrowRight className="size-5" />}
      </button>
      <p className="mt-3 text-center text-[15px] leading-[1.5] text-[var(--h-ink-2)]">
        Płacisz na stronie Stripe: BLIK, karta, Klarna. Apple Pay i Google Pay, jeśli Twoje urządzenie je obsługuje. E-mail podajesz w Stripe.
      </p>
      <GuaranteeLine className="mt-1 text-center" />
    </form>
  )
}

/** Sklep w trybie testowym: zapis na listę zamiast płatności (bez wysyłki maila). */
function WaitlistForm() {
  const [email, setEmail] = useState("")
  const [ok, setOk] = useState(false)
  const [consent, setConsent] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    if (!consent) return setError("Zaznacz zgodę na maila o starcie sprzedaży.")
    setBusy(true)
    const res = await fetch("/api/mf/lista", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, marketing: true }) }).catch(() => null)
    const data = res ? await res.json().catch(() => ({})) : {}
    setBusy(false)
    if (!res || !res.ok) return setError(data.error || "Nie udało się zapisać. Spróbuj ponownie.")
    setOk(true)
    logFunnel("waitlist_joined")
  }
  if (ok) return <p role="status" className="rounded-2xl bg-[var(--h-bg)] p-5 text-[17px] font-semibold">Zapisane. Napiszemy, gdy sprzedaż ruszy.</p>
  return (
    <form onSubmit={submit} noValidate>
      <p className="text-[22px] font-bold tracking-[-0.02em]">Sklep w trybie testowym: zakup wkrótce</p>
      <p className="mt-2 text-[16px] leading-[1.5] text-[var(--h-ink-2)]">Zostaw e-mail, a napiszemy, gdy sprzedaż ruszy. Do tego czasu możesz zrobić darmową próbę na swoim nagraniu.</p>
      <label className="mt-4 block text-[15px] font-semibold" htmlFor="mf-lista-email">E-mail</label>
      <input id="mf-lista-email" type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)}
        className="mt-1 min-h-12 w-full rounded-2xl bg-[var(--h-bg)] px-4 text-[17px] outline-none focus:outline-2 focus:outline-[var(--h-accent)]" />
      <div className="mt-4"><Consent checked={consent} set={setConsent} required>{MF_TEXT.marketing}</Consent></div>
      {error && <p role="alert" className="mt-4 rounded-2xl bg-[var(--h-accent)]/15 p-4 text-[15px] font-semibold">{error}</p>}
      <button type="submit" disabled={busy} className="mt-4 flex min-h-14 w-full items-center justify-center gap-3 rounded-full bg-[var(--h-accent)] px-7 text-[17px] font-bold text-[#111111] disabled:opacity-60">
        {busy ? <Loader2 className="size-5 animate-spin" /> : null}Dajcie znać, gdy ruszy
      </button>
    </form>
  )
}

/** Linia gwarancji pod przyciskami zakupu (treść gwarancji bez zmian, audyt Kierownika P2.11). */
export function GuaranteeLine({ className = "" }: { className?: string }) {
  return (
    <p className={`text-[15px] leading-[1.5] text-[var(--h-ink-2)] ${className}`}>
      <a className="underline decoration-[var(--h-accent)] underline-offset-4" href="#gwarancja">Gwarancja działania 14 dni</a>: zwrot, jeśli nie uruchomisz programu mimo naszej pomocy.
    </p>
  )
}

/** Okienko zakupu: otwiera je każdy przycisk „Kup” (openBuy). Natywny <dialog>: fokus w środku, Esc zamyka. */
export function BuyDialog() {
  const ref = useRef<HTMLDialogElement>(null)
  const [product, setProduct] = useState<MfProductId>("paczka")
  useEffect(() => {
    const on = (e: Event) => {
      setProduct((e as CustomEvent<MfProductId>).detail ?? "paczka")
      ref.current?.showModal()
    }
    window.addEventListener(BUY_EVENT, on)
    return () => window.removeEventListener(BUY_EVENT, on)
  }, [])
  return (
    <dialog
      ref={ref}
      aria-labelledby="buy-title"
      onClick={(e) => e.target === ref.current && ref.current?.close()}
      className="mf-sheet m-0 mt-auto max-h-[96dvh] w-full max-w-none overflow-y-auto rounded-t-[24px] bg-[var(--h-surface)] p-4 text-[var(--h-ink)] backdrop:bg-black/50 md:m-auto md:max-w-[640px] md:rounded-[28px] md:p-8"
    >
      <div className="flex items-start justify-between gap-4">
        <h2 id="buy-title" className="text-[21px] font-bold tracking-[-0.02em] md:text-[24px]">Kupujesz MontageFrames</h2>
        <button type="button" onClick={() => ref.current?.close()} aria-label="Zamknij" className="mf-press grid size-11 shrink-0 place-items-center rounded-full bg-[var(--h-bg)]">
          <X className="size-5" />
        </button>
      </div>
      <div className="mt-3">
        <BuyForm initialProduct={product} compact />
      </div>
    </dialog>
  )
}

/** Przycisk „Kup”: otwiera okienko zakupu; bez JS przewija do formularza. */
export function BuyButton({ product = "paczka", source = "button", children, variant = "primary" }: { product?: MfProductId; source?: string; children: React.ReactNode; variant?: "primary" | "secondary" }) {
  return (
    <a
      href="#zamowienie"
      role="button"
      onClick={(e) => {
        e.preventDefault()
        openBuy(product, source)
      }}
      className={`group inline-flex min-h-14 items-center justify-center gap-3 rounded-full px-7 text-[17px] font-bold transition-transform active:scale-[0.98] ${
        variant === "primary" ? "bg-[var(--h-accent)] text-[#111111]" : "bg-[var(--h-surface)] text-[var(--h-ink)] hover:bg-[var(--h-surface-hover)]"
      }`}
    >
      {children}
      <ArrowDown className="mf-nudge size-5" />
    </a>
  )
}

/** Przyklejony pasek zakupu na telefonie: pojawia się po minięciu pierwszego ekranu, znika przy formularzu zamówienia. */
export function StickyBuyBar({ trialHref }: { trialHref?: string }) {
  const [show, setShow] = useState(false)
  useEffect(() => {
    const order = document.getElementById("zamowienie")
    let pastHero = false
    let atOrder = false
    const update = () => setShow(pastHero && !atOrder)
    const onScroll = () => {
      pastHero = window.scrollY > window.innerHeight * 0.8
      update()
    }
    const io = new IntersectionObserver(([e]) => {
      atOrder = e.isIntersecting
      update()
    })
    if (order) io.observe(order)
    window.addEventListener("scroll", onScroll, { passive: true })
    onScroll()
    return () => {
      window.removeEventListener("scroll", onScroll)
      io.disconnect()
    }
  }, [])
  return (
    <div
      aria-hidden={!show}
      className={`fixed inset-x-0 bottom-0 z-[70] border-t border-black/10 bg-[var(--h-bg)]/95 px-4 pb-[max(12px,env(safe-area-inset-bottom))] pt-3 backdrop-blur transition-transform duration-300 md:hidden ${show ? "translate-y-0" : "translate-y-full"}`}
    >
      <div className="flex items-center gap-3">
        <button type="button" tabIndex={show ? 0 : -1} onClick={() => openBuy("paczka", "sticky")} className="mf-press min-h-12 flex-1 rounded-full bg-[var(--h-accent)] px-5 text-[17px] font-bold text-[#111111]">
          {trialHref ? `Kupuję · ${MF_PRODUCTS.paczka.priceLabel}` : `MontageFrames · ${MF_PRODUCTS.paczka.priceLabel} · Kupuję`}
        </button>
        {trialHref && (
          <Link href={trialHref} tabIndex={show ? 0 : -1} onClick={() => logFunnel("trial_click", { placement: "sticky" })} className="mf-press grid min-h-12 place-items-center rounded-full bg-[var(--h-surface)] px-5 text-[15px] font-semibold">
            Wypróbuj
          </Link>
        )}
      </div>
    </div>
  )
}

/** Link otwierający okienko zakupu z wariantem z konsultacją. */
export function KonsultacjaLink({ children }: { children: React.ReactNode }) {
  return (
    <a href="#zamowienie" onClick={(e) => { e.preventDefault(); openBuy("konsultacja", "hero_konsultacja") }} className="font-semibold text-[var(--h-ink)] underline underline-offset-4">
      {children}
    </a>
  )
}

/** Krótki rząd zakupu po kluczowej sekcji. */
export function BuyRow({ source, trialHref }: { source: string; trialHref?: string }) {
  return (
    <div className="mf-wrap mt-14 md:mt-20">
      <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
        <BuyButton source={source}>Kupuję za {MF_PRODUCTS.paczka.priceLabel}</BuyButton>
        {trialHref && (
          <Link href={trialHref} onClick={() => logFunnel("trial_click", { placement: source })} className="text-[17px] font-semibold underline decoration-[var(--h-accent)] decoration-2 underline-offset-4">
            Wypróbuj za darmo na 1 rolce
          </Link>
        )}
      </div>
      <GuaranteeLine className="mt-4" />
    </div>
  )
}
