"use client"

import { useEffect, useRef, useState } from "react"
import { AlertTriangle, Zap, TrendingUp } from "lucide-react"

const steps = [
  {
    label: "TWÓJ PROBLEM",
    icon: AlertTriangle,
    accent: "#ff3b3b",
    accentGlow: "rgba(255,59,59,0.08)",
    borderAccent: "rgba(255,59,59,0.15)",
    text: "Jesteś niewidoczny w internecie, brakuje Ci rozpoznawalności i tracisz potencjalnych klientów premium na rzecz konkurencji.",
  },
  {
    label: "NASZE ROZWIĄZANIE",
    icon: Zap,
    accent: "#ff6600",
    accentGlow: "rgba(255,102,0,0.08)",
    borderAccent: "rgba(255,102,0,0.15)",
    text: "Przejmujemy kontrolę nad Twoimi social mediami. Budujemy strategię, nagrywamy, montujemy.",
  },
  {
    label: "TWÓJ REZULTAT",
    icon: TrendingUp,
    accent: "#22c55e",
    accentGlow: "rgba(34,197,94,0.08)",
    borderAccent: "rgba(34,197,94,0.15)",
    text: "Budujesz silny brand i dostajesz gotowe zapytania od osób, które już Ci ufają.",
  },
]

export default function VslMathSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [visibleCards, setVisibleCards] = useState<boolean[]>([false, false, false])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.getAttribute("data-index"))
            setVisibleCards((prev) => {
              const next = [...prev]
              next[index] = true
              return next
            })
          }
        })
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    )

    const cards = sectionRef.current?.querySelectorAll("[data-index]")
    cards?.forEach((card) => observer.observe(card))

    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative py-20 md:py-32 overflow-hidden"
      style={{ background: "#050505" }}
    >
      {/* Top separator line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      {/* Section title */}
      <div className="max-w-5xl mx-auto px-4 md:px-8 mb-14 md:mb-20 text-center">
        <span className="inline-block font-mono text-[10px] md:text-xs text-white/30 tracking-[0.3em] uppercase mb-4">
          Prosta matematyka
        </span>
        <h2 className="font-display text-[clamp(1.8rem,5vw,3.5rem)] leading-[0.95] text-white tracking-tight">
          CZEGO MOŻESZ SIĘ{" "}
          <span
            className="relative inline-block"
            style={{
              background: "linear-gradient(135deg, #ff6600, #ff8533)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            SPODZIEWAĆ
          </span>
        </h2>
      </div>

      {/* Cards + connecting lines */}
      <div className="max-w-5xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-5 relative">

          {/* Connecting arrows — desktop only */}
          <div className="hidden md:block absolute top-1/2 left-[33.33%] -translate-x-1/2 -translate-y-1/2 z-20">
            <div
              className="w-8 h-8 flex items-center justify-center rounded-full border border-white/10"
              style={{ background: "#0a0a0a" }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M5 3L9 7L5 11" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
          <div className="hidden md:block absolute top-1/2 left-[66.66%] -translate-x-1/2 -translate-y-1/2 z-20">
            <div
              className="w-8 h-8 flex items-center justify-center rounded-full border border-white/10"
              style={{ background: "#0a0a0a" }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M5 3L9 7L5 11" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>

          {/* Mobile connecting arrows */}
          {[0, 1].map((i) => (
            <div
              key={`mobile-arrow-${i}`}
              className="md:hidden flex justify-center -my-3 relative z-20"
              style={{ display: i === 0 ? undefined : undefined }}
            >
              {/* This is placed via CSS order, we handle it differently */}
            </div>
          ))}

          {steps.map((step, i) => {
            const Icon = step.icon
            const isVisible = visibleCards[i]

            return (
              <div
                key={step.label}
                data-index={i}
                className="relative group transition-all duration-700 ease-out"
                style={{
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? "translateY(0)" : "translateY(40px)",
                  transitionDelay: `${i * 150}ms`,
                }}
              >
                {/* Mobile arrow between cards */}
                {i > 0 && (
                  <div className="md:hidden flex justify-center -mt-3 mb-3">
                    <div
                      className="w-8 h-8 flex items-center justify-center rounded-full border border-white/10"
                      style={{ background: "#0a0a0a" }}
                    >
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M3 5L7 9L11 5" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  </div>
                )}

                {/* Card */}
                <div
                  className="relative rounded-lg p-6 md:p-8 h-full border transition-all duration-500"
                  style={{
                    background: `linear-gradient(165deg, ${step.accentGlow}, #090909 60%)`,
                    borderColor: step.borderAccent,
                    boxShadow: `0 0 40px ${step.accentGlow}`,
                  }}
                >
                  {/* Top accent line */}
                  <div
                    className="absolute top-0 left-6 right-6 h-px"
                    style={{
                      background: `linear-gradient(90deg, transparent, ${step.accent}40, transparent)`,
                    }}
                  />

                  {/* Icon + Label */}
                  <div className="flex items-center gap-3 mb-5">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center border"
                      style={{
                        borderColor: `${step.accent}30`,
                        background: `${step.accent}10`,
                      }}
                    >
                      <Icon
                        className="w-5 h-5"
                        style={{ color: step.accent }}
                        strokeWidth={1.5}
                      />
                    </div>
                    <span
                      className="font-display text-sm md:text-base tracking-wider"
                      style={{ color: step.accent }}
                    >
                      {step.label}
                    </span>
                  </div>

                  {/* Step number */}
                  <div
                    className="absolute top-5 right-6 font-display text-[3rem] leading-none opacity-[0.04]"
                    style={{ color: step.accent }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </div>

                  {/* Text */}
                  <p className="text-white/60 font-mono text-[11px] md:text-[13px] leading-relaxed">
                    {step.text}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Bottom separator */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-40 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </section>
  )
}
