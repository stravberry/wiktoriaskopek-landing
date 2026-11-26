import type { Metadata } from "next"

// Tytuł i opis SEO tej podstrony (osobne dla każdej; zaakceptował Kierownik 26.11.2026).
export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  const url = `https://www.wiktoriaskopek.pl/${lang}/blog`
  return {
    title: "Blog: wideo marketing, AI i automatyzacja | Wiktoria Skopek",
    description: "Artykuły Wiktorii Skopek o wideo marketingu, AI i automatyzacji marketingu w małej firmie.",
    alternates: { canonical: url },
    openGraph: { title: "Blog: wideo marketing, AI i automatyzacja | Wiktoria Skopek", description: "Artykuły Wiktorii Skopek o wideo marketingu, AI i automatyzacji marketingu w małej firmie.", url },
    robots: { index: false, follow: true }, // bez wpisów: noindex do pierwszego artykułu (audyt Kierownika, 26.11)
  }
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
