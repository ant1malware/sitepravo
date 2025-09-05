import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Modes:
// - gh: base '/pravo/', outDir 'docs' (GitHub Pages)
// - netlify (default): base '/', outDir 'dist'
export default defineConfig(({ mode }) => {
  const isGh = mode === 'gh';
  return {
    plugins: [react()],
    base: isGh ? '/pravo/' : '/',
    build: {
      outDir: isGh ? 'docs' : 'dist',
      emptyOutDir: true,
    },
    server: { host: true },
  }
})
