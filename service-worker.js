const CACHE_NAME = 'forum-cache-v1';
const urlsToCache = [
  '/',
  './server/index.js',
  'server/index.js',
  'index.js',
  './index.js',
  'https://cdn.socket.io/4.3.2/socket.io.esm.min.js', // Archivo de socket.io
];

// Instalando el Service Worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache abierto');
        return cache.addAll(urlsToCache);
      })
  );
});

// Cachear las respuestas de la red y servir los recursos offline
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Devuelve la respuesta del caché si está disponible
        if (response) {
          return response;
        }

        // Si el recurso no está en la caché, realiza una solicitud a la red
        return fetch(event.request).then(
          networkResponse => {
            // Si la respuesta de la red no es válida, devolver
            if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
              return networkResponse;
            }

            // Clona la respuesta
            const responseToCache = networkResponse.clone();

            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });

            return networkResponse;
          }
        );
      })
      .catch(() => {
        // Si está offline y no puede acceder a la red, sirve una página alternativa
        return caches.match('./client/index.html');
      })
  );
});

// Limpiar el caché viejo en la activación del Service Worker
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];

  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
