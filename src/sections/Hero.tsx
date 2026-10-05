import { motion } from 'framer-motion'
import { WhatsAppIcon } from '@/components/icons'
import { SITE, wa } from '@/lib/site'

const ease = [0.22, 1, 0.36, 1] as const

function rise(delay: number, play: boolean) {
  return {
    initial: { opacity: 0, y: 18 },
    animate: play ? { opacity: 1, y: 0 } : undefined,
    transition: { duration: 0.9, delay, ease },
  }
}

export function Hero({ play }: { play: boolean }) {
  return (
    <section id="inicio" className="relative isolate flex min-h-svh items-end overflow-hidden bg-ink text-paper">
      <motion.img
        src="img/boda-ramo-pareja.webp"
        alt="Ramo de novia con rosas, lavanda y suculenta, hecho por Florería La Silla"
        initial={{ scale: 1.06 }}
        animate={play ? { scale: 1 } : undefined}
        transition={{ duration: 2.4, ease }}
        className="absolute inset-0 -z-10 size-full object-cover object-[38%_50%]"
      />
      {/* oscurece abajo y a la izquierda para que el texto se lea sin tapar el ramo */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[linear-gradient(to_top,rgba(28,28,32,0.9)_0%,rgba(28,28,32,0.55)_50%,rgba(28,28,32,0.2)_100%)] md:bg-[linear-gradient(to_right,rgba(28,28,32,0.88)_0%,rgba(28,28,32,0.6)_40%,rgba(28,28,32,0.1)_70%)]"
      />

      <div className="mx-auto w-full max-w-7xl px-4 pt-32 pb-16 md:px-8 md:pb-24">
        <motion.p {...rise(0.1, play)} className="text-[0.75rem] tracking-[0.3em] text-paper/75 uppercase">
          Monterrey · Desde {SITE.since}
        </motion.p>

        <motion.h1 {...rise(0.2, play)} className="mt-5 max-w-3xl font-display text-[clamp(3rem,7vw,6.2rem)] leading-[0.95] font-normal">
          Florería La Silla
        </motion.h1>

        <motion.p {...rise(0.35, play)} className="mt-6 max-w-lg text-[1.05rem] leading-relaxed text-paper/85 md:text-lg">
          Arreglos para toda ocasión, flores para bodas y eventos, y coronas para funeral.
        </motion.p>

        <motion.div {...rise(0.5, play)} className="mt-9 flex flex-wrap items-center gap-3">
          <a
            href={wa()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-12 items-center gap-2.5 rounded-sm bg-paper px-7 text-[0.8rem] font-normal tracking-[0.16em] text-ink uppercase transition hover:bg-blush"
          >
            <WhatsAppIcon className="size-4" />
            Hacer un pedido
          </a>
          <a
            href="#arreglos"
            className="inline-flex min-h-12 items-center rounded-sm px-7 text-[0.8rem] font-normal tracking-[0.16em] text-paper uppercase ring-1 ring-paper/50 transition hover:bg-paper/10 hover:ring-paper"
          >
            Ver arreglos
          </a>
        </motion.div>
      </div>
    </section>
  )
}
