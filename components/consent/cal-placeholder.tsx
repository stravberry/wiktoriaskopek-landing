"use client"

import { useConsent } from "./consent-provider"

/** Zastępuje ramkę Cal.com, dopóki nie ma zgody „Treści zewnętrzne”. Kliknięcie = zgoda tylko na tę kategorię. */
export default function CalPlaceholder({ dark = false }: { dark?: boolean }) {
  const { grant } = useConsent()
  return (
    <div className={`grid min-h-[320px] place-items-center rounded-[28px] p-8 text-center ${dark ? "bg-white/5 text-white" : "bg-[var(--h-surface)]"}`}>
      <div className="max-w-[46ch]">
        <p className="text-[21px] font-semibold">Kalendarz rezerwacji (Cal.com)</p>
        <p className={`mt-2 text-[15px] leading-[1.5] ${dark ? "text-white/60" : "text-[var(--h-ink-2)]"}`}>
          Kalendarz ładuje się z serwisu Cal.com, który może zapisywać własne pliki cookies. Pokażemy go dopiero po Twojej zgodzie.
        </p>
        <button
          type="button"
          onClick={() => grant("external")}
          className="mt-5 min-h-12 rounded-full bg-[#ff6a13] px-6 text-[17px] font-bold text-[#111111]"
        >
          Pokaż kalendarz
        </button>
      </div>
    </div>
  )
}
