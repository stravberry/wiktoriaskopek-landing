"use client"

import type React from "react"
import { useRef } from "react"
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion"

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
  const x = useSpring(scrollYProgress, { stiffness: 160, damping: 32 })
  if (reduce) return null
  return <motion.div aria-hidden style={{ scaleX: x }} className="fixed inset-x-0 top-0 z-[80] h-[3px] origin-left bg-[var(--h-accent)]" />
}

/** Element powiększa się z 92% do 100%, gdy wjeżdża w widok (film promo). */
export function ScrollScale({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "center center"] })
  const scale = useTransform(scrollYProgress, [0, 1], [0.92, 1])
  return <motion.div ref={ref} style={reduce ? undefined : { scale }} className={className}>{children}</motion.div>
}
