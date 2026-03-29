"use client"

import { useEffect, useRef, useState } from "react"
import { X, Check, ArrowRight } from "lucide-react"

const painPoints = [
  {
    pains: [
      "Jesteś niewidoczny w internecie, a konkurencja zgarnia Twoich klientów.",
      "Żyjesz z poleceń i nie masz pojęcia, ilu klientów będziesz miał za miesiąc.",
    ],
    solution:
      "Budujemy Twoją silną markę osobistą przez wideo. Masz stały, przewidywalny napływ zapytań od osób, które widzą w Tobie eksperta.",
  },
  {
    pains: [
      "Tracisz godziny na callach, tłumacząc klientom od zera to samo.",
      "Na koniec słyszysz „muszę się zastanowić”, bo ludzie nie rozumieją Twojej oferty.",
    ],
    solution:
      "Landing Page z Wideo Sprzedażowym (VSL) edukuje klienta za Ciebie. Rozmawiasz tylko z osobami, które są gotowe podpisać umowę.",
  },
  {
    pains: [
      "Chcesz nagrywać, ale paraliżuje Cię kamera, nie masz czasu ani sprzętu.",
    ],
    solution:
      "Przejmujemy 90% pracy. Otrzymujesz od nas gotowe scenariusze, pracujemy w bezpiecznym studiu (lub zdalnie), my reżyserujemy, my ucinamy lanie wody i my montujemy.",
  },
  {
    pains: [
      "Twoja konkurencja oferuje „usługi za 400 zł”, więc musisz zaniżać ceny.",
    ],
    solution:
      "Przestajesz sprzedawać „usługi”. Sprzedajesz transformację. Oprawiamy Twoją wiedzę tak, że klient rozumie wartość i płaci stawkę premium.",
  },
]

export default function VslPainSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true)
      },
      { threshold: 0.1 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative py-12 md:py-16 overflow-hidden border-t border-white/5 bg-[#050505]"
      aria-labelledby="pain-section-title"
    >
      {/* Background Visual Transformation Cues: Massive X and Check */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden" aria-hidden="true">
         {/* Massive artistic Red X on the left - Scale for mobile */}
         <div className="absolute left-[-20%] md:left-[-10%] top-1/2 -translate-y-1/2 opacity-[0.02] text-red-600 blur-[2px]">
            <X size="80vw" md-size="60vw" className="scale-[1.2] md:scale-100" strokeWidth={0.5} />
         </div>
         {/* Massive artistic Green Check on the right - Scale for mobile */}
         <div className="absolute right-[-20%] md:right-[-10%] top-1/2 -translate-y-1/2 opacity-[0.02] text-emerald-500 blur-[2px]">
            <Check size="80vw" md-size="60vw" className="scale-[1.2] md:scale-100" strokeWidth={0.5} />
         </div>
      </div>

      {/* Decorative Orbs */}
      <div className="absolute top-1/4 left-0 w-64 md:w-[500px] h-64 md:h-[500px] bg-red-600/5 blur-[100px] rounded-full -translate-x-1/2" aria-hidden="true" />
      <div className="absolute bottom-1/4 right-0 w-64 md:w-[600px] h-64 md:h-[600px] bg-emerald-600/5 blur-[100px] rounded-full translate-x-1/2" aria-hidden="true" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8">
        
        {/* Header Section */}
        <div className="mb-12 md:mb-20 text-center">
          <span className="inline-block font-display text-xs md:text-sm text-accent tracking-[.49em] uppercase mb-4 opacity-70">
            Bóle i Transformacja
          </span>
          <h2 id="pain-section-title" className="font-display text-[clamp(2.2rem,7vw,3.8rem)] leading-[0.9] text-white tracking-tight mb-6">
            KONIEC Z <br /> 
            <span
              style={{
                background: "linear-gradient(135deg, #ff3b3b, #ff6600)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              FRUSTRACJĄ
            </span>
          </h2>
          <p className="font-sans font-medium text-white/70 text-base md:text-xl tracking-wide max-w-xl mx-auto">
            Znasz ten scenariusz? Zamień chaos i niskie stawki na przewidywalny system premium.
          </p>
        </div>

        {/* The Transformation Split Layout */}
        <div className="relative">
          
          {/* Central Connecting Axis (Desktop only) */}
          <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 shadow-[0_0_20px_rgba(255,255,255,0.05)]" aria-hidden="true">
            <div className="h-full w-full bg-gradient-to-b from-red-500/30 via-white/10 to-emerald-500/30" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)]" />
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
          </div>

          <div className="space-y-10 md:space-y-20">
            {painPoints.map((item, i) => (
              <div 
                key={i} 
                className={`grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-16 items-center transition-all duration-1000`}
                style={{
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? "translateY(0)" : "translateY(40px)",
                  transitionDelay: `${i * 100}ms`
                }}
              >
                
                {/* LEFT: PAIN */}
                <div className="lg:text-right relative">
                  <div className="p-5 md:p-8 lg:pr-6 border border-white/[0.04] lg:border-none rounded-2xl bg-white/[0.02] lg:bg-transparent shadow-xl">
                    <div className="inline-flex items-center gap-2 mb-4 lg:flex-row-reverse">
                       <span className="font-display text-[9px] tracking-widest text-red-400 uppercase opacity-80">Obecna Sytuacja</span>
                    </div>
                    
                    <div className="space-y-4 md:space-y-6">
                      {item.pains.map((pain, j) => (
                        <div key={j} className="flex gap-3 items-start translate-x-0 transition-transform duration-300">
                          <X className="w-5 h-5 text-red-500/40 flex-shrink-0 mt-0.5" strokeWidth={3} aria-hidden="true" />
                          <p className="text-white/70 text-sm md:text-lg font-medium leading-relaxed font-sans">
                            {pain}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* RIGHT: SOLUTION */}
                <div className="relative">
                  <div className="lg:pl-4">
                    <div className="p-5 md:p-8 lg:pl-10 border border-emerald-500/10 lg:border-none rounded-2xl bg-emerald-500/[0.04] lg:bg-transparent shadow-emerald-900/10 shadow-2xl">
                       <span className="font-display text-[9px] tracking-widest text-emerald-400 uppercase opacity-80 mb-4 block">Twoja Przyszłość</span>
                       
                       <div className="flex flex-col gap-6 md:gap-12">
                         <div className="flex gap-3 md:gap-4 items-start">
                           <div className="mt-1 flex-shrink-0 w-6 h-6 md:w-8 md:h-8 rounded-lg border border-emerald-500/20 flex items-center justify-center bg-emerald-500/10">
                             <Check className="w-4 h-4 md:w-5 md:h-5 text-emerald-500" strokeWidth={3} aria-hidden="true" />
                           </div>
                           <p className="text-white/95 text-sm md:text-xl font-bold leading-relaxed font-sans">
                             {item.solution}
                           </p>
                         </div>
                       </div>
                    </div>
                  </div>
                </div>

              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  )
}
