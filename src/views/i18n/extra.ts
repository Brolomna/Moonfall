// Newer player-phone lines — hold-to-peek, death notices, the lobby chat, vote results, recap and tutorial buttons — 7 languages.
const X = {
  en: {
    holdToSee: 'Hold to see your role', letGo: 'Let go to hide it',
    died: '{name} died', and: ' & ', diedKicker: 'A loss in the village',
    chat: 'Chat', chatTitle: 'Lobby chat', chatSub: 'Talk while you wait. The chat closes when the cards are dealt.', chatPh: 'Say hi…', chatSend: 'Send', chatEmpty: 'No messages yet — say hi!', you: 'you',
    vrTitle: 'Vote results', vrAnon: 'Anonymous — only the totals are shown.', vrVotes: '{n} votes', vrVote: '1 vote', vrOut: '{name} is voted out', vrNone: 'No one is voted out', vrTie: 'It’s a tie', vrHost: 'The host', ok: 'OK',
    recap: 'Match recap', tutorial: 'Interactive tutorial',
  },
  zh: {
    holdToSee: '按住查看身份', letGo: '松开即可隐藏',
    died: '{name} 死了', and: '、', diedKicker: '村庄失去了一位成员',
    chat: '聊天', chatTitle: '大厅聊天', chatSub: '等待时聊聊天。发牌后聊天关闭。', chatPh: '打个招呼…', chatSend: '发送', chatEmpty: '还没有消息——打个招呼吧！', you: '你',
    vrTitle: '投票结果', vrAnon: '匿名投票——只显示总票数。', vrVotes: '{n} 票', vrVote: '1 票', vrOut: '{name} 被投票出局', vrNone: '没有人被投出', vrTie: '平票', vrHost: '主持人', ok: '好的',
    recap: '本局回顾', tutorial: '互动教程',
  },
  ko: {
    holdToSee: '꾹 눌러서 역할 보기', letGo: '손을 떼면 숨겨져요',
    died: '{name} 님이 죽었어요', and: ', ', diedKicker: '마을에 비극이',
    chat: '채팅', chatTitle: '대기실 채팅', chatSub: '기다리는 동안 이야기해요. 카드가 나눠지면 채팅이 닫혀요.', chatPh: '인사해 보세요…', chatSend: '보내기', chatEmpty: '아직 메시지가 없어요. 먼저 인사해 보세요!', you: '나',
    vrTitle: '투표 결과', vrAnon: '익명 투표 — 총 표수만 보여요.', vrVotes: '{n}표', vrVote: '1표', vrOut: '{name} 님이 투표로 추방됐어요', vrNone: '아무도 추방되지 않았어요', vrTie: '동점이에요', vrHost: '진행자', ok: '확인',
    recap: '게임 하이라이트', tutorial: '인터랙티브 튜토리얼',
  },
  ja: {
    holdToSee: '長押しで役職を見る', letGo: '指を離すと隠れます',
    died: '{name} が死亡しました', and: '、', diedKicker: '村に悲劇が',
    chat: 'チャット', chatTitle: 'ロビーチャット', chatSub: '待っている間に話しましょう。カードが配られるとチャットは閉じます。', chatPh: 'あいさつしよう…', chatSend: '送信', chatEmpty: 'まだメッセージはありません。あいさつしてみよう！', you: '自分',
    vrTitle: '投票結果', vrAnon: '匿名です — 合計だけが表示されます。', vrVotes: '{n} 票', vrVote: '1 票', vrOut: '{name} が追放されました', vrNone: '誰も追放されませんでした', vrTie: '同票です', vrHost: '司会', ok: 'OK',
    recap: 'ハイライト', tutorial: 'インタラクティブ・チュートリアル',
  },
  fr: {
    holdToSee: 'Maintiens pour voir ton rôle', letGo: 'Relâche pour le cacher',
    died: '{name} est mort·e', and: ' & ', diedKicker: 'Le village est en deuil',
    chat: 'Chat', chatTitle: 'Chat d’attente', chatSub: 'Discutez en attendant. Le chat se ferme quand les cartes sont distribuées.', chatPh: 'Dis bonjour…', chatSend: 'Envoyer', chatEmpty: 'Aucun message — dis bonjour !', you: 'toi',
    vrTitle: 'Résultats du vote', vrAnon: 'Anonyme — seuls les totaux sont affichés.', vrVotes: '{n} voix', vrVote: '1 voix', vrOut: '{name} est éliminé·e par le vote', vrNone: 'Personne n’est éliminé', vrTie: 'Égalité', vrHost: 'L’hôte', ok: 'OK',
    recap: 'Le récap de la partie', tutorial: 'Tutoriel interactif',
  },
  th: {
    holdToSee: 'กดค้างเพื่อดูบทบาท', letGo: 'ปล่อยนิ้วเพื่อซ่อน',
    died: '{name} ตายแล้ว', and: ' และ ', diedKicker: 'หมู่บ้านสูญเสีย',
    chat: 'แชท', chatTitle: 'แชทห้องรอ', chatSub: 'คุยกันระหว่างรอ แชทจะปิดเมื่อแจกการ์ดแล้ว', chatPh: 'ทักทายหน่อย…', chatSend: 'ส่ง', chatEmpty: 'ยังไม่มีข้อความ — ทักทายเลย!', you: 'คุณ',
    vrTitle: 'ผลโหวต', vrAnon: 'โหวตแบบไม่ระบุตัวตน — แสดงเฉพาะคะแนนรวม', vrVotes: '{n} โหวต', vrVote: '1 โหวต', vrOut: '{name} ถูกโหวตออก', vrNone: 'ไม่มีใครถูกโหวตออก', vrTie: 'คะแนนเท่ากัน', vrHost: 'ผู้ดำเนินเกม', ok: 'ตกลง',
    recap: 'สรุปไฮไลต์เกม', tutorial: 'บทเรียนแบบโต้ตอบ',
  },
  es: {
    holdToSee: 'Mantén pulsado para ver tu rol', letGo: 'Suelta para ocultarlo',
    died: '{name} ha muerto', and: ' y ', diedKicker: 'El pueblo está de luto',
    chat: 'Chat', chatTitle: 'Chat de espera', chatSub: 'Hablad mientras esperáis. El chat se cierra al repartir las cartas.', chatPh: 'Saluda…', chatSend: 'Enviar', chatEmpty: 'Aún no hay mensajes. ¡Saluda!', you: 'tú',
    vrTitle: 'Resultado de la votación', vrAnon: 'Anónima: solo se muestran los totales.', vrVotes: '{n} votos', vrVote: '1 voto', vrOut: '{name} ha sido expulsado/a', vrNone: 'Nadie ha sido expulsado', vrTie: 'Empate', vrHost: 'El anfitrión', ok: 'OK',
    recap: 'Resumen de la partida', tutorial: 'Tutorial interactivo',
  },
};

export type ExtraText = typeof X.en;
export function extraText(lang: string): ExtraText {
  return { ...X.en, ...((X as Record<string, Partial<ExtraText>>)[lang] || {}) };
}
