import type { Metadata } from "next"
import { pageAlternates } from "@/lib/seo"

// Tytuł i opis SEO tej podstrony (osobne dla każdej; zaakceptował Kierownik 26.11.2026).
export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  const url = `https://www.wiktoriaskopek.pl/${lang}/transmisje-live`
  return {
    title: "Transmisje live ze studia w Katowicach | Wiktoria Skopek",
    description: "Wielokamerowe transmisje live ze studia w Katowicach lub u Ciebie na Śląsku: YouTube, LinkedIn, Facebook, Zoom i Teams, także z gośćmi zdalnymi.",
    alternates: pageAlternates("/transmisje-live"),
    openGraph: { title: "Transmisje live ze studia w Katowicach | Wiktoria Skopek", description: "Wielokamerowe transmisje live ze studia w Katowicach lub u Ciebie na Śląsku: YouTube, LinkedIn, Facebook, Zoom i Teams, także z gośćmi zdalnymi.", url },
  }
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
