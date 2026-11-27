import { Fustat } from "next/font/google"
import type { Metadata } from "next"
import "../mf-tokens.css"
import { pageAlternates } from "@/lib/seo"
import Home, { HOME_FAQ } from "@/components/home/home"
import { localeHref } from "@/lib/routes"

const fustat = Fustat({ subsets: ["latin", "latin-ext"], display: "swap", variable: "--font-mf" })

// Ustawia motyw przed pierwszym malowaniem, żeby nie mignęło
const themeScript = `try{if(localStorage.getItem("home-theme")==="dark")document.documentElement.dataset.homeTheme="dark"}catch(e){}`

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  const base = "https://www.wiktoriaskopek.pl"
  const title = "Darmowy audyt Instagrama i rolki dla firm | Wiktoria Skopek"
  const description = "Rolki, które przyprowadzają klientów: nagrania, montaż i reklamy Meta dla małych firm. Zacznij od darmowego audytu Instagrama z liczbami z Twojego profilu."
  return {
    title,
    description,
    openGraph: { title, description, url: `${base}${localeHref(lang, "/")}` },
    alternates: pageAlternates(""),
  }
}

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: HOME_FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
}

export default function HomePage() {
  return (
    <div className={`${fustat.className} ${fustat.variable}`}>
      <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd).replace(/</g, "\\u003c") }} />
      <Home />
    </div>
  )
}
