// Poradnik MontageFrames (strony za logowaniem). Treść jest w bazie (tabela mf_content, klucz "poradnik"), nie w repo:
// repo jest publiczne, a poradnik płatny (przegląd bezpieczeństwa 26.11, S3). Edycja treści: update mf_content w Supabase.
import { cache } from "react"
import { sql } from "./db.ts"

export type Block = { p: string } | { code: string } | { list: string[] } | { img: string; alt: string } | { todo: string }
export type Chapter = { slug: string; title: string; lead: string; blocks: Block[] }

/** Rozdziały poradnika z bazy; jedno zapytanie na żądanie. Brak bazy albo wpisu = pusty poradnik. */
export const getChapters = cache(async (): Promise<Chapter[]> => {
  try {
    const [row] = await sql()`select body from mf_content where key = 'poradnik'`
    return Array.isArray(row?.body) ? (row.body as Chapter[]) : []
  } catch (e) {
    console.error("[mf] poradnik load failed:", e instanceof Error ? e.message : e)
    return []
  }
})
