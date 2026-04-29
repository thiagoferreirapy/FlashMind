import { AuthService } from '../utils/auth.js'
import { Api } from '../utils/api.js'
import { Modal } from '../components/Modal.js'
import { initials } from '../utils/helpers.js'
import { icon, refreshIcons } from '../utils/icons.js'
import { setButtonLoading, resetButton } from '../utils/btnLoader.js'
import { ThemeService } from '../utils/theme.js'

export class SettingsPage {
  constructor(container) { this.container = container; this.user = AuthService.getUser(); this.settings = {} }

  async render() {
    try { this.settings = await Api.get('/users/settings') }
    catch { this.settings = { dailyGoal: 20, sessionSize: 10, smartOrder: true, whatsappEnabled: false } }
    this.container.innerHTML = this._template()
    this._bindEvents()
    refreshIcons()
  }

  _template() {
    const u = this.user || {}, s = this.settings
    const currentTheme = ThemeService.getPreference()
    const themeLabels = { system: 'Padrão do sistema', light: 'Claro', dark: 'Escuro' }

    return `
      <div class="animate-fade">
        <div class="page-header"><h1>Configurações</h1></div>
        <div style="padding:var(--space-md)">
          <div class="card flex items-center gap-md mb-md" id="edit-profile" style="cursor:pointer">
            <div class="avatar avatar-md">${initials(u.name)}</div>
            <div style="flex:1"><div style="font-weight:700">${u.name || 'Usuário'}</div>
              <div style="font-size:13px;color:var(--text-secondary)">${u.email || ''}</div></div>
            <div style="color:var(--text-muted)">›</div></div>

          <div style="font-size:11px;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.08em;margin-bottom:var(--space-sm)">Estudo</div>
          <div class="settings-group mb-md">
            <div class="settings-item" id="edit-daily-goal">
              <div class="settings-item-icon" style="background:rgba(124,58,237,0.15)">${icon('target', 18)}</div>
              <div class="settings-item-info"><div class="settings-item-title">Meta diária</div><div class="settings-item-sub">${s.dailyGoal ?? 20} cards por dia</div></div>
              <div class="settings-item-right">›</div></div>
            <div class="settings-item" id="edit-session-size">
              <div class="settings-item-icon" style="background:rgba(16,185,129,0.15)">${icon('package', 18)}</div>
              <div class="settings-item-info"><div class="settings-item-title">Tamanho da sessão</div><div class="settings-item-sub">${s.sessionSize ?? 10} cards por sessão</div></div>
              <div class="settings-item-right">›</div></div>
            <div class="settings-item">
              <div class="settings-item-icon" style="background:rgba(245,158,11,0.15)">${icon('brain', 18)}</div>
              <div class="settings-item-info"><div class="settings-item-title">Ordem inteligente</div><div class="settings-item-sub">Priorizar cards difíceis</div></div>
              <label class="toggle"><input type="checkbox" id="toggle-smart" ${s.smartOrder !== false ? 'checked' : ''}><span class="toggle-slider"></span></label></div>
          </div>

          <div style="font-size:11px;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.08em;margin-bottom:var(--space-sm)">Aparência</div>
          <div class="settings-group mb-md">
            <div class="settings-item" id="edit-theme">
              <div class="settings-item-icon" style="background:rgba(124,58,237,0.15)">${icon('palette', 18)}</div>
              <div class="settings-item-info">
                <div class="settings-item-title">Tema</div>
                <div class="settings-item-sub">${themeLabels[currentTheme]}</div>
              </div>
              <div class="settings-item-right">›</div>
            </div>
          </div>

          <div style="font-size:11px;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.08em;margin-bottom:var(--space-sm)">Notificações</div>
          <div class="settings-group mb-md">
            <div class="settings-item">
              <div class="settings-item-icon" style="background:rgba(16,185,129,0.15)">${icon('message-circle', 18)}</div>
              <div class="settings-item-info"><div class="settings-item-title">Desafios WhatsApp</div><div class="settings-item-sub">${u.whatsappPhone ? u.whatsappPhone : 'Vincule seu número'}</div></div>
              <label class="toggle"><input type="checkbox" id="toggle-whatsapp" ${s.whatsappEnabled ? 'checked' : ''}><span class="toggle-slider"></span></label></div>
            <div class="settings-item" id="edit-whatsapp-time">
              <div class="settings-item-icon" style="background:rgba(16,185,129,0.15)">${icon('clock', 18)}</div>
              <div class="settings-item-info"><div class="settings-item-title">Horário e deck do desafio</div><div class="settings-item-sub" id="whatsapp-cfg-sub">${s.whatsappPreferredTime ? `Envio às ${s.whatsappPreferredTime.split(':')[0]}h` : 'Toque para configurar'}</div></div>
              <div class="settings-item-right">›</div></div>
          </div>

          <div style="font-size:11px;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.08em;margin-bottom:var(--space-sm)">Conta</div>
          <div class="settings-group mb-md">
            <div class="settings-item" id="edit-whatsapp">
              <div class="settings-item-icon" style="background:rgba(16,185,129,0.15)">${icon('smartphone', 18)}</div>
              <div class="settings-item-info"><div class="settings-item-title">Número WhatsApp</div><div class="settings-item-sub">${u.whatsappPhone || 'Não vinculado'}</div></div>
              <div class="settings-item-right">›</div></div>
          </div>

          <button class="btn btn-danger btn-block mt-md" id="btn-logout">Sair da conta</button>
        </div>
      </div>`
  }

  _bindEvents() {
    this.container.querySelector('#edit-profile')?.addEventListener('click', () => this._editProfile())
    this.container.querySelector('#edit-whatsapp')?.addEventListener('click', () => this._editWhatsapp())
    this.container.querySelector('#edit-daily-goal')?.addEventListener('click', () => this._editNumber('dailyGoal', 'Meta diária', 'cards por dia'))
    this.container.querySelector('#edit-session-size')?.addEventListener('click', () => this._editNumber('sessionSize', 'Tamanho da sessão', 'cards por sessão'))
    this.container.querySelector('#edit-theme')?.addEventListener('click', () => this._editTheme())
    this.container.querySelector('#btn-logout')?.addEventListener('click', () => {
      Modal.confirm({ title: 'Sair', message: 'Tem certeza que deseja sair da conta?', confirmText: 'Sair', danger: true, onConfirm: () => AuthService.logout() })
    })

    const toggleSave = async (field, val) => { try { await Api.patch('/users/settings', { [field]: val }) } catch (err) { window.toast.error(err.message) } }
    this.container.querySelector('#toggle-smart')?.addEventListener('change', e => toggleSave('smartOrder', e.target.checked))
    this.container.querySelector('#toggle-whatsapp')?.addEventListener('change', e => {
      if (e.target.checked && !this.user?.whatsappPhone) { e.target.checked = false; this._editWhatsapp() }
      else toggleSave('whatsappEnabled', e.target.checked)
    })
    this.container.querySelector('#edit-whatsapp-time')?.addEventListener('click', () => this._configWhatsapp())
  }

  _editTheme() {
    const current = ThemeService.getPreference()
    const options = [
      { id: 'system', label: 'Padrão do sistema', desc: 'Segue as configurações do seu dispositivo' },
      { id: 'light', label: 'Claro', desc: 'Visual limpo com cores claras' },
      { id: 'dark', label: 'Escuro', desc: 'Ideal para ambientes com pouca luz' }
    ]

    const modal = new Modal({
      title: 'Tema do aplicativo',
      content: `
        <div class="flex flex-col gap-sm">
          ${options.map(opt => `
            <div class="settings-item theme-opt ${opt.id === current ? 'active-opt' : ''}" data-id="${opt.id}" style="border-radius: var(--radius-md); border: 1px solid var(--border-color)">
              <div style="flex:1">
                <div style="font-weight:700">${opt.label}</div>
                <div style="font-size:12px; color:var(--text-secondary)">${opt.desc}</div>
              </div>
              <div class="theme-check" style="${opt.id === current ? 'color:var(--clr-primary-light)' : 'display:none'}">${icon('check', 18)}</div>
            </div>
          `).join('')}
        </div>
      `
    })
    modal.open()
    refreshIcons()

    // Style for active option
    const style = document.createElement('style')
    style.id = 'theme-modal-styles'
    style.innerHTML = `
      .active-opt { border-color: var(--clr-primary-light) !important; background: var(--clr-primary-glow) !important; }
    `
    document.head.appendChild(style)

    document.querySelectorAll('.theme-opt').forEach(opt => {
      opt.addEventListener('click', () => {
        const themeId = opt.dataset.id
        ThemeService.setTheme(themeId)
        modal.close()
        this.render() // Re-render settings to update label
        document.getElementById('theme-modal-styles')?.remove()
      })
    })
  }

  _editProfile() {
    const u = this.user || {}
    const modal = new Modal({
      title: 'Editar perfil', content: `
      <div class="form-group"><label class="form-label">Nome</label><input id="prof-name" type="text" class="form-input" value="${u.name || ''}"></div>
      <div class="form-group"><label class="form-label">E-mail</label><input id="prof-email" type="email" class="form-input" value="${u.email || ''}"></div>
      <div class="flex gap-sm mt-md"><button class="btn btn-secondary flex-1" id="prof-cancel">Cancelar</button><button class="btn btn-primary flex-1" id="prof-save">Salvar</button></div>` })
    modal.open()
    document.getElementById('prof-cancel').addEventListener('click', () => modal.close())
    document.getElementById('prof-save').addEventListener('click', async () => {
      const name = document.getElementById('prof-name').value.trim(), email = document.getElementById('prof-email').value.trim()
      if (!name || !email) { window.toast.error('Preencha todos os campos'); return }
      const btn = document.getElementById('prof-save'); setButtonLoading(btn, 'Salvando...')
      try { await AuthService.updateProfile({ name, email }); this.user = AuthService.getUser(); modal.close(); this.container.innerHTML = this._template(); this._bindEvents(); refreshIcons(); window.toast.success('Perfil atualizado!') }
      catch (err) { window.toast.error(err.message); resetButton(btn, 'Salvar') }
    })
  }

  _editWhatsapp() {
    const saved = this.user?.whatsappPhone || ''
    const rawDigits = (saved.startsWith('+55') ? saved.slice(3) : saved).replace(/\D/g, '')
    const formatPhone = d => {
      if (d.length === 0) return ''
      if (d.length <= 2) return `(${d}`
      if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`
      if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`
      return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7, 11)}`
    }
    const localNumber = formatPhone(rawDigits)

    const modal = new Modal({
      title: 'Número WhatsApp', content: `
      <p style="color:var(--text-secondary);margin-bottom:var(--space-md);font-size:14px">Vincule seu número para receber desafios e lembretes via WhatsApp</p>
      <div class="form-group">
        <label class="form-label">Número (com DDD)</label>
        <div style="display:flex;align-items:center;gap:8px">
          <div style="background:var(--bg-secondary);border:1px solid var(--border-color);border-radius:var(--radius-md);padding:0 14px;height:44px;display:flex;align-items:center;font-weight:600;color:var(--text-primary);white-space:nowrap;flex-shrink:0">🇧🇷 +55</div>
          <input id="wa-phone" type="tel" class="form-input" placeholder="11 99999-9999" value="${localNumber}" style="flex:1" maxlength="15">
        </div>
        <span class="form-hint">Ex.: 11 99999-9999</span>
      </div>
      <div class="flex gap-sm mt-md"><button class="btn btn-secondary flex-1" id="wa-cancel">Cancelar</button><button class="btn btn-primary flex-1" id="wa-save">Salvar</button></div>` })
    modal.open()
    const phoneInput = document.getElementById('wa-phone')
    phoneInput.addEventListener('input', () => {
      const digits = phoneInput.value.replace(/\D/g, '').slice(0, 11)
      phoneInput.value = formatPhone(digits)
    })
    document.getElementById('wa-cancel').addEventListener('click', () => modal.close())
    document.getElementById('wa-save').addEventListener('click', async () => {
      const digits = document.getElementById('wa-phone').value.replace(/\D/g, '')
      if (!digits) { window.toast.error('Digite o número'); return }
      if (digits.length < 10 || digits.length > 11) { window.toast.error('Número inválido. Use o DDD + número'); return }
      const phone = '+55' + digits
      try { await AuthService.updateProfile({ whatsappPhone: phone }); this.user = AuthService.getUser(); modal.close(); this.container.innerHTML = this._template(); this._bindEvents(); refreshIcons(); window.toast.success('Número vinculado!') }
      catch (err) { window.toast.error(err.message) }
    })
  }

  _editNumber(field, title, unit) {
    const current = this.settings[field] || (field === 'dailyGoal' ? 20 : 10)
    const modal = new Modal({
      title, content: `
      <div class="form-group"><label class="form-label">Quantidade (${unit})</label>
        <input id="num-input" type="number" class="form-input" value="${current}" min="1" max="${field === 'dailyGoal' ? 200 : 50}"></div>
      <div class="flex gap-sm mt-md"><button class="btn btn-secondary flex-1" id="num-cancel">Cancelar</button><button class="btn btn-primary flex-1" id="num-save">Salvar</button></div>` })
    modal.open()
    document.getElementById('num-cancel').addEventListener('click', () => modal.close())
    document.getElementById('num-save').addEventListener('click', async () => {
      const val = parseInt(document.getElementById('num-input').value)
      if (!val || val < 1) { window.toast.error('Valor inválido'); return }
      try { await Api.patch('/users/settings', { [field]: val }); this.settings[field] = val; modal.close(); this.container.innerHTML = this._template(); this._bindEvents(); refreshIcons(); window.toast.success('Configuração salva!') }
      catch (err) { window.toast.error(err.message) }
    })
  }

  async _configWhatsapp() {
    const savedTime = this.settings.whatsappPreferredTime || '08:00'
    let selectedHour = parseInt(savedTime.split(':')[0])
    let selectedDeckId = this.settings.whatsappDeckId || null
    const hours = Array.from({ length: 17 }, (_, i) => i + 6)

    let decks = []
    try { decks = await Api.get('/decks') } catch { decks = [] }

    const chipStyle = (h) => h === selectedHour
      ? 'background:var(--clr-primary);color:#fff;border-color:var(--clr-primary)'
      : 'background:var(--bg-secondary);color:var(--text-primary);border-color:var(--border-color)'

    const deckOptions = [
      `<option value="">Qualquer deck (aleatório)</option>`,
      ...decks.map(d => `<option value="${d.id}" ${d.id == selectedDeckId ? 'selected' : ''}>${d.icon ? d.icon + ' ' : ''}${d.name}</option>`)
    ].join('')

    const modal = new Modal({
      title: 'Desafios WhatsApp', content: `
      <div style="background:rgba(16,185,129,0.08);border:1px solid rgba(16,185,129,0.25);border-radius:var(--radius-md);padding:var(--space-md);margin-bottom:var(--space-md)">
        <div style="display:flex;gap:10px;align-items:flex-start">
          <div style="flex-shrink:0;color:rgba(16,185,129,0.9)">${icon('lightbulb', 20)}</div>
          <p style="color:var(--text-secondary);font-size:13px;line-height:1.65;margin:0">
            O sistema enviaria uma pergunta no horário escolhido via WhatsApp. Cada resposta atualizaria a dificuldade do card automaticamente.
          </p>
        </div>
      </div>

      <div class="form-group">
        <label class="form-label">Deck para os desafios</label>
        <select id="wa-deck-select" class="form-input">${deckOptions}</select>
        <span class="form-hint">Cards serão sorteados do deck selecionado</span>
      </div>

      <div class="form-group">
        <label class="form-label">Horário preferido para receber</label>
        <div id="time-grid" style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px">
          ${hours.map(h => `
            <button type="button" data-hour="${h}" style="padding:10px 0;border-radius:var(--radius-md);border:1px solid;font-size:14px;font-weight:600;cursor:pointer;transition:all 0.15s;${chipStyle(h)}">
              ${String(h).padStart(2, '0')}h
            </button>`).join('')}
        </div>
      </div>

      <div class="flex gap-sm mt-md">
        <button class="btn btn-secondary flex-1" id="wa-cfg-cancel">Cancelar</button>
        <button class="btn btn-primary flex-1" id="wa-cfg-save">Salvar</button>
      </div>` })

    modal.open()
    refreshIcons()

    document.querySelectorAll('#time-grid [data-hour]').forEach(chip => {
      chip.addEventListener('click', () => {
        selectedHour = parseInt(chip.dataset.hour)
        document.querySelectorAll('#time-grid [data-hour]').forEach(c => {
          c.style.cssText += ';background:var(--bg-secondary);color:var(--text-primary);border-color:var(--border-color)'
        })
        chip.style.cssText += ';background:var(--clr-primary);color:#fff;border-color:var(--clr-primary)'
      })
    })

    document.getElementById('wa-cfg-cancel').addEventListener('click', () => modal.close())

    document.getElementById('wa-cfg-save').addEventListener('click', async () => {
      const time = String(selectedHour).padStart(2, '0') + ':00'
      const deckId = document.getElementById('wa-deck-select').value || null
      try {
        await Api.patch('/users/settings', {
          whatsappPreferredTime: time,
          whatsappDeckId: deckId ? parseInt(deckId) : null
        })
        this.settings.whatsappPreferredTime = time
        this.settings.whatsappDeckId = deckId ? parseInt(deckId) : null

        const selectedDeck = decks.find(d => d.id == deckId)
        const deckLabel = selectedDeck ? ` · ${selectedDeck.name}` : ''
        const sub = this.container.querySelector('#whatsapp-cfg-sub')
        if (sub) sub.textContent = `Envio às ${String(selectedHour).padStart(2, '0')}h${deckLabel}`

        modal.close()
        window.toast.success('Configuração salva!')
      } catch (err) {
        window.toast.error(err.message)
      }
    })
  }

  destroy() { }
}
