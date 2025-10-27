// تم الاحتفاظ بوظيفة الservice-worker الأصلية مع تنسيق بسيط
const CACHE_NAME = 'attendance-pwa-v1';
const FILES_TO_CACHE = [
  '/index.html',
  '/reports.html',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png'
];

self.addEventListener('install', (evt) => {
  evt.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    await cache.addAll(FILES_TO_CACHE);
    self.skipWaiting();
  })());
});

self.addEventListener('activate', (evt) => {
  evt.waitUntil((async ()=>{
    const keys = await caches.keys();
    await Promise.all(keys.map(k => { if(k !== CACHE_NAME) return caches.delete(k); }));
    self.clients.claim();
  })());
});

self.addEventListener('fetch', (evt) => {
  if(evt.request.method === 'POST') return; // لا نشارك POST من الكاش
  evt.respondWith((async ()=>{
    try{ return await fetch(evt.request); }catch(e){ const cache = await caches.open(CACHE_NAME); const cached = await cache.match(evt.request); return cached || await cache.match('/index.html'); }
  })());
});
