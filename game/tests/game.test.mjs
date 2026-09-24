import assert from 'node:assert/strict';
import test from 'node:test';
import { BLACK_MARKET_GEAR_PRICES, BLACK_MARKET_RANDOM_CARD_PRICES, BLACK_MARKET_SHOWN_CARD_PRICES, CARDS, CHARACTERS, CHAPTER_LOOT, CHECKPOINTS, CHECKPOINT_STEPS, CORE_REWARDS, DIFFICULTIES, DISORDER_GOLD_LOSS_PERCENT, ENCOUNTERS, ENEMIES, EQUIPMENT_ART, ITEMS, MAP_STEPS, MAX_BATTLE_ENEMIES, MAX_PLAYER_LEVEL, MAX_SPECIALIZATION_POINTS, MYSTERY_STATIONS, REWARDS, SKILL_UNLOCKS, SPECIALIZATIONS, ambientEventValues, attackBreakdown, attackPreview, beginBattle, blackMarketCardPrice, blackMarketCardRanks, blackMarketGearPrice, buildChapterMap, canInvestSpecialization, card, chooseAutoCard, commissionStatus, compareCardKeys, description, disorderGoldLoss, elementMultiplier, enemyFor, enemyInitialDamageMultiplier, equipmentDropCount, equipmentInnateSkillChance, equipmentRandomSkillChance, equipmentRarityChances, equipmentSkillDropScale, equipmentStats, facilityCost, intent, itemBaseStats, itemFor, itemStats, itemTier, itemUpgradeCost, livingEnemies, magicHouseCooldownRemaining, newRun, rerollCost, restore, reviveCost, salvageValue, serialize, sideCardTurnInCandidates, skillRewardRank, specializationAvailablePoints, specializationNodeText, specializationPointTotal, specializationSpent, specializationUnlocked, transition } from '../src/game.mjs';

const leaveHub = (state, stage = 0) => {
  let next = transition(state, { type: 'depart', stage });
  while (next.phase === 'mainStory' && next.mainStory?.beat === 'intro') {
    next = transition(next, { type: 'mainStoryContinue' });
  }
  if (['sideStory', 'sideResolve'].includes(next.phase)) {
    next.phase = 'map';
    next.sideStory = null;
    next.pendingScene = null;
  }
  next.sideStoryQueue = [];
  return next;
};
const enterBattle = (seed, mode = 'manual') => transition(leaveHub(newRun(seed, mode)), { type: 'node', id: 'c0r0n0' });

test('同一种子生成相同的初始手牌', () => {
  assert.deepEqual(enterBattle(20260827).hand, enterBattle(20260827).hand);
});

test('出牌会消耗能量并进入弃牌堆', () => {
  const state = enterBattle(7);
  const index = state.hand.findIndex(key => card(key).cost <= state.energy);
  const key = state.hand[index];
  const next = transition(state, { type: 'play', index });
  assert.equal(next.energy, state.energy - card(key).cost + (card(key).energy || 0));
  assert.equal(next.played, 1);
  assert.ok(next.discard.includes(key) || next.exhaust.includes(key));
});

test('所有打出后不回牌堆的卡牌都会明确说明移出本场战斗', () => {
  const exhaustCards = Object.keys(CARDS).filter(key => CARDS[key].exhaust);
  assert.ok(exhaustCards.length > 0);
  for (const key of exhaustCards) {
    assert.ok(description(key).includes('打出后移出本场战斗'), `${CARDS[key].name} 缺少移出说明`);
  }
  assert.ok(!description('slash').includes('打出后移出本场战斗'));
});

test('弱点牌卡面展示自身层数且特殊规则说明与结算一致', () => {
  assert.deepEqual(description('listen'), ['发现 5 层弱点', '抽 1 张牌']);
  assert.deepEqual(description('echo'), ['发现 4 层弱点', '目标原本已有弱点时，本次发现的弱点增加 50%', '抽 1 张牌']);
  assert.deepEqual(description('photoAlbum'), ['发现 5 层弱点', '抽 2 张牌', '打出后移出本场战斗']);
  assert.ok(description('exposeTruth').includes('立即按使用前已有的每层弱点造成 5 点伤害，且不消耗弱点'));
  assert.ok(description('blanket').includes('回合结束时仍留在手牌'));
  assert.match(CHARACTERS.uncle.description, /抽 1 张牌/);

  const state = newRun(22001, 'manual', 'standard', 'uncle');
  Object.assign(state, {
    phase: 'combat', tutorialDone: true, traitUsed: true, hand: ['listen'], draw: [], discard: [], exhaust: [], energy: 3,
    enemy: { hp: 100, maxHp: 100, block: 0, mark: 0, charge: 0 },
    equipment: { weapon: null, armor: null, bag: null, scarf: null, charm: null, decor: null },
  });
  const played = transition(state, { type: 'play', index: 0 });
  assert.equal(played.enemy.mark, 5);
  assert.ok(played.battleLog.some(line => line.includes('发现 5 层弱点')));
});

test('Lv.1 卡面直接使用配置值且不存在隐藏章节修正', () => {
  const numericFields = ['damage', 'hits', 'block', 'nextBlock', 'heal', 'mark', 'markedMarkBonusPct', 'draw', 'energy', 'self', 'recycle', 'blockDamage', 'markBurst', 'consumeMark', 'execute'];
  for (const [key, configured] of Object.entries(CARDS)) {
    const resolved = card(key);
    for (const field of numericFields) {
      assert.equal(resolved[field], configured[field], `${configured.name} 的 ${field} 被运行时隐式修正`);
    }
  }
});

test('战斗日志按时间顺序记录并在每次行动后显示双方状态', () => {
  const state = enterBattle(71);
  assert.ok(state.battleLog[0].startsWith('抵达'));
  assert.ok(state.battleLog[1].startsWith('第 1 回合'));
  assert.ok(state.battleLog[2].startsWith('状态：你'));
  const index = state.hand.findIndex(key => card(key).cost <= state.energy);
  const next = transition(state, { type: 'play', index });
  assert.ok(next.battleLog.at(-2).startsWith('你打出'));
  assert.match(next.battleLog.at(-1), new RegExp(`状态：你 \\d+/${next.maxHp} 生命.*${enemyFor(next).name} \\d+/${next.enemy.maxHp} 生命`));
});

test('结束回合会执行敌人意图并开始下一回合', () => {
  const state = enterBattle(11);
  const foeName = enemyFor(state).name;
  const next = transition(state, { type: 'end' });
  assert.equal(next.turn, 2);
  assert.equal(next.energy, 3);
  assert.ok(next.hp < state.hp || next.enemy.block > 0 || next.enemy.charge > 0);
  assert.ok(next.battleLog.some(line => line.startsWith(foeName)));
});

test('技能池包含多种主题，保留牌不会在回合结束时弃掉', () => {
  assert.ok(Object.keys(CARDS).length >= 20);
  const state = enterBattle(12);
  state.hand = ['blanket', 'slash'];
  const next = transition(state, { type: 'end' });
  assert.ok(next.hand.includes('blanket'));
  assert.ok(next.discard.includes('slash'));
});

test('开局可选择自动或手动战斗，进入旅程后不能切换', () => {
  assert.equal(newRun(1).battleMode, 'manual');
  assert.equal(newRun(1, 'auto').battleMode, 'auto');
  const manual = newRun(1, 'manual');
  assert.equal(manual.battleMode, 'manual');
  assert.equal(transition(manual, { type: 'mode', mode: 'auto' }).battleMode, 'manual');
});

test('三名角色拥有不同初始牌组并贯穿存档', () => {
  const decks = Object.keys(CHARACTERS).map(character => newRun(8, 'manual', 'standard', character).deck);
  assert.equal(new Set(decks.map(deck => deck.join(','))).size, 3);
  const gaigai = newRun(8, 'manual', 'standard', 'gaigai');
  assert.equal(gaigai.character, 'gaigai');
  assert.deepEqual(restore(serialize(gaigai)), gaigai);
});

test('房车功能的新标签分别记录已读状态', () => {
  const state = newRun(801, 'manual');
  assert.deepEqual(state.featureSeen, { bag: false, workshop: false, guests: false, waypoint: false });
  const bagSeen = transition(state, { type: 'viewFeature', key: 'bag' });
  assert.deepEqual(bagSeen.featureSeen, { bag: true, workshop: false, guests: false, waypoint: false });
  const workshopSeen = transition(bagSeen, { type: 'viewFeature', key: 'workshop' });
  assert.deepEqual(workshopSeen.featureSeen, { bag: true, workshop: true, guests: false, waypoint: false });
  const waypointSeen = transition(workshopSeen, { type: 'viewFeature', key: 'waypoint' });
  assert.equal(waypointSeen.featureSeen.waypoint, true);
  const traveling = leaveHub(workshopSeen);
  assert.equal(transition(traveling, { type: 'viewFeature', key: 'guests' }), traveling);
});

test('大叔每回合首次使用弱点牌只额外抽牌', () => {
  const state = enterBattle(81);
  state.hand = ['mark', 'mark']; state.draw = ['slash', 'guard']; state.energy = 3;
  const first = transition(state, { type: 'play', index: 0 });
  assert.equal(first.hand.length, 2);
  assert.equal(first.traitUsed, true);
  assert.equal(first.enemy.mark, 3);
  const second = transition(first, { type: 'play', index: 0 });
  assert.equal(second.hand.length, 1);
  assert.equal(second.enemy.mark, 6);
  assert.ok(first.battleLog.some(line => line.includes('特性抽 1 张牌')));
});

test('装备不再提供弱点强化且旧字段不会影响大叔', () => {
  const state = enterBattle(810);
  state.inventory.find(item => item.id === state.equipment.weapon).affixes = [{ key: 'markPower', value: 2 }];
  state.hand = ['mark']; state.draw = []; state.energy = 3;
  const next = transition(state, { type: 'play', index: 0 });
  assert.equal(equipmentStats(state).markPower, undefined);
  assert.equal(next.enemy.mark, 3);
  assert.ok(next.battleLog.some(line => line.includes('特性抽 1 张牌')));
});

test('每段攻击只消耗一层弱点，多段攻击可以连续触发', () => {
  const state = enterBattle(811);
  state.enemy = { hp: 100, maxHp: 100, block: 0, mark: 3 };
  state.hand = ['slash', 'nova']; state.energy = 3;
  const slashDamage = card('slash').damage + equipmentStats(state).attack;
  assert.equal(attackPreview(state, 'slash'), slashDamage + 4);
  const single = transition(state, { type: 'play', index: 0 });
  assert.equal(single.enemy.mark, 2);
  const expectedNova = attackPreview(single, 'nova');
  const multi = transition(single, { type: 'play', index: 0 });
  assert.equal(single.enemy.hp - multi.enemy.hp, expectedNova);
  assert.equal(multi.enemy.mark, 0);
});

test('弱点伤害无视敌人护盾且预计伤害与实际扣血一致', () => {
  const state = enterBattle(812);
  state.enemy = { hp: 100, maxHp: 100, block: 99, mark: 2 };
  state.hand = ['slash']; state.energy = 3;
  const expected = 4;
  assert.equal(attackPreview(state, 'slash'), expected);
  const attacked = transition(state, { type: 'play', index: 0 });
  assert.equal(state.enemy.hp - attacked.enemy.hp, expected);
  assert.equal(attacked.enemy.mark, 1);
  assert.ok(attacked.enemy.block < state.enemy.block);
  assert.ok(attacked.battleLog.some(line => line.includes('弱点伤害无视护盾')));
  assert.ok(attacked.battleLog.some(line => line.includes('护盾抵消')));
});

test('每层弱点造成固定伤害且不随层数或攻击力变化', () => {
  const low = enterBattle(813);
  low.enemy = { hp: 100, maxHp: 100, block: 99, mark: 1 };
  low.hand = ['slash']; low.energy = 3;
  const high = structuredClone(low);
  high.inventory.push({ id: 'gear-3', base: 'bookmarkKnife', rarity: '精良', itemLevel: 21, affixes: [], skill: null, skillLevel: 0 });
  high.equipment.weapon = 'gear-3';
  assert.equal(attackPreview(high, 'slash'), attackPreview(low, 'slash'));
  high.enemy.mark = 5;
  assert.equal(attackPreview(high, 'slash'), 4);
});

test('该该每三点最终治疗量转为一点暖意并追加到下一次攻击', () => {
  const state = transition(leaveHub(newRun(82, 'manual', 'standard', 'gaigai')), { type: 'node', id: 'c0r0n0' });
  state.hp = state.maxHp - 1; state.hand = ['mend', 'slash']; state.energy = 3; state.enemy.hp = 100; state.enemy.maxHp = 100;
  const healed = transition(state, { type: 'play', index: 0 });
  const effectiveHealing = card('mend').heal;
  assert.equal(healed.warmth, Math.ceil(effectiveHealing / 3));
  const expected = attackPreview(healed, 'slash');
  const attacked = transition(healed, { type: 'play', index: 0 });
  assert.equal(100 - attacked.enemy.hp, expected);
  assert.equal(attacked.warmth, 0);
});

test('热可可在残血时也能治疗并为下一张攻击保留暖意', () => {
  const state = transition(leaveHub(newRun(821, 'manual', 'challenge', 'gaigai')), { type: 'node', id: 'c0r0n0' });
  state.hp = state.maxHp - 20; state.hand = ['leech']; state.energy = 3; state.enemy.hp = 100; state.enemy.maxHp = 100;
  const next = transition(state, { type: 'play', index: 0 });
  const expectedHealing = card('leech').heal;
  assert.equal(next.hp, state.hp + expectedHealing);
  assert.equal(next.warmth, Math.ceil(expectedHealing / 3));
});

test('该该的暖意可以超过六层并在下一张攻击时全部释放', () => {
  const state = transition(leaveHub(newRun(84, 'manual', 'standard', 'gaigai')), { type: 'node', id: 'c0r0n0' });
  state.hp = state.maxHp; state.warmth = 6;
  state.hand = ['mend', 'slash']; state.energy = 3; state.enemy.hp = 100; state.enemy.maxHp = 100;
  const stored = transition(state, { type: 'play', index: 0 });
  assert.equal(stored.warmth, 10);
  const expected = attackPreview(stored, 'slash');
  const attacked = transition(stored, { type: 'play', index: 0 });
  assert.equal(attacked.warmth, 0);
  assert.equal(100 - attacked.enemy.hp, expected);
});

test('双属性一级卡预留成长空间，单属性卡使用完整基础预算', () => {
  const total = key => {
    const value = card(key);
    return (value.damage || 0) + (value.block || 0) + (value.heal || 0);
  };
  const dualStatKeys = Object.entries(CARDS)
    .filter(([, value]) => ['damage', 'block', 'heal'].filter(field => value[field]).length >= 2)
    .map(([key]) => key);
  assert.deepEqual(dualStatKeys, ['riposte', 'leech', 'tea', 'stayAwhile', 'goodnight', 'steadyTea', 'sharedUmbrella', 'nightWatch', 'lastWarmth', 'tidalEcho', 'stoneBreaker']);
  assert.ok(dualStatKeys.every(key => CARDS[key].dualStat));
  assert.deepEqual(['riposte', 'leech', 'mend'].map(total), [9, 9, 10]);
});

test('双属性卡降低等级成长并按同期第二条装备属性预留收益', () => {
  const total = key => {
    const value = card(key);
    return (value.damage || 0) + (value.block || 0) + (value.heal || 0);
  };
  assert.deepEqual(['riposte+3', 'leech+3'].map(total), [12, 12]);
  assert.equal(total('fortify+3'), 17);
  assert.equal(total('mend+3'), 17);
  assert.equal(total('tea+10'), 43);
});

test('小帅会用护盾反击并保留部分剩余护盾', () => {
  const state = transition(leaveHub(newRun(83, 'manual', 'standard', 'xiaoshuai')), { type: 'node', id: 'c0r0n0' });
  state.block = 30; state.enemy.hp = 100; state.enemy.maxHp = 100;
  const next = transition(state, { type: 'end' });
  assert.ok(next.enemy.hp < 100);
  assert.ok(next.block > equipmentStats(next).block);
});

test('自动战斗会选择可用牌并持续推进', () => {
  let state = enterBattle(23, 'auto');
  const index = chooseAutoCard(state);
  assert.ok(index >= 0);
  assert.ok(card(state.hand[index]).cost <= state.energy);
  const next = transition(state, { type: 'auto' });
  assert.equal(next.played, 1);
  assert.ok(next.battleLog.some(line => line.includes('你打出')));
});

test('自动托管优先攻击，不会代替玩家精确防御', () => {
  const state = enterBattle(230, 'auto');
  state.hand = ['guard', 'slash']; state.energy = 1;
  assert.equal(chooseAutoCard(state), 1);
});

test('每章提供八种非首领遭遇，首领保持独立', () => {
  assert.ok(ENCOUNTERS.every(encounters => encounters.length >= 8));
  assert.ok(ENCOUNTERS.every(encounters => new Set(encounters.map(enemy => enemy.art)).size >= 8));
  const state = leaveHub(newRun(24));
  state.mapRow = 0; state.foe = 0;
  assert.equal(enemyFor(state).name, ENCOUNTERS[0][0].name);
  state.mapRow = 20; state.foe = 1;
  assert.equal(enemyFor(state).name, ENCOUNTERS[0][1].name);
  state.elite = true; state.foe = 2;
  assert.equal(enemyFor(state).name, ENCOUNTERS[0][2].name);
  state.bossFight = true;
  assert.equal(enemyFor(state).name, ENEMIES[0].name);
});

test('第一章普通与精英使用独立敌人池且机制清晰区分', () => {
  const chapter = ENCOUNTERS[0];
  const normal = chapter.filter(enemy => !enemy.eliteOnly);
  const elites = chapter.filter(enemy => enemy.eliteOnly);
  assert.equal(normal.length, 6);
  assert.deepEqual(elites.map(enemy => enemy.name), ['余温茶杯', '缠结线团']);
  assert.deepEqual(elites[0].pattern, [
    { kind: 'attack', value: 7 },
    { kind: 'guard', value: 8 },
    { kind: 'heal', value: 3 },
  ]);
  assert.deepEqual(elites[1].pattern, [
    { kind: 'attack', value: 4, hits: 2 },
    { kind: 'jam', value: 1 },
    { kind: 'guard', value: 7 },
  ]);
  const mechanics = new Set(normal.flatMap(enemy => enemy.pattern.map(move => move.hits ? 'multi' : move.kind)));
  for (const mechanic of ['charge', 'guard', 'multi', 'dispel', 'heal', 'curse']) assert.ok(mechanics.has(mechanic), mechanic);
  assert.ok(Math.min(...elites.map(enemy => enemy.hp * 1.5)) > Math.max(...normal.map(enemy => enemy.hp)));
});

test('1vN 战斗会生成多个独立敌人且不超过四个单位', () => {
  const state = newRun(2401, 'manual');
  Object.assign(state, { stage: 0, mapRow: 5, foe: 0, elite: false, bossFight: false });
  beginBattle(state);
  assert.equal(state.allies.length, 1);
  assert.equal(state.enemies.length, 3);
  assert.equal(livingEnemies(state).length, 3);
  assert.ok(state.enemies.every(unit => unit.id && unit.side === 'enemy' && unit.hp > 0 && unit.maxHp > 0));
  assert.ok(state.enemies.length <= MAX_BATTLE_ENEMIES);
});

test('单体牌只命中指定敌人，群体牌命中所有存活敌人', () => {
  const state = newRun(2402, 'manual');
  Object.assign(state, { stage: 0, mapRow: 5, foe: 0, elite: false, bossFight: false });
  beginBattle(state);
  state.energy = 9;
  state.hand = ['stoneBreaker', 'emberSweep'];
  const target = state.enemies[1];
  const beforeSingle = state.enemies.map(unit => unit.hp);
  const single = transition(state, { type: 'play', index: 0, targetId: target.id });
  single.enemies.forEach((unit, index) => {
    if (unit.id === target.id) assert.ok(unit.hp < beforeSingle[index]);
    else assert.equal(unit.hp, beforeSingle[index]);
  });
  const beforeAll = single.enemies.map(unit => unit.hp);
  const all = transition(single, { type: 'play', index: 0 });
  all.enemies.forEach((unit, index) => assert.ok(unit.hp < beforeAll[index]));
});

test('四元素只奖励克制关系，不对逆向关系施加减伤', () => {
  assert.equal(elementMultiplier('fire', 'wind'), 1.25);
  assert.equal(elementMultiplier('wind', 'earth'), 1.25);
  assert.equal(elementMultiplier('earth', 'water'), 1.25);
  assert.equal(elementMultiplier('water', 'fire'), 1.25);
  assert.equal(elementMultiplier('wind', 'fire'), 1);
  assert.equal(elementMultiplier('fire', 'water'), 1);
  assert.equal(elementMultiplier('neutral', 'wind'), 1);
});

test('Boss 召唤占用行动且新召唤物不会在出现当回合攻击', () => {
  const state = newRun(2403, 'manual');
  Object.assign(state, { stage: 0, mapRow: 12, foe: 0, elite: false, bossFight: true });
  beginBattle(state);
  state.turn = 2;
  state.hand = [];
  state.hp = 500;
  state.maxHp = 500;
  const beforeHp = state.hp;
  const next = transition(state, { type: 'end' });
  assert.equal(next.hp, beforeHp);
  assert.equal(next.enemies.length, 2);
  assert.equal(next.enemies.filter(unit => unit.kind === 'summon').length, 1);
  assert.ok(next.battleLog.some(line => line.includes('召唤')));
});

test('敌方召唤始终受四单位硬上限约束', () => {
  let state = newRun(2404, 'manual');
  Object.assign(state, { stage: 0, mapRow: 12, foe: 0, elite: false, bossFight: true });
  beginBattle(state);
  state.hp = 10000;
  state.maxHp = 10000;
  state.hand = [];
  for (let index = 0; index < 14 && state.phase === 'combat'; index++) {
    state = transition(state, { type: 'end' });
    state.hand = [];
  }
  assert.ok(state.enemies.length > 1);
  assert.ok(state.enemies.length <= MAX_BATTLE_ENEMIES);
});

test('跨章后普通怪承接前章末段压力，精英怪强于前章 Boss', () => {
  const start = ({ difficulty, stage, foe = 0, elite = false, bossFight = false, mapRow }) => {
    const state = newRun(2500 + stage * 10 + foe, 'manual', difficulty);
    Object.assign(state, { stage, foe, elite, bossFight, mapRow });
    beginBattle(state);
    return state;
  };
  const peakPressure = state => enemyInitialDamageMultiplier(state)
    * Math.max(...enemyFor(state).pattern.map(move => ['attack', 'curse', 'dispel', 'charge'].includes(move.kind) ? move.value * (move.hits || 1) : 0));

  const normalHpScales = [1, 1.2, 1.45, 1.35, 1.35, 1.4];
  const normalDamageScales = [1, 1.2, 1.25, 1.28, 1.32, 1.36];
  const eliteHpScales = [1, 1.1, 1.35, 1.35, 1.4, 1.45];
  const eliteDamageScales = [1, 1.08, 1.12, 1.16, 1.2, 1.24];
  for (const difficulty of Object.keys(DIFFICULTIES)) {
    for (let stage = 1; stage < ENEMIES.length; stage++) {
      const previousBoss = start({ difficulty, stage: stage - 1, bossFight: true, mapRow: MAP_STEPS - 1 });
      const previousNormals = ENCOUNTERS[stage - 1]
        .map((enemy, foe) => ({ enemy, foe }))
        .filter(({ enemy }) => !enemy.eliteOnly)
        .map(({ foe }) => start({ difficulty, stage: stage - 1, foe, mapRow: MAP_STEPS - 1 }));
      const previousNormalHp = Math.max(...previousNormals.map(state => state.enemy.maxHp));
      const previousNormalPressure = Math.max(...previousNormals.map(peakPressure));
      for (let foe = 0; foe < ENCOUNTERS[stage].length; foe++) {
        const normal = start({ difficulty, stage, foe, mapRow: 0 });
        const elite = start({ difficulty, stage, foe, elite: true, mapRow: 0 });
        assert.ok(normal.enemy.maxHp >= Math.round(previousNormalHp * normalHpScales[stage]), `${difficulty} 第${stage + 1}章普通怪生命跨章回落`);
        assert.ok(peakPressure(normal) >= previousNormalPressure * normalDamageScales[stage] - 1e-9, `${difficulty} 第${stage + 1}章普通怪攻势跨章回落`);
        const elitePartyHp = elite.enemies.reduce((sum, unit) => sum + unit.maxHp, 0);
        const elitePartyPressure = elite.enemies.reduce((sum, unit) => sum + peakPressure({ ...elite, selectedEnemyId: unit.id, enemy: unit }), 0);
        assert.ok(elitePartyHp >= Math.round(previousBoss.enemy.maxHp * eliteHpScales[stage]), `${difficulty} 第${stage + 1}章精英队伍总生命低于前章Boss`);
        assert.ok(elitePartyPressure >= peakPressure(previousBoss) * eliteDamageScales[stage] - 1e-9, `${difficulty} 第${stage + 1}章精英队伍总攻势低于前章Boss`);
      }
    }
  }
});

test('敌人回合成长只提高进攻压力，茶杯护盾和治疗只保留初始加成', () => {
  const state = enterBattle(243);
  state.stage = 0;
  state.elite = true;
  state.foe = 6;
  state.mapRow = 0;
  state.turn = 1;
  const earlyAttack = intent(state);
  state.turn = 2;
  const earlyGuard = intent(state);
  state.turn = 3;
  const earlyHeal = intent(state);
  state.turn = 4;
  const lateAttack = intent(state);
  state.turn = 5;
  const lateGuard = intent(state);
  state.turn = 6;
  const lateHeal = intent(state);
  assert.equal(ENCOUNTERS[0][6].pattern[2].value, 3);
  assert.equal(earlyAttack.kind, 'attack');
  assert.equal(lateAttack.kind, 'attack');
  assert.ok(lateAttack.value > earlyAttack.value);
  assert.equal(earlyGuard.kind, 'guard');
  assert.equal(lateGuard.kind, 'guard');
  assert.equal(earlyGuard.value, 19);
  assert.equal(lateGuard.value, earlyGuard.value);
  assert.equal(earlyHeal.kind, 'heal');
  assert.equal(lateHeal.kind, 'heal');
  assert.equal(earlyHeal.value, 7);
  assert.equal(lateHeal.value, earlyHeal.value);
});

test('第一章地图节点不会让普通与精英模板串池', () => {
  for (let seed = 1; seed <= 12; seed++) {
    const nodes = buildChapterMap(0, seed);
    for (const target of nodes.filter(node => ['battle', 'elite'].includes(node.type) && node.row > 0)) {
      const parent = nodes.find(node => node.links.includes(target.id));
      const state = leaveHub(newRun(seed, 'manual'));
      state.mapRow = parent.row; state.currentNode = parent.id; state.visited = [parent.id];
      const battle = transition(state, { type: 'node', id: target.id });
      assert.equal(Boolean(enemyFor(battle).eliteOnly), target.type === 'elite', target.id);
    }
  }
});

test('恢复型敌人会按预告恢复生命但不会超过上限', () => {
  const state = enterBattle(241);
  state.foe = 4; state.turn = 2; state.hand = [];
  state.enemy.maxHp = 100; state.enemy.hp = 90;
  const next = transition(state, { type: 'end' });
  assert.ok(next.enemy.hp > state.enemy.hp);
  assert.ok(next.enemy.hp <= next.enemy.maxHp);
  assert.ok(next.battleLog.some(line => line.includes('恢复')));
});

test('蓄力型敌人会在释放重击后清空蓄力并重新预告', () => {
  const state = enterBattle(242);
  state.foe = 0; state.hand = [];
  const charged = transition(state, { type: 'end' });
  assert.ok(charged.enemy.charge > 0);
  const released = transition(charged, { type: 'end' });
  assert.equal(released.enemy.charge, 0);
  assert.ok(released.hp < charged.hp);
  const chargingAgain = transition(released, { type: 'end' });
  assert.ok(chargingAgain.enemy.charge > 0);
});

test('装备会真实改变攻击与回合格挡', () => {
  let state = newRun(29, 'manual');
  assert.equal(equipmentStats(state).attack, 1);
  assert.equal(equipmentStats(state).block, 1);
  state.inventory.push({ id: 'gear-3', base: 'bookmarkKnife', rarity: '精良', affixes: [], skill: null });
  state.nextItemId = 4;
  state = transition(state, { type: 'equip', key: 'gear-3' });
  const battle = transition(leaveHub(state), { type: 'node', id: 'c0r0n0' });
  assert.equal(battle.block, 1);
  assert.equal(attackPreview(battle, 'slash'), 10);
});

test('普通怪技能装备掉率逐章开放且精英怪不受衰减', () => {
  assert.deepEqual(Array.from({ length: 6 }, (_, stage) => equipmentSkillDropScale(stage)), [.15, .3, .45, .6, .8, 1]);
  assert.equal(equipmentSkillDropScale(0, true), 1);
  assert.equal(equipmentSkillDropScale(5, true), 1);
});

test('普通、精英与 Boss 使用独立且可核对的装备品质概率', () => {
  const closeTo = (actual, expected) => assert.ok(Math.abs(actual - expected) < 1e-9, `${actual} != ${expected}`);
  const check = (actual, expected) => Object.keys(expected).forEach(key => closeTo(actual[key], expected[key]));
  const normal = newRun(301); normal.stage = 0;
  check(equipmentRarityChances(normal), { normal: .52, fine: .36, rare: .12, legendary: 0 });
  const elite = structuredClone(normal); elite.elite = true;
  check(equipmentRarityChances(elite), { normal: .42, fine: .36, rare: .18, legendary: .04 });
  const boss = structuredClone(normal); boss.bossFight = true;
  check(equipmentRarityChances(boss), { normal: .36, fine: .36, rare: .18, legendary: .1 });
  boss.stage = 5;
  const lateBoss = equipmentRarityChances(boss);
  assert.ok(Math.abs(lateBoss.normal - .285) < 1e-9);
  assert.ok(Math.abs(lateBoss.legendary - .175) < 1e-9);
  assert.equal(Object.values(lateBoss).reduce((sum, chance) => sum + chance, 0), 1);
});

test('随机装备技能不再由稀有和传奇品质高概率保送', () => {
  assert.equal(equipmentRandomSkillChance('普通'), 0);
  assert.equal(equipmentRandomSkillChance('精良'), 0);
  assert.equal(equipmentRandomSkillChance('稀有'), .2);
  assert.equal(equipmentRandomSkillChance('传奇'), .6);
});

test('底材自带技能不会被早期精英和 Boss 保送', () => {
  const normal = newRun(302); normal.stage = 0;
  assert.equal(equipmentInnateSkillChance(normal), .15);
  const elite = structuredClone(normal); elite.elite = true;
  assert.equal(equipmentInnateSkillChance(elite), .3);
  const boss = structuredClone(normal); boss.bossFight = true;
  assert.equal(equipmentInnateSkillChance(boss), .4);
  normal.stage = 5;
  assert.equal(equipmentInnateSkillChance(normal), 1);
});

test('胜利获得经验、升级并按 0 至 3 件规则掉落装备', () => {
  const state = enterBattle(31);
  state.xp = 44;
  state.hand = ['slash']; state.energy = 3; state.enemy.hp = 1;
  const reward = transition(state, { type: 'play', index: 0 });
  assert.equal(reward.level, 2);
  assert.equal(reward.maxHp, 76);
  assert.deepEqual(reward.lastLevelUp, { from: 1, to: 2, specializationPoints: 1 });
  assert.ok(reward.lastLoots.length >= 0 && reward.lastLoots.length <= 3);
  for (const id of reward.lastLoots) {
    assert.ok(CHAPTER_LOOT[0].includes(itemFor(reward, id).base));
    assert.ok(['weapon', 'armor', 'bag', 'scarf', 'charm', 'decor'].includes(ITEMS[itemFor(reward, id).base].slot));
    assert.ok(reward.journeyNewItems.includes(id));
  }
  const continued = transition(reward, { type: 'reward', key: reward.choices[0] });
  assert.equal(continued.lastLevelUp, null);
});

test('战斗旅币不随难度变化且 Boss 奖励高于精英和普通怪', () => {
  const victoryGold = (difficulty, encounter = 'normal') => {
    const state = enterBattle(3101, 'manual');
    state.difficulty = difficulty;
    state.gold = 0;
    state.elite = encounter === 'elite';
    state.bossFight = encounter === 'boss';
    state.enemy.hp = 1;
    state.hand = ['slash'];
    state.energy = 3;
    return transition(state, { type: 'play', index: 0 }).gold;
  };

  assert.equal(victoryGold('relaxed'), 29);
  assert.equal(victoryGold('standard'), 29);
  assert.equal(victoryGold('challenge'), 29);
  assert.equal(victoryGold('standard', 'elite'), 48);
  assert.equal(victoryGold('standard', 'boss'), 67);
});

test('本次探索获得的装备和技能会标记为新内容，并在下一次启程时清空', () => {
  let state = newRun(123, 'manual', 'standard', 'gaigai');
  state.phase = 'reward'; state.enemy.hp = 0; state.choices = ['riposte', 'leech', 'quick'];
  state = transition(state, { type: 'reward', key: 'riposte' });
  assert.deepEqual(state.journeyNewCards, ['riposte']);
  state.phase = 'hub'; state.unlocked = 0;
  state.journeyNewItems = [state.inventory[0].id];
  state = transition(state, { type: 'depart', stage: 0 });
  assert.deepEqual(state.journeyNewItems, []);
  assert.deepEqual(state.journeyNewCards, []);
});

test('在背包中查看新卡后会清除同名卡牌的 NEW 标记', () => {
  const state = newRun(124, 'manual');
  state.journeyNewCards = ['mark', 'quick'];
  const viewed = transition(state, { type: 'viewCard', key: 'mark+3' });
  assert.deepEqual(viewed.journeyNewCards, ['quick']);
  assert.deepEqual(viewed.deck, state.deck);
});

test('打开卡组页签后会清除所有技能卡 NEW 标记', () => {
  const state = newRun(1241, 'manual');
  state.journeyNewCards = ['mark', 'quick'];
  const viewed = transition(state, { type: 'viewCardLibrary' });
  assert.deepEqual(viewed.journeyNewCards, []);
  assert.deepEqual(viewed.deck, state.deck);
});

test('打开装备或背包页签后会清除所有装备 NEW 标记', () => {
  const state = newRun(1242, 'manual');
  state.journeyNewItems = state.inventory.map(item => item.id);
  const viewed = transition(state, { type: 'viewItemLibrary' });
  assert.deepEqual(viewed.journeyNewItems, []);
  assert.deepEqual(viewed.inventory, state.inventory);
});

test('六章各有八种装备底材并覆盖六个装备位', () => {
  assert.ok(Object.keys(ITEMS).length >= 48);
  for (const pool of CHAPTER_LOOT) {
    assert.equal(pool.length, 8);
    assert.equal(new Set(pool).size, 8);
    assert.ok(pool.every(key => ITEMS[key]));
    assert.deepEqual(new Set(pool.map(key => ITEMS[key].slot)), new Set(['weapon', 'armor', 'bag', 'scarf', 'charm', 'decor']));
  }
});

test('装备会随物品等级跨越普通、进阶和精英底材，后期基础数值显著提高', () => {
  const low = { base: 'morningShears', itemLevel: 1 };
  const advanced = { base: 'morningShears', itemLevel: 21 };
  const elite = { base: 'morningShears', itemLevel: 41 };
  assert.equal(itemTier(low).name, '普通底材');
  assert.equal(itemTier(advanced).name, '进阶底材');
  assert.equal(itemTier(elite).name, '精英底材');
  assert.ok(itemBaseStats(advanced).attack >= itemBaseStats(low).attack * 2);
  assert.ok(itemBaseStats(elite).attack >= itemBaseStats(low).attack * 4);
  const legendary = { ...elite, rarity: '传奇' };
  assert.ok(itemBaseStats(legendary).attack >= itemBaseStats(elite).attack * 1.3);
});

test('装备结构化属性会合并底材与随机词条，供界面直接对比', () => {
  const item = { id: 'gear-99', base: 'wornBlade', itemLevel: 1, rarity: '精良', affixes: [{ key: 'attack', value: 2, prefix: '敏锐的' }, { key: 'block', value: 3, prefix: '安稳的' }], skill: null, skillLevel: 0 };
  assert.deepEqual(itemStats(item), { attack: 3, block: 3 });
});

test('章节深度决定掉落等级，工坊可以把珍贵低阶装备升入下一档', () => {
  let early = newRun(913, 'manual');
  early = transition(early, { type: 'debug', operation: 'item', base: 'morningShears' });
  const earlyItem = early.inventory[0];
  assert.ok(earlyItem.itemLevel <= 3);
  early.gold = 1000;
  const cost = itemUpgradeCost(earlyItem);
  const upgraded = transition(early, { type: 'upgradeItem', key: earlyItem.id });
  assert.equal(upgraded.gold, 1000 - cost);
  assert.equal(itemFor(upgraded, earlyItem.id).itemLevel, 21);

  let late = newRun(914, 'manual');
  late = transition(late, { type: 'debug', operation: 'jump', stage: 5, row: 48 });
  late = transition(late, { type: 'debug', operation: 'item', base: CHAPTER_LOOT[5][0] });
  assert.ok(late.inventory[0].itemLevel >= 59);
});

test('结算奖励只把独立技能牌收入候补，且章节逐步开放技能池', () => {
  let state = newRun(915, 'manual');
  state.phase = 'reward'; state.enemy.hp = 0; state.choices = ['riposte', 'leech', 'quick'];
  const initialDeckCount = state.deck.length;
  const initialLibraryCount = state.cardLibrary.length;
  const first = transition(state, { type: 'reward', key: 'riposte' });
  assert.equal(first.deck.length, initialDeckCount);
  assert.equal(first.cardLibrary.length, initialLibraryCount + 1);
  assert.equal(card(first.cardLibrary.at(-1)).rank, skillRewardRank(state, 'riposte'));
  first.phase = 'reward'; first.enemy.hp = 0; first.choices = ['riposte', 'leech', 'quick'];
  const second = transition(first, { type: 'reward', key: 'riposte' });
  assert.equal(second.deck.length, initialDeckCount);
  assert.equal(second.cardLibrary.length, initialLibraryCount + 2);
  assert.equal(second.cardLibrary.filter(key => card(key).baseKey === 'riposte').length, 2);

  let late = newRun(916, 'manual');
  late.stage = 5; late.phase = 'combat'; late.enemy = { hp: 1, maxHp: 1, block: 0, mark: 0 }; late.hand = ['slash']; late.energy = 3;
  late = transition(late, { type: 'play', index: 0 });
  assert.ok(late.choices.every(key => REWARDS.includes(key) || key === CORE_REWARDS[late.character]));
  assert.ok(late.choices.some(key => !new Set(late.cardLibrary.map(key => card(key).baseKey)).has(key)));
});

test('三名角色的核心牌均在连续两次未出现后保底', () => {
  for (const character of Object.keys(CORE_REWARDS)) {
    let state = newRun(920, 'manual', 'standard', character);
    state.coreRewardMisses = 2;
    state.phase = 'combat'; state.enemy = { hp: 1, maxHp: 1, block: 0, mark: 0 }; state.hand = ['slash']; state.energy = 3;
    state = transition(state, { type: 'play', index: 0 });
    assert.equal(state.choices.length, 3);
    assert.equal(new Set(state.choices).size, 3);
    assert.ok(state.choices.includes(CORE_REWARDS[character]));
    assert.equal(state.coreRewardMisses, 0);
  }
});

test('该该的本命卡是蜂蜜牛奶，并与其他角色使用相同保底', () => {
  let state = newRun(921, 'manual', 'standard', 'gaigai');
  state.coreRewardMisses = 2;
  state.phase = 'combat'; state.enemy = { hp: 1, maxHp: 1, block: 0, mark: 0 }; state.hand = ['slash']; state.energy = 3;
  state = transition(state, { type: 'play', index: 0 });
  assert.equal(CORE_REWARDS.gaigai, 'mend');
  assert.ok(state.choices.includes('mend'));
  assert.equal(state.coreRewardMisses, 0);
});

test('卡组按类型和同名牌分组，同名高等级排在前面', () => {
  const keys = ['guard', 'leech', 'slash', 'leech+2', 'mark', 'guard+3'];
  const sorted = [...keys].sort(compareCardKeys);
  assert.ok(sorted.indexOf('leech+2') < sorted.indexOf('leech'));
  assert.equal(sorted.indexOf('leech'), sorted.indexOf('leech+2') + 1);
  assert.ok(sorted.indexOf('slash') < sorted.indexOf('mark'));
  assert.ok(sorted.indexOf('mark') < sorted.indexOf('guard+3'));
});

test('技能掉落等级只由新旧章节与普通、精英、Boss 决定', () => {
  for (const key of REWARDS) {
    const origin = SKILL_UNLOCKS[key];
    for (let stage = origin; stage < 6; stage++) {
      const normal = newRun(930 + stage, 'manual'); normal.stage = stage;
      const expected = Math.min(10, 1 + (stage - origin) * 2);
      normal.mapRow = 1;
      assert.equal(skillRewardRank(normal, key), expected);
      normal.mapRow = 47;
      assert.equal(skillRewardRank(normal, key), expected);
      const elite = structuredClone(normal); elite.elite = true;
      assert.equal(skillRewardRank(elite, key), Math.min(10, expected + 1));
      const boss = structuredClone(normal); boss.bossFight = true;
      assert.equal(skillRewardRank(boss, key), Math.min(10, expected + 2));
    }
  }
  for (let chapter = 0; chapter < 6; chapter++) assert.ok(REWARDS.filter(key => SKILL_UNLOCKS[key] === chapter).length >= 6);
});

test('新增结构化卡牌效果的预计值与实际结算一致', () => {
  const state = enterBattle(942);
  state.enemy = { hp: 500, maxHp: 500, block: 0, mark: 4, charge: 0 };
  state.block = 20; state.energy = 9;
  for (const key of ['tideTurn', 'exposeTruth', 'silentAnswer']) {
    const current = structuredClone(state);
    current.hand = [key];
    const expected = attackPreview(current, key);
    const played = transition(current, { type: 'play', index: 0 });
    assert.equal(current.enemy.hp - played.enemy.hp, expected, key);
  }
});

test('回收牌只取回手牌空位数量且不会让其余弃牌消失', () => {
  const state = enterBattle(829);
  state.hand = ['returnedLetter', ...Array(8).fill('guard')];
  state.discard = ['slash', 'mark'];
  state.energy = 3;
  const next = transition(state, { type: 'play', index: 0 });
  assert.equal(next.hand.length, 9);
  assert.ok(next.hand.includes('mark'));
  assert.ok(next.discard.includes('slash'));
  assert.ok(next.discard.includes('returnedLetter'));
  assert.ok(next.battleLog.some(line => line.includes('取回 1 张弃牌')));
});

test('后期敌人意图依次提供蓄力、驱散、治疗压制与牌堆干扰', () => {
  const state = enterBattle(943);
  state.stage = 5; state.enemy.charge = 0;
  state.turn = 4;
  assert.equal(intent(state).kind, 'charge');
  state.enemy.charge = 33;
  assert.deepEqual(intent(state), { kind: 'chargedAttack', value: 33 });
  state.enemy.charge = 0; state.turn = 2;
  assert.equal(intent(state).kind, 'dispel');
  state.turn = 3;
  assert.equal(intent(state).kind, 'suppress');
  state.turn = 5;
  assert.equal(intent(state).kind, 'jam');
});

test('装备掉落数量符合普通、精英与 Boss 的层级范围', () => {
  const average = flags => {
    const state = newRun(944);
    Object.assign(state, flags);
    let total = 0;
    for (let index = 0; index < 10000; index++) total += equipmentDropCount(state);
    return total / 10000;
  };
  const normal = average({ elite: false, bossFight: false });
  const elite = average({ elite: true, bossFight: false });
  const boss = average({ elite: false, bossFight: true });
  assert.ok(normal > .7 && normal < .86);
  assert.ok(elite > 1.7 && elite < 1.9);
  assert.ok(boss > 2.5 && boss < 2.7);
});

test('满级技能与初级技能形成明显数值代差', () => {
  assert.equal(card('heavy+10').rank, 10);
  assert.ok(card('heavy+10').damage >= card('heavy').damage * 4);
  assert.ok(card('guard+10').block >= card('guard').block * 4);
});

test('认真倾听的弱点与护盾统一按等级倍率成长', () => {
  const markProgression = [3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  const blockProgression = [2, 3, 3, 4, 5, 5, 6, 7, 7, 8];
  markProgression.forEach((mark, index) => {
    const ranked = card(index === 0 ? 'mark' : `mark+${index + 1}`);
    assert.equal(ranked.mark, mark);
    assert.equal(ranked.block, blockProgression[index]);
    assert.equal(ranked.draw || 0, 0);
  });
});

test('旧日回声只在使用前已有弱点时增加标记', () => {
  const state = enterBattle(814);
  Object.assign(state, { character: 'gaigai', traitUsed: true, hand: ['echo'], draw: [], energy: 3 });
  state.enemy.mark = 0;
  assert.equal(transition(state, { type: 'play', index: 0 }).enemy.mark, 4);

  const marked = enterBattle(815);
  Object.assign(marked, { character: 'gaigai', traitUsed: true, hand: ['echo'], draw: [], energy: 3 });
  marked.enemy.mark = 2;
  assert.equal(transition(marked, { type: 'play', index: 0 }).enemy.mark, 8);
});

test('看清真相只引爆使用前的弱点并保留新发现层数', () => {
  const state = enterBattle(816);
  Object.assign(state, { character: 'gaigai', traitUsed: true, hand: ['exposeTruth'], draw: [], energy: 3 });
  state.enemy = { hp: 200, maxHp: 200, block: 0, mark: 4, charge: 0 };
  const next = transition(state, { type: 'play', index: 0 });
  assert.equal(state.enemy.hp - next.enemy.hp, 20);
  assert.equal(next.enemy.mark, 14);
});

test('开场白升级只提高伤害且弱点始终固定一层', () => {
  const damageCurve = Array.from({ length: 10 }, (_, index) => card(index ? `openingNote+${index + 1}` : 'openingNote'));
  assert.equal(damageCurve[0].damage, 6);
  assert.ok(damageCurve.at(-1).damage > damageCurve[0].damage);
  assert.ok(damageCurve.every(ranked => ranked.mark === 1));
});

test('每件装备都有明确的图集映射', () => {
  assert.deepEqual(new Set(Object.keys(EQUIPMENT_ART)), new Set(Object.keys(ITEMS)));
  for (const art of Object.values(EQUIPMENT_ART)) {
    assert.ok(Number.isInteger(art) ? art >= 0 && art < 48 : art.atlas === 'skill' && art.index >= 0 && art.index < 25);
  }
});

test('装备独有特性与自带技能会真实进入战斗规则', () => {
  const state = newRun(315, 'manual');
  state.inventory.push({ id: 'gear-3', base: 'morningShears', rarity: '普通', affixes: [], skill: ITEMS.morningShears.skill || null });
  state.equipment.weapon = 'gear-3';
  state.nextItemId = 4;
  const battle = transition(leaveHub(state), { type: 'node', id: 'c0r0n0' });
  battle.hand = ['slash', 'slash']; battle.energy = 3;
  assert.equal(attackPreview(battle, 'slash'), 11);
  const afterFirst = transition(battle, { type: 'play', index: 0 });
  assert.equal(attackPreview(afterFirst, 'slash'), 9);
});

test('手动模式首次战斗显示教学，自动模式直接开始托管', () => {
  const manual = newRun(316, 'manual');
  assert.equal(manual.tutorialDone, false);
  manual.phase = 'combat';
  const ready = transition(manual, { type: 'tutorialDone' });
  assert.equal(ready.tutorialDone, true);
  assert.deepEqual(transition(ready, { type: 'tutorialDone' }), ready);

  const automatic = newRun(317, 'auto');
  assert.equal(automatic.battleMode, 'auto');
  assert.equal(automatic.tutorialDone, true);
});

test('同一地区可以掉落零到多件独立装备，装备技能会加入战斗牌组', () => {
  let state = enterBattle(310);
  state.hand = ['slash']; state.energy = 3; state.enemy.hp = 1;
  state = transition(state, { type: 'play', index: 0 });
  const firstCount = state.inventory.length;
  state.phase = 'combat'; state.enemy.hp = 1; state.enemy.maxHp = 10; state.hand = ['slash']; state.energy = 3;
  state = transition(state, { type: 'play', index: 0 });
  assert.ok(state.inventory.length >= firstCount && state.inventory.length <= firstCount + 3);

  const skillItem = state.inventory[0];
  skillItem.skill = 'mend'; skillItem.skillLevel = 4;
  state.equipment[ITEMS[skillItem.base].slot] = skillItem.id;
  state.phase = 'map'; state.mapRow = -1; state.currentNode = null; state.visited = [];
  const battle = transition(state, { type: 'node', id: 'c0r0n0' });
  assert.ok([...battle.hand, ...battle.draw].includes('mend+4~gear'));
  assert.equal(card('mend~gear').cost, 0);
  assert.equal(card('mend').cost, 1);
  const restoredBattle = restore(serialize(battle));
  assert.ok([...restoredBattle.hand, ...restoredBattle.draw].includes('mend+4~gear'));
});

test('房车工坊可以重抽随机词条并拆解闲置装备', () => {
  const state = newRun(311);
  state.gold = 100;
  state.inventory.push({ id: 'gear-3', base: 'emberCharm', rarity: '稀有', affixes: [{ key: 'attack', value: 1, prefix: '敏锐的' }], skill: 'mend' });
  state.nextItemId = 4;
  const rerolled = transition(state, { type: 'reroll', key: 'gear-3' });
  assert.equal(rerolled.gold, 58);
  assert.equal(itemFor(rerolled, 'gear-3').skill, 'mend');
  assert.equal(itemFor(rerolled, 'gear-3').affixes.length, 3);
  const salvaged = transition(rerolled, { type: 'salvage', key: 'gear-3' });
  assert.equal(salvaged.gold, 82);
  assert.equal(itemFor(salvaged, 'gear-3'), null);
});

test('批量售卖只处理指定的未穿戴装备', () => {
  const state = newRun(31101);
  const plain = { id: 'gear-3', base: 'emberCharm', itemLevel: 1, rarity: '普通', affixes: [], skill: null, skillLevel: 0 };
  const skilled = { id: 'gear-4', base: 'flowerPostcard', itemLevel: 1, rarity: '普通', affixes: [], skill: 'postcard', skillLevel: 1 };
  state.inventory.push(plain, skilled);
  state.nextItemId = 5;
  const beforeGold = state.gold;
  const sold = transition(state, { type: 'bulkSalvage', ids: [plain.id, skilled.id, state.equipment.weapon] });
  assert.equal(itemFor(sold, plain.id), null);
  assert.equal(itemFor(sold, skilled.id), null);
  assert.ok(itemFor(sold, state.equipment.weapon));
  assert.equal(sold.gold, beforeGold + salvageValue(plain) + salvageValue(skilled));
});

test('房车设施提供永久成长并影响恢复与重抽费用', () => {
  let state = newRun(3111);
  state.gold = 1000;
  assert.equal(facilityCost(0), 80);
  state = transition(state, { type: 'upgradeFacility', key: 'rooms' });
  assert.equal(state.facilities.rooms, 1);
  assert.equal(state.maxHp, 76);
  state = transition(state, { type: 'upgradeFacility', key: 'workshop' });
  const rare = { id: 'gear-99', base: 'emberCharm', rarity: '稀有', affixes: [], skill: null };
  assert.ok(rerollCost(rare, state.facilities.workshop) < rerollCost(rare));
  state = transition(state, { type: 'upgradeFacility', key: 'kitchen' });
  assert.equal(state.facilities.kitchen, 1);
});

test('旅程委托按累计进度发放奖励并进入下一档', () => {
  let state = newRun(3112);
  state.victories = 12;
  const first = commissionStatus(state, 'battles');
  assert.equal(first.target, 12);
  state = transition(state, { type: 'claimCommission', key: 'battles' });
  assert.equal(state.gold, first.reward);
  assert.equal(state.commissionClaims.battles, 1);
  assert.equal(commissionStatus(state, 'battles').target, 24);
  const unchanged = transition(state, { type: 'claimCommission', key: 'battles' });
  assert.equal(unchanged, state);
});

test('完成三次客人梦境可领取一次专属传奇纪念品', () => {
  const state = newRun(312);
  state.clears[0] = 3;
  const rewarded = transition(state, { type: 'claimGuestReward', stage: 0 });
  const gift = itemFor(rewarded, rewarded.lastLoot);
  assert.equal(gift.rarity, '传奇');
  assert.ok(gift.skill);
  assert.equal(rewarded.guestRewards[0], true);
  const repeated = transition(rewarded, { type: 'claimGuestReward', stage: 0 });
  assert.equal(repeated.inventory.length, rewarded.inventory.length);
});

test('普通战斗后继续本章路线，不会提前跳章', () => {
  const state = enterBattle(13);
  state.hand = ['slash'];
  state.energy = 3;
  state.enemy.hp = 1;
  const reward = transition(state, { type: 'play', index: 0 });
  assert.equal(reward.phase, 'reward');
  assert.equal(reward.choices.length, 3);
  const map = transition(reward, { type: 'reward', key: reward.choices[0] });
  assert.equal(map.phase, 'map');
  assert.ok(map.cardLibrary.some(key => card(key).baseKey === reward.choices[0]));
  assert.equal(map.deck.length, 10);
  assert.equal(map.stage, 0);
  const nodes = buildChapterMap(0, map.mapSeed);
  const current = nodes.find(node => node.id === map.currentNode);
  const next = transition(map, { type: 'node', id: current.links[0] });
  assert.notEqual(next, map);
  assert.equal(next.stage, 0);
  assert.ok(['combat', 'mystery', 'checkpoint'].includes(next.phase));
});

test('普通节点返回房车会随机遗失一件本段获得且未装备的物品', () => {
  const state = leaveHub(newRun(130));
  const protectedItem = { id: 'gear-3', base: 'gardenLedger', rarity: '普通', affixes: [], skill: null };
  const lostItem = { id: 'gear-4', base: 'greenhouseApron', rarity: '普通', affixes: [], skill: null };
  state.inventory.push(protectedItem, lostItem);
  state.unsecuredLoot = [protectedItem.id, lostItem.id];
  state.equipment[ITEMS[protectedItem.base].slot] = protectedItem.id;
  state.mapRow = 4; state.currentNode = 'c0r4n0'; state.visited = [state.currentNode];
  const returned = transition(state, { type: 'returnHub' });
  assert.equal(returned.phase, 'hub');
  assert.ok(itemFor(returned, protectedItem.id));
  assert.equal(itemFor(returned, lostItem.id), null);
  assert.deepEqual(returned.unsecuredLoot, []);
  assert.match(returned.log[0], /遗失了本段夜程获得的/);
});

test('普通节点返回房车也可能遗失本段获得的卡牌', () => {
  const state = leaveHub(newRun(1301));
  state.deck.push('listen+2');
  state.unsecuredCards = ['listen+2'];
  state.journeyCardDrops = ['listen+2'];
  state.mapRow = 4; state.currentNode = 'c0r4n0'; state.visited = [state.currentNode];
  const returned = transition(state, { type: 'returnHub' });
  assert.equal(returned.deck.includes('listen+2'), false);
  assert.deepEqual(returned.unsecuredCards, []);
  assert.deepEqual(returned.journeyCardDrops, []);
  assert.match(returned.log[0], /遗失了本段夜程获得的技能/);
});

test('旅途中不能更换装备', () => {
  const state = leaveHub(newRun(1302));
  const originalWeapon = state.equipment.weapon;
  const replacement = { id: 'gear-3', base: 'oldPen', rarity: '普通', itemLevel: 1, affixes: [], skill: null, skillLevel: 0 };
  state.inventory.push(replacement);
  assert.equal(transition(state, { type: 'equip', key: replacement.id }), state);
  assert.equal(state.equipment.weapon, originalWeapon);
});

test('房车内可以一键装备各部位评分最高的物品', () => {
  const state = newRun(1303);
  state.inventory.push(
    { id: 'gear-3', base: 'crownBlade', rarity: '稀有', itemLevel: 21, affixes: [], skill: null, skillLevel: 0 },
    { id: 'gear-4', base: 'emberCharm', rarity: '精良', itemLevel: 12, affixes: [], skill: null, skillLevel: 0 },
  );
  state.nextItemId = 5;
  const equipped = transition(state, { type: 'equipBest' });
  assert.equal(equipped.equipment.weapon, 'gear-3');
  assert.equal(equipped.equipment.charm, 'gear-4');
  assert.equal(equipped.equipment.armor, 'gear-2');
});

test('返回房车后重新进入不会刷新当前地图', () => {
  let state = newRun(2203, 'manual', 'standard');
  state = transition(state, { type: 'depart', stage: 0 });
  const originalSeed = state.mapSeed;
  const originalMap = buildChapterMap(0, originalSeed);
  state = { ...state, mapRow: 3, currentNode: 'c0r3n0', visited: ['c0r3n0'] };
  state = transition(state, { type: 'returnHub' });
  state = transition(state, { type: 'depart', stage: 0 });
  assert.equal(state.mapSeed, originalSeed);
  assert.deepEqual(buildChapterMap(0, state.mapSeed), originalMap);
});

test('返回房车会恢复全部生命，再次启程保持满血', () => {
  let state = leaveHub(newRun(2204, 'manual', 'standard'));
  state.hp = 31;
  state.mapRow = 3; state.currentNode = 'c0r3n0'; state.visited = [state.currentNode];
  state = transition(state, { type: 'returnHub' });
  assert.equal(state.hp, state.maxHp);
  state = transition(state, { type: 'depart', stage: 0 });
  assert.equal(state.hp, state.maxHp);
});

test('未知站点结果来自完整随机池，揭晓后可以重置', () => {
  assert.deepEqual(new Set(MYSTERY_STATIONS.map(station => station.type)), new Set(['event', 'camp', 'memory', 'loadout', 'blackMarket', 'negative']));
  assert.deepEqual(Object.fromEntries(MYSTERY_STATIONS.map(station => [station.type, station.weight])), { event: 22, camp: 18, memory: 36, loadout: 6, blackMarket: 8, negative: 10 });
  let state = leaveHub(newRun(2205));
  const nodes = buildChapterMap(0, state.mapSeed);
  const mystery = nodes.find(node => node.type === 'mystery');
  const parent = nodes.find(node => node.links.includes(mystery.id));
  state.mapRow = parent.row; state.currentNode = parent.id; state.visited = [parent.id];
  state = transition(state, { type: 'node', id: mystery.id });
  assert.equal(state.phase, 'mystery');
  assert.ok(MYSTERY_STATIONS.some(station => station.type === state.mysteryResult));
  state.mysteryResult = 'negative';
  state = transition(state, { type: 'mystery' });
  state.gold = 123;
  const hpBefore = state.hp;
  assert.equal(magicHouseCooldownRemaining(state, mystery.id), 15);
  const untouched = nodes.find(node => node.type === 'mystery' && node.id !== mystery.id);
  assert.equal(magicHouseCooldownRemaining(state, untouched.id), 0);
  state = transition(state, { type: 'negative', choice: 'continue' });
  assert.equal(state.phase, 'map');
  assert.equal(state.mysteryResult, null);
  assert.equal(DISORDER_GOLD_LOSS_PERCENT, 20);
  assert.equal(disorderGoldLoss(123), 25);
  assert.equal(state.gold, 98);
  assert.equal(state.hp, hpBefore);
});

test('夜路黑市生成一张暗牌、三张明牌和高品质成品装备', () => {
  const state = leaveHub(newRun(3231, 'manual'));
  state.phase = 'mystery';
  state.mysteryResult = 'blackMarket';
  state.gold = 1000;
  const market = transition(state, { type: 'mystery' });
  assert.equal(market.phase, 'blackMarket');
  assert.deepEqual(market.blackMarketOffers.map(offer => offer.id), ['random-card', 'shown-card-1', 'shown-card-2', 'shown-card-3', 'gear']);
  const randomCard = market.blackMarketOffers.find(offer => offer.kind === 'randomCard');
  const shownCards = market.blackMarketOffers.filter(offer => offer.kind === 'card');
  const gear = market.blackMarketOffers.find(offer => offer.kind === 'gear');
  assert.equal(card(randomCard.key).rank, 3);
  assert.equal(shownCards.length, 3);
  assert.ok(shownCards.every(offer => card(offer.key).rank === 2));
  assert.equal(new Set(shownCards.map(offer => card(offer.key).baseKey)).size, 3);
  assert.ok(shownCards.every(offer => card(randomCard.key).baseKey !== card(offer.key).baseKey));
  assert.equal(SKILL_UNLOCKS[card(randomCard.key).baseKey], 0);
  assert.ok(shownCards.every(offer => SKILL_UNLOCKS[card(offer.key).baseKey] === 0));
  assert.equal(randomCard.cost, BLACK_MARKET_RANDOM_CARD_PRICES[0]);
  assert.ok(shownCards.every(offer => offer.cost === BLACK_MARKET_SHOWN_CARD_PRICES[0]));
  assert.ok(['稀有', '传奇'].includes(gear.item.rarity));
  assert.ok(gear.item.itemLevel >= 5);
  assert.equal(gear.cost, blackMarketGearPrice(0, gear.item));
  assert.equal(BLACK_MARKET_GEAR_PRICES[0], 100);
  assert.deepEqual(restore(serialize(market)).blackMarketOffers, market.blackMarketOffers);
});

test('黑市牌等级和价格按当前路线段数提高', () => {
  assert.deepEqual([blackMarketCardRanks(0), blackMarketCardRanks(20), blackMarketCardRanks(40)], [
    { shown: 2, random: 3 },
    { shown: 3, random: 4 },
    { shown: 4, random: 5 },
  ]);
  assert.ok(blackMarketCardPrice(0, 3, 'card') > blackMarketCardPrice(0, 2, 'card'));
  assert.ok(blackMarketCardPrice(0, 4, 'randomCard') > blackMarketCardPrice(0, 3, 'randomCard'));
});

test('黑市允许连续兑换，已兑换商品消失且其余商品保留', () => {
  const state = leaveHub(newRun(3232, 'manual'));
  state.phase = 'mystery';
  state.mysteryResult = 'blackMarket';
  state.gold = 1000;
  const market = transition(state, { type: 'mystery' });
  const randomOffer = market.blackMarketOffers[0];
  let boughtCard = transition(market, { type: 'blackMarketBuy', id: randomOffer.id });
  assert.equal(boughtCard.phase, 'blackMarket');
  assert.equal(boughtCard.gold, 1000 - randomOffer.cost);
  assert.ok(boughtCard.cardLibrary.includes(randomOffer.key));
  assert.ok(boughtCard.unsecuredCards.includes(randomOffer.key));
  assert.equal(boughtCard.blackMarketOffers.length, 4);
  assert.ok(!boughtCard.blackMarketOffers.some(offer => offer.id === randomOffer.id));

  const gearOffer = boughtCard.blackMarketOffers.find(offer => offer.kind === 'gear');
  const boughtGear = transition(boughtCard, { type: 'blackMarketBuy', id: gearOffer.id });
  assert.equal(boughtGear.phase, 'blackMarket');
  assert.equal(boughtGear.gold, 1000 - randomOffer.cost - gearOffer.cost);
  assert.ok(boughtGear.inventory.some(item => item.id === gearOffer.item.id));
  assert.ok(boughtGear.unsecuredLoot.includes(gearOffer.item.id));
  assert.ok(boughtGear.journeyNewItems.includes(gearOffer.item.id));
  assert.notEqual(boughtGear.equipment[ITEMS[gearOffer.item.base].slot], gearOffer.item.id);
  assert.deepEqual(boughtGear.lastLoots, [gearOffer.item.id]);
  assert.equal(boughtGear.blackMarketOffers.length, 3);
  assert.ok(!boughtGear.blackMarketOffers.some(offer => offer.id === gearOffer.id));

  const equippedGear = transition(boughtGear, { type: 'equipAcquired', kind: 'gear', key: gearOffer.item.id });
  assert.equal(equippedGear.equipment[ITEMS[gearOffer.item.base].slot], gearOffer.item.id);
});

test('支线商店展示确定的高品质装备且购买后可直接选择装备', () => {
  let state = leaveHub(newRun(3233, 'manual'), 1);
  state.gold = 500;
  state.sidePromises = [{ id: 'borrowedUmbrella', choice: 'borrow', type: 'shop', stage: 1, createdStep: 0, createdVictories: 0, dueStep: 6, shop: 'umbrella' }];
  state = transition(state, { type: 'debug', operation: 'sideExchange' });
  const gearOffer = state.pendingScene.goods.find(good => good.kind === 'gear');
  assert.ok(gearOffer.item);
  assert.ok(gearOffer.label.includes(ITEMS[gearOffer.item.base].name));
  assert.ok(['稀有', '传奇'].includes(gearOffer.item.rarity));
  assert.ok(['blueUmbrella', 'windowCoat', 'oathPlate'].includes(gearOffer.item.base));

  const previousEquipment = state.equipment[ITEMS[gearOffer.item.base].slot];
  const bought = transition(state, { type: 'sideShopBuy', id: gearOffer.id });
  assert.equal(bought.phase, 'map');
  assert.ok(itemFor(bought, gearOffer.item.id));
  assert.equal(bought.equipment[ITEMS[gearOffer.item.base].slot], previousEquipment);
  assert.deepEqual(bought.directEquipLootIds, [gearOffer.item.id]);
  const equipped = transition(bought, { type: 'equipAcquired', kind: 'gear', key: gearOffer.item.id });
  assert.equal(equipped.equipment[ITEMS[gearOffer.item.base].slot], gearOffer.item.id);
});

test('旧存档中的随机支线装备商品会补全为可预览的确定装备', () => {
  const state = leaveHub(newRun(3234, 'manual'), 1);
  state.phase = 'sideResolve';
  state.pendingScene = {
    storyId: 'borrowedUmbrella',
    kind: 'shop',
    title: '蓝柄旧伞回到伞店',
    text: '雨停时，老板出现在街角。',
    promise: { id: 'borrowedUmbrella', type: 'shop', stage: 1, createdStep: 0, createdVictories: 0, shop: 'umbrella' },
    goods: [{ id: 'gear', kind: 'gear', bases: ['blueUmbrella', 'windowCoat', 'oathPlate'], cost: 58, label: '一把收好雨声的长伞' }],
  };
  const prepared = transition(state, { type: 'prepareSideShop' });
  assert.ok(prepared.pendingScene.goods[0].item);
  assert.ok(['稀有', '传奇'].includes(prepared.pendingScene.goods[0].item.rarity));
});

test('支线交付纯候补卡时不会误判出战牌不足十张', () => {
  let state = leaveHub(newRun(2206));
  state.deck.pop();
  state.cardLibrary.push('quick', 'quick');
  state.phase = 'sideResolve';
  state.pendingScene = { storyId: 'marginNote', kind: 'turnin_cards', title: '页边多出一行字', text: '旧书自己翻开。', count: 2, school: '书信', key: 'unsent', rankBonus: 3, promise: { id: 'marginNote', type: 'turnin_cards', stage: 2, createdStep: 0, createdVictories: 0 } };
  const candidates = sideCardTurnInCandidates(state, { school: '书信' });
  const benched = candidates.filter(item => !item.active).slice(0, 2);
  assert.equal(benched.length, 2);
  state = transition(state, { type: 'sideTurnIn', indexes: benched.map(item => item.index) });
  assert.equal(state.phase, 'map');
  assert.equal(state.deck.length, 9);
  assert.ok(state.cardLibrary.some(key => key.startsWith('unsent')));
});

test('支线交付候选按低价值候补卡优先排序', () => {
  const state = newRun(22061, 'manual');
  state.cardLibrary = ['postcard+3', 'quick', 'quick', 'fortify', 'mend+3'];
  state.deck = ['mend+3'];
  state.unsecuredCards = ['postcard+3'];
  const candidates = sideCardTurnInCandidates(state);
  assert.deepEqual(candidates.map(item => item.key), ['quick', 'quick', 'fortify', 'postcard+3', 'mend+3']);
  assert.deepEqual(candidates.map(item => item.active), [false, false, false, false, true]);
  assert.equal(candidates.find(item => item.key === 'postcard+3').fresh, true);
});

test('牌组整备站可以调整出战与候补并继续赶路', () => {
  const state = leaveHub(newRun(2205, 'manual', 'standard'));
  state.phase = 'loadout';
  state.cardLibrary.push('riposte');
  const activated = transition(state, { type: 'loadout', operation: 'activate', key: 'riposte' });
  assert.equal(activated.deck.length, 11);
  const benched = transition(activated, { type: 'loadout', operation: 'bench', key: 'riposte' });
  assert.equal(benched.deck.length, 10);
  assert.equal(transition(benched, { type: 'loadout', operation: 'bench', key: 'slash' }), benched);
  const continued = transition(benched, { type: 'leaveLoadout' });
  assert.equal(continued.phase, 'map');
});

test('一键上阵会优先保留整理思绪', () => {
  const state = newRun(22051, 'manual', 'standard', 'uncle');
  state.cardLibrary = ['slash', 'slash', 'slash', 'slash', 'guard', 'guard', 'guard', 'mark', 'heavy', 'focus', 'nova', 'fortify', 'echo', 'postcard', 'blanket'];
  state.deck = ['slash', 'slash', 'slash', 'slash', 'guard', 'guard', 'guard', 'mark', 'heavy', 'nova'];
  const arranged = transition(state, { type: 'loadout', operation: 'activateAll' });
  assert.ok(arranged.deck.includes('focus'));
  assert.equal(arranged.deck.length, 10);
});

test('一键上阵按实际收益用热可可替换轻声问候', () => {
  const state = newRun(22052, 'manual', 'standard', 'uncle');
  state.cardLibrary.push('leech');
  const slashCount = state.deck.filter(key => key === 'slash').length;
  const arranged = transition(state, { type: 'loadout', operation: 'activateAll' });
  assert.ok(arranged.deck.includes('leech'));
  assert.equal(arranged.deck.filter(key => key === 'slash').length, slashCount - 1);
  assert.equal(arranged.deck.length, 10);
});

test('房车可以永久丢弃候补卡，但不能让出战牌组低于十张', () => {
  const state = newRun(2207, 'manual', 'standard');
  const initialSlashCount = state.cardLibrary.filter(key => key === 'slash').length;
  state.cardLibrary.push('slash');
  const discardedBench = transition(state, { type: 'loadout', operation: 'discard', key: 'slash' });
  assert.equal(discardedBench.cardLibrary.filter(key => key === 'slash').length, initialSlashCount);
  assert.equal(discardedBench.deck.length, 10);
  assert.equal(transition(discardedBench, { type: 'loadout', operation: 'discard', key: 'slash' }), discardedBench);
  const expanded = structuredClone(discardedBench);
  expanded.cardLibrary.push('finalPlatform'); expanded.deck.push('finalPlatform');
  const discardedActive = transition(expanded, { type: 'loadout', operation: 'discard', key: 'finalPlatform' });
  assert.equal(discardedActive.deck.length, 10);
  assert.ok(!discardedActive.cardLibrary.includes('finalPlatform'));
});

test('房车可以一次丢弃同等级卡的全部副本', () => {
  const state = newRun(2209, 'manual', 'standard');
  state.cardLibrary.push('riposte', 'riposte', 'finalPlatform');
  state.deck.push('finalPlatform');
  state.unsecuredCards = ['riposte', 'riposte'];
  state.journeyCardDrops = ['riposte', 'riposte'];
  state.journeyNewCards = ['riposte'];
  const discarded = transition(state, { type: 'loadout', operation: 'discardGroup', key: 'riposte' });
  assert.ok(!discarded.cardLibrary.includes('riposte'));
  assert.ok(discarded.cardLibrary.includes('finalPlatform'));
  assert.ok(discarded.deck.includes('finalPlatform'));
  assert.deepEqual(discarded.unsecuredCards, []);
  assert.deepEqual(discarded.journeyCardDrops, []);
  assert.deepEqual(discarded.journeyNewCards, []);
  assert.ok(discarded.log.some(line => line.includes('全部 2 张')));
  assert.equal(transition(newRun(2210), { type: 'loadout', operation: 'discardGroup', key: 'slash' }).deck.length, 10);
});

test('旅途中的整备站不能永久丢弃卡牌', () => {
  const state = leaveHub(newRun(2208, 'manual', 'standard'));
  state.phase = 'loadout'; state.cardLibrary.push('riposte');
  assert.equal(transition(state, { type: 'loadout', operation: 'discard', key: 'riposte' }), state);
  assert.equal(transition(state, { type: 'loadout', operation: 'discardGroup', key: 'riposte' }), state);
});

test('魔法屋冷却期间问号节点可以经过但不会再次抽取', () => {
  let state = leaveHub(newRun(2206));
  const nodes = buildChapterMap(0, state.mapSeed);
  const mystery = nodes.find(node => node.type === 'mystery');
  const parent = nodes.find(node => node.links.includes(mystery.id));
  state.mapRow = parent.row; state.currentNode = parent.id; state.visited = [parent.id];
  state.magicHouseCooldowns[`${state.mapSeed}:${mystery.id}`] = state.stepsTraveled + 10;
  state = transition(state, { type: 'node', id: mystery.id });
  assert.equal(state.phase, 'map');
  assert.ok(state.visited.includes(mystery.id));
  assert.equal(magicHouseCooldownRemaining(state, mystery.id), 9);
  assert.match(state.log[0], /再走 9 步/);
});

test('路标返回房车不会遗失未装备物品并恢复全部生命', () => {
  const state = leaveHub(newRun(131));
  const storedItem = { id: 'gear-3', base: 'gardenLedger', rarity: '普通', affixes: [], skill: null };
  state.inventory.push(storedItem); state.unsecuredLoot = [storedItem.id];
  state.mapRow = 9; state.checkpointRow = 9; state.currentNode = 'c0r9checkpoint'; state.visited = [state.currentNode]; state.hp = 23;
  const returned = transition(state, { type: 'returnHub' });
  assert.ok(itemFor(returned, storedItem.id));
  assert.deepEqual(returned.unsecuredLoot, []);
  assert.equal(returned.hp, returned.maxHp);
});

test('激活路标后可从房车传送回来且下一步固定进入战斗', () => {
  let state = leaveHub(newRun(132, 'manual'));
  state.mapRow = 9; state.currentNode = 'c0r9checkpoint'; state.visited = [state.currentNode]; state.phase = 'checkpoint';
  state = transition(state, { type: 'checkpoint', choice: 'rest' });
  assert.equal(state.chapterCheckpoints[0], 9);
  state = transition(state, { type: 'returnHub' });
  state.sideChapterTriggers[0] = 2; state.sideStoryQueue = [];
  state = transition(state, { type: 'depart', stage: 0 });
  assert.equal(state.mapRow, 9);
  assert.equal(state.checkpointRow, 9);
  assert.equal(state.currentNode, 'c0r9checkpoint');
  assert.deepEqual(state.visited, ['c0r9checkpoint']);
  const checkpoint = buildChapterMap(0, state.mapSeed).find(node => node.id === state.currentNode);
  assert.ok(checkpoint.links.length > 0);
  const battle = transition(state, { type: 'node', id: checkpoint.links[0] });
  assert.equal(battle.phase, 'combat');
});

test('已点亮的休息站可任选传送且重新走前段不会覆盖最远路标', () => {
  let state = newRun(133, 'manual');
  state.chapterCheckpoints[0] = 29;
  state = transition(state, { type: 'depart', stage: 0, row: -1 });
  assert.equal(state.mapRow, -1);
  state = transition({ ...state, phase: 'hub' }, { type: 'depart', stage: 0, row: 9 });
  assert.equal(state.mapRow, 9);
  assert.equal(state.currentNode, 'c0r9checkpoint');
  state.phase = 'checkpoint';
  state = transition(state, { type: 'checkpoint', choice: 'rest' });
  assert.equal(state.chapterCheckpoints[0], 29);
});

test('地图只允许沿连线前进，未知站点抵达后才揭晓事件', () => {
  const state = leaveHub(newRun(19));
  assert.equal(transition(state, { type: 'node', id: 'c0boss' }), state);
  const nodes = buildChapterMap(0, state.mapSeed);
  const eventNode = nodes.find(node => node.type === 'mystery' && node.row > 0);
  const parent = nodes.find(node => node.links.includes(eventNode.id));
  state.mapRow = parent.row; state.currentNode = parent.id; state.visited = [parent.id];
  let event = transition(state, { type: 'node', id: eventNode.id });
  assert.equal(event.phase, 'mystery');
  event.mysteryResult = 'event';
  event = transition(event, { type: 'mystery' });
  assert.equal(event.phase, 'event');
  const next = transition(event, { type: 'event', choice: 'bargain' });
  assert.equal(next.phase, 'map');
  assert.equal(next.gold, state.gold + 22);
  assert.equal(next.mysteryResult, null);
});

test('沿途事件和亮灯休息站数值随章节与生命上限成长', () => {
  const early = ambientEventValues({ stage: 0, maxHp: 70 });
  assert.deepEqual(early, { teaHeal: 12, photoHpCost: 5, photoGold: 22, campHeal: 18, pillowCost: 30, pillowBlock: 2, pillowBattles: 3 });
  const late = ambientEventValues({ stage: 5, maxHp: 190 });
  assert.ok(late.teaHeal > early.teaHeal);
  assert.ok(late.photoHpCost > early.photoHpCost);
  assert.ok(late.photoGold > early.photoGold);
  assert.ok(late.campHeal > early.campHeal);
  assert.ok(late.pillowCost > early.pillowCost);
  assert.ok(late.pillowBlock > early.pillowBlock);

  const event = newRun(2206, 'manual');
  Object.assign(event, { stage: 5, phase: 'event', maxHp: 190, hp: 100, gold: 0 });
  const tea = transition(event, { type: 'event', choice: 'spring' });
  assert.equal(tea.hp, 100 + late.teaHeal);
  const bargain = transition(event, { type: 'event', choice: 'bargain' });
  assert.equal(bargain.hp, 100 - late.photoHpCost);
  assert.equal(bargain.gold, late.photoGold);

  const camp = newRun(2207, 'manual');
  Object.assign(camp, { stage: 5, phase: 'camp', maxHp: 190, hp: 100, gold: 500 });
  const rested = transition(camp, { type: 'camp', choice: 'rest' });
  assert.equal(rested.hp, 100 + late.campHeal);
  const pillow = transition(camp, { type: 'camp', choice: 'relic' });
  assert.equal(pillow.gold, 500 - late.pillowCost);
  assert.equal(pillow.pillowBattles, late.pillowBattles);
  const equipmentBlock = equipmentStats(pillow).block;
  beginBattle(pillow);
  assert.equal(pillow.block, equipmentBlock + late.pillowBlock);
});

test('六个区域每次探索五十步且每步最多三个选择', () => {
  for (let chapter = 0; chapter < 6; chapter++) {
    const nodes = buildChapterMap(chapter);
    assert.equal(new Set(nodes.map(node => node.row)).size, MAP_STEPS);
    assert.ok(Math.max(...Array.from({ length: MAP_STEPS }, (_, row) => nodes.filter(node => node.row === row).length)) <= 3);
    assert.equal(nodes.filter(node => node.type === 'boss').length, 1);
    assert.ok(nodes.some(node => node.type === 'mystery'));
    assert.ok(nodes.every(node => ['battle', 'elite', 'mystery', 'checkpoint', 'boss'].includes(node.type)));
    const byId = Object.fromEntries(nodes.map(node => [node.id, node]));
    let current = nodes.find(node => node.row === 0), steps = 1;
    while (current.links.length) { current = byId[current.links[0]]; steps++; }
    assert.equal(steps, MAP_STEPS);
    assert.equal(current.type, 'boss');
  }
});

test('起点和每个路标后的第一步都固定为战斗', () => {
  for (let chapter = 0; chapter < 6; chapter++) {
    const nodes = buildChapterMap(chapter, 500 + chapter);
    for (const row of [0, 10, 20, 30, 40]) {
      const choices = nodes.filter(node => node.row === row);
      assert.ok(choices.length > 0);
      assert.ok(choices.every(node => node.type === 'battle'));
    }
  }
});

test('隐藏测试面板操作不会破坏存档并可跳转路标', () => {
  let state = newRun(818, 'manual');
  state = transition(state, { type: 'debug', operation: 'gold' });
  state = transition(state, { type: 'debug', operation: 'level' });
  state = transition(state, { type: 'debug', operation: 'unlockWorkshop' });
  assert.equal(state.workshopUnlocked, true);
  state = transition(state, { type: 'debug', operation: 'unlockGuests' });
  assert.ok(state.clears.reduce((sum, count) => sum + count, 0) >= 2);
  assert.ok(state.unlocked >= 1);
  state = transition(state, { type: 'debug', operation: 'item', base: 'morningShears', itemLevel: 47 });
  state = transition(state, { type: 'debug', operation: 'card', key: 'mend', rank: 7 });
  state = transition(state, { type: 'debug', operation: 'upgradeCards' });
  state = transition(state, { type: 'debug', operation: 'jump', stage: 3, row: 19 });
  assert.equal(state.gold, 1000);
  assert.equal(state.level, 2);
  assert.ok(state.inventory.some(item => item.base === 'morningShears' && item.itemLevel === 47));
  assert.ok(state.cardLibrary.some(key => card(key).baseKey === 'mend' && card(key).rank >= 7));
  assert.ok(state.deck.every(key => card(key).rank > 1));
  assert.equal(state.phase, 'map');
  assert.equal(state.stage, 3);
  assert.equal(state.currentNode, 'c3r19checkpoint');
  assert.equal(state.chapterCheckpoints[3], 19);
  assert.deepEqual(restore(serialize(state)), state);
});

test('测试面板可以直达全部魔法屋结果', () => {
  for (const [index, station] of MYSTERY_STATIONS.entries()) {
    const state = newRun(830 + index, 'manual');
    const opened = transition(state, { type: 'debug', operation: 'magicHouse', result: station.type });
    assert.equal(opened.phase, station.type);
    assert.equal(opened.mysteryResult, station.type);
    assert.equal(opened.lastMysteryResult, station.type);
    if (station.type === 'blackMarket') assert.equal(opened.blackMarketOffers.length, 5);
    else assert.equal(opened.blackMarketOffers, null);
    assert.deepEqual(restore(serialize(opened)), opened);
  }
  const state = newRun(840, 'manual');
  assert.equal(transition(state, { type: 'debug', operation: 'magicHouse', result: 'missing' }), state);
});

test('不同路线种子会生成不规则但始终可达的地图', () => {
  const first = buildChapterMap(0, 101);
  const second = buildChapterMap(0, 202);
  assert.notDeepEqual(first.map(node => [node.row, node.x, node.links]), second.map(node => [node.row, node.x, node.links]));
  assert.ok(first.some(node => node.row > 0 && node.row < 49 && node.x !== 20 && node.x !== 50 && node.x !== 80));
  for (const target of first.filter(node => node.row > 0)) {
    assert.ok(first.some(node => node.links.includes(target.id)));
  }
});

test('开局难度贯穿整局且会改变敌人强度', () => {
  const standard = newRun(55, 'manual');
  assert.equal(standard.difficulty, 'standard');
  const relaxed = newRun(55, 'manual', 'relaxed');
  assert.equal(transition(relaxed, { type: 'difficulty', difficulty: 'challenge' }).difficulty, 'relaxed');
  const standardBattle = transition(leaveHub(standard), { type: 'node', id: 'c0r0n0' });
  const relaxedBattle = transition(leaveHub(relaxed), { type: 'node', id: 'c0r0n0' });
  assert.ok(standardBattle.enemy.maxHp > relaxedBattle.enemy.maxHp);
});

test('所有难度均按卡面治疗，标准和挑战难度由护盾穿透提高压力', () => {
  const relaxed = enterBattle(551, 'manual');
  relaxed.difficulty = 'relaxed'; relaxed.hp = 40; relaxed.hand = ['mend']; relaxed.energy = 1;
  const relaxedHeal = transition(relaxed, { type: 'play', index: 0 }).hp - relaxed.hp;
  const challenge = structuredClone(relaxed);
  challenge.difficulty = 'challenge';
  const challengeHeal = transition(challenge, { type: 'play', index: 0 }).hp - challenge.hp;
  assert.equal(relaxedHeal, challengeHeal);

  relaxed.hand = []; relaxed.block = 100;
  challenge.hand = []; challenge.block = 100;
  assert.equal(transition(relaxed, { type: 'end' }).hp, relaxed.hp);
  assert.ok(transition(challenge, { type: 'end' }).hp < challenge.hp);
});

test('暖灯休息站可回满后继续或无额外收益地返回房车', () => {
  const state = leaveHub(newRun(36, 'manual'));
  state.sideChapterTriggers[0] = 2; state.sideStoryQueue = [];
  state.mapRow = 8; state.currentNode = 'c0r8n1'; state.visited = [state.currentNode]; state.hp = 20;
  const checkpoint = transition(state, { type: 'node', id: 'c0r9checkpoint' });
  assert.equal(checkpoint.phase, 'checkpoint');
  let rested = transition(checkpoint, { type: 'checkpoint', choice: 'rest' });
  if (['sideStory', 'sideResolve'].includes(rested.phase)) rested = transition(rested, { type: 'debug', operation: 'clearStories' });
  assert.equal(rested.phase, 'map');
  assert.equal(rested.hp, rested.maxHp);

  const returned = transition(checkpoint, { type: 'checkpoint', choice: 'returnHub' });
  assert.equal(returned.phase, 'hub');
  assert.equal(returned.chapterCheckpoints[0], 9);
  assert.equal(returned.hp, returned.maxHp);
});

test('战斗结算可以只放弃选牌并保留装备奖励', () => {
  const state = enterBattle(364);
  state.hand = ['slash']; state.energy = 3; state.enemy.hp = 1;
  const reward = transition(state, { type: 'play', index: 0 });
  const librarySize = reward.cardLibrary.length;
  const inventorySize = reward.inventory.length;
  const continued = transition(reward, { type: 'reward', key: null });
  assert.equal(continued.phase, 'map');
  assert.equal(continued.cardLibrary.length, librarySize);
  assert.equal(continued.inventory.length, inventorySize);
});

test('整理回忆站用两张同名同等级技能合成一张高一级技能', () => {
  const state = leaveHub(newRun(363, 'manual'));
  state.phase = 'memory';
  state.currentNode = 'c0r5n0';
  state.mapRow = 5;
  state.stepsTraveled = 6;
  state.deck = ['slash', 'slash', 'slash+2', 'slash+2', 'guard'];
  state.cardLibrary = [...state.deck];
  state.unsecuredCards = ['slash', 'slash'];
  state.journeyCardDrops = ['slash', 'slash'];
  const merged = transition(state, { type: 'memory', cardKey: 'slash' });
  assert.equal(merged.phase, 'map');
  assert.equal(merged.deck.length, 4);
  assert.equal(merged.deck.filter(key => key === 'slash').length, 0);
  assert.equal(merged.deck.filter(key => key === 'slash+2').length, 3);
  assert.equal(merged.cardLibrary.filter(key => key === 'slash+2').length, 3);
  assert.deepEqual(merged.unsecuredCards, ['slash+2']);
  assert.deepEqual(merged.journeyCardDrops, ['slash+2']);

  const mismatched = structuredClone(state);
  mismatched.phase = 'memory';
  mismatched.deck = ['slash', 'slash+2', 'guard'];
  mismatched.cardLibrary = [...mismatched.deck];
  assert.equal(transition(mismatched, { type: 'memory', cardKey: 'slash' }), mismatched);

  const capped = structuredClone(state);
  capped.phase = 'memory';
  capped.deck = ['slash+10', 'slash+10'];
  capped.cardLibrary = [...capped.deck];
  assert.equal(transition(capped, { type: 'memory', cardKey: 'slash+10' }), capped);
});

test('四个里程碑都可选择回满继续或回满返回房车', () => {
  assert.deepEqual(Object.keys(CHECKPOINTS).map(Number), [10, 20, 30, 40]);
  assert.equal(new Set(Object.values(CHECKPOINTS).map(stop => stop.title)).size, 4);

  const restChoices = ['rest', 'shortRest', 'cinemaRest', 'deepRest'];
  for (const [index, step] of CHECKPOINT_STEPS.entries()) {
    const base = leaveHub(newRun(360 + index, 'manual'));
    base.phase = 'checkpoint'; base.mapRow = step - 1; base.hp = 20;
    const rested = transition(base, { type: 'checkpoint', choice: restChoices[index] });
    assert.equal(rested.phase, 'map');
    assert.equal(rested.hp, rested.maxHp);

    const returned = transition(base, { type: 'checkpoint', choice: 'returnHub' });
    assert.equal(returned.phase, 'hub');
    assert.equal(returned.hp, returned.maxHp);
    assert.deepEqual(returned.inventory, base.inventory);
    assert.deepEqual(returned.cardLibrary, base.cardLibrary);
  }
});

test('房车工坊仅在抵达夜路杂货铺后解锁', () => {
  const state = leaveHub(newRun(3610, 'manual'));
  state.stepsTraveled = 99;
  state.inventory.push(...Array.from({ length: 8 }, (_, index) => ({
    id: `gear-${index + 3}`,
    base: 'gardenLedger',
    itemLevel: 1,
    rarity: '普通',
    affixes: [],
    skill: null,
    skillLevel: 0,
  })));
  state.nextItemId = 11;
  assert.equal(state.workshopUnlocked, false);

  const nodes = buildChapterMap(0, state.mapSeed);
  const shop = nodes.find(node => node.type === 'checkpoint' && node.row === 19);
  const parent = nodes.find(node => node.links.includes(shop.id));
  state.mapRow = parent.row;
  state.currentNode = parent.id;
  state.visited = [parent.id];
  const arrived = transition(state, { type: 'node', id: shop.id });
  assert.equal(arrived.phase, 'checkpoint');
  assert.equal(arrived.workshopUnlocked, true);
});

test('战败后可以复活回房车但会遗失身上装备', () => {
  const state = leaveHub(newRun(361, 'manual'));
  const spareItem = { id: 'gear-3', base: 'gardenLedger', itemLevel: 1, rarity: '普通', affixes: [], skill: null, skillLevel: 0 };
  state.inventory.push(spareItem);
  state.mapRow = 23; state.currentNode = 'c0r23n1'; state.visited = ['c0r9checkpoint', 'c0r19checkpoint', state.currentNode];
  state.checkpointRow = 19; state.level = 3; state.hp = 0; state.phase = 'lost';
  const retried = transition(state, { type: 'retry' });
  assert.equal(retried, state);
  assert.equal(retried.phase, 'lost');
  assert.equal(retried.hp, 0);
  const revived = transition(state, { type: 'revive' });
  assert.equal(revived.phase, 'hub');
  assert.equal(revived.hp, revived.maxHp);
  assert.deepEqual(revived.equipment, { weapon: null, armor: null, bag: null, scarf: null, charm: null, decor: null });
  assert.equal(itemFor(revived, 'gear-1'), null);
  assert.equal(itemFor(revived, 'gear-2'), null);
  assert.ok(itemFor(revived, spareItem.id));
  assert.match(revived.log[0], /身上装备全部遗失/);
});

test('战败后可以花旅币买活并保留身上装备', () => {
  const state = leaveHub(newRun(362, 'manual'));
  state.mapRow = 23; state.currentNode = 'c0r23n1'; state.visited = [state.currentNode];
  state.level = 5; state.hp = 0; state.phase = 'lost';
  state.gold = reviveCost(state) - 1;
  const poor = transition(state, { type: 'reviveWithGold' });
  assert.equal(poor, state);

  state.gold = reviveCost(state) + 20;
  const bought = transition(state, { type: 'reviveWithGold' });
  assert.equal(bought.phase, 'hub');
  assert.equal(bought.hp, bought.maxHp);
  assert.equal(bought.gold, 20);
  assert.equal(bought.equipment.weapon, 'gear-1');
  assert.equal(bought.equipment.armor, 'gear-2');
  assert.ok(itemFor(bought, 'gear-1'));
  assert.ok(itemFor(bought, 'gear-2'));
  assert.match(bought.log[0], /买活/);
});

test('击败区域 Boss 后返回房车并解锁下一站', () => {
  const state = leaveHub(newRun(37, 'manual'));
  const originalMapSeed = state.mapSeed;
  state.mapRow = 48; state.currentNode = 'c0r48n1'; state.visited = ['c0r48n1'];
  const boss = transition(state, { type: 'node', id: 'c0boss' });
  assert.equal(boss.bossFight, true);
  if (boss.phase === 'mainStory') Object.assign(boss, transition(boss, { type: 'mainStoryContinue' }));
  boss.enemy.hp = 1; boss.hand = ['slash']; boss.energy = 3;
  const reward = transition(boss, { type: 'play', index: 0 });
  let hub = transition(reward, { type: 'reward', key: reward.choices[0] });
  while (hub.phase === 'mainStory') hub = transition(hub, { type: 'mainStoryContinue' });
  assert.equal(hub.phase, 'hub');
  assert.equal(hub.unlocked, 1);
  assert.equal(hub.stage, 1);
  assert.equal(hub.clears[0], 1);
  assert.equal(hub.mapRow, -1);
  assert.deepEqual(hub.visited, []);
  assert.notEqual(hub.mapSeed, originalMapSeed);
});

test('已通关区域可以反复探索并累计次数', () => {
  let state = newRun(41, 'manual');
  for (let run = 0; run < 2; run++) {
    state = leaveHub(state, 0);
    state.mapRow = 48; state.currentNode = 'c0r48n1'; state.visited = [state.currentNode];
    state = transition(state, { type: 'node', id: 'c0boss' });
    if (state.phase === 'mainStory') state = transition(state, { type: 'mainStoryContinue' });
    state.enemy.hp = 1; state.hand = ['slash']; state.energy = 3;
    state = transition(state, { type: 'play', index: 0 });
    state = transition(state, { type: 'reward', key: state.choices[0] });
    while (state.phase === 'mainStory') state = transition(state, { type: 'mainStoryContinue' });
  }
  assert.equal(state.phase, 'hub');
  assert.equal(state.clears[0], 2);
  assert.equal(state.unlocked, 1);
  assert.equal(state.victories, 2);
});

test('存档可恢复，异常存档会被拒绝', () => {
  const state = newRun(17);
  assert.deepEqual(restore(serialize(state)), state);
  const oldState = structuredClone(state);
  oldState.version = 8;
  delete oldState.guestRewards;
  assert.equal(restore(serialize(oldState)), null);
  const deepState = leaveHub(newRun(171));
  deepState.mapRow = 19; deepState.currentNode = 'c0r19checkpoint'; deepState.visited = ['c0r9checkpoint', 'c0r19checkpoint'];
  assert.deepEqual(restore(serialize(deepState)), deepState);
  assert.equal(restore('{"version":999}'), null);
  assert.equal(restore('not-json'), null);
});

test('三名角色各有三条高层数专精路线且满点无法点满单线', () => {
  assert.equal(MAX_SPECIALIZATION_POINTS, 60);
  for (const key of Object.keys(CHARACTERS)) {
    assert.equal(SPECIALIZATIONS[key].length, 3);
    for (const route of SPECIALIZATIONS[key]) {
      assert.deepEqual(route.nodes.map(talent => talent.maxRank), [20, 20, 20, 20, 1]);
      assert.deepEqual(route.nodes.map(talent => talent.requires), [0, 5, 15, 30, 50]);
      assert.equal(route.nodes.reduce((sum, talent) => sum + talent.maxRank, 0), 81);
      assert.ok(route.nodes.reduce((sum, talent) => sum + talent.maxRank, 0) > MAX_SPECIALIZATION_POINTS);
      assert.equal(new Set(route.nodes.map(talent => talent.id)).size, route.nodes.length);
    }
  }
});

test('多级专精描述立即显示当前等级的累计数值', () => {
  const guard = SPECIALIZATIONS.xiaoshuai[2].nodes.find(talent => talent.id === 'xLucidPatch');
  assert.equal(specializationNodeText(guard, 0), '每次受到卡牌自伤后获得 1 点护盾。');
  assert.equal(specializationNodeText(guard, 2), '每次受到卡牌自伤后获得 2 点护盾。');
  const recycle = SPECIALIZATIONS.uncle[1].nodes.find(talent => talent.id === 'uLetterGuard');
  assert.equal(specializationNodeText(recycle, 3), '每取回 1 张弃牌，获得 3 点护盾。');
  const threshold = SPECIALIZATIONS.xiaoshuai[2].nodes.find(talent => talent.id === 'xLucidFocus');
  assert.equal(specializationNodeText(threshold, 5), threshold.text);
});

test('专精点随等级累计并在第二章开放，总数不超过六十点', () => {
  const state = newRun(4101, 'manual', 'standard', 'uncle');
  state.level = 9;
  assert.equal(specializationPointTotal(state), 9);
  assert.equal(specializationAvailablePoints(state), 9);
  assert.equal(specializationUnlocked(state), false);
  state.unlocked = 1;
  assert.equal(specializationUnlocked(state), true);
  state.level = 58;
  state.specializationBonusPoints = 3;
  assert.equal(specializationPointTotal(state), 60);
});

test('角色满级后不再升级且不会继续积累经验', () => {
  const state = newRun(41010, 'manual');
  Object.assign(state, {
    phase: 'combat', level: MAX_PLAYER_LEVEL, xp: state.nextXp - 1,
    hand: ['slash'], energy: 3, enemy: { hp: 1, maxHp: 1, block: 0, mark: 0, charge: 0 },
  });
  const next = transition(state, { type: 'play', index: 0 });
  assert.equal(next.level, MAX_PLAYER_LEVEL);
  assert.equal(next.xp, 0);
  assert.equal(next.lastLevelUp, null);
});

test('清醒梦减伤不会降低终极节点按基础自伤生成的蓄力', () => {
  const state = newRun(41011, 'manual', 'standard', 'xiaoshuai');
  Object.assign(state, {
    phase: 'combat', hp: 20, hand: ['risk'], draw: [], discard: [], exhaust: [], energy: 3,
    enemy: { hp: 100, maxHp: 100, block: 0, mark: 0, charge: 0 },
    specializations: { xLucidPain: 20, xLucidPatch: 10, xLucidEdge: 20, xLucidWake: 1 },
  });
  const next = transition(state, { type: 'play', index: 0 });
  assert.equal(state.hp - next.hp, 2);
  assert.equal(next.lucidCharge, card('risk').self * 3);
});

test('专精加点需要满足路线门槛，确认后不能直接回退', () => {
  let state = newRun(4102, 'manual', 'standard', 'uncle');
  Object.assign(state, { level: 12, unlocked: 1, stage: 1 });
  assert.equal(canInvestSpecialization(state, {}, 'uInsightStrike'), false);
  const allocations = { uInsightGuard: 5, uInsightStrike: 5 };
  state = transition(state, { type: 'specialize', allocations });
  assert.equal(specializationSpent(state), 10);
  assert.equal(specializationAvailablePoints(state), 2);
  const rejected = transition(state, { type: 'specialize', allocations: { uInsightGuard: 5 } });
  assert.deepEqual(rejected, state);
});

test('被涂改的梦册只提供一次全专精重置机会', () => {
  let state = newRun(4103, 'manual', 'standard', 'gaigai');
  Object.assign(state, { level: 10, unlocked: 2, stage: 2, phase: 'hub' });
  state = transition(state, { type: 'specialize', allocations: { gWarmGain: 5, gWarmDamage: 3 } });
  state.phase = 'sideStory';
  state.sideStory = { id: 'rewrittenDreambook' };
  state.sideStorySeen = ['rewrittenDreambook'];
  state = transition(state, { type: 'sideStoryChoice', choice: 'restore' });
  assert.equal(state.specializationResetTokens, 1);
  state.phase = 'hub';
  state = transition(state, { type: 'resetSpecialization' });
  assert.equal(specializationSpent(state), 0);
  assert.equal(state.specializationResetTokens, 0);
  assert.equal(state.specializationResetQuestDone, true);
});

test('一次性章节插曲会发放足额旅币奖励', () => {
  const gift = leaveHub(newRun(41031, 'manual'));
  gift.phase = 'sideStory';
  gift.sideStory = { id: 'giftBox' };
  gift.hp = gift.maxHp - 20;
  const opened = transition(gift, { type: 'sideStoryChoice', choice: 'open' });
  assert.equal(opened.gold, gift.gold + 240);
  assert.equal(opened.hp, gift.hp + 10);

  const vendor = leaveHub(newRun(41032, 'manual'), 4);
  vendor.phase = 'sideStory';
  vendor.sideStory = { id: 'vendorBox' };
  const declined = transition(vendor, { type: 'sideStoryChoice', choice: 'decline' });
  assert.equal(declined.gold, vendor.gold + 400);
});

test('非战斗获得的技能加入出战后不会被撤离惩罚丢失', () => {
  const state = newRun(41033, 'manual');
  Object.assign(state, { phase: 'map', mapRow: 5, checkpointRow: -1 });
  state.cardLibrary.push('mend+3');
  state.cardLibrary.push('mend+3');
  state.unsecuredCards.push('mend+3');
  state.journeyCardDrops.push('mend+3');
  const equipped = transition(state, { type: 'equipAcquired', kind: 'card', key: 'mend+3' });
  assert.equal(equipped.deck.filter(key => key === 'mend+3').length, 1);
  assert.equal(equipped.unsecuredCards.includes('mend+3'), false);
  const returned = transition(equipped, { type: 'returnHub' });
  assert.equal(returned.cardLibrary.filter(key => key === 'mend+3').length, 2);
  assert.ok(returned.deck.includes('mend+3'));
});

test('非战斗获得的技能暂不加入时仍可能被撤离惩罚丢失', () => {
  const state = newRun(41034, 'manual');
  Object.assign(state, { phase: 'map', mapRow: 5, checkpointRow: -1 });
  state.cardLibrary.push('mend+3');
  state.unsecuredCards.push('mend+3');
  state.journeyCardDrops.push('mend+3');
  const returned = transition(state, { type: 'returnHub' });
  assert.equal(returned.cardLibrary.includes('mend+3'), false);
});

test('非战斗获得的装备可在对比确认后立即装备并免于撤离遗失', () => {
  const state = newRun(41035, 'manual');
  Object.assign(state, { phase: 'map', mapRow: 5, checkpointRow: -1 });
  const item = { id: 'gear-3', base: 'morningShears', itemLevel: 3, rarity: '普通', affixes: [], skill: null, skillLevel: 0 };
  state.inventory.push(item);
  state.unsecuredLoot.push(item.id);
  state.journeyNewItems.push(item.id);
  state.nextItemId = 4;
  const equipped = transition(state, { type: 'equipAcquired', kind: 'gear', key: item.id });
  assert.equal(equipped.equipment.weapon, item.id);
  const returned = transition(equipped, { type: 'returnHub' });
  assert.ok(itemFor(returned, item.id));
});

test('一键换装在基础强度接近时优先当前角色专精词条', () => {
  let state = newRun(4104, 'manual', 'standard', 'gaigai');
  Object.assign(state, { level: 10, unlocked: 1, stage: 1 });
  state = transition(state, { type: 'specialize', allocations: { gWarmGain: 5 } });
  const rawPower = { id: 'gear-3', base: 'crownBlade', itemLevel: 20, rarity: '精良', affixes: [{ key: 'attack', value: 2, tier: 2, prefix: '敏锐的' }], skill: null, skillLevel: 0 };
  const matched = { id: 'gear-4', base: 'crownBlade', itemLevel: 20, rarity: '精良', affixes: [{ key: 'warmthPower', value: 2, tier: 2, prefix: '余温的' }], skill: null, skillLevel: 0 };
  state.inventory.push(rawPower, matched);
  state.equipment.weapon = rawPower.id;
  const equipped = transition(state, { type: 'equipBest' });
  assert.equal(equipped.equipment.weapon, matched.id);
});

test('章节剧情专精点奖励只发放一次', () => {
  let state = newRun(4105, 'manual', 'standard', 'uncle');
  Object.assign(state, { unlocked: 1, stage: 1, phase: 'mainStory', mainStory: { stage: 1, beat: 'ending', variant: null } });
  state = transition(state, { type: 'mainStoryContinue' });
  assert.equal(state.specializationBonusPoints, 1);
  assert.deepEqual(state.specializationStoryRewards, [1]);

  Object.assign(state, { stage: 1, phase: 'mainStory', mainStory: { stage: 1, beat: 'ending', variant: null } });
  state = transition(state, { type: 'mainStoryContinue' });
  assert.equal(state.specializationBonusPoints, 1);
  assert.deepEqual(state.specializationStoryRewards, [1]);
});

test('弱点引爆牌虽无基础攻击也会记录实际伤害', () => {
  const state = enterBattle(4106);
  state.enemy.hp = 100;
  state.enemy.maxHp = 100;
  state.enemy.mark = 4;
  state.hand = ['exposeTruth'];
  state.energy = 3;
  const expected = attackBreakdown(state, 'exposeTruth').total;
  const next = transition(state, { type: 'play', index: 0 });
  assert.equal(next.enemy.hp, 100 - expected);
  assert.ok(next.battleLog.some(entry => entry.includes(`造成 ${expected} 点伤害`)));
});

