"use client"
/* eslint-disable @typescript-eslint/no-explicit-any, prefer-rest-params -- oficjalny snippet osadzenia Cal.com (bez typów) */

import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Moon, Phone, Sun } from "lucide-react"
import { useConsent } from "@/components/consent/consent-provider"
import CalPlaceholder from "@/components/consent/cal-placeholder"

export const PHONE = "+48 537 168 645"
export const PHONE_HREF = "tel:+48537168645"
const NS = "darmowa-konsultacja"
const STORAGE_KEY = "home-theme"
type Theme = "light" | "dark"
const currentTheme = (): Theme => (document.documentElement.dataset.homeTheme === "dark" ? "dark" : "light")

function mountCal(theme: Theme) {
  const el = document.getElementById("cal-inline")
  const api = (window as any).Cal?.ns?.[NS]
  if (!el || !api) return
  el.replaceChildren()
  api("inline", { elementOrSelector: "#cal-inline", config: { layout: "month_view", useSlotsViewOnSmallScreen: "true", theme }, calLink: "team/dkwgroup/darmowa-konsultacja" })
  api("ui", { theme, hideEventTypeDetails: false, layout: "month_view", cssVarsPerTheme: { light: { "cal-brand": "#ff6a13", "cal-brand-text": "#111111" }, dark: { "cal-brand": "#ff7a2e", "cal-brand-text": "#111111" } } })
}

export function ThemeToggle() {
  const { state: consent } = useConsent()
  const toggle = () => {
    const next: Theme = currentTheme() === "dark" ? "light" : "dark"
    document.documentElement.dataset.homeTheme = next
    try { localStorage.setItem(STORAGE_KEY, next) } catch {}
    if (consent?.external) mountCal(next) // embed Cal.com nie przełącza motywu w locie
  }
  return (
    <button type="button" onClick={toggle} className="grid size-11 place-items-center rounded-full bg-[var(--h-surface)] text-[var(--h-ink)] transition-[background-color,transform] duration-200 hover:bg-[var(--h-surface-hover)] active:scale-95">
      <Moon className="home-icon-light size-[18px]" strokeWidth={2} aria-hidden />
      <Sun className="home-icon-dark size-[18px]" strokeWidth={2} aria-hidden />
      <span className="home-icon-light sr-only">Włącz tryb ciemny</span>
      <span className="home-icon-dark sr-only">Włącz tryb jasny</span>
    </button>
  )
}

/** Kalendarz Cal.com dopiero po zgodzie „Treści zewnętrzne”. */
export function Booking() {
  const { state: consent } = useConsent()
  const calAllowed = !!consent?.external
  useEffect(() => {
    if (!calAllowed) return
    ;(function (C: any, A: string, L: string) {
      const p = (a: any, ar: any) => a.q.push(ar)
      const d = C.document
      C.Cal = C.Cal || function () {
        const cal = C.Cal
        const ar = arguments
        if (!cal.loaded) { cal.ns = {}; cal.q = cal.q || []; d.head.appendChild(d.createElement("script")).src = A; cal.loaded = true }
        if (ar[0] === L) {
          const api: any = function () { p(api, arguments) }
          const namespace = ar[1]
          api.q = api.q || []
          if (typeof namespace === "string") { cal.ns[namespace] = cal.ns[namespace] || api; p(cal.ns[namespace], ar); p(cal, ["initNamespace", namespace]) } else p(cal, ar)
          return
        }
        p(cal, ar)
      }
    })(window, "https://app.cal.com/embed/embed.js", "init")
    const el = document.getElementById("cal-inline")
    if (!el || el.childElementCount > 0) return
    ;(window as any).Cal("init", NS, { origin: "https://app.cal.com" })
    mountCal(currentTheme())
  }, [calAllowed])
  return calAllowed ? <div id="cal-inline" className="min-h-[520px] w-full" /> : <CalPlaceholder />
}

export function CallFab() {
  const [show, setShow] = useState(false)
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 900)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])
  return (
    <AnimatePresence>
      {show && (
        <motion.a
          href={PHONE_HREF}
          aria-label={`Zadzwoń: ${PHONE}`}
          className="fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))] right-5 z-50 flex min-h-14 items-center gap-3 rounded-full bg-[var(--h-accent)] py-3 pl-4 pr-6 text-[#111111] shadow-[0_10px_30px_-8px_rgba(0,0,0,0.35)] transition-transform duration-150 active:scale-95 md:bottom-8 md:right-8"
          initial={{ opacity: 0, y: 24, scale: 0.92 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.95, transition: { duration: 0.18, ease: [0.4, 0, 1, 1] } }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="home-ring grid size-9 place-items-center rounded-full bg-[#111111]/10"><Phone className="size-[18px]" strokeWidth={2.25} aria-hidden /></span>
          <span className="flex flex-col leading-tight">
            <span className="text-[13px] font-medium opacity-75">Kliknij, aby zadzwonić</span>
            <span className="text-[16px] font-bold">{PHONE}</span>
          </span>
        </motion.a>
      )}
    </AnimatePresence>
  )
}
