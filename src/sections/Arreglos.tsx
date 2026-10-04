import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowUpRight, CalendarDays, Clock, CreditCard, Truck } from 'lucide-react'
import { Reveal } from '@/components/Reveal'
import { Carousel } from '@/components/ui/carousel'
import { withDigits } from '@/lib/digits'
import { waPedido } from '@/lib/site'
import { cn } from '@/lib/utils'

const OCASIONES = ['Todas', 'Cumpleaños', 'Amor', 'Nacimiento', 'Gracias', 'Recupérate', '10 de mayo'] as const
type Ocasion = (typeof OCASIONES)[number]

// Fotos de su Instagram y productos de su catálogo (florerialasilla.com)
const ARREGLOS: { img: string; name: string; note: string; tags: Ocasion[]; pos?: string }[] = [
  { img: 'bowl-rosas-orquideas', name: 'Bowl de rosas y orquídeas', note: 'Rosas rojas, rosa y orquídea blanca', tags: ['Amor', 'Gracias'] },
  { img: 'jarron-lirios', name: 'Jarrón de lirios con perritos', note: 'Lirios, rosas y orquídeas', tags: ['Cumpleaños', 'Gracias'] },
  { img: 'rosas-vino-tinto', name: 'Rosas rojas con vino tinto', note: 'Caja con una docena y botella', tags: ['Amor', 'Cumpleaños'] },
  { img: 'bouquet-100-rosas', name: 'Bouquet de 100 rosas', note: 'Rosa roja con listón de yute', tags: ['Amor', '10 de mayo'], pos: 'object-[12%_50%]' },
  { img: 'bowl-hortensias', name: 'Bowl de hortensias', note: 'Hortensia rosa, lila y blanca', tags: ['Nacimiento', 'Gracias', 'Recupérate', '10 de mayo'] },
  { img: 'jarron-negro-anturios', name: 'Cilindro negro de temporada', note: 'Anturios, tulipanes y hortensia', tags: ['Cumpleaños', 'Gracias'] },
  { img: 'caja-rosas-orquideas', name: 'Caja de rosas y orquídeas', note: 'Con orquídea phalaenopsis', tags: ['Amor', 'Nacimiento', '10 de mayo'] },
  { img: 'cilindro-girasoles', name: 'Cilindro con girasoles', note: 'Girasol y varas naturales', tags: ['Cumpleaños', 'Recupérate', 'Gracias'] },
  { img: 'vino-blanco-caja', name: 'Caja de flores con vino blanco', note: 'Rosas, clavel y delfinio', tags: ['Gracias', 'Cumpleaños'] },
  { img: 'caja-rosas-surtida', name: 'Caja de rosas surtida', note: 'Roja, amarilla y rosa', tags: ['Cumpleaños', '10 de mayo', 'Gracias'] },
  { img: 'tulipanes', name: 'Jarrón de tulipanes', note: 'Tulipán amarillo con flor de cera', tags: ['Nacimiento', 'Recupérate', 'Cumpleaños', '10 de mayo'] },
  { img: 'esfera-plata', name: 'Esfera plata con rosas y orquídeas', note: 'Rosa fucsia y agapando', tags: ['Gracias', 'Amor', 'Cumpleaños'], pos: 'object-[45%_50%]' },
]

const INFO = [
  { icon: Clock, t: 'Mismo día', d: 'Pide antes de las 12:00, lun a vie' },
  { icon: Truck, t: 'Todo Monterrey', d: 'Y su área metropolitana' },
  { icon: CalendarDays, t: 'Sábados', d: 'Pide desde el viernes' },
  { icon: CreditCard, t: 'Pagos', d: 'Transferencia, efectivo o tarjeta' },
]

export function Arreglos() {
  const [oc, setOc] = useState<Ocasion>('Todas')
  const lista = oc === 'Todas' ? ARREGLOS : ARREGLOS.filter((p) => p.tags.includes(oc))

  return (
    <section id="arreglos" className="scroll-mt-20 bg-paper py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <Reveal>
            <span className="eyebrow">Arreglos y envíos</span>
            <h2 className="mt-5 font-display text-[clamp(2.4rem,5.2vw,4.2rem)] leading-[1] text-ink">
              Manda flores <span className="font-serif text-rose italic">a quien quieras</span>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="max-w-sm text-[1.02rem] leading-relaxed text-stone">
              Escoge la ocasión. Lo armamos, le ponemos tu tarjeta y lo llevamos a la casa, la oficina o el hospital.
            </p>
          </Reveal>
        </div>

        <Reveal className="mt-10">
          <div className="-mx-4 overflow-x-auto px-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" role="tablist" aria-label="Ocasión">
            <div className="flex w-max gap-1.5">
              {OCASIONES.map((o) => (
                <button
                  key={o}
                  type="button"
                  role="tab"
                  aria-selected={oc === o}
                  onClick={() => setOc(o)}
                  className={cn(
                    'relative min-h-11 cursor-pointer rounded-full px-5 text-[0.9rem] font-normal transition-colors',
                    oc === o ? 'text-paper' : 'text-ink-soft hover:text-ink',
                  )}
                >
                  {oc === o && (
                    <motion.span layoutId="oc-pill" className="absolute inset-0 rounded-full bg-ink" transition={{ type: 'spring', stiffness: 400, damping: 32 }} />
                  )}
                  <span className="relative">{o}</span>
                </button>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal className="mt-6">
          <Carousel label="Arreglos" resetKey={oc} itemClassName="w-[58%] sm:w-[calc((100%-2rem)/3.3)] lg:w-[calc((100%-4rem)/5)]">
            {lista.map((a) => (
              <a
                key={a.img}
                href={waPedido(a.name)}
                target="_blank"
                rel="noopener noreferrer"
                className="group block"
                aria-label={`Pedir ${a.name} por WhatsApp`}
              >
                <div className="overflow-hidden rounded-2xl bg-blush">
                  <img
                    src={`img/${a.img}-sm.webp`}
                    alt={a.name}
                    loading="lazy"
                    className={cn('aspect-square w-full object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.05]', a.pos)}
                  />
                </div>
                <h3 className="mt-3 flex items-start justify-between gap-2 px-0.5 font-display text-[1.12rem] leading-tight text-ink md:text-[1.2rem]">
                  <span>{withDigits(a.name)}</span>
                  <ArrowUpRight className="mt-1 size-4 shrink-0 text-rose transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </h3>
              </a>
            ))}
          </Carousel>
        </Reveal>

        <Reveal className="mt-10">
          <ul className="grid grid-cols-2 gap-x-6 gap-y-5 border-t border-ink/10 pt-8 lg:grid-cols-4">
            {INFO.map(({ icon: Icon, t, d }) => (
              <li key={t} className="flex items-start gap-3">
                <span className="grid size-10 shrink-0 place-items-center rounded-full bg-blush">
                  <Icon className="size-[1.1rem] text-rose" strokeWidth={1.5} />
                </span>
                <span>
                  <span className="block text-[0.95rem] text-ink">{t}</span>
                  <span className="block text-[0.85rem] leading-snug text-stone">{d}</span>
                </span>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  )
}
