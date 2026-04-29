import { NativeBiometric } from '@rolster/capacitor-native-biometric';

export const BiometricService = {
  async isAvailable() {
    try {
      const result = await NativeBiometric.isAvailable();
      return result.isAvailable;
    } catch {
      return false;
    }
  },

  async setCredentials(email, password) {
    try {
      await NativeBiometric.setCredentials({
        username: email,
        password: password,
        server: 'fliply.app',
      });
      localStorage.setItem('fliply_biometric_enabled', 'true');
      return true;
    } catch (e) {
      console.error('Erro ao salvar biometria', e);
      return false;
    }
  },

  async getCredentials() {
    try {
      if (!NativeBiometric) throw new Error('Plugin Biométrico não encontrado');

      // Primeiro, obriga a verificação biométrica (mostra o prompt do celular)
      await NativeBiometric.verifyIdentity({
        reason: 'Acesse sua conta no FlashMind',
        title: 'Login Biométrico',
        subtitle: 'Use sua digital para entrar',
        description: 'Toque no sensor para continuar'
      });

      // Se a verificação passar, buscamos as credenciais
      const result = await NativeBiometric.getCredentials({
        server: 'fliply.app',
      });
      return { email: result.username, password: result.password };
    } catch (e) {
      // Se o usuário cancelar ou a biometria falhar, cai aqui
      console.error('Erro ou cancelamento da biometria', e);
      // Re-throw if it's a critical error we want the UI to catch, 
      // or return null if it's a "normal" failure (like cancel)
      if (e.message?.includes('not found') || e.message?.includes('available')) {
        throw e;
      }
      return null;
    }
  },

  async deleteCredentials() {
    try {
      await NativeBiometric.deleteCredentials({
        server: 'fliply.app',
      });
      localStorage.removeItem('fliply_biometric_enabled');
    } catch (e) {
      console.error('Erro ao deletar biometria', e);
    }
  }
};
