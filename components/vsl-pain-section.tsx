"use client"

import { useEffect, useRef, useState } from "react"
import { X, Check, ArrowRight } from "lucide-react"

const painPoints = [
  {
    pains: [
      "Jesteś niewidoczny w internecie, a konkurencja zgarnia Twoich klientów.",
      "Żyjesz z poleceń i nie masz pojęcia, czy w przyszłym miesiącu pojawią się nowe zlecenia. Masz świetny produkt, ale problem z przewidywalnym napływem zapytań.",
    ],
    solution:
      "Budujemy Twoją silną markę osobistą przez wysokiej jakości wideo i kompleksowy marketing. Zyskujesz stały, przewidywalny napływ zapytań od osób, które od pierwszej sekundy widzą w Tobie niepodważalny autorytet w branży.",
  },
  {
    pains: [
      "Tracisz godziny na bezowocnych callach, tłumacząc klientom od zera to samo i wyjaśniając, dlaczego Twoja usługa tyle kosztuje.",
      "Twoja obecna strona to zwykła \"wizytówka\", która niczego nie sprzedaje, bo niedoedukowani ludzie nie rozumieją pełnej wartości Twojej oferty.",
    ],
    solution: (
      <>
        Projektujemy dla Ciebie profesjonalne, wysoko konwertujące strony internetowe, sklepy (e-commerce) lub dedykowane Landing Page z Wideo Sprzedażowym (VSL). Nasze rozwiązania webowe wykonują czarną robotę i edukują klienta za Ciebie 24/7. Rozmawiasz tylko z osobami, które poznały cały proces współpracy, ufają Ci i są gotowe kupić.
        <span className="block mt-2 text-[10px] md:text-xs opacity-50 font-normal">
          We współpracy z <a href="https://webdkw.net" target="_blank" rel="noopener noreferrer" className="underline hover:text-accent transition-colors">Webdkw.net</a>
        </span>
      </>
    ),
  },
  {
    pains: [
      "Chcesz zacząć nagrywać, ale paraliżuje Cię kamera.",
      "Nie masz czasu na wymyślanie postów, nie wiesz, co faktycznie konwertuje, brakuje Ci sprzętu albo boisz się, że nagrania będą wyglądać amatorsko.",
    ],
    solution:
      "Zdejmujemy z Ciebie cały techniczny i kreatywny ciężar. Dostajesz gotową strategię i napisane scenariusze. Wchodzisz do naszego bezpiecznego studia (lub my przyjeżdżamy do Ciebie ze sprzętem). Mamy prompter, reżyserujemy Cię, ucinamy lanie wody i profesjonalnie montujemy materiał. Ty czujesz pełne zaopiekowanie i po prostu jesteś ekspertem.",
  },
  {
    pains: [
      "Musisz zaniżać ceny, walczyć z konkurencją na portalach ogłoszeniowych i udowadniać, że Twoja usługa jest lepsza od najtańszych rynkowych ofert. Klient widzi w Tobie tylko \"wykonawcę\".",
    ],
    solution:
      "Przestajesz konkurować ceną i sprzedawać suche \"usługi\". Sprzedajesz konkretną transformację. Oprawiamy Twoją wiedzę w elegancki wideo marketing, wyciągamy samo \"mięso\" i ustawiamy kampanie reklamowe tak, że klient od razu pojmuje wartość Twojej pracy i bez problemu płaci Ci wyższe stawki.",
  },
]

export default function VslPainSection() {
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
      className="relative py-12 md:py-16 overflow-hidden border-t border-white/5 bg-[#050505]"
      aria-labelledby="pain-section-title"
    >
      {/* Background Visual Transformation Cues: Massive X and Check */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden" aria-hidden="true">
         {/* Massive artistic Red X on the left - Scale for mobile */}
         <div className="absolute left-[-20%] md:left-[-10%] top-1/2 -translate-y-1/2 opacity-[0.02] text-red-600 blur-[2px]">
            <X size="80vw" md-size="60vw" className="scale-[1.2] md:scale-100" strokeWidth={0.5} />
         </div>
         {/* Massive artistic Green Check on the right - Scale for mobile */}
         <div className="absolute right-[-20%] md:right-[-10%] top-1/2 -translate-y-1/2 opacity-[0.02] text-emerald-500 blur-[2px]">
            <Check size="80vw" md-size="60vw" className="scale-[1.2] md:scale-100" strokeWidth={0.5} />
         </div>
      </div>

      {/* Decorative Orbs */}
      <div className="absolute top-1/4 left-0 w-64 md:w-[500px] h-64 md:h-[500px] bg-red-600/5 blur-[100px] rounded-full -translate-x-1/2" aria-hidden="true" />
      <div className="absolute bottom-1/4 right-0 w-64 md:w-[600px] h-64 md:h-[600px] bg-emerald-600/5 blur-[100px] rounded-full translate-x-1/2" aria-hidden="true" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8">
        
        {/* Header Section */}
        <div className="mb-12 md:mb-20 text-center">
          <h2 id="pain-section-title" className="font-display text-[clamp(2.2rem,7vw,3.8rem)] leading-[0.9] text-white tracking-tight mb-6">
            KONIEC Z <br /> 
            <span
              style={{
                background: "linear-gradient(135deg, #ff3b3b, #ff6600)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              FRUSTRACJĄ
            </span>
          </h2>
          <p className="font-sans font-medium text-white/70 text-base md:text-xl tracking-wide max-w-3xl mx-auto">
            Znasz ten scenariusz? Zamień chaos i niskie stawki na <span className="underline decoration-accent underline-offset-4 decoration-2">przewidywalny system premium</span> i przejdź z punktu A do punktu B.
          </p>
        </div>

        {/* The Transformation Split Layout */}
        <div className="relative">
          
          {/* Central Connecting Axis (Desktop only) */}
          <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 shadow-[0_0_20px_rgba(255,255,255,0.05)]" aria-hidden="true">
            <div className="h-full w-full bg-gradient-to-b from-red-500/30 via-white/10 to-emerald-500/30" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)]" />
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
          </div>

          <div className="space-y-10 md:space-y-20">
            {painPoints.map((item, i) => (
              <div 
                key={i} 
                className={`grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-16 items-center transition-all duration-1000`}
                style={{
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? "translateY(0)" : "translateY(40px)",
                  transitionDelay: `${i * 100}ms`
                }}
              >
                
                {/* LEFT: PAIN */}
                <div className="lg:text-right relative">
                  <div className="p-5 md:p-8 lg:pr-6 border border-white/[0.04] lg:border-none rounded-2xl bg-white/[0.02] lg:bg-transparent shadow-xl">
                    <div className="inline-flex items-center gap-2 mb-4 lg:flex-row-reverse">
                       <span className="font-display text-xs md:text-sm tracking-widest text-red-400 uppercase opacity-80">Obecna Sytuacja</span>
                    </div>
                    
                    <div className="space-y-4 md:space-y-6">
                      {item.pains.map((pain, j) => (
                        <div key={j} className="flex lg:flex-row-reverse gap-3 items-start translate-x-0 transition-transform duration-300">
                          <X className="w-5 h-5 text-red-500/40 flex-shrink-0 mt-0.5" strokeWidth={3} aria-hidden="true" />
                          <p className="text-white/70 text-base md:text-lg font-medium leading-relaxed font-sans text-left lg:text-right">
                            {pain}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* RIGHT: SOLUTION */}
                <div className="relative">
                  <div className="lg:pl-4">
                    <div className="p-5 md:p-8 lg:pl-10 border border-emerald-500/10 lg:border-none rounded-2xl bg-emerald-500/[0.04] lg:bg-transparent shadow-emerald-900/10 shadow-2xl">
                       <span className="font-display text-xs md:text-sm tracking-widest text-emerald-400 uppercase opacity-80 mb-4 block">Twoja Przyszłość</span>
                       
                       <div className="flex flex-col gap-6 md:gap-12">
                         <div className="flex gap-3 md:gap-4 items-start">
                           <div className="mt-1 flex-shrink-0 w-6 h-6 md:w-8 md:h-8 rounded-lg border border-emerald-500/20 flex items-center justify-center bg-emerald-500/10">
                             <Check className="w-4 h-4 md:w-5 md:h-5 text-emerald-500" strokeWidth={3} aria-hidden="true" />
                           </div>
                           <p className="text-white/95 text-base md:text-xl font-bold leading-relaxed font-sans">
                             {item.solution}
                           </p>
                         </div>
                       </div>
                    </div>
                  </div>
                </div>

              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  )
}
