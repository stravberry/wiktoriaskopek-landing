"use client"

import { useEffect, useRef, useState } from "react"
import { Building2, GraduationCap, Briefcase, BookOpen, Scale, HeartPulse, ArrowRight, Target } from "lucide-react"

const industries = [
  { icon: Building2, label: "Nieruchomości", desc: "Deweloperzy i Pośrednicy Premium" },
  { icon: GraduationCap, label: "Mentoring & Coaching", desc: "Eksperci i Marki Osobiste" },
  { icon: Briefcase, label: "Doradztwo & Consulting", desc: "Usługi B2B i Strategia" },
  { icon: BookOpen, label: "Szkolenia", desc: "Kursy Online i Akademia" },
  { icon: Scale, label: "Kancelarie prawne", desc: "Prawo i Obsługa Biznesu" },
  { icon: HeartPulse, label: "Medycyna estetyczna", desc: "Branża Health & Beauty" },
]

export default function VslAudienceSection() {
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
      className="relative py-8 md:py-12 overflow-hidden bg-[#050505]"
      aria-labelledby="audience-title"
    >
      {/* Background radial accent */}
      <div
        className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-[1000px] h-[1000px] rounded-full pointer-events-none opacity-20"
        style={{
          background: "radial-gradient(circle at center, rgba(255,102,0,0.025) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8">
        
        {/* Section Header */}
        <div className="max-w-4xl mx-auto text-center mb-12 md:mb-24">
          <h2 id="audience-title" className="font-display text-[clamp(2.2rem,8vw,4rem)] leading-[0.85] text-white tracking-widest mb-8 px-4 md:px-0">
            DLA{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #ff6600, #ff8533)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              KOGO
            </span>
            {" "}TO JEST
          </h2>
        </div>

        {/* Main Audience Blocks */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-7 mb-12 md:mb-24">
          
          <div 
            className="group relative p-6 md:p-10 rounded-[1.5rem] md:rounded-3xl border border-white/[0.08] bg-white/[0.02] hover:border-accent/40 transition-all duration-500 overflow-hidden"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? "translateY(0)" : "translateY(20px)",
              transitionDelay: "100ms"
            }}
          >
            <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-100 transition-opacity duration-700" aria-hidden="true">
               <Target className="w-10 h-10 text-accent/20" />
            </div>
            
            <h3 className="font-display text-[26px] md:text-[40px] text-white mb-6 md:mb-8 tracking-wide font-bold leading-[1.1]">
               Eksperci i Duo-Team
            </h3>
            
            <p className="text-white/80 text-base md:text-lg leading-relaxed font-sans mb-6 md:mb-8">
              Dla ekspertów, solo przedsiębiorców i&nbsp;firm usługowych (B2B/B2C),
              którzy generują już{" "}
              <span className="text-white font-bold">8–30 tys. zł/miesięcznie</span>{" "}
              i&nbsp;chcą stabilnie skalować się do{" "}
              <span className="text-accent font-black">50K–100K zł/miesięcznie</span>.
            </p>
            
            <div className="h-px w-full bg-gradient-to-r from-accent/30 to-transparent" aria-hidden="true" />
          </div>

          <div 
            className="group relative p-6 md:p-10 rounded-[1.5rem] md:rounded-3xl border border-white/[0.08] bg-white/[0.02] hover:border-accent/40 transition-all duration-500 overflow-hidden"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? "translateY(0)" : "translateY(20px)",
              transitionDelay: "200ms"
            }}
          >
            <h3 className="font-display text-[26px] md:text-[40px] text-white mb-6 md:mb-8 tracking-wide text-left font-bold leading-[1.1]">
               Sprzedaż Wiedzy i High-Ticket
            </h3>
            
            <p className="text-white/80 text-base md:text-lg leading-relaxed font-sans mb-6 md:mb-8">
              Jeśli sprzedajesz wiedzę, konsultacje lub usługi{" "}
              <span className="text-white font-bold underline decoration-accent/40 underline-offset-4 font-display text-base md:text-[1.1em] tracking-wide inline-block">High-Ticket</span>{" "}
              (od 2&nbsp;000 zł wzwyż) i&nbsp;chcesz mieć stały napływ klientów premium
              — ten system jest dla Ciebie.
            </p>

            <div className="h-px w-full bg-gradient-to-r from-accent/30 to-transparent" aria-hidden="true" />
          </div>

        </div>

        {/* Industry Focus List */}
        <div className="text-center mb-10 md:mb-16">
          <h3 className="font-display text-[clamp(1.2rem,4vw,2.1rem)] text-white/70 tracking-[.15em] uppercase mb-8 md:mb-12 max-w-3xl mx-auto leading-tight px-4 md:px-0">
            Szczególnie wspieram branże <br className="hidden md:block" aria-hidden="true" />
            <span className="text-accent opacity-90">opierające się na autorytecie</span>
          </h3>
          
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-8">
            {industries.map((item, i) => {
              const Icon = item.icon
              return (
                <div
                  key={item.label}
                  className="group relative flex flex-col justify-end min-h-[240px] md:min-h-[280px] p-3 sm:p-6 md:p-8 rounded-[1rem] md:rounded-2xl border border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.04] transition-all duration-700 hover:border-accent/50 overflow-hidden shadow-xl"
                  style={{
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible ? "translateY(0)" : "translateY(20px)",
                    transitionDelay: `${300 + i * 50}ms`
                  }}
                >
                  {/* Background Oversized Icon - Scale and fade for mobile */}
                  <div className="absolute top-4 right-4 md:top-6 md:right-6 opacity-[0.04] md:opacity-[0.08] group-hover:opacity-[0.15] group-hover:scale-125 group-hover:rotate-12 transition-all duration-1000 transform origin-top-right" aria-hidden="true">
                    <Icon className="w-32 md:w-40 h-32 md:h-40 text-accent" strokeWidth={0.5} />
                  </div>
                  
                  {/* Glowing Edge Header */}
                  <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-accent/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" aria-hidden="true" />

                  <div className="relative z-10 text-left">
                    <div className="w-8 h-8 md:w-12 md:h-12 rounded-lg bg-accent/15 border border-accent/30 flex items-center justify-center text-accent mb-3 md:mb-6 transform group-hover:scale-110 transition-transform duration-500 shadow-accent/5 shadow-2xl">
                      <Icon className="w-4 h-4 md:w-6 md:h-6" strokeWidth={1.5} aria-hidden="true" />
                    </div>
                    
                    <h4 className="font-display text-[28px] sm:text-[30px] md:text-[36px] text-white group-hover:text-accent transition-colors mb-2 md:mb-3 tracking-normal uppercase font-black leading-[0.95] break-words hyphens-auto">
                      {item.label}
                    </h4>
                    {item.desc && (
                       <p className="text-white/70 text-[13px] sm:text-sm md:text-base font-sans tracking-tight leading-snug font-medium mt-1">
                         {item.desc}
                       </p>
                    )}
                  </div>
                  
                  {/* Subtle Background Glow on Hover */}
                  <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-accent/20 blur-[60px] rounded-full opacity-0 group-hover:opacity-50 transition-opacity duration-1000" aria-hidden="true" />
                </div>
              )
            })}
          </div>
        </div>

        {/* Bottom CTA Area */}
        <div className="mt-8 md:mt-12 pt-8 md:pt-10 border-t border-white/10 text-center flex flex-col items-center">
            <p className="text-white/60 text-base md:text-xl font-sans mb-6 max-w-2xl text-center leading-relaxed px-4 md:px-0 font-medium">
               Jeśli prowadzisz firmę i szukasz <br className="hidden md:block" aria-hidden="true" />
               <span className="text-white font-bold inline-block border-b-2 border-accent/40 pb-1">zaufanych klientów</span> na swoje usługi — porozmawiajmy.
            </p>
            
            <a
              href="#contact"
              className="group relative inline-flex items-center gap-3 px-10 md:px-14 py-4 md:py-6 rounded-full font-sans text-sm md:text-base tracking-widest uppercase text-black font-extrabold overflow-hidden transition-all duration-500 hover:scale-[1.05] hover:shadow-[0_0_60px_rgba(255,102,0,0.6)]"
              style={{
                background: "linear-gradient(135deg, #ff6600, #ff8533)",
              }}
              aria-label="Porozmawiajmy o skalowaniu Twojego biznesu"
            >
              <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/40 to-transparent" aria-hidden="true" />
              <span className="relative z-10">Porozmawiajmy</span>
              <ArrowRight className="relative z-10 w-4 h-4 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
            </a>
        </div>

      </div>
    </section>
  )
}
