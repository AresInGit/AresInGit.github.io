const REGIONS = ["青牛镇", "七玄门", "太南山", "黄枫谷", "血色禁地", "乱星海", "外星海", "落云宗", "坠魔谷", "大晋", "昆吾山", "小极宫"];
const OMENS = ["雾中灵光", "断崖药香", "荒寺钟声", "密林血迹", "废墟阵纹", "孤舟灯火", "石壁剑痕", "寒潭妖气", "旧驿传闻", "山腹低鸣"];

const NORMAL_ARCHETYPES = [
  { title: "山谷异光", text: "前方山谷灵气异常。神识扫过，却被一层残破禁制挡了回来。入口附近，留有新鲜脚印。", options: [
    { label: "放出傀儡探路", requires: { stones: 2 }, effects: { stones: -2, intel: 1, materials: 1 }, result: "傀儡触发了暗处禁制，你据此辨清一条生路。" },
    { label: "敛息观察", effects: { time: 1, intel: 2 }, result: "你在暗处等了半日，果然见到另一名修士先行入谷。" },
    { label: "绕路离开", effects: { time: 0.2, caution: 1 }, result: "机缘未必属于自己。你记下地形，悄然退去。" },
  ]},
  { title: "坊市暗摊", text: "角落摊位上摆着一枚蒙尘玉简。摊主不谈来历，只收灵石。周围有人似在暗中留意。", options: [
    { label: "压价购下", requires: { stones: 8 }, effects: { stones: -8, card: "random", risk: 1 }, result: "玉简内容残缺，但仍能拼出一段有用法诀。" },
    { label: "打听来历", effects: { time: 0.1, intel: 2 }, result: "你从旁人口中听出，此物牵涉一名失踪修士。" },
    { label: "不碰来路不明之物", effects: { caution: 1 }, result: "摊主很快收起玉简。两名陌生修士随后跟了上去。" },
  ]},
  { title: "雨夜借宿", text: "夜雨封山，一座破庙中已有三名散修围火而坐。几人都很客气，却没人放下兵器。", options: [
    { label: "交换情报", requires: { stones: 2 }, effects: { stones: -2, intel: 2, time: 0.1 }, result: "酒过半盏，你用几块灵石换到一条秘境消息。" },
    { label: "独守门边", effects: { time: 0.1, hp: 2, caution: 1 }, result: "这一夜无人动手。天亮时，三名散修已悄然离去。" },
    { label: "冒雨赶路", effects: { hp: -3, time: 0.1 }, result: "山路难行，但你避开了一场不知会不会发生的麻烦。" },
  ]},
  { title: "受伤修士", text: "溪边躺着一名受伤修士，储物袋还在腰间。他的呼吸很轻，远处隐约传来追兵声。", options: [
    { label: "救人后问因果", requires: { pill: 1 }, effects: { pill: -1, karma: 1, relation: 2 }, result: "他记下你的气息，答应来日偿还这份人情。" },
    { label: "先搜储物袋", effects: { stones: 7, karma: -2, wanted: 1 }, result: "你刚拿起储物袋，那人忽然睁开了眼。" },
    { label: "隐去踪迹", effects: { intel: 1, caution: 1 }, result: "追兵片刻后赶到。你从他们的对话中听出事情原委。" },
  ]},
  { title: "灵田虫害", text: "一片无人照看的灵田被青黑小虫啃噬。地下似乎还埋着灵药根茎。", options: [
    { label: "驱虫采药", effects: { time: 0.3, herbs: 2, hp: -1 }, result: "毒虫难缠，好在仍有几株灵药尚存。" },
    { label: "捕捉虫母", requires: { intel: 2 }, effects: { time: 0.5, insect: 1 }, result: "你以神识锁定虫母，虫群从此有了培育的可能。" },
    { label: "放火烧田", effects: { materials: 1, karma: -1 }, result: "火势止住虫害，也将药田化作焦土。" },
  ]},
  { title: "遗失阵旗", text: "山石间插着半面阵旗，旗角沾血。阵纹仍在自行吸纳灵气。", options: [
    { label: "以神识拆阵", requires: { mind: 2 }, effects: { mind: -1, materials: 2, intel: 1 }, result: "你避开三处杀阵，取下阵旗核心。" },
    { label: "强行拔取", effects: { hp: -7, materials: 2 }, result: "阵光暴起。你负伤退开，却也夺下了阵旗。" },
    { label: "记下方位", effects: { intel: 1, caution: 1 }, result: "你未动阵旗，只将此处记入地图。" },
  ]},
];

const RARE_ARCHETYPES = [
  { title: "古修洞府", text: "石门后的灵气沉寂了不知多少年。门缝中透出药香，也有极淡的尸气。", rare: true, options: [
    { label: "凭情报解禁", requires: { intel: 4 }, effects: { materials: 4, herbs: 3, card: "rare", time: 0.5 }, result: "禁制依次熄灭。洞府主人留下的法诀仍可修习。" },
    { label: "以阵破阵", requires: { stones: 12 }, effects: { stones: -12, materials: 5, card: "random", hp: -2 }, result: "你用灵石维持阵盘，终于撕开一道缺口。" },
    { label: "封存此地", effects: { intel: 2, caution: 2 }, result: "你布下记号，准备日后修为足够再来。" },
  ]},
  { title: "掌天瓶异动", text: "月华落下时，瓶身上的纹路微微发亮。瓶中绿液比往常更为澄澈。", rare: true, options: [
    { label: "催熟主药", effects: { green: -1, herbs: 5, time: 0.2 }, requires: { green: 1 }, result: "药香在洞府中缓慢散开，你立刻封住了所有气息。" },
    { label: "参悟瓶纹", effects: { cultivation: 8, intel: 2, time: 0.4 }, result: "纹路深奥难明，却让你对天地灵气多了一分理解。" },
    { label: "不留痕迹", effects: { caution: 2 }, result: "此物一旦暴露，便不是机缘，而是死劫。" },
  ]},
  { title: "陌生元婴", text: "那人站在海面上，衣袖未动，四周浪潮却自行分开。你无法看透他的修为。", rare: true, danger: 2, options: [
    { label: "立即远遁", effects: { time: 0.2, flee: 1, caution: 2 }, result: "你不惜耗损精血远遁百里，身后始终没有动静。" },
    { label: "隐藏修为静候", requires: { intel: 3 }, effects: { intel: 1, relation: 1 }, result: "那人淡淡看了你一眼，留下一个地名后便消失了。" },
    { label: "上前攀谈", effects: { hp: -18, wanted: 1 }, result: "一道神识落下，你如遭重击。幸而对方没有第二次出手。" },
  ]},
];

const HIDDEN_ARCHETYPES = [
  { title: "墨香中的第二层字", text: "你以绿液擦过残页，原先不可见的墨迹逐行浮现。这并非功法，而是一份仇家名单。", hidden: true, requires: { green: 1, intel: 3 }, options: [
    { label: "记下名单", effects: { intel: 4, chain: "ink-list", wanted: 1 }, result: "名单末尾，有一个你刚在坊市听过的名字。" },
    { label: "毁去残页", effects: { caution: 2, karma: 1 }, result: "火焰吞没墨迹。你不打算替死人接下因果。" },
  ]},
  { title: "噬金虫蜕变", text: "虫室一夜无声。天亮后，数十枚淡银色虫蜕铺在灵木上，新的口器已能咬动法器碎片。", hidden: true, requires: { insect: 1 }, options: [
    { label: "投入珍稀矿料", requires: { materials: 3 }, effects: { materials: -3, insect: 2, time: 2 }, result: "虫群陷入沉睡。再次醒来时，甲壳已有金属光泽。" },
    { label: "保持现状", effects: { insect: 1, time: 1 }, result: "稳妥培育虽慢，却不至于失控。" },
  ]},
];

const CHAIN_BLUEPRINTS = [
  { id: "rescued-wanderer", title: "旧日人情", flag: "relation", text: "多年后，你在拍卖场外再次见到当年溪边救下的修士。他已换了姓名，却仍认得你的气息。" },
  { id: "ink-list", title: "名单余波", flag: "chain", text: "一名黑衣人递来密信，只问你是否见过那份不该现世的名单。" },
  { id: "sect-hunt", title: "宗门追索", flag: "wanted", text: "坊市出口贴出追索令。画像并不准确，但悬赏足以让所有散修多看你一眼。" },
  { id: "insect-maturation", title: "虫群成势", flag: "insect", text: "封闭多年的虫室传来金铁摩擦之声。你知道，噬金虫群已可真正用于斗法。" },
  { id: "bottle-scent", title: "药香惹祸", flag: "herbs", text: "有人沿着极淡的药香找到了洞府外。对方没有破阵，只留下一枚传音符。" },
];

const clone = (value) => JSON.parse(JSON.stringify(value));

export function buildEventCorpus() {
  const normal = [];
  for (let i = 0; i < 300; i += 1) {
    const base = clone(NORMAL_ARCHETYPES[i % NORMAL_ARCHETYPES.length]);
    const region = REGIONS[i % REGIONS.length];
    const omen = OMENS[Math.floor(i / REGIONS.length) % OMENS.length];
    normal.push({ ...base, id: `normal-${i + 1}`, region, title: `${base.title} · ${omen}`, tier: Math.floor(i / 75), rarity: "normal" });
  }
  const rare = [];
  for (let i = 0; i < 100; i += 1) {
    const base = clone(RARE_ARCHETYPES[i % RARE_ARCHETYPES.length]);
    rare.push({ ...base, id: `rare-${i + 1}`, region: REGIONS[(i * 3) % REGIONS.length], tier: 1 + Math.floor(i / 34), rarity: "rare" });
  }
  const hidden = [];
  for (let i = 0; i < 50; i += 1) {
    const base = clone(HIDDEN_ARCHETYPES[i % HIDDEN_ARCHETYPES.length]);
    hidden.push({ ...base, id: `hidden-${i + 1}`, region: REGIONS[(i * 5) % REGIONS.length], tier: Math.floor(i / 12), rarity: "hidden" });
  }
  const chains = [];
  for (let i = 0; i < 50; i += 1) {
    const base = CHAIN_BLUEPRINTS[i % CHAIN_BLUEPRINTS.length];
    chains.push({
      id: `chain-${i + 1}`,
      chainId: `${base.id}-${Math.floor(i / CHAIN_BLUEPRINTS.length) + 1}`,
      region: REGIONS[(i * 7) % REGIONS.length],
      title: base.title,
      text: base.text,
      rarity: "chain",
      requires: { [base.flag]: 1 },
      options: [
        { label: "接下这段因果", effects: { intel: 2, karma: 1, stones: 5, time: 0.2 }, result: "有些因果避不开，只能把它变成手中的筹码。" },
        { label: "斩断线索离开", effects: { caution: 2, relation: -1 }, result: "你没有回头。身后的目光也渐渐消失。" },
      ],
    });
  }
  return { normal, rare, hidden, chains, all: [...normal, ...rare, ...hidden, ...chains] };
}

export const EVENT_COUNTS = { normal: 300, rare: 100, hidden: 50, chains: 50 };
