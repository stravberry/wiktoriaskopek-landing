import { NextResponse } from "next/server"
import { MF_BASE_PATH } from "@/lib/mf/config"
import { origin, SESSION_COOKIE } from "@/lib/mf/server"

export const dynamic = "force-dynamic"

export async function POST() {
  const res = NextResponse.redirect(`${origin()}${MF_BASE_PATH}/konto`, 303)
  res.cookies.set(SESSION_COOKIE, "", { path: "/", maxAge: 0 })
  return res
}
