import { MF_CLIENTS } from "@/lib/mf/content"

// Pas klientów (0f, styl Apple): ciemna taśma, loga jednolicie białe; po najechaniu wracają oryginalne kolory.
// Znaków nie zmieniamy poza kolorem i rozmiarem. Wysokość z proporcji: podobna powierzchnia każdego logo.
const AREA = 5400 // px² przy wysokości ~37 px dla logo 4:1

export function ClientLogos() {
  return (
    <section id="case-study" aria-labelledby="klienci-title" className="mf-tone-dark mt-28 py-16 md:mt-44 md:py-20">
      <div className="mf-wrap">
        <h2 id="klienci-title" className="text-center text-[15px] font-semibold text-[var(--h-ink-2)] md:text-[17px]">Z MontageFrames montują już</h2>
        <ul className="mt-10 grid grid-cols-2 items-center justify-items-center gap-x-6 gap-y-10 sm:grid-cols-3 sm:gap-x-12 lg:gap-y-14">
          {MF_CLIENTS.map((c) => (
            <li key={c.name} className="mf-client grid h-16 place-items-center">
              {c.logo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={c.logo.src}
                  alt={c.name}
                  loading="lazy"
                  decoding="async"
                  style={{ height: `${Math.round(Math.min(48, Math.sqrt(AREA / c.logo.ratio)) * (c.logo.optical ?? 1))}px`, width: "auto" }}
                />
              ) : (
                <span className="whitespace-nowrap text-[22px] font-semibold tracking-[-0.02em]">{c.name}</span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
