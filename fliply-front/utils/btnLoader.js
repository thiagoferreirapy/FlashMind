const LOADER_HTML = `
  <span class="btn-loader">
    <span class="btn-card btn-card-1"></span>
    <span class="btn-card btn-card-2"></span>
    <span class="btn-card btn-card-3"></span>
  </span>
`

export function setButtonLoading(btn, text = '') {
  btn.disabled = true
  btn._originalHTML = btn.innerHTML
  btn.innerHTML = text
    ? `${LOADER_HTML}<span>${text}</span>`
    : LOADER_HTML
}

export function resetButton(btn, html) {
  btn.disabled = false
  btn.innerHTML = html ?? btn._originalHTML ?? ''
}
