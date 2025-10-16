import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  root: '.', // raíz del proyecto
  build: {
    outDir: 'dist', // carpeta donde se guarda el build
    emptyOutDir: true,
  },
  optimizeDeps: {
    include: ['@heroicons/react/24/outline'],
  },
})
 
