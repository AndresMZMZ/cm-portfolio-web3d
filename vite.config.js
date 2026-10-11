import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'node:url'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // El docente usa rutas relativas (../../components/...), pero usamos el alias "@" 
  // porque evita rutas frágiles al mover archivos
  resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
})
