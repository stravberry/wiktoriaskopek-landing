"use client"

import { useParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import {
  ArrowRight,
  Play,
  Monitor,
  Film,
  Palette,
  Clock,
  Upload,
  ChevronDown,
  GraduationCap,
  BookOpen,
  Award,
  Users,
} from "lucide-react"
import type { Locale } from "@/lib/translations"
import SubpageNav from "@/components/subpage-nav"
import { useState } from "react"

export default function KursyOnlinePage() {
  const params = useParams()
  const lang = (params.lang as Locale) || "pl"
  const isEnglish = lang === "en"
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const offers = [
    {
      icon: Play,
      title: isEnglish ? "Lesson Recording" : "Nagranie lekcji",
      desc: isEnglish ? "Modules or complete courses" : "Modułów lub całych kursów",
    },
    {
      icon: Monitor,
      title: isEnglish ? "4K Quality" : "Jakość 4K",
      desc: isEnglish ? "Professional sound and image" : "Profesjonalny dźwięk i obraz",
    },
    {
      icon: Film,
      title: isEnglish ? "Modular Editing" : "Montaż modułowy",
      desc: isEnglish ? "Lessons, graphics, subtitles" : "Lekcje, grafiki, napisy, plansze",
    },
    {
      icon: Clock,
      title: isEnglish ? "Fast Production" : "Szybka realizacja",
      desc: isEnglish ? "Complete course in 1-2 days" : "Cały kurs w 1-2 dni",
    },
    {
      icon: Upload,
      title: isEnglish ? "Platform Ready" : "Gotowe na platformy",
      desc: isEnglish ? "Udemy, Thinkific, WebToLearn" : "Udemy, Thinkific, WebToLearn",
    },
    {
      icon: Palette,
      title: isEnglish ? "Sales Video" : "Wideo sprzedażowe",
      desc: isEnglish ? "Course trailer included" : "Trailer kursu w pakiecie",
    },
  ]

  const timeline = [
    {
      step: "01",
      title: isEnglish ? "Planning" : "Planowanie",
      desc: isEnglish ? "Mapping course structure and modules" : "Mapowanie struktury kursu i modułów",
    },
    {
      step: "02",
      title: isEnglish ? "Preparation" : "Przygotowanie",
      desc: isEnglish ? "Scripts and graphic materials" : "Scenariusze i materiały graficzne",
    },
    {
      step: "03",
      title: isEnglish ? "Recording Session" : "Sesja nagraniowa",
      desc: isEnglish ? "All lessons recorded in 1-2 days" : "Nagranie wszystkich lekcji w 1-2 dni",
    },
    {
      step: "04",
      title: isEnglish ? "Modular Editing" : "Montaż modułowy",
      desc: isEnglish ? "Division into lessons with graphics" : "Podział na lekcje z grafikami",
    },
    {
      step: "05",
      title: isEnglish ? "Delivery" : "Dostawa",
      desc: isEnglish ? "Materials ready for publication" : "Materiały gotowe do publikacji",
    },
  ]

  const faqs = [
    {
      q: isEnglish ? "How many lessons can I record in one day?" : "Ile lekcji mogę nagrać w jeden dzień?",
      a: isEnglish
        ? "Typically 8-12 lessons depending on their length. Short 5-10 minute lessons allow for more recordings, while longer 20-30 minute modules may require more time. We plan the schedule individually."
        : "Zazwyczaj 8-12 lekcji w zależności od ich długości. Krótkie 5-10 minutowe lekcje pozwalają nagrać więcej, dłuższe 20-30 minutowe moduły mogą wymagać więcej czasu. Harmonogram planujemy indywidualnie.",
    },
    {
      q: isEnglish ? "Can I record a course in multiple sessions?" : "Czy mogę nagrać kurs w kilku sesjach?",
      a: isEnglish
        ? "Yes, absolutely. Many creators prefer to spread recordings over several sessions to maintain freshness and energy. We can schedule sessions weekly or monthly as needed."
        : "Tak, oczywiście. Wielu twórców preferuje rozłożenie nagrań na kilka sesji, aby zachować świeżość i energię. Możemy zaplanować sesje co tydzień lub co miesiąc według potrzeb.",
    },
  ]

  return (
    <div className="min-h-screen bg-black">
      <SubpageNav lang={lang} />

      {/* Hero Section with Education Animation */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Background - Education Theme */}
        <div className="absolute inset-0">
          {/* Graduation Cap Animation */}
          <div className="absolute top-1/4 right-1/4 opacity-20">
            <div className="relative" style={{ animation: "float 6s ease-in-out infinite" }}>
              <GraduationCap className="w-32 h-32 text-accent" strokeWidth={1} />
            </div>
          </div>

          {/* Floating Books */}
          <div className="absolute bottom-1/3 left-1/5 opacity-15">
            <div style={{ animation: "float 8s ease-in-out infinite 1s" }}>
              <BookOpen className="w-24 h-24 text-white" strokeWidth={1} />
            </div>
          </div>

          {/* Certificate/Award */}
          <div className="absolute top-1/3 left-1/4 opacity-15">
            <div style={{ animation: "float 7s ease-in-out infinite 2s" }}>
              <Award className="w-20 h-20 text-accent" strokeWidth={1} />
            </div>
          </div>

          {/* Animated Progress Circles - Learning Progress */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full border border-accent/20"
                style={{
                  width: `${200 + i * 120}px`,
                  height: `${200 + i * 120}px`,
                  top: `${-(100 + i * 60)}px`,
                  left: `${-(100 + i * 60)}px`,
                  animation: `spin ${20 + i * 5}s linear infinite ${i % 2 === 0 ? "" : "reverse"}`,
                  opacity: 0.3 - i * 0.05,
                }}
              >
                {/* Progress dots on circles */}
                <div className="absolute w-3 h-3 bg-accent rounded-full" style={{ top: "50%", left: "-6px" }} />
              </div>
            ))}
          </div>

          {/* Module Blocks - Floating */}
          {[...Array(6)].map((_, i) => (
            <div
              key={`module-${i}`}
              className="absolute border border-white/10 bg-white/5 backdrop-blur-sm"
              style={{
                width: `${40 + Math.random() * 30}px`,
                height: `${40 + Math.random() * 30}px`,
                top: `${15 + Math.random() * 70}%`,
                left: `${10 + Math.random() * 80}%`,
                animation: `float ${5 + Math.random() * 4}s ease-in-out infinite ${Math.random() * 3}s`,
                opacity: 0.3,
              }}
            />
          ))}

          {/* Knowledge Flow Lines */}
          <svg className="absolute inset-0 w-full h-full opacity-10" preserveAspectRatio="none">
            <defs>
              <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="transparent" />
                <stop offset="50%" stopColor="#FF6600" />
                <stop offset="100%" stopColor="transparent" />
              </linearGradient>
            </defs>
            {[...Array(5)].map((_, i) => (
              <line
                key={`line-${i}`}
                x1="0%"
                y1={`${20 + i * 15}%`}
                x2="100%"
                y2={`${25 + i * 15}%`}
                stroke="url(#lineGradient)"
                strokeWidth="1"
                style={{
                  animation: `slideRight ${8 + i}s linear infinite`,
                  animationDelay: `${i * 0.5}s`,
                }}
              />
            ))}
          </svg>
        </div>

        {/* Content */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12">
          <div className="flex flex-col items-start">
            <span className="text-accent font-mono text-xs tracking-[0.3em] mb-4 opacity-80">
              {isEnglish ? "E-LEARNING PRODUCTION" : "PRODUKCJA E-LEARNING"}
            </span>

            {/* Main Title */}
            <h1 className="font-display text-[12vw] md:text-[10vw] lg:text-[8rem] text-white leading-[0.85] tracking-tighter mb-6">
              KURSY
              <br />
              <span className="text-accent">ONLINE</span>
            </h1>

            <p className="text-white/50 font-mono text-sm md:text-base max-w-lg mb-8 leading-relaxed">
              {isEnglish
                ? "We create complete online courses - from recording lessons to preparing materials ready for e-learning platforms."
                : "Tworzymy kompletne kursy online - od nagrania lekcji po przygotowanie materiałów gotowych do umieszczenia na platformach e-learningowych."}
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="#kontakt"
                className="group inline-flex items-center gap-3 px-8 py-4 bg-accent text-black font-mono text-sm tracking-wider hover:bg-white transition-colors duration-300"
              >
                {isEnglish ? "BOOK A DATE" : "REZERWUJ TERMIN"}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Target Audience Badge */}
            <div className="mt-12 flex items-center gap-3 text-white/40 font-mono text-xs">
              <Users className="w-4 h-4 text-accent" />
              <span>
                {isEnglish
                  ? "For trainers, experts and training companies"
                  : "Dla trenerów, ekspertów i firm szkoleniowych"}
              </span>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <span className="text-white/30 font-mono text-xs tracking-widest">SCROLL</span>
          <div className="w-px h-12 bg-gradient-to-b from-accent to-transparent" />
        </div>
      </section>

      {/* Offer Section */}
      <section className="py-24 md:py-32 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-16">
            <div>
              <span className="text-accent font-mono text-xs tracking-widest mb-4 block">
                {isEnglish ? "WHAT WE OFFER" : "CO OFERUJEMY?"}
              </span>
              <h2 className="text-4xl md:text-6xl font-display text-white">
                {isEnglish ? "Complete Course" : "Kompletny kurs"}
                <br />
                <span className="text-white/30">{isEnglish ? "Production" : "w Twoich rękach"}</span>
              </h2>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {offers.map((offer, index) => (
              <div
                key={index}
                className="group relative p-8 border border-white/10 bg-white/[0.02] hover:border-accent/50 transition-all duration-500"
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />

                <offer.icon className="w-10 h-10 text-accent mb-6" strokeWidth={1.5} />
                <h3 className="text-xl font-display text-white mb-2">{offer.title}</h3>
                <p className="text-white/50 font-mono text-sm">{offer.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Studio Section */}
      <section className="py-24 md:py-32 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-accent font-mono text-xs tracking-widest mb-4 block">
                {isEnglish ? "OUR STUDIO" : "NASZE STUDIO"}
              </span>
              <h2 className="text-4xl md:text-5xl font-display text-white mb-6">
                {isEnglish ? "Professional" : "Profesjonalne"}
                <br />
                <span className="text-accent">{isEnglish ? "Recording Space" : "przestrzeń nagraniowa"}</span>
              </h2>
              <p className="text-white/60 font-mono text-sm leading-relaxed mb-8">
                {isEnglish
                  ? "Our studio in Katowice is equipped with professional lighting, 4K cameras, and acoustic treatment. We create the perfect environment for your course recordings - comfortable and stress-free."
                  : "Nasze studio w Katowicach jest wyposażone w profesjonalne oświetlenie, kamery 4K i akustykę. Tworzymy idealne środowisko do nagrywania kursów - komfortowe i bezstresowe."}
              </p>
              <div className="flex gap-8">
                <div>
                  <div className="text-3xl font-display text-accent">4K</div>
                  <div className="text-white/40 font-mono text-xs">{isEnglish ? "Video Quality" : "Jakość wideo"}</div>
                </div>
                <div>
                  <div className="text-3xl font-display text-accent">1-2</div>
                  <div className="text-white/40 font-mono text-xs">
                    {isEnglish ? "Days to record" : "Dni na nagranie"}
                  </div>
                </div>
                <div>
                  <div className="text-3xl font-display text-accent">100%</div>
                  <div className="text-white/40 font-mono text-xs">{isEnglish ? "Ready files" : "Gotowe pliki"}</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="aspect-[4/3] relative overflow-hidden">
                <Image
                  src="/images/dsc6092-enhanced-nr.jpg"
                  alt="Studio nagrań kursów online"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              </div>
              <div className="absolute -bottom-4 -right-4 w-32 h-32 border border-accent/30" />
              <div className="absolute -top-4 -left-4 w-24 h-24 border border-white/10" />
            </div>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-24 md:py-32 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center mb-16">
            <span className="text-accent font-mono text-xs tracking-widest mb-4 block">
              {isEnglish ? "THE PROCESS" : "JAK WYGLĄDA REALIZACJA?"}
            </span>
            <h2 className="text-4xl md:text-6xl font-display text-white">
              {isEnglish ? "From Idea to" : "Od pomysłu do"}
              <br />
              <span className="text-white/30">{isEnglish ? "Published Course" : "gotowego kursu"}</span>
            </h2>
          </div>

          <div className="relative">
            {/* Timeline Line */}
            <div className="hidden md:block absolute top-8 left-0 right-0 h-px bg-white/10" />

            <div className="grid md:grid-cols-5 gap-8">
              {timeline.map((item, index) => (
                <div key={index} className="relative">
                  {/* Step Number */}
                  <div className="relative z-10 w-16 h-16 rounded-full border-2 border-accent bg-black flex items-center justify-center mb-6 mx-auto md:mx-0">
                    <span className="text-accent font-mono text-lg">{item.step}</span>
                  </div>

                  <h3 className="text-xl font-display text-white mb-2 text-center md:text-left">{item.title}</h3>
                  <p className="text-white/50 font-mono text-sm text-center md:text-left">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 md:py-32 border-t border-white/10">
        <div className="max-w-3xl mx-auto px-6 md:px-12">
          <div className="text-center mb-16">
            <span className="text-accent font-mono text-xs tracking-widest mb-4 block">FAQ</span>
            <h2 className="text-4xl md:text-5xl font-display text-white">
              {isEnglish ? "Common Questions" : "Najczęściej zadawane"}
              <br />
              <span className="text-white/30">{isEnglish ? "Answered" : "pytania"}</span>
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="border border-white/10 bg-white/[0.02]">
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full flex items-center justify-between p-6 text-left"
                >
                  <span className="text-white font-display text-lg pr-4">{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-accent flex-shrink-0 transition-transform duration-300 ${openFaq === index ? "rotate-180" : ""}`}
                  />
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ${openFaq === index ? "max-h-96" : "max-h-0"}`}
                >
                  <p className="px-6 pb-6 text-white/60 font-mono text-sm leading-relaxed">{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="kontakt" className="py-24 md:py-32 border-t border-white/10 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-accent/20 rounded-full" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-white/10 rounded-full" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-6 md:px-12 text-center">
          <span className="text-accent font-mono text-xs tracking-widest mb-4 block">
            {isEnglish ? "LET'S START" : "GOTOWY NA START?"}
          </span>
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-display text-white mb-6">
            {isEnglish ? "Create Your Course" : "Stwórz swój kurs"}
          </h2>
          <p className="text-white/60 font-mono text-sm md:text-base max-w-xl mx-auto mb-10">
            {isEnglish
              ? "Contact us to discuss project details and get an individual quote."
              : "Skontaktuj się z nami, aby omówić szczegóły projektu i otrzymać indywidualną wycenę."}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={`/${lang}/konsultacje`}
              className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-accent text-black font-mono text-sm tracking-wider hover:bg-white transition-colors duration-300"
            >
              {isEnglish ? "BOOK A DATE" : "ZAREZERWUJ TERMIN"}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="#contact"
              className="group inline-flex items-center justify-center gap-3 px-8 py-4 border border-white/20 text-white font-mono text-sm tracking-wider hover:border-accent hover:text-accent transition-colors duration-300"
            >
              {isEnglish ? "CONTACT" : "SKONTAKTUJ SIĘ"}
            </Link>
          </div>
        </div>
      </section>

      {/* Keyframes */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes slideRight {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  )
}
