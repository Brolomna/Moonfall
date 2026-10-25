import React from 'react';

/** A short animated "<name> died" on every phone when someone dies — never who or what killed them.
 *  Keyed by the notice id so each death plays the animation again; it fades out by itself (styles in global.css). */
export function DeathNotice({ id, text, kicker, fixed }: { id: number | string; text: string; kicker?: string; fixed?: boolean }) {
  return (
    <div key={id} className="death-notice" role="status" aria-live="polite" style={fixed ? { position: 'fixed', top: '84px', maxWidth: '350px', margin: '0 auto' } : undefined}>
      <span className="dn-candle" aria-hidden="true">🕯</span>
      {kicker ? <span className="dn-kick">{kicker}</span> : null}
      <span className="dn-name">{text}</span>
    </div>
  );
}
