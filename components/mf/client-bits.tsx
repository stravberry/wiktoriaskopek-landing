"use client"

import { useState } from "react"
import { ArrowDown } from "lucide-react"
import type { MfProductId } from "@/lib/mf/config"
import type { MfStyle } from "@/lib/mf/content"
import { Todo } from "./ui"

export function BuyButton({ product = "paczka", children, variant = "primary" }: { product?: MfProductId; children: React.ReactNode; variant?: "primary" | "secondary" }) {
  return (
    <a
      href="#zamowienie"
      onClick={() => window.dispatchEvent(new CustomEvent("mf:pick", { detail: product }))}
      className={`inline-flex min-h-14 items-center justify-center gap-3 rounded-full px-7 text-[17px] font-bold transition-transform active:scale-[0.98] ${
        variant === "primary" ? "bg-[var(--h-accent)] text-[#111111]" : "bg-[var(--h-surface)] text-[var(--h-ink)] hover:bg-[var(--h-surface-hover)]"
      }`}
    >
      {children}
      <ArrowDown className="size-5" />
    </a>
  )
}

export function StyleGallery({ styles }: { styles: MfStyle[] }) {
  const tags = [...new Set(styles.flatMap((s) => s.tags))].sort((a, b) => a.localeCompare(b, "pl"))
  const [tag, setTag] = useState<string | null>(null)
  const shown = tag ? styles.filter((s) => s.tags.includes(tag)) : styles
  return (
    <>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Filtr stylów">
        {[null, ...tags].map((t) => (
          <button
            key={t ?? "all"}
            type="button"
            aria-pressed={tag === t}
            onClick={() => setTag(t)}
            className={`rounded-full px-4 py-2 text-[15px] font-semibold transition-colors ${tag === t ? "bg-[var(--h-ink)] text-[var(--h-bg)]" : "bg-[var(--h-surface)] hover:bg-[var(--h-surface-hover)]"}`}
          >
            {t ?? `Wszystkie (${styles.length})`}
          </button>
        ))}
      </div>
      <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {shown.map((s) => (
          <li key={s.slug} className="flex flex-col rounded-[24px] bg-[var(--h-surface)] p-4">
            <div className="aspect-[9/16] w-full overflow-hidden rounded-[16px]">
              <Todo block>Podgląd 5–8 s: {s.slug}.mp4 (z paczki, catalog/previews)</Todo>
            </div>
            <h3 className="mt-4 text-[17px] font-semibold leading-[1.2] tracking-[-0.01em]">{s.name}</h3>
            {s.inspired && <p className="mt-1 text-[15px] text-[var(--h-ink-2)]">inspirowane stylem: {s.inspired}</p>}
            <p className="mt-2 text-[15px] leading-[1.5] text-[var(--h-ink-2)]">{s.text}</p>
          </li>
        ))}
      </ul>
    </>
  )
}
