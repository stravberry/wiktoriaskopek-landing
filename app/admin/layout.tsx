import type React from "react"
import type { Metadata } from "next"
import { Fustat } from "next/font/google"
import "../globals.css"
import "../mf-tokens.css"

const fustat = Fustat({ subsets: ["latin", "latin-ext"], display: "swap", variable: "--font-mf" })

export const metadata: Metadata = {
  title: "Panel · wiktoriaskopek.pl",
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
  referrer: "same-origin",
}

export const dynamic = "force-dynamic"
// Funkcje panelu obok bazy (Supabase eu-central-1 = Frankfurt). Domyślny iad1 dokładał ~100 ms do każdego zapytania.
export const preferredRegion = "fra1"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pl" data-theme="light" className={fustat.variable}>
      <body className="mf-page min-h-screen bg-[var(--mf-surface)] text-[var(--mf-ink)] antialiased">{children}</body>
    </html>
  )
}
