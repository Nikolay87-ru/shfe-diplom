import { defineConfig, mergeConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { defineConfig as defineVitestConfig } from 'vitest/config'

// Vite конфигурация
const viteConfig = defineConfig({
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
        rewrite: (path: string) => path.replace(/^\/api/, '')
      }
    }
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
  }
})

// Vitest конфигурация
const vitestConfig = defineVitestConfig({
  test: {
    reporters: process.env.CI ? 'verbose' : 'default',
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/setupTests.ts']
  }
})

// Объединение конфигураций
export default mergeConfig(viteConfig, vitestConfig)