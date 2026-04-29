import { defineConfig, loadEnv } from 'vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  const ngrokAtivo = env.ATIVAR_NGROK === 'true'
  const backendTarget = ngrokAtivo ? env.NGROK_BACKEND_URL : 'http://localhost:8080'
  const allowedHosts = ngrokAtivo && env.NGROK_FRONTEND_URL
    ? [new URL(env.NGROK_FRONTEND_URL).hostname]
    : []

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
      outDir: '../fliply-capacitor/www',
      emptyOutDir: true
    }
  }
})
