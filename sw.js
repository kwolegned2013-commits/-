
const CACHE_NAME = 'we-youth-v2';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// 수정된 Fetch 전략: 네트워크 우선 (Network First)
self.addEventListener('fetch', (event) => {
  // POST 요청이나 외부 API 요청은 캐싱하지 않음
  if (event.request.method !== 'GET') return;

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // 네트워크 성공 시 해당 응답을 캐시에 저장 (선택 사항)
        const resClone = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          // 내부 리소스만 캐싱 (보안 및 안정성)
          if (event.request.url.startsWith(self.location.origin)) {
            cache.put(event.request, resClone);
          }
        });
        return response;
      })
      .catch(() => {
        // 네트워크 실패(오프라인) 시 캐시에서 확인
        return caches.match(event.request);
      })
  );
});
