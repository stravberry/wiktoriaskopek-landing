// Test tras (CI, 27.11): stare adresy → 301 → strona 200; nowe adresy bez /pl odpowiadają 200; query (UTM) przechodzi dalej.
import { test, expect } from "@playwright/test"

const REDIRECTS = {
  "/pl": "/",
  "/pl/montuj-bez-montazysty": "/montuj-bez-montazysty",
  "/pl/montuj-bez-montazysty/regulamin": "/montuj-bez-montazysty/regulamin",
  "/pl/polityka-prywatnosci": "/polityka-prywatnosci",
  "/pl/regulamin": "/regulamin",
  "/pl/odstapienie": "/odstapienie",
  "/pl/konsultacje": "/konsultacje",
  "/pl/portfolio": "/",
  "/pl/blog": "/",
  "/pl/transmisje-live": "/",
  "/pl/old-mainpage": "/",
  "/portfolio": "/",
  "/en/portfolio": "/en",
  "/pl/formaty-eksperckie": "/konsultacje",
  "/pl/kursy-online": "/montuj-bez-montazysty",
}
const OK = ["/", "/montuj-bez-montazysty", "/montuj-bez-montazysty/regulamin", "/polityka-prywatnosci", "/regulamin", "/odstapienie", "/konsultacje", "/en", "/sitemap.xml", "/robots.txt", "/llms.txt"]

for (const [from, to] of Object.entries(REDIRECTS)) {
  test(`301 ${from} → ${to}`, async ({ request }) => {
    const r = await request.get(from, { maxRedirects: 0 })
    expect(r.status()).toBe(301)
    expect(new URL(r.headers()["location"], "http://x").pathname).toBe(to)
    expect((await request.get(to)).status()).toBe(200)
  })
}

for (const path of OK) {
  test(`200 ${path}`, async ({ request }) => {
    expect((await request.get(path, { maxRedirects: 0 })).status()).toBe(200)
  })
}

test("UTM przechodzi przez 301 (/proba → próba)", async ({ request }) => {
  const r = await request.get("/proba?utm_source=ig&utm_campaign=bio", { maxRedirects: 0 })
  expect(r.status()).toBe(301)
  expect(r.headers()["location"]).toContain("/montuj-bez-montazysty/proba?utm_source=ig&utm_campaign=bio")
})

test("nieznany adres: 404, bez przekierowania", async ({ request }) => {
  expect((await request.get("/nie-ma-takiej-strony", { maxRedirects: 0 })).status()).toBe(404)
})
