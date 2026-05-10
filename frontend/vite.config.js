import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Raise warning threshold — Clerk + framer-motion are large but necessary
    chunkSizeWarningLimit: 600,
  },
})
