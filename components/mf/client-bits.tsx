"use client"

import { ArrowDown } from "lucide-react"
import type { MfProductId } from "@/lib/mf/config"

export function BuyButton({ product = "paczka", children, variant = "primary" }: { product?: MfProductId; children: React.ReactNode; variant?: "primary" | "secondary" }) {
  return (
    <a
      href="#zamowienie"
      onClick={() => window.dispatchEvent(new CustomEvent("mf:pick", { detail: product }))}
      className={`inline-flex min-h-14 items-center justify-center gap-3 rounded-full px-7 text-[17px] font-bold transition-transform active:scale-[0.98] ${
        variant === "primary" ? "bg-[var(--h-accent)] text-[#111111]" : "bg-[var(--h-surface)] text-[var(--h-ink)] hover:bg-[var(--h-surface-hover)]"
      }`}
    >
      {children}
      <ArrowDown className="size-5" />
    </a>
  )
}
