// ScrapeCreators (https://docs.scrapecreators.com): profil i rolki publicznego konta. 1 kredyt za zapytanie.
// Pliki wideo bierzemy z linków CDN Instagrama zwróconych w liście rolek (0 kredytów), a nie przez download_media (10 kredytów).
// Nigdy nie płacimy: odpowiedź 402 (Machine Payments) traktujemy jak brak kredytów i kończymy.
import type { IgMedia, IgProfile } from "../core.ts"
import type { CostGuard } from "./config.ts"

type Env = Record<string, string | undefined>
const BASE = "https://api.scrapecreators.com"

export type ScReel = { code: string; timestamp: string; views: number | null; likes: number | null; comments: number | null; caption: string | null; duration: number | null; videoUrl: string | null; permalink: string }
export type ScProfile = { profile: IgProfile; userId: string | null; isPrivate: boolean; isBusiness: boolean | null; reels: ScReel[] }
export type ScResult<T> = { ok: true; data: T } | { ok: false; reason: "brak_klucza" | "brak_kredytow" | "limit_audytu" | "nie_znaleziono" | "prywatny" | "blad"; detail?: string }

const n = (v: unknown): number | null => (typeof v === "number" && Number.isFinite(v) ? v : typeof v === "string" && v.trim() !== "" && Number.isFinite(Number(v)) ? Number(v) : null)
const iso = (sec: unknown, isoStr?: unknown) => (typeof isoStr === "string" && isoStr ? isoStr : n(sec) !== null ? new Date((n(sec) as number) * 1000).toISOString() : "")
const cap = (c: unknown): string | null => (typeof c === "string" ? c : c && typeof c === "object" && typeof (c as { text?: unknown }).text === "string" ? (c as { text: string }).text : null)

async function call(path: string, params: Record<string, string>, guard: CostGuard, env: Env, fetchImpl: typeof fetch): Promise<ScResult<Record<string, unknown>>> {
  const key = env.SCRAPECREATORS_API_KEY
  if (!key) return { ok: false, reason: "brak_klucza" }
  if (!guard.canCredits(1)) return { ok: false, reason: "limit_audytu" }
  const url = `${BASE}${path}?${new URLSearchParams(params)}`
  let r: Response
  try {
    r = await fetchImpl(url, { headers: { "x-api-key": key }, signal: AbortSignal.timeout(45_000) })
  } catch (e) {
    return { ok: false, reason: "blad", detail: e instanceof Error ? e.message : "fetch" }
  }
  const body = (await r.json().catch(() => ({}))) as Record<string, unknown>
  if (r.status === 402) return { ok: false, reason: "brak_kredytow" }
  if (r.status === 404) return { ok: false, reason: "nie_znaleziono" }
  if (!r.ok || body.success === false) return { ok: false, reason: "blad", detail: `${r.status} ${String(body.message ?? body.error ?? "").slice(0, 120)}` }
  // Zapytanie z pamięci podręcznej dostawcy nic nie kosztuje (credits_charged: 0).
  guard.addCredits(n(body.credits_charged) ?? 1)
  return { ok: true, data: body }
}

/** Rolka z listy (pola bywają w `item.media` albo bezpośrednio w `item`). */
export function mapReel(item: Record<string, unknown>): ScReel | null {
  const m = ((item.media as Record<string, unknown>) ?? item) as Record<string, unknown>
  const code = String(m.code ?? m.shortcode ?? "")
  if (!code) return null
  const versions = (m.video_versions as { url?: string; width?: number }[] | undefined) ?? []
  // Najmniejsza wersja wystarczy do oceny i oszczędza tokeny i transfer.
  const smallest = [...versions].filter((v) => v.url).sort((a, b) => (a.width ?? 9999) - (b.width ?? 9999))[0]
  return {
    code,
    timestamp: iso(m.taken_at, m.created_at),
    views: n(m.play_count) ?? n(m.ig_play_count) ?? n(m.view_count) ?? n(m.video_view_count),
    likes: n(m.like_count),
    comments: n(m.comment_count),
    caption: cap(m.caption),
    duration: n(m.video_duration),
    videoUrl: smallest?.url ?? (typeof m.video_url === "string" ? m.video_url : null),
    permalink: `https://www.instagram.com/reel/${code}/`,
  }
}

/** Posty z profilu (do kryterium 4: udział rolek w 12 ostatnich publikacjach). */
export function mapTimeline(user: Record<string, unknown>): IgMedia[] {
  const edges = ((user.edge_owner_to_timeline_media as { edges?: { node: Record<string, unknown> }[] } | undefined)?.edges ?? [])
  return edges.map(({ node }) => {
    const isVideo = node.is_video === true || node.__typename === "GraphVideo" || node.__typename === "XDTGraphVideo"
    const clip = node.product_type === "clips"
    const capEdges = (node.edge_media_to_caption as { edges?: { node: { text: string } }[] } | undefined)?.edges
    return {
      timestamp: iso(node.taken_at_timestamp),
      media_type: isVideo ? "VIDEO" : node.__typename === "GraphSidecar" || node.__typename === "XDTGraphSidecar" ? "CAROUSEL_ALBUM" : "IMAGE",
      media_product_type: clip ? "REELS" : "FEED",
      like_count: n((node.edge_liked_by as { count?: number })?.count) ?? n((node.edge_media_preview_like as { count?: number })?.count),
      comments_count: n((node.edge_media_to_comment as { count?: number })?.count),
      view_count: n(node.video_view_count),
      caption: capEdges?.[0]?.node.text ?? null,
      permalink: typeof node.shortcode === "string" ? `https://www.instagram.com/p/${node.shortcode}/` : null,
    } satisfies IgMedia
  }).filter((m) => m.timestamp)
}

/** Profil + rolki (2 kredyty). Zwraca IgProfile gotowy dla computeMetrics (10 kryteriów) i listę rolek z linkami do wideo. */
export async function fetchProfile(handle: string, guard: CostGuard, env: Env = process.env, fetchImpl: typeof fetch = fetch): Promise<ScResult<ScProfile>> {
  const p = await call("/v1/instagram/profile", { handle }, guard, env, fetchImpl)
  if (!p.ok) return p
  const user = ((p.data.data as { user?: Record<string, unknown> } | undefined)?.user ?? null)
  if (!user) return { ok: false, reason: "nie_znaleziono" }
  const isPrivate = user.is_private === true
  const followers = n((user.edge_followed_by as { count?: number })?.count) ?? 0
  const mediaCount = n((user.edge_owner_to_timeline_media as { count?: number })?.count) ?? 0
  const timeline = mapTimeline(user)
  const base: IgProfile = { username: String(user.username ?? handle), name: (user.full_name as string) ?? null, biography: (user.biography as string) ?? null, website: (user.external_url as string) ?? null, followers_count: followers, media_count: mediaCount, media: timeline }
  const userId = user.id ? String(user.id) : null
  if (isPrivate) return { ok: true, data: { profile: base, userId, isPrivate, isBusiness: (user.is_business_account as boolean) ?? null, reels: [] } }
  const r = await call("/v1/instagram/user/reels", userId ? { user_id: userId } : { handle }, guard, env, fetchImpl)
  const items = r.ok ? ((r.data.items as Record<string, unknown>[]) ?? []) : []
  const reels = items.map(mapReel).filter((x): x is ScReel => Boolean(x)).sort((a, b) => +new Date(b.timestamp) - +new Date(a.timestamp))
  // Scalanie: rolki z listy rolek mają wyświetlenia; posty z profilu dają pełny przekrój publikacji.
  const byCode = new Map(reels.map((x) => [x.code, x]))
  const media: IgMedia[] = timeline.map((m) => {
    const code = m.permalink?.split("/").filter(Boolean).pop()
    const rr = code ? byCode.get(code) : undefined
    return rr ? { ...m, media_product_type: "REELS", media_type: "VIDEO", view_count: rr.views ?? m.view_count, like_count: rr.likes ?? m.like_count, comments_count: rr.comments ?? m.comments_count, caption: m.caption ?? rr.caption } : m
  })
  const seen = new Set(media.map((m) => m.permalink?.split("/").filter(Boolean).pop()))
  for (const x of reels) if (!seen.has(x.code)) media.push({ timestamp: x.timestamp, media_type: "VIDEO", media_product_type: "REELS", view_count: x.views, like_count: x.likes, comments_count: x.comments, caption: x.caption, permalink: x.permalink })
  return { ok: true, data: { profile: { ...base, media }, userId, isPrivate, isBusiness: (user.is_business_account as boolean) ?? null, reels } }
}

/** Podpis rolki, gdy lista rolek go nie zwraca (1 kredyt). */
export async function fetchCaption(permalink: string, guard: CostGuard, env: Env = process.env, fetchImpl: typeof fetch = fetch): Promise<string | null> {
  const r = await call("/v1/instagram/post", { url: permalink, include_play_count: "false", trim: "true" }, guard, env, fetchImpl)
  if (!r.ok) return null
  const media = ((r.data.data as { xdt_shortcode_media?: Record<string, unknown> } | undefined)?.xdt_shortcode_media ?? {}) as Record<string, unknown>
  const edges = (media.edge_media_to_caption as { edges?: { node: { text: string } }[] } | undefined)?.edges
  return edges?.[0]?.node.text ?? cap(media.caption)
}

/** Pobiera plik wideo z CDN (bez kredytów) z limitem rozmiaru. Pliku nie zapisujemy: tylko bufor w pamięci na czas analizy. */
export async function downloadVideo(url: string, maxBytes: number, fetchImpl: typeof fetch = fetch): Promise<{ ok: true; bytes: Uint8Array; mime: string } | { ok: false; reason: string }> {
  try {
    const r = await fetchImpl(url, { signal: AbortSignal.timeout(45_000) })
    if (!r.ok || !r.body) return { ok: false, reason: `http ${r.status}` }
    const len = Number(r.headers.get("content-length") ?? 0)
    if (len > maxBytes) return { ok: false, reason: "za_duzy" }
    const reader = r.body.getReader()
    const chunks: Uint8Array[] = []
    let size = 0
    for (;;) {
      const { done, value } = await reader.read()
      if (done) break
      size += value.byteLength
      if (size > maxBytes) { await reader.cancel(); return { ok: false, reason: "za_duzy" } }
      chunks.push(value)
    }
    const bytes = new Uint8Array(size)
    let o = 0
    for (const c of chunks) { bytes.set(c, o); o += c.byteLength }
    return { ok: true, bytes, mime: (r.headers.get("content-type") ?? "video/mp4").split(";")[0] }
  } catch (e) {
    return { ok: false, reason: e instanceof Error ? e.message : "fetch" }
  }
}
