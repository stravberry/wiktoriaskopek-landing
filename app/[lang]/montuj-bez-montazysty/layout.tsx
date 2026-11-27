import type React from "react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Fustat } from "next/font/google"
import "../../mf-tokens.css"
import { MF_BASE_PATH, SELLER } from "@/lib/mf/config"
import { nobr } from "@/lib/typo"
import CookieSettingsLink from "@/components/mf/cookie-settings-link"
import TestModeBar from "@/components/mf/test-mode-bar"
import { ScrollProgress } from "@/components/mf/motion"
import { UtmCapture } from "@/components/mf/buy"

const fustat = Fustat({ subsets: ["latin", "latin-ext"], display: "swap", variable: "--font-mf" })

// Sekcja produktu tylko po polsku (sprzedaż tylko w Polsce). Font i kolory jak na nowej stronie głównej Wiktorii.
export default async function MfLayout({ children, params }: { children: React.ReactNode; params: Promise<{ lang: string }> }) {
  const { lang } = await params
  if (lang !== "pl") notFound()
  return (
    <div className={`${fustat.className} ${fustat.variable} mf-page home min-h-dvh bg-[var(--h-bg)] text-[17px] text-[var(--h-ink)]`}>
      <ScrollProgress />
      <TestModeBar />
      <UtmCapture />
      <header className="mf-wrap flex items-center justify-between gap-4 pt-5 md:pt-8">
        <Link href={MF_BASE_PATH} className="inline-flex min-h-11 items-center whitespace-nowrap text-[17px] font-bold tracking-[-0.01em]">
          MontageFrames <span className="hidden font-normal text-[var(--h-ink-2)] sm:inline">od Wiktorii Skopek</span>
        </Link>
        <nav className="flex items-center gap-2 text-[15px] font-semibold">
          <a href={`${MF_BASE_PATH}#style`} className="hidden min-h-11 items-center rounded-full px-4 hover:bg-[var(--h-surface)] md:inline-flex">Style</a>
          <a href={`${MF_BASE_PATH}#faq`} className="hidden min-h-11 items-center rounded-full px-4 hover:bg-[var(--h-surface)] md:inline-flex">Pytania</a>
          <Link href={`${MF_BASE_PATH}/konto`} className="mf-press inline-flex min-h-11 items-center rounded-full bg-[var(--h-surface)] px-5 hover:bg-[var(--h-surface-hover)]">
            <span className="sm:hidden">Konto</span>
            <span className="hidden sm:inline">Moje konto</span>
          </Link>
        </nav>
      </header>
      {children}
      <footer className="mt-28 bg-[#1d1d1f] py-16 text-[#f5f5f7] md:mt-44 md:py-24">
        <div className="mf-wrap">
          <p className="text-[clamp(2.4rem,8vw,7.25rem)] font-extrabold leading-[0.95] tracking-[-0.045em]">MontageFrames</p>
          <div className="mt-12 grid gap-10 text-[15px] leading-[1.6] text-[#c7c7cc] md:grid-cols-3">
            <p>
              Sprzedawca: {SELLER.name}, {nobr(SELLER.address)}. Działalność nierejestrowana.
              <br />
              <a className="underline" href={`mailto:${SELLER.email}`}>{SELLER.email}</a> · <a className="underline" href={SELLER.phoneHref}>{SELLER.phone}</a>
            </p>
            <ul className="flex flex-col [&_a]:inline-flex [&_a]:min-h-11 [&_a]:items-center [&_button]:min-h-11">
              <li><Link className="underline" href={`${MF_BASE_PATH}/regulamin`}>Regulamin sprzedaży</Link></li>
              <li><Link className="underline" href="/polityka-prywatnosci">Polityka prywatności</Link></li>
              <li><Link className="underline" href="/odstapienie">Odstąp od umowy</Link></li>
              <li><CookieSettingsLink /></li>
            </ul>
            <ul className="flex flex-col [&_a]:inline-flex [&_a]:min-h-11 [&_a]:items-center">
              <li><Link className="underline" href="/">wiktoriaskopek.pl</Link></li>
              <li><a className="underline" href="https://www.instagram.com/wiktoriaskopek/" target="_blank" rel="noopener noreferrer">Instagram</a></li>
              <li><a className="underline" href="https://podcastkatowice.pl" target="_blank" rel="noopener noreferrer">Studio podcastkatowice.pl</a></li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  )
}
