import type { Metadata } from "next"
import Link from "next/link"
import { NotePage, secondaryLink } from "@/components/audyt/note-page"

export const metadata: Metadata = { title: "Darmowy audyt Instagrama | Wiktoria Skopek", robots: { index: false, follow: false } }

const MSG: Record<string, { title: string; text: string }> = {
  ok: { title: "Dziękujemy, audyt jest w drodze", text: "Liczymy wyniki Twojego profilu. Pierwsze audyty czyta osobiście Wiktoria, więc wynik dostaniesz mailem zwykle w ciągu 2 dni roboczych. Sprawdź też folder Oferty i Spam." },
  link: { title: "Ten link już nie działa", text: "Link wygasł albo został już użyty. Jeśli audyt nie przyszedł, wyślij formularz jeszcze raz ze strony głównej." },
  wylaczony: { title: "Darmowy audyt jest chwilowo wyłączony", text: "Nie przyjmujemy teraz nowych audytów i nie analizujemy zgłoszeń. Nie musisz nic robić. Jeśli chcesz porozmawiać o rolkach albo reklamach, umów rozmowę na stronie głównej." },
  limit: { title: "Za dużo prób naraz", text: "Odczekaj kilka minut i spróbuj ponownie." },
  porady: { title: "Zapisano na porady", text: "Najwyżej jeden mail w tygodniu, w każdym link do wypisania. Pierwsza porada przyjdzie w ciągu kilku dni." },
  wypis: { title: "Wypisano z porad", text: "Nie wyślemy Ci już porad. Jeśli zmienisz zdanie, zapiszesz się ponownie przy kolejnym audycie." },
}

export default async function Gotowe({ searchParams }: { searchParams: Promise<{ s?: string }> }) {
  const m = MSG[String((await searchParams).s ?? "ok")] ?? MSG.ok
  return (
    <NotePage title={m.title}>
      <p>{m.text}</p>
      <Link href="/" className={secondaryLink}>Wróć na stronę główną</Link>
    </NotePage>
  )
}
