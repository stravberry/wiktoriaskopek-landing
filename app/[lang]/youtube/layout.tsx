import type { Metadata } from "next"
import { pageAlternates } from "@/lib/seo"

// Tytuł i opis SEO tej podstrony (osobne dla każdej; zaakceptował Kierownik 26.11.2026).
export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  const url = `https://www.wiktoriaskopek.pl/${lang}/youtube`
  return {
    title: "Odcinki YouTube ze studia w Katowicach | Wiktoria Skopek",
    description: "Eksperckie odcinki YouTube ze studia w Katowicach: nagranie 4K z kilku kamer, dźwięk broadcastowy, montaż w stylu YouTube i wersje pionowe na Reels i Shorts.",
    alternates: pageAlternates("/youtube"),
    openGraph: { title: "Odcinki YouTube ze studia w Katowicach | Wiktoria Skopek", description: "Eksperckie odcinki YouTube ze studia w Katowicach: nagranie 4K z kilku kamer, dźwięk broadcastowy, montaż w stylu YouTube i wersje pionowe na Reels i Shorts.", url },
  }
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
