"use client"

import { usePathname, useRouter } from "next/navigation"
import { locales, type Locale } from "@/lib/translations"

export default function LanguageSwitcher({ currentLocale }: { currentLocale: Locale }) {
  const pathname = usePathname()
  const router = useRouter()

  const switchLocale = (newLocale: Locale) => {
    // Remove current locale from path and add new one
    const segments = pathname.split("/").filter(Boolean)

    // Check if first segment is a locale
    if (locales.includes(segments[0] as Locale)) {
      segments[0] = newLocale
    } else {
      segments.unshift(newLocale)
    }

    const newPath = `/${segments.join("/")}`
    router.push(newPath)
  }

  return (
    <div className="flex items-center gap-1 font-mono text-[10px] md:text-xs">
      {locales.map((locale, i) => (
        <span key={locale} className="flex items-center">
          <button
            onClick={() => switchLocale(locale)}
            className={`px-2 py-1 transition-colors tracking-widest uppercase ${
              currentLocale === locale ? "text-accent" : "text-white/60 hover:text-white"
            }`}
          >
            {locale}
          </button>
          {i < locales.length - 1 && <span className="text-white/30">|</span>}
        </span>
      ))}
    </div>
  )
}
