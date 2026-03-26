"use client"

import { useParams } from "next/navigation"
import { Instagram, Youtube, Headphones, Globe, Mail, Phone, ExternalLink } from "lucide-react"
import type { Locale } from "@/lib/translations"

export default function LinkiPage() {
  const params = useParams()
  const lang = (params.lang as Locale) || "pl"
  const isEnglish = lang === "en"

  const links = [
    {
      name: "Instagram",
      url: "https://instagram.com/wiktoriaskopek",
      icon: Instagram,
      color: "from-purple-500 to-pink-500",
      description: isEnglish ? "Daily content & behind the scenes" : "Codzienny content i kulisy",
    },
    {
      name: isEnglish ? "YouTube - Personal" : "YouTube - Osobisty",
      url: "https://youtube.com/@wiktoriaskopek",
      icon: Youtube,
      color: "from-red-600 to-red-500",
      description: isEnglish ? "Vlogs, tutorials, marketing tips" : "Vlogi, poradniki, marketing",
    },
    {
      name: "YouTube - Podcast Katowice",
      url: "https://youtube.com/@podcastkatowice",
      icon: Youtube,
      color: "from-red-500 to-orange-500",
      description: isEnglish ? "Podcast recordings" : "Nagrania podcastów",
    },
    {
      name: isEnglish ? "Podcast Studio" : "Studio Podcastowe",
      url: "https://podcastkatowice.pl",
      icon: Headphones,
      color: "from-accent to-orange-600",
      description: isEnglish ? "Professional podcast studio in Katowice" : "Profesjonalne studio w Katowicach",
    },
    {
      name: isEnglish ? "Website" : "Strona internetowa",
      url: `/${lang}`,
      icon: Globe,
      color: "from-blue-500 to-cyan-500",
      description: isEnglish ? "Portfolio & full offer" : "Portfolio i pełna oferta",
    },
  ]

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center py-16 px-4">
      {/* Profile */}
      <div className="text-center mb-10">
        <div className="relative inline-block mb-4">
          <div className="w-28 h-28 rounded-full overflow-hidden border-2 border-accent">
            <img src="/images/wiktoria-avatar.jpg" alt="Wiktoria Skopek" className="w-full h-full object-cover" />
          </div>
          <div className="absolute bottom-1 right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-black" />
        </div>
        <h1 className="text-3xl font-display text-white mb-1">WIKTORIA SKOPEK</h1>
        <p className="text-white/60 font-mono text-sm">Marketing & AI ADS</p>
      </div>

      {/* Links */}
      <div className="w-full max-w-md space-y-3">
        {links.map((link, index) => (
          <a
            key={index}
            href={link.url}
            target={link.url.startsWith("http") ? "_blank" : undefined}
            rel={link.url.startsWith("http") ? "noopener noreferrer" : undefined}
            className="group flex items-center gap-4 p-4 bg-white/5 border border-white/10 hover:border-accent/50 hover:bg-white/10 transition-all duration-300"
          >
            <div className={`p-3 rounded-lg bg-gradient-to-br ${link.color}`}>
              <link.icon className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <div className="text-white font-display text-lg group-hover:text-accent transition-colors">
                {link.name}
              </div>
              <div className="text-white/40 font-mono text-xs">{link.description}</div>
            </div>
            <ExternalLink className="w-4 h-4 text-white/40 group-hover:text-accent transition-colors" />
          </a>
        ))}
      </div>

      {/* Quick Contact */}
      <div className="flex gap-6 mt-10">
        <a
          href="mailto:wskopek.all@gmail.com"
          className="flex items-center gap-2 text-white/60 hover:text-accent font-mono text-sm transition-colors"
        >
          <Mail className="w-4 h-4" />
          Email
        </a>
        <a
          href="tel:+48537168645"
          className="flex items-center gap-2 text-white/60 hover:text-accent font-mono text-sm transition-colors"
        >
          <Phone className="w-4 h-4" />
          {isEnglish ? "Call" : "Zadzwoń"}
        </a>
      </div>

      {/* Language Switcher */}
      <div className="mt-8 flex gap-2">
        <a
          href="/pl/linki"
          className={`px-3 py-1 font-mono text-xs ${lang === "pl" ? "bg-accent text-black" : "text-white/60 hover:text-white"}`}
        >
          PL
        </a>
        <a
          href="/en/linki"
          className={`px-3 py-1 font-mono text-xs ${lang === "en" ? "bg-accent text-black" : "text-white/60 hover:text-white"}`}
        >
          EN
        </a>
      </div>
    </div>
  )
}
