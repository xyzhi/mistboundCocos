import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { createRoot } from 'react-dom/client';
import {
  AlertTriangle, ArrowLeft, Backpack, BookOpen, Check, ChevronDown, CircleHelp, Coins, Combine, Copy, Crown, Flame, FlaskConical, Gem, Heart, Hourglass,
  House, ListPlus, Lock, MapPin, Moon, PackageOpen, Scale, Shield, Shirt,
  Sparkles, Swords, Target, TentTree, Trash2, TrendingUp, Volume2, VolumeX, Wind, Wrench, X,
} from 'lucide-react';
import {
  AFFIX_LABELS, CARDS, CHARACTERS, CHEATS_ENABLED, CHECKPOINTS, CHECKPOINT_STEPS, CHAPTER_LOOT, CHAPTERS, CRITICAL_SIDE_QUESTS, DIFFICULTIES, DISORDER_GOLD_LOSS_PERCENT, ELEMENTS, ENEMIES, EQUIPMENT_ART, GUESTS, ITEMS, MAIN_STORY, MAX_SPECIALIZATION_POINTS, MYSTERY_STATIONS, SAVE_KEY, SEGMENT_NAMES, SIDE_STORIES, SLOT_LABELS, SPECIALIZATIONS, VERSION, attackBreakdown, canInvestSpecialization, card, cardTarget,
  ambientEventValues, cardBaseKey, cardRank, chapterMap, chooseAutoCard, chooseAutoTarget, commissionStatus, compareCardKeys, description, enemyFor, equipmentStats, facilityCost, intent, itemFor, itemLines, livingEnemies, MAP_STEPS,
  disorderGoldLoss, itemDetailLines, itemName, itemScore, itemStats, itemTier, itemUpgradeCost, magicHouseCooldownRemaining, mainStorySpecializationReward, newRun, rankedCardKey, rerollCost, restore, reviveCost, salvageValue, serialize, sideCardTurnInCandidates, sideGearTurnInCandidates, skillRewardRank, specializationAvailablePoints, specializationBonuses, specializationNodeText, specializationPointTotal, specializationSpent, specializationUnlocked, transition, upgradeCardKey,
} from './game.mjs';
import './styles.css';
import camperPixel from '../../assets/resources/art/camper.webp';
import chapter0 from '../../assets/resources/art/chapter-0.webp';
import chapter1 from '../../assets/resources/art/chapter-1.webp';
import chapter2 from '../../assets/resources/art/chapter-2.webp';
import chapter3 from '../../assets/resources/art/chapter-3.webp';
import chapter4 from '../../assets/resources/art/chapter-4.webp';
import chapter5 from '../../assets/resources/art/chapter-5.webp';
import bossFlower from '../../assets/resources/art/enemies-flower-boss.webp';
import bossRain from '../../assets/resources/art/enemies-rain-boss.webp';
import bossBooks from '../../assets/resources/art/enemies-books-boss.webp';
import bossCoast from '../../assets/resources/art/enemies-coast-boss.webp';
import bossMarket from '../../assets/resources/art/enemies-market-boss.webp';
import bossTerminal from '../../assets/resources/art/enemies-terminal-boss.webp';
import dreamCreatures from '../../assets/resources/art/dream-creatures.webp';
import equipmentAtlas from '../../assets/resources/art/equipment-atlas.webp';
import skillAtlas from '../../assets/resources/art/skill-atlas.webp';
import characterAtlas from '../../assets/resources/art/character-atlas.webp';
import { pcmBase64 as nightDrivePcm, sampleRate as nightDriveSampleRate } from './night-drive.generated.js';

const PIXEL_BACKGROUNDS = [chapter0, chapter1, chapter2, chapter3, chapter4, chapter5];
const PIXEL_BOSSES = [bossFlower, bossRain, bossBooks, bossCoast, bossMarket, bossTerminal];
const CARD_KEYS = Object.keys(CARDS).filter(key => key !== 'doubt');
const BATTLE_SPEED_KEY = 'mistbound-battle-speed';
const MUSIC_ENABLED_KEY = 'mistbound-music-enabled';
const CHARACTER_KEYS = Object.keys(CHARACTERS);
const CHARACTER_LINES = {
  uncle: { victory: '今晚的故事，我认真听完了。', defeat: '先回车里坐坐，故事还没结束。' },
  gaigai: { victory: '太好了，回去给大家煮一锅热可可！', defeat: '没关系，喝点热的，我们再出发。' },
  xiaoshuai: { victory: '裂缝补好了，至少今晚不会漏风。', defeat: '记住裂开的地方，下次会补得更牢。' },
};

function GameSelect({ value, options, onChange, onOpen, ariaLabel }) {
  const [open, setOpen] = useState(false);
  const [menuStyle, setMenuStyle] = useState({});
  const triggerRef = useRef(null);
  const menuRef = useRef(null);
  const listId = React.useId();
  const selectedIndex = Math.max(0, options.findIndex(option => String(option.value) === String(value)));
  const [highlighted, setHighlighted] = useState(selectedIndex);
  const selected = options[selectedIndex] || options[0];
  useEffect(() => {
    if (!open) return undefined;
    setHighlighted(selectedIndex);
    const placeMenu = () => {
      const rect = triggerRef.current?.getBoundingClientRect();
      if (!rect) return;
      const estimatedHeight = Math.min(280, options.length * 38 + 8);
      const opensUp = rect.bottom + estimatedHeight > window.innerHeight - 10 && rect.top > estimatedHeight;
      setMenuStyle({ left: rect.left, top: opensUp ? Math.max(8, rect.top - estimatedHeight - 4) : rect.bottom + 4, width: rect.width, maxHeight: estimatedHeight });
    };
    const closeOutside = event => {
      if (!triggerRef.current?.contains(event.target) && !menuRef.current?.contains(event.target)) setOpen(false);
    };
    placeMenu();
    document.addEventListener('pointerdown', closeOutside);
    window.addEventListener('resize', placeMenu);
    window.addEventListener('scroll', placeMenu, true);
    return () => {
      document.removeEventListener('pointerdown', closeOutside);
      window.removeEventListener('resize', placeMenu);
      window.removeEventListener('scroll', placeMenu, true);
    };
  }, [open, options.length, selectedIndex]);
  const choose = option => { onChange(option.value); setOpen(false); triggerRef.current?.focus(); };
  const showMenu = () => { onOpen?.(); setOpen(true); };
  const onKeyDown = event => {
    if (event.key === 'Escape') { setOpen(false); return; }
    if (!['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(event.key)) return;
    event.preventDefault();
    if (!open) { showMenu(); return; }
    if (event.key === 'ArrowDown') setHighlighted(index => (index + 1) % options.length);
    else if (event.key === 'ArrowUp') setHighlighted(index => (index - 1 + options.length) % options.length);
    else choose(options[highlighted]);
  };
  return <div className="game-select">
    <button ref={triggerRef} type="button" className={`game-select-trigger ${open ? 'is-open' : ''}`} aria-label={ariaLabel} aria-haspopup="listbox" aria-expanded={open} aria-controls={listId} onClick={() => open ? setOpen(false) : showMenu()} onKeyDown={onKeyDown}><span>{selected?.label || ''}</span><ChevronDown /></button>
    {open && createPortal(<div ref={menuRef} id={listId} className="game-select-menu" role="listbox" aria-label={ariaLabel} style={menuStyle}>{options.map((option, index) => <button type="button" role="option" aria-selected={index === selectedIndex} className={`${index === selectedIndex ? 'is-selected' : ''} ${index === highlighted ? 'is-highlighted' : ''}`} key={String(option.value)} onPointerEnter={() => setHighlighted(index)} onClick={() => choose(option)}><span>{option.label}</span>{index === selectedIndex && <Check />}</button>)}</div>, document.body)}
  </div>;
}

function atlasStyle(image, index, columns, rows) {
  const column = index % columns;
  const row = Math.floor(index / columns);
  return {
    backgroundImage: `url(${image})`,
    backgroundSize: `${columns * 100}% ${rows * 100}%`,
    backgroundPosition: `${column * 100 / Math.max(1, columns - 1)}% ${row * 100 / Math.max(1, rows - 1)}%`,
  };
}

function characterStyle(key, zoom = 1) {
  const index = Math.max(0, CHARACTER_KEYS.indexOf(key));
  if (zoom === 1) return atlasStyle(characterAtlas, index, 3, 1);
  const imageWidth = 3 * zoom;
  const x = (0.5 - (index + 0.5) * zoom) / (1 - imageWidth) * 100;
  const y = (0.5 - 0.35 * zoom) / (1 - zoom) * 100;
  return { backgroundImage: `url(${characterAtlas})`, backgroundSize: `${imageWidth * 100}% ${zoom * 100}%`, backgroundPosition: `${x}% ${y}%` };
}

function cardAtlasStyle(cardKey) {
  const model = card(cardKey);
  const artKey = model.art || model.baseKey;
  const atlasKeys = ['slash', 'guard', 'mark', 'heavy', 'focus', 'riposte', 'leech', 'quick', 'nova', 'fortify', 'echo', 'mend', 'risk', 'tea', 'listen', 'postcard', 'blanket', 'nightRide', 'kitchenLight', 'unsent', 'photoAlbum', 'morningCall', 'stayAwhile', 'lucidDoor', 'goodnight'];
  return atlasStyle(skillAtlas, Math.max(0, atlasKeys.indexOf(artKey)), 5, 5);
}

function gearAtlasStyle(baseKey) {
  const art = EQUIPMENT_ART[baseKey];
  if (Number.isInteger(art)) return atlasStyle(equipmentAtlas, art, 8, 6);
  if (art?.atlas === 'skill') return atlasStyle(skillAtlas, art.index, 5, 5);
  return null;
}

function enemySpriteProps(state, unit = null) {
  if (unit?.kind === 'boss' || (!unit && state.bossFight)) return { className: 'boss-sprite', style: { backgroundImage: `url(${PIXEL_BOSSES[state.stage]})` } };
  const art = enemyFor(state, unit?.id).art || 0;
  const column = art % 4;
  const row = Math.floor(art / 4);
  return {
    className: 'creature-sprite',
    style: {
      backgroundImage: `url(${dreamCreatures})`,
      backgroundSize: '400% 400%',
      backgroundPosition: `${column * 100 / 3}% ${row * 100 / 3}%`,
    },
  };
}

const ICONS = { sword: Swords, swords: Swords, shield: Shield, target: Target, sparkles: Sparkles, heart: Heart, wind: Wind, moon: Moon, flame: Flame };
const TARGET_LABELS = { singleEnemy: '🎯 单体', allEnemies: '◉ 全体', randomEnemy: '🎲 随机', self: '👤 自身', singleAlly: '✚ 友方', allAllies: '✚ 全体友方' };
const INTENTS = {
  attack: move => `造成 ${move.value}${move.hits ? ` × ${move.hits}` : ''} 伤害`,
  guard: move => `获得 ${move.value} 护盾`,
  curse: move => `造成 ${move.value} 伤害 · 虚弱`,
  charge: move => `蓄力 · 下回合造成 ${move.value} 伤害`,
  chargedAttack: move => `释放蓄力 · 造成 ${move.value} 伤害`,
  dispel: move => `驱散一半护盾 · 造成 ${move.value} 伤害`,
  suppress: move => `治疗压制 ${move.value} 回合`,
  jam: move => `塞入 ${move.value} 张杂念`,
  heal: move => `恢复 ${move.value} 点生命`,
  healAlly: move => `治疗生命最低的同伴 ${move.value}`,
  guardAll: move => `敌方全体获得 ${move.value} 护盾`,
  summon: move => `召唤 ${move.count || 1} 个元素单位`,
};
const capturePress = event => {
  if (event.currentTarget.setPointerCapture && Number.isInteger(event.pointerId)) event.currentTarget.setPointerCapture(event.pointerId);
};
const handleSegmentFrame = (event, values, onSelect) => {
  if (event.target instanceof Element && event.target.closest('button')) return;
  const frame = event.currentTarget.querySelector('.mode-switch, .difficulty-switch') || event.currentTarget;
  const rect = frame.getBoundingClientRect();
  const ratio = Math.max(0, Math.min(.999, (event.clientX - rect.left) / rect.width));
  onSelect(values[Math.floor(ratio * values.length)]);
};

const TooltipContext = React.createContext({ show: () => {}, close: () => {}, open: false });
const MusicContext = React.createContext({ enabled: true, toggle: () => {}, playSfx: () => {} });

function MusicProvider({ children }) {
  const contextRef = useRef(null);
  const musicBufferRef = useRef(null);
  const sourceRef = useRef(null);
  const musicGainRef = useRef(null);
  const enabledRef = useRef(false);
  const [enabled, setEnabled] = useState(() => localStorage.getItem(MUSIC_ENABLED_KEY) !== 'off');
  useEffect(() => { enabledRef.current = enabled; }, [enabled]);
  const startMusic = () => {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return null;
    if (!contextRef.current) {
      const context = new AudioContextClass();
      const bytes = Uint8Array.from(atob(nightDrivePcm), character => character.charCodeAt(0));
      const samples = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
      const buffer = context.createBuffer(1, bytes.length / 2, nightDriveSampleRate);
      const channel = buffer.getChannelData(0);
      for (let index = 0; index < channel.length; index++) channel[index] = samples.getInt16(index * 2, true) / 32768;
      const gain = context.createGain();
      gain.gain.value = .34;
      gain.connect(context.destination);
      contextRef.current = context;
      musicBufferRef.current = buffer;
      musicGainRef.current = gain;
    }
    if (!sourceRef.current && musicBufferRef.current && musicGainRef.current) {
      const source = contextRef.current.createBufferSource();
      source.buffer = musicBufferRef.current;
      source.loop = true;
      source.connect(musicGainRef.current);
      source.onended = () => {
        sourceRef.current = null;
        if (enabledRef.current && contextRef.current?.state !== 'closed') startMusic();
      };
      source.start();
      sourceRef.current = source;
    }
    contextRef.current.resume().catch(() => {});
    return contextRef.current;
  };
  const playSfx = kind => {
    if (!enabled) return;
    const context = startMusic();
    if (!context) return;
    const now = context.currentTime;
    const musicGain = musicGainRef.current?.gain;
    if (musicGain && kind !== 'mysteryTick') {
      musicGain.cancelScheduledValues(now);
      musicGain.setValueAtTime(musicGain.value, now);
      musicGain.linearRampToValueAtTime(.12, now + .025);
      musicGain.linearRampToValueAtTime(.34, now + .38);
    }
    const voice = (frequency, offset, duration, volume, type = 'sine', endFrequency = frequency) => {
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.type = type;
      oscillator.frequency.setValueAtTime(frequency, now + offset);
      oscillator.frequency.exponentialRampToValueAtTime(Math.max(30, endFrequency), now + offset + duration);
      gain.gain.setValueAtTime(.0001, now + offset);
      gain.gain.exponentialRampToValueAtTime(volume, now + offset + .008);
      gain.gain.exponentialRampToValueAtTime(.0001, now + offset + duration);
      oscillator.connect(gain);
      gain.connect(context.destination);
      oscillator.start(now + offset);
      oscillator.stop(now + offset + duration + .015);
    };
    const sounds = {
      tap: () => voice(340, 0, .055, .07, 'triangle', 260),
      confirm: () => { voice(440, 0, .075, .09, 'triangle', 520); voice(660, .055, .105, .075, 'sine', 760); },
      card: () => { voice(210, 0, .12, .105, 'triangle', 390); voice(620, .035, .09, .06, 'sine', 780); },
      guard: () => { voice(260, 0, .16, .105, 'triangle', 190); voice(520, .025, .22, .09, 'sine', 720); voice(780, .08, .18, .055, 'sine', 620); },
      route: () => { voice(520, 0, .11, .08, 'sine', 610); voice(820, .07, .16, .07, 'sine', 980); },
      warning: () => { voice(180, 0, .18, .11, 'sawtooth', 105); voice(120, .09, .16, .075, 'triangle', 82); },
      hit: () => { voice(145, 0, .105, .13, 'square', 62); voice(360, 0, .055, .065, 'sawtooth', 130); },
      hurt: () => { voice(115, 0, .2, .145, 'sawtooth', 48); voice(72, .035, .18, .095, 'square', 42); },
      heal: () => { voice(440, 0, .18, .07); voice(554, .07, .2, .075); voice(659, .14, .24, .07); },
      victory: () => [523, 659, 784, 1047].forEach((note, index) => voice(note, index * .085, .28, .085, 'triangle')),
      defeat: () => [220, 185, 147].forEach((note, index) => voice(note, index * .13, .3, .1, 'triangle', note * .82)),
      mysteryTick: () => { voice(280, 0, .045, .045, 'square', 220); voice(720, 0, .035, .022, 'triangle', 620); },
      mysteryReveal: () => { [392, 523, 659].forEach((note, index) => voice(note, index * .075, .24, .09, 'triangle', note * 1.08)); voice(1047, .24, .32, .075, 'sine', 1319); },
      mysteryBad: () => { voice(196, 0, .34, .12, 'sawtooth', 98); voice(147, .12, .3, .09, 'triangle', 73); },
      chapterUnlock: () => { [262, 392, 523, 659].forEach((note, index) => voice(note, index * .1, .34, .085, 'triangle', note * 1.04)); voice(1047, .38, .48, .08, 'sine', 1319); },
    };
    (sounds[kind] || sounds.tap)();
  };
  useEffect(() => {
    localStorage.setItem(MUSIC_ENABLED_KEY, enabled ? 'on' : 'off');
    if (!enabled) {
      contextRef.current?.suspend().catch(() => {});
      return undefined;
    }
    startMusic();
    document.addEventListener('pointerdown', startMusic, { once: true, capture: true });
    document.addEventListener('keydown', startMusic, { once: true, capture: true });
    return () => {
      document.removeEventListener('pointerdown', startMusic, true);
      document.removeEventListener('keydown', startMusic, true);
    };
  }, [enabled]);
  const toggle = () => setEnabled(current => {
    const next = !current;
    if (next) startMusic();
    else contextRef.current?.suspend().catch(() => {});
    return next;
  });
  useEffect(() => {
    const handleButtonSound = event => {
      const button = event.target instanceof Element ? event.target.closest('button') : null;
      if (!button || button.disabled) return;
      const kind = button.dataset.sfx
        || (button.matches('.game-card') ? 'card'
          : button.matches('.map-node') ? 'route'
            : button.matches('.confirm-danger, .danger') ? 'warning'
              : button.matches('.primary, .depart-button, .end-turn') ? 'confirm' : 'tap');
      playSfx(kind);
    };
    document.addEventListener('click', handleButtonSound, true);
    return () => document.removeEventListener('click', handleButtonSound, true);
  }, [enabled]);
  useEffect(() => () => {
    enabledRef.current = false;
    const source = sourceRef.current;
    sourceRef.current = null;
    source?.stop();
    contextRef.current?.close();
  }, []);
  return <MusicContext.Provider value={{ enabled, toggle, playSfx }}>{children}</MusicContext.Provider>;
}

function MusicToggle({ compact = false }) {
  const { enabled, toggle } = React.useContext(MusicContext);
  const Icon = enabled ? Volume2 : VolumeX;
  return <button type="button" className={`music-control secondary ${compact ? 'compact' : ''}`} onClick={toggle} aria-label={enabled ? '关闭催眠曲' : '开启催眠曲'} aria-pressed={enabled}><Icon />{!compact && <span>{enabled ? '关闭催眠曲' : '开启催眠曲'}</span>}</button>;
}

function TooltipProvider({ children }) {
  const [tip, setTip] = useState(null);
  const timer = useRef(null);
  const close = () => {
    window.clearTimeout(timer.current);
    setTip(null);
  };
  const show = (text, event) => {
    window.clearTimeout(timer.current);
    const source = event?.currentTarget?.getBoundingClientRect?.();
    const rawX = event?.clientX || (source ? source.left + source.width / 2 : window.innerWidth / 2);
    const rawY = event?.clientY || (source ? source.top + source.height / 2 : window.innerHeight / 2);
    const halfWidth = Math.min(180, (window.innerWidth - 24) / 2);
    const x = Math.max(halfWidth + 12, Math.min(window.innerWidth - halfWidth - 12, rawX));
    const below = rawY < 150;
    const y = Math.max(16, Math.min(window.innerHeight - 16, rawY));
    setTip({ text, x, y, below });
    timer.current = window.setTimeout(close, 4200);
  };
  useEffect(() => {
    const dismiss = event => {
      if (!event.target.closest?.('.info-trigger, .info-toast')) close();
    };
    document.addEventListener('pointerdown', dismiss, true);
    return () => { window.clearTimeout(timer.current); document.removeEventListener('pointerdown', dismiss, true); };
  }, []);
  return <TooltipContext.Provider value={{ show, close, open: Boolean(tip) }}>{children}{tip && <button className={`info-toast ${tip.below ? 'below' : 'above'}`} style={{ left: `${tip.x}px`, top: `${tip.y}px` }} onClick={close}><CircleHelp />{tip.text}<X /></button>}</TooltipContext.Provider>;
}

function Tip({ text, children, className = '' }) {
  const { show } = React.useContext(TooltipContext);
  return <button type="button" className={`info-trigger ${className}`} onClick={event => show(text, event)}>{children}</button>;
}

function Bar({ value, max, tone = 'health' }) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return <div className={`bar ${tone}`}><span style={{ width: `${pct}%` }} /></div>;
}

function ValueFloaters({ items }) {
  return <div className="value-floaters" aria-live="polite">{items.map(item => <span key={item.key} className={item.tone || (item.value >= 0 ? 'gain' : 'loss')}>{item.text || <>{item.label} {item.value > 0 ? '+' : ''}{item.value}</>}</span>)}</div>;
}

const escapePattern = value => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

function BattleLogLine({ text, enemyName }) {
  const enemyPattern = enemyName ? `|${escapePattern(enemyName)}` : '';
  const tokens = text.split(new RegExp(`(「[^」]+」|\\d+(?:\\/\\d+)?|你|店主${enemyPattern})`, 'g'));
  return tokens.map((token, index) => {
    if (!token) return null;
    if (/^「[^」]+」$/.test(token)) return <strong className="log-skill" key={index}>{token}</strong>;
    if (/^\d+(?:\/\d+)?$/.test(token)) return <strong className="log-number" key={index}>{token}</strong>;
    if (token === '你' || token === '店主') return <strong className="log-player" key={index}>{token}</strong>;
    if (token === enemyName) return <strong className="log-enemy" key={index}>{token}</strong>;
    return token;
  });
}

function CardView({ cardKey, onClick, onPointerDown, onPointerMove, onPointerUp, onPointerCancel, handIndex, disabled = false, preview = null, compact = false, active = false, selected = false, detached = false, playReady = false, ghost = false, ghostTarget = null, isNew = false, style }) {
  const c = card(cardKey);
  const Icon = ICONS[c.icon] || Sparkles;
  const element = ELEMENTS[c.element] || ELEMENTS.neutral;
  const interactive = Boolean(onClick || onPointerDown);
  return (
    <button className={`game-card ${c.type} ${c.equipmentGranted ? 'equipment-granted' : ''} ${compact ? 'compact' : ''} ${active ? 'auto-active' : ''} ${selected ? 'selected' : ''} ${detached ? 'detached' : ''} ${playReady ? 'play-ready' : ''} ${ghost ? 'throw-ghost' : ''} ${ghostTarget ? `${ghostTarget}-target` : ''} ${interactive ? '' : 'read-only'}`} style={style} data-hand-index={handIndex} tabIndex={ghost ? -1 : undefined} aria-hidden={ghost || undefined} onClick={onClick} onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerCancel={onPointerCancel} disabled={disabled}>
      <span className="card-cost">{c.cost}</span>
      {isNew && <span className="new-badge">NEW</span>}
      <span className="card-school">{element.icon} {c.equipmentGranted ? '装备技' : c.school}</span>
      <span className="card-target">{TARGET_LABELS[cardTarget(c)] || cardTarget(c)}</span>
      <span className="card-art pixel-art" style={cardAtlasStyle(cardKey)}><i className="card-category"><Icon size={compact ? 12 : 14} strokeWidth={1.8} /></i></span>
      <strong>{c.name}</strong>
      <span className="card-rule">{description(cardKey).join('。')}。</span>
      {preview?.total > 0 && <span className="card-preview">预计伤害 {preview.total}{preview.elementMultiplier > 1 ? ' · 克制' : ''}</span>}
      <em>{c.flavor}</em>
    </button>
  );
}

function JourneySetup({ onBack, onStart }) {
  const [mode, setMode] = useState('manual');
  const [difficulty, setDifficulty] = useState('standard');
  const [character, setCharacter] = useState('gaigai');
  const [step, setStep] = useState('character');
  const back = () => step === 'rules' ? setStep('character') : onBack();
  return <main className="journey-setup">
    <div className="splash-art camper-art" style={{ backgroundImage: `url(${camperPixel})` }} />
    <div className="setup-shade" />
    <button className="icon-button setup-back" onPointerDown={capturePress} onClick={back} aria-label="返回上一步"><ArrowLeft /></button>
    <section className={`setup-copy ${step === 'character' ? 'character-step' : ''}`}>
      <span className="eyebrow">NEW JOURNEY</span>
      <h1>{step === 'character' ? '今晚谁值班？' : '准备启程'}</h1>
      <p>{step === 'character' ? '角色特性会改变初始牌组和更容易遇到的技能流派。' : `已选择 ${CHARACTERS[character].name}，再决定本次旅程的出牌方式与难度。`}</p>
      {step === 'character' ? <div className="character-picker">
        {Object.entries(CHARACTERS).map(([key, hero]) => <button key={key} className={`character-choice ${character === key ? 'active' : ''}`} onClick={() => setCharacter(key)}>
          <span className="character-portrait pixel-art" style={characterStyle(key)} />
          <span className="character-heading"><strong>{hero.name}</strong>{hero.recommended && <em>新手推荐</em>}</span>
          <b>{hero.style}</b>
          <p>{hero.description}</p>
        </button>)}
      </div> : <div className="splash-settings">
        <div className="setting-group" onClick={event => handleSegmentFrame(event, ['auto', 'manual'], setMode)}><small>出牌方式</small><div className="mode-switch" aria-label="出牌方式">
          <button className={mode === 'auto' ? 'active' : ''} onPointerDown={capturePress} onClick={() => setMode('auto')}><Sparkles />自动出牌</button>
          <button className={mode === 'manual' ? 'active' : ''} onPointerDown={capturePress} onClick={() => setMode('manual')}><Swords />手动出牌</button>
        </div><p className="difficulty-hint">{mode === 'auto' ? '托管会根据敌方意图选择攻防与恢复，但复杂组合仍由手动操作更稳。' : '根据敌方下一步行动安排攻击与防御。'}</p></div>
        <div className="setting-group" onClick={event => handleSegmentFrame(event, Object.keys(DIFFICULTIES), setDifficulty)}><small>旅程难度</small><div className="difficulty-switch" aria-label="旅程难度">
          {Object.entries(DIFFICULTIES).map(([key, item]) => <button key={key} className={difficulty === key ? 'active' : ''} onPointerDown={capturePress} onClick={() => setDifficulty(key)}>{item.name}</button>)}
        </div><p className="difficulty-hint">{DIFFICULTIES[difficulty].hint}</p></div>
      </div>}
      {step === 'character'
        ? <button className="primary setup-start" onPointerDown={capturePress} onClick={() => setStep('rules')}>选择 {CHARACTERS[character].name}，下一步</button>
        : <button className="primary setup-start" onPointerDown={capturePress} onClick={() => onStart(mode, difficulty, character)}><Moon />进入房车</button>}
    </section>
  </main>;
}

const SAVE_SLOT_KEYS = [SAVE_KEY, `${SAVE_KEY}.slot.2`, `${SAVE_KEY}.slot.3`];

function SaveSlotPicker({ saves, onBack, onNew, onContinue, onDelete }) {
  const [deletingSlot, setDeletingSlot] = useState(null);
  const deletingSave = deletingSlot === null ? null : saves[deletingSlot];
  return <main className="journey-setup save-picker">
    <div className="splash-art camper-art" style={{ backgroundImage: `url(${camperPixel})` }} />
    <div className="setup-shade" />
    <button className="icon-button setup-back" onPointerDown={capturePress} onClick={onBack} aria-label="返回启动页"><ArrowLeft /></button>
    <section className="setup-copy save-picker-copy">
      <span className="eyebrow">JOURNEY ARCHIVES</span>
      <h1>旅程档案</h1>
      <p>每份档案独立记录一段夜路，旅途中会实时保存。</p>
      <div className="save-slots">
        {saves.map((saved, index) => saved ? <div className="save-slot occupied" key={SAVE_SLOT_KEYS[index]}>
          <button className="save-slot-resume" onPointerDown={capturePress} onClick={() => onContinue(index)}>
            <span className="save-slot-number">档案 {String(index + 1).padStart(2, '0')}</span>
            <span className="save-slot-avatar pixel-art" style={characterStyle(saved.character)} />
            <span className="save-slot-copy"><strong>{CHARACTERS[saved.character].name}</strong><small>Lv.{saved.level} · 第 {saved.stage + 1} 章「{CHAPTERS[saved.stage].name}」</small><em>{DIFFICULTIES[saved.difficulty].name} · {saved.battleMode === 'auto' ? '自动出牌' : '手动出牌'}</em></span>
            <b>继续</b>
          </button>
          <button className="save-slot-delete" onClick={() => setDeletingSlot(index)} aria-label={`删除档案 ${index + 1}`}><Trash2 /></button>
        </div> : <button className="save-slot empty" key={SAVE_SLOT_KEYS[index]} onPointerDown={capturePress} onClick={() => onNew(index)}>
          <span className="save-slot-number">档案 {String(index + 1).padStart(2, '0')}</span>
          <span className="save-slot-empty-icon"><Sparkles /></span>
          <span className="save-slot-copy"><strong>新建旅程</strong><small>选择值班角色与旅程难度</small></span>
          <b>新建</b>
        </button>)}
      </div>
    </section>
    {deletingSave && <div className="confirm-backdrop" onClick={() => setDeletingSlot(null)}><section className="confirm-dialog delete-save-confirm" role="alertdialog" aria-modal="true" aria-labelledby="delete-save-title" onClick={event => event.stopPropagation()}>
      <span className="confirm-icon"><Trash2 /></span><small>删除旅程档案</small><h2 id="delete-save-title">删除档案 {deletingSlot + 1}？</h2>
      <p>{CHARACTERS[deletingSave.character].name} Lv.{deletingSave.level} 的全部进度都会永久删除，此操作无法撤销。</p>
      <div className="confirm-actions"><button className="secondary" onClick={() => setDeletingSlot(null)}>保留档案</button><button className="confirm-danger" onClick={() => { onDelete(deletingSlot); setDeletingSlot(null); }}>确认删除</button></div>
    </section></div>}
  </main>;
}

function Splash({ saves, onNew, onContinue, onDelete }) {
  const [selectingSlot, setSelectingSlot] = useState(false);
  const [configuringSlot, setConfiguringSlot] = useState(null);
  if (configuringSlot !== null) return <JourneySetup onBack={() => setConfiguringSlot(null)} onStart={(mode, difficulty, character) => onNew(configuringSlot, mode, difficulty, character)} />;
  if (selectingSlot) return <SaveSlotPicker saves={saves} onBack={() => setSelectingSlot(false)} onNew={setConfiguringSlot} onContinue={onContinue} onDelete={onDelete} />;
  return (
    <main className="splash">
      <div className="splash-art camper-art" style={{ backgroundImage: `url(${camperPixel})` }} />
      <div className="splash-shade" />
      <section className="splash-copy">
        <span className="eyebrow">TRAVELING HOTEL · CARD RPG</span>
        <h1>下一站，晚安</h1>
        <p>驾驶一辆会变成旅店的房车。白天沿途旅行，夜晚进入客人的梦。</p>
        <div className="splash-actions">
          <button className="primary" onPointerDown={capturePress} onClick={() => setSelectingSlot(true)}><Sparkles size={18} />开始游戏</button>
          <MusicToggle />
        </div>
      </section>
    </main>
  );
}

const featureUnlocks = state => ({
  bag: state.victories > 0 || state.inventory.length > 2,
  workshop: state.workshopUnlocked,
  guests: state.clears.reduce((sum, count) => sum + count, 0) >= 2,
});

function CamperHub({ state, dispatch, onDrawer, onSpecialization, onWorkshop, onGuests, newlyUnlockedStage }) {
  const initialDestination = Math.min(state.stage, state.unlocked);
  const [selected, setSelected] = useState(initialDestination);
  const [departureRow, setDepartureRow] = useState(state.chapterCheckpoints?.[initialDestination] ?? -1);
  const destination = CHAPTERS[selected];
  const selectedCheckpoint = state.chapterCheckpoints?.[selected] ?? -1;
  const availableWaypoints = [-1, ...CHECKPOINT_STEPS.map(step => step - 1).filter(row => row <= selectedCheckpoint)];
  const { bag: bagUnlocked, workshop: workshopUnlocked, guests: guestsUnlocked } = featureUnlocks(state);
  const specializationOpen = specializationUnlocked(state);
  const actionCount = Number(bagUnlocked) + Number(specializationOpen) + Number(workshopUnlocked) + Number(guestsUnlocked);
  return <main className="camper-hub">
    <div className="hub-background" style={{ backgroundImage: `url(${camperPixel})` }} />
    <div className="hub-shade" />
    <header className="hub-topbar">
      <button className="hub-character" onPointerDown={capturePress} onClick={onDrawer} aria-label={`查看${CHARACTERS[state.character].name}的角色与装备`}>
        <span className="hub-character-avatar pixel-art" style={characterStyle(state.character, 2.2)} />
        <span><small className="eyebrow">DAY {state.victories + 1} · 黄昏</small><strong>{CHARACTERS[state.character].name} · 晚安旅行屋</strong></span>
      </button>
      <div className="hub-resources"><Tip text="生命归零时可以选择复活回房车。"><span><Heart />{state.hp}/{state.maxHp}</span></Tip><Tip text={`旅币用于工坊重抽属性、升级房车、旅途交易和买活。当前等级买活需要 ${reviveCost(state)} 枚旅币。`}><span><Coins />{state.gold}</span></Tip></div>
    </header>
    <section className="hub-copy">
      <span className="eyebrow">今晚停靠在</span>
      <h1>{destination.name}</h1>
      <p>{destination.weather} · {destination.subtitle}</p>
      {selectedCheckpoint >= 0 && <label className="waypoint-picker">
        <span>启程位置{!state.featureSeen.waypoint && <em className="waypoint-new-badge">NEW</em>}</span>
        <GameSelect ariaLabel="选择启程位置" value={departureRow} onOpen={() => dispatch({ type: 'viewFeature', key: 'waypoint' })} onChange={value => setDepartureRow(Number(value))} options={availableWaypoints.map(row => ({ value: row, label: row < 0 ? '第 1 步 · 夜程起点' : `第 ${row + 1} 步 · 已点亮休息站` }))} />
      </label>}
      <button className="depart-button" onPointerDown={capturePress} onClick={() => dispatch({ type: 'depart', stage: selected, row: departureRow })}><Moon />{departureRow >= 0 ? `传送至第 ${departureRow + 1} 步` : '从第 1 步启程'}</button>
      <small>{selectedCheckpoint >= 0 ? `已点亮第 10 至 ${selectedCheckpoint + 1} 步休息站，可随时传送` : '50 步夜程 · 每 10 步停靠路标 · 首领掉落区域专属装备'}</small>
    </section>
    <nav className="destination-strip" aria-label="选择目的地">
      {CHAPTERS.map((chapter, index) => {
        const locked = index > state.unlocked;
        const newlyUnlocked = newlyUnlockedStage === index;
        return <button key={chapter.name} className={`${selected === index ? 'active' : ''} ${newlyUnlocked ? 'destination-unlocked' : ''}`.trim()} disabled={locked} onPointerDown={capturePress} onClick={() => { setSelected(index); setDepartureRow(state.chapterCheckpoints?.[index] ?? -1); }} style={{ '--destination': chapter.color }}>
          <span>{locked ? <Lock /> : <MapPin />}</span><b>{chapter.name}</b><small>{locked ? '完成上一站后解锁' : (state.chapterCheckpoints?.[index] ?? -1) >= 0 ? `第 ${state.chapterCheckpoints[index] + 1} 步路标` : state.clears[index] ? `已探索 ${state.clears[index]} 次` : '新目的地'}</small>{newlyUnlocked && <em className="destination-unlock-badge">新章节</em>}
        </button>;
      })}
    </nav>
    {actionCount > 0 && <div className="hub-actions" style={{ '--action-count': actionCount }}>
      {bagUnlocked && <button className={!state.featureSeen.bag ? 'feature-new' : ''} onPointerDown={capturePress} onClick={onDrawer}><PackageOpen /><span><b>整理行囊</b><small>装备、背包与卡牌</small></span></button>}
      {specializationOpen && <button className={!state.specializationSeen ? 'feature-new' : ''} onPointerDown={capturePress} onClick={onSpecialization}><Sparkles /><span><b>专精盘</b><small>选择角色成长路线</small></span></button>}
      {workshopUnlocked && <button className={!state.featureSeen.workshop ? 'feature-new' : ''} onPointerDown={capturePress} onClick={onWorkshop}><Wrench /><span><b>房车工坊</b><small>重抽属性、拆解装备</small></span></button>}
      {guestsUnlocked && <button className={!state.featureSeen.guests ? 'feature-new' : ''} onPointerDown={capturePress} onClick={onGuests}><House /><span><b>客人房间</b><small>故事进度与专属纪念品</small></span></button>}
    </div>
    }
  </main>;
}

function Battle({ state, dispatch, outcome = null, battleSpeed = 1, onBattleSpeed }) {
  const { open: tipOpen } = React.useContext(TooltipContext);
  const [tutorialStep, setTutorialStep] = useState(0);
  const [selectedCard, setSelectedCard] = useState(-1);
  const [pendingTargetCard, setPendingTargetCard] = useState(-1);
  const [focusedEnemyId, setFocusedEnemyId] = useState(null);
  const [dragX, setDragX] = useState(0);
  const [dragLift, setDragLift] = useState(0);
  const [cardDetached, setCardDetached] = useState(false);
  const [playReady, setPlayReady] = useState(false);
  const [throwGhosts, setThrowGhosts] = useState([]);
  const handGesture = useRef(null);
  const dissolveTimers = useRef(new Set());
  const handGap = state.hand.length <= 1 ? 0
    : state.hand.length === 2 ? 12
      : state.hand.length === 3 ? 4
        : state.hand.length === 4 ? -24
          : state.hand.length === 5 ? -48
            : -64;
  const enemies = livingEnemies(state);
  const allEnemyUnits = Array.isArray(state.enemies) && state.enemies.length ? state.enemies : (state.enemy ? [state.enemy] : []);
  const focusedUnit = enemies.find(unit => unit.id === focusedEnemyId)
    || enemies.find(unit => unit.id === state.selectedEnemyId)
    || enemies[0]
    || allEnemyUnits.find(unit => unit.id === state.selectedEnemyId)
    || allEnemyUnits[0]
    || state.enemy;
  const enemy = enemyFor(state, focusedUnit?.id);
  const move = focusedUnit ? intent(state, focusedUnit.id) : null;
  const battleEquipmentStats = equipmentStats(state);
  const battleSpecialization = specializationBonuses(state);
  const autoIndex = state.battleMode === 'auto' ? chooseAutoCard(state) : -1;
  const enemyNames = allEnemyUnits.map(unit => enemyFor(state, unit.id).name);
  const recentAction = [...state.battleLog].reverse().find(item => item.startsWith('你打出') || enemyNames.some(name => item.startsWith(name))) || '';
  const enemyHit = (recentAction.startsWith('你打出') && recentAction.includes('伤害')) || outcome === 'victory';
  const playerHit = enemyNames.some(name => recentAction.startsWith(name)) && recentAction.includes('伤害');
  const playerGuarded = recentAction.startsWith('你打出') && recentAction.includes('护盾');
  const energyGain = recentAction.startsWith('你打出') && recentAction.includes('能量');
  const actionKey = `${state.turn}-${state.played}-${state.hp}-${allEnemyUnits.map(unit => unit.hp).join('-')}-${recentAction}`;
  const bossCleared = outcome === 'victory' && state.bossFight;
  const previousEnemyHp = useRef(state.enemy.hp);
  const previousPlayerHp = useRef(state.hp);
  const previousPlayerBlock = useRef(state.block);
  const previousEnergy = useRef(state.energy);
  const previousEnemyBlock = useRef(state.enemy.block);
  const previousMark = useRef(state.enemy.mark);
  const battleLogRef = useRef(null);
  const [enemyDelta, setEnemyDelta] = useState(null);
  const [playerDelta, setPlayerDelta] = useState(null);
  const [statDeltas, setStatDeltas] = useState([]);
  const recordStatDelta = (kind, value, label) => {
    if (!value) return;
    setStatDeltas(current => [...current.filter(item => item.kind !== kind), { kind, value, label, key: `${kind}-${Date.now()}-${value}` }]);
  };
  useEffect(() => {
    const value = state.enemy.hp - previousEnemyHp.current;
    if (value) setEnemyDelta({ value, key: `${state.played}-${state.enemy.hp}` });
    previousEnemyHp.current = state.enemy.hp;
  }, [state.enemy.hp, state.played]);
  useEffect(() => {
    const value = state.hp - previousPlayerHp.current;
    if (value) setPlayerDelta({ value, key: `${state.turn}-${state.played}-${state.hp}` });
    previousPlayerHp.current = state.hp;
  }, [state.hp, state.played, state.turn]);
  useEffect(() => {
    recordStatDelta('player-block', state.block - previousPlayerBlock.current, '护盾');
    previousPlayerBlock.current = state.block;
  }, [state.block]);
  useEffect(() => {
    recordStatDelta('energy', state.energy - previousEnergy.current, '能量');
    previousEnergy.current = state.energy;
  }, [state.energy]);
  useEffect(() => {
    recordStatDelta('enemy-block', state.enemy.block - previousEnemyBlock.current, '护盾');
    previousEnemyBlock.current = state.enemy.block;
  }, [state.enemy.block]);
  useEffect(() => {
    recordStatDelta('mark', state.enemy.mark - previousMark.current, '弱点');
    previousMark.current = state.enemy.mark;
  }, [state.enemy.mark]);
  const spawnThrowGhost = (cardKey, rect, targetId = null) => {
    if (!rect) return;
    const c = card(cardKey);
    const enemyTarget = Boolean(c.damage || c.mark || c.markBurst || c.consumeMark);
    const target = enemyTarget ? 'enemy' : 'self';
    const enemySelector = targetId
      ? `.enemy-unit[data-enemy-id="${targetId}"] .enemy-unit-sprite`
      : '.enemy-unit.is-focused .enemy-unit-sprite, .enemy-unit .enemy-unit-sprite';
    const targetRect = document.querySelector(enemyTarget ? enemySelector : '.battle-character-avatar')?.getBoundingClientRect();
    const ghostId = `${Date.now()}-${cardKey}`;
    setThrowGhosts(current => [...current, {
      id: ghostId, cardKey, left: rect.left, top: rect.top, width: rect.width, height: rect.height,
      target: targetRect ? target : null,
      throwX: targetRect ? targetRect.left + targetRect.width / 2 - (rect.left + rect.width / 2) : 0,
      throwY: targetRect ? targetRect.top + targetRect.height / 2 - (rect.top + rect.height / 2) : 0,
    }]);
    const timer = window.setTimeout(() => {
      setThrowGhosts(current => current.filter(item => item.id !== ghostId));
      dissolveTimers.current.delete(timer);
    }, targetRect ? 460 : 340);
    dissolveTimers.current.add(timer);
  };
  useEffect(() => {
    if (state.battleMode !== 'auto' || state.phase !== 'combat' || tipOpen) return undefined;
    const timer = window.setTimeout(() => {
      const activeCard = document.querySelector('.hand .game-card.auto-active');
      const autoTarget = autoIndex >= 0 ? chooseAutoTarget(state, state.hand[autoIndex]) : null;
      if (autoIndex >= 0 && activeCard) spawnThrowGhost(state.hand[autoIndex], activeCard.getBoundingClientRect(), autoTarget);
      dispatch({ type: 'auto' });
    }, 720 / battleSpeed);
    return () => window.clearTimeout(timer);
  }, [state, dispatch, tipOpen, battleSpeed]);
  useEffect(() => {
    const element = battleLogRef.current;
    if (element) element.scrollTop = element.scrollHeight;
  }, [state.battleLog.length]);
  useEffect(() => {
    setSelectedCard(-1);
    setDragX(0);
    setDragLift(0);
    setCardDetached(false);
    setPlayReady(false);
    setPendingTargetCard(-1);
  }, [state.hand, state.turn]);
  useEffect(() => () => dissolveTimers.current.forEach(timer => window.clearTimeout(timer)), []);
  const playThreshold = () => Math.min(48, window.innerHeight * .065);
  const beginCardGesture = (index, event) => {
    if (state.battleMode === 'auto' || card(state.hand[index]).cost > state.energy) return;
    event.preventDefault();
    handGesture.current = { pointerId: event.pointerId, startX: event.clientX, startY: event.clientY, index, detached: false };
    setSelectedCard(index);
    setDragX(0);
    setDragLift(0);
    setCardDetached(false);
    setPlayReady(false);
    event.currentTarget.setPointerCapture?.(event.pointerId);
  };
  const moveCardGesture = event => {
    const gesture = handGesture.current;
    if (!gesture || gesture.pointerId !== event.pointerId) return;
    event.preventDefault();
    const swipeDistance = Math.max(0, gesture.startY - event.clientY);
    const threshold = playThreshold();
    if (gesture.detached) {
      if (swipeDistance < threshold) {
        gesture.detached = false;
        delete gesture.detachX;
        delete gesture.detachY;
        delete gesture.detachLift;
        setDragX(0);
        setDragLift(-swipeDistance);
        setCardDetached(false);
        setPlayReady(false);
      } else {
        setDragX(event.clientX - gesture.detachX);
        setDragLift(gesture.detachLift + event.clientY - gesture.detachY);
        return;
      }
    }
    setDragLift(-Math.min(threshold, swipeDistance));
    if (swipeDistance >= threshold) {
      gesture.detached = true;
      gesture.detachX = event.clientX;
      gesture.detachY = event.clientY;
      gesture.detachLift = -threshold;
      setCardDetached(true);
      setPlayReady(true);
      return;
    }
    const hand = event.currentTarget.closest('.hand');
    const candidates = [...hand.querySelectorAll('.game-card:not(:disabled)')];
    const nearest = candidates.reduce((best, element) => {
      const rect = element.getBoundingClientRect();
      const distance = Math.abs(event.clientX - (rect.left + rect.width / 2));
      return !best || distance < best.distance ? { element, distance } : best;
    }, null);
    if (!nearest) return;
    const index = Number(nearest.element.dataset.handIndex);
    if (index !== gesture.index) {
      gesture.index = index;
      setSelectedCard(index);
    }
  };
  const finishCardGesture = (event, cancelled = false) => {
    const gesture = handGesture.current;
    if (!gesture || gesture.pointerId !== event.pointerId) return;
    event.preventDefault();
    handGesture.current = null;
    if (event.currentTarget.hasPointerCapture?.(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    const swipeDistance = gesture.startY - event.clientY;
    if (!cancelled && (gesture.detached || swipeDistance >= playThreshold())) {
      const hand = event.currentTarget.closest('.hand');
      const playedElement = hand?.querySelector(`[data-hand-index="${gesture.index}"]`);
      const rect = playedElement?.getBoundingClientRect();
      const playedKey = state.hand[gesture.index];
      const targetType = cardTarget(playedKey);
      setDragX(0);
      setDragLift(0);
      setCardDetached(false);
      setPlayReady(false);
      if (targetType === 'singleEnemy' && enemies.length > 1) {
        setPendingTargetCard(gesture.index);
        setSelectedCard(gesture.index);
        return;
      }
      const targetId = targetType === 'singleEnemy' ? enemies[0]?.id : null;
      spawnThrowGhost(playedKey, rect, targetId);
      dispatch({ type: 'play', index: gesture.index, targetId });
      return;
    }
    setDragX(0);
    setDragLift(0);
    setCardDetached(false);
    setPlayReady(false);
  };
  const chooseEnemyTarget = unit => {
    setFocusedEnemyId(unit.id);
    if (pendingTargetCard < 0) return;
    const hand = document.querySelector('.hand');
    const playedElement = hand?.querySelector(`[data-hand-index="${pendingTargetCard}"]`);
    const rect = playedElement?.getBoundingClientRect();
    const playedKey = state.hand[pendingTargetCard];
    if (!playedKey) { setPendingTargetCard(-1); return; }
    spawnThrowGhost(playedKey, rect, unit.id);
    dispatch({ type: 'play', index: pendingTargetCard, targetId: unit.id });
    setPendingTargetCard(-1);
    setSelectedCard(-1);
  };
  return (
    <>
      <section className={`battlefield battle-speed-scope ${bossCleared ? 'boss-cleared' : ''}`} style={{ '--battle-speed': battleSpeed }}>
        <div className="battle-background pixel-art" style={{ backgroundImage: `url(${PIXEL_BACKGROUNDS[state.stage]})` }} />
        <div className="battle-depth" />
        {pendingTargetCard >= 0 && !outcome && <div className="target-select-banner"><Target size={16} /><span>选择「{card(state.hand[pendingTargetCard])?.name}」的目标</span><button type="button" onClick={() => { setPendingTargetCard(-1); setSelectedCard(-1); }}>取消</button></div>}
        <div className={`enemy-party enemy-count-${Math.max(1, allEnemyUnits.filter(unit => outcome || (unit.hp > 0 && unit.alive !== false)).length)} ${allEnemyUnits.some(unit => unit.kind === 'boss') ? 'has-boss' : ''} ${pendingTargetCard >= 0 ? 'is-targeting' : ''}`}>
          {allEnemyUnits.filter(unit => outcome || (unit.hp > 0 && unit.alive !== false)).map(unit => {
            const model = enemyFor(state, unit.id);
            const sprite = enemySpriteProps(state, unit);
            const unitMove = !outcome && unit.hp > 0 ? intent(state, unit.id) : null;
            const element = ELEMENTS[unit.element] || ELEMENTS.neutral;
            const focused = focusedUnit?.id === unit.id;
            return <button type="button" key={unit.id || model.name} data-enemy-id={unit.id} className={`enemy-unit ${focused ? 'is-focused' : ''} ${pendingTargetCard >= 0 && unit.hp > 0 ? 'is-targetable' : ''} ${unit.kind === 'boss' ? 'is-boss' : ''} ${unit.kind === 'summon' ? 'is-summon' : ''} ${unit.hp <= 0 || unit.alive === false ? 'is-defeated' : ''}`} onClick={() => !outcome && unit.hp > 0 && chooseEnemyTarget(unit)} disabled={Boolean(outcome)}>
              <span className={`enemy-unit-sprite pixel-art ${sprite.className} ${enemyHit && focused ? 'enemy-hit' : ''} ${unit.hp <= 0 || outcome === 'victory' ? 'enemy-defeated' : ''} ${bossCleared && unit.kind === 'boss' ? 'boss-defeated' : ''}`} style={sprite.style} />
              <span className="enemy-unit-shadow" />
              <span className="enemy-unit-card">
                <span className="enemy-unit-heading"><strong><i>{element.icon}</i>{model.name}</strong><small>{unit.hp} / {unit.maxHp}</small></span>
                <Bar value={unit.hp} max={unit.maxHp} tone="enemy" />
                {unitMove && <span className="enemy-unit-intent"><small>{unit.kind === 'summon' ? '召唤物行动' : '下回合'}</small><b>{(INTENTS[unitMove.kind] || (value => value.kind))(unitMove)}</b></span>}
                <span className="enemy-unit-status">{unit.block > 0 && <b><Shield size={11} />{unit.block}</b>}{unit.mark > 0 && <b><Target size={11} />{unit.mark}</b>}{unit.kind === 'summon' && <em>召唤</em>}</span>
              </span>
            </button>;
          })}
        </div>
        <div className="scene-vignette" />
        {enemyHit && <div key={`slash-${actionKey}`} className="slash-effect" />}
        {bossCleared && <div className="boss-defeat-fx" aria-hidden="true"><div className="boss-seal"><Crown /></div>{Array.from({ length: 24 }, (_, index) => <i key={index} style={{ '--shard': index, '--shard-x': `${18 + (index * 29) % 70}%`, '--shard-y': `${12 + (index * 17) % 72}%`, '--shard-delay': `${(index % 8) * 55}ms` }} />)}</div>}
        {outcome && <div className={`battle-result ${outcome} ${bossCleared ? 'boss-victory' : ''}`}><small>{bossCleared ? `CHAPTER ${state.stage + 1} CLEARED` : outcome === 'victory' ? 'DREAM CLEARED' : 'THE DREAM BREAKS'}</small><strong>{bossCleared ? '梦醒了' : outcome === 'victory' ? '胜利' : '挑战失败'}</strong><span>{bossCleared ? `${MAIN_STORY[state.stage].guest}的梦境留下了一段清晨记录` : outcome === 'victory' ? '恭喜，梦境重新安静下来' : '别担心，房车会带你回到灯下'}</span></div>}
        <div className="enemy-panel">
          <div className="enemy-name"><span>{enemy.title}</span><h2><i className="enemy-element-inline">{(ELEMENTS[focusedUnit?.element] || ELEMENTS.neutral).icon}</i>{enemy.name}</h2></div>
          {enemy.trait && <div className="enemy-trait"><b>{enemy.trait}</b><span>{enemy.traitText}</span></div>}
          {focusedUnit?.mark > 0 && <Tip text="当前弱点层数就是下一段攻击追加的无视护盾伤害。每段消耗 1 层，因此 4 层弱点会依次追加 4、3、2、1 点伤害。"><div className="mark"><Target size={14} />弱点 {focusedUnit.mark}</div></Tip>}
        </div>
      </section>

      <section className={`combat-ui battle-speed-scope ${playerHit ? 'player-damaged' : ''}`} style={{ '--battle-speed': battleSpeed }}>
        <div key={`player-${state.hp}`} className={`player-row ${playerHit ? 'player-hit' : ''} ${playerDelta?.value > 0 ? 'player-healed' : ''} ${playerGuarded ? 'player-guarded' : ''}`}>
          {playerHit && <div key={`scratch-${actionKey}`} className="player-scratch" aria-hidden="true"><i /><i /><i /></div>}
          {playerDelta?.value > 0 && <div key={`heal-${playerDelta.key}`} className="player-heal-effect" aria-hidden="true"><i /><i /><i /></div>}
          <span className="battle-character-avatar pixel-art" style={characterStyle(state.character, 2.2)} aria-label={CHARACTERS[state.character].name} />
          <div className="player-health">
            <div><span className="level-pill">Lv.{state.level}</span><small>{CHARACTERS[state.character].name}</small><Heart size={18} fill="currentColor" /><strong>{state.hp}</strong><span>/ {state.maxHp}</span>{state.block > 0 && <Tip text={state.character === 'xiaoshuai' ? `护盾优先抵消伤害；当前反击比例 ${Math.round((.35 + (battleSpecialization.reflectionPct || 0) + battleEquipmentStats.counterPower * .01) * 100)}%，回合结束保留 ${Math.round((.2 + (battleSpecialization.retainedBlockPct || 0)) * 100)}%。` : '护盾会优先抵消伤害，并在敌人行动后清空。'}><b><Shield size={15} />{state.block}</b></Tip>}</div>
            <Bar value={state.hp} max={state.maxHp} />
          </div>
          <Tip text="能量用于打出卡牌，每回合开始时恢复至 3。"><div key={`energy-${actionKey}`} className={`energy ${energyGain ? 'energy-gain' : ''}`}><Sparkles size={18} /><strong>{state.energy}</strong><span>/ 3</span></div></Tip>
          {playerDelta && <em key={playerDelta.key} className={`health-delta player-delta ${playerDelta.value > 0 ? 'heal' : 'damage'}`}>{playerDelta.value > 0 ? '+' : ''}{playerDelta.value}</em>}
          <div className="player-stat-deltas">{statDeltas.filter(item => ['player-block', 'energy'].includes(item.kind)).map(item => <em key={item.key} className={`stat-delta ${item.value > 0 ? 'gain' : 'loss'}`}>{item.label} {item.value > 0 ? '+' : ''}{item.value}</em>)}</div>
        </div>
        <div className="battle-equipment-stats" aria-label="当前装备加成">
          <span title="加到每张攻击牌的基础伤害"><Swords /><small>伤害</small><b>+{battleEquipmentStats.attack}</b></span>
          <span title="每回合开始时获得的护盾"><Shield /><small>护盾</small><b>+{battleEquipmentStats.block}</b></span>
          <span title="每场战斗胜利后的额外恢复"><Heart /><small>恢复</small><b>+{battleEquipmentStats.recovery}</b></span>
        </div>
        <div className="battle-statuses">
          {state.weak > 0 && <Tip text="虚弱会让你造成的基础伤害降低 25%，持续到下一回合。"><div className="status"><Moon size={14} />虚弱：伤害 -25%</div></Tip>}
          {state.character === 'gaigai' && state.warmth > 0 && <Tip text={`治疗牌会积攒暖意；下一张攻击将消耗 ${Math.round((1 - Math.min(.5, Math.max(battleSpecialization.warmthRetainPct || 0, battleSpecialization.warmthMastery ? .5 : 0))) * 100)}% 暖意并追加伤害。`}><div className="status warmth-status"><Flame size={14} />暖意 {state.warmth}</div></Tip>}
          {state.schoolChain > 1 && (battleSpecialization.chainDamagePct || battleSpecialization.chainBlock || battleSpecialization.chainHealing || battleSpecialization.chainDepthPct || battleSpecialization.followMastery) && <Tip text="连续使用同一流派的卡牌会触发追问专精的额外效果。"><div className="status"><BookOpen size={14} />连携 {state.schoolChain}</div></Tip>}
          {state.lucidCharge > 0 && <Tip text="下一张攻击会消耗清醒蓄力并追加伤害。"><div className="status"><Sparkles size={14} />清醒蓄力 {state.lucidCharge}</div></Tip>}
        </div>
        <div className="combat-body">
          <div className={`hand ${state.battleMode === 'auto' ? 'auto' : ''}`} style={{ '--fan-gap': `${handGap}px` }} aria-label="手牌">
            {state.hand.map((key, index) => {
              const offset = index - (state.hand.length - 1) / 2;
              return (
              <CardView key={`${key}-${index}`} cardKey={key} disabled={pendingTargetCard >= 0 || state.battleMode === 'auto' || card(key).cost > state.energy}
                preview={attackBreakdown(state, key, focusedUnit?.id)} active={index === autoIndex} selected={index === selectedCard} detached={index === selectedCard && cardDetached} playReady={index === selectedCard && playReady}
                style={{ '--fan-offset': offset, '--fan-y': Math.abs(offset) * 7, '--fan-z': 20 - Math.round(Math.abs(offset)), '--drag-x': `${index === selectedCard ? dragX : 0}px`, '--drag-lift': `${index === selectedCard ? dragLift : 0}px` }}
                handIndex={index} onPointerDown={event => beginCardGesture(index, event)} onPointerMove={moveCardGesture}
                onPointerUp={event => finishCardGesture(event)} onPointerCancel={event => finishCardGesture(event, true)} />
              );
            })}
          </div>
          <aside className="battle-log" aria-live="polite">
            <h3><BookOpen size={16} />梦境记录</h3>
            <div ref={battleLogRef}>{state.battleLog.map((item, index) => <p className={item.startsWith('状态：') ? 'battle-status-line' : ''} key={`${item}-${index}`}><BattleLogLine text={item} enemyName={enemy.name} /></p>)}</div>
          </aside>
        </div>
        <div className="turn-controls">
          <Tip text="抽牌堆用完后，弃牌堆会重新洗回抽牌堆。"><span>{state.battleMode === 'auto' ? '自动出牌中 · ' : ''}抽牌 {state.draw.length} · 弃牌 {state.discard.length}</span></Tip>
          <div className="speed-control" aria-label="战斗速度"><small>速度</small>{[1, 2, 3].map(speed => <button key={speed} className={battleSpeed === speed ? 'active' : ''} onClick={() => onBattleSpeed(speed)}>x{speed}</button>)}</div>
          <button className="end-turn" disabled={state.battleMode === 'auto' || pendingTargetCard >= 0} onClick={() => dispatch({ type: 'end' })}>{pendingTargetCard >= 0 ? '先选择目标' : state.battleMode === 'auto' ? '自动行动' : '结束回合'}</button>
        </div>
      </section>
      {throwGhosts.map(item => <CardView key={item.id} cardKey={item.cardKey} ghost ghostTarget={item.target} style={{ left: item.left, top: item.top, width: item.width, height: item.height, '--throw-x': `${item.throwX}px`, '--throw-y': `${item.throwY}px` }} />)}
      {state.battleMode === 'manual' && !state.tutorialDone && <div className="tutorial-backdrop"><section className="tutorial-card"><span>{tutorialStep + 1} / 3</span><h2>{['上滑打出卡牌', '观察能量与护盾', '抓住敌人弱点'][tutorialStep]}</h2><p>{['按住卡牌左右移动可换牌；上滑越过金色提示后，卡牌会脱离牌组并跟随手指，松手即可打出。', '每张牌消耗能量；护盾会先抵消伤害。每回合开始时能量恢复至 3。', '弱点层数既是剩余触发次数，也是下一段攻击追加的无视护盾伤害。每段攻击消耗 1 层，多段攻击可以连续触发。'][tutorialStep]}</p><button className="primary" onClick={() => tutorialStep < 2 ? setTutorialStep(tutorialStep + 1) : dispatch({ type: 'tutorialDone' })}>{tutorialStep < 2 ? '下一步' : '开始战斗'}</button></section></div>}
    </>
  );
}

function Reward({ state, dispatch }) {
  const [reviewing, setReviewing] = useState(false);
  const [confirmingSkip, setConfirmingSkip] = useState(false);
  const [picked, setPicked] = useState(null);
  const pickTimer = useRef(null);
  const loots = (state.lastLoots || []).map(id => itemFor(state, id)).filter(Boolean);
  const goldReward = Math.round((24 + state.stage * 8 + (state.elite ? 16 : 0)) * DIFFICULTIES[state.difficulty].reward);
  const pickedRank = picked ? skillRewardRank(state, picked) : 0;
  const pickedCard = picked ? card(rankedCardKey(picked, pickedRank)) : null;
  const levelUp = state.lastLevelUp;
  useEffect(() => () => window.clearTimeout(pickTimer.current), []);
  const chooseReward = key => {
    if (picked) return;
    setPicked(key);
    pickTimer.current = window.setTimeout(() => dispatch({ type: 'reward', key }), 650);
  };
  return <Overlay variant={`reward reward-loots-${Math.min(loots.length, 3)}`} background={PIXEL_BACKGROUNDS[state.stage]} eyebrow="DREAM CLEARED · 恭喜" title="胜利" text="梦境已经安宁，今晚的旅途仍会继续。">
    <div className="result-character"><span className="result-character-avatar pixel-art" style={characterStyle(state.character, 2)} /><p><strong>{CHARACTERS[state.character].name}</strong>“{CHARACTER_LINES[state.character].victory}”</p></div>
    <button className="review-button" onClick={() => setReviewing(true)}><BookOpen size={16} />回顾战斗</button>
    {loots.length > 0 && <div className="reward-loots">{loots.map(loot => <div key={loot.id} className={`loot-banner rarity-${loot.rarity}`}><Backpack /><span><small>物品等级 {loot.itemLevel} · {itemTier(loot).name} · 已放入背包</small><strong>{itemName(loot)}</strong><em>{itemLines(loot).join(' · ')}</em></span><b>{loot.rarity}</b></div>)}</div>}
    <div className="reward-progress"><strong className="reward-gold"><Coins />+{goldReward} 旅币</strong><span className={levelUp ? 'reward-level-up' : ''}>角色等级 <b>{levelUp ? `${levelUp.from} → ${levelUp.to}` : state.level}</b>{levelUp?.specializationPoints > 0 && <em>专精点 +{levelUp.specializationPoints}</em>}</span><span>{state.xp} / {state.nextXp} XP</span></div>
    <div className={`reward-xp ${levelUp ? 'reward-xp-level-up' : ''}`}><Bar value={state.xp} max={state.nextXp} tone="xp" /></div>
    <section className={`reward-choice-block ${picked ? 'has-picked' : ''}`}><h3 className="reward-heading">{picked ? '这段回忆已经收好' : '选择一张技能收入候补'}</h3>{pickedCard && <div className="reward-picked" role="status" aria-live="polite"><Check /><span><small>已收入候补</small><strong>{pickedCard.name}</strong></span></div>}<div className="reward-grid">{state.choices.map((key, index) => {
      const offset = index - (state.choices.length - 1) / 2;
      const previewRank = skillRewardRank(state, key);
      return <CardView key={key} cardKey={rankedCardKey(key, previewRank)} compact active={picked === key} style={{ '--fan-offset': offset, '--fan-y': Math.abs(offset) * 5, '--fan-z': 10 - Math.abs(offset) }} onClick={() => chooseReward(key)} disabled={Boolean(picked)} />;
    })}</div></section>
    <button className="skip-reward-button secondary" disabled={Boolean(picked)} onClick={() => setConfirmingSkip(true)}>放弃选牌</button>
    {reviewing && <BattleReview state={state} onClose={() => setReviewing(false)} />}
    {confirmingSkip && <SkipCardRewardConfirm onCancel={() => setConfirmingSkip(false)} onConfirm={() => dispatch({ type: 'reward', key: null })} />}
  </Overlay>;
}

const NODE_META = {
  battle: { label: '普通战斗', icon: Moon, tip: '普通战斗：难度较低，胜利后获得经验、卡牌和随机装备。' },
  elite: { label: '精英战斗', icon: Crown, tip: '精英战斗：敌人更强，但装备品质和旅币奖励更高。' },
  mystery: { label: '未知际遇', icon: CircleHelp, tip: '未知际遇：踏入后才会随机揭晓休息、合成、整备、夜路黑市、沿途事件或低概率负面事件。' },
  checkpoint: { label: '路标', icon: MapPin, tip: '路标：每 10 步出现，可回满生命继续探索，或安全返回房车。' },
  boss: { label: '首领', icon: Flame, tip: '区域首领：击败后完成本章并解锁下一站。' },
};

function JourneyRewardsModal({ state, onClose }) {
  const [selectedGear, setSelectedGear] = useState(null);
  const cards = state.journeyCardDrops || [];
  const items = (state.journeyNewItems || []).map(id => itemFor(state, id)).filter(Boolean);
  const total = cards.length + items.length;
  return <div className="journey-cards-backdrop" onClick={onClose}>
    <section className="journey-cards-dialog" role="dialog" aria-modal="true" aria-labelledby="journey-cards-title" onClick={event => event.stopPropagation()}>
      <header><div><small>本次夜程收获</small><h2 id="journey-cards-title">本次收获</h2><p>共 {total} 件 · 卡牌 {cards.length} · 装备 {items.length}</p></div><button onClick={onClose}>关闭</button></header>
      {total > 0 ? <div className="journey-rewards-content">
        {cards.length > 0 && <section className="journey-reward-section"><header><strong>获得的卡牌</strong><span>{cards.length} 张</span></header><div className="journey-cards-grid">{cards.map((key, index) => <CardView key={`${key}-${index}`} cardKey={key} compact isNew />)}</div></section>}
        {items.length > 0 && <section className="journey-reward-section"><header><strong>获得的装备</strong><span>{items.length} 件</span></header><div className="journey-gear-grid">{items.map(item => <GearRow key={item.id} item={item} equipped={Object.values(state.equipment).includes(item.id)} isNew onOpen={() => setSelectedGear(item.id)} />)}</div><small className="journey-readonly-hint">旅途中只能查看，回到房车后才能更换装备。</small></section>}
      </div> : <div className="journey-cards-empty"><BookOpen /><strong>还没有获得收获</strong><span>战斗胜利和部分沿途事件会带来新卡牌与装备。</span></div>}
    </section>
    {selectedGear && itemFor(state, selectedGear) && <div onClick={event => event.stopPropagation()}><GearDetail state={state} item={itemFor(state, selectedGear)} disabled onClose={() => setSelectedGear(null)} onEquip={() => {}} /></div>}
  </div>;
}

function CriticalQuestTracker({ state }) {
  const [hint, setHint] = useState(null);
  const hintTimer = useRef(null);
  const quests = Object.entries(state.criticalSideQuests || {})
    .filter(([, progress]) => ['active', 'ready', 'claiming'].includes(progress.status))
    .map(([id, progress]) => ({ id, progress, quest: CRITICAL_SIDE_QUESTS[id] }))
    .filter(entry => entry.quest);
  useEffect(() => () => window.clearTimeout(hintTimer.current), []);
  if (!quests.length) return null;
  const showHint = quest => {
    setHint(`继续追踪：${quest.objective}。`);
    window.clearTimeout(hintTimer.current);
    hintTimer.current = window.setTimeout(() => setHint(null), 2200);
  };
  return <aside className="map-critical-quests" aria-label="击败类委托进度">
    <header><BookOpen /><strong>击败委托</strong></header>
    {quests.map(({ id, progress, quest }) => <button key={id} type="button" className={progress.status !== 'active' ? 'ready' : ''} onClick={() => showHint(quest)}>
      <span><b>{SIDE_STORIES[quest.storyId]?.name || '长期委托'}</b><small>{quest.objective}</small></span>
      <strong>{Math.min(progress.progress, progress.target)} / {progress.target}</strong>
    </button>)}
    {hint && <div className="map-critical-hint" role="status">{hint}</div>}
  </aside>;
}

function MapView({ state, dispatch, onDebug }) {
  const { show } = React.useContext(TooltipContext);
  const [confirmReturn, setConfirmReturn] = useState(false);
  const [showJourneyCards, setShowJourneyCards] = useState(false);
  const nodes = chapterMap(state.stage, state.mapSeed);
  const previous = nodes.find(node => node.id === state.currentNode);
  const available = new Set(state.mapRow < 0 ? nodes.filter(node => node.row === 0).map(node => node.id) : (previous?.links || []));
  const byId = Object.fromEntries(nodes.map(node => [node.id, node]));
  const scrollRef = useRef(null);
  const rowHeight = 68;
  const mapHeight = MAP_STEPS * rowHeight + 80;
  const y = row => mapHeight - 54 - row * rowHeight;
  const chapter = CHAPTERS[state.stage];
  const segment = Math.min(4, Math.floor(Math.max(0, state.mapRow + 1) / 10));
  const atCheckpoint = state.mapRow === state.checkpointRow;
  const equipped = new Set(Object.values(state.equipment).filter(Boolean));
  const unsecuredItemCount = (state.unsecuredLoot || []).filter(id => itemFor(state, id) && !equipped.has(id)).length;
  const unsecuredCardCount = (state.unsecuredCards || []).length;
  const journeyItemCount = (state.journeyNewItems || []).filter(id => itemFor(state, id)).length;
  const journeyRewardCount = (state.journeyCardDrops?.length || 0) + journeyItemCount;
  useEffect(() => {
    const scroller = scrollRef.current;
    if (!scroller) return;
    const targetRow = state.mapRow < 0 ? 0 : Math.min(MAP_STEPS - 1, state.mapRow + 1);
    scroller.scrollTop = Math.max(0, y(targetRow) - scroller.clientHeight * .68);
  }, [state.mapRow, state.stage]);
  return <section className="map-view">
    <div className="map-art pixel-art" style={{ backgroundImage: `url(${PIXEL_BACKGROUNDS[state.stage]})` }} /><div className="map-shade" />
    <header className="map-heading">{CHEATS_ENABLED ? <button className="eyebrow map-debug-trigger" onClick={onDebug} aria-label="打开测试面板">第 {state.stage + 1} 站 · 第 {segment + 1} 段</button> : <span className="eyebrow">第 {state.stage + 1} 站 · 第 {segment + 1} 段</span>}<h1>{chapter.name}</h1><p>{SEGMENT_NAMES[segment]} · 选择发光的下一节点，穿过 50 段夜路。</p></header>
    <div className="map-stats"><Tip text="提升等级会增加生命上限；经验来自战斗。"><span><TrendingUp />Lv.{state.level}</span></Tip><Tip text="当前生命。降到 0 时可以选择复活回房车。"><span><Heart />{state.hp}/{state.maxHp}</span></Tip><Tip text={`旅币可用于工坊、设施升级、旅途交易和买活。当前等级买活需要 ${reviveCost(state)} 枚旅币。`}><span><Coins />{state.gold}</span></Tip><div className="map-actions"><button onClick={() => setConfirmReturn(true)}>返回房车</button><button onClick={() => setShowJourneyCards(true)}>本次收获 {journeyRewardCount}</button></div></div>
    <CriticalQuestTracker state={state} />
    <div className="map-scroll" ref={scrollRef}>
    <div className="route-map" style={{ height: `${mapHeight}px` }}>
      <svg viewBox={`0 0 100 ${mapHeight}`} preserveAspectRatio="none" aria-hidden="true">
        {nodes.flatMap(node => node.links.map(link => {
          const next = byId[link];
          const travelled = state.visited.includes(node.id) && state.visited.includes(next.id);
          return <line key={`${node.id}-${link}`} x1={node.x} y1={y(node.row)} x2={next.x} y2={y(next.row)} className={travelled ? 'travelled' : ''} />;
        }))}
      </svg>
      {CHECKPOINT_STEPS.map(step => <div key={step} className="map-milepost" style={{ top: `${y(step - 1)}px` }}><span>{step} · {CHECKPOINTS[step].title}</span></div>)}
      {nodes.map(node => {
        const meta = NODE_META[node.type];
        const visited = state.visited.includes(node.id), enabled = available.has(node.id), current = state.currentNode === node.id;
        const nodeCooldown = node.type === 'mystery' ? magicHouseCooldownRemaining(state, node.id) : 0;
        const coolingDown = nodeCooldown > 0;
        const Icon = coolingDown ? Hourglass : meta.icon;
        return <button key={node.id} className={`map-node ${node.type} ${coolingDown ? 'cooldown' : ''} ${visited ? 'visited' : ''} ${enabled ? 'available' : ''} ${current ? 'current' : ''}`}
          style={{ left: `${node.x}%`, top: `${y(node.row)}px` }} aria-disabled={!enabled} onClick={event => enabled ? dispatch({ type: 'node', id: node.id }) : coolingDown ? show(`魔法屋重新洗牌中，还需前进 ${nodeCooldown} 步。`, event) : show(visited ? '这个节点已经走过。' : '需要沿当前节点亮起的连线继续前进。', event)} aria-label={`${meta.label} · 第 ${node.row + 1} 步${coolingDown ? ` · 冷却剩余 ${nodeCooldown} 步` : ''}`}>
          {current ? <i className="map-character-avatar pixel-art" style={characterStyle(state.character, 2.3)} /> : <Icon />}<span>{coolingDown ? `${nodeCooldown} 步` : enabled ? '可前往' : meta.label}</span>
        </button>;
      })}
    </div></div>
    <div className="map-legend">{Object.entries(NODE_META).map(([key, meta]) => <Tip key={key} text={meta.tip}><span><meta.icon />{meta.label}</span></Tip>)}</div>
    {confirmReturn && <ReturnHubConfirm safe={atCheckpoint} atStart={state.mapRow < 0} unsecuredItemCount={unsecuredItemCount} unsecuredCardCount={unsecuredCardCount} onCancel={() => setConfirmReturn(false)} onConfirm={() => { setConfirmReturn(false); dispatch({ type: 'returnHub' }); }} />}
    {showJourneyCards && <JourneyRewardsModal state={state} onClose={() => setShowJourneyCards(false)} />}
  </section>;
}

function MysteryStation({ state, dispatch }) {
  const { playSfx } = React.useContext(MusicContext);
  const [rolling, setRolling] = useState(true);
  const [reelIndex, setReelIndex] = useState(0);
  const result = MYSTERY_STATIONS.find(station => station.type === state.mysteryResult) || MYSTERY_STATIONS[0];
  useEffect(() => {
    playSfx('mysteryTick');
    const interval = window.setInterval(() => {
      setReelIndex(index => (index + 1) % MYSTERY_STATIONS.length);
      playSfx('mysteryTick');
    }, 120);
    const timer = window.setTimeout(() => {
      window.clearInterval(interval);
      setRolling(false);
      playSfx(state.mysteryResult === 'negative' ? 'mysteryBad' : 'mysteryReveal');
    }, 1080);
    return () => { window.clearInterval(interval); window.clearTimeout(timer); };
  }, []);
  const shown = rolling ? MYSTERY_STATIONS[reelIndex] : result;
  return <Overlay background={PIXEL_BACKGROUNDS[state.stage]} eyebrow="未知际遇" title="命运魔法屋" text="路上的故事正在重新洗牌，停下时才知道今晚会遇见什么。" variant="mystery-overlay">
    <div className={`mystery-machine ${rolling ? 'is-rolling' : 'is-revealed'}`}>
      <div className="mystery-lights" aria-hidden="true">{Array.from({ length: 10 }, (_, index) => <i key={index} />)}</div>
      <div className="mystery-window"><CircleHelp /><small>{rolling ? '沿途事件抽取中' : '本次际遇'}</small><strong>{shown.label}</strong></div>
      <div className="mystery-track" aria-hidden="true">{MYSTERY_STATIONS.map(station => <span key={station.type}>{station.label}</span>)}</div>
    </div>
    <button className="primary mystery-enter" disabled={rolling} onClick={() => dispatch({ type: 'mystery' })}>{rolling ? '正在揭晓...' : `进入${result.label}`}</button>
  </Overlay>;
}

function EventView({ state, dispatch }) {
  const values = ambientEventValues(state);
  return <Overlay background={PIXEL_BACKGROUNDS[state.stage]} eyebrow="沿途事件" title="夜路杂货车" text="亮着小灯的摊主，提出两种交换。">
    <div className="camp-grid">
      <CampChoice icon={Heart} title="喝杯花茶" text={`回复最多 ${values.teaHeal} 点生命`} onClick={() => dispatch({ type: 'event', choice: 'spring' })} />
      <CampChoice icon={Coins} title="出售旧照片" text={`消耗 ${values.photoHpCost} 点生命，获得 ${values.photoGold} 枚旅币`} onClick={() => dispatch({ type: 'event', choice: 'bargain' })} />
    </div>
  </Overlay>;
}

function BlackMarketView({ state, dispatch }) {
  const [confirming, setConfirming] = useState(null);
  const [inspectingGear, setInspectingGear] = useState(null);
  const offers = state.blackMarketOffers || [];
  return <Overlay background={PIXEL_BACKGROUNDS[state.stage]} eyebrow="命运魔法屋 · 稀有际遇" title="夜路黑市" text="柜台只亮这一晚。旅币足够就能继续兑换，带走的藏品会从柜台撤下。" variant="black-market-overlay">
    <div className="black-market-grid">
      {offers.map(offer => <article className={`black-market-offer offer-${offer.kind}`} key={offer.id}>
        <header><small>{offer.kind === 'randomCard' ? '封蜡回忆' : offer.kind === 'card' ? '明牌回忆' : '改装旧物'}</small><strong>{offer.kind === 'randomCard' ? '当前章随机技能' : offer.label}</strong></header>
        {offer.kind === 'randomCard' && <div className="black-market-sealed"><PackageOpen /><b>Lv.{cardRank(offer.key)}</b><span>付款后揭晓 · 不可刷新</span></div>}
        {offer.kind === 'card' && <div className="black-market-card"><CardView cardKey={offer.key} compact /><span>当前章技能 · Lv.{cardRank(offer.key)}</span></div>}
        {offer.kind === 'gear' && <div className="black-market-gear"><GearRow item={offer.item} onOpen={() => setInspectingGear(offer.item)} /><span>{itemLines(offer.item).join(' · ')}</span></div>}
        <button className="side-shop-price" disabled={state.gold < offer.cost} onClick={() => setConfirming(offer)}><Coins />{state.gold < offer.cost ? `还差 ${offer.cost - state.gold}` : offer.cost}</button>
      </article>)}
    </div>
    <button className="secondary memory-leave" onClick={() => dispatch({ type: 'blackMarketLeave' })}>不买了，继续赶路</button>
    <SideShopConfirm good={confirming} gold={state.gold} onCancel={() => setConfirming(null)} onConfirm={() => { dispatch({ type: 'blackMarketBuy', id: confirming.id }); setConfirming(null); }} />
    {inspectingGear && <GearDetail state={state} item={inspectingGear} disabled hideAction onClose={() => setInspectingGear(null)} onEquip={() => {}} />}
  </Overlay>;
}

function MainStoryView({ state, dispatch }) {
  const progress = state.mainStory;
  const story = MAIN_STORY[progress?.stage];
  if (!story || !progress) return null;
  const scene = progress.beat === 'ending' && progress.variant === 'hidden'
    ? story.endingHidden
    : progress.beat === 'ending' && progress.variant === 'fragmented'
      ? story.endingFragmented
      : story[progress.beat];
  if (!scene) return null;
  const isEnding = progress.beat === 'ending';
  const isBoss = progress.beat === 'boss';
  const SceneIcon = isEnding ? progress.stage === MAIN_STORY.length - 1 ? Flame : BookOpen : isBoss ? Crown : Moon;
  return <Overlay background={PIXEL_BACKGROUNDS[progress.stage]} eyebrow={scene.eyebrow} title={scene.title} text={scene.text} variant={`main-story-overlay story-${progress.beat}`}>
    <section className="main-story-record">
      <span className="main-story-mark"><SceneIcon /></span>
      <blockquote>{scene.quote}</blockquote>
      {isEnding && <div className="main-story-clue"><BookOpen /><span><small>{progress.stage === MAIN_STORY.length - 1 ? '登记簿已更新' : '找回一段记录'}</small><strong>{progress.stage === MAIN_STORY.length - 1 ? progress.variant === 'fragmented' ? '阁楼客房仍为她留着' : '朝安 · 阁楼客房' : story.clueName}</strong></span></div>}
      {mainStorySpecializationReward(progress.stage, progress.beat) > 0 && <div className="main-story-specialization reward"><Sparkles /><span><small>章节通关奖励</small><strong>专精点 +{mainStorySpecializationReward(progress.stage, progress.beat)}</strong></span></div>}
    </section>
    <button className="primary main-story-continue" onClick={() => dispatch({ type: 'mainStoryContinue' })}>{scene.action}</button>
  </Overlay>;
}

function SideStoryView({ state, dispatch }) {
  const story = SIDE_STORIES[state.sideStory?.id];
  if (!story) return null;
  return <Overlay background={PIXEL_BACKGROUNDS[state.stage]} eyebrow={story.intro.eyebrow} title={story.intro.title} text={story.intro.text} variant="side-story-overlay">
    <div className="camp-grid side-story-choices">
      {story.intro.choices.map(choice => <CampChoice key={choice.key} icon={choice.key === 'decline' || choice.key === 'close' ? X : Sparkles} title={choice.title} lockSeconds={3} onClick={() => dispatch({ type: 'sideStoryChoice', choice: choice.key })} />)}
    </div>
  </Overlay>;
}

function SideShopPreview({ good, state, onClose }) {
  if (!good) return null;
  if (good.kind === 'gear' && good.item) return <GearDetail state={state} item={good.item} disabled hideAction onClose={onClose} onEquip={() => {}} />;
  const previewCard = good.kind === 'card' ? rankedCardKey(good.key, skillRewardRank(state, good.key) + (good.rankBonus || 0)) : null;
  const buff = good.effect || {};
  const buffLines = [buff.energy ? `每场战斗开局能量 +${buff.energy}` : null, buff.block ? `每场战斗开局护盾 +${buff.block}` : null, buff.firstStrike ? `每场战斗首次伤害 +${buff.firstStrike}` : null].filter(Boolean);
  return createPortal(<div className="confirm-backdrop side-shop-detail-backdrop" onClick={onClose}>
    <section className="side-shop-detail" role="dialog" aria-modal="true" aria-labelledby="side-shop-detail-title" onClick={event => event.stopPropagation()}>
      <header><span><small>摊主藏品</small><h2 id="side-shop-detail-title">{good.label}</h2></span><button className="icon-button" onClick={onClose} aria-label="关闭商品详情"><X /></button></header>
      {previewCard && <div className="side-shop-card-preview"><CardView cardKey={previewCard} compact /><strong>{card(previewCard).name} · Lv.{cardRank(previewCard)}</strong></div>}
      {good.kind === 'gear' && <div className="side-shop-gear-preview">{good.bases.map(base => <div key={base}><PackageOpen /><span><strong>{ITEMS[base]?.name || base}</strong><small>{SLOT_LABELS[ITEMS[base]?.slot] || '装备'} · 获得时随机生成品质与词条</small></span></div>)}</div>}
      {good.kind === 'buff' && <div className="side-shop-buff-preview"><Sparkles /><span><strong>持续 {buff.battles || 1} 场战斗</strong>{buffLines.map(line => <small key={line}>{line}</small>)}</span></div>}
      <button className="secondary" onClick={onClose}>返回摊位</button>
    </section>
  </div>, document.body);
}

function SideShopConfirm({ good, gold, onCancel, onConfirm }) {
  if (!good) return null;
  return createPortal(<div className="confirm-backdrop" onClick={onCancel}>
    <section className="confirm-dialog side-shop-confirm" role="alertdialog" aria-modal="true" aria-labelledby="side-shop-confirm-title" onClick={event => event.stopPropagation()}>
      <span className="confirm-icon"><Coins /></span><small>确认兑换</small>
      <h2 id="side-shop-confirm-title">带走这件藏品？</h2>
      <p>“{good.label}”需要 {good.cost} 枚旅币。确认后无法反悔。</p>
      <div className="side-shop-balance"><span>现有 <b>{gold}</b></span><span>兑换后 <b>{gold - good.cost}</b></span></div>
      <div className="confirm-actions"><button className="secondary" onClick={onCancel}>再看看</button><button className="primary" onClick={onConfirm}><Coins />确认兑换</button></div>
    </section>
  </div>, document.body);
}

function SideResolveView({ state, dispatch }) {
  const scene = state.pendingScene;
  const [selectedCards, setSelectedCards] = useState([]);
  const [selectedGear, setSelectedGear] = useState([]);
  const [shopPreview, setShopPreview] = useState(null);
  const [shopConfirm, setShopConfirm] = useState(null);
  useEffect(() => {
    setSelectedCards([]);
    setSelectedGear([]);
    setShopPreview(null);
    setShopConfirm(null);
  }, [scene?.storyId, scene?.kind]);
  useEffect(() => {
    if (scene?.kind === 'shop' && scene.goods?.some(good => good.kind === 'gear' && !good.item)) dispatch({ type: 'prepareSideShop' });
  }, [scene, dispatch]);
  if (!scene) return null;
  const toggleCard = index => setSelectedCards(current => current.includes(index) ? current.filter(item => item !== index) : [...current, index].slice(0, scene.count || 0));
  const toggleGear = id => setSelectedGear(current => current.includes(id) ? current.filter(item => item !== id) : [...current, id].slice(0, scene.count || 0));
  const cardCandidates = scene.kind === 'turnin_cards' ? sideCardTurnInCandidates(state, { school: scene.school }) : [];
  const gearCandidates = scene.kind === 'turnin_gear' ? sideGearTurnInCandidates(state) : [];
  const activeSpent = selectedCards.filter(index => cardCandidates.some(item => item.index === index && item.active)).length;
  const wouldUndersizeDeck = activeSpent > 0 && state.deck.length - activeSpent < 10;
  const cardSubmitDisabled = selectedCards.length !== scene.count || wouldUndersizeDeck;
  const cardRule = scene.school ? `请选择 ${scene.count} 张“${scene.school}”技能牌` : `请选择 ${scene.count} 张技能牌`;
  const cardStatus = selectedCards.length !== scene.count
    ? `已选择 ${selectedCards.length} / ${scene.count}`
    : wouldUndersizeDeck
      ? `其中 ${activeSpent} 张正在出战；交出后出战牌组少于 10 张，请改选候补牌`
      : `已选择 ${scene.count} 张，可以交付`;
  const gearStatus = selectedGear.length === scene.count ? `已选择 ${scene.count} 件，可以交付` : `已选择 ${selectedGear.length} / ${scene.count}`;
  const critical = Boolean(scene.promise?.criticalQuest);
  if (critical) {
    const rewardText = scene.promise.type === 'specializationReset'
      ? <>获得道具“<em className="blank-bookmark-name">空白书签</em>”，可在专精面板重置全部专精。</>
      : scene.promise.type === 'cardClue'
        ? `获得技能“${card(scene.promise.key).name}”，并补全一条终章记录。`
        : '补全一条不会因章节结束而丢失的终章记录。';
    return createPortal(<div className="confirm-backdrop critical-quest-backdrop">
      <section className="confirm-dialog critical-quest-complete" role="alertdialog" aria-modal="true" aria-labelledby="critical-quest-title">
        <span className="confirm-icon"><BookOpen /></span>
        <small>长期委托完成</small>
        <h2 id="critical-quest-title">{scene.title}</h2>
        <p>{scene.text}</p>
        <div className="critical-quest-reward"><Check /><span><small>完成奖励</small><strong>{rewardText}</strong></span></div>
        <button className="primary" onClick={() => dispatch({ type: 'sideResolveClaim' })}>{scene.claimLabel || '领取奖励'}</button>
      </section>
    </div>, document.body);
  }
  return <Overlay background={PIXEL_BACKGROUNDS[state.stage]} eyebrow={critical ? '长期委托完成' : '夜路回声'} title={scene.title} text={scene.text} variant="side-resolve-overlay">
    {scene.kind === 'shop' && <div className="side-shop">
      {scene.goods.map(good => <article key={good.id} className={state.gold < good.cost ? 'locked' : ''}>
        <button className="side-shop-view" onClick={() => setShopPreview(good)} aria-label={`查看${good.label}`} title="查看商品详情">{good.kind === 'gear' ? <PackageOpen /> : good.kind === 'card' ? <BookOpen /> : <Sparkles />}</button>
        <span className="side-shop-copy"><strong>{good.label}</strong>{good.kind === 'gear' && good.item && <small>{good.item.rarity} · Lv.{good.item.itemLevel || 1} · {itemLines(good.item).slice(0, 2).join(' · ')}</small>}</span>
        <button className="side-shop-price" disabled={state.gold < good.cost} onClick={() => setShopConfirm(good)}><Coins />{state.gold < good.cost ? `还差 ${good.cost - state.gold}` : good.cost}</button>
      </article>)}
      <button className="secondary side-leave" onClick={() => dispatch({ type: 'sideResolveLeave' })}>离开摊位</button>
      <SideShopPreview good={shopPreview} state={state} onClose={() => setShopPreview(null)} />
      <SideShopConfirm good={shopConfirm} gold={state.gold} onCancel={() => setShopConfirm(null)} onConfirm={() => dispatch({ type: 'sideShopBuy', id: shopConfirm.id })} />
    </div>}
    {scene.kind === 'reward' && <button className="primary mystery-enter" onClick={() => dispatch({ type: 'sideResolveClaim' })}>{scene.claimLabel || '收下这段回声'}</button>}
    {scene.kind === 'turnin_cards' && <div className="side-turnin">
      <div className={`side-rule ${cardSubmitDisabled && selectedCards.length === scene.count ? 'has-warning' : ''}`}><BookOpen /><span><strong>{cardRule}</strong><small>由你决定交出哪些回忆。出战牌组必须保留至少 10 张，角色仅有的一张核心牌不会列入候选。</small><b>{cardStatus}</b></span></div>
      {cardCandidates.length >= scene.count ? <div className="side-card-picks">{cardCandidates.map(item => <button key={item.index} className={selectedCards.includes(item.index) ? 'selected' : ''} onClick={() => toggleCard(item.index)}>
        <CardView cardKey={item.key} compact isNew={item.fresh} />
        <span>{item.active ? '出战中' : '候补'} · Lv.{cardRank(item.key)}</span>
      </button>)}</div> : <div className="memory-empty"><BookOpen /><strong>还没有足够的回忆</strong><p>{SIDE_STORIES[scene.storyId]?.miss || '这段夜路还没有准备好。'}</p></div>}
      <div className="side-turnin-actions"><button className="primary" disabled={cardSubmitDisabled} onClick={() => dispatch({ type: 'sideTurnIn', indexes: selectedCards })}>{selectedCards.length === scene.count && wouldUndersizeDeck ? '出战牌不足 10 张' : `交出 ${scene.count} 张回忆`}</button><button className="secondary" onClick={() => dispatch({ type: 'sideResolveLeave' })}>放弃交付并离开</button></div>
    </div>}
    {scene.kind === 'turnin_gear' && <div className="side-turnin">
      <div className="side-rule"><PackageOpen /><span><strong>请选择 {scene.count} 件未装备的旧物</strong><small>已穿戴的装备不会被列入候选。只有确认交付后，选中的旧物才会被消耗。</small><b>{gearStatus}</b></span></div>
      {gearCandidates.length >= scene.count ? <div className="side-gear-picks">{gearCandidates.map(item => <button key={item.id} className={`rarity-${item.rarity} ${selectedGear.includes(item.id) ? 'selected' : ''}`} onClick={() => toggleGear(item.id)}>
        <PackageOpen />
        <strong>{itemName(item)}</strong>
        <small>{item.rarity} · {SLOT_LABELS[ITEMS[item.base].slot]} · 评分 {itemScore(item)}</small>
      </button>)}</div> : <div className="memory-empty"><PackageOpen /><strong>还没有合适的旧物</strong><p>{SIDE_STORIES[scene.storyId]?.miss || '这段夜路还没有准备好。'}</p></div>}
      <div className="side-turnin-actions"><button className="primary" disabled={selectedGear.length !== scene.count} onClick={() => dispatch({ type: 'sideTurnIn', ids: selectedGear })}>交出 {scene.count} 件旧物</button><button className="secondary" onClick={() => dispatch({ type: 'sideResolveLeave' })}>放弃交付并离开</button></div>
    </div>}
  </Overlay>;
}

function Camp({ state, dispatch }) {
  const pillowBattles = state.pillowBattles || 0;
  const values = ambientEventValues(state);
  return <Overlay background={PIXEL_BACKGROUNDS[state.stage]} eyebrow="安全节点" title="亮灯的休息站" text="只能做一次选择，然后继续赶路。">
    <div className="camp-grid">
      <CampChoice icon={Heart} title="在房车里小睡" text={`回复最多 ${values.campHeal} 点生命`} onClick={() => dispatch({ type: 'camp', choice: 'rest' })} />
      <CampChoice icon={Shield} title="购买柔软靠枕" text={pillowBattles > 0 ? `仍可持续 ${pillowBattles} 场战斗 · 每回合获得 ${values.pillowBlock} 点护盾` : `${values.pillowCost} 旅币 · 接下来 ${values.pillowBattles} 场战斗，每回合获得 ${values.pillowBlock} 点护盾`} disabled={state.gold < values.pillowCost || state.pillowActive || pillowBattles > 0} onClick={() => dispatch({ type: 'camp', choice: 'relic' })} />
    </div>
  </Overlay>;
}

function MemoryStation({ state, dispatch }) {
  const [merging, setMerging] = useState(null);
  const mergeTimer = useRef(null);
  const mergeable = useMemo(() => {
    const counts = new Map();
    for (const key of state.cardLibrary) counts.set(key, (counts.get(key) || 0) + 1);
    return [...counts.entries()]
      .filter(([key, count]) => count >= 2 && cardRank(key) < 10 && !key.endsWith('~gear'))
      .sort(([left], [right]) => cardRank(right) - cardRank(left) || card(left).name.localeCompare(card(right).name, 'zh-CN'));
  }, [state.cardLibrary]);
  useEffect(() => () => window.clearTimeout(mergeTimer.current), []);
  const merge = key => {
    if (merging) return;
    setMerging(key);
    mergeTimer.current = window.setTimeout(() => dispatch({ type: 'memory', cardKey: key }), 1200);
  };
  return <Overlay background={PIXEL_BACKGROUNDS[state.stage]} eyebrow="技能合成站" title="整理回忆" text="选择一组相同回忆：两张同名、同等级技能合成为一张高一级技能。">
    {mergeable.length ? <div className={`memory-grid ${merging ? 'is-merging' : ''}`}>{mergeable.map(([key, count]) => <div className="memory-choice" key={key}>
      <CardView cardKey={key} compact onClick={() => merge(key)} />
      <strong>{count} 张 Lv.{cardRank(key)}</strong>
      <span>合成为 1 张 Lv.{cardRank(key) + 1}</span>
    </div>)}</div> : <div className="memory-empty"><Combine /><strong>暂时没有可以合成的技能</strong><p>需要至少两张同名、同等级且未满级的卡牌。</p></div>}
    <button className="memory-leave secondary" disabled={Boolean(merging)} onClick={() => dispatch({ type: 'memory', cardKey: null })}>{mergeable.length ? '暂不整理' : '继续赶路'}</button>
    {merging && <div className="memory-merge-feedback" role="status" aria-live="polite">
      <div className="memory-merge-stage">
        <span className="memory-merge-source source-left"><CardView cardKey={merging} compact /></span>
        <span className="memory-merge-source source-right"><CardView cardKey={merging} compact /></span>
        <Combine className="memory-merge-icon" />
        <span className="memory-merge-result"><CardView cardKey={upgradeCardKey(merging)} compact /></span>
      </div>
      <strong>{card(merging).name}合成成功</strong>
      <span>Lv.{cardRank(merging)} → Lv.{cardRank(merging) + 1}</span>
    </div>}
  </Overlay>;
}

function CardLibraryPanel({ state, dispatch }) {
  const { show } = React.useContext(TooltipContext);
  const [pendingDiscard, setPendingDiscard] = useState(null);
  const canManage = ['hub', 'loadout'].includes(state.phase);
  const canAutoLoadout = state.cardLibrary.length >= 10;
  const groups = useMemo(() => {
    const counts = new Map();
    for (const key of state.cardLibrary) counts.set(key, { key, total: (counts.get(key)?.total || 0) + 1, active: 0 });
    for (const key of state.deck) {
      const group = counts.get(key);
      if (group) group.active++;
    }
    return [...counts.values()].sort((left, right) => compareCardKeys(left.key, right.key));
  }, [state.cardLibrary, state.deck]);
  const manage = (operation, group, event) => {
    if (!canManage) return show('只有在房车或牌组整备站才能调整出战牌组。', event);
    if (operation === 'activate' && group.active >= group.total) return show('这张牌没有候补副本，无法继续上场。', event);
    if (operation === 'bench' && group.active <= 0) return show('这张牌当前不在出战牌组中。', event);
    if (operation === 'bench' && state.deck.length <= 10) return show('出战牌组至少保留 10 张，当前不能下场。', event);
    if (operation === 'discard') {
      if (state.phase !== 'hub') return show('永久丢弃只能在房车内进行，避免影响本次探索的遗失判定。', event);
      const hasBenchedCopy = group.total > group.active;
      if (!hasBenchedCopy && state.deck.length <= 10) return show('没有候补副本，且出战牌组至少需要保留 10 张。', event);
      setPendingDiscard(group);
      return;
    }
    dispatch({ type: 'loadout', operation, key: group.key });
  };
  return <div className="card-library">
    <header><span><strong>出战 {state.deck.length} 张</strong><small>技能库 {state.cardLibrary.length} 张</small></span><div className="card-library-header-actions">{state.deck.length < 10 && <b>出战牌不足 10 张，可从候补补充</b>}<button disabled={!canManage || !canAutoLoadout} title="自动选择 10 张适合当前角色的技能" onClick={() => dispatch({ type: 'loadout', operation: 'activateAll' })}><ListPlus />一键上阵</button></div></header>
    <div className="card-library-grid">{groups.map(group => <article className="card-library-entry" key={group.key}>
      <CardView cardKey={group.key} compact isNew={state.journeyNewCards?.includes(cardBaseKey(group.key))} onClick={() => dispatch({ type: 'viewCard', key: group.key })} />
      <div className="card-library-status"><span>出战 {group.active} / 总计 {group.total}</span><span>候补 {group.total - group.active}</span></div>
      <div className="card-library-actions"><button className={!canManage || group.active >= group.total ? 'is-disabled' : ''} aria-disabled={!canManage || group.active >= group.total} onClick={event => manage('activate', group, event)}>出战</button><button className={!canManage || group.active <= 0 || state.deck.length <= 10 ? 'is-disabled' : ''} aria-disabled={!canManage || group.active <= 0 || state.deck.length <= 10} onClick={event => manage('bench', group, event)}>下场</button><button className={`discard-card ${state.phase !== 'hub' || (group.total <= group.active && state.deck.length <= 10) ? 'is-disabled' : ''}`} aria-disabled={state.phase !== 'hub' || (group.total <= group.active && state.deck.length <= 10)} onClick={event => manage('discard', group, event)}><Trash2 />丢弃</button></div>
    </article>)}</div>
    {pendingDiscard && <DiscardCardConfirm cardKey={pendingDiscard.key} count={pendingDiscard.total} canDiscardAll={state.deck.length - pendingDiscard.active >= 10} onCancel={() => setPendingDiscard(null)} onConfirmOne={() => { dispatch({ type: 'loadout', operation: 'discard', key: pendingDiscard.key }); setPendingDiscard(null); }} onConfirmAll={() => { dispatch({ type: 'loadout', operation: 'discardGroup', key: pendingDiscard.key }); setPendingDiscard(null); }} />}
  </div>;
}

function LoadoutStation({ state, dispatch }) {
  return <Overlay background={PIXEL_BACKGROUNDS[state.stage]} eyebrow="牌组整备站" title="整理出战牌组" text="旅途中也可以调整出战与候补。新获得的技能默认进入候补。" variant="loadout-overlay">
    <CardLibraryPanel state={state} dispatch={dispatch} />
    <button className="memory-leave secondary" onClick={() => dispatch({ type: 'leaveLoadout' })}>完成整备，继续赶路</button>
  </Overlay>;
}

function NegativeStation({ state, dispatch }) {
  const loss = disorderGoldLoss(state.gold);
  return <Overlay background={PIXEL_BACKGROUNDS[state.stage]} eyebrow="低概率负面际遇" title="失序路段" text={`规则：失去当前旅币的 ${DISORDER_GOLD_LOSS_PERCENT}%，计算结果向上取整。不会扣除生命。`}>
    <div className="negative-event"><AlertTriangle /><strong>本次失去 {loss} 枚旅币</strong><span>当前持有 {state.gold} 枚，继续后剩余 {state.gold - loss} 枚。</span></div>
    <button className="confirm-danger mystery-enter" onClick={() => dispatch({ type: 'negative', choice: 'continue' })}>承担代价并继续</button>
  </Overlay>;
}

function Checkpoint({ state, dispatch }) {
  const checkpoint = CHECKPOINTS[state.mapRow + 1] || CHECKPOINTS[10];
  const checkpointIcons = { heart: Heart, sparkles: Sparkles, backpack: Backpack, coins: Coins, book: BookOpen, moon: Moon };
  return <Overlay background={PIXEL_BACKGROUNDS[state.stage]} eyebrow={`夜程 ${state.mapRow + 1} / ${MAP_STEPS}`} title={checkpoint.title} text={checkpoint.text}>
    <div className="camp-grid checkpoint-grid">
      {checkpoint.choices.map(choice => <CampChoice key={choice.key} icon={checkpointIcons[choice.icon]} title={choice.title} text={choice.text} onClick={() => dispatch({ type: 'checkpoint', choice: choice.key })} />)}
    </div>
  </Overlay>;
}

function CampChoice({ icon: Icon, title, text, onClick, disabled, lockSeconds = 0 }) {
  const [remaining, setRemaining] = useState(lockSeconds);
  useEffect(() => {
    setRemaining(lockSeconds);
    if (!lockSeconds) return undefined;
    const timer = window.setInterval(() => setRemaining(value => {
      if (value <= 1) {
        window.clearInterval(timer);
        return 0;
      }
      return value - 1;
    }), 1000);
    return () => window.clearInterval(timer);
  }, [lockSeconds]);
  const locked = remaining > 0;
  return <button className={`camp-choice ${locked ? 'is-counting' : ''}`} onClick={onClick} disabled={disabled || locked}><Icon /><span><strong>{title}</strong>{text && <small>{text}</small>}</span>{locked && <b className="choice-countdown">{remaining}秒</b>}</button>;
}

function Overlay({ background, eyebrow, title, text, children, variant = '' }) {
  return <main className={`overlay ${variant}`}><div className="overlay-art pixel-art" style={{ backgroundImage: `url(${background || chapter0})` }} /><div className="overlay-shade" /><section className="overlay-sheet"><span className="eyebrow">{eyebrow}</span><h2>{title}</h2><p>{text}</p>{children}</section></main>;
}

function battleReviewPlainText(state) {
  const enemy = enemyFor(state);
  const stats = equipmentStats(state);
  const encounterType = state.bossFight ? 'Boss' : state.elite ? '精英' : '普通';
  const statLine = Object.entries(stats)
    .filter(([, value]) => value)
    .map(([key, value]) => `${AFFIX_LABELS[key] || key} +${value}`)
    .join('，') || '无加成';
  const deckCounts = state.deck.reduce((counts, key) => counts.set(key, (counts.get(key) || 0) + 1), new Map());
  const deckLine = [...deckCounts].map(([key, count]) => {
    const resolved = card(key);
    return `${CARDS[resolved.baseKey].name} Lv.${resolved.rank}${count > 1 ? ` ×${count}` : ''}`;
  }).join('，');
  const specializationLines = (SPECIALIZATIONS[state.character] || []).map(route => {
    const talents = route.nodes
      .map(talent => ({ talent, rank: state.specializations?.[talent.id] || 0 }))
      .filter(entry => entry.rank > 0)
      .map(entry => `${entry.talent.name} Lv.${entry.rank}`);
    return talents.length ? `${route.name}：${talents.join('，')}` : null;
  }).filter(Boolean);
  const equipmentLines = Object.entries(state.equipment || {}).map(([slot, id]) => {
    const item = itemFor(state, id);
    if (!item) return `${SLOT_LABELS[slot] || slot}：未装备`;
    const effects = itemLines(item);
    return `${SLOT_LABELS[slot] || slot}：${itemName(item)}，Lv.${item.itemLevel || 1} ${item.rarity}${effects.length ? `，${effects.join('，')}` : ''}`;
  });
  const temporaryEffects = [
    state.pillowActive ? '软绒枕头开局护盾' : null,
    state.sideBattleFirstStrike ? `支线首次伤害 +${state.sideBattleFirstStrike}` : null,
  ].filter(Boolean);
  return [
    `Mistbound 战斗回顾（存档版本 ${VERSION}）`,
    `章节：第 ${state.stage + 1} 章 ${CHAPTERS[state.stage]?.name || ''}，地图第 ${Math.max(0, state.mapRow) + 1} 步`,
    `遭遇：${encounterType} · ${enemy.name}，结算时 ${state.enemy.hp}/${state.enemy.maxHp} 生命`,
    `难度：${DIFFICULTIES[state.difficulty]?.name || state.difficulty}，${state.battleMode === 'auto' ? '自动出牌' : '手动出牌'}`,
    `角色：${CHARACTERS[state.character]?.name || state.character} Lv.${state.level}，结算时 ${state.hp}/${state.maxHp} 生命，旅币 ${state.gold}`,
    `装备汇总：${statLine}`,
    `房车设施：暖灯厨房 Lv.${state.facilities?.kitchen || 0}，随车工坊 Lv.${state.facilities?.workshop || 0}，旅客房间 Lv.${state.facilities?.rooms || 0}`,
    `临时效果：${temporaryEffects.join('，') || '无'}`,
    '',
    '【装备】',
    ...equipmentLines,
    '',
    '【出战牌组】',
    deckLine || '无',
    '',
    '【专精】',
    ...(specializationLines.length ? specializationLines : ['未分配专精']),
    '',
    '【战斗日志】',
    ...(state.battleLog || []),
  ].join('\n');
}

function BattleReview({ state, onClose }) {
  const entries = state.battleLog || [];
  const enemyName = enemyFor(state).name;
  const [showCopyText, setShowCopyText] = useState(false);
  const copyField = useRef(null);
  const reviewText = useMemo(() => battleReviewPlainText(state), [state]);
  const selectCopyText = () => {
    copyField.current?.focus();
    copyField.current?.select();
    copyField.current?.setSelectionRange(0, reviewText.length);
  };
  useEffect(() => {
    if (showCopyText) selectCopyText();
  }, [showCopyText]);
  return <div className="battle-review-backdrop" onClick={onClose}><section className="battle-review" role="dialog" aria-modal="true" aria-labelledby="battle-review-title" onClick={event => event.stopPropagation()}>
    <header><div><span className="eyebrow">DREAM RECORD</span><h2 id="battle-review-title">战斗回顾</h2></div><div className="battle-review-actions"><button className="battle-review-copy" onClick={() => setShowCopyText(current => !current)}>{showCopyText ? <BookOpen /> : <Copy />}<span>{showCopyText ? '返回日志' : '复制回顾'}</span></button><button className="icon-button" onClick={onClose} aria-label="关闭战斗回顾"><X /></button></div></header>
    {showCopyText ? <div className="battle-review-manual-copy"><div><span>文本已全选，长按后选择“复制”。</span><button onClick={selectCopyText}><Copy />全选文本</button></div><textarea ref={copyField} value={reviewText} readOnly aria-label="可复制的完整战斗回顾" /></div> : <div className="battle-review-list">{entries.map((item, index) => <p className={item.startsWith('状态：') ? 'battle-status-line' : ''} key={`${item}-${index}`}><BattleLogLine text={item} enemyName={enemyName} /></p>)}</div>}
  </section></div>;
}

function Finale({ won, state, onEnd, onRevive, onReviveWithGold }) {
  const [reviewing, setReviewing] = useState(false);
  const sprite = enemySpriteProps(state);
  const cost = reviveCost(state);
  const canBuyRevive = state.gold >= cost;
  return <main className={`finale ${won ? 'won' : 'lost'}`}><div className="finale-art pixel-art" style={{ backgroundImage: `url(${PIXEL_BACKGROUNDS[state.stage]})` }} />{!won && <div className={`finale-enemy pixel-art ${sprite.className}`} style={sprite.style} />}<div className="scene-vignette" /><section><span className="finale-character pixel-art" style={characterStyle(state.character, 1.8)} /><span className="eyebrow">JOURNEY PAUSED · 旅途受挫</span><h1>挑战失败</h1><p>“{CHARACTER_LINES[state.character].defeat}”</p><small>生命归零后可以复活回到房车。普通复活会遗失当前身上已装备的全部装备；旅币买活会保留身上装备、背包、卡牌、等级和章节进度。</small><div className="revive-warning"><AlertTriangle /><span>普通复活：身上装备掉光，背包装备保留。买活费用：{cost} 旅币。</span></div><div className="run-stats"><span>等级 <b>{state.level}</b></span><span>旅币 <b>{state.gold}</b></span><span>回合 <b>{state.totalTurns}</b></span></div><div className="finale-actions"><button className="primary" disabled={!canBuyRevive} onClick={onReviveWithGold}><Coins size={18} />{canBuyRevive ? `${cost} 旅币买活` : `买活还差 ${cost - state.gold}`}</button><button className="secondary" onClick={onRevive}><Heart size={18} />掉装备复活</button><button className="secondary" onClick={() => setReviewing(true)}><BookOpen size={18} />回顾战斗</button><button className="secondary" onClick={onEnd}><X size={18} />结束本局</button></div></section>{reviewing && <BattleReview state={state} onClose={() => setReviewing(false)} />}</main>;
}

const SLOT_ICONS = { weapon: Swords, armor: Shirt, bag: Backpack, scarf: Wind, charm: Gem, decor: TentTree };
const COMPACT_STAT_LABELS = { attack: '伤害', block: '护盾', recovery: '恢复', firstStrike: '首攻', healing: '治疗', skillPower: '牌盾' };

function itemCoreStats(item) {
  return Object.entries(itemStats(item)).slice(0, 3).map(([key, value]) => `${COMPACT_STAT_LABELS[key] || AFFIX_LABELS[key]} +${value}`);
}

function gearAccent(baseKey) {
  const chapter = Math.max(0, CHAPTER_LOOT.findIndex(pool => pool.includes(baseKey)));
  return CHAPTERS[chapter].color;
}

function GearArt({ baseKey, slot, Icon, empty = false }) {
  const style = empty ? null : gearAtlasStyle(baseKey);
  return <span className={`gear-icon ${style ? 'gear-art pixel-art' : 'gear-empty'}`} style={{ ...(style || {}), '--gear-accent': empty ? '#8a938a' : gearAccent(baseKey) }}><i className="gear-category"><Icon /></i></span>;
}

function GearRow({ item, equipped, onOpen, isNew = false, readOnly = false }) {
  const base = ITEMS[item.base], Icon = SLOT_ICONS[base.slot];
  const grantedSkill = item.skill ? card(item.skill) : null;
  const Element = readOnly ? 'div' : 'button';
  return <Element className={`gear-card rarity-${item.rarity} ${equipped ? 'equipped' : ''}`} onClick={readOnly ? undefined : onOpen} title={readOnly ? undefined : `查看 ${itemName(item)} 详情`}>
    <GearArt baseKey={item.base} slot={base.slot} Icon={Icon} />
    <span className="gear-item-level">Lv.{item.itemLevel || 1} · {itemTier(item).name.replace('底材', '')}</span>
    <span className="gear-rarity">{item.rarity}</span>
    <strong>{itemName(item)}</strong>
    <span className="gear-core-stats">{itemCoreStats(item).map(line => <i key={line}>{line}</i>)}</span>
    {grantedSkill && <span className="gear-skill-label" aria-label={`自带技能：${grantedSkill.name}`}><Sparkles /><b>自带技能：{grantedSkill.name}</b></span>}
    {equipped && <span className="gear-equipped-badge" aria-label="已装备"><Check /></span>}
    {isNew && <span className="new-badge">NEW</span>}
  </Element>;
}

function AcquisitionModal({ entries, state, dispatch, onClose }) {
  const [decisions, setDecisions] = useState({});
  const [comparingGear, setComparingGear] = useState(null);
  const acquisitionKey = entries.map(entry => entry.kind === 'gear' ? `gear:${entry.item.id}` : `card:${entry.key}`).join('|');
  useEffect(() => {
    setDecisions({});
    setComparingGear(null);
  }, [acquisitionKey]);
  if (!entries.length) return null;
  const cards = entries.filter(entry => entry.kind === 'card');
  const gears = entries.filter(entry => entry.kind === 'gear');
  const single = entries.length === 1 ? entries[0] : null;
  const title = single?.kind === 'card' ? '新的回忆回应了你' : single?.kind === 'gear' ? '一件旧物选择了你' : '夜路带回新的收获';
  const cardIds = new Map();
  const idFor = entry => {
    if (entry.kind === 'gear') return `gear:${entry.item.id}`;
    const count = cardIds.get(entry.key) || 0;
    cardIds.set(entry.key, count + 1);
    return `card:${entry.key}:${count}`;
  };
  const renderedEntries = entries.map(entry => ({ entry, id: idFor(entry) }));
  const pending = renderedEntries.filter(({ id }) => !decisions[id]).length;
  const decide = (id, choice) => setDecisions(current => ({ ...current, [id]: choice }));
  const comparisonItem = comparingGear ? itemFor(state, comparingGear.item.id) : null;
  return createPortal(<div className="acquisition-backdrop" role="presentation">
    <section className={`acquisition-modal ${single ? 'is-single' : 'is-group'}`} role="dialog" aria-modal="true" aria-labelledby="acquisition-title">
      <div className="acquisition-radiance" aria-hidden="true"><i /><i /><i /><i /><i /><i /></div>
      <span className="eyebrow">JOURNEY KEEPSAKE · 旅途收获</span>
      <h2 id="acquisition-title">{title}</h2>
      <p>{single?.kind === 'card' ? '技能已收入候补，现在可以决定是否加入出战牌组。' : single?.directEquipChoice ? '购买前已经完成比较，现在可以决定是否直接换上。' : single?.kind === 'gear' ? '装备已放入背包，可以比较后决定是否换上。' : `共获得 ${entries.length} 件物品，请分别决定是否立即装备。`}</p>
      <div className="acquisition-risk"><AlertTriangle /><span><strong>非路标返回可能丢失</strong><small>暂不装备的技能或装备仍会留在收获中，但匆忙返回房车时可能随机遗失。</small></span></div>
      {cards.length > 0 && <div className="acquisition-cards">{renderedEntries.filter(({ entry }) => entry.kind === 'card').map(({ entry, id }, index) => <div className="acquisition-card" key={id} style={{ '--reveal-delay': `${index * 90}ms` }}><CardView cardKey={entry.key} compact /><strong>{card(entry.key).name}</strong><small>技能 · Lv.{cardRank(entry.key)}</small><div className="acquisition-item-actions"><button className={decisions[id] === 'equip' ? 'selected' : ''} onClick={() => { dispatch({ type: 'equipAcquired', kind: 'card', key: entry.key }); decide(id, 'equip'); }}><Check />加入出战</button><button className={decisions[id] === 'skip' ? 'selected risk' : 'risk'} onClick={() => decide(id, 'skip')}><X />暂不加入</button></div></div>)}</div>}
      {gears.length > 0 && <div className="acquisition-gears">{renderedEntries.filter(({ entry }) => entry.kind === 'gear').map(({ entry, id }, index) => <div className="acquisition-gear" key={id} style={{ '--reveal-delay': `${(cards.length + index) * 90}ms` }}>{entry.directEquipChoice ? <><GearRow item={entry.item} isNew readOnly /><small>{entry.item.rarity}装备 · 已放入背包</small><div className="acquisition-item-actions"><button className={decisions[id] === 'equip' ? 'selected' : ''} onClick={() => { dispatch({ type: 'equipAcquired', kind: 'gear', key: entry.item.id }); decide(id, 'equip'); }}><Check />装备</button><button className={decisions[id] === 'skip' ? 'selected risk' : 'risk'} onClick={() => decide(id, 'skip')}><X />暂不装备</button></div></> : <><GearRow item={entry.item} isNew onOpen={() => setComparingGear({ item: entry.item, id })} /><small>{entry.item.rarity}装备 · 已放入背包</small><div className="acquisition-item-actions"><button className={decisions[id] === 'equip' ? 'selected' : ''} onClick={() => setComparingGear({ item: entry.item, id })}><Scale />比较并装备</button><button className={decisions[id] === 'skip' ? 'selected risk' : 'risk'} onClick={() => decide(id, 'skip')}><X />暂不装备</button></div></>}</div>)}</div>}
      <button className="primary acquisition-accept" disabled={pending > 0} onClick={onClose}><Check />{pending > 0 ? `还有 ${pending} 项未选择` : '完成'}</button>
      {comparisonItem && <GearDetail state={state} item={comparisonItem} disabled={false} onClose={() => setComparingGear(null)} onEquip={() => { dispatch({ type: 'equipAcquired', kind: 'gear', key: comparisonItem.id }); decide(comparingGear.id, 'equip'); setComparingGear(null); }} />}
    </section>
  </div>, document.body);
}

function EquippedSlot({ item, slot, label, active, onOpen }) {
  if (item) return <GearRow item={item} equipped onOpen={onOpen} />;
  const Icon = SLOT_ICONS[slot];
  return <button className={`equipment-slot ${active ? 'active' : ''}`} onClick={onOpen}>
    <GearArt baseKey={slot} slot={slot} Icon={Icon} empty />
    <small>{label}</small><strong>未装备</strong><em>点击选择装备</em>
  </button>;
}

function GearDetail({ state, item, disabled, hideAction = false, onEquip, onClose }) {
  const base = ITEMS[item.base], Icon = SLOT_ICONS[base.slot];
  const equipped = state.equipment[base.slot] === item.id;
  const current = itemFor(state, state.equipment[base.slot]);
  const difference = itemScore(item) - itemScore(current);
  const candidateStats = itemStats(item);
  const currentStats = itemStats(current);
  const comparisonKeys = [...new Set([...Object.keys(currentStats), ...Object.keys(candidateStats)])];
  const skill = item.skill ? card(rankedCardKey(item.skill, item.skillLevel || 1, true)) : null;
  const currentSkill = current?.skill ? card(rankedCardKey(current.skill, current.skillLevel || 1, true)) : null;
  return createPortal(<div className="gear-detail-backdrop" onClick={onClose}>
    <section className={`gear-detail rarity-${item.rarity}`} onClick={event => event.stopPropagation()}>
      <button className="icon-button gear-detail-close" onClick={onClose} aria-label="关闭装备详情"><X /></button>
      <header><GearArt baseKey={item.base} slot={base.slot} Icon={Icon} /><span><small>{item.rarity} · {itemTier(item).name} · 物品等级 {item.itemLevel || 1}</small><h3>{itemName(item)}</h3><em>{base.flavor}</em></span></header>
      {!equipped && current && <div className="gear-detail-compare">
        <div className="gear-compare-heading"><span><small>当前装备</small><strong>{itemName(current)}</strong></span><span><small>候选装备</small><strong>{itemName(item)}</strong></span></div>
        <div className="gear-compare-table">{comparisonKeys.map(key => {
          const before = currentStats[key] || 0;
          const after = candidateStats[key] || 0;
          const delta = after - before;
          return <div className="gear-compare-row" key={key}><span>{AFFIX_LABELS[key]}</span><b>{before}</b><i aria-hidden="true">→</i><b>{after}</b><em className={delta > 0 ? 'better' : delta < 0 ? 'worse' : 'same'}>{delta > 0 ? `+${delta}` : delta}</em></div>;
        })}</div>
        <div className="gear-compare-skills"><GearSkillComparison label="当前技能" skill={currentSkill} /><GearSkillComparison label="候选技能" skill={skill} /></div>
      </div>}
      <div className="gear-detail-score"><span>装备评分 <b>{itemScore(item)}</b></span>{!equipped && current && <span className={difference >= 0 ? 'better' : 'worse'}>{difference >= 0 ? `比当前高 ${difference}` : `比当前低 ${Math.abs(difference)}`}</span>}</div>
      <div className="gear-detail-lines"><small>完整词条</small>{itemDetailLines(item).map(line => <p key={line}>{line}</p>)}</div>
      {skill && <div className="gear-detail-skill"><span className="gear-detail-skill-art pixel-art" style={cardAtlasStyle(item.skill)} /><span><small>装备自带技能 · Lv.{skill.rank}</small><strong>{skill.name}</strong><p>消耗 {skill.cost} 点行动力 · {description(skill.key).join(' · ')}</p></span></div>}
      {!hideAction && <button className="gear-detail-action" disabled={disabled || equipped} onClick={onEquip}>{equipped ? <><Check />已装备</> : disabled ? '战斗中不能更换装备' : `装备到「${SLOT_LABELS[base.slot]}」`}</button>}
    </section>
  </div>, document.body);
}

function GearSkillComparison({ label, skill }) {
  return <span className={skill ? '' : 'empty'}><small>{label}</small>{skill ? <><strong>{skill.name} · Lv.{skill.rank}</strong><p>{description(skill.key).join(' · ')}</p></> : <strong>无自带技能</strong>}</span>;
}

function upgradedItemPreview(item) {
  if (!item || itemUpgradeCost(item) === null) return null;
  const itemLevel = item.itemLevel < 21 ? 21 : 41;
  const affixCount = item.affixes?.length || 0;
  return { ...item, itemLevel, skillLevel: item.skill ? Math.min(10, 1 + Math.floor((itemLevel - 1) / 12) + (affixCount >= 3 ? 1 : 0)) : 0 };
}

function GearStatComparison({ beforeItem, afterItem }) {
  const beforeStats = itemStats(beforeItem);
  const afterStats = itemStats(afterItem);
  const keys = [...new Set([...Object.keys(beforeStats), ...Object.keys(afterStats)])];
  return <div className="gear-compare-table">{keys.map(key => {
    const before = beforeStats[key] || 0;
    const after = afterStats[key] || 0;
    const delta = after - before;
    return <div className="gear-compare-row" key={key}><span>{AFFIX_LABELS[key]}</span><b>{before}</b><i aria-hidden="true">→</i><b>{after}</b><em className={delta > 0 ? 'better' : delta < 0 ? 'worse' : 'same'}>{delta > 0 ? `+${delta}` : delta}</em></div>;
  })}</div>;
}

function UpgradeItemConfirm({ state, item, onCancel, onConfirm }) {
  const cost = itemUpgradeCost(item);
  const preview = upgradedItemPreview(item);
  if (!item || cost === null || !preview) return null;
  const beforeSkill = item.skill ? card(rankedCardKey(item.skill, item.skillLevel || 1, true)) : null;
  const afterSkill = preview.skill ? card(rankedCardKey(preview.skill, preview.skillLevel || 1, true)) : null;
  return <div className="confirm-backdrop" onClick={onCancel}>
    <section className="confirm-dialog upgrade-item-confirm" role="alertdialog" aria-modal="true" aria-labelledby="upgrade-item-title" onClick={event => event.stopPropagation()}>
      <span className="confirm-icon"><TrendingUp /></span><small>升阶底材</small>
      <h2 id="upgrade-item-title">升级「{itemName(item)}」？</h2>
      <p>花费 {cost} 旅币，将物品等级提升到 Lv.{preview.itemLevel}。随机词条会随新底材刷新，下面为升阶后的属性预览。</p>
      <div className="upgrade-item-cards">
        <GearRow item={item} equipped={Object.values(state.equipment).includes(item.id)} readOnly />
        <GearRow item={preview} equipped={Object.values(state.equipment).includes(item.id)} readOnly />
      </div>
      <div className="gear-detail-compare upgrade-item-compare">
        <div className="gear-compare-heading"><span><small>升级前</small><strong>{itemTier(item).name} · Lv.{item.itemLevel || 1}</strong></span><span><small>升级后</small><strong>{itemTier(preview).name} · Lv.{preview.itemLevel}</strong></span></div>
        <GearStatComparison beforeItem={item} afterItem={preview} />
        <div className="gear-compare-skills"><GearSkillComparison label="当前技能" skill={beforeSkill} /><GearSkillComparison label="升阶后技能" skill={afterSkill} /></div>
      </div>
      <div className="confirm-actions"><button className="secondary" onClick={onCancel}>取消</button><button className="primary" disabled={state.gold < cost} onClick={onConfirm}>{state.gold < cost ? `还差 ${cost - state.gold} 旅币` : `确认升阶 ${cost} 旅币`}</button></div>
    </section>
  </div>;
}

function WorkshopRow({ state, item, dispatch, onOpen, onUpgrade }) {
  const equipped = Object.values(state.equipment).includes(item.id);
  const cost = rerollCost(item, state.facilities.workshop), value = salvageValue(item), upgradeCost = itemUpgradeCost(item);
  return <article className="workshop-card">
    <GearRow item={item} equipped={equipped} onOpen={onOpen} isNew={state.journeyNewItems?.includes(item.id)} />
    <div className="workshop-card-actions"><button disabled={!item.affixes.length || state.gold < cost} onClick={() => dispatch({ type: 'reroll', key: item.id })}><Wrench />重抽属性<small>{cost} 旅币</small></button><button disabled={upgradeCost === null || state.gold < upgradeCost} onClick={() => onUpgrade(item.id)}><TrendingUp />升阶底材<small>{upgradeCost === null ? '已是精英' : `${upgradeCost} 旅币`}</small></button><button disabled={equipped} onClick={() => dispatch({ type: 'salvage', key: item.id })}><PackageOpen />拆解装备<small>获得 {value} 旅币</small></button></div>
  </article>;
}

const FACILITY_META = [
  { key: 'kitchen', name: '暖灯厨房', icon: Flame, effect: level => `战后额外恢复 ${level * 2} 点生命` },
  { key: 'workshop', name: '随车工坊', icon: Wrench, effect: level => `重抽费用降低 ${level * 12}%` },
  { key: 'rooms', name: '旅客房间', icon: House, effect: level => `永久增加 ${level * 6} 点生命上限` },
];

function FacilityUpgrades({ state, dispatch }) {
  return <section className="facility-upgrades"><div className="facility-heading"><House /><span><strong>改造房车</strong><small>设施最高 3 级，效果永久保留。</small></span></div>
    <div className="facility-grid">{FACILITY_META.map(meta => {
      const level = state.facilities[meta.key], cost = facilityCost(level), Icon = meta.icon;
      return <article key={meta.key}><Icon /><span><small>LV.{level} / 3</small><strong>{meta.name}</strong><em>{meta.effect(level)}</em></span><button disabled={cost === null || state.gold < cost} onClick={() => dispatch({ type: 'upgradeFacility', key: meta.key })}>{cost === null ? <><Check />已完成</> : <><Wrench />升级设施<small><Coins />{cost} 旅币</small></>}</button></article>;
    })}</div>
  </section>;
}

function GuestRooms({ state, dispatch }) {
  return <div className="guest-rooms"><header><House /><span><strong>今晚的住客</strong><small>每次完成对应地区的梦境，都会推进一段入住故事。</small></span></header>
    {GUESTS.map((guest, index) => {
      const locked = index > state.unlocked;
      const progress = Math.min(3, state.clears[index]);
      const claimed = state.guestRewards[index];
      const guestName = index === GUESTS.length - 1 && state.namelessClues?.includes('registeredName') ? '朝安' : guest.name;
      const story = locked ? '完成上一站后，这间客房才会亮灯。' : (progress ? guest.chapters[progress - 1] : guest.wish);
      const rewardLabel = claimed ? '已领取' : progress < 3 ? `通关「${CHAPTERS[index].name}」${3 - progress} 次后领取` : `领取「${guest.gift}」`;
      return <article key={guest.name} className={locked ? 'locked' : ''}>
        <div className="guest-number">{locked ? <Lock /> : String(index + 1).padStart(2, '0')}</div>
        <div className="guest-copy"><small>{guest.room} · {CHAPTERS[index].name}</small><strong>{locked ? '尚未入住' : guestName}</strong><p>{story}</p><div className="story-progress">{[1, 2, 3].map(step => <i key={step} className={step <= progress ? 'active' : ''} />)}</div></div>
        {!locked && <button disabled={progress < 3 || claimed} onClick={() => dispatch({ type: 'claimGuestReward', stage: index })}>{claimed ? <Check /> : progress >= 3 ? <Gem /> : null}{rewardLabel}</button>}
      </article>;
    })}
  </div>;
}

const COMMISSION_META = [
  { key: 'battles', title: '赢得战斗', icon: Moon, unit: '场战斗', hint: remaining => `再赢 ${remaining} 场战斗可领取旅币` },
  { key: 'steps', title: '途经步数', icon: MapPin, unit: '步', hint: remaining => `再途经 ${remaining} 步可领取旅币` },
  { key: 'stories', title: '通关章节', icon: House, unit: '次通关', hint: remaining => `再击败 ${remaining} 次章节首领可领取旅币` },
];

function CommissionBoard({ state, dispatch }) {
  return <section className="commission-board"><header><BookOpen /><span><strong>旅程委托</strong><small>按目标游玩，完成后回来领取旅币。</small></span></header>
    {COMMISSION_META.map(meta => {
      const task = commissionStatus(state, meta.key), Icon = meta.icon, complete = task.value >= task.target;
      const current = Math.min(task.value, task.target);
      const remaining = Math.max(0, task.target - task.value);
      return <article key={meta.key}><Icon /><span><strong>{meta.title}</strong><small>{current} / {task.target} {meta.unit} · {complete ? '已完成，回来领取旅币' : meta.hint(remaining)}</small><Bar value={task.value} max={task.target} tone="xp" /></span><button disabled={!complete} onClick={() => dispatch({ type: 'claimCommission', key: meta.key })}>{complete ? `领取 ${task.reward} 旅币` : `奖励 ${task.reward} 旅币`}</button></article>;
    })}
  </section>;
}

function SpecializationPanel({ state, dispatch }) {
  const routes = SPECIALIZATIONS[state.character] || [];
  const [routeIndex, setRouteIndex] = useState(0);
  const [draft, setDraft] = useState(() => ({ ...(state.specializations || {}) }));
  const [confirming, setConfirming] = useState(false);
  const [resetting, setResetting] = useState(false);
  useEffect(() => setDraft({ ...(state.specializations || {}) }), [state.specializations]);
  const committed = specializationSpent(state);
  const draftSpent = Object.values(draft).reduce((sum, rank) => sum + rank, 0);
  const pending = draftSpent - committed;
  const available = Math.max(0, specializationPointTotal(state) - draftSpent);
  const route = routes[routeIndex];
  const draftState = { ...state, specializations: draft };
  const invest = talent => {
    if (!canInvestSpecialization(draftState, draft, talent.id)) return;
    setDraft(current => ({ ...current, [talent.id]: (current[talent.id] || 0) + 1 }));
  };
  const discardDraft = () => setDraft({ ...(state.specializations || {}) });
  return <section className="specialization-panel">
    <header className="specialization-heading"><Sparkles /><span><strong>角色专精</strong><small>专精点主要通过升级获得；选择会永久记录，只有空白书签可以重置。</small></span><b>{available}<small>可用点数</small></b></header>
    <div className="specialization-summary"><span>已投入 <b>{draftSpent}</b> / {MAX_SPECIALIZATION_POINTS}</span><span>等级点数 {Math.min(MAX_SPECIALIZATION_POINTS, state.level)}</span>{state.specializationBonusPoints > 0 && <span>剧情奖励 +{state.specializationBonusPoints}</span>}</div>
    <nav className="specialization-routes">{routes.map((entry, index) => <button key={entry.name} className={routeIndex === index ? 'active' : ''} style={{ '--route-color': entry.color }} onClick={() => setRouteIndex(index)}><strong>{entry.name}</strong><small>{entry.nodes.reduce((sum, talent) => sum + (draft[talent.id] || 0), 0)} / {entry.nodes.reduce((sum, talent) => sum + talent.maxRank, 0)}</small></button>)}</nav>
    {route && <><div className="specialization-route-copy" style={{ '--route-color': route.color }}><strong>{CHARACTERS[state.character].name} · {route.name}</strong><p>{route.summary}</p></div>
      <div className="specialization-tree">{route.nodes.map((talent, index) => {
        const rank = draft[talent.id] || 0;
        const canInvest = canInvestSpecialization(draftState, draft, talent.id);
        return <button key={talent.id} className={`${rank > 0 ? 'invested' : ''} ${talent.maxRank === 1 ? 'keystone' : ''}`} style={{ '--route-color': route.color }} disabled={!canInvest} onClick={() => invest(talent)}>
          <span className="specialization-node-rank">{rank}/{talent.maxRank}</span><span><strong>{talent.name}</strong><small>{specializationNodeText(talent, rank)}</small>{rank === 0 && talent.requires > 0 && <em>本路线投入 {talent.requires} 点后解锁</em>}</span>{index < route.nodes.length - 1 && <i aria-hidden="true" />}
        </button>;
      })}</div></>}
    <div className="specialization-actions"><button className="secondary" disabled={!pending} onClick={discardDraft}>撤销未确认</button><button className="primary" disabled={!pending} onClick={() => setConfirming(true)}>确认投入 {pending || 0} 点</button></div>
    <div className="specialization-reset"><span><BookOpen /><small>空白书签</small><strong>{state.specializationResetTokens || 0} 枚</strong></span><button disabled={!state.specializationResetTokens || !committed} onClick={() => setResetting(true)}>重置全部专精</button></div>
    {confirming && <div className="confirm-backdrop" onClick={() => setConfirming(false)}><section className="confirm-dialog specialization-confirm" role="alertdialog" aria-modal="true" onClick={event => event.stopPropagation()}><span className="confirm-icon"><Sparkles /></span><small>写入梦册</small><h2>确认投入 {pending} 点？</h2><p>确认后不能普通撤销，只能消耗支线任务获得的空白书签重置全部专精。</p><div className="confirm-actions"><button className="secondary" onClick={() => setConfirming(false)}>再想想</button><button className="primary" onClick={() => { dispatch({ type: 'specialize', allocations: draft }); setConfirming(false); }}>确认加点</button></div></section></div>}
    {resetting && <div className="confirm-backdrop" onClick={() => setResetting(false)}><section className="confirm-dialog specialization-confirm" role="alertdialog" aria-modal="true" onClick={event => event.stopPropagation()}><span className="confirm-icon"><BookOpen /></span><small>使用空白书签</small><h2>重置全部专精？</h2><p>已投入的 {committed} 点会全部返还，空白书签将永久消耗。</p><div className="confirm-actions"><button className="secondary" onClick={() => setResetting(false)}>保留专精</button><button className="confirm-danger" onClick={() => { dispatch({ type: 'resetSpecialization' }); setResetting(false); }}>确认重置</button></div></section></div>}
  </section>;
}

const DRAWER_TUTORIAL_KEY = 'mistbound-drawer-tutorials';
const DRAWER_TUTORIALS = {
  character: { title: '装备与替换', text: '点击任一装备槽位，会展开同类装备列表。列表中的卡牌点击后会直接替换当前装备。' },
  bag: { title: '快速比较装备', text: '卡面只保留名称和核心数值。点击卡牌可查看完整词条、技能，以及与当前装备的详细对比。' },
  deck: { title: '查看当前卡组', text: '这里显示本局已经获得的全部技能卡。装备自带技能会在进入战斗时额外加入牌堆。' },
  specialization: { title: '写下成长方向', text: '角色每级获得 1 点专精点，剧情也会留下少量奖励。确认后的选择只能通过特殊支线获得的空白书签重置。' },
  workshop: { title: '重抽与拆解', text: '重抽属性会保留装备和自带技能，只刷新随机词条；拆解会永久销毁装备并返还旅币。' },
  guests: { title: '客人与旅程委托', text: '完成委托可以领取旅币；反复探索对应地区，会推进住客故事并解锁专属纪念品。' },
};

function readDrawerTutorials() {
  try { return JSON.parse(localStorage.getItem(DRAWER_TUTORIAL_KEY) || '{}'); } catch { return {}; }
}

const BULK_SELL_RARITIES = ['普通', '精良', '稀有', '传奇'];

function BulkSellDialog({ state, dispatch, onClose }) {
  const [rarities, setRarities] = useState(['普通']);
  const [includeSkills, setIncludeSkills] = useState(false);
  const equipped = new Set(Object.values(state.equipment).filter(Boolean));
  const candidates = state.inventory.filter(item => !equipped.has(item.id) && rarities.includes(item.rarity) && (includeSkills || !item.skill));
  const total = candidates.reduce((sum, item) => sum + salvageValue(item), 0);
  const toggleRarity = rarity => setRarities(current => current.includes(rarity) ? current.filter(item => item !== rarity) : [...current, rarity]);
  return createPortal(<div className="confirm-backdrop" onClick={onClose}>
    <section className="confirm-dialog bulk-sell-dialog" role="alertdialog" aria-modal="true" aria-labelledby="bulk-sell-title" onClick={event => event.stopPropagation()}>
      <span className="confirm-icon"><Coins /></span><small>批量整理背包</small><h2 id="bulk-sell-title">一键售卖装备</h2>
      <p>只会售卖符合条件且未穿戴的装备。已穿戴装备始终保留。</p>
      <fieldset className="bulk-sell-rarities"><legend>选择品质</legend><div>{BULK_SELL_RARITIES.map(rarity => <button type="button" key={rarity} className={`${rarities.includes(rarity) ? 'selected' : ''} rarity-${rarity}`} onClick={() => toggleRarity(rarity)}><i />{rarity}</button>)}</div></fieldset>
      <label className="bulk-sell-skill-toggle"><input type="checkbox" checked={includeSkills} onChange={event => setIncludeSkills(event.target.checked)} /><span><strong>包含带技能装备</strong><small>{includeSkills ? '符合品质的装备无论是否带技能都会售卖' : '带有技能的装备不会售卖'}</small></span></label>
      <div className="bulk-sell-summary"><span>待售 <b>{candidates.length}</b> 件</span><span>获得 <b>{total}</b> 旅币</span></div>
      <div className="confirm-actions"><button className="secondary" onClick={onClose}>取消</button><button className="confirm-danger" disabled={!candidates.length} onClick={() => { dispatch({ type: 'bulkSalvage', ids: candidates.map(item => item.id) }); onClose(); }}><Coins />确认售卖</button></div>
    </section>
  </div>, document.body);
}

function DebugPanel({ state, dispatch, onClose, onLaunch }) {
  const [stage, setStage] = useState(state.stage);
  const [row, setRow] = useState(-1);
  const [base, setBase] = useState(CHAPTER_LOOT[state.stage]?.[0] || Object.keys(ITEMS)[0]);
  const [skill, setSkill] = useState(CARD_KEYS[0]);
  const [itemLevel, setItemLevel] = useState(Math.min(60, state.stage * 10 + 1));
  const [skillLevel, setSkillLevel] = useState(1);
  const [sideStoryId, setSideStoryId] = useState(Object.keys(SIDE_STORIES).find(id => SIDE_STORIES[id].chapters?.includes(state.stage)) || Object.keys(SIDE_STORIES)[0]);
  const hasSidePromise = (state.sidePromises?.length || 0) > 0;
  const act = (operation, extra = {}) => dispatch({ type: 'debug', operation, ...extra });
  return createPortal(<div className="debug-backdrop" data-cheat-panel="true" onClick={onClose}>
    <section className="debug-panel" role="dialog" aria-modal="true" aria-labelledby="debug-panel-title" onClick={event => event.stopPropagation()}>
      <header><span><small>仅供开发测试</small><h2 id="debug-panel-title"><FlaskConical />测试面板</h2></span><button onClick={onClose}>关闭</button></header>
      <div className="debug-status"><span>Lv.{state.level}</span><span>{state.gold} 旅币</span><span>{state.hp}/{state.maxHp} 生命</span><span>背包 {state.inventory.length}</span></div>
      <section className="debug-section">
        <h3>跳转进度</h3>
        <div className="debug-fields">
          <label>章节<GameSelect ariaLabel="选择章节" value={stage} onChange={value => { const next = Number(value); setStage(next); setBase(CHAPTER_LOOT[next][0]); setItemLevel(Math.min(60, next * 10 + 1)); }} options={CHAPTERS.map((chapter, index) => ({ value: index, label: `${index + 1}. ${chapter.name}` }))} /></label>
          <label>位置<GameSelect ariaLabel="选择章节位置" value={row} onChange={value => setRow(Number(value))} options={[{ value: -1, label: '章节起点' }, { value: 9, label: '第 10 步路标' }, { value: 19, label: '第 20 步路标' }, { value: 29, label: '第 30 步路标' }, { value: 39, label: '第 40 步路标' }, { value: 48, label: '首领前' }]} /></label>
        </div>
        <button className="debug-primary" onClick={() => act('jump', { stage, row })}>跳转到所选位置</button>
      </section>
      <section className="debug-section">
        <h3>角色与资源</h3>
        <div className="debug-buttons"><button onClick={() => act('gold')}>旅币 +1000</button><button onClick={() => act('level')}>等级 +1</button><button onClick={() => act('heal')}>恢复全部状态</button><button onClick={() => act('unlockWorkshop')}>解锁工坊</button><button onClick={() => act('unlockGuests')}>解锁客人</button><button onClick={() => act('unlock')}>解锁全部章节</button></div>
      </section>
      <section className="debug-section">
        <h3>装备与技能</h3>
        <div className="debug-fields"><label>装备<GameSelect ariaLabel="选择测试装备" value={base} onChange={setBase} options={Object.entries(ITEMS).map(([key, item]) => ({ value: key, label: `${Number.isInteger(item.chapter) ? `第 ${item.chapter + 1} 章` : '基础装备'} · ${item.name}` }))} /></label><label>物品等级<input type="number" min="1" max="60" value={itemLevel} onChange={event => setItemLevel(Math.max(1, Math.min(60, Number(event.target.value) || 1)))} /></label></div>
        <div className="debug-buttons debug-item-actions"><button className="debug-primary" onClick={() => act('item', { base, itemLevel })}>添加随机装备</button><button className="debug-legendary" onClick={() => act('legendaryItem', { base, itemLevel })}>添加传奇满词条装备</button></div>
        <div className="debug-fields"><label>技能<GameSelect ariaLabel="选择测试技能" value={skill} onChange={setSkill} options={CARD_KEYS.map(key => ({ value: key, label: card(key).name }))} /></label><label>技能等级<input type="number" min="1" max="10" value={skillLevel} onChange={event => setSkillLevel(Math.max(1, Math.min(10, Number(event.target.value) || 1)))} /></label></div>
        <div className="debug-buttons"><button onClick={() => act('card', { key: skill, rank: skillLevel })}>添加/提升至 Lv.{skillLevel}</button><button onClick={() => act('upgradeCards')}>全部技能 +1</button></div>
      </section>
      <section className="debug-section">
        <h3>主线剧情</h3>
        <div className="debug-buttons"><button onClick={() => { act('mainStory', { stage, beat: 'intro' }); onLaunch(); }}>章节开场</button><button onClick={() => { act('mainStory', { stage, beat: 'boss' }); onLaunch(); }}>首领战前</button><button onClick={() => { act('mainStory', { stage, beat: 'ending' }); onLaunch(); }}>章节结尾</button><button onClick={() => act('mainClues')}>补齐终章线索</button></div>
        <small className="debug-side-status">使用上方“跳转进度”选择的章节 · 已读主线 {state.mainStorySeen?.length || 0} / {MAIN_STORY.length * 3}</small>
      </section>
      <section className="debug-section">
        <h3>魔法屋直达</h3>
        <div className="debug-buttons">{MYSTERY_STATIONS.map(station => <button key={station.type} onClick={() => { act('magicHouse', { result: station.type }); onLaunch(); }}>{station.label}</button>)}</div>
      </section>
      <section className="debug-section">
        <h3>支线事件</h3>
        <label>指定支线<GameSelect ariaLabel="选择测试支线" value={sideStoryId} onChange={setSideStoryId} options={Object.entries(SIDE_STORIES).map(([id, story]) => ({ value: id, label: `第 ${(story.chapters?.[0] ?? 0) + 1} 章 · ${story.name}` }))} /></label>
        <button className="debug-primary" onClick={() => { act('sideStory', { id: sideStoryId }); onLaunch(); }}>立即进入所选支线</button>
        <div className="debug-buttons"><button onClick={() => act('sideSteps')}>承诺步数 +10</button><button onClick={() => act('sideBattles')}>承诺胜场 +2</button><button onClick={() => { act('sideCritical'); onLaunch(); }}>完成关键委托</button><button disabled={!hasSidePromise} title={hasSidePromise ? '打开首个等待中的支线兑现界面' : '当前选择已即时结算，没有延迟奖励'} onClick={() => { act('sideExchange'); onLaunch(); }}>{hasSidePromise ? '兑现支线奖励' : '暂无待兑现奖励'}</button><button onClick={() => act('sideClear')}>清理支线状态</button></div>
        <small className="debug-side-status">当前承诺 {state.sidePromises?.length || 0} 条 · 待触发 {state.sideStoryQueue?.length || 0} 条 · 已见支线 {state.sideStorySeen?.length || 0} 条 · 关键委托 {Object.values(state.criticalSideQuests || {}).filter(quest => quest.status !== 'locked' && quest.status !== 'complete').length} 条{!hasSidePromise ? ' · 即时分支已在选择时结算' : ''}</small>
      </section>
      <p className="debug-warning">测试操作会立即写入当前档案。正式体验前请回到标题页，在档案列表中删除测试档案。</p>
    </section>
  </div>, document.body);
}

function Drawer({ state, dispatch, onClose, onTitle, initialTab = 'character' }) {
  const { show } = React.useContext(TooltipContext);
  const { workshop: workshopUnlocked, guests: guestsUnlocked } = featureUnlocks(state);
  const specializationOpen = specializationUnlocked(state);
  const visibleInitialTab = (initialTab === 'workshop' && !workshopUnlocked) || (initialTab === 'guests' && !guestsUnlocked) || (initialTab === 'specialization' && !specializationOpen) ? 'character' : initialTab;
  const [tab, setTab] = useState(visibleInitialTab);
  const [selectedGear, setSelectedGear] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [upgradingGear, setUpgradingGear] = useState(null);
  const [bulkSelling, setBulkSelling] = useState(false);
  const [debugOpen, setDebugOpen] = useState(false);
  const [seenTutorials, setSeenTutorials] = useState(readDrawerTutorials);
  const [tutorialTab, setTutorialTab] = useState(() => readDrawerTutorials()[initialTab] ? null : initialTab);
  const stats = equipmentStats(state);
  const availableSpecializationPoints = specializationAvailablePoints(state);
  const specializationNew = specializationOpen && !state.specializationSeen;
  const tabNewBadge = () => <em className="drawer-new-badge">NEW</em>;
  const openTab = (next, event) => {
    if (state.phase !== 'hub' && ['workshop', 'guests'].includes(next)) {
      show(next === 'workshop' ? '房车工坊只能在返回房车后使用。' : '客人奖励只能在返回房车后查看和领取。', event);
      return;
    }
    if (state.phase === 'hub' && ['bag', 'workshop', 'guests'].includes(next)) dispatch({ type: 'viewFeature', key: next });
    if (state.phase === 'hub' && next === 'specialization') dispatch({ type: 'viewSpecialization' });
    if (['character', 'bag'].includes(next)) dispatch({ type: 'viewItemLibrary' });
    if (next === 'deck') dispatch({ type: 'viewCardLibrary' });
    setTab(next); setSelectedSlot(null);
    if (!seenTutorials[next]) setTutorialTab(next);
  };
  const finishTutorial = () => {
    const next = { ...seenTutorials, [tutorialTab]: true };
    setSeenTutorials(next); localStorage.setItem(DRAWER_TUTORIAL_KEY, JSON.stringify(next)); setTutorialTab(null);
  };
  return <div className="drawer-backdrop" onClick={onClose}><aside className="drawer" onClick={e => e.stopPropagation()}>
    <div className="drawer-controls"><span className="drawer-gold"><Coins />{state.gold}</span><MusicToggle compact /><button className="drawer-close" onClick={onClose}>关闭行囊</button></div><span className="eyebrow">旅行屋档案</span><h2>店主与行囊</h2>
    <div className="level-card">{CHEATS_ENABLED ? <button className="debug-trigger" onClick={() => setDebugOpen(true)} aria-label="打开测试面板">LV</button> : <span className="debug-trigger">LV</span>}<strong>{state.level}</strong><div><b>{CHARACTERS[state.character].name} · {CHARACTERS[state.character].role}</b><small>{state.xp} / {state.nextXp} XP</small><Bar value={state.xp} max={state.nextXp} tone="xp" /></div></div>
    <div className="character-trait"><span className="character-avatar pixel-art" style={characterStyle(state.character, 1.8)} /><div><small>角色特性</small><strong>{CHARACTERS[state.character].trait}</strong><p>{CHARACTERS[state.character].description}</p></div></div>
    <div className="drawer-stats"><Tip text="伤害会加到所有攻击卡牌的基础伤害上。"><span><Swords />伤害 +{stats.attack}</span></Tip><Tip text="每回合开始时自动获得这些护盾。"><span><Shield />护盾 +{stats.block}</span></Tip><Tip text="每场战斗胜利后额外回复的生命。"><span><Heart />恢复 +{stats.recovery}</span></Tip></div>
    <nav className="drawer-tabs" style={{ '--drawer-tab-count': 3 + Number(specializationOpen) + Number(workshopUnlocked) + Number(guestsUnlocked) }}><button className={tab === 'character' ? 'active' : ''} onClick={event => openTab('character', event)}>装备</button><button className={`${tab === 'bag' ? 'active' : ''} ${!state.featureSeen.bag ? 'has-new' : ''}`} onClick={event => openTab('bag', event)}>背包 {state.inventory.length}{!state.featureSeen.bag && tabNewBadge()}</button><button className={tab === 'deck' ? 'active' : ''} onClick={event => openTab('deck', event)}>卡组 {state.deck.length}</button>{specializationOpen && <button className={`${tab === 'specialization' ? 'active' : ''} ${specializationNew ? 'has-new' : availableSpecializationPoints > 0 ? 'has-points' : ''}`} onClick={event => openTab('specialization', event)}>专精{specializationNew ? tabNewBadge() : availableSpecializationPoints > 0 && <em className="drawer-point-badge">{availableSpecializationPoints}</em>}</button>}{workshopUnlocked && <button className={`${tab === 'workshop' ? 'active' : ''} ${!state.featureSeen.workshop ? 'has-new' : ''} ${state.phase !== 'hub' ? 'travel-locked' : ''}`} onClick={event => openTab('workshop', event)}>工坊{!state.featureSeen.workshop && tabNewBadge()}</button>}{guestsUnlocked && <button className={`${tab === 'guests' ? 'active' : ''} ${!state.featureSeen.guests ? 'has-new' : ''} ${state.phase !== 'hub' ? 'travel-locked' : ''}`} onClick={event => openTab('guests', event)}>客人{!state.featureSeen.guests && tabNewBadge()}</button>}</nav>
    {tab === 'character' && <><div className="equipment-toolbar"><strong>当前装备</strong><button disabled={state.phase !== 'hub'} onClick={() => dispatch({ type: 'equipBest' })}><Crown />一键换上最适合</button></div><div className="equipment-grid">{Object.entries(SLOT_LABELS).map(([slot, label]) => { const item = itemFor(state, state.equipment[slot]); return <EquippedSlot key={slot} item={item} slot={slot} label={label} active={selectedSlot === slot} onOpen={() => setSelectedSlot(selectedSlot === slot ? null : slot)} />; })}</div>{selectedSlot && <section className="slot-replacements"><header><span><small>替换装备</small><strong>{SLOT_LABELS[selectedSlot]}</strong></span><button className="icon-button" onClick={() => setSelectedSlot(null)} aria-label="收起替换列表"><X /></button></header><p>点击装备查看详情，对比后确认替换。</p><div className="inventory-list">{state.inventory.filter(item => ITEMS[item.base].slot === selectedSlot).map(item => <GearRow key={item.id} item={item} equipped={state.equipment[selectedSlot] === item.id} isNew={state.journeyNewItems?.includes(item.id)} onOpen={() => setSelectedGear(item.id)} />)}</div>{state.phase !== 'hub' && <small className="bag-hint">只有回到房车才能更换装备。</small>}</section>}<div className="log"><h3><BookOpen />最近战报</h3>{state.log.slice(0, 6).map((item, i) => <p key={i}>{item}</p>)}</div></>}
    {tab === 'bag' && <section className="bag-panel"><header className="bag-toolbar"><span><strong>背包装备</strong><small>已穿戴装备不会被批量售卖</small></span>{state.phase === 'hub' && <button onClick={() => setBulkSelling(true)}><Coins />一键售卖</button>}</header><div className="inventory-list">{state.inventory.map(item => { const slot = ITEMS[item.base].slot; return <GearRow key={item.id} item={item} equipped={state.equipment[slot] === item.id} isNew={state.journeyNewItems?.includes(item.id)} onOpen={() => setSelectedGear(item.id)} />; })}{state.phase !== 'hub' && <p className="bag-hint">旅途中只能查看装备，返回房车后才能更换。</p>}</div></section>}
    {tab === 'deck' && <CardLibraryPanel state={state} dispatch={dispatch} />}
    {tab === 'specialization' && <SpecializationPanel state={state} dispatch={dispatch} />}
    {tab === 'workshop' && <div className="workshop"><header><Wrench /><span><strong>房车工坊</strong><small>重抽属性会刷新随机词条；拆解会永久销毁装备。附带技能不会被重抽。</small></span><b><Coins />{state.gold}</b></header><FacilityUpgrades state={state} dispatch={dispatch} /><div className="workshop-items">{state.inventory.map(item => <WorkshopRow key={item.id} state={state} item={item} dispatch={dispatch} onOpen={() => setSelectedGear(item.id)} onUpgrade={setUpgradingGear} />)}</div></div>}
    {tab === 'guests' && <><CommissionBoard state={state} dispatch={dispatch} /><GuestRooms state={state} dispatch={dispatch} /></>}
    <button className="drawer-title-return" onClick={onTitle}><ArrowLeft />回到标题页</button>
    {selectedGear && itemFor(state, selectedGear) && <GearDetail state={state} item={itemFor(state, selectedGear)} disabled={state.phase !== 'hub'} onClose={() => setSelectedGear(null)} onEquip={() => { dispatch({ type: 'equip', key: selectedGear }); setSelectedGear(null); }} />}
    {upgradingGear && itemFor(state, upgradingGear) && <UpgradeItemConfirm state={state} item={itemFor(state, upgradingGear)} onCancel={() => setUpgradingGear(null)} onConfirm={() => { dispatch({ type: 'upgradeItem', key: upgradingGear }); setUpgradingGear(null); }} />}
    {bulkSelling && <BulkSellDialog state={state} dispatch={dispatch} onClose={() => setBulkSelling(false)} />}
    {CHEATS_ENABLED && debugOpen && <DebugPanel state={state} dispatch={dispatch} onClose={() => setDebugOpen(false)} onLaunch={() => { setDebugOpen(false); onClose(); }} />}
    {tutorialTab && <div className="tutorial-backdrop drawer-tutorial"><section className="tutorial-card"><span>旅行屋指南</span><h2>{DRAWER_TUTORIALS[tutorialTab].title}</h2><p>{DRAWER_TUTORIALS[tutorialTab].text}</p><button className="primary" onClick={finishTutorial}>知道了</button></section></div>}
  </aside></div>;
}

function SkipCardRewardConfirm({ onCancel, onConfirm }) {
  return <div className="confirm-backdrop" onClick={onCancel}>
    <section className="confirm-dialog skip-reward-confirm" role="alertdialog" aria-modal="true" aria-labelledby="skip-card-reward-title" onClick={event => event.stopPropagation()}>
      <span className="confirm-icon"><AlertTriangle /></span><small>放弃本次选牌</small>
      <h2 id="skip-card-reward-title">不选择卡牌？</h2>
      <p>本场获得的装备已经收入背包；确认后只会放弃三选一技能牌，且不能返回重新选择。</p>
      <div className="confirm-actions"><button className="secondary" onClick={onCancel}>返回选牌</button><button className="confirm-danger" onClick={onConfirm}>确认放弃</button></div>
    </section>
  </div>;
}

function DiscardCardConfirm({ cardKey, count, canDiscardAll, onCancel, onConfirmOne, onConfirmAll }) {
  const selected = card(cardKey);
  return <div className="confirm-backdrop" onClick={onCancel}>
    <section className="confirm-dialog discard-card-confirm" role="alertdialog" aria-modal="true" aria-labelledby="discard-card-title" onClick={event => event.stopPropagation()}>
      <span className="confirm-icon"><Trash2 /></span><small>永久整理技能库</small>
      <h2 id="discard-card-title">丢弃这张卡？</h2>
      <p>共有 {count} 张 Lv.{selected.rank}「{selected.name}」。没有候补副本时，丢弃会同时从出战牌组移除。</p>
      {!canDiscardAll && <p className="discard-limit-note">全部丢弃会令出战牌不足 10 张，因此暂不可用。</p>}
      <div className="confirm-actions discard-choice-actions"><button className="secondary" onClick={onCancel}>保留卡牌</button><button className="confirm-danger" onClick={onConfirmOne}>丢弃一张</button><button className={`confirm-danger ${canDiscardAll ? '' : 'is-disabled'}`} disabled={!canDiscardAll} onClick={onConfirmAll}>全部丢弃</button></div>
    </section>
  </div>;
}

function ReturnHubConfirm({ safe, atStart, unsecuredItemCount, unsecuredCardCount, onCancel, onConfirm }) {
  const unsecuredCount = unsecuredItemCount + unsecuredCardCount;
  const risky = !safe && unsecuredCount > 0;
  const rewardSummary = [unsecuredItemCount ? `${unsecuredItemCount} 件装备` : '', unsecuredCardCount ? `${unsecuredCardCount} 张卡牌` : ''].filter(Boolean).join('和');
  const message = safe
    ? atStart ? '尚未离开起点，可以安全返回并恢复全部生命；不会获得其他额外收益。' : '本段获得的装备和卡牌已在夜程路标完成存放，可以安全返回并恢复全部生命；不会获得其他额外收益。'
    : (risky ? `当前不在路标，返回将结束本次路线，并从本段尚未存放的${rewardSummary}中随机遗失 1 项。` : '当前不在路标，返回将结束本次路线。你没有尚未存放的装备或卡牌，因此不会遗失奖励。') + ' 冒险撤离后会恢复全部生命。';
  return <div className="confirm-backdrop" onClick={onCancel}>
    <section className={`confirm-dialog return-confirm ${risky ? 'risky' : ''}`} role="alertdialog" aria-modal="true" aria-labelledby="return-confirm-title" onClick={event => event.stopPropagation()}>
      <span className="confirm-icon"><PackageOpen /></span>
      <small>{safe ? '安全返程' : '中途撤离'}</small>
      <h2 id="return-confirm-title">返回房车？</h2>
      <p>{message}</p>
      <div className="confirm-actions"><button className="secondary" onClick={onCancel}>继续探索</button><button className={risky ? 'confirm-danger' : 'primary'} onClick={onConfirm}>确认返回</button></div>
    </section>
  </div>;
}

function App() {
  const { playSfx } = React.useContext(MusicContext);
  const [saveSlots, setSaveSlots] = useState(() => SAVE_SLOT_KEYS.map(key => restore(localStorage.getItem(key))));
  const [activeSlot, setActiveSlot] = useState(null);
  const [state, setState] = useState(null);
  const [drawer, setDrawer] = useState(false);
  const [debugOpen, setDebugOpen] = useState(false);
  const [settling, setSettling] = useState(null);
  const [battleSpeed, setBattleSpeed] = useState(() => {
    const savedSpeed = Number(localStorage.getItem(BATTLE_SPEED_KEY));
    return [1, 2, 3].includes(savedSpeed) ? savedSpeed : 1;
  });
  const [valueFloaters, setValueFloaters] = useState([]);
  const [acquisition, setAcquisition] = useState([]);
  const [newlyUnlockedStage, setNewlyUnlockedStage] = useState(null);
  const valueFloaterTimer = useRef(null);
  const previousState = useRef(null);
  useEffect(() => {
    if (!import.meta.env.DEV) return undefined;
    const reportPointer = event => {
      const target = event.target instanceof Element ? event.target : null;
      const hit = document.elementFromPoint(event.clientX, event.clientY);
      const button = target?.closest('button') || hit?.closest?.('button');
      const rect = button?.getBoundingClientRect();
      console.info('[pointer-debug]', JSON.stringify({
        type: event.type,
        pointerType: event.pointerType || 'mouse',
        client: [Math.round(event.clientX), Math.round(event.clientY)],
        target: target ? `${target.tagName.toLowerCase()}.${String(target.className || '').replace(/\s+/g, '.')}` : null,
        hit: hit ? `${hit.tagName.toLowerCase()}.${String(hit.className || '').replace(/\s+/g, '.')}` : null,
        button: button?.textContent?.trim().replace(/\s+/g, ' ').slice(0, 40) || null,
        rect: rect ? [Math.round(rect.left), Math.round(rect.top), Math.round(rect.right), Math.round(rect.bottom)] : null,
        viewport: [window.innerWidth, window.innerHeight],
        visualViewport: window.visualViewport ? [Math.round(window.visualViewport.width), Math.round(window.visualViewport.height), window.visualViewport.scale, Math.round(window.visualViewport.offsetTop)] : null,
        dpr: window.devicePixelRatio,
      }));
    };
    document.addEventListener('pointerdown', reportPointer, true);
    document.addEventListener('pointerup', reportPointer, true);
    document.addEventListener('click', reportPointer, true);
    return () => {
      document.removeEventListener('pointerdown', reportPointer, true);
      document.removeEventListener('pointerup', reportPointer, true);
      document.removeEventListener('click', reportPointer, true);
    };
  }, []);
  useEffect(() => () => window.clearTimeout(valueFloaterTimer.current), []);
  useEffect(() => {
    if (state && activeSlot !== null) localStorage.setItem(SAVE_SLOT_KEYS[activeSlot], serialize(state));
  }, [state, activeSlot]);
  useEffect(() => { localStorage.setItem(BATTLE_SPEED_KEY, String(battleSpeed)); }, [battleSpeed]);
  useEffect(() => {
    const previous = previousState.current;
    previousState.current = state;
    if (!previous || !state) return;
    const completedEnding = previous.phase === 'mainStory' && previous.mainStory?.beat === 'ending' && state.phase === 'hub';
    const unlockedStage = completedEnding ? previous.mainStory.stage + 1 : -1;
    if (unlockedStage > 0 && unlockedStage < CHAPTERS.length && previous.clears[previous.mainStory.stage] === 1 && state.unlocked >= unlockedStage) {
      setNewlyUnlockedStage(unlockedStage);
      playSfx('chapterUnlock');
    }
    if (state.played > previous.played) playSfx('card');
    if (previous.phase === 'combat' && state.played > previous.played && state.block > previous.block) playSfx('guard');
    if (previous.phase === 'combat' && state.phase === 'combat') {
      if (state.enemy.hp < previous.enemy.hp) playSfx('hit');
      if (state.hp < previous.hp) playSfx('hurt');
      else if (state.hp > previous.hp) playSfx('heal');
    } else if (previous.phase === 'combat' && state.phase === 'reward') playSfx('victory');
    else if (previous.phase === 'combat' && state.phase === 'lost') playSfx('defeat');
    const changes = [];
    const acquired = [];
    if (!(previous.phase === 'memory' && state.phase === 'map')) {
      const countCards = deck => deck.reduce((counts, key) => counts.set(key, (counts.get(key) || 0) + 1), new Map());
      const before = countCards(previous.cardLibrary);
      const after = countCards(state.cardLibrary);
      const removed = [];
      const added = [];
      for (const [key, count] of before) for (let index = 0; index < count - (after.get(key) || 0); index++) removed.push(key);
      for (const [key, count] of after) for (let index = 0; index < count - (before.get(key) || 0); index++) added.push(key);
      for (const key of state.pendingScene?.debugAddedCards || []) {
        const index = added.indexOf(key);
        if (index >= 0) added.splice(index, 1);
      }
      const sideExchange = previous.phase === 'sideResolve' && state.phase === 'map';
      if (!sideExchange) {
        for (let index = added.length - 1; index >= 0; index--) {
          const addedKey = added[index];
          const removedIndex = removed.findIndex(key => cardBaseKey(key) === cardBaseKey(addedKey));
          if (removedIndex < 0) continue;
          const removedKey = removed.splice(removedIndex, 1)[0];
          added.splice(index, 1);
          changes.push({ text: `卡牌升级：${card(addedKey).name} Lv.${cardRank(removedKey)} → Lv.${cardRank(addedKey)}`, tone: 'gain', key: `upgraded-card-${Date.now()}-${index}` });
        }
      }
      if (previous.phase !== 'reward') added.forEach(key => acquired.push({ kind: 'card', key }));
      if (!sideExchange) removed.forEach((key, index) => {
        const lost = previous.phase === 'map' && state.phase === 'hub' && (previous.unsecuredCards || []).includes(key);
        changes.push({ text: `${lost ? '遗失' : '移除'}卡牌：${card(key).name} Lv.${cardRank(key)}`, tone: 'loss', key: `removed-card-${Date.now()}-${index}` });
      });
    }
    const previousItemIds = new Set(previous.inventory.map(item => item.id));
    const debugAddedGearIds = new Set(state.pendingScene?.debugAddedGearIds || []);
    const battleRewardShown = previous.phase === 'combat' && state.phase === 'reward';
    const directEquipLootIds = new Set(state.directEquipLootIds || []);
    if (!battleRewardShown) state.inventory.filter(item => !previousItemIds.has(item.id) && !debugAddedGearIds.has(item.id)).forEach(item => acquired.push({
      kind: 'gear',
      item,
      directEquipChoice: directEquipLootIds.has(item.id),
    }));
    if (previous.phase === 'map' && state.phase === 'hub') {
      const currentItems = new Set(state.inventory.map(item => item.id));
      previous.inventory
        .filter(item => !currentItems.has(item.id) && (previous.unsecuredLoot || []).includes(item.id))
        .forEach((item, index) => changes.push({
          text: `遗失装备：${itemName(item)}`,
          tone: 'loss',
          key: `lost-item-${Date.now()}-${index}`,
        }));
    }
    const add = (label, value) => { if (value) changes.push({ label, value, key: `${label}-${Date.now()}-${value}` }); };
    const ambientEffectSource = ['camp', 'event', 'negative', 'checkpoint', 'sideStory', 'sideResolve'].includes(previous.phase);
    if ((state.phase === previous.phase && state.phase !== 'combat') || ambientEffectSource) add('生命', state.hp - previous.hp);
    add('旅币', state.gold - previous.gold);
    add('经验', state.xp - previous.xp);
    add('等级', state.level - previous.level);
    add('生命上限', state.maxHp - previous.maxHp);
    add('专精点', (state.specializationBonusPoints || 0) - (previous.specializationBonusPoints || 0));
    if ((state.sideBuffs?.length || 0) > (previous.sideBuffs?.length || 0)) {
      const buff = state.sideBuffs[state.sideBuffs.length - 1];
      const effects = [buff.block ? `开局护盾 +${buff.block}` : null, buff.energy ? `开局能量 +${buff.energy}` : null, buff.firstStrike ? `首次伤害 +${buff.firstStrike}` : null].filter(Boolean).join('，');
      changes.push({ text: `获得祝福：${effects}（${buff.battles} 场）`, tone: 'gain', key: `side-buff-${Date.now()}` });
    }
    if (acquired.length) {
      setAcquisition(current => [...current, ...acquired]);
      playSfx('mysteryReveal');
    }
    if (changes.length) {
      window.clearTimeout(valueFloaterTimer.current);
      setValueFloaters(changes);
      valueFloaterTimer.current = window.setTimeout(() => setValueFloaters([]), 1700);
    } else if (previous.phase !== state.phase) {
      window.clearTimeout(valueFloaterTimer.current);
      setValueFloaters([]);
    }
  }, [state]);
  useEffect(() => {
    if (newlyUnlockedStage === null) return undefined;
    const timer = window.setTimeout(() => setNewlyUnlockedStage(null), 2600);
    return () => window.clearTimeout(timer);
  }, [newlyUnlockedStage]);
  useEffect(() => {
    if (!state || !['reward', 'lost'].includes(state.phase)) { setSettling(null); return undefined; }
    setSettling(state.phase);
    const duration = state.phase === 'reward' && state.bossFight ? 3000 : 1250 / battleSpeed;
    const timer = window.setTimeout(() => setSettling(null), duration);
    return () => window.clearTimeout(timer);
  }, [state?.phase, state?.played, state?.bossFight, battleSpeed]);
  const enemy = useMemo(() => state ? enemyFor(state) : null, [state]);
  const location = state?.phase === 'map' ? CHAPTERS[state.stage].name : state?.phase === 'mainStory' ? `${MAIN_STORY[state.mainStory?.stage]?.guest || '旅客'}的梦境记录` : state?.phase === 'mystery' ? '命运魔法屋' : state?.phase === 'camp' ? '亮灯的休息站' : state?.phase === 'memory' ? '整理回忆站' : state?.phase === 'loadout' ? '牌组整备站' : state?.phase === 'blackMarket' ? '夜路黑市' : state?.phase === 'negative' ? '失序路段' : state?.phase === 'checkpoint' ? CHECKPOINTS[state.mapRow + 1]?.title || '夜程路标' : state?.phase === 'event' ? '夜路岔口' : enemy?.place;
  const clearValueFloaters = () => { window.clearTimeout(valueFloaterTimer.current); setValueFloaters([]); setAcquisition([]); };
  const startNew = (slot, mode = 'manual', difficulty = 'standard', character = 'gaigai') => {
    const next = newRun(Date.now() >>> 0, mode, difficulty, character);
    clearValueFloaters();
    localStorage.setItem(SAVE_SLOT_KEYS[slot], serialize(next));
    setSaveSlots(current => current.map((saved, index) => index === slot ? next : saved));
    setActiveSlot(slot);
    previousState.current = null;
    setDrawer(false);
    setState(next);
  };
  const continueRun = slot => {
    clearValueFloaters();
    setActiveSlot(slot);
    previousState.current = null;
    setState(saveSlots[slot]);
  };
  const deleteSave = slot => {
    localStorage.removeItem(SAVE_SLOT_KEYS[slot]);
    setSaveSlots(current => current.map((saved, index) => index === slot ? null : saved));
  };
  const returnToTitle = () => {
    clearValueFloaters();
    if (activeSlot !== null && state) {
      localStorage.setItem(SAVE_SLOT_KEYS[activeSlot], serialize(state));
      setSaveSlots(current => current.map((saved, index) => index === activeSlot ? state : saved));
    }
    setActiveSlot(null);
    previousState.current = null;
    setDrawer(false);
    setState(null);
  };
  const resetRun = () => {
    clearValueFloaters();
    if (activeSlot !== null) {
      localStorage.removeItem(SAVE_SLOT_KEYS[activeSlot]);
      setSaveSlots(current => current.map((saved, index) => index === activeSlot ? null : saved));
    }
    setActiveSlot(null);
    previousState.current = null;
    setDrawer(false);
    setState(null);
  };
  const dispatch = React.useCallback(action => setState(current => transition(current, action)), []);
  const openHubFeature = (tab, key) => { dispatch({ type: 'viewFeature', key }); setDrawer(tab); };
  if (!state) return <Splash saves={saveSlots} onContinue={continueRun} onNew={startNew} onDelete={deleteSave} />;
  if (state.phase === 'lost' && !settling) return <><Finale won={false} state={state} onEnd={resetRun} onRevive={() => dispatch({ type: 'revive' })} onReviveWithGold={() => dispatch({ type: 'reviveWithGold' })} /><ValueFloaters items={valueFloaters} /><AcquisitionModal entries={acquisition} state={state} dispatch={dispatch} onClose={() => setAcquisition([])} /></>;
  if (state.phase === 'hub') return <><CamperHub state={state} dispatch={dispatch} newlyUnlockedStage={newlyUnlockedStage} onDrawer={() => openHubFeature('character', 'bag')} onSpecialization={() => { dispatch({ type: 'viewSpecialization' }); setDrawer('specialization'); }} onWorkshop={() => openHubFeature('workshop', 'workshop')} onGuests={() => openHubFeature('guests', 'guests')} />{drawer && <Drawer initialTab={drawer} state={state} dispatch={dispatch} onClose={() => setDrawer(false)} onTitle={returnToTitle} />}<ValueFloaters items={valueFloaters} /><AcquisitionModal entries={acquisition} state={state} dispatch={dispatch} onClose={() => setAcquisition([])} /></>;
  return <main className="game-shell">
    <header className="topbar"><div><Tip text={`当前为${DIFFICULTIES[state.difficulty].name}难度，${state.battleMode === 'auto' ? '系统会自动选择卡牌' : '由你手动选择卡牌'}；这两项设置会贯穿整局。`}><span>Lv.{state.level} · 第 {state.stage + 1} / {ENEMIES.length} 站 · {DIFFICULTIES[state.difficulty].name} · {state.battleMode === 'auto' ? '自动' : '手动'}</span></Tip><strong>{location}</strong></div><div className="route">{ENEMIES.map((_, i) => <i key={i} className={i <= state.stage ? 'active' : ''} />)}</div><Tip text={`旅币可用于工坊、设施升级、旅途交易和买活。当前等级买活需要 ${reviveCost(state)} 枚旅币。`}><span className="topbar-gold" aria-label={`当前有 ${state.gold} 枚旅币`}><Coins />{state.gold}</span></Tip></header>
    {state.phase === 'map' && <MapView state={state} dispatch={dispatch} onDebug={CHEATS_ENABLED ? () => setDebugOpen(true) : undefined} />}
    {state.phase === 'mystery' && <MysteryStation state={state} dispatch={dispatch} />}
    {(state.phase === 'combat' || settling) && <Battle state={state} dispatch={dispatch} battleSpeed={battleSpeed} onBattleSpeed={setBattleSpeed} outcome={settling === 'reward' ? 'victory' : settling === 'lost' ? 'defeat' : null} />}
    {state.phase === 'reward' && !settling && <Reward state={state} dispatch={dispatch} />}
    {state.phase === 'camp' && <Camp state={state} dispatch={dispatch} />}
    {state.phase === 'memory' && <MemoryStation state={state} dispatch={dispatch} />}
    {state.phase === 'loadout' && <LoadoutStation state={state} dispatch={dispatch} />}
    {state.phase === 'blackMarket' && <BlackMarketView state={state} dispatch={dispatch} />}
    {state.phase === 'negative' && <NegativeStation state={state} dispatch={dispatch} />}
    {state.phase === 'checkpoint' && <Checkpoint state={state} dispatch={dispatch} />}
    {state.phase === 'event' && <EventView state={state} dispatch={dispatch} />}
    {state.phase === 'mainStory' && <MainStoryView state={state} dispatch={dispatch} />}
    {state.phase === 'sideStory' && <SideStoryView state={state} dispatch={dispatch} />}
    {state.phase === 'sideResolve' && <SideResolveView state={state} dispatch={dispatch} />}
    {CHEATS_ENABLED && debugOpen && state.phase === 'map' && <DebugPanel state={state} dispatch={dispatch} onClose={() => setDebugOpen(false)} onLaunch={() => setDebugOpen(false)} />}
    <ValueFloaters items={valueFloaters} />
    <AcquisitionModal entries={acquisition} state={state} dispatch={dispatch} onClose={() => setAcquisition([])} />
  </main>;
}

function supportsFlexGap() {
  const flex = document.createElement('div');
  flex.style.position = 'absolute';
  flex.style.visibility = 'hidden';
  flex.style.display = 'flex';
  flex.style.flexDirection = 'column';
  flex.style.rowGap = '1px';
  flex.appendChild(document.createElement('div'));
  flex.appendChild(document.createElement('div'));
  document.body.appendChild(flex);
  const supported = flex.scrollHeight === 1;
  flex.parentNode.removeChild(flex);
  return supported;
}

document.documentElement.classList.toggle('no-flex-gap', !supportsFlexGap());
const xhsPreview = new URLSearchParams(window.location.search).has('xhs_preview');
const xhsRuntime = Boolean(window.xhs?.miniTool) || /XiaoHongShu|XHS/i.test(navigator.userAgent) || xhsPreview;
document.documentElement.classList.toggle('xhs-runtime', xhsRuntime);

createRoot(document.getElementById('root')).render(<MusicProvider><TooltipProvider><App /></TooltipProvider></MusicProvider>);

