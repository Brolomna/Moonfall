// Rival / counter roles: pairs that make each other more interesting. When one of a pair is in the deck,
// the host's roles screen suggests the other (a tip with an Add button — never added automatically).
// Names are the role names in ./roleLibrary.ts. Sources: Ultimate Werewolf role notes, the One Night combinations
// guide, and how the roles' powers interact in this app.
export type RolePair = { a: string; b: string; why: string };

export const ROLE_PAIRS: RolePair[] = [
  { a: 'Prince', b: 'Tanner', why: 'A Prince who asks to be voted out to prove he’s innocent looks exactly like a Tanner fishing for a vote.' },
  { a: 'Seer', b: 'Sorcerer', why: 'The Sorcerer hunts the Seer for the wolves — the Seer has to stay hidden longer.' },
  { a: 'Seer', b: 'Lycan', why: 'The Lycan checks as a werewolf, so a sure “wolf!” from the Seer can hit an innocent villager.' },
  { a: 'Seer', b: 'Shadow Wolf', why: 'The Shadow Wolf checks as a villager — a clean check is no longer proof.' },
  { a: 'Seer', b: 'Traitor', why: 'The Traitor checks as a villager but wins with the wolves.' },
  { a: 'Seer', b: 'Apprentice Seer', why: 'Killing the Seer no longer blinds the village — the apprentice takes over.' },
  { a: 'Seer', b: 'Illusionist', why: 'The Illusionist flips one check a night, so the Seer can’t trust a single result.' },
  { a: 'Seer', b: 'Nightmare Wolf', why: 'The Nightmare Wolf can shut the Seer’s power off for a night.' },
  { a: 'Seer', b: 'Cursed', why: 'The Cursed checks clean — until the wolves bite and turn them.' },
  { a: 'Seer', b: 'Doppelgänger', why: 'The Doppelgänger wants to copy the Seer, and the Seer is the wolves’ first target.' },
  { a: 'Aura Seer', b: 'Illusionist', why: 'A disguise flips the Aura Seer’s answer for the night.' },
  { a: 'Fortune Teller', b: 'Illusionist', why: 'The one-time exact look can be spoiled by a disguise.' },
  { a: 'Revealer', b: 'Lycan', why: 'The Revealer’s shot kills a Lycan too — a costly mistake for the village.' },
  { a: 'Hunter', b: 'Wolf King', why: 'Both take someone with them when they die — every elimination becomes a gamble.' },
  { a: 'Hunter', b: 'Hunter Apprentice', why: 'Shoot the Hunter and another one is waiting.' },
  { a: 'Vampire', b: 'Vampire Hunter', why: 'The Vampire Hunter is the only one who can stop the vampires at night.' },
  { a: 'Executioner', b: 'Lawyer', why: 'One needs a player voted out, the other needs a client kept alive — they pull the vote in opposite directions.' },
  { a: 'Tanner', b: 'Executioner', why: 'Two players pushing hard for a vote — which one is the real troublemaker?' },
  { a: 'Tanner', b: 'Angel', why: 'Two players who want to die early make the first votes a minefield.' },
  { a: 'Mayor', b: 'Blackmailer', why: 'A silenced Mayor can’t lead the vote.' },
  { a: 'Mayor', b: 'Hypnotist', why: 'The Hypnotist can steal the Mayor’s double vote.' },
  { a: 'Village Idiot', b: 'Pacifist', why: 'One always votes to kill, one never does — the votes get much harder to read.' },
  { a: 'Priest', b: 'Serial Killer', why: 'A blessing is one of the few things that stops the Serial Killer.' },
  { a: 'Serial Killer', b: 'Arsonist', why: 'Two lone killers racing each other — and the village — to be the last one standing.' },
  { a: 'Healer', b: 'Wolf Cub', why: 'When the Cub dies the wolves take two victims — one protector can’t cover both.' },
  { a: 'Bodyguard', b: 'Big Bad Wolf', why: 'The Big Bad Wolf’s second victim slips past the Bodyguard.' },
  { a: 'Witch', b: 'Diseased', why: 'A night with no wolf kill wastes the Witch’s chance to save — and gives her a free night to poison.' },
  { a: 'Mason', b: 'Minion', why: 'Two hidden circles of trust: the Masons know each other, the Minion knows the wolves.' },
  { a: 'Medium', b: 'Ghost', why: 'The dead keep talking: the Medium confirms roles, the Ghost spells out clues.' },
  { a: 'Elder', b: 'Wolf Cub', why: 'The Elder survives the first bite — the wolves may waste their extra victim.' },
];
