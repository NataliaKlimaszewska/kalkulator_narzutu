self.addEventListener('install', (e) => {
  console.log('[Service Worker] Install');
});

self.addEventListener('fetch', (e) => {
  // Basic fetch handler for PWA compliance
  e.respondWith(fetch(e.request));
});
