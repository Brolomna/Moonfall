// @ts-nocheck
// The face of a role card (the side a player sees when they peek), shared by the player's phone and the host's
// "Preview card" in the role editor. `v` carries rc (from roleCardLook + the role's text), T.yourRole, fD / fI fonts,
// and the optional tip and loverText lines.
import React from 'react';
import './RoleCard.css';

/** Roles with their own card decoration; every other role uses the generic one. */
export const CARD_MOTIF = { werewolf: 'wolf', seer: 'seer', healer: 'healer', witch: 'witch', hunter: 'hunter', villager: 'village' };

/** Motto and card tint of the built-in roles, as PlayerView's core() draws them (for the host's preview). */
export const CORE_CARD = {
  werewolf: { motto: 'Hunt by moonlight', tint: '#3a0d1a' }, seer: { motto: 'Nothing hides from you', tint: '#0f2144' },
  healer: { motto: 'Not on my watch', tint: '#0b2e24' }, witch: { motto: 'Two potions, one chance', tint: '#2a1146' },
  hunter: { motto: 'One last arrow', tint: '#33190a' }, villager: { motto: 'Wits are your weapon', tint: '#2a2112' },
  cupid: { motto: 'Love is a weapon too', tint: '#3a1228' },
};

/** Card colours, sizes and team line for a role R ({ name, team, rgb, desc, tint? }). T needs onYourOwn / teamWolves / teamVillage. */
export function roleCardLook(R, motif, T, cjk) {
  const len = R.name.length * (cjk ? 2 : 1);
  return {
    upper: R.name.toUpperCase(),
    tint: R.tint || ('rgb(' + R.rgb.split(',').map((c, i) => Math.round(+c * 0.22 + [18, 10, 31][i] * 0.78)).join(',') + ')'),
    nameSize: len > 12 ? '26px' : (len > 8 ? '30px' : '38px'),
    descSize: R.desc.length > 150 ? '13.5px' : '14.5px',
    teamLabel: R.team === 'Loner' ? T.onYourOwn : (R.team === 'Werewolves' ? T.teamWolves : T.teamVillage),
    edge: 'rgba(' + R.rgb + ',.55)', frame: 'rgba(' + R.rgb + ',.28)', halo: 'rgba(' + R.rgb + ',.22)',
    isWolf: motif === 'wolf', isSeer: motif === 'seer', isHealer: motif === 'healer',
    isWitch: motif === 'witch', isHunter: motif === 'hunter', isVillager: motif === 'village', isCustom: motif === 'generic',
  };
}

/** front: draw it facing the viewer (the player's card sits on the back of a flipping card, so it is turned by default). */
export function RoleCardFace({ v, front = false }) {
  return (
      <div className="face" style={{ position: 'absolute', inset: '0', transform: front ? 'none' : 'rotateY(180deg)', borderRadius: '26px', overflow: 'hidden', background: `linear-gradient(170deg, ${v.rc.tint} 0%, #120a1f 62%, #0b0614 100%)`, border: `1px solid ${v.rc.edge}`, boxShadow: `0 30px 80px rgba(0,0,0,.6), 0 0 70px ${v.rc.halo}` }}>
        {(v.rc.img) ? (
          <>
            {/* NET: the host's own picture for a hand-made role fills the whole card; a dark wash under the text keeps it readable */}
            <img src={v.rc.img} alt={v.rc.name} draggable={false} style={{ position: 'absolute', inset: '0', width: '100%', height: '100%', objectFit: 'cover' }} />
            <div aria-hidden="true" style={{ position: 'absolute', inset: '0', background: 'linear-gradient(180deg, rgba(8,4,16,.55) 0%, rgba(8,4,16,.08) 18%, rgba(8,4,16,.1) 34%, rgba(8,4,16,.72) 52%, rgba(8,4,16,.9) 70%, rgba(8,4,16,.94) 100%)' }} />
          </>
        ) : null}
        <div style={{ position: 'absolute', inset: '10px', borderRadius: '18px', border: `1px solid ${v.rc.frame}` }} />
        <span style={{ position: 'absolute', top: '6px', left: '6px', width: '8px', height: '8px', transform: 'rotate(45deg)', background: v.rc.color }} />
        <span style={{ position: 'absolute', top: '6px', right: '6px', width: '8px', height: '8px', transform: 'rotate(45deg)', background: v.rc.color }} />
        <span style={{ position: 'absolute', bottom: '6px', left: '6px', width: '8px', height: '8px', transform: 'rotate(45deg)', background: v.rc.color }} />
        <span style={{ position: 'absolute', bottom: '6px', right: '6px', width: '8px', height: '8px', transform: 'rotate(45deg)', background: v.rc.color }} />
        {(v.rc.isWolf) ? (
          <>
            <svg width="326" height="520" viewBox="0 0 326 520" style={{ position: 'absolute', inset: '0' }} aria-hidden="true">
              <g fill="#e0475f" opacity=".22">
                <path d="M228 30c22 52 26 112 4 178c10-64 4-122-12-176z" />
                <path d="M256 26c24 54 28 116 6 182c10-66 4-126-14-180z" />
                <path d="M284 34c20 48 22 104 2 164c8-58 4-112-10-162z" />
              </g>
              <g fill="#e0475f" opacity=".1">
                <path d="M34 330c18 44 20 92 2 142c8-50 4-98-10-140z" />
                <path d="M58 326c18 46 20 96 2 148c8-52 4-102-10-146z" />
              </g>
            </svg>
          </>
        ) : null}
        {(v.rc.isSeer) ? (
          <>
            <svg width="326" height="520" viewBox="0 0 326 520" style={{ position: 'absolute', inset: '0' }} aria-hidden="true">
              <g fill="none" stroke="#7fb2ff">
                <circle cx="163" cy="146" r="84" opacity=".22" />
                <circle cx="163" cy="146" r="110" opacity=".14" strokeDasharray="1 7" />
                <circle cx="163" cy="146" r="140" opacity=".1" />
                <circle cx="163" cy="146" r="176" opacity=".07" strokeDasharray="3 9" />
              </g>
              <g fill="#cfe1ff" opacity=".6">
                <circle cx="48" cy="60" r="1.3" />
                <circle cx="282" cy="72" r="1" />
                <circle cx="60" cy="230" r="1" />
                <circle cx="276" cy="246" r="1.4" />
                <circle cx="40" cy="450" r="1" />
                <circle cx="290" cy="460" r="1" />
              </g>
            </svg>
          </>
        ) : null}
        {(v.rc.isHealer) ? (
          <>
            <svg width="326" height="520" viewBox="0 0 326 520" style={{ position: 'absolute', inset: '0' }} aria-hidden="true">
              <g stroke="#62d4a6" strokeWidth="1" opacity=".22">
                <path d="M163 12v58 M163 222v58" />
                <path d="M163 12v58 M163 222v58" transform="rotate(30 163 146)" />
                <path d="M163 12v58 M163 222v58" transform="rotate(60 163 146)" />
                <path d="M163 12v58 M163 222v58" transform="rotate(90 163 146)" />
                <path d="M163 12v58 M163 222v58" transform="rotate(120 163 146)" />
                <path d="M163 12v58 M163 222v58" transform="rotate(150 163 146)" />
              </g>
              <path d="M20 512c30-40 40-70 30-110 M306 512c-30-40-40-70-30-110" fill="none" stroke="#62d4a6" opacity=".16" />
              <g fill="#62d4a6" opacity=".16">
                <path d="M44 434c-14-4-20-14-18-24 12 2 20 10 18 24z" />
                <path d="M282 434c14-4 20-14 18-24-12 2-20 10-18 24z" />
                <path d="M50 462c-14 0-22-8-22-18 12 0 22 6 22 18z" />
                <path d="M276 462c14 0 22-8 22-18-12 0-22 6-22 18z" />
              </g>
            </svg>
          </>
        ) : null}
        {(v.rc.isWitch) ? (
          <>
            <svg width="326" height="520" viewBox="0 0 326 520" style={{ position: 'absolute', inset: '0' }} aria-hidden="true">
              <g fill="none" stroke="#c98bf2" strokeLinecap="round">
                <path d="M30 512c30-50-20-80 10-130s-10-90 30-130" opacity=".2" strokeWidth="1.4" />
                <path d="M296 512c-30-50 20-80-10-130s10-90-30-130" opacity=".2" strokeWidth="1.4" />
                <path d="M60 512c20-40-10-60 10-100" opacity=".12" />
                <path d="M266 512c-20-40 10-60-10-100" opacity=".12" />
                <circle cx="78" cy="70" r="6" opacity=".25" />
                <circle cx="250" cy="52" r="4" opacity=".25" />
                <circle cx="262" cy="96" r="8" opacity=".15" />
              </g>
            </svg>
          </>
        ) : null}
        {(v.rc.isHunter) ? (
          <>
            <svg width="326" height="520" viewBox="0 0 326 520" style={{ position: 'absolute', inset: '0' }} aria-hidden="true">
              <g fill="none" stroke="#f2a65a">
                <circle cx="163" cy="146" r="96" opacity=".24" />
                <circle cx="163" cy="146" r="128" opacity=".1" />
                <path d="M163 26v40 M163 226v40 M43 146h40 M243 146h40" opacity=".35" strokeWidth="1.2" />
                <path d="M66 49l14 14 M260 49l-14 14 M66 243l14-14 M260 243l-14-14" opacity=".2" />
              </g>
              <path d="M24 490L120 394 M112 394h8v8" fill="none" stroke="#f2a65a" opacity=".16" strokeWidth="1.2" />
            </svg>
          </>
        ) : null}
        {(v.rc.isVillager) ? (
          <>
            <svg width="326" height="520" viewBox="0 0 326 520" style={{ position: 'absolute', inset: '0' }} aria-hidden="true">
              <path d="M10 510V472h26v-18l22-20 22 20v38h22v-30l30-26 30 26v30h20V462l24-22 24 22v12h24v-16l20-18 20 18v52" fill="none" stroke="#e8d3a0" opacity=".2" strokeWidth="1.2" />
              <g fill="#f2c96a" opacity=".35">
                <rect x="52" y="462" width="6" height="8" />
                <rect x="126" y="462" width="7" height="9" />
                <rect x="201" y="458" width="6" height="8" />
              </g>
              <circle cx="163" cy="146" r="100" fill="none" stroke="#e8d3a0" opacity=".1" />
            </svg>
          </>
        ) : null}
        {(v.rc.isCustom && !v.rc.img) ? (
          <>
            <svg width="326" height="520" viewBox="0 0 326 520" style={{ position: 'absolute', inset: '0' }} aria-hidden="true">
              <g fill="none" stroke={v.rc.color}>
                <circle cx="163" cy="146" r="92" opacity=".2" />
                <circle cx="163" cy="146" r="124" opacity=".1" strokeDasharray="2 8" />
              </g>
              <g fill={v.rc.color} opacity=".35">
                <path d="M60 70l2 5 5 2-5 2-2 5-2-5-5-2 5-2z" />
                <path d="M270 110l1.5 4 4 1.5-4 1.5-1.5 4-1.5-4-4-1.5 4-1.5z" />
                <path d="M50 440l2 5 5 2-5 2-2 5-2-5-5-2 5-2z" />
                <path d="M276 470l1.5 4 4 1.5-4 1.5-1.5 4-1.5-4-4-1.5 4-1.5z" />
              </g>
            </svg>
          </>
        ) : null}
        <div style={{ position: 'absolute', inset: '0', padding: '30px 28px 26px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '11px', letterSpacing: '.16em', textTransform: 'uppercase', fontWeight: '700', color: v.rc.color }}>
              {v.rc.teamLabel}
            </span>
            <span style={{ fontSize: '11px', letterSpacing: '.12em', textTransform: 'uppercase', fontWeight: '700', color: '#a99bc2' }}>
              {v.T.yourRole}
            </span>
          </div>
          {(v.rc.img) ? (
            // the picture is the card's background: leave its top part clear
            <div style={{ flex: '1', minHeight: '40px' }} />
          ) : (
            <div className="shimmer" style={{ marginTop: '18px', width: '116px', height: '116px', flex: 'none', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${v.rc.edge}`, background: `radial-gradient(circle, ${v.rc.halo} 0%, rgba(0,0,0,0) 70%)`, boxShadow: `0 0 60px ${v.rc.halo}, inset 0 0 30px ${v.rc.halo}` }}>
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke={v.rc.color} strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round">
                <path d={v.rc.icon} />
              </svg>
            </div>
          )}
          <span style={{ marginTop: '16px', fontFamily: v.fD, fontWeight: '700', fontSize: v.rc.nameSize, lineHeight: '1.15', letterSpacing: '.06em', marginRight: '-.06em', color: '#f6f1ff', textShadow: v.rc.img ? '0 2px 12px rgba(0,0,0,.9)' : undefined }}>
            {v.rc.upper}
          </span>
          <span style={{ marginTop: '2px', fontFamily: v.fI, fontStyle: 'italic', fontSize: '19px', color: v.rc.color, textShadow: v.rc.img ? '0 1px 8px rgba(0,0,0,.9)' : undefined }}>
            {v.rc.motto}
          </span>
          <div style={{ margin: '12px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ width: '44px', height: '1px', background: v.rc.frame }} />
            <span style={{ width: '6px', height: '6px', transform: 'rotate(45deg)', border: `1px solid ${v.rc.color}` }} />
            <span style={{ width: '44px', height: '1px', background: v.rc.frame }} />
          </div>
          <p style={{ margin: '0', fontSize: v.rc.descSize, lineHeight: '1.5', color: v.rc.img ? '#f2ecfa' : '#e0d8ee', textShadow: v.rc.img ? '0 1px 6px rgba(0,0,0,.95)' : undefined }}>
            {v.rc.desc}
          </p>
          {(v.tip) ? (
            <span style={{ display: 'flex', alignItems: 'flex-start', gap: '7px', marginTop: '10px', padding: '8px 10px', borderRadius: '12px', background: 'rgba(255,255,255,.05)', border: '1px dashed rgba(236,230,246,.18)', fontSize: '12.5px', lineHeight: '1.45', color: '#d8cfe8', textAlign: 'left' }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#f2d06b" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ flex: 'none', marginTop: '1px' }}>
                <path d="M9 18h6 M10 21h4 M12 3a6 6 0 0 0-3.6 10.8c.7.6 1.1 1.4 1.1 2.2h5c0-.8.4-1.6 1.1-2.2A6 6 0 0 0 12 3z" />
              </svg>
              <span>
                {v.tip}
              </span>
            </span>
          ) : null}
          <div style={{ flex: v.rc.img ? '0 0 12px' : '1' }} />
          {(v.loverText) ? (
            <span className="heartbeat" style={{ alignSelf: 'center', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px', padding: '6px 14px', borderRadius: '999px', fontSize: '13.5px', fontWeight: '700', color: '#ffd6e6', background: 'rgba(240,143,184,.18)', border: '1px solid rgba(240,143,184,.55)' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#f08fb8" stroke="none">
                <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" />
              </svg>
              {v.loverText}
            </span>
          ) : null}
          <span style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', borderRadius: '14px', fontSize: '13px', fontWeight: '600', color: '#ece6f6', background: 'rgba(0,0,0,.32)', border: `1px solid ${v.rc.frame}` }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={v.rc.color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ flex: 'none' }}>
              <path d="M4 21V4 M4 4h12l-2 4 2 4H4" />
            </svg>
            {' '}{v.rc.goal}
          </span>
        </div>
      </div>
  );
}
