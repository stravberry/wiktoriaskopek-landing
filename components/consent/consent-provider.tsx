"use client"

// Bramka zgód (06-zgody-cookies.md, pkt 1–11): nic poza niezbędnymi przed zgodą.
// Kategorie: necessary (zawsze), analytics (Vercel Analytics), marketing (na przyszłość: Piksel/CAPI — dziś nieużywane),
// external (kalendarz Cal.com). Wybór w ciasteczku `ws_consent` (niezbędne) na 6 miesięcy; dziennik na serwerze.
import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Analytics } from "@vercel/analytics/next"
import { track } from "@vercel/analytics"
import { BANNER_VERSION } from "@/lib/mf/config"

export type ConsentState = { id: string; v: string; analytics: boolean; marketing: boolean; external: boolean; t: number }
type Action = "accept_all" | "reject_all" | "custom" | "withdraw"

const COOKIE = "ws_consent"
const MAX_AGE = 182 * 24 * 60 * 60

function read(): ConsentState | null {
  if (typeof document === "undefined") return null
  const raw = document.cookie.split("; ").find((c) => c.startsWith(`${COOKIE}=`))
  if (!raw) return null
  try {
    const s = JSON.parse(decodeURIComponent(raw.slice(COOKIE.length + 1))) as ConsentState
    return s.v === BANNER_VERSION ? s : null // nowa wersja banera = pytamy ponownie
  } catch {
    return null
  }
}

function write(s: ConsentState) {
  const secure = location.protocol === "https:" ? "; Secure" : ""
  document.cookie = `${COOKIE}=${encodeURIComponent(JSON.stringify(s))}; Max-Age=${MAX_AGE}; Path=/; SameSite=Lax${secure}`
}

const uuid = () => crypto.randomUUID()

type Ctx = { state: ConsentState | null; ready: boolean; open: () => void; grant: (cat: "external") => void }
const ConsentCtx = createContext<Ctx>({ state: null, ready: false, open: () => {}, grant: () => {} })
export const useConsent = () => useContext(ConsentCtx)

/** Zdarzenie analityczne tylko po zgodzie „analytics”. */
export function trackEvent(name: string, props?: Record<string, string | number | boolean>) {
  if (read()?.analytics) track(name, props)
}

export function openConsentSettings() {
  window.dispatchEvent(new Event("consent:open"))
}

export default function ConsentProvider({ children, lang = "pl" }: { children: ReactNode; lang?: string }) {
  const [state, setState] = useState<ConsentState | null>(null)
  const [ready, setReady] = useState(false)
  const [bannerOpen, setBannerOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [draft, setDraft] = useState({ analytics: false, marketing: false, external: false })
  const pathname = usePathname()
  const noFooter = pathname === `/${lang}` // strona główna nie ma stopki: link do ustawień musi być stale dostępny

  useEffect(() => {
    const s = read()
    setState(s)
    // Baner po załadowaniu fontów: inaczej zmiana kroju przesuwa jego górną krawędź (CLS na telefonie).
    if (!s) document.fonts.ready.then(() => setBannerOpen(true))
    setReady(true)
    const onOpen = () => {
      const cur = read()
      setDraft({ analytics: !!cur?.analytics, marketing: !!cur?.marketing, external: !!cur?.external })
      setSettingsOpen(true)
    }
    window.addEventListener("consent:open", onOpen)
    return () => window.removeEventListener("consent:open", onOpen)
  }, [])

  const save = useCallback(
    (choice: { analytics: boolean; marketing: boolean; external: boolean }, action: Action, source: "banner" | "settings") => {
      const prev = read()
      const next: ConsentState = { id: prev?.id ?? uuid(), v: BANNER_VERSION, ...choice, t: Date.now() }
      write(next)
      setState(next)
      setBannerOpen(false)
      setSettingsOpen(false)
      void fetch("/api/consent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        keepalive: true,
        body: JSON.stringify({ eventId: uuid(), consentId: next.id, action, source, lang, path: location.pathname, ...choice }),
      }).catch(() => {})
      // Cofnięcie zgody: przeładowanie usuwa załadowane skrypty (Vercel Analytics, ramka Cal.com).
      const withdrew = (prev?.analytics && !choice.analytics) || (prev?.external && !choice.external) || (prev?.marketing && !choice.marketing)
      if (withdrew) setTimeout(() => location.reload(), 150)
    },
    [lang],
  )

  const grant = useCallback(
    (cat: "external") => {
      const cur = read()
      save({ analytics: !!cur?.analytics, marketing: !!cur?.marketing, external: cat === "external" ? true : !!cur?.external }, "custom", "settings")
    },
    [save],
  )

  const all = { analytics: true, marketing: true, external: true }
  const none = { analytics: false, marketing: false, external: false }
  const btn = "min-h-12 flex-1 rounded-full px-5 text-[15px] font-semibold border-2 border-[#1d1d1f] transition-colors"

  return (
    <ConsentCtx.Provider value={{ state, ready, open: () => window.dispatchEvent(new Event("consent:open")), grant }}>
      {children}
      {state?.analytics && <Analytics />}
      {ready && noFooter && state && (
        <button
          type="button"
          onClick={() => window.dispatchEvent(new Event("consent:open"))}
          className="fixed bottom-3 left-3 z-[90] rounded-full bg-black/70 px-3 py-1.5 text-[12px] font-semibold text-white backdrop-blur"
        >
          Ustawienia cookies
        </button>
      )}

      {bannerOpen && !settingsOpen && (
        <div role="dialog" aria-modal="false" aria-labelledby="consent-title" className="fixed inset-x-3 bottom-3 z-[100] mx-auto max-w-[720px] rounded-[24px] bg-white p-5 text-[#1d1d1f] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.45)] md:p-6">
          <h2 id="consent-title" className="text-[17px] font-bold">Pliki cookies i podobne technologie</h2>
          <p className="mt-2 text-[15px] leading-[1.5] text-[#3a3a3f]">
            Wiktoria Skopek używa niezbędnych plików, żeby strona i zakupy działały. Za Twoją zgodą włączymy też statystyki odwiedzin (Vercel Analytics)
            i kalendarz rezerwacji (Cal.com). Zgodę możesz w każdej chwili zmienić lub cofnąć linkiem „Ustawienia cookies” w stopce, a zapisywanie plików
            ograniczyć też w przeglądarce. Strona i zakup działają także po odrzuceniu. Szczegóły: <Link href="/pl/polityka-prywatnosci" className="underline">Polityka prywatności</Link>.
          </p>
          <div className="mt-4 flex flex-col gap-2 sm:flex-row">
            <button type="button" className={`${btn} bg-[#1d1d1f] text-white`} onClick={() => save(all, "accept_all", "banner")}>Akceptuję wszystkie</button>
            <button type="button" className={`${btn} bg-[#1d1d1f] text-white`} onClick={() => save(none, "reject_all", "banner")}>Odrzucam wszystkie</button>
            <button type="button" className={`${btn} bg-white`} onClick={() => { setDraft(none); setSettingsOpen(true) }}>Ustawienia</button>
          </div>
        </div>
      )}

      {settingsOpen && (
        <div className="fixed inset-0 z-[110] grid place-items-center bg-black/50 p-3" role="dialog" aria-modal="true" aria-labelledby="consent-settings-title">
          <div className="max-h-[90dvh] w-full max-w-[640px] overflow-y-auto rounded-[24px] bg-white p-6 text-[#1d1d1f]">
            <h2 id="consent-settings-title" className="text-[21px] font-bold">Ustawienia cookies</h2>
            {[
              { key: null, title: "Niezbędne (zawsze włączone)", text: "Zapamiętanie Twojego wyboru (ws_consent, 6 miesięcy), logowanie do konta MontageFrames (mf_session, httpOnly, 30 dni), płatność w Stripe po przejściu na stronę Stripe. Dostawcy: Vercel (hosting), Stripe." },
              { key: "analytics" as const, title: "Statystyki", text: "Vercel Analytics: liczba odwiedzin i zdarzenia lejka zakupu (np. test zgodności, rozpoczęcie płatności). Bez plików cookies; dane zbiorcze. Dostawca: Vercel Inc. (USA)." },
              { key: "external" as const, title: "Treści zewnętrzne", text: "Kalendarz rezerwacji Cal.com na stronie. Po włączeniu Cal.com może zapisywać własne pliki i odczytywać dane przeglądarki. Dostawca: Cal.com, Inc. (USA)." },
              { key: "marketing" as const, title: "Marketing", text: "Dziś nie używamy żadnych narzędzi reklamowych (np. Piksela Meta). Jeśli je dodamy, zapytamy ponownie." },
            ].map((c) => (
              <div key={c.title} className="mt-5 flex items-start justify-between gap-4 border-t border-black/10 pt-5">
                <div>
                  <h3 className="text-[17px] font-semibold">{c.title}</h3>
                  <p className="mt-1 text-[15px] leading-[1.5] text-[#3a3a3f]">{c.text}</p>
                </div>
                {c.key ? (
                  <input
                    type="checkbox"
                    role="switch"
                    aria-label={c.title}
                    checked={draft[c.key]}
                    onChange={(e) => setDraft((d) => ({ ...d, [c.key!]: e.target.checked }))}
                    className="mt-1 size-6 shrink-0 accent-[#ff6a13]"
                  />
                ) : (
                  <span className="mt-1 text-[15px] font-semibold text-[#5c5c62]">zawsze</span>
                )}
              </div>
            ))}
            <div className="mt-6 flex flex-col gap-2 sm:flex-row">
              <button type="button" className={`${btn} bg-white`} onClick={() => save(draft, state ? (draft.analytics || draft.external || draft.marketing ? "custom" : "withdraw") : "custom", "settings")}>Zapisz wybór</button>
              <button type="button" className={`${btn} bg-[#1d1d1f] text-white`} onClick={() => save(none, state ? "withdraw" : "reject_all", "settings")}>Odrzucam wszystkie</button>
              <button type="button" className={`${btn} bg-[#1d1d1f] text-white`} onClick={() => save(all, "accept_all", "settings")}>Akceptuję wszystkie</button>
            </div>
          </div>
        </div>
      )}
    </ConsentCtx.Provider>
  )
}
