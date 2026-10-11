import { useEffect, useState } from 'react';

// "Install the app" button support.
// Android / Chrome / Edge: the browser fires `beforeinstallprompt` once; we keep it and show our own button.
// iPhone / iPad (Safari): there is no install API — the button opens instructions (Share → Add to Home Screen).
type PromptEvent = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: string }> };

let deferred: PromptEvent | null = null;
const listeners = new Set<() => void>();
const notify = () => listeners.forEach(f => f());

if (typeof window !== 'undefined') {
  window.addEventListener('beforeinstallprompt', e => { e.preventDefault(); deferred = e as PromptEvent; notify(); });
  window.addEventListener('appinstalled', () => { deferred = null; notify(); });
}

const standalone = () =>
  window.matchMedia?.('(display-mode: standalone)').matches || (navigator as unknown as { standalone?: boolean }).standalone === true;
const isIOS = () => /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

/** mode: 'prompt' (one tap installs), 'ios' (show instructions) or null (already installed / not possible here). */
export function useInstall() {
  const [, tick] = useState(0);
  useEffect(() => { const f = () => tick(x => x + 1); listeners.add(f); return () => { listeners.delete(f); }; }, []);
  const mode: 'prompt' | 'ios' | null = standalone() ? null : deferred ? 'prompt' : isIOS() ? 'ios' : null;
  const install = async () => {
    if (!deferred) return false;
    const e = deferred;
    await e.prompt();
    const { outcome } = await e.userChoice;
    deferred = null; notify();
    return outcome === 'accepted';
  };
  return { mode, install };
}
