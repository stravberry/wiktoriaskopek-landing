// Fragment interfejsu: tak wygląda praca z paczką w Claude Code (komendy z paczki, odpowiedzi skrócone).
// Ilustracja przebiegu, nie zrzut ekranu; prawdziwe zrzuty: DO UZUPEŁNIENIA.
const LINES: { who: "ty" | "claude"; text: string }[] = [
  { who: "ty", text: "/start" },
  { who: "claude", text: "Sprawdzam komputer. Brakuje narzędzi do montażu i transkrypcji. Zainstalować je teraz?" },
  { who: "ty", text: "tak" },
  { who: "ty", text: "/marka" },
  { who: "claude", text: "Podaj kolory firmy, logo i 3–5 zdjęć. Na koniec zrobię próbną rolkę." },
  { who: "ty", text: "/styl dynamiczny zakreślacz" },
  { who: "ty", text: "/rolka ~/Desktop/nagranie.mov" },
  { who: "claude", text: "Gotowe. Krytyk jakości: kadr stabilny, napisy w strefie bezpiecznej, głośność równa. Otworzyć podgląd?" },
  { who: "ty", text: "w 0:12 przesuń napis niżej i podświetl słowo „promocja”" },
]

export default function ClaudeTranscript() {
  return (
    <figure data-ui className="overflow-hidden rounded-[24px] bg-[#1d1d1f] text-[15px] leading-[1.55] text-[#f5f5f7]">
      <div className="flex items-center gap-2 bg-[#2c2c2e] px-5 py-3 text-[15px] text-[#a1a1a6]">
        <span className="size-3 rounded-full bg-[#ff5f57]" />
        <span className="size-3 rounded-full bg-[#febc2e]" />
        <span className="size-3 rounded-full bg-[#28c840]" />
        <span className="ml-3">claude · MontageFrames</span>
      </div>
      <ol className="flex flex-col gap-3 p-5 md:p-6">
        {LINES.map((l, i) => (
          <li key={i} className={l.who === "ty" ? "text-white" : "text-[#c7c7cc]"}>
            <span className={l.who === "ty" ? "mr-2 font-bold text-[#ff7a2e]" : "mr-2 font-bold text-[#8e8e93]"}>{l.who === "ty" ? ">" : "●"}</span>
            {l.text}
          </li>
        ))}
      </ol>
      <figcaption className="px-6 pb-5 text-[15px] text-[#8e8e93]">Ilustracja rozmowy z komendami z paczki.</figcaption>
    </figure>
  )
}
