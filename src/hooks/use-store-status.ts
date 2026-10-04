import { useEffect, useState } from 'react'
import { HOURS } from '@/lib/site'

const DAYS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado']

function fmt(h: number) {
  const hh = Math.floor(h)
  const mm = Math.round((h - hh) * 60)
  const suffix = hh >= 12 ? 'pm' : 'am'
  const h12 = hh > 12 ? hh - 12 : hh
  return `${h12}${mm ? ':' + String(mm).padStart(2, '0') : ''} ${suffix}`
}

function nowInMonterrey() {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Monterrey',
    weekday: 'short',
    hour: 'numeric',
    minute: 'numeric',
    hour12: false,
  }).formatToParts(new Date())
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? '0'
  const day = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(get('weekday'))
  const hour = (Number(get('hour')) % 24) + Number(get('minute')) / 60
  return { day, hour }
}

export interface StoreStatus {
  open: boolean
  label: string
  /** Qué pasa si alguien pide ahora mismo. */
  delivery: string
}

function compute(): StoreStatus {
  const { day, hour } = nowInMonterrey()
  const today = HOURS[day]
  const open = !!today && hour >= today[0] && hour < today[1]

  let label: string
  if (open) {
    label = `Abierto · cierra ${fmt(today![1])}`
  } else {
    let next = day
    let guard = 0
    do {
      next = (next + 1) % 7
      guard++
    } while (!HOURS[next] && guard < 7)
    const opensToday = today && hour < today[0]
    label = opensToday
      ? `Cerrado · abre hoy ${fmt(today[0])}`
      : `Cerrado · abre ${next === (day + 1) % 7 ? 'mañana' : 'el ' + DAYS[next]} ${fmt(HOURS[next]![0])}`
  }

  let delivery: string
  if (day >= 1 && day <= 5 && hour < 12) delivery = 'Pide antes de las 12:00 y llega hoy'
  else if (day >= 1 && day <= 4) delivery = 'Pide hoy y lo entregamos mañana'
  else if (day === 5) delivery = 'Para el sábado, pide hoy'
  else delivery = 'Agenda tu entrega del lunes'

  return { open, label, delivery }
}

export function useStoreStatus() {
  const [status, setStatus] = useState<StoreStatus>(compute)
  useEffect(() => {
    const id = window.setInterval(() => setStatus(compute()), 60_000)
    return () => window.clearInterval(id)
  }, [])
  return status
}
