"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { ArrowRight } from "lucide-react"

export default function VslHero() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  return (
    <section
      id="vsl-hero"
      className="relative overflow-hidden pt-10 md:pt-24 pb-16 md:pb-32 min-h-[70vh] flex items-center"
      style={{ background: "#050505" }}
      aria-labelledby="hero-title"
    >
      {/* Background Image Texture: Extremely subtle */}
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" aria-hidden="true">
        <Image 
          src="/images/hero-ambient-success.png"
          alt=""
          fill
          className="object-cover grayscale"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-[#050505]/95 to-[#050505]" />
      </div>

      {/* Ambient glow */}
      <div
        className="absolute top-[30%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full pointer-events-none opacity-20 z-1"
        style={{
          background: "radial-gradient(circle, rgba(255,102,0,0.1) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-full lg:max-w-6xl mx-auto px-4 md:px-8 w-full flex flex-col items-center">

        {/* ─── HEADLINE (SAFARI OPTIMIZED) ─── */}
        <div
          className="w-full text-center transition-all duration-1000 ease-out flex flex-col items-center"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateY(0)" : "translateY(20px)",
          }}
        >
          <div className="mb-6 md:mb-8 text-center">
             <span className="font-sans text-accent text-xs sm:text-sm md:text-base font-bold tracking-widest uppercase">
                Dla ekspertów i&nbsp;solo przedsiębiorców robiących 8–30&nbsp;tys. zł/mies.
             </span>
          </div>

          <h1 
            id="hero-title" 
            className="font-display w-full max-w-full text-5xl sm:text-7xl md:text-8xl lg:text-[clamp(6rem,11vw,9rem)] leading-[0.85] text-white tracking-tighter"
            style={{ 
              textRendering: 'optimizeLegibility',
              lineHeight: '0.85',
              display: 'block'
            }}
          >
            ZBUDUJ ROZPOZNAWALNĄ
            <br />
            <span
              className="relative inline-block py-2"
              style={{
                background: "linear-gradient(135deg, #ff6600, #ff8533, #ffad66)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                WebkitTextFillColor: "transparent",
                color: "transparent",
                display: 'inline-block'
              }}
            >
              MARKĘ
            </span>
            {" "}I ZARABIAJ
            <br />
            <span className="text-white/40">50K–100K</span>{" "}
            <span className="font-serif italic text-4xl sm:text-6xl md:text-7xl lg:text-[clamp(4.5rem,8vw,7rem)] text-white/70">
              zł/mies.
            </span>
          </h1>
        </div>

        {/* ─── MAIN SUB-COPY ─── */}
        <div
          className="max-w-3xl mx-auto mt-10 md:mt-14 text-center transition-all duration-1000 ease-out delay-200"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateY(0)" : "translateY(20px)",
          }}
        >
          <p className="text-white/80 text-lg md:text-2xl lg:text-[clamp(1.1rem,2.5vw,1.4rem)] leading-[1.6] font-sans font-medium tracking-tight">
            Pomogę Ci pozyskać klientów, stworzyć jasną ofertę
            i&nbsp;
            <span className="text-white font-bold underline decoration-accent/40 underline-offset-8">tworzyć konwertujący content</span>
            {" — bez tracenia czasu na techniczne detale, nawet jeśli jesteś introwertykiem i&nbsp;nigdy nie nagrywałeś."}
          </p>
        </div>

        {/* ─── CTA BUTTON ─── */}
        <div 
          className="mt-14 md:mt-20 flex justify-center transition-all duration-1000 ease-out delay-[400ms]"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateY(0)" : "translateY(20px)",
          }}
        >
          <a
            href="#contact"
            className="group relative inline-flex items-center gap-4 px-10 md:px-14 py-4 md:py-6 rounded-full font-sans text-xs md:text-sm tracking-widest uppercase text-black font-black overflow-hidden transition-all duration-500 hover:scale-[1.05] hover:shadow-[0_0_80px_rgba(255,102,0,0.5)]"
            style={{
              background: "linear-gradient(135deg, #ff6600, #ff8533)",
            }}
            aria-label="Umów darmową rozmowę strategiczną"
          >
            <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/40 to-transparent" aria-hidden="true" />
            <span className="relative z-10 flex items-center gap-3">
              Umów Darmową Rozmowę
              <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" aria-hidden="true" />
            </span>
          </a>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#050505] to-transparent pointer-events-none" aria-hidden="true" />
    </section>
  )
}
