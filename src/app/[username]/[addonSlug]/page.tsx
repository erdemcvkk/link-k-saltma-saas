import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import StorefrontPreview from "@/components/storefront-preview";
import { Store, Music, Image, Clock, MessageCircle } from "lucide-react";
import { Metadata } from "next";
import PlayableAddon from "@/components/addons/playable-addon";

export async function generateMetadata({ params }: { params: Promise<{ username: string; addonSlug: string }> }): Promise<Metadata> {
 const resolvedParams = await params;
 const username = resolvedParams.username.replace("%40", "").replace(/^@/, "");

 const user = await db.user.findUnique({
 where: { username },
 include: { profile: true },
 });

 if (!user || !user.profile) return { title: "Not Found" };

 return {
 title: `${user.username || user.username} - Addon`,
 description: user.profile.bio || "Link-in-bio addon",
 };
}

export default async function AddonPage({ 
  params, 
  searchParams 
}: { 
  params: Promise<{ username: string; addonSlug: string }>,
  searchParams?: Promise<{ previewAddons?: string }>
}) {
  const resolvedParams = await params;
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const previewAddons = resolvedSearchParams.previewAddons;
  const username = resolvedParams.username.replace("%40", "").replace(/^@/, "");
  const addonSlug = resolvedParams.addonSlug;

  const user = await db.user.findUnique({
  where: { username },
  include: { profile: true },
  });

  if (!user || !user.profile) {
  notFound();
  }

  // Find active or draft addons
  const addons = await db.userAddon.findMany({
  where: { 
    userId: user.id,
    ...(previewAddons === "true" ? {} : { isActive: true })
  },
  });

  // Find the addon that matches this slug
  function getDefaultSlug(type: string) {
    if (!type) return "store";
    if (type === "MINI_STORE") return "store";
    if (type === "NEO_BRUTAL") return "neo-brutal";
    if (type === "ORGANIC") return "organic";
    if (type === "RETRO") return "retro";
    if (type === "ACADEMIA") return "academia";
    if (type === "Y2K") return "y2k";
    if (type === "BOOKING") return "booking";
    if (type === "NEWSLETTER") return "newsletter";
    if (type === "QA") return "qa";
    if (type === "DONATION") return "donation";
    if (type === "PREMIUM_CREATOR") return "creator-store";
    if (type === "PREMIUM_VIDEO") return "masterclass";
    if (type === "WEB3_NFT") return "web3-nft";
    if (type === "EDITORIAL_LUX") return "editorial";
    if (type === "GAMER_HUB") return "gamer-hub";
    if (type === "CORP_EXEC") return "corporate";
    if (type === "COMIC_MANGA") return "comic-manga";
    if (type === "RETRO_CASSETTE") return "retro-cassette";
    if (type === "MINIMAL_DARK_AUDIO") return "minimal-dark-audio";
    if (type === "VINTAGE_RADIO") return "vintage-radio";
    if (type === "FUTURE_WAVE") return "future-wave";
    if (type === "CINEMATIC_THEATER") return "cinematic-theater";
    if (type === "SPOTIFY_CLASSIC") return "spotify-player";
    if (type === "VINYL_RETRO") return "vinyl-player";
    if (type === "GLASS_AUDIO") return "glass-audio";
    if (type === "NEON_CYBERPUNK") return "neon-player";
    if (type === "MINIMAL_LIGHT_AUDIO") return "minimal-audio";
    if (type === "MUSIC_PODCAST") return "music-podcast";
    if (type === "PORTFOLIO_GALLERY") return "portfolio-gallery";
    if (type === "COUNTDOWN_LAUNCH") return "countdown";
    if (type === "TESTIMONIALS") return "testimonials";
    return type.toLowerCase();
  }

  // Find the matching active/draft addon by slug
  const matchingAddon = addons.find(a => {
  if (!a.isActive && previewAddons !== "true") return false;
  const parsed = a.settings ? (typeof a.settings === "string" ? JSON.parse(a.settings) : a.settings) : {};
  const cSlug = (parsed.customSlug || getDefaultSlug(a.addonType)).toLowerCase();
  return cSlug === addonSlug.toLowerCase();
  });

 if (!matchingAddon) {
 notFound();
 }

 const getDefaultTheme = (type: string) => {
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
  };

 const getThemeBgClass = (theme: string) => {
   switch (theme) {
     case "dark-drill":
       return "bg-black";
     case "glassmorphism":
       return "bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900";
     case "minimalist":
       return "bg-white";
     case "vibrant-pop":
       return "bg-orange-50";
     case "neo-brutalism":
       return "bg-[#caff4a]";
     case "organic-earth":
       return "bg-[#f5efe6]";
     case "retro-arcade":
       return "bg-[#0a0a2e] retro-grid-bg";
     case "dark-academia":
       return "bg-[#1a1a1a]";
     case "y2k-holographic":
       return "bg-gradient-to-br from-[#ffe6f7] via-[#e8e0ff] to-[#d4f7ff]";
     case "premium-creator":
       return "bg-[#fdfdfd]";
     case "classic":
     default:
       return "bg-gray-50";
   }
 };

  let parsedConfig: any = { theme: 'classic' };
  if (matchingAddon.settings) {
    parsedConfig = typeof matchingAddon.settings === "string" ? JSON.parse(matchingAddon.settings) : matchingAddon.settings;
  }

 if (matchingAddon.addonType === "MINI_STORE" || 
   matchingAddon.addonType === "NEO_BRUTAL" || 
   matchingAddon.addonType === "ORGANIC" || 
   matchingAddon.addonType === "RETRO" || 
   matchingAddon.addonType === "ACADEMIA" || 
   matchingAddon.addonType === "Y2K" ||
   matchingAddon.addonType === "PREMIUM_CREATOR" ||
   matchingAddon.addonType === "WEB3_NFT" ||
   matchingAddon.addonType === "EDITORIAL_LUX" ||
   matchingAddon.addonType === "GAMER_HUB" ||
   matchingAddon.addonType === "COMIC_MANGA") {
    
    const displayProducts = (parsedConfig.products && Array.isArray(parsedConfig.products) && parsedConfig.products.length > 0)
      ? parsedConfig.products.map((p: any) => ({
          id: p.id,
          title: p.title,
          type: p.type || "PRODUCT",
          price: p.price?.toString() || "0",
          imageUrl: p.imageUrl || null,
          description: p.description || "",
          buyLink: p.buyLink || ""
        }))
      : (await db.product.findMany({
          where: { userId: user.id, isActive: true },
          orderBy: { createdAt: "desc" },
        })).map(p => ({
          id: p.id,
          title: p.title,
          type: p.type,
          price: p.price.toString(),
          imageUrl: p.imageUrl || p.fileUrl,
          description: p.description || "",
          buyLink: ""
        }));

    const currentTheme = parsedConfig.theme || getDefaultTheme(matchingAddon.addonType);
    const bgClass = getThemeBgClass(currentTheme);

    return (
      <div className={`w-full min-h-screen ${bgClass} flex justify-center`}>
        <div className="w-full max-w-full md:w-[480px] min-h-screen relative shadow-2xl overflow-hidden bg-white">
          <StorefrontPreview 
            theme={currentTheme} 
            onProductClick={undefined}
            products={displayProducts} 
            storeTitle={parsedConfig.storeTitle || user.username || "Mağazam"}
            storeCoverUrl={parsedConfig.storeCoverUrl || user.profile.background || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1000&q=80"}
            avatarUrl={parsedConfig.storeAvatarUrl || user.profile.avatarUrl}
            username={parsedConfig.storeUsername || ("@" + user.username)}
            bio={parsedConfig.storeBio || user.profile.bio}
            buyButtonText={parsedConfig.buyButtonText || "Satın Al"}
          />
        </div>
      </div>
    );
  }

  if (matchingAddon.addonType === "CORP_EXEC") {
    return (
      <div className="w-full min-h-screen bg-slate-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-slate-50 text-slate-800 rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-200">
          
          {/* Header Cover */}
          <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-950 h-36 w-full flex flex-col justify-end p-4 relative">
            {parsedConfig.storeCoverUrl && (
              <img src={parsedConfig.storeCoverUrl} className="absolute inset-0 w-full h-full object-cover opacity-65" />
            )}
            <div className="absolute top-4 right-4 px-3 py-1 bg-blue-600 text-[10px] font-bold text-white rounded-lg tracking-wider shadow-sm uppercase">PRO</div>
          </div>
          
          {/* Profile details */}
          <div className="flex flex-col items-center -mt-12 px-6 mb-6 relative z-10">
            <div className="w-24 h-24 bg-white rounded-full border-4 border-white overflow-hidden shadow-lg">
              <img src={parsedConfig.storeAvatarUrl || user.profile.avatarUrl || "/placeholder.png"} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder.png" }} />
            </div>
            <h1 className="text-lg font-black mt-3 text-slate-800">{parsedConfig.storeUsername || ("@" + user.username)}</h1>
            <p className="text-xs text-slate-500 font-bold tracking-tight mt-1">{parsedConfig.storeBio || user.profile.bio || "C-Level Executive Consultant"}</p>
          </div>
          
          {/* Main Card */}
          <div className="bg-white shadow-xl rounded-3xl p-6 mx-6 mb-8 border border-slate-100 space-y-4">
            <div className="text-center md:text-left">
              <h2 className="text-base font-black text-slate-800 tracking-tight leading-snug">{parsedConfig.title || "Q3 Executive Briefing"}</h2>
              <p className="text-sm text-slate-500 font-medium mt-1.5 leading-relaxed">{parsedConfig.description || "Corporate & Strategy"}</p>
            </div>
            
            <a 
              href={parsedConfig.buttonUrl || "#"} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl tracking-wide transition-all border-0 shadow-lg shadow-blue-500/20 cursor-pointer block text-center"
            >
              {parsedConfig.buttonText || "Schedule Consultation"}
            </a>
          </div>
          
        </div>
      </div>
    );
  }

 if (matchingAddon.addonType === "BOOKING") {
 return (
 <div className="w-full min-h-screen bg-slate-50 flex items-center justify-center p-4">
 <div className="w-full max-w-md bg-white p-4 md:p-8 rounded-[2rem] shadow-xl flex flex-col items-center text-center">
 {parsedConfig.avatarUrl ? (
 <img src={parsedConfig.avatarUrl} className="w-24 h-24 rounded-full object-cover shadow-md mb-6" alt="Profile" />
 ) : (
 <div className="w-24 h-24 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center mb-6">
 <span className="text-xl md:text-3xl">📅</span>
 </div>
 )}
 <h1 className="text-2xl font-black text-slate-800 mb-3">{parsedConfig.title || "Birebir Görüşme Ayarla"}</h1>
 <p className="text-slate-500 mb-8">{parsedConfig.description || "Sizinle tanışmak için sabırsızlanıyorum."}</p>
 <a href={parsedConfig.calendarLink || "#"} target="_blank" rel="noopener noreferrer" className="w-full py-4 rounded-2xl bg-slate-900 text-white font-bold text-lg hover:bg-slate-800 transition-colors shadow-lg">
 {parsedConfig.buttonText || "Takvimi Görüntüle"}
 </a>
 </div>
 </div>
 );
 }

  if (matchingAddon.addonType === "NEWSLETTER") {
    const isDirect = parsedConfig.integrationType === "DIRECT";
    return (
      <div className="w-full min-h-screen bg-emerald-50/20 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white p-6 md:p-8 rounded-[2rem] shadow-xl flex flex-col items-center text-center">
          <div className="w-20 h-20 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center mb-6 text-3xl">
            ✉️
          </div>
          <h1 className="text-2xl font-black text-slate-800 mb-3">
            {parsedConfig.title || "Haftalık Bülten"}
          </h1>
          <p className="text-slate-500 mb-8 leading-relaxed text-sm">
            {parsedConfig.incentiveMsg || "Spam yok, sadece kaliteli içerik."}
          </p>
          
          {isDirect ? (
            <form className="w-full space-y-4">
              <input 
                type="email" 
                required
                placeholder="E-posta adresiniz" 
                className="w-full px-4 py-3.5 rounded-2xl border border-zinc-200 bg-zinc-50 text-sm outline-none focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all"
              />
              <button 
                type="submit" 
                className="w-full py-4 rounded-2xl bg-slate-900 text-white font-bold text-lg hover:bg-slate-800 transition-colors shadow-lg"
              >
                {parsedConfig.buttonText || "Abone Ol"}
              </button>
            </form>
          ) : (
            <a 
              href={parsedConfig.serviceUrl || "#"} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="w-full py-4 rounded-2xl bg-slate-900 text-white font-bold text-lg hover:bg-slate-800 transition-all text-center block shadow-lg"
            >
              {parsedConfig.buttonText || "Abone Ol"}
            </a>
          )}
        </div>
      </div>
    );
  }

 if (matchingAddon.addonType === "QA") {
    const qaPairs = parsedConfig.qaPairs || [];
    return (
      <div className="w-full min-h-screen bg-amber-50/30 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white p-6 md:p-8 rounded-[2rem] shadow-xl flex flex-col">
          <div className="flex flex-col items-center text-center mb-6">
            {parsedConfig.avatarUrl ? (
              <img src={parsedConfig.avatarUrl} className="w-20 h-20 rounded-full object-cover shadow-sm mb-4" alt="Profile" />
            ) : (
              <div className="w-20 h-20 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center mb-4">
                <span className="text-xl md:text-3xl">❓</span>
              </div>
            )}
            <h1 className="text-2xl font-black text-slate-800">{parsedConfig.boxTitle || "Soru & Cevap (AMA)"}</h1>
          </div>
          
          {qaPairs.length > 0 ? (
            <div className="space-y-3 w-full">
              {qaPairs.map((p: any, idx: number) => (
                <details key={idx} className="group border border-zinc-150 rounded-2xl bg-zinc-50 p-4 [&_summary::-webkit-details-marker]:hidden">
                  <summary className="flex items-center justify-between cursor-pointer focus:outline-none">
                    <span className="text-sm font-bold text-slate-800 pr-4">{p.q || "Soru"}</span>
                    <span className="transition group-open:rotate-180 text-zinc-400 shrink-0">
                      <svg fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24" className="h-4 w-4"><path d="M6 9l6 6 6-6"></path></svg>
                    </span>
                  </summary>
                  <p className="text-xs text-slate-650 mt-3 pl-1 leading-relaxed border-t border-zinc-200/60 pt-3 whitespace-pre-wrap">{p.a || "Cevap..."}</p>
                </details>
              ))}
            </div>
          ) : (
            <p className="text-sm text-zinc-500 text-center py-6">
              Henüz soru ve cevap eklenmemiş.
            </p>
          )}
        </div>
      </div>
    );
  }

  if (matchingAddon.addonType === "PREMIUM_VIDEO") {
    return (
      <PlayableAddon
        type="PREMIUM_VIDEO"
        avatarUrl=""
        username=""
        bio=""
        title=""
        desc=""
        config={parsedConfig}
      />
    );
  }

 if (matchingAddon.addonType === "DONATION") {
 return (
 <div className="w-full min-h-screen bg-pink-50/30 flex items-center justify-center p-4">
 <div className="w-full max-w-md bg-white p-4 md:p-8 rounded-[2rem] shadow-xl flex flex-col items-center text-center">
 {parsedConfig.avatarUrl ? (
 <img src={parsedConfig.avatarUrl} className="w-24 h-24 rounded-full object-cover shadow-md mb-6" alt="Profile" />
 ) : (
 <div className="w-24 h-24 rounded-full bg-pink-50 text-pink-500 flex items-center justify-center mb-6">
 <span className="text-xl md:text-3xl">☕</span>
 </div>
 )}
 <h1 className="text-2xl font-black text-slate-800 mb-3">{parsedConfig.title || "Bana Kahve Ismarla"}</h1>
 <p className="text-slate-500 mb-8">{parsedConfig.thankYouMsg || "Desteğiniz için teşekkürler!"}</p>
 <a href={parsedConfig.platformUrl || "#"} target="_blank" rel="noopener noreferrer" className="w-full py-4 rounded-2xl bg-slate-900 text-white font-bold text-lg hover:bg-slate-800 transition-colors shadow-lg">
 {parsedConfig.buttonText || "Destek Ol"}
 </a>
 </div>
 </div>
 );
 }

 if (matchingAddon.addonType === "COUNTDOWN") {
 // Generate an aesthetic countdown layout
 return (
 <div className="w-full min-h-screen bg-gradient-to-br from-indigo-900 via-slate-900 to-black flex items-center justify-center p-4">
 <div className="w-full max-w-lg bg-white/10 backdrop-blur-xl border border-white/20 p-4 md:p-10 rounded-[3rem] shadow-2xl flex flex-col items-center text-center">
 {parsedConfig.avatarUrl ? (
 <img src={parsedConfig.avatarUrl} className="w-24 h-24 rounded-3xl object-cover shadow-[0_0_30px_rgba(255,255,255,0.2)] mb-8" alt="Profile" />
 ) : (
 <div className="w-24 h-24 rounded-3xl bg-white/10 text-indigo-300 flex items-center justify-center mb-8 border border-white/20 shadow-inner">
 <span className="text-2xl md:text-4xl">⏳</span>
 </div>
 )}
 <h1 className="text-xl md:text-3xl font-black text-white tracking-tight mb-4">{parsedConfig.title || "Büyük Lansman"}</h1>
 <p className="text-indigo-200/80 mb-10 text-lg leading-relaxed">{parsedConfig.description || "Yeni ürünümüz çok yakında sizlerle!"}</p>
 
 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full mb-10">
 {['Gün', 'Saat', 'Dk', 'Sn'].map((label, idx) => (
 <div key={label} className="bg-black/40 border border-white/10 rounded-2xl py-4 flex flex-col items-center justify-center">
 <span className="text-xl md:text-3xl font-black text-white font-mono mb-1">{['14', '08', '45', '22'][idx]}</span>
 <span className="text-[10px] uppercase tracking-widest text-indigo-300/70 font-bold">{label}</span>
 </div>
 ))}
 </div>

 <a href={parsedConfig.buttonUrl || "#"} target="_blank" rel="noopener noreferrer" className="w-full py-5 rounded-2xl bg-indigo-500 text-white font-black text-lg hover:bg-indigo-400 hover:scale-[1.02] transition-all shadow-[0_0_40px_rgba(99,102,241,0.4)] tracking-wide">
 {parsedConfig.buttonText || "Detaylar"}
 </a>
 </div>
 </div>
 );
 }

 if (matchingAddon.addonType === "PORTFOLIO") {
 return (
 <div className="w-full min-h-screen bg-[#f3f4f6] flex flex-col items-center py-12 px-4">
 <div className="w-full max-w-2xl bg-white p-4 md:p-8 md:p-12 rounded-[2rem] shadow-xl">
 <div className="flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-8 mb-10">
 {parsedConfig.avatarUrl ? (
 <img src={parsedConfig.avatarUrl} className="w-32 h-32 rounded-[2rem] object-cover shadow-lg shrink-0" alt="Profile" />
 ) : (
 <div className="w-32 h-32 rounded-[2rem] bg-indigo-50 text-indigo-500 flex items-center justify-center shrink-0 shadow-inner">
 <span className="text-2xl md:text-4xl">🎨</span>
 </div>
 )}
 <div className="text-center md:text-left flex-1">
 <h1 className="text-xl md:text-3xl font-black text-slate-800 tracking-tight mb-3">{parsedConfig.title || "Benim Çalışmalarım"}</h1>
 <p className="text-slate-500 leading-relaxed font-medium">{parsedConfig.description || "Yaratıcı tasarımcı ve geliştirici."}</p>
 </div>
 </div>
 
 <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
 {[
 { title: "Behance", url: parsedConfig.behanceUrl, icon: "🎨", color: "bg-blue-50 text-blue-600 hover:bg-blue-100 border-blue-100" },
 { title: "Dribbble", url: parsedConfig.dribbbleUrl, icon: "🏀", color: "bg-pink-50 text-pink-600 hover:bg-pink-100 border-pink-100" },
 { title: "GitHub", url: parsedConfig.githubUrl, icon: "💻", color: "bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200" }
 ].map(link => link.url ? (
 <a key={link.title} href={link.url} target="_blank" rel="noopener noreferrer" className={`flex flex-col items-center justify-center py-6 px-4 rounded-2xl border transition-all ${link.color}`}>
 <span className="text-xl md:text-3xl mb-2">{link.icon}</span>
 <span className="font-bold text-sm">{link.title}</span>
 </a>
 ) : null)}
 </div>
 
 <button className="w-full py-5 rounded-2xl bg-slate-900 text-white font-bold text-lg hover:bg-slate-800 transition-colors shadow-lg">
 {parsedConfig.buttonText || "Projelerime Göz At"}
 </button>
 </div>
 </div>
 );
 }

 if (matchingAddon.addonType === "FAQ") {
 const qas = (parsedConfig.questionsText || "Kargo ne zaman ulaşır?|2-3 iş günü içinde.; İade var mı?|Evet, 14 gün içinde.;")
 .split(';')
 .map((pair: string) => pair.split('|'))
 .filter((pair: string[]) => pair.length === 2 && pair[0].trim() !== "");

 return (
 <div className="w-full min-h-screen bg-emerald-50/50 flex flex-col items-center py-12 px-4">
 <div className="w-full max-w-2xl bg-white p-4 md:p-8 md:p-12 rounded-[2rem] shadow-xl">
 <div className="text-center mb-10">
 {parsedConfig.avatarUrl ? (
 <img src={parsedConfig.avatarUrl} className="w-20 h-20 rounded-full object-cover mx-auto shadow-md mb-6" alt="Profile" />
 ) : (
 <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-6">
 <span className="text-xl md:text-3xl">💡</span>
 </div>
 )}
 <h1 className="text-xl md:text-3xl font-black text-slate-800 tracking-tight">{parsedConfig.title || "Sıkça Sorulan Sorular"}</h1>
 </div>
 
 <div className="space-y-4 mb-10">
 {qas.length > 0 ? qas.map(([q, a]: [string, string], i: number) => (
 <div key={i} className="bg-zinc-50 border border-zinc-100 rounded-2xl p-3 md:p-6">
 <h3 className="text-lg font-bold text-slate-800 mb-2 flex gap-3">
 <span className="text-emerald-500">Q.</span>
 {q.trim()}
 </h3>
 <p className="text-slate-600 leading-relaxed font-medium flex gap-3">
 <span className="text-slate-300 font-bold">A.</span>
 {a.trim()}
 </p>
 </div>
 )) : (
 <div className="text-center p-3 md:p-6 bg-zinc-50 rounded-2xl text-slate-500">Soru bulunamadı.</div>
 )}
 </div>
 
 <a href={parsedConfig.contactUrl || "mailto:info@domain.com"} className="block text-center w-full py-5 rounded-2xl bg-emerald-500 text-white font-bold text-lg hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-500/30">
 {parsedConfig.buttonText || "Bize Ulaşın"}
 </a>
 </div>
 </div>
 );
 }

 if (matchingAddon.addonType === "MAP") {
 return (
 <div className="w-full min-h-screen bg-slate-100 flex flex-col items-center justify-center p-4">
 <div className="w-full max-w-md bg-white rounded-[2rem] shadow-2xl overflow-hidden flex flex-col">
 <div className="h-48 bg-slate-200 relative">
 <div className="absolute inset-0 bg-blue-100/50 flex flex-col items-center justify-center text-blue-500">
 <span className="text-3xl md:text-5xl mb-2">🗺️</span>
 <span className="font-bold text-sm tracking-widest uppercase opacity-50">Harita Yükleniyor...</span>
 </div>
 {parsedConfig.avatarUrl && (
 <img src={parsedConfig.avatarUrl} className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-20 h-20 rounded-full border-4 border-white object-cover shadow-md z-10" alt="Location" />
 )}
 </div>
 
 <div className={`p-4 md:p-8 flex flex-col items-center text-center ${parsedConfig.avatarUrl ? 'pt-14' : 'pt-8'}`}>
 <h1 className="text-2xl font-black text-slate-800 mb-3">{parsedConfig.title || "Bizi Ziyaret Edin"}</h1>
 <div className="inline-flex items-center gap-2 bg-zinc-100 text-slate-600 px-4 py-3 md:py-2.5 rounded-xl font-medium text-sm mb-8 max-w-full">
 <span className="text-red-500">📍</span>
 <span className="truncate">{parsedConfig.address || "İstanbul, Türkiye"}</span>
 </div>
 
 <a href={parsedConfig.googleMapsUrl || "#"} target="_blank" rel="noopener noreferrer" className="w-full py-4 rounded-2xl bg-blue-600 text-white font-bold text-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20">
 {parsedConfig.buttonText || "Yol Tarifi Al"}
 </a>
 </div>
 </div>
 </div>
 );
 }

 if (matchingAddon.addonType === "WHATSAPP") {
 return (
 <div className="w-full min-h-screen bg-[#ece5dd] flex items-center justify-center p-4">
 <div className="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col">
 <div className="bg-[#075e54] p-3 md:p-6 flex flex-col items-center text-center text-white">
 {parsedConfig.avatarUrl ? (
 <img src={parsedConfig.avatarUrl} className="w-20 h-20 rounded-full border-2 border-white/20 object-cover shadow-sm mb-4" alt="Profile" />
 ) : (
 <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center mb-4">
 <span className="text-xl md:text-3xl">💬</span>
 </div>
 )}
 <h1 className="text-xl font-bold tracking-wide">{parsedConfig.title || "WhatsApp İletişim"}</h1>
 <p className="text-white/70 text-sm mt-1 flex items-center gap-1.5 justify-center">
 <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
 Çevrimiçi
 </p>
 </div>
 
 <div className="p-3 md:p-6 bg-[#e5ddd5] flex-1 flex flex-col justify-end min-h-[200px]">
 <div className="bg-white p-4 rounded-2xl rounded-tl-sm shadow-sm self-start max-w-[85%] relative mb-4">
 <p className="text-slate-800 text-[15px] leading-snug">{parsedConfig.welcomeMessage || "Merhaba, size nasıl yardımcı olabilirim?"}</p>
 </div>
 </div>
 
 <div className="p-4 bg-white border-t border-zinc-100">
 <a href={`https://wa.me/${parsedConfig.phoneNumber?.replace(/[^0-9]/g, '') || "905551234567"}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-3 w-full py-4 rounded-2xl bg-[#25d366] text-white font-bold text-lg hover:bg-[#1ebd5a] transition-colors shadow-lg shadow-[#25d366]/30">
 <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.711.928 3.144.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.066.376-.05c.101-.114.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.1.824zM20.056 3.96C17.898 1.802 15.029.61 12.01.61 5.753.61.66 5.703.658 11.963c0 1.996.52 3.945 1.509 5.666L.645 23.364l5.882-1.543c1.664.897 3.535 1.371 5.481 1.373 6.257 0 11.35-5.094 11.353-11.355.002-3.033-1.178-5.881-3.305-8.879z" /></svg>
 {parsedConfig.buttonText || "Sohbete Başla"}
 </a>
 </div>
 </div>
 </div>
 );
 }

  // Custom layout check for new Audio / Testimonial / Portfolio / Countdown addons
  if (
    matchingAddon.addonType === "RETRO_CASSETTE" ||
    matchingAddon.addonType === "MINIMAL_DARK_AUDIO" ||
    matchingAddon.addonType === "VINTAGE_RADIO" ||
    matchingAddon.addonType === "FUTURE_WAVE" ||
    matchingAddon.addonType === "CINEMATIC_THEATER" ||
    matchingAddon.addonType === "SPOTIFY_CLASSIC" ||
    matchingAddon.addonType === "VINYL_RETRO" ||
    matchingAddon.addonType === "GLASS_AUDIO" ||
    matchingAddon.addonType === "NEON_CYBERPUNK" ||
    matchingAddon.addonType === "MINIMAL_LIGHT_AUDIO" ||
    matchingAddon.addonType === "MUSIC_PODCAST" ||
    matchingAddon.addonType === "PORTFOLIO_GALLERY" ||
    matchingAddon.addonType === "COUNTDOWN_LAUNCH" ||
    matchingAddon.addonType === "TESTIMONIALS"
  ) {
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
            <PlayableAddon
              type={type}
              avatarUrl={displayAvatar}
              username={displayUsername}
              bio={displayBio}
              title={displayTitle}
              desc={displayDesc}
              config={parsedConfig}
            />
          </div>

          {/* Direct Buy Section */}
          <div className="w-full bg-zinc-900 p-6 border-t border-zinc-800 text-center flex flex-col gap-3">
            <a
              href={`/@${user.username}`}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-neon-blue to-light-blue text-white text-sm font-extrabold tracking-wide shadow-lg shadow-neon-blue/15 hover:opacity-95 transition-all text-center block"
            >
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
}
