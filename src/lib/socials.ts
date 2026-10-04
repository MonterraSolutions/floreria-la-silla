import { Mail, Phone } from 'lucide-react'
import { FacebookIcon, InstagramIcon, WhatsAppIcon } from '@/components/icons'
import type { SocialItem } from '@/components/ui/social-media'
import { SITE, wa } from '@/lib/site'

export const INSTAGRAM_GRADIENT =
  'linear-gradient(45deg,#f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%)'

export const SOCIALS: SocialItem[] = [
  { href: SITE.instagram, ariaLabel: 'Instagram de Florería La Silla', tooltip: SITE.instagramHandle, icon: InstagramIcon, color: INSTAGRAM_GRADIENT },
  { href: wa(), ariaLabel: 'Escríbenos por WhatsApp', tooltip: `WhatsApp ${SITE.whatsapp}`, icon: WhatsAppIcon, color: '#1FAF54' },
  { href: SITE.phoneHref, ariaLabel: 'Llámanos', tooltip: SITE.phone, icon: Phone, color: '#A23B4D', external: false },
  { href: SITE.facebook, ariaLabel: 'Facebook de Florería La Silla', tooltip: 'Facebook', icon: FacebookIcon, color: '#1877F2' },
  { href: `mailto:${SITE.email}`, ariaLabel: 'Mándanos un correo', tooltip: 'Correo', icon: Mail, color: '#171414', external: false },
]
