
// 서비스 워커 버전 업데이트
const CACHE_NAME = 'we-youth-v4-stable';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => caches.delete(cache))
      );
    })
  );
  self.clients.claim();
});

// 페치 이벤트: 네트워크 우선, 실패 시에만 캐시 확인
self.addEventListener('fetch', (event) => {
  // esm.sh 등 외부 모듈 요청은 절대 간섭하지 않음
  if (event.request.url.includes('esm.sh')) return;
  if (event.request.method !== 'GET') return;

  event.respondWith(
    fetch(event.request)
      .catch(() => caches.match(event.request))
  );
});
