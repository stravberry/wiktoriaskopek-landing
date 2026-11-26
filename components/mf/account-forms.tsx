"use client"

import { useState } from "react"
import { Loader2 } from "lucide-react"

const input = "min-h-12 w-full rounded-2xl bg-[var(--h-bg)] px-4 text-[16px] outline-none focus:ring-2 focus:ring-[var(--h-accent)]"
const button = "inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[var(--h-accent)] px-6 text-[16px] font-bold text-[#111111] disabled:opacity-60"

async function post(url: string, body: unknown) {
  const res = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.error || "Coś poszło nie tak. Spróbuj ponownie.")
  return data
}

function useAction() {
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null)
  const run = async (fn: () => Promise<string>) => {
    setBusy(true)
    setMsg(null)
    try {
      setMsg({ ok: true, text: await fn() })
    } catch (e) {
      setMsg({ ok: false, text: e instanceof Error ? e.message : String(e) })
    } finally {
      setBusy(false)
    }
  }
  return { busy, msg, run }
}

function Msg({ msg }: { msg: { ok: boolean; text: string } | null }) {
  if (!msg) return null
  return <p role={msg.ok ? "status" : "alert"} className={`mt-3 text-[15px] ${msg.ok ? "" : "font-semibold text-[var(--h-accent-ink)]"}`}>{msg.text}</p>
}

export function LoginForm() {
  const [email, setEmail] = useState("")
  const { busy, msg, run } = useAction()
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        run(async () => (await post("/api/mf/login", { email })).message)
      }}
    >
      <label className="flex flex-col gap-2 text-[15px] font-semibold">
        E-mail użyty przy zakupie
        <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" className={`${input} font-normal`} />
      </label>
      <button type="submit" disabled={busy} className={`${button} mt-4`}>
        {busy && <Loader2 className="size-5 animate-spin" />}Wyślij link do logowania
      </button>
      <Msg msg={msg} />
    </form>
  )
}

export function GithubForm({ current }: { current: string | null }) {
  const [login, setLogin] = useState(current ?? "")
  const { busy, msg, run } = useAction()
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        run(async () => {
          const r = (await post("/api/mf/github", { login })) as { manual?: boolean }
          const who = `@${login.replace(/^@/, "")}`
          return r?.manual
            ? `Zapisaliśmy login ${who}. Zaproszenie do repozytorium wyślemy w ciągu 24 godzin.`
            : `Wysłaliśmy zaproszenie dla ${who}. Zaakceptuj je w mailu od GitHuba albo na github.com/notifications.`
        })
      }}
      className="flex flex-col gap-3 sm:flex-row sm:items-end"
    >
      <label className="flex flex-1 flex-col gap-2 text-[15px] font-semibold">
        Twój login GitHub
        <input required value={login} onChange={(e) => setLogin(e.target.value)} placeholder="np. jan-kowalski, bez @" autoCapitalize="off" autoCorrect="off" spellCheck={false} className={`${input} font-normal`} />
      </label>
      <button type="submit" disabled={busy} className={button}>
        {busy && <Loader2 className="size-5 animate-spin" />}Wyślij zaproszenie
      </button>
      <div className="sm:basis-full"><Msg msg={msg} /></div>
    </form>
  )
}

export function ResendButton({ sessionId }: { sessionId: string }) {
  const { busy, msg, run } = useAction()
  return (
    <div>
      <button
        type="button"
        disabled={busy}
        onClick={() => run(async () => (await post("/api/mf/resend", { sessionId }), "Wysłaliśmy mail jeszcze raz."))}
        className="inline-flex min-h-12 items-center gap-2 rounded-full bg-[var(--h-surface)] px-6 text-[16px] font-semibold hover:bg-[var(--h-surface-hover)] disabled:opacity-60"
      >
        {busy && <Loader2 className="size-5 animate-spin" />}Wyślij mail z dostępem jeszcze raz
      </button>
      <Msg msg={msg} />
    </div>
  )
}

export function WithdrawalForm() {
  const [f, setF] = useState({ name: "", email: "", orderRef: "", statement: "Niniejszym odstępuję od umowy " })
  const { busy, msg, run } = useAction()
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setF({ ...f, [k]: e.target.value })
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        run(async () => {
          const d = await post("/api/mf/withdrawal", f)
          return `Przyjęliśmy oświadczenie (nr ${d.id}). Potwierdzenie wysłaliśmy na ${f.email}.`
        })
      }}
      className="flex flex-col gap-4"
    >
      {([
        ["name", "Imię i nazwisko"],
        ["email", "E-mail"],
        ["orderRef", "Numer zamówienia lub data zakupu (jeśli masz)"],
      ] as const).map(([k, label]) => (
        <label key={k} className="flex flex-col gap-2 text-[15px] font-semibold">
          {label}
          <input value={f[k]} onChange={set(k)} required={k !== "orderRef"} type={k === "email" ? "email" : "text"} className={`${input} font-normal`} />
        </label>
      ))}
      <label className="flex flex-col gap-2 text-[15px] font-semibold">
        Oświadczenie
        <textarea value={f.statement} onChange={set("statement")} required rows={5} className={`${input} py-3 font-normal`} />
      </label>
      <button type="submit" disabled={busy} className={`${button} self-start`}>
        {busy && <Loader2 className="size-5 animate-spin" />}Odstępuję od umowy
      </button>
      <Msg msg={msg} />
    </form>
  )
}
