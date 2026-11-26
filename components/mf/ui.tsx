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

/** Widoczny znacznik brakującej treści lub mediów (pełne tło, bez przerywanej ramki). */
export function Todo({ children = TODO, block = false, className = "" }: { children?: React.ReactNode; block?: boolean; className?: string }) {
  return block ? (
    <div className={`grid place-items-center bg-[#ececf0] p-6 text-center text-[15px] font-semibold text-[#9a3412] ${className}`}>{children}</div>
  ) : (
    <span className="rounded bg-[#ececf0] px-1.5 py-0.5 font-semibold text-[#9a3412]">{children}</span>
  )
}

/** Tekst z wyróżnionym „DO UZUPEŁNIENIA”. */
export function WithTodo({ text }: { text: string }) {
  const parts = text.split(TODO)
  return (
    <>
      {parts.map((p, i) => (
        <span key={i}>
          {p}
          {i < parts.length - 1 && <Todo />}
        </span>
      ))}
    </>
  )
}
