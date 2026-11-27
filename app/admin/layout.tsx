import type React from "react"
import type { Metadata } from "next"
import { Fustat } from "next/font/google"
import "../globals.css"

const fustat = Fustat({ subsets: ["latin", "latin-ext"], display: "swap", variable: "--font-mf" })

export const metadata: Metadata = {
  title: "Panel · wiktoriaskopek.pl",
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
  referrer: "no-referrer",
}

export const dynamic = "force-dynamic"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pl" className={fustat.variable}>
      <body className="mf-page min-h-screen bg-[var(--mf-surface)] text-[var(--mf-ink)] antialiased">{children}</body>
    </html>
  )
}
