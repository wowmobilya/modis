const CACHE_NAME = 'mobilya-takip-v5';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  // المكتبات الخارجية المستخدمة في التطبيق
  'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js',
  'https://cdn.jsdelivr.net/npm/jsbarcode@3.11.6/dist/JsBarcode.all.min.js',
  // الأيقونة
  'https://cdn-icons-png.flaticon.com/512/2734/2734072.png'
];

// تثبيت الـ Service Worker وحفظ الملفات
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Opened cache');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// جلب الملفات من الذاكرة المؤقتة عند غياب الإنترنت
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // إرجاع الملف من الذاكرة المؤقتة إذا وجد، وإلا جلبه من الإنترنت وحفظه
      return response || fetch(event.request).then((fetchResponse) => {
        return caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, fetchResponse.clone());
          return fetchResponse;
        });
      });
    }).catch(() => {
      // في حال فشل كل شيء (أوفلاين والملف غير محفوظ)
      console.log('Offline and resource not cached:', event.request.url);
    })
  );
});

// تحديث الذاكرة المؤقتة عند وجود إصدار جديد
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});













