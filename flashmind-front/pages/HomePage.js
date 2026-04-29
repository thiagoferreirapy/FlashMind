import { AuthService } from '../utils/auth.js'
import { Deck } from '../models/Deck.js'
import { Api } from '../utils/api.js'
import { initials, renderDeckIcon } from '../utils/helpers.js'
import { icon, refreshIcons } from '../utils/icons.js'

export class HomePage {
  constructor(container) {
    this.container = container
    this.decks = []
    this.stats = {}
  }

  async render() {
    this.container.innerHTML = this._skeleton()

    try {
      const [decks, stats] = await Promise.all([
        Deck.fetchAll(),
        Api.get('/dashboard/summary')
      ])
      this.decks = decks
      this.stats = stats
      this.container.innerHTML = this._template()
      this._bindEvents()
    } catch {
      this.container.innerHTML = this._template()
      this._bindEvents()
    }
    refreshIcons()
  }

  _template() {
    const user = AuthService.getUser()
    const hour = new Date().getHours()
    const greeting = hour < 12 ? 'Bom dia' : hour < 18 ? 'Boa tarde' : 'Boa noite'
    const streak = this.stats.streak ?? 0
    const studied = this.stats.studiedToday ?? 0
    const rightToday = this.stats.rightToday ?? 0
    const wrongToday = this.stats.wrongToday ?? 0
    const goal = this.stats.dailyGoal ?? 20
    const progress = Math.min(100, goal > 0 ? Math.round((studied / goal) * 100) : 0)
    const motivationalMsg = studied >= goal
      ? 'Meta atingida!'
      : studied === 0
        ? 'Que tal começar agora?'
        : wrongToday > 0 && wrongToday > rightToday
          ? 'Não desanime, revisar os erros é estudar!'
          : 'Continue assim!'

    return `
      <div class="animate-fade">
        <div class="page-header">
          <div style="flex:1">
            <div style="font-size:11px;color:var(--text-muted);font-weight:600;text-transform:uppercase;letter-spacing:0.08em">FlashMind</div>
            <div style="font-size:17px;font-weight:700">${greeting}, ${user?.name?.split(' ')[0] || 'Estudante'} !</div>
          </div>
          <div class="avatar avatar-sm" id="home-avatar" style="cursor:pointer">${initials(user?.name)}</div>
        </div>

        <div style="padding:var(--space-md)">
          ${streak > 0 ? `
          <div class="streak-banner mb-md">
            <div class="streak-icon">${icon('flame', 32)}</div>
            <div>
              <div class="streak-count">${streak} dias</div>
              <div class="streak-label">de sequência de estudos</div>
            </div>
          </div>
          ` : ''}

          <!-- Progresso hoje -->
          <div class="card mb-md" style="padding:var(--space-md)">
            <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:var(--text-muted);margin-bottom:var(--space-sm)">Progresso Hoje</div>
            <div style="font-size:17px;font-weight:700;margin-bottom:var(--space-md)">${motivationalMsg}</div>
            <div class="flex gap-md mb-md">
              <div>
                <div style="font-size:26px;font-weight:800;line-height:1">${studied}</div>
                <div style="font-size:12px;color:var(--text-secondary);margin-top:2px">Estudados</div>
              </div>
              <div>
                <div style="font-size:26px;font-weight:800;line-height:1">${rightToday}</div>
                <div style="font-size:12px;color:var(--text-secondary);margin-top:2px">Acertos</div>
              </div>
              <div>
                <div style="font-size:26px;font-weight:800;line-height:1">${wrongToday}</div>
                <div style="font-size:12px;color:var(--text-secondary);margin-top:2px">Erros</div>
              </div>
            </div>
            <div class="progress-bar-wrap">
              <div class="progress-bar-fill" style="width:${progress}%"></div>
            </div>
            <div style="font-size:12px;color:var(--text-secondary);margin-top:6px;text-align:right">${progress}% concluído hoje</div>
          </div>

          <!-- Stats rápidos -->
          <div class="stats-grid mb-md">
            <div class="stat-card">
              <div class="stat-icon">${icon('library', 22)}</div>
              <div class="stat-value">${this.decks.length}</div>
              <div class="stat-label">Decks</div>
            </div>
            <div class="stat-card">
              <div class="stat-icon">${icon('target', 22)}</div>
              <div class="stat-value">${this.stats.totalStudied ?? 0}</div>
              <div class="stat-label">Cards estudados</div>
            </div>
            <div class="stat-card">
              <div class="stat-icon">${icon('check-circle', 22)}</div>
              <div class="stat-value">${this.stats.accuracy ?? 0}%</div>
              <div class="stat-label">Taxa de acerto</div>
            </div>
            <div class="stat-card">
              <div class="stat-icon">${icon('clock', 22)}</div>
              <div class="stat-value">${this.stats.dueCount ?? 0}</div>
              <div class="stat-label">Para revisar</div>
            </div>
          </div>

          <!-- Decks recentes -->
          <div class="section-header">
            <div class="section-title">Seus Decks</div>
            <div class="section-link" id="view-all-decks">Ver todos</div>
          </div>

          ${this.decks.length === 0 ? `
            <div class="empty-state" style="padding:var(--space-xl) 0">
              <div class="empty-state-icon">${icon('inbox', 56)}</div>
              <div class="empty-state-title">Nenhum deck ainda</div>
              <div class="empty-state-text">Crie seu primeiro deck e comece a estudar!</div>
              <button class="btn btn-primary" id="create-first-deck">+ Criar deck</button>
            </div>
          ` : this.decks.slice(0, 3).map(d => `
            <div class="deck-card" data-id="${d.id}" style="background:${d.color}14">
              <div class="deck-card-icon" style="background:${d.color}35">${renderDeckIcon(d.icon, 24)}</div>
              <div class="deck-card-info">
                <div class="deck-card-name">${d.name}</div>
                <div class="deck-card-meta">${d.card_count} cards${d.due_count > 0 ? ` · <span style="color:var(--clr-warning)">${d.due_count} para revisar</span>` : ''}</div>
              </div>
              <div class="deck-card-arrow">›</div>
            </div>
          `).join('')}

          ${this.decks.length > 0 ? `
          <div style="margin-top:var(--space-sm)">
            <button class="btn btn-secondary btn-block" id="study-now-btn">${icon('zap', 16)} Estudar agora</button>
          </div>
          ` : ''}
        </div>
      </div>
    `
  }

  _skeleton() {
    return `
      <div style="padding:var(--space-md)">
        ${[1, 2, 3].map(() => `
          <div style="height:64px;background:var(--bg-card);border-radius:var(--radius-lg);margin-bottom:var(--space-sm);animation:pulse 1.5s infinite"></div>
        `).join('')}
      </div>
    `
  }

  _bindEvents() {
    this.container.querySelector('#view-all-decks')?.addEventListener('click', () => window.router.navigate('/decks'))
    this.container.querySelector('#create-first-deck')?.addEventListener('click', () => window.router.navigate('/decks'))
    this.container.querySelector('#study-now-btn')?.addEventListener('click', () => {
      if (this.decks.length > 0) window.router.navigate(`/study/${this.decks[0].id}`)
    })
    this.container.querySelector('#home-avatar')?.addEventListener('click', () => window.router.navigate('/settings'))
    this.container.querySelectorAll('.deck-card').forEach(card => {
      card.addEventListener('click', () => window.router.navigate(`/deck/${card.dataset.id}`))
    })
  }

  skeleton() {
    return `
      <div class="animate-fade">
        <div class="page-header" style="border:none">
          <div style="flex:1">
            <div class="skeleton" style="width:100px;height:12px;margin-bottom:8px"></div>
            <div class="skeleton" style="width:180px;height:24px"></div>
          </div>
          <div class="skeleton" style="width:36px;height:36px;border-radius:50%"></div>
        </div>

        <div style="padding:var(--space-md)">
          <div class="skeleton" style="width:100%;height:140px;border-radius:var(--radius-xl);margin-bottom:var(--space-lg)"></div>
          
          <div class="flex items-center justify-between mb-md">
            <div class="skeleton" style="width:120px;height:20px"></div>
            <div class="skeleton" style="width:60px;height:16px"></div>
          </div>

          ${[1, 2, 3].map(() => `
            <div class="skeleton" style="width:100%;height:80px;border-radius:var(--radius-lg);margin-bottom:var(--space-sm)"></div>
          `).join('')}
        </div>
      </div>
    `
  }

  destroy() { }
}

