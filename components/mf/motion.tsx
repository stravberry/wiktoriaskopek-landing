"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion"

/** Wejście części sekcji: raz, przy wejściu w widok; treść widoczna też bez skryptu (SSR bez opacity 0 przy reduced motion). */
export function Reveal({ children, delay = 0, className = "", as = "div" }: { children: React.ReactNode; delay?: number; className?: string; as?: "div" | "li" }) {
  const reduce = useReducedMotion()
  const M = as === "li" ? motion.li : motion.div
  if (reduce) return as === "li" ? <li className={className}>{children}</li> : <div className={className}>{children}</div>
  return (
    <M
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -8% 0px" }}
      transition={{ duration: 0.55, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </M>
  )
}

/** Nagłówek sekcji odsłaniany maską od dołu (inne wejście niż treść sekcji). */
export function HeadingReveal({ id, className, children }: { id?: string; className: string; children: React.ReactNode }) {
  const reduce = useReducedMotion()
  if (reduce) return <h2 id={id} className={className}>{children}</h2>
  return (
    <motion.h2
      id={id}
      className={className}
      initial={{ clipPath: "inset(0 0 100% 0)", y: 28 }}
      whileInView={{ clipPath: "inset(0 0 0% 0)", y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.h2>
  )
}

/** Pasek postępu czytania u góry strony (przy „ogranicz ruch” ukryty). */
export function ScrollProgress() {
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll()
  const spring = useSpring(scrollYProgress, { stiffness: 160, damping: 32 })
  const x = reduce ? scrollYProgress : spring
  return (
    <>
      <motion.div aria-hidden style={{ scaleX: x }} className="fixed inset-x-0 top-0 z-[80] h-[3px] origin-left bg-[var(--h-accent)]" />
      <ScrollKitten progress={x} reduce={!!reduce} />
    </>
  )
}

/**
 * Kotek na czubku paska postępu (zlecenie Wiktorii 26.11): biegnie przy przewijaniu, liże łapkę po ~700 ms przerwy,
 * przy przewijaniu w górę odwraca się. Tylko transform (bez CLS), klatki w CSS steps(), JS zmienia stan tylko przy
 * zmianie biegu/postoju. Na samej górze ukryty, przy reduced-motion siedzi bez animacji. Dekoracja: aria-hidden.
 * Sprite'y: Higgsfield (GPT Image 2.6), obróbka w landing-assets/kotek/.
 */
function ScrollKitten({ progress, reduce }: { progress: ReturnType<typeof useSpring>; reduce: boolean }) {
  const [running, setRunning] = useState(false)
  const [up, setUp] = useState(false)
  const [visible, setVisible] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const lastY = useRef(0)
  // Szerokie „pudełko” na całą szerokość okna przesuwane tak, by kotek (po prawej) stał na czubku wypełnienia.
  const shift = useTransform(progress, (v) => `${(Math.min(Math.max(v, 0), 1) - 1) * 100}%`)
  useMotionValueEvent(progress, "change", (v) => {
    const show = v > 0.012
    setVisible((cur) => (cur === show ? cur : show))
  })
  useEffect(() => {
    lastY.current = window.scrollY
    const onScroll = () => {
      const y = window.scrollY
      if (y !== lastY.current) {
        const goingUp = y < lastY.current
        setUp((cur) => (cur === goingUp ? cur : goingUp))
        lastY.current = y
      }
      setRunning((cur) => cur || true)
      if (timer.current) clearTimeout(timer.current)
      timer.current = setTimeout(() => setRunning(false), 700)
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => {
      window.removeEventListener("scroll", onScroll)
      if (timer.current) clearTimeout(timer.current)
    }
  }, [])
  const anim = reduce ? "lize" : running ? "bieg" : "lize"
  return (
    <motion.div aria-hidden style={{ x: shift }} className="pointer-events-none fixed inset-x-0 top-[3px] z-[80]">
      <div
        className={`mf-kot ml-auto transition-opacity duration-300 motion-reduce:transition-none ${visible ? "opacity-100" : "opacity-0"} ${up && !reduce ? "-scale-x-100" : ""}`}
        data-anim={anim}
        data-still={reduce ? "1" : undefined}
      >
        <span />
      </div>
    </motion.div>
  )
}

/** Element powiększa się z 92% do 100%, gdy wjeżdża w widok (film promo). */
export function ScrollScale({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "center center"] })
  const scale = useTransform(scrollYProgress, [0, 1], [0.92, 1])
  return <motion.div ref={ref} style={reduce ? undefined : { scale }} className={className}>{children}</motion.div>
}
