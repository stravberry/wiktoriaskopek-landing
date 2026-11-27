import { redirect } from "next/navigation"
import { AdminLoginForm } from "@/components/admin/login-form"
import { currentAdmin } from "@/lib/admin/server"

export default async function AdminLogin({ searchParams }: { searchParams: Promise<{ blad?: string; wylogowano?: string }> }) {
  if (await currentAdmin()) redirect("/admin")
  const q = await searchParams
  return (
    <main className="grid min-h-screen place-items-center px-4">
      <div className="w-full max-w-[420px] rounded-[28px] bg-[var(--mf-bg)] p-8 shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
        <p className="text-[13px] font-semibold uppercase tracking-[0.08em] text-[var(--mf-ink-2)]">wiktoriaskopek.pl</p>
        <h1 className="mt-1 text-[28px] font-bold tracking-[-0.02em]">Panel</h1>
        <p className="mt-2 mb-6 text-[15px] text-[var(--mf-ink-2)]">Podaj e-mail. Jeśli ma dostęp, dostaniesz link ważny 15 minut.</p>
        {q.blad === "link" && <p role="alert" className="mb-4 rounded-2xl bg-[var(--mf-danger-soft)] p-3 text-[15px] font-semibold text-[var(--mf-danger)]">Link wygasł albo był już użyty. Wyślij nowy.</p>}
        {q.wylogowano && <p role="status" className="mb-4 rounded-2xl bg-[var(--mf-success-soft)] p-3 text-[15px] text-[var(--mf-success)]">Wylogowano.</p>}
        <AdminLoginForm />
      </div>
    </main>
  )
}
