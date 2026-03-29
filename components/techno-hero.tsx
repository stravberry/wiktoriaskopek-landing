"use client"

import { useEffect, useRef, useState } from "react"
import { ChevronDown } from "lucide-react"
import type { Locale } from "@/lib/translations"

export default function TechnoHero({ lang = "pl" }: { lang?: Locale }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 200)
    return () => clearTimeout(timer)
  }, [])

  return (
    <section id="techno-hero" className="relative w-full h-screen min-h-[600px] overflow-hidden">
      {/* Background Video */}
      <div className="absolute inset-0">
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          className="absolute inset-0 w-full h-full object-cover scale-105"
        >
          <source
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/na%20strone-EzfvK9PXN6KMDanKu1yWyihRhSyBiS.mp4"
            type="video/mp4"
          />
        </video>

        {/* Dark overlays */}
        <div className="absolute inset-0 bg-black/65" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/90" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-transparent" />
      </div>

      {/* Scanlines */}
      <div
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)",
        }}
      />

      {/* Noise grain texture */}
      <div
        className="absolute inset-0 pointer-events-none z-10 opacity-[0.04]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Content */}
      <div
        className="relative z-20 flex flex-col justify-center h-full px-6 md:px-12 lg:px-20 max-w-6xl"
        style={{
          opacity: isLoaded ? 1 : 0,
          transform: isLoaded ? "translateY(0)" : "translateY(30px)",
          transition: "opacity 1s ease-out, transform 1s ease-out",
        }}
      >
        {/* Label */}
        <div className="mb-6 md:mb-8">
          <span className="inline-flex items-center gap-2 text-accent font-mono text-[10px] md:text-xs tracking-[0.3em] uppercase">
            <span className="w-8 h-px bg-accent" />
            DJ &amp; Club Scene
          </span>
        </div>

        {/* H1 */}
        <h1 className="font-display text-[clamp(2.8rem,8vw,7rem)] leading-[0.9] text-white tracking-tight mb-6 md:mb-8 max-w-4xl">
          STRONY, WIDEO
          <br />
          <span className="text-white/90">I MARKETING DLA</span>
          <br />
          <span className="text-accent">SCENY KLUBOWEJ.</span>
        </h1>

        {/* Subtitle */}
        <p className="text-white/60 font-mono text-sm md:text-base lg:text-lg leading-relaxed max-w-2xl mb-8 md:mb-12">
          Robisz dobrą muzykę, ja dbam o to, żeby ludzie ją zobaczyli.
          Projektuję strony, montuję rolki i ustawiam procesy tak, żeby promotorzy
          traktowali Cię poważnie.{" "}
          <span className="text-white/40">
            Ty skupiasz się na graniu, ja na Twoim wizerunku w sieci.
          </span>
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <a
            href="#realizacje"
            className="group relative inline-flex items-center justify-center px-8 py-4 bg-accent text-black font-mono text-xs md:text-sm tracking-wider uppercase overflow-hidden transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,102,0,0.4)] hover:scale-[1.02]"
          >
            <span className="relative z-10">Zobacz moje realizacje</span>
            <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 skew-x-12" />
          </a>
          <a
            href="#kontakt"
            className="inline-flex items-center justify-center px-8 py-4 border border-accent/50 text-accent font-mono text-xs md:text-sm tracking-wider uppercase transition-all duration-300 hover:border-accent hover:bg-accent/10 hover:shadow-[0_0_20px_rgba(255,102,0,0.15)]"
          >
            Porozmawiajmy o Twoim projekcie
          </a>
        </div>
      </div>

      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent z-20" />

      {/* Scroll indicator */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-20"
        style={{
          opacity: isLoaded ? 1 : 0,
          transition: "opacity 1.5s ease-out 0.8s",
        }}
      >
        <span className="text-white/40 font-mono text-[9px] tracking-[0.3em] uppercase">
          Scroll
        </span>
        <div className="relative">
          <ChevronDown className="w-5 h-5 text-white/40 animate-bounce" />
          <ChevronDown
            className="w-5 h-5 text-white/20 animate-bounce absolute top-1.5 left-0"
            style={{ animationDelay: "0.15s" }}
          />
        </div>
      </div>
    </section>
  )
}
