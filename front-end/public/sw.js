const CACHE_NAME = 'movie-images-v1';
const IMAGE_CACHE_SIZE = 200;
const urlsToPreCache = [];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToPreCache);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  if (
    event.request.destination === 'image' ||
    url.pathname.match(/\.(jpg|jpeg|png|webp|avif)$/i) ||
    url.hostname.includes('tmdb.org') ||
    url.hostname.includes('image.tmdb.org')
  ) {
    event.respondWith(
      caches.open(CACHE_NAME).then(async (cache) => {
        const cachedResponse = await cache.match(event.request);

        if (cachedResponse) {
          const fetchPromise = fetch(event.request)
            .then((networkResponse) => {
              if (networkResponse.ok) {
                cache.put(event.request, networkResponse.clone());
              }
              return networkResponse;
            })
            .catch(() => {});

          return cachedResponse;
        }

        try {
          const networkResponse = await fetch(event.request);

          if (networkResponse.ok) {
            const responseToCache = networkResponse.clone();
            const blob = await responseToCache.blob();

            if (blob.size < 5 * 1024 * 1024) {
              cache.put(event.request, networkResponse.clone());

              const keys = await cache.keys();
              if (keys.length > IMAGE_CACHE_SIZE) {
                const keysToDelete = keys.slice(
                  0,
                  keys.length - IMAGE_CACHE_SIZE
                );
                await Promise.all(keysToDelete.map((key) => cache.delete(key)));
              }
            }
          }

          return networkResponse;
        } catch (error) {
          const cachedPlaceholder = await cache.match('/placeholder.jpg');
          if (cachedPlaceholder) return cachedPlaceholder;
          throw error;
        }
      })
    );
  }
});

self.addEventListener('message', (event) => {
  if (event.data.type === 'PREFETCH_IMAGES') {
    const urls = event.data.urls;

    caches.open(CACHE_NAME).then((cache) => {
      urls.forEach((url) => {
        cache.match(url).then((response) => {
          if (!response) {
            fetch(url).then((response) => {
              if (response.ok) {
                cache.put(url, response);
              }
            });
          }
        });
      });
    });
  }
});
