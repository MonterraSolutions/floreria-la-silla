import { useCallback, useEffect, useLayoutEffect, useState } from 'react'
import { FloatingContact } from '@/components/FloatingContact'
import { Intro } from '@/components/Intro'
import { Nav } from '@/components/Nav'
import { QuienesSomos } from '@/pages/QuienesSomos'
import { Arreglos } from '@/sections/Arreglos'
import { Contacto } from '@/sections/Contacto'
import { Cotizar } from '@/sections/Cotizar'
import { Eventos } from '@/sections/Eventos'
import { Footer } from '@/sections/Footer'
import { Funeraria } from '@/sections/Funeraria'
import { Hero } from '@/sections/Hero'

// "Quiénes somos" es una página aparte; todo lo demás vive en la portada.
const PAGINA = '#quienes-somos'

function useHash() {
  const [hash, setHash] = useState(() => window.location.hash)
  useEffect(() => {
    const on = () => setHash(window.location.hash)
    window.addEventListener('hashchange', on)
    return () => window.removeEventListener('hashchange', on)
  }, [])
  return hash
}

export default function App() {
  const [ready, setReady] = useState(false)
  const onDone = useCallback(() => setReady(true), [])
  const hash = useHash()
  const enPagina = hash === PAGINA

  // al cambiar de vista, el ancla todavía no existe cuando el navegador intenta bajar a ella
  useLayoutEffect(() => {
    if (enPagina) {
      window.scrollTo({ top: 0, behavior: 'instant' })
      return
    }
    const el = hash ? document.querySelector(hash) : null
    if (el) el.scrollIntoView({ behavior: 'instant' })
  }, [enPagina]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <Intro onDone={onDone} />
      <Nav solid={enPagina} />
      {enPagina ? (
        <QuienesSomos />
      ) : (
        <main>
          <Hero play={ready} />
          <Arreglos />
          <Funeraria />
          <Eventos />
          <Cotizar />
          <Contacto />
        </main>
      )}
      <Footer />
      <FloatingContact visible={ready} />
    </>
  )
}
