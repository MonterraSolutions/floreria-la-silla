import type { SVGProps } from 'react'

// lucide-react ya no incluye logotipos de marca; estos siguen su mismo trazo (24px, stroke 1.5).
type P = SVGProps<SVGSVGElement>
const base = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
} as const

export function InstagramIcon(props: P) {
  return (
    <svg {...base} {...props}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" />
    </svg>
  )
}

export function FacebookIcon(props: P) {
  return (
    <svg {...base} {...props}>
      <path d="M15 3h-2a4 4 0 0 0-4 4v3H6.5v3.5H9V21h3.5v-7.5h2.7l.6-3.5h-3.3V7.6c0-.6.4-1.1 1.1-1.1H15z" />
    </svg>
  )
}

export function WhatsAppIcon(props: P) {
  return (
    <svg {...base} {...props}>
      <path d="M4.2 19.8 5.3 16A8.5 8.5 0 1 1 8.3 19z" />
      <path d="M9 8.6c.2-.5.5-.6.8-.6h.5c.2 0 .4.1.5.4l.6 1.5c.1.2 0 .5-.1.7l-.5.6c.6 1.2 1.6 2.2 2.8 2.8l.6-.5c.2-.2.5-.2.7-.1l1.5.6c.3.1.4.3.4.5v.5c0 .3-.2.6-.6.8-.7.4-1.6.4-2.4.1A8 8 0 0 1 9 11c-.3-.8-.4-1.7 0-2.4z" />
    </svg>
  )
}
