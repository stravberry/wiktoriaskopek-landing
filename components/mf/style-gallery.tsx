"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { useReducedMotion } from "framer-motion"
import type { MfStyle, MfStyleUse } from "@/lib/mf/content"
import { nobr } from "@/lib/typo"

// Galeria stylów (landing i próba): karta = poster, a podgląd w ruchu dopiero po najechaniu (mysz)
// albo gdy karta jest na środku ekranu (dotyk). Wideo montujemy tylko dla aktywnej karty, więc reszta nic nie pobiera.

/** Odmiana: 1 styl, 2–4 style (bez 12–14), reszta stylów. Jak stylesLabel w lib/mf/content.ts (bez importu treści do JS klienta). */
const stylesWord = (n: number) => (n === 1 ? "styl" : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 12 || n % 100 > 14) ? "style" : "stylów")

type Filter = "wszystkie" | "spokojne" | "dynamiczne" | MfStyleUse
const FILTERS: { id: Filter; label: string }[] = [
  { id: "wszystkie", label: "Wszystkie" },
  { id: "spokojne", label: "Spokojne" },
  { id: "dynamiczne", label: "Dynamiczne" },
  { id: "sprzedaz", label: "Sprzedażowe" },
  { id: "premium", label: "Premium" },
  { id: "edukacja", label: "Edukacyjne" },
  { id: "lifestyle", label: "Lifestyle" },
  { id: "rozrywka", label: "Rozrywka" },
  { id: "rozmowa", label: "Rozmowy i podcasty" },
]
const USE_LABEL: Record<MfStyleUse, string> = {
  sprzedaz: "sprzedażowy",
  premium: "premium",
  edukacja: "edukacyjny",
  lifestyle: "lifestyle",
  rozrywka: "rozrywka",
  rozmowa: "rozmowy",
}
const match = (s: MfStyle, f: Filter) =>
  f === "wszystkie" ? true : f === "spokojne" ? s.tempo === "spokojne" : f === "dynamiczne" ? s.tempo === "szybkie" : s.use.includes(f)

function Check() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden className="size-4">
      <path d="M3 8.5l3.2 3L13 4.5" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function StyleCard({ s, selected, onSelect, active, setActive }: {
  s: MfStyle
  selected: boolean
  onSelect?: (slug: string) => void
  active: boolean
  setActive: React.Dispatch<React.SetStateAction<string | null>>
}) {
  const ref = useRef<HTMLLIElement>(null)
  const reduce = useReducedMotion()

  // Ekrany dotykowe: podgląd gra dla karty, która jest w większości widoczna.
  useEffect(() => {
    const el = ref.current
    if (!el || reduce || window.matchMedia("(hover: hover)").matches) return
    const io = new IntersectionObserver(([e]) => setActive((cur) => (e.intersectionRatio > 0.85 ? s.slug : cur === s.slug ? null : cur)), { threshold: [0, 0.85] })
    io.observe(el)
    return () => io.disconnect()
  }, [s.slug, reduce, setActive])

  const body = (
    <>
      <div className="relative aspect-[9/16] w-full overflow-hidden rounded-[18px] bg-[#1d1d1f]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`/mf/style/${s.slug}.jpg`} alt="" loading="lazy" decoding="async" className="absolute inset-0 size-full object-cover" />
        {active && !reduce && (
          <video src={`/mf/style/${s.slug}.mp4`} autoPlay muted loop playsInline className="absolute inset-0 size-full object-cover" aria-hidden />
        )}
        {selected && (
          <span className="absolute right-2 top-2 inline-flex items-center gap-1 rounded-full bg-[var(--h-accent)] px-2.5 py-1 text-[13px] font-bold text-[#111111]">
            <Check /> Wybrany
          </span>
        )}
      </div>
      <p className="mt-3 text-[17px] font-semibold leading-[1.25]">{s.name}</p>
      <p className="mt-1 text-[15px] leading-[1.45] text-[var(--h-ink-2)]">{s.forWhom}</p>
      <ul className="mt-2 flex flex-wrap gap-1.5 text-[14px] text-[#4a4a4a]" aria-label="Cechy stylu">
        <li className="rounded-full bg-[var(--h-surface)] px-2.5 py-1">{nobr(s.motion.split(",")[0])}</li>
        <li className="rounded-full bg-[var(--h-surface)] px-2.5 py-1">tempo {s.tempo}</li>
        {s.use[0] && <li className="rounded-full bg-[var(--h-surface)] px-2.5 py-1">{USE_LABEL[s.use[0]]}</li>}
      </ul>
      {s.inspired && <p className="mt-2 text-[14px] text-[#4a4a4a]">inspirowane stylem: {s.inspired}</p>}
    </>
  )

  return (
    <li
      ref={ref}
      className="w-[58vw] max-w-[240px] shrink-0 snap-start sm:w-auto sm:max-w-none"
      onMouseEnter={() => setActive(s.slug)}
      onMouseLeave={() => setActive((cur) => (cur === s.slug ? null : cur))}
    >
      {onSelect ? (
        <button
          type="button"
          aria-pressed={selected}
          onClick={() => onSelect(s.slug)}
          onFocus={() => setActive(s.slug)}
          className={`mf-lift block w-full rounded-[22px] p-2 text-left transition-shadow ${selected ? "shadow-[0_0_0_3px_var(--h-accent)]" : "hover:shadow-[0_0_0_2px_var(--h-surface-hover)]"}`}
        >
          {body}
        </button>
      ) : (
        <div className="mf-lift p-2" onFocus={() => setActive(s.slug)} tabIndex={0} aria-label={`Styl ${s.name}: ${s.forWhom}`}>
          {body}
        </div>
      )}
    </li>
  )
}

export function StyleGallery({ styles, selected, onSelect, initialCount = 8 }: {
  styles: MfStyle[]
  selected?: string
  onSelect?: (slug: string) => void
  /** Ile kart pokazać przed „Pokaż wszystkie” (bez filtra). */
  initialCount?: number
}) {
  const [filter, setFilter] = useState<Filter>("wszystkie")
  const [all, setAll] = useState(false)
  const [active, setActive] = useState<string | null>(null)
  const list = useMemo(() => styles.filter((s) => match(s, filter)), [styles, filter])
  const shown = filter === "wszystkie" && !all ? list.slice(0, initialCount) : list

  return (
    <div>
      <div className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-2 md:mx-0 md:flex-wrap md:px-0" role="group" aria-label="Filtruj style">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            aria-pressed={filter === f.id}
            onClick={() => setFilter(f.id)}
            className={`mf-press min-h-11 shrink-0 rounded-full px-4 text-[15px] font-semibold transition-colors ${
              filter === f.id ? "bg-[var(--h-ink)] text-[var(--h-bg)]" : "bg-[var(--h-surface)] hover:bg-[var(--h-surface-hover)]"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>
      <p className="mt-3 text-[15px] text-[var(--h-ink-2)]" aria-live="polite">
        {list.length} {stylesWord(list.length)}.
        {" "}Najedź na kartę albo przewiń, żeby zobaczyć rolkę w ruchu.
      </p>
      <ul className="-mx-5 mt-5 flex snap-x snap-mandatory scroll-px-5 gap-2 overflow-x-auto px-5 pb-4 sm:mx-0 sm:grid sm:grid-cols-3 sm:gap-3 sm:overflow-visible sm:px-0 md:grid-cols-4 lg:grid-cols-5">
        {shown.map((s) => (
          <StyleCard key={s.slug} s={s} selected={selected === s.slug} onSelect={onSelect} active={active === s.slug} setActive={setActive} />
        ))}
      </ul>
      {filter === "wszystkie" && !all && list.length > initialCount && (
        <button type="button" onClick={() => setAll(true)} className="mf-press mt-4 min-h-12 rounded-full bg-[var(--h-surface)] px-6 text-[17px] font-semibold hover:bg-[var(--h-surface-hover)]">
          Pokaż wszystkie {list.length} {stylesWord(list.length)}
        </button>
      )}
    </div>
  )
}
