"use client"
import { useParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import {
  ArrowRight,
  Camera,
  Film,
  Clapperboard,
  MonitorPlay,
  Scissors,
  BarChart3,
  ChevronDown,
  Play,
} from "lucide-react"
import type { Locale } from "@/lib/translations"
import SubpageNav from "@/components/subpage-nav"
import { useState, useEffect } from "react"

export default function YouTubePage() {
  const params = useParams()
  const lang = (params.lang as Locale) || "pl"
  const isEnglish = lang === "en"
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const offers = [
    {
      icon: Camera,
      title: isEnglish ? "Solo or guest episodes" : "Odcinki solo lub z gościem",
      description: isEnglish
        ? "Recording talking-head episodes with professional setup"
        : "Realizacja odcinków mówionych do kamery",
    },
    {
      icon: Clapperboard,
      title: isEnglish ? "Custom scenography" : "Scenografia dopasowana",
      description: isEnglish ? "Neutral, business or lifestyle backgrounds" : "Neutralne, biznesowe lub lifestyle tła",
    },
    {
      icon: Film,
      title: isEnglish ? "4K multi-camera" : "Nagranie 4K z kilku kamer",
      description: isEnglish ? "Broadcast microphones and studio lighting" : "Dźwięk broadcastowy i światło studyjne",
    },
    {
      icon: Scissors,
      title: isEnglish ? "YouTube-style editing" : "Montaż w stylu YouTube",
      description: isEnglish ? "Dynamic cuts, graphics, shorts" : "Dynamiczne cięcia, grafiki, shorty",
    },
    {
      icon: MonitorPlay,
      title: isEnglish ? "Vertical versions" : "Wersje pionowe",
      description: isEnglish ? "Ready for Reels, TikTok, Shorts" : "Gotowe na Reels, TikTok, Shorts",
    },
    {
      icon: BarChart3,
      title: isEnglish ? "SEO optimization" : "Optymalizacja SEO",
      description: isEnglish ? "CTA, graphics, titles and descriptions" : "CTA, grafiki, tytuły i opisy",
    },
  ]

  const timeline = [
    {
      step: "01",
      title: isEnglish ? "Briefing" : "Briefing",
      description: isEnglish
        ? "We establish the video goal, target audience and style"
        : "Ustalamy cel wideo, grupę docelową i styl",
    },
    {
      step: "02",
      title: isEnglish ? "Script" : "Scenariusz",
      description: isEnglish ? "We prepare the structure and key points" : "Przygotowujemy strukturę i kluczowe punkty",
    },
    {
      step: "03",
      title: isEnglish ? "Production" : "Produkcja",
      description: isEnglish
        ? "Multi-camera recording in studio quality"
        : "Nagranie z kilku kamer w studyjnej jakości",
    },
    {
      step: "04",
      title: isEnglish ? "Editing" : "Montaż",
      description: isEnglish
        ? "Dynamic editing with graphics and captions"
        : "Dynamiczny montaż z grafikami i napisami",
    },
    {
      step: "05",
      title: isEnglish ? "Optimization" : "Optymalizacja",
      description: isEnglish ? "Preparing main version and shorts" : "Przygotowanie wersji głównej i shortów",
    },
  ]

  const faqs = [
    {
      question: isEnglish ? "Do you also prepare thumbnails?" : "Czy przygotujecie również miniatury?",
      answer: isEnglish
        ? "Yes, we create professional thumbnails optimized for YouTube algorithm and high CTR."
        : "Tak, tworzymy profesjonalne miniatury zoptymalizowane pod algorytm YouTube i wysokie CTR.",
    },
    {
      question: isEnglish ? "How long does production of one episode take?" : "Ile trwa produkcja jednego odcinka?",
      answer: isEnglish
        ? "Typically 5-7 business days from recording to final video, depending on the complexity of editing."
        : "Zazwyczaj 5-7 dni roboczych od nagrania do finalnego wideo, w zależności od złożoności montażu.",
    },
    {
      question: isEnglish ? "Can I get raw footage?" : "Czy mogę otrzymać surowy materiał?",
      answer: isEnglish
        ? "Yes, we can provide raw footage upon request as part of the package or for an additional fee."
        : "Tak, możemy udostępnić surowy materiał na życzenie w ramach pakietu lub za dodatkową opłatą.",
    },
  ]

  return (
    <div className="min-h-screen bg-black">
      <SubpageNav lang={lang} />

      {/* Hero Section with 3D Camera Animation */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          {/* Film strip effect */}
          <div className="absolute top-0 left-0 w-full h-16 bg-gradient-to-b from-black to-transparent z-20" />
          <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-black to-transparent z-20" />

          {/* Animated film frames */}
          {mounted && (
            <>
              <div className="absolute top-20 left-4 opacity-10">
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="w-8 h-12 border border-white/30 mb-2"
                    style={{
                      animation: `pulse 2s ease-in-out ${i * 0.2}s infinite`,
                    }}
                  />
                ))}
              </div>
              <div className="absolute top-20 right-4 opacity-10">
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="w-8 h-12 border border-white/30 mb-2"
                    style={{
                      animation: `pulse 2s ease-in-out ${i * 0.2 + 0.5}s infinite`,
                    }}
                  />
                ))}
              </div>
            </>
          )}

          {/* 3D Camera lens effect */}
          <div className="absolute top-1/2 right-1/4 -translate-y-1/2 hidden lg:block">
            {/* Outer lens ring */}
            <div
              className="w-72 h-72 rounded-full border-4 border-white/10 relative"
              style={{
                animation: mounted ? "spin 20s linear infinite" : "none",
              }}
            >
              {/* Lens aperture blades */}
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="absolute top-1/2 left-1/2 w-1 h-32 bg-gradient-to-b from-accent/30 to-transparent origin-bottom"
                  style={{
                    transform: `translate(-50%, -100%) rotate(${i * 45}deg)`,
                  }}
                />
              ))}

              {/* Inner lens */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full border-2 border-accent/30 flex items-center justify-center">
                <div
                  className="w-32 h-32 rounded-full bg-gradient-to-br from-accent/20 to-transparent"
                  style={{
                    animation: mounted ? "pulse 3s ease-in-out infinite" : "none",
                  }}
                />
                {/* Center dot */}
                <div className="absolute w-4 h-4 rounded-full bg-accent/50" />
              </div>
            </div>

            {/* Recording indicator */}
            <div
              className="absolute -top-4 -right-4 flex items-center gap-2 bg-red-600/20 px-3 py-1 rounded-full border border-red-500/30"
              style={{
                animation: mounted ? "pulse 1.5s ease-in-out infinite" : "none",
              }}
            >
              <div className="w-2 h-2 rounded-full bg-red-500" />
              <span className="text-red-400 font-mono text-xs">REC</span>
            </div>
          </div>

          {/* Floating video elements */}
          {mounted && (
            <>
              <div
                className="absolute top-1/4 left-1/4 text-white/5"
                style={{ animation: "float 6s ease-in-out infinite" }}
              >
                <Play className="w-24 h-24" />
              </div>
              <div
                className="absolute bottom-1/3 left-1/3 text-accent/10"
                style={{ animation: "float 8s ease-in-out infinite 1s" }}
              >
                <Film className="w-16 h-16" />
              </div>
              <div
                className="absolute top-1/3 right-1/3 text-white/5"
                style={{ animation: "float 7s ease-in-out infinite 0.5s" }}
              >
                <Clapperboard className="w-20 h-20" />
              </div>
            </>
          )}

          {/* Video timeline at bottom */}
          <div className="absolute bottom-32 left-1/2 -translate-x-1/2 w-3/4 max-w-2xl hidden md:block">
            <div className="h-1 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-accent/50 rounded-full"
                style={{
                  width: "60%",
                  animation: mounted ? "progress 4s ease-in-out infinite" : "none",
                }}
              />
            </div>
            <div className="flex justify-between mt-2 text-white/20 font-mono text-xs">
              <span>00:00</span>
              <span>●</span>
              <span>●</span>
              <span>●</span>
              <span>12:34</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12">
          <div className="flex flex-col items-start">
            {/* Label */}
            <span className="text-accent font-mono text-xs tracking-[0.3em] mb-4 opacity-80">
              {isEnglish ? "VIDEO PRODUCTION" : "PRODUKCJA WIDEO"}
            </span>

            {/* Main Title */}
            <h1 className="font-display text-white leading-[0.85] mb-6">
              <span
                className="block text-[15vw] md:text-[12vw] lg:text-[10rem]"
                style={{
                  WebkitTextStroke: "1px rgba(255,255,255,0.3)",
                  WebkitTextFillColor: "transparent",
                }}
              >
                YOUTUBE
              </span>
              <span className="block text-[8vw] md:text-[6vw] lg:text-[5rem] text-white mt-2">
                {isEnglish ? "EPISODES" : "ODCINKI"}
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-white/60 font-mono text-sm md:text-base max-w-md mb-8">
              {isEnglish
                ? "Professional YouTube episodes from Katowice studio for brands and creators"
                : "Eksperckie odcinki wideo z katowickiego studia dla marek i twórców"}
            </p>

            {/* CTA */}
            <Link
              href="#kontakt"
              className="group inline-flex items-center gap-3 px-8 py-4 bg-accent text-black font-mono text-sm hover:bg-white transition-colors"
            >
              {isEnglish ? "Book a date" : "Rezerwuj termin"}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/40">
          <span className="font-mono text-xs tracking-widest">SCROLL</span>
          <div className="w-px h-8 bg-gradient-to-b from-white/40 to-transparent" />
        </div>
      </section>

      {/* What We Offer Section */}
      <section className="py-24 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="mb-16">
            <span className="text-accent font-mono text-xs tracking-widest">{isEnglish ? "SERVICES" : "USŁUGI"}</span>
            <h2 className="text-4xl md:text-6xl font-display text-white mt-4">
              {isEnglish ? "What we offer?" : "Co oferujemy?"}
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {offers.map((offer, index) => (
              <div
                key={index}
                className="group p-8 border border-white/10 bg-white/[0.02] hover:border-accent/50 hover:bg-accent/5 transition-all duration-500"
              >
                <offer.icon className="w-10 h-10 text-accent mb-6 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-display text-white mb-3">{offer.title}</h3>
                <p className="text-white/60 font-mono text-sm leading-relaxed">{offer.description}</p>
              </div>
            ))}
          </div>

          {/* Target audience note */}
          <div className="mt-12 p-6 border-l-2 border-accent bg-accent/5">
            <p className="text-white/80 font-mono text-sm">
              {isEnglish
                ? "For experts, trainers, educational companies and YouTube channels that want professional production"
                : "Dla ekspertów, trenerów, firm edukacyjnych i kanałów YouTube, które chcą profesjonalnej produkcji"}
            </p>
          </div>
        </div>
      </section>

      {/* Studio Gallery */}
      <section className="py-24 border-t border-white/10 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="mb-16">
            <span className="text-accent font-mono text-xs tracking-widest">
              {isEnglish ? "OUR STUDIO" : "NASZE STUDIO"}
            </span>
            <h2 className="text-4xl md:text-6xl font-display text-white mt-4">
              {isEnglish ? "Where the magic happens" : "Gdzie dzieje się magia"}
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              "/images/img-5710.jpeg",
              "/images/img-5705.jpeg",
              "/images/img-5709.jpeg",
              "/images/dsc5980-enhanced-nr.jpg",
              "/images/dsc6092-enhanced-nr.jpg",
              "/images/img-2684.jpg",
            ].map((src, index) => (
              <div key={index} className="relative aspect-video overflow-hidden group">
                <Image
                  src={src || "/placeholder.svg"}
                  alt={`Studio ${index + 1}`}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />
                <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-white font-mono text-xs bg-accent/80 px-2 py-1">
                    {isEnglish ? `View ${index + 1}` : `Widok ${index + 1}`}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Timeline */}
      <section className="py-24 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="mb-16">
            <span className="text-accent font-mono text-xs tracking-widest">{isEnglish ? "PROCESS" : "PROCES"}</span>
            <h2 className="text-4xl md:text-6xl font-display text-white mt-4">
              {isEnglish ? "How does production look?" : "Jak wygląda realizacja?"}
            </h2>
          </div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-white/10 hidden md:block" />

            <div className="space-y-12 md:space-y-0">
              {timeline.map((item, index) => (
                <div
                  key={index}
                  className={`relative flex items-start gap-8 md:gap-16 ${
                    index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                >
                  {/* Content */}
                  <div className={`flex-1 ${index % 2 === 0 ? "md:text-right" : "md:text-left"}`}>
                    <div className="p-6 border border-white/10 bg-white/[0.02] hover:border-accent/30 transition-colors">
                      <span className="text-accent font-mono text-4xl font-bold">{item.step}</span>
                      <h3 className="text-2xl font-display text-white mt-2 mb-2">{item.title}</h3>
                      <p className="text-white/60 font-mono text-sm">{item.description}</p>
                    </div>
                  </div>

                  {/* Center dot */}
                  <div
                    className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-accent border-4 border-black"
                    style={{ top: "2rem" }}
                  />

                  {/* Spacer for alternating layout */}
                  <div className="flex-1 hidden md:block" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 border-t border-white/10">
        <div className="max-w-4xl mx-auto px-6 md:px-12">
          <div className="mb-16 text-center">
            <span className="text-accent font-mono text-xs tracking-widest">FAQ</span>
            <h2 className="text-4xl md:text-6xl font-display text-white mt-4">
              {isEnglish ? "Questions & Answers" : "Najczęściej zadawane pytania"}
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="border border-white/10 bg-white/[0.02] overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full p-6 flex items-center justify-between text-left hover:bg-white/[0.02] transition-colors"
                >
                  <span className="text-white font-display text-lg pr-4">{faq.question}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-accent transition-transform flex-shrink-0 ${
                      openFaq === index ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    openFaq === index ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <p className="px-6 pb-6 text-white/60 font-mono text-sm leading-relaxed">{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="kontakt" className="py-24 border-t border-white/10">
        <div className="max-w-4xl mx-auto px-6 md:px-12 text-center">
          <span className="text-accent font-mono text-xs tracking-widest">
            {isEnglish ? "LET'S START" : "ZACZYNAMY"}
          </span>
          <h2 className="text-4xl md:text-6xl font-display text-white mt-4 mb-6">
            {isEnglish ? "Ready to start?" : "Gotowy na start?"}
          </h2>
          <p className="text-white/60 font-mono text-sm md:text-base max-w-xl mx-auto mb-10">
            {isEnglish
              ? "Contact us to discuss the project details and receive an individual quote."
              : "Skontaktuj się z nami, aby omówić szczegóły projektu i otrzymać indywidualną wycenę."}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href={`/${lang}/konsultacje`}
              className="group inline-flex items-center gap-3 px-8 py-4 bg-accent text-black font-mono text-sm hover:bg-white transition-colors"
            >
              {isEnglish ? "Book a date" : "Zarezerwuj termin"}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a
              href="mailto:kontakt@podcastkatowice.pl"
              className="inline-flex items-center gap-3 px-8 py-4 border border-white/20 text-white font-mono text-sm hover:border-accent hover:text-accent transition-colors"
            >
              {isEnglish ? "Contact us" : "Skontaktuj się"}
            </a>
          </div>
        </div>
      </section>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        @keyframes progress {
          0%, 100% { width: 30%; }
          50% { width: 80%; }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
