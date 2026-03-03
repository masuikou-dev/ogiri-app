// improved random prompt generator with typed templates and categories

// word categories for slots
export type Category =
  | "person"
  | "animal"
  | "creature"
  | "concept"
  | "object"
  | "emotion"
  | "absurdSituation"
  | "badTrait"
  | "secret"
  | "power";

const wordPools: Record<Category, string[]> = {
  person: ["校長先生", "先生", "部長", "忍者", "ロボット", "宇宙人", "大統領", "アナウンサー"],
  animal: ["犬", "猫", "ライオン", "パンダ", "ゾウ", "カバ", "カンガルー"],
  creature: ["幽霊", "妖精", "ドラゴン", "怪獣", "ゴーレム"],
  concept: ["愛", "勇気", "時間", "平和", "未来", "秘密"],
  object: ["AI", "スマホ", "本", "車", "飛行機", "トースター"],
  emotion: ["嬉しい", "悲しい", "怒っている", "呆れている", "恥ずかしい"],
  absurdSituation: ["海でスーツ", "逆立ちで歩く", "昼寝中に電話", "雨の中で傘をささない"],
  badTrait: ["嘘つき", "せっかち", "冷たい", "計算高い"],
  secret: ["裏切り者", "二重生活", "実は宇宙人", "隠し財産"],
  power: ["透明人間", "念力", "瞬間移動", "時間停止"],
};

// themes used for prompt and for random theme selection
const themes = [
  "学校",
  "職場",
  "ホラー",
  "SF",
  "日常",
  "ファンタジー",
  "スポーツ",
  "動物",
  "旅行",
  "料理",
];

// template type with slots specifying categories
export interface Template {
  text: string; // contains slot names like {slotA}, {slotB}
  slots: Record<string, Category>;
  allowedThemes?: string[]; // if provided, theme is picked from this list
}

const templates: Template[] = [
  { text: "もし{slotA}が{slotB}だったら？", slots: { slotA: "person", slotB: "creature" }, allowedThemes: ["学校","ホラー","ファンタジー"] },
  { text: "{slotA}が言いそうな一言", slots: { slotA: "person" } },
  { text: "絶対に{slotA}してはいけない{slotB}", slots: { slotA: "concept", slotB: "object" }, allowedThemes: ["SF","日常","ホラー"] },
  { text: "{slotA}に新機能が追加されました。それは？", slots: { slotA: "object" }, allowedThemes: ["SF","学校","職場"] },
  { text: "{slotA}のキャッチコピーを考えてください", slots: { slotA: "object" }, allowedThemes: ["旅行","料理","スポーツ"] },
  { text: "実は{slotA}は{slotB}だった", slots: { slotA: "animal", slotB: "creature" }, allowedThemes: ["ホラー","ファンタジー"] },
  { text: "ダメな{slotA}の特徴", slots: { slotA: "person" } },
  { text: "こんな{slotA}は嫌だ", slots: { slotA: "person" } },
  { text: "{slotA}と{slotB}が逆になった世界", slots: { slotA: "person", slotB: "animal" }, allowedThemes: ["SF","ファンタジー"] },
  { text: "この後の一言を考えてください：\n「{slotA}」", slots: { slotA: "person" } },  // multi-slot templates (3+ slots)
  {
    text: "もし{slotA}が{slotB}したら{slotC}になる？",
    slots: { slotA: "person", slotB: "concept", slotC: "absurdSituation" },
    allowedThemes: ["SF", "ファンタジー", "ホラー"],
  },
  {
    text: "{slotA}と{slotB}が{slotC}で大混乱",
    slots: { slotA: "person", slotB: "animal", slotC: "absurdSituation" },
  },
  {
    text: "伝説の{slotA}が{slotB}、{slotC}、そして{slotD}を手に入れた",
    slots: { slotA: "creature", slotB: "object", slotC: "power", slotD: "emotion" },
    allowedThemes: ["ファンタジー", "ホラー", "SF"],
  },
  {
    text: "お前の{slotA}に{slotB}が{slotC}して{slotD}する",
    slots: { slotA: "secret", slotB: "badTrait", slotC: "object", slotD: "emotion" },
  },];

function pickOne<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function pickWord(category: Category): string {
  const pool = wordPools[category];
  if (!pool || pool.length === 0) return "";
  return pickOne(pool);
}

// distance between categories (0=very similar,1=very far)
const categoryDistance: Record<Category, Record<Category, number>> = {
  person: { person: 0, animal: 0.3, creature: 0.7, concept: 0.8, object: 0.5, emotion: 0.6, absurdSituation: 0.9, badTrait: 0.4, secret: 0.6, power: 0.2 },
  animal: { person: 0.3, animal: 0, creature: 0.5, concept: 0.4, object: 0.6, emotion: 0.5, absurdSituation: 0.7, badTrait: 0.3, secret: 0.6, power: 0.5 },
  creature: { person: 0.7, animal: 0.5, creature: 0, concept: 0.6, object: 0.6, emotion: 0.7, absurdSituation: 0.8, badTrait: 0.5, secret: 0.7, power: 0.6 },
  concept: { person: 0.8, animal: 0.4, creature: 0.6, concept: 0, object: 0.5, emotion: 0.6, absurdSituation: 0.9, badTrait: 0.2, secret: 0.7, power: 0.3 },
  object: { person: 0.5, animal: 0.6, creature: 0.6, concept: 0.5, object: 0, emotion: 0.4, absurdSituation: 0.7, badTrait: 0.3, secret: 0.5, power: 0.4 },
  emotion: { person: 0.6, animal: 0.5, creature: 0.7, concept: 0.6, object: 0.4, emotion: 0, absurdSituation: 0.8, badTrait: 0.3, secret: 0.6, power: 0.2 },
  absurdSituation: { person: 0.9, animal: 0.7, creature: 0.8, concept: 0.9, object: 0.7, emotion: 0.8, absurdSituation: 0, badTrait: 0.6, secret: 0.8, power: 0.7 },
  badTrait: { person: 0.4, animal: 0.3, creature: 0.5, concept: 0.2, object: 0.3, emotion: 0.3, absurdSituation: 0.6, badTrait: 0, secret: 0.4, power: 0.2 },
  secret: { person: 0.6, animal: 0.6, creature: 0.7, concept: 0.7, object: 0.5, emotion: 0.6, absurdSituation: 0.8, badTrait: 0.4, secret: 0, power: 0.5 },
  power: { person: 0.2, animal: 0.5, creature: 0.6, concept: 0.3, object: 0.4, emotion: 0.2, absurdSituation: 0.7, badTrait: 0.2, secret: 0.5, power: 0 },
};

function fillTemplate(tmpl: Template): string {
  let chosen: Record<string, string>;
  const slots = Object.keys(tmpl.slots);
  // loosen threshold to allow more combinations, but still avoid exact matches
  const MIN_DIST = 0.2;
  const MAX_ATTEMPTS = 100; // safety guard in case the gap condition cannot be satisfied
  let attempts = 0;

  do {
    chosen = {} as any;
    for (const slot of slots) {
      chosen[slot] = pickWord(tmpl.slots[slot]);
    }
    attempts++;
    if (attempts > MAX_ATTEMPTS) {
      // give up and accept whatever we got to avoid hanging
      break;
    }
  } while (!checkGap(slots, tmpl.slots, chosen, MIN_DIST));

  let text = tmpl.text;
  for (const slot of slots) {
    text = text.replace(new RegExp(`\\{${slot}\\}`, "g"), chosen[slot]);
  }
  return text;
}

function checkGap(
  slots: string[],
  slotCats: Record<string, Category>,
  chosen: Record<string, string>,
  min: number
) {
  for (let i = 0; i < slots.length; i++) {
    for (let j = i + 1; j < slots.length; j++) {
      const catA = slotCats[slots[i]];
      const catB = slotCats[slots[j]];
      const dist = categoryDistance[catA][catB];
      if (dist < min) return false;
      // also if same word chosen reduce distance
      if (chosen[slots[i]] === chosen[slots[j]]) return false;
    }
  }
  return true;
}

export function generatePrompt() {
  const tmpl = pickOne(templates);
  // choose theme from allowed list if present
  const themePool = tmpl.allowedThemes ? tmpl.allowedThemes : themes;
  const theme = pickOne(themePool);
  const text = fillTemplate(tmpl);
  return { text, theme };
}
