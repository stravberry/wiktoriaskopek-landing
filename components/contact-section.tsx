"use client"

import { useRef, useEffect, useState } from "react"
import { Mail, Phone, Instagram, Linkedin } from "lucide-react"

export default function ContactSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setIsVisible(true)
        })
      },
      { threshold: 0.15 },
    )

    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} className="relative bg-black py-32 overflow-hidden" id="contact">
      {/* Top border draws in */}
      <div
        className="absolute top-0 left-0 right-0 h-px bg-white/5"
        style={{
          transform: isVisible ? "scaleX(1)" : "scaleX(0)",
          transition: "transform 1.5s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      />

      {/* Grid background fades in */}
      <div
        className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,102,0,.02)_1px,transparent_1px),linear-gradient(rgba(255,102,0,.02)_1px,transparent_1px)] bg-[size:60px_60px]"
        style={{
          opacity: isVisible ? 1 : 0,
          transition: "opacity 2s ease-out 0.5s",
        }}
      />

      {/* Large decorative text in background */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-display text-[25vw] text-white/[0.015] pointer-events-none select-none whitespace-nowrap"
        style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? "translate(-50%, -50%) scale(1)" : "translate(-50%, -50%) scale(0.8)",
          transition: "all 2s cubic-bezier(0.16, 1, 0.3, 1) 0.3s",
        }}
      >
        KONTAKT
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Left - Big CTA, slides in from left */}
          <div
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? "translateX(0)" : "translateX(-60px)",
              transition: "all 1s cubic-bezier(0.16, 1, 0.3, 1) 0.2s",
            }}
          >
            <span
              className="text-accent font-mono text-xs tracking-[0.3em] uppercase"
              style={{
                clipPath: isVisible ? "inset(0 0 0 0)" : "inset(0 100% 0 0)",
                transition: "clip-path 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.4s",
              }}
            >
              Kontakt
            </span>

            {/* Each word reveals with mask */}
            <div className="mt-6 mb-8 overflow-hidden">
              <h2
                className="font-display text-[10vw] md:text-[6vw] text-white leading-[0.9] tracking-tight"
                style={{
                  transform: isVisible ? "translateY(0)" : "translateY(110%)",
                  transition: "transform 1s cubic-bezier(0.16, 1, 0.3, 1) 0.3s",
                }}
              >
                POROZMAWIAJMY
              </h2>
            </div>

            <p
              className="text-white/50 font-mono text-sm max-w-md leading-relaxed mb-12"
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? "translateY(0)" : "translateY(20px)",
                transition: "all 0.8s ease-out 0.7s",
              }}
            >
              Masz projekt? Pomysł? A\u00A0może po\u00A0prostu chcesz pogadać o\u00A0AI i\u00A0wideo? Napisz do\u00A0mnie.
            </p>

            <a
              href="mailto:wskopek.all@gmail.com"
              className="inline-flex items-center gap-4 px-8 py-5 bg-accent text-black font-mono text-sm tracking-wider hover:bg-white transition-colors uppercase group"
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? "translateY(0) scale(1)" : "translateY(20px) scale(0.95)",
                transition: "opacity 0.6s ease-out 0.9s, transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) 0.9s",
              }}
            >
              <Mail className="w-5 h-5" />
              <span>Wyślij wiadomość</span>
            </a>
          </div>

          {/* Right - Contact info, slides in from right */}
          <div
            className="flex flex-col justify-center"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? "translateX(0)" : "translateX(60px)",
              transition: "all 1s cubic-bezier(0.16, 1, 0.3, 1) 0.4s",
            }}
          >
            <div className="space-y-8">
              <a
                href="mailto:wskopek.all@gmail.com"
                className="flex items-center gap-4 text-white/60 hover:text-accent transition-colors group"
                style={{
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? "translateX(0)" : "translateX(30px)",
                  transition: "all 0.8s ease-out 0.6s",
                }}
              >
                <Mail className="w-5 h-5" />
                <span className="font-mono text-lg">wskopek.all@gmail.com</span>
              </a>
              <a
                href="tel:+48537168645"
                className="flex items-center gap-4 text-white/60 hover:text-accent transition-colors group"
                style={{
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? "translateX(0)" : "translateX(30px)",
                  transition: "all 0.8s ease-out 0.8s",
                }}
              >
                <Phone className="w-5 h-5" />
                <span className="font-mono text-lg">+48 537 168 645</span>
              </a>
            </div>

            <div
              className="flex gap-6 mt-12 pt-12 border-t border-white/10"
              style={{
                opacity: isVisible ? 1 : 0,
                transition: "all 0.8s ease-out 1s",
              }}
            >
              <a
                href="#"
                className="text-white/40 hover:text-accent transition-colors"
                style={{
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? "translateY(0) scale(1)" : "translateY(10px) scale(0.8)",
                  transition: "opacity 0.6s ease-out 1.1s, transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) 1.1s",
                }}
              >
                <Instagram className="w-6 h-6" />
              </a>
              <a
                href="#"
                className="text-white/40 hover:text-accent transition-colors"
                style={{
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? "translateY(0) scale(1)" : "translateY(10px) scale(0.8)",
                  transition: "opacity 0.6s ease-out 1.2s, transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) 1.2s",
                }}
              >
                <Linkedin className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>

        {/* Footer with line draw */}
        <div
          className="mt-32 pt-8 border-t border-white/5 flex flex-wrap items-center justify-between gap-4"
          style={{
            opacity: isVisible ? 1 : 0,
            transition: "all 1s ease-out 1.3s",
          }}
        >
          <span className="text-white/30 font-mono text-xs">© 2025 Wiktoria Skopek. Wszystkie prawa zastrzeżone.</span>
          <span className="text-white/20 font-mono text-[10px]">Designed with precision</span>
        </div>
      </div>
    </section>
  )
}
