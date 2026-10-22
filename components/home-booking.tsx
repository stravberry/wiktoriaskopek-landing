"use client"

import { useEffect, useState, type ReactNode } from "react"
import Image from "next/image"
import { AnimatePresence, motion } from "framer-motion"
import { ArrowUp, ArrowUpRight, Moon, Phone, Sun } from "lucide-react"

const SERVICES = [
  {
    title: "Nagrania filmowe",
    text: "Rolki, wywiady i materiały eksperckie nagrane w studiu albo u Ciebie. Prompter, reżyseria i montaż biorę na siebie.",
  },
  {
    title: "Prowadzenie social mediów",
    text: "Strategia, harmonogram i publikacje na Instagramie, Facebooku, TikToku i LinkedInie. Regularnie i spójnie.",
  },
  {
    title: "Konsultacje marketingowe",
    text: "Przyglądamy się Twojemu marketingowi i ustalamy konkretne kroki, żeby treści przyciągały klientów.",
  },
  {
    title: "Szkolenia filmowe i marketingowe",
    text: "Uczę, jak nagrywać, montować i planować treści, żeby kamera przestała stresować, a zaczęła sprzedawać.",
  },
  {
    title: "Strony internetowe",
    text: "Projektuję i wdrażam strony, które prowadzą klienta od pierwszego wejścia do rezerwacji. Razem z zespołem webdkw.net.",
  },
]

const PHONE = "+48 537 168 645"
const PHONE_HREF = "tel:+48537168645"

const LINKS = [
  { label: "Instagram", handle: "@wiktoriaskopek", href: "https://www.instagram.com/wiktoriaskopek/" },
  { label: "Facebook", handle: "stravberryx", href: "https://www.facebook.com/stravberryx/" },
  { label: "Studio nagrań", handle: "podcastkatowice.pl", href: "https://podcastkatowice.pl" },
  { label: "Agencja kreatywna", handle: "dkwgroup.net", href: "https://dkwgroup.net/pl" },
  { label: "Strony internetowe", handle: "webdkw.net", href: "https://webdkw.net" },
  { label: "Agencja marketingowa i sprzedażowa", handle: "adify.pl", href: "https://adify.pl" },
]

// Wejście przy przewinięciu: krótki ruch w górę + pojawienie się, raz (Premium: bez odbicia)
function Reveal({ children, as = "div", delay = 0 }: { children: ReactNode; as?: "div" | "li"; delay?: number }) {
  const M = as === "li" ? motion.li : motion.div
  return (
    <M
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </M>
  )
}

const NS = "darmowa-konsultacja"
const STORAGE_KEY = "home-theme"

type Theme = "light" | "dark"

const currentTheme = (): Theme =>
  document.documentElement.dataset.homeTheme === "dark" ? "dark" : "light"

function mountCal(theme: Theme) {
  const el = document.getElementById("cal-inline")
  const api = (window as any).Cal?.ns?.[NS]
  if (!el || !api) return
  el.replaceChildren()
  api("inline", {
    elementOrSelector: "#cal-inline",
    config: { layout: "month_view", useSlotsViewOnSmallScreen: "true", theme },
    calLink: "team/dkwgroup/darmowa-konsultacja",
  })
  api("ui", {
    theme,
    hideEventTypeDetails: false,
    layout: "month_view",
    cssVarsPerTheme: {
      light: { "cal-brand": "#ff6a13", "cal-brand-text": "#111111" },
      dark: { "cal-brand": "#ff7a2e", "cal-brand-text": "#111111" },
    },
  })
}

export default function HomeBooking() {
  const [showCall, setShowCall] = useState(false)

  useEffect(() => {
    const onScroll = () => setShowCall(window.scrollY > 480)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    // Cal.com embed loader (oficjalny snippet)
    ;(function (C: any, A: string, L: string) {
      const p = (a: any, ar: any) => a.q.push(ar)
      const d = C.document
      C.Cal =
        C.Cal ||
        function () {
          const cal = C.Cal
          const ar = arguments
          if (!cal.loaded) {
            cal.ns = {}
            cal.q = cal.q || []
            d.head.appendChild(d.createElement("script")).src = A
            cal.loaded = true
          }
          if (ar[0] === L) {
            const api: any = function () {
              p(api, arguments)
            }
            const namespace = ar[1]
            api.q = api.q || []
            if (typeof namespace === "string") {
              cal.ns[namespace] = cal.ns[namespace] || api
              p(cal.ns[namespace], ar)
              p(cal, ["initNamespace", namespace])
            } else p(cal, ar)
            return
          }
          p(cal, ar)
        }
    })(window, "https://app.cal.com/embed/embed.js", "init")

    const el = document.getElementById("cal-inline")
    if (!el || el.childElementCount > 0) return // StrictMode: nie osadzaj dwa razy

    ;(window as any).Cal("init", NS, { origin: "https://app.cal.com" })
    mountCal(currentTheme())
  }, [])

  const toggleTheme = () => {
    const next: Theme = currentTheme() === "dark" ? "light" : "dark"
    document.documentElement.dataset.homeTheme = next
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {}
    mountCal(next) // embed Cal.com nie przełącza motywu w locie, więc osadzamy go od nowa
  }

  return (
    <div className="home min-h-dvh bg-[var(--h-bg)] text-[var(--h-ink)] transition-colors duration-300">
      <header className="mx-auto flex max-w-[1240px] items-center justify-between px-5 pt-5 md:px-10 md:pt-8">
        <span className="text-[17px] font-semibold tracking-[-0.01em]">Wiktoria Skopek</span>
        <button
          type="button"
          onClick={toggleTheme}
          className="grid size-11 place-items-center rounded-full bg-[var(--h-surface)] text-[var(--h-ink)] transition-[background-color,transform] duration-200 hover:bg-[var(--h-surface-hover)] active:scale-95"
        >
          <Moon className="home-icon-light size-[18px]" strokeWidth={2} aria-hidden />
          <Sun className="home-icon-dark size-[18px]" strokeWidth={2} aria-hidden />
          <span className="home-icon-light sr-only">Włącz tryb ciemny</span>
          <span className="home-icon-dark sr-only">Włącz tryb jasny</span>
        </button>
      </header>

      <main className="mx-auto max-w-[1240px] px-5 pb-36 pt-10 md:px-10 md:pt-20 lg:pb-40">
        <section
          className="flex flex-col gap-6"
          aria-labelledby="home-title"
        >
          <div className="min-w-0 flex-1">
            <Image
              src="/images/wiktoria-skopek.jpg"
              alt="Wiktoria Skopek"
              width={192}
              height={192}
              priority
              className="mb-7 size-20 rounded-full bg-[var(--h-accent)] object-cover md:size-24"
            />
            <h1
              id="home-title"
              className="text-balance text-[clamp(2.5rem,6vw,5.5rem)] font-bold leading-[1] tracking-[-0.04em]"
            >
              Umów się na darmową konsultację
            </h1>
          </div>
          <p className="max-w-[44ch] text-pretty text-[19px] leading-[1.5] text-[var(--h-ink-2)] md:text-[21px]">
            Porozmawiajmy o Twojej marce i o tym, od czego zacząć. Wybierz termin, który Ci pasuje, albo
            zadzwoń:{" "}
            <a
              href={PHONE_HREF}
              className="whitespace-nowrap font-semibold text-[var(--h-ink)] underline decoration-[var(--h-accent)] decoration-2 underline-offset-4"
            >
              {PHONE}
            </a>
          </p>
        </section>

        <section id="rezerwacja" className="mt-12 scroll-mt-6 md:mt-16" aria-label="Kalendarz rezerwacji">
          <div id="cal-inline" className="min-h-[520px] w-full" />

          <p className="mt-8 flex items-center justify-center gap-3 text-[15px] leading-[1.5] text-[var(--h-ink-2)]">
            <span className="home-pulse relative size-2.5 shrink-0 rounded-full bg-[var(--h-accent)]" aria-hidden />
            Strona jest w budowie. Wkrótce znajdziesz tu więcej.
          </p>
        </section>

        <section className="mt-28 md:mt-40" aria-labelledby="uslugi-title">
          <Reveal>
            <h2 id="uslugi-title" className="text-[clamp(2rem,4vw,3.5rem)] font-bold leading-[1.05] tracking-[-0.035em]">
              Czym się zajmuję
            </h2>
          </Reveal>
          <ul className="mt-10 grid gap-3 md:mt-14 md:grid-cols-2 md:gap-4 md:[&>li:last-child:nth-child(odd)]:col-span-2">
            {SERVICES.map((s, i) => (
              <Reveal as="li" key={s.title} delay={i * 0.07}>
                <a
                  href="#rezerwacja"
                  className="home-tile group flex h-full flex-col justify-between gap-10 rounded-[28px] bg-[var(--h-surface)] p-7 md:min-h-[260px] md:p-9"
                >
                  <div>
                    <h3 className="text-[24px] font-semibold leading-[1.15] tracking-[-0.02em] md:text-[28px]">{s.title}</h3>
                    <p className="mt-3 max-w-[42ch] text-[17px] leading-[1.55] text-[var(--h-ink-2)]">{s.text}</p>
                  </div>
                  <span className="flex items-center gap-2 text-[16px] font-semibold text-[var(--h-accent-ink)]">
                    Umów konsultację
                    <ArrowUp className="home-tile-arrow size-[18px]" strokeWidth={2.25} aria-hidden />
                  </span>
                </a>
              </Reveal>
            ))}
          </ul>
        </section>

        <section className="mt-28 md:mt-40" aria-labelledby="linki-title">
          <Reveal>
            <h2 id="linki-title" className="text-[clamp(2rem,4vw,3.5rem)] font-bold leading-[1.05] tracking-[-0.035em]">
              Znajdziesz mnie też tu
            </h2>
          </Reveal>
          <ul className="mt-10 flex flex-col gap-3 md:mt-14">
            {LINKS.map((l, i) => (
              <Reveal as="li" key={l.href} delay={i * 0.06}>
                <a
                  href={l.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="home-tile group flex min-h-[72px] items-center justify-between gap-4 rounded-full bg-[var(--h-surface)] py-4 pl-7 pr-5 md:min-h-[84px] md:pl-9 md:pr-6"
                >
                  <span className="flex min-w-0 flex-col md:flex-row md:items-baseline md:gap-4">
                    <span className="text-[19px] font-semibold tracking-[-0.01em] md:text-[22px]">{l.label}</span>
                    <span className="truncate text-[15px] text-[var(--h-ink-2)] md:text-[17px]">{l.handle}</span>
                  </span>
                  <span className="grid size-11 shrink-0 place-items-center rounded-full bg-[var(--h-accent)] text-[#111111]">
                    <ArrowUpRight className="home-tile-arrow size-5" strokeWidth={2.25} aria-hidden />
                  </span>
                </a>
              </Reveal>
            ))}
          </ul>
        </section>
      </main>

      <AnimatePresence>
        {showCall && (
          <motion.a
            href={PHONE_HREF}
            aria-label={`Zadzwoń: ${PHONE}`}
            className="fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))] right-5 z-50 flex min-h-14 items-center gap-3 rounded-full bg-[var(--h-accent)] py-3 pl-4 pr-6 text-[#111111] shadow-[0_10px_30px_-8px_rgba(0,0,0,0.35)] transition-transform duration-150 active:scale-95 md:right-8 md:bottom-8"
            initial={{ opacity: 0, y: 24, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.95, transition: { duration: 0.18, ease: [0.4, 0, 1, 1] } }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="home-ring grid size-9 place-items-center rounded-full bg-[#111111]/10">
              <Phone className="size-[18px]" strokeWidth={2.25} aria-hidden />
            </span>
            <span className="flex flex-col leading-tight">
              <span className="text-[13px] font-medium opacity-75">Kliknij, aby zadzwonić</span>
              <span className="text-[16px] font-bold tabular-nums">{PHONE}</span>
            </span>
          </motion.a>
        )}
      </AnimatePresence>
    </div>
  )
}
