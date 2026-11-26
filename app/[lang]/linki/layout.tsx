import type { Metadata } from "next"
import { pageAlternates } from "@/lib/seo"

// Tytuł i opis SEO tej podstrony (osobne dla każdej; zaakceptował Kierownik 26.11.2026).
export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  const url = `https://www.wiktoriaskopek.pl/${lang}/linki`
  return {
    title: "Linki: Instagram, YouTube i studio | Wiktoria Skopek",
    description: "Wszystkie kanały Wiktorii Skopek w jednym miejscu: Instagram, YouTube, podcast, studio nagrań w Katowicach, e-mail i telefon.",
    alternates: pageAlternates("/linki"),
    openGraph: { title: "Linki: Instagram, YouTube i studio | Wiktoria Skopek", description: "Wszystkie kanały Wiktorii Skopek w jednym miejscu: Instagram, YouTube, podcast, studio nagrań w Katowicach, e-mail i telefon.", url },
  }
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
