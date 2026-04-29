import { AuthService } from '../utils/auth.js'
import { icon, refreshIcons } from '../utils/icons.js'
import { setButtonLoading, resetButton } from '../utils/btnLoader.js'

export class RegisterPage {
  constructor(container) { this.container = container }

  render() {
    this.container.innerHTML = `
      <div class="auth-page">
        <div class="auth-logo">
          <div class="auth-logo-text">FlashMind</div>
          <div class="auth-subtitle">Crie sua conta gratuita</div>
        </div>

        <div class="auth-form">
          <div class="form-group">
            <label class="form-label">Nome completo</label>
            <input id="reg-name" type="text" class="form-input" placeholder="Seu nome" autocomplete="name">
          </div>

          <div class="form-group">
            <label class="form-label">E-mail</label>
            <input id="reg-email" type="email" class="form-input" placeholder="seu@email.com" autocomplete="email">
          </div>

          <div class="form-group">
            <label class="form-label">Senha</label>
            <div class="input-with-icon">
              <input id="reg-password" type="password" class="form-input" placeholder="Mínimo 8 caracteres" autocomplete="new-password">
              <button class="password-toggle" data-target="reg-password" type="button">
                ${icon('eye', 20)}
              </button>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Confirmar senha</label>
            <div class="input-with-icon">
              <input id="reg-password2" type="password" class="form-input" placeholder="Repita a senha" autocomplete="new-password">
              <button class="password-toggle" data-target="reg-password2" type="button">
                ${icon('eye', 20)}
              </button>
            </div>
          </div>

          <button class="btn btn-primary btn-block btn-lg mt-md" id="btn-register">Criar conta</button>
        </div>

        <div class="auth-footer mt-lg">
          Já tem conta? <a href="#/login" style="color:var(--clr-primary-light);font-weight:700">Entrar</a>
        </div>
      </div>
    `
    this._bindEvents()
    refreshIcons()
  }

  _bindEvents() {
    document.getElementById('btn-register').addEventListener('click', () => this._register())
    
    this.container.querySelectorAll('.password-toggle').forEach(btn => {
      btn.addEventListener('click', () => {
        const input = document.getElementById(btn.dataset.target)
        const isPassword = input.type === 'password'
        input.type = isPassword ? 'text' : 'password'
        btn.innerHTML = icon(isPassword ? 'eye-off' : 'eye', 20)
        refreshIcons()
      })
    })
  }


  async _register() {
    const name  = document.getElementById('reg-name').value.trim()
    const email = document.getElementById('reg-email').value.trim()
    const pass  = document.getElementById('reg-password').value
    const pass2 = document.getElementById('reg-password2').value

    if (!name || !email || !pass) { window.toast.error('Preencha todos os campos'); return }
    if (pass.length < 8)          { window.toast.error('Senha deve ter pelo menos 8 caracteres'); return }
    if (pass !== pass2)           { window.toast.error('As senhas não conferem'); return }

    const btn = document.getElementById('btn-register')
    setButtonLoading(btn, 'Criando conta...')

    try {
      await AuthService.register(name, email, pass)
      window.toast.success('Conta criada! Bem-vindo ao FlashMind!')
      window.router.navigate('/home')
    } catch (err) {
      window.toast.error(err.message || 'Erro ao criar conta')
    } finally {
      resetButton(btn, 'Criar conta')
    }
  }

  destroy() {}
}
