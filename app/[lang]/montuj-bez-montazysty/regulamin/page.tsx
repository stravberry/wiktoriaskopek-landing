import type { Metadata } from "next"
import { MF_TERMS_VERSION } from "@/lib/mf/config"
import { TERMS_SECTIONS } from "@/lib/mf/legal"

export const metadata: Metadata = { title: "Regulamin sprzedaży MontageFrames | Wiktoria Skopek" }

export default function RegulaminMf() {
  return (
    <main className="mx-auto max-w-[820px] px-5 pb-36 pt-12 md:px-10 md:pt-20">
      <h1 className="text-[clamp(2rem,5vw,3.5rem)] font-bold leading-[1.05] tracking-[-0.035em]">Regulamin sprzedaży MontageFrames</h1>
      <p className="mt-3 text-[15px] text-[var(--h-ink-2)]">Wersja: {MF_TERMS_VERSION}. Wersję zapisujemy przy każdym zamówieniu i wysyłamy w mailu po zakupie.</p>
      <div className="mt-10 flex flex-col gap-10">
        {TERMS_SECTIONS.map((s) => (
          <section key={s.title}>
            <h2 className="text-[22px] font-semibold tracking-[-0.01em]">{s.title}</h2>
            <ol className="mt-4 flex list-decimal flex-col gap-3 pl-6 text-[16px] leading-[1.65]">
              {s.items.map((t) => <li key={t}>{t}</li>)}
            </ol>
          </section>
        ))}
      </div>
    </main>
  )
}
