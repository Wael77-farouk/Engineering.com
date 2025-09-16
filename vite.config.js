import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: './',   // ✨ ده أهم حاجة علشان الـ JS/CSS يشتغلوا صح بعد الـ build
  server: {
    port: 5174,
    strictPort: true,
    hmr: {
      protocol: 'ws',
      host: 'localhost',
    }
  }
})
