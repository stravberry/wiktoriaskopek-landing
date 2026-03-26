"use client"

import { useEffect, useRef } from "react"
import { usePathname } from "next/navigation"

export default function ScrollToTop() {
  const pathname = usePathname()
  const previousPathname = useRef(pathname)
  const isFirstRender = useRef(true)

  useEffect(() => {
    // Skip first render to avoid flash
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }

    if (previousPathname.current !== pathname) {
      // Small delay to let the DOM update, then scroll
      requestAnimationFrame(() => {
        window.scrollTo({ top: 0, left: 0, behavior: "instant" })
      })
      previousPathname.current = pathname
    }
  }, [pathname])

  return null
}
