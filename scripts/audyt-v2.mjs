#!/usr/bin/env node
// Audyt IG v2: testy z RESEARCH-AUDYT-IG.md (sekcja 8) i przykładowy audyt. Klucze tylko ze zmiennych środowiska, nic ich nie drukuje.
//   node scripts/audyt-v2.mjs test3 <plik.mp4>            Gemini na 1 rolce: tokeny i koszt        (GEMINI_API_KEY)
//   node scripts/audyt-v2.mjs test4 <profil>              ScrapeCreators: 1 profil + 1 rolka (wideo z CDN) (SCRAPECREATORS_API_KEY)
//   node scripts/audyt-v2.mjs audit <profil> [konkurent,konkurent] > audyt.md   pełny audyt v2 (oba klucze)
//   node scripts/audyt-v2.mjs meta1 <profil_firmowy>      Business Discovery: czy są view_count i like_count  (META_IG_USER_ID, META_ACCESS_TOKEN)
//   node scripts/audyt-v2.mjs meta2                       własne konto: 12 rolek + Insights (zasięg, wyświetlenia, czas oglądania)
import fs from "node:fs"
import { CostGuard, v2Config } from "../lib/audyt/v2/config.ts"
import { analyzeReel } from "../lib/audyt/v2/gemini.ts"
import { downloadVideo, fetchProfile } from "../lib/audyt/v2/scrape.ts"
import { runAuditV2, renderMarkdown } from "../lib/audyt/v2/engine.ts"

const [cmd, arg, arg2] = process.argv.slice(2)
const env = process.env
const out = (o) => console.log(JSON.stringify(o, null, 2))
const GRAPH = `https://graph.facebook.com/${env.META_GRAPH_VERSION || "v27.0"}`
const meta = async (path, params = {}) => {
  const r = await fetch(`${GRAPH}/${path}?${new URLSearchParams(params)}`, { headers: { Authorization: `Bearer ${env.META_ACCESS_TOKEN}` } })
  return { status: r.status, body: await r.json().catch(() => ({})) }
}

if (cmd === "test3") {
  const bytes = new Uint8Array(fs.readFileSync(arg))
  const guard = new CostGuard(v2Config(env))
  const seconds = Number(arg2 || 30)
  const t0 = Date.now()
  const r = await analyzeReel({ bytes, mime: "video/mp4", seconds }, guard, env)
  out({ test: 3, plik: arg.split("/").pop(), sekundy: seconds, model: guard.cfg.model, ms: Date.now() - t0, ok: r.ok, powod: r.ok ? null : r.reason, szczegol: r.ok ? null : r.detail ?? null, tokeny_wejscie: r.inTok ?? 0, tokeny_wyjscie: r.outTok ?? 0, koszt_usd: guard.summary().usd, ocena: r.ok ? r.analysis : null })
} else if (cmd === "test4") {
  const guard = new CostGuard(v2Config(env))
  const p = await fetchProfile(arg, guard, env)
  if (!p.ok) { out({ test: 4, ok: false, powod: p.reason, szczegol: p.detail ?? null, kredyty: guard.credits }); process.exit(1) }
  const reel = p.data.reels.find((x) => x.videoUrl)
  const v = reel ? await downloadVideo(reel.videoUrl, guard.cfg.maxVideoBytes) : { ok: false, reason: "brak rolki z wideo" }
  if (v.ok && arg2) fs.writeFileSync(arg2, v.bytes)
  out({
    test: 4, ok: true, profil: p.data.profile.username, obserwujacy: p.data.profile.followers_count, publikacje: p.data.profile.media_count,
    firmowe: p.data.isBusiness, prywatne: p.data.isPrivate, posty_w_odpowiedzi: p.data.profile.media.length, rolki_w_odpowiedzi: p.data.reels.length,
    rolki_z_wyswietleniami: p.data.reels.filter((x) => x.views !== null).length, rolki_z_plikiem: p.data.reels.filter((x) => x.videoUrl).length,
    rolka: reel ? { code: reel.code, wyswietlenia: reel.views, sekundy: reel.duration, wideo_mb: v.ok ? Math.round((v.bytes.byteLength / 1048576) * 10) / 10 : null, wideo: v.ok ? "pobrane z CDN (0 kredytów)" : v.reason } : null,
    kredyty: guard.credits, koszt_usd_po_cenie_paczki: guard.summary().usd,
  })
} else if (cmd === "audit") {
  const competitors = arg2 ? arg2.split(",").map((s) => s.trim().replace(/^@/, "")).filter(Boolean) : []
  const o = await runAuditV2({ handle: arg.replace(/^@/, ""), competitors }, env)
  if (!o.ok) { console.error(JSON.stringify(o)); process.exit(1) }
  console.log(renderMarkdown(o))
  console.error(JSON.stringify({ koszt: o.cost, pominiete: o.skipped }))
} else if (cmd === "meta1") {
  const fields = `business_discovery.username(${arg}){username,followers_count,media_count,media.limit(12){media_product_type,like_count,comments_count,view_count,timestamp,permalink}}`
  const r = await meta(env.META_IG_USER_ID, { fields })
  const media = r.body.business_discovery?.media?.data ?? []
  const reels = media.filter((m) => m.media_product_type === "REELS")
  out({ test: 1, status: r.status, blad: r.body.error?.message ?? null, profil: r.body.business_discovery?.username ?? null, rolki: reels.length,
    view_count: `${reels.filter((m) => typeof m.view_count === "number").length}/${reels.length}`, like_count: `${reels.filter((m) => typeof m.like_count === "number").length}/${reels.length}`,
    przyklad: reels[0] ? { view_count: reels[0].view_count ?? null, like_count: reels[0].like_count ?? null } : null })
} else if (cmd === "meta2") {
  const list = await meta(`${env.META_IG_USER_ID}/media`, { fields: "id,media_product_type,timestamp,permalink", limit: "30" })
  const reels = (list.body.data ?? []).filter((m) => m.media_product_type === "REELS").slice(0, 12)
  const rows = []
  for (const m of reels) {
    const i = await meta(`${m.id}/insights`, { metric: "reach,views,ig_reels_avg_watch_time,ig_reels_video_view_total_time,likes,comments,saved,shares" })
    rows.push({ data: m.timestamp?.slice(0, 10), status: i.status, blad: i.body.error?.message ?? null, ...Object.fromEntries((i.body.data ?? []).map((d) => [d.name, d.values?.[0]?.value ?? d.total_value?.value ?? null])) })
  }
  out({ test: 2, status: list.status, blad: list.body.error?.message ?? null, rolek: reels.length, insights: rows })
} else {
  console.error("Użycie: test3 <plik> [sekundy] | test4 <profil> [zapisz.mp4] | audit <profil> [konkurenci] | meta1 <profil> | meta2")
  process.exit(2)
}
