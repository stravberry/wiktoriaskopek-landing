import type React from "react"
import type { Metadata } from "next"
import { Bebas_Neue, Space_Mono, Playfair_Display } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "../globals.css"
import Footer from "@/components/footer"
import { locales, type Locale } from "@/lib/translations"
import ScrollToTop from "@/components/scroll-to-top"

const bebasNeue = Bebas_Neue({ 
  weight: "400", 
  subsets: ["latin"], 
  variable: "--font-display",
  display: "swap",
})
const spaceMono = Space_Mono({ 
  weight: ["400", "700"], 
  subsets: ["latin"], 
  variable: "--font-mono",
  display: "swap",
})
const playfair = Playfair_Display({
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
})

export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }): Promise<Metadata> {
  const { lang } = await params
  const isEnglish = lang === "en"

  return {
    title: isEnglish ? "Wiktoria Skopek | Marketing & AI ADS" : "Wiktoria Skopek | Marketing & AI ADS",
    description: isEnglish
      ? "Marketing and AI ADS specialist. Video marketing for companies and personal brands."
      : "Specjalistka od\u00A0marketingu i\u00A0AI ADS. Wideo marketing dla\u00A0firm i\u00A0marek osobistych.",
    generator: "v0.app",
    icons: {
      icon: "/favicon.svg",
    },
    viewport: {
      width: "device-width",
      initialScale: 1,
      maximumScale: 5,
    },
    themeColor: "#050505",
  }
}

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ lang: Locale }>
}) {
  const { lang } = await params

  return (
    <html lang={lang} className="scroll-smooth" style={{ backgroundColor: "#050505" }}>
      <body
        className={`${bebasNeue.variable} ${spaceMono.variable} ${playfair.variable} antialiased bg-background text-foreground`}
      >
        <ScrollToTop />
        <main className="page-transition">{children}</main>
        <Footer lang={lang} />
        <Analytics />
      </body>
    </html>
  )
}
