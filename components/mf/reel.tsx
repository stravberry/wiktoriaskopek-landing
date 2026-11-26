"use client"

import Image from "next/image"
import { useEffect, useState } from "react"
import { motion, useReducedMotion } from "framer-motion"
import { CAPTION_LOOKS, type CaptionLook } from "@/lib/mf/caption-styles"
import type { MfStyle } from "@/lib/mf/content"

const WORDS = ["Montujesz", "sam,", "bez", "montażysty"]
const KEY = 3

function Caption({ look, play }: { look: CaptionLook; play: boolean }) {
  const reduce = useReducedMotion()
  return (
    <p
      className="flex flex-wrap justify-center gap-x-[0.28em] gap-y-[0.15em] px-5 text-center leading-[1.05]"
      style={{
        fontWeight: look.weight,
        textTransform: look.upper ? "uppercase" : "none",
        letterSpacing: look.track ?? "-0.01em",
        fontSize: `calc(${look.size ?? 1} * clamp(1.35rem, 2.4vw, 2rem))`,
      }}
    >
      {WORDS.map((w, i) => {
        const isKey = i === KEY
        const style: React.CSSProperties = { color: isKey ? look.key : look.text }
        if (isKey && look.mark === "box") Object.assign(style, { background: look.markColor, padding: "0 0.18em", borderRadius: 4 })
        if (isKey && look.mark === "underline") Object.assign(style, { boxShadow: `inset 0 -0.14em 0 ${look.markColor}` })
        if (isKey && look.mark === "glow") Object.assign(style, { textShadow: `0 0 18px ${look.key}, 0 0 36px ${look.key}` })
        if (isKey && look.italicKey) style.fontStyle = "italic"
        return (
          <motion.span
            key={`${w}-${look.key}-${look.weight}`}
            style={style}
            initial={play && !reduce ? { opacity: 0, y: 14, scale: 0.96 } : false}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.32, delay: play && !reduce ? i * 0.14 : 0, ease: [0.16, 1, 0.3, 1] }}
          >
            {w}
          </motion.span>
        )
      })}
    </p>
  )
}

/** Kadr rolki 9:16: zdjęcie Wiktorii + napis w wybranym stylu. */
export function ReelFrame({ slug, label, priority = false, className = "" }: { slug: string; label?: string; priority?: boolean; className?: string }) {
  const look = CAPTION_LOOKS[slug] ?? CAPTION_LOOKS["czysty-minimal"]
  const [tick, setTick] = useState(0)
  useEffect(() => setTick((t) => t + 1), [slug])
  return (
    <figure className={`relative aspect-[9/16] w-full overflow-hidden rounded-[32px] bg-[#1d1d1f] ${className}`}>
      <Image
        src="/images/img-2684.jpg"
        alt="Wiktoria Skopek z kamerą w plenerze: kadr do rolki"
        fill
        priority={priority}
        sizes="(min-width: 1024px) 380px, 80vw"
        className="mf-drift object-cover object-[50%_30%]"
      />
      <div className="absolute inset-0" style={{ background: look.shade ?? "rgba(0,0,0,0.12)" }} />
      <div className={`absolute inset-x-0 ${look.pos === "low" ? "bottom-[14%]" : "bottom-[30%]"}`}>
        <Caption key={tick} look={look} play={tick > 1} />
      </div>
      {label && (
        <figcaption className="absolute left-4 top-4 rounded-full bg-black/55 px-3 py-1.5 text-[15px] font-semibold text-white">{label}</figcaption>
      )}
    </figure>
  )
}

/** Żywy element strony: wybierasz styl, kadr od razu pokazuje napis w tym stylu. */
export function StylePicker({ styles }: { styles: MfStyle[] }) {
  const [slug, setSlug] = useState(styles[0].slug)
  const current = styles.find((s) => s.slug === slug) ?? styles[0]
  return (
    <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-16">
      <div>
        <ul className="flex flex-wrap gap-2" aria-label="Style montażu">
          {styles.map((s) => (
            <li key={s.slug}>
              <button
                type="button"
                aria-pressed={s.slug === slug}
                onClick={() => setSlug(s.slug)}
                className={`mf-press min-h-11 rounded-full px-4 text-[15px] font-semibold transition-colors ${
                  s.slug === slug ? "bg-[var(--h-ink)] text-[var(--h-bg)]" : "bg-[var(--h-surface)] hover:bg-[var(--h-surface-hover)]"
                }`}
              >
                {s.name}
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <ReelFrame slug={slug} className="mx-auto max-w-[340px] lg:max-w-none" />
        <div className="mt-5">
          <p className="text-[21px] font-semibold tracking-[-0.01em]">{current.name}</p>
          {current.inspired && <p className="mt-1 text-[15px] text-[var(--h-ink-2)]">inspirowane stylem: {current.inspired}</p>}
          <p className="mt-2 text-[17px] leading-[1.5]">{current.text}</p>
          <p className="mt-3 text-[15px] text-[var(--h-ink-2)]">Przybliżony podgląd napisu. Prawdziwe rolki z programu są wyżej; próbki pozostałych stylów: DO UZUPEŁNIENIA.</p>
        </div>
      </div>
    </div>
  )
}
