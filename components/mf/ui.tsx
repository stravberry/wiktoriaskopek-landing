import type React from "react"
import { TODO } from "@/lib/mf/content"

/** Sekcja: nagłówek nazywa temat (bez etykiet nad nim). Odstępy 120–200 px na desktopie. */
export function Section({ id, title, lead, children, className = "", tone = "plain" }: {
  id?: string; title: string; lead?: React.ReactNode; children: React.ReactNode; className?: string; tone?: "plain" | "ink" | "accent" | "surface"
}) {
  const tones = {
    plain: "",
    surface: "bg-[var(--h-surface)]",
    ink: "bg-[#1d1d1f] text-[#f5f5f7] [--h-ink-2:#a1a1a6] [--h-surface:#2c2c2e]",
    accent: "bg-[var(--h-accent)] text-[#111111] [--h-ink-2:#3a1a06]",
  }
  return (
    <section id={id} className={`scroll-mt-6 ${tones[tone]} ${tone === "plain" ? "mt-28 md:mt-44" : "mt-28 py-20 md:mt-44 md:py-32"} ${className}`} aria-labelledby={id ? `${id}-title` : undefined}>
      <div className="mf-wrap">
        <h2 id={id ? `${id}-title` : undefined} className="mf-h2 max-w-[18ch]">{title}</h2>
        {lead && <p className="mf-lead mt-6 max-w-[56ch]">{lead}</p>}
        <div className="mt-12 md:mt-16">{children}</div>
      </div>
    </section>
  )
}

/** Brakująca treść: strona jest publiczna, więc nic nie wyświetlamy (lista braków: DOWOD-PRODUKCJA.md). */
export function Todo(_props: { children?: React.ReactNode; block?: boolean; className?: string }) {
  return null
}

/** Tekst z wyróżnionym „DO UZUPEŁNIENIA”. */
export function WithTodo({ text }: { text: string }) {
  return <>{text.split(TODO).join("").replace(/\s+([.,:;])/g, "$1").trim()}</>
}
