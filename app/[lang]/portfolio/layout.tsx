import type { Metadata } from "next"
import { pageAlternates } from "@/lib/seo"

// Tytuł i opis SEO tej podstrony (osobne dla każdej; zaakceptował Kierownik 26.11.2026).
export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  const url = `https://www.wiktoriaskopek.pl/${lang}/portfolio`
  return {
    title: "Portfolio: wideo, rolki, reklamy i strony | Wiktoria Skopek",
    description: "Realizacje Wiktorii Skopek: filmy, rolki, reklamy, zdjęcia i strony internetowe. Ponad 50 projektów i 4,3 mln zasięgu.",
    alternates: pageAlternates("/portfolio"),
    openGraph: { title: "Portfolio: wideo, rolki, reklamy i strony | Wiktoria Skopek", description: "Realizacje Wiktorii Skopek: filmy, rolki, reklamy, zdjęcia i strony internetowe. Ponad 50 projektów i 4,3 mln zasięgu.", url },
  }
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
