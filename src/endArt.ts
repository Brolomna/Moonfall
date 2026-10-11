// End-card pictures for lone winners: public/end/<slug>.webp and each picture's width / height.
// A winner without a picture here shows the title art (public/splash.webp) instead.
export const END_ART: Record<string, number> = {
  'serial-killer': 941 / 1672,
  arsonist: 751 / 1016,
  vampire: 752 / 1016,
  'white-werewolf': 750 / 503,
  'lone-wolf': 756 / 503,
  lovers: 750 / 504,
  cult: 756 / 504,
};
export const endSlug = (lib: string) => String(lib || '').toLowerCase().replace(/[^a-z]+/g, '-').replace(/^-|-$/g, '');
/** { src, ratio } for a lone winner's end card (Tanner keeps its own file). */
export function endArt(lib: string) {
  if (lib === 'Tanner') return { src: '/end-tanner.webp', ratio: 941 / 1672 };
  const slug = endSlug(lib === 'Vampire' ? 'vampire' : lib === 'Cult Leader' ? 'cult' : lib);
  return END_ART[slug] ? { src: '/end/' + slug + '.webp', ratio: END_ART[slug] } : { src: '/splash.webp', ratio: 941 / 1672 };
}
