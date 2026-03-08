// improved random prompt generator with extended categories and grammar-aware templates

// Word型: 単語のテキストと品詞を保持
type Word = {
  text: string;
  pos: "noun" | "verb";
};

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
  | "abilityAction"    // 能力の動作（verb）
  | "abilitySkill"     // 能力のスキル（noun）
  | "place"            // 場所
  | "event"            // イベント・出来事
  | "mistakeAction"    // ミスの動作（verb）
  | "mistakeEvent"     // ミスの出来事（noun）
  | "secret";          // 秘密・裏側

// Slot型: カテゴリと品詞制約を保持
type Slot = {
  category: Category;
  pos?: "noun" | "verb";
};

const wordPools: Record<Category, Word[]> = {
  person: [
    { text: "校長先生", pos: "noun" },
    { text: "先生", pos: "noun" },
    { text: "サラリーマン", pos: "noun" },
    { text: "OL", pos: "noun" },
    { text: "学生", pos: "noun" },
    { text: "ニート", pos: "noun" },
    { text: "SNS influencer", pos: "noun" },
    { text: "ホームレス", pos: "noun" },
    { text: "セレブ", pos: "noun" },
    { text: "YouTuber", pos: "noun" },
    { text: "プログラマー", pos: "noun" },
    { text: "営業マン", pos: "noun" },
    { text: "マネージャー", pos: "noun" },
    { text: "アイドル", pos: "noun" },
    { text: "モデル", pos: "noun" },
    { text: "お笑い芸人", pos: "noun" },
    { text: "歌手", pos: "noun" },
    { text: "俳優", pos: "noun" },
    { text: "監督", pos: "noun" },
    { text: "脚本家", pos: "noun" },
    { text: "父親", pos: "noun" },
    { text: "母親", pos: "noun" },
    { text: "兄弟", pos: "noun" },
    { text: "友人", pos: "noun" },
    { text: "恋人", pos: "noun" },
    { text: "上司", pos: "noun" },
    { text: "部下", pos: "noun" },
    { text: "同僚", pos: "noun" },
    { text: "ライバル", pos: "noun" },
    { text: "詐欺師", pos: "noun" },
    { text: "刑事", pos: "noun" },
    { text: "弁護士", pos: "noun" },
    { text: "医者", pos: "noun" },
    { text: "看護師", pos: "noun" },
    { text: "農家", pos: "noun" },
    { text: "職人", pos: "noun" },
    { text: "大統領", pos: "noun" },
    { text: "アナウンサー", pos: "noun" },
  ],
  occupation: [
    { text: "営業", pos: "noun" },
    { text: "企画", pos: "noun" },
    { text: "経理", pos: "noun" },
    { text: "人事", pos: "noun" },
    { text: "法務", pos: "noun" },
    { text: "警察官", pos: "noun" },
    { text: "消防士", pos: "noun" },
    { text: "自衛隊", pos: "noun" },
    { text: "店員", pos: "noun" },
    { text: "料理人", pos: "noun" },
    { text: "美容師", pos: "noun" },
    { text: "建築家", pos: "noun" },
    { text: "エンジニア", pos: "noun" },
    { text: "デザイナー", pos: "noun" },
    { text: "記者", pos: "noun" },
    { text: "編集者", pos: "noun" },
    { text: "カメラマン", pos: "noun" },
    { text: "音楽プロデューサー", pos: "noun" },
    { text: "映画製作者", pos: "noun" },
  ],
  animal: [
    { text: "犬", pos: "noun" },
    { text: "猫", pos: "noun" },
    { text: "ライオン", pos: "noun" },
    { text: "パンダ", pos: "noun" },
    { text: "ゾウ", pos: "noun" },
    { text: "カバ", pos: "noun" },
    { text: "カンガルー", pos: "noun" },
    { text: "猿", pos: "noun" },
    { text: "ワニ", pos: "noun" },
    { text: "ペンギン", pos: "noun" },
    { text: "ウサギ", pos: "noun" },
    { text: "羊", pos: "noun" },
    { text: "牛", pos: "noun" },
    { text: "豚", pos: "noun" },
    { text: "鶏", pos: "noun" },
    { text: "馬", pos: "noun" },
    { text: "キツネ", pos: "noun" },
    { text: "熊", pos: "noun" },
    { text: "シマウマ", pos: "noun" },
    { text: "キリン", pos: "noun" },
    { text: "サイ", pos: "noun" },
    { text: "ダチョウ", pos: "noun" },
    { text: "フラミンゴ", pos: "noun" },
    { text: "イルカ", pos: "noun" },
    { text: "シャチ", pos: "noun" },
    { text: "クジラ", pos: "noun" },
    { text: "カエル", pos: "noun" },
    { text: "トカゲ", pos: "noun" },
    { text: "ヘビ", pos: "noun" },
    { text: "ハムスター", pos: "noun" },
    { text: "インコ", pos: "noun" },
  ],
  creature: [
    { text: "幽霊", pos: "noun" },
    { text: "妖精", pos: "noun" },
    { text: "ドラゴン", pos: "noun" },
    { text: "怪獣", pos: "noun" },
    { text: "ゴーレム", pos: "noun" },
    { text: "ミイラ", pos: "noun" },
    { text: "フランケンシュタイン", pos: "noun" },
    { text: "ゾンビ", pos: "noun" },
    { text: "吸血鬼", pos: "noun" },
    { text: "狼男", pos: "noun" },
    { text: "エイリエン", pos: "noun" },
    { text: "UFO", pos: "noun" },
    { text: "神様", pos: "noun" },
    { text: "悪魔", pos: "noun" },
    { text: "天使", pos: "noun" },
    { text: "モンスター", pos: "noun" },
    { text: "大怪獣", pos: "noun" },
    { text: "小鬼", pos: "noun" },
    { text: "巨人", pos: "noun" },
    { text: "侍", pos: "noun" },
    { text: "忍者", pos: "noun" },
    { text: "魔女", pos: "noun" },
    { text: "魔法使い", pos: "noun" },
  ],
  object: [
    { text: "スマホ", pos: "noun" },
    { text: "パソコン", pos: "noun" },
    { text: "ラップトップ", pos: "noun" },
    { text: "タブレット", pos: "noun" },
    { text: "イヤホン", pos: "noun" },
    { text: "スピーカー", pos: "noun" },
    { text: "テレビ", pos: "noun" },
    { text: "冷蔵庫", pos: "noun" },
    { text: "洗濯機", pos: "noun" },
    { text: "電子レンジ", pos: "noun" },
    { text: "トースター", pos: "noun" },
    { text: "掃除機", pos: "noun" },
    { text: "扇風機", pos: "noun" },
    { text: "照明", pos: "noun" },
    { text: "時計", pos: "noun" },
    { text: "カメラ", pos: "noun" },
    { text: "プリンタ", pos: "noun" },
    { text: "ゲーム機", pos: "noun" },
    { text: "コンソール", pos: "noun" },
    { text: "本", pos: "noun" },
    { text: "ノート", pos: "noun" },
    { text: "ペン", pos: "noun" },
    { text: "鉛筆", pos: "noun" },
    { text: "消しゴム", pos: "noun" },
    { text: "定規", pos: "noun" },
    { text: "はさみ", pos: "noun" },
    { text: "テープ", pos: "noun" },
    { text: "バッグ", pos: "noun" },
    { text: "靴", pos: "noun" },
    { text: "帽子", pos: "noun" },
    { text: "眼鏡", pos: "noun" },
    { text: "腕時計", pos: "noun" },
    { text: "ネックレス", pos: "noun" },
    { text: "指輪", pos: "noun" },
    { text: "アクセサリー", pos: "noun" },
    { text: "カップ", pos: "noun" },
    { text: "お皿", pos: "noun" },
    { text: "フォーク", pos: "noun" },
    { text: "スプーン", pos: "noun" },
    { text: "ナイフ", pos: "noun" },
    { text: "箸", pos: "noun" },
    { text: "鍋", pos: "noun" },
    { text: "フライパン", pos: "noun" },
    { text: "枕", pos: "noun" },
    { text: "布団", pos: "noun" },
    { text: "カーテン", pos: "noun" },
    { text: "ドア", pos: "noun" },
    { text: "パイプ", pos: "noun" },
    { text: "机", pos: "noun" },
    { text: "椅子", pos: "noun" },
    { text: "ベッド", pos: "noun" },
    { text: "ソファ", pos: "noun" },
    { text: "車", pos: "noun" },
    { text: "バイク", pos: "noun" },
    { text: "自転車", pos: "noun" },
    { text: "スケートボード", pos: "noun" },
    { text: "ローラースケート", pos: "noun" },
    { text: "キックボード", pos: "noun" },
    { text: "トイレ", pos: "noun" },
    { text: "浴槽", pos: "noun" },
    { text: "シャワー", pos: "noun" },
    { text: "洗面台", pos: "noun" },
    { text: "鏡", pos: "noun" },
    { text: "歯ブラシ", pos: "noun" },
  ],
  product: [
    { text: "iPhone", pos: "noun" },
    { text: "Android", pos: "noun" },
    { text: "Xbox", pos: "noun" },
    { text: "PlayStation", pos: "noun" },
    { text: "Nintendo Switch", pos: "noun" },
    { text: "MacBook", pos: "noun" },
    { text: "Windows PC", pos: "noun" },
    { text: "iPad", pos: "noun" },
    { text: "Fire Tablet", pos: "noun" },
    { text: "Kindle", pos: "noun" },
    { text: "AirPods", pos: "noun" },
    { text: "Google Pixel", pos: "noun" },
    { text: "Galaxy", pos: "noun" },
    { text: "Dyson", pos: "noun" },
    { text: "ダイソン掃除機", pos: "noun" },
    { text: "Tesla", pos: "noun" },
    { text: "トヨタプリウス", pos: "noun" },
    { text: "Uber", pos: "noun" },
    { text: "Amazon Prime", pos: "noun" },
    { text: "Netflix", pos: "noun" },
    { text: "Disney+", pos: "noun" },
    { text: "ChatGPT", pos: "noun" },
    { text: "Github Copilot", pos: "noun" },
  ],
  technology: [
    { text: "AI", pos: "noun" },
    { text: "機械学習", pos: "noun" },
    { text: "ブロックチェーン", pos: "noun" },
    { text: "NFT", pos: "noun" },
    { text: "メタバース", pos: "noun" },
    { text: "AR", pos: "noun" },
    { text: "VR", pos: "noun" },
    { text: "クラウド", pos: "noun" },
    { text: "サーバー", pos: "noun" },
    { text: "データベース", pos: "noun" },
    { text: "API", pos: "noun" },
    { text: "プロトコル", pos: "noun" },
    { text: "アルゴリズム", pos: "noun" },
    { text: "セキュリティ", pos: "noun" },
    { text: "暗号化", pos: "noun" },
    { text: "バイオメトリクス", pos: "noun" },
    { text: "IoT", pos: "noun" },
    { text: "5G", pos: "noun" },
    { text: "量子コンピュータ", pos: "noun" },
    { text: "チャットGPT", pos: "noun" },
    { text: "画像生成AI", pos: "noun" },
    { text: "音声認識", pos: "noun" },
    { text: "自動運転", pos: "noun" },
    { text: "ロボット工学", pos: "noun" },
  ],
  organization: [
    { text: "Google", pos: "noun" },
    { text: "Apple", pos: "noun" },
    { text: "Microsoft", pos: "noun" },
    { text: "Amazon", pos: "noun" },
    { text: "Meta", pos: "noun" },
    { text: "Tesla", pos: "noun" },
    { text: "Twitter", pos: "noun" },
    { text: "TikTok", pos: "noun" },
    { text: "Instagram", pos: "noun" },
    { text: "YouTube", pos: "noun" },
    { text: "Netflix", pos: "noun" },
    { text: "Disney", pos: "noun" },
    { text: "Sony", pos: "noun" },
    { text: "Nintendo", pos: "noun" },
    { text: "Toyota", pos: "noun" },
    { text: "Honda", pos: "noun" },
    { text: "Nissan", pos: "noun" },
    { text: "Panasonic", pos: "noun" },
    { text: "Sharp", pos: "noun" },
    { text: "NHK", pos: "noun" },
    { text: "日本銀行", pos: "noun" },
    { text: "警察庁", pos: "noun" },
    { text: "防衛省", pos: "noun" },
    { text: "内閣府", pos: "noun" },
    { text: "外務省", pos: "noun" },
  ],
  concept: [
    { text: "愛", pos: "noun" },
    { text: "勇気", pos: "noun" },
    { text: "時間", pos: "noun" },
    { text: "平和", pos: "noun" },
    { text: "未来", pos: "noun" },
    { text: "秘密", pos: "noun" },
    { text: "自由", pos: "noun" },
    { text: "正義", pos: "noun" },
    { text: "真実", pos: "noun" },
    { text: "信頼", pos: "noun" },
    { text: "名誉", pos: "noun" },
    { text: "栄光", pos: "noun" },
    { text: "幸福", pos: "noun" },
    { text: "成功", pos: "noun" },
    { text: "失敗", pos: "noun" },
    { text: "死", pos: "noun" },
    { text: "人生", pos: "noun" },
    { text: "運命", pos: "noun" },
    { text: "カルマ", pos: "noun" },
    { text: "宿命", pos: "noun" },
    { text: "矛盾", pos: "noun" },
    { text: "パラドックス", pos: "noun" },
    { text: "相対性", pos: "noun" },
    { text: "無限", pos: "noun" },
    { text: "永遠", pos: "noun" },
  ],
  adjective: [
    { text: "嬉しい", pos: "noun" },
    { text: "悲しい", pos: "noun" },
    { text: "怒っている", pos: "noun" },
    { text: "呆れている", pos: "noun" },
    { text: "恥ずかしい", pos: "noun" },
    { text: "不安な", pos: "noun" },
    { text: "幸せな", pos: "noun" },
    { text: "悔しい", pos: "noun" },
    { text: "気持ち悪い", pos: "noun" },
    { text: "素晴らしい", pos: "noun" },
    { text: "最悪な", pos: "noun" },
    { text: "ひどい", pos: "noun" },
    { text: "良い", pos: "noun" },
    { text: "悪い", pos: "noun" },
    { text: "美しい", pos: "noun" },
    { text: "醜い", pos: "noun" },
    { text: "優雅な", pos: "noun" },
    { text: "粗雑な", pos: "noun" },
    { text: "上品な", pos: "noun" },
    { text: "下品な", pos: "noun" },
    { text: "清潔な", pos: "noun" },
    { text: "汚い", pos: "noun" },
    { text: "温かい", pos: "noun" },
    { text: "冷たい", pos: "noun" },
    { text: "熱い", pos: "noun" },
    { text: "涼しい", pos: "noun" },
    { text: "明るい", pos: "noun" },
    { text: "暗い", pos: "noun" },
    { text: "大きな", pos: "noun" },
    { text: "小さな", pos: "noun" },
    { text: "太った", pos: "noun" },
    { text: "痩せた", pos: "noun" },
    { text: "賢い", pos: "noun" },
    { text: "阿呆な", pos: "noun" },
    { text: "勇敢な", pos: "noun" },
    { text: "臆病な", pos: "noun" },
    { text: "親切な", pos: "noun" },
    { text: "意地悪な", pos: "noun" },
  ],
  emotion: [
    { text: "喜び", pos: "noun" },
    { text: "悲しみ", pos: "noun" },
    { text: "怒り", pos: "noun" },
    { text: "恐怖", pos: "noun" },
    { text: "驚き", pos: "noun" },
    { text: "厭悪感", pos: "noun" },
    { text: "羨望", pos: "noun" },
    { text: "嫉妬", pos: "noun" },
    { text: "絶望", pos: "noun" },
    { text: "希望", pos: "noun" },
    { text: "不安", pos: "noun" },
    { text: "安堵", pos: "noun" },
    { text: "興奮", pos: "noun" },
    { text: "退屈", pos: "noun" },
    { text: "虚無感", pos: "noun" },
    { text: "充足感", pos: "noun" },
  ],
  action: [
    { text: "走る", pos: "verb" },
    { text: "歩く", pos: "verb" },
    { text: "跳ぶ", pos: "verb" },
    { text: "飛ぶ", pos: "verb" },
    { text: "泳ぐ", pos: "verb" },
    { text: "踊る", pos: "verb" },
    { text: "笑う", pos: "verb" },
    { text: "泣く", pos: "verb" },
    { text: "叫ぶ", pos: "verb" },
    { text: "食べる", pos: "verb" },
    { text: "飲む", pos: "verb" },
    { text: "寝る", pos: "verb" },
    { text: "起きる", pos: "verb" },
    { text: "働く", pos: "verb" },
    { text: "勉強する", pos: "verb" },
    { text: "遊ぶ", pos: "verb" },
    { text: "戦う", pos: "verb" },
    { text: "助ける", pos: "verb" },
    { text: "傷つける", pos: "verb" },
    { text: "信じる", pos: "verb" },
    { text: "疑う", pos: "verb" },
    { text: "愛する", pos: "verb" },
    { text: "憎む", pos: "verb" },
    { text: "祈る", pos: "verb" },
    { text: "呪う", pos: "verb" },
    { text: "壊す", pos: "verb" },
    { text: "修理する", pos: "verb" },
    { text: "作る", pos: "verb" },
    { text: "描く", pos: "verb" },
    { text: "書く", pos: "verb" },
    { text: "読む", pos: "verb" },
    { text: "聞く", pos: "verb" },
    { text: "見る", pos: "verb" },
  ],
  situation: [
    { text: "学校", pos: "noun" },
    { text: "職場", pos: "noun" },
    { text: "図書館", pos: "noun" },
    { text: "図書館", pos: "noun" },
    { text: "病院", pos: "noun" },
    { text: "裁判所", pos: "noun" },
    { text: "警察署", pos: "noun" },
    { text: "監獄", pos: "noun" },
    { text: "電車", pos: "noun" },
    { text: "飛行機", pos: "noun" },
    { text: "駅", pos: "noun" },
    { text: "空港", pos: "noun" },
    { text: "ホテル", pos: "noun" },
    { text: "レストラン", pos: "noun" },
    { text: "カフェ", pos: "noun" },
    { text: "居酒屋", pos: "noun" },
    { text: "公園", pos: "noun" },
    { text: "ビーチ", pos: "noun" },
    { text: "山頂", pos: "noun" },
    { text: "地下洞窟", pos: "noun" },
    { text: "宇宙", pos: "noun" },
    { text: "地獄", pos: "noun" },
    { text: "天国", pos: "noun" },
    { text: "結婚式", pos: "noun" },
    { text: "葬式", pos: "noun" },
    { text: "告発会見", pos: "noun" },
    { text: "裁判", pos: "noun" },
    { text: "逮捕劇", pos: "noun" },
    { text: "テロ", pos: "noun" },
    { text: "戦争", pos: "noun" },
    { text: "平和条約", pos: "noun" },
  ],
  trait: [
    { text: "嘘つき", pos: "noun" },
    { text: "せっかち", pos: "noun" },
    { text: "冷たい", pos: "noun" },
    { text: "計算高い", pos: "noun" },
    { text: "ナルシスト", pos: "noun" },
    { text: "偽善者", pos: "noun" },
    { text: "完璧主義者", pos: "noun" },
    { text: "怠け者", pos: "noun" },
    { text: "心配性", pos: "noun" },
    { text: "楽観的", pos: "noun" },
    { text: "悲観的", pos: "noun" },
    { text: "頑固", pos: "noun" },
    { text: "柔軟", pos: "noun" },
    { text: "社交的", pos: "noun" },
    { text: "内向的", pos: "noun" },
    { text: "優柔不断", pos: "noun" },
    { text: "決断力がある", pos: "noun" },
    { text: "論理的", pos: "noun" },
    { text: "感情的", pos: "noun" },
  ],
  abilityAction: [
    { text: "透明人間になった", pos: "verb" },
    { text: "瞬間移動した", pos: "verb" },
    { text: "時間停止した", pos: "verb" },
    { text: "飛行能力を得た", pos: "verb" },
    { text: "怪力を持った", pos: "verb" },
    { text: "火を出した", pos: "verb" },
    { text: "氷を操った", pos: "verb" },
    { text: "風を操った", pos: "verb" },
    { text: "催眠をかけた", pos: "verb" },
    { text: "テレパシーをした", pos: "verb" },
    { text: "予知した", pos: "verb" },
    { text: "姿を変えた", pos: "verb" },
    { text: "物を分身させた", pos: "verb" },
    { text: "時間逆行した", pos: "verb" },
    { text: "パラレルワールド移動した", pos: "verb" },
  ],
  abilitySkill: [
    { text: "念力", pos: "noun" },
    { text: "催眠", pos: "noun" },
    { text: "テレパシー", pos: "noun" },
    { text: "予知能力", pos: "noun" },
    { text: "姿を変える", pos: "noun" },
    { text: "物を分身させる", pos: "noun" },
    { text: "時間逆行", pos: "noun" },
    { text: "パラレルワールド移動", pos: "noun" },
  ],
  place: [
    { text: "学校", pos: "noun" },
    { text: "企業", pos: "noun" },
    { text: "工場", pos: "noun" },
    { text: "農場", pos: "noun" },
    { text: "森", pos: "noun" },
    { text: "砂漠", pos: "noun" },
    { text: "海", pos: "noun" },
    { text: "山", pos: "noun" },
    { text: "火山", pos: "noun" },
    { text: "洞窟", pos: "noun" },
    { text: "遺跡", pos: "noun" },
    { text: "神社", pos: "noun" },
    { text: "寺", pos: "noun" },
    { text: "教会", pos: "noun" },
    { text: "病院", pos: "noun" },
    { text: "警察", pos: "noun" },
    { text: "空港", pos: "noun" },
    { text: "駅", pos: "noun" },
    { text: "繁華街", pos: "noun" },
    { text: "貧困街", pos: "noun" },
    { text: "郊外", pos: "noun" },
    { text: "田舎", pos: "noun" },
    { text: "都会", pos: "noun" },
    { text: "地下街", pos: "noun" },
  ],
  event: [
    { text: "告発", pos: "noun" },
    { text: "スキャンダル", pos: "noun" },
    { text: "不倫", pos: "noun" },
    { text: "裏切り", pos: "noun" },
    { text: "逮捕", pos: "noun" },
    { text: "警察沙汰", pos: "noun" },
    { text: "訴訟", pos: "noun" },
    { text: "炎上", pos: "noun" },
    { text: "バズ", pos: "noun" },
    { text: "大失敗", pos: "noun" },
    { text: "大成功", pos: "noun" },
    { text: "倒産", pos: "noun" },
    { text: "M&A", pos: "noun" },
    { text: "合併", pos: "noun" },
    { text: "分裂", pos: "noun" },
    { text: "結婚", pos: "noun" },
    { text: "離婚", pos: "noun" },
    { text: "妊娠", pos: "noun" },
    { text: "出産", pos: "noun" },
    { text: "死亡", pos: "noun" },
    { text: "引越し", pos: "noun" },
    { text: "転職", pos: "noun" },
    { text: "クビ", pos: "noun" },
  ],
  mistakeAction: [
    { text: "寝坊した", pos: "verb" },
    { text: "遅刻した", pos: "verb" },
    { text: "計算ミスした", pos: "verb" },
    { text: "メール誤送信した", pos: "verb" },
    { text: "データ消失させた", pos: "verb" },
    { text: "システムダウンさせた", pos: "verb" },
    { text: "セキュリティ漏洩した", pos: "verb" },
    { text: "個人情報流出した", pos: "verb" },
    { text: "ハラスメントした", pos: "verb" },
    { text: "いじめた", pos: "verb" },
    { text: "パワハラした", pos: "verb" },
    { text: "セクハラした", pos: "verb" },
    { text: "過労死した", pos: "verb" },
    { text: "ストレスを溜めた", pos: "verb" },
  ],
  mistakeEvent: [
    { text: "誤字脱字", pos: "noun" },
    { text: "無断欠勤", pos: "noun" },
    { text: "ハラスメント", pos: "noun" },
    { text: "いじめ", pos: "noun" },
    { text: "パワハラ", pos: "noun" },
    { text: "セクハラ", pos: "noun" },
    { text: "過労死", pos: "noun" },
    { text: "ストレス", pos: "noun" },
  ],
  secret: [
    { text: "裏切り", pos: "noun" },
    { text: "二重生活", pos: "noun" },
    { text: "実は宇宙人", pos: "noun" },
    { text: "隠し財産", pos: "noun" },
    { text: "隠し子", pos: "noun" },
    { text: "過去の犯罪", pos: "noun" },
    { text: "整形履歴", pos: "noun" },
    { text: "借金", pos: "noun" },
    { text: "ギャンブル癖", pos: "noun" },
    { text: "浮気相手", pos: "noun" },
    { text: "詐欺師", pos: "noun" },
    { text: "スパイ", pos: "noun" },
    { text: "本当の年齢", pos: "noun" },
    { text: "本当の正体", pos: "noun" },
    { text: "真の目的", pos: "noun" },
    { text: "隠された真実", pos: "noun" },
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
  slots: Record<string, Slot>;
  allowedThemes?: string[]; // if provided, theme is picked from this list
}

const templates: Template[] = [
  { text: "こんな{slotA}は嫌だ", slots: { slotA: { category: "person", pos: "noun" } } },
  { text: "ダメな{slotA}の特徴", slots: { slotA: { category: "person", pos: "noun" } } },
  { text: "絶対に{slotA}してはいけない{slotB}", slots: { slotA: { category: "concept", pos: "noun" }, slotB: { category: "object", pos: "noun" } } },
  { text: "{slotA}に新機能が追加されました。それは？", slots: { slotA: { category: "object", pos: "noun" } }, allowedThemes: ["SF","学校","職場"] },
  { text: "{slotA}のキャッチコピーを考えてください", slots: { slotA: { category: "object", pos: "noun" } }, allowedThemes: ["旅行","料理","スポーツ"] },
  { text: "実は{slotA}は{slotB}だった", slots: { slotA: { category: "animal", pos: "noun" }, slotB: { category: "creature", pos: "noun" } }, allowedThemes: ["ホラー","ファンタジー"] },
  { text: "ダメな{slotA}の特徴", slots: { slotA: { category: "person", pos: "noun" } } },
  { text: "こんな{slotA}は嫌だ", slots: { slotA: { category: "person", pos: "noun" } } },
  { text: "{slotA}と{slotB}が逆になった世界", slots: { slotA: { category: "person", pos: "noun" }, slotB: { category: "animal", pos: "noun" } }, allowedThemes: ["SF","ファンタジー"] },
  
    { text: "こんな{slotA}はすぐクビ", slots: { slotA: { category: "occupation", pos: "noun" } } },

  { text: "こんな{slotA}は信用できない", slots: { slotA: { category: "person", pos: "noun" } } },

  { text: "こんな{slotA}はモテない", slots: { slotA: { category: "person", pos: "noun" } } },

  { text: "{slotA}が炎上した理由", slots: { slotA: { category: "person", pos: "noun" } } },

  { text: "{slotA}の黒歴史", slots: { slotA: { category: "person", pos: "noun" } } },

  { text: "{slotA}の裏バイト", slots: { slotA: { category: "person", pos: "noun" } } },

  { text: "{slotA}の弱点", slots: { slotA: { category: "creature", pos: "noun" } } },

  { text: "{slotA}が絶対に言わない一言", slots: { slotA: { category: "person", pos: "noun" } } },

  { text: "{slotA}がクビになった理由", slots: { slotA: { category: "occupation", pos: "noun" } } },

  { text: "{slotA}の意味不明なルール", slots: { slotA: { category: "organization", pos: "noun" } } },

  { text: "{slotA}の恥ずかしい秘密", slots: { slotA: { category: "person", pos: "noun" } } },

  { text: "{slotA}のやらかし", slots: { slotA: { category: "person", pos: "noun" } } },

  { text: "{slotA}のレビュー★1の理由", slots: { slotA: { category: "product", pos: "noun" } } },

  { text: "{slotA}のクレーム内容", slots: { slotA: { category: "product", pos: "noun" } } },

  { text: "{slotA}の間違った使い方", slots: { slotA: { category: "object", pos: "noun" } } },

  { text: "{slotA}の新しい使い道", slots: { slotA: { category: "object", pos: "noun" } } },

  { text: "{slotA}の説明書に書いてある注意書き", slots: { slotA: { category: "product", pos: "noun" } } },

  { text: "{slotA}のキャッチコピー", slots: { slotA: { category: "product", pos: "noun" } } },

  { text: "{slotA}の公式発表", slots: { slotA: { category: "organization", pos: "noun" } } },

  { text: "{slotA}の謝罪会見", slots: { slotA: { category: "person", pos: "noun" } } },

  { text: "{slotA}の不祥事", slots: { slotA: { category: "organization", pos: "noun" } } },

  { text: "{slotA}が{slotB}した結果", slots: { slotA: { category: "person", pos: "noun" }, slotB: { category: "mistakeAction", pos: "verb" } } },

  { text: "{slotA}が{slotB}で炎上", slots: { slotA: { category: "person", pos: "noun" }, slotB: { category: "mistakeEvent", pos: "noun" } } },

  { text: "{slotA}が{slotB}して大混乱", slots: { slotA: { category: "animal", pos: "noun" }, slotB: { category: "abilityAction", pos: "verb" } } },

  { text: "{slotA}が{slotB}を覚えた", slots: { slotA: { category: "animal", pos: "noun" }, slotB: { category: "abilitySkill", pos: "noun" } } },

  { text: "{slotA}が{slotB}を始めた理由", slots: { slotA: { category: "person", pos: "noun" }, slotB: { category: "abilityAction", pos: "verb" } } },

  { text: "{slotA}なのに{slotB}", slots: { slotA: { category: "person", pos: "noun" }, slotB: { category: "trait", pos: "noun" } } },

  { text: "{slotA}なのに誰も驚かない理由", slots: { slotA: { category: "creature", pos: "noun" } } },

  { text: "{slotA}なのに人気がない理由", slots: { slotA: { category: "person", pos: "noun" } } },

  { text: "{slotA}の間違った進化", slots: { slotA: { category: "animal", pos: "noun" } } },

  { text: "{slotA}の意外な特技", slots: { slotA: { category: "person", pos: "noun" } } },

  { text: "{slotA}の隠された能力", slots: { slotA: { category: "person", pos: "noun" } } },

  { text: "{slotA}が実は{slotB}だった", slots: { slotA: { category: "person", pos: "noun" }, slotB: { category: "creature", pos: "noun" } } },

  { text: "{slotA}と{slotB}が入れ替わった世界", slots: { slotA: { category: "person", pos: "noun" }, slotB: { category: "animal", pos: "noun" } } },

  { text: "{slotA}が{slotB}を支配する世界", slots: { slotA: { category: "animal", pos: "noun" }, slotB: { category: "person", pos: "noun" } } },

  { text: "{slotA}が{slotB}に就職した理由", slots: { slotA: { category: "animal", pos: "noun" }, slotB: { category: "organization", pos: "noun" } } },

  { text: "{slotA}が{slotB}を買収", slots: { slotA: { category: "organization", pos: "noun" }, slotB: { category: "organization", pos: "noun" } } },

  { text: "{slotA}が{slotB}とコラボ", slots: { slotA: { category: "product", pos: "noun" }, slotB: { category: "product", pos: "noun" } } },

  { text: "{slotA}の新サービス", slots: { slotA: { category: "organization", pos: "noun" } } },

  { text: "{slotA}のヤバい新機能", slots: { slotA: { category: "technology", pos: "noun" } } },

  { text: "{slotA}が世界を支配したら", slots: { slotA: { category: "technology", pos: "noun" } } },

  { text: "{slotA}が暴走した結果", slots: { slotA: { category: "technology", pos: "noun" } } },

  { text: "{slotA}が{slotB}した世界", slots: { slotA: { category: "technology", pos: "noun" }, slotB: { category: "abilityAction", pos: "verb" } } },

  { text: "{slotA}のバグ", slots: { slotA: { category: "technology", pos: "noun" } } },

  { text: "{slotA}がバグった結果", slots: { slotA: { category: "technology", pos: "noun" } } },

  { text: "{slotA}の意味不明な仕様", slots: { slotA: { category: "technology", pos: "noun" } } },

  { text: "{slotA}が{slotB}で大炎上", slots: { slotA: { category: "organization", pos: "noun" }, slotB: { category: "event", pos: "noun" } } },

  { text: "{slotA}の隠された真実", slots: { slotA: { category: "organization", pos: "noun" } } },

  { text: "{slotA}の都市伝説", slots: { slotA: { category: "place", pos: "noun" } } },

  { text: "{slotA}で起きた事件", slots: { slotA: { category: "place", pos: "noun" } } },

  { text: "{slotA}で絶対やってはいけないこと", slots: { slotA: { category: "place", pos: "noun" } } },

  { text: "{slotA}の裏ルール", slots: { slotA: { category: "place", pos: "noun" } } },

  { text: "{slotA}の危険な遊び方", slots: { slotA: { category: "object", pos: "noun" } } },

  { text: "{slotA}の危険な使い方", slots: { slotA: { category: "product", pos: "noun" } } },
  { text: "{slotA}のレビュー★0の理由", slots: { slotA: { category: "product", pos: "noun" } } },

{ text: "{slotA}がやりがちなミス", slots: { slotA: { category: "person", pos: "noun" } } },

{ text: "{slotA}の恥ずかしい過去", slots: { slotA: { category: "person", pos: "noun" } } },

{ text: "{slotA}の誰も知らない裏設定", slots: { slotA: { category: "person", pos: "noun" } } },

{ text: "{slotA}が密かにやっていること", slots: { slotA: { category: "person", pos: "noun" } } },

{ text: "{slotA}が絶対にやってはいけないこと", slots: { slotA: { category: "person", pos: "noun" } } },

{ text: "{slotA}の黒い噂", slots: { slotA: { category: "person", pos: "noun" } } },

{ text: "{slotA}のダメなところ", slots: { slotA: { category: "person", pos: "noun" } } },

{ text: "{slotA}の変な癖", slots: { slotA: { category: "person", pos: "noun" } } },

{ text: "{slotA}の変なルール", slots: { slotA: { category: "organization", pos: "noun" } } },

{ text: "{slotA}のありえない校則", slots: { slotA: { category: "place", pos: "noun" } } },

{ text: "{slotA}のありえないサービス", slots: { slotA: { category: "organization", pos: "noun" } } },

{ text: "{slotA}の意味不明なアップデート", slots: { slotA: { category: "technology", pos: "noun" } } },

{ text: "{slotA}がアップデートした結果", slots: { slotA: { category: "technology", pos: "noun" } } },

{ text: "{slotA}の新しいバグ", slots: { slotA: { category: "technology", pos: "noun" } } },

{ text: "{slotA}が暴走して起きた事件", slots: { slotA: { category: "technology", pos: "noun" } } },

{ text: "{slotA}のありえない進化", slots: { slotA: { category: "animal", pos: "noun" } } },

{ text: "{slotA}が突然{slotB}した", slots: { slotA: { category: "animal", pos: "noun" }, slotB: { category: "abilityAction", pos: "verb" } } },

{ text: "{slotA}が人間社会に来た結果", slots: { slotA: { category: "animal", pos: "noun" } } },

{ text: "{slotA}が学校に入学した理由", slots: { slotA: { category: "animal", pos: "noun" } } },

{ text: "{slotA}が会社に就職した理由", slots: { slotA: { category: "animal", pos: "noun" } } },

{ text: "{slotA}が{slotB}を始めた", slots: { slotA: { category: "person", pos: "noun" }, slotB: { category: "abilityAction", pos: "verb" } } },

{ text: "{slotA}が突然{slotB}をやめた理由", slots: { slotA: { category: "person", pos: "noun" }, slotB: { category: "abilityAction", pos: "verb" } } },

{ text: "{slotA}が{slotB}でバズった", slots: { slotA: { category: "person", pos: "noun" }, slotB: { category: "event", pos: "noun" } } },

{ text: "{slotA}がトレンド入りした理由", slots: { slotA: { category: "person", pos: "noun" } } },

{ text: "{slotA}がニュースになった理由", slots: { slotA: { category: "person", pos: "noun" } } },

{ text: "{slotA}の謎の習慣", slots: { slotA: { category: "person", pos: "noun" } } },

{ text: "{slotA}の変なこだわり", slots: { slotA: { category: "person", pos: "noun" } } },
];
  

function pickOne<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function pickWord(category: Category, pos?: "noun" | "verb"): string {
  const pool = wordPools[category];
  if (!pool || pool.length === 0) return "";
  // posが指定されている場合、posに一致する単語のみから選ぶ
  const filteredPool = pos ? pool.filter(word => word.pos === pos) : pool;
  if (filteredPool.length === 0) return ""; // pos制約に一致する単語がない場合
  const picked = pickOne(filteredPool);
  return picked.text;
}

// distance between categories (0=very similar, 1=very far) - extended for new categories
const categoryDistance: Record<Category, Record<Category, number>> = {
  person: { person: 0, occupation: 0.2, animal: 0.4, creature: 0.8, object: 0.6, product: 0.6, technology: 0.7, organization: 0.5, concept: 0.8, adjective: 0.5, emotion: 0.6, action: 0.5, situation: 0.7, trait: 0.3, abilityAction: 0.9, abilitySkill: 0.9, place: 0.7, event: 0.6, mistakeAction: 0.5, mistakeEvent: 0.5, secret: 0.4 },
  occupation: { person: 0.2, occupation: 0, animal: 0.5, creature: 0.8, object: 0.6, product: 0.6, technology: 0.7, organization: 0.3, concept: 0.8, adjective: 0.5, emotion: 0.6, action: 0.4, situation: 0.6, trait: 0.4, abilityAction: 0.9, abilitySkill: 0.9, place: 0.6, event: 0.5, mistakeAction: 0.4, mistakeEvent: 0.4, secret: 0.4 },
  animal: { person: 0.4, occupation: 0.5, animal: 0, creature: 0.5, object: 0.7, product: 0.7, technology: 0.8, organization: 0.8, concept: 0.8, adjective: 0.6, emotion: 0.6, action: 0.5, situation: 0.7, trait: 0.5, abilityAction: 0.8, abilitySkill: 0.8, place: 0.7, event: 0.6, mistakeAction: 0.6, mistakeEvent: 0.6, secret: 0.7 },
  creature: { person: 0.8, occupation: 0.8, animal: 0.5, creature: 0, object: 0.7, product: 0.8, technology: 0.9, organization: 0.9, concept: 0.7, adjective: 0.6, emotion: 0.6, action: 0.5, situation: 0.8, trait: 0.6, abilityAction: 0.9, abilitySkill: 0.9, place: 0.8, event: 0.7, mistakeAction: 0.7, mistakeEvent: 0.7, secret: 0.6 },
  object: { person: 0.6, occupation: 0.6, animal: 0.7, creature: 0.7, object: 0, product: 0.2, technology: 0.5, organization: 0.7, concept: 0.7, adjective: 0.6, emotion: 0.5, action: 0.6, situation: 0.6, trait: 0.6, abilityAction: 0.8, abilitySkill: 0.8, place: 0.7, event: 0.6, mistakeAction: 0.6, mistakeEvent: 0.6, secret: 0.6 },
  product: { person: 0.6, occupation: 0.6, animal: 0.7, creature: 0.8, object: 0.2, product: 0, technology: 0.4, organization: 0.5, concept: 0.7, adjective: 0.6, emotion: 0.5, action: 0.6, situation: 0.6, trait: 0.6, abilityAction: 0.8, abilitySkill: 0.8, place: 0.7, event: 0.6, mistakeAction: 0.5, mistakeEvent: 0.5, secret: 0.6 },
  technology: { person: 0.7, occupation: 0.7, animal: 0.8, creature: 0.9, object: 0.5, product: 0.4, technology: 0, organization: 0.5, concept: 0.8, adjective: 0.6, emotion: 0.7, action: 0.6, situation: 0.7, trait: 0.7, abilityAction: 0.7, abilitySkill: 0.7, place: 0.8, event: 0.6, mistakeAction: 0.6, mistakeEvent: 0.6, secret: 0.7 },
  organization: { person: 0.5, occupation: 0.3, animal: 0.8, creature: 0.9, object: 0.7, product: 0.5, technology: 0.5, organization: 0, concept: 0.7, adjective: 0.6, emotion: 0.6, action: 0.6, situation: 0.6, trait: 0.6, abilityAction: 0.9, abilitySkill: 0.9, place: 0.6, event: 0.5, mistakeAction: 0.5, mistakeEvent: 0.5, secret: 0.6 },
  concept: { person: 0.8, occupation: 0.8, animal: 0.8, creature: 0.7, object: 0.7, product: 0.7, technology: 0.8, organization: 0.7, concept: 0, adjective: 0.6, emotion: 0.6, action: 0.7, situation: 0.8, trait: 0.5, abilityAction: 0.6, abilitySkill: 0.6, place: 0.8, event: 0.7, mistakeAction: 0.7, mistakeEvent: 0.7, secret: 0.6 },
  adjective: { person: 0.5, occupation: 0.5, animal: 0.6, creature: 0.6, object: 0.6, product: 0.6, technology: 0.6, organization: 0.6, concept: 0.6, adjective: 0, emotion: 0.4, action: 0.5, situation: 0.6, trait: 0.3, abilityAction: 0.7, abilitySkill: 0.7, place: 0.6, event: 0.5, mistakeAction: 0.5, mistakeEvent: 0.5, secret: 0.5 },
  emotion: { person: 0.6, occupation: 0.6, animal: 0.6, creature: 0.6, object: 0.5, product: 0.5, technology: 0.7, organization: 0.6, concept: 0.6, adjective: 0.4, emotion: 0, action: 0.5, situation: 0.6, trait: 0.4, abilityAction: 0.6, abilitySkill: 0.6, place: 0.6, event: 0.5, mistakeAction: 0.4, mistakeEvent: 0.4, secret: 0.5 },
  action: { person: 0.5, occupation: 0.4, animal: 0.5, creature: 0.5, object: 0.6, product: 0.6, technology: 0.6, organization: 0.6, concept: 0.7, adjective: 0.5, emotion: 0.5, action: 0, situation: 0.5, trait: 0.4, abilityAction: 0.6, abilitySkill: 0.6, place: 0.6, event: 0.5, mistakeAction: 0.4, mistakeEvent: 0.4, secret: 0.5 },
  situation: { person: 0.7, occupation: 0.6, animal: 0.7, creature: 0.8, object: 0.6, product: 0.6, technology: 0.7, organization: 0.6, concept: 0.8, adjective: 0.6, emotion: 0.6, action: 0.5, situation: 0, trait: 0.6, abilityAction: 0.7, abilitySkill: 0.7, place: 0.5, event: 0.4, mistakeAction: 0.5, mistakeEvent: 0.5, secret: 0.6 },
  trait: { person: 0.3, occupation: 0.4, animal: 0.5, creature: 0.6, object: 0.6, product: 0.6, technology: 0.7, organization: 0.6, concept: 0.5, adjective: 0.3, emotion: 0.4, action: 0.4, situation: 0.6, trait: 0, abilityAction: 0.6, abilitySkill: 0.6, place: 0.6, event: 0.5, mistakeAction: 0.4, mistakeEvent: 0.4, secret: 0.3 },
  abilityAction: { person: 0.9, occupation: 0.9, animal: 0.8, creature: 0.9, object: 0.8, product: 0.8, technology: 0.7, organization: 0.9, concept: 0.6, adjective: 0.7, emotion: 0.6, action: 0.6, situation: 0.7, trait: 0.6, abilityAction: 0, abilitySkill: 0.1, place: 0.8, event: 0.7, mistakeAction: 0.7, mistakeEvent: 0.7, secret: 0.8 },
  abilitySkill: { person: 0.9, occupation: 0.9, animal: 0.8, creature: 0.9, object: 0.8, product: 0.8, technology: 0.7, organization: 0.9, concept: 0.6, adjective: 0.7, emotion: 0.6, action: 0.6, situation: 0.7, trait: 0.6, abilityAction: 0.1, abilitySkill: 0, place: 0.8, event: 0.7, mistakeAction: 0.7, mistakeEvent: 0.7, secret: 0.8 },
  place: { person: 0.7, occupation: 0.6, animal: 0.7, creature: 0.8, object: 0.7, product: 0.7, technology: 0.8, organization: 0.6, concept: 0.8, adjective: 0.6, emotion: 0.6, action: 0.6, situation: 0.5, trait: 0.6, abilityAction: 0.8, abilitySkill: 0.8, place: 0, event: 0.4, mistakeAction: 0.5, mistakeEvent: 0.5, secret: 0.6 },
  event: { person: 0.6, occupation: 0.5, animal: 0.6, creature: 0.7, object: 0.6, product: 0.6, technology: 0.6, organization: 0.5, concept: 0.7, adjective: 0.5, emotion: 0.5, action: 0.5, situation: 0.4, trait: 0.5, abilityAction: 0.7, abilitySkill: 0.7, place: 0.4, event: 0, mistakeAction: 0.3, mistakeEvent: 0.3, secret: 0.5 },
  mistakeAction: { person: 0.5, occupation: 0.4, animal: 0.6, creature: 0.7, object: 0.6, product: 0.5, technology: 0.6, organization: 0.5, concept: 0.7, adjective: 0.5, emotion: 0.4, action: 0.4, situation: 0.5, trait: 0.4, abilityAction: 0.7, abilitySkill: 0.7, place: 0.5, event: 0.3, mistakeAction: 0, mistakeEvent: 0.1, secret: 0.4 },
  mistakeEvent: { person: 0.5, occupation: 0.4, animal: 0.6, creature: 0.7, object: 0.6, product: 0.5, technology: 0.6, organization: 0.5, concept: 0.7, adjective: 0.5, emotion: 0.4, action: 0.4, situation: 0.5, trait: 0.4, abilityAction: 0.7, abilitySkill: 0.7, place: 0.5, event: 0.3, mistakeAction: 0.1, mistakeEvent: 0, secret: 0.4 },
  secret: { person: 0.4, occupation: 0.4, animal: 0.7, creature: 0.6, object: 0.6, product: 0.6, technology: 0.7, organization: 0.6, concept: 0.6, adjective: 0.5, emotion: 0.5, action: 0.5, situation: 0.6, trait: 0.3, abilityAction: 0.8, abilitySkill: 0.8, place: 0.6, event: 0.5, mistakeAction: 0.4, mistakeEvent: 0.4, secret: 0 },
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
      const slotDef = tmpl.slots[slot];
      chosen[slot] = pickWord(slotDef.category, slotDef.pos);
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
  slotCats: Record<string, Slot>,
  chosen: Record<string, string>,
  min: number
) {
  for (let i = 0; i < slots.length; i++) {
    for (let j = i + 1; j < slots.length; j++) {
      const catA = slotCats[slots[i]].category;
      const catB = slotCats[slots[j]].category;
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
