import type { MetadataRoute } from "next"
import { locales } from "@/lib/translations"

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://wiktoriaskopek.pl"
  
  // Base localized routes
  const routes = locales.flatMap((lang) => [
    {
      url: `${baseUrl}/${lang}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 1,
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

  return routes
}
