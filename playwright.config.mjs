// Test układu na telefonie i komputerze (tests-e2e/). W CI startuje zbudowaną stronę (next start).
import { defineConfig } from "@playwright/test"

export default defineConfig({
  testDir: "tests-e2e",
  testMatch: /.*\.spec\.mjs/,
  timeout: 90_000,
  workers: process.env.CI ? 2 : 4,
  reporter: process.env.CI ? "github" : "list",
  use: { baseURL: process.env.LAYOUT_BASE_URL || "http://localhost:3100", browserName: "chromium", launchOptions: process.env.PW_CHROMIUM ? { executablePath: process.env.PW_CHROMIUM } : {} },
  webServer: process.env.LAYOUT_BASE_URL ? undefined : { command: "npx next start -p 3100", url: "http://localhost:3100/pl", timeout: 120_000, reuseExistingServer: true },
})
