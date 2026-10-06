// The role library: every role the host can turn on from "Browse role library", and the names
// "Create a role" / "Edit role" auto-fill from. Hand-written (not generated from the design).
//
//   cat      — library tab: Village | Werewolf | Neutral | Special
//   team     — who they win with: Village | Werewolves | Loner
//   s        — strength: + helps the village, − helps the wolves (Villager +1, Werewolf −6, Seer +7)
//   icon     — a key from HostView.icons()
//   night    — wake-up in the host guide: 'every' night, 'first' night only, 'wolves' (wakes with the
//              pack, no step of its own) or false (never wakes)
//   wolf     — false for roles on the wolves' side that don't hunt or count as a werewolf
//   builtin  — key of the matching built-in role (turning it on just adds that role)
//   motto    — the short line under the name on the player's card (translations: ./i18n/roles.*.ts)

export type LibRole = {
  name: string; cat: 'Village' | 'Werewolf' | 'Neutral' | 'Special'; team: 'Village' | 'Werewolves' | 'Loner';
  s: number; icon: string; color: string; desc: string; motto?: string;
  night?: 'every' | 'first' | 'wolves' | false; wolf?: boolean; builtin?: string; aliases?: string[];
};

const C = {
  frost: '#8fd3e8', moon: '#7fb2ff', sky: '#a6c8ff', sage: '#62d4a6', mint: '#9fd6b8', gold: '#e8d3a0',
  sun: '#f2d06b', ember: '#f2a65a', coral: '#f29a7a', rose: '#f08fb8', violet: '#c98bf2', lilac: '#b8c4ff',
  lime: '#d8e08a', sand: '#d9b48a', blood: '#e0475f', red: '#ff6f61', wine: '#d14a7a', plum: '#b45cc7',
  ash: '#9aa7b8', smoke: '#a58ad6', bone: '#c9a27a',
};

export const ROLE_LIBRARY: LibRole[] = [
  // ---------- Village ----------
  { name: 'Villager', cat: 'Village', team: 'Village', s: 1, icon: 'star', color: C.gold, builtin: 'villager', desc: 'No special ability. Find the werewolves through discussion and voting.' },
  { name: 'Seer', cat: 'Village', team: 'Village', s: 7, icon: 'eye', color: C.moon, builtin: 'seer', desc: 'Each night, point at a player. The host shows you whether they are a werewolf.' },
  { name: 'Apprentice Seer', cat: 'Village', team: 'Village', s: 4, icon: 'eye', color: C.sky, builtin: 'apprentice', desc: 'If the Seer dies, you become the new Seer.' },
  { name: 'Aura Seer', motto: 'Every soul has a colour', cat: 'Village', team: 'Village', s: 3, icon: 'star', color: C.sky, night: 'every', aliases: ['psychic'], desc: 'Each night, point at a player. The host tells you if their aura is good, evil or neutral.' },
  { name: 'Medium', motto: 'The dead still whisper', cat: 'Village', team: 'Village', s: 2, icon: 'orb', color: C.lilac, night: 'every', aliases: ['gravedigger'], desc: 'Each night, point at a dead player. The host shows you their role.' },
  { name: 'Witch', cat: 'Village', team: 'Village', s: 4, icon: 'flask', color: C.violet, builtin: 'witch', aliases: ['alchemist'], desc: 'You have one potion to save the wolves’ victim and one poison to kill. Each works once.' },
  { name: 'Healer', cat: 'Village', team: 'Village', s: 5, icon: 'shield', color: C.sage, builtin: 'healer', aliases: ['doctor', 'herbalist'], desc: 'Each night, protect one player from the wolves.' },
  { name: 'Bodyguard', cat: 'Village', team: 'Village', s: 3, icon: 'shield', color: C.frost, builtin: 'bodyguard', aliases: ['martyr', 'guardian angel'], desc: 'Each night, guard one player. If the wolves attack them, you die in their place. You can’t guard yourself.' },
  { name: 'Hunter', cat: 'Village', team: 'Village', s: 3, icon: 'bow', color: C.ember, builtin: 'hunter', aliases: ['avenger'], desc: 'When you are eliminated, immediately take one player down with you.' },
  { name: 'Investigator', motto: 'Three names, one truth', cat: 'Village', team: 'Village', s: 3, icon: 'key', color: C.lilac, night: 'every', aliases: ['oracle', 'prophet'], desc: 'Each night, point at a player. The host names three roles — one of them is theirs.' },
  { name: 'Tracker', motto: 'Every step leaves a trace', cat: 'Village', team: 'Village', s: 3, icon: 'eye', color: C.mint, night: 'every', desc: 'Each night, follow a player. The host tells you who they visited tonight, if anyone.' },
  { name: 'Watcher', motto: 'Eyes on the door', cat: 'Village', team: 'Village', s: 3, icon: 'eye', color: C.mint, night: 'every', aliases: ['detective', 'snoop'], desc: 'Each night, watch a player. The host tells you who visited them tonight.' },
  { name: 'Priest', motto: 'A blessing in the dark', cat: 'Village', team: 'Village', s: 3, icon: 'cross', color: C.gold, night: 'every', aliases: ['cleric', 'blacksmith'], desc: 'Once per game, at night, bless one player. The first time they would be eliminated, they survive instead.' },
  { name: 'Mason', cat: 'Village', team: 'Village', s: 2, icon: 'key', color: C.sand, builtin: 'mason', desc: 'Masons wake on the first night and see each other.' },
  { name: 'Mayor', cat: 'Village', team: 'Village', s: 2, icon: 'crown', color: C.lilac, builtin: 'mayor', aliases: ['sheriff'], desc: 'Once you reveal your card, your vote counts twice.' },
  { name: 'Judge', motto: 'Order in the court', cat: 'Village', team: 'Village', s: 2, icon: 'crown', color: C.sun, aliases: ['politician'], desc: 'Once per game, after a vote, secretly signal the host to hold a second vote right away.' },
  { name: 'Prince', cat: 'Village', team: 'Village', s: 3, icon: 'crown', color: C.sun, builtin: 'prince', aliases: ['princess'], desc: 'If you are voted out, reveal your card — you survive and no one is eliminated.' },
  { name: 'Elder', motto: 'Too old to die easily', cat: 'Village', team: 'Village', s: 3, icon: 'shield', color: C.mint, aliases: ['queen'], desc: 'You survive the first werewolf attack on you. The second one kills you.' },
  { name: 'Little Girl', motto: 'Peeking is dangerous', cat: 'Village', team: 'Village', s: 3, icon: 'eye', color: C.rose, aliases: ['girl'], desc: 'When the werewolves wake, you may secretly peek through your fingers. If they catch you looking, they can choose you as their victim.' },
  { name: 'Hunter Apprentice', motto: 'The bow passes to you', cat: 'Village', team: 'Village', s: 2, icon: 'bow', color: C.coral, desc: 'If the Hunter dies, you become the new Hunter.' },
  { name: 'Pacifist', motto: 'No blood on your hands', cat: 'Village', team: 'Village', s: -1, icon: 'feather', color: C.sage, desc: 'You must always vote to keep players alive — you can never vote to eliminate anyone.' },
  { name: 'Fortune Teller', motto: 'The cards never lie', cat: 'Village', team: 'Village', s: 3, icon: 'orb', color: C.frost, aliases: ['fortune'], night: 'every', desc: 'Once per game, when the host wakes you at night, point at a player. The host shows you their exact role.' },
  { name: 'Baker', motto: 'No bread, no village', cat: 'Village', team: 'Village', s: 0, icon: 'star', color: C.gold, desc: 'While you live, the village is fed. Once you are eliminated, the village starves: every third day after, the host eliminates one more player.' },
  { name: 'Revealer', motto: 'All or nothing', cat: 'Village', team: 'Village', s: 4, icon: 'eye', color: C.ember, night: 'every', desc: 'Once per game, at night, point at a player. If they are a werewolf, they are revealed and eliminated. If not, you die instead.' },
  { name: 'Spy', motto: 'Know your enemy', cat: 'Village', team: 'Village', s: 5, icon: 'mask', color: C.lime, night: 'every', desc: 'After the werewolves choose, the host wakes you and points at one of them.' },
  { name: 'Robber', motto: 'What’s yours is mine', cat: 'Village', team: 'Village', s: 0, icon: 'key', color: C.bone, night: 'first', aliases: ['thief'], desc: 'On the first night, point at a player and swap roles with them. The host tells you both your new roles privately.' },
  { name: 'Troublemaker', motto: 'Stir the pot', cat: 'Village', team: 'Village', s: -3, icon: 'mask', color: C.ember, aliases: ['trouble maker'], night: 'first', desc: 'On the first night, point at two other players. The host privately swaps their roles — they learn their new role in the morning.' },
  { name: 'Drunk', motto: 'Who am I again?', cat: 'Village', team: 'Village', s: 3, icon: 'flask', color: C.gold, aliases: ['the drunk', 'drunkard'], desc: 'You play as a plain Villager until the third night, when the host secretly hands you your real role.' },
  { name: 'Insomniac', motto: 'You never really sleep', cat: 'Village', team: 'Village', s: 1, icon: 'moon', color: C.lilac, night: 'every', desc: 'At the end of each night, the host shows you whether your role has changed.' },
  { name: 'Mimic', motto: 'Borrowed power', cat: 'Village', team: 'Village', s: 1, icon: 'mask', color: C.ash, night: 'first', desc: 'On the first night, point at a player. You copy their power (not their team) for the rest of the game.' },
  { name: 'Doppelgänger', cat: 'Village', team: 'Loner', s: -2, icon: 'mask', color: C.ash, builtin: 'doppelganger', aliases: ['doppelganger', 'grave robber'], desc: 'On the first night, copy a player. If they die, you take their role.' },
  { name: 'Cursed', cat: 'Village', team: 'Village', s: -3, icon: 'mask', color: C.smoke, builtin: 'cursed', aliases: ['cursed villager'], desc: 'You are a villager — until the wolves attack you. Then you become a werewolf instead of dying.' },
  { name: 'Diseased', motto: 'Bite me and regret it', cat: 'Village', team: 'Village', s: 3, icon: 'flask', color: C.lime, aliases: ['disease', 'sick'], desc: 'If the werewolves eliminate you, they catch your sickness and cannot attack anyone the following night.' },
  { name: 'Lycan', cat: 'Village', team: 'Village', s: -1, icon: 'wolf', color: C.wine, builtin: 'lycan', desc: 'You are a villager, but the Seer sees you as a werewolf.' },
  { name: 'Tough Guy', cat: 'Village', team: 'Village', s: 3, icon: 'shield', color: C.coral, builtin: 'toughguy', desc: 'If the wolves attack you, you survive until the end of the next day.' },
  { name: 'Village Idiot', cat: 'Village', team: 'Village', s: 2, icon: 'mask', color: C.lime, builtin: 'idiot', desc: 'You must always vote to eliminate someone.' },
  { name: 'Old Hag', cat: 'Village', team: 'Village', s: 1, icon: 'moon', color: C.mint, builtin: 'oldhag', desc: 'Each night, banish one player from the next day — they can’t talk or vote.' },

  // ---------- Werewolf ----------
  { name: 'Werewolf', cat: 'Werewolf', team: 'Werewolves', s: -6, icon: 'wolf', color: C.blood, builtin: 'werewolf', desc: 'Each night, wake with the pack and choose a player to eliminate.' },
  { name: 'Alpha Werewolf', motto: 'Lead the pack', cat: 'Werewolf', team: 'Werewolves', s: -9, icon: 'wolf', color: C.blood, night: 'wolves', aliases: ['alpha wolf', 'alpha', 'black werewolf'], desc: 'You wake with the werewolves. Once per game, instead of eliminating the victim, you can turn them into a werewolf.' },
  { name: 'Wolf Cub', cat: 'Werewolf', team: 'Werewolves', s: -8, icon: 'wolf', color: C.red, builtin: 'wolfcub', aliases: ['fire wolf'], desc: 'You hunt with the pack. If you are killed, the wolves take two victims the next night.' },
  { name: 'White Werewolf', motto: 'A wolf among wolves', cat: 'Werewolf', team: 'Werewolves', s: -4, icon: 'wolf', color: C.gold, night: 'every', aliases: ['lone wolf'], desc: 'You hunt with the pack, but you win alone. Every other night, the host wakes you to eliminate a werewolf if you wish.' },
  { name: 'Wolf King', motto: 'Long live the king', cat: 'Werewolf', team: 'Werewolves', s: -7, icon: 'crown', color: C.blood, night: 'wolves', desc: 'You lead the pack. When you are eliminated, you take one player down with you.' },
  { name: 'Nightmare Wolf', motto: 'Sweet dreams are over', cat: 'Werewolf', team: 'Werewolves', s: -7, icon: 'moon', color: C.plum, night: 'every', aliases: ['ice wolf'], desc: 'You hunt with the pack. Each night, you may also choose a player whose power fails tonight.' },
  { name: 'Shadow Wolf', motto: 'Unseen, unknown', cat: 'Werewolf', team: 'Werewolves', s: -7, icon: 'moon', color: C.smoke, night: 'wolves', aliases: ['wolfman'], desc: 'You hunt with the pack, but every investigating role sees you as a plain Villager.' },
  { name: 'Omega Wolf', motto: 'The last is the fiercest', cat: 'Werewolf', team: 'Werewolves', s: -7, icon: 'wolf', color: C.ash, night: 'wolves', desc: 'You hunt with the pack. Once you are the last werewolf alive, you may take two victims each night.' },
  { name: 'Big Bad Wolf', motto: 'Huff, puff and feast', cat: 'Werewolf', team: 'Werewolves', s: -9, icon: 'wolf', color: C.red, night: 'wolves', aliases: ['big bad'], desc: 'You wake with the werewolves. While no werewolf has been eliminated, you also eliminate a player sitting next to the victim.' },
  { name: 'Sorcerer', cat: 'Werewolf', team: 'Werewolves', s: -3, icon: 'orb', color: C.plum, builtin: 'sorceress', aliases: ['sorceress'], desc: 'You help the wolves. Each night, point at a player — the host tells you if they are the Seer.' },
  { name: 'Minion', cat: 'Werewolf', team: 'Werewolves', s: -6, icon: 'dagger', color: C.wine, builtin: 'minion', desc: 'You know who the wolves are, but they don’t know you. You win with them.' },
  { name: 'Traitor', motto: 'Smile, then betray', cat: 'Werewolf', team: 'Werewolves', s: -4, icon: 'mask', color: C.wine, wolf: false, desc: 'You look like a villager to every check, but you win with the wolves. You don’t know who they are.' },

  // ---------- Neutral ----------
  { name: 'Tanner', cat: 'Neutral', team: 'Loner', s: -2, icon: 'skull', color: C.bone, builtin: 'tanner', aliases: ['fool', 'jester'], desc: 'You hate your job. You win only if the village votes you out.' },
  { name: 'Serial Killer', motto: 'Nobody leaves alive', cat: 'Neutral', team: 'Loner', s: -6, icon: 'dagger', color: C.blood, night: 'every', aliases: ['demon', 'grim reaper'], desc: 'Each night, eliminate one player. The wolves can’t kill you. You win if you are the last one standing.' },
  { name: 'Arsonist', motto: 'One spark is all it takes', cat: 'Neutral', team: 'Loner', s: -5, icon: 'flame', color: C.ember, night: 'every', desc: 'Each night, douse one player in oil, or set every doused player on fire at once. You win if you are the last one standing.' },
  { name: 'Vampire', motto: 'Eternal hunger', cat: 'Neutral', team: 'Loner', s: -7, icon: 'dagger', color: C.plum, night: 'every', aliases: ['vampires', 'cultist', 'cult leader', 'plague doctor'], desc: 'Each night, bite a player — they become a vampire too. Vampires win when they outnumber everyone else.' },
  { name: 'Vampire Hunter', motto: 'Stake at the ready', cat: 'Neutral', team: 'Village', s: 1, icon: 'cross', color: C.gold, night: 'every', desc: 'Each night, point at a player. If they are a vampire, they are eliminated. You win with the village.' },
  { name: 'Necromancer', motto: 'Death is only a door', cat: 'Neutral', team: 'Loner', s: -4, icon: 'skull', color: C.plum, night: 'every', desc: 'Once per game, at night, raise a dead player. They return to the game on your side.' },
  { name: 'Executioner', motto: 'One name on your list', cat: 'Neutral', team: 'Loner', s: -2, icon: 'dagger', color: C.bone, night: 'first', aliases: ['executioner apprentice'], desc: 'On the first night, the host shows you a target. You win if the village votes them out.' },
  { name: 'Survivor', motto: 'Stay alive, whatever it takes', cat: 'Neutral', team: 'Loner', s: 0, icon: 'shield', color: C.mint, aliases: ['third party'], desc: 'You don’t care who wins. You win if you are still alive at the end.' },
  { name: 'Alien', motto: 'Not from around here', cat: 'Neutral', team: 'Loner', s: -2, icon: 'star', color: C.lime, desc: 'You came from far away. You win if exactly three players remain and you are one of them.' },
  { name: 'Devil', motto: 'Every deal has a price', cat: 'Neutral', team: 'Loner', s: -5, icon: 'flame', color: C.red, night: 'every', desc: 'Each night, make a deal with a player: they keep their life but now win only if you win. You win if your dealers survive.' },
  { name: 'Death', motto: 'No one escapes me', cat: 'Neutral', team: 'Loner', s: -6, icon: 'skull', color: C.smoke, night: 'every', desc: 'Each night, mark a player. Marked players die when you are voted for. You win if you are the last one standing.' },
  { name: 'Angel', motto: 'Heaven calls early', cat: 'Neutral', team: 'Loner', s: -1, icon: 'feather', color: C.sun, desc: 'You win alone if you are eliminated on the first day or night. After that, you play as a villager.' },
  { name: 'Fallen Angel', motto: 'Wings of ash', cat: 'Neutral', team: 'Loner', s: -4, icon: 'feather', color: C.wine, night: 'every', desc: 'Each night, curse one player — they can’t vote tomorrow. You win if the village falls, wolves or not.' },
  { name: 'Cupid', cat: 'Neutral', team: 'Village', s: -3, icon: 'heart', color: C.rose, builtin: 'cupid', aliases: ['lovers'], desc: 'On the first night, link two players as lovers. If one dies, the other dies too.' },

  // ---------- Special ----------
  { name: 'King', motto: 'Your word is law', cat: 'Special', team: 'Village', s: 2, icon: 'crown', color: C.sun, desc: 'Your word is law: once per game, cancel the village’s vote before anyone is eliminated.' },
  { name: 'Lawyer', motto: 'Your client comes first', cat: 'Special', team: 'Loner', s: 0, icon: 'key', color: C.sand, night: 'first', desc: 'On the first night, the host shows you a client. You win if your client is alive at the end.' },
  { name: 'Blackmailer', motto: 'Silence is golden', cat: 'Special', team: 'Werewolves', s: -3, icon: 'mask', color: C.wine, wolf: false, night: 'every', aliases: ['silencer'], desc: 'You help the wolves. Each night, choose a player who must not speak during the next day.' },
  { name: 'Hypnotist', motto: 'Look into my eyes', cat: 'Special', team: 'Werewolves', s: -3, icon: 'orb', color: C.plum, wolf: false, night: 'every', desc: 'You help the wolves. Each night, choose a player — tomorrow they must vote however you point.' },
  { name: 'Illusionist', motto: 'Nothing is what it seems', cat: 'Special', team: 'Werewolves', s: -3, icon: 'mask', color: C.smoke, wolf: false, night: 'every', desc: 'You help the wolves. Each night, disguise one player: tonight, every check on them shows the opposite.' },
  { name: 'Spellcaster', motto: 'Hush now', cat: 'Special', team: 'Village', s: 1, icon: 'star', color: C.violet, aliases: ['spell caster'], night: 'every', desc: 'Each night, point at one player. They are silenced and may not speak at all during the next day.' },
  { name: 'Gambler', motto: 'Fortune favours the bold', cat: 'Special', team: 'Loner', s: 0, icon: 'star', color: C.ember, night: 'every', desc: 'Each night, bet on who the wolves will attack. Guess right three times and you win alone.' },
  { name: 'Bartender', motto: 'This round’s on you', cat: 'Special', team: 'Village', s: 1, icon: 'flask', color: C.sand, night: 'every', desc: 'Each night, serve a drink to one player. Their power fails tonight.' },
  { name: 'Vengeful Spirit', motto: 'Death is not the end', cat: 'Special', team: 'Village', s: 2, icon: 'skull', color: C.frost, desc: 'When you die, you return as a spirit: once, at night, eliminate the player who killed you.' },
  { name: 'Ghost', motto: 'Speak from beyond', cat: 'Special', team: 'Village', s: 2, icon: 'skull', color: C.frost, desc: 'You are eliminated on the first night. Each day after, you may give the village one letter as a clue — never a whole name.' },
  { name: 'Poltergeist', motto: 'Things go bump', cat: 'Special', team: 'Village', s: 1, icon: 'skull', color: C.lilac, desc: 'After you die, once per game, you may cancel one vote by knocking on the table.' },
];

export const LIB_CATS: LibRole['cat'][] = ['Village', 'Werewolf', 'Neutral', 'Special'];

export const rgbOf = (hex: string) => [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16)).join(',');

/** Library entry for a typed name (exact name, alias, then prefix), or undefined. */
export function findLib(text: string): LibRole | undefined {
  const n = text.toLowerCase().trim().replace(/^the\s+/, '');
  if (n.length < 3) return undefined;
  return ROLE_LIBRARY.find(r => r.name.toLowerCase() === n)
    || ROLE_LIBRARY.find(r => (r.aliases || []).indexOf(n) >= 0)
    || (n.length >= 4 ? ROLE_LIBRARY.find(r => r.name.toLowerCase().indexOf(n) === 0) : undefined);
}
