import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/_next/", "/static/", "/admin", "/montuj-bez-montazysty/konto", "/montuj-bez-montazysty/poradnik", "/montuj-bez-montazysty/dziekujemy", "/montuj-bez-montazysty/dev/"],
    },
    sitemap: "https://www.wiktoriaskopek.pl/sitemap.xml",
  }
}
