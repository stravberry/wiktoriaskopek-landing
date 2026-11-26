import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { currentBuyer, mfEnv } from "@/lib/mf/server"
import { TRIAL_API, TRIAL_CONSENT_TEXT, TRIAL_CONSENT_VERSION, TRIAL_FONTS, TRIAL_LIMITS, TRIAL_STYLES } from "@/lib/mf/trial"
import { TrialApp, TrialStart } from "@/components/mf/trial-app"
import { BuyDialog } from "@/components/mf/buy"

export const dynamic = "force-dynamic"
export const metadata: Metadata = {
  title: "Zrób swoją pierwszą rolkę za darmo | MontageFrames",
  description: "Ustaw markę, wgraj nagranie do 60 sekund i zobacz rolkę w swoich kolorach. Bez karty, wystarczy e-mail.",
  alternates: { canonical: "https://www.wiktoriaskopek.pl/pl/montuj-bez-montazysty/proba" },
}

// Darmowa próba (00-PLAN 0e): 1 rolka na konto, do 60 s, znak wodny, usuwanie po 7 dniach. Teksty: audyt Kierownika (B).
export default async function Proba() {
  if (process.env.MF_TRIAL_ENABLED !== "1" || mfEnv().disabled) notFound()
  const email = await currentBuyer()
  return (
    <main className="mf-wrap pb-24 pt-12 md:pt-20">
      <h1 className="mf-h2 max-w-[18ch]">Zrób swoją pierwszą rolkę za darmo</h1>
      <p className="mf-lead mt-5 max-w-[56ch]">Ustaw markę, wgraj nagranie do 60 sekund i zobacz rolkę w swoich kolorach. Bez karty, wystarczy e-mail.</p>
      <ul className="mt-6 flex max-w-[64ch] list-disc flex-col gap-2 pl-5 text-[15px] leading-[1.6] text-[var(--h-ink-2)]">
        <li>Jedna rolka na konto, ze znakiem wodnym. Nagranie usuwamy zaraz po montażu, a rolkę po 7 dniach.</li>
        <li>Próba działa w przeglądarce. Pełna wersja działa na Twoim komputerze w Claude Code (płatny plan Claude Pro lub Max, min. 15 GB miejsca).</li>
      </ul>
      <div className="mt-10 max-w-[900px]">
        {email ? (
          <TrialApp api={TRIAL_API} styles={TRIAL_STYLES.map(({ id, name, description, inspiredBy }) => ({ id, name, description, inspiredBy }))} fonts={TRIAL_FONTS} limits={TRIAL_LIMITS} consentText={TRIAL_CONSENT_TEXT} consentVersion={TRIAL_CONSENT_VERSION} />
        ) : (
          <TrialStart />
        )}
      </div>
      <BuyDialog />
    </main>
  )
}
