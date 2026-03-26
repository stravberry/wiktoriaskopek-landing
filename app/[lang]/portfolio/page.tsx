"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { ArrowUpRight, Plus, Globe, Play, Camera, Video, Smartphone, Filter } from "lucide-react"
import type { Locale } from "@/lib/translations"
import SubpageNav from "@/components/subpage-nav"

const categories = [
  { id: "all", label: { pl: "Wszystko", en: "All" }, icon: Filter },
  { id: "web", label: { pl: "Strony WWW", en: "Websites" }, icon: Globe },
  { id: "ads", label: { pl: "Reklamy", en: "Ads" }, icon: Play },
  { id: "photo", label: { pl: "Zdjęcia", en: "Photos" }, icon: Camera },
  { id: "video", label: { pl: "Wideo", en: "Video" }, icon: Video },
  { id: "reels", label: { pl: "Rolki", en: "Reels" }, icon: Smartphone },
]

const portfolioItems = [
  { id: 1, category: "web", title: "Lorem Ipsum", description: "Lorem ipsum dolor sit amet", image: null },
  { id: 2, category: "web", title: "Lorem Ipsum", description: "Lorem ipsum dolor sit amet", image: null },
  { id: 3, category: "ads", title: "Lorem Ipsum", description: "Lorem ipsum dolor sit amet", image: null },
  { id: 4, category: "ads", title: "Lorem Ipsum", description: "Lorem ipsum dolor sit amet", image: null },
  { id: 5, category: "photo", title: "Lorem Ipsum", description: "Lorem ipsum dolor sit amet", image: null },
  { id: 6, category: "photo", title: "Lorem Ipsum", description: "Lorem ipsum dolor sit amet", image: null },
  { id: 7, category: "video", title: "Lorem Ipsum", description: "Lorem ipsum dolor sit amet", image: null },
  { id: 8, category: "video", title: "Lorem Ipsum", description: "Lorem ipsum dolor sit amet", image: null },
  { id: 9, category: "reels", title: "Lorem Ipsum", description: "Lorem ipsum dolor sit amet", image: null },
  { id: 10, category: "reels", title: "Lorem Ipsum", description: "Lorem ipsum dolor sit amet", image: null },
]

function GearSVG({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M50 35C41.716 35 35 41.716 35 50C35 58.284 41.716 65 50 65C58.284 65 65 58.284 65 50C65 41.716 58.284 35 50 35ZM50 60C44.477 60 40 55.523 40 50C40 44.477 44.477 40 50 40C55.523 40 60 44.477 60 50C60 55.523 55.523 60 50 60Z"
        fill="currentColor"
      />
      <path
        d="M97 42H89.5C88.5 38.5 87 35.2 85 32.2L90.3 26.9C91.1 26.1 91.1 24.8 90.3 24L76 9.7C75.2 8.9 73.9 8.9 73.1 9.7L67.8 15C64.8 13 61.5 11.5 58 10.5V3C58 1.9 57.1 1 56 1H44C42.9 1 42 1.9 42 3V10.5C38.5 11.5 35.2 13 32.2 15L26.9 9.7C26.1 8.9 24.8 8.9 24 9.7L9.7 24C8.9 24.8 8.9 26.1 9.7 26.9L15 32.2C13 35.2 11.5 38.5 10.5 42H3C1.9 42 1 42.9 1 44V56C1 57.1 1.9 58 3 58H10.5C11.5 61.5 13 64.8 15 67.8L9.7 73.1C8.9 73.9 8.9 75.2 9.7 76L24 90.3C24.8 91.1 26.1 91.1 26.9 90.3L32.2 85C35.2 87 38.5 88.5 42 89.5V97C42 98.1 42.9 99 44 99H56C57.1 99 58 98.1 58 97V89.5C61.5 88.5 64.8 87 67.8 85L73.1 90.3C73.9 91.1 75.2 91.1 76 90.3L90.3 76C91.1 75.2 91.1 73.9 90.3 73.1L85 67.8C87 64.8 88.5 61.5 89.5 58H97C98.1 58 99 57.1 99 56V44C99 42.9 98.1 42 97 42Z"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
      />
    </svg>
  )
}

export default function PortfolioPage() {
  const params = useParams()
  const lang = (params.lang as Locale) || "pl"
  const [activeCategory, setActiveCategory] = useState("all")
  const [visibleItems, setVisibleItems] = useState<number[]>([])
  const observerRef = useRef<IntersectionObserver | null>(null)

  const filteredItems =
    activeCategory === "all" ? portfolioItems : portfolioItems.filter((item) => item.category === activeCategory)

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = Number(entry.target.getAttribute("data-id"))
            setVisibleItems((prev) => (prev.includes(id) ? prev : [...prev, id]))
          }
        })
      },
      { threshold: 0.1 },
    )

    return () => observerRef.current?.disconnect()
  }, [])

  const isEnglish = lang === "en"

  return (
    <div className="min-h-screen bg-black">
      <SubpageNav lang={lang} />

      {/* Hero Section with Animated Gears */}
      <section className="relative min-h-[80vh] flex items-center overflow-hidden pt-16">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/95 to-black" />

        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
            {/* Left side - Typography */}
            <div className="flex flex-col items-start relative z-20">
              {/* Small label */}
              <span className="text-accent font-mono text-xs tracking-[0.3em] mb-4 opacity-80">
                {isEnglish ? "CREATIVE SHOWCASE" : "MOJE REALIZACJE"}
              </span>

              <div className="relative">
                <h1 className="font-display text-[18vw] md:text-[14vw] lg:text-[12vw] leading-[0.9] text-white tracking-tighter">
                  PORTFOLIO
                </h1>
                {/* Decorative line */}
                <div className="absolute -left-4 top-1/2 w-1 h-24 bg-accent/50 -translate-y-1/2 hidden md:block" />
              </div>

              {/* Description */}
              <p className="text-white/50 font-mono text-sm md:text-base max-w-md mt-6">
                {isEnglish
                  ? "A journey through projects that combine creativity, strategy and measurable results."
                  : "Podróż przez projekty łączące kreatywność, strategię i mierzalne rezultaty."}
              </p>

              {/* Stats row */}
              <div className="flex gap-8 md:gap-12 mt-10">
                <div className="text-left">
                  <div className="text-3xl md:text-4xl font-display text-accent">50+</div>
                  <div className="text-white/30 font-mono text-[10px] mt-1 tracking-wider">
                    {isEnglish ? "PROJECTS" : "PROJEKTÓW"}
                  </div>
                </div>
                <div className="text-left">
                  <div className="text-3xl md:text-4xl font-display text-accent">4.3M</div>
                  <div className="text-white/30 font-mono text-[10px] mt-1 tracking-wider">
                    {isEnglish ? "REACH" : "ZASIĘGU"}
                  </div>
                </div>
                <div className="text-left">
                  <div className="text-3xl md:text-4xl font-display text-accent">12+</div>
                  <div className="text-white/30 font-mono text-[10px] mt-1 tracking-wider">
                    {isEnglish ? "MONTHS" : "MIESIĘCY"}
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute right-0 top-1/2 -translate-y-1/2 md:relative md:translate-y-0 pointer-events-none">
              <div className="relative w-[300px] h-[300px] md:w-[400px] md:h-[400px] lg:w-[500px] lg:h-[500px]">
                {/* Main large gear */}
                <GearSVG
                  className="absolute text-accent/40 w-[280px] h-[280px] md:w-[350px] md:h-[350px] lg:w-[400px] lg:h-[400px] top-0 right-0"
                  style={{ animation: "spin-slow 25s linear infinite" }}
                />
                {/* Medium gear - interlocking */}
                <GearSVG
                  className="absolute text-white/20 w-[180px] h-[180px] md:w-[220px] md:h-[220px] lg:w-[260px] lg:h-[260px] top-[40%] -left-[20%]"
                  style={{ animation: "spin-slow-reverse 18s linear infinite" }}
                />
                {/* Small gear */}
                <GearSVG
                  className="absolute text-accent/25 w-[100px] h-[100px] md:w-[130px] md:h-[130px] lg:w-[150px] lg:h-[150px] bottom-[10%] right-[30%]"
                  style={{ animation: "spin-slow 12s linear infinite" }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <div className="w-px h-12 bg-gradient-to-b from-transparent via-accent/50 to-accent animate-pulse" />
          <span className="text-white/30 font-mono text-[10px] tracking-widest">SCROLL</span>
        </div>
      </section>

      {/* Category Filter - Sticky */}
      <section className="sticky top-14 z-40 bg-black/95 backdrop-blur-sm border-y border-white/10 py-4">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((cat) => {
              const Icon = cat.icon
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex items-center gap-2 px-4 py-2 font-mono text-xs tracking-wider transition-all duration-300 ${
                    activeCategory === cat.id
                      ? "bg-accent text-black"
                      : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {cat.label[lang]}
                  {activeCategory === cat.id && <span className="w-1.5 h-1.5 rounded-full bg-black ml-1" />}
                </button>
              )
            })}
          </div>
          <div className="text-center mt-3">
            <span className="text-white/40 font-mono text-xs">
              {isEnglish ? `Showing ${filteredItems.length} projects` : `Pokazuję ${filteredItems.length} projektów`}
            </span>
          </div>
        </div>
      </section>

      {/* Portfolio Grid */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item, index) => (
              <div
                key={item.id}
                data-id={item.id}
                className={`group relative aspect-[4/3] border-2 border-dashed border-white/20 bg-white/[0.02] overflow-hidden transition-all duration-500 hover:border-accent/50 ${
                  visibleItems.includes(item.id) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
                style={{ transitionDelay: `${index * 50}ms` }}
                ref={(el) => {
                  if (el && observerRef.current) {
                    observerRef.current.observe(el)
                  }
                }}
              >
                {/* Placeholder Content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
                  <div className="w-16 h-16 rounded-full border-2 border-dashed border-white/30 flex items-center justify-center mb-4 group-hover:border-accent/50 transition-colors">
                    <Plus className="w-8 h-8 text-white/30 group-hover:text-accent/50 transition-colors" />
                  </div>
                  <span className="text-white/40 font-mono text-sm mb-1">
                    {isEnglish ? "TO BE ADDED" : "DO UZUPEŁNIENIA"}
                  </span>
                  <span className="text-white/20 font-mono text-xs">
                    {categories.find((c) => c.id === item.category)?.label[lang]}
                  </span>
                </div>

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-accent/0 group-hover:bg-accent/5 transition-colors duration-300" />

                {/* Corner decorations */}
                <div className="absolute top-2 left-2 w-4 h-4 border-t border-l border-white/20 group-hover:border-accent/50 transition-colors" />
                <div className="absolute bottom-2 right-2 w-4 h-4 border-b border-r border-white/20 group-hover:border-accent/50 transition-colors" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 border-t border-white/10">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-6xl font-display text-white mb-6">
            {isEnglish ? "Want to see more?" : "Chcesz zobaczyć więcej?"}
          </h2>
          <p className="text-white/60 font-mono text-sm mb-8 max-w-xl mx-auto">
            {isEnglish
              ? "Contact me to discuss your project and see how I can help grow your brand."
              : "Skontaktuj się, aby omówić Twój projekt i zobaczyć jak mogę pomóc w rozwoju Twojej marki."}
          </p>
          <Link
            href={`/${lang}/konsultacje`}
            className="inline-flex items-center gap-3 px-8 py-4 bg-accent text-black font-mono text-sm hover:bg-accent/90 transition-colors group"
          >
            {isEnglish ? "Book a consultation" : "Umów konsultację"}
            <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
          </Link>
        </div>
      </section>

      <style jsx>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes spin-slow-reverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        :global(.animate-spin-slow) {
          animation: spin-slow 20s linear infinite;
        }
        :global(.animate-spin-slow-reverse) {
          animation: spin-slow-reverse 15s linear infinite;
        }
        :global(.animate-spin-slower) {
          animation: spin-slow 25s linear infinite;
        }
      `}</style>
    </div>
  )
}
