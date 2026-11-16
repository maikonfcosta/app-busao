const CACHE_NAME = 'busao-calc-v4';
const ASSETS = [
  './',
  './index.html',
  './favicon.ico',
  './favicon.png',
  './manifest.json',
  './assets/img/logo.png',
  './assets/img/icon-192.png',
  './assets/img/icon-512.png',
  './assets/img/apple-touch-icon.png',
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
