import type { Metadata } from "next"
import { pageAlternates } from "@/lib/seo"
import { localeHref } from "@/lib/routes"

// Tytuł i opis SEO tej podstrony (osobne dla każdej; zaakceptował Kierownik 26.11.2026).
export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  const url = `https://www.wiktoriaskopek.pl${localeHref(lang, "/konsultacje")}`
  return {
    title: "Konsultacje marketingowe 1:1 | Wiktoria Skopek",
    description: "Indywidualne konsultacje marketingowe: strategia dopasowana do Twojego biznesu i konkretne wskazówki do wdrożenia od razu. Zobacz pakiety i umów termin.",
    alternates: pageAlternates("/konsultacje"),
    openGraph: { title: "Konsultacje marketingowe 1:1 | Wiktoria Skopek", description: "Indywidualne konsultacje marketingowe: strategia dopasowana do Twojego biznesu i konkretne wskazówki do wdrożenia od razu. Zobacz pakiety i umów termin.", url },
  }
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
