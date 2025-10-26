const CACHE_NAME = 'movie-app-v2';
const IMAGE_CACHE_NAME = 'movie-images-v2';
const MAX_IMAGES_TO_CACHE = 200;
const CACHE_EXPIRATION_DAYS = 7;

const urlsToCache = [
  '/',
  '/index.html',
  '/default.png',
  '/favicon.svg',
  '/site.webmanifest',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((name) => name !== CACHE_NAME && name !== IMAGE_CACHE_NAME)
            .map((name) => caches.delete(name))
        );
      })
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  const isImageRequest =
    event.request.destination === 'image' ||
    /\.(jpg|jpeg|png|webp|avif|gif|svg)$/i.test(url.pathname);

  if (
    event.request.method !== 'GET' ||
    url.protocol === 'chrome-extension:' ||
    url.hostname === 'chrome.google.com'
  ) {
    return;
  }

  if (isImageRequest) {
    event.respondWith(handleImageRequest(event));
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (response && response.status === 200) {
          const responseToCache = response.clone();
          caches
            .open(CACHE_NAME)
            .then((cache) => cache.put(event.request, responseToCache));
        }
        return response;
      })
      .catch(() => {
        return caches.match(event.request).then((response) => {
          return (
            response ||
            new Response('Offline', {
              status: 503,
              statusText: 'Service Unavailable',
            })
          );
        });
      })
  );
});

async function handleImageRequest(event) {
  const cache = await caches.open(IMAGE_CACHE_NAME);
  const cachedResponse = await cache.match(event.request);

  if (cachedResponse) {
    const cachedDate = new Date(cachedResponse.headers.get('date'));
    const cacheAge =
      (Date.now() - cachedDate.getTime()) / (1000 * 60 * 60 * 24);

    if (cacheAge < CACHE_EXPIRATION_DAYS) {
      return cachedResponse;
    }
  }

  try {
    const networkResponse = await fetch(event.request);

    if (networkResponse && networkResponse.status === 200) {
      const responseToCache = networkResponse.clone();

      const keys = await cache.keys();
      if (keys.length >= MAX_IMAGES_TO_CACHE) {
        await Promise.all(
          keys
            .slice(0, Math.floor(MAX_IMAGES_TO_CACHE * 0.2))
            .map((key) => cache.delete(key))
        );
      }

      await cache.put(event.request, responseToCache);
    }

    return networkResponse;
  } catch (error) {
    if (cachedResponse) return cachedResponse;

    const defaultResponse = await caches.match('/default.png');
    if (defaultResponse) return defaultResponse;

    return new Response(
      '<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100%" height="100%" fill="#e5e7eb"/><text x="50%" y="50%" font-family="Arial" font-size="14" text-anchor="middle" dy=".3em" fill="#6b7280">Image</text></svg>',
      { headers: { 'Content-Type': 'image/svg+xml' } }
    );
  }
}

self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-images') {
    // Handle background sync for images
  }
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'PREFETCH_IMAGES') {
    const urls = event.data.urls || [];
    event.waitUntil(
      caches.open(IMAGE_CACHE_NAME).then((cache) => {
        const cachePromises = urls.map((url) => {
          return fetch(url, { mode: 'no-cors' })
            .then((response) => {
              if (response.ok) {
                return cache.put(url, response);
              }
              return Promise.reject('Failed to fetch');
            })
            .catch(() => {
              console.warn(`Failed to prefetch: ${url}`);
            });
        });
        return Promise.all(cachePromises);
      })
    );
  }
});
