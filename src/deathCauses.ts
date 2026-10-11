// Every way to die at night besides the wolves (no cause), the Witch (poison), the Hunter (hunter) and a broken heart.
// Each one has its own death card on the player's phone (PlayerView) — here: the host's label, History wording and colour.
export const CAUSES: Record<string, { label: string; phrase: string; color: string; rgb: string; ink: string }> = {
  slain: { label: 'Slain', phrase: ' was slain in the night', color: '#c7a8ff', rgb: '199,168,255', ink: '#1a0f2e' },
  knife: { label: 'Serial Killer', phrase: ' was stabbed by the Serial Killer', color: '#d8dde6', rgb: '216,221,230', ink: '#16181d' },
  burned: { label: 'Burned', phrase: ' was burned by the Arsonist', color: '#ff9a4a', rgb: '255,154,74', ink: '#2a1204' },
  betrayed: { label: 'White Werewolf', phrase: ' was torn apart by the White Werewolf', color: '#e6eefc', rgb: '230,238,252', ink: '#141a26' },
  staked: { label: 'Staked', phrase: ' was staked by the Vampire Hunter', color: '#d0687a', rgb: '208,104,122', ink: '#2a0a12' },
  revealed: { label: 'Revealed', phrase: ' was exposed and eliminated by the Revealer', color: '#f2d06b', rgb: '242,208,107', ink: '#2a2208' },
  misfire: { label: 'Wrong guess', phrase: ' pointed at an innocent and paid with their life', color: '#b9a4e0', rgb: '185,164,224', ink: '#1a1328' },
  vengeance: { label: 'Vengeance', phrase: ' was taken by the Vengeful Spirit', color: '#7fd6c8', rgb: '127,214,200', ink: '#0b2622' },
  deathcurse: { label: 'Death’s mark', phrase: ' was claimed by Death', color: '#b3adc4', rgb: '179,173,196', ink: '#16131d' },
  kingshot: { label: 'Wolf King', phrase: ' was dragged down by the Wolf King', color: '#e0475f', rgb: '224,71,95', ink: '#2b0b14' },
  starved: { label: 'Starved', phrase: ' starved without the Baker', color: '#e8d3a0', rgb: '232,211,160', ink: '#2a2410' },
  ghost: { label: 'Ghost', phrase: ' faded away on the first night, as the Ghost always does', color: '#a9cbff', rgb: '169,203,255', ink: '#0e1a2e' },
  sacrifice: { label: 'Sacrifice', phrase: ' died guarding someone from the wolves', color: '#8fd3e8', rgb: '143,211,232', ink: '#0b2129' },
};
