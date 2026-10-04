import { useId, useState } from 'react'
import { motion } from 'framer-motion'
import { WhatsAppIcon } from '@/components/icons'
import { Reveal } from '@/components/Reveal'
import { ThumbnailGallery } from '@/components/ui/thumbnail-gallery'
import { SITE, wa } from '@/lib/site'

const PIEZAS = [
  { img: 'corona-blanca', name: 'Corona blanca', note: 'Rosas blancas con centro de hortensia' },
  { img: 'corona-rosas-rojas', name: 'Corona de rosas rojas', note: 'Rosa roja sobre follaje de palma' },
  { img: 'cruz-rosas', name: 'Cruz de rosas blancas', note: 'Rosas, lilis y orquídea, en tripié' },
  { img: 'tripie-rosas-blancas', name: 'Tripié de rosas blancas', note: 'Rosas y perritos blancos' },
  { img: 'condolencia-liston', name: 'Arreglo con listón', note: 'Tulipán, lili y nube, con dedicatoria' },
  { img: 'blanco-con-fruta', name: 'Arreglo blanco con fruta', note: 'Para llevar a casa de la familia' },
]

const field =
  'min-h-12 w-full rounded-xl bg-ink px-4 text-[1rem] text-paper ring-1 ring-paper/15 outline-none placeholder:text-paper/35 focus:ring-petal'

export function Funeraria() {
  const [pieza, setPieza] = useState(PIEZAS[0].name)
  const [texto, setTexto] = useState('')
  const [lugar, setLugar] = useState('')
  const ids = { texto: useId(), lugar: useId(), pieza: useId() }

  const mensaje = [
    'Hola, quiero enviar un arreglo de condolencias.',
    `Arreglo: ${pieza}`,
    `Texto del listón: ${texto || '(por definir)'}`,
    `Funeraria / sala: ${lugar || '(por definir)'}`,
  ].join('\n')

  return (
    <section id="funeraria" className="scroll-mt-20 bg-ink text-paper">
      <div className="mx-auto max-w-7xl px-4 py-20 md:px-8 md:py-28">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <Reveal>
            <span className="eyebrow !text-petal">Funeraria</span>
            <h2 className="mt-5 font-display text-[clamp(2.4rem,5.2vw,4.2rem)] leading-[1]">
              Coronas y <span className="font-serif text-petal italic">condolencias</span>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="max-w-sm text-[1.02rem] leading-relaxed text-paper/70">
              Las llevamos directo a la funeraria o al templo, con el listón que tú nos digas. Si es urgente, llámanos al{' '}
              <a href={SITE.phoneHref} className="whitespace-nowrap text-blush underline underline-offset-4">
                {SITE.phone}
              </a>
              .
            </p>
          </Reveal>
        </div>

        <div className="mt-12 grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* galería de piezas: la que se ve es la que va en el listón */}
          <Reveal className="min-w-0">
            <ThumbnailGallery
              items={PIEZAS.map((p) => ({ src: `img/${p.img}.webp`, thumb: `img/${p.img}-sm.webp`, alt: `${p.name}: ${p.note.toLowerCase()}`, name: p.name }))}
              index={Math.max(0, PIEZAS.findIndex((p) => p.name === pieza))}
              onChange={(i) => setPieza(PIEZAS[i].name)}
            />
          </Reveal>

          {/* gadget: escribe el listón */}
          <Reveal delay={0.1}>
            <div className="rounded-[1.75rem] bg-ink-soft/60 p-5 ring-1 ring-paper/10 sm:p-7">
              <div className="relative flex h-40 items-center justify-center overflow-hidden rounded-2xl bg-[radial-gradient(ellipse_at_center,#2b2424_0%,#171414_75%)]" aria-hidden="true">
                <motion.span key={pieza} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="absolute top-4 text-[0.68rem] tracking-[0.3em] text-paper/45 uppercase">
                  {pieza}
                </motion.span>
                <div className="relative mt-4 w-[90%] -rotate-2">
                  <div
                    className="bg-gradient-to-b from-[#fbf7f2] via-[#efe7dd] to-[#e2d7ca] px-9 py-4 text-center shadow-[0_18px_40px_-12px_rgba(0,0,0,0.7)]"
                    style={{ clipPath: 'polygon(0 0, 100% 0, 96% 50%, 100% 100%, 0 100%, 4% 50%)' }}
                  >
                    <span className="block font-serif text-[clamp(1.1rem,2.2vw,1.45rem)] leading-snug break-words text-[#5a4a3e] italic">
                      {texto || 'Con cariño, familia García Treviño'}
                    </span>
                  </div>
                </div>
              </div>

              <h3 className="mt-6 font-display text-[1.9rem] leading-none">
                Escribe el <span className="font-serif text-petal italic">listón</span>
              </h3>
              <p className="mt-2 text-[0.9rem] text-paper/60">Te abrimos WhatsApp con el pedido ya escrito.</p>

              <div className="mt-5 grid gap-4">
                <label htmlFor={ids.pieza} className="sr-only">
                  Arreglo
                </label>
                <select id={ids.pieza} value={pieza} onChange={(e) => setPieza(e.target.value)} className={field}>
                  {PIEZAS.map((p) => (
                    <option key={p.name}>{p.name}</option>
                  ))}
                </select>
                <div>
                  <label htmlFor={ids.texto} className="sr-only">
                    Texto del listón
                  </label>
                  <input
                    id={ids.texto}
                    value={texto}
                    maxLength={60}
                    onChange={(e) => setTexto(e.target.value)}
                    placeholder="Texto del listón"
                    className={field}
                  />
                  <span className="mt-1 block text-right text-xs text-paper/40">{texto.length}/60</span>
                </div>
                <label htmlFor={ids.lugar} className="sr-only">
                  Funeraria y sala
                </label>
                <input id={ids.lugar} value={lugar} onChange={(e) => setLugar(e.target.value)} placeholder="Funeraria y sala" className={field} />
                <a
                  href={wa(mensaje)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 inline-flex min-h-12 items-center justify-center gap-2.5 rounded-full bg-paper px-7 text-[0.95rem] font-normal text-ink transition hover:bg-blush"
                >
                  <WhatsAppIcon className="size-[1.1rem]" />
                  Enviar pedido por WhatsApp
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
