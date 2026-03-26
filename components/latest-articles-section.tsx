"use client"

import Link from "next/link"
import Image from "next/image"
import { ArrowUpRight, Clock } from "lucide-react"
import type { Locale } from "@/lib/translations"

const latestArticles = [
  {
    id: 1,
    slug: "najlepsze-studio-podcast-katowice",
    title: "Najlepsze studio do nagrywania podcastów w Katowicach",
    excerpt:
      "Szukasz profesjonalnego studia podcast w Katowicach? Poznaj PodcastKatowice.pl - w pełni wyposażone studio.",
    category: "Podcasty",
    readTime: "7 min",
    image: "/images/studio-podcast.webp",
  },
  {
    id: 2,
    slug: "jak-ai-zmienia-marketing-wideo-2025",
    title: "Jak AI zmienia marketing wideo w 2025 roku",
    excerpt: "Sztuczna inteligencja rewolucjonizuje produkcję wideo. Poznaj narzędzia, które musisz znać.",
    category: "AI & Marketing",
    readTime: "8 min",
    image: "/ai-video-marketing-futuristic.jpg",
  },
  {
    id: 3,
    slug: "podcast-firmowy-kompletny-przewodnik",
    title: "Podcast firmowy - kompletny przewodnik 2025",
    excerpt: "Czy Twoja firma potrzebuje podcastu? Jak zacząć, ile to kosztuje i jak mierzyć efekty?",
    category: "Podcasty",
    readTime: "12 min",
    image: "/podcast-studio-microphone-professional.jpg",
  },
]

export default function LatestArticlesSection({ lang = "pl" }: { lang?: Locale }) {
  return (
    <section className="relative bg-black py-24 border-t border-white/5">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,102,0,.01)_1px,transparent_1px),linear-gradient(rgba(255,102,0,.01)_1px,transparent_1px)] bg-[size:80px_80px]" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="flex flex-wrap items-end justify-between gap-6 mb-12">
          <div>
            <span className="text-accent font-mono text-xs tracking-[0.3em] uppercase">Blog</span>
            <h2 className="font-display text-[8vw] md:text-[4vw] text-white leading-[0.9] tracking-tight mt-2">
              {lang === "en" ? "LATEST ARTICLES" : "NAJNOWSZE ARTYKUŁY"}
            </h2>
          </div>
          <Link
            href={`/${lang}/blog`}
            className="group flex items-center gap-2 px-6 py-3 border border-white/10 hover:border-accent hover:bg-accent/5 transition-all font-mono text-sm text-white/70 hover:text-accent"
          >
            {lang === "en" ? "See all" : "Zobacz wszystkie"}
            <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
          </Link>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {latestArticles.map((article, index) => (
            <Link
              key={article.id}
              href={`/${lang}/blog/${article.slug}`}
              className="group relative bg-white/[0.02] border border-white/5 hover:border-accent/30 transition-all duration-500 overflow-hidden"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Image */}
              <div className="aspect-[16/10] relative overflow-hidden">
                <Image
                  src={article.image || "/placeholder.svg"}
                  alt={article.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>

              {/* Content */}
              <div className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-accent font-mono text-xs tracking-wider uppercase">{article.category}</span>
                  <span className="text-white/30 font-mono text-xs flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {article.readTime}
                  </span>
                </div>

                <h3 className="font-display text-xl text-white group-hover:text-accent transition-colors duration-300 leading-tight">
                  {article.title}
                </h3>

                <p className="text-white/40 font-mono text-xs mt-3 line-clamp-2 leading-relaxed">{article.excerpt}</p>

                {/* Read more indicator */}
                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-white/5">
                  <span className="text-white/30 group-hover:text-accent font-mono text-xs transition-colors">
                    {lang === "en" ? "Read more" : "Czytaj więcej"}
                  </span>
                  <ArrowUpRight className="w-3 h-3 text-white/30 group-hover:text-accent transition-all group-hover:translate-x-1 group-hover:-translate-y-1" />
                </div>
              </div>

              {/* Hover accent line */}
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-accent scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
