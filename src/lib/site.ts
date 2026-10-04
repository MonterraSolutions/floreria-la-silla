// Datos del negocio. Fuente: Instagram @florerialasilla y florerialasilla.com
// (preguntas frecuentes), revisados el 4 oct 2026.

export const SITE = {
  name: 'Florería La Silla',
  since: 1992,
  phone: '81 8365 7070',
  phoneHref: 'tel:+528183657070',
  whatsapp: '81 1251 1893',
  whatsappNumber: '528112511893',
  email: 'lasillaflorerias@hotmail.com',
  instagram: 'https://www.instagram.com/florerialasilla/',
  instagramHandle: '@florerialasilla',
  facebook: 'https://www.facebook.com/florerialasilla/',
  address: 'Av. Eugenio Garza Sada 4361, Col. Villa Las Fuentes',
  city: 'Monterrey, N.L. · C.P. 64890',
  mapsQuery: 'La Silla Florerías, Av. Eugenio Garza Sada 4361, Villa Las Fuentes, Monterrey',
} as const

/** Liga de WhatsApp con el mensaje ya escrito. */
export function wa(message = 'Hola, quiero hacer un pedido en Florería La Silla.') {
  return `https://wa.me/${SITE.whatsappNumber}?text=${encodeURIComponent(message)}`
}

export function waPedido(arreglo: string) {
  return wa(`Hola, me interesa el arreglo "${arreglo}". ¿Me pasan precio y disponibilidad?`)
}

export const mapsHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(SITE.mapsQuery)}`

/** Horario de la tienda (hora de Monterrey). 0 = domingo. */
export const HOURS: Record<number, [number, number] | null> = {
  0: null,
  1: [8.5, 18.5],
  2: [8.5, 18.5],
  3: [8.5, 18.5],
  4: [8.5, 18.5],
  5: [8.5, 18.5],
  6: [8.5, 14],
}
