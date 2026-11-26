import { NextResponse } from "next/server"
import { MF_BASE_PATH } from "@/lib/mf/config"
import { origin } from "@/lib/mf/server"

export const dynamic = "force-dynamic"

// Dawny „Przejdź do konta” po płatności. Nie loguje: e-mail w Stripe wpisuje płacący i nikt go nie potwierdza,
// więc zakup na cudzy adres dawał sesję tego konta (przegląd bezpieczeństwa 26.11, S1). Logowanie tylko linkiem z maila.
export function GET() {
  return NextResponse.redirect(`${origin()}${MF_BASE_PATH}/konto`)
}
