"use strict";

/* ---------- helpers ---------- */
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const esc = value => String(value ?? "").replace(/[&<>"']/g, ch => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch]));
const safeImageUrl = value => {
  const url = String(value ?? "").trim();
  if (/^data:image\//i.test(url)) return url;
  try {
    const parsed = new URL(url);
    return /^https?:$/.test(parsed.protocol) ? parsed.href : "";
  } catch (_) {
    return "";
  }
};
const photo = id => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=640&q=70`;
const CATS = [
  "1518791841217-8f162f1e1131","1574158622682-e40e69881006","1495360010541-f48722b34f7d",
  "1513360371669-4adf3dd7dff8","1533738363-b7f9aef128ce","1592194996308-7b43878e84a6",
  "1573865526739-10659fec78a5","1529778873920-4da4926a72c2","1543852786-1cf6624b9987",
  "1478098711619-5ab0b478d6e6","1501820488136-72669149e0d4","1526336024174-e58f5cdd8e13",
  "1561948955-570b270e7c36","1596854407944-bf87f6fdd49e","1519052537078-e6302a4968d4",
  "1511044568932-338cba0ad803","1548802673-380ab8ebc7b7","1555685812-4b943f1cb0eb"
];
const DOGS = [
  "1552053831-71594a27632d","1587300003388-59208cc962cb","1543466835-00a7907e9de1",
  "1517849845537-4d257902454a","1558788353-f76d92427f16","1583337130417-3346a1be7dee",
  "1568572933382-74d440642117","1537151625747-768eb6cf92b2","1518717758536-85ae29035b6d",
  "1477884213360-7e9d7dcc1e48","1596492784531-6e6eb5ea9993","1583511655857-d19b40a7a54e",
  "1548199973-03cce0bbc87b","1507146426996-ef05306b995a","1534361960057-19889db9621e",
  "1560807707-8cc77767d783","1551717743-49959800b1f6","1588943211346-0908a1fb0b01"
];
const cat = n => photo(CATS[n - 1]);
const dog = n => photo(DOGS[n - 1]);

/* ---------- cities ---------- */
const CITIES = [
  { name: "臺北市", short: "臺北" },
  { name: "新北市", short: "新北" },
  { name: "桃園市", short: "桃園" },
  { name: "臺中市", short: "臺中" },
  { name: "臺南市", short: "臺南" },
  { name: "高雄市", short: "高雄" }
];
const MAP_POS = {
  "臺北市": [228, 105], "新北市": [300, 170], "桃園市": [178, 200],
  "臺中市": [218, 308], "臺南市": [193, 420], "高雄市": [252, 478]
};
const RARITIES = {
  SSR: { order: 0, name: "超級特別的浪浪", hint: "最高稀有度" },
  SR:  { order: 1, name: "非常吸引人的浪浪", hint: "很稀有" },
  UR:  { order: 2, name: "具有特色的浪浪", hint: "少見" },
  R:   { order: 3, name: "可愛又有個性的浪浪", hint: "常見" },
  N:   { order: 4, name: "日常中值得被發現的浪浪", hint: "一般" }
};
const STATUS = "示範角色 · 非真實認養資訊";
const SOURCE = "Pawmon 示範資料（虛構角色）";
const CUSTOM_STATUS = "使用者新增 · 僅存於本機";
const CUSTOM_SOURCE = "Pawmon 使用者本機資料";
const rarityFor = (cuteness, friendliness) => {
  const total = Number(cuteness) + Number(friendliness);
  if (total >= 10) return "SSR";
  if (total === 9) return "SR";
  if (total === 8) return "UR";
  if (total >= 6) return "R";
  return "N";
};
console.assert(
  rarityFor(5, 5) === "SSR" && rarityFor(4, 5) === "SR" && rarityFor(4, 4) === "UR" &&
  rarityFor(3, 4) === "R" && rarityFor(2, 3) === "N",
  "rarityFor thresholds"
);

/* ---------- demo animals ---------- */
const ANIMALS = [
  { id: "001", name: "芝麻", type: "貓", city: "臺北市", district: "大安區", image: cat(1), cuteness: 5, friendliness: 5, rarity: "SSR",
    description: "一身烏黑亮毛，只有胸口一小撮白。看起來酷酷的，其實最愛窩在人大腿上看窗外。" },
  { id: "002", name: "椪柑", type: "貓", city: "臺北市", district: "中正區", image: cat(2), cuteness: 4, friendliness: 5, rarity: "UR",
    description: "橘白相間的陽光小貓，叫聲響亮。看到逗貓棒會瞬間忘記所有矜持。" },
  { id: "003", name: "布丁", type: "貓", city: "臺北市", district: "大同區", image: cat(3), cuteness: 3, friendliness: 4, rarity: "UR",
    description: "奶油色的圓臉貓，走路慢慢吞吞。最擅長用無辜眼神討一顆零食。" },
  { id: "004", name: "豆花", type: "狗", city: "臺北市", district: "中山區", image: dog(1), cuteness: 5, friendliness: 4, rarity: "SR",
    description: "米白色米克斯，耳朵軟軟垂著。看到人會熱情搖尾巴，是散步好夥伴。" },
  { id: "005", name: "黑輪", type: "狗", city: "臺北市", district: "松山區", image: dog(2), cuteness: 4, friendliness: 3, rarity: "R",
    description: "黑色中型犬，外表帥氣、內心憨厚。最愛把頭靠在人的膝蓋上。" },
  { id: "006", name: "地瓜", type: "狗", city: "臺北市", district: "萬華區", image: dog(3), cuteness: 3, friendliness: 3, rarity: "N",
    description: "黃褐色小土狗，短腿跑得快。對食物極度忠誠，聽到塑膠袋聲就會出現。" },

  { id: "007", name: "麻糬", type: "貓", city: "新北市", district: "板橋區", image: cat(4), cuteness: 4, friendliness: 5, rarity: "SR",
    description: "蓬鬆的白貓，膽子小但好奇心大。熟悉之後會默默跟在腳邊。" },
  { id: "008", name: "湯圓", type: "貓", city: "新北市", district: "中和區", image: cat(5), cuteness: 5, friendliness: 3, rarity: "UR",
    description: "灰白小貓，圓滾滾像剛煮好的湯圓。玩累了會直接睡在拖鞋上。" },
  { id: "009", name: "珍珠", type: "貓", city: "新北市", district: "永和區", image: cat(6), cuteness: 3, friendliness: 3, rarity: "N",
    description: "黑白乳牛花色的靈活小貓，跳上跳下停不下來。對紙箱有無法抗拒的執著。" },
  { id: "010", name: "旺來", type: "狗", city: "新北市", district: "淡水區", image: dog(4), cuteness: 4, friendliness: 5, rarity: "UR",
    description: "黃金獵犬混血，笑容燦爛。最愛玩水，看到水管就開始轉圈圈。" },
  { id: "011", name: "肉粽", type: "狗", city: "新北市", district: "三重區", image: dog(5), cuteness: 4, friendliness: 3, rarity: "R",
    description: "黑黃相間的米克斯，體格結實。看似威武，其實最怕打雷。" },
  { id: "012", name: "米漿", type: "狗", city: "新北市", district: "新莊區", image: dog(6), cuteness: 3, friendliness: 2, rarity: "N",
    description: "奶油色小型犬，毛髮柔軟。喜歡被抱在懷裡，一放下就會嗚嗚抗議。" },

  { id: "013", name: "花生", type: "貓", city: "桃園市", district: "中壢區", image: cat(7), cuteness: 5, friendliness: 4, rarity: "SR",
    description: "虎斑小貓，額頭有可愛的 M 字花紋。愛說話，會用各種音調回應你。" },
  { id: "014", name: "海苔", type: "貓", city: "桃園市", district: "大溪區", image: cat(8), cuteness: 4, friendliness: 3, rarity: "R",
    description: "深灰短毛貓，眼神認真。其實只是在想下一餐什麼時候來。" },
  { id: "015", name: "芋圓", type: "貓", city: "桃園市", district: "八德區", image: cat(9), cuteness: 3, friendliness: 3, rarity: "N",
    description: "淡紫灰色的小貓，安靜又慢熟。喜歡躲在窗簾後面觀察世界。" },
  { id: "016", name: "黑糖", type: "狗", city: "桃園市", district: "桃園區", image: dog(7), cuteness: 4, friendliness: 4, rarity: "UR",
    description: "深棕色中型犬，眼睛亮晶晶。散步時會不停回頭確認你有沒有跟上。" },
  { id: "017", name: "豆漿", type: "狗", city: "桃園市", district: "平鎮區", image: dog(8), cuteness: 3, friendliness: 3, rarity: "R",
    description: "白色米克斯，耳朵一黑一白。個性穩定，適合慢慢認識的新朋友。" },
  { id: "018", name: "魯蛋", type: "狗", city: "桃園市", district: "龍潭區", image: dog(9), cuteness: 2, friendliness: 4, rarity: "N",
    description: "黑色短毛犬，圓頭圓眼。最喜歡球，會把球放在你腳邊等你丟。" },

  { id: "019", name: "起司", type: "貓", city: "臺中市", district: "西屯區", image: cat(10), cuteness: 5, friendliness: 5, rarity: "SSR",
    description: "金黃色長毛貓，像一塊融化的起司。脾氣溫和，任人摸肚肚也不生氣。" },
  { id: "020", name: "可樂", type: "貓", city: "臺中市", district: "中區", image: cat(11), cuteness: 4, friendliness: 4, rarity: "UR",
    description: "黑得發亮的活潑小貓，一開門就衝到門口迎接。尾巴總是高高翹起。" },
  { id: "021", name: "仙草", type: "貓", city: "臺中市", district: "西區", image: cat(12), cuteness: 3, friendliness: 4, rarity: "R",
    description: "黑灰虎斑，外表有個性，內心很黏人。最愛在鍵盤上睡覺。" },
  { id: "022", name: "拿鐵", type: "狗", city: "臺中市", district: "北屯區", image: dog(10), cuteness: 5, friendliness: 4, rarity: "SR",
    description: "咖啡色長毛犬，氣質溫柔。喜歡安靜地陪在旁邊，是天生的傾聽者。" },
  { id: "023", name: "Q比", type: "狗", city: "臺中市", district: "南屯區", image: dog(11), cuteness: 4, friendliness: 3, rarity: "R",
    description: "白色捲毛小型犬，像一團棉花糖。活力十足，最愛追著自己的尾巴跑。" },
  { id: "024", name: "麻吉", type: "狗", city: "臺中市", district: "豐原區", image: dog(12), cuteness: 3, friendliness: 3, rarity: "N",
    description: "黃色米克斯，笑起來眼睛瞇成一條線。對每個人都熱情，是社交高手。" },

  { id: "025", name: "泡芙", type: "貓", city: "臺南市", district: "中西區", image: cat(13), cuteness: 5, friendliness: 4, rarity: "SR",
    description: "三花小美女，毛色像奶油泡芙。喜歡曬太陽，也喜歡被輕輕梳毛。" },
  { id: "026", name: "小卷", type: "貓", city: "臺南市", district: "東區", image: cat(14), cuteness: 4, friendliness: 3, rarity: "UR",
    description: "白底虎斑貓，手腳修長。玩起雷射筆像一道白色閃電。" },
  { id: "027", name: "花枝", type: "貓", city: "臺南市", district: "歸仁區", image: cat(15), cuteness: 3, friendliness: 3, rarity: "N",
    description: "灰白花貓，有點怕生。給牠一點時間，會回報你滿滿的呼嚕聲。" },
  { id: "028", name: "灣灣", type: "狗", city: "臺南市", district: "安平區", image: dog(13), cuteness: 4, friendliness: 5, rarity: "UR",
    description: "黑白色邊境混血，聰明又愛玩。學會新把戲的速度快得讓人驚訝。" },
  { id: "029", name: "旺仔", type: "狗", city: "臺南市", district: "永康區", image: dog(14), cuteness: 4, friendliness: 3, rarity: "R",
    description: "棕白相間的短腿犬，走路搖搖擺擺。最愛坐在門口看人來人往。" },
  { id: "030", name: "大頭", type: "狗", city: "臺南市", district: "新化區", image: dog(15), cuteness: 3, friendliness: 3, rarity: "N",
    description: "灰黑色米克斯，頭好壯壯。看起來有點嚴肅，其實最愛被搔下巴。" },

  { id: "031", name: "奶茶", type: "貓", city: "高雄市", district: "苓雅區", image: cat(16), cuteness: 5, friendliness: 5, rarity: "SSR",
    description: "焦糖色長毛貓，氣質慵懶。最喜歡趴在窗邊看夕陽，順便打個盹。" },
  { id: "032", name: "蛋黃", type: "貓", city: "高雄市", district: "新興區", image: cat(17), cuteness: 5, friendliness: 3, rarity: "UR",
    description: "橘色小貓，圓眼睛像兩顆蛋黃。好奇心旺盛，什麼都想聞一聞。" },
  { id: "033", name: "小虎", type: "貓", city: "高雄市", district: "鳳山區", image: cat(18), cuteness: 3, friendliness: 4, rarity: "R",
    description: "虎斑小貓，名字霸氣但膽子很小。熟悉後會變成愛撒嬌的跟屁蟲。" },
  { id: "034", name: "阿肥", type: "狗", city: "高雄市", district: "左營區", image: dog(16), cuteness: 2, friendliness: 4, rarity: "SR",
    description: "米黃色拉布拉多混血，體型圓潤。個性溫吞，最愛在草地慢慢散步。" },
  { id: "035", name: "皮蛋", type: "狗", city: "高雄市", district: "鼓山區", image: dog(17), cuteness: 4, friendliness: 3, rarity: "R",
    description: "黑白花小型犬，鬼靈精怪。會偷偷把玩具藏到沙發底下。" },
  { id: "036", name: "阿柴", type: "狗", city: "高雄市", district: "美濃區", image: dog(18), cuteness: 3, friendliness: 3, rarity: "N",
    description: "赤色柴犬，表情豐富。看似高冷，其實只要拿出零食就會立刻靠過來。" }
];
ANIMALS.forEach(a => { a.status = STATUS; a.source = SOURCE; });
const byId = new Map(ANIMALS.map(a => [a.id, a]));
const RARITY_ORDER = Object.fromEntries(Object.entries(RARITIES).map(([k, v]) => [k, v.order]));

/* ---------- persisted state ---------- */
const STORE_KEY = "pawmon.v1";
let customAnimals = [];
let favs = new Set();
let visited = new Set();

function normalizeCustomAnimal(raw) {
  if (!raw || typeof raw !== "object") return null;
  const id = typeof raw.id === "string" && /^U\d{3,6}$/.test(raw.id) ? raw.id : "";
  const name = String(raw.name ?? "").trim().slice(0, 20);
  const city = CITIES.some(c => c.name === raw.city) ? raw.city : "";
  const district = String(raw.district ?? "").trim().slice(0, 10);
  const description = String(raw.description ?? "").trim().slice(0, 200);
  const image = safeImageUrl(raw.image);
  const cuteness = raw.cuteness;
  const friendliness = raw.friendliness;
  if (!id || byId.has(id) || !name || !["貓", "狗"].includes(raw.type) || !city || !district || !description || !image) return null;
  if (!Number.isInteger(cuteness) || cuteness < 1 || cuteness > 5) return null;
  if (!Number.isInteger(friendliness) || friendliness < 1 || friendliness > 5) return null;
  return {
    id, name, type: raw.type, city, district, image, cuteness, friendliness,
    rarity: rarityFor(cuteness, friendliness), description,
    status: CUSTOM_STATUS, source: CUSTOM_SOURCE, custom: true
  };
}

try {
  const saved = JSON.parse(localStorage.getItem(STORE_KEY) || "{}");
  if (Array.isArray(saved.animals)) saved.animals.forEach(raw => {
    const a = normalizeCustomAnimal(raw);
    if (!a) return;
    customAnimals.push(a);
    ANIMALS.push(a);
    byId.set(a.id, a);
  });
  if (Array.isArray(saved.favs)) favs = new Set(saved.favs.filter(id => byId.has(id)));
  if (Array.isArray(saved.visited)) visited = new Set(saved.visited.filter(c => CITIES.some(x => x.name === c)));
} catch (_) { /* 損毀的舊資料直接忽略 */ }

function save() {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify({ favs: [...favs], visited: [...visited], animals: customAnimals }));
    return true;
  } catch (_) {
    return false;
  }
}

let currentCity = CITIES[0].name;
let currentView = "home";
let lastFocus = null;
const filters = { q: "", type: "全部", rarity: "全部", district: "全部" };

/* ---------- rendering ---------- */
const cityAnimals = city => ANIMALS.filter(a => a.city === city);
const cityCount = city => cityAnimals(city).length;
const districtCount = city => new Set(cityAnimals(city).map(a => a.district)).size;
const dots = n => `<span class="dots" aria-hidden="true">${"●".repeat(n)}<i>${"○".repeat(5 - n)}</i></span>`;
const displayId = a => a.custom ? a.id : `P${a.id}`;
const mediaHTML = a => `<img src="${esc(a.image)}" alt="${esc(a.name)}的照片" width="640" height="480" loading="lazy" decoding="async"><span class="img-fallback" aria-hidden="true">${a.type === "貓" ? "貓" : "犬"}</span>`;
const sortByRarity = list => [...list].sort((a, b) =>
  RARITY_ORDER[a.rarity] - RARITY_ORDER[b.rarity] || b.cuteness - a.cuteness || a.id.localeCompare(b.id)
);

function renderHome() {
  renderHeroDeck();
  renderMapNodes();
  $("#statAnimals").textContent = ANIMALS.length;
  // 文字版城市卡已停用，恢復時取消註解
  // renderCityGrid();
}

function renderHeroDeck() {
  const picks = [
    { id: "001", cls: "f1" },
    { id: "007", cls: "f2" },
    { id: "016", cls: "f3" },
    { id: "022", cls: "f4" },
    { id: "028", cls: "f5" },
    { id: "031", cls: "f6" }
  ];
  $("#heroDeck").innerHTML = picks.map(p => {
    const a = byId.get(p.id);
    return `<article class="fan-card ${p.cls} rarity-${a.rarity}" data-city="${a.city}">
      <div class="fan-img">${mediaHTML(a)}</div>
      <div class="fan-body">
        <span class="fan-rarity">${a.rarity}</span>
        <b>${a.name}</b>
        <small>${a.city} · ${a.district}</small>
      </div>
    </article>`;
  }).join("");
}

function renderMapNodes() {
  $("#mapNodes").innerHTML = CITIES.map(c => {
    const [x, y] = MAP_POS[c.name];
    const n = cityCount(c.name);
    return `<g class="map-node${c.name === currentCity ? " is-active" : ""}" data-city="${c.name}"
      transform="translate(${x} ${y})" tabindex="0" role="button"
      aria-label="${c.short} ${n} 位浪浪">
      <g class="hex-wrap">
        <polygon class="hex" points="0,-42 36,-21 36,21 0,42 -36,21 -36,-21"/>
        <text class="hex-city" text-anchor="middle" y="-3">${c.short}</text>
        <text class="hex-count" text-anchor="middle" y="18">${n} 位浪浪</text>
      </g>
    </g>`;
  }).join("");
}

function renderCityGrid() {
  $("#cityGrid").innerHTML = CITIES.map(c => `<button class="city-card" data-city="${c.name}">
    <span class="city-name">${c.name}</span>
    <span class="city-count">${cityCount(c.name)} 位浪浪 · ${districtCount(c.name)} 個行政區</span>
    <span class="city-go">開始探索</span>
  </button>`).join("");
}

function renderCityHeader() {
  const city = CITIES.find(c => c.name === currentCity);
  const badge = $("#cityBadge");
  badge.dataset.city = city.name;
  badge.innerHTML = `<h2>${city.name}</h2>
    <p>${cityCount(city.name)} 位浪浪 · ${districtCount(city.name)} 個行政區</p>`;
  $("#cityTitle").textContent = city.name;
  $("#citySwitch").innerHTML = CITIES.map(c =>
    `<button class="city-pill${c.name === currentCity ? " active" : ""}" data-city="${c.name}">${c.short}</button>`
  ).join("");
}

function renderDistricts() {
  const list = cityAnimals(currentCity);
  const districts = [...new Set(list.map(a => a.district))];
  const all = `<button class="chip${filters.district === "全部" ? " active" : ""}" data-district="全部">全部 <small>${list.length}</small></button>`;
  $("#districtChips").innerHTML = all + districts.map(d => {
    const n = list.filter(a => a.district === d).length;
    return `<button class="chip${filters.district === d ? " active" : ""}" data-district="${esc(d)}">${esc(d)} <small>${n}</small></button>`;
  }).join("");
}

function matchesFilters(a) {
  if (filters.type !== "全部" && a.type !== filters.type) return false;
  if (filters.rarity !== "全部" && a.rarity !== filters.rarity) return false;
  if (filters.district !== "全部" && a.district !== filters.district) return false;
  const q = filters.q.trim().toLowerCase();
  if (q && !`${a.name} ${a.description} ${a.city} ${a.district} ${a.type} ${a.rarity}`.toLowerCase().includes(q)) return false;
  return true;
}

function cardHTML(a) {
  const fav = favs.has(a.id);
  return `<article class="animal-card rarity-${a.rarity}" data-id="${esc(a.id)}" tabindex="0" role="button" aria-label="查看 ${esc(a.name)} 的詳細資訊">
    <div class="card-media">
      <span class="rarity-chip">${a.rarity}</span>
      ${mediaHTML(a)}
      <button class="fav-toggle${fav ? " is-fav" : ""}" data-fav="${esc(a.id)}" aria-pressed="${fav}" aria-label="${fav ? "取消收藏" : "收藏"}${esc(a.name)}">${fav ? "已收藏" : "收藏"}</button>
    </div>
    <div class="card-info">
      <div class="card-title"><h3>${esc(a.name)}</h3><span class="card-no">${displayId(a)}</span></div>
      <p class="card-meta"><span>${a.type === "貓" ? "貓咪" : "狗狗"}</span><span>${esc(a.city)} · ${esc(a.district)}</span>${a.custom ? '<span class="custom-tag">本機新增</span>' : ""}</p>
      <p class="card-desc">${esc(a.description)}</p>
      <div class="card-stats">
        <span title="可愛度 ${a.cuteness} / 5">可愛度 ${dots(a.cuteness)}</span>
        <span title="親近度 ${a.friendliness} / 5">親近度 ${dots(a.friendliness)}</span>
      </div>
    </div>
  </article>`;
}

function emptyHTML() {
  return `<div class="empty">
    <div class="empty-icon" aria-hidden="true">—</div>
    <h3>沒有找到符合條件的浪浪</h3>
    <p>換個關鍵字，或清除篩選再看一次。</p>
    <button class="btn-primary empty-action" data-clear>清除篩選</button>
  </div>`;
}

function renderCardList() {
  const all = cityAnimals(currentCity);
  const list = sortByRarity(all.filter(matchesFilters));
  $("#listCount").innerHTML = `顯示 <b>${list.length}</b> / ${all.length} 張卡牌`;
  $("#positionText").textContent = `${currentCity} · ${filters.district === "全部" ? "全部區域" : filters.district}`;
  $("#resultText").textContent = `共 ${list.length} 張卡牌符合條件`;
  $("#cardList").innerHTML = list.length ? list.map(cardHTML).join("") : emptyHTML();
  $("#cardList").scrollTop = 0;
}

function miniCardHTML(a) {
  return `<article class="mini-card rarity-${a.rarity}" data-id="${esc(a.id)}" tabindex="0" role="button" aria-label="查看 ${esc(a.name)}">
    <div class="mini-media">
      ${mediaHTML(a)}
      <button class="fav-toggle is-fav" data-fav="${esc(a.id)}" aria-pressed="true" aria-label="取消收藏${esc(a.name)}">已收藏</button>
    </div>
    <div class="mini-body">
      <div><h3>${esc(a.name)}</h3><p>${esc(a.city)} · ${esc(a.district)}</p>${a.custom ? '<span class="custom-tag">本機新增</span>' : ""}</div>
      <span class="rarity-chip">${a.rarity}</span>
    </div>
  </article>`;
}

const ACHIEVEMENTS = [
  { id: "first", mark: "初", name: "初次探索", desc: "進入第一個城市", test: () => visited.size >= 1 },
  { id: "cat", mark: "貓", name: "貓咪愛好者", desc: "收藏 3 隻貓咪", test: () => [...favs].filter(id => byId.get(id)?.type === "貓").length >= 3 },
  { id: "dog", mark: "犬", name: "狗狗好朋友", desc: "收藏 3 隻狗狗", test: () => [...favs].filter(id => byId.get(id)?.type === "狗").length >= 3 },
  { id: "taiwan", mark: "台", name: "台灣探索家", desc: "走訪全部六個城市", test: () => visited.size >= CITIES.length }
];
const unlockedIds = () => ACHIEVEMENTS.filter(a => a.test()).map(a => a.id);

function renderCollection() {
  const list = sortByRarity(ANIMALS.filter(a => favs.has(a.id)));
  const count = list.length;
  const total = ANIMALS.length;
  const pct = Math.round(count / total * 100);
  $("#favCount").textContent = count;
  $("#favPct").textContent = `${pct}%`;
  $("#favCityCount").textContent = visited.size;
  $("#favCountTag").textContent = count;
  $("#collectionBar").style.width = `${pct}%`;
  const labels = $$(".progress-label span");
  labels[0].textContent = `${count} / ${total}`;
  labels[1].textContent = count >= total ? "圖鑑完成！" : `再收集 ${total - count} 張就完成圖鑑`;

  $("#badges").innerHTML = ACHIEVEMENTS.map(a => {
    const on = a.test();
    return `<div class="badge ${on ? "unlocked" : "locked"}">
      <div class="badge-icon" aria-hidden="true">${on ? a.mark : "—"}</div>
      <div><b>${a.name}</b><p>${a.desc}</p></div>
      <span class="badge-state">${on ? "已解鎖" : "未解鎖"}</span>
    </div>`;
  }).join("");
  $("#badgeCount").textContent = `${unlockedIds().length} / ${ACHIEVEMENTS.length}`;

  $("#collectionGrid").innerHTML = count ? list.map(miniCardHTML).join("") : `<div class="empty collection-empty">
    <div class="empty-icon" aria-hidden="true">—</div>
    <h3>圖鑑還空空的</h3>
    <p>去城市裡逛逛，把心動的浪浪收藏起來吧。</p>
    <button class="btn-primary empty-action" data-nav="map">去探索地圖</button>
  </div>`;
}

/* ---------- modal ---------- */
function openModal(id) {
  const a = byId.get(id);
  if (!a) return;
  const fav = favs.has(a.id);
  lastFocus = document.activeElement;
  const card = $("#modalCard");
  card.className = `modal-card rarity-${a.rarity}`;
  card.innerHTML = `<button class="modal-close" data-close aria-label="關閉詳細資訊">×</button>
    <div class="modal-media">
      ${mediaHTML(a)}
      <span class="rarity-ribbon">${a.rarity} · ${RARITIES[a.rarity].name}</span>
    </div>
    <div class="modal-info">
      <div class="modal-tags">
        <span class="type-tag">${a.type === "貓" ? "貓咪" : "狗狗"}</span>
        <span class="rarity-tag">${a.rarity}</span>
        <span class="type-tag">${RARITIES[a.rarity].hint}</span>
        ${a.custom ? '<span class="type-tag">本機新增</span>' : ""}
      </div>
      <h2 id="modalName">${esc(a.name)}<span>${displayId(a)}</span></h2>
      <p class="modal-loc">${esc(a.city)} · ${esc(a.district)}</p>
      <p class="modal-desc">${esc(a.description)}</p>
      <div class="stat-row"><span class="stat-label">可愛度</span>${dots(a.cuteness)}<b>${a.cuteness} / 5</b></div>
      <div class="stat-row"><span class="stat-label">親近度</span>${dots(a.friendliness)}<b>${a.friendliness} / 5</b></div>
      <div class="info-box">
        <p><span>認養狀態</span>${esc(a.status)}</p>
        <p><span>資料來源</span>${esc(a.source)}</p>
      </div>
      <button class="btn-primary fav-large${fav ? " is-fav" : ""}" id="modalFavBtn" data-fav="${esc(a.id)}" aria-pressed="${fav}">${fav ? "已收藏這隻浪浪" : "收藏這隻浪浪"}</button>
      <p class="modal-note">稀有度與評分為網站遊戲化設計，不代表動物價值、領養順序或實際身價。</p>
    </div>`;
  $("#modal").hidden = false;
  document.body.classList.add("modal-open");
  $("#modalCard .modal-close").focus();
}

function closeModal() {
  if ($("#modal").hidden) return;
  $("#modal").hidden = true;
  document.body.classList.remove("modal-open");
  if (lastFocus && document.contains(lastFocus)) lastFocus.focus();
  lastFocus = null;
}

/* ---------- actions ---------- */
function showView(name) {
  currentView = name;
  $("#view-home").hidden = name !== "home";
  $("#view-explore").hidden = name !== "explore";
  $("#view-collection").hidden = name !== "collection";
  $("#view-upload").hidden = name !== "upload";
  $("#navFavCount").textContent = favs.size;
  $$(".nav-btn").forEach(b => b.classList.toggle("active", b.dataset.nav === (name === "explore" ? "map" : name)));
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
}

function showHome() {
  renderHome();
  showView("home");
}

function showCollection() {
  renderCollection();
  showView("collection");
}

function showUpload() {
  showView("upload");
}

function openCity(city) {
  if (!CITIES.some(c => c.name === city)) return;
  const before = unlockedIds();
  const isNew = !visited.has(city);
  currentCity = city;
  filters.district = "全部";
  visited.add(city);
  save();
  renderCityHeader();
  renderDistricts();
  renderCardList();
  renderMapNodes();
  showView("explore");
  if (isNew) checkAchievements(before);
}

/* ---------- upload ---------- */
let uploadMode = "file";
let uploadObjectUrl = "";

function nextCustomId() {
  const max = customAnimals.reduce((n, a) => Math.max(n, Number(a.id.slice(1)) || 0), 0);
  return `U${String(max + 1).padStart(3, "0")}`;
}

function compressImage(file) {
  return new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith("image/")) { reject(new Error("請選擇圖片檔案")); return; }
    if (file.size > 12 * 1024 * 1024) { reject(new Error("圖片檔案不可超過 12 MB")); return; }
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("圖片讀取失敗"));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("無法解讀這張圖片"));
      img.onload = () => {
        // shortcut: 800px / JPEG 壓縮足夠本機卡片使用，需要原圖時再改存後端。
        const scale = Math.min(1, 800 / Math.max(img.naturalWidth, img.naturalHeight));
        const canvas = document.createElement("canvas");
        canvas.width = Math.max(1, Math.round(img.naturalWidth * scale));
        canvas.height = Math.max(1, Math.round(img.naturalHeight * scale));
        const ctx = canvas.getContext("2d");
        if (!ctx) { reject(new Error("瀏覽器無法處理圖片")); return; }
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", 0.72));
      };
      img.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  });
}

function setUploadPreview(src) {
  $("#uploadPreview").innerHTML = src
    ? `<img src="${esc(src)}" alt="圖片預覽" width="300" height="224"><span class="img-fallback" aria-hidden="true">圖片</span>`
    : `<span class="preview-empty">尚未選擇圖片</span>`;
}

function clearUploadObjectUrl() {
  if (uploadObjectUrl) URL.revokeObjectURL(uploadObjectUrl);
  uploadObjectUrl = "";
}

function setUploadMode(mode) {
  uploadMode = mode === "url" ? "url" : "file";
  $$("[data-img-mode]").forEach(btn => {
    const on = btn.dataset.imgMode === uploadMode;
    btn.classList.toggle("active", on);
    btn.setAttribute("aria-pressed", String(on));
  });
  $("#filePane").hidden = uploadMode !== "file";
  $("#urlPane").hidden = uploadMode !== "url";
  $("#upFile").disabled = uploadMode !== "file";
  $("#upFile").required = uploadMode === "file";
  $("#upUrl").disabled = uploadMode !== "url";
  $("#upUrl").required = uploadMode === "url";
  if (uploadMode === "file") {
    setUploadPreview($("#upFile").files[0] ? uploadObjectUrl : "");
  } else {
    setUploadPreview(safeImageUrl($("#upUrl").value));
  }
}

function updateDistrictOptions() {
  const city = $("#upCity").value;
  const list = city ? [...new Set(cityAnimals(city).map(a => a.district))] : [];
  $("#districtOptions").innerHTML = list.map(d => `<option value="${esc(d)}"></option>`).join("");
}

function updateRarityPreview() {
  const cuteness = $("#upCute").value;
  const friendliness = $("#upFriend").value;
  const badge = $("#rarityPreview");
  if (!cuteness || !friendliness) {
    badge.className = "rarity-badge";
    badge.textContent = "—";
    $("#rarityWhy").textContent = "選好可愛度與親近度後，系統會自動分配稀有度。";
    return;
  }
  const rarity = rarityFor(cuteness, friendliness);
  badge.className = `rarity-badge rarity-${rarity}`;
  badge.textContent = rarity;
  $("#rarityWhy").textContent = `可愛度 ${cuteness} + 親近度 ${friendliness} = ${Number(cuteness) + Number(friendliness)} → ${rarity}（${RARITIES[rarity].name}）`;
}

function resetUploadForm() {
  $("#uploadForm").reset();
  clearUploadObjectUrl();
  $("#fileName").textContent = "";
  updateDistrictOptions();
  setUploadMode("file");
  updateRarityPreview();
}

function initUpload() {
  $("#upCity").innerHTML = `<option value="" disabled selected>請選擇縣市</option>` +
    CITIES.map(c => `<option value="${c.name}">${c.name}</option>`).join("");
  const scores = `<option value="" disabled selected>請選擇</option>` +
    [1, 2, 3, 4, 5].map(n => `<option value="${n}">${n} 分</option>`).join("");
  $("#upCute").innerHTML = scores;
  $("#upFriend").innerHTML = scores;
  updateDistrictOptions();
  updateRarityPreview();
  setUploadMode("file");

  $("#upCity").addEventListener("change", updateDistrictOptions);
  $("#upCute").addEventListener("change", updateRarityPreview);
  $("#upFriend").addEventListener("change", updateRarityPreview);
  $("#upUrl").addEventListener("change", () => setUploadPreview(safeImageUrl($("#upUrl").value)));
  $("#upFile").addEventListener("change", () => {
    clearUploadObjectUrl();
    const file = $("#upFile").files[0];
    if (!file) {
      $("#fileName").textContent = "";
      setUploadPreview("");
      return;
    }
    if (!file.type.startsWith("image/")) {
      $("#upFile").value = "";
      $("#fileName").textContent = "";
      setUploadPreview("");
      showToast(`<span class="toast-icon">!</span><span>請選擇 JPG、PNG 或 WebP 等圖片檔案。</span>`);
      return;
    }
    uploadObjectUrl = URL.createObjectURL(file);
    $("#fileName").textContent = `${file.name} · ${(file.size / 1024 / 1024).toFixed(1)} MB`;
    setUploadPreview(uploadObjectUrl);
  });
  $("#uploadForm").addEventListener("submit", handleUpload);
  $("#resetUpload").addEventListener("click", resetUploadForm);
}

async function handleUpload(e) {
  e.preventDefault();
  const form = e.currentTarget;
  if (!form.reportValidity()) return;

  const name = $("#upName").value.trim();
  const type = $('input[name="upType"]:checked')?.value || "";
  const city = $("#upCity").value;
  const district = $("#upDistrict").value.trim();
  const description = $("#upDesc").value.trim();
  if (!name || !type || !city || !district || !description) {
    showToast(`<span class="toast-icon">!</span><span>請完整填寫名稱、類型、出沒地與簡介。</span>`);
    return;
  }

  const submit = form.querySelector('[type="submit"]');
  const label = submit.textContent;
  submit.disabled = true;
  submit.textContent = "處理中…";
  try {
    let image;
    if (uploadMode === "file") {
      const file = $("#upFile").files[0];
      if (!file) {
        showToast(`<span class="toast-icon">!</span><span>請選擇一張圖片。</span>`);
        return;
      }
      image = await compressImage(file);
    } else {
      image = safeImageUrl($("#upUrl").value);
      if (!image) {
        showToast(`<span class="toast-icon">!</span><span>請輸入有效的 https 圖片網址。</span>`);
        $("#upUrl").focus();
        return;
      }
    }

    const cuteness = Number($("#upCute").value);
    const friendliness = Number($("#upFriend").value);
    const animal = {
      id: nextCustomId(), name, type, city, district, image, cuteness, friendliness,
      rarity: rarityFor(cuteness, friendliness), description,
      status: CUSTOM_STATUS, source: CUSTOM_SOURCE, custom: true
    };

    customAnimals.push(animal);
    ANIMALS.push(animal);
    byId.set(animal.id, animal);
    if (!save()) {
      customAnimals.pop();
      ANIMALS.pop();
      byId.delete(animal.id);
      showToast(`<span class="toast-icon">!</span><span>本機儲存空間不足，資料未新增。請改用圖片網址或清除瀏覽器資料後再試。</span>`);
      return;
    }

    resetUploadForm();
    openCity(city);
    clearFilters();
    showToast(`<span class="toast-icon">OK</span><span>已新增 <b>${esc(name)}</b> 到 ${esc(city)}，資料只存在此瀏覽器。</span>`);
  } catch (err) {
    showToast(`<span class="toast-icon">!</span><span>${esc(err.message || "圖片處理失敗")}</span>`);
  } finally {
    submit.disabled = false;
    submit.textContent = label;
  }
}

function toggleFav(id) {
  if (!byId.has(id)) return;
  const before = unlockedIds();
  const on = !favs.has(id);
  if (on) favs.add(id); else favs.delete(id);
  save();
  $("#navFavCount").textContent = favs.size;
  const btn = $("#modalFavBtn");
  if (btn && btn.dataset.fav === id) {
    btn.classList.toggle("is-fav", on);
    btn.textContent = on ? "已收藏這隻浪浪" : "收藏這隻浪浪";
    btn.setAttribute("aria-pressed", String(on));
  }
  if (currentView === "explore") renderCardList();
  if (currentView === "collection") renderCollection();
  checkAchievements(before);
}

function clearFilters() {
  filters.q = "";
  filters.type = "全部";
  filters.rarity = "全部";
  filters.district = "全部";
  $("#searchInput").value = "";
  $("#raritySelect").value = "全部";
  $$("#typeFilter button").forEach(b => b.classList.toggle("active", b.dataset.type === "全部"));
  renderDistricts();
  renderCardList();
}

let toastTimer = null;
function showToast(html) {
  const toast = $("#toast");
  toast.innerHTML = html;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 3400);
}

function checkAchievements(before) {
  const fresh = unlockedIds().filter(id => !before.includes(id));
  if (!fresh.length) return;
  const names = fresh.map(id => {
    const a = ACHIEVEMENTS.find(x => x.id === id);
    return `${a.mark} ${a.name}`;
  }).join("、");
  showToast(`<span class="toast-icon">OK</span><span>成就解鎖：<b>${names}</b></span>`);
}

/* ---------- events + init ---------- */
function initFilters() {
  $("#raritySelect").innerHTML = `<option value="全部">全部稀有度</option>` +
    Object.entries(RARITIES).map(([key, r]) => `<option value="${key}">${key} · ${r.name}</option>`).join("");
}

function init() {
  document.addEventListener("error", e => {
    const img = e.target;
    if (img.tagName === "IMG" && !img.classList.contains("broken")) img.classList.add("broken");
  }, true);

  initFilters();
  initUpload();
  renderHome();
  showView("home");

  $("#startExplore").addEventListener("click", () => {
    $("#mapSection").scrollIntoView({ behavior: "smooth", block: "start" });
  });

  $("#searchInput").addEventListener("input", e => {
    filters.q = e.target.value;
    renderCardList();
  });

  $("#raritySelect").addEventListener("change", e => {
    filters.rarity = e.target.value;
    renderCardList();
  });

  document.addEventListener("click", e => {
    if (e.target.closest("[data-close]")) { closeModal(); return; }
    if (e.target.id === "modal") { closeModal(); return; }

    const imgMode = e.target.closest("[data-img-mode]");
    if (imgMode) { setUploadMode(imgMode.dataset.imgMode); return; }

    const nav = e.target.closest("[data-nav]");
    if (nav) {
      const target = nav.dataset.nav;
      if (target === "home") showHome();
      else if (target === "collection") showCollection();
      else if (target === "upload") showUpload();
      else if (target === "map") {
        showHome();
        requestAnimationFrame(() => $("#mapSection").scrollIntoView({ behavior: "smooth", block: "start" }));
      }
      return;
    }

    const city = e.target.closest("[data-city]");
    if (city) { openCity(city.dataset.city); return; }

    const fav = e.target.closest("[data-fav]");
    if (fav) { e.stopPropagation(); toggleFav(fav.dataset.fav); return; }

    const card = e.target.closest("[data-id]");
    if (card) { openModal(card.dataset.id); return; }

    const chip = e.target.closest("[data-district]");
    if (chip) {
      filters.district = chip.dataset.district;
      renderDistricts();
      renderCardList();
      return;
    }

    const type = e.target.closest("[data-type]");
    if (type) {
      filters.type = type.dataset.type;
      $$("#typeFilter button").forEach(b => b.classList.toggle("active", b === type));
      renderCardList();
      return;
    }

    if (e.target.closest("[data-clear]")) { clearFilters(); return; }
  });

  document.addEventListener("keydown", e => {
    if (e.key === "Escape" && !$("#modal").hidden) { closeModal(); return; }

    if ((e.key === "Enter" || e.key === " ") && e.target.matches(".animal-card,.mini-card,.map-node")) {
      e.preventDefault();
      e.target.click();
      return;
    }

    if (e.key === "Tab" && !$("#modal").hidden) {
      const items = $$("#modalCard button, #modalCard [href], #modalCard [tabindex]:not([tabindex='-1'])")
        .filter(el => !el.disabled);
      if (!items.length) return;
      const first = items[0], last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

}

init();
