import { AuthService } from './auth.js'

class ReminderServiceClass {
  constructor() {
    this._es = null
  }

  start() {
    if (this._es) return
    this._connect()
  }

  stop() {
    if (this._es) {
      this._es.close()
      this._es = null
    }
  }

  _connect() {
    const token = AuthService.getToken()
    if (!token) return

    this._es = new EventSource(`/api/sse/stream?token=${encodeURIComponent(token)}`)

    this._es.addEventListener('reminder', (e) => {
      try {
        const data = JSON.parse(e.data)
        const msg = data.description ? `${data.title} — ${data.description}` : data.title
        window.toast.show(msg, 'reminder', 6000)
      } catch {
        window.toast.show('Lembrete', 'reminder', 6000)
      }
    })

    this._es.onerror = () => {
      // EventSource reconecta automaticamente — não é necessário intervir
    }
  }
}

export const ReminderService = new ReminderServiceClass()
