import { Deck } from '../models/Deck.js'
import { Modal } from '../components/Modal.js'
import { DECK_COLORS, DECK_ICONS, renderDeckIcon } from '../utils/helpers.js'
import { icon, refreshIcons } from '../utils/icons.js'
import { setButtonLoading, resetButton } from '../utils/btnLoader.js'

export class DecksPage {
  constructor(container) {
    this.container = container
    this.decks = []
    this.search = ''
  }

  async render() {
    try { this.decks = await Deck.fetchAll() } catch { this.decks = [] }
    this.container.innerHTML = this._template()
    this._bindEvents()
    refreshIcons()
  }

  _template() {
    const filtered = this.decks.filter(d => d.name.toLowerCase().includes(this.search.toLowerCase()))
    return `
      <div class="animate-fade">
        <div class="page-header">
          <h1>Meus Decks</h1>
          <div style="display: flex; gap: 8px;">
            <button class="icon-btn" id="btn-import-deck" title="Importar deck" style="background: linear-gradient(135deg, rgba(16,185,129,0.2) 0%, rgba(16,185,129,0.1) 100%); color: #10B981;">${icon('download', 18)}</button>
            <button class="icon-btn" id="btn-new-deck" title="Novo deck">＋</button>
          </div>
        </div>
        <div style="padding:var(--space-md) var(--space-md) var(--space-sm)">
          <input type="search" class="form-input" id="deck-search" placeholder="Buscar decks..." value="${this.search}">
        </div>
        <div style="padding:0 var(--space-md) var(--space-md)" data-deck-list>
          ${filtered.length === 0 ? `
            <div class="empty-state">
              <div class="empty-state-icon">${icon('inbox', 56)}</div>
              <div class="empty-state-title">${this.search ? 'Nenhum resultado' : 'Nenhum deck ainda'}</div>
              <div class="empty-state-text">${this.search ? 'Tente outro termo de busca' : 'Crie seu primeiro deck para começar a estudar!'}</div>
              ${!this.search ? '<button class="btn btn-primary mt-md" id="btn-empty-new">+ Criar meu primeiro deck</button>' : ''}
            </div>
          ` : filtered.map(d => this._deckItem(d)).join('')}
        </div>
      </div>
      <button class="fab" id="fab-new-deck">＋</button>`
  }

  _deckItem(d) {
    return `<div class="deck-card" data-id="${d.id}" data-action="open" style="background:${d.color}14">
      <div class="deck-card-icon" style="background:${d.color}35">${renderDeckIcon(d.icon, 24)}</div>
      <div class="deck-card-info">
        <div class="deck-card-name">${d.name}</div>
        <div class="deck-card-meta">${d.card_count} cards${d.due_count > 0 ? ` · <span style="color:var(--clr-warning)">${icon('clock',12)} ${d.due_count} p/ revisar</span>` : ''}</div>
      </div>
      <button class="icon-btn" data-id="${d.id}" data-action="menu" style="background:transparent;border:none">⋮</button>
    </div>`
  }

  skeleton() {
    return `
      <div class="animate-fade">
        <div class="page-header" style="border:none">
          <div class="skeleton" style="width:120px;height:24px"></div>
        </div>

        <div style="padding:var(--space-md) var(--space-md) var(--space-sm)">
          <div class="skeleton" style="width:100%;height:48px;border-radius:var(--radius-md)"></div>
        </div>

        <div style="padding:0 var(--space-md) var(--space-md)">
          ${[1, 2, 3, 4].map(() => `
            <div class="skeleton" style="width:100%;height:72px;border-radius:var(--radius-lg);margin-bottom:var(--space-sm)"></div>
          `).join('')}
        </div>
      </div>
    `
  }

  _bindEvents() {
    const openNew = () => this._openDeckModal()
    const openImport = () => window.router.navigate('/import-deck')
    this.container.querySelector('#btn-new-deck')?.addEventListener('click', openNew)
    this.container.querySelector('#btn-import-deck')?.addEventListener('click', openImport)
    this.container.querySelector('#fab-new-deck')?.addEventListener('click', openNew)
    this.container.querySelector('#btn-empty-new')?.addEventListener('click', openNew)
    this.container.querySelector('#deck-search')?.addEventListener('input', e => {
      this.search = e.target.value
      const filtered = this.decks.filter(d => d.name.toLowerCase().includes(this.search.toLowerCase()))
      const listEl = this.container.querySelector('[data-deck-list]') || this.container.querySelector('.deck-card')?.parentElement
      if (listEl) listEl.innerHTML = this._renderList(filtered)
      this._bindDeckEvents()
      refreshIcons()
    })
    this._bindDeckEvents()
  }

  _bindDeckEvents() {
    this.container.querySelectorAll('.deck-card').forEach(card => {
      card.addEventListener('click', (e) => {
        const menuBtn = e.target.closest('[data-action="menu"]')
        if (menuBtn) this._openDeckMenu(menuBtn.dataset.id)
        else window.router.navigate(`/deck/${card.dataset.id}`)
      })
    })
  }

  _renderList(decks) {
    if (decks.length === 0) return `<div class="empty-state"><div class="empty-state-icon">${icon('search',56)}</div><div class="empty-state-title">Nenhum resultado</div></div>`
    return decks.map(d => this._deckItem(d)).join('')
  }

  _openDeckModal(existing) {
    const isEdit = !!existing
    let selectedColor = existing?.color || DECK_COLORS[0]
    let selectedIcon  = existing?.icon  || DECK_ICONS[0]
    const modal = new Modal({
      title: isEdit ? 'Editar deck' : 'Novo deck',
      content: `
        <div class="form-group"><label class="form-label">Nome</label>
          <input id="deck-name" type="text" class="form-input" placeholder="Ex.: Inglês Básico" value="${existing?.name || ''}"></div>
        <div class="form-group"><label class="form-label">Descrição (opcional)</label>
          <input id="deck-desc" type="text" class="form-input" placeholder="Uma breve descrição" value="${existing?.description || ''}"></div>
        <div class="form-group"><label class="form-label">Ícone</label>
          <div class="flex gap-sm" style="flex-wrap:wrap" id="icon-picker">
            ${DECK_ICONS.map(ic => `<button class="btn btn-sm btn-secondary icon-opt ${ic === selectedIcon ? 'btn-primary' : ''}" data-icon="${ic}" style="min-width:48px;min-height:48px">${renderDeckIcon(ic, 22)}</button>`).join('')}
          </div></div>
        <div class="form-group"><label class="form-label">Cor</label>
          <div class="color-picker" id="color-picker">
            ${DECK_COLORS.map(c => `<div class="color-option ${c === selectedColor ? 'selected' : ''}" data-color="${c}" style="background:${c}"></div>`).join('')}
          </div></div>
        <div class="flex gap-sm mt-md">
          <button class="btn btn-secondary flex-1" id="deck-cancel">Cancelar</button>
          <button class="btn btn-primary flex-1" id="deck-save">${isEdit ? 'Salvar' : 'Criar'}</button></div>`
    })
    modal.open(); refreshIcons()
    document.getElementById('icon-picker').addEventListener('click', e => {
      const btn = e.target.closest('.icon-opt'); if (!btn) return
      selectedIcon = btn.dataset.icon
      document.querySelectorAll('.icon-opt').forEach(b => { b.classList.toggle('btn-primary', b.dataset.icon === selectedIcon); b.classList.toggle('btn-secondary', b.dataset.icon !== selectedIcon) })
    })
    document.getElementById('color-picker').addEventListener('click', e => {
      const opt = e.target.closest('.color-option'); if (!opt) return
      selectedColor = opt.dataset.color
      document.querySelectorAll('.color-option').forEach(o => o.classList.toggle('selected', o.dataset.color === selectedColor))
    })
    document.getElementById('deck-cancel').addEventListener('click', () => modal.close())
    document.getElementById('deck-save').addEventListener('click', async () => {
      const name = document.getElementById('deck-name').value.trim()
      if (!name) { window.toast.error('Nome é obrigatório'); return }
      const btn = document.getElementById('deck-save'); setButtonLoading(btn, 'Salvando...')
      const payload = { name, description: document.getElementById('deck-desc').value.trim(), icon: selectedIcon, color: selectedColor }
      try {
        if (isEdit) { const updated = await existing.update(payload); const idx = this.decks.findIndex(d => d.id === existing.id); if (idx >= 0) this.decks[idx] = updated }
        else { const deck = await Deck.create(payload); this.decks.unshift(deck) }
        modal.close(); this.container.innerHTML = this._template(); this._bindEvents(); refreshIcons()
        window.toast.success(isEdit ? 'Deck atualizado!' : 'Deck criado!')
      } catch (err) { window.toast.error(err.message); resetButton(btn, isEdit ? 'Salvar' : 'Criar') }
    })
  }

  _openDeckMenu(deckId) {
    const deck = this.decks.find(d => d.id == deckId); if (!deck) return
    const modal = new Modal({
      title: deck.name,
      content: `<div class="flex flex-col gap-sm">
        <button class="btn btn-secondary btn-block" id="dm-study">${icon('zap',16)} Estudar</button>
        <button class="btn btn-secondary btn-block" id="dm-edit">${icon('pencil',16)} Editar</button>
        <button class="btn btn-secondary btn-block" id="dm-share">${icon('link',16)} Compartilhar</button>
        <button class="btn btn-danger btn-block" id="dm-delete">${icon('trash-2',16)} Excluir</button></div>`
    })
    modal.open(); refreshIcons()
    document.getElementById('dm-study').addEventListener('click', () => { modal.close(); window.router.navigate(`/study/${deck.id}`) })
    document.getElementById('dm-edit').addEventListener('click', () => { modal.close(); this._openDeckModal(deck) })
    document.getElementById('dm-share').addEventListener('click', async () => {
      try {
        const res = await deck.share()
        modal.close()
        const shareModal = new Modal({ title: 'Compartilhar deck', content: `
          <p style="color:var(--text-secondary);margin-bottom:var(--space-md)">Compartilhe este código com outros usuários:</p>
          <div style="background:var(--bg-input);border-radius:var(--radius-md);padding:var(--space-md);text-align:center;font-size:24px;font-weight:800;letter-spacing:0.1em;color:var(--clr-primary-light)">${res.shareCode}</div>

          <div style="display:flex;align-items:center;justify-content:space-between;margin-top:var(--space-md);padding:var(--space-md);background:var(--bg-input);border-radius:var(--radius-md)">
            <div>
              <div style="font-weight:600;font-size:14px">Visibilidade</div>
              <div id="visibility-label" style="font-size:12px;color:var(--text-secondary);margin-top:2px">${res.isPublic ? 'Público — qualquer um pode importar' : 'Privado — somente você acessa'}</div>
            </div>
            <label style="position:relative;display:inline-block;width:44px;height:24px;flex-shrink:0">
              <input type="checkbox" id="visibility-toggle" ${res.isPublic ? 'checked' : ''} style="opacity:0;width:0;height:0">
              <span id="visibility-slider" style="position:absolute;cursor:pointer;inset:0;border-radius:24px;background:${res.isPublic ? '#7C3AED' : 'var(--border-color)'};transition:background 0.2s">
                <span style="position:absolute;height:18px;width:18px;left:${res.isPublic ? '23px' : '3px'};bottom:3px;border-radius:50%;background:#fff;transition:left 0.2s;display:block" id="visibility-knob"></span>
              </span>
            </label>
          </div>

          <button class="btn btn-primary btn-block mt-md" id="copy-code">${icon('clipboard',16)} Copiar código</button>`
        })
        shareModal.open(); refreshIcons()

        document.getElementById('copy-code')?.addEventListener('click', () => {
          navigator.clipboard?.writeText(res.shareCode)
          window.toast.success('Código copiado!')
        })

        document.getElementById('visibility-toggle')?.addEventListener('change', async (e) => {
          const newValue = e.target.checked
          const slider = document.getElementById('visibility-slider')
          const knob = document.getElementById('visibility-knob')
          const label = document.getElementById('visibility-label')
          try {
            await deck.updateShareVisibility(newValue)
            slider.style.background = newValue ? '#7C3AED' : 'var(--border-color)'
            knob.style.left = newValue ? '23px' : '3px'
            label.textContent = newValue ? 'Público — qualquer um pode importar' : 'Privado — somente você acessa'
            window.toast.success(newValue ? 'Deck público!' : 'Deck privado!')
          } catch (err) {
            e.target.checked = !newValue
            window.toast.error(err.message)
          }
        })
      } catch (err) { window.toast.error(err.message) }
    })
    document.getElementById('dm-delete').addEventListener('click', () => {
      modal.close()
      Modal.confirm({ title: 'Excluir deck', message: `Tem certeza que deseja excluir "${deck.name}"? Todos os cards e progresso serão perdidos.`, confirmText: 'Excluir', danger: true,
        onConfirm: async () => {
          try { await deck.delete(); this.decks = this.decks.filter(d => d.id !== deck.id); this.container.innerHTML = this._template(); this._bindEvents(); refreshIcons(); window.toast.success('Deck excluído') }
          catch (err) { window.toast.error(err.message) }
        }
      })
    })
  }

  destroy() {}
}
