import { useCallback, useState } from 'react'
import { motion } from 'framer-motion'
import { ArregloDialog, type ArregloItem } from '@/components/ArregloDialog'
import { Reveal } from '@/components/Reveal'
import { Carousel } from '@/components/ui/carousel'
import { withDigits } from '@/lib/digits'
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

// datos de su sección de preguntas frecuentes (florerialasilla.com)
const INFO = [
  'Pedidos antes de las 12:00, mismo día (lun a vie)',
  'Para sábado, pide desde el viernes',
  'Monterrey y área metropolitana',
  'Transferencia, efectivo o tarjeta',
]

export function Arreglos() {
  const [oc, setOc] = useState<Ocasion>('Todas')
  const [abierto, setAbierto] = useState<ArregloItem | null>(null)
  const cerrar = useCallback(() => setAbierto(null), [])
  const lista = oc === 'Todas' ? ARREGLOS : ARREGLOS.filter((p) => p.tags.includes(oc))

  return (
    <section id="flores" className="scroll-mt-20 bg-paper py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <Reveal className="text-center">
          <h2 id="arreglos" className="scroll-mt-28 font-display text-[clamp(2.6rem,5.6vw,4.6rem)] leading-[1] text-ink">
            Arreglos ocasionales
          </h2>
        </Reveal>

        {/* filtro por ocasión: texto con línea fina bajo la opción activa */}
        <Reveal className="mt-8">
          <div className="-mx-4 overflow-x-auto px-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" role="tablist" aria-label="Ocasión">
            <div className="mx-auto flex w-max items-center border-b border-ink/10">
              {OCASIONES.map((o) => (
                <button
                  key={o}
                  type="button"
                  role="tab"
                  aria-selected={oc === o}
                  onClick={() => setOc(o)}
                  className={cn(
                    'relative min-h-11 cursor-pointer px-3.5 text-[0.72rem] font-medium tracking-[0.2em] uppercase transition-colors sm:px-5',
                    oc === o ? 'text-rose' : 'text-stone hover:text-ink',
                  )}
                >
                  {o}
                  {oc === o && (
                    <motion.span layoutId="oc-line" className="absolute inset-x-3.5 -bottom-px h-[2px] bg-rose sm:inset-x-5" transition={{ type: 'spring', stiffness: 420, damping: 36 }} />
                  )}
                </button>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal className="mt-12">
          <Carousel label="Arreglos" resetKey={oc} itemClassName="w-[58%] sm:w-[calc((100%-2rem)/3.3)] lg:w-[calc((100%-4rem)/5)]">
            {lista.map((a) => (
              <button
                key={a.img}
                type="button"
                onClick={() => setAbierto(a)}
                className="group block w-full cursor-pointer text-left"
                aria-label={`Ver ${a.name}`}
              >
                {/* arreglo recortado, sin fondo, flotando sobre el color de la sección */}
                <div className="flex aspect-[4/5] items-end justify-center px-2">
                  <img
                    src={`img/sinfondo/${a.img}.webp`}
                    alt={a.name}
                    loading="lazy"
                    className="max-h-full max-w-full object-contain drop-shadow-[0_18px_22px_rgba(40,25,20,0.18)] transition-transform duration-[0.9s] ease-[cubic-bezier(.22,1,.36,1)] group-hover:-translate-y-1.5 group-hover:scale-[1.03]"
                  />
                </div>
                <p className="mt-5 text-center text-[0.68rem] font-medium tracking-[0.28em] text-stone uppercase">{a.tags[0]}</p>
                <h3 className="mt-1.5 text-center font-display text-[1.3rem] leading-tight text-rose md:text-[1.4rem]">{withDigits(a.name)}</h3>
              </button>
            ))}
          </Carousel>
        </Reveal>

        <Reveal className="mt-12 border-t border-ink/10 pt-6">
          <ul className="flex flex-col items-center gap-1.5 text-center text-[0.9rem] text-stone md:flex-row md:flex-wrap md:justify-center md:gap-0">
            {INFO.map((t, i) => (
              <li key={t}>
                {i > 0 && <span className="mx-3 hidden text-ink/25 md:inline">·</span>}
                {t}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
      <ArregloDialog item={abierto} onClose={cerrar} />
    </section>
  )
}
