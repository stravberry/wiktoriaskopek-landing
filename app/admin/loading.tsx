// Natychmiastowa odpowiedź przy przejściu między modułami (strona serwera dociąga dane w tle).
export default function Loading() {
  return (
    <div className="lg:flex" aria-busy="true" aria-label="Ładowanie">
      <aside className="hidden h-screen w-[232px] shrink-0 bg-[var(--mf-bg)] lg:block" />
      <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1200px] animate-pulse motion-reduce:animate-none">
          <div className="mb-6 h-10 w-48 rounded-[14px] bg-[var(--mf-surface-hover)]" />
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="h-64 rounded-[22px] bg-[var(--mf-bg)]" />
            <div className="h-64 rounded-[22px] bg-[var(--mf-bg)]" />
          </div>
        </div>
      </main>
    </div>
  )
}
