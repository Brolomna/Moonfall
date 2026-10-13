// Builds plain HTML pages that search engines and ad reviewers can read without running the app:
//   /how-to-play, /roles  (+ /<lang>/how-to-play, /<lang>/roles for zh ko ja fr th es), /sitemap.xml, /robots.txt
// Everything is taken from the texts the app already shows (the player's game guide, the role cards,
// the strategy tips), so the pages stay in step with the game. Runs after `vite build` (writes into dist/).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { ROLE_LIBRARY, LIB_CATS } from '../src/views/roleLibrary';
import { ROLE_TIPS, TEAM_TIPS } from '../src/views/roleTips';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST = path.join(ROOT, 'dist');
const SITE = (process.env.SITE_URL || 'https://moonfall.onrender.com').replace(/\/$/, '');
const LANGS = ['en', 'zh', 'ko', 'ja', 'fr', 'th', 'es'] as const;
type Lang = (typeof LANGS)[number];
const NATIVE: Record<Lang, string> = { en: 'English', zh: '中文', ko: '한국어', ja: '日本語', fr: 'Français', th: 'ไทย', es: 'Español' };

// ---------- reading the texts out of the app ----------
const src = fs.readFileSync(path.join(ROOT, 'src/views/PlayerView.tsx'), 'utf8');
const unq = (s: string) => s.replace(/\\(['"\\])/g, '$1');
/** the source of one method's return object (ui(), roleText(), roles()) */
const method = (name: string) => { const a = src.search(new RegExp('\\n  ' + name + '\\([a-z]*\\) \\{')); const b = src.indexOf('\n  }\n', a); return src.slice(a, b); };
/** one language's block inside a method: from "      xx: {" to the next language */
function langBlock(body: string, lang: string) {
  const re = new RegExp('\\n      ' + lang + ': \\{');
  const m = re.exec(body); if (!m) return '';
  const rest = body.slice(m.index + 1);
  const next = /\n      [a-z][a-z]: \{/.exec(rest.slice(5));
  return next ? rest.slice(0, next.index + 5) : rest;
}
const strOf = (block: string, key: string) => {
  const m = new RegExp('\\b' + key + ": (['\"])((?:\\\\.|(?!\\1).)*)\\1").exec(block);
  return m ? unq(m[2]) : '';
};
const UI = method('ui'), RT = method('roleText'), ROLES = method('roles') + method('core');
const libI18n: Record<string, any> = {}, tipsI18n: Record<string, any> = {};
for (const l of LANGS) if (l !== 'en') {
  libI18n[l] = (await import(`../src/views/i18n/roles.${l}.ts`)).default;
  tipsI18n[l] = (await import(`../src/views/i18n/tips.${l}.ts`)).default;
}
/** a UI line in this language (newer lines live in i18n/roles.<lang>.ts), English as a fallback */
const t = (l: Lang, key: string): string =>
  (l !== 'en' && libI18n[l]?.ui?.[key]) || strOf(langBlock(UI, l), key) || strOf(langBlock(UI, 'en'), key);

/** [name, motto, card text] for a library role in this language */
function roleText(l: Lang, e: (typeof ROLE_LIBRARY)[number]): [string, string, string] {
  const en: [string, string, string] = [e.name, e.motto || '', e.desc];
  if (e.builtin) {
    // English motto of a built-in role lives in roles(): either `key: x('Name', 'Team', …, 'motto', 'desc'` or `key: { … motto: '…'`
    const line = new RegExp('\\n\\s+' + e.builtin + ': (?:x\\(|\\{)([^\\n]*)').exec(ROLES)?.[1] || '';
    const xs = [...line.matchAll(/'((?:\\.|[^'])*)'/g)].map(m => unq(m[1]));
    if (!en[1]) en[1] = line.includes('motto:') ? strOf(line, 'motto') : xs[5] || '';
    if (l === 'en') return en;
    const m = new RegExp('\\n\\s+' + e.builtin + ": \\[\\s*'((?:\\\\.|[^'])*)',\\s*'((?:\\\\.|[^'])*)',\\s*'((?:\\\\.|[^'])*)'").exec(langBlock(RT, l));
    return m ? [unq(m[1]), unq(m[2]), unq(m[3])] : en;
  }
  if (l === 'en') return en;
  return libI18n[l]?.roles?.[e.name] || en;
}
const tipsOf = (l: Lang, e: (typeof ROLE_LIBRARY)[number]): string[] =>
  (l !== 'en' && tipsI18n[l]?.roles?.[e.name]) || ROLE_TIPS[e.name] ||
  (l !== 'en' && tipsI18n[l]?.team?.[e.team]) || TEAM_TIPS[e.team as keyof typeof TEAM_TIPS] || [];

// ---------- page frame ----------
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
// headings for these public pages (the in-app ones talk about "this round")
const PAGE: Record<Lang, { all: string; allSub: string }> = {
  en: { all: 'All roles', allSub: 'Every role you can add to a game of Moonfall — what it does, who it wins with, and tips for playing it.' },
  zh: { all: '全部角色', allSub: 'Moonfall 中可以加入的所有角色——它们的能力、所属阵营，以及游戏技巧。' },
  ko: { all: '모든 역할', allSub: 'Moonfall 게임에 넣을 수 있는 모든 역할 — 능력, 함께 이기는 팀, 그리고 플레이 팁.' },
  ja: { all: 'すべての役職', allSub: 'Moonfall に入れられるすべての役職 — 能力、勝利する陣営、そして遊び方のコツ。' },
  fr: { all: 'Tous les rôles', allSub: 'Tous les rôles que tu peux ajouter à une partie de Moonfall : leur pouvoir, leur camp et des conseils pour les jouer.' },
  th: { all: 'บทบาททั้งหมด', allSub: 'ทุกบทบาทที่ใส่ในเกม Moonfall ได้ — ความสามารถ ฝ่ายที่ชนะด้วย และเคล็ดลับการเล่น' },
  es: { all: 'Todos los roles', allSub: 'Todos los roles que puedes añadir a una partida de Moonfall: qué hacen, con quién ganan y consejos para jugarlos.' },
};
const urlOf = (l: Lang, page: string) => (l === 'en' ? '/' : '/' + l + '/') + page;
const CATS: Record<string, string> = { Village: 'grpVillage', Werewolf: 'grpWolves', Neutral: 'grpNeutral', Special: 'grpSpecial' };
const TEAM: Record<string, string> = { Village: 'teamV', Werewolves: 'teamW', Loner: 'teamL' };

function page(l: Lang, slug: string, title: string, description: string, body: string) {
  const alt = LANGS.map(x => `<link rel="alternate" hreflang="${x}" href="${SITE}${urlOf(x, slug)}" />`).join('\n') +
    `\n<link rel="alternate" hreflang="x-default" href="${SITE}${urlOf('en', slug)}" />`;
  const langs = LANGS.map(x => (x === l ? `<b>${NATIVE[x]}</b>` : `<a href="${urlOf(x, slug)}" hreflang="${x}">${NATIVE[x]}</a>`)).join(' · ');
  return `<!doctype html>
<html lang="${l}">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${esc(title)} · Moonfall</title>
<meta name="description" content="${esc(description)}" />
<link rel="canonical" href="${SITE}${urlOf(l, slug)}" />
${alt}
<link rel="icon" href="/icons/icon-192.png" />
<style>
  :root { color-scheme: dark; }
  body { margin: 0; background: #0f0819; color: #e6def3; font: 16px/1.65 -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Noto Sans", sans-serif; }
  main { max-width: 760px; margin: 0 auto; padding: 24px 20px 64px; }
  nav.top { display: flex; flex-wrap: wrap; gap: 6px 16px; align-items: center; margin-bottom: 18px; font-weight: 600; }
  nav.top .brand { font-family: Georgia, serif; letter-spacing: .18em; color: #f6f1ff; text-decoration: none; margin-right: auto; }
  h1 { font-family: Georgia, "Times New Roman", serif; font-weight: 600; font-size: 32px; margin: 8px 0 6px; color: #f6f1ff; }
  h2 { font-size: 21px; margin: 34px 0 8px; color: #d9c6ff; border-bottom: 1px solid rgba(199,168,255,.18); padding-bottom: 6px; }
  h3 { font-size: 18px; margin: 0; color: #f6f1ff; }
  p, li { color: #cfc3e3; }
  a { color: #c7a8ff; }
  .lead { font-size: 17px; }
  .langs { font-size: 13.5px; color: #9a8db3; margin-bottom: 8px; }
  .role { padding: 14px 16px; margin: 12px 0; border-radius: 14px; background: rgba(28,17,46,.7); border: 1px solid rgba(199,168,255,.12); }
  .role .motto { font-style: italic; color: #b9a8d6; margin: 2px 0 6px; }
  .role .team { font-size: 13px; color: #9a8db3; }
  .role ul { margin: 6px 0 0; padding-left: 20px; font-size: 15px; }
  .cta { display: inline-block; margin-top: 10px; padding: 10px 18px; border-radius: 999px; background: #e9dcff; color: #160b28; font-weight: 700; text-decoration: none; }
  footer { margin-top: 48px; font-size: 13.5px; color: #9a8db3; }
</style>
</head>
<body>
<main>
<nav class="top"><a class="brand" href="/">MOONFALL</a><a href="${urlOf(l, 'how-to-play')}">${esc(t(l, 'guideTitle'))}</a><a href="${urlOf(l, 'roles')}">${esc(PAGE[l].all)}</a></nav>
<div class="langs">${langs}</div>
${body}
<footer><a href="/">Moonfall</a> · <a href="${urlOf(l, 'how-to-play')}">${esc(t(l, 'guideTitle'))}</a> · <a href="${urlOf(l, 'roles')}">${esc(PAGE[l].all)}</a> · <a href="/privacy">${esc(t(l, 'privacy'))}</a></footer>
</main>
</body>
</html>
`;
}

// ---------- the pages ----------
function howToPlay(l: Lang) {
  const p = (k: string) => `<p>${esc(t(l, k))}</p>`;
  const rules = ['rule1', 'rule2', 'rule3'].map(k => t(l, k)).filter(Boolean).map(r => `<li>${esc(r)}</li>`).join('');
  const body = `<h1>${esc(t(l, 'guideTitle'))}</h1>
<p class="lead">${esc(t(l, 'tagline'))}</p>
<h2>${esc(t(l, 'aboutHead'))}</h2>${p('aboutText')}
<h2>${esc(t(l, 'winHead'))}</h2>
<h3>${esc(t(l, 'winVillageT'))}</h3>${p('winVillage')}
<h3>${esc(t(l, 'winWolvesT'))}</h3>${p('winWolves')}
<h2>${esc(t(l, 'flowHead'))}</h2>
<h3>${esc(t(l, 'night'))}</h3>${p('nightText')}
<h3>${esc(t(l, 'day'))}</h3>${p('dayText')}
<h2>${esc(t(l, 'rulesHead'))}</h2><ol>${rules}</ol>
<h2>${esc(PAGE[l].all)}</h2>
<p>${esc(PAGE[l].allSub)}</p>
<ul>${ROLE_LIBRARY.slice(0, 12).map(e => `<li><a href="${urlOf(l, 'roles')}#${slugOf(e.name)}">${esc(roleText(l, e)[0])}</a></li>`).join('')}</ul>
<a class="cta" href="${urlOf(l, 'roles')}">${esc(PAGE[l].all)} →</a>`;
  return page(l, 'how-to-play', t(l, 'guideTitle'), t(l, 'aboutText'), body);
}
const slugOf = (s: string) => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
function roles(l: Lang) {
  const sections = LIB_CATS.map(c => {
    const list = ROLE_LIBRARY.filter(e => e.cat === c).map(e => {
      const [name, motto, desc] = roleText(l, e);
      const tips = tipsOf(l, e).map(x => `<li>${esc(x)}</li>`).join('');
      return `<article class="role" id="${slugOf(e.name)}"><h3>${esc(name)}</h3>${motto ? `<p class="motto">${esc(motto)}</p>` : ''}<p class="team">${esc(t(l, TEAM[e.team] || 'teamL'))}</p><p>${esc(desc)}</p>${tips ? `<ul>${tips}</ul>` : ''}</article>`;
    }).join('\n');
    return `<h2>${esc(t(l, CATS[c]) || c)}</h2>\n${list}`;
  }).join('\n');
  const body = `<h1>${esc(PAGE[l].all)}</h1>\n<p class="lead">${esc(PAGE[l].allSub)}</p>\n${sections}`;
  return page(l, 'roles', PAGE[l].all, PAGE[l].allSub, body);
}

if (!fs.existsSync(DIST)) throw new Error('dist/ not found — run vite build first');
const urls: string[] = ['/', '/privacy'];
for (const l of LANGS) {
  const dir = l === 'en' ? DIST : path.join(DIST, l);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'how-to-play.html'), howToPlay(l));
  fs.writeFileSync(path.join(dir, 'roles.html'), roles(l));
  urls.push(urlOf(l, 'how-to-play'), urlOf(l, 'roles'));
}
fs.writeFileSync(path.join(DIST, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url><loc>${SITE}${u}</loc></url>`).join('\n')}
</urlset>
`);
fs.writeFileSync(path.join(DIST, 'robots.txt'), `User-agent: *\nDisallow: /host\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`);
console.log(`pages: ${LANGS.length * 2} guide pages + sitemap (${urls.length} urls) for ${SITE}`);
