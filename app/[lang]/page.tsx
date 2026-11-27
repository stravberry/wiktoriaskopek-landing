import { Fustat } from "next/font/google"
import type { Metadata } from "next"
import "../mf-tokens.css"
import { pageAlternates } from "@/lib/seo"
import Home, { homeFaq } from "@/components/home/home"
import { audytEnabled } from "@/lib/audyt/core"
import { localeHref } from "@/lib/routes"

const fustat = Fustat({ subsets: ["latin", "latin-ext"], display: "swap", variable: "--font-mf" })

// Ustawia motyw przed pierwszym malowaniem, żeby nie mignęło
const themeScript = `try{if(localStorage.getItem("home-theme")==="dark")document.documentElement.dataset.homeTheme="dark"}catch(e){}`

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  const base = "https://www.wiktoriaskopek.pl"
  const audyt = audytEnabled()
  const title = audyt ? "Darmowy audyt Instagrama i rolki dla firm | Wiktoria Skopek" : "Rolki i reklamy Meta dla firm | Wiktoria Skopek"
  const description = audyt
    ? "Rolki, które przyprowadzają klientów: nagrania, montaż i reklamy Meta dla małych firm. Zacznij od darmowego audytu Instagrama z liczbami z Twojego profilu."
    : "Rolki, które przyprowadzają klientów: nagrania, montaż i reklamy Meta dla małych firm. Własne studio w Katowicach i program MontageFrames."
  return {
    title,
    description,
    openGraph: { title, description, url: `${base}${localeHref(lang, "/")}` },
    alternates: pageAlternates(""),
  }
}

const faqLd = () => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: homeFaq().map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
})

export default function HomePage() {
  return (
    <div className={`${fustat.className} ${fustat.variable}`}>
      <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd()).replace(/</g, "\\u003c") }} />
      <Home />
    </div>
  )
}
