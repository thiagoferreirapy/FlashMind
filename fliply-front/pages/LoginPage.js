import { AuthService } from '../utils/auth.js'
import { icon, refreshIcons } from '../utils/icons.js'
import { BiometricService } from '../utils/biometric.js'
import { Modal } from '../components/Modal.js'

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
    const creds = await BiometricService.getCredentials()
    if (creds) {
      document.getElementById('auth-email').value = creds.email
      document.getElementById('auth-password').value = creds.password
      this._login(true)
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
    const prefill = document.getElementById('auth-email')?.value.trim() || ''
    const modal = new Modal({
      title: 'Recuperar senha', content: `
      <div style="text-align:center;margin-bottom:var(--space-md)">

        <p style="color:var(--text-secondary);font-size:14px;line-height:1.5;margin:0">
          Informe seu e-mail e enviaremos um link para você redefinir sua senha.
        </p>
      </div>
      <div class="form-group">
        <label class="form-label">E-mail</label>
        <input id="fp-email" type="email" class="form-input" placeholder="seu@email.com" value="${prefill}" autocomplete="email">
      </div>
      <div class="flex gap-sm mt-md">
        <button class="btn btn-secondary flex-1" id="fp-cancel">Cancelar</button>
        <button class="btn btn-primary flex-1" id="fp-send">Enviar</button>
      </div>` })
    modal.open()
    refreshIcons()
    document.getElementById('fp-cancel').addEventListener('click', () => modal.close())
    document.getElementById('fp-send').addEventListener('click', async () => {
      const email = document.getElementById('fp-email').value.trim()
      if (!email) { window.toast.error('Digite seu e-mail'); return }
      const btn = document.getElementById('fp-send'); btn.disabled = true; btn.textContent = 'Enviando...'
      try {
        await AuthService.forgotPassword(email)
        modal.close()
        window.toast.success('Link enviado! Verifique sua caixa de entrada.')
      } catch (err) {
        window.toast.error(err.message)
        btn.disabled = false; btn.textContent = 'Enviar'
      }
    })
  }

  destroy() { }
}


