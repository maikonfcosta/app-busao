const CACHE_NAME = 'busao-calc-v1';
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
  'https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
