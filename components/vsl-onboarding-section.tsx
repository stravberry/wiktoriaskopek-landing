"use client"

import { CalendarDays } from "lucide-react"
import { motion } from "framer-motion"

export default function VslOnboardingSection() {
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
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20,
        duration: 0.8,
      },
    },
  } as const

  return (
    <section
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

      {/* ONE HUGE ICON IN THE BACKGROUND */}
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
           <motion.div 
              className="max-w-2xl"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
           >
              <span className="font-sans text-accent text-xs md:text-sm tracking-[.3em] uppercase inline-block mb-6 md:mb-8 opacity-80 font-bold">
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
              <h3 className="font-display text-2xl md:text-3xl text-white/50 tracking-widest uppercase mb-6 md:mb-8 px-4 md:px-0 font-bold">3 proste kroki do startu</h3>
              <p className="font-sans text-white/75 text-base md:text-xl leading-relaxed px-4 md:px-0 font-medium">
                 Bez stresu, bez lania wody i bez technicznego bełkotu. Jedna krótka rozmowa wystarczy, żeby sprawdzić, czy nasz system wideo marketingu sprawdzi się w Twojej branży.
              </p>
           </motion.div>

           {/* Right: Empty / Spacing for the background icon */}
           <div className="hidden lg:block h-[300px]" aria-hidden="true" />
        </div>

        {/* 3 Steps Vertical Flow */}
        <motion.div 
          className="relative space-y-10 md:space-y-16 mb-16 md:mb-28"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.1 }}
        >
           
           {/* Step 01 */}
           <motion.div 
             variants={itemVariants}
             className="group relative flex flex-col md:flex-row gap-6 md:gap-8 items-start"
           >
              <div className="flex-shrink-0 font-display text-4xl md:text-7xl text-white/15 tracking-tighter group-hover:text-accent/30 transition-all duration-500">01</div>
              <div className="flex-grow">
                 <h4 className="font-display text-[26px] md:text-[34px] text-white mb-4 md:mb-5 tracking-wide group-hover:text-accent transition-colors font-bold leading-[1.1]">Wypełnij Krótką Ankietę Kwalifikacyjną</h4>
                 <p className="font-sans text-white/70 text-base md:text-lg leading-relaxed max-w-3xl font-medium">
                    Szanujemy swój i Twój czas. Zanim porozmawiamy, chcę poznać Twoją obecną sytuację biznesową. Wypełniasz krótki formularz, w którym pytam m.in. o to, kto jest Twoim idealnym klientem, z jakimi obiekcjami walczysz najczęściej i jakim budżetem operujesz. To pozwala nam odsiać projekty, w których nie będziemy w stanie pomóc.
                 </p>
              </div>
           </motion.div>

           {/* Step 02 */}
           <motion.div 
             variants={itemVariants}
             className="group relative flex flex-col md:flex-row gap-6 md:gap-8 items-start"
           >
              <div className="flex-shrink-0 font-display text-4xl md:text-7xl text-white/15 tracking-tighter group-hover:text-accent/30 transition-all duration-500">02</div>
              <div className="flex-grow">
                 <h4 className="font-display text-[26px] md:text-[34px] text-white mb-4 md:mb-5 tracking-wide group-hover:text-accent transition-colors font-bold leading-[1.1]">Bezpłatna Konsultacja i Audyt (15–30 min)</h4>
                 <p className="font-sans text-white/70 text-base md:text-lg leading-relaxed max-w-3xl font-medium">
                    Wybierasz termin w kalendarzu. Zdzwaniamy się i na podstawie Twojej ankiety od razu przechodzimy do konkretów. Oceniam Twoją obecną komunikację i pokazuję, jak możemy opakować Twoją wiedzę w krótkie formy wideo (Rolki/Shorts), by zacząć generować zapytania od klientów premium. Jeśli nie widzę potencjału na zwrot z inwestycji – powiem Ci to wprost.
                 </p>
              </div>
           </motion.div>

           {/* Step 03 */}
           <motion.div 
             variants={itemVariants}
             className="group relative flex flex-col md:flex-row gap-6 md:gap-8 items-start"
           >
              <div className="flex-shrink-0 font-display text-4xl md:text-7xl text-white/15 tracking-tighter group-hover:text-accent/30 transition-all duration-500">03</div>
              <div className="flex-grow">
                 <h4 className="font-display text-[26px] md:text-[34px] text-white mb-4 md:mb-5 tracking-wide group-hover:text-accent transition-colors font-bold leading-[1.1]">Plan Wdrożeniowy i Start (Nagrania)</h4>
                 <p className="font-sans text-white/70 text-base md:text-lg leading-relaxed max-w-3xl font-medium">
                    Jeśli decydujemy się na współpracę, dopinamy formalności i od razu przejmujemy stery. W ciągu 3 dni przygotowuję dla Ciebie dedykowane scenariusze. Ustalamy termin Twojego przyjazdu do naszego studia Podcast Katowice (lub naszego przyjazdu do Ciebie ze sprzętem) i odpalamy cały proces produkcji. Ty tylko mówisz, my zajmuje się resztą.
                 </p>
              </div>
           </motion.div>

        </motion.div>
      </div>
    </section>
  )
}
