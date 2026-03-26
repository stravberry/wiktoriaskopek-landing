"use client"

import { useParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import type { Locale } from "@/lib/translations"
import SubpageNav from "@/components/subpage-nav"

export default function BlogPostPage() {
  const params = useParams()
  const lang = (params.lang as Locale) || "pl"
  const slug = params.slug as string
  const isEnglish = lang === "en"

  return (
    <div className="min-h-screen bg-black">
      <SubpageNav lang={lang} />

      <div className="py-24 pt-32">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-display text-white mb-6">
            {isEnglish ? "Article not available" : "Artykuł niedostępny"}
          </h1>
          <p className="text-white/60 font-mono text-sm mb-8">
            {isEnglish
              ? "This article is not available yet. Check back soon!"
              : "Ten artykuł nie jest jeszcze dostępny. Wróć wkrótce!"}
          </p>
          <Link
            href={`/${lang}/blog`}
            className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-black font-mono text-sm hover:bg-accent/90 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            {isEnglish ? "Back to blog" : "Wróć do bloga"}
          </Link>
        </div>
      </div>
    </div>
  )
}
