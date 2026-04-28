import './styles.css'
import { Router } from './routes/router.js'
import { BottomNav } from './components/BottomNav.js'
import { Toast } from './components/Toast.js'
import { Loader } from './components/Loader.js'
import { AuthService } from './utils/auth.js'
import { ThemeService } from './utils/theme.js'
import { ReminderService } from './utils/reminderService.js'

window.toast = new Toast()
window.loader = new Loader()

async function init() {
  ThemeService.init()
  window.router = new Router()

  const publicRoutes = ['/onboarding', '/login', '/register', '/forgot-password']

  window.addEventListener('routechange', (e) => {
    const route = e.detail.route
    const isPublic = publicRoutes.some(r => route.startsWith(r))
    const navEl = document.getElementById('bottom-nav')

    if (isPublic) {
      navEl.innerHTML = ''
      ReminderService.stop()
    } else {
      new BottomNav(route).render()
      ReminderService.start()
    }
  })

  // Auth Guard
  const isAuthenticated = AuthService.isAuthenticated()
  const isFirstTime = !localStorage.getItem('fliply_visited')
  const currentHash = window.location.hash.slice(1) || '/home'

  if (isFirstTime && !isAuthenticated && !publicRoutes.includes(currentHash)) {
    window.router.navigate('/onboarding')
  } else if (!isAuthenticated && !publicRoutes.includes(currentHash)) {
    window.router.navigate('/login')
  }

  // Only init router after setting the correct hash if necessary
  window.router.init()
}


init()
