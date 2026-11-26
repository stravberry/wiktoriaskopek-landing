import type React from "react"
import type { Metadata, Viewport } from "next"
import { notFound } from "next/navigation"
import { Bebas_Neue } from "next/font/google"
import "../globals.css"
import "../fonts-satoshi.css"
import ConsentProvider from "@/components/consent/consent-provider"
import Footer from "@/components/footer"
import { locales, type Locale } from "@/lib/translations"
import ScrollToTop from "@/components/scroll-to-top"

const bebasNeue = Bebas_Neue({ 
  weight: "400", 
  subsets: ["latin"], 
  variable: "--font-display",
  display: "swap",
})

export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }): Promise<Metadata> {
  const { lang } = await params
  const isEnglish = lang === "en"
  const baseUrl = "https://www.wiktoriaskopek.pl"
  const title = isEnglish ? "Wiktoria Skopek | Video Marketing & Scaling Experts" : "Wiktoria Skopek | Video Marketing & Skalowanie Marek Osobistych"
  const description = isEnglish
    ? "Scale your business with high-ticket video marketing, AI ADS, and professional VSL strategies. Partner for experts and premium brands."
    : "Skaluj swój biznes dzięki video marketingowi premium, AI ADS i profesjonalnym strategiom VSL. Partner strategiczny dla ekspertów i marek."

  return {
    title,
    description,
    metadataBase: new URL(baseUrl),
    // Kanoniczny adres i wersje językowe ustawia strona główna; tu dziedziczyłyby je wszystkie podstrony (każda wskazywałaby na /pl).
    openGraph: {
      title,
      description,
      url: `${baseUrl}/${lang}`,
      siteName: "Wiktoria Skopek",
      locale: lang === "pl" ? "pl_PL" : "en_US",
      type: "website",
      images: [
        {
          url: "/images/wiktoria-skopek.jpg",
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/images/wiktoria-skopek.jpg"],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    icons: {
      icon: "/favicon.svg",
      shortcut: "/favicon.svg",
      apple: "/favicon.svg",
    },
  }
}

// Next 14+: viewport i themeColor poza metadata (wcześniej ostrzeżenie przy każdym buildzie).
export const viewport: Viewport = { width: "device-width", initialScale: 1, maximumScale: 5, themeColor: "#050505" }

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ lang: string }>
}) {
  const { lang: raw } = await params
  // Tylko pl i en: inne pierwsze segmenty (np. /llms.txt) dawały 200 z pustą stroną (soft 404).
  if (!(locales as readonly string[]).includes(raw)) notFound()
  const lang = raw as Locale

  return (
    <html lang={lang} className="scroll-smooth" style={{ backgroundColor: "#050505" }} suppressHydrationWarning>
      <body
        className={`${bebasNeue.variable} antialiased bg-background text-foreground`}
      >
        <ConsentProvider lang={lang}>
          <ScrollToTop />
          <main className="page-transition">{children}</main>
          <Footer lang={lang} />
        </ConsentProvider>
      </body>
    </html>
  )
}
