import { Anton, Bebas_Neue, Caveat, Fustat, Inter, JetBrains_Mono, Libre_Baskerville, Montserrat, Mulish, Nunito, Nunito_Sans, Plus_Jakarta_Sans, Poppins, Roboto } from "next/font/google"

// Fonty kreatora marki w próbie (lista z trial-options.json). next/font hostuje je u nas: przeglądarka nie łączy się z Google.
// preload: false, więc plik fontu pobiera się dopiero, gdy podgląd go użyje.

const f_caveat = Caveat({ subsets: ["latin", "latin-ext"], weight: "700", display: "swap", preload: false })
const f_jetbrains_mono = JetBrains_Mono({ subsets: ["latin", "latin-ext"], weight: "700", display: "swap", preload: false })
const f_anton = Anton({ subsets: ["latin", "latin-ext"], weight: "400", display: "swap", preload: false })
const f_montserrat = Montserrat({ subsets: ["latin", "latin-ext"], weight: "800", display: "swap", preload: false })
const f_libre_baskerville = Libre_Baskerville({ subsets: ["latin", "latin-ext"], weight: "700", display: "swap", preload: false })
const f_inter = Inter({ subsets: ["latin", "latin-ext"], weight: "800", display: "swap", preload: false })
const f_poppins = Poppins({ subsets: ["latin", "latin-ext"], weight: "700", display: "swap", preload: false })
const f_bebas_neue = Bebas_Neue({ subsets: ["latin", "latin-ext"], weight: "400", display: "swap", preload: false })
const f_plus_jakarta_sans = Plus_Jakarta_Sans({ subsets: ["latin", "latin-ext"], weight: "800", display: "swap", preload: false })
const f_mulish = Mulish({ subsets: ["latin", "latin-ext"], weight: "800", display: "swap", preload: false })
const f_roboto = Roboto({ subsets: ["latin", "latin-ext"], weight: "700", display: "swap", preload: false })
const f_nunito_sans = Nunito_Sans({ subsets: ["latin", "latin-ext"], weight: "800", display: "swap", preload: false })
const f_nunito = Nunito({ subsets: ["latin", "latin-ext"], weight: "800", display: "swap", preload: false })
const f_fustat = Fustat({ subsets: ["latin", "latin-ext"], weight: "800", display: "swap", preload: false })

/** Nazwa fontu z kreatora → CSS font-family do podglądu marki. */
export const TRIAL_FONT_FAMILY: Record<string, string> = {
  "Caveat": f_caveat.style.fontFamily,
  "JetBrains Mono": f_jetbrains_mono.style.fontFamily,
  "Anton": f_anton.style.fontFamily,
  "Montserrat": f_montserrat.style.fontFamily,
  "Libre Baskerville": f_libre_baskerville.style.fontFamily,
  "Inter": f_inter.style.fontFamily,
  "Poppins": f_poppins.style.fontFamily,
  "Bebas Neue": f_bebas_neue.style.fontFamily,
  "Plus Jakarta Sans": f_plus_jakarta_sans.style.fontFamily,
  "Mulish": f_mulish.style.fontFamily,
  "Roboto": f_roboto.style.fontFamily,
  "Nunito Sans": f_nunito_sans.style.fontFamily,
  "Nunito": f_nunito.style.fontFamily,
  "Fustat": f_fustat.style.fontFamily,
}
