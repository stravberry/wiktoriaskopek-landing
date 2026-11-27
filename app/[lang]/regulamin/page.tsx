import type { Metadata } from "next"
import { LegalPage, sectionId } from "@/components/mf/legal-page"
import { pageAlternates } from "@/lib/seo"

export const metadata: Metadata = {
  title: "Regulamin strony | Wiktoria Skopek",
  description: "Regulamin korzystania ze strony wiktoriaskopek.pl",
  robots: { index: false, follow: false },
  alternates: pageAlternates("/regulamin"),
}

// Treść regulaminu bez zmian (porządki 27.11 zmieniły tylko wygląd: design system, spis treści).
const TOC = [
  { id: sectionId('1. Właściciel Strony'), title: '1. Właściciel Strony' },
  { id: sectionId('2. Korzystanie ze Strony'), title: '2. Korzystanie ze Strony' },
  { id: sectionId('3. Treści na Stronie'), title: '3. Treści na Stronie' },
  { id: sectionId('4. Formularz Kontaktowy'), title: '4. Formularz Kontaktowy' },
  { id: sectionId('5. Odpowiedzialność'), title: '5. Odpowiedzialność' },
  { id: sectionId('6. Zmiany Regulaminu'), title: '6. Zmiany Regulaminu' },
  { id: sectionId('7. Kontakt'), title: '7. Kontakt' },
  { id: sectionId('8. Prawo Właściwe'), title: '8. Prawo Właściwe' },
]

export default function Regulamin() {
  return (
    <LegalPage eyebrow="Dokument prawny" title="Regulamin strony" updated={<>Ostatnia aktualizacja: 30 kwietnia 2025</>} toc={TOC}>


          <section id={sectionId('1. Właściciel Strony')}>
            <h2>
              1. Właściciel Strony
            </h2>
            <p>
              Właścicielem i administratorem strony internetowej{" "}
              <span>wiktoriaskopek.pl</span> jest{" "}
              <span>Wiktoria Skopek</span> — specjalistka
              ds. marketingu wideo i skalowania marek osobistych. Strona ma charakter
              informacyjno-marketingowy i służy prezentacji oferty usług.
            </p>
          </section>

          <section id={sectionId('2. Korzystanie ze Strony')}>
            <h2>
              2. Korzystanie ze Strony
            </h2>
            <p>
              Korzystanie ze strony jest dobrowolne i bezpłatne. Użytkownik zobowiązuje się
              do korzystania ze strony zgodnie z obowiązującym prawem, zasadami współżycia
              społecznego oraz postanowieniami niniejszego regulaminu.
            </p>
            <p>
              Zabronione jest podejmowanie działań mogących zakłócić działanie strony,
              w szczególności: rozsyłanie spamu, umieszczanie złośliwego oprogramowania,
              kopiowanie treści bez zgody właściciela.
            </p>
          </section>

          <section id={sectionId('3. Treści na Stronie')}>
            <h2>
              3. Treści na Stronie
            </h2>
            <p>
              Wszystkie treści zamieszczone na stronie (teksty, grafiki, logotypy, materiały
              wideo) stanowią własność Wiktorii Skopek lub podmiotów współpracujących
              i są chronione prawem autorskim.
            </p>
            <p>
              Kopiowanie, powielanie lub wykorzystywanie treści w celach komercyjnych bez
              pisemnej zgody właściciela jest zabronione. Cytowanie dozwolone przy
              podaniu źródła.
            </p>
          </section>

          <section id={sectionId('4. Formularz Kontaktowy')}>
            <h2>
              4. Formularz Kontaktowy
            </h2>
            <p>
              Skorzystanie z formularza kontaktowego jest równoznaczne z wyrażeniem zgody
              na kontakt zwrotny ze strony Wiktorii Skopek lub jej zespołu w celu omówienia
              zapytania. Dane podane w formularzu nie są wykorzystywane w żadnym innym celu
              ani udostępniane podmiotom trzecim.
            </p>
          </section>

          <section id={sectionId('5. Odpowiedzialność')}>
            <h2>
              5. Odpowiedzialność
            </h2>
            <p>
              Właściciel strony dokłada starań, aby informacje zawarte na stronie były
              aktualne i rzetelne, jednak nie gwarantuje ich kompletności ani
              niezmienności w czasie. Treści mają charakter informacyjny i nie stanowią
              oferty handlowej w rozumieniu Kodeksu Cywilnego.
            </p>
            <p>
              Właściciel nie ponosi odpowiedzialności za treści zamieszczone na stronach
              zewnętrznych, do których prowadzą linki umieszczone na stronie.
            </p>
          </section>

          <section id={sectionId('6. Zmiany Regulaminu')}>
            <h2>
              6. Zmiany Regulaminu
            </h2>
            <p>
              Właściciel zastrzega sobie prawo do zmiany niniejszego regulaminu w dowolnym
              czasie. Zmiany wchodzą w życie z chwilą opublikowania zaktualizowanej wersji
              na stronie. Data ostatniej aktualizacji jest widoczna na początku dokumentu.
            </p>
          </section>

          <section id={sectionId('7. Kontakt')}>
            <h2>
              7. Kontakt
            </h2>
            <p>
              Wszelkie pytania dotyczące regulaminu lub funkcjonowania strony można kierować
              przez formularz kontaktowy dostępny na stronie głównej lub bezpośrednio
              na adres e-mail podany w stopce strony.
            </p>
          </section>

          <section id={sectionId('8. Prawo Właściwe')}>
            <h2>
              8. Prawo Właściwe
            </h2>
            <p>
              Niniejszy regulamin podlega prawu polskiemu. Wszelkie spory wynikłe
              z korzystania ze strony będą rozstrzygane przez właściwy sąd polski.
            </p>
          </section>

        
    </LegalPage>
  )
}
