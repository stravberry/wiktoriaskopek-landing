import { Body, Button, Container, Head, Hr, Html, Preview, Section, Text, Link } from "@react-email/components"
import { MF_TERMS_VERSION, MF_TEXT, SELLER } from "@/lib/mf/config"

export type MfAccessEmailProps = {
  productName: string
  licenseKey: string
  loginUrl: string
  accountUrl: string
  origin: string
  githubLogin: string | null
  githubInvited: boolean
  githubConfigured: boolean
  serviceStart: boolean
  product: "paczka" | "konsultacja"
}

const ink = "#1d1d1f"
const muted = "#5c5c62"
const accent = "#ff6a13"

export function accessEmailText(p: MfAccessEmailProps) {
  return [
    `Dziękuję za zakup: ${p.productName}.`,
    "",
    `Twój klucz licencyjny: ${p.licenseKey}`,
    `Wejdź na konto (link działa raz, 72 h): ${p.loginUrl}`,
    `Później logujesz się tu: ${p.accountUrl}`,
    `Poradnik online (po zalogowaniu): ${p.origin}/pl/montuj-bez-montazysty/poradnik`,
    "",
    p.githubInvited
      ? `Dostęp do paczki: wysłaliśmy zaproszenie GitHub dla @${p.githubLogin}. Zaakceptuj je w mailu od GitHuba albo na github.com/notifications.`
      : !p.githubConfigured
        ? "Dostęp do paczki (zaproszenie do repozytorium GitHub albo plik ZIP) wyślemy osobnym mailem w ciągu 24 godzin. Jeśli masz konto GitHub, odpisz na tego maila i podaj login."
        : "Dostęp do paczki: podaj swój login GitHub na koncie albo pobierz ZIP z konta.",
    "",
    "Start w 3 krokach: 1) odbierz paczkę, 2) otwórz folder w Claude Code, 3) wpisz /start i odpowiadaj na pytania.",
    p.product === "konsultacja" ? "Konsultacja: odezwę się mailem w sprawie terminu." : "",
    "",
    "POTWIERDZENIE ZAWARCIA UMOWY I OŚWIADCZEŃ",
    `Regulamin: wersja ${MF_TERMS_VERSION} (w załączniku).`,
    `Twoje oświadczenie złożone przed płatnością: „${MF_TEXT.digital}”`,
    "Potwierdzam rozpoczęcie dostarczania treści cyfrowej. Prawo odstąpienia od umowy w części dotyczącej treści cyfrowej wygasło z chwilą rozpoczęcia dostarczania.",
    p.serviceStart ? `Żądanie dotyczące konsultacji: „${MF_TEXT.serviceStart}”` : "",
    "",
    `Sprzedawca: ${SELLER.name}, ${SELLER.address}, ${SELLER.email}, ${SELLER.phone}. Forma: ${SELLER.form}.`,
    `Odstąpienie od umowy (np. konsultacji): ${p.origin}/pl/odstapienie`,
  ]
    .filter((l, i, a) => l !== "" || a[i - 1] !== "")
    .join("\n")
}

export default function MfAccessEmail(p: MfAccessEmailProps) {
  return (
    <Html lang="pl">
      <Head />
      <Preview>Twój klucz licencyjny i dostęp do MontageFrames</Preview>
      <Body style={{ backgroundColor: "#f5f5f7", fontFamily: "Helvetica, Arial, sans-serif", color: ink, margin: 0 }}>
        <Container style={{ maxWidth: 560, margin: "0 auto", padding: "32px 20px" }}>
          <Section style={{ backgroundColor: "#ffffff", borderRadius: 20, padding: 28 }}>
            <Text style={{ fontSize: 24, fontWeight: 700, margin: "0 0 8px" }}>Dziękuję za zakup!</Text>
            <Text style={{ fontSize: 16, color: muted, margin: "0 0 20px" }}>{p.productName}</Text>

            <Text style={{ fontSize: 14, color: muted, margin: 0 }}>Twój klucz licencyjny</Text>
            <Text style={{ fontSize: 20, fontWeight: 700, fontFamily: "Menlo, monospace", margin: "4px 0 20px", letterSpacing: 1 }}>
              {p.licenseKey}
            </Text>

            <Button
              href={p.loginUrl}
              style={{ backgroundColor: accent, color: "#111111", borderRadius: 999, padding: "14px 24px", fontWeight: 700, fontSize: 16 }}
            >
              Wejdź na swoje konto
            </Button>
            <Text style={{ fontSize: 13, color: muted }}>
              Link działa raz przez 72 godziny. Później zaloguj się na <Link href={p.accountUrl}>{p.accountUrl}</Link>.
            </Text>
            <Text style={{ fontSize: 15 }}>
              Poradnik online (po zalogowaniu): <Link href={`${p.origin}/pl/montuj-bez-montazysty/poradnik`}>{`${p.origin}/pl/montuj-bez-montazysty/poradnik`}</Link>
            </Text>

            <Hr />
            <Text style={{ fontSize: 16, fontWeight: 700 }}>Dostęp do paczki</Text>
            <Text style={{ fontSize: 15, lineHeight: "1.5" }}>
              {p.githubInvited
                ? `Wysłaliśmy zaproszenie GitHub dla @${p.githubLogin}. Zaakceptuj je w mailu od GitHuba albo na github.com/notifications.`
                : !p.githubConfigured
                  ? "Dostęp do paczki (zaproszenie do repozytorium GitHub albo plik ZIP) wyślemy osobnym mailem w ciągu 24 godzin. Jeśli masz konto GitHub, odpisz na tego maila i podaj login."
                  : "Podaj swój login GitHub na koncie, a dostaniesz zaproszenie do repozytorium z aktualizacjami. Możesz też pobrać ZIP z konta."}
            </Text>
            <Text style={{ fontSize: 16, fontWeight: 700 }}>Start w 3 krokach</Text>
            <Text style={{ fontSize: 15, lineHeight: "1.6", margin: 0 }}>
              1. Odbierz paczkę (GitHub albo ZIP).
              <br />
              2. Otwórz folder w Claude Code.
              <br />
              3. Wpisz <b>/start</b> i odpowiadaj na pytania. Poradnik masz na koncie.
            </Text>
            {p.product === "konsultacja" && (
              <Text style={{ fontSize: 15 }}>Konsultacja: odezwę się mailem w sprawie terminu.</Text>
            )}

            <Hr />
            <Text style={{ fontSize: 13, fontWeight: 700, color: ink }}>Potwierdzenie zawarcia umowy i oświadczeń</Text>
            <Text style={{ fontSize: 12, color: muted, lineHeight: "1.5" }}>
              Regulamin w wersji {MF_TERMS_VERSION} jest w załączniku. Oświadczenie złożone przed płatnością: „{MF_TEXT.digital}”
              Potwierdzam rozpoczęcie dostarczania treści cyfrowej. Prawo odstąpienia od umowy w części dotyczącej treści cyfrowej
              wygasło z chwilą rozpoczęcia dostarczania.
              {p.serviceStart ? ` Żądanie dotyczące konsultacji: „${MF_TEXT.serviceStart}”` : ""}
            </Text>
            <Text style={{ fontSize: 12, color: muted, lineHeight: "1.5" }}>
              Sprzedawca: {SELLER.name}, {SELLER.address}, {SELLER.email}, {SELLER.phone}. Forma: {SELLER.form}. Odstąpienie od umowy:{" "}
              <Link href={`${p.origin}/pl/odstapienie`}>{`${p.origin}/pl/odstapienie`}</Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}
