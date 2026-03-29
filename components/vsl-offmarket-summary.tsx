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
      className="relative py-4 md:py-6 bg-[#050505] overflow-hidden"
      aria-labelledby="offmarket-title"
    >
      {/* Background Visual Cues: Massive Icons */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden" aria-hidden="true">
         <div className="absolute left-[-20%] md:left-[-10%] top-1/4 -translate-y-1/2 opacity-[0.02] text-white blur-[2px]">
            <Search size="80vw" md-size="60vw" className="scale-[1.2] md:scale-100" strokeWidth={0.5} />
         </div>
         <div className="absolute right-[-20%] md:right-[-10%] top-3/4 -translate-y-1/2 opacity-[0.02] text-accent blur-[2px]">
            <Zap size="80vw" md-size="60vw" className="scale-[1.2] md:scale-100" strokeWidth={0.5} />
         </div>
      </div>
      <div className="relative z-10 max-w-4xl mx-auto px-4 md:px-8">
        <div 
          className="relative transition-all duration-1000"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateY(0)" : "translateY(20px)",
          }}
        >
          {/* Section Heading */}
          <div className="text-center mb-8 md:mb-12">
            <h2 id="offmarket-title" className="font-display text-xl md:text-3xl lg:text-4xl text-white tracking-widest uppercase leading-tight">
              ZAMIEŃ WALKĘ CENOWĄ NA <br className="hidden md:block" />
              <span className="text-accent underline decoration-accent/10 underline-offset-8">AUTORYTET WIDEO</span>
            </h2>
          </div>

          {/* Strategic Market Overview Cards */}
          <div className="grid md:grid-cols-2 gap-4 md:gap-8 items-stretch mb-8">
             
             {/* Card Left: 3% */}
             <div className="relative p-8 md:p-10 rounded-3xl border border-white/[0.04] bg-white/[0.02] flex flex-col">
                <div className="font-sans text-red-500/90 text-sm font-black tracking-widest uppercase mb-3 flex items-center gap-2">
                  3% RYNKU
                </div>
                <h3 className="font-display text-white text-xl tracking-widest uppercase mb-4 opacity-90">Walka tylko o&nbsp;cenę</h3>
                <p className="text-white/60 text-base md:text-lg leading-relaxed font-sans">
                   To klienci z&nbsp;portali i&nbsp;Google, którzy wysyłają 10 zapytań naraz. Tam bije się Twoja konkurencja, a&nbsp;wygrywa najtańszy.
                </p>
             </div>

             {/* Card Right: 97% */}
             <div className="relative p-8 md:p-10 rounded-3xl border border-accent/20 bg-accent/[0.03] flex flex-col shadow-[0_0_40px_rgba(255,102,0,0.05)] overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-accent/10 blur-[60px] pointer-events-none" aria-hidden="true" />
                <div className="relative z-10">
                   <div className="font-sans text-accent text-sm font-black tracking-widest uppercase mb-3 flex items-center gap-2">
                     97% RYNKU
                   </div>
                   <h3 className="font-display text-white text-xl tracking-widest uppercase mb-4 font-bold">Twój klient Premium</h3>
                   <p className="text-white/90 text-base md:text-lg leading-relaxed font-sans">
                      To ludzie na Facebooku, Instagramie i&nbsp;YouTube. Mają problem, ale jeszcze nie szukają wykonawcy.
                   </p>
                </div>
             </div>
          </div>

          {/* TWO DUAL STRATEGY CARDS (Unified Aesthetic) */}
          <div className="grid md:grid-cols-2 gap-4 md:gap-8 items-stretch mb-10">
             
             {/* Strategy Card */}
             <div className="relative p-7 rounded-[1.5rem] md:rounded-[2rem] border border-white/[0.08] bg-white/[0.02] overflow-hidden flex flex-col justify-center">
                <h3 className="font-display text-white text-xl md:text-2xl tracking-widest uppercase mb-4 font-bold border-b border-white/10 pb-4">NASZA STRATEGIA</h3>
                <div className="font-sans text-white/90 text-base md:text-lg leading-relaxed space-y-4">
                   <p>
                     Docieramy do nich przez <span className="text-white font-bold underline decoration-white/20 underline-offset-4">profesjonalne wideo</span>.
                   </p>
                   <p>
                     Uświadamiamy im problem i&nbsp;pokazujemy Ciebie jako eksperta, zanim pomyślą o&nbsp;konkurencji.
                   </p>
                </div>
             </div>

             {/* Result Card (Unified Aesthetic) */}
             <div className="relative p-7 rounded-[1.5rem] md:rounded-[2rem] border border-accent/20 bg-accent/[0.03] shadow-[0_0_40px_rgba(255,102,0,0.05)] overflow-hidden flex flex-col justify-center">
                <div className="absolute top-0 right-0 w-40 h-40 bg-accent/10 blur-[60px] pointer-events-none" aria-hidden="true" />
                <h3 className="relative z-10 font-display text-accent text-xl md:text-2xl tracking-widest uppercase mb-4 font-bold border-b border-accent/20 pb-4">EFEKT DOMINACJI</h3>
                <div className="relative z-10 font-sans text-white/90 text-base md:text-lg leading-relaxed space-y-4">
                   <p>
                      Kiedy dojrzeją do decyzji – <span className="text-white font-bold underline decoration-white/10 underline-offset-4">nie porównują</span> cen. <br />
                      Dzwonią od razu do <span className="text-accent font-black">CIEBIE!</span>
                   </p>
                   <p className="border-t border-accent/20 pt-4 font-bold">
                      Nie walcz ceną. <br />
                      Zbuduj markę, która <span className="text-accent underline decoration-accent/30 underline-offset-4">sprzedaje się sama</span>.
                   </p>
                </div>
             </div>
          </div>

          {/* Final Strategic CTA */}
          <div className="flex flex-col items-center">
             <a
               href="#contact"
               className="group relative inline-flex items-center gap-4 md:gap-6 px-10 md:px-20 py-4 md:py-5 rounded-full font-sans text-sm md:text-base tracking-[.4em] uppercase text-black font-black overflow-hidden transition-all duration-500 hover:scale-[1.05] hover:shadow-[0_0_80px_rgba(255,102,0,0.6)]"
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
