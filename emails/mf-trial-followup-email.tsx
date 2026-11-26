import { Body, Button, Container, Head, Html, Link, Preview, Section, Text } from "@react-email/components"

// Maile po darmowej próbie (audyt Ecom 2, pkt 10). TYLKO SZABLONY: nic ich jeszcze nie wysyła.
// „wygasa” jest transakcyjny (do wszystkich, bez treści sprzedażowej). „dzien1” i „dzien4” są sprzedażowe:
// wolno je wysłać wyłącznie osobom ze zgodą marketingową, zawsze z linkiem do wypisania. Uruchomienie wysyłki wymaga decyzji Wiktorii.

export type MfTrialFollowupKind = "wygasa" | "dzien1" | "dzien4"

export const MF_TRIAL_FOLLOWUP: Record<MfTrialFollowupKind, { subject: string; marketing: boolean }> = {
  wygasa: { subject: "Rolka z próby zniknie jutro", marketing: false },
  dzien1: { subject: "Ta sama rolka, bez znaku wodnego", marketing: true },
  dzien4: { subject: "Zainstalujmy to razem", marketing: true },
}

export default function MfTrialFollowupEmail({ kind, url, priceLabel, consultPriceLabel, unsubscribeUrl }: {
  kind: MfTrialFollowupKind
  /** wygasa: link do rolki (logowanie jednorazowe); dzien1/dzien4: link do zakupu. */
  url: string
  priceLabel: string
  consultPriceLabel: string
  /** Wymagany przy mailach sprzedażowych. */
  unsubscribeUrl?: string
}) {
  const t = MF_TRIAL_FOLLOWUP[kind]
  const body =
    kind === "wygasa"
      ? "Rolka z Twojej darmowej próby zniknie jutro. Pobierz ją, jeśli chcesz ją zachować."
      : kind === "dzien1"
        ? `Twoja marka i styl z próby są już zapisane. Po zakupie wczytasz je w programie jedną komendą i zmontujesz każdą kolejną rolkę tak samo. ${priceLabel} jednorazowo, gwarancja działania 14 dni.`
        : `Wolisz nie instalować programu sam(a)? W wersji z konsultacją 1:1 (${consultPriceLabel}) instalujemy MontageFrames razem na Twoim komputerze i robimy pierwszą rolkę na Twoim nagraniu. Termin ustalamy mailem po zakupie.`
  const cta = kind === "wygasa" ? "Pobierz moją rolkę" : kind === "dzien1" ? "Kupuję pełną wersję" : "Chcę instalację z Wiktorią"
  return (
    <Html lang="pl">
      <Head />
      <Preview>{t.subject}</Preview>
      <Body style={{ backgroundColor: "#f5f5f7", fontFamily: "Helvetica, Arial, sans-serif", color: "#1d1d1f", margin: 0 }}>
        <Container style={{ maxWidth: 560, margin: "0 auto", padding: "32px 20px" }}>
          <Section style={{ backgroundColor: "#ffffff", borderRadius: 20, padding: 28 }}>
            <Text style={{ fontSize: 22, fontWeight: 700, margin: "0 0 12px" }}>{t.subject}</Text>
            <Text style={{ fontSize: 16, lineHeight: "24px" }}>{body}</Text>
            <Button href={url} style={{ backgroundColor: "#ff6a13", color: "#111111", borderRadius: 999, padding: "14px 24px", fontWeight: 700, fontSize: 16 }}>
              {cta}
            </Button>
            {t.marketing ? (
              <Text style={{ fontSize: 13, color: "#5c5c62" }}>
                Dostajesz tę wiadomość, bo zgodziłeś/-aś się na maile o nowościach od Wiktorii Skopek.{" "}
                {unsubscribeUrl && <Link href={unsubscribeUrl} style={{ color: "#5c5c62" }}>Wypisz się</Link>}
              </Text>
            ) : (
              <Text style={{ fontSize: 13, color: "#5c5c62" }}>Link loguje Cię do próby i działa raz. Jeśli to nie Ty, zignoruj tę wiadomość.</Text>
            )}
          </Section>
        </Container>
      </Body>
    </Html>
  )
}
