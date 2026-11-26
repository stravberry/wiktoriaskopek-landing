// Dostęp do prywatnego repo paczki (kontrakt z Coding Builderem, 25.11.2026):
// zaproszenie z uprawnieniem pull, odebranie przy zwrocie/sporze, ZIP awaryjny przez zipball.
// Token: fine-grained PAT konta DKWGroup, tylko repo paczki, Administration: Read and write (+ Contents: Read dla ZIP).

const API = "https://api.github.com"

type Env = Record<string, string | undefined>

export function githubConfig(env: Env = process.env) {
  const token = env.GITHUB_INVITE_TOKEN
  const repo = env.MF_DIST_REPO || "DKWGroup/MontageFrames-dist"
  if (!token) return null
  if (repo === "DKWGroup/MontageFrames") throw new Error("Refusing to grant access to the private source repo")
  return { token, repo }
}

async function gh(token: string, method: string, path: string, body?: unknown, redirect: RequestRedirect = "follow") {
  return fetch(`${API}${path}`, {
    method,
    redirect,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      "User-Agent": "wiktoriaskopek-mf-shop",
      ...(body ? { "Content-Type": "application/json" } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  })
}

export function githubAccess(cfg: { token: string; repo: string }) {
  return {
    /** 201 = zaproszenie wysłane, 204 = już ma dostęp. Idempotentne. Najpierw sprawdza, czy konto istnieje. */
    async invite(login: string) {
      const user = await gh(cfg.token, "GET", `/users/${encodeURIComponent(login)}`)
      if (user.status === 404) throw new Error(`GitHub: nie ma użytkownika ${login}`)
      const res = await gh(cfg.token, "PUT", `/repos/${cfg.repo}/collaborators/${encodeURIComponent(login)}`, { permission: "pull" })
      if (res.status === 201 || res.status === 204) return
      if (res.status === 404) throw new Error(`GitHub: nie ma użytkownika ${login}`)
      throw new Error(`GitHub invite failed: ${res.status}`)
    },
    /** Usuwa współpracownika i oczekujące zaproszenie. Idempotentne. */
    async remove(login: string) {
      const del = await gh(cfg.token, "DELETE", `/repos/${cfg.repo}/collaborators/${encodeURIComponent(login)}`)
      if (![204, 404].includes(del.status)) throw new Error(`GitHub remove failed: ${del.status}`)
      const inv = await gh(cfg.token, "GET", `/repos/${cfg.repo}/invitations?per_page=100`)
      if (!inv.ok) throw new Error(`GitHub invitations list failed: ${inv.status}`)
      const list = (await inv.json()) as { id: number; invitee?: { login?: string } }[]
      for (const i of list.filter((x) => x.invitee?.login?.toLowerCase() === login.toLowerCase())) {
        const r = await gh(cfg.token, "DELETE", `/repos/${cfg.repo}/invitations/${i.id}`)
        if (![204, 404].includes(r.status)) throw new Error(`GitHub invitation delete failed: ${r.status}`)
      }
    },
    /** Tymczasowy link GitHuba do ZIP gałęzi main (nie zapisujemy go). */
    async zipUrl() {
      const res = await gh(cfg.token, "GET", `/repos/${cfg.repo}/zipball/main`, undefined, "manual")
      const location = res.headers.get("location")
      if (res.status !== 302 || !location) throw new Error(`GitHub zipball failed: ${res.status}`)
      return location
    },
    async latestVersion() {
      const res = await gh(cfg.token, "GET", `/repos/${cfg.repo}/commits/main`)
      if (!res.ok) return null
      const c = (await res.json()) as { sha: string; commit: { committer: { date: string } } }
      return { sha: c.sha.slice(0, 7), date: c.commit.committer.date }
    },
  }
}
