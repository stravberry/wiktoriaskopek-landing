"use client"

import { useEffect, useRef, useState } from "react"
import { useReducedMotion } from "framer-motion"

/**
 * Film na landingu bez kosztu na starcie: nic nie pobiera, dopóki nie jest blisko widoku (wtedy poster i źródło, preload none),
 * odtwarza się wyciszony, gdy jest widoczny, i pauzuje poza widokiem. Przy reduced motion: poster i przycisk play.
 */
export function LazyVideo({ src, poster, label, className = "", controls = false }: { src: string; poster: string; label: string; className?: string; controls?: boolean }) {
  const ref = useRef<HTMLVideoElement>(null)
  const [near, setNear] = useState(false)
  const visible = useRef(false)
  const reduce = useReducedMotion()

  useEffect(() => {
    const v = ref.current
    if (!v) return
    // Dwa obserwatory: wcześniejsze ładowanie (300 px przed widokiem) i odtwarzanie tylko w widoku.
    const load = new IntersectionObserver(([e]) => e.isIntersecting && setNear(true), { rootMargin: "300px 0px" })
    const play = new IntersectionObserver(
      ([e]) => {
        visible.current = e.intersectionRatio >= 0.35
        if (reduce) return
        if (visible.current) v.play().catch(() => {})
        else v.pause()
      },
      { threshold: [0, 0.35] },
    )
    load.observe(v)
    play.observe(v)
    return () => {
      load.disconnect()
      play.disconnect()
    }
  }, [reduce])

  // Źródło pojawia się po wejściu w pobliże widoku: wtedy ruszamy, jeśli film już jest widoczny.
  useEffect(() => {
    if (near && visible.current && !reduce) ref.current?.play().catch(() => {})
  }, [near, reduce])

  return (
    <video
      ref={ref}
      className={className}
      src={near ? src : undefined}
      poster={near ? poster : undefined}
      muted
      loop
      playsInline
      preload="none"
      controls={controls || !!reduce}
      aria-label={label}
    />
  )
}
