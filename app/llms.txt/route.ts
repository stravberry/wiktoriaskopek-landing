import { MF_BASE_PATH, MF_PRODUCTS, SELLER } from "@/lib/mf/config"
import { stylesLabel } from "@/lib/mf/content"

// /llms.txt: krótki opis strony dla asystentów AI (wcześniej ten adres wpadał w trasę [lang] i dawał pustą stronę HTML).
export const dynamic = "force-static"

export function GET() {
  const base = "https://www.wiktoriaskopek.pl"
  const text = `# Wiktoria Skopek

> Marketing, produkcja wideo i studio podcastowe w Katowicach. Program MontageFrames do montażu rolek i filmów w Claude Code.

## MontageFrames
- Strona: ${base}${MF_BASE_PATH}
- Co to jest: program do montażu rolek i filmów w Claude Code (napisy, animacje, cięcia, kolory marki), ${stylesLabel()} napisów, kreator marki, krytyk jakości i panel w przeglądarce.
- Ceny (jednorazowo): ${MF_PRODUCTS.paczka.name}: ${MF_PRODUCTS.paczka.priceLabel}; ${MF_PRODUCTS.konsultacja.name}: ${MF_PRODUCTS.konsultacja.priceLabel}.
- Darmowa próba na własnym nagraniu: ${base}${MF_BASE_PATH}/proba
- Wymagania: płatny plan Claude Pro lub Max, macOS 14+ (pełne funkcje), Windows 10/11 lub Linux.
- Regulamin: ${base}${MF_BASE_PATH}/regulamin
- Sprzedawca: ${SELLER.name}, ${SELLER.email}

## Strona główna
- ${base}/pl (PL), ${base}/en (EN)
- Konsultacje: ${base}/konsultacje
- Polityka prywatności: ${base}/polityka-prywatnosci
`
  return new Response(text, { headers: { "Content-Type": "text/plain; charset=utf-8" } })
}
