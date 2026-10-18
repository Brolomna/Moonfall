import { useEffect } from 'react';

// The Halloween theme (the host switches it on/off with the 🎃 button; every phone follows).
// A decoration layer over the whole app — cobwebs, bats, jack-o'-lanterns, an orange glow — that never takes taps,
// plus `html.halloween` for the CSS touches (role cards, buttons, sky). See src/global.css.

const WEB = 'M0 0L120 0M0 0L0 120M0 0L110 50M0 0L50 110M0 0L90 90 M0 22Q14 18 22 0 M0 48Q30 40 48 0 M0 76Q46 62 76 0 M0 104Q62 86 104 0';
const BAT = 'M0 6C4 0 9 1 12 6C14 3 16 2 18 4C20 2 22 3 24 6C27 1 32 0 36 6C31 5 28 8 27 12C25 10 22 10 21 12C19 9 17 9 15 12C14 10 11 10 9 12C8 8 5 5 0 6Z';

function Pumpkin({ size = 64 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
      <defs>
        <radialGradient id="hwPumpkin" cx="45%" cy="40%" r="60%"><stop offset="0" stopColor="#ffb347" /><stop offset=".7" stopColor="#e8650f" /><stop offset="1" stopColor="#a8400a" /></radialGradient>
        <radialGradient id="hwCandle" cx="50%" cy="55%" r="50%"><stop offset="0" stopColor="#fff3b0" /><stop offset="1" stopColor="#ffb020" /></radialGradient>
      </defs>
      <path d="M30 14c0-5 3-8 7-9l1 3c-3 1-4 3-4 6z" fill="#4a7a2a" />
      <ellipse cx="18" cy="38" rx="14" ry="19" fill="url(#hwPumpkin)" />
      <ellipse cx="46" cy="38" rx="14" ry="19" fill="url(#hwPumpkin)" />
      <ellipse cx="32" cy="38" rx="16" ry="21" fill="url(#hwPumpkin)" />
      <g className="hw-flicker" fill="url(#hwCandle)">
        <path d="M20 30l7 6h-9z" /><path d="M44 30l-7 6h9z" />
        <path d="M18 44c4 5 9 7 14 7s10-2 14-7l-4 1-3 3-3-3-4 3-4-3-3 3-3-3z" />
      </g>
    </svg>
  );
}

export function HalloweenLayer({ on }: { on: boolean }) {
  useEffect(() => {
    document.documentElement.classList.toggle('halloween', on);
    return () => document.documentElement.classList.remove('halloween');
  }, [on]);
  if (!on) return null;
  return (
    <div className="hw-layer" aria-hidden="true">
      <div className="hw-glow" />
      <svg className="hw-web hw-web-l" width="120" height="120" viewBox="0 0 120 120"><path d={WEB} fill="none" stroke="rgba(235,230,245,.55)" strokeWidth="1" /></svg>
      <svg className="hw-web hw-web-r" width="120" height="120" viewBox="0 0 120 120"><path d={WEB} fill="none" stroke="rgba(235,230,245,.55)" strokeWidth="1" /></svg>
      <div className="hw-spider"><span className="hw-thread" /><svg width="18" height="16" viewBox="0 0 18 16"><g stroke="#1a1020" strokeWidth="1.4" fill="none"><path d="M3 4L0 1M3 8H0M3 11L0 15M15 4l3-3M15 8h3M15 11l3 4" /></g><ellipse cx="9" cy="8" rx="5.5" ry="6" fill="#1a1020" /><circle cx="7.4" cy="6.5" r="1" fill="#ff8a2a" /><circle cx="10.6" cy="6.5" r="1" fill="#ff8a2a" /></svg></div>
      {[0, 1, 2, 3, 4].map(i => (
        <svg key={i} className={'hw-bat hw-bat-' + i} width="36" height="14" viewBox="0 0 36 14"><path d={BAT} fill="#160c1c" /></svg>
      ))}
      {/* a witch on her broom crosses the moon now and then */}
      <svg className="hw-witch" width="92" height="52" viewBox="0 0 92 52"><g fill="#120610">
        <path d="M2 40L60 30L62 34L4 44Z" /><path d="M58 28L80 20L84 24L80 30L86 34L80 38L62 36Z" />
        <path d="M30 34C28 26 30 18 36 14L34 6L44 12C50 12 54 18 52 26L50 34Z" /><path d="M30 8L40 0L42 10Z" /><path d="M24 12L48 10L46 14L26 16Z" />
        <path d="M44 22L58 18L58 21L46 25Z" /></g></svg>
      {/* eyes blinking in the dark */}
      <div className="hw-eyes hw-eyes-a"><span /><span /></div>
      <div className="hw-eyes hw-eyes-b"><span /><span /></div>
      {/* falling autumn leaves */}
      {[0, 1, 2, 3, 4, 5].map(i => (
        <svg key={'l' + i} className={'hw-leaf hw-leaf-' + i} width="16" height="16" viewBox="0 0 16 16"><path d="M8 0C10 4 16 5 12 9C14 12 11 14 8 16C5 14 2 12 4 9C0 5 6 4 8 0Z" fill={['#e8650f', '#c94a10', '#f2a03a', '#a83a0c', '#ff8a24', '#d9541a'][i]} /></svg>
      ))}
      <div className="hw-pumpkin hw-pumpkin-l"><Pumpkin size={38} /></div>
      <div className="hw-pumpkin hw-pumpkin-r"><Pumpkin size={30} /></div>
    </div>
  );
}
