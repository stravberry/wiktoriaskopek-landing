"use client"

import { useState } from "react"
import Link from "next/link"
import { MF_BASE_PATH } from "@/lib/mf/config"
import type { Block, Chapter } from "@/lib/mf/poradnik"

const text = (c: Chapter) =>
  [c.title, c.lead, ...c.blocks.map((b) => ("p" in b ? b.p : "code" in b ? b.code : "list" in b ? b.list.join(" ") : ""))].join(" ").toLowerCase()

export function PoradnikSearch({ chapters }: { chapters: Chapter[] }) {
  const [q, setQ] = useState("")
  const shown = q.trim() ? chapters.filter((c) => text(c).includes(q.trim().toLowerCase())) : chapters
  return (
    <>
      <input
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Szukaj w poradniku, np. poprawki, /styl, GitHub"
        aria-label="Szukaj w poradniku"
        className="min-h-12 w-full rounded-2xl bg-[var(--h-surface)] px-5 text-[16px] outline-none focus:ring-2 focus:ring-[var(--h-accent)]"
      />
      <ol className="mt-6 flex flex-col gap-3">
        {shown.map((c) => (
          <li key={c.slug}>
            <Link href={`${MF_BASE_PATH}/poradnik/${c.slug}`} className="home-tile block rounded-[24px] bg-[var(--h-surface)] p-6">
              <span className="block text-[19px] font-semibold">{c.title}</span>
              <span className="mt-1 block text-[15px] text-[var(--h-ink-2)]">{c.lead}</span>
            </Link>
          </li>
        ))}
        {!shown.length && <li className="text-[16px] text-[var(--h-ink-2)]">Nic nie znaleziono.</li>}
      </ol>
    </>
  )
}

export function Blocks({ blocks }: { blocks: Block[] }) {
  return (
    <div className="flex flex-col gap-5 text-[17px] leading-[1.65]">
      {blocks.map((b, i) =>
        "p" in b ? (
          <p key={i}>{b.p}</p>
        ) : "code" in b ? (
          <pre key={i} className="overflow-x-auto rounded-2xl bg-[#1d1d1f] p-5 text-[14px] leading-[1.6] text-white"><code>{b.code}</code></pre>
        ) : "list" in b ? (
          <ul key={i} className="flex list-disc flex-col gap-2 pl-6">{b.list.map((x) => <li key={x}>{x}</li>)}</ul>
        ) : "img" in b ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={i} src={b.img} alt={b.alt} loading="lazy" className="w-full rounded-[16px] bg-[var(--h-surface)]" />
        ) : null,
      )}
    </div>
  )
}
