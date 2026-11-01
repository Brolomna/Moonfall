// @ts-nocheck
// What a hand-made role actually does in the game. These settings drive the host's night guide (when the role
// wakes, whom it may pick and how many), the dawn (kills, protection, immunity, groups), every investigation
// (what checks see, whether Watcher / Tracker notice its visits) and the win check — they are not just labels.
import React from 'react';

export type Ability = {
  wake: false | 'first' | 'every' | 'even' | 'wolves';
  action: 'none' | 'choose' | 'kill' | 'protect' | 'checkWolf' | 'checkRole' | 'block' | 'recruit' | 'mark';
  count: number; upTo: boolean; self: boolean; repeat: boolean; once: boolean;
  immune: 'none' | 'wolves' | 'night';
  seenAs: 'real' | 'villager' | 'werewolf';
  stealth: boolean;
  win: 'team' | 'survive' | 'group' | 'lastTwo' | 'votedOut';
  group: string;
};

export const DEFAULT_ABILITY: Ability = { wake: 'every', action: 'choose', count: 1, upTo: true, self: false, repeat: true, once: false, immune: 'none', seenAs: 'real', stealth: false, win: 'team', group: '' };

/** A stored ability with every field filled in (older roles have none). */
export const fullAbility = (ab) => ({ ...DEFAULT_ABILITY, ...(ab || {}) });

const WAKE = [[false, 'Never'], ['first', 'First night'], ['every', 'Every night'], ['even', 'Every other night'], ['wolves', 'With the wolves']];
const ACTION = [['choose', 'Just picks'], ['kill', 'Kills'], ['protect', 'Protects'], ['checkWolf', 'Checks: wolf?'], ['checkRole', 'Sees the role'], ['block', 'Blocks a power'], ['recruit', 'Recruits to a group'], ['mark', 'Marks, then ignites'], ['none', 'Nothing']];
const IMMUNE = [['none', 'No'], ['wolves', 'To wolf attacks'], ['night', 'To every night kill']];
const SEEN = [['real', 'As they are'], ['villager', 'As a Villager'], ['werewolf', 'As a Werewolf']];
const WIN = [['team', 'With their side'], ['survive', 'Also if alive at the end'], ['group', 'When everyone alive is in the group'], ['lastTwo', 'Alone, among the last two'], ['votedOut', 'Alone, if voted out']];

/** One line for the host about what the settings do (shown under the editor and in the night guide). */
export function abilityText(ab0) {
  const ab = fullAbility(ab0);
  const n = ab.count > 1 ? (ab.upTo ? 'up to ' : '') + ab.count + ' players' : (ab.upTo ? 'a player (or no one)' : 'a player');
  const what = { none: 'Wakes only to be seen', choose: 'Picks ' + n, kill: 'Kills ' + n, protect: 'Protects ' + n + ' from death tonight', checkWolf: 'Checks ' + n + ' — is it a werewolf?', checkRole: 'Sees the exact role of ' + n, block: 'Blocks the power of ' + n + ' tonight', recruit: 'Brings ' + n + ' into the ' + (ab.group || 'group'), mark: 'Marks ' + n + ' (' + (ab.group || 'marked') + ') — or ignites everyone marked' }[ab.action];
  return [ab.wake ? what + (ab.once ? ', once per game' : '') : 'Never wakes',
    ab.immune !== 'none' ? (ab.immune === 'wolves' ? 'wolves can’t kill them' : 'nothing kills them at night') : '',
    ab.seenAs !== 'real' ? 'checks see a ' + (ab.seenAs === 'villager' ? 'Villager' : 'Werewolf') : '',
    ab.stealth ? 'Watcher and Tracker never see their visits' : '',
    { team: '', survive: 'also wins if alive at the end', group: 'wins once everyone alive is in the ' + (ab.group || 'group'), lastTwo: 'wins alone among the last two (the village can’t win while they live)', votedOut: 'wins alone if voted out' }[ab.win],
  ].filter(Boolean).join(' · ') + '.';
}

const chip = (on) => ({ height: '34px', padding: '0 10px', borderRadius: '10px', border: `1px solid ${on ? 'rgba(199,168,255,.7)' : 'rgba(236,230,246,.12)'}`, background: on ? 'rgba(167,127,240,.28)' : 'rgba(255,255,255,.04)', color: on ? '#f6f1ff' : '#c4b8da', fontSize: '12.5px', fontWeight: 700 });

function Row({ label, hint, opts, value, set }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <span style={{ fontSize: '13px', fontWeight: 700, color: '#ece6f6' }}>{label}{hint ? <span style={{ fontWeight: 500, color: '#a99bc2' }}> · {hint}</span> : null}</span>
      <div role="group" aria-label={label} style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
        {opts.map(([v, l]) => <button key={String(v)} type="button" className="press" aria-pressed={value === v} onClick={() => set(v)} style={chip(value === v)}>{l}</button>)}
      </div>
    </div>
  );
}

function Toggle({ label, on, set }) {
  return <button type="button" className="press" aria-pressed={on} onClick={() => set(!on)} style={{ ...chip(on), display: 'flex', alignItems: 'center', gap: '6px' }}>{on ? '✓' : '○'} {label}</button>;
}

export function AbilityEditor({ ab: ab0, team, onChange }) {
  const on = !!ab0;
  const ab = fullAbility(ab0);
  const set = (k) => (v) => onChange({ ...ab, [k]: v });
  const picks = ab.wake && ['none'].indexOf(ab.action) < 0;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '14px', borderRadius: '18px', background: 'rgba(10,6,18,.5)', border: `1px solid ${on ? 'rgba(199,168,255,.4)' : 'rgba(236,230,246,.1)'}` }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
        <span style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <span style={{ fontSize: '14px', fontWeight: 700 }}>How it plays</span>
          <span style={{ fontSize: '12.5px', color: '#a99bc2' }}>{on ? 'The night guide, dawn and win check follow these.' : 'Off: the host just records whom they pick.'}</span>
        </span>
        <button type="button" className="press" aria-pressed={on} onClick={() => onChange(on ? null : { ...DEFAULT_ABILITY, ...(team === 'Loner' ? { win: 'lastTwo' } : {}) })} style={chip(on)}>{on ? 'On' : 'Set up'}</button>
      </div>
      {on ? (
        <>
          <Row label="Wakes up" opts={WAKE} value={ab.wake} set={set('wake')} />
          {ab.wake ? <Row label="At night it" opts={ACTION} value={ab.action} set={set('action')} /> : null}
          {picks ? (
            <>
              <Row label="Targets" opts={[[1, '1'], [2, '2'], [3, '3']]} value={ab.count} set={set('count')} />
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                <Toggle label={ab.count > 1 ? 'Up to that many (may skip)' : 'May skip'} on={ab.upTo} set={set('upTo')} />
                <Toggle label="May pick themselves" on={ab.self} set={set('self')} />
                <Toggle label="Same player again on later nights" on={ab.repeat} set={set('repeat')} />
                <Toggle label="Once per game" on={ab.once} set={set('once')} />
              </div>
            </>
          ) : null}
          {(ab.action === 'recruit' || ab.action === 'mark' || ab.win === 'group') ? (
            <label style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '13px', fontWeight: 700 }}>
              Group name <span style={{ fontWeight: 500, color: '#a99bc2' }}>· remembered all game (like the cult, or the Arsonist’s doused players)</span>
              <input value={ab.group} maxLength={24} placeholder="e.g. Cult" onChange={e => set('group')(e.target.value)} style={{ height: '40px', padding: '0 12px', borderRadius: '12px', border: '1px solid rgba(236,230,246,.16)', background: 'rgba(10,6,18,.6)', color: '#ece6f6', fontSize: '14px' }} />
            </label>
          ) : null}
          <Row label="Immune" opts={IMMUNE} value={ab.immune} set={set('immune')} />
          <Row label="Checks see them" hint="Seer, Fortune Teller, Investigator…" opts={SEEN} value={ab.seenAs} set={set('seenAs')} />
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            <Toggle label="Hidden from Watcher & Tracker" on={ab.stealth} set={set('stealth')} />
          </div>
          <Row label="Wins" opts={WIN} value={ab.win} set={set('win')} />
          <span style={{ fontSize: '12.5px', lineHeight: 1.45, color: '#c7a8ff' }}>{abilityText(ab)}</span>
        </>
      ) : null}
    </div>
  );
}
