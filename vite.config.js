import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174, // ✅ تأكد إنه نفس البورت اللي بتفتحه في المتصفح
    strictPort: true,
    hmr: {
      protocol: 'ws',
      host: 'localhost',
    }
  }
})
