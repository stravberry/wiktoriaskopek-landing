// ESLint (flat config) z regułami Next (core-web-vitals + TypeScript). Uzgodnione z Coding Builderem 26.11:
// błędy blokują tylko kod sklepu i stron (app/, lib/, components/mf/, proxy.ts) — patrz skrypt "lint" w package.json.
import { defineConfig, globalIgnores } from "eslint/config"
import nextVitals from "eslint-config-next/core-web-vitals"
import nextTs from "eslint-config-next/typescript"

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([".next/**", "out/**", "build/**", "node_modules/**", "next-env.d.ts", "public/**"]),
])
