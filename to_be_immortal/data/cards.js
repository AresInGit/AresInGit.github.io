export const CARDS = [
  { id: "slash", name: "御剑术", type: "法术", cost: 1, text: "造成 7 点伤害。", damage: 7, tags: ["剑诀"] },
  { id: "guard", name: "护体灵光", type: "法术", cost: 1, text: "获得 7 点护盾。", block: 7, tags: ["护体"] },
  { id: "fire", name: "火弹术", type: "法术", cost: 1, text: "造成 6 点伤害；目标灼伤时 +3。", damage: 6, burnBonus: 3, tags: ["火"] },
  { id: "breath", name: "吐纳术", type: "功法", cost: 0, text: "恢复 1 点灵力，获得 2 点修为。", energy: 1, cultivation: 2, tags: ["修炼"] },
  { id: "talisman", name: "金刚符", type: "符箓", cost: 1, text: "获得 10 点护盾，使用后消耗。", block: 10, exhaust: true, tags: ["符箓"] },
  { id: "needle", name: "无影针", type: "法器", cost: 1, text: "无视护盾，造成 8 点伤害。", damage: 8, pierce: true, tags: ["法器"] },
  { id: "sense", name: "神识刺", type: "秘术", cost: 1, mind: 1, text: "消耗 1 神识，造成 12 点伤害。", damage: 12, tags: ["神识"] },
  { id: "step", name: "罗烟步", type: "身法", cost: 1, text: "获得 5 护盾；本回合逃遁率 +25%。", block: 5, flee: 25, tags: ["苟道"] },
  { id: "formation", name: "颠倒五行阵", type: "阵法", cost: 2, text: "获得 12 护盾，下回合额外回复 1 灵力。", block: 12, nextEnergy: 1, tags: ["阵法"] },
  { id: "puppet", name: "甲士傀儡", type: "傀儡", cost: 1, stones: 2, text: "消耗 2 灵石，造成 13 点伤害。", damage: 13, tags: ["傀儡"] },
  { id: "insects", name: "噬金虫群", type: "灵兽", cost: 2, text: "造成 4×3 点伤害；每次培养 +1。", multi: 3, damage: 4, tags: ["虫修"] },
  { id: "fan", name: "三焰扇", type: "法宝", cost: 3, text: "造成 28 点伤害，进入 2 回合冷却。", damage: 28, cooldown: 2, tags: ["法宝"] },
  { id: "wings", name: "风雷翅", type: "法宝", cost: 1, text: "获得 9 护盾；逃遁必定成功。", block: 9, flee: 100, tags: ["苟道", "法宝"] },
  { id: "sword-array", name: "青竹蜂云剑阵", type: "法宝", cost: 3, text: "造成 6×5 点剑气伤害。", damage: 6, multi: 5, tags: ["剑诀", "法宝"] },
  { id: "body", name: "明王诀", type: "功法", cost: 2, text: "获得 16 护盾，反震 4 点伤害。", block: 16, thorns: 4, tags: ["炼体"] },
  { id: "bottle-drop", name: "青露入药", type: "丹药", cost: 0, text: "恢复 8 生命，使用后消耗。", heal: 8, exhaust: true, tags: ["丹药"] },
];

export const STARTER_DECK = ["slash", "slash", "slash", "guard", "guard", "guard", "fire", "breath", "step", "talisman"];

export const getCard = (id) => CARDS.find((card) => card.id === id) ?? CARDS[0];
