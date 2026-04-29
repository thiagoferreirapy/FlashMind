import { Api } from '../utils/api.js'

export class Deck {
  constructor(data) {
    this.id          = data.id
    this.user_id     = data.userId
    this.name        = data.name
    this.description = data.description || ''
    this.icon        = data.icon || '📚'
    this.color       = data.color || '#7C3AED'
    this.is_public   = data.isPublic ?? false
    this.allow_clone = data.allowClone ?? true
    this.card_count  = data.cardCount ?? 0
    this.due_count   = data.dueCount ?? 0
    this.created_at  = data.createdAt
    this.updated_at  = data.updatedAt
  }

  static async fetchAll() {
    const data = await Api.get('/decks')
    return data.map(d => new Deck(d))
  }

  static async fetchById(id) {
    const data = await Api.get(`/decks/${id}`)
    return new Deck(data)
  }

  static async create(payload) {
    const data = await Api.post('/decks', payload)
    return new Deck(data)
  }

  async update(payload) {
    const data = await Api.put(`/decks/${this.id}`, payload)
    return new Deck(data)
  }

  async delete() {
    return Api.delete(`/decks/${this.id}`)
  }

  async share() {
    return Api.post(`/decks/${this.id}/share`, {})
  }

  async updateShareVisibility(isPublic) {
    return Api.patch(`/decks/${this.id}/share/visibility`, { isPublic })
  }
}
