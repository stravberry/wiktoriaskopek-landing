import dynamic from "next/dynamic"
import VslHero from "@/components/vsl-hero"

// Lazy Loading Sections below the fold for better LCP & Bundle Size
const VslPainSection = dynamic(() => import("@/components/vsl-pain-section"), { ssr: true })
const VslOffMarketSummary = dynamic(() => import("@/components/vsl-offmarket-summary"), { ssr: true })
const VslAudienceSection = dynamic(() => import("@/components/vsl-audience-section"), { ssr: true })
const VslStepsSection = dynamic(() => import("@/components/vsl-steps-section"), { ssr: true })
const VslAboutSection = dynamic(() => import("@/components/vsl-about-section"), { ssr: true })
const VslFunnelsSection = dynamic(() => import("@/components/vsl-funnels-section"), { ssr: true })
const VslStatsMini = dynamic(() => import("@/components/vsl-stats-mini"), { ssr: true })
const VslResultsSection = dynamic(() => import("@/components/vsl-results-section"), { ssr: true })
const VslOnboardingSection = dynamic(() => import("@/components/vsl-onboarding-section"), { ssr: true })
const VslContactForm = dynamic(() => import("@/components/vsl-contact-form"), { ssr: true })

export default async function Home() {
  return (
    <div className="w-full bg-[#050505]">
      {/* LCP Critical Section (Static) */}
      <VslHero />
      
      {/* Skopiowana sekcja statystyk pod Hero */}
      <VslStatsMini />
      
      {/* Lazy Loaded Sections */}
      <VslPainSection />
      <VslOffMarketSummary />
      <VslAudienceSection />
      <VslStepsSection />
      <VslAboutSection />
      <VslFunnelsSection />
      
      {/* CASE STUDIES PRE-HEADER (STATS MINI) */}
      <VslStatsMini />
      
      <VslResultsSection />
      <VslOnboardingSection />
      <VslContactForm />
    </div>
  )
}
