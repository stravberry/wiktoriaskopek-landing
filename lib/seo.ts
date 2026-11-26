// Adresy kanoniczne i wersje językowe strony głównej Wiktorii.
// /en/* pokazuje dziś tę samą polską treść co /pl/*, więc canonical zawsze wskazuje /pl, a hreflang zna tylko pl-PL
// (x-default też na /pl). Gdy powstanie angielska treść, dopisz tu "en-US" i przywróć /en w sitemap.
export const SITE = "https://www.wiktoriaskopek.pl"

export function pageAlternates(path: string) {
  const pl = `${SITE}/pl${path}`
  return { canonical: pl, languages: { "pl-PL": pl, "x-default": pl } }
}
