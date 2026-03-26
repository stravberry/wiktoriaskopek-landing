"use client"

import Link from "next/link"
import { Mail, Phone, MapPin, ArrowUpRight, Instagram, Linkedin, Youtube } from "lucide-react"
import { type Locale, getTranslation } from "@/lib/translations"

export default function Footer({ lang = "pl" }: { lang?: Locale }) {
  const t = getTranslation(lang)
  const currentYear = new Date().getFullYear()

  const services = [
    { name: t.footer.servicesList.videoMarketing, href: "#work" },
    { name: t.footer.servicesList.oneDayPack, href: "#one-day-pack" },
    { name: t.footer.servicesList.podcastStudio, href: "#podcast-studio" },
    { name: t.footer.servicesList.aiAutomation, href: "#maszyna" },
    { name: t.footer.servicesList.consultations, href: "#contact" },
  ]

  const siteMap = [
    { name: t.footer.siteMapList.home, href: `/${lang}` },
    { name: t.footer.siteMapList.portfolio, href: `/${lang}/portfolio` },
    { name: t.footer.siteMapList.about, href: "#info" },
    { name: t.footer.siteMapList.blog, href: `/${lang}/blog` },
    { name: t.footer.siteMapList.contact, href: "#contact" },
  ]

  const socials = [
    { name: "Instagram", icon: Instagram, href: "https://instagram.com" },
    { name: "LinkedIn", icon: Linkedin, href: "https://linkedin.com" },
    { name: "YouTube", icon: Youtube, href: "https://youtube.com" },
  ]

  return (
    <footer className="relative bg-black border-t border-white/10">
      {/* Gradient top border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 md:py-24">
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Brand & Contact */}
          <div className="lg:col-span-1">
            <h3 className="font-display text-3xl text-white mb-6">
              WIKTORIA
              <br />
              SKOPEK
            </h3>
            <p className="text-white/50 font-mono text-xs leading-relaxed mb-6">{t.hero.description}</p>

            <div className="space-y-3">
              <a
                href="mailto:wskopek.all@gmail.com"
                className="flex items-center gap-3 text-white/60 hover:text-accent transition-colors group"
              >
                <Mail className="w-4 h-4" />
                <span className="font-mono text-xs">wskopek.all@gmail.com</span>
              </a>
              <a
                href="tel:+48537168645"
                className="flex items-center gap-3 text-white/60 hover:text-accent transition-colors group"
              >
                <Phone className="w-4 h-4" />
                <span className="font-mono text-xs">+48 537 168 645</span>
              </a>
              <div className="flex items-center gap-3 text-white/60">
                <MapPin className="w-4 h-4" />
                <span className="font-mono text-xs">Katowice, Polska</span>
              </div>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-accent font-mono text-xs tracking-widest uppercase mb-6">{t.footer.services}</h4>
            <ul className="space-y-3">
              {services.map((service) => (
                <li key={service.name}>
                  <a
                    href={service.href}
                    className="flex items-center gap-2 text-white/60 hover:text-white transition-colors group font-mono text-sm"
                  >
                    <span className="w-1.5 h-1.5 bg-accent/50 group-hover:bg-accent transition-colors" />
                    {service.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Site Map */}
          <div>
            <h4 className="text-accent font-mono text-xs tracking-widest uppercase mb-6">{t.footer.siteMap}</h4>
            <ul className="space-y-3">
              {siteMap.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="flex items-center gap-2 text-white/60 hover:text-white transition-colors group font-mono text-sm"
                  >
                    <ArrowUpRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    <span className="group-hover:translate-x-1 transition-transform">{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social & Newsletter */}
          <div>
            <h4 className="text-accent font-mono text-xs tracking-widest uppercase mb-6">{t.footer.socialMedia}</h4>
            <div className="flex gap-4 mb-8">
              {socials.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 border border-white/20 flex items-center justify-center text-white/60 hover:text-accent hover:border-accent transition-colors"
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>

            <h4 className="text-accent font-mono text-xs tracking-widest uppercase mb-4">{t.footer.newsletter}</h4>
            <form className="flex gap-2">
              <input
                type="email"
                placeholder={t.footer.emailPlaceholder}
                className="flex-1 bg-white/5 border border-white/10 px-4 py-2 text-white font-mono text-xs placeholder:text-white/30 focus:outline-none focus:border-accent transition-colors"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-accent text-black font-mono text-xs tracking-wider hover:bg-accent/80 transition-colors"
              >
                OK
              </button>
            </form>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/40 font-mono text-xs">
            © {currentYear} Wiktoria Skopek. {t.footer.copyright}
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-white/40 hover:text-white font-mono text-xs transition-colors">
              {t.footer.privacy}
            </a>
            <a href="#" className="text-white/40 hover:text-white font-mono text-xs transition-colors">
              {t.footer.terms}
            </a>
          </div>
        </div>
      </div>

      {/* Large background text */}
      <div className="absolute bottom-0 left-0 right-0 overflow-hidden pointer-events-none">
        <div className="font-display text-[20vw] text-white/[0.02] leading-none whitespace-nowrap">WIKTORIA SKOPEK</div>
      </div>
    </footer>
  )
}
