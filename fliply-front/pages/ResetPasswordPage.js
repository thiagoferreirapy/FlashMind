import { Api } from '../utils/api.js'
import { Toast } from '../components/Toast.js'
import { icon, refreshIcons } from '../utils/icons.js'

export class ResetPasswordPage {
  constructor(container, params) {
    this.container = container
    this.params = params
    this.token = new URLSearchParams(window.location.search).get('token')
    this.loading = false
    this.validating = true
    this.tokenValid = false
    this.userEmail = null
  }

  async render() {
    if (this.validating) {
      await this._validateToken()
    }
    this.container.innerHTML = this._template()
    this._bindEvents()
    refreshIcons()
  }

  async _validateToken() {
    if (!this.token) {
      this.tokenValid = false
      this.validating = false
      return
    }

    try {
      const response = await Api.post('/auth/validate-reset-token', { token: this.token })
      if (response.valid) {
        this.tokenValid = true
        this.userEmail = response.email
      } else {
        this.tokenValid = false
      }
    } catch (error) {
      this.tokenValid = false
      console.error('Erro ao validar token:', error)
    }

    this.validating = false
  }

  _template() {
    if (this.validating) {
      return this._loadingTemplate()
    }

    if (!this.tokenValid) {
      return this._errorTemplate()
    }

    return this._formTemplate()
  }

  _loadingTemplate() {
    return `
      <div style="min-height: 100vh; display: flex; flex-direction: column; justify-content: center; align-items: center;">
        <div style="text-align: center;">
          <div style="width: 40px; height: 40px; border: 4px solid var(--border-color); border-top-color: #7C3AED; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto var(--space-md);"></div>
          <p style="color: var(--text-secondary);">Validando link...</p>
        </div>
      </div>
    `
  }

  _errorTemplate() {
    return `
      <div class="animate-fade" style="min-height: 100vh; display: flex; flex-direction: column; justify-content: center; align-items: center; padding: var(--space-md);">
        <div style="width: 100%; max-width: 400px;">

          <div class="card" style="padding: var(--space-lg); background: linear-gradient(135deg, rgba(239,68,68,0.1) 0%, rgba(239,68,68,0.05) 100%); border-left: 4px solid #EF4444; text-align: center;">
            <div style="font-size: 56px; margin-bottom: var(--space-md);">❌</div>
            <h2 style="margin: 0 0 8px; color: #DC2626;">Link Inválido</h2>
            <p style="margin: 0 0 var(--space-md); color: var(--text-secondary); font-size: 14px;">
              ${!this.token ? 'Nenhum link de recuperação foi fornecido.' : 'Este link expirou ou é inválido.'}
            </p>

            <button id="new-request-btn" style="width: 100%; padding: 12px; background: linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%); color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; margin-bottom: var(--space-sm);">
              Solicitar Novo Link
            </button>

            <button id="back-to-login-btn" style="width: 100%; padding: 12px; background: var(--surface); border: 2px solid var(--border-color); border-radius: 8px; font-weight: 600; cursor: pointer;">
              Voltar ao Login
            </button>
          </div>

        </div>
      </div>
    `
  }

  _formTemplate() {
    return `
      <div class="animate-fade" style="min-height: 100vh; display: flex; flex-direction: column; justify-content: center; align-items: center; padding: var(--space-md);">
        <div style="width: 100%; max-width: 400px;">

          <!-- Header -->
          <div style="text-align: center; margin-bottom: var(--space-lg);">
            <div style="font-size: 64px; margin-bottom: var(--space-md);">🔐</div>
            <h1 style="margin: 0 0 8px; font-size: 24px;">Nova Senha</h1>
            <p style="margin: 0; color: var(--text-secondary); font-size: 14px;">Escolha uma senha forte e segura</p>
          </div>

          <div class="card" style="padding: var(--space-lg);">

            <!-- Email Display -->
            <div style="background: var(--surface); padding: var(--space-md); border-radius: 8px; margin-bottom: var(--space-md);">
              <p style="margin: 0; font-size: 12px; color: var(--text-muted); text-transform: uppercase;">Sua conta</p>
              <p style="margin: 8px 0 0; font-weight: 600; word-break: break-all;">${this.userEmail}</p>
            </div>

            <!-- Nova Senha -->
            <div style="margin-bottom: var(--space-md);">
              <label style="display: block; font-weight: 600; margin-bottom: 8px;">Nova Senha</label>
              <div style="position: relative;">
                <input
                  type="password"
                  id="password-input"
                  placeholder="Mínimo 6 caracteres"
                  style="width: 100%; padding: 12px 16px; border: 2px solid var(--border-color); border-radius: 8px; font-size: 16px; background: var(--surface); box-sizing: border-box; padding-right: 40px;"
                />
                <button id="toggle-password" style="position: absolute; right: 12px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; color: var(--text-secondary);">
                  ${icon('eye', 18)}
                </button>
              </div>
            </div>

            <!-- Confirmar Senha -->
            <div style="margin-bottom: var(--space-md);">
              <label style="display: block; font-weight: 600; margin-bottom: 8px;">Confirmar Senha</label>
              <div style="position: relative;">
                <input
                  type="password"
                  id="confirm-input"
                  placeholder="Confirme sua senha"
                  style="width: 100%; padding: 12px 16px; border: 2px solid var(--border-color); border-radius: 8px; font-size: 16px; background: var(--surface); box-sizing: border-box; padding-right: 40px;"
                />
                <button id="toggle-confirm" style="position: absolute; right: 12px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; color: var(--text-secondary);">
                  ${icon('eye', 18)}
                </button>
              </div>
            </div>

            <!-- Validação -->
            <div id="validation" style="font-size: 12px; margin-bottom: var(--space-md);">
              <div id="length-check" style="color: var(--text-muted); margin-bottom: 4px;">
                ${icon('x', 12)} Mínimo 6 caracteres
              </div>
              <div id="match-check" style="color: var(--text-muted);">
                ${icon('x', 12)} Senhas conferem
              </div>
            </div>

            <!-- Submit Button -->
            <button
              id="reset-btn"
              disabled
              style="width: 100%; padding: 12px; background: linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%); color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 16px; transition: all 0.3s; opacity: 0.5;"
            >
              Redefinir Senha
            </button>

            <button id="cancel-btn" style="width: 100%; padding: 12px; background: var(--surface); border: 2px solid var(--border-color); border-radius: 8px; font-weight: 600; cursor: pointer; margin-top: var(--space-sm);">
              Cancelar
            </button>
          </div>

        </div>
      </div>
    `
  }

  _bindEvents() {
    const newReqBtn = this.container.querySelector('#new-request-btn')
    const backBtn = this.container.querySelector('#back-to-login-btn')

    if (newReqBtn) {
      newReqBtn.addEventListener('click', () => {
        window.router.navigate('/forgot-password')
      })
    }

    if (backBtn) {
      backBtn.addEventListener('click', () => {
        window.router.navigate('/login')
      })
    }

    // Form events
    const passwordInput = this.container.querySelector('#password-input')
    const confirmInput = this.container.querySelector('#confirm-input')
    const resetBtn = this.container.querySelector('#reset-btn')
    const cancelBtn = this.container.querySelector('#cancel-btn')
    const togglePassword = this.container.querySelector('#toggle-password')
    const toggleConfirm = this.container.querySelector('#toggle-confirm')

    if (passwordInput) {
      passwordInput.addEventListener('input', () => this._updateValidation())
      confirmInput.addEventListener('input', () => this._updateValidation())
      togglePassword?.addEventListener('click', () => {
        const type = passwordInput.type === 'password' ? 'text' : 'password'
        passwordInput.type = type
      })
      toggleConfirm?.addEventListener('click', () => {
        const type = confirmInput.type === 'password' ? 'text' : 'password'
        confirmInput.type = type
      })
      resetBtn?.addEventListener('click', () => this._resetPassword())
      cancelBtn?.addEventListener('click', () => window.router.navigate('/login'))
    }
  }

  _updateValidation() {
    const passwordInput = this.container.querySelector('#password-input')
    const confirmInput = this.container.querySelector('#confirm-input')
    const resetBtn = this.container.querySelector('#reset-btn')

    const password = passwordInput?.value || ''
    const confirm = confirmInput?.value || ''

    const lengthValid = password.length >= 6
    const matchValid = password === confirm && password.length > 0

    const lengthCheck = this.container.querySelector('#length-check')
    const matchCheck = this.container.querySelector('#match-check')

    if (lengthCheck) {
      lengthCheck.innerHTML = (lengthValid ? icon('check', 12) : icon('x', 12)) + ' Mínimo 6 caracteres'
      lengthCheck.style.color = lengthValid ? '#10B981' : 'var(--text-muted)'
    }

    if (matchCheck) {
      matchCheck.innerHTML = (matchValid ? icon('check', 12) : icon('x', 12)) + ' Senhas conferem'
      matchCheck.style.color = matchValid ? '#10B981' : 'var(--text-muted)'
    }

    if (resetBtn) {
      const valid = lengthValid && matchValid
      resetBtn.disabled = !valid
      resetBtn.style.opacity = valid ? '1' : '0.5'
      resetBtn.style.cursor = valid ? 'pointer' : 'not-allowed'
    }
  }

  async _resetPassword() {
    const passwordInput = this.container.querySelector('#password-input')
    const confirmInput = this.container.querySelector('#confirm-input')
    const resetBtn = this.container.querySelector('#reset-btn')

    const password = passwordInput?.value
    const confirm = confirmInput?.value

    if (password !== confirm) {
      Toast.error('Senhas não conferem')
      return
    }

    if (password.length < 6) {
      Toast.error('Senha deve ter pelo menos 6 caracteres')
      return
    }

    resetBtn.disabled = true
    resetBtn.innerHTML = `
      <div style="width: 16px; height: 16px; border: 2px solid white; border-top-color: transparent; border-radius: 50%; animation: spin 1s linear infinite; margin-right: 8px; display: inline-block;"></div>
      Redefinindo...
    `

    try {
      await Api.post('/auth/reset-password', {
        token: this.token,
        newPassword: password,
        confirmPassword: confirm
      })

      Toast.success('✅ Senha redefinida com sucesso!')

      setTimeout(() => {
        window.router.navigate('/login')
      }, 1500)
    } catch (error) {
      Toast.error(error.message || 'Erro ao redefinir senha')
      resetBtn.disabled = false
      resetBtn.innerHTML = 'Redefinir Senha'
    }
  }
}

const style = document.createElement('style')
style.textContent = `
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`
document.head.appendChild(style)
