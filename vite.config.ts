import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  server: {
    origin: 'http://localhost:3000',
    port: 3000,
    open: true
  },
  resolve: {
    alias: {
      '@': '/src'
    },
  },
  plugins: [react()],
})
