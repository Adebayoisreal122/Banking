const CACHE_NAME = 'trustwave-v1';

// Install
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

// Activate — clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

// Fetch — safe version that won't break Vite or extensions
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // ── Skip all of these completely ──
  if (
    event.request.method !== 'GET' ||           // non-GET requests
    url.protocol === 'chrome-extension:' ||      // browser extensions
    url.protocol === 'chrome:' ||               // chrome internal
    url.hostname === 'localhost' ||             // Vite dev server
    url.hostname === '127.0.0.1' ||            // local dev
    url.pathname.includes('/@vite/') ||         // Vite HMR
    url.pathname.includes('/@react-refresh') || // React refresh
    url.pathname.includes('/api/')              // backend API calls
  ) {
    return; // let browser handle normally
  }

  // ── For everything else: network first, cache fallback ──
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Only cache valid same-origin responses
        if (
          response &&
          response.status === 200 &&
          response.type === 'basic'
        ) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, clone);
          });
        }
        return response;
      })
      .catch(() => {
        // Offline fallback — serve cached version or index.html
        return caches.match(event.request).then(
          (cached) => cached || caches.match('/index.html')
        );
      })
  );
});