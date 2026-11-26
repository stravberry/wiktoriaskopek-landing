// Drobna typografia: łącznik albo półpauza między znakami nie może łamać wiersza („15–30 min”, „43-180”, „Apache-2.0”).
// Po myślniku wstawiamy WORD JOINER (U+2060): niewidoczny, blokuje łamanie, nie zmienia kopiowanego tekstu w praktyce.
const WJ = "⁠"
export const nobr = (s: string) => s.replace(/(\S)([-–])(?=\S)/g, `$1$2${WJ}`)

/** „e-mail” bez łamania na łączniku (w tekście JSX: {EMAIL_WORD}). */
export const EMAIL_WORD = nobr("e-mail")
