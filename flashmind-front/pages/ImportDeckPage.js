import { Api } from '../utils/api.js'
import { Modal } from '../components/Modal.js'
import { icon, refreshIcons } from '../utils/icons.js'
import { setButtonLoading, resetButton } from '../utils/btnLoader.js'
import { renderDeckIcon } from '../utils/helpers.js'

export class ImportDeckPage {
  constructor(container) {
    this.container = container
    this.preview = null
    this.loading = false
  }

  async render() {
    this.container.innerHTML = this._template()
    this._bindEvents()
    refreshIcons()
  }

  _template() {
    return `
      <div class="animate-slide-right">
        <div class="page-header" style="display:flex;align-items:center;gap:var(--space-sm)">
          <button id="btn-back" style="background:none;border:none;cursor:pointer;color:var(--text-primary);display:flex;align-items:center;padding:4px 2px">${icon('arrow-left', 22)}</button>
          <h1>Importar Deck</h1>
        </div>

        <div style="padding: var(--space-md); max-width: 500px; margin: 0 auto;">

          <!-- Search Box -->
          <div style="margin-bottom: var(--space-lg);">
            <label style="display: block; font-weight: 600; margin-bottom: 8px;">Código do Deck</label>
            <div style="display: flex; gap: var(--space-sm);">
              <input
                type="text"
                id="share-code-input"
                placeholder="Ex: ABC12345"
                style="flex: 1; padding: 12px 16px; border: 2px solid var(--border-color); border-radius: 8px; font-size: 16px; font-family: monospace; background: var(--bg-input); color: var(--text-primary);"
                maxlength="50"
              />
              <button id="search-btn" style="padding: 12px 24px; background: linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%); color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; transition: all 0.3s; display: flex; align-items: center; gap: 8px;">
                ${icon('search', 18)}
                <span>Buscar</span>
              </button>
            </div>
          </div>

          <!-- Preview Container -->
          <div id="preview-container" style="display: none;">
            <div class="card" style="padding: var(--space-md); background: linear-gradient(135deg, var(--surface) 0%, var(--surface-secondary) 100%);">

              <!-- Deck Header -->
              <div style="display: flex; gap: var(--space-md); margin-bottom: var(--space-md);">
                <div id="deck-icon" style="font-size: 48px; display: flex; align-items: center;"></div>
                <div style="flex: 1;">
                  <h2 id="deck-name" style="margin: 0 0 4px; font-size: 20px;"></h2>
                  <p id="deck-owner" style="margin: 0; font-size: 13px; color: var(--text-secondary);"></p>
                  <div id="deck-stats" style="display: flex; gap: var(--space-md); margin-top: 8px; font-size: 13px;">
                    <span style="background: rgba(124, 58, 237, 0.1); padding: 4px 8px; border-radius: 4px;">
                      <span id="card-count">0</span> cards
                    </span>
                  </div>
                </div>
              </div>

              <!-- Deck Description -->
              <p id="deck-description" style="margin: var(--space-md) 0; color: var(--text-secondary); line-height: 1.5;"></p>

              <!-- Cards Preview -->
              <div style="margin: var(--space-md) 0;">
                <label style="display: block; font-weight: 600; margin-bottom: 8px; font-size: 12px; text-transform: uppercase; color: var(--text-muted);">
                  Prévia dos cards
                </label>
                <div id="cards-preview" style="max-height: 300px; overflow-y: auto; display: flex; flex-direction: column; gap: 8px;"></div>
              </div>

              <!-- Actions -->
              <div style="display: flex; gap: var(--space-sm); margin-top: var(--space-md);">
                <button id="import-btn" style="flex: 1; padding: 12px; background: linear-gradient(135deg, #10B981 0%, #059669 100%); color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; transition: all 0.3s; display: flex; align-items: center; justify-content: center; gap: 8px;">
                  ${icon('download', 16)}
                  <span>Importar Deck</span>
                </button>
                <button id="cancel-btn" style="flex: 0 0 auto; padding: 12px 16px; background: var(--surface); border: 2px solid var(--border-color); border-radius: 8px; cursor: pointer; transition: all 0.3s;">
                  ${icon('x', 16)}
                </button>
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div id="empty-state" style="text-align: center; padding: var(--space-xl) 0;">
            <div style="font-size: 64px; margin-bottom: var(--space-md);">${icon('inbox', 48)}</div>
            <p style="color: var(--text-secondary);">Digite um código para ver a prévia</p>
          </div>

          <!-- Loading State -->
          <div id="loading-state" style="display: none; text-align: center; padding: var(--space-xl) 0;">
            <div style="display: inline-block; width: 40px; height: 40px; border: 4px solid var(--border-color); border-top-color: #7C3AED; border-radius: 50%; animation: spin 1s linear infinite;"></div>
            <p style="margin-top: var(--space-md); color: var(--text-secondary);">Buscando deck...</p>
          </div>

          <!-- Error State -->
          <div id="error-state" style="display: none; padding: var(--space-md); background: rgba(239, 68, 68, 0.1); border-left: 4px solid #EF4444; border-radius: 4px;">
            <p id="error-message" style="margin: 0; color: #DC2626;"></p>
          </div>

        </div>

        <style>
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        </style>
      </div>
    `
  }

  _bindEvents() {
    const input = this.container.querySelector('#share-code-input')
    const searchBtn = this.container.querySelector('#search-btn')
    const importBtn = this.container.querySelector('#import-btn')
    const cancelBtn = this.container.querySelector('#cancel-btn')

    this.container.querySelector('#btn-back')?.addEventListener('click', () => {
      const page = this.container.querySelector('.animate-slide-right')
      if (page) {
        page.classList.remove('animate-slide-right')
        page.classList.add('animate-slide-out-right')
        page.addEventListener('animationend', () => window.router.back(), { once: true })
      } else {
        window.router.back()
      }
    })
    searchBtn.addEventListener('click', () => this._search())
    importBtn.addEventListener('click', () => this._import())
    cancelBtn.addEventListener('click', () => this._clearPreview())

    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this._search()
    })

    input.addEventListener('input', (e) => {
      e.target.value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '')
    })
  }

  async _search() {
    const input = this.container.querySelector('#share-code-input')
    const code = input.value.trim()

    if (!code) {
      window.toast.error('Digite um código')
      return
    }

    this.loading = true
    this._showLoading()

    try {
      const preview = await Api.get(`/decks/share/${code}`)
      this.preview = preview
      this._showPreview()
      window.toast.success('Deck encontrado!')
    } catch (error) {
      this._showError(error.message || 'Deck não encontrado')
      window.toast.error('Erro ao buscar deck')
    } finally {
      this.loading = false
    }
  }

  async _import() {
    if (!this.preview) return

    const code = this.container.querySelector('#share-code-input').value

    try {
      const importBtn = this.container.querySelector('#import-btn')
      setButtonLoading(importBtn, 'Importando...')

      const response = await Api.post(`/decks/share/${code}/import`, {})

      window.toast.success('✅ Deck importado com sucesso!')
      this._clearPreview()
    } catch (error) {
      window.toast.error(error.message || 'Erro ao importar deck')
      const importBtn = this.container.querySelector('#import-btn')
      resetButton(importBtn, `${icon('download', 16)}<span>Importar Deck</span>`)
    }
  }

  _showLoading() {
    this.container.querySelector('#preview-container').style.display = 'none'
    this.container.querySelector('#empty-state').style.display = 'none'
    this.container.querySelector('#error-state').style.display = 'none'
    this.container.querySelector('#loading-state').style.display = 'block'
  }

  _showPreview() {
    const deck = this.preview
    const container = this.container.querySelector('#preview-container')

    this.container.querySelector('#deck-icon').innerHTML = renderDeckIcon(deck.deckIcon, 48)
    this.container.querySelector('#deck-name').textContent = deck.deckName
    this.container.querySelector('#deck-owner').textContent = `Criado por ${deck.ownerName}`
    this.container.querySelector('#card-count').textContent = deck.cardCount
    this.container.querySelector('#deck-description').textContent = deck.deckDescription || 'Sem descrição'

    const cardsContainer = this.container.querySelector('#cards-preview')
    cardsContainer.innerHTML = deck.cards.slice(0, 5).map((card, idx) => `
      <div style="padding: 12px; background: ${deck.deckColor || '#7C3AED'}18; border-radius: 6px;">
        <div style="font-size: 12px; color: var(--text-muted); margin-bottom: 4px;">Card ${idx + 1}</div>
        <div style="font-size: 13px; font-weight: 500; margin-bottom: 4px;">${this._truncate(card.front, 60)}</div>
        <div style="font-size: 12px; color: var(--text-secondary);">→ ${this._truncate(card.back, 60)}</div>
      </div>
    `).join('')

    if (deck.cardCount > 5) {
      cardsContainer.innerHTML += `
        <div style="padding: 12px; text-align: center; color: var(--text-muted); font-size: 12px;">
          +${deck.cardCount - 5} cards
        </div>
      `
    }

    this.container.querySelector('#preview-container').style.display = 'block'
    this.container.querySelector('#empty-state').style.display = 'none'
    this.container.querySelector('#error-state').style.display = 'none'
    this.container.querySelector('#loading-state').style.display = 'none'
  }

  _showError(message) {
    this.container.querySelector('#error-state').style.display = 'block'
    this.container.querySelector('#error-message').textContent = message
    this.container.querySelector('#preview-container').style.display = 'none'
    this.container.querySelector('#empty-state').style.display = 'none'
    this.container.querySelector('#loading-state').style.display = 'none'
  }

  _clearPreview() {
    this.preview = null
    this.container.querySelector('#share-code-input').value = ''
    this.container.querySelector('#preview-container').style.display = 'none'
    this.container.querySelector('#error-state').style.display = 'none'
    this.container.querySelector('#empty-state').style.display = 'block'
    this.container.querySelector('#loading-state').style.display = 'none'
  }

  _truncate(text, length) {
    return text && text.length > length ? text.substring(0, length) + '...' : text
  }
}
