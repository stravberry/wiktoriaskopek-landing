import type { Metadata } from "next"
import { CHAPTERS } from "@/lib/mf/poradnik"
import { requireBuyer } from "@/lib/mf/guard"
import { PoradnikSearch } from "@/components/mf/poradnik-view"
import { Todo } from "@/components/mf/ui"

export const dynamic = "force-dynamic"
export const metadata: Metadata = { title: "Poradnik | MontageFrames", robots: { index: false, follow: false } }

export default async function Poradnik() {
  const email = await requireBuyer()
  return (
    <main className="mx-auto max-w-[820px] px-5 pb-36 pt-12 md:px-10 md:pt-20">
      <h1 className="text-[clamp(2rem,5vw,3.5rem)] font-bold leading-[1.05] tracking-[-0.035em]">Poradnik MontageFrames</h1>
      <p className="mt-4 mb-8 text-[18px] text-[var(--h-ink-2)]">
        Od instalacji do pierwszej rolki. Wersja do pobrania: <Todo />
      </p>
      <PoradnikSearch chapters={CHAPTERS} />
      <p className="mt-16 text-[13px] text-[var(--h-ink-2)]">Licencja dla: {email}. Nie udostępniaj poradnika innym osobom.</p>
    </main>
  )
}
