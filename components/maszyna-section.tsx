"use client"

import type React from "react"
import { useRef, useEffect, useState } from "react"

function SlidingElement({
  direction,
  scrollProgress,
  children,
}: {
  direction: "left" | "right" | "scale"
  scrollProgress: number
  children: React.ReactNode
}) {
  const getTransform = () => {
    const progress = Math.max(0, Math.min(1, scrollProgress))
    if (direction === "left") {
      return `translateX(${(1 - progress) * -100}px)`
    }
    if (direction === "right") {
      return `translateX(${(1 - progress) * 100}px)`
    }
    return `scale(${0.8 + progress * 0.2})`
  }

  return (
    <div
      style={{
        transform: getTransform(),
        opacity: scrollProgress,
        transition: "transform 0.1s ease-out, opacity 0.1s ease-out",
      }}
    >
      {children}
    </div>
  )
}

export default function MaszynaSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return
      const rect = sectionRef.current.getBoundingClientRect()
      const progress = Math.max(
        0,
        Math.min(1, (window.innerHeight - rect.top) / (window.innerHeight + rect.height * 0.3)),
      )
      setScrollProgress(progress)
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setIsVisible(true)
        })
      },
      { threshold: 0.1 },
    )

    window.addEventListener("scroll", handleScroll, { passive: true })
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => {
      window.removeEventListener("scroll", handleScroll)
      observer.disconnect()
    }
  }, [])

  return (
    <section ref={sectionRef} className="relative bg-black overflow-hidden" id="maszyna">
      <div className="h-screen flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0">
          <video autoPlay muted loop playsInline className="w-full h-full object-cover opacity-20">
            <source src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/3273dc09757f4a58b24b94e3bb728dbc-UiVMKXSFyMfk4k7woqnY0I65Xhu20W.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-black via-black/80 to-black" />
        </div>

        <SlidingElement direction="left" scrollProgress={scrollProgress}>
          <div className="absolute left-8 top-1/2 -translate-y-1/2 w-1 h-32 bg-gradient-to-b from-transparent via-accent to-transparent opacity-30" />
        </SlidingElement>

        <SlidingElement direction="right" scrollProgress={scrollProgress}>
          <div className="absolute right-8 top-1/2 -translate-y-1/2 w-1 h-32 bg-gradient-to-b from-transparent via-accent to-transparent opacity-30" />
        </SlidingElement>

        <SlidingElement direction="scale" scrollProgress={scrollProgress}>
          <div className="relative z-10 text-center px-6">
            {/* Label with clip reveal */}
            <span
              className="text-accent font-mono text-xs tracking-[0.5em] uppercase block mb-8"
              style={{
                opacity: isVisible ? 1 : 0,
                clipPath: isVisible ? "inset(0 0 0 0)" : "inset(0 50% 0 50%)",
                transition: "all 1s cubic-bezier(0.16, 1, 0.3, 1) 0.2s",
              }}
            >
              AKT III
            </span>

            {/* Title with mask reveal from center */}
            <div className="overflow-hidden">
              <h2
                className="font-display text-[20vw] md:text-[15vw] text-white leading-[0.85] tracking-tight"
                style={{
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? "translateY(0) scaleY(1)" : "translateY(100%) scaleY(1.3)",
                  transition: "all 1.2s cubic-bezier(0.16, 1, 0.3, 1) 0.4s",
                }}
              >
                MASZYNA
              </h2>
            </div>

            {/* Decorative lines that extend outward */}
            <div className="flex items-center justify-center gap-6 mt-6">
              <div
                className="h-px bg-accent/40"
                style={{
                  width: isVisible ? "80px" : "0px",
                  transition: "width 1s cubic-bezier(0.16, 1, 0.3, 1) 0.8s",
                }}
              />
              <div
                className="w-2 h-2 rounded-full bg-accent"
                style={{
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? "scale(1)" : "scale(0)",
                  transition: "all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 1s",
                }}
              />
              <div
                className="h-px bg-accent/40"
                style={{
                  width: isVisible ? "80px" : "0px",
                  transition: "width 1s cubic-bezier(0.16, 1, 0.3, 1) 0.8s",
                }}
              />
            </div>

            {/* Subtitle fades in */}
            <p
              className="text-white/40 font-mono text-sm mt-8 max-w-xl mx-auto"
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? "translateY(0)" : "translateY(20px)",
                transition: "all 0.8s ease-out 1.1s",
              }}
            >
              <span className="text-accent">Emocje sprzedają. Dane potwierdzają.</span> Połączyłam te dwa światy.
            </p>
          </div>
        </SlidingElement>
      </div>
    </section>
  )
}
