
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    // Vercel 환경 변수 및 로컬 환경 변수 통합 지원
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY || "")
  },
  build: {
    target: 'esnext',
    outDir: 'dist',
    assetsDir: 'assets',
    minify: 'terser',
    chunkSizeWarningLimit: 2000,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          utils: ['lucide-react', '@google/genai']
        }
      }
    }
  },
  server: {
    port: 3000,
    host: true
  }
});
