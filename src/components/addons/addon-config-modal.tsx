"use client";

import React, { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import { saveAddonConfig, addAddonProduct, deleteAddonProduct } from "@/app/actions";
import { X, Loader2, Save, Store, Calendar, FileQuestion, Mail, Heart, Clock, Briefcase, HelpCircle, MapPin, MessageCircle, Trash2, Plus, ShoppingBag, Music, Image } from "lucide-react";
import StorefrontPreview from "@/components/storefront-preview";

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

 const getAddonDetails = () => {
 switch (addon.addonType) {
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
    case "COMIC_MANGA": return { icon: <Store className="h-5 w-5" />, title: lang === "tr" ? "Mağaza" : "Store" };
 case "PREMIUM_VIDEO": return { icon: <Store className="h-5 w-5" />, title: lang === "tr" ? "Premium Video" : "Premium Video" };
 case "BOOKING": return { icon: <Calendar className="h-5 w-5" />, title: lang === "tr" ? "Randevu" : "Booking" };
 case "QA": return { icon: <FileQuestion className="h-5 w-5" />, title: lang === "tr" ? "Soru-Cevap" : "Q&A" };
 case "NEWSLETTER": return { icon: <Mail className="h-5 w-5" />, title: lang === "tr" ? "Bülten" : "Newsletter" };
 case "DONATION": return { icon: <Heart className="h-5 w-5" />, title: lang === "tr" ? "Bağış" : "Donation" };
 case "COUNTDOWN": return { icon: <Clock className="h-5 w-5" />, title: lang === "tr" ? "Geri Sayım" : "Countdown" };
 case "PORTFOLIO": return { icon: <Briefcase className="h-5 w-5" />, title: lang === "tr" ? "Portfolyo" : "Portfolio" };
 case "FAQ": return { icon: <HelpCircle className="h-5 w-5" />, title: "FAQ" };
 case "MAP": return { icon: <MapPin className="h-5 w-5" />, title: lang === "tr" ? "Harita" : "Map" };
 case "WHATSAPP": return { icon: <MessageCircle className="h-5 w-5" />, title: "WhatsApp" };
  case "SPOTIFY_CLASSIC": return { icon: <Music className="h-5 w-5" />, title: "Spotify Classic Player" };
  case "VINYL_RETRO": return { icon: <Music className="h-5 w-5" />, title: "Retro Plak Çalar" };
  case "GLASS_AUDIO": return { icon: <Music className="h-5 w-5" />, title: "Modern Cam Efekti" };
  case "NEON_CYBERPUNK": return { icon: <Music className="h-5 w-5" />, title: "Neon Cyberpunk Player" };
  case "MINIMAL_LIGHT_AUDIO": return { icon: <Music className="h-5 w-5" />, title: "Minimalist Light Player" };
  case "MUSIC_PODCAST": return { icon: <Music className="h-5 w-5" />, title: "Müzik & Podcast Çalar" };
  case "PORTFOLIO_GALLERY": return { icon: <Image className="h-5 w-5" />, title: "Portfolyo & Galeri" };
  case "COUNTDOWN_LAUNCH": return { icon: <Clock className="h-5 w-5" />, title: "Geri Sayım & Lansman" };
  case "TESTIMONIALS": return { icon: <MessageCircle className="h-5 w-5" />, title: "Müşteri Yorumları" };
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
 value={configData["theme"] || "classic"}
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
 case "BOOKING":
 specificFields = (
 <>
 {renderInput("title", lang === "tr" ? "Başlık" : "Title", lang === "tr" ? "Birebir Görüşme Ayarla" : "Book a 1:1 Call")}
 {renderTextarea("description", lang === "tr" ? "Açıklama" : "Description", lang === "tr" ? "Sizinle tanışmak için sabırsızlanıyorum." : "Looking forward to meeting you.")}
 {renderInput("calendarLink", lang === "tr" ? "Takvim Linki (Calendly vb.)" : "Calendar URL", "https://calendly.com/...")}
 {renderInput("buttonText", lang === "tr" ? "Buton Yazısı" : "Button Text", lang === "tr" ? "Takvimi Görüntüle" : "View Calendar")}
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
 {renderImageUpload("coverUrl", lang === "tr" ? "Kapak Fotoğrafı (URL)" : "Cover Photo URL")}
 {renderInput("videoUrl", lang === "tr" ? "Video Linki (YouTube/Vimeo)" : "Video URL", "https://youtube.com/...")}
 {renderInput("title", lang === "tr" ? "Video Başlığı" : "Video Title", "UI/UX Masterclass Bölüm 1")}
 {renderTextarea("description", lang === "tr" ? "Açıklama" : "Description", "Tasarım sistemleri...")}
 {renderInput("actionUrl", lang === "tr" ? "Aksiyon Butonu Linki" : "Action URL", "https://...")}
 {renderInput("buttonText", lang === "tr" ? "Aksiyon Butonu Metni" : "Action Button Text", "Tamamını İzle")}
 </>
 );
 break;
  case "NEWSLETTER":
  specificFields = (
  <>
  {renderInput("title", lang === "tr" ? "Modül Başlığı" : "Module Title", lang === "tr" ? "Haftalık Bülten" : "Weekly Newsletter")}
  {renderTextarea("incentiveMsg", lang === "tr" ? "Açıklama Metni" : "Description", lang === "tr" ? "Spam yok, sadece kaliteli içerik." : "No spam, just good content.")}
  <div className="space-y-1.5 mb-4">
    <label className="text-xs font-bold text-slate-700 block uppercase tracking-wide">
      {lang === "tr" ? "Abonelik Tipi" : "Subscription Type"}
    </label>
    <select
      value={configData.integrationType || "MAILCHIMP"}
      onChange={(e) => setConfigData({ ...configData, integrationType: e.target.value })}
      className="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-zinc-50 text-sm text-slate-800 font-medium focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all shadow-sm"
    >
      <option value="MAILCHIMP">{lang === "tr" ? "Yönlendirme Linki (Mailchimp, Substack vb.)" : "Redirect Link (Mailchimp, Substack, etc.)"}</option>
      <option value="DIRECT">{lang === "tr" ? "Doğrudan Veritabanına Kayıt (Simüle Edilir)" : "Direct Database Registration (Simulated)"}</option>
    </select>
  </div>
  {(configData.integrationType || "MAILCHIMP") === "MAILCHIMP" && renderInput("serviceUrl", lang === "tr" ? "Yönlendirme Linki (Mailchimp vb.)" : "Redirect URL", "https://mailchimp.com/...")}
  {renderInput("buttonText", lang === "tr" ? "Buton Yazısı" : "Subscribe Button Text", lang === "tr" ? "Abone Ol" : "Subscribe")}
  </>
  );
  break;
 case "DONATION":
 specificFields = (
 <>
 {renderInput("title", lang === "tr" ? "Başlık" : "Title", lang === "tr" ? "Bana Kahve Ismarla" : "Buy me a coffee")}
 {renderTextarea("thankYouMsg", lang === "tr" ? "Açıklama / Teşekkür Mesajı" : "Description / Thank You", lang === "tr" ? "Desteğiniz için teşekkürler!" : "Thank you for your support!")}
 {renderInput("platformUrl", lang === "tr" ? "Bağış Platformu Linki (Örn: Patreon)" : "Donation URL", "https://patreon.com/yourname")}
 {renderInput("buttonText", lang === "tr" ? "Buton Yazısı" : "Button Text", lang === "tr" ? "Destek Ol" : "Support Me")}
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
 case "SPOTIFY_CLASSIC":
 case "VINYL_RETRO":
 case "GLASS_AUDIO":
 case "NEON_CYBERPUNK":
 case "MINIMAL_LIGHT_AUDIO":
 case "MUSIC_PODCAST":
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
 <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
 🎵 {lang === "tr" ? "Parça Detayları" : "Track Details"}
 </h4>
 {renderInput("trackName", lang === "tr" ? "Şarkı / Parça Adı" : "Track / Song Name", lang === "tr" ? "Gece Yağmuru" : "Night Rain")}
 {renderInput("artistName", lang === "tr" ? "Sanatçı / Prodüktör Adı" : "Artist / Producer Name", lang === "tr" ? "DJ Yağmur" : "DJ Rain")}
 {renderInput("trackUrl", lang === "tr" ? "Spotify / SoundCloud / Ses Linki" : "Spotify / SoundCloud / Audio URL", "https://open.spotify.com/track/...")}
 {renderInput("trackDuration", lang === "tr" ? "Parça Süresi (Opsiyonel)" : "Track Duration (Optional)", "3:45")}
 </div>

 <div className="space-y-4 pt-2">
 <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
 🎨 {lang === "tr" ? "Görsel Özelleştirme" : "Visual Customization"}
 </h4>
 {renderImageUpload("albumCoverUrl", lang === "tr" ? "Albüm / Kapak Görseli" : "Album / Cover Image")}
 {renderInput("accentColor", lang === "tr" ? "Vurgu Rengi (HEX, Opsiyonel)" : "Accent Color (HEX, Optional)", "#1db954")}
 </div>
 </>
 );
 break;

 // ── PORTFOLIO & GALLERY ──
 case "PORTFOLIO_GALLERY":
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
 <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
 🖼️ {lang === "tr" ? "Galeri Görselleri" : "Gallery Images"}
 </h4>
 {renderImageUpload("galleryImage1", lang === "tr" ? "Görsel 1" : "Image 1")}
 {renderImageUpload("galleryImage2", lang === "tr" ? "Görsel 2" : "Image 2")}
 {renderImageUpload("galleryImage3", lang === "tr" ? "Görsel 3" : "Image 3")}
 {renderImageUpload("galleryImage4", lang === "tr" ? "Görsel 4" : "Image 4")}
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

 // ── TESTIMONIALS ──
 case "TESTIMONIALS":
 specificFields = (
 <>
 <div className="space-y-4 pt-2 border-b border-zinc-200 pb-6 mb-6">
 <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
 <MessageCircle className="h-4 w-4" />
 {lang === "tr" ? "Yorum Modülü Ayarları" : "Testimonial Settings"}
 </h4>
 {renderInput("title", lang === "tr" ? "Modül Başlığı" : "Module Title", lang === "tr" ? "Müşteri Yorumları" : "Client Testimonials")}
 {renderTextarea("description", lang === "tr" ? "Açıklama" : "Description", lang === "tr" ? "Müşterilerimizin görüşleri." : "What our clients say.")}
 {renderInput("username", lang === "tr" ? "Görünen Kullanıcı Adı" : "Display Username", "@username")}
 {renderInput("bio", lang === "tr" ? "Kısa Biyografi" : "Short Bio", "E-Commerce Business Consultant")}
 </div>
 {renderTestimonialsEditor()}
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
  addon.addonType !== "ACADEMIA" && 
  addon.addonType !== "Y2K" &&
  addon.addonType !== "PREMIUM_CREATOR" &&
  addon.addonType !== "WEB3_NFT" &&
  addon.addonType !== "EDITORIAL_LUX" &&
  addon.addonType !== "GAMER_HUB" &&
  addon.addonType !== "CORP_EXEC" &&
  addon.addonType !== "COMIC_MANGA" ? renderSlugAndAvatar() : null}
 {specificFields}
 </div>
 );
 };

  const renderLivePreview = () => {
  switch (addon.addonType) {
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
  />
  </div>
  );
  case "NEWSLETTER":
  return (
    <div className="w-full h-full bg-zinc-50 flex items-center justify-center p-3 md:p-6">
      <div className="w-full p-4 bg-white rounded-3xl border border-zinc-200 shadow-lg flex flex-col items-center text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center mb-1 text-xl">
          ✉️
        </div>
        <div>
          <h3 className="font-bold text-lg text-slate-800">{configData.title || (lang === "tr" ? "Haftalık Bülten" : "Weekly Newsletter")}</h3>
          <p className="text-xs text-slate-500 mt-1">{configData.incentiveMsg || (lang === "tr" ? "Spam yok, sadece kaliteli içerik." : "No spam, just good content.")}</p>
        </div>
        <div className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-3 text-left text-xs text-zinc-400">
          email@example.com
        </div>
        <div className="w-full py-3 rounded-xl bg-slate-900 text-white font-bold text-sm shadow-md text-center">
          {configData.buttonText || (lang === "tr" ? "Abone Ol" : "Subscribe")}
        </div>
      </div>
    </div>
  );
  case "BOOKING":
  return (
  <div className="w-full h-full bg-zinc-50 flex items-center justify-center p-3 md:p-6">
  <div className="w-full p-3 md:p-6 bg-white rounded-3xl border border-zinc-200 shadow-lg flex flex-col items-center text-center space-y-4 transition-all">
  {configData.avatarUrl ? (
  <img src={configData.avatarUrl} className="w-16 h-16 rounded-full object-cover shadow-md" alt="Profile" />
  ) : (
  <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center">
  <Calendar className="h-8 w-8" />
  </div>
  )}
  <div>
  <h3 className="font-bold text-lg text-slate-800">{configData.title || (lang === "tr" ? "Birebir Görüşme Ayarla" : "Book a 1:1 call")}</h3>
  <p className="text-sm text-slate-500 mt-1">{configData.description || (lang === "tr" ? "Sizinle tanışmak için sabırsızlanıyorum." : "Looking forward to meeting you.")}</p>
  </div>
  <div className="w-full py-3 mt-2 rounded-xl bg-slate-900 text-white font-bold text-sm shadow-md cursor-pointer hover:bg-slate-800 transition-colors">
  {configData.buttonText || (lang === "tr" ? "Takvimi Görüntüle" : "View Calendar")}
  </div>
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
  case "SPOTIFY_CLASSIC":
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
            {renderAddonInnerContent(type, displayAvatar, displayUsername, displayBio, displayTitle, displayDesc, configData)}
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
