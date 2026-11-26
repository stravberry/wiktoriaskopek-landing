import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { MF_STYLES } from "@/lib/mf/content"
import { TRIAL_CONSENT_TEXT, TRIAL_CONSENT_VERSION, TRIAL_FONTS, TRIAL_LIMITS } from "@/lib/mf/trial"
import { TRIAL_FONT_FAMILY } from "@/lib/mf/trial-fonts"
import { TrialPreview } from "@/components/mf/trial-app"

export const metadata: Metadata = { title: "Podgląd kroków próby | MontageFrames", robots: { index: false, follow: false } }

// Wszystkie kroki darmowej próby na przykładowych danych: do sprawdzania układu (320–1440 px) i testu overflow w CI.
// Na produkcji 404. Zdarzenia lejka są tu wyłączone (data-mf-preview).
export default function ProbaUi() {
  if (process.env.VERCEL_ENV === "production") notFound()
  return (
    <main className="mf-wrap pb-24 pt-10">
      <script dangerouslySetInnerHTML={{ __html: "document.documentElement.dataset.mfPreview='1'" }} />
      <h1 className="text-[clamp(1.5rem,2.6vw,2rem)] font-bold tracking-[-0.02em]">Podgląd kroków próby</h1>
      <div className="mt-8">
        <TrialPreview styles={MF_STYLES} fonts={TRIAL_FONTS} fontFamilies={TRIAL_FONT_FAMILY} limits={TRIAL_LIMITS} consentText={TRIAL_CONSENT_TEXT} consentVersion={TRIAL_CONSENT_VERSION} />
      </div>
    </main>
  )
}
