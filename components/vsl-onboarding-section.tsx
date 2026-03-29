"use client"

import { useEffect, useRef, useState } from "react"
import { CalendarDays, ArrowRight, ClipboardList, MessageSquare, Rocket, CheckCircle2, Search, Video } from "lucide-react"

export default function VslOnboardingSection() {
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
      id="contact"
      className="relative py-12 md:py-16 overflow-hidden bg-[#050505]"
      aria-labelledby="onboarding-title"
    >
      {/* Massive Background Text Decoration */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none opacity-[0.02]" aria-hidden="true">
        <span className="font-display text-[18vw] leading-none text-white uppercase tracking-tighter">
          START
        </span>
      </div>

      {/* NEW: ONE HUGE ICON IN THE BACKGROUND (As requested) */}
      <div className="absolute inset-0 z-0 flex items-center justify-center overflow-hidden pointer-events-none opacity-[0.03]" aria-hidden="true">
         <CalendarDays className="w-[80vw] h-[80vw] text-accent transform rotate-12 translate-x-1/4" strokeWidth={0.5} />
      </div>

      {/* Decorative Orbs */}
      <div className="absolute top-1/2 left-0 w-64 md:w-80 h-64 md:h-80 bg-accent/5 blur-[100px] rounded-full pointer-events-none" aria-hidden="true" />
      <div className="absolute bottom-0 right-0 w-64 md:w-80 h-64 md:h-80 bg-accent/5 blur-[100px] rounded-full pointer-events-none" aria-hidden="true" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8">
        
        {/* Header Area & Creative Visuals */}
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-20 items-center mb-12 md:mb-24">
           {/* Left: Text Content */}
           <div 
              className="max-w-2xl transition-all duration-1000"
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? "translateY(0)" : "translateY(30px)",
              }}
           >
              <span className="font-display text-accent text-[10px] md:text-sm tracking-[.3em] uppercase mb-4 opacity-80 font-bold">
                 Onboarding
              </span>
              <h2 id="onboarding-title" className="font-display text-[clamp(2.2rem,8vw,4rem)] leading-[0.85] text-white tracking-tighter mb-6 md:mb-8 px-4 md:px-0">
                 JAK <br />
                 <span
                   style={{
                     background: "linear-gradient(135deg, #ff6600, #ff8533)",
                     WebkitBackgroundClip: "text",
                     WebkitTextFillColor: "transparent",
                   }}
                 >
                   ZACZĄĆ?
                 </span>
              </h2>
              <h3 className="font-display text-lg md:text-2xl text-white/50 tracking-widest uppercase mb-6 md:mb-8 px-4 md:px-0 font-bold">3 proste kroki do startu</h3>
              <p className="font-sans text-white/75 text-sm md:text-xl leading-relaxed px-4 md:px-0 font-medium">
                 Bez stresu, bez lania wody i bez technicznego bełkotu. Jedna krótka rozmowa wystarczy, żeby sprawdzić, czy nasz system wideo marketingu sprawdzi się w Twojej branży.
              </p>
           </div>

           {/* Right: Empty / Spacing for the background icon (As per user request to simplify) */}
           <div className="hidden lg:block h-[300px]" aria-hidden="true" />
        </div>

        {/* 3 Steps Vertical Flow */}
        <div className="relative space-y-10 md:space-y-16 mb-16 md:mb-28">
           
           {/* Step 01 */}
           <div 
             className="group relative flex flex-col md:flex-row gap-6 md:gap-8 items-start transition-all duration-1000"
             style={{
               opacity: isVisible ? 1 : 0,
               transform: isVisible ? "translateY(0)" : "translateY(40px)",
               transitionDelay: "200ms"
             }}
           >
              <div className="flex-shrink-0 font-display text-4xl md:text-7xl text-white/15 tracking-tighter group-hover:text-accent/30 transition-all duration-500">01</div>
              <div className="flex-grow">
                 <h4 className="font-display text-lg md:text-2xl text-white mb-3 md:mb-4 tracking-wide group-hover:text-accent transition-colors font-bold">Wypełnij Krótką Ankietę Kwalifikacyjną</h4>
                 <p className="font-sans text-white/70 text-xs md:text-lg leading-relaxed max-w-3xl font-medium">
                    Szanujemy swój i Twój czas. Zanim porozmawiamy, chcę poznać Twoją obecną sytuację biznesową. Wypełniasz krótki formularz, w którym pytam m.in. o to, kto jest Twoim idealnym klientem, z jakimi obiekcjami walczysz najczęściej i jakim budżetem operujesz. To pozwala nam odsiać projekty, w których nie będziemy w stanie pomóc.
                 </p>
              </div>
           </div>

           {/* Step 02 */}
           <div 
             className="group relative flex flex-col md:flex-row gap-6 md:gap-8 items-start transition-all duration-1000"
             style={{
               opacity: isVisible ? 1 : 0,
               transform: isVisible ? "translateY(0)" : "translateY(40px)",
               transitionDelay: "400ms"
             }}
           >
              <div className="flex-shrink-0 font-display text-4xl md:text-7xl text-white/15 tracking-tighter group-hover:text-accent/30 transition-all duration-500">02</div>
              <div className="flex-grow">
                 <h4 className="font-display text-lg md:text-2xl text-white mb-3 md:mb-4 tracking-wide group-hover:text-accent transition-colors font-bold">Bezpłatna Konsultacja i Audyt (15–30 min)</h4>
                 <p className="font-sans text-white/70 text-xs md:text-lg leading-relaxed max-w-3xl font-medium">
                    Wybierasz termin w kalendarzu. Dzwonimy się i na podstawie Twojej ankiety od razu przechodzimy do konkretów. Oceniam Twoją obecną komunikację i pokazuję, jak możemy opakować Twoją wiedzę w krótkie formy wideo (Rolki/Shorts), by zacząć generować zapytania od klientów premium. Jeśli nie widzę potencjału na zwrot z inwestycji – powiem Ci to wprost.
                 </p>
              </div>
           </div>

           {/* Step 03 */}
           <div 
             className="group relative flex flex-col md:flex-row gap-6 md:gap-8 items-start transition-all duration-1000"
             style={{
               opacity: isVisible ? 1 : 0,
               transform: isVisible ? "translateY(0)" : "translateY(40px)",
               transitionDelay: "600ms"
             }}
           >
              <div className="flex-shrink-0 font-display text-4xl md:text-7xl text-white/15 tracking-tighter group-hover:text-accent/30 transition-all duration-500">03</div>
              <div className="flex-grow">
                 <h4 className="font-display text-lg md:text-2xl text-white mb-3 md:mb-4 tracking-wide group-hover:text-accent transition-colors font-bold">Plan Wdrożeniowy i Start (Nagrania)</h4>
                 <p className="font-sans text-white/70 text-xs md:text-lg leading-relaxed max-w-3xl font-medium">
                    Jeśli decydujemy się na współpracę, dopinamy formalności i od razu przejmujemy stery. W ciągu 3 dni przygotowuję dla Ciebie dedykowane scenariusze. Ustalamy termin Twojego przyjazdu do naszego studia Podcast Katowice (lub naszego przyjazdu do Ciebie ze sprzętem) i odpalamy cały proces produkcji. Ty tylko mówisz, my zajmuje się resztą.
                 </p>
              </div>
           </div>

        </div>

        {/* Final Calendar CTA Block */}
        <div 
           className="relative group p-6 md:p-16 rounded-[2rem] md:rounded-3xl border border-white/[0.08] bg-white/[0.04] transition-all duration-1000 delay-700 overflow-hidden text-center flex flex-col items-center shadow-2xl"
           style={{
             opacity: isVisible ? 1 : 0,
             transform: isVisible ? "translateY(0)" : "translateY(20px)",
           }}
        >
           <div className="absolute inset-x-0 bottom-0 h-1/2 bg-accent/10 blur-[100px] rounded-full pointer-events-none" aria-hidden="true" />

           <div className="relative z-10 w-full">
              <div className="flex justify-center mb-6 md:mb-8">
                <div className="w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center border border-accent/30 bg-accent/5 group-hover:bg-accent/10 group-hover:border-accent/50 transition-all duration-500 shadow-accent/5 shadow-2xl">
                   <CalendarDays className="w-6 md:w-8 h-6 md:h-8 text-accent/80" aria-hidden="true" />
                </div>
              </div>

              <h3 className="font-display text-[clamp(1.2rem,5vw,3rem)] text-white tracking-[0.15em] md:tracking-widest uppercase mb-4 md:mb-6 font-bold">
                 WYBIERZ TERMIN ROZMOWY
              </h3>
              
              <p className="font-sans text-white/60 text-xs md:text-lg max-w-xl mx-auto mb-10 md:mb-12 tracking-tight font-medium">
                 Sprawdzimy, czy nasz system marketingu opartego na autorytecie pasuje do Twojego modelu biznesowego.
              </p>

              <a
                href="https://calendly.com/twoja-nazwa" 
                target="_blank"
                rel="noopener noreferrer"
                className="group relative inline-flex items-center gap-3 md:gap-4 px-8 md:px-20 py-4 md:py-6 rounded-sm font-sans text-[10px] md:text-sm tracking-widest uppercase text-black font-extrabold overflow-hidden transition-all duration-500 hover:scale-[1.05] hover:shadow-[0_0_80px_rgba(255,102,0,0.6)] w-full md:w-auto justify-center"
                style={{
                  background: "linear-gradient(135deg, #ff6600, #ff8533)",
                }}
                aria-label="Umów bezpłatną konsultację w kalendarzu Calendly"
              >
                <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/40 to-transparent" aria-hidden="true" />
                <span className="relative z-10 flex items-center gap-2 md:gap-3">
                   Umów bezpłatną konsultację
                   <ArrowRight className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                </span>
              </a>
           </div>
        </div>

      </div>
    </section>
  )
}
