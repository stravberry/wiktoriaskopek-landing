import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { resolveRoute } from "@/lib/routes"

// Polski w katalogu głównym (rewrite na app/[lang]=pl), stare /pl/* i usunięte podstrony → 301 z zachowaniem query (UTM).
export function proxy(request: NextRequest) {
  const decision = resolveRoute(request.nextUrl.pathname)
  if (decision.type === "next") return NextResponse.next()
  const url = request.nextUrl.clone()
  url.pathname = decision.to
  return decision.type === "redirect" ? NextResponse.redirect(url, 301) : NextResponse.rewrite(url)
}

export const config = {
  matcher: ["/((?!_next|api|images|favicon|.*\\.).*)"],
}
