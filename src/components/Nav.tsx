import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { WhatsAppIcon } from '@/components/icons'
import { SocialTooltip } from '@/components/ui/social-media'
import { StatusPill } from '@/components/StatusPill'
import { SOCIALS } from '@/lib/socials'
import { wa } from '@/lib/site'
import { cn } from '@/lib/utils'

type Link = { href: string; label: string; children?: { href: string; label: string }[] }

const LINKS: Link[] = [
  {
    href: '#flores',
    label: 'Flores',
    children: [
      { href: '#arreglos', label: 'Arreglos ocasionales' },
      { href: '#funeraria', label: 'Funeraria' },
    ],
  },
  { href: '#eventos', label: 'Eventos' },
  { href: '#cotizar', label: 'Cotizar' },
  { href: '#quienes-somos', label: 'Quiénes somos' },
  { href: '#contacto', label: 'Contacto' },
]

/** solid: menú claro desde arriba (páginas sin foto de portada). */
export function Nav({ solid = false }: { solid?: boolean }) {
  const [bajo, setScrolled] = useState(false)
  const scrolled = solid || bajo
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.classList.toggle('is-locked', open)
  }, [open])

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,padding] duration-500',
        scrolled ? 'bg-paper/95 py-2.5 text-ink shadow-[0_1px_0_rgba(23,20,20,0.06)]' : 'py-4 text-paper md:py-5',
      )}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 md:px-8" aria-label="Principal">
        <a href="#inicio" className="flex items-center gap-2.5" aria-label="Florería La Silla, inicio">
          <img src={scrolled ? 'brand/rosa-negro.png' : 'brand/rosa-blanco.png'} alt="" width={600} height={593} className="size-9 md:size-10" />
          <span className="flex flex-col leading-none">
            <span className="font-display text-[0.62rem] tracking-[0.34em] opacity-70">FLORERÍA</span>
            <span className="font-display text-xl tracking-[0.12em] md:text-[1.4rem]">LA SILLA</span>
          </span>
        </a>

        <ul className="hidden items-center gap-8 lg:flex">
          {LINKS.map((l) => (
            <li key={l.href} className="group/item relative">
              <a href={l.href} className="group relative text-[0.82rem] font-normal tracking-[0.14em] uppercase opacity-85 transition hover:opacity-100">
                {l.label}
                <span className="absolute -bottom-1 left-0 h-px w-0 bg-current transition-all duration-300 group-hover:w-full" />
              </a>
              {l.children && (
                <div className="invisible absolute top-full left-1/2 -translate-x-1/2 pt-4 opacity-0 transition group-focus-within/item:visible group-focus-within/item:opacity-100 group-hover/item:visible group-hover/item:opacity-100">
                  <ul className="min-w-56 rounded-sm bg-paper py-2 text-ink shadow-[0_18px_40px_-16px_rgba(23,20,20,0.35)] ring-1 ring-ink/5">
                    {l.children.map((c) => (
                      <li key={c.href}>
                        <a href={c.href} className="block px-5 py-2.5 text-[0.95rem] whitespace-nowrap transition-colors hover:bg-blush-50 hover:text-rose">
                          {c.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <a
            href={wa()}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              'hidden items-center gap-2 rounded-sm px-5 py-2.5 text-[0.75rem] font-normal tracking-[0.14em] uppercase transition sm:inline-flex',
              scrolled ? 'bg-ink text-paper hover:bg-rose' : 'bg-paper text-ink hover:bg-blush',
            )}
          >
            <WhatsAppIcon className="size-4" />
            Hacer pedido
          </a>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className={cn('grid size-11 cursor-pointer place-items-center rounded-full ring-1 lg:hidden', scrolled ? 'ring-ink/15' : 'ring-paper/40')}
            aria-label="Abrir menú"
            aria-expanded={open}
          >
            <Menu className="size-5" />
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 flex flex-col bg-paper text-ink px-6 pt-5 pb-10 lg:hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Menú"
          >
            <div className="flex items-center justify-between">
              <img src="brand/rosa-negro.png" alt="" className="size-10" />
              <button type="button" onClick={() => setOpen(false)} className="grid size-11 cursor-pointer place-items-center rounded-full ring-1 ring-ink/15" aria-label="Cerrar menú">
                <X className="size-5" />
              </button>
            </div>
            <ul className="mt-12 flex flex-col gap-5">
              {LINKS.map((l, i) => (
                <motion.li key={l.href} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 + i * 0.05 }}>
                  <a href={l.href} onClick={() => setOpen(false)} className="font-display text-4xl">
                    {l.label}
                  </a>
                  {l.children && (
                    <ul className="mt-2 flex flex-col gap-1 pl-1">
                      {l.children.map((c) => (
                        <li key={c.href}>
                          <a href={c.href} onClick={() => setOpen(false)} className="inline-flex min-h-11 items-center text-[1.05rem] text-stone">
                            {c.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </motion.li>
              ))}
            </ul>
            <div className="mt-auto flex flex-col items-start gap-6">
              <StatusPill withDelivery className="flex-wrap" />
              <SocialTooltip items={SOCIALS} tooltipPosition="top" className="justify-start" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
