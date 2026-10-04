import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Phone, X } from 'lucide-react'
import { InstagramIcon, WhatsAppIcon } from '@/components/icons'
import { INSTAGRAM_GRADIENT } from '@/lib/socials'
import { SITE, wa } from '@/lib/site'

const ACTIONS = [
  { label: 'WhatsApp', href: wa(), icon: WhatsAppIcon, bg: '#1FAF54', external: true },
  { label: 'Llamar', href: SITE.phoneHref, icon: Phone, bg: '#A23B4D', external: false },
  { label: 'Instagram', href: SITE.instagram, icon: InstagramIcon, bg: INSTAGRAM_GRADIENT, external: true },
]

/** Botón flotante: se abre en abanico con WhatsApp, llamada e Instagram. */
export function FloatingContact({ visible }: { visible: boolean }) {
  const [open, setOpen] = useState(false)
  const [hint, setHint] = useState(false)

  useEffect(() => {
    if (!visible) return
    const show = window.setTimeout(() => setHint(true), 7000)
    const hide = window.setTimeout(() => setHint(false), 14000)
    return () => {
      window.clearTimeout(show)
      window.clearTimeout(hide)
    }
  }, [visible])

  if (!visible) return null

  return (
    <div className="fixed right-4 bottom-4 z-40 flex flex-col items-end gap-3 md:right-6 md:bottom-6">
      <AnimatePresence>
        {open &&
          ACTIONS.map((a, i) => {
            const Icon = a.icon
            return (
              <motion.a
                key={a.label}
                href={a.href}
                {...(a.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                initial={{ opacity: 0, y: 16, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.8 }}
                transition={{ type: 'spring', stiffness: 420, damping: 26, delay: (ACTIONS.length - 1 - i) * 0.04 }}
                className="flex items-center gap-3"
              >
                <span className="rounded-full bg-paper px-3 py-1 text-xs font-normal text-ink shadow-md">{a.label}</span>
                <span className="grid size-12 place-items-center rounded-full text-white shadow-lg" style={{ background: a.bg }}>
                  <Icon className="size-5" />
                </span>
              </motion.a>
            )
          })}
      </AnimatePresence>

      <div className="flex items-center gap-3">
        <AnimatePresence>
          {hint && !open && (
            <motion.span
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="hidden rounded-2xl rounded-br-sm bg-paper px-4 py-2.5 text-sm text-ink shadow-lg ring-1 ring-ink/5 sm:block"
            >
              ¿Te ayudamos a escoger?
            </motion.span>
          )}
        </AnimatePresence>
        <button
          type="button"
          onClick={() => {
            setOpen((o) => !o)
            setHint(false)
          }}
          className="relative grid size-14 cursor-pointer place-items-center rounded-full bg-ink text-paper ring-2 ring-paper/70 shadow-[0_12px_30px_-8px_rgba(23,20,20,0.5)] transition hover:bg-rose"
          aria-label={open ? 'Cerrar opciones de contacto' : 'Abrir opciones de contacto'}
          aria-expanded={open}
        >
          {!open && <span className="absolute inset-0 animate-ping rounded-full bg-rose/30 [animation-duration:2.6s]" />}
          <motion.span key={open ? 'x' : 'wa'} initial={{ rotate: -45, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }}>
            {open ? <X className="size-6" /> : <WhatsAppIcon className="size-6" />}
          </motion.span>
        </button>
      </div>
    </div>
  )
}
