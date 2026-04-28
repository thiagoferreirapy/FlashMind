export function formatDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

export function formatTime(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
}

export function relativeTime(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  const now = new Date()
  const diff = Math.floor((now - d) / 1000)
  if (diff < 60)   return 'agora mesmo'
  if (diff < 3600) return `${Math.floor(diff / 60)} min atrás`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h atrás`
  return `${Math.floor(diff / 86400)}d atrás`
}

export function initials(name) {
  if (!name) return '?'
  return name.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase()
}

export function randomId() {
  return Math.random().toString(36).slice(2)
}

export function debounce(fn, ms = 300) {
  let t
  return (...args) => {
    clearTimeout(t)
    t = setTimeout(() => fn(...args), ms)
  }
}

export function clamp(val, min, max) {
  return Math.min(Math.max(val, min), max)
}

export function pct(part, total) {
  if (!total) return 0
  return Math.round((part / total) * 100)
}

export const DECK_COLORS = [
  '#7C3AED', '#2563EB', '#0891B2', '#059669',
  '#F59E0B', '#F97316', '#DC2626', '#DB2777'
]

export const DECK_ICONS = ['book-open', 'brain', 'globe', 'microscope', 'monitor', 'guitar', 'pencil', 'dumbbell', 'ruler', 'languages', 'palette', 'lightbulb']

/**
 * Renders a deck icon — supports both Lucide icon names (new) and emoji strings (legacy).
 * @param {string} val - Lucide icon name or emoji
 * @param {number} [size=24] - Size in pixels
 * @returns {string} HTML string
 */
export function renderDeckIcon(val, size = 24) {
  if (!val) return ''
  // If it's a short ascii/dash string, treat as Lucide icon name
  if (/^[a-z][a-z0-9-]*$/.test(val)) {
    return `<i data-lucide="${val}" style="width:${size}px;height:${size}px"></i>`
  }
  // Otherwise it's a legacy emoji
  return `<span style="font-size:${size}px;line-height:1">${val}</span>`
}

