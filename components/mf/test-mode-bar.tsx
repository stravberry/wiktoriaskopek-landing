import { shopTestLocked } from "@/lib/mf/core"

// Pasek trybu testowego: widoczny zawsze, gdy sklep używa testowego klucza Stripe (także na produkcji).
export const isStripeTestMode = () => (process.env.STRIPE_SECRET_KEY ?? "").startsWith("sk_test_")

export default function TestModeBar() {
  if (!isStripeTestMode()) return null
  // Na produkcji bez numeru karty testowej: produkt dostają tylko testerzy (przegląd bezpieczeństwa 26.11, S2).
  const text = shopTestLocked(process.env)
    ? "Sklep w trybie testowym: zakup wkrótce. Zapisz się, a damy znać, gdy sprzedaż ruszy."
    : "TRYB TESTOWY: płatności nie są prawdziwe. Do testu użyj karty 4242 4242 4242 4242."
  return (
    <div role="note" className="bg-[#1d1d1f] px-5 py-3 text-center text-[15px] font-semibold text-white">
      {text}
    </div>
  )
}
