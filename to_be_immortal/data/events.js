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
  { title: "雾中石碑", text: "晨雾深处立着一方无字石碑。靠近时，耳边却响起断续的诵诀声，碑后还压着一截白骨。", options: [
    { label: "凝神辨听", requires: { mind: 2 }, effects: { mind: -1, cultivation: 6, time: 0.2 }, result: "诵诀并不完整，却替你解开了修炼中的一处滞涩。" },
    { label: "掘开碑后", effects: { materials: 2, hp: -3, karma: -1 }, result: "白骨下藏着一只破旧储物袋，也惊醒了盘踞石缝的毒蝎。" },
    { label: "拓下碑形离开", effects: { intel: 1, caution: 1 }, result: "碑上虽无字，拓印后却浮出三道极淡阵纹。" },
  ]},
  { title: "灵舟求渡", text: "河道被黑雾截断，一名撑青竹篙的老者停舟岸边。他不收凡俗钱财，只问你能拿出什么。", options: [
    { label: "付灵石渡河", requires: { stones: 4 }, effects: { stones: -4, time: 0.1, intel: 1 }, result: "老者一路无话，下船前却提醒你莫走北岸旧道。" },
    { label: "以情报交换", requires: { intel: 2 }, effects: { intel: -1, relation: 1, time: 0.1 }, result: "你说出坊市近闻，他也回赠了一条水府传言。" },
    { label: "沿河另寻浅滩", effects: { time: 0.5, caution: 1 }, result: "你多走了半日，回望时那条灵舟已经不见。" },
  ]},
  { title: "野店旧账", text: "荒岭小店只点着一盏油灯。掌柜认错了你的身份，低声问道：‘那批货，可曾送到？’", options: [
    { label: "顺势套话", requires: { intel: 1 }, effects: { intel: 2, wanted: 1 }, result: "你听出一条走私灵材的暗线，也被掌柜记住了声音。" },
    { label: "坦言认错人", effects: { relation: 1, time: 0.1 }, result: "掌柜盯了你许久，最终送上一壶热茶。" },
    { label: "立即离店", effects: { caution: 1 }, result: "你刚走出十里，身后山岭便亮起追杀用的传讯火。" },
  ]},
  { title: "山洪冲尸", text: "暴雨后的山涧冲下三具尸身，其中一人的手指仍死死扣着腰间玉盒。尸身上没有明显伤口。", options: [
    { label: "隔空取盒", requires: { mind: 2 }, effects: { mind: -1, materials: 2, risk: 1 }, result: "玉盒入手时，一缕几乎看不见的黑气缠上护体灵光。" },
    { label: "检查死因", effects: { intel: 2, time: 0.2 }, result: "三人的神识都被瞬间抹去，出手者绝非你能招惹。" },
    { label: "焚尸后离开", effects: { karma: 1, caution: 1, time: 0.1 }, result: "火光中，玉盒自行裂开，里面竟然空无一物。" },
  ]},
  { title: "宗门征召", text: "路口悬着宗门令旗，数名弟子正征召散修清剿妖物。报酬不低，但任务说明刻意略去了伤亡。", options: [
    { label: "先查伤亡名册", requires: { intel: 2 }, effects: { intel: 1, stones: 3, time: 0.3 }, result: "你发现前两批人无一返回，只接了外围巡查。" },
    { label: "加入主队", effects: { stones: 9, hp: -6, cultivation: 5, time: 0.5 }, result: "妖物比告示所写强得多，你带伤分到一份报酬。" },
    { label: "婉拒征召", effects: { caution: 1, relation: -1 }, result: "领队没有强留，只将你的样貌记入玉简。" },
  ]},
  { title: "地火裂隙", text: "地面裂开一道赤红细缝，热浪中夹着金石气息。几块罕见矿料就在火脉边缘，却随时可能沉落。", options: [
    { label: "以法器牵引", requires: { materials: 1 }, effects: { materials: 2, hp: -2, time: 0.2 }, result: "法器被灼出裂纹，好在带回了更珍贵的火精矿。" },
    { label: "布阵降温", requires: { stones: 6 }, effects: { stones: -6, materials: 4, time: 0.4 }, result: "阵盘撑住片刻，足够你取走火脉表层的矿料。" },
    { label: "等待裂隙闭合", effects: { cultivation: 3, time: 0.3 }, result: "你观摩地火流转，对火行灵力多了一分体悟。" },
  ]},
  { title: "被困幼兽", text: "一只尚未开灵的幼兽被捕兽索勒住后腿。附近没有猎人，树梢却挂着一枚监视用的铜铃。", options: [
    { label: "斩断捕兽索", effects: { karma: 1, relation: 1, time: 0.1 }, result: "幼兽钻入林中。远处铜铃轻响，有人知道你来过。" },
    { label: "追查布索之人", requires: { intel: 2 }, effects: { intel: 2, materials: 1, time: 0.3 }, result: "你找到一处弃营，猎人撤得仓促，留下了几件工具。" },
    { label: "不沾因果", effects: { caution: 1 }, result: "你绕开铜铃。身后很快传来成年妖兽的低吼。" },
  ]},
  { title: "空置洞府", text: "石门大开，洞府内桌椅整齐，丹炉尚温，却不见主人。墙上只写着一个‘归’字。", options: [
    { label: "检查丹炉", effects: { pill: 1, hp: -2, time: 0.1 }, result: "炉中余丹尚可服用，炉底却压着一根染血发簪。" },
    { label: "搜寻暗室", requires: { intel: 3 }, effects: { materials: 3, wanted: 1, time: 0.3 }, result: "暗室里堆着不属于同一人的储物袋。" },
    { label: "原样退出", effects: { caution: 2 }, result: "石门在你身后自行合拢，仿佛从未开启。" },
  ]},
  { title: "雷雨古木", text: "山巅古木每逢雷落便泛起淡青灵光。树下已有两名修士隔空对峙，谁都不愿先动。", options: [
    { label: "等他们争斗", effects: { time: 0.4, intel: 1, materials: 2 }, result: "两人斗法后各自退走，你只取了被雷劈落的枯枝。" },
    { label: "提出三分材料", requires: { relation: 2 }, effects: { materials: 3, relation: -1 }, result: "三方暂时达成约定，谁也没有完全收起戒心。" },
    { label: "趁雷遁走", effects: { flee: 1, caution: 1 }, result: "雷光遮住遁术，你没有为一截灵木赌上性命。" },
  ]},
  { title: "争斗余波", text: "前方斗法刚刚结束，地面剑痕仍在冒烟。胜者已走，败者的储物袋却故意留在原地。", options: [
    { label: "以神识远观", effects: { intel: 2, time: 0.1 }, result: "袋口连着一缕极细神识，胜者正在远处等人上钩。" },
    { label: "用傀儡取袋", requires: { stones: 3 }, effects: { stones: -3, materials: 2, risk: 1 }, result: "傀儡刚碰到储物袋，地下便窜出数道剑气。" },
    { label: "毁去诱饵", effects: { wanted: 1, caution: 1 }, result: "远处传来一声冷哼，你立刻转身远遁。" },
  ]},
  { title: "酒楼秘闻", text: "邻桌修士故意压低声音谈论秘境，内容却恰好能被你听清。他们说得太完整，反而像在等人相信。", options: [
    { label: "买下另一桌的消息", requires: { stones: 3 }, effects: { stones: -3, intel: 3 }, result: "两份情报互相矛盾，真正有价值的正是矛盾之处。" },
    { label: "假装动心离席", effects: { intel: 1, caution: 1 }, result: "果然有人跟出酒楼。你绕了三条街才甩开尾巴。" },
    { label: "当面拆穿", effects: { relation: -2, wanted: 1 }, result: "酒楼瞬间安静下来。你没有得到答案，只多了几双冷眼。" },
  ]},
  { title: "破损传送阵", text: "荒台上的传送阵只剩半边完好，中央还嵌着一枚失去光泽的灵石。阵纹指向何处，无人知晓。", options: [
    { label: "修补阵纹", requires: { materials: 3, intel: 2 }, effects: { materials: -3, intel: 2, time: 0.5, risk: 1 }, result: "阵台亮起一瞬，你看见了陌生海岛的残影。" },
    { label: "拆取阵盘", effects: { materials: 3, karma: -1 }, result: "阵法彻底报废，你得到几块尚能再用的阵盘。" },
    { label: "记录空间坐标", effects: { intel: 2, caution: 1, time: 0.2 }, result: "这些坐标现在无用，日后却未必如此。" },
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
  { title: "失落丹炉", text: "悬崖石窟中封着一座古丹炉，炉盖每隔片刻便自行震动。炉火早灭，药香却仍未散尽。", rare: true, options: [
    { label: "以神识开炉", requires: { mind: 3 }, effects: { mind: -2, pill: 2, intel: 2 }, result: "炉中丹药大半成灰，只余两枚仍有灵性。" },
    { label: "整炉带走", requires: { materials: 3 }, effects: { materials: -3, stones: 12, hp: -5 }, result: "封印破开时丹炉骤然缩小，也喷出一道积存多年的火毒。" },
    { label: "只拓印炉纹", effects: { intel: 3, caution: 1 }, result: "炉纹是一套失传控火法，你没有惊动炉中之物。" },
  ]},
  { title: "天雷灵木", text: "紫色雷光落在孤峰，焦黑树心中露出一线金青。此物尚未成熟，周围已有妖禽盘旋。", rare: true, options: [
    { label: "布阵取木", requires: { stones: 15, materials: 2 }, effects: { stones: -15, materials: 6, time: 0.5 }, result: "阵光替你挡住妖禽，你取下一截雷木便立刻撤走。" },
    { label: "引妖禽离巢", requires: { intel: 4 }, effects: { intel: -1, materials: 5, hp: -3 }, result: "计策奏效，但归巢的妖禽仍在最后一刻抓伤了你。" },
    { label: "记下成熟年份", effects: { intel: 2, caution: 2 }, result: "真正的机缘有时需要等上几十年。" },
  ]},
  { title: "化形妖修", text: "白衣女子独坐古亭，脚边却没有影子。她面前摆着两杯茶，像是早知你会来。", rare: true, danger: 2, options: [
    { label: "只谈交易", requires: { intel: 3 }, effects: { stones: -6, materials: 4, relation: 2 }, result: "交易公平得近乎反常。她提醒你，人族修士未必比妖更可信。" },
    { label: "饮下灵茶", effects: { cultivation: 12, hp: -6, time: 0.2 }, result: "茶中灵力猛烈冲刷经脉，你勉强承受下来。" },
    { label: "婉拒离开", effects: { caution: 2, flee: 1 }, result: "她没有阻拦，只在你走远后轻笑了一声。" },
  ]},
  { title: "大能残念", text: "古战场中央飘着一缕不散神念。它没有意识，只反复演化同一式神通，周围灵气因此扭曲。", rare: true, options: [
    { label: "冒险观摩", requires: { mind: 3 }, effects: { mind: -2, cultivation: 15, hp: -5, time: 0.5 }, result: "你只看懂一角，识海便已刺痛难忍。" },
    { label: "以玉简记录", requires: { materials: 2 }, effects: { materials: -2, intel: 4 }, result: "玉简很快布满裂纹，好在保住了一段神通轨迹。" },
    { label: "远离扭曲灵气", effects: { caution: 2 }, result: "有些东西看一眼便够了，贪多只会伤及根本。" },
  ]},
  { title: "虚空裂隙", text: "半空无声裂开一道细缝，缝隙另一端传来陌生灵气。几件残破器物正被空间乱流反复撕扯。", rare: true, danger: 2, options: [
    { label: "以法宝牵引", requires: { materials: 4 }, effects: { materials: 3, hp: -8, intel: 3 }, result: "你只拉回一块古宝残片，护体灵光已被空间之力割裂。" },
    { label: "推演坐标", requires: { intel: 5 }, effects: { intel: 3, cultivation: 8, time: 0.4 }, result: "裂隙闭合前，你记下了界面之力流动的规律。" },
    { label: "立刻退开", effects: { caution: 2, flee: 1 }, result: "片刻后，裂隙吞掉了附近整块山岩。" },
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
  { title: "封魂木盒", text: "木盒没有锁，盒盖上却压着七层神识封印。你曾在旧卷里见过：里面封的未必是宝物。", hidden: true, requires: { mind: 3, intel: 4 }, options: [
    { label: "逐层解封", effects: { mind: -2, intel: 3, card: "rare", wanted: 1 }, result: "盒中残魂换给你一段秘术，也把你的气息带去了远方。" },
    { label: "加固封印", effects: { materials: -1, caution: 3, karma: 1 }, requires: { materials: 1 }, result: "木盒重新归于沉寂。你没有追问盒中是谁。" },
  ]},
  { title: "银月旧梦", text: "月光照进洞府时，一道陌生女子的影子从镜面掠过。她似乎认识你手中的某件古物。", hidden: true, requires: { relation: 2, intel: 3 }, options: [
    { label: "以神识回应", effects: { mind: -1, relation: 3, intel: 2 }, result: "影子只说了一个地名，便随着月光一同消失。" },
    { label: "封住镜面", effects: { caution: 2 }, result: "镜面恢复平静，但那道目光似乎仍在别处注视。" },
  ]},
  { title: "第二神识", text: "修炼大衍诀时，你发现识海边缘多出一团不属于本体的微弱念头。它会回应，却没有情绪。", hidden: true, requires: { mind: 4, cultivation: 80 }, options: [
    { label: "分出神念温养", effects: { mind: -2, cultivation: 12, time: 2, chain: "second-mind" }, result: "这条路极慢，也极险，但第二道神识终于没有消散。" },
    { label: "立即斩去杂念", effects: { hp: -4, caution: 2 }, result: "识海剧痛数日，隐患却暂时消失。" },
  ]},
];

const CHAIN_BLUEPRINTS = [
  { id: "rescued-wanderer", title: "旧日人情", flag: "relation", text: "多年后，你在拍卖场外再次见到当年溪边救下的修士。他已换了姓名，却仍认得你的气息。" },
  { id: "ink-list", title: "名单余波", flag: "chain", text: "一名黑衣人递来密信，只问你是否见过那份不该现世的名单。" },
  { id: "sect-hunt", title: "宗门追索", flag: "wanted", text: "坊市出口贴出追索令。画像并不准确，但悬赏足以让所有散修多看你一眼。" },
  { id: "insect-maturation", title: "虫群成势", flag: "insect", text: "封闭多年的虫室传来金铁摩擦之声。你知道，噬金虫群已可真正用于斗法。" },
  { id: "bottle-scent", title: "药香惹祸", flag: "herbs", text: "有人沿着极淡的药香找到了洞府外。对方没有破阵，只留下一枚传音符。" },
  { id: "array-debt", title: "阵师索偿", flag: "materials", text: "一名阵师认出了你手中的旧阵盘。他不要灵石，只要你替他去一处不能见光的地方。" },
  { id: "cautious-shadow", title: "尾随之人", flag: "caution", text: "你连续三日改变路线，那道若有若无的气息仍在身后。对方显然也很擅长隐藏。" },
  { id: "green-rumor", title: "万年灵药传闻", flag: "green", text: "坊市开始流传某处出现万年灵药。描述中的药香，与你刚炼制的丹药太过相似。" },
  { id: "map-buyer", title: "旧图买主", flag: "intel", text: "有人开出高价收购你记录的秘境路线，并准确说出了其中一处只有你知道的岔路。" },
  { id: "karma-return", title: "旧债归来", flag: "karma", text: "当年被你放走的人没有来报恩，只送来一封警告：有人正在查你的来历。" },
];

const clone = (value) => JSON.parse(JSON.stringify(value));

export function buildEventCorpus() {
  const normal = [];
  for (let i = 0; i < 300; i += 1) {
    const regionIndex = i % REGIONS.length;
    const cycle = Math.floor(i / REGIONS.length);
    const base = clone(NORMAL_ARCHETYPES[(regionIndex * 5 + cycle * 7) % NORMAL_ARCHETYPES.length]);
    const region = REGIONS[i % REGIONS.length];
    const omen = OMENS[(cycle + regionIndex * 3) % OMENS.length];
    normal.push({ ...base, id: `normal-${i + 1}`, family: `normal:${base.title}`, region, title: `${base.title} · ${omen}`, tier: Math.floor(i / 100), rarity: "normal" });
  }
  const rare = [];
  for (let i = 0; i < 100; i += 1) {
    const regionIndex = i % REGIONS.length;
    const cycle = Math.floor(i / REGIONS.length);
    const base = clone(RARE_ARCHETYPES[(regionIndex * 3 + cycle * 5) % RARE_ARCHETYPES.length]);
    rare.push({ ...base, id: `rare-${i + 1}`, family: `rare:${base.title}`, region: REGIONS[regionIndex], tier: Math.floor(i / 40), rarity: "rare" });
  }
  const hidden = [];
  for (let i = 0; i < 50; i += 1) {
    const regionIndex = i % REGIONS.length;
    const cycle = Math.floor(i / REGIONS.length);
    const base = clone(HIDDEN_ARCHETYPES[(regionIndex * 2 + cycle) % HIDDEN_ARCHETYPES.length]);
    hidden.push({ ...base, id: `hidden-${i + 1}`, family: `hidden:${base.title}`, region: REGIONS[regionIndex], tier: Math.floor(i / 18), rarity: "hidden" });
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
      family: `chain:${base.id}`,
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
