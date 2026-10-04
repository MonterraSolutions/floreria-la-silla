import { motion } from 'framer-motion'
import { ArrowDown, ArrowUpRight } from 'lucide-react'
import { WhatsAppIcon } from '@/components/icons'
import PetalConstellation from '@/components/ui/petal-constellation'
import { SocialTooltip } from '@/components/ui/social-media'
import { StatusPill } from '@/components/StatusPill'
import { SOCIALS } from '@/lib/socials'
import { SITE, wa } from '@/lib/site'

const ease = [0.22, 1, 0.36, 1] as const

function rise(delay: number, play: boolean) {
  return {
    initial: { opacity: 0, y: 26, filter: 'blur(6px)' },
    animate: play ? { opacity: 1, y: 0, filter: 'blur(0px)' } : undefined,
    transition: { duration: 1, delay, ease },
  }
}

export function Hero({ play }: { play: boolean }) {
  return (
    <section
      id="inicio"
      className="relative isolate flex min-h-dvh items-center overflow-hidden bg-[radial-gradient(ellipse_70%_60%_at_50%_45%,#fff7f6_0%,transparent_70%)] bg-blush pt-28 pb-24 md:pt-32"
    >
      <PetalConstellation />

      {/* velo claro detrás del texto: los pétalos siguen, pero no se comen las letras */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_42%_48%_at_50%_50%,rgba(255,250,249,0.94)_0%,rgba(255,250,249,0.62)_50%,transparent_78%)] max-md:bg-[radial-gradient(ellipse_95%_55%_at_50%_50%,rgba(255,250,249,0.93)_0%,rgba(255,250,249,0.55)_55%,transparent_85%)]"
      />

      <div className="relative mx-auto flex w-full max-w-4xl flex-col items-center px-4 text-center md:px-8">
        <motion.div {...rise(0.1, play)}>
          <StatusPill withDelivery className="max-w-full flex-wrap justify-center" />
        </motion.div>

        <motion.h1 {...rise(0.25, play)} className="mt-7 font-display text-[clamp(3.1rem,9vw,7.2rem)] leading-[0.95] tracking-[-0.01em] text-ink">
          Flores hechas
          <br />
          <span className="font-serif text-rose italic">a mano</span> en Monterrey
        </motion.h1>

        <motion.p {...rise(0.4, play)} className="mt-7 max-w-xl text-[1.08rem] leading-relaxed text-ink-soft md:text-lg">
          Arreglos para regalar, flores para tu evento y coronas para despedir. Desde {SITE.since}, con entrega a domicilio en todo
          Monterrey y su área metropolitana.
        </motion.p>

        <motion.div {...rise(0.55, play)} className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <a
            href={wa()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-12 items-center gap-2.5 rounded-full bg-ink px-7 text-[0.92rem] font-normal tracking-wide text-paper shadow-[0_14px_30px_-12px_rgba(23,20,20,0.55)] transition hover:-translate-y-0.5 hover:bg-rose"
          >
            <WhatsAppIcon className="size-[1.15rem]" />
            Pedir por WhatsApp
          </a>
          <a
            href="#arreglos"
            className="group inline-flex min-h-12 items-center gap-2 rounded-full bg-paper/70 px-6 text-[0.92rem] font-normal tracking-wide text-ink ring-1 ring-ink/15 backdrop-blur transition hover:ring-ink/40"
          >
            Ver arreglos
            <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </motion.div>

        <motion.div {...rise(0.7, play)} className="mt-10 mb-6 flex flex-col items-center">
          <SocialTooltip items={SOCIALS} />
        </motion.div>
      </div>

      <a
        href="#arreglos"
        className="absolute bottom-6 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-[0.68rem] tracking-[0.3em] text-stone uppercase"
        aria-label="Bajar a los arreglos"
      >
        Desliza
        <ArrowDown className="size-4 animate-bounce" />
      </a>
    </section>
  )
}
