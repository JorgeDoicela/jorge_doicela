const CACHE_NAME = 'jorge-doicela-pwa-v1';
const PRECACHE_ASSETS = [
  '/',
  '/manifest.json',
  '/landing/logo/logo_fondo_circular_color_.png'
];

// Instalación del Service Worker y precaché de recursos críticos
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// Activación y limpieza de cachés antiguas
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Estrategia de respuesta según el tipo de petición
self.addEventListener('fetch', (event) => {
  // Ignorar peticiones que no sean GET
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // NUNCA interceptar chunks internos de Next.js (dejar que el navegador y Nginx gestionen el hashing)
  if (url.pathname.startsWith('/_next/')) return;


  // Red primero para la navegación de páginas HTML
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseClone));
          return response;
        })
        .catch(() => caches.match(event.request).then((res) => res || caches.match('/')))
    );
    return;
  }

  // Caché primero para imágenes y recursos estáticos
  if (
    event.request.destination === 'image' ||
    event.request.destination === 'style' ||
    event.request.destination === 'font' ||
    url.pathname.includes('/landing/')
  ) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) {
          // Actualización asíncrona en segundo plano
          fetch(event.request)
            .then((networkResponse) => {
              if (networkResponse.status === 200) {
                caches.open(CACHE_NAME).then((cache) => cache.put(event.request, networkResponse));
              }
            })
            .catch(() => {});
          return cachedResponse;
        }

        return fetch(event.request).then((networkResponse) => {
          if (networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseClone));
          }
          return networkResponse;
        });
      })
    );
  }
});
