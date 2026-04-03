import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Section,
  Row,
  Column,
  Text,
  Link,
  Hr,
  Font,
} from "@react-email/components"

interface NotificationEmailProps {
  name: string
  email: string
  phone: string
  social: string
  revenue: string
  challenge: string
  submittedAt: string
}

export default function NotificationEmail({
  name,
  email,
  phone,
  social,
  revenue,
  challenge,
  submittedAt,
}: NotificationEmailProps) {
  return (
    <Html lang="pl" dir="ltr">
      <Head>
        <Font
          fontFamily="Bebas Neue"
          fallbackFontFamily="Arial"
          webFont={{
            url: "https://fonts.gstatic.com/s/bebasneue/v14/JTUSjIg69CK48gW7PXooxW5rygbi49c.woff2",
            format: "woff2",
          }}
          fontWeight={400}
          fontStyle="normal"
        />
        <Font
          fontFamily="Satoshi"
          fallbackFontFamily="Arial"
          webFont={{
            url: "https://cdn.fontshare.com/wf/ZCNJZLFTMFKVCNRJPIYGBHIQMF4GXYFV/GXJZLZPGKCM53UHCAXR7XMBVFWMKA7CV/WI527V6EIDMXM7UXODNDXQJNVZWFCXLD.woff2",
            format: "woff2",
          }}
          fontWeight={400}
          fontStyle="normal"
        />
        <Font
          fontFamily="Satoshi"
          fallbackFontFamily="Arial"
          webFont={{
            url: "https://cdn.fontshare.com/wf/ZCNJZLFTMFKVCNRJPIYGBHIQMF4GXYFV/GXJZLZPGKCM53UHCAXR7XMBVFWMKA7CV/WI527V6EIDMXM7UXODNDXQJNVZWFCXLD.woff2",
            format: "woff2",
          }}
          fontWeight={700}
          fontStyle="normal"
        />
        <meta name="color-scheme" content="dark" />
        <meta name="supported-color-schemes" content="dark" />
      </Head>
      <Preview>Nowe zgłoszenie od {name} — {revenue}</Preview>
      <Body style={bodyStyle}>
        <Container style={containerStyle}>

          {/* ═══════════════ HEADER ═══════════════ */}
          <Section style={headerStyle}>
            <Text style={headerBadgeStyle}>
              ● NOWE ZGŁOSZENIE
            </Text>
            <Text style={headerTitleStyle}>
              OTRZYMANO WIADOMOŚĆ
            </Text>
            <Text style={headerTimeStyle}>
              {submittedAt}
            </Text>
          </Section>

          {/* ═══════════════ ACCENT LINE ═══════════════ */}
          <Section style={{ padding: "0 40px" }}>
            <div style={accentLineStyle} />
          </Section>

          {/* ═══════════════ SENDER INFO ═══════════════ */}
          <Section style={senderSectionStyle}>
            <Text style={sectionLabelStyle}>DANE NADAWCY</Text>

            {/* Name */}
            <Section style={dataRowStyle}>
              <Row>
                <Column style={dataLabelColStyle}>
                  <Text style={dataLabelStyle}>Imię i nazwisko</Text>
                </Column>
                <Column style={dataValueColStyle}>
                  <Text style={dataValueStyle}>{name}</Text>
                </Column>
              </Row>
            </Section>

            {/* Email */}
            <Section style={dataRowStyle}>
              <Row>
                <Column style={dataLabelColStyle}>
                  <Text style={dataLabelStyle}>Email</Text>
                </Column>
                <Column style={dataValueColStyle}>
                  <Text style={dataValueStyle}>
                    <Link href={`mailto:${email}`} style={dataLinkStyle}>{email}</Link>
                  </Text>
                </Column>
              </Row>
            </Section>

            {/* Phone */}
            <Section style={dataRowStyle}>
              <Row>
                <Column style={dataLabelColStyle}>
                  <Text style={dataLabelStyle}>Telefon</Text>
                </Column>
                <Column style={dataValueColStyle}>
                  <Text style={dataValueStyle}>
                    <Link href={`tel:${phone}`} style={dataLinkStyle}>{phone}</Link>
                  </Text>
                </Column>
              </Row>
            </Section>

            {/* Social */}
            <Section style={dataRowStyle}>
              <Row>
                <Column style={dataLabelColStyle}>
                  <Text style={dataLabelStyle}>Social / WWW</Text>
                </Column>
                <Column style={dataValueColStyle}>
                  <Text style={dataValueStyle}>{social}</Text>
                </Column>
              </Row>
            </Section>

            {/* Revenue */}
            <Section style={dataRowHighlightStyle}>
              <Row>
                <Column style={dataLabelColStyle}>
                  <Text style={dataLabelStyle}>Przychód mies.</Text>
                </Column>
                <Column style={dataValueColStyle}>
                  <Text style={dataValueHighlightStyle}>{revenue}</Text>
                </Column>
              </Row>
            </Section>
          </Section>

          {/* ═══════════════ CHALLENGE / MESSAGE ═══════════════ */}
          <Section style={challengeSectionStyle}>
            <Text style={sectionLabelStyle}>WYZWANIE KLIENTA</Text>
            <Section style={challengeBoxStyle}>
              <Text style={challengeTextStyle}>
                &ldquo;{challenge}&rdquo;
              </Text>
            </Section>
          </Section>

          {/* ═══════════════ QUICK ACTIONS ═══════════════ */}
          <Section style={actionsSectionStyle}>
            <Section style={{ textAlign: "center" as const }}>
              <Link href={`mailto:${email}?subject=Re: Zgłoszenie kwalifikacyjne — ${name}`} style={replyButtonStyle}>
                ODPOWIEDZ NA EMAIL →
              </Link>
            </Section>
            <Section style={{ textAlign: "center" as const, paddingTop: "12px" }}>
              <Link href={`tel:${phone}`} style={callButtonStyle}>
                ZADZWOŃ: {phone}
              </Link>
            </Section>
          </Section>

          {/* ═══════════════ DIVIDER ═══════════════ */}
          <Section style={{ padding: "0 40px" }}>
            <Hr style={dividerStyle} />
          </Section>

          {/* ═══════════════ FOOTER ═══════════════ */}
          <Section style={footerStyle}>
            <Text style={footerTextStyle}>
              Wiadomość wysłana z formularza na wiktoriaskopek.pl
            </Text>
            <Text style={footerTimestampStyle}>
              {submittedAt}
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

/* ═══════════════════════════════════════
   STYLES
   ═══════════════════════════════════════ */

const bodyStyle: React.CSSProperties = {
  backgroundColor: "#050505",
  fontFamily: "'Satoshi', Arial, Helvetica, sans-serif",
  margin: 0,
  padding: "40px 0",
}

const containerStyle: React.CSSProperties = {
  backgroundColor: "#0a0a0a",
  maxWidth: "600px",
  margin: "0 auto",
  borderRadius: "16px",
  border: "1px solid rgba(255,255,255,0.06)",
  overflow: "hidden",
}

const headerStyle: React.CSSProperties = {
  textAlign: "center" as const,
  padding: "48px 40px 24px",
  background: "linear-gradient(180deg, rgba(255,102,0,0.12) 0%, transparent 100%)",
}

const headerBadgeStyle: React.CSSProperties = {
  fontFamily: "'Satoshi', Arial, sans-serif",
  fontSize: "11px",
  color: "#ff6600",
  letterSpacing: "4px",
  textTransform: "uppercase" as const,
  margin: "0 0 12px",
  fontWeight: 700,
}

const headerTitleStyle: React.CSSProperties = {
  fontFamily: "'Bebas Neue', Arial, sans-serif",
  fontSize: "38px",
  color: "#ffffff",
  letterSpacing: "4px",
  margin: "0 0 8px",
  lineHeight: "1",
}

const headerTimeStyle: React.CSSProperties = {
  fontFamily: "'Satoshi', Arial, sans-serif",
  fontSize: "11px",
  color: "rgba(255,255,255,0.3)",
  margin: "0",
}

const accentLineStyle: React.CSSProperties = {
  height: "2px",
  background: "linear-gradient(90deg, transparent, #ff6600, transparent)",
  margin: "0",
}

const senderSectionStyle: React.CSSProperties = {
  padding: "32px 40px 24px",
}

const sectionLabelStyle: React.CSSProperties = {
  fontFamily: "'Bebas Neue', Arial, sans-serif",
  fontSize: "18px",
  color: "rgba(255,102,0,0.6)",
  letterSpacing: "4px",
  margin: "0 0 16px",
}

const dataRowStyle: React.CSSProperties = {
  padding: "10px 16px",
  borderRadius: "8px",
  backgroundColor: "rgba(255,255,255,0.02)",
  marginBottom: "4px",
  border: "1px solid rgba(255,255,255,0.03)",
}

const dataRowHighlightStyle: React.CSSProperties = {
  padding: "10px 16px",
  borderRadius: "8px",
  backgroundColor: "rgba(255,102,0,0.06)",
  marginBottom: "4px",
  border: "1px solid rgba(255,102,0,0.15)",
}

const dataLabelColStyle: React.CSSProperties = {
  width: "140px",
  verticalAlign: "middle",
}

const dataValueColStyle: React.CSSProperties = {
  verticalAlign: "middle",
}

const dataLabelStyle: React.CSSProperties = {
  fontFamily: "'Satoshi', Arial, sans-serif",
  fontSize: "11px",
  color: "rgba(255,255,255,0.35)",
  letterSpacing: "1px",
  textTransform: "uppercase" as const,
  margin: "0",
  fontWeight: 700,
}

const dataValueStyle: React.CSSProperties = {
  fontFamily: "'Satoshi', Arial, sans-serif",
  fontSize: "14px",
  color: "rgba(255,255,255,0.85)",
  margin: "0",
  fontWeight: 500,
}

const dataValueHighlightStyle: React.CSSProperties = {
  fontFamily: "'Satoshi', Arial, sans-serif",
  fontSize: "14px",
  color: "#ff6600",
  margin: "0",
  fontWeight: 700,
}

const dataLinkStyle: React.CSSProperties = {
  color: "rgba(255,255,255,0.85)",
  textDecoration: "underline",
  textUnderlineOffset: "2px",
  textDecorationColor: "rgba(255,102,0,0.3)",
}

const challengeSectionStyle: React.CSSProperties = {
  padding: "8px 40px 32px",
}

const challengeBoxStyle: React.CSSProperties = {
  padding: "24px",
  borderRadius: "12px",
  backgroundColor: "rgba(255,255,255,0.03)",
  borderLeft: "3px solid #ff6600",
  border: "1px solid rgba(255,255,255,0.06)",
  borderLeftWidth: "3px",
  borderLeftColor: "#ff6600",
}

const challengeTextStyle: React.CSSProperties = {
  fontFamily: "'Satoshi', Arial, sans-serif",
  fontSize: "15px",
  color: "rgba(255,255,255,0.75)",
  lineHeight: "1.7",
  margin: "0",
  fontStyle: "italic",
}

const actionsSectionStyle: React.CSSProperties = {
  padding: "0 40px 32px",
  textAlign: "center" as const,
}

const replyButtonStyle: React.CSSProperties = {
  display: "inline-block",
  fontFamily: "'Satoshi', Arial, sans-serif",
  fontSize: "13px",
  fontWeight: 700,
  color: "#000000",
  backgroundColor: "#ff6600",
  padding: "14px 32px",
  borderRadius: "50px",
  textDecoration: "none",
  letterSpacing: "2px",
  textTransform: "uppercase" as const,
}

const callButtonStyle: React.CSSProperties = {
  display: "inline-block",
  fontFamily: "'Satoshi', Arial, sans-serif",
  fontSize: "12px",
  fontWeight: 700,
  color: "rgba(255,255,255,0.5)",
  backgroundColor: "rgba(255,255,255,0.04)",
  padding: "10px 24px",
  borderRadius: "50px",
  textDecoration: "none",
  letterSpacing: "2px",
  textTransform: "uppercase" as const,
  border: "1px solid rgba(255,255,255,0.08)",
}

const dividerStyle: React.CSSProperties = {
  borderTop: "1px solid rgba(255,255,255,0.06)",
  margin: "0",
}

const footerStyle: React.CSSProperties = {
  textAlign: "center" as const,
  padding: "24px 40px 32px",
}

const footerTextStyle: React.CSSProperties = {
  fontFamily: "'Satoshi', Arial, sans-serif",
  fontSize: "11px",
  color: "rgba(255,255,255,0.2)",
  margin: "0 0 4px",
}

const footerTimestampStyle: React.CSSProperties = {
  fontFamily: "'Satoshi', Arial, sans-serif",
  fontSize: "10px",
  color: "rgba(255,255,255,0.1)",
  margin: "0",
  letterSpacing: "1px",
}
