import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Section,
  Row,
  Column,
  Img,
  Text,
  Link,
  Hr,
  Font,
} from "@react-email/components"

interface ConfirmationEmailProps {
  name: string
}

export default function ConfirmationEmail({ name }: ConfirmationEmailProps) {
  const firstName = name.split(" ")[0] || name

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
      <Preview>Dziękuję za wiadomość, {firstName}! Odezwę się w ciągu 24h.</Preview>
      <Body style={bodyStyle}>
        <Container style={containerStyle}>

          {/* ═══════════════ HEADER ═══════════════ */}
          <Section style={headerStyle}>
            <Text style={logoStyle}>WIKTORIA SKOPEK</Text>
            <Text style={logoSubStyle}>PARTNER STRATEGICZNY</Text>
          </Section>

          {/* ═══════════════ ACCENT LINE ═══════════════ */}
          <Section style={{ padding: "0 40px" }}>
            <div style={accentLineStyle} />
          </Section>

          {/* ═══════════════ MAIN CONTENT ═══════════════ */}
          <Section style={mainContentStyle}>
            <Text style={greetingStyle}>
              Cześć, {firstName}! 👋
            </Text>

            <Text style={headingStyle}>
              DZIĘKUJĘ ZA WIADOMOŚĆ
            </Text>

            <Text style={paragraphStyle}>
              Twoje zgłoszenie dotarło do mnie pomyślnie. Przeanalizuję je osobi
              ście i odezwę się do Ciebie <strong style={{ color: "#ff6600" }}>w ciągu 24 godzin</strong>.
            </Text>

            <Text style={paragraphStyle}>
              W międzyczasie, jeśli masz pilne pytanie, możesz zadzwonić pod numer{" "}
              <Link href="tel:+48537168645" style={linkStyle}>
                +48 537 168 645
              </Link>
              .
            </Text>
          </Section>

          {/* ═══════════════ ABOUT ME SECTION ═══════════════ */}
          <Section style={aboutSectionStyle}>
            <Section style={aboutInnerStyle}>
              <Row>
                <Column style={aboutImageColumnStyle}>
                  <Img
                    src="https://wiktoriaskopek.pl/images/wiktoria-skopek.jpg"
                    alt="Wiktoria Skopek"
                    width="120"
                    height="150"
                    style={aboutImageStyle}
                  />
                </Column>
                <Column style={aboutTextColumnStyle}>
                  <Text style={aboutNameStyle}>WIKTORIA SKOPEK</Text>
                  <Text style={aboutRoleStyle}>Partner Strategiczny • Video Marketing</Text>
                  <Text style={aboutDescStyle}>
                    Łączę produkcję wideo premium z psychologią sprzedaży. Pomagam ekspertom i markom osobistym budować autorytet i generować klientów High-Ticket dzięki systemowi wideo.
                  </Text>
                </Column>
              </Row>
            </Section>
          </Section>

          {/* ═══════════════ CTA: W CZYM MOGĘ CI POMÓC ═══════════════ */}
          <Section style={ctaSectionStyle}>
            <Text style={ctaHeadingStyle}>
              W CZYM MOGĘ CI POMÓC?
            </Text>

            {/* Service 1 */}
            <Section style={serviceRowStyle}>
              <Row>
                <Column style={serviceIconColStyle}>
                  <div style={serviceDotStyle} />
                </Column>
                <Column style={serviceTextColStyle}>
                  <Text style={serviceNameStyle}>Produkcja wideo premium</Text>
                  <Text style={serviceDescStyle}>
                    Profesjonalne nagrania w studiu z pełnym procesem post-produkcji.
                  </Text>
                </Column>
              </Row>
            </Section>

            {/* Service 2 */}
            <Section style={serviceRowStyle}>
              <Row>
                <Column style={serviceIconColStyle}>
                  <div style={serviceDotStyle} />
                </Column>
                <Column style={serviceTextColStyle}>
                  <Text style={serviceNameStyle}>Video marketing & VSL</Text>
                  <Text style={serviceDescStyle}>
                    Strategia sprzedażowa oparta na wideo — od koncepcji po konwersję.
                  </Text>
                </Column>
              </Row>
            </Section>

            {/* Service 3 */}
            <Section style={serviceRowStyle}>
              <Row>
                <Column style={serviceIconColStyle}>
                  <div style={serviceDotStyle} />
                </Column>
                <Column style={serviceTextColStyle}>
                  <Text style={serviceNameStyle}>Strategia social media</Text>
                  <Text style={serviceDescStyle}>
                    Content plan oparty na Twojej ekspertyzie, realizowany z moim zespołem.
                  </Text>
                </Column>
              </Row>
            </Section>

            {/* Service 4 */}
            <Section style={serviceRowStyle}>
              <Row>
                <Column style={serviceIconColStyle}>
                  <div style={serviceDotStyle} />
                </Column>
                <Column style={serviceTextColStyle}>
                  <Text style={serviceNameStyle}>Doradztwo biznesowe & mindset</Text>
                  <Text style={serviceDescStyle}>
                    Przełamywanie blokad przed kamerą i budowanie pewności siebie na planie.
                  </Text>
                </Column>
              </Row>
            </Section>

            {/* CTA Button */}
            <Section style={{ textAlign: "center" as const, paddingTop: "24px" }}>
              <Link href="https://wiktoriaskopek.pl/pl#qualification" style={ctaButtonStyle}>
                UMÓW BEZPŁATNĄ KONSULTACJĘ →
              </Link>
            </Section>
          </Section>

          {/* ═══════════════ DIVIDER ═══════════════ */}
          <Section style={{ padding: "0 40px" }}>
            <Hr style={dividerStyle} />
          </Section>

          {/* ═══════════════ SOCIAL FOOTER ═══════════════ */}
          <Section style={footerStyle}>
            <Text style={footerSocialLabel}>OBSERWUJ MNIE</Text>

            <Section style={{ textAlign: "center" as const }}>
              <Row style={{ display: "inline-block" as const }}>
                <Column style={{ paddingRight: "12px" }}>
                  <Link href="https://www.instagram.com/wiktoriaskopek" style={socialLinkStyle}>
                    <Img
                      src="https://cdn-icons-png.flaticon.com/512/174/174855.png"
                      alt="Instagram"
                      width="28"
                      height="28"
                      style={socialIconStyle}
                    />
                  </Link>
                </Column>
                <Column style={{ paddingLeft: "12px" }}>
                  <Link href="https://youtube.com/@wiktoriaskopek" style={socialLinkStyle}>
                    <Img
                      src="https://cdn-icons-png.flaticon.com/512/174/174883.png"
                      alt="YouTube"
                      width="28"
                      height="28"
                      style={socialIconStyle}
                    />
                  </Link>
                </Column>
              </Row>
            </Section>

            <Text style={footerContactStyle}>
              <Link href="mailto:kontakt@wiktoriaskopek.pl" style={footerLinkStyle}>
                kontakt@wiktoriaskopek.pl
              </Link>
              {" "}•{" "}
              <Link href="tel:+48537168645" style={footerLinkStyle}>
                +48 537 168 645
              </Link>
            </Text>

            <Text style={footerCopyStyle}>
              © {new Date().getFullYear()} Wiktoria Skopek. Wszelkie prawa zastrzeżone.
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
  padding: "48px 40px 20px",
  background: "linear-gradient(180deg, rgba(255,102,0,0.08) 0%, transparent 100%)",
}

const logoStyle: React.CSSProperties = {
  fontFamily: "'Bebas Neue', Arial, sans-serif",
  fontSize: "36px",
  color: "#ffffff",
  letterSpacing: "6px",
  margin: "0",
  lineHeight: "1",
}

const logoSubStyle: React.CSSProperties = {
  fontFamily: "'Satoshi', Arial, sans-serif",
  fontSize: "10px",
  color: "rgba(255,102,0,0.7)",
  letterSpacing: "6px",
  textTransform: "uppercase" as const,
  margin: "8px 0 0",
}

const accentLineStyle: React.CSSProperties = {
  height: "2px",
  background: "linear-gradient(90deg, transparent, #ff6600, transparent)",
  margin: "0",
}

const mainContentStyle: React.CSSProperties = {
  padding: "40px 40px 32px",
}

const greetingStyle: React.CSSProperties = {
  fontFamily: "'Satoshi', Arial, sans-serif",
  fontSize: "20px",
  color: "#ffffff",
  margin: "0 0 8px",
  fontWeight: 500,
}

const headingStyle: React.CSSProperties = {
  fontFamily: "'Bebas Neue', Arial, sans-serif",
  fontSize: "32px",
  color: "#ff6600",
  letterSpacing: "3px",
  margin: "0 0 24px",
  lineHeight: "1.1",
}

const paragraphStyle: React.CSSProperties = {
  fontFamily: "'Satoshi', Arial, sans-serif",
  fontSize: "15px",
  color: "rgba(255,255,255,0.7)",
  lineHeight: "1.7",
  margin: "0 0 16px",
}

const linkStyle: React.CSSProperties = {
  color: "#ff6600",
  textDecoration: "underline",
  textUnderlineOffset: "3px",
}

const aboutSectionStyle: React.CSSProperties = {
  padding: "0 40px 32px",
}

const aboutInnerStyle: React.CSSProperties = {
  backgroundColor: "rgba(255,255,255,0.03)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: "12px",
  padding: "24px",
}

const aboutImageColumnStyle: React.CSSProperties = {
  width: "120px",
  verticalAlign: "top",
  paddingRight: "20px",
}

const aboutImageStyle: React.CSSProperties = {
  borderRadius: "10px",
  objectFit: "cover" as const,
  border: "2px solid rgba(255,102,0,0.3)",
}

const aboutTextColumnStyle: React.CSSProperties = {
  verticalAlign: "top",
}

const aboutNameStyle: React.CSSProperties = {
  fontFamily: "'Bebas Neue', Arial, sans-serif",
  fontSize: "22px",
  color: "#ffffff",
  letterSpacing: "2px",
  margin: "0 0 4px",
  lineHeight: "1",
}

const aboutRoleStyle: React.CSSProperties = {
  fontFamily: "'Satoshi', Arial, sans-serif",
  fontSize: "11px",
  color: "rgba(255,102,0,0.7)",
  letterSpacing: "2px",
  textTransform: "uppercase" as const,
  margin: "0 0 12px",
}

const aboutDescStyle: React.CSSProperties = {
  fontFamily: "'Satoshi', Arial, sans-serif",
  fontSize: "13px",
  color: "rgba(255,255,255,0.55)",
  lineHeight: "1.6",
  margin: "0",
}

const ctaSectionStyle: React.CSSProperties = {
  padding: "0 40px 32px",
}

const ctaHeadingStyle: React.CSSProperties = {
  fontFamily: "'Bebas Neue', Arial, sans-serif",
  fontSize: "26px",
  color: "#ffffff",
  letterSpacing: "3px",
  margin: "0 0 20px",
  textAlign: "center" as const,
}

const serviceRowStyle: React.CSSProperties = {
  padding: "12px 16px",
  borderRadius: "8px",
  backgroundColor: "rgba(255,255,255,0.02)",
  marginBottom: "8px",
  border: "1px solid rgba(255,255,255,0.04)",
}

const serviceIconColStyle: React.CSSProperties = {
  width: "20px",
  verticalAlign: "top",
  paddingTop: "6px",
}

const serviceDotStyle: React.CSSProperties = {
  width: "8px",
  height: "8px",
  borderRadius: "50%",
  backgroundColor: "#ff6600",
}

const serviceTextColStyle: React.CSSProperties = {
  verticalAlign: "top",
  paddingLeft: "12px",
}

const serviceNameStyle: React.CSSProperties = {
  fontFamily: "'Satoshi', Arial, sans-serif",
  fontSize: "14px",
  fontWeight: 700,
  color: "#ffffff",
  margin: "0 0 2px",
}

const serviceDescStyle: React.CSSProperties = {
  fontFamily: "'Satoshi', Arial, sans-serif",
  fontSize: "12px",
  color: "rgba(255,255,255,0.45)",
  lineHeight: "1.5",
  margin: "0",
}

const ctaButtonStyle: React.CSSProperties = {
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

const dividerStyle: React.CSSProperties = {
  borderTop: "1px solid rgba(255,255,255,0.06)",
  margin: "0",
}

const footerStyle: React.CSSProperties = {
  textAlign: "center" as const,
  padding: "32px 40px 40px",
}

const footerSocialLabel: React.CSSProperties = {
  fontFamily: "'Satoshi', Arial, sans-serif",
  fontSize: "10px",
  color: "rgba(255,102,0,0.5)",
  letterSpacing: "4px",
  textTransform: "uppercase" as const,
  margin: "0 0 16px",
}

const socialLinkStyle: React.CSSProperties = {
  display: "inline-block",
  textDecoration: "none",
}

const socialIconStyle: React.CSSProperties = {
  borderRadius: "50%",
  opacity: 0.7,
}

const footerContactStyle: React.CSSProperties = {
  fontFamily: "'Satoshi', Arial, sans-serif",
  fontSize: "12px",
  color: "rgba(255,255,255,0.3)",
  margin: "20px 0 8px",
}

const footerLinkStyle: React.CSSProperties = {
  color: "rgba(255,255,255,0.4)",
  textDecoration: "none",
}

const footerCopyStyle: React.CSSProperties = {
  fontFamily: "'Satoshi', Arial, sans-serif",
  fontSize: "10px",
  color: "rgba(255,255,255,0.15)",
  margin: "0",
  letterSpacing: "1px",
  textTransform: "uppercase" as const,
}
