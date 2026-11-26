import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import type { Metadata } from "next"
import type { Locale } from "@/lib/translations"
import { PRIVACY_SECTIONS, PRIVACY_UPDATED } from "@/lib/privacy-policy"

export const metadata: Metadata = {
  title: "Polityka Prywatności | Wiktoria Skopek",
  description: "Polityka prywatności strony wiktoriaskopek.pl",
  robots: { index: true, follow: true },
}

export default async function PolitykaPrywatnosci({
  params,
}: {
  params: Promise<{ lang: Locale }>
}) {
  const { lang } = await params

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      {/* Top Bar */}
      <div className="sticky top-0 z-50 border-b border-white/5 bg-[#050505]/80 backdrop-blur-md">
        <div className="max-w-4xl mx-auto px-4 md:px-8 h-16 flex items-center">
          <Link
            href={`/${lang}`}
            className="group inline-flex items-center gap-3 font-sans text-xs tracking-widest uppercase text-white/50 hover:text-white transition-colors duration-300"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
            Powrót do strony głównej
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-16 md:py-24">
        
        {/* Header */}
        <div className="mb-14 md:mb-20">
          <span className="font-sans text-accent text-xs tracking-[.3em] uppercase inline-block mb-6 opacity-80 font-bold">
            Dokument prawny
          </span>
          <h1 className="font-display text-[clamp(2.5rem,8vw,5rem)] leading-[0.85] text-white tracking-tighter mb-6">
            POLITYKA
            <br />
            <span
              style={{
                background: "linear-gradient(135deg, #ff6600, #ff8533)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              PRYWATNOŚCI
            </span>
          </h1>
          <p className="font-sans text-white/40 text-sm">
            Ostatnia aktualizacja: {PRIVACY_UPDATED}
          </p>
        </div>

        {/* Divider */}
        <div className="h-px bg-white/5 mb-14" />

        {/* Sections: treść w lib/privacy-policy.ts (wersja zapisywana przy zgodach) */}
        <div className="space-y-12 font-sans">
          {PRIVACY_SECTIONS.map((sec) => (
            <section key={sec.title}>
              <h2 className="font-display text-2xl md:text-3xl text-white tracking-wide mb-4 uppercase">{sec.title}</h2>
              <div className="space-y-4">
                {sec.items.map((t) => (
                  <p key={t} className="text-white/65 text-base md:text-lg leading-relaxed">{t}</p>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* Divider */}
        <div className="h-px bg-white/5 mt-14 mb-12" />

        {/* Back CTA */}
        <div className="flex justify-center">
          <Link
            href={`/${lang}`}
            className="group inline-flex items-center gap-3 px-8 py-4 rounded-full font-sans text-xs tracking-widest uppercase text-white/70 hover:text-white border border-white/10 hover:border-white/30 transition-all duration-300"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
            Wróć na stronę główną
          </Link>
        </div>

      </div>
    </div>
  )
}
