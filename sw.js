const CACHE = 'stille-os-v10';

const PRECACHE = [
  './',
  './index.html',
  './deel-1.html',
  './style.css',
  './script.js',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png',
  '../Illustrations/1/1_1.png',
  '../Illustrations/1/1_2.png',
  '../Illustrations/1/1_3.png',
  '../Illustrations/1/1_4.png',
  '../Illustrations/1/1_5.png',
  '../Illustrations/2/2_1.png',
  '../Illustrations/2/2_2.png',
  '../Illustrations/2/2_3.png',
  '../Illustrations/2/2_4.png',
  '../Illustrations/2/2_5.png',
  '../Illustrations/2/2_6.png',
  '../Illustrations/2/2_7.png',
  '../Illustrations/3/3_1.png',
  '../Illustrations/3/3_2.png',
  '../Illustrations/3/3_3.png',
  '../Illustrations/3/3_4.png',
  '../Illustrations/3/3_5.png',
  '../Illustrations/3/3_6.png',
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE)
      .then(cache => cache.addAll(PRECACHE))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k => k !== CACHE).map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  const isHTML = event.request.destination === 'document';

  if (isHTML) {
    // HTML altijd van het netwerk, cache als fallback (offline)
    event.respondWith(
      fetch(event.request)
        .then(response => {
          const clone = response.clone();
          caches.open(CACHE).then(cache => cache.put(event.request, clone));
          return response;
        })
        .catch(() => caches.match(event.request).then(r => r || caches.match('./index.html')))
    );
  } else {
    // Afbeeldingen, CSS, JS: cache-first voor snelheid
    event.respondWith(
      caches.match(event.request).then(cached => {
        if (cached) return cached;
        return fetch(event.request).then(response => {
          if (response && response.status === 200 && response.type !== 'opaque') {
            const clone = response.clone();
            caches.open(CACHE).then(cache => cache.put(event.request, clone));
          }
          return response;
        });
      })
    );
  }
});
