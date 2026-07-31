const CACHE_NAME = 'apexpos-cache-v3';
const DYNAMIC_CACHE = 'apexpos-dynamic-v3';

// Static assets to cache immediately upon installation
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.svg'
];

// Install Event — Pre-cache core shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// Activate Event — Clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME && key !== DYNAMIC_CACHE)
            .map((key) => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event — Cache-First with Network Fallback & index.html SPA Fallback
self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);

  // Skip non-GET requests (API POSTs handled by React Offline Queue)
  if (request.method !== 'GET') {
    return;
  }

  // API Requests: Network-First with cache fallback
  if (url.pathname.includes('/v1/')) {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(DYNAMIC_CACHE).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return networkResponse;
        })
        .catch(() => {
          return caches.match(request);
        })
    );
    return;
  }

  // Static Assets / Page Navigation: Cache First with Network & index.html Fallback
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        // En arrière-plan, tenter de mettre à jour le cache si réseau disponible
        fetch(request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, networkResponse);
            });
          }
        }).catch(() => {});

        return cachedResponse;
      }

      // Si non présent en cache, tenter la requête réseau
      return fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return networkResponse;
        })
        .catch(async () => {
          // Si le réseau échoue (Mode Déconnecté F5), renvoyer index.html depuis le cache
          const cache = await caches.open(CACHE_NAME);
          const indexFallback = await cache.match('./index.html') || await cache.match('./') || await cache.match('/index.html');
          if (indexFallback) {
            return indexFallback;
          }
          return new Response('ApexPOS Mode Hors-Ligne', {
            status: 200,
            headers: new Headers({ 'Content-Type': 'text/html' })
          });
        });
    })
  );
});
