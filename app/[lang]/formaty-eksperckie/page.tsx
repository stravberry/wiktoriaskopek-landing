"use client"
import { useParams } from "next/navigation"
import Link from "next/link"
import { ArrowRight, Mic, Video, Users, BookOpen } from "lucide-react"
import type { Locale } from "@/lib/translations"
import SubpageNav from "@/components/subpage-nav"

export default function FormatyEkspercklePage() {
  const params = useParams()
  const lang = (params.lang as Locale) || "pl"
  const isEnglish = lang === "en"

  const formats = isEnglish
    ? [
        { icon: Mic, title: "Expert Podcasts", description: "Professional podcast production for industry leaders" },
        { icon: Video, title: "Video Series", description: "Educational video content for your audience" },
        { icon: Users, title: "Webinars", description: "Live and recorded webinar production" },
        { icon: BookOpen, title: "Online Courses", description: "Complete course production and distribution" },
      ]
    : [
        {
          icon: Mic,
          title: "Podcasty eksperckie",
          description: "Profesjonalna produkcja podcastów dla liderów branży",
        },
        { icon: Video, title: "Serie wideo", description: "Edukacyjny content wideo dla Twojej grupy docelowej" },
        { icon: Users, title: "Webinary", description: "Produkcja webinarów na żywo i nagranych" },
        { icon: BookOpen, title: "Kursy online", description: "Kompleksowa produkcja i dystrybucja kursów" },
      ]

  return (
    <div className="min-h-screen bg-black">
      <SubpageNav lang={lang} />

      {/* Hero */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden pt-16">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/95 to-black" />

        <div className="absolute inset-0 overflow-hidden opacity-20">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 border border-accent/30 rounded-full animate-pulse" />
          <div
            className="absolute bottom-1/4 right-1/4 w-48 h-48 border border-white/20 rounded-full"
            style={{ animation: "ping 3s cubic-bezier(0, 0, 0.2, 1) infinite" }}
          />
        </div>

        <div className="relative z-10 text-center px-4">
          <span className="text-accent font-mono text-sm tracking-widest mb-4 block">
            {isEnglish ? "FOR EXPERTS" : "DLA EKSPERTÓW"}
          </span>
          <h1 className="text-5xl md:text-8xl font-display text-white mb-6">
            {isEnglish ? "EXPERT FORMATS" : "FORMATY EKSPERCKIE"}
          </h1>
          <p className="text-white/60 font-mono text-sm md:text-base max-w-xl mx-auto">
            {isEnglish
              ? "Professional content production for experts, thought leaders and brands that want to share knowledge."
              : "Profesjonalna produkcja contentu dla ekspertów, liderów opinii i marek, które chcą dzielić się wiedzą."}
          </p>
        </div>
      </section>

      {/* Formats Grid */}
      <section className="py-16 md:py-24 border-t border-white/10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {formats.map((format, index) => (
              <div
                key={index}
                className="group p-6 border border-white/10 bg-white/[0.02] hover:border-accent/50 transition-all duration-300"
              >
                <format.icon className="w-10 h-10 text-accent mb-4" />
                <h3 className="text-xl font-display text-white mb-2">{format.title}</h3>
                <p className="text-white/60 font-mono text-sm">{format.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 border-t border-white/10">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-6xl font-display text-white mb-6">
            {isEnglish ? "Let's create something together" : "Stwórzmy coś razem"}
          </h2>
          <Link
            href={`/${lang}/konsultacje`}
            className="inline-flex items-center gap-2 px-8 py-4 bg-accent text-black font-mono text-sm hover:bg-accent/90 transition-colors"
          >
            {isEnglish ? "Book consultation" : "Umów konsultację"}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  )
}
