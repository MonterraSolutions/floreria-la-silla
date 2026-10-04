# Florería La Silla · sitio web

Sitio por **Monterra Solutions**. React + Vite + TypeScript + Tailwind v4, con estructura shadcn (`src/components/ui`).

## Abrirlo en local

Doble clic en **`abrir-sitio.command`** (deja la Terminal abierta), o desde esta carpeta:

```bash
npm install      # solo la primera vez
npm run dev      # http://localhost:5180
```

## Publicar

Versión de revisión en GitHub Pages: https://monterrasolutions.github.io/floreria-la-silla/

```bash
npm run deploy   # compila y sube dist/ a la rama gh-pages
```

Para Hostinger (sitio en la raíz del dominio):

```bash
BASE_PATH=/ npm run build   # y se sube el contenido de dist/ a public_html
```

Antes de publicar en el dominio, cambiar `og:url` y `og:image` en `index.html` al dominio final.

## Dónde está cada cosa

- `src/lib/site.ts`: teléfono, WhatsApp, correo, dirección y horario. Cambiar aquí y se actualiza en todo el sitio.
- `src/components/ui/petal-constellation.tsx`: la constelación de pétalos del hero.
- `src/components/ui/scroll-choreography.tsx`: las cuatro fotos de Eventos que se acomodan con el scroll.
- `src/components/ui/social-media.tsx`: los botones de redes que se rellenan de color.
- `src/components/ui/carousel.tsx` y `thumbnail-gallery.tsx`: el carrusel de arreglos y la galería de coronas.
- `src/sections/Cotizar.tsx`: el cotizador de 4 pasos que manda el mensaje a WhatsApp.
- `public/brand/`: logo recortado en PNG (negro, blanco, rosa sola, capas del intro) y favicon.
- `public/img/`: fotos en WebP (cada una en 1600 px y en `-sm` de 800 px).
