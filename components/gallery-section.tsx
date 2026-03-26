"use client"

import { useRef, useEffect, useState } from "react"

const images = [
  {
    src: "/images/img-0314.jpeg",
    title: "Panel Discussion",
    category: "EVENT",
  },
  {
    src: "/images/img-1217.jpeg",
    title: "Control Room",
    category: "PRODUKCJA",
  },
  {
    src: "/images/gkip-foto-radomsko-2k24-164.jpeg",
    title: "Konferencja",
    category: "EVENT",
  },
  {
    src: "/images/img-5710.jpeg",
    title: "Studio Setup",
    category: "PRODUKCJA",
  },
  {
    src: "/images/img-5708.jpeg",
    title: "Interview Setup",
    category: "PODCAST",
  },
  {
    src: "/images/img-0383.jpeg",
    title: "Behind The Scenes",
    category: "BTS",
  },
]

export default function GallerySection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return
      const rect = sectionRef.current.getBoundingClientRect()
      const progress = Math.max(0, Math.min(1, -rect.top / (rect.height - window.innerHeight)))
      setScrollProgress(progress)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <section ref={sectionRef} className="relative min-h-[200vh] bg-black py-32" id="portfolio">
      {/* Section header */}
      <div className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,102,0,.02)_1px,transparent_1px),linear-gradient(rgba(255,102,0,.02)_1px,transparent_1px)] bg-[size:60px_60px]" />

        {/* Giant title */}
        <div className="px-6 md:px-12 mb-12">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-px bg-accent" />
            <span className="text-accent font-mono text-xs tracking-[0.3em] uppercase">Portfolio</span>
          </div>
          <h2
            className="font-display text-[15vw] md:text-[12vw] text-white leading-[0.9] tracking-tight"
            style={{
              transform: `translateX(${scrollProgress * -10}vw)`,
            }}
          >
            REALIZACJE
          </h2>
        </div>

        {/* Horizontal scrolling gallery */}
        <div
          className="flex gap-6 px-6 md:px-12"
          style={{
            transform: `translateX(${-scrollProgress * 80}vw)`,
          }}
        >
          {images.map((img) => (
            <div
              key={img.title}
              className="relative flex-shrink-0 w-[70vw] md:w-[50vw] lg:w-[35vw] aspect-[4/3] group overflow-hidden"
            >
              <img
                src={img.src || "/placeholder.svg"}
                alt={img.title}
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

              {/* Image info */}
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <span className="text-accent font-mono text-xs tracking-widest">{img.category}</span>
                <h3 className="font-display text-2xl md:text-3xl text-white mt-2">{img.title}</h3>
              </div>

              {/* Hover border */}
              <div className="absolute inset-0 border border-transparent group-hover:border-accent/50 transition-colors duration-500" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
