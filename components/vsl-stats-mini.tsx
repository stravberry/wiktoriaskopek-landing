"use client"

import { useEffect, useRef, useState } from "react"

interface StatItemProps {
  number: string
  label: string
  description: string
  id: string
  isVisible: boolean
  delay: number
}

function StatItem({ number, label, description, id, isVisible, delay }: StatItemProps) {
  return (
    <div 
      className="relative p-6 md:p-10 border-r border-white/5 last:border-r-0 flex flex-col group transition-all duration-700"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(30px)",
        transitionDelay: `${delay}ms`
      }}
    >
      <div className="flex items-center gap-4 mb-6 opacity-40">
        <span className="font-display text-[10px] tracking-widest text-accent font-bold">{id}</span>
        <div className="h-px flex-1 bg-white/10" />
      </div>
      
      <div className="relative mb-6">
         <span className="font-display text-[48px] md:text-[64px] lg:text-[80px] text-white tracking-tighter block group-hover:text-accent transition-colors duration-500 leading-none">
            {number}
         </span>
         <span className="font-display text-sm md:text-base text-accent tracking-[.3em] uppercase block mt-2 font-bold opacity-80">
            {label}
         </span>
      </div>

      <p className="font-sans text-white/50 text-base md:text-lg leading-relaxed font-medium group-hover:text-white/70 transition-colors">
         {description}
      </p>
    </div>
  )
}

export default function VslStatsMini() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true)
      },
      { threshold: 0.1 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  const stats = [
    {
       id: "01",
       number: "+300 tyś. zł",
       label: "Branża fitness",
       description: "Dodatkowego przychodu w 3 miesiące działań dla firmy suplementacyjnej",
       delay: 0
    },
    {
       id: "02",
       number: "+104",
       label: "Hot Leads",
       description: "Na usługę transportu premium osób VIP w jednym miesiącu",
       delay: 150
    },
    {
       id: "03",
       number: "+4,3 mln",
       label: "Zasięgu",
       description: "Organicznie w social mediach – regularnie 1.5 mln miesięcznie po roku współpracy",
       delay: 300
    },
    {
       id: "04",
       number: "+12",
       label: "Miesięcy",
       description: "Średni czas współpracy z klientami – długofalowe partnerstwa oparte na wynikach",
       delay: 450
    }
  ]

  return (
    <section 
      ref={sectionRef}
      className="bg-[#050505] border-y border-white/5 relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,102,0,0.02),transparent_70%)] pointer-events-none" aria-hidden="true" />
      
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
         {stats.map((stat) => (
            <StatItem key={stat.id} {...stat} isVisible={isVisible} />
         ))}
      </div>
    </section>
  )
}
