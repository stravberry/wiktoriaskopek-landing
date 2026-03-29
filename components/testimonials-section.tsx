"use client"

import { useRef, useEffect, useState } from "react"
import { Quote } from "lucide-react"

export default function TestimonialsSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setIsVisible(true)
        })
      },
      { threshold: 0.1 },
    )

    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  const testimonials = [
    {
      quote:
        "Wiktoria to osoba, którą wyróżnia niezwykła sumienność i konsekwencja \u2013 zawsze doprowadza sprawy do końca.",
      author: "Paweł Węglarz",
      company: "GlowUp Nutrition",
    },
    {
      quote:
        "Wyróżnia się szybkością i konkretnością w realizacji zadań. Współpraca przebiega sprawnie i profesjonalnie.",
      author: "Anna Gajęcka",
      company: "Zastrzyk Piękna",
    },
    {
      quote:
        "Bardzo polecam Wiktorię. Jeśli tworzysz podcasty lub planujesz tworzyć kursy czy inne materiały edukacyjne, to podcastkatowice.pl to świetne miejsce. Zespół ma duże doświadczenie w montażu i oferuje kilka naprawdę przydatnych usług dodatkowych, m.in. wsparcie w tworzeniu contentu pod social media. Jakość realizacji stoi na bardzo wysokim poziomie. Na pewno nie będziecie żałować!",
      author: "Adrian Dębowiec",
      company: "Turbo Marketing",
      image: "/images/unnamed-9.png",
    },
    {
      quote: "Polecam, profesjonalne podejście i bardzo miła atmosfera.",
      author: "Alex Matoga",
      company: "",
    },
  ]

  return (
    <section ref={sectionRef} className="relative bg-black py-24 lg:py-32 overflow-hidden" id="opinie">
      {/* Decorative quote marks floating in background */}
      <div
        className="absolute top-20 right-20 font-serif text-[30vw] text-white/[0.015] leading-none pointer-events-none select-none"
        style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? "translateY(0) rotate(0deg)" : "translateY(100px) rotate(10deg)",
          transition: "all 2s cubic-bezier(0.16, 1, 0.3, 1) 0.5s",
        }}
      >
        &ldquo;
      </div>

      <div className="px-6 md:px-12 lg:px-20">
        <div className="flex items-center gap-6 mb-16">
          <span
            className="text-accent font-mono text-xs tracking-[0.3em] uppercase"
            style={{
              opacity: isVisible ? 1 : 0,
              clipPath: isVisible ? "inset(0 0 0 0)" : "inset(0 100% 0 0)",
              transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            Opinie
          </span>
          <div
            className="flex-1 h-px bg-white/10"
            style={{
              transform: isVisible ? "scaleX(1)" : "scaleX(0)",
              transformOrigin: "left",
              transition: "transform 1.2s cubic-bezier(0.16, 1, 0.3, 1) 0.3s",
            }}
          />
          <span
            className="text-white/20 font-mono text-xs"
            style={{
              opacity: isVisible ? 1 : 0,
              transition: "all 0.6s ease-out 1s",
            }}
          >
            Co mówią klienci
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8" style={{ perspective: "1200px" }}>
          {testimonials.map((t, i) => {
            const row = Math.floor(i / 2)
            const col = i % 2
            return (
              <div
                key={t.author}
                className="relative p-10 border border-white/5 bg-white/[0.01] hover:border-accent/20 transition-colors duration-500 group"
                style={{
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible
                    ? "translateY(0) rotateX(0deg) rotateY(0deg)"
                    : `translateY(${40 + row * 20}px) rotateX(${8 - row * 4}deg) rotateY(${col === 0 ? -6 : 6}deg)`,
                  transition: `all 1.2s cubic-bezier(0.16, 1, 0.3, 1) ${300 + i * 200}ms`,
                  transformOrigin: col === 0 ? "right center" : "left center",
                }}
              >
                {/* Animated accent line at top */}
                <div
                  className="absolute top-0 left-0 h-px bg-accent"
                  style={{
                    width: isVisible ? "60px" : "0px",
                    transition: `width 0.8s ease-out ${800 + i * 200}ms`,
                  }}
                />

                <Quote className="w-8 h-8 text-accent/20 mb-6 group-hover:text-accent/40 transition-colors duration-500" />
                <blockquote className="text-white/60 text-lg md:text-xl leading-relaxed mb-8 font-light">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <div className="flex items-center gap-4">
                  {t.image ? (
                    <img
                      src={t.image}
                      alt={t.author}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div
                      className="w-12 h-px bg-accent"
                      style={{
                        transform: isVisible ? "scaleX(1)" : "scaleX(0)",
                        transformOrigin: "left",
                        transition: `transform 0.6s ease-out ${1000 + i * 200}ms`,
                      }}
                    />
                  )}
                  <div>
                    <p
                      className="text-white font-display text-lg"
                      style={{
                        opacity: isVisible ? 1 : 0,
                        transform: isVisible ? "translateY(0)" : "translateY(10px)",
                        transition: `all 0.6s ease-out ${1000 + i * 200}ms`,
                      }}
                    >
                      {t.author}
                    </p>
                    {t.company && (
                      <p
                        className="text-white/30 font-mono text-xs"
                        style={{
                          opacity: isVisible ? 1 : 0,
                          transition: `all 0.6s ease-out ${1100 + i * 200}ms`,
                        }}
                      >
                        {t.company}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
