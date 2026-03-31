"use client"

import { Zap, Target } from "lucide-react"
import { motion } from "framer-motion"

export default function VslFunnelsSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  } as const

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 30 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 80,
        damping: 15,
        duration: 0.8,
      },
    },
  } as const

  return (
    <section
      className="relative py-12 md:py-16 overflow-hidden bg-[#050505]"
      aria-labelledby="funnels-title"
    >
      {/* Massive Background Text Decoration */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none opacity-[0.02]" aria-hidden="true">
        <span className="font-display text-[18vw] leading-none text-white uppercase tracking-tighter">
          AUTORYTET
        </span>
      </div>

      {/* Decorative Orbs */}
      <div className="absolute top-1/4 left-[10%] w-48 md:w-72 h-48 md:h-72 bg-accent/5 blur-[120px] rounded-full pointer-events-none" aria-hidden="true" />
      <div className="absolute bottom-1/4 right-[10%] w-48 md:w-72 h-48 md:h-72 bg-accent/5 blur-[120px] rounded-full pointer-events-none" aria-hidden="true" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8">
        
        {/* Header Area */}
        <motion.div 
           className="max-w-4xl mb-12 md:mb-16"
           initial={{ opacity: 0, y: 30 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           transition={{ duration: 0.8 }}
        >
           <span className="font-display text-accent text-xs md:text-sm tracking-[.3em] uppercase inline-block mb-6 md:mb-8 opacity-80 font-bold">
              Budowa Autorytetu
           </span>
           <h2 id="funnels-title" className="font-display text-[clamp(2.2rem,8vw,4.5rem)] leading-[0.85] text-white tracking-tighter mb-8 px-4 md:px-0">
              DLACZEGO POTRZEBUJESZ WIDEO <br />
              <span
                style={{
                  background: "linear-gradient(135deg, #ff6600, #ff8533)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                I DWÓCH LEJKÓW?
              </span>
           </h2>
           <p className="font-sans text-white/70 text-base md:text-xl leading-relaxed max-w-3xl px-4 md:px-0 font-medium">
              Zwykła strona-wizytówka i sucha oferta to dzisiaj za mało. Klienci premium nie kupują na podstawie cennika – kupują od ludzi, którym ufają. Jeśli nie widzą Cię w akcji, nie rozumieją Twojej wartości. Zamiast tracić godziny na tłumaczenie od zera wdrażamy system wideo, który buduje ten autorytet za Ciebie. Dlatego uruchamiamy dwa połączone lejki:
           </p>
        </motion.div>

        {/* Funnels Grid */}
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-12 mb-12 md:mb-28"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          
          {/* 01 — LEJEK WIZERUNKOWY */}
          <motion.div 
            variants={itemVariants}
            className="group relative p-6 md:p-12 rounded-[1.5rem] md:rounded-3xl border border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.04] hover:border-accent/40 transition-all duration-700 overflow-hidden shadow-xl"
          >
             {/* Background Oversized Icon (Scaled for mobile) */}
             <div className="absolute top-4 right-4 md:top-6 md:right-6 opacity-[0.05] md:opacity-[0.08] group-hover:opacity-[0.12] group-hover:scale-110 transition-all duration-1000 transform origin-top-right" aria-hidden="true">
                <Target className="w-32 md:w-56 h-32 md:h-56 text-accent" strokeWidth={0.5} />
             </div>

             <div className="relative z-10">
                <div className="flex items-center gap-2 md:gap-3 mb-8 md:mb-10">
                   <div className="font-display text-2xl md:text-5xl text-white/15 tracking-tighter group-hover:text-accent/30 transition-colors">01</div>
                   <div className="h-px w-8 md:w-12 bg-accent/30" aria-hidden="true" />
                   <span className="font-display text-xs md:text-sm tracking-widest text-accent uppercase font-bold">Edukacja i Zaufanie</span>
                </div>

                <h3 className="font-display text-[32px] md:text-5xl text-white mb-4 md:mb-6 uppercase tracking-tight font-bold">
                   LEJEK <br /> WIZERUNKOWY
                </h3>

                <p className="font-sans text-white/70 text-base md:text-lg leading-relaxed font-medium">
                   Wysokiej jakości wideo (Rolki i Shorts) pokazują Twoją wiedzę, Twoje podejście do biznesu i transformację, jaką dajesz klientom. Docieramy do tzw. Off-Marketu — uświadamiamy ludziom ich problemy, zanim w ogóle zaczną szukać najtańszego wykonawcy na portalach. Regularna, profesjonalna obecność wideo dzień po dniu buduje Twój status niepodważalnego eksperta w branży.
                </p>
             </div>
          </motion.div>

          {/* 02 — LEJEK SPRZEDAŻOWY */}
          <motion.div 
            variants={itemVariants}
            className="group relative p-6 md:p-12 rounded-[1.5rem] md:rounded-3xl border border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.04] hover:border-accent/40 transition-all duration-700 overflow-hidden shadow-xl"
          >
             {/* Background Oversized Icon (Scaled for mobile) */}
             <div className="absolute top-4 right-4 md:top-6 md:right-6 opacity-[0.05] md:opacity-[0.08] group-hover:opacity-[0.12] group-hover:scale-110 transition-all duration-1000 transform origin-top-right" aria-hidden="true">
                <Zap className="w-32 md:w-56 h-32 md:h-56 text-accent" strokeWidth={0.5} />
             </div>

             <div className="relative z-10">
                <div className="flex items-center gap-2 md:gap-3 mb-8 md:mb-10">
                   <div className="font-display text-2xl md:text-5xl text-white/15 tracking-tighter group-hover:text-accent/30 transition-colors">02</div>
                   <div className="h-px w-8 md:w-12 bg-accent/30" aria-hidden="true" />
                   <span className="font-display text-xs md:text-sm tracking-widest text-accent uppercase font-bold">Konwersja i Kwalifikacja</span>
                </div>

                <h3 className="font-display text-[32px] md:text-5xl text-white mb-4 md:mb-6 uppercase tracking-tight font-bold">
                   LEJEK <br /> SPRZEDAŻOWY
                </h3>

                <p className="font-sans text-white/70 text-base md:text-lg leading-relaxed font-medium">
                   Kiedy klient jest już „ograny” Twoją wiedzą i ufa Ci dzięki rolkom, wpada w lejek sprzedażowy (kampanie leadowe lub kierujące na Twoją dopracowaną ofertę). Wideo odwala za Ciebie najcięższą robotę: pokazuje konkretne case studies, tłumaczy proces współpracy i zbija obiekcje. Kiedy klient w końcu do Ciebie dzwoni, jest już doedukowany i gotowy do działania.
                </p>
             </div>
          </motion.div>

        </motion.div>

        {/* Conclusion / Investment Logic */}
        <motion.div 
           className="relative p-7 md:p-16 rounded-[1.5rem] md:rounded-3xl border border-white/[0.08] bg-white/[0.04] transition-all duration-1000 overflow-hidden group shadow-2xl"
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           transition={{ duration: 1, delay: 0.4 }}
        >
           {/* Glow behind the logic block */}
           <div className="absolute -bottom-1/2 left-1/2 -translate-x-1/2 w-3/4 h-64 bg-accent/10 blur-[100px] rounded-full pointer-events-none" aria-hidden="true" />
           
           <div className="relative z-10 flex flex-col items-center text-center max-w-4xl mx-auto">
              <p className="font-sans text-white/75 text-base md:text-2xl leading-relaxed tracking-tight mb-0 font-medium">
                 Inwestycja w profesjonalny wideo marketing to <span className="text-white italic font-sans">nie koszt</span>. To jedyna metoda, by przestać sprzedawać swój czas za grosze, wyróżnić się na tle szarej konkurencji i płynnie przejść na stawki <span className="text-accent font-display tracking-[0.15em] md:tracking-widest uppercase font-bold">High-Ticket</span>.
              </p>
           </div>
        </motion.div>

      </div>
    </section>
  )
}
