import type React from "react"
import Link from "next/link"
import { Fustat } from "next/font/google"
import "../../app/mf-tokens.css"
import CookieSettingsLink from "@/components/mf/cookie-settings-link"
import { SELLER } from "@/lib/mf/config"
import { nobr } from "@/lib/typo"

const fustat = Fustat({ subsets: ["latin", "latin-ext"], display: "swap", variable: "--font-mf" })

export type LegalTocItem = { id: string; title: string }

/** Identyfikator sekcji ze śródtytułu („§3. Płatność” → „3-platnosc”), stabilny dla linków. */
export const sectionId = (title: string) =>
  title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/ł/g, "l")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60)

/**
 * Strona dokumentu prawnego w wyglądzie design systemu (porządki 27.11): nagłówek Wiktorii, spis treści
 * (na komputerze przyklejony, na telefonie zwijany), data i wersja, czytelna typografia (.mf-legal), jasna stopka.
 * Treść dokumentu przychodzi jako children: komponent zmienia tylko wygląd, nie tekst.
 */
export function LegalPage({ eyebrow, title, updated, toc, children, bare = false }: { eyebrow: string; title: string; updated: React.ReactNode; toc: LegalTocItem[]; children: React.ReactNode; bare?: boolean }) {
  const tocList = (
    <ol className="flex flex-col">
      {toc.map((t) => (
        <li key={t.id}>
          <a href={`#${t.id}`} className="flex min-h-11 items-center rounded-xl px-3 text-[15px] leading-[1.35] text-[var(--h-ink-2)] hover:bg-[var(--h-surface)] hover:text-[var(--h-ink)]">
            {t.title}
          </a>
        </li>
      ))}
    </ol>
  )
  const body = (
      <main className="mf-wrap grid gap-10 pb-28 pt-12 md:pt-20 lg:grid-cols-[minmax(0,240px)_minmax(0,1fr)] lg:gap-16">
        <aside className="lg:sticky lg:top-8 lg:self-start">
          <details className="rounded-[22px] bg-[var(--h-surface)] p-2 lg:hidden">
            <summary className="flex min-h-11 cursor-pointer items-center px-3 text-[15px] font-semibold">Spis treści</summary>
            <div className="pb-1">{tocList}</div>
          </details>
          <nav aria-label="Spis treści" className="hidden lg:block">
            <p className="mb-2 px-3 text-[13px] font-semibold uppercase tracking-[0.08em] text-[var(--h-ink-2)]">Spis treści</p>
            {tocList}
          </nav>
        </aside>

        <article className="mf-legal min-w-0 max-w-[72ch]">
          <p className="text-[15px] font-semibold text-[var(--h-accent-ink)]">{eyebrow}</p>
          <h1 className="mt-2 text-[clamp(2rem,5vw,3.25rem)] font-bold leading-[1.05] tracking-[-0.035em]">{title}</h1>
          <p className="mt-4 text-[15px] leading-[1.6] text-[var(--h-ink-2)]">{updated}</p>
          <div className="mt-10">{children}</div>
        </article>
      </main>
  )
  // W układzie MontageFrames (własny nagłówek i stopka) tylko treść.
  if (bare) return body
  return (
    <div className={`${fustat.className} ${fustat.variable} mf-page home min-h-dvh bg-[var(--h-bg)] text-[17px] text-[var(--h-ink)]`}>
      <header className="mf-wrap flex items-center justify-between gap-4 pt-5 md:pt-8">
        <Link href="/" className="inline-flex min-h-11 items-center text-[17px] font-bold tracking-[-0.01em]">Wiktoria Skopek</Link>
        <nav className="flex items-center gap-1 text-[15px] font-semibold">
          <Link href="/montuj-bez-montazysty" className="inline-flex min-h-11 items-center rounded-full px-4 hover:bg-[var(--h-surface)]">MontageFrames</Link>
          <Link href="/konsultacje" className="hidden min-h-11 items-center rounded-full px-4 hover:bg-[var(--h-surface)] sm:inline-flex">Konsultacje</Link>
        </nav>
      </header>

      {body}

      <footer className="bg-[var(--h-surface)] py-12">
        <div className="mf-wrap flex flex-col gap-6 text-[15px] leading-[1.6] text-[var(--h-ink-2)] md:flex-row md:items-start md:justify-between">
          <p className="max-w-[48ch]">{SELLER.name}, {nobr(SELLER.address)} · <a className="underline" href={`mailto:${SELLER.email}`}>{SELLER.email}</a></p>
          <ul className="flex flex-wrap gap-x-5 [&_a]:inline-flex [&_a]:min-h-11 [&_a]:items-center [&_a]:underline [&_button]:min-h-11">
            <li><Link href="/polityka-prywatnosci">Polityka prywatności</Link></li>
            <li><Link href="/regulamin">Regulamin strony</Link></li>
            <li><Link href="/montuj-bez-montazysty/regulamin">Regulamin sprzedaży</Link></li>
            <li><Link href="/odstapienie">Odstąp od umowy</Link></li>
            <li><CookieSettingsLink /></li>
          </ul>
        </div>
      </footer>
    </div>
  )
}
