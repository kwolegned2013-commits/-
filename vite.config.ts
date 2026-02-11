
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
    // 'terser' 대신 더 빠르고 기본 내장된 'esbuild'를 사용합니다.
    minify: 'esbuild',
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
