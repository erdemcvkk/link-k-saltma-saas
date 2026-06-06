const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');

// Helper function to define the shared renderAddonInnerContent code block
const renderAddonInnerContentFnCode = `
function renderAddonInnerContent(type: string, avatarUrl: string, username: string, bio: string, title: string, desc: string) {
  switch (type) {
    case "SPOTIFY_CLASSIC":
      return (
        <div className="w-full h-full bg-zinc-950 flex flex-col p-8 text-white relative z-0">
          <div className="flex flex-col items-center mt-12 mb-8">
            <div className="w-24 h-24 bg-zinc-850 rounded-xl overflow-hidden border border-zinc-800 shadow-xl">
              <img src={avatarUrl || "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=200&q=80"} className="w-full h-full object-cover" />
            </div>
            <span className="text-sm font-bold mt-3 text-white">{username}</span>
            <p className="text-xs text-green-500 font-bold mt-1">{bio}</p>
          </div>
          
          <div className="bg-zinc-900 rounded-2xl p-5 border border-zinc-800 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-white">{title}</h4>
                <p className="text-[10px] text-zinc-400">{desc}</p>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-green-500 text-lg cursor-pointer">⏮</span>
                <button className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center text-black border-0 shadow-[0_0_15px_rgba(34,197,94,0.4)] cursor-pointer">
                  <span className="text-sm ml-0.5">▶</span>
                </button>
                <span className="text-green-500 text-lg cursor-pointer">⏭</span>
              </div>
            </div>
            
            <div className="space-y-1">
              <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden">
                <div className="w-1/3 h-full bg-green-500 rounded-full"></div>
              </div>
              <div className="flex justify-between text-[9px] text-zinc-500 font-mono">
                <span>1:12</span>
                <span>3:45</span>
              </div>
            </div>
          </div>
        </div>
      );
    case "VINYL_RETRO":
      return (
        <div className="w-full h-full bg-stone-900 flex flex-col p-8 text-orange-400 relative z-0">
          <div className="flex flex-col items-center mt-12 mb-6">
            <span className="text-sm font-bold text-stone-200">{username}</span>
            <p className="text-xs text-orange-400/70 mt-1">{bio}</p>
          </div>
          
          <div className="flex justify-center my-6">
            <div className="w-32 h-32 rounded-full bg-zinc-950 border-4 border-black flex items-center justify-center relative shadow-2xl animate-[spin_6s_linear_infinite]">
              <div className="absolute inset-2 rounded-full border border-stone-850"></div>
              <div className="absolute inset-5 rounded-full border border-stone-850"></div>
              <div className="w-12 h-12 rounded-full bg-orange-400 flex items-center justify-center p-0.5">
                <div className="w-3 h-3 rounded-full bg-stone-900"></div>
              </div>
            </div>
          </div>
          
          <div className="bg-stone-950/85 rounded-2xl p-5 border border-stone-800 text-center space-y-4 mt-auto">
            <h4 className="text-xs font-bold text-stone-300">{title}</h4>
            <p className="text-[10px] text-stone-500">{desc}</p>
            <div className="flex items-center justify-center gap-6 text-orange-400">
              <span className="text-sm cursor-pointer">⏮</span>
              <button className="w-10 h-10 rounded-full bg-orange-400 flex items-center justify-center text-stone-900 border-0 cursor-pointer">
                <span className="text-xs ml-0.5">▶</span>
              </button>
              <span className="text-sm cursor-pointer">⏭</span>
            </div>
          </div>
        </div>
      );
    case "GLASS_AUDIO":
      return (
        <div className="w-full h-full bg-gradient-to-br from-indigo-400 to-purple-400 flex flex-col p-8 text-white relative z-0">
          <div className="flex flex-col items-center mt-12 mb-8">
            <div className="w-20 h-20 bg-white/20 rounded-full overflow-hidden border border-white/20 shadow-lg">
              <img src={avatarUrl || "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=200&q=80"} className="w-full h-full object-cover" />
            </div>
            <span className="text-sm font-bold mt-3 text-white">{username}</span>
          </div>
          
          <div className="bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl p-5 mt-4 space-y-4 shadow-xl">
            <div className="text-center">
              <h4 className="text-sm font-extrabold text-white">{title}</h4>
              <p className="text-[10px] text-purple-100/80 mt-1">{desc}</p>
            </div>
            <div className="flex items-center justify-center gap-6 text-white pt-2">
              <span className="text-sm cursor-pointer">⏮</span>
              <button className="w-11 h-11 rounded-full bg-white text-purple-600 flex items-center justify-center border-0 shadow-lg cursor-pointer">
                <span className="text-sm ml-0.5">▶</span>
              </button>
              <span className="text-sm cursor-pointer">⏭</span>
            </div>
          </div>
        </div>
      );
    case "NEON_CYBERPUNK":
      return (
        <div className="w-full h-full bg-black flex flex-col p-8 text-white relative z-0">
          <div className="flex flex-col items-center mt-12 mb-8">
            <div className="w-24 h-24 bg-zinc-900 rounded-none overflow-hidden border border-pink-500 shadow-[0_0_12px_rgba(236,72,153,0.5)]">
              <img src={avatarUrl || "https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?w=200&q=80"} className="w-full h-full object-cover" />
            </div>
            <span className="text-xs font-black mt-3 uppercase tracking-widest text-pink-500">{username}</span>
          </div>
          
          <div className="bg-black border border-pink-500 shadow-[0_0_20px_rgba(236,72,153,0.6)] rounded-none p-5 mt-4 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-black uppercase tracking-widest text-cyan-400">{title}</h4>
                <p className="text-[9px] text-pink-400 uppercase mt-1">{desc}</p>
              </div>
              <button className="w-10 h-10 rounded-none bg-pink-500 flex items-center justify-center text-black border-0 shadow-[0_0_12px_rgba(236,72,153,0.8)] cursor-pointer">
                <span className="text-xs">▶</span>
              </button>
            </div>
            <div className="w-full h-0.5 bg-zinc-900 relative">
              <div className="absolute left-0 top-0 w-2/3 h-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]"></div>
            </div>
          </div>
        </div>
      );
    case "MINIMAL_LIGHT_AUDIO":
      return (
        <div className="w-full h-full bg-slate-50 flex flex-col p-8 text-slate-800 relative z-0">
          <div className="flex flex-col items-center mt-12 mb-8">
            <div className="w-24 h-24 bg-white rounded-xl overflow-hidden border border-slate-200 shadow-sm">
              <img src={avatarUrl || "https://images.unsplash.com/photo-1516280440503-66f837ce5b97?w=200&q=80"} className="w-full h-full object-cover" />
            </div>
            <span className="text-sm font-bold mt-3 text-slate-800">{username}</span>
            <p className="text-xs text-slate-500 mt-1">{bio}</p>
          </div>
          
          <div className="bg-white shadow-sm border border-slate-150 rounded-xl p-5 mt-4 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-semibold text-slate-800">{title}</h4>
                <p className="text-[10px] text-slate-500 mt-1">{desc}</p>
              </div>
              <button className="w-10 h-10 rounded-full bg-slate-800 text-white flex items-center justify-center border-0 shadow-sm cursor-pointer">
                <span className="text-sm ml-0.5">▶</span>
              </button>
            </div>
            <div className="w-full h-0.5 bg-slate-100 rounded-full overflow-hidden">
              <div className="w-1/2 h-full bg-slate-400 rounded-full"></div>
            </div>
          </div>
        </div>
      );
    case "MUSIC_PODCAST":
      return (
        <div className="w-full h-full bg-gradient-to-br from-purple-900 to-indigo-950 flex flex-col p-8 text-white relative z-0">
          <div className="flex flex-col items-center mt-12 mb-8">
            <div className="w-24 h-24 bg-zinc-800 rounded-t-full rounded-b-xl overflow-hidden border border-purple-500/30">
              <img src={avatarUrl || "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=200&q=80"} className="w-full h-full object-cover" />
            </div>
            <span className="text-sm font-bold mt-3 text-purple-300">{username}</span>
            <p className="text-xs text-purple-200/60 mt-1">{bio}</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/10 mt-4 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-white">{title}</h4>
                <p className="text-xs text-purple-300 mt-1">{desc}</p>
              </div>
              <button className="w-12 h-12 rounded-full bg-pink-500 flex items-center justify-center text-white border-0 shadow-[0_0_15px_rgba(236,72,153,0.5)] cursor-pointer">
                <span className="text-sm ml-0.5">▶</span>
              </button>
            </div>
            
            <div className="flex items-end gap-1.5 justify-center h-10 pt-2">
              <div className="w-1.5 bg-pink-500 h-4 rounded-full animate-pulse"></div>
              <div className="w-1.5 bg-pink-500 h-8 rounded-full animate-pulse" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-1.5 bg-pink-500 h-5 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-1.5 bg-pink-500 h-10 rounded-full animate-pulse" style={{ animationDelay: '0.3s' }}></div>
              <div className="w-1.5 bg-pink-500 h-7 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
              <div className="w-1.5 bg-pink-500 h-9 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
              <div className="w-1.5 bg-pink-500 h-4 rounded-full animate-pulse" style={{ animationDelay: '0.6s' }}></div>
            </div>
          </div>
        </div>
      );
    case "PORTFOLIO_GALLERY":
      return (
        <div className="w-full h-full bg-slate-50 flex flex-col p-8 text-slate-800 relative z-0">
          <div className="flex flex-col items-center mt-12 mb-8">
            <div className="w-24 h-24 bg-zinc-200 rounded-none border border-slate-300 overflow-hidden">
              <img src={avatarUrl || "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&q=80"} className="w-full h-full object-cover" />
            </div>
            <span className="text-sm font-bold mt-3 text-slate-700">{username}</span>
            <p className="text-xs text-slate-500 mt-1">{bio}</p>
          </div>
          
          <h3 className="text-sm font-bold text-slate-800 mb-3 px-1">{title}</h3>
          <p className="text-xs text-slate-500 mb-4 px-1">{desc}</p>
          
          <div className="grid grid-cols-2 gap-3 mt-2">
            <div className="aspect-square bg-white/60 backdrop-blur-md border border-slate-200/50 rounded-xl p-1.5 overflow-hidden shadow-sm">
              <img src="https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=200&q=80" className="w-full h-full object-cover rounded-lg" />
            </div>
            <div className="aspect-square bg-white/60 backdrop-blur-md border border-slate-200/50 rounded-xl p-1.5 overflow-hidden shadow-sm">
              <img src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&q=80" className="w-full h-full object-cover rounded-lg" />
            </div>
            <div className="aspect-square bg-white/60 backdrop-blur-md border border-slate-200/50 rounded-xl p-1.5 overflow-hidden shadow-sm">
              <img src="https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=200&q=80" className="w-full h-full object-cover rounded-lg" />
            </div>
            <div className="aspect-square bg-white/60 backdrop-blur-md border border-slate-200/50 rounded-xl p-1.5 overflow-hidden shadow-sm">
              <img src="https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=200&q=80" className="w-full h-full object-cover rounded-lg" />
            </div>
          </div>
        </div>
      );
    case "COUNTDOWN_LAUNCH":
      return (
        <div className="w-full h-full bg-orange-500 flex flex-col p-8 text-black relative z-0">
          <div className="flex flex-col items-center mt-12 mb-8">
            <div className="w-24 h-24 bg-zinc-950 rounded-tl-3xl rounded-br-3xl overflow-hidden border border-black/20">
              <img src={avatarUrl || "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=200&q=80"} className="w-full h-full object-cover" />
            </div>
            <span className="text-sm font-black mt-3 uppercase tracking-wide">{username}</span>
            <p className="text-xs text-zinc-900/75 font-semibold mt-1">{bio}</p>
          </div>
          
          <div className="bg-black text-white rounded-3xl p-5 mt-4 border border-black/10 text-center space-y-4 shadow-lg">
            <h4 className="text-xs font-black uppercase tracking-widest text-orange-500">{title}</h4>
            <p className="text-[10px] text-zinc-400">{desc}</p>
            <div className="flex items-center justify-center gap-3">
              <div className="bg-zinc-900 px-3 py-2 rounded-xl border border-zinc-800">
                <span className="text-base font-black font-mono text-white">03</span>
              </div>
              <span className="text-zinc-600 font-bold">:</span>
              <div className="bg-zinc-900 px-3 py-2 rounded-xl border border-zinc-800">
                <span className="text-base font-black font-mono text-white">14</span>
              </div>
              <span className="text-zinc-600 font-bold">:</span>
              <div className="bg-zinc-900 px-3 py-2 rounded-xl border border-zinc-800">
                <span className="text-base font-black font-mono text-white">59</span>
              </div>
            </div>
          </div>
        </div>
      );
    case "TESTIMONIALS":
      return (
        <div className="w-full h-full bg-teal-50 flex flex-col p-8 text-zinc-800 relative z-0">
          <div className="flex flex-col items-center mt-12 mb-8">
            <div className="w-24 h-24 bg-zinc-200 rounded-2xl overflow-hidden border border-teal-200">
              <img src={avatarUrl || "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&q=80"} className="w-full h-full object-cover" />
            </div>
            <span className="text-sm font-bold mt-3 text-teal-800">{username}</span>
            <p className="text-xs text-teal-650 mt-1">{bio}</p>
          </div>
          
          <div className="bg-white rounded-2xl p-5 mt-4 border border-zinc-100 shadow-sm space-y-3">
            <div className="flex gap-0.5 text-yellow-400 text-sm">
              <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
            </div>
            <h4 className="text-xs font-bold text-slate-800">{title}</h4>
            <p className="text-[11px] text-zinc-650 italic leading-relaxed">
              "\${desc}"
            </p>
            <div className="flex items-center gap-2 pt-1 border-t border-zinc-100">
              <div className="w-6 h-6 rounded-full bg-zinc-300 overflow-hidden">
                <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80" className="w-full h-full object-cover" />
              </div>
              <span className="text-[10px] font-bold text-zinc-700">Elif Y.</span>
            </div>
          </div>
        </div>
      );
    default:
      return null;
  }
}
`;

// ─── 1. PATCH src/app/[username]/[addonSlug]/page.tsx ───
const pageFilePath = path.join(rootDir, 'src', 'app', '[username]', '[addonSlug]', 'page.tsx');
let pageContent = fs.readFileSync(pageFilePath, 'utf8');
pageContent = pageContent.replace(/\r\n/g, '\n');

// Import Lucide icons
pageContent = pageContent.replace(
  'import StorefrontPreview from "@/components/storefront-preview";',
  'import StorefrontPreview from "@/components/storefront-preview";\nimport { Store, Music, Image, Clock, MessageCircle } from "lucide-react";'
);

// Update getDefaultTheme in page.tsx
const pageThemeRegex = /const getDefaultTheme = \((type|t): string\) => \{[\s\S]*?default: return "classic";[\s\S]*?\};/;
const pageThemeReplacement = `const getDefaultTheme = (type: string) => {
  switch (type) {
  case "NEO_BRUTAL": return "neo-brutalism";
  case "ORGANIC": return "organic-earth";
  case "RETRO": return "retro-arcade";
  case "ACADEMIA": return "dark-academia";
  case "Y2K": return "y2k-holographic";
  case "PREMIUM_CREATOR": return "premium-creator";
  case "WEB3_NFT": return "dark-drill";
  case "EDITORIAL_LUX": return "minimalist";
  case "GAMER_HUB": return "vibrant-pop";
  case "CORP_EXEC": return "classic";
  case "COMIC_MANGA": return "neo-brutalism";
  default: return "classic";
  }
  };`;

pageContent = pageContent.replace(pageThemeRegex, pageThemeReplacement);

// Update matching addon type checking for Storefront themes in page.tsx
const pageStoreCheckRegex = /if \(matchingAddon\.addonType === "MINI_STORE" \|\|[\s\S]*?matchingAddon\.addonType === "PREMIUM_CREATOR"\) \{/;
const pageStoreCheckReplacement = `if (matchingAddon.addonType === "MINI_STORE" || 
   matchingAddon.addonType === "NEO_BRUTAL" || 
   matchingAddon.addonType === "ORGANIC" || 
   matchingAddon.addonType === "RETRO" || 
   matchingAddon.addonType === "ACADEMIA" || 
   matchingAddon.addonType === "Y2K" ||
   matchingAddon.addonType === "PREMIUM_CREATOR" ||
   matchingAddon.addonType === "WEB3_NFT" ||
   matchingAddon.addonType === "EDITORIAL_LUX" ||
   matchingAddon.addonType === "GAMER_HUB" ||
   matchingAddon.addonType === "CORP_EXEC" ||
   matchingAddon.addonType === "COMIC_MANGA") {`;

pageContent = pageContent.replace(pageStoreCheckRegex, pageStoreCheckReplacement);

// Add custom render condition in page.tsx before final fallback
const pageFallbackRegex = /\/\/ Fallback for other addon types\s*return \([\s\S]*?<h1>Addon: \{matchingAddon\.addonType\}<\/h1>[\s\S]*?\);\s*\}/;
const pageFallbackReplacement = `// Custom layout check for new Audio / Testimonial / Portfolio / Countdown addons
  if (matchingAddon.addonType === "SPOTIFY_CLASSIC" || 
      matchingAddon.addonType === "VINYL_RETRO" || 
      matchingAddon.addonType === "GLASS_AUDIO" || 
      matchingAddon.addonType === "NEON_CYBERPUNK" || 
      matchingAddon.addonType === "MINIMAL_LIGHT_AUDIO" || 
      matchingAddon.addonType === "MUSIC_PODCAST" || 
      matchingAddon.addonType === "PORTFOLIO_GALLERY" || 
      matchingAddon.addonType === "COUNTDOWN_LAUNCH" || 
      matchingAddon.addonType === "TESTIMONIALS") {
      
      const type = matchingAddon.addonType;
      const displayAvatar = parsedConfig.avatarUrl || user.profile.avatarUrl || "";
      const displayUsername = parsedConfig.username || ("@" + user.username);
      const displayBio = parsedConfig.bio || user.profile.bio || "";
      const displayTitle = parsedConfig.title || (type === "SPOTIFY_CLASSIC" ? "Classic Spotify Player" : type === "VINYL_RETRO" ? "Retro Plak Çalar" : type === "GLASS_AUDIO" ? "Modern Cam Efekti" : type === "NEON_CYBERPUNK" ? "Neon Cyberpunk Player" : type === "MINIMAL_LIGHT_AUDIO" ? "Minimalist Light Player" : type === "MUSIC_PODCAST" ? "Müzik & Podcast Çalar" : type === "PORTFOLIO_GALLERY" ? "Portfolyo & Galeri" : type === "COUNTDOWN_LAUNCH" ? "Geri Sayım & Lansman" : "Müşteri Yorumları");
      const displayDesc = parsedConfig.description || (type === "SPOTIFY_CLASSIC" ? "Orijinal ve ikonik Spotify görünümü." : type === "VINYL_RETRO" ? "Nostaljik ruhu yaşatan, plak görünümlü oynatıcı." : type === "GLASS_AUDIO" ? "Albüm renklerine uyum sağlayan yarı saydam tasarım." : type === "NEON_CYBERPUNK" ? "Elektronik müzik ve synthwave tutkunları için." : type === "MINIMAL_LIGHT_AUDIO" ? "Ferah, aydınlık ve dikkat dağıtmayan net tasarım." : type === "MUSIC_PODCAST" ? "Beat'lerinizi ve podcast'lerinizi doğrudan sayfanızda dinletin." : type === "PORTFOLIO_GALLERY" ? "Tasarımlarınızı ve fotoğraflarınızı şık bir ızgara (grid) yapısında sergileyin." : type === "COUNTDOWN_LAUNCH" ? "Yeni ürün veya içerikleriniz için heyecan yaratacak dinamik sayaç." : "Referanslarınızı ve 5 yıldızlı değerlendirmelerinizi öne çıkararak güven inşa edin.");

      return (
        <div className="w-full min-h-screen bg-black flex justify-center">
          <div className="w-full max-w-full md:w-[480px] min-h-screen relative shadow-2xl overflow-hidden bg-zinc-950 flex flex-col justify-between">
            <div className="flex-1 w-full overflow-y-auto no-scrollbar">
              {renderAddonInnerContent(type, displayAvatar, displayUsername, displayBio, displayTitle, displayDesc)}
            </div>
            
            {/* Direct Buy Section */}
            <div className="w-full bg-zinc-900 p-6 border-t border-zinc-800 text-center flex flex-col gap-3">
              <a href={\`/@\${user.username}\`} className="w-full py-4 rounded-2xl bg-gradient-to-r from-neon-blue to-light-blue text-white text-sm font-extrabold tracking-wide shadow-lg shadow-neon-blue/15 hover:opacity-95 transition-all text-center block">
                Biyo Link Sayfama Git
              </a>
            </div>
          </div>
        </div>
      );
  }

  // Fallback for other addon types
  return (
    <div className="flex items-center justify-center min-h-screen">
      <h1>Addon: {matchingAddon.addonType}</h1>
    </div>
  );
}`;

pageContent = pageContent.replace(pageFallbackRegex, pageFallbackReplacement);
pageContent += '\n' + renderAddonInnerContentFnCode;

fs.writeFileSync(pageFilePath, pageContent, 'utf8');
console.log("src/app/[username]/[addonSlug]/page.tsx updated");

// ─── 2. PATCH src/components/universal-profile.tsx ───
const profileFilePath = path.join(rootDir, 'src', 'components', 'universal-profile.tsx');
let profileContent = fs.readFileSync(profileFilePath, 'utf8');
profileContent = profileContent.replace(/\r\n/g, '\n');

// Update getSlug and switch-cases in universal-profile.tsx
const profileSwitchRegex = /const getSlug = \([\s\S]*?case "MINI_STORE":\n\s*case "NEO_BRUTAL":\n\s*case "ORGANIC":\n\s*case "RETRO":\n\s*case "ACADEMIA":\n\s*case "Y2K":\n\s*case "PREMIUM_CREATOR":\n\s*return \([\s\S]*?default:\n\s*return null;\n\s*\}\n\}/;

const profileSwitchReplacement = `const getSlug = (t: string, config: any) => {
    if (config.customSlug) return config.customSlug;
    if (t === "MINI_STORE") return "store";
    if (t === "NEO_BRUTAL") return "neo-brutal";
    if (t === "ORGANIC") return "organic";
    if (t === "RETRO") return "retro";
    if (t === "ACADEMIA") return "academia";
    if (t === "Y2K") return "y2k";
    if (t === "BOOKING") return "booking";
    if (t === "NEWSLETTER") return "newsletter";
    if (t === "QA") return "qa";
    if (t === "DONATION") return "donation";
    if (t === "PREMIUM_CREATOR") return "creator-store";
    if (t === "PREMIUM_VIDEO") return "masterclass";
    return t.toLowerCase();
  };

  const CardWrapper = ({ children, slug }: { children: React.ReactNode, slug: string }) => {
    const href = \`/@\${username}/\${slug.toLowerCase()}\`;
    if (isCompactMode) {
      return <div className={cardClassName}>{children}</div>;
    }
    return (
      <a href={href} className={cardClassName + " transition-transform hover:scale-[1.01] block cursor-pointer"}>
        {children}
      </a>
    );
  };

  switch (type) {
    case "BOOKING":
      return (
        <CardWrapper key={addon.id} slug={getSlug(type, configData)}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0">
              <Calendar className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-800">{configData.title || (isDark ? "Book a 1:1 Call" : "Birebir Görüşme Ayarla")}</h4>
              <p className="text-xs opacity-70 mt-0.5">{configData.description || "Sizinle tanışmak için sabırsızlanıyorum."}</p>
            </div>
          </div>
          <div className={btnClassName}>
            {configData.buttonText || "Takvimi Görüntüle"}
          </div>
        </CardWrapper>
      );
    case "QA":
      {
        const qaPairs = configData.qaPairs || [];
        return (
          <div key={addon.id} className={cardClassName}>
            <div className="flex items-center justify-between border-b border-black/5 pb-2.5 mb-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center shrink-0">
                  <FileQuestion className="h-5 w-5 text-amber-500" />
                </div>
                <h4 className="text-sm font-bold text-slate-800">{configData.boxTitle || "Soru & Cevap (AMA)"}</h4>
              </div>
              {!isCompactMode && (
                <a href={\`/@\${username}/\${getSlug(type, configData)}\`} className="text-slate-400 hover:text-slate-600 transition-colors" title="Detaylar">
                  <ArrowUpRight className="h-4 w-4" />
                </a>
              )}
            </div>
            {qaPairs.length > 0 ? (
              <div className="space-y-2.5 w-full">
                {qaPairs.map((p: any, idx: number) => (
                  <details key={idx} className="group border border-slate-100 rounded-xl bg-black/5 p-3 [&_summary::-webkit-details-marker]:hidden">
                    <summary className="flex items-center justify-between cursor-pointer focus:outline-none">
                      <span className="text-xs font-bold text-slate-855 pr-4">{p.q || "Soru"}</span>
                      <span className="transition group-open:rotate-180 text-slate-400 shrink-0">
                        <svg fill="none" height="16" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="16" className="h-3 w-3"><path d="M6 9l6 6 6-6"></path></svg>
                      </span>
                    </summary>
                    <p className="text-xs text-slate-655 mt-2 pl-1 leading-relaxed border-t border-black/5 pt-2 whitespace-pre-wrap">{p.a || "Cevap..."}</p>
                  </details>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 text-center py-2">
                {isDark ? "No questions or answers yet." : "Henüz soru ve cevap bulunmuyor."}
              </p>
            )}
          </div>
        );
      }
    case "DONATION":
      return (
        <CardWrapper key={addon.id} slug={getSlug(type, configData)}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-pink-500/10 flex items-center justify-center shrink-0">
              <Heart className="h-5 w-5 text-pink-500" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-800">{configData.title || "Bana Kahve Ismarla"}</h4>
              <p className="text-xs opacity-70 mt-0.5">{configData.thankYouMsg || "Desteğiniz için teşekkürler!"}</p>
            </div>
          </div>
          <div className={btnClassName}>
            {configData.buttonText || "Destek Ol"}
          </div>
        </CardWrapper>
      );
    case "NEWSLETTER":
      return (
        <CardWrapper key={addon.id} slug={getSlug(type, configData)}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
              <Mail className="h-5 w-5 text-emerald-500" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-800">{configData.title || "Haftalık Bülten"}</h4>
              <p className="text-xs opacity-70 mt-0.5">{configData.incentiveMsg || "Spam yok, sadece kaliteli içerik."}</p>
            </div>
          </div>
          <div className="w-full bg-black/5 border border-black/10 rounded-lg p-2 h-10 flex items-center">
            <span className="text-xs opacity-45">email@example.com</span>
          </div>
          <div className={btnClassName}>
            {configData.buttonText || "Abone Ol"}
          </div>
        </CardWrapper>
      );
    case "PREMIUM_VIDEO":
      return (
        <CardWrapper key={addon.id} slug={getSlug(type, configData)}>
          <div className="w-full aspect-video rounded-xl bg-zinc-900 overflow-hidden relative border border-white/5">
            {configData.coverUrl ? (
              <img src={configData.coverUrl} alt="Cover" className="w-full h-full object-cover opacity-80" />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-zinc-650">
                <Play className="h-8 w-8" />
              </div>
            )}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/30">
                <span className="ml-1">▶</span>
              </div>
            </div>
          </div>
          <h4 className="text-sm font-bold text-slate-800">{configData.title || "Premium Video"}</h4>
          <p className="text-xs opacity-70">{configData.description || "Video açıklaması."}</p>
          <div className={btnClassName}>
            {configData.buttonText || "Tamamını İzle"}
          </div>
        </CardWrapper>
      );
    case "COUNTDOWN":
      return (
        <CardWrapper key={addon.id} slug={getSlug(type, configData)}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center shrink-0">
              <Clock className="h-5 w-5 text-purple-500" />
            </div>
            <h4 className="text-sm font-bold text-slate-800">{configData.title || "Geri Sayım"}</h4>
          </div>
          <p className="text-xs opacity-70">{configData.description}</p>
          <div className="grid grid-cols-4 gap-2 w-full">
            {['14', '08', '45', '22'].map((val, i) => (
              <div key={i} className="bg-black/10 rounded-lg py-2 flex flex-col items-center">
                <span className="text-sm font-bold font-mono">{val}</span>
                <span className="text-[8px] opacity-60">{['Gün', 'Saat', 'Dk', 'Sn'][i]}</span>
              </div>
            ))}
          </div>
          {configData.buttonText && (
            <div className={btnClassName}>
              {configData.buttonText}
            </div>
          )}
        </CardWrapper>
      );
    case "FAQ":
      {
        const qas = (configData.questionsText || "Soru Örneği?|Cevap Örneği.;")
          .split(';')
          .map((pair: string) => pair.split('|'))
          .filter((pair: string[]) => pair.length === 2 && pair[0].trim() !== "");
        return (
          <CardWrapper key={addon.id} slug={getSlug(type, configData)}>
            <h4 className="text-sm font-bold text-slate-800">{configData.title || "FAQ"}</h4>
            <div className="space-y-2 w-full">
              {qas.map(([q, a]: [string, string], i: number) => (
                <div key={i} className="bg-black/5 p-2 rounded-lg">
                  <p className="text-xs font-bold text-slate-800">{q.trim()}</p>
                  <p className="text-[11px] opacity-75 mt-0.5">{a.trim()}</p>
                </div>
              ))}
            </div>
            {configData.contactUrl && (
              <div className={btnClassName}>
                {configData.buttonText || "Bize Ulaşın"}
              </div>
            )}
          </CardWrapper>
        );
      }
    case "MAP":
      return (
        <CardWrapper key={addon.id} slug={getSlug(type, configData)}>
          <h4 className="text-sm font-bold text-slate-800">{configData.title || "Bizi Ziyaret Edin"}</h4>
          <div className="bg-black/5 p-2 rounded-lg flex items-center gap-2">
            <span className="text-red-500">📍</span>
            <span className="text-xs truncate">{configData.address || "İstanbul, Türkiye"}</span>
          </div>
          <div className={btnClassName}>
            {configData.buttonText || "Yol Tarifi Al"}
          </div>
        </CardWrapper>
      );
    case "WHATSAPP":
      return (
        <CardWrapper key={addon.id} slug={getSlug(type, configData)}>
          <h4 className="text-sm font-bold text-slate-800">{configData.title || "WhatsApp İletişim"}</h4>
          <p className="text-xs opacity-70 bg-green-500/5 p-2 rounded-lg border border-green-500/10 text-green-600">
            {configData.welcomeMessage || "Merhaba, size nasıl yardımcı olabilirim?"}
          </p>
          <div className={btnClassName}>
            {configData.buttonText || "Sohbete Başla"}
          </div>
        </CardWrapper>
      );
    case "SPOTIFY_CLASSIC":
    case "VINYL_RETRO":
    case "GLASS_AUDIO":
    case "NEON_CYBERPUNK":
    case "MINIMAL_LIGHT_AUDIO":
    case "MUSIC_PODCAST":
      return (
        <CardWrapper key={addon.id} slug={getSlug(type, configData)}>
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-550/10 flex items-center justify-center shrink-0">
                <Music className="h-5 w-5 text-purple-650" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-800">{configData.title || (type === "SPOTIFY_CLASSIC" ? "Classic Spotify Player" : type === "VINYL_RETRO" ? "Retro Plak Çalar" : type === "GLASS_AUDIO" ? "Modern Cam Efekti" : type === "NEON_CYBERPUNK" ? "Neon Cyberpunk Player" : type === "MINIMAL_LIGHT_AUDIO" ? "Minimalist Light Player" : "Müzik & Podcast Çalar")}</h4>
                <p className="text-xs opacity-70 mt-0.5 truncate max-w-[200px]">{configData.description || "Müziklerimi dinlemek için tıklayın."}</p>
              </div>
            </div>
            <div className="w-8 h-8 rounded-full bg-pink-500 flex items-center justify-center text-white shrink-0">
              <span className="text-[10px] ml-0.5">▶</span>
            </div>
          </div>
        </CardWrapper>
      );
    case "PORTFOLIO_GALLERY":
      return (
        <CardWrapper key={addon.id} slug={getSlug(type, configData)}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-500/10 flex items-center justify-center shrink-0">
              <Image className="h-5 w-5 text-slate-500" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-800">{configData.title || "Portfolyo & Galeri"}</h4>
              <p className="text-xs opacity-70 mt-0.5">{configData.description || "Çalışmalarımı ve galerimi inceleyin."}</p>
            </div>
          </div>
          <div className={btnClassName}>
            {configData.buttonText || "Galeriyi Gör"}
          </div>
        </CardWrapper>
      );
    case "COUNTDOWN_LAUNCH":
      return (
        <CardWrapper key={addon.id} slug={getSlug(type, configData)}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center shrink-0">
              <Clock className="h-5 w-5 text-orange-500" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-800">{configData.title || "Geri Sayım & Lansman"}</h4>
              <p className="text-xs opacity-70 mt-0.5">{configData.description || "Lansmanımız için geri sayım başladı."}</p>
            </div>
          </div>
          <div className={btnClassName}>
            {configData.buttonText || "Lansmanı İncele"}
          </div>
        </CardWrapper>
      );
    case "TESTIMONIALS":
      return (
        <CardWrapper key={addon.id} slug={getSlug(type, configData)}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-teal-500/10 flex items-center justify-center shrink-0">
              <MessageCircle className="h-5 w-5 text-teal-500" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-800">{configData.title || "Müşteri Yorumları"}</h4>
              <p className="text-xs opacity-70 mt-0.5">{configData.description || "Müşterilerimizin yorumlarını okuyun."}</p>
            </div>
          </div>
          <div className={btnClassName}>
            {configData.buttonText || "Yorumları Gör"}
          </div>
        </CardWrapper>
      );
    case "MINI_STORE":
    case "NEO_BRUTAL":
    case "ORGANIC":
    case "RETRO":
    case "ACADEMIA":
    case "Y2K":
    case "PREMIUM_CREATOR":
    case "WEB3_NFT":
    case "EDITORIAL_LUX":
    case "GAMER_HUB":
    case "CORP_EXEC":
    case "COMIC_MANGA":
      return (
        <CardWrapper key={addon.id} slug={getSlug(type, configData)}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
              <Store className="h-5 w-5 text-emerald-500" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-800">{configData.storeTitle || "Dijital Mağaza"}</h4>
              <p className="text-xs opacity-70 mt-0.5">{configData.storeBio || "Ürünlerimi incelemek için tıklayın."}</p>
            </div>
          </div>
          <div className={btnClassName}>
            {configData.buyButtonText || "Mağazayı Gör"}
          </div>
        </CardWrapper>
      );
    default:
      return null;
  }`;

profileContent = profileContent.replace(profileSwitchRegex, profileSwitchReplacement);
profileContent += '\n' + renderAddonInnerContentFnCode;

fs.writeFileSync(profileFilePath, profileContent, 'utf8');
console.log("src/components/universal-profile.tsx updated");

// ─── 3. PATCH src/components/addons/addon-config-modal.tsx ───
const modalFilePath = path.join(rootDir, 'src', 'components', 'addons', 'addon-config-modal.tsx');
let modalContent = fs.readFileSync(modalFilePath, 'utf8');
modalContent = modalContent.replace(/\r\n/g, '\n');

// Update imports in addon-config-modal.tsx
modalContent = modalContent.replace(
  'import { X, Loader2, Save, Store, Calendar, FileQuestion, Mail, Heart, Clock, Briefcase, HelpCircle, MapPin, MessageCircle, Trash2, Plus, ShoppingBag } from "lucide-react";',
  'import { X, Loader2, Save, Store, Calendar, FileQuestion, Mail, Heart, Clock, Briefcase, HelpCircle, MapPin, MessageCircle, Trash2, Plus, ShoppingBag, Music, Image } from "lucide-react";'
);

// Update getAddonDetails in modal
const modalDetailsRegex = /case "WHATSAPP": return \{ icon: <MessageCircle className="h-5 w-5" \/>, title: "WhatsApp" \};\s*default: return \{ icon: <Store className="h-5 w-5" \/>, title: "Add-on" \};/;
const modalDetailsReplacement = `case "WHATSAPP": return { icon: <MessageCircle className="h-5 w-5" />, title: "WhatsApp" };
  case "SPOTIFY_CLASSIC": return { icon: <Music className="h-5 w-5" />, title: "Spotify Classic Player" };
  case "VINYL_RETRO": return { icon: <Music className="h-5 w-5" />, title: "Retro Plak Çalar" };
  case "GLASS_AUDIO": return { icon: <Music className="h-5 w-5" />, title: "Modern Cam Efekti" };
  case "NEON_CYBERPUNK": return { icon: <Music className="h-5 w-5" />, title: "Neon Cyberpunk Player" };
  case "MINIMAL_LIGHT_AUDIO": return { icon: <Music className="h-5 w-5" />, title: "Minimalist Light Player" };
  case "MUSIC_PODCAST": return { icon: <Music className="h-5 w-5" />, title: "Müzik & Podcast Çalar" };
  case "PORTFOLIO_GALLERY": return { icon: <Image className="h-5 w-5" />, title: "Portfolyo & Galeri" };
  case "COUNTDOWN_LAUNCH": return { icon: <Clock className="h-5 w-5" />, title: "Geri Sayım & Lansman" };
  case "TESTIMONIALS": return { icon: <MessageCircle className="h-5 w-5" />, title: "Müşteri Yorumları" };
  case "WEB3_NFT": return { icon: <Store className="h-5 w-5" />, title: "Web3 & NFT Showcase" };
  case "EDITORIAL_LUX": return { icon: <Store className="h-5 w-5" />, title: "High-End Editorial" };
  case "GAMER_HUB": return { icon: <Store className="h-5 w-5" />, title: "Streamer & Gamer Hub" };
  case "CORP_EXEC": return { icon: <Store className="h-5 w-5" />, title: "Corporate Executive" };
  case "COMIC_MANGA": return { icon: <Store className="h-5 w-5" />, title: "Comic & Manga Panel" };
  default: return { icon: <Store className="h-5 w-5" />, title: "Add-on" };`;

modalContent = modalContent.replace(modalDetailsRegex, modalDetailsReplacement);

// Update getDefaultTheme in modal
const modalDefaultThemeRegex = /const getDefaultTheme = \((type|t): string\) => \{[\s\S]*?default: return "classic";[\s\S]*?\};/;
const modalDefaultThemeReplacement = `const getDefaultTheme = (type: string) => {
  switch (type) {
  case "NEO_BRUTAL": return "neo-brutalism";
  case "ORGANIC": return "organic-earth";
  case "RETRO": return "retro-arcade";
  case "ACADEMIA": return "dark-academia";
  case "Y2K": return "y2k-holographic";
  case "PREMIUM_CREATOR": return "premium-creator";
  case "WEB3_NFT": return "dark-drill";
  case "EDITORIAL_LUX": return "minimalist";
  case "GAMER_HUB": return "vibrant-pop";
  case "CORP_EXEC": return "classic";
  case "COMIC_MANGA": return "neo-brutalism";
  default: return "classic";
  }
  };`;

modalContent = modalContent.replace(modalDefaultThemeRegex, modalDefaultThemeReplacement);

// Update specificFields switch in modal
const modalSpecificFieldsRegex = /case "MINI_STORE":\s*case "NEO_BRUTAL":\n\s*case "ORGANIC":\n\s*case "RETRO":\n\s*case "ACADEMIA":\n\s*case "Y2K":\n\s*case "PREMIUM_CREATOR":/;
const modalSpecificFieldsReplacement = `case "MINI_STORE":
  case "NEO_BRUTAL":
  case "ORGANIC":
  case "RETRO":
  case "ACADEMIA":
  case "Y2K":
  case "PREMIUM_CREATOR":
  case "WEB3_NFT":
  case "EDITORIAL_LUX":
  case "GAMER_HUB":
  case "CORP_EXEC":
  case "COMIC_MANGA":`;

modalContent = modalContent.replace(modalSpecificFieldsRegex, modalSpecificFieldsReplacement);

// Insert input editors for new plugins right before the default block in specificFields
const modalDefaultFieldsRegex = /default:\s*specificFields = \(\s*<div className="p-3 md:p-6 bg-zinc-50 border border-zinc-200 text-zinc-650 rounded-2xl text-sm text-center">[\s\S]*?<\/div>\s*\);\s*\}/;
const modalDefaultFieldsReplacement = `case "SPOTIFY_CLASSIC":
  case "VINYL_RETRO":
  case "GLASS_AUDIO":
  case "NEON_CYBERPUNK":
  case "MINIMAL_LIGHT_AUDIO":
  case "MUSIC_PODCAST":
  case "PORTFOLIO_GALLERY":
  case "COUNTDOWN_LAUNCH":
  case "TESTIMONIALS":
    specificFields = (
      <>
        {renderInput("title", lang === "tr" ? "Başlık" : "Title", lang === "tr" ? "Eklenti Başlığı" : "Addon Title")}
        {renderTextarea("description", lang === "tr" ? "Açıklama / Alt Metin" : "Description / Subtext", lang === "tr" ? "Kısa bir açıklama girin..." : "Enter a short description...")}
      </>
    );
    break;
  default:
    specificFields = (
      <div className="p-3 md:p-6 bg-zinc-50 border border-zinc-200 text-zinc-650 rounded-2xl text-sm text-center">
        {lang === "tr" ? "Bu eklenti için özel ayar bulunmuyor." : "No specific settings for this add-on."}
      </div>
    );
  }`;

modalContent = modalContent.replace(modalDefaultFieldsRegex, modalDefaultFieldsReplacement);

// Exclude new storefront themes from renderSlugAndAvatar condition check
const modalSlugExcludeRegex = /addon\.addonType !== "MINI_STORE" && \s*addon\.addonType !== "NEO_BRUTAL" && \s*addon\.addonType !== "ORGANIC" && \s*addon\.addonType !== "RETRO" && \s*addon\.addonType !== "ACADEMIA" && \s*addon\.addonType !== "Y2K" \? renderSlugAndAvatar\(\) : null/;
const modalSlugExcludeReplacement = `addon.addonType !== "MINI_STORE" && 
  addon.addonType !== "NEO_BRUTAL" && 
  addon.addonType !== "ORGANIC" && 
  addon.addonType !== "RETRO" && 
  addon.addonType !== "ACADEMIA" && 
  addon.addonType !== "Y2K" &&
  addon.addonType !== "PREMIUM_CREATOR" &&
  addon.addonType !== "WEB3_NFT" &&
  addon.addonType !== "EDITORIAL_LUX" &&
  addon.addonType !== "GAMER_HUB" &&
  addon.addonType !== "CORP_EXEC" &&
  addon.addonType !== "COMIC_MANGA" ? renderSlugAndAvatar() : null`;

modalContent = modalContent.replace(modalSlugExcludeRegex, modalSlugExcludeReplacement);

// Update renderLivePreview in modal
const modalLivePreviewRegex = /switch \(addon\.addonType\) \{\s*case "MINI_STORE":\s*case "NEO_BRUTAL":\n\s*case "ORGANIC":\n\s*case "RETRO":\n\s*case "ACADEMIA":\n\s*case "Y2K":\n\s*case "PREMIUM_CREATOR":/;
const modalLivePreviewReplacement = `switch (addon.addonType) {
    case "MINI_STORE":
    case "NEO_BRUTAL":
    case "ORGANIC":
    case "RETRO":
    case "ACADEMIA":
    case "Y2K":
    case "PREMIUM_CREATOR":
    case "WEB3_NFT":
    case "EDITORIAL_LUX":
    case "GAMER_HUB":
    case "CORP_EXEC":
    case "COMIC_MANGA":`;

modalContent = modalContent.replace(modalLivePreviewRegex, modalLivePreviewReplacement);

// Insert new mockup preview builders inside renderLivePreview before the default fallback
const modalLiveDefaultRegex = /default:\s*return \(\s*<div className="w-full h-full bg-zinc-50 flex items-center justify-center p-3 md:p-6 text-center">[\s\S]*?<\/div>\s*\);\s*\}\s*\};/;
const modalLiveDefaultReplacement = `case "SPOTIFY_CLASSIC":
    case "VINYL_RETRO":
    case "GLASS_AUDIO":
    case "NEON_CYBERPUNK":
    case "MINIMAL_LIGHT_AUDIO":
    case "MUSIC_PODCAST":
    case "PORTFOLIO_GALLERY":
    case "COUNTDOWN_LAUNCH":
    case "TESTIMONIALS":
      {
        const type = addon.addonType;
        const displayAvatar = configData.avatarUrl || addon.settings?.avatarUrl || "";
        const displayUsername = configData.username || addon.settings?.username || ("@" + username);
        const displayBio = configData.bio || addon.settings?.bio || "";
        const displayTitle = configData.title || (type === "SPOTIFY_CLASSIC" ? "Classic Spotify Player" : type === "VINYL_RETRO" ? "Retro Plak Çalar" : type === "GLASS_AUDIO" ? "Modern Cam Efekti" : type === "NEON_CYBERPUNK" ? "Neon Cyberpunk Player" : type === "MINIMAL_LIGHT_AUDIO" ? "Minimalist Light Player" : type === "MUSIC_PODCAST" ? "Müzik & Podcast Çalar" : type === "PORTFOLIO_GALLERY" ? "Portfolyo & Galeri" : type === "COUNTDOWN_LAUNCH" ? "Geri Sayım & Lansman" : "Müşteri Yorumları");
        const displayDesc = configData.description || (type === "SPOTIFY_CLASSIC" ? "Orijinal ve ikonik Spotify görünümü." : type === "VINYL_RETRO" ? "Nostaljik ruhu yaşatan, plak görünümlü oynatıcı." : type === "GLASS_AUDIO" ? "Albüm renklerine uyum sağlayan yarı saydam tasarım." : type === "NEON_CYBERPUNK" ? "Elektronik müzik ve synthwave tutkunları için." : type === "MINIMAL_LIGHT_AUDIO" ? "Ferah, aydınlık ve dikkat dağıtmayan net tasarım." : type === "MUSIC_PODCAST" ? "Beat'lerinizi ve podcast'lerinizi doğrudan sayfanızda dinletin." : type === "PORTFOLIO_GALLERY" ? "Tasarımlarınızı ve fotoğraflarınızı şık bir ızgara (grid) yapısında sergileyin." : type === "COUNTDOWN_LAUNCH" ? "Yeni ürün veya içerikleriniz için heyecan yaratacak dinamik sayaç." : "Referanslarınızı ve 5 yıldızlı değerlendirmelerinizi öne çıkararak güven inşa edin.");

        return (
          <div className="w-full h-full bg-zinc-950 flex flex-col justify-between overflow-y-auto no-scrollbar">
            {renderAddonInnerContent(type, displayAvatar, displayUsername, displayBio, displayTitle, displayDesc)}
          </div>
        );
      }
    default:
      return (
        <div className="w-full h-full bg-zinc-50 flex items-center justify-center p-3 md:p-6 text-center">
          <div className="space-y-4">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-indigo-50 text-indigo-500 flex items-center justify-center shadow-inner">
              {icon}
            </div>
            <div>
              <h3 className="font-bold text-xl text-slate-800">{configData.title || configData.storeTitle || addon.addonType}</h3>
              <p className="text-sm text-slate-500 mt-2 max-w-[250px] mx-auto leading-relaxed">
                {lang === "tr" ? "Bu eklenti için canlı önizleme şu an desteklenmiyor, ancak ayarlarınız kaydedilecektir." : "Live preview not supported yet, but your settings will be saved."}
              </p>
            </div>
          </div>
        </div>
      );
    }
  };`;

modalContent = modalContent.replace(modalLiveDefaultRegex, modalLiveDefaultReplacement);
modalContent += '\n' + renderAddonInnerContentFnCode;

fs.writeFileSync(modalFilePath, modalContent, 'utf8');
console.log("src/components/addons/addon-config-modal.tsx updated");

// ─── 4. PATCH src/components/dashboard/phone-preview.tsx ───
const previewFilePath = path.join(rootDir, 'src', 'components', 'dashboard', 'phone-preview.tsx');
let previewContent = fs.readFileSync(previewFilePath, 'utf8');
previewContent = previewContent.replace(/\r\n/g, '\n');

// Import Lucide icons
previewContent = previewContent.replace(
  'import { Laptop, Zap, Clock } from "lucide-react";',
  'import { Laptop, Zap, Clock, Store, Music, Image, MessageCircle, Calendar } from "lucide-react";'
);

// Update renderPluginPreview in preview
const previewStoreRegex = /if \(\["MINI_STORE", "NEO_BRUTAL", "ORGANIC", "RETRO", "ACADEMIA", "Y2K", "PREMIUM_CREATOR"\]\.includes\(type\)\) \{/;
const previewStoreReplacement = `if (["MINI_STORE", "NEO_BRUTAL", "ORGANIC", "RETRO", "ACADEMIA", "Y2K", "PREMIUM_CREATOR", "WEB3_NFT", "EDITORIAL_LUX", "GAMER_HUB", "CORP_EXEC", "COMIC_MANGA"].includes(type)) {`;

previewContent = previewContent.replace(previewStoreRegex, previewStoreReplacement);

// Update getDefaultTheme inside preview
const previewDefaultThemeRegex = /const getDefaultTheme = \((t): string\) => \{[\s\S]*?default: return "classic";[\s\S]*?\};/;
const previewDefaultThemeReplacement = `const getDefaultTheme = (t: string) => {
        switch (t) {
          case "NEO_BRUTAL": return "neo-brutalism";
          case "ORGANIC": return "organic-earth";
          case "RETRO": return "retro-arcade";
          case "ACADEMIA": return "dark-academia";
          case "Y2K": return "y2k-holographic";
          case "PREMIUM_CREATOR": return "premium-creator";
          case "WEB3_NFT": return "dark-drill";
          case "EDITORIAL_LUX": return "minimalist";
          case "GAMER_HUB": return "vibrant-pop";
          case "CORP_EXEC": return "classic";
          case "COMIC_MANGA": return "neo-brutalism";
          default: return "classic";
        }
      };`;

previewContent = previewContent.replace(previewDefaultThemeRegex, previewDefaultThemeReplacement);

// Add custom render condition in renderPluginPreview before fallback
const previewFallbackRegex = /return \(\s*<UniversalProfile \s*data=\{data\} \s*isCompactMode=\{true\} \s*isDarkContext=\{\!isLight\} \s*isDashboardPreview=\{true\}\s*\/\>\s*\);\s*\};/;
const previewFallbackReplacement = `if (["SPOTIFY_CLASSIC", "VINYL_RETRO", "GLASS_AUDIO", "NEON_CYBERPUNK", "MINIMAL_LIGHT_AUDIO", "MUSIC_PODCAST", "PORTFOLIO_GALLERY", "COUNTDOWN_LAUNCH", "TESTIMONIALS"].includes(type)) {
      const displayAvatar = parsedConfig.avatarUrl || data.avatarUrl || "";
      const displayUsername = parsedConfig.username || ("@" + data.username);
      const displayBio = parsedConfig.bio || data.bio || "";
      const displayTitle = parsedConfig.title || (type === "SPOTIFY_CLASSIC" ? "Classic Spotify Player" : type === "VINYL_RETRO" ? "Retro Plak Çalar" : type === "GLASS_AUDIO" ? "Modern Cam Efekti" : type === "NEON_CYBERPUNK" ? "Neon Cyberpunk Player" : type === "MINIMAL_LIGHT_AUDIO" ? "Minimalist Light Player" : type === "MUSIC_PODCAST" ? "Müzik & Podcast Çalar" : type === "PORTFOLIO_GALLERY" ? "Portfolyo & Galeri" : type === "COUNTDOWN_LAUNCH" ? "Geri Sayım & Lansman" : "Müşteri Yorumları");
      const displayDesc = parsedConfig.description || (type === "SPOTIFY_CLASSIC" ? "Orijinal ve ikonik Spotify görünümü." : type === "VINYL_RETRO" ? "Nostaljik ruhu yaşatan, plak görünümlü oynatıcı." : type === "GLASS_AUDIO" ? "Albüm renklerine uyum sağlayan yarı saydam tasarım." : type === "NEON_CYBERPUNK" ? "Elektronik müzik ve synthwave tutkunları için." : type === "MINIMAL_LIGHT_AUDIO" ? "Ferah, aydınlık ve dikkat dağıtmayan net tasarım." : type === "MUSIC_PODCAST" ? "Beat'lerinizi ve podcast'lerinizi doğrudan sayfanızda dinletin." : type === "PORTFOLIO_GALLERY" ? "Tasarımlarınızı ve fotoğraflarınızı şık bir ızgara (grid) yapısında sergileyin." : type === "COUNTDOWN_LAUNCH" ? "Yeni ürün veya içerikleriniz için heyecan yaratacak dinamik sayaç." : "Referanslarınızı ve 5 yıldızlı değerlendirmelerinizi öne çıkararak güven inşa edin.");

      return (
        <div className="w-full h-full bg-zinc-950 flex flex-col justify-between overflow-y-auto no-scrollbar">
          {renderAddonInnerContent(type, displayAvatar, displayUsername, displayBio, displayTitle, displayDesc)}
        </div>
      );
    }

    return (
      <UniversalProfile 
        data={data} 
        isCompactMode={true} 
        isDarkContext={!isLight}
        isDashboardPreview={true}
      />
    );
  };`;

previewContent = previewContent.replace(previewFallbackRegex, previewFallbackReplacement);
previewContent += '\n' + renderAddonInnerContentFnCode;

fs.writeFileSync(previewFilePath, previewContent, 'utf8');
console.log("src/components/dashboard/phone-preview.tsx updated");

console.log("All files patched successfully!");
