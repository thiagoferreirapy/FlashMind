const MIN_DISPLAY_MS = 1300

export class Loader {
  constructor() {
    this._shownAt = Date.now()
  }

  show() {
    const el = document.getElementById('loader')
    el.classList.remove('hiding')
    el.classList.add('active')
    this._shownAt = Date.now()
  }

  hide() {
    const el = document.getElementById('loader')
    if (!el.classList.contains('active')) return
    const elapsed = Date.now() - this._shownAt
    const remaining = Math.max(0, MIN_DISPLAY_MS - elapsed)
    setTimeout(() => {
      el.classList.add('hiding')
      setTimeout(() => el.classList.remove('active', 'hiding'), 320)
    }, remaining)
  }
}
