"use client"

import { useState } from "react"
import { LazyVideo } from "@/components/mf/lazy-video"

// 0k (wydanie 9): proste napisy 1/2/3 słowa × 5 animacji (prawdziwe rendery silnika, Coding Builder) i 5 wariantów Paper.
const WORDS = [
  { id: 1, label: "1 słowo" },
  { id: 2, label: "2 słowa" },
  { id: 3, label: "3 słowa" },
] as const
const ANIMS = [
  { id: "none", label: "Bez animacji" },
  { id: "pop", label: "Pop" },
  { id: "fade", label: "Fade" },
  { id: "slideup", label: "Wjazd w górę" },
  { id: "typewriter", label: "Maszyna do pisania" },
] as const

function Pills<T extends string | number>({ label, items, value, onChange }: { label: string; items: readonly { id: T; label: string }[]; value: T; onChange: (v: T) => void }) {
  return (
    <div role="radiogroup" aria-label={label} className="flex flex-wrap gap-2">
      {items.map((it) => (
        <button
          key={String(it.id)}
          type="button"
          role="radio"
          aria-checked={value === it.id}
          onClick={() => onChange(it.id)}
          className={`mf-press min-h-11 rounded-full px-4 text-[15px] font-semibold ${value === it.id ? "bg-[var(--h-ink)] text-[var(--h-bg)]" : "bg-[var(--h-surface)] hover:bg-[var(--h-surface-hover)]"}`}
        >
          {it.label}
        </button>
      ))}
    </div>
  )
}

export function SimpleCaptions() {
  const [words, setWords] = useState<1 | 2 | 3>(2)
  const [anim, setAnim] = useState<(typeof ANIMS)[number]["id"]>("pop")
  const animLabel = ANIMS.find((a) => a.id === anim)?.label ?? ""
  return (
    <div className="grid items-start gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,360px)] md:gap-16">
      <div className="flex flex-col gap-8 lg:sticky lg:top-24">
        <div>
          <p className="mb-3 text-[15px] font-semibold text-[var(--h-ink-2)]">Ile słów naraz</p>
          <Pills label="Ile słów naraz" items={WORDS} value={words} onChange={setWords} />
        </div>
        <div>
          <p className="mb-3 text-[15px] font-semibold text-[var(--h-ink-2)]">Animacja</p>
          <Pills label="Animacja" items={ANIMS} value={anim} onChange={setAnim} />
        </div>
        <p className="max-w-[46ch] text-[17px] leading-[1.55] text-[var(--h-ink-2)]">
          Tryb napisów działa też na każdym z pozostałych stylów: na przykład Neon noc po 2 słowa, bez animacji. Ustawiasz to w „Edytuj styl” albo komendą /styl.
        </p>
      </div>
      <LazyVideo
        key={`${words}-${anim}`}
        className="mx-auto aspect-[9/16] w-full max-w-[360px] rounded-[28px] bg-[#1d1d1f] object-cover"
        src={`/mf/proste/proste-${words}-${anim}.mp4`}
        poster="/mf/proste/proste-poster.jpg"
        label={`Proste napisy: ${WORDS.find((w) => w.id === words)?.label}, ${animLabel}`}
      />
    </div>
  )
}

const PAPER = [
  { slug: "papierowy-kolaz", name: "Kolaż", text: "darte skrawki, wklejanie poklatkowe" },
  { slug: "paper-zeszyt", name: "Zeszyt", text: "kartki w linie, zakreślacz, washi" },
  { slug: "paper-wycinanki", name: "Wycinanki", text: "nasycone kolory, słowa spadają z góry" },
  { slug: "paper-gazeta", name: "Gazeta", text: "list z wycinków, każde słowo innym krojem" },
  { slug: "paper-karton", name: "Karton", text: "etykiety, maszyna do pisania, stempel" },
]

/** Paper w pięciu wariantach: poziomy pasek z przewijaniem na telefonie, filmy ładują się dopiero przy widoku. */
export function PaperVariants() {
  return (
    <ul className="-mx-[var(--mf-gutter,20px)] flex snap-x snap-mandatory scroll-px-[var(--mf-gutter,20px)] gap-4 overflow-x-auto px-[var(--mf-gutter,20px)] pb-2 md:mx-0 md:grid md:grid-cols-5 md:overflow-visible md:px-0">
      {PAPER.map((p) => (
        <li key={p.slug} className="w-[58vw] max-w-[240px] shrink-0 snap-start md:w-auto md:max-w-none">
          <LazyVideo className="aspect-[9/16] w-full rounded-[22px] bg-[#1d1d1f] object-cover" src={`/mf/style/${p.slug}.mp4`} poster={`/mf/style/${p.slug}.jpg`} label={`Paper: ${p.name.toLowerCase()}`} />
          <p className="mt-3 text-[17px] font-semibold">Paper: {p.name.toLowerCase()}</p>
          <p className="text-[15px] leading-[1.45] text-[var(--h-ink-2)]">{p.text}</p>
        </li>
      ))}
    </ul>
  )
}
