const V = 'walow-studio-v1';
const SHELL = ['./', 'index.html', 'manifest.json', 'icon-192.png', 'icon-512.png'];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(V).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== V).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const u = new URL(req.url);
  if (u.hostname.endsWith('pollinations.ai')) return;
  if (u.origin === location.origin || u.hostname === 'cdn.jsdelivr.net') {
    e.respondWith(caches.match(req).then(hit => {
      const net = fetch(req).then(r => {
        if (r && r.ok) { const cp = r.clone(); caches.open(V).then(c => c.put(req, cp)); }
        return r;
      }).catch(() => hit);
      return hit || net;
    }));
  }
});
