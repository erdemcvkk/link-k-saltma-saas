"use client";

import React, { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import { saveAddonConfig, addAddonProduct, deleteAddonProduct } from "@/app/actions";
import { X, Loader2, Save, Store, Calendar, FileQuestion, Mail, Heart, Clock, Briefcase, HelpCircle, MapPin, MessageCircle, Trash2, Plus, ShoppingBag, Music, Image } from "lucide-react";
import StorefrontPreview from "@/components/storefront-preview";
import AdvancedStorefrontView from "./advanced-storefront-view";
import PlayableAddon from "./playable-addon";

interface AddonConfigModalProps {
 addon: {
 id: string;
 addonType: string;
 isActive: boolean;
 config?: string | null;
 settings?: any;
 };
 products?: any[];
 onClose: (config?: string, isActive?: boolean) => void;
 lang: string;
 username: string;
}

export default function AddonConfigModal({ addon, products = [], onClose, lang, username }: AddonConfigModalProps) {
 const router = useRouter();
 const [isLoading, setIsLoading] = useState(false);
 const [isPending, startTransition] = useTransition();
 const [dialog, setDialog] = useState<{ isOpen: boolean; type: string; message: string; onConfirm: (() => void) | null }>({ isOpen: false, type: "alert", message: "", onConfirm: null });

 const showAlert = (message: string) => setDialog({ isOpen: true, type: "alert", message, onConfirm: null });
 const showConfirm = (message: string, onConfirm: () => void) => setDialog({ isOpen: true, type: "confirm", message, onConfirm });
 const closeDialog = () => setDialog({ isOpen: false, type: "alert", message: "", onConfirm: null });
 const [domain, setDomain] = useState("link-saas.com");
 
 useEffect(() => {
 if (typeof window !== "undefined") {
 setDomain(window.location.host);
 }
 }, []);

 
  const [configData, setConfigData] = useState<any>(() => {
    try {
      if (addon.settings) {
        return typeof addon.settings === "string" ? JSON.parse(addon.settings) : addon.settings;
      }
      return addon.config ? JSON.parse(addon.config) : {};
    } catch (e) {
      return {};
    }
  });
  const [isActive, setIsActive] = useState<boolean>(addon.isActive);
  const [newProdTitle, setNewProdTitle] = useState("");
  const [newProdPrice, setNewProdPrice] = useState("");
  const [newProdImageUrl, setNewProdImageUrl] = useState("");
  const [newProdBuyLink, setNewProdBuyLink] = useState("");
  const getDefaultTheme = (type: string) => {
    switch (type) {
      case "NEO_BRUTAL": return "neo-brutalism";
      case "ORGANIC": return "organic-earth";
      case "RETRO": return "retro-arcade";
      case "Y2K": return "y2k-holographic";
      case "CORP_EXEC": return "classic";
      default: return "classic";
    }
  };

  const getDefaultSlug = (type: string) => {
    if (!type) return "store";
    if (type === "MINI_STORE") return "store";
    if (type === "ADVANCED_STOREFRONT") return "advanced-storefront";
    if (type === "NEO_BRUTAL") return "neo-brutal";
    if (type === "ORGANIC") return "organic";
    if (type === "RETRO") return "retro";
    if (type === "Y2K") return "y2k";
    if (type === "QA") return "qa";
    if (type === "PREMIUM_VIDEO") return "masterclass";
    if (type === "CORP_EXEC") return "corporate";
    if (type === "RETRO_CASSETTE") return "retro-cassette";
    if (type === "SPOTIFY_CLASSIC") return "spotify-player";
    if (type === "VINYL_RETRO") return "vinyl-player";
    if (type === "GLASS_AUDIO") return "glass-audio";
    if (type === "NEON_CYBERPUNK") return "neon-player";
    if (type === "MUSIC_PODCAST") return "music-podcast";
    if (type === "PORTFOLIO_GALLERY") return "portfolio-gallery";
    if (type === "COUNTDOWN_LAUNCH") return "countdown";
    return type.toLowerCase();
  };
 const activeSlug = configData.customSlug || getDefaultSlug(addon?.addonType);


 const handleFileUpload = async (file: File): Promise<string> => {
 return new Promise((resolve, reject) => {
 if (file.size > 2 * 1024 * 1024) {
 return reject(new Error("Dosya boyutu 2MB'den büyük olamaz. Lütfen daha küçük bir dosya seçin."));
 }
 const reader = new FileReader();
 reader.readAsDataURL(file);
 reader.onload = (event) => resolve(event.target?.result as string);
 reader.onerror = () => reject(new Error("Dosya okuma hatası"));
 });
 };

 const handleSave = () => {
 startTransition(async () => {
 try {
 const res: any = await saveAddonConfig(addon.id, JSON.stringify(configData), isActive);
 if (res?.error) {
 showAlert(res.error);
 } else {
 showAlert(lang === "tr" ? "Ayarlar başarıyla kaydedildi!" : "Settings saved!");
 onClose(JSON.stringify(configData), isActive);
 }
 } catch (err: any) {
 showAlert(err.message || "Error");
 }
 });
 };

 const renderInput = (key: string, label: string, placeholder: string, type = "text") => (
 <div className="space-y-1.5 mb-4">
 <label className="text-xs font-bold text-slate-700 block uppercase tracking-wide">{label}</label>
 <input
 type={type}
 value={configData[key] || ""}
 onChange={(e) => setConfigData({ ...configData, [key]: e.target.value })}
 placeholder={placeholder}
 className="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-zinc-50 text-sm text-slate-800 font-medium focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all shadow-sm"
 />
 </div>
 );


 const renderImageUpload = (key: string, label: string) => (
 <div className="space-y-1.5 mb-4">
 <label className="text-xs font-bold text-slate-700 block uppercase tracking-wide">{label}</label>
 <div className="flex items-center gap-3">
 {configData[key] && (
 <img src={configData[key]} alt="Preview" className="w-12 h-12 rounded-lg object-cover bg-zinc-100" />
 )}
 <div className="flex-1 relative">
 <input
 type="text"
 value={configData[key] || ""}
 onChange={(e) => setConfigData({ ...configData, [key]: e.target.value })}
 placeholder="https://..."
 className="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-zinc-50 text-sm text-slate-800 font-medium focus:bg-white focus:border-indigo-500 outline-none pr-24"
 />
 <label className="absolute right-1 top-1 bottom-1 flex items-center justify-center px-3 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-sm font-bold rounded-lg cursor-pointer transition-colors">
 {lang === "tr" ? "Dosya Seç" : "Upload"}
 <input 
 type="file" 
 className="hidden" 
 accept="image/*"
 onChange={async (e) => {
 const file = e.target.files?.[0];
 if (file) {
 try {
 const url = await handleFileUpload(file);
 setConfigData({ ...configData, [key]: url });
 } catch (err: any) { showAlert(err.message); }
 }
 }}
 />
 </label>
 </div>
 </div>
 </div>
 );

 const renderTextarea = (key: string, label: string, placeholder: string) => (
 <div className="space-y-1.5 mb-4">
 <label className="text-xs font-bold text-slate-700 block uppercase tracking-wide">{label}</label>
 <textarea
 value={configData[key] || ""}
 onChange={(e) => setConfigData({ ...configData, [key]: e.target.value })}
 placeholder={placeholder}
 rows={3}
 className="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-zinc-50 text-sm text-slate-800 font-medium focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all shadow-sm resize-none custom-scrollbar"
 />
 </div>
 );

 const renderFaqEditor = () => {
 const pairs = configData.faqPairs || [];
 return (
 <div className="space-y-3">
 {pairs.map((p: any, idx: number) => (
 <div key={idx} className="p-3 rounded-xl border border-zinc-200 bg-zinc-50 relative group">
 <button
 type="button"
 onClick={() => {
 const newPairs = [...pairs];
 newPairs.splice(idx, 1);
 setConfigData({ ...configData, faqPairs: newPairs });
 }}
 className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
 >
 <X className="h-3 w-3" />
 </button>
 <input
 type="text"
 placeholder="Soru"
 value={p.q}
 onChange={(e) => {
 const newPairs = [...pairs];
 newPairs[idx].q = e.target.value;
 setConfigData({ ...configData, faqPairs: newPairs });
 }}
 className="w-full p-2 text-sm font-bold bg-transparent border-b border-zinc-200 focus:border-indigo-500 outline-none mb-2"
 />
 <textarea
 placeholder="Cevap"
 value={p.a}
 onChange={(e) => {
 const newPairs = [...pairs];
 newPairs[idx].a = e.target.value;
 setConfigData({ ...configData, faqPairs: newPairs });
 }}
 className="w-full p-2 text-xs bg-transparent outline-none resize-none h-16"
 />
 </div>
 ))}
 <button
 type="button"
 onClick={() => {
 const newPairs = [...pairs, { q: "", a: "" }];
 setConfigData({ ...configData, faqPairs: newPairs });
 }}
 className="w-full py-3 md:py-2.5 rounded-xl border-2 border-dashed border-indigo-200 text-indigo-600 font-bold text-xs hover:bg-indigo-50 transition-colors"
 >
 + Soru Ekle
 </button>
 </div>
 );
 };

  const renderQaEditor = () => {
    const pairs = configData.qaPairs || [];
    return (
      <div className="space-y-3 mt-4">
        <label className="text-xs font-bold text-slate-700 block uppercase tracking-wide">
          {lang === "tr" ? "Soru & Cevap Akordiyon Listesi" : "Q&A Accordion List"}
        </label>
        {pairs.map((p: any, idx: number) => (
          <div key={idx} className="p-3 rounded-xl border border-zinc-200 bg-zinc-50 relative group">
            <button
              type="button"
              onClick={() => {
                const newPairs = [...pairs];
                newPairs.splice(idx, 1);
                setConfigData({ ...configData, qaPairs: newPairs });
              }}
              className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-100 hover:bg-red-200 text-red-600 flex items-center justify-center transition-colors shadow-sm"
            >
              <X className="h-3.5 w-3.5" />
            </button>
            <input
              type="text"
              placeholder={lang === "tr" ? "Soru Metni" : "Question"}
              value={p.q || ""}
              onChange={(e) => {
                const newPairs = [...pairs];
                newPairs[idx] = { ...newPairs[idx], q: e.target.value };
                setConfigData({ ...configData, qaPairs: newPairs });
              }}
              className="w-full p-2 text-sm font-bold bg-transparent border-b border-zinc-200 focus:border-indigo-500 outline-none mb-2 text-slate-800"
            />
            <textarea
              placeholder={lang === "tr" ? "Cevap Metni" : "Answer"}
              value={p.a || ""}
              onChange={(e) => {
                const newPairs = [...pairs];
                newPairs[idx] = { ...newPairs[idx], a: e.target.value };
                setConfigData({ ...configData, qaPairs: newPairs });
              }}
              className="w-full p-2 text-xs bg-transparent outline-none resize-none h-16 text-slate-600"
            />
          </div>
        ))}
        <button
          type="button"
          onClick={() => {
            const newPairs = [...pairs, { q: "", a: "" }];
            setConfigData({ ...configData, qaPairs: newPairs });
          }}
          className="w-full py-3 md:py-2.5 rounded-xl border-2 border-dashed border-indigo-200 text-indigo-600 font-bold text-xs hover:bg-indigo-50 transition-colors flex items-center justify-center gap-1.5"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>{lang === "tr" ? "Yeni Soru Ekle" : "Add New Question"}</span>
        </button>
      </div>
    );
  };


 const renderTestimonialsEditor = () => {
    const items = configData.testimonials || [];
    return (
      <div className="space-y-3">
        <label className="text-xs font-bold text-slate-700 block uppercase tracking-wide">
          {lang === "tr" ? "Müşteri Yorumları Listesi" : "Testimonials List"}
        </label>
        {items.map((item: any, idx: number) => (
          <div key={idx} className="p-3 rounded-xl border border-zinc-200 bg-zinc-50 relative group space-y-2">
            <button
              type="button"
              onClick={() => {
                const newItems = [...items];
                newItems.splice(idx, 1);
                setConfigData({ ...configData, testimonials: newItems });
              }}
              className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-100 hover:bg-red-200 text-red-600 flex items-center justify-center transition-colors shadow-sm"
            >
              <X className="h-3.5 w-3.5" />
            </button>
            <input
              type="text"
              placeholder={lang === "tr" ? "Müşteri Adı" : "Client Name"}
              value={item.name || ""}
              onChange={(e) => {
                const newItems = [...items];
                newItems[idx] = { ...newItems[idx], name: e.target.value };
                setConfigData({ ...configData, testimonials: newItems });
              }}
              className="w-full p-2 text-sm font-bold bg-transparent border-b border-zinc-200 focus:border-indigo-500 outline-none text-slate-800"
            />
            <textarea
              placeholder={lang === "tr" ? "Yorum Metni" : "Review Text"}
              value={item.text || ""}
              onChange={(e) => {
                const newItems = [...items];
                newItems[idx] = { ...newItems[idx], text: e.target.value };
                setConfigData({ ...configData, testimonials: newItems });
              }}
              className="w-full p-2 text-xs bg-transparent outline-none resize-none h-16 text-slate-600"
            />
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-medium">{lang === "tr" ? "Puan:" : "Rating:"}</span>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => {
                    const newItems = [...items];
                    newItems[idx] = { ...newItems[idx], rating: star };
                    setConfigData({ ...configData, testimonials: newItems });
                  }}
                  className={`text-lg ${(item.rating || 5) >= star ? "text-yellow-400" : "text-zinc-300"} hover:scale-110 transition-transform cursor-pointer`}
                >
                  ★
                </button>
              ))}
            </div>
            <input
              type="text"
              placeholder={lang === "tr" ? "Müşteri Avatar URL (Opsiyonel)" : "Client Avatar URL (Optional)"}
              value={item.avatarUrl || ""}
              onChange={(e) => {
                const newItems = [...items];
                newItems[idx] = { ...newItems[idx], avatarUrl: e.target.value };
                setConfigData({ ...configData, testimonials: newItems });
              }}
              className="w-full p-2 text-xs bg-transparent border-b border-zinc-200 focus:border-indigo-500 outline-none text-slate-600"
            />
          </div>
        ))}
        <button
          type="button"
          onClick={() => {
            const newItems = [...items, { name: "", text: "", rating: 5, avatarUrl: "" }];
            setConfigData({ ...configData, testimonials: newItems });
          }}
          className="w-full py-3 md:py-2.5 rounded-xl border-2 border-dashed border-indigo-200 text-indigo-600 font-bold text-xs hover:bg-indigo-50 transition-colors flex items-center justify-center gap-1.5"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>{lang === "tr" ? "Yeni Yorum Ekle" : "Add New Testimonial"}</span>
        </button>
      </div>
    );
  };

  const renderCardsEditor = () => {
    const cards = configData.cards || (configData.title ? [{ title: configData.title, description: configData.description, buttonText: configData.buttonText, buttonUrl: configData.buttonUrl }] : []);
    return (
      <div className="space-y-4 mt-4">
        <label className="text-xs font-bold text-slate-700 block uppercase tracking-wide">
          {lang === "tr" ? "Yönetici Kartları Listesi" : "Executive Cards List"}
        </label>
        {cards.map((card: any, idx: number) => (
          <div key={idx} className="p-4 rounded-2xl border border-zinc-200 bg-zinc-50 relative space-y-3 shadow-sm">
            <div className="flex justify-between items-center pb-2 border-b border-zinc-150">
              <span className="text-xs font-black text-indigo-650 uppercase tracking-wide">
                {lang === "tr" ? `${idx + 1}. Kart` : `Card #${idx + 1}`}
              </span>
              <button
                type="button"
                onClick={() => {
                  const newCards = [...cards];
                  newCards.splice(idx, 1);
                  setConfigData({ ...configData, cards: newCards });
                }}
                className="w-6 h-6 rounded-full bg-red-100 hover:bg-red-200 text-red-600 flex items-center justify-center transition-colors shadow-sm"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
            
            <div className="space-y-3">
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block mb-1">
                  {lang === "tr" ? "Kart Başlığı" : "Card Title"}
                </label>
                <input
                  type="text"
                  placeholder="Q3 Executive Briefing"
                  value={card.title || ""}
                  onChange={(e) => {
                    const newCards = [...cards];
                    newCards[idx] = { ...newCards[idx], title: e.target.value };
                    setConfigData({ ...configData, cards: newCards });
                  }}
                  className="w-full px-3 py-2 text-xs font-bold bg-white border border-zinc-200 rounded-xl focus:border-indigo-500 outline-none text-slate-800"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block mb-1">
                  {lang === "tr" ? "Kart Açıklaması" : "Card Description"}
                </label>
                <textarea
                  placeholder="Corporate & Strategy"
                  value={card.description || ""}
                  onChange={(e) => {
                    const newCards = [...cards];
                    newCards[idx] = { ...newCards[idx], description: e.target.value };
                    setConfigData({ ...configData, cards: newCards });
                  }}
                  className="w-full px-3 py-2 text-xs bg-white border border-zinc-200 rounded-xl focus:border-indigo-500 outline-none resize-none h-14 text-slate-600"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block mb-1">
                    {lang === "tr" ? "Buton Metni" : "Button Text"}
                  </label>
                  <input
                    type="text"
                    placeholder="Schedule Consultation"
                    value={card.buttonText || ""}
                    onChange={(e) => {
                      const newCards = [...cards];
                      newCards[idx] = { ...newCards[idx], buttonText: e.target.value };
                      setConfigData({ ...configData, cards: newCards });
                    }}
                    className="w-full px-3 py-2 text-xs bg-white border border-zinc-200 rounded-xl focus:border-indigo-500 outline-none text-slate-850"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block mb-1">
                    {lang === "tr" ? "Yönlendirme Linki" : "Redirect URL"}
                  </label>
                  <input
                    type="text"
                    placeholder="https://..."
                    value={card.buttonUrl || ""}
                    onChange={(e) => {
                      const newCards = [...cards];
                      newCards[idx] = { ...newCards[idx], buttonUrl: e.target.value };
                      setConfigData({ ...configData, cards: newCards });
                    }}
                    className="w-full px-3 py-2 text-xs bg-white border border-zinc-200 rounded-xl focus:border-indigo-500 outline-none text-slate-850"
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={() => {
            const newCards = [...cards, { title: "", description: "", buttonText: "Schedule Consultation", buttonUrl: "" }];
            setConfigData({ ...configData, cards: newCards });
          }}
          className="w-full py-3 md:py-2.5 rounded-xl border-2 border-dashed border-indigo-200 text-indigo-600 font-bold text-xs hover:bg-indigo-50 transition-colors flex items-center justify-center gap-1.5"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>{lang === "tr" ? "Yeni Kart Ekle" : "Add New Card"}</span>
        </button>
      </div>
    );
  };

  const renderAdvancedStorefrontEditor = () => {
    // Banners (with fallback to singular hero fields for backward compatibility)
    const banners = configData.banners || (configData.heroBgUrl ? [
      {
        heroBgUrl: configData.heroBgUrl || "",
        heroSub: configData.heroSub || "",
        heroTitle: configData.heroTitle || "",
        heroDesc: configData.heroDesc || "",
        heroBtnText: configData.heroBtnText || "",
        heroBtnLink: configData.heroBtnLink || ""
      }
    ] : []);

    // Collections
    const collections = configData.collections || [];

    // Bottom Nav
    const bottomNavShow = configData.bottomNav?.show !== false;
    const bottomNavItems = (configData.bottomNav?.items || [
      { label: "Shop", link: "#", icon: "Shop" },
      { label: "Explore", link: "#", icon: "Explore" },
      { label: "Brands", link: "#", icon: "Brands" }
    ]).filter((item: any) => item.icon !== "Profile");

    const updateBanners = (newBanners: any[]) => {
      setConfigData({
        ...configData,
        banners: newBanners
      });
    };

    const updateCollections = (newCollections: any[]) => {
      setConfigData({
        ...configData,
        collections: newCollections
      });
    };

    const updateBottomNav = (newBottomNav: any) => {
      setConfigData({
        ...configData,
        bottomNav: newBottomNav
      });
    };

    return (
      <div className="space-y-6">
        {/* Hero Slider Section */}
        <div className="space-y-4 pt-2 border-b border-zinc-200 pb-6 mb-6">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              📸 {lang === "tr" ? "Kahraman Alanı Slider (Banner Listesi)" : "Hero Slider (Banner List)"}
            </h4>
            <button
              type="button"
              onClick={() => {
                const newBanner = {
                  heroBgUrl: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80",
                  heroSub: lang === "tr" ? "YENİ KOLEKSİYON" : "NEW COLLECTION",
                  heroTitle: lang === "tr" ? "%20 İNDİRİM" : "20% OFF",
                  heroDesc: lang === "tr" ? "Seçili modellerde geçerli" : "On selected styles",
                  heroBtnText: lang === "tr" ? "İncele" : "Shop now",
                  heroBtnLink: "#"
                };
                updateBanners([...banners, newBanner]);
              }}
              className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-650 text-xs font-bold rounded-lg transition-colors border-0 cursor-pointer"
            >
              + {lang === "tr" ? "Banner Ekle" : "Add Banner"}
            </button>
          </div>

          <div className="space-y-4">
            {banners.map((banner: any, bIdx: number) => (
              <div key={bIdx} className="p-5 rounded-2xl border border-zinc-200 bg-zinc-50 relative space-y-4 shadow-sm">
                {/* Banner Delete / Reorder Controls */}
                <div className="absolute top-4 right-4 flex items-center gap-2">
                  <button
                    type="button"
                    disabled={bIdx === 0}
                    onClick={() => {
                      const newBanners = [...banners];
                      const temp = newBanners[bIdx];
                      newBanners[bIdx] = newBanners[bIdx - 1];
                      newBanners[bIdx - 1] = temp;
                      updateBanners(newBanners);
                    }}
                    className="p-1 rounded bg-zinc-200 hover:bg-zinc-300 text-zinc-700 disabled:opacity-40 transition-colors text-xs font-bold"
                  >
                    ▲
                  </button>
                  <button
                    type="button"
                    disabled={bIdx === banners.length - 1}
                    onClick={() => {
                      const newBanners = [...banners];
                      const temp = newBanners[bIdx];
                      newBanners[bIdx] = newBanners[bIdx + 1];
                      newBanners[bIdx + 1] = temp;
                      updateBanners(newBanners);
                    }}
                    className="p-1 rounded bg-zinc-200 hover:bg-zinc-300 text-zinc-700 disabled:opacity-40 transition-colors text-xs font-bold"
                  >
                    ▼
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm(lang === "tr" ? "Bu banner görselini silmek istediğinize emin misiniz?" : "Are you sure you want to delete this banner?")) {
                        const newBanners = [...banners];
                        newBanners.splice(bIdx, 1);
                        updateBanners(newBanners);
                      }
                    }}
                    className="p-1.5 rounded-lg bg-red-550 hover:bg-red-100 text-red-500 transition-colors border-0 cursor-pointer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="pr-24 space-y-3">
                  <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md uppercase tracking-wider">
                    {lang === "tr" ? `${bIdx + 1}. Banner` : `Banner ${bIdx + 1}`}
                  </span>

                  {/* Arka Plan Görseli (with upload helper) */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block uppercase tracking-wide">
                      {lang === "tr" ? "Arka Plan Görseli" : "Background Image"}
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={banner.heroBgUrl || ""}
                        onChange={(e) => {
                          const newBanners = [...banners];
                          newBanners[bIdx] = { ...newBanners[bIdx], heroBgUrl: e.target.value };
                          updateBanners(newBanners);
                        }}
                        placeholder="https://..."
                        className="w-full px-3 py-2 rounded-lg border border-zinc-200 bg-white text-xs"
                      />
                      <label className="flex items-center justify-center px-3 py-2 bg-zinc-150 hover:bg-zinc-200 text-zinc-700 text-xs font-bold rounded-lg cursor-pointer border border-zinc-200 transition-colors whitespace-nowrap">
                        {lang === "tr" ? "Seç" : "Upload"}
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              try {
                                const url = await handleFileUpload(file);
                                const newBanners = [...banners];
                                newBanners[bIdx] = { ...newBanners[bIdx], heroBgUrl: url };
                                updateBanners(newBanners);
                              } catch (err: any) { showAlert(err.message); }
                            }
                          }}
                        />
                      </label>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-550 uppercase">
                        {lang === "tr" ? "Üst Başlık (Küçük)" : "Subheading"}
                      </label>
                      <input
                        type="text"
                        value={banner.heroSub || ""}
                        onChange={(e) => {
                          const newBanners = [...banners];
                          newBanners[bIdx] = { ...newBanners[bIdx], heroSub: e.target.value };
                          updateBanners(newBanners);
                        }}
                        className="w-full px-3 py-2 rounded-lg border border-zinc-200 bg-white text-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-550 uppercase">
                        {lang === "tr" ? "Ana Başlık (Büyük)" : "Headline"}
                      </label>
                      <input
                        type="text"
                        value={banner.heroTitle || ""}
                        onChange={(e) => {
                          const newBanners = [...banners];
                          newBanners[bIdx] = { ...newBanners[bIdx], heroTitle: e.target.value };
                          updateBanners(newBanners);
                        }}
                        className="w-full px-3 py-2 rounded-lg border border-zinc-200 bg-white text-xs"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-550 uppercase">
                      {lang === "tr" ? "Açıklama Alt Metni" : "Description Text"}
                    </label>
                    <input
                      type="text"
                      value={banner.heroDesc || ""}
                      onChange={(e) => {
                        const newBanners = [...banners];
                        newBanners[bIdx] = { ...newBanners[bIdx], heroDesc: e.target.value };
                        updateBanners(newBanners);
                      }}
                      className="w-full px-3 py-2 rounded-lg border border-zinc-200 bg-white text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-550 uppercase">
                        {lang === "tr" ? "Buton Yazısı" : "Button Text"}
                      </label>
                      <input
                        type="text"
                        value={banner.heroBtnText || ""}
                        onChange={(e) => {
                          const newBanners = [...banners];
                          newBanners[bIdx] = { ...newBanners[bIdx], heroBtnText: e.target.value };
                          updateBanners(newBanners);
                        }}
                        className="w-full px-3 py-2 rounded-lg border border-zinc-200 bg-white text-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-550 uppercase">
                        {lang === "tr" ? "Buton Linki" : "Button Link"}
                      </label>
                      <input
                        type="text"
                        value={banner.heroBtnLink || ""}
                        onChange={(e) => {
                          const newBanners = [...banners];
                          newBanners[bIdx] = { ...newBanners[bIdx], heroBtnLink: e.target.value };
                          updateBanners(newBanners);
                        }}
                        className="w-full px-3 py-2 rounded-lg border border-zinc-200 bg-white text-xs"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {banners.length === 0 && (
              <p className="text-xs text-zinc-400 text-center py-4">
                {lang === "tr" ? "Henüz banner eklenmemiş." : "No banners added yet."}
              </p>
            )}
          </div>
        </div>

        {/* Brand Info Section */}
        <div className="space-y-4 pt-2 border-b border-zinc-200 pb-6 mb-6">
          <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            🏷️ {lang === "tr" ? "Marka Bilgileri (Brand Info)" : "Brand Info"}
          </h4>
          {renderInput("brandName", lang === "tr" ? "Marka Adı" : "Brand Name", "Moda Boutique")}
          {renderTextarea("brandDescription", lang === "tr" ? "Marka Hakkında / Açıklama" : "Brand Description", "Premium Wear & Design Studio since 2018.")}
          {renderImageUpload("brandLogoUrl", lang === "tr" ? "Logo Görseli" : "Logo Image")}
          {renderInput("brandContact", lang === "tr" ? "İletişim / Destek Linki veya Email" : "Contact Link or Email", "mailto:info@modaboutique.com")}
        </div>

        {/* Collections Manager */}
        <div className="space-y-4 pt-2 border-b border-zinc-200 pb-6 mb-6">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              📦 {lang === "tr" ? "Ürün Koleksiyonları" : "Product Collections"}
            </h4>
            <button
              type="button"
              onClick={() => {
                const newCol = {
                  id: "col-" + Date.now(),
                  title: lang === "tr" ? "Yeni Koleksiyon" : "New Collection",
                  showAllLink: "#",
                  displayType: "horizontal-scroll",
                  products: []
                };
                updateCollections([...collections, newCol]);
              }}
              className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-650 text-xs font-bold rounded-lg transition-colors border-0 cursor-pointer"
            >
              + {lang === "tr" ? "Koleksiyon Ekle" : "Add Collection"}
            </button>
          </div>

          <div className="space-y-4">
            {collections.map((col: any, colIdx: number) => (
              <div key={col.id} className="p-5 rounded-2xl border border-zinc-200 bg-zinc-50 relative space-y-4 shadow-sm">
                {/* Collection Delete / Reorder Controls */}
                <div className="absolute top-4 right-4 flex items-center gap-2">
                  <button
                    type="button"
                    disabled={colIdx === 0}
                    onClick={() => {
                      const newCols = [...collections];
                      const temp = newCols[colIdx];
                      newCols[colIdx] = newCols[colIdx - 1];
                      newCols[colIdx - 1] = temp;
                      updateCollections(newCols);
                    }}
                    className="p-1 rounded bg-zinc-200 hover:bg-zinc-300 text-zinc-700 disabled:opacity-40 transition-colors text-xs font-bold"
                  >
                    ▲
                  </button>
                  <button
                    type="button"
                    disabled={colIdx === collections.length - 1}
                    onClick={() => {
                      const newCols = [...collections];
                      const temp = newCols[colIdx];
                      newCols[colIdx] = newCols[colIdx + 1];
                      newCols[colIdx + 1] = temp;
                      updateCollections(newCols);
                    }}
                    className="p-1 rounded bg-zinc-200 hover:bg-zinc-300 text-zinc-700 disabled:opacity-40 transition-colors text-xs font-bold"
                  >
                    ▼
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm(lang === "tr" ? "Bu koleksiyonu ve içindeki ürünleri silmek istediğinize emin misiniz?" : "Are you sure you want to delete this collection and its products?")) {
                        const newCols = [...collections];
                        newCols.splice(colIdx, 1);
                        updateCollections(newCols);
                      }
                    }}
                    className="p-1.5 rounded-lg bg-red-550 hover:bg-red-100 text-red-500 transition-colors border-0 cursor-pointer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="pr-24 space-y-3">
                  <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md uppercase tracking-wider">
                    {lang === "tr" ? `${colIdx + 1}. Koleksiyon` : `Collection ${colIdx + 1}`}
                  </span>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase">{lang === "tr" ? "Koleksiyon Adı" : "Collection Name"}</label>
                      <input
                        type="text"
                        value={col.title || ""}
                        onChange={(e) => {
                          const newCols = [...collections];
                          newCols[colIdx] = { ...newCols[colIdx], title: e.target.value };
                          updateCollections(newCols);
                        }}
                        className="w-full px-3 py-2 rounded-lg border border-zinc-200 bg-white text-sm"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase">{lang === "tr" ? "Tümünü Gör Linki" : "Show All Link"}</label>
                      <input
                        type="text"
                        value={col.showAllLink || ""}
                        onChange={(e) => {
                          const newCols = [...collections];
                          newCols[colIdx] = { ...newCols[colIdx], showAllLink: e.target.value };
                          updateCollections(newCols);
                        }}
                        className="w-full px-3 py-2 rounded-lg border border-zinc-200 bg-white text-sm"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">{lang === "tr" ? "Gösterim Şekli" : "Display Type"}</label>
                    <select
                      value={col.displayType || "horizontal-scroll"}
                      onChange={(e) => {
                        const newCols = [...collections];
                        newCols[colIdx] = { ...newCols[colIdx], displayType: e.target.value };
                        updateCollections(newCols);
                      }}
                      className="w-full px-3 py-2 rounded-lg border border-zinc-200 bg-white text-sm"
                    >
                      <option value="horizontal-scroll">{lang === "tr" ? "Yatay Kaydırmalı Liste (Horizontal Scroll)" : "Horizontal Scroll"}</option>
                      <option value="vertical-list">{lang === "tr" ? "İkili Grid Görünümü (Vertical List)" : "Grid View"}</option>
                    </select>
                  </div>
                </div>

                {/* Products Manager Inside Collection */}
                <div className="border-t border-zinc-200/60 pt-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h5 className="text-xs font-bold text-slate-700">{lang === "tr" ? "Koleksiyon Ürünleri" : "Products"}</h5>
                    <button
                      type="button"
                      onClick={() => {
                        const newProd = {
                          id: "p-" + Date.now(),
                          title: lang === "tr" ? "Yeni Ürün" : "New Product",
                          price: "29.99",
                          imageUrl: "",
                          badge: "New",
                          isFavorite: false,
                          buyLink: "#"
                        };
                        const newCols = [...collections];
                        newCols[colIdx] = {
                          ...newCols[colIdx],
                          products: [...(col.products || []), newProd]
                        };
                        updateCollections(newCols);
                      }}
                      className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-650 text-[10px] font-bold rounded-md transition-colors border-0 cursor-pointer"
                    >
                      + {lang === "tr" ? "Ürün Ekle" : "Add Product"}
                    </button>
                  </div>

                  <div className="space-y-2 max-h-[300px] overflow-y-auto no-scrollbar pr-1">
                    {(col.products || []).map((p: any, pIdx: number) => (
                      <div key={p.id} className="bg-white border border-zinc-150 rounded-xl p-3 relative space-y-3 shadow-sm">
                        {/* Product Action Buttons */}
                        <div className="absolute top-3 right-3 flex items-center gap-1.5">
                          <button
                            type="button"
                            disabled={pIdx === 0}
                            onClick={() => {
                              const newProds = [...col.products];
                              const temp = newProds[pIdx];
                              newProds[pIdx] = newProds[pIdx - 1];
                              newProds[pIdx - 1] = temp;
                              const newCols = [...collections];
                              newCols[colIdx] = { ...newCols[colIdx], products: newProds };
                              updateCollections(newCols);
                            }}
                            className="p-0.5 rounded bg-zinc-100 hover:bg-zinc-200 text-zinc-650 disabled:opacity-40 text-[9px] font-bold"
                          >
                            ▲
                          </button>
                          <button
                            type="button"
                            disabled={pIdx === col.products.length - 1}
                            onClick={() => {
                              const newProds = [...col.products];
                              const temp = newProds[pIdx];
                              newProds[pIdx] = newProds[pIdx + 1];
                              newProds[pIdx + 1] = temp;
                              const newCols = [...collections];
                              newCols[colIdx] = { ...newCols[colIdx], products: newProds };
                              updateCollections(newCols);
                            }}
                            className="p-0.5 rounded bg-zinc-100 hover:bg-zinc-200 text-zinc-650 disabled:opacity-40 text-[9px] font-bold"
                          >
                            ▼
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              const newProds = [...col.products];
                              newProds.splice(pIdx, 1);
                              const newCols = [...collections];
                              newCols[colIdx] = { ...newCols[colIdx], products: newProds };
                              updateCollections(newCols);
                            }}
                            className="p-1 rounded bg-red-50 hover:bg-red-100 text-red-550 border-0 transition-colors cursor-pointer"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>

                        {/* Product edit forms */}
                        <div className="pr-16 space-y-2">
                          <div className="grid grid-cols-2 gap-2">
                            <div className="space-y-0.5">
                              <label className="text-[8px] font-bold text-slate-500 uppercase">{lang === "tr" ? "Ürün Adı" : "Product Title"}</label>
                              <input
                                type="text"
                                value={p.title || ""}
                                onChange={(e) => {
                                  const newProds = [...col.products];
                                  newProds[pIdx] = { ...newProds[pIdx], title: e.target.value };
                                  const newCols = [...collections];
                                  newCols[colIdx] = { ...newCols[colIdx], products: newProds };
                                  updateCollections(newCols);
                                }}
                                className="w-full px-2 py-1 border border-zinc-200 rounded text-xs"
                              />
                            </div>
                            <div className="space-y-0.5">
                              <label className="text-[8px] font-bold text-slate-500 uppercase">{lang === "tr" ? "Fiyat" : "Price"}</label>
                              <input
                                type="text"
                                value={p.price || ""}
                                onChange={(e) => {
                                  const newProds = [...col.products];
                                  newProds[pIdx] = { ...newProds[pIdx], price: e.target.value };
                                  const newCols = [...collections];
                                  newCols[colIdx] = { ...newCols[colIdx], products: newProds };
                                  updateCollections(newCols);
                                }}
                                className="w-full px-2 py-1 border border-zinc-200 rounded text-xs"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <div className="space-y-0.5">
                              <label className="text-[8px] font-bold text-slate-500 uppercase">{lang === "tr" ? "Etiket (Badge)" : "Badge"}</label>
                              <input
                                type="text"
                                value={p.badge || ""}
                                onChange={(e) => {
                                  const newProds = [...col.products];
                                  newProds[pIdx] = { ...newProds[pIdx], badge: e.target.value };
                                  const newCols = [...collections];
                                  newCols[colIdx] = { ...newCols[colIdx], products: newProds };
                                  updateCollections(newCols);
                                }}
                                placeholder="New, Sale, vb."
                                className="w-full px-2 py-1 border border-zinc-200 rounded text-xs"
                              />
                            </div>
                            <div className="space-y-0.5 flex items-center justify-start pt-3 pl-1">
                              <label className="flex items-center gap-1.5 cursor-pointer text-[10px] font-bold text-slate-700">
                                <input
                                  type="checkbox"
                                  checked={!!p.isFavorite}
                                  onChange={(e) => {
                                    const newProds = [...col.products];
                                    newProds[pIdx] = { ...newProds[pIdx], isFavorite: e.target.checked };
                                    const newCols = [...collections];
                                    newCols[colIdx] = { ...newCols[colIdx], products: newProds };
                                    updateCollections(newCols);
                                  }}
                                  className="rounded text-indigo-600 focus:ring-indigo-400"
                                />
                                {lang === "tr" ? "Favori İkonu" : "Favorite Icon"}
                              </label>
                            </div>
                          </div>

                          <div className="space-y-0.5">
                            <label className="text-[8px] font-bold text-slate-500 uppercase">{lang === "tr" ? "Satın Alma Linki" : "Buy Link"}</label>
                            <input
                              type="text"
                              value={p.buyLink || ""}
                              onChange={(e) => {
                                  const newProds = [...col.products];
                                  newProds[pIdx] = { ...newProds[pIdx], buyLink: e.target.value };
                                  const newCols = [...collections];
                                  newCols[colIdx] = { ...newCols[colIdx], products: newProds };
                                  updateCollections(newCols);
                              }}
                              placeholder="https://stripe.com/..."
                              className="w-full px-2 py-1 border border-zinc-200 rounded text-xs"
                            />
                          </div>

                          {/* Product Image input with upload */}
                          <div className="space-y-0.5">
                            <label className="text-[8px] font-bold text-slate-500 uppercase block">{lang === "tr" ? "Ürün Görseli" : "Product Image"}</label>
                            <div className="flex gap-1.5 relative">
                              <input
                                type="text"
                                value={p.imageUrl || ""}
                                onChange={(e) => {
                                  const newProds = [...col.products];
                                  newProds[pIdx] = { ...newProds[pIdx], imageUrl: e.target.value };
                                  const newCols = [...collections];
                                  newCols[colIdx] = { ...newCols[colIdx], products: newProds };
                                  updateCollections(newCols);
                                }}
                                placeholder="https://..."
                                className="w-full px-2 py-1 border border-zinc-200 rounded text-xs pr-16"
                              />
                              <label className="absolute right-0.5 top-0.5 bottom-0.5 flex items-center justify-center px-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-[10px] font-bold rounded cursor-pointer transition-colors whitespace-nowrap">
                                {lang === "tr" ? "Seç" : "Upload"}
                                <input 
                                  type="file" 
                                  className="hidden" 
                                  accept="image/*"
                                  onChange={async (e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                      try {
                                        const url = await handleFileUpload(file);
                                        const newProds = [...col.products];
                                        newProds[pIdx] = { ...newProds[pIdx], imageUrl: url };
                                        const newCols = [...collections];
                                        newCols[colIdx] = { ...newCols[colIdx], products: newProds };
                                        updateCollections(newCols);
                                      } catch (err: any) { showAlert(err.message); }
                                    }
                                  }}
                                />
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    {(col.products || []).length === 0 && (
                      <p className="text-[10px] text-zinc-400 text-center py-2">{lang === "tr" ? "Henüz ürün eklenmemiş." : "No products added yet."}</p>
                    )}
                  </div>
                </div>

              </div>
            ))}
            {collections.length === 0 && (
              <p className="text-xs text-zinc-400 text-center py-4">{lang === "tr" ? "Henüz koleksiyon oluşturulmamış." : "No collections created yet."}</p>
            )}
          </div>
        </div>

        {/* Bottom Nav Editor */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              📱 {lang === "tr" ? "Alt Navigasyon Menüsü" : "Bottom Navigation Menu"}
            </h4>
            <label className="flex items-center gap-1.5 cursor-pointer text-xs font-bold text-slate-700">
              <input
                type="checkbox"
                checked={bottomNavShow}
                onChange={(e) => {
                  updateBottomNav({
                    ...configData.bottomNav,
                    show: e.target.checked,
                    items: bottomNavItems
                  });
                }}
                className="rounded text-indigo-650 focus:ring-indigo-400"
              />
              {lang === "tr" ? "Menüyü Göster" : "Show Menu"}
            </label>
          </div>

          {bottomNavShow && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {bottomNavItems.map((item: any, idx: number) => (
                <div key={idx} className="p-3 bg-zinc-50 border border-zinc-200 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded uppercase tracking-wider">
                      {idx + 1}. Buton
                    </span>
                    <select
                      value={item.icon || "Shop"}
                      onChange={(e) => {
                        const newItems = [...bottomNavItems];
                        newItems[idx] = { ...newItems[idx], icon: e.target.value };
                        updateBottomNav({ ...configData.bottomNav, items: newItems });
                      }}
                      className="text-[10px] font-bold text-slate-700 bg-white border border-zinc-200 rounded px-1 py-0.5"
                    >
                      <option value="Shop">Shop (⚡)</option>
                      <option value="Explore">Explore (👁️)</option>
                      <option value="Brands">Brands (🔖)</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-0.5">
                      <label className="text-[8px] font-bold text-slate-500 uppercase">{lang === "tr" ? "Buton Yazısı" : "Label"}</label>
                      <input
                        type="text"
                        value={item.label || ""}
                        onChange={(e) => {
                          const newItems = [...bottomNavItems];
                          newItems[idx] = { ...newItems[idx], label: e.target.value };
                          updateBottomNav({ ...configData.bottomNav, items: newItems });
                        }}
                        className="w-full px-2 py-1 border border-zinc-200 rounded text-xs bg-white"
                      />
                    </div>
                    <div className="space-y-0.5">
                      <label className="text-[8px] font-bold text-slate-500 uppercase">{lang === "tr" ? "Yönlendirme Linki" : "Link"}</label>
                      <input
                        type="text"
                        value={item.link || ""}
                        onChange={(e) => {
                          const newItems = [...bottomNavItems];
                          newItems[idx] = { ...newItems[idx], link: e.target.value };
                          updateBottomNav({ ...configData.bottomNav, items: newItems });
                        }}
                        className="w-full px-2 py-1 border border-zinc-200 rounded text-xs bg-white"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderTracksEditor = () => {
    const items = configData.tracks || [];
    const effectiveItems = items.length > 0 ? items : (configData.trackUrl ? [
      {
        trackUrl: configData.trackUrl || "",
        trackName: configData.trackName || "",
        artistName: configData.artistName || "",
        albumCoverUrl: configData.albumCoverUrl || "",
        trackDuration: configData.trackDuration || "3:45"
      }
    ] : []);

    const updateTracks = (newItems: any[]) => {
      setConfigData({
        ...configData,
        trackUrl: newItems[0]?.trackUrl || "",
        trackName: newItems[0]?.trackName || "",
        artistName: newItems[0]?.artistName || "",
        albumCoverUrl: newItems[0]?.albumCoverUrl || "",
        trackDuration: newItems[0]?.trackDuration || "3:45",
        tracks: newItems
      });
    };

    return (
      <div className="space-y-4">
        <label className="text-xs font-bold text-slate-700 block uppercase tracking-wide">
          {lang === "tr" ? "Şarkı Listesi (Playlist)" : "Song List (Playlist)"}
        </label>
        {effectiveItems.map((item: any, idx: number) => (
          <div key={idx} className="p-4 rounded-2xl border border-zinc-200 bg-zinc-50 relative group space-y-3 shadow-sm">
            <button
              type="button"
              onClick={() => {
                const newItems = [...effectiveItems];
                newItems.splice(idx, 1);
                updateTracks(newItems);
              }}
              className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-red-100 hover:bg-red-200 text-red-650 flex items-center justify-center transition-colors shadow-md border border-red-200 z-10"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
            <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md uppercase tracking-wider">
              {lang === "tr" ? `${idx + 1}. Parça` : `Track ${idx + 1}`}
            </span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-550 block uppercase">{lang === "tr" ? "Şarkı Adı" : "Track Name"}</label>
                <input
                  type="text"
                  placeholder={lang === "tr" ? "Gece Yağmuru" : "Night Rain"}
                  value={item.trackName || ""}
                  onChange={(e) => {
                    const newItems = [...effectiveItems];
                    newItems[idx] = { ...newItems[idx], trackName: e.target.value };
                    updateTracks(newItems);
                  }}
                  className="w-full px-3 py-2 rounded-xl border border-zinc-200 bg-white text-xs text-slate-800 font-medium focus:border-indigo-500 outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-550 block uppercase">{lang === "tr" ? "Sanatçı" : "Artist"}</label>
                <input
                  type="text"
                  placeholder={lang === "tr" ? "DJ Yağmur" : "DJ Rain"}
                  value={item.artistName || ""}
                  onChange={(e) => {
                    const newItems = [...effectiveItems];
                    newItems[idx] = { ...newItems[idx], artistName: e.target.value };
                    updateTracks(newItems);
                  }}
                  className="w-full px-3 py-2 rounded-xl border border-zinc-200 bg-white text-xs text-slate-800 font-medium focus:border-indigo-500 outline-none"
                />
              </div>
            </div>
            
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-550 block uppercase">{lang === "tr" ? "Spotify / SoundCloud / Ses Dosyası Linki" : "Track / Audio URL"}</label>
              <input
                type="text"
                placeholder="https://..."
                value={item.trackUrl || ""}
                onChange={(e) => {
                  const newItems = [...effectiveItems];
                  newItems[idx] = { ...newItems[idx], trackUrl: e.target.value };
                  updateTracks(newItems);
                }}
                className="w-full px-3 py-2 rounded-xl border border-zinc-200 bg-white text-xs text-slate-800 font-medium focus:border-indigo-500 outline-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-550 block uppercase">{lang === "tr" ? "Süre (örn: 3:45)" : "Duration (e.g. 3:45)"}</label>
                <input
                  type="text"
                  placeholder="3:45"
                  value={item.trackDuration || ""}
                  onChange={(e) => {
                    const newItems = [...effectiveItems];
                    newItems[idx] = { ...newItems[idx], trackDuration: e.target.value };
                    updateTracks(newItems);
                  }}
                  className="w-full px-3 py-2 rounded-xl border border-zinc-200 bg-white text-xs text-slate-800 font-medium focus:border-indigo-500 outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-550 block uppercase">{lang === "tr" ? "Kapak Görseli (URL veya Yükle)" : "Cover Image (URL or Upload)"}</label>
                <div className="flex gap-1.5 relative">
                  <input
                    type="text"
                    placeholder="https://..."
                    value={item.albumCoverUrl || ""}
                    onChange={(e) => {
                      const newItems = [...effectiveItems];
                      newItems[idx] = { ...newItems[idx], albumCoverUrl: e.target.value };
                      updateTracks(newItems);
                    }}
                    className="w-full px-3 py-2 rounded-xl border border-zinc-200 bg-white text-xs text-slate-800 font-medium focus:border-indigo-500 outline-none pr-16"
                  />
                  <label className="absolute right-0.5 top-0.5 bottom-0.5 flex items-center justify-center px-2 bg-zinc-100 hover:bg-zinc-250 text-zinc-700 text-[9px] font-bold rounded-lg cursor-pointer border border-zinc-200 transition-colors whitespace-nowrap">
                    {lang === "tr" ? "Seç" : "File"}
                    <input 
                      type="file" 
                      className="hidden" 
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          try {
                            const url = await handleFileUpload(file);
                            const newItems = [...effectiveItems];
                            newItems[idx] = { ...newItems[idx], albumCoverUrl: url };
                            updateTracks(newItems);
                          } catch (err: any) { showAlert(err.message); }
                        }
                      }}
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={() => {
            const newItems = [...effectiveItems, { trackUrl: "", trackName: "", artistName: "", albumCoverUrl: "", trackDuration: "3:45" }];
            updateTracks(newItems);
          }}
          className="w-full py-3 md:py-2.5 rounded-xl border-2 border-dashed border-indigo-200 text-indigo-600 font-bold text-xs hover:bg-indigo-50 transition-colors flex items-center justify-center gap-1.5"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>{lang === "tr" ? "Yeni Parça Ekle" : "Add New Track"}</span>
        </button>
      </div>
    );
  };

  const renderVideosEditor = () => {
    const items = configData.videos || [];
    const effectiveItems = items.length > 0 ? items : (configData.videoUrl ? [
      {
        videoUrl: configData.videoUrl || "",
        coverUrl: configData.coverUrl || "",
        title: configData.title || "",
        description: configData.description || "",
        actionUrl: configData.actionUrl || "",
        buttonText: configData.buttonText || "Tamamını İzle"
      }
    ] : []);

    const updateVideos = (newItems: any[]) => {
      setConfigData({
        ...configData,
        videoUrl: newItems[0]?.videoUrl || "",
        coverUrl: newItems[0]?.coverUrl || "",
        title: newItems[0]?.title || "",
        description: newItems[0]?.description || "",
        actionUrl: newItems[0]?.actionUrl || "",
        buttonText: newItems[0]?.buttonText || "Tamamını İzle",
        videos: newItems
      });
    };

    return (
      <div className="space-y-4">
        <label className="text-xs font-bold text-slate-700 block uppercase tracking-wide">
          {lang === "tr" ? "Video Listesi (Playlist)" : "Video List (Playlist)"}
        </label>
        {effectiveItems.map((item: any, idx: number) => (
          <div key={idx} className="p-4 rounded-2xl border border-zinc-200 bg-zinc-50 relative group space-y-3 shadow-sm">
            <button
              type="button"
              onClick={() => {
                const newItems = [...effectiveItems];
                newItems.splice(idx, 1);
                updateVideos(newItems);
              }}
              className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-red-100 hover:bg-red-200 text-red-650 flex items-center justify-center transition-colors shadow-md border border-red-200 z-10"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
            <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md uppercase tracking-wider">
              {lang === "tr" ? `${idx + 1}. Video` : `Video ${idx + 1}`}
            </span>
            
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-550 block uppercase">{lang === "tr" ? "Video Başlığı" : "Video Title"}</label>
              <input
                type="text"
                placeholder="UI/UX Masterclass Bölüm 1"
                value={item.title || ""}
                onChange={(e) => {
                  const newItems = [...effectiveItems];
                  newItems[idx] = { ...newItems[idx], title: e.target.value };
                  updateVideos(newItems);
                }}
                className="w-full px-3 py-2 rounded-xl border border-zinc-200 bg-white text-xs text-slate-800 font-medium focus:border-indigo-500 outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-550 block uppercase">{lang === "tr" ? "Video Açıklaması" : "Video Description"}</label>
              <textarea
                placeholder={lang === "tr" ? "Tasarım sistemleri..." : "Design systems..."}
                value={item.description || ""}
                rows={2}
                onChange={(e) => {
                  const newItems = [...effectiveItems];
                  newItems[idx] = { ...newItems[idx], description: e.target.value };
                  updateVideos(newItems);
                }}
                className="w-full px-3 py-2 rounded-xl border border-zinc-200 bg-white text-xs text-slate-800 font-medium focus:border-indigo-500 outline-none resize-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-550 block uppercase">{lang === "tr" ? "Video Linki (YouTube / MP4 vb.)" : "Video URL"}</label>
              <input
                type="text"
                placeholder="https://..."
                value={item.videoUrl || ""}
                onChange={(e) => {
                  const newItems = [...effectiveItems];
                  newItems[idx] = { ...newItems[idx], videoUrl: e.target.value };
                  updateVideos(newItems);
                }}
                className="w-full px-3 py-2 rounded-xl border border-zinc-200 bg-white text-xs text-slate-800 font-medium focus:border-indigo-500 outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-550 block uppercase">{lang === "tr" ? "Kapak Fotoğrafı (URL veya Yükle)" : "Cover Photo (URL or Upload)"}</label>
              <div className="flex gap-1.5 relative">
                <input
                  type="text"
                  placeholder="https://..."
                  value={item.coverUrl || ""}
                  onChange={(e) => {
                    const newItems = [...effectiveItems];
                    newItems[idx] = { ...newItems[idx], coverUrl: e.target.value };
                    updateVideos(newItems);
                  }}
                  className="w-full px-3 py-2 rounded-xl border border-zinc-200 bg-white text-xs text-slate-800 font-medium focus:border-indigo-500 outline-none pr-16"
                />
                <label className="absolute right-0.5 top-0.5 bottom-0.5 flex items-center justify-center px-2 bg-zinc-100 hover:bg-zinc-250 text-zinc-700 text-[9px] font-bold rounded-lg cursor-pointer border border-zinc-200 transition-colors whitespace-nowrap">
                  {lang === "tr" ? "Seç" : "File"}
                  <input 
                    type="file" 
                    className="hidden" 
                    accept="image/*"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        try {
                          const url = await handleFileUpload(file);
                          const newItems = [...effectiveItems];
                          newItems[idx] = { ...newItems[idx], coverUrl: url };
                          updateVideos(newItems);
                        } catch (err: any) { showAlert(err.message); }
                      }
                    }}
                  />
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-550 block uppercase">{lang === "tr" ? "Aksiyon Butonu Linki" : "Action Button URL"}</label>
                <input
                  type="text"
                  placeholder="https://..."
                  value={item.actionUrl || ""}
                  onChange={(e) => {
                    const newItems = [...effectiveItems];
                    newItems[idx] = { ...newItems[idx], actionUrl: e.target.value };
                    updateVideos(newItems);
                  }}
                  className="w-full px-3 py-2 rounded-xl border border-zinc-200 bg-white text-xs text-slate-800 font-medium focus:border-indigo-500 outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-550 block uppercase">{lang === "tr" ? "Buton Metni" : "Button Text"}</label>
                <input
                  type="text"
                  placeholder="Tamamını İzle"
                  value={item.buttonText || ""}
                  onChange={(e) => {
                    const newItems = [...effectiveItems];
                    newItems[idx] = { ...newItems[idx], buttonText: e.target.value };
                    updateVideos(newItems);
                  }}
                  className="w-full px-3 py-2 rounded-xl border border-zinc-200 bg-white text-xs text-slate-800 font-medium focus:border-indigo-500 outline-none"
                />
              </div>
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={() => {
            const newItems = [...effectiveItems, { videoUrl: "", coverUrl: "", title: "", description: "", actionUrl: "", buttonText: "Tamamını İzle" }];
            updateVideos(newItems);
          }}
          className="w-full py-3 md:py-2.5 rounded-xl border-2 border-dashed border-indigo-200 text-indigo-600 font-bold text-xs hover:bg-indigo-50 transition-colors flex items-center justify-center gap-1.5"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>{lang === "tr" ? "Yeni Video Ekle" : "Add New Video"}</span>
        </button>
      </div>
    );
  };

  const getAddonDetails = () => {
    switch (addon.addonType) {
      case "CORP_EXEC": return { icon: <Store className="h-5 w-5" />, title: lang === "tr" ? "Mağaza" : "Store" };
      case "PREMIUM_VIDEO": return { icon: <Store className="h-5 w-5" />, title: lang === "tr" ? "Premium Video" : "Premium Video" };
      case "QA": return { icon: <FileQuestion className="h-5 w-5" />, title: lang === "tr" ? "Soru-Cevap" : "Q&A" };
      case "COUNTDOWN": return { icon: <Clock className="h-5 w-5" />, title: lang === "tr" ? "Geri Sayım" : "Countdown" };
      case "PORTFOLIO": return { icon: <Briefcase className="h-5 w-5" />, title: lang === "tr" ? "Portfolyo" : "Portfolio" };
      case "FAQ": return { icon: <HelpCircle className="h-5 w-5" />, title: "FAQ" };
      case "MAP": return { icon: <MapPin className="h-5 w-5" />, title: lang === "tr" ? "Harita" : "Map" };
      case "WHATSAPP": return { icon: <MessageCircle className="h-5 w-5" />, title: "WhatsApp" };
      case "RETRO_CASSETTE": return { icon: <Music className="h-5 w-5" />, title: "Retro Kaset Çalar" };
      case "SPOTIFY_CLASSIC": return { icon: <Music className="h-5 w-5" />, title: "Spotify Classic Player" };
      case "VINYL_RETRO": return { icon: <Music className="h-5 w-5" />, title: "Retro Plak Çalar" };
      case "GLASS_AUDIO": return { icon: <Music className="h-5 w-5" />, title: "Modern Cam Efekti" };
      case "NEON_CYBERPUNK": return { icon: <Music className="h-5 w-5" />, title: "Neon Cyberpunk Player" };
      case "MUSIC_PODCAST": return { icon: <Music className="h-5 w-5" />, title: "Müzik & Podcast Çalar" };
      case "PORTFOLIO_GALLERY": return { icon: <Image className="h-5 w-5" />, title: "Portfolyo & Galeri" };
      case "COUNTDOWN_LAUNCH": return { icon: <Clock className="h-5 w-5" />, title: "Geri Sayım & Lansman" };
      default: return { icon: <Store className="h-5 w-5" />, title: "Add-on" };
    }
  };

  const { icon, title } = getAddonDetails();

 const renderFields = () => {
 const renderSlugAndAvatar = () => (
 <div className="space-y-4 pt-2 border-b border-zinc-200 pb-6 mb-6">
 <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
 {lang === "tr" ? "Genel Ayarlar" : "General Settings"}
 </h4>
 
 <div className="space-y-1.5">
 <label className="text-xs font-bold text-slate-700 block uppercase tracking-wide">{lang === "tr" ? "Profil Fotoğrafı (URL veya Dosya)" : "Profile Image"}</label>
 <div className="flex gap-2">
 <input
 type="text"
 value={configData["avatarUrl"] || ""}
 onChange={(e) => setConfigData({ ...configData, avatarUrl: e.target.value })}
 placeholder="https://..."
 className="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-zinc-50 text-sm text-slate-800 font-medium focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all shadow-sm"
 />
 <label className="flex items-center justify-center px-4 py-3 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-sm font-bold rounded-xl cursor-pointer border border-zinc-200 transition-colors whitespace-nowrap">
 {lang === "tr" ? "Dosya Seç" : "Upload"}
 <input 
 type="file" 
 className="hidden" 
 accept="image/*"
 onChange={async (e) => {
 const file = e.target.files?.[0];
 if (file) {
 try {
 const url = await handleFileUpload(file);
 setConfigData({ ...configData, avatarUrl: url });
 } catch (err: any) { showAlert(err.message); }
 }
 }}
 />
 </label>
 </div>
 </div>
 </div>
 );

 let specificFields = null;

  switch (addon.addonType) {
    case "ADVANCED_STOREFRONT":
      specificFields = renderAdvancedStorefrontEditor();
      break;
    case "MINI_STORE":
    case "NEO_BRUTAL":
    case "ORGANIC":
    case "RETRO":
    case "Y2K":
      specificFields = (
 <>
 <div className="space-y-4 pt-2 border-b border-zinc-200 pb-6 mb-6">
 <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
 <Store className="h-4 w-4" />
 {lang === "tr" ? "Mağaza Genel Ayarları" : "Store Settings"}
 </h4>
 {renderInput("storeTitle", lang === "tr" ? "Mağaza Başlığı" : "Store Title", lang === "tr" ? "Örn: Premium İçeriklerim" : "Store Name")}
 
 
 <div className="space-y-1.5 mb-4">
 <label className="text-xs font-bold text-slate-700 block uppercase tracking-wide">{lang === "tr" ? "Profil Fotoğrafı (URL veya Dosya)" : "Profile Image"}</label>
 <div className="flex gap-2">
 <input
 type="text"
 value={configData["storeAvatarUrl"] || ""}
 onChange={(e) => setConfigData({ ...configData, storeAvatarUrl: e.target.value })}
 placeholder="https://..."
 className="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-zinc-50 text-sm text-slate-800 font-medium focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all shadow-sm"
 />
 <label className="flex items-center justify-center px-4 py-3 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-sm font-bold rounded-xl cursor-pointer border border-zinc-200 transition-colors whitespace-nowrap">
 {lang === "tr" ? "Dosya Seç" : "Upload"}
 <input 
 type="file" 
 className="hidden" 
 accept="image/*"
 onChange={async (e) => {
 const file = e.target.files?.[0];
 if (file) {
 try {
 const url = await handleFileUpload(file);
 setConfigData({ ...configData, storeAvatarUrl: url });
 } catch (err: any) { showAlert(err.message); }
 }
 }}
 />
 </label>
 </div>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
 {renderInput("storeUsername", lang === "tr" ? "Mağaza Kullanıcı Adı" : "Store Username", "@username")}
 {renderInput("buyButtonText", lang === "tr" ? "Satın Al Butonu Metni" : "Buy Button Text", "Satın Al")}
 </div>
 {renderTextarea("storeBio", lang === "tr" ? "Mağaza Açıklaması (Bio)" : "Store Bio", lang === "tr" ? "Yazar & Kariyer Danışmanı" : "Author & Consultant")}

 <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
 {renderInput("currency", lang === "tr" ? "Para Birimi" : "Currency", "₺, $, €")}
 <div className="space-y-1.5">
 <label className="text-xs font-bold text-slate-700 block uppercase tracking-wide">{lang === "tr" ? "Mağaza Teması" : "Store Theme"}</label>
 <select
 value={configData["theme"] || getDefaultTheme(addon.addonType)}
 onChange={(e) => setConfigData({ ...configData, theme: e.target.value })}
 className="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-zinc-50 text-sm text-slate-800 font-medium focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all shadow-sm"
 >
 <option value="classic">Classic Minimal</option>
 <option value="vibrant-pop">Vibrant Pop</option>
 <option value="glassmorphism">Glassmorphism</option>
 <option value="neo-brutalism">Neo Brutalism</option>
 <option value="dark-drill">Dark Drill</option>
 <option value="organic-earth">Organic Earth</option>
 <option value="retro-arcade">Retro Arcade</option>
 <option value="dark-academia">Dark Academia</option>
 <option value="y2k-holographic">Y2K Holographic</option>
 <option value="premium-creator">Premium Creator</option>
 </select>
 </div>
 </div>
 </div>

  <div className="space-y-4">
  <div className="flex flex-wrap items-center justify-between">
  <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
  <ShoppingBag className="h-4 w-4" />
  {lang === "tr" ? "Ürün Yönetimi (Dinamik)" : "Product Management (Dynamic)"}
  </h4>
  </div>
 
  {/* Add New Product Form */}
  <div className="p-4 md:p-5 rounded-2xl border-2 border-dashed border-indigo-200 bg-indigo-50/50 space-y-4">
  <h5 className="text-sm font-bold text-indigo-700 flex items-center gap-2">
  <Plus className="h-4 w-4" />
  {lang === "tr" ? "Yeni Ürün Ekle" : "Add New Product"}
  </h5>
  <div className="space-y-3">
  <input 
    type="text" 
    value={newProdTitle}
    onChange={(e) => setNewProdTitle(e.target.value)}
    placeholder={lang === "tr" ? "Ürün Adı" : "Product Name"} 
    className="w-full p-3 rounded-xl border border-indigo-100 bg-white text-sm font-medium focus:border-indigo-500 outline-none" 
  />
  <div className="flex gap-2">
  <input 
    type="number" 
    value={newProdPrice}
    onChange={(e) => setNewProdPrice(e.target.value)}
    placeholder={lang === "tr" ? "Fiyat (₺)" : "Price"} 
    className="w-full p-3 rounded-xl border border-indigo-100 bg-white text-sm font-medium focus:border-indigo-500 outline-none" 
  />
  </div>
  <div className="flex gap-2">
  <div className="w-full flex gap-1 relative">
  <input 
    type="text" 
    value={newProdImageUrl}
    onChange={(e) => setNewProdImageUrl(e.target.value)}
    placeholder={lang === "tr" ? "Ürün Görseli (URL)" : "Product Image (URL)"} 
    className="w-full p-3 rounded-xl border border-indigo-100 bg-white text-sm font-medium focus:border-indigo-500 outline-none pr-24" 
  />
  <label className="absolute right-1 top-1 bottom-1 flex items-center justify-center px-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 text-[11px] font-bold rounded-lg cursor-pointer transition-colors">
  {lang === "tr" ? "Dosya Seç" : "Upload"}
  <input 
  type="file" 
  className="hidden" 
  accept="image/*"
  onChange={async (e) => {
  const file = e.target.files?.[0];
  if (file) {
  try {
  const url = await handleFileUpload(file);
  setNewProdImageUrl(url);
  } catch (err: any) { showAlert(err.message); }
  }
  }}
  />
  </label>
  </div>
  </div>
  <input 
    type="text" 
    value={newProdBuyLink}
    onChange={(e) => setNewProdBuyLink(e.target.value)}
    placeholder={lang === "tr" ? "Satın Alma Linki (Stripe/Shopier vb.)" : "Purchase Link (Stripe/Shopier, etc.)"} 
    className="w-full p-3 rounded-xl border border-indigo-100 bg-white text-sm font-medium focus:border-indigo-500 outline-none" 
  />
  <button 
  type="button"
  onClick={() => {
    if (!newProdTitle || !newProdPrice) {
      showAlert(lang === "tr" ? "Lütfen başlık ve fiyat girin" : "Please enter title and price");
      return;
    }
    const newProduct = {
      id: Date.now().toString(),
      title: newProdTitle,
      price: parseFloat(newProdPrice) || 0,
      imageUrl: newProdImageUrl || null,
      buyLink: newProdBuyLink || "",
      type: "PRODUCT"
    };
    const currentProducts = configData.products || [];
    setConfigData({
      ...configData,
      products: [...currentProducts, newProduct]
    });
    setNewProdTitle("");
    setNewProdPrice("");
    setNewProdImageUrl("");
    setNewProdBuyLink("");
    showAlert(lang === "tr" ? "Ürün eklendi!" : "Product added!");
  }}
  className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-colors shadow-sm"
  >
  {lang === "tr" ? "Ürünü Listeye Ekle" : "Add Product to List"}
  </button>
  </div>
  </div>
 
  {/* Product List */}
  <div className="space-y-3">
  {(!configData.products || configData.products.length === 0) ? (
  <div className="text-center py-6 text-slate-500 text-sm">
  {lang === "tr" ? "Henüz ürün eklenmemiş." : "No products added yet."}
  </div>
  ) : (
  configData.products.map((p: any) => (
  <div key={p.id} className="flex flex-wrap items-center justify-between p-3 rounded-xl border border-zinc-200 bg-white shadow-sm">
  <div className="flex items-center gap-3">
  <div className="w-12 h-12 rounded-lg bg-zinc-100 overflow-hidden flex-shrink-0">
  {p.imageUrl ? (
  <img src={p.imageUrl} alt={p.title} className="w-full h-full object-cover" />
  ) : (
  <ShoppingBag className="w-5 h-5 m-auto mt-3.5 text-zinc-400" />
  )}
  </div>
  <div>
  <p className="font-bold text-slate-800 text-sm line-clamp-1">{p.title}</p>
  <div className="flex items-center gap-2 mt-0.5">
  <span className="text-xs font-bold text-emerald-600">{p.price}₺</span>
  {p.buyLink && (
    <span className="text-[10px] text-zinc-400 truncate max-w-[150px]">{p.buyLink}</span>
  )}
  </div>
  </div>
  </div>
  <button 
  type="button"
  onClick={() => {
    const newProducts = (configData.products || []).filter((prod: any) => prod.id !== p.id);
    setConfigData({ ...configData, products: newProducts });
  }}
  className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
  >
  <Trash2 className="h-4 w-4" />
  </button>
  </div>
  ))
  )}
  </div>
  </div>
  </>
  );
 break;
 case "CORP_EXEC":
 specificFields = (
 <>
 <div className="space-y-4 pt-2 border-b border-zinc-200 pb-6 mb-6">
 <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
 <Briefcase className="h-4 w-4" />
 {lang === "tr" ? "Yönetici Kartı Bilgileri" : "Executive Card Information"}
 </h4>
 
 <div className="space-y-1.5 mb-4">
 <label className="text-xs font-bold text-slate-700 block uppercase tracking-wide">{lang === "tr" ? "Profil Fotoğrafı" : "Profile Image"}</label>
 <div className="flex gap-2">
 <input
 type="text"
 value={configData["storeAvatarUrl"] || ""}
 onChange={(e) => setConfigData({ ...configData, storeAvatarUrl: e.target.value })}
 placeholder="https://..."
 className="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-zinc-50 text-sm text-slate-800 font-medium focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all shadow-sm"
 />
 <label className="flex items-center justify-center px-4 py-3 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-sm font-bold rounded-xl cursor-pointer border border-zinc-200 transition-colors whitespace-nowrap">
 {lang === "tr" ? "Dosya Seç" : "Upload"}
 <input 
 type="file" 
 className="hidden" 
 accept="image/*"
 onChange={async (e) => {
 const file = e.target.files?.[0];
 if (file) {
 try {
 const url = await handleFileUpload(file);
 setConfigData({ ...configData, storeAvatarUrl: url });
 } catch (err: any) { showAlert(err.message); }
 }
 }}
 />
 </label>
 </div>
 </div>

 <div className="space-y-1.5 mb-4">
 <label className="text-xs font-bold text-slate-700 block uppercase tracking-wide">{lang === "tr" ? "Kapak Görseli (Banner)" : "Cover Image (Banner)"}</label>
 <div className="flex gap-2">
 <input
 type="text"
 value={configData["storeCoverUrl"] || ""}
 onChange={(e) => setConfigData({ ...configData, storeCoverUrl: e.target.value })}
 placeholder="https://..."
 className="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-zinc-50 text-sm text-slate-800 font-medium focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all shadow-sm"
 />
 <label className="flex items-center justify-center px-4 py-3 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-sm font-bold rounded-xl cursor-pointer border border-zinc-200 transition-colors whitespace-nowrap">
 {lang === "tr" ? "Dosya Seç" : "Upload"}
 <input 
 type="file" 
 className="hidden" 
 accept="image/*"
 onChange={async (e) => {
 const file = e.target.files?.[0];
 if (file) {
 try {
 const url = await handleFileUpload(file);
 setConfigData({ ...configData, storeCoverUrl: url });
 } catch (err: any) { showAlert(err.message); }
 }
 }}
 />
 </label>
 </div>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
 {renderInput("storeUsername", lang === "tr" ? "Kullanıcı Adı / Ünvan" : "Username / Handle", "@ceo.exec")}
 {renderInput("storeBio", lang === "tr" ? "Alt Başlık / Görev" : "Subtitle / Role", "C-Level Executive Consultant")}
 </div>
 <div className="border-t border-zinc-150 pt-4 mt-4">
 {renderCardsEditor()}
 </div>
 </div>
 </>
 );
 break;

  case "QA":
  specificFields = (
  <>
  {renderInput("boxTitle", lang === "tr" ? "Modül Başlığı" : "Module Title", lang === "tr" ? "Soru & Cevap (AMA)" : "Ask Me Anything")}
  {renderQaEditor()}
  </>
  );
  break;

  case "PREMIUM_VIDEO":
    specificFields = (
      <>
        <div className="space-y-4">
          <div className="space-y-1.5 mb-4">
            <label className="text-xs font-bold text-slate-700 block uppercase tracking-wide">
              {lang === "tr" ? "Arka Plan Rengi" : "Background Color"}
            </label>
            <div className="flex gap-2">
              <input
                type="color"
                value={configData.backgroundColor || "#000000"}
                onChange={(e) => setConfigData({ ...configData, backgroundColor: e.target.value })}
                className="w-12 h-10 p-0 border border-zinc-200 rounded-xl cursor-pointer"
              />
              <input
                type="text"
                value={configData.backgroundColor || "#000000"}
                onChange={(e) => setConfigData({ ...configData, backgroundColor: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 bg-zinc-50 text-sm text-slate-800 font-medium focus:bg-white focus:border-indigo-500 outline-none transition-all shadow-sm"
              />
            </div>
          </div>
          {renderVideosEditor()}
        </div>
      </>
    );
    break;
 
 case "COUNTDOWN":
 specificFields = (
 <>
 {renderInput("title", lang === "tr" ? "Etkinlik Başlığı" : "Event Title", lang === "tr" ? "Büyük Lansman" : "Big Launch")}
 {renderInput("targetDate", lang === "tr" ? "Hedef Tarih (Örn: 2026-12-31T23:59:59)" : "Target Date", "2026-12-31T23:59:59")}
 {renderTextarea("description", lang === "tr" ? "Açıklama" : "Description", lang === "tr" ? "Yeni ürünümüz çok yakında sizlerle!" : "Our new product is coming soon!")}
 {renderInput("buttonUrl", lang === "tr" ? "Yönlendirme Linki (Opsiyonel)" : "Redirect URL (Optional)", "https://...")}
 {renderInput("buttonText", lang === "tr" ? "Buton Yazısı (Opsiyonel)" : "Button Text (Optional)", lang === "tr" ? "Detaylar" : "Details")}
 </>
 );
 break;
 case "PORTFOLIO":
 specificFields = (
 <>
 {renderInput("title", lang === "tr" ? "Başlık" : "Title", lang === "tr" ? "Benim Çalışmalarım" : "My Works")}
 {renderTextarea("description", lang === "tr" ? "Kısa Biyografi / Açıklama" : "Short Bio / Description", lang === "tr" ? "Yaratıcı tasarımcı ve geliştirici." : "Creative designer and developer.")}
 {renderInput("behanceUrl", lang === "tr" ? "Behance Profil Linki" : "Behance URL", "https://behance.net/...")}
 {renderInput("dribbbleUrl", lang === "tr" ? "Dribbble Profil Linki" : "Dribbble URL", "https://dribbble.com/...")}
 {renderInput("githubUrl", lang === "tr" ? "GitHub Profil Linki" : "GitHub URL", "https://github.com/...")}
 {renderInput("buttonText", lang === "tr" ? "Buton Yazısı" : "Button Text", lang === "tr" ? "Projelerime Göz At" : "View Projects")}
 </>
 );
 break;
 case "FAQ":
 specificFields = (
 <>
 {renderInput("title", lang === "tr" ? "S.S.S. Başlığı" : "FAQ Title", "Sıkça Sorulan Sorular")}
 {renderTextarea("questionsText", lang === "tr" ? "Sorular ve Cevaplar (Format: Soru|Cevap; Soru|Cevap;)" : "Questions & Answers (Format: Q|A; Q|A;)", "Kargo ne zaman ulaşır?|2-3 iş günü içinde.; İade var mı?|Evet, 14 gün içinde.;")}
 {renderInput("contactUrl", lang === "tr" ? "İletişim Linki" : "Contact URL", "mailto:info@domain.com")}
 {renderInput("buttonText", lang === "tr" ? "İletişim Butonu Yazısı" : "Contact Button Text", lang === "tr" ? "Bize Ulaşın" : "Contact Us")}
 </>
 );
 break;
 case "MAP":
 specificFields = (
 <>
 {renderInput("title", lang === "tr" ? "Lokasyon Başlığı" : "Location Title", lang === "tr" ? "Bizi Ziyaret Edin" : "Visit Us")}
 {renderTextarea("address", lang === "tr" ? "Açık Adres" : "Full Address", "İstanbul, Türkiye")}
 {renderInput("googleMapsUrl", lang === "tr" ? "Google Maps Linki" : "Google Maps URL", "https://maps.app.goo.gl/...")}
 {renderInput("buttonText", lang === "tr" ? "Yol Tarifi Butonu" : "Directions Button Text", lang === "tr" ? "Yol Tarifi Al" : "Get Directions")}
 </>
 );
 break;
 case "WHATSAPP":
 specificFields = (
 <>
 {renderInput("title", lang === "tr" ? "Başlık" : "Title", "WhatsApp İletişim")}
 {renderInput("phoneNumber", lang === "tr" ? "Telefon Numarası (Ülke kodu ile)" : "Phone Number (with country code)", "905551234567")}
 {renderTextarea("welcomeMessage", lang === "tr" ? "Karşılama Mesajı" : "Welcome Message", lang === "tr" ? "Merhaba, size nasıl yardımcı olabilirim?" : "Hello, how can I help you?")}
 {renderInput("buttonText", lang === "tr" ? "Buton Yazısı" : "Button Text", lang === "tr" ? "Sohbete Başla" : "Start Chat")}
 </>
 );
 break;
 // ── MUSIC & AUDIO PLUGINS ──
 case "RETRO_CASSETTE":
 case "SPOTIFY_CLASSIC":
 case "VINYL_RETRO":
 case "GLASS_AUDIO":
 case "NEON_CYBERPUNK":  case "MUSIC_PODCAST":
 specificFields = (
 <>
 <div className="space-y-4 pt-2 border-b border-zinc-200 pb-6 mb-6">
 <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
 <Music className="h-4 w-4" />
 {lang === "tr" ? "Müzik & Ses Ayarları" : "Music & Audio Settings"}
 </h4>
 {renderInput("title", lang === "tr" ? "Modül Başlığı" : "Module Title", lang === "tr" ? "Şarkı / Podcast Adı" : "Song / Podcast Name")}
 {renderTextarea("description", lang === "tr" ? "Açıklama" : "Description", lang === "tr" ? "Bu parça hakkında kısa bir açıklama..." : "A short description about this track...")}
 {renderInput("username", lang === "tr" ? "Görünen Kullanıcı Adı" : "Display Username", "@username")}
 {renderInput("bio", lang === "tr" ? "Kısa Biyografi" : "Short Bio", lang === "tr" ? "Beatmaker & Prodüktör" : "Beatmaker & Producer")}
 </div>

 <div className="space-y-4 pt-2 border-b border-zinc-200 pb-6 mb-6">
 {renderTracksEditor()}
 </div>

 <div className="space-y-4 pt-2">
 <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
 🎨 {lang === "tr" ? "Görsel Özelleştirme" : "Visual Customization"}
 </h4>
 {renderInput("accentColor", lang === "tr" ? "Vurgu Rengi (HEX, Opsiyonel)" : "Accent Color (HEX, Optional)", "#1db954")}
 </div>
 </>
 );
 break;

 // ── PORTFOLIO & GALLERY ──
 case "PORTFOLIO_GALLERY":
    {
      const images = configData.galleryImages || [
        configData.galleryImage1,
        configData.galleryImage2,
        configData.galleryImage3,
        configData.galleryImage4
      ].filter(Boolean);

      const updateImages = (newImages: string[]) => {
        setConfigData({
          ...configData,
          galleryImage1: newImages[0] || "",
          galleryImage2: newImages[1] || "",
          galleryImage3: newImages[2] || "",
          galleryImage4: newImages[3] || "",
          galleryImages: newImages
        });
      };

      specificFields = (
        <>
          <div className="space-y-4 pt-2 border-b border-zinc-200 pb-6 mb-6">
            <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <Image className="h-4 w-4" />
              {lang === "tr" ? "Portfolyo Ayarları" : "Portfolio Settings"}
            </h4>
            {renderInput("title", lang === "tr" ? "Galeri Başlığı" : "Gallery Title", lang === "tr" ? "Çalışmalarım" : "My Works")}
            {renderTextarea("description", lang === "tr" ? "Açıklama" : "Description", lang === "tr" ? "Tasarımlarım ve projelerim." : "My designs and projects.")}
            {renderInput("username", lang === "tr" ? "Görünen Kullanıcı Adı" : "Display Username", "@username")}
            {renderInput("bio", lang === "tr" ? "Kısa Biyografi" : "Short Bio", "Visual Artist & Designer")}
          </div>

          <div className="space-y-4 pt-2 border-b border-zinc-200 pb-6 mb-6">
            <label className="text-xs font-bold text-slate-700 block uppercase tracking-wide mb-2">
              {lang === "tr" ? "Galeri Görselleri" : "Gallery Images"}
            </label>
            <div className="space-y-3">
              {images.map((imgUrl: string, idx: number) => (
                <div key={idx} className="p-4 rounded-2xl border border-zinc-200 bg-zinc-50 relative group space-y-3 shadow-sm">
                  <button
                    type="button"
                    onClick={() => {
                      const newImages = [...images];
                      newImages.splice(idx, 1);
                      updateImages(newImages);
                    }}
                    className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-red-100 hover:bg-red-200 text-red-655 flex items-center justify-center transition-colors shadow-md border border-red-200 z-10"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>

                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-indigo-650 bg-indigo-50 px-2 py-1 rounded-md uppercase tracking-wider">
                      {lang === "tr" ? `${idx + 1}. Görsel` : `Image ${idx + 1}`}
                    </span>
                    
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => {
                          const newImages = [...images];
                          const temp = newImages[idx];
                          newImages[idx] = newImages[idx - 1];
                          newImages[idx - 1] = temp;
                          updateImages(newImages);
                        }}
                        className="p-1 rounded bg-zinc-200 hover:bg-zinc-300 text-zinc-700 disabled:opacity-40 disabled:hover:bg-zinc-200 transition-colors text-xs font-bold"
                      >
                        ▲
                      </button>
                      <button
                        type="button"
                        disabled={idx === images.length - 1}
                        onClick={() => {
                          const newImages = [...images];
                          const temp = newImages[idx];
                          newImages[idx] = newImages[idx + 1];
                          newImages[idx + 1] = temp;
                          updateImages(newImages);
                        }}
                        className="p-1 rounded bg-zinc-200 hover:bg-zinc-300 text-zinc-700 disabled:opacity-40 disabled:hover:bg-zinc-200 transition-colors text-xs font-bold"
                      >
                        ▼
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {imgUrl && (
                      <img src={imgUrl} alt="Preview" className="w-12 h-12 rounded-lg object-cover bg-zinc-100 flex-shrink-0" />
                    )}
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        value={imgUrl || ""}
                        onChange={(e) => {
                          const newImages = [...images];
                          newImages[idx] = e.target.value;
                          updateImages(newImages);
                        }}
                        placeholder="https://..."
                        className="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-white text-sm text-slate-800 font-medium focus:border-indigo-500 outline-none pr-24"
                      />
                      <label className="absolute right-1 top-1 bottom-1 flex items-center justify-center px-3 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-sm font-bold rounded-lg cursor-pointer transition-colors">
                        {lang === "tr" ? "Dosya Seç" : "Upload"}
                        <input 
                          type="file" 
                          className="hidden" 
                          accept="image/*"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              try {
                                const url = await handleFileUpload(file);
                                const newImages = [...images];
                                newImages[idx] = url;
                                updateImages(newImages);
                              } catch (err: any) { showAlert(err.message); }
                            }
                          }}
                        />
                      </label>
                    </div>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={() => {
                  const newImages = [...images, ""];
                  updateImages(newImages);
                }}
                className="w-full py-3 md:py-2.5 rounded-xl border-2 border-dashed border-indigo-200 text-indigo-600 font-bold text-xs hover:bg-indigo-50 transition-colors flex items-center justify-center gap-1.5"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>{lang === "tr" ? "Yeni Görsel Ekle" : "Add New Image"}</span>
              </button>
            </div>
          </div>

          <div className="space-y-4 pt-2">
            <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              🔗 {lang === "tr" ? "Bağlantılar" : "Links"}
            </h4>
            {renderInput("behanceUrl", lang === "tr" ? "Behance Linki (Opsiyonel)" : "Behance URL (Optional)", "https://behance.net/...")}
            {renderInput("dribbbleUrl", lang === "tr" ? "Dribbble Linki (Opsiyonel)" : "Dribbble URL (Optional)", "https://dribbble.com/...")}
            {renderInput("websiteUrl", lang === "tr" ? "Web Sitesi (Opsiyonel)" : "Website (Optional)", "https://...")}
          </div>
        </>
      );
    }
    break;

 // ── COUNTDOWN & LAUNCH ──
 case "COUNTDOWN_LAUNCH":
 specificFields = (
 <>
 <div className="space-y-4 pt-2 border-b border-zinc-200 pb-6 mb-6">
 <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
 <Clock className="h-4 w-4" />
 {lang === "tr" ? "Geri Sayım Ayarları" : "Countdown Settings"}
 </h4>
 {renderInput("title", lang === "tr" ? "Etkinlik / Lansman Başlığı" : "Event / Launch Title", lang === "tr" ? "Büyük Lansman" : "Big Launch")}
 {renderTextarea("description", lang === "tr" ? "Açıklama" : "Description", lang === "tr" ? "Yeni ürünümüz çok yakında sizlerle!" : "Our new product is coming soon!")}
 {renderInput("username", lang === "tr" ? "Görünen Kullanıcı Adı" : "Display Username", "@username")}
 {renderInput("bio", lang === "tr" ? "Kısa Biyografi" : "Short Bio", "Product Launcher & Innovator")}
 </div>

 <div className="space-y-4 pt-2">
 <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
 ⏰ {lang === "tr" ? "Zamanlayıcı" : "Timer"}
 </h4>
 {renderInput("targetDate", lang === "tr" ? "Hedef Tarih & Saat" : "Target Date & Time", "2026-12-31T23:59:59")}
 {renderInput("buttonUrl", lang === "tr" ? "Yönlendirme Linki (Opsiyonel)" : "Redirect URL (Optional)", "https://...")}
 {renderInput("buttonText", lang === "tr" ? "Buton Yazısı (Opsiyonel)" : "Button Text (Optional)", lang === "tr" ? "Detaylar" : "Details")}
 </div>
 </>
 );
 break;

 

 default:
 specificFields = (
 <div className="p-3 md:p-6 bg-zinc-50 border border-zinc-200 text-zinc-600 rounded-2xl text-sm text-center">
 {lang === "tr" ? "Bu eklenti için özel ayar bulunmuyor." : "No specific settings for this add-on."}
 </div>
 );
 }
 
 return (
 <div className="space-y-6">
 {addon.addonType !== "MINI_STORE" && 
  addon.addonType !== "NEO_BRUTAL" && 
  addon.addonType !== "ORGANIC" && 
  addon.addonType !== "RETRO" && 
  addon.addonType !== "Y2K" ? renderSlugAndAvatar() : null}
 {specificFields}
 </div>
 );
 };

  const renderLivePreview = () => {
  switch (addon.addonType) {
  case "ADVANCED_STOREFRONT":
    return (
      <div className="w-full h-full relative overflow-hidden flex flex-col">
        <AdvancedStorefrontView config={configData} lang={lang} />
      </div>
    );
  case "MINI_STORE":
  case "NEO_BRUTAL":
  case "ORGANIC":
  case "RETRO":
  case "Y2K":

  return (
  <div className="w-full h-full relative overflow-hidden flex flex-col">
  <StorefrontPreview 
  theme={configData.theme || getDefaultTheme(addon.addonType)} 
  products={((configData.products && Array.isArray(configData.products)) ? configData.products : products).map((p: any) => ({
  id: p.id,
  title: p.title,
  type: p.type || "PRODUCT",
  price: p.price.toString(),
  imageUrl: p.imageUrl || p.fileUrl,
  description: p.description || "",
  buyLink: p.buyLink || ""
  }))}
  storeTitle={configData.storeTitle || (lang === "tr" ? "Mağazam" : "My Store")}
  username={configData.storeUsername}
  bio={configData.storeBio}
  avatarUrl={configData.storeAvatarUrl}
  buyButtonText={configData.buyButtonText}
  addonType={addon.addonType}
  />
  </div>
  );
  case "CORP_EXEC":
    const previewCards = configData.cards || (configData.title ? [{ title: configData.title, description: configData.description, buttonText: configData.buttonText, buttonUrl: configData.buttonUrl }] : []);
    return (
      <div className="w-full h-full bg-slate-50 flex flex-col relative z-0 text-slate-800 overflow-y-auto no-scrollbar">
        {/* Cover Header */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-950 h-32 w-full flex flex-col justify-end p-4 relative shrink-0">
          {configData.storeCoverUrl && (
            <img src={configData.storeCoverUrl} className="absolute inset-0 w-full h-full object-cover opacity-65" />
          )}
          <div className="absolute top-3 right-3 px-2 py-0.5 bg-blue-600 text-[8px] font-bold text-white rounded tracking-wide shadow-sm uppercase">PRO</div>
        </div>
        
        {/* Profile Details */}
        <div className="flex flex-col items-center -mt-10 px-6 mb-4 relative z-10 shrink-0">
          <div className="w-20 h-20 bg-white rounded-full border-4 border-white overflow-hidden shadow-md">
            <img src={configData.storeAvatarUrl || "/placeholder.png"} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder.png" }} />
          </div>
          <span className="text-sm font-extrabold mt-2 text-slate-800">{configData.storeUsername || ("@" + username)}</span>
          <p className="text-xs text-slate-500 font-medium tracking-tight mt-0.5">{configData.storeBio || "C-Level Executive Consultant"}</p>
        </div>
        
        {/* Cards List */}
        <div className="px-6 pb-6 space-y-4 shrink-0">
          {previewCards.map((card: any, idx: number) => (
            <div key={idx} className="bg-white shadow-xl rounded-2xl p-5 border border-slate-100 space-y-4">
              <div className="text-center md:text-left">
                <h4 className="text-sm font-extrabold text-slate-800 tracking-tight leading-snug">{card.title || "Q3 Executive Briefing"}</h4>
                <p className="text-xs text-slate-400 font-medium mt-1 leading-relaxed">{card.description || "Corporate & Strategy"}</p>
              </div>
              <button 
                type="button" 
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl tracking-wide transition-all border-0 shadow-md shadow-blue-500/10 cursor-pointer"
              >
                {card.buttonText || "Schedule Consultation"}
              </button>
            </div>
          ))}
        </div>
      </div>
    );


  case "QA":
  {
    const qaPairs = configData.qaPairs || [];
    return (
      <div className="w-full h-full bg-zinc-50 flex flex-col p-4 overflow-y-auto no-scrollbar">
        <div className="w-full p-4 bg-white rounded-3xl border border-zinc-200 shadow-lg flex flex-col space-y-4">
          <div className="flex items-center gap-3 border-b border-zinc-150 pb-3">
            {configData.avatarUrl ? (
              <img src={configData.avatarUrl} className="w-12 h-12 rounded-full object-cover shrink-0 shadow-sm" alt="Profile" />
            ) : (
              <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center shrink-0">
                <FileQuestion className="h-6 w-6" />
              </div>
            )}
            <h3 className="font-bold text-slate-800">{configData.boxTitle || (lang === "tr" ? "Soru & Cevap (AMA)" : "Ask me anything!")}</h3>
          </div>
          {qaPairs.length > 0 ? (
            <div className="space-y-2.5 w-full">
              {qaPairs.map((p: any, idx: number) => (
                <details key={idx} className="group border border-zinc-100 rounded-xl bg-zinc-50 p-3 [&_summary::-webkit-details-marker]:hidden">
                  <summary className="flex items-center justify-between cursor-pointer focus:outline-none">
                    <span className="text-xs font-bold text-slate-800 pr-4">{p.q || "Soru"}</span>
                    <span className="transition group-open:rotate-180 text-zinc-400 shrink-0">
                      <svg fill="none" height="16" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="16" className="h-3 w-3"><path d="M6 9l6 6 6-6"></path></svg>
                    </span>
                  </summary>
                  <p className="text-[11px] text-slate-655 mt-2 pl-0.5 leading-relaxed border-t border-zinc-100 pt-2 whitespace-pre-wrap">{p.a || "Cevap..."}</p>
                </details>
              ))}
            </div>
          ) : (
            <p className="text-xs text-zinc-400 text-center py-4">
              {lang === "tr" ? "Henüz soru ve cevap eklenmemiş." : "No questions or answers yet."}
            </p>
          )}
        </div>
      </div>
    );
  }
  case "FAQ":
  return (
  <div className="w-full h-full bg-zinc-50 flex flex-col pt-16 px-4">
  <h3 className="font-black text-2xl text-slate-800 mb-6 px-2">{configData.title || (lang === "tr" ? "Sıkça Sorulan Sorular" : "FAQ")}</h3>
  <div className="space-y-3 w-full">
  {(configData.faqPairs && configData.faqPairs.length > 0) ? (
  configData.faqPairs.map((p: any, idx: number) => (
  <div key={idx} className="w-full p-4 bg-white rounded-2xl border border-zinc-200 shadow-sm">
  <h4 className="font-bold text-sm text-slate-800 mb-1">{p.q || "Soru?"}</h4>
  <p className="text-xs text-slate-500">{p.a || "Cevap..."}</p>
  </div>
  ))
  ) : (
  <div className="w-full p-4 bg-white rounded-2xl border border-zinc-200 shadow-sm">
  <h4 className="font-bold text-sm text-slate-800 mb-1">Soru Örneği?</h4>
  <p className="text-xs text-slate-500">Cevap Örneği...</p>
  </div>
  )}
  </div>
  </div>
  );
  case "PREMIUM_VIDEO":
  case "RETRO_CASSETTE":
  case "SPOTIFY_CLASSIC":
  case "VINYL_RETRO":
    case "GLASS_AUDIO":
    case "NEON_CYBERPUNK":
  
    case "MUSIC_PODCAST":
    case "PORTFOLIO_GALLERY":
    case "COUNTDOWN_LAUNCH":

      {
        const type = addon.addonType;
        const displayAvatar = configData.avatarUrl || addon.settings?.avatarUrl || "";
        const displayUsername = configData.username || addon.settings?.username || ("@" + username);
        const displayBio = configData.bio || addon.settings?.bio || "";
        const displayTitle = configData.title || (type === "RETRO_CASSETTE" ? "Retro Kaset Çalar" : type === "SPOTIFY_CLASSIC" ? "Classic Spotify Player" : type === "VINYL_RETRO" ? "Retro Plak Çalar" : type === "GLASS_AUDIO" ? "Modern Cam Efekti" : type === "NEON_CYBERPUNK" ? "Neon Cyberpunk Player" : type === "MUSIC_PODCAST" ? "Müzik & Podcast Çalar" : type === "PORTFOLIO_GALLERY" ? "Portfolyo & Galeri" : type === "COUNTDOWN_LAUNCH" ? "Geri Sayım & Lansman" : type === "PREMIUM_VIDEO" ? "Premium Video" : "");
        const displayDesc = configData.description || (type === "RETRO_CASSETTE" ? "90'ların nostaljik dönen makaralı kaset tasarımı." : type === "SPOTIFY_CLASSIC" ? "Orijinal ve ikonik Spotify görünümü." : type === "VINYL_RETRO" ? "Nostaljik ruhu yaşatan, plak görünümlü oynatıcı." : type === "GLASS_AUDIO" ? "Albüm renklerine uyum sağlayan yarı saydam tasarım." : type === "NEON_CYBERPUNK" ? "Elektronik müzik ve synthwave tutkunları için." : type === "MUSIC_PODCAST" ? "Beat'lerinizi ve podcast'lerinizi doğrudan sayfanızda dinletin." : type === "PORTFOLIO_GALLERY" ? "Tasarımlarınızı ve fotoğraflarınızı şık bir ızgara (grid) yapısında sergileyin." : type === "COUNTDOWN_LAUNCH" ? "Yeni ürün veya içerikleriniz için heyecan yaratacak dinamik sayaç." : type === "PREMIUM_VIDEO" ? "Premium video derslerinizi ve içeriklerinizi sergileyin." : "");

        return (
          <div className="w-full h-full bg-zinc-950 flex flex-col justify-between overflow-y-auto no-scrollbar">
            <PlayableAddon
              type={type}
              avatarUrl={displayAvatar}
              username={displayUsername}
              bio={displayBio}
              title={displayTitle}
              desc={displayDesc}
              config={configData}
            />
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
  };

  
 return (
 <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-slate-900/60 backdrop-blur-md">
 <div className="relative w-full max-w-full md:w-[1200px] h-[90vh] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200 border border-white/20">
 
 {/* Header (Top Bar) */}
 <div className="px-6 md:px-8 py-5 border-b border-zinc-100 flex flex-col sm:flex-row sm:items-center justify-between bg-white shrink-0 z-20 gap-4">
 <div className="flex items-center gap-4">
 <div className="p-3.5 rounded-2xl bg-indigo-50 text-indigo-600 shadow-inner">
 {icon}
 </div>
 <div>
 <h2 className="text-xl font-black text-slate-900 tracking-tight">
 {title} {lang === "tr" ? "Ayarları" : "Settings"}
 </h2>
 <p className="text-sm text-slate-500 font-medium mt-0.5">
 {lang === "tr" ? "Gerçek zamanlı eklenti düzenleyicisi" : "Real-time addon editor"}
 </p>
 </div>
 </div>

 <div className="flex items-center gap-3 md:gap-5 self-end sm:self-auto">
 {/* Status Toggle */}
 <div className="flex items-center gap-3 px-5 py-3 md:py-2.5 rounded-2xl bg-zinc-50 border border-zinc-200/80 shadow-sm cursor-pointer" onClick={() => setIsActive(!isActive)}>
 <span className={`text-xs uppercase tracking-wider font-bold transition-colors ${isActive ? 'text-emerald-600' : 'text-zinc-400'}`}>
 {isActive ? (lang === "tr" ? "Yayında" : "Published") : (lang === "tr" ? "Taslak" : "Draft")}
 </span>
 <button 
 type="button"
 className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-300 ${isActive ? 'bg-emerald-500 shadow-md shadow-emerald-500/20' : 'bg-zinc-300'}`}
 >
 <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-all duration-300 shadow-sm ${isActive ? 'translate-x-6' : 'translate-x-1'}`} />
 </button>
 </div>

 <button
 onClick={handleSave}
 disabled={isPending}
 className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold text-sm rounded-2xl transition-all flex items-center gap-2 shadow-lg shadow-indigo-600/20 disabled:opacity-50"
 >
 {isPending ? <Loader2 className="h-4.5 w-4.5 animate-spin" /> : <Save className="h-4.5 w-4.5" />}
 {lang === "tr" ? "Kaydet & Kapat" : "Save & Close"}
 </button>
 
 <button
 onClick={() => onClose()}
 className="p-3 rounded-2xl bg-zinc-100 hover:bg-zinc-200 text-zinc-600 transition-colors"
 >
 <X className="h-5 w-5" />
 </button>
 </div>
 </div>

 {/* Split Screen Body */}
 <div className="flex flex-col lg:flex-row flex-1 overflow-hidden bg-zinc-50/30">
 
 {/* Left Panel: Editor Form */}
 <div className="w-full lg:w-[45%] h-full overflow-y-auto p-3 md:p-6 md:p-8 bg-white border-r border-zinc-100 custom-scrollbar relative z-10 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
 <div className="max-w-full md:w-[420px] mx-auto space-y-2">
 {renderFields()}
 </div>
 </div>

 {/* Right Panel: Live Mockup Preview */}
 <div className="hidden lg:flex flex-1 items-center justify-center p-4 md:p-8 relative overflow-hidden bg-zinc-100/50">
 {/* Ambient Background Glow matching the active state */}
 <div className="absolute inset-0 overflow-hidden pointer-events-none">
 <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full md:w-[600px] h-[600px] blur-[120px] rounded-full transition-colors duration-1000 ${isActive ? 'bg-emerald-500/10' : 'bg-indigo-500/5'}`} />
 </div>
 
 {/* iPhone Mockup Frame */}
 <div className="relative w-full max-w-sm lg:w-[360px] h-[740px] bg-black rounded-[3.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.2)] border-[12px] border-black flex flex-col overflow-hidden z-10 shrink-0 ring-1 ring-white/10">
 {/* Notch */}
 <div className="absolute top-0 inset-x-0 h-7 flex justify-center z-50">
 <div className="w-36 h-7 bg-black rounded-b-3xl relative">
 <div className="absolute top-2.5 right-6 w-2 h-2 rounded-full bg-blue-900/40 border border-blue-400/20" />
 </div>
 </div>
 
 {/* Status Bar */}
 <div className="h-12 w-full bg-white flex justify-between items-center px-4 md:px-8 pt-3 text-[10px] font-medium z-40 text-black">
 <span>9:41</span>
 <div className="flex items-center gap-1.5">
 <div className="w-4 h-2.5 bg-black rounded-sm relative">
 <div className="absolute right-[-2px] top-0.5 bottom-0.5 w-[2px] bg-black rounded-r-sm" />
 </div>
 </div>
 </div>

 {/* Screen Content */}
 <div className="flex-1 w-full bg-white overflow-y-auto custom-scrollbar relative">
 {renderLivePreview()}
 </div>
 
 {/* Home Indicator */}
 <div className="absolute bottom-2 inset-x-0 h-1.5 flex justify-center z-50">
 <div className="w-32 h-1.5 bg-black/20 rounded-full" />
 </div>
 </div>

 {/* Hint label */}
 <div className="absolute bottom-8 text-xs font-bold uppercase tracking-widest text-zinc-400 bg-white/50 backdrop-blur-md px-4 py-3 md:py-2 rounded-full shadow-sm">
 {lang === "tr" ? "Canlı Önizleme Modu" : "Live Preview Mode"}
 </div>
 </div>
 
 </div>
 </div>
 
 {/* Custom Alert/Confirm Dialog */}
 {dialog.isOpen && (
 <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
 <div className="bg-white rounded-[2rem] shadow-2xl p-4 md:p-8 max-w-sm w-full transform transition-all animate-in fade-in zoom-in-95 duration-200">
 <h3 className="text-xl font-black text-slate-800 mb-3 text-center">
 {domain} {lang === "tr" ? "mesajı" : "says"}
 </h3>
 <p className="text-slate-600 font-medium text-center mb-8">{dialog.message}</p>
 <div className="flex items-center justify-center gap-3">
 <button
 onClick={() => {
 if (dialog.type === "confirm" && dialog.onConfirm) {
 dialog.onConfirm();
 }
 closeDialog();
 }}
 className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-2xl transition-all shadow-md shadow-indigo-600/20"
 >
 {lang === "tr" ? "Tamam" : "OK"}
 </button>
 {dialog.type === "confirm" && (
 <button
 onClick={closeDialog}
 className="px-6 py-3 bg-red-50 hover:bg-red-100 text-red-600 text-sm font-bold rounded-2xl transition-all"
 >
 {lang === "tr" ? "İptal" : "Cancel"}
 </button>
 )}
 </div>
 </div>
 </div>
 )}
</div>
 );
}

