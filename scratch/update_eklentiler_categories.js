const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, '..', 'src', 'app', 'eklentiler', 'eklentiler-client.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// Normalize to LF
const originalEndings = content.includes('\r\n') ? '\r\n' : '\n';
content = content.replace(/\r\n/g, '\n');

// 1. Update AddonTypeData interface
const addonTypeDataRegex = /interface AddonTypeData\s*\{[\s\S]*?avatarUrl:\s*string;[\s\S]*?\}/;
if (content.match(addonTypeDataRegex)) {
  content = content.replace(
    addonTypeDataRegex,
    `interface AddonTypeData {
 id: string;
 name: string;
 desc: string;
 color: string;
 theme: StoreThemeType;
 mockProducts: DummyProduct[];
 price: string;
 username: string;
 bio: string;
 avatarUrl: string;
 coverUrl?: string;
 category: string;
}`
  );
  console.log("AddonTypeData interface updated successfully");
} else {
  console.error("Could not find AddonTypeData interface");
}

// 2. Define the new ADDON_TYPES array with categories and 5 new audio addons
const newAddonTypesContent = `export const ADDON_TYPES: AddonTypeData[] = [
  { 
  id: "MINI_STORE", 
  name: "Dijital Mağaza Modülü", 
  desc: "Ürünlerinizi doğrudan profilinizde satın.", 
  color: "bg-orange-500",
  theme: "vibrant-pop",
  price: "349",
  username: "@creative.zeynep",
  bio: "İçerik Üreticisi & YouTuber",
  avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80",
  category: "Satış & Gelir",
  mockProducts: [
  { id: "p1", title: "Video Düzenleme Masterclass'ı", type: "Kurs", price: "750", imageUrl: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=500&q=80" },
  { id: "p2", title: "Sosyal Medya İçerik Takvimi", type: "Şablon", price: "200", imageUrl: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=500&q=80" },
  ]
  },
  { 
  id: "BOOKING", 
  name: "Randevu & Danışmanlık", 
  desc: "1-1 Görüşmeler ve toplantılar ayarlayın.", 
  color: "bg-zinc-800",
  theme: "minimalist",
  price: "249",
  username: "@coach.mehmet",
  bio: "Yazar & Kariyer Danışmanı",
  avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80",
  category: "Etkileşim & Araçlar",
  mockProducts: [
  { id: "b1", title: "1 Saatlik UI/UX Danışmanlığı", type: "Toplantı", price: "850", imageUrl: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=500&q=80" },
  { id: "b2", title: "Hızlı Kod İncelemesi", type: "Toplantı", price: "400", imageUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=500&q=80" },
  ]
  },
  { 
  id: "NEWSLETTER", 
  name: "Bülten & Abonelik", 
  desc: "Takipçilerinizden e-posta toplayın.", 
  color: "bg-purple-500",
  theme: "glassmorphism",
  price: "199",
  username: "@artisan.studio",
  bio: "Dijital Sanatçı & Fotoğrafçı",
  avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&q=80",
  coverUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1000&q=80",
  category: "Etkileşim & Araçlar",
  mockProducts: [
  { id: "n1", title: "Haftalık Tasarım Bülteni", type: "Abonelik", price: "0", imageUrl: "https://images.unsplash.com/photo-1554046920-90dcac024a13?w=500&q=80" },
  ]
  },
  { 
  id: "QA", 
  name: "Soru & Cevap (AMA)", 
  desc: "Ücretli veya ücretsiz sorular alın.", 
  color: "bg-red-500",
  theme: "dark-drill",
  price: "149",
  username: "@darkbeat_prod",
  bio: "Müzik Prodüktörü & Tasarımcı",
  avatarUrl: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=200&q=80",
  category: "Etkileşim & Araçlar",
  mockProducts: [
  { id: "q1", title: "Öncelikli Soru Sor", type: "Soru", price: "50", imageUrl: "https://images.unsplash.com/photo-1516259762381-22954d7d3ad2?w=500&q=80" },
  ]
  },
  { 
  id: "DONATION", 
  name: "Bağış & Destek", 
  desc: "Takipçilerinizden destek alın (Kahve Ismarla).", 
  color: "bg-blue-500",
  theme: "classic",
  price: "99",
  username: "@pixelcraft.design",
  bio: "Premium Dijital Ürün Mağazası",
  avatarUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&q=80",
  coverUrl: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1000&q=80",
  category: "Satış & Gelir",
  mockProducts: [
  { id: "d1", title: "Bana Bir Kahve Ismarla", type: "Destek", price: "50", imageUrl: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500&q=80" },
  { id: "d2", title: "Büyük Destek", type: "Destek", price: "250", imageUrl: "https://images.unsplash.com/photo-1556740749-887f6717d7e4?w=500&q=80" },
  ]
  },
  {
  id: "NEO_BRUTAL",
  name: "Neo-Brutalism Vitrini",
  desc: "Geliştiriciler ve sokak modası için sert tasarım.",
  color: "bg-[#caff4a]",
  theme: "neo-brutalism",
  price: "299",
  username: "@dev.manifest",
  bio: "Full-Stack Geliştirici & Tasarımcı",
  avatarUrl: "https://images.unsplash.com/photo-1599566150163-29194dcabd9c?w=200&q=80",
  category: "Premium Temalar",
  mockProducts: [
  { id: "nb1", title: "Terminal VS Code Eklentisi", type: "Eklenti", price: "120", imageUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=500&q=80" },
  { id: "nb2", title: "Brutalist React Kit", type: "Kod", price: "500", imageUrl: "https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=500&q=80" },
  ]
  },
  {
  id: "ORGANIC",
  name: "Organic Earth Vitrini",
  desc: "Sağlık koçları ve el yapımı ürünler için.",
  color: "bg-[#8fbc6a]",
  theme: "organic-earth",
  price: "249",
  username: "@naturel.coach",
  bio: "Holistik Sağlık & Beslenme Koçu",
  avatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80",
  category: "Premium Temalar",
  mockProducts: [
  { id: "oe1", title: "Holistik Beslenme Rehberi", type: "E-Kitap", price: "180", imageUrl: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=500&q=80" },
  { id: "oe2", title: "30 Günlük Detoks Programı", type: "Program", price: "450", imageUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&q=80" },
  ]
  },
  {
  id: "RETRO",
  name: "Retro 8-Bit Arcade Vitrini",
  desc: "Indie geliştiriciler ve çizerler için.",
  color: "bg-[#00ffc8]",
  theme: "retro-arcade",
  price: "199",
  username: "@PIXEL_DEV",
  bio: "Indie Oyun Geliştiricisi",
  avatarUrl: "https://images.unsplash.com/photo-1566753323558-f4e0952af115?w=200&q=80",
  category: "Premium Temalar",
  mockProducts: [
  { id: "ra1", title: "16-Bit Sprite Paketi", type: "Asset", price: "250", imageUrl: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=500&q=80" },
  { id: "ra2", title: "Chiptune Müzik Paketi", type: "Müzik", price: "200", imageUrl: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=500&q=80" },
  ]
  },
  {
  id: "ACADEMIA",
  name: "Dark Academia Vitrini",
  desc: "Yazarlar ve tarih/sanat üreticileri için.",
  color: "bg-[#b4963c]",
  theme: "dark-academia",
  price: "199",
  username: "@the.quill",
  bio: "Yazar & Şair",
  avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80",
  category: "Premium Temalar",
  mockProducts: [
  { id: "da1", title: "Gotik Şiir Derlemesi (PDF)", type: "E-Kitap", price: "150", imageUrl: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=500&q=80" },
  { id: "da2", title: "Daktilo Yazı Fontu", type: "Font", price: "200", imageUrl: "https://images.unsplash.com/photo-1504691342899-4d92b50853e1?w=500&q=80" },
  ]
  },
  {
  id: "Y2K",
  name: "Y2K Holographic Vitrini",
  desc: "Moda influencer'ları ve pop sanatçıları için.",
  color: "bg-gradient-to-r from-[#ff6ec7] to-[#7873f5]",
  theme: "y2k-holographic",
  price: "299",
  username: "@glitter.queen",
  bio: "Moda & Lifestyle Influencer",
  avatarUrl: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=200&q=80",
  category: "Premium Temalar",
  mockProducts: [
  { id: "y1", title: "2000'ler Nostalji Filtreleri", type: "Filtre", price: "200", imageUrl: "https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=500&q=80" },
  { id: "y2", title: "Holografik Sticker Paketi", type: "Tasarım", price: "120", imageUrl: "https://images.unsplash.com/photo-1550684376-efcbd6e3f031?w=500&q=80" },
  ]
  },
  {
  id: "PREMIUM_CREATOR",
  name: "Premium Creator Vitrini",
  desc: "Dijital ürünlerinizi en zarif ve lüks şekilde sunun.",
  color: "bg-zinc-900",
  theme: "premium-creator",
  price: "899",
  username: "@kreator",
  bio: "Premium Beatmaker & Eğitmen",
  avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80",
  category: "Premium Temalar",
  mockProducts: [
  { id: "pc1", title: "Mastering Eğitimi (Video)", type: "Eğitim", price: "450", imageUrl: "https://images.unsplash.com/photo-1516280440503-66f837ce5b97?w=500&q=80" },
  { id: "pc2", title: "Özel Lo-Fi Beat Paketi", type: "Beat", price: "300", imageUrl: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=500&q=80" },
  ]
  },
  {
  id: "PREMIUM_VIDEO",
  name: "Premium Video Vitrini",
  desc: "Eğitim veya Masterclass videolarınızı sinematik şekilde sunun.",
  color: "bg-red-500",
  theme: "premium-video",
  price: "0",
  username: "@masterclass",
  bio: "Video Eğitimi",
  avatarUrl: "",
  category: "Satış & Gelir",
  mockProducts: []
  },
  {
  id: "MUSIC_PODCAST",
  name: "Müzik & Podcast Çalar",
  desc: "Beat'lerinizi ve podcast'lerinizi doğrudan sayfanızda dinletin.",
  color: "bg-purple-600",
  theme: "classic",
  price: "199",
  username: "@podcast.wave",
  bio: "Beatmaker & Podcaster",
  avatarUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=200&q=80",
  category: "Müzik & Audio",
  mockProducts: []
  },
  {
  id: "PORTFOLIO_GALLERY",
  name: "Portfolyo & Galeri",
  desc: "Tasarımlarınızı ve fotoğraflarınızı şık bir ızgara (grid) yapısında sergileyin.",
  color: "bg-slate-400",
  theme: "classic",
  price: "249",
  username: "@art.portfolio",
  bio: "Visual Artist & Designer",
  avatarUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&q=80",
  category: "Premium Temalar",
  mockProducts: []
  },
  {
  id: "COUNTDOWN_LAUNCH",
  name: "Geri Sayım & Lansman",
  desc: "Yeni ürün veya içerikleriniz için heyecan yaratacak dinamik sayaç.",
  color: "bg-orange-500",
  theme: "classic",
  price: "149",
  username: "@launch.timer",
  bio: "Product Launcher & Innovator",
  avatarUrl: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=200&q=80",
  category: "Premium Temalar",
  mockProducts: []
  },
  {
  id: "TESTIMONIALS",
  name: "Müşteri Yorumları",
  desc: "Referanslarınızı ve 5 yıldızlı değerlendirmelerinizi öne çıkararak güven inşa edin.",
  color: "bg-teal-500",
  theme: "classic",
  price: "199",
  username: "@trust.reviews",
  bio: "E-Commerce Business Consultant",
  avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&q=80",
  category: "Etkileşim & Araçlar",
  mockProducts: []
  },
  // ── 5 NEW MUSIC & AUDIO PLUGINS ──
  {
  id: "SPOTIFY_CLASSIC",
  name: "Classic Spotify Player",
  desc: "Orijinal ve ikonik Spotify görünümü.",
  color: "bg-[#1db954]",
  theme: "classic",
  price: "199",
  username: "@spotify.classic",
  bio: "Original Spotify Look",
  avatarUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=200&q=80",
  category: "Müzik & Audio",
  mockProducts: []
  },
  {
  id: "VINYL_RETRO",
  name: "Retro Plak Çalar (Vinyl)",
  desc: "Nostaljik ruhu yaşatan, plak görünümlü oynatıcı.",
  color: "bg-amber-700",
  theme: "classic",
  price: "249",
  username: "@vinyl.collector",
  bio: "Vintage Plak Sever",
  avatarUrl: "https://images.unsplash.com/photo-1539625318667-15c0b90c6b1b?w=200&q=80",
  category: "Müzik & Audio",
  mockProducts: []
  },
  {
  id: "GLASS_AUDIO",
  name: "Modern Cam Efekti (Glassmorphism)",
  desc: "Albüm renklerine uyum sağlayan yarı saydam tasarım.",
  color: "bg-indigo-400",
  theme: "classic",
  price: "199",
  username: "@glass.synth",
  bio: "Ambient & Synthwave Producer",
  avatarUrl: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=200&q=80",
  category: "Müzik & Audio",
  mockProducts: []
  },
  {
  id: "NEON_CYBERPUNK",
  name: "Neon Cyberpunk Player",
  desc: "Elektronik müzik ve synthwave tutkunları için.",
  color: "bg-pink-500",
  theme: "classic",
  price: "149",
  username: "@cyberpunk.wave",
  bio: "Synthwave & Cyberpunk Creator",
  avatarUrl: "https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?w=200&q=80",
  category: "Müzik & Audio",
  mockProducts: []
  },
  {
  id: "MINIMAL_LIGHT_AUDIO",
  name: "Minimalist Light Player",
  desc: "Ferah, aydınlık ve dikkat dağıtmayan net tasarım.",
  color: "bg-slate-350",
  theme: "classic",
  price: "149",
  username: "@clean.acoustic",
  bio: "Acoustic & Folk Sessions",
  avatarUrl: "https://images.unsplash.com/photo-1516280440503-66f837ce5b97?w=200&q=80",
  category: "Müzik & Audio",
  mockProducts: []
  }
];`;

const startIdx = content.indexOf('export const ADDON_TYPES: AddonTypeData[]');
const endIdx = content.indexOf('interface EklentilerClientProps {');
if (startIdx !== -1 && endIdx !== -1) {
  content = content.substring(0, startIdx) + newAddonTypesContent + '\n\n' + content.substring(endIdx);
  console.log("ADDON_TYPES replaced successfully");
} else {
  console.error("Could not replace ADDON_TYPES");
}

// 3. Update useState count to 21
content = content.replace('const [visibleCount, setVisibleCount] = useState(16);', 'const [visibleCount, setVisibleCount] = useState(21);');
content = content.replace(/setVisibleCount\(16\)/g, 'setVisibleCount(21)');
console.log("visibleCount state initialization and setVisibleCount calls updated");

// 4. Add selectedCategory state in EklentilerClient component
const stateHookTargetRegex = /const\s*\[visibleCount,\s*setVisibleCount\]\s*=\s*useState\(21\);\s*const\s*\[searchQuery,\s*setSearchQuery\]\s*=\s*useState\(""\);\s*const\s*\[sortOption,\s*setSortOption\]\s*=\s*useState\("default"\);/;
const stateHookReplacement = `const [visibleCount, setVisibleCount] = useState(21);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("default");
  const [selectedCategory, setSelectedCategory] = useState("Tümü");`;

if (content.match(stateHookTargetRegex)) {
  content = content.replace(stateHookTargetRegex, stateHookReplacement);
  console.log("selectedCategory state added successfully");
} else {
  console.error("Could not find stateHookTargetRegex");
}

// 5. Update header texts for 21
content = content.replace('16 Premium Eklenti Vitrini', '21 Premium Eklenti Vitrini');
content = content.replace('16 farklı premium eklenti ve tema arasından seçim yapın.', '21 farklı premium eklenti ve tema arasından seçim yapın.');

// 6. Insert Category Pills UI
const searchBarRegex = /(\{\/\* Search \+ Sort bar \*\/\}[\s\S]*?className="flex flex-col sm:flex-row gap-3 items-center"[\s\S]*?\<\/div\>\s*\<\/div\>)/;
const searchBarMatch = content.match(searchBarRegex);
if (searchBarMatch) {
  const pillsCode = `
  {/* Category Pills */}
  <div className="flex flex-wrap gap-2 justify-center pt-2 border-t border-zinc-800/60 mt-1">
    {["Tümü", "Müzik & Audio", "Satış & Gelir", "Etkileşim & Araçlar", "Premium Temalar"].map((cat) => (
      <button
        key={cat}
        type="button"
        onClick={() => {
          setSelectedCategory(cat);
          setVisibleCount(21);
        }}
        className={\`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer \${
          selectedCategory === cat
            ? "bg-gradient-to-r from-neon-blue to-light-blue text-white shadow-md shadow-neon-blue/10"
            : "bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-900"
        }\`}
      >
        {cat}
      </button>
    ))}
  </div>`;
  content = content.replace(searchBarMatch[1], searchBarMatch[1] + pillsCode);
  console.log("Category pills UI injected successfully");
} else {
  console.error("Could not inject Category pills UI");
}

// 7. Update filtering logic for category
const countFilterRegex = /const filtered = ADDON_TYPES\.filter\(a => \{[\s\S]*?return name\.includes[\s\S]*?\}\);/;
const countFilterReplacement = `const filtered = ADDON_TYPES.filter(a => {
  const name = (settings?.[ \`theme_NAME_\${a.id}\` ] || a.name).toLowerCase();
  const desc = (settings?.[ \`theme_DESC_\${a.id}\` ] || a.desc).toLowerCase();
  const matchesSearch = name.includes(searchQuery.toLowerCase()) || desc.includes(searchQuery.toLowerCase());
  const matchesCategory = selectedCategory === "Tümü" || a.category === selectedCategory;
  return matchesSearch && matchesCategory;
  });`;

if (content.match(countFilterRegex)) {
  content = content.replace(countFilterRegex, countFilterReplacement);
  console.log("Count filtering updated successfully");
} else {
  console.error("Could not find countFilterRegex");
}

const mainFilterRegex = /\.filter\(\(addon\) => \{[\s\S]*?return name\.includes[\s\S]*?\}\)/;
const mainFilterReplacement = `.filter((addon) => {
  const name = (settings?.[ \`theme_NAME_\${addon.id}\` ] || addon.name).toLowerCase();
  const desc = (settings?.[ \`theme_DESC_\${addon.id}\` ] || addon.desc).toLowerCase();
  const matchesSearch = name.includes(searchQuery.toLowerCase()) || desc.includes(searchQuery.toLowerCase());
  const matchesCategory = selectedCategory === "Tümü" || addon.category === selectedCategory;
  return matchesSearch && matchesCategory;
  })`;

if (content.match(mainFilterRegex)) {
  content = content.replace(mainFilterRegex, mainFilterReplacement);
  console.log("Main rendering filtering updated successfully");
} else {
  console.error("Could not find mainFilterRegex");
}

// 8. Inject 5 new Spotify / Audio mockups into mockup block
// We match the whole sequence of conditional rendering from MUSIC_PODCAST to the end of TESTIMONIALS conditional
const mockupBlockRegex = /\)\s*:\s*addon\.id\s*===\s*"MUSIC_PODCAST"\s*\?\s*\([\s\S]*?\)\s*:\s*\(/;

const newMockupsContent = `) : addon.id === "SPOTIFY_CLASSIC" ? (
  <div className="w-full h-full bg-zinc-950 flex flex-col p-6 text-white relative z-0">
    <div className="flex flex-col items-center mt-6 mb-4">
      <div className="w-20 h-20 bg-zinc-800 rounded-md overflow-hidden border border-zinc-800 shadow-lg">
        <img src={addon.avatarUrl} className="w-full h-full object-cover" />
      </div>
      <span className="text-xs font-bold mt-2 text-white">{addon.username}</span>
      <p className="text-[10px] text-green-500 font-bold mt-0.5">{addon.bio}</p>
    </div>
    
    <div className="bg-zinc-900 rounded-2xl p-4 mt-2 border border-zinc-800 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-xs font-bold text-white">Classic Track</h4>
          <p className="text-[9px] text-zinc-400">Artists & Friends</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-green-500 text-sm cursor-pointer">⏮</span>
          <button className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-black border-0 shadow-[0_0_12px_rgba(34,197,94,0.4)] cursor-pointer">
            <span className="text-xs ml-0.5">▶</span>
          </button>
          <span className="text-green-500 text-sm cursor-pointer">⏭</span>
        </div>
      </div>
      
      {/* Progress Bar */}
      <div className="space-y-1">
        <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden">
          <div className="w-1/3 h-full bg-green-500 rounded-full"></div>
        </div>
        <div className="flex justify-between text-[8px] text-zinc-500 font-mono">
          <span>1:12</span>
          <span>3:45</span>
        </div>
      </div>
    </div>
  </div>
  ) : addon.id === "VINYL_RETRO" ? (
  <div className="w-full h-full bg-stone-900 flex flex-col p-6 text-orange-400 relative z-0">
    <div className="flex flex-col items-center mt-6 mb-2">
      <span className="text-xs font-bold text-stone-200">{addon.username}</span>
      <p className="text-[9px] text-orange-400/70 mt-0.5">{addon.bio}</p>
    </div>
    
    {/* Vinyl Record */}
    <div className="flex justify-center my-2">
      <div className="w-24 h-24 rounded-full bg-zinc-950 border-4 border-black flex items-center justify-center relative shadow-2xl animate-[spin_6s_linear_infinite]">
        {/* Record Grooves */}
        <div className="absolute inset-2 rounded-full border border-stone-850"></div>
        <div className="absolute inset-4 rounded-full border border-stone-850"></div>
        {/* Record Label */}
        <div className="w-8 h-8 rounded-full bg-orange-400 flex items-center justify-center p-0.5">
          <div className="w-2 h-2 rounded-full bg-stone-900"></div>
        </div>
      </div>
    </div>
    
    <div className="bg-stone-950/80 rounded-2xl p-3 border border-stone-800 text-center space-y-2 mt-auto">
      <h4 className="text-[10px] font-bold text-stone-300">Retro Vinyl Selection</h4>
      <div className="flex items-center justify-center gap-4 text-orange-400">
        <span className="text-xs cursor-pointer">⏮</span>
        <button className="w-8 h-8 rounded-full bg-orange-400 flex items-center justify-center text-stone-900 border-0 cursor-pointer">
          <span className="text-[10px] ml-0.5">▶</span>
        </button>
        <span className="text-xs cursor-pointer">⏭</span>
      </div>
    </div>
  </div>
  ) : addon.id === "GLASS_AUDIO" ? (
  <div className="w-full h-full bg-gradient-to-br from-indigo-400 to-purple-400 flex flex-col p-6 text-white relative z-0">
    <div className="flex flex-col items-center mt-6 mb-4">
      <div className="w-16 h-16 bg-white/20 rounded-full overflow-hidden border border-white/20 shadow-lg">
        <img src={addon.avatarUrl} className="w-full h-full object-cover" />
      </div>
      <span className="text-xs font-bold mt-2 text-white">{addon.username}</span>
    </div>
    
    {/* Glassmorphism Player Card */}
    <div className="bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl p-4 mt-2 space-y-3 shadow-xl">
      <div className="text-center">
        <h4 className="text-xs font-extrabold text-white">Glass Ambient Track</h4>
        <p className="text-[9px] text-purple-100/80">Lofi & Chillwave</p>
      </div>
      <div className="flex items-center justify-center gap-4 text-white">
        <span className="text-xs cursor-pointer">⏮</span>
        <button className="w-9 h-9 rounded-full bg-white text-purple-600 flex items-center justify-center border-0 shadow-lg cursor-pointer">
          <span className="text-xs ml-0.5">▶</span>
        </button>
        <span className="text-xs cursor-pointer">⏭</span>
      </div>
    </div>
  </div>
  ) : addon.id === "NEON_CYBERPUNK" ? (
  <div className="w-full h-full bg-black flex flex-col p-6 text-white relative z-0">
    <div className="flex flex-col items-center mt-6 mb-4">
      <div className="w-20 h-20 bg-zinc-900 rounded-none overflow-hidden border border-pink-500 shadow-[0_0_10px_rgba(236,72,153,0.5)]">
        <img src={addon.avatarUrl} className="w-full h-full object-cover" />
      </div>
      <span className="text-xs font-black mt-2 uppercase tracking-widest text-pink-500">{addon.username}</span>
    </div>
    
    {/* Neon Cyberpunk Player Card */}
    <div className="bg-black border border-pink-500 shadow-[0_0_15px_rgba(236,72,153,0.6)] rounded-none p-4 mt-2 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-[10px] font-black uppercase tracking-widest text-cyan-400">Cyber City Beats</h4>
          <p className="text-[8px] text-pink-400 uppercase">Synthwave mix</p>
        </div>
        <button className="w-9 h-9 rounded-none bg-pink-500 flex items-center justify-center text-black border-0 shadow-[0_0_10px_rgba(236,72,153,0.8)] cursor-pointer">
          <span className="text-xs">▶</span>
        </button>
      </div>
      
      {/* Cyan/Pink neon accent lines */}
      <div className="w-full h-0.5 bg-zinc-900 relative">
        <div className="absolute left-0 top-0 w-2/3 h-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]"></div>
      </div>
    </div>
  </div>
  ) : addon.id === "MINIMAL_LIGHT_AUDIO" ? (
  <div className="w-full h-full bg-slate-50 flex flex-col p-6 text-slate-800 relative z-0">
    <div className="flex flex-col items-center mt-6 mb-4">
      <div className="w-20 h-20 bg-white rounded-xl overflow-hidden border border-slate-200 shadow-sm">
        <img src={addon.avatarUrl} className="w-full h-full object-cover" />
      </div>
      <span className="text-xs font-bold mt-2 text-slate-800">{addon.username}</span>
      <p className="text-[9px] text-slate-500 mt-0.5">{addon.bio}</p>
    </div>
    
    {/* Minimalist Light Card */}
    <div className="bg-white shadow-sm border border-slate-150 rounded-xl p-4 mt-2 space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-xs font-semibold text-slate-800">Clean Acoustic Session</h4>
          <p className="text-[9px] text-slate-500">Live Recording</p>
        </div>
        <button className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center border-0 shadow-sm cursor-pointer">
          <span className="text-xs ml-0.5">▶</span>
        </button>
      </div>
      
      {/* Light Progress Bar */}
      <div className="w-full h-0.5 bg-slate-100 rounded-full overflow-hidden">
        <div className="w-1/2 h-full bg-slate-400 rounded-full"></div>
      </div>
    </div>
  </div>
  ) : addon.id === "MUSIC_PODCAST" ? (
  <div className="w-full h-full bg-gradient-to-br from-purple-900 to-indigo-950 flex flex-col p-6 text-white relative z-0">
    <div className="flex flex-col items-center mt-6 mb-4">
      <div className="w-20 h-20 bg-zinc-800 rounded-t-full rounded-b-xl overflow-hidden border border-purple-500/30">
        <img src={addon.avatarUrl} className="w-full h-full object-cover" />
      </div>
      <span className="text-xs font-bold mt-2 text-purple-300">{addon.username}</span>
      <p className="text-[10px] text-purple-200/60 mt-0.5">{addon.bio}</p>
    </div>
    
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 mt-2 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-xs font-bold text-white">Summer Beats 2026</h4>
          <p className="text-[10px] text-purple-300">Podcast & Instrumental</p>
        </div>
        <button className="w-10 h-10 rounded-full bg-pink-500 flex items-center justify-center text-white border-0 shadow-[0_0_15px_rgba(236,72,153,0.5)]">
          <span className="text-xs ml-0.5">▶</span>
        </button>
      </div>
      
      <div className="flex items-end gap-1 justify-center h-8 pt-2">
        <div className="w-1 bg-pink-500 h-3 rounded-full animate-pulse"></div>
        <div className="w-1 bg-pink-500 h-6 rounded-full animate-pulse" style={{ animationDelay: '0.1s' }}></div>
        <div className="w-1 bg-pink-500 h-4 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
        <div className="w-1 bg-pink-500 h-8 rounded-full animate-pulse" style={{ animationDelay: '0.3s' }}></div>
        <div className="w-1 bg-pink-500 h-5 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
        <div className="w-1 bg-pink-500 h-7 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
        <div className="w-1 bg-pink-500 h-3 rounded-full animate-pulse" style={{ animationDelay: '0.6s' }}></div>
      </div>
    </div>
  </div>
  ) : addon.id === "PORTFOLIO_GALLERY" ? (
  <div className="w-full h-full bg-slate-50 flex flex-col p-6 text-slate-800 relative z-0">
    <div className="flex flex-col items-center mt-6 mb-4">
      <div className="w-20 h-20 bg-zinc-200 rounded-none overflow-hidden border border-slate-300">
        <img src={addon.avatarUrl} className="w-full h-full object-cover" />
      </div>
      <span className="text-xs font-bold mt-2 text-slate-600">{addon.username}</span>
      <p className="text-[10px] text-slate-400 mt-0.5">{addon.bio}</p>
    </div>
    
    <div className="grid grid-cols-2 gap-2 mt-2">
      <div className="aspect-square bg-white/60 backdrop-blur-md border border-slate-200/50 rounded-xl p-1 overflow-hidden shadow-sm">
        <img src="https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=200&q=80" className="w-full h-full object-cover rounded-lg" />
      </div>
      <div className="aspect-square bg-white/60 backdrop-blur-md border border-slate-200/50 rounded-xl p-1 overflow-hidden shadow-sm">
        <img src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&q=80" className="w-full h-full object-cover rounded-lg" />
      </div>
      <div className="aspect-square bg-white/60 backdrop-blur-md border border-slate-200/50 rounded-xl p-1 overflow-hidden shadow-sm">
        <img src="https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=200&q=80" className="w-full h-full object-cover rounded-lg" />
      </div>
      <div className="aspect-square bg-white/60 backdrop-blur-md border border-slate-200/50 rounded-xl p-1 overflow-hidden shadow-sm">
        <img src="https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=200&q=80" className="w-full h-full object-cover rounded-lg" />
      </div>
    </div>
  </div>
  ) : addon.id === "COUNTDOWN_LAUNCH" ? (
  <div className="w-full h-full bg-orange-500 flex flex-col p-6 text-black relative z-0">
    <div className="flex flex-col items-center mt-6 mb-4">
      <div className="w-20 h-20 bg-zinc-950 rounded-tl-3xl rounded-br-3xl overflow-hidden border border-black/20">
        <img src={addon.avatarUrl} className="w-full h-full object-cover" />
      </div>
      <span className="text-xs font-black mt-2 uppercase tracking-wide">{addon.username}</span>
      <p className="text-[10px] text-zinc-900/70 font-semibold mt-0.5">{addon.bio}</p>
    </div>
    
    <div className="bg-black text-white rounded-3xl p-4 mt-2 border border-black/10 text-center space-y-3 shadow-lg">
      <h4 className="text-[10px] font-black uppercase tracking-widest text-orange-500">Lansmana Kalan Süre</h4>
      <div className="flex items-center justify-center gap-2">
        <div className="bg-zinc-900 px-2 py-1.5 rounded-lg border border-zinc-800">
          <span className="text-sm font-black font-mono text-white">03</span>
        </div>
        <span className="text-zinc-650 font-bold">:</span>
        <div className="bg-zinc-900 px-2 py-1.5 rounded-lg border border-zinc-800">
          <span className="text-sm font-black font-mono text-white">14</span>
        </div>
        <span className="text-zinc-650 font-bold">:</span>
        <div className="bg-zinc-900 px-2 py-1.5 rounded-lg border border-zinc-800">
          <span className="text-sm font-black font-mono text-white">59</span>
        </div>
      </div>
    </div>
  </div>
  ) : addon.id === "TESTIMONIALS" ? (
  <div className="w-full h-full bg-teal-50 flex flex-col p-6 text-zinc-800 relative z-0">
    <div className="flex flex-col items-center mt-6 mb-4">
      <div className="w-20 h-20 bg-zinc-200 rounded-2xl overflow-hidden border border-teal-200">
        <img src={addon.avatarUrl} className="w-full h-full object-cover" />
      </div>
      <span className="text-xs font-bold mt-2 text-teal-800">{addon.username}</span>
      <p className="text-[10px] text-teal-650 mt-0.5">{addon.bio}</p>
    </div>
    
    <div className="bg-white rounded-2xl p-4 mt-2 border border-zinc-100 shadow-sm space-y-2">
      <div className="flex gap-0.5 text-yellow-400">
        <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
      </div>
      <p className="text-[10px] text-zinc-600 italic leading-relaxed">
        "Harika bir ürün, kesinlikle tavsiye ediyorum! Hayatımı çok kolaylaştırdı."
      </p>
      <div className="flex items-center gap-1.5">
        <div className="w-5 h-5 rounded-full bg-zinc-300 overflow-hidden">
          <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80" className="w-full h-full object-cover" />
        </div>
        <span className="text-[9px] font-bold text-zinc-700">Elif Y.</span>
      </div>
    </div>
  </div>
  ) : (`;

if (content.match(mockupBlockRegex)) {
  content = content.replace(mockupBlockRegex, newMockupsContent);
  console.log("Mockups successfully replaced");
} else {
  console.error("Could not find mockupBlockRegex target");
}

// Restore line endings
if (originalEndings === '\r\n') {
  content = content.replace(/\n/g, '\r\n');
}

fs.writeFileSync(filePath, content, 'utf8');
console.log("All updates completed successfully!");
