import path from 'node:path'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// En GitHub Pages el sitio vive en /floreria-la-silla/; en local y en Hostinger, en la raíz.
export default defineConfig(({ command }) => ({
  base: command === 'build' ? (process.env.BASE_PATH ?? '/floreria-la-silla/') : '/',
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
}))
