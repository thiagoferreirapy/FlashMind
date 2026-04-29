import { OnboardingPage } from '../pages/OnboardingPage.js'
import { LoginPage } from '../pages/LoginPage.js'
import { RegisterPage } from '../pages/RegisterPage.js'
import { HomePage } from '../pages/HomePage.js'
import { DecksPage } from '../pages/DecksPage.js'
import { DeckDetailPage } from '../pages/DeckDetailPage.js'
import { StudyPage } from '../pages/StudyPage.js'
import { DashboardPage } from '../pages/DashboardPage.js'
import { RemindersPage } from '../pages/RemindersPage.js'
import { SettingsPage } from '../pages/SettingsPage.js'
import { ImportDeckPage } from '../pages/ImportDeckPage.js'
import { ResetPasswordPage } from '../pages/ResetPasswordPage.js'
import { refreshIcons } from '../utils/icons.js'

const ROUTES = {
  '/onboarding': OnboardingPage,
  '/login': LoginPage,
  '/register': RegisterPage,
  '/reset-password': ResetPasswordPage,
  '/home': HomePage,
  '/decks': DecksPage,
  '/deck/:id': DeckDetailPage,
  '/study/:deckId': StudyPage,
  '/dashboard': DashboardPage,
  '/reminders': RemindersPage,
  '/settings': SettingsPage,
  '/import-deck': ImportDeckPage,
}

export class Router {
  constructor() {
    this.currentPage = null
  }

  init() {
    window.addEventListener('hashchange', () => this.handleRoute())
    this.handleRoute()
  }

  handleRoute() {
    const hash = window.location.hash.slice(1) || '/home'
    const container = document.getElementById('view-container')

    let PageClass = null
    let params = {}

    for (const [pattern, Page] of Object.entries(ROUTES)) {
      const match = this._match(pattern, hash)
      if (match !== null) {
        PageClass = Page
        params = match
        break
      }
    }

    if (!PageClass) PageClass = ROUTES['/home']

    window.dispatchEvent(new CustomEvent('routechange', { detail: { route: hash } }))

    if (this.currentPage?.destroy) this.currentPage.destroy()

    container.innerHTML = ''
    container.scrollTop = 0

    this.currentPage = new PageClass(container, params)
    
    // Show skeleton if available
    if (this.currentPage.skeleton) {
      container.innerHTML = this.currentPage.skeleton()
      refreshIcons()
    }

    const result = this.currentPage.render()
    // Handle both sync and async renders
    if (result && typeof result.then === 'function') {
      result.then(() => refreshIcons())
    } else {
      refreshIcons()
    }

  }

  _match(pattern, path) {
    const pp = pattern.split('/')
    const qp = path.split('?')[0].split('/')

    if (pp.length !== qp.length) return null

    const params = {}
    for (let i = 0; i < pp.length; i++) {
      if (pp[i].startsWith(':')) {
        params[pp[i].slice(1)] = decodeURIComponent(qp[i])
      } else if (pp[i] !== qp[i]) {
        return null
      }
    }
    return params
  }

  navigate(route) {
    window.location.hash = route
  }

  back() {
    window.history.back()
  }
}
