"use client";

import React from "react";
import { Laptop, Zap, Clock, Store, Music, Image, MessageCircle, Calendar } from "lucide-react";
import UniversalProfile, { UniversalProfileData } from "@/components/universal-profile";
import StorefrontPreview from "@/components/storefront-preview";
import PlayableAddon from "@/components/addons/playable-addon";

interface PhonePreviewProps {
  mode: "editor" | "template" | "plugin";
  data: UniversalProfileData;
  label?: string;
  activeAddonId?: string;
}

export default function PhonePreview({ mode, data, label, activeAddonId }: PhonePreviewProps) {
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
    // Eklentilerim sayfasındaki aktif eklentiyi bul
    const activeAddon = (activeAddonId ? data.addons?.find((a: any) => a.id === activeAddonId) : null)
      || data.addons?.find((a: any) => a.isActive)
      || data.addons?.[0];
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
    if (["MINI_STORE", "NEO_BRUTAL", "ORGANIC", "RETRO", "ACADEMIA", "Y2K", "PREMIUM_CREATOR", "WEB3_NFT", "EDITORIAL_LUX", "GAMER_HUB", "COMIC_MANGA"].includes(type)) {
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

    // 1.5 Kurumsal Yönetici Kartı
    if (type === "CORP_EXEC") {
      return (
        <div className="w-full h-full bg-slate-50 flex flex-col relative z-0 text-slate-800 overflow-hidden">
          {/* Cover Header */}
          <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-950 h-24 w-full flex flex-col justify-end p-3 relative shrink-0">
            {parsedConfig.storeCoverUrl && (
              <img src={parsedConfig.storeCoverUrl} className="absolute inset-0 w-full h-full object-cover opacity-65" />
            )}
            <div className="absolute top-2 right-2 px-1.5 py-0.5 bg-blue-600 text-[7px] font-bold text-white rounded tracking-wide shadow-sm uppercase">PRO</div>
          </div>
          
          {/* Profile details */}
          <div className="flex flex-col items-center -mt-8 px-4 mb-3 relative z-10 shrink-0">
            <div className="w-16 h-16 bg-white rounded-full border-2 border-white overflow-hidden shadow-md">
              <img src={parsedConfig.storeAvatarUrl || data.avatarUrl || "/placeholder.png"} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder.png" }} />
            </div>
            <span className="text-[11px] font-extrabold mt-1 text-slate-800">{parsedConfig.storeUsername || ("@" + data.username)}</span>
            <p className="text-[8.5px] text-slate-500 font-bold tracking-tight mt-0.5">{parsedConfig.storeBio || data.bio || "C-Level Executive Consultant"}</p>
          </div>
          
          {/* Main Card */}
          <div className="bg-white shadow-lg rounded-2xl p-4 mx-4 mt-1 border border-slate-100 space-y-3">
            <div className="text-center">
              <h4 className="text-[11px] font-extrabold text-slate-800 tracking-tight leading-snug">{parsedConfig.title || "Q3 Executive Briefing"}</h4>
              <p className="text-[9px] text-slate-400 font-medium mt-1 leading-normal">{parsedConfig.description || "Corporate & Strategy"}</p>
            </div>
            
            <button className="w-full py-2 bg-blue-600 text-white font-bold text-[9px] rounded-lg tracking-wide border-0 cursor-pointer shadow-sm shadow-blue-500/10">
              {parsedConfig.buttonText || "Schedule Consultation"}
            </button>
          </div>
        </div>
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

    // 4. Premium Video / Audio / Portfolio / Countdown / Testimonials Addons
    if (["PREMIUM_VIDEO", "SPOTIFY_CLASSIC", "VINYL_RETRO", "GLASS_AUDIO", "NEON_CYBERPUNK", "MINIMAL_LIGHT_AUDIO", "MUSIC_PODCAST", "PORTFOLIO_GALLERY", "COUNTDOWN_LAUNCH", "TESTIMONIALS", "RETRO_CASSETTE", "MINIMAL_DARK_AUDIO", "VINTAGE_RADIO", "FUTURE_WAVE", "CINEMATIC_THEATER"].includes(type)) {
      const displayAvatar = parsedConfig.avatarUrl || data.avatarUrl || "";
      const displayUsername = parsedConfig.username || ("@" + data.username);
      const displayBio = parsedConfig.bio || data.bio || "";
      const displayTitle = parsedConfig.title || (type === "RETRO_CASSETTE" ? "Retro Kaset Çalar" : type === "MINIMAL_DARK_AUDIO" ? "Minimalist Dark Player" : type === "VINTAGE_RADIO" ? "Antika Radyo Oynatıcı" : type === "FUTURE_WAVE" ? "Future Synthwave Video" : type === "CINEMATIC_THEATER" ? "Sinematik Tiyatro Video" : type === "SPOTIFY_CLASSIC" ? "Classic Spotify Player" : type === "VINYL_RETRO" ? "Retro Plak Çalar" : type === "GLASS_AUDIO" ? "Modern Cam Efekti" : type === "NEON_CYBERPUNK" ? "Neon Cyberpunk Player" : type === "MINIMAL_LIGHT_AUDIO" ? "Minimalist Light Player" : type === "MUSIC_PODCAST" ? "Müzik & Podcast Çalar" : type === "PORTFOLIO_GALLERY" ? "Portfolyo & Galeri" : type === "COUNTDOWN_LAUNCH" ? "Geri Sayım & Lansman" : type === "PREMIUM_VIDEO" ? "Premium Video" : "Müşteri Yorumları");
      const displayDesc = parsedConfig.description || (type === "RETRO_CASSETTE" ? "90'ların nostaljik dönen makaralı kaset tasarımı." : type === "MINIMAL_DARK_AUDIO" ? "Siyahın asil tonunda ultra modern tasarım." : type === "VINTAGE_RADIO" ? "Klasik ahşap radyo kadranı tasarımı." : type === "FUTURE_WAVE" ? "Neon pembe ve camgöbeği synthwave video tasarımı." : type === "CINEMATIC_THEATER" ? "Kırmızı kadife perdeli sinematik video tasarımı." : type === "SPOTIFY_CLASSIC" ? "Orijinal ve ikonik Spotify görünümü." : type === "VINYL_RETRO" ? "Nostaljik ruhu yaşatan, plak görünümlü oynatıcı." : type === "GLASS_AUDIO" ? "Albüm renklerine uyum sağlayan yarı saydam tasarım." : type === "NEON_CYBERPUNK" ? "Elektronik müzik ve synthwave tutkunları için." : type === "MINIMAL_LIGHT_AUDIO" ? "Ferah, aydınlık ve dikkat dağıtmayan net tasarım." : type === "MUSIC_PODCAST" ? "Beat'lerinizi ve podcast'lerinizi doğrudan sayfanızda dinletin." : type === "PORTFOLIO_GALLERY" ? "Tasarımlarınızı ve fotoğraflarınızı şık bir ızgara (grid) yapısında sergileyin." : type === "COUNTDOWN_LAUNCH" ? "Yeni ürün veya içerikleriniz için heyecan yaratacak dinamik sayaç." : type === "PREMIUM_VIDEO" ? "Premium video derslerinizi ve içeriklerinizi sergileyin." : "Referanslarınızı ve 5 yıldızlı değerlendirmelerinizi öne çıkararak güven inşa edin.");

      return (
        <div className="w-full h-full bg-zinc-950 flex flex-col justify-between overflow-y-auto no-scrollbar">
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
          {label || (mode === "editor" ? "Canlı Telefon Önizlemesi" : mode === "template" ? "Şablon Önizlemesi" : "Eklenti Önizlemesi")}
        </span>
      </div>

      <div className="relative mx-auto rounded-[3rem] p-4 border-4 shadow-[0_0_50px_rgba(0,0,0,0.15)] overflow-hidden bg-white border-zinc-200">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-gray-50 rounded-b-xl z-20" />
        <div id="sandbox-preview" className="relative rounded-[2.5rem] aspect-[9/18] overflow-y-auto overflow-x-hidden bg-zinc-950 flex flex-col justify-between transition-all duration-300 w-full h-full pointer-events-auto p-0 border-0 scrollbar-none">
          <div className="pointer-events-none w-full flex-1 flex flex-col">
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
      </div>

      {/* Reklam Alanı Telefon Cihazının Altında Render Edilir */}
      {renderAdBlock()}
    </div>
  );
}

