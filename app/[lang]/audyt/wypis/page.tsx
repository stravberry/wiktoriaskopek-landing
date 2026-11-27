import type { Metadata } from "next"
import { NotePage, primaryBtn } from "@/components/audyt/note-page"

export const metadata: Metadata = { title: "Wypisz się z porad | Wiktoria Skopek", robots: { index: false, follow: false } }

export default async function Wypis({ searchParams }: { searchParams: Promise<{ t?: string }> }) {
  const t = String((await searchParams).t ?? "").slice(0, 100)
  return (
    <NotePage title="Wypisać Cię z porad?">
      <p>Nie dostaniesz już maili z poradami. Audyt, który już przyszedł, zostaje w Twojej skrzynce.</p>
      <form method="post" action="/api/audyt/wypis" className="mt-2">
        <input type="hidden" name="t" value={t} />
        <button className={primaryBtn}>Tak, wypisz mnie</button>
      </form>
    </NotePage>
  )
}
