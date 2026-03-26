import HeroHeader from "@/components/hero-header"
import ElevatorSection from "@/components/elevator-section"
import StatsSection from "@/components/stats-section"
import MaszynaSection from "@/components/maszyna-section"
import TestimonialsSection from "@/components/testimonials-section"
import ServicesTrioSection from "@/components/services-trio-section"
import PodcastKatowiceSection from "@/components/podcast-katowice-section"
import ContactSection from "@/components/contact-section"
import type { Locale } from "@/lib/translations"

export default async function Home({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params

  return (
    <div className="w-full bg-black">
      <HeroHeader lang={lang} />
      <ElevatorSection lang={lang} />
      <StatsSection />
      <MaszynaSection />
      <TestimonialsSection />
      <ServicesTrioSection />
      <PodcastKatowiceSection lang={lang} />
      <ContactSection lang={lang} />
    </div>
  )
}
