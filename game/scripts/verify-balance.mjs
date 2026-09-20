import assert from 'node:assert/strict';
import {
  CHARACTERS,
  CHAPTER_LOOT,
  DIFFICULTIES,
  ENCOUNTERS,
  ITEMS,
  attackBreakdown,
  beginBattle,
  card,
  equipmentStats,
  intent,
  newRun,
  rankedCardKey,
  specializationBonuses,
  transition,
} from '../src/game.mjs';

const RUNS = Number(process.argv[2] || 120);
const MAX_ACTIONS = 400;

const EARLY_DECKS = Object.fromEntries(
  Object.entries(CHARACTERS).map(([key, character]) => [
    key,
    [...character.starter],
  ]),
);

const LATE_BUILDS = [
  { character: 'uncle', route: '洞察', affix: 'markedStrike', deck: [
    ['openingNote', 10], ['listen', 9], ['echo', 7], ['photoAlbum', 7], ['nova', 9],
    ['nightRide', 7], ['postcard', 7], ['exposeTruth', 3], ['silentAnswer', 1], ['homeboundMail', 1],
  ], specializations: { uInsightGuard: 15, uInsightStrike: 15, uInsightBurst: 10, uInsightCalm: 10, uInsightTruth: 1, uFollowDamage: 9 } },
  { character: 'uncle', route: '书信', affix: 'recycleGuard', deck: [
    ['quick', 10], ['postcard', 10], ['rainPromise', 9], ['unsent', 8], ['returnedLetter', 8],
    ['nightRide', 7], ['homeboundMail', 3], ['finalPlatform', 2], ['guard', 10], ['focus', 10],
  ], specializations: { uLetterDamage: 15, uLetterGuard: 15, uLetterReturn: 10, uLetterKeep: 10, uLetterHome: 1, uFollowDamage: 9 } },
  { character: 'uncle', route: '追问', affix: 'skillPower', deck: [
    ['openingNote', 10], ['mark', 10], ['listen', 9], ['echo', 8], ['nova', 9],
    ['postcard', 8], ['nightRide', 8], ['finalPlatform', 2], ['silentAnswer', 2], ['focus', 10],
  ], specializations: { uFollowDamage: 15, uFollowGuard: 15, uFollowHeal: 10, uFollowDepth: 10, uFollowAnswer: 1, uInsightGuard: 9 } },
  { character: 'gaigai', route: '暖意', affix: 'warmthPower', deck: [
    ['leech', 10], ['mend', 10], ['tea', 9], ['sharedUmbrella', 9], ['warmThermos', 5],
    ['steadyTea', 3], ['goodnight', 3], ['morningCall', 3], ['lastWarmth', 1], ['rewriteEnding', 1],
  ], specializations: { gWarmGain: 15, gWarmDamage: 15, gWarmShield: 10, gWarmKeep: 10, gWarmForever: 1, gDrinkHeal: 9 } },
  { character: 'gaigai', route: '热饮', affix: 'overflowBlock', deck: [
    ['mend', 10], ['tea', 10], ['sharedUmbrella', 9], ['warmThermos', 8], ['steadyTea', 7],
    ['goodnight', 5], ['lastWarmth', 2], ['leech', 10], ['morningCall', 3], ['focus', 10],
  ], specializations: { gDrinkHeal: 15, gDrinkGuard: 15, gDrinkOverflow: 10, gDrinkReserve: 10, gDrinkMorning: 1, gWarmGain: 9 } },
  { character: 'gaigai', route: '留灯', affix: 'rhythmPower', deck: [
    ['leech', 10], ['tea', 10], ['sharedUmbrella', 9], ['goodnight', 7], ['steadyTea', 6],
    ['postcard', 9], ['morningCall', 5], ['rewriteEnding', 2], ['homeboundMail', 2], ['focus', 10],
  ], specializations: { gLightDamage: 15, gLightGuard: 15, gLightHeal: 10, gLightSpark: 10, gLightAllNight: 1, gWarmGain: 9 } },
  { character: 'xiaoshuai', route: '反击', affix: 'counterPower', deck: [
    ['riposte', 10], ['fortify', 10], ['sharedUmbrella', 9], ['blanket', 3], ['stayAwhile', 5],
    ['tideTurn', 5], ['nightWatch', 3], ['finalPlatform', 1], ['keepTheLight', 1], ['rewriteEnding', 1],
  ], specializations: { xCounterKeep: 15, xCounterReflect: 15, xCounterMend: 10, xCounterEdge: 10, xCounterStorm: 1, xTidePower: 9 } },
  { character: 'xiaoshuai', route: '潮汐', affix: 'tidePower', deck: [
    ['fortify', 10], ['riposte', 10], ['sharedUmbrella', 9], ['pageMarker', 8], ['blanket', 6],
    ['stayAwhile', 6], ['tideTurn', 8], ['nightWatch', 4], ['keepTheLight', 2], ['focus', 10],
  ], specializations: { xTidePower: 20, xTideGuard: 10, xTideStrike: 20, xTideReturn: 0, xTideMoon: 1, xCounterKeep: 9 } },
  { character: 'xiaoshuai', route: '清醒梦', affix: 'lucidGuard', deck: [
    ['risk', 10], ['lucidDoor', 9], ['rewriteEnding', 5], ['morningCall', 6], ['tideTurn', 8],
    ['nightWatch', 5], ['fortify', 10], ['stayAwhile', 6], ['keepTheLight', 2], ['focus', 10],
  ], specializations: { xLucidPain: 15, xLucidPatch: 15, xLucidEdge: 10, xLucidFocus: 10, xLucidWake: 1, xTidePower: 9 } },
];

function chooseTacticalCard(state) {
  const move = intent(state);
  const incoming = ['attack', 'curse', 'chargedAttack', 'dispel'].includes(move.kind) ? move.value * (move.hits || 1) : 0;
  const blockable = Math.max(0, incoming - Math.ceil(incoming * DIFFICULTIES[state.difficulty].guardPierce));
  const bonuses = specializationBonuses(state);
  const stats = equipmentStats(state);
  let best = { index: -1, score: -Infinity };
  state.hand.forEach((key, index) => {
    const current = card(key);
    if (current.cost > state.energy) return;
    const breakdown = attackBreakdown(state, key);
    const damage = breakdown.total;
    let score = damage * 3 + (damage >= state.enemy.hp ? 2000 : 0);
    if (current.block) score += Math.min(current.block, Math.max(0, blockable - state.block)) * 5;
    if (current.heal) score += Math.min(current.heal, state.maxHp - state.hp) * 4;
    if (current.heal && bonuses.drinkMastery) {
      const healing = Math.round((current.heal + stats.healing) * (1 + (bonuses.healingPct || 0)));
      const overflow = Math.max(0, healing - (state.maxHp - state.hp));
      score += Math.min(overflow, Math.max(0, blockable - state.block)) * 5;
    }
    if (current.mark) score += current.mark * (state.enemy.mark ? 7 : 10);
    if (current.draw) score += current.draw * 10;
    if (current.energy) score += current.energy * 14;
    if (current.consumeMark && state.enemy.mark < 6) score -= 60;
    if (current.markBurst && state.enemy.mark < 4) score -= 40;
    if (current.cost === 0) score += 20;
    if (current.self) score -= current.self * (state.hp < 20 ? 12 : 2);
    if (breakdown.shieldSpent && damage < state.enemy.hp) {
      score -= Math.min(breakdown.shieldSpent, Math.max(0, blockable - Math.max(0, breakdown.playerBlockAfter))) * 5;
    }
    score -= current.cost;
    if (score > best.score) best = { index, score };
  });
  return best.index;
}

function settleBattle(state) {
  let next = state;
  let actions = 0;
  while (next.phase === 'combat' && actions++ < MAX_ACTIONS) {
    const index = chooseTacticalCard(next);
    next = transition(next, index >= 0 ? { type: 'play', index } : { type: 'end' });
  }
  return {
    won: next.phase === 'reward',
    hp: next.hp,
    enemyHp: next.enemy.hp,
    turns: next.turn,
    stalled: actions >= MAX_ACTIONS,
  };
}

function equipmentBases() {
  const bySlot = new Map();
  for (const key of CHAPTER_LOOT[5]) {
    const slot = ITEMS[key].slot;
    if (!bySlot.has(slot)) bySlot.set(slot, key);
  }
  return [...bySlot.entries()];
}

function equipLateSet(state, profile, build) {
  if (profile === 'starter') return;
  state.inventory = [];
  state.equipment = { weapon: null, armor: null, bag: null, scarf: null, charm: null, decor: null };
  const skillPool = build.deck.map(([key]) => key);
  equipmentBases().forEach(([slot, base], index) => {
    const legendary = profile === 'legendary';
    const rarity = legendary ? '传奇' : '稀有';
    const itemLevel = profile === 'legendary' ? 60 : 45;
    const routeAffix = build.affix;
    const affixes = [
      { key: index % 2 ? 'block' : 'attack', value: legendary ? 12 : 9, tier: 6, prefix: '测试的' },
      { key: routeAffix, value: legendary ? 8 : 6, tier: 6, prefix: '测试的' },
      { key: index % 2 ? 'skillPower' : 'firstStrike', value: 6, tier: 6, prefix: '测试的' },
    ];
    if (legendary) {
      const complementaryStat = build.character === 'gaigai' ? 'healing' : build.character === 'xiaoshuai' ? 'skillPower' : 'recovery';
      affixes.push({ key: complementaryStat, value: 8, tier: 6, prefix: '测试的' });
    }
    const item = {
      id: `balance-${profile}-${index}`,
      base,
      itemLevel,
      rarity,
      affixes,
      skill: legendary && index % 2 === 0 ? skillPool[index % skillPool.length] : null,
      skillLevel: legendary && index % 2 === 0 ? 6 : 0,
    };
    state.inventory.push(item);
    state.equipment[slot] = item.id;
  });
}

function prepareBattle({ seed, difficulty, character, build = null, stage, row, elite = false, boss = false, foe = 0, gear = 'starter' }) {
  const state = newRun(seed, 'manual', difficulty, character);
  state.stage = stage;
  state.mapRow = row;
  state.elite = elite;
  state.bossFight = boss;
  state.foe = foe;
  if (stage === 0) {
    state.level = elite ? 2 : 8;
    state.maxHp = CHARACTERS[character].maxHp + (state.level - 1) * 6;
    state.deck = [...EARLY_DECKS[character]];
  } else {
    state.level = 60;
    state.maxHp = CHARACTERS[character].maxHp + 59 * 6;
    state.deck = build.deck.map(([key, rank]) => rankedCardKey(key, rank));
    state.specializations = { ...build.specializations };
    equipLateSet(state, gear, build);
  }
  state.cardLibrary = [...state.deck];
  state.hp = state.maxHp;
  beginBattle(state);
  return state;
}

function runScenario(definition) {
  const results = [];
  const profiles = definition.stage === 5
    ? LATE_BUILDS.map(build => ({ character: build.character, build, label: `${build.character}/${build.route}` }))
    : Object.keys(CHARACTERS).map(character => ({ character, build: null, label: character }));
  for (const profile of profiles) {
    for (let index = 0; index < RUNS; index++) {
      results.push({
        character: profile.label,
        ...settleBattle(prepareBattle({ ...definition, character: profile.character, build: profile.build, seed: definition.seed + index })),
      });
    }
  }
  const wins = results.filter(result => result.won).length;
  const stalled = results.filter(result => result.stalled).length;
  const winsByCharacter = Object.fromEntries(profiles.map(profile => {
    const characterResults = results.filter(result => result.character === profile.label);
    return [profile.label, characterResults.filter(result => result.won).length / characterResults.length];
  }));
  const pressureByCharacter = Object.fromEntries(profiles.map(profile => {
    const profileResults = results.filter(result => result.character === profile.label);
    return [profile.label, {
      winRate: profileResults.filter(result => result.won).length / profileResults.length,
      enemyHp: profileResults.reduce((sum, result) => sum + result.enemyHp, 0) / profileResults.length,
    }];
  }));
  return {
    name: definition.name,
    winRate: wins / results.length,
    winsByCharacter,
    pressureByCharacter,
    averageTurns: results.reduce((sum, result) => sum + result.turns, 0) / results.length,
    averageHp: results.reduce((sum, result) => sum + result.hp, 0) / results.length,
    averageEnemyHp: results.reduce((sum, result) => sum + result.enemyHp, 0) / results.length,
    stalled,
  };
}

const eliteIndexes = ENCOUNTERS[0]
  .map((enemy, index) => ({ enemy, index }))
  .filter(({ enemy }) => enemy.eliteOnly);

const scenarios = [
  {
    name: '标准/第一章Boss/仅初始装备',
    seed: 10000, difficulty: 'standard', stage: 0, row: 49, boss: true, foe: 0, gear: 'starter',
    assert: result => assert.ok(Math.max(...Object.values(result.winsByCharacter)) <= .05, `第一章Boss无新装备时每名角色胜率均应不高于5%，实际最高 ${percent(Math.max(...Object.values(result.winsByCharacter)))}`),
  },
  ...eliteIndexes.map(({ enemy, index }, eliteOffset) => ({
    name: `挑战/第一章精英/${enemy.name}/仅初始装备`,
    seed: 20000 + eliteOffset * 1000, difficulty: 'challenge', stage: 0, row: 7, elite: true, foe: index, gear: 'starter',
    assert: result => assert.ok(Math.max(...Object.values(result.winsByCharacter)) <= .05, `${enemy.name}无新装备时每名角色胜率均应不高于5%，实际最高 ${percent(Math.max(...Object.values(result.winsByCharacter)))}`),
  })),
  {
    name: '标准/终章Boss/混合成型装备',
    seed: 30000, difficulty: 'standard', stage: 5, row: 49, boss: true, foe: 0, gear: 'mixed',
    assert: result => assert.ok(result.winRate >= .35 && result.winRate <= .75, `标准后期胜率应在35%-75%，实际 ${percent(result.winRate)}`),
  },
  {
    name: '挑战/终章Boss/混合成型装备',
    seed: 40000, difficulty: 'challenge', stage: 5, row: 49, boss: true, foe: 0, gear: 'mixed',
    assert: result => {
      assert.ok(result.winRate <= .2, `挑战后期非全传奇总体胜率应不高于20%，实际 ${percent(result.winRate)}`);
      const strongest = Math.max(...Object.values(result.winsByCharacter));
      assert.ok(strongest <= .35, `挑战后期非全传奇时每条专精胜率均应不高于35%，实际最高 ${percent(strongest)}`);
    },
  },
  {
    name: '挑战/终章Boss/全传奇装备',
    seed: 50000, difficulty: 'challenge', stage: 5, row: 49, boss: true, foe: 0, gear: 'legendary',
    assert: result => {
      assert.ok(result.winRate >= .35 && result.winRate <= .95, `挑战后期全传奇胜率应在35%-95%，实际 ${percent(result.winRate)}`);
      const weakest = Math.min(...Object.values(result.winsByCharacter));
      assert.ok(weakest >= .25, `全传奇时九条专精均应有通关能力，最低实际 ${percent(weakest)}`);
    },
  },
];

function percent(value) {
  return `${(value * 100).toFixed(1)}%`;
}

let failed = false;
for (const scenario of scenarios) {
  const result = runScenario(scenario);
  console.log(
    `${result.name}: win=${percent(result.winRate)} turns=${result.averageTurns.toFixed(1)} hp=${result.averageHp.toFixed(1)} enemy-hp=${result.averageEnemyHp.toFixed(1)} stalled=${result.stalled} `
    + Object.entries(result.winsByCharacter).map(([key, value]) => `${key}=${percent(value)}`).join(' '),
  );
  if (scenario.stage === 5) console.log(`  ${Object.entries(result.pressureByCharacter).map(([key, value]) => `${key}:${percent(value.winRate)}/${value.enemyHp.toFixed(0)}`).join(' ')}`);
  try {
    scenario.assert(result);
  } catch (error) {
    failed = true;
    console.error(`  FAIL: ${error.message}`);
  }
}

if (failed) process.exitCode = 1;

