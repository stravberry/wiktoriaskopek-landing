import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { MF_TERMS_VERSION, SELLER } from "@/lib/mf/config"
import { WithdrawalForm } from "@/components/mf/account-forms"
import { LegalPage } from "@/components/mf/legal-page"
import { nobr } from "@/lib/typo"

export const metadata: Metadata = { title: "Odstąp od umowy | Wiktoria Skopek", robots: { index: false, follow: true } }

export default async function Odstapienie({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  if (lang !== "pl") notFound()
  return (
    <LegalPage
      eyebrow="Dokument prawny"
      title="Odstąp od umowy"
      updated={<>Zasady odstąpienia opisuje regulamin sprzedaży (wersja {MF_TERMS_VERSION}).</>}
      toc={[{ id: "zasady", title: "Zasady" }, { id: "formularz", title: "Formularz odstąpienia" }]}
    >
      <section id="zasady">
        <h2>Zasady</h2>
        <p>
          Konsument ma 14 dni na odstąpienie od umowy bez podania przyczyny. Przy programie MontageFrames prawo to wygasa po rozpoczęciu dostarczania,
          jeśli <span className="whitespace-nowrap">wyraziłeś/-aś</span> na to zgodę przed płatnością. Przy konsultacji zasady opisuje §6 <Link className="underline" href="/montuj-bez-montazysty/regulamin">regulaminu</Link>.
          Oświadczenie możesz też wysłać mailem na <a className="underline" href={`mailto:${SELLER.email}`}>{SELLER.email}</a>.
        </p>
      </section>
      <section id="formularz">
        <h2>Formularz odstąpienia</h2>
        <div className="rounded-[28px] bg-[var(--h-surface)] p-5 sm:p-7">
          <WithdrawalForm />
        </div>
        <p className="text-[15px] text-[var(--h-ink-2)]">Adresat: {SELLER.name}, {nobr(SELLER.address)}.</p>
      </section>
    </LegalPage>
  )
}
