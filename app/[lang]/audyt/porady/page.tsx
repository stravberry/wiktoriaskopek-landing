import type { Metadata } from "next"
import Link from "next/link"
import { NotePage, primaryBtn } from "@/components/audyt/note-page"
import { AUDYT_TEXT } from "@/lib/audyt/core"

export const metadata: Metadata = { title: "Porady o rolkach | Wiktoria Skopek", robots: { index: false, follow: false } }

export default async function Porady({ searchParams }: { searchParams: Promise<{ r?: string; x?: string; s?: string }> }) {
  const q = await searchParams
  const v = (k: "r" | "x" | "s") => String(q[k] ?? "").slice(0, 100)
  return (
    <NotePage title="Porady o rolkach dla Twojej firmy">
      <p>Jeden konkretny temat na mail: hak, tempo, napisy, reklamy Meta. Bez spamu, z linkiem do wypisania w każdej wiadomości.</p>
      <form method="post" action="/api/audyt/porady" className="mt-2 flex flex-col gap-4">
        <input type="hidden" name="r" value={v("r")} />
        <input type="hidden" name="x" value={v("x")} />
        <input type="hidden" name="s" value={v("s")} />
        <p className="text-[15px]">Klikając, wyrażasz zgodę: „{AUDYT_TEXT.newsletter}” Szczegóły w <Link className="underline" href="/polityka-prywatnosci#audyt">polityce prywatności</Link>.</p>
        <button className={primaryBtn}>Zapisuję się na porady</button>
      </form>
    </NotePage>
  )
}
