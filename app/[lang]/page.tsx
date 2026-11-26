import { Fustat } from "next/font/google"
import type { Metadata } from "next"
import HomeBooking from "@/components/home-booking"

const fustat = Fustat({ subsets: ["latin", "latin-ext"], display: "swap" })

// Ustawia motyw przed pierwszym malowaniem, żeby nie mignęło
const themeScript = `try{if(localStorage.getItem("home-theme")==="dark")document.documentElement.dataset.homeTheme="dark"}catch(e){}`

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  const base = "https://www.wiktoriaskopek.pl"
  return { alternates: { canonical: `${base}/${lang}`, languages: { "pl-PL": `${base}/pl`, "en-US": `${base}/en` } } }
}

export default function Home() {
  return (
    <div className={fustat.className}>
      <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      <HomeBooking />
    </div>
  )
}
