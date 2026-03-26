"use client"

import { useState, useEffect, useRef } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { ArrowRight, Clock, Tag, Search, ChevronDown, ArrowUpRight } from "lucide-react"
import type { Locale } from "@/lib/translations"
import SubpageNav from "@/components/subpage-nav"

// TODO: Replace with CMS/Database integration (Supabase, Sanity, Strapi, etc.)
const blogPosts: Array<{
  id: number
  slug: string
  title: string
  excerpt: string
  category: string
  readTime: string
  date: string
  image: string
  featured?: boolean
}> = []

export default function BlogPage() {
  const params = useParams()
  const lang = (params.lang as Locale) || "pl"
  const [activeCategory, setActiveCategory] = useState("Wszystko")
  const [searchQuery, setSearchQuery] = useState("")
  const [visiblePosts, setVisiblePosts] = useState<number[]>([])
  const observerRef = useRef<IntersectionObserver | null>(null)

  const isEnglish = lang === "en"
  const categories = isEnglish
    ? ["All", "Video", "AI", "Marketing", "Podcasts", "Automation"]
    : ["Wszystko", "Wideo", "AI", "Marketing", "Podcasty", "Automatyzacja"]

  const filteredPosts = blogPosts.filter((post) => {
    const matchesCategory =
      activeCategory === "Wszystko" || activeCategory === "All" || post.category === activeCategory
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = Number(entry.target.getAttribute("data-id"))
            setVisiblePosts((prev) => (prev.includes(id) ? prev : [...prev, id]))
          }
        })
      },
      { threshold: 0.1 },
    )

    return () => observerRef.current?.disconnect()
  }, [])

  return (
    <div className="min-h-screen bg-black">
      <SubpageNav lang={lang} />

      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden pt-16">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/95 to-black" />

        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 text-[20vw] font-display text-white/[0.02] leading-none select-none">
            BLOG
          </div>
        </div>

        <div className="relative z-10 text-center px-4">
          <div className="inline-block mb-6">
            <span className="text-accent font-mono text-sm tracking-widest">
              {isEnglish ? "KNOWLEDGE & INSIGHTS" : "WIEDZA & INSPIRACJE"}
            </span>
          </div>
          <h1 className="text-7xl md:text-9xl font-display text-white mb-6">BLOG</h1>
          <p className="text-white/60 font-mono text-sm md:text-base max-w-xl mx-auto">
            {isEnglish
              ? "Articles about video marketing, AI, automation and building personal brands."
              : "Artykuły o wideo marketingu, AI, automatyzacji i budowaniu marek osobistych."}
          </p>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <span className="text-white/40 font-mono text-xs">{isEnglish ? "scroll" : "przewiń"}</span>
          <ChevronDown className="w-4 h-4 text-accent animate-bounce" />
        </div>
      </section>

      {/* Search & Filter Section */}
      <section className="sticky top-14 z-40 bg-black/95 backdrop-blur-sm border-y border-white/10 py-4">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <input
                type="text"
                placeholder={isEnglish ? "Search articles..." : "Szukaj artykułów..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-none py-2 pl-10 pr-4 text-white font-mono text-sm focus:outline-none focus:border-accent transition-colors"
              />
            </div>

            {/* Categories */}
            <div className="flex flex-wrap gap-2 justify-center">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-4 py-2 font-mono text-xs tracking-wider transition-all duration-300 ${
                    activeCategory === category
                      ? "bg-accent text-black"
                      : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Empty State */}
      {blogPosts.length === 0 && (
        <section className="py-32">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <div className="mb-8">
              <div className="w-24 h-24 mx-auto border-2 border-dashed border-white/20 rounded-full flex items-center justify-center mb-6">
                <Tag className="w-10 h-10 text-white/20" />
              </div>
              <h2 className="text-4xl md:text-5xl font-display text-white mb-4">
                {isEnglish ? "Articles coming soon" : "Artykuły już wkrótce"}
              </h2>
              <p className="text-white/60 font-mono text-sm max-w-md mx-auto">
                {isEnglish
                  ? "I am preparing valuable content for you. Come back soon!"
                  : "Przygotowuję dla Ciebie wartościowe treści. Wróć wkrótce!"}
              </p>
            </div>
            <Link
              href={`/${lang}`}
              className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-black font-mono text-sm hover:bg-accent/90 transition-colors"
            >
              {isEnglish ? "Back to home" : "Wróć na stronę główną"}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      )}

      {/* Blog Grid - shown when posts exist */}
      {filteredPosts.length > 0 && (
        <section className="py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {filteredPosts.map((post, index) => (
                <article
                  key={post.id}
                  data-id={post.id}
                  className={`group relative bg-white/[0.02] border border-white/10 overflow-hidden transition-all duration-500 hover:border-accent/50 ${
                    visiblePosts.includes(post.id) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                  }`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                  ref={(el) => {
                    if (el && observerRef.current) {
                      observerRef.current.observe(el)
                    }
                  }}
                >
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <img
                      src={post.image || "/placeholder.svg"}
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-accent text-black font-mono text-xs">{post.category}</span>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-4 mb-4 text-white/40 font-mono text-xs">
                      <span>{post.date}</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {post.readTime}
                      </span>
                    </div>
                    <h3 className="text-xl font-display text-white mb-3 group-hover:text-accent transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-white/60 font-mono text-sm mb-6 line-clamp-2">{post.excerpt}</p>
                    <Link
                      href={`/${lang}/blog/${post.slug}`}
                      className="inline-flex items-center gap-2 text-accent font-mono text-sm group/link"
                    >
                      {isEnglish ? "Read more" : "Czytaj więcej"}
                      <ArrowUpRight className="w-4 h-4 transition-transform group-hover/link:translate-x-1 group-hover/link:-translate-y-1" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
