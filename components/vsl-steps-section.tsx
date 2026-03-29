"use client"

import { useEffect, useRef, useState } from "react"
import { ClipboardCheck, Video, Scissors, MonitorPlay, Filter, ArrowRight } from "lucide-react"

const steps = [
  {
    num: "01",
    icon: ClipboardCheck,
    title: "Audyt i Strategia Contentu",
    subtitle: "ZDEJMUJEMY BÓL GŁOWY",
    text: "Wypełniasz krótką ankietę. Ja analizuję Twoją ofertę, mapuję grupę docelową i w 3 dni robocze przygotowuję dla Ciebie strategię oraz gotowe scenariusze wideo. Zero zgadywania, co masz powiedzieć. Tłumaczymy Twoją wiedzę na krótkie, uderzeniowe formy (Rolki), które przyciągają klientów premium.",
  },
  {
    num: "02",
    icon: Video,
    title: "Dzień Nagraniowy (My Przejmujemy Stery)",
    subtitle: "SAMO GĘSTE, BEZ LANIA WODY",
    text: "Spotykamy się w naszym profesjonalnym studiu Podcast Katowice (lub przyjeżdżamy do Ciebie z pełnym zapleczem). Przejmujemy rolę moderatora: zadajemy pytania, pilnujemy dynamiki i ucinamy rozwlekanie tematów. Boisz się kamery? Masz do dyspozycji prompter — czytasz tekst, nie kując niczego na pamięć.",
  },
  {
    num: "03",
    icon: Scissors,
    title: "Błyskawiczny Montaż i Paczki Wideo",
    subtitle: "\"PLUG & PLAY\"",
    text: "Zabieramy surowy materiał i wyciągamy samo „mięso”. W max 4 dni robocze od nagrania dostajesz gotowe, wysoce konwertujące paczki wideo (np. 8, 12 lub 16 Rolek Premium) z profesjonalnym dźwiękiem, dynamicznymi napisami i przebitkami (b-roll).",
  },
  {
    num: "04",
    icon: MonitorPlay,
    title: "Publikacja i Prowadzenie Profili",
    subtitle: "ZDJĘCIE ODPOWIEDZIALNOŚCI",
    text: "Nie musisz pamiętać o wrzucaniu postów ani znać się na algorytmach. Przejmujemy pełną obsługę Twoich social mediów (Instagram, Facebook, TikTok, LinkedIn). Dystrybuujemy materiały według harmonogramu, dbając o spójność wizualną i regularność, która buduje zaufanie do Twojej marki.",
  },
  {
    num: "05",
    icon: Filter,
    title: "Kampanie Ads i Analiza Zapytań",
    subtitle: "SKALOWANIE I REZULTATY",
    text: "Kiedy organiczne Rolki edukują i budują Twój autorytet, my dodatkowo (opcjonalnie) dopalamy najlepsze materiały kampaniami płatnymi (Meta Ads). Ty po prostu odbierasz powiadomienia o nowych, zakwalifikowanych leadach i skupiasz się na domykaniu sprzedaży wyedukowanych klientów.",
  },
]

export default function VslStepsSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [offsetY, setOffsetY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return
      const rect = sectionRef.current.getBoundingClientRect()
      const scrollY = window.scrollY
      const sectionTop = rect.top + scrollY
      const windowHeight = window.innerHeight
      
      // Calculate scroll progress within and around the section
      if (rect.top < windowHeight && rect.bottom > 0) {
        const progress = (windowHeight - rect.top) / (windowHeight + rect.height)
        // Adjust translation strength for mobile vs desktop
        const strength = window.innerWidth < 768 ? 80 : 150
        setOffsetY((progress - 0.5) * strength) 
      }
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true)
      },
      { threshold: 0.1 }
    )
    
    if (sectionRef.current) observer.observe(sectionRef.current)
    window.addEventListener("scroll", handleScroll, { passive: true })
    
    return () => {
      observer.disconnect()
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative py-12 md:py-16 overflow-hidden bg-[#050505]"
      aria-labelledby="steps-title"
    >
      {/* Background Video with Custom Parallax */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-40" aria-hidden="true">
        <div 
          className="absolute inset-0 w-full h-[140%] -top-[20%] transition-transform duration-100 ease-out will-change-transform"
          style={{ transform: `translate3d(0, ${offsetY}px, 0)` }}
        >
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover grayscale brightness-60 contrast-125"
          >
            <source src="/na strone.mp4" type="video/mp4" />
          </video>
        </div>
        {/* Dark Vignette & Gradient Mask */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-transparent to-[#050505] z-1" aria-hidden="true" />
        <div className="absolute inset-0 bg-[#050505]/50 z-1" aria-hidden="true" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8">
        
        {/* Header Section */}
        <div className="max-w-4xl mx-auto text-center mb-10 md:mb-16">
          <span className="inline-block font-display text-[10px] md:text-sm text-accent tracking-[.49em] uppercase mb-4 opacity-70">
            Współpraca krok po kroku
          </span>
          <h2 id="steps-title" className="font-display text-[clamp(2.2rem,8vw,4rem)] leading-none text-white tracking-tighter mb-8 px-4 md:px-0">
            JAK TO{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #ff6600, #ff8533)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              DZIAŁA
            </span>
          </h2>
          <div className="relative inline-block px-5 md:px-6 py-4 rounded-xl border border-white/[0.08] bg-white/[0.02] backdrop-blur-sm max-w-xl shadow-2xl">
             <p className="text-white/60 text-xs md:text-lg font-sans font-medium leading-relaxed italic tracking-tight">
               &ldquo;Ty skupiasz się na dostarczaniu usługi, ja przejmuję kontrolę nad pozyskiwaniem klientów.&rdquo;
             </p>
          </div>
        </div>

        {/* The Process Journey */}
        <div className="relative lg:pb-12">
          
          {/* Central Vertical Line (Desktop only) */}
          <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 bg-gradient-to-b from-accent/40 via-white/10 to-transparent" aria-hidden="true" />

          <div className="space-y-4 md:space-y-4">
            {steps.map((step, i) => {
              const Icon = step.icon
              const isEven = i % 2 !== 0

              return (
                <div 
                  key={step.num}
                  className={`flex flex-col lg:flex-row items-center gap-4 md:gap-0 transition-all duration-1000 delay-${i * 50} ${isEven ? 'lg:flex-row-reverse text-right' : 'text-left'} relative z-${10 + i} ${i > 0 ? 'lg:-mt-12' : ''}`}
                  style={{
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible ? "translateY(0)" : "translateY(30px)",
                  }}
                >
                  
                  {/* STEP CONTENT - Denser Card */}
                  <div className={`w-full lg:w-[48%] relative group p-6 md:p-10 rounded-2xl md:rounded-3xl border border-white/[0.08] bg-[#070707] hover:bg-[#0a0a0a] hover:border-accent/40 transition-all duration-700 overflow-hidden shadow-2xl ${isEven ? 'lg:items-end' : 'lg:items-start'}`}>
                    
                    {/* Background Oversized Icon (Scaled for mobile) */}
                    <div className={`absolute top-4 ${isEven ? 'left-4' : 'right-4'} opacity-[0.05] md:opacity-[0.06] group-hover:opacity-[0.12] group-hover:scale-110 transition-all duration-1000 transform`} aria-hidden="true">
                      <Icon className="w-32 md:w-48 h-32 md:h-48 text-accent" strokeWidth={0.5} />
                    </div>

                    <div className="relative z-10">
                      <div className={`flex items-center gap-3 mb-4 md:mb-6 ${isEven ? 'flex-row-reverse' : 'flex-row'}`}>
                        <div className="font-display text-2xl md:text-4xl text-white/10 tracking-tighter group-hover:text-accent/20 transition-colors">
                          {step.num}
                        </div>
                        <div className="h-px w-6 md:w-8 bg-accent/20" aria-hidden="true" />
                        <span className="font-display text-[9px] md:text-xs tracking-[.49em] text-accent font-bold uppercase">{step.subtitle}</span>
                      </div>
                      
                      <h3 className="font-display text-lg md:text-2xl text-white mb-3 md:mb-4 tracking-wide group-hover:text-accent transition-colors font-bold">
                        {step.title}
                      </h3>
                      
                      <p className={`text-white/70 text-xs md:text-base leading-relaxed font-sans font-medium ${isEven ? 'md:max-w-md ml-auto' : 'md:max-w-md mr-auto'}`}>
                        {step.text}
                      </p>
                    </div>

                  </div>

                  {/* CENTER NODE (Desktop only) */}
                  <div className="hidden lg:flex absolute left-1/2 -translate-x-1/2 items-center justify-center z-20" aria-hidden="true">
                    <div className="w-3 h-3 rounded-full bg-[#050505] border-2 border-accent shadow-[0_0_15px_rgba(255,102,0,0.3)] transition-all duration-700 group-hover:scale-125 group-hover:bg-accent" />
                  </div>

                  {/* EMPTY SPACE COLUMN (Desktop only) */}
                  <div className="hidden lg:block lg:w-1/2" aria-hidden="true" />

                </div>
              )
            })}
          </div>

        </div>

        {/* Success Focus Footer Area — Tightened */}
        {/* Unified Final CTA Area — Refined for 'Schludny' Editorial look */}
        <div className="relative mt-20 pt-20 pb-12 md:pb-20 border-t border-white/5 text-center flex flex-col items-center">
            
            {/* More impactful Labeling */}
            <div className="mb-12 flex items-center gap-6 opacity-60" aria-hidden="true">
               <div className="h-px w-10 md:w-16 bg-white/20" />
               <span className="font-display text-xs md:text-sm tracking-[.5em] uppercase text-accent font-bold">KROK 06 — START</span>
               <div className="h-px w-10 md:w-16 bg-white/20" />
            </div>

            <div className="relative z-10 max-w-5xl mx-auto px-4">
              <h3 className="font-display text-[clamp(2.8rem,11vw,5.5rem)] leading-[0.85] text-white tracking-tighter mb-10 text-balance">
                 GOTOWY NA TWOJĄ <br />
                 <span
                   style={{
                     background: "linear-gradient(135deg, #ff6600, #ff8533)",
                     WebkitBackgroundClip: "text",
                     WebkitTextFillColor: "transparent",
                   }}
                 >
                   TRANSFORMACJĘ?
                 </span>
              </h3>
              
              <div className="flex flex-col items-center gap-10">
                 <div className="space-y-2">
                    <p className="font-sans text-white/80 text-sm md:text-xl font-medium tracking-tight">
                       Przestań walczyć o 3% klientów i zacznij dominować w Off-Markecie.
                    </p>
                    <p className="font-serif italic text-white/40 text-xs md:text-base">
                       Zacznij budować autorytet, który sprzedaje za Ciebie.
                    </p>
                 </div>

                 <div className="flex flex-col items-center gap-6 w-full">
                    <a
                       href="#contact"
                       className="group relative inline-flex items-center gap-4 px-12 md:px-16 py-4 md:py-6 rounded-full font-sans text-xs md:text-sm tracking-widest uppercase text-black font-black overflow-hidden transition-all duration-500 hover:scale-[1.05] hover:shadow-[0_0_80px_rgba(255,102,0,0.4)] shadow-xl"
                       style={{
                         background: "linear-gradient(135deg, #ff6600, #ff8533)",
                       }}
                       aria-label="Rozpocznij transformację biznesu teraz"
                    >
                       <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/40 to-transparent" aria-hidden="true" />
                       <span className="relative z-10 flex items-center gap-3">
                          Zacznijmy Teraz 
                          <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" aria-hidden="true" />
                       </span>
                    </a>

                    <div className="flex items-center gap-3 py-2 px-5 rounded-full border border-red-500/10 bg-red-500/5 backdrop-blur-sm">
                       <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.5)]" aria-hidden="true" />
                       <p className="text-white/60 text-[9px] md:text-[10px] font-sans tracking-[.25em] uppercase font-black">
                          Zostały 4 miejsca na kwiecień
                       </p>
                    </div>
                 </div>
              </div>
            </div>
        </div>

      </div>
    </section>
  )
}
