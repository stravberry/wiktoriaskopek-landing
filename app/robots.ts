import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/_next/", "/static/", "/pl/montuj-bez-montazysty/konto", "/pl/montuj-bez-montazysty/poradnik", "/pl/montuj-bez-montazysty/dziekujemy"],
    },
    sitemap: "https://wiktoriaskopek.pl/sitemap.xml",
  }
}
