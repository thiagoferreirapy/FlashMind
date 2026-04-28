import { AuthService } from '../utils/auth.js'
import { icon, refreshIcons } from '../utils/icons.js'
import { BiometricService } from '../utils/biometric.js'

export class LoginPage {
  constructor(container) { this.container = container }

  async render() {
    const lastEmail = localStorage.getItem('fliply_last_email') || ''
    const isBioEnabled = localStorage.getItem('fliply_biometric_enabled') === 'true'

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
            ${isBioEnabled ? `
            <button class="btn btn-secondary btn-lg" id="btn-biometric" title="Entrar com biometria" style="min-width:60px">
              ${icon('fingerprint', 24)}
            </button>
            ` : ''}
          </div>

          <div class="divider-text">ou</div>

          <button class="btn btn-secondary btn-block" id="btn-google">
            ${icon('chrome', 18)} Continuar com Google
          </button>
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
    document.getElementById('btn-biometric')?.addEventListener('click', () => this._loginBiometric())
    document.getElementById('auth-password').addEventListener('keypress', e => {
      if (e.key === 'Enter') this._login()
    })
    document.getElementById('btn-forgot-password').addEventListener('click', () => this._forgotPassword())
    document.getElementById('btn-google').addEventListener('click', () => {
      window.toast.info('Integração com Google em breve!')
    })

    const toggleBtn = document.getElementById('toggle-password')
    const passwordInput = document.getElementById('auth-password')
    toggleBtn.addEventListener('click', () => {
      const isPassword = passwordInput.type === 'password'
      passwordInput.type = isPassword ? 'text' : 'password'
      toggleBtn.innerHTML = icon(isPassword ? 'eye-off' : 'eye', 20)
      refreshIcons()
    })
  }

  async _loginBiometric() {
    try {
      const creds = await BiometricService.getCredentials()
      if (creds) {
        document.getElementById('auth-email').value = creds.email
        document.getElementById('auth-password').value = creds.password
        this._login(true)
      } else {
        // Biometria foi cancelada ou não retornou credenciais
        window.toast.info('Biometria não disponível ou cancelada. Use seu e-mail e senha.')
      }
    } catch (e) {
      console.error('Falha crítica na biometria:', e)
      window.toast.error('Erro ao acessar biometria. Por favor, entre com sua senha.')
      // Focar no campo de senha para o login normal
      document.getElementById('auth-password')?.focus()
    }
  }

  async _login(isBio = false) {
    const email = document.getElementById('auth-email').value.trim()
    const password = document.getElementById('auth-password').value

    if (!email || !password) {
      if (!isBio) window.toast.error('Preencha todos os campos')
      return
    }

    const btn = document.getElementById('btn-login')
    btn.disabled = true
    btn.textContent = 'Entrando...'

    try {
      await AuthService.login(email, password)

      // Salvar e-mail para a próxima vez
      localStorage.setItem('fliply_last_email', email)

      // Se logou com sucesso e a biometria ainda não está ativa, perguntar se quer ativar
      const isBioAvailable = await BiometricService.isAvailable()
      const isBioEnabled = localStorage.getItem('fliply_biometric_enabled') === 'true'

      if (isBioAvailable && !isBioEnabled) {
        // Vamos ativar silenciosamente para o usuário ou perguntar? 
        // Por padrão em apps modernos, ao logar com sucesso a primeira vez, a gente ativa
        await BiometricService.setCredentials(email, password)
      }

      window.router.navigate('/home')
    } catch (err) {
      window.toast.error(err.message || 'Erro ao fazer login')
      if (isBio) {
        // Se a biometria falhou por credenciais inválidas, deletar
        await BiometricService.deleteCredentials()
      }
    } finally {
      btn.disabled = false
      btn.textContent = 'Entrar'
    }
  }

  _forgotPassword() {
    window.router.navigate('/forgot-password')
  }

  destroy() { }
}


