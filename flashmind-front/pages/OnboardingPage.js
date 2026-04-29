import { icon, refreshIcons } from '../utils/icons.js'

const SLIDES = [
  { icon: 'book-open',   title: 'Bem-vindo ao FlashMind',       text: 'A plataforma de flashcards inteligentes que vai transformar seu aprendizado' },
  { icon: 'brain',       title: 'Revisão Inteligente',       text: 'O FlashMind aprende com você e mostra os cards certos na hora certa, sem desperdício de tempo' },
  { icon: 'bar-chart-3', title: 'Acompanhe sua Evolução',    text: 'Dashboard completo com estatísticas, ranking de dificuldade e insights do seu desempenho' },
  { icon: 'smartphone',  title: 'Estude em Qualquer Lugar',  text: 'Receba desafios pelo WhatsApp e lembretes inteligentes para nunca parar de evoluir' },
]

export class OnboardingPage {
  constructor(container) { this.container = container; this.currentSlide = 0 }

  render() {
    this.container.innerHTML = `
      <div class="onboarding">
        <div class="onboarding-slides" id="ob-slides">
          ${SLIDES.map((s, i) => `
            <div class="onboarding-slide">
              <div class="onboarding-illustration">${icon(s.icon, 80)}</div>
              <h1 class="onboarding-title">${s.title}</h1>
              <p class="onboarding-text">${s.text}</p>
            </div>
          `).join('')}
        </div>
        <div class="onboarding-footer">
          <div class="onboarding-dots" id="ob-dots">
            ${SLIDES.map((_, i) => `<div class="onboarding-dot ${i === 0 ? 'active' : ''}"></div>`).join('')}
          </div>
          <button class="btn btn-primary btn-block btn-lg" id="ob-next">Próximo</button>
          <button class="btn btn-ghost btn-block" id="ob-skip">Pular</button>
        </div>
      </div>`
    this._bindEvents()
    refreshIcons()
  }

  _bindEvents() {
    document.getElementById('ob-next').addEventListener('click', () => {
      if (this.currentSlide < SLIDES.length - 1) this._goTo(this.currentSlide + 1)
      else this._finish()
    })
    document.getElementById('ob-skip').addEventListener('click', () => this._finish())
    let startX = 0
    const slides = document.getElementById('ob-slides')
    slides.addEventListener('touchstart', e => { startX = e.touches[0].clientX }, { passive: true })
    slides.addEventListener('touchend', e => {
      const dx = e.changedTouches[0].clientX - startX
      if (Math.abs(dx) > 50) {
        if (dx < 0 && this.currentSlide < SLIDES.length - 1) this._goTo(this.currentSlide + 1)
        else if (dx > 0 && this.currentSlide > 0) this._goTo(this.currentSlide - 1)
      }
    }, { passive: true })
  }

  _goTo(index) {
    this.currentSlide = index
    document.getElementById('ob-slides').scrollLeft = index * document.getElementById('ob-slides').offsetWidth
    document.querySelectorAll('.onboarding-dot').forEach((d, i) => d.classList.toggle('active', i === index))
    document.getElementById('ob-next').textContent = index === SLIDES.length - 1 ? 'Começar' : 'Próximo'
  }

  _finish() { localStorage.setItem('flashmind_visited', '1'); window.router.navigate('/login') }
  destroy() {}
}
