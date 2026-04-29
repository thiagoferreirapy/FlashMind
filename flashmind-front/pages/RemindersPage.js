import { Api } from '../utils/api.js'
import { Modal } from '../components/Modal.js'
import { Deck } from '../models/Deck.js'
import { icon, refreshIcons } from '../utils/icons.js'
import { setButtonLoading, resetButton } from '../utils/btnLoader.js'

const REMINDER_TYPES = {
  general:     { label: 'Geral',            icon: 'clock',       desc: 'Lembrete para estudar' },
  deck_review: { label: 'Deck específico',  icon: 'library',     desc: 'Vinculado a um deck' },
  due_review:  { label: 'Revisão pendente', icon: 'zap',         desc: 'Cards que precisam de revisão' }
}

const FREQ_OPTS = [
  { value: 'daily',    label: 'Diariamente' },
  { value: 'weekdays', label: 'Dias úteis' },
  { value: 'weekly',   label: 'Semanalmente' },
]

const DEFAULT_CHANNEL = 'in_app'

export class RemindersPage {
  constructor(container) { this.container = container; this.reminders = []; this.decks = [] }

  async render() {
    this.container.innerHTML = this._skeleton()
    try {
      const [reminders, decks] = await Promise.all([Api.get('/reminders'), Deck.fetchAll()])
      this.reminders = reminders; this.decks = decks
    } catch { this.reminders = []; this.decks = [] }
    this.container.innerHTML = this._template()
    this._bindEvents()
    refreshIcons()
  }

  _template() {
    return `
      <div class="animate-fade">
        <div class="page-header"><h1>Lembretes</h1>
          <button class="icon-btn" id="btn-new-reminder">＋</button></div>
        <div style="padding:var(--space-md)">
          ${this.reminders.length === 0 ? `
            <div class="empty-state">
              <div class="empty-state-icon">${icon('bell-off', 56)}</div>
              <div class="empty-state-title">Nenhum lembrete</div>
              <div class="empty-state-text">Crie lembretes para manter sua rotina de estudos em dia</div>
              <button class="btn btn-primary mt-md" id="btn-empty-new">+ Criar lembrete</button></div>
          ` : this.reminders.map(r => {
            const t = REMINDER_TYPES[r.type] || REMINDER_TYPES.general
            return `<div class="reminder-card" data-id="${r.id}">
              <div class="reminder-icon">${icon(t.icon, 22)}</div>
              <div class="reminder-info">
                <div class="reminder-title">${r.title}</div>
                ${r.description ? `<div class="reminder-desc">${r.description}</div>` : ''}
                <div class="reminder-meta">${r.timeOfDay || r.time_of_day} · ${FREQ_OPTS.find(f => f.value === r.frequency)?.label || r.frequency}${r.deckName ? ` · ${r.deckName}` : ''}</div></div>
              <div class="flex items-center gap-sm">
                <label class="toggle"><input type="checkbox" class="toggle-reminder" data-id="${r.id}" ${r.isActive || r.is_active ? 'checked' : ''}><span class="toggle-slider"></span></label>
                <button class="icon-btn btn-edit-reminder" data-id="${r.id}" style="width:32px;height:32px">${icon('pencil', 14)}</button></div>
            </div>`}).join('')}
        </div>
      </div>
      <button class="fab" id="fab-new-reminder">＋</button>`
  }

  _skeleton() {
    return `<div style="padding:var(--space-md)">${[1,2].map(() =>
      '<div style="height:72px;background:var(--bg-card);border-radius:var(--radius-lg);margin-bottom:8px;animation:pulse 1.5s infinite"></div>'
    ).join('')}</div>`
  }

  _bindEvents() {
    const openNew = () => this._openReminderModal()
    this.container.querySelector('#btn-new-reminder')?.addEventListener('click', openNew)
    this.container.querySelector('#fab-new-reminder')?.addEventListener('click', openNew)
    this.container.querySelector('#btn-empty-new')?.addEventListener('click', openNew)
    this.container.querySelectorAll('.toggle-reminder').forEach(toggle => {
      toggle.addEventListener('change', async (e) => {
        try { await Api.patch(`/reminders/${e.target.dataset.id}`, { isActive: e.target.checked }) }
        catch (err) { window.toast.error(err.message); e.target.checked = !e.target.checked }
      })
    })
    this.container.querySelectorAll('.btn-edit-reminder').forEach(btn => {
      btn.addEventListener('click', () => {
        const reminder = this.reminders.find(r => r.id == btn.dataset.id)
        if (reminder) this._openEditModal(reminder)
      })
    })
  }

  _formContent(r = null) {
    const deckOptions = this.decks.map(d =>
      `<option value="${d.id}" ${r?.deckId == d.id ? 'selected' : ''}>${d.name}</option>`
    ).join('')
    return `
      <div class="form-group"><label class="form-label">Tipo</label>
        <select id="rem-type" class="form-input">
          ${Object.entries(REMINDER_TYPES).map(([v,t]) => `<option value="${v}" ${r?.type === v ? 'selected' : ''}>${t.label}</option>`).join('')}
        </select></div>
      <div class="form-group" id="deck-select-group" style="display:${r?.type === 'deck_review' ? '' : 'none'}"><label class="form-label">Deck</label>
        <select id="rem-deck" class="form-input"><option value="">Selecione um deck</option>${deckOptions}</select></div>
      <div class="form-group"><label class="form-label">Título</label>
        <input id="rem-title" type="text" class="form-input" placeholder="Ex.: Hora de estudar!" value="${r?.title || ''}"></div>
      <div class="form-group"><label class="form-label">Descrição <span style="color:var(--text-muted);font-weight:400">(opcional)</span></label>
        <textarea id="rem-desc" class="form-input" placeholder="Ex.: Revisar os cards de vocabulário" rows="2" style="resize:none">${r?.description || ''}</textarea></div>
      <div class="form-group"><label class="form-label">Horário</label>
        <input id="rem-time" type="time" class="form-input" value="${r?.timeOfDay?.slice(0,5) || '08:00'}"></div>
      <div class="form-group"><label class="form-label">Frequência</label>
        <select id="rem-freq" class="form-input">
          ${FREQ_OPTS.map(f => `<option value="${f.value}" ${r?.frequency === f.value ? 'selected' : ''}>${f.label}</option>`).join('')}
        </select></div>
      `
  }

  _bindTypeChange() {
    document.getElementById('rem-type')?.addEventListener('change', e => {
      document.getElementById('deck-select-group').style.display = e.target.value === 'deck_review' ? '' : 'none'
    })
  }

  _openReminderModal() {
    const modal = new Modal({ title: 'Novo lembrete', content: `
      ${this._formContent()}
      <div class="flex gap-sm mt-md">
        <button class="btn btn-secondary flex-1" id="rem-cancel">Cancelar</button>
        <button class="btn btn-primary flex-1" id="rem-save">Criar</button>
      </div>` })
    modal.open()
    this._bindTypeChange()
    document.getElementById('rem-cancel').addEventListener('click', () => modal.close())
    document.getElementById('rem-save').addEventListener('click', async () => {
      const type = document.getElementById('rem-type').value, title = document.getElementById('rem-title').value.trim()
      const description = document.getElementById('rem-desc').value.trim() || null
      const time = document.getElementById('rem-time').value, freq = document.getElementById('rem-freq').value
      const channel = DEFAULT_CHANNEL
      const deckId = type === 'deck_review' ? document.getElementById('rem-deck').value : null
      if (!title) { window.toast.error('Título é obrigatório'); return }
      if (type === 'deck_review' && !deckId) { window.toast.error('Selecione um deck'); return }
      const btn = document.getElementById('rem-save'); setButtonLoading(btn, 'Criando...')
      try {
        const reminder = await Api.post('/reminders', { type, title, description, timeOfDay: time, frequency: freq, channel, deckId: deckId || null, isActive: true })
        this.reminders.unshift(reminder); modal.close(); this.container.innerHTML = this._template(); this._bindEvents(); refreshIcons(); window.toast.success('Lembrete criado!')
      } catch (err) { window.toast.error(err.message); resetButton(btn, 'Criar') }
    })
  }

  _openEditModal(r) {
    const modal = new Modal({ title: 'Editar lembrete', content: `
      ${this._formContent(r)}
      <div class="flex gap-sm mt-md">
        <button class="btn btn-secondary flex-1" id="rem-cancel">Cancelar</button>
        <button class="btn btn-primary flex-1" id="rem-save">Salvar</button>
      </div>
      <button class="btn btn-danger btn-block mt-sm" id="rem-delete">Excluir lembrete</button>` })
    modal.open()
    this._bindTypeChange()
    document.getElementById('rem-cancel').addEventListener('click', () => modal.close())
    document.getElementById('rem-delete').addEventListener('click', () => {
      modal.close()
      Modal.confirm({
        title: 'Excluir lembrete',
        message: 'Tem certeza que deseja excluir este lembrete?',
        confirmText: 'Excluir',
        danger: true,
        onConfirm: async () => {
          try {
            await Api.delete(`/reminders/${r.id}`)
            this.reminders = this.reminders.filter(x => x.id !== r.id)
            this.container.innerHTML = this._template(); this._bindEvents(); refreshIcons()
            window.toast.success('Lembrete excluído')
          } catch (err) { window.toast.error(err.message) }
        },
        onCancel: () => this._openEditModal(r)
      })
    })
    document.getElementById('rem-save').addEventListener('click', async () => {
      const type = document.getElementById('rem-type').value, title = document.getElementById('rem-title').value.trim()
      const description = document.getElementById('rem-desc').value.trim() || null
      const time = document.getElementById('rem-time').value, freq = document.getElementById('rem-freq').value
      const channel = DEFAULT_CHANNEL
      const deckId = type === 'deck_review' ? document.getElementById('rem-deck').value || null : null
      if (!title) { window.toast.error('Título é obrigatório'); return }
      if (type === 'deck_review' && !deckId) { window.toast.error('Selecione um deck'); return }
      const btn = document.getElementById('rem-save'); setButtonLoading(btn, 'Salvando...')
      try {
        const updated = await Api.patch(`/reminders/${r.id}`, { type, title, description, timeOfDay: time, frequency: freq, channel, deckId })
        const idx = this.reminders.findIndex(x => x.id === r.id)
        if (idx !== -1) this.reminders[idx] = updated
        modal.close(); this.container.innerHTML = this._template(); this._bindEvents(); refreshIcons()
        window.toast.success('Lembrete atualizado!')
      } catch (err) { window.toast.error(err.message); resetButton(btn, 'Salvar') }
    })
  }

  destroy() {}
}
