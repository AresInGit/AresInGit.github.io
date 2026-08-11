import { CARDS, STARTER_DECK, getCard } from "../data/cards.js";
import { buildEventCorpus, EVENT_COUNTS } from "../data/events.js";
import { CHAPTERS, ENDINGS, REALMS, TALENTS } from "../data/story.js";

const SAVE_KEY = "fangcun-xiantu-save-v1";
const META_KEY = "fangcun-xiantu-meta-v1";
const app = document.querySelector("#app");
const toastEl = document.querySelector("#toast");
const corpus = buildEventCorpus();
const CHAPTER_REGIONS = [
  ["青牛镇", "七玄门"],
  ["太南山", "黄枫谷", "血色禁地"],
  ["乱星海", "外星海"],
  ["落云宗", "坠魔谷"],
  ["大晋", "昆吾山"],
  ["小极宫"],
];
const CHAPTER_FALLBACK_PORTRAITS = ["mortal", "demonic", "sea", "ancient-demon", "silver-wing", "space"];
const CHAPTER_ENEMIES = [
  [
    { name: "七玄门叛徒", portrait: "qixuan-traitor" },
    { name: "蒙面散修", portrait: "mortal" },
    { name: "墨府刺客", portrait: "mo-estate-assassin" },
  ],
  [
    { name: "鬼灵门修士", portrait: "ghost-spirit-cultivator" },
    { name: "血灵门徒", portrait: "blood-spirit-disciple" },
    { name: "魔道散修", portrait: "demonic" },
  ],
  [
    { name: "深海妖兽", portrait: "deep-sea-beast" },
    { name: "海渊蛇妖", portrait: "sea" },
    { name: "外星海妖兽", portrait: "outer-sea-beast" },
  ],
  [
    { name: "坠魔谷古兽", portrait: "demonfall-beast" },
    { name: "古魔残影", portrait: "ancient-demon" },
    { name: "魔气化身", portrait: "demonic-qi-avatar" },
  ],
  [
    { name: "银翅夜叉", portrait: "silver-wing" },
    { name: "昆吾夜妖", portrait: "kunwu-night-demon" },
    { name: "阴罗宗护法", portrait: "yinluo-guardian" },
  ],
  [
    { name: "空间异兽", portrait: "space" },
    { name: "虚空兽影", portrait: "void-beast-shadow" },
    { name: "界面风暴化身", portrait: "world-storm-avatar" },
  ],
];
const CHAPTER_BOSSES = [
  { name: "墨大夫", portrait: "doctor-mo" },
  { name: "王蝉", portrait: "wang-chan" },
  { name: "极阴祖师", portrait: "ancestor-jiyin" },
  { name: "古魔", portrait: "ancient-demon-lord" },
  { name: "元刹圣祖分身", portrait: "yuancha-avatar" },
  { name: "空间风暴", portrait: "space-storm" },
];
const ENEMY_PORTRAIT_BY_NAME = Object.fromEntries(
  [...CHAPTER_ENEMIES.flat(), ...CHAPTER_BOSSES].map((enemy) => [enemy.name, enemy.portrait]),
);
const MARKET_REGION_FACTORS = [1.08, 1, .92, 1.04, 1.16, 1.24];
const MARKET_ITEMS = [
  { id: "herb-pouch", name: "灵药包", detail: "灵药 +3，可用于炼丹。", basePrice: 7, rarity: "common", effect: { herbs: 3 } },
  { id: "refining-ore", name: "赤铜灵材", detail: "灵材 +2，可用于炼器与阵法。", basePrice: 11, rarity: "common", effect: { materials: 2 } },
  { id: "qi-pill", name: "定气丹", detail: "丹药 +1，用于破境。", basePrice: 15, rarity: "common", effect: { pill: 1 } },
  { id: "route-slip", name: "探路玉简", detail: "情报 +2，提升稀有奇遇权重。", basePrice: 10, rarity: "common", effect: { intel: 2 } },
  { id: "shadow-talisman", name: "遁影符", detail: "遁术积累 +2，提高后续逃遁机会。", basePrice: 13, rarity: "common", effect: { flee: 2 } },
  { id: "healing-powder", name: "护脉散", detail: "立即恢复 12 点生命。", basePrice: 9, rarity: "common", effect: { hp: 12 } },
  { id: "qi-notes", name: "炼气札记", detail: "修为 +10，适合低阶修士。", basePrice: 12, rarity: "common", effect: { cultivation: 10 } },
  { id: "rough-flags", name: "粗制阵旗", detail: "灵材 +1、情报 +1。", basePrice: 8, rarity: "common", effect: { materials: 1, intel: 1 } },
  { id: "beast-feed", name: "灵兽饲料", detail: "虫群或灵兽培育资源 +1。", basePrice: 9, rarity: "common", effect: { insect: 1 } },
  { id: "safe-route-map", name: "商路舆图", detail: "谨慎 +2，标记附近安全路线。", basePrice: 8, rarity: "common", effect: { caution: 2 } },
  { id: "spirit-herb-crate", name: "百年药匣", detail: "灵药 +6，乱星海商路特供。", basePrice: 24, rarity: "rare", minChapter: 2, regions: [2, 3], effect: { herbs: 6 } },
  { id: "foundation-pill", name: "筑基丹", detail: "丹药 +2、修为 +8。", basePrice: 38, rarity: "rare", minChapter: 1, minRealm: 0, effect: { pill: 2, cultivation: 8 } },
  { id: "nameless-scroll", name: "无名残卷", detail: "随机获得一张稀有功法牌。", basePrice: 34, rarity: "rare", minChapter: 1, effect: { card: "rare" } },
  { id: "void-map", name: "虚天残图", detail: "情报 +3，并记录虚天殿路线。", basePrice: 46, rarity: "limited", minChapter: 2, regions: [2], effect: { intel: 3, flag: "market-void-map", technique: "虚天残图" } },
  { id: "golden-bamboo-seed", name: "金雷竹种", detail: "获得可长期培育的金雷竹种。", basePrice: 58, rarity: "limited", minChapter: 3, effect: { herbs: 2, flag: "golden-bamboo-seed", relic: "金雷竹种" } },
  { id: "ancient-soul-lamp", name: "古魂灯", detail: "获得古魂灯，神识 +1。", basePrice: 66, rarity: "limited", minChapter: 4, effect: { maxMind: 1, mind: 1, relic: "古魂灯" } },
  { id: "space-crystal", name: "空间晶核", detail: "灵材 +8，并记录空间节点坐标。", basePrice: 78, rarity: "limited", minChapter: 5, regions: [5], effect: { materials: 8, flag: "space-node-chart" } },
  { id: "blood-spider-egg", name: "血玉蛛卵", detail: "虫群 +1，开启血玉蜘蛛因果。", basePrice: 45, rarity: "black", minChapter: 2, effect: { insect: 1, wanted: 1, flag: "blood-jade-spider" } },
  { id: "stolen-array", name: "无主阵盘", detail: "灵材 +5，但会增加追索。", basePrice: 31, rarity: "black", minChapter: 1, effect: { materials: 5, wanted: 1 } },
  { id: "forbidden-manual", name: "禁术手札", detail: "获得稀有秘术牌，追索 +2。", basePrice: 52, rarity: "black", minChapter: 4, effect: { card: "rare", wanted: 2 } },
];
const MARKET_SELLABLES = [
  { key: "herbs", name: "灵药", basePrice: 3 },
  { key: "pill", name: "丹药", basePrice: 8 },
  { key: "materials", name: "灵材", basePrice: 5 },
];
let state = null;
let modal = null;
let toastTimer = 0;

const pick = (items) => items[Math.floor(Math.random() * items.length)];
const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
const shuffle = (items) => {
  const next = [...items];
  for (let i = next.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [next[i], next[j]] = [next[j], next[i]];
  }
  return next;
};

function getMeta() {
  try {
    return JSON.parse(localStorage.getItem(META_KEY)) || { deaths: 0, insight: 0, endings: [], unlocked: [] };
  } catch {
    return { deaths: 0, insight: 0, endings: [], unlocked: [] };
  }
}

function defaultState() {
  const talents = shuffle(TALENTS).slice(0, 2);
  return {
    version: 1,
    name: "韩立",
    view: "game",
    phase: "event",
    chapter: 0,
    realm: 0,
    stage: 0,
    age: 10,
    lifespan: REALMS[0].lifespan,
    hp: 42,
    maxHp: 42,
    mana: 3,
    maxMana: 3,
    mind: 3,
    maxMind: 3,
    cultivation: 0,
    stones: 12,
    herbs: 1,
    pill: 0,
    materials: 0,
    green: 0,
    greenClock: 0,
    intel: 0,
    caution: 0,
    karma: 0,
    relation: 0,
    wanted: 0,
    insect: 0,
    chain: 0,
    flee: 0,
    kills: 0,
    beasts: 0,
    escapes: 0,
    alchemy: 0,
    adventures: 0,
    battles: 0,
    breakthroughs: 0,
    deck: [...STARTER_DECK],
    relics: ["掌天瓶"],
    techniques: ["长春功"],
    beastsOwned: [],
    relations: { 墨大夫: 0, 南宫婉: 0, 紫灵: 0, 大衍神君: 0, 冰凤: 0 },
    talents,
    flags: {},
    currentEvent: "normal-1",
    recentEvents: [],
    recentFamilies: [],
    recentMarketItems: [],
    marketRep: 0,
    market: null,
    outcome: null,
    log: ["离开青牛镇，踏上七玄门的山路。"],
    mapRow: 0,
    map: makeMap(0),
    battle: null,
  };
}

function makeMap(chapter) {
  const pools = chapter < 2
    ? ["event", "battle", "cave", "market", "event", "battle"]
    : ["event", "battle", "elite", "cave", "market", "event"];
  const nodes = [];
  for (let row = 0; row < 5; row += 1) {
    for (let col = 0; col < 3; col += 1) {
      nodes.push({ id: `${chapter}-${row}-${col}`, row, col, type: pick(pools), visited: false });
    }
  }
  nodes.push({ id: `${chapter}-5-1`, row: 5, col: 1, type: "boss", visited: false });
  return nodes;
}

function hasSave() {
  return Boolean(localStorage.getItem(SAVE_KEY));
}

function save() {
  if (!state) return;
  localStorage.setItem(SAVE_KEY, JSON.stringify(state));
}

function load() {
  try {
    const parsed = JSON.parse(localStorage.getItem(SAVE_KEY));
    if (!parsed?.version) return false;
    state = { ...defaultState(), ...parsed };
    state.talents = parsed.talents || defaultState().talents;
    return true;
  } catch {
    return false;
  }
}

function showToast(message) {
  toastEl.textContent = message;
  toastEl.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastEl.classList.remove("show"), 1800);
}

function ageText(age) {
  const years = Math.floor(age);
  const months = Math.round((age - years) * 12);
  return months ? `${years}岁${months}月` : `${years}岁`;
}

function realmText() {
  const realm = REALMS[state.realm];
  return `${realm.name} · ${realm.stages[state.stage] || realm.stages.at(-1)}`;
}

function currentRealmNeed() {
  const base = REALMS[state.realm].need;
  return Math.round(base * (1 + state.stage * .45));
}

function breakthroughCost() {
  return {
    pill: 1 + Math.floor(state.realm / 2) + Math.floor(state.stage / 2),
    stones: 8 + state.realm * 12 + state.stage * 5,
    years: 1 + state.realm * .75 + state.stage * .35,
  };
}

function breakthroughChance() {
  const hard = state.talents.some((talent) => talent.effect === "hard") ? 12 : 0;
  return Math.round(clamp(62 + state.intel * 1.3 + state.caution * .7 - state.realm * 7 - state.stage * 3.5 - hard, 22, 84));
}

function combatPressure(kind, chapter = state.chapter) {
  const targetRealm = CHAPTERS[chapter].realm;
  const maxStage = REALMS[targetRealm].stages.length - 1;
  const targetStage = kind === "boss" ? Math.min(2, maxStage) : kind === "elite" ? Math.min(1, maxStage) : 0;
  const realmDelta = targetRealm - state.realm;
  const stageDelta = realmDelta === 0 ? targetStage - state.stage : 0;
  const enemyDamageScale = clamp((4 ** realmDelta) * (1.55 ** stageDelta), .06, 64);
  const playerDamageScale = clamp(1 / enemyDamageScale, .02, 20);
  const enemyHpScale = clamp((2.2 ** realmDelta) * (1.3 ** stageDelta), .16, 24);
  const enemyRealmText = `${REALMS[targetRealm].name} · ${REALMS[targetRealm].stages[targetStage]}`;
  let pressureText = "境界相当，伤害不受压制";
  if (realmDelta > 0) pressureText = `相差 ${realmDelta} 个大境界：敌方伤害 ×${enemyDamageScale.toFixed(1)}，你的伤害仅 ${Math.round(playerDamageScale * 100)}%`;
  else if (realmDelta < 0) pressureText = `你高出 ${Math.abs(realmDelta)} 个大境界：你的伤害 ×${playerDamageScale.toFixed(1)}，敌方伤害仅 ${Math.round(enemyDamageScale * 100)}%`;
  else if (stageDelta > 0) pressureText = `相差 ${stageDelta} 个小层次：敌方伤害 ×${enemyDamageScale.toFixed(1)}，你的伤害仅 ${Math.round(playerDamageScale * 100)}%`;
  else if (stageDelta < 0) pressureText = `你高出 ${Math.abs(stageDelta)} 个小层次：你的伤害 ×${playerDamageScale.toFixed(1)}`;
  return { targetRealm, targetStage, realmDelta, stageDelta, enemyDamageScale, playerDamageScale, enemyHpScale, enemyRealmText, pressureText };
}

function balancedEnemyStats(kind) {
  const pressure = combatPressure(kind);
  const kindHp = kind === "boss" ? 2.15 : kind === "elite" ? 1.45 : 1;
  const kindDamage = kind === "boss" ? 1.35 : kind === "elite" ? 1.2 : 1;
  const maxHp = Math.round((26 + pressure.targetRealm * 32 + state.chapter * 8) * kindHp * pressure.enemyHpScale);
  const damage = Math.max(1, Math.round((5 + pressure.targetRealm * 6 + state.chapter * 1.5) * kindDamage * pressure.enemyDamageScale));
  return { ...pressure, maxHp, damage };
}

function rebalanceEnemy(enemy, preserveRatio = false) {
  const stats = balancedEnemyStats(enemy.kind);
  const ratio = preserveRatio && enemy.maxHp ? clamp(enemy.hp / enemy.maxHp, 0, 1) : 1;
  enemy.maxHp = stats.maxHp;
  enemy.hp = Math.max(1, Math.round(stats.maxHp * ratio));
  enemy.damage = stats.damage;
  enemy.realmGap = Math.max(0, stats.realmDelta);
  enemy.realmDiff = Math.max(0, stats.realmDelta) + (enemy.kind === "elite" || enemy.kind === "boss" ? 1 : 0);
  enemy.realmDelta = stats.realmDelta;
  enemy.stageDelta = stats.stageDelta;
  enemy.enemyDamageScale = stats.enemyDamageScale;
  enemy.playerDamageScale = stats.playerDamageScale;
  enemy.enemyRealmText = stats.enemyRealmText;
  enemy.pressureText = stats.pressureText;
  enemy.balanceVersion = 2;
  return enemy;
}

function requirementMet(requirement = {}) {
  return Object.entries(requirement).every(([key, value]) => Number(state[key] ?? state.flags?.[key] ?? 0) >= Number(value));
}

function log(message) {
  state.log.unshift(message);
  state.log = state.log.slice(0, 18);
}

function addTime(years) {
  state.age += years;
  state.greenClock += years;
  const bottleRate = state.talents.some((t) => t.effect === "bottle") ? 1.5 : 2;
  while (state.greenClock >= bottleRate) {
    state.greenClock -= bottleRate;
    state.green += 1;
    log("掌天瓶凝出一滴绿液。");
  }
  if (state.age >= state.lifespan) endRun("寿元耗尽，于洞府中坐化。", "坐化");
}

function currentEvent() {
  return corpus.all.find((event) => event.id === state.currentEvent) || corpus.normal[0];
}

function eligibleEvents(pool) {
  return pool.filter((event) => {
    const tierOk = (event.tier ?? 0) <= state.realm + 1;
    const reqOk = requirementMet(event.requires);
    const regionOk = event.rarity === "chain" || CHAPTER_REGIONS[state.chapter].includes(event.region);
    return tierOk && reqOk && regionOk;
  });
}

function chooseWeighted(events) {
  if (!events.length) return pick(corpus.normal);
  const weighted = events.map((event) => ({ event, weight: state.recentEvents.includes(event.id) ? 0.1 : 1 }));
  const total = weighted.reduce((sum, item) => sum + item.weight, 0);
  let roll = Math.random() * total;
  for (const item of weighted) {
    roll -= item.weight;
    if (roll <= 0) return item.event;
  }
  return weighted.at(-1).event;
}

function selectEvent(kind = "event") {
  let pool = corpus.normal;
  const roll = Math.random();
  if (kind === "rare" || roll < 0.11 + state.intel * 0.004) pool = corpus.rare;
  if (roll < 0.025 && eligibleEvents(corpus.hidden).length) pool = corpus.hidden;
  const chainPool = eligibleEvents(corpus.chains);
  if (chainPool.length && Math.random() < 0.16) pool = chainPool;
  const eligible = eligibleEvents(pool);
  const cooled = eligible.filter((event) => !state.recentEvents.slice(0, 18).includes(event.id));
  const shortCooled = eligible.filter((event) => !state.recentEvents.slice(0, 6).includes(event.id));
  const candidates = cooled.length ? cooled : shortCooled.length ? shortCooled : eligible;
  const unseenFamilies = candidates.filter((event) => !state.recentFamilies.includes(event.family));
  const relaxedFamilies = candidates.filter((event) => !state.recentFamilies.slice(0, 5).includes(event.family));
  const event = chooseWeighted(unseenFamilies.length ? unseenFamilies : relaxedFamilies.length ? relaxedFamilies : candidates);
  state.currentEvent = event.id;
  state.recentEvents = [event.id, ...state.recentEvents.filter((id) => id !== event.id)].slice(0, 30);
  state.recentFamilies = [event.family, ...state.recentFamilies.filter((family) => family !== event.family)].slice(0, 12);
  state.phase = "event";
  state.outcome = null;
  state.adventures += 1;
  save();
  render();
}

function renderLanding() {
  const meta = getMeta();
  app.innerHTML = `
    <main class="landing paper-noise">
      <section class="landing-panel">
        <span class="seal" aria-hidden="true">凡人</span>
        <p class="eyebrow">人界篇 · 修仙 Roguelike</p>
        <h1 class="game-title">方寸仙途</h1>
        <p class="subtitle">一个凡人的修仙之路</p>
        <p class="motto">机缘从不白来。先看清代价，再决定拔剑、交易，或远遁千里。</p>
        <div class="landing-actions">
          <button class="ink-btn primary" data-action="new">开始修仙</button>
          <button class="ink-btn" data-action="continue" ${hasSave() ? "" : "disabled"}>继续游戏</button>
          <button class="ink-btn" data-action="codex">修仙图鉴</button>
          <button class="ink-btn" data-action="meta">轮回感悟 · ${meta.insight}</button>
        </div>
      </section>
      <p class="fan-note">非商业个人学习同人项目，与原作者、出版社及影视/游戏版权方无隶属关系。人物与世界观相关权利归原权利人所有。</p>
    </main>`;
  bindActions();
}

function renderTopbar() {
  const life = clamp((state.lifespan - state.age) / state.lifespan * 100, 0, 100);
  return `
    <header class="topbar">
      <div class="topbar-line">
        <div class="brand"><span class="brand-seal">方寸</span><div><strong>方寸仙途</strong><small>${CHAPTERS[state.chapter].name}</small></div></div>
        <div class="stats">
          <div class="stat"><span>境界</span><b>${realmText()}</b></div>
          <div class="stat"><span>年龄 / 寿元</span><b>${Math.floor(state.age)} / ${state.lifespan}</b></div>
          <div class="stat"><span>生命</span><b>${state.hp} / ${state.maxHp}</b></div>
          <div class="stat"><span>灵力 / 神识</span><b>${state.maxMana} / ${state.maxMind}</b></div>
          <div class="stat"><span>灵石</span><b>${state.stones}</b></div>
          <div class="stat"><span>掌天瓶</span><b>绿液 ${state.green}</b></div>
        </div>
        <div class="top-actions"><button class="icon-btn" data-action="save" aria-label="保存">存</button><button class="icon-btn" data-action="home" aria-label="返回首页">归</button></div>
      </div>
      <div class="progress life" aria-label="剩余寿元"><i style="width:${life}%"></i></div>
    </header>`;
}

function renderLeftRail() {
  const realmNeed = currentRealmNeed();
  return `
    <aside class="left-rail panel">
      <h2 class="panel-title">人界纪行 <small>${state.chapter + 1} / ${CHAPTERS.length}</small></h2>
      <div class="scroll-body">
        <div class="chapter-list">${CHAPTERS.map((chapter, index) => `<div class="chapter ${index === state.chapter ? "active" : index < state.chapter ? "done" : ""}">${chapter.name}</div>`).join("")}</div>
        <div class="fate-strip"><strong>${state.talents.map((t) => t.name).join(" · ")}</strong><br>${state.talents.map((t) => t.text).join(" ")}</div>
        <p style="font-size:11px;margin:16px 0 5px">修为 ${state.cultivation} / ${realmNeed}</p>
        <div class="progress"><i style="width:${clamp(state.cultivation / realmNeed * 100, 0, 100)}%"></i></div>
      </div>
    </aside>`;
}

function renderRightRail() {
  return `
    <aside class="right-rail panel">
      <h2 class="panel-title">随身札记 <small>自动保存</small></h2>
      <div class="scroll-body side-list">
        <div class="tag-row">
          <span class="tag">情报 ${state.intel}</span><span class="tag">谨慎 ${state.caution}</span><span class="tag">因果 ${state.karma}</span><span class="tag">杀气 ${Math.max(0, state.kills - state.karma)}</span>
        </div>
        <div class="tag-row"><span class="tag">灵药 ${state.herbs}</span><span class="tag">丹药 ${state.pill}</span><span class="tag">灵材 ${state.materials}</span><span class="tag">虫群 ${state.insect}</span></div>
        <div class="log">${state.log.map((entry, index) => `<div><time>${index ? "·" : "今"}</time> ${entry}</div>`).join("")}</div>
      </div>
    </aside>`;
}

function riskHint(event) {
  if (!event.danger) return "";
  return `<div class="risk-hint">⚠ 此人气息深不可测。贸然接近，可能没有第二次选择。</div>`;
}

function renderEvent() {
  const event = currentEvent();
  if (state.outcome) {
    return `
      <section class="scene panel"><div class="scene-content">
        <span class="location">${CHAPTERS[state.chapter].location} · 因果已定</span>
        <h1 class="event-title">${event.title}</h1>
        <div class="outcome">${state.outcome}</div>
        <div class="choices"><button class="choice" data-action="map"><span>继续前行</span><small>选择下一处去向 →</small></button></div>
      </div></section>`;
  }
  return `
    <section class="scene panel"><div class="scene-content">
      <span class="location">${event.region || CHAPTERS[state.chapter].location} · ${event.rarity === "rare" ? "稀有机缘" : event.rarity === "hidden" ? "隐秘因果" : "行路见闻"}</span>
      <h1 class="event-title">${event.title}</h1>
      <p class="event-text">${event.text}</p>
      ${riskHint(event)}
      <div class="choices">${event.options.map((option, index) => {
        const enabled = requirementMet(option.requires);
        const needs = option.requires ? Object.entries(option.requires).map(([key, value]) => `${labelFor(key)}≥${value}`).join(" · ") : "后果未知";
        return `<button class="choice ${option.effects?.hp < 0 || option.effects?.wanted ? "danger" : ""}" data-choice="${index}" ${enabled ? "" : "disabled"}><span>【${option.label}】</span><small>${enabled ? needs : `条件不足：${needs}`}</small></button>`;
      }).join("")}</div>
    </div></section>`;
}

const nodeLabel = { event: "奇遇", battle: "斗法", elite: "强敌", cave: "洞府", market: "坊市", boss: "劫关" };

function renderMap() {
  return `
    <section class="scene panel"><h1 class="panel-title">择路而行 <small>同一层只能选择一处</small></h1><div class="map-wrap">
      <div class="route-map">${state.map.map((node) => {
        const locked = node.row !== state.mapRow || node.visited;
        return `<button class="node ${locked ? "locked" : ""} ${node.type === "boss" ? "boss" : ""}" style="grid-column:${node.col + 1};grid-row:${node.row + 1}" data-node="${node.id}" ${locked ? "disabled" : ""}><span>${nodeLabel[node.type]}</span></button>`;
      }).join("")}</div>
      <p style="text-align:center;color:#777260;font-size:12px">情报能增加稀有事件出现率；同类事件会进入 12 次见闻冷却。</p>
    </div></section>`;
}

function renderMarket() {
  const inventory = state.market?.inventory || [];
  const blackUnlocked = state.intel >= 3 || state.wanted >= 1 || state.marketRep >= 3;
  const rarityLabel = { common: "常备", rare: "稀有", limited: "限时", black: "黑市" };
  return `
    <section class="scene panel market-scene"><div class="market-content">
      <div class="market-heading">
        <div><span class="location">${CHAPTERS[state.chapter].location} · 坊市交易</span><h1 class="event-title">${state.chapter === 2 ? "魁星岛海市" : state.chapter >= 4 ? "大晋秘市" : "修士坊市"}</h1><p class="event-text">货物受区域、境界与坊市声望影响。买卖都会改变灵石与声望，刷新后不会立刻出现同一批货。</p></div>
        <div class="market-wallet"><span>灵石 <b>${state.stones}</b></span><span>坊市声望 <b>${state.marketRep || 0}</b></span><span>区域价差 <b>${Math.round((MARKET_REGION_FACTORS[state.chapter] - 1) * 100)}%</b></span></div>
      </div>
      <div class="market-actions"><button class="ink-btn primary" data-market-refresh ${state.stones < marketRefreshCost() ? "disabled" : ""}>刷新货单 · ${marketRefreshCost()} 灵石</button><button class="ink-btn" data-action="map">离开坊市</button></div>
      <div class="market-layout">
        <section><h2 class="market-title">今日货单 <small>${blackUnlocked ? "黑市通道已开启" : "情报 3 / 追索 1 / 声望 3 可开启黑市"}</small></h2>
          <div class="market-grid">${inventory.map((slot) => {
            const item = MARKET_ITEMS.find((entry) => entry.id === slot.id);
            if (!item) return "";
            const blackLocked = item.rarity === "black" && !blackUnlocked;
            const disabled = slot.stock < 1 || state.stones < slot.price || blackLocked;
            return `<article class="market-card ${item.rarity}"><div class="market-card-top"><span class="rarity">${rarityLabel[item.rarity]}</span><span>余 ${slot.stock}</span></div><h3>${item.name}</h3><p>${item.detail}</p><button class="ink-btn" data-market-buy="${item.id}" ${disabled ? "disabled" : ""}>${slot.stock < 1 ? "售罄" : blackLocked ? "黑市未开启" : `${slot.price} 灵石 · 买入`}</button></article>`;
          }).join("")}</div>
        </section>
        <section><h2 class="market-title">寄售回收 <small>每次出售 1 份</small></h2>
          <div class="sell-list">${MARKET_SELLABLES.map((item) => `<article><div><strong>${item.name}</strong><small>持有 ${state[item.key] || 0}</small></div><button class="ink-btn" data-market-sell="${item.key}" ${(state[item.key] || 0) < 1 ? "disabled" : ""}>卖出 · ${marketSellPrice(item)} 灵石</button></article>`).join("")}</div>
        </section>
      </div>
    </div></section>`;
}

function renderBottomNav() {
  const items = [["牌", "卡组", "deck"], ["囊", "背包", "bag"], ["宝", "法宝", "relics"], ["诀", "功法", "techniques"], ["兽", "灵兽", "beasts"], ["人", "人物", "people"], ["府", "洞府", "cave"]];
  return `<nav class="bottom-nav"><div class="nav-inner">${items.map(([icon, label, action]) => `<button class="nav-btn" data-modal="${action}"><b>${icon}</b>${label}</button>`).join("")}</div></nav>`;
}

function renderGame() {
  const center = state.phase === "map" ? renderMap() : state.phase === "market" ? renderMarket() : renderEvent();
  app.innerHTML = `<div class="game-shell paper-noise">${renderTopbar()}<div class="main-grid">${renderLeftRail()}${center}${renderRightRail()}</div>${renderBottomNav()}</div>${renderModal()}`;
  bindActions();
}

function labelFor(key) {
  return ({ stones: "灵石", hp: "生命", cultivation: "修为", intel: "情报", caution: "谨慎", green: "绿液", insect: "虫群", mind: "神识", maxMind: "神识上限", pill: "丹药", materials: "灵材", herbs: "灵药", relation: "人情", wanted: "追索", flee: "遁术" })[key] || key;
}

function applyEffects(effects = {}) {
  const messages = [];
  for (const [key, raw] of Object.entries(effects)) {
    if (key === "time") {
      addTime(raw);
      messages.push(`时间 ${raw >= 1 ? `${raw}年` : `${Math.round(raw * 12)}月`}`);
    } else if (key === "card") {
      const choices = CARDS.filter((card) => raw !== "rare" || ["法宝", "阵法", "秘术"].includes(card.type));
      const card = pick(choices);
      state.deck.push(card.id);
      messages.push(`获得卡牌【${card.name}】`);
    } else if (key === "hp") {
      state.hp = clamp(state.hp + raw, 0, state.maxHp);
      messages.push(`生命 ${raw > 0 ? "+" : ""}${raw}`);
    } else if (key === "cultivation") {
      state.cultivation += raw;
      messages.push(`修为 +${raw}`);
    } else if (key === "risk") {
      if (Math.random() < 0.46) setTimeout(() => startBattle("ambush"), 450);
    } else if (key === "chain") {
      state.chain += 1;
      state.flags[raw] = true;
      messages.push("长期因果已记录");
    } else {
      state[key] = Number(state[key] || 0) + raw;
      if (typeof raw === "number") messages.push(`${labelFor(key)} ${raw > 0 ? "+" : ""}${raw}`);
    }
  }
  state.mana = state.maxMana;
  state.mind = clamp(state.mind + 1, 0, state.maxMind);
  return messages.join(" · ");
}

function resolveChoice(index) {
  const event = currentEvent();
  const option = event.options[index];
  if (!option || !requirementMet(option.requires)) return;
  const delta = applyEffects(option.effects);
  state.outcome = `${option.result}${delta ? `<br><small>${delta}</small>` : ""}`;
  log(`${event.title}：${option.label}`);
  if (state.hp <= 0) return endRun(`在${event.region || CHAPTERS[state.chapter].location}伤重不治。`, "重伤");
  save();
  render();
}

function visitNode(id) {
  const node = state.map.find((item) => item.id === id);
  if (!node || node.row !== state.mapRow) return;
  state.map.filter((item) => item.row === node.row).forEach((item) => { item.visited = true; });
  state.mapRow += 1;
  addTime(node.type === "cave" ? .5 : .12);
  if (node.type === "battle") return startBattle("normal");
  if (node.type === "elite") return startBattle("elite");
  if (node.type === "boss") return startBattle("boss");
  if (node.type === "market") return marketEvent();
  if (node.type === "cave") return caveEvent();
  selectEvent();
}

function marketItemAvailable(item) {
  if ((item.minChapter ?? 0) > state.chapter) return false;
  if ((item.minRealm ?? 0) > state.realm) return false;
  if (item.regions && !item.regions.includes(state.chapter)) return false;
  if (item.effect?.flag && state.flags?.[item.effect.flag]) return false;
  if (item.effect?.relic && state.relics.includes(item.effect.relic)) return false;
  if (item.effect?.technique && state.techniques.includes(item.effect.technique)) return false;
  return true;
}

function marketPrice(item) {
  const region = MARKET_REGION_FACTORS[state.chapter] || 1;
  const realmMarkup = 1 + state.realm * .1;
  const reputationDiscount = 1 - Math.min(12, state.marketRep || 0) * .018;
  const blackMarkup = item.rarity === "black" ? 1.18 : 1;
  const variance = .9 + Math.random() * .2;
  return Math.max(2, Math.round(item.basePrice * region * realmMarkup * reputationDiscount * blackMarkup * variance));
}

function marketSellPrice(item) {
  const regionDemand = .82 + state.chapter * .06;
  const reputationBonus = 1 + Math.min(12, state.marketRep || 0) * .025;
  return Math.max(1, Math.round(item.basePrice * regionDemand * reputationBonus));
}

function marketRefreshCost() {
  return 3 + state.realm * 2 + (state.market?.refreshes || 0) * 2;
}

function buildMarketInventory() {
  const available = MARKET_ITEMS.filter(marketItemAvailable);
  const recent = state.recentMarketItems || [];
  let pool = available.filter((item) => !recent.slice(0, 12).includes(item.id));
  if (pool.length < 5) pool = available.filter((item) => !recent.slice(0, 5).includes(item.id));
  if (pool.length < 5) pool = available;
  const shuffled = shuffle(pool);
  const chosen = [];
  const take = (rarity, count) => {
    shuffled.filter((item) => item.rarity === rarity && !chosen.includes(item)).slice(0, count).forEach((item) => chosen.push(item));
  };
  take("common", 3);
  take("rare", 1);
  take("limited", 1);
  take("black", 1);
  shuffled.filter((item) => !chosen.includes(item)).slice(0, 6 - chosen.length).forEach((item) => chosen.push(item));
  state.recentMarketItems = [...chosen.map((item) => item.id), ...recent.filter((id) => !chosen.some((item) => item.id === id))].slice(0, 18);
  return chosen.map((item) => ({ id: item.id, price: marketPrice(item), stock: item.rarity === "common" ? 2 : 1 }));
}

function marketEvent() {
  state.phase = "market";
  state.outcome = null;
  state.market = { inventory: buildMarketInventory(), refreshes: 0 };
  log(`抵达${CHAPTERS[state.chapter].location}坊市，货单与上次不同。`);
  save();
  render();
}

function applyMarketItem(item) {
  const messages = [];
  for (const [key, raw] of Object.entries(item.effect || {})) {
    if (key === "card") {
      const choices = CARDS.filter((card) => raw !== "rare" || ["法宝", "阵法", "秘术"].includes(card.type));
      const card = pick(choices.length ? choices : CARDS);
      state.deck.push(card.id);
      messages.push(`获得【${card.name}】`);
    } else if (key === "flag") {
      state.flags[raw] = true;
      messages.push("后续因果已开启");
    } else if (key === "relic") {
      if (!state.relics.includes(raw)) state.relics.push(raw);
      messages.push(`获得【${raw}】`);
    } else if (key === "technique") {
      if (!state.techniques.includes(raw)) state.techniques.push(raw);
      messages.push(`记录【${raw}】`);
    } else {
      state[key] = Number(state[key] || 0) + raw;
      if (key === "hp") state.hp = clamp(state.hp, 0, state.maxHp);
      if (key === "mind") state.mind = clamp(state.mind, 0, state.maxMind);
      messages.push(`${labelFor(key)} ${raw > 0 ? "+" : ""}${raw}`);
    }
  }
  return messages.join(" · ");
}

function buyMarketItem(id) {
  const slot = state.market?.inventory.find((entry) => entry.id === id);
  const item = MARKET_ITEMS.find((entry) => entry.id === id);
  if (!slot || !item || slot.stock < 1) return showToast("此物已经售罄");
  const blackUnlocked = state.intel >= 3 || state.wanted >= 1 || state.marketRep >= 3;
  if (item.rarity === "black" && !blackUnlocked) return showToast("黑市只认情报、追索或坊市声望");
  if (state.stones < slot.price) return showToast("灵石不足");
  state.stones -= slot.price;
  slot.stock -= 1;
  state.marketRep = Math.min(12, (state.marketRep || 0) + 1);
  const result = applyMarketItem(item);
  log(`坊市购得【${item.name}】，花费灵石 ${slot.price}。${result}`);
  save();
  showToast(`购得 ${item.name}`);
  render();
}

function sellMarketItem(key) {
  const item = MARKET_SELLABLES.find((entry) => entry.key === key);
  if (!item || Number(state[key] || 0) < 1) return showToast("没有可出售的物品");
  const price = marketSellPrice(item);
  state[key] -= 1;
  state.stones += price;
  state.marketRep = Math.min(12, (state.marketRep || 0) + 1);
  log(`坊市售出一份${item.name}，获得灵石 ${price}。`);
  save();
  showToast(`售出 ${item.name}`);
  render();
}

function refreshMarket() {
  const cost = marketRefreshCost();
  if (state.stones < cost) return showToast("刷新货单所需灵石不足");
  state.stones -= cost;
  state.market.refreshes += 1;
  state.market.inventory = buildMarketInventory();
  log(`向牙行支付灵石 ${cost}，换得一批新货。`);
  save();
  showToast("货单已刷新");
  render();
}

function caveEvent() {
  modal = "cave";
  state.phase = "map";
  save();
  render();
}

function enemyFor(kind) {
  const enemy = kind === "boss" ? CHAPTER_BOSSES[state.chapter] : pick(CHAPTER_ENEMIES[state.chapter]);
  const mechanics = [
    ["夺舍", "每 3 回合侵蚀 1 点神识；神识归零时伤害大增。"],
    ["血灵大法", "造成生命伤害后，会回复部分生命。"],
    ["极阴寒域", "每 2 回合冻结 1 点灵力。"],
    ["魔气污染", "未被护盾挡住的攻击会污染灵力。"],
    ["封印三相", "生命越低，攻击次数越多。"],
    ["空间裂缝", "每 3 回合造成无视护盾的空间撕裂。"],
  ];
  return rebalanceEnemy({
    name: enemy.name,
    kind,
    portrait: enemy.portrait,
    turn: 1,
    intent: "attack",
    mechanic: kind === "boss" ? mechanics[state.chapter][0] : null,
    mechanicText: kind === "boss" ? mechanics[state.chapter][1] : null,
  });
}

function startBattle(kind = "normal") {
  state.phase = "battle";
  const draw = shuffle([...state.deck]);
  state.battle = {
    enemy: enemyFor(kind),
    playerHp: state.hp,
    block: 0,
    energy: state.maxMana,
    mind: state.mind,
    draw,
    discard: [],
    hand: [],
    turn: 1,
    message: "双方都在试探，没有人先露出底牌。",
    fleeBonus: 0,
    thorns: 0,
    nextEnergy: 0,
  };
  drawCards(5);
  state.battles += 1;
  save();
  render();
}

function drawCards(count) {
  const battle = state.battle;
  while (battle.hand.length < count) {
    if (!battle.draw.length) {
      if (!battle.discard.length) break;
      battle.draw = shuffle(battle.discard);
      battle.discard = [];
    }
    battle.hand.push(battle.draw.pop());
  }
}

function renderBattle() {
  const b = state.battle;
  const e = b.enemy;
  if (e.balanceVersion !== 2) rebalanceEnemy(e, true);
  const portrait = ENEMY_PORTRAIT_BY_NAME[e.name] || e.portrait || CHAPTER_FALLBACK_PORTRAITS[state.chapter];
  app.innerHTML = `<main class="battle paper-noise">
    <div class="battle-head"><div><p class="location">${CHAPTERS[state.chapter].location} · ${e.kind === "boss" ? "劫关" : "斗法"}</p><h2>${realmText()}</h2></div><button class="ink-btn" data-action="flee">尝试逃遁</button></div>
    <section class="enemy"><div class="enemy-portrait portrait-${portrait} ${e.kind === "boss" ? "boss" : ""}" role="img" aria-label="${e.name}的水墨对手立绘"><span>${e.kind === "boss" ? "劫" : "敌"}</span></div><h1>${e.name}</h1><p class="enemy-realm">对手境界：${e.enemyRealmText}</p><div class="realm-pressure ${e.realmDelta > 0 || e.stageDelta > 0 ? "danger" : e.realmDelta < 0 || e.stageDelta < 0 ? "advantage" : ""}">${e.realmDelta > 0 ? "此人气息深不可测 · " : ""}${e.pressureText}</div><div class="hpbar"><i style="width:${clamp(e.hp / e.maxHp * 100, 0, 100)}%"></i></div><p>${e.hp} / ${e.maxHp}</p><div class="intent">意图：下回合造成 ${e.damage} 点伤害${e.mechanic ? `<br>机制【${e.mechanic}】${e.mechanicText}` : ""}</div></section>
    <div class="battle-center"><p>${b.message}</p></div>
    <section class="hand">${b.hand.map((id, index) => {
      const card = getCard(id); const disabled = card.cost > b.energy || (card.mind || 0) > b.mind || (card.stones || 0) > state.stones;
      return `<button class="battle-card" data-card="${index}" ${disabled ? "disabled" : ""}><b>${card.cost}</b><strong>${card.name}</strong><small>${card.type}<br>${card.text}</small></button>`;
    }).join("")}</section>
    <div class="battle-actions"><div class="battle-stats"><span>生命 ${b.playerHp}/${state.maxHp}</span><span>护盾 ${b.block}</span><span>灵力 ${b.energy}</span><span>神识 ${b.mind}</span><span>回合 ${b.turn}</span></div><button class="ink-btn primary" data-action="end-turn">结束回合</button></div>
  </main>`;
  bindActions();
}

function playCard(index) {
  const b = state.battle;
  const id = b.hand[index];
  const card = getCard(id);
  if (!card || card.cost > b.energy || (card.mind || 0) > b.mind || (card.stones || 0) > state.stones) return;
  b.energy -= card.cost;
  b.mind -= card.mind || 0;
  state.stones -= card.stones || 0;
  let rawDamage = (card.damage || 0) * (card.multi || 1);
  if (card.tags?.includes("剑诀") && state.talents.some((t) => t.effect === "sword")) rawDamage += 3;
  const damage = rawDamage ? Math.max(1, Math.round(rawDamage * (b.enemy.playerDamageScale || 1))) : 0;
  b.enemy.hp -= damage;
  b.block += card.block || 0;
  b.energy += card.energy || 0;
  b.fleeBonus = Math.max(b.fleeBonus, card.flee || 0);
  b.thorns = Math.max(b.thorns, card.thorns || 0);
  b.nextEnergy += card.nextEnergy || 0;
  if (card.heal) b.playerHp = clamp(b.playerHp + card.heal, 0, state.maxHp);
  if (card.cultivation) state.cultivation += card.cultivation;
  const pressureNote = damage && Math.abs((b.enemy.playerDamageScale || 1) - 1) > .05 ? `（境界修正 ×${(b.enemy.playerDamageScale || 1).toFixed(2)}）` : "";
  b.message = `你施展【${card.name}】${damage ? `，造成 ${damage} 点伤害${pressureNote}` : ""}${card.block ? `，护盾增加 ${card.block}` : ""}。`;
  b.hand.splice(index, 1);
  if (!card.exhaust) b.discard.push(id);
  if (b.enemy.hp <= 0) return winBattle();
  save();
  render();
}

function enemyAttack() {
  const b = state.battle;
  const chapter = state.chapter;
  const enemyScale = b.enemy.enemyDamageScale || 1;
  const playerScale = b.enemy.playerDamageScale || 1;
  const phaseBonus = b.enemy.kind === "boss" && chapter === 4 && b.enemy.hp < b.enemy.maxHp * .34 ? Math.round(6 * enemyScale) : 0;
  const hit = Math.max(0, b.enemy.damage + phaseBonus - b.block);
  b.playerHp -= hit;
  if (b.thorns) b.enemy.hp -= Math.max(1, Math.round(b.thorns * playerScale));
  b.message = b.block >= b.enemy.damage + phaseBonus ? "护体灵光挡住了这一击。" : `${b.enemy.name}出手，你受到 ${hit} 点伤害。`;
  if (b.enemy.kind === "boss" && chapter === 0 && b.turn % 3 === 0) {
    b.mind = Math.max(0, b.mind - 1);
    if (b.mind === 0) b.playerHp -= Math.max(1, Math.round(8 * enemyScale));
    b.message += " 墨大夫的神识侵入识海。";
  }
  if (b.enemy.kind === "boss" && chapter === 1 && hit > 0) {
    const heal = Math.max(1, Math.floor(hit * .35));
    b.enemy.hp = Math.min(b.enemy.maxHp, b.enemy.hp + heal);
    b.message += ` 血灵大法为其回复 ${heal} 点生命。`;
  }
  if (b.enemy.kind === "boss" && chapter === 2 && b.turn % 2 === 0) {
    b.nextEnergy -= 1;
    b.message += " 极阴寒气冻结了下一回合的灵力。";
  }
  if (b.enemy.kind === "boss" && chapter === 3 && hit > 0) {
    b.nextEnergy -= 1;
    b.message += " 魔气侵入经脉。";
  }
  if (b.enemy.kind === "boss" && chapter === 5 && b.turn % 3 === 0) {
    b.playerHp -= Math.max(1, Math.round(7 * enemyScale));
    b.message += " 空间裂缝无视护盾，撕裂肉身。";
  }
  b.block = 0;
  b.thorns = 0;
  if (b.playerHp <= 0) return endRun(`与${b.enemy.name}斗法，身死道消。`, "斗法");
  if (b.enemy.hp <= 0) return winBattle();
  b.discard.push(...b.hand);
  b.hand = [];
  b.turn += 1;
  b.energy = Math.max(1, state.maxMana + b.nextEnergy);
  b.nextEnergy = 0;
  drawCards(5);
  save();
  render();
}

function attemptFlee() {
  const b = state.battle;
  const talent = state.talents.some((t) => t.effect === "flee") ? 18 : 0;
  const penalty = b.enemy.kind === "boss" ? 30 : b.enemy.realmDiff * 15;
  const chance = clamp(42 + talent + state.caution * 2 + state.flee * 2 + b.fleeBonus - penalty, 8, 100);
  if (Math.random() * 100 <= chance) {
    state.escapes += 1;
    state.flee += 1;
    state.hp = Math.max(1, b.playerHp);
    state.battle = null;
    state.phase = "map";
    log(`从${b.enemy.name}手中脱身。`);
    save();
    showToast("已脱离战斗");
    render();
  } else {
    b.message = `你试图远遁，却被${b.enemy.name}截住。`;
    enemyAttack();
  }
}

function winBattle() {
  const b = state.battle;
  const boss = b.enemy.kind === "boss";
  const elite = b.enemy.kind === "elite";
  const reward = boss ? 28 + state.chapter * 12 : elite ? 16 : 7;
  state.stones += reward;
  state.cultivation += boss ? 18 : elite ? 9 : 4;
  state.hp = Math.max(1, b.playerHp);
  state.mind = b.mind;
  state.kills += 1;
  log(`击败${b.enemy.name}，得灵石 ${reward}。`);
  if (elite || boss) {
    const card = pick(CARDS.filter((item) => !state.deck.includes(item.id) || Math.random() < .25));
    state.deck.push(card.id);
    log(`从战利品中得到【${card.name}】。`);
  }
  state.battle = null;
  if (boss) completeChapter();
  else state.phase = "map";
  save();
  showToast(boss ? "劫关已破" : "斗法取胜");
  render();
}

function completeChapter() {
  if (state.chapter === CHAPTERS.length - 1 && state.realm >= 4) return endRun(ENDINGS.ascended.text, "飞升灵界", true);
  if (state.chapter < CHAPTERS.length - 1) {
    const nextChapter = CHAPTERS[state.chapter + 1];
    state.chapter += 1;
    state.mapRow = 0;
    state.map = makeMap(state.chapter);
    state.phase = "map";
    addTime(1 + state.chapter * .5);
    if (state.realm < nextChapter.realm) {
      log(`越境进入新篇章：${nextChapter.name}。当前境界低于${REALMS[nextChapter.realm].name}，后续敌手将获得压制加成。`);
    } else {
      log(`进入新篇章：${nextChapter.name}。`);
    }
  } else {
    state.phase = "map";
    state.mapRow = 0;
    state.map = makeMap(state.chapter);
    log("空间节点仍不稳定，需先突破化神。 ");
  }
}

function renderModal() {
  if (!modal) return "";
  const wrap = (title, content) => `<div class="modal-backdrop" data-action="close-modal"><section class="modal" role="dialog" aria-modal="true" aria-label="${title}" onclick="event.stopPropagation()"><button class="close" data-action="close-modal" aria-label="关闭">×</button><h2>${title}</h2>${content}</section></div>`;
  if (modal === "deck" || modal === "codex") {
    const cards = modal === "codex" ? CARDS : state.deck.map(getCard);
    return wrap(modal === "codex" ? "修仙图鉴" : `当前卡组 · ${state.deck.length} 张`, `<div class="modal-grid">${cards.map((card) => `<article class="card-item"><h3>${card.name}</h3><p>${card.type} · 费 ${card.cost}<br>${card.text}</p></article>`).join("")}</div>${modal === "codex" ? `<p style="font-size:12px;color:#6d685b">事件库：普通 ${EVENT_COUNTS.normal} · 稀有 ${EVENT_COUNTS.rare} · 隐藏 ${EVENT_COUNTS.hidden} · 长期链 ${EVENT_COUNTS.chains}</p>` : ""}`);
  }
  if (modal === "bag") return wrap("背包", `<div class="modal-grid">${[["灵石", state.stones], ["灵药", state.herbs], ["丹药", state.pill], ["灵材", state.materials], ["绿液", state.green], ["情报", state.intel]].map(([name, value]) => `<article class="card-item"><h3>${name}</h3><p>现有 ${value}</p></article>`).join("")}</div>`);
  if (modal === "relics") return wrap("法宝", `<div class="modal-grid">${state.relics.map((name) => `<article class="card-item"><h3>${name}</h3><p>${name === "掌天瓶" ? "积蓄绿液，催熟灵药。暴露此物可能招来杀身之祸。" : "已祭炼的随身宝物。"}</p></article>`).join("")}</div>`);
  if (modal === "techniques") {
    const cost = breakthroughCost();
    const ready = state.cultivation >= currentRealmNeed() && state.pill >= cost.pill && state.stones >= cost.stones;
    return wrap("功法与突破", `<div class="modal-grid">${state.techniques.map((name) => `<article class="card-item"><h3>${name}</h3><p>当前境界：${realmText()}</p></article>`).join("")}</div><div class="breakthrough-note"><strong>破境准备</strong><span>修为 ${state.cultivation} / ${currentRealmNeed()}</span><span>丹药 ${state.pill} / ${cost.pill}</span><span>灵石 ${state.stones} / ${cost.stones}</span><span>预计耗时 ${ageText(cost.years).replace("岁", "年")}</span><span>成功率约 ${breakthroughChance()}%</span></div><div class="save-actions"><button class="ink-btn primary" data-action="breakthrough" ${ready ? "" : "disabled"}>尝试突破</button><small>失败会损失三成修为并遭受气血反噬。</small></div>`);
  }
  if (modal === "beasts") return wrap("灵兽灵虫", `<div class="modal-grid"><article class="card-item"><h3>${state.insect ? "噬金虫群" : "尚未契约"}</h3><p>${state.insect ? `培育阶段 ${state.insect}，长期成长可解锁虫修卡牌。` : "探索灵田、秘境与拍卖会，可能获得灵兽线索。"}</p></article></div>`);
  if (modal === "people") return wrap("人物因果", `<div class="modal-grid">${Object.entries(state.relations).map(([name, value]) => `<article class="card-item"><h3>${name}</h3><p>关系 ${value} · 记忆会跨章节保留</p></article>`).join("")}</div>`);
  if (modal === "cave") {
    const cultivateGain = 11 + state.realm * 2;
    const cultivateYears = 1.25 + state.realm * .25;
    return wrap("洞府", `<div class="modal-grid"><article class="card-item"><h3>闭关吐纳</h3><p>消耗 ${cultivateYears} 年，修为 +${cultivateGain}。</p><button class="ink-btn" data-cave="cultivate">闭关</button></article><article class="card-item"><h3>掌天瓶催熟</h3><p>消耗绿液 1，灵药 +4。</p><button class="ink-btn" data-cave="grow" ${state.green < 1 ? "disabled" : ""}>催熟</button></article><article class="card-item"><h3>炼制定气丹</h3><p>消耗灵药 3、灵石 6，丹药 +1。</p><button class="ink-btn" data-cave="pill" ${state.herbs < 3 || state.stones < 6 ? "disabled" : ""}>开炉</button></article><article class="card-item"><h3>静养伤势</h3><p>消耗 6 月，生命恢复至上限。</p><button class="ink-btn" data-cave="heal">静养</button></article></div>`);
  }
  if (modal === "save") return wrap("存档", `<p style="font-size:13px;line-height:1.8">每次选择后自动保存到当前浏览器。也可导出文本，在其他设备导入。</p><div class="save-actions"><button class="ink-btn" data-action="export">导出存档</button><button class="ink-btn" data-action="import">导入存档</button><button class="ink-btn" data-action="restart">重新开局</button></div><textarea class="code-area" id="save-code" placeholder="导出的存档会显示在这里；粘贴存档后点击导入。"></textarea>`);
  if (modal === "meta") {
    const meta = getMeta();
    return wrap("轮回感悟", `<p>历经 ${meta.deaths} 次轮回，留存感悟 ${meta.insight}。</p><div class="modal-grid"><article class="card-item"><h3>危险直觉</h3><p>${meta.deaths ? "已解锁：强敌气息提示更明确。" : "遭遇一次死亡后解锁。"}</p></article><article class="card-item"><h3>前世残卷</h3><p>${meta.insight >= 3 ? "已解锁：初始情报 +1。" : "累计 3 点感悟后解锁。"}</p></article></div>`);
  }
  return "";
}

function caveAction(action) {
  if (action === "cultivate") { const years = 1.25 + state.realm * .25; const gain = 11 + state.realm * 2; addTime(years); state.cultivation += gain; log(`闭关 ${years} 年，修为增加 ${gain}。`); }
  if (action === "grow" && state.green >= 1) { state.green -= 1; state.herbs += 4; addTime(.2); log("以绿液催熟四株灵药。"); }
  if (action === "pill" && state.herbs >= 3 && state.stones >= 6) { state.herbs -= 3; state.stones -= 6; state.pill += 1; state.alchemy += 1; addTime(.25); log("开炉炼成一枚定气丹。"); }
  if (action === "heal") { addTime(.5); state.hp = state.maxHp; state.mind = state.maxMind; log("静养半年，伤势尽复。"); }
  save();
  render();
}

function breakthrough() {
  const realm = REALMS[state.realm];
  const need = currentRealmNeed();
  const cost = breakthroughCost();
  if (state.cultivation < need || state.pill < cost.pill || state.stones < cost.stones) return showToast("修为、丹药或灵石不足");
  state.pill -= cost.pill;
  state.stones -= cost.stones;
  addTime(cost.years);
  const chance = breakthroughChance();
  if (Math.random() * 100 <= chance) {
    state.cultivation -= need;
    state.stage += 1;
    state.breakthroughs += 1;
    if (state.stage >= realm.stages.length) {
      if (state.realm < REALMS.length - 1) {
        state.realm += 1;
        state.stage = 0;
        state.lifespan = REALMS[state.realm].lifespan;
        state.maxHp += 18;
        state.hp = state.maxHp;
        state.maxMana += 1;
        state.maxMind += 1;
        const unlocks = ["formation", "puppet", "insects", "body"];
        state.deck.push(unlocks[state.realm - 1] || "sword-array");
      }
    }
    log(`突破成功，踏入${realmText()}。`);
    showToast("破境成功");
  } else {
    const loss = Math.ceil(need * .3);
    state.cultivation = Math.max(0, state.cultivation - loss);
    state.hp = Math.max(1, state.hp - (12 + state.realm * 7));
    state.mind = Math.max(0, state.mind - 1);
    log(`突破失败，修为倒退 ${loss}，丹药与灵石尽毁。`);
    showToast("破境失败，气血反噬");
  }
  modal = null;
  save();
  render();
}

function endRun(description, cause, ascended = false) {
  const meta = getMeta();
  if (!ascended) meta.deaths += 1;
  meta.insight += ascended ? 5 : Math.max(1, state.realm);
  if (ascended && !meta.endings.includes("ascended")) meta.endings.push("ascended");
  localStorage.setItem(META_KEY, JSON.stringify(meta));
  localStorage.removeItem(SAVE_KEY);
  const title = ascended ? ENDINGS.ascended.title : ENDINGS.dead.title;
  app.innerHTML = `<main class="landing paper-noise"><section class="landing-panel" style="justify-content:center"><span class="seal">${ascended ? "飞升" : "坐化"}</span><p class="eyebrow">本局修仙生涯</p><h1 class="game-title" style="font-size:clamp(42px,8vw,82px)">${title}</h1><p class="subtitle">${description}</p><div class="panel" style="padding:18px;max-width:600px;line-height:2;background:rgba(245,238,222,.88)"><b>${state.name}</b> · 享年 ${Math.floor(state.age)} 岁 · ${realmText()}<br>死因 / 结局：${cause}<br>斗法 ${state.battles} · 击杀 ${state.kills} · 逃遁 ${state.escapes} · 炼丹 ${state.alchemy} · 破境 ${state.breakthroughs}<br>获得功法与卡牌 ${state.deck.length}</div><div class="landing-actions" style="margin-top:20px"><button class="ink-btn primary" data-action="new">再入轮回</button><button class="ink-btn" data-action="home">返回首页</button></div></section></main>`;
  bindActions();
}

function exportSave() {
  const area = document.querySelector("#save-code");
  const code = btoa(unescape(encodeURIComponent(JSON.stringify(state))));
  area.value = code;
  area.select();
  navigator.clipboard?.writeText(code).catch(() => {});
  showToast("存档已生成并尝试复制");
}

function importSave() {
  const area = document.querySelector("#save-code");
  try {
    const next = JSON.parse(decodeURIComponent(escape(atob(area.value.trim()))));
    if (!next.version || !next.deck) throw new Error("invalid");
    state = { ...defaultState(), ...next };
    modal = null;
    save();
    render();
    showToast("存档导入成功");
  } catch {
    showToast("存档内容无法识别");
  }
}

function bindActions() {
  app.querySelectorAll("[data-action]").forEach((el) => el.addEventListener("click", () => {
    const action = el.dataset.action;
    if (action === "new") { state = defaultState(); save(); selectEvent(); }
    if (action === "continue" && load()) render();
    if (action === "home") { if (state) save(); state = null; modal = null; renderLanding(); }
    if (action === "save") { modal = "save"; render(); }
    if (action === "codex") { modal = "codex"; app.insertAdjacentHTML("beforeend", renderModal()); bindActions(); }
    if (action === "meta") { modal = "meta"; app.insertAdjacentHTML("beforeend", renderModal()); bindActions(); }
    if (action === "map") { state.phase = "map"; state.outcome = null; save(); render(); }
    if (action === "flee") attemptFlee();
    if (action === "end-turn") enemyAttack();
    if (action === "close-modal") { modal = null; if (state) render(); else renderLanding(); }
    if (action === "breakthrough") breakthrough();
    if (action === "export") exportSave();
    if (action === "import") importSave();
    if (action === "restart" && confirm("当前进度将被覆盖，确定重新开始？")) { state = defaultState(); modal = null; save(); selectEvent(); }
  }));
  app.querySelectorAll("[data-choice]").forEach((el) => el.addEventListener("click", () => resolveChoice(Number(el.dataset.choice))));
  app.querySelectorAll("[data-node]").forEach((el) => el.addEventListener("click", () => visitNode(el.dataset.node)));
  app.querySelectorAll("[data-card]").forEach((el) => el.addEventListener("click", () => playCard(Number(el.dataset.card))));
  app.querySelectorAll("[data-market-buy]").forEach((el) => el.addEventListener("click", () => buyMarketItem(el.dataset.marketBuy)));
  app.querySelectorAll("[data-market-sell]").forEach((el) => el.addEventListener("click", () => sellMarketItem(el.dataset.marketSell)));
  app.querySelectorAll("[data-market-refresh]").forEach((el) => el.addEventListener("click", refreshMarket));
  app.querySelectorAll("[data-modal]").forEach((el) => el.addEventListener("click", () => { modal = el.dataset.modal; render(); }));
  app.querySelectorAll("[data-cave]").forEach((el) => el.addEventListener("click", () => caveAction(el.dataset.cave)));
}

function render() {
  if (!state) return renderLanding();
  if (state.phase === "battle" && state.battle) return renderBattle();
  return renderGame();
}

render();
