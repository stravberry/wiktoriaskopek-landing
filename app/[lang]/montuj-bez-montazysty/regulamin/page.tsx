import type { Metadata } from "next"
import { MF_TERMS_VERSION } from "@/lib/mf/config"
import { TERMS_SECTIONS } from "@/lib/mf/legal"
import { LegalPage, sectionId } from "@/components/mf/legal-page"
import { nobr } from "@/lib/typo"

export const metadata: Metadata = {
  title: "Regulamin sprzedaży MontageFrames | Wiktoria Skopek",
  description: "Regulamin sprzedaży programu MontageFrames i konsultacji 1:1: zamówienie, płatność, dostawa, odstąpienie od umowy, reklamacje i gwarancja działania.",
  alternates: { canonical: "https://www.wiktoriaskopek.pl/montuj-bez-montazysty/regulamin" },
}

// Kotwica #proba (§14, darmowa próba) jest używana w linkach z próby.
const idFor = (title: string) => (title.startsWith("§14") ? "proba" : sectionId(title))

export default function RegulaminMf() {
  return (
    <LegalPage
      bare
      eyebrow="MontageFrames"
      title="Regulamin sprzedaży MontageFrames"
      updated={<>Wersja: {MF_TERMS_VERSION}, obowiązuje od 26 listopada 2026. Wersję zapisujemy przy każdym zamówieniu i wysyłamy w mailu po zakupie.</>}
      toc={TERMS_SECTIONS.map((s) => ({ id: idFor(s.title), title: s.title }))}
    >
      {TERMS_SECTIONS.map((s) => (
        <section key={s.title} id={idFor(s.title)}>
          <h2>{s.title}</h2>
          <ol>
            {s.items.map((t) => <li key={t}>{nobr(t)}</li>)}
          </ol>
        </section>
      ))}
    </LegalPage>
  )
}
