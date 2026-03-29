"use client"

import { useEffect, useRef, useState } from "react"
import { ArrowRight, Search, Zap } from "lucide-react"

export default function VslOffMarketSummary() {
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
      className="relative py-8 md:py-10 bg-[#050505] overflow-hidden"
      aria-labelledby="offmarket-title"
    >
      <div className="max-w-4xl mx-auto px-4 md:px-8">
        <div 
          className="relative transition-all duration-1000"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateY(0)" : "translateY(20px)",
          }}
        >
          {/* Section Heading */}
          <div className="text-center mb-8 md:mb-12">
            <span className="font-display text-accent text-[8px] md:text-[9px] tracking-[.49em] uppercase mb-4 inline-block opacity-70">Filozofia Off-Market</span>
            <h2 id="offmarket-title" className="font-display text-xl md:text-3xl lg:text-4xl text-white tracking-widest uppercase leading-tight">
              ZAMIEŃ WALKĘ CENOWĄ NA <br className="hidden md:block" />
              <span className="text-accent underline decoration-accent/10 underline-offset-8">AUTORYTET WIDEO</span>
            </h2>
          </div>

          {/* Strategic Market Overview Cards */}
          <div className="grid md:grid-cols-2 gap-4 md:gap-8 items-stretch mb-8">
             
             {/* Card Left: 🔴 3% */}
             <div className="relative p-5 md:p-10 rounded-[1.5rem] md:rounded-3xl border border-white/[0.04] bg-white/[0.01] overflow-hidden transition-all duration-700">
                <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6">
                   <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-red-500/5 border border-red-500/10 flex items-center justify-center">
                      <Search className="w-4 h-4 md:w-5 md:h-5 text-red-500/30" aria-hidden="true" />
                   </div>
                   <div>
                      <div className="font-sans text-red-500 text-[9px] md:text-[12px] font-black tracking-widest uppercase mb-0.5 flex items-center gap-2">
                        🔴 3% RYNKU
                      </div>
                      <div className="font-display text-white text-base md:text-xl tracking-widest uppercase">Walka tylko o cenę</div>
                   </div>
                </div>
                <p className="text-white/60 text-xs md:text-base leading-relaxed font-sans font-medium">
                   To klienci z portali i Google, którzy wysyłają 10 zapytań naraz. Tam bije się Twoja konkurencja, a wygrywa najtańszy.
                </p>
             </div>

             {/* Card Right: 🟢 97% */}
             <div className="relative p-5 md:p-10 rounded-[1.5rem] md:rounded-3xl border border-accent/30 bg-accent/[0.04] overflow-hidden shadow-[0_0_60px_rgba(255,102,0,0.05)]">
                <div className="absolute top-0 right-0 w-32 md:w-48 h-32 md:h-48 bg-accent/10 blur-[80px] pointer-events-none" aria-hidden="true" />
                <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6">
                   <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-accent/20 border border-accent/40 flex items-center justify-center">
                      <Zap className="w-4 h-4 md:w-5 md:h-5 text-accent" aria-hidden="true" />
                   </div>
                   <div>
                      <div className="font-sans text-accent text-[9px] md:text-[12px] font-black tracking-widest uppercase mb-0.5 flex items-center gap-2">
                        🟢 97% RYNKU
                      </div>
                      <div className="font-display text-white text-base md:text-xl tracking-widest uppercase font-bold">Twój klient PREMIUM</div>
                   </div>
                </div>
                <p className="text-white text-xs md:text-base leading-relaxed font-sans font-medium">
                   To ludzie na Facebooku, Instagramie i YouTube. Mają problem, ale jeszcze nie szukają wykonawcy.
                </p>
             </div>
          </div>

          {/* TWO DUAL STRATEGY CARDS (Unified Aesthetic) */}
          <div className="grid md:grid-cols-2 gap-4 md:gap-8 items-stretch mb-10">
             
             {/* Strategy Card */}
             <div className="relative p-7 rounded-[1.5rem] md:rounded-[2rem] border border-white/[0.08] bg-white/[0.02] overflow-hidden flex flex-col justify-center">
                <div className="mb-6">
                   <span className="font-display text-accent text-[10px] tracking-[.49em] uppercase opacity-70">NASZA STRATEGIA</span>
                </div>
                <p className="font-sans text-white/95 text-sm md:text-xl leading-relaxed tracking-tight italic border-l-2 border-accent/30 pl-6">
                   Docieramy do nich przez <span className="text-white font-black underline decoration-white/20 underline-offset-4">profesjonalne wideo</span>. <br />
                   Uświadamiamy im problem i pokazujemy Ciebie jako eksperta, zanim pomyślą o konkurencji.
                </p>
             </div>

             {/* Result Card (Unified Aesthetic) */}
             <div className="relative p-7 rounded-[1.5rem] md:rounded-[2rem] border border-white/[0.08] bg-white/[0.04] overflow-hidden flex flex-col justify-center">
                <div className="mb-6">
                   <span className="font-display text-accent text-[10px] tracking-[.49em] uppercase opacity-70">EFEKT DOMINACJI</span>
                </div>
                <div className="font-sans text-white text-sm md:text-xl leading-relaxed tracking-tight italic border-l-2 border-accent/30 pl-6 space-y-6">
                   <p>
                      Kiedy dojrzeją do decyzji – <span className="text-white font-black underline decoration-white/10 underline-offset-4">nie porównują</span> cen. <br />
                      Dzwonią od razu do <span className="text-accent font-black">CIEBIE!</span>
                   </p>
                   <p className="border-t border-white/10 pt-4">
                      Nie walcz ceną. <br />
                      Zbuduj markę, która <span className="text-accent font-bold underline decoration-accent/30 underline-offset-4">sprzedaje się sama</span>.
                   </p>
                </div>
             </div>
          </div>

          {/* Final Strategic CTA */}
          <div className="flex flex-col items-center">
             <a
               href="#contact"
               className="group relative inline-flex items-center gap-4 md:gap-6 px-10 md:px-20 py-4 md:py-5 rounded-full font-sans text-[10px] md:text-sm tracking-[.4em] uppercase text-black font-black overflow-hidden transition-all duration-500 hover:scale-[1.05] hover:shadow-[0_0_80px_rgba(255,102,0,0.6)]"
               style={{
                 background: "linear-gradient(135deg, #ff6600, #ff8533)",
               }}
               aria-label="Umów darmową rozmowę strategiczną"
             >
               <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/50 to-transparent" aria-hidden="true" />
               <span className="relative z-10 flex items-center gap-2 md:gap-3">
                  UMÓW DARMOWĄ ROZMOWĘ
                  <ArrowRight className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-2 transition-transform" aria-hidden="true" />
               </span>
             </a>
          </div>

        </div>
      </div>
    </section>
  )
}
