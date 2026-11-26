import type { MetadataRoute } from "next"
import { locales } from "@/lib/translations"

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://www.wiktoriaskopek.pl"
  
  // Base localized routes
  const routes = locales.flatMap((lang) => [
    {
      url: `${baseUrl}/${lang}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/${lang}/konsultacje`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/${lang}/portfolio`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/${lang}/techno`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/${lang}/youtube`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    {
       url: `${baseUrl}/${lang}/transmisje-live`,
       lastModified: new Date(),
       changeFrequency: "monthly" as const,
       priority: 0.7,
    }
  ])

  return [
    ...routes,
    { url: `${baseUrl}/pl/montuj-bez-montazysty`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.9 },
    { url: `${baseUrl}/pl/montuj-bez-montazysty/proba`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${baseUrl}/pl/montuj-bez-montazysty/regulamin`, lastModified: new Date(), changeFrequency: "yearly" as const, priority: 0.3 },
    { url: `${baseUrl}/pl/polityka-prywatnosci`, lastModified: new Date(), changeFrequency: "yearly" as const, priority: 0.2 },
  ]
}
