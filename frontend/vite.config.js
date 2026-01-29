import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: [
      'touchgrass2.onrender.com',  // Your frontend domain
      'touchgrass-backend.onrender.com',  // Your backend
      'touchgrass-7.onrender.com'  // Your other backend
    ],
    proxy: {
      '/api': {
        target: 'http://localhost:5001',
        changeOrigin: true,
        secure: false,
      }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      external: [],
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
