import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

// https://vite.dev/config/
export default defineConfig({
  // Base path for the deployed site. GitHub Pages serves project sites under
  // /<repo>/, so default to /Jagthorn/. Override with VITE_BASE for a custom
  // domain or a user/organisation page (set VITE_BASE=/).
  base: process.env.VITE_BASE ?? '/Jagthorn/',
  plugins: [react()],
  server: {
    // Honour the PORT provided by the Aspire AppHost; fall back to 5173 for
    // a plain `npm run dev`.
    port: Number(process.env.PORT) || 5173,
    strictPort: Boolean(process.env.PORT),
  },
  preview: {
    port: Number(process.env.PORT) || 4173,
    strictPort: Boolean(process.env.PORT),
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    css: false,
  },
})
