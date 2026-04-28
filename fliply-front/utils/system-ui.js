import { Capacitor } from '@capacitor/core';

export const SystemUiService = {
  async sync(isDark) {
    if (!Capacitor.isNativePlatform()) return;

    const { StatusBar, NavigationBar } = Capacitor.Plugins;

    try {
      // Sincroniza StatusBar (Topo)
      if (StatusBar) {
        await StatusBar.setStyle({
          style: isDark ? 'DARK' : 'LIGHT'
        });
      }
      
      const bgColor = isDark ? '#0D0D1A' : '#FFFFFF';

      if (Capacitor.getPlatform() === 'android') {
        // Sincroniza NavigationBar (Baixo) usando o plugin Capgo
        if (NavigationBar) {
          await NavigationBar.setBackgroundColor({
              color: bgColor,
              darkButtons: !isDark
          });
        }
        
        // Garante que a StatusBar também tenha o fundo certo
        if (StatusBar) {
          await StatusBar.setBackgroundColor({
              color: bgColor
          });
        }
      }
    } catch (e) {
      console.warn('System UI Sync failed', e);
    }
  }
};
