"use client"

import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import type { Locale } from "@/lib/translations"
import BurgerMenu from "./burger-menu"

interface SubpageNavProps {
  lang: Locale
}

export default function SubpageNav({ lang }: SubpageNavProps) {
  const isEnglish = lang === "en"

  const navItems = [
    { href: `/${lang}`, label: "HOME" },
    { href: `/${lang}/portfolio`, label: "PORTFOLIO" },
    { href: `/${lang}/blog`, label: "BLOG" },
    { href: `/${lang}/konsultacje`, label: isEnglish ? "CONSULTING" : "KONSULTACJE" },
    { href: `/${lang}/linki`, label: isEnglish ? "LINKS" : "LINKI" },
  ]

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-sm border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link
          href={`/${lang}`}
          className="flex items-center gap-2 text-white hover:text-accent transition-colors font-mono text-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline">{isEnglish ? "BACK HOME" : "STRONA GŁÓWNA"}</span>
        </Link>

        <div className="hidden lg:flex items-center gap-4 md:gap-6">
          {navItems.slice(1).map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-white/60 hover:text-accent transition-colors font-mono text-xs tracking-widest"
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Burger menu for mobile/tablet */}
        <div className="lg:hidden">
          <BurgerMenu lang={lang} variant="subpage" />
        </div>
      </div>
    </nav>
  )
}
