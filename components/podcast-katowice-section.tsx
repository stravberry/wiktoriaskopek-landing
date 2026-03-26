"use client"

import { useRef, useEffect, useState } from "react"
import { ArrowUpRight, Video, Film, Headphones, Check } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import type { Locale } from "@/lib/translations"

export default function PodcastKatowiceSection({ lang = "pl" }: { lang?: Locale }) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [hoveredService, setHoveredService] = useState<number | null>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setIsVisible(true)
        })
      },
      { threshold: 0.05 },
    )

    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  const services = [
    {
      icon: <Headphones className="w-12 h-12" />,
      title: "Studio Audio",
      description: "Profesjonalne mikrofony studyjne, audio jakości radiowej.",
      number: "01",
    },
    {
      icon: <Video className="w-12 h-12" />,
      title: "Nagrania Wideo",
      description: "Kamery 4K, studyjne oświetlenie, pełna obsługa nagrania.",
      number: "02",
    },
    {
      icon: <Film className="w-12 h-12" />,
      title: "Postprodukcja",
      description: "Kompleksowy montaż pod Twoją markę.",
      number: "03",
    },
  ]

  const features = [
    "Doświadczony zespół producentów i\u00A0realizatorów",
    "Kompleksowe wsparcie: od\u00A0pomysłu po\u00A0dystrybucję",
    "Profesjonalny sprzęt i\u00A0akustyka klasy studyjnej",
  ]

  const formats = [
    { name: "Podcasty", link: `/${lang}/podcasty` },
    { name: "YouTube", link: `/${lang}/youtube` },
    { name: "Kursy online", link: `/${lang}/kursy-online` },
    { name: "Webinary sprzedażowe", link: null },
    { name: "Transmisje live", link: `/${lang}/transmisje-live` },
  ]

  const handleLinkClick = () => {
    sessionStorage.setItem("scrollPosition", window.scrollY.toString())
  }

  return (
    <section ref={sectionRef} className="relative bg-black overflow-hidden" id="studio">
      {/* Horizontal decorative lines that draw on scroll */}
      <div
        className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent"
        style={{
          transform: isVisible ? "scaleX(1)" : "scaleX(0)",
          transition: "transform 2s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      />

      <div className="relative z-10">
        {/* Hero Section */}
        <div className="min-h-screen flex flex-col lg:flex-row relative">
          {/* Left column - Text content */}
          <div className="flex-1 flex flex-col justify-center relative px-6 md:px-12 lg:px-20 py-20">
            <div className="absolute inset-0 z-0">
              <Image src="/images/img-5710.jpeg" alt="Studio" fill className="object-cover opacity-15" />
              <div className="absolute inset-0 bg-gradient-to-r from-black via-black/90 to-black/70" />
            </div>

            <span
              className="relative z-10 text-accent font-mono text-xs tracking-[0.5em] uppercase mb-8"
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? "translateY(0)" : "translateY(20px)",
                transition: "all 0.8s ease-out",
              }}
            >
              podcastkatowice.pl
            </span>

            <h2
              className="relative z-10 font-display text-[12vw] md:text-[10vw] lg:text-[6vw] text-white leading-[0.9] tracking-tight max-w-5xl"
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? "translateY(0)" : "translateY(60px)",
                transition: "all 1s cubic-bezier(0.16, 1, 0.3, 1) 0.2s",
              }}
            >
              Studio nagrań
            </h2>
            <h2
              className="relative z-10 font-display text-[12vw] md:text-[10vw] lg:text-[6vw] text-white leading-[0.9] tracking-tight"
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? "translateY(0)" : "translateY(60px)",
                transition: "all 1s cubic-bezier(0.16, 1, 0.3, 1) 0.3s",
              }}
            >
              wideo
            </h2>
            <h2
              className="relative z-10 font-serif italic text-[10vw] md:text-[8vw] lg:text-[5vw] text-accent leading-[0.9]"
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? "translateX(0)" : "translateX(-40px)",
                transition: "all 1s cubic-bezier(0.16, 1, 0.3, 1) 0.4s",
              }}
            >
              i podcastów
            </h2>

            <div
              className="relative z-10 flex items-center gap-4 mt-12"
              style={{ opacity: isVisible ? 1 : 0, transition: "all 1s ease-out 0.6s" }}
            >
              <div className="w-16 h-px bg-accent" />
              <span className="font-display text-3xl md:text-4xl lg:text-5xl text-white/20">w Katowicach</span>
            </div>

            <p
              className="relative z-10 text-white/50 font-mono text-sm md:text-base mt-12 max-w-xl"
              style={{ opacity: isVisible ? 1 : 0, transition: "all 1s ease-out 0.7s" }}
            >
              Dla firm, ekspertów, trenerów i twórców internetowych, którzy chcą nagrywać profesjonalne podcasty i wideo{" "}
              <span className="text-accent">bez martwienia się o technikalia.</span>
            </p>

            <div
              className="relative z-10 flex flex-col sm:flex-row gap-4 mt-12"
              style={{ opacity: isVisible ? 1 : 0, transition: "all 1s ease-out 0.8s" }}
            >
              <a
                href="https://podcastkatowice.pl"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between px-8 py-5 bg-accent hover:bg-accent/90 transition-all duration-300"
              >
                <span className="font-mono text-sm text-black font-medium">Zarezerwuj Studio</span>
                <ArrowUpRight className="w-5 h-5 text-black group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
              </a>
              <a
                href="https://podcastkatowice.pl"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between px-8 py-5 border border-white/20 hover:border-accent hover:bg-accent/5 transition-all duration-300"
              >
                <span className="font-mono text-sm text-white/70 group-hover:text-white transition-colors">
                  Zobacz Ofertę
                </span>
                <ArrowUpRight className="w-5 h-5 text-white/40 group-hover:text-accent group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300" />
              </a>
            </div>
          </div>

          {/* Right column - Studio image */}
          <div
            className="hidden lg:block flex-1 relative"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? "translateX(0) scale(1)" : "translateX(50px) scale(0.95)",
              transition: "all 1.2s cubic-bezier(0.16, 1, 0.3, 1) 0.4s",
            }}
          >
            <div className="absolute inset-0 overflow-hidden">
              <Image
                src="/images/studio-podcast.webp"
                alt="Studio nagrań podcastów w Katowicach"
                fill
                className="object-cover"
                style={{
                  objectPosition: "center center",
                }}
              />
              {/* Gradient overlay for blending */}
              <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/30" />
            </div>
          </div>
        </div>

        {/* Services Section */}
        <div className="px-6 md:px-12 lg:px-20 py-24">
          <div className="flex items-center gap-6 mb-16">
            <span className="text-accent font-mono text-xs tracking-[0.3em] uppercase">Usługi</span>
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-white/20 font-mono text-xs">03 opcje</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-px bg-white/5">
            {services.map((service, i) => (
              <div
                key={service.title}
                className={`relative group bg-black p-10 min-h-[35vh] flex flex-col justify-between cursor-pointer transition-all duration-700 ${
                  hoveredService !== null && hoveredService !== i ? "opacity-30" : "opacity-100"
                }`}
                onMouseEnter={() => setHoveredService(i)}
                onMouseLeave={() => setHoveredService(null)}
                style={{
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? "translateY(0)" : "translateY(60px)",
                  transition: `all 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${300 + i * 150}ms`,
                }}
              >
                <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-display text-[35vw] md:text-[20vw] lg:text-[15vw] text-white/[0.02] group-hover:text-accent/[0.05] transition-colors duration-700 pointer-events-none">
                  {service.number}
                </span>

                <div className="relative z-10">
                  <div className="text-white/20 group-hover:text-accent transition-colors duration-500 mb-8">
                    {service.icon}
                  </div>
                  <span className="text-white/30 font-mono text-xs tracking-widest">{service.number}</span>
                </div>

                <div className="relative z-10">
                  <h3 className="font-display text-4xl md:text-5xl lg:text-6xl text-white mb-4 group-hover:translate-x-2 transition-transform duration-500">
                    {service.title}
                  </h3>
                  <p className="text-white/40 font-mono text-sm leading-relaxed group-hover:text-white/60 transition-colors duration-500">
                    {service.description}
                  </p>
                </div>

                <div className="absolute bottom-0 left-0 w-0 h-1 bg-accent group-hover:w-full transition-all duration-700" />
              </div>
            ))}
          </div>
        </div>

        {/* Więcej niż tylko studio - Combined Section */}
        <div className="relative px-6 md:px-12 lg:px-20 py-24">
          <div className="absolute inset-0 z-0 overflow-hidden">
            <video autoPlay muted loop playsInline className="w-full h-full object-cover opacity-5">
              <source src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/montazyk%20bts_1_2_1-BTWRm9DbyG02CDrnCF3Aj9h3saZPfq.mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-gradient-to-b from-black via-black/95 to-black" />
          </div>

          <div className="relative z-10">
            <div className="mb-16">
              <h2
                className="font-display text-[16vw] md:text-[12vw] lg:text-[10vw] text-white leading-[0.85] tracking-tight"
                style={{
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? "translateY(0)" : "translateY(80px)",
                  transition: "all 1.2s cubic-bezier(0.16, 1, 0.3, 1)",
                }}
              >
                Więcej niż
              </h2>
              <h2
                className="font-serif italic text-[14vw] md:text-[10vw] lg:text-[8vw] text-accent leading-[0.85]"
                style={{
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? "translateX(0)" : "translateX(-100px)",
                  transition: "all 1.2s cubic-bezier(0.16, 1, 0.3, 1) 0.2s",
                }}
              >
                tylko studio
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
              {/* Left - Formats */}
              <div
                style={{
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? "translateY(0)" : "translateY(60px)",
                  transition: "all 1s ease-out 0.4s",
                }}
              >
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-px bg-accent" />
                  <span className="text-accent font-mono text-xs tracking-[0.3em] uppercase">Formaty</span>
                </div>

                <p className="text-white/50 font-mono text-sm md:text-base leading-relaxed mb-10 max-w-lg">
                  Oprócz podcastów tworzymy formaty dopasowane do Twojej strategii marketingowej. Każdy projekt
                  wyceniamy indywidualnie.
                </p>

                <div className="space-y-3">
                  {formats.map((format, i) => {
                    const content = (
                      <>
                        <span
                          className="text-white/20 font-mono text-xs group-hover:text-accent transition-colors duration-300"
                          key={`format-number-${i}`}
                        >
                          0{i + 1}
                        </span>
                        <span
                          className="font-display text-3xl md:text-4xl lg:text-5xl text-white/60 group-hover:text-white group-hover:translate-x-2 transition-all duration-300"
                          key={`format-name-${i}`}
                        >
                          {format.name}
                        </span>
                        {format.link && (
                          <ArrowUpRight
                            className="w-6 h-6 text-white/0 group-hover:text-accent transition-all duration-300 ml-auto"
                            key={`format-arrow-${i}`}
                          />
                        )}
                      </>
                    )

                    return format.link ? (
                      <Link
                        key={format.name}
                        href={format.link}
                        onClick={handleLinkClick}
                        className="group flex items-center gap-6 cursor-pointer"
                        style={{
                          opacity: isVisible ? 1 : 0,
                          transform: isVisible ? "translateX(0)" : `translateX(-${20 + i * 10}px)`,
                          transition: `all 0.8s ease-out ${0.5 + i * 0.1}s`,
                        }}
                      >
                        {content}
                      </Link>
                    ) : (
                      <div
                        key={format.name}
                        className="group flex items-center gap-6 cursor-pointer"
                        style={{
                          opacity: isVisible ? 1 : 0,
                          transform: isVisible ? "translateX(0)" : `translateX(-${20 + i * 10}px)`,
                          transition: `all 0.8s ease-out ${0.5 + i * 0.1}s`,
                        }}
                      >
                        {content}
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Right - Team */}
              <div
                style={{
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? "translateY(0)" : "translateY(60px)",
                  transition: "all 1s ease-out 0.6s",
                }}
              >
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-px bg-white/20" />
                  <span className="text-white/40 font-mono text-xs tracking-[0.3em] uppercase">Zespół</span>
                </div>

                <p className="text-white/40 font-mono text-sm md:text-base leading-relaxed mb-10 max-w-lg">
                  Podcast Katowice to zespół pasjonatów łączących wiedzę techniczną z marketingowym know-how.
                </p>

                <ul className="space-y-6 mb-12">
                  {features.map((feature, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-5 group"
                      style={{
                        opacity: isVisible ? 1 : 0,
                        transform: isVisible ? "translateX(0)" : "translateX(30px)",
                        transition: `all 0.8s ease-out ${0.7 + i * 0.1}s`,
                      }}
                    >
                      <div className="w-8 h-8 border border-accent/30 flex items-center justify-center flex-shrink-0 group-hover:bg-accent/10 transition-colors duration-300">
                        <Check className="w-4 h-4 text-accent" />
                      </div>
                      <span className="font-mono text-sm text-white/60 group-hover:text-white transition-colors duration-300 leading-relaxed pt-1">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <a
                  href="https://podcastkatowice.pl"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-6"
                >
                  <span className="font-display text-4xl md:text-5xl text-white group-hover:text-accent transition-colors duration-300">
                    Poznaj nas
                  </span>
                  <div className="w-14 h-14 rounded-full border border-white/20 flex items-center justify-center group-hover:border-accent group-hover:bg-accent transition-all duration-300">
                    <ArrowUpRight className="w-6 h-6 text-white/60 group-hover:text-black group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300" />
                  </div>
                </a>
              </div>
            </div>

            {/* Footer link */}
            <div className="mt-24 pt-12 border-t border-white/5">
              <a
                href="https://podcastkatowice.pl"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-6"
              >
                <span className="font-display text-6xl md:text-7xl text-white/10 group-hover:text-accent/30 transition-colors duration-500">
                  ©
                </span>
                <div>
                  <span className="block font-mono text-xs text-white/30 uppercase tracking-widest mb-1">
                    Studio partnerskie
                  </span>
                  <span className="block font-display text-2xl md:text-3xl text-white group-hover:text-accent transition-colors duration-300">
                    podcastkatowice.pl
                  </span>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
