import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  // base './' hace que las rutas sean relativas. Así funciona en GitHub Pages
  // (que publica en /nombre-del-repo/) sin tener que poner el nombre del repo acá
  base: './',
  plugins: [react()],
})
