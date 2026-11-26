import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { currentBuyer, mfEnv } from "@/lib/mf/server"
import { MF_STYLES } from "@/lib/mf/content"
import { TRIAL_API, TRIAL_CONSENT_TEXT, TRIAL_CONSENT_VERSION, TRIAL_FONTS, TRIAL_LIMITS } from "@/lib/mf/trial"
import { TRIAL_FONT_FAMILY } from "@/lib/mf/trial-fonts"
import { TrialApp, TrialExample, TrialStart } from "@/components/mf/trial-app"
import { BuyDialog } from "@/components/mf/buy"

export const dynamic = "force-dynamic"
export const metadata: Metadata = {
  title: "Zrób swoją pierwszą rolkę za darmo | MontageFrames",
  description: "Ustaw markę, wybierz styl, wgraj nagranie do 60 sekund i zobacz rolkę w swoich kolorach. Bez karty, wystarczy e-mail.",
  alternates: { canonical: "https://www.wiktoriaskopek.pl/pl/montuj-bez-montazysty/proba" },
}

const HOW = [
  ["Ustaw markę", "Kolory, font i logo."],
  ["Wybierz styl", "Z galerii prawdziwych rolek."],
  ["Wgraj nagranie", "Do 60 s z telefonu."],
  ["Odbierz rolkę", "Gotowa w kilka minut."],
] as const

// Darmowa próba (00-PLAN 0e): 1 rolka na konto, do 60 s, znak wodny, usuwanie po 7 dniach. Teksty: audyt Kierownika (B).
export default async function Proba() {
  if (process.env.MF_TRIAL_ENABLED !== "1" || mfEnv().disabled) notFound()
  const email = await currentBuyer()
  return (
    <main className="mf-wrap pb-24 pt-10 md:pt-16">
      <h1 className="mf-h2 max-w-[18ch]">Zrób swoją pierwszą rolkę za darmo</h1>
      {email ? (
        <div className="mt-8">
          <TrialApp
            api={TRIAL_API}
            styles={MF_STYLES}
            fonts={TRIAL_FONTS}
            fontFamilies={TRIAL_FONT_FAMILY}
            limits={TRIAL_LIMITS}
            consentText={TRIAL_CONSENT_TEXT}
            consentVersion={TRIAL_CONSENT_VERSION}
            mailWhenReady={process.env.MF_TRIAL_MAIL === "1"}
          />
        </div>
      ) : (
        <div className="mt-8 grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-16">
          <div>
            <p className="mf-lead max-w-[48ch]">Zobacz MontageFrames na swoim nagraniu. Bez karty, wystarczy e-mail.</p>
            <ol className="mt-8 grid gap-3 sm:grid-cols-2">
              {HOW.map(([t, d], i) => (
                <li key={t} className="flex items-start gap-3 rounded-[20px] bg-[var(--h-surface)] p-4">
                  <span className="grid size-8 shrink-0 place-items-center rounded-full bg-[var(--h-accent)] text-[15px] font-bold text-[#111111]">{i + 1}</span>
                  <span>
                    <span className="block text-[17px] font-semibold">{t}</span>
                    <span className="block text-[15px] text-[var(--h-ink-2)]">{d}</span>
                  </span>
                </li>
              ))}
            </ol>
            <div className="mt-8 max-w-[560px]">
              <TrialStart />
            </div>
            <p className="mt-6 max-w-[60ch] text-[15px] leading-[1.6] text-[var(--h-ink-2)]">
              Jedna rolka na konto, ze znakiem wodnym. Nagranie usuwamy zaraz po montażu, a rolkę po 7 dniach. Pełna wersja działa na Twoim komputerze w Claude
              Code (płatny plan Claude Pro lub Max, min. 15 GB miejsca).
            </p>
          </div>
          <TrialExample />
        </div>
      )}
      <BuyDialog />
    </main>
  )
}
