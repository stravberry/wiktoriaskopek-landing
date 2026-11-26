import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { MF_BASE_PATH } from "@/lib/mf/config"
import { CHAPTERS } from "@/lib/mf/poradnik"
import { requireBuyer } from "@/lib/mf/guard"
import { Blocks } from "@/components/mf/poradnik-view"

export const dynamic = "force-dynamic"
export const metadata: Metadata = { title: "Poradnik | MontageFrames", robots: { index: false, follow: false } }

export default async function Rozdzial({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const email = await requireBuyer()
  const i = CHAPTERS.findIndex((c) => c.slug === slug)
  if (i < 0) notFound()
  const c = CHAPTERS[i]
  const prev = CHAPTERS[i - 1]
  const next = CHAPTERS[i + 1]
  return (
    <main className="mx-auto grid max-w-[1100px] gap-10 px-5 pb-36 pt-12 md:px-10 md:pt-16 lg:grid-cols-[260px_1fr]">
      <nav aria-label="Spis treści" className="lg:sticky lg:top-8 lg:self-start">
        <Link href={`${MF_BASE_PATH}/poradnik`} className="text-[15px] font-semibold underline">← Spis treści</Link>
        <ol className="mt-4 hidden flex-col gap-2 text-[14px] lg:flex">
          {CHAPTERS.map((x) => (
            <li key={x.slug}>
              <Link href={`${MF_BASE_PATH}/poradnik/${x.slug}`} aria-current={x.slug === slug ? "page" : undefined} className={x.slug === slug ? "font-bold" : "text-[var(--h-ink-2)]"}>
                {x.title}
              </Link>
            </li>
          ))}
        </ol>
      </nav>
      <article>
        <h1 className="text-[clamp(1.8rem,4vw,3rem)] font-bold leading-[1.1] tracking-[-0.03em]">{c.title}</h1>
        <p className="mt-3 mb-8 text-[19px] text-[var(--h-ink-2)]">{c.lead}</p>
        <Blocks blocks={c.blocks} />
        <div className="mt-12 flex justify-between gap-4 text-[16px] font-semibold">
          {prev ? <Link href={`${MF_BASE_PATH}/poradnik/${prev.slug}`} className="underline">← {prev.title}</Link> : <span />}
          {next ? <Link href={`${MF_BASE_PATH}/poradnik/${next.slug}`} className="underline">{next.title} →</Link> : <span />}
        </div>
        <p className="mt-16 text-[13px] text-[var(--h-ink-2)]">Licencja dla: {email}. Nie udostępniaj poradnika innym osobom.</p>
      </article>
    </main>
  )
}
