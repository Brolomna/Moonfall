import { useEffect } from 'react';

// Keep the phone's screen on while a game is running: a locked phone drops its connection.
// Uses the Screen Wake Lock API where the browser has it (Chrome/Android, Safari 16.4+); does nothing elsewhere.
type Sentinel = { release: () => Promise<void>; addEventListener: (t: string, f: () => void) => void };

export function useWakeLock(active: boolean) {
  useEffect(() => {
    const wl = (navigator as unknown as { wakeLock?: { request: (t: 'screen') => Promise<Sentinel> } }).wakeLock;
    if (!active || !wl) return;
    let lock: Sentinel | null = null, live = true;
    const grab = () => {
      if (!live || lock || document.visibilityState !== 'visible') return;
      wl.request('screen').then(l => {
        if (!live) { l.release().catch(() => {}); return; }
        lock = l; l.addEventListener('release', () => { lock = null; });
      }).catch(() => { /* not allowed right now (battery saver, no user gesture yet) */ });
    };
    // the browser drops the lock whenever the page is hidden; take it again on return
    const onVis = () => grab();
    grab();
    document.addEventListener('visibilitychange', onVis);
    // some browsers only allow it after a tap
    document.addEventListener('pointerdown', grab);
    return () => {
      live = false;
      document.removeEventListener('visibilitychange', onVis);
      document.removeEventListener('pointerdown', grab);
      lock?.release().catch(() => {});
    };
  }, [active]);
}
