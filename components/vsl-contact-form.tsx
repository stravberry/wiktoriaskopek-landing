"use client"

import { useState, useRef, useEffect } from "react"
import { ArrowRight, Send, CheckCircle2 } from "lucide-react"

export default function VslContactForm() {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true)
      },
      { threshold: 0.1 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    setIsSubmitting(false)
    setIsSubmitted(true)
  }

  return (
    <section 
      ref={sectionRef}
      id="qualification" 
      className="relative py-20 md:py-32 bg-[#050505] overflow-hidden"
      aria-labelledby="form-title"
    >
      {/* Background Decorative Text */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 font-display text-[22vw] text-white/[0.015] pointer-events-none select-none leading-none pt-10" aria-hidden="true">
        QUALIFY
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 md:px-8">
        
        <div 
          className="text-center mb-16 md:mb-20 transition-all duration-1000"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateY(0)" : "translateY(30px)",
          }}
        >
          <h2 id="form-title" className="font-display text-[clamp(2rem,7vw,4.5rem)] leading-[0.85] text-white tracking-tighter mb-8 uppercase px-4 md:px-0">
            Wypełnij formularz i&nbsp;<br className="hidden md:block" />
            <span
              style={{
                background: "linear-gradient(135deg, #ff6600, #ff8533)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              zacznijmy współpracę!
            </span>
          </h2>
          <p className="font-sans text-white/60 text-sm md:text-xl max-w-2xl mx-auto leading-relaxed">
            Wypełnij poniższe pola, abyśmy mogli przygotować się do rozmowy i&nbsp;sprawdzić, czy proces wideo-marketingowy jest dla Ciebie odpowiedni.
          </p>
        </div>

        {isSubmitted ? (
          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-10 md:p-20 text-center animate-in fade-in zoom-in duration-700">
            <div className="w-20 h-20 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-8">
              <CheckCircle2 className="w-10 h-10 text-accent" />
            </div>
            <h3 className="font-display text-3xl md:text-5xl text-white mb-4 uppercase tracking-wider">Dziękuję!</h3>
            <p className="font-sans text-white/60 text-lg mb-10">Twoje zgłoszenie zostało przyjęte. Skontaktuję się z Tobą w ciągu 24h.</p>
            <button 
              onClick={() => setIsSubmitted(false)}
              className="text-accent font-display text-sm tracking-widest uppercase hover:underline underline-offset-8"
            >
              Wyślij kolejne zgłoszenie
            </button>
          </div>
        ) : (
          <form 
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 transition-all duration-1000 delay-300"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? "translateY(0)" : "translateY(40px)",
            }}
          >
            {/* Name Field */}
            <div className="space-y-3">
              <label htmlFor="name" className="font-display text-[10px] md:text-xs text-white/40 tracking-[.3em] uppercase ml-1">Twoje Imię i Nazwisko</label>
              <input
                required
                type="text"
                id="name"
                name="name"
                placeholder="Jan Kowalski"
                className="w-full bg-white/[0.03] border border-white/10 rounded-none px-6 py-4 md:py-5 text-white font-sans text-sm md:text-base focus:outline-none focus:border-accent/50 focus:bg-white/[0.05] transition-all"
              />
            </div>

            {/* Social Field */}
            <div className="space-y-3">
              <label htmlFor="social" className="font-display text-[10px] md:text-xs text-white/40 tracking-[.3em] uppercase ml-1">Instagram / LinkedIn / Strona WWW</label>
              <input
                required
                type="text"
                id="social"
                name="social"
                placeholder="@twojprofil"
                className="w-full bg-white/[0.03] border border-white/10 rounded-none px-6 py-4 md:py-5 text-white font-sans text-sm md:text-base focus:outline-none focus:border-accent/50 focus:bg-white/[0.05] transition-all"
              />
            </div>

            {/* Revenue Field */}
            <div className="space-y-3">
              <label htmlFor="revenue" className="font-display text-[10px] md:text-xs text-white/40 tracking-[.3em] uppercase ml-1">Obecne Przychody Miesięczne</label>
              <select
                required
                id="revenue"
                name="revenue"
                className="w-full bg-white/[0.03] border border-white/10 rounded-none px-6 py-4 md:py-5 text-white/70 font-sans text-sm md:text-base focus:outline-none focus:border-accent/50 focus:bg-white/[0.05] transition-all appearance-none cursor-pointer"
              >
                <option value="" className="bg-black">Wybierz zakres...</option>
                <option value="0-10k" className="bg-black">0 - 10 000 zł</option>
                <option value="10-30k" className="bg-black">10 000 - 30 000 zł</option>
                <option value="30-100k" className="bg-black">30 000 - 100 000 zł</option>
                <option value="100k+" className="bg-black">Powyżej 100 000 zł</option>
              </select>
            </div>

            {/* Phone Field */}
            <div className="space-y-3">
              <label htmlFor="phone" className="font-display text-[10px] md:text-xs text-white/40 tracking-[.3em] uppercase ml-1">Numer Telefonu</label>
              <input
                required
                type="tel"
                id="phone"
                name="phone"
                placeholder="+48 000 000 000"
                className="w-full bg-white/[0.03] border border-white/10 rounded-none px-6 py-4 md:py-5 text-white font-sans text-sm md:text-base focus:outline-none focus:border-accent/50 focus:bg-white/[0.05] transition-all"
              />
            </div>

            {/* Message/Goal Field */}
            <div className="md:col-span-2 space-y-3">
              <label htmlFor="challenge" className="font-display text-[10px] md:text-xs text-white/40 tracking-[.3em] uppercase ml-1">Co jest Twoim największym wyzwaniem w marketingu?</label>
              <textarea
                required
                id="challenge"
                name="challenge"
                rows={4}
                placeholder="Np. brak czasu na nagrywanie, niska konwersja z reklam, brak strategii..."
                className="w-full bg-white/[0.03] border border-white/10 rounded-none px-6 py-4 md:py-5 text-white font-sans text-sm md:text-base focus:outline-none focus:border-accent/50 focus:bg-white/[0.05] transition-all resize-none"
              />
            </div>

            {/* Submit Button */}
            <div className="md:col-span-2 pt-6">
              <button
                disabled={isSubmitting}
                type="submit"
                className="group relative w-full flex items-center justify-center gap-4 px-10 py-5 md:py-7 rounded-full font-sans text-xs md:text-sm tracking-[.3em] uppercase text-black font-black overflow-hidden transition-all duration-500 hover:scale-[1.02] hover:shadow-[0_0_80px_rgba(255,102,0,0.4)] disabled:opacity-50"
                style={{
                  background: "linear-gradient(135deg, #ff6600, #ff8533)",
                }}
              >
                <span className="absolute inset-x-0 bottom-0 h-1/2 bg-white/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden="true" />
                <span className="relative z-10 flex items-center gap-3">
                  {isSubmitting ? "Wysyłanie..." : "Wyślij Zgłoszenie Kwalifikacyjne"}
                  {!isSubmitting && <Send className="w-4 h-4 md:w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" aria-hidden="true" />}
                </span>
              </button>
              <p className="mt-6 text-center text-white/30 font-sans text-[10px] uppercase tracking-widest">
                Gwarantujemy 100% poufności Twoich danych.
              </p>
            </div>
            
            {/* Honeypot for security */}
            <input type="text" name="_honey" style={{ display: "none" }} aria-hidden="true" />
          </form>
        )}
      </div>

      {/* Decorative Orbs */}
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-accent/10 blur-[150px] rounded-full pointer-events-none" aria-hidden="true" />
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-accent/5 blur-[150px] rounded-full pointer-events-none" aria-hidden="true" />
    </section>
  )
}
