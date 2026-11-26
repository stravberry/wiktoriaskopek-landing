// Test układu (CI): strony MontageFrames w 320–1280 px bez overflow, uciętych słów, małych celów dotyku i zasłoniętych kontrolek.
// Kroki próby sprawdzamy na /dev/proba-ui (przykładowe dane, bez bazy; na produkcji 404).
import { test, expect } from "@playwright/test"
import { measureLayout } from "./measure.mjs"

const PAGES = [
  "/pl/montuj-bez-montazysty",
  "/pl/montuj-bez-montazysty/dev/proba-ui",
  "/pl/montuj-bez-montazysty/regulamin",
  "/pl/odstapienie",
]
const WIDTHS = [320, 360, 390, 430, 768, 1280]

for (const path of PAGES) {
  for (const width of WIDTHS) {
    test(`${path} @ ${width}px`, async ({ browser }) => {
      const mobile = width < 768
      const ctx = await browser.newContext({ viewport: { width, height: 800 }, isMobile: mobile, hasTouch: mobile, locale: "pl-PL" })
      const page = await ctx.newPage()
      await page.goto(path, { waitUntil: "domcontentloaded" })
      await page.getByRole("button", { name: "Odrzucam wszystkie" }).click({ timeout: 3000 }).catch(() => {})
      await page.waitForTimeout(800)
      const issues = []
      const height = await page.evaluate(() => document.documentElement.scrollHeight)
      for (let y = 0; y < height; y += 700) {
        await page.evaluate((yy) => window.scrollTo(0, yy), y)
        await page.waitForTimeout(120)
        issues.push(...(await page.evaluate(measureLayout)))
      }
      const unique = [...new Map(issues.map((i) => [JSON.stringify(i), i])).values()]
      await ctx.close()
      expect(unique, JSON.stringify(unique, null, 2)).toEqual([])
    })
  }
}
