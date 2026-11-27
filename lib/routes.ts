// Trasy strony (porządki 27.11, zlecenie Wiktorii przez Dayli): polski w katalogu głównym (wiktoriaskopek.pl/podstrona),
// angielski pod /en. Wewnętrznie strony dalej leżą w app/[lang], więc polskie adresy są rewritem na /pl/*.
// Stare /pl/* i usunięte podstrony dostają 301, żeby linki z zewnątrz nie kończyły się 404.
export type RouteDecision = { type: "next" } | { type: "rewrite"; to: string } | { type: "redirect"; to: string }

/** Usunięte podstrony → najbliższa sensowna strona (polska ścieżka; dla /en "/" znaczy "/en"). */
export const REMOVED_ROUTES: Record<string, string> = {
  blog: "/",
  portfolio: "/",
  linki: "/",
  podcasty: "/",
  youtube: "/",
  "transmisje-live": "/",
  techno: "/",
  "stara-strona": "/",
  "old-mainpage": "/",
  "formaty-eksperckie": "/konsultacje",
  "kursy-online": "/montuj-bez-montazysty",
  proba: "/montuj-bez-montazysty/proba", // krótki adres do bio i reklam
}

const PASS = /^\/(?:api|_next|admin|images)(?:\/|$)/

export function resolveRoute(pathname: string): RouteDecision {
  if (PASS.test(pathname) || pathname.includes(".")) return { type: "next" }
  const parts = pathname.split("/").filter(Boolean)
  const lang = parts[0] === "pl" || parts[0] === "en" ? parts[0] : null
  const rest = lang ? parts.slice(1) : parts
  const removed = rest[0] ? REMOVED_ROUTES[rest[0]] : undefined
  if (removed) return { type: "redirect", to: lang === "en" && removed === "/" ? "/en" : removed }
  if (lang === "pl") return { type: "redirect", to: "/" + rest.join("/") }
  if (lang === "en") return { type: "next" }
  return { type: "rewrite", to: "/pl" + (parts.length ? "/" + parts.join("/") : "") }
}

/** Adres strony w danym języku: polski bez prefiksu, angielski z /en. */
export const localeHref = (lang: string, path = "/") => (lang === "en" ? `/en${path === "/" ? "" : path}` : path)
