const CACHE_NAME = 'movie-images-v1';
const IMAGE_CACHE_SIZE = 200; // Cache 200 images

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Only cache images
  if (
    event.request.destination === 'image' ||
    url.pathname.includes('.jpg') ||
    url.pathname.includes('.png') ||
    url.hostname.includes('tmdb.org')
  ) {
    event.respondWith(
      caches.open(CACHE_NAME).then(async (cache) => {
        const cachedResponse = await cache.match(event.request);

        if (cachedResponse) {
          return cachedResponse;
        }

        const networkResponse = await fetch(event.request);

        // Cache successful responses
        if (networkResponse.ok) {
          cache.put(event.request, networkResponse.clone());

          // Limit cache size
          const keys = await cache.keys();
          if (keys.length > IMAGE_CACHE_SIZE) {
            cache.delete(keys[0]);
          }
        }

        return networkResponse;
      })
    );
  }
});
