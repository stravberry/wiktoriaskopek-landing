"use client"

import { useRef, useEffect, useState } from "react"

function AnimatedStat({
  value,
  label,
  description,
  isVisible,
  delay,
  index,
  fullAccent,
  industry,
}: {
  value: string
  label: string
  description: string
  isVisible: boolean
  delay: number
  index: number
  fullAccent?: boolean
  industry?: string
}) {
  const [displayValue, setDisplayValue] = useState("0")

  const hasDecimal = value.includes(",") && !value.includes("tyś")
  const prefix = value.startsWith("+") ? "+" : ""

  let numericValue: number
  let decimalPart = ""

  if (hasDecimal) {
    const parts = value.replace("+", "").split(",")
    numericValue = Number.parseInt(parts[0])
    decimalPart = "," + parts[1]
  } else {
    numericValue = Number.parseInt(value.replace(/[^0-9]/g, ""))
  }

  useEffect(() => {
    if (!isVisible) return

    const timer = setTimeout(() => {
      const duration = 2000
      const steps = 60
      const increment = numericValue / steps
      let current = 0

      const counter = setInterval(() => {
        current += increment
        if (current >= numericValue) {
          setDisplayValue(`${prefix}${numericValue}${decimalPart}`)
          clearInterval(counter)
        } else {
          setDisplayValue(`${prefix}${Math.floor(current)}${decimalPart}`)
        }
      }, duration / steps)

      return () => clearInterval(counter)
    }, delay)

    return () => clearTimeout(timer)
  }, [isVisible, numericValue, prefix, decimalPart, delay])

  return (
    <div
      className="relative group"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible
          ? "translateY(0) translateX(0) rotate(0deg)"
          : `translateY(60px) translateX(${index % 2 === 0 ? "-30px" : "30px"}) rotate(${index % 2 === 0 ? "-2deg" : "2deg"})`,
        transition: `all 1s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
      }}
    >
      <div className="relative p-8 lg:p-10 border border-white/10 bg-black/80 backdrop-blur-sm overflow-hidden hover:border-accent/30 transition-colors duration-500">
        <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-accent/50" />
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-accent/50" />

        <div className="absolute top-4 right-4 text-white/10 font-display text-6xl">
          {String(index + 1).padStart(2, "0")}
        </div>

        {fullAccent ? (
          <>
            <div className="font-display text-[12vw] md:text-[6vw] lg:text-5xl text-accent leading-none mb-4 group-hover:scale-105 transition-transform duration-300">
              {displayValue} {label}
            </div>
            {industry && <div className="text-white font-display text-xl md:text-2xl mb-3">{industry}</div>}
          </>
        ) : (
          <>
            <div className="font-display text-[15vw] md:text-[8vw] lg:text-6xl text-accent leading-none mb-4 group-hover:scale-105 transition-transform duration-300">
              {displayValue}
            </div>
            <div className="text-white font-display text-xl md:text-2xl mb-3">{label}</div>
          </>
        )}

        <p className="text-white/40 font-mono text-xs leading-relaxed">{description}</p>
      </div>
    </div>
  )
}

export default function StatsSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [lineWidth, setLineWidth] = useState(0)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true)
            setTimeout(() => setLineWidth(100), 300)
          }
        })
      },
      { threshold: 0.15 },
    )

    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  const stats = [
    {
      value: "+300",
      label: "tyś.\u00A0złotych",
      description: "Dodatkowego przychodu w\u00A03 miesiące działań dla\u00A0firmy suplementacyjnej",
      fullAccent: true,
      industry: "Branża fitness",
    },
    {
      value: "+104",
      label: "Hot Leads",
      description: "Na\u00A0usługę transportu premium osób VIP w\u00A0jednym miesiącu",
    },
    {
      value: "+4,3",
      label: "mln",
      description: "Organicznie w\u00A0social mediach \u2013 regularnie 1,5\u00A0mln miesięcznie po\u00A012 miesiącach współpracy",
      fullAccent: true,
      industry: "zasięgu organicznego",
    },
    {
      value: "+12",
      label: "Miesięcy",
      description: "Średni czas współpracy z\u00A0klientami \u2013 długofalowe partnerstwa",
    },
  ]

  return (
    <section ref={sectionRef} className="relative bg-black py-24 lg:py-32 overflow-hidden" id="wyniki">
      {/* Decorative diagonal line that draws on scroll */}
      <div
        className="absolute top-0 left-0 h-full w-px bg-gradient-to-b from-transparent via-accent/20 to-transparent"
        style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? "scaleY(1)" : "scaleY(0)",
          transformOrigin: "top",
          transition: "all 1.5s cubic-bezier(0.16, 1, 0.3, 1) 0.2s",
        }}
      />

      <div className="px-6 md:px-12 lg:px-20">
        <div className="flex items-center gap-6 mb-16">
          <span
            className="text-accent font-mono text-xs tracking-[0.3em] uppercase"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? "translateX(0)" : "translateX(-20px)",
              transition: "all 0.6s ease-out",
            }}
          >
            Wyniki
          </span>
          <div
            className="flex-1 h-px bg-white/10"
            style={{
              transform: `scaleX(${lineWidth / 100})`,
              transformOrigin: "left",
              transition: "transform 1.2s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          />
          <span
            className="text-white/20 font-mono text-xs"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? "translateX(0)" : "translateX(20px)",
              transition: "all 0.6s ease-out 0.8s",
            }}
          >
            04 case studies
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <AnimatedStat key={stat.label} {...stat} isVisible={isVisible} delay={i * 150} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
