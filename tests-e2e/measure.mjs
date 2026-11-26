// Pomiar układu w przeglądarce (bez zależności, przekazywany do page.evaluate). Wspólny dla testu CI i skryptu audytu.
// Zwraca listę problemów: overflow strony, elementy poza ekranem, słowa łamane w pół, cele dotyku < 44 px, zasłonięte kontrolki.
export function measureLayout() {
  const W = window.innerWidth
  const issues = []
  const vis = (el) => {
    if (el.closest("[inert]")) return false // ukryte i wyłączone (np. pasek CTA przed przewinięciem)
    const closed = el.closest("details:not([open])")
    if (closed && !el.closest("summary") && el !== closed) return false
    const s = getComputedStyle(el), r = el.getBoundingClientRect()
    return s.visibility !== "hidden" && s.display !== "none" && r.width > 0 && r.height > 0 && !el.closest("[aria-hidden='true'],.sr-only")
  }
  const name = (el) => (el.getAttribute("aria-label") || el.innerText || el.getAttribute("placeholder") || el.tagName).trim().replace(/\s+/g, " ").slice(0, 50)
  const sel = (el) => `${el.tagName.toLowerCase()}${el.id ? "#" + el.id : ""}${typeof el.className === "string" && el.className.trim() ? "." + el.className.trim().split(/\s+/).slice(0, 2).join(".") : ""}`.slice(0, 70)
  const clipped = (el) => { for (let a = el.parentElement; a && a !== document.body; a = a.parentElement) { const o = getComputedStyle(a).overflowX; if (o !== "visible") return true } return false }
  const pinned = (n) => { for (let a = n; a && a !== document.body; a = a.parentElement) { const p = getComputedStyle(a).position; if (p === "fixed" || p === "sticky") return true } return false }

  if (document.documentElement.scrollWidth - W > 1) issues.push({ type: "overflow-strony", detail: `${document.documentElement.scrollWidth} > ${W}` })
  for (const el of document.querySelectorAll("body *")) {
    if (!vis(el)) continue
    const r = el.getBoundingClientRect()
    if ((r.right > W + 1 || r.left < -1) && !clipped(el) && getComputedStyle(el).position !== "fixed") issues.push({ type: "poza-ekranem", el: sel(el), text: name(el) })
  }
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT)
  const broken = new Set()
  for (let n = walker.nextNode(); n; n = walker.nextNode()) {
    const p = n.parentElement
    if (!p || !vis(p) || p.closest("svg,script,style")) continue
    const re = /\S{4,}/g
    let m
    while ((m = re.exec(n.textContent))) {
      if (/@|\/\/|\.[a-z]{2,}\//i.test(m[0])) continue // adresy e-mail i URL mogą się łamać
      const range = document.createRange(); range.setStart(n, m.index); range.setEnd(n, m.index + m[0].length)
      if (new Set([...range.getClientRects()].filter((q) => q.width > 0).map((q) => Math.round(q.top))).size > 1) broken.add(`${sel(p)} „${m[0].slice(0, 30)}”`)
    }
  }
  for (const b of broken) issues.push({ type: "slowo-zlamane", detail: b })
  for (const el of document.querySelectorAll("button, a[href], input:not([type=hidden]), select, textarea, [role=button], [role=radio], [role=tab], [role=switch], summary")) {
    if (!vis(el) || el.matches("input.sr-only, input[type=file]")) continue
    if (el.matches("input[type=checkbox], input[type=radio]") && el.closest("label")) continue
    if (el.tagName === "A" && getComputedStyle(el).display === "inline" && /^(P|LI|SPAN|SMALL|TD|DD)$/.test(el.parentElement?.tagName ?? "")) continue // link w zdaniu
    const r = (el.closest("label") || el).getBoundingClientRect()
    if (Math.min(r.width, r.height) < 43.5) issues.push({ type: "cel-dotyku", el: sel(el), text: name(el), detail: `${Math.round(r.width)}×${Math.round(r.height)}` })
  }
  const modal = document.querySelector("dialog[open]")
  for (const el of document.querySelectorAll("button, a[href], input:not([type=hidden]):not(.sr-only), select, textarea")) {
    if (!vis(el) || (modal && !modal.contains(el))) continue
    const r = el.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height / 2
    if (cy < 0 || cy > window.innerHeight || cx < 0 || cx > W) continue
    const top = document.elementFromPoint(cx, cy)
    if (!top || top === el || el.contains(top) || top.contains(el) || el.closest("label")?.contains(top)) continue
    if (pinned(top) && !pinned(el)) continue // przewijana treść pod przyklejonym paskiem
    issues.push({ type: "zasloniete", el: sel(el), text: name(el), detail: `przez ${sel(top)}` })
  }
  return issues
}
