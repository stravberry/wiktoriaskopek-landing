import { Body, Button, Container, Head, Hr, Html, Link, Preview, Section, Text } from "@react-email/components"
import type { Report } from "@/lib/audyt/core"

// Maile darmowego audytu Instagrama (plan C). Bez pikseli i bez przekierowań kliknięć.
const page = { backgroundColor: "#f5f5f7", fontFamily: "Helvetica, Arial, sans-serif", color: "#1d1d1f", margin: 0 }
const card = { backgroundColor: "#ffffff", borderRadius: 20, padding: 28 }
const h1 = { fontSize: 22, fontWeight: 700, margin: "0 0 12px", lineHeight: "28px" }
const p = { fontSize: 16, lineHeight: "24px", margin: "0 0 12px" }
const small = { fontSize: 13, lineHeight: "19px", color: "#5c5c62", margin: "12px 0 0" }
const btn = { backgroundColor: "#ff6a13", color: "#111111", borderRadius: 999, padding: "14px 24px", fontWeight: 700, fontSize: 16 }

function Shell({ preview, children }: { preview: string; children: React.ReactNode }) {
  return (
    <Html lang="pl">
      <Head />
      <Preview>{preview}</Preview>
      <Body style={page}>
        <Container style={{ maxWidth: 560, margin: "0 auto", padding: "32px 20px" }}>
          <Section style={card}>{children}</Section>
          <Text style={{ ...small, textAlign: "center" }}>Wiktoria Skopek · wiktoriaskopek.pl</Text>
        </Container>
      </Body>
    </Html>
  )
}

export function AudytConfirmEmail({ url, handle, newsletter }: { url: string; handle: string; newsletter: boolean }) {
  return (
    <Shell preview={`Potwierdź adres, a przygotujemy audyt @${handle}`}>
      <Text style={h1}>Potwierdź adres, a przygotujemy audyt @{handle}</Text>
      <Text style={p}>Kliknij przycisk i potwierdź na stronie. Dopiero wtedy zaczynamy analizę profilu.{newsletter ? " Tym samym kliknięciem potwierdzasz też zapis na porady, który zaznaczyłeś/-aś w formularzu." : ""}</Text>
      <Button href={url} style={btn}>Potwierdzam adres</Button>
      <Text style={small}>Link działa przez 24 godziny. Jeśli to nie Ty, zignoruj tę wiadomość: bez potwierdzenia nic nie przygotujemy, a zgłoszenie usuniemy po 7 dniach.</Text>
    </Shell>
  )
}
export const audytConfirmText = (url: string, handle: string) =>
  `Potwierdź adres, a przygotujemy audyt @${handle}.\n\nOtwórz link i potwierdź na stronie (działa 24 godziny):\n${url}\n\nJeśli to nie Ty, zignoruj tę wiadomość.`

export type AudytCta = { label: string; url: string; lead: string }

export function AudytReportEmail({ handle, report, cta, unsubscribeUrl }: { handle: string; report: Report; cta: AudytCta; unsubscribeUrl?: string | null }) {
  return (
    <Shell preview={report.ocena}>
      <Text style={h1}>Audyt Instagrama: @{handle}</Text>
      <Text style={p}>{report.ocena}</Text>
      {report.najlepsza && <Text style={{ ...p, backgroundColor: "#fff3ea", borderRadius: 14, padding: "12px 14px" }}>{report.najlepsza}</Text>}
      {report.obserwacje.map((o, i) => (
        <Section key={i} style={{ margin: "0 0 4px" }}>
          <Text style={{ ...p, fontWeight: 700, margin: "16px 0 4px" }}>{i + 1}. {o.tytul}</Text>
          <Text style={p}>{o.tekst}</Text>
        </Section>
      ))}
      {report.nastepny && <Text style={{ ...p, margin: "16px 0 0" }}>{report.nastepny}</Text>}
      {report.pochwala && <Text style={{ ...p, color: "#5c5c62", margin: "16px 0 0" }}>{report.pochwala}</Text>}
      <Text style={{ ...p, fontWeight: 700, margin: "20px 0 4px" }}>Zadanie na ten tydzień</Text>
      <Text style={p}>{report.zadanie}</Text>
      <Hr style={{ borderColor: "#e8e8ed", margin: "20px 0" }} />
      <Text style={p}>{cta.lead}</Text>
      <Button href={cta.url} style={btn}>{cta.label}</Button>
      <Text style={small}>{report.uwaga}</Text>
      <Text style={small}>
        Audyt powstał z publicznych danych Twojego profilu firmowego lub twórcy (Meta) albo z liczb, które podałeś/-aś. Przygotowała go Wiktoria Skopek z pomocą narzędzia AI.
        {unsubscribeUrl ? <> Dostajesz też porady, bo się na nie zapisałeś/-aś. <Link href={unsubscribeUrl} style={{ color: "#5c5c62" }}>Wypisz się</Link>.</> : null}
      </Text>
    </Shell>
  )
}
export const audytReportText = (handle: string, r: Report, cta: AudytCta, unsubscribeUrl?: string | null) =>
  [
    `Audyt Instagrama: @${handle}`,
    "",
    r.ocena,
    r.najlepsza ?? "",
    ...r.obserwacje.flatMap((o, i) => ["", `${i + 1}. ${o.tytul}`, o.tekst]),
    r.nastepny ? `\n${r.nastepny}` : "",
    r.pochwala ? `\n${r.pochwala}` : "",
    "",
    "Zadanie na ten tydzień:",
    r.zadanie,
    "",
    `${cta.lead} ${cta.label}: ${cta.url}`,
    "",
    r.uwaga,
    unsubscribeUrl ? `Wypisz się z porad: ${unsubscribeUrl}` : "",
  ].filter((x, i, a) => !(x === "" && a[i - 1] === "")).join("\n")

export function AudytNoDataEmail({ handle, formUrl }: { handle: string; formUrl: string }) {
  return (
    <Shell preview={`Nie widzimy publicznych danych @${handle}`}>
      <Text style={h1}>Nie widzimy publicznych danych @{handle}</Text>
      <Text style={p}>Audyt robimy z publicznych danych kont firmowych i twórców. Twoje konto jest osobiste (prywatne) albo ma mniej niż 3 rolki, więc nie mamy z czego policzyć wyników.</Text>
      <Text style={p}>Masz dwie drogi: przełącz konto na profesjonalne w aplikacji Instagram (Ustawienia → Typ konta i narzędzia) albo podaj w formularzu 4 liczby z panelu: obserwujący, średnie wyświetlenia rolki, publikacje i rolki z ostatnich 30 dni.</Text>
      <Button href={formUrl} style={btn}>Podaję 4 liczby</Button>
    </Shell>
  )
}
export const audytNoDataText = (handle: string, formUrl: string) =>
  `Nie widzimy publicznych danych @${handle}: konto jest osobiste albo ma mniej niż 3 rolki.\nPrzełącz konto na profesjonalne albo podaj 4 liczby w formularzu: ${formUrl}`

export function AudytReviewEmail({ handle, url, segment, count }: { handle: string; url: string; segment: string; count: number }) {
  return (
    <Shell preview={`Audyt @${handle} czeka na Twoją akceptację`}>
      <Text style={h1}>Audyt @{handle} czeka na akceptację</Text>
      <Text style={p}>Segment: {segment}. W kolejce do akceptacji: {count}. Przeczytaj, popraw, jeśli trzeba, i kliknij „Wyślij”.</Text>
      <Button href={url} style={btn}>Otwórz w panelu</Button>
    </Shell>
  )
}
