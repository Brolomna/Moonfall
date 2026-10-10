// Moonfall service worker: only makes the site installable as an app. It caches nothing —
// every request goes to the network, so a new version is always picked up.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));
self.addEventListener('fetch', () => { /* network as usual */ });
