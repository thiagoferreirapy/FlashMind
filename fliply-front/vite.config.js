import { defineConfig } from 'vite'

export default defineConfig({
  base: './',
  server: {
    port: 5173,
    host: true,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq, req) => {
            // Desabilita buffer para SSE (Server-Sent Events)
            if (req.url?.includes('/sse/')) {
              proxyReq.setHeader('Accept', 'text/event-stream')
            }
          })
        }
      }
    }
  },
  build: {
    outDir: '../fliply-capacitor/www',
    emptyOutDir: true
  }
})
