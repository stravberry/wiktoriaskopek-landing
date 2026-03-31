"use client"

import Image from "next/image"
import { ArrowRight, Star, ShieldCheck } from "lucide-react"
import { motion } from "framer-motion"

export default function VslAboutSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
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
        stiffness: 80,
        damping: 15,
        duration: 0.8,
      },
    },
  } as const

  return (
    <section
      className="relative py-12 md:py-16 overflow-hidden bg-[#050505]"
      aria-labelledby="about-title"
    >
      {/* Massive Background Text Decoration */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none opacity-[0.02]" aria-hidden="true">
        <span className="font-display text-[18vw] leading-none text-white uppercase tracking-tighter">
          WIKTORIA
        </span>
      </div>

      {/* Decorative Orbs */}
      <div className="absolute top-1/4 right-[5%] w-48 md:w-64 h-48 md:h-64 bg-accent/5 blur-[100px] rounded-full pointer-events-none" aria-hidden="true" />
      <div className="absolute bottom-1/4 left-[5%] w-48 md:w-64 h-48 md:h-64 bg-accent/5 blur-[100px] rounded-full pointer-events-none" aria-hidden="true" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8">
        
        {/* Header Area */}
        <motion.div 
           className="flex flex-col mb-8 md:mb-12"
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           transition={{ duration: 0.8 }}
        >
           <span className="font-display text-accent text-[10px] md:text-sm tracking-[.3em] uppercase inline-block mb-6 md:mb-8 opacity-80 font-bold">
              Kim jestem
           </span>
           <h2 id="about-title" className="font-display text-[clamp(2.5rem,10vw,4.5rem)] leading-[0.85] text-white tracking-tighter mb-4 px-4 md:px-0">
              WIKTORIA <br />
              <span
                style={{
                  background: "linear-gradient(135deg, #ff6600, #ff8533)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                SKOPEK
              </span>
           </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.6fr] gap-10 md:gap-14 items-start">
          
          {/* Left Side: Professional Profile Container */}
          <motion.div 
            className="relative group max-w-sm mx-auto lg:max-w-none lg:mx-0"
            initial={{ opacity: 0, scale: 0.8, rotate: -2 }}
            whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, type: "spring", stiffness: 40 }}
          >
            <div 
              className="aspect-[4/5] rounded-2xl md:rounded-3xl border border-white/[0.08] bg-[#0a0a0a] overflow-hidden relative"
              style={{
                background: "linear-gradient(165deg, rgba(255,102,0,0.05), #0a0a0a 60%)",
              }}
            >
               {/* Professional Portrait */}
               <div className="absolute inset-0">
                  <Image 
                    src="/images/wiktoria-skopek.jpg"
                    alt="Portret Wiktorii Skopek - Partnera Strategicznego"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-1000"
                    priority
                  />
               </div>
               
               {/* Overlay Decorative Tags */}
               <div className="absolute bottom-4 md:bottom-6 left-4 md:left-6 right-4 md:right-6 flex flex-col gap-2 md:gap-3" aria-hidden="true">
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.8, duration: 0.6 }}
                    className="px-3 md:px-4 py-1.5 md:py-2 rounded-full border border-white/10 bg-black/40 backdrop-blur-md backdrop-filter inline-flex items-center gap-2 self-start"
                  >
                     <ShieldCheck className="w-3 md:w-4 h-3 md:h-4 text-accent" />
                     <span className="font-sans text-[8px] md:text-[10px] text-white/90 uppercase tracking-widest font-bold">Partner Strategiczny</span>
                  </motion.div>
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 1, duration: 0.6 }}
                    className="px-3 md:px-4 py-1.5 md:py-2 rounded-full border border-white/10 bg-black/40 backdrop-blur-md backdrop-filter inline-flex items-center gap-2 self-start"
                  >
                     <Star className="w-3 md:w-4 h-3 md:h-4 text-accent" />
                     <span className="font-sans text-[8px] md:text-[10px] text-white/90 uppercase tracking-widest font-bold">Mindset & Video</span>
                  </motion.div>
               </div>
            </div>
          </motion.div>

          {/* Right Side: Editorial Bio */}
          <motion.div 
            className="flex flex-col gap-6 md:gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
          >
            <motion.p 
              variants={itemVariants}
              className="text-white text-base md:text-xl leading-relaxed font-sans font-medium tracking-tight px-4 md:px-0"
            >
              Nie jestem <span className="font-sans italic text-white/60">&ldquo;agencją od wrzucania postów za 400 zł&rdquo;</span>. 
              Jestem Twoim <span className="text-accent underline decoration-accent/40 underline-offset-8 decoration-2 font-bold">partnerem strategicznym</span>, który bierze na siebie pełną odpowiedzialność za proces pozyskiwania Twoich klientów.
            </motion.p>

            <div className="space-y-6 md:space-y-8 px-4 md:px-0">
              <motion.p 
                variants={itemVariants}
                className="text-white/80 text-base md:text-lg leading-relaxed font-sans font-medium"
              >
                Mój &ldquo;main core&rdquo; to coś znacznie więcej niż same social media. Łączę produkcję wideo premium, doradztwo biznesowe i pracę nad Twoim mindsetem. Wiem, że wystąpienia przed kamerą potrafią stresować. Dlatego pracuję z Tobą na planie, pomagam przełamać blokady psychologiczne – nawet jeśli jesteś introwertykiem – i pokazuję, że z odpowiednim wsparciem nagrywanie staje się proste.
              </motion.p>

              <motion.p 
                variants={itemVariants}
                className="text-white/70 text-base md:text-lg leading-relaxed font-sans border-l-2 border-accent/30 pl-4 md:pl-6 font-medium"
              >
                Działam ze sprawdzonym zespołem ekspertów (od operatorów i montażystów, po specjalistów od sprzedaży). Dzięki temu dostarczam Ci kompletny system &ldquo;Plug & Play&rdquo;. Ty wchodzisz do studia i dzielisz się swoją wiedzą, a my ucinamy &ldquo;lanie wody&rdquo; i przekuwamy to w zyskowne formaty wideo (Rolki i VSL).
              </motion.p>

              <motion.div 
                variants={itemVariants}
                className="p-6 md:p-8 rounded-2xl border border-white/[0.08] bg-white/[0.04] relative overflow-hidden group hover:border-accent/40 transition-all duration-500 shadow-xl"
              >
                 <div className="relative z-10">
                    <h4 className="font-display text-accent text-lg md:text-xl tracking-widest uppercase mb-4 font-bold opacity-90">Wynik Współpracy</h4>
                    <p className="text-white/80 text-base md:text-lg leading-relaxed font-sans mb-0 font-medium">
                      Efekt? Twoje wideo edukuje rynek za Ciebie 24/7. Przestajesz tłumaczyć każdemu klientowi od zera, czym się zajmujesz, a Twoja marka staje się realnym silnikiem napędzającym sprzedaż usług High-Ticket.
                    </p>
                 </div>
                 {/* Subtle inner highlight */}
                 <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity" aria-hidden="true">
                    <ArrowRight className="w-6 md:w-8 h-6 md:h-8 text-accent" />
                 </div>
              </motion.div>
            </div>
            
            {/* Bottom Accent Bar */}
            <motion.div 
              variants={itemVariants}
              className="mt-8 flex flex-col md:flex-row items-center justify-between gap-6 border-t border-white/10 pt-10 px-4 md:px-0"
            >
               <div className="flex items-center gap-4">
                  <div className="flex -space-x-2" aria-hidden="true">
                     <div className="w-8 h-8 rounded-full bg-accent/30 border border-white/15 flex items-center justify-center text-[8px] font-bold">WS</div>
                     <div className="w-8 h-8 rounded-full bg-accent/50 border border-white/15 flex items-center justify-center text-[8px] font-bold">P&P</div>
                  </div>
                  <span className="font-sans text-[8px] md:text-[10px] text-white/50 uppercase tracking-[.2em] font-bold">Strategia • Realizacja • Wyniki</span>
               </div>
               
               <a href="#contact" className="group flex items-center gap-2 font-display text-xs md:text-sm text-white/90 hover:text-accent transition-colors tracking-widest uppercase font-bold" aria-label="Dowiedz się więcej o procesie współpracy">
                  Dowiedz się więcej <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
               </a>
            </motion.div>
          </motion.div>

        </div>

      </div>
    </section>
  )
}
