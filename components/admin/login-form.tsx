"use client"

import { useState } from "react"

export function AdminLoginForm() {
  const [email, setEmail] = useState("")
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null)
  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault()
        setBusy(true)
        setMsg(null)
        try {
          const res = await fetch("/api/admin/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) })
          const data = await res.json().catch(() => ({}))
          setMsg(res.ok ? { ok: true, text: data.message } : { ok: false, text: data.error || "Coś poszło nie tak. Spróbuj ponownie." })
        } catch {
          setMsg({ ok: false, text: "Brak połączenia. Spróbuj ponownie." })
        } finally {
          setBusy(false)
        }
      }}
      className="flex flex-col gap-4"
    >
      <label className="flex flex-col gap-2 text-[15px] font-semibold">
        E-mail
        <input
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="min-h-12 rounded-2xl bg-[var(--mf-surface)] px-4 text-[16px] font-normal outline-none focus:ring-2 focus:ring-[var(--mf-accent)]"
        />
      </label>
      <button type="submit" disabled={busy} className="min-h-12 rounded-full bg-[var(--mf-accent)] px-6 text-[16px] font-bold text-[var(--mf-on-accent)] disabled:opacity-60">
        {busy ? "Wysyłam…" : "Wyślij link do logowania"}
      </button>
      {msg && (
        <p role={msg.ok ? "status" : "alert"} className={`text-[15px] ${msg.ok ? "text-[var(--mf-ink-2)]" : "font-semibold text-[var(--mf-danger)]"}`}>
          {msg.text}
        </p>
      )}
    </form>
  )
}
