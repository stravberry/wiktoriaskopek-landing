// Porady po audycie (Kierownik): dzień 2, 4, 7, 10, jeden temat na mail. TYLKO dla osób z potwierdzoną zgodą (double opt-in).
// Włączenie: AUDYT_SEQUENCE=1 w Vercel (domyślnie wyłączone, Wiktoria najpierw czyta treści: /admin/audyty).
import { Body, Button, Container, Head, Html, Link, Preview, Section, Text } from "@react-email/components"
import { createElement as h } from "react"
import { sql } from "@/lib/mf/db"
import { origin } from "@/lib/mf/server"
import { MF_BASE_PATH } from "@/lib/mf/config"
import { sendAudytMail, unsubUrl } from "./server"

type Step = { day: number; subject: string; body: string[]; cta?: { label: string; path: string }; only?: string[] }

const UTM = (c: string) => `utm_source=porady&utm_medium=email&utm_campaign=${c}`

export const SEQUENCE: Step[] = [
  {
    day: 2,
    subject: "Twoja najlepsza rolka w 4 częściach",
    body: [
      "W audycie wskazaliśmy Twoją najlepszą rolkę. Rozbierz ją dziś na 4 części, zanim nagrasz następną.",
      "1. Hak: pierwsze zdanie i pierwszy kadr. Zapisz je dosłownie.",
      "2. Tempo: co ile sekund zmienia się obraz albo myśl. Policz cięcia w pierwszych 10 sekundach.",
      "3. Napisy: czy da się zrozumieć rolkę bez dźwięku.",
      "4. Wezwanie: co widz ma zrobić na końcu.",
      "Następną rolkę nagraj z tym samym hakiem i tempem, na nowy temat.",
    ],
  },
  {
    day: 4,
    subject: "Montaż zjada Ci wieczory?",
    only: ["mf"],
    body: [
      "Sam(a) montujesz rolki, więc wiesz, ile to trwa: napisy, cięcia, muzyka, poprawki.",
      "MontageFrames montuje nagranie w Twoim stylu: napisy, cięcia i kolory marki, na Twoim komputerze. 238 zł jednorazowo, bez abonamentu. Wolisz instalację razem z Wiktorią? 589 zł z konsultacją 1:1.",
      "Najpierw możesz sprawdzić to za darmo na jednym nagraniu.",
    ],
    cta: { label: "Zobacz MontageFrames", path: `${MF_BASE_PATH}?${UTM("porady_d4")}` },
  },
  {
    day: 7,
    subject: "Jak dobra rolka staje się reklamą",
    body: [
      "Rolka, która dobrze poszła organicznie, jest najlepszym kandydatem na reklamę Meta: już wiesz, że ludzie ją oglądają.",
      "Zasada na start: reklamuj tylko rolki, które mają wyraźnie więcej wyświetleń niż Twoja mediana, i kieruj je do ludzi z Twojej okolicy albo branży.",
    ],
    cta: { label: "Umów 20 min rozmowy o reklamach", path: `/?${UTM("porady_d7")}#rezerwacja` },
  },
  {
    day: 10,
    subject: "Odpisz jednym słowem",
    body: [
      "Co jest dziś Twoim największym problemem z rolkami: montaż, pomysły czy reklamy?",
      "Odpisz na tego maila jednym słowem. Wiktoria czyta odpowiedzi i podpowie, od czego zacząć.",
    ],
  },
]

function StepEmail({ step, unsub }: { step: Step; unsub: string }) {
  return h(Html, { lang: "pl" },
    h(Head, null),
    h(Preview, null, step.subject),
    h(Body, { style: { backgroundColor: "#f5f5f7", fontFamily: "Helvetica, Arial, sans-serif", color: "#1d1d1f", margin: 0 } },
      h(Container, { style: { maxWidth: 560, margin: "0 auto", padding: "32px 20px" } },
        h(Section, { style: { backgroundColor: "#ffffff", borderRadius: 20, padding: 28 } },
          h(Text, { style: { fontSize: 22, fontWeight: 700, margin: "0 0 12px" } }, step.subject),
          ...step.body.map((t, i) => h(Text, { key: i, style: { fontSize: 16, lineHeight: "24px", margin: "0 0 12px" } }, t)),
          step.cta ? h(Button, { href: `${origin()}${step.cta.path}`, style: { backgroundColor: "#ff6a13", color: "#111111", borderRadius: 999, padding: "14px 24px", fontWeight: 700, fontSize: 16 } }, step.cta.label) : null,
          h(Text, { style: { fontSize: 13, color: "#5c5c62", margin: "16px 0 0" } }, "Dostajesz porady, bo zapisałeś/-aś się na nie przy audycie Instagrama. ", h(Link, { href: unsub, style: { color: "#5c5c62" } }, "Wypisz się")),
        ),
      ),
    ),
  )
}

export const stepText = (step: Step, unsub: string) =>
  [step.subject, "", ...step.body, step.cta ? `\n${step.cta.label}: ${origin()}${step.cta.path}` : "", "", `Wypisz się: ${unsub}`].join("\n")

/** Kolejne maile sekwencji, których termin minął. Każdy raz (klucz email+krok), w budżecie maili. */
export async function runSequence(limit = 10) {
  if (process.env.AUDYT_SEQUENCE !== "1" || limit <= 0) return { wyslane: 0, wylaczone: process.env.AUDYT_SEQUENCE !== "1" }
  const db = sql()
  const due = await db`
    select email, segment, sequence_step from ws_newsletter
    where confirmed_at is not null and unsubscribed_at is null and next_at is not null and next_at <= now() and sequence_step < ${SEQUENCE.length}
    order by next_at limit ${limit}`
  let sent = 0
  for (const r of due) {
    let idx = r.sequence_step as number
    while (idx < SEQUENCE.length && SEQUENCE[idx].only && !SEQUENCE[idx].only!.includes(r.segment)) idx++
    if (idx >= SEQUENCE.length) {
      await db`update ws_newsletter set sequence_step = ${SEQUENCE.length}, next_at = null where email = ${r.email}`
      continue
    }
    const step = SEQUENCE[idx]
    const unsub = unsubUrl(r.email)
    const res = await sendAudytMail({ key: `porady/${r.email}/${step.day}`, kind: `porady_d${step.day}`, to: r.email, subject: step.subject, react: StepEmail({ step, unsub }), text: stepText(step, unsub), marketing: true, unsubscribeUrl: unsub })
    if (res === "budzet") break
    const next = SEQUENCE[idx + 1]
    await db`update ws_newsletter set sequence_step = ${idx + 1}, next_at = ${next ? db`now() + make_interval(days => ${next.day - step.day})` : null} where email = ${r.email}`
    if (res === "ok") sent++
  }
  return { wyslane: sent, wylaczone: false }
}
