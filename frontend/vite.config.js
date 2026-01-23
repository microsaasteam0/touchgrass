import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: [
      'touchgrass2.onrender.com',  // Your frontend domain
      'touchgrass-backend.onrender.com',  // Your backend
      'touchgrass-7.onrender.com'  // Your other backend
    ]
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      external: [],  // <-- Comma was missing here!
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          ui: ['styled-components', 'framer-motion'],
          auth: ['@react-oauth/google', 'jwt-decode'],
        }
      }
    }
  }
})