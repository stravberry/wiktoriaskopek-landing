import { Resend } from "resend"

if (!process.env.RESEND_API_KEY) {
  console.warn(
    "⚠️  RESEND_API_KEY is not set. Email sending will not work."
  )
}

export const resend = new Resend(process.env.RESEND_API_KEY)

export const emailConfig = {
  from: process.env.EMAIL_FROM || "kontakt@wiktoriaskopek.pl",
  to: process.env.EMAIL_TO || "wskopek.all@gmail.com",
  baseUrl: "https://wiktoriaskopek.pl",
} as const
