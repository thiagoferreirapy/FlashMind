import { Deck } from '../models/Deck.js'
import { Card } from '../models/Card.js'
import { CardProgress } from '../models/CardProgress.js'
import { StudySession } from '../models/StudySession.js'
import { FlipCard } from '../components/FlipCard.js'
import { isDue } from '../utils/spacedRepetition.js'
import { icon, refreshIcons } from '../utils/icons.js'

export class StudyPage {
  constructor(container, params) {
    this.container = container; this.deckId = params.deckId; this.deck = null
    this.cards = []; this.session = null; this.current = 0; this.revealed = false
    this.stats = { right: 0, wrong: 0, unsure: 0 }; this.flipCard = null
  }

  async render() {
    this.container.innerHTML = '<div class="flex items-center justify-center" style="height:100vh"><div class="spinner"></div></div>'
    try {
      const [deck, cards, progresses] = await Promise.all([Deck.fetchById(this.deckId), Card.fetchByDeck(this.deckId), CardProgress.fetchByDeck(this.deckId)])
      this.deck = deck
      const progressMap = {}; progresses.forEach(p => progressMap[p.card_id] = p)
      const settings = JSON.parse(localStorage.getItem('fliply_user') || '{}')
      const sessionSize = settings.session_size ?? 10, smartOrder = settings.smart_order !== false
      let queue = cards.filter(c => !progressMap[c.id] || isDue(progressMap[c.id].review_after))
      if (queue.length === 0) queue = cards
      if (smartOrder) { queue.sort((a, b) => (progressMap[b.id]?.difficulty_score ?? 1) - (progressMap[a.id]?.difficulty_score ?? 1)) }
      else { for (let i = queue.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [queue[i], queue[j]] = [queue[j], queue[i]] } }
      this.cards = queue.slice(0, sessionSize)
      this.session = await StudySession.start(this.deckId)
    } catch (err) {
      this.container.innerHTML = `<div class="empty-state"><div class="empty-state-title">Erro ao iniciar estudo</div><button class="btn btn-primary mt-md" id="back-btn">${icon('arrow-left',14)} Voltar</button></div>`
      refreshIcons(); this.container.querySelector('#back-btn')?.addEventListener('click', () => window.router.back()); return
    }
    if (this.cards.length === 0) { this._renderEmpty(); return }
    this._renderCard()
  }

  _renderCard() {
    const card = this.cards[this.current], pctVal = Math.round(((this.current) / this.cards.length) * 100)
    this.container.innerHTML = `
      <div class="study-page animate-fade">
        <div class="study-header">
          <button class="icon-btn" id="study-back">${icon('arrow-left',18)}</button>
          <div class="study-progress-text">${this.current + 1} / ${this.cards.length}</div>
          <button class="icon-btn" id="study-close">${icon('x',16)}</button></div>
        <div class="progress-bar-wrap mb-md"><div class="progress-bar-fill" style="width:${pctVal}%"></div></div>
        <div class="study-content">
          <div id="flip-wrap"></div>
          <div id="answer-section" style="display:none">
            <p style="text-align:center;font-size:13px;color:var(--text-secondary);margin-bottom:var(--space-sm)">Como você foi?</p>
            <div class="answer-buttons">
              <button class="answer-btn wrong" data-type="wrong"><span class="emoji">${icon('frown',26)}</span><span>Errei</span></button>
              <button class="answer-btn unsure" data-type="unsure"><span class="emoji">${icon('help-circle',26)}</span><span>Quase</span></button>
              <button class="answer-btn right" data-type="right"><span class="emoji">${icon('check-circle',26)}</span><span>Acertei</span></button>
            </div></div>
        </div>
      </div>`
    refreshIcons()
    this.flipCard = new FlipCard(this.container.querySelector('#flip-wrap'), {
      front: card.front_text, back: card.back_text,
      onFlip: (flipped) => { if (flipped) document.getElementById('answer-section').style.display = 'block' }
    })
    this.flipCard.render()
    this.container.querySelector('#study-back')?.addEventListener('click', () => { if (this.current > 0) { this.current--; this._renderCard() } else this._endSession() })
    this.container.querySelector('#study-close')?.addEventListener('click', () => this._endSession())
    this.container.querySelectorAll('.answer-btn').forEach(btn => { btn.addEventListener('click', () => this._answer(btn.dataset.type)) })
  }

  async _answer(type) {
    this.stats[type]++
    if (this.session) { try { await CardProgress.recordAnswer(this.session.id, this.cards[this.current].id, type) } catch {} }
    this.current++
    if (this.current >= this.cards.length) this._renderResult()
    else this._renderCard()
  }

  _renderResult() {
    const total = this.stats.right + this.stats.wrong + this.stats.unsure
    const acc = total ? Math.round((this.stats.right / total) * 100) : 0
    if (this.session) { this.session.finish({ totalCards: total, rightCount: this.stats.right, wrongCount: this.stats.wrong, unsureCount: this.stats.unsure }).catch(() => {}) }
    const resultIcon = acc >= 80 ? 'trophy' : acc >= 50 ? 'thumbs-up' : 'dumbbell'
    const msg = acc >= 80 ? 'Excelente!' : acc >= 50 ? 'Bom trabalho!' : 'Continue praticando!'
    this.container.innerHTML = `
      <div class="study-result animate-fade">
        <div class="result-emoji">${icon(resultIcon, 64)}</div>
        <h2 class="result-title">${msg}</h2>
        <p style="color:var(--text-secondary)">Sessão concluída com ${total} cards</p>
        <div class="result-stats">
          <div class="result-stat-item"><div class="result-stat-value" style="color:var(--clr-success)">${this.stats.right}</div><div class="result-stat-label">Acertos</div></div>
          <div class="result-stat-item"><div class="result-stat-value" style="color:var(--clr-warning)">${this.stats.unsure}</div><div class="result-stat-label">Quase</div></div>
          <div class="result-stat-item"><div class="result-stat-value" style="color:var(--clr-danger)">${this.stats.wrong}</div><div class="result-stat-label">Erros</div></div></div>
        <div style="width:100%;background:var(--bg-card);border-radius:var(--radius-md);padding:var(--space-md);text-align:center">
          <div style="font-size:32px;font-weight:900;color:var(--clr-primary-light)">${acc}%</div>
          <div style="font-size:13px;color:var(--text-secondary)">taxa de acerto</div></div>
        <div class="flex gap-sm w-full">
          <button class="btn btn-secondary flex-1" id="res-decks">Meus Decks</button>
          <button class="btn btn-primary flex-1" id="res-again">Estudar novamente</button></div>
      </div>`
    refreshIcons()
    this.container.querySelector('#res-decks')?.addEventListener('click', () => window.router.navigate('/decks'))
    this.container.querySelector('#res-again')?.addEventListener('click', () => { this.current = 0; this.stats = { right: 0, wrong: 0, unsure: 0 }; this.render() })
  }

  _renderEmpty() {
    this.container.innerHTML = `
      <div class="study-result">
        <div class="result-emoji">${icon('sparkles', 64)}</div>
        <h2 class="result-title">Tudo em dia!</h2>
        <p style="color:var(--text-secondary);text-align:center">Não há cards para revisar agora. Volte mais tarde!</p>
        <button class="btn btn-primary mt-md" id="back-btn">${icon('arrow-left',14)} Voltar aos Decks</button></div>`
    refreshIcons()
    this.container.querySelector('#back-btn')?.addEventListener('click', () => window.router.navigate('/decks'))
  }

  _endSession() { window.router.navigate(`/deck/${this.deckId}`) }
  destroy() {}
}
