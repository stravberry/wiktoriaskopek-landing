import type { Metadata } from "next"
import type { Locale } from "@/lib/translations"
import TechnoHero from "@/components/techno-hero"
import TechnoWhySection from "@/components/techno-why-section"
import SubpageNav from "@/components/subpage-nav"

export const metadata: Metadata = {
  title: "Wiktoria Skopek | Strony, Wideo & Marketing dla Sceny Klubowej",
  description:
    "Projektuję strony, montuję rolki i ustawiam procesy marketingowe dla DJ-ów i artystów sceny klubowej. Profesjonalne portfolio, EPK i social media.",
}

export default async function TechnoPage({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params

  return (
    <div className="w-full bg-black">
      <SubpageNav lang={lang} />
      <TechnoHero lang={lang} />
      <TechnoWhySection lang={lang} />
    </div>
  )
}
