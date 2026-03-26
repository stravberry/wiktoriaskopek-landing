"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { ArrowRight, ChevronDown, Mic, Headphones, Radio, Play, Volume2, AudioWaveform as Waveform } from "lucide-react"
import Image from "next/image"
import type { Locale } from "@/lib/translations"
import SubpageNav from "@/components/subpage-nav"

export default function PodcastyPage() {
  const params = useParams()
  const lang = (params.lang as Locale) || "pl"
  const isEnglish = lang === "en"
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  const offers = [
    {
      icon: Mic,
      text: isEnglish ? "Podcast production with 1-4 people" : "Realizacja podcastów z 1–4 osobami",
    },
    {
      icon: Play,
      text: isEnglish ? "High quality audio and 4K video" : "Wysokiej jakości dźwięk i obraz 4K",
    },
    {
      icon: Waveform,
      text: isEnglish ? "Script and questions preparation help" : "Pomoc w przygotowaniu scenariusza i pytań",
    },
    {
      icon: Radio,
      text: isEnglish ? "Record multiple episodes in one day" : "Możliwość nagrania serii odcinków jednego dnia",
    },
    {
      icon: Volume2,
      text: isEnglish ? "Editing, intro/outro, subtitles and thumbnails" : "Montaż, intro/outro, napisy i miniatury",
    },
    {
      icon: Headphones,
      text: isEnglish
        ? "Distribution on Spotify, YouTube, Apple Podcasts etc."
        : "Dystrybucja na Spotify, YouTube, Apple Podcasts itp.",
    },
  ]

  const steps = isEnglish
    ? [
        { number: "01", title: "Consultation", desc: "Together we determine format, theme and podcast goal" },
        { number: "02", title: "Preparation", desc: "We help prepare script and questions" },
        { number: "03", title: "Recording", desc: "Professional studio recording with full technical support" },
        { number: "04", title: "Post-production", desc: "Complete editing - graphics, video inserts, animations" },
        { number: "05", title: "Distribution", desc: "Publishing on selected streaming platforms" },
      ]
    : [
        { number: "01", title: "Konsultacja", desc: "Wspólnie ustalamy format, tematykę i cel podcastu" },
        { number: "02", title: "Przygotowanie", desc: "Pomagamy w przygotowaniu scenariusza i pytań" },
        { number: "03", title: "Nagranie", desc: "Profesjonalna realizacja w studiu z pełnym wsparciem technicznym" },
        { number: "04", title: "Postprodukcja", desc: "Kompleksowy montaż - wstawki graficzne / wideo / animacje" },
        { number: "05", title: "Dystrybucja", desc: "Publikacja na wybranych platformach streamingowych" },
      ]

  const faqs = isEnglish
    ? [
        {
          question: "Can I record multiple episodes in one day?",
          answer:
            "Yes! We offer packages for recording multiple episodes in one session, which is more cost-effective and time-efficient.",
        },
        {
          question: "Will you help with podcast promotion?",
          answer:
            "Absolutely. We can help with creating promotional materials, social media content, and distribution strategy.",
        },
      ]
    : [
        {
          question: "Czy mogę nagrać kilka odcinków w jednym dniu?",
          answer:
            "Tak! Oferujemy pakiety nagrywania wielu odcinków w jednej sesji, co jest bardziej opłacalne i efektywne czasowo.",
        },
        {
          question: "Czy pomożecie w promocji podcastu?",
          answer:
            "Oczywiście. Możemy pomóc w tworzeniu materiałów promocyjnych, contentu na social media i strategii dystrybucji.",
        },
      ]

  return (
    <div className="min-h-screen bg-black overflow-hidden">
      <SubpageNav lang={lang} />

      {/* Hero - Artistic with 3D Microphone Animation */}
      <section className="relative min-h-[100svh] flex items-center justify-center overflow-hidden pt-20 md:pt-0">
        {/* Animated Background - hidden on mobile for performance */}
        <div className="absolute inset-0 hidden md:block">
          {/* Sound wave circles */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-accent/20"
                style={{
                  width: `${200 + i * 150}px`,
                  height: `${200 + i * 150}px`,
                  animation: `pulse ${3 + i * 0.5}s ease-in-out infinite`,
                  animationDelay: `${i * 0.3}s`,
                  opacity: 1 - i * 0.15,
                }}
              />
            ))}
          </div>

          {/* Floating audio elements - desktop only */}
          <div className="absolute top-20 left-[10%] animate-float">
            <Headphones className="w-12 h-12 text-accent/30" />
          </div>
          <div className="absolute top-40 right-[15%] animate-float" style={{ animationDelay: "1s" }}>
            <Volume2 className="w-8 h-8 text-white/20" />
          </div>
          <div className="absolute bottom-40 left-[20%] animate-float" style={{ animationDelay: "2s" }}>
            <Radio className="w-10 h-10 text-accent/20" />
          </div>
        </div>

        {/* Simple mobile background */}
        <div className="absolute inset-0 md:hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full border border-accent/10" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full border border-accent/5" />
        </div>

        {/* Waveform - bottom, simplified on mobile */}
        <div className="absolute bottom-0 left-0 right-0 h-16 md:h-32 flex items-end justify-center gap-[2px] md:gap-1 opacity-20">
          {[...Array(40)].map((_, i) => (
            <div
              key={i}
              className="w-[2px] md:w-1 bg-accent rounded-t"
              style={{
                height: `${Math.sin(i * 0.3) * 50 + 60}%`,
                animation: `waveform 1.5s ease-in-out infinite`,
                animationDelay: `${i * 0.05}s`,
              }}
            />
          ))}
        </div>

        {/* 3D Microphone - positioned better on mobile */}
        <div className="absolute top-1/3 md:top-1/2 right-4 md:left-1/2 md:-translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-30 md:opacity-100">
          <div className="relative w-24 h-24 md:w-96 md:h-96">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <div
                className="relative"
                style={{
                  animation: "micFloat 4s ease-in-out infinite",
                }}
              >
                {/* Mic head */}
                <div className="w-12 h-16 md:w-28 md:h-40 bg-gradient-to-b from-zinc-700 to-zinc-900 rounded-t-full mx-auto relative overflow-hidden border-2 border-zinc-600">
                  <div className="absolute inset-1 md:inset-2 rounded-t-full bg-gradient-to-b from-zinc-800 to-zinc-950">
                    {[...Array(8)].map((_, i) => (
                      <div
                        key={i}
                        className="w-full h-[1px] bg-zinc-600/50 absolute"
                        style={{ top: `${15 + i * 10}%` }}
                      />
                    ))}
                  </div>
                  <div className="absolute top-2 md:top-3 left-1/2 -translate-x-1/2 w-1.5 h-1.5 md:w-3 md:h-3 rounded-full bg-red-500 animate-pulse" />
                </div>
                {/* Mic body */}
                <div className="w-3 h-8 md:w-8 md:h-24 bg-gradient-to-b from-zinc-800 to-zinc-950 mx-auto rounded-b" />
                {/* Base */}
                <div className="w-8 h-2 md:w-24 md:h-4 bg-gradient-to-b from-zinc-700 to-zinc-900 mx-auto rounded-full" />
              </div>
            </div>
          </div>
        </div>

        {/* Content - better mobile layout */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-12">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 md:gap-12">
            {/* Left side - Typography */}
            <div
              className="flex-1 text-left"
              style={{
                opacity: isLoaded ? 1 : 0,
                transform: isLoaded ? "translateX(0)" : "translateX(-30px)",
                transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
              }}
            >
              <span className="text-accent font-mono text-[10px] md:text-xs tracking-[0.2em] md:tracking-[0.3em] mb-2 md:mb-4 block">
                PODCAST KATOWICE
              </span>

              <h1 className="font-display text-white leading-[0.9]">
                <span className="block text-4xl md:text-7xl lg:text-8xl">{isEnglish ? "PODCASTS" : "PODCASTY"}</span>
                <span className="block text-xl md:text-4xl lg:text-5xl text-white/40 mt-1 md:mt-2">
                  {isEnglish ? "& CONVERSATIONS" : "I ROZMOWY"}
                </span>
              </h1>

              <p className="text-white/60 font-mono text-xs md:text-sm max-w-lg mt-4 md:mt-8 leading-relaxed">
                {isEnglish
                  ? "Professional audio-video recordings for the entire Silesian agglomeration. From concept through recording to distribution on the most popular platforms."
                  : "Profesjonalne nagrania audio-wideo dla całej aglomeracji śląskiej. Od koncepcji przez nagranie, aż po dystrybucję na najpopularniejszych platformach."}
              </p>

              <div className="mt-6 md:mt-8 flex flex-col sm:flex-row gap-3 md:gap-4">
                <a
                  href="https://podcastkatowice.pl"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-6 md:px-8 py-3 md:py-4 bg-accent text-black font-mono text-xs md:text-sm hover:bg-accent/90 transition-colors"
                >
                  {isEnglish ? "Book a date" : "Rezerwuj termin"}
                  <ArrowRight className="w-4 h-4" />
                </a>
                <a
                  href="#offers"
                  className="inline-flex items-center justify-center gap-2 px-6 md:px-8 py-3 md:py-4 border border-white/20 text-white font-mono text-xs md:text-sm hover:border-accent/50 transition-colors"
                >
                  {isEnglish ? "Learn more" : "Dowiedz się więcej"}
                </a>
              </div>
            </div>

            {/* Right side - Stats - horizontal on mobile */}
            <div
              className="flex flex-row lg:flex-col gap-6 md:gap-6 mt-6 lg:mt-0"
              style={{
                opacity: isLoaded ? 1 : 0,
                transform: isLoaded ? "translateX(0)" : "translateX(30px)",
                transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.3s",
              }}
            >
              <div className="text-left lg:text-right">
                <div className="text-3xl md:text-5xl lg:text-6xl font-display text-accent">4K</div>
                <div className="text-white/40 font-mono text-[10px] md:text-xs">{isEnglish ? "VIDEO" : "WIDEO"}</div>
              </div>
              <div className="text-left lg:text-right">
                <div className="text-3xl md:text-5xl lg:text-6xl font-display text-white">1-4</div>
                <div className="text-white/40 font-mono text-[10px] md:text-xs">{isEnglish ? "GUESTS" : "OSOBY"}</div>
              </div>
              <div className="text-left lg:text-right">
                <div className="text-3xl md:text-5xl lg:text-6xl font-display text-accent">PRO</div>
                <div className="text-white/40 font-mono text-[10px] md:text-xs">AUDIO</div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator - hidden on mobile */}
        <div className="absolute bottom-20 md:bottom-8 left-1/2 -translate-x-1/2 flex-col items-center gap-2 animate-bounce hidden md:flex">
          <span className="text-white/40 font-mono text-xs">{isEnglish ? "SCROLL" : "PRZEWIŃ"}</span>
          <ChevronDown className="w-4 h-4 text-accent" />
        </div>
      </section>

      {/* Studio Showcase */}
      <section className="py-24 border-t border-white/10 relative">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-accent font-mono text-xs tracking-widest mb-4 block">
                {isEnglish ? "OUR STUDIO" : "NASZE STUDIO"}
              </span>
              <h2 className="text-4xl md:text-6xl font-display text-white mb-6">
                {isEnglish ? "Professional recording studio in Katowice" : "Profesjonalne studio nagrań w Katowicach"}
              </h2>
              <p className="text-white/60 font-mono text-sm leading-relaxed mb-8">
                {isEnglish
                  ? "Our studio is equipped with professional equipment ensuring crystal clear sound and 4K image. Acoustic treatment, professional microphones, and multi-camera setup."
                  : "Nasze studio jest wyposażone w profesjonalny sprzęt zapewniający krystalicznie czysty dźwięk i obraz 4K. Akustyka, profesjonalne mikrofony i setup wielokamerowy."}
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="px-4 py-2 border border-accent/30 text-accent font-mono text-xs">SHURE SM7B</div>
                <div className="px-4 py-2 border border-white/20 text-white/60 font-mono text-xs">4K CAMERAS</div>
                <div className="px-4 py-2 border border-white/20 text-white/60 font-mono text-xs">
                  ACOUSTIC TREATMENT
                </div>
              </div>
            </div>
            <div className="relative aspect-video rounded-lg overflow-hidden border border-white/10">
              <Image src="/images/studio-podcast.webp" alt="Studio podcastowe Katowice" fill className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-4 left-4 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span className="text-white font-mono text-xs">PODCAST KATOWICE</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Offers Section */}
      <section id="offers" className="py-24 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center mb-16">
            <span className="text-accent font-mono text-xs tracking-widest mb-4 block">
              {isEnglish ? "OUR SERVICES" : "NASZA OFERTA"}
            </span>
            <h2 className="text-4xl md:text-6xl font-display text-white">
              {isEnglish ? "What do we offer?" : "Co oferujemy?"}
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {offers.map((offer, index) => (
              <div
                key={index}
                className="group p-6 border border-white/10 bg-black/50 hover:border-accent/30 transition-all duration-300 hover:-translate-y-1"
              >
                <offer.icon className="w-8 h-8 text-accent mb-4 group-hover:scale-110 transition-transform" />
                <p className="text-white/80 font-mono text-sm">{offer.text}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 p-6 border border-accent/30 bg-accent/5 text-center">
            <p className="text-white/80 font-mono text-sm">
              <span className="text-accent">📌</span>{" "}
              {isEnglish
                ? "For creators, companies and brands that want to regularly publish conversations in audio or video format"
                : "Dla twórców, firm i marek, które chcą regularnie publikować rozmowy w formie audio lub wideo"}
            </p>
          </div>
        </div>
      </section>

      {/* Process Steps */}
      <section className="py-24 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center mb-16">
            <span className="text-accent font-mono text-xs tracking-widest mb-4 block">
              {isEnglish ? "PROCESS" : "PROCES"}
            </span>
            <h2 className="text-4xl md:text-6xl font-display text-white">
              {isEnglish ? "How does the production look?" : "Jak wygląda realizacja?"}
            </h2>
          </div>

          <div className="relative">
            {/* Connection line */}
            <div className="absolute top-0 bottom-0 left-8 md:left-1/2 w-[1px] bg-gradient-to-b from-accent via-accent/50 to-transparent hidden md:block" />

            <div className="space-y-12">
              {steps.map((step, index) => (
                <div key={index} className={`flex items-start gap-8 ${index % 2 === 1 ? "md:flex-row-reverse" : ""}`}>
                  <div className={`flex-1 ${index % 2 === 1 ? "md:text-right" : ""}`}>
                    <div className="p-6 border border-white/10 bg-black/50 hover:border-accent/30 transition-colors">
                      <span className="text-accent font-mono text-4xl md:text-5xl block mb-2">{step.number}</span>
                      <h3 className="text-white font-display text-2xl mb-2">{step.title}</h3>
                      <p className="text-white/60 font-mono text-sm">{step.desc}</p>
                    </div>
                  </div>
                  <div className="hidden md:flex items-center justify-center w-4 h-4 rounded-full bg-accent relative z-10" />
                  <div className="flex-1 hidden md:block" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="py-24 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center mb-16">
            <span className="text-accent font-mono text-xs tracking-widest mb-4 block">
              {isEnglish ? "GALLERY" : "GALERIA"}
            </span>
            <h2 className="text-4xl md:text-6xl font-display text-white">
              {isEnglish ? "See our studio" : "Zobacz nasze studio"}
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              "/images/img-5705.jpeg",
              "/images/img-5708.jpeg",
              "/images/img-5709.jpeg",
              "/images/img-5710.jpeg",
              "/images/dsc5980-enhanced-nr.jpg",
              "/images/dsc6092-enhanced-nr.jpg",
            ].map((src, index) => (
              <div key={index} className="relative aspect-square overflow-hidden border border-white/10 group">
                <Image
                  src={src || "/placeholder.svg"}
                  alt={`Studio ${index + 1}`}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Play className="w-12 h-12 text-white" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 border-t border-white/10">
        <div className="max-w-3xl mx-auto px-6 md:px-12">
          <div className="text-center mb-16">
            <span className="text-accent font-mono text-xs tracking-widest mb-4 block">FAQ</span>
            <h2 className="text-4xl md:text-5xl font-display text-white">
              {isEnglish ? "Frequently asked questions" : "Najczęściej zadawane pytania"}
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="border border-white/10 bg-black/50">
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full flex items-center justify-between p-6 text-left"
                >
                  <span className="text-white font-display text-lg">{faq.question}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-accent transition-transform duration-300 flex-shrink-0 ml-4 ${openFaq === index ? "rotate-180" : ""}`}
                  />
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ${openFaq === index ? "max-h-40" : "max-h-0"}`}
                >
                  <div className="px-6 pb-6">
                    <p className="text-white/60 font-mono text-sm">{faq.answer}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-accent/5 border-t border-accent/20">
        <div className="max-w-4xl mx-auto px-6 md:px-12 text-center">
          <h2 className="text-4xl md:text-6xl font-display text-white mb-6">
            {isEnglish ? "Ready to start?" : "Gotowy na start?"}
          </h2>
          <p className="text-white/60 font-mono text-sm mb-8 max-w-xl mx-auto">
            {isEnglish
              ? "Contact us to discuss project details and receive an individual quote."
              : "Skontaktuj się z nami, aby omówić szczegóły projektu i otrzymać indywidualną wycenę."}
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a
              href="https://podcastkatowice.pl"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 bg-accent text-black font-mono text-sm hover:bg-accent/90 transition-colors"
            >
              {isEnglish ? "Book a date" : "Zarezerwuj termin"}
              <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="mailto:kontakt@podcastkatowice.pl"
              className="inline-flex items-center gap-2 px-8 py-4 border border-white/20 text-white font-mono text-sm hover:border-accent/50 transition-colors"
            >
              {isEnglish ? "Contact" : "Skontaktuj się"}
            </a>
          </div>
        </div>
      </section>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        @keyframes waveform {
          0%, 100% { transform: scaleY(1); }
          50% { transform: scaleY(0.5); }
        }
        @keyframes micFloat {
          0%, 100% { transform: translateY(0) rotate(-2deg); }
          50% { transform: translateY(-15px) rotate(2deg); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}
