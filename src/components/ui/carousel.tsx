import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CarouselProps {
  children: ReactNode[]
  label: string
  /** Ancho de cada tarjeta (clases de Tailwind). */
  itemClassName?: string
  className?: string
  /** Variante de color de las flechas. */
  tone?: 'light' | 'dark'
  /** Cambia cuando cambia el contenido (p. ej. un filtro) para regresar al inicio. */
  resetKey?: string
}

/** Carrusel con scroll-snap: se desliza con el dedo, la rueda o las flechas. */
export function Carousel({ children, label, itemClassName, className, tone = 'light', resetKey }: CarouselProps) {
  const ref = useRef<HTMLUListElement>(null)
  const [canPrev, setCanPrev] = useState(false)
  const [canNext, setCanNext] = useState(true)

  const update = useCallback(() => {
    const el = ref.current
    if (!el) return
    setCanPrev(el.scrollLeft > 4)
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 4)
  }, [])

  useEffect(() => {
    const el = ref.current
    if (!el) return
    el.scrollTo({ left: 0 })
    update()
    el.addEventListener('scroll', update, { passive: true })
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => {
      el.removeEventListener('scroll', update)
      ro.disconnect()
    }
  }, [update, resetKey, children.length])

  const step = (dir: 1 | -1) => {
    const el = ref.current
    if (!el) return
    const first = el.querySelector('li')
    const w = first ? first.getBoundingClientRect().width + 16 : el.clientWidth * 0.8
    el.scrollBy({ left: dir * w, behavior: 'smooth' })
  }

  const btn = cn(
    'grid size-11 cursor-pointer place-items-center rounded-full ring-1 transition disabled:cursor-default disabled:opacity-30',
    tone === 'dark' ? 'text-paper ring-paper/25 enabled:hover:bg-paper enabled:hover:text-ink' : 'text-ink ring-ink/15 enabled:hover:bg-ink enabled:hover:text-paper',
  )

  return (
    <div className={cn('relative', className)} role="region" aria-roledescription="carrusel" aria-label={label}>
      <ul
        ref={ref}
        className="-mx-4 flex snap-x snap-mandatory scroll-px-4 gap-4 overflow-x-auto px-4 pb-1 [scrollbar-width:none] md:mx-0 md:scroll-px-0 md:px-0 [&::-webkit-scrollbar]:hidden"
      >
        {children.map((child, i) => (
          <li key={i} className={cn('shrink-0 snap-start', itemClassName)}>
            {child}
          </li>
        ))}
      </ul>
      <div className="mt-5 flex justify-end gap-2">
        <button type="button" className={btn} onClick={() => step(-1)} disabled={!canPrev} aria-label="Anterior">
          <ChevronLeft className="size-5" />
        </button>
        <button type="button" className={btn} onClick={() => step(1)} disabled={!canNext} aria-label="Siguiente">
          <ChevronRight className="size-5" />
        </button>
      </div>
    </div>
  )
}
