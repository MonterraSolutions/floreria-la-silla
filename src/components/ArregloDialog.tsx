import { useEffect, useId, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X, ZoomIn, ZoomOut } from 'lucide-react'
import { WhatsAppIcon } from '@/components/icons'
import { wa } from '@/lib/site'
import { cn } from '@/lib/utils'

export type ArregloItem = { img: string; name: string; note: string; pos?: string }

const field =
  'min-h-12 w-full rounded-sm bg-paper px-4 text-[1rem] text-ink ring-1 ring-ink/15 outline-none placeholder:text-stone/60 focus:ring-rose'

function hoyISO() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function fechaLarga(iso: string) {
  const [y, m, d] = iso.split('-').map(Number)
  return new Intl.DateTimeFormat('es-MX', { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date(y, m - 1, d))
}

/** Foto en grande con zoom y mini formulario que arma el pedido para WhatsApp. */
export function ArregloDialog({ item, onClose }: { item: ArregloItem | null; onClose: () => void }) {
  const [zoom, setZoom] = useState(false)
  const [origin, setOrigin] = useState('50% 50%')
  const [fecha, setFecha] = useState('')
  const [para, setPara] = useState('')
  const [tarjeta, setTarjeta] = useState('')
  const [nombre, setNombre] = useState('')
  const ids = { fecha: useId(), para: useId(), tarjeta: useId(), nombre: useId() }

  useEffect(() => {
    if (!item) return
    setZoom(false)
    document.body.classList.add('is-locked')
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.classList.remove('is-locked')
      window.removeEventListener('keydown', onKey)
    }
  }, [item, onClose])

  const mover = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    setOrigin(`${((e.clientX - r.left) / r.width) * 100}% ${((e.clientY - r.top) / r.height) * 100}%`)
  }

  const mensaje = item
    ? [
        `Hola, quiero pedir el arreglo "${item.name}".`,
        `Para: ${fecha ? fechaLarga(fecha) : '(por definir)'}`,
        para.trim() && `Es para: ${para.trim()}`,
        tarjeta.trim() && `Tarjeta: "${tarjeta.trim()}"`,
        nombre.trim() && `Mi nombre: ${nombre.trim()}`,
        '¿Me pasan precio y disponibilidad?',
      ]
        .filter(Boolean)
        .join('\n')
    : ''

  return (
    <AnimatePresence>
      {item && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-end justify-center bg-ink/70 sm:items-center sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onClose}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={item.name}
            className="relative flex max-h-[94svh] w-full max-w-5xl flex-col overflow-y-auto rounded-t-md bg-paper sm:rounded-md md:grid md:grid-cols-[1.1fr_1fr] md:overflow-hidden"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute top-3 right-3 z-10 grid size-11 cursor-pointer place-items-center rounded-full bg-paper/90 text-ink ring-1 ring-ink/10"
              aria-label="Cerrar"
            >
              <X className="size-5" />
            </button>

            {/* foto: clic o tap para acercar, y se recorre moviendo el mouse o el dedo */}
            <div
              className={cn('relative aspect-square shrink-0 overflow-hidden bg-blush md:aspect-auto md:h-full', zoom ? 'cursor-zoom-out touch-none' : 'cursor-zoom-in')}
              onClick={(e) => {
                mover(e)
                setZoom((z) => !z)
              }}
              onPointerMove={(e) => zoom && mover(e)}
            >
              <img
                src={`img/${item.img}.webp`}
                alt={`${item.name}: ${item.note.toLowerCase()}`}
                className={cn('size-full object-cover transition-transform duration-300 ease-out', item.pos)}
                style={{ transform: zoom ? 'scale(2.2)' : 'scale(1)', transformOrigin: origin }}
                draggable={false}
              />
              <span className="pointer-events-none absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-sm bg-paper/90 px-2.5 py-1.5 text-[0.75rem] text-ink">
                {zoom ? <ZoomOut className="size-3.5" /> : <ZoomIn className="size-3.5" />}
                {zoom ? 'Toca para alejar' : 'Toca para acercar'}
              </span>
            </div>

            <div className="flex flex-col p-5 sm:p-7 md:max-h-[94svh] md:overflow-y-auto">
              <h3 className="pr-10 font-display text-[2rem] leading-tight text-ink">{item.name}</h3>
              <p className="mt-1 text-[0.95rem] text-stone">{item.note}</p>

              <div className="mt-6 grid gap-4">
                <div>
                  <label htmlFor={ids.fecha} className="mb-2 block text-[0.9rem] text-ink">
                    ¿Para cuándo lo necesitas?
                  </label>
                  <input id={ids.fecha} type="date" min={hoyISO()} value={fecha} onChange={(e) => setFecha(e.target.value)} className={field} />
                </div>
                <div>
                  <label htmlFor={ids.para} className="mb-2 block text-[0.9rem] text-ink">
                    ¿Para quién es?
                  </label>
                  <input id={ids.para} value={para} onChange={(e) => setPara(e.target.value)} placeholder="Nombre de quien lo recibe" className={field} />
                </div>
                <div>
                  <label htmlFor={ids.tarjeta} className="mb-2 block text-[0.9rem] text-ink">
                    Mensaje de la tarjeta <span className="text-sm text-stone">(opcional)</span>
                  </label>
                  <textarea
                    id={ids.tarjeta}
                    value={tarjeta}
                    maxLength={200}
                    rows={3}
                    onChange={(e) => setTarjeta(e.target.value)}
                    placeholder="Ej. Feliz cumpleaños, te queremos mucho."
                    className={cn(field, 'py-3 leading-relaxed')}
                  />
                </div>
                <div>
                  <label htmlFor={ids.nombre} className="mb-2 block text-[0.9rem] text-ink">
                    Tu nombre
                  </label>
                  <input id={ids.nombre} value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Nombre y apellido" className={field} />
                </div>
              </div>

              <a
                href={wa(mensaje)}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex min-h-12 items-center justify-center gap-2.5 rounded-sm bg-ink px-7 text-[0.8rem] font-normal tracking-[0.16em] text-paper uppercase transition hover:bg-rose"
              >
                <WhatsAppIcon className="size-4" />
                Pedir por WhatsApp
              </a>

              <p className="mt-4 text-[0.78rem] leading-relaxed text-stone">
                Las flores pueden variar ligeramente en color, tamaño o variedad según la temporada y la disponibilidad. Te confirmamos
                precio y disponibilidad por WhatsApp.
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
