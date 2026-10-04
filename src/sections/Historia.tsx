import { Reveal } from '@/components/Reveal'
import { SITE } from '@/lib/site'

export function Historia() {
  const years = new Date().getFullYear() - SITE.since
  return (
    <section id="historia" className="scroll-mt-20 overflow-x-clip bg-blush-50 py-20 md:py-28">
      <div className="mx-auto grid max-w-7xl items-center gap-14 px-4 md:px-8 lg:grid-cols-2">
        {/* una sola foto, en arco */}
        <Reveal className="relative mx-auto w-full max-w-sm lg:max-w-md">
          <figure className="overflow-hidden rounded-[999px_999px_28px_28px] shadow-[0_40px_80px_-30px_rgba(110,30,50,0.45)] ring-8 ring-paper">
            <img src="img/historia.webp" alt="Rosa en tono café sostenida a contraluz" loading="lazy" className="aspect-[4/5] w-full object-cover" />
          </figure>
        </Reveal>

        <div>
          <Reveal>
            <span className="eyebrow">Desde {SITE.since}</span>
            <p className="mt-5 font-display text-[clamp(5rem,13vw,9.5rem)] leading-[0.85] text-blush-200">
              <span className="font-serif">{years}</span> años
            </p>
            <h2 className="-mt-3 font-display text-[clamp(2.2rem,4.6vw,3.6rem)] leading-[1.05] text-ink md:-mt-6">
              El mismo oficio,
              <br />
              <span className="font-serif text-rose italic">en la misma ciudad</span>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-7 max-w-lg text-[1.05rem] leading-relaxed text-stone">
              Abrimos en Monterrey en {SITE.since}. Desde entonces nos buscan para el cumpleaños, para la boda de la hija y también
              para los días difíciles. Hemos recibido reconocimientos nacionales por calidad, diseño y servicio, pero lo que más nos
              importa es que el arreglo llegue como lo imaginaste.
            </p>
          </Reveal>
          <Reveal delay={0.18} className="mt-10 grid max-w-lg grid-cols-3 gap-4 border-t border-ink/10 pt-8">
            {[
              ['Lun a sáb', 'abierto'],
              ['Mismo día', 'antes de las 12'],
              ['Toda el área', 'metropolitana'],
            ].map(([a, b]) => (
              <div key={a}>
                <p className="font-display text-xl text-ink md:text-2xl">{a}</p>
                <p className="mt-1 text-[0.82rem] text-stone">{b}</p>
              </div>
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  )
}
