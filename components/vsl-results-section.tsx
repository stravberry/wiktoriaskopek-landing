"use client"

import { Quote, ArrowUpRight, TrendingUp, CheckCircle2 } from "lucide-react"
import { motion } from "framer-motion"

const caseStudies = [
  {
    name: "Adrian Dębowiec",
    role: "Turbo Marketing",
    links: [
       { label: "Adriandebowiec.pl", href: "https://www.adriandebowiec.pl/" }
    ],
    quote: "Bardzo polecam Wiktorię. Jeśli tworzysz podcasty lub planujesz tworzyć kursy czy inne materiały edukacyjne, to podcastkatowice.pl to świetne miejsce. Zespół ma duże doświadczenie w montażu i oferuje kilka naprawdę przydatnych usług dodatkowych, m.in. wsparcie w tworzeniu contentu pod social media. Jakość realizacji stoi na bardzo wysokim poziomie. Na pewno nie będziecie żałować!",
    result: "Wysokiej jakości montaż edukacyjny i strategiczne wsparcie w content marketingu.",
  },
  {
    name: "ALEX MATOGA",
    role: "Ravedrone.com & Limitlesskrk.com",
    links: [
       { label: "Ravedrone.com", href: "https://ravedrone.com" },
       { label: "Limitlesskrk.com", href: "https://limitlesskrk.com" }
    ],
    quote: "Zdecydowanie polecam współpracę — pełen profesjonalizm na każdym etapie realizacji. Strony działają wzorowo, wszystko jest dopracowane i funkcjonuje bez zarzutu. Wszelkie poprawki są wdrażane bardzo szybko, co znacząco ułatwia cały proces. Na duży plus zasługuje również komunikacja oraz atmosfera — wszystko przebiega sprawnie, konkretnie i w bardzo przyjaznym tonie.",
    result: "Dopracowane w 100% platformy sprzedażowe i błyskawiczne wdrażanie optymalizacji.",
  },
  {
    name: "Paweł Węglarz",
    role: "Nutriglowup.pl",
    links: [
       { label: "Nutriglowup.pl", href: "https://nutriglowup.pl" }
    ],
    quote: "Wiktoria to osoba, którą wyróżnia niezwykła sumienność i konsekwencja – zawsze doprowadza sprawy do końca.",
    result: "Pełen profesjonalizm i dowożenie merytorycznych wyników od A do Z.",
  },
  {
    name: "Kamil S.",
    role: "Kancelaria Prawna",
    quote: "Długo zwlekałem z wejściem w wideo, bo bałem się, że to będzie sztuczne i 'telewizyjne'. Zespół Wiktorii pokazał mi, że da się to zrobić elegancko, merytorycznie i bez wstydu. Ich przygotowanie, praca z prompterem i reżyseria sprawiły, że nagrania okazały się banalne. Z 12 rolek, które wypuściliśmy w pierwszym rzucie, domknąłem 4 duże kontrakty na doradztwo prawne.",
    result: "4 domknięte kontrakty premium po pierwszej kampanii opartej na wideo.",
  },
]

export default function VslResultsSection() {
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
    hidden: { opacity: 0, y: 40 },
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
      className="relative py-12 md:py-16 overflow-hidden bg-[#050505]"
      aria-labelledby="results-title"
    >
      {/* Massive Background Text Decoration */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none opacity-[0.02]" aria-hidden="true">
        <span className="font-display text-[18vw] leading-none text-white uppercase tracking-tighter">
          SUKCES
        </span>
      </div>

      {/* Decorative Emerald Orbs */}
      <div className="absolute top-1/2 left-0 w-64 md:w-80 h-64 md:h-80 bg-emerald-500/5 blur-[100px] rounded-full pointer-events-none" aria-hidden="true" />
      <div className="absolute top-1/3 right-0 w-64 md:w-80 h-64 md:h-80 bg-emerald-500/5 blur-[100px] rounded-full pointer-events-none" aria-hidden="true" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8">
        
        {/* Header Area */}
        <motion.div 
           className="max-w-4xl mb-10 md:mb-16"
           initial={{ opacity: 0, y: 30 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: false }}
           transition={{ duration: 0.8 }}
        >
           <span className="font-sans text-emerald-500 text-xs md:text-sm tracking-[.3em] uppercase inline-block mb-6 md:mb-8 opacity-80 font-bold">
              Moje case studies
           </span>
           <h2 id="results-title" className="font-display text-[clamp(2.2rem,8vw,4.5rem)] leading-[0.85] text-white tracking-normal mb-8 px-4 md:px-0">
              <span
                style={{
                  background: "linear-gradient(135deg, #10b981, #34d399)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                REZULTATY
              </span>
           </h2>
           <p className="font-sans text-white/70 text-base md:text-xl leading-relaxed max-w-2xl px-4 md:px-0 font-medium">
              Efekty mówią same za siebie. Moi klienci zarabiają pieniądze, podnoszą stawki i odzyskują czas. To nie są teorie, tylko realne biznesy zbudowane dzięki systemowi wideo premium.
           </p>
        </motion.div>

        {/* Case Studies Grid (Stacks on mobile) */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {caseStudies.map((cs) => (
            <motion.div 
              key={cs.name}
              variants={itemVariants}
              className="group relative flex flex-col p-6 md:p-10 rounded-2xl md:rounded-3xl border border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.04] hover:border-emerald-500/40 transition-all duration-700 overflow-hidden shadow-2xl"
            >
               {/* Background Icon (Scaled for mobile) */}
               <div className="absolute top-4 right-4 md:top-6 md:right-6 opacity-[0.05] md:opacity-[0.08] group-hover:opacity-[0.12] group-hover:scale-110 transition-all duration-1000 transform origin-top-right" aria-hidden="true">
                  <TrendingUp className="w-32 md:w-48 h-32 md:h-48 text-emerald-500" strokeWidth={0.5} />
               </div>

               <div className="relative z-10 flex flex-col h-full">
                  {/* Quote Mark */}
                  <Quote className="w-6 md:w-8 h-6 md:h-8 text-emerald-500/30 mb-6" aria-hidden="true" />

                  <blockquote className="font-sans italic text-white/80 text-base md:text-lg leading-relaxed mb-8 flex-grow tracking-tight font-medium">
                    &ldquo;{cs.quote}&rdquo;
                  </blockquote>

                  <div className="mt-auto">
                     {/* Result Badge */}
                     <div className="flex items-start gap-3 mb-6 p-4 md:p-5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 group-hover:bg-emerald-500/10 transition-colors">
                        <CheckCircle2 className="w-4 md:w-5 h-4 md:w-5 text-emerald-500 mt-1 flex-shrink-0" aria-hidden="true" />
                        <div>
                           <span className="font-sans text-xs text-emerald-500 tracking-widest uppercase mb-1 block font-bold">Wynik</span>
                           <p className="font-sans text-base md:text-lg text-white/90 font-bold leading-snug">{cs.result}</p>
                        </div>
                     </div>

                     <div className="flex items-center justify-between">
                        <div>
                           <h4 className="font-display text-white text-[20px] md:text-[24px] tracking-wide group-hover:text-emerald-400 transition-colors font-bold">{cs.name}</h4>
                           
                           {/* Role / Links */}
                           <div className="flex flex-wrap gap-x-3 gap-y-1">
                              {cs.links ? (
                                 cs.links.map((link, idx) => (
                                    <a 
                                      key={link.label}
                                      href={link.href}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="font-sans text-xs md:text-sm text-emerald-500/60 hover:text-emerald-400 uppercase tracking-widest font-bold underline decoration-emerald-500/20 underline-offset-4 transition-all"
                                    >
                                       {link.label}
                                       {idx < cs.links!.length - 1 && <span className="ml-3 text-white/20">&</span>}
                                    </a>
                                 ))
                              ) : (
                                 <p className="font-sans text-xs md:text-sm text-white/50 uppercase tracking-widest font-bold">{cs.role}</p>
                              )}
                           </div>
                        </div>
                        <ArrowUpRight className="w-4 h-4 md:w-5 md:h-5 text-white/20 group-hover:text-emerald-500 transition-colors" aria-hidden="true" />
                     </div>
                  </div>
               </div>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  )
}
