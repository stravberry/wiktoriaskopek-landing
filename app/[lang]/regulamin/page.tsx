import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import type { Metadata } from "next"
import type { Locale } from "@/lib/translations"

export const metadata: Metadata = {
  title: "Regulamin | Wiktoria Skopek",
  description: "Regulamin korzystania ze strony wiktoriaskopek.pl",
  robots: { index: false, follow: false },
}

export default async function Regulamin({
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
            REGULAMIN
            <br />
            <span
              style={{
                background: "linear-gradient(135deg, #ff6600, #ff8533)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              STRONY
            </span>
          </h1>
          <p className="font-sans text-white/40 text-sm">
            Ostatnia aktualizacja: 30 kwietnia 2025
          </p>
        </div>

        {/* Divider */}
        <div className="h-px bg-white/5 mb-14" />

        {/* Sections */}
        <div className="space-y-12 font-sans">

          <section>
            <h2 className="font-display text-2xl md:text-3xl text-white tracking-wide mb-4 uppercase">
              1. Właściciel Strony
            </h2>
            <p className="text-white/65 text-base md:text-lg leading-relaxed">
              Właścicielem i administratorem strony internetowej{" "}
              <span className="text-white font-medium">wiktoriaskopek.pl</span> jest{" "}
              <span className="text-white font-medium">Wiktoria Skopek</span> — specjalistka
              ds. marketingu wideo i skalowania marek osobistych. Strona ma charakter
              informacyjno-marketingowy i służy prezentacji oferty usług.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl md:text-3xl text-white tracking-wide mb-4 uppercase">
              2. Korzystanie ze Strony
            </h2>
            <p className="text-white/65 text-base md:text-lg leading-relaxed mb-4">
              Korzystanie ze strony jest dobrowolne i bezpłatne. Użytkownik zobowiązuje się
              do korzystania ze strony zgodnie z obowiązującym prawem, zasadami współżycia
              społecznego oraz postanowieniami niniejszego regulaminu.
            </p>
            <p className="text-white/65 text-base md:text-lg leading-relaxed">
              Zabronione jest podejmowanie działań mogących zakłócić działanie strony,
              w szczególności: rozsyłanie spamu, umieszczanie złośliwego oprogramowania,
              kopiowanie treści bez zgody właściciela.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl md:text-3xl text-white tracking-wide mb-4 uppercase">
              3. Treści na Stronie
            </h2>
            <p className="text-white/65 text-base md:text-lg leading-relaxed mb-4">
              Wszystkie treści zamieszczone na stronie (teksty, grafiki, logotypy, materiały
              wideo) stanowią własność Wiktorii Skopek lub podmiotów współpracujących
              i są chronione prawem autorskim.
            </p>
            <p className="text-white/65 text-base md:text-lg leading-relaxed">
              Kopiowanie, powielanie lub wykorzystywanie treści w celach komercyjnych bez
              pisemnej zgody właściciela jest zabronione. Cytowanie dozwolone przy
              podaniu źródła.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl md:text-3xl text-white tracking-wide mb-4 uppercase">
              4. Formularz Kontaktowy
            </h2>
            <p className="text-white/65 text-base md:text-lg leading-relaxed">
              Skorzystanie z formularza kontaktowego jest równoznaczne z wyrażeniem zgody
              na kontakt zwrotny ze strony Wiktorii Skopek lub jej zespołu w celu omówienia
              zapytania. Dane podane w formularzu nie są wykorzystywane w żadnym innym celu
              ani udostępniane podmiotom trzecim.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl md:text-3xl text-white tracking-wide mb-4 uppercase">
              5. Odpowiedzialność
            </h2>
            <p className="text-white/65 text-base md:text-lg leading-relaxed mb-4">
              Właściciel strony dokłada starań, aby informacje zawarte na stronie były
              aktualne i rzetelne, jednak nie gwarantuje ich kompletności ani
              niezmienności w czasie. Treści mają charakter informacyjny i nie stanowią
              oferty handlowej w rozumieniu Kodeksu Cywilnego.
            </p>
            <p className="text-white/65 text-base md:text-lg leading-relaxed">
              Właściciel nie ponosi odpowiedzialności za treści zamieszczone na stronach
              zewnętrznych, do których prowadzą linki umieszczone na stronie.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl md:text-3xl text-white tracking-wide mb-4 uppercase">
              6. Zmiany Regulaminu
            </h2>
            <p className="text-white/65 text-base md:text-lg leading-relaxed">
              Właściciel zastrzega sobie prawo do zmiany niniejszego regulaminu w dowolnym
              czasie. Zmiany wchodzą w życie z chwilą opublikowania zaktualizowanej wersji
              na stronie. Data ostatniej aktualizacji jest widoczna na początku dokumentu.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl md:text-3xl text-white tracking-wide mb-4 uppercase">
              7. Kontakt
            </h2>
            <p className="text-white/65 text-base md:text-lg leading-relaxed">
              Wszelkie pytania dotyczące regulaminu lub funkcjonowania strony można kierować
              przez formularz kontaktowy dostępny na stronie głównej lub bezpośrednio
              na adres e-mail podany w stopce strony.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl md:text-3xl text-white tracking-wide mb-4 uppercase">
              8. Prawo Właściwe
            </h2>
            <p className="text-white/65 text-base md:text-lg leading-relaxed">
              Niniejszy regulamin podlega prawu polskiemu. Wszelkie spory wynikłe
              z korzystania ze strony będą rozstrzygane przez właściwy sąd polski.
            </p>
          </section>

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
