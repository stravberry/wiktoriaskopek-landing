import type { Metadata } from "next"
import { PRIVACY_SECTIONS, PRIVACY_UPDATED } from "@/lib/privacy-policy"
import { LegalPage, sectionId } from "@/components/mf/legal-page"
import { pageAlternates } from "@/lib/seo"
import { nobr } from "@/lib/typo"

export const metadata: Metadata = {
  title: "Polityka prywatności i cookies | Wiktoria Skopek",
  description: "Polityka prywatności i plików cookies wiktoriaskopek.pl: kto przetwarza Twoje dane, w jakim celu, jak długo i jakie masz prawa.",
  robots: { index: true, follow: true },
  alternates: pageAlternates("/polityka-prywatnosci"),
}

// Kotwice używane w linkach: #proba (sekcja 2, z darmowej próby), #cookies (sekcja 3), #audyt (sekcja 8, audyt Instagrama).
const idFor = (title: string) => (title.startsWith("2.") ? "proba" : title.startsWith("3.") ? "cookies" : title.startsWith("8.") ? "audyt" : sectionId(title))

export default function PolitykaPrywatnosci() {
  return (
    <LegalPage
      eyebrow="Dokument prawny"
      title="Polityka prywatności i cookies"
      updated={<>Ostatnia aktualizacja: {PRIVACY_UPDATED}</>}
      toc={PRIVACY_SECTIONS.map((s) => ({ id: idFor(s.title), title: s.title }))}
    >
      {PRIVACY_SECTIONS.map((sec) => (
        <section key={sec.title} id={idFor(sec.title)}>
          <h2>{sec.title}</h2>
          <div>
            {sec.items.map((t) => (
              <p key={t}>{nobr(t)}</p>
            ))}
          </div>
        </section>
      ))}
    </LegalPage>
  )
}
