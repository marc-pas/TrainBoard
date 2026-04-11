const CACHE = 'trainboard-v2';
const ASSETS = ['/', '/index.html', '/manifest.json'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
  ));
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  // Pour les appels API SNCF, toujours réseau
  if (e.request.url.includes('api.sncf.com')) {
    e.respondWith(fetch(e.request));
    return;
  }
  // Pour le reste, cache-first
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request))
  );
});
