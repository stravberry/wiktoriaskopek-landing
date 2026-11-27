import type { MetadataRoute } from "next"
import { SITE } from "../lib/seo.ts"

// Tylko polskie adresy w katalogu głównym (porządki 27.11). /en ma dziś tę samą treść i canonical na polski adres.
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  return [
    { url: SITE, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE}/montuj-bez-montazysty`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE}/konsultacje`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE}/montuj-bez-montazysty/regulamin`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE}/polityka-prywatnosci`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
  ]
}
