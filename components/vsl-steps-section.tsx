"use client"

import { useRef } from "react"
import { ClipboardCheck, Video, Scissors, MonitorPlay, Filter, ArrowRight } from "lucide-react"
import { motion, useScroll, useTransform } from "framer-motion"

const steps = [
  {
    num: "01",
    icon: ClipboardCheck,
    title: "Audyt i Strategia Contentu",
    subtitle: "ZDEJMUJEMY BÓL GŁOWY",
    text: "Wypełniasz krótką ankietę. Ja analizuję Twoją ofertę, mapuję grupę docelową i w 3 dni robocze przygotowuję dla Ciebie strategię oraz gotowe scenariusze wideo. Zero zgadywania, co masz powiedzieć. Tłumaczymy Twoją wiedzę na krótkie, uderzeniowe formy (Rolki), które przyciągają klientów premium.",
  },
  {
    num: "02",
    icon: Video,
    title: "Dzień Nagraniowy (My Przejmujemy Stery)",
    subtitle: "SAMO GĘSTE, BEZ LANIA WODY",
    text: "Spotykamy się w naszym profesjonalnym studiu Podcast Katowice (lub przyjeżdżamy do Ciebie z pełnym zapleczem). Przejmujemy rolę moderatora: zadajemy pytania, pilnujemy dynamiki i ucinamy rozwlekanie tematów. Boisz się kamery? Masz do dyspozycji prompter — czytasz tekst, nie kując niczego na pamięć.",
  },
  {
    num: "03",
    icon: Scissors,
    title: "Błyskawiczny Montaż i Paczki Wideo",
    subtitle: '"PLUG & PLAY"',
    text: "Zabieramy surowy materiał i wyciągamy samo „mięso”. W max 4 dni robocze od nagrania dostajesz gotowe, wysoce konwertujące paczki wideo (np. 8, 12 lub 16 Rolek Premium) z profesjonalnym dźwiękiem, dynamicznymi napisami i przebitkami (b-roll).",
  },
  {
    num: "04",
    icon: MonitorPlay,
    title: "Publikacja i Prowadzenie Profili",
    subtitle: "ZDJĘCIE ODPOWIEDZIALNOŚCI",
    text: "Nie musisz pamiętać o wrzucaniu postów ani znać się na algorytmach. Przejmujemy pełną obsługę Twoich social mediów (Instagram, Facebook, TikTok, LinkedIn). Dystrybuujemy materiały według harmonogramu, dbając o spójność wizualną i regularność, która buduje zaufanie do Twojej marki.",
  },
  {
    num: "05",
    icon: Filter,
    title: "Kampanie Ads i Analiza Zapytań",
    subtitle: "SKALOWANIE I REZULTATY",
    text: "Kiedy organiczne Rolki edukują i budują Twój autorytet, my dodatkowo (opcjonalnie) dopalamy najlepsze materiały kampaniami płatnymi (Meta Ads). Ty po prostu odbierasz powiadomienia o nowych, zakwalifikowanych leadach i skupiasz się na domykaniu sprzedaży wyedukowanych klientów.",
  },
]

export default function VslStepsSection() {
  const sectionRef = useRef<HTMLElement>(null)
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  })

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  } as const

  const stepVariants = (isEven: boolean) => ({
    hidden: { 
      opacity: 0, 
      x: isEven ? 50 : -50,
      y: 20 
    },
    visible: { 
      opacity: 1, 
      x: 0, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20,
        duration: 0.8
      }
    },
  } as const)

  return (
    <section
      ref={sectionRef}
      className="relative py-12 md:py-16 overflow-hidden bg-[#050505]"
      aria-labelledby="steps-title"
    >
      {/* Background Video with Custom Parallax */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-40" aria-hidden="true">
        <motion.div 
          className="absolute inset-0 w-full h-[120%] -top-[10%] will-change-transform"
          style={{ y: backgroundY }}
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
        </motion.div>
        {/* Dark Vignette & Gradient Mask */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-transparent to-[#050505] z-1" aria-hidden="true" />
        <div className="absolute inset-0 bg-[#050505]/50 z-1" aria-hidden="true" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8">
        
        {/* Header Section */}
        <motion.div 
          className="max-w-4xl mx-auto text-center mb-10 md:mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 0.8 }}
        >
          <span className="inline-block font-display text-[10px] md:text-sm text-accent tracking-[.49em] uppercase mb-6 md:mb-8 opacity-70">
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
             <p className="text-white/60 text-base md:text-lg font-sans font-medium leading-relaxed italic tracking-tight">
               &ldquo;Ty skupiasz się na dostarczaniu usługi, ja przejmuję kontrolę nad pozyskiwaniem klientów.&rdquo;
             </p>
          </div>
        </motion.div>

        {/* The Process Journey */}
        <div className="relative lg:pb-12">
          
          {/* Central Vertical Line (Desktop only) */}
          <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 bg-gradient-to-b from-accent/40 via-white/10 to-transparent" aria-hidden="true" />

          <motion.div 
            className="space-y-4 md:space-y-4"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.1 }}
          >
            {steps.map((step, i) => {
              const Icon = step.icon
              const isEven = i % 2 !== 0

              return (
                <motion.div 
                  key={step.num}
                  variants={stepVariants(isEven)}
                  className={`flex flex-col lg:flex-row items-center gap-4 md:gap-0 ${isEven ? 'lg:flex-row-reverse text-right' : 'text-left'} relative z-${10 + i} ${i > 0 ? 'lg:-mt-12' : ''}`}
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
                        <span className="font-display text-xs md:text-sm tracking-[.49em] text-accent font-bold uppercase">{step.subtitle}</span>
                      </div>
                      
                      <h3 className="font-display text-[26px] md:text-[34px] lg:text-[40px] text-white mb-3 md:mb-4 tracking-wide group-hover:text-accent transition-colors font-bold leading-[1.1]">
                        {step.title}
                      </h3>
                      
                      <p className={`text-white/70 text-base md:text-lg leading-relaxed font-sans font-medium ${isEven ? 'md:max-w-md ml-auto' : 'md:max-w-md mr-auto'}`}>
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

                </motion.div>
              )
            })}
          </motion.div>

        </div>

        {/* Unified Final CTA Area — Slimmed Down */}
        <motion.div 
          className="relative mt-10 pt-10 pb-4 md:pb-8 border-t border-white/5 text-center flex flex-col items-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          layout
        >
            <div className="relative z-10 max-w-4xl mx-auto px-4">
              <h3 className="font-display text-[clamp(2rem,7vw,3.5rem)] leading-[0.9] text-white tracking-tight mb-6 text-balance">
                 GOTOWY NA TWOJĄ{" "}
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
              
              <div className="flex flex-col items-center gap-6">
                 <div className="space-y-1">
                    <p className="font-sans text-white/80 text-sm md:text-base font-medium tracking-tight">
                       Przestań walczyć o 3% klientów i zacznij dominować w Off-Markecie.
                    </p>
                    <p className="font-sans italic text-white/50 text-sm md:text-base">
                       Zacznij budować autorytet, który sprzedaje za Ciebie.
                    </p>
                 </div>

                 <div className="flex flex-col items-center gap-4 w-full">
                    <a
                       href="#contact"
                       className="group relative inline-flex items-center gap-3 px-8 md:px-12 py-3 md:py-4 rounded-full font-sans text-xs md:text-sm tracking-widest uppercase text-black font-black overflow-hidden transition-all duration-300 hover:scale-[1.02] shadow-lg"
                       style={{
                         background: "linear-gradient(135deg, #ff6600, #ff8533)",
                       }}
                       aria-label="Rozpocznij transformację biznesu teraz"
                    >
                       <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/30 to-transparent" aria-hidden="true" />
                       <span className="relative z-10 flex items-center gap-2">
                          ZACZNIJMY TERAZ 
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                       </span>
                    </a>

                    <div className="flex justify-center mt-2">
                       <p className="text-white/60 text-[9px] md:text-[10px] font-sans tracking-[.2em] uppercase font-bold text-center">
                          Zostały 4 miejsca na kwiecień
                       </p>
                    </div>
                 </div>
              </div>
            </div>
        </motion.div>

      </div>
    </section>
  )
}
