import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Nom du dépôt GitHub : nécessaire pour que GitHub Pages trouve les fichiers
  base: '/tp-TaskBoard/',
})
