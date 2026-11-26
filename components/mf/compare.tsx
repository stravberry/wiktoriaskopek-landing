import { Reveal } from "@/components/mf/motion"

// 0f: porównanie w dwóch kolumnach zamiast akapitów. Prawa kolumna wyróżniona, wiersze pojawiają się po kolei.
export function Compare({ rows }: { rows: [label: string, them: string, us: string][] }) {
  return (
    <div className="mx-auto max-w-[980px]">
      <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-x-4 border-b border-[var(--h-ink)]/15 pb-4 text-[15px] font-semibold text-[var(--h-ink-2)] md:grid-cols-[180px_minmax(0,1fr)_minmax(0,1fr)] md:gap-x-8 md:text-[17px]">
        <span className="hidden md:block" aria-hidden />
        <span>Z montażystą</span>
        <span className="text-[var(--h-ink)]">Z MontageFrames</span>
      </div>
      <dl>
        {rows.map(([label, them, us], i) => (
          <Reveal key={label} delay={i * 0.05} className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-x-4 gap-y-2 border-b border-[var(--h-ink)]/10 py-6 md:grid-cols-[180px_minmax(0,1fr)_minmax(0,1fr)] md:gap-x-8 md:py-8">
            <dt className="col-span-2 text-[15px] font-semibold text-[var(--h-ink-2)] md:col-span-1 md:pt-1 md:text-[17px]">{label}</dt>
            <dd className="text-[clamp(1.15rem,2vw,1.6rem)] leading-[1.25] text-[var(--h-ink-2)]">{them}</dd>
            <dd className="text-[clamp(1.15rem,2vw,1.6rem)] font-bold leading-[1.25] tracking-[-0.02em]">{us}</dd>
          </Reveal>
        ))}
      </dl>
    </div>
  )
}
