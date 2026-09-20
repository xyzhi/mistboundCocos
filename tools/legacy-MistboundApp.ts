import { _decorator, Component, Node, UITransform, Graphics, Label, Color, Vec3, view, sys, resources, Sprite, SpriteFrame, EventTouch, EventMouse, Layers, AudioClip, AudioSource, Overflow, HorizontalTextAlignment, VerticalTextAlignment } from 'cc';
// @ts-ignore: 原游戏规则是保留原样的 JavaScript 模块。
import * as game from './game.mjs';

const { ccclass } = _decorator;
type State = any;
type Action = Record<string, any>;
const SAVE_KEYS = ['goodnight-next-stop.run.v8', 'goodnight-next-stop.run.v8.slot.2', 'goodnight-next-stop.run.v8.slot.3'];
const COLORS = {
  bg: new Color(20, 24, 37), panel: new Color(35, 41, 57), button: new Color(76, 66, 90),
  accent: new Color(186, 139, 112), text: new Color(250, 239, 221), muted: new Color(188, 189, 199),
  danger: new Color(168, 81, 85), green: new Color(89, 132, 116),
};

@ccclass('MistboundApp')
export class MistboundApp extends Component {
  private state: State | null = null;
  private slot = -1;
  private mode = 'manual';
  private difficulty = 'standard';
  private music = true;
  private audio!: AudioSource;
  private root!: Node;
  private page = 0;
  private tab = 'journey';
  private bagAction = 'equip';
  private confirmReset = false;
  private width = 720;
  private height = 1280;
  private y = 0;
  private revision = 0;
  private scroll = 0;
  private maxScroll = 0;
  private dragged = false;
  private specializationRoute = 0;
  private specializationDraft: Record<string, number> | null = null;
  private confirmSpecializationReset = false;
  private sideSelections: string[] = [];
  private sideSceneKey = '';
  private renderContext = '';

  start() {
    const size = view.getVisibleSize();
    this.width = size.width;
    this.height = size.height;
    // Android AppActivity hosts the original frontend above this Cocos scene.
    if (sys.isNative) return;
    this.box(this.node, 0, 0, this.width, this.height, COLORS.bg);
    this.root = new Node('Game UI');
    this.node.addChild(this.root);
    this.root.layer = Layers.Enum.UI_2D;
    this.root.addComponent(UITransform).setContentSize(this.width, this.height);
    this.root.on(Node.EventType.TOUCH_START, () => { this.dragged = false; }, this);
    this.root.on(Node.EventType.TOUCH_MOVE, (event: EventTouch) => {
      if (Math.abs(event.getDeltaY()) > 0) this.dragged = true;
      this.setScroll(this.scroll - event.getDeltaY());
    }, this);
    this.root.on(Node.EventType.MOUSE_WHEEL, (event: EventMouse) => this.setScroll(this.scroll + event.getScrollY() * 0.3), this);
    this.audio = this.node.addComponent(AudioSource);
    this.audio.loop = true;
    this.music = sys.localStorage.getItem('mistbound-music-enabled') !== 'off';
    resources.load('night-drive', AudioClip, (err, clip) => { if (!err && clip && this.audio?.isValid) this.audio.clip = clip; });
    this.render();
  }

  private act(action: Action) {
    if (!this.state) return;
    const before = this.state;
    this.state = game.transition(before, action);
    if (this.state !== before) {
      if (action.type === 'specialize' || action.type === 'resetSpecialization') this.specializationDraft = null;
      if (['sideTurnIn', 'sideResolveLeave', 'sideResolveClaim'].includes(action.type)) this.sideSelections = [];
      sys.localStorage.setItem(SAVE_KEYS[this.slot], game.serialize(this.state));
      this.page = 0;
      this.render();
    }
  }

  private startGame(character: string) {
    this.state = game.newRun(Date.now() >>> 0, this.mode, this.difficulty, character);
    sys.localStorage.setItem(SAVE_KEYS[this.slot], game.serialize(this.state));
    if (this.music && this.audio.clip) this.audio.play();
    this.page = 0;
    this.render();
  }

  private box(parent: Node, x: number, y: number, w: number, h: number, color: Color): Node {
    const node = new Node('Panel');
    parent.addChild(node);
    node.layer = Layers.Enum.UI_2D;
    node.setPosition(new Vec3(x, y, 0));
    node.addComponent(UITransform).setContentSize(w, h);
    const graphic = node.addComponent(Graphics);
    graphic.fillColor = color;
    graphic.rect(-w / 2, -h / 2, w, h);
    graphic.fill();
    return node;
  }

  private label(parent: Node, value: string, x: number, y: number, w: number, h: number, size = 25, color = COLORS.text) {
    const node = new Node('Text');
    parent.addChild(node);
    node.layer = Layers.Enum.UI_2D;
    node.setPosition(new Vec3(x, y, 0));
    node.addComponent(UITransform).setContentSize(w, h);
    const label = node.addComponent(Label);
    label.string = String(value);
    label.fontSize = size;
    label.lineHeight = size * 1.28;
    label.color = color;
    label.overflow = Overflow.SHRINK;
    label.horizontalAlign = HorizontalTextAlignment.CENTER;
    label.verticalAlign = VerticalTextAlignment.CENTER;
    return node;
  }

  private button(value: string, action: () => void, color = COLORS.button, h = 72) {
    const w = this.width - 64;
    const node = this.box(this.root, 0, this.y - h / 2, w, h - 8, color);
    this.label(node, value, 0, 0, w - 24, h - 12, 25);
    node.on(Node.EventType.TOUCH_END, (_event: EventTouch) => { if (!this.dragged) action(); }, this);
    this.y -= h;
    return node;
  }

  private text(value: string, size = 24, h = 64, color = COLORS.text) {
    this.label(this.root, value, 0, this.y - h / 2, this.width - 70, h, size, color);
    this.y -= h;
  }

  private heading(value: string) { this.text(value, 36, 80); }
  private gap(h = 20) { this.y -= h; }
  private setScroll(value: number) {
    this.scroll = Math.max(0, Math.min(this.maxScroll, value));
    this.root.setPosition(0, this.scroll, 0);
  }
  private finishLayout(scroll = 0) {
    this.maxScroll = Math.max(0, -this.height / 2 + 28 - this.y);
    this.setScroll(scroll);
  }
  private paginate<T>(items: T[], perPage = 5): T[] {
    const pages = Math.max(1, Math.ceil(items.length / perPage));
    this.page = Math.min(this.page, pages - 1);
    const shown = items.slice(this.page * perPage, (this.page + 1) * perPage);
    if (pages > 1) {
      const current = this.page;
      this.button(`第 ${current + 1}/${pages} 页  ·  点击下一页`, () => { this.page = (current + 1) % pages; this.render(); }, COLORS.panel, 54);
    }
    return shown;
  }

  private art(name: string) {
    const marker = ++this.revision;
    const node = new Node('Artwork');
    this.root.addChild(node);
    node.layer = Layers.Enum.UI_2D;
    node.setPosition(0, this.y - 110, 0);
    node.addComponent(UITransform).setContentSize(this.width - 64, 210);
    const sprite = node.addComponent(Sprite);
    sprite.sizeMode = Sprite.SizeMode.CUSTOM;
    resources.load(`art/${name}/spriteFrame`, SpriteFrame, (err, frame) => {
      if (!err && frame && node.isValid && marker === this.revision) sprite.spriteFrame = frame;
    });
    this.y -= 224;
  }

  private render() {
    if (!this.root?.isValid) return;
    const context = `${this.slot}:${this.state?.phase || 'start'}:${this.tab}:${this.page}:${this.specializationRoute}`;
    const scroll = context === this.renderContext ? this.scroll : 0;
    this.renderContext = context;
    this.root.children.slice().forEach(child => { child.removeFromParent(); child.destroy(); });
    this.revision++;
    this.y = this.height / 2 - 28;
    if (this.slot < 0) { this.renderSlots(); this.finishLayout(scroll); return; }
    if (!this.state) { this.renderStart(); this.finishLayout(scroll); return; }
    const s = this.state;
    this.text(`下一站，晚安  ·  Lv.${s.level}  ${s.hp}/${s.maxHp} 生命  ${s.gold} 旅币`, 24, 70, COLORS.accent);
    switch (s.phase) {
      case 'hub': this.renderHub(s); break;
      case 'map': this.renderMap(s); break;
      case 'mainStory': this.renderStory(s); break;
      case 'combat': this.renderCombat(s); break;
      case 'reward': this.renderReward(s); break;
      case 'lost': this.renderLost(s); break;
      case 'checkpoint': this.renderCheckpoint(s); break;
      case 'mystery': this.heading('命运魔法屋'); this.button('揭开命运牌', () => this.act({ type: 'mystery' })); break;
      case 'camp': this.heading('亮灯休息站'); this.button('休息，恢复生命', () => this.act({ type: 'camp', choice: 'rest' })); this.button('购买柔软靠枕', () => this.act({ type: 'camp', choice: 'relic' })); break;
      case 'event': this.heading('沿途事件'); this.button('喝下花茶', () => this.act({ type: 'event', choice: 'spring' })); this.button('交换旧照片', () => this.act({ type: 'event', choice: 'bargain' })); break;
      case 'negative': this.heading('失序路段'); this.button('继续前行', () => this.act({ type: 'negative', choice: 'continue' })); break;
      case 'memory': this.renderMemory(s); break;
      case 'loadout': this.renderLoadout(s); break;
      case 'blackMarket': this.renderMarket(s); break;
      case 'sideStory': this.renderSideStory(s); break;
      case 'sideResolve': this.renderSideResolve(s); break;
      default: this.heading(s.phase); this.text(s.log?.at(-1) || ''); break;
    }
    this.finishLayout(scroll);
  }

  private renderStart() {
    this.heading('下一站，晚安');
    this.art('camper');
    this.text('一间行驶在梦境之间的房车旅店', 26, 90, COLORS.muted);
    this.text('选择今晚的同行者', 25, 70);
    this.button(`出牌模式：${this.mode === 'manual' ? '手动' : '自动'} · 点击切换`, () => { this.mode = this.mode === 'manual' ? 'auto' : 'manual'; this.render(); }, COLORS.panel, 58);
    this.button(`难度：${game.DIFFICULTIES[this.difficulty].name} · 点击切换`, () => { const all = Object.keys(game.DIFFICULTIES); this.difficulty = all[(all.indexOf(this.difficulty) + 1) % all.length]; this.render(); }, COLORS.panel, 58);
    this.button(`背景音乐：${this.music ? '开' : '关'}`, () => this.toggleMusic(), COLORS.panel, 54);
    for (const [key, value] of Object.entries(game.CHARACTERS) as [string, any][]) {
      this.button(`${value.name} · ${value.role}  ｜  ${value.style}`, () => this.startGame(key));
    }
    this.button('返回存档', () => { this.slot = -1; this.render(); }, COLORS.panel, 54);
  }

  private renderSlots() {
    this.heading('下一站，晚安');
    this.art('camper');
    this.text('选择一个旅程存档', 26, 90);
    SAVE_KEYS.forEach((key, index) => {
      const raw = sys.localStorage.getItem(key);
      const saved = raw ? game.restore(raw) : null;
      const title = saved ? `${game.CHARACTERS[saved.character]?.name || '旅人'} · Lv.${saved.level} · ${game.CHAPTERS[saved.stage]?.name || ''}` : '开启新旅程';
      this.button(`存档 ${index + 1}  ｜  ${title}`, () => { this.slot = index; this.state = saved; this.page = 0; if (this.music && this.audio.clip) this.audio.play(); this.render(); }, saved ? COLORS.green : COLORS.button, 90);
    });
  }

  private toggleMusic() {
    this.music = !this.music;
    sys.localStorage.setItem('mistbound-music-enabled', this.music ? 'on' : 'off');
    if (this.music && this.audio.clip) this.audio.play();
    else this.audio.stop();
    this.render();
  }

  private renderHub(s: State) {
    const chapter = game.CHAPTERS[s.stage];
    this.heading('房车旅店');
    this.art('camper');
    this.text(`${game.CHARACTERS[s.character]?.name}  ·  ${chapter?.name || ''}`, 25, 60);
    this.button('出发，进入梦境', () => this.act({ type: 'depart', stage: s.stage }), COLORS.green);
    this.button(`背景音乐：${this.music ? '开' : '关'}`, () => this.toggleMusic(), COLORS.panel, 54);
    const tabs = ['journey', 'bag', 'deck', 'rooms', 'quests', 'guests'];
    if (game.specializationUnlocked(s)) tabs.push('specialization');
    const names: Record<string, string> = { journey: '旅程', bag: '装备', deck: '牌组', rooms: '房车设施', quests: '旅程委托', guests: '住客故事', specialization: '角色专精' };
    this.button(`房车菜单：${names[this.tab]} · 点击切换`, () => {
      this.tab = tabs[(tabs.indexOf(this.tab) + 1) % tabs.length];
      this.page = 0;
      if (this.tab === 'specialization') this.act({ type: 'viewSpecialization' });
      else this.render();
    }, COLORS.panel, 60);
    if (this.tab === 'journey') {
      for (let i = 0; i <= s.unlocked; i++) this.button(`${game.CHAPTERS[i].name}  ·  进入`, () => this.act({ type: 'depart', stage: i }), COLORS.panel, 62);
    } else if (this.tab === 'bag') {
      this.button('一键装备更合适的物品', () => this.act({ type: 'equipBest' }), COLORS.green, 62);
      this.button(`装备操作：${({ equip: '穿戴', upgrade: '升阶', reroll: '重铸', salvage: '拆解' } as any)[this.bagAction]} · 点击切换`, () => { const all = ['equip', 'upgrade', 'reroll', 'salvage']; this.bagAction = all[(all.indexOf(this.bagAction) + 1) % all.length]; this.render(); }, COLORS.panel, 54);
      this.paginate(s.inventory, 4).forEach((item: any) => this.button(`${game.itemName(item)} · ${item.rarity} Lv.${item.itemLevel}`, () => this.act({ type: ({ equip: 'equip', upgrade: 'upgradeItem', reroll: 'reroll', salvage: 'salvage' } as any)[this.bagAction], key: item.id }), COLORS.panel, 62));
    } else if (this.tab === 'deck') {
      this.text(`出战 ${s.deck.length} 张 · 收藏 ${s.cardLibrary.length} 张`, 23, 54);
      this.button('一键整理出战牌组', () => this.act({ type: 'loadout', operation: 'activateAll' }), COLORS.green, 62);
      this.paginate(s.cardLibrary, 4).forEach((key: string) => {
        const owned = s.cardLibrary.filter((candidate: string) => candidate === key).length;
        const active = s.deck.filter((candidate: string) => candidate === key).length;
        const operation = owned > active ? 'activate' : 'bench';
        this.button(`${game.card(key).name} Lv.${game.cardRank(key)} · ${operation === 'activate' ? '加入出战' : '移至候补'}`, () => this.act({ type: 'loadout', operation, key }), COLORS.panel, 62);
      });
    } else if (this.tab === 'rooms') {
      for (const [key, name] of [['kitchen', '暖灯厨房'], ['workshop', '随车工坊'], ['rooms', '旅客房间']]) {
        this.button(`${name} Lv.${s.facilities[key]} · 升级 ${game.facilityCost(s.facilities[key]) ?? '已满'} 旅币`, () => this.act({ type: 'upgradeFacility', key }), COLORS.panel, 62);
      }
    } else if (this.tab === 'quests') {
      for (const key of ['battles', 'steps', 'stories']) {
        const status = game.commissionStatus(s, key);
        this.button(`${({ battles: '战斗', steps: '旅途', stories: '故事' } as any)[key]} ${status?.value || 0}/${status?.target || 0} · 领取 ${status?.reward || 0} 旅币`, () => this.act({ type: 'claimCommission', key }), COLORS.panel, 68);
      }
    } else if (this.tab === 'guests') {
      this.paginate(game.GUESTS, 4).forEach((guest: any) => {
        const index = game.GUESTS.indexOf(guest);
        this.button(`${guest.name} · ${s.clears[index]}/3 段故事 · ${s.guestRewards[index] ? '已领取' : '领取纪念品'}`, () => this.act({ type: 'claimGuestReward', stage: index }), COLORS.panel, 70);
      });
    } else if (this.tab === 'specialization') {
      this.renderSpecialization(s);
    }
    this.button('返回存档选择', () => { this.slot = -1; this.state = null; this.page = 0; this.render(); }, COLORS.panel, 54);
    this.button(this.confirmReset ? '确认清空当前存档' : '重新开始当前存档', () => {
      if (!this.confirmReset) { this.confirmReset = true; this.render(); return; }
      sys.localStorage.removeItem(SAVE_KEYS[this.slot]);
      this.state = null;
      this.confirmReset = false;
      this.audio.stop();
      this.render();
    }, this.confirmReset ? COLORS.danger : COLORS.panel, 54);
  }

  private renderSpecialization(s: State) {
    const routes = game.SPECIALIZATIONS[s.character] || [];
    const draft = this.specializationDraft ||= { ...(s.specializations || {}) };
    const spent = Object.values(draft).reduce((sum: number, rank: number) => sum + rank, 0) as number;
    const committed = game.specializationSpent(s);
    this.text(`专精点 ${spent}/${game.specializationPointTotal(s)} · 待确认 ${spent - committed}`, 23, 60);
    this.button(`路线：${routes[this.specializationRoute]?.name || ''} · 点击切换`, () => {
      this.specializationRoute = (this.specializationRoute + 1) % routes.length;
      this.page = 0;
      this.render();
    }, COLORS.panel, 58);
    const route = routes[this.specializationRoute];
    if (route) {
      this.text(route.summary, 22, 86, COLORS.muted);
      this.paginate(route.nodes, 3).forEach((talent: any) => {
        const rank = draft[talent.id] || 0;
        const canInvest = game.canInvestSpecialization({ ...s, specializations: draft }, draft, talent.id);
        this.button(`${talent.name} ${rank}/${talent.maxRank} · ${game.specializationNodeText(talent, rank)}${canInvest ? '  [+]' : ''}`, () => {
          if (!canInvest) return;
          draft[talent.id] = rank + 1;
          this.render();
        }, canInvest ? COLORS.button : COLORS.panel, 98);
      });
    }
    if (spent > committed) {
      this.button(`确认投入 ${spent - committed} 点`, () => this.act({ type: 'specialize', allocations: { ...draft } }), COLORS.green, 62);
      this.button('撤销待确认加点', () => { this.specializationDraft = null; this.render(); }, COLORS.panel, 58);
    }
    if ((s.specializationResetTokens || 0) > 0 && committed > 0) {
      this.button(this.confirmSpecializationReset ? '确认消耗空白书签并重置全部专精' : '使用空白书签重置专精', () => {
        if (!this.confirmSpecializationReset) { this.confirmSpecializationReset = true; this.render(); return; }
        this.confirmSpecializationReset = false;
        this.act({ type: 'resetSpecialization' });
      }, this.confirmSpecializationReset ? COLORS.danger : COLORS.panel, 62);
    }
  }

  private renderMap(s: State) {
    this.heading(game.CHAPTERS[s.stage]?.name || '梦境地图');
    this.art(`chapter-${s.stage}`);
    this.text(`第 ${s.mapRow + 2} / ${game.MAP_STEPS} 步  ·  最近路标 ${s.checkpointRow + 1}`, 24, 70);
    const nodes = game.chapterMap(s.stage, s.mapSeed);
    const previous = nodes.find((item: any) => item.id === s.currentNode);
    const available = s.mapRow < 0 ? nodes.filter((item: any) => item.row === 0) : nodes.filter((item: any) => previous?.links?.includes(item.id));
    available.forEach((item: any) => this.button(`${({ battle: '梦影', elite: '精英', boss: '首领', checkpoint: '路标', mystery: '魔法屋', event: '事件' } as any)[item.type] || item.type} · 选择路线`, () => this.act({ type: 'node', id: item.id }), item.type === 'boss' ? COLORS.danger : COLORS.button));
    this.gap();
    this.button('返回房车', () => this.act({ type: 'returnHub' }), COLORS.panel, 62);
  }

  private renderStory(s: State) {
    const story = game.MAIN_STORY[s.mainStory.stage];
    const beat = s.mainStory.beat === 'ending' && s.mainStory.variant === 'fragmented' ? 'endingFragmented' : s.mainStory.beat === 'ending' && s.mainStory.variant === 'hidden' ? 'endingHidden' : s.mainStory.beat;
    const scene = story[beat] || story.ending;
    this.text(scene.eyebrow, 22, 60, COLORS.accent);
    this.heading(scene.title);
    this.art(`chapter-${s.mainStory.stage}`);
    this.text(scene.text, 23, 148);
    this.text(scene.quote, 22, 110, COLORS.muted);
    this.button(scene.action, () => this.act({ type: 'mainStoryContinue' }), COLORS.green);
  }

  private renderCombat(s: State) {
    const enemy = game.enemyFor(s);
    this.heading(`${enemy?.name || '梦影'}  ${s.enemy.hp}/${s.enemy.maxHp}`);
    this.art(s.bossFight ? ['enemies-flower-boss', 'enemies-rain-boss', 'enemies-books-boss', 'enemies-coast-boss', 'enemies-market-boss', 'enemies-terminal-boss'][s.stage] : `chapter-${s.stage}`);
    const move = game.intent(s);
    this.text(`回合 ${s.turn} · 能量 ${s.energy} · 护盾 ${s.block} · 敌方意图 ${move?.name || move?.kind || ''}`, 22, 64);
    const choices = s.hand.map((key: string, index: number) => ({ key, index }));
    this.paginate(choices, 4).forEach(({ key, index }) => this.button(`${game.card(key).name}  ${game.card(key).cost} 能量 · ${game.description(key)}`, () => this.act({ type: 'play', index }), COLORS.button, 72));
    this.button(s.battleMode === 'auto' ? '自动行动' : '结束回合', () => this.act({ type: s.battleMode === 'auto' ? 'auto' : 'end' }), COLORS.green, 64);
    if (!s.tutorialDone) this.button('我知道了', () => this.act({ type: 'tutorialDone' }), COLORS.panel, 54);
  }

  private renderReward(s: State) {
    this.heading('梦影散去');
    this.text('选择一张新技能牌，收入候补牌组', 24, 90);
    s.choices.forEach((key: string) => this.button(`${game.card(key).name} · ${game.description(key)}`, () => this.act({ type: 'reward', key }), COLORS.green, 82));
    this.button('跳过奖励', () => this.act({ type: 'reward', key: null }), COLORS.panel);
  }

  private renderLost(s: State) {
    this.heading('梦境暂时退去');
    this.text(s.log?.at(-1) || '', 24, 120);
    this.button('返回最近的路标', () => this.act({ type: 'revive' }), COLORS.green);
    this.button(`支付 ${game.reviveCost(s)} 旅币继续`, () => this.act({ type: 'reviveWithGold' }));
  }

  private renderCheckpoint(s: State) {
    const checkpoint = game.CHECKPOINTS[s.mapRow + 1];
    this.heading(checkpoint?.title || '夜程路标');
    this.text(checkpoint?.text || '', 24, 110);
    checkpoint?.choices.forEach((choice: any) => this.button(`${choice.title} · ${choice.text}`, () => this.act({ type: 'checkpoint', choice: choice.key }), COLORS.green, 88));
  }

  private renderMemory(s: State) {
    this.heading('整理回忆站');
    const pairs = [...new Set(s.cardLibrary)].filter(key => s.cardLibrary.filter((other: string) => other === key).length >= 2);
    this.paginate(pairs, 5).forEach((key: string) => this.button(`合成 ${game.card(key).name} Lv.${game.cardRank(key)}`, () => this.act({ type: 'memory', cardKey: key })));
    this.button('离开', () => this.act({ type: 'memory', cardKey: null }), COLORS.panel);
  }

  private renderLoadout(s: State) {
    this.heading('牌组整备');
    this.text(`出战牌组 ${s.deck.length} 张`, 24, 60);
    this.button('一键整理', () => this.act({ type: 'loadout', operation: 'activateAll' }), COLORS.green);
    this.paginate(s.cardLibrary, 4).forEach((key: string) => this.button(`加入 ${game.card(key).name}`, () => this.act({ type: 'loadout', operation: 'activate', key }), COLORS.panel));
    this.button('继续旅程', () => this.act({ type: 'leaveLoadout' }), COLORS.green);
  }

  private renderMarket(s: State) {
    this.heading('夜路黑市');
    (s.blackMarketOffers || []).forEach((offer: any) => this.button(`${offer.kind === 'gear' ? game.itemName(offer.item) : game.card(offer.key).name} · ${offer.cost} 旅币`, () => this.act({ type: 'blackMarketBuy', id: offer.id })));
    this.button('离开黑市', () => this.act({ type: 'blackMarketLeave' }), COLORS.panel);
  }

  private renderSideStory(s: State) {
    const story = game.SIDE_STORIES[s.sideStory?.id];
    this.heading(story?.intro?.title || '沿途故事');
    this.text(story?.intro?.text || '', 24, 170);
    story?.intro?.choices?.forEach((choice: any) => this.button(choice.title, () => this.act({ type: 'sideStoryChoice', choice: choice.key })));
  }

  private renderSideResolve(s: State) {
    const scene = s.pendingScene || {};
    const sceneKey = `${scene.kind || ''}:${scene.title || ''}:${s.stepsTraveled}`;
    if (this.sideSceneKey !== sceneKey) { this.sideSceneKey = sceneKey; this.sideSelections = []; }
    this.heading(scene.title || '故事的回音');
    this.text(scene.text || '', 23, 130);
    if (scene.kind === 'reward') {
      this.button('领取故事回礼', () => this.act({ type: 'sideResolveClaim' }), COLORS.green);
    } else if (scene.kind === 'shop') {
      (scene.goods || []).forEach((good: any) => this.button(`${good.label} · ${good.cost} 旅币`, () => this.act({ type: 'sideShopBuy', id: good.id })));
    } else if (scene.kind === 'turnin_cards') {
      const candidates = game.sideCardTurnInCandidates(s, { minRank: 1, school: scene.school });
      this.text(`选择 ${scene.count} 张技能 · 已选 ${this.sideSelections.length}`, 22, 55);
      this.paginate(candidates, 4).forEach((item: any) => {
        const key = `c:${item.index}`;
        const activeSelected = candidates.filter((candidate: any) => candidate.active && this.sideSelections.includes(`c:${candidate.index}`)).length;
        const canSpare = !item.active || this.sideSelections.includes(key) || s.deck.length - activeSelected > 10;
        this.button(`${this.sideSelections.includes(key) ? '☑' : '□'} ${game.card(item.key).name} Lv.${game.cardRank(item.key)}${item.active ? (canSpare ? ' · 出战中' : ' · 出战保底') : ' · 候补'}`, () => { if (canSpare) this.toggleSideSelection(key, scene.count); }, COLORS.panel, 62);
      });
      if (this.sideSelections.length === scene.count) this.button('确认交付技能', () => this.act({ type: 'sideTurnIn', indexes: this.sideSelections.map(key => Number(key.slice(2))) }), COLORS.green, 62);
    } else if (scene.kind === 'turnin_gear') {
      const candidates = game.sideGearTurnInCandidates(s);
      this.text(`选择 ${scene.count} 件闲置装备 · 已选 ${this.sideSelections.length}`, 22, 55);
      this.paginate(candidates, 4).forEach((item: any) => {
        const key = `g:${item.id}`;
        this.button(`${this.sideSelections.includes(key) ? '☑' : '□'} ${game.itemName(item)} · ${item.rarity}`, () => this.toggleSideSelection(key, scene.count), COLORS.panel, 62);
      });
      if (this.sideSelections.length === scene.count) this.button('确认交付装备', () => this.act({ type: 'sideTurnIn', ids: this.sideSelections.map(key => key.slice(2)) }), COLORS.green, 62);
    }
    if (!scene.promise?.criticalQuest) this.button('暂时离开', () => this.act({ type: 'sideResolveLeave' }), COLORS.panel);
  }

  private toggleSideSelection(key: string, count: number) {
    if (this.sideSelections.includes(key)) this.sideSelections = this.sideSelections.filter(value => value !== key);
    else if (this.sideSelections.length < count) this.sideSelections.push(key);
    this.render();
  }
}
