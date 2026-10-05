import { useState } from 'react'
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
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="relative grid size-14 cursor-pointer place-items-center rounded-full bg-ink text-paper shadow-lg transition hover:bg-rose"
          aria-label={open ? 'Cerrar opciones de contacto' : 'Abrir opciones de contacto'}
          aria-expanded={open}
        >
          <motion.span key={open ? 'x' : 'wa'} initial={{ rotate: -45, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }}>
            {open ? <X className="size-6" /> : <WhatsAppIcon className="size-6" />}
          </motion.span>
        </button>
      </div>
    </div>
  )
}
