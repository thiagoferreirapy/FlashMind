import { icon, refreshIcons } from '../utils/icons.js'

const NAV_ITEMS = [
  { route: '/home',      icon: 'home',        label: 'Início' },
  { route: '/decks',     icon: 'layers',      label: 'Decks' },
  { route: '/dashboard', icon: 'bar-chart-3', label: 'Stats' },
  { route: '/reminders', icon: 'bell',        label: 'Lembretes' },
  { route: '/settings',  icon: 'settings',    label: 'Config' },
]

export class BottomNav {
  constructor(currentRoute) {
    this.currentRoute = currentRoute
    this.container = document.getElementById('bottom-nav')
  }

  render() {
    this.container.innerHTML = `
      <nav class="bottom-nav">
        ${NAV_ITEMS.map(item => {
          const isActive = this.currentRoute === item.route ||
            (item.route !== '/home' && this.currentRoute.startsWith(item.route))
          return `
            <button class="bottom-nav-item ${isActive ? 'active' : ''}" data-route="${item.route}">
              <span class="bottom-nav-icon">${icon(item.icon, 22)}</span>
              <span class="bottom-nav-label">${item.label}</span>
            </button>
          `
        }).join('')}
      </nav>
    `

    this.container.querySelectorAll('.bottom-nav-item').forEach(btn => {
      btn.addEventListener('click', () => {
        window.router.navigate(btn.dataset.route)
      })
    })

    refreshIcons()
  }
}
