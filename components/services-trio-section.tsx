"use client"

import { useRef, useEffect, useState } from "react"
import { Play, Sparkles, Cpu } from "lucide-react"

export default function ServicesTrioSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setIsVisible(true)
        })
      },
      { threshold: 0.1 },
    )

    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  const services = [
    {
      icon: <Play className="w-10 h-10" />,
      title: "WIDEO",
      description: "Treści które przyciągają uwagę i konwertują",
      number: "01",
    },
    {
      icon: <Sparkles className="w-10 h-10" />,
      title: "AI",
      description: "Optymalizacja kampanii i maksymalizacja ROI",
      number: "02",
    },
    {
      icon: <Cpu className="w-10 h-10" />,
      title: "AUTOMATYZACJA",
      description: "Procesy marketingowe na autopilocie",
      number: "03",
    },
  ]

  return (
    <section ref={sectionRef} className="relative bg-black py-24 lg:py-32 overflow-hidden" id="uslugi">
      <div className="px-6 md:px-12 lg:px-20">
        {/* Section header with mask reveal */}
        <div className="mb-12 overflow-hidden">
          <div
            className="flex items-center gap-6"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? "translateY(0)" : "translateY(100%)",
              transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            <span className="text-accent font-mono text-xs tracking-[0.3em] uppercase">Filary</span>
            <div
              className="flex-1 h-px bg-white/10"
              style={{
                transform: isVisible ? "scaleX(1)" : "scaleX(0)",
                transformOrigin: "left",
                transition: "transform 1.2s cubic-bezier(0.16, 1, 0.3, 1) 0.4s",
              }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-1">
          {services.map((service, i) => (
            <div
              key={service.title}
              className="group relative h-[50vh] flex flex-col justify-end p-8 border border-white/5 bg-black/50 overflow-hidden cursor-pointer hover:bg-accent/5 transition-all duration-700"
              style={{
                opacity: isVisible ? 1 : 0,
                clipPath: isVisible
                  ? "inset(0 0 0 0)"
                  : "inset(100% 0 0 0)",
                transform: isVisible ? "translateY(0)" : "translateY(20px)",
                transition: `opacity 0.6s ease-out ${300 + i * 250}ms, clip-path 1s cubic-bezier(0.16, 1, 0.3, 1) ${300 + i * 250}ms, transform 0.8s ease-out ${300 + i * 250}ms, background-color 0.7s`,
              }}
            >
              {/* Giant background number with separate reveal */}
              <span
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-display text-[40vw] md:text-[20vw] text-white/[0.02] group-hover:text-accent/[0.05] transition-colors duration-700 pointer-events-none select-none"
                style={{
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible
                    ? "translate(-50%, -50%) scale(1)"
                    : "translate(-50%, -50%) scale(0.5)",
                  transition: `all 1.5s cubic-bezier(0.16, 1, 0.3, 1) ${600 + i * 250}ms`,
                }}
              >
                {service.number}
              </span>

              {/* Icon with spring-in */}
              <div
                className="relative z-10 text-white/30 group-hover:text-accent group-hover:scale-110 transition-all duration-500 mb-6"
                style={{
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? "translateY(0) rotate(0deg)" : "translateY(20px) rotate(-10deg)",
                  transition: `all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) ${700 + i * 250}ms`,
                }}
              >
                {service.icon}
              </div>

              {/* Title with mask reveal */}
              <div className="overflow-hidden">
                <h3
                  className="relative z-10 font-display text-5xl md:text-6xl lg:text-7xl text-white mb-4 group-hover:translate-x-2 transition-transform duration-500"
                  style={{
                    transform: isVisible ? "translateY(0)" : "translateY(110%)",
                    transition: `transform 1s cubic-bezier(0.16, 1, 0.3, 1) ${800 + i * 250}ms`,
                  }}
                >
                  {service.title}
                </h3>
              </div>

              {/* Description fade in */}
              <p
                className="relative z-10 text-white/40 font-mono text-sm max-w-xs group-hover:text-white/60 transition-colors duration-500"
                style={{
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? "translateY(0)" : "translateY(15px)",
                  transition: `all 0.6s ease-out ${1000 + i * 250}ms`,
                }}
              >
                {service.description}
              </p>

              {/* Bottom accent line draws in */}
              <div
                className="absolute bottom-0 left-0 h-px bg-accent/30"
                style={{
                  width: isVisible ? "100%" : "0%",
                  transition: `width 1.2s cubic-bezier(0.16, 1, 0.3, 1) ${900 + i * 250}ms`,
                }}
              />
              <div className="absolute bottom-0 left-0 w-0 h-1 bg-accent group-hover:w-full transition-all duration-700" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
