import { Api } from './api.js'

const isCapacitor = () => typeof window !== 'undefined' && window.Capacitor?.isNativePlatform?.()

let PushNotifications = null

async function loadPlugin() {
  if (!isCapacitor()) return null
  if (PushNotifications) return PushNotifications
  try {
    const mod = await import('@capacitor/push-notifications')
    PushNotifications = mod.PushNotifications
    return PushNotifications
  } catch {
    return null
  }
}

export const PushNotificationService = {

  async init() {
    const plugin = await loadPlugin()
    if (!plugin) return

    const { receive } = await plugin.checkPermissions()
    if (receive !== 'granted') {
      const res = await plugin.requestPermissions()
      if (res.receive !== 'granted') {
        console.warn('[Push] Permissão negada')
        return
      }
    }

    await plugin.register()

    plugin.addListener('registration', (event) => {
      console.log('[Push] Token FCM:', event.value)
      PushNotificationService.registerToken(event.value)
    })

    plugin.addListener('registrationError', (err) => {
      console.error('[Push] Erro no registro:', err)
    })

    plugin.addListener('pushNotificationReceived', (notification) => {
      console.log('[Push] Notificação recebida com app aberto:', notification)
      PushNotificationService._handleForeground(notification)
    })

    plugin.addListener('pushNotificationActionPerformed', (action) => {
      console.log('[Push] Usuário tocou na notificação:', action)
      PushNotificationService._handleTap(action)
    })
  },

  async registerToken(token) {
    try {
      const platform = window.Capacitor?.getPlatform?.() || 'android'
      await Api.post('/device-tokens', { token, platform })
      localStorage.setItem('fliply_fcm_token', token)
      console.log('[Push] Token registrado no backend')
    } catch (err) {
      console.error('[Push] Erro ao registrar token no backend:', err)
    }
  },

  async unregister() {
    const token = localStorage.getItem('fliply_fcm_token')
    if (!token) return
    try {
      await Api.delete('/device-tokens', { token })
      localStorage.removeItem('fliply_fcm_token')
      console.log('[Push] Token removido')
    } catch (err) {
      console.error('[Push] Erro ao remover token:', err)
    }
  },

  _handleForeground(notification) {
    const title = notification.title || 'Fliply'
    const body  = notification.body  || ''

    if (window.toast) {
      window.toast.info(`${title}: ${body}`)
    }

    window.dispatchEvent(new CustomEvent('push-notification', {
      detail: { title, body, data: notification.data }
    }))
  },

  _handleTap(action) {
    const data = action.notification?.data || {}

    if (data.type === 'reminder') {
      window.router?.navigate('/reminders')
    } else if (data.deckId) {
      window.router?.navigate(`/deck/${data.deckId}`)
    } else {
      window.router?.navigate('/home')
    }
  },

  async removeAllListeners() {
    const plugin = await loadPlugin()
    if (plugin) await plugin.removeAllListeners()
  }
}
