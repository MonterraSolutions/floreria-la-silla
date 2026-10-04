import { useEffect, useId, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowLeft, ArrowRight, Baby, Briefcase, Cake, Check, Church, Crown, Gift, Heart, ImagePlus, Sparkles,
  type LucideIcon,
} from 'lucide-react'
import { WhatsAppIcon } from '@/components/icons'
import { Reveal } from '@/components/Reveal'
import { SITE, wa } from '@/lib/site'
import { cn } from '@/lib/utils'

/* ---------------- opciones ---------------- */

type Evento = 'Boda' | 'XV años' | 'Bautizo o comunión' | 'Cumpleaños o aniversario' | 'Baby shower' | 'Evento de empresa' | 'Arreglo para regalo' | 'Otro'

const EVENTOS: { id: Evento; icon: LucideIcon; hint: string }[] = [
  { id: 'Boda', icon: Heart, hint: 'Civil o religiosa' },
  { id: 'XV años', icon: Crown, hint: 'Misa y fiesta' },
  { id: 'Bautizo o comunión', icon: Church, hint: 'Iglesia y recepción' },
  { id: 'Cumpleaños o aniversario', icon: Cake, hint: 'En casa o salón' },
  { id: 'Baby shower', icon: Baby, hint: 'Fondos y mesas' },
  { id: 'Evento de empresa', icon: Briefcase, hint: 'Lobby, escenario, mesas' },
  { id: 'Arreglo para regalo', icon: Gift, hint: 'Uno o varios arreglos' },
  { id: 'Otro', icon: Sparkles, hint: 'Cuéntanos qué es' },
]

/** Lo que se suele pedir en cada evento; el primer bloque se muestra en ese orden. */
const NECESIDADES: Record<Evento, string[]> = {
  Boda: ['Ramo de novia', 'Botoneras', 'Centros de mesa', 'Mesa de novios', 'Iglesia o altar', 'Arco o entrada', 'Ramos de damas', 'Pétalos', 'Arreglo del coche'],
  'XV años': ['Ramo de quinceañera', 'Centros de mesa', 'Mesa principal', 'Iglesia', 'Arco o entrada', 'Fondo para fotos', 'Pastel'],
  'Bautizo o comunión': ['Iglesia', 'Arreglo para la Virgen', 'Centros de mesa', 'Mesa de postres', 'Mesa principal', 'Recuerdos con flor'],
  'Cumpleaños o aniversario': ['Arreglo principal', 'Centros de mesa', 'Mesa de postres', 'Pastel', 'Arreglo para regalo'],
  'Baby shower': ['Fondo de flores', 'Centros de mesa', 'Mesa de postres', 'Arco o entrada', 'Jardín al piso'],
  'Evento de empresa': ['Recepción o lobby', 'Centros de mesa', 'Escenario o podio', 'Arreglos para regalar', 'Arreglos semanales'],
  'Arreglo para regalo': ['Ramo', 'Arreglo en jarrón', 'Caja de flores', 'Con vino', 'Con chocolates', 'Varios arreglos iguales'],
  Otro: ['Centros de mesa', 'Arreglo principal', 'Arco o entrada', 'Ramo', 'No sé todavía'],
}

const ESTILO_CENTROS = ['Altos', 'Bajos', 'Combinados', 'Que me recomienden']

const FLORES = ['Rosas', 'Tulipanes', 'Hortensias', 'Orquídeas', 'Peonías', 'Girasoles', 'Lilis', 'Alcatraces', 'Gerberas', 'Que me recomienden']

const PRESUPUESTOS = ['Menos de $10,000', '$10,000 a $25,000', '$25,000 a $50,000', 'Más de $50,000', 'Prefiero que me propongan']

const MUNICIPIOS = ['Monterrey', 'San Pedro Garza García', 'San Nicolás', 'Guadalupe', 'Apodaca', 'Santa Catarina', 'Escobedo', 'García', 'Juárez', 'Santiago', 'Otro']

const PASOS = ['Evento', 'Lo que necesitas', 'Detalles', 'Tus datos'] as const

/* ---------------- estado ---------------- */

interface Form {
  evento: Evento | null
  necesidades: string[]
  estiloCentros: string
  fecha: string
  invitados: number
  mesas: number | null
  municipio: string
  lugar: string
  flores: string[]
  presupuesto: string
  nombre: string
  idea: string
  fotos: boolean
}

const EMPTY: Form = {
  evento: null,
  necesidades: [],
  estiloCentros: '',
  fecha: '',
  invitados: 100,
  mesas: null,
  municipio: 'Monterrey',
  lugar: '',
  flores: [],
  presupuesto: '',
  nombre: '',
  idea: '',
  fotos: false,
}

const STORAGE = 'lasilla-cotizacion'

/** Si el borrador guardado ya trae fecha, el cliente ya pasó por los detalles. */
function f0Done() {
  try {
    return !!JSON.parse(localStorage.getItem(STORAGE) || '{}').fecha
  } catch {
    return false
  }
}

function loadDraft(): Form {
  try {
    const raw = localStorage.getItem(STORAGE)
    if (raw) return { ...EMPTY, ...JSON.parse(raw) }
  } catch {
    /* sin almacenamiento: empieza vacío */
  }
  return EMPTY
}

const isoToday = () => {
  const d = new Date()
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset())
  return d.toISOString().slice(0, 10)
}

function daysUntil(iso: string) {
  if (!iso) return null
  const [y, m, d] = iso.split('-').map(Number)
  const target = new Date(y, m - 1, d)
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  return Math.round((target.getTime() - now.getTime()) / 86_400_000)
}

function fechaLarga(iso: string) {
  const [y, m, d] = iso.split('-').map(Number)
  return new Intl.DateTimeFormat('es-MX', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(y, m - 1, d))
}

/** Los regalos no llevan invitados ni mesas; se cotizan por piezas. */
const esRegalo = (e: Evento | null) => e === 'Arreglo para regalo'

function buildMessage(f: Form, conDetalles: boolean) {
  const L: string[] = []
  L.push(`Hola, soy ${f.nombre.trim() || '___'}. Quiero cotizar flores para ${f.evento ? (esRegalo(f.evento) ? 'un regalo' : `un evento: ${f.evento.toLowerCase()}`) : '___'}.`)
  L.push('')
  if (f.fecha) L.push(`*Fecha:* ${fechaLarga(f.fecha)}`)
  if (conDetalles) {
    if (esRegalo(f.evento)) {
      L.push(`*Piezas:* ${f.invitados}`)
    } else {
      const mesas = f.mesas ?? Math.ceil(f.invitados / 10)
      L.push(`*Invitados:* ${f.invitados} (${f.mesas ? '' : 'unas '}${mesas} mesas)`)
    }
    const lugar = [f.lugar.trim(), f.municipio].filter(Boolean).join(', ')
    if (lugar) L.push(`*${esRegalo(f.evento) ? 'Entrega en' : 'Lugar'}:* ${lugar}`)
  }
  if (f.necesidades.length) {
    const items = f.necesidades.map((n) => (n === 'Centros de mesa' && f.estiloCentros ? `Centros de mesa (${f.estiloCentros.toLowerCase()})` : n))
    L.push(`*Necesito:* ${items.join(', ')}`)
  }
  if (f.flores.length) L.push(`*Flores:* ${f.flores.join(', ')}`)
  if (f.presupuesto && !esRegalo(f.evento)) L.push(`*Presupuesto:* ${f.presupuesto}`)
  if (f.idea.trim()) {
    L.push('')
    L.push(`*Mi idea:* ${f.idea.trim()}`)
  }
  if (f.fotos) {
    L.push('')
    L.push('Tengo fotos de referencia, se las mando por aquí.')
  }
  return L.join('\n')
}

/* ---------------- UI chica ---------------- */

function Chip({ active, onClick, children, className }: { active: boolean; onClick: () => void; children: React.ReactNode; className?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full px-4 text-[0.9rem] font-normal ring-1 transition',
        active ? 'bg-ink text-paper ring-ink' : 'bg-blush-50 text-ink-soft ring-ink/10 hover:ring-ink/40',
        className,
      )}
    >
      {active && <Check className="size-3.5" />}
      {children}
    </button>
  )
}

function Label({ children, htmlFor, optional }: { children: React.ReactNode; htmlFor?: string; optional?: boolean }) {
  return (
    <label htmlFor={htmlFor} className="mb-2.5 block text-[0.95rem] text-ink">
      {children}
      {optional && <span className="ml-1.5 text-sm text-stone">(opcional)</span>}
    </label>
  )
}

/* ---------------- componente ---------------- */

export function Cotizar() {
  const [f, setF] = useState<Form>(loadDraft)
  const [step, setStep] = useState(0)
  const [dir, setDir] = useState(1)
  const [maxStep, setMaxStep] = useState(() => (f0Done() ? 3 : 0))
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const topRef = useRef<HTMLDivElement>(null)
  const ids = { fecha: useId(), inv: useId(), mesas: useId(), mun: useId(), lugar: useId(), nombre: useId(), idea: useId() }

  const set = <K extends keyof Form>(k: K, v: Form[K]) => setF((p) => ({ ...p, [k]: v }))
  const toggle = (k: 'necesidades' | 'flores', v: string) =>
    setF((p) => {
      let list = p[k].includes(v) ? p[k].filter((x) => x !== v) : [...p[k], v]
      // "Que me recomienden" no se combina con flores concretas
      const libre = 'Que me recomienden'
      if (k === 'flores') list = v === libre ? (list.includes(v) ? [v] : []) : list.filter((x) => x !== libre)
      return { ...p, [k]: list }
    })

  // guarda el borrador para que no se pierda si cierran la pestaña
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE, JSON.stringify(f))
    } catch {
      /* sin almacenamiento */
    }
  }, [f])

  // otras secciones pueden abrir el cotizador con un evento ya escogido
  useEffect(() => {
    const onPick = (e: Event) => {
      const ev = (e as CustomEvent<Evento>).detail
      setF((p) => (p.evento === ev ? p : { ...p, evento: ev, necesidades: [] }))
      setDir(1)
      setStep(1)
    }
    window.addEventListener('cotizar', onPick)
    return () => window.removeEventListener('cotizar', onPick)
  }, [])

  const dias = daysUntil(f.fecha)
  const regalo = esRegalo(f.evento)
  const mesasSugeridas = Math.ceil(f.invitados / 10)

  const errors = useMemo(() => {
    const e: Record<string, string> = {}
    if (!f.evento) e.evento = 'Escoge qué vas a celebrar.'
    if (!f.necesidades.length) e.necesidades = 'Marca al menos una opción. Si no sabes, elige la más cercana.'
    if (!f.fecha) e.fecha = 'Pon la fecha, aunque sea tentativa.'
    else if (dias !== null && dias < 0) e.fecha = 'Esa fecha ya pasó.'
    if (!f.invitados || f.invitados < 1) e.invitados = 'Pon un número aproximado.'
    if (f.nombre.trim().length < 2) e.nombre = 'Escribe tu nombre para saber con quién hablamos.'
    return e
  }, [f, dias])

  const stepFields: string[][] = [['evento'], ['necesidades'], ['fecha', 'invitados'], ['nombre']]
  const stepValid = (s: number) => stepFields[s].every((k) => !errors[k])
  const allValid = stepFields.every((_, i) => stepValid(i))

  const go = (to: number) => {
    if (to > step && !stepValid(step)) {
      setTouched((t) => ({ ...t, ...Object.fromEntries(stepFields[step].map((k) => [k, true])) }))
      return
    }
    setDir(to > step ? 1 : -1)
    setStep(to)
    topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  useEffect(() => setMaxStep((m) => Math.max(m, step)), [step])
  const message = buildMessage(f, maxStep >= 2)
  const err = (k: string) =>
    touched[k] && errors[k] ? (
      <p role="alert" className="mt-2 text-sm text-rose">
        {errors[k]}
      </p>
    ) : null

  const send = () => {
    if (!allValid) {
      setTouched({ evento: true, necesidades: true, fecha: true, invitados: true, nombre: true })
      const first = stepFields.findIndex((_, i) => !stepValid(i))
      if (first !== -1 && first !== step) go(first)
      return
    }
    window.open(wa(message), '_blank', 'noopener,noreferrer')
  }

  const reset = () => {
    setF(EMPTY)
    setMaxStep(0)
    setTouched({})
    setDir(-1)
    setStep(0)
  }

  return (
    <section id="cotizar" className="scroll-mt-20 bg-blush-50 pt-16 pb-20 md:pt-20 md:pb-28">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <Reveal className="grid gap-8 md:grid-cols-[1fr_0.8fr] md:items-end">
          <div>
            <span className="eyebrow">Cotiza</span>
            <h2 className="mt-5 font-display text-[clamp(2.2rem,4.6vw,3.6rem)] leading-[1] text-ink">
              Arma tu cotización <span className="font-serif text-rose italic">en dos minutos</span>
            </h2>
          </div>
          <p className="max-w-md text-[1.05rem] leading-relaxed text-stone md:justify-self-end">
            Contesta cuatro preguntas y te abrimos WhatsApp con todo ya escrito. Así no tienes que explicar dos veces y te
            respondemos más rápido.
          </p>
        </Reveal>

        <div ref={topRef} className="mt-12 grid scroll-mt-28 gap-8 lg:grid-cols-[1.25fr_0.75fr]">
          {/* ---------- formulario ---------- */}
          <div className="rounded-[2rem] bg-paper p-5 ring-1 ring-ink/5 sm:p-8 md:p-10">
            {/* progreso */}
            <ol className="flex items-center gap-2" aria-label="Pasos">
              {PASOS.map((p, i) => (
                <li key={p} className="flex flex-1 flex-col gap-2">
                  <button
                    type="button"
                    onClick={() => (i < step || stepFields.slice(0, i).every((_, j) => stepValid(j)) ? go(i) : undefined)}
                    className="group flex cursor-pointer flex-col gap-2 text-left"
                    aria-current={i === step ? 'step' : undefined}
                  >
                    <span className="h-1 w-full overflow-hidden rounded-full bg-ink/10">
                      <motion.span
                        className="block h-full rounded-full bg-rose"
                        initial={false}
                        animate={{ width: i < step ? '100%' : i === step ? '50%' : '0%' }}
                        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                      />
                    </span>
                    <span className={cn('hidden text-xs tracking-wide sm:block', i === step ? 'text-ink' : 'text-stone')}>
                      {i + 1}. {p}
                    </span>
                  </button>
                </li>
              ))}
            </ol>
            <p className="mt-3 text-xs text-stone sm:hidden">
              Paso {step + 1} de 4 · {PASOS[step]}
            </p>

            <div className="relative mt-8 min-h-[26rem]">
              <AnimatePresence mode="wait" custom={dir}>
                <motion.div
                  key={step}
                  custom={dir}
                  initial={{ opacity: 0, x: dir * 28 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: dir * -28 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                >
                  {step === 0 && (
                    <fieldset>
                      <legend className="font-display text-3xl text-ink">¿Qué vas a celebrar?</legend>
                      <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
                        {EVENTOS.map(({ id, icon: Icon, hint }) => {
                          const active = f.evento === id
                          return (
                            <button
                              key={id}
                              type="button"
                              aria-pressed={active}
                              onClick={() => {
                                setF((p) => ({ ...p, evento: id, necesidades: p.evento === id ? p.necesidades : [] }))
                                setDir(1)
                                window.setTimeout(() => setStep(1), 220)
                              }}
                              className={cn(
                                'relative flex min-h-32 cursor-pointer flex-col items-start justify-between rounded-2xl p-4 text-left ring-1 transition',
                                active ? 'bg-ink text-paper ring-ink' : 'bg-blush-50 text-ink ring-ink/5 hover:-translate-y-0.5 hover:ring-ink/30',
                              )}
                            >
                              <Icon className={cn('size-6', active ? 'text-blush' : 'text-rose')} strokeWidth={1.4} />
                              <span>
                                <span className="block text-[0.98rem] leading-tight font-normal">{id}</span>
                                <span className={cn('mt-1 block text-xs', active ? 'text-paper/60' : 'text-stone')}>{hint}</span>
                              </span>
                              {active && <Check className="absolute top-3 right-3 size-4 text-blush" />}
                            </button>
                          )
                        })}
                      </div>
                      {err('evento')}
                    </fieldset>
                  )}

                  {step === 1 && f.evento && (
                    <div className="grid gap-9">
                      <fieldset>
                        <legend className="font-display text-3xl text-ink">
                          {regalo ? '¿Qué tipo de arreglo?' : '¿Qué flores necesitas?'}
                        </legend>
                        <p className="mt-2 text-sm text-stone">Puedes marcar varias. Lo de {f.evento.toLowerCase()} que más nos piden va primero.</p>
                        <div className="mt-6 flex flex-wrap gap-2.5">
                          {NECESIDADES[f.evento].map((n) => (
                            <Chip key={n} active={f.necesidades.includes(n)} onClick={() => toggle('necesidades', n)}>
                              {n}
                            </Chip>
                          ))}
                        </div>
                        {err('necesidades')}
                      </fieldset>

                      <AnimatePresence>
                        {f.necesidades.includes('Centros de mesa') && (
                          <motion.fieldset initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                            <legend className="text-[0.95rem] text-ink">¿Cómo te imaginas los centros de mesa?</legend>
                            <div className="mt-3 flex flex-wrap gap-2.5">
                              {ESTILO_CENTROS.map((s) => (
                                <Chip key={s} active={f.estiloCentros === s} onClick={() => set('estiloCentros', f.estiloCentros === s ? '' : s)}>
                                  {s}
                                </Chip>
                              ))}
                            </div>
                          </motion.fieldset>
                        )}
                      </AnimatePresence>

                      <fieldset>
                        <legend className="text-[0.95rem] text-ink">
                          ¿Alguna flor en especial? <span className="ml-1 text-sm text-stone">(opcional)</span>
                        </legend>
                        <div className="mt-3 flex flex-wrap gap-2.5">
                          {FLORES.map((fl) => (
                            <Chip key={fl} active={f.flores.includes(fl)} onClick={() => toggle('flores', fl)}>
                              {fl}
                            </Chip>
                          ))}
                        </div>
                      </fieldset>
                    </div>
                  )}

                  {step === 2 && (
                    <div className="grid gap-8">
                      <h3 className="font-display text-3xl text-ink">Los detalles</h3>

                      <div className="grid gap-6 sm:grid-cols-2">
                        <div>
                          <Label htmlFor={ids.fecha}>{regalo ? '¿Para cuándo?' : 'Fecha del evento'}</Label>
                          <input
                            id={ids.fecha}
                            type="date"
                            min={isoToday()}
                            value={f.fecha}
                            onChange={(e) => set('fecha', e.target.value)}
                            onBlur={() => setTouched((t) => ({ ...t, fecha: true }))}
                            aria-invalid={!!(touched.fecha && errors.fecha)}
                            className="min-h-12 w-full rounded-xl bg-blush-50 px-4 text-[1rem] text-ink ring-1 ring-ink/15 outline-none focus:ring-2 focus:ring-rose"
                          />
                          {err('fecha')}
                          {!errors.fecha && dias !== null && (
                            <p className={cn('mt-2 text-sm', !regalo && dias < 21 ? 'text-rose' : 'text-stone')}>
                              {dias === 0
                                ? 'Es hoy.'
                                : `Faltan ${dias} ${dias === 1 ? 'día' : 'días'}.`}{' '}
                              {!regalo && dias < 21 && `Es poco tiempo para un evento: márcanos al ${SITE.phone} para confirmar disponibilidad.`}
                              {regalo && dias <= 1 && 'Para hoy o mañana, mejor pídelo antes de las 12:00.'}
                            </p>
                          )}
                        </div>

                        <div>
                          <Label htmlFor={ids.mun}>{regalo ? 'Se entrega en' : 'Municipio'}</Label>
                          <select
                            id={ids.mun}
                            value={f.municipio}
                            onChange={(e) => set('municipio', e.target.value)}
                            className="min-h-12 w-full rounded-xl bg-blush-50 px-4 text-[1rem] text-ink ring-1 ring-ink/15 outline-none focus:ring-2 focus:ring-rose"
                          >
                            {MUNICIPIOS.map((m) => (
                              <option key={m}>{m}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* invitados con cálculo de mesas */}
                      <div>
                        <Label htmlFor={ids.inv}>{regalo ? '¿Cuántos arreglos?' : '¿Cuántos invitados?'}</Label>
                        <div className="flex items-center gap-4">
                          <input
                            type="range"
                            min={regalo ? 1 : 10}
                            max={regalo ? 50 : 600}
                            step={regalo ? 1 : 10}
                            value={f.invitados}
                            onChange={(e) => setF((p) => ({ ...p, invitados: Number(e.target.value), mesas: null }))}
                            aria-label={regalo ? 'Número de arreglos' : 'Número de invitados'}
                            className="h-2 flex-1 cursor-pointer accent-rose"
                          />
                          <input
                            id={ids.inv}
                            type="number"
                            inputMode="numeric"
                            min={1}
                            max={2000}
                            value={f.invitados || ''}
                            onChange={(e) => setF((p) => ({ ...p, invitados: Math.max(0, Number(e.target.value)), mesas: null }))}
                            onBlur={() => setTouched((t) => ({ ...t, invitados: true }))}
                            className="min-h-12 w-24 rounded-xl bg-blush-50 px-3 text-center text-[1rem] text-ink ring-1 ring-ink/15 outline-none focus:ring-2 focus:ring-rose"
                          />
                        </div>
                        {err('invitados')}
                        {!regalo && f.invitados > 0 && (
                          <div className="mt-4 flex flex-wrap items-center gap-3 rounded-xl bg-blush-50 p-3.5 text-sm text-ink-soft ring-1 ring-ink/5">
                            <span>
                              Son unas <strong className="font-normal text-ink">{mesasSugeridas} mesas</strong> de 10.
                            </span>
                            <label htmlFor={ids.mesas} className="flex items-center gap-2 text-stone">
                              ¿Ya sabes cuántas?
                              <input
                                id={ids.mesas}
                                type="number"
                                inputMode="numeric"
                                min={1}
                                placeholder={String(mesasSugeridas)}
                                value={f.mesas ?? ''}
                                onChange={(e) => set('mesas', e.target.value ? Math.max(1, Number(e.target.value)) : null)}
                                className="min-h-10 w-20 rounded-lg bg-paper px-2 text-center text-ink ring-1 ring-ink/10 outline-none focus:ring-2 focus:ring-rose"
                              />
                            </label>
                          </div>
                        )}
                      </div>

                      <div>
                        <Label htmlFor={ids.lugar} optional>
                          {regalo ? 'Colonia o dirección' : 'Salón, jardín o iglesia'}
                        </Label>
                        <input
                          id={ids.lugar}
                          value={f.lugar}
                          onChange={(e) => set('lugar', e.target.value)}
                          placeholder={regalo ? 'Ej. Col. Del Valle' : 'Ej. Quinta Los Encinos'}
                          className="min-h-12 w-full rounded-xl bg-blush-50 px-4 text-[1rem] text-ink ring-1 ring-ink/15 outline-none placeholder:text-stone/60 focus:ring-2 focus:ring-rose"
                        />
                      </div>

                      {!regalo && (
                      <fieldset>
                        <legend className="mb-2.5 text-[0.95rem] text-ink">
                          Presupuesto aproximado <span className="ml-1 text-sm text-stone">(opcional)</span>
                        </legend>
                        <div className="flex flex-wrap gap-2.5">
                          {PRESUPUESTOS.map((p) => (
                            <Chip key={p} active={f.presupuesto === p} onClick={() => set('presupuesto', f.presupuesto === p ? '' : p)}>
                              {p}
                            </Chip>
                          ))}
                        </div>
                        <p className="mt-2 text-xs text-stone">Nos ayuda a proponerte opciones que sí te sirvan.</p>
                      </fieldset>
                      )}
                    </div>
                  )}

                  {step === 3 && (
                    <div className="grid gap-7">
                      <h3 className="font-display text-3xl text-ink">Ya casi</h3>
                      <div>
                        <Label htmlFor={ids.nombre}>Tu nombre</Label>
                        <input
                          id={ids.nombre}
                          autoComplete="name"
                          value={f.nombre}
                          onChange={(e) => set('nombre', e.target.value)}
                          onBlur={() => setTouched((t) => ({ ...t, nombre: true }))}
                          aria-invalid={!!(touched.nombre && errors.nombre)}
                          placeholder="Nombre y apellido"
                          className="min-h-12 w-full rounded-xl bg-blush-50 px-4 text-[1rem] text-ink ring-1 ring-ink/15 outline-none placeholder:text-stone/60 focus:ring-2 focus:ring-rose"
                        />
                        {err('nombre')}
                      </div>
                      <div>
                        <Label htmlFor={ids.idea} optional>
                          Cuéntanos tu idea
                        </Label>
                        <textarea
                          id={ids.idea}
                          rows={4}
                          maxLength={500}
                          value={f.idea}
                          onChange={(e) => set('idea', e.target.value)}
                          placeholder="Ej. Boda en jardín, algo romántico con mucha flor blanca y verde. La novia quiere peonías en el ramo."
                          className="w-full rounded-xl bg-blush-50 px-4 py-3 text-[1rem] leading-relaxed text-ink ring-1 ring-ink/15 outline-none placeholder:text-stone/60 focus:ring-2 focus:ring-rose"
                        />
                        <p className="mt-1 text-right text-xs text-stone">{f.idea.length}/500</p>
                      </div>
                      <label className="flex cursor-pointer items-start gap-3 rounded-xl bg-blush-50 p-4 ring-1 ring-ink/10">
                        <input type="checkbox" checked={f.fotos} onChange={(e) => set('fotos', e.target.checked)} className="mt-0.5 size-5 accent-rose" />
                        <span>
                          <span className="flex items-center gap-2 text-ink">
                            <ImagePlus className="size-4 text-rose" /> Tengo fotos de referencia
                          </span>
                          <span className="mt-0.5 block text-sm text-stone">Las mandas en el chat de WhatsApp, justo después de este mensaje.</span>
                        </span>
                      </label>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* navegación */}
            <div className="mt-8 flex items-center justify-between gap-3 border-t border-ink/10 pt-6">
              {step > 0 ? (
                <button type="button" onClick={() => go(step - 1)} className="inline-flex min-h-12 cursor-pointer items-center gap-2 rounded-full px-4 text-[0.92rem] text-ink-soft hover:text-ink">
                  <ArrowLeft className="size-4" /> Atrás
                </button>
              ) : (
                <span />
              )}
              {step < 3 ? (
                <button
                  type="button"
                  onClick={() => go(step + 1)}
                  className="inline-flex min-h-12 cursor-pointer items-center gap-2 rounded-full bg-ink px-7 text-[0.92rem] text-paper transition hover:bg-rose"
                >
                  Siguiente <ArrowRight className="size-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={send}
                  className="inline-flex min-h-12 cursor-pointer items-center gap-2.5 rounded-full bg-[#1FAF54] px-7 text-[0.95rem] text-white shadow-[0_14px_30px_-12px_rgba(31,175,84,0.7)] transition hover:-translate-y-0.5 hover:bg-[#189446]"
                >
                  <WhatsAppIcon className="size-5" /> Enviar por WhatsApp
                </button>
              )}
            </div>
          </div>

          {/* ---------- vista previa del mensaje ---------- */}
          <aside className="lg:sticky lg:top-24 lg:self-start" aria-label="Vista previa del mensaje">
            <div className="overflow-hidden rounded-[2rem] bg-[#EFE7DE] shadow-[0_30px_60px_-30px_rgba(60,20,30,0.35)] ring-1 ring-ink/5">
              <div className="flex items-center gap-3 bg-[#1F2C33] px-5 py-3.5 text-white">
                <img src="brand/favicon.png" alt="" className="size-10 rounded-full" />
                <div className="leading-tight">
                  <p className="text-[0.95rem]">Florería La Silla</p>
                  <p className="text-xs text-white/60">{SITE.whatsapp}</p>
                </div>
              </div>
              <div className="min-h-[22rem] bg-[radial-gradient(#d9cfc3_1px,transparent_1px)] [background-size:16px_16px] p-4 sm:p-5">
                <p className="mx-auto mb-4 w-fit rounded-lg bg-white/70 px-3 py-1 text-[0.7rem] text-stone">Así va a llegar tu mensaje</p>
                <motion.div layout className="ml-auto max-w-[94%] rounded-xl rounded-tr-sm bg-[#D9FDD3] px-3.5 py-2.5 text-[0.88rem] leading-relaxed whitespace-pre-wrap text-[#111b21] shadow-sm">
                  {message.split('\n').map((line, i) => {
                    const m = line.match(/^\*(.+?):\*\s?(.*)$/)
                    return (
                      <span key={i} className="block min-h-[1em]">
                        {m ? (
                          <>
                            <strong className="font-medium">{m[1]}:</strong> {m[2]}
                          </>
                        ) : (
                          line
                        )}
                      </span>
                    )
                  })}
                  <span className="mt-1 block text-right text-[0.65rem] text-[#667781]">ahora ✓✓</span>
                </motion.div>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between px-2 text-xs text-stone">
              <span>Tus respuestas se guardan en este navegador.</span>
              <button type="button" onClick={reset} className="cursor-pointer underline underline-offset-2 hover:text-rose">
                Empezar de nuevo
              </button>
            </div>
          </aside>
        </div>
      </div>
    </section>
  )
}

/** Para abrir el cotizador desde otra sección con un evento ya elegido. */
export function abrirCotizador(evento: Evento) {
  window.dispatchEvent(new CustomEvent('cotizar', { detail: evento }))
  document.getElementById('cotizar')?.scrollIntoView({ behavior: 'smooth' })
}
