// How each role works at night in the host's wake-up guide: what the host records, when the role is called,
// and in what order. Keyed by the role's name in ./roleLibrary.ts (built-in roles by their library name).
// The effects themselves are applied in HostView (the picker shows answers; dawn applies kills / saves /
// role changes). Roles not listed here keep the generic "who did they choose?" step.
//
//   kind  — what the step asks for (see HostView actSpec)
//   prio  — order in the night: 0 first-night setup · 10 wolves · 20 blockers · 30 killers · 40 protectors ·
//           50 information · 60 Witch · 70 day effects · 80 watchers
//   when  — 'first' (night 1 only), 'even' (every other night), 'third' (night 3 only), 'dead' (only after the
//           role's player has died), otherwise every night
//   once  — the power works once per game; afterwards the role is still called for show

export type Mech = { kind: string; prio: number; when?: 'first' | 'even' | 'third' | 'dead'; once?: boolean; ask?: string };

export const MECH: Record<string, Mech> = {
  // first night: setup and swaps (cards change on the phones right away)
  'Doppelgänger': { kind: 'copy', prio: 0, when: 'first' },
  'Cupid': { kind: 'lovers', prio: 1, when: 'first' },
  'Robber': { kind: 'rob', prio: 2, when: 'first', ask: 'Whom did the Robber rob? They swap roles.' },
  'Troublemaker': { kind: 'swap', prio: 3, when: 'first', ask: 'Which two players does the Troublemaker swap?' },
  'Mimic': { kind: 'mimic', prio: 4, when: 'first', ask: 'Whose power does the Mimic copy?' },
  'Executioner': { kind: 'target', prio: 5, when: 'first', ask: 'Choose the Executioner’s target and show it to them.' },
  'Lawyer': { kind: 'client', prio: 6, when: 'first', ask: 'Choose the Lawyer’s client and show it to them.' },
  'Drunk': { kind: 'drunk', prio: 7, when: 'third', ask: 'Hand the Drunk their real role:' },
  // the pack
  'Werewolf': { kind: 'kill', prio: 10 },
  'Minion': { kind: 'none', prio: 11, when: 'first' },
  'Mason': { kind: 'none', prio: 12, when: 'first' },
  // powers that stop other powers tonight — before anyone else acts
  'Nightmare Wolf': { kind: 'block', prio: 20, ask: 'Whose power fails tonight?' },
  'Bartender': { kind: 'block', prio: 21, ask: 'Who gets the drink? Their power fails tonight.' },
  'Illusionist': { kind: 'disguise', prio: 22, ask: 'Whom does the Illusionist disguise? Checks on them show the opposite tonight.' },
  // other killers
  'Serial Killer': { kind: 'slay', prio: 30, ask: 'Whom does the Serial Killer eliminate?' },
  'White Werewolf': { kind: 'whitewolf', prio: 31, when: 'even', ask: 'Does the White Werewolf eliminate a werewolf? (optional)' },
  'Arsonist': { kind: 'arson', prio: 32, ask: 'Whom does the Arsonist douse — or does he set them all alight?' },
  'Vampire': { kind: 'bite', prio: 33, ask: 'Whom do the vampires bite? They become a vampire at dawn.' },
  'Vengeful Spirit': { kind: 'vengeance', prio: 34, when: 'dead', once: true, ask: 'Whom does the Vengeful Spirit take revenge on?' },
  // protectors
  'Bodyguard': { kind: 'guard', prio: 40 },
  'Healer': { kind: 'protect', prio: 41 },
  'Priest': { kind: 'bless', prio: 42, once: true, ask: 'Whom does the Priest bless? They survive the next time they would die.' },
  // information
  'Seer': { kind: 'check', prio: 50 },
  'Sorcerer': { kind: 'seek', prio: 51 },
  'Aura Seer': { kind: 'aura', prio: 52, ask: 'Whose aura does the Aura Seer read?' },
  'Fortune Teller': { kind: 'fortune', prio: 53, once: true, ask: 'Whose exact role does the Fortune Teller see?' },
  'Investigator': { kind: 'investigate', prio: 54, ask: 'Whom does the Investigator investigate?' },
  'Medium': { kind: 'medium', prio: 55, ask: 'Which dead player does the Medium ask about?' },
  'Spy': { kind: 'spy', prio: 56 },
  'Revealer': { kind: 'reveal', prio: 57, once: true, ask: 'Whom does the Revealer point at? A wolf dies — otherwise the Revealer does.' },
  'Vampire Hunter': { kind: 'vhunt', prio: 58, ask: 'Whom does the Vampire Hunter point at? A vampire dies.' },
  'Necromancer': { kind: 'raise', prio: 59, once: true, ask: 'Which dead player does the Necromancer raise?' },
  'Witch': { kind: 'witch', prio: 60 },
  // effects on the coming day
  'Old Hag': { kind: 'banish', prio: 70 },
  'Spellcaster': { kind: 'silence', prio: 71, ask: 'Whom does the Spellcaster silence for tomorrow?' },
  'Blackmailer': { kind: 'silence', prio: 72, ask: 'Who must stay silent tomorrow?' },
  'Hypnotist': { kind: 'hypnotize', prio: 73, ask: 'Whom does the Hypnotist control in tomorrow’s vote?' },
  'Fallen Angel': { kind: 'curse', prio: 74, ask: 'Whom does the Fallen Angel curse? They can’t vote tomorrow.' },
  'Devil': { kind: 'deal', prio: 75, ask: 'Whom does the Devil make a deal with?' },
  'Death': { kind: 'mark', prio: 76, ask: 'Whom does Death mark?' },
  'Gambler': { kind: 'gamble', prio: 77, ask: 'Whom does the Gambler bet the wolves attacked?' },
  // watchers go last so they see everything that happened tonight
  'Tracker': { kind: 'track', prio: 80, ask: 'Whom does the Tracker follow?' },
  'Watcher': { kind: 'watch', prio: 81, ask: 'Whom does the Watcher watch?' },
  'Insomniac': { kind: 'insomniac', prio: 82 },
};

/** Roles that matter during the day: shown under "Remember during the vote" while their player is alive. */
export const DAY_REMINDERS: Record<string, string> = {
  'Judge': 'once per game may secretly call for a second vote right after a vote.',
  'King': 'once per game may cancel the vote before anyone is eliminated.',
  'Pacifist': 'can never vote to eliminate anyone.',
  'Elder': 'survives the first wolf attack.',
  'Angel': 'wins alone if eliminated today (first day only).',
  'Executioner': 'wins if their target is voted out.',
  'Wolf King': 'if eliminated, takes one player down with them.',
};
