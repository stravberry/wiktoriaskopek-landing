"use client"

import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import { AnimatePresence, motion, useReducedMotion, useScroll, useSpring } from "framer-motion"
import { LazyVideo } from "@/components/mf/lazy-video"

// „Jak to działa krok po kroku” (00-PLAN 0d, pkt 10): każdy krok ma zrzut, rolkę z programu albo animowaną makietę ekranu.
// Makiety (zakup, zaproszenie, instalacja) to ilustracje przebiegu, nie zrzuty ekranu.

import type { MfStep as Step, MfStepMedia as Media } from "@/lib/mf/content"
import { PanelClip } from "@/components/mf/apple"

const EASE = [0.16, 1, 0.3, 1] as const

function Check() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden className="size-4 shrink-0 text-[#28c840]">
      <path d="M3 8.5l3.2 3L13 4.5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

/** Wiersze makiety pojawiają się po kolei, gdy makieta jest w widoku; przy „ogranicz ruch” od razu cała. */
function Seq({ children, i, play }: { children: React.ReactNode; i: number; play: boolean }) {
  const reduce = useReducedMotion()
  if (reduce) return <>{children}</>
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={play ? { opacity: 1, y: 0 } : undefined} transition={{ duration: 0.4, delay: 0.25 + i * 0.45, ease: EASE }}>
      {children}
    </motion.div>
  )
}

function useInView<T extends Element>() {
  const ref = useRef<T>(null)
  const [seen, setSeen] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setSeen(true), { threshold: 0.4 })
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return [ref, seen] as const
}

function Mock({ ui }: { ui: "checkout" | "invite" | "install" }) {
  const [ref, play] = useInView<HTMLDivElement>()
  if (ui === "checkout")
    return (
      <div ref={ref} className="grid h-full place-items-center bg-[#f5f5f7] p-6">
        <div className="w-full max-w-[340px] rounded-[20px] bg-white p-6 border border-black/10">
          {/* Audyt Ecom 2, pkt 13: podpis, żeby nikt nie pomyślał, że już zapłacił. */}
          <p className="mb-3 inline-block rounded-full bg-[#f5f5f7] px-2.5 py-1 text-[13px] font-semibold text-[#4a4a4a]">Przykład</p>
          <p className="flex items-baseline justify-between gap-4 text-[17px] font-semibold">
            MontageFrames <span className="text-[28px] font-bold tracking-[-0.02em]">238,00 zł</span>
          </p>
          <Seq i={0} play={play}>
            <div className="mt-5 flex gap-2 text-[15px] font-semibold">
              <span className="rounded-full bg-[#1d1d1f] px-4 py-2 text-white">BLIK</span>
              <span className="rounded-full bg-[#f5f5f7] px-4 py-2">Karta</span>
            </div>
          </Seq>
          <Seq i={1} play={play}>
            <div className="mt-5 rounded-full bg-[var(--h-accent)] py-3 text-center text-[15px] font-bold text-[#111111]">Zapłać</div>
          </Seq>
          <Seq i={2} play={play}>
            <p className="mt-5 flex items-center gap-2 text-[15px] font-semibold"><Check />Płatność przyjęta. Mail z dostępem już leci.</p>
          </Seq>
        </div>
      </div>
    )
  if (ui === "invite")
    return (
      <div ref={ref} className="grid h-full place-items-center bg-[#f5f5f7] p-6">
        <div className="w-full max-w-[380px] rounded-[20px] bg-white p-6 border border-black/10">
          <p className="text-[17px] font-semibold leading-[1.35]">GitHub: zaproszenie do prywatnego repozytorium z paczką MontageFrames</p>
          <Seq i={0} play={play}>
            <div className="mt-5 inline-block rounded-full bg-[#1f883d] px-5 py-2.5 text-[15px] font-semibold text-white">Akceptuj zaproszenie</div>
          </Seq>
          <Seq i={1} play={play}>
            <pre className="mt-5 overflow-hidden rounded-[12px] bg-[#1d1d1f] p-4 text-[15px] leading-[1.6] text-[#f5f5f7]"><code>git clone …/MontageFrames-dist{"\n"}cd MontageFrames-dist{"\n"}claude</code></pre>
          </Seq>
        </div>
      </div>
    )
  const lines: [boolean, string][] = [
    [true, "/start"],
    [false, "Sprawdzam komputer. Brakuje narzędzi do montażu i transkrypcji. Zainstalować?"],
    [true, "tak"],
    [false, "Narzędzia zainstalowane. Teraz ustawimy markę: wpisz /marka"],
  ]
  return (
    <div ref={ref} className="h-full bg-[#1d1d1f] text-[15px] leading-[1.55] text-[#f5f5f7]">
      <div className="flex items-center gap-2 bg-[#2c2c2e] px-5 py-3 text-[#a1a1a6]">
        <span className="size-3 rounded-full bg-[#ff5f57]" />
        <span className="size-3 rounded-full bg-[#febc2e]" />
        <span className="size-3 rounded-full bg-[#28c840]" />
        <span className="ml-3">claude · MontageFrames</span>
      </div>
      <div className="flex flex-col gap-3 p-6">
        {lines.map(([you, t], i) => (
          <Seq key={t} i={i} play={play}>
            <p className={you ? "text-white" : "text-[#c7c7cc]"}>
              {you ? <span className="mr-2 font-bold text-[#ff7a2e]">&gt;</span> : <span aria-hidden className="mr-2.5 inline-block size-2 rounded-full bg-[#8e8e93] align-middle" />}
              {t}
            </p>
          </Seq>
        ))}
      </div>
    </div>
  )
}

function StepMedia({ m, sticky = false }: { m: Media; sticky?: boolean }) {
  const frame = "relative aspect-[4/5] sm:aspect-[4/3] w-full overflow-hidden rounded-[24px] bg-[#1d1d1f]"
  if (m.kind === "ui") return <div className={frame}><Mock ui={m.ui} /></div>
  if (m.kind === "clip") return <PanelClip clip={m.clip} className={frame} />
  if (m.kind === "img")
    return (
      <div className={`${frame} bg-[var(--h-surface)]`}>
        <Image src={m.src} alt={m.alt} fill sizes="(min-width: 1024px) 600px, 92vw" className="object-cover object-left-top" />
      </div>
    )
  return (
    <div className={`${frame} grid place-items-center bg-[#2c2c2e]`}>
      {sticky ? (
        <video className="h-[92%] w-auto rounded-[16px]" src={m.src} poster={m.poster} autoPlay muted loop playsInline preload="none" aria-label={m.label} />
      ) : (
        <LazyVideo className="h-[92%] w-auto rounded-[16px]" src={m.src} poster={m.poster} label={m.label} />
      )}
    </div>
  )
}

export function StepByStep({ steps }: { steps: Step[] }) {
  const [active, setActive] = useState(0)
  const listRef = useRef<HTMLOListElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: listRef, offset: ["start 60%", "end 60%"] })
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 })

  useEffect(() => {
    const items = listRef.current?.querySelectorAll<HTMLElement>("[data-step]")
    if (!items) return
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(Number((e.target as HTMLElement).dataset.step))),
      { rootMargin: "-45% 0px -45% 0px" },
    )
    items.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-16">
      <ol ref={listRef} className="relative flex flex-col gap-16 pl-14 lg:gap-0">
        <span aria-hidden className="absolute bottom-0 left-[19px] top-0 w-[2px] bg-[var(--h-surface-hover)]" />
        <motion.span aria-hidden style={{ scaleY: reduce ? 1 : progress }} className="absolute bottom-0 left-[19px] top-0 w-[2px] origin-top bg-[var(--h-accent)]" />
        {steps.map((s, i) => (
          <li key={s.title} data-step={i} className="relative lg:flex lg:min-h-[62vh] lg:flex-col lg:justify-center">
            <span
              aria-hidden
              className={`absolute -left-14 top-0 grid size-10 place-items-center rounded-full text-[15px] font-bold transition-colors duration-300 lg:top-1/2 lg:-translate-y-1/2 ${
                i <= active ? "bg-[var(--h-accent)] text-[#111111]" : "bg-[var(--h-surface)] text-[var(--h-ink-2)]"
              }`}
            >
              {i + 1}
            </span>
            <div className={`transition-opacity duration-300 ${i === active ? "lg:opacity-100" : "lg:opacity-[0.65]"}`}>
              <h3 className="text-[24px] font-semibold leading-[1.2] tracking-[-0.015em]">{s.title}</h3>
              <p className="mt-3 max-w-[46ch] leading-[1.6]">{s.text}</p>
            </div>
            <div className="mt-6 lg:hidden">
              <StepMedia m={s.media} />
            </div>
          </li>
        ))}
      </ol>
      <div className="hidden lg:block">
        <div className="sticky top-[18vh]">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={active}
              initial={reduce ? false : { opacity: 0, scale: 0.97, filter: "blur(6px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={reduce ? undefined : { opacity: 0, scale: 0.98, filter: "blur(4px)" }}
              transition={{ duration: 0.35, ease: EASE }}
            >
              <StepMedia m={steps[active].media} sticky />
            </motion.div>
          </AnimatePresence>
          <p className="mt-4 text-[15px] text-[var(--h-ink-2)]">
            Krok {active + 1} z {steps.length}: {steps[active].title}
          </p>
        </div>
      </div>
    </div>
  )
}
