"use client"

import { useRef, useEffect, useState, useCallback } from "react"
import { type Locale, getTranslation } from "@/lib/translations"

export default function ElevatorSection({ lang = "pl" }: { lang?: Locale }) {
  const t = getTranslation(lang)

  const floors = [
    {
      number: "01",
      title: t.elevator.floor1.title,
      subtitle: t.elevator.floor1.subtitle,
      description: t.elevator.floor1.description,
      image: "/images/img-0314.jpeg",
    },
    {
      number: "02",
      title: t.elevator.floor2.title,
      subtitle: t.elevator.floor2.subtitle,
      description: t.elevator.floor2.description,
      image: "/images/img-1217.jpeg",
    },
    {
      number: "03",
      title: t.elevator.floor3.title,
      subtitle: t.elevator.floor3.subtitle,
      description: t.elevator.floor3.description,
      image: "/images/gkip-foto-radomsko-2k24-164.jpeg",
    },
  ]

  const filmFrames = [
    { type: "deco", content: "◇" },
    { type: "deco", content: "○" },
    { type: "number", content: "1", floor: 0 },
    { type: "number", content: "2", floor: 1 },
    { type: "number", content: "3", floor: 2 },
    { type: "deco", content: "○" },
    { type: "deco", content: "◇" },
  ]

  const sectionRef = useRef<HTMLDivElement>(null)
  const [currentFloor, setCurrentFloor] = useState(0)
  const [stripOffset, setStripOffset] = useState(0)
  const [isMobileOrTablet, setIsMobileOrTablet] = useState(false)
  const [progress, setProgress] = useState(0)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    const checkDevice = () => setIsMobileOrTablet(window.innerWidth < 1024)
    checkDevice()
    window.addEventListener("resize", checkDevice, { passive: true })
    return () => window.removeEventListener("resize", checkDevice)
  }, [])

  const handleScroll = useCallback(() => {
    if (rafRef.current || isMobileOrTablet) return

    rafRef.current = requestAnimationFrame(() => {
      if (!sectionRef.current) {
        rafRef.current = null
        return
      }

      const rect = sectionRef.current.getBoundingClientRect()
      const sectionHeight = rect.height
      const viewportHeight = window.innerHeight
      const scrolled = -rect.top

      const totalScroll = sectionHeight - viewportHeight
      const rawProgress = Math.max(0, Math.min(1, scrolled / totalScroll))

      const floorCount = floors.length
      const floorIndex = Math.min(Math.floor(rawProgress * floorCount), floorCount - 1)

      setCurrentFloor(floorIndex)
      setProgress(rawProgress)
      setStripOffset(rawProgress * 320 * (floorCount - 1))

      rafRef.current = null
    })
  }, [isMobileOrTablet, floors.length])

  useEffect(() => {
    if (!isMobileOrTablet) {
      window.addEventListener("scroll", handleScroll, { passive: true })
      handleScroll()
    }
    return () => {
      window.removeEventListener("scroll", handleScroll)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [handleScroll, isMobileOrTablet])

  const frameHeight = 320
  const initialOffset = 2 * frameHeight + frameHeight / 2

  if (isMobileOrTablet) {
    return (
      <section className="relative bg-black" id="kreator">
        {/* Section header */}
        <div className="px-6 pt-16 pb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-[1px] w-12 bg-accent" />
            <span className="text-accent font-mono text-[10px] tracking-[0.4em] uppercase">
              {t.elevator.sectionLabel}
            </span>
          </div>
          <h2 className="font-display text-4xl md:text-5xl text-white tracking-tight">O mnie</h2>
        </div>

        {/* Floors */}
        <div className="flex flex-col">
          {floors.map((floor, i) => (
            <div key={floor.number} className="relative min-h-[70vh] flex items-center">
              {/* Background image */}
              <div className="absolute inset-0 overflow-hidden">
                <img
                  src={floor.image || "/placeholder.svg"}
                  alt={floor.title}
                  className="w-full h-full object-cover opacity-40"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/60" />
              </div>

              {/* Content */}
              <div className="relative z-10 px-6 py-12 w-full">
                {/* Large floor number */}
                <div className="absolute top-8 right-6 font-display text-[120px] md:text-[180px] leading-none text-white/5 select-none pointer-events-none">
                  {floor.number}
                </div>

                {/* Floor info */}
                <div className="relative">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="font-mono text-accent text-sm tracking-wider">{floor.number}</span>
                    <div className="h-[1px] flex-1 max-w-[60px] bg-accent/40" />
                  </div>

                  <h3 className="font-display text-4xl md:text-5xl text-white leading-[0.95] tracking-tight mb-4">
                    {floor.title}
                  </h3>

                  <p className="font-serif italic text-white/70 text-xl md:text-2xl mb-6 leading-snug max-w-md">
                    {floor.subtitle}
                  </p>

                  <p className="text-white/50 font-mono text-xs md:text-sm leading-relaxed max-w-sm">
                    {floor.description}
                  </p>
                </div>

                {/* Progress dots */}
                <div className="flex items-center gap-3 mt-8">
                  {floors.map((_, j) => (
                    <div
                      key={j}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        i === j ? "bg-accent w-6" : "bg-white/20"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    )
  }

  return (
    <section ref={sectionRef} className="relative h-[400vh] bg-black" id="kreator">
      <div className="sticky top-0 h-screen overflow-hidden">
        {floors.map((floor, i) => (
          <div
            key={floor.number}
            className="absolute inset-0"
            style={{
              opacity: currentFloor === i ? 0.4 : 0,
              transition: "opacity 0.4s ease-out",
            }}
          >
            <img
              src={floor.image || "/placeholder.svg"}
              alt={floor.title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/85 to-black/60" />
          </div>
        ))}

        {/* Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,102,0,.02)_1px,transparent_1px),linear-gradient(rgba(255,102,0,.02)_1px,transparent_1px)] bg-[size:80px_80px]" />

        {/* Film strip - desktop only */}
        <div className="absolute z-20" style={{ left: "5%", top: "0", height: "100%" }}>
          <div
            className="relative flex"
            style={{
              transform: `translateY(calc(50vh - ${initialOffset}px - ${stripOffset}px))`,
              transition: "transform 0.2s ease-out",
            }}
          >
            <div className="flex flex-col items-center mr-4">
              {filmFrames.map((_, i) => (
                <div key={`left-perf-${i}`} className="flex flex-col items-center" style={{ height: "320px" }}>
                  <div className="w-4 h-6 bg-black border border-white/30 rounded-sm mb-4" />
                  <div className="flex-1" />
                  <div className="w-4 h-6 bg-black border border-white/30 rounded-sm mt-4" />
                </div>
              ))}
            </div>

            <div className="flex flex-col">
              {filmFrames.map((frame, i) => {
                const isActive = frame.type === "number" && frame.floor === currentFloor
                const isNumber = frame.type === "number"

                return (
                  <div
                    key={i}
                    className="relative flex items-center justify-center"
                    style={{ width: "clamp(200px, 40vw, 350px)", height: "320px" }}
                  >
                    {isActive && (
                      <div
                        className="absolute inset-0 pointer-events-none"
                        style={{
                          boxShadow: "0 0 80px 15px rgba(255,255,255,0.25), 0 0 150px 40px rgba(255,248,230,0.12)",
                        }}
                      />
                    )}

                    <div
                      className="absolute inset-3 border-2 rounded-sm transition-all duration-300"
                      style={{
                        borderColor: isActive ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.15)",
                        background: isActive ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.4)",
                      }}
                    />

                    <span
                      className="font-display leading-none select-none transition-all duration-300 relative z-10"
                      style={{
                        fontSize: isNumber ? "clamp(120px, 25vw, 220px)" : "clamp(35px, 9vw, 60px)",
                        color: isActive ? "#ffffff" : isNumber ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.06)",
                        textShadow: isActive
                          ? "0 0 40px rgba(255,255,255,0.8), 0 0 80px rgba(255,248,230,0.5)"
                          : "none",
                      }}
                    >
                      {frame.content}
                    </span>
                  </div>
                )
              })}
            </div>

            <div className="flex flex-col items-center ml-4">
              {filmFrames.map((_, i) => (
                <div key={`right-perf-${i}`} className="flex flex-col items-center" style={{ height: "320px" }}>
                  <div className="w-4 h-6 bg-black border border-white/30 rounded-sm mb-4" />
                  <div className="flex-1" />
                  <div className="w-4 h-6 bg-black border border-white/30 rounded-sm mt-4" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="absolute right-0 top-0 bottom-0 w-[45%] xl:w-[35%] flex flex-col justify-center px-12 xl:px-16">
          {floors.map((floor, i) => {
            const isActive = currentFloor === i

            return (
              <div
                key={floor.number}
                className="absolute inset-0 flex flex-col justify-center px-12 xl:px-16"
                style={{
                  opacity: isActive ? 1 : 0,
                  transform: `translateX(${isActive ? 0 : 20}px)`,
                  transition: "opacity 0.3s ease-out, transform 0.3s ease-out",
                  pointerEvents: isActive ? "auto" : "none",
                }}
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="h-[1px] w-10 bg-accent" />
                  <span className="text-accent font-mono text-[10px] tracking-[0.4em] uppercase">
                    {t.elevator.sectionLabel}
                  </span>
                </div>

                <h2 className="font-display text-[7vw] xl:text-[5vw] text-white leading-[0.85] tracking-tight mb-4">
                  {floor.title}
                </h2>

                <p className="font-serif italic text-white/60 text-2xl xl:text-3xl mb-6 leading-tight">
                  {floor.subtitle}
                </p>

                <p className="text-white/50 font-mono text-sm leading-relaxed max-w-sm">{floor.description}</p>

                <div className="mt-8 flex flex-col gap-3">
                  <div className="relative h-[2px] w-48 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="absolute left-0 top-0 h-full bg-accent rounded-full"
                      style={{
                        width: `${progress * 100}%`,
                        transition: "width 0.1s ease-out",
                      }}
                    />
                  </div>

                  <div className="flex items-center gap-6">
                    {floors.map((f, j) => (
                      <span
                        key={j}
                        className="font-mono text-sm transition-all duration-200"
                        style={{
                          color:
                            currentFloor === j
                              ? "#ff6600"
                              : currentFloor > j
                                ? "rgba(255,255,255,0.6)"
                                : "rgba(255,255,255,0.2)",
                          fontWeight: currentFloor === j ? "600" : "400",
                        }}
                      >
                        {f.number}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
