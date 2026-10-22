"use client"

import { useRef } from "react"
import { ArrowUpRight } from "lucide-react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"

gsap.registerPlugin(ScrollTrigger, useGSAP)

const CLIENTS = [
  { name: "Paweł Węglarz", href: "https://pawelweglarz.com" },
  { name: "Artur Arciszewski", href: "https://arturarciszewski.pl" },
  { name: "GlowUp Nutrition", href: "https://nutriglowup.pl" },
  { name: "Ravedron.com", href: "https://www.ravedron.com" },
  { name: "Aleksander Matoga", href: "https://www.alexmatoga.pl" },
  { name: "Zastrzyk Piękna", href: "https://www.zastrzykpiekna.eu" },
  { name: "Magdalena Herod", href: "https://magdalenaherod.pl" },
  { name: "Vital Hormone", href: "https://vital-hormone.pl" },
  { name: "Świeża Bryka", href: "https://świeżabryka.pl/#import-usa" },
  { name: "Świeża Bryka Ameryka", href: "https://swiezabrykaameryka.pl" },
  { name: "Adify", href: "https://adify.pl" },
  { name: "Dotyk Dla Zdrowia", href: "https://www.dotykdlazdrowia.pl" },
  { name: "XanVita", href: "https://xanvita.pl" },
  { name: "Vis Naturae", href: "https://visnaturae.pl" },
  { name: "Kacper Bisanz", href: "https://bisanz.pl" },
  { name: "Happy News", href: "https://www.youtube.com/@onlyhappynews" },
  { name: "Well-done.pl", href: "https://well-done.pl" },
  { name: "ChristiSPA", href: "https://christispa.com" },
]

export default function ClientsSection() {
  const sectionRef = useRef<HTMLElement>(null)

  useGSAP(() => {
    const media = gsap.matchMedia()
    media.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.from(".home-clients-heading", {
        y: 20,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 95%",
          end: "top 65%",
          scrub: 0.5,
        },
      })
      ScrollTrigger.batch(".home-client", {
        start: "top 95%",
        once: true,
        onEnter: (elements) => {
          gsap.from(elements, {
            opacity: 0,
            y: 16,
            duration: 0.6,
            stagger: 0.04,
            ease: "power2.out",
            clearProps: "all",
          })
        },
      })
    })
    return () => media.revert()
  }, { scope: sectionRef })

  return (
    <section ref={sectionRef} id="wspolpraca" className="mt-28 scroll-mt-10 md:mt-40" aria-labelledby="wspolpraca-title">
      <div className="home-clients-heading flex flex-col gap-5 md:flex-row md:items-end md:justify-between md:gap-12">
        <h2 id="wspolpraca-title" className="text-[clamp(2rem,4vw,3.5rem)] font-bold leading-[1.05] tracking-[-0.035em]">
          Z kim pracuję
        </h2>
        <p className="max-w-[32ch] text-[17px] leading-[1.55] text-[var(--h-ink-2)] md:text-right">
          Marki i ludzie, z którymi tworzę.
        </p>
      </div>

      <ul className="mt-10 grid grid-flow-dense grid-cols-1 gap-x-6 md:mt-14 md:grid-cols-2 lg:grid-cols-3 lg:gap-x-9">
        {CLIENTS.map((client) => (
          <li key={client.href} className="home-client min-w-0 border-b border-[var(--h-surface-hover)]">
            <a
              href={client.href}
              target="_blank"
              rel="noopener noreferrer"
              className="home-client-link group flex min-h-[88px] items-center justify-between gap-4 rounded-xl px-3 py-5 text-[var(--h-ink)] transition-colors duration-300 hover:bg-[var(--h-surface)] focus-visible:bg-[var(--h-surface)] md:min-h-[104px] md:px-4"
            >
              <span className="min-w-0 text-[20px] font-semibold leading-[1.3] tracking-[-0.025em] md:text-[22px]">
                {client.name}
              </span>
              <span className="home-client-arrow grid size-9 shrink-0 place-items-center rounded-full bg-[var(--h-surface)] text-[var(--h-ink-2)] transition-[background-color,color,transform] duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:bg-[var(--h-accent)] group-hover:text-[#111111] group-focus-visible:bg-[var(--h-accent)] group-focus-visible:text-[#111111]">
                <ArrowUpRight className="size-[18px]" strokeWidth={1.75} aria-hidden />
              </span>
              <span className="sr-only"> (otwiera się w nowej karcie)</span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  )
}
