const CACHE_NAME = 'weathernotes-cache-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/add-note.html',
  '/notes.html',
  '/css/style.css',
  '/js/main.js',
  '/js/add-note.js',
  '/js/notes.js',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png'
];

// Instalacja — cache plików statycznych
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(STATIC_ASSETS))
  );
});

// Aktywacja — czyszczenie starych cache
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
});

// Obsługa żądań — cache-first dla statycznych, network-first dla API
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  if (url.origin === location.origin) {
    // Cache-first dla lokalnych zasobów
    event.respondWith(
      caches.match(event.request).then(cached =>
        cached || fetch(event.request).catch(() => offlineFallback(url.pathname))
      )
    );
  } else {
    // Network-first dla API
    event.respondWith(
      fetch(event.request)
        .then(response => response)
        .catch(() => new Response('Brak internetu i brak danych z cache.', { status: 503 }))
    );
  }
});

function offlineFallback(pathname) {
  if (pathname.endsWith('.html')) {
    return caches.match('/index.html');
  }
  return new Response('Brak internetu', { status: 503 });
}
