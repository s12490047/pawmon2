import { readFileSync, writeFileSync } from "node:fs";

const src = readFileSync(new URL("./field-guide.html", import.meta.url), "utf8");

const replace = (html, pairs) => {
  for (const [from, to] of pairs) {
    if (!html.includes(from)) throw new Error("missing: " + from.slice(0, 80));
    html = html.replace(from, to);
  }
  return html;
};

const city = replace(src, [
  ['data-theme="field-guide"', 'data-theme="city-chapters"'],
  ["<title>Pawmon 田野圖鑑 — 台灣浪浪探索圖鑑</title>", "<title>Pawmon 六都海報 — 台灣浪浪探索圖鑑</title>"],
  ['content="Pawmon 田野圖鑑：以自然史圖鑑的語氣，走訪台灣六都、翻開浪浪卡牌、收藏屬於你的毛孩子圖鑑。"', 'content="Pawmon 六都海報：把六座城市做成六個色彩章節，翻開浪浪卡牌，收藏屬於你的毛孩子圖鑑。"'],
  ["https://fonts.googleapis.com/css2?family=STIX+Two+Text:ital,wght@0,400;0,600;1,400&family=Noto+Sans+TC:wght@400;500;700&family=Noto+Serif+TC:wght@400;600;700&display=swap", "https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@400;500;600;700&family=Noto+Sans+TC:wght@400;500;700;900&display=swap"],
  ['href="field-guide.css"', 'href="city-chapters.css"'],
  ["<h1>每一隻浪浪，<br>都值得被看見。</h1>", "<h1>六都浪浪<br>等你翻牌</h1>"],
  ['<p class="hero-lead">走訪台灣六都，翻開一張張浪浪卡牌。收集牠們的故事、認識牠們的個性，也讓每一次點擊，都成為關注流浪動物的開始。</p>', '<p class="hero-lead">從臺北到高雄，六座城市、三十六位浪浪。選一座城市，翻開牠們的故事。</p>'],
  ["<li><b id=\"statAnimals\">36</b><span>浪浪角色</span></li>", "<li><b id=\"statAnimals\">36</b><span>浪浪</span></li>"],
  ["<li><b>6</b><span>直轄市</span></li>", "<li><b>6</b><span>城市</span></li>"],
  ["<li><b>5</b><span>種稀有度</span></li>", "<li><b>5</b><span>稀有度</span></li>"],
  ["<h2>選一座城市，開始尋寶</h2>", "<h2>六都，六個章節</h2>"],
  ["<p>點擊地圖上的六都區塊，進入屬於那座城市的浪浪圖鑑。</p>", "<p>點擊城市，翻開那一頁。</p>"],
  ["<h2>三十六個名字，六座城市</h2>", "<h2>一張地圖，六種顏色</h2>"],
  ["<p>這是一份虛構的浪浪名錄。每一張卡牌都記下一個名字、一個行政區，和一段值得被讀見的個性。</p>", "<p>從臺北到高雄，六座城市各自有自己的顏色。點擊地圖，翻開那個章節的浪浪卡牌。</p>"],
  ['src="https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=900&q=70" alt="一隻米白色狗狗望向鏡頭"', 'src="https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?auto=format&fit=crop&w=900&q=70" alt="一隻白貓坐在窗邊"'],
  ['<p class="map-hint">點擊城市區塊，展開探索</p>', '<p class="map-hint">點擊城市，翻開章節</p>'],
  ['<p>六都浪浪圖鑑</p>', '<p>一座城市，一個章節</p>'],
  ['風格版本：<a href="index.html">總覽</a> · <a href="city-chapters.html">六都海報</a> · <a href="card-binder.html">收藏冊</a>', '風格版本：<a href="index.html">總覽</a> · <a href="field-guide.html">田野圖鑑</a> · <a href="card-binder.html">收藏冊</a>']
]);
writeFileSync(new URL("./city-chapters.html", import.meta.url), city, "utf8");

const binder = replace(src, [
  ['data-theme="field-guide"', 'data-theme="card-binder"'],
  ["<title>Pawmon 田野圖鑑 — 台灣浪浪探索圖鑑</title>", "<title>Pawmon 收藏冊 — 台灣浪浪探索圖鑑</title>"],
  ['content="Pawmon 田野圖鑑：以自然史圖鑑的語氣，走訪台灣六都、翻開浪浪卡牌、收藏屬於你的毛孩子圖鑑。"', 'content="Pawmon 收藏冊：把六都浪浪收進一本卡牌收藏冊，翻開分頁、收藏卡牌，建立自己的毛孩子圖鑑。"'],
  ['<link href="https://fonts.googleapis.com/css2?family=STIX+Two+Text:ital,wght@0,400;0,600;1,400&family=Noto+Sans+TC:wght@400;500;700&family=Noto+Serif+TC:wght@400;600;700&display=swap" rel="stylesheet">', '<link href="https://api.fontshare.com/v2/css?f[]=general-sans@400,500,600&display=swap" rel="stylesheet">\n<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;500;700&family=Noto+Serif+TC:wght@400;600;700&display=swap" rel="stylesheet">'],
  ['href="field-guide.css"', 'href="card-binder.css"'],
  ["<h1>每一隻浪浪，<br>都值得被看見。</h1>", "<h1>一頁一浪浪，<br>翻開相遇。</h1>"],
  ['<p class="hero-lead">走訪台灣六都，翻開一張張浪浪卡牌。收集牠們的故事、認識牠們的個性，也讓每一次點擊，都成為關注流浪動物的開始。</p>', '<p class="hero-lead">把六都的浪浪收進同一本圖鑑。翻開卡牌、記下名字，讓每一次收藏都留下位置。</p>'],
  ["<li><b id=\"statAnimals\">36</b><span>浪浪角色</span></li>", "<li><b id=\"statAnimals\">36</b><span>張卡牌</span></li>"],
  ["<li><b>6</b><span>直轄市</span></li>", "<li><b>6</b><span>個分頁</span></li>"],
  ["<h2>選一座城市，開始尋寶</h2>", "<h2>翻到你的城市</h2>"],
  ["<p>點擊地圖上的六都區塊，進入屬於那座城市的浪浪圖鑑。</p>", "<p>點擊地圖上的分頁，展開該城市的卡牌。</p>"],
  ["<h2>三十六個名字，六座城市</h2>", "<h2>索引：六都</h2>"],
  ["<p>這是一份虛構的浪浪名錄。每一張卡牌都記下一個名字、一個行政區，和一段值得被讀見的個性。</p>", "<p>六個城市，六個分頁。翻開任何一頁，都是三十六個名字裡的其中一段。</p>"],
  ['src="https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=900&q=70" alt="一隻米白色狗狗望向鏡頭"', 'src="https://images.unsplash.com/photo-1568572933382-74d440642117?auto=format&fit=crop&w=900&q=70" alt="一隻深棕色狗狗坐在戶外"'],
  ['<p class="map-hint">點擊城市區塊，展開探索</p>', '<p class="map-hint">點擊分頁，翻開卡牌</p>'],
  ['<p>六都浪浪圖鑑</p>', '<p>收藏冊 · 城市分頁</p>'],
  ['風格版本：<a href="index.html">總覽</a> · <a href="city-chapters.html">六都海報</a> · <a href="card-binder.html">收藏冊</a>', '風格版本：<a href="index.html">總覽</a> · <a href="field-guide.html">田野圖鑑</a> · <a href="city-chapters.html">六都海報</a>']
]);
writeFileSync(new URL("./card-binder.html", import.meta.url), binder, "utf8");
