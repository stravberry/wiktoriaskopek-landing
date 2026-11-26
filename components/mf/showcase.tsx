import Image from "next/image"
import { MF_PANEL_SHOTS, MF_STYLES, MF_STYLE_REELS, styleVideo, type MfShowcase } from "@/lib/mf/content"
import { LazyVideo } from "@/components/mf/lazy-video"
import { Reveal } from "@/components/mf/motion"

/** Pokaz stylów: prawdziwe rolki, przewijane w poziomie (telefon i komputer). Pliki ładują się dopiero przy wejściu w widok. */
export function StyleReels() {
  return (
    <ul className="-mx-5 flex snap-x snap-mandatory scroll-px-5 gap-4 overflow-x-auto px-5 pb-4 md:gap-6" aria-label="Prawdziwe rolki z programu w różnych stylach">
      {MF_STYLE_REELS.map((slug) => {
        const s = MF_STYLES.find((x) => x.slug === slug)
        if (!s) return null
        const v = styleVideo(slug)
        return (
          <li key={slug} className="mf-lift w-[64vw] max-w-[260px] shrink-0 snap-start">
            <LazyVideo className="aspect-[9/16] w-full rounded-[20px] bg-[#1d1d1f] object-cover" src={v.src} poster={v.poster} label={`Rolka demo w stylu ${s.name}`} />
            <p className="mt-3 text-[17px] font-semibold">{s.name}</p>
            <p className="mt-1 text-[15px] leading-[1.45] text-[var(--h-ink-2)]">
              {s.motion}
              {s.inspired && <><br />inspirowane stylem: {s.inspired}</>}
            </p>
          </li>
        )
      })}
    </ul>
  )
}

/** Jedna funkcja = jedna sekcja z własnym filmem (i zrzutem panelu, jeśli jest). */
export function ShowcaseBlock({ f, flip }: { f: MfShowcase; flip: boolean }) {
  return (
    <section id={f.id} aria-labelledby={`${f.id}-title`} className="mf-wrap scroll-mt-6 mt-24 md:mt-36">
      <div className={`grid items-center gap-10 md:gap-16 ${!f.video ? "" : f.video.aspect === "16/9" ? "lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)]" : "md:grid-cols-[minmax(0,1fr)_320px]"}`}>
        <Reveal className={flip && f.video ? "md:order-2" : ""}>
          <h3 id={`${f.id}-title`} className="text-[clamp(1.75rem,3.4vw,2.75rem)] font-bold leading-[1.05] tracking-[-0.03em]">{f.title}</h3>
          <p className="mf-lead mt-4 max-w-[46ch]">{f.lead}</p>
          <ul className="mt-6 flex max-w-[56ch] list-disc flex-col gap-3 pl-5 leading-[1.6]">
            {f.points.map((x) => <li key={x}>{x}</li>)}
          </ul>
          {f.image && (
            <Image src={f.image.src} alt={f.image.alt} width={f.image.w} height={f.image.h} sizes="(min-width: 1024px) 760px, 92vw" className="mt-8 w-full rounded-[20px] bg-[var(--h-surface)]" />
          )}
        </Reveal>
        {f.video && (
          <Reveal delay={0.08} className={flip ? "md:order-1" : ""}>
            <LazyVideo
              className={`${f.video.aspect === "16/9" ? "aspect-video" : "mx-auto aspect-[9/16] max-w-[320px]"} w-full rounded-[24px] bg-[#1d1d1f] object-cover`}
              src={f.video.src}
              poster={f.video.poster}
              label={`Film: ${f.title} w MontageFrames`}
            />
          </Reveal>
        )}
      </div>
    </section>
  )
}

/** Zrzuty panelu w poziomym pasku (telefon) albo siatce 2×2 (komputer). */
export function PanelShots() {
  return (
    <ul className="-mx-5 flex snap-x snap-mandatory scroll-px-5 gap-4 overflow-x-auto px-5 pb-4 md:mx-0 md:grid md:grid-cols-2 md:gap-6 md:overflow-visible md:px-0" aria-label="Ekrany panelu">
      {MF_PANEL_SHOTS.map((s) => (
        <li key={s.src} className="mf-lift w-[84vw] shrink-0 snap-start md:w-auto">
          <figure>
            <Image src={s.src} alt={s.alt} width={1440} height={900} sizes="(min-width: 768px) 600px, 84vw" className="w-full rounded-[20px] bg-[var(--h-surface)]" />
            <figcaption className="mt-3 text-[17px] font-semibold">{s.title}</figcaption>
          </figure>
        </li>
      ))}
    </ul>
  )
}
