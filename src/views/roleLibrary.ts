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
  { name: 'Aura Seer', motto: 'Every soul has a colour', cat: 'Village', team: 'Village', s: 3, icon: 'star', color: C.sky, night: 'every', desc: 'Each night, point at a player. The host tells you if their aura is good, evil or neutral.' },
  { name: 'Medium', motto: 'The dead still whisper', cat: 'Village', team: 'Village', s: 2, icon: 'orb', color: C.lilac, night: 'every', desc: 'Each night, ask the host one yes/no question about a dead player — the dead speak through you.' },
  { name: 'Witch', cat: 'Village', team: 'Village', s: 4, icon: 'flask', color: C.violet, builtin: 'witch', desc: 'You have one potion to save the wolves’ victim and one poison to kill. Each works once.' },
  { name: 'Healer', cat: 'Village', team: 'Village', s: 5, icon: 'shield', color: C.sage, builtin: 'healer', desc: 'Each night, protect one player from the wolves.' },
  { name: 'Doctor', motto: 'First, do no harm', cat: 'Village', team: 'Village', s: 5, icon: 'cross', color: C.sage, night: 'every', desc: 'Each night, choose a player to protect. If the wolves attack them, they survive.' },
  { name: 'Bodyguard', cat: 'Village', team: 'Village', s: 3, icon: 'shield', color: C.frost, builtin: 'bodyguard', desc: 'Each night, guard one player from attacks — never the same player twice in a row.' },
  { name: 'Guardian Angel', motto: 'Your wings, their shield', cat: 'Village', team: 'Village', s: 3, icon: 'feather', color: C.frost, night: 'every', desc: 'The host gives you a player to protect. Each night you may shield them. If they die, so does your purpose — you must survive to the end to win.' },
  { name: 'Hunter', cat: 'Village', team: 'Village', s: 3, icon: 'bow', color: C.ember, builtin: 'hunter', desc: 'When you are eliminated, immediately take one player down with you.' },
  { name: 'Detective', motto: 'Every clue counts', cat: 'Village', team: 'Village', s: 4, icon: 'eye', color: C.lilac, night: 'every', desc: 'Each night, investigate a player. The host tells you if they did anything suspicious tonight.' },
  { name: 'Investigator', motto: 'Three names, one truth', cat: 'Village', team: 'Village', s: 3, icon: 'key', color: C.lilac, night: 'every', desc: 'Each night, point at a player. The host names three roles — one of them is theirs.' },
  { name: 'Tracker', motto: 'Every step leaves a trace', cat: 'Village', team: 'Village', s: 3, icon: 'eye', color: C.mint, night: 'every', desc: 'Each night, follow a player. The host tells you who they visited tonight, if anyone.' },
  { name: 'Watcher', motto: 'Eyes on the door', cat: 'Village', team: 'Village', s: 3, icon: 'eye', color: C.mint, night: 'every', desc: 'Each night, watch a player. The host tells you who visited them tonight.' },
  { name: 'Psychic', motto: 'Evil leaves an echo', cat: 'Village', team: 'Village', s: 3, icon: 'orb', color: C.violet, night: 'every', desc: 'Each night, point at two players. The host tells you if at least one of them is evil.' },
  { name: 'Priest', motto: 'A blessing in the dark', cat: 'Village', team: 'Village', s: 3, icon: 'cross', color: C.gold, night: 'every', aliases: ['cleric'], desc: 'Once per game, at night, bless one player. The first time they would be eliminated, they survive instead.' },
  { name: 'Mason', cat: 'Village', team: 'Village', s: 2, icon: 'key', color: C.sand, builtin: 'mason', desc: 'Masons wake on the first night and see each other.' },
  { name: 'Mayor', cat: 'Village', team: 'Village', s: 2, icon: 'crown', color: C.lilac, builtin: 'mayor', desc: 'Once you reveal your card, your vote counts twice.' },
  { name: 'Sheriff', motto: 'The law has the last word', cat: 'Village', team: 'Village', s: 2, icon: 'star', color: C.sun, desc: 'You run the village vote: you break every tie, and your vote counts twice.' },
  { name: 'Judge', motto: 'Order in the court', cat: 'Village', team: 'Village', s: 3, icon: 'crown', color: C.sun, desc: 'Once per game, after a vote, secretly signal the host to hold a second vote right away.' },
  { name: 'Prince', cat: 'Village', team: 'Village', s: 3, icon: 'crown', color: C.sun, builtin: 'prince', desc: 'If you are voted out, reveal your card — you survive and no one is eliminated.' },
  { name: 'Elder', motto: 'Too old to die easily', cat: 'Village', team: 'Village', s: 3, icon: 'shield', color: C.mint, desc: 'You survive the first werewolf attack on you. The second one kills you.' },
  { name: 'Little Girl', motto: 'Peeking is dangerous', cat: 'Village', team: 'Village', s: 4, icon: 'eye', color: C.rose, aliases: ['girl'], desc: 'When the werewolves wake, you may secretly peek through your fingers. If they catch you looking, they can choose you as their victim.' },
  { name: 'Hunter Apprentice', motto: 'The bow passes to you', cat: 'Village', team: 'Village', s: 2, icon: 'bow', color: C.coral, desc: 'If the Hunter dies, you become the new Hunter.' },
  { name: 'Avenger', motto: 'You won’t fall alone', cat: 'Village', team: 'Village', s: 2, icon: 'dagger', color: C.coral, desc: 'When you are killed, choose one player to eliminate along with you.' },
  { name: 'Martyr', motto: 'Your life for theirs', cat: 'Village', team: 'Village', s: 3, icon: 'heart', color: C.rose, night: 'every', desc: 'Once per game, when the host tells you who the wolves attacked, you may die in their place.' },
  { name: 'Pacifist', motto: 'No blood on your hands', cat: 'Village', team: 'Village', s: -1, icon: 'feather', color: C.sage, desc: 'You must always vote to keep players alive — you can never vote to eliminate anyone.' },
  { name: 'Politician', motto: 'Every vote is a deal', cat: 'Village', team: 'Village', s: 2, icon: 'crown', color: C.lilac, desc: 'Once per game, during the day, you can call for an extra vote before night falls.' },
  { name: 'Princess', motto: 'Royal grace, once', cat: 'Village', team: 'Village', s: 2, icon: 'crown', color: C.rose, desc: 'The first time you are voted out, reveal your card and survive. The next time counts.' },
  { name: 'Oracle', motto: 'Truth by elimination', cat: 'Village', team: 'Village', s: 3, icon: 'orb', color: C.sky, night: 'every', desc: 'Each night, point at a player. The host names one role that player is NOT.' },
  { name: 'Prophet', motto: 'Tomorrow speaks to you', cat: 'Village', team: 'Village', s: 3, icon: 'star', color: C.sky, night: 'every', desc: 'Each night, the host whispers whether a werewolf will die before the next night — if you can make it happen.' },
  { name: 'Fortune Teller', motto: 'The cards never lie', cat: 'Village', team: 'Village', s: 3, icon: 'orb', color: C.frost, aliases: ['fortune'], night: 'every', desc: 'Once per game, when the host wakes you at night, point at a player. The host shows you their exact role.' },
  { name: 'Alchemist', motto: 'Three potions, three chances', cat: 'Village', team: 'Village', s: 4, icon: 'flask', color: C.violet, night: 'every', desc: 'You have three potions — heal, reveal and poison. Each night you may use one; each works once.' },
  { name: 'Herbalist', motto: 'Nature heals', cat: 'Village', team: 'Village', s: 4, icon: 'flask', color: C.sage, night: 'every', desc: 'Each night, give one player a healing herb. If they are attacked tonight, they survive. Not yourself.' },
  { name: 'Blacksmith', motto: 'Steel against the fangs', cat: 'Village', team: 'Village', s: 3, icon: 'shield', color: C.sand, night: 'every', desc: 'Once per game, at night, forge a shield for one player. It blocks the next werewolf attack on them.' },
  { name: 'Baker', motto: 'No bread, no village', cat: 'Village', team: 'Village', s: 0, icon: 'star', color: C.gold, desc: 'While you live, the village is fed. Once you are eliminated, the village starves: every third day after, the host eliminates one more player.' },
  { name: 'Gravedigger', motto: 'Graves keep secrets — not from you', cat: 'Village', team: 'Village', s: 2, icon: 'skull', color: C.ash, night: 'every', desc: 'Each night, point at a dead player. The host shows you their role.' },
  { name: 'Grave Robber', motto: 'The dead won’t need it', cat: 'Village', team: 'Village', s: 1, icon: 'skull', color: C.ash, night: 'every', desc: 'Once per game, at night, choose a dead player. You take their role and power for the rest of the game.' },
  { name: 'Revealer', motto: 'All or nothing', cat: 'Village', team: 'Village', s: 2, icon: 'eye', color: C.ember, night: 'every', desc: 'Once per game, at night, point at a player. If they are a werewolf, they are revealed and eliminated. If not, you die instead.' },
  { name: 'Snoop', motto: 'Nothing escapes your notice', cat: 'Village', team: 'Village', s: 2, icon: 'eye', color: C.lime, night: 'every', desc: 'Each night, point at a player. The host shows you one thumbs-up for each power they have used so far.' },
  { name: 'Spy', motto: 'Know your enemy', cat: 'Village', team: 'Village', s: 3, icon: 'mask', color: C.lime, night: 'every', desc: 'After the werewolves choose, the host wakes you and points at one of them.' },
  { name: 'Thief', motto: 'Finders keepers', cat: 'Village', team: 'Village', s: 0, icon: 'key', color: C.bone, night: 'first', desc: 'On the first night, you may take another player’s role. The host tells them privately they are now a Villager.' },
  { name: 'Robber', motto: 'What’s yours is mine', cat: 'Village', team: 'Village', s: 0, icon: 'key', color: C.bone, night: 'first', desc: 'On the first night, point at a player and swap roles with them. The host tells you both your new roles privately.' },
  { name: 'Troublemaker', motto: 'Stir the pot', cat: 'Village', team: 'Village', s: -3, icon: 'mask', color: C.ember, aliases: ['trouble maker'], night: 'first', desc: 'On the first night, point at two other players. The host privately swaps their roles — they learn their new role in the morning.' },
  { name: 'Drunk', motto: 'Who am I again?', cat: 'Village', team: 'Village', s: 3, icon: 'flask', color: C.gold, aliases: ['the drunk'], desc: 'You play as a plain Villager until the third night, when the host secretly hands you your real role.' },
  { name: 'Insomniac', motto: 'You never really sleep', cat: 'Village', team: 'Village', s: 1, icon: 'moon', color: C.lilac, night: 'every', desc: 'At the end of each night, the host shows you whether your role has changed.' },
  { name: 'Mimic', motto: 'Borrowed power', cat: 'Village', team: 'Village', s: 2, icon: 'mask', color: C.ash, night: 'first', desc: 'On the first night, point at a player. You copy their power (not their team) for the rest of the game.' },
  { name: 'Doppelgänger', cat: 'Village', team: 'Loner', s: -2, icon: 'mask', color: C.ash, builtin: 'doppelganger', aliases: ['doppelganger'], desc: 'On the first night, copy a player. If they die, you take their role.' },
  { name: 'Cursed', cat: 'Village', team: 'Village', s: -3, icon: 'mask', color: C.smoke, builtin: 'cursed', aliases: ['cursed villager'], desc: 'You are a villager — until the wolves attack you. Then you become a werewolf instead of dying.' },
  { name: 'Diseased', motto: 'Bite me and regret it', cat: 'Village', team: 'Village', s: 3, icon: 'flask', color: C.lime, aliases: ['disease', 'sick'], desc: 'If the werewolves eliminate you, they catch your sickness and cannot attack anyone the following night.' },
  { name: 'Lycan', cat: 'Village', team: 'Village', s: -1, icon: 'wolf', color: C.wine, builtin: 'lycan', desc: 'You are a villager, but the Seer sees you as a werewolf.' },
  { name: 'Tough Guy', cat: 'Village', team: 'Village', s: 3, icon: 'shield', color: C.coral, builtin: 'toughguy', desc: 'If the wolves attack you, you survive until the end of the next day.' },
  { name: 'Village Idiot', cat: 'Village', team: 'Village', s: 2, icon: 'mask', color: C.lime, builtin: 'idiot', desc: 'You must always vote to eliminate someone.' },
  { name: 'Old Hag', cat: 'Village', team: 'Village', s: 1, icon: 'moon', color: C.mint, builtin: 'oldhag', desc: 'Each night, banish one player from the next day — they can’t talk or vote.' },

  // ---------- Werewolf ----------
  { name: 'Werewolf', cat: 'Werewolf', team: 'Werewolves', s: -6, icon: 'wolf', color: C.blood, builtin: 'werewolf', desc: 'Each night, wake with the pack and choose a player to eliminate.' },
  { name: 'Alpha Werewolf', motto: 'Lead the pack', cat: 'Werewolf', team: 'Werewolves', s: -9, icon: 'wolf', color: C.blood, night: 'wolves', aliases: ['alpha wolf', 'alpha'], desc: 'You wake with the werewolves. Once per game, instead of eliminating the victim, you can turn them into a werewolf.' },
  { name: 'Wolf Cub', cat: 'Werewolf', team: 'Werewolves', s: -8, icon: 'wolf', color: C.red, builtin: 'wolfcub', desc: 'You hunt with the pack. If you are killed, the wolves take two victims the next night.' },
  { name: 'White Werewolf', motto: 'A wolf among wolves', cat: 'Werewolf', team: 'Werewolves', s: -7, icon: 'wolf', color: C.gold, night: 'every', desc: 'You hunt with the pack, but you win alone. Every other night, the host wakes you to eliminate a werewolf if you wish.' },
  { name: 'Black Werewolf', motto: 'One bite changes everything', cat: 'Werewolf', team: 'Werewolves', s: -8, icon: 'wolf', color: C.wine, night: 'wolves', desc: 'You hunt with the pack. Once per game, the wolves’ victim is infected instead of killed and secretly joins the wolves.' },
  { name: 'Lone Wolf', motto: 'Last one howling', cat: 'Werewolf', team: 'Werewolves', s: -6, icon: 'wolf', color: C.bone, night: 'wolves', desc: 'You hunt with the pack, but you only win if you are the last werewolf standing.' },
  { name: 'Wolf King', motto: 'Long live the king', cat: 'Werewolf', team: 'Werewolves', s: -7, icon: 'crown', color: C.blood, night: 'wolves', desc: 'You lead the pack. When you are eliminated, you take one player down with you.' },
  { name: 'Nightmare Wolf', motto: 'Sweet dreams are over', cat: 'Werewolf', team: 'Werewolves', s: -7, icon: 'moon', color: C.plum, night: 'every', desc: 'You hunt with the pack. Each night, you may also choose a player whose power fails tonight.' },
  { name: 'Fire Wolf', motto: 'Let it burn', cat: 'Werewolf', team: 'Werewolves', s: -7, icon: 'flame', color: C.ember, night: 'wolves', desc: 'You hunt with the pack. Once per game, the wolves may burn two victims in one night.' },
  { name: 'Ice Wolf', motto: 'Frozen in fear', cat: 'Werewolf', team: 'Werewolves', s: -7, icon: 'star', color: C.frost, night: 'every', desc: 'You hunt with the pack. Each night, you may freeze one player — their power fails tonight.' },
  { name: 'Shadow Wolf', motto: 'Unseen, unknown', cat: 'Werewolf', team: 'Werewolves', s: -7, icon: 'moon', color: C.smoke, night: 'wolves', desc: 'You hunt with the pack, but every investigating role sees you as a plain Villager.' },
  { name: 'Wolfman', motto: 'Innocent face, hungry heart', cat: 'Werewolf', team: 'Werewolves', s: -7, icon: 'wolf', color: C.sand, night: 'wolves', desc: 'You are a werewolf, but the Seer sees you as innocent.' },
  { name: 'Omega Wolf', motto: 'The last is the fiercest', cat: 'Werewolf', team: 'Werewolves', s: -6, icon: 'wolf', color: C.ash, night: 'wolves', desc: 'You hunt with the pack. Once you are the last werewolf alive, you may take two victims each night.' },
  { name: 'Big Bad Wolf', motto: 'Huff, puff and feast', cat: 'Werewolf', team: 'Werewolves', s: -9, icon: 'wolf', color: C.red, night: 'wolves', aliases: ['big bad'], desc: 'You wake with the werewolves. While no werewolf has been eliminated, you also eliminate a player sitting next to the victim.' },
  { name: 'Sorcerer', cat: 'Werewolf', team: 'Werewolves', s: -3, icon: 'orb', color: C.plum, builtin: 'sorceress', aliases: ['sorceress'], desc: 'You help the wolves. Each night, point at a player — the host tells you if they are the Seer.' },
  { name: 'Minion', cat: 'Werewolf', team: 'Werewolves', s: -6, icon: 'dagger', color: C.wine, builtin: 'minion', desc: 'You know who the wolves are, but they don’t know you. You win with them.' },
  { name: 'Traitor', motto: 'Smile, then betray', cat: 'Werewolf', team: 'Werewolves', s: -4, icon: 'mask', color: C.wine, wolf: false, desc: 'You look like a villager to every check, but you win with the wolves. You don’t know who they are.' },

  // ---------- Neutral ----------
  { name: 'Fool', motto: 'Laugh all the way to the gallows', cat: 'Neutral', team: 'Loner', s: -2, icon: 'mask', color: C.lime, aliases: ['the fool'], desc: 'You win alone if the village votes you out.' },
  { name: 'Tanner', cat: 'Neutral', team: 'Loner', s: -2, icon: 'skull', color: C.bone, builtin: 'tanner', desc: 'You hate your job. You win only if the village votes you out.' },
  { name: 'Jester', motto: 'The joke’s on them', cat: 'Neutral', team: 'Loner', s: -2, icon: 'mask', color: C.violet, desc: 'Trick the village into voting you out. If they do, you win — and the game goes on without you.' },
  { name: 'Serial Killer', motto: 'Nobody leaves alive', cat: 'Neutral', team: 'Loner', s: -8, icon: 'dagger', color: C.blood, night: 'every', desc: 'Each night, eliminate one player. The wolves can’t kill you. You win if you are the last one standing.' },
  { name: 'Arsonist', motto: 'One spark is all it takes', cat: 'Neutral', team: 'Loner', s: -4, icon: 'flame', color: C.ember, night: 'every', desc: 'Each night, douse one player in oil, or set every doused player on fire at once. You win if you are the last one standing.' },
  { name: 'Vampire', motto: 'Eternal hunger', cat: 'Neutral', team: 'Loner', s: -7, icon: 'dagger', color: C.plum, night: 'every', aliases: ['vampires'], desc: 'Each night, bite a player — they become a vampire too. Vampires win when they outnumber everyone else.' },
  { name: 'Vampire Hunter', motto: 'Stake at the ready', cat: 'Neutral', team: 'Village', s: 2, icon: 'cross', color: C.gold, night: 'every', desc: 'Each night, point at a player. If they are a vampire, they are eliminated. You win with the village.' },
  { name: 'Cultist', motto: 'Join us', cat: 'Neutral', team: 'Loner', s: -3, icon: 'star', color: C.smoke, desc: 'You belong to the cult. You win when every living player has joined it.' },
  { name: 'Cult Leader', motto: 'All shall follow', cat: 'Neutral', team: 'Loner', s: -5, icon: 'crown', color: C.smoke, night: 'every', desc: 'Each night, recruit one player into your cult. You win when every living player is a cult member.' },
  { name: 'Necromancer', motto: 'Death is only a door', cat: 'Neutral', team: 'Loner', s: -4, icon: 'skull', color: C.plum, night: 'every', desc: 'Once per game, at night, raise a dead player. They return to the game on your side.' },
  { name: 'Plague Doctor', motto: 'The cure is the disease', cat: 'Neutral', team: 'Loner', s: -4, icon: 'flask', color: C.lime, night: 'every', desc: 'Each night, infect one player. You win when every living player carries your plague.' },
  { name: 'Executioner', motto: 'One name on your list', cat: 'Neutral', team: 'Loner', s: -2, icon: 'dagger', color: C.bone, night: 'first', desc: 'On the first night, the host shows you a target. You win if the village votes them out.' },
  { name: 'Survivor', motto: 'Stay alive, whatever it takes', cat: 'Neutral', team: 'Loner', s: 0, icon: 'shield', color: C.mint, desc: 'You don’t care who wins. You win if you are still alive at the end.' },
  { name: 'Alien', motto: 'Not from around here', cat: 'Neutral', team: 'Loner', s: -3, icon: 'star', color: C.lime, desc: 'You came from far away. You win if exactly three players remain and you are one of them.' },
  { name: 'Demon', motto: 'Born of the flames', cat: 'Neutral', team: 'Loner', s: -6, icon: 'flame', color: C.blood, night: 'every', desc: 'Each night, eliminate a player. Only a vote can kill you. You win if you are the last one standing.' },
  { name: 'Devil', motto: 'Every deal has a price', cat: 'Neutral', team: 'Loner', s: -5, icon: 'flame', color: C.red, night: 'every', desc: 'Each night, make a deal with a player: they keep their life but now win only if you win. You win if your dealers survive.' },
  { name: 'Grim Reaper', motto: 'Your time has come', cat: 'Neutral', team: 'Loner', s: -6, icon: 'skull', color: C.ash, night: 'every', desc: 'Every other night, eliminate one player. You win if you outlive both the village and the wolves.' },
  { name: 'Death', motto: 'No one escapes me', cat: 'Neutral', team: 'Loner', s: -6, icon: 'skull', color: C.smoke, night: 'every', desc: 'Each night, mark a player. Marked players die when you are voted for. You win if you are the last one standing.' },
  { name: 'Angel', motto: 'Heaven calls early', cat: 'Neutral', team: 'Loner', s: 1, icon: 'feather', color: C.sun, desc: 'You win alone if you are eliminated on the first day or night. After that, you play as a villager.' },
  { name: 'Fallen Angel', motto: 'Wings of ash', cat: 'Neutral', team: 'Loner', s: -4, icon: 'feather', color: C.wine, night: 'every', desc: 'Each night, curse one player — they can’t vote tomorrow. You win if the village falls, wolves or not.' },
  { name: 'Third Party', motto: 'A plan of your own', cat: 'Neutral', team: 'Loner', s: -2, icon: 'star', color: C.bone, night: 'first', desc: 'On the first night, the host whispers you a secret goal. You win alone if you reach it.' },
  { name: 'Lovers', motto: 'Together, always', cat: 'Neutral', team: 'Loner', s: -1, icon: 'heart', color: C.rose, night: 'first', desc: 'On the first night, the host links you to another player. If one of you dies, the other dies of heartbreak. You win together.' },
  { name: 'Cupid', cat: 'Neutral', team: 'Village', s: -3, icon: 'heart', color: C.rose, builtin: 'cupid', desc: 'On the first night, link two players as lovers. If one dies, the other dies too.' },
  { name: 'Executioner Apprentice', motto: 'Finish the job', cat: 'Neutral', team: 'Loner', s: -1, icon: 'dagger', color: C.sand, desc: 'If the Executioner dies, you take over their target and their goal.' },

  // ---------- Special ----------
  { name: 'King', motto: 'Your word is law', cat: 'Special', team: 'Village', s: 2, icon: 'crown', color: C.sun, desc: 'Your word is law: once per game, cancel the village’s vote before anyone is eliminated.' },
  { name: 'Queen', motto: 'Grace under fire', cat: 'Special', team: 'Village', s: 2, icon: 'crown', color: C.rose, desc: 'The first werewolf attack on you fails. If the King is in play, protecting him counts too.' },
  { name: 'Lawyer', motto: 'Your client comes first', cat: 'Special', team: 'Loner', s: 0, icon: 'key', color: C.sand, night: 'first', desc: 'On the first night, the host shows you a client. You win if your client is alive at the end.' },
  { name: 'Blackmailer', motto: 'Silence is golden', cat: 'Special', team: 'Werewolves', s: -3, icon: 'mask', color: C.wine, wolf: false, night: 'every', desc: 'You help the wolves. Each night, choose a player who must not speak during the next day.' },
  { name: 'Hypnotist', motto: 'Look into my eyes', cat: 'Special', team: 'Werewolves', s: -3, icon: 'orb', color: C.plum, wolf: false, night: 'every', desc: 'You help the wolves. Each night, choose a player — tomorrow they must vote however you point.' },
  { name: 'Illusionist', motto: 'Nothing is what it seems', cat: 'Special', team: 'Werewolves', s: -3, icon: 'mask', color: C.smoke, wolf: false, night: 'every', desc: 'You help the wolves. Each night, disguise one player: tonight, every check on them shows the opposite.' },
  { name: 'Spellcaster', motto: 'Hush now', cat: 'Special', team: 'Village', s: 1, icon: 'star', color: C.violet, aliases: ['spell caster'], night: 'every', desc: 'Each night, point at one player. They are silenced and may not speak at all during the next day.' },
  { name: 'Silencer', motto: 'Not a word', cat: 'Special', team: 'Werewolves', s: -1, icon: 'moon', color: C.ash, wolf: false, night: 'every', desc: 'You help the wolves. Each night, silence one player for the following day.' },
  { name: 'Gambler', motto: 'Fortune favours the bold', cat: 'Special', team: 'Loner', s: 0, icon: 'star', color: C.ember, night: 'every', desc: 'Each night, bet on who the wolves will attack. Guess right three times and you win alone.' },
  { name: 'Bartender', motto: 'This round’s on you', cat: 'Special', team: 'Village', s: 1, icon: 'flask', color: C.sand, night: 'every', desc: 'Each night, serve a drink to one player. Their power fails tonight.' },
  { name: 'Drunkard', motto: 'Can you trust yourself?', cat: 'Special', team: 'Village', s: 1, icon: 'flask', color: C.bone, desc: 'You don’t know your real role. Each morning the host may tell you something — it might not be true.' },
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
