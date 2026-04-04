import { Resend } from "resend"

const apiKey = process.env.RESEND_API_KEY

if (!apiKey) {
  console.warn(
    "⚠️  RESEND_API_KEY is not set. Email sending will not work."
  )
}

// Pass a dummy key if missing to prevent constructor from throwing during build
// The API route already checks if the key is real before sending.
export const resend = new Resend(apiKey || "re_placeholder_for_build")

export const emailConfig = {
  from: process.env.EMAIL_FROM || "kontakt@wiktoriaskopek.pl",
  to: process.env.EMAIL_TO || "wskopek.all@gmail.com",
  baseUrl: "https://wiktoriaskopek.pl",
} as const
