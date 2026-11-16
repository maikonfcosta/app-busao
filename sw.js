const CACHE_NAME = 'busao-calc-v3';
const ASSETS = [
  './',
  './index.html',
  './css/style.css',
  './js/script.js',
  './js/GameLogic.js',
  './js/main.js',
  './src/vision/CameraHandler.js',
  './src/vision/cardDefinitions.js',
  './src/vision/masterCardList.js',
  './src/utils/stringMatcher.js',
  'https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js',
  'https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
