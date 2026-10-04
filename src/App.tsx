import { useCallback, useState } from 'react'
import { FloatingContact } from '@/components/FloatingContact'
import { Intro } from '@/components/Intro'
import { Nav } from '@/components/Nav'
import { Arreglos } from '@/sections/Arreglos'
import { Contacto } from '@/sections/Contacto'
import { Cotizar } from '@/sections/Cotizar'
import { Eventos } from '@/sections/Eventos'
import { Footer } from '@/sections/Footer'
import { Funeraria } from '@/sections/Funeraria'
import { Hero } from '@/sections/Hero'
import { Historia } from '@/sections/Historia'
import { Marquee } from '@/sections/Marquee'

export default function App() {
  const [ready, setReady] = useState(false)
  const onDone = useCallback(() => setReady(true), [])

  return (
    <>
      <Intro onDone={onDone} />
      <Nav />
      <main>
        <Hero play={ready} />
        <Marquee />
        <Arreglos />
        <Eventos />
        <Cotizar />
        <Funeraria />
        <Historia />
        <Contacto />
      </main>
      <Footer />
      <FloatingContact visible={ready} />
    </>
  )
}
