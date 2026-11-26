import options from "./trial-options.json"

// Darmowa próba (00-PLAN 0e). Render: Coding Builder (Edge Function mf-trial + worker). Tu: walidacja marki i stałe.
export const TRIAL_API = process.env.NEXT_PUBLIC_MF_TRIAL_API || "https://ousslupqwtmxgxahdotd.supabase.co/functions/v1/mf-trial"
export const TRIAL_CONSENT_VERSION = "proba-2026-11-26"
// Brzmienie zgody dla wersji proba-2026-11-26 (Coding Builder, 09-wersja-probna.md). Zmiana treści = nowa wersja po obu stronach.
export const TRIAL_CONSENT_TEXT =
  "Zgadzam się, aby MontageFrames przetworzyło moje nagranie i logo w celu zmontowania jednej próbnej rolki. Nagranie i logo usuwamy zaraz po montażu (najpóźniej po 24 godzinach), a gotową rolkę i plik marki po 7 dniach. Oświadczam, że mam prawo do tego nagrania i zgodę osób, które w nim widać i słychać."
export const TRIAL_LIMITS = { videoMaxBytes: 50 * 1024 * 1024, videoMinSeconds: 5, videoMaxSeconds: 60, logoMaxBytes: 5 * 1024 * 1024 }
export const TRIAL_STYLES = options.styles as { id: string; name: string; description: string; inspiredBy: string | null }[]
export const TRIAL_FONTS = options.fonts as string[]

// Jednorazowe skrzynki: blokujemy przy rejestracji próby (audyt Ecom). shortcut: krótka lista, rozszerzyć, gdy pojawią się nadużycia.
const DISPOSABLE = ["mailinator.com", "10minutemail.com", "guerrillamail.com", "yopmail.com", "tempmail.com", "temp-mail.org", "trashmail.com", "sharklasers.com", "getnada.com", "dispostable.com"]
export const isDisposable = (email: string) => DISPOSABLE.includes(email.split("@")[1]?.toLowerCase() ?? "")

const HEX = /^#[0-9a-fA-F]{6}$/
const str = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "")

/** Marka z kreatora → obiekt zgodny z mf_trial_brand_ok (Coding Builder). null = błąd danych. */
export function parseTrialBrand(raw: unknown) {
  if (!raw || typeof raw !== "object") return null
  const b = raw as Record<string, unknown>
  const c = (b.colors ?? {}) as Record<string, unknown>
  const brand = {
    name: str(b.name, 80),
    style: str(b.style, 60),
    font: str(b.font, 60),
    colors: { accent: str(c.accent, 7), text: str(c.text, 7) || "#FFFFFF", background: str(c.background, 7) || "#111111" },
    tone: str(b.tone, 300) || undefined,
    audience: str(b.audience, 300) || undefined,
    notes: str(b.notes, 1000) || undefined,
    // Słownik marki (Coding Builder): do 20 haseł po 40 znaków, transkrypcja poprawia ich pisownię.
    terms: Array.isArray(b.terms) ? (b.terms as unknown[]).map((x) => str(x, 40)).filter(Boolean).slice(0, 20) : undefined,
  }
  if (!brand.name || !TRIAL_STYLES.some((s) => s.id === brand.style) || !TRIAL_FONTS.includes(brand.font)) return null
  if (![brand.colors.accent, brand.colors.text, brand.colors.background].every((x) => HEX.test(x))) return null
  return brand
}
