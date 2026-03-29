"use client"

import { useEffect, useRef, useState } from "react"
import type { Locale } from "@/lib/translations"

function useFadeIn() {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.unobserve(el)
        }
      },
      { threshold: 0.15 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return { ref, isVisible }
}

export default function TechnoWhySection({ lang = "pl" }: { lang?: Locale }) {
  const heading = useFadeIn()
  const body = useFadeIn()
  const cta = useFadeIn()

  return (
    <section
      id="dlaczego"
      className="relative w-full py-24 md:py-32 lg:py-40 overflow-hidden"
      style={{ backgroundColor: "#0d0d0d" }}
    >
      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Accent glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full pointer-events-none opacity-[0.04]"
        style={{
          background: "radial-gradient(circle, rgba(255,102,0,0.6) 0%, transparent 70%)",
          transform: "translate(30%, -40%)",
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto px-6 md:px-12 lg:px-20">
        {/* Asymmetric layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Left column — heading */}
          <div className="lg:col-span-5">
            <div
              ref={heading.ref}
              style={{
                opacity: heading.isVisible ? 1 : 0,
                transform: heading.isVisible ? "translateY(0)" : "translateY(40px)",
                transition: "opacity 0.8s ease-out, transform 0.8s ease-out",
              }}
            >
              <span className="inline-flex items-center gap-2 text-accent font-mono text-[10px] md:text-xs tracking-[0.3em] uppercase mb-6 block">
                <span className="w-8 h-px bg-accent" />
                Dlaczego tego potrzebujesz?
              </span>

              <h2 className="font-display text-[clamp(2.5rem,6vw,5rem)] leading-[0.9] text-white tracking-tight">
                DOBRA SELEKCJA
                <br />
                TO DZISIAJ
                <br />
                <span className="text-accent">ZA MAŁO.</span>
              </h2>
            </div>
          </div>

          {/* Right column — body text */}
          <div className="lg:col-span-7 lg:pt-16">
            <div
              ref={body.ref}
              style={{
                opacity: body.isVisible ? 1 : 0,
                transform: body.isVisible ? "translateY(0)" : "translateY(40px)",
                transition: "opacity 0.8s ease-out 0.2s, transform 0.8s ease-out 0.2s",
              }}
            >
              <p className="text-white/60 font-mono text-sm md:text-base leading-relaxed mb-6">
                Wielu DJ-ów myśli, że świetny set obroni się sam. Prawda jest taka,
                że&nbsp;rynek jest zapchany, a&nbsp;promotorzy dostają dziesiątki wiadomości
                dziennie. Jeśli nie masz profesjonalnego portfolio, press kitu (EPK)
                i&nbsp;dobrze poprowadzonych social mediów,{" "}
                <span className="text-white font-bold">po prostu giniesz w&nbsp;tłumie.</span>
              </p>

              {/* Divider */}
              <div className="flex items-center gap-4 my-8">
                <div className="flex-1 h-px bg-white/10" />
                <span className="text-accent font-mono text-[10px] tracking-[0.3em]">+</span>
                <div className="flex-1 h-px bg-white/10" />
              </div>

              <p className="text-white/50 font-mono text-sm md:text-base leading-relaxed mb-6">
                Nie musisz znać się na&nbsp;algorytmach, kodowaniu czy montażu wideo.{" "}
                <span className="text-accent">Od tego masz mnie.</span>
              </p>

              <p className="text-white/60 font-mono text-sm md:text-base leading-relaxed mb-10">
                Oferuję pełne wsparcie: od&nbsp;zmontowania dynamicznych materiałów
                z&nbsp;Twoich występów, przez postawienie profesjonalnej strony,
                aż&nbsp;po&nbsp;automatyzacje, które ułatwią Ci kontakt z&nbsp;klubami.{" "}
                <span className="text-white/80 font-bold">
                  Zróbmy z&nbsp;Twojej pasji dobrze prosperujący biznes.
                </span>
              </p>

              {/* CTA */}
              <div
                ref={cta.ref}
                style={{
                  opacity: cta.isVisible ? 1 : 0,
                  transform: cta.isVisible ? "translateY(0)" : "translateY(20px)",
                  transition: "opacity 0.6s ease-out 0.3s, transform 0.6s ease-out 0.3s",
                }}
              >
                <a
                  href="#kontakt"
                  className="group inline-flex items-center gap-3 px-8 py-4 border border-accent/50 text-accent font-mono text-xs md:text-sm tracking-wider uppercase transition-all duration-300 hover:border-accent hover:bg-accent/10 hover:shadow-[0_0_25px_rgba(255,102,0,0.15)] hover:gap-5"
                >
                  Sprawdź, jak mogę Ci pomóc
                  <svg
                    className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom border */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />
    </section>
  )
}
