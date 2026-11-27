import { Fustat } from "next/font/google"
import type { Metadata } from "next"
import { pageAlternates } from "@/lib/seo"
import HomeBooking from "@/components/home-booking"
import { localeHref } from "@/lib/routes"

const fustat = Fustat({ subsets: ["latin", "latin-ext"], display: "swap" })

// Ustawia motyw przed pierwszym malowaniem, żeby nie mignęło
const themeScript = `try{if(localStorage.getItem("home-theme")==="dark")document.documentElement.dataset.homeTheme="dark"}catch(e){}`

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  const base = "https://www.wiktoriaskopek.pl"
  const title = "Wiktoria Skopek: nagrania wideo, social media i konsultacje"
  const description = "Nagrania filmowe, rolki i wywiady w studiu albo u Ciebie, prowadzenie social mediów i darmowa konsultacja. Katowice, tel. +48 537 168 645."
  return {
    title,
    description,
    openGraph: { title, description, url: `${base}${localeHref(lang, "/")}` },
    alternates: pageAlternates(""),
  }
}

export default function Home() {
  return (
    <div className={fustat.className}>
      <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      <HomeBooking />
    </div>
  )
}
