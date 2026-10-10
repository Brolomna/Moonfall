import React, { Suspense, lazy } from 'react';
import { createRoot } from 'react-dom/client';
import './global.css';

// Host and player screens are loaded separately, so players' phones don't download the host's screen (and vice versa).
const HostApp = lazy(() => import('./HostApp').then(m => ({ default: m.HostApp })));
const PlayerApp = lazy(() => import('./PlayerApp').then(m => ({ default: m.PlayerApp })));

const isHost = window.location.pathname.replace(/\/+$/, '') === '/host';

// Installable as an app: players get "Moonfall", the host page gets "Moonfall Host"
const manifest = document.createElement('link');
manifest.rel = 'manifest';
manifest.href = isHost ? '/manifest-host.webmanifest' : '/manifest.webmanifest';
document.head.appendChild(manifest);
document.querySelector('meta[name="apple-mobile-web-app-title"]')?.setAttribute('content', isHost ? 'Moonfall Host' : 'Moonfall');
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  navigator.serviceWorker.register('/sw.js').catch(() => { /* not available (e.g. plain http on the LAN) */ });
}

createRoot(document.getElementById('root')!).render(
  <Suspense fallback={<div style={{ position: 'fixed', inset: 0, background: '#0a0612' }} />}>
    {isHost ? <HostApp /> : <PlayerApp />}
  </Suspense>
);
