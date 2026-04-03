import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { resend, emailConfig } from "@/lib/resend"
import ConfirmationEmail from "@/emails/confirmation-email"
import NotificationEmail from "@/emails/notification-email"

// ═══════════════ RATE LIMITING ═══════════════
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()
const RATE_LIMIT_WINDOW = 60 * 1000 // 1 minute
const RATE_LIMIT_MAX = 3 // max 3 requests per minute per IP

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const entry = rateLimitMap.get(ip)

  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW })
    return false
  }

  entry.count++
  return entry.count > RATE_LIMIT_MAX
}

// ═══════════════ VALIDATION SCHEMA ═══════════════
const contactSchema = z.object({
  name: z.string().min(2, "Imię jest wymagane").max(100),
  email: z.string().email("Podaj prawidłowy adres email"),
  phone: z.string().min(6, "Numer telefonu jest wymagany").max(20),
  social: z.string().min(1, "Podaj profil social media lub stronę").max(200),
  revenue: z.string().min(1, "Wybierz zakres przychodów"),
  challenge: z.string().min(10, "Opisz swoje wyzwanie (min. 10 znaków)").max(2000),
  _honey: z.string().max(0, "Bot detected").optional(),
})

// ═══════════════ HANDLER ═══════════════
export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "unknown"

    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: "Zbyt wiele zapytań. Spróbuj ponownie za chwilę." },
        { status: 429 }
      )
    }

    // Parse and validate body
    const body = await request.json()
    const result = contactSchema.safeParse(body)

    if (!result.success) {
      const firstError = result.error.issues[0]?.message || "Nieprawidłowe dane"
      return NextResponse.json({ error: firstError }, { status: 400 })
    }

    const { name, email, phone, social, revenue, challenge, _honey } = result.data

    // Honeypot check
    if (_honey) {
      // Silently succeed for bots
      return NextResponse.json({ success: true })
    }

    const submittedAt = new Intl.DateTimeFormat("pl-PL", {
      dateStyle: "long",
      timeStyle: "short",
      timeZone: "Europe/Warsaw",
    }).format(new Date())

    // Check if API key is configured
    if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY.startsWith("re_XXXX")) {
      console.warn("⚠️  RESEND_API_KEY is not configured. Skipping email send.")
      console.log("📧 Contact form submission:", { name, email, phone, social, revenue, challenge })
      return NextResponse.json({ success: true })
    }

    // Send both emails concurrently
    const [confirmationResult, notificationResult] = await Promise.allSettled([
      // 1. Confirmation email to the sender
      resend.emails.send({
        from: `Wiktoria Skopek <${emailConfig.from}>`,
        to: email,
        subject: `Dziękuję za wiadomość, ${name.split(" ")[0]}! — Wiktoria Skopek`,
        react: ConfirmationEmail({ name }),
      }),

      // 2. Notification email to Wiktoria
      resend.emails.send({
        from: `Formularz kontaktowy <${emailConfig.from}>`,
        to: emailConfig.to,
        replyTo: email,
        subject: `🔔 Nowe zgłoszenie: ${name} [${revenue}]`,
        react: NotificationEmail({
          name,
          email,
          phone,
          social,
          revenue,
          challenge,
          submittedAt,
        }),
      }),
    ])

    // Log any failures (but don't expose to user)
    if (confirmationResult.status === "rejected") {
      console.error("Failed to send confirmation email:", confirmationResult.reason)
    }
    if (notificationResult.status === "rejected") {
      console.error("Failed to send notification email:", notificationResult.reason)
    }

    // If both failed, return error
    if (confirmationResult.status === "rejected" && notificationResult.status === "rejected") {
      return NextResponse.json(
        { error: "Nie udało się wysłać wiadomości. Spróbuj ponownie." },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Contact form error:", error)
    return NextResponse.json(
      { error: "Wystąpił błąd serwera. Spróbuj ponownie." },
      { status: 500 }
    )
  }
}
