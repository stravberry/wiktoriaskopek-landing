"use client"

import { motion } from "framer-motion"
import { useRef, ReactNode } from "react"

interface MotionViewportProps {
  children: ReactNode
  variant?: "fade-up" | "fade-down" | "fade-left" | "fade-right" | "fade-in" | "zoom-in" | "skew-in"
  delay?: number
  duration?: number
  className?: string
  once?: boolean
  staggerChildren?: number
}

export default function MotionViewport({
  children,
  variant = "fade-up",
  delay = 0,
  duration = 0.8,
  className = "",
  once = true,
  staggerChildren = 0,
}: MotionViewportProps) {
  const ref = useRef(null)

  const variants = {
    hidden: {
      opacity: 0,
      y: variant === "fade-up" ? 50 : variant === "fade-down" ? -50 : 0,
      x: variant === "fade-left" ? 50 : variant === "fade-right" ? -50 : 0,
      scale: variant === "zoom-in" ? 0.9 : 1,
      skewY: variant === "skew-in" ? 5 : 0,
    },
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
      scale: 1,
      skewY: 0,
      transition: {
        type: "spring",
        stiffness: 70,
        damping: 15,
        mass: 1,
        duration: duration,
        delay: delay,
        staggerChildren: staggerChildren,
      },
    },
  } as const

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: once, amount: 0.15, margin: "-50px" }}
      variants={variants}
      className={className}
    >
      {children}
    </motion.div>
  )
}
