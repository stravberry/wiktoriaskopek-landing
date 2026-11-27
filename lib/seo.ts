// Adresy kanoniczne i wersje językowe strony Wiktorii. Polski jest w katalogu głównym (wiktoriaskopek.pl/podstrona, lib/routes.ts).
// /en/* pokazuje dziś tę samą polską treść, więc canonical wskazuje polski adres, a hreflang zna tylko pl-PL (x-default też PL).
// Gdy powstanie angielska treść, dopisz tu "en-US": `${SITE}/en${path}` i dodaj /en do sitemap.
export const SITE = "https://www.wiktoriaskopek.pl"

export function pageAlternates(path: string) {
  const pl = `${SITE}${path}`
  return { canonical: pl, languages: { "pl-PL": pl, "x-default": pl } }
}
