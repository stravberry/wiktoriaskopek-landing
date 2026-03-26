"use client"

import { useRef, useEffect, useState } from "react"
import { Check, ArrowRight, Star } from "lucide-react"

export default function OneDayPackSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [hoveredPack, setHoveredPack] = useState<string | null>(null)
  const [isMobile, setIsMobile] = useState(false)
  const lastScrollTime = useRef(0)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener("resize", checkMobile, { passive: true })
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      const now = Date.now()
      const throttleMs = isMobile ? 50 : 16
      if (now - lastScrollTime.current < throttleMs) return
      lastScrollTime.current = now

      if (!sectionRef.current) return
      const rect = sectionRef.current.getBoundingClientRect()

      if (!isMobile) {
        const progress = Math.max(0, Math.min(1, -rect.top / (rect.height - window.innerHeight)))
        setScrollProgress(progress)
      }
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setIsVisible(true)
        })
      },
      { threshold: 0.05 },
    )

    window.addEventListener("scroll", handleScroll, { passive: true })
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => {
      window.removeEventListener("scroll", handleScroll)
      observer.disconnect()
    }
  }, [isMobile])

  const startFeatures = [
    "1 dzień nagraniowy",
    "8 materiałów typu rolka",
    "Mini sesja zdjęciowa",
    "Montaż + gotowe pliki",
    "Gotowe w 7 dni roboczych",
  ]

  const proFeatures = [
    "Wszystko z START Pack",
    "15 materiałów typu rolka",
    "Mini sesja zdjęciowa (10-15 zdjęć)",
    "2 dodatkowe filmy na YouTube",
    "Priorytetowa realizacja – 72h",
    "Doradztwo marketingowe na miejscu",
    "Pomoc w brand board",
  ]

  return (
    <section ref={sectionRef} className="relative bg-black min-h-screen md:min-h-[200vh] overflow-hidden" id="oferta">
      {/* Video background - hidden on mobile for performance */}
      <div className="hidden md:block absolute inset-0 z-0">
        <video autoPlay muted loop playsInline className="w-full h-full object-cover opacity-10">
          <source src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/montazyk%20bts_1_2_1-BTWRm9DbyG02CDrnCF3Aj9h3saZPfq.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/95 to-black" />
      </div>

      <div className="relative z-10">
        {/* Hero title */}
        <div className="min-h-screen flex flex-col justify-center items-start px-6 md:px-12 lg:px-20 py-20 md:py-0">
          {/* Small label */}
          <span
            className="text-accent font-mono text-xs tracking-[0.5em] uppercase mb-8"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? "translateY(0)" : "translateY(20px)",
              transition: "all 0.6s ease-out",
            }}
          >
            Oferta
          </span>

          {/* Giant typography - smaller on mobile, with max size */}
          <h2
            className="font-display text-white leading-[0.8] tracking-tighter max-w-7xl"
            style={{
              fontSize: "clamp(3rem, 20vw, 14rem)",
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? "translateY(0)" : "translateY(40px)",
              transition: "all 0.8s ease-out 0.1s",
              marginLeft: "-0.5vw",
              paddingRight: "1rem",
            }}
          >
            ONE DAY
          </h2>
          <h2
            className="font-display text-accent leading-[0.8] tracking-tighter max-w-7xl"
            style={{
              fontSize: "clamp(3rem, 20vw, 14rem)",
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? "translateX(0)" : "translateX(-40px)",
              transition: "all 0.8s ease-out 0.2s",
              marginLeft: "-0.5vw",
              paddingRight: "1rem",
            }}
          >
            PACK
          </h2>

          {/* Subtext */}
          <p
            className="text-white/40 font-mono text-sm md:text-base mt-8 md:mt-12 max-w-md"
            style={{
              opacity: isVisible ? 1 : 0,
              transition: "all 0.8s ease-out 0.4s",
            }}
          >
            Kompleksowa produkcja contentu w jeden dzień.
            <span className="text-accent"> Profesjonalne materiały. Błyskawiczna realizacja.</span>
          </p>

          {/* Decorative large text - hidden on mobile */}
          <div className="hidden md:block absolute bottom-12 right-6 md:right-12">
            <span className="font-display text-[30vw] md:text-[20vw] text-white/[0.02] leading-none">W1D</span>
          </div>
        </div>

        {/* Pricing cards */}
        <div className="px-6 md:px-12 lg:px-20 py-16 md:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 max-w-7xl mx-auto">
            {/* START Pack */}
            <div
              className={`relative group cursor-pointer transition-opacity duration-500 ${hoveredPack === "pro" ? "opacity-40" : "opacity-100"}`}
              onMouseEnter={() => !isMobile && setHoveredPack("start")}
              onMouseLeave={() => !isMobile && setHoveredPack(null)}
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? "translateY(0)" : "translateY(40px)",
                transition: "all 0.6s ease-out 0.3s",
              }}
            >
              <div className="relative border border-white/10 bg-black/80 p-6 md:p-8 lg:p-12 h-full overflow-hidden">
                {/* Corner decorations */}
                <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-white/20" />
                <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-white/20" />

                {/* Background number - hidden on mobile */}
                <span className="hidden md:block absolute -top-10 -right-10 font-display text-[25vw] text-white/[0.02] pointer-events-none">
                  01
                </span>

                {/* Label */}
                <div className="relative z-10 flex items-center gap-3 mb-6">
                  <span className="text-white/40 font-mono text-xs tracking-widest uppercase">Starter</span>
                  <div className="flex-1 h-px bg-white/10" />
                </div>

                {/* Title */}
                <h3 className="relative z-10 font-display text-5xl md:text-6xl lg:text-8xl text-white mb-2">START</h3>
                <p className="relative z-10 text-accent font-display text-xl md:text-2xl lg:text-3xl mb-6 md:mb-8">
                  Pack
                </p>

                {/* Tagline */}
                <p className="relative z-10 text-white/60 font-serif italic text-base md:text-lg lg:text-xl mb-8 md:mb-10">
                  "Idealny na początek przygody z contentem"
                </p>

                {/* Features */}
                <ul className="relative z-10 space-y-3 md:space-y-4 mb-8 md:mb-12">
                  {startFeatures.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3 text-white/60">
                      <Check className="w-4 h-4 text-accent mt-1 flex-shrink-0" />
                      <span className="font-mono text-xs md:text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Price */}
                <div className="relative z-10 mt-auto">
                  <div className="flex items-baseline gap-2 mb-4 md:mb-6">
                    <span className="font-display text-5xl md:text-6xl lg:text-7xl text-white">2,790</span>
                    <span className="text-white/40 font-mono text-sm">zł netto</span>
                  </div>

                  {/* CTA */}
                  <button className="w-full flex items-center justify-between px-4 md:px-6 py-3 md:py-4 border border-white/20 hover:border-accent hover:bg-accent/10 transition-all duration-300">
                    <span className="font-mono text-xs md:text-sm text-white/60">Zamów START Pack</span>
                    <ArrowRight className="w-5 h-5 text-white/40" />
                  </button>
                </div>
              </div>
            </div>

            {/* PRO Pack */}
            <div
              className={`relative group cursor-pointer transition-opacity duration-500 ${hoveredPack === "start" ? "opacity-40" : "opacity-100"}`}
              onMouseEnter={() => !isMobile && setHoveredPack("pro")}
              onMouseLeave={() => !isMobile && setHoveredPack(null)}
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? "translateY(0)" : "translateY(40px)",
                transition: "all 0.6s ease-out 0.4s",
              }}
            >
              <div className="relative border border-accent/30 bg-black/80 p-6 md:p-8 lg:p-12 h-full overflow-hidden">
                {/* Corner decorations - accent color */}
                <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-accent/50" />
                <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-accent/50" />

                {/* Best value badge */}
                <div className="absolute top-4 md:top-6 right-4 md:right-6 flex items-center gap-2 px-2 md:px-3 py-1 bg-accent/20 border border-accent/30">
                  <Star className="w-3 h-3 text-accent" />
                  <span className="font-mono text-[10px] md:text-xs text-accent uppercase tracking-wider">
                    Najlepsza wartość
                  </span>
                </div>

                {/* Background number - hidden on mobile */}
                <span className="hidden md:block absolute -top-10 -right-10 font-display text-[25vw] text-accent/[0.03] pointer-events-none">
                  02
                </span>

                {/* Label */}
                <div className="relative z-10 flex items-center gap-3 mb-6 mt-8 md:mt-0">
                  <span className="text-accent/60 font-mono text-xs tracking-widest uppercase">Kompleksowa</span>
                  <div className="flex-1 h-px bg-accent/20" />
                </div>

                {/* Title */}
                <h3 className="relative z-10 font-display text-5xl md:text-6xl lg:text-8xl text-accent mb-2">PRO</h3>
                <p className="relative z-10 text-white font-display text-xl md:text-2xl lg:text-3xl mb-6 md:mb-8">
                  Pack
                </p>

                {/* Tagline */}
                <p className="relative z-10 text-white/60 font-serif italic text-base md:text-lg lg:text-xl mb-8 md:mb-10">
                  "Kompleksowa oferta dla wymagających klientów"
                </p>

                {/* Features */}
                <ul className="relative z-10 space-y-3 md:space-y-4 mb-8 md:mb-12">
                  {proFeatures.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3 text-white/60">
                      <Check className="w-4 h-4 text-accent mt-1 flex-shrink-0" />
                      <span className="font-mono text-xs md:text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Price */}
                <div className="relative z-10 mt-auto">
                  <div className="flex items-center gap-3 md:gap-4 mb-2">
                    <span className="text-white/30 font-mono text-base md:text-lg line-through">8,990 zł</span>
                    <span className="text-accent font-mono text-[10px] md:text-xs px-2 py-1 border border-accent/30">
                      Oszczędzasz 2,200 zł
                    </span>
                  </div>
                  <div className="flex items-baseline gap-2 mb-4 md:mb-6">
                    <span className="font-display text-5xl md:text-6xl lg:text-7xl text-accent">6,790</span>
                    <span className="text-white/40 font-mono text-sm">zł netto</span>
                  </div>

                  {/* CTA */}
                  <button className="w-full flex items-center justify-between px-4 md:px-6 py-3 md:py-4 bg-accent/20 border border-accent/50 hover:bg-accent/30 transition-all duration-300">
                    <span className="font-mono text-xs md:text-sm text-white">Zamów PRO Pack</span>
                    <ArrowRight className="w-5 h-5 text-accent" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom decorative typography - hidden on mobile */}
        <div className="relative hidden md:flex h-[30vh] items-center overflow-hidden">
          <div
            className="whitespace-nowrap"
            style={{
              transform: `translateX(${-scrollProgress * 300}px)`,
            }}
          >
            <span className="font-display text-[20vw] text-white/[0.02]">
              CONTENT • WIDEO • AI • AUTOMATYZACJA • CONTENT • WIDEO • AI • AUTOMATYZACJA •
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
