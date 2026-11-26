"use client"

import type React from "react"
import { motion, useReducedMotion } from "framer-motion"

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
