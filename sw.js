// Production Service Worker
// Version: 1.0.0

const CACHE_NAME = 'anniversary-v1.0.0';
const STATIC_CACHE = 'anniversary-static-v1.0.0';

const STATIC_FILES = [
  '/',
  '/index.html',
  '/src/styles/main.css',
  '/assets/js/app.js',
  '/assets/music/Arijitsingh.m4a'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => cache.addAll(STATIC_FILES))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        return response || fetch(event.request);
      })
  );
});