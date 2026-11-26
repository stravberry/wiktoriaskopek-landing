import { readFile } from "node:fs/promises"
import { join } from "node:path"
import { NextResponse } from "next/server"
import { PDFDocument, rgb, type PDFFont, type PDFPage } from "pdf-lib"
import fontkit from "@pdf-lib/fontkit"
import { MF_BASE_PATH } from "@/lib/mf/config"
import { getChapters } from "@/lib/mf/poradnik"
import { hasActiveOrder, sql } from "@/lib/mf/db"
import { currentBuyer, mfEnv, origin, rateLimited } from "@/lib/mf/server"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

// GET /api/mf/poradnik-pdf: poradnik jako PDF z tych samych treści co strony, tylko dla kupujących.
// Font Inter (SIL OFL 1.1, lib/mf/fonts/OFL-Inter.txt) z polskimi znakami; e-mail kupującego w stopce każdej strony.
const A4: [number, number] = [595.28, 841.89]
const M = 56
const INK = rgb(0.11, 0.11, 0.12)
const MUTED = rgb(0.36, 0.36, 0.38)
const ACCENT = rgb(1, 0.416, 0.075)

function wrap(text: string, font: PDFFont, size: number, width: number) {
  const lines: string[] = []
  for (const para of text.split("\n")) {
    let line = ""
    for (const word of para.split(/\s+/)) {
      const next = line ? `${line} ${word}` : word
      if (font.widthOfTextAtSize(next, size) > width && line) {
        lines.push(line)
        line = word
      } else line = next
    }
    lines.push(line)
  }
  return lines
}

export async function GET() {
  if (mfEnv().disabled) return new NextResponse("Niedostępne", { status: 503 })
  const email = await currentBuyer()
  if (!email || !(await hasActiveOrder(sql(), email))) return NextResponse.redirect(`${origin()}${MF_BASE_PATH}/konto`)
  if (rateLimited(`pdf:${email}`, 20, 60 * 60_000)) return new NextResponse("Limit pobrań na godzinę", { status: 429 })
  const CHAPTERS = await getChapters()

  const doc = await PDFDocument.create()
  doc.registerFontkit(fontkit)
  const dir = join(process.cwd(), "lib/mf/fonts")
  const font = await doc.embedFont(await readFile(join(dir, "Inter-Regular.ttf")), { subset: false })
  const bold = await doc.embedFont(await readFile(join(dir, "Inter-Bold.ttf")), { subset: false })
  doc.setTitle("Poradnik MontageFrames")
  doc.setAuthor("Wiktoria Skopek")

  let page: PDFPage = doc.addPage(A4)
  let y = A4[1] - M
  const width = A4[0] - 2 * M
  const newPage = () => {
    page = doc.addPage(A4)
    y = A4[1] - M
  }
  const write = (text: string, size: number, color = INK, gap = 6, indent = 0, f: PDFFont = font) => {
    for (const line of wrap(text, f, size, width - indent)) {
      if (y - size < M + 24) newPage()
      page.drawText(line, { x: M + indent, y: y - size, size, font: f, color })
      y -= size * 1.45
    }
    y -= gap
  }

  write("Poradnik MontageFrames", 28, INK, 4, 0, bold)
  write("Montuj swoje filmy i rolki w AI! Bez montażysty", 13, ACCENT, 18)
  for (const c of CHAPTERS) write(c.title, 12, MUTED, 0)
  for (const c of CHAPTERS) {
    newPage()
    write(c.title, 22, INK, 4, 0, bold)
    write(c.lead, 13, MUTED, 12)
    for (const b of c.blocks) {
      if ("p" in b) write(b.p, 11.5)
      else if ("code" in b) write(b.code, 10.5, MUTED, 8, 12)
      else if ("list" in b) {
        for (const item of b.list) write(`•  ${item}`, 11.5, INK, 2, 8)
        y -= 6
      } else if ("img" in b) write(`[Zrzut ekranu w wersji online: ${b.alt}]`, 10, MUTED)
    }
  }
  const pages = doc.getPages()
  pages.forEach((p, i) =>
    p.drawText(`Licencja dla: ${email} · Nie udostępniaj poradnika · ${i + 1}/${pages.length}`, { x: M, y: 28, size: 8.5, font, color: MUTED }),
  )

  const bytes = await doc.save()
  return new NextResponse(Buffer.from(bytes), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="poradnik-montageframes.pdf"',
      "Cache-Control": "private, no-store",
      "X-Robots-Tag": "noindex",
    },
  })
}
