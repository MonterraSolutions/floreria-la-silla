import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { WhatsAppIcon } from '@/components/icons'
import { SocialTooltip } from '@/components/ui/social-media'
import { StatusPill } from '@/components/StatusPill'
import { SOCIALS } from '@/lib/socials'
import { wa } from '@/lib/site'
import { cn } from '@/lib/utils'

const LINKS = [
  { href: '#arreglos', label: 'Arreglos' },
  { href: '#eventos', label: 'Eventos' },
  { href: '#cotizar', label: 'Cotizar' },
  { href: '#funeraria', label: 'Funeraria' },
  { href: '#contacto', label: 'Contacto' },
]

export function Nav() {
  const [scrolled, setScrolled] = useState(false)
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
        scrolled ? 'bg-paper/85 py-2.5 shadow-[0_1px_0_rgba(23,20,20,0.06)] backdrop-blur-md' : 'py-4 md:py-5',
      )}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 md:px-8" aria-label="Principal">
        <a href="#inicio" className="flex items-center gap-2.5" aria-label="Florería La Silla, inicio">
          <img src="brand/rosa-negro.png" alt="" width={600} height={593} className="size-9 md:size-10" />
          <span className="flex flex-col leading-none">
            <span className="font-display text-[0.62rem] tracking-[0.34em] text-stone">FLORERÍA</span>
            <span className="font-display text-xl tracking-[0.12em] md:text-[1.4rem]">LA SILLA</span>
          </span>
        </a>

        <ul className="hidden items-center gap-8 lg:flex">
          {LINKS.map((l) => (
            <li key={l.href}>
              <a href={l.href} className="group relative text-[0.82rem] font-normal tracking-[0.14em] text-ink-soft uppercase transition-colors hover:text-rose">
                {l.label}
                <span className="absolute -bottom-1 left-0 h-px w-0 bg-rose transition-all duration-300 group-hover:w-full" />
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <a
            href={wa()}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-[0.8rem] font-normal tracking-wide text-paper transition hover:-translate-y-0.5 hover:bg-rose sm:inline-flex"
          >
            <WhatsAppIcon className="size-4" />
            Hacer pedido
          </a>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="grid size-11 cursor-pointer place-items-center rounded-full ring-1 ring-ink/15 lg:hidden"
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
            className="fixed inset-0 z-50 flex flex-col bg-blush px-6 pt-5 pb-10 lg:hidden"
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
