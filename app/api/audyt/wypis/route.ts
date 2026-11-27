import { NextResponse, type NextRequest } from "next/server"
import { clientIp, origin, rateLimited } from "@/lib/mf/server"
import { unsubscribe } from "@/lib/audyt/server"

export const dynamic = "force-dynamic"

// Wypis z porad: przycisk na /audyt/wypis (formularz) albo jedno kliknięcie w programie pocztowym (List-Unsubscribe-Post, ?t=).
export async function POST(request: NextRequest) {
  if (rateLimited(`audyt-wypis:${clientIp(request.headers)}`, 20, 10 * 60_000)) return new NextResponse("Too many requests", { status: 429 })
  const q = request.nextUrl.searchParams.get("t")
  const form = q ? null : await request.formData().catch(() => null)
  const ok = await unsubscribe(String(q ?? form?.get("t") ?? ""))
  if (q) return new NextResponse(ok ? "OK" : "Not found", { status: ok ? 200 : 404 })
  return NextResponse.redirect(`${origin()}/audyt/gotowe?s=${ok ? "wypis" : "link"}`, 303)
}
