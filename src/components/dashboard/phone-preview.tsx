"use client";

import React from "react";
import { Laptop, Zap, Clock, Store, Music, Image, MessageCircle, Calendar } from "lucide-react";
import UniversalProfile, { UniversalProfileData } from "@/components/universal-profile";
import StorefrontPreview from "@/components/storefront-preview";

interface PhonePreviewProps {
  mode: "editor" | "template" | "plugin";
  data: UniversalProfileData;
  label?: string;
}

export default function PhonePreview({ mode, data, label }: PhonePreviewProps) {
  const { theme = "dark", plan, systemSettings } = data;
  
  const isLight = [
    "Minimalist Light", "Pastel Dream", "Abstract Fluid", 
    "Vintage Paper", "Vintage Journal", "Holographic Glass", "Aura Hologram"
  ].includes(theme);

  const renderAdBlock = () => {
    if (plan !== "FREE") return null;
    if (!systemSettings || !systemSettings.isActive) return null;

    const handleUpgradeRedirect = (e: React.MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();
      window.location.href = "/dashboard/billing";
    };

    if (systemSettings.adScript) {
      return (
        <div className="mt-6 w-full flex justify-center overflow-hidden rounded-2xl border border-zinc-200 bg-white p-2 shadow-sm">
          <div dangerouslySetInnerHTML={{ __html: systemSettings.adScript }} />
        </div>
      );
    }

    if (systemSettings.customImageUrl) {
      return (
        <div className="mt-6 w-full flex flex-col rounded-3xl border border-zinc-200 bg-white overflow-hidden shadow-sm relative group">
          <div className="absolute top-2.5 right-3 flex items-center gap-1.5 z-20 bg-black/60 backdrop-blur-md px-1.5 py-0.5 rounded border border-white/10">
            <span 
              onClick={handleUpgradeRedirect}
              className="text-[8.5px] font-semibold text-zinc-300 hover:text-white cursor-pointer underline transition-colors"
            >
              Reklamı Kaldır
            </span>
            <span className="h-3 w-[1px] bg-zinc-500/20" />
            <span className="text-[7.5px] font-bold tracking-wider uppercase text-zinc-400">
              Ad
            </span>
          </div>
          <a 
            href={systemSettings.customTargetUrl || "/dashboard/billing"} 
            target="_blank" 
            rel="noopener noreferrer"
            className="block w-full overflow-hidden"
          >
            <img 
              src={systemSettings.customImageUrl} 
              alt="Sponsored Ad" 
              className="w-full h-auto object-cover max-h-32 transition-transform duration-300 group-hover:scale-105" 
            />
          </a>
        </div>
      );
    }

    return (
      <div className="mt-6 w-full flex flex-col rounded-3xl border border-zinc-200 bg-white p-4 shadow-sm relative overflow-hidden group">
        <div className="absolute top-2.5 right-3 flex items-center gap-1.5 z-20">
          <span 
            onClick={handleUpgradeRedirect}
            className="text-[8.5px] font-semibold text-zinc-500 hover:text-zinc-700 cursor-pointer underline transition-colors"
          >
            Reklamı Kaldır
          </span>
          <span className="h-3 w-[1px] bg-zinc-300/20" />
          <span className="text-[7.5px] font-bold tracking-wider uppercase bg-zinc-100 text-zinc-400 px-1 py-0.2 rounded border border-zinc-200">
            Ad
          </span>
        </div>
        <div className="flex items-start gap-3 mt-1 pr-16 text-left">
          <div className="h-9 w-9 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0 border border-teal-100">
            <Zap className="h-4.5 w-4.5 animate-pulse text-teal-500" />
          </div>
          <div className="space-y-0.5">
            <h4 className="font-extrabold text-xs tracking-tight text-zinc-800">
              Kendi Biyo Link Sayfanı Ücretsiz Oluştur!
            </h4>
            <p className="text-[10px] leading-snug text-zinc-500">
              Saniyeler içinde sosyal medya hesaplarını tek bir yerde topla ve analiz et.
            </p>
          </div>
        </div>
        <a 
          href="/dashboard/billing"
          className="mt-3 w-full block text-center py-2 bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-[10px] rounded-xl transition-colors shadow-sm"
        >
          Kayıt Ol / Pro'ya Yükselt
        </a>
      </div>
    );
  };

  const renderPluginPreview = () => {
    // Eklentilerim sayfasındaki aktif addon'u bul
    const activeAddon = data.addons?.[0];
    if (!activeAddon) {
      return (
        <UniversalProfile 
          data={data} 
          isCompactMode={true} 
          isDarkContext={!isLight}
          isDashboardPreview={true}
        />
      );
    }

    let parsedConfig: any = {};
    if (activeAddon.settings) {
      parsedConfig = typeof activeAddon.settings === "string" ? JSON.parse(activeAddon.settings) : activeAddon.settings;
    }

    const type = activeAddon.addonType;

    // 1. Storefront Addons (Magaza)
    if (["MINI_STORE", "NEO_BRUTAL", "ORGANIC", "RETRO", "ACADEMIA", "Y2K", "PREMIUM_CREATOR", "WEB3_NFT", "EDITORIAL_LUX", "GAMER_HUB", "CORP_EXEC", "COMIC_MANGA"].includes(type)) {
      const getDefaultTheme = (t: string) => {
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
      };

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
        : (data.products || []).map((p: any) => ({
            id: p.id,
            title: p.title,
            type: p.type,
            price: p.price.toString(),
            imageUrl: p.imageUrl || p.fileUrl,
            description: p.description || "",
            buyLink: ""
          }));

      return (
        <StorefrontPreview 
          theme={parsedConfig.theme || getDefaultTheme(type)} 
          onProductClick={undefined}
          products={displayProducts} 
          storeTitle={parsedConfig.storeTitle || data.username || "Mağazam"}
          storeCoverUrl={parsedConfig.storeCoverUrl || data.background || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1000&q=80"}
          avatarUrl={parsedConfig.storeAvatarUrl || data.avatarUrl}
          username={parsedConfig.storeUsername || ("@" + data.username)}
          bio={parsedConfig.storeBio || data.bio}
          buyButtonText={parsedConfig.buyButtonText || "Satın Al"}
        />
      );
    }

    // 2. Booking Addon
    if (type === "BOOKING") {
      return (
        <div className="w-full h-full bg-slate-50 flex items-center justify-center p-4">
          <div className="w-full bg-white p-4 rounded-3xl shadow-md flex flex-col items-center text-center">
            {parsedConfig.avatarUrl ? (
              <img src={parsedConfig.avatarUrl} className="w-16 h-16 rounded-full object-cover shadow-sm mb-4" alt="Profile" />
            ) : (
              <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center mb-4 text-xl">
                📅
              </div>
            )}
            <h1 className="text-sm font-black text-slate-800 mb-1">{parsedConfig.title || "Görüşme Ayarla"}</h1>
            <p className="text-[10px] text-slate-500 mb-4">{parsedConfig.description || "Görüşme detayları."}</p>
            <button className="w-full py-2 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-colors shadow-sm">
              {parsedConfig.buttonText || "Takvimi Görüntüle"}
            </button>
          </div>
        </div>
      );
    }

    // 3. QA Addon
    if (type === "QA") {
      const qaPairs = parsedConfig.qaPairs || [];
      return (
        <div className="w-full h-full bg-amber-50/20 flex flex-col p-4 overflow-y-auto no-scrollbar">
          <div className="w-full bg-white p-4 rounded-3xl shadow-md flex flex-col">
            <div className="flex flex-col items-center text-center mb-4">
              {parsedConfig.avatarUrl ? (
                <img src={parsedConfig.avatarUrl} className="w-12 h-12 rounded-full object-cover shadow-sm mb-2" alt="Profile" />
              ) : (
                <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center mb-2 text-xl">
                  ❓
                </div>
              )}
              <h1 className="text-sm font-black text-slate-800">{parsedConfig.boxTitle || "Soru & Cevap (AMA)"}</h1>
            </div>
            {qaPairs.length > 0 ? (
              <div className="space-y-2 w-full">
                {qaPairs.map((p: any, idx: number) => (
                  <details key={idx} className="group border border-zinc-100 rounded-xl bg-zinc-50 p-2.5 [&_summary::-webkit-details-marker]:hidden">
                    <summary className="flex items-center justify-between cursor-pointer focus:outline-none">
                      <span className="text-[10px] font-bold text-slate-850 pr-3">{p.q || "Soru"}</span>
                      <span className="transition group-open:rotate-180 text-zinc-400 shrink-0">
                        <svg fill="none" height="16" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="16" className="h-3 w-3"><path d="M6 9l6 6 6-6"></path></svg>
                      </span>
                    </summary>
                    <p className="text-[9px] text-slate-600 mt-2 pl-0.5 leading-relaxed border-t border-zinc-200/60 pt-2 whitespace-pre-wrap">{p.a || "Cevap..."}</p>
                  </details>
                ))}
              </div>
            ) : (
              <p className="text-[10px] text-zinc-400 text-center py-4">
                Henüz soru ve cevap eklenmemiş.
              </p>
            )}
          </div>
        </div>
      );
    }

    // 3.5 Newsletter Addon
    if (type === "NEWSLETTER") {
      return (
        <div className="w-full h-full bg-emerald-50/20 flex items-center justify-center p-4">
          <div className="w-full bg-white p-4 rounded-3xl shadow-md flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center mb-3 text-xl">
              ✉️
            </div>
            <h1 className="text-sm font-black text-slate-800 mb-1">{parsedConfig.title || "Haftalık Bülten"}</h1>
            <p className="text-[10px] text-slate-500 mb-4">{parsedConfig.incentiveMsg || "Spam yok, sadece kaliteli içerik."}</p>
            <div className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-2 text-left text-[10px] text-zinc-400 mb-3">
              email@example.com
            </div>
            <button className="w-full py-2 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-colors shadow-sm">
              {parsedConfig.buttonText || "Abone Ol"}
            </button>
          </div>
        </div>
      );
    }

    // 4. Premium Video Addon
    if (type === "PREMIUM_VIDEO") {
      return (
        <div className="w-full h-full bg-black flex flex-col items-center justify-center p-4 text-center">
          <div className="w-full aspect-video rounded-2xl bg-zinc-900 relative overflow-hidden border border-white/5">
            <div 
              className="absolute inset-0 bg-cover bg-center opacity-80" 
              style={{ backgroundImage: `url('${parsedConfig.coverUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1000&q=80'}')` }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center text-white shadow-md">
                ▶
              </div>
            </div>
          </div>
          <h1 className="text-xs font-bold text-white mt-4 truncate w-full px-2">
            {parsedConfig.title || "UI/UX Masterclass"}
          </h1>
          <p className="text-[10px] text-zinc-400 mt-1 line-clamp-2 px-2">
            {parsedConfig.description || "Video açıklaması."}
          </p>
        </div>
      );
    }

    // 5. Donation Addon
    if (type === "DONATION") {
      return (
        <div className="w-full h-full bg-pink-50/20 flex items-center justify-center p-4">
          <div className="w-full bg-white p-4 rounded-3xl shadow-md flex flex-col items-center text-center">
            {parsedConfig.avatarUrl ? (
              <img src={parsedConfig.avatarUrl} className="w-16 h-16 rounded-full object-cover shadow-sm mb-4" alt="Profile" />
            ) : (
              <div className="w-16 h-16 rounded-full bg-pink-50 text-pink-500 flex items-center justify-center mb-4 text-xl">
                ☕
              </div>
            )}
            <h1 className="text-sm font-black text-slate-800 mb-1">{parsedConfig.title || "Destek Ol"}</h1>
            <p className="text-[10px] text-slate-500 mb-4">{parsedConfig.thankYouMsg || "Teşekkürler!"}</p>
            <button className="w-full py-2 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-colors shadow-sm">
              {parsedConfig.buttonText || "Destek Ol"}
            </button>
          </div>
        </div>
      );
    }

    // 6. Countdown Addon
    if (type === "COUNTDOWN") {
      return (
        <div className="w-full h-full bg-gradient-to-br from-indigo-950 via-slate-900 to-black flex items-center justify-center p-4">
          <div className="w-full bg-white/10 backdrop-blur-md border border-white/10 p-4 rounded-3xl shadow-md flex flex-col items-center text-center">
            <h1 className="text-xs font-black text-white tracking-tight mb-2">{parsedConfig.title || "Lansman"}</h1>
            <div className="grid grid-cols-4 gap-1.5 w-full mb-4">
              {['G', 'S', 'D', 'S'].map((lbl, idx) => (
                <div key={lbl} className="bg-black/30 border border-white/5 rounded-lg py-2 flex flex-col items-center">
                  <span className="text-xs font-black text-white font-mono">14</span>
                  <span className="text-[7px] text-indigo-300 font-bold">{lbl}</span>
                </div>
              ))}
            </div>
            <button className="w-full py-2 rounded-xl bg-indigo-500 text-white font-black text-xs hover:bg-indigo-400 transition-colors shadow-md">
              {parsedConfig.buttonText || "Git"}
            </button>
          </div>
        </div>
      );
    }

    // 7. Portfolio Addon
    if (type === "PORTFOLIO") {
      return (
        <div className="w-full h-full bg-zinc-100 flex flex-col items-center justify-center p-4">
          <div className="w-full bg-white p-4 rounded-3xl shadow-md text-center">
            {parsedConfig.avatarUrl ? (
              <img src={parsedConfig.avatarUrl} className="w-16 h-16 rounded-2xl object-cover shadow-sm mx-auto mb-4" alt="Profile" />
            ) : (
              <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-500 flex items-center justify-center mx-auto mb-4 text-xl">
                🎨
              </div>
            )}
            <h1 className="text-sm font-black text-slate-800 mb-1">{parsedConfig.title || "Çalışmalarım"}</h1>
            <p className="text-[10px] text-slate-500 mb-4">{parsedConfig.description}</p>
            <button className="w-full py-2 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-colors shadow-sm">
              {parsedConfig.buttonText || "Projeler"}
            </button>
          </div>
        </div>
      );
    }

    // 8. FAQ Addon
    if (type === "FAQ") {
      return (
        <div className="w-full h-full bg-emerald-50/10 flex flex-col items-center justify-center p-4">
          <div className="w-full bg-white p-4 rounded-3xl shadow-md">
            <h1 className="text-xs font-black text-slate-800 tracking-tight text-center mb-4">{parsedConfig.title || "S.S.S."}</h1>
            <div className="space-y-2 mb-4 max-h-[140px] overflow-y-auto no-scrollbar">
              <div className="bg-zinc-50 border border-zinc-100 rounded-xl p-2 text-left">
                <p className="text-[10px] font-bold text-slate-800">Örnek Soru?</p>
                <p className="text-[9px] text-slate-600 mt-0.5">Örnek cevap içeriği.</p>
              </div>
            </div>
            <button className="w-full py-2 rounded-xl bg-emerald-500 text-white font-bold text-xs hover:bg-emerald-600 transition-colors shadow-sm">
              {parsedConfig.buttonText || "İletişim"}
            </button>
          </div>
        </div>
      );
    }

    // 9. Map Addon
    if (type === "MAP") {
      return (
        <div className="w-full h-full bg-slate-100 flex flex-col items-center justify-center p-4 text-center">
          <div className="w-full bg-white rounded-3xl shadow-md overflow-hidden flex flex-col">
            <div className="h-24 bg-blue-100/50 flex flex-col items-center justify-center text-blue-500 text-sm font-bold">
              🗺️ Harita
            </div>
            <div className="p-4 flex flex-col items-center">
              <h1 className="text-xs font-black text-slate-800 mb-1">{parsedConfig.title || "Konum"}</h1>
              <p className="text-[9px] text-zinc-500 truncate w-full max-w-[200px] mb-4">{parsedConfig.address || "İstanbul, Türkiye"}</p>
              <button className="w-full py-2 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 transition-colors shadow-sm">
                {parsedConfig.buttonText || "Yol Tarifi"}
              </button>
            </div>
          </div>
        </div>
      );
    }

    // 10. WhatsApp Addon
    if (type === "WHATSAPP") {
      return (
        <div className="w-full h-full bg-[#ece5dd] flex items-center justify-center p-4">
          <div className="w-full bg-white rounded-3xl shadow-md overflow-hidden flex flex-col text-center">
            <div className="bg-[#075e54] p-3 text-white">
              <h1 className="text-xs font-bold">{parsedConfig.title || "WhatsApp İletişim"}</h1>
            </div>
            <div className="p-4 bg-[#e5ddd5] flex flex-col items-center">
              <div className="bg-white p-3 rounded-xl rounded-tl-sm text-left max-w-[90%] text-[11px] mb-4">
                {parsedConfig.welcomeMessage || "Merhaba, size nasıl yardımcı olabilirim?"}
              </div>
              <button className="w-full py-2 rounded-xl bg-[#25d366] text-white font-bold text-xs hover:bg-[#1ebd5a] transition-colors shadow-md flex items-center justify-center gap-1.5">
                {parsedConfig.buttonText || "Mesaj Gönder"}
              </button>
            </div>
          </div>
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
  };

  return (
    <div className="hidden lg:block w-full max-w-sm lg:w-[360px] shrink-0 sticky top-32 self-start">
      <div className="text-center mb-4">
        <span className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full border text-[10px] font-bold uppercase tracking-wider bg-white border-zinc-200 text-zinc-700 shadow-sm">
          <Laptop className="h-3 w-3" />
          {label || (mode === "editor" ? "Live Phone Sandbox" : mode === "template" ? "Template Preview" : "Add-on Sandbox")}
        </span>
      </div>

      <div className="relative mx-auto rounded-[3rem] p-4 border-4 shadow-[0_0_50px_rgba(0,0,0,0.15)] overflow-hidden bg-white border-zinc-200">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-gray-50 rounded-b-xl z-20" />
        <div id="sandbox-preview" className="relative rounded-[2.5rem] aspect-[9/18] overflow-y-auto overflow-x-hidden bg-zinc-950 flex flex-col justify-between transition-all duration-300 w-full h-full pointer-events-none p-0 border-0 scrollbar-none">
          {mode === "plugin" ? renderPluginPreview() : (
            <UniversalProfile 
              data={data} 
              isCompactMode={true} 
              isDarkContext={!isLight}
              isDashboardPreview={true}
            />
          )}
        </div>
      </div>

      {/* Reklam Alanı Telefon Cihazının Altında Render Edilir */}
      {renderAdBlock()}
    </div>
  );
}


function renderAddonInnerContent(type: string, avatarUrl: string, username: string, bio: string, title: string, desc: string, config: any = {}) {
  switch (type) {
    case "SPOTIFY_CLASSIC":
      return (
        <div className="w-full h-full bg-zinc-950 flex flex-col p-8 text-white relative z-0">
          <div className="flex flex-col items-center mt-12 mb-8">
            <div className="w-24 h-24 bg-zinc-850 rounded-xl overflow-hidden border border-zinc-800 shadow-xl">
              <img src={config.albumCoverUrl || avatarUrl || "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=200&q=80"} className="w-full h-full object-cover" />
            </div>
            <span className="text-sm font-bold mt-3 text-white">{username}</span>
            <p className="text-xs text-green-500 font-bold mt-1">{bio}</p>
          </div>
          
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
                <span>1:12</span>
                <span>{config.trackDuration || "3:45"}</span>
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
            <h4 className="text-xs font-bold text-stone-300">{config.trackName || title}</h4>
            <p className="text-[10px] text-stone-500">{config.artistName || desc}</p>
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
              <img src={config.albumCoverUrl || avatarUrl || "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=200&q=80"} className="w-full h-full object-cover" />
            </div>
            <span className="text-sm font-bold mt-3 text-white">{username}</span>
          </div>
          
          <div className="bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl p-5 mt-4 space-y-4 shadow-xl">
            <div className="text-center">
              <h4 className="text-sm font-extrabold text-white">{config.trackName || title}</h4>
              <p className="text-[10px] text-purple-100/80 mt-1">{config.artistName || desc}</p>
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
              <img src={config.albumCoverUrl || avatarUrl || "https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?w=200&q=80"} className="w-full h-full object-cover" />
            </div>
            <span className="text-xs font-black mt-3 uppercase tracking-widest text-pink-500">{username}</span>
          </div>
          
          <div className="bg-black border border-pink-500 shadow-[0_0_20px_rgba(236,72,153,0.6)] rounded-none p-5 mt-4 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-black uppercase tracking-widest text-cyan-400">{config.trackName || title}</h4>
                <p className="text-[9px] text-pink-400 uppercase mt-1">{config.artistName || desc}</p>
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
              <img src={config.albumCoverUrl || avatarUrl || "https://images.unsplash.com/photo-1516280440503-66f837ce5b97?w=200&q=80"} className="w-full h-full object-cover" />
            </div>
            <span className="text-sm font-bold mt-3 text-slate-800">{username}</span>
            <p className="text-xs text-slate-500 mt-1">{bio}</p>
          </div>
          
          <div className="bg-white shadow-sm border border-slate-150 rounded-xl p-5 mt-4 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-semibold text-slate-800">{config.trackName || title}</h4>
                <p className="text-[10px] text-slate-500 mt-1">{config.artistName || desc}</p>
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
              <img src={config.albumCoverUrl || avatarUrl || "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=200&q=80"} className="w-full h-full object-cover" />
            </div>
            <span className="text-sm font-bold mt-3 text-purple-300">{username}</span>
            <p className="text-xs text-purple-200/60 mt-1">{bio}</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/10 mt-4 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-white">{config.trackName || title}</h4>
                <p className="text-xs text-purple-300 mt-1">{config.artistName || desc}</p>
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
        <div className="w-full h-full bg-teal-50 flex flex-col p-8 text-zinc-800 relative z-0">
          <div className="flex flex-col items-center mt-12 mb-8">
            <div className="w-24 h-24 bg-zinc-200 rounded-2xl overflow-hidden border border-teal-200">
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
