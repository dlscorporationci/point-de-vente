/* ==========================================================================
   SERVICE WORKER APEXPOS — NOTIFICATIONS MOBILES STYLES WHATSAPP
   ========================================================================== */

const CACHE_NAME = 'apexpos-sw-v1';

// Installation du Service Worker
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

// Activation du Service Worker
self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// Écoute des événements Push Web (Push Server / VAPID)
self.addEventListener('push', (event) => {
  let data = { title: 'ApexPOS', body: 'Nouvelle notification ApexPOS' };
  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      data.body = event.data.text();
    }
  }

  const options = {
    body: data.body || 'Nouveau message ou alerte reçue.',
    icon: data.icon || '/icon-192.png',
    badge: data.badge || '/icon-192.png',
    vibrate: [200, 100, 200, 100, 200], // Vibration style WhatsApp sur mobile
    tag: data.tag || 'apexpos-mobile-notification',
    renotify: true,
    data: {
      url: data.url || '/'
    },
    actions: [
      { action: 'open', title: '📱 Ouvrir ApexPOS' }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(data.title || '🔔 ApexPOS', options)
  );
});

// Écoute des messages envoyés depuis l'application frontend (pour notifications instantanées)
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'TRIGGER_MOBILE_NOTIFICATION') {
    const { title, body, icon, url } = event.data;
    const options = {
      body: body || 'Nouvelle mise à jour disponible.',
      icon: icon || '/icon-192.png',
      badge: '/icon-192.png',
      vibrate: [200, 100, 200, 100, 200], // Vibration tactile mobile
      tag: 'apexpos-instant-alert',
      renotify: true,
      data: { url: url || '/' }
    };

    self.registration.showNotification(title || '🔔 ApexPOS', options);
  }
});

// Clic sur une notification sur l'écran verrouillé / barre de notification du téléphone
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const targetUrl = (event.notification.data && event.notification.data.url) ? event.notification.data.url : '/';

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (let client of clientList) {
        if (client.url && 'focus' in client) {
          return client.focus();
        }
      }
      if (self.clients.openWindow) {
        return self.clients.openWindow(targetUrl);
      }
    })
  );
});
