import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface GalleryItem {
  src: string
  thumb: string
  alt: string
  name: string
}

interface ThumbnailGalleryProps {
  items: GalleryItem[]
  index: number
  onChange: (i: number) => void
  className?: string
}

/** Foto grande con tira de miniaturas: la activa se agranda y sube un poco. */
export function ThumbnailGallery({ items, index, onChange, className }: ThumbnailGalleryProps) {
  const go = (d: 1 | -1) => onChange((index + d + items.length) % items.length)
  const item = items[index]

  return (
    <div
      className={cn('mx-auto w-full max-w-md', className)}
      role="region"
      aria-roledescription="galería"
      aria-label="Coronas y arreglos de condolencias"
      onKeyDown={(e) => {
        if (e.key === 'ArrowRight') go(1)
        if (e.key === 'ArrowLeft') go(-1)
      }}
    >
      <div className="relative">
        <motion.div
          className="relative aspect-[4/5] cursor-grab overflow-hidden rounded-[1.4rem] bg-ink-soft shadow-[0_30px_60px_-25px_rgba(0,0,0,0.8)] active:cursor-grabbing"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.18}
          onDragEnd={(_, info) => {
            if (info.offset.x < -60) go(1)
            else if (info.offset.x > 60) go(-1)
          }}
        >
          <AnimatePresence initial={false} mode="popLayout">
            <motion.img
              key={item.src}
              src={item.src}
              alt={item.alt}
              draggable={false}
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0 h-full w-full object-cover select-none"
            />
          </AnimatePresence>
        </motion.div>

        {(['prev', 'next'] as const).map((dir) => (
          <button
            key={dir}
            type="button"
            onClick={() => go(dir === 'next' ? 1 : -1)}
            aria-label={dir === 'next' ? 'Siguiente' : 'Anterior'}
            className={cn(
              'absolute top-1/2 grid size-11 -translate-y-1/2 cursor-pointer place-items-center rounded-full bg-paper/85 text-ink shadow-lg backdrop-blur transition hover:bg-paper',
              dir === 'next' ? 'right-3' : 'left-3',
            )}
          >
            {dir === 'next' ? <ChevronRight className="size-5" /> : <ChevronLeft className="size-5" />}
          </button>
        ))}
      </div>

      <div className="mt-4 flex items-baseline justify-between gap-4 px-1">
        <AnimatePresence mode="wait" initial={false}>
          <motion.h3
            key={item.name}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25 }}
            className="font-display text-2xl leading-tight"
          >
            {item.name}
          </motion.h3>
        </AnimatePresence>
        <span className="shrink-0 text-sm text-paper/45 tabular-nums">
          {index + 1} / {items.length}
        </span>
      </div>

      <div className="mt-5 flex items-end justify-center gap-2 sm:gap-2.5">
        {items.map((it, i) => {
          const active = i === index
          return (
            <button
              key={it.thumb}
              type="button"
              onClick={() => onChange(i)}
              aria-label={it.name}
              aria-current={active}
              className={cn(
                'size-12 shrink-0 cursor-pointer overflow-hidden rounded-xl transition-all duration-300 ease-[cubic-bezier(.22,1,.36,1)] sm:size-14',
                active ? '-translate-y-1.5 scale-110 opacity-100 shadow-[0_12px_24px_-8px_rgba(0,0,0,0.8)] ring-2 ring-petal' : 'opacity-45 hover:opacity-80',
              )}
            >
              <img src={it.thumb} alt="" loading="lazy" className="h-full w-full object-cover" />
            </button>
          )
        })}
      </div>
    </div>
  )
}
