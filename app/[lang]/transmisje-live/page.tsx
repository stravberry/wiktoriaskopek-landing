"use client"

import { useParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Radio, Wifi, Globe, Satellite, Play, Users, Monitor, ChevronDown } from "lucide-react"
import type { Locale } from "@/lib/translations"
import SubpageNav from "@/components/subpage-nav"
import { useState } from "react"

export default function TransmisjeLivePage() {
  const params = useParams()
  const lang = (params.lang as Locale) || "pl"
  const isEnglish = lang === "en"
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const offers = [
    {
      icon: Monitor,
      title: isEnglish ? "Professional Equipment" : "Profesjonalny sprzęt",
      desc: isEnglish ? "Cameras, lighting and sound" : "Kamery, światło i dźwięk",
    },
    {
      icon: Globe,
      title: isEnglish ? "Multi-platform" : "Wiele platform",
      desc: isEnglish ? "YouTube, LinkedIn, Facebook, Zoom, Teams" : "YouTube, LinkedIn, Facebook, Zoom, Teams",
    },
    {
      icon: Users,
      title: isEnglish ? "Remote Guests" : "Goście zdalni",
      desc: isEnglish ? "Via StreamYard / OBS" : "Przez StreamYard / OBS",
    },
    {
      icon: Play,
      title: isEnglish ? "Graphics & Overlays" : "Grafiki i wstawki",
      desc: isEnglish ? "Intro/outro, sponsor boards" : "Intro/outro, plansze sponsorów",
    },
    {
      icon: Radio,
      title: isEnglish ? "Recording" : "Nagranie",
      desc: isEnglish ? "Available as podcast or recap" : "Jako odcinek podcastu lub relacja",
    },
    {
      icon: Satellite,
      title: isEnglish ? "Full Support" : "Pełna obsługa",
      desc: isEnglish ? "Technical team on-site" : "Zespół techniczny na miejscu",
    },
  ]

  const timeline = [
    {
      step: "01",
      title: isEnglish ? "Planning" : "Planowanie",
      desc: isEnglish ? "We set platform, format and guests" : "Ustalamy platformę, format i goście",
    },
    {
      step: "02",
      title: isEnglish ? "Technical prep" : "Przygotowanie techniczne",
      desc: isEnglish ? "Connection and graphics tests" : "Testy połączeń i grafik",
    },
    {
      step: "03",
      title: isEnglish ? "Live broadcast" : "Realizacja live",
      desc: isEnglish ? "Stream with full technical support" : "Transmisja z pełną obsługą techniczną",
    },
    {
      step: "04",
      title: isEnglish ? "Recording" : "Nagranie",
      desc: isEnglish ? "Material delivery for further use" : "Dostawa materiału do dalszego wykorzystania",
    },
  ]

  const faqs = [
    {
      q: isEnglish ? "Can I have remote guests?" : "Czy mogę mieć gości łączących się zdalnie?",
      a: isEnglish
        ? "Yes! We support remote guest connections via StreamYard, OBS and other platforms. We test all connections before going live."
        : "Tak! Obsługujemy połączenia z gośćmi zdalnymi przez StreamYard, OBS i inne platformy. Testujemy wszystkie połączenia przed startem.",
    },
    {
      q: isEnglish ? "Will I receive the recording?" : "Czy otrzymam nagranie transmisji?",
      a: isEnglish
        ? "Of course! After the broadcast you receive the full recording in high quality, ready for publishing as a podcast episode or event recap."
        : "Oczywiście! Po transmisji otrzymujesz pełne nagranie w wysokiej jakości, gotowe do publikacji jako odcinek podcastu lub relacja z wydarzenia.",
    },
    {
      q: isEnglish ? "Which platforms do you support?" : "Na jakie platformy możecie streamować?",
      a: isEnglish
        ? "We stream to YouTube, Facebook, LinkedIn, Zoom, Teams and other platforms simultaneously if needed."
        : "Streamujemy na YouTube, Facebook, LinkedIn, Zoom, Teams i inne platformy jednocześnie jeśli potrzebujesz.",
    },
  ]

  return (
    <div className="min-h-screen bg-black">
      <SubpageNav lang={lang} />

      {/* Hero with satellite/planet animation */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/95 to-black" />

        {/* Animated planet/globe */}
        <div className="absolute top-1/2 right-[10%] -translate-y-1/2 w-[400px] h-[400px] md:w-[600px] md:h-[600px] opacity-20">
          {/* Planet core */}
          <div className="absolute inset-[20%] rounded-full bg-gradient-to-br from-accent/30 via-accent/10 to-transparent border border-accent/20" />

          {/* Orbit rings */}
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="absolute inset-0 rounded-full border border-accent/20"
              style={{
                transform: `rotateX(${60 + i * 10}deg) rotateZ(${i * 30}deg)`,
                animation: `spin ${20 + i * 5}s linear infinite ${i % 2 === 0 ? "" : "reverse"}`,
              }}
            />
          ))}

          {/* Orbiting satellite */}
          <div
            className="absolute w-4 h-4"
            style={{
              animation: "orbit 15s linear infinite",
              top: "50%",
              left: "50%",
            }}
          >
            <Satellite className="w-4 h-4 text-accent" />
          </div>

          {/* Second satellite */}
          <div
            className="absolute w-3 h-3"
            style={{
              animation: "orbit 20s linear infinite reverse",
              top: "50%",
              left: "50%",
            }}
          >
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
          </div>
        </div>

        {/* Signal waves emanating from center */}
        <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="absolute border border-accent/30 rounded-full"
              style={{
                width: `${100 + i * 100}px`,
                height: `${100 + i * 100}px`,
                left: "50%",
                top: "50%",
                transform: "translate(-50%, -50%)",
                animation: `ping ${3 + i * 0.5}s cubic-bezier(0, 0, 0.2, 1) infinite`,
                animationDelay: `${i * 0.4}s`,
                opacity: 0.5 - i * 0.1,
              }}
            />
          ))}
          {/* Center broadcast point */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-red-500 rounded-full animate-pulse" />
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full" />
        </div>

        {/* Floating icons */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <Wifi
            className="absolute top-[20%] left-[15%] w-8 h-8 text-accent/30"
            style={{ animation: "float 6s ease-in-out infinite" }}
          />
          <Radio
            className="absolute top-[30%] right-[20%] w-6 h-6 text-accent/20"
            style={{ animation: "float 8s ease-in-out infinite 1s" }}
          />
          <Globe
            className="absolute bottom-[30%] left-[20%] w-10 h-10 text-accent/20"
            style={{ animation: "float 7s ease-in-out infinite 0.5s" }}
          />
        </div>

        {/* Content */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12">
          <div className="flex flex-col items-start">
            {/* Live indicator */}
            <div className="inline-flex items-center gap-3 mb-6 px-5 py-2.5 bg-red-500/20 border border-red-500/50 rounded-full">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>
              <span className="text-red-400 font-mono text-sm tracking-widest">ON AIR</span>
            </div>

            {/* Main title */}
            <h1 className="font-display text-[12vw] md:text-[10vw] lg:text-[8rem] text-white leading-[0.85] tracking-tighter mb-4">
              TRANSMISJE
              <br />
              <span className="text-accent">LIVE</span>
            </h1>

            {/* Subtitle */}
            <p className="text-white/60 font-mono text-sm md:text-base max-w-md mt-6 leading-relaxed">
              {isEnglish
                ? "Professional live broadcasts from our Katowice studio or your Silesian location. Multi-camera production with remote guest support."
                : "Transmisje live ze studia w Katowicach lub Twojej śląskiej lokalizacji. Wielokamerowa realizacja z możliwością wpięcia gości zdalnych."}
            </p>

            {/* CTA */}
            <Link
              href={`/${lang}/konsultacje`}
              className="mt-8 inline-flex items-center gap-3 px-8 py-4 bg-accent text-black font-mono text-sm hover:bg-accent/90 transition-all hover:gap-4"
            >
              {isEnglish ? "Book a date" : "Rezerwuj termin"}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50">
          <span className="text-white/50 font-mono text-xs tracking-widest">SCROLL</span>
          <div className="w-px h-8 bg-gradient-to-b from-white/50 to-transparent" />
        </div>
      </section>

      {/* Use cases banner */}
      <section className="py-6 border-y border-white/10 bg-accent/5">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-center text-white/60 font-mono text-sm">
            <span className="text-accent">●</span>{" "}
            {isEnglish
              ? "For events, premieres, webinars and online meetings that need to look professional"
              : "Dla wydarzeń, premier, webinarów i spotkań online, które mają wyglądać profesjonalnie"}
          </p>
        </div>
      </section>

      {/* What we offer */}
      <section className="py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
            <div>
              <span className="text-accent font-mono text-sm tracking-widest mb-4 block">OFERTA</span>
              <h2 className="text-4xl md:text-6xl font-display text-white">
                {isEnglish ? "What we offer" : "Co oferujemy?"}
              </h2>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {offers.map((offer, index) => (
              <div
                key={index}
                className="group relative p-8 border border-white/10 bg-white/[0.02] hover:border-accent/50 hover:bg-accent/5 transition-all duration-300"
              >
                <offer.icon className="w-8 h-8 text-accent mb-6 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-display text-white mb-2">{offer.title}</h3>
                <p className="text-white/50 font-mono text-sm">{offer.desc}</p>

                {/* Corner accent */}
                <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-accent/0 group-hover:border-accent/50 transition-colors" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Studio showcase */}
      <section className="py-20 md:py-32 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-accent font-mono text-sm tracking-widest mb-4 block">STUDIO</span>
              <h2 className="text-4xl md:text-5xl font-display text-white mb-6">
                {isEnglish ? "Professional broadcast studio" : "Profesjonalne studio transmisyjne"}
              </h2>
              <p className="text-white/60 font-mono text-sm leading-relaxed mb-8">
                {isEnglish
                  ? "Our studio in Katowice is equipped with everything needed for professional live broadcasts. Multi-camera setup, professional lighting, high-quality audio and stable internet connection."
                  : "Nasze studio w Katowicach jest wyposażone we wszystko, co potrzebne do profesjonalnych transmisji na żywo. Setup wielokamerowy, profesjonalne oświetlenie, wysokiej jakości audio i stabilne łącze internetowe."}
              </p>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 border border-white/10 bg-white/[0.02]">
                  <div className="text-3xl font-display text-accent mb-1">4K</div>
                  <div className="text-white/50 font-mono text-xs">{isEnglish ? "Video quality" : "Jakość wideo"}</div>
                </div>
                <div className="p-4 border border-white/10 bg-white/[0.02]">
                  <div className="text-3xl font-display text-accent mb-1">3+</div>
                  <div className="text-white/50 font-mono text-xs">{isEnglish ? "Camera angles" : "Ujęcia kamer"}</div>
                </div>
              </div>
            </div>

            <div className="relative aspect-video bg-white/5 border border-white/10 overflow-hidden group">
              <Image
                src="/images/img-5710.jpeg"
                alt="Studio transmisyjne"
                fill
                className="object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
              />
              {/* Live overlay */}
              <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 bg-red-500/90 rounded">
                <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                <span className="text-white font-mono text-xs font-bold">LIVE</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 md:py-32 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center mb-16">
            <span className="text-accent font-mono text-sm tracking-widest mb-4 block">PROCES</span>
            <h2 className="text-4xl md:text-6xl font-display text-white">
              {isEnglish ? "How it works" : "Jak wygląda realizacja?"}
            </h2>
          </div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-full bg-gradient-to-b from-accent via-accent/50 to-transparent hidden md:block" />

            <div className="space-y-8 md:space-y-0">
              {timeline.map((item, index) => (
                <div
                  key={index}
                  className={`relative md:flex md:items-center ${index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}
                >
                  {/* Content */}
                  <div className={`md:w-1/2 ${index % 2 === 0 ? "md:pr-16 md:text-right" : "md:pl-16"}`}>
                    <div className="p-6 border border-white/10 bg-white/[0.02] hover:border-accent/30 transition-colors">
                      <div className="text-accent font-mono text-sm mb-2">{item.step}</div>
                      <h3 className="text-2xl font-display text-white mb-2">{item.title}</h3>
                      <p className="text-white/50 font-mono text-sm">{item.desc}</p>
                    </div>
                  </div>

                  {/* Center dot */}
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-accent rounded-full hidden md:block">
                    <div className="absolute inset-0 bg-accent rounded-full animate-ping opacity-50" />
                  </div>

                  {/* Spacer */}
                  <div className="md:w-1/2" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 md:py-32 border-t border-white/10">
        <div className="max-w-3xl mx-auto px-6 md:px-12">
          <div className="text-center mb-16">
            <span className="text-accent font-mono text-sm tracking-widest mb-4 block">FAQ</span>
            <h2 className="text-4xl md:text-5xl font-display text-white">
              {isEnglish ? "Questions?" : "Najczęściej zadawane pytania"}
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="border border-white/10 bg-white/[0.02] overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full flex items-center justify-between p-6 text-left hover:bg-white/[0.02] transition-colors"
                >
                  <span className="text-white font-display text-lg pr-4">{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-accent flex-shrink-0 transition-transform ${openFaq === index ? "rotate-180" : ""}`}
                  />
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ${openFaq === index ? "max-h-48" : "max-h-0"}`}
                >
                  <p className="px-6 pb-6 text-white/60 font-mono text-sm leading-relaxed">{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-32 border-t border-white/10 relative overflow-hidden">
        {/* Background animation */}
        <div className="absolute inset-0 opacity-10">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="absolute border border-accent rounded-full"
              style={{
                width: `${300 + i * 200}px`,
                height: `${300 + i * 200}px`,
                left: "50%",
                top: "50%",
                transform: "translate(-50%, -50%)",
                animation: `ping ${4 + i}s cubic-bezier(0, 0, 0.2, 1) infinite`,
                animationDelay: `${i * 0.5}s`,
              }}
            />
          ))}
        </div>

        <div className="max-w-4xl mx-auto px-6 md:px-12 text-center relative z-10">
          <h2 className="text-4xl md:text-6xl font-display text-white mb-6">
            {isEnglish ? "Ready to go live?" : "Gotowy na start?"}
          </h2>
          <p className="text-white/60 font-mono text-sm mb-10 max-w-lg mx-auto">
            {isEnglish
              ? "Contact us to discuss project details and receive an individual quote."
              : "Skontaktuj się z nami, aby omówić szczegóły projektu i otrzymać indywidualną wycenę."}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={`/${lang}/konsultacje`}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-accent text-black font-mono text-sm hover:bg-accent/90 transition-all"
            >
              {isEnglish ? "Book a date" : "Zarezerwuj termin"}
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="#contact"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-white/20 text-white font-mono text-sm hover:border-accent/50 hover:text-accent transition-all"
            >
              {isEnglish ? "Contact" : "Skontaktuj się"}
            </Link>
          </div>
        </div>
      </section>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes orbit {
          from {
            transform: rotate(0deg) translateX(180px) rotate(0deg);
          }
          to {
            transform: rotate(360deg) translateX(180px) rotate(-360deg);
          }
        }
        @keyframes spin {
          from {
            transform: rotateX(60deg) rotateZ(0deg);
          }
          to {
            transform: rotateX(60deg) rotateZ(360deg);
          }
        }
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
      `}</style>
    </div>
  )
}
