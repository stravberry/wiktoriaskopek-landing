"use client"

import { useEffect } from "react"
import { motion } from "framer-motion"

export default function VslBookingCalendar() {
  useEffect(() => {
    (function (C, A, L) {
      let p = function (a: any, ar: any) {
        a.q.push(ar)
      }
      let d = C.document
      // @ts-ignore
      C.Cal = C.Cal || function () {
        // @ts-ignore
        let cal = C.Cal
        let ar = arguments
        if (!cal.loaded) {
          cal.ns = {}
          cal.q = cal.q || []
          d.head.appendChild(d.createElement("script")).src = A
          cal.loaded = true
        }
        if (ar[0] === L) {
          const api = function () {
            // @ts-ignore
            p(api, arguments)
          }
          const namespace = ar[1]
          // @ts-ignore
          api.q = api.q || []
          if (typeof namespace === "string") {
            // @ts-ignore
            cal.ns[namespace] = cal.ns[namespace] || api
            // @ts-ignore
            p(cal.ns[namespace], ar)
            // @ts-ignore
            p(cal, ["initNamespace", namespace])
          } else p(cal, ar)
          return
        }
        p(cal, ar)
      }
      // @ts-ignore
    })(window, "https://app.cal.com/embed/embed.js", "init")

    // @ts-ignore
    window.Cal("init", "30min", { origin: "https://app.cal.com" })

    // @ts-ignore
    window.Cal.ns["30min"]("inline", {
      elementOrSelector: "#my-cal-inline-30min",
      config: { "layout": "month_view", "useSlotsViewOnSmallScreen": "true", "theme": "dark" },
      calLink: "wiktoriaskopek/30min",
    })

    // @ts-ignore
    window.Cal.ns["30min"]("ui", { "hideEventTypeDetails": false, "layout": "month_view", "theme": "dark" })
  }, [])

  return (
    <section 
      id="booking"
      className="relative py-12 md:py-20 bg-[#050505] overflow-hidden"
      aria-labelledby="booking-title"
    >
      <div className="relative z-10 max-w-5xl mx-auto px-4 md:px-8">
        
        {/* Section Heading */}
        <motion.div 
           className="text-center mb-12 md:mb-16"
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           transition={{ duration: 0.8 }}
        >
          <span className="font-sans text-accent text-xs md:text-sm tracking-[.3em] uppercase inline-block mb-4 md:mb-6 opacity-80 font-bold">
             Dostępność
          </span>
          <h2 id="booking-title" className="font-display text-[clamp(1.8rem,6vw,3.5rem)] leading-none text-white tracking-tighter uppercase">
            UMÓW SIĘ NA <br className="md:hidden" />
            <span
              style={{
                background: "linear-gradient(135deg, #ff6600, #ff8533)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              ROZMOWĘ
            </span>
          </h2>
        </motion.div>

        {/* Cal.com Embed Container - Removed background/border to let Cal.com integrate with page */}
        <motion.div 
          className="relative overflow-hidden"
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
           <div 
             id="my-cal-inline-30min" 
             className="w-full min-h-[600px] md:min-h-[700px] bg-transparent"
           />
        </motion.div>

        {/* Support Text */}
        <div className="mt-8 text-center text-white/40 font-sans text-xs md:text-sm tracking-wide uppercase">
          Bezpośrednie połączenie z kalendarzem
        </div>
      </div>
    </section>
  )
}
