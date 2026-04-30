import dynamic from "next/dynamic"
import VslHero from "@/components/vsl-hero"
import MotionViewport from "@/components/motion-viewport"

// Lazy Loading Sections below the fold for better LCP & Bundle Size
const VslPainSection = dynamic(() => import("@/components/vsl-pain-section"), { ssr: true })

const VslAudienceSection = dynamic(() => import("@/components/vsl-audience-section"), { ssr: true })
const VslStepsSection = dynamic(() => import("@/components/vsl-steps-section"), { ssr: true })
const VslAboutSection = dynamic(() => import("@/components/vsl-about-section"), { ssr: true })
const VslFunnelsSection = dynamic(() => import("@/components/vsl-funnels-section"), { ssr: true })
const VslStatsMini = dynamic(() => import("@/components/vsl-stats-mini"), { ssr: true })
const VslResultsSection = dynamic(() => import("@/components/vsl-results-section"), { ssr: true })
const VslOnboardingSection = dynamic(() => import("@/components/vsl-onboarding-section"), { ssr: true })
const VslBookingCalendar = dynamic(() => import("@/components/vsl-booking-calendar"), { ssr: true })
const VslContactForm = dynamic(() => import("@/components/vsl-contact-form"), { ssr: true })

export default async function Home() {
  return (
    <div className="w-full bg-[#050505] overflow-x-hidden">
      {/* LCP Critical Section (Static) */}
      <VslHero />
      
      {/* Lazy Loaded Sections */}
      <VslPainSection />

      <VslAudienceSection />

      <VslStepsSection />

      <VslAboutSection />

      <VslFunnelsSection />
      
      {/* CASE STUDIES PRE-HEADER (STATS MINI) */}
      <VslStatsMini />

      {/* PARTNERS SECTION */}
      <section className="bg-[#050505] py-10 md:py-14 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <p className="font-sans text-white/40 text-xs tracking-[.3em] uppercase text-center mb-8">Współtworzę</p>
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 mb-8">
            <a href="https://kodubi.pl" target="_blank" rel="noopener noreferrer" className="font-display text-2xl md:text-3xl text-white/50 hover:text-white transition-colors duration-300 tracking-wider">Kodubi.pl</a>
            <a href="https://webdkw.net" target="_blank" rel="noopener noreferrer" className="font-display text-2xl md:text-3xl text-white/50 hover:text-white transition-colors duration-300 tracking-wider">Webdkw.net</a>
            <a href="https://dkwgroup.net" target="_blank" rel="noopener noreferrer" className="font-display text-2xl md:text-3xl text-white/50 hover:text-white transition-colors duration-300 tracking-wider">dkwgroup.net</a>
          </div>
          <div className="flex items-center justify-center gap-4">
            <div className="h-px w-12 bg-accent/30" />
            <p className="font-sans text-white/30 text-xs tracking-[.3em] uppercase">Partnerstwo z</p>
            <a href="https://adify.pl" target="_blank" rel="noopener noreferrer" className="font-display text-xl text-accent/70 hover:text-accent transition-colors duration-300 tracking-wider">adify.pl</a>
            <div className="h-px w-12 bg-accent/30" />
          </div>
        </div>
      </section>
      
      <VslResultsSection />

      <VslOnboardingSection />

      <VslBookingCalendar />

      <VslContactForm />
    </div>
  )
}
