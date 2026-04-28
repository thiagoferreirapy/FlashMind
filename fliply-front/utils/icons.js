/**
 * Lucide Icons utility for the Fliply app.
 * Uses the global `lucide` object loaded via CDN.
 */

/**
 * Returns an inline <i> tag for a Lucide icon.
 * After inserting HTML containing these tags, call `refreshIcons()`.
 * @param {string} name - Lucide icon name (e.g. 'home', 'book-open')
 * @param {number} [size=18] - Icon size in pixels
 * @param {string} [cls=''] - Additional CSS classes
 * @param {string} [color=''] - Optional color override
 * @returns {string} HTML string
 */
export function icon(name, size = 18, cls = '', color = '') {
  const style = `width:${size}px;height:${size}px;${color ? `color:${color}` : ''}`
  return `<i data-lucide="${name}" class="lucide-icon ${cls}" style="${style}"></i>`
}

/**
 * Must be called after any dynamic render that includes Lucide icon markup.
 * Scans the DOM and replaces <i data-lucide="..."> with SVG icons.
 */
export function refreshIcons() {
  if (window.lucide) {
    window.lucide.createIcons()
  }
}
