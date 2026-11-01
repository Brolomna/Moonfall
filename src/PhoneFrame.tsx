import React, { useEffect, useState } from 'react';
import { useBannerHeight } from './Supporters';

/** The designs are drawn on a 390×844 phone. Scale that to fit any phone, and stretch the
 *  height so taller phones are filled edge to edge (children get the logical height). */
export function PhoneFrame({ children }: { children: (frameH: number) => React.ReactNode }) {
  const read = () => ({
    w: window.visualViewport?.width ?? window.innerWidth,
    h: window.visualViewport?.height ?? window.innerHeight,
  });
  const [vp, setVp] = useState(read);
  useEffect(() => {
    const on = () => setVp(read());
    window.addEventListener('resize', on);
    window.visualViewport?.addEventListener('resize', on);
    return () => {
      window.removeEventListener('resize', on);
      window.visualViewport?.removeEventListener('resize', on);
    };
  }, []);
  const banner = useBannerHeight(); // the supporters' strip takes the bottom of the window, so nothing sits under it
  const h = vp.h - banner;
  const scale = Math.min(vp.w / 390, h / 844, 1.4);
  const frameH = Math.max(844, Math.floor(h / scale));
  return (
    <div className="frame-outer" style={banner ? { bottom: banner } : undefined}>
      <div className="frame-inner" style={{ width: 390, height: frameH, transform: `translateX(-50%) scale(${scale})`, transformOrigin: 'top center' }}>
        {children(frameH)}
      </div>
    </div>
  );
}
