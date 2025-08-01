import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  base: process.env.NODE_ENV === 'production' ? '/shfe-diplom/' : '/', 
  css: {
    preprocessorOptions: {
      scss: {
        quietDeps: true
      }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), 
      '@assets': path.resolve(__dirname, './assets')
    },
  },
  assetsInclude: ['**/*.png', '**/*.jpg', '**/*.svg'],
  build: {
    outDir: 'dist', 
    emptyOutDir: true,
    assetsDir: 'assets', 
    sourcemap: false, 
    rollupOptions: {
      output: {
        assetFileNames: 'assets/[name]-[hash][extname]',
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js'
      }
    }
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://shfe-diplom.neto-server.ru',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
});