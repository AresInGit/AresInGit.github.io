export const CHAPTERS = [
  { id: "mortal", name: "凡人江湖", location: "青牛镇 · 七玄门", realm: 0, goal: 9 },
  { id: "huangfeng", name: "黄枫谷", location: "太南山 · 黄枫谷", realm: 1, goal: 14 },
  { id: "starsea", name: "乱星海", location: "魁星岛 · 外星海", realm: 2, goal: 18 },
  { id: "tiannan", name: "重返天南", location: "落云宗 · 坠魔谷", realm: 3, goal: 22 },
  { id: "dajin", name: "大晋风云", location: "昆吾山", realm: 3, goal: 27 },
  { id: "ascend", name: "化神之路", location: "空间节点", realm: 4, goal: 32 },
];

export const REALMS = [
  { name: "炼气期", lifespan: 105, stages: ["一层", "三层", "六层", "九层", "十三层"], need: 60 },
  { name: "筑基期", lifespan: 235, stages: ["初期", "中期", "后期", "大圆满"], need: 160 },
  { name: "结丹期", lifespan: 520, stages: ["初期", "中期", "后期", "大圆满"], need: 350 },
  { name: "元婴期", lifespan: 1050, stages: ["初期", "中期", "后期", "大圆满"], need: 720 },
  { name: "化神期", lifespan: 2100, stages: ["初期", "中期", "后期"], need: 1250 },
];

export const TALENTS = [
  { id: "cautious", name: "慎之又慎", text: "危险判断更准确，逃遁成功率提高。", effect: "flee" },
  { id: "bottle", name: "瓶中青露", text: "掌天瓶积蓄绿液略快，灵药更易成材。", effect: "bottle" },
  { id: "sword", name: "剑心微明", text: "剑诀牌首次命中时额外造成伤害。", effect: "sword" },
  { id: "mind", name: "神识坚韧", text: "夺舍与心魔事件更易渡过。", effect: "mind" },
  { id: "poor", name: "伪灵根", text: "修炼稍慢，但稀有机缘权重提高。", effect: "luck" },
  { id: "calamity", name: "天妒英才", text: "突破风险更高；若渡过大劫，所得感悟翻倍。", effect: "hard" },
];

export const ENDINGS = {
  ascended: {
    title: "飞升灵界",
    text: "茫茫虚空之中，一道空间裂缝缓缓闭合。人界的一切，已在身后。",
  },
  dead: { title: "道途已断", text: "修仙路远，机缘与劫数从不由人。" },
};
