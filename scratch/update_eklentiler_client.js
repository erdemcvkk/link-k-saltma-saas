const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, '..', 'src', 'app', 'eklentiler', 'eklentiler-client.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// Normalize to LF first to avoid CRLF mismatch
const originalEndings = content.includes('\r\n') ? '\r\n' : '\n';
content = content.replace(/\r\n/g, '\n');

// 1. ADDON_TYPES update
// Find the PREMIUM_VIDEO block and add after it
const premiumVideoRegex = /\{\s*id\s*:\s*"PREMIUM_VIDEO"[\s\S]*?\}\s*\];/;
const premiumVideoMatch = content.match(premiumVideoRegex);
if (premiumVideoMatch) {
  const replacement = `{
  id: "PREMIUM_VIDEO",
  name: "Premium Video Vitrini",
  desc: "Eğitim veya Masterclass videolarınızı sinematik şekilde sunun.",
  color: "bg-red-500",
  theme: "premium-video",
  price: "0",
  username: "@masterclass",
  bio: "Video Eğitimi",
  avatarUrl: "",
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
  mockProducts: []
  }
];`;
  content = content.replace(premiumVideoRegex, replacement);
  console.log("ADDON_TYPES updated successfully");
} else {
  console.error("Could not find PREMIUM_VIDEO target");
}

// 2. visibleCount updates
content = content.replace(/useState\(\s*12\s*\)/, 'useState(16)');
content = content.replace(/setVisibleCount\(\s*12\s*\)/g, 'setVisibleCount(16)');

// 3. Header text
content = content.replace("10 Premium Eklenti Vitrini", "16 Premium Eklenti Vitrini");
content = content.replace("10 farklı premium tema arasından seçim yapın.", "16 farklı premium eklenti ve tema arasından seçim yapın.");

// 4. Mockup logic
const startStr = 'addon.id === "PREMIUM_VIDEO" ? (';
const endStr = 'storeCoverUrl={addon.coverUrl}';

const startIndexRaw = content.indexOf(startStr);
// We want to find the brace `{` just before `addon.id === "PREMIUM_VIDEO" ? (`
let startIndex = -1;
if (startIndexRaw !== -1) {
  for (let i = startIndexRaw; i >= 0; i--) {
    if (content[i] === '{') {
      startIndex = i;
      break;
    }
  }
}

// Find the first occurrence of endStr after startIndex
const searchFrom = startIndex === -1 ? 0 : startIndex;
let endIndex = content.indexOf(endStr, searchFrom);

// Find the closing of StorefrontPreview and the condition block after endStr
if (endIndex !== -1) {
  // Find the closing tag "/>" and closing parenthesis ")}"
  const closingTag = '/>';
  const closingTagIndex = content.indexOf(closingTag, endIndex);
  if (closingTagIndex !== -1) {
    const closingParenthesis = ')}';
    const closingParenthesisIndex = content.indexOf(closingParenthesis, closingTagIndex);
    if (closingParenthesisIndex !== -1) {
      endIndex = closingParenthesisIndex + closingParenthesis.length;
    }
  }
}

if (startIndex !== -1 && endIndex !== -1 && endIndex > startIndex) {
  const before = content.substring(0, startIndex);
  const after = content.substring(endIndex);
  
  const middleReplacement = `{addon.id === "PREMIUM_VIDEO" ? (
  <div className="w-full h-full bg-black flex flex-col p-4 relative z-0">
  {/* 16:9 Media Player Area */}
  <div className="w-full aspect-video rounded-2xl bg-zinc-900 mt-6 relative shadow-[0_0_40px_rgba(255,255,255,0.1)] overflow-hidden group">
  {/* Mock Cover Image */}
  <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80')] bg-cover bg-center opacity-80 group-hover:scale-105 transition-transform duration-700" />
  {/* Glassmorphism Play Button */}
  <div className="absolute inset-0 flex items-center justify-center">
  <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:bg-white/30 transition-all cursor-pointer">
  <span className="text-2xl ml-1">▶</span>
  </div>
  </div>
  </div>
  
  {/* Text Content */}
  <div className="flex flex-col mt-6 flex-1">
  <h1 className="text-xl font-bold text-white tracking-tight mb-2">UI/UX Masterclass Bölüm 1</h1>
  <p className="text-zinc-400 text-sm leading-relaxed mb-6">Tasarım sistemleri ve ileri düzey prototipleme tekniklerini keşfedin.</p>
  
  <div className="mt-auto pb-4">
  <button className="w-full py-4 rounded-xl bg-white text-black font-bold text-sm hover:bg-zinc-200 transition-colors pointer-events-none">
  Tamamını İzle
  </button>
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
  ) : (
  <StorefrontPreview 
  theme={addon.theme as any} 
  products={displayProducts} 
  storeTitle={addon.name}
  username={addon.username}
  bio={addon.bio}
  avatarUrl={addon.avatarUrl}
  storeCoverUrl={addon.coverUrl}
  />
  )}`;
  
  content = before + middleReplacement + after;
  console.log("Mockup logic updated successfully using index-based splice");
} else {
  console.error("Could not find mockup start or end index in clean content");
}

// Restore line endings
if (originalEndings === '\r\n') {
  content = content.replace(/\n/g, '\r\n');
}

fs.writeFileSync(filePath, content, 'utf8');
console.log("All updates completed successfully!");
