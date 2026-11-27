// Meta Business Discovery: publiczne dane kont firmowych i twórców, przez konto profesjonalne IG Wiktorii i jej aplikację Meta.
// Konfiguracja (Vercel, Production): META_IG_USER_ID (ID konta IG Wiktorii), META_ACCESS_TOKEN (token systemowy, sensitive).
// Konta osobiste (prywatne) i z ograniczeniem wieku API nie zwraca: wtedy formularz prosi o 4 liczby.
import { HANDLE_RE, type IgProfile } from "./core.ts"

type Env = Record<string, string | undefined>
export const metaConfigured = (env: Env) => Boolean(env.META_IG_USER_ID && env.META_ACCESS_TOKEN)

export type DiscoveryResult =
  | { ok: true; profile: IgProfile }
  | { ok: false; reason: "nie_znaleziono" | "blad" | "wylaczone"; detail?: string }

const FIELDS = "username,name,biography,website,followers_count,media_count,media.limit(25){caption,comments_count,like_count,media_type,media_product_type,timestamp,permalink,view_count}"

export async function businessDiscovery(handle: string, env: Env = process.env, fetchImpl: typeof fetch = fetch): Promise<DiscoveryResult> {
  if (!metaConfigured(env)) return { ok: false, reason: "wylaczone" }
  if (!HANDLE_RE.test(handle)) return { ok: false, reason: "nie_znaleziono" }
  const version = env.META_GRAPH_VERSION || "v23.0"
  const url = new URL(`https://graph.facebook.com/${version}/${encodeURIComponent(env.META_IG_USER_ID as string)}`)
  url.searchParams.set("fields", `business_discovery.username(${handle}){${FIELDS}}`)
  try {
    // Token w nagłówku, nie w adresie (adresy trafiają do logów).
    const res = await fetchImpl(url, { headers: { Authorization: `Bearer ${env.META_ACCESS_TOKEN}` }, signal: AbortSignal.timeout(10_000), cache: "no-store" })
    const data = (await res.json().catch(() => ({}))) as { business_discovery?: Record<string, unknown>; error?: { code?: number; error_subcode?: number; message?: string } }
    if (!res.ok || data.error) {
      const e = data.error ?? {}
      // 110 / 2207013 / 100: nie ma takiego konta firmowego lub twórcy (osobiste, prywatne, literówka).
      if (e.code === 110 || e.error_subcode === 2207013 || (e.code === 100 && /business|user/i.test(e.message ?? ""))) return { ok: false, reason: "nie_znaleziono" }
      return { ok: false, reason: "blad", detail: `HTTP ${res.status} kod ${e.code ?? "?"}/${e.error_subcode ?? "?"}` }
    }
    const bd = data.business_discovery
    if (!bd) return { ok: false, reason: "nie_znaleziono" }
    const media = ((bd.media as { data?: unknown[] } | undefined)?.data ?? []) as IgProfile["media"]
    return {
      ok: true,
      profile: {
        username: String(bd.username ?? handle),
        name: (bd.name as string) ?? null,
        biography: (bd.biography as string) ?? null,
        website: (bd.website as string) ?? null,
        followers_count: Number(bd.followers_count ?? 0),
        media_count: Number(bd.media_count ?? 0),
        media,
      },
    }
  } catch (e) {
    return { ok: false, reason: "blad", detail: e instanceof Error ? e.name : "fetch" }
  }
}
