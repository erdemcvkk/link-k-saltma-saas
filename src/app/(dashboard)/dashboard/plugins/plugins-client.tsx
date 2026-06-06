"use client";

import React, { useState, useEffect, useTransition, useMemo } from "react";
import { Puzzle, ShoppingBag, Settings, Globe, ExternalLink, Copy, Check, Trash2, Search, ArrowUpDown, ChevronDown } from "lucide-react";
import AddonConfigModal from "@/components/addons/addon-config-modal";
import PhonePreview from "@/components/dashboard/phone-preview";
import { parseButtonStyle } from "@/lib/parse-button-style";
import { useDashboard } from "../dashboard-context";
import { saveAddonConfig, removeUserAddonRelation } from "@/app/actions";

interface AddonItem {
  id: string;
  addonType: string;
  isActive: boolean;
  settings: any;
  createdAt: string;
}

interface ProductItem {
  id: string;
  title: string;
  type: string;
  price: number;
  description: string | null;
  fileUrl?: string;
  isActive: boolean;
  salesCount: number;
  createdAt: string;
}

interface PluginsClientProps {
  initialAddons: AddonItem[];
  initialProducts: ProductItem[];
  initialLinks?: any[];
  systemSettings?: {
    adScript?: string | null;
    customImageUrl?: string | null;
    customTargetUrl?: string | null;
    isActive: boolean;
  } | null;
}

export default function PluginsClient({
  initialAddons,
  initialProducts,
  initialLinks = [],
  systemSettings,
}: PluginsClientProps) {
  const { user, lang, activeTemplate, simulatedPlan, setSuccessMsg, setErrorMsg } = useDashboard();
  const [addons, setAddons] = useState<AddonItem[]>(initialAddons);
  const [activeAddonId, setActiveAddonId] = useState<string | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("default");

  const getAddonName = (type: string, lang: string) => {
    switch (type) {
      case "RETRO_CASSETTE": return lang === "tr" ? "Retro Kaset Çalar" : "Retro Cassette Player";
      case "MINIMAL_DARK_AUDIO": return lang === "tr" ? "Minimalist Dark Player" : "Minimalist Dark Player";
      case "VINTAGE_RADIO": return lang === "tr" ? "Antika Radyo Oynatıcı" : "Vintage Radio Player";
      case "FUTURE_WAVE": return lang === "tr" ? "Future Synthwave Video" : "Future Synthwave Video";
      case "CINEMATIC_THEATER": return lang === "tr" ? "Sinematik Tiyatro Video" : "Cinematic Theater Video";
      case "SPOTIFY_CLASSIC": return lang === "tr" ? "Classic Spotify Player" : "Classic Spotify Player";
      case "VINYL_RETRO": return lang === "tr" ? "Retro Plak Çalar" : "Retro Vinyl Player";
      case "GLASS_AUDIO": return lang === "tr" ? "Modern Cam Efekti" : "Modern Glass Effect";
      case "NEON_CYBERPUNK": return lang === "tr" ? "Neon Cyberpunk Player" : "Neon Cyberpunk Player";
      case "MINIMAL_LIGHT_AUDIO": return lang === "tr" ? "Minimalist Light Player" : "Minimalist Light Player";
      case "MUSIC_PODCAST": return lang === "tr" ? "Müzik & Podcast Çalar" : "Music & Podcast Player";
      case "PORTFOLIO_GALLERY": return lang === "tr" ? "Portfolyo & Galeri" : "Portfolio & Gallery";
      case "COUNTDOWN_LAUNCH": return lang === "tr" ? "Geri Sayım & Lansman" : "Countdown & Launch";
      case "PREMIUM_VIDEO": return lang === "tr" ? "Premium Video" : "Premium Video";
      case "TESTIMONIALS": return lang === "tr" ? "Müşteri Yorumları" : "Testimonials";
      case "FAQ": return lang === "tr" ? "Sıkça Sorulan Sorular" : "FAQ";
      case "WEB3_NFT": return lang === "tr" ? "Web3 NFT Vitrini" : "Web3 NFT Gallery";
      case "EDITORIAL_LUX": return lang === "tr" ? "Editoryal Vitrin" : "Editorial Showcase";
      case "GAMER_HUB": return lang === "tr" ? "Oyuncu Platformu" : "Gamer Hub";
      case "CORP_EXEC": return lang === "tr" ? "Kurumsal Yönetici Kartı" : "Corporate Executive Card";
      case "COMIC_MANGA": return lang === "tr" ? "Çizgi Roman & Manga" : "Comic & Manga";
      case "DONATION": return lang === "tr" ? "Dijital Kahve İkramı" : "Coffee Donation";
      case "MINI_STORE": return lang === "tr" ? "Mini Mağaza" : "Mini Store";
      case "NEO_BRUTAL": return lang === "tr" ? "Neo Brutalism Vitrin" : "Neo Brutalism Gallery";
      case "ORGANIC": return lang === "tr" ? "Doğal Tasarım Vitrin" : "Organic Showcase";
      case "RETRO": return lang === "tr" ? "Retro Arcade Vitrin" : "Retro Arcade Gallery";
      case "ACADEMIA": return lang === "tr" ? "Akademik Portfolyo" : "Academia Portfolio";
      case "Y2K": return lang === "tr" ? "Y2K Estetik Vitrin" : "Y2K Aesthetic Showcase";
      case "BOOKING": return lang === "tr" ? "Rezervasyon & Randevu" : "Booking & Appointment";
      case "NEWSLETTER": return lang === "tr" ? "Bülten Kaydı" : "Newsletter signup";
      case "QA": return lang === "tr" ? "Soru & Cevap" : "Q&A Module";
      case "PREMIUM_CREATOR": return lang === "tr" ? "Kreatör Mağazası" : "Premium Creator Store";
      default: return type;
    }
  };

  const sortedAddons = useMemo(() => {
    return [...addons]
      .filter((addon) => {
        const name = getAddonName(addon.addonType, lang);
        const matchesQuery = name.toLowerCase().includes(searchQuery.toLowerCase()) || 
          addon.addonType.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesQuery;
      })
      .sort((a, b) => {
        const nameA = getAddonName(a.addonType, lang);
        const nameB = getAddonName(b.addonType, lang);

        if (sortOption === "active-first") {
          if (a.isActive && !b.isActive) return -1;
          if (!a.isActive && b.isActive) return 1;
        } else if (sortOption === "name-asc") {
          return nameA.localeCompare(nameB);
        } else if (sortOption === "name-desc") {
          return nameB.localeCompare(nameA);
        } else if (sortOption === "date-desc") {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        } else if (sortOption === "date-asc") {
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        }
        
        // Default sort: active first, then alphabetical
        if (a.isActive && !b.isActive) return -1;
        if (!a.isActive && b.isActive) return 1;
        return nameA.localeCompare(nameB);
      });
  }, [addons, searchQuery, sortOption, lang]);

  const handleDeleteAddon = async (addonId: string) => {
    if (!confirm(lang === "tr" ? "Bu eklentiyi hesabınızdan silmek istediğinize emin misiniz? (Bu işlem sadece sizin hesabınızı etkiler, eklenti sistemden silinmez)" : "Are you sure you want to delete this addon from your account? (This only affects your account, the addon will not be deleted from the system)")) {
      return;
    }
    setErrorMsg("");
    setSuccessMsg("");
    startTransition(async () => {
      try {
        const res = await removeUserAddonRelation(addonId);
        if (res && res.success) {
          setAddons(prev => prev.filter(a => a.id !== addonId));
          setSuccessMsg(lang === "tr" ? "Eklenti hesabınızdan başarıyla silindi." : "Addon deleted from your account successfully.");
          setTimeout(() => {
            setSuccessMsg("");
            window.location.reload();
          }, 1000);
        } else {
          setErrorMsg(res.error || "Failed to delete addon");
        }
      } catch (err: any) {
        setErrorMsg(err.message || "Failed to delete addon");
      }
    });
  };
  const [editingAddon, setEditingAddon] = useState<AddonItem | null>(null);
  const [isPending, startTransition] = useTransition();
  const [origin, setOrigin] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setOrigin(window.location.origin);
      
      const savedActiveId = sessionStorage.getItem("activeAddonId");
      if (savedActiveId && initialAddons.some(a => a.id === savedActiveId)) {
        setActiveAddonId(savedActiveId);
      } else {
        const firstActiveAddon = initialAddons.find(a => a.isActive) || initialAddons[0];
        setActiveAddonId(firstActiveAddon?.id);
      }
    }
  }, [initialAddons]);

  const getDefaultSlug = (type: string) => {
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
  };

  const getPreviewLink = () => {
    const activeAddon = addons.find(a => a.isActive);
    const targetAddon = activeAddon || addons[0];
    if (targetAddon) {
      let slug = getDefaultSlug(targetAddon.addonType);
      try {
        const config = targetAddon.settings ? (typeof targetAddon.settings === "string" ? JSON.parse(targetAddon.settings) : targetAddon.settings) : {};
        if (config.customSlug) {
          slug = config.customSlug;
        }
      } catch (e) {}
      
      return `${origin}/@${user.username}/${slug.toLowerCase()}`;
    }
    return `${origin}/@${user.username}`;
  };

  return (
    <div className="flex flex-col lg:flex-row gap-4 md:gap-8 w-full max-w-full items-start justify-start overflow-hidden">
      {/* LEFT COLUMN: ACTIVE WORKSPACE CONTENT */}
      <div className="flex-1 space-y-5 md:space-y-8 w-full max-w-full md:max-w-3xl min-w-0 overflow-hidden">
        
        {/* Active Addons Section */}
        <div className="p-3 md:p-6 rounded-2xl border space-y-5 md:space-y-6 w-full max-w-full overflow-hidden bg-white border-zinc-200 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-zinc-150 pb-4 md:pb-5">
            <div className="flex items-center gap-3">
              <Puzzle className="h-5 w-5 text-rose-500" />
              <div>
                <h2 className="font-extrabold text-lg text-zinc-950">
                  {lang === "tr" ? "Aktif Eklentilerim" : "My Active Add-ons"}
                </h2>
                <p className="text-xs text-slate-500">
                  {lang === "tr" 
                    ? "Satın alıp aktif ettiğiniz eklentileri buradan yapılandırabilirsiniz."
                    : "Configure and manage the premium plug-ins you have added to your profile."}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={getPreviewLink()}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-2xl border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-700 text-xs font-bold shadow-sm transition-all cursor-pointer whitespace-nowrap active:scale-95 hover:border-zinc-300"
              >
                <ExternalLink className="h-3.5 w-3.5 text-rose-500 animate-pulse" />
                <span>{lang === "tr" ? "Eklenti Önizleme Linki" : "Add-on Preview Link"}</span>
              </a>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(getPreviewLink());
                  setSuccessMsg(lang === "tr" ? "Eklenti linki kopyalandı!" : "Add-on link copied!");
                  setTimeout(() => setSuccessMsg(""), 3000);
                }}
                className="p-2.5 rounded-2xl border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-500 hover:text-rose-500 shadow-sm transition-all cursor-pointer hover:border-zinc-300 flex items-center justify-center"
                title={lang === "tr" ? "Kopyala" : "Copy"}
              >
                <Copy className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Search + Sort row */}
          {addons.length > 0 && (
            <div className="flex flex-col sm:flex-row gap-3 items-center pb-2">
              <div className="relative flex-1 w-full">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
                  <Search className="h-4 w-4" />
                </span>
                <input
                  type="text"
                  placeholder={lang === "tr" ? "Eklenti ara..." : "Search add-ons..."}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-200 focus:border-rose-500/50 outline-none text-sm bg-zinc-50 text-zinc-900 font-medium transition-colors"
                />
              </div>

              <div className="relative w-full sm:w-56">
                <ArrowUpDown className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 pointer-events-none" />
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="w-full pl-10 pr-8 py-2.5 rounded-xl border border-zinc-200 focus:border-rose-500/50 outline-none text-sm bg-zinc-50 text-zinc-900 font-medium appearance-none cursor-pointer transition-colors"
                >
                  <option value="default">{lang === "tr" ? "Varsayılan Sıralama" : "Default Sorting"}</option>
                  <option value="active-first">{lang === "tr" ? "Aktifler Önce" : "Active First"}</option>
                  <option value="name-asc">{lang === "tr" ? "İsim: A → Z" : "Name: A → Z"}</option>
                  <option value="name-desc">{lang === "tr" ? "İsim: Z → A" : "Name: Z → A"}</option>
                  <option value="date-desc">{lang === "tr" ? "Yeniden Eskiye" : "Newest First"}</option>
                  <option value="date-asc">{lang === "tr" ? "Eskiden Yeniye" : "Oldest First"}</option>
                </select>
                <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 pointer-events-none" />
              </div>
            </div>
          )}

          {addons.length === 0 ? (
            <div className="text-center py-8 space-y-3">
              <div className="w-12 h-12 rounded-full bg-zinc-100 flex items-center justify-center mx-auto text-zinc-400">
                <Puzzle className="h-6 w-6" />
              </div>
              <p className="text-sm font-bold text-zinc-800">
                {lang === "tr" ? "Henüz aktif bir eklentiniz bulunmuyor." : "No active add-ons yet."}
              </p>
            </div>
          ) : sortedAddons.length === 0 ? (
            <div className="text-center py-8 space-y-2 border border-dashed border-zinc-200 rounded-2xl bg-zinc-50/50 w-full">
              <p className="text-xs font-bold text-zinc-500">
                {lang === "tr" ? "Aramanızla eşleşen eklenti bulunamadı." : "No add-ons match your search query."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
              {sortedAddons.map((addon) => {
                let addonLink = `${origin}/@${user.username}/store`;
                try {
                  const config = addon.settings ? (typeof addon.settings === "string" ? JSON.parse(addon.settings) : addon.settings) : {};
                  addonLink = `${origin}/@${user.username}/${(config.customSlug || getDefaultSlug(addon.addonType)).toLowerCase()}`;
                } catch (e) {}

                return (
                  <div key={addon.id} className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 flex flex-col justify-between h-44 transition-all hover:border-zinc-300">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center border border-zinc-200">
                          <Puzzle className="h-5 w-5 text-rose-500" />
                        </div>
                        <div>
                          <h3 className="text-sm font-black text-zinc-900">{getAddonName(addon.addonType, lang)}</h3>
                          {addon.isActive ? (
                            <span className="text-[10px] font-bold text-emerald-500 mt-0.5 px-2 py-0.5 rounded-md bg-emerald-50 inline-block border border-emerald-100">
                              {lang === "tr" ? "Yayında" : "Published"}
                            </span>
                          ) : (
                            <span className="text-[10px] font-bold text-zinc-500 mt-0.5 px-2 py-0.5 rounded-md bg-zinc-100 inline-block border border-zinc-200">
                              {lang === "tr" ? "Taslak" : "Draft"}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Toggle Switch */}
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-zinc-400">
                          {addon.isActive ? (lang === "tr" ? "Aktif" : "Active") : (lang === "tr" ? "Pasif" : "Inactive")}
                        </span>
                        <button
                          type="button"
                          disabled={isPending}
                          onClick={() => {
                            const nextActive = !addon.isActive;
                            
                            // Optimistically update active preview addon and status list
                            setActiveAddonId(addon.id);
                            sessionStorage.setItem("activeAddonId", addon.id);
                            setAddons(prev => prev.map(a => a.id === addon.id ? { ...a, isActive: nextActive } : a));

                            startTransition(async () => {
                              try {
                                const res = await saveAddonConfig(addon.id, addon.settings || {}, nextActive);
                                if (res.error) {
                                  setErrorMsg(res.error);
                                  setTimeout(() => setErrorMsg(""), 3000);
                                  setAddons(initialAddons);
                                } else {
                                  setSuccessMsg(lang === "tr" ? "Durum güncellendi!" : "Status updated!");
                                  setTimeout(() => {
                                    setSuccessMsg("");
                                    window.location.reload();
                                  }, 500);
                                }
                              } catch (err: any) {
                                setErrorMsg(err.message || "Error");
                                setTimeout(() => setErrorMsg(""), 3000);
                                setAddons(initialAddons);
                              }
                            });
                          }}
                          className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-200 focus:outline-none cursor-pointer flex items-center ${
                            addon.isActive ? "bg-rose-500" : "bg-zinc-300"
                          }`}
                        >
                          <div
                            className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${
                              addon.isActive ? "translate-x-4" : "translate-x-0"
                            }`}
                          />
                        </button>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-zinc-200/60 flex items-center gap-2">
                      <button
                        onClick={() => {
                          setActiveAddonId(addon.id);
                          sessionStorage.setItem("activeAddonId", addon.id);
                          setEditingAddon(addon);
                        }}
                        className="flex-1 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold transition-colors flex items-center justify-center gap-2"
                      >
                        <Settings className="h-3.5 w-3.5" />
                        <span>{lang === "tr" ? "Ayarları Düzenle" : "Edit Settings"}</span>
                      </button>
                      {addon.isActive ? (
                        <div className="flex flex-1 gap-1">
                          <a
                            href={addonLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors flex items-center justify-center gap-2"
                          >
                            <Globe className="h-3.5 w-3.5" />
                            <span>{lang === "tr" ? "Linke Git" : "Visit Link"}</span>
                          </a>
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText(addonLink);
                              setSuccessMsg(lang === "tr" ? "Link kopyalandı!" : "Link copied!");
                              setTimeout(() => setSuccessMsg(""), 3000);
                            }}
                            className="px-2.5 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-500 hover:text-rose-500 transition-colors flex items-center justify-center cursor-pointer hover:border-zinc-300"
                            title={lang === "tr" ? "Kopyala" : "Copy"}
                          >
                            <Copy className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex flex-1 gap-1">
                          <a
                            href={`${addonLink}?previewAddons=true`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-colors flex items-center justify-center gap-2"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                            <span>{lang === "tr" ? "Önizle" : "Preview"}</span>
                          </a>
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText(`${addonLink}?previewAddons=true`);
                              setSuccessMsg(lang === "tr" ? "Önizleme linki kopyalandı!" : "Preview link copied!");
                              setTimeout(() => setSuccessMsg(""), 3000);
                            }}
                            className="px-2.5 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-500 hover:text-rose-500 transition-colors flex items-center justify-center cursor-pointer hover:border-zinc-300"
                            title={lang === "tr" ? "Önizleme Linkini Kopyala" : "Copy Preview Link"}
                          >
                            <Copy className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      )}

                      <button
                        type="button"
                        onClick={() => handleDeleteAddon(addon.id)}
                        disabled={isPending}
                        className="px-2.5 py-2 rounded-xl border border-zinc-200 hover:border-red-200 hover:bg-red-50 text-zinc-500 hover:text-red-600 transition-colors flex items-center justify-center cursor-pointer shadow-sm disabled:opacity-50"
                        title={lang === "tr" ? "Eklentiyi Sil" : "Delete Addon"}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Integrated Store CTA Card */}
        <div className="p-4 md:p-8 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-6 bg-indigo-50/40 border-indigo-100/50 shadow-sm">
          <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
            <div className="h-14 w-14 rounded-2xl bg-indigo-50 flex items-center justify-center shrink-0 border border-indigo-100">
              <ShoppingBag className="h-7 w-7 text-indigo-500 animate-pulse" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-black text-indigo-950">
                {lang === "tr" ? "Profilinize Yeni Eklentiler Katın 🚀" : "Power Up Your Profile 🚀"}
              </h3>
              <p className="text-xs text-indigo-700/80 font-medium max-w-md leading-relaxed">
                {lang === "tr" 
                  ? "Premium eklentiler ve şablonlarla profilinizi bir dijital mağazaya, rezervasyon merkezine veya mini CRM'e dönüştürün."
                  : "Turn your landing page into a full digital store, booking agent, or customer form capture tool."}
              </p>
            </div>
          </div>
          <a
            href="/eklentiler"
            target="_blank"
            className="w-full sm:w-auto px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs rounded-xl shadow-md shadow-indigo-600/10 text-center transition-colors shrink-0"
          >
            {lang === "tr" ? "Eklenti Mağazasını Keşfet" : "Explore Add-on Store"}
          </a>
        </div>

      </div>
 
      {/* RIGHT COLUMN: PREVIEW */}
      {(() => {
        const activeTemplateButtonOverrides = (activeTemplate && activeTemplate.buttonStyle)
          ? parseButtonStyle(activeTemplate.buttonStyle)
          : {};

        const effectiveTheme = activeTemplate ? activeTemplate.name : (user.profile?.theme ?? "dark");
        const effectiveBackground = activeTemplate ? activeTemplate.bgColor : (user.profile?.background ?? "");
        const effectiveFontStyle = activeTemplate ? activeTemplate.fontStyle : (user.profile?.fontStyle ?? "Inter");
        const effectiveButtonClass = activeTemplate ? activeTemplate.buttonStyle : (user.profile?.buttonClass ?? null);
        const effectiveCustomCss = activeTemplate ? (activeTemplate.isCoded ? activeTemplate.customCss : null) : (user.profile?.customCss ?? null);

        const isLight = [
          "Minimalist Light", "Pastel Dream", "Abstract Fluid", 
          "Vintage Paper", "Vintage Journal", "Holographic Glass", "Aura Hologram"
        ].includes(effectiveTheme);

        const mappedLinks = (initialLinks || []).map((link: any) => {
          let blockMeta = {};
          if (link.metadata) {
            try { blockMeta = JSON.parse(link.metadata); } catch (e) {}
          }
          return {
            ...link,
            ...(activeTemplate ? activeTemplateButtonOverrides : {}),
            metadata: blockMeta
          };
        });

        const previewData = {
          username: user.username || "username",
          bio: user.profile?.bio || "Enter profile bio details...",
          avatarUrl: user.profile?.avatarUrl,
          theme: effectiveTheme,
          customCss: effectiveCustomCss,
          background: effectiveBackground,
          buttonClass: effectiveButtonClass,
          fontStyle: effectiveFontStyle,
          usernameColor: isLight ? "#0f172a" : "#ffffff",
          bioColor: isLight ? "#475569" : "rgba(255,255,255,0.7)",
          links: mappedLinks,
          addons: addons,
          products: initialProducts,
          systemSettings: systemSettings,
          plan: simulatedPlan,
        };

        return <PhonePreview mode="plugin" data={previewData} activeAddonId={activeAddonId} label={lang === "tr" ? "Eklenti Sandbox Önizleme" : "Add-on Sandbox Preview"} />;
      })()}

      {editingAddon && (
        <AddonConfigModal
          addon={editingAddon}
          products={initialProducts}
          onClose={(updatedSettings, updatedIsActive) => {
            if (updatedSettings !== undefined || updatedIsActive !== undefined) {
              window.location.reload();
            } else {
              setEditingAddon(null);
            }
          }}
          lang={lang}
          username={user.username || ""}
        />
      )}
    </div>
  );
}
