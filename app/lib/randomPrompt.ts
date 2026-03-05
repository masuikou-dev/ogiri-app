// improved random prompt generator with extended categories and grammar-aware templates

// word categories for slots - expanded and grammar-aware
export type Category =
  | "person"           // 人物（一般）
  | "occupation"       // 職業
  | "animal"           // 動物
  | "creature"         // 架空の生き物
  | "object"           // 日用品・物体
  | "product"          // 製品・サービス
  | "technology"       // テクノロジー
  | "organization"     // 企業・団体
  | "concept"          // 概念
  | "adjective"        // 形容詞
  | "emotion"          // 感情
  | "action"           // 動作・行為
  | "situation"        // 状況・シーン
  | "trait"            // 特性・性質
  | "ability"          // 能力
  | "place"            // 場所
  | "event"            // イベント・出来事
  | "mistake"          // 失敗・ミス
  | "secret";          // 秘密・裏側

const wordPools: Record<Category, string[]> = {
  person: [
    "校長先生", "先生", "サラリーマン", "OL", "学生", "ニート", "SNS influencer",
    "ホームレス", "セレブ", "YouTuber", "プログラマー", "営業マン", "マネージャー",
    "アイドル", "モデル", "お笑い芸人", "歌手", "俳優", "監督", "脚本家",
    "父親", "母親", "兄弟", "友人", "恋人", "上司", "部下", "同僚", "ライバル",
    "詐欺師", "刑事", "弁護士", "医者", "看護師", "農家", "職人", "大統領", "アナウンサー",
  ],
  occupation: [
    "営業", "企画", "経理", "人事", "法務", "警察官", "消防士", "自衛隊",
    "店員", "料理人", "美容師", "建築家", "エンジニア", "デザイナー",
    "記者", "編集者", "カメラマン", "音楽プロデューサー", "映画製作者",
  ],
  animal: [
    "犬", "猫", "ライオン", "パンダ", "ゾウ", "カバ", "カンガルー",
    "猿", "ワニ", "ペンギン", "ウサギ", "羊", "牛", "豚", "鶏", "馬",
    "キツネ", "熊", "シマウマ", "キリン", "サイ", "ダチョウ", "フラミンゴ",
    "イルカ", "シャチ", "クジラ", "カエル", "トカゲ", "ヘビ", "ハムスター", "インコ",
  ],
  creature: [
    "幽霊", "妖精", "ドラゴン", "怪獣", "ゴーレム", "ミイラ", "フランケンシュタイン",
    "ゾンビ", "吸血鬼", "狼男", "エイリエン", "UFO", "神様", "悪魔", "天使",
    "モンスター", "大怪獣", "小鬼", "巨人", "侍", "忍者", "魔女", "魔法使い",
  ],
  object: [
    "スマホ", "パソコン", "ラップトップ", "タブレット", "イヤホン", "スピーカー",
    "テレビ", "冷蔵庫", "洗濯機", "電子レンジ", "トースター", "掃除機", "扇風機",
    "照明", "時計", "カメラ", "プリンタ", "ゲーム機", "コンソール",
    "本", "ノート", "ペン", "鉛筆", "消しゴム", "定規", "はさみ", "テープ",
    "バッグ", "靴", "帽子", "眼鏡", "腕時計", "ネックレス", "指輪", "アクセサリー",
    "カップ", "お皿", "フォーク", "スプーン", "ナイフ", "箸", "鍋", "フライパン",
    "枕", "布団", "カーテン", "ドア", "パイプ", "机", "椅子", "ベッド", "ソファ",
    "車", "バイク", "自転車", "スケートボード", "ローラースケート", "キックボード",
    "トイレ", "浴槽", "シャワー", "洗面台", "鏡", "歯ブラシ",
  ],
  product: [
    "iPhone", "Android", "Xbox", "PlayStation", "Nintendo Switch", "MacBook",
    "Windows PC", "iPad", "Fire Tablet", "Kindle", "AirPods", "Google Pixel",
    "Galaxy", "Dyson", "ダイソン掃除機", "Tesla", "トヨタプリウス", "Uber",
    "Amazon Prime", "Netflix", "Disney+", "ChatGPT", "Github Copilot",
  ],
  technology: [
    "AI", "機械学習", "ブロックチェーン", "NFT", "メタバース", "AR", "VR",
    "クラウド", "サーバー", "データベース", "API", "プロトコル", "アルゴリズム",
    "セキュリティ", "暗号化", "バイオメトリクス", "IoT", "5G", "量子コンピュータ",
    "チャットGPT", "画像生成AI", "音声認識", "自動運転", "ロボット工学",
  ],
  organization: [
    "Google", "Apple", "Microsoft", "Amazon", "Meta", "Tesla", "Twitter",
    "TikTok", "Instagram", "YouTube", "Netflix", "Disney", "Sony", "Nintendo",
    "Toyota", "Honda", "Nissan", "Panasonic", "Sharp", "NHK", "日本銀行",
    "警察庁", "防衛省", "内閣府", "外務省",
  ],
  concept: [
    "愛", "勇気", "時間", "平和", "未来", "秘密", "自由", "正義", "真実",
    "信頼", "名誉", "栄光", "幸福", "成功", "失敗", "死", "人生", "運命",
    "カルマ", "宿命", "矛盾", "パラドックス", "相対性", "無限", "永遠",
  ],
  adjective: [
    "嬉しい", "悲しい", "怒っている", "呆れている", "恥ずかしい", "不安な", "幸せな",
    "悔しい", "気持ち悪い", "素晴らしい", "最悪な", "ひどい", "良い", "悪い",
    "美しい", "醜い", "優雅な", "粗雑な", "上品な", "下品な", "清潔な", "汚い",
    "温かい", "冷たい", "熱い", "涼しい", "明るい", "暗い", "大きな", "小さな",
    "太った", "痩せた", "賢い", "阿呆な", "勇敢な", "臆病な", "親切な", "意地悪な",
  ],
  emotion: [
    "喜び", "悲しみ", "怒り", "恐怖", "驚き", "厭悪感", "羨望", "嫉妬",
    "絶望", "希望", "不安", "安堵", "興奮", "退屈", "虚無感", "充足感",
  ],
  action: [
    "走る", "歩く", "跳ぶ", "飛ぶ", "泳ぐ", "踊る", "笑う", "泣く", "叫ぶ",
    "食べる", "飲む", "寝る", "起きる", "働く", "勉強する", "遊ぶ", "戦う",
    "助ける", "傷つける", "信じる", "疑う", "愛する", "憎む", "祈る", "呪う",
    "壊す", "修理する", "作る", "描く", "書く", "読む", "聞く", "見る",
  ],
  situation: [
    "学校", "職場", "図書館", "図書館", "病院", "裁判所", "警察署", "監獄",
    "電車", "飛行機", "駅", "空港", "ホテル", "レストラン", "カフェ", "居酒屋",
    "公園", "ビーチ", "山頂", "地下洞窟", "宇宙", "地獄", "天国",
    "結婚式", "葬式", "告発会見", "裁判", "逮捕劇", "テロ", "戦争", "平和条約",
  ],
  trait: [
    "嘘つき", "せっかち", "冷たい", "計算高い", "ナルシスト", "偽善者",
    "完璧主義者", "怠け者", "心配性", "楽観的", "悲観的", "頑固", "柔軟",
    "社交的", "内向的", "優柔不断", "決断力がある", "論理的", "感情的",
  ],
  ability: [
    "透明人間", "念力", "瞬間移動", "時間停止", "飛行能力", "怪力",
    "火を出す", "氷を操る", "風を操る", "催眠", "テレパシー", "予知能力",
    "姿を変える", "物を分身させる", "時間逆行", "パラレルワールド移動",
  ],
  place: [
    "学校", "企業", "工場", "農場", "森", "砂漠", "海", "山", "火山",
    "洞窟", "遺跡", "神社", "寺", "教会", "病院", "警察", "空港", "駅",
    "繁華街", "貧困街", "郊外", "田舎", "都会", "地下街",
  ],
  event: [
    "告発", "スキャンダル", "不倫", "裏切り", "逮捕", "警察沙汰", "訴訟",
    "炎上", "バズ", "大失敗", "大成功", "倒産", "M&A", "合併", "分裂",
    "結婚", "離婚", "妊娠", "出産", "死亡", "引越し", "転職", "クビ",
  ],
  mistake: [
    "誤字脱字", "計算ミス", "寝坊", "遅刻", "無断欠勤", "メール誤送信",
    "データ消失", "システムダウン", "セキュリティ漏洩", "個人情報流出",
    "ハラスメント", "いじめ", "パワハラ", "セクハラ", "過労死", "ストレス",
  ],
  secret: [
    "裏切り", "二重生活", "実は宇宙人", "隠し財産", "隠し子", "過去の犯罪",
    "整形履歴", "借金", "ギャンブル癖", "浮気相手", "詐欺師", "スパイ",
    "本当の年齢", "本当の正体", "真の目的", "隠された真実",
  ],
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
  "恋愛",
  "お金",
  "健康",
  "芸能",
  "政治",
  "社会",
];

// template type with slots specifying categories
export interface Template {
  text: string; // contains slot names like {slotA}, {slotB}
  slots: Record<string, Category>;
  allowedThemes?: string[]; // if provided, theme is picked from this list
}

const templates: Template[] = [
  { text: "こんな{slotA}は嫌だ", slots: { slotA: "person" } },
  { text: "ダメな{slotA}の特徴", slots: { slotA: "person" } },
  { text: "絶対に{slotA}してはいけない{slotB}", slots: { slotA: "concept", slotB: "object" } },
  { text: "{slotA}に新機能が追加されました。それは？", slots: { slotA: "object" }, allowedThemes: ["SF","学校","職場"] },
  { text: "{slotA}のキャッチコピーを考えてください", slots: { slotA: "object" }, allowedThemes: ["旅行","料理","スポーツ"] },
  { text: "実は{slotA}は{slotB}だった", slots: { slotA: "animal", slotB: "creature" }, allowedThemes: ["ホラー","ファンタジー"] },
  { text: "ダメな{slotA}の特徴", slots: { slotA: "person" } },
  { text: "こんな{slotA}は嫌だ", slots: { slotA: "person" } },
  { text: "{slotA}と{slotB}が逆になった世界", slots: { slotA: "person", slotB: "animal" }, allowedThemes: ["SF","ファンタジー"] },
  
    { text: "こんな{slotA}はすぐクビ", slots: { slotA: "occupation" } },

  { text: "こんな{slotA}は信用できない", slots: { slotA: "person" } },

  { text: "こんな{slotA}はモテない", slots: { slotA: "person" } },

  { text: "{slotA}が炎上した理由", slots: { slotA: "person" } },

  { text: "{slotA}の黒歴史", slots: { slotA: "person" } },

  { text: "{slotA}の裏バイト", slots: { slotA: "person" } },

  { text: "{slotA}の弱点", slots: { slotA: "creature" } },

  { text: "{slotA}が絶対に言わない一言", slots: { slotA: "person" } },

  { text: "{slotA}がクビになった理由", slots: { slotA: "occupation" } },

  { text: "{slotA}の意味不明なルール", slots: { slotA: "organization" } },

  { text: "{slotA}の恥ずかしい秘密", slots: { slotA: "person" } },

  { text: "{slotA}のやらかし", slots: { slotA: "person" } },

  { text: "{slotA}のレビュー★1の理由", slots: { slotA: "product" } },

  { text: "{slotA}のクレーム内容", slots: { slotA: "product" } },

  { text: "{slotA}の間違った使い方", slots: { slotA: "object" } },

  { text: "{slotA}の新しい使い道", slots: { slotA: "object" } },

  { text: "{slotA}の説明書に書いてある注意書き", slots: { slotA: "product" } },

  { text: "{slotA}のキャッチコピー", slots: { slotA: "product" } },

  { text: "{slotA}の公式発表", slots: { slotA: "organization" } },

  { text: "{slotA}の謝罪会見", slots: { slotA: "person" } },

  { text: "{slotA}の不祥事", slots: { slotA: "organization" } },

  { text: "{slotA}が{slotB}した結果", slots: { slotA: "person", slotB: "mistake" } },

  { text: "{slotA}が{slotB}で炎上", slots: { slotA: "person", slotB: "mistake" } },

  { text: "{slotA}が{slotB}して大混乱", slots: { slotA: "animal", slotB: "action" } },

  { text: "{slotA}が{slotB}を覚えた", slots: { slotA: "animal", slotB: "ability" } },

  { text: "{slotA}が{slotB}を始めた理由", slots: { slotA: "person", slotB: "action" } },

  { text: "{slotA}なのに{slotB}", slots: { slotA: "person", slotB: "trait" } },

  { text: "{slotA}なのに誰も驚かない理由", slots: { slotA: "creature" } },

  { text: "{slotA}なのに人気がない理由", slots: { slotA: "person" } },

  { text: "{slotA}の間違った進化", slots: { slotA: "animal" } },

  { text: "{slotA}の意外な特技", slots: { slotA: "person" } },

  { text: "{slotA}の隠された能力", slots: { slotA: "person" } },

  { text: "{slotA}が実は{slotB}だった", slots: { slotA: "person", slotB: "creature" } },

  { text: "{slotA}と{slotB}が入れ替わった世界", slots: { slotA: "person", slotB: "animal" } },

  { text: "{slotA}が{slotB}を支配する世界", slots: { slotA: "animal", slotB: "person" } },

  { text: "{slotA}が{slotB}に就職した理由", slots: { slotA: "animal", slotB: "organization" } },

  { text: "{slotA}が{slotB}を買収", slots: { slotA: "organization", slotB: "organization" } },

  { text: "{slotA}が{slotB}とコラボ", slots: { slotA: "product", slotB: "product" } },

  { text: "{slotA}の新サービス", slots: { slotA: "organization" } },

  { text: "{slotA}のヤバい新機能", slots: { slotA: "technology" } },

  { text: "{slotA}が世界を支配したら", slots: { slotA: "technology" } },

  { text: "{slotA}が暴走した結果", slots: { slotA: "technology" } },

  { text: "{slotA}が{slotB}した世界", slots: { slotA: "technology", slotB: "action" } },

  { text: "{slotA}のバグ", slots: { slotA: "technology" } },

  { text: "{slotA}がバグった結果", slots: { slotA: "technology" } },

  { text: "{slotA}の意味不明な仕様", slots: { slotA: "technology" } },

  { text: "{slotA}が{slotB}で大炎上", slots: { slotA: "organization", slotB: "event" } },

  { text: "{slotA}の隠された真実", slots: { slotA: "organization" } },

  { text: "{slotA}の都市伝説", slots: { slotA: "place" } },

  { text: "{slotA}で起きた事件", slots: { slotA: "place" } },

  { text: "{slotA}で絶対やってはいけないこと", slots: { slotA: "place" } },

  { text: "{slotA}の裏ルール", slots: { slotA: "place" } },

  { text: "{slotA}の危険な遊び方", slots: { slotA: "object" } },

  { text: "{slotA}の危険な使い方", slots: { slotA: "product" } },
];
  

function pickOne<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function pickWord(category: Category): string {
  const pool = wordPools[category];
  if (!pool || pool.length === 0) return "";
  return pickOne(pool);
}

// distance between categories (0=very similar, 1=very far) - extended for new categories
const categoryDistance: Record<Category, Record<Category, number>> = {
  person: { person: 0, occupation: 0.2, animal: 0.4, creature: 0.8, object: 0.6, product: 0.6, technology: 0.7, organization: 0.5, concept: 0.8, adjective: 0.5, emotion: 0.6, action: 0.5, situation: 0.7, trait: 0.3, ability: 0.9, place: 0.7, event: 0.6, mistake: 0.5, secret: 0.4 },
  occupation: { person: 0.2, occupation: 0, animal: 0.5, creature: 0.8, object: 0.6, product: 0.6, technology: 0.7, organization: 0.3, concept: 0.8, adjective: 0.5, emotion: 0.6, action: 0.4, situation: 0.6, trait: 0.4, ability: 0.9, place: 0.6, event: 0.5, mistake: 0.4, secret: 0.4 },
  animal: { person: 0.4, occupation: 0.5, animal: 0, creature: 0.5, object: 0.7, product: 0.7, technology: 0.8, organization: 0.8, concept: 0.8, adjective: 0.6, emotion: 0.6, action: 0.5, situation: 0.7, trait: 0.5, ability: 0.8, place: 0.7, event: 0.6, mistake: 0.6, secret: 0.7 },
  creature: { person: 0.8, occupation: 0.8, animal: 0.5, creature: 0, object: 0.7, product: 0.8, technology: 0.9, organization: 0.9, concept: 0.7, adjective: 0.6, emotion: 0.6, action: 0.5, situation: 0.8, trait: 0.6, ability: 0.9, place: 0.8, event: 0.7, mistake: 0.7, secret: 0.6 },
  object: { person: 0.6, occupation: 0.6, animal: 0.7, creature: 0.7, object: 0, product: 0.2, technology: 0.5, organization: 0.7, concept: 0.7, adjective: 0.6, emotion: 0.5, action: 0.6, situation: 0.6, trait: 0.6, ability: 0.8, place: 0.7, event: 0.6, mistake: 0.6, secret: 0.6 },
  product: { person: 0.6, occupation: 0.6, animal: 0.7, creature: 0.8, object: 0.2, product: 0, technology: 0.4, organization: 0.5, concept: 0.7, adjective: 0.6, emotion: 0.5, action: 0.6, situation: 0.6, trait: 0.6, ability: 0.8, place: 0.7, event: 0.6, mistake: 0.5, secret: 0.6 },
  technology: { person: 0.7, occupation: 0.7, animal: 0.8, creature: 0.9, object: 0.5, product: 0.4, technology: 0, organization: 0.5, concept: 0.8, adjective: 0.6, emotion: 0.7, action: 0.6, situation: 0.7, trait: 0.7, ability: 0.7, place: 0.8, event: 0.6, mistake: 0.6, secret: 0.7 },
  organization: { person: 0.5, occupation: 0.3, animal: 0.8, creature: 0.9, object: 0.7, product: 0.5, technology: 0.5, organization: 0, concept: 0.7, adjective: 0.6, emotion: 0.6, action: 0.6, situation: 0.6, trait: 0.6, ability: 0.9, place: 0.6, event: 0.5, mistake: 0.5, secret: 0.6 },
  concept: { person: 0.8, occupation: 0.8, animal: 0.8, creature: 0.7, object: 0.7, product: 0.7, technology: 0.8, organization: 0.7, concept: 0, adjective: 0.6, emotion: 0.6, action: 0.7, situation: 0.8, trait: 0.5, ability: 0.6, place: 0.8, event: 0.7, mistake: 0.7, secret: 0.6 },
  adjective: { person: 0.5, occupation: 0.5, animal: 0.6, creature: 0.6, object: 0.6, product: 0.6, technology: 0.6, organization: 0.6, concept: 0.6, adjective: 0, emotion: 0.4, action: 0.5, situation: 0.6, trait: 0.3, ability: 0.7, place: 0.6, event: 0.5, mistake: 0.5, secret: 0.5 },
  emotion: { person: 0.6, occupation: 0.6, animal: 0.6, creature: 0.6, object: 0.5, product: 0.5, technology: 0.7, organization: 0.6, concept: 0.6, adjective: 0.4, emotion: 0, action: 0.5, situation: 0.6, trait: 0.4, ability: 0.6, place: 0.6, event: 0.5, mistake: 0.4, secret: 0.5 },
  action: { person: 0.5, occupation: 0.4, animal: 0.5, creature: 0.5, object: 0.6, product: 0.6, technology: 0.6, organization: 0.6, concept: 0.7, adjective: 0.5, emotion: 0.5, action: 0, situation: 0.5, trait: 0.4, ability: 0.6, place: 0.6, event: 0.5, mistake: 0.4, secret: 0.5 },
  situation: { person: 0.7, occupation: 0.6, animal: 0.7, creature: 0.8, object: 0.6, product: 0.6, technology: 0.7, organization: 0.6, concept: 0.8, adjective: 0.6, emotion: 0.6, action: 0.5, situation: 0, trait: 0.6, ability: 0.7, place: 0.5, event: 0.4, mistake: 0.5, secret: 0.6 },
  trait: { person: 0.3, occupation: 0.4, animal: 0.5, creature: 0.6, object: 0.6, product: 0.6, technology: 0.7, organization: 0.6, concept: 0.5, adjective: 0.3, emotion: 0.4, action: 0.4, situation: 0.6, trait: 0, ability: 0.6, place: 0.6, event: 0.5, mistake: 0.4, secret: 0.3 },
  ability: { person: 0.9, occupation: 0.9, animal: 0.8, creature: 0.9, object: 0.8, product: 0.8, technology: 0.7, organization: 0.9, concept: 0.6, adjective: 0.7, emotion: 0.6, action: 0.6, situation: 0.7, trait: 0.6, ability: 0, place: 0.8, event: 0.7, mistake: 0.7, secret: 0.8 },
  place: { person: 0.7, occupation: 0.6, animal: 0.7, creature: 0.8, object: 0.7, product: 0.7, technology: 0.8, organization: 0.6, concept: 0.8, adjective: 0.6, emotion: 0.6, action: 0.6, situation: 0.5, trait: 0.6, ability: 0.8, place: 0, event: 0.4, mistake: 0.5, secret: 0.6 },
  event: { person: 0.6, occupation: 0.5, animal: 0.6, creature: 0.7, object: 0.6, product: 0.6, technology: 0.6, organization: 0.5, concept: 0.7, adjective: 0.5, emotion: 0.5, action: 0.5, situation: 0.4, trait: 0.5, ability: 0.7, place: 0.4, event: 0, mistake: 0.3, secret: 0.5 },
  mistake: { person: 0.5, occupation: 0.4, animal: 0.6, creature: 0.7, object: 0.6, product: 0.5, technology: 0.6, organization: 0.5, concept: 0.7, adjective: 0.5, emotion: 0.4, action: 0.4, situation: 0.5, trait: 0.4, ability: 0.7, place: 0.5, event: 0.3, mistake: 0, secret: 0.4 },
  secret: { person: 0.4, occupation: 0.4, animal: 0.7, creature: 0.6, object: 0.6, product: 0.6, technology: 0.7, organization: 0.6, concept: 0.6, adjective: 0.5, emotion: 0.5, action: 0.5, situation: 0.6, trait: 0.3, ability: 0.8, place: 0.6, event: 0.5, mistake: 0.4, secret: 0 },
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
