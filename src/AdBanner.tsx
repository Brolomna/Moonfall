import { useEffect, useRef, useState } from 'react';

/** Ad settings from the server (/api/ads). Empty until AdSense is set up on the host. */
export function useAds() {
  const [ads, setAds] = useState<{ client?: string; slot?: string }>({});
  useEffect(() => {
    fetch('/api/ads').then(r => r.json()).then(setAds).catch(() => { /* no ads */ });
  }, []);
  return ads.client && ads.slot ? (ads as { client: string; slot: string }) : null;
}

export const AD_STRIP = 60; // px kept free at the bottom of the screen for the banner

/** A standard 320×50 mobile banner in its own strip at the bottom — outside the scaled game screen,
 *  so the ad is shown at its real size and never covers the cards. */
export function AdBanner({ client, slot }: { client: string; slot: string }) {
  const pushed = useRef(false);
  useEffect(() => {
    if (!document.querySelector('script[data-adsense]')) {
      const s = document.createElement('script');
      s.async = true;
      s.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(client)}`;
      s.crossOrigin = 'anonymous';
      s.dataset.adsense = '1';
      document.head.appendChild(s);
    }
    if (!pushed.current) {
      pushed.current = true;
      try { ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({}); } catch { /* blocked */ }
    }
  }, [client]);
  return (
    <div className="ad-strip" style={{ height: AD_STRIP }}>
      <ins className="adsbygoogle" style={{ display: 'inline-block', width: 320, height: 50 }} data-ad-client={client} data-ad-slot={slot} />
    </div>
  );
}
