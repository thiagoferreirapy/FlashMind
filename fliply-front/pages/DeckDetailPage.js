import { Deck } from '../models/Deck.js'
import { Card } from '../models/Card.js'
import { Modal } from '../components/Modal.js'
import { renderDeckIcon } from '../utils/helpers.js'
import { icon, refreshIcons } from '../utils/icons.js'

export class DeckDetailPage {
  constructor(container, params) {
    this.container = container
    this.deckId = params.id
    this.deck = null
    this.cards = []
  }

  async render() {
    try {
      const [deck, cards] = await Promise.all([Deck.fetchById(this.deckId), Card.fetchByDeck(this.deckId)])
      this.deck = deck; this.cards = cards
    } catch (err) { window.toast.error('Erro ao carregar deck') }
    this.container.innerHTML = this._template()
    this._bindEvents()
    refreshIcons()
  }

  _template() {
    const d = this.deck
    if (!d) return '<div class="empty-state"><div class="empty-state-title">Deck não encontrado</div></div>'
    return `
      <div class="animate-fade">
        <div class="page-header">
          <button class="icon-btn" id="btn-back">${icon('arrow-left',18)}</button>
          <h1 style="font-size:17px" class="truncate">${renderDeckIcon(d.icon, 20)} ${d.name}</h1>
          <button class="icon-btn" id="btn-deck-menu">⋮</button>
        </div>
        <div style="padding:var(--space-md)">
          <div style="background:${d.color}20;border:1px solid ${d.color}40;border-radius:var(--radius-xl);padding:var(--space-lg);margin-bottom:var(--space-md)">
            <div style="font-size:48px;margin-bottom:var(--space-sm)">${renderDeckIcon(d.icon, 48)}</div>
            <div style="font-size:20px;font-weight:800">${d.name}</div>
            ${d.description ? `<div style="font-size:13px;color:var(--text-secondary);margin-top:4px">${d.description}</div>` : ''}
            <div style="display:flex;gap:var(--space-md);margin-top:var(--space-md)">
              <div style="text-align:center"><div style="font-size:20px;font-weight:800">${this.cards.length}</div><div style="font-size:11px;color:var(--text-secondary)">Cards</div></div>
              <div style="text-align:center"><div style="font-size:20px;font-weight:800;color:var(--clr-warning)">${d.due_count ?? 0}</div><div style="font-size:11px;color:var(--text-secondary)">Revisão</div></div>
            </div>
          </div>
          <div class="flex gap-sm mb-md">
            <button class="btn btn-primary flex-1" id="btn-study" ${this.cards.length === 0 ? 'disabled' : ''}>${icon('zap',16)} Estudar</button>
            <button class="btn btn-secondary" id="btn-add-card">＋ Card</button>
          </div>
          <div class="section-header"><div class="section-title">Cards (${this.cards.length})</div></div>
          ${this.cards.length === 0 ? `
            <div class="empty-state"><div class="empty-state-icon">${icon('layers',56)}</div>
              <div class="empty-state-title">Nenhum card</div>
              <div class="empty-state-text">Adicione cards para começar a estudar</div></div>
          ` : this.cards.map((c, i) => `
            <div class="card mb-sm" style="cursor:default">
              <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:var(--space-sm)">
                <div style="flex:1">
                  <div style="font-size:12px;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.08em;margin-bottom:4px">Frente</div>
                  <div style="font-weight:600">${c.front_text}</div>
                  <div style="height:1px;background:var(--border-color);margin:10px 0"></div>
                  <div style="font-size:12px;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.08em;margin-bottom:4px">Verso</div>
                  <div style="color:var(--text-secondary)">${c.back_text}</div>
                </div>
                <div class="flex gap-xs" style="flex-shrink:0">
                  <button class="icon-btn btn-edit-card" data-card-id="${c.id}" data-idx="${i}" style="font-size:13px;width:32px;height:32px">${icon('pencil',14)}</button>
                  <button class="icon-btn btn-delete-card" data-card-id="${c.id}" style="font-size:13px;width:32px;height:32px">${icon('trash-2',14)}</button>
                </div>
              </div>
            </div>`).join('')}
        </div>
      </div>`
  }

  skeleton() {
    return `
      <div class="animate-fade">
        <div class="page-header" style="border:none">
          <div class="skeleton" style="width:36px;height:36px;border-radius:var(--radius-sm)"></div>
          <div class="skeleton" style="width:140px;height:24px;margin-left:12px"></div>
        </div>

        <div style="padding:var(--space-md)">
          <div class="skeleton" style="width:100%;height:140px;border-radius:var(--radius-xl);margin-bottom:var(--space-md)"></div>
          
          <div class="flex gap-sm mb-md">
            <div class="skeleton flex-1" style="height:48px;border-radius:var(--radius-full)"></div>
            <div class="skeleton flex-1" style="height:48px;border-radius:var(--radius-full)"></div>
          </div>

          <div class="skeleton" style="width:120px;height:20px;margin-bottom:var(--space-md)"></div>

          ${[1, 2, 3].map(() => `
            <div class="skeleton" style="width:100%;height:80px;border-radius:var(--radius-lg);margin-bottom:var(--space-sm)"></div>
          `).join('')}
        </div>
      </div>
    `
  }

  _bindEvents() {
    this.container.querySelector('#btn-back')?.addEventListener('click', () => window.router.navigate('/decks'))
    this.container.querySelector('#btn-study')?.addEventListener('click', () => window.router.navigate(`/study/${this.deckId}`))
    this.container.querySelector('#btn-add-card')?.addEventListener('click', () => this._openCardModal())
    this.container.querySelector('#btn-deck-menu')?.addEventListener('click', () => this._deckMenu())
    this.container.querySelectorAll('.btn-edit-card').forEach(btn => {
      btn.addEventListener('click', () => { const card = this.cards[parseInt(btn.dataset.idx)]; this._openCardModal(card) })
    })
    this.container.querySelectorAll('.btn-delete-card').forEach(btn => {
      btn.addEventListener('click', () => {
        const card = this.cards.find(c => c.id == btn.dataset.cardId)
        Modal.confirm({ title: 'Excluir card', message: 'Tem certeza que deseja excluir este card?', confirmText: 'Excluir', danger: true,
          onConfirm: async () => {
            try { await card.delete(); this.cards = this.cards.filter(c => c.id !== card.id); this.container.innerHTML = this._template(); this._bindEvents(); refreshIcons(); window.toast.success('Card excluído') }
            catch (err) { window.toast.error(err.message) }
          }
        })
      })
    })
  }

  _openCardModal(existing) {
    const isEdit = !!existing
    const modal = new Modal({
      title: isEdit ? 'Editar card' : 'Novo card',
      content: `
        <div class="form-group"><label class="form-label">Frente (pergunta)</label>
          <textarea id="card-front" class="form-input" placeholder="Digite a pergunta ou termo" rows="3">${existing?.front_text || ''}</textarea></div>
        <div class="form-group"><label class="form-label">Verso (resposta)</label>
          <textarea id="card-back" class="form-input" placeholder="Digite a resposta ou definição" rows="3">${existing?.back_text || ''}</textarea></div>
        <div class="flex gap-sm mt-md">
          <button class="btn btn-secondary flex-1" id="card-cancel">Cancelar</button>
          <button class="btn btn-primary flex-1" id="card-save">${isEdit ? 'Salvar' : 'Adicionar'}</button></div>`
    })
    modal.open()
    document.getElementById('card-cancel').addEventListener('click', () => modal.close())
    document.getElementById('card-save').addEventListener('click', async () => {
      const front = document.getElementById('card-front').value.trim()
      const back = document.getElementById('card-back').value.trim()
      if (!front || !back) { window.toast.error('Preencha frente e verso'); return }
      const btn = document.getElementById('card-save'); btn.disabled = true; btn.textContent = 'Salvando...'
      try {
        if (isEdit) { const updated = await existing.update({ frontText: front, backText: back }); const idx = this.cards.findIndex(c => c.id === existing.id); if (idx >= 0) this.cards[idx] = updated }
        else { const card = await Card.create(this.deckId, { frontText: front, backText: back }); this.cards.push(card) }
        modal.close(); this.container.innerHTML = this._template(); this._bindEvents(); refreshIcons()
        window.toast.success(isEdit ? 'Card atualizado!' : 'Card adicionado!')
      } catch (err) { window.toast.error(err.message); btn.disabled = false; btn.textContent = isEdit ? 'Salvar' : 'Adicionar' }
    })
  }

  _deckMenu() {
    const deck = this.deck
    const modal = new Modal({
      title: 'Opções do deck',
      content: `<div class="flex flex-col gap-sm">
        <button class="btn btn-secondary btn-block" id="dm-share">${icon('link',16)} Compartilhar deck</button>
        <button class="btn btn-danger btn-block" id="dm-delete">${icon('trash-2',16)} Excluir deck</button></div>`
    })
    modal.open(); refreshIcons()
    document.getElementById('dm-share').addEventListener('click', async () => {
      try {
        const res = await deck.share(); modal.close()
        new Modal({ title: 'Compartilhar deck', content: `
          <p style="color:var(--text-secondary);margin-bottom:var(--space-md)">Compartilhe este código com outros usuários:</p>
          <div style="background:var(--bg-input);border-radius:var(--radius-md);padding:var(--space-md);text-align:center;font-size:24px;font-weight:800;letter-spacing:0.1em;color:var(--clr-primary-light)">${res.shareCode}</div>
          <button class="btn btn-primary btn-block mt-md" id="copy-code">${icon('clipboard',16)} Copiar código</button>`
        }).open(); refreshIcons()
        document.getElementById('copy-code')?.addEventListener('click', () => { navigator.clipboard?.writeText(res.shareCode); window.toast.success('Código copiado!') })
      } catch (err) { window.toast.error(err.message) }
    })
    document.getElementById('dm-delete').addEventListener('click', () => {
      modal.close()
      Modal.confirm({ title: 'Excluir deck', message: `Excluir "${deck.name}" e todos os seus cards?`, confirmText: 'Excluir', danger: true,
        onConfirm: async () => {
          try { await deck.delete(); window.router.navigate('/decks'); window.toast.success('Deck excluído') }
          catch (err) { window.toast.error(err.message) }
        }
      })
    })
  }

  destroy() {}
}
