import { ArrowUpRight } from 'lucide-react'
import { WhatsAppIcon } from '@/components/icons'
import { Reveal } from '@/components/Reveal'
import { SITE, mapsHref, wa } from '@/lib/site'

const QUE_HACEMOS = [
  { href: '#arreglos', img: 'bowl-hortensias', title: 'Arreglos ocasionales', text: 'Cumpleaños, aniversarios, nacimientos y cualquier fecha.' },
  { href: '#eventos', img: 'mesa-novios', title: 'Eventos', text: 'Bodas, XV años, bautizos, baby showers y eventos de empresa.' },
  { href: '#funeraria', img: 'corona-blanca', title: 'Funeraria', text: 'Coronas, cruces y arreglos de condolencias.' },
]

/** Página aparte (se abre desde el menú, no está en el scroll de la portada). */
export function QuienesSomos() {
  const years = new Date().getFullYear() - SITE.since
  return (
    <main className="bg-paper pt-28 md:pt-36">
      <section className="mx-auto grid max-w-7xl items-center gap-12 px-4 pb-20 md:px-8 md:pb-28 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
        <Reveal>
          <h1 className="font-display text-[clamp(3rem,7vw,6rem)] leading-[0.95] text-ink">Quiénes somos</h1>
          <div className="mt-8 max-w-xl space-y-5 text-[1.08rem] leading-relaxed text-ink-soft">
            <p>
              Florería La Silla abrió en Monterrey en {SITE.since}. Llevamos {years} años haciendo arreglos para cumpleaños, aniversarios,
              bodas, XV años y funerales.
            </p>
            <p>
              La tienda está en {SITE.address}. Puedes pasar a escoger tus flores de lunes a sábado o hacer tu pedido por WhatsApp.
            </p>
          </div>
        </Reveal>
        <Reveal delay={0.1} className="mx-auto w-full max-w-md">
          <img src="img/historia.webp" alt="Rosa en tono café sostenida a contraluz" className="aspect-[4/5] w-full rounded-md object-cover" />
        </Reveal>
      </section>

      <section className="bg-blush-50 py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <Reveal>
            <h2 className="font-display text-[clamp(2.2rem,4.6vw,3.6rem)] leading-[1] text-ink">Lo que hacemos</h2>
          </Reveal>
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {QUE_HACEMOS.map((q, i) => (
              <Reveal key={q.href} delay={i * 0.08}>
                <a href={q.href} className="group block">
                  <div className="overflow-hidden rounded-md">
                    <img
                      src={`img/${q.img}-sm.webp`}
                      alt={q.title}
                      loading="lazy"
                      className="aspect-[4/3] w-full object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.04]"
                    />
                  </div>
                  <h3 className="mt-4 flex items-center justify-between font-display text-[1.6rem] leading-tight text-ink">
                    {q.title}
                    <ArrowUpRight className="size-5 text-rose transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </h3>
                  <p className="mt-1 text-[0.95rem] text-stone">{q.text}</p>
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-20 md:flex-row md:items-end md:justify-between md:px-8 md:py-24">
        <Reveal>
          <h2 className="font-display text-[clamp(2rem,4vw,3rem)] leading-[1.05] text-ink">Visítanos</h2>
          <p className="mt-4 text-[1rem] leading-relaxed text-stone">
            {SITE.address}, {SITE.city}
            <br />
            Lunes a viernes 8:30 a 6:30 pm · Sábado 8:30 a 2:00 pm
          </p>
        </Reveal>
        <Reveal delay={0.1} className="flex flex-wrap gap-3">
          <a
            href={wa()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-12 items-center gap-2.5 rounded-sm bg-ink px-7 text-[0.8rem] font-normal tracking-[0.16em] text-paper uppercase transition hover:bg-rose"
          >
            <WhatsAppIcon className="size-4" />
            Hacer un pedido
          </a>
          <a
            href={mapsHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-12 items-center rounded-sm px-7 text-[0.8rem] font-normal tracking-[0.16em] text-ink uppercase ring-1 ring-ink/20 transition hover:ring-ink/50"
          >
            Cómo llegar
          </a>
        </Reveal>
      </section>
    </main>
  )
}
