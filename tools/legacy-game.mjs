export const CHEATS_ENABLED = true;
export const VERSION = 45;
export const MEMORY_COOLDOWN_STEPS = 15;
export const SAVE_KEY = 'goodnight-next-stop.run.v8';
export const CARD_RANK_GROWTH = .34;
export const DUAL_STAT_RANK_TAX_PER_LEVEL = 1.5;
export const WEAKPOINT_DAMAGE_PER_LAYER = 4;
export const SPECIALIZATION_UNLOCK_STAGE = 1;
export const MAX_PLAYER_LEVEL = 100;
export const MAX_SPECIALIZATION_POINTS = 60;
export const DISORDER_GOLD_LOSS_PERCENT = 20;
const BATTLE_GOLD_SCALE = 1.2;
const AUTO_LOADOUT_CARD_PRIORITY = { focus: 32 };
export const BLACK_MARKET_RANDOM_CARD_PRICES = [75, 105, 135, 165, 195, 225];
export const BLACK_MARKET_SHOWN_CARD_PRICES = [80, 110, 145, 175, 210, 240];
export const BLACK_MARKET_GEAR_PRICES = [100, 140, 180, 220, 260, 300];
export function reviveCost(stateOrLevel) {
  const level = typeof stateOrLevel === 'number' ? stateOrLevel : stateOrLevel?.level;
  return 60 + Math.max(1, level || 1) * 20;
}
export function disorderGoldLoss(gold) {
  return Math.ceil(Math.max(0, gold || 0) * DISORDER_GOLD_LOSS_PERCENT / 100);
}
export const DIFFICULTIES = {
  relaxed: { name: '舒缓', hint: '适合体验剧情，敌人压力较低，护盾可以完整抵挡伤害。', hp: 1, damage: 1, hpDepth: .018, damageDepth: .012, turnDamage: 0, guardPierce: 0, recovery: 1, levelHeal: 6, reward: 1 },
  standard: { name: '标准', hint: '敌人攻势更明确，久战时伤害会快速提高；16% 伤害穿透护盾。', hp: 1.45, damage: 1.98, hpDepth: .03, damageDepth: .038, turnDamage: .22, guardPierce: .16, recovery: .4, levelHeal: 2, reward: 1.2 },
  challenge: { name: '挑战', hint: '敌人伤害高且久战惩罚更重，25% 伤害穿透护盾，需要手动出牌与装备成长。', hp: 1.7, damage: 2.18, hpDepth: .04, damageDepth: .047, turnDamage: .3, guardPierce: .25, recovery: 0, levelHeal: 0, reward: 1.45 },
};
export const CARDS = {
  slash: { name: '轻声问候', school: '倾听', type: 'attack', cost: 1, damage: 7, icon: 'heart', flavor: '一句问候，是故事愿意开始的地方。' },
  guard: { name: '深呼吸', school: '陪伴', type: 'skill', cost: 1, block: 6, icon: 'wind', flavor: '先让呼吸慢下来。' },
  mark: { name: '认真倾听', school: '倾听', type: 'spell', cost: 1, mark: 3, block: 2, icon: 'target', flavor: '没有被听见的话，会留在梦里。' },
  heavy: { name: '说出真心话', school: '倾听', type: 'attack', cost: 2, damage: 17, icon: 'sparkles', flavor: '真话很重，也足以推开一扇门。' },
  focus: { name: '整理思绪', school: '清醒梦', type: 'skill', cost: 0, energy: 1, exhaust: true, icon: 'sparkles', flavor: '把纷乱的念头一件件放好。' },
  riposte: { name: '我在这里', school: '陪伴', type: 'attack', cost: 1, damage: 5, block: 4, dualStat: true, icon: 'heart', flavor: '回应本身，就能让梦安静一点。' },
  leech: { name: '热可可', school: '料理', type: 'attack', cost: 1, damage: 6, heal: 3, dualStat: true, icon: 'heart', flavor: '杯沿的热气替你说了没关系。' },
  quick: { name: '沿途来信', school: '书信', type: 'attack', cost: 1, damage: 5, draw: 1, icon: 'wind', flavor: '邮戳来自一个还没抵达的地方。' },
  nova: { name: '再次确认', school: '倾听', type: 'attack', cost: 2, damage: 14, hits: 2, icon: 'target', flavor: '重要的话，值得再问一次。' },
  fortify: { name: '安静陪伴', school: '陪伴', type: 'skill', cost: 1, block: 10, icon: 'shield', flavor: '不急着回答，也是一种回答。' },
  echo: { name: '旧日回声', school: '回忆', type: 'spell', cost: 1, mark: 4, markedMarkBonusPct: .5, draw: 1, icon: 'moon', flavor: '记忆会沿着熟悉的声音回来。' },
  mend: { name: '蜂蜜牛奶', school: '料理', type: 'skill', cost: 1, heal: 10, exhaust: true, icon: 'heart', flavor: '甜度刚好，不需要坚强。' },
  risk: { name: '清醒梦', school: '清醒梦', type: 'spell', cost: 0, draw: 2, self: 3, exhaust: true, icon: 'moon', flavor: '知道自己在梦里，也不代表不会害怕。' },
  tea: { name: '晚安花茶', school: '料理', type: 'skill', cost: 1, block: 11, heal: 3, dualStat: true, icon: 'heart', flavor: '花瓣沉底以后，夜也轻了一点。' },
  listen: { name: '慢慢说', school: '倾听', type: 'spell', cost: 1, mark: 5, draw: 1, icon: 'target', flavor: '今晚没有人催你。' },
  postcard: { name: '未寄明信片', school: '书信', type: 'attack', cost: 1, damage: 14, draw: 1, icon: 'wind', flavor: '背面写着一句迟到很久的话。' },
  blanket: { name: '留灯的房间', school: '陪伴', type: 'skill', cost: 2, block: 38, retain: true, icon: 'shield', flavor: '这张房卡不会在天亮前失效。' },
  nightRide: { name: '夜路电台', school: '回忆', type: 'attack', cost: 2, damage: 8, hits: 2, draw: 1, icon: 'moon', flavor: '同一首歌，在两段人生里响起。' },
  kitchenLight: { name: '厨房还亮着', school: '料理', type: 'skill', cost: 1, block: 11, energy: 1, icon: 'flame', flavor: '总有人为晚归的人留一盏灯。' },
  unsent: { name: '没有寄出的信', school: '书信', type: 'attack', cost: 2, damage: 26, retain: true, icon: 'wind', flavor: '它一直留在手里，等待合适的时刻。' },
  photoAlbum: { name: '旧相册', school: '回忆', type: 'spell', cost: 1, mark: 5, draw: 2, exhaust: true, icon: 'moon', flavor: '翻到最后一页时，照片里多了一个人。' },
  morningCall: { name: '明早叫醒我', school: '清醒梦', type: 'attack', cost: 3, damage: 65, exhaust: true, icon: 'sparkles', flavor: '愿意醒来，就是梦最好的结局。' },
  stayAwhile: { name: '再坐一会儿', school: '陪伴', type: 'skill', cost: 2, block: 26, heal: 11, dualStat: true, retain: true, icon: 'shield', flavor: '路还很长，我们不必现在出发。' },
  lucidDoor: { name: '推开梦门', school: '清醒梦', type: 'spell', cost: 0, energy: 2, self: 4, exhaust: true, icon: 'sparkles', flavor: '门后未必安全，但一定通向更深处。' },
  goodnight: { name: '好好睡一觉', school: '料理', type: 'attack', cost: 2, damage: 27, heal: 16, dualStat: true, exhaust: true, icon: 'heart', flavor: '剩下的事，可以交给明天。' },
  steadyTea: { name: '温茶在手', school: '料理', type: 'skill', cost: 1, block: 11, heal: 16, dualStat: true, icon: 'heart', art: 'tea', flavor: '温度不高，却足够陪你走过这一段。' },
  openingNote: { name: '开场白', school: '倾听', type: 'attack', cost: 1, damage: 6, mark: 1, icon: 'target', art: 'slash', flavor: '先开口，故事才有继续的可能。' },
  rainPromise: { name: '雨中约定', school: '书信', type: 'attack', cost: 1, damage: 8, hits: 2, retain: true, icon: 'wind', art: 'postcard', flavor: '被雨打湿的字，反而记得更牢。' },
  sharedUmbrella: { name: '共撑一伞', school: '陪伴', type: 'skill', cost: 1, block: 12, heal: 2, dualStat: true, icon: 'shield', art: 'fortify', flavor: '伞不大，但两个人刚好。' },
  returnedLetter: { name: '回信', school: '书信', type: 'attack', cost: 1, damage: 15, recycle: 1, icon: 'wind', art: 'quick', flavor: '有些话绕了一圈，终于回到手里。' },
  pageMarker: { name: '夹页微光', school: '回忆', type: 'skill', cost: 1, block: 14, nextBlock: 10, icon: 'moon', art: 'photoAlbum', flavor: '合上书以后，微光仍留在那一页。' },
  tideTurn: { name: '潮汐转身', school: '清醒梦', type: 'attack', cost: 1, damage: 15, blockDamage: .65, icon: 'sparkles', art: 'risk', flavor: '守住的每一步，也能成为向前的力量。' },
  warmThermos: { name: '保温杯', school: '料理', type: 'skill', cost: 1, heal: 15, energy: 1, icon: 'heart', art: 'mend', flavor: '拧开杯盖，旅途就短了一点。' },
  exposeTruth: { name: '看清真相', school: '倾听', type: 'spell', cost: 2, mark: 10, markBurst: 5, icon: 'target', art: 'listen', flavor: '真相被说出来时，弱点也无处躲藏。' },
  nightWatch: { name: '守到天明', school: '陪伴', type: 'attack', cost: 2, damage: 36, execute: 1.5, block: 18, dualStat: true, icon: 'shield', art: 'stayAwhile', flavor: '最难熬的时刻，总有人没有离开。' },
  finalPlatform: { name: '末站回响', school: '回忆', type: 'attack', cost: 2, damage: 54, hits: 2, icon: 'moon', art: 'nightRide', flavor: '列车驶过以后，站台仍记得所有名字。' },
  rewriteEnding: { name: '改写结局', school: '清醒梦', type: 'spell', cost: 1, damage: 68, draw: 2, exhaust: true, icon: 'sparkles', art: 'lucidDoor', flavor: '醒来以前，结局仍有一次重写的机会。' },
  lastWarmth: { name: '最后热饮', school: '料理', type: 'skill', cost: 2, heal: 61, block: 41, dualStat: true, cleanse: true, exhaust: true, icon: 'heart', art: 'goodnight', flavor: '喝完这一杯，就一起走到清晨。' },
  silentAnswer: { name: '无声回答', school: '倾听', type: 'attack', cost: 2, damage: 82, consumeMark: 8, icon: 'target', art: 'heavy', flavor: '没有说出口的答案，也足够坚定。' },
  keepTheLight: { name: '灯一直亮', school: '陪伴', type: 'skill', cost: 2, block: 75, nextBlock: 41, retain: true, icon: 'flame', art: 'kitchenLight', flavor: '只要灯还亮着，终点就不会太远。' },
  homeboundMail: { name: '归途来信', school: '书信', type: 'attack', cost: 1, damage: 61, recycle: 2, icon: 'wind', art: 'unsent', flavor: '信里没有地址，因为收信人已经在回家的路上。' },
  doubt: { name: '杂念', school: '失序', type: 'spell', cost: 1, self: 2, exhaust: true, icon: 'moon', art: 'risk', flavor: '越想甩开，越会缠住脚步。' },
};
export const ENEMIES = [
  { name: '不肯告别的园丁', title: '花田梦境 · 未完成的告别', place: '花田终点站', art: 1, hp: 34, pattern: [{ kind: 'attack', value: 6 }, { kind: 'guard', value: 7 }, { kind: 'attack', value: 9 }] },
  { name: '等雨停的人', title: '雨城梦境 · 漫长等待', place: '终年下雨的城', art: 2, hp: 43, pattern: [{ kind: 'attack', value: 5, hits: 2 }, { kind: 'attack', value: 8 }, { kind: 'guard', value: 9 }] },
  { name: '忘记结局的读者', title: '书街梦境 · 遗失的一页', place: '云端旧书街', art: 3, hp: 52, pattern: [{ kind: 'curse', value: 7 }, { kind: 'attack', value: 11 }, { kind: 'guard', value: 10 }] },
  { name: '没有影子的旅客', title: '海岸梦境 · 消失的倒影', place: '没有影子的海岸', art: 4, hp: 64, pattern: [{ kind: 'attack', value: 10 }, { kind: 'guard', value: 12 }, { kind: 'attack', value: 7, hits: 2 }] },
  { name: '收走愿望的摊主', title: '集市梦境 · 交换的代价', place: '午夜星光集市', art: 2, hp: 76, pattern: [{ kind: 'curse', value: 10 }, { kind: 'attack', value: 9, hits: 2 }, { kind: 'guard', value: 15 }] },
  { name: '最后一站的乘客', title: '终点梦境 · 无人认领的行李', place: '被遗忘的终点站', art: 4, hp: 92, pattern: [{ kind: 'attack', value: 14 }, { kind: 'guard', value: 18 }, { kind: 'curse', value: 13 }, { kind: 'attack', value: 10, hits: 2 }] },
];
export const ENCOUNTERS = [
  [
    { name: '催眠发条钟', title: '花田浅梦 · 错过清晨', trait: '延迟敲响', traitText: '先蓄力，再释放一次可以提前防备的重击。', art: 0, hp: 23, pattern: [{ kind: 'charge', value: 8 }] },
    { name: '迷路的旧行李', title: '花田浅梦 · 去处不明', trait: '坚硬外壳', traitText: '交替获得护盾和发动攻击，适合用高伤害破防。', art: 1, hp: 25, pattern: [{ kind: 'guard', value: 6 }, { kind: 'attack', value: 6 }] },
    { name: '折纸候鸟群', title: '花田浅梦 · 逆风迁徙', trait: '成群掠过', traitText: '每次攻击分为两段，会更快消耗你的护盾。', art: 2, hp: 26, pattern: [{ kind: 'attack', value: 3, hits: 2 }, { kind: 'attack', value: 4, hits: 2 }] },
    { name: '被遗忘的雨伞', title: '花田回声 · 等待认领', trait: '掀开遮蔽', traitText: '攻击前驱散一半护盾，不能只靠提前叠盾应对。', art: 3, hp: 28, pattern: [{ kind: 'guard', value: 7 }, { kind: 'dispel', value: 5 }] },
    { name: '走失的花盆', title: '花田回声 · 自己远行', trait: '重新生长', traitText: '攻击后会恢复生命，需要保持进攻压力。', art: 4, hp: 30, pattern: [{ kind: 'attack', value: 6 }, { kind: 'heal', value: 5 }] },
    { name: '提灯夜蛾', title: '花田深梦 · 扑向微光', trait: '迷光粉尘', traitText: '先造成伤害并施加虚弱，再发动两段攻击。', art: 5, hp: 32, pattern: [{ kind: 'curse', value: 4 }, { kind: 'attack', value: 4, hits: 2 }] },
    { name: '余温茶杯', title: '花田精英 · 茶还未凉', trait: '余温回流', traitText: '在攻击、护盾与恢复之间循环，拖延会让它重新站稳。', eliteOnly: true, art: 6, hp: 42, pattern: [{ kind: 'attack', value: 7 }, { kind: 'guard', value: 8 }, { kind: 'heal', value: 3 }] },
    { name: '缠结线团', title: '花田精英 · 解不开的结', trait: '越理越乱', traitText: '使用两段攻击、塞入杂念，并用护盾保护自己。', eliteOnly: true, art: 7, hp: 42, pattern: [{ kind: 'attack', value: 4, hits: 2 }, { kind: 'jam', value: 1 }, { kind: 'guard', value: 7 }] },
  ],
  [
    { name: '漏雨的旧伞', title: '雨城浅梦 · 无人来取', art: 3, hp: 30, pattern: [{ kind: 'attack', value: 6 }, { kind: 'guard', value: 7 }] },
    { name: '倒流的水洼', title: '雨城浅梦 · 时间回潮', art: 9, hp: 32, pattern: [{ kind: 'curse', value: 6 }, { kind: 'attack', value: 7 }] },
    { name: '雨灯夜蛾', title: '雨城浅梦 · 借光避雨', art: 5, hp: 34, pattern: [{ kind: 'attack', value: 4, hits: 2 }, { kind: 'guard', value: 8 }] },
    { name: '踩水闹钟', title: '雨城回声 · 准点迟到', art: 0, hp: 36, pattern: [{ kind: 'attack', value: 8 }, { kind: 'curse', value: 6 }] },
    { name: '湿透的线团', title: '雨城回声 · 越理越乱', art: 7, hp: 38, pattern: [{ kind: 'guard', value: 10 }, { kind: 'attack', value: 8 }] },
    { name: '逆风纸鸟', title: '雨城深梦 · 飞不出云', art: 2, hp: 40, pattern: [{ kind: 'attack', value: 5, hits: 2 }, { kind: 'curse', value: 7 }] },
    { name: '雨夜灯塔', title: '雨城深梦 · 错误航向', art: 11, hp: 43, pattern: [{ kind: 'guard', value: 11 }, { kind: 'attack', value: 10 }] },
    { name: '收潮浪影', title: '雨城深梦 · 漫过门槛', art: 10, hp: 46, pattern: [{ kind: 'curse', value: 8 }, { kind: 'attack', value: 6, hits: 2 }] },
  ],
  [
    { name: '咬字旧书', title: '书街浅梦 · 吞掉结尾', art: 8, hp: 36, pattern: [{ kind: 'attack', value: 7 }, { kind: 'curse', value: 6 }] },
    { name: '折页纸鸟', title: '书街浅梦 · 逃离结局', art: 2, hp: 38, pattern: [{ kind: 'attack', value: 5, hits: 2 }, { kind: 'guard', value: 9 }] },
    { name: '墨水水洼', title: '书街浅梦 · 字迹融化', art: 9, hp: 40, pattern: [{ kind: 'curse', value: 7 }, { kind: 'attack', value: 8 }] },
    { name: '夹页花盆', title: '书街回声 · 纸上生根', art: 4, hp: 43, pattern: [{ kind: 'guard', value: 10 }, { kind: 'attack', value: 9 }] },
    { name: '书签线团', title: '书街回声 · 章节缠绕', art: 7, hp: 45, pattern: [{ kind: 'attack', value: 6, hits: 2 }, { kind: 'guard', value: 10 }] },
    { name: '失眠闹钟', title: '书街深梦 · 通宵阅读', art: 0, hp: 47, pattern: [{ kind: 'curse', value: 8 }, { kind: 'attack', value: 10 }] },
    { name: '月纹句号', title: '书街深梦 · 强行终止', art: 13, hp: 50, pattern: [{ kind: 'guard', value: 12 }, { kind: 'attack', value: 11 }] },
    { name: '禁书打孔机', title: '书街深梦 · 禁止翻页', art: 15, hp: 54, pattern: [{ kind: 'attack', value: 7, hits: 2 }, { kind: 'curse', value: 9 }] },
  ],
  [
    { name: '退潮浪影', title: '海岸浅梦 · 不曾抵达', art: 10, hp: 42, pattern: [{ kind: 'attack', value: 8 }, { kind: 'guard', value: 9 }] },
    { name: '灯塔倒影', title: '海岸浅梦 · 两个方向', art: 11, hp: 44, pattern: [{ kind: 'guard', value: 10 }, { kind: 'attack', value: 9 }] },
    { name: '无底水洼', title: '海岸浅梦 · 倒映深海', art: 9, hp: 46, pattern: [{ kind: 'curse', value: 8 }, { kind: 'attack', value: 9 }] },
    { name: '盐风纸鸟', title: '海岸回声 · 飞向旧岸', art: 2, hp: 49, pattern: [{ kind: 'attack', value: 6, hits: 2 }, { kind: 'guard', value: 11 }] },
    { name: '漂流行李箱', title: '海岸回声 · 无人认领', art: 1, hp: 51, pattern: [{ kind: 'guard', value: 12 }, { kind: 'attack', value: 10 }] },
    { name: '翻折旧雨伞', title: '海岸深梦 · 顶风而行', art: 3, hp: 54, pattern: [{ kind: 'attack', value: 11 }, { kind: 'curse', value: 9 }] },
    { name: '月潮硬币', title: '海岸深梦 · 正反潮汐', art: 13, hp: 57, pattern: [{ kind: 'guard', value: 13 }, { kind: 'attack', value: 7, hits: 2 }] },
    { name: '逆转航海钟', title: '海岸深梦 · 回到原点', art: 14, hp: 61, pattern: [{ kind: 'curse', value: 10 }, { kind: 'attack', value: 12 }] },
  ],
  [
    { name: '空愿望盒', title: '集市浅梦 · 等待交换', art: 12, hp: 48, pattern: [{ kind: 'attack', value: 9 }, { kind: 'guard', value: 11 }] },
    { name: '找零月光', title: '集市浅梦 · 代价不明', art: 13, hp: 51, pattern: [{ kind: 'curse', value: 9 }, { kind: 'attack', value: 10 }] },
    { name: '星票打孔机', title: '集市浅梦 · 只售单程', art: 15, hp: 53, pattern: [{ kind: 'attack', value: 6, hits: 2 }, { kind: 'guard', value: 12 }] },
    { name: '会走的茶杯', title: '集市回声 · 余温标价', art: 6, hp: 56, pattern: [{ kind: 'guard', value: 13 }, { kind: 'attack', value: 11 }] },
    { name: '旧货行李箱', title: '集市回声 · 售出远方', art: 1, hp: 59, pattern: [{ kind: 'attack', value: 12 }, { kind: 'curse', value: 10 }] },
    { name: '讨价旧书', title: '集市深梦 · 每页不同价', art: 8, hp: 62, pattern: [{ kind: 'curse', value: 10 }, { kind: 'guard', value: 14 }] },
    { name: '纽扣线团', title: '集市深梦 · 缝补愿望', art: 7, hp: 66, pattern: [{ kind: 'attack', value: 8, hits: 2 }, { kind: 'guard', value: 15 }] },
    { name: '闭灯夜蛾', title: '集市深梦 · 最后一盏灯', art: 5, hp: 70, pattern: [{ kind: 'curse', value: 11 }, { kind: 'attack', value: 13 }] },
  ],
  [
    { name: '无人认领的行李', title: '终点浅梦 · 标签脱落', art: 1, hp: 56, pattern: [{ kind: 'attack', value: 11 }, { kind: 'guard', value: 12 }] },
    { name: '逆行站台钟', title: '终点浅梦 · 永远差一分钟', art: 14, hp: 59, pattern: [{ kind: 'curse', value: 11 }, { kind: 'attack', value: 12 }] },
    { name: '熄灯检票机', title: '终点浅梦 · 单程车票', art: 15, hp: 62, pattern: [{ kind: 'guard', value: 14 }, { kind: 'attack', value: 8, hits: 2 }] },
    { name: '末班愿望盒', title: '终点回声 · 没有收件人', art: 12, hp: 66, pattern: [{ kind: 'attack', value: 13 }, { kind: 'curse', value: 11 }] },
    { name: '月台灯塔', title: '终点回声 · 照错轨道', art: 11, hp: 70, pattern: [{ kind: 'guard', value: 16 }, { kind: 'attack', value: 13 }] },
    { name: '催站发条钟', title: '终点深梦 · 不再等待', art: 0, hp: 74, pattern: [{ kind: 'attack', value: 9, hits: 2 }, { kind: 'curse', value: 12 }] },
    { name: '末页旧书', title: '终点深梦 · 写满站名', art: 8, hp: 78, pattern: [{ kind: 'curse', value: 12 }, { kind: 'guard', value: 17 }] },
    { name: '离站纸鸟群', title: '终点深梦 · 飞越时刻表', art: 2, hp: 83, pattern: [{ kind: 'attack', value: 10, hits: 2 }, { kind: 'guard', value: 18 }] },
  ],
];
export const CHAPTERS = [
  { name: '花田终点站', subtitle: '料理与疗愈装备', art: 1, weather: '晴 · 18℃', color: '#b8cf7a' },
  { name: '终年下雨的城', subtitle: '护盾与持续效果', art: 2, weather: '雨 · 12℃', color: '#83b8c6' },
  { name: '云端旧书街', subtitle: '书信与抽牌装备', art: 3, weather: '多云 · 15℃', color: '#d6a868' },
  { name: '没有影子的海岸', subtitle: '行动与清醒梦装备', art: 4, weather: '风 · 21℃', color: '#72b7a4' },
  { name: '午夜星光集市', subtitle: '高品质随机词条', art: 2, weather: '夜 · 9℃', color: '#c58ba8' },
  { name: '被遗忘的终点站', subtitle: '传奇与套装底材', art: 4, weather: '未知', color: '#a7a0ca' },
];
export const GUESTS = [
  { name: '小满', room: '01号客房', title: '不肯告别的园丁', wish: '她抱着一盆枯掉一半的绣球上车，想把最后一束花送给迟迟没来的人。', chapters: ['她总在花田里剪同一根枯枝，剪完又重新长出来。', '她想起约好换盆的人不会再来，于是把花束从土里取出来。', '清晨，她把花放在房车窗边，没有写收件人，也没有再回花田。'], gift: '会写字的钢笔' },
  { name: '林夏', room: '02号客房', title: '等雨停的人', wish: '她每隔几分钟就看一次手机，门口还摆着一双没有人穿的雨鞋。', chapters: ['雨声一响，她就以为有人敲门，手机屏幕也一直亮着。', '她承认那把多出来的伞不是为了等人，而是舍不得承认约定结束了。', '雨还在下，她穿上自己的雨鞋，删掉没发出去的消息，推门出去了。'], gift: '守夜风衣' },
  { name: '阿纸', room: '03号客房', title: '忘记结局的读者', wish: '她带来一本少了最后一页的旧书，想找回自己亲手撕掉的结局。', chapters: ['书街上每本书都缺最后一页，她却把碎纸藏在口袋里。', '她终于承认自己怕看的不是结尾，而是那句已经说出口的话。', '她把旧结局贴回去，又添了一页新纸，留在房车书架上。'], gift: '没有日期的房卡' },
  { name: '遥遥', room: '04号客房', title: '没有影子的旅客', wish: '她总先问别人冷不冷，却说不出自己想去哪里，脚边也没有影子。', chapters: ['海岸路灯照出所有人的影子，只有她的脚边空着。', '潮水放回那天的告别，她第一次没有替对方找理由。', '日出时，她对海面说了“不”，第二道影子从水里走回她身边。'], gift: '星光披肩' },
  { name: '七月', room: '05号客房', title: '收走愿望的摊主', wish: '她拎着一串摊位钥匙入住，记得所有客人的愿望，却找不到自己的盒子。', chapters: ['每个抽屉都贴着别人的愿望，只有最底层的木盒没有标价。', '她发现旧盒子的落款是自己，里面装着被她搁置很久的请求。', '她关掉摊位灯，只带走那个没有出售的盒子，终于坐上房车休息。'], gift: '黄昏留声机' },
  { name: '无名旅客', room: '阁楼客房', title: '最后一站的乘客', wish: '阁楼房门自己亮着灯，登记簿最后一页缺了名字，只剩一只旧行李箱。', chapters: ['行李牌被雨水洗白，箱子里却放着前几位客人留下的旧物。', '车票、伞柄、书页、脚印和愿望封条拼出同一个阁楼房号。', '登记簿补回名字后，终点站的灯重新亮起，她终于有了自己的房间。'], gift: '无名旅客的钥匙' },
];
export const MAIN_STORY = [
  {
    guest: '小满', clue: 'pressedTicket', clueName: '夹在花束里的空白车票',
    intro: { eyebrow: '第一夜 · 04:13', title: '剪不完的枯枝', text: '小满抱着一盆已经枯掉一半的绣球上车。她说只是睡不着，手里却一直攥着修枝剪。', quote: '“她说春天一起换盆。春天已经来过两次了。”', action: '替她收起修枝剪' },
    boss: { eyebrow: '花田尽头', title: '最后一束花', text: '花田中央站着另一个小满。她不停给枯枝浇水，每剪掉一根，身后就长出十根。', quote: '“我不是在等她回来。我是在等自己承认，她不会回来了。”', action: '陪她走进花田' },
    ending: { eyebrow: '清晨记录 01', title: '花留在窗边', text: '小满把最后一束花放在窗台，没有写收件人。房车启动时，她第一次没有回头。', quote: '花束底下压着一张空白车票，背面沾着一滴早已干掉的雨。', action: '把车票夹进登记簿' },
  },
  {
    guest: '林夏', clue: 'atticRoomNumber', clueName: '伞柄里的阁楼房号',
    intro: { eyebrow: '第二夜 · 02:46', title: '一直亮着的输入框', text: '林夏每隔几分钟就点亮手机。屏幕没有新消息，门边却整齐摆着两双雨鞋。', quote: '“雨声很像消息提示音。我知道不是，还是会看。”', action: '把林夏的手机调成静音' },
    boss: { eyebrow: '雨城中央', title: '等雨停的人', text: '街道尽头的身影举着两把伞，一把给自己，一把始终留给不会赴约的人。', quote: '“我等的不是一句晚安，是一句‘不是你的错’。”', action: '和她一起撑伞出门' },
    ending: { eyebrow: '清晨记录 02', title: '雨没有停', text: '林夏删掉没有发出的第九十九条消息，穿上自己的雨鞋。她没有等晴天，推门走进雨里。', quote: '归还的旧伞内侧刻着“阁楼客房”，后面还有一个被磨掉一半的房号。', action: '记下伞柄里的房号' },
  },
  {
    guest: '阿纸', clue: 'lastPageLine', clueName: '最后一页的陌生字迹',
    intro: { eyebrow: '第三夜 · 03:21', title: '撕掉的最后一页', text: '阿纸带来一本没有结尾的书。垃圾桶里全是同一句话的改写，每张纸都被揉得很小。', quote: '“如果那天换一种说法，故事是不是就不会结束？”', action: '把碎纸放回桌面' },
    boss: { eyebrow: '书街闭馆后', title: '不能重写的那句话', text: '每家书店都在替她重印结局，只有最旧的一册保留了真实的最后一页。', quote: '“那句话已经说出口了。但我还可以决定，下一页写什么。”', action: '替她翻到最后一页' },
    ending: { eyebrow: '清晨记录 03', title: '下一页仍是空白', text: '阿纸没有涂掉旧结局。她在后面添了一页，把书留在房车书架最容易拿到的位置。', quote: '新页末尾多出一行不是她的字：“请把我的名字留到清晨。”', action: '拓下那行陌生字迹' },
  },
  {
    guest: '遥遥', clue: 'secondFootprint', clueName: '潮水里的第二道脚印',
    intro: { eyebrow: '第四夜 · 01:58', title: '少了一道影子', text: '遥遥下车时，路灯把所有东西都照出影子，只有她脚边空着。她下意识先问别人冷不冷。', quote: '“我没关系。说久了，好像真的就没有关系了。”', action: '问她自己想去哪里' },
    boss: { eyebrow: '海岸退潮时', title: '那一天本来可以说不', text: '海面反复播放同一场告别。每一次，遥遥都替对方找好理由，再把自己的话咽回去。', quote: '“我可以理解她，但我也可以不同意。”', action: '让海面听见她的回答' },
    ending: { eyebrow: '清晨记录 04', title: '影子回到脚边', text: '遥遥在潮线上站了很久，最后只说了一个“不”。日出时，她的影子从海里走回来，与她并肩。', quote: '退潮后的沙滩出现第二道脚印，尺寸与那张空白车票上的泥痕完全相同。', action: '描下两道脚印' },
  },
  {
    guest: '七月', clue: 'unclaimedWish', clueName: '无人认领的愿望封条',
    intro: { eyebrow: '第五夜 · 00:37', title: '没有标价的愿望', text: '七月带着一串摊位钥匙入住。她能准确说出每位客人想要什么，却答不上自己今晚为什么失眠。', quote: '“替别人保管愿望久了，我忘了自己的放在哪个抽屉。”', action: '陪她清点最后一个抽屉' },
    boss: { eyebrow: '集市熄灯前', title: '把自己也摆上货架', text: '最深处的摊位正在叫卖七月自己的时间、耐心和好脾气。每件商品都已经有人预订。', quote: '“这些不是赠品。我的愿望也应该有位置。”', action: '替她合上摊位木窗' },
    ending: { eyebrow: '清晨记录 05', title: '唯一没有出售的盒子', text: '七月关掉集市的灯，只带走一只旧盒子。她在房车门口睡着时，钥匙还握在自己手里。', quote: '盒底贴着一张褪色封条：“希望有人记得我来过。”落款被撕掉了。', action: '收好愿望封条' },
  },
  {
    guest: '无名旅客', clue: 'registeredName', clueName: '补全的旅店登记页',
    intro: { eyebrow: '第六夜 · 时间不明', title: '无人认领的行李', text: '终点站没有列车，只有一只旧行李箱。箱中依次放着枯花、旧伞、缺页的书、海砂和一只愿望盒。', quote: '“所有人都记得我很好。没有人记得，我那晚其实很累。”', action: '把行李搬上房车' },
    boss: { eyebrow: '末班车之后', title: '最后一站的乘客', text: '站台尽头的人没有脸，也没有名字。每盏灯亮起，她就先替别人提起行李，自己却错过一班又一班车。', quote: '“如果我不再有用，还会有人为我留一盏灯吗？”', action: '走到她面前' },
    ending: { eyebrow: '清晨记录 06', title: '名字留到清晨', text: '五件旧物在登记簿上压出同一页轮廓。被雨洗掉的姓名重新显出来：朝安。', quote: '她不是因为有用才被记住。她只是来过、累过，也理应拥有一间亮着灯的房间。', action: '写下“朝安”' },
    endingHidden: { eyebrow: '完整登记记录 · 04:17', title: '欢迎回来，朝安', text: '行李牌与登记簿背面的字迹重合。完整记录浮现：“朝安，阁楼客房，凌晨四点十七分入住。”终点站所有灯沿铁轨依次亮起。', quote: '房车寻找的从来不是终点，而是那个没有被好好送到清晨的人。', action: '点亮阁楼客房' },
    endingFragmented: { eyebrow: '清晨记录 06', title: '先留下一个位置', text: '登记页仍缺少几角，姓名只能辨出一个“安”字。你没有替她猜完，只在阁楼客房门口挂上一块“有人住”的牌子。', quote: '名字可以慢慢找。今晚先让她知道，这里有人等她回来。', action: '为她留一盏灯' },
  },
];
export const MAP_STEPS = 50;
export const CHECKPOINT_STEPS = [10, 20, 30, 40];
export const CHECKPOINTS = {
  10: {
    title: '暖灯休息站',
    text: '第一段夜路走完了。先稳住状态，再决定如何继续。',
    choices: [
      { key: 'rest', icon: 'heart', title: '靠窗睡一会儿', text: '恢复全部生命并继续探索' },
      { key: 'returnHub', icon: 'backpack', title: '返回房车', text: '结束本次探索并恢复全部生命' },
    ],
  },
  20: {
    title: '夜路杂货铺',
    text: '车窗外亮着一间只在深夜营业的小店，后院的灯还为赶路人留着。',
    choices: [
      { key: 'shortRest', icon: 'heart', title: '借用店后的躺椅', text: '恢复全部生命并继续探索' },
      { key: 'returnHub', icon: 'backpack', title: '返回房车', text: '结束本次探索并恢复全部生命' },
    ],
  },
  30: {
    title: '记忆放映室',
    text: '银幕留着一段让人安心的旧时光，也提醒旅人决定是否继续前行。',
    choices: [
      { key: 'cinemaRest', icon: 'heart', title: '看一段温柔的回忆', text: '恢复全部生命并继续探索' },
      { key: 'returnHub', icon: 'backpack', title: '返回房车', text: '结束本次探索并恢复全部生命' },
    ],
  },
  40: {
    title: '终夜整备站',
    text: '终点之前的最后一次停靠。休息充分，再决定是否走完最后一段夜路。',
    choices: [
      { key: 'deepRest', icon: 'heart', title: '睡到月亮西沉', text: '恢复全部生命并继续探索' },
      { key: 'returnHub', icon: 'backpack', title: '返回房车', text: '结束本次探索并恢复全部生命' },
    ],
  },
};
export const SEGMENT_NAMES = ['入梦浅滩', '回声小径', '失序深处', '梦核外环', '终夜核心'];
export const STARTER = ['slash', 'slash', 'slash', 'slash', 'guard', 'guard', 'guard', 'mark', 'heavy', 'focus'];
export const REWARDS = ['riposte', 'leech', 'quick', 'fortify', 'steadyTea', 'openingNote', 'nova', 'tea', 'listen', 'nightRide', 'rainPromise', 'sharedUmbrella', 'echo', 'postcard', 'photoAlbum', 'unsent', 'returnedLetter', 'pageMarker', 'risk', 'kitchenLight', 'stayAwhile', 'lucidDoor', 'tideTurn', 'warmThermos', 'mend', 'blanket', 'morningCall', 'goodnight', 'exposeTruth', 'nightWatch', 'finalPlatform', 'rewriteEnding', 'lastWarmth', 'silentAnswer', 'keepTheLight', 'homeboundMail'];
export const CORE_REWARDS = { uncle: 'mark', gaigai: 'mend', xiaoshuai: 'fortify' };
export const MYSTERY_STATIONS = [
  { type: 'event', label: '沿途事件', weight: 22 },
  { type: 'camp', label: '亮灯休息站', weight: 18 },
  { type: 'memory', label: '整理回忆站', weight: 36 },
  { type: 'loadout', label: '牌组整备站', weight: 6 },
  { type: 'blackMarket', label: '夜路黑市', weight: 8 },
  { type: 'negative', label: '失序路段', weight: 10 },
];
export const SIDE_STORIES = {
  giftBox: {
    name: '没拆封的礼物', chapters: [0, 1], minRow: 5,
    intro: { eyebrow: '夜路插曲', title: '皱丝带礼物盒', text: '座位底下滚出一个皱丝带礼物盒，包装纸完好，盒上没有收件人，只写着“等到灯亮的时候再拆”。', choices: [{ key: 'open', title: '现在拆开礼物盒' }, { key: 'carry', title: '带礼物盒到下一盏灯下' }] },
    branches: {
      open: { log: '你拆开盒子，里面除了糖果，还压着一叠写给夜路旅人的车票。至少今晚不用再猜。', effect: { type: 'healGold', heal: 10, gold: 240 } },
      carry: { log: '你把礼物盒放到副驾驶。丝带晃了一下，又重新安静下来。', promise: { type: 'card', due: 'checkpoint', key: 'mend', rankBonus: 2 } },
    },
    resolve: { title: '皱丝带礼物盒打开了', text: '路标亮起时，皱丝带礼物盒自己松开丝带。里面不是糖果，而是一张写给自己的卡片。' },
  },
  oldFlowerpot: {
    name: '旧花盆寄养处', chapters: [0], minRow: 5,
    intro: { eyebrow: '夜路插曲', title: '等待透明叶的花盆', text: '路边小棚里摆着一只等待长出透明叶的旧花盆。看棚的人说，有些花不是缺水，是缺几段真正被听完的梦。', choices: [{ key: 'tend', title: '带走透明叶花盆' }, { key: 'water', title: '只替花盆浇水' }] },
    branches: {
      tend: { log: '你把一只空花盆搬上车。它像是在等这一路的梦落进去。', promise: { type: 'turnin_cards', afterSteps: 7, count: 3, key: 'mend', rankBonus: 3 } },
      water: { log: '你替旧花盆浇了水，泥土里冒出一点晨光。', effect: { type: 'heal', value: 14 } },
    },
    resolve: { title: '透明叶花盆开花了', text: '带上车的旧花盆终于长出几片透明叶子，像是在等你把这一路听来的梦放进去。' },
    miss: '花盆没有等到足够的梦，只在泥土里留下一点温热。'
  },
  unsentGoodnight: {
    name: '没有发出的晚安', chapters: [1, 2], minRow: 6,
    intro: { eyebrow: '夜路插曲', title: '停在“晚安”的输入框', text: '手机屏幕停在“晚安”输入框。客人说：“不要替我发出去。你只要帮我带着它走一段路就好。”', choices: [{ key: 'carry', title: '带着晚安输入框上路' }, { key: 'darken', title: '把晚安输入框扣下' }] },
    branches: {
      carry: { log: '你没有按下发送，只把那句晚安带进雨声里。', promise: { type: 'card', afterBattles: 2, key: 'returnedLetter', rankBonus: 2 } },
      darken: { log: '屏幕终于暗下去。她没有删除那句话，只是不再盯着它等天亮。', effect: { type: 'cleanseHeal', value: 12 } },
    },
    resolve: { title: '晚安输入框收到回信', text: '那只停在“晚安”的输入框再次亮起。没有头像，没有备注，只回了一句：“我也一直没有睡着。”' },
  },
  borrowedUmbrella: {
    name: '雨夜赊伞', chapters: [1], minRow: 8,
    intro: { eyebrow: '夜路插曲', title: '雨夜赊来的蓝柄旧伞', text: '伞店老板把一把蓝柄旧伞递出门外：“先拿去吧，雨停前记得回来。”', choices: [{ key: 'borrow', title: '接过蓝柄旧伞' }, { key: 'leave', title: '把伞留给别人' }] },
    branches: {
      borrow: { log: '蓝柄旧伞靠在车门边，雨声落上去时变得很轻。', promise: { type: 'shop', afterSteps: 6, shop: 'umbrella' } },
      leave: { log: '你把伞留在门口。不久后，有人从雨里向房车点了点头。', effect: { type: 'buff', key: 'umbrellaBlock', battles: 1, block: 10 } },
    },
    resolve: { title: '蓝柄旧伞回到伞店', text: '雨停时，老板出现在街角。他认出车门边的蓝柄旧伞，又打开身后的木柜。' },
  },
  marginNote: {
    name: '页边批注', chapters: [2], minRow: 6,
    intro: { eyebrow: '夜路插曲', title: '旧书里的铅笔批注', text: '一本旧书留着一行铅笔批注：“如果你这一路听到相似的话，请把它们夹进这里。”', choices: [{ key: 'collect', title: '替铅笔批注收集回声' }, { key: 'close', title: '合上有批注的旧书' }] },
    branches: {
      collect: { log: '旧书合上时，铅笔批注向后让出一行空白。', promise: { type: 'turnin_cards', afterBattles: 2, count: 2, school: '书信', key: 'unsent', rankBonus: 3 } },
      close: { log: '你合上旧书，书脊里的微光夹住了这一页。接下来的两场战斗，它会替你挡住最先袭来的杂音。', effect: { type: 'buff', key: 'marginBookmark', battles: 2, block: 8 } },
    },
    resolve: { title: '铅笔批注多出一行', text: '那本留有铅笔批注的旧书自己翻开。页边的空白还在，像是在等几段同样没说完的话。' },
    miss: '旧书没等到合适的回声，只轻轻合上了书页。'
  },
  libraryCard: {
    name: '闭馆借书证', chapters: [2], minRow: 12,
    intro: { eyebrow: '夜路插曲', title: '姓名被擦掉的借书证', text: '闭馆后的柜台上放着一张空名借书证，姓名栏被擦得很干净。背面写着：“带几本旧书回来，可以换一个新结尾。”', choices: [{ key: 'borrow', title: '收下空名借书证' }, { key: 'return', title: '把借书证放回柜台' }] },
    branches: {
      borrow: { log: '空名借书证夹进登记簿，姓名栏仍然空着。', promise: { type: 'turnin_cards', afterSteps: 8, count: 3, key: 'photoAlbum', rankBonus: 2 } },
      return: { log: '你把借书证放回柜台。管理员没有拿出零钱，只把一枚发亮的书签夹进你的梦册。', effect: { type: 'card', key: 'pageMarker', rankBonus: 1 } },
    },
    resolve: { title: '空名借书证等你归还', text: '闭馆柜台的灯重新亮起。那张空名借书证再次摊开，等你归还几本不再需要的旧书。' },
    miss: '借书证上的姓名栏仍然空着。'
  },
  reflectionLocker: {
    name: '倒影存放柜', chapters: [3], minRow: 6,
    intro: { eyebrow: '夜路插曲', title: '挂着潮湿钥匙的存放柜', text: '海边有一排倒影存放柜，每扇门里都映着不同的自己。最里面那格空着，一把潮湿柜门钥匙挂在门上。', choices: [{ key: 'store', title: '用潮湿钥匙锁住倒影' }, { key: 'take', title: '从柜里取回海光' }] },
    branches: {
      store: { log: '你关上柜门，潮湿柜门钥匙在掌心留下冰凉的水痕。', promise: { type: 'buff', afterSteps: 6, buff: { key: 'tideStrike', battles: 2, firstStrike: 5 } } },
      take: { log: '你取回一束海光，影子短暂地贴近脚边。', effect: { type: 'card', key: 'tideTurn', rankBonus: 1 } },
    },
    resolve: { title: '潮湿柜门钥匙转动了', text: '那把潮湿柜门钥匙自己转动，存放柜随即弹开。里面没有影子，只有一束被潮水洗亮的海光。' },
  },
  bottleLetter: {
    name: '退潮后的瓶中信', chapters: [3], minRow: 14,
    intro: { eyebrow: '夜路插曲', title: '退潮留下的月光玻璃瓶', text: '退潮后，沙滩上留下一个月光玻璃瓶。瓶里没有纸，只有一点像字迹一样游动的月光。', choices: [{ key: 'keep', title: '带着月光玻璃瓶等潮声' }, { key: 'open', title: '现在打开月光玻璃瓶' }] },
    branches: {
      keep: { log: '月光玻璃瓶被放在窗边。每经过一场梦，瓶里的月光就亮一点。', promise: { type: 'gear', afterBattles: 2, bases: ['moonShell', 'lighthouseBadge', 'reflectionShawl'] } },
      open: { log: '你打开瓶子，潮声涌出来，替今晚铺平一小段路。', effect: { type: 'buff', key: 'seaBlock', battles: 2, block: 6 } },
    },
    resolve: { title: '月光玻璃瓶靠岸了', text: '窗边的月光玻璃瓶轻轻一响。瓶中月光停成一行字，又变成一件能带走的旧物。' },
  },
  vendorBox: {
    name: '摊主的盒子', chapters: [4], minRow: 5,
    intro: { eyebrow: '夜路插曲', title: '摊主怕月光的盒子', text: '午夜摊主把一个怕月光的盒子放到房车门口。盒子也不能听见钟声。他说：“如果方便，替我保管到下一段路。”', choices: [{ key: 'keep', title: '保管怕月光的盒子' }, { key: 'decline', title: '把盒子还给摊主' }] },
    branches: {
      keep: { log: '你把怕月光的盒子收进副驾驶下方。里面轻轻响了一下，又安静下来。', promise: { type: 'shop', afterSteps: 8, shop: 'vendor' } },
      decline: { log: '摊主把盒子抱回怀里，仍然递来一袋沉甸甸的星光币。', effect: { type: 'gold', value: 400 } },
    },
    resolve: { title: '摊主来取怕月光的盒子', text: '摊主追上房车。怕月光的盒子一路都没有醒。他向你道谢，并打开一只只卖给守信者的抽屉。' },
  },
  wishPawnshop: {
    name: '愿望典当行', chapters: [4], minRow: 10,
    intro: { eyebrow: '夜路插曲', title: '缺了一角的星光当票', text: '典当行的玻璃柜里没有价签，只有一张缺角的星光当票。老板说：“带几件你不再需要的旧物回来，我替你换一个更响亮的愿望。”', choices: [{ key: 'ticket', title: '收下缺角星光当票' }, { key: 'coin', title: '只换一枚硬币' }] },
    branches: {
      ticket: { log: '缺角星光当票贴在登记簿里，空缺的边角慢慢亮起来。', promise: { type: 'turnin_gear', afterSteps: 8, count: 2, bases: ['wishBox', 'luckyCoin', 'velvetMarketCoat'] } },
      coin: { log: '硬币落进口袋，两面都刻着今晚会顺利。', effect: { type: 'buff', key: 'marketLuck', battles: 2, energy: 1 } },
    },
    resolve: { title: '缺角星光当票重新亮起', text: '典当行的门在路边亮起。老板认出那张缺角星光当票，擦亮玻璃柜，等你把不再需要的旧物放上柜台。' },
    miss: '老板看了看空荡的柜台，把当票推回给你：“愿望也讲究时机。”'
  },
  blankTag: {
    name: '空白行李牌', chapters: [5], minRow: 5, critical: true,
    intro: { eyebrow: '夜路插曲', title: '空白行李牌', text: '一只行李箱停在路边。行李牌上的名字被雨水洗掉了，背面却写着房车的车牌。', choices: [{ key: 'carry', title: '带上行李牌' }, { key: 'return', title: '把它挂回箱子上' }] },
    branches: {
      carry: { log: '空白行李牌夹进登记簿，纸面浮出一角褪色的房号。', promise: { type: 'clue', afterSteps: 5, clue: 'blankTag' } },
      return: { log: '箱子慢慢合上，像是终于等到一个愿意停下来的人。', effect: { type: 'heal', value: 18 } },
    },
    resolve: { title: '空白行李牌显出房号', text: '终点前，那块空白行李牌重新滑出登记簿。一个声音问：“你还记得它是谁的吗？”缺页随即浮现出一角。' },
  },
  rewrittenDreambook: {
    name: '被涂改的梦册', chapters: [2, 3, 4, 5], minRow: 5, critical: true, priority: 'specializationReset',
    intro: { eyebrow: '专精支线', title: '被涂改的梦册', text: '旧书街的修书人递来一本写满又擦净的梦册。纸页不能恢复成最初的样子，却可以重新决定往后要留下什么。', choices: [{ key: 'restore', title: '替梦册重新装订' }, { key: 'leave', title: '保留现在的笔迹' }] },
    branches: {
      restore: { log: '修书人放进一枚空白书签：“只有一次。想清楚以后，再把它夹进梦册。”', effect: { type: 'specializationReset' } },
      leave: { log: '你没有擦掉已经写下的路。修书人把一小袋旅币留在桌边。', effect: { type: 'gold', value: 30 } },
    },
  },
  ledgerBack: {
    name: '登记簿背面', chapters: [5], minRow: 12, critical: true,
    intro: { eyebrow: '夜路插曲', title: '登记簿背面的未干墨迹', text: '房车登记簿翻到最后一页，背面有一行像是刚写下的未干墨迹：“如果我忘了自己，请替我写下一个称呼。”', choices: [{ key: 'write', title: '续写那行未干墨迹' }, { key: 'close', title: '合上登记簿' }] },
    branches: {
      write: { log: '你写下一笔，墨水没有干，像是在等另一个人继续。', promise: { type: 'card', afterBattles: 2, key: 'homeboundMail', rankBonus: 2, clue: 'ledgerBack' } },
      close: { log: '书页安静下来。并不是每个答案都要在今晚写完。', effect: { type: 'cleanseHeal', value: 20 } },
    },
    resolve: { title: '未干墨迹接着往下写', text: '登记簿背面的未干墨迹多出一笔。字迹不是你的，却接着你写的那一行继续往下走。' },
  },
};
export const CRITICAL_SIDE_QUESTS = {
  dreambookReset: {
    storyId: 'rewrittenDreambook', family: 'lantern', target: 3, unlockStage: 1, objective: '击败夜蛾类敌人',
    title: '被涂改的梦册显出新路', text: '第三只夜蛾熄灭后，收集到的灯粉在那本被涂改的梦册上显出一条没有写过的路。修书人履行约定，把一枚空白书签夹进最后一页。',
    claimLabel: '收下空白书签',
    reward: { type: 'specializationReset' },
  },
  blankTagTrail: {
    storyId: 'blankTag', family: 'luggage', target: 2, unlockStage: 5, objective: '击败行李类敌人',
    title: '空白行李牌有了去处', text: '第二件走失的行李安静下来时，两张残缺标签在登记簿上叠成同一个阁楼房号。那块空白行李牌重新回到你手里。',
    claimLabel: '收好空白行李牌',
    reward: { type: 'clue', clue: 'blankTag' },
  },
  ledgerBackTrail: {
    storyId: 'ledgerBack', family: 'timepiece', target: 3, unlockStage: 5, objective: '击败钟表或检票机类敌人', requires: 'blankTagTrail',
    title: '未干墨迹写下名字', text: '第三只失序钟停止倒转，登记簿背面的未干墨迹终于追上现在。陌生字迹接着你的那一笔，把名字继续写完。',
    claimLabel: '读完登记簿背面',
    reward: { type: 'cardClue', key: 'homeboundMail', rankBonus: 2, clue: 'ledgerBack' },
  },
};
const DROPPABLE_CARDS = [...new Set([...REWARDS, ...Object.values(CORE_REWARDS)])];
export const CHARACTERS = {
  uncle: {
    name: '大叔', role: '夜班店长', trait: '认真听你说',
    description: '每回合第一次使用发现弱点的牌后，抽 1 张牌。',
    schools: ['倾听', '书信'], style: '先强化伤害，再连续出牌',
    maxHp: 70, starter: ['slash', 'slash', 'slash', 'guard', 'guard', 'mark', 'mark', 'heavy', 'quick', 'focus'],
  },
  gaigai: {
    name: '该该', role: '随车料理师', trait: '还有一杯热的',
    description: '每张治疗牌每 3 点最终治疗量积攒 1 点暖意，向上取整；暖意可以持续积攒，下一张攻击会全部消耗并追加等量伤害。',
    schools: ['料理', '陪伴'], style: '边恢复，边强化下一次攻击', recommended: true,
    maxHp: 58, starter: ['slash', 'slash', 'slash', 'slash', 'slash', 'guard', 'guard', 'leech', 'mend', 'focus'],
  },
  xiaoshuai: {
    name: '小帅', role: '梦境修补师', trait: '缝好裂缝',
    description: '回合结束后保留 20% 护盾，护盾抵挡伤害时反击 35%。',
    schools: ['陪伴', '清醒梦'], style: '叠加护盾，稳步反击',
    maxHp: 70, starter: ['slash', 'slash', 'slash', 'guard', 'guard', 'guard', 'riposte', 'riposte', 'fortify', 'focus'],
  },
};
const path = (name, summary, color, nodes) => ({ name, summary, color, nodes });
const node = (id, name, maxRank, requires, text, effect) => ({ id, name, maxRank, requires, text, effect });
export const SPECIALIZATIONS = {
  uncle: [
    path('洞察', '积累弱点，在看清真相的一刻集中爆发。', '#d7bd70', [
      node('uInsightGuard', '听见停顿', 20, 0, '每次使用发现弱点的牌时获得 1 点护盾。', { markBlock: 1 }),
      node('uInsightStrike', '顺着话音', 20, 5, '攻击带有弱点的敌人时，伤害提高 1%。', { markedDamagePct: .01 }),
      node('uInsightBurst', '触到心结', 20, 15, '引爆与消耗弱点造成的伤害提高 3%。', { markSpecialPct: .03 }),
      node('uInsightCalm', '留一盏灯', 20, 30, '每回合首次发现弱点时，额外获得 3 点护盾。', { firstMarkBlock: 3 }),
      node('uInsightTruth', '直面真相', 1, 50, '敌人达到 12 层弱点后，下一张攻击会引爆全部弱点。', { insightMastery: true }),
    ]),
    path('书信', '抽牌与取回弃牌，让每封回信接上下一封。', '#79b9cc', [
      node('uLetterDamage', '落笔有声', 20, 0, '书信攻击造成的伤害提高 1%。', { letterDamagePct: .01 }),
      node('uLetterGuard', '折好信纸', 20, 5, '每取回 1 张弃牌，获得 1 点护盾。', { recycleBlock: 1 }),
      node('uLetterReturn', '等到回信', 20, 15, '带有取回效果的牌额外造成 3% 伤害。', { recycleDamagePct: .03 }),
      node('uLetterKeep', '没有寄出', 20, 30, '保留的书信攻击造成的伤害提高 3%。', { retainedLetterDamagePct: .03 }),
      node('uLetterHome', '归途来信', 1, 50, '每回合第一次取回弃牌后，恢复 1 点能量并抽 1 张牌。', { letterMastery: true }),
    ]),
    path('追问', '连续使用同一流派的牌，把回应一步步推深。', '#c88978', [
      node('uFollowDamage', '再问一句', 20, 0, '连续使用同流派牌时，攻击伤害提高 1%。', { chainDamagePct: .01 }),
      node('uFollowGuard', '不打断你', 20, 5, '连续使用同流派牌时，获得的护盾增加 1 点。', { chainBlock: 1 }),
      node('uFollowHeal', '听到最后', 20, 15, '连续使用同流派牌时，治疗增加 1 点。', { chainHealing: 1 }),
      node('uFollowDepth', '层层追问', 20, 30, '连续层数每层使攻击额外提高 1%。', { chainDepthPct: .01 }),
      node('uFollowAnswer', '终于回答', 1, 50, '每回合连续打出的第 3 张同流派牌恢复 1 点能量，攻击额外提高 50%。', { followMastery: true }),
    ]),
  ],
  gaigai: [
    path('暖意', '把每一次照料积攒起来，留给决定胜负的一击。', '#e2a25e', [
      node('gWarmGain', '再添一点甜', 20, 0, '治疗牌额外积攒 1 点暖意。', { warmthGain: 1 }),
      node('gWarmDamage', '杯沿余温', 20, 5, '暖意追加的伤害提高 2%。', { warmthDamagePct: .02 }),
      node('gWarmShield', '捧在手心', 20, 15, '消耗暖意后，获得消耗量 3% 的护盾。', { warmthShieldPct: .03 }),
      node('gWarmKeep', '慢慢喝完', 20, 30, '攻击后保留 2% 未消耗的暖意。', { warmthRetainPct: .02 }),
      node('gWarmForever', '不会冷掉', 1, 50, '攻击只消耗 50% 暖意，且暖意伤害额外提高 25%。', { warmthMastery: true }),
    ]),
    path('热饮', '强化治疗，并把溢出的照料变成可靠防线。', '#8fc39b', [
      node('gDrinkHeal', '刚好入口', 20, 0, '治疗效果提高 1%。', { healingPct: .01 }),
      node('gDrinkGuard', '暖到指尖', 20, 5, '每次使用治疗牌获得 1 点护盾。', { healingBlock: 1 }),
      node('gDrinkOverflow', '盛满杯子', 20, 15, '溢出治疗的 3% 转化为护盾。', { overflowBlockPct: .03 }),
      node('gDrinkReserve', '留给晚归的人', 20, 30, '治疗牌额外提供 1% 最大生命值的下回合护盾。', { healingNextBlockPct: .01 }),
      node('gDrinkMorning', '喝到清晨', 1, 50, '溢出治疗全部转化为护盾；满生命时首次治疗抽 1 张牌。', { drinkMastery: true }),
    ]),
    path('留灯', '让治疗与攻击轮流接力，保持整夜不停的节奏。', '#d7ce72', [
      node('gLightDamage', '灯下开火', 20, 0, '治疗牌后使用攻击牌，伤害提高 1%。', { rhythmDamagePct: .01 }),
      node('gLightGuard', '转身添茶', 20, 5, '攻击牌后使用治疗牌，获得 1 点护盾。', { rhythmBlock: 1 }),
      node('gLightHeal', '轮流守夜', 20, 15, '交替使用攻击与治疗牌时，治疗提高 1%。', { rhythmHealingPct: .01 }),
      node('gLightSpark', '厨房还亮着', 20, 30, '每次形成攻疗交替时，下一张攻击额外造成 1 点伤害。', { rhythmFlatDamage: 1 }),
      node('gLightAllNight', '灯一直亮', 1, 50, '每回合前两次形成攻疗交替时，各恢复 1 点能量。', { rhythmMastery: true }),
    ]),
  ],
  xiaoshuai: [
    path('反击', '守住每一次冲击，让敌人的力量反过来伤到自己。', '#8db8a0', [
      node('xCounterKeep', '缝牢边角', 20, 0, '回合结束时额外保留 1% 护盾。', { retainedBlockPct: .01 }),
      node('xCounterReflect', '顺势回针', 20, 5, '护盾反击比例提高 1%。', { reflectionPct: .01 }),
      node('xCounterMend', '越打越牢', 20, 15, '受到被护盾抵挡的攻击后，获得 1 点下回合护盾。', { counterNextBlock: 1 }),
      node('xCounterEdge', '藏在针脚里', 20, 30, '每次反击额外造成 1 点伤害。', { counterFlatDamage: 1 }),
      node('xCounterStorm', '针脚如雨', 1, 50, '多段攻击逐段触发反击，每回合最多触发 3 次，并使护盾穿透降低 8%。', { counterMastery: true, guardPierceReduction: .08 }),
    ]),
    path('潮汐', '把护盾主动推向敌人，在攻守之间来回转换。', '#68b4bf', [
      node('xTidePower', '潮声推近', 20, 0, '护盾追加伤害比例提高 2%。', { blockDamagePct: .02 }),
      node('xTideGuard', '退潮留痕', 20, 5, '有护盾时使用攻击牌，获得 1 点护盾。', { guardedAttackBlock: 1 }),
      node('xTideStrike', '浪头转身', 20, 15, '有护盾时，攻击额外造成 1 点伤害。', { guardedFlatDamage: 1 }),
      node('xTideReturn', '潮水归岸', 20, 30, '护盾造成追加伤害后，保留其中 1% 到下回合。', { tideNextBlockPct: .01 }),
      node('xTideMoon', '月引潮生', 1, 50, '攻击消耗当前护盾的 30%，追加消耗量 150% 的伤害，并使护盾穿透降低 8%。', { tideMastery: true, guardPierceReduction: .08 }),
    ]),
    path('清醒梦', '承受可控的代价，换取能量、抽牌与低生命爆发。', '#a79ac9', [
      node('xLucidPain', '知道是梦', 20, 0, '清醒梦牌的自伤降低 2%。', { selfDamageReductionPct: .02 }),
      node('xLucidPatch', '及时缝合', 20, 5, '每次受到卡牌自伤后获得 1 点护盾。', { selfDamageBlock: 1 }),
      node('xLucidEdge', '贴近醒来', 20, 15, '生命低于一半时，攻击伤害提高 2%。', { lowHealthDamagePct: .02 }),
      node('xLucidFocus', '看清裂缝', 20, 30, '每回合首次使用自伤牌时：5级抽1张牌，10级再恢复1点能量，15级改为抽2张牌。', { lucidFocusRank: 1 }),
      node('xLucidWake', '醒来以前', 1, 50, '卡牌自伤不会令生命低于 1，并把卡牌基础自伤的 3 倍加入下一次攻击。', { lucidMastery: true }),
    ]),
  ],
};

export function specializationNodeText(talent, rank = 0) {
  if (!talent || typeof talent.text !== 'string') return '';
  if (talent.maxRank === 1 || talent.id === 'xLucidFocus') return talent.text;
  const currentRank = Math.max(1, Math.min(talent.maxRank, Number.isInteger(rank) ? rank : 0));
  return talent.text.replace(/\d+(?:\.\d+)?(?!.*\d)/, value => String(Number(value) * currentRank));
}

export function specializationUnlocked(state) {
  return Boolean(state && ((state.unlocked || 0) >= SPECIALIZATION_UNLOCK_STAGE || (state.stage || 0) >= SPECIALIZATION_UNLOCK_STAGE || (state.clears?.[0] || 0) > 0));
}
export function specializationPointTotal(state) {
  return Math.min(MAX_SPECIALIZATION_POINTS, Math.max(1, state?.level || 1) + Math.max(0, state?.specializationBonusPoints || 0));
}
export function specializationSpent(state, routeIndex = null) {
  const allocations = state?.specializations || {};
  if (routeIndex === null) return Object.values(allocations).reduce((sum, rank) => sum + (Number.isInteger(rank) ? rank : 0), 0);
  return (SPECIALIZATIONS[state?.character]?.[routeIndex]?.nodes || []).reduce((sum, talent) => sum + (allocations[talent.id] || 0), 0);
}
export function specializationAvailablePoints(state) {
  return Math.max(0, specializationPointTotal(state) - specializationSpent(state));
}
export function specializationBonuses(state) {
  const bonuses = {};
  for (const route of SPECIALIZATIONS[state?.character] || []) for (const talent of route.nodes) {
    const rank = state?.specializations?.[talent.id] || 0;
    for (const [key, value] of Object.entries(talent.effect || {})) {
      if (typeof value === 'boolean') bonuses[key] = bonuses[key] || (value && rank > 0);
      else bonuses[key] = (bonuses[key] || 0) + value * rank;
    }
  }
  return bonuses;
}
export function specializationNode(state, nodeId) {
  for (const [routeIndex, route] of (SPECIALIZATIONS[state?.character] || []).entries()) {
    const nodeIndex = route.nodes.findIndex(talent => talent.id === nodeId);
    if (nodeIndex >= 0) return { route, routeIndex, node: route.nodes[nodeIndex], nodeIndex };
  }
  return null;
}
export function canInvestSpecialization(state, allocations, nodeId) {
  if (!specializationUnlocked(state)) return false;
  const found = specializationNode(state, nodeId);
  if (!found) return false;
  const current = allocations?.[nodeId] || 0;
  if (!Number.isInteger(current) || current >= found.node.maxRank) return false;
  const priorSpent = found.route.nodes.slice(0, found.nodeIndex).reduce((sum, talent) => sum + (allocations?.[talent.id] || 0), 0);
  if (priorSpent < found.node.requires) return false;
  const spent = Object.values(allocations || {}).reduce((sum, rank) => sum + (Number.isInteger(rank) ? rank : 0), 0);
  return spent < specializationPointTotal(state);
}
function validSpecializationAllocation(state, allocations) {
  if (!allocations || Array.isArray(allocations)) return false;
  const validIds = new Set((SPECIALIZATIONS[state.character] || []).flatMap(route => route.nodes.map(talent => talent.id)));
  if (Object.keys(allocations).some(id => !validIds.has(id))) return false;
  if (Object.values(allocations).some(rank => !Number.isInteger(rank) || rank < 0)) return false;
  if (Object.values(allocations).reduce((sum, rank) => sum + rank, 0) > specializationPointTotal(state)) return false;
  for (const route of SPECIALIZATIONS[state.character] || []) {
    let priorSpent = 0;
    for (const talent of route.nodes) {
      const rank = allocations[talent.id] || 0;
      if (rank > talent.maxRank || (rank > 0 && priorSpent < talent.requires)) return false;
      priorSpent += rank;
    }
  }
  return true;
}
export const ITEMS = {
  wornBlade: { name: '旧钢笔', slot: 'weapon', rarity: '普通', attack: 1, flavor: '写过许多入住登记，也听过许多故事。' },
  silverBlade: { name: '银边笔记本', slot: 'bag', rarity: '精良', attack: 3, flavor: '每一页都留着不同城市的气味。' },
  crownBlade: { name: '会写字的钢笔', slot: 'weapon', rarity: '史诗', attack: 5, flavor: '有些话，它会替不敢开口的人写下来。' },
  travelCoat: { name: '旅人外套', slot: 'armor', rarity: '普通', block: 1, flavor: '口袋里总能找到一张旧车票。' },
  mossPlate: { name: '苔绿雨衣', slot: 'armor', rarity: '精良', block: 3, flavor: '下再久的雨，也不会让肩膀湿透。' },
  oathPlate: { name: '守夜风衣', slot: 'armor', rarity: '史诗', block: 5, flavor: '适合漫长的夜路，也适合等待。' },
  emberCharm: { name: '温热纽扣', slot: 'charm', rarity: '普通', recovery: 2, flavor: '握在手心时，像刚晒过太阳。' },
  moonCharm: { name: '月相车票', slot: 'charm', rarity: '精良', recovery: 4, flavor: '目的地会随月亮的形状改变。' },
  mistCrown: { name: '没有日期的房卡', slot: 'charm', rarity: '史诗', recovery: 6, flavor: '它能打开一间不存在于白天的客房。' },
  duskBlade: { name: '黄昏留声机', slot: 'decor', rarity: '传说', attack: 7, flavor: '唱针落下时，沿途的晚霞都会回来。' },
  starMantle: { name: '星光披肩', slot: 'scarf', rarity: '传说', block: 7, flavor: '细碎星光藏在每一道针脚里。' },
  namelessSigil: { name: '无名旅客的钥匙', slot: 'charm', rarity: '传说', recovery: 8, flavor: '没有房号，却总能找到该去的门。' },
  morningShears: { name: '晨光花剪', slot: 'weapon', attack: 2, trait: '首次攻击额外造成 2 点伤害', firstStrike: 2, chapter: 0, flavor: '剪去枯枝，也剪开清晨。' },
  gardenLedger: { name: '花田账本', slot: 'bag', attack: 1, recovery: 1, chapter: 0, flavor: '每笔收入旁都画着一朵花。' },
  greenhouseApron: { name: '温室围裙', slot: 'armor', block: 2, chapter: 0, flavor: '沾着泥土，却一直很暖。' },
  dewScarf: { name: '露水围巾', slot: 'scarf', recovery: 2, chapter: 0, flavor: '清晨披上时会闻到青草香。' },
  flowerPostcard: { name: '压花明信片', slot: 'charm', recovery: 2, skill: 'postcard', chapter: 0, flavor: '背面写着一句迟到的问候。' },
  dawnButton: { name: '黎明纽扣', slot: 'decor', block: 1, recovery: 1, chapter: 0, flavor: '比闹钟更早醒来。' },
  rainRadio: { name: '雨声收音机', slot: 'decor', attack: 2, skill: 'nightRide', chapter: 1, flavor: '杂音里藏着远方车站。' },
  puddleCompass: { name: '水洼罗盘', slot: 'weapon', attack: 2, chapter: 1, flavor: '指针总偏向没有伞的人。' },
  blueUmbrella: { name: '深蓝长伞', slot: 'scarf', block: 3, chapter: 1, flavor: '足够为两个人挡雨。' },
  windowCoat: { name: '车窗雨衣', slot: 'armor', block: 2, recovery: 1, chapter: 1, flavor: '雨滴会在衣角变成小灯。' },
  rainTicket: { name: '雨夜车票', slot: 'charm', recovery: 3, chapter: 1, flavor: '字迹被雨洇开，却仍能检票。' },
  thunderPin: { name: '雷云别针', slot: 'decor', attack: 1, block: 1, chapter: 1, flavor: '偶尔发出很轻的雷声。' },
  bookmarkKnife: { name: '书签裁纸刀', slot: 'weapon', attack: 3, chapter: 2, flavor: '只裁开尚未读过的章节。' },
  marginPencil: { name: '页边铅笔', slot: 'bag', attack: 2, skill: 'echo', chapter: 2, flavor: '写下的话会在下一页回应。' },
  readerCardigan: { name: '读者针织衫', slot: 'armor', block: 3, chapter: 2, flavor: '袖口藏着借书卡。' },
  cloudCape: { name: '云页披风', slot: 'scarf', block: 2, recovery: 2, chapter: 2, flavor: '翻动时像一册很轻的书。' },
  lastPage: { name: '最后一页', slot: 'charm', recovery: 3, skill: 'photoAlbum', chapter: 2, flavor: '故事结束后仍留有余温。' },
  libraryKey: { name: '闭馆后的钥匙', slot: 'decor', attack: 2, chapter: 2, flavor: '能打开只在夜里出现的书架。' },
  tideRecorder: { name: '潮汐录音笔', slot: 'decor', attack: 4, chapter: 3, flavor: '播放时，房间会有海风。' },
  shellPen: { name: '贝壳笔', slot: 'weapon', attack: 3, chapter: 3, flavor: '写出的字带一点盐味。' },
  saltWindbreaker: { name: '盐风外套', slot: 'armor', block: 4, chapter: 3, flavor: '经得住很远的海路。' },
  reflectionShawl: { name: '倒影披肩', slot: 'scarf', block: 3, recovery: 1, chapter: 3, flavor: '水面平静时才会显出花纹。' },
  moonShell: { name: '月光海螺', slot: 'charm', recovery: 4, chapter: 3, flavor: '贴近耳边能听见归航声。' },
  lighthouseBadge: { name: '灯塔徽章', slot: 'bag', block: 2, chapter: 3, flavor: '黑夜里总有一角发亮。' },
  wishScale: { name: '愿望刻度尺', slot: 'weapon', attack: 5, chapter: 4, flavor: '衡量愿望，不衡量价钱。' },
  starCoupon: { name: '星光兑换券', slot: 'bag', attack: 4, chapter: 4, flavor: '仅在午夜市场有效。' },
  velvetMarketCoat: { name: '天鹅绒夜市大衣', slot: 'armor', block: 5, chapter: 4, flavor: '口袋多得像一条街。' },
  lanternVest: { name: '灯笼马甲', slot: 'scarf', block: 4, recovery: 2, chapter: 4, flavor: '系好扣子就亮起一盏灯。' },
  wishBox: { name: '未拆封愿望盒', slot: 'decor', recovery: 5, chapter: 4, flavor: '摇一摇，会听到微弱回声。' },
  luckyCoin: { name: '双面幸运币', slot: 'charm', attack: 2, recovery: 2, chapter: 4, flavor: '两面都刻着好运。' },
  platformWhistle: { name: '站台银哨', slot: 'weapon', attack: 6, chapter: 5, flavor: '吹响时，远处会有灯回应。' },
  timetablePen: { name: '时刻表钢笔', slot: 'bag', attack: 5, skill: 'morningCall', chapter: 5, flavor: '永远能写下下一班车。' },
  midnightUniform: { name: '午夜站务服', slot: 'armor', block: 6, chapter: 5, flavor: '在最后一班车后依然整洁。' },
  lastTrainCoat: { name: '末班车大衣', slot: 'armor', block: 5, recovery: 3, chapter: 5, flavor: '衣领里留着旅途的温度。' },
  blankTicket: { name: '空白终点票', slot: 'charm', recovery: 6, chapter: 5, flavor: '目的地由持票人填写。' },
  stationKey: { name: '终点站钥匙', slot: 'decor', attack: 3, block: 3, chapter: 5, flavor: '打开门后就是清晨。' },
};
export const SLOT_LABELS = { weapon: '随身工具', armor: '旅行衣装', bag: '随行收纳', scarf: '保暖配饰', charm: '纪念物', decor: '房车摆件' };
export const AFFIX_LABELS = {
  attack: '伤害', block: '护盾', recovery: '战后恢复', firstStrike: '首次攻击', healing: '治疗强化', skillPower: '技能护盾',
  markedStrike: '洞察追击', recycleGuard: '回信守护', rhythmPower: '交替增幅', warmthPower: '暖意增幅',
  overflowBlock: '溢疗护盾', counterPower: '反击增幅', tidePower: '潮汐增幅', lucidGuard: '清醒守护',
};
export const ITEM_TIERS = [
  { name: '普通底材', minLevel: 1, scale: 1 },
  { name: '进阶底材', minLevel: 21, scale: 2.2 },
  { name: '精英底材', minLevel: 41, scale: 4 },
];
export const SKILL_UNLOCKS = {
  riposte: 0, leech: 0, quick: 0, fortify: 0, mend: 0, openingNote: 0,
  nova: 1, tea: 1, listen: 1, nightRide: 1, rainPromise: 1, sharedUmbrella: 1,
  echo: 2, postcard: 2, photoAlbum: 2, unsent: 2, returnedLetter: 2, pageMarker: 2,
  risk: 3, kitchenLight: 3, stayAwhile: 3, lucidDoor: 3, tideTurn: 3, warmThermos: 3,
  steadyTea: 4, blanket: 4, morningCall: 4, goodnight: 4, exposeTruth: 4, nightWatch: 4,
  finalPlatform: 5, rewriteEnding: 5, lastWarmth: 5, silentAnswer: 5, keepTheLight: 5, homeboundMail: 5,
};
const AFFIXES = [
  { key: 'attack', prefix: '敏锐的', min: 1, max: 3 },
  { key: 'block', prefix: '安稳的', min: 1, max: 3 },
  { key: 'recovery', prefix: '温热的', min: 1, max: 2 },
  { key: 'firstStrike', prefix: '先声的', min: 1, max: 3 },
  { key: 'healing', prefix: '甘甜的', min: 1, max: 2 },
  { key: 'skillPower', prefix: '守护的', min: 1, max: 2 },
  { key: 'markedStrike', prefix: '洞察的', min: 1, max: 2 },
  { key: 'recycleGuard', prefix: '回信的', min: 1, max: 2 },
  { key: 'rhythmPower', prefix: '留灯的', min: 1, max: 2 },
  { key: 'warmthPower', prefix: '余温的', min: 1, max: 2 },
  { key: 'overflowBlock', prefix: '满杯的', min: 1, max: 2 },
  { key: 'counterPower', prefix: '回针的', min: 1, max: 2 },
  { key: 'tidePower', prefix: '潮生的', min: 1, max: 2 },
  { key: 'lucidGuard', prefix: '清醒的', min: 1, max: 2 },
];
const RARITIES = [
  { name: '普通', affixes: 0 },
  { name: '精良', affixes: 2 },
  { name: '稀有', affixes: 3 },
  { name: '传奇', affixes: 4 },
];
export const CHAPTER_LOOT = [
  ['wornBlade', 'emberCharm', 'morningShears', 'gardenLedger', 'greenhouseApron', 'dewScarf', 'flowerPostcard', 'dawnButton'],
  ['silverBlade', 'travelCoat', 'rainRadio', 'puddleCompass', 'blueUmbrella', 'windowCoat', 'rainTicket', 'thunderPin'],
  ['crownBlade', 'mossPlate', 'bookmarkKnife', 'marginPencil', 'readerCardigan', 'cloudCape', 'lastPage', 'libraryKey'],
  ['oathPlate', 'moonCharm', 'tideRecorder', 'shellPen', 'saltWindbreaker', 'reflectionShawl', 'moonShell', 'lighthouseBadge'],
  ['mistCrown', 'duskBlade', 'wishScale', 'starCoupon', 'velvetMarketCoat', 'lanternVest', 'wishBox', 'luckyCoin'],
  ['starMantle', 'namelessSigil', 'platformWhistle', 'timetablePen', 'midnightUniform', 'lastTrainCoat', 'blankTicket', 'stationKey'],
];
// The painted atlas is arranged by visual category, not by drop-pool order.
export const EQUIPMENT_ART = {
  wornBlade: 0,
  silverBlade: 9,
  crownBlade: 16,
  travelCoat: 10,
  mossPlate: 2,
  oathPlate: 34,
  emberCharm: 5,
  moonCharm: 29,
  mistCrown: 38,
  duskBlade: { atlas: 'skill', index: 10 },
  starMantle: 26,
  namelessSigil: 40,
  morningShears: 32,
  gardenLedger: 1,
  greenhouseApron: 2,
  dewScarf: 4,
  flowerPostcard: 6,
  dawnButton: 5,
  rainRadio: 15,
  puddleCompass: 31,
  blueUmbrella: 8,
  windowCoat: 10,
  rainTicket: 14,
  thunderPin: 13,
  bookmarkKnife: 24,
  marginPencil: 16,
  readerCardigan: 18,
  cloudCape: 20,
  lastPage: 22,
  libraryKey: 40,
  tideRecorder: 23,
  shellPen: 24,
  saltWindbreaker: 26,
  reflectionShawl: 28,
  moonShell: 29,
  lighthouseBadge: 31,
  wishScale: 32,
  starCoupon: 38,
  velvetMarketCoat: 34,
  lanternVest: 36,
  wishBox: 35,
  luckyCoin: 37,
  platformWhistle: 39,
  timetablePen: 41,
  midnightUniform: 42,
  lastTrainCoat: 42,
  blankTicket: 46,
  stationKey: 47,
};
export function itemFor(state, id) {
  return state?.inventory?.find(item => item.id === id) || null;
}
export function itemTier(item) {
  const level = Math.max(1, item?.itemLevel || 1);
  return ITEM_TIERS[level >= 41 ? 2 : level >= 21 ? 1 : 0];
}
export function itemBaseStats(item) {
  if (!item || !ITEMS[item.base]) return { attack: 0, block: 0, recovery: 0, firstStrike: 0 };
  const base = ITEMS[item.base];
  const level = Math.max(1, item.itemLevel || 1);
  const tier = itemTier(item);
  const withinTier = (level - tier.minLevel) % 20;
  const rarityScale = item.rarity === '传奇' ? 1.35 : 1;
  const scale = tier.scale * (1 + withinTier * .02) * rarityScale;
  return {
    attack: Math.round((base.attack || 0) * scale),
    block: Math.round((base.block || 0) * scale),
    recovery: Math.round((base.recovery || 0) * Math.sqrt(scale)),
    firstStrike: Math.round((base.firstStrike || 0) * scale),
  };
}
export function itemName(item) {
  if (!item) return '未知物品';
  const prefix = item.skill ? '会做梦的' : item.affixes?.[0]?.prefix;
  return `${prefix ? `${prefix} ` : ''}${ITEMS[item.base].name}`;
}
export function itemStats(item) {
  if (!item) return {};
  const totals = { ...itemBaseStats(item), healing: 0, skillPower: 0, markedStrike: 0, recycleGuard: 0, rhythmPower: 0, warmthPower: 0, overflowBlock: 0, counterPower: 0, tidePower: 0, lucidGuard: 0 };
  for (const affix of item.affixes || []) if (Number.isFinite(totals[affix.key])) totals[affix.key] += affix.value;
  return Object.fromEntries(Object.entries(totals).filter(([, value]) => value > 0));
}
export function itemLines(item) {
  if (!item) return [];
  const base = ITEMS[item.base];
  const lines = Object.entries(itemStats(item)).map(([key, value]) => `${AFFIX_LABELS[key]} +${value}`);
  if (base.trait) lines.push(base.trait);
  if (item.skill) lines.push(`附带技能：${CARDS[item.skill].name} Lv.${item.skillLevel || 1}`);
  return lines;
}
export function itemDetailLines(item) {
  if (!item) return [];
  const base = ITEMS[item.base];
  const descriptions = {
    attack: value => `所有攻击牌每段伤害 +${value}`,
    block: value => `每个战斗回合开始时获得 ${value} 点护盾`,
    recovery: value => `战斗胜利后额外回复 ${value} 点生命`,
    firstStrike: value => `每回合打出的第一张牌若为攻击牌，每段伤害 +${value}`,
    healing: value => `每张治疗牌的基础治疗量 +${value}`,
    skillPower: value => `每张原本能产生护盾的牌，护盾量 +${value}`,
    markedStrike: value => `敌人已有弱点时，每段攻击伤害 +${value}`,
    recycleGuard: value => `每从弃牌堆取回 1 张牌，获得 ${value} 点护盾`,
    rhythmPower: value => `攻击与治疗交替使用：治疗后攻击每段伤害 +${value}；攻击后治疗获得 ${value} 点护盾`,
    warmthPower: value => `每次使用治疗牌，额外积攒 ${value} 点暖意`,
    overflowBlock: value => `将 ${value * 5}% 的溢出治疗转化为护盾`,
    counterPower: value => `护盾抵挡伤害时，反击比例提高 ${value}%`,
    tidePower: value => `按当前护盾追加伤害的比例提高 ${value * 2}%`,
    lucidGuard: value => `使用消耗自身生命的卡牌后，获得 ${value} 点护盾`,
  };
  const lines = Object.entries(itemStats(item)).map(([key, value]) => `${AFFIX_LABELS[key]} +${value}：${descriptions[key]?.(value) || `该属性提高 ${value} 点`}`);
  if (base.trait) lines.push(`特殊效果：${base.trait}`);
  if (item.skill) lines.push(`附带技能：${CARDS[item.skill].name} Lv.${item.skillLevel || 1}`);
  return lines;
}
export function itemScore(item) {
  if (!item) return 0;
  const totals = { ...itemBaseStats(item), healing: 0, skillPower: 0, markedStrike: 0, recycleGuard: 0, rhythmPower: 0, warmthPower: 0, overflowBlock: 0, counterPower: 0, tidePower: 0, lucidGuard: 0 };
  for (const affix of item.affixes || []) if (Number.isFinite(totals[affix.key])) totals[affix.key] += affix.value;
  return totals.attack * 3 + totals.block * 2 + totals.recovery * 2 + totals.firstStrike * 3 + totals.healing * 2 + totals.skillPower * 2
    + (totals.markedStrike + totals.recycleGuard + totals.rhythmPower + totals.warmthPower + totals.overflowBlock + totals.counterPower + totals.tidePower + totals.lucidGuard) * 2
    + (item.skill ? 12 + (item.skillLevel || 1) * 4 : 0);
}

const BUILD_AFFIX_ROUTES = {
  uncle: { markedStrike: 0, recycleGuard: 1, rhythmPower: 2 },
  gaigai: { warmthPower: 0, overflowBlock: 1, rhythmPower: 2 },
  xiaoshuai: { counterPower: 0, tidePower: 1, lucidGuard: 2 },
};
const BUILD_ROUTE_SCHOOLS = {
  uncle: [['倾听'], ['书信'], ['倾听', '书信']],
  gaigai: [['料理'], ['料理', '陪伴'], ['料理', '陪伴']],
  xiaoshuai: [['陪伴'], ['陪伴', '清醒梦'], ['清醒梦']],
};
export function itemBuildFit(state, item) {
  if (!state || !item) return 0;
  const routePoints = (SPECIALIZATIONS[state.character] || []).map((_, index) => specializationSpent(state, index));
  const affixRoutes = BUILD_AFFIX_ROUTES[state.character] || {};
  let fit = 0;
  for (const affix of item.affixes || []) {
    const routeIndex = affixRoutes[affix.key];
    if (Number.isInteger(routeIndex)) fit += affix.value * (4 + routePoints[routeIndex]);
  }
  if (item.skill && CARDS[item.skill]) {
    const school = CARDS[item.skill].school;
    const deckShare = (state.deck || []).filter(key => CARDS[cardBaseKey(key)]?.school === school).length;
    fit += deckShare * 2;
    for (let index = 0; index < routePoints.length; index++) if (BUILD_ROUTE_SCHOOLS[state.character]?.[index]?.includes(school)) fit += 4 + routePoints[index];
    if (CHARACTERS[state.character]?.schools.includes(school)) fit += 6;
  }
  return fit;
}
export function itemAutoEquipScore(state, item) {
  return { power: itemScore(item), fit: itemBuildFit(state, item) };
}
export function salvageValue(item) {
  return [6, 12, 24, 48][Math.max(0, RARITIES.findIndex(rarity => rarity.name === item?.rarity))];
}
export function rerollCost(item, workshopLevel = 0) {
  const base = [12, 24, 42, 72][Math.max(0, RARITIES.findIndex(rarity => rarity.name === item?.rarity))];
  return Math.max(6, Math.ceil(base * (1 - Math.min(3, workshopLevel) * .12)));
}
export function itemUpgradeCost(item) {
  const level = Math.max(1, item?.itemLevel || 1);
  if (level >= 41) return null;
  const rarityScale = [1, 1.15, 1.35, 1.6][Math.max(0, RARITIES.findIndex(rarity => rarity.name === item?.rarity))];
  return Math.ceil((level < 21 ? 120 : 360) * rarityScale);
}
export function facilityCost(level) { return [80, 160, 280][level] ?? null; }
export function ambientEventValues(state) {
  const stage = Math.max(0, Math.min(5, state?.stage || 0));
  const maxHp = Math.max(1, state?.maxHp || 1);
  return {
    teaHeal: Math.max(12 + stage * 6, Math.round(maxHp * (.17 + stage * .015))),
    photoHpCost: Math.max(5 + stage * 2, Math.round(maxHp * (.07 + stage * .005))),
    photoGold: 22 + stage * 10,
    campHeal: Math.max(18 + stage * 9, Math.round(maxHp * (.25 + stage * .025))),
    pillowCost: 30 + stage * 10,
    pillowBlock: [2, 3, 4, 6, 7, 9][stage],
    pillowBattles: 3,
  };
}
export function commissionStatus(s, key) {
  const claim = s.commissionClaims?.[key] || 0;
  const definitions = {
    battles: { value: s.victories, target: (claim + 1) * 12, reward: 100 + claim * 20 },
    steps: { value: s.stepsTraveled, target: (claim + 1) * 50, reward: 120 + claim * 20 },
    stories: { value: s.clears.reduce((sum, count) => sum + count, 0), target: (claim + 1) * 3, reward: 160 + claim * 30 },
  };
  return definitions[key] || null;
}
function rollAffixes(s, count, itemLevel = 1) {
  const affixes = [];
  const pool = shuffle(s, AFFIXES);
  const tier = Math.min(6, 1 + Math.floor((Math.max(1, itemLevel) - 1) / 10));
  for (let i = 0; i < count && i < pool.length; i++) {
    const definition = pool[i];
    const rolled = definition.min + Math.floor(random(s) * (definition.max - definition.min + 1));
    const value = rolled * tier;
    affixes.push({ key: definition.key, value, tier, prefix: definition.prefix });
  }
  return affixes;
}
function itemLevelFor(s) {
  const depth = Math.max(0, s.mapRow || 0);
  const bonus = (s.elite ? 2 : 0) + (s.bossFight ? 4 : 0);
  return Math.min(60, Math.max(1, s.stage * 10 + 1 + Math.floor(depth / 5) + Math.floor(random(s) * 3) + bonus));
}
export function equipmentSkillDropScale(stage, boosted = false) {
  if (boosted) return 1;
  return [.15, .3, .45, .6, .8, 1][Math.max(0, Math.min(5, stage || 0))];
}
export function equipmentRarityChances(s, boosted = false) {
  const stageBonus = Math.max(0, Math.min(5, s?.stage || 0)) * .015;
  const encounterBonus = s?.bossFight ? .16 : s?.elite ? .1 : boosted ? .16 : 0;
  const offset = stageBonus + encounterBonus;
  const cumulative = threshold => Math.max(0, Math.min(1, threshold - offset));
  const normal = cumulative(.52);
  const fine = cumulative(.88) - normal;
  const rare = cumulative(1.06) - normal - fine;
  return { normal, fine, rare, legendary: 1 - normal - fine - rare };
}
export function equipmentRandomSkillChance(rarity) {
  return rarity === '传奇' ? .6 : rarity === '稀有' ? .2 : 0;
}
export function equipmentInnateSkillChance(s, boosted = false) {
  const baseChance = equipmentSkillDropScale(s?.stage, false);
  if (s?.bossFight) return Math.min(1, baseChance + .25);
  if (s?.elite) return Math.min(1, baseChance + .15);
  return boosted ? 1 : baseChance;
}
function rollItem(s, base, boosted = false, minimumRarity = '普通') {
  const itemLevel = itemLevelFor(s);
  const qualityRoll = random(s);
  const chances = equipmentRarityChances(s, boosted);
  const rolledRarityIndex = qualityRoll < chances.normal ? 0
    : qualityRoll < chances.normal + chances.fine ? 1
      : qualityRoll < chances.normal + chances.fine + chances.rare ? 2 : 3;
  const minimumRarityIndex = Math.max(0, RARITIES.findIndex(candidate => candidate.name === minimumRarity));
  const rarityIndex = Math.max(rolledRarityIndex, minimumRarityIndex);
  const rarity = RARITIES[rarityIndex];
  const affixes = rollAffixes(s, rarity.affixes, itemLevel);
  const skillChance = equipmentRandomSkillChance(rarity.name);
  const unlockedSkills = REWARDS.filter(key => (SKILL_UNLOCKS[key] ?? 0) <= s.stage);
  const preferred = unlockedSkills.filter(key => CHARACTERS[s.character]?.schools.includes(CARDS[key].school));
  const skillPool = preferred.length && random(s) < .7 ? preferred : unlockedSkills;
  const innateSkill = ITEMS[base].skill;
  const skill = innateSkill
    ? (random(s) < equipmentInnateSkillChance(s, boosted) ? innateSkill : null)
    : (random(s) < skillChance * equipmentSkillDropScale(s.stage, boosted) ? skillPool[Math.floor(random(s) * skillPool.length)] : null);
  const skillLevel = skill ? Math.min(10, 1 + Math.floor((itemLevel - 1) / 12) + (rarityIndex >= 2 ? 1 : 0)) : 0;
  return { id: `gear-${s.nextItemId++}`, base, itemLevel, rarity: rarity.name, affixes, skill, skillLevel };
}
function rollBlackMarketItem(s) {
  const basePool = CHAPTER_LOOT[s.stage] || CHAPTER_LOOT[0];
  const base = basePool[Math.floor(random(s) * basePool.length)];
  const depth = Math.max(0, s.mapRow || 0);
  const itemLevel = Math.min(60, Math.max(1, s.stage * 10 + 5 + Math.floor(depth / 5) + Math.floor(random(s) * 3)));
  const rarity = random(s) < .15 ? '传奇' : '稀有';
  const rarityIndex = rarity === '传奇' ? 3 : 2;
  const affixes = rollAffixes(s, RARITIES[rarityIndex].affixes, itemLevel);
  const unlockedSkills = REWARDS.filter(key => (SKILL_UNLOCKS[key] ?? 0) <= s.stage);
  const preferred = unlockedSkills.filter(key => CHARACTERS[s.character]?.schools.includes(CARDS[key].school));
  const skillPool = preferred.length && random(s) < .7 ? preferred : unlockedSkills;
  const innateSkill = ITEMS[base].skill;
  const skill = innateSkill
    ? (random(s) < equipmentSkillDropScale(s.stage, false) ? innateSkill : null)
    : (random(s) < equipmentRandomSkillChance(rarity) ? skillPool[Math.floor(random(s) * skillPool.length)] : null);
  const skillLevel = skill ? Math.min(10, 1 + Math.floor((itemLevel - 1) / 12) + 1) : 0;
  return { id: `gear-${s.nextItemId++}`, base, itemLevel, rarity, affixes, skill, skillLevel };
}
export function blackMarketGearPrice(stage, item) {
  const base = BLACK_MARKET_GEAR_PRICES[Math.max(0, Math.min(5, stage || 0))];
  const rarityScale = item?.rarity === '传奇' ? 1.5 : 1;
  const skillScale = item?.skill ? 1.25 : 1;
  return Math.round(base * rarityScale * skillScale);
}
export function blackMarketCardRanks(mapRow = 0) {
  const step = Math.max(1, Math.min(MAP_STEPS, (Number.isInteger(mapRow) ? mapRow : 0) + 1));
  if (step <= 20) return { shown: 2, random: 3 };
  if (step <= 40) return { shown: 3, random: 4 };
  return { shown: 4, random: 5 };
}
export function blackMarketCardPrice(stage, rank, kind = 'card') {
  const chapter = Math.max(0, Math.min(5, stage || 0));
  const randomCard = kind === 'randomCard';
  const basePrice = (randomCard ? BLACK_MARKET_RANDOM_CARD_PRICES : BLACK_MARKET_SHOWN_CARD_PRICES)[chapter];
  const baseRank = randomCard ? 3 : 2;
  const rankValue = 1 + CARD_RANK_GROWTH * (Math.max(1, Math.min(10, rank || 1)) - 1);
  const baseValue = 1 + CARD_RANK_GROWTH * (baseRank - 1);
  return Math.max(5, Math.round((basePrice * rankValue / baseValue) / 5) * 5);
}
function buildBlackMarketOffers(s) {
  const stage = Math.max(0, Math.min(5, s.stage || 0));
  const pool = shuffle(s, REWARDS.filter(key => (SKILL_UNLOCKS[key] ?? 0) === stage));
  const ranks = blackMarketCardRanks(s.mapRow);
  const randomCard = pool[0] || REWARDS[0];
  const shownCards = Array.from({ length: 3 }, (_, index) => pool[index + 1] || pool[index % Math.max(1, pool.length)] || REWARDS[0]);
  const item = rollBlackMarketItem(s);
  return [
    { id: 'random-card', kind: 'randomCard', key: rankedCardKey(randomCard, ranks.random), cost: blackMarketCardPrice(stage, ranks.random, 'randomCard'), label: '封蜡的高阶回忆' },
    ...shownCards.map((shownCard, index) => {
      const key = rankedCardKey(shownCard, ranks.shown);
      return { id: `shown-card-${index + 1}`, kind: 'card', key, cost: blackMarketCardPrice(stage, ranks.shown, 'card'), label: card(key).name };
    }),
    { id: 'gear', kind: 'gear', item, cost: blackMarketGearPrice(stage, item), label: itemName(item) },
  ];
}
export function equipmentDropCount(s) {
  const roll = random(s);
  if (s?.bossFight) return roll < .6 ? 3 : 2;
  if (s?.elite) return roll < .32 ? 1 : roll < .88 ? 2 : 3;
  return roll < .4 ? 0 : roll < .85 ? 1 : roll < .97 ? 2 : 3;
}
function storyItem(s, stage) {
  const base = CHAPTER_LOOT[stage][7];
  const itemLevel = Math.min(60, (stage + 1) * 10);
  return { id: `gear-${s.nextItemId++}`, base, itemLevel, rarity: '传奇', affixes: rollAffixes(s, 4, itemLevel), skill: REWARDS[(stage * 3 + s.clears[stage]) % REWARDS.length], skillLevel: Math.min(10, stage + 3) };
}
export function buildChapterMap(chapter = 0, mapSeed = chapter + 1) {
  const nodes = [];
  let routeSeed = (mapSeed ^ ((chapter + 1) * 0x9e3779b9)) >>> 0;
  const routeRandom = () => {
    routeSeed = (routeSeed + 0x6d2b79f5) >>> 0;
    let value = routeSeed;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
  const types = ['battle', 'battle', 'battle', 'mystery', 'mystery', 'mystery', 'elite'];
  for (let row = 0; row < MAP_STEPS - 1; row++) {
    if (CHECKPOINT_STEPS.includes(row + 1)) {
      nodes.push({ id: `c${chapter}r${row}checkpoint`, row, x: 50, type: 'checkpoint', links: [] });
      continue;
    }
    const count = row === 0 ? 3 : routeRandom() < .42 ? 2 : 3;
    const anchors = count === 2 ? [31, 69] : [20, 50, 80];
    for (let index = 0; index < count; index++) {
      const jitter = Math.round((routeRandom() - .5) * (count === 2 ? 18 : 12));
      const type = row === 0 || CHECKPOINT_STEPS.includes(row) ? 'battle' : types[Math.floor(routeRandom() * types.length)];
      nodes.push({ id: `c${chapter}r${row}n${index}`, row, x: Math.max(12, Math.min(88, anchors[index] + jitter)), type, links: [] });
    }
  }
  nodes.push({ id: `c${chapter}boss`, row: MAP_STEPS - 1, x: 50, type: 'boss', links: [] });
  for (let row = 0; row < MAP_STEPS - 1; row++) {
    const current = nodes.filter(item => item.row === row);
    const next = nodes.filter(item => item.row === row + 1);
    for (const node of current) {
      const ranked = next.map(item => ({ id: item.id, distance: Math.abs(item.x - node.x) + routeRandom() * 22 })).sort((a, b) => a.distance - b.distance);
      const linkCount = row === MAP_STEPS - 2 ? 1 : Math.min(next.length, routeRandom() < .48 ? 1 : 2);
      node.links = ranked.slice(0, linkCount).map(item => item.id);
    }
    for (const target of next) {
      if (current.some(node => node.links.includes(target.id))) continue;
      const nearest = [...current].sort((a, b) => Math.abs(a.x - target.x) - Math.abs(b.x - target.x))[0];
      nearest.links.push(target.id);
    }
  }
  return nodes;
}

const magicHouseCooldownKey = (s, nodeId) => `${s.mapSeed}:${nodeId}`;
export function magicHouseCooldownRemaining(s, nodeId) {
  if (!nodeId || !s?.magicHouseCooldowns) return 0;
  return Math.max(0, (s.magicHouseCooldowns[magicHouseCooldownKey(s, nodeId)] || 0) - (s.stepsTraveled || 0));
}
export const MAP_NODES = buildChapterMap(0);
export function chapterMap(chapter, mapSeed) { return buildChapterMap(chapter, mapSeed); }
export function cardRank(key) {
  const normalized = String(key || '').replace('~gear', '');
  const match = normalized.match(/\+(\d*)$/);
  if (!match) return 1;
  return match[1] ? Math.max(2, Math.min(10, Number(match[1]))) : 2;
}
export function cardBaseKey(key) { return String(key || '').replace('~gear', '').replace(/\+\d*$/, ''); }
const CARD_TYPE_ORDER = { attack: 0, spell: 1, skill: 2 };
export function compareCardKeys(left, right) {
  const a = card(left), b = card(right);
  return (CARD_TYPE_ORDER[a.type] ?? 9) - (CARD_TYPE_ORDER[b.type] ?? 9)
    || a.baseKey.localeCompare(b.baseKey, 'zh-CN')
    || b.rank - a.rank;
}
export function rankedCardKey(key, rank, equipmentGranted = String(key || '').endsWith('~gear')) {
  const baseKey = cardBaseKey(key);
  const safeRank = Math.max(1, Math.min(10, rank || 1));
  return `${baseKey}${safeRank > 1 ? `+${safeRank}` : ''}${equipmentGranted ? '~gear' : ''}`;
}
export function upgradeCardKey(key, amount = 1) { return rankedCardKey(key, cardRank(key) + amount); }
export function skillRewardRank(s, key) {
  const currentChapter = Math.max(0, Math.min(5, s?.stage || 0));
  const originChapter = Math.max(0, Math.min(currentChapter, SKILL_UNLOCKS[cardBaseKey(key)] ?? 0));
  const encounterBonus = s?.bossFight ? 2 : s?.elite ? 1 : 0;
  return Math.min(10, 1 + (currentChapter - originChapter) * 2 + encounterBonus);
}
function applyDualStatRankTax(c, rank) {
  const fields = ['damage', 'block', 'heal'].filter(field => c[field]);
  const total = fields.reduce((sum, field) => sum + c[field], 0);
  const tax = Math.min(Math.round((rank - 1) * DUAL_STAT_RANK_TAX_PER_LEVEL), total - fields.length);
  const target = total - tax;
  const shares = fields.map(field => ({ field, raw: c[field] * target / total }));
  let assigned = shares.reduce((sum, share) => sum + Math.max(1, Math.floor(share.raw)), 0);
  shares.sort((a, b) => (b.raw - Math.floor(b.raw)) - (a.raw - Math.floor(a.raw)));
  for (let index = 0; assigned < target; index++, assigned++) shares[index % shares.length].raw += 1;
  for (const share of shares) c[share.field] = Math.max(1, Math.floor(share.raw));
}
export function card(key) {
  const equipmentGranted = key.endsWith('~gear');
  const rank = cardRank(key);
  const upgraded = rank > 1;
  const baseKey = cardBaseKey(key);
  const base = CARDS[baseKey];
  if (!base) throw new Error('Unknown card');
  const c = { ...base, key, baseKey, rank, upgraded, equipmentGranted };
  if (equipmentGranted) c.cost = 0;
  if (rank > 1) {
    const multiplier = 1 + (rank - 1) * CARD_RANK_GROWTH;
    c.name += ` +${rank}`;
    if (c.damage) c.damage = Math.round(c.damage * multiplier);
    if (c.block) c.block = Math.round(c.block * multiplier);
    if (c.heal) c.heal = Math.round(c.heal * multiplier);
    if (c.nextBlock) c.nextBlock = Math.round(c.nextBlock * multiplier);
    if (c.mark) c.mark = Math.round(c.mark * multiplier);
    if (c.dualStat) applyDualStatRankTax(c, rank);
    if (c.energy && rank >= 8) c.energy += 1;
    if (c.draw && rank >= 6) c.draw += 1;
    if (c.self) c.self = Math.max(1, c.self - Math.floor(rank / 4));
  }
  if (baseKey === 'openingNote') c.mark = 1;
  return c;
}
export function description(key) {
  const c = card(key), parts = [];
  if (c.damage) parts.push(`造成 ${c.damage}${c.hits ? ` × ${c.hits}` : ''} 点伤害`);
  if (c.block) parts.push(`获得 ${c.block} 点护盾`);
  if (c.mark) parts.push(`发现 ${c.mark} 层弱点`);
  if (c.markedMarkBonusPct) parts.push(`目标原本已有弱点时，本次发现的弱点增加 ${Math.round(c.markedMarkBonusPct * 100)}%`);
  if (c.heal) parts.push(`回复 ${c.heal} 点生命`);
  if (c.energy) parts.push(`获得 ${c.energy} 点能量`);
  if (c.self) parts.push(`消耗 ${c.self} 点生命`);
  if (c.draw) parts.push(`抽 ${c.draw} 张牌`);
  if (c.nextBlock) parts.push(`下回合获得 ${c.nextBlock} 点护盾`);
  if (c.recycle) parts.push(`从弃牌堆取回 ${c.recycle} 张牌`);
  if (c.blockDamage) parts.push(`追加当前护盾 ${Math.round(c.blockDamage * 100)}% 的伤害`);
  if (c.markBurst) parts.push(`立即按使用前已有的每层弱点造成 ${c.markBurst} 点伤害，且不消耗弱点`);
  if (c.consumeMark) parts.push(`每层弱点额外造成 ${c.consumeMark} 点伤害并全部消耗`);
  if (c.execute) parts.push(`敌人半血以下时伤害提高 ${Math.round((c.execute - 1) * 100)}%`);
  if (c.cleanse) parts.push('解除治疗压制与动摇');
  if (c.retain) parts.push('回合结束时仍留在手牌');
  if (c.exhaust) parts.push('打出后移出本场战斗');
  return parts;
}
function random(s) {
  s.seed = (Math.imul(s.seed, 1664525) + 1013904223) >>> 0;
  return s.seed / 4294967296;
}
function shuffle(s, items) {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random(s) * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
function log(s, text) {
  s.log = [text, ...s.log].slice(0, 24);
  if (Array.isArray(s.battleLog) && ['combat', 'reward', 'won', 'lost'].includes(s.phase)) {
    s.battleLog = [...s.battleLog, text].slice(-160);
  }
}
function logBattleStatus(s) {
  const foe = enemyFor(s);
  const playerGuard = s.block > 0 ? ` · 护盾 ${s.block}` : '';
  const warmth = s.character === 'gaigai' && s.warmth > 0 ? ` · 暖意 ${s.warmth}` : '';
  const enemyGuard = s.enemy.block > 0 ? ` · 护盾 ${s.enemy.block}` : '';
  log(s, `状态：你 ${s.hp}/${s.maxHp} 生命${playerGuard}${warmth}｜${foe.name} ${s.enemy.hp}/${s.enemy.maxHp} 生命${enemyGuard}`);
}
function draw(s, count) {
  for (let i = 0; i < count && s.hand.length < 9; i++) {
    if (!s.draw.length && s.discard.length) {
      s.draw = shuffle(s, s.discard); s.discard = [];
      log(s, '弃牌洗回抽牌堆。');
    }
    if (!s.draw.length) break;
    s.hand.push(s.draw.pop());
  }
}
const CHAPTER_HP_SCALES = [1, 1.25, 1.6, 2.05, 2.65, 3.4];
const NORMAL_CHAPTER_HP_BOUNDARY_SCALES = [1, 1.2, 1.45, 1.35, 1.35, 1.4];
const NORMAL_CHAPTER_DAMAGE_BOUNDARY_SCALES = [1, 1.2, 1.25, 1.28, 1.32, 1.36];
const ELITE_CHAPTER_HP_BOUNDARY_SCALES = [1, 1.1, 1.35, 1.35, 1.4, 1.45];
const ELITE_CHAPTER_DAMAGE_BOUNDARY_SCALES = [1, 1.08, 1.12, 1.16, 1.2, 1.24];
const MID_LATE_TURN_DAMAGE_BONUS = [0, 0, .02, .04, .06, .07];
const OFFENSIVE_INTENTS = new Set(['attack', 'curse', 'dispel', 'charge']);
const peakBasePressure = enemy => Math.max(...enemy.pattern.map(move => OFFENSIVE_INTENTS.has(move.kind) ? move.value * (move.hits || 1) : 0), 1);
const BOSS_HP_SCALES = [1.65, 1.9, 2.35, 2.8, 5.3, 7.7];
const bossHpScale = stage => BOSS_HP_SCALES[Math.max(0, Math.min(BOSS_HP_SCALES.length - 1, stage || 0))];
const rawInitialDamageMultiplier = (s, difficulty) => {
  const depth = Math.max(0, s.mapRow || 0);
  const elitePressure = s.elite ? (s.stage === 0 ? .22 : .12) : 0;
  return (1 + s.stage * .08 + depth * difficulty.damageDepth + elitePressure + (s.bossFight ? .22 : 0)) * difficulty.damage;
};
export function enemyInitialDamageMultiplier(s) {
  const difficulty = DIFFICULTIES[s.difficulty] || DIFFICULTIES.standard;
  const current = rawInitialDamageMultiplier(s, difficulty);
  if (s.bossFight || s.stage <= 0) return current;
  const previousStage = s.stage - 1;
  const currentEnemy = enemyFor(s);
  const benchmarkPressure = s.elite
    ? enemyInitialDamageMultiplier({ ...s, stage: previousStage, mapRow: MAP_STEPS - 1, foe: 0, elite: false, bossFight: true }) * peakBasePressure(ENEMIES[previousStage])
    : Math.max(...ENCOUNTERS[previousStage]
      .map((enemy, foe) => ({ enemy, foe }))
      .filter(({ enemy }) => !enemy.eliteOnly)
      .map(({ enemy, foe }) => enemyInitialDamageMultiplier({ ...s, stage: previousStage, mapRow: MAP_STEPS - 1, foe, elite: false, bossFight: false }) * peakBasePressure(enemy)));
  const boundaryFactor = s.elite
    ? ELITE_CHAPTER_DAMAGE_BOUNDARY_SCALES[s.stage]
    : NORMAL_CHAPTER_DAMAGE_BOUNDARY_SCALES[s.stage];
  const boundary = benchmarkPressure * boundaryFactor / peakBasePressure(currentEnemy);
  return Math.max(current, boundary);
}
export function intent(s) {
  const enemy = enemyFor(s);
  const base = enemy.pattern[(s.turn - 1) % enemy.pattern.length];
  const difficulty = DIFFICULTIES[s.difficulty] || DIFFICULTIES.standard;
  const initialMultiplier = enemyInitialDamageMultiplier(s);
  const turnGrowth = difficulty.turnDamage + MID_LATE_TURN_DAMAGE_BONUS[s.stage];
  const multiplier = initialMultiplier + Math.max(0, s.turn - 1) * turnGrowth * difficulty.damage;
  const offensive = ['attack', 'curse', 'dispel', 'charge'].includes(base.kind);
  const defensive = ['guard', 'heal'].includes(base.kind);
  const value = offensive
    ? Math.max(1, Math.round(base.value * multiplier))
    : defensive ? Math.max(1, Math.round(base.value * initialMultiplier)) : base.value;
  const pressureValue = Math.max(1, Math.round(base.value * multiplier));
  if (s.enemy?.charge) return { kind: 'chargedAttack', value: s.enemy.charge };
  if (s.bossFight && s.stage === ENEMIES.length - 1) {
    if (s.turn % 2 === 1) return { ...base, value };
    if (s.turn % 4 === 0) return { kind: 'charge', value: Math.max(1, Math.round(pressureValue * 1.8)) };
    if (s.turn % 6 === 0) return { kind: 'suppress', value: 2 };
    return { kind: 'dispel', value: Math.max(1, Math.round(pressureValue * .7)) };
  }
  if (s.stage >= 4 && s.turn % 5 === 0) return { kind: 'jam', value: 2 };
  if (s.stage >= 3 && s.turn % 4 === 3) return { kind: 'suppress', value: 2 };
  if (s.stage >= 2 && s.turn % 4 === 2) return { kind: 'dispel', value: Math.max(1, Math.round(pressureValue * .7)) };
  if (s.stage >= 1 && s.turn % 4 === 0) return { kind: 'charge', value: Math.max(1, Math.round(pressureValue * 1.8)) };
  return { ...base, value };
}
export function enemyFor(s) {
  if (!s) return ENEMIES[0];
  if (s.bossFight) return ENEMIES[s.stage];
  const encounter = ENCOUNTERS[s.stage]?.[s.foe] || ENCOUNTERS[s.stage]?.[0];
  return { ...encounter, place: ENEMIES[s.stage].place };
}
export function enemyMaxHp(s) {
  const difficulty = DIFFICULTIES[s.difficulty] || DIFFICULTIES.standard;
  const chapterScale = CHAPTER_HP_SCALES[s.stage] || 1;
  const depthScale = chapterScale * (1 + Math.max(0, s.mapRow) * difficulty.hpDepth);
  const rankScale = s.bossFight
    ? bossHpScale(s.stage)
    : s.elite ? (s.stage === 0 ? (s.difficulty === 'challenge' ? 1.875 : 1.5) : 1.3) : 1;
  const rawMaxHp = Math.round(enemyFor(s).hp * depthScale * rankScale * difficulty.hp);
  if (s.bossFight || s.stage <= 0) return rawMaxHp;
  const previousStage = s.stage - 1;
  const benchmarkHp = s.elite
    ? enemyMaxHp({ ...s, stage: previousStage, mapRow: MAP_STEPS - 1, foe: 0, elite: false, bossFight: true })
    : Math.max(...ENCOUNTERS[previousStage]
      .map((enemy, foe) => ({ enemy, foe }))
      .filter(({ enemy }) => !enemy.eliteOnly)
      .map(({ foe }) => enemyMaxHp({ ...s, stage: previousStage, mapRow: MAP_STEPS - 1, foe, elite: false, bossFight: false })));
  const boundaryFactor = s.elite
    ? ELITE_CHAPTER_HP_BOUNDARY_SCALES[s.stage]
    : NORMAL_CHAPTER_HP_BOUNDARY_SCALES[s.stage];
  return Math.max(rawMaxHp, Math.round(benchmarkHp * boundaryFactor));
}
function cardMode(c) {
  if (c.heal && !c.damage) return 'heal';
  if (c.damage) return 'attack';
  return 'support';
}
function cardCombatContext(s, c) {
  const bonuses = specializationBonuses(s);
  const stats = equipmentStats(s);
  const sameSchool = Boolean(s.lastCardSchool && s.lastCardSchool === c.school);
  const chain = sameSchool ? (s.schoolChain || 1) + 1 : 1;
  const mode = cardMode(c);
  const alternating = Boolean((mode === 'attack' && s.lastCardMode === 'heal') || (mode === 'heal' && s.lastCardMode === 'attack'));
  return { bonuses, stats, sameSchool, chain, mode, alternating };
}
function cardMarkGain(s, c) {
  const baseMarkGain = c.mark || 0;
  if (!baseMarkGain || !c.markedMarkBonusPct || (s.enemy?.mark || 0) <= 0) return baseMarkGain;
  return baseMarkGain + Math.ceil(baseMarkGain * c.markedMarkBonusPct);
}
export function attackBreakdown(s, key) {
  const c = card(key);
  const context = cardCombatContext(s, c);
  const { bonuses, stats } = context;
  const existingMarks = s.enemy.mark || 0;
  const baseMarkGain = cardMarkGain(s, c);
  const marksBeforeAttack = existingMarks + baseMarkGain;
  const gainedBlock = c.block ? c.block + stats.skillPower + (context.sameSchool ? bonuses.chainBlock || 0 : 0) : 0;
  const playerBlock = (s.block || 0) + gainedBlock;
  const warmthRetainedPct = Math.min(.5, Math.max(bonuses.warmthRetainPct || 0, bonuses.warmthMastery ? .5 : 0));
  const warmthSpent = c.damage && s.character === 'gaigai' ? Math.ceil((s.warmth || 0) * (1 - warmthRetainedPct)) : 0;
  const warmthDamage = Math.round(warmthSpent * (1 + (bonuses.warmthDamagePct || 0) + (bonuses.warmthMastery ? .25 : 0)));
  if (!c.damage) {
    const standaloneBase = (c.markBurst ? existingMarks * c.markBurst : 0) + (c.consumeMark ? marksBeforeAttack * c.consumeMark : 0);
    const standaloneSpecial = Math.round(standaloneBase * (1 + (bonuses.markSpecialPct || 0)));
    return { total: standaloneSpecial, normal: 0, weakpoint: standaloneSpecial, enemyBlock: s.enemy.block, marksAfter: c.consumeMark ? 0 : marksBeforeAttack, gainedBlock, playerBlockAfter: playerBlock, warmthSpent: 0, warmthDamage: 0, context };
  }
  const execute = c.execute && s.enemy.hp <= s.enemy.maxHp / 2 ? c.execute : 1;
  let damageMultiplier = execute;
  if (c.school === '书信') damageMultiplier *= 1 + (bonuses.letterDamagePct || 0) + (c.retain ? bonuses.retainedLetterDamagePct || 0 : 0);
  if (c.recycle) damageMultiplier *= 1 + (bonuses.recycleDamagePct || 0);
  if (context.sameSchool) damageMultiplier *= 1 + (bonuses.chainDamagePct || 0) + Math.max(0, context.chain - 1) * (bonuses.chainDepthPct || 0);
  if (context.alternating && context.mode === 'attack') damageMultiplier *= 1 + (bonuses.rhythmDamagePct || 0);
  if (s.hp <= s.maxHp / 2) damageMultiplier *= 1 + (bonuses.lowHealthDamagePct || 0);
  if ((s.enemy.mark || 0) > 0) damageMultiplier *= 1 + (bonuses.markedDamagePct || 0);
  if (bonuses.followMastery && context.sameSchool && context.chain % 3 === 0) damageMultiplier *= 1.5;
  const conditionalFlat = ((s.enemy.mark || 0) > 0 ? stats.markedStrike : 0)
    + (context.alternating ? stats.rhythmPower + (bonuses.rhythmFlatDamage || 0) : 0)
    + (playerBlock > 0 ? bonuses.guardedFlatDamage || 0 : 0)
    + (s.lucidCharge || 0);
  const baseDamage = Math.round((c.damage + stats.attack + conditionalFlat + (s.played === 0 ? stats.firstStrike + (s.sideBattleFirstStrike || 0) : 0)) * damageMultiplier);
  const base = s.weak > 0 ? Math.floor(baseDamage * .75) : baseDamage;
  const hits = c.hits || 1;
  let block = s.enemy.block;
  let normal = 0;
  let weakpoint = 0;
  const availableMarks = c.consumeMark ? 0 : marksBeforeAttack;
  for (let index = 0; index < hits; index++) {
    const normalDamage = base + (index === 0 ? warmthDamage : 0);
    const absorbed = Math.min(block, normalDamage);
    block -= absorbed;
    normal += normalDamage - absorbed;
    if (index < availableMarks) weakpoint += WEAKPOINT_DAMAGE_PER_LAYER;
  }
  const remainingMarks = c.consumeMark ? marksBeforeAttack : Math.max(0, marksBeforeAttack - hits);
  const blockDamageRatio = (c.blockDamage || 0) + (c.blockDamage ? (bonuses.blockDamagePct || 0) + stats.tidePower * .02 : 0);
  const blockDamage = Math.round(playerBlock * blockDamageRatio);
  const markSpecialBase = (c.markBurst ? existingMarks * c.markBurst : 0) + (c.consumeMark ? marksBeforeAttack * c.consumeMark : 0);
  const insightDetonate = bonuses.insightMastery && !c.consumeMark && marksBeforeAttack >= 12;
  const markSpecialDamage = Math.round((markSpecialBase + (insightDetonate ? marksBeforeAttack * 2 : 0)) * (1 + (bonuses.markSpecialPct || 0)));
  const shieldSpent = bonuses.tideMastery ? Math.floor(playerBlock * .3) : 0;
  const tideDamage = Math.round(shieldSpent * 1.5);
  const specialDamage = blockDamage + markSpecialDamage + tideDamage;
  const marksAfter = c.consumeMark || insightDetonate ? 0 : remainingMarks;
  const tideReserve = blockDamage > 0 ? Math.floor(blockDamage * (bonuses.tideNextBlockPct || 0)) : 0;
  return { total: normal + weakpoint + specialDamage, normal: normal + blockDamage + tideDamage, weakpoint: weakpoint + markSpecialDamage, enemyBlock: block, marksAfter, gainedBlock, playerBlockAfter: Math.max(0, playerBlock - shieldSpent), shieldSpent, warmthSpent, warmthDamage, tideReserve, insightDetonate, context };
}
export function attackPreview(s, key) { return attackBreakdown(s, key).total; }
export function equipmentStats(s) {
  const equipped = s?.equipment || {};
  return Object.values(equipped).reduce((total, id) => {
    const instance = itemFor(s, id);
    const item = instance && ITEMS[instance.base];
    if (!item) return total;
    const baseStats = itemBaseStats(instance);
    total.attack += baseStats.attack;
    total.block += baseStats.block;
    total.recovery += baseStats.recovery;
    total.firstStrike += baseStats.firstStrike;
    for (const affix of instance.affixes || []) if (Number.isFinite(total[affix.key])) total[affix.key] += affix.value;
    return total;
  }, { attack: 0, block: 0, recovery: 0, firstStrike: 0, healing: 0, skillPower: 0, markedStrike: 0, recycleGuard: 0, rhythmPower: 0, warmthPower: 0, overflowBlock: 0, counterPower: 0, tidePower: 0, lucidGuard: 0 });
}
function protectedCoreCard(s, key) {
  const baseKey = cardBaseKey(key);
  return CORE_REWARDS[s.character] === baseKey && s.cardLibrary.filter(cardKey => cardBaseKey(cardKey) === baseKey).length <= 1;
}
export function sideCardTurnInCandidates(s, rule = {}) {
  const activeCounts = new Map();
  for (const key of s?.deck || []) activeCounts.set(key, (activeCounts.get(key) || 0) + 1);
  const copyCounts = new Map();
  for (const key of s?.cardLibrary || []) copyCounts.set(key, (copyCounts.get(key) || 0) + 1);
  return (s?.cardLibrary || [])
    .map((key, index) => {
      const active = (activeCounts.get(key) || 0) > 0;
      if (active) activeCounts.set(key, activeCounts.get(key) - 1);
      return { key, index, active, copies: copyCounts.get(key) || 1, fresh: (s?.unsecuredCards || []).includes(key) };
    })
    .filter(item => !item.key.endsWith('~gear') && CARDS[cardBaseKey(item.key)])
    .filter(item => cardRank(item.key) >= (rule.minRank || 1))
    .filter(item => !rule.school || CARDS[cardBaseKey(item.key)].school === rule.school)
    .filter(item => !protectedCoreCard(s, item.key))
    .sort((a, b) => Number(a.active) - Number(b.active)
      || cardRank(a.key) - cardRank(b.key)
      || b.copies - a.copies
      || card(a.key).name.localeCompare(card(b.key).name, 'zh-CN')
      || a.index - b.index);
}
export function sideGearTurnInCandidates(s) {
  const equipped = new Set(Object.values(s?.equipment || {}).filter(Boolean));
  return (s?.inventory || [])
    .filter(item => ITEMS[item.base] && !equipped.has(item.id))
    .sort((a, b) => Number((s?.unsecuredLoot || []).includes(b.id)) - Number((s?.unsecuredLoot || []).includes(a.id)) || itemScore(a) - itemScore(b));
}
function addCardReward(s, key, rank = skillRewardRank(s, key)) {
  const ranked = rankedCardKey(key, Math.max(1, Math.min(10, rank)));
  s.cardLibrary.push(ranked);
  s.unsecuredCards ||= [];
  s.unsecuredCards.push(ranked);
  s.journeyCardDrops ||= [];
  s.journeyCardDrops.push(ranked);
  s.journeyNewCards ||= [];
  if (!s.journeyNewCards.includes(cardBaseKey(ranked))) s.journeyNewCards.push(cardBaseKey(ranked));
  log(s, `获得新技能牌「${card(ranked).name}」，收入候补。`);
  return ranked;
}
function addGearReward(s, bases = CHAPTER_LOOT[s.stage], boosted = true) {
  const pool = bases?.filter(base => ITEMS[base])?.length ? bases.filter(base => ITEMS[base]) : CHAPTER_LOOT[s.stage];
  const base = pool[Math.floor(random(s) * pool.length)];
  const item = rollItem(s, base, boosted);
  return addGearRewardItem(s, item);
}
function addGearRewardItem(s, item) {
  s.inventory.unshift(item);
  s.unsecuredLoot ||= [];
  s.unsecuredLoot.push(item.id);
  s.journeyNewItems ||= [];
  s.journeyNewItems.push(item.id);
  s.lastLoot = item.id;
  s.lastLoots = [item.id];
  log(s, `获得${item.rarity}装备「${itemName(item)}」。`);
  return item;
}
function applySideEffect(s, effect = {}) {
  if (effect.type === 'gold') {
    s.gold += effect.value || 0;
    log(s, `获得 ${effect.value || 0} 枚旅币。`);
  } else if (effect.type === 'heal') {
    const gain = Math.min(effect.value || 0, s.maxHp - s.hp);
    s.hp += gain;
    log(s, `回复 ${gain} 点生命。`);
  } else if (effect.type === 'healGold') {
    const gain = Math.min(effect.heal || 0, s.maxHp - s.hp);
    s.hp += gain; s.gold += effect.gold || 0;
    log(s, `回复 ${gain} 点生命，获得 ${effect.gold || 0} 枚旅币。`);
  } else if (effect.type === 'cleanseHeal') {
    s.weak = 0; s.healingSuppression = 0;
    const gain = Math.min(effect.value || 0, s.maxHp - s.hp);
    s.hp += gain;
    log(s, `梦里的杂音安静下来，回复 ${gain} 点生命。`);
  } else if (effect.type === 'card') {
    addCardReward(s, effect.key, skillRewardRank(s, effect.key) + (effect.rankBonus || 0));
  } else if (effect.type === 'gear') {
    addGearReward(s, effect.bases, true);
  } else if (effect.type === 'buff') {
    s.sideBuffs ||= [];
    s.sideBuffs.push({ key: effect.key || 'sideBuff', battles: effect.battles || 1, block: effect.block || 0, energy: effect.energy || 0, firstStrike: effect.firstStrike || 0 });
    log(s, '一段小小的祝福留在车灯里。');
  } else if (effect.type === 'specializationPoint') {
    s.specializationBonusPoints = Math.min(MAX_SPECIALIZATION_POINTS, (s.specializationBonusPoints || 0) + (effect.value || 1));
    log(s, `梦册留下新的空白，获得 ${effect.value || 1} 点专精点。`);
  } else if (effect.type === 'specializationReset') {
    s.specializationResetTokens = Math.min(1, (s.specializationResetTokens || 0) + 1);
    s.specializationResetQuestDone = true;
    log(s, '获得「空白书签」，可以重置一次全部专精点。');
  }
}
function addSidePromise(s, storyId, choice, promise) {
  s.sidePromises ||= [];
  const entry = { id: storyId, choice, type: promise.type, stage: s.stage, createdStep: s.stepsTraveled, createdVictories: s.victories };
  if (promise.afterSteps) entry.dueStep = s.stepsTraveled + promise.afterSteps;
  if (promise.afterBattles) entry.dueVictories = s.victories + promise.afterBattles;
  if (promise.due === 'checkpoint') entry.dueCheckpoint = true;
  if (promise.key) entry.key = promise.key;
  if (promise.rankBonus) entry.rankBonus = promise.rankBonus;
  if (promise.bases) entry.bases = promise.bases;
  if (promise.shop) entry.shop = promise.shop;
  if (promise.buff) entry.buff = promise.buff;
  if (promise.count) entry.count = promise.count;
  if (promise.school) entry.school = promise.school;
  if (promise.clue) entry.clue = promise.clue;
  s.sidePromises.push(entry);
}
function criticalQuestDefaults() {
  return Object.fromEntries(Object.entries(CRITICAL_SIDE_QUESTS).map(([id, quest]) => [id, { status: 'locked', progress: 0, target: quest.target }]));
}
function ensureCriticalSideQuests(s) {
  s.criticalSideQuests ||= criticalQuestDefaults();
  for (const [id, quest] of Object.entries(CRITICAL_SIDE_QUESTS)) {
    s.criticalSideQuests[id] ||= { status: 'locked', progress: 0, target: quest.target };
  }
  const activate = (id, message) => {
    const progress = s.criticalSideQuests[id];
    if (progress.status !== 'locked') return;
    progress.status = 'active';
    log(s, message);
  };
  if (specializationSpent(s) > 0 && !s.specializationResetQuestDone) activate('dreambookReset', '梦册夹页留下约定：收集三只夜蛾熄灭后落下的灯粉。这个约定没有期限。');
  if (s.unlocked >= ENEMIES.length - 1) activate('blankTagTrail', '终点站的空白标签开始寻找失散的行李。这个约定没有期限。');
  if (s.criticalSideQuests.blankTagTrail.status === 'complete' || s.namelessClues?.includes('blankTag')) activate('ledgerBackTrail', '登记簿背面的字迹在等待三只失序钟停下。这个约定没有期限。');
}
function enemyFamily(enemy) {
  if (enemy?.art === 5) return 'lantern';
  if (enemy?.art === 1) return 'luggage';
  if ([0, 14, 15].includes(enemy?.art)) return 'timepiece';
  return null;
}
function guaranteedCriticalEnemyFamily(s, encounterPool, node) {
  if (s.bossFight || s.elite || node.row % 10 !== 0) return null;
  ensureCriticalSideQuests(s);
  const availableFamilies = new Set(encounterPool.map(entry => enemyFamily(entry.enemy)).filter(Boolean));
  for (const [id, quest] of Object.entries(CRITICAL_SIDE_QUESTS)) {
    const progress = s.criticalSideQuests[id];
    if (!progress || progress.status === 'complete' || progress.status === 'ready' || progress.status === 'claiming') continue;
    if (s.unlocked < quest.unlockStage || !availableFamilies.has(quest.family) || progress.progress >= progress.target) continue;
    return quest.family;
  }
  return null;
}
function progressCriticalSideQuests(s, enemy) {
  ensureCriticalSideQuests(s);
  const family = enemyFamily(enemy);
  if (!family || s.bossFight) return;
  for (const [id, quest] of Object.entries(CRITICAL_SIDE_QUESTS)) {
    const progress = s.criticalSideQuests[id];
    if (progress.status !== 'active' || quest.family !== family) continue;
    progress.progress = Math.min(progress.target, progress.progress + 1);
    log(s, `长期委托「${SIDE_STORIES[quest.storyId].name}」推进：${progress.progress}/${progress.target}。`);
    if (progress.progress >= progress.target) progress.status = 'ready';
  }
}
function showReadyCriticalSideQuest(s) {
  ensureCriticalSideQuests(s);
  if (s.pendingScene || s.phase !== 'map') return false;
  const entry = Object.entries(CRITICAL_SIDE_QUESTS).find(([id, quest]) => {
    const progress = s.criticalSideQuests[id];
    return progress.status === 'ready' && (!quest.requires || s.criticalSideQuests[quest.requires]?.status === 'complete');
  });
  if (!entry) return false;
  const [id, quest] = entry;
  s.criticalSideQuests[id].status = 'claiming';
  s.pendingScene = {
    storyId: quest.storyId,
    kind: 'reward',
    title: quest.title,
    text: quest.text,
    claimLabel: quest.claimLabel,
    promise: { ...quest.reward, id: quest.storyId, stage: s.stage, createdStep: s.stepsTraveled, createdVictories: s.victories, criticalQuest: id },
  };
  s.phase = 'sideResolve';
  return true;
}
function scheduleGuaranteedSideStory(s) {
  s.sideStoryQueue ||= [];
  s.sideChapterTriggers ||= Array(ENEMIES.length).fill(0);
  if (s.stage >= ENEMIES.length - 1) return false;
  const dueCount = [5, 21].filter(row => s.mapRow >= row).length;
  let scheduled = false;
  while (s.sideChapterTriggers[s.stage] < dueCount) {
    const pool = Object.entries(SIDE_STORIES)
      .filter(([id, story]) => !story.critical && !s.sideStorySeen.includes(id) && !s.sideStoryQueue.includes(id) && story.chapters?.includes(s.stage));
    if (!pool.length) break;
    const [id] = pool[Math.floor(random(s) * pool.length)];
    s.sideStoryQueue.push(id);
    s.sideStorySeen.push(id);
    s.sideChapterTriggers[s.stage]++;
    scheduled = true;
    log(s, `一段夜路插曲已经跟上房车：「${SIDE_STORIES[id].name}」。`);
  }
  return scheduled;
}
function showQueuedSideStory(s) {
  s.sideStoryQueue ||= [];
  if (s.phase !== 'map' || s.pendingScene || s.sideStory || !s.sideStoryQueue.length) return false;
  const id = s.sideStoryQueue.shift();
  if (!SIDE_STORIES[id]) return false;
  s.sideStory = { id };
  s.phase = 'sideStory';
  log(s, `夜路上出现了新的插曲：「${SIDE_STORIES[id].name}」。`);
  return true;
}
function continueSideScenes(s, trigger = 'step') {
  if (showReadyCriticalSideQuest(s)) return true;
  if (resolveDueSidePromises(s, trigger)) return true;
  return showQueuedSideStory(s);
}
function mainStoryId(stage, beat) {
  return `${stage}:${beat}`;
}
export function mainStorySpecializationReward(stage, beat) {
  return beat === 'ending' && [1, 3, 5].includes(stage) ? 1 : 0;
}
function queueMainStory(s, stage, beat, variant = null) {
  const story = MAIN_STORY[stage];
  if (!story || !['intro', 'boss', 'ending'].includes(beat)) return false;
  s.mainStorySeen ||= [];
  const id = mainStoryId(stage, beat);
  if (s.mainStorySeen.includes(id)) return false;
  s.mainStorySeen.push(id);
  s.mainStory = { stage, beat, variant };
  s.phase = 'mainStory';
  log(s, `登记簿翻到「${story.guest}」的故事。`);
  return true;
}
function finalStoryVariant(s) {
  const mainClues = MAIN_STORY.slice(0, 5).map(story => story.clue);
  const hasMainPage = mainClues.every(clue => s.namelessClues?.includes(clue));
  const hasSidePage = ['blankTag', 'ledgerBack'].every(clue => s.namelessClues?.includes(clue));
  if (hasMainPage && hasSidePage) return 'hidden';
  if (hasMainPage) return 'complete';
  return 'fragmented';
}
function maybeStartSideStory(s) {
  s.sideStorySeen ||= [];
  s.sidePromises ||= [];
  scheduleGuaranteedSideStory(s);
  return continueSideScenes(s, 'event');
}
function sideShopGoods(s, promise = {}) {
  const pools = {
    vendor: ['wishBox', 'luckyCoin', 'velvetMarketCoat'],
    umbrella: ['blueUmbrella', 'windowCoat', 'oathPlate'],
  };
  const bases = pools[promise.shop] || CHAPTER_LOOT[s.stage];
  const gearBase = bases[Math.floor(random(s) * bases.length)] || CHAPTER_LOOT[s.stage][0];
  const gearItem = rollItem(s, gearBase, true, '稀有');
  const cardPool = REWARDS.filter(key => (SKILL_UNLOCKS[key] ?? 0) <= Math.max(s.stage, 1));
  const cardKey = cardPool[Math.floor(random(s) * cardPool.length)] || 'riposte';
  return [
    { id: 'gear', kind: 'gear', bases, item: gearItem, cost: 48 + s.stage * 10, label: itemName(gearItem) },
    { id: 'card', kind: 'card', key: cardKey, rankBonus: 2, cost: 38 + s.stage * 8, label: '一张折过两次的车票' },
    { id: 'buff', kind: 'buff', effect: { type: 'buff', key: 'shopWarmth', battles: 2, energy: 1 }, cost: 26 + s.stage * 6, label: '一枚还温着的硬币' },
  ];
}
function buildSideResolveScene(s, promise) {
  const story = SIDE_STORIES[promise.id];
  const base = { storyId: promise.id, promise, title: story?.resolve?.title || story?.name || '夜路回声', text: story?.resolve?.text || '先前的选择在夜路上追了回来。' };
  if (promise.type === 'shop') return { ...base, kind: 'shop', goods: sideShopGoods(s, promise) };
  if (promise.type === 'turnin_cards') return { ...base, kind: 'turnin_cards', count: promise.count || 2, school: promise.school || null, key: promise.key, rankBonus: promise.rankBonus || 1 };
  if (promise.type === 'turnin_gear') return { ...base, kind: 'turnin_gear', count: promise.count || 2, bases: promise.bases };
  return { ...base, kind: 'reward' };
}
function resolveDueSidePromises(s, trigger = 'step') {
  s.sidePromises ||= [];
  if (s.pendingScene || s.phase === 'sideResolve') return false;
  const dueIndex = s.sidePromises.findIndex(promise => (Number.isInteger(promise.dueStep) && s.stepsTraveled >= promise.dueStep)
    || (Number.isInteger(promise.dueVictories) && s.victories >= promise.dueVictories)
    || (promise.dueCheckpoint && trigger === 'checkpoint'));
  if (dueIndex < 0) return false;
  const [promise] = s.sidePromises.splice(dueIndex, 1);
  s.pendingScene = buildSideResolveScene(s, promise);
  s.phase = 'sideResolve';
  return true;
}
function removeCardSelections(s, selections) {
  const ordered = [...selections].sort((a, b) => b.index - a.index);
  const removed = [];
  for (const { index } of ordered) {
    if (!Number.isInteger(index) || index < 0 || index >= s.cardLibrary.length) return null;
    removed.push(s.cardLibrary[index]);
    s.cardLibrary.splice(index, 1);
  }
  for (const selection of selections) {
    const key = selection.key;
    const deckIndex = selection.active ? s.deck.findIndex(cardKey => cardKey === key) : -1;
    if (deckIndex >= 0) s.deck.splice(deckIndex, 1);
    const unsecuredIndex = (s.unsecuredCards || []).findIndex(cardKey => cardKey === key);
    if (unsecuredIndex >= 0) s.unsecuredCards.splice(unsecuredIndex, 1);
    const dropIndex = (s.journeyCardDrops || []).findIndex(cardKey => cardKey === key);
    if (dropIndex >= 0) s.journeyCardDrops.splice(dropIndex, 1);
    if (!s.cardLibrary.some(cardKey => cardBaseKey(cardKey) === cardBaseKey(key))) {
      s.journeyNewCards = (s.journeyNewCards || []).filter(baseKey => baseKey !== cardBaseKey(key));
    }
  }
  return removed;
}
function removeGearByIds(s, ids) {
  const equipped = new Set(Object.values(s.equipment).filter(Boolean));
  const selected = ids.map(id => itemFor(s, id));
  if (selected.some(item => !item || equipped.has(item.id))) return null;
  s.inventory = s.inventory.filter(item => !ids.includes(item.id));
  s.unsecuredLoot = (s.unsecuredLoot || []).filter(id => !ids.includes(id));
  s.journeyNewItems = (s.journeyNewItems || []).filter(id => !ids.includes(id));
  if (ids.includes(s.lastLoot)) s.lastLoot = null;
  s.lastLoots = (s.lastLoots || []).filter(id => !ids.includes(id));
  return selected;
}
export function beginBattle(s) {
  s.phase = 'combat'; s.turn = 1; s.energy = 3; s.weak = 0;
  s.warmth = 0; s.traitUsed = false;
  s.lastCardSchool = null; s.lastCardMode = null; s.schoolChain = 0; s.rhythmTriggers = 0; s.recycleTriggered = false; s.healDrawTriggered = false; s.lucidFocusTriggered = false; s.lucidCharge = 0; s.counterTriggers = 0;
  s.battleLog = [];
  s.pillowActive = (s.pillowBattles || 0) > 0;
  if (s.pillowActive) s.pillowBattles--;
  s.block = (s.pillowActive ? ambientEventValues(s).pillowBlock : 0) + equipmentStats(s).block;
  s.sideBattleFirstStrike = 0;
  for (const buff of s.sideBuffs || []) {
    if (buff.block) s.block += buff.block;
    if (buff.energy) s.energy += buff.energy;
    if (buff.firstStrike) {
      s.sideBattleFirstStrike = (s.sideBattleFirstStrike || 0) + buff.firstStrike;
    }
    buff.battles--;
    log(s, '夜路承诺留下的祝福在梦境入口亮了一下。');
  }
  s.sideBuffs = (s.sideBuffs || []).filter(buff => buff.battles > 0);
  const difficulty = DIFFICULTIES[s.difficulty] || DIFFICULTIES.standard;
  const foe = enemyFor(s);
  const maxHp = enemyMaxHp(s);
  s.enemy = { hp: maxHp, maxHp, block: 0, mark: 0, charge: 0 };
  s.nextBlock = 0; s.healingSuppression = 0;
  const grantedCards = Object.values(s.equipment).map(id => itemFor(s, id)).filter(item => item?.skill).map(item => rankedCardKey(item.skill, item.skillLevel || 1, true));
  s.draw = shuffle(s, [...s.deck, ...grantedCards]); s.hand = []; s.discard = []; s.exhaust = [];
  s.choices = [];
  draw(s, 5);
  log(s, `抵达${foe.place}，遭遇${foe.name}。`);
  log(s, `第 1 回合开始，能量为 ${s.energy}。`);
  logBattleStatus(s);
}
export function newRun(seed = Date.now() >>> 0, battleMode = 'manual', difficulty = 'standard', character = 'uncle') {
  const inventory = [
    { id: 'gear-1', base: 'wornBlade', itemLevel: 1, rarity: '普通', affixes: [], skill: null, skillLevel: 0 },
    { id: 'gear-2', base: 'travelCoat', itemLevel: 1, rarity: '普通', affixes: [], skill: null, skillLevel: 0 },
  ];
  const selectedDifficulty = DIFFICULTIES[difficulty] ? difficulty : 'standard';
  const selectedCharacter = CHARACTERS[character] ? character : 'uncle';
  const startingHp = CHARACTERS[selectedCharacter].maxHp || 70;
  const starterDeck = [...CHARACTERS[selectedCharacter].starter];
  const s = { version: VERSION, seed: seed >>> 0, mapSeed: seed >>> 0, character: selectedCharacter, warmth: 0, traitUsed: false, coreRewardMisses: 0, specializations: {}, specializationBonusPoints: 0, specializationSeen: false, specializationResetTokens: 0, specializationResetQuestDone: false, specializationStoryRewards: [], magicHouseCooldowns: {}, mysteryResult: null, lastMysteryResult: null, blackMarketOffers: null, mainStory: null, mainStorySeen: [], sideStory: null, sidePromises: [], sideStorySeen: [], sideStoryQueue: [], sideChapterTriggers: [0, 0, 0, 0, 0, 0], criticalSideQuests: criticalQuestDefaults(), pendingScene: null, sideBuffs: [], sideBattleFirstStrike: 0, namelessClues: [], featureSeen: { bag: false, workshop: false, guests: false, waypoint: false }, workshopUnlocked: false, difficulty: selectedDifficulty, battleMode: battleMode === 'manual' ? 'manual' : 'auto', tutorialDone: battleMode !== 'manual', phase: 'hub', stage: 0, unlocked: 0, clears: [0, 0, 0, 0, 0, 0], guestRewards: [false, false, false, false, false, false], chapterCheckpoints: [-1, -1, -1, -1, -1, -1], level: 1, xp: 0, nextXp: 45, hp: 70, maxHp: 70, gold: 0, facilities: { kitchen: 0, workshop: 0, rooms: 0 }, commissionClaims: { battles: 0, steps: 0, stories: 0 }, stepsTraveled: 0, pillowBattles: 0, pillowActive: false, elite: false, bossFight: false, foe: 0, checkpointRow: -1, mapRow: -1, currentNode: null, visited: [], unsecuredLoot: [], unsecuredCards: [], journeyCardDrops: [], journeyNewItems: [], journeyNewCards: [], inventory, equipment: { weapon: 'gear-1', armor: 'gear-2', bag: null, scarf: null, charm: null, decor: null }, nextItemId: 3, lastLoot: null, lastLoots: [], lastLevelUp: null, cardLibrary: [...starterDeck], deck: starterDeck, log: [], battleLog: [], played: 0, totalTurns: 0, victories: 0 };
  s.hp = startingHp; s.maxHp = startingHp;
  s.turn = 1; s.energy = 3; s.block = 0; s.nextBlock = 0; s.weak = 0; s.healingSuppression = 0;
  s.lastCardSchool = null; s.lastCardMode = null; s.schoolChain = 0; s.rhythmTriggers = 0; s.recycleTriggered = false; s.healDrawTriggered = false; s.lucidFocusTriggered = false; s.lucidCharge = 0; s.counterTriggers = 0;
  s.enemy = { hp: 0, maxHp: 0, block: 0, mark: 0, charge: 0 };
  s.draw = []; s.hand = []; s.discard = []; s.exhaust = []; s.choices = [];
  log(s, '房车在花田边停稳，第一盏夜灯已经亮起。');
  return s;
}

export function chooseAutoCard(s) {
  if (!s || s.phase !== 'combat') return -1;
  const move = intent(s);
  const incoming = ['attack', 'curse', 'chargedAttack', 'dispel'].includes(move.kind) ? move.value * (move.hits || 1) : 0;
  const missingHp = Math.max(0, s.maxHp - s.hp);
  const stats = equipmentStats(s);
  const bonuses = specializationBonuses(s);
  const affordable = s.hand.map((key, index) => {
    const c = card(key);
    const context = cardCombatContext(s, c);
    const markLayers = cardMarkGain(s, c);
    const traitDraw = markLayers && s.character === 'uncle' && !s.traitUsed ? 1 : 0;
    const effectiveMarkLayers = markLayers;
    let score = attackPreview(s, key);
    score += Math.min(incoming, (c.block || 0) + stats.skillPower + (context.sameSchool ? bonuses.chainBlock || 0 : 0)) * 1.15;
    const estimatedHealing = (c.heal || 0) + stats.healing + (context.sameSchool ? bonuses.chainHealing || 0 : 0);
    score += Math.min(missingHp, Math.round(estimatedHealing * (1 + (bonuses.healingPct || 0) + (context.alternating ? bonuses.rhythmHealingPct || 0 : 0)))) * 1.1;
    score += effectiveMarkLayers * (s.character === 'uncle' ? 4 : 2.7);
    score += ((c.draw || 0) + traitDraw) * 5 + (c.energy || 0) * 6 + (c.recycle || 0) * 4 + (c.nextBlock || 0) * .55;
    if (c.recycle) score += (bonuses.recycleBlock || 0) * c.recycle + (bonuses.letterMastery && !s.recycleTriggered ? 8 : 0);
    if (c.heal && s.character === 'gaigai') score += (bonuses.warmthGain || 0) * 1.5 + stats.warmthPower;
    if (context.alternating) score += bonuses.rhythmMastery && s.rhythmTriggers < 2 ? 7 : 2;
    if (c.blockDamage || bonuses.tideMastery) score += Math.max(0, s.block) * ((bonuses.blockDamagePct || 0) + stats.tidePower * .02);
    const estimatedSelfDamage = c.self ? Math.max(1, Math.ceil(c.self * (1 - Math.min(.8, bonuses.selfDamageReductionPct || 0)))) : 0;
    if (c.self && bonuses.lucidMastery) score += Math.min(12, c.self * 3);
    if (c.cleanse && (s.healingSuppression || s.weak)) score += 12;
    if (c.self && !bonuses.lucidMastery && s.hp <= estimatedSelfDamage + incoming) score -= 100;
    return { index, card: c, score: score / Math.max(1, c.cost || .65) };
  }).filter(item => item.card.cost <= s.energy).sort((a, b) => b.score - a.score);
  return affordable[0]?.index ?? -1;
}

function recommendedDeck(s, size = 10) {
  const candidates = s.cardLibrary.map((key, index) => {
    const c = card(key);
    const damage = (c.damage || 0) * (c.hits || 1);
    const effectPower = damage + (c.block || 0) * .85 + (c.nextBlock || 0) * .55 + (c.heal || 0)
      + (c.mark || 0) * 2.5 + (c.draw || 0) * 6 + (c.energy || 0) * 8 + (c.recycle || 0) * 5
      + (c.markBurst ? 8 : 0) + (c.consumeMark ? 12 : 0) + (c.blockDamage ? 8 : 0) + (c.retain ? 3 : 0)
      - (c.self || 0) * 1.5 - (c.exhaust ? 1 : 0);
    const score = effectPower / Math.max(1, c.cost) + c.rank * 4 + (AUTO_LOADOUT_CARD_PRIORITY[c.baseKey] || 0);
    return {
      key, index, score,
      offense: Boolean(c.damage || c.mark || c.markBurst || c.consumeMark),
      sustain: Boolean(c.block || c.heal || c.nextBlock),
    };
  }).sort((left, right) => right.score - left.score || left.index - right.index);
  const selected = [];
  const selectedIndexes = new Set();
  const take = (count, predicate = () => true) => {
    for (const candidate of candidates) {
      if (selected.length >= size || count <= 0) break;
      if (selectedIndexes.has(candidate.index) || !predicate(candidate)) continue;
      selected.push(candidate);
      selectedIndexes.add(candidate.index);
      count--;
    }
  };
  take(4, candidate => candidate.offense);
  take(2, candidate => candidate.sustain);
  take(size - selected.length);
  return selected.map(candidate => candidate.key);
}

function victory(s) {
  const foe = enemyFor(s);
  const difficulty = DIFFICULTIES[s.difficulty] || DIFFICULTIES.standard;
  const rewardScale = difficulty.reward;
  const encounterGoldBonus = s.bossFight ? 32 : s.elite ? 16 : 0;
  s.victories++; s.gold += Math.round((24 + s.stage * 8 + encounterGoldBonus) * BATTLE_GOLD_SCALE);
  s.pillowActive = false;
  progressCriticalSideQuests(s, foe);
  const xpGain = Math.round((30 + s.stage * 14 + (s.elite ? 18 : 0)) * rewardScale);
  s.xp += xpGain;
  const levelBefore = s.level;
  let levels = 0;
  while (s.level < MAX_PLAYER_LEVEL && s.xp >= s.nextXp) {
    s.xp -= s.nextXp; s.level++; levels++; s.nextXp = 45 + (s.level - 1) * 20;
    s.maxHp += 6; s.hp += difficulty.levelHeal;
  }
  if (s.level >= MAX_PLAYER_LEVEL) s.xp = 0;
  const specializationPointsGained = Math.max(0, Math.min(MAX_SPECIALIZATION_POINTS, s.level) - Math.min(MAX_SPECIALIZATION_POINTS, levelBefore));
  s.lastLevelUp = levels ? { from: levelBefore, to: s.level, specializationPoints: specializationPointsGained } : null;
  const recovery = Math.round((3 + equipmentStats(s).recovery + s.facilities.kitchen * 2) * difficulty.recovery);
  s.hp = Math.min(s.maxHp, s.hp + recovery);
  const lootPool = CHAPTER_LOOT[s.stage];
  const dropWindow = s.bossFight ? 5 : s.elite ? 4 : 3;
  const dropCount = equipmentDropCount(s);
  const droppedItems = [];
  let skillDropped = false;
  for (let index = 0; index < dropCount; index++) {
    const dropOffset = (s.foe * 3 + s.mapRow + index + Math.floor(random(s) * dropWindow)) % lootPool.length;
    const dropped = rollItem(s, lootPool[dropOffset], s.elite || s.bossFight);
    if (skillDropped && dropped.skill) { dropped.skill = null; dropped.skillLevel = 0; }
    if (dropped.skill) skillDropped = true;
    droppedItems.push(dropped);
    s.inventory.unshift(dropped);
    s.unsecuredLoot ||= [];
    s.unsecuredLoot.push(dropped.id);
    s.journeyNewItems ||= [];
    s.journeyNewItems.push(dropped.id);
  }
  s.lastLoots = droppedItems.map(item => item.id);
  s.lastLoot = s.lastLoots[0] || null;
  s.phase = 'reward';
  const unlockedSkills = REWARDS.filter(key => (SKILL_UNLOCKS[key] ?? 0) <= s.stage);
  const coreReward = CORE_REWARDS[s.character];
  const preferred = unlockedSkills.filter(key => CHARACTERS[s.character].schools.includes(CARDS[key].school));
  const owned = new Set(s.cardLibrary.map(cardBaseKey));
  const fresh = unlockedSkills.filter(key => !owned.has(key));
  const firstFresh = shuffle(s, fresh.filter(key => preferred.includes(key)))[0] || shuffle(s, fresh)[0];
  s.choices = [];
  const addChoice = pool => {
    if (s.choices.length >= 3) return;
    const candidate = shuffle(s, pool.filter(key => !s.choices.includes(key)))[0];
    if (candidate) s.choices.push(candidate);
  };
  addChoice(firstFresh ? [firstFresh] : unlockedSkills.filter(key => key !== coreReward));
  const showCoreReward = s.coreRewardMisses >= 2 || random(s) < .5;
  if (showCoreReward) addChoice([coreReward]);
  else addChoice(unlockedSkills.filter(key => key !== coreReward && (preferred.includes(key) || owned.has(key))));
  addChoice(unlockedSkills.filter(key => key !== coreReward));
  while (s.choices.length < 3) {
    const before = s.choices.length;
    addChoice(unlockedSkills.filter(key => key !== coreReward));
    if (s.choices.length === before) break;
  }
  if (s.choices.includes(coreReward)) s.coreRewardMisses = 0;
  else s.coreRewardMisses++;
  log(s, `击败${foe.name}，获得 ${xpGain} 点经验。`);
  if (levels) {
    const specializationPointsGained = Math.max(0, Math.min(MAX_SPECIALIZATION_POINTS, s.level) - Math.min(MAX_SPECIALIZATION_POINTS, levelBefore));
    log(s, `店主升至 ${s.level} 级，生命上限提高${specializationPointsGained ? `，获得 ${specializationPointsGained} 点专精点` : ''}。`);
  }
  if (droppedItems.length) droppedItems.forEach(item => log(s, `获得${item.rarity}装备「${itemName(item)}」。`));
  else log(s, '这场战斗没有掉落装备。');
  log(s, `战斗结束后回复 ${recovery} 点生命。`);
}
// All game transitions are pure and serializable, so tests and saved runs use the same rules.
export function transition(state, action) {
  if (!state || !action) return state;
  const s = JSON.parse(JSON.stringify(state));
  if (action.type === 'revive' && s.phase === 'lost') {
    const equippedIds = new Set(Object.values(s.equipment || {}).filter(Boolean));
    const lostNames = s.inventory.filter(item => equippedIds.has(item.id)).map(itemName);
    s.inventory = s.inventory.filter(item => !equippedIds.has(item.id));
    s.equipment = Object.fromEntries(Object.keys(SLOT_LABELS).map(slot => [slot, null]));
    s.phase = 'hub';
    s.hp = s.maxHp;
    s.energy = 3; s.block = 0; s.nextBlock = 0; s.weak = 0; s.healingSuppression = 0;
    s.mapRow = -1; s.currentNode = null; s.visited = []; s.checkpointRow = -1;
    s.unsecuredLoot = []; s.unsecuredCards = []; s.journeyCardDrops = [];
    s.journeyNewItems = (s.journeyNewItems || []).filter(id => !equippedIds.has(id));
    if (equippedIds.has(s.lastLoot)) s.lastLoot = null;
    s.lastLoots = (s.lastLoots || []).filter(id => !equippedIds.has(id));
    s.elite = false; s.bossFight = false; s.mysteryResult = null; s.blackMarketOffers = null;
    s.enemy = { hp: 0, maxHp: 0, block: 0, mark: 0, charge: 0 };
    s.hand = []; s.draw = []; s.discard = []; s.exhaust = []; s.choices = [];
    log(s, lostNames.length
      ? `你被带回房车休整，生命已经恢复；身上装备全部遗失：${lostNames.join('、')}。背包里的装备仍然保留。`
      : '你被带回房车休整，生命已经恢复；身上没有装备可遗失，背包里的装备仍然保留。');
    return s;
  }
  if (action.type === 'reviveWithGold' && s.phase === 'lost') {
    const cost = reviveCost(s);
    if (s.gold < cost) return state;
    s.gold -= cost;
    s.phase = 'hub';
    s.hp = s.maxHp;
    s.energy = 3; s.block = 0; s.nextBlock = 0; s.weak = 0; s.healingSuppression = 0;
    s.mapRow = -1; s.currentNode = null; s.visited = []; s.checkpointRow = -1;
    s.unsecuredLoot = []; s.unsecuredCards = []; s.journeyCardDrops = [];
    s.elite = false; s.bossFight = false; s.mysteryResult = null; s.blackMarketOffers = null;
    s.enemy = { hp: 0, maxHp: 0, block: 0, mark: 0, charge: 0 };
    s.hand = []; s.draw = []; s.discard = []; s.exhaust = []; s.choices = [];
    log(s, `花费 ${cost} 枚旅币买活，房车把你接回灯下。身上装备与背包物品都已保留。`);
    return s;
  }
  if (action.type === 'viewCard') {
    const baseKey = cardBaseKey(action.key);
    if (!CARDS[baseKey]) return state;
    s.journeyNewCards = (s.journeyNewCards || []).filter(key => key !== baseKey);
    return s;
  }
  if (action.type === 'viewCardLibrary') {
    s.journeyNewCards = [];
    return s;
  }
  if (action.type === 'viewItemLibrary') {
    s.journeyNewItems = [];
    return s;
  }
  if (action.type === 'viewFeature' && s.phase === 'hub') {
    if (!['bag', 'workshop', 'guests', 'waypoint'].includes(action.key)) return state;
    s.featureSeen[action.key] = true;
    return s;
  }
  if (action.type === 'viewSpecialization' && s.phase === 'hub' && specializationUnlocked(s)) {
    s.specializationSeen = true;
    return s;
  }
  if (action.type === 'specialize' && s.phase === 'hub' && specializationUnlocked(s)) {
    const allocations = action.allocations;
    if (!validSpecializationAllocation(s, allocations)) return state;
    const current = s.specializations || {};
    if (Object.entries(current).some(([id, rank]) => (allocations[id] || 0) < rank)) return state;
    if (Object.values(allocations).reduce((sum, rank) => sum + rank, 0) <= specializationSpent(s)) return state;
    s.specializations = Object.fromEntries(Object.entries(allocations).filter(([, rank]) => rank > 0));
    s.specializationSeen = true;
    ensureCriticalSideQuests(s);
    log(s, `在专精盘中确认了 ${specializationSpent(s)} 点成长。`);
    return s;
  }
  if (action.type === 'resetSpecialization' && s.phase === 'hub') {
    if ((s.specializationResetTokens || 0) < 1 || specializationSpent(s) < 1) return state;
    s.specializationResetTokens--;
    s.specializations = {};
    log(s, '使用「空白书签」，全部专精点已经返还。');
    return s;
  }
  if (action.type === 'loadout' && ['hub', 'loadout'].includes(s.phase)) {
    if (action.operation === 'activateAll') {
      if (s.cardLibrary.length < 10) return state;
      s.deck = recommendedDeck(s, 10);
      log(s, '一键整理出战牌组：已选出 10 张适合当前角色的技能。');
      return s;
    }
    if (action.operation === 'discardGroup') {
      if (s.phase !== 'hub') return state;
      const key = String(action.key || '');
      if (!CARDS[cardBaseKey(key)] || key.endsWith('~gear')) return state;
      const ownedCount = s.cardLibrary.filter(cardKey => cardKey === key).length;
      const activeCount = s.deck.filter(cardKey => cardKey === key).length;
      if (!ownedCount || s.deck.length - activeCount < 10) return state;
      s.cardLibrary = s.cardLibrary.filter(cardKey => cardKey !== key);
      s.deck = s.deck.filter(cardKey => cardKey !== key);
      s.unsecuredCards = (s.unsecuredCards || []).filter(cardKey => cardKey !== key);
      s.journeyCardDrops = (s.journeyCardDrops || []).filter(cardKey => cardKey !== key);
      if (!s.cardLibrary.some(cardKey => cardBaseKey(cardKey) === cardBaseKey(key))) {
        s.journeyNewCards = (s.journeyNewCards || []).filter(baseKey => baseKey !== cardBaseKey(key));
      }
      log(s, `永久丢弃了全部 ${ownedCount} 张 Lv.${cardRank(key)}「${card(key).name}」。`);
      return s;
    }
    const key = String(action.key || '');
    if (!CARDS[cardBaseKey(key)] || key.endsWith('~gear')) return state;
    const ownedCount = s.cardLibrary.filter(cardKey => cardKey === key).length;
    const activeCount = s.deck.filter(cardKey => cardKey === key).length;
    if (action.operation === 'activate') {
      if (activeCount >= ownedCount) return state;
      s.deck.push(key);
      log(s, `「${card(key).name}」加入出战牌组。`);
    } else if (action.operation === 'bench') {
      if (s.deck.length <= 10 || activeCount <= 0) return state;
      s.deck.splice(s.deck.findIndex(cardKey => cardKey === key), 1);
      log(s, `「${card(key).name}」移至候补。`);
    } else if (action.operation === 'discard') {
      if (s.phase !== 'hub') return state;
      const hasBenchedCopy = ownedCount > activeCount;
      if (!hasBenchedCopy && (activeCount <= 0 || s.deck.length <= 10)) return state;
      const libraryIndex = s.cardLibrary.findIndex(cardKey => cardKey === key);
      if (libraryIndex < 0) return state;
      s.cardLibrary.splice(libraryIndex, 1);
      if (!hasBenchedCopy) s.deck.splice(s.deck.findIndex(cardKey => cardKey === key), 1);
      const removeTrackedCopy = list => {
        const next = [...(list || [])];
        const index = next.findIndex(cardKey => cardKey === key);
        if (index >= 0) next.splice(index, 1);
        return next;
      };
      s.unsecuredCards = removeTrackedCopy(s.unsecuredCards);
      s.journeyCardDrops = removeTrackedCopy(s.journeyCardDrops);
      if (!s.cardLibrary.some(cardKey => cardBaseKey(cardKey) === cardBaseKey(key))) {
        s.journeyNewCards = (s.journeyNewCards || []).filter(baseKey => baseKey !== cardBaseKey(key));
      }
      log(s, `永久丢弃了 Lv.${cardRank(key)}「${card(key).name}」。`);
    } else return state;
    return s;
  }
  if (action.type === 'leaveLoadout' && s.phase === 'loadout') {
    s.phase = 'map'; s.mysteryResult = null;
    continueSideScenes(s, 'loadout');
    return s;
  }
  if (action.type === 'mainStoryContinue' && s.phase === 'mainStory') {
    const scene = s.mainStory;
    if (!scene || !MAIN_STORY[scene.stage] || !['intro', 'boss', 'ending'].includes(scene.beat)) return state;
    s.mainStory = null;
    if (scene.beat === 'intro') {
      s.phase = 'map';
      continueSideScenes(s, 'story');
    } else if (scene.beat === 'boss') {
      beginBattle(s);
    } else {
      const specializationReward = mainStorySpecializationReward(scene.stage, scene.beat);
      s.specializationStoryRewards ||= [];
      if (specializationReward && !s.specializationStoryRewards.includes(scene.stage)) {
        s.specializationStoryRewards.push(scene.stage);
        applySideEffect(s, { type: 'specializationPoint', value: specializationReward });
      }
      if (scene.stage === ENEMIES.length - 1 && scene.variant !== 'fragmented' && !s.namelessClues.includes(MAIN_STORY[scene.stage].clue)) s.namelessClues.push(MAIN_STORY[scene.stage].clue);
      s.stage = Math.min(scene.stage + 1, ENEMIES.length - 1);
      s.phase = 'hub';
      s.hp = s.maxHp;
      log(s, scene.stage === ENEMIES.length - 1
        ? scene.variant === 'fragmented' ? '终点站留下了一盏灯，等待缺失的名字回来。' : '终点站的灯全部亮起，阁楼客房第一次有了名字。'
        : `下一站「${CHAPTERS[s.stage].name}」已经解锁。`);
    }
    return s;
  }
  if (CHEATS_ENABLED && action.type === 'debug') {
    if (action.operation === 'gold') {
      s.gold = Math.min(100000, s.gold + 1000);
      log(s, '测试面板：获得 1000 枚旅币。');
    } else if (action.operation === 'level') {
      if (s.level >= MAX_PLAYER_LEVEL) return state;
      s.level++; s.xp = 0; s.nextXp = 45 + (s.level - 1) * 20; s.maxHp += 6; s.hp = s.maxHp;
      log(s, `测试面板：角色提升至 ${s.level} 级。`);
    } else if (action.operation === 'heal') {
      s.hp = s.maxHp; s.energy = 3; s.block = 0; s.weak = 0;
      log(s, '测试面板：生命与战斗资源已恢复。');
    } else if (action.operation === 'unlockWorkshop') {
      s.workshopUnlocked = true;
      log(s, '测试面板：房车工坊已解锁。');
    } else if (action.operation === 'unlockGuests') {
      s.clears ||= Array(ENEMIES.length).fill(0);
      s.clears[0] = Math.max(s.clears[0] || 0, 2);
      s.unlocked = Math.max(s.unlocked, Math.min(1, ENEMIES.length - 1));
      ensureCriticalSideQuests(s);
      log(s, '测试面板：客人房间已解锁。');
    } else if (action.operation === 'unlock') {
      s.unlocked = ENEMIES.length - 1;
      log(s, '测试面板：全部章节已解锁。');
    } else if (action.operation === 'item') {
      if (!ITEMS[action.base]) return state;
      const item = rollItem(s, action.base, true);
      if (Number.isInteger(action.itemLevel) && action.itemLevel >= 1 && action.itemLevel <= 60) {
        item.itemLevel = action.itemLevel;
        const affixCount = RARITIES.find(rarity => rarity.name === item.rarity)?.affixes || 0;
        item.affixes = rollAffixes(s, affixCount, item.itemLevel);
        if (item.skill) item.skillLevel = Math.min(10, 1 + Math.floor((item.itemLevel - 1) / 12) + (affixCount >= 3 ? 1 : 0));
      }
      s.inventory.unshift(item); s.lastLoot = item.id; s.lastLoots = [item.id];
      log(s, `测试面板：获得 Lv.${item.itemLevel}「${itemName(item)}」。`);
    } else if (action.operation === 'legendaryItem') {
      if (!ITEMS[action.base]) return state;
      const item = rollItem(s, action.base, true);
      item.itemLevel = Number.isInteger(action.itemLevel) && action.itemLevel >= 1 && action.itemLevel <= 60 ? action.itemLevel : item.itemLevel;
      item.rarity = '传奇';
      item.affixes = rollAffixes(s, 4, item.itemLevel);
      const unlockedSkills = REWARDS.filter(key => (SKILL_UNLOCKS[key] ?? 0) <= s.stage);
      const preferredSkills = unlockedSkills.filter(key => CHARACTERS[s.character]?.schools.includes(CARDS[key].school));
      item.skill = ITEMS[action.base].skill || preferredSkills[0] || unlockedSkills[0] || REWARDS[0];
      item.skillLevel = Math.min(10, 2 + Math.floor((item.itemLevel - 1) / 12));
      s.inventory.unshift(item); s.lastLoot = item.id; s.lastLoots = [item.id];
      log(s, `测试面板：获得传奇极限测试装备 Lv.${item.itemLevel}「${itemName(item)}」。`);
    } else if (action.operation === 'card') {
      if (!CARDS[action.key]) return state;
      if (Number.isInteger(action.rank) && action.rank >= 1 && action.rank <= 10) {
        const index = s.cardLibrary.findIndex(key => cardBaseKey(key) === action.key);
        const ranked = rankedCardKey(action.key, index >= 0 ? Math.max(cardRank(s.cardLibrary[index]), action.rank) : action.rank);
        if (index >= 0) {
          const oldKey = s.cardLibrary[index];
          s.cardLibrary[index] = ranked;
          const activeIndex = s.deck.findIndex(key => key === oldKey);
          if (activeIndex >= 0) s.deck[activeIndex] = ranked;
        } else s.cardLibrary.push(ranked);
        log(s, `测试面板：「${card(ranked).name}」已设为 Lv.${cardRank(ranked)}。`);
      } else {
        const ranked = rankedCardKey(action.key, Math.min(10, 1 + Math.floor(s.stage / 2)));
        s.cardLibrary.push(ranked);
        log(s, `测试面板：「${card(ranked).name}」加入候补。`);
      }
    } else if (action.operation === 'upgradeCards') {
      let count = 0;
      const upgrades = new Map();
      s.cardLibrary = s.cardLibrary.map(key => {
        if (cardRank(key) >= 10) return key;
        count++; const upgraded = upgradeCardKey(key); upgrades.set(key, upgraded); return upgraded;
      });
      s.deck = s.deck.map(key => upgrades.get(key) || key);
      if (!count) return state;
      log(s, `测试面板：强化了 ${count} 张技能牌。`);
    } else if (action.operation === 'jump') {
      const stage = action.stage;
      const row = action.row;
      if (!Number.isInteger(stage) || stage < 0 || stage >= ENEMIES.length || ![-1, 9, 19, 29, 39, 48].includes(row)) return state;
      const nodes = chapterMap(stage, s.mapSeed);
      const node = row < 0 ? null : row === 48 ? nodes.find(candidate => candidate.row === 48) : nodes.find(candidate => candidate.id === `c${stage}r${row}checkpoint`);
      if (row >= 0 && !node) return state;
      s.unlocked = Math.max(s.unlocked, stage); s.stage = stage; s.phase = 'map'; s.mapRow = row;
      s.currentNode = node?.id || null; s.visited = node ? [node.id] : []; s.unsecuredLoot = []; s.unsecuredCards = []; s.journeyCardDrops = [];
      s.chapterCheckpoints ||= Array(ENEMIES.length).fill(-1);
      if (row < 0) s.chapterCheckpoints[stage] = -1;
      else if (row < 48) s.chapterCheckpoints[stage] = row;
      else if (s.chapterCheckpoints[stage] < 0) s.chapterCheckpoints[stage] = 39;
      s.checkpointRow = s.chapterCheckpoints[stage]; s.hp = s.maxHp; s.elite = false; s.bossFight = false;
      log(s, `测试面板：跳转至「${CHAPTERS[stage].name}」${row < 0 ? '起点' : row === 48 ? '首领前' : `第 ${row + 1} 步路标`}。`);
    } else if (action.operation === 'mainStory') {
      const stage = action.stage;
      const beat = action.beat;
      if (!Number.isInteger(stage) || !MAIN_STORY[stage] || !['intro', 'boss', 'ending'].includes(beat)) return state;
      s.unlocked = Math.max(s.unlocked, stage);
      s.stage = stage;
      s.mainStorySeen ||= [];
      const id = mainStoryId(stage, beat);
      if (!s.mainStorySeen.includes(id)) s.mainStorySeen.push(id);
      let variant = null;
      if (beat === 'ending' && stage === ENEMIES.length - 1) variant = finalStoryVariant(s);
      s.mainStory = { stage, beat, variant };
      s.sideStory = null;
      s.pendingScene = null;
      s.phase = 'mainStory';
      s.mapRow = beat === 'boss' ? MAP_STEPS - 1 : -1;
      s.currentNode = beat === 'boss' ? `c${stage}boss` : null;
      s.visited = s.currentNode ? [s.currentNode] : [];
      s.bossFight = beat === 'boss';
      s.elite = false;
      s.foe = 0;
      log(s, `测试面板：打开第 ${stage + 1} 章主线「${beat}」。`);
    } else if (action.operation === 'mainClues') {
      s.namelessClues ||= [];
      for (const clue of [...MAIN_STORY.slice(0, 5).map(story => story.clue), 'blankTag', 'ledgerBack']) {
        if (!s.namelessClues.includes(clue)) s.namelessClues.push(clue);
      }
      log(s, '测试面板：已补齐终章主线与隐藏支线线索。');
    } else if (action.operation === 'magicHouse') {
      const station = MYSTERY_STATIONS.find(candidate => candidate.type === action.result);
      if (!station) return state;
      s.mainStory = null;
      s.sideStory = null;
      s.pendingScene = null;
      s.mysteryResult = station.type;
      s.lastMysteryResult = station.type;
      s.phase = station.type;
      s.blackMarketOffers = station.type === 'blackMarket' ? buildBlackMarketOffers(s) : null;
      log(s, `测试面板：直接进入「${station.label}」。`);
    } else if (action.operation === 'sideStory') {
      const story = SIDE_STORIES[action.id];
      if (!story) return state;
      const stage = story.chapters?.[0] ?? s.stage;
      s.unlocked = Math.max(s.unlocked, stage);
      s.stage = stage;
      s.mapRow = -1;
      s.currentNode = null;
      s.visited = [];
      s.checkpointRow = -1;
      s.sideStory = { id: action.id };
      s.mainStory = null;
      s.sideStorySeen ||= [];
      if (!s.sideStorySeen.includes(action.id)) s.sideStorySeen.push(action.id);
      s.pendingScene = null;
      s.mysteryResult = null;
      s.phase = 'sideStory';
      log(s, `测试面板：立即触发支线「${story.name}」。`);
    } else if (action.operation === 'sideSteps') {
      s.stepsTraveled += 10;
      const resolved = resolveDueSidePromises(s, 'step');
      log(s, resolved ? '测试面板：承诺步数推进 10，已有支线可以兑现。' : '测试面板：承诺步数推进 10。');
    } else if (action.operation === 'sideBattles') {
      s.victories += 2;
      const resolved = resolveDueSidePromises(s, 'battle');
      log(s, resolved ? '测试面板：承诺胜场推进 2，已有支线可以兑现。' : '测试面板：承诺胜场推进 2。');
    } else if (action.operation === 'sideCritical') {
      ensureCriticalSideQuests(s);
      const entry = Object.entries(s.criticalSideQuests).find(([, progress]) => progress.status === 'active');
      if (!entry) {
        log(s, '测试面板：当前没有正在推进的关键委托。');
      } else {
        const [id, progress] = entry;
        progress.progress = progress.target;
        progress.status = 'ready';
        const opened = showReadyCriticalSideQuest(s);
        log(s, opened ? `测试面板：关键委托「${SIDE_STORIES[CRITICAL_SIDE_QUESTS[id].storyId].name}」已完成。` : '测试面板：关键委托已满足，等待安全节点兑现。');
      }
    } else if (action.operation === 'sideExchange') {
      const promise = s.sidePromises?.shift();
      if (!promise) {
        log(s, '测试面板：当前没有可以兑换的支线承诺。请先触发支线并选择延迟分支。');
      } else {
        const scene = buildSideResolveScene(s, promise);
        s.sideStory = null;
        if (scene.kind === 'turnin_cards') {
          const cardPool = Object.keys(CARDS).filter(key => key !== 'doubt' && (!scene.school || CARDS[key].school === scene.school));
          const available = sideCardTurnInCandidates(s, { school: scene.school }).filter(item => !item.active).length;
          const missing = Math.max(0, scene.count - available);
          scene.debugAddedCards = [];
          for (let index = 0; index < missing; index++) {
            const key = cardPool[index % cardPool.length] || 'quick';
            const ranked = rankedCardKey(key, Math.max(1, Math.min(10, 1 + s.stage)));
            s.cardLibrary.push(ranked);
            scene.debugAddedCards.push(ranked);
          }
          s.pendingScene = scene;
          s.phase = 'sideResolve';
          log(s, `测试面板：已补齐 ${missing} 张候补技能并打开正常兑换面板。`);
        } else if (scene.kind === 'turnin_gear') {
          const gearPool = CHAPTER_LOOT[s.stage]?.filter(base => ITEMS[base]) || Object.keys(ITEMS);
          const available = sideGearTurnInCandidates(s).length;
          const missing = Math.max(0, scene.count - available);
          scene.debugAddedGearIds = [];
          for (let index = 0; index < missing; index++) {
            const item = rollItem(s, gearPool[index % gearPool.length], true);
            s.inventory.unshift(item);
            scene.debugAddedGearIds.push(item.id);
          }
          s.pendingScene = scene;
          s.phase = 'sideResolve';
          log(s, `测试面板：已补齐 ${missing} 件未装备物品并打开正常兑换面板。`);
        } else {
          s.pendingScene = scene;
          s.phase = 'sideResolve';
          if (scene.kind === 'shop') {
            const requiredGold = Math.max(0, ...scene.goods.map(good => good.cost));
            const addedGold = Math.max(0, requiredGold - s.gold);
            s.gold += addedGold;
            log(s, `测试面板：已补齐 ${addedGold} 枚旅币并打开支线商店。`);
          } else log(s, `测试面板：已打开支线「${SIDE_STORIES[promise.id]?.name || promise.id}」的正常奖励框。`);
        }
      }
    } else if (action.operation === 'sideClear') {
      s.sideStory = null;
      s.pendingScene = null;
      s.sidePromises = [];
      s.sideStorySeen = [];
      s.sideStoryQueue = [];
      s.sideChapterTriggers = Array(ENEMIES.length).fill(0);
      s.criticalSideQuests = criticalQuestDefaults();
      s.sideBuffs = [];
      s.sideBattleFirstStrike = 0;
      s.namelessClues = [];
      ensureCriticalSideQuests(s);
      if (['sideStory', 'sideResolve'].includes(s.phase)) s.phase = s.mapRow >= 0 ? 'map' : 'hub';
      log(s, '测试面板：已清理当前支线、承诺与支线祝福。');
    } else return state;
    return s;
  }
  if (action.type === 'tutorialDone' && s.phase === 'combat') { s.tutorialDone = true; return s; }
  if (action.type === 'depart' && s.phase === 'hub') {
    if (!Number.isInteger(action.stage) || action.stage < 0 || action.stage > s.unlocked) return state;
    const latestCheckpoint = s.chapterCheckpoints?.[action.stage] ?? -1;
    const requestedRow = action.row ?? latestCheckpoint;
    const checkpoint = requestedRow === -1 || (CHECKPOINT_STEPS.includes(requestedRow + 1) && requestedRow <= latestCheckpoint) ? requestedRow : latestCheckpoint;
    const checkpointNode = checkpoint >= 0 ? `c${action.stage}r${checkpoint}checkpoint` : null;
    s.stage = action.stage; s.phase = 'map'; s.mapRow = checkpoint; s.currentNode = checkpointNode; s.visited = checkpointNode ? [checkpointNode] : []; s.checkpointRow = checkpoint; s.unsecuredLoot = []; s.unsecuredCards = []; s.journeyCardDrops = []; s.journeyNewItems = []; s.journeyNewCards = []; s.lastLoot = null; s.lastLoots = []; s.lastLevelUp = null; s.mysteryResult = null; s.blackMarketOffers = null;
    s.elite = false; s.bossFight = false;
    log(s, checkpointNode ? `通过第 ${checkpoint + 1} 步夜程路标返回「${CHAPTERS[s.stage].name}」。` : `日落前抵达「${CHAPTERS[s.stage].name}」，今晚的梦境路线已经出现。`);
    ensureCriticalSideQuests(s);
    scheduleGuaranteedSideStory(s);
    if (checkpoint < 0 && s.clears[s.stage] === 0) queueMainStory(s, s.stage, 'intro');
    else continueSideScenes(s, 'depart');
    return s;
  }
  if (action.type === 'returnHub' && s.phase === 'map') {
    let lostItemName = null;
    let lostCardName = null;
    const atCheckpoint = s.mapRow === s.checkpointRow;
    const equipped = new Set(Object.values(s.equipment).filter(Boolean));
    const itemCandidates = (s.unsecuredLoot || []).filter(id => itemFor(s, id) && !equipped.has(id)).map(id => ({ type: 'item', id }));
    const cardCandidates = (s.unsecuredCards || []).map((key, index) => ({ type: 'card', key, index }));
    const candidates = [...itemCandidates, ...cardCandidates];
    if (!atCheckpoint && candidates.length) {
      const lost = candidates[Math.floor(random(s) * candidates.length)];
      if (lost.type === 'item') {
        const lostItem = itemFor(s, lost.id);
        lostItemName = itemName(lostItem);
        s.inventory = s.inventory.filter(item => item.id !== lost.id);
        s.journeyNewItems = (s.journeyNewItems || []).filter(id => id !== lost.id);
        if (s.lastLoot === lost.id) s.lastLoot = null;
        s.lastLoots = (s.lastLoots || []).filter(id => id !== lost.id);
      } else {
        const libraryIndex = s.cardLibrary.findIndex(key => key === lost.key);
        if (libraryIndex >= 0) s.cardLibrary.splice(libraryIndex, 1);
        const ownedCount = s.cardLibrary.filter(key => key === lost.key).length;
        const activeMatches = s.deck.map((key, index) => ({ key, index })).filter(entry => entry.key === lost.key);
        if (activeMatches.length > ownedCount) s.deck.splice(activeMatches.at(-1).index, 1);
        const dropIndex = (s.journeyCardDrops || []).findIndex(key => key === lost.key);
        if (dropIndex >= 0) s.journeyCardDrops.splice(dropIndex, 1);
        lostCardName = `${card(lost.key).name} Lv.${cardRank(lost.key)}`;
      }
    }
    s.phase = 'hub';
    s.hp = s.maxHp;
    s.mapRow = -1; s.currentNode = null; s.visited = []; s.checkpointRow = -1; s.mysteryResult = null; s.blackMarketOffers = null;
    s.unsecuredLoot = []; s.unsecuredCards = [];
    s.elite = false; s.bossFight = false;
    log(s, '收起梦境地图，回到亮着灯的房车。');
    if (lostItemName) log(s, `匆忙撤离梦境，遗失了本段夜程获得的「${lostItemName}」。`);
    if (lostCardName) log(s, `匆忙撤离梦境，遗失了本段夜程获得的技能「${lostCardName}」。`);
    return s;
  }
  if (action.type === 'auto' && s.phase === 'combat' && s.battleMode === 'auto') {
    const index = chooseAutoCard(s);
    return transition(s, index >= 0 ? { type: 'play', index } : { type: 'end' });
  }
  if (action.type === 'node' && s.phase === 'map') {
    const nodes = chapterMap(s.stage, s.mapSeed);
    const node = nodes.find(item => item.id === action.id);
    const previous = nodes.find(item => item.id === s.currentNode);
    const available = s.mapRow < 0 ? nodes.filter(item => item.row === 0).map(item => item.id) : (previous?.links || []);
    if (!node || !available.includes(node.id) || s.visited.includes(node.id)) return state;
    s.currentNode = node.id; s.mapRow = node.row; s.visited.push(node.id); s.stepsTraveled++; s.elite = node.type === 'elite'; s.bossFight = node.type === 'boss';
    scheduleGuaranteedSideStory(s);
    const encounters = ENCOUNTERS[s.stage] || [];
    const encounterSeed = (s.mapSeed ^ Math.imul(node.row + 1, 2654435761) ^ Math.imul(Math.round(node.x), 2246822519)) >>> 0;
    const typedPool = encounters.map((enemy, index) => ({ enemy, index })).filter(entry => s.elite ? entry.enemy.eliteOnly : !entry.enemy.eliteOnly);
    const encounterPool = typedPool.length ? typedPool : encounters.map((enemy, index) => ({ enemy, index }));
    const guaranteedFamily = guaranteedCriticalEnemyFamily(s, encounterPool, node);
    const guaranteedPool = guaranteedFamily ? encounterPool.filter(entry => enemyFamily(entry.enemy) === guaranteedFamily) : [];
    const selectedPool = guaranteedPool.length ? guaranteedPool : encounterPool;
    s.foe = s.bossFight ? 0 : selectedPool[encounterSeed % Math.max(1, selectedPool.length)]?.index || 0;
    if (['battle', 'elite', 'boss'].includes(node.type)) {
      if (node.type === 'boss' && s.clears[s.stage] === 0 && queueMainStory(s, s.stage, 'boss')) return s;
      beginBattle(s);
      return s;
    }
    if (node.type === 'checkpoint') {
      if (node.row + 1 === 20) s.workshopUnlocked = true;
      s.phase = 'checkpoint';
      log(s, `抵达第 ${node.row + 1} 步夜程路标，房车在梦境边缘停靠。`);
      return s;
    }
    if (node.type === 'mystery') {
      const remaining = magicHouseCooldownRemaining(s, node.id);
      if (remaining > 0) {
        s.phase = 'map';
        log(s, `命运魔法屋仍在重新洗牌，再走 ${remaining} 步后可以抽取。`);
        return s;
      }
      const marketRanks = blackMarketCardRanks(node.row);
      const minimumBlackMarketGold = Math.min(
        blackMarketCardPrice(s.stage, marketRanks.random, 'randomCard'),
        blackMarketCardPrice(s.stage, marketRanks.shown, 'card'),
      );
      const stationPool = MYSTERY_STATIONS.filter(station => station.type !== s.lastMysteryResult && (station.type !== 'blackMarket' || s.gold >= minimumBlackMarketGold));
      let roll = random(s) * stationPool.reduce((sum, station) => sum + station.weight, 0);
      const station = stationPool.find(candidate => (roll -= candidate.weight) < 0) || stationPool[0];
      s.mysteryResult = station.type;
      s.lastMysteryResult = station.type;
      s.phase = 'mystery';
      log(s, '未知路标开始转动，沿途际遇即将揭晓。');
      return s;
    }
    if (maybeStartSideStory(s)) return s;
    s.phase = 'event'; log(s, '岔路深处传来杯碟与旅币碰撞的声音。'); return s;
  }
  if (action.type === 'mystery' && s.phase === 'mystery') {
    if (!MYSTERY_STATIONS.some(station => station.type === s.mysteryResult)) return state;
    s.magicHouseCooldowns ||= {};
    if (s.currentNode) s.magicHouseCooldowns[magicHouseCooldownKey(s, s.currentNode)] = s.stepsTraveled + MEMORY_COOLDOWN_STEPS;
    s.phase = s.mysteryResult;
    if (s.phase === 'camp') log(s, '抽中了亮灯休息站。');
    if (s.phase === 'memory') log(s, '抽中了整理回忆站，可以合成同名同等级技能。');
    if (s.phase === 'loadout') log(s, '抽中了牌组整备站，可以调整出战与候补技能。');
    if (s.phase === 'blackMarket') {
      s.blackMarketOffers = buildBlackMarketOffers(s);
      log(s, '抽中了夜路黑市，三件只在今晚出现的藏品已经摆上柜台。');
    }
    if (s.phase === 'event') {
      if (maybeStartSideStory(s)) return s;
      log(s, '抽中了沿途事件，岔路深处传来杯碟声。');
    }
    if (s.phase === 'negative') log(s, '抽中了失序路段，梦境正在收取通行代价。');
    return s;
  }
  if (action.type === 'sideStoryChoice' && s.phase === 'sideStory') {
    const story = SIDE_STORIES[s.sideStory?.id];
    const branch = story?.branches?.[action.choice];
    if (!story || !branch) return state;
    if (branch.log) log(s, branch.log);
    if (branch.effect) applySideEffect(s, branch.effect);
    if (branch.promise) addSidePromise(s, s.sideStory.id, action.choice, branch.promise);
    s.sideStory = null;
    s.mysteryResult = null;
    s.phase = 'map';
    continueSideScenes(s, 'choice');
    return s;
  }
  if (action.type === 'sideResolveLeave' && s.phase === 'sideResolve') {
    if (s.pendingScene?.promise?.criticalQuest) return state;
    s.pendingScene = null;
    s.phase = 'map';
    continueSideScenes(s, 'leave');
    return s;
  }
  if (action.type === 'prepareSideShop' && s.phase === 'sideResolve') {
    const scene = s.pendingScene;
    if (!scene || scene.kind !== 'shop') return state;
    const gear = scene.goods?.find(good => good.kind === 'gear');
    if (!gear || gear.item) return state;
    const bases = gear.bases?.filter(base => ITEMS[base])?.length ? gear.bases.filter(base => ITEMS[base]) : CHAPTER_LOOT[s.stage];
    gear.item = rollItem(s, bases[Math.floor(random(s) * bases.length)], true, '稀有');
    gear.label = itemName(gear.item);
    return s;
  }
  if (action.type === 'sideResolveClaim' && s.phase === 'sideResolve') {
    const scene = s.pendingScene;
    const promise = scene?.promise;
    if (!scene || !promise || scene.kind !== 'reward') return state;
    if (promise.type === 'specializationReset') applySideEffect(s, { type: 'specializationReset' });
    else if (promise.type === 'cardClue' && CARDS[promise.key]) addCardReward(s, promise.key, skillRewardRank(s, promise.key) + (promise.rankBonus || 0));
    else if (promise.type === 'card' && CARDS[promise.key]) addCardReward(s, promise.key, skillRewardRank(s, promise.key) + (promise.rankBonus || 0));
    else if (promise.type === 'gear') addGearReward(s, promise.bases, true);
    else if (promise.type === 'buff' && promise.buff) applySideEffect(s, { type: 'buff', ...promise.buff });
    else if (promise.type === 'clue') {
      s.namelessClues ||= [];
      if (promise.clue && !s.namelessClues.includes(promise.clue)) s.namelessClues.push(promise.clue);
      log(s, '登记簿最后一页浮现出一角，但名字仍然看不清。');
    } else return state;
    if (promise.clue) {
      s.namelessClues ||= [];
      if (!s.namelessClues.includes(promise.clue)) s.namelessClues.push(promise.clue);
    }
    if (promise.criticalQuest && s.criticalSideQuests?.[promise.criticalQuest]) {
      s.criticalSideQuests[promise.criticalQuest].status = 'complete';
      ensureCriticalSideQuests(s);
      log(s, `长期委托「${SIDE_STORIES[scene.storyId]?.name || scene.title}」已经完成。`);
    }
    s.pendingScene = null;
    s.phase = 'map';
    const hiddenEndingReady = promise.criticalQuest === 'ledgerBackTrail' && s.clears[ENEMIES.length - 1] > 0 && ['blankTag', 'ledgerBack'].every(clue => s.namelessClues.includes(clue));
    if (hiddenEndingReady) {
      s.mainStory = { stage: ENEMIES.length - 1, beat: 'ending', variant: 'hidden' };
      s.phase = 'mainStory';
      log(s, '登记簿补全后，终点站把缺失的清晨重新送回房车。');
    } else continueSideScenes(s, 'claim');
    return s;
  }
  if (action.type === 'sideShopBuy' && s.phase === 'sideResolve') {
    const scene = s.pendingScene;
    const good = scene?.goods?.find(item => item.id === action.id);
    if (!scene || scene.kind !== 'shop' || !good) return state;
    if (s.gold < good.cost) {
      log(s, '摊主看了看你的旅币，又笑着合上抽屉：“今晚先记在风里，下次有缘再见。”');
      return s;
    }
    s.gold -= good.cost;
    if (good.kind === 'gear') {
      const acquired = good.item ? addGearRewardItem(s, good.item) : addGearReward(s, good.bases, true);
      s.directEquipLootIds = [acquired.id];
    }
    else if (good.kind === 'card') addCardReward(s, good.key, skillRewardRank(s, good.key) + (good.rankBonus || 0));
    else if (good.kind === 'buff') applySideEffect(s, good.effect);
    else return state;
    log(s, `花费 ${good.cost} 枚旅币，带走了「${good.label}」。`);
    s.pendingScene = null;
    s.phase = 'map';
    continueSideScenes(s, 'shop');
    return s;
  }
  if (action.type === 'sideTurnIn' && s.phase === 'sideResolve') {
    const scene = s.pendingScene;
    if (!scene || !['turnin_cards', 'turnin_gear'].includes(scene.kind)) return state;
    const promise = scene.promise || {};
    if (scene.kind === 'turnin_cards') {
      const indexes = Array.isArray(action.indexes) ? [...new Set(action.indexes)] : [];
      if (indexes.length !== scene.count) return state;
      const candidates = sideCardTurnInCandidates(s, { minRank: 1, school: scene.school });
      if (!indexes.every(index => candidates.some(item => item.index === index))) return state;
      const selected = indexes.map(index => candidates.find(item => item.index === index));
      const activeSpent = selected.filter(item => item.active).length;
      if (activeSpent > 0 && s.deck.length - activeSpent < 10) return state;
      const removed = removeCardSelections(s, selected);
      if (!removed) return state;
      const rewardKey = scene.key || promise.key || removed.map(cardBaseKey).find(key => CARDS[key]) || 'riposte';
      addCardReward(s, rewardKey, skillRewardRank(s, rewardKey) + (scene.rankBonus || promise.rankBonus || 2));
      log(s, `交出 ${removed.length} 段回忆，换回一张更清晰的梦境技能。`);
    } else {
      const ids = Array.isArray(action.ids) ? [...new Set(action.ids)] : [];
      if (ids.length !== scene.count) return state;
      const candidates = sideGearTurnInCandidates(s);
      if (!ids.every(id => candidates.some(item => item.id === id))) return state;
      const removed = removeGearByIds(s, ids);
      if (!removed) return state;
      addGearReward(s, scene.bases || promise.bases, true);
      log(s, `交出 ${removed.length} 件旧物，换回一件更响亮的愿望。`);
    }
    s.pendingScene = null;
    s.phase = 'map';
    continueSideScenes(s, 'turnin');
    return s;
  }
  if (action.type === 'equipAcquired' && !['combat', 'reward', 'lost'].includes(s.phase)) {
    if (action.kind === 'card') {
      const key = String(action.key || '');
      const ownedCount = s.cardLibrary.filter(cardKey => cardKey === key).length;
      const activeCount = s.deck.filter(cardKey => cardKey === key).length;
      if (!(s.unsecuredCards || []).includes(key) || activeCount >= ownedCount) return state;
      s.deck.push(key);
      s.unsecuredCards.splice(s.unsecuredCards.indexOf(key), 1);
      log(s, `将新技能「${card(key).name}」加入出战牌组。`);
      return s;
    }
    if (action.kind === 'gear') {
      const instance = itemFor(s, action.key);
      const item = instance && ITEMS[instance.base];
      if (!item || !(s.unsecuredLoot || []).includes(instance.id)) return state;
      s.equipment[item.slot] = instance.id;
      log(s, `已装备新获得的「${itemName(instance)}」。`);
      return s;
    }
    return state;
  }
  if (action.type === 'equip' && s.phase === 'hub') {
    const instance = itemFor(s, action.key);
    const item = instance && ITEMS[instance.base];
    if (!item) return state;
    s.equipment[item.slot] = instance.id;
    log(s, `已装备「${itemName(instance)}」。`);
    return s;
  }
  if (action.type === 'equipBest' && s.phase === 'hub') {
    let changed = 0;
    for (const slot of Object.keys(SLOT_LABELS)) {
      const current = itemFor(s, s.equipment[slot]);
      const candidates = s.inventory.filter(item => ITEMS[item.base]?.slot === slot);
      const strongest = Math.max(0, ...candidates.map(itemScore));
      const comparable = candidates.filter(item => itemScore(item) >= strongest * .9);
      const best = comparable.sort((a, b) => itemBuildFit(s, b) - itemBuildFit(s, a) || itemScore(b) - itemScore(a) || (b.itemLevel || 1) - (a.itemLevel || 1))[0];
      if (!best || best.id === current?.id) continue;
      s.equipment[slot] = best.id;
      changed++;
    }
    if (!changed) return state;
    log(s, `一键换上了 ${changed} 件更适合当前角色与专精的装备。`);
    return s;
  }
  if (action.type === 'reroll' && s.phase === 'hub') {
    const instance = itemFor(s, action.key);
    if (!instance) return state;
    const cost = rerollCost(instance, s.facilities.workshop);
    if (s.gold < cost) return state;
    const affixCount = RARITIES.find(rarity => rarity.name === instance.rarity)?.affixes || 0;
    if (!affixCount) return state;
    s.gold -= cost;
    instance.affixes = rollAffixes(s, affixCount, instance.itemLevel);
    log(s, `花费 ${cost} 枚旅币，为「${itemName(instance)}」重抽了属性。`);
    return s;
  }
  if (action.type === 'upgradeItem' && s.phase === 'hub') {
    const instance = itemFor(s, action.key);
    const cost = itemUpgradeCost(instance);
    if (!instance || cost === null || s.gold < cost) return state;
    s.gold -= cost;
    instance.itemLevel = instance.itemLevel < 21 ? 21 : 41;
    const affixCount = RARITIES.find(rarity => rarity.name === instance.rarity)?.affixes || 0;
    instance.affixes = rollAffixes(s, affixCount, instance.itemLevel);
    if (instance.skill) instance.skillLevel = Math.min(10, 1 + Math.floor((instance.itemLevel - 1) / 12) + (affixCount >= 3 ? 1 : 0));
    log(s, `花费 ${cost} 枚旅币，将「${itemName(instance)}」升为${itemTier(instance).name}。`);
    return s;
  }
  if (action.type === 'salvage' && s.phase === 'hub') {
    const instance = itemFor(s, action.key);
    if (!instance || Object.values(s.equipment).includes(instance.id)) return state;
    const value = salvageValue(instance);
    s.inventory = s.inventory.filter(item => item.id !== instance.id);
    s.journeyNewItems = (s.journeyNewItems || []).filter(id => id !== instance.id);
    if (s.lastLoot === instance.id) s.lastLoot = null;
    s.lastLoots = (s.lastLoots || []).filter(id => id !== instance.id);
    s.gold += value;
    log(s, `拆解「${itemName(instance)}」，回收 ${value} 枚旅币。`);
    return s;
  }
  if (action.type === 'bulkSalvage' && s.phase === 'hub') {
    if (!Array.isArray(action.ids) || action.ids.length > 200 || action.ids.some(id => typeof id !== 'string')) return state;
    const requested = new Set(action.ids);
    const equipped = new Set(Object.values(s.equipment).filter(Boolean));
    const sold = s.inventory.filter(item => requested.has(item.id) && !equipped.has(item.id));
    if (!sold.length) return state;
    const soldIds = new Set(sold.map(item => item.id));
    const value = sold.reduce((sum, item) => sum + salvageValue(item), 0);
    s.inventory = s.inventory.filter(item => !soldIds.has(item.id));
    s.unsecuredLoot = (s.unsecuredLoot || []).filter(id => !soldIds.has(id));
    s.journeyNewItems = (s.journeyNewItems || []).filter(id => !soldIds.has(id));
    if (soldIds.has(s.lastLoot)) s.lastLoot = null;
    s.lastLoots = (s.lastLoots || []).filter(id => !soldIds.has(id));
    s.gold += value;
    log(s, `批量售卖 ${sold.length} 件装备，回收 ${value} 枚旅币。`);
    return s;
  }
  if (action.type === 'claimGuestReward' && s.phase === 'hub') {
    const stage = action.stage;
    if (!Number.isInteger(stage) || stage < 0 || stage >= GUESTS.length || s.clears[stage] < 3 || s.guestRewards[stage]) return state;
    const gift = storyItem(s, stage);
    s.inventory.unshift(gift); s.lastLoot = gift.id; s.lastLoots = [gift.id]; s.guestRewards[stage] = true;
    const guestName = stage === GUESTS.length - 1 && s.namelessClues.includes('registeredName') ? '朝安' : GUESTS[stage].name;
    log(s, `${guestName}完成入住故事，留下传奇纪念品「${itemName(gift)}」。`);
    return s;
  }
  if (action.type === 'upgradeFacility' && s.phase === 'hub') {
    if (!['kitchen', 'workshop', 'rooms'].includes(action.key)) return state;
    const level = s.facilities[action.key], cost = facilityCost(level);
    if (cost === null || s.gold < cost) return state;
    s.gold -= cost; s.facilities[action.key]++;
    if (action.key === 'rooms') { s.maxHp += 6; s.hp += 6; }
    const names = { kitchen: '暖灯厨房', workshop: '随车工坊', rooms: '旅客房间' };
    log(s, `${names[action.key]}升至 ${s.facilities[action.key]} 级。`);
    return s;
  }
  if (action.type === 'claimCommission' && s.phase === 'hub') {
    if (!['battles', 'steps', 'stories'].includes(action.key)) return state;
    const commission = commissionStatus(s, action.key);
    if (!commission || commission.value < commission.target) return state;
    s.gold += commission.reward; s.commissionClaims[action.key]++;
    log(s, `完成旅程委托，领取 ${commission.reward} 枚旅币。`);
    return s;
  }
  if (action.type === 'play' && s.phase === 'combat') {
    if (!Number.isInteger(action.index) || action.index < 0 || action.index >= s.hand.length) return state;
    const key = s.hand[action.index], c = card(key);
    if (c.cost > s.energy) return state;
    const breakdown = attackBreakdown(s, key);
    const consumedLucidCharge = c.damage ? s.lucidCharge || 0 : 0;
    const { bonuses, stats, sameSchool, chain, mode, alternating } = breakdown.context;
    s.hand.splice(action.index, 1); s.energy -= c.cost; s.played++;
    const gainedBlock = breakdown.gainedBlock || 0;
    s.block = breakdown.playerBlockAfter;
    if (c.nextBlock) s.nextBlock = (s.nextBlock || 0) + c.nextBlock;
    if (breakdown.tideReserve) s.nextBlock = (s.nextBlock || 0) + breakdown.tideReserve;
    let traitTriggered = false;
    let markGained = 0;
    if (c.mark) {
      markGained = cardMarkGain(s, c);
      if (s.character === 'uncle' && !s.traitUsed) {
        s.traitUsed = true;
        traitTriggered = true;
        draw(s, 1);
      }
      s.block += bonuses.markBlock || 0;
      if (traitTriggered) s.block += bonuses.firstMarkBlock || 0;
    }
    s.enemy.mark = breakdown.marksAfter;
    if (c.energy) s.energy += c.energy;
    const warmthBonus = breakdown.warmthSpent || 0;
    if (warmthBonus) {
      s.warmth = Math.max(0, s.warmth - warmthBonus);
      s.block += Math.floor(warmthBonus * (bonuses.warmthShieldPct || 0));
    }
    const missingHp = s.maxHp - s.hp;
    const healingRate = s.healingSuppression > 0 ? .5 : 1;
    const healingMultiplier = 1 + (bonuses.healingPct || 0) + (alternating ? bonuses.rhythmHealingPct || 0 : 0);
    const effectiveHealing = c.heal ? Math.max(1, Math.floor((c.heal + stats.healing + (sameSchool ? bonuses.chainHealing || 0 : 0)) * healingRate * healingMultiplier)) : 0;
    const healed = c.heal ? Math.min(effectiveHealing, missingHp) : 0;
    const overheal = Math.max(0, effectiveHealing - healed);
    let warmthGained = 0;
    if (c.heal) {
      s.hp += healed;
      s.block += bonuses.healingBlock || 0;
      if (alternating && mode === 'heal') s.block += (bonuses.rhythmBlock || 0) + stats.rhythmPower;
      const overflowRate = bonuses.drinkMastery ? 1 : Math.min(1, (bonuses.overflowBlockPct || 0) + stats.overflowBlock * .05);
      if (overheal) s.block += Math.floor(overheal * overflowRate);
      s.nextBlock = (s.nextBlock || 0) + Math.floor(s.maxHp * (bonuses.healingNextBlockPct || 0));
      if (s.character === 'gaigai') {
        warmthGained = Math.ceil(effectiveHealing / 3) + (bonuses.warmthGain || 0) + stats.warmthPower;
        s.warmth += warmthGained;
      }
      if (bonuses.drinkMastery && missingHp === 0 && !s.healDrawTriggered) {
        s.healDrawTriggered = true;
        draw(s, 1);
      }
    }
    if (c.cleanse) { s.healingSuppression = 0; s.weak = 0; }
    let selfDamage = 0;
    let lucidBonusDraw = 0;
    let lucidBonusEnergy = 0;
    if (c.self) {
      selfDamage = Math.max(1, Math.ceil(c.self * (1 - Math.min(.8, bonuses.selfDamageReductionPct || 0))));
      const floorHp = bonuses.lucidMastery ? 1 : 0;
      selfDamage = Math.min(selfDamage, Math.max(0, s.hp - floorHp));
      s.hp -= selfDamage;
      s.block += (bonuses.selfDamageBlock || 0) + stats.lucidGuard;
      if (bonuses.lucidMastery) s.lucidCharge = (s.lucidCharge || 0) + c.self * 3;
      if ((bonuses.lucidFocusRank || 0) >= 5 && !s.lucidFocusTriggered) {
        s.lucidFocusTriggered = true;
        lucidBonusDraw = bonuses.lucidFocusRank >= 15 ? 2 : 1;
        lucidBonusEnergy = bonuses.lucidFocusRank >= 10 ? 1 : 0;
        draw(s, lucidBonusDraw);
        s.energy += lucidBonusEnergy;
      }
    }
    const damage = breakdown.total;
    const weakpointDamage = breakdown.weakpoint;
    const absorbedDamage = Math.max(0, (state.enemy?.block || 0) - breakdown.enemyBlock);
    s.enemy.block = breakdown.enemyBlock;
    if (damage) {
      s.enemy.hp = Math.max(0, s.enemy.hp - damage);
      if (consumedLucidCharge) s.lucidCharge = Math.max(0, s.lucidCharge - consumedLucidCharge);
    }
    // Draw before discarding the played card to prevent a zero-cost card drawing itself.
    if (c.draw) draw(s, c.draw);
    let recoveredCount = 0;
    if (c.recycle && s.discard.length) {
      recoveredCount = Math.min(c.recycle, s.discard.length, Math.max(0, 9 - s.hand.length));
      if (recoveredCount) s.hand.push(...s.discard.splice(s.discard.length - recoveredCount, recoveredCount));
    }
    if (recoveredCount) {
      s.block += recoveredCount * ((bonuses.recycleBlock || 0) + stats.recycleGuard);
      if (bonuses.letterMastery && !s.recycleTriggered) {
        s.recycleTriggered = true;
        s.energy += 1;
        draw(s, 1);
      }
    }
    if (alternating && bonuses.rhythmMastery && s.rhythmTriggers < 2) {
      s.rhythmTriggers++;
      s.energy += 1;
    }
    if (bonuses.followMastery && sameSchool && chain % 3 === 0) s.energy += 1;
    if (c.damage && ((state.block || 0) + gainedBlock) > 0) s.block += bonuses.guardedAttackBlock || 0;
    s.lastCardSchool = c.school;
    s.schoolChain = chain;
    if (mode !== 'support') s.lastCardMode = mode;
    const effects = [];
    if (damage) effects.push(`造成 ${damage} 点伤害`);
    if (absorbedDamage) effects.push(`护盾抵消 ${absorbedDamage} 点`);
    if (weakpointDamage) effects.push(`其中 ${weakpointDamage} 点弱点伤害无视护盾`);
    if (gainedBlock) effects.push(`获得 ${gainedBlock} 点护盾`);
    if (c.mark) effects.push(`发现 ${markGained} 层弱点${traitTriggered ? '（特性抽 1 张牌）' : ''}`);
    if (warmthBonus) effects.push(`消耗 ${warmthBonus} 点暖意，追加 ${breakdown.warmthDamage} 点伤害`);
    if (c.heal) effects.push(`回复 ${healed} 点生命`);
    if (warmthGained) effects.push(`积攒 ${warmthGained} 点暖意`);
    if (c.energy) effects.push(`恢复 ${c.energy} 点能量`);
    if (c.draw) effects.push(`抽取 ${c.draw} 张牌`);
    if (recoveredCount) effects.push(`取回 ${recoveredCount} 张弃牌`);
    if (c.nextBlock) effects.push(`下回合预留 ${c.nextBlock} 点护盾`);
    if (c.cleanse) effects.push('解除治疗压制与动摇');
    if (breakdown.insightDetonate) effects.push('引爆全部弱点');
    if (breakdown.shieldSpent) effects.push(`消耗 ${breakdown.shieldSpent} 点护盾发动潮汐`);
    if (c.self) effects.push(`消耗 ${selfDamage} 点生命`);
    if (lucidBonusDraw) effects.push(`看清裂缝抽取 ${lucidBonusDraw} 张牌`);
    if (lucidBonusEnergy) effects.push(`看清裂缝恢复 ${lucidBonusEnergy} 点能量`);
    log(s, `你打出「${c.name}」：${effects.join('，') || '效果发动'}。`);
    logBattleStatus(s);
    (c.exhaust ? s.exhaust : s.discard).push(key);
    if (s.hp <= 0) { s.phase = 'lost'; log(s, '旅途暂止于此。'); }
    else if (s.enemy.hp <= 0) victory(s);
    return s;
  }
  if (action.type === 'end' && s.phase === 'combat') {
    const move = intent(s);
    const foe = enemyFor(s);
    const bonuses = specializationBonuses(s);
    const stats = equipmentStats(s);
    s.healingSuppression = Math.max(0, (s.healingSuppression || 0) - 1);
    const retained = s.hand.filter(key => card(key).retain);
    s.discard.push(...s.hand.filter(key => !card(key).retain)); s.hand = retained;
    s.enemy.block = 0;
    s.weak = Math.max(0, s.weak - 1);
    if (move.kind === 'guard') {
      s.enemy.block = move.value;
      log(s, `${foe.name}获得 ${move.value} 点护盾。`);
    } else if (move.kind === 'heal') {
      const healed = Math.min(move.value, s.enemy.maxHp - s.enemy.hp);
      s.enemy.hp += healed;
      log(s, `${foe.name}恢复 ${healed} 点生命。`);
    } else if (move.kind === 'charge') {
      s.enemy.charge = move.value;
      log(s, `${foe.name}开始蓄力，下回合将造成 ${move.value} 点伤害。`);
    } else if (move.kind === 'suppress') {
      s.healingSuppression = move.value;
      log(s, `${foe.name}施加治疗压制，接下来 ${move.value} 回合治疗效果降低 50%。`);
    } else if (move.kind === 'jam') {
      for (let index = 0; index < move.value; index++) s.discard.push('doubt');
      log(s, `${foe.name}向弃牌堆塞入 ${move.value} 张「杂念」。`);
    } else {
      if (move.kind === 'dispel') {
        const removed = Math.ceil(s.block * .5);
        s.block = Math.max(0, s.block - removed);
        log(s, `${foe.name}驱散了 ${removed} 点护盾。`);
      }
      let damage = 0;
      let absorbedTotal = 0;
      for (let i = 0; i < (move.hits || 1); i++) {
        const guardPierce = Math.max(0, (DIFFICULTIES[s.difficulty]?.guardPierce || 0) - (bonuses.guardPierceReduction || 0));
        const blockableDamage = Math.max(0, move.value - Math.ceil(move.value * guardPierce));
        const absorbed = Math.min(s.block, blockableDamage);
        s.block -= absorbed; damage += move.value - absorbed; absorbedTotal += absorbed;
        if (s.character === 'xiaoshuai' && bonuses.counterMastery && absorbed > 0 && s.counterTriggers < 3) {
          const reflected = Math.ceil(absorbed * (.35 + (bonuses.reflectionPct || 0) + stats.counterPower * .01)) + (bonuses.counterFlatDamage || 0);
          s.enemy.hp = Math.max(0, s.enemy.hp - reflected);
          s.nextBlock = (s.nextBlock || 0) + (bonuses.counterNextBlock || 0);
          s.hp = Math.min(s.maxHp, s.hp + (bonuses.counterHeal || 0));
          s.counterTriggers++;
          log(s, `小帅逐段回针，反击造成 ${reflected} 点伤害。`);
        }
      }
      s.hp = Math.max(0, s.hp - damage);
      if (move.kind === 'chargedAttack') s.enemy.charge = 0;
      log(s, `${foe.name}造成 ${damage} 点伤害。`);
      if (s.character === 'xiaoshuai' && absorbedTotal > 0 && !bonuses.counterMastery) {
        const reflected = Math.ceil(absorbedTotal * (.35 + (bonuses.reflectionPct || 0) + stats.counterPower * .01)) + (bonuses.counterFlatDamage || 0);
        s.enemy.hp = Math.max(0, s.enemy.hp - reflected);
        s.nextBlock = (s.nextBlock || 0) + (bonuses.counterNextBlock || 0);
        s.hp = Math.min(s.maxHp, s.hp + (bonuses.counterHeal || 0));
        log(s, `小帅用护盾反击，造成 ${reflected} 点伤害。`);
      }
      if (move.kind === 'curse') { s.weak = 1; log(s, '你陷入动摇，下回合共鸣效果降低 25%。'); }
    }
    logBattleStatus(s);
    s.totalTurns++;
    if (s.hp <= 0) { s.phase = 'lost'; log(s, '旅途暂止于此。'); return s; }
    if (s.enemy.hp <= 0) { victory(s); return s; }
    const retainedBlock = s.character === 'xiaoshuai' ? Math.floor(s.block * Math.min(.8, .2 + (bonuses.retainedBlockPct || 0))) : 0;
    s.turn++; s.energy = 3; s.traitUsed = false;
    s.block = retainedBlock + (s.pillowActive ? ambientEventValues(s).pillowBlock : 0) + equipmentStats(s).block + (s.nextBlock || 0);
    s.nextBlock = 0;
    s.lastCardSchool = null; s.lastCardMode = null; s.schoolChain = 0; s.rhythmTriggers = 0; s.recycleTriggered = false; s.healDrawTriggered = false; s.lucidFocusTriggered = false; s.counterTriggers = 0;
    draw(s, Math.max(0, 5 - s.hand.length)); log(s, `第 ${s.turn} 回合开始，能量恢复至 3。`);
    return s;
  }
  if (action.type === 'reward' && s.phase === 'reward') {
    if (action.key !== null && !s.choices.includes(action.key)) return state;
    if (action.key) {
      const result = { key: rankedCardKey(action.key, skillRewardRank(s, action.key)), upgraded: false };
      s.cardLibrary.push(result.key);
      s.unsecuredCards ||= [];
      s.unsecuredCards.push(result.key);
      s.journeyCardDrops ||= [];
      s.journeyCardDrops.push(result.key);
      s.journeyNewCards ||= [];
      if (!s.journeyNewCards.includes(cardBaseKey(result.key))) s.journeyNewCards.push(cardBaseKey(result.key));
      log(s, `获得新技能牌「${card(result.key).name}」，收入候补。`);
    }
    s.choices = [];
    s.lastLevelUp = null;
    if (s.bossFight) {
      const completedStage = s.stage;
      const firstClear = s.clears[completedStage] === 0;
      s.clears[completedStage]++;
      s.unlocked = Math.min(ENEMIES.length - 1, Math.max(s.unlocked, completedStage + 1));
      ensureCriticalSideQuests(s);
      s.chapterCheckpoints ||= Array(ENEMIES.length).fill(-1);
      s.mapSeed = Math.floor(random(s) * 4294967296) >>> 0;
      s.magicHouseCooldowns = {};
      s.mapRow = -1; s.currentNode = null; s.visited = [];
      s.checkpointRow = -1; s.unsecuredLoot = []; s.unsecuredCards = [];
      s.hp = s.maxHp; s.elite = false; s.bossFight = false;
      log(s, `房车平安返回。${CHAPTERS[completedStage].name}探索次数：${s.clears[completedStage]}。`);
      if (firstClear) {
        const clue = MAIN_STORY[completedStage]?.clue;
        if (completedStage < ENEMIES.length - 1 && clue && !s.namelessClues.includes(clue)) s.namelessClues.push(clue);
        const variant = completedStage === ENEMIES.length - 1 ? finalStoryVariant(s) : null;
        if (queueMainStory(s, completedStage, 'ending', variant)) return s;
      }
      s.stage = Math.min(completedStage + 1, ENEMIES.length - 1);
      s.phase = 'hub';
      if (s.stage > completedStage) log(s, `下一站「${CHAPTERS[s.stage].name}」已经解锁。`);
      return s;
    }
    s.phase = 'map'; s.elite = false; s.bossFight = false;
    continueSideScenes(s, 'battle');
    return s;
  }
  if (action.type === 'camp' && s.phase === 'camp') {
    const values = ambientEventValues(s);
    if (action.choice === 'rest') {
      const gain = Math.min(values.campHeal, s.maxHp - s.hp); s.hp += gain; log(s, `在房车里小睡，回复 ${gain} 点生命。`);
    } else if (action.choice === 'relic') {
      if (s.gold < values.pillowCost || s.pillowActive || s.pillowBattles > 0) return state;
      s.gold -= values.pillowCost; s.pillowBattles = values.pillowBattles; log(s, `购入柔软靠枕：接下来 ${values.pillowBattles} 场战斗，每个回合开始获得 ${values.pillowBlock} 点护盾。`);
    } else return state;
    s.phase = 'map'; s.mysteryResult = null;
    continueSideScenes(s, 'camp');
    return s;
  }
  if (action.type === 'blackMarketLeave' && s.phase === 'blackMarket') {
    s.phase = 'map';
    s.mysteryResult = null;
    s.blackMarketOffers = null;
    continueSideScenes(s, 'blackMarket');
    return s;
  }
  if (action.type === 'blackMarketBuy' && s.phase === 'blackMarket') {
    const offerIndex = s.blackMarketOffers?.findIndex(candidate => candidate.id === action.id) ?? -1;
    const offer = s.blackMarketOffers?.[offerIndex];
    if (!offer || s.gold < offer.cost) return state;
    s.gold -= offer.cost;
    if (offer.kind === 'randomCard' || offer.kind === 'card') {
      const acquired = addCardReward(s, cardBaseKey(offer.key), cardRank(offer.key));
      log(s, `在夜路黑市花费 ${offer.cost} 枚旅币，带走 Lv.${cardRank(acquired)}「${card(acquired).name}」。`);
    } else if (offer.kind === 'gear' && offer.item && !itemFor(s, offer.item.id)) {
      const item = offer.item;
      s.inventory.unshift(item);
      s.unsecuredLoot ||= [];
      s.unsecuredLoot.push(item.id);
      s.journeyNewItems ||= [];
      s.journeyNewItems.push(item.id);
      s.lastLoot = item.id;
      s.lastLoots = [item.id];
      s.directEquipLootIds = [item.id];
      log(s, `在夜路黑市花费 ${offer.cost} 枚旅币，带走${item.rarity}装备「${itemName(item)}」。`);
    } else return state;
    s.blackMarketOffers.splice(offerIndex, 1);
    return s;
  }
  if (action.type === 'memory' && s.phase === 'memory') {
    if (action.cardKey === null) { s.phase = 'map'; s.mysteryResult = null; continueSideScenes(s, 'memory'); return s; }
    const sourceKey = String(action.cardKey || '');
    if (sourceKey.endsWith('~gear') || cardRank(sourceKey) >= 10 || !CARDS[cardBaseKey(sourceKey)]) return state;
    const matches = s.cardLibrary.map((key, index) => ({ key, index })).filter(entry => entry.key === sourceKey);
    if (matches.length < 2) return state;
    const [first, second] = matches.slice(0, 2).map(entry => entry.index).sort((a, b) => b - a);
    const name = card(sourceKey).name;
    const replaceTrackedPair = list => {
      let consumed = 0;
      const kept = (list || []).filter(key => {
        if (key === sourceKey && consumed < 2) { consumed++; return false; }
        return true;
      });
      if (consumed) kept.push(upgradeCardKey(sourceKey));
      return kept;
    };
    const activeCount = s.deck.filter(key => key === sourceKey).length;
    const activeConsumed = Math.min(2, activeCount);
    s.cardLibrary.splice(first, 1);
    s.cardLibrary.splice(second, 1);
    const upgradedKey = upgradeCardKey(sourceKey);
    s.cardLibrary.push(upgradedKey);
    for (let index = 0; index < activeConsumed; index++) s.deck.splice(s.deck.findIndex(key => key === sourceKey), 1);
    if (activeConsumed > 0) s.deck.push(upgradedKey);
    s.unsecuredCards = replaceTrackedPair(s.unsecuredCards);
    s.journeyCardDrops = replaceTrackedPair(s.journeyCardDrops);
    log(s, `整理两张 Lv.${cardRank(sourceKey)}「${name}」，合成为 Lv.${cardRank(upgradedKey)}。`);
    s.phase = 'map'; s.mysteryResult = null;
    continueSideScenes(s, 'memory');
    return s;
  }
  if (action.type === 'negative' && s.phase === 'negative') {
    if (action.choice !== 'continue') return state;
    const loss = disorderGoldLoss(s.gold);
    s.gold -= loss;
    log(s, `失序路段收走了当前旅币的 ${DISORDER_GOLD_LOSS_PERCENT}%（${loss} 枚）。`);
    s.phase = 'map'; s.mysteryResult = null;
    continueSideScenes(s, 'negative');
    return s;
  }
  if (action.type === 'event' && s.phase === 'event') {
    const values = ambientEventValues(s);
    if (action.choice === 'spring') {
      const gain = Math.min(values.teaHeal, s.maxHp - s.hp); s.hp += gain; log(s, `喝下花茶，回复 ${gain} 点生命。`);
    } else if (action.choice === 'bargain') {
      s.hp = Math.max(1, s.hp - values.photoHpCost); s.gold += values.photoGold; log(s, `你卖掉一张旧照片，消耗生命并获得 ${values.photoGold} 枚旅币。`);
    } else return state;
    s.phase = 'map'; s.mysteryResult = null;
    continueSideScenes(s, 'event');
    return s;
  }
  if (action.type === 'checkpoint' && s.phase === 'checkpoint') {
    const step = s.mapRow + 1;
    const available = CHECKPOINTS[step]?.choices.map(choice => choice.key) || [];
    if (!available.includes(action.choice)) return state;
    if (action.choice === 'rest') {
      const gain = s.maxHp - s.hp; s.hp = s.maxHp;
      log(s, `在夜程路标旁睡了一会儿，回复 ${gain} 点生命。`);
    } else if (action.choice === 'shortRest') {
      const gain = s.maxHp - s.hp; s.hp = s.maxHp;
      log(s, `在杂货铺后休息片刻，回复 ${gain} 点生命。`);
    } else if (action.choice === 'cinemaRest') {
      const gain = s.maxHp - s.hp; s.hp = s.maxHp;
      log(s, `看完一段温柔的回忆，回复 ${gain} 点生命。`);
    } else if (action.choice === 'deepRest') {
      const gain = s.maxHp - s.hp; s.hp = s.maxHp;
      log(s, `在终夜整备站睡到月沉，回复 ${gain} 点生命。`);
    } else if (action.choice === 'returnHub') {
      s.hp = s.maxHp;
      log(s, '收好本段旅途的收获，返回房车休整。');
    }
    s.chapterCheckpoints ||= Array(ENEMIES.length).fill(-1);
    s.checkpointRow = s.mapRow; s.chapterCheckpoints[s.stage] = Math.max(s.chapterCheckpoints[s.stage] ?? -1, s.mapRow); s.unsecuredLoot = []; s.unsecuredCards = [];
    if (action.choice === 'returnHub') {
      s.phase = 'hub'; s.mapRow = -1; s.currentNode = null; s.visited = []; s.checkpointRow = -1; s.mysteryResult = null;
      s.elite = false; s.bossFight = false;
      log(s, '收获已经存进房车，稍作休整后可以从已点亮的路标继续。');
      return s;
    }
    s.phase = 'map';
    continueSideScenes(s, 'checkpoint');
    return s;
  }
  return state;
}
export function serialize(s) { return JSON.stringify(s); }
export function restore(raw) {
  try {
    const s = JSON.parse(raw);
    if (s?.version !== VERSION) return null;
    if (!Number.isInteger(s.pillowBattles)) s.pillowBattles = s.relic ? 3 : 0;
    if (typeof s.pillowActive !== 'boolean') s.pillowActive = false;
    if (s.battleMode === 'auto') s.tutorialDone = true;
    if (s.blackMarketOffers === undefined) s.blackMarketOffers = null;
    if (s.lastLevelUp === undefined) s.lastLevelUp = null;
    if (s.workshopUnlocked === undefined) s.workshopUnlocked = (s.chapterCheckpoints || []).some(row => row >= 19) || (s.phase === 'checkpoint' && s.mapRow === 19);
    if (s.featureSeen && s.featureSeen.waypoint === undefined) s.featureSeen.waypoint = false;
    const int = (n, min, max) => Number.isInteger(n) && n >= min && n <= max;
    const validCards = a => Array.isArray(a) && a.length <= 300 && a.every(k => typeof k === 'string' && /^[a-zA-Z]+(?:\+(?:[2-9]|10)?)?(?:~gear)?$/.test(k) && CARDS[cardBaseKey(k)]);
    if (!s || s.version !== VERSION || typeof s.tutorialDone !== 'boolean' || !CHARACTERS[s.character] || !int(s.warmth, 0, 1000000) || typeof s.traitUsed !== 'boolean' || !int(s.coreRewardMisses, 0, 4) || !DIFFICULTIES[s.difficulty] || !['auto', 'manual'].includes(s.battleMode) || !['hub', 'map', 'combat', 'reward', 'camp', 'memory', 'loadout', 'blackMarket', 'negative', 'mystery', 'checkpoint', 'event', 'mainStory', 'sideStory', 'sideResolve', 'lost'].includes(s.phase)) return null;
    if (!validSpecializationAllocation(s, s.specializations) || !int(s.specializationBonusPoints, 0, MAX_SPECIALIZATION_POINTS) || typeof s.specializationSeen !== 'boolean' || !int(s.specializationResetTokens, 0, 1) || typeof s.specializationResetQuestDone !== 'boolean') return null;
    if (!Array.isArray(s.specializationStoryRewards) || s.specializationStoryRewards.length > 3 || !s.specializationStoryRewards.every(stage => [1, 3, 5].includes(stage)) || new Set(s.specializationStoryRewards).size !== s.specializationStoryRewards.length) return null;
    if (!s.featureSeen || !['bag', 'workshop', 'guests', 'waypoint'].every(key => typeof s.featureSeen[key] === 'boolean') || typeof s.workshopUnlocked !== 'boolean') return null;
    if (s.mysteryResult !== null && !MYSTERY_STATIONS.some(station => station.type === s.mysteryResult)) return null;
    if (s.lastMysteryResult !== null && !MYSTERY_STATIONS.some(station => station.type === s.lastMysteryResult)) return null;
    const validMainStory = scene => scene === null || (scene && int(scene.stage, 0, MAIN_STORY.length - 1) && ['intro', 'boss', 'ending'].includes(scene.beat) && (scene.variant === null || ['hidden', 'complete', 'fragmented'].includes(scene.variant)));
    if (!validMainStory(s.mainStory) || !Array.isArray(s.mainStorySeen) || s.mainStorySeen.length > MAIN_STORY.length * 3 || !s.mainStorySeen.every(id => /^[0-5]:(intro|boss|ending)$/.test(id)) || new Set(s.mainStorySeen).size !== s.mainStorySeen.length) return null;
    if ((s.phase === 'mainStory') !== Boolean(s.mainStory)) return null;
    const validSideStory = value => value === null || (value && SIDE_STORIES[value.id]);
    const validPromise = promise => promise && SIDE_STORIES[promise.id] && ['shop', 'card', 'gear', 'buff', 'clue', 'cardClue', 'specializationReset', 'turnin_cards', 'turnin_gear'].includes(promise.type) && int(promise.stage, 0, ENEMIES.length - 1) && int(promise.createdStep, 0, 1000000) && int(promise.createdVictories, 0, 100000) && (promise.criticalQuest === undefined || CRITICAL_SIDE_QUESTS[promise.criticalQuest]);
    const validBuff = buff => buff && typeof buff.key === 'string' && int(buff.battles, 1, 20) && int(buff.block || 0, 0, 1000) && int(buff.energy || 0, 0, 10) && int(buff.firstStrike || 0, 0, 1000);
    if (!validSideStory(s.sideStory) || !validSideStory(s.pendingScene?.storyId ? { id: s.pendingScene.storyId } : null)) return null;
    if (!Array.isArray(s.sidePromises) || s.sidePromises.length > 20 || !s.sidePromises.every(validPromise)) return null;
    if (!Array.isArray(s.sideStorySeen) || s.sideStorySeen.length > Object.keys(SIDE_STORIES).length || !s.sideStorySeen.every(id => SIDE_STORIES[id])) return null;
    if (!Array.isArray(s.sideStoryQueue) || s.sideStoryQueue.length > Object.keys(SIDE_STORIES).length || !s.sideStoryQueue.every(id => SIDE_STORIES[id]) || new Set(s.sideStoryQueue).size !== s.sideStoryQueue.length) return null;
    if (!Array.isArray(s.sideChapterTriggers) || s.sideChapterTriggers.length !== ENEMIES.length || !s.sideChapterTriggers.every(count => int(count, 0, 2))) return null;
    const criticalQuestIds = Object.keys(CRITICAL_SIDE_QUESTS);
    if (!s.criticalSideQuests || Array.isArray(s.criticalSideQuests) || Object.keys(s.criticalSideQuests).length !== criticalQuestIds.length || !criticalQuestIds.every(id => {
      const progress = s.criticalSideQuests[id];
      return progress && ['locked', 'active', 'ready', 'claiming', 'complete'].includes(progress.status) && int(progress.target, CRITICAL_SIDE_QUESTS[id].target, CRITICAL_SIDE_QUESTS[id].target) && int(progress.progress, 0, progress.target);
    })) return null;
    if (s.pendingScene !== null && (!s.pendingScene || !['shop', 'reward', 'turnin_cards', 'turnin_gear'].includes(s.pendingScene.kind) || typeof s.pendingScene.title !== 'string' || typeof s.pendingScene.text !== 'string')) return null;
    if (!Array.isArray(s.sideBuffs) || s.sideBuffs.length > 8 || !s.sideBuffs.every(validBuff) || !int(s.sideBattleFirstStrike || 0, 0, 1000)) return null;
    if (!Array.isArray(s.namelessClues) || s.namelessClues.length > 20 || !s.namelessClues.every(key => typeof key === 'string' && key.length < 40)) return null;
    if (!int(s.stage, 0, ENEMIES.length - 1) || !int(s.level, 1, MAX_PLAYER_LEVEL) || !int(s.xp, 0, 10000) || !int(s.nextXp, 1, 10000)) return null;
    if (!int(s.unlocked, 0, ENEMIES.length - 1) || !Array.isArray(s.clears) || s.clears.length !== ENEMIES.length || !s.clears.every(n => int(n, 0, 10000))) return null;
    if (!s.facilities || !['kitchen', 'workshop', 'rooms'].every(key => int(s.facilities[key], 0, 3))) return null;
    if (!s.commissionClaims || !['battles', 'steps', 'stories'].every(key => int(s.commissionClaims[key], 0, 10000)) || !int(s.stepsTraveled, 0, 1000000)) return null;
    if (!s.magicHouseCooldowns || Array.isArray(s.magicHouseCooldowns) || Object.keys(s.magicHouseCooldowns).length > 100 || !Object.entries(s.magicHouseCooldowns).every(([key, value]) => /^\d+:c\d+r\d+n\d+$/.test(key) && int(value, 0, 1000015))) return null;
    if (!Array.isArray(s.guestRewards) || s.guestRewards.length !== GUESTS.length || !s.guestRewards.every(value => typeof value === 'boolean')) return null;
    if (!Array.isArray(s.chapterCheckpoints) || s.chapterCheckpoints.length !== ENEMIES.length || !s.chapterCheckpoints.every(row => row === -1 || CHECKPOINT_STEPS.includes(row + 1))) return null;
    if (!int(s.maxHp, 50, 700) || !int(s.hp, 0, s.maxHp) || !int(s.gold, 0, 100000)) return null;
    if (!int(s.seed, 0, 4294967295) || !int(s.mapSeed, 0, 4294967295) || !int(s.turn, 1, 10000) || !int(s.energy, 0, 100) || !int(s.block, 0, 10000) || !int(s.nextBlock, 0, 10000) || !int(s.weak, 0, 1) || !int(s.healingSuppression, 0, 10)) return null;
    if (!(s.lastCardSchool === null || Object.values(CARDS).some(entry => entry.school === s.lastCardSchool)) || !(s.lastCardMode === null || ['attack', 'heal', 'support'].includes(s.lastCardMode)) || !int(s.schoolChain, 0, 100) || !int(s.rhythmTriggers, 0, 2) || typeof s.recycleTriggered !== 'boolean' || typeof s.healDrawTriggered !== 'boolean' || typeof s.lucidFocusTriggered !== 'boolean' || !int(s.lucidCharge, 0, 10000) || !int(s.counterTriggers, 0, 3)) return null;
    if (![s.cardLibrary, s.deck, s.hand, s.draw, s.discard, s.exhaust].every(validCards) || s.hand.length > 9) return null;
    const libraryCounts = s.cardLibrary.reduce((counts, key) => counts.set(key, (counts.get(key) || 0) + 1), new Map());
    const activeCounts = s.deck.reduce((counts, key) => counts.set(key, (counts.get(key) || 0) + 1), new Map());
    if ([...activeCounts].some(([key, count]) => count > (libraryCounts.get(key) || 0))) return null;
    const enemyLimit = 10000;
    if (!s.enemy || !int(s.enemy.hp, 0, enemyLimit) || !int(s.enemy.maxHp, 0, enemyLimit) || !int(s.enemy.block, 0, 1000) || !int(s.enemy.mark, 0, 1000) || !int(s.enemy.charge, 0, enemyLimit)) return null;
    if (!Array.isArray(s.log) || s.log.length > 24 || !s.log.every(x => typeof x === 'string' && x.length < 300) || !int(s.pillowBattles, 0, 3) || typeof s.pillowActive !== 'boolean') return null;
    if (!Array.isArray(s.battleLog) || s.battleLog.length > 160 || !s.battleLog.every(x => typeof x === 'string' && x.length < 300)) return null;
    const validAffix = affix => affix && AFFIXES.some(definition => definition.key === affix.key) && int(affix.value, 1, 100) && int(affix.tier, 1, 6) && typeof affix.prefix === 'string';
    const validItem = item => item && typeof item.id === 'string' && /^gear-\d+$/.test(item.id) && ITEMS[item.base] && int(item.itemLevel, 1, 60) && RARITIES.some(rarity => rarity.name === item.rarity) && Array.isArray(item.affixes) && item.affixes.length <= 4 && item.affixes.every(validAffix) && (item.skill === null || REWARDS.includes(item.skill)) && int(item.skillLevel, item.skill ? 1 : 0, item.skill ? 10 : 0);
    const marketRanks = blackMarketCardRanks(s.mapRow);
    const validBlackMarketOffer = offer => offer && /^(random-card|shown-card-[1-3]|gear)$/.test(offer.id) && ['randomCard', 'card', 'gear'].includes(offer.kind) && typeof offer.label === 'string' && int(offer.cost, 1, 1000)
      && (offer.kind === 'gear'
        ? offer.id === 'gear' && validItem(offer.item) && offer.cost === blackMarketGearPrice(s.stage, offer.item)
        : validCards([offer.key]) && cardRank(offer.key) === (offer.kind === 'randomCard' ? marketRanks.random : marketRanks.shown)
          && offer.cost === blackMarketCardPrice(s.stage, cardRank(offer.key), offer.kind));
    if (s.blackMarketOffers !== null && (!Array.isArray(s.blackMarketOffers) || s.blackMarketOffers.length > 5 || !s.blackMarketOffers.every(validBlackMarketOffer) || new Set(s.blackMarketOffers.map(offer => offer.id)).size !== s.blackMarketOffers.length)) return null;
    if ((s.phase === 'blackMarket') !== Array.isArray(s.blackMarketOffers)) return null;
    if (!Array.isArray(s.inventory) || s.inventory.length > 200 || !s.inventory.every(validItem) || new Set(s.inventory.map(item => item.id)).size !== s.inventory.length) return null;
    if (!Array.isArray(s.unsecuredLoot) || s.unsecuredLoot.length > 200 || !s.unsecuredLoot.every(id => typeof id === 'string' && itemFor(s, id)) || new Set(s.unsecuredLoot).size !== s.unsecuredLoot.length) return null;
    if (!validCards(s.unsecuredCards) || !validCards(s.journeyCardDrops)) return null;
    if (!Array.isArray(s.journeyNewItems) || s.journeyNewItems.length > 200 || !s.journeyNewItems.every(id => typeof id === 'string' && itemFor(s, id)) || new Set(s.journeyNewItems).size !== s.journeyNewItems.length) return null;
    if (!Array.isArray(s.journeyNewCards) || s.journeyNewCards.length > DROPPABLE_CARDS.length || !s.journeyNewCards.every(key => DROPPABLE_CARDS.includes(key)) || new Set(s.journeyNewCards).size !== s.journeyNewCards.length) return null;
    if (!int(s.nextItemId, 1, 1000000)) return null;
    if (!s.equipment || !Object.keys(SLOT_LABELS).every(slot => s.equipment[slot] === null || (itemFor(s, s.equipment[slot]) && ITEMS[itemFor(s, s.equipment[slot]).base].slot === slot))) return null;
    if (s.lastLoot !== null && !itemFor(s, s.lastLoot)) return null;
    if (!Array.isArray(s.lastLoots) || s.lastLoots.length > 3 || new Set(s.lastLoots).size !== s.lastLoots.length || !s.lastLoots.every(id => typeof id === 'string' && itemFor(s, id))) return null;
    if (s.lastLevelUp !== null && (!s.lastLevelUp || !int(s.lastLevelUp.from, 1, MAX_PLAYER_LEVEL) || !int(s.lastLevelUp.to, s.lastLevelUp.from + 1, MAX_PLAYER_LEVEL) || !int(s.lastLevelUp.specializationPoints, 0, MAX_SPECIALIZATION_POINTS))) return null;
    if (![s.played, s.totalTurns, s.victories].every(n => int(n, 0, 100000)) || !int(s.foe, 0, 15) || !int(s.checkpointRow, -1, MAP_STEPS - 1) || typeof s.elite !== 'boolean' || typeof s.bossFight !== 'boolean') return null;
    const nodes = chapterMap(s.stage, s.mapSeed);
    if (!int(s.mapRow, -1, MAP_STEPS - 1) || (s.currentNode !== null && !nodes.some(n => n.id === s.currentNode))) return null;
    if (!Array.isArray(s.visited) || s.visited.length > MAP_STEPS || !s.visited.every(id => nodes.some(n => n.id === id))) return null;
    if (!Array.isArray(s.choices) || s.choices.length > 3 || !s.choices.every(k => DROPPABLE_CARDS.includes(k))) return null;
    if (s.phase === 'combat' && (!s.hp || !s.enemy.hp || !s.enemy.maxHp)) return null;
    if (s.phase === 'lost' && s.hp !== 0) return null;
    if (s.phase === 'reward' && s.enemy.hp !== 0) return null;
    if (s.phase === 'reward' && (s.choices.length !== 3 || new Set(s.choices).size !== 3)) return null;
    return s;
  } catch { return null; }
}

