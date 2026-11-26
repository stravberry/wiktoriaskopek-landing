"use client"

import Image from "next/image"
import { useRef } from "react"
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion"
import { LazyVideo } from "@/components/mf/lazy-video"
import type { MfClip } from "@/lib/mf/content"

// Oszczędne 3D (00-PLAN 0f, pkt 6): tylko CSS transform sterowany przewijaniem (framer-motion, już w paczce),
// bez bibliotek 3D. Przy „ogranicz ruch” elementy stoją płasko; wideo ładuje się leniwie, poster widać od razu.

/** Telefon z rolką: obraca się w osi Y, gdy przewijasz przez sekcję. */
export function PhoneSpin({ src, poster, label }: { src: string; poster: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] })
  const rotateY = useTransform(scrollYProgress, [0, 0.5, 1], [-28, 0, 22])
  const rotateX = useTransform(scrollYProgress, [0, 0.5, 1], [8, 0, -6])
  const y = useTransform(scrollYProgress, [0, 1], [40, -40])
  return (
    <div ref={ref} className="mx-auto w-[min(72vw,320px)] [perspective:1400px]">
      <motion.div
        style={reduce ? undefined : { rotateY, rotateX, y }}
        className="relative rounded-[46px] bg-[var(--mf-device)] p-[10px] shadow-[0_50px_90px_-40px_rgba(0,0,0,0.55)] [transform-style:preserve-3d]"
      >
        <LazyVideo className="aspect-[9/16] w-full rounded-[36px] bg-[#1d1d1f] object-cover" src={src} poster={poster} label={label} />
      </motion.div>
    </div>
  )
}

/** Duży zrzut panelu: wjeżdża pochylony w przestrzeni i prostuje się, gdy dochodzi do środka ekranu. */
export function PanelTilt({ src, alt }: { src: string; alt: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "center center"] })
  const rotateX = useTransform(scrollYProgress, [0, 1], [26, 0])
  const scale = useTransform(scrollYProgress, [0, 1], [0.86, 1])
  const opacity = useTransform(scrollYProgress, [0, 0.4], [0.4, 1])
  return (
    <div ref={ref} className="[perspective:1600px]">
      <motion.div style={reduce ? undefined : { rotateX, scale, opacity }} className="origin-bottom overflow-hidden rounded-[22px] shadow-[0_40px_80px_-40px_rgba(0,0,0,0.6)] ring-1 ring-white/10">
        <Image src={src} alt={alt} width={1440} height={900} sizes="(min-width: 1240px) 1160px, 92vw" className="w-full" />
      </motion.div>
    </div>
  )
}

/** Warstwy rolki rozkładane w przestrzeni: kadr, napisy, marka (3 obrazy z przezroczystością od Coding Buildera). */
export function LayerStack({ layers, label }: { layers: { src: string; alt: string }[]; label: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "center center"] })
  const spread = useTransform(scrollYProgress, [0, 1], [0, 1])
  const z = [useTransform(spread, (v) => v * -120), useTransform(spread, (v) => v * 0), useTransform(spread, (v) => v * 120)]
  const tilt = useTransform(spread, (v) => v * -32)
  return (
    <div ref={ref} className="mx-auto w-[min(64vw,300px)] [perspective:1200px]" role="img" aria-label={label}>
      <motion.div style={reduce ? undefined : { rotateY: tilt, rotateX: 10 }} className="relative aspect-[9/16] [transform-style:preserve-3d]">
        {layers.map((l, i) => (
          <motion.div key={l.src} style={reduce ? undefined : { translateZ: z[i] }} className="absolute inset-0 overflow-hidden rounded-[28px] ring-1 ring-white/15">
            <Image src={l.src} alt="" fill sizes="300px" className="object-cover" />
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}

/** Nagranie panelu: 4:5 na telefonie, 16:9 od tabletu. Ukryte wideo się nie ładuje (LazyVideo patrzy na widoczność). */
export function PanelClip({ clip, className = "", fit = "contain" }: { clip: MfClip; className?: string; fit?: "contain" | "cover" }) {
  const v = `size-full ${fit === "cover" ? "object-cover" : "object-contain"}`
  return (
    <div className={`relative overflow-hidden bg-[#f5f5f7] ${className}`}>
      <LazyVideo className={`${v} sm:hidden`} src={`/mf/apple/${clip.name}-4x5.mp4`} poster={`/mf/apple/${clip.name}-4x5.jpg`} label={clip.label} />
      <LazyVideo className={`${v} hidden sm:block`} src={`/mf/apple/${clip.name}-16x9.mp4`} poster={`/mf/apple/${clip.name}-16x9.jpg`} label={clip.label} />
    </div>
  )
}
