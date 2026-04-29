import { defineConfig, loadEnv } from 'vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  const ngrokAtivo = env.ATIVAR_NGROK === 'true'
  const backendTarget = ngrokAtivo && env.NGROK_BACKEND_URL
    ? env.NGROK_BACKEND_URL.trim()
    : 'http://localhost:8080'

  let allowedHosts = []
  if (ngrokAtivo && env.NGROK_FRONTEND_URL) {
    try {
      allowedHosts = [new URL(env.NGROK_FRONTEND_URL.trim()).hostname]
    } catch {
      console.warn('[vite] NGROK_FRONTEND_URL inválida, ignorando allowedHosts')
    }
  }

  return {
    base: './',
    server: {
      port: 5173,
      host: true,
      allowedHosts,
      proxy: {
        '/api': {
          target: backendTarget,
          changeOrigin: true,
          configure: (proxy) => {
            proxy.on('proxyReq', (proxyReq, req) => {
              if (ngrokAtivo) {
                proxyReq.setHeader('ngrok-skip-browser-warning', 'true')
              }
              if (req.url?.includes('/sse/')) {
                proxyReq.setHeader('Accept', 'text/event-stream')
              }
            })
          }
        }
      }
    },
    build: {
      outDir: '../flashmind-capacitor/www',
      emptyOutDir: true
    }
  }
})
