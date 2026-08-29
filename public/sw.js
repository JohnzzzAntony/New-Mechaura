/**
 * Mechaura International - Production Service Worker
 * Versioned cache management, instant offline availability, and performance acceleration.
 */

const CACHE_NAME = 'mechaura-v3.2.0';

const PRECACHE_ASSETS = [
  '/',
  '/style.css',
  '/main.js',
  '/images/logo.webp',
  '/images/logo.png',
  '/images/hero_brushes.webp',
  '/about',
  '/products',
  '/services',
  '/sectors',
  '/contact',
  '/blog'
];

// Install: Pre-cache critical core shell assets & take over immediately
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS).catch((err) => {
        console.warn('[SW] Precache failed for some assets:', err);
      });
    })
  );
});

// Activate: Purge obsolete cache versions immediately and claim all open tabs
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[SW] Deleting legacy cache:', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Strategy
self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);

  // Ignore non-GET requests and analytics/tag manager requests
  if (request.method !== 'GET') return;
  if (url.origin.includes('google-analytics') || url.origin.includes('googletagmanager')) return;

  // 1. Navigation (HTML pages) & Code files: Network-first with cache fallback
  // Ensures updates are visible immediately on next visit
  if (
    request.mode === 'navigate' ||
    request.destination === 'document' ||
    request.destination === 'style' ||
    request.destination === 'script' ||
    url.pathname.endsWith('.html') ||
    url.pathname.endsWith('.css') ||
    url.pathname.endsWith('.js')
  ) {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const copy = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          }
          return networkResponse;
        })
        .catch(() => caches.match(request).then((cached) => cached || (request.mode === 'navigate' ? caches.match('/') : null)))
    );
    return;
  }

  // 2. Heavy Media & Fonts: Cache-first with network fallback
  if (
    url.pathname.startsWith('/images/') ||
    url.pathname.startsWith('/assets/') ||
    request.destination === 'image' ||
    request.destination === 'font'
  ) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) return cachedResponse;
        return fetch(request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const copy = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          }
          return networkResponse;
        });
      })
    );
    return;
  }

  // Default: Network fetch with cache fallback
  event.respondWith(
    caches.match(request).then((cached) => cached || fetch(request))
  );
});

// Message handler for manual cache purging
self.addEventListener('message', (event) => {
  if (event.data && event.data.action === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  if (event.data && event.data.action === 'CLEAR_CACHE') {
    caches.keys().then((keys) => {
      return Promise.all(keys.map((key) => caches.delete(key)));
    }).then(() => {
      if (event.ports && event.ports[0]) {
        event.ports[0].postMessage({ success: true });
      }
    });
  }
});
