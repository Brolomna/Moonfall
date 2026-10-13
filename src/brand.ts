// Support & sponsor: the donation link and the player-facing lines (7 languages).
// The sponsor itself (name, offer, link, logo) is set by the host in the app (Players screen → Sponsor).

/** Ko-fi / PayPal.me link for the "Support Moonfall" button. Empty → the button is hidden everywhere. */
export const DONATE_URL = '';

export type Sponsor = { name: string; offer?: string; link?: string; logo?: string } | null;

const T = {
  en: { by: 'Tonight’s game is brought to you by {name}', head: 'Tonight’s sponsor', visit: 'Visit', supportLine: 'Enjoyed Moonfall? Help keep it alive.', support: 'Support Moonfall ☕' },
  zh: { by: '今晚的游戏由 {name} 赞助', head: '今晚的赞助商', visit: '去看看', supportLine: '喜欢 Moonfall 吗？帮它继续走下去。', support: '支持 Moonfall ☕' },
  ko: { by: '오늘 밤 게임은 {name}의 후원으로 진행돼요', head: '오늘의 후원', visit: '방문하기', supportLine: 'Moonfall이 재밌었나요? 계속될 수 있게 응원해 주세요.', support: 'Moonfall 후원하기 ☕' },
  ja: { by: '今夜のゲームは {name} の提供でお送りします', head: '今夜のスポンサー', visit: '見に行く', supportLine: 'Moonfall は楽しめましたか？続けていくための応援をお願いします。', support: 'Moonfall を応援する ☕' },
  fr: { by: 'La partie de ce soir vous est offerte par {name}', head: 'Sponsor de la soirée', visit: 'Découvrir', supportLine: 'Tu as aimé Moonfall ? Aide-le à continuer.', support: 'Soutenir Moonfall ☕' },
  th: { by: 'เกมคืนนี้สนับสนุนโดย {name}', head: 'ผู้สนับสนุนคืนนี้', visit: 'เยี่ยมชม', supportLine: 'ชอบ Moonfall ไหม? ช่วยให้เกมนี้ไปต่อได้นะ', support: 'สนับสนุน Moonfall ☕' },
  es: { by: 'La partida de esta noche te la trae {name}', head: 'Patrocinador de esta noche', visit: 'Visitar', supportLine: '¿Te gustó Moonfall? Ayuda a que siga vivo.', support: 'Apoyar Moonfall ☕' },
};
export const brandText = (lang: string) => (T as Record<string, typeof T.en>)[lang] || T.en;
