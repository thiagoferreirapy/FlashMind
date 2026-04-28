import { Api } from '../utils/api.js'
import { Toast } from '../components/Toast.js'
import { icon, refreshIcons } from '../utils/icons.js'

export class ForgotPasswordPage {
  constructor(container) {
    this.container = container
    this.loading = false
    this.submitted = false
  }

  async render() {
    this.container.innerHTML = this._template()
    this._bindEvents()
    refreshIcons()
  }

  _template() {
    return `
      <div class="animate-fade" style="min-height: 100vh; display: flex; flex-direction: column; justify-content: center; align-items: center; padding: var(--space-md);">
        <div style="width: 100%; max-width: 400px;">

          <!-- Header -->
          <div style="text-align: center; margin-bottom: var(--space-lg);">
            <div style="font-size: 64px; margin-bottom: var(--space-md);">🔑</div>
            <h1 style="margin: 0 0 8px; font-size: 24px;">Recuperar Senha</h1>
            <p style="margin: 0; color: var(--text-secondary); font-size: 14px;">Digite seu email para receber um link de recuperação</p>
          </div>

          ${this.submitted ? this._successTemplate() : this._formTemplate()}

          <!-- Link para voltar -->
          <div style="text-align: center; margin-top: var(--space-lg);">
            <button id="back-to-login" style="background: none; border: none; color: var(--text-secondary); cursor: pointer; font-size: 14px; text-decoration: underline;">
              ← Voltar ao login
            </button>
          </div>

        </div>
      </div>
    `
  }

  _formTemplate() {
    return `
      <div class="card" style="padding: var(--space-lg);">

        <div style="margin-bottom: var(--space-md);">
          <label style="display: block; font-weight: 600; margin-bottom: 8px;">Email</label>
          <input
            type="email"
            id="email-input"
            placeholder="seu@email.com"
            style="width: 100%; padding: 12px 16px; border: 2px solid var(--border-color); border-radius: 8px; font-size: 16px; background: var(--surface); box-sizing: border-box;"
            autocomplete="email"
          />
        </div>

        <button
          id="send-btn"
          style="width: 100%; padding: 12px; background: linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%); color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 16px; transition: all 0.3s; display: flex; align-items: center; justify-content: center; gap: 8px;"
        >
          ${icon('send', 18)}
          <span>Enviar Link</span>
        </button>

        <p style="font-size: 12px; color: var(--text-muted); margin-top: var(--space-md); line-height: 1.5;">
          ${icon('info', 12)} Você receberá um email com um link para redefinir sua senha. O link expira em 1 hora.
        </p>
      </div>
    `
  }

  _successTemplate() {
    return `
      <div class="card" style="padding: var(--space-lg); background: linear-gradient(135deg, rgba(16,185,129,0.1) 0%, rgba(16,185,129,0.05) 100%); border-left: 4px solid #10B981;">

        <div style="text-align: center; margin-bottom: var(--space-lg);">
          <div style="font-size: 56px; margin-bottom: var(--space-md); animation: bounceIn 0.6s ease;">✅</div>
          <h2 style="margin: 0 0 8px; color: #10B981;">Email Enviado!</h2>
          <p style="margin: 0; color: var(--text-secondary); font-size: 14px;">Verifique sua caixa de entrada</p>
        </div>

        <div style="background: var(--surface); padding: var(--space-md); border-radius: 8px; margin-bottom: var(--space-md);">
          <p style="margin: 0 0 12px; font-weight: 600;">O que fazer agora:</p>
          <ol style="margin: 0; padding-left: 20px; font-size: 14px; color: var(--text-secondary);">
            <li style="margin-bottom: 8px;">Abra seu email</li>
            <li style="margin-bottom: 8px;">Clique no link "Redefinir Senha"</li>
            <li style="margin-bottom: 8px;">Escolha uma nova senha</li>
            <li>Faça login com sua nova senha</li>
          </ol>
        </div>

        <p style="font-size: 12px; color: var(--text-muted); text-align: center; margin: 0;">
          ${icon('clock', 12)} O link expira em 1 hora
        </p>

        <p style="font-size: 12px; color: var(--text-muted); text-align: center; margin-top: var(--space-md);">
          Não recebeu o email? Verifique a pasta de spam ou
          <button id="retry-btn" style="background: none; border: none; color: #7C3AED; cursor: pointer; text-decoration: underline; font-size: 12px;">tente novamente</button>
        </p>
      </div>
    `
  }

  _bindEvents() {
    const sendBtn = this.container.querySelector('#send-btn')
    const backBtn = this.container.querySelector('#back-to-login')
    const retryBtn = this.container.querySelector('#retry-btn')
    const emailInput = this.container.querySelector('#email-input')

    if (sendBtn) {
      sendBtn.addEventListener('click', () => this._sendEmail())
      emailInput?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') this._sendEmail()
      })
    }

    if (backBtn) {
      backBtn.addEventListener('click', () => {
        window.router.navigate('/login')
      })
    }

    if (retryBtn) {
      retryBtn.addEventListener('click', () => {
        this.submitted = false
        this.render()
      })
    }
  }

  async _sendEmail() {
    const emailInput = this.container.querySelector('#email-input')
    const email = emailInput.value.trim()

    if (!email) {
      Toast.error('Digite seu email')
      emailInput.focus()
      return
    }

    if (!this._isValidEmail(email)) {
      Toast.error('Email inválido')
      emailInput.focus()
      return
    }

    const sendBtn = this.container.querySelector('#send-btn')
    sendBtn.disabled = true
    sendBtn.innerHTML = `
      <div style="width: 16px; height: 16px; border: 2px solid white; border-top-color: transparent; border-radius: 50%; animation: spin 1s linear infinite;"></div>
      <span>Enviando...</span>
    `

    try {
      await Api.post('/auth/forgot-password', { email })
      this.submitted = true
      this.render()
      Toast.success('Email enviado!')
    } catch (error) {
      Toast.error(error.message || 'Erro ao enviar email')
      sendBtn.disabled = false
      sendBtn.innerHTML = `${icon('send', 18)}<span>Enviar Link</span>`
    }
  }

  _isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return regex.test(email)
  }
}

// CSS for animations
const style = document.createElement('style')
style.textContent = `
  @keyframes bounceIn {
    0% { transform: scale(0); opacity: 0; }
    50% { transform: scale(1.1); }
    100% { transform: scale(1); opacity: 1; }
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`
document.head.appendChild(style)
