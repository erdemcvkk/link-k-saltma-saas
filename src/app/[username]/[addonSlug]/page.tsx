import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import StorefrontPreview from "@/components/storefront-preview";
import { Store, Music, Image, Clock, MessageCircle } from "lucide-react";
import { Metadata } from "next";

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
   matchingAddon.addonType === "CORP_EXEC" ||
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
 <div className="w-full min-h-screen bg-black flex justify-center p-4">
 <div className="w-full max-w-2xl bg-black rounded-[2rem] shadow-2xl flex flex-col items-center">
 
 {/* 16:9 Media Player Area */}
 <div className="w-full aspect-video rounded-3xl bg-zinc-900 mt-8 relative shadow-[0_0_50px_rgba(255,255,255,0.05)] overflow-hidden group border border-white/5">
 {/* Cover Image */}
 <div 
 className="absolute inset-0 bg-cover bg-center opacity-80 group-hover:scale-105 transition-transform duration-700" 
 style={{ backgroundImage: `url('${parsedConfig.coverUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&q=80'}')` }}
 />
 
 {/* Gradient Overlay for Text Readability if needed */}
 <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

 {/* Glassmorphism Play Button */}
 <a 
 href={parsedConfig.videoUrl || "#"} 
 target="_blank" 
 rel="noopener noreferrer"
 className="absolute inset-0 flex items-center justify-center z-10"
 >
 <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white shadow-[0_8px_32px_rgba(0,0,0,0.4)] hover:bg-white/30 hover:scale-110 transition-all cursor-pointer">
 <span className="text-xl md:text-3xl sm:text-4xl ml-2">▶</span>
 </div>
 </a>
 </div>
 
 {/* Text Content */}
 <div className="flex flex-col mt-8 w-full px-4 text-center">
 <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-3">
 {parsedConfig.title || "UI/UX Masterclass Bölüm 1"}
 </h1>
 <p className="text-zinc-400 text-sm sm:text-base leading-relaxed max-w-lg mx-auto mb-10">
 {parsedConfig.description || "Tasarım sistemleri ve ileri düzey prototipleme tekniklerini keşfedin."}
 </p>
 
 <a 
 href={parsedConfig.actionUrl || "#"}
 target="_blank"
 rel="noopener noreferrer"
 className="w-full max-w-sm mx-auto py-5 rounded-2xl bg-white text-black font-extrabold text-lg hover:bg-zinc-200 transition-colors shadow-[0_0_30px_rgba(255,255,255,0.2)]"
 >
 {parsedConfig.buttonText || "Tamamını İzle"}
 </a>
 </div>

 </div>
 </div>
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
 <span className="text-[10px] text-slate-400 block text-right mt-1.5">Şimdi</span>
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
              {renderAddonInnerContent(type, displayAvatar, displayUsername, displayBio, displayTitle, displayDesc, parsedConfig)}
            </div>
            
            {/* Direct Buy Section */}
            <div className="w-full bg-zinc-900 p-6 border-t border-zinc-800 text-center flex flex-col gap-3">
              <a href={`/@${user.username}`} className="w-full py-4 rounded-2xl bg-gradient-to-r from-neon-blue to-light-blue text-white text-sm font-extrabold tracking-wide shadow-lg shadow-neon-blue/15 hover:opacity-95 transition-all text-center block">
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


function getMediaEmbed(url: string, accentColor?: string) {
  if (!url) return null;
  const trimmed = url.trim();
  
  // Spotify track/album/playlist/episode
  const spotifyMatch = trimmed.match(/open\.spotify\.com\/(track|album|playlist|episode)\/([a-zA-Z0-9]+)/);
  if (spotifyMatch) {
    return (
      <div className="w-full rounded-xl overflow-hidden shadow-lg">
        <iframe
          src={"https://open.spotify.com/embed/" + spotifyMatch[1] + "/" + spotifyMatch[2] + "?utm_source=generator&theme=0"}
          width="100%"
          height={spotifyMatch[1] === "track" || spotifyMatch[1] === "episode" ? 152 : 352}
          frameBorder="0"
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
          className="rounded-xl"
        />  
      </div>
    );
  }
  
  // YouTube
  const ytMatch = trimmed.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/);
  if (ytMatch) {
    return (
      <div className="w-full aspect-video rounded-xl overflow-hidden shadow-lg">
        <iframe
          src={"https://www.youtube.com/embed/" + ytMatch[1]}
          width="100%"
          height="100%"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="rounded-xl"
        />
      </div>
    );
  }
  
  // SoundCloud
  if (trimmed.includes("soundcloud.com/")) {
    const encodedUrl = encodeURIComponent(trimmed);
    return (
      <div className="w-full rounded-xl overflow-hidden shadow-lg">
        <iframe
          width="100%"
          height={166}
          scrolling="no"
          frameBorder="0"
          allow="autoplay"
          src={"https://w.soundcloud.com/player/?url=" + encodedUrl + "&color=" + (accentColor ? accentColor.replace("#", "%23") : "%23ff5500") + "&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false"}
          className="rounded-xl"
        />
      </div>
    );
  }
  
  // Apple Music
  const appleMusicMatch = trimmed.match(/music\.apple\.com\/([a-z]{2})\/(?:album|playlist)\/[^/]+\/([a-zA-Z0-9.]+)/);
  if (appleMusicMatch) {
    return (
      <div className="w-full rounded-xl overflow-hidden shadow-lg">
        <iframe
          allow="autoplay *; encrypted-media *; fullscreen *; clipboard-write"
          frameBorder="0"
          height={175}
          width="100%"
          sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-storage-access-by-user-activation allow-top-navigation-by-user-activation"
          src={"https://embed.music.apple.com/" + appleMusicMatch[1] + "/album/" + appleMusicMatch[2]}
          className="rounded-xl"
        />
      </div>
    );
  }
  
  // Direct audio file (.mp3, .wav, .ogg, .m4a, .aac, .flac)
  if (/\.(mp3|wav|ogg|m4a|aac|flac)(\?.*)?$/i.test(trimmed)) {
    return (
      <div className="w-full">
        <audio controls className="w-full rounded-lg" style={{ accentColor: accentColor || "#1db954" }}>
          <source src={trimmed} />
          Tarayıcınız ses oynatmayı desteklemiyor.
        </audio>
      </div>
    );
  }
  
  // Direct video file (.mp4, .webm, .mov)
  if (/\.(mp4|webm|mov)(\?.*)?$/i.test(trimmed)) {
    return (
      <div className="w-full aspect-video rounded-xl overflow-hidden shadow-lg">
        <video controls className="w-full h-full object-cover rounded-xl">
          <source src={trimmed} />
          Tarayıcınız video oynatmayı desteklemiyor.
        </video>
      </div>
    );
  }
  
  // Fallback: return null (will show the static mockup)
  return null;
}

function renderAddonInnerContent(type: string, avatarUrl: string, username: string, bio: string, title: string, desc: string, config: any = {}) {
  const mediaEmbed = getMediaEmbed(config.trackUrl, config.accentColor);
  
  switch (type) {
    case "SPOTIFY_CLASSIC":
      return (
        <div className="w-full h-full bg-zinc-950 flex flex-col p-6 text-white relative z-0">
          <div className="flex flex-col items-center mt-8 mb-6">
            <div className="w-20 h-20 bg-zinc-850 rounded-xl overflow-hidden border border-zinc-800 shadow-xl">
              <img src={config.albumCoverUrl || avatarUrl || "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=200&q=80"} className="w-full h-full object-cover" />
            </div>
            <span className="text-sm font-bold mt-3 text-white">{username}</span>
            <p className="text-xs text-green-500 font-bold mt-1">{bio}</p>
          </div>
          
          {mediaEmbed ? (
            <div className="space-y-4">
              <div className="text-center mb-2">
                <h4 className="text-sm font-bold text-white">{config.trackName || title}</h4>
                <p className="text-[10px] text-zinc-400 mt-1">{config.artistName || desc}</p>
              </div>
              {mediaEmbed}
            </div>
          ) : (
            <div className="bg-zinc-900 rounded-2xl p-5 border border-zinc-800 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white">{config.trackName || title}</h4>
                  <p className="text-[10px] text-zinc-400">{config.artistName || desc}</p>
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
                  <span>0:00</span>
                  <span>{config.trackDuration || "3:45"}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      );
    case "VINYL_RETRO":
      return (
        <div className="w-full h-full bg-stone-900 flex flex-col p-6 text-orange-400 relative z-0">
          <div className="flex flex-col items-center mt-8 mb-4">
            <span className="text-sm font-bold text-stone-200">{username}</span>
            <p className="text-xs text-orange-400/70 mt-1">{bio}</p>
          </div>
          
          {!mediaEmbed && (
            <div className="flex justify-center my-4">
              <div className="w-28 h-28 rounded-full bg-zinc-950 border-4 border-black flex items-center justify-center relative shadow-2xl animate-[spin_6s_linear_infinite]">
                <div className="absolute inset-2 rounded-full border border-stone-850"></div>
                <div className="absolute inset-5 rounded-full border border-stone-850"></div>
                <div className="w-10 h-10 rounded-full bg-orange-400 flex items-center justify-center p-0.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-stone-900"></div>
                </div>
              </div>
            </div>
          )}
          
          <div className="bg-stone-950/85 rounded-2xl p-4 border border-stone-800 text-center space-y-3 mt-auto">
            <h4 className="text-xs font-bold text-stone-300">{config.trackName || title}</h4>
            <p className="text-[10px] text-stone-500">{config.artistName || desc}</p>
            {mediaEmbed ? mediaEmbed : (
              <div className="flex items-center justify-center gap-6 text-orange-400">
                <span className="text-sm cursor-pointer">⏮</span>
                <button className="w-10 h-10 rounded-full bg-orange-400 flex items-center justify-center text-stone-900 border-0 cursor-pointer">
                  <span className="text-xs ml-0.5">▶</span>
                </button>
                <span className="text-sm cursor-pointer">⏭</span>
              </div>
            )}
          </div>
        </div>
      );
    case "GLASS_AUDIO":
      return (
        <div className="w-full h-full bg-gradient-to-br from-indigo-400 to-purple-400 flex flex-col p-6 text-white relative z-0">
          <div className="flex flex-col items-center mt-8 mb-6">
            <div className="w-16 h-16 bg-white/20 rounded-full overflow-hidden border border-white/20 shadow-lg">
              <img src={config.albumCoverUrl || avatarUrl || "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=200&q=80"} className="w-full h-full object-cover" />
            </div>
            <span className="text-sm font-bold mt-3 text-white">{username}</span>
          </div>
          
          <div className="bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl p-4 mt-2 space-y-4 shadow-xl">
            <div className="text-center">
              <h4 className="text-sm font-extrabold text-white">{config.trackName || title}</h4>
              <p className="text-[10px] text-purple-100/80 mt-1">{config.artistName || desc}</p>
            </div>
            {mediaEmbed ? mediaEmbed : (
              <div className="flex items-center justify-center gap-6 text-white pt-2">
                <span className="text-sm cursor-pointer">⏮</span>
                <button className="w-11 h-11 rounded-full bg-white text-purple-600 flex items-center justify-center border-0 shadow-lg cursor-pointer">
                  <span className="text-sm ml-0.5">▶</span>
                </button>
                <span className="text-sm cursor-pointer">⏭</span>
              </div>
            )}
          </div>
        </div>
      );
    case "NEON_CYBERPUNK":
      return (
        <div className="w-full h-full bg-black flex flex-col p-6 text-white relative z-0">
          <div className="flex flex-col items-center mt-8 mb-6">
            <div className="w-20 h-20 bg-zinc-900 rounded-none overflow-hidden border border-pink-500 shadow-[0_0_12px_rgba(236,72,153,0.5)]">
              <img src={config.albumCoverUrl || avatarUrl || "https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?w=200&q=80"} className="w-full h-full object-cover" />
            </div>
            <span className="text-xs font-black mt-3 uppercase tracking-widest text-pink-500">{username}</span>
          </div>
          
          <div className="bg-black border border-pink-500 shadow-[0_0_20px_rgba(236,72,153,0.6)] rounded-none p-4 mt-2 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-black uppercase tracking-widest text-cyan-400">{config.trackName || title}</h4>
                <p className="text-[9px] text-pink-400 uppercase mt-1">{config.artistName || desc}</p>
              </div>
              {!mediaEmbed && (
                <button className="w-10 h-10 rounded-none bg-pink-500 flex items-center justify-center text-black border-0 shadow-[0_0_12px_rgba(236,72,153,0.8)] cursor-pointer shrink-0">
                  <span className="text-xs">▶</span>
                </button>
              )}
            </div>
            {mediaEmbed ? mediaEmbed : (
              <div className="w-full h-0.5 bg-zinc-900 relative">
                <div className="absolute left-0 top-0 w-2/3 h-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]"></div>
              </div>
            )}
          </div>
        </div>
      );
    case "MINIMAL_LIGHT_AUDIO":
      return (
        <div className="w-full h-full bg-slate-50 flex flex-col p-6 text-slate-800 relative z-0">
          <div className="flex flex-col items-center mt-8 mb-6">
            <div className="w-20 h-20 bg-white rounded-xl overflow-hidden border border-slate-200 shadow-sm">
              <img src={config.albumCoverUrl || avatarUrl || "https://images.unsplash.com/photo-1516280440503-66f837ce5b97?w=200&q=80"} className="w-full h-full object-cover" />
            </div>
            <span className="text-sm font-bold mt-3 text-slate-800">{username}</span>
            <p className="text-xs text-slate-500 mt-1">{bio}</p>
          </div>
          
          <div className="bg-white shadow-sm border border-slate-150 rounded-xl p-4 mt-2 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-semibold text-slate-800">{config.trackName || title}</h4>
                <p className="text-[10px] text-slate-500 mt-1">{config.artistName || desc}</p>
              </div>
              {!mediaEmbed && (
                <button className="w-10 h-10 rounded-full bg-slate-800 text-white flex items-center justify-center border-0 shadow-sm cursor-pointer shrink-0">
                  <span className="text-sm ml-0.5">▶</span>
                </button>
              )}
            </div>
            {mediaEmbed ? mediaEmbed : (
              <div className="w-full h-0.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="w-1/2 h-full bg-slate-400 rounded-full"></div>
              </div>
            )}
          </div>
        </div>
      );
    case "MUSIC_PODCAST":
      return (
        <div className="w-full h-full bg-gradient-to-br from-purple-900 to-indigo-950 flex flex-col p-6 text-white relative z-0">
          <div className="flex flex-col items-center mt-8 mb-6">
            <div className="w-20 h-20 bg-zinc-800 rounded-t-full rounded-b-xl overflow-hidden border border-purple-500/30">
              <img src={config.albumCoverUrl || avatarUrl || "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=200&q=80"} className="w-full h-full object-cover" />
            </div>
            <span className="text-sm font-bold mt-3 text-purple-300">{username}</span>
            <p className="text-xs text-purple-200/60 mt-1">{bio}</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 mt-2 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-white">{config.trackName || title}</h4>
                <p className="text-xs text-purple-300 mt-1">{config.artistName || desc}</p>
              </div>
              {!mediaEmbed && (
                <button className="w-12 h-12 rounded-full bg-pink-500 flex items-center justify-center text-white border-0 shadow-[0_0_15px_rgba(236,72,153,0.5)] cursor-pointer shrink-0">
                  <span className="text-sm ml-0.5">▶</span>
                </button>
              )}
            </div>
            
            {mediaEmbed ? mediaEmbed : (
              <div className="flex items-end gap-1.5 justify-center h-10 pt-2">
                <div className="w-1.5 bg-pink-500 h-4 rounded-full animate-pulse"></div>
                <div className="w-1.5 bg-pink-500 h-8 rounded-full animate-pulse" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-1.5 bg-pink-500 h-5 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-1.5 bg-pink-500 h-10 rounded-full animate-pulse" style={{ animationDelay: '0.3s' }}></div>
                <div className="w-1.5 bg-pink-500 h-7 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                <div className="w-1.5 bg-pink-500 h-9 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                <div className="w-1.5 bg-pink-500 h-4 rounded-full animate-pulse" style={{ animationDelay: '0.6s' }}></div>
              </div>
            )}
          </div>
        </div>
      );
    case "PORTFOLIO_GALLERY":
      return (
        <div className="w-full h-full bg-slate-50 flex flex-col p-6 text-slate-800 relative z-0">
          <div className="flex flex-col items-center mt-8 mb-6">
            <div className="w-20 h-20 bg-zinc-200 rounded-none border border-slate-300 overflow-hidden">
              <img src={avatarUrl || "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&q=80"} className="w-full h-full object-cover" />
            </div>
            <span className="text-sm font-bold mt-3 text-slate-700">{username}</span>
            <p className="text-xs text-slate-500 mt-1">{bio}</p>
          </div>
          
          <h3 className="text-sm font-bold text-slate-800 mb-3 px-1">{title}</h3>
          <p className="text-xs text-slate-500 mb-4 px-1">{desc}</p>
          
          <div className="grid grid-cols-2 gap-3 mt-2">
            <div className="aspect-square bg-white/60 backdrop-blur-md border border-slate-200/50 rounded-xl p-1.5 overflow-hidden shadow-sm">
              <img src={config.galleryImage1 || "https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=200&q=80"} className="w-full h-full object-cover rounded-lg" />
            </div>
            <div className="aspect-square bg-white/60 backdrop-blur-md border border-slate-200/50 rounded-xl p-1.5 overflow-hidden shadow-sm">
              <img src={config.galleryImage2 || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&q=80"} className="w-full h-full object-cover rounded-lg" />
            </div>
            <div className="aspect-square bg-white/60 backdrop-blur-md border border-slate-200/50 rounded-xl p-1.5 overflow-hidden shadow-sm">
              <img src={config.galleryImage3 || "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=200&q=80"} className="w-full h-full object-cover rounded-lg" />
            </div>
            <div className="aspect-square bg-white/60 backdrop-blur-md border border-slate-200/50 rounded-xl p-1.5 overflow-hidden shadow-sm">
              <img src={config.galleryImage4 || "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=200&q=80"} className="w-full h-full object-cover rounded-lg" />
            </div>
          </div>
          
          {(config.behanceUrl || config.dribbbleUrl || config.websiteUrl) && (
            <div className="flex items-center justify-center gap-3 mt-6">
              {config.behanceUrl && <a href={config.behanceUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-slate-500 hover:text-slate-800 underline">Behance</a>}
              {config.dribbbleUrl && <a href={config.dribbbleUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-slate-500 hover:text-slate-800 underline">Dribbble</a>}
              {config.websiteUrl && <a href={config.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-slate-500 hover:text-slate-800 underline">Website</a>}
            </div>
          )}
        </div>
      );
    case "COUNTDOWN_LAUNCH":
      {
        const now = new Date();
        const target = config.targetDate ? new Date(config.targetDate) : new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000 + 14 * 60 * 60 * 1000 + 59 * 60 * 1000);
        const diff = Math.max(0, target.getTime() - now.getTime());
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        const pad = (n: number) => n.toString().padStart(2, '0');
      return (
        <div className="w-full h-full bg-orange-500 flex flex-col p-6 text-black relative z-0">
          <div className="flex flex-col items-center mt-8 mb-6">
            <div className="w-20 h-20 bg-zinc-950 rounded-tl-3xl rounded-br-3xl overflow-hidden border border-black/20">
              <img src={avatarUrl || "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=200&q=80"} className="w-full h-full object-cover" />
            </div>
            <span className="text-sm font-black mt-3 uppercase tracking-wide">{username}</span>
            <p className="text-xs text-zinc-900/75 font-semibold mt-1">{bio}</p>
          </div>
          
          <div className="bg-black text-white rounded-3xl p-5 mt-2 border border-black/10 text-center space-y-4 shadow-lg">
            <h4 className="text-xs font-black uppercase tracking-widest text-orange-500">{title}</h4>
            <p className="text-[10px] text-zinc-400">{desc}</p>
            <div className="flex items-center justify-center gap-2">
              {days > 0 && (<>
                <div className="bg-zinc-900 px-3 py-2 rounded-xl border border-zinc-800">
                  <span className="text-base font-black font-mono text-white">{pad(days)}</span>
                  <span className="block text-[8px] text-zinc-500 mt-0.5">GÜN</span>
                </div>
                <span className="text-zinc-600 font-bold">:</span>
              </>)}
              <div className="bg-zinc-900 px-3 py-2 rounded-xl border border-zinc-800">
                <span className="text-base font-black font-mono text-white">{pad(hours)}</span>
                <span className="block text-[8px] text-zinc-500 mt-0.5">SAAT</span>
              </div>
              <span className="text-zinc-600 font-bold">:</span>
              <div className="bg-zinc-900 px-3 py-2 rounded-xl border border-zinc-800">
                <span className="text-base font-black font-mono text-white">{pad(minutes)}</span>
                <span className="block text-[8px] text-zinc-500 mt-0.5">DAK</span>
              </div>
              <span className="text-zinc-600 font-bold">:</span>
              <div className="bg-zinc-900 px-3 py-2 rounded-xl border border-zinc-800">
                <span className="text-base font-black font-mono text-white">{pad(seconds)}</span>
                <span className="block text-[8px] text-zinc-500 mt-0.5">SN</span>
              </div>
            </div>
            {config.buttonUrl && config.buttonText && (
              <a href={config.buttonUrl} target="_blank" rel="noopener noreferrer" className="inline-block mt-2 px-6 py-2.5 bg-orange-500 text-black text-xs font-black uppercase tracking-wider rounded-full hover:bg-orange-400 transition-colors">{config.buttonText}</a>
            )}
          </div>
        </div>
      );
      }
    case "TESTIMONIALS":
      {
        const testimonials = config.testimonials && config.testimonials.length > 0 ? config.testimonials : [{ name: "Elif Y.", text: desc, rating: 5, avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80" }];
      return (
        <div className="w-full h-full bg-teal-50 flex flex-col p-6 text-zinc-800 relative z-0">
          <div className="flex flex-col items-center mt-8 mb-6">
            <div className="w-20 h-20 bg-zinc-200 rounded-2xl overflow-hidden border border-teal-200">
              <img src={avatarUrl || "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&q=80"} className="w-full h-full object-cover" />
            </div>
            <span className="text-sm font-bold mt-3 text-teal-800">{username}</span>
            <p className="text-xs text-teal-600 mt-1">{bio}</p>
          </div>
          
          <div className="space-y-3">
            {testimonials.map((t: any, idx: number) => (
              <div key={idx} className="bg-white rounded-2xl p-5 border border-zinc-100 shadow-sm space-y-3">
                <div className="flex gap-0.5 text-yellow-400 text-sm">
                  {[1,2,3,4,5].map((s) => <span key={s} className={s <= (t.rating || 5) ? "text-yellow-400" : "text-zinc-200"}>★</span>)}
                </div>
                <p className="text-[11px] text-zinc-600 italic leading-relaxed">"{t.text || "Harika bir hizmet!"}"</p>
                <div className="flex items-center gap-2 pt-1 border-t border-zinc-100">
                  <div className="w-6 h-6 rounded-full bg-zinc-300 overflow-hidden">
                    {t.avatarUrl ? <img src={t.avatarUrl} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-teal-200"></div>}
                  </div>
                  <span className="text-[10px] font-bold text-zinc-700">{t.name || "Anonim"}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
      }
    default:
      return null;
  }
}
