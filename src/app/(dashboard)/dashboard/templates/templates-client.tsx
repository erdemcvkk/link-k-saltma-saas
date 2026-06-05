"use client";

import { useState, useEffect, useTransition, useMemo } from "react";
import Link from "next/link";
import {
  toggleUserTemplateActive,
  updateProfile,
  updateAllLinksCustomStyle,
  applyTemplateToProfile,
  addLink,
  deleteLink
} from "@/app/actions";
import {
  Palette,
  Globe,
  Copy,
  ExternalLink,
  ArrowRight,
  Eye,
  Settings,
  Check,
  X,
  Code,
  User,
  Plus,
  Trash2,
  FileText,
  List,
  Briefcase,
  Play,
  Image,
  MessageCircle,
  Music,
  Utensils,
  Smartphone,
  Percent,
  Wifi,
  ShoppingBag
} from "lucide-react";
import PhonePreview from "@/components/dashboard/phone-preview";
import { useDashboard } from "../dashboard-context";
import { parseButtonStyle } from "@/lib/parse-button-style";

type LinkItem = {
  id: string;
  title: string;
  url: string;
  isActive: boolean;
  type?: string;
  animation?: string;
  bgColor?: string | null;
  textColor?: string | null;
  borderColor?: string | null;
  borderStyle?: string | null;
  borderWidth?: string | null;
  borderRadius?: string | null;
  shadow?: string | null;
  fontWeight?: string | null;
  blockType?: string;
  metadata?: string | null;
};

interface TemplateItem {
  userTemplateId: string;
  isActive: boolean;
  customUrl: string | null;
  id: string;
  name: string;
  price: number;
  category: string;
  coverUrl: string;
  bgColor: string;
  fontStyle: string;
  buttonStyle: string;
  isCoded: boolean;
  customCss?: string | null;
  configJson?: string | null;
}

interface TemplatesClientProps {
  initialOwnedTemplates: TemplateItem[];
  initialLinks: LinkItem[];
  systemSettings?: {
    adScript?: string | null;
    customImageUrl?: string | null;
    customTargetUrl?: string | null;
    isActive: boolean;
  } | null;
}

const getLinkIconHelper = (type: string | undefined, url: string | undefined) => {
  switch (type) {
    case "WEBSITE":
    case "FACEBOOK":
    case "INSTAGRAM":
      return <Globe className="h-4 w-4 text-teal-500" />;
    case "PDF":
      return <FileText className="h-4 w-4 text-teal-500" />;
    case "LINK_LIST":
      return <List className="h-4 w-4 text-teal-500" />;
    case "VCARD":
      return <User className="h-4 w-4 text-teal-500" />;
    case "BUSINESS":
      return <Briefcase className="h-4 w-4 text-teal-500" />;
    case "VIDEO":
      return <Play className="h-4 w-4 text-teal-500" />;
    case "IMAGES":
      return <Image className="h-4 w-4 text-teal-500" />;
    case "SOCIAL_MEDIA":
    case "WHATSAPP":
      return <MessageCircle className="h-4 w-4 text-teal-500" />;
    case "MP3":
      return <Music className="h-4 w-4 text-teal-500" />;
    case "MENU":
      return <Utensils className="h-4 w-4 text-teal-500" />;
    case "APPS":
      return <Smartphone className="h-4 w-4 text-teal-500" />;
    case "COUPON":
      return <Percent className="h-4 w-4 text-teal-500" />;
    case "WIFI":
      return <Wifi className="h-4 w-4 text-teal-500" />;
    default:
      if (url) {
        const lowerUrl = url.toLowerCase();
        if (lowerUrl.includes("spotify") || lowerUrl.includes("soundcloud") || lowerUrl.includes("music")) {
          return <Music className="h-4 w-4 text-teal-500" />;
        }
        if (lowerUrl.includes("shop") || lowerUrl.includes("store") || lowerUrl.includes("presets")) {
          return <ShoppingBag className="h-4 w-4 text-teal-500" />;
        }
        if (lowerUrl.includes("website") || lowerUrl.includes("portfolio")) {
          return <Globe className="h-4 w-4 text-teal-500" />;
        }
      }
      return <Globe className="h-4 w-4 text-teal-500" />;
  }
};

export default function TemplatesClient({
  initialOwnedTemplates,
  initialLinks,
  systemSettings
}: TemplatesClientProps) {
  const {
    user,
    lang,
    setSuccessMsg,
    setErrorMsg,
    isPending,
    startTransition,
    activeTemplate,
    setActiveTemplate,
    simulatedPlan
  } = useDashboard();

  const initialUser = user;

  const [ownedTemplates, setOwnedTemplates] = useState<TemplateItem[]>(initialOwnedTemplates);
  const [customizingTemplateId, setCustomizingTemplateId] = useState<string | null>(null);

  // Preview local styling states
  const [background, setBackground] = useState(user.profile?.background ?? "");
  const [fontStyle, setFontStyle] = useState(user.profile?.fontStyle ?? "Inter");
  const [activeTemplateCss, setActiveTemplateCss] = useState<string | null>(user.profile?.customCss ?? null);
  const [theme, setTheme] = useState(user.profile?.theme ?? "dark");

  const [links, setLinks] = useState<LinkItem[]>(initialLinks);

  const firstLink = initialLinks?.[0];
  const [btnBgColor, setBtnBgColor] = useState(firstLink?.bgColor || "");
  const [btnTextColor, setBtnTextColor] = useState(firstLink?.textColor || "");
  const [btnBorderColor, setBtnBorderColor] = useState(firstLink?.borderColor || "");
  const [btnBorderStyle, setBtnBorderStyle] = useState(firstLink?.borderStyle || "solid");
  const [btnBorderWidth, setBtnBorderWidth] = useState(firstLink?.borderWidth || "1px");
  const [btnBorderRadius, setBtnBorderRadius] = useState(firstLink?.borderRadius || "12px");
  const [btnShadow, setBtnShadow] = useState(firstLink?.shadow || "none");
  const [btnFontWeight, setBtnFontWeight] = useState(firstLink?.fontWeight || "font-bold");

  const [usernameColor, setUsernameColor] = useState(user.profile?.usernameColor ?? "#ffffff");
  const [bioColor, setBioColor] = useState(user.profile?.bioColor ?? "#888888");
  const [btnIconColor, setBtnIconColor] = useState(() => {
    if (firstLink?.metadata) {
      try {
        const parsed = JSON.parse(firstLink.metadata);
        return parsed.iconColor || "";
      } catch (e) {}
    }
    return "";
  });

  const [avatarUrl, setAvatarUrl] = useState(user.profile?.avatarUrl ?? "");
  const [newLinkTitle, setNewLinkTitle] = useState("");
  const [newLinkUrl, setNewLinkUrl] = useState("");
  const [newLinkType, setNewLinkType] = useState("WEBSITE");

  const formatSocialUrl = (type: string, val: string) => {
    let value = val.trim();
    if (!value) return "";
    if (/^https?:\/\//i.test(value)) return value;

    switch (type) {
      case "INSTAGRAM":
        return `https://instagram.com/${value.replace(/^@/, "")}`;
      case "WHATSAPP":
        const cleanNum = value.replace(/[^0-9]/g, "");
        return `https://wa.me/${cleanNum}`;
      case "TIKTOK":
        return `https://tiktok.com/@${value.replace(/^@/, "")}`;
      case "YOUTUBE":
        if (value.startsWith("@")) {
          return `https://youtube.com/${value}`;
        }
        return `https://youtube.com/c/${value}`;
      case "X":
        return `https://x.com/${value.replace(/^@/, "")}`;
      case "LINKEDIN":
        return `https://linkedin.com/in/${value}`;
      case "FACEBOOK":
        return `https://facebook.com/${value}`;
      default:
        return value;
    }
  };

  const handleSocialChange = (type: string, value: string) => {
    setLinks(prev => {
      const existingIndex = prev.findIndex(l => l.type === type);
      if (existingIndex > -1) {
        if (!value) {
          return prev.filter((_, idx) => idx !== existingIndex);
        } else {
          return prev.map((l, idx) => idx === existingIndex ? { ...l, url: value } : l);
        }
      } else if (value) {
        const newTempLink: LinkItem = {
          id: `temp-${type.toLowerCase()}-${Date.now()}`,
          title: type === "X" ? "Twitter/X" : type.charAt(0) + type.slice(1).toLowerCase(),
          url: value,
          isActive: true,
          type: type,
          blockType: "TEXT_LINK"
        };
        return [...prev, newTempLink];
      }
      return prev;
    });
  };

  const handleSocialBlur = (type: string, value: string) => {
    const formatted = formatSocialUrl(type, value);
    if (formatted) {
      setLinks(prev => prev.map(l => l.type === type ? { ...l, url: formatted } : l));
    }
  };

  useEffect(() => {
    setNewLinkTitle("");
    setNewLinkUrl("");
    setNewLinkType("WEBSITE");

    if (customizingTemplateId) {
      const template = ownedTemplates.find(t => t.id === customizingTemplateId);
      if (template) {
        setBackground(template.bgColor);
        setFontStyle(template.fontStyle);
        setTheme(template.name);
        setActiveTemplateCss(template.customCss || null);
        setAvatarUrl(user.profile?.avatarUrl ?? "");

        // Determine light/dark contexts for default colors
        const isLightTmpl = [
          "Minimalist Light", "Pastel Dream", "Abstract Fluid", 
          "Vintage Paper", "Vintage Journal", "Holographic Glass", "Aura Hologram"
        ].includes(template.name);
        setUsernameColor(isLightTmpl ? "#0f172a" : "#ffffff");
        setBioColor(isLightTmpl ? "#475569" : "rgba(255,255,255,0.7)");

        if (template.buttonStyle) {
          const parsed = parseButtonStyle(template.buttonStyle);
          setBtnBgColor(parsed.bgColor);
          setBtnTextColor(parsed.textColor);
          setBtnBorderColor(parsed.borderColor);
          setBtnBorderStyle(parsed.borderStyle);
          setBtnBorderWidth(parsed.borderWidth);
          setBtnBorderRadius(parsed.borderRadius);
          setBtnShadow(parsed.shadow);
          setBtnFontWeight(parsed.fontWeight);
          setBtnIconColor(parsed.textColor || "");
        } else {
          setBtnBgColor(firstLink?.bgColor || "");
          setBtnTextColor(firstLink?.textColor || "");
          setBtnBorderColor(firstLink?.borderColor || "");
          setBtnBorderStyle(firstLink?.borderStyle || "solid");
          setBtnBorderWidth(firstLink?.borderWidth || "1px");
          setBtnBorderRadius(firstLink?.borderRadius || "12px");
          setBtnShadow(firstLink?.shadow || "none");
          setBtnFontWeight(firstLink?.fontWeight || "font-bold");
          setBtnIconColor(() => {
            if (firstLink?.metadata) {
              try {
                const parsed = JSON.parse(firstLink.metadata);
                return parsed.iconColor || "";
              } catch (e) {}
            }
            return "";
          });
        }
      }
    } else {
      // Reset to user actual settings
      setBackground(user.profile?.background ?? "");
      setFontStyle(user.profile?.fontStyle ?? "Inter");
      setTheme(user.profile?.theme ?? "dark");
      setActiveTemplateCss(user.profile?.customCss ?? null);
      setUsernameColor(user.profile?.usernameColor ?? "#ffffff");
      setBioColor(user.profile?.bioColor ?? "#888888");
      setAvatarUrl(user.profile?.avatarUrl ?? "");

      setBtnBgColor(firstLink?.bgColor || "");
      setBtnTextColor(firstLink?.textColor || "");
      setBtnBorderColor(firstLink?.borderColor || "");
      setBtnBorderStyle(firstLink?.borderStyle || "solid");
      setBtnBorderWidth(firstLink?.borderWidth || "1px");
      setBtnBorderRadius(firstLink?.borderRadius || "12px");
      setBtnShadow(firstLink?.shadow || "none");
      setBtnFontWeight(firstLink?.fontWeight || "font-bold");
      setBtnIconColor(() => {
        if (firstLink?.metadata) {
          try {
            const parsed = JSON.parse(firstLink.metadata);
            return parsed.iconColor || "";
          } catch (e) {}
        }
        return "";
      });
    }
  }, [customizingTemplateId, ownedTemplates, user.profile, firstLink]);

  // Preview mappings
  const isLight = [
    "Minimalist Light", "Pastel Dream", "Abstract Fluid", 
    "Vintage Paper", "Vintage Journal", "Holographic Glass", "Aura Hologram"
  ].includes(theme);

  const mappedLinks = links.map(link => {
    let blockMeta = {};
    if (link.metadata) {
      try { blockMeta = JSON.parse(link.metadata); } catch (e) {}
    }
    if (btnIconColor) {
      (blockMeta as any).iconColor = btnIconColor;
    } else {
      delete (blockMeta as any).iconColor;
    }
    return {
      ...link,
      bgColor: btnBgColor || null,
      textColor: btnTextColor || null,
      borderColor: btnBorderColor || null,
      borderStyle: btnBorderStyle || null,
      borderWidth: btnBorderWidth || null,
      borderRadius: btnBorderRadius || null,
      shadow: btnShadow || null,
      fontWeight: btnFontWeight || null,
      metadata: blockMeta
    };
  });

  const previewData = {
    username: user.username || "username",
    bio: user.profile?.bio || "Enter profile bio details...",
    avatarUrl: avatarUrl,
    theme: theme,
    customCss: activeTemplateCss,
    background: background,
    buttonClass: user.profile?.buttonClass,
    fontStyle: fontStyle,
    usernameColor: usernameColor,
    bioColor: bioColor,
    links: mappedLinks,
    systemSettings: systemSettings,
    plan: simulatedPlan,
  };

  return (
    <div className="flex flex-col lg:flex-row gap-4 md:gap-8 w-full max-w-full items-start justify-start overflow-hidden">
      {/* LEFT COLUMN: TEMPLATES LIST */}
      <div className="flex-1 space-y-5 md:space-y-8 w-full max-w-full md:max-w-3xl min-w-0 overflow-hidden">
         {(() => {
           if (customizingTemplateId) {
             const activeTemplateToCustomize = ownedTemplates.find(t => t.id === customizingTemplateId);
             if (!activeTemplateToCustomize) return null;

             const { fonts = [] } = useDashboard();

             return (
               <div className="w-full max-w-full space-y-5 md:space-y-8 animate-in fade-in slide-in-from-bottom-3 duration-350 overflow-hidden">
                 <div className="p-4 md:p-6 bg-white border border-zinc-200 rounded-2xl shadow-sm space-y-6">
                   <div className="flex items-center justify-between border-b border-zinc-150 pb-4">
                     <div className="flex items-center gap-3">
                       <Settings className="h-5 w-5 text-teal-500 animate-spin-slow" />
                       <div>
                         <h2 className="font-extrabold text-lg text-zinc-950">
                           {lang === "tr" ? "Şablon Tasarımını Özelleştir" : "Customize Template Design"}
                         </h2>
                         <p className="text-xs text-slate-500">
                           {lang === "tr" 
                             ? `"${activeTemplateToCustomize.name}" şablonunu profilinize göre uyarlayın.`
                             : `Tailor the "${activeTemplateToCustomize.name}" template to match your branding.`}
                         </p>
                       </div>
                     </div>
                     <button
                       type="button"
                       onClick={() => setCustomizingTemplateId(null)}
                       className="p-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-500 rounded-full cursor-pointer transition-colors"
                     >
                       <X className="h-4 w-4" />
                     </button>
                   </div>

                   <div className="space-y-6">
                     {/* 1. PROFİL FOTOĞRAFI EKLEME */}
                     <div className="space-y-4 bg-zinc-50/50 p-4 md:p-5 rounded-2xl border border-zinc-100 shadow-sm">
                       <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-1">
                         <User className="h-4 w-4 text-teal-500" />
                         {lang === "tr" ? "Profil Fotoğrafı" : "Profile Picture"}
                       </h3>
                       <div className="flex items-center gap-4 bg-white p-3 rounded-xl border border-zinc-200">
                         <div className="h-14 w-14 rounded-full border border-zinc-200 overflow-hidden bg-zinc-50 flex items-center justify-center shrink-0 shadow-sm relative">
                           {avatarUrl ? (
                             <img src={avatarUrl} alt="Preview" className="w-full h-full object-cover" />
                           ) : (
                             <User className="h-6 w-6 text-zinc-300" />
                           )}
                         </div>
                         <label className="px-4 py-2 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-650 border border-teal-105 text-xs font-bold transition-all cursor-pointer select-none">
                           {lang === "tr" ? "Fotoğraf Değiştir" : "Change Photo"}
                           <input
                             type="file"
                             accept="image/*"
                             className="hidden"
                             onChange={async (e) => {
                               const file = e.target.files?.[0];
                               if (!file) return;
                               const reader = new FileReader();
                               reader.onload = (event) => {
                                 if (event.target?.result) {
                                   setAvatarUrl(event.target.result as string);
                                 }
                               };
                               reader.readAsDataURL(file);
                             }}
                           />
                         </label>
                       </div>
                     </div>

                     {/* 2. YAZI FONTU VE YAZI RENGİ */}
                     <div className="space-y-4 bg-zinc-50/50 p-4 md:p-5 rounded-2xl border border-zinc-100 shadow-sm">
                       <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-1">
                         <Palette className="h-4 w-4 text-teal-500" />
                         {lang === "tr" ? "Yazı Fontu ve Renk Ayarları" : "Font & Text Colors"}
                       </h3>

                       {/* Font Style */}
                       <div className="space-y-1.5">
                         <label className="text-xs font-black text-zinc-700 block">
                           {lang === "tr" ? "Yazı Tipi (Font)" : "Font Style"}
                         </label>
                         <select
                           value={fontStyle}
                           onChange={(e) => setFontStyle(e.target.value)}
                           className="w-full px-3.5 py-2.5 bg-white border border-zinc-200 rounded-xl text-sm outline-none focus:border-teal-500 cursor-pointer font-semibold text-zinc-800"
                         >
                           <optgroup label={lang === "tr" ? "Ücretsiz Fonts" : "Free Fonts"}>
                             {fonts.filter(f => f.tier === "FREE").map(f => (
                               <option key={f.value} value={f.value}>{f.name}</option>
                             ))}
                           </optgroup>
                           <optgroup label="Starter Fonts">
                             {fonts.filter(f => f.tier === "STARTER").map(f => (
                               <option key={f.value} value={f.value} disabled={simulatedPlan === "FREE"}>
                                 {simulatedPlan === "FREE" ? "🔒 " : ""}{f.name}
                               </option>
                             ))}
                           </optgroup>
                           <optgroup label="Creator Fonts">
                             {fonts.filter(f => f.tier === "CREATOR").map(f => (
                               <option key={f.value} value={f.value} disabled={simulatedPlan !== "CREATOR" && simulatedPlan !== "PRO_BUSINESS"}>
                                 {(simulatedPlan !== "CREATOR" && simulatedPlan !== "PRO_BUSINESS") ? "🔒 " : ""}{f.name}
                               </option>
                             ))}
                           </optgroup>
                         </select>
                       </div>

                       {/* Name and Bio Colors */}
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         <div className="space-y-1.5">
                           <label className="text-xs font-black text-zinc-700 block">
                             {lang === "tr" ? "İsim Rengi" : "Name Color"}
                           </label>
                           <div className="flex gap-2">
                             <input
                               type="color"
                               value={usernameColor || "#ffffff"}
                               onChange={(e) => setUsernameColor(e.target.value)}
                               className="h-10 w-12 rounded-xl cursor-pointer border border-zinc-200 shrink-0"
                             />
                             <input
                               type="text"
                               value={usernameColor || ""}
                               onChange={(e) => setUsernameColor(e.target.value)}
                               className="flex-1 min-w-0 px-3 border border-zinc-200 rounded-xl text-sm font-mono text-zinc-800 bg-white uppercase font-bold"
                             />
                           </div>
                         </div>
                         <div className="space-y-1.5">
                           <label className="text-xs font-black text-zinc-700 block">
                             {lang === "tr" ? "Biyografi Rengi" : "Bio Color"}
                           </label>
                           <div className="flex gap-2">
                             <input
                               type="color"
                               value={bioColor || "#888888"}
                               onChange={(e) => setBioColor(e.target.value)}
                               className="h-10 w-12 rounded-xl cursor-pointer border border-zinc-200 shrink-0"
                             />
                             <input
                               type="text"
                               value={bioColor || ""}
                               onChange={(e) => setBioColor(e.target.value)}
                               className="flex-1 min-w-0 px-3 border border-zinc-200 rounded-xl text-sm font-mono text-zinc-800 bg-white uppercase font-bold"
                             />
                           </div>
                         </div>
                       </div>
                     </div>

                     {/* 3. SOSYAL MEDYA İKONLARI VE RENKLERİ */}
                     <div className="space-y-4 bg-zinc-50/50 p-4 md:p-5 rounded-2xl border border-zinc-100 shadow-sm">
                       <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-1">
                         <Globe className="h-4 w-4 text-teal-500" />
                         {lang === "tr" ? "Sosyal Medya İkonları ve Renkleri" : "Social Icons & Colors"}
                       </h3>

                       {/* Icon Color Picker */}
                       <div className="space-y-1.5">
                         <label className="text-xs font-black text-zinc-700 block">
                           {lang === "tr" ? "Sosyal Medya İkon Rengi" : "Social Media Icon Color"}
                         </label>
                         <div className="flex gap-2">
                           <input
                             type="color"
                             value={btnIconColor || "#ffffff"}
                             onChange={(e) => setBtnIconColor(e.target.value)}
                             className="h-10 w-12 rounded-xl cursor-pointer border border-zinc-200 shrink-0"
                           />
                           <input
                             type="text"
                             value={btnIconColor || ""}
                             onChange={(e) => setBtnIconColor(e.target.value)}
                             className="flex-1 min-w-0 px-3 border border-zinc-200 rounded-xl text-sm font-mono text-zinc-800 bg-white uppercase font-bold"
                             placeholder={lang === "tr" ? "Yazı ile aynı" : "Same as text"}
                           />
                         </div>
                       </div>

                       {/* Social Links List Inputs */}
                       <div className="space-y-3 pt-3 border-t border-zinc-200/60">
                         <label className="text-xs font-bold text-zinc-700 block">
                           {lang === "tr" ? "Sosyal Medya Hesaplarınız" : "Your Social Media Accounts"}
                         </label>
                         <div className="space-y-3">
                           {[
                             { id: "INSTAGRAM", name: "Instagram", placeholder: "kullanıcıadı veya link" },
                             { id: "WHATSAPP", name: "WhatsApp", placeholder: "+905... veya link" },
                             { id: "TIKTOK", name: "TikTok", placeholder: "kullanıcıadı veya link" },
                             { id: "YOUTUBE", name: "YouTube", placeholder: "kanal veya link" },
                             { id: "X", name: "Twitter/X", placeholder: "kullanıcıadı veya link" },
                             { id: "LINKEDIN", name: "LinkedIn", placeholder: "profil linki" },
                             { id: "FACEBOOK", name: "Facebook", placeholder: "profil linki" }
                           ].map(platform => {
                             const linkItem = links.find(l => l.type === platform.id);
                             const currentVal = linkItem ? linkItem.url : "";
                             return (
                               <div key={platform.id} className="space-y-1.5">
                                 <label className="text-[11px] font-bold text-zinc-650 block">
                                   {platform.name}
                                 </label>
                                 <input
                                   type="text"
                                   value={currentVal}
                                   onChange={(e) => handleSocialChange(platform.id, e.target.value)}
                                   onBlur={(e) => handleSocialBlur(platform.id, e.target.value)}
                                   placeholder={platform.placeholder}
                                   className="w-full px-3.5 py-2 bg-white border border-zinc-200 rounded-xl text-xs outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all font-semibold text-zinc-800"
                                 />
                               </div>
                             );
                           })}
                         </div>
                       </div>
                     </div>

                     {/* 4. LİNK EKLEME & ÇIKARTMA */}
                     <div className="space-y-4 bg-zinc-50/50 p-4 md:p-5 rounded-2xl border border-zinc-100 shadow-sm">
                       <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-1">
                         <Code className="h-4 w-4 text-teal-500" />
                         {lang === "tr" ? "Özel Link Ekleme & Çıkartma" : "Custom Link Management"}
                       </h3>

                       {/* List of Custom Links */}
                       <div className="space-y-2.5">
                         <label className="text-xs font-bold text-zinc-700 block">
                           {lang === "tr" ? "Mevcut Özel Linkleriniz" : "Your Custom Links"}
                         </label>
                         {(() => {
                           const customLinks = links.filter(l => !["INSTAGRAM", "WHATSAPP", "TIKTOK", "YOUTUBE", "X", "LINKEDIN", "FACEBOOK"].includes(l.type || ""));
                           if (customLinks.length === 0) {
                             return (
                               <p className="text-xs text-zinc-400 italic">
                                 {lang === "tr" ? "Henüz özel link eklenmemiş." : "No custom links added yet."}
                               </p>
                             );
                           }
                           return (
                             <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1">
                               {customLinks.map((link) => (
                                 <div key={link.id} className="flex items-center justify-between p-3 bg-white border border-zinc-200 rounded-xl shadow-sm text-zinc-800">
                                   <div className="flex items-center gap-3 overflow-hidden">
                                     <div className="h-8 w-8 rounded-full bg-teal-50 text-teal-650 flex items-center justify-center shrink-0 border border-teal-100">
                                       {getLinkIconHelper(link.type, link.url)}
                                     </div>
                                     <div className="flex flex-col min-w-0">
                                       <span className="text-xs font-bold truncate text-zinc-900">{link.title}</span>
                                       <span className="text-[10px] text-zinc-400 truncate">{link.url}</span>
                                     </div>
                                   </div>
                                   <button
                                     type="button"
                                     disabled={isPending}
                                     onClick={() => {
                                       startTransition(async () => {
                                         try {
                                           if (!link.id.startsWith("temp-")) {
                                             await deleteLink(link.id);
                                           }
                                           setLinks(prev => prev.filter(l => l.id !== link.id));
                                           setSuccessMsg(lang === "tr" ? "Link silindi!" : "Link deleted!");
                                           setTimeout(() => setSuccessMsg(""), 3000);
                                         } catch (e: any) {
                                           setErrorMsg(e.message || "Failed to delete link");
                                           setTimeout(() => setErrorMsg(""), 4000);
                                         }
                                       });
                                     }}
                                     className="p-2 bg-zinc-50 hover:bg-red-50 text-zinc-400 hover:text-red-500 rounded-lg cursor-pointer border border-zinc-150 transition-colors"
                                   >
                                     <Trash2 className="h-3.5 w-3.5" />
                                   </button>
                                 </div>
                               ))}
                             </div>
                           );
                         })()}
                       </div>

                       {/* Form to Add New Custom Link */}
                       <div className="space-y-3 pt-3 border-t border-zinc-200/60">
                         <label className="text-xs font-bold text-zinc-700 block">
                           {lang === "tr" ? "Yeni Özel Link Ekle" : "Add New Custom Link"}
                         </label>
                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                           <div className="space-y-1">
                             <label className="text-[10px] text-zinc-500 font-bold block">{lang === "tr" ? "Link Başlığı" : "Link Title"}</label>
                             <input
                               type="text"
                               value={newLinkTitle}
                               onChange={(e) => setNewLinkTitle(e.target.value)}
                               placeholder={lang === "tr" ? "Örn. Web Sitem" : "e.g. My Website"}
                               className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-xl text-xs outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all font-semibold text-zinc-800"
                             />
                           </div>
                           <div className="space-y-1">
                             <label className="text-[10px] text-zinc-500 font-bold block">{lang === "tr" ? "Hedef URL" : "Target URL"}</label>
                             <input
                               type="text"
                               value={newLinkUrl}
                               onChange={(e) => setNewLinkUrl(e.target.value)}
                               placeholder="https://..."
                               className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-xl text-xs outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all font-semibold text-zinc-800"
                             />
                           </div>
                         </div>

                         <button
                           type="button"
                           disabled={isPending || !newLinkTitle || !newLinkUrl}
                           onClick={() => {
                             startTransition(async () => {
                               try {
                                 let formattedUrl = newLinkUrl.trim();
                                 if (!/^https?:\/\//i.test(formattedUrl)) {
                                   formattedUrl = `https://${formattedUrl}`;
                                 }

                                 const res = await addLink(
                                   user.id,
                                   newLinkTitle,
                                   formattedUrl,
                                   "WEBSITE",
                                   "",
                                   "TEXT_LINK",
                                   null
                                 );
                                 if (res && (res as any).error) throw new Error((res as any).error);

                                 // Add locally with temporary ID
                                 const newLinkObj = {
                                   id: Math.random().toString(),
                                   title: newLinkTitle,
                                   url: formattedUrl,
                                   isActive: true,
                                   type: "WEBSITE",
                                   blockType: "TEXT_LINK"
                                 };

                                 setLinks(prev => [...prev, newLinkObj]);
                                 setNewLinkTitle("");
                                 setNewLinkUrl("");
                                 setSuccessMsg(lang === "tr" ? "Link başarıyla eklendi!" : "Link added successfully!");
                                 setTimeout(() => setSuccessMsg(""), 3000);
                               } catch (e: any) {
                                 setErrorMsg(e.message || "Failed to add link");
                                 setTimeout(() => setErrorMsg(""), 4000);
                               }
                             });
                           }}
                           className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold transition-colors cursor-pointer disabled:opacity-50"
                         >
                           <Plus className="h-4 w-4" />
                           <span>{lang === "tr" ? "Listeye Ekle ve Önizle" : "Add to List & Preview"}</span>
                         </button>
                       </div>
                     </div>

                     {/* 5. ACTION BUTTONS */}
                     <div className="pt-4 flex gap-3 border-t border-zinc-150">
                       <button
                         type="button"
                         disabled={isPending}
                         onClick={() => {
                           startTransition(async () => {
                             try {
                               // 1. Apply the active template
                               await applyTemplateToProfile(user.id, activeTemplateToCustomize.id);
                               
                               // 2. Sync social links to DB
                               for (const platform of ["INSTAGRAM", "WHATSAPP", "TIKTOK", "YOUTUBE", "X", "LINKEDIN", "FACEBOOK"]) {
                                 const oldLink = initialLinks.find(l => l.type === platform);
                                 const currentLink = links.find(l => l.type === platform && !l.id.startsWith("temp-"));
                                 const tempLink = links.find(l => l.type === platform && l.id.startsWith("temp-"));

                                 const finalUrl = currentLink?.url || tempLink?.url || "";

                                 if (oldLink) {
                                   if (!finalUrl) {
                                     await deleteLink(oldLink.id);
                                   } else if (finalUrl !== oldLink.url) {
                                     await deleteLink(oldLink.id);
                                     await addLink(
                                       user.id,
                                       platform === "X" ? "Twitter/X" : platform.charAt(0) + platform.slice(1).toLowerCase(),
                                       finalUrl,
                                       platform,
                                       "",
                                       "TEXT_LINK",
                                       null
                                     );
                                   }
                                 } else if (finalUrl) {
                                   await addLink(
                                     user.id,
                                     platform === "X" ? "Twitter/X" : platform.charAt(0) + platform.slice(1).toLowerCase(),
                                     finalUrl,
                                     platform,
                                     "",
                                     "TEXT_LINK",
                                     null
                                   );
                                 }
                               }

                               // 3. Update Profile settings
                               await updateProfile(
                                 user.id,
                                 user.profile?.bio || "",
                                 activeTemplateToCustomize.name, // theme
                                 user.username || "",
                                 avatarUrl || undefined, // dynamic profile photo
                                 background || undefined,
                                 fontStyle || undefined,
                                 bioColor || undefined,
                                 usernameColor || undefined,
                                 activeTemplateCss || null,
                                 activeTemplateToCustomize.buttonStyle
                               );

                               // 4. Update Links custom styling
                               await updateAllLinksCustomStyle(
                                 user.id,
                                 btnBgColor || null,
                                 btnTextColor || null,
                                 btnBorderColor || null,
                                 btnBorderStyle || null,
                                 btnBorderWidth || null,
                                 btnBorderRadius || null,
                                 btnShadow || null,
                                 btnFontWeight || null,
                                 btnIconColor || null
                               );

                               setSuccessMsg(lang === "tr" ? "Tasarım başarıyla kaydedildi ve uygulandı!" : "Design saved and applied successfully!");
                               setCustomizingTemplateId(null);
                               
                               // Refresh list status
                               setOwnedTemplates(prev => prev.map(t => ({
                                 ...t,
                                 isActive: t.id === activeTemplateToCustomize.id
                               })));
                               
                               setActiveTemplate({
                                 id: activeTemplateToCustomize.id,
                                 name: activeTemplateToCustomize.name,
                                 bgColor: background,
                                 fontStyle: fontStyle,
                                 buttonStyle: activeTemplateToCustomize.buttonStyle,
                                 isCoded: activeTemplateToCustomize.isCoded,
                                 customCss: activeTemplateCss,
                                 configJson: activeTemplateToCustomize.configJson || null
                               });

                               setTimeout(() => setSuccessMsg(""), 3000);
                             } catch (err: any) {
                               setErrorMsg(err.message || "Failed to save design overrides.");
                               setTimeout(() => setErrorMsg(""), 4000);
                             }
                           });
                         }}
                         className="flex-1 py-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-900 text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 border-none shadow-md hover:shadow-lg disabled:opacity-50 font-bold"
                       >
                         <Check className="h-4 w-4" />
                         <span>{lang === "tr" ? "Değişiklikleri Kaydet" : "Save Changes"}</span>
                       </button>

                       <button
                         type="button"
                         onClick={() => setCustomizingTemplateId(null)}
                         className="px-6 py-3 rounded-xl border border-zinc-200 hover:bg-zinc-50 text-zinc-700 text-xs font-bold transition-all cursor-pointer"
                       >
                         {lang === "tr" ? "Vazgeç" : "Cancel"}
                       </button>
                     </div>
                   </div>
                 </div>
               </div>
             );
           }

           return (
 <div className="w-full max-w-full space-y-5 md:space-y-8 animate-in fade-in slide-in-from-bottom-3 duration-350 overflow-hidden">
 <div className={`p-3 md:p-6 rounded-2xl border space-y-5 md:space-y-6 w-full max-w-full overflow-hidden ${
 "bg-white border-zinc-200 shadow-sm"
 }`}>
 <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-zinc-150 pb-4 md:pb-5">
 <div className="flex items-center gap-3">
 <Palette className="h-5 w-5 text-teal-500" />
 <div>
 <h2 className={`font-extrabold text-lg ${"text-zinc-950"}`}>
 {lang === "tr" ? "Satın Alınan Şablonlarım" : "My Purchased Templates"}
 </h2>
 <p className="text-xs text-slate-500">
 {lang === "tr" 
 ? "Satın aldığınız şablonları buradan yönetebilir ve tek tıkla profilinize uygulayabilirsiniz." 
 : "Manage and apply your purchased designs directly to your public link profile page."}
 </p>
 </div>
 </div>
 
 <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
    <a
      href={`/${initialUser.username}${customizingTemplateId ? `?previewTemplate=${customizingTemplateId}` : ""}`}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-2xl border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-700 text-xs font-bold shadow-sm transition-all cursor-pointer whitespace-nowrap active:scale-95 hover:border-zinc-300"
    >
      <ExternalLink className="h-3.5 w-3.5 text-teal-500 animate-pulse" />
      <span>{lang === "tr" ? "Şablon Önizleme Linki" : "Template Preview Link"}</span>
    </a>

    <Link
      href="/sablonlar"
      className="px-4 py-2.5 rounded-2xl bg-teal-500 hover:bg-teal-400 text-slate-900 text-xs font-black transition-colors cursor-pointer whitespace-nowrap"
    >
      {lang === "tr" ? "Yeni Şablon Al" : "Browse Showcase"}
    </Link>
  </div>
 </div>

 {ownedTemplates.length === 0 ? (
 <div className="text-center py-10 space-y-4">
 <div className="w-12 h-12 rounded-full bg-zinc-100 flex items-center justify-center mx-auto text-zinc-400">
 <Palette className="h-6 w-6" />
 </div>
 <div className="space-y-1">
 <p className="text-sm font-bold text-zinc-800">
 {lang === "tr" ? "Henüz şablon satın almadınız" : "No templates purchased yet"}
 </p>
 <p className="text-xs text-slate-500 max-w-sm mx-auto">
 {lang === "tr" 
 ? "Şablon vitrinimizi ziyaret ederek profilinize harika bir görünüm kazandıracak profesyonel temaları inceleyebilirsiniz." 
 : "Visit our showcase and pick beautiful themes to upgrade your visual presence."}
 </p>
 </div>
 <Link
 href="/sablonlar"
 className="inline-flex items-center gap-1.5 px-4 py-2.5 md:py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-900 text-xs font-black transition-colors cursor-pointer"
 >
 <span>{lang === "tr" ? "Şablon Vitrinine Git" : "Go to Showcase"}</span>
 <ArrowRight className="h-3.5 w-3.5" />
 </Link>
 </div>
 ) : (
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
 {ownedTemplates.map((template) => {
 const isCurrentlyApplied = background === template.bgColor && fontStyle === template.fontStyle;
 return (
 <div 
 key={template.id} 
 className={`w-full max-w-full overflow-hidden p-4 md:p-5 rounded-2xl border transition-all flex flex-col justify-between gap-5 ${
 isCurrentlyApplied 
 ? "bg-teal-50/20 border-teal-500 shadow-md shadow-teal-500/5" 
 : "bg-zinc-50/50 border-zinc-200 hover:border-zinc-300 hover:shadow-sm"
 }`}
 >
 <div className="flex items-start justify-between">
 <div className="flex items-center gap-3">
 <div className="w-10 h-10 rounded-xl bg-zinc-100 flex items-center justify-center border border-zinc-200">
 <Palette className="h-5 w-5 text-zinc-700" />
 </div>
 <div>
 <div className="flex items-center gap-2">
 <h3 className="text-sm font-black text-zinc-900">{template.name}</h3>
 {activeTemplate?.id === template.id && (
  <span className="text-[9px] font-black text-teal-700 bg-teal-400/20 border border-teal-500/30 px-2 py-0.5 rounded-full uppercase tracking-wider animate-pulse">
  {lang === "tr" ? "Aktif" : "Active"}
  </span>
  )}
 </div>
 {(ownedTemplates.find((ut: any) => ut.id === template.id)?.isActive) ? (
 <div className="text-[10px] font-bold text-emerald-500 mt-0.5 px-2 py-0.5 rounded-md bg-emerald-50 inline-block border border-emerald-100">
 {lang === "tr" ? "Yayında" : "Published"}
 </div>
 ) : (
 <div className="text-[10px] font-bold text-zinc-500 mt-0.5 px-2 py-0.5 rounded-md bg-zinc-100 inline-block border border-zinc-200">
 {lang === "tr" ? "Taslak" : "Draft"}
 </div>
 )}
 </div>
 </div>
 <span className="text-[10px] font-bold text-teal-600 bg-teal-50 border border-teal-100 px-2 py-0.5 rounded-full">
 {template.category}
 </span>
 </div>

 <div className="flex gap-2 w-full">
 <button
 type="button"
 onClick={() => {
 const baseUrl = initialUser.profile?.customDomain 
 ? `https://${initialUser.profile.customDomain}`
 : `${window.location.protocol}//${window.location.host}`;
 const customUrl = (ownedTemplates.find((ut: any) => ut.id === template.id) as any)?.customUrl;
 
 if (customUrl) {
 window.open(`${baseUrl}/${customUrl}`, "_blank");
 } else {
 const url = `${baseUrl}/${initialUser.username}?previewTemplate=${template.id}`;
 window.open(url, "_blank");
 }
 }}
 className="flex-1 py-2.5 md:py-2 rounded-xl border border-zinc-200 hover:bg-zinc-100 text-zinc-700 text-[10px] font-black transition-colors cursor-pointer flex items-center justify-center gap-1"
 >
 <Eye className="h-3.5 w-3.5" />
 <span>{lang === "tr" ? "Canlı Önizle" : "Live Preview"}</span>
 </button>

 <button
 type="button"
 onClick={() => {
 setBackground(template.bgColor);
 setFontStyle(template.fontStyle);
 setActiveTemplateCss(template.isCoded ? (template.customCss || null) : null);
 setTheme(template.name);
 setCustomizingTemplateId(customizingTemplateId === template.id ? null : template.id);
 }}
 className="flex-1 py-2.5 md:py-2 rounded-xl border border-zinc-200 hover:bg-zinc-100 text-zinc-700 text-[10px] font-black transition-colors cursor-pointer flex items-center justify-center gap-1"
 >
 <Settings className="h-3.5 w-3.5" />
 <span>{lang === "tr" ? "Düzenle" : "Customize"}</span>
 </button>
 </div>

 <button
  type="button"
  disabled={isPending}
  onClick={() => {
  startTransition(async () => {
  try {
  // Find the UserTemplate relation to toggle it from local state
  const userTemplateRecord = ownedTemplates.find((ut: any) => ut.id === template.id);
  const currentActiveStatus = userTemplateRecord?.isActive || false;
  
  const res = await toggleUserTemplateActive(initialUser.id, template.id, !currentActiveStatus);
  if (res.success) {
  // Update local state visually
  setOwnedTemplates(prev => prev.map(t => ({
  ...t,
  isActive: t.id === template.id ? res.isActive : false
  })));
 
  if (res.isActive) {
  // Update global activeTemplate state
  setActiveTemplate({
    id: template.id,
    name: template.name,
    bgColor: template.bgColor,
    fontStyle: template.fontStyle,
    buttonStyle: template.buttonStyle,
    isCoded: template.isCoded,
    customCss: template.customCss || null,
    configJson: template.configJson || null
  });

  setBackground(template.bgColor);
  if (template.fontStyle) setFontStyle(template.fontStyle);
  setTheme(template.name);
  if (template.buttonStyle) {
  const parsed = parseButtonStyle(template.buttonStyle);
  setBtnBgColor(parsed.bgColor);
  setBtnTextColor(parsed.textColor);
  setBtnBorderColor(parsed.borderColor);
  setBtnBorderStyle(parsed.borderStyle);
  setBtnBorderWidth(parsed.borderWidth);
  setBtnBorderRadius(parsed.borderRadius);
  setBtnShadow(parsed.shadow);
  setBtnFontWeight(parsed.fontWeight);
  setLinks(prev => prev.map(l => ({
  ...l, ...parsed
  })));
  }
  setSuccessMsg(lang === "tr" ? "Şablon başarıyla aktifleştirildi!" : "Template activated!");
  } else {
  // Deactivate template - set global activeTemplate to null
  setActiveTemplate(null);
  setSuccessMsg(lang === "tr" ? "Şablon taslağa alındı." : "Template moved to draft.");
  }
  setTimeout(() => setSuccessMsg(""), 3000);
  }
  } catch (e: any) {
  setErrorMsg(e.message || "An error occurred");
  setTimeout(() => setErrorMsg(""), 4000);
  }
  });
  }}
  className={`w-full py-3 rounded-xl font-black text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer border ${
    activeTemplate?.id === template.id
    ? "bg-teal-500 border-teal-500 hover:bg-teal-400 text-slate-900 shadow-md shadow-teal-500/10"
    : "bg-zinc-900 border-zinc-900 hover:bg-zinc-800 text-white shadow-sm"
  }`}
  >
  {activeTemplate?.id === template.id ? (
    <>
      <Check className="h-4 w-4" />
      <span>{lang === "tr" ? "Aktif Şablon (Devre Dışı Bırak)" : "Active Template (Deactivate)"}</span>
    </>
  ) : (
    <span>{lang === "tr" ? "Şablonu Aktifleştir" : "Activate Template"}</span>
  )}
  </button>

 {/* CUSTOM URL SETTING */}
 <div className="flex flex-col gap-2 p-3 rounded-xl bg-zinc-50/50 border border-zinc-100 overflow-hidden w-full">
 <span className="text-xs font-extrabold text-zinc-700">
 {lang === "tr" ? "Özel Şablon Linki" : "Custom Template Link"}
 </span>
 <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 overflow-hidden w-full">
 <span className="text-xs font-bold text-zinc-400 whitespace-nowrap">link-saas.vercel.app/</span>
 <input
 type="text"
 className="w-full min-w-0 bg-transparent border-b border-zinc-200 outline-none focus:border-teal-500 py-2 text-sm font-semibold"
 placeholder={lang === "tr" ? "kampanyam" : "my-campaign"}
 defaultValue={(ownedTemplates.find((ut: any) => ut.id === template.id) as any)?.customUrl || ""}
 onBlur={(e) => {
 const newUrl = e.target.value.trim().toLowerCase();
 const currentUrl = (ownedTemplates.find((ut: any) => ut.id === template.id) as any)?.customUrl || "";
 if (newUrl === currentUrl) return;

 startTransition(async () => {
 try {
 const res = await fetch("/api/user-templates/custom-url", {
 method: "POST",
 headers: { "Content-Type": "application/json" },
 body: JSON.stringify({ userTemplateId: (ownedTemplates.find((ut: any) => ut.id === template.id) as any)?.userTemplateId, customUrl: newUrl })
 });
 const data = await res.json();
 if (data.error) {
 e.target.value = currentUrl;
 setErrorMsg(data.error);
 setTimeout(() => setErrorMsg(""), 4000);
 } else {
 setOwnedTemplates(prev => prev.map(t => t.id === template.id ? { ...t, customUrl: data.customUrl } : t));
 setSuccessMsg(lang === "tr" ? "Özel link güncellendi!" : "Custom link updated!");
 setTimeout(() => setSuccessMsg(""), 3000);
 }
 } catch (err: any) {
 e.target.value = currentUrl;
 setErrorMsg(lang === "tr" ? "Bir hata oluştu." : "An error occurred.");
 setTimeout(() => setErrorMsg(""), 4000);
 }
 });
 }}

 />
 </div>
 <p className="text-[9px] text-zinc-500 leading-tight">
 {lang === "tr" 
 ? "Eğer boş bırakırsanız özel link devre dışı kalır. Bu link sadece bu şablonun uygulanmış halini gösterir."
 : "If left empty, custom link is disabled. This link displays your profile with this specific template applied."}
 </p>
 </div>

 {/* Template Customization Modal Moved to Root */}
 </div>
 );
 })}
 </div>
 )}
 </div>
 </div>
 )})()}
      </div>

      {/* RIGHT COLUMN: PREVIEW */}
      <PhonePreview mode="template" data={previewData} />
    </div>
  );
}
