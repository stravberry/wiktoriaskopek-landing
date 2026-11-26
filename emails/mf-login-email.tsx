import { Body, Button, Container, Head, Html, Preview, Section, Text } from "@react-email/components"

export default function MfLoginEmail({ url, minutes, trial = false }: { url: string; minutes: number; trial?: boolean }) {
  return (
    <Html lang="pl">
      <Head />
      <Preview>{trial ? "Link do darmowej próby MontageFrames" : "Link do Twojego konta MontageFrames"}</Preview>
      <Body style={{ backgroundColor: "#f5f5f7", fontFamily: "Helvetica, Arial, sans-serif", color: "#1d1d1f", margin: 0 }}>
        <Container style={{ maxWidth: 560, margin: "0 auto", padding: "32px 20px" }}>
          <Section style={{ backgroundColor: "#ffffff", borderRadius: 20, padding: 28 }}>
            <Text style={{ fontSize: 22, fontWeight: 700, margin: "0 0 12px" }}>{trial ? "Zrób swoją pierwszą rolkę za darmo" : "Zaloguj się do MontageFrames"}</Text>
            <Button
              href={url}
              style={{ backgroundColor: "#ff6a13", color: "#111111", borderRadius: 999, padding: "14px 24px", fontWeight: 700, fontSize: 16 }}
            >
              {trial ? "Przejdź do próby" : "Otwórz konto"}
            </Button>
            <Text style={{ fontSize: 13, color: "#5c5c62" }}>
              Link działa raz przez {minutes} minut. Jeśli to nie Ty, zignoruj tę wiadomość.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}
