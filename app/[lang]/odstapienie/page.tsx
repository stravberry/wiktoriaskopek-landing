import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Fustat } from "next/font/google"
import { SELLER } from "@/lib/mf/config"
import { WithdrawalForm } from "@/components/mf/account-forms"
import { nobr } from "@/lib/typo"

const fustat = Fustat({ subsets: ["latin", "latin-ext"], display: "swap" })
export const metadata: Metadata = { title: "Odstąp od umowy | Wiktoria Skopek", robots: { index: false, follow: true } }

export default async function Odstapienie({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  if (lang !== "pl") notFound()
  return (
    <div className={`${fustat.className} home min-h-dvh bg-[var(--h-bg)] text-[var(--h-ink)]`}>
      <main className="mx-auto max-w-[720px] px-5 pb-36 pt-12 md:px-10 md:pt-20">
        <h1 className="text-[clamp(2rem,5vw,3.5rem)] font-bold leading-[1.05] tracking-[-0.035em]">Odstąp od umowy</h1>
        <p className="mt-4 text-[17px] leading-[1.6] text-[var(--h-ink-2)]">
          Konsument ma 14 dni na odstąpienie od umowy bez podania przyczyny. Przy programie MontageFrames prawo to wygasa po rozpoczęciu dostarczania,
          jeśli <span className="whitespace-nowrap">wyraziłeś/-aś</span> na to zgodę przed płatnością. Przy konsultacji zasady opisuje §6 <Link className="underline" href="/pl/montuj-bez-montazysty/regulamin">regulaminu</Link>.
          Oświadczenie możesz też wysłać mailem na <a className="underline" href={`mailto:${SELLER.email}`}>{SELLER.email}</a>.
        </p>
        <div className="mt-8 rounded-[28px] bg-[var(--h-surface)] p-7">
          <WithdrawalForm />
        </div>
        <p className="mt-6 text-[13px] text-[var(--h-ink-2)]">Adresat: {SELLER.name}, {nobr(SELLER.address)}.</p>
      </main>
    </div>
  )
}
