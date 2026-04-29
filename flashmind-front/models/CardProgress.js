import { Api } from '../utils/api.js'

export class CardProgress {
  constructor(data) {
    this.id               = data.id
    this.user_id          = data.userId
    this.card_id          = data.cardId
    this.right_count      = data.rightCount ?? 0
    this.wrong_count      = data.wrongCount ?? 0
    this.unsure_count     = data.unsureCount ?? 0
    this.streak           = data.streak ?? 0
    this.difficulty_score = data.difficultyScore ?? 1.0
    this.review_after     = data.reviewAfter
    this.last_review_at   = data.lastReviewAt
    this.total_reviews    = data.totalReviews ?? 0
    this.status           = data.status ?? 'new'
  }

  static async fetchByDeck(deckId) {
    const data = await Api.get(`/decks/${deckId}/progress`)
    return data.map(d => new CardProgress(d))
  }

  static async recordAnswer(sessionId, cardId, answerType) {
    return Api.post(`/sessions/${sessionId}/answers`, { cardId, answerType })
  }
}
