import { icon } from '../utils/icons.js'

export class FlipCard {
  constructor(container, { front, back, onFlip }) {
    this.container = container
    this.front     = front
    this.back      = back
    this.onFlip    = onFlip
    this.flipped   = false
  }

  render() {
    this.container.innerHTML = `
      <div class="flip-card-container" id="flip-card">
        <div class="flip-card-inner" id="flip-card-inner">
          <div class="flip-card-face flip-card-front">
            <div class="flip-card-label">Pergunta</div>
            <div class="flip-card-text">${this.front}</div>
            <div class="flip-card-hint">${icon('pointer', 14)} Toque para revelar</div>
          </div>
          <div class="flip-card-face flip-card-back">
            <div class="flip-card-label">Resposta</div>
            <div class="flip-card-text">${this.back}</div>
          </div>
        </div>
      </div>
    `

    document.getElementById('flip-card').addEventListener('click', () => this.flip())
  }

  flip() {
    this.flipped = !this.flipped
    const inner = document.getElementById('flip-card-inner')
    inner.classList.toggle('flipped', this.flipped)
    if (this.onFlip) this.onFlip(this.flipped)
  }

  reset() {
    this.flipped = false
    const inner = document.getElementById('flip-card-inner')
    if (inner) inner.classList.remove('flipped')
  }
}
