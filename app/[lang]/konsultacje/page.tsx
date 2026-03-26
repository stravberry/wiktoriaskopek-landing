"use client"

import { useState, useEffect, useRef } from "react"
import { useParams } from "next/navigation"
import { ArrowRight, Check, MessageCircle, Zap, Target, TrendingUp, Users, ChevronDown } from "lucide-react"
import type { Locale } from "@/lib/translations"
import SubpageNav from "@/components/subpage-nav"

export default function KonsultacjePage() {
  const params = useParams()
  const lang = (params.lang as Locale) || "pl"
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [visibleSections, setVisibleSections] = useState<string[]>([])
  const observerRef = useRef<IntersectionObserver | null>(null)

  const isEnglish = lang === "en"

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute("data-section")
            if (id) setVisibleSections((prev) => (prev.includes(id) ? prev : [...prev, id]))
          }
        })
      },
      { threshold: 0.1 },
    )

    document.querySelectorAll("[data-section]").forEach((el) => {
      observerRef.current?.observe(el)
    })

    return () => observerRef.current?.disconnect()
  }, [])

  const benefits = isEnglish
    ? [
        {
          icon: Target,
          title: "Precise Strategy",
          description: "Individual approach to your business and goals. No templates.",
        },
        {
          icon: Zap,
          title: "Immediate Results",
          description: "Concrete tips you can implement right after the meeting.",
        },
        { icon: TrendingUp, title: "Growth", description: "Strategies that really work and bring measurable results." },
        {
          icon: Users,
          title: "Partnership",
          description: "I treat each client individually and invest in their success.",
        },
      ]
    : [
        {
          icon: Target,
          title: "Precyzyjna strategia",
          description: "Indywidualne podejście do Twojego biznesu i celów. Bez szablonów.",
        },
        {
          icon: Zap,
          title: "Natychmiastowe efekty",
          description: "Konkretne wskazówki, które wdrożysz od razu po spotkaniu.",
        },
        {
          icon: TrendingUp,
          title: "Wzrost",
          description: "Strategie, które naprawdę działają i przynoszą mierzalne rezultaty.",
        },
        {
          icon: Users,
          title: "Partnerstwo",
          description: "Traktuję każdego klienta indywidualnie i inwestuję w jego sukces.",
        },
      ]

  const helpAreas = isEnglish
    ? [
        "Video marketing strategy",
        "Social media automation",
        "Building a personal brand",
        "Corporate podcasts",
        "Sales funnels",
        "AI in marketing",
        "Content strategy",
        "Advertising campaigns",
      ]
    : [
        "Strategia wideo marketingu",
        "Automatyzacja social media",
        "Budowanie marki osobistej",
        "Podcasty firmowe",
        "Lejki sprzedażowe",
        "AI w marketingu",
        "Strategia contentowa",
        "Kampanie reklamowe",
      ]

  const packages = isEnglish
    ? [
        {
          name: "Single consultation",
          price: "497",
          currency: "PLN",
          period: "60 min",
          description: "Perfect if you need quick advice or want to solve a specific problem.",
          features: [
            "60 minutes of intensive consultation",
            "Analysis of your current situation",
            "Concrete action plan",
            "Summary in PDF",
            "7 days of email support",
          ],
          popular: false,
        },
        {
          name: "Monthly package",
          price: "1497",
          currency: "PLN",
          period: "/month",
          description: "For those who want regular support and strategic mentoring.",
          features: [
            "4 consultations per month (60 min each)",
            "Individual action plan",
            "Priority email support",
            "Document templates",
            "Strategy review",
            "Ongoing optimization",
            "Access to exclusive materials",
          ],
          popular: true,
        },
      ]
    : [
        {
          name: "Jednorazowa konsultacja",
          price: "497",
          currency: "PLN",
          period: "60 min",
          description: "Idealna jeśli potrzebujesz szybkiej porady lub chcesz rozwiązać konkretny problem.",
          features: [
            "60 minut intensywnej konsultacji",
            "Analiza Twojej obecnej sytuacji",
            "Konkretny plan działania",
            "Podsumowanie w PDF",
            "7 dni wsparcia mailowego",
          ],
          popular: false,
        },
        {
          name: "Pakiet miesięczny",
          price: "1497",
          currency: "PLN",
          period: "/miesiąc",
          description: "Dla tych, którzy chcą regularnego wsparcia i strategicznego mentoringu.",
          features: [
            "4 konsultacje miesięcznie (60 min każda)",
            "Indywidualny plan działania",
            "Priorytetowe wsparcie mailowe",
            "Szablony dokumentów",
            "Przegląd strategii",
            "Bieżąca optymalizacja",
            "Dostęp do ekskluzywnych materiałów",
          ],
          popular: true,
        },
      ]

  const faqs = isEnglish
    ? [
        {
          question: "How does the consultation work?",
          answer:
            "The consultation takes place via Google Meet or Zoom. Before the meeting, I send a short questionnaire to prepare the right topics.",
        },
        {
          question: "Do I need to prepare?",
          answer:
            "It would be good if you prepared a list of questions and challenges. I will send you materials before the meeting.",
        },
        {
          question: "Can I reschedule?",
          answer: "Yes, you can reschedule the consultation up to 24 hours before the scheduled date.",
        },
        {
          question: "How do I book a consultation?",
          answer:
            "Click the 'Book consultation' button and fill in the short form. I will contact you within 24 hours.",
        },
      ]
    : [
        {
          question: "Jak wygląda konsultacja?",
          answer: "Konsultacja odbywa się przez Google Meet lub Zoom. Przed spotkaniem wysyłam krótki kwestionariusz.",
        },
        {
          question: "Czy muszę się przygotować?",
          answer: "Dobrze byłoby przygotować listę pytań i wyzwań. Przed spotkaniem wyślę Ci materiały.",
        },
        {
          question: "Czy mogę przełożyć termin?",
          answer: "Tak, termin konsultacji można przełożyć do 24 godzin przed wyznaczoną datą.",
        },
        {
          question: "Jak umówić konsultację?",
          answer: "Kliknij przycisk 'Umów konsultację' i wypełnij krótki formularz. Skontaktuję się w ciągu 24 godzin.",
        },
      ]

  return (
    <div className="min-h-screen bg-black">
      <SubpageNav lang={lang} />

      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden pt-16">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/95 to-black" />

        {/* Animated Chat Bubbles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-2xl bg-white/5 border border-white/10"
              style={{
                width: `${80 + i * 20}px`,
                height: `${40 + i * 10}px`,
                left: `${10 + i * 15}%`,
                top: `${20 + (i % 3) * 25}%`,
                animation: `float ${4 + i}s ease-in-out infinite`,
                animationDelay: `${i * 0.5}s`,
              }}
            />
          ))}
        </div>

        {/* Mock Chat Interface */}
        <div className="absolute right-10 top-1/2 -translate-y-1/2 hidden lg:block">
          <div className="w-72 bg-white/5 border border-white/10 rounded-lg overflow-hidden">
            <div className="p-3 border-b border-white/10 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-white/60 font-mono text-xs">{isEnglish ? "Online now" : "Online teraz"}</span>
            </div>
            <div className="p-4 space-y-3">
              <div className="bg-accent/20 rounded-lg rounded-bl-none p-3 max-w-[80%]">
                <p className="text-white text-sm">
                  {isEnglish ? "Hi! How can I help you? 👋" : "Cześć! W czym mogę Ci pomóc? 👋"}
                </p>
              </div>
              <div className="bg-white/10 rounded-lg rounded-br-none p-3 max-w-[80%] ml-auto">
                <p className="text-white/80 text-sm">
                  {isEnglish ? "I want to grow my business..." : "Chcę rozwinąć swój biznes..."}
                </p>
              </div>
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-accent/10 border border-accent/20 rounded-full">
            <MessageCircle className="w-4 h-4 text-accent" />
            <span className="text-accent font-mono text-sm">{isEnglish ? "1:1 Consultations" : "Konsultacje 1:1"}</span>
          </div>
          <h1 className="text-5xl md:text-8xl font-display text-white mb-6">
            {isEnglish ? (
              <>
                MARKETING
                <br />
                <span className="text-accent">CONSULTATIONS</span>
              </>
            ) : (
              <>
                KONSULTACJE
                <br />
                <span className="text-accent">MARKETINGOWE</span>
              </>
            )}
          </h1>
          <p className="text-white/60 font-mono text-sm md:text-base max-w-xl mx-auto mb-8">
            {isEnglish
              ? "Individual meetings during which we will work on your marketing strategy."
              : "Indywidualne spotkania, na których wypracujemy Twoją strategię marketingową."}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#pakiety"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-accent text-black font-mono text-sm hover:bg-accent/90 transition-colors"
            >
              {isEnglish ? "See packages" : "Zobacz pakiety"}
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>

        <style jsx>{`
          @keyframes float {
            0%, 100% { transform: translateY(0) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(2deg); }
          }
        `}</style>
      </section>

      {/* Benefits Section */}
      <section className="py-16 md:py-24 border-t border-white/10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-accent font-mono text-sm tracking-widest">
              {isEnglish ? "WHY IS IT WORTH IT" : "DLACZEGO WARTO"}
            </span>
            <h2 className="text-4xl md:text-6xl font-display text-white mt-4">
              {isEnglish ? "What do you gain?" : "Co zyskujesz?"}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="group p-6 border border-white/10 bg-white/[0.02] hover:border-accent/50 transition-all duration-300"
              >
                <benefit.icon className="w-10 h-10 text-accent mb-4" />
                <h3 className="text-xl font-display text-white mb-2">{benefit.title}</h3>
                <p className="text-white/60 font-mono text-sm">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Help Areas */}
      <section className="py-16 md:py-24 bg-white/[0.02]">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-accent font-mono text-sm tracking-widest">{isEnglish ? "AREAS" : "OBSZARY"}</span>
              <h2 className="text-4xl md:text-5xl font-display text-white mt-4 mb-6">
                {isEnglish ? "What can I help with?" : "W czym mogę pomóc?"}
              </h2>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {helpAreas.map((area, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 border border-white/10 bg-black/50 hover:border-accent/30 transition-colors"
                >
                  <Check className="w-4 h-4 text-accent flex-shrink-0" />
                  <span className="text-white/80 font-mono text-sm">{area}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Packages */}
      <section id="pakiety" className="py-16 md:py-24">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-accent font-mono text-sm tracking-widest">{isEnglish ? "OFFER" : "OFERTA"}</span>
            <h2 className="text-4xl md:text-6xl font-display text-white mt-4">
              {isEnglish ? "Choose a package" : "Wybierz pakiet"}
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {packages.map((pkg, index) => (
              <div
                key={index}
                className={`relative p-8 border ${pkg.popular ? "border-accent bg-accent/5" : "border-white/10 bg-white/[0.02]"} transition-all duration-300 hover:border-accent/50`}
              >
                {pkg.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-accent text-black font-mono text-xs">
                    {isEnglish ? "MOST POPULAR" : "NAJPOPULARNIEJSZY"}
                  </div>
                )}
                <h3 className="text-2xl font-display text-white mb-2">{pkg.name}</h3>
                <p className="text-white/60 font-mono text-sm mb-6">{pkg.description}</p>
                <div className="mb-6">
                  <span className="text-5xl font-display text-accent">{pkg.price}</span>
                  <span className="text-white/60 font-mono text-sm ml-2">
                    {pkg.currency} {pkg.period}
                  </span>
                </div>
                <ul className="space-y-3 mb-8">
                  {pkg.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <Check className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                      <span className="text-white/80 font-mono text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <a
                  href="mailto:wskopek.all@gmail.com"
                  className={`block w-full text-center py-4 font-mono text-sm transition-colors ${pkg.popular ? "bg-accent text-black hover:bg-accent/90" : "border border-white/20 text-white hover:bg-white/5"}`}
                >
                  {isEnglish ? "Book consultation" : "Umów konsultację"}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 md:py-24 border-t border-white/10">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-accent font-mono text-sm tracking-widest">FAQ</span>
            <h2 className="text-4xl md:text-5xl font-display text-white mt-4">
              {isEnglish ? "Frequently asked questions" : "Często zadawane pytania"}
            </h2>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="border border-white/10 bg-white/[0.02]">
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full flex items-center justify-between p-6 text-left"
                >
                  <span className="text-white font-display text-lg">{faq.question}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-accent transition-transform duration-300 ${openFaq === index ? "rotate-180" : ""}`}
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
      <section className="py-16 md:py-24 bg-accent/5 border-t border-accent/20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-6xl font-display text-white mb-6">
            {isEnglish ? "Ready to start?" : "Gotowa/y żeby zacząć?"}
          </h2>
          <a
            href="mailto:wskopek.all@gmail.com"
            className="inline-flex items-center gap-2 px-8 py-4 bg-accent text-black font-mono text-sm hover:bg-accent/90 transition-colors"
          >
            {isEnglish ? "Book consultation" : "Umów konsultację"}
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </section>
    </div>
  )
}
