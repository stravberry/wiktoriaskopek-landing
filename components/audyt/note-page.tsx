import type React from "react"
import Link from "next/link"
import { Fustat } from "next/font/google"
import "../../app/mf-tokens.css"

const fustat = Fustat({ subsets: ["latin", "latin-ext"], display: "swap", variable: "--font-mf" })

/** Krótka strona statusu audytu (potwierdzenie, wypis, zapis na porady): jedna karta, jeden przycisk. */
export function NotePage({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className={`${fustat.className} ${fustat.variable} mf-page home min-h-dvh bg-[var(--h-bg)] text-[17px] text-[var(--h-ink)]`}>
      <header className="mf-wrap flex items-center justify-between gap-4 pt-5 md:pt-8">
        <Link href="/" className="inline-flex min-h-11 items-center text-[17px] font-bold tracking-[-0.01em]">Wiktoria Skopek</Link>
      </header>
      <main className="mf-wrap grid min-h-[70dvh] place-items-center py-16">
        <section className="w-full max-w-[560px] rounded-[28px] bg-[var(--h-surface)] p-7 md:p-10" aria-labelledby="note-title">
          <h1 id="note-title" className="text-balance text-[clamp(1.9rem,4.4vw,2.6rem)] font-bold leading-[1.05] tracking-[-0.035em]">{title}</h1>
          <div className="mt-5 flex flex-col gap-4 text-[17px] leading-[1.55] text-[var(--h-ink-2)] [&_strong]:text-[var(--h-ink)]">{children}</div>
        </section>
      </main>
    </div>
  )
}

export const primaryBtn = "mf-press inline-flex min-h-14 w-full items-center justify-center rounded-full bg-[var(--h-accent)] px-7 text-[17px] font-bold text-[#111111] hover:brightness-95 sm:w-auto"
export const secondaryLink = "inline-flex min-h-11 items-center font-semibold text-[var(--h-ink)] underline decoration-[var(--h-accent)] decoration-2 underline-offset-4"
