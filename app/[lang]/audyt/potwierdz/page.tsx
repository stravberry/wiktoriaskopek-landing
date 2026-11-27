import type { Metadata } from "next"
import { NotePage, primaryBtn } from "@/components/audyt/note-page"

export const metadata: Metadata = { title: "Potwierdź adres | Darmowy audyt Instagrama", robots: { index: false, follow: false } }

// Link z maila prowadzi tutaj. Zgłoszenie potwierdza dopiero kliknięcie (POST), bo skanery poczty same otwierają linki.
export default async function Potwierdz({ searchParams }: { searchParams: Promise<{ t?: string }> }) {
  const t = String((await searchParams).t ?? "").slice(0, 100)
  return (
    <NotePage title="Potwierdź adres, a zaczniemy audyt">
      <p>Jedno kliknięcie i bierzemy się za Twój profil. Pierwsze audyty czyta osobiście Wiktoria, więc wynik przyjdzie mailem zwykle w ciągu 2 dni roboczych.</p>
      <form method="post" action="/api/audyt/potwierdz" className="mt-2">
        <input type="hidden" name="t" value={t} />
        <button className={primaryBtn}>Potwierdzam adres</button>
      </form>
    </NotePage>
  )
}
