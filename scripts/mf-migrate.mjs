// Uruchamia migracje z db/migrations na DATABASE_URL. Bezpieczne przy wielokrotnym uruchomieniu (SQL idempotentny).
// Użycie: DATABASE_URL=postgres://… node scripts/mf-migrate.mjs
import { readdirSync, readFileSync } from "node:fs"
import { join } from "node:path"
import postgres from "postgres"

const url = process.env.DATABASE_URL
if (!url) {
  console.error("DATABASE_URL is missing")
  process.exit(1)
}
const db = postgres(url, { max: 1, prepare: false, onnotice: () => {} })
const dir = join(import.meta.dirname, "..", "db", "migrations")
try {
  for (const f of readdirSync(dir).filter((x) => x.endsWith(".sql")).sort()) {
    await db.unsafe(readFileSync(join(dir, f), "utf-8"))
    console.log(`applied ${f}`)
  }
} finally {
  await db.end()
}
