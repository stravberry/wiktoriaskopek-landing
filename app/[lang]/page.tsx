import { Fustat } from "next/font/google"
import HomeBooking from "@/components/home-booking"

const fustat = Fustat({ subsets: ["latin", "latin-ext"], display: "swap" })

// Ustawia motyw przed pierwszym malowaniem, żeby nie mignęło
const themeScript = `try{if(localStorage.getItem("home-theme")==="dark")document.documentElement.dataset.homeTheme="dark"}catch(e){}`

export default function Home() {
  return (
    <div className={fustat.className}>
      <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      <HomeBooking />
    </div>
  )
}
