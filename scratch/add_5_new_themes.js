const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, '..', 'src', 'app', 'eklentiler', 'eklentiler-client.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// Normalize to LF
const originalEndings = content.includes('\r\n') ? '\r\n' : '\n';
content = content.replace(/\r\n/g, '\n');

// 1. Add the 5 new premium themes to ADDON_TYPES array
const newPremiumThemes = `  // ── 5 NEW PREMIUM THEMES ──
  {
  id: "WEB3_NFT",
  name: "Web3 & NFT Showcase",
  desc: "Kripto, NFT ve teknoloji projeleri için fütüristik ve karanlık sergi alanı.",
  color: "bg-[#8b5cf6]",
  theme: "dark-drill",
  price: "399",
  username: "@cryptopunk.eth",
  bio: "NFT Artist & Web3 Dev",
  avatarUrl: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=200&q=80",
  category: "Premium Temalar",
  mockProducts: [
  { id: "w1", title: "Genesis NFT Collectible", type: "NFT", price: "2500", imageUrl: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=500&q=80" },
  { id: "w2", title: "Solidity Smart Contract Template", type: "Kod", price: "800", imageUrl: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=500&q=80" }
  ]
  },
  {
  id: "EDITORIAL_LUX",
  name: "High-End Editorial",
  desc: "Moda, güzellik ve lüks markalar için dergi kapağı zarafetinde tasarım.",
  color: "bg-[#0f172a]",
  theme: "minimalist",
  price: "449",
  username: "@maison.luxury",
  bio: "High-End Fashion Label",
  avatarUrl: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=200&q=80",
  category: "Premium Temalar",
  mockProducts: [
  { id: "e1", title: "Summer Collection Catalog", type: "PDF", price: "300", imageUrl: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=500&q=80" },
  { id: "e2", title: "Private Styling Session", type: "Toplantı", price: "1500", imageUrl: "https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=500&q=80" }
  ]
  },
  {
  id: "GAMER_HUB",
  name: "Streamer & Gamer Hub",
  desc: "Twitch yayıncıları, e-sporcular ve oyuncular için dinamik, agresif arayüz.",
  color: "bg-green-500",
  theme: "vibrant-pop",
  price: "349",
  username: "@phoenix.gg",
  bio: "Twitch Partner & Pro Gamer",
  avatarUrl: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=200&q=80",
  category: "Premium Temalar",
  mockProducts: [
  { id: "g1", title: "Gamer Setup Presets", type: "Şablon", price: "150", imageUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=500&q=80" },
  { id: "g2", title: "1-on-1 Coaching Session", type: "Koçluk", price: "600", imageUrl: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=500&q=80" }
  ]
  },
  {
  id: "CORP_EXEC",
  name: "Corporate Executive",
  desc: "Ajanslar, danışmanlar ve C-Level yöneticiler için ultra profesyonel görünüm.",
  color: "bg-blue-600",
  theme: "classic",
  price: "499",
  username: "@ceo.exec",
  bio: "C-Level Executive Consultant",
  avatarUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&q=80",
  category: "Premium Temalar",
  mockProducts: [
  { id: "ce1", title: "Q3 Business Strategy Plan", type: "Şablon", price: "1200", imageUrl: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=500&q=80" },
  { id: "ce2", title: "Corporate Restructuring Guide", type: "E-Kitap", price: "400", imageUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=500&q=80" }
  ]
  },
  {
  id: "COMIC_MANGA",
  name: "Comic / Manga Panel",
  desc: "Çizerler ve sanatçılar için kalın çizgili, çizgi roman sayfası estetiği.",
  color: "bg-[#000000]",
  theme: "neo-brutalism",
  price: "299",
  username: "@manga.artisan",
  bio: "Comic Artist & Illustrator",
  avatarUrl: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=200&q=80",
  category: "Premium Temalar",
  mockProducts: [
  { id: "cm1", title: "Digital Ink Brushes Pack", type: "Fırça", price: "200", imageUrl: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=500&q=80" },
  { id: "cm2", title: "Chapter 1 Manga Panels (RAW)", type: "Comic", price: "150", imageUrl: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=500&q=80" }
  ]
  }`;

const addonTypesEndStr = '  }\n];';
const addonTypesEndIdx = content.indexOf(addonTypesEndStr);
const interfaceStartStr = 'interface EklentilerClientProps {';
const interfaceStartIdx = content.indexOf(interfaceStartStr);

if (addonTypesEndIdx !== -1 && interfaceStartIdx !== -1 && addonTypesEndIdx < interfaceStartIdx) {
  content = content.substring(0, addonTypesEndIdx + 3) + ',\n' + newPremiumThemes + '\n];' + content.substring(addonTypesEndIdx + 6);
  console.log("ADDON_TYPES array appended successfully");
} else {
  console.error("Could not find insertion index for new premium themes in ADDON_TYPES");
}

// 2. Update visibleCount states and limits from 21 to 26
content = content.replace('const [visibleCount, setVisibleCount] = useState(21);', 'const [visibleCount, setVisibleCount] = useState(26);');
content = content.replace(/setVisibleCount\(21\)/g, 'setVisibleCount(26)');
console.log("visibleCount values updated to 26");

// 3. Update header and subheader text to 26
content = content.replace('21 Premium Eklenti Vitrini', '26 Premium Eklenti Vitrini');
content = content.replace('21 farklı premium eklenti ve tema arasından seçim yapın.', '26 farklı premium eklenti ve tema arasından seçim yapın.');
console.log("Header and description texts updated to 26");

// 4. Update the mockup conditional rendering block
const testimonialsMockupRegex = /\)\s*:\s*addon\.id\s*===\s*"TESTIMONIALS"\s*\?\s*\([\s\S]*?\)\s*:\s*\(/;

const newMockupsRender = `) : addon.id === "TESTIMONIALS" ? (
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
  ) : addon.id === "WEB3_NFT" ? (
    <div className="w-full h-full bg-[#0B0A10] flex flex-col p-6 text-white relative z-0 shadow-[inset_0_0_50px_rgba(139,92,246,0.2)]">
      <div className="flex flex-col items-center mt-6 mb-4">
        <div className="w-20 h-20 bg-zinc-900 rounded-none overflow-hidden border border-purple-500/30">
          <img src={addon.avatarUrl} className="w-full h-full object-cover" />
        </div>
        <span className="text-xs font-bold mt-2 text-purple-400 tracking-wider font-mono">{addon.username}</span>
        <p className="text-[9px] text-zinc-500 font-mono mt-0.5">{addon.bio}</p>
      </div>
      
      <div className="bg-[#161424]/80 backdrop-blur-md rounded-none p-4 mt-2 border border-purple-500/50 space-y-3">
        <div className="flex justify-between items-center">
          <div>
            <h4 className="text-[10px] font-bold text-cyan-400 font-mono tracking-widest uppercase">Web3 Project alpha</h4>
            <p className="text-[8px] text-purple-300 font-mono">Floor: 1.45 ETH</p>
          </div>
          <div className="w-8 h-8 rounded-none bg-purple-600 flex items-center justify-center text-white cursor-pointer font-bold text-xs">
            ▲
          </div>
        </div>
      </div>
    </div>
  ) : addon.id === "EDITORIAL_LUX" ? (
    <div className="w-full h-full bg-[#FDFBF7] flex flex-col p-6 text-slate-900 relative z-0">
      <div className="flex flex-col items-center mt-8 mb-4">
        <div className="w-20 h-28 bg-zinc-200 rounded-t-full rounded-b-md overflow-hidden border border-slate-200">
          <img src={addon.avatarUrl} className="w-full h-full object-cover" />
        </div>
        <span className="text-sm font-serif italic mt-3 tracking-wide">{addon.username}</span>
        <p className="text-[8px] tracking-[0.2em] text-slate-500 uppercase mt-1">{addon.bio}</p>
      </div>
      
      <div className="border border-slate-900 p-4 mt-auto space-y-2 text-center bg-transparent">
        <h4 className="text-xs font-serif tracking-wide text-slate-800">L'Édition Estivale</h4>
        <button className="w-full py-2 bg-transparent border border-slate-900 text-slate-900 font-serif text-[10px] tracking-widest uppercase hover:bg-slate-900 hover:text-white transition-colors cursor-pointer">
          Découvrir
        </button>
      </div>
    </div>
  ) : addon.id === "GAMER_HUB" ? (
    <div className="w-full h-full bg-zinc-900 flex flex-col p-6 text-white relative z-0">
      <div className="flex flex-col items-center mt-6 mb-4">
        <div className="w-20 h-20 bg-zinc-800 rounded-xl border-4 border-green-500 overflow-hidden shadow-[0_0_15px_rgba(34,197,94,0.3)]">
          <img src={addon.avatarUrl} className="w-full h-full object-cover" />
        </div>
        <span className="text-xs font-black mt-2 text-green-400 tracking-wider uppercase">{addon.username}</span>
        <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-tight mt-0.5">{addon.bio}</p>
      </div>
      
      <div className="bg-zinc-950 border-2 border-zinc-800 p-4 mt-2 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-ping"></span>
            <span className="text-[10px] font-black text-white uppercase tracking-wider">Live Now</span>
          </div>
          <span className="text-[9px] font-bold text-green-400">12,420 Viewers</span>
        </div>
        <button className="w-full py-2 bg-green-500 hover:bg-green-600 text-black font-black uppercase text-[10px] tracking-wider transition-colors border-0 cursor-pointer">
          Watch Stream
        </button>
      </div>
    </div>
  ) : addon.id === "CORP_EXEC" ? (
    <div className="w-full h-full bg-slate-50 flex flex-col relative z-0 text-slate-800 overflow-hidden">
      <div className="bg-slate-900 h-28 w-full flex flex-col justify-end p-4 relative">
        <div className="absolute top-2 right-2 px-2 py-0.5 bg-blue-600 text-[8px] font-bold text-white rounded">PRO</div>
      </div>
      
      <div className="flex flex-col items-center -mt-10 px-6 mb-4 relative z-10">
        <div className="w-20 h-20 bg-white rounded-full border-4 border-white overflow-hidden shadow-md">
          <img src={addon.avatarUrl} className="w-full h-full object-cover" />
        </div>
        <span className="text-xs font-extrabold mt-2 text-slate-800">{addon.username}</span>
        <p className="text-[9px] text-slate-500 font-medium tracking-tight mt-0.5">{addon.bio}</p>
      </div>
      
      <div className="bg-white shadow-md rounded-xl p-4 mx-6 mt-1 border border-slate-100 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-[10px] font-bold text-slate-800">Q3 Executive Briefing</h4>
            <p className="text-[8px] text-slate-400">Corporate & Strategy</p>
          </div>
        </div>
        <button className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-[10px] rounded-lg tracking-wide transition-colors border-0 cursor-pointer">
          Schedule Consultation
        </button>
      </div>
    </div>
  ) : addon.id === "COMIC_MANGA" ? (
    <div className="w-full h-full bg-white flex flex-col p-6 text-black relative z-0">
      <div className="flex flex-col items-center mt-6 mb-4">
        <div className="w-20 h-20 bg-white rounded-none border-4 border-black overflow-hidden shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
          <img src={addon.avatarUrl} className="w-full h-full object-cover" />
        </div>
        <span className="text-xs font-extrabold mt-3 tracking-wide uppercase border-2 border-black px-2 py-0.5 bg-yellow-300 shadow-[2px_2px_0_0_rgba(0,0,0,1)]">{addon.username}</span>
        <p className="text-[9px] font-semibold text-zinc-650 mt-2">{addon.bio}</p>
      </div>
      
      <div className="bg-white border-2 border-black p-4 mt-2 space-y-3 shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
        <div>
          <h4 className="text-xs font-black uppercase tracking-tight">Episode 4: Inked!</h4>
          <p className="text-[8px] text-zinc-700">Digital Comic Panels</p>
        </div>
        <button className="w-full py-2 bg-white border-2 border-black text-black font-black uppercase text-[10px] tracking-wide shadow-[2px_2px_0_0_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[0px_0px_0_0_rgba(0,0,0,1)] transition-all cursor-pointer">
          Read Chapter
        </button>
      </div>
    </div>
  ) : (`;

if (content.match(testimonialsMockupRegex)) {
  content = content.replace(testimonialsMockupRegex, newMockupsRender);
  console.log("Mockups successfully replaced with 5 new themes");
} else {
  console.error("Could not find testimonialsMockupRegex target");
}

// Restore line endings
if (originalEndings === '\r\n') {
  content = content.replace(/\n/g, '\r\n');
}

fs.writeFileSync(filePath, content, 'utf8');
console.log("All updates for 5 premium themes completed successfully!");
