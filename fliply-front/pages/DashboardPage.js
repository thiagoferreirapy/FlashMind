import { Api } from '../utils/api.js'
import { pct, relativeTime } from '../utils/helpers.js'
import { icon, refreshIcons } from '../utils/icons.js'

export class DashboardPage {
  constructor(container) { this.container = container; this.data = null }

  async render() {
    // Não limpa o container aqui se o Router já colocou o skeleton
    try { 
      this.data = await Api.get('/dashboard') 
    } catch { 
      this.data = { totalStudied: 0, totalRight: 0, totalWrong: 0, totalSessions: 0, accuracy: 0, streak: 0, hardestCards: [], easiestCards: [], recentActivity: [] } 
    }
    this.container.innerHTML = this._template()
    this._bindEvents()
    refreshIcons()
  }

  _bindEvents() {
    this.container.querySelector('#start-study-btn')?.addEventListener('click', () => window.router.navigate('/decks'))
  }

  _template() {
    const d = this.data
    const accuracy = d.accuracy ?? (d.totalStudied > 0 ? pct(d.totalRight, d.totalStudied) : 0)
    return `
      <div class="animate-fade">
        <div class="page-header"><h1>Estatísticas</h1></div>
        <div style="padding:var(--space-md)">
          <div class="stats-grid mb-md">
            <div class="stat-card"><div class="stat-icon">${icon('book-open',22)}</div><div class="stat-value">${d.totalStudied ?? 0}</div><div class="stat-label">Cards estudados</div></div>
            <div class="stat-card"><div class="stat-icon">${icon('target',22)}</div><div class="stat-value">${accuracy}%</div><div class="stat-label">Taxa de acerto</div></div>
            <div class="stat-card"><div class="stat-icon">${icon('calendar',22)}</div><div class="stat-value">${d.totalSessions ?? 0}</div><div class="stat-label">Sessões</div></div>
            <div class="stat-card"><div class="stat-icon">${icon('flame',22)}</div><div class="stat-value">${d.streak ?? 0}</div><div class="stat-label">Sequência</div></div>
          </div>
          
          <div class="card mb-md">
            <div style="font-weight:700;margin-bottom:var(--space-md)">Desempenho Geral</div>
            ${this._renderDistBar(d.totalRight ?? 0, d.totalUnsure ?? 0, d.totalWrong ?? 0)}
          </div>

          ${(d.dueCards ?? []).length > 0 ? `
          <div class="section-header"><div class="section-title">${icon('clock',18)} Próximas Revisões</div></div>
          ${d.dueCards.map(c => `
            <div class="deck-card mb-sm">
              <div class="deck-card-icon" style="background:${c.overdue ? 'rgba(239,68,68,0.12)' : 'rgba(245,158,11,0.12)'}">${icon(c.overdue ? 'alert-circle' : 'clock', 20)}</div>
              <div style="flex:1">
                <div style="font-weight:600;font-size:14px">${c.frontText}</div>
                <div style="font-size:12px;color:var(--text-secondary);margin-top:2px">${c.deckName} · ${c.overdue ? '<span style="color:var(--clr-danger)">Atrasado</span>' : relativeTime(c.reviewAfter)}</div>
              </div>
              <div class="badge ${c.overdue ? 'badge-danger' : 'badge-warning'}">${c.overdue ? 'Atrasado' : 'Em breve'}</div>
            </div>`).join('')}` : ''}

          ${(d.hardestCards ?? []).length > 0 ? `
          <div class="section-header ${(d.dueCards ?? []).length > 0 ? 'mt-md' : ''}"><div class="section-title">${icon('alert-triangle',18)} Cards Críticos</div></div>
          ${d.hardestCards.slice(0,5).map(c => `
            <div class="deck-card mb-sm">
              <div class="deck-card-icon" style="background:rgba(239,68,68,0.12)">${icon('x-circle', 20)}</div>
              <div style="flex:1">
                <div style="font-weight:600;font-size:14px">${c.frontText}</div>
                <div style="font-size:12px;color:var(--text-secondary);margin-top:2px">${c.wrongCount ?? 0} erros · dificuldade ${(c.difficultyScore ?? 1).toFixed(1)}</div>
              </div>
              <div class="badge badge-danger">Difícil</div>
            </div>`).join('')}` : ''}

          ${(d.easiestCards ?? []).length > 0 ? `
          <div class="section-header mt-md"><div class="section-title">${icon('star',18)} Cards Dominados</div></div>
          ${d.easiestCards.slice(0,5).map(c => `
            <div class="deck-card mb-sm">
              <div class="deck-card-icon" style="background:rgba(16,185,129,0.12)">${icon('check-circle', 20)}</div>
              <div style="flex:1">
                <div style="font-weight:600;font-size:14px">${c.frontText}</div>
                <div style="font-size:12px;color:var(--text-secondary);margin-top:2px">${c.rightCount ?? 0} acertos · sequência de ${c.streak ?? 0}</div>
              </div>
              <div class="badge badge-success">Domina</div>
            </div>`).join('')}` : ''}

          ${(d.recentActivity ?? []).length > 0 ? `
          <div class="section-header mt-md"><div class="section-title">${icon('zap',18)} Atividade Recente</div></div>
          ${d.recentActivity.slice(0,5).map(s => `
            <div class="deck-card mb-sm">
              <div class="deck-card-icon" style="background:rgba(124,58,237,0.12)">${icon('zap', 20)}</div>
              <div style="flex:1"><div style="font-weight:600;font-size:14px">${s.deckName || 'Sessão'}</div>
                <div style="font-size:12px;color:var(--text-secondary)">${s.totalCards} cards · ${pct(s.rightCount, s.totalCards)}% acerto · ${relativeTime(s.startedAt)}</div></div>
            </div>`).join('')}` : ''}

          ${(!d.totalStudied || d.totalStudied === 0) ? `
            <div class="empty-state mt-lg">
              <div class="empty-state-icon">${icon('bar-chart-3',56)}</div>
              <div class="empty-state-title">Nenhum dado ainda</div>
              <div class="empty-state-text">Complete uma sessão de estudo para ver suas estatísticas aqui</div>
              <button class="btn btn-primary mt-md" id="start-study-btn">${icon('zap',16)} Começar a estudar</button>
            </div>` : ''}
        </div>
      </div>`
  }

  _renderDistBar(right, unsure, wrong) {
    const total = right + unsure + wrong
    if (!total) return '<div style="color:var(--text-muted);font-size:13px">Dados aparecerão após seus primeiros estudos</div>'
    const rPct = pct(right, total), uPct = pct(unsure, total), wPct = pct(wrong, total)
    return `
      <div style="height:12px;border-radius:var(--radius-full);overflow:hidden;display:flex;margin-bottom:var(--space-md);background:var(--bg-card-hover)">
        <div style="width:${rPct}%;background:var(--clr-success)"></div>
        <div style="width:${uPct}%;background:var(--clr-warning)"></div>
        <div style="width:${wPct}%;background:var(--clr-danger)"></div></div>
      <div class="flex flex-col gap-sm" style="font-size:13px">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-xs"><div style="width:8px;height:8px;border-radius:50%;background:var(--clr-success)"></div> Domina</div>
          <div style="font-weight:600">${rPct}%</div>
        </div>
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-xs"><div style="width:8px;height:8px;border-radius:50%;background:var(--clr-warning)"></div> Em progresso</div>
          <div style="font-weight:600">${uPct}%</div>
        </div>
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-xs"><div style="width:8px;height:8px;border-radius:50%;background:var(--clr-danger)"></div> Crítico</div>
          <div style="font-weight:600">${wPct}%</div>
        </div>
      </div>`
  }

  skeleton() {
    return `
      <div class="animate-fade">
        <div class="page-header"><div class="skeleton" style="width:140px;height:24px"></div></div>
        <div style="padding:var(--space-md)">
          <div class="stats-grid mb-md">
            ${[1,2,3,4].map(() => `<div class="skeleton" style="height:80px;border-radius:var(--radius-lg)"></div>`).join('')}
          </div>
          <div class="skeleton mb-md" style="width:100%;height:160px;border-radius:var(--radius-xl)"></div>
          <div class="skeleton mb-sm" style="width:120px;height:20px"></div>
          ${[1,2,3].map(() => `<div class="skeleton mb-sm" style="width:100%;height:72px;border-radius:var(--radius-lg)"></div>`).join('')}
        </div>
      </div>`
  }

  destroy() {}
}

