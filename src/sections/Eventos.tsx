import { ArrowDown } from 'lucide-react'
import { Reveal } from '@/components/Reveal'
import { cn } from '@/lib/utils'

const SERVICIOS = [
  ['Ramo y botoneras', 'Para la novia, la quinceañera y las damas'],
  ['Centros de mesa', 'Altos, bajos o combinados'],
  ['Mesa de novios o principal', 'Frente floral y arreglos de fondo'],
  ['Iglesia y altar', 'Arreglos para el altar'],
  ['Entrada y fondos para fotos', 'Arcos, jardín al piso y flores gigantes'],
]

// Fotos de eventos de su Instagram
const FOTOS: { img: string; alt: string; caption: string; className?: string }[] = [
  { img: 'mesa-novios', alt: 'Mesa de novios con flores al frente y árboles blancos detrás', caption: 'Mesa de novios', className: 'col-span-2 aspect-[16/10]' },
  { img: 'ramo-novia', alt: 'Ramo de novia', caption: 'Ramo de novia', className: 'aspect-[4/5]' },
  { img: 'arbol-cristal-salon', alt: 'Árbol de cristal con rosas colgantes en salón', caption: 'Centro de mesa alto', className: 'aspect-[4/5]' },
  { img: 'salon-cielo-estrellado', alt: 'Salón de eventos con arreglos de rosas y lilis', caption: 'Montaje de salón', className: 'col-span-2 aspect-[16/10]' },
  { img: 'babyshower-flores-gigantes', alt: 'Fondo de baby shower con flores gigantes de papel y flor natural', caption: 'Baby shower', className: 'aspect-[4/5]' },
  { img: 'boutonniere', alt: 'Botonera de flores para el novio', caption: 'Botonera', className: 'aspect-[4/5]' },
]

export function Eventos() {
  return (
    <section id="eventos" className="scroll-mt-20 bg-blush-50 py-20 md:py-28">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 md:px-8 lg:grid-cols-[5fr_7fr] lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <Reveal>
            <h2 className="font-display text-[clamp(2.4rem,5.2vw,4.2rem)] leading-[1] text-ink">Flores para bodas, XV años y eventos</h2>
            <p className="mt-5 max-w-md text-[1.02rem] leading-relaxed text-stone">
              También bautizos, baby showers y eventos de empresa.
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <ul className="mt-10 border-t border-ink/10">
              {SERVICIOS.map(([t, d]) => (
                <li key={t} className="flex flex-col gap-0.5 border-b border-ink/10 py-4 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
                  <span className="font-display text-[1.35rem] leading-tight text-ink">{t}</span>
                  <span className="text-[0.88rem] text-stone sm:text-right">{d}</span>
                </li>
              ))}
            </ul>
            <a
              href="#cotizar"
              className="mt-9 inline-flex min-h-12 items-center gap-2.5 rounded-sm bg-ink px-7 text-[0.8rem] font-normal tracking-[0.16em] text-paper uppercase transition hover:bg-rose"
            >
              Cotizar mi evento
              <ArrowDown className="size-4" />
            </a>
          </Reveal>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          {FOTOS.map((f, i) => (
            <Reveal key={f.img} delay={(i % 2) * 0.08} className={cn('group', f.className?.includes('col-span-2') && 'col-span-2')}>
              <figure>
                <div className={cn('overflow-hidden rounded-md bg-blush', f.className?.replace('col-span-2', ''))}>
                  <img
                    src={`img/${f.img}${f.className?.includes('col-span-2') ? '' : '-sm'}.webp`}
                    alt={f.alt}
                    loading="lazy"
                    className="size-full object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.04]"
                  />
                </div>
                <figcaption className="mt-2 text-[0.78rem] tracking-[0.14em] text-stone uppercase">{f.caption}</figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
