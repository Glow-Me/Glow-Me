/* ============================================
   LENS — script.js
   Photo nutrition tracker with history
   ============================================ */
"use strict";

// ── Constants ──────────────────────────────────────────────────────────────
const LS_KEY = "lens_meals_v2";
const MAX_IMAGE_PX = 512;   // resize max dimension
const IMG_QUALITY  = 0.65;  // JPEG compression
const MAX_RECORDS  = 60;    // cap stored records

const DAILY_TARGETS = {
  calories:  { val: 2000, label: "カロリー",   icon: "🔥", unit: "kcal", type: "min" },
  protein:   { val: 65,   label: "タンパク質", icon: "💪", unit: "g",    type: "min" },
  fat:       { val: 55,   label: "脂質",       icon: "🫒", unit: "g",    type: "min" },
  carbs:     { val: 260,  label: "炭水化物",   icon: "🌾", unit: "g",    type: "min" },
  fiber:     { val: 21,   label: "食物繊維",   icon: "🥦", unit: "g",    type: "min" },
  sodium:    { val: 2000, label: "塩分",       icon: "🧂", unit: "mg",   type: "max" },
  calcium:   { val: 650,  label: "カルシウム", icon: "🦴", unit: "mg",   type: "min" },
  iron:      { val: 7,    label: "鉄分",       icon: "⚙️", unit: "mg",  type: "min" },
  vitaminC:  { val: 100,  label: "ビタミンC",  icon: "🍊", unit: "mg",   type: "min" },
};

const MEAL_LABELS = {
  breakfast: "🌅 朝食",
  lunch:     "☀️ 昼食",
  dinner:    "🌙 夕食",
  snack:     "🫖 間食",
};

// Foods to supplement each deficiency
const SUPPLEMENT_FOODS = {
  protein:  ["鶏むね肉", "卵", "納豆", "ツナ缶", "豆腐", "ヨーグルト"],
  fat:      ["ナッツ", "アボカド", "オリーブオイル", "チーズ", "青魚"],
  carbs:    ["ご飯", "パン", "うどん", "バナナ", "さつまいも"],
  fiber:    ["野菜全般", "ブロッコリー", "ほうれん草", "全粒粉パン", "きのこ", "海藻"],
  sodium:   null, // excess — give different advice
  calcium:  ["牛乳", "ヨーグルト", "チーズ", "豆腐", "小魚", "ほうれん草"],
  iron:     ["レバー", "ほうれん草", "ひじき", "あさり", "納豆", "赤身肉"],
  vitaminC: ["ブロッコリー", "パプリカ", "キウイ", "オレンジ", "いちご"],
};

// ── State ──────────────────────────────────────────────────────────────────
let meals = loadMeals();      // All stored records
let currentImgBase64 = null;  // Base64 of current selected image
let currentImgFull = null;    // Full resolution base64 for API
let currentMeal = "breakfast";
let currentAnalysis = null;   // Result from last API call
let scanInterval = null;

// ── DOM Helpers ────────────────────────────────────────────────────────────
const $ = id => document.getElementById(id);
const show = id => $(id).classList.remove("hidden");
const hide = id => $(id).classList.add("hidden");

// ── Init ───────────────────────────────────────────────────────────────────
(function init() {
  // Header date
  const d = new Date();
  const WD = ["日","月","火","水","木","金","土"];
  $("hd-date").textContent = `${d.getFullYear()}.${String(d.getMonth()+1).padStart(2,"0")}.${String(d.getDate()).padStart(2,"0")} ${WD[d.getDay()]}`;

  // Default date input to today
  $("record-date").value = toDateStr(new Date());

  setupEventListeners();
  updateBadge();
})();

// ── LocalStorage ───────────────────────────────────────────────────────────
function loadMeals() {
  try {
    return JSON.parse(localStorage.getItem(LS_KEY) || "[]");
  } catch { return []; }
}
function saveMeals() {
  // Keep most recent MAX_RECORDS
  const trimmed = meals.slice(-MAX_RECORDS);
  try { localStorage.setItem(LS_KEY, JSON.stringify(trimmed)); }
  catch(e) {
    // If storage full, drop oldest image
    meals.forEach(m => { m.image = ""; });
    try { localStorage.setItem(LS_KEY, JSON.stringify(trimmed)); } catch(_) {}
  }
}

// ── Utility ────────────────────────────────────────────────────────────────
function toDateStr(d) {
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
}
function formatDateLabel(dateStr) {
  const d = new Date(dateStr + "T00:00:00");
  const WD = ["日","月","火","水","木","金","土"];
  return `${d.getMonth()+1}/${d.getDate()}（${WD[d.getDay()]}）`;
}
function timeStr(ts) {
  const d = new Date(ts);
  return `${String(d.getHours()).padStart(2,"0")}:${String(d.getMinutes()).padStart(2,"0")}`;
}
function updateBadge() {
  const cnt = meals.length;
  const badge = $("badge-count");
  if (cnt > 0) { badge.textContent = cnt; badge.style.display = "flex"; }
  else { badge.style.display = "none"; }
}

// ── Image Processing ────────────────────────────────────────────────────────
function resizeImage(file, maxPx, quality) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = e => {
      const img = new Image();
      img.onload = () => {
        const scale = Math.min(1, maxPx / Math.max(img.width, img.height));
        const canvas = document.createElement("canvas");
        canvas.width  = Math.round(img.width  * scale);
        canvas.height = Math.round(img.height * scale);
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.onerror = reject;
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// ── Event Listeners ─────────────────────────────────────────────────────────
function setupEventListeners() {
  // Tab navigation
  document.querySelectorAll(".tnav").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".tnav").forEach(b => b.classList.remove("active"));
      document.querySelectorAll(".tab-panel").forEach(p => p.classList.remove("active"));
      btn.classList.add("active");
      const panel = $("tab-" + btn.dataset.tab);
      panel.classList.add("active");
      if (btn.dataset.tab === "history") renderHistory();
    });
  });

  const zone = $("upload-zone");
  zone.addEventListener("click", () => $("file-input").click());
  zone.addEventListener("dragover", e => { e.preventDefault(); zone.classList.add("drag-over"); });
  zone.addEventListener("dragleave", () => zone.classList.remove("drag-over"));
  zone.addEventListener("drop", e => {
    e.preventDefault();
    zone.classList.remove("drag-over");
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) handleImageFile(file);
  });

  $("file-input").addEventListener("change", e => {
    const file = e.target.files[0];
    if (file) handleImageFile(file);
    e.target.value = "";
  });

  $("preview-change").addEventListener("click", () => $("file-input").click());

  // Meal pills
  $("meal-pills").addEventListener("click", e => {
    const pill = e.target.closest(".mpill");
    if (!pill) return;
    document.querySelectorAll(".mpill").forEach(p => p.classList.remove("active"));
    pill.classList.add("active");
    currentMeal = pill.dataset.meal;
  });

  // Analyze
  $("btn-analyze").addEventListener("click", runAnalysis);

  // Save
  $("btn-save").addEventListener("click", saveRecord);

  // Retry
  $("btn-retry").addEventListener("click", runAnalysis);

  // New entry
  $("btn-new").addEventListener("click", resetForNewEntry);

  // Clear all
  $("btn-clear-all").addEventListener("click", () => {
    show("modal-overlay");
  });
  $("modal-cancel").addEventListener("click", () => hide("modal-overlay"));
  $("modal-confirm").addEventListener("click", () => {
    meals = [];
    saveMeals();
    updateBadge();
    hide("modal-overlay");
    showToast("全データを削除しました");
    renderHistory();
  });
}

// ── Handle Image ────────────────────────────────────────────────────────────
async function handleImageFile(file) {
  try {
    // Two sizes: thumbnail for storage, larger for API
    currentImgBase64 = await resizeImage(file, 300, 0.6);
    currentImgFull   = await resizeImage(file, MAX_IMAGE_PX, 0.8);

    $("preview-img").src = currentImgBase64;
    $("preview-block").classList.remove("hidden");
    $("upload-zone").classList.add("hidden");

    // Also reset result if previously shown
    hide("result-section");
    hide("new-entry-wrap");
    currentAnalysis = null;
  } catch(e) {
    showToast("画像の読み込みに失敗しました");
  }
}

// ── AI Analysis ─────────────────────────────────────────────────────────────
const SCAN_STEPS = ["写真を解析中...", "食品を認識中...", "栄養素を推定中...", "データを整理中..."];

async function runAnalysis() {
  if (!currentImgFull) return;

  show("result-section");
  show("ai-loading");
  hide("result-content");
  hide("ai-error");
  hide("btn-save");
  hide("new-entry-wrap");

  // Scan animation
  $("scan-img").src = currentImgBase64;
  let step = 0;
  $("scan-label").textContent = SCAN_STEPS[0];
  scanInterval = setInterval(() => {
    step = (step + 1) % SCAN_STEPS.length;
    $("scan-label").textContent = SCAN_STEPS[step];
  }, 1800);

  const mealLabel = MEAL_LABELS[currentMeal] || currentMeal;
  const prompt = `あなたは日本の管理栄養士AIです。この食事の写真を詳しく分析してください。

食事の種類: ${mealLabel}

写真に写っている全ての食品・料理を特定し、それぞれの量を推定して、合計の栄養素を計算してください。

以下のJSON形式のみで回答してください（コードブロック・説明文は一切不要）:
{
  "foods": ["食品名1", "食品名2", "食品名3"],
  "totalCalories": 数値（整数、kcal）,
  "nutrients": {
    "protein": 数値（小数点1桁まで、g）,
    "fat": 数値（g）,
    "carbs": 数値（g）,
    "fiber": 数値（g）,
    "sodium": 数値（整数、mg）,
    "calcium": 数値（整数、mg）,
    "iron": 数値（小数点1桁、mg）,
    "vitaminC": 数値（整数、mg）
  },
  "comment": "この食事の栄養的な評価と改善アドバイスを1〜2文で（日本語）"
}`;

  try {
    const base64data = currentImgFull.split(",")[1];
    const mediaType  = currentImgFull.split(";")[0].split(":")[1];

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        messages: [{
          role: "user",
          content: [
            {
              type: "image",
              source: { type: "base64", media_type: mediaType, data: base64data }
            },
            { type: "text", text: prompt }
          ]
        }]
      })
    });

    clearInterval(scanInterval);

    if (!response.ok) throw new Error(`API error ${response.status}`);

    const data = await response.json();
    const raw = data.content?.map(c => c.text || "").join("").trim();
    const clean = raw.replace(/^```json\s*/i,"").replace(/^```\s*/i,"").replace(/```\s*$/,"").trim();
    currentAnalysis = JSON.parse(clean);

    renderResult(currentAnalysis);
    hide("ai-loading");
    show("result-content");
    show("btn-save");

  } catch(err) {
    clearInterval(scanInterval);
    console.error(err);
    hide("ai-loading");
    $("ae-msg").textContent = `分析に失敗しました。写真が不鮮明な場合は撮り直してみてください。（${err.message}）`;
    show("ai-error");
  }
}

// ── Render Result ────────────────────────────────────────────────────────────
function renderResult(data) {
  // Header
  $("rc-thumb").src = currentImgBase64;
  $("rc-meal-tag").textContent = MEAL_LABELS[currentMeal];
  $("rc-cal-num").textContent = Math.round(data.totalCalories).toLocaleString();

  // AI comment
  $("ai-bubble").textContent = data.comment || "";

  // Foods
  $("foods-wrap").innerHTML = (data.foods || []).map(f =>
    `<span class="food-tag">${f}</span>`
  ).join("");

  // Nutrients
  const nutKeys = ["protein","fat","carbs","fiber","sodium","calcium","iron","vitaminC"];
  $("nut-list").innerHTML = nutKeys.map(k => {
    const t = DAILY_TARGETS[k];
    const val = data.nutrients?.[k] ?? 0;
    const pct = Math.min(Math.round(val / t.val * 100), 120);
    const status = t.type === "max"
      ? (pct > 100 ? "nf-warn" : "nf-ok")
      : (pct < 40 ? "nf-low" : pct > 110 ? "nf-warn" : "nf-ok");
    return `
      <div class="nut-row">
        <span class="nut-ico">${t.icon}</span>
        <div class="nut-bar-wrap">
          <div class="nut-bar-label">${t.label}</div>
          <div class="nut-track"><div class="nut-fill ${status}" style="width:0%" data-w="${pct}%"></div></div>
        </div>
        <div class="nut-val">${val}<small> ${t.unit}</small></div>
      </div>`;
  }).join("");

  // Animate bars
  requestAnimationFrame(() => requestAnimationFrame(() => {
    document.querySelectorAll(".nut-fill").forEach(el => { el.style.width = el.dataset.w; });
  }));
}

// ── Save Record ──────────────────────────────────────────────────────────────
function saveRecord() {
  if (!currentAnalysis) return;

  const dateVal = $("record-date").value || toDateStr(new Date());
  const record = {
    id: Date.now(),
    timestamp: Date.now(),
    date: dateVal,
    mealTime: currentMeal,
    image: currentImgBase64 || "",
    foods: currentAnalysis.foods || [],
    calories: Math.round(currentAnalysis.totalCalories || 0),
    nutrients: { ...currentAnalysis.nutrients },
    comment: currentAnalysis.comment || "",
  };

  meals.push(record);
  saveMeals();
  updateBadge();

  hide("btn-save");
  show("new-entry-wrap");
  showToast("✓ 食事を保存しました！");
}

// ── Reset for new entry ──────────────────────────────────────────────────────
function resetForNewEntry() {
  currentImgBase64 = null;
  currentImgFull   = null;
  currentAnalysis  = null;
  currentMeal = "breakfast";

  $("preview-img").src = "";
  hide("preview-block");
  show("upload-zone");
  hide("result-section");
  hide("new-entry-wrap");

  // Reset meal pills
  document.querySelectorAll(".mpill").forEach((p,i) => p.classList.toggle("active", i===0));
  $("record-date").value = toDateStr(new Date());

  window.scrollTo({ top: 0, behavior: "smooth" });
}

// ── Toast ────────────────────────────────────────────────────────────────────
function showToast(msg) {
  const t = $("toast");
  t.textContent = msg;
  t.classList.add("show");
  setTimeout(() => t.classList.remove("show"), 2800);
}

// ── HISTORY RENDERING ────────────────────────────────────────────────────────
function renderHistory() {
  if (meals.length === 0) {
    show("history-empty");
    hide("history-main");
    return;
  }
  hide("history-empty");
  show("history-main");

  const today = toDateStr(new Date());
  const todayMeals = meals.filter(m => m.date === today);

  renderTodaySummary(todayMeals);
  renderComparison(today);
  renderTrend();
  renderDeficitAnalysis();
  renderMealsList();
}

// ── Today Summary ─────────────────────────────────────────────────────────────
function renderTodaySummary(todayMeals) {
  const totals = sumNutrients(todayMeals);
  $("tcc-num").textContent = Math.round(totals.calories).toLocaleString();
  $("tcc-target").textContent = `目標: ${DAILY_TARGETS.calories.val.toLocaleString()} kcal`;
  $("tcc-meals").textContent = todayMeals.length > 0
    ? `${todayMeals.length}食を記録済み`
    : "本日の記録なし";

  const showKeys = ["protein","fat","carbs","fiber","calcium","iron"];
  $("today-nut-grid").innerHTML = showKeys.map(k => {
    const t = DAILY_TARGETS[k];
    const val = totals[k] ?? 0;
    const pct = Math.round(val / t.val * 100);
    const cls = t.type === "max"
      ? (pct > 100 ? "tng-warn" : "tng-ok")
      : (pct < 60 ? "tng-low" : pct > 120 ? "tng-warn" : "tng-ok");
    return `
      <div class="tng-card ${cls}">
        <div class="tng-icon">${t.icon}</div>
        <div class="tng-label">${t.label}</div>
        <div class="tng-val">${roundNut(val)}<span class="tng-unit"> ${t.unit}</span></div>
        <div class="tng-pct">${pct}%</div>
      </div>`;
  }).join("");
}

// ── Comparison ────────────────────────────────────────────────────────────────
function renderComparison(today) {
  const ys = new Date(); ys.setDate(ys.getDate() - 1);
  const yesterday = toDateStr(ys);
  const todayMeals = meals.filter(m => m.date === today);
  const yMeals     = meals.filter(m => m.date === yesterday);

  if (yMeals.length === 0) {
    $("compare-list").innerHTML = `<p style="color:var(--text-dim);font-size:0.82rem;padding:.5rem 0">昨日のデータがありません</p>`;
    return;
  }

  const tT = sumNutrients(todayMeals);
  const tY = sumNutrients(yMeals);
  const keys = ["calories","protein","fat","carbs","fiber"];

  $("compare-list").innerHTML = keys.map(k => {
    const t = DAILY_TARGETS[k];
    const tv = tT[k] ?? 0; const yv = tY[k] ?? 0;
    const diff = tv - yv;
    const pctDiff = yv > 0 ? Math.round(diff / yv * 100) : 0;
    const diffCls = diff > 5 ? "delta-up" : diff < -5 ? "delta-down" : "delta-zero";
    const sign = diff > 5 ? "▲" : diff < -5 ? "▼" : "─";
    return `
      <div class="compare-row">
        <span class="cmp-ico">${t.icon}</span>
        <span class="cmp-name">${t.label}</span>
        <span class="cmp-today">${roundNut(tv)}<small style="color:var(--text-dim);font-size:.62rem"> ${t.unit}</small></span>
        <span class="cmp-yest">${roundNut(yv)}<small style="color:var(--text-dim);font-size:.62rem"> ${t.unit}</small></span>
        <span class="cmp-delta ${diffCls}">${sign}${Math.abs(pctDiff)}%</span>
      </div>`;
  }).join("");
}

// ── 7-Day Trend ───────────────────────────────────────────────────────────────
function renderTrend() {
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(); d.setDate(d.getDate() - i);
    days.push(toDateStr(d));
  }
  const today = toDateStr(new Date());

  const dayData = days.map(ds => {
    const ms = meals.filter(m => m.date === ds);
    return { date: ds, cal: ms.reduce((s, m) => s + (m.calories||0), 0), count: ms.length };
  });

  const maxCal = Math.max(...dayData.map(d => d.cal), DAILY_TARGETS.calories.val);

  $("trend-bar-area").innerHTML = dayData.map(d => {
    const h = d.count > 0 ? Math.round(d.cal / maxCal * 88) : 3;
    const isToday = d.date === today;
    const cls = isToday ? "today" : d.count > 0 ? "has-data" : "past";
    return `
      <div class="t-col">
        <div class="t-val">${d.count > 0 ? Math.round(d.cal/100)*100 : ""}</div>
        <div class="t-bar ${cls}" style="height:${h}px"></div>
      </div>`;
  }).join("");

  $("trend-label-row").innerHTML = dayData.map(d => {
    const date = new Date(d.date + "T00:00:00");
    const WD = ["日","月","火","水","木","金","土"];
    return `<div class="t-label">${WD[date.getDay()]}</div>`;
  }).join("");
}

// ── Deficit Analysis ──────────────────────────────────────────────────────────
function renderDeficitAnalysis() {
  // Use last 7 days of data
  const cutoff = new Date(); cutoff.setDate(cutoff.getDate() - 7);
  const cutStr = toDateStr(cutoff);
  const recentMeals = meals.filter(m => m.date >= cutStr);

  if (recentMeals.length < 2) {
    $("deficit-wrap").innerHTML = `<div class="deficit-all-ok">📊 2食以上記録すると慢性的な不足栄養素を分析できます</div>`;
    return;
  }

  // Group by date to get daily totals
  const byDate = {};
  recentMeals.forEach(m => {
    if (!byDate[m.date]) byDate[m.date] = [];
    byDate[m.date].push(m);
  });
  const dates = Object.keys(byDate);

  // For each nutrient, compute avg % of target
  const nutKeys = ["protein","fat","carbs","fiber","calcium","iron","vitaminC"];
  const analysis = nutKeys.map(k => {
    const t = DAILY_TARGETS[k];
    const dailyPcts = dates.map(ds => {
      const daily = sumNutrients(byDate[ds]);
      return (daily[k] ?? 0) / t.val * 100;
    });
    const avgPct = dailyPcts.reduce((a,b) => a+b, 0) / dailyPcts.length;
    return { key: k, t, avgPct: Math.round(avgPct) };
  });

  // Also check sodium excess
  const sodiumDailyPcts = dates.map(ds => {
    const daily = sumNutrients(byDate[ds]);
    return (daily.sodium ?? 0) / DAILY_TARGETS.sodium.val * 100;
  });
  const avgSodiumPct = Math.round(sodiumDailyPcts.reduce((a,b)=>a+b,0) / sodiumDailyPcts.length);

  const deficits = analysis.filter(a => a.avgPct < 70).sort((a,b) => a.avgPct - b.avgPct);

  let html = "";

  // Sodium excess warning
  if (avgSodiumPct > 110) {
    html += `
      <div class="deficit-card">
        <div class="dc-header">
          <div class="dc-sev sev-high"></div>
          <span class="dc-nut">🧂 塩分過多</span>
          <span class="dc-pct">平均 ${avgSodiumPct}%（推奨値超過）</span>
        </div>
        <div class="dc-body">
          <div class="dc-advice">塩分の過剰摂取が続いています。しょうゆ・みそ・加工食品を控え、香辛料や出汁で風味を出すよう心がけましょう。</div>
        </div>
      </div>`;
  }

  if (deficits.length === 0 && avgSodiumPct <= 110) {
    html = `<div class="deficit-all-ok">🎉 直近7日間の栄養バランスは概ね良好です！</div>`;
  } else {
    deficits.forEach(a => {
      const sev = a.avgPct < 40 ? "sev-high" : a.avgPct < 60 ? "sev-medium" : "sev-low";
      const foods = (SUPPLEMENT_FOODS[a.key] || []).slice(0,5);
      const adviceMap = {
        protein:  "タンパク質が慢性的に不足しています。毎食に肉・魚・卵・豆類のどれかを取り入れましょう。",
        fat:      "脂質が不足気味です。良質な脂質（ナッツ、アボカド、青魚）を意識して摂りましょう。",
        carbs:    "炭水化物が少なめです。適切なエネルギー源として主食（ご飯・パン・麺）を確保しましょう。",
        fiber:    "食物繊維が慢性的に不足しています。野菜・きのこ・海藻・全粒粉を意識して毎食取り入れましょう。",
        calcium:  "カルシウムが不足しています。骨の健康のために乳製品・豆腐・小魚を習慣的に食べましょう。",
        iron:     "鉄分が不足しています。特に女性は貧血に注意。レバー・赤身肉・ほうれん草を積極的に摂りましょう。",
        vitaminC: "ビタミンCが不足しています。免疫力維持のためブロッコリー・パプリカ・柑橘類を毎日食べましょう。",
      };
      html += `
        <div class="deficit-card">
          <div class="dc-header">
            <div class="dc-sev ${sev}"></div>
            <span class="dc-nut">${a.t.icon} ${a.t.label}</span>
            <span class="dc-pct">平均達成率 ${a.avgPct}%</span>
          </div>
          <div class="dc-body">
            <div class="dc-advice">${adviceMap[a.key] || ""}</div>
            ${foods.length ? `<div class="dc-foods">${foods.map(f=>`<span class="dc-food-tag">${f}</span>`).join("")}</div>` : ""}
          </div>
        </div>`;
    });
  }

  $("deficit-wrap").innerHTML = html;
}

// ── Meals List ────────────────────────────────────────────────────────────────
function renderMealsList() {
  const sorted = [...meals].sort((a,b) => b.timestamp - a.timestamp);

  // Group by date
  const byDate = {};
  sorted.forEach(m => {
    if (!byDate[m.date]) byDate[m.date] = [];
    byDate[m.date].push(m);
  });

  const today = toDateStr(new Date());
  let html = "";

  Object.entries(byDate).forEach(([date, dayMeals]) => {
    const label = date === today ? "今日" : formatDateLabel(date);
    html += `<div class="meal-day-group"><div class="meal-day-label">${label}</div>`;
    dayMeals.forEach(m => {
      const foodsStr = m.foods?.join("・") || "不明";
      const imgHtml = m.image
        ? `<img class="mc-thumb" src="${m.image}" alt="" />`
        : `<div class="mc-thumb-placeholder">${["🍚","🥗","🍛","🍜","🥪"][Math.floor(Math.random()*5)]}</div>`;
      html += `
        <div class="meal-card" data-id="${m.id}">
          ${imgHtml}
          <div class="mc-info">
            <div class="mc-meal">${MEAL_LABELS[m.mealTime] || m.mealTime}</div>
            <div class="mc-foods" title="${foodsStr}">${foodsStr}</div>
            <div class="mc-time">${timeStr(m.timestamp)}</div>
          </div>
          <div>
            <div class="mc-cal">${Math.round(m.calories).toLocaleString()}<span class="mc-cal-unit"> kcal</span></div>
          </div>
          <button class="mc-del" data-id="${m.id}" title="削除">✕</button>
        </div>`;
    });
    html += `</div>`;
  });

  $("meals-grid").innerHTML = html;

  // Delete individual record
  document.querySelectorAll(".mc-del").forEach(btn => {
    btn.addEventListener("click", e => {
      e.stopPropagation();
      const id = Number(btn.dataset.id);
      meals = meals.filter(m => m.id !== id);
      saveMeals();
      updateBadge();
      renderHistory();
      showToast("記録を削除しました");
    });
  });
}

// ── Utilities ─────────────────────────────────────────────────────────────────
function sumNutrients(mealArr) {
  const keys = Object.keys(DAILY_TARGETS);
  const out = { calories: 0 };
  keys.forEach(k => { out[k] = 0; });
  mealArr.forEach(m => {
    out.calories += m.calories || 0;
    if (m.nutrients) {
      keys.forEach(k => { out[k] = (out[k] || 0) + (m.nutrients[k] || 0); });
    }
  });
  // Round all
  Object.keys(out).forEach(k => { out[k] = Math.round(out[k] * 10) / 10; });
  return out;
}

function roundNut(v) {
  return v >= 100 ? Math.round(v) : Math.round(v * 10) / 10;
}
