import { AuthService } from '../utils/auth.js'
import { icon, refreshIcons } from '../utils/icons.js'
import { setButtonLoading, resetButton } from '../utils/btnLoader.js'

export class LoginPage {
  constructor(container) { this.container = container }

  async render() {
    const lastEmail = localStorage.getItem('flashmind_last_email') || ''

    this.container.innerHTML = `
      <div class="auth-page">
        <div class="auth-logo">
          <div class="auth-logo-text">FlashMind</div>
          <div class="auth-subtitle">Transforme seu estudo em superpoder</div>
        </div>

        <div class="auth-form">
          <div class="form-group">
            <label class="form-label">E-mail</label>
            <input id="auth-email" type="email" class="form-input" placeholder="seu@email.com" autocomplete="email" value="${lastEmail}">
          </div>

          <div class="form-group">
            <label class="form-label">Senha</label>
            <div class="input-with-icon">
              <input id="auth-password" type="password" class="form-input" placeholder="••••••••" autocomplete="current-password">
              <button class="password-toggle" id="toggle-password" type="button">
                ${icon('eye', 20)}
              </button>
            </div>
          </div>

          <div class="text-right mb-md">
            <button id="btn-forgot-password" type="button" style="background:none;border:none;padding:0;font-size:13px;color:var(--clr-primary-light);cursor:pointer">Esqueci minha senha</button>
          </div>

          <div class="flex gap-sm mb-md">
            <button class="btn btn-primary flex-1 btn-lg" id="btn-login">Entrar</button>
          </div>

        </div>

        <div class="auth-footer mt-lg">
          Não tem conta? <a href="#/register" style="color:var(--clr-primary-light);font-weight:700">Criar conta</a>
        </div>
      </div>
    `
    this._bindEvents()
    refreshIcons()
  }

  _bindEvents() {
    document.getElementById('btn-login').addEventListener('click', () => this._login())
    document.getElementById('auth-password').addEventListener('keypress', e => {
      if (e.key === 'Enter') this._login()
    })
    document.getElementById('btn-forgot-password').addEventListener('click', () => this._forgotPassword())

    const toggleBtn = document.getElementById('toggle-password')
    const passwordInput = document.getElementById('auth-password')
    toggleBtn.addEventListener('click', () => {
      const isPassword = passwordInput.type === 'password'
      passwordInput.type = isPassword ? 'text' : 'password'
      toggleBtn.innerHTML = icon(isPassword ? 'eye-off' : 'eye', 20)
      refreshIcons()
    })
  }

  async _login(isBio = false) {
    const email = document.getElementById('auth-email').value.trim()
    const password = document.getElementById('auth-password').value

    if (!email || !password) {
      if (!isBio) window.toast.error('Preencha todos os campos')
      return
    }

    const btn = document.getElementById('btn-login')
    setButtonLoading(btn, 'Entrando...')

    try {
      await AuthService.login(email, password)

      localStorage.setItem('flashmind_last_email', email)
      window.router.navigate('/home')
    } catch (err) {
      window.toast.error(err.message || 'Erro ao fazer login')
    } finally {
      resetButton(btn, 'Entrar')
    }
  }

  _forgotPassword() {
    this._openResetModal()
  }

  _openResetModal() {
    const existing = document.getElementById('reset-modal-overlay')
    if (existing) existing.remove()

    const overlay = document.createElement('div')
    overlay.id = 'reset-modal-overlay'
    overlay.style.cssText = `
      position: fixed; inset: 0; background: var(--bg-overlay);
      display: flex; align-items: flex-end; justify-content: center;
      z-index: 9999; animation: fadeIn 0.2s ease;
    `

    overlay.innerHTML = `
      <div id="reset-modal" style="
        background: var(--bg-card);
        width: 100%; max-width: 480px;
        border-radius: 20px 20px 0 0;
        padding: 28px 24px 40px;
        animation: slideUp 0.3s ease;
      ">
        <div style="width: 40px; height: 4px; background: var(--text-muted); border-radius: 2px; margin: 0 auto 24px;"></div>

        <h2 style="margin: 0 0 6px; font-size: 20px;">Recuperar senha</h2>
        <p id="reset-subtitle" style="margin: 0 0 24px; font-size: 14px; color: var(--text-secondary);">Digite seu e-mail cadastrado</p>

        <!-- Step 1: email -->
        <div id="reset-step-1">
          <div class="form-group">
            <label class="form-label">E-mail</label>
            <input id="reset-email" type="email" class="form-input" placeholder="seu@email.com" autocomplete="email">
          </div>
          <button id="reset-next-btn" class="btn btn-primary btn-block btn-lg" style="margin-top: 8px;">Continuar</button>
        </div>

        <!-- Step 2: nova senha -->
        <div id="reset-step-2" style="display:none;">
          <div class="form-group">
            <label class="form-label">Nova senha</label>
            <div class="input-with-icon">
              <input id="reset-new-password" type="password" class="form-input" placeholder="Mínimo 8 caracteres">
              <button class="password-toggle" id="toggle-new-pass" type="button">${icon('eye', 20)}</button>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Confirmar senha</label>
            <div class="input-with-icon">
              <input id="reset-confirm-password" type="password" class="form-input" placeholder="Repita a senha">
              <button class="password-toggle" id="toggle-confirm-pass" type="button">${icon('eye', 20)}</button>
            </div>
          </div>
          <button id="reset-submit-btn" class="btn btn-primary btn-block btn-lg" style="margin-top: 8px;">Redefinir senha</button>
        </div>

        <button id="reset-cancel-btn" style="
          display: block; width: 100%; margin-top: 16px;
          background: none; border: none; color: var(--text-secondary);
          font-size: 14px; cursor: pointer; padding: 8px;
        ">Cancelar</button>
      </div>
    `

    document.body.appendChild(overlay)
    refreshIcons()

    let emailCapturado = ''

    const close = () => overlay.remove()
    overlay.addEventListener('click', e => { if (e.target === overlay) close() })
    document.getElementById('reset-cancel-btn').addEventListener('click', close)

    // Toggle visibilidade das senhas
    document.getElementById('toggle-new-pass').addEventListener('click', () => {
      const inp = document.getElementById('reset-new-password')
      inp.type = inp.type === 'password' ? 'text' : 'password'
      document.getElementById('toggle-new-pass').innerHTML = icon(inp.type === 'password' ? 'eye' : 'eye-off', 20)
      refreshIcons()
    })
    document.getElementById('toggle-confirm-pass').addEventListener('click', () => {
      const inp = document.getElementById('reset-confirm-password')
      inp.type = inp.type === 'password' ? 'text' : 'password'
      document.getElementById('toggle-confirm-pass').innerHTML = icon(inp.type === 'password' ? 'eye' : 'eye-off', 20)
      refreshIcons()
    })

    // Step 1 → Step 2
    const nextBtn = document.getElementById('reset-next-btn')
    const emailInput = document.getElementById('reset-email')
    emailInput.focus()

    const goToStep2 = () => {
      const email = emailInput.value.trim()
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        window.toast?.error('Digite um e-mail válido')
        emailInput.focus()
        return
      }
      emailCapturado = email
      document.getElementById('reset-step-1').style.display = 'none'
      document.getElementById('reset-step-2').style.display = 'block'
      document.getElementById('reset-subtitle').textContent = 'Crie sua nova senha'
      document.getElementById('reset-new-password').focus()
    }

    nextBtn.addEventListener('click', goToStep2)
    emailInput.addEventListener('keypress', e => { if (e.key === 'Enter') goToStep2() })

    // Step 2 → submit
    const submitBtn = document.getElementById('reset-submit-btn')
    const doReset = async () => {
      const newPassword = document.getElementById('reset-new-password').value
      const confirmPassword = document.getElementById('reset-confirm-password').value

      if (!newPassword || newPassword.length < 8) {
        window.toast?.error('Senha deve ter pelo menos 8 caracteres')
        return
      }
      if (newPassword !== confirmPassword) {
        window.toast?.error('As senhas não conferem')
        return
      }

      setButtonLoading(submitBtn, 'Salvando...')

      try {
        const { Api } = await import('../utils/api.js')
        await Api.post('/auth/reset-password-direct', {
          email: emailCapturado,
          newPassword,
          confirmPassword
        })
        window.toast?.success('Senha redefinida com sucesso!')
        close()
      } catch (err) {
        window.toast?.error(err.message || 'Erro ao redefinir senha')
        resetButton(submitBtn, 'Redefinir senha')
      }
    }

    submitBtn.addEventListener('click', doReset)
    document.getElementById('reset-confirm-password').addEventListener('keypress', e => {
      if (e.key === 'Enter') doReset()
    })
  }

  destroy() { }
}


