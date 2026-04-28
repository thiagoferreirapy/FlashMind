import { SystemUiService } from './system-ui.js'

const THEME_KEY = 'fliply_theme'

export const ThemeService = {
  getPreference() {
    return localStorage.getItem(THEME_KEY) || 'system'
  },

  setTheme(theme) {
    localStorage.setItem(THEME_KEY, theme)
    this.apply()
  },

  apply() {
    const theme = this.getPreference()
    const html = document.documentElement
    const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)

    if (isDark) {
      html.classList.add('dark-theme')
      html.classList.remove('light-theme')
      html.setAttribute('data-theme', 'dark')
    } else {
      html.classList.add('light-theme')
      html.classList.remove('dark-theme')
      html.setAttribute('data-theme', 'light')
    }

    // Sync with Native System UI
    SystemUiService.sync(isDark)
  },

  init() {
    this.apply()
    // Listen for system theme changes if set to 'system'
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
      if (this.getPreference() === 'system') {
        this.apply()
      }
    })
  }
}
