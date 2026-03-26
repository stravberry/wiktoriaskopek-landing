"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { createPortal } from "react-dom"
import Link from "next/link"
import { useRouter } from "next/navigation"
import type { Locale } from "@/lib/translations"
import LanguageSwitcher from "./language-switcher"

interface BurgerMenuProps {
  lang: Locale
  variant?: "main" | "subpage"
}

export default function BurgerMenu({ lang, variant = "main" }: BurgerMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isClosing, setIsClosing] = useState(false)
  const [mounted, setMounted] = useState(false)
  const router = useRouter()
  const isEnglish = lang === "en"

  const navItems = [
    { href: `/${lang}`, label: isEnglish ? "HOME" : "START" },
    { href: `/${lang}/portfolio`, label: "PORTFOLIO" },
    { href: `/${lang}/podcasty`, label: isEnglish ? "PODCASTS" : "PODCASTY" },
    { href: `/${lang}/youtube`, label: "YOUTUBE" },
    { href: `/${lang}/kursy-online`, label: isEnglish ? "COURSES" : "KURSY" },
    { href: `/${lang}/transmisje-live`, label: "LIVE" },
    { href: `/${lang}/blog`, label: "BLOG" },
    { href: `/${lang}/konsultacje`, label: isEnglish ? "CONSULTING" : "KONSULTACJE" },
    { href: `/${lang}/linki`, label: isEnglish ? "LINKS" : "LINKI" },
  ]

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (isOpen) {
      document.documentElement.style.overflow = "hidden"
    } else if (!isClosing) {
      document.documentElement.style.overflow = ""
    }
    return () => {
      document.documentElement.style.overflow = ""
    }
  }, [isOpen, isClosing])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose()
    }
    window.addEventListener("keydown", handleEscape)
    return () => window.removeEventListener("keydown", handleEscape)
  }, [])

  const handleClose = () => {
    setIsClosing(true)
    setTimeout(() => {
      setIsOpen(false)
      setIsClosing(false)
      document.documentElement.style.overflow = ""
    }, 300)
  }

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    setIsClosing(true)

    setTimeout(() => {
      setIsOpen(false)
      setIsClosing(false)
      document.documentElement.style.overflow = ""

      // Navigate and scroll to top
      router.push(href)
      window.scrollTo({ top: 0, left: 0, behavior: "instant" })
    }, 300)
  }

  const menuOverlay =
    (isOpen || isClosing) && mounted
      ? createPortal(
          <div
            className={`fixed inset-0 bg-[#0a0a0a] overflow-y-auto transition-all duration-300 ease-out ${
              isClosing ? "opacity-0" : "opacity-100"
            }`}
            style={{ zIndex: 9998 }}
          >
            {/* Subtle decorative elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div
                className={`absolute top-20 right-10 w-64 h-64 rounded-full bg-accent/10 blur-3xl transition-all duration-300 ${
                  isClosing ? "opacity-0 scale-50" : "opacity-100 scale-100"
                }`}
              />
              <div
                className={`absolute bottom-20 left-10 w-48 h-48 rounded-full bg-white/5 blur-2xl transition-all duration-300 ${
                  isClosing ? "opacity-0 scale-50" : "opacity-100 scale-100"
                }`}
              />
            </div>

            {/* Close button in overlay */}
            <button
              onClick={handleClose}
              className={`absolute top-4 right-4 w-10 h-10 flex flex-col items-center justify-center gap-1.5 transition-all duration-300 ${
                isClosing ? "opacity-0 rotate-90" : "opacity-100 rotate-0"
              }`}
              style={{ zIndex: 9999 }}
              aria-label="Close menu"
            >
              <span className="block w-6 h-0.5 bg-white rotate-45 translate-y-2" />
              <span className="block w-6 h-0.5 bg-white opacity-0" />
              <span className="block w-6 h-0.5 bg-white -rotate-45 -translate-y-2" />
            </button>

            {/* Menu Content */}
            <div className="relative min-h-full flex flex-col justify-center px-8 py-24">
              {/* Navigation Links */}
              <nav className="flex flex-col gap-1">
                {navItems.map((item, index) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={(e) => handleLinkClick(e, item.href)}
                    className={`group flex items-center gap-4 py-2 transition-all duration-300 ${
                      isClosing ? "opacity-0 -translate-x-8" : "animate-fadeSlideIn"
                    }`}
                    style={{
                      animationDelay: isClosing ? "0ms" : `${50 + index * 30}ms`,
                      transitionDelay: isClosing ? `${(navItems.length - index) * 20}ms` : "0ms",
                    }}
                  >
                    <span className="text-accent/60 font-mono text-xs w-6">0{index + 1}</span>
                    <span className="font-display text-2xl sm:text-3xl text-white group-hover:text-accent transition-colors duration-200">
                      {item.label}
                    </span>
                  </Link>
                ))}
              </nav>

              {/* Bottom Section */}
              <div
                className={`mt-auto pt-8 flex items-center justify-between border-t border-white/10 transition-all duration-300 ${
                  isClosing ? "opacity-0 translate-y-4" : "animate-fadeSlideIn"
                }`}
                style={{ animationDelay: isClosing ? "0ms" : "400ms" }}
              >
                <div className="flex flex-col gap-1">
                  <a
                    href="mailto:wskopek.all@gmail.com"
                    className="text-white/60 hover:text-accent font-mono text-xs transition-colors"
                  >
                    wskopek.all@gmail.com
                  </a>
                  <span className="text-white/40 font-mono text-xs">+48 537 168 645</span>
                </div>
                <LanguageSwitcher currentLocale={lang} />
              </div>
            </div>

            <style jsx global>{`
              @keyframes fadeSlideIn {
                from {
                  opacity: 0;
                  transform: translateX(-20px);
                }
                to {
                  opacity: 1;
                  transform: translateX(0);
                }
              }
              .animate-fadeSlideIn {
                animation: fadeSlideIn 0.3s ease-out forwards;
                opacity: 0;
              }
            `}</style>
          </div>,
          document.body,
        )
      : null

  return (
    <>
      {/* Burger Button */}
      <button
        onClick={() => (isOpen ? handleClose() : setIsOpen(true))}
        className="relative w-10 h-10 flex flex-col items-center justify-center gap-1.5"
        style={{ zIndex: isOpen ? 9999 : 100 }}
        aria-label={isOpen ? "Close menu" : "Open menu"}
        aria-expanded={isOpen}
      >
        <span
          className={`block w-6 h-0.5 transition-all duration-300 ease-out ${
            isOpen ? "rotate-45 translate-y-2 bg-white" : "bg-white"
          }`}
        />
        <span
          className={`block w-6 h-0.5 bg-white transition-all duration-300 ease-out ${
            isOpen ? "opacity-0 scale-0" : ""
          }`}
        />
        <span
          className={`block w-6 h-0.5 transition-all duration-300 ease-out ${
            isOpen ? "-rotate-45 -translate-y-2 bg-white" : "bg-white"
          }`}
        />
      </button>

      {menuOverlay}
    </>
  )
}
