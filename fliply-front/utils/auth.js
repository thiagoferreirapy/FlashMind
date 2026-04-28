import { Api } from './api.js'

const TOKEN_KEY = 'fliply_token'
const USER_KEY = 'fliply_user'

export const AuthService = {
  isAuthenticated() {
    return !!localStorage.getItem(TOKEN_KEY)
  },

  getToken() {
    return localStorage.getItem(TOKEN_KEY)
  },

  getUser() {
    const raw = localStorage.getItem(USER_KEY)
    return raw ? JSON.parse(raw) : null
  },

  setSession(token, user) {
    localStorage.setItem(TOKEN_KEY, token)
    localStorage.setItem(USER_KEY, JSON.stringify(user))
  },

  clearSession() {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
  },

  async login(email, password) {
    const data = await Api.post('/auth/login', { email, password })
    this.setSession(data.token, data.user)
    return data
  },

  async register(name, email, password) {
    const data = await Api.post('/auth/register', { name, email, password })
    this.setSession(data.token, data.user)
    return data
  },

  async forgotPassword(email) {
    return Api.post('/auth/forgot-password', { email })
  },

  async updateProfile(payload) {
    const data = await Api.put('/users/me', payload)
    const user = this.getUser()
    this.setSession(this.getToken(), { ...user, ...data })
    return data
  },

  logout() {
    this.clearSession()
    window.router.navigate('/login')
  }
}
