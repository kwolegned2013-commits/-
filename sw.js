
// SW Version 5 - Passive Mode
const CACHE_NAME = 'we-youth-v5-passive';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.map(k => caches.delete(k))))
  );
  self.clients.claim();
});

// fetch 핸들러를 비워두거나 최소화하여 브라우저의 기본 로딩 메커니즘을 방해하지 않도록 합니다.
self.addEventListener('fetch', (event) => {
  // Pass-through
  return;
});
