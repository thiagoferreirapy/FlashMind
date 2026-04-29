const ICONS = { success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️', reminder: '🔔' }

export class Toast {
  show(message, type = 'info', duration = 3000) {
    const container = document.getElementById('toast-container')
    const el = document.createElement('div')
    el.className = `toast ${type}`
    el.innerHTML = `<span>${ICONS[type] || ICONS.info}</span><span>${message}</span>`
    container.appendChild(el)
    setTimeout(() => el.remove(), duration)
  }

  success(msg) { this.show(msg, 'success') }
  error(msg)   { this.show(msg, 'error') }
  warning(msg) { this.show(msg, 'warning') }
  info(msg)    { this.show(msg, 'info') }
}
