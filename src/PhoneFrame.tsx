import React, { useEffect, useState } from 'react';

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
  const scale = Math.min(vp.w / 390, vp.h / 844, 1.4);
  const frameH = Math.max(844, Math.floor(vp.h / scale));
  return (
    <div className="frame-outer">
      <div className="frame-inner" style={{ width: 390, height: frameH, transform: `translateX(-50%) scale(${scale})`, transformOrigin: 'top center' }}>
        {children(frameH)}
      </div>
    </div>
  );
}
