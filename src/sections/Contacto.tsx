import { ArrowUpRight, Clock, Mail, MapPin, Phone } from 'lucide-react'
import { WhatsAppIcon } from '@/components/icons'
import { Reveal } from '@/components/Reveal'
import { StatusPill } from '@/components/StatusPill'
import { SITE, mapsHref, wa } from '@/lib/site'

const HORARIO = [
  ['Lun a vie', '8:30 – 6:30 pm'],
  ['Sábado', '8:30 – 2:00 pm'],
  ['Domingo', 'Cerrado'],
]

export function Contacto() {
  return (
    <section id="contacto" className="scroll-mt-20 overflow-x-clip bg-paper py-20 md:py-28">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 md:px-8 lg:grid-cols-[1fr_1fr] lg:gap-16">
        {/* mapa */}
        <Reveal className="order-last lg:order-first">
          <div className="overflow-hidden rounded-md ring-1 ring-ink/10">
            <iframe
              title="Mapa de Florería La Silla"
              src={`https://www.google.com/maps?q=${encodeURIComponent(SITE.mapsQuery)}&output=embed`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-80 w-full grayscale-[35%] md:h-[30rem]"
            />
          </div>
        </Reveal>

        <div>
          <Reveal>
            <h2 className="font-display text-[clamp(2.4rem,5.2vw,4.2rem)] leading-[1] text-ink">
              Contacto
            </h2>
            <p className="mt-5 max-w-lg text-[1.02rem] leading-relaxed text-stone">
              Pide por WhatsApp, llámanos o pasa a la tienda a escoger tus flores.
            </p>
          </Reveal>

          <Reveal delay={0.1} className="mt-8 grid gap-3 sm:grid-cols-2">
            <a href={wa()} target="_blank" rel="noopener noreferrer" className="group flex items-center gap-4 rounded-md bg-ink p-4 text-paper transition hover:bg-rose sm:col-span-2">
              <span className="grid size-11 shrink-0 place-items-center rounded-full bg-paper/10">
                <WhatsAppIcon className="size-5" />
              </span>
              <span className="flex-1">
                <span className="block text-[0.8rem] text-paper/65">WhatsApp</span>
                <span className="block text-xl font-light tracking-wide">{SITE.whatsapp}</span>
              </span>
              <ArrowUpRight className="size-5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
            <a href={SITE.phoneHref} className="flex items-center gap-3.5 rounded-md bg-blush-50 p-4 ring-1 ring-ink/5 transition hover:ring-rose/40">
              <Phone className="size-5 shrink-0 text-rose" strokeWidth={1.5} />
              <span>
                <span className="block text-[0.8rem] text-stone">Teléfono</span>
                <span className="block text-lg font-light tracking-wide text-ink">{SITE.phone}</span>
              </span>
            </a>
            <a href={`mailto:${SITE.email}`} className="flex items-center gap-3.5 rounded-md bg-blush-50 p-4 ring-1 ring-ink/5 transition hover:ring-rose/40">
              <Mail className="size-5 shrink-0 text-rose" strokeWidth={1.5} />
              <span className="min-w-0">
                <span className="block text-[0.8rem] text-stone">Correo</span>
                <span className="block truncate text-[0.95rem] text-ink">{SITE.email}</span>
              </span>
            </a>
            <a href={mapsHref} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3.5 rounded-md bg-blush-50 p-4 ring-1 ring-ink/5 transition hover:ring-rose/40 sm:col-span-2">
              <MapPin className="size-5 shrink-0 text-rose" strokeWidth={1.5} />
              <span className="flex-1">
                <span className="block text-[0.95rem] text-ink">{SITE.address}</span>
                <span className="block text-[0.82rem] text-stone">{SITE.city}</span>
              </span>
              <span className="hidden items-center gap-1 text-sm text-rose sm:inline-flex">
                Cómo llegar <ArrowUpRight className="size-3.5" />
              </span>
            </a>
          </Reveal>

          {/* horario compacto */}
          <Reveal delay={0.15} className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3 text-[0.9rem]">
            <span className="flex items-center gap-2 text-ink">
              <Clock className="size-4 text-rose" strokeWidth={1.5} /> Horario
            </span>
            {HORARIO.map(([d, h]) => (
              <span key={d} className="text-stone">
                {d} <span className="text-ink">{h}</span>
              </span>
            ))}
            <StatusPill className="bg-blush-50" />
          </Reveal>
        </div>
      </div>
    </section>
  )
}
