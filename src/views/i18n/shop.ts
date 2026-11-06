// Player-phone lines for the werewolves' bluff pick and the items bag / shop — 7 languages.
const S = {
  en: {
    bluffBtn: 'Bluff', bluffTitle: 'Pick your bluff', bluffSub: 'Choose the role you will pretend to be. Only your pack sees your pick.', bluffMine: 'Your bluff', bluffPack: 'Your pack',
    bluffNone: 'not picked yet', bluffClosed: 'The pick is closed — remember your role!', bluffUndo: 'Change',
    bag: 'Items', bagTitle: 'Your items', shop: 'Shop', pts: '{n} pts', use: 'Use item', used: 'Used', usedGame: 'Used this game', confirmUse: 'Use {item} now? The host will be told.',
    yes: 'Use it', cancel: 'Cancel', buy: 'Buy · {n} pts', notEnough: 'Not enough points', empty: 'No items yet. Win games to earn points.', artifact: 'Artifact · once per game', powerup: 'Power-up · one use',
    onlyInGame: 'Items can be used during a game.', sent: 'Sent to the host', bought: 'Sent — it will appear in your items', hostAway: 'The host isn’t connected. Try again in a moment.', close: 'Close',
  },
  ko: {
    bluffBtn: '블러프', bluffTitle: '블러프 역할 고르기', bluffSub: '흉내 낼 역할을 하나 고르세요. 내 선택은 같은 늑대 팀만 볼 수 있어요.', bluffMine: '내 블러프', bluffPack: '우리 팀',
    bluffNone: '아직 고르지 않음', bluffClosed: '선택이 끝났어요. 내 역할을 기억하세요!', bluffUndo: '바꾸기',
    bag: '아이템', bagTitle: '내 아이템', shop: '상점', pts: '{n}점', use: '아이템 사용', used: '사용함', usedGame: '이번 게임에 사용함', confirmUse: '지금 {item}을(를) 사용할까요? 진행자에게 알려져요.',
    yes: '사용하기', cancel: '취소', buy: '구매 · {n}점', notEnough: '포인트가 부족해요', empty: '아직 아이템이 없어요. 게임에서 이기면 포인트를 받아요.', artifact: '아티팩트 · 게임마다 1번', powerup: '파워업 · 1회용',
    onlyInGame: '아이템은 게임 중에 사용할 수 있어요.', sent: '진행자에게 보냈어요', bought: '요청했어요. 곧 내 아이템에 들어와요', hostAway: '진행자가 연결되어 있지 않아요. 잠시 후 다시 시도하세요.', close: '닫기',
  },
  zh: {
    bluffBtn: '伪装', bluffTitle: '选择你的伪装身份', bluffSub: '选一个你要假装的身份。只有你的狼队友能看到。', bluffMine: '我的伪装', bluffPack: '狼队友',
    bluffNone: '还没选', bluffClosed: '选择已结束——记住你的身份！', bluffUndo: '更换',
    bag: '道具', bagTitle: '我的道具', shop: '商店', pts: '{n} 分', use: '使用道具', used: '已使用', usedGame: '本局已使用', confirmUse: '现在使用{item}吗？主持人会收到通知。',
    yes: '使用', cancel: '取消', buy: '购买 · {n} 分', notEnough: '积分不足', empty: '还没有道具。赢得游戏即可获得积分。', artifact: '神器 · 每局一次', powerup: '强化道具 · 一次性',
    onlyInGame: '道具只能在游戏中使用。', sent: '已通知主持人', bought: '已发送——稍后会出现在你的道具里', hostAway: '主持人未连接，请稍后再试。', close: '关闭',
  },
  ja: {
    bluffBtn: 'ブラフ', bluffTitle: 'ブラフ役職を選ぶ', bluffSub: 'なりすます役職を1つ選んでください。選択は仲間の人狼だけに見えます。', bluffMine: '自分のブラフ', bluffPack: '仲間',
    bluffNone: 'まだ選んでいない', bluffClosed: '選択は終わりました。役職を覚えておこう！', bluffUndo: '変更',
    bag: 'アイテム', bagTitle: '持っているアイテム', shop: 'ショップ', pts: '{n} pt', use: 'アイテムを使う', used: '使用済み', usedGame: 'このゲームで使用済み', confirmUse: '今{item}を使いますか？ホストに通知されます。',
    yes: '使う', cancel: 'キャンセル', buy: '購入 · {n} pt', notEnough: 'ポイントが足りません', empty: 'まだアイテムはありません。勝つとポイントがもらえます。', artifact: 'アーティファクト · 1ゲーム1回', powerup: 'パワーアップ · 1回のみ',
    onlyInGame: 'アイテムはゲーム中に使えます。', sent: 'ホストに送りました', bought: '送信しました。まもなくアイテムに追加されます', hostAway: 'ホストが接続していません。少し待ってからもう一度。', close: '閉じる',
  },
  es: {
    bluffBtn: 'Farol', bluffTitle: 'Elige tu farol', bluffSub: 'Elige el rol que vas a fingir ser. Solo tu manada ve tu elección.', bluffMine: 'Tu farol', bluffPack: 'Tu manada',
    bluffNone: 'aún sin elegir', bluffClosed: 'La elección se cerró. ¡Recuerda tu rol!', bluffUndo: 'Cambiar',
    bag: 'Objetos', bagTitle: 'Tus objetos', shop: 'Tienda', pts: '{n} pts', use: 'Usar objeto', used: 'Usado', usedGame: 'Usado en esta partida', confirmUse: '¿Usar {item} ahora? Se avisará al anfitrión.',
    yes: 'Usarlo', cancel: 'Cancelar', buy: 'Comprar · {n} pts', notEnough: 'No tienes puntos suficientes', empty: 'Aún no tienes objetos. Gana partidas para ganar puntos.', artifact: 'Artefacto · una vez por partida', powerup: 'Potenciador · un solo uso',
    onlyInGame: 'Los objetos se usan durante una partida.', sent: 'Enviado al anfitrión', bought: 'Enviado: aparecerá en tus objetos', hostAway: 'El anfitrión no está conectado. Inténtalo en un momento.', close: 'Cerrar',
  },
  fr: {
    bluffBtn: 'Bluff', bluffTitle: 'Choisis ton bluff', bluffSub: 'Choisis le rôle que tu vas faire semblant d’être. Seule ta meute voit ton choix.', bluffMine: 'Ton bluff', bluffPack: 'Ta meute',
    bluffNone: 'pas encore choisi', bluffClosed: 'Le choix est terminé — retiens ton rôle !', bluffUndo: 'Changer',
    bag: 'Objets', bagTitle: 'Tes objets', shop: 'Boutique', pts: '{n} pts', use: 'Utiliser l’objet', used: 'Utilisé', usedGame: 'Utilisé cette partie', confirmUse: 'Utiliser {item} maintenant ? L’hôte sera prévenu.',
    yes: 'Utiliser', cancel: 'Annuler', buy: 'Acheter · {n} pts', notEnough: 'Pas assez de points', empty: 'Pas encore d’objets. Gagne des parties pour gagner des points.', artifact: 'Artefact · une fois par partie', powerup: 'Bonus · usage unique',
    onlyInGame: 'Les objets s’utilisent pendant une partie.', sent: 'Envoyé à l’hôte', bought: 'Envoyé — il apparaîtra dans tes objets', hostAway: 'L’hôte n’est pas connecté. Réessaie dans un instant.', close: 'Fermer',
  },
  th: {
    bluffBtn: 'บลัฟ', bluffTitle: 'เลือกบทบาทบลัฟ', bluffSub: 'เลือกบทบาทที่คุณจะแกล้งเป็น เฉพาะฝูงหมาป่าของคุณที่เห็นตัวเลือกนี้', bluffMine: 'บลัฟของฉัน', bluffPack: 'ฝูงของฉัน',
    bluffNone: 'ยังไม่ได้เลือก', bluffClosed: 'ปิดการเลือกแล้ว — จำบทบาทของคุณไว้!', bluffUndo: 'เปลี่ยน',
    bag: 'ไอเทม', bagTitle: 'ไอเทมของฉัน', shop: 'ร้านค้า', pts: '{n} แต้ม', use: 'ใช้ไอเทม', used: 'ใช้แล้ว', usedGame: 'ใช้ในเกมนี้แล้ว', confirmUse: 'ใช้ {item} ตอนนี้เลยไหม? ผู้ดำเนินเกมจะได้รับแจ้ง',
    yes: 'ใช้เลย', cancel: 'ยกเลิก', buy: 'ซื้อ · {n} แต้ม', notEnough: 'แต้มไม่พอ', empty: 'ยังไม่มีไอเทม ชนะเกมเพื่อรับแต้ม', artifact: 'อาร์ทิแฟกต์ · เกมละครั้ง', powerup: 'พาวเวอร์อัป · ใช้ได้ครั้งเดียว',
    onlyInGame: 'ใช้ไอเทมได้ระหว่างเกม', sent: 'ส่งถึงผู้ดำเนินเกมแล้ว', bought: 'ส่งแล้ว — จะเข้าไปอยู่ในไอเทมของคุณ', hostAway: 'ผู้ดำเนินเกมไม่ได้เชื่อมต่อ ลองใหม่อีกครั้งในอีกสักครู่', close: 'ปิด',
  },
};
export type ShopText = typeof S.en;
export const shopText = (lang: string): ShopText => (S as Record<string, ShopText>)[lang] || S.en;
