import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import type { Metadata } from "next"
import type { Locale } from "@/lib/translations"

export const metadata: Metadata = {
  title: "Polityka Prywatności | Wiktoria Skopek",
  description: "Polityka prywatności strony wiktoriaskopek.pl",
  robots: { index: false, follow: false },
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
            Ostatnia aktualizacja: 30 kwietnia 2025
          </p>
        </div>

        {/* Divider */}
        <div className="h-px bg-white/5 mb-14" />

        {/* Sections */}
        <div className="space-y-12 font-sans">

          <section>
            <h2 className="font-display text-2xl md:text-3xl text-white tracking-wide mb-4 uppercase">
              1. Administrator Strony
            </h2>
            <p className="text-white/65 text-base md:text-lg leading-relaxed">
              Administratorem strony internetowej dostępnej pod adresem{" "}
              <span className="text-white font-medium">wiktoriaskopek.pl</span> jest{" "}
              <span className="text-white font-medium">Wiktoria Skopek</span> — osoba fizyczna
              prowadząca działalność w zakresie marketingu wideo i doradztwa strategicznego.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl md:text-3xl text-white tracking-wide mb-4 uppercase">
              2. Zakres Przetwarzania Danych
            </h2>
            <p className="text-white/65 text-base md:text-lg leading-relaxed mb-4">
              Niniejsza strona jest prostym landing page&apos;em informacyjnym. Nie zbieramy,
              nie przechowujemy ani nie przetwarzamy Twoich danych osobowych w sposób
              automatyczny — z wyjątkiem danych podanych dobrowolnie przez formularz kontaktowy.
            </p>
            <p className="text-white/65 text-base md:text-lg leading-relaxed">
              Dane podane w formularzu kontaktowym (imię, adres e-mail, numer telefonu, treść
              wiadomości) są przekazywane wyłącznie do administratora w celu udzielenia
              odpowiedzi na zapytanie. Nie są udostępniane podmiotom trzecim ani
              wykorzystywane w celach marketingowych.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl md:text-3xl text-white tracking-wide mb-4 uppercase">
              3. Pliki Cookie i Śledzenie
            </h2>
            <p className="text-white/65 text-base md:text-lg leading-relaxed">
              Strona <span className="text-white font-medium">nie używa plików cookie</span>,
              narzędzi analitycznych (np. Google Analytics) ani żadnych innych technologii
              śledzących zachowanie użytkowników. Nie zbieramy danych o Twoich odwiedzinach,
              urządzeniu ani lokalizacji.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl md:text-3xl text-white tracking-wide mb-4 uppercase">
              4. Serwisy Zewnętrzne
            </h2>
            <p className="text-white/65 text-base md:text-lg leading-relaxed">
              Strona może zawierać linki do zewnętrznych serwisów (np. podcastkatowice.pl,
              adify.pl). Administrator nie ponosi odpowiedzialności za politykę prywatności
              tych witryn. Zalecamy zapoznanie się z polityką prywatności każdego odwiedzanego
              serwisu.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl md:text-3xl text-white tracking-wide mb-4 uppercase">
              5. Prawa Użytkownika
            </h2>
            <p className="text-white/65 text-base md:text-lg leading-relaxed">
              Na podstawie RODO przysługuje Ci prawo dostępu do swoich danych, ich
              sprostowania, usunięcia lub ograniczenia przetwarzania. W celu realizacji
              powyższych praw prosimy o kontakt przez formularz na stronie lub bezpośrednio
              drogą e-mailową.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl md:text-3xl text-white tracking-wide mb-4 uppercase">
              6. Zmiany Polityki
            </h2>
            <p className="text-white/65 text-base md:text-lg leading-relaxed">
              Administrator zastrzega sobie prawo do zmiany niniejszej polityki prywatności.
              Zmiany wchodzą w życie z chwilą opublikowania ich na stronie. Data ostatniej
              aktualizacji jest widoczna na początku dokumentu.
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
