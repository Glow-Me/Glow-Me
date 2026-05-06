/* ============================================================
   Glow Me — script.js
   Category-based nutrition tracker
   ============================================================ */
"use strict";

// ═══════════════════════════════════════════════════════════
// ▼▼▼ カテゴリデータベース（ここに追加すると自動で反映されます）▼▼▼
// ═══════════════════════════════════════════════════════════
// perServing: 一般的な1食分の栄養値
// servingMl: 飲み物の場合、1サービングのml数
// keys: B1/B2/B6 単位はmg
const categories = {
  rice:          { label:"ご飯・米類",       emoji:"🍚", color:"#C4A96B",
    keywords:["ご飯","白飯","おにぎり","チャーハン","ライス","丼","玄米","雑炊","おじや","もち","餅","赤飯","炊き込みご飯"],
    perServing:{cal:252,prot:3.8,fat:0.5,carb:55.7,fib:0.5,sod:2,cal_m:5,iron:0.2,vitC:0,B1:0.02,B2:0.02,B6:0.02}},
  bread:         { label:"パン類",           emoji:"🍞", color:"#D4A46A",
    keywords:["パン","トースト","サンドイッチ","バゲット","クロワッサン","食パン","ロールパン","フランスパン","ピザ","ナン","ベーグル","マフィン","ホットドッグ","バーガーバンズ"],
    perServing:{cal:195,prot:6,fat:4,carb:35,fib:2,sod:340,cal_m:30,iron:0.8,vitC:0,B1:0.07,B2:0.05,B6:0.03}},
  oatmeal:       { label:"オートミール",     emoji:"🌾", color:"#B8A060",
    keywords:["オートミール","オーツ","オーツ麦","燕麦","シリアル","グラノーラ","コーンフレーク","ミューズリー"],
    perServing:{cal:152,prot:5.1,fat:2.8,carb:26.4,fib:3.2,sod:2,cal_m:18,iron:1.6,vitC:0,B1:0.18,B2:0.05,B6:0.05}},
  noodle:        { label:"麺類",             emoji:"🍜", color:"#E8B86D",
    keywords:["ラーメン","うどん","そば","パスタ","スパゲッティ","焼きそば","そうめん","ひやむぎ","フォー","ビーフン","冷麺","つけ麺","担々麺","スパゲ","ペンネ","フェットチーネ"],
    perServing:{cal:380,prot:13,fat:6,carb:65,fib:2,sod:1200,cal_m:30,iron:1.5,vitC:2,B1:0.15,B2:0.08,B6:0.06}},
  // ── 肉類 ──────────────────────────────────────────────
  chicken:       { label:"鶏肉料理",         emoji:"🍗", color:"#D4956B",
    keywords:["唐揚げ","から揚げ","からあげ","鶏肉","チキン","焼き鳥","サラダチキン","手羽","ローストチキン","チキンカレー","蒸し鶏","チキンソテー","鶏","とり","チキンナゲット","もも","むね","ザンギ"],
    perServing:{cal:220,prot:20,fat:12,carb:5,fib:0,sod:500,cal_m:10,iron:0.8,vitC:2,B1:0.1,B2:0.2,B6:0.5}},
  pork:          { label:"豚肉料理",         emoji:"🥩", color:"#D4906B",
    keywords:["豚肉","生姜焼き","とんかつ","豚バラ","ポーク","豚","ロース","豚丼","角煮","ポークソテー","ソーセージ","ウインナー","シャウエッセン","ハム","ベーコン","豚しゃぶ","豚テキ","スペアリブ","豚足"],
    perServing:{cal:300,prot:22,fat:20,carb:8,fib:0,sod:600,cal_m:10,iron:1.5,vitC:2,B1:0.7,B2:0.2,B6:0.4}},
  beef:          { label:"牛肉料理",         emoji:"🥩", color:"#C4705A",
    keywords:["焼肉","ステーキ","牛肉","ビーフ","ハンバーグ","牛丼","すき焼き","ローストビーフ","牛","赤身","ユッケ","カルビ","ロース","タン","ホルモン","もつ","内臓","メンチカツ"],
    perServing:{cal:350,prot:25,fat:25,carb:5,fib:0,sod:400,cal_m:8,iron:3.0,vitC:1,B1:0.08,B2:0.2,B6:0.4}},
  // ── 魚介類 ──────────────────────────────────────────────
  fish:          { label:"魚介類",           emoji:"🐟", color:"#5A8AA8",
    keywords:["魚","刺身","寿司","鮭","サーモン","まぐろ","さば","鯖","いわし","たら","さんま","あじ","えび","エビ","イカ","タコ","貝","ほたて","あさり","かに","カニ","海鮮","焼き魚","煮魚","ブリ","ひらめ","かれい","アジフライ","エビフライ","いくら","サーモン","白身魚","ツナ","かつお","シーフード"],
    perServing:{cal:180,prot:22,fat:8,carb:2,fib:0,sod:300,cal_m:50,iron:1.5,vitC:3,B1:0.2,B2:0.3,B6:0.4}},
  // ── 野菜・食物繊維 ──────────────────────────────────────
  vegetable:     { label:"野菜類",           emoji:"🥦", color:"#5A9E6B",
    keywords:["野菜","サラダ","ブロッコリー","ほうれん草","キャベツ","にんじん","トマト","レタス","きゅうり","大根","玉ねぎ","ピーマン","パプリカ","なす","ごぼう","れんこん","もやし","白菜","小松菜","チンゲン菜","セロリ","アスパラ","オクラ","コーン","アボカド","じゃがいも","さつまいも","かぼちゃ","ズッキーニ","トマト","長ネギ","ねぎ","にんにく","しょうが","生姜","芋"],
    perServing:{cal:45,prot:2,fat:0.3,carb:9,fib:3,sod:20,cal_m:50,iron:1.0,vitC:40,B1:0.1,B2:0.1,B6:0.12}},
  fermented:     { label:"発酵・漬物類",     emoji:"🫙", color:"#8A9E5A",
    keywords:["キムチ","納豆","ぬか漬け","漬物","塩麹","甘酒","テンペ","コンブチャ","ピクルス","ザワークラウト"],
    perServing:{cal:80,prot:7,fat:4,carb:5,fib:2.5,sod:300,cal_m:80,iron:1.0,vitC:2,B1:0.08,B2:0.15,B6:0.15}},
  seaweed_mush:  { label:"海藻・きのこ類",   emoji:"🍄", color:"#6A8E5A",
    keywords:["海藻","わかめ","のり","昆布","ひじき","もずく","海苔","きのこ","しいたけ","えのき","しめじ","まいたけ","なめこ","マッシュルーム","めかぶ","アオサ","モズク","乾燥わかめ"],
    perServing:{cal:15,prot:1.5,fat:0.2,carb:3,fib:2.5,sod:150,cal_m:40,iron:0.5,vitC:1,B1:0.05,B2:0.2,B6:0.06}},
  beans:         { label:"豆類",             emoji:"🫘", color:"#8A7A5A",
    keywords:["豆腐","大豆","枝豆","豆","ひよこ豆","レンズ豆","きなこ","きな粉","厚揚げ","油揚げ","高野豆腐","がんも","湯豆腐","冷奴","豆乳","黒豆","小豆","あずき","いんげん"],
    perServing:{cal:120,prot:10,fat:5,carb:10,fib:4,sod:10,cal_m:100,iron:2.0,vitC:5,B1:0.15,B2:0.1,B6:0.12}},
  egg:           { label:"卵料理",           emoji:"🥚", color:"#D4C06B",
    keywords:["卵","たまご","玉子","目玉焼き","ゆで卵","スクランブルエッグ","オムレツ","オムライス","卵焼き","茶碗蒸し","だし巻き","温泉卵","半熟卵","ポーチドエッグ"],
    perServing:{cal:76,prot:6.2,fat:5.1,carb:0.1,fib:0,sod:75,cal_m:26,iron:0.9,vitC:0,B1:0.05,B2:0.22,B6:0.08}},
  // ── 乳製品 ──────────────────────────────────────────────
  dairy:         { label:"乳製品",           emoji:"🥛", color:"#C8D8B0",
    keywords:["牛乳","ミルク","チーズ","ヨーグルト","生クリーム","アイスクリーム","アイス","乳","クリーム","カッテージチーズ","リコッタ","モッツァレラ","グリークヨーグルト"],
    perServing:{cal:130,prot:6,fat:7,carb:10,fib:0,sod:100,cal_m:200,iron:0.1,vitC:1,B1:0.05,B2:0.2,B6:0.06}},
  // ── 果物 ──────────────────────────────────────────────
  fruit:         { label:"果物",             emoji:"🍎", color:"#E88A7A",
    keywords:["果物","りんご","バナナ","みかん","オレンジ","いちご","ぶどう","桃","スイカ","メロン","梨","キウイ","マンゴー","グレープフルーツ","ブルーベリー","柿","さくらんぼ","パイナップル","レモン","ライム","フルーツ","いちじく","プルーン","ドライフルーツ","干しぶどう"],
    perServing:{cal:80,prot:0.8,fat:0.2,carb:20,fib:2,sod:2,cal_m:15,iron:0.3,vitC:35,B1:0.05,B2:0.03,B6:0.1}},
  // ── カレー・シチュー ──────────────────────────────────────
  curry_stew:    { label:"カレー・シチュー", emoji:"🍛", color:"#C8A040",
    keywords:["カレー","シチュー","ビーフシチュー","クリームシチュー","グラタン","ドリア","カレーライス"],
    perServing:{cal:550,prot:18,fat:16,carb:80,fib:4,sod:1100,cal_m:50,iron:2.5,vitC:8,B1:0.2,B2:0.15,B6:0.3}},
  // ── ファストフード ──────────────────────────────────────
  fastfood:      { label:"ファストフード",   emoji:"🍔", color:"#D4803A",
    keywords:["ハンバーガー","フライドポテト","ポテト","バーガー","マクドナルド","モス","ケンタッキー","ナゲット","フライドチキン","ホットドッグ","タコス"],
    perServing:{cal:500,prot:20,fat:25,carb:55,fib:3,sod:1000,cal_m:100,iron:2.5,vitC:10,B1:0.2,B2:0.15,B6:0.2}},
  // ── 菓子・スイーツ ──────────────────────────────────────
  sweets:        { label:"菓子・スイーツ",   emoji:"🍰", color:"#D4A8C8",
    keywords:["ケーキ","チョコ","チョコレート","クッキー","ドーナツ","プリン","ゼリー","大福","まんじゅう","和菓子","スイーツ","お菓子","デザート","シュークリーム","エクレア","タルト","パフェ","ブラウニー","マカロン","ワッフル","クレープ","アイス","ソフトクリーム","モナカ"],
    perServing:{cal:280,prot:3,fat:12,carb:38,fib:1,sod:100,cal_m:50,iron:0.5,vitC:0,B1:0.05,B2:0.1,B6:0.03}},
  snack:         { label:"スナック",         emoji:"🍿", color:"#D4B86B",
    keywords:["スナック","ポテチ","ポテトチップス","せんべい","あられ","おかき","クラッカー","おつまみ","柿の種","チップス","ポップコーン","プリッツ","じゃがりこ","チーズ鱈","ビーフジャーキー","するめ"],
    perServing:{cal:250,prot:3,fat:15,carb:28,fib:1,sod:400,cal_m:15,iron:0.5,vitC:5,B1:0.05,B2:0.04,B6:0.05}},
  // ── 酒類 ──────────────────────────────────────────────
  beer:          { label:"ビール・発泡酒",   emoji:"🍺", color:"#D4B030", servingMl:350,
    keywords:["ビール","発泡酒","クラフトビール","生ビール","黒ビール","エール","ラガー","IPA","ピルスナー","白ビール","ドラフト"],
    perServing:{cal:140,prot:1.1,fat:0,carb:11,fib:0,sod:5,cal_m:7,iron:0,vitC:0,B1:0,B2:0.06,B6:0.06}},
  sake:          { label:"日本酒",           emoji:"🍶", color:"#C8C0B0", servingMl:180,
    keywords:["日本酒","酒","熱燗","冷酒","吟醸","純米","大吟醸","にごり酒","甘酒以外"],
    perServing:{cal:186,prot:0.9,fat:0,carb:8.8,fib:0,sod:2,cal_m:5,iron:0,vitC:0,B1:0,B2:0.01,B6:0}},
  wine:          { label:"ワイン",           emoji:"🍷", color:"#A05080", servingMl:120,
    keywords:["ワイン","赤ワイン","白ワイン","ロゼ","シャンパン","スパークリング","スパークリングワイン","ボジョレー"],
    perServing:{cal:87,prot:0.2,fat:0,carb:2,fib:0,sod:4,cal_m:8,iron:0.3,vitC:0,B1:0,B2:0.01,B6:0.03}},
  highball:      { label:"ハイボール・ウイスキー",emoji:"🥃",color:"#A07850", servingMl:350,
    keywords:["ハイボール","ウイスキー","バーボン","スコッチ","バーボンコーク","ウイスキーソーダ"],
    perServing:{cal:112,prot:0,fat:0,carb:3,fib:0,sod:0,cal_m:0,iron:0,vitC:0,B1:0,B2:0,B6:0}},
  sour:          { label:"サワー・チューハイ", emoji:"🍹", color:"#80A8D0", servingMl:350,
    keywords:["サワー","チューハイ","酎ハイ","レモンサワー","梅サワー","カルピスサワー","缶チューハイ","ストロング","ほろよい","氷結"],
    perServing:{cal:140,prot:0,fat:0,carb:15,fib:0,sod:0,cal_m:0,iron:0,vitC:5,B1:0,B2:0,B6:0}},
  shochu:        { label:"焼酎",             emoji:"🥃", color:"#888880", servingMl:100,
    keywords:["焼酎","泡盛","芋焼酎","麦焼酎","米焼酎","そば焼酎"],
    perServing:{cal:146,prot:0,fat:0,carb:0,fib:0,sod:0,cal_m:0,iron:0,vitC:0,B1:0,B2:0,B6:0}},
  // ── 調味料 ──────────────────────────────────────────────
  soy_sauce:     { label:"醤油・たれ",       emoji:"🫙", color:"#6A5030",
    keywords:["しょうゆ","醤油","ポン酢","めんつゆ","たれ","焼肉のたれ","だし醤油","白だし","みたらし","てりやき","照り焼き"],
    perServing:{cal:13,prot:1.3,fat:0,carb:1.5,fib:0,sod:900,cal_m:5,iron:0.3,vitC:0,B1:0,B2:0.02,B6:0.02}},
  butter_oil:    { label:"バター・油脂類",   emoji:"🧈", color:"#D8B840",
    keywords:["バター","マーガリン","オリーブオイル","サラダ油","ごま油","ラード","植物油","オイル","米油","ギー","ショートニング","ドレッシング","ラー油"],
    perServing:{cal:90,prot:0.1,fat:10,carb:0,fib:0,sod:80,cal_m:2,iron:0,vitC:0,B1:0,B2:0,B6:0}},
  mayonnaise:    { label:"マヨネーズ",       emoji:"🫙", color:"#D8D070",
    keywords:["マヨネーズ","マヨ","タルタルソース"],
    perServing:{cal:100,prot:0.3,fat:11,carb:0.5,fib:0,sod:120,cal_m:2,iron:0.1,vitC:0,B1:0,B2:0.01,B6:0}},
  ketchup:       { label:"ケチャップ・ソース",emoji:"🍅", color:"#D04030",
    keywords:["ケチャップ","ソース","ウスターソース","トマトソース","デミグラス","ホワイトソース","ハヤシ","ナポリタン"],
    perServing:{cal:30,prot:0.5,fat:0,carb:7,fib:0.5,sod:300,cal_m:8,iron:0.3,vitC:8,B1:0.02,B2:0.02,B6:0.05}},
  sugar_sweet:   { label:"砂糖・甘味料",     emoji:"🍯", color:"#D4A820",
    keywords:["砂糖","みりん","蜂蜜","はちみつ","メープルシロップ","黒糖","和三盆","シロップ","加糖","甘い"],
    perServing:{cal:30,prot:0,fat:0,carb:7.5,fib:0,sod:0,cal_m:0,iron:0,vitC:0,B1:0,B2:0,B6:0}},
  miso_salt:     { label:"味噌・塩",         emoji:"🧂", color:"#908070",
    keywords:["塩","みそ","味噌","塩麹","だし","出汁","こんぶ茶","梅干し","漬け物","塩漬け"],
    perServing:{cal:20,prot:1.5,fat:0.5,carb:2.5,fib:0.5,sod:700,cal_m:20,iron:0.3,vitC:0,B1:0.02,B2:0.03,B6:0.05}},
  soup:          { label:"汁物・鍋",         emoji:"🍵", color:"#A0805A",
    keywords:["みそ汁","味噌汁","スープ","コンソメ","ポタージュ","豚汁","お吸い物","鍋","おでん","ちゃんこ","もつ鍋","すき焼き","しゃぶしゃぶ","湯豆腐","水炊き"],
    perServing:{cal:50,prot:3,fat:1.5,carb:5,fib:1.5,sod:900,cal_m:30,iron:0.5,vitC:2,B1:0.04,B2:0.06,B6:0.06}},
  // ── 飲み物（ノンアルコール） ──────────────────────────────
  juice:         { label:"ジュース・炭酸",   emoji:"🧃", color:"#E8A040", servingMl:350,
    keywords:["ジュース","コーラ","ペプシ","ファンタ","サイダー","炭酸飲料","オレンジジュース","アップルジュース","野菜ジュース","スムージー","エナジードリンク","レモネード"],
    perServing:{cal:90,prot:0.3,fat:0,carb:22,fib:0,sod:5,cal_m:5,iron:0.1,vitC:20,B1:0,B2:0.01,B6:0.05}},
  coffee_tea:    { label:"コーヒー・お茶",   emoji:"☕", color:"#805840", servingMl:250,
    keywords:["コーヒー","紅茶","お茶","緑茶","ほうじ茶","ウーロン茶","ラテ","カフェラテ","カプチーノ","抹茶","カフェオレ","マキアート","アメリカーノ"],
    perServing:{cal:10,prot:0.5,fat:0.5,carb:1,fib:0,sod:2,cal_m:10,iron:0.1,vitC:2,B1:0,B2:0.01,B6:0.01}},
  protein_supp:  { label:"プロテイン・サプリ",emoji:"💪", color:"#6080C0",
    keywords:["プロテイン","プロテインシェイク","プロテインバー","ホエイ","カゼイン","BCAA","クレアチン","サプリ"],
    perServing:{cal:150,prot:20,fat:3,carb:12,fib:2,sod:100,cal_m:150,iron:2,vitC:10,B1:0.3,B2:0.3,B6:0.3}},
};
// ▲▲▲ カテゴリデータベースここまで ▲▲▲

// ═══════════════════════════════════════════════════════════
// AFFILIATE LINKS  (A8 URLに差し替えてください)
// ═══════════════════════════════════════════════════════════
const AFFILIATE = {
  protein:[
    {name:"マイプロテイン ホエイプロテイン",desc:"不足しがちなタンパク質を補いやすいプロテイン",emoji:"💪",url:"https://example.com/REPLACE_A8_PROTEIN_1",type:"t-protein"},
    {name:"サラダチキン バラエティセット",   desc:"高タンパクな食品を手軽に取り入れやすいセット",emoji:"🍗",url:"https://example.com/REPLACE_A8_PROTEIN_2",type:"t-protein"},
  ],
  fiber:[
    {name:"日食 プレミアムピュアオートミール",desc:"食物繊維を補いやすい朝食として活用しやすい",emoji:"🌾",url:"https://example.com/REPLACE_A8_FIBER_1",type:"t-fiber"},
    {name:"はくばく もち麦ごはん 12食セット", desc:"毎日の食事に取り入れやすい食物繊維食品",emoji:"🍚",url:"https://example.com/REPLACE_A8_FIBER_2",type:"t-fiber"},
  ],
  lowfat:[
    {name:"nosh（ナッシュ）低脂質弁当",      desc:"脂質をおさえた食生活のサポートに",emoji:"🍱",url:"https://example.com/REPLACE_A8_LOWFAT_1",type:"t-lowfat"},
  ],
  lowcal:[
    {name:"BASE FOOD 完全栄養食",            desc:"栄養バランスを整えながら食事管理をサポート",emoji:"🥖",url:"https://example.com/REPLACE_A8_LOWCAL_1",type:"t-lowcal"},
    {name:"nosh（ナッシュ）カロリー調整弁当", desc:"カロリーを意識した食生活のサポートに",emoji:"🍽️",url:"https://example.com/REPLACE_A8_LOWCAL_2",type:"t-lowcal"},
  ],
};

// ═══════════════════════════════════════════════════════════
// AGE × GENDER → DAILY REFERENCE VALUES
// 日本人の食事摂取基準 2020年版
// ═══════════════════════════════════════════════════════════
const AGE_REF_MALE = [
  {min:10,max:11,cal:2250,prot:50,fat:62,carb:310},{min:12,max:14,cal:2600,prot:60,fat:72,carb:360},
  {min:15,max:17,cal:2800,prot:65,fat:78,carb:390},{min:18,max:29,cal:2650,prot:65,fat:74,carb:365},
  {min:30,max:49,cal:2700,prot:65,fat:74,carb:375},{min:50,max:64,cal:2600,prot:65,fat:72,carb:360},
  {min:65,max:74,cal:2400,prot:60,fat:67,carb:330},{min:75,max:200,cal:2100,prot:60,fat:58,carb:290},
];
const AGE_REF_FEMALE = [
  {min:10,max:11,cal:2100,prot:50,fat:58,carb:290},{min:12,max:14,cal:2400,prot:55,fat:67,carb:330},
  {min:15,max:17,cal:2300,prot:55,fat:64,carb:320},{min:18,max:29,cal:2000,prot:50,fat:56,carb:275},
  {min:30,max:49,cal:2050,prot:50,fat:57,carb:285},{min:50,max:64,cal:1950,prot:50,fat:54,carb:270},
  {min:65,max:74,cal:1850,prot:50,fat:52,carb:255},{min:75,max:200,cal:1650,prot:50,fat:46,carb:230},
];

function getBaseRef(age, gender) {
  const table = gender === "female" ? AGE_REF_FEMALE : AGE_REF_MALE;
  const row = table.find(r => age >= r.min && age <= r.max) || table[3];
  return {
    calories: row.cal, protein: row.prot, fat: row.fat, carbs: row.carb,
    fiber:   gender === "female" ? 18 : 21,
    sodium:  2300,
    calcium: gender === "male" ? (age >= 65 ? 750 : 800) : (age >= 50 ? 700 : 650),
    iron:    gender === "male" ? 7.5 : (age <= 49 ? 11.0 : 6.5),
    vitaminC: 100,
    B1: gender === "male" ? (age <= 17 ? 1.3 : 1.4) : (age <= 17 ? 1.1 : 1.1),
    B2: gender === "male" ? (age <= 17 ? 1.4 : 1.6) : (age <= 17 ? 1.2 : 1.2),
    B6: gender === "male" ? 1.4 : 1.1,
  };
}

// ═══════════════════════════════════════════════════════════
// GOAL ADJUSTMENTS
// ═══════════════════════════════════════════════════════════
const GOALS = {
  health:  { label:"健康な食事", emoji:"🥗", calDelta:0,    pMul:1.0, fMul:1.0, cMul:1.0, bMul:1.0 },
  loss:    { label:"減量",       emoji:"⬇️", calDelta:-350, pMul:1.2, fMul:0.75,cMul:0.7, bMul:1.0 },
  gain:    { label:"増量",       emoji:"⬆️", calDelta:+450, pMul:1.4, fMul:1.1, cMul:1.3, bMul:1.1 },
  athlete: { label:"アスリート", emoji:"⚡", calDelta:+700, pMul:1.8, fMul:1.2, cMul:1.6, bMul:1.5 },
};

function getRef(profile) {
  const base = getBaseRef(profile.age || 30, profile.gender || "male");
  const g = GOALS[profile.goal || "health"];
  return {
    ...base,
    calories: Math.max(1200, base.calories + g.calDelta),
    protein:  Math.round(base.protein  * g.pMul),
    fat:      Math.round(base.fat      * g.fMul),
    carbs:    Math.round(base.carbs    * g.cMul),
    B1:       Math.round(base.B1 * g.bMul * 10) / 10,
    B2:       Math.round(base.B2 * g.bMul * 10) / 10,
    B6:       Math.round(base.B6 * g.bMul * 10) / 10,
  };
}

// ═══════════════════════════════════════════════════════════
// NUTRIENT DEFINITIONS (display order)
// ═══════════════════════════════════════════════════════════
const NUT_DEFS = [
  {k:"calories",lbl:"カロリー",  ico:"🔥",u:"kcal",max:false},
  {k:"protein", lbl:"タンパク質",ico:"💪",u:"g",   max:false},
  {k:"fat",     lbl:"脂質",      ico:"🫒",u:"g",   max:false},
  {k:"carbs",   lbl:"炭水化物",  ico:"🌾",u:"g",   max:false},
  {k:"fiber",   lbl:"食物繊維",  ico:"🥦",u:"g",   max:false},
  {k:"sodium",  lbl:"塩分",      ico:"🧂",u:"mg",  max:true },
  {k:"calcium", lbl:"カルシウム",ico:"🦴",u:"mg",  max:false},
  {k:"iron",    lbl:"鉄分",      ico:"⚙️",u:"mg", max:false},
  {k:"vitaminC",lbl:"ビタミンC", ico:"🍊",u:"mg",  max:false},
  {k:"B1",      lbl:"ビタミンB1",ico:"🌿",u:"mg",  max:false},
  {k:"B2",      lbl:"ビタミンB2",ico:"🌱",u:"mg",  max:false},
  {k:"B6",      lbl:"ビタミンB6",ico:"🫛",u:"mg",  max:false},
];

// Radar chart axes (subset)
const RADAR_AXES = ["protein","fat","carbs","fiber","calcium","iron","vitaminC","B1","B2","B6"];
const RADAR_LABELS = {protein:"タンパク",fat:"脂質",carbs:"炭水化",fiber:"食物繊",calcium:"Ca",iron:"鉄分",vitaminC:"VitC",B1:"B1",B2:"B2",B6:"B6"};

// ═══════════════════════════════════════════════════════════
// STORAGE
// ═══════════════════════════════════════════════════════════
const LS = { records:"glowme_v1_recs", profile:"glowme_v1_profile" };
function tryLoad(key, def){ try{ return JSON.parse(localStorage.getItem(key))||def; }catch{return def;} }
function saveRec(){ try{ localStorage.setItem(LS.records, JSON.stringify(records.slice(-100))); }catch(_){} }
function saveProfile(){ try{ localStorage.setItem(LS.profile, JSON.stringify(profile)); }catch(_){} }

let records = tryLoad(LS.records, []);
let profile = tryLoad(LS.profile, { name:"", age:30, gender:"male", goal:"health", setupDone:false });

// ═══════════════════════════════════════════════════════════
// STATE
// ═══════════════════════════════════════════════════════════
let curMeal = "breakfast";
let curResult = null;   // { cats, unknowns, nutrients }
const MEAL_I = {breakfast:"🌅",lunch:"☀️",dinner:"🌙",snack:"🫖"};
const MEAL_L = {breakfast:"朝食",lunch:"昼食",dinner:"夕食",snack:"間食"};

const $=id=>document.getElementById(id);
const show=id=>$(id).classList.remove("hidden");
const hide=id=>$(id).classList.add("hidden");
function toast(m){ const t=$("toast");t.textContent=m;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),2600); }
function p(n){ return String(n).padStart(2,"0"); }
function toDS(d){ return `${d.getFullYear()}-${p(d.getMonth()+1)}-${p(d.getDate())}`; }
function fmtDate(s){ const d=new Date(s+"T00:00:00"); const W=["日","月","火","水","木","金","土"]; return `${d.getMonth()+1}/${d.getDate()}（${W[d.getDay()]}）`; }
function r1(v){ if(v>=100) return Math.round(v); return Math.round(v*10)/10; }
function updateBadge(){ const b=$("tab-badge"); b.textContent=records.length; b.style.display=records.length>0?"flex":"none"; }

// ═══════════════════════════════════════════════════════════
// PARSING: Quantity / Drink detection
// ═══════════════════════════════════════════════════════════
// Returns { count, mlOverride } from text like "唐揚げ3個", "ビール2杯", "500ml"
function extractQuantity(text) {
  let count = 1, mlOverride = null;
  // ml first
  const mlM = text.match(/(\d+(?:\.\d+)?)\s*(?:ml|mL|ミリ|cc)/i);
  if(mlM) mlOverride = parseFloat(mlM[1]);
  // count
  const cntM = text.match(/(\d+(?:\.\d+)?)\s*(?:個|枚|切れ|本|杯|缶|パック|食|人前|皿|袋|合|グラス|ボトル|串|膳|つ|ピース|slice|piece|cup)/);
  if(cntM) count = parseFloat(cntM[1]);
  // bare number at end
  if(!mlM && !cntM) { const nm=text.match(/\s(\d+)\s*$/); if(nm) count=parseFloat(nm[1]); }
  return { count, mlOverride };
}

function stripQuantity(text) {
  return text
    .replace(/\d+(?:\.\d+)?\s*(?:ml|mL|ミリ|cc)/gi,"")
    .replace(/\d+(?:\.\d+)?\s*(?:個|枚|切れ|本|杯|缶|パック|食|人前|皿|袋|合|グラス|ボトル|串|膳|つ|ピース)/g,"")
    .replace(/\s+\d+\s*$/,"")
    .trim();
}

// ═══════════════════════════════════════════════════════════
// CATEGORY MATCHING
// ═══════════════════════════════════════════════════════════
function matchCategory(token) {
  const q = stripQuantity(token).toLowerCase();
  if(!q || q.length < 1) return null;

  let best = null, bestScore = 0;
  for(const [catKey, cat] of Object.entries(categories)) {
    for(const kw of cat.keywords) {
      if(q.includes(kw) || kw.includes(q)) {
        const sc = Math.min(q.length, kw.length) / Math.max(q.length, kw.length);
        if(sc > bestScore) { bestScore = sc; best = { catKey, cat }; }
      }
    }
  }
  return best && bestScore >= 0.28 ? best : null;
}

function parseInput(text) {
  // Split by 、 and ,
  const tokens = text.split(/[、,]+/).map(s => s.trim()).filter(Boolean);

  const matched = []; // { catKey, cat, qty }
  const unknowns = [];
  const catCounts = {}; // count per catKey this meal

  tokens.forEach(token => {
    const { count, mlOverride } = extractQuantity(token);
    const found = matchCategory(token);
    if(found) {
      const { catKey, cat } = found;
      // Scale by quantity
      let scale = count;
      if(mlOverride && cat.servingMl) {
        scale = mlOverride / cat.servingMl;
      } else if(!cat.servingMl) {
        // Food item – count is servings
        scale = count;
      }
      // Track category usage for display
      if(!catCounts[catKey]) catCounts[catKey] = { cat, totalScale: 0, tokens: [] };
      catCounts[catKey].totalScale += scale;
      catCounts[catKey].tokens.push({ token, scale });
    } else {
      const clean = stripQuantity(token);
      if(clean) unknowns.push(clean);
    }
  });

  return { catCounts, unknowns };
}

function calcNutrients(catCounts) {
  const t = { calories:0,protein:0,fat:0,carbs:0,fiber:0,sodium:0,calcium:0,iron:0,vitaminC:0,B1:0,B2:0,B6:0 };
  for(const { cat, totalScale } of Object.values(catCounts)) {
    const s = cat.perServing;
    t.calories  += (s.cal   ||0) * totalScale;
    t.protein   += (s.prot  ||0) * totalScale;
    t.fat       += (s.fat   ||0) * totalScale;
    t.carbs     += (s.carb  ||0) * totalScale;
    t.fiber     += (s.fib   ||0) * totalScale;
    t.sodium    += (s.sod   ||0) * totalScale;
    t.calcium   += (s.cal_m ||0) * totalScale;
    t.iron      += (s.iron  ||0) * totalScale;
    t.vitaminC  += (s.vitC  ||0) * totalScale;
    t.B1        += (s.B1    ||0) * totalScale;
    t.B2        += (s.B2    ||0) * totalScale;
    t.B6        += (s.B6    ||0) * totalScale;
  }
  Object.keys(t).forEach(k => t[k] = Math.round(t[k]*10)/10);
  return t;
}

function sumNuts(recs) {
  const t = { calories:0,protein:0,fat:0,carbs:0,fiber:0,sodium:0,calcium:0,iron:0,vitaminC:0,B1:0,B2:0,B6:0 };
  recs.forEach(r => { if(r.nutrients) Object.keys(t).forEach(k => t[k] += (r.nutrients[k]||0)); else t.calories += r.calories||0; });
  Object.keys(t).forEach(k => t[k] = Math.round(t[k]*10)/10);
  return t;
}

// ═══════════════════════════════════════════════════════════
// RADAR CHART (SVG)
// ═══════════════════════════════════════════════════════════
function drawRadar(nutrients, targets, containerId) {
  const N = RADAR_AXES.length;
  const W=300, CX=150, CY=150, R=105;
  const ang = i => (i*2*Math.PI/N) - Math.PI/2;
  const pt  = (i, r) => ({ x: CX + Math.cos(ang(i))*r, y: CY + Math.sin(ang(i))*r });

  const poly = pts => pts.map((p,i) => `${i===0?"M":"L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ") + "Z";

  let svg = `<svg viewBox="0 0 ${W} 300" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:260px;display:block;margin:0 auto">`;

  // BG rings
  [.25,.5,.75,1].forEach(r => {
    const pts = RADAR_AXES.map((_,i) => pt(i, R*r));
    svg += `<path d="${poly(pts)}" fill="${r===1?"rgba(107,158,120,.08)":"none"}" stroke="${r===1?"#6B9E78":"#D8D2C6"}" stroke-width="${r===1?1.5:.6}"/>`;
    if(r===.5||r===1) svg += `<text x="${(CX+4).toFixed(1)}" y="${(CY-R*r+5).toFixed(1)}" font-size="8" fill="#8A9E90">${r*100}%</text>`;
  });

  // Axes
  RADAR_AXES.forEach((_,i) => {
    const e=pt(i,R);
    svg += `<line x1="${CX}" y1="${CY}" x2="${e.x.toFixed(1)}" y2="${e.y.toFixed(1)}" stroke="#D8D2C6" stroke-width=".6"/>`;
  });

  // Data polygon
  const dataPts = RADAR_AXES.map((k,i) => {
    const pct = Math.min((nutrients[k]||0)/(targets[k]||1), 1.3);
    return pt(i, R*pct);
  });
  svg += `<path d="${poly(dataPts)}" fill="rgba(107,158,120,.3)" stroke="#6B9E78" stroke-width="2" stroke-linejoin="round"/>`;

  // Dots
  dataPts.forEach(p => svg += `<circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="3.5" fill="#6B9E78" stroke="#fff" stroke-width="1.2"/>`);

  // Labels
  RADAR_AXES.forEach((k,i) => {
    const lp = pt(i, R*1.22);
    const pct = Math.round((nutrients[k]||0)/(targets[k]||1)*100);
    const clr = pct < 40 ? "#D95F3B" : pct > 120 ? "#C48B2A" : "#2D5541";
    svg += `<text x="${lp.x.toFixed(1)}" y="${lp.y.toFixed(1)}" text-anchor="middle" dominant-baseline="middle" font-size="9.5" font-family="'Zen Kaku Gothic New',sans-serif" fill="${clr}" font-weight="600">${RADAR_LABELS[k]}</text>`;
  });

  svg += `</svg>`;
  const el = $(containerId);
  if(el) el.innerHTML = svg;
}

// ═══════════════════════════════════════════════════════════
// INIT
// ═══════════════════════════════════════════════════════════
(function init() {
  // Date
  const d = new Date(); const W=["日","月","火","水","木","金","土"];
  $("hdr-date").textContent = `${d.getFullYear()}.${p(d.getMonth()+1)}.${p(d.getDate())} ${W[d.getDay()]}`;
  $("rec-date").value = toDS(d);

  // Show setup if first visit
  if(!profile.setupDone) {
    const sm=$("setup-modal"); sm.style.display="flex";
  } else {
    applyProfile();
  }

  // Quick chips
  const QUICK = ["ご飯","鶏肉","サラダ","納豆","卵","みそ汁","牛肉","魚","パスタ","オートミール","バナナ","きのこ","豆腐","チーズ","スープ","しょうゆ","バター","ビール"];
  const qg = $("quick-grid");
  QUICK.forEach(q => {
    const btn = document.createElement("button");
    btn.className = "q-chip"; btn.textContent = q;
    btn.onclick = () => { const ta=$("food-text"); ta.value = ta.value ? ta.value.trimEnd()+"、"+q : q; ta.focus(); };
    qg.appendChild(btn);
  });

  // Meal tabs
  $("meal-tabs").addEventListener("click", e => {
    const mt=e.target.closest(".mt"); if(!mt) return;
    document.querySelectorAll(".mt").forEach(b=>b.classList.remove("active")); mt.classList.add("active");
    curMeal = mt.dataset.meal;
  });

  // Tab nav
  document.querySelectorAll(".tab").forEach(tab => tab.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach(t=>t.classList.remove("active"));
    document.querySelectorAll(".panel").forEach(p=>p.classList.remove("active"));
    tab.classList.add("active"); $("tab-"+tab.dataset.tab).classList.add("active");
    if(tab.dataset.tab==="history") renderHistory();
    // 記録タブに戻ったとき、どのカードも表示されていなければ入力画面を出す
    if(tab.dataset.tab==="record") {
      const anyVisible = ["card-input","card-result","card-success"].some(id => !$(id).classList.contains("hidden"));
      if(!anyVisible) { $("food-text").value=""; curResult=null; show("card-input"); }
    }
  }));

  // Calc
  $("btn-calc").addEventListener("click", onCalc);
  $("food-text").addEventListener("keydown", e => { if(e.key==="Enter"&&e.ctrlKey) onCalc(); });

  // Result actions
  $("btn-save").addEventListener("click", onSave);
  $("btn-back").addEventListener("click", () => { hide("card-result"); show("card-input"); });

  // Success card
  $("btn-continue").addEventListener("click", () => {
    hide("card-success");
    // Reset for new entry
    $("food-text").value = "";
    curResult = null;
    show("card-input");
    window.scrollTo({top:0,behavior:"smooth"});
  });
  $("btn-view-hist").addEventListener("click", () => {
    hide("card-success");
    document.querySelectorAll(".tab").forEach(t=>t.classList.remove("active"));
    document.querySelectorAll(".panel").forEach(p=>p.classList.remove("active"));
    document.querySelector('.tab[data-tab="history"]').classList.add("active");
    $("tab-history").classList.add("active");
    renderHistory();
    window.scrollTo({top:0,behavior:"smooth"});
  });

  // Settings
  $("btn-open-settings").addEventListener("click", openSettings);
  $("settings-close").addEventListener("click", () => hide("settings-modal"));
  $("btn-settings-save").addEventListener("click", saveSettings);

  // Setup
  $("btn-setup-save").addEventListener("click", () => {
    const age = parseInt($("s-age").value);
    if(!age || age < 10 || age > 100) { toast("年齢を正しく入力してください（10〜100）"); return; }
    profile.name   = $("s-name").value.trim();
    profile.age    = age;
    profile.gender = document.querySelector("#s-gender .sf-radio.active")?.dataset.v || "male";
    profile.goal   = document.querySelector("#s-goal .goal-btn.active")?.dataset.v  || "health";
    profile.setupDone = true;
    saveProfile();
    $("setup-modal").style.display = "none";
    applyProfile();
    toast(`ようこそ、${profile.name||"Glow Me"}！`);
  });

  // Radio/goal toggles in setup modal
  setupToggle("#s-gender", ".sf-radio");
  setupToggle("#s-goal",   ".goal-btn");

  // Delete
  $("btn-clear-all").addEventListener("click", () => show("del-modal"));
  $("del-cancel").addEventListener("click", () => hide("del-modal"));
  $("del-ok").addEventListener("click", () => {
    records=[]; saveRec(); updateBadge(); hide("del-modal"); renderHistory(); toast("全データを削除しました");
  });

  updateBadge();
})();

function setupToggle(parentSel, childSel) {
  document.querySelector(parentSel).addEventListener("click", e => {
    const btn = e.target.closest(childSel);
    if(!btn) return;
    document.querySelectorAll(`${parentSel} ${childSel}`).forEach(b=>b.classList.remove("active"));
    btn.classList.add("active");
  });
}

function applyProfile() {
  const g = GOALS[profile.goal] || GOALS.health;
  const name = profile.name ? `${profile.name}の` : "";
  $("hdr-sub").textContent = `${name}栄養分析`;
  const badge = $("goal-badge");
  badge.textContent = `${g.emoji} ${g.label}`;
  badge.classList.remove("hidden");
}

function openSettings() {
  $("ss-name").value = profile.name || "";
  $("ss-age").value  = profile.age  || 30;
  // set radio
  document.querySelectorAll("#ss-gender .sf-radio").forEach(b => {
    b.classList.toggle("active", b.dataset.v === profile.gender);
  });
  document.querySelectorAll("#ss-goal .goal-btn").forEach(b => {
    b.classList.toggle("active", b.dataset.v === profile.goal);
  });
  setupToggle("#ss-gender", ".sf-radio");
  setupToggle("#ss-goal",   ".goal-btn");
  show("settings-modal");
}

function saveSettings() {
  const age = parseInt($("ss-age").value);
  if(!age || age<10||age>100) { toast("年齢を正しく入力してください"); return; }
  profile.name   = $("ss-name").value.trim();
  profile.age    = age;
  profile.gender = document.querySelector("#ss-gender .sf-radio.active")?.dataset.v || profile.gender;
  profile.goal   = document.querySelector("#ss-goal .goal-btn.active")?.dataset.v   || profile.goal;
  saveProfile();
  hide("settings-modal");
  applyProfile();
  toast("設定を保存しました");
}

// ═══════════════════════════════════════════════════════════
// CALCULATE
// ═══════════════════════════════════════════════════════════
function onCalc() {
  const text = $("food-text").value.trim();
  if(!text) { toast("食べたものを入力してください"); return; }

  const { catCounts, unknowns } = parseInput(text);
  if(Object.keys(catCounts).length === 0 && unknowns.length > 0) {
    toast("認識できる食品がありませんでした。読点「、」で区切っているか確認してください");
    return;
  }

  const nutrients = calcNutrients(catCounts);
  curResult = { catCounts, unknowns, nutrients, inputText: text };
  renderResult();
  hide("card-input");
  hide("card-success");
  show("card-result");
  window.scrollTo({top:0,behavior:"smooth"});
}

// ═══════════════════════════════════════════════════════════
// RENDER RESULT
// ═══════════════════════════════════════════════════════════
function renderResult() {
  const { catCounts, unknowns, nutrients } = curResult;
  const ref = getRef(profile);

  // Recognized category tags
  $("rec-foods").innerHTML = Object.entries(catCounts).map(([k,v],i) => {
    const num = v.totalScale !== 1 ? ` ×${Math.round(v.totalScale*10)/10}` : "";
    return `<span class="rf-tag" style="animation-delay:${i*.05}s">
      <span class="rf-ico">${v.cat.emoji}</span>${v.cat.label}${num?`<span class="rf-num">${num}</span>`:""}
    </span>`;
  }).join("");

  // Unknowns
  if(unknowns.length > 0) {
    $("unrec-list").textContent = unknowns.join("、");
    show("unrec-wrap");
  } else { hide("unrec-wrap"); }

  // Calorie ring
  const calPct = Math.min(Math.round(nutrients.calories/ref.calories*100),100);
  $("cal-num").textContent = Math.round(nutrients.calories).toLocaleString();
  const circ=213.6, off=circ*(1-calPct/100);
  const f=$("cal-ring-fill"); f.style.strokeDashoffset=circ;
  requestAnimationFrame(()=>requestAnimationFrame(()=>{ f.style.strokeDashoffset=off; }));
  $("cal-ring-pct").textContent=calPct+"%";

  // Radar chart
  drawRadar(nutrients, ref, "radar-chart");
  const gLbl = profile.gender==="female"?"女性":"男性";
  $("radar-legend").innerHTML = `
    <div class="rl-item"><div class="rl-dot" style="background:#6B9E78"></div>今回の摂取量</div>
    <div class="rl-item"><div class="rl-dot" style="background:#D8D2C6;border:1px solid #8A9E90"></div>${gLbl}(${profile.age}歳)${GOALS[profile.goal||"health"].label}目安 100%</div>`;

  // Macro cards
  const macros = [
    {key:"protein",lbl:"タンパク質",ico:"💪",cls:"mc-p"},
    {key:"fat",    lbl:"脂質",      ico:"🫒",cls:"mc-f"},
    {key:"carbs",  lbl:"炭水化物",  ico:"🌾",cls:"mc-c"},
  ];
  $("macro-cards").innerHTML = macros.map(m => {
    const val=nutrients[m.key], pct=Math.round(val/ref[m.key]*100);
    const st = pct<40?"mc-bad":pct>130?"mc-warn":"mc-ok";
    const pl = pct<40?`不足 ${pct}%`:pct>130?`過多 ${pct}%`:`${pct}%`;
    return `<div class="mc ${m.cls} ${st}">
      <div class="mc-ico">${m.ico}</div>
      <div class="mc-lbl">${m.lbl}</div>
      <div class="mc-val">${r1(val)}<span class="mc-unit"> g</span></div>
      <div class="mc-pct">${pl}</div>
    </div>`;
  }).join("");

  // Nut rows
  $("nut-rows").innerHTML = NUT_DEFS.map(d => {
    const val=nutrients[d.k]||0, tgt=ref[d.k]||1;
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
  requestAnimationFrame(()=>requestAnimationFrame(()=>{ document.querySelectorAll(".nr-fill").forEach(el=>el.style.width=el.dataset.w); }));

  // Daily cumulative
  renderDailyCum(nutrients, ref);

  // Deficit + advice
  renderDeficit(nutrients, ref);

  // Affiliate
  renderAffiliate(nutrients, ref);
}

function renderDailyCum(mealNut, ref) {
  const today = toDS(new Date());
  const prev  = sumNuts(records.filter(r=>r.date===today));
  const total = {};
  Object.keys(mealNut).forEach(k => total[k] = (prev[k]||0) + (mealNut[k]||0));
  const gLbl = profile.gender==="female"?"女性":"男性";
  const goalLbl = GOALS[profile.goal||"health"].label;
  const rows = [
    {k:"calories",lbl:"🔥 カロリー",u:"kcal"},
    {k:"protein", lbl:"💪 タンパク質",u:"g"},
    {k:"fat",     lbl:"🫒 脂質",u:"g"},
    {k:"carbs",   lbl:"🌾 炭水化物",u:"g"},
    {k:"fiber",   lbl:"🥦 食物繊維",u:"g"},
  ];
  $("daily-cum").innerHTML = `<div class="daily-cum-box">
    <div class="dc-title">📊 本日の累計 — ${gLbl}(${profile.age}歳)${goalLbl}目安との比較</div>
    ${rows.map(d=>{
      const v=total[d.k]||0, tgt=ref[d.k]||1;
      const pct=Math.min(Math.round(v/tgt*100),130);
      const fc=pct<40?"dc-bad":pct>125?"dc-warn":"dc-ok";
      return `<div class="dc-row">
        <div class="dc-row-hd">
          <span class="dc-lbl">${d.lbl}</span>
          <span class="dc-nums">${r1(v)} / ${tgt} ${d.u}　${pct}%</span>
        </div>
        <div class="dc-track"><div class="dc-fill ${fc}" style="width:0%" data-w="${Math.min(pct,100)}%"></div></div>
      </div>`;
    }).join("")}
  </div>`;
  requestAnimationFrame(()=>requestAnimationFrame(()=>{ document.querySelectorAll(".dc-fill").forEach(el=>el.style.width=el.dataset.w); }));
}

function renderDeficit(nutrients, ref) {
  const minK = ["protein","fat","carbs","fiber","calcium","iron","vitaminC","B1","B2","B6"];
  const LMAP = {protein:"タンパク質",fat:"脂質",carbs:"炭水化物",fiber:"食物繊維",calcium:"カルシウム",iron:"鉄分",vitaminC:"ビタミンC",B1:"B1",B2:"B2",B6:"B6"};
  const IMAP = {protein:"💪",fat:"🫒",carbs:"🌾",fiber:"🥦",calcium:"🦴",iron:"⚙️",vitaminC:"🍊",B1:"🌿",B2:"🌱",B6:"🫛"};
  const deficits = minK.filter(k=>(nutrients[k]||0)/ref[k]*100<40);
  const sodEx = (nutrients.sodium||0) > ref.sodium;

  const db=$("deficit-box");
  if(deficits.length===0&&!sodEx){
    db.innerHTML=`<div class="all-good">🎉 この食事の栄養バランスは良好です！</div>`;
  } else {
    const tags=deficits.map(k=>`<span class="def-tag">${IMAP[k]||""} ${LMAP[k]}不足</span>`).join("");
    const sodTag=sodEx?`<span class="def-tag" style="background:var(--amber);color:#fff;border-color:transparent">🧂 塩分過多</span>`:"";
    db.innerHTML=`<div class="db-hd">⚠ 不足・過剰な栄養素</div><div class="db-body"><div class="deficit-tags">${tags}${sodTag}</div></div>`;
  }

  // Advice items
  const ADVICE = {
    protein:  {ico:"💪",txt:"タンパク質不足。毎食に肉・魚・卵・豆腐のどれかを加えましょう。"},
    fat:      {ico:"🫒",txt:"脂質が少なめです。ナッツ・アボカド・魚の脂質で良質な脂を補いましょう。"},
    carbs:    {ico:"🌾",txt:"炭水化物が不足しています。主食を増やしてエネルギーを補給しましょう。"},
    fiber:    {ico:"🥦",txt:"食物繊維不足。野菜・きのこ・海藻・全粒穀物を毎食加えましょう。"},
    calcium:  {ico:"🦴",txt:"カルシウムが少なめです。牛乳・ヨーグルト・豆腐・小魚を習慣にしましょう。"},
    iron:     {ico:"⚙️",txt:"鉄分不足。レバー・赤身肉・ほうれん草・納豆で補いましょう。"},
    vitaminC: {ico:"🍊",txt:"ビタミンCが少なめです。野菜・果物を毎日取り入れましょう。"},
    B1:       {ico:"🌿",txt:"ビタミンB1不足。豚肉・豆類・全粒穀物に多く含まれます。"},
    B2:       {ico:"🌱",txt:"ビタミンB2不足。乳製品・卵・レバー・納豆を意識しましょう。"},
    B6:       {ico:"🫛",txt:"ビタミンB6不足。肉・魚・バナナ・豆類に多く含まれます。"},
  };
  const items = deficits.slice(0,4).map(k=>{const a=ADVICE[k];return `<div class="advice-item"><span class="advice-ico">${a.ico}</span><div>${a.txt}</div></div>`;}).join("");
  const sodAdv = sodEx?`<div class="advice-item"><span class="advice-ico">🧂</span><div>塩分過多。しょうゆ・みそ・加工食品を控え、出汁・スパイスで風味を出しましょう。</div></div>`:"";
  $("advice-box").innerHTML = (items||sodAdv) ? `<div class="advice-hd">食生活のポイント</div>${items}${sodAdv}` : "";
}

function renderAffiliate(nutrients, ref) {
  const pct=k=>Math.round((nutrients[k]||0)/ref[k]*100);
  const links=[];
  if(pct("protein")<60) links.push(...AFFILIATE.protein.slice(0,2));
  if(pct("fiber")<60)   links.push(...AFFILIATE.fiber.slice(0,2));
  if(pct("fat")>130)    links.push(...AFFILIATE.lowfat);
  if(pct("calories")>120) links.push(...AFFILIATE.lowcal.slice(0,1));
  const aff=$("aff-section");
  if(!links.length){ hide("aff-section"); return; }
  show("aff-section");
  $("aff-cards").innerHTML = links.slice(0,4).map(l=>`
    <a href="${l.url}" target="_blank" rel="noopener sponsored" class="aff-card ${l.type}">
      <span class="aff-ico">${l.emoji}</span>
      <div class="aff-body"><div class="aff-name">${l.name}</div><div class="aff-desc">${l.desc}</div></div>
      <span class="aff-arrow">›</span>
    </a>`).join("");
}

// ═══════════════════════════════════════════════════════════
// SAVE
// ═══════════════════════════════════════════════════════════
function onSave() {
  if(!curResult) return;
  const rec = {
    id: Date.now(), timestamp: Date.now(),
    date: $("rec-date").value || toDS(new Date()),
    mealTime: curMeal,
    foods: Object.values(curResult.catCounts).map(v=>v.cat.label).join("・"),
    calories: Math.round(curResult.nutrients.calories),
    nutrients: { ...curResult.nutrients },
  };
  records.push(rec); saveRec(); updateBadge();
  hide("card-result");
  show("card-success");
  toast("✓ 保存しました！");
}

// ═══════════════════════════════════════════════════════════
// HISTORY
// ═══════════════════════════════════════════════════════════
function renderHistory() {
  if(records.length===0){ show("hist-empty"); hide("hist-main"); return; }
  hide("hist-empty"); show("hist-main");
  const today = toDS(new Date());
  const ref   = getRef(profile);
  const todayRecs = records.filter(r=>r.date===today);
  const todayN = sumNuts(todayRecs);

  // Radar
  drawRadar(todayN, ref, "hist-radar");
  const gLbl = profile.gender==="female"?"女性":"男性";
  $("hist-radar-legend").innerHTML = `
    <div class="rl-item"><div class="rl-dot" style="background:#6B9E78"></div>今日の合計</div>
    <div class="rl-item"><div class="rl-dot" style="background:#D8D2C6;border:1px solid #8A9E90"></div>${gLbl}(${profile.age}歳)${GOALS[profile.goal].label}目安</div>`;
  $("chart-note").textContent = `目安: ${gLbl}・${profile.age}歳・${GOALS[profile.goal||"health"].label} / 今日 ${todayRecs.length}食記録`;

  // Today nut grid
  const gridKeys = ["protein","fat","carbs","fiber","calcium","iron"];
  const LMAP2 = {protein:"タンパク質",fat:"脂質",carbs:"炭水化物",fiber:"食物繊維",calcium:"カルシウム",iron:"鉄分",vitaminC:"VitC",B1:"B1",B2:"B2",B6:"B6"};
  $("today-nut-grid").innerHTML = gridKeys.map(k => {
    const d=NUT_DEFS.find(n=>n.k===k);
    const v=todayN[k]||0, tgt=ref[k]||1;
    const pct=Math.round(v/tgt*100);
    const cls=pct<40?"tng-bad":pct>120?"tng-warn":"tng-ok";
    return `<div class="tng ${cls}">
      <div class="tng-ico">${d.ico}</div>
      <div class="tng-lbl">${d.lbl}</div>
      <div class="tng-val">${r1(v)}<span style="font-size:.52rem;color:var(--text3)"> ${d.u}</span></div>
      <div class="tng-pct">${pct}%</div>
    </div>`;
  }).join("");

  // Daily advice
  const advice = genAdvice(todayN, ref);
  $("daily-advice-list").innerHTML = advice.map(a=>`
    <div class="da-item ${a.cls}"><span class="da-ico">${a.ico}</span><span>${a.txt}</span></div>`).join("");

  renderCompare(today, ref);
  renderMealHistory();
  renderChronic(ref);
  renderHistList();
}

function genAdvice(t, ref) {
  const pct=k=>Math.round((t[k]||0)/ref[k]*100);
  const lines=[];
  if(pct("calories")<70) lines.push({ico:"⚡",txt:"カロリーが目安より少なめです。主食や間食で補うことを検討しましょう。",cls:"da-bad"});
  else if(pct("calories")>125) lines.push({ico:"📊",txt:"カロリーが目安を超えています。脂質・糖質の多い食品を控えてみましょう。",cls:"da-warn"});
  if(pct("protein")<65) lines.push({ico:"💪",txt:"タンパク質が不足気味です。毎食に卵・肉・魚・豆類を取り入れましょう。",cls:"da-bad"});
  if(pct("fiber")<60) lines.push({ico:"🥦",txt:"食物繊維が少なめです。野菜・きのこ・海藻・全粒穀物を意識しましょう。",cls:"da-bad"});
  if(pct("calcium")<60) lines.push({ico:"🦴",txt:"カルシウムが不足傾向です。牛乳・ヨーグルト・豆腐を取り入れましょう。",cls:"da-warn"});
  if((t.sodium||0)>ref.sodium) lines.push({ico:"🧂",txt:"塩分摂取が多めです。しょうゆ・みそ・加工食品を控えましょう。",cls:"da-warn"});
  if(pct("B1")<60) lines.push({ico:"🌿",txt:"ビタミンB1が少なめです。豚肉・豆類・全粒穀物を意識しましょう。",cls:"da-warn"});
  if(lines.length===0) lines.push({ico:"✅",txt:"今日の栄養バランスは概ね良好です！この調子で続けましょう。",cls:"da-ok"});
  return lines;
}

function renderCompare(today, ref) {
  const yd=new Date(); yd.setDate(yd.getDate()-1);
  const yStr=toDS(yd);
  const tN=sumNuts(records.filter(r=>r.date===today));
  const yN=sumNuts(records.filter(r=>r.date===yStr));
  const body=$("cmp-body");
  if(!records.find(r=>r.date===yStr)){ body.innerHTML=`<p class="cmp-nodata">昨日のデータがありません</p>`; return; }
  const keys=["calories","protein","fat","carbs","fiber"];
  const ICONS={calories:"🔥",protein:"💪",fat:"🫒",carbs:"🌾",fiber:"🥦"};
  const LBLS={calories:"カロリー",protein:"タンパク質",fat:"脂質",carbs:"炭水化物",fiber:"食物繊維"};
  const UNITS={calories:"kcal",protein:"g",fat:"g",carbs:"g",fiber:"g"};
  body.innerHTML=keys.map(k=>{
    const tv=tN[k]||0, yv=yN[k]||0, diff=tv-yv;
    const pctD=yv>0?Math.round(diff/yv*100):0;
    const dc=diff>3?"d-up":diff<-3?"d-down":"d-zero";
    const sign=diff>3?"▲":diff<-3?"▼":"─";
    return `<div class="cmp-row">
      <span class="cmp-ico">${ICONS[k]}</span>
      <span class="cmp-name">${LBLS[k]}</span>
      <span class="cmp-v cmp-today">${r1(tv)}<small style="color:var(--text3);font-size:.56rem"> ${UNITS[k]}</small></span>
      <span class="cmp-v cmp-yest">${r1(yv)}</span>
      <span class="cmp-delta ${dc}">${sign}${Math.abs(pctD)}%</span>
    </div>`;
  }).join("");
}

// ── 食事推移（expandable day accordion） ─────────────────
function renderMealHistory() {
  const days=[]; for(let i=6;i>=0;i--){ const d=new Date(); d.setDate(d.getDate()-i); days.push(toDS(d)); }
  const today=toDS(new Date());
  const byDate={};
  records.forEach(r=>{ if(!byDate[r.date]) byDate[r.date]=[]; byDate[r.date].push(r); });

  const list=$("meal-history-list");
  list.innerHTML = days.reverse().map(ds=>{
    const recs=(byDate[ds]||[]).sort((a,b)=>b.timestamp-a.timestamp);
    const totalCal=recs.reduce((s,r)=>s+(r.calories||0),0);
    const label=ds===today?"今日 🌟":fmtDate(ds);
    const mealsHtml=recs.length===0
      ? `<div class="mh-empty">記録なし</div>`
      : recs.map(r=>`
        <div class="mh-meal-item">
          <span class="mh-meal-time">${MEAL_I[r.mealTime]}${MEAL_L[r.mealTime]}</span>
          <span class="mh-meal-foods" title="${r.foods}">${r.foods}</span>
          <span class="mh-meal-cal">${Math.round(r.calories).toLocaleString()} kcal</span>
          <button class="mh-meal-del" data-id="${r.id}">✕</button>
        </div>`).join("");
    return `<div class="mh-day" id="mhd-${ds}">
      <div class="mh-day-hd" onclick="toggleDay('${ds}')">
        <span class="mh-day-date">${label}</span>
        <span class="mh-day-cal">${totalCal?totalCal.toLocaleString()+" kcal":"未記録"}</span>
        <span class="mh-day-toggle">▾</span>
      </div>
      <div class="mh-day-meals">${mealsHtml}</div>
    </div>`;
  }).join("");

  // Auto-open today
  const todayEl=$(`mhd-${today}`);
  if(todayEl) todayEl.classList.add("open");

  // Delete handlers
  list.querySelectorAll(".mh-meal-del").forEach(btn=>{
    btn.addEventListener("click", e=>{ e.stopPropagation();
      records=records.filter(r=>r.id!==Number(btn.dataset.id));
      saveRec(); updateBadge(); renderHistory(); toast("削除しました");
    });
  });
}

window.toggleDay = function(ds) {
  const el = $(`mhd-${ds}`);
  if(el) el.classList.toggle("open");
};

function renderChronic(ref) {
  const cutoff=new Date(); cutoff.setDate(cutoff.getDate()-7);
  const recent=records.filter(r=>r.date>=toDS(cutoff));
  const cb=$("chronic-body");
  if(recent.length<2){ cb.innerHTML=`<div class="ch-ok">📊 2食以上記録すると慢性的な不足を分析できます</div>`; return; }
  const byDate={}; recent.forEach(r=>{ if(!byDate[r.date]) byDate[r.date]=[]; byDate[r.date].push(r); });
  const dates=Object.keys(byDate);
  const minK=["protein","fat","carbs","fiber","calcium","iron","vitaminC","B1","B2","B6"];
  const LMAP={protein:"タンパク質",fat:"脂質",carbs:"炭水化物",fiber:"食物繊維",calcium:"カルシウム",iron:"鉄分",vitaminC:"ビタミンC",B1:"ビタミンB1",B2:"ビタミンB2",B6:"ビタミンB6"};
  const ICONS2={protein:"💪",fat:"🫒",carbs:"🌾",fiber:"🥦",calcium:"🦴",iron:"⚙️",vitaminC:"🍊",B1:"🌿",B2:"🌱",B6:"🫛"};
  const FOODS={protein:["鶏むね肉","卵","納豆","豆腐","ツナ缶"],fat:["ナッツ","アボカド","さば","チーズ"],carbs:["ご飯","パン","パスタ","バナナ"],fiber:["ブロッコリー","海藻","きのこ","オートミール"],calcium:["牛乳","ヨーグルト","豆腐","小魚"],iron:["レバー","ほうれん草","枝豆","あさり"],vitaminC:["ブロッコリー","パプリカ","いちご","みかん"],B1:["豚肉","豆類","全粒粉"],B2:["乳製品","卵","レバー"],B6:["肉類","魚","バナナ"]};
  const analysis=minK.map(k=>{
    const avg=dates.reduce((s,ds)=>{const n=sumNuts(byDate[ds]);return s+(n[k]||0)/ref[k]*100;},0)/dates.length;
    return {k,avg:Math.round(avg)};
  }).filter(a=>a.avg<75).sort((a,b)=>a.avg-b.avg);

  if(!analysis.length){ cb.innerHTML=`<div class="ch-ok">🎉 直近7日間の栄養バランスは概ね良好です！</div>`; return; }
  cb.innerHTML=analysis.map(({k,avg})=>{
    const sev=avg<40?"dot-hi":avg<60?"dot-mid":"dot-lo";
    const ftags=(FOODS[k]||[]).map(f=>`<span class="ch-ftag">${f}</span>`).join("");
    return `<div class="ch-card">
      <div class="ch-hd"><div class="ch-dot ${sev}"></div><span class="ch-nut">${ICONS2[k]} ${LMAP[k]}</span><span class="ch-pct">平均達成率 ${avg}%</span></div>
      <div class="ch-body">
        <div class="ch-advice">${getChronicAdvice(k)}</div>
        <div class="ch-foods">${ftags}</div>
      </div>
    </div>`;
  }).join("");
}

function getChronicAdvice(k) {
  const m={protein:"タンパク質が慢性的に不足しています。毎食に動物性・植物性タンパクを意識して取り入れましょう。",fat:"脂質が継続的に少なめです。良質な不飽和脂肪酸（魚・ナッツ・アボカド）を積極的に摂りましょう。",carbs:"炭水化物が不足傾向です。主食をしっかり摂り、活動に必要なエネルギーを確保しましょう。",fiber:"食物繊維が慢性的に不足しています。腸内環境のために野菜・きのこ・海藻を毎食加えましょう。",calcium:"カルシウムが継続的に不足しています。骨密度維持のために乳製品・豆腐・小魚を毎日食べましょう。",iron:"鉄分が慢性的に不足しています。疲れやすさにつながることがあります。赤身肉・緑黄色野菜を取り入れましょう。",vitaminC:"ビタミンCが不足傾向です。免疫力維持のために野菜・果物を毎日取り入れましょう。",B1:"ビタミンB1が慢性的に不足しています。エネルギー代謝のために豚肉・豆類・全粒穀物を意識しましょう。",B2:"ビタミンB2が不足傾向です。代謝を支えるために乳製品・卵・レバーを取り入れましょう。",B6:"ビタミンB6が不足傾向です。タンパク質代謝のために肉・魚・バナナを意識しましょう。"};
  return m[k]||"";
}

function renderHistList() {
  const sorted=[...records].sort((a,b)=>b.timestamp-a.timestamp);
  const byDate={}; sorted.forEach(r=>{ if(!byDate[r.date]) byDate[r.date]=[]; byDate[r.date].push(r); });
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
    records=records.filter(r=>r.id!==Number(btn.dataset.id)); saveRec(); updateBadge(); renderHistory(); toast("削除しました");
  }));
}
