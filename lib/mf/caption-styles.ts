// Przybliżony podgląd napisu dla każdego stylu (kolory i charakter z opisów katalogu paczki).
// To ilustracja na stronie, nie render programu: prawdziwe podglądy rolek są DO UZUPEŁNIENIA.

export type CaptionLook = {
  text: string // kolor zwykłych słów
  key: string // kolor słowa-klucza
  mark: "box" | "underline" | "glow" | "color" | "none"
  markColor?: string // tło zakreślacza / kolor kreski
  weight: number
  upper?: boolean
  italicKey?: boolean
  track?: string
  pos?: "middle" | "low"
  size?: number // względny rozmiar 0.8–1.3
  shade?: string // przyciemnienie kadru
}

const L = (l: CaptionLook) => l

export const CAPTION_LOOKS: Record<string, CaptionLook> = {
  "czysty-minimal": L({ text: "#fff", key: "#fff", mark: "underline", markColor: "#3b82f6", weight: 500 }),
  "dynamiczny-zakreslacz": L({ text: "#fff", key: "#111", mark: "box", markColor: "#ff6a13", weight: 800, upper: true }),
  "elegancki-premium": L({ text: "#f6eedd", key: "#e2c27a", mark: "color", weight: 400, italicKey: true }),
  "edukacyjny-wysoka-energia": L({ text: "#fff", key: "#111", mark: "box", markColor: "#b6f03c", weight: 800, upper: true, track: "-0.02em" }),
  "podcast-spokojny": L({ text: "#fff", key: "#fff", mark: "none", weight: 600, size: 0.9 }),
  "mocny-kontrast": L({ text: "#fff", key: "#000", mark: "box", markColor: "#fff", weight: 900, upper: true }),
  "neon-noc": L({ text: "#fff", key: "#ff4fb0", mark: "glow", weight: 800 }),
  "biznes-granat": L({ text: "#fff", key: "#fff", mark: "box", markColor: "#1e3a8a", weight: 600 }),
  "cieply-lifestyle": L({ text: "#fff", key: "#ff8a73", mark: "color", weight: 800 }),
  "news-czerwony": L({ text: "#fff", key: "#fff", mark: "box", markColor: "#e11d2e", weight: 800, upper: true }),
  "slowo-po-slowie": L({ text: "#fff", key: "#3ddc6a", mark: "color", weight: 900, upper: true, size: 1.25 }),
  "luksusowy-dokument": L({ text: "#fff", key: "#d9b45a", mark: "color", weight: 300, upper: true, track: "0.18em", size: 0.85 }),
  "monochrom-akcent": L({ text: "#f3ead8", key: "#f3ead8", mark: "underline", markColor: "#f59e0b", weight: 500 }),
  "napisy-na-dole": L({ text: "#fff", key: "#fff", mark: "none", weight: 700, pos: "low" }),
  "vlog-narracyjny": L({ text: "#fff", key: "#fb923c", mark: "color", weight: 800 }),
  "hiper-retencja": L({ text: "#fff", key: "#facc15", mark: "color", weight: 900, upper: true, size: 1.3 }),
  "dokument-reporterski": L({ text: "#f3ead8", key: "#f3ead8", mark: "none", weight: 400, italicKey: true }),
  "explainer-papierowy": L({ text: "#fff", key: "#1d1d1f", mark: "box", markColor: "#f3ead8", weight: 700 }),
  karaoke: L({ text: "rgba(255,255,255,0.55)", key: "#22d3ee", mark: "color", weight: 800 }),
  "mem-gen-z": L({ text: "#111", key: "#111", mark: "box", markColor: "#ff6fd1", weight: 900, upper: true }),
  "typografia-kinetyczna": L({ text: "#fff", key: "#fff", mark: "none", weight: 900, upper: true, size: 1.3, track: "-0.04em" }),
  "kino-szerokie": L({ text: "#fff", key: "#fff", mark: "none", weight: 400, pos: "low", size: 0.7, track: "0.08em", shade: "rgba(0,0,0,0.35)" }),
  "podcast-dynamiczny": L({ text: "#fff", key: "#3b82f6", mark: "color", weight: 800 }),
  "luksus-czarno-bialy": L({ text: "#fff", key: "#fff", mark: "none", weight: 300, upper: true, track: "0.2em", size: 0.8, shade: "rgba(0,0,0,0.25)" }),
  "nieruchomosci-premium": L({ text: "#fff", key: "#d9b45a", mark: "color", weight: 500 }),
  "produkt-premium": L({ text: "#fff", key: "#000", mark: "box", markColor: "#fff", weight: 800 }),
  "sport-akcja": L({ text: "#fff", key: "#fff", mark: "box", markColor: "#dc2626", weight: 900, upper: true, track: "-0.03em" }),
  "pastelowy-lifestyle": L({ text: "#fff", key: "#3b2a30", mark: "box", markColor: "#f9c6d3", weight: 700 }),
  "medyczny-spokojny": L({ text: "#fff", key: "#2dd4bf", mark: "color", weight: 600 }),
  "finanse-liczby": L({ text: "#fff", key: "#fff", mark: "underline", markColor: "#22c55e", weight: 700 }),
  "kurs-online": L({ text: "#fff", key: "#fff", mark: "underline", markColor: "#a78bfa", weight: 600 }),
  technologia: L({ text: "#fff", key: "#22d3ee", mark: "color", weight: 800, shade: "rgba(4,20,30,0.45)" }),
  "beauty-zloto-rozowe": L({ text: "#fff", key: "#f2b8a2", mark: "color", weight: 500, italicKey: true }),
}
