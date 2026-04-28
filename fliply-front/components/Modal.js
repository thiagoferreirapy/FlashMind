export class Modal {
  constructor({ title, content, onClose }) {
    this.title   = title
    this.content = content
    this.onClose = onClose
    this.el      = null
  }

  open() {
    const container = document.getElementById('modal-container')

    // Cria overlay como elemento independente (permite empilhamento)
    const overlay = document.createElement('div')
    overlay.className = 'modal-overlay'
    overlay.innerHTML = `
      <div class="modal-content animate-slide-up">
        <div class="modal-handle"></div>
        ${this.title ? `<div class="modal-title">${this.title}</div>` : ''}
        ${this.content}
      </div>
    `
    container.appendChild(overlay)
    this.el = overlay

    const contentEl = overlay.querySelector('.modal-content')
    const handleEl  = overlay.querySelector('.modal-handle')
    const titleEl   = overlay.querySelector('.modal-title')

    document.body.classList.add('no-scroll')

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) this.close()
    })

    // Drag to dismiss
    let startY = 0, currentY = 0, isDragging = false

    const onStart = (e) => {
      startY = e.touches ? e.touches[0].clientY : e.clientY
      isDragging = true
      contentEl.style.transition = 'none'
    }

    const onMove = (e) => {
      if (!isDragging) return
      currentY = e.touches ? e.touches[0].clientY : e.clientY
      const deltaY = Math.max(0, currentY - startY)
      if (deltaY > 0) {
        const opacity = Math.max(0, 1 - (deltaY / 400))
        contentEl.style.transform = `translateY(${deltaY}px)`
        overlay.style.backgroundColor = `rgba(0, 0, 0, ${0.75 * opacity})`
      }
    }

    const onEnd = () => {
      if (!isDragging) return
      isDragging = false
      const deltaY = currentY - startY
      if (deltaY > 150) {
        this.close()
      } else {
        contentEl.style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
        contentEl.style.transform = 'translateY(0)'
        overlay.style.transition = 'background-color 0.3s ease'
        overlay.style.backgroundColor = 'var(--bg-overlay)'
        setTimeout(() => {
          contentEl.style.transition = ''
          overlay.style.transition = ''
        }, 300)
      }
    }

    handleEl.addEventListener('touchstart', onStart, { passive: true })
    handleEl.addEventListener('touchmove',  onMove,  { passive: true })
    handleEl.addEventListener('touchend',   onEnd)

    if (titleEl) {
      titleEl.addEventListener('touchstart', onStart, { passive: true })
      titleEl.addEventListener('touchmove',  onMove,  { passive: true })
      titleEl.addEventListener('touchend',   onEnd)
    }

    return this
  }

  close() {
    if (!this.el) return
    const overlay   = this.el
    const contentEl = overlay.querySelector('.modal-content')

    contentEl.classList.remove('animate-slide-up')
    contentEl.style.transition = 'transform 0.35s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease'
    overlay.style.transition   = 'opacity 0.3s ease'

    requestAnimationFrame(() => {
      contentEl.style.transform = 'translateY(100%)'
      contentEl.style.opacity   = '0'
      overlay.style.opacity     = '0'
    })

    setTimeout(() => {
      overlay.remove()
      this.el = null
      // Remove no-scroll só quando não houver mais nenhum modal aberto
      if (!document.getElementById('modal-container').querySelector('.modal-overlay')) {
        document.body.classList.remove('no-scroll')
      }
      if (this.onClose) this.onClose()
    }, 350)
  }

  static confirm({ title, message, confirmText = 'Confirmar', onConfirm, onCancel, danger = false }) {
    let confirmed = false
    const modal = new Modal({
      title,
      content: `
        <div style="padding-bottom: 24px">
          <p style="color: var(--text-secondary); font-size: 15px; line-height: 1.5">${message}</p>
        </div>
        <div class="flex gap-sm">
          <button class="btn btn-secondary flex-1" id="modal-cancel">Cancelar</button>
          <button class="btn ${danger ? 'btn-danger' : 'btn-primary'} flex-1" id="modal-confirm">${confirmText}</button>
        </div>
      `,
      onClose: () => { if (!confirmed && onCancel) onCancel() }
    })
    modal.open()

    // Escopo ao overlay para não conflitar com IDs de modais empilhados
    modal.el.querySelector('#modal-cancel').addEventListener('click', () => modal.close())
    modal.el.querySelector('#modal-confirm').addEventListener('click', () => {
      confirmed = true
      if (onConfirm) onConfirm()
      modal.close()
    })
    return modal
  }
}
