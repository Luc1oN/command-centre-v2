import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  // Dev serves at '/', production build uses the GitHub Pages repo path.
  // (Must match the repo name exactly for Pages assets to resolve.)
  base: command === 'build' ? '/command-centre-v2/' : '/',
  plugins: [react(), tailwindcss()],
  resolve: {
    // Guarantee a single React copy (avoids dev optimize-deps "invalid hook call")
    dedupe: ['react', 'react-dom'],
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
}))
