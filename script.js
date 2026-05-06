/* ============================================================
   NUTRI — script.js  (v3)
   ============================================================ */
"use strict";

// ════════════════════════════════════════════════════════════
// 1. AFFILIATE LINKS
//    ▼▼▼ ここのURLをA8.netのアフィリエイトURLに差し替えてください ▼▼▼
// ════════════════════════════════════════════════════════════
const AFFILIATE = {
  protein: [
    { name:"マイプロテイン Impact ホエイプロテイン", desc:"不足しがちなタンパク質を補いやすいプロテイン", emoji:"💪",
      url:"https://example.com/REPLACE_A8_PROTEIN_1",  /* ← A8 URL */ type:"t-protein" },
    { name:"サラダチキン バラエティセット",           desc:"高タンパクな食品を手軽に取り入れやすいセット", emoji:"🍗",
      url:"https://example.com/REPLACE_A8_PROTEIN_2",  /* ← A8 URL */ type:"t-protein" },
    { name:"明治 ザバス ホエイプロテイン100",          desc:"運動後などの食生活サポートに活用しやすい", emoji:"🥤",
      url:"https://example.com/REPLACE_A8_PROTEIN_3",  /* ← A8 URL */ type:"t-protein" },
  ],
  fiber: [
    { name:"日食 プレミアムピュアオートミール",        desc:"食物繊維を補いやすい朝食として活用できる", emoji:"🌾",
      url:"https://example.com/REPLACE_A8_FIBER_1",    /* ← A8 URL */ type:"t-fiber"   },
    { name:"はくばく もち麦ごはん 12食セット",         desc:"毎日の食事に取り入れやすい食物繊維食品", emoji:"🍚",
      url:"https://example.com/REPLACE_A8_FIBER_2",    /* ← A8 URL */ type:"t-fiber"   },
    { name:"アサヒグループ食品 1日分の野菜",           desc:"不足しがちな野菜の栄養補給をサポート", emoji:"🥗",
      url:"https://example.com/REPLACE_A8_FIBER_3",    /* ← A8 URL */ type:"t-fiber"   },
  ],
  lowfat: [
    { name:"nosh（ナッシュ）管理栄養士監修 低糖質弁当", desc:"脂質をおさえた食生活のサポートになりやすい", emoji:"🍱",
      url:"https://example.com/REPLACE_A8_LOWFAT_1",   /* ← A8 URL */ type:"t-lowfat"  },
    { name:"ライザップサポートミール",                  desc:"バランスを意識した食事のサポートに", emoji:"⚖️",
      url:"https://example.com/REPLACE_A8_LOWFAT_2",   /* ← A8 URL */ type:"t-lowfat"  },
  ],
  lowcal: [
    { name:"BASE FOOD ベースフード 完全栄養食",         desc:"栄養バランスを整えながら食事管理をサポート", emoji:"🥖",
      url:"https://example.com/REPLACE_A8_LOWCAL_1",   /* ← A8 URL */ type:"t-lowcal"  },
    { name:"nosh（ナッシュ）カロリー調整弁当",          desc:"カロリーを意識した食生活のサポートに", emoji:"🍽️",
      url:"https://example.com/REPLACE_A8_LOWCAL_2",   /* ← A8 URL */ type:"t-lowcal"  },
  ],
};
// ▲▲▲ アフィリエイト設定ここまで ▲▲▲

// ════════════════════════════════════════════════════════════
// 2. DAILY REFERENCE VALUES (日本人の食事摂取基準 2020年版・30〜49歳)
// ════════════════════════════════════════════════════════════
const DAILY_REF = {
  male: {
    calories:2700, protein:65, fat:74,  carbs:380, fiber:21,
    sodium:2300, calcium:750, iron:7.5, vitaminC:100,
  },
  female: {
    calories:2050, protein:50, fat:57,  carbs:285, fiber:18,
    sodium:2300, calcium:650, iron:11,  vitaminC:100,
  },
};

// ════════════════════════════════════════════════════════════
// 3. FOOD DATABASE  (cal/prot/fat/carb/fib per serving, sodium/calcium mg, iron/vitC mg)
//    gramBase = the gram weight the nutrition values are based on
// ════════════════════════════════════════════════════════════
const FOOD_DB_STATIC = [
  // ── 主食 ──────────────────────────────────────────────────
  { id:"rice",       name:"ご飯",          emoji:"🍚", keywords:["ご飯","ごはん","白飯","米","ライス","白米"],
    gramBase:150, cal:252, prot:3.8, fat:0.5, carb:55.7, fib:0.5, sod:2,    cal_m:5,   iron:0.2, vitC:0  },
  { id:"rice_sm",    name:"ご飯（小盛り）",emoji:"🍚", keywords:["小盛り","少なめ","少なめご飯","小"],
    gramBase:100, cal:168, prot:2.5, fat:0.3, carb:37.1, fib:0.3, sod:1,    cal_m:3,   iron:0.1, vitC:0  },
  { id:"bread",      name:"食パン",        emoji:"🍞", keywords:["食パン","パン","トースト","サンドイッチ","サンド","ブレッド"],
    gramBase:60,  cal:158, prot:5.6, fat:2.6, carb:28.0, fib:1.4, sod:310,  cal_m:28,  iron:0.5, vitC:0  },
  { id:"wholegrain", name:"全粒粉パン",    emoji:"🫓", keywords:["全粒粉","全粒","グレイン","ライ麦"],
    gramBase:60,  cal:138, prot:5.5, fat:2.0, carb:24.0, fib:3.5, sod:280,  cal_m:30,  iron:1.0, vitC:0  },
  { id:"oatmeal",    name:"オートミール",  emoji:"🌾", keywords:["オートミール","オーツ","オーツ麦","燕麦"],
    gramBase:40,  cal:152, prot:5.1, fat:2.8, carb:26.4, fib:3.2, sod:2,    cal_m:18,  iron:1.6, vitC:0  },
  { id:"ramen",      name:"ラーメン",      emoji:"🍜", keywords:["ラーメン","らーめん","拉麺","中華そば","とんこつ","醤油ラーメン","味噌ラーメン"],
    gramBase:500, cal:450, prot:18,  fat:14,  carb:62,   fib:2.0, sod:2400, cal_m:40,  iron:1.5, vitC:2  },
  { id:"udon",       name:"うどん",        emoji:"🍜", keywords:["うどん","ウドン","饂飩"],
    gramBase:400, cal:270, prot:7.0, fat:1.0, carb:55,   fib:1.5, sod:800,  cal_m:20,  iron:0.5, vitC:0  },
  { id:"soba",       name:"そば",          emoji:"🍜", keywords:["そば","ソバ","蕎麦"],
    gramBase:400, cal:268, prot:12,  fat:1.5, carb:51,   fib:2.0, sod:600,  cal_m:24,  iron:1.5, vitC:0  },
  { id:"pasta",      name:"パスタ",        emoji:"🍝", keywords:["パスタ","スパゲッティ","スパゲティ","ペンネ","ミートソース","カルボナーラ","スパゲ"],
    gramBase:250, cal:370, prot:13,  fat:2.0, carb:71,   fib:3.0, sod:5,    cal_m:18,  iron:1.5, vitC:0  },
  { id:"curry",      name:"カレーライス",  emoji:"🍛", keywords:["カレー","カレーライス","curry"],
    gramBase:400, cal:650, prot:18,  fat:20,  carb:95,   fib:4.0, sod:1200, cal_m:50,  iron:2.5, vitC:8  },
  { id:"gyudon",     name:"牛丼",          emoji:"🍚", keywords:["牛丼","ぎゅうどん"],
    gramBase:380, cal:630, prot:22,  fat:18,  carb:89,   fib:1.5, sod:1500, cal_m:60,  iron:3.0, vitC:3  },
  { id:"onigiri",    name:"おにぎり",      emoji:"🍙", keywords:["おにぎり","おむすび","握り飯"],
    gramBase:100, cal:180, prot:3.5, fat:0.7, carb:38.5, fib:0.5, sod:350,  cal_m:6,   iron:0.2, vitC:0  },
  { id:"pizza",      name:"ピザ",          emoji:"🍕", keywords:["ピザ","pizza","ピッツァ"],
    gramBase:200, cal:500, prot:18,  fat:18,  carb:64,   fib:3.0, sod:1100, cal_m:250, iron:2.0, vitC:5  },
  { id:"hamburger",  name:"ハンバーガー",  emoji:"🍔", keywords:["ハンバーガー","バーガー","ビッグマック"],
    gramBase:200, cal:450, prot:17,  fat:20,  carb:50,   fib:2.5, sod:900,  cal_m:100, iron:2.5, vitC:3  },
  // ── タンパク質 ──────────────────────────────────────────────
  { id:"egg",        name:"卵",            emoji:"🥚", keywords:["卵","たまご","タマゴ","玉子","目玉焼き","ゆで卵","スクランブルエッグ","オムレツ","ゆでたまご"],
    gramBase:55,  cal:76,  prot:6.2, fat:5.1, carb:0.1,  fib:0,   sod:75,   cal_m:26,  iron:0.9, vitC:0  },
  { id:"chkbr",      name:"鶏むね肉",      emoji:"🍗", keywords:["鶏むね","鶏胸","サラダチキン","蒸し鶏"],
    gramBase:100, cal:108, prot:22.3,fat:1.5, carb:0.0,  fib:0,   sod:70,   cal_m:5,   iron:0.4, vitC:2  },
  { id:"chicken",    name:"鶏肉・唐揚げ",  emoji:"🍗", keywords:["鶏肉","とりにく","チキン","から揚げ","唐揚げ","からあげ","フライドチキン","焼き鳥"],
    gramBase:100, cal:200, prot:17,  fat:14,  carb:0.0,  fib:0,   sod:75,   cal_m:6,   iron:0.6, vitC:2  },
  { id:"pork",       name:"豚肉",          emoji:"🥩", keywords:["豚肉","豚","ポーク","とんかつ","豚カツ","しょうが焼き","豚バラ","ポークソテー"],
    gramBase:100, cal:216, prot:18.5,fat:15.5,carb:0.0,  fib:0,   sod:60,   cal_m:5,   iron:1.0, vitC:2  },
  { id:"beef",       name:"牛肉",          emoji:"🥩", keywords:["牛肉","牛","ビーフ","ステーキ","焼肉","ハンバーグ","赤身"],
    gramBase:100, cal:259, prot:17.1,fat:21.3,carb:0.3,  fib:0,   sod:65,   cal_m:5,   iron:2.5, vitC:1  },
  { id:"salmon",     name:"鮭・サーモン",  emoji:"🐟", keywords:["鮭","さけ","サーモン","サケ","鮭フレーク","塩鮭"],
    gramBase:100, cal:138, prot:20.1,fat:6.4, carb:0.0,  fib:0,   sod:60,   cal_m:14,  iron:0.4, vitC:3  },
  { id:"tuna",       name:"まぐろ・ツナ",  emoji:"🐟", keywords:["まぐろ","マグロ","ツナ","ツナ缶","鮪"],
    gramBase:100, cal:125, prot:26.4,fat:1.4, carb:0.1,  fib:0,   sod:55,   cal_m:5,   iron:2.0, vitC:2  },
  { id:"saba",       name:"さば",          emoji:"🐠", keywords:["さば","サバ","鯖","さば缶","塩サバ","サバ缶"],
    gramBase:100, cal:202, prot:20.6,fat:13,  carb:0.0,  fib:0,   sod:140,  cal_m:22,  iron:1.4, vitC:0  },
  { id:"natto",      name:"納豆",          emoji:"🫘", keywords:["納豆","なっとう"],
    gramBase:45,  cal:90,  prot:7.4, fat:4.5, carb:4.8,  fib:2.7, sod:4,    cal_m:41,  iron:1.3, vitC:0  },
  { id:"tofu",       name:"豆腐",          emoji:"⬜", keywords:["豆腐","とうふ","冷奴","湯豆腐","絹","木綿"],
    gramBase:150, cal:108, prot:9.9, fat:6.3, carb:1.8,  fib:0.6, sod:15,   cal_m:180, iron:1.8, vitC:0  },
  { id:"edamame",    name:"枝豆",          emoji:"🫛", keywords:["枝豆","えだまめ","エダマメ"],
    gramBase:100, cal:135, prot:11.5,fat:6.1, carb:8.8,  fib:5.0, sod:1,    cal_m:76,  iron:2.5, vitC:27 },
  { id:"liver",      name:"レバー",        emoji:"🥩", keywords:["レバー","肝","きも","鶏レバー","豚レバー","レバニラ"],
    gramBase:100, cal:128, prot:19.6,fat:3.7, carb:3.7,  fib:0,   sod:55,   cal_m:8,   iron:13,  vitC:20 },
  { id:"shrimp",     name:"えび",          emoji:"🦐", keywords:["えび","エビ","海老","シュリンプ","エビフライ"],
    gramBase:100, cal:90,  prot:18.4,fat:0.9, carb:0.3,  fib:0,   sod:260,  cal_m:60,  iron:0.9, vitC:0  },
  // ── 野菜 ──────────────────────────────────────────────────
  { id:"salad",      name:"サラダ",        emoji:"🥗", keywords:["サラダ","レタス","グリーンサラダ","野菜サラダ","コールスロー"],
    gramBase:100, cal:30,  prot:1.5, fat:0.5, carb:5.0,  fib:2.0, sod:50,   cal_m:30,  iron:0.5, vitC:20 },
  { id:"broccoli",   name:"ブロッコリー",  emoji:"🥦", keywords:["ブロッコリー","ブロッコリ"],
    gramBase:100, cal:44,  prot:4.3, fat:0.6, carb:6.6,  fib:4.4, sod:20,   cal_m:50,  iron:1.0, vitC:120},
  { id:"spinach",    name:"ほうれん草",    emoji:"🌿", keywords:["ほうれん草","ほうれんそう","ポパイ"],
    gramBase:100, cal:20,  prot:2.2, fat:0.4, carb:3.1,  fib:2.8, sod:16,   cal_m:49,  iron:2.0, vitC:35 },
  { id:"tomato",     name:"トマト",        emoji:"🍅", keywords:["トマト","tomato","ミニトマト"],
    gramBase:150, cal:29,  prot:1.1, fat:0.2, carb:5.6,  fib:1.5, sod:8,    cal_m:9,   iron:0.3, vitC:23 },
  { id:"carrot",     name:"にんじん",      emoji:"🥕", keywords:["にんじん","人参","ニンジン","キャロット"],
    gramBase:100, cal:35,  prot:0.7, fat:0.1, carb:8.2,  fib:2.5, sod:30,   cal_m:28,  iron:0.2, vitC:6  },
  { id:"cabbage",    name:"キャベツ",      emoji:"🥬", keywords:["キャベツ","cabbage"],
    gramBase:100, cal:23,  prot:1.3, fat:0.2, carb:5.2,  fib:1.8, sod:5,    cal_m:43,  iron:0.3, vitC:41 },
  { id:"potato",     name:"じゃがいも",    emoji:"🥔", keywords:["じゃがいも","ジャガイモ","ポテト","フライドポテト","ポテサラ"],
    gramBase:150, cal:99,  prot:2.4, fat:0.2, carb:22.8, fib:1.6, sod:3,    cal_m:5,   iron:0.5, vitC:45 },
  { id:"swpotato",   name:"さつまいも",    emoji:"🍠", keywords:["さつまいも","サツマイモ","甘藷","スイートポテト"],
    gramBase:200, cal:264, prot:2.4, fat:0.4, carb:63,   fib:5.6, sod:80,   cal_m:80,  iron:1.0, vitC:58 },
  { id:"mushroom",   name:"きのこ",        emoji:"🍄", keywords:["きのこ","キノコ","しいたけ","まいたけ","えのき","しめじ","なめこ","マッシュルーム"],
    gramBase:100, cal:22,  prot:2.5, fat:0.4, carb:3.8,  fib:3.5, sod:2,    cal_m:3,   iron:0.4, vitC:1  },
  { id:"avocado",    name:"アボカド",      emoji:"🥑", keywords:["アボカド","avocado"],
    gramBase:75,  cal:134, prot:1.8, fat:13.1,carb:5.9,  fib:4.0, sod:6,    cal_m:8,   iron:0.4, vitC:9  },
  { id:"seaweed",    name:"海藻・わかめ",  emoji:"🌊", keywords:["わかめ","海藻","のり","昆布","ひじき","海苔","もずく","めかぶ"],
    gramBase:20,  cal:4,   prot:0.4, fat:0.1, carb:0.6,  fib:0.7, sod:190,  cal_m:50,  iron:0.4, vitC:0  },
  { id:"paprika",    name:"パプリカ",      emoji:"🫑", keywords:["パプリカ","ピーマン"],
    gramBase:120, cal:37,  prot:1.2, fat:0.3, carb:8.2,  fib:2.5, sod:2,    cal_m:12,  iron:0.5, vitC:180},
  // ── 果物 ──────────────────────────────────────────────────
  { id:"banana",     name:"バナナ",        emoji:"🍌", keywords:["バナナ","banana"],
    gramBase:100, cal:86,  prot:1.1, fat:0.2, carb:22.5, fib:1.1, sod:1,    cal_m:6,   iron:0.3, vitC:16 },
  { id:"apple",      name:"りんご",        emoji:"🍎", keywords:["りんご","リンゴ","apple"],
    gramBase:130, cal:71,  prot:0.1, fat:0.1, carb:18.9, fib:1.8, sod:1,    cal_m:4,   iron:0.1, vitC:6  },
  { id:"orange",     name:"みかん・オレンジ",emoji:"🍊",keywords:["みかん","オレンジ","橙","柑橘","グレープフルーツ"],
    gramBase:130, cal:56,  prot:0.9, fat:0.1, carb:14.3, fib:1.3, sod:1,    cal_m:27,  iron:0.3, vitC:40 },
  { id:"kiwi",       name:"キウイ",        emoji:"🥝", keywords:["キウイ","kiwi"],
    gramBase:100, cal:53,  prot:1.0, fat:0.2, carb:13.5, fib:2.5, sod:2,    cal_m:33,  iron:0.3, vitC:69 },
  { id:"strawberry", name:"いちご",        emoji:"🍓", keywords:["いちご","苺","ストロベリー"],
    gramBase:150, cal:51,  prot:1.0, fat:0.2, carb:12.9, fib:1.6, sod:1,    cal_m:26,  iron:0.4, vitC:94 },
  // ── 乳製品 ──────────────────────────────────────────────────
  { id:"milk",       name:"牛乳",          emoji:"🥛", keywords:["牛乳","ミルク","milk","コーヒー牛乳","ラテ"],
    gramBase:200, cal:134, prot:6.6, fat:7.6, carb:9.6,  fib:0,   sod:100,  cal_m:220, iron:0.1, vitC:2  },
  { id:"yogurt",     name:"ヨーグルト",    emoji:"🫙", keywords:["ヨーグルト","yogurt","グリークヨーグルト","プロビオ"],
    gramBase:100, cal:62,  prot:3.6, fat:3.0, carb:4.9,  fib:0,   sod:50,   cal_m:120, iron:0.1, vitC:1  },
  { id:"cheese",     name:"チーズ",        emoji:"🧀", keywords:["チーズ","cheese","スライスチーズ","カマンベール","クリームチーズ"],
    gramBase:18,  cal:61,  prot:4.1, fat:4.7, carb:0.3,  fib:0,   sod:200,  cal_m:126, iron:0.1, vitC:0  },
  // ── 汁物 ──────────────────────────────────────────────────
  { id:"miso",       name:"味噌汁",        emoji:"🍵", keywords:["味噌汁","みそ汁","みそしる","お味噌汁"],
    gramBase:180, cal:32,  prot:2.3, fat:1.2, carb:3.3,  fib:1.0, sod:900,  cal_m:40,  iron:0.5, vitC:1  },
  { id:"soup",       name:"野菜スープ",    emoji:"🥣", keywords:["スープ","ポタージュ","コンソメ","ミネストローネ"],
    gramBase:200, cal:60,  prot:2.0, fat:2.0, carb:9.0,  fib:2.0, sod:600,  cal_m:30,  iron:0.5, vitC:10 },
  // ── その他 ──────────────────────────────────────────────────
  { id:"nuts",       name:"ナッツ",        emoji:"🥜", keywords:["ナッツ","くるみ","アーモンド","カシューナッツ","ピーナッツ"],
    gramBase:30,  cal:180, prot:5.4, fat:15.5,carb:6.3,  fib:2.2, sod:2,    cal_m:40,  iron:1.0, vitC:0  },
  { id:"pb_bar",     name:"プロテインバー",emoji:"💪", keywords:["プロテインバー","プロテイン","ホエイ","プロテインシェイク"],
    gramBase:60,  cal:200, prot:20,  fat:6.0, carb:20,   fib:3.0, sod:180,  cal_m:200, iron:3.0, vitC:15 },
  { id:"coffee",     name:"コーヒー",      emoji:"☕", keywords:["コーヒー","珈琲","エスプレッソ","ブラック"],
    gramBase:200, cal:7,   prot:0.2, fat:0.0, carb:1.2,  fib:0,   sod:2,    cal_m:3,   iron:0.1, vitC:0  },
  { id:"snack",      name:"スナック菓子",  emoji:"🍿", keywords:["スナック","ポテチ","ポテトチップス","せんべい"],
    gramBase:60,  cal:320, prot:3.0, fat:18,  carb:37,   fib:1.2, sod:400,  cal_m:10,  iron:0.4, vitC:7  },
  { id:"juice",      name:"ジュース",      emoji:"🧃", keywords:["ジュース","果汁","オレンジジュース","アップルジュース"],
    gramBase:200, cal:92,  prot:0.7, fat:0.1, carb:21.8, fib:0,   sod:2,    cal_m:10,  iron:0.2, vitC:40 },
  { id:"icecream",   name:"アイスクリーム",emoji:"🍨", keywords:["アイス","アイスクリーム","ジェラート","シャーベット"],
    gramBase:90,  cal:170, prot:3.5, fat:8.0, carb:22,   fib:0,   sod:60,   cal_m:110, iron:0.1, vitC:1  },
];

// ════════════════════════════════════════════════════════════
// 4. NUTRITION ADVICE PER DEFICIENCY
// ════════════════════════════════════════════════════════════
const SUPP = {
  protein:  { advice:"毎食に肉・魚・卵・豆類のいずれかを意識的に取り入れましょう。", foods:["鶏むね肉(22g/100g)","卵(6g/個)","納豆(7g/パック)","豆腐(10g/半丁)","ツナ缶"] },
  fat:      { advice:"良質な脂質（魚・ナッツ・アボカド）を意識して取り入れましょう。", foods:["ナッツ類(15g/30g)","アボカド(13g/半個)","さば(13g/100g)","チーズ","オリーブオイル"] },
  carbs:    { advice:"主食（ご飯・パン・麺）でエネルギーをしっかり確保しましょう。",  foods:["ご飯(56g/茶碗)","オートミール(26g/40g)","全粒粉パン(24g/枚)","バナナ","さつまいも"] },
  fiber:    { advice:"野菜・きのこ・海藻・豆類を毎食に加える習慣をつけましょう。",    foods:["ブロッコリー(4.4g/100g)","オートミール(3.2g/40g)","海藻・わかめ","きのこ類","さつまいも(5.6g/個)"] },
  calcium:  { advice:"骨の健康維持のために乳製品・豆腐・小魚を毎日意識しましょう。",  foods:["牛乳(220mg/200ml)","ヨーグルト(120mg/個)","チーズ(126mg/枚)","豆腐(180mg/半丁)","海藻"] },
  iron:     { advice:"鉄分不足は疲れやすさにつながることがあります。赤身肉・緑黄色野菜を取り入れましょう。", foods:["レバー(13mg/100g)","ほうれん草(2mg/束)","枝豆(2.5mg/100g)","納豆(1.3mg/パック)","あさり"] },
  vitaminC: { advice:"野菜・果物から毎日ビタミンCを補うことを意識しましょう。",       foods:["ブロッコリー(120mg/100g)","パプリカ(180mg/個)","キウイ(69mg/個)","いちご(94mg/150g)","みかん"] },
};

// Advice by comparison with daily ref
function genAdvice(totals, ref) {
  const lines = [];
  const pct = k => Math.round((totals[k]||0) / ref[k] * 100);

  if (pct("calories") < 70)
    lines.push({ ico:"⚡", txt:"カロリーが1日の目安より不足しています。主食や間食で補うことを検討してください。", cls:"da-bad" });
  else if (pct("calories") > 125)
    lines.push({ ico:"📊", txt:"カロリーが1日の目安を上回っています。脂質や糖質の多い食品を控えてみましょう。", cls:"da-warn" });

  if (pct("protein") < 65)
    lines.push({ ico:"💪", txt:"タンパク質が不足気味です。毎食に卵・肉・魚・豆類を取り入れましょう。", cls:"da-bad" });
  if (pct("fiber") < 60)
    lines.push({ ico:"🥦", txt:"食物繊維が少なめです。野菜・きのこ・海藻・全粒穀物を意識的に食べましょう。", cls:"da-bad" });
  if (pct("calcium") < 60)
    lines.push({ ico:"🦴", txt:"カルシウムが不足傾向です。牛乳・ヨーグルト・豆腐を日々の食事に加えましょう。", cls:"da-warn" });
  if (pct("iron") < 60)
    lines.push({ ico:"⚙️", txt:"鉄分が不足気味です。レバー・赤身肉・ほうれん草・納豆を取り入れましょう。", cls:"da-warn" });
  if (totals.sodium > ref.sodium)
    lines.push({ ico:"🧂", txt:"塩分摂取が多めです。しょうゆ・みそ・加工食品を控え、出汁や香辛料で風味を出しましょう。", cls:"da-warn" });
  if (pct("vitaminC") < 60)
    lines.push({ ico:"🍊", txt:"ビタミンCが少なめです。ブロッコリー・パプリカ・果物を毎日取り入れましょう。", cls:"da-warn" });

  if (lines.length === 0)
    lines.push({ ico:"✅", txt:"バランスよく摂れています！この食生活を続けましょう。", cls:"da-ok" });

  return lines;
}

// ════════════════════════════════════════════════════════════
// 5. STORAGE
// ════════════════════════════════════════════════════════════
const LS_REC    = "nutri_v3_recs";
const LS_CUSTOM = "nutri_v3_custom";
const LS_GENDER = "nutri_v3_gender";

let records    = tryLoad(LS_REC,    []);
let customDB   = tryLoad(LS_CUSTOM, []);
let currentGender = localStorage.getItem(LS_GENDER) || "male";

function tryLoad(key, def) { try { return JSON.parse(localStorage.getItem(key)) || def; } catch { return def; } }
function saveRec()    { try { localStorage.setItem(LS_REC,    JSON.stringify(records.slice(-80))); } catch(_) {} }
function saveCustom() { try { localStorage.setItem(LS_CUSTOM, JSON.stringify(customDB)); } catch(_) {} }
function saveGender() { localStorage.setItem(LS_GENDER, currentGender); }

// Merged DB (static + custom)
function getDB() { return [...FOOD_DB_STATIC, ...customDB]; }

// ════════════════════════════════════════════════════════════
// 6. GRAM PARSING
// ════════════════════════════════════════════════════════════
const GRAM_RX = /^(.*?)[\s（(【]?\s*(\d+(?:\.\d+)?)\s*(?:g|ｇ|グラム|gram)[\s）)】]?$/i;
const COUNT_RX = /(\d+)\s*(?:個|枚|切れ|本|杯|袋|缶|パック|食|人前|皿|枚|片|粒)/;

function parseInput(text) {
  const raw = text.split(/[,、。\n・]+/).map(s => s.trim()).filter(Boolean);
  const matched = [], unknowns = [];

  raw.forEach(seg => {
    // Extract gram
    let query = seg, userG = null;
    const gm = seg.match(GRAM_RX);
    if (gm) { query = gm[1].trim(); userG = parseFloat(gm[2]); }
    // Remove quantity words from query for matching
    const cleanQ = query.replace(COUNT_RX, "").trim();
    // Count multiplier
    const cntM = seg.match(COUNT_RX) ? parseFloat(seg.match(COUNT_RX)[1]) : 1;

    if (!cleanQ) return;
    const food = findFood(cleanQ);
    if (food) {
      let scale = 1;
      if (userG) {
        scale = userG / food.gramBase;
      } else {
        scale = cntM; // e.g. "卵3個" → scale=3
      }
      scale = Math.max(0.1, Math.round(scale * 10) / 10);
      matched.push({ food, scale, userG, displayName: query });
    } else {
      unknowns.push({ name: query, grams: userG, count: cntM, orig: seg });
    }
  });

  return { matched, unknowns };
}

function findFood(query) {
  const q = query.toLowerCase();
  const DB = getDB();
  let best = null, bestScore = 0;
  DB.forEach(f => {
    (f.keywords || [f.name]).forEach(kw => {
      if (q.includes(kw) || kw.includes(q)) {
        const sc = Math.min(q.length, kw.length) / Math.max(q.length, kw.length);
        if (sc > bestScore) { bestScore = sc; best = f; }
      }
    });
  });
  if (best && bestScore >= 0.3) return best;
  // Partial fallback
  for (const f of DB) {
    for (const kw of (f.keywords || [f.name])) {
      if ((kw.includes(q) && q.length >= 2) || (q.includes(kw) && kw.length >= 2)) return f;
    }
  }
  return null;
}

function scaleNut(food, scale) {
  return {
    calories: food.cal  * scale,
    protein:  food.prot * scale,
    fat:      food.fat  * scale,
    carbs:    food.carb * scale,
    fiber:    food.fib  * scale,
    sodium:   food.sod  * scale,
    calcium:  food.cal_m* scale,
    iron:     food.iron * scale,
    vitaminC: food.vitC * scale,
  };
}

function sumNut(arr) {
  const t = { calories:0,protein:0,fat:0,carbs:0,fiber:0,sodium:0,calcium:0,iron:0,vitaminC:0 };
  arr.forEach(n => Object.keys(t).forEach(k => t[k] += (n[k]||0)));
  Object.keys(t).forEach(k => t[k] = Math.round(t[k]*10)/10);
  return t;
}

function calcFromMatched(matched) {
  return sumNut(matched.map(({ food, scale }) => scaleNut(food, scale)));
}

// ════════════════════════════════════════════════════════════
// 7. WEB SEARCH for unknown foods via Anthropic API
// ════════════════════════════════════════════════════════════
async function searchFoodNutrition(foodName, grams) {
  const gramStr = grams ? `${grams}g` : "1食分（目安）";
  const sys = `あなたは栄養士AIです。食品の栄養素を調べて、以下のJSON形式のみで回答してください。余分な文字・説明・コードブロックは一切不要。
{"calories":数値,"protein":数値,"fat":数値,"carbs":数値,"fiber":数値,"sodium":数値,"calcium":数値,"iron":数値,"vitaminC":数値,"gramBase":数値,"name":"食品名"}
数値は小数点1桁まで。gramBaseは指定した量のg数。`;
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method:"POST",
    headers:{ "Content-Type":"application/json" },
    body:JSON.stringify({
      model:"claude-sonnet-4-20250514",
      max_tokens:400,
      system: sys,
      tools:[{ type:"web_search_20250305", name:"web_search" }],
      messages:[{ role:"user", content:`「${foodName}」${gramStr}の栄養素を調べてください。` }]
    })
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  const raw = data.content?.map(c=>c.text||"").join("").trim();
  const clean = raw.replace(/^```json\s*/i,"").replace(/```\s*$/,"").trim();
  return JSON.parse(clean);
}

// ════════════════════════════════════════════════════════════
// 8. STATE
// ════════════════════════════════════════════════════════════
let curMeal = "breakfast";
let curResult = null;   // { matched, unknowns, nutrients, inputText }
let resolvedExtras = []; // extra nutrients from searched/custom foods
let curUnknowns = [];    // pending unknowns
let customPending = null;// food being manually entered

const MEAL_L = { breakfast:"朝食", lunch:"昼食", dinner:"夕食", snack:"間食" };
const MEAL_I = { breakfast:"🌅",   lunch:"☀️",   dinner:"🌙",   snack:"🫖"  };
function toDS(d){ return `${d.getFullYear()}-${p(d.getMonth()+1)}-${p(d.getDate())}`; }
function p(n){ return String(n).padStart(2,"0"); }
function fmtDate(s){ const d=new Date(s+"T00:00:00"); const W=["日","月","火","水","木","金","土"]; return `${d.getMonth()+1}/${d.getDate()}（${W[d.getDay()]}）`; }
function r1(v){ return Math.round(v*10)/10; }
const $=id=>document.getElementById(id);
const show=id=>$(id).classList.remove("hidden");
const hide=id=>$(id).classList.add("hidden");
function toast(m){ const t=$("toast");t.textContent=m;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),2600); }
function updateBadge(){ const b=$("tab-badge"); b.textContent=records.length; b.style.display=records.length>0?"flex":"none"; }

// ════════════════════════════════════════════════════════════
// 9. INIT
// ════════════════════════════════════════════════════════════
(function init(){
  const d=new Date(); const W=["日","月","火","水","木","金","土"];
  $("hdr-date").textContent=`${d.getFullYear()}.${p(d.getMonth()+1)}.${p(d.getDate())} ${W[d.getDay()]}`;
  $("rec-date").value=toDS(d);

  // Quick chips
  const QUICK=["ご飯","卵","鶏肉","納豆","豆腐","サラダ","ブロッコリー","鮭","牛乳","ヨーグルト","オートミール","バナナ","みかん","ナッツ","海藻","ラーメン","パスタ","味噌汁","アボカド"];
  const qg=$("quick-grid");
  QUICK.forEach(q=>{ const btn=document.createElement("button"); btn.className="q-chip"; btn.textContent=q;
    btn.onclick=()=>{ const ta=$("food-text"); ta.value=ta.value?ta.value.trim()+" "+q:q; ta.focus(); };
    qg.appendChild(btn); });

  // Meal tabs
  $("meal-tabs").addEventListener("click",e=>{ const mt=e.target.closest(".mt"); if(!mt)return;
    document.querySelectorAll(".mt").forEach(b=>b.classList.remove("active")); mt.classList.add("active");
    curMeal=mt.dataset.meal; });

  // Gender toggle
  const gtBtns=document.querySelectorAll(".gt");
  function setGender(g){ currentGender=g; saveGender();
    gtBtns.forEach(b=>b.classList.toggle("active",b.dataset.g===g)); }
  setGender(currentGender);
  gtBtns.forEach(btn=>btn.addEventListener("click",()=>setGender(btn.dataset.g)));

  // Tab nav
  document.querySelectorAll(".tab").forEach(tab=>tab.addEventListener("click",()=>{
    document.querySelectorAll(".tab").forEach(t=>t.classList.remove("active"));
    document.querySelectorAll(".panel").forEach(p=>p.classList.remove("active"));
    tab.classList.add("active"); $("tab-"+tab.dataset.tab).classList.add("active");
    if(tab.dataset.tab==="history") renderHistory();
  }));

  $("btn-calc").addEventListener("click", onCalc);
  $("food-text").addEventListener("keydown",e=>{ if(e.key==="Enter"&&e.ctrlKey) onCalc(); });
  $("btn-save").addEventListener("click", onSave);
  $("btn-back").addEventListener("click",()=>{ hide("card-result"); show("card-input"); hide("new-wrap"); });
  $("btn-new").addEventListener("click",()=>{ $("food-text").value=""; curResult=null; resolvedExtras=[];
    hide("card-result"); hide("new-wrap"); show("card-input"); window.scrollTo({top:0,behavior:"smooth"}); });
  $("btn-search-unk").addEventListener("click", onSearchUnknowns);
  $("btn-clear-all").addEventListener("click",()=>show("del-modal"));
  $("del-cancel").addEventListener("click",()=>hide("del-modal"));
  $("del-ok").addEventListener("click",()=>{ records=[]; saveRec(); updateBadge(); hide("del-modal"); renderHistory(); toast("全データを削除しました"); });
  $("custom-modal-close").addEventListener("click",()=>hide("custom-modal"));
  $("btn-cf-save").addEventListener("click", onCustomSave);

  updateBadge();
})();

// ════════════════════════════════════════════════════════════
// 10. CALCULATE
// ════════════════════════════════════════════════════════════
function onCalc(){
  const text=$("food-text").value.trim();
  if(!text){ toast("食べたものを入力してください"); return; }
  const { matched, unknowns } = parseInput(text);
  resolvedExtras=[];
  curUnknowns=unknowns;

  if(matched.length===0 && unknowns.length===0){ toast("入力を認識できませんでした"); return; }

  const nutrients = matched.length > 0 ? calcFromMatched(matched) : { calories:0,protein:0,fat:0,carbs:0,fiber:0,sodium:0,calcium:0,iron:0,vitaminC:0 };
  curResult={ matched, unknowns, nutrients, inputText:text };

  renderResult();
  hide("card-input"); show("card-result");
  window.scrollTo({top:0,behavior:"smooth"});
}

// ════════════════════════════════════════════════════════════
// 11. RENDER RESULT
// ════════════════════════════════════════════════════════════
function renderResult(){
  const { matched, unknowns, nutrients } = curResult;
  const ref = DAILY_REF[currentGender];

  // Recognized foods
  $("rec-foods").innerHTML = matched.map((m,i)=>{
    const g = m.userG ? `${m.userG}g` : `×${m.scale}`;
    const scaled = m.scale !== 1;
    return `<span class="rf-tag" style="animation-delay:${i*.05}s">
      <span class="rf-ico">${m.food.emoji}</span>${m.food.name}
      ${scaled ? `<span class="rf-scaled">${g}</span>` : ""}
      <span class="rf-g">${Math.round(scaleNut(m.food,m.scale).calories)}kcal</span>
    </span>`;
  }).join("");

  // Unknowns
  if(unknowns.length>0){
    show("unknown-area");
    $("unknown-list").innerHTML = unknowns.map(u=>
      `<div class="unk-item" id="ui-${encodeURIComponent(u.name)}">
        <span class="unk-name">${u.name}${u.grams?` (${u.grams}g)`:""}</span>
        <span class="unk-status unk-pending" id="us-${encodeURIComponent(u.name)}">未検索</span>
      </div>`
    ).join("");
  } else { hide("unknown-area"); }

  // Calorie ring
  const calPct = Math.min(Math.round(nutrients.calories/ref.calories*100),100);
  $("cal-num").textContent = Math.round(nutrients.calories).toLocaleString();
  const circ=213.6, off=circ*(1-calPct/100);
  const f=$("cal-ring-fill"); f.style.strokeDashoffset=circ;
  requestAnimationFrame(()=>requestAnimationFrame(()=>{ f.style.strokeDashoffset=off; }));
  $("cal-ring-pct").textContent=calPct+"%";

  // Macro cards
  const macros=[
    {key:"protein",lbl:"タンパク質",ico:"💪",cls:"mc-protein"},
    {key:"fat",    lbl:"脂質",      ico:"🫒",cls:"mc-fat"},
    {key:"carbs",  lbl:"炭水化物",  ico:"🌾",cls:"mc-carbs"},
  ];
  $("macro-cards").innerHTML=macros.map(m=>{
    const val=nutrients[m.key], pct=Math.round(val/ref[m.key]*100);
    const st=pct<40?"mc-bad":pct>130?"mc-warn":"mc-ok";
    const lbl=pct<40?`不足 ${pct}%`:pct>130?`過多 ${pct}%`:`${pct}%`;
    return `<div class="mc ${m.cls} ${st}">
      <div class="mc-ico">${m.ico}</div>
      <div class="mc-lbl">${m.lbl}</div>
      <div class="mc-val">${r1(val)}<span class="mc-unit"> ${m.key==="calories"?"kcal":"g"}</span></div>
      <div class="mc-pct">${lbl}</div>
    </div>`;
  }).join("");

  // Nutrient rows
  const NUT_DEFS=[
    {k:"calories",  lbl:"カロリー",   ico:"🔥",u:"kcal",max:false},
    {k:"protein",   lbl:"タンパク質", ico:"💪",u:"g",   max:false},
    {k:"fat",       lbl:"脂質",       ico:"🫒",u:"g",   max:false},
    {k:"carbs",     lbl:"炭水化物",   ico:"🌾",u:"g",   max:false},
    {k:"fiber",     lbl:"食物繊維",   ico:"🥦",u:"g",   max:false},
    {k:"sodium",    lbl:"塩分",       ico:"🧂",u:"mg",  max:true},
    {k:"calcium",   lbl:"カルシウム", ico:"🦴",u:"mg",  max:false},
    {k:"iron",      lbl:"鉄分",       ico:"⚙️",u:"mg", max:false},
    {k:"vitaminC",  lbl:"ビタミンC",  ico:"🍊",u:"mg",  max:false},
  ];
  $("nut-rows").innerHTML=NUT_DEFS.map(d=>{
    const val=nutrients[d.k]||0, tgt=ref[d.k];
    const pct=Math.min(Math.round(val/tgt*100),130);
    const isMax=d.max;
    let fc="nf-ok",pc="pct-ok",pl=`${pct}%`;
    if(isMax){ if(pct>100){fc="nf-warn";pc="pct-warn";pl=`摂りすぎ ${pct}%`;} }
    else { if(pct<40){fc="nf-bad";pc="pct-bad";pl=`不足 ${pct}%`;} else if(pct>130){fc="nf-warn";pc="pct-warn";pl=`過多 ${pct}%`;} }
    return `<div class="nr">
      <span class="nr-ico">${d.ico}</span>
      <div class="nr-info">
        <div class="nr-name">${d.lbl}</div>
        <div class="nr-bar"><div class="nr-fill ${fc}" style="width:0%" data-w="${Math.min(pct,100)}%"></div></div>
      </div>
      <div class="nr-right">
        <div class="nr-val">${r1(val)}<span class="nr-unit"> ${d.u}</span></div>
        <div class="nr-pct ${pc}">${pl}</div>
      </div>
    </div>`;
  }).join("");
  requestAnimationFrame(()=>requestAnimationFrame(()=>{
    document.querySelectorAll(".nr-fill").forEach(el=>el.style.width=el.dataset.w);
  }));

  // Daily cumulative
  renderDailyCum(nutrients, ref);

  // Deficits & Advice
  renderDeficitAdvice(nutrients, ref);

  // Affiliate
  renderAffiliate(nutrients, ref);
}

function renderDailyCum(mealNut, ref){
  const today=toDS(new Date());
  const todayTotal=sumNut([...records.filter(r=>r.date===today).map(r=>r.nutrients), mealNut]);
  const genderLbl=currentGender==="male"?"男性":"女性";

  const rows=[
    {k:"calories",lbl:"カロリー",ico:"🔥",u:"kcal"},
    {k:"protein", lbl:"タンパク質",ico:"💪",u:"g"},
    {k:"fat",     lbl:"脂質",     ico:"🫒",u:"g"},
    {k:"carbs",   lbl:"炭水化物", ico:"🌾",u:"g"},
    {k:"fiber",   lbl:"食物繊維", ico:"🥦",u:"g"},
  ];

  $("daily-cum").innerHTML=`
    <div class="daily-cum">
      <div class="dc-title">📊 本日の累計（${genderLbl}の1日目安との比較）</div>
      ${rows.map(d=>{
        const v=todayTotal[d.k]||0, tgt=ref[d.k];
        const pct=Math.min(Math.round(v/tgt*100),130);
        const fc=pct<40?"dc-bad":pct>125?"dc-warn":"dc-ok";
        return `<div class="dc-row">
          <div class="dc-row-hd">
            <span class="dc-lbl">${d.ico} ${d.lbl}</span>
            <span class="dc-nums">${r1(v)} / ${tgt} ${d.u}　${pct}%</span>
          </div>
          <div class="dc-track"><div class="dc-fill ${fc}" style="width:0%" data-w="${Math.min(pct,100)}%"></div></div>
        </div>`;
      }).join("")}
    </div>`;
  requestAnimationFrame(()=>requestAnimationFrame(()=>{
    document.querySelectorAll(".dc-fill").forEach(el=>el.style.width=el.dataset.w);
  }));
}

function renderDeficitAdvice(nutrients, ref){
  const minKeys=["protein","fat","carbs","fiber","calcium","iron","vitaminC"];
  const deficits=minKeys.filter(k=>(nutrients[k]||0)/ref[k]*100<40);
  const sodEx=nutrients.sodium>ref.sodium;

  const db=$("deficit-box");
  if(deficits.length===0&&!sodEx){
    db.innerHTML=`<div class="all-good">🎉 この食事の栄養バランスは良好です！</div>`;
  } else {
    const tags=deficits.map(k=>{const r=DAILY_REF[currentGender]; return `<span class="def-tag">${{calories:"🔥",protein:"💪",fat:"🫒",carbs:"🌾",fiber:"🥦",calcium:"🦴",iron:"⚙️",vitaminC:"🍊"}[k]||""} ${["protein","fat","carbs","fiber","calcium","iron","vitaminC"].includes(k)?{protein:"タンパク質",fat:"脂質",carbs:"炭水化物",fiber:"食物繊維",calcium:"カルシウム",iron:"鉄分",vitaminC:"ビタミンC"}[k]:k}不足</span>`;}).join("");
    const sodTag=sodEx?`<span class="def-tag" style="background:var(--amber);color:#fff;border-color:transparent">🧂 塩分過多</span>`:"";
    db.innerHTML=`<div class="db-hd">⚠ 不足・過剰な栄養素</div><div class="db-body"><div class="deficit-tags">${tags}${sodTag}</div></div>`;
  }

  // Simple advice
  const adviceLbl={protein:"タンパク質",fat:"脂質",carbs:"炭水化物",fiber:"食物繊維",calcium:"カルシウム",iron:"鉄分",vitaminC:"ビタミンC"};
  const advLines=deficits.slice(0,3).map(k=>{const s=SUPP[k];return `<div class="advice-item"><span class="advice-ico">${{protein:"💪",fat:"🫒",carbs:"🌾",fiber:"🥦",calcium:"🦴",iron:"⚙️",vitaminC:"🍊"}[k]}</span><div><strong>${adviceLbl[k]}</strong>: ${s.advice}</div></div>`; }).join("");
  $("advice-box").innerHTML=advLines?`<div class="advice-hd">食生活のポイント</div>${advLines}`:"";
}

function renderAffiliate(nutrients, ref){
  const pct=k=>Math.round((nutrients[k]||0)/ref[k]*100);
  const links=[];
  if(pct("protein")<60)  links.push(...AFFILIATE.protein.slice(0,2));
  if(pct("fiber")<60)    links.push(...AFFILIATE.fiber.slice(0,2));
  if(pct("fat")>130||(nutrients.fat||0)>ref.fat*1.3) links.push(...AFFILIATE.lowfat.slice(0,1));
  if(pct("calories")>120) links.push(...AFFILIATE.lowcal.slice(0,1));

  const aff=$("aff-section");
  if(links.length===0){ hide("aff-section"); return; }
  show("aff-section");
  $("aff-cards").innerHTML=links.slice(0,4).map(l=>`
    <a href="${l.url}" target="_blank" rel="noopener noreferrer sponsored" class="aff-card ${l.type}">
      <span class="aff-ico">${l.emoji}</span>
      <div class="aff-body">
        <div class="aff-name">${l.name}</div>
        <div class="aff-desc">${l.desc}</div>
      </div>
      <span class="aff-arrow">›</span>
    </a>`).join("");
}

// ════════════════════════════════════════════════════════════
// 12. UNKNOWN FOOD SEARCH
// ════════════════════════════════════════════════════════════
async function onSearchUnknowns(){
  const btn=$("btn-search-unk");
  btn.disabled=true; btn.textContent="検索中...";

  for(const unk of curUnknowns){
    const uid=encodeURIComponent(unk.name);
    const sEl=$(`us-${uid}`);
    if(sEl){ sEl.className="unk-status unk-loading"; sEl.textContent="検索中…"; }

    try {
      const res=await searchFoodNutrition(unk.name, unk.grams);
      // Add as custom-like entry to resolved extras
      const grams=unk.grams||res.gramBase||100;
      const scale=grams/(res.gramBase||100);
      const nut={
        calories:(res.calories||0)*scale,
        protein: (res.protein ||0)*scale,
        fat:     (res.fat     ||0)*scale,
        carbs:   (res.carbs   ||0)*scale,
        fiber:   (res.fiber   ||0)*scale,
        sodium:  (res.sodium  ||0)*scale,
        calcium: (res.calcium ||0)*scale,
        iron:    (res.iron    ||0)*scale,
        vitaminC:(res.vitaminC||0)*scale,
      };
      resolvedExtras.push({ name:unk.name, nut });
      if(sEl){ sEl.className="unk-status unk-found"; sEl.textContent=`検索完了 ${Math.round(nut.calories)}kcal`; }

      // Update display
      updateWithExtras();

    } catch(err) {
      if(sEl){
        sEl.className="unk-status unk-failed"; sEl.textContent="見つかりません";
        const item=sEl.closest(".unk-item");
        if(item){
          const mb=document.createElement("button");
          mb.className="unk-manual"; mb.textContent="手動入力";
          mb.onclick=()=>openCustomModal(unk.name, unk.grams);
          item.appendChild(mb);
        }
      }
    }
  }

  btn.disabled=false; btn.textContent="再検索";
}

function updateWithExtras(){
  if(!curResult) return;
  const base=curResult.nutrients;
  const extras=resolvedExtras.map(e=>e.nut);
  const merged=sumNut([base,...extras]);
  curResult.mergedNutrients=merged;
  renderResult();
}

// ════════════════════════════════════════════════════════════
// 13. CUSTOM FOOD MODAL
// ════════════════════════════════════════════════════════════
function openCustomModal(name, grams){
  customPending={ name, grams };
  $("custom-modal-title").textContent=`「${name}」の栄養情報を入力`;
  $("cf-name").value=name;
  $("cf-cal").value=""; $("cf-prot").value=""; $("cf-fat").value=""; $("cf-carb").value=""; $("cf-gram").value=grams||"";
  show("custom-modal");
}

function onCustomSave(){
  if(!customPending) return;
  const cal=parseFloat($("cf-cal").value)||0;
  const prot=parseFloat($("cf-prot").value)||0;
  const fat=parseFloat($("cf-fat").value)||0;
  const carb=parseFloat($("cf-carb").value)||0;
  const gram=parseFloat($("cf-gram").value)||100;
  if(cal===0&&prot===0&&fat===0){ toast("カロリーまたはタンパク質・脂質を入力してください"); return; }

  // Save to custom DB for future use
  const newFood={
    id:"custom_"+Date.now(), name:customPending.name, emoji:"🍴",
    keywords:[customPending.name, customPending.name.toLowerCase()],
    gramBase:gram, cal, prot, fat, carb, fib:0, sod:0, cal_m:0, iron:0, vitC:0,
  };
  customDB.push(newFood); saveCustom();

  // Add to resolved extras
  const userG=customPending.grams||gram;
  const scale=userG/gram;
  resolvedExtras.push({ name:customPending.name, nut:{
    calories:cal*scale, protein:prot*scale, fat:fat*scale, carbs:carb*scale,
    fiber:0, sodium:0, calcium:0, iron:0, vitaminC:0,
  }});

  hide("custom-modal");
  toast(`「${customPending.name}」を登録しました。次回から自動認識されます。`);

  // Update status
  const uid=encodeURIComponent(customPending.name);
  const sEl=$(`us-${uid}`);
  if(sEl){ sEl.className="unk-status unk-found"; sEl.textContent=`手動登録 ${Math.round(cal*scale)}kcal`; }

  updateWithExtras();
  customPending=null;
}

// ════════════════════════════════════════════════════════════
// 14. SAVE
// ════════════════════════════════════════════════════════════
function onSave(){
  if(!curResult) return;
  const nut=curResult.mergedNutrients||curResult.nutrients;
  const rec={
    id:Date.now(), timestamp:Date.now(),
    date:$("rec-date").value||toDS(new Date()),
    mealTime:curMeal,
    foods:curResult.matched.map(m=>m.food.name).concat(resolvedExtras.map(e=>e.name)).join("・"),
    inputText:curResult.inputText,
    calories:Math.round(nut.calories),
    nutrients:{ ...nut },
  };
  records.push(rec); saveRec(); updateBadge();
  hide("btn-save"); show("new-wrap");
  toast("✓ 食事を保存しました！");
}

// ════════════════════════════════════════════════════════════
// 15. HISTORY
// ════════════════════════════════════════════════════════════
function renderHistory(){
  if(records.length===0){ show("hist-empty"); hide("hist-main"); return; }
  hide("hist-empty"); show("hist-main");
  const today=toDS(new Date());
  const todayRecs=records.filter(r=>r.date===today);
  renderDailyChart(todayRecs);
  renderCompare(today);
  renderTrend();
  renderChronic();
  renderHistList();
}

function sumRecs(recs){ return sumNut(recs.map(r=>r.nutrients)); }

function renderDailyChart(todayRecs){
  const t=sumRecs(todayRecs), ref=DAILY_REF[currentGender];
  const gLbl=currentGender==="male"?"一般男性（30〜49歳）":"一般女性（30〜49歳）";
  $("chart-gender-note").textContent=`比較基準: ${gLbl}の1日の摂取目安（日本人の食事摂取基準2020年版）`;
  $("t-big")||null; // not present in history, only in today-cal-card below

  const NUT=[
    {k:"calories",lbl:"カロリー",   ico:"🔥",u:"kcal"},
    {k:"protein", lbl:"タンパク質", ico:"💪",u:"g"},
    {k:"fat",     lbl:"脂質",       ico:"🫒",u:"g"},
    {k:"carbs",   lbl:"炭水化物",   ico:"🌾",u:"g"},
    {k:"fiber",   lbl:"食物繊維",   ico:"🥦",u:"g"},
    {k:"calcium", lbl:"カルシウム", ico:"🦴",u:"mg"},
    {k:"iron",    lbl:"鉄分",       ico:"⚙️",u:"mg"},
    {k:"vitaminC",lbl:"ビタミンC",  ico:"🍊",u:"mg"},
  ];

  $("daily-chart").innerHTML=NUT.map(d=>{
    const v=t[d.k]||0, tgt=ref[d.k];
    const pct=Math.min(Math.round(v/tgt*100),130);
    const barW=Math.min(pct,100);
    const fc=pct<40?"dch-bad":pct>125?"dch-warn":"dch-ok";
    const pc=pct<40?"pct-bad":pct>125?"pct-warn":"pct-ok";
    const pl=pct<40?`不足 ${pct}%`:pct>125?`過多 ${pct}%`:`${pct}%`;
    // target line at 100%
    return `<div class="dch-row">
      <div class="dch-lbl"><span class="dch-ico">${d.ico}</span>${d.lbl}</div>
      <div class="dch-bar-wrap">
        <div class="dch-bar ${fc}" style="width:0%" data-w="${barW}%"></div>
        <div class="dch-target-line" style="left:100%"></div>
      </div>
      <div class="dch-nums">${r1(v)}<span style="color:var(--text3);font-size:.6rem"> /${tgt}${d.u}</span><br>
        <span class="dch-pct ${pc}">${pl}</span>
      </div>
    </div>`;
  }).join("");

  requestAnimationFrame(()=>requestAnimationFrame(()=>{
    document.querySelectorAll(".dch-bar").forEach(el=>el.style.width=el.dataset.w);
  }));

  // Advice
  const advice=genAdvice(t, ref);
  $("daily-advice-list").innerHTML=advice.map(a=>`
    <div class="da-item ${a.cls}"><span class="da-ico">${a.ico}</span><span>${a.txt}</span></div>`).join("");
}

function renderCompare(today){
  const yd=new Date(); yd.setDate(yd.getDate()-1);
  const yStr=toDS(yd);
  const tN=sumRecs(records.filter(r=>r.date===today));
  const yN=sumRecs(records.filter(r=>r.date===yStr));
  const body=$("cmp-body");
  if(!records.find(r=>r.date===yStr)){ body.innerHTML=`<p class="cmp-nodata">昨日のデータがありません</p>`; return; }
  const keys=["calories","protein","fat","carbs","fiber"];
  const icons={calories:"🔥",protein:"💪",fat:"🫒",carbs:"🌾",fiber:"🥦"};
  const lbls={calories:"カロリー",protein:"タンパク質",fat:"脂質",carbs:"炭水化物",fiber:"食物繊維"};
  const units={calories:"kcal",protein:"g",fat:"g",carbs:"g",fiber:"g"};
  body.innerHTML=keys.map(k=>{
    const tv=tN[k]||0,yv=yN[k]||0,diff=tv-yv;
    const pctD=yv>0?Math.round(diff/yv*100):0;
    const dc=diff>3?"d-up":diff<-3?"d-down":"d-zero";
    const sign=diff>3?"▲":diff<-3?"▼":"─";
    return `<div class="cmp-row">
      <span class="cmp-ico">${icons[k]}</span>
      <span class="cmp-name">${lbls[k]}</span>
      <span class="cmp-v cmp-today">${r1(tv)}<small style="color:var(--text3);font-size:.58rem"> ${units[k]}</small></span>
      <span class="cmp-v cmp-yest">${r1(yv)}</span>
      <span class="cmp-delta ${dc}">${sign}${Math.abs(pctD)}%</span>
    </div>`;
  }).join("");
}

function renderTrend(){
  const days=[]; for(let i=6;i>=0;i--){ const d=new Date(); d.setDate(d.getDate()-i); days.push(toDS(d)); }
  const today=toDS(new Date());
  const data=days.map(ds=>{ const rs=records.filter(r=>r.date===ds); return {date:ds,cal:rs.reduce((s,r)=>s+(r.calories||0),0),has:rs.length>0}; });
  const maxCal=Math.max(...data.map(d=>d.cal),DAILY_REF[currentGender].calories,1);
  const WD=["日","月","火","水","木","金","土"];
  $("trend-wrap").innerHTML=`
    <div class="trend-bars">${data.map(d=>{
      const h=d.has?Math.round(d.cal/maxCal*82):3;
      const cls=d.date===today?"tb-today":d.has?"tb-data":"tb-empty";
      return `<div class="tb-col"><div class="tb-val">${d.has?Math.round(d.cal/100)*100:""}</div><div class="tb-bar ${cls}" style="height:${h}px"></div></div>`;
    }).join("")}</div>
    <div class="trend-labels">${days.map(ds=>{const d=new Date(ds+"T00:00:00");return `<div class="tl">${WD[d.getDay()]}</div>`;}).join("")}</div>`;
}

function renderChronic(){
  const cutoff=new Date(); cutoff.setDate(cutoff.getDate()-7);
  const recent=records.filter(r=>r.date>=toDS(cutoff));
  const cb=$("chronic-body");
  if(recent.length<2){ cb.innerHTML=`<div class="ch-ok">📊 2食以上記録すると慢性的な不足を分析できます</div>`; return; }
  const byDate={};
  recent.forEach(r=>{ if(!byDate[r.date]) byDate[r.date]=[]; byDate[r.date].push(r); });
  const dates=Object.keys(byDate);
  const ref=DAILY_REF[currentGender];
  const minKeys=["protein","fat","carbs","fiber","calcium","iron","vitaminC"];
  const analysis=minKeys.map(k=>{
    const avg=dates.reduce((s,ds)=>{const n=sumRecs(byDate[ds]);return s+(n[k]||0)/ref[k]*100;},0)/dates.length;
    return {k, avg:Math.round(avg)};
  }).filter(a=>a.avg<75).sort((a,b)=>a.avg-b.avg);

  if(analysis.length===0){ cb.innerHTML=`<div class="ch-ok">🎉 直近7日間のバランスは概ね良好です！</div>`; return; }
  const ICONS={protein:"💪",fat:"🫒",carbs:"🌾",fiber:"🥦",calcium:"🦴",iron:"⚙️",vitaminC:"🍊"};
  const LBLS={protein:"タンパク質",fat:"脂質",carbs:"炭水化物",fiber:"食物繊維",calcium:"カルシウム",iron:"鉄分",vitaminC:"ビタミンC"};
  cb.innerHTML=analysis.map(({k,avg})=>{
    const sev=avg<40?"dot-hi":avg<60?"dot-mid":"dot-lo";
    const s=SUPP[k]||{};
    return `<div class="ch-card">
      <div class="ch-hd"><div class="ch-dot ${sev}"></div><span class="ch-nut">${ICONS[k]} ${LBLS[k]}</span><span class="ch-pct">平均達成率 ${avg}%</span></div>
      <div class="ch-body">
        <div class="ch-advice">${s.advice||""}</div>
        <div class="ch-foods">${(s.foods||[]).map(f=>`<span class="ch-ftag">${f}</span>`).join("")}</div>
      </div>
    </div>`;
  }).join("");
}

function renderHistList(){
  const sorted=[...records].sort((a,b)=>b.timestamp-a.timestamp);
  const byDate={};
  sorted.forEach(r=>{ if(!byDate[r.date]) byDate[r.date]=[]; byDate[r.date].push(r); });
  const today=toDS(new Date());
  const hl=$("hist-list");
  hl.innerHTML=Object.entries(byDate).map(([date,recs])=>`
    <div class="hday">
      <div class="hday-lbl">${date===today?"今日":fmtDate(date)}</div>
      ${recs.map(r=>`
        <div class="hmeal">
          <span class="hm-meal">${MEAL_I[r.mealTime]}${MEAL_L[r.mealTime]}</span>
          <span class="hm-foods" title="${r.foods}">${r.foods}</span>
          <span class="hm-cal">${Math.round(r.calories).toLocaleString()}<small> kcal</small></span>
          <button class="hm-del" data-id="${r.id}">✕</button>
        </div>`).join("")}
    </div>`).join("");
  hl.querySelectorAll(".hm-del").forEach(btn=>btn.addEventListener("click",()=>{
    records=records.filter(r=>r.id!==Number(btn.dataset.id)); saveRec(); updateBadge(); renderHistory(); toast("記録を削除しました");
  }));
}
