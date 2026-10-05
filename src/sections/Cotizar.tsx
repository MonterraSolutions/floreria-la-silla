import { useId, useState } from 'react'
import { WhatsAppIcon } from '@/components/icons'
import { Reveal } from '@/components/Reveal'
import { SITE, wa } from '@/lib/site'
import { cn } from '@/lib/utils'

const EVENTOS = ['Boda', 'XV años', 'Bautizo o comunión', 'Cumpleaños o aniversario', 'Baby shower', 'Evento de empresa', 'Otro']

const PRESUPUESTOS = ['Menos de $10,000', '$10,000 a $25,000', '$25,000 a $50,000', 'Más de $50,000', 'Prefiero que me propongan']

const field =
  'min-h-12 w-full rounded-sm bg-paper px-4 text-[1rem] text-ink ring-1 ring-ink/15 outline-none placeholder:text-stone/60 focus:ring-2 focus:ring-rose'

function hoyISO() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function fechaLarga(iso: string) {
  const [y, m, d] = iso.split('-').map(Number)
  return new Intl.DateTimeFormat('es-MX', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(y, m - 1, d))
}

function Campo({ label, htmlFor, optional, className, children }: { label: string; htmlFor: string; optional?: boolean; className?: string; children: React.ReactNode }) {
  return (
    <div className={className}>
      <label htmlFor={htmlFor} className="mb-2 block text-[0.92rem] text-ink">
        {label}
        {optional && <span className="ml-1.5 text-sm text-stone">(opcional)</span>}
      </label>
      {children}
    </div>
  )
}

export function Cotizar() {
  const [f, setF] = useState({ evento: '', fecha: '', invitados: '', lugar: '', necesitas: '', presupuesto: '', nombre: '' })
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => setF({ ...f, [k]: e.target.value })
  const id = useId()
  const ids = Object.fromEntries(Object.keys(f).map((k) => [k, `${id}-${k}`])) as Record<keyof typeof f, string>

  const mensaje = [
    `Hola, soy ${f.nombre.trim() || '___'}. Quiero cotizar flores para ${f.evento ? `un evento: ${f.evento.toLowerCase()}` : 'un evento'}.`,
    f.fecha && `*Fecha:* ${fechaLarga(f.fecha)}`,
    f.invitados && `*Invitados:* ${f.invitados}`,
    f.lugar.trim() && `*Lugar:* ${f.lugar.trim()}`,
    f.necesitas.trim() && `*Necesito:* ${f.necesitas.trim()}`,
    f.presupuesto && `*Presupuesto:* ${f.presupuesto}`,
  ]
    .filter(Boolean)
    .join('\n')

  const listo = f.evento && f.fecha && f.nombre.trim().length > 1

  return (
    <section id="cotizar" className="scroll-mt-20 bg-blush-50 py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <Reveal className="max-w-2xl">
          <h2 className="font-display text-[clamp(2.2rem,4.6vw,3.6rem)] leading-[1] text-ink">Cotiza las flores de tu evento</h2>
          <p className="mt-4 text-[1.05rem] leading-relaxed text-stone">Llena lo que sepas y te respondemos por WhatsApp.</p>
        </Reveal>

        <div className="mt-12 grid gap-8 lg:grid-cols-[1.25fr_0.75fr]">
          <Reveal>
            <form
              className="grid gap-5 rounded-md bg-paper/60 p-5 ring-1 ring-ink/5 sm:grid-cols-2 sm:p-8"
              onSubmit={(e) => {
                e.preventDefault()
                if (listo) window.open(wa(mensaje), '_blank', 'noopener,noreferrer')
              }}
            >
              <Campo label="¿Qué vas a celebrar?" htmlFor={ids.evento}>
                <select id={ids.evento} value={f.evento} onChange={set('evento')} required className={cn(field, !f.evento && 'text-stone/70')}>
                  <option value="" disabled>
                    Escoge una opción
                  </option>
                  {EVENTOS.map((e) => (
                    <option key={e}>{e}</option>
                  ))}
                </select>
              </Campo>
              <Campo label="Fecha del evento" htmlFor={ids.fecha}>
                <input id={ids.fecha} type="date" min={hoyISO()} value={f.fecha} onChange={set('fecha')} required className={field} />
              </Campo>
              <Campo label="Número de invitados" htmlFor={ids.invitados} optional>
                <input id={ids.invitados} type="number" inputMode="numeric" min={1} value={f.invitados} onChange={set('invitados')} placeholder="Ej. 150" className={field} />
              </Campo>
              <Campo label="Lugar" htmlFor={ids.lugar} optional>
                <input id={ids.lugar} value={f.lugar} onChange={set('lugar')} placeholder="Salón, jardín o iglesia" className={field} />
              </Campo>
              <Campo label="¿Qué necesitas?" htmlFor={ids.necesitas} optional className="sm:col-span-2">
                <textarea
                  id={ids.necesitas}
                  rows={3}
                  value={f.necesitas}
                  onChange={set('necesitas')}
                  placeholder="Ej. ramo de novia, 15 centros de mesa y mesa de novios. Flores blancas y verdes."
                  className={cn(field, 'py-3 leading-relaxed')}
                />
              </Campo>
              <Campo label="Presupuesto aproximado" htmlFor={ids.presupuesto} optional>
                <select id={ids.presupuesto} value={f.presupuesto} onChange={set('presupuesto')} className={cn(field, !f.presupuesto && 'text-stone/70')}>
                  <option value="">Sin definir</option>
                  {PRESUPUESTOS.map((p) => (
                    <option key={p}>{p}</option>
                  ))}
                </select>
              </Campo>
              <Campo label="Tu nombre" htmlFor={ids.nombre}>
                <input id={ids.nombre} value={f.nombre} onChange={set('nombre')} required placeholder="Nombre y apellido" className={field} />
              </Campo>

              <div className="sm:col-span-2">
                <button
                  type="submit"
                  className="inline-flex min-h-12 w-full cursor-pointer items-center justify-center gap-2.5 rounded-sm bg-ink px-7 text-[0.8rem] font-normal tracking-[0.16em] text-paper uppercase transition hover:bg-rose sm:w-auto"
                >
                  <WhatsAppIcon className="size-4" />
                  Enviar por WhatsApp
                </button>
              </div>
            </form>
          </Reveal>

          {/* vista previa del mensaje */}
          <aside className="lg:sticky lg:top-24 lg:self-start" aria-label="Vista previa del mensaje">
            <div className="overflow-hidden rounded-md bg-[#EFE7DE] ring-1 ring-ink/5">
              <div className="flex items-center gap-3 bg-[#1F2C33] px-5 py-3.5 text-white">
                <img src="brand/favicon.png" alt="" className="size-10 rounded-full" />
                <div className="leading-tight">
                  <p className="text-[0.95rem]">Florería La Silla</p>
                  <p className="text-xs text-white/60">{SITE.whatsapp}</p>
                </div>
              </div>
              <div className="min-h-[16rem] bg-[radial-gradient(#d9cfc3_1px,transparent_1px)] [background-size:16px_16px] p-4 sm:p-5">
                <p className="mx-auto mb-4 w-fit rounded-lg bg-white/70 px-3 py-1 text-[0.7rem] text-stone">Así va a llegar tu mensaje</p>
                <div className="ml-auto max-w-[94%] rounded-xl rounded-tr-sm bg-[#D9FDD3] px-3.5 py-2.5 text-[0.88rem] leading-relaxed whitespace-pre-wrap text-[#111b21] shadow-sm">
                  {mensaje.split('\n').map((line, i) => {
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
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  )
}
