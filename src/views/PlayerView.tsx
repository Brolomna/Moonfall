// @ts-nocheck
// Generated from design/Player.dc.html by tools/dc2tsx.py, then hand-wired to the room server (see NET: comments).
import React from 'react';
import './PlayerView.css';
import { ROLE_LIBRARY } from './roleLibrary';
import { LIB_I18N } from './i18n';

export class PlayerView extends React.Component<any, any> {
  // NET: turn the card face-down again whenever the host marks this player out / in
  componentDidUpdate(prev) {
    if (prev.fate !== this.props.fate || prev.role !== this.props.role) this.setState({ revealed: false });
  }

  roles() {
    const village = 'Find and vote out every werewolf';
    const wolfGoal = 'Outnumber the villagers';
    const x = (name, team, color, rgb, motif, motto, desc, icon, goal) => ({ name, team, color, rgb, motif, motto, desc, icon, goal: goal || (team === 'Werewolves' ? wolfGoal : village) });
    const extra = {
      mason: x('Mason', 'Village', '#d9b48a', '217,180,138', 'village', 'Bound by stone', 'On the first night the host wakes all the Masons together, so you know who they are. You can trust each other.', 'M3 20h18 M4 20V8h16v12 M4 12h16 M4 16h16 M9 8v4 M15 8v4 M12 12v4 M8 16v4 M16 16v4'),
      bodyguard: x('Bodyguard', 'Village', '#8fd3e8', '143,211,232', 'healer', 'I’ll take the bite', 'When the host wakes you, point at one player to guard. If the wolves attack them, you die in their place. You can’t guard yourself.', 'M12 3l8 3v6c0 4.8-3.4 8-8 9-4.6-1-8-4.2-8-9V6z M12 8l1.2 2.6 2.8.3-2.1 1.9.6 2.8L12 14.2l-2.5 1.4.6-2.8L8 10.9l2.8-.3z'),
      apprentice: x('Apprentice Seer', 'Village', '#a6c8ff', '166,200,255', 'seer', 'The sight passes to you', 'You sleep until the Seer is eliminated. After that, the host wakes you each night and you use the Seer’s power.', 'M3 13s3-5 9-5 9 5 9 5-3 5-9 5-9-5-9-5z M12 11a2 2 0 1 0 0 4a2 2 0 1 0 0-4z M12 2v3 M6.5 4l1.2 2 M17.5 4l-1.2 2'),
      prince: x('Prince', 'Village', '#f2d06b', '242,208,107', 'generic', 'Royal blood', 'If the village votes to eliminate you, show this card instead. You survive, and everyone now knows you are the Prince.', 'M3 18h18 M4 18L3 7l5 4 4-7 4 7 5-4-1 11'),
      toughguy: x('Tough Guy', 'Village', '#f29a7a', '242,154,122', 'hunter', 'Too stubborn to fall', 'If the werewolves attack you, you don’t die right away. You are eliminated at the end of the next day instead.', 'M6 7v10 M18 7v10 M3 9.5v5 M21 9.5v5 M6 12h12'),
      mayor: x('Mayor', 'Village', '#b8c4ff', '184,196,255', 'village', 'Your voice counts twice', 'Show this card at any time during the day. From then on, your vote counts as two votes.', 'M6 3h12v18l-6-3-6 3z M9 8h6 M9 11.5h6'),
      idiot: x('Village Idiot', 'Village', '#d8e08a', '216,224,138', 'generic', 'Chaos is your friend', 'You are on the village side, but whenever there is a vote you must always vote to eliminate someone.', 'M4 19l3-13 5 6 5-6 3 13z M4 19h16 M7 6a1 1 0 1 0 0-.01 M17 6a1 1 0 1 0 0-.01'),
      oldhag: x('Old Hag', 'Village', '#9fd6b8', '159,214,184', 'witch', 'Begone till sundown', 'When the host wakes you, point at one player. They must leave the table for the next day and can’t talk or vote.', 'M6 21V4.5L16 3v18 M3 21h18 M13 12.5h.01 M16 5h3v16'),
      lycan: x('Lycan', 'Village', '#c48aa0', '196,138,160', 'wolf', 'Cursed blood, pure heart', 'You are on the village side, but if the Seer checks you, the host shows you as a werewolf. Convince them you’re innocent.', 'M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5z M8 9.5l2 4.5 M11.5 8.5l2 4.5'),
      cursed: x('Cursed', 'Village', '#a58ad6', '165,138,214', 'witch', 'One bite away', 'You start on the village side. If the werewolves attack you, you don’t die — the host secretly tells you that you are now a werewolf.', 'M3 6c3 1.5 6 1.5 9 0 3 1.5 6 1.5 9 0v5c0 5-4 9-9 9s-9-4-9-9z M7.5 11h2.5 M14 11h2.5 M9 16c2 1 4 1 6 0'),
      wolfcub: x('Wolf Cub', 'Werewolves', '#ff6f61', '255,111,97', 'wolf', 'Avenge me', 'You wake with the werewolves. If you are eliminated, the pack is enraged and eliminates two players the following night.', 'M5.5 8a1.5 2 0 1 0 0 4a1.5 2 0 1 0 0-4z M9.5 4a1.5 2 0 1 0 0 4a1.5 2 0 1 0 0-4z M14.5 4a1.5 2 0 1 0 0 4a1.5 2 0 1 0 0-4z M18.5 8a1.5 2 0 1 0 0 4a1.5 2 0 1 0 0-4z M12 12c-3 0-5.5 3-5.5 5.5 0 1.8 1.5 2.5 3 2.5 1 0 1.6-.5 2.5-.5s1.5.5 2.5.5c1.5 0 3-.7 3-2.5C17.5 15 15 12 12 12z'),
      minion: x('Minion', 'Werewolves', '#d14a7a', '209,74,122', 'wolf', 'Loyal to the pack', 'On the first night the werewolves raise their thumbs so you can see them. They don’t know you. Help them win without getting caught.', 'M12 2l2 4v9h-4V6z M7 15h10 M12 15v7'),
      sorceress: x('Sorceress', 'Werewolves', '#b45cc7', '180,92,199', 'witch', 'Seeking the seer', 'You are on the werewolves’ side but don’t wake with them. Each night, point at one player — the host shows you if they are the Seer.', 'M12 3a7 7 0 1 0 0 14a7 7 0 1 0 0-14z M6 21h12 M8.5 17l-1 4 M15.5 17l1 4 M9 9a3 3 0 0 1 3-3'),
      tanner: x('Tanner', 'Loner', '#c9a27a', '201,162,122', 'generic', 'Tired of it all', 'You win only if the village votes you out. Act just suspicious enough to get chosen — but not so obviously that they catch on.', 'M12 3a7 7 0 0 0-7 7c0 2.6 1.3 4.3 3 5.3V19h8v-3.7c1.7-1 3-2.7 3-5.3a7 7 0 0 0-7-7z M8.5 11a1 1 0 1 0 2 0a1 1 0 1 0-2 0z M13.5 11a1 1 0 1 0 2 0a1 1 0 1 0-2 0z', 'Get yourself voted out'),
      doppelganger: x('Doppelgänger', 'Loner', '#9aa7b8', '154,167,184', 'generic', 'Wear another’s face', 'On the first night, when the host wakes you, point at one player. If that player dies, you secretly become their role — your card will change.', 'M8 4a3.5 3.5 0 1 0 0 7a3.5 3.5 0 1 0 0-7z M16 4a3.5 3.5 0 1 0 0 7a3.5 3.5 0 1 0 0-7z M2 20c0-3.3 2.7-6 6-6 1.6 0 3 .6 4 1.6 1-1 2.4-1.6 4-1.6 3.3 0 6 2.7 6 6', 'Win with the team you copy'),
      fortune: x('Fortune Teller', 'Village', '#8fd3e8', '143,211,232', 'generic', 'Your custom role', 'Once per game, when the host wakes you at night, point at a player. The host shows you their exact role.', 'M12 3a7 7 0 1 0 0 14a7 7 0 1 0 0-14z M6 21h12 M8.5 17l-1 4 M15.5 17l1 4 M9 9a3 3 0 0 1 3-3')
    };
    return { ...extra, ...this.core(village) };
  }
  core(village) {
    return {
      werewolf: { name: 'Werewolf', team: 'Werewolves', color: '#e0475f', rgb: '224,71,95', tint: '#3a0d1a', motto: 'Hunt by moonlight', desc: 'When the host wakes the werewolves, open your eyes, find your pack and silently point at one player to eliminate. By day, act innocent.', goal: 'Outnumber the villagers', icon: 'M4 3l3.5 5.5L12 7l4.5 1.5L20 3l-.5 9-3.5 5-4 4-4-4-3.5-5z M9 12.5l1.5 1 M15 12.5l-1.5 1 M10.5 17.5h3L12 19z' },
      seer: { name: 'Seer', team: 'Village', color: '#7fb2ff', rgb: '127,178,255', tint: '#0f2144', motto: 'Nothing hides from you', desc: 'When the host wakes you at night, point at one player. The host will silently show you whether they are a werewolf.', goal: village, icon: 'M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z M12 9a3 3 0 1 0 0 6a3 3 0 1 0 0-6z M12 1.5v1.5 M4.5 3.5l1 1.2 M19.5 3.5l-1 1.2' },
      healer: { name: 'Healer', team: 'Village', color: '#62d4a6', rgb: '98,212,166', tint: '#0b2e24', motto: 'Not on my watch', desc: 'When the host wakes you at night, point at one player to protect. If the werewolves chose them, they survive.', goal: village, icon: 'M12 3l8 3v6c0 4.8-3.4 8-8 9-4.6-1-8-4.2-8-9V6z M12 8.5v7 M8.5 12h7' },
      witch: { name: 'Witch', team: 'Village', color: '#c98bf2', rgb: '201,139,242', tint: '#2a1146', motto: 'Two potions, one chance', desc: 'You have one potion to save a player and one poison to eliminate a player. Each can be used once, when the host wakes you.', goal: village, icon: 'M9 3h6 M10 3v5.5L5 18.2A1.9 1.9 0 0 0 6.7 21h10.6a1.9 1.9 0 0 0 1.7-2.8L14 8.5V3 M7.5 15h9 M11 12h.01 M13.5 17.5h.01' },
      hunter: { name: 'Hunter', team: 'Village', color: '#f2a65a', rgb: '242,166,90', tint: '#33190a', motto: 'One last arrow', desc: 'If you are eliminated — at night or by vote — immediately point at one other player. They are eliminated with you.', goal: village, icon: 'M6 3c7 2.5 7 15.5 0 18 M6 3v18 M3 12h17 M17 9l3 3-3 3' },
      villager: { name: 'Villager', team: 'Village', color: '#e8d3a0', rgb: '232,211,160', tint: '#2a2112', motto: 'Wits are your weapon', desc: 'You have no night power — keep your eyes closed at night. By day, talk, watch for lies and vote out the werewolves.', goal: village, icon: 'M9 4h6 M12 2v2 M7.5 7h9l-.8 11.5H8.3z M6.5 20.5h11 M12 10.5c1.3 1.3 1.3 3 0 4.5-1.3-1.5-1.3-3.2 0-4.5z' },
      cupid: { name: 'Cupid', team: 'Village', color: '#f08fb8', rgb: '240,143,184', tint: '#3a1228', motto: 'Love is a weapon too', desc: 'On the first night, point at two players. They fall in love — if one of them is eliminated, the other is eliminated too.', goal: village, icon: 'M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z M3 21L21 3 M16 3h5v5', custom: true }
    };
  }
  langList() {
    return [
      { code: 'en', native: 'English', english: 'English', tag: 'EN', short: 'EN' },
      { code: 'zh', native: '中文', english: 'Chinese (Simplified)', tag: 'ZH', short: '中文' },
      { code: 'ko', native: '한국어', english: 'Korean', tag: 'KO', short: '한국어' },
      { code: 'ja', native: '日本語', english: 'Japanese', tag: 'JA', short: '日本語' },
      { code: 'fr', native: 'Français', english: 'French', tag: 'FR', short: 'FR' },
      { code: 'th', native: 'ไทย', english: 'Thai', tag: 'TH', short: 'ไทย' },
      { code: 'es', native: 'Español', english: 'Spanish', tag: 'ES', short: 'ES' }
    ];
  }
  ui() {
    return {
      en: {
        tagline: 'A game of wolves & whispers', connected: 'Connected to room HOWL', whatsName: 'What’s your name?', namePh: 'Type your name', nameHelp: 'This is how the others will see you.', join: 'Join the game',
        youreIn: 'You’re in, {name}!', sitBack: 'Sit back. Your card will appear here when the host deals.', waitingHost: 'Waiting for the host · {n} players', protoDeal: 'Prototype: host deals the cards',
        night: 'Night', day: 'Day', tapToSee: 'Tap to see your role', yourRole: 'Your role', teamVillage: 'Team Village', teamWolves: 'Team Werewolves', onYourOwn: 'On your own',
        hintHide: 'Tap the card again to hide it', hintPeek: 'Only look when no one is peeking', hintHad: 'Tap the card to see the role you had', hintFell: 'Tap to see how you fell',
        protoLabel: 'Prototype · what the host does', toDay: 'To Day', toNight: 'To Night', killed: 'Killed', voted: 'Voted out', revive: 'Revive',
        goalVillage: 'Find and vote out every werewolf', goalWolves: 'Outnumber the villagers', goalTanner: 'Get yourself voted out', goalDopp: 'Win with the team you copy', goalLoner: 'Win alone — follow your card', reconnecting: 'Reconnecting…',
        whenKilled: 'Night 2 · eliminated', killedT1: 'TAKEN BY', killedT2: 'THE WOLVES', killedLine: 'The pack found you while the village slept.', youWereA: 'You were the ', youWereB: '', killedRule: 'The dead tell no tales — stay silent, no hints, no faces.',
        whenVoted: 'Day 2 · the vote is cast', votedT1: 'CAST OUT BY', votedT2: 'THE VILLAGE', votedLine: 'Fingers pointed, torches rose — and they chose you.', votedRule: 'No more votes, no more words. Watch the story unfold.', exiled: 'EXILED', byVillage: 'by the village',
        guideBtn: 'Game guide', guideTitle: 'How to play', aboutHead: 'The game', aboutText: 'Moonfall is a game of hidden roles. A few players are secretly werewolves; everyone else is the village. Nobody knows who is who — except for their own card.',
        winHead: 'How to win', winVillageT: 'The village', winVillage: 'Find the werewolves and vote every one of them out.', winWolvesT: 'The werewolves', winWolves: 'Eliminate villagers until the wolves equal or outnumber everyone else.',
        flowHead: 'Night & day', nightText: 'Everyone closes their eyes. Open them only when the host calls your role, then act silently.', dayText: 'Everyone wakes. The host says who was eliminated. Talk, accuse, then vote one player out.',
        rulesHead: 'Golden rules', rule1: 'Never show your card to anyone.', rule2: 'If you are out, stay silent until the game ends.', rule3: 'The host’s word is final.',
        rolesHead: 'Roles in this round', rolesSub: 'These cards were shuffled and dealt. Any of them could be yours — or your neighbour’s.', cardsChip: '{n} cards',
        teamV: 'Village', teamW: 'Werewolves', teamL: 'On their own', close: 'Got it', langTitle: 'Language', langSub: 'Choose the language for your phone.'
      },
      zh: {
        tagline: '狼与低语的游戏', connected: '已连接房间 HOWL', whatsName: '你叫什么名字？', namePh: '输入你的名字', nameHelp: '其他玩家会看到这个名字。', join: '加入游戏',
        youreIn: '{name}，你已加入！', sitBack: '请稍候。主持人发牌后，你的卡牌会出现在这里。', waitingHost: '等待主持人 · {n} 名玩家', protoDeal: '原型：主持人发牌',
        night: '夜晚', day: '白天', tapToSee: '点击查看身份', yourRole: '你的身份', teamVillage: '村民阵营', teamWolves: '狼人阵营', onYourOwn: '独立阵营',
        hintHide: '再次点击卡牌即可隐藏', hintPeek: '确认没人偷看时再查看', hintHad: '点击卡牌查看你曾经的身份', hintFell: '点击查看出局卡',
        protoLabel: '原型 · 主持人操作', toDay: '切到白天', toNight: '切到夜晚', killed: '被杀', voted: '被投出', revive: '复活',
        goalVillage: '找出并投票放逐所有狼人', goalWolves: '狼人数量与村民相等即获胜', goalTanner: '被投票放逐即获胜', goalDopp: '与你复制的身份同阵营获胜',
        whenKilled: '第2夜 · 出局', killedT1: '被狼群', killedT2: '吞噬', killedLine: '村庄沉睡之时，狼群找到了你。', youWereA: '你的身份是', youWereB: '', killedRule: '死者不会说话——不提示，不做表情。',
        whenVoted: '第2天 · 投票结束', votedT1: '被村庄', votedT2: '放逐', votedLine: '手指齐指，火把高举——他们选择了你。', votedRule: '不能再投票，也不能再发言。静静看故事发展吧。', exiled: '放逐', byVillage: '村民决定',
        guideBtn: '游戏指南', guideTitle: '游戏玩法', aboutHead: '游戏简介', aboutText: 'Moonfall 是一款隐藏身份游戏。少数玩家秘密地是狼人，其余所有人都是村民。除了自己的卡牌，没人知道谁是谁。',
        winHead: '获胜条件', winVillageT: '村民', winVillage: '找出狼人，把他们全部投票放逐。', winWolvesT: '狼人', winWolves: '不断淘汰村民，直到狼人数量等于或超过其他所有人。',
        flowHead: '夜晚与白天', nightText: '所有人闭眼。只有主持人叫到你的身份时才睁眼，并安静地行动。', dayText: '所有人睁眼。主持人宣布谁出局，然后讨论、指认，并投票放逐一名玩家。',
        rulesHead: '黄金规则', rule1: '永远不要给任何人看你的卡牌。', rule2: '出局后请保持安静，直到游戏结束。', rule3: '主持人的判定为最终决定。',
        rolesHead: '本局身份', rolesSub: '这些卡牌已洗混发出。任何一张都可能是你的——或是你邻座的。', cardsChip: '共{n}张',
        teamV: '村民', teamW: '狼人', teamL: '独立', close: '知道了', langTitle: '语言', langSub: '选择你手机上显示的语言。'
      },
      ko: {
        tagline: '늑대와 속삭임의 게임', connected: 'HOWL 방에 연결됨', whatsName: '이름이 무엇인가요?', namePh: '이름을 입력하세요', nameHelp: '다른 사람들에게 이 이름으로 보여요.', join: '게임 참가하기',
        youreIn: '{name}님, 입장 완료!', sitBack: '편히 기다리세요. 호스트가 카드를 나눠주면 여기에 나타나요.', waitingHost: '호스트를 기다리는 중 · {n}명', protoDeal: '프로토타입: 호스트가 카드를 나눔',
        night: '밤', day: '낮', tapToSee: '탭해서 역할 보기', yourRole: '나의 역할', teamVillage: '마을 팀', teamWolves: '늑대인간 팀', onYourOwn: '단독 진영',
        hintHide: '카드를 다시 탭하면 숨겨져요', hintPeek: '아무도 엿보지 않을 때만 확인하세요', hintHad: '카드를 탭하면 내 역할을 볼 수 있어요', hintFell: '탭해서 탈락 카드 보기',
        protoLabel: '프로토타입 · 호스트 동작', toDay: '낮으로', toNight: '밤으로', killed: '살해됨', voted: '추방됨', revive: '되살리기',
        goalVillage: '늑대인간을 모두 찾아 투표로 추방하세요', goalWolves: '마을 사람 수와 같아지면 승리', goalTanner: '투표로 추방당하면 승리', goalDopp: '따라 한 역할의 팀과 함께 승리',
        whenKilled: '2일째 밤 · 탈락', killedT1: '늑대에게', killedT2: '잡아먹혔다', killedLine: '마을이 잠든 사이, 무리가 당신을 찾아냈습니다.', youWereA: '당신의 역할: ', youWereB: '', killedRule: '죽은 자는 말이 없습니다 — 힌트도, 표정도 금지.',
        whenVoted: '2일째 낮 · 투표 결과', votedT1: '마을에서', votedT2: '추방되었다', votedLine: '손가락이 가리키고 횃불이 올랐습니다 — 마을은 당신을 택했습니다.', votedRule: '이제 투표도 말도 할 수 없어요. 이야기를 지켜보세요.', exiled: '추방', byVillage: '마을의 결정',
        guideBtn: '게임 안내', guideTitle: '게임 방법', aboutHead: '게임 소개', aboutText: 'Moonfall은 숨겨진 역할 게임입니다. 몇몇 플레이어는 몰래 늑대인간이고, 나머지는 모두 마을 사람입니다. 내 카드 말고는 누가 누구인지 아무도 모릅니다.',
        winHead: '승리 조건', winVillageT: '마을', winVillage: '늑대인간을 찾아내 한 명도 남김없이 투표로 추방하세요.', winWolvesT: '늑대인간', winWolves: '늑대인간의 수가 나머지와 같거나 많아질 때까지 마을 사람들을 제거하세요.',
        flowHead: '밤과 낮', nightText: '모두 눈을 감습니다. 호스트가 내 역할을 부를 때만 눈을 뜨고 조용히 행동하세요.', dayText: '모두 눈을 뜹니다. 호스트가 탈락자를 발표하면 토론하고 의심한 뒤 한 명을 투표로 추방합니다.',
        rulesHead: '꼭 지킬 규칙', rule1: '카드를 절대 다른 사람에게 보여주지 마세요.', rule2: '탈락하면 게임이 끝날 때까지 조용히 하세요.', rule3: '호스트의 판단이 최종입니다.',
        rolesHead: '이번 판의 역할', rolesSub: '아래 카드들이 섞여서 나눠졌어요. 어떤 카드든 당신 것일 수도, 옆 사람 것일 수도 있어요.', cardsChip: '카드 {n}장',
        teamV: '마을', teamW: '늑대인간', teamL: '단독', close: '확인', langTitle: '언어', langSub: '내 휴대폰에 표시할 언어를 고르세요.'
      },
      ja: {
        tagline: '狼とささやきのゲーム', connected: 'ルーム HOWL に接続済み', whatsName: 'あなたの名前は？', namePh: '名前を入力', nameHelp: 'ほかのプレイヤーにはこの名前で表示されます。', join: 'ゲームに参加',
        youreIn: '{name}さん、参加しました！', sitBack: 'そのままお待ちください。ホストがカードを配ると、ここに表示されます。', waitingHost: 'ホストを待っています · {n}人', protoDeal: 'プロトタイプ：ホストがカードを配る',
        night: '夜', day: '昼', tapToSee: 'タップして役職を見る', yourRole: 'あなたの役職', teamVillage: '村人陣営', teamWolves: '人狼陣営', onYourOwn: '第三陣営',
        hintHide: 'もう一度タップすると隠れます', hintPeek: '誰も見ていない時だけ確認しましょう', hintHad: 'カードをタップして自分の役職を確認', hintFell: 'タップして脱落カードを見る',
        protoLabel: 'プロトタイプ · ホストの操作', toDay: '昼へ', toNight: '夜へ', killed: '襲撃', voted: '追放', revive: '復活',
        goalVillage: '人狼を全員見つけて追放しよう', goalWolves: '人狼が村人と同数になれば勝利', goalTanner: '投票で追放されれば勝利', goalDopp: 'コピーした役職の陣営と共に勝利',
        whenKilled: '2日目の夜 · 脱落', killedT1: '人狼に', killedT2: '襲われた', killedLine: '村が眠るあいだに、群れがあなたを見つけた。', youWereA: 'あなたの役職：', youWereB: '', killedRule: '死者は語らず——ヒントも表情もなしで。',
        whenVoted: '2日目の昼 · 投票終了', votedT1: '村から', votedT2: '追放された', votedLine: '指が差され、松明が掲げられた——村はあなたを選んだ。', votedRule: 'もう投票も発言もできません。物語の行方を見守りましょう。', exiled: '追放', byVillage: '村の決定',
        guideBtn: 'ゲームガイド', guideTitle: '遊び方', aboutHead: 'ゲームについて', aboutText: 'Moonfall は正体を隠して遊ぶゲームです。何人かはこっそり人狼で、残りは全員村人。自分のカード以外、誰が何者かは分かりません。',
        winHead: '勝利条件', winVillageT: '村人', winVillage: '人狼を見つけ出し、全員を投票で追放する。', winWolvesT: '人狼', winWolves: '村人を減らし、人狼の数がほかの全員と同じかそれ以上になる。',
        flowHead: '夜と昼', nightText: '全員目を閉じます。ホストに自分の役職を呼ばれた時だけ目を開け、静かに行動します。', dayText: '全員目を開けます。ホストが脱落者を発表したら、話し合い、疑い、1人を投票で追放します。',
        rulesHead: '大切なルール', rule1: '自分のカードは誰にも見せないこと。', rule2: '脱落したら、ゲームが終わるまで黙っていること。', rule3: 'ホストの判断が最終決定です。',
        rolesHead: '今回の役職', rolesSub: 'これらのカードがシャッフルされて配られました。どれがあなたの、あるいは隣の人のカードかもしれません。', cardsChip: '{n}枚',
        teamV: '村人', teamW: '人狼', teamL: '第三', close: 'わかった', langTitle: '言語', langSub: 'スマホに表示する言語を選んでください。'
      },
      fr: {
        tagline: 'Un jeu de loups et de murmures', connected: 'Connecté au salon HOWL', whatsName: 'Comment tu t’appelles ?', namePh: 'Écris ton prénom', nameHelp: 'C’est ainsi que les autres te verront.', join: 'Rejoindre la partie',
        youreIn: 'Bienvenue, {name} !', sitBack: 'Installe-toi. Ta carte apparaîtra ici quand le meneur distribuera.', waitingHost: 'En attente du meneur · {n} joueurs', protoDeal: 'Prototype : le meneur distribue',
        night: 'Nuit', day: 'Jour', tapToSee: 'Touche pour voir ton rôle', yourRole: 'Ton rôle', teamVillage: 'Camp du village', teamWolves: 'Camp des loups', onYourOwn: 'En solitaire',
        hintHide: 'Touche à nouveau la carte pour la cacher', hintPeek: 'Regarde seulement quand personne n’espionne', hintHad: 'Touche la carte pour voir ton ancien rôle', hintFell: 'Touche pour voir comment tu es tombé',
        protoLabel: 'Prototype · actions du meneur', toDay: 'Jour', toNight: 'Nuit', killed: 'Tué', voted: 'Éliminé', revive: 'Ranimer',
        goalVillage: 'Démasquer et éliminer tous les loups', goalWolves: 'Égaler le nombre de villageois', goalTanner: 'Te faire éliminer au vote', goalDopp: 'Gagner avec le camp copié',
        whenKilled: 'Nuit 2 · éliminé', killedT1: 'DÉVORÉ PAR', killedT2: 'LES LOUPS', killedLine: 'La meute t’a trouvé pendant que le village dormait.', youWereA: 'Tu étais : ', youWereB: '', killedRule: 'Les morts ne parlent pas — ni indice, ni grimace.',
        whenVoted: 'Jour 2 · le vote est tombé', votedT1: 'BANNI PAR', votedT2: 'LE VILLAGE', votedLine: 'Les doigts se sont pointés, les torches se sont levées — on t’a choisi.', votedRule: 'Plus de vote, plus de paroles. Regarde l’histoire se dérouler.', exiled: 'BANNI', byVillage: 'par le village',
        guideBtn: 'Guide du jeu', guideTitle: 'Comment jouer', aboutHead: 'Le jeu', aboutText: 'Moonfall est un jeu de rôles cachés. Quelques joueurs sont secrètement des loups-garous ; tous les autres forment le village. Personne ne sait qui est qui — à part sa propre carte.',
        winHead: 'Comment gagner', winVillageT: 'Le village', winVillage: 'Démasquer les loups-garous et les éliminer tous par le vote.', winWolvesT: 'Les loups-garous', winWolves: 'Éliminer des villageois jusqu’à être aussi nombreux que tous les autres.',
        flowHead: 'Nuit et jour', nightText: 'Tout le monde ferme les yeux. Ouvre-les seulement quand le meneur appelle ton rôle, puis agis en silence.', dayText: 'Tout le monde se réveille. Le meneur annonce qui a été éliminé. On discute, on accuse, puis on vote pour éliminer un joueur.',
        rulesHead: 'Règles d’or', rule1: 'Ne montre jamais ta carte à personne.', rule2: 'Si tu es éliminé, reste silencieux jusqu’à la fin.', rule3: 'La décision du meneur est définitive.',
        rolesHead: 'Rôles de cette partie', rolesSub: 'Ces cartes ont été mélangées et distribuées. N’importe laquelle peut être la tienne — ou celle de ton voisin.', cardsChip: '{n} cartes',
        teamV: 'Village', teamW: 'Loups-garous', teamL: 'Solitaire', close: 'Compris', langTitle: 'Langue', langSub: 'Choisis la langue de ton téléphone.'
      },
      th: {
        tagline: 'เกมแห่งหมาป่าและเสียงกระซิบ', connected: 'เชื่อมต่อห้อง HOWL แล้ว', whatsName: 'คุณชื่ออะไร?', namePh: 'พิมพ์ชื่อของคุณ', nameHelp: 'ผู้เล่นคนอื่นจะเห็นชื่อนี้', join: 'เข้าร่วมเกม',
        youreIn: 'เข้ามาแล้ว {name}!', sitBack: 'รอสักครู่ การ์ดของคุณจะปรากฏที่นี่เมื่อผู้ดำเนินเกมแจกการ์ด', waitingHost: 'รอผู้ดำเนินเกม · ผู้เล่น {n} คน', protoDeal: 'ต้นแบบ: ผู้ดำเนินเกมแจกการ์ด',
        night: 'กลางคืน', day: 'กลางวัน', tapToSee: 'แตะเพื่อดูบทบาท', yourRole: 'บทบาทของคุณ', teamVillage: 'ฝ่ายหมู่บ้าน', teamWolves: 'ฝ่ายมนุษย์หมาป่า', onYourOwn: 'ฝ่ายอิสระ',
        hintHide: 'แตะการ์ดอีกครั้งเพื่อซ่อน', hintPeek: 'ดูเฉพาะตอนที่ไม่มีใครแอบมอง', hintHad: 'แตะการ์ดเพื่อดูบทบาทที่คุณเคยเป็น', hintFell: 'แตะเพื่อดูการ์ดตกรอบ',
        protoLabel: 'ต้นแบบ · สิ่งที่ผู้ดำเนินเกมทำ', toDay: 'กลางวัน', toNight: 'กลางคืน', killed: 'ถูกฆ่า', voted: 'ถูกโหวตออก', revive: 'ฟื้นคืน',
        goalVillage: 'หาและโหวตมนุษย์หมาป่าออกให้หมด', goalWolves: 'มีจำนวนเท่ากับชาวบ้าน', goalTanner: 'ทำให้ตัวเองถูกโหวตออก', goalDopp: 'ชนะพร้อมฝ่ายของบทบาทที่ลอกเลียน',
        whenKilled: 'คืนที่ 2 · ตกรอบ', killedT1: 'ถูกฝูงหมาป่า', killedT2: 'ขย้ำ', killedLine: 'ฝูงหมาป่าพบคุณขณะที่หมู่บ้านกำลังหลับใหล', youWereA: 'คุณคือ ', youWereB: '', killedRule: 'คนตายไม่พูด — ห้ามใบ้ ห้ามทำหน้า',
        whenVoted: 'วันที่ 2 · ผลโหวตออกแล้ว', votedT1: 'ถูกหมู่บ้าน', votedT2: 'ขับไล่', votedLine: 'นิ้วชี้มา คบเพลิงชูขึ้น — และพวกเขาเลือกคุณ', votedRule: 'ไม่มีสิทธิ์โหวตหรือพูดอีกแล้ว นั่งดูเรื่องราวดำเนินต่อไป', exiled: 'ขับไล่', byVillage: 'โดยหมู่บ้าน',
        guideBtn: 'คู่มือเกม', guideTitle: 'วิธีเล่น', aboutHead: 'เกี่ยวกับเกม', aboutText: 'Moonfall เป็นเกมบทบาทลับ ผู้เล่นบางคนเป็นมนุษย์หมาป่าอย่างลับ ๆ ส่วนที่เหลือคือชาวบ้าน ไม่มีใครรู้ว่าใครเป็นใคร นอกจากการ์ดของตัวเอง',
        winHead: 'วิธีชนะ', winVillageT: 'หมู่บ้าน', winVillage: 'หามนุษย์หมาป่าให้เจอ แล้วโหวตออกให้หมดทุกตัว', winWolvesT: 'มนุษย์หมาป่า', winWolves: 'กำจัดชาวบ้านจนจำนวนหมาป่าเท่ากับหรือมากกว่าคนที่เหลือ',
        flowHead: 'กลางคืนและกลางวัน', nightText: 'ทุกคนหลับตา ลืมตาเฉพาะตอนที่ผู้ดำเนินเกมเรียกบทบาทของคุณ แล้วทำอย่างเงียบ ๆ', dayText: 'ทุกคนตื่น ผู้ดำเนินเกมประกาศว่าใครตกรอบ จากนั้นพูดคุย กล่าวหา และโหวตผู้เล่นออกหนึ่งคน',
        rulesHead: 'กฎทอง', rule1: 'ห้ามให้ใครเห็นการ์ดของคุณเด็ดขาด', rule2: 'ถ้าคุณตกรอบ ให้เงียบจนกว่าเกมจะจบ', rule3: 'คำตัดสินของผู้ดำเนินเกมถือเป็นที่สุด',
        rolesHead: 'บทบาทในรอบนี้', rolesSub: 'การ์ดเหล่านี้ถูกสับและแจกแล้ว ใบไหนก็อาจเป็นของคุณ — หรือของคนข้าง ๆ', cardsChip: '{n} ใบ',
        teamV: 'หมู่บ้าน', teamW: 'มนุษย์หมาป่า', teamL: 'อิสระ', close: 'เข้าใจแล้ว', langTitle: 'ภาษา', langSub: 'เลือกภาษาที่จะแสดงบนโทรศัพท์ของคุณ'
      },
      es: {
        tagline: 'Un juego de lobos y susurros', connected: 'Conectado a la sala HOWL', whatsName: '¿Cómo te llamas?', namePh: 'Escribe tu nombre', nameHelp: 'Así te verán los demás.', join: 'Unirse a la partida',
        youreIn: '¡Ya estás dentro, {name}!', sitBack: 'Relájate. Tu carta aparecerá aquí cuando el anfitrión reparta.', waitingHost: 'Esperando al anfitrión · {n} jugadores', protoDeal: 'Prototipo: el anfitrión reparte',
        night: 'Noche', day: 'Día', tapToSee: 'Toca para ver tu rol', yourRole: 'Tu rol', teamVillage: 'Equipo aldea', teamWolves: 'Equipo lobos', onYourOwn: 'Por tu cuenta',
        hintHide: 'Toca la carta otra vez para ocultarla', hintPeek: 'Mira solo cuando nadie esté espiando', hintHad: 'Toca la carta para ver el rol que tenías', hintFell: 'Toca para ver cómo caíste',
        protoLabel: 'Prototipo · acciones del anfitrión', toDay: 'A día', toNight: 'A noche', killed: 'Asesinado', voted: 'Expulsado', revive: 'Revivir',
        goalVillage: 'Encuentra y expulsa a todos los lobos', goalWolves: 'Igualar en número a los aldeanos', goalTanner: 'Lograr que te expulsen', goalDopp: 'Gana con el equipo que copies',
        whenKilled: 'Noche 2 · eliminado', killedT1: 'DEVORADO POR', killedT2: 'LOS LOBOS', killedLine: 'La manada te encontró mientras la aldea dormía.', youWereA: 'Eras: ', youWereB: '', killedRule: 'Los muertos no hablan: ni pistas, ni gestos.',
        whenVoted: 'Día 2 · el voto está hecho', votedT1: 'DESTERRADO', votedT2: 'POR LA ALDEA', votedLine: 'Señalaron los dedos, se alzaron las antorchas… y te eligieron a ti.', votedRule: 'Ya no votas ni hablas. Mira cómo sigue la historia.', exiled: 'DESTIERRO', byVillage: 'por la aldea',
        guideBtn: 'Guía del juego', guideTitle: 'Cómo jugar', aboutHead: 'El juego', aboutText: 'Moonfall es un juego de roles ocultos. Unos pocos jugadores son hombres lobo en secreto; todos los demás son la aldea. Nadie sabe quién es quién, salvo por su propia carta.',
        winHead: 'Cómo ganar', winVillageT: 'La aldea', winVillage: 'Encontrar a los hombres lobo y expulsarlos a todos por votación.', winWolvesT: 'Los hombres lobo', winWolves: 'Eliminar aldeanos hasta igualar o superar en número a todos los demás.',
        flowHead: 'Noche y día', nightText: 'Todos cierran los ojos. Ábrelos solo cuando el anfitrión llame a tu rol y actúa en silencio.', dayText: 'Todos despiertan. El anfitrión anuncia quién fue eliminado. Hablen, acusen y voten para expulsar a un jugador.',
        rulesHead: 'Reglas de oro', rule1: 'Nunca enseñes tu carta a nadie.', rule2: 'Si quedas fuera, guarda silencio hasta el final.', rule3: 'La decisión del anfitrión es definitiva.',
        rolesHead: 'Roles de esta partida', rolesSub: 'Estas cartas se barajaron y repartieron. Cualquiera puede ser la tuya… o la de tu vecino.', cardsChip: '{n} cartas',
        teamV: 'Aldea', teamW: 'Hombres lobo', teamL: 'Solitario', close: 'Entendido', langTitle: 'Idioma', langSub: 'Elige el idioma de tu teléfono.'
      }
    };
  }
  roleText() {
    // [name, motto, card text] per language. English lives in roles() / core().
    return {
      zh: {
        werewolf: ['狼人', '月光下狩猎', '主持人唤醒狼人时，睁眼找到同伴，安静地指向一名要淘汰的玩家。白天要装作无辜。'],
        villager: ['村民', '智慧就是武器', '你没有夜间能力——夜里请闭眼。白天讨论、识破谎言，把狼人投票放逐。'],
        mason: ['共济会员', '以石为盟', '第一夜主持人会同时唤醒所有共济会员，让你们认识彼此。你们可以互相信任。'],
        seer: ['预言家', '无所遁形', '夜里主持人唤醒你时，指向一名玩家。主持人会悄悄告诉你他是不是狼人。'],
        healer: ['医生', '有我在就不行', '夜里主持人唤醒你时，指向一名要保护的玩家。如果狼人选中了他，他就能活下来。'],
        witch: ['女巫', '两瓶药，一次机会', '你有一瓶救人的解药和一瓶杀人的毒药。主持人唤醒你时使用，每瓶只能用一次。'],
        hunter: ['猎人', '最后一箭', '无论在夜里还是被投票出局，你都要立刻指向另一名玩家，他会和你一起出局。'],
        bodyguard: ['守卫', '以身为盾', '主持人唤醒你时，指向一名要守护的玩家。若狼人袭击他，你将代替他死去。你不能守护自己。'],
        apprentice: ['见习预言家', '天眼传承', '在预言家出局前你一直沉睡。之后主持人每晚唤醒你，你将接替预言家的能力。'],
        prince: ['王子', '皇家血统', '如果村民投票要放逐你，就亮出这张牌。你会存活，所有人都会知道你是王子。'],
        toughguy: ['硬汉', '顽强不倒', '被狼人攻击时你不会立刻死去，而是在第二天结束时出局。'],
        mayor: ['村长', '一票当两票', '白天任何时候都可以亮出此牌。从那以后，你的一票算作两票。'],
        idiot: ['村中傻子', '混乱是我的朋友', '你属于村民阵营，但每次投票都必须投给淘汰某人。'],
        oldhag: ['老巫婆', '日落前退下', '主持人唤醒你时，指向一名玩家。他必须离开下一个白天的讨论，不能说话也不能投票。'],
        lycan: ['狼裔', '诅咒之血，纯洁之心', '你属于村民阵营，但预言家查验你时，主持人会显示你是狼人。努力证明自己的清白吧。'],
        cursed: ['被诅咒者', '一咬即变', '你以村民身份开始。被狼人攻击时你不会死——主持人会悄悄告诉你，你已变成狼人。'],
        cupid: ['丘比特', '爱情也是武器', '第一夜，指向两名玩家，他们会坠入爱河——其中一人出局时，另一人也随之出局。'],
        wolfcub: ['小狼', '为我复仇', '你和狼人一起醒来。如果你出局，愤怒的狼群在下一夜会淘汰两名玩家。'],
        minion: ['爪牙', '忠于狼群', '第一夜狼人们会竖起拇指让你认出他们，但他们不知道你是谁。帮助他们获胜，别被抓到。'],
        sorceress: ['女术士', '寻找预言家', '你站在狼人一边，但不和他们一起醒来。每晚指向一名玩家，主持人会告诉你他是不是预言家。'],
        tanner: ['皮匠', '受够了一切', '只有被村民投票放逐你才获胜。表现得足够可疑让人选中你——但别太明显。'],
        doppelganger: ['化身幽灵', '披上他人的面孔', '第一夜主持人唤醒你时，指向一名玩家。如果他出局，你会秘密地成为他的身份——卡牌也会随之改变。']
      },
      ko: {
        werewolf: ['늑대인간', '달빛 아래의 사냥', '호스트가 늑대인간을 깨우면 눈을 뜨고 무리를 확인한 뒤, 제거할 플레이어 한 명을 조용히 가리키세요. 낮에는 결백한 척하세요.'],
        villager: ['마을 사람', '지혜가 곧 무기', '밤에 쓸 능력은 없어요. 밤에는 눈을 감고 있으세요. 낮에는 대화하고 거짓말을 잡아내 늑대인간을 투표로 추방하세요.'],
        mason: ['메이슨', '돌로 맺은 맹세', '첫날 밤 호스트가 메이슨들을 함께 깨워 서로를 확인하게 해요. 메이슨끼리는 서로 믿을 수 있어요.'],
        seer: ['예언자', '숨길 수 있는 것은 없다', '밤에 호스트가 깨우면 한 명을 가리키세요. 호스트가 그 사람이 늑대인간인지 조용히 알려줘요.'],
        healer: ['치유사', '내가 지키는 한 안 된다', '밤에 호스트가 깨우면 보호할 한 명을 가리키세요. 늑대인간이 그 사람을 골랐다면 살아남아요.'],
        witch: ['마녀', '두 개의 물약, 한 번의 기회', '살리는 물약 하나와 죽이는 독약 하나가 있어요. 호스트가 깨울 때 각각 한 번씩만 쓸 수 있어요.'],
        hunter: ['사냥꾼', '마지막 화살', '밤이든 투표든 탈락하면, 바로 다른 한 명을 가리키세요. 그 사람도 함께 탈락해요.'],
        bodyguard: ['경호원', '대신 맞아 줄게요', '호스트가 깨우면 지킬 한 명을 가리키세요. 늑대가 그 사람을 공격하면 당신이 대신 죽어요. 자기 자신은 지킬 수 없어요.'],
        apprentice: ['견습 예언자', '계승되는 통찰', '예언자가 탈락할 때까지는 잠만 자요. 그 뒤로는 매일 밤 호스트가 깨우고, 예언자의 능력을 대신 써요.'],
        prince: ['왕자', '고귀한 혈통', '마을이 투표로 당신을 추방하려 하면 이 카드를 보여주세요. 당신은 살아남고, 모두가 당신이 왕자임을 알게 돼요.'],
        toughguy: ['강인한 자', '쉽게 쓰러지지 않는다', '늑대인간에게 공격당해도 바로 죽지 않아요. 대신 다음 날이 끝날 때 탈락해요.'],
        mayor: ['촌장', '두 배의 목소리', '낮이라면 언제든 이 카드를 공개할 수 있어요. 그때부터 당신의 표는 두 표로 계산돼요.'],
        idiot: ['마을 바보', '혼돈은 나의 친구', '마을 편이지만, 투표 때마다 반드시 누군가를 제거하는 쪽에 투표해야 해요.'],
        oldhag: ['노파', '해 질 녘까지 물러가라', '호스트가 깨우면 한 명을 가리키세요. 그 사람은 다음 날 하루 동안 자리를 떠나야 하고 말하거나 투표할 수 없어요.'],
        lycan: ['라이칸', '저주받은 피, 순수한 마음', '마을 편이지만, 예언자가 당신을 확인하면 호스트는 늑대인간이라고 알려줘요. 결백을 증명하세요.'],
        cursed: ['저주받은 자', '한 번 물리면 끝', '마을 편으로 시작해요. 늑대인간에게 공격당하면 죽지 않고, 호스트가 몰래 이제 늑대인간이 되었다고 알려줘요.'],
        cupid: ['큐피드', '사랑도 무기가 된다', '첫날 밤, 두 사람을 가리키세요. 둘은 사랑에 빠지고, 한 명이 탈락하면 다른 한 명도 함께 탈락해요.'],
        wolfcub: ['새끼 늑대', '내 복수를 해줘', '늑대인간과 함께 깨어나요. 당신이 탈락하면 분노한 무리가 다음 날 밤 두 명을 제거해요.'],
        minion: ['하수인', '무리에 충성을', '첫날 밤 늑대인간들이 엄지를 들어 정체를 보여줘요. 그들은 당신을 몰라요. 들키지 않게 그들의 승리를 도우세요.'],
        sorceress: ['여마법사', '예언자를 찾아라', '늑대인간 편이지만 함께 깨어나지는 않아요. 매일 밤 한 명을 가리키면 호스트가 그 사람이 예언자인지 알려줘요.'],
        tanner: ['무두장이', '다 지긋지긋해', '마을이 투표로 당신을 추방해야만 승리해요. 뽑힐 만큼만 수상하게 행동하되, 너무 티 나지는 않게.'],
        doppelganger: ['도플갱어', '남의 얼굴을 쓰다', '첫날 밤 호스트가 깨우면 한 명을 가리키세요. 그 사람이 탈락하면 몰래 그 역할이 되고, 카드도 바뀌어요.']
      },
      ja: {
        werewolf: ['人狼', '月明かりの狩り', 'ホストが人狼を起こしたら目を開けて仲間を確認し、襲う相手を1人、静かに指さします。昼は無実のふりを。'],
        villager: ['村人', '知恵こそ武器', '夜の能力はありません。夜は目を閉じていましょう。昼は話し合い、嘘を見抜いて人狼を追放します。'],
        mason: ['共有者', '石の誓い', '初日の夜、ホストが共有者全員を一緒に起こすので、お互いを確認できます。共有者同士は信頼できます。'],
        seer: ['占い師', '何も隠せない', '夜にホストに起こされたら、1人を指さします。ホストがその人が人狼かどうかを静かに教えてくれます。'],
        healer: ['医者', '私がいる限り', '夜にホストに起こされたら、守る相手を1人指さします。人狼がその人を選んでいたら、その人は生き残ります。'],
        witch: ['魔女', '二つの薬、一度きり', '救う薬と殺す毒薬を一つずつ持っています。ホストに起こされた時に、それぞれ一度だけ使えます。'],
        hunter: ['ハンター', '最後の一矢', '夜でも投票でも脱落したら、すぐに別の1人を指さします。その人も一緒に脱落します。'],
        bodyguard: ['騎士', 'この身を盾に', 'ホストに起こされたら、守る相手を1人指さします。人狼がその人を襲うと、あなたが身代わりとなって脱落します。自分は守れません。'],
        apprentice: ['見習い占い師', '受け継がれる眼', '占い師が脱落するまでは眠っています。その後は毎晩ホストに起こされ、占い師の能力を引き継ぎます。'],
        prince: ['王子', '高貴な血筋', '村が投票であなたを追放しようとしたら、このカードを見せましょう。あなたは生き残り、全員があなたが王子だと知ります。'],
        toughguy: ['タフガイ', '簡単には倒れない', '人狼に襲われてもすぐには死にません。代わりに翌日の終わりに脱落します。'],
        mayor: ['村長', '二倍の声', '昼ならいつでもこのカードを公開できます。それ以降、あなたの票は2票として数えます。'],
        idiot: ['村のおバカ', '混沌は友だち', '村人陣営ですが、投票では必ず誰かを追放する側に投票しなければなりません。'],
        oldhag: ['老婆', '日暮れまで去れ', 'ホストに起こされたら1人を指さします。その人は翌日の間、席を外し、話すことも投票もできません。'],
        lycan: ['ライカン', '呪われた血、清き心', '村人陣営ですが、占い師に占われるとホストは人狼と示します。無実を信じてもらいましょう。'],
        cursed: ['呪われし者', '噛まれたら最後', '村人陣営で始まります。人狼に襲われても死なず、ホストがこっそり人狼になったと伝えます。'],
        cupid: ['キューピッド', '愛もまた武器', '初日の夜、2人を指さします。2人は恋に落ち、片方が脱落すればもう片方も脱落します。'],
        wolfcub: ['子狼', '仇を討って', '人狼と一緒に目を覚まします。あなたが脱落すると、怒った群れは次の夜に2人を襲います。'],
        minion: ['狂人', '群れへの忠誠', '初日の夜、人狼たちが親指を立てて正体を見せます。彼らはあなたを知りません。ばれずに勝利を助けましょう。'],
        sorceress: ['妖術師', '占い師を探せ', '人狼陣営ですが、一緒には起きません。毎晩1人を指さすと、ホストがその人が占い師かどうか教えてくれます。'],
        tanner: ['なめし革職人', 'もううんざり', '村の投票で追放された時だけ勝利します。選ばれる程度に怪しく、でもあからさますぎないように。'],
        doppelganger: ['ドッペルゲンガー', '他人の顔をまとう', '初日の夜、ホストに起こされたら1人を指さします。その人が脱落すると、こっそりその役職になり、カードも変わります。']
      },
      fr: {
        werewolf: ['Loup-garou', 'Chasser au clair de lune', 'Quand le meneur réveille les loups, ouvre les yeux, retrouve ta meute et désigne en silence un joueur à éliminer. Le jour, joue les innocents.'],
        villager: ['Villageois', 'L’esprit est ton arme', 'Tu n’as aucun pouvoir la nuit — garde les yeux fermés. Le jour, discute, repère les mensonges et élimine les loups au vote.'],
        mason: ['Franc-maçon', 'Liés par la pierre', 'La première nuit, le meneur réveille tous les francs-maçons ensemble pour que vous vous reconnaissiez. Vous pouvez vous faire confiance.'],
        seer: ['Voyante', 'Rien ne t’échappe', 'Quand le meneur te réveille la nuit, désigne un joueur. Il te montrera en silence s’il est loup-garou.'],
        healer: ['Guérisseur', 'Pas tant que je veille', 'Quand le meneur te réveille la nuit, désigne un joueur à protéger. Si les loups l’ont choisi, il survit.'],
        witch: ['Sorcière', 'Deux potions, une chance', 'Tu as une potion pour sauver un joueur et un poison pour en éliminer un. Chacune ne sert qu’une fois, quand le meneur te réveille.'],
        hunter: ['Chasseur', 'Une dernière flèche', 'Si tu es éliminé — la nuit ou au vote — désigne aussitôt un autre joueur. Il est éliminé avec toi.'],
        bodyguard: ['Garde du corps', 'Je prends le coup', 'Quand le meneur te réveille, désigne un joueur à protéger. Si les loups l’attaquent, tu meurs à sa place. Tu ne peux pas te protéger toi-même.'],
        apprentice: ['Apprentie voyante', 'Le don se transmet', 'Tu dors jusqu’à l’élimination de la Voyante. Ensuite, le meneur te réveille chaque nuit et tu utilises son pouvoir.'],
        prince: ['Prince', 'Sang royal', 'Si le village vote pour t’éliminer, montre cette carte. Tu survis, et tout le monde sait que tu es le Prince.'],
        toughguy: ['Dur à cuire', 'Trop têtu pour tomber', 'Si les loups t’attaquent, tu ne meurs pas tout de suite. Tu es éliminé à la fin du jour suivant.'],
        mayor: ['Maire', 'Ta voix compte double', 'Révèle cette carte quand tu veux pendant le jour. Dès lors, ton vote compte pour deux.'],
        idiot: ['Idiot du village', 'Le chaos est ton ami', 'Tu es du côté du village, mais à chaque vote tu dois toujours voter pour éliminer quelqu’un.'],
        oldhag: ['Vieille sorcière', 'Disparais jusqu’au crépuscule', 'Quand le meneur te réveille, désigne un joueur. Il doit quitter la table le jour suivant et ne peut ni parler ni voter.'],
        lycan: ['Lycan', 'Sang maudit, cœur pur', 'Tu es du côté du village, mais si la Voyante t’inspecte, le meneur te montre comme loup-garou. Prouve ton innocence.'],
        cursed: ['Maudit', 'À une morsure près', 'Tu commences dans le village. Si les loups t’attaquent, tu ne meurs pas — le meneur te dit en secret que tu es désormais loup-garou.'],
        cupid: ['Cupidon', 'L’amour aussi est une arme', 'La première nuit, désigne deux joueurs. Ils tombent amoureux — si l’un est éliminé, l’autre l’est aussi.'],
        wolfcub: ['Louveteau', 'Vengez-moi', 'Tu te réveilles avec les loups. Si tu es éliminé, la meute enragée élimine deux joueurs la nuit suivante.'],
        minion: ['Sbire', 'Fidèle à la meute', 'La première nuit, les loups lèvent le pouce pour que tu les voies. Eux ne te connaissent pas. Aide-les à gagner sans te faire prendre.'],
        sorceress: ['Ensorceleuse', 'À la recherche de la Voyante', 'Tu es du côté des loups mais ne te réveilles pas avec eux. Chaque nuit, désigne un joueur : le meneur te dit s’il est la Voyante.'],
        tanner: ['Tanneur', 'Las de tout', 'Tu gagnes seulement si le village vote contre toi. Sois juste assez suspect pour être choisi — sans être trop évident.'],
        doppelganger: ['Doppelgänger', 'Porter le visage d’un autre', 'La première nuit, quand le meneur te réveille, désigne un joueur. S’il est éliminé, tu prends secrètement son rôle — ta carte change.']
      },
      th: {
        werewolf: ['มนุษย์หมาป่า', 'ล่าใต้แสงจันทร์', 'เมื่อผู้ดำเนินเกมปลุกหมาป่า ให้ลืมตา หาเพื่อนในฝูง แล้วชี้ผู้เล่นหนึ่งคนที่จะกำจัดอย่างเงียบ ๆ ตอนกลางวันให้ทำตัวบริสุทธิ์'],
        villager: ['ชาวบ้าน', 'ไหวพริบคืออาวุธ', 'คุณไม่มีพลังตอนกลางคืน ให้หลับตาไว้ ตอนกลางวันให้พูดคุย จับโกหก และโหวตมนุษย์หมาป่าออก'],
        mason: ['เมสัน', 'ผูกพันด้วยศิลา', 'คืนแรกผู้ดำเนินเกมจะปลุกเมสันทุกคนพร้อมกันเพื่อให้รู้จักกัน พวกคุณไว้ใจกันได้'],
        seer: ['ผู้หยั่งรู้', 'ไม่มีอะไรซ่อนพ้น', 'เมื่อผู้ดำเนินเกมปลุกคุณตอนกลางคืน ให้ชี้ผู้เล่นหนึ่งคน ผู้ดำเนินเกมจะบอกอย่างเงียบ ๆ ว่าเขาเป็นมนุษย์หมาป่าหรือไม่'],
        healer: ['หมอ', 'ไม่มีวันระหว่างที่ข้าเฝ้า', 'เมื่อผู้ดำเนินเกมปลุกคุณตอนกลางคืน ให้ชี้ผู้เล่นหนึ่งคนเพื่อปกป้อง ถ้าหมาป่าเลือกเขา เขาจะรอด'],
        witch: ['แม่มด', 'ยาสองขวด โอกาสเดียว', 'คุณมียาช่วยชีวิตหนึ่งขวดและยาพิษหนึ่งขวด ใช้ได้อย่างละครั้งเมื่อผู้ดำเนินเกมปลุกคุณ'],
        hunter: ['นายพราน', 'ลูกศรดอกสุดท้าย', 'ถ้าคุณตกรอบ ไม่ว่ากลางคืนหรือจากการโหวต ให้ชี้ผู้เล่นอีกคนทันที เขาจะตกรอบไปพร้อมคุณ'],
        bodyguard: ['บอดี้การ์ด', 'ขอรับคมเขี้ยวแทน', 'เมื่อผู้ดำเนินเกมปลุกคุณ ให้ชี้ผู้เล่นหนึ่งคนเพื่อคุ้มกัน ถ้าหมาป่าโจมตีเขา คุณจะตายแทน คุณคุ้มกันตัวเองไม่ได้'],
        apprentice: ['ผู้หยั่งรู้ฝึกหัด', 'ญาณที่ถูกส่งต่อ', 'คุณหลับจนกว่าผู้หยั่งรู้จะตกรอบ หลังจากนั้นผู้ดำเนินเกมจะปลุกคุณทุกคืนและคุณจะใช้พลังของผู้หยั่งรู้แทน'],
        prince: ['เจ้าชาย', 'สายเลือดราชวงศ์', 'ถ้าหมู่บ้านโหวตให้คุณออก ให้เปิดการ์ดนี้ คุณจะรอด และทุกคนจะรู้ว่าคุณคือเจ้าชาย'],
        toughguy: ['คนแกร่ง', 'ดื้อเกินกว่าจะล้ม', 'ถ้าหมาป่าโจมตีคุณ คุณจะไม่ตายทันที แต่จะตกรอบเมื่อสิ้นสุดวันถัดไป'],
        mayor: ['นายกเทศมนตรี', 'เสียงของคุณนับสองเท่า', 'เปิดการ์ดนี้เมื่อไหร่ก็ได้ในตอนกลางวัน ตั้งแต่นั้นคะแนนโหวตของคุณนับเป็นสองเสียง'],
        idiot: ['คนบ้าประจำหมู่บ้าน', 'ความวุ่นวายคือเพื่อน', 'คุณอยู่ฝ่ายหมู่บ้าน แต่ทุกครั้งที่โหวตต้องโหวตให้กำจัดใครสักคนเสมอ'],
        oldhag: ['ยายแก่', 'ไปให้พ้นจนตะวันตก', 'เมื่อผู้ดำเนินเกมปลุกคุณ ให้ชี้ผู้เล่นหนึ่งคน เขาต้องออกจากวงในวันถัดไป และพูดหรือโหวตไม่ได้'],
        lycan: ['ไลแคน', 'เลือดต้องสาป ใจบริสุทธิ์', 'คุณอยู่ฝ่ายหมู่บ้าน แต่ถ้าผู้หยั่งรู้ตรวจคุณ ผู้ดำเนินเกมจะบอกว่าคุณเป็นมนุษย์หมาป่า จงพิสูจน์ความบริสุทธิ์'],
        cursed: ['ผู้ต้องสาป', 'ห่างแค่รอยกัด', 'คุณเริ่มในฝ่ายหมู่บ้าน ถ้าหมาป่าโจมตี คุณจะไม่ตาย ผู้ดำเนินเกมจะบอกคุณอย่างลับ ๆ ว่าตอนนี้คุณเป็นมนุษย์หมาป่าแล้ว'],
        cupid: ['คิวปิด', 'ความรักก็เป็นอาวุธ', 'คืนแรก ให้ชี้ผู้เล่นสองคน ทั้งคู่จะตกหลุมรักกัน ถ้าคนหนึ่งตกรอบ อีกคนก็ตกรอบด้วย'],
        wolfcub: ['ลูกหมาป่า', 'ล้างแค้นให้ข้า', 'คุณตื่นพร้อมมนุษย์หมาป่า ถ้าคุณตกรอบ ฝูงที่โกรธแค้นจะกำจัดผู้เล่นสองคนในคืนถัดไป'],
        minion: ['สมุนรับใช้', 'ภักดีต่อฝูง', 'คืนแรกมนุษย์หมาป่าจะยกนิ้วโป้งให้คุณเห็นตัว แต่พวกเขาไม่รู้จักคุณ ช่วยให้พวกเขาชนะโดยไม่ถูกจับได้'],
        sorceress: ['นางมาร', 'ตามหาผู้หยั่งรู้', 'คุณอยู่ฝ่ายหมาป่าแต่ไม่ตื่นพร้อมพวกเขา ทุกคืนให้ชี้ผู้เล่นหนึ่งคน ผู้ดำเนินเกมจะบอกว่าเขาเป็นผู้หยั่งรู้หรือไม่'],
        tanner: ['ช่างฟอกหนัง', 'เบื่อทุกสิ่ง', 'คุณชนะก็ต่อเมื่อหมู่บ้านโหวตคุณออก ทำตัวน่าสงสัยพอให้ถูกเลือก แต่อย่าให้ชัดเกินไป'],
        doppelganger: ['ด็อปเพลเกนเกอร์', 'สวมใบหน้าผู้อื่น', 'คืนแรกเมื่อผู้ดำเนินเกมปลุกคุณ ให้ชี้ผู้เล่นหนึ่งคน ถ้าเขาตกรอบ คุณจะกลายเป็นบทบาทนั้นอย่างลับ ๆ และการ์ดของคุณจะเปลี่ยน']
      },
      es: {
        werewolf: ['Hombre lobo', 'Caza a la luz de la luna', 'Cuando el anfitrión despierte a los lobos, abre los ojos, encuentra a tu manada y señala en silencio a un jugador para eliminar. De día, finge inocencia.'],
        villager: ['Aldeano', 'El ingenio es tu arma', 'No tienes poder nocturno: mantén los ojos cerrados de noche. De día, habla, detecta mentiras y expulsa a los lobos.'],
        mason: ['Masón', 'Unidos por la piedra', 'La primera noche el anfitrión despierta a todos los masones a la vez para que se reconozcan. Pueden confiar entre ustedes.'],
        seer: ['Vidente', 'Nada se te oculta', 'Cuando el anfitrión te despierte de noche, señala a un jugador. Te indicará en silencio si es un hombre lobo.'],
        healer: ['Sanador', 'No mientras yo vigile', 'Cuando el anfitrión te despierte de noche, señala a un jugador para protegerlo. Si los lobos lo eligieron, sobrevive.'],
        witch: ['Bruja', 'Dos pociones, una oportunidad', 'Tienes una poción para salvar y un veneno para eliminar. Cada una se usa una sola vez, cuando el anfitrión te despierte.'],
        hunter: ['Cazador', 'Una última flecha', 'Si te eliminan, de noche o por votación, señala de inmediato a otro jugador. Queda eliminado contigo.'],
        bodyguard: ['Guardaespaldas', 'Yo recibo el golpe', 'Cuando el anfitrión te despierte, señala a un jugador para protegerlo. Si los lobos lo atacan, mueres en su lugar. No puedes protegerte a ti mismo.'],
        apprentice: ['Vidente aprendiz', 'La visión pasa a ti', 'Duermes hasta que la Vidente sea eliminada. Después, el anfitrión te despierta cada noche y usas su poder.'],
        prince: ['Príncipe', 'Sangre real', 'Si la aldea vota para expulsarte, muestra esta carta. Sobrevives y todos saben que eres el Príncipe.'],
        toughguy: ['Tipo duro', 'Demasiado terco para caer', 'Si los lobos te atacan, no mueres enseguida. Quedas eliminado al final del día siguiente.'],
        mayor: ['Alcalde', 'Tu voz cuenta doble', 'Muestra esta carta cuando quieras durante el día. Desde entonces, tu voto cuenta como dos.'],
        idiot: ['Tonto del pueblo', 'El caos es tu amigo', 'Eres de la aldea, pero en cada votación siempre debes votar para eliminar a alguien.'],
        oldhag: ['Vieja hechicera', 'Fuera hasta el ocaso', 'Cuando el anfitrión te despierte, señala a un jugador. Debe dejar la mesa durante el día siguiente y no puede hablar ni votar.'],
        lycan: ['Licántropo', 'Sangre maldita, corazón puro', 'Eres de la aldea, pero si la Vidente te revisa, el anfitrión te mostrará como hombre lobo. Demuestra tu inocencia.'],
        cursed: ['Maldito', 'A un mordisco', 'Empiezas en la aldea. Si los lobos te atacan, no mueres: el anfitrión te dice en secreto que ahora eres un hombre lobo.'],
        cupid: ['Cupido', 'El amor también es un arma', 'La primera noche, señala a dos jugadores. Se enamoran: si uno es eliminado, el otro también.'],
        wolfcub: ['Lobezno', 'Vengadme', 'Despiertas con los hombres lobo. Si te eliminan, la manada enfurecida elimina a dos jugadores la noche siguiente.'],
        minion: ['Esbirro', 'Fiel a la manada', 'La primera noche los lobos levantan el pulgar para que los veas. Ellos no te conocen. Ayúdalos a ganar sin que te descubran.'],
        sorceress: ['Hechicera', 'En busca de la Vidente', 'Estás del lado de los lobos pero no despiertas con ellos. Cada noche señala a un jugador: el anfitrión te dice si es la Vidente.'],
        tanner: ['Curtidor', 'Harto de todo', 'Solo ganas si la aldea vota para expulsarte. Sé lo bastante sospechoso para que te elijan, pero sin que se note demasiado.'],
        doppelganger: ['Doppelgänger', 'Usar el rostro de otro', 'La primera noche, cuando el anfitrión te despierte, señala a un jugador. Si es eliminado, te conviertes en secreto en su rol y tu carta cambia.']
      }
    };
  }
  renderVals() {
    const s = this.state || {};
    const langs = this.langList();
    const lang = langs.some(l => l.code === (s.lang || this.props.language)) ? (s.lang || this.props.language) : 'en';
    const UI = this.ui();
    const LT = LIB_I18N[lang]; // translations for library roles + the newer UI lines
    const T = { ...UI.en, ...(UI[lang] || {}), ...((LT && LT.ui) || {}) };
    const fmt = (str, v) => str.replace(/\{(\w+)\}/g, (m, k) => (v[k] !== undefined ? v[k] : m));
    const RT = (this.roleText()[lang]) || {};
    const NF = { ko: ['Noto Serif KR', 'Noto Sans KR'], zh: ['Noto Serif SC', 'Noto Sans SC'], ja: ['Noto Serif JP', 'Noto Sans JP'], th: ['Noto Serif Thai', 'Noto Sans Thai'] };
    const nf = NF[lang];
    const fD = "'Cinzel', " + (nf ? "'" + nf[0] + "', " : '') + 'serif';
    const fI = "'Cormorant Garamond', " + (nf ? "'" + nf[0] + "', " : '') + 'serif';
    const fB = "'Manrope', " + (nf ? "'" + nf[1] + "', " : '') + 'sans-serif';

    const all = this.roles();
    // NET: custom roles and host edits arrive from the server
    const defs = this.props.roleDefs || {};
    Object.keys(defs).forEach(k => { all[k] = { ...(all[k] || {}), ...defs[k] }; });
    const loc = (k) => {
      const r = all[k]; const d = defs[k] || {};
      // NET: host-written text wins; untouched library roles use this phone's language
      const lib = d.lib && !d.edited ? d.lib : null;
      const t = d.edited ? null : (lib ? (LT && LT.roles[lib]) || null : RT[k]);
      const enMotto = lib ? ((ROLE_LIBRARY.find(e => e.name === lib) || {}).motto || '') : r.motto;
      const wantsOut = k === 'tanner' || lib === 'Fool' || lib === 'Jester';
      const goal = wantsOut ? T.goalTanner : (k === 'doppelganger' ? T.goalDopp : (r.team === 'Werewolves' ? T.goalWolves : (r.team === 'Loner' ? T.goalLoner : T.goalVillage)));
      return { ...r, name: t ? t[0] : r.name, motto: t ? t[1] : enMotto, desc: t ? t[2] : r.desc, goal };
    };
    const key = all[this.props.role] ? this.props.role : 'werewolf';
    const R = loc(key);
    const motif = all[key].motif || ({ werewolf: 'wolf', seer: 'seer', healer: 'healer', witch: 'witch', hunter: 'hunter', villager: 'village' })[key] || 'generic';
    const screen = this.props.screen || 'join'; // NET: the server decides the screen
    const phase = s.phase || this.props.phase || 'night';
    const night = phase === 'night';
    const revealed = s.revealed !== undefined ? s.revealed : !!this.props.revealed;
    const fate = s.fate || this.props.fate || 'none';
    const name = s.name !== undefined ? s.name : (this.props.name || ''); // NET
    const displayName = (this.props.name || name).trim() || '…'; // NET
    const cjk = lang === 'zh' || lang === 'ja' || lang === 'ko';
    const len = R.name.length * (cjk ? 2 : 1);
    const rc = {
      ...R, upper: R.name.toUpperCase(),
      tint: R.tint || ('rgb(' + R.rgb.split(',').map((c, i) => Math.round(+c * 0.22 + [18, 10, 31][i] * 0.78)).join(',') + ')'),
      nameSize: len > 12 ? '26px' : (len > 8 ? '30px' : '38px'),
      descSize: R.desc.length > 150 ? '13.5px' : '14.5px',
      teamLabel: R.team === 'Loner' ? T.onYourOwn : (R.team === 'Werewolves' ? T.teamWolves : T.teamVillage),
      edge: 'rgba(' + R.rgb + ',.55)', frame: 'rgba(' + R.rgb + ',.28)', halo: 'rgba(' + R.rgb + ',.22)',
      isWolf: motif === 'wolf', isSeer: motif === 'seer', isHealer: motif === 'healer',
      isWitch: motif === 'witch', isHunter: motif === 'hunter', isVillager: motif === 'village', isCustom: motif === 'generic'
    };

    // roles the host chose for this round (mock — sent by the host in the real app)
    const deck = (this.props.deck || []).filter(d => all[d[0]]); // NET: the roles the host dealt
    const order = { Village: 0, Werewolves: 1, Loner: 2 };
    const guideRoles = deck.map(([k, count]) => {
      const r = loc(k);
      const team = r.team === 'Werewolves' ? T.teamW : (r.team === 'Loner' ? T.teamL : T.teamV);
      return {
        key: k, name: r.name, desc: r.desc, icon: r.icon, color: r.color, count, multi: count > 1, team, t: order[r.team],
        soft: 'rgba(' + r.rgb + ',.14)', edge: 'rgba(' + r.rgb + ',.32)',
        teamFg: r.team === 'Werewolves' ? '#ffb3bf' : (r.team === 'Loner' ? '#e3c7a5' : '#a6eedd'),
        teamBg: r.team === 'Werewolves' ? 'rgba(224,71,95,.2)' : (r.team === 'Loner' ? 'rgba(201,162,122,.2)' : 'rgba(98,212,166,.16)')
      };
    }).sort((a, b) => a.t - b.t);
    const totalCards = deck.reduce((a, d) => a + d[1], 0);

    const langObj = langs.find(l => l.code === lang);
    return {
      T, lang, fD, fI, fB, rc,
      nameValue: name, displayName, initial: displayName[0].toUpperCase(),
      youreIn: fmt(T.youreIn, { name: displayName }),
      waitingHost: fmt(T.waitingHost, { n: this.props.playerCount || 1 }), // NET
      setName: (e) => this.setState({ name: e.target.value }),
      noName: !name.trim(), joinOpacity: name.trim() ? 1 : 0.45,
      join: () => this.props.onJoin && this.props.onJoin(name.trim()), // NET
      go: { card: () => this.setState({ screen: 'card', revealed: false }) },
      isJoin: screen === 'join', isWaiting: screen === 'waiting', isCard: screen === 'card',

      // guide + language
      guideOpen: !!(s.guide !== undefined ? s.guide : this.props.guide) && screen !== 'join',
      openGuide: () => this.setState({ guide: true }),
      closeGuide: () => this.setState({ guide: false }),
      guideRoles, cardsChip: fmt(T.cardsChip, { n: totalCards }),
      rules: [{ num: '1', text: T.rule1 }, { num: '2', text: T.rule2 }, { num: '3', text: T.rule3 }],
      langOpen: !!(s.langOpen !== undefined ? s.langOpen : this.props.langOpen),
      openLang: () => this.setState({ langOpen: true }),
      closeLang: () => this.setState({ langOpen: false }),
      langShort: langObj.short,
      langs: langs.map(l => {
        const f = NF[l.code];
        return {
          ...l, on: l.code === lang,
          font: "'Manrope', " + (f ? "'" + f[1] + "', " : '') + 'sans-serif',
          border: l.code === lang ? 'rgba(233,220,255,.8)' : 'rgba(236,230,246,.1)',
          bg: l.code === lang ? 'rgba(167,127,240,.2)' : 'rgba(255,255,255,.03)',
          pick: () => this.setState({ lang: l.code, langOpen: false })
        };
      }),

      skyBg: night
        ? 'radial-gradient(120% 70% at 80% 6%, #3b2163 0%, #1a0f2e 42%, #0a0612 78%)'
        : 'radial-gradient(130% 70% at 75% 4%, #b0607a 0%, #6a3462 34%, #2a1238 70%, #120a1c 100%)',
      orbBg: night ? 'radial-gradient(circle at 38% 36%, #fffaf0, #ece2c6 45%, #c9bc9c)' : 'radial-gradient(circle, #ffe9c4, #f2a65a 70%)',
      orbGlow: night ? '0 0 70px 22px rgba(241,233,210,.2)' : '0 0 100px 44px rgba(242,166,90,.42)',
      orbTop: night ? '52px' : '130px',
      starOpacity: night ? 1 : 0,

      phaseName: night ? T.night : T.day,
      phaseIcon: night ? 'M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5z' : 'M12 8a4 4 0 1 0 0 8a4 4 0 1 0 0-8z M12 2v2 M12 20v2 M4.9 4.9l1.4 1.4 M17.7 17.7l1.4 1.4 M2 12h2 M20 12h2 M4.9 19.1l1.4-1.4 M17.7 6.3l1.4-1.4',
      pillBg: night ? 'rgba(167,127,240,.18)' : 'rgba(242,166,90,.22)',
      pillFg: night ? '#e9dcff' : '#ffe0bf',
      pillBorder: night ? 'rgba(199,168,255,.35)' : 'rgba(255,211,168,.45)',
      togglePhase: () => this.setState({ phase: night ? 'day' : 'night' }),
      phaseDemoLabel: night ? T.toDay : T.toNight,
      isAlive: fate === 'none', isKilled: fate === 'killed', isVoted: fate === 'voted',
      killLabel: fate === 'killed' ? T.revive : T.killed,
      voteLabel: fate === 'voted' ? T.revive : T.voted,
      markKilled: () => this.setState({ fate: fate === 'killed' ? 'none' : 'killed', revealed: false }),
      markVoted: () => this.setState({ fate: fate === 'voted' ? 'none' : 'voted', revealed: false }),
      vigOpacity: fate === 'none' ? 0 : 1,
      vigBg: fate === 'voted' ? 'radial-gradient(120% 90% at 50% 40%, rgba(0,0,0,0) 45%, rgba(150,62,14,.5) 100%)' : 'radial-gradient(120% 90% at 50% 40%, rgba(0,0,0,0) 45%, rgba(130,10,30,.55) 100%)',

      cardTransform: revealed ? 'rotateY(180deg)' : 'rotateY(0deg)',
      cardAria: revealed ? T.hintHide : T.tapToSee,
      cardHint: fate !== 'none' ? (revealed ? T.hintFell : T.hintHad) : (revealed ? T.hintHide : T.hintPeek),
      hintIcon: revealed ? 'M3 3l18 18 M10.6 5.1A10 10 0 0 1 12 5c6.4 0 10 7 10 7a17 17 0 0 1-3.2 4 M6.6 6.6C3.7 8.4 2 12 2 12s3.6 7 10 7a9.7 9.7 0 0 0 5.4-1.6' : 'M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z M12 9a3 3 0 1 0 0 6a3 3 0 1 0 0-6z',
      flip: () => this.setState({ revealed: !revealed }),
      demo: !!this.props.demo, // NET: prototype-only buttons stay hidden in the real app
      showRoleList: this.props.showRoles !== false && deck.length > 0
    };
  }

  render() {
    const v: any = this.renderVals();
    return (
      <div className="sky" lang={v.lang} style={{ position: 'relative', width: '390px', overflow: 'clip', height: (this.props.frameH ? this.props.frameH + 'px' : '844px') /* NET: fills the phone screen */, fontFamily: v.fB, color: '#ece6f6', background: v.skyBg }}>
        <div aria-hidden="true" style={{ position: 'absolute', inset: '0', pointerEvents: 'none' }}>
          <div style={{ position: 'absolute', top: v.orbTop, right: '30px', width: '58px', height: '58px', borderRadius: '50%', background: v.orbBg, boxShadow: v.orbGlow, transition: 'all 1.4s ease' }} />
          <span className="twinkle" style={{ position: 'absolute', top: '70px', left: '40px', width: '2px', height: '2px', borderRadius: '50%', background: '#fff', opacity: v.starOpacity }} />
          <span className="twinkle" style={{ position: 'absolute', top: '130px', left: '150px', width: '3px', height: '3px', borderRadius: '50%', background: '#e6dcff', animationDelay: '1.1s', opacity: v.starOpacity }} />
          <span className="twinkle" style={{ position: 'absolute', top: '46px', left: '220px', width: '2px', height: '2px', borderRadius: '50%', background: '#fff', animationDelay: '2.2s', opacity: v.starOpacity }} />
          <span className="twinkle" style={{ position: 'absolute', top: '200px', left: '24px', width: '2px', height: '2px', borderRadius: '50%', background: '#fff', animationDelay: '1.7s', opacity: v.starOpacity }} />
          <img src="/forest-phone.svg" alt="" style={{ position: 'absolute', left: '0', bottom: '0', width: '390px', height: '280px', objectFit: 'cover', objectPosition: 'bottom' }} />
          <div className="fog" style={{ position: 'absolute', left: '0', bottom: '20px', width: '780px', height: '180px', background: 'radial-gradient(40% 50% at 20% 60%, rgba(190,165,240,.12), transparent 70%), radial-gradient(35% 45% at 60% 50%, rgba(190,165,240,.09), transparent 70%), radial-gradient(40% 50% at 90% 60%, rgba(190,165,240,.12), transparent 70%)' }} />
        </div>
        <div className="vignette" aria-hidden="true" style={{ position: 'absolute', inset: '0', pointerEvents: 'none', opacity: v.vigOpacity, background: v.vigBg }} />
        <div style={{ position: 'absolute', inset: '0', padding: '56px 24px 30px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column' }}>
          {(v.isJoin) ? (
            <>
              <div className="rise" style={{ flex: '1', display: 'flex', flexDirection: 'column' }}>
                <div style={{ marginTop: '48px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px', textAlign: 'center' }}>
                  <div className="float" style={{ position: 'relative', width: '96px', height: '96px', borderRadius: '50%', border: '1px solid rgba(199,168,255,.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'radial-gradient(circle, rgba(167,127,240,.25), rgba(167,127,240,0) 70%)' }}>
                    <span className="ring" style={{ position: 'absolute', inset: '0', borderRadius: '50%', border: '1px solid rgba(199,168,255,.4)' }} />
                    <svg width="46" height="46" viewBox="0 0 24 24" fill="none" stroke="#f1e9d2" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5z" />
                    </svg>
                  </div>
                  <span style={{ fontFamily: "'Cinzel', serif", fontWeight: '700', fontSize: '34px', letterSpacing: '.24em', marginRight: '-.24em' }}>
                    MOONFALL
                  </span>
                  <span style={{ fontFamily: v.fI, fontStyle: 'italic', fontSize: '20px', color: '#c9bce0' }}>
                    {v.T.tagline}
                  </span>
                </div>
                <div style={{ flex: '1' }} />
                <form style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '22px 20px 20px', borderRadius: '26px', background: 'rgba(20,12,34,.78)', border: '1px solid rgba(190,165,235,.2)', backdropFilter: 'blur(14px)' }}>
                  <span style={{ alignSelf: 'flex-start', height: '30px', padding: '0 12px', borderRadius: '999px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: '600', background: 'rgba(98,212,166,.12)', color: '#a6eedd' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12.5l4.5 4.5L19 7.5" />
                    </svg>
                    {' '}{v.T.connected}
                  </span>
                  <label style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <span style={{ fontFamily: v.fD, fontWeight: '600', fontSize: '22px' }}>
                      {v.T.whatsName}
                    </span>
                    <input type="text" value={v.nameValue} onChange={v.setName} placeholder={v.T.namePh} autoComplete="nickname" style={{ height: '60px', padding: '0 18px', borderRadius: '16px', border: '1px solid rgba(236,230,246,.18)', background: 'rgba(10,6,18,.6)', color: '#ece6f6', fontSize: '20px', fontWeight: '600' }} />
                    <span style={{ fontSize: '13px', color: '#a99bc2' }}>
                      {v.T.nameHelp}
                    </span>
                  </label>
                  <button type="button" className="press" onClick={v.join} disabled={v.noName} style={{ height: '60px', borderRadius: '16px', border: 'none', background: '#e9dcff', color: '#160b28', fontSize: '18px', fontWeight: '700', opacity: v.joinOpacity, boxShadow: '0 0 40px rgba(199,168,255,.35)' }}>
                    {v.T.join}
                  </button>
                </form>
              </div>
            </>
          ) : null}
          {(v.isWaiting) ? (
            <>
              <div className="rise" style={{ flex: '1', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '18px' }}>
                <div style={{ flex: '1' }} />
                <div style={{ position: 'relative', width: '120px', height: '120px' }}>
                  <span className="ring" style={{ position: 'absolute', inset: '0', borderRadius: '50%', border: '1px solid rgba(199,168,255,.55)' }} />
                  <span className="ring" style={{ position: 'absolute', inset: '0', borderRadius: '50%', border: '1px solid rgba(199,168,255,.55)', animationDelay: '1.2s' }} />
                  <span style={{ position: 'absolute', inset: '18px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: v.fD, fontWeight: '700', fontSize: '38px', color: '#12091c', background: '#c9a7ff', boxShadow: '0 0 50px rgba(201,167,255,.45)' }}>
                    {v.initial}
                  </span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <h1 style={{ margin: '0', fontFamily: v.fD, fontWeight: '600', fontSize: '28px', lineHeight: '1.25' }}>
                    {v.youreIn}
                  </h1>
                  <p style={{ margin: '0', fontSize: '16px', lineHeight: '1.5', color: '#c4b8da' }}>
                    {v.T.sitBack}
                  </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minHeight: '40px', padding: '0 16px', borderRadius: '999px', background: 'rgba(20,12,34,.7)', border: '1px solid rgba(190,165,235,.18)', fontSize: '14px', color: '#c4b8da' }}>
                  <span className="pulse" style={{ width: '8px', height: '8px', flex: 'none', borderRadius: '50%', background: '#c7a8ff' }} />
                  {' '}{v.waitingHost}
                </div>
                <div style={{ flex: '1' }} />
                <button className="press guidebtn" onClick={v.openGuide} style={{ height: '48px', padding: '0 22px 0 16px', borderRadius: '999px', border: '1px solid rgba(199,168,255,.45)', background: 'rgba(30,18,52,.88)', backdropFilter: 'blur(10px)', color: '#f1e9ff', fontSize: '15px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z M4 21V5 M8 7h7 M8 11h7" />
                  </svg>
                  {' '}{v.T.guideBtn}
                </button>
                {(v.demo) ? (
                  <>
                    <button className="press" onClick={v.go.card} style={{ height: '40px', padding: '0 18px', borderRadius: '12px', border: '1px dashed rgba(236,230,246,.22)', background: 'transparent', color: '#a99bc2', fontSize: '13px', fontWeight: '600' }}>
                      {v.T.protoDeal}
                    </button>
                  </>
                ) : null}
              </div>
            </>
          ) : null}
          {(v.isCard) ? (
            <>
              <div className="rise" style={{ flex: '1', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                <div aria-hidden="true" style={{ width: '100%', height: '36px', flex: 'none' }} />
                <button onClick={v.flip} aria-label={v.cardAria} style={{ position: 'relative', marginTop: '8px', width: '326px', height: '520px', flex: 'none', padding: '0', border: 'none', background: 'transparent', color: 'inherit', perspective: '1400px', textAlign: 'center', fontFamily: 'inherit' }}>
                  <div className="flip" style={{ position: 'absolute', inset: '0', transformStyle: 'preserve-3d', transform: v.cardTransform }}>
                    {(v.isAlive) ? (
                      <>
                        <div className="face" style={{ position: 'absolute', inset: '0', borderRadius: '26px', overflow: 'hidden', background: 'radial-gradient(circle at 50% 42%, #33205a 0%, #1a0f30 55%, #0e0819 100%)', border: '1px solid rgba(199,168,255,.42)', boxShadow: '0 30px 80px rgba(0,0,0,.6), 0 0 60px rgba(167,127,240,.2)' }}>
                          <div style={{ position: 'absolute', inset: '10px', borderRadius: '18px', border: '1px solid rgba(199,168,255,.22)' }} />
                          <svg width="326" height="520" viewBox="0 0 326 520" style={{ position: 'absolute', inset: '0' }} aria-hidden="true">
                            <g fill="#e9dcff" opacity=".5">
                              <circle cx="54" cy="70" r="1.2" />
                              <circle cx="272" cy="96" r="1" />
                              <circle cx="90" cy="420" r="1" />
                              <circle cx="250" cy="440" r="1.3" />
                              <circle cx="40" cy="270" r=".9" />
                              <circle cx="290" cy="290" r=".9" />
                              <circle cx="160" cy="60" r="1" />
                            </g>
                            <circle cx="163" cy="226" r="98" fill="none" stroke="rgba(199,168,255,.25)" strokeWidth="1" />
                            <circle cx="163" cy="226" r="116" fill="none" stroke="rgba(199,168,255,.12)" strokeWidth="1" strokeDasharray="2 6" />
                            <path d="M163 112v-14 M163 354v-14 M49 226h14 M277 226h-14" stroke="rgba(199,168,255,.4)" strokeWidth="1" />
                            <path d="M193 256A44 44 0 1 1 145 188a36 36 0 0 0 48 68z" fill="rgba(241,233,210,.92)" />
                          </svg>
                          <div style={{ position: 'absolute', left: '0', right: '0', bottom: '50px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px' }}>
                            <span style={{ fontFamily: "'Cinzel', serif", fontWeight: '700', fontSize: '20px', letterSpacing: '.3em', marginRight: '-.3em' }}>
                              MOONFALL
                            </span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '8px', minHeight: '40px', padding: '0 16px', borderRadius: '999px', background: 'rgba(167,127,240,.2)', border: '1px solid rgba(199,168,255,.4)', fontSize: '14px', fontWeight: '700', color: '#f1e9ff' }}>
                              <svg className="tap" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M9 11V5.5a1.5 1.5 0 0 1 3 0V11 M12 10.5V9a1.5 1.5 0 0 1 3 0v2 M15 10.5a1.5 1.5 0 0 1 3 0V15a6 6 0 0 1-6 6h-.5a6 6 0 0 1-4.6-2.2L4.5 15.6a1.5 1.5 0 0 1 2.3-1.9L9 16" />
                              </svg>
                              {' '}{v.T.tapToSee}
                            </span>
                          </div>
                        </div>
                      </>
                    ) : null}
                    {(v.isKilled) ? (
                      <>
                        <div className="face fateIn" style={{ position: 'absolute', inset: '0', borderRadius: '26px', overflow: 'hidden', background: 'radial-gradient(circle at 50% 24%, #6a1222 0%, #2a0a14 46%, #0d0508 100%)', border: '1px solid rgba(224,71,95,.6)', boxShadow: '0 30px 80px rgba(0,0,0,.65), 0 0 80px rgba(224,71,95,.35)' }}>
                          <div style={{ position: 'absolute', inset: '10px', borderRadius: '18px', border: '1px solid rgba(224,71,95,.28)' }} />
                          <svg width="326" height="520" viewBox="0 0 326 520" style={{ position: 'absolute', inset: '0' }} aria-hidden="true">
                            <circle cx="163" cy="128" r="118" fill="rgba(224,71,95,.06)" />
                            <circle cx="163" cy="128" r="88" fill="rgba(224,71,95,.1)" />
                            <g className="bloodmoon">
                              <circle cx="163" cy="128" r="62" fill="#9a2233" />
                              <circle cx="148" cy="112" r="12" fill="rgba(60,0,10,.35)" />
                              <circle cx="182" cy="142" r="8" fill="rgba(60,0,10,.3)" />
                              <circle cx="170" cy="100" r="5" fill="rgba(60,0,10,.3)" />
                              <circle cx="163" cy="128" r="62" fill="none" stroke="rgba(255,150,160,.45)" strokeWidth="1.2" />
                            </g>
                            <g fill="none" strokeLinecap="round">
                              <path className="slash" d="M250 34C214 104 172 168 112 250" stroke="rgba(70,0,12,.85)" strokeWidth="13" />
                              <path className="slash" d="M282 54C246 124 204 188 144 270" stroke="rgba(70,0,12,.85)" strokeWidth="13" style={{ animationDelay: '.12s' }} />
                              <path className="slash" d="M306 84C272 150 234 210 178 288" stroke="rgba(70,0,12,.85)" strokeWidth="13" style={{ animationDelay: '.24s' }} />
                              <path className="slash" d="M250 34C214 104 172 168 112 250" stroke="#ffd2d8" strokeWidth="2.4" />
                              <path className="slash" d="M282 54C246 124 204 188 144 270" stroke="#ffd2d8" strokeWidth="2.4" style={{ animationDelay: '.12s' }} />
                              <path className="slash" d="M306 84C272 150 234 210 178 288" stroke="#ffd2d8" strokeWidth="2.4" style={{ animationDelay: '.24s' }} />
                            </g>
                          </svg>
                          <span className="drip" style={{ position: 'absolute', left: '110px', top: '248px', width: '5px', height: '9px', borderRadius: '50% 50% 50% 50% / 30% 30% 70% 70%', background: '#b3243a' }} />
                          <span className="drip" style={{ position: 'absolute', left: '142px', top: '268px', width: '4px', height: '8px', borderRadius: '50% 50% 50% 50% / 30% 30% 70% 70%', background: '#b3243a', animationDelay: '1.1s' }} />
                          <span className="drip" style={{ position: 'absolute', left: '176px', top: '286px', width: '5px', height: '9px', borderRadius: '50% 50% 50% 50% / 30% 30% 70% 70%', background: '#b3243a', animationDelay: '.6s' }} />
                          <div style={{ position: 'absolute', left: '0', right: '0', bottom: '0', padding: '0 28px 26px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontSize: '11px', fontWeight: '800', letterSpacing: '.22em', textTransform: 'uppercase', color: '#ff8a9b' }}>
                              {v.T.whenKilled}
                            </span>
                            <span style={{ fontFamily: v.fD, fontWeight: '700', fontSize: '30px', lineHeight: '1.12', letterSpacing: '.04em', color: '#fff0f2', textShadow: '0 0 24px rgba(224,71,95,.6)' }}>
                              {v.T.killedT1}
                              <br />
                              {v.T.killedT2}
                            </span>
                            <span style={{ fontFamily: v.fI, fontStyle: 'italic', fontSize: '18px', lineHeight: '1.3', color: '#f2c4cb' }}>
                              {v.T.killedLine}
                            </span>
                            <span style={{ marginTop: '6px', display: 'flex', alignItems: 'center', gap: '8px', minHeight: '34px', padding: '0 14px 0 8px', borderRadius: '999px', background: 'rgba(0,0,0,.35)', border: `1px solid ${v.rc.frame}`, fontSize: '13px', fontWeight: '700' }}>
                              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={v.rc.color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                                <path d={v.rc.icon} />
                              </svg>
                              <span>
                                {v.T.youWereA}
                                <span style={{ color: v.rc.color }}>
                                  {v.rc.name}
                                </span>
                                {v.T.youWereB}
                              </span>
                            </span>
                            <span style={{ marginTop: '4px', fontSize: '12.5px', lineHeight: '1.5', color: '#d9b8be' }}>
                              {v.T.killedRule}
                            </span>
                          </div>
                        </div>
                      </>
                    ) : null}
                    {(v.isVoted) ? (
                      <>
                        <div className="face fateIn" style={{ position: 'absolute', inset: '0', borderRadius: '26px', overflow: 'hidden', background: 'radial-gradient(circle at 50% 108%, #8a3a10 0%, #3d170a 42%, #120806 100%)', border: '1px solid rgba(242,166,90,.6)', boxShadow: '0 30px 80px rgba(0,0,0,.65), 0 0 80px rgba(242,166,90,.3)' }}>
                          <div style={{ position: 'absolute', inset: '10px', borderRadius: '18px', border: '1px solid rgba(242,166,90,.28)' }} />
                          <svg width="326" height="520" viewBox="0 0 326 520" style={{ position: 'absolute', inset: '0' }} aria-hidden="true">
                            <g fill="none" stroke="rgba(242,166,90,.38)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M163 40V292 M145 40V66H181V40 M163 32V66" transform="rotate(32 163 150)" />
                              <path d="M163 40V292 M145 40V66H181V40 M163 32V66" transform="rotate(-32 163 150)" />
                            </g>
                          </svg>
                          <span style={{ position: 'absolute', left: '34px', top: '74px', width: '6px', height: '64px', borderRadius: '3px', background: 'linear-gradient(#5a3418, #2a160a)' }} />
                          <span className="flame" style={{ position: 'absolute', left: '25px', top: '44px', width: '24px', height: '36px', borderRadius: '50% 50% 50% 50% / 62% 62% 38% 38%', background: 'radial-gradient(circle at 50% 70%, #fff3d0 0%, #ffc56b 35%, #f2a65a 60%, rgba(242,120,40,0) 75%)', filter: 'blur(.4px)' }} />
                          <span style={{ position: 'absolute', right: '34px', top: '74px', width: '6px', height: '64px', borderRadius: '3px', background: 'linear-gradient(#5a3418, #2a160a)' }} />
                          <span className="flame" style={{ position: 'absolute', right: '25px', top: '44px', width: '24px', height: '36px', borderRadius: '50% 50% 50% 50% / 62% 62% 38% 38%', background: 'radial-gradient(circle at 50% 70%, #fff3d0 0%, #ffc56b 35%, #f2a65a 60%, rgba(242,120,40,0) 75%)', filter: 'blur(.4px)', animationDelay: '.4s' }} />
                          <span className="ember" style={{ position: 'absolute', left: '60px', bottom: '30px', width: '3px', height: '3px', borderRadius: '50%', background: '#ffc56b' }} />
                          <span className="ember" style={{ position: 'absolute', left: '120px', bottom: '20px', width: '2px', height: '2px', borderRadius: '50%', background: '#ffd9a0', animationDelay: '1.2s' }} />
                          <span className="ember" style={{ position: 'absolute', left: '200px', bottom: '26px', width: '3px', height: '3px', borderRadius: '50%', background: '#ffc56b', animationDelay: '2.1s' }} />
                          <span className="ember" style={{ position: 'absolute', left: '262px', bottom: '18px', width: '2px', height: '2px', borderRadius: '50%', background: '#ffd9a0', animationDelay: '.7s' }} />
                          <div className="stamp" style={{ position: 'absolute', left: '93px', top: '80px', width: '140px', height: '140px', borderRadius: '50%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '2px', background: 'radial-gradient(circle at 40% 35%, #b43a26 0%, #8c2a1c 55%, #5e1a10 100%)', border: '6px dotted #8c2a1c', boxShadow: '0 10px 30px rgba(0,0,0,.55), inset 0 0 0 10px rgba(0,0,0,.12)' }}>
                            <span style={{ width: '104px', height: '104px', boxSizing: 'border-box', borderRadius: '50%', border: '1.5px solid rgba(255,210,170,.45)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '2px', textAlign: 'center' }}>
                              <span style={{ fontFamily: v.fD, fontWeight: '700', fontSize: '19px', letterSpacing: '.1em', marginRight: '-.1em', color: '#ffe0c2' }}>
                                {v.T.exiled}
                              </span>
                              <span style={{ fontSize: '9px', fontWeight: '800', letterSpacing: '.16em', textTransform: 'uppercase', color: 'rgba(255,224,194,.75)' }}>
                                {v.T.byVillage}
                              </span>
                            </span>
                          </div>
                          <div style={{ position: 'absolute', left: '0', right: '0', bottom: '0', padding: '0 28px 26px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontSize: '11px', fontWeight: '800', letterSpacing: '.22em', textTransform: 'uppercase', color: '#ffc98a' }}>
                              {v.T.whenVoted}
                            </span>
                            <span style={{ fontFamily: v.fD, fontWeight: '700', fontSize: '30px', lineHeight: '1.12', letterSpacing: '.04em', color: '#fff4e8', textShadow: '0 0 24px rgba(242,166,90,.55)' }}>
                              {v.T.votedT1}
                              <br />
                              {v.T.votedT2}
                            </span>
                            <span style={{ fontFamily: v.fI, fontStyle: 'italic', fontSize: '18px', lineHeight: '1.3', color: '#f2d4b4' }}>
                              {v.T.votedLine}
                            </span>
                            <span style={{ marginTop: '6px', display: 'flex', alignItems: 'center', gap: '8px', minHeight: '34px', padding: '0 14px 0 8px', borderRadius: '999px', background: 'rgba(0,0,0,.35)', border: `1px solid ${v.rc.frame}`, fontSize: '13px', fontWeight: '700' }}>
                              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={v.rc.color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                                <path d={v.rc.icon} />
                              </svg>
                              <span>
                                {v.T.youWereA}
                                <span style={{ color: v.rc.color }}>
                                  {v.rc.name}
                                </span>
                                {v.T.youWereB}
                              </span>
                            </span>
                            <span style={{ marginTop: '4px', fontSize: '12.5px', lineHeight: '1.5', color: '#dcc0a6' }}>
                              {v.T.votedRule}
                            </span>
                          </div>
                        </div>
                      </>
                    ) : null}
                    <div className="face" style={{ position: 'absolute', inset: '0', transform: 'rotateY(180deg)', borderRadius: '26px', overflow: 'hidden', background: `linear-gradient(170deg, ${v.rc.tint} 0%, #120a1f 62%, #0b0614 100%)`, border: `1px solid ${v.rc.edge}`, boxShadow: `0 30px 80px rgba(0,0,0,.6), 0 0 70px ${v.rc.halo}` }}>
                      <div style={{ position: 'absolute', inset: '10px', borderRadius: '18px', border: `1px solid ${v.rc.frame}` }} />
                      <span style={{ position: 'absolute', top: '6px', left: '6px', width: '8px', height: '8px', transform: 'rotate(45deg)', background: v.rc.color }} />
                      <span style={{ position: 'absolute', top: '6px', right: '6px', width: '8px', height: '8px', transform: 'rotate(45deg)', background: v.rc.color }} />
                      <span style={{ position: 'absolute', bottom: '6px', left: '6px', width: '8px', height: '8px', transform: 'rotate(45deg)', background: v.rc.color }} />
                      <span style={{ position: 'absolute', bottom: '6px', right: '6px', width: '8px', height: '8px', transform: 'rotate(45deg)', background: v.rc.color }} />
                      {(v.rc.isWolf) ? (
                        <>
                          <svg width="326" height="520" viewBox="0 0 326 520" style={{ position: 'absolute', inset: '0' }} aria-hidden="true">
                            <g fill="#e0475f" opacity=".22">
                              <path d="M228 30c22 52 26 112 4 178c10-64 4-122-12-176z" />
                              <path d="M256 26c24 54 28 116 6 182c10-66 4-126-14-180z" />
                              <path d="M284 34c20 48 22 104 2 164c8-58 4-112-10-162z" />
                            </g>
                            <g fill="#e0475f" opacity=".1">
                              <path d="M34 330c18 44 20 92 2 142c8-50 4-98-10-140z" />
                              <path d="M58 326c18 46 20 96 2 148c8-52 4-102-10-146z" />
                            </g>
                          </svg>
                        </>
                      ) : null}
                      {(v.rc.isSeer) ? (
                        <>
                          <svg width="326" height="520" viewBox="0 0 326 520" style={{ position: 'absolute', inset: '0' }} aria-hidden="true">
                            <g fill="none" stroke="#7fb2ff">
                              <circle cx="163" cy="146" r="84" opacity=".22" />
                              <circle cx="163" cy="146" r="110" opacity=".14" strokeDasharray="1 7" />
                              <circle cx="163" cy="146" r="140" opacity=".1" />
                              <circle cx="163" cy="146" r="176" opacity=".07" strokeDasharray="3 9" />
                            </g>
                            <g fill="#cfe1ff" opacity=".6">
                              <circle cx="48" cy="60" r="1.3" />
                              <circle cx="282" cy="72" r="1" />
                              <circle cx="60" cy="230" r="1" />
                              <circle cx="276" cy="246" r="1.4" />
                              <circle cx="40" cy="450" r="1" />
                              <circle cx="290" cy="460" r="1" />
                            </g>
                          </svg>
                        </>
                      ) : null}
                      {(v.rc.isHealer) ? (
                        <>
                          <svg width="326" height="520" viewBox="0 0 326 520" style={{ position: 'absolute', inset: '0' }} aria-hidden="true">
                            <g stroke="#62d4a6" strokeWidth="1" opacity=".22">
                              <path d="M163 12v58 M163 222v58" />
                              <path d="M163 12v58 M163 222v58" transform="rotate(30 163 146)" />
                              <path d="M163 12v58 M163 222v58" transform="rotate(60 163 146)" />
                              <path d="M163 12v58 M163 222v58" transform="rotate(90 163 146)" />
                              <path d="M163 12v58 M163 222v58" transform="rotate(120 163 146)" />
                              <path d="M163 12v58 M163 222v58" transform="rotate(150 163 146)" />
                            </g>
                            <path d="M20 512c30-40 40-70 30-110 M306 512c-30-40-40-70-30-110" fill="none" stroke="#62d4a6" opacity=".16" />
                            <g fill="#62d4a6" opacity=".16">
                              <path d="M44 434c-14-4-20-14-18-24 12 2 20 10 18 24z" />
                              <path d="M282 434c14-4 20-14 18-24-12 2-20 10-18 24z" />
                              <path d="M50 462c-14 0-22-8-22-18 12 0 22 6 22 18z" />
                              <path d="M276 462c14 0 22-8 22-18-12 0-22 6-22 18z" />
                            </g>
                          </svg>
                        </>
                      ) : null}
                      {(v.rc.isWitch) ? (
                        <>
                          <svg width="326" height="520" viewBox="0 0 326 520" style={{ position: 'absolute', inset: '0' }} aria-hidden="true">
                            <g fill="none" stroke="#c98bf2" strokeLinecap="round">
                              <path d="M30 512c30-50-20-80 10-130s-10-90 30-130" opacity=".2" strokeWidth="1.4" />
                              <path d="M296 512c-30-50 20-80-10-130s10-90-30-130" opacity=".2" strokeWidth="1.4" />
                              <path d="M60 512c20-40-10-60 10-100" opacity=".12" />
                              <path d="M266 512c-20-40 10-60-10-100" opacity=".12" />
                              <circle cx="78" cy="70" r="6" opacity=".25" />
                              <circle cx="250" cy="52" r="4" opacity=".25" />
                              <circle cx="262" cy="96" r="8" opacity=".15" />
                            </g>
                          </svg>
                        </>
                      ) : null}
                      {(v.rc.isHunter) ? (
                        <>
                          <svg width="326" height="520" viewBox="0 0 326 520" style={{ position: 'absolute', inset: '0' }} aria-hidden="true">
                            <g fill="none" stroke="#f2a65a">
                              <circle cx="163" cy="146" r="96" opacity=".24" />
                              <circle cx="163" cy="146" r="128" opacity=".1" />
                              <path d="M163 26v40 M163 226v40 M43 146h40 M243 146h40" opacity=".35" strokeWidth="1.2" />
                              <path d="M66 49l14 14 M260 49l-14 14 M66 243l14-14 M260 243l-14-14" opacity=".2" />
                            </g>
                            <path d="M24 490L120 394 M112 394h8v8" fill="none" stroke="#f2a65a" opacity=".16" strokeWidth="1.2" />
                          </svg>
                        </>
                      ) : null}
                      {(v.rc.isVillager) ? (
                        <>
                          <svg width="326" height="520" viewBox="0 0 326 520" style={{ position: 'absolute', inset: '0' }} aria-hidden="true">
                            <path d="M10 510V472h26v-18l22-20 22 20v38h22v-30l30-26 30 26v30h20V462l24-22 24 22v12h24v-16l20-18 20 18v52" fill="none" stroke="#e8d3a0" opacity=".2" strokeWidth="1.2" />
                            <g fill="#f2c96a" opacity=".35">
                              <rect x="52" y="462" width="6" height="8" />
                              <rect x="126" y="462" width="7" height="9" />
                              <rect x="201" y="458" width="6" height="8" />
                            </g>
                            <circle cx="163" cy="146" r="100" fill="none" stroke="#e8d3a0" opacity=".1" />
                          </svg>
                        </>
                      ) : null}
                      {(v.rc.isCustom) ? (
                        <>
                          <svg width="326" height="520" viewBox="0 0 326 520" style={{ position: 'absolute', inset: '0' }} aria-hidden="true">
                            <g fill="none" stroke={v.rc.color}>
                              <circle cx="163" cy="146" r="92" opacity=".2" />
                              <circle cx="163" cy="146" r="124" opacity=".1" strokeDasharray="2 8" />
                            </g>
                            <g fill={v.rc.color} opacity=".35">
                              <path d="M60 70l2 5 5 2-5 2-2 5-2-5-5-2 5-2z" />
                              <path d="M270 110l1.5 4 4 1.5-4 1.5-1.5 4-1.5-4-4-1.5 4-1.5z" />
                              <path d="M50 440l2 5 5 2-5 2-2 5-2-5-5-2 5-2z" />
                              <path d="M276 470l1.5 4 4 1.5-4 1.5-1.5 4-1.5-4-4-1.5 4-1.5z" />
                            </g>
                          </svg>
                        </>
                      ) : null}
                      <div style={{ position: 'absolute', inset: '0', padding: '30px 28px 26px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '11px', letterSpacing: '.16em', textTransform: 'uppercase', fontWeight: '700', color: v.rc.color }}>
                            {v.rc.teamLabel}
                          </span>
                          <span style={{ fontSize: '11px', letterSpacing: '.12em', textTransform: 'uppercase', fontWeight: '700', color: '#a99bc2' }}>
                            {v.T.yourRole}
                          </span>
                        </div>
                        <div className="shimmer" style={{ marginTop: '18px', width: '116px', height: '116px', flex: 'none', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${v.rc.edge}`, background: `radial-gradient(circle, ${v.rc.halo} 0%, rgba(0,0,0,0) 70%)`, boxShadow: `0 0 60px ${v.rc.halo}, inset 0 0 30px ${v.rc.halo}` }}>
                          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke={v.rc.color} strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round">
                            <path d={v.rc.icon} />
                          </svg>
                        </div>
                        <span style={{ marginTop: '16px', fontFamily: v.fD, fontWeight: '700', fontSize: v.rc.nameSize, lineHeight: '1.15', letterSpacing: '.06em', marginRight: '-.06em', color: '#f6f1ff' }}>
                          {v.rc.upper}
                        </span>
                        <span style={{ marginTop: '2px', fontFamily: v.fI, fontStyle: 'italic', fontSize: '19px', color: v.rc.color }}>
                          {v.rc.motto}
                        </span>
                        <div style={{ margin: '12px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span style={{ width: '44px', height: '1px', background: v.rc.frame }} />
                          <span style={{ width: '6px', height: '6px', transform: 'rotate(45deg)', border: `1px solid ${v.rc.color}` }} />
                          <span style={{ width: '44px', height: '1px', background: v.rc.frame }} />
                        </div>
                        <p style={{ margin: '0', fontSize: v.rc.descSize, lineHeight: '1.5', color: '#e0d8ee' }}>
                          {v.rc.desc}
                        </p>
                        <div style={{ flex: '1' }} />
                        <span style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', borderRadius: '14px', fontSize: '13px', fontWeight: '600', color: '#ece6f6', background: 'rgba(0,0,0,.32)', border: `1px solid ${v.rc.frame}` }}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={v.rc.color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ flex: 'none' }}>
                            <path d="M4 21V4 M4 4h12l-2 4 2 4H4" />
                          </svg>
                          {' '}{v.rc.goal}
                        </span>
                      </div>
                    </div>
                  </div>
                </button>
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#c4b8da' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{ flex: 'none' }}>
                    <path d={v.hintIcon} />
                  </svg>
                  {' '}{v.cardHint}
                </span>
                <div style={{ flex: '1' }} />
                <button className="press guidebtn" onClick={v.openGuide} style={{ height: '46px', padding: '0 22px 0 16px', borderRadius: '999px', border: '1px solid rgba(199,168,255,.45)', background: 'rgba(30,18,52,.88)', backdropFilter: 'blur(10px)', color: '#f1e9ff', fontSize: '15px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z M4 21V5 M8 7h7 M8 11h7" />
                  </svg>
                  {' '}{v.T.guideBtn}
                </button>
                {(v.demo) ? (
                  <>
                    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <span style={{ textAlign: 'center', fontSize: '11px', fontWeight: '700', letterSpacing: '.12em', textTransform: 'uppercase', color: '#8f82a8' }}>
                        {v.T.protoLabel}
                      </span>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '6px' }}>
                        <button className="press" onClick={v.togglePhase} style={{ height: '40px', padding: '0 4px', borderRadius: '12px', border: '1px dashed rgba(236,230,246,.22)', background: 'transparent', color: '#a99bc2', fontSize: '12.5px', fontWeight: '700' }}>
                          {v.phaseDemoLabel}
                        </button>
                        <button className="press" onClick={v.markKilled} style={{ height: '40px', padding: '0 4px', borderRadius: '12px', border: '1px dashed rgba(255,138,155,.35)', background: 'transparent', color: '#ff8a9b', fontSize: '12.5px', fontWeight: '700' }}>
                          {v.killLabel}
                        </button>
                        <button className="press" onClick={v.markVoted} style={{ height: '40px', padding: '0 4px', borderRadius: '12px', border: '1px dashed rgba(242,166,90,.35)', background: 'transparent', color: '#ffc98a', fontSize: '12.5px', fontWeight: '700' }}>
                          {v.voteLabel}
                        </button>
                      </div>
                    </div>
                  </>
                ) : null}
              </div>
            </>
          ) : null}
        </div>
        <button className="press" onClick={v.openLang} aria-label={v.T.langTitle} style={{ position: 'absolute', top: '56px', left: '24px', height: '36px', padding: '0 12px 0 10px', borderRadius: '999px', border: '1px solid rgba(199,168,255,.35)', background: 'rgba(20,12,34,.72)', backdropFilter: 'blur(10px)', color: '#e9dcff', fontSize: '13px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 3a9 9 0 1 0 0 18a9 9 0 1 0 0-18z M3 12h18 M12 3c2.5 2.7 3.8 5.7 3.8 9s-1.3 6.3-3.8 9c-2.5-2.7-3.8-5.7-3.8-9S9.5 5.7 12 3z" />
          </svg>
          {' '}{v.langShort}
        </button>
        {(v.guideOpen) ? (
          <>
            <div className="fade" onClick={v.closeGuide} style={{ position: 'absolute', inset: '0', background: 'rgba(5,3,10,.7)', backdropFilter: 'blur(3px)' }} />
            <section className="sheet" aria-label={v.T.guideTitle} style={{ position: 'absolute', left: '0', right: '0', bottom: '0', height: '796px', borderRadius: '28px 28px 0 0', background: 'linear-gradient(180deg, #1f1236 0%, #120a20 60%)', borderTop: '1px solid rgba(199,168,255,.32)', boxShadow: '0 -20px 60px rgba(0,0,0,.6)', display: 'flex', flexDirection: 'column' }}>
              <div style={{ padding: '10px 20px 12px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                <span style={{ width: '40px', height: '5px', borderRadius: '999px', background: 'rgba(236,230,246,.25)' }} />
                <div style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ width: '44px', height: '44px', flex: 'none', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(167,127,240,.18)', border: '1px solid rgba(199,168,255,.4)' }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#e9dcff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z M4 21V5 M8 7h7 M8 11h7" />
                    </svg>
                  </span>
                  <span style={{ flex: '1', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <span style={{ fontSize: '11px', fontWeight: '800', letterSpacing: '.16em', textTransform: 'uppercase', color: '#c7a8ff' }}>
                      Moonfall · HOWL
                    </span>
                    <h2 style={{ margin: '0', fontFamily: v.fD, fontWeight: '600', fontSize: '22px' }}>
                      {v.T.guideTitle}
                    </h2>
                  </span>
                  <button className="press" onClick={v.closeGuide} aria-label={v.T.close} style={{ width: '44px', height: '44px', flex: 'none', borderRadius: '12px', border: 'none', background: 'rgba(255,255,255,.06)', color: '#ece6f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                      <path d="M6 6l12 12M18 6L6 18" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="scroll" style={{ flex: '1', minHeight: '0', padding: '4px 20px 20px', display: 'flex', flexDirection: 'column', gap: '22px' }}>
                <section style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <h3 style={{ margin: '0', fontSize: '12px', fontWeight: '800', letterSpacing: '.14em', textTransform: 'uppercase', color: '#a99bc2' }}>
                    {v.T.aboutHead}
                  </h3>
                  <p style={{ margin: '0', fontSize: '15px', lineHeight: '1.6', color: '#e4dcf0' }}>
                    {v.T.aboutText}
                  </p>
                </section>
                <section style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <h3 style={{ margin: '0', fontSize: '12px', fontWeight: '800', letterSpacing: '.14em', textTransform: 'uppercase', color: '#a99bc2' }}>
                    {v.T.winHead}
                  </h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '8px' }}>
                    <div style={{ padding: '14px', borderRadius: '16px', background: 'linear-gradient(160deg, rgba(98,212,166,.16), rgba(14,8,24,.6))', border: '1px solid rgba(98,212,166,.35)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#8fe0b8" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 4h6 M12 2v2 M7.5 7h9l-.8 11.5H8.3z M6.5 20.5h11 M12 10.5c1.3 1.3 1.3 3 0 4.5-1.3-1.5-1.3-3.2 0-4.5z" />
                      </svg>
                      <span style={{ fontWeight: '800', fontSize: '14.5px', color: '#a6eedd' }}>
                        {v.T.winVillageT}
                      </span>
                      <span style={{ fontSize: '13px', lineHeight: '1.45', color: '#d4e9e0' }}>
                        {v.T.winVillage}
                      </span>
                    </div>
                    <div style={{ padding: '14px', borderRadius: '16px', background: 'linear-gradient(160deg, rgba(224,71,95,.18), rgba(14,8,24,.6))', border: '1px solid rgba(224,71,95,.4)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ff8a9b" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 3l3.5 5.5L12 7l4.5 1.5L20 3l-.5 9-3.5 5-4 4-4-4-3.5-5z M9 12.5l1.5 1 M15 12.5l-1.5 1" />
                      </svg>
                      <span style={{ fontWeight: '800', fontSize: '14.5px', color: '#ffb3bf' }}>
                        {v.T.winWolvesT}
                      </span>
                      <span style={{ fontSize: '13px', lineHeight: '1.45', color: '#ecd2d6' }}>
                        {v.T.winWolves}
                      </span>
                    </div>
                  </div>
                </section>
                <section style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <h3 style={{ margin: '0', fontSize: '12px', fontWeight: '800', letterSpacing: '.14em', textTransform: 'uppercase', color: '#a99bc2' }}>
                    {v.T.flowHead}
                  </h3>
                  <div style={{ display: 'flex', gap: '12px', padding: '12px', borderRadius: '16px', background: 'rgba(60,34,104,.35)', border: '1px solid rgba(199,168,255,.2)' }}>
                    <span style={{ width: '40px', height: '40px', flex: 'none', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(241,233,210,.12)' }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f1e9d2" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5z" />
                      </svg>
                    </span>
                    <span style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                      <span style={{ fontWeight: '800', fontSize: '14.5px' }}>
                        {v.T.night}
                      </span>
                      <span style={{ fontSize: '13px', lineHeight: '1.5', color: '#d8cfe8' }}>
                        {v.T.nightText}
                      </span>
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: '12px', padding: '12px', borderRadius: '16px', background: 'rgba(160,84,96,.25)', border: '1px solid rgba(255,211,168,.25)' }}>
                    <span style={{ width: '40px', height: '40px', flex: 'none', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(242,166,90,.16)' }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffd3a8" strokeWidth="1.7" strokeLinecap="round">
                        <path d="M12 8a4 4 0 1 0 0 8a4 4 0 1 0 0-8z M12 2v2 M12 20v2 M4.9 4.9l1.4 1.4 M17.7 17.7l1.4 1.4 M2 12h2 M20 12h2 M4.9 19.1l1.4-1.4 M17.7 6.3l1.4-1.4" />
                      </svg>
                    </span>
                    <span style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                      <span style={{ fontWeight: '800', fontSize: '14.5px' }}>
                        {v.T.day}
                      </span>
                      <span style={{ fontSize: '13px', lineHeight: '1.5', color: '#ecdcd8' }}>
                        {v.T.dayText}
                      </span>
                    </span>
                  </div>
                </section>
                {(v.showRoleList) ? (
                  <>
                    <section style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
                        <h3 style={{ margin: '0', fontSize: '12px', fontWeight: '800', letterSpacing: '.14em', textTransform: 'uppercase', color: '#a99bc2' }}>
                          {v.T.rolesHead}
                        </h3>
                        <span style={{ height: '24px', padding: '0 10px', borderRadius: '999px', display: 'flex', alignItems: 'center', fontSize: '12px', fontWeight: '700', color: '#e9dcff', background: 'rgba(167,127,240,.2)' }}>
                          {v.cardsChip}
                        </span>
                      </div>
                      <p style={{ margin: '0', fontSize: '13px', lineHeight: '1.5', color: '#a99bc2' }}>
                        {v.T.rolesSub}
                      </p>
                      {((v.guideRoles) || []).map((g: any, $index: number) => (
                        <React.Fragment key={$index}>
                          <div style={{ display: 'flex', gap: '12px', padding: '12px', borderRadius: '16px', background: `linear-gradient(150deg, ${g.soft}, rgba(14,8,24,.65))`, border: `1px solid ${g.edge}` }}>
                            <span style={{ width: '44px', height: '44px', flex: 'none', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: g.soft, border: `1px solid ${g.edge}` }}>
                              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={g.color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d={g.icon} />
                              </svg>
                            </span>
                            <span style={{ flex: '1', minWidth: '0', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                              <span style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                                <span style={{ fontFamily: v.fD, fontWeight: '700', fontSize: '16px', color: '#f6f1ff' }}>
                                  {g.name}
                                </span>
                                {(g.multi) ? (
                                  <>
                                    <span style={{ height: '20px', padding: '0 7px', borderRadius: '6px', display: 'flex', alignItems: 'center', fontSize: '12px', fontWeight: '800', color: '#f6f1ff', background: 'rgba(255,255,255,.1)' }}>
                                      ×{g.count}
                                    </span>
                                  </>
                                ) : null}
                                <span style={{ height: '20px', padding: '0 8px', borderRadius: '6px', display: 'flex', alignItems: 'center', fontSize: '11px', fontWeight: '800', color: g.teamFg, background: g.teamBg }}>
                                  {g.team}
                                </span>
                              </span>
                              <span style={{ fontSize: '13px', lineHeight: '1.5', color: '#d8cfe8' }}>
                                {g.desc}
                              </span>
                            </span>
                          </div>
                        </React.Fragment>
                      ))}
                    </section>
                  </>
                ) : null}
                <section style={{ display: 'flex', flexDirection: 'column', gap: '10px', padding: '14px', borderRadius: '16px', background: 'rgba(232,211,160,.07)', border: '1px solid rgba(232,211,160,.22)' }}>
                  <h3 style={{ margin: '0', fontSize: '12px', fontWeight: '800', letterSpacing: '.14em', textTransform: 'uppercase', color: '#e8d3a0' }}>
                    {v.T.rulesHead}
                  </h3>
                  {((v.rules) || []).map((r: any, $index: number) => (
                    <React.Fragment key={$index}>
                      <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                        <span style={{ width: '22px', height: '22px', flex: 'none', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '800', color: '#1c140a', background: '#e8d3a0' }}>
                          {r.num}
                        </span>
                        <span style={{ fontSize: '13.5px', lineHeight: '1.5', color: '#efe6d2' }}>
                          {r.text}
                        </span>
                      </div>
                    </React.Fragment>
                  ))}
                </section>
              </div>
              <div style={{ padding: '12px 20px 30px', borderTop: '1px solid rgba(236,230,246,.08)', display: 'flex', gap: '10px' }}>
                <button className="press" onClick={v.openLang} style={{ height: '54px', padding: '0 16px', flex: 'none', borderRadius: '16px', border: '1px solid rgba(199,168,255,.35)', background: 'rgba(255,255,255,.05)', color: '#e9dcff', fontSize: '14px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 3a9 9 0 1 0 0 18a9 9 0 1 0 0-18z M3 12h18 M12 3c2.5 2.7 3.8 5.7 3.8 9s-1.3 6.3-3.8 9c-2.5-2.7-3.8-5.7-3.8-9S9.5 5.7 12 3z" />
                  </svg>
                  {' '}{v.langShort}
                </button>
                <button className="press" onClick={v.closeGuide} style={{ flex: '1', height: '54px', borderRadius: '16px', border: 'none', background: '#e9dcff', color: '#160b28', fontSize: '16px', fontWeight: '700' }}>
                  {v.T.close}
                </button>
              </div>
            </section>
          </>
        ) : null}
        {(v.langOpen) ? (
          <>
            <div className="fade" onClick={v.closeLang} style={{ position: 'absolute', inset: '0', background: 'rgba(5,3,10,.7)', backdropFilter: 'blur(3px)' }} />
            <section className="sheet" aria-label={v.T.langTitle} style={{ position: 'absolute', left: '0', right: '0', bottom: '0', borderRadius: '28px 28px 0 0', background: 'linear-gradient(180deg, #1f1236 0%, #120a20 100%)', borderTop: '1px solid rgba(199,168,255,.32)', boxShadow: '0 -20px 60px rgba(0,0,0,.6)', padding: '10px 20px 30px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <span style={{ alignSelf: 'center', width: '40px', height: '5px', borderRadius: '999px', background: 'rgba(236,230,246,.25)' }} />
              <span style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <h2 style={{ margin: '0', fontFamily: v.fD, fontWeight: '600', fontSize: '22px' }}>
                  {v.T.langTitle}
                </h2>
                <span style={{ fontSize: '13.5px', color: '#a99bc2' }}>
                  {v.T.langSub}
                </span>
              </span>
              <div role="radiogroup" aria-label={v.T.langTitle} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {((v.langs) || []).map((l: any, $index: number) => (
                  <React.Fragment key={$index}>
                    <button className="press" role="radio" aria-checked={l.on} onClick={l.pick} lang={l.code} style={{ height: '56px', padding: '0 16px', borderRadius: '16px', border: `1px solid ${l.border}`, background: l.bg, color: '#ece6f6', display: 'flex', alignItems: 'center', gap: '12px', textAlign: 'left' }}>
                      <span style={{ width: '40px', height: '28px', flex: 'none', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: '800', letterSpacing: '.06em', color: '#e9dcff', background: 'rgba(167,127,240,.18)' }}>
                        {l.tag}
                      </span>
                      <span style={{ flex: '1', display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontSize: '16px', fontWeight: '700', fontFamily: l.font }}>
                          {l.native}
                        </span>
                        <span style={{ fontSize: '12px', color: '#a99bc2' }}>
                          {l.english}
                        </span>
                      </span>
                      {(l.on) ? (
                        <>
                          <span style={{ width: '26px', height: '26px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#e9dcff' }}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#160b28" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M5 12.5l4.5 4.5L19 7.5" />
                            </svg>
                          </span>
                        </>
                      ) : null}
                    </button>
                  </React.Fragment>
                ))}
              </div>
            </section>
          </>
        ) : null}
        {(this.props.offline) ? (
          <div className="offline" role="status" style={{ fontFamily: v.fB }}>
            {v.T.reconnecting}
          </div>
        ) : null}
      </div>
    );
  }
}
