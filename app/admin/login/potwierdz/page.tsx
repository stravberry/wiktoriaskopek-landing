// Potwierdzenie logowania: link z maila prowadzi tutaj; sesję daje dopiero kliknięcie (POST), nie samo otwarcie linku.
export default async function Potwierdz({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const token = ((await searchParams).token ?? "").slice(0, 100)
  return (
    <main className="grid min-h-screen place-items-center px-4">
      <form method="post" action="/api/admin/auth" className="w-full max-w-[420px] rounded-[28px] bg-[var(--mf-bg)] p-8 shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
        <p className="text-[13px] font-semibold uppercase tracking-[0.08em] text-[var(--mf-ink-2)]">wiktoriaskopek.pl</p>
        <h1 className="mt-1 text-[28px] font-bold tracking-[-0.02em]">Zaloguj się do panelu</h1>
        <p className="mt-2 mb-6 text-[15px] text-[var(--mf-ink-2)]">Link działa raz. Sesja trwa 8 godzin.</p>
        <input type="hidden" name="token" value={token} />
        <button className="min-h-12 w-full rounded-full bg-[var(--mf-accent)] px-6 text-[16px] font-bold text-[var(--mf-on-accent)]">Zaloguj się</button>
      </form>
    </main>
  )
}
