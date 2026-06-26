// ─────────────────────────────────────────────
//  Wow Mobilya – Çok Yakında | Service Worker
//  Cache: wow-coming-soon-v2
// ─────────────────────────────────────────────

const CACHE_NAME = 'wow-coming-soon-v2';

const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap'
];

// ── Install ──
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Çekirdek dosyalar önbelleğe alınıyor...');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// ── Activate: eski önbellekleri temizle ──
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(
        names
          .filter((n) => n !== CACHE_NAME)
          .map((n) => {
            console.log('[SW] Eski önbellek siliniyor:', n);
            return caches.delete(n);
          })
      )
    )
  );
  self.clients.claim();
});

// ── Fetch: önce önbellek, sonra ağ ──
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;

      return fetch(event.request)
        .then((response) => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, clone);
          });
          return response;
        })
        .catch(() => {
          console.warn('[SW] Çevrimdışı – index.html döndürülüyor');
          return caches.match('./index.html');
        });
    })
  );
});
