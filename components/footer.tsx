"use client"

import Link from "next/link"
import { Mail, Phone, Instagram, Youtube } from "lucide-react"
import { type Locale, getTranslation } from "@/lib/translations"

export default function Footer({ lang = "pl" }: { lang?: Locale }) {
  const t = getTranslation(lang)
  const currentYear = new Date().getFullYear()

  const siteMap = [
    { name: t.footer.siteMapList.home, href: `/${lang}` },
    { name: t.footer.siteMapList.portfolio, href: `/${lang}/portfolio` },
    { name: t.footer.siteMapList.about, href: "#info" },
    { name: t.footer.siteMapList.blog, href: `/${lang}/blog` },
    { name: t.footer.siteMapList.contact, href: "#qualification" },
  ]

  const socials = [
    { name: "Instagram", icon: Instagram, href: "https://instagram.com/wiktoria.skopek" },
    { name: "YouTube", icon: Youtube, href: "https://youtube.com/@wiktoriaskopek" },
  ]

  return (
    <footer className="relative bg-[#050505] pt-12 md:pt-16 pb-8 overflow-hidden">
      {/* Top Border Gradient - Performance Optimized */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-px bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />
      
      {/* Bottom Amber Glow - Forcing GPU */}
      <div 
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-accent/5 blur-[100px] rounded-full pointer-events-none" 
        style={{ transform: "translate3d(-50%, 0, 0)" }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-16 mb-12 md:mb-16">
          
          {/* Brand Column */}
          <div className="lg:col-span-6">
            <h3 className="font-display text-4xl md:text-5xl text-white tracking-tighter mb-8 group cursor-default will-change-transform">
              WIKTORIA <br />
              <span className="text-white/20 group-hover:text-accent transition-[color] duration-700">SKOPEK</span>
            </h3>
            
            <p className="font-sans text-white/40 text-sm md:text-base leading-relaxed mb-8 max-w-sm">
              Twój partner strategiczny w budowaniu autorytetu wideo. Łączymy produkcję premium z psychologią sprzedaży.
            </p>

            <div className="space-y-4">
               <a href="mailto:wskopek.all@gmail.com" className="group flex items-center gap-3 w-fit">
                  <div className="w-8 h-8 rounded-full border border-white/5 flex items-center justify-center group-hover:border-accent/30 group-hover:bg-accent/5 transition-[border-color,background-color] duration-500">
                     <Mail className="w-3.5 h-3.5 text-white/40 group-hover:text-accent transition-colors duration-500" />
                  </div>
                  <span className="font-sans text-sm text-white/40 group-hover:text-white transition-colors duration-500 tracking-tight font-medium">wskopek.all@gmail.com</span>
               </a>
               <a href="tel:+48537168645" className="group flex items-center gap-3 w-fit">
                  <div className="w-8 h-8 rounded-full border border-white/5 flex items-center justify-center group-hover:border-accent/30 group-hover:bg-accent/5 transition-[border-color,background-color] duration-500">
                     <Phone className="w-3.5 h-3.5 text-white/40 group-hover:text-accent transition-colors duration-500" />
                  </div>
                  <span className="font-sans text-sm text-white/40 group-hover:text-white transition-colors duration-500 tracking-tight font-medium">+48 537 168 645</span>
               </a>
            </div>
          </div>

          {/* Navigation Column */}
          <div className="lg:col-span-3">
             <h4 className="font-display text-xs tracking-[.2em] text-accent/60 uppercase mb-8 font-bold">Nawigacja</h4>
             <ul className="space-y-4">
                {siteMap.map((item) => (
                   <li key={item.name}>
                      <Link href={item.href} className="group flex items-center gap-2 font-sans text-sm text-white/30 hover:text-white transition-colors duration-500 font-medium">
                         <span className="w-0 group-hover:w-1.5 h-px bg-accent/50 transition-[width,opacity] duration-500 opacity-0 group-hover:opacity-100" />
                         {item.name}
                      </Link>
                   </li>
                ))}
             </ul>
          </div>

          {/* Socials & Legal Column */}
          <div className="lg:col-span-3">
             <h4 className="font-display text-xs tracking-[.2em] text-accent/60 uppercase mb-8 font-bold">Social Media</h4>
             <div className="flex gap-4 mb-12">
                {socials.map((social) => (
                   <a 
                     key={social.name} 
                     href={social.href}
                     target="_blank"
                     rel="noopener noreferrer"
                     className="w-12 h-12 rounded-full border border-white/5 flex items-center justify-center text-white/20 hover:text-accent hover:border-accent/40 hover:bg-accent/5 transition-[color,border-color,background-color] duration-500"
                   >
                      <social.icon className="w-5 h-5" />
                   </a>
                ))}
             </div>

             <div className="pt-8 border-t border-white/5 space-y-4">
                <Link href="#" className="block font-sans text-[10px] uppercase tracking-widest text-white/20 hover:text-white transition-colors duration-500 font-bold">Polityka Prywatności</Link>
                <Link href="#" className="block font-sans text-[10px] uppercase tracking-widest text-white/20 hover:text-white transition-colors duration-500 font-bold">Regulamin</Link>
             </div>
          </div>

        </div>

        {/* Brand Imprint Background Decor - Hardware Accelerated */}
        <div className="absolute bottom-0 left-0 right-0 h-32 md:h-48 pointer-events-none select-none overflow-hidden opacity-[0.02] flex items-end will-change-transform">
           <span 
             className="font-display text-[15vw] leading-none text-white whitespace-nowrap -mb-8"
             style={{ transform: "translate3d(0, 0, 0)" }}
           >
              WIKTORIA SKOPEK
           </span>
        </div>

        {/* Sub-footer */}
        <div className="relative z-10 py-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
           <p className="font-sans text-[10px] text-white/20 uppercase tracking-widest font-bold">
              © {currentYear} WIKTORIA SKOPEK. ALL RIGHTS RESERVED.
           </p>
           <p className="font-sans text-[10px] text-white/10 uppercase tracking-widest font-bold">
              Design & Strategy by <span className="hover:text-accent cursor-pointer transition-colors duration-500">ST</span>
           </p>
        </div>
      </div>
    </footer>
  )
}
