import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Base path is /melvin_operations_os/ on GitHub Pages, / locally
const base = process.env.VITE_BASE_PATH || '/'

export default defineConfig({
  plugins: [react()],
  base,
})
