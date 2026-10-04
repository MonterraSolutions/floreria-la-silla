import { withDigits } from '@/lib/digits'
const OCASIONES = [
  'Cumpleaños', 'Aniversario', '10 de mayo', 'San Valentín', 'Nacimiento', 'Bodas',
  'XV años', 'Bautizo', 'Primera comunión', 'Graduación', 'Gracias', 'Condolencias',
]

export function Marquee() {
  const row = [...OCASIONES, ...OCASIONES]
  return (
    <div className="relative overflow-hidden border-y border-ink/10 bg-paper py-5" aria-label="Ocasiones">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-paper to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-paper to-transparent" />
      <ul className="flex w-max animate-marquee items-center gap-10 hover:[animation-play-state:paused]">
        {row.map((o, i) => (
          <li key={i} className="flex items-center gap-10 font-display text-2xl whitespace-nowrap text-ink md:text-3xl" aria-hidden={i >= OCASIONES.length}>
            {withDigits(o)}
            <img src="brand/rosa-negro.png" alt="" className="size-5 opacity-60" />
          </li>
        ))}
      </ul>
    </div>
  )
}
