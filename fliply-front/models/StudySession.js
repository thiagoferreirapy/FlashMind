import { Api } from '../utils/api.js'

export class StudySession {
  constructor(data) {
    this.id           = data.id
    this.deck_id      = data.deckId
    this.total_cards  = data.totalCards ?? 0
    this.right_count  = data.rightCount ?? 0
    this.wrong_count  = data.wrongCount ?? 0
    this.unsure_count = data.unsureCount ?? 0
    this.started_at   = data.startedAt
    this.finished_at  = data.finishedAt
  }

  static async start(deckId) {
    const data = await Api.post('/sessions', { deckId })
    return new StudySession(data)
  }

  async finish(stats) {
    const data = await Api.put(`/sessions/${this.id}/finish`, stats)
    return new StudySession(data)
  }

  static async fetchRecent(limit = 10) {
    const data = await Api.get(`/sessions?limit=${limit}`)
    return data.map(d => new StudySession(d))
  }
}
