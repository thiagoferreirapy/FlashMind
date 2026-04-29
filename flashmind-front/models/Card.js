import { Api } from '../utils/api.js'

export class Card {
  constructor(data) {
    this.id         = data.id
    this.deck_id    = data.deckId
    this.front_text = data.frontText
    this.back_text  = data.backText
    this.position   = data.position ?? 0
    this.created_at = data.createdAt
    this.updated_at = data.updatedAt
  }

  static async fetchByDeck(deckId) {
    const data = await Api.get(`/decks/${deckId}/cards`)
    return data.map(d => new Card(d))
  }

  static async create(deckId, payload) {
    const data = await Api.post(`/decks/${deckId}/cards`, payload)
    return new Card(data)
  }

  async update(payload) {
    const data = await Api.put(`/cards/${this.id}`, payload)
    return new Card(data)
  }

  async delete() {
    return Api.delete(`/cards/${this.id}`)
  }
}
