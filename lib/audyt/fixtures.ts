// FIKCYJNE profile testowe (przykładowe dane, nie prawdziwe konta): do testów i 3 audytów wzorcowych, zanim Wiktoria podłączy Meta.
// Daty liczone od „teraz”, żeby kryteria 2, 3 i 8 dawały stały wynik.
import type { IgMedia, IgProfile } from "./core.ts"

const day = 86_400_000
const at = (now: number, daysAgo: number) => new Date(now - daysAgo * day).toISOString()

function reel(now: number, daysAgo: number, views: number, likes: number, comments: number, caption: string): IgMedia {
  return { timestamp: at(now, daysAgo), media_type: "VIDEO", media_product_type: "REELS", view_count: views, like_count: likes, comments_count: comments, caption, permalink: null }
}
function post(now: number, daysAgo: number, likes: number, comments: number, caption: string): IgMedia {
  return { timestamp: at(now, daysAgo), media_type: "IMAGE", media_product_type: "FEED", like_count: likes, comments_count: comments, caption, permalink: null }
}

export const TEST_HANDLES = ["test_salon_ania", "test_fizjo_marek", "test_coach_ola"] as const

export function testProfile(handle: string, now = Date.now()): IgProfile | null {
  switch (handle) {
    // Salon kosmetyczny: regularny, przyzwoite rolki, słabe wezwania i rozmowa.
    case "test_salon_ania":
      return {
        username: handle, name: "Salon Ania (przykład)", website: null,
        biography: "Salon kosmetyczny w Katowicach. Pielęgnacja twarzy i brwi.",
        followers_count: 2400, media_count: 310,
        media: [
          reel(now, 1, 1900, 61, 1, "Brwi przed i po laminacji"), post(now, 3, 48, 2, "Nowe terminy w grudniu"),
          reel(now, 5, 2300, 70, 2, "Jak dbać o skórę zimą"), reel(now, 8, 1600, 40, 0, "Kulisy zabiegu"),
          post(now, 10, 52, 1, "Promocja na peeling"), reel(now, 12, 6100, 230, 9, "3 błędy przy demakijażu, które robisz codziennie"),
          reel(now, 15, 2000, 55, 1, "Nasza nowa kosmetyczka"), post(now, 18, 40, 0, "Zapraszamy"),
          reel(now, 21, 2100, 64, 2, "Zabieg krok po kroku"), post(now, 24, 35, 1, "Voucher na święta"),
          reel(now, 27, 1800, 50, 1, "Pielęgnacja dłoni"), post(now, 31, 30, 0, "Dziękujemy za 300 opinii"),
        ],
      }
    // Gabinet fizjoterapii: mało rolek, długie przerwy, spadek, bez linku w bio.
    case "test_fizjo_marek":
      return {
        username: handle, name: "Fizjo Marek (przykład)", website: null,
        biography: "Fizjoterapia i trening medyczny.",
        followers_count: 5200, media_count: 140,
        media: [
          post(now, 2, 60, 3, "Gabinet nieczynny w piątek"), reel(now, 19, 700, 20, 0, "Ćwiczenie na kręgosłup"),
          post(now, 26, 44, 1, "Nowy sprzęt"), reel(now, 41, 900, 25, 1, "Rozciąganie po pracy"),
          post(now, 43, 50, 2, "Zespół gabinetu"), reel(now, 50, 2400, 80, 4, "Dlaczego boli Cię kark przy komputerze?"),
          post(now, 58, 38, 0, "Godziny otwarcia"), reel(now, 66, 2100, 70, 3, "Ból kolana po bieganiu. Napisz, jeśli też to masz"),
          post(now, 70, 41, 1, "Opinie pacjentów"), reel(now, 78, 1900, 60, 2, "Ćwiczenie na biodra"),
          reel(now, 85, 2600, 90, 5, "Jak siedzieć przy biurku? Zapisz na później"), post(now, 90, 33, 0, "Zapraszamy"),
        ],
      }
    // Coach: bardzo regularny, jeden strzał, dobre bio i wezwania.
    case "test_coach_ola":
      return {
        username: handle, name: "Coach Ola (przykład)", website: "https://example.com/ola",
        biography: "Pomagam właścicielkom małych firm planować tydzień bez wypalenia. Umów bezpłatną rozmowę: link niżej",
        followers_count: 8900, media_count: 620,
        media: [
          reel(now, 1, 4100, 190, 12, "Planujesz tydzień w niedzielę? Napisz TAK"), reel(now, 3, 3900, 170, 9, "Jedna lista zamiast pięciu. Zapisz"),
          reel(now, 5, 4400, 200, 14, "Co robię w poniedziałek rano? Komentarz: PLAN"), post(now, 6, 150, 8, "Warsztat w grudniu, link w bio"),
          reel(now, 8, 52000, 2600, 180, "Przestań odpisywać klientom po 20:00. Dlaczego?"), reel(now, 10, 4200, 180, 10, "Mój kalendarz krok po kroku, zapisz"),
          reel(now, 12, 3800, 160, 8, "3 pytania na koniec tygodnia?"), post(now, 13, 120, 6, "Opinie z warsztatu"),
          reel(now, 15, 4000, 170, 9, "Delegowanie w małej firmie"), reel(now, 17, 3600, 150, 7, "Ile godzin naprawdę pracujesz?"),
          post(now, 19, 110, 4, "Nowy termin"), reel(now, 21, 3700, 155, 8, "Poranek bez telefonu. Napisz, jak u Ciebie"),
        ],
      }
    default:
      return null
  }
}
