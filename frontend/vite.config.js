import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: [
      'touchgrass2.onrender.com',
      'touchgrass-backend.onrender.com',
      'touchgrass-7.onrender.com'
      
    ],
    proxy: {
      '/api': {
        target: 'https://touchgrass-7.onrender.com',
                
        changeOrigin: true,
        secure: false,
      }
    },
    // Fix WebSocket/HMR connection issues
    hmr: {
      clientPort: 3000,
      port: 3000,
      protocol: 'ws'
    },
    // Allow connecting from any host in development
    host: '0.0.0.0',
    strictPort: false
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
        },
        // Enable content hashing for cache busting
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]'
      }
    }
  }
})
