/**
 * Module d'Administration des Notifications Push Mobiles (Style WhatsApp)
 * Déclenché STRICTEMENT sur les téléphones et smartphones mobiles.
 */

/**
 * Détection fiable des téléphones et appareils mobiles (Android, iOS, Smartphones)
 */
export const isMobileDevice = () => {
  if (typeof window === 'undefined') return false;
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;
  const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
  const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  const isSmallScreen = window.innerWidth <= 820;
  return mobileRegex.test(userAgent) || (isTouch && isSmallScreen);
};

/**
 * Enregistre le Service Worker mobile /sw.js
 */
export const registerMobileServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js', { scope: '/' });
      console.log('[Mobile Push SW] Service Worker enregistré avec succès:', registration.scope);
      return registration;
    } catch (error) {
      console.error('[Mobile Push SW] Erreur enregistrement Service Worker:', error);
    }
  }
  return null;
};

/**
 * Demande la permission d'envoi de notifications natives sur mobile uniquement
 */
export const requestMobileNotificationPermission = async () => {
  if (!isMobileDevice()) return 'not_mobile';
  if (!('Notification' in window)) return 'unsupported';

  if (Notification.permission === 'granted') {
    await registerMobileServiceWorker();
    return 'granted';
  }

  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      await registerMobileServiceWorker();
    }
    return permission;
  } catch (e) {
    console.error('[Mobile Push] Erreur lors de la demande de permission:', e);
    return 'error';
  }
};

/**
 * Obtient le statut de permission des notifications sur mobile
 */
export const getMobileNotificationStatus = () => {
  if (!isMobileDevice()) return 'not_mobile';
  if (!('Notification' in window)) return 'unsupported';
  return Notification.permission;
};

/**
 * Envoie une notification système native sur téléphone (Style WhatsApp avec Vibration)
 * S'exécute STRICTEMENT sur mobile uniquement.
 */
export const sendMobileNativeNotification = async (title, body, options = {}) => {
  // STRICTEMENT RESTREINT AUX TÉLÉPHONES ET APPAREILS MOBILES
  if (!isMobileDevice()) {
    return;
  }

  if (!('Notification' in window) || Notification.permission !== 'granted') {
    return;
  }

  try {
    // 1. Déclenchement natif via le Service Worker (sur l'écran de verrouillage / volet de notification du téléphone)
    if ('serviceWorker' in navigator) {
      let registration = await navigator.serviceWorker.getRegistration();
      if (!registration) {
        registration = await registerMobileServiceWorker();
      }

      if (registration && registration.showNotification) {
        await registration.showNotification(title || '🔔 ApexPOS', {
          body: body || 'Nouvelle alerte mobile reçue.',
          icon: options.icon || '/icon-192.png',
          badge: '/icon-192.png',
          vibrate: [200, 100, 200, 100, 200], // Motif de vibration WhatsApp
          tag: options.tag || 'apexpos-mobile-notification',
          renotify: true,
          data: { url: options.url || '/' }
        });
        return;
      }
    }

    // 2. Fallback de l'API Web Notification
    new Notification(title || '🔔 ApexPOS', {
      body: body || 'Nouvelle alerte mobile reçue.',
      icon: options.icon || '/icon-192.png',
      vibrate: [200, 100, 200, 100, 200]
    });
  } catch (err) {
    console.error('[Mobile Push] Erreur lors de l\'envoi de la notification native:', err);
  }
};
