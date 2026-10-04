import { ArrowDown } from 'lucide-react'
import { Reveal } from '@/components/Reveal'
import { ScrollChoreography } from '@/components/ui/scroll-choreography'

export function Eventos() {
  return (
    <section id="eventos" className="scroll-mt-20 bg-blush-50">
      <div className="mx-auto max-w-7xl px-4 pt-20 md:px-8 md:pt-28">
        <Reveal className="mx-auto max-w-5xl text-center">
          <span className="eyebrow">Eventos</span>
          <h2 className="mt-5 font-display text-[clamp(2.4rem,5.2vw,4.2rem)] leading-[1] text-ink">
            Las flores de tu evento, <span className="font-serif text-rose italic">de la entrada a la última mesa</span>
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-[1.02rem] leading-relaxed text-stone">
            Bodas, XV años, bautizos, baby showers y eventos de empresa. Ramo, centros de mesa, mesa de novios, altar y entrada.
          </p>
        </Reveal>
      </div>

      <ScrollChoreography
        className="mt-2"
        images={{
          topLeft: { src: 'img/boda-ramo-pareja-sm.webp', alt: 'Ramo de novia en tonos lila y rosa con suculenta' },
          topRight: { src: 'img/salon-cielo-estrellado.webp', alt: 'Salón de eventos con arreglos de rosas y lilis bajo un techo de luces' },
          bottomLeft: { src: 'img/arbol-cristal-salon-sm.webp', alt: 'Árbol de cristal con rosas colgantes en salón con vista a la ciudad' },
          bottomRight: { src: 'img/mesa-novios-sm.webp', alt: 'Mesa de novios con flores al frente y árboles blancos detrás' },
        }}
        overlay={
          <div className="mx-auto w-full max-w-7xl px-5 pb-14 text-paper md:px-10 md:pb-20">
            <p className="font-serif text-xl text-blush italic md:text-2xl">Eventos sociales y de empresa</p>
            <p className="mt-2 max-w-5xl font-display text-[clamp(2.2rem,6vw,5rem)] leading-[1]">Bodas · XV años · Bautizos · Baby shower</p>
            <a
              href="#cotizar"
              className="mt-7 inline-flex min-h-12 items-center gap-2.5 rounded-full bg-paper px-7 text-[0.92rem] font-normal text-ink transition hover:bg-blush"
            >
              Cotizar mi evento
              <ArrowDown className="size-4" />
            </a>
          </div>
        }
      />
    </section>
  )
}
