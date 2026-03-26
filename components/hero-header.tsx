"use client"

import { useRef, useEffect, useState } from "react"
import { ChevronDown } from "lucide-react"
import LanguageSwitcher from "./language-switcher"
import BurgerMenu from "./burger-menu"
import { type Locale, getTranslation } from "@/lib/translations"

export default function HeroHeader({ lang = "pl" }: { lang?: Locale }) {
  const t = getTranslation(lang)
  const [scrollY, setScrollY] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const [vh, setVh] = useState(800)
  const containerRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024)
    setVh(window.innerHeight)
    checkMobile()

    const handleResize = () => {
      checkMobile()
      setVh(window.innerHeight)
    }

    window.addEventListener("resize", handleResize, { passive: true })
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      if (rafRef.current) return
      rafRef.current = requestAnimationFrame(() => {
        setScrollY(window.scrollY)
        rafRef.current = null
      })
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => {
      window.removeEventListener("scroll", handleScroll)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  const revealProgress = Math.min(scrollY / (vh * 0.6), 1)
  const videoOpacity = 0.5 + revealProgress * 0.5
  const nameRevealProgress = Math.min(scrollY / (vh * 0.2), 1)
  const nameOpacity = 0.3 + nameRevealProgress * 0.7
  const scalePhase = Math.min(scrollY / (vh * 1.5), 1)
  const contentProgress = Math.max(0, (scrollY - vh * 0.4) / (vh * 0.4))
  const contentOpacity = Math.min(contentProgress, 1)
  const arrowOpacity = Math.max(0, 1 - scrollY / 100)

  const nameScale = isMobile ? 1 : 0.7 + scalePhase * 0.6
  const nameY = isMobile ? 0 : -scalePhase * 15
  const videoBlur = isMobile ? 0 : Math.max(0, 20 - revealProgress * 20)

  const navItems = [
    { key: "home", label: t.nav.home, href: `/${lang}` },
    { key: "portfolio", label: t.nav.portfolio, href: `/${lang}/portfolio` },
    { key: "info", label: t.nav.info, href: `/${lang}/info` },
    { key: "blog", label: t.nav.blog, href: `/${lang}/blog` },
    { key: "contact", label: t.nav.contact, href: `/${lang}/contact` },
  ]

  return (
    <div ref={containerRef} className="relative">
      {/* Navigation */}
      <nav
        className="fixed top-0 right-0 z-50 px-4 md:px-12 py-4 md:py-6 flex items-center gap-4 md:gap-8 mix-blend-difference"
        style={{ opacity: isMobile ? 1 : contentOpacity }}
      >
        {isMobile ? (
          <BurgerMenu lang={lang} variant="main" />
        ) : (
          <>
            <LanguageSwitcher currentLocale={lang} />
            <div className="w-px h-4 bg-white/30 hidden md:block" />
            {navItems.map((item) => (
              <a
                key={item.key}
                href={item.href}
                className="text-white hover:text-accent font-mono text-xs tracking-widest transition-colors mix-blend-difference"
              >
                {item.label}
              </a>
            ))}
          </>
        )}
      </nav>

      <div className={`${isMobile ? "relative" : "fixed"} inset-0 w-full h-screen overflow-hidden`}>
        <div
          className="absolute inset-0"
          style={{
            opacity: isMobile ? 1 : videoOpacity,
            filter: isMobile ? "none" : `blur(${videoBlur}px)`,
          }}
        >
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            className="absolute inset-0 w-full h-full object-cover"
            style={{
              transform: isMobile ? "none" : `scale(${1.1 + scrollY * 0.0002})`,
            }}
          >
            <source src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/na%20strone-EzfvK9PXN6KMDanKu1yWyihRhSyBiS.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-black/40" />
          <div
            className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-black/60"
            style={{ opacity: isMobile ? 1 : revealProgress }}
          />
        </div>

        {/* Scanlines - hidden on mobile */}
        {!isMobile && revealProgress > 0.1 && (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage:
                "repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(255,255,255,0.1) 1px, rgba(255,255,255,0.1) 2px)",
              opacity: revealProgress * 0.03,
            }}
          />
        )}

        {/* Name */}
        <div
          className="absolute inset-0 flex flex-col justify-start pt-20 md:pt-0 md:justify-center pointer-events-none px-4 md:px-8"
          style={{
            transform: isMobile ? "none" : `translateY(${nameY}vh) scale(${nameScale})`,
            transformOrigin: "left center",
            opacity: isMobile ? 1 : nameOpacity,
          }}
        >
          <div className="max-w-7xl">
            <h1 className="font-display text-[clamp(2.5rem,13vw,11rem)] leading-[0.85] text-white tracking-tighter relative z-10 drop-shadow-2xl">
              WIKTORIA
            </h1>
            <h1 className="font-display text-[clamp(2.5rem,13vw,11rem)] leading-[0.85] text-white tracking-tighter relative z-10 drop-shadow-2xl">
              SKOPEK
            </h1>
          </div>
        </div>

        {/* Bottom content */}
        <div
          className="absolute bottom-8 lg:bottom-0 left-0 right-0 px-4 md:px-8 lg:px-12 pb-20 md:pb-20 pointer-events-auto"
          style={{
            opacity: isMobile ? 1 : contentOpacity,
            transform: isMobile ? "none" : `translateY(${(1 - contentOpacity) * 30}px)`,
          }}
        >
          <div className="max-w-full mb-4 md:mb-16">
            <p className="text-white text-[4vw] md:text-[4vw] lg:text-[3vw] leading-[1.15] font-light tracking-tight drop-shadow-lg">
              {t.hero.tagline1} <span className="font-serif italic text-white/70">{t.hero.tagline1Italic}</span>
            </p>
            <p className="text-white text-[4vw] md:text-[4vw] lg:text-[3vw] leading-[1.15] font-light tracking-tight drop-shadow-lg">
              {t.hero.tagline2} <span className="text-accent font-display">{t.hero.tagline2Signal}</span>{" "}
              <span className="font-serif italic text-white/50">{t.hero.tagline2Italic}</span>
            </p>
          </div>

          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 md:gap-8">
            <div className="max-w-lg">
              <p className="text-white/60 font-mono text-[10px] md:text-sm leading-relaxed">{t.hero.description}</p>
              <div className="flex flex-col md:flex-row gap-1 md:gap-6 mt-2 md:mt-4 text-white/40 font-mono text-[10px] md:text-xs">
                <a href="mailto:wskopek.all@gmail.com" className="hover:text-accent transition-colors">
                  wskopek.all@gmail.com
                </a>
                <span>+48 537 168 645</span>
              </div>
            </div>

            <div className="flex gap-2 md:gap-4 mt-2 md:mt-0">
              <a
                href="mailto:wskopek.all@gmail.com"
                className="px-3 md:px-8 py-2 md:py-4 bg-white text-black font-mono text-[10px] md:text-xs tracking-wider hover:bg-accent transition-colors uppercase"
              >
                {t.hero.cta}
              </a>
              <a
                href={`/${lang}/portfolio`}
                className="px-3 md:px-8 py-2 md:py-4 border border-white/20 text-white font-mono text-[10px] md:text-xs tracking-wider hover:border-accent hover:text-accent transition-colors uppercase"
              >
                {t.hero.portfolio}
              </a>
            </div>
          </div>
        </div>

        {/* Scroll indicator - hidden on mobile */}
        <div
          className="hidden md:flex absolute bottom-12 left-1/2 -translate-x-1/2 flex-col items-center gap-3 transition-opacity duration-500"
          style={{ opacity: arrowOpacity }}
        >
          <span className="text-white/50 font-mono text-[10px] tracking-[0.3em] uppercase">{t.hero.scroll}</span>
          <div className="relative">
            <ChevronDown className="w-6 h-6 text-white/50 animate-bounce" />
            <ChevronDown
              className="w-6 h-6 text-white/30 animate-bounce absolute top-2 left-0"
              style={{ animationDelay: "0.1s" }}
            />
          </div>
        </div>
      </div>

      {!isMobile && <div className="h-[250vh]" />}
    </div>
  )
}
