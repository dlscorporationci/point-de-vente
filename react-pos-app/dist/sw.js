const CACHE_NAME = 'apexpos-shell-v1';
const SHELL_ASSETS = [
  '/',
  '/index.html',
];

// Installation : mise en cache de l'App Shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(SHELL_ASSETS))
      .then(() => self.skipWaiting())
  );
});

// Activation : nettoyage des anciens caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME)
            .map((key) => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch : Network-First pour les API, Cache-First pour les assets statiques
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Ne pas intercepter les requêtes API, SSE ou les extensions de navigateur
  if (url.pathname.startsWith('/api/') || 
      url.pathname.startsWith('/v1/') ||
      url.pathname.includes('/sse/') ||
      url.protocol === 'chrome-extension:') {
    return;
  }

  // Stratégie : Network-First avec fallback cache pour les assets statiques
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Mettre en cache les réponses réussies pour les assets statiques
        if (response.ok && event.request.method === 'GET') {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return response;
      })
      .catch(() => {
        // Fallback sur le cache si le réseau est indisponible
        return caches.match(event.request)
          .then((cached) => cached || caches.match('/index.html'));
      })
  );
});
