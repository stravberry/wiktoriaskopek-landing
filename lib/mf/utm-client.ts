// Źródło wejścia w przeglądarce (audyt Ecom 2, pkt 4): first-touch w sessionStorage, bez ciasteczek.
// Zapisujemy przy pierwszym wejściu z UTM/fbclid w tej karcie; przekazujemy do /api/mf/trial/start i /api/mf/checkout.
const KEY = "mf_utm"
const KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "fbclid"]

export function captureUtm() {
  try {
    if (sessionStorage.getItem(KEY)) return
    const q = new URLSearchParams(window.location.search)
    const u: Record<string, string> = {}
    for (const k of KEYS) {
      const v = q.get(k)
      if (v) u[k] = v.slice(0, 200)
    }
    if (Object.keys(u).length) sessionStorage.setItem(KEY, JSON.stringify(u))
  } catch {}
}

/** First-touch z tej karty albo UTM z bieżącego adresu. */
export function getUtm(): Record<string, string> {
  captureUtm()
  try {
    const raw = JSON.parse(sessionStorage.getItem(KEY) || "{}")
    return raw && typeof raw === "object" ? raw : {}
  } catch {
    return {}
  }
}

/** Do dziennika zdarzeń: bez fbclid (długi identyfikator), tylko znacznik, że był. */
export function utmForEvents(): Record<string, string> {
  const { fbclid, ...rest } = getUtm()
  return fbclid ? { ...rest, ref: "fbclid" } : rest
}
