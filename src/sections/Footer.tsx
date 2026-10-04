import { SocialTooltip } from '@/components/ui/social-media'
import { SOCIALS } from '@/lib/socials'
import { SITE } from '@/lib/site'

export function Footer() {
  return (
    <footer className="bg-ink text-paper">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 pt-20 pb-10 md:grid-cols-[1fr_auto] md:px-8">
        <div>
          <img src="brand/logo-blanco.png" alt="Florería La Silla" width={1600} height={1128} loading="lazy" className="w-56 md:w-64" />
          <p className="mt-6 max-w-sm text-[0.95rem] leading-relaxed text-paper/60">
            Boutique floral en Monterrey desde {SITE.since}. {SITE.address}, {SITE.city}.
          </p>
        </div>
        <div className="flex flex-col gap-8 md:items-end">
          <nav aria-label="Pie de página">
            <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-paper/70">
              {[
                ['#arreglos', 'Arreglos'],
                ['#cotizar', 'Cotizar'],
                ['#eventos', 'Eventos'],
                ['#funeraria', 'Funeraria'],
                ['#contacto', 'Contacto'],
              ].map(([h, l]) => (
                <li key={h}>
                  <a href={h} className="hover:text-blush">
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <SocialTooltip items={SOCIALS} tooltipPosition="top" className="justify-start [&_a]:bg-paper/10 [&_a]:ring-paper/15 [&_svg]:text-paper" />
        </div>
      </div>
      <div className="border-t border-paper/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-6 text-xs text-paper/45 sm:flex-row sm:justify-between md:px-8">
          <span>© {new Date().getFullYear()} Florería La Silla. Todos los derechos reservados.</span>
          <span>Sitio web por Monterra Solutions</span>
        </div>
      </div>
    </footer>
  )
}
