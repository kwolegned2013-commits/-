
const CACHE_NAME = 'we-youth-v1';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  'https://cdn.tailwindcss.com',
  'https://fonts.googleapis.com/css2?family=Pretendard:wght@400;600;700;900&display=swap'
];

// 서비스 워커 설치 및 핵심 에셋 캐싱
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// 이전 캐시 삭제
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

// 네트워크 요청 가로채기 (Stale-While-Revalidate 전략)
self.addEventListener('fetch', (event) => {
  // 외부 API 호출(Gemini 등)은 캐싱에서 제외
  if (event.request.url.includes('generativelanguage.googleapis.com')) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request).then((networkResponse) => {
        // 유효한 응답인 경우 캐시에 업데이트
        if (networkResponse && networkResponse.status === 200) {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return networkResponse;
      }).catch(() => {
        // 오프라인 상태에서 네트워크 요청 실패 시 캐시된 응답이 없다면 에러 처리
        return cachedResponse;
      });

      return cachedResponse || fetchPromise;
    })
  );
});
