import { redirect } from "next/navigation"
import { MF_BASE_PATH } from "./config.ts"
import { hasActiveOrder, sql } from "./db.ts"
import { currentBuyer, mfEnv } from "./server.ts"

/** Strony tylko dla kupujących: bez sesji albo bez aktywnego zakupu → przekierowanie do logowania. */
export async function requireBuyer() {
  if (mfEnv().disabled) redirect(`${MF_BASE_PATH}/konto`)
  const email = await currentBuyer()
  if (!email || !(await hasActiveOrder(sql(), email))) redirect(`${MF_BASE_PATH}/konto`)
  return email
}
