"use client";


import { useState, useEffect, useTransition, useMemo, useRef } from "react";
import Link from "next/link";
import { SignOutButton } from "@clerk/nextjs";
import {
  addLink,
  deleteLink,
  toggleLinkActive,
  updateProfile,
  updateLinkAnimation,
  updateLinkCustomStyle,
  updateAllLinksCustomStyle,
  toggleUserTemplateActive,
  saveUserCustomTemplate,
  deleteUserCustomTemplate
} from "@/app/actions";
import {
  Trash2,
  X,
  Plus,
  Sparkles,
  ExternalLink,
  Laptop,
  Palette,
  Check,
  User,
  Music,
  ShoppingBag,
  Info,
  Loader2,
  ArrowRight,
  TrendingUp,
  Eye,
  MousePointerClick,
  Percent,
  QrCode,
  Globe,
  Search,
  Settings,
  ShieldAlert,
  Lock,
  Download,
  Copy,
  FileText,
  List,
  Briefcase,
  Play,
  Image,
  MessageCircle,
  Utensils,
  Smartphone,
  Wifi,
  GripVertical,
  ChevronDown,
  ChevronUp,
  Share2,
  Users,
  Mail,
  Puzzle,
  Type,
  Link2
} from "lucide-react";
import { YoutubeIcon, TwitterIcon, LinkedinIcon, TiktokIcon, PinterestIcon, InstagramIcon } from "@/components/brand-icons";
import PhonePreview from "@/components/dashboard/phone-preview";
import { useDashboard } from "../dashboard-context";
import { parseButtonStyle } from "@/lib/parse-button-style";

type LinkClickItem = {
  id: string;
  createdAt: string;
};

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
  clicks?: LinkClickItem[];
};

const DEFAULT_FREE_BACKGROUNDS = [
  { id: "bg-slate-free", name: "Slate Minimal", css: "bg-gradient-to-tr from-slate-900 via-zinc-900 to-slate-900" },
  { id: "bg-black-free", name: "Obsidian Black", css: "bg-gradient-to-br from-zinc-900 to-black" },
  { id: "bg-stone-free", name: "Stone Dust", css: "bg-gradient-to-tr from-zinc-950 to-stone-900" },
  { id: "bg-metal-free", name: "Anthracite", css: "bg-gradient-to-r from-zinc-900 via-zinc-955 to-zinc-900" },
  { id: "bg-purple-free", name: "Deep Amethyst", css: "bg-gradient-to-b from-purple-950/20 via-zinc-955 to-black" },
];

const DEFAULT_STARTER_BACKGROUNDS = [
  { id: "bg-indigo-space", name: "Indigo Space", css: "bg-gradient-to-tr from-indigo-950 via-zinc-955 to-indigo-900" },
  { id: "bg-emerald-acid", name: "Acid Emerald", css: "bg-gradient-to-br from-emerald-950 via-zinc-955 to-teal-900" },
  { id: "bg-nebula-glow", name: "Nebula Glow", css: "bg-gradient-to-r from-purple-950 via-zinc-955 to-pink-955" },
  { id: "bg-anthracite-metal", name: "Anthracite Metal", css: "bg-gradient-to-tr from-slate-900 via-zinc-955 to-zinc-900" },
  { id: "bg-cyber-rose", name: "Cyber Rose", css: "bg-gradient-to-b from-rose-950 via-zinc-955 to-violet-955" },
  { id: "bg-deep-ocean", name: "Deep Ocean", css: "bg-gradient-to-tr from-cyan-950 via-zinc-955 to-blue-955" },
  { id: "bg-sunset-lava", name: "Sunset Lava", css: "bg-gradient-to-r from-orange-950 via-zinc-955 to-red-955" },
  { id: "bg-obsidian-stone", name: "Obsidian Stone", css: "bg-gradient-to-b from-zinc-955 to-stone-900" },
  { id: "bg-fuchsia-dust", name: "Fuchsia Dust", css: "bg-gradient-to-tr from-violet-955 to-zinc-955" },
  { id: "bg-midday-twilight", name: "Midday Twilight", css: "bg-gradient-to-br from-blue-955 via-slate-955 to-black" },
];

const DEFAULT_CREATOR_BACKGROUNDS = [
  { id: "bg-hyper-sunset", name: "Hyper Sunset", css: "bg-gradient-to-tr from-pink-600 via-rose-500 to-yellow-500" },
  { id: "bg-neon-lime", name: "Acid Neon", css: "bg-gradient-to-br from-green-400 via-emerald-500 to-cyan-500" },
  { id: "bg-radioactive-cyan", name: "Neon Cyan", css: "bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600" },
  { id: "bg-electric-purple", name: "Cyber Magenta", css: "bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-fuchsia-500 via-purple-600 to-zinc-955" },
  { id: "bg-solar-flare", name: "Solar Flare", css: "bg-gradient-to-tr from-red-500 via-orange-500 to-yellow-400" },
  { id: "bg-aurora-glow", name: "Vivid Aurora", css: "bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-teal-400 via-emerald-600 to-zinc-955" },
  { id: "bg-barbie-pink", name: "Barbie Pink", css: "bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-500" },
  { id: "bg-miami-beach", name: "Miami Sunset", css: "bg-gradient-to-tr from-orange-400 via-pink-500 to-purple-600" },
  { id: "bg-electric-vortex", name: "Liquid Violet", css: "bg-[conic-gradient(at_top,_var(--tw-gradient-stops))] from-purple-600 via-indigo-600 to-black" },
  { id: "bg-cyber-gold", name: "Hyperion Gold", css: "bg-gradient-to-r from-yellow-500 via-amber-500 to-orange-600" },
];

const THEMES = [
  { id: "dark", name: "Deep Obsidian", bg: "bg-black border-gray-100", color: "from-zinc-900 to-black text-slate-900 hover:border-zinc-700" },
  { id: "neon-purple", name: "Nebula Purple", bg: "bg-purple-950/20 border-teal-500/20", color: "from-purple-950/40 via-fuchsia-950/30 to-black text-purple-200 hover:border-teal-500/50 shadow-[0_0_15px_rgba(168,85,247,0.15)]" },
  { id: "glow-green", name: "Cyberpunk Acid", bg: "bg-emerald-950/20 border-emerald-500/20", color: "from-emerald-950/40 to-black text-emerald-300 hover:border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.15)]" },
  { id: "pink-retro", name: "Synthwave", bg: "bg-pink-950/20 border-pink-500/20", color: "from-pink-950/40 via-rose-950/30 to-black text-pink-200 hover:border-pink-500/50 shadow-[0_0_15px_rgba(244,63,94,0.15)]" },
];

const getLinkIconHelper = (type: string | undefined, url: string | undefined) => {
  switch (type) {
    case "WEBSITE":
    case "FACEBOOK":
    case "INSTAGRAM":
      return <Globe className="h-4 w-4 text-emerald-500" />;
    case "PDF":
      return <FileText className="h-4 w-4 text-emerald-500" />;
    case "LINK_LIST":
      return <List className="h-4 w-4 text-emerald-500" />;
    case "VCARD":
      return <User className="h-4 w-4 text-emerald-500" />;
    case "BUSINESS":
      return <Briefcase className="h-4 w-4 text-emerald-500" />;
    case "VIDEO":
      return <Play className="h-4 w-4 text-emerald-500" />;
    case "IMAGES":
      return <Image className="h-4 w-4 text-emerald-500" />;
    case "SOCIAL_MEDIA":
    case "WHATSAPP":
      return <MessageCircle className="h-4 w-4 text-emerald-500" />;
    case "MP3":
      return <Music className="h-4 w-4 text-emerald-500" />;
    case "MENU":
      return <Utensils className="h-4 w-4 text-emerald-500" />;
    case "APPS":
      return <Smartphone className="h-4 w-4 text-emerald-500" />;
    case "COUPON":
      return <Percent className="h-4 w-4 text-emerald-500" />;
    case "WIFI":
      return <Wifi className="h-4 w-4 text-emerald-500" />;
    default:
      if (url) {
        const lowerUrl = url.toLowerCase();
        if (lowerUrl.includes("spotify") || lowerUrl.includes("soundcloud") || lowerUrl.includes("music")) {
          return <Music className="h-4 w-4 text-emerald-500" />;
        }
        if (lowerUrl.includes("shop") || lowerUrl.includes("store") || lowerUrl.includes("presets")) {
          return <ShoppingBag className="h-4 w-4 text-emerald-500" />;
        }
        if (lowerUrl.includes("website") || lowerUrl.includes("portfolio")) {
          return <Globe className="h-4 w-4 text-emerald-500" />;
        }
      }
      return <Globe className="h-4 w-4 text-emerald-500" />;
  }
};


type TemplateItem = {
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
  customCss: string | null;
  configJson: string | null;
};

interface EditorClientProps {
  initialLinks: LinkItem[];
  initialOwnedTemplates?: TemplateItem[];
  systemSettings?: {
    adScript?: string | null;
    customImageUrl?: string | null;
    customTargetUrl?: string | null;
    isActive: boolean;
  } | null;
}

export default function EditorClient({ initialLinks, initialOwnedTemplates, systemSettings }: EditorClientProps) {
  const {
    user,
    globalSettings,
    lang,
    simulatedPlan,
    setSimulatedPlan,
    triggerUpgradeModal,
    successMsg,
    setSuccessMsg,
    errorMsg,
    setErrorMsg,
    isPending,
    startTransition,
    fonts,
    activeTemplate,
    setActiveTemplate
  } = useDashboard();

  const initialUser = user;
  const initialFonts = fonts;

  // Local States
  const [links, setLinks] = useState<LinkItem[]>(initialLinks);
  const [ownedTemplates, setOwnedTemplates] = useState<TemplateItem[]>(initialOwnedTemplates || []);
  const [isSaveTemplateModalOpen, setIsSaveTemplateModalOpen] = useState(false);
  const [templateSaveName, setTemplateSaveName] = useState("");
  const [saveTemplateError, setSaveTemplateError] = useState("");
  const [bio, setBio] = useState(user.profile?.bio ?? "");
  const [avatarUrl, setAvatarUrl] = useState(user.profile?.avatarUrl ?? "");
  const [avatarShape, setAvatarShape] = useState(user.profile?.avatarShape ?? "circle");
  const [background, setBackground] = useState(user.profile?.background ?? "");
  const [activeTemplateCss, setActiveTemplateCss] = useState<string | null>(user.profile?.customCss ?? null);
  const [buttonClass, setButtonClass] = useState<string | null>(user.profile?.buttonClass ?? null);
  const [theme, setTheme] = useState(user.profile?.theme ?? "dark");
  const [fontStyle, setFontStyle] = useState(user.profile?.fontStyle ?? "Inter");
  const [bioColor, setBioColor] = useState(user.profile?.bioColor ?? "#888888");
  const [usernameColor, setUsernameColor] = useState(user.profile?.usernameColor ?? "#ffffff");
  const [username, setUsername] = useState(user.username ?? "");

  const [activeSubTab, setActiveSubTab] = useState<"links" | "appearance" | "profile">("appearance");
  const [activeAppSection, setActiveAppSection] = useState<"links" | "theme" | "typography" | "wallpaper" | "buttons" | "colors">("links");
  const [expandedLinkCard, setExpandedLinkCard] = useState<string | null>(null);

  // Link form states
  const [newTitle, setNewTitle] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [newLinkIcon, setNewLinkIcon] = useState<string>("WEBSITE");
  const [linkSelectedTemplate, setLinkSelectedTemplate] = useState<string | null>(null);
  const [blockType, setBlockType] = useState("TEXT_LINK");
  const [beforeImage, setBeforeImage] = useState("");
  const [afterImage, setAfterImage] = useState("");
  const [blockFileError, setBlockFileError] = useState("");
  const [customBgError, setCustomBgError] = useState<string>("");

  // Wifi inputs
  const [wifiSsid, setWifiSsid] = useState("");
  const [wifiPassword, setWifiPassword] = useState("");
  const [wifiEncryption, setWifiEncryption] = useState<"WEP" | "WPA" | "nopass">("WPA");

  // WhatsApp inputs
  const [whatsAppPhone, setWhatsAppPhone] = useState("");
  const [whatsAppMessage, setWhatsAppMessage] = useState("");

  // vCard inputs
  const [vCardName, setVCardName] = useState("");
  const [vCardPhone, setVCardPhone] = useState("");
  const [vCardEmail, setVCardEmail] = useState("");
  const [vCardOrg, setVCardOrg] = useState("");
  const [vCardTitle, setVCardTitle] = useState("");
  const [vCardUrl, setVCardUrl] = useState("");

  // AI states
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiResult, setAiResult] = useState<{ bio: string; palette: { primary: string; secondary: string; background: string }; theme: string; sampleLinks: { title: string; url: string }[] } | null>(null);

  // Button customization states
  const firstLink = initialLinks?.[0];
  const [btnBgColor, setBtnBgColor] = useState(firstLink?.bgColor || "");
  const [btnTextColor, setBtnTextColor] = useState(firstLink?.textColor || "");
  const [btnBorderColor, setBtnBorderColor] = useState(firstLink?.borderColor || "");
  const [btnBorderStyle, setBtnBorderStyle] = useState(firstLink?.borderStyle || "solid");
  const [btnBorderWidth, setBtnBorderWidth] = useState(firstLink?.borderWidth || "1px");
  const [btnBorderRadius, setBtnBorderRadius] = useState(firstLink?.borderRadius || "12px");
  const [btnShadow, setBtnShadow] = useState(firstLink?.shadow || "none");
  const [btnFontWeight, setBtnFontWeight] = useState(firstLink?.fontWeight || "font-bold");
  const [btnIconColor, setBtnIconColor] = useState("");
  const [quickLinkIconColor, setQuickLinkIconColor] = useState("");

  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  // Background and animation lists
  const FREE_BACKGROUNDS = useMemo(() => {
    return globalSettings?.["backgrounds_free"] 
      ? JSON.parse(globalSettings["backgrounds_free"]) 
      : DEFAULT_FREE_BACKGROUNDS;
  }, [globalSettings]);

  const STARTER_BACKGROUNDS = useMemo(() => {
    return globalSettings?.["backgrounds_starter"] 
      ? JSON.parse(globalSettings["backgrounds_starter"]) 
      : DEFAULT_STARTER_BACKGROUNDS;
  }, [globalSettings]);

  const CREATOR_BACKGROUNDS = useMemo(() => {
    return globalSettings?.["backgrounds_creator"] 
      ? JSON.parse(globalSettings["backgrounds_creator"]) 
      : DEFAULT_CREATOR_BACKGROUNDS;
  }, [globalSettings]);

  const animations = useMemo(() => {
    const defaultFree = [
      { id: "anim-none", label: "Sabit (None)", tier: "FREE" },
      { id: "anim-hover-scale", label: "Büyüme (Hover Scale)", tier: "FREE" },
      { id: "anim-hover-lift", label: "Kaldırma (Hover Lift)", tier: "FREE" },
      { id: "anim-pulse-slow", label: "Yavaş Nabız (Pulse)", tier: "FREE" },
      { id: "anim-fade-in", label: "Giriş Efekti (Fade In)", tier: "FREE" }
    ];

    const defaultStarter = [
      { id: "anim-hover-wobble", label: "Sallanma (Hover Wobble)", tier: "STARTER" },
      { id: "anim-bounce-infinite", label: "Zıplama (Bounce)", tier: "STARTER" },
      { id: "anim-shake-horizontal", label: "Sarsıntı (Hover Shake)", tier: "STARTER" },
      { id: "anim-neon-glow-emerald", label: "Yeşil Neon (Emerald Glow)", tier: "STARTER" },
      { id: "anim-border-draw", label: "Kenarlık Çizgisi (Border Draw)", tier: "STARTER" }
    ];

    const defaultCreator = [
      { id: "anim-rgb-wave", label: "🔥 RGB Dalga (RGB Wave)", tier: "CREATOR" },
      { id: "anim-holographic", label: "✨ Hologram (Holographic)", tier: "CREATOR" },
      { id: "anim-neon-pulse", label: "⚡ Neon Nabız (Neon Pulse)", tier: "CREATOR" },
      { id: "anim-float-3d", label: "💎 3D Havada Kalma (3D Float)", tier: "CREATOR" },
      { id: "anim-magnetic", label: "🧲 Manyetik Aura (Magnetic)", tier: "CREATOR" }
    ];

    try {
      const freeList = globalSettings?.["animations_free"] ? JSON.parse(globalSettings["animations_free"]) : defaultFree;
      const starterList = globalSettings?.["animations_starter"] ? JSON.parse(globalSettings["animations_starter"]) : defaultStarter;
      const creatorList = globalSettings?.["animations_creator"] ? JSON.parse(globalSettings["animations_creator"]) : defaultCreator;
      const allAnims = [...freeList, ...starterList, ...creatorList];
      if (simulatedPlan === "CREATOR" || simulatedPlan === "PRO_BUSINESS") return allAnims;
      if (simulatedPlan === "STARTER") return allAnims.filter(a => a.tier === "FREE" || a.tier === "STARTER");
      return allAnims.filter(a => a.tier === "FREE");
    } catch (e) {
      const defaultAll = [...defaultFree, ...defaultStarter, ...defaultCreator];
      if (simulatedPlan === "CREATOR" || simulatedPlan === "PRO_BUSINESS") return defaultAll;
      if (simulatedPlan === "STARTER") return defaultAll.filter(a => a.tier === "FREE" || a.tier === "STARTER");
      return defaultAll.filter(a => a.tier === "FREE");
    }
  }, [globalSettings, simulatedPlan]);

  const computedQrValue = useMemo(() => {
    return "";
  }, []);

  const computedLinkValue = useMemo(() => {
    if (!linkSelectedTemplate) return "";
    switch (linkSelectedTemplate) {
      case "WIFI":
        return "WIFI:S:" + wifiSsid + ";T:" + wifiEncryption + ";P:" + wifiPassword + ";;";
      case "WHATSAPP":
        return "https://wa.me/" + whatsAppPhone.replace(/\s+/g, "") + "?text=" + encodeURIComponent(whatsAppMessage);
      case "VCARD":
        return "BEGIN:VCARD\nVERSION:3.0\nN:" + vCardName + "\nORG:" + vCardOrg + "\nTITLE:" + vCardTitle + "\nTEL:" + vCardPhone + "\nEMAIL:" + vCardEmail + "\nURL=" + (vCardUrl || "https://clinkor.com/" + username) + "\nEND:VCARD";
      default:
        return newUrl || "";
    }
  }, [linkSelectedTemplate, wifiSsid, wifiPassword, wifiEncryption, whatsAppPhone, whatsAppMessage, vCardName, vCardOrg, vCardTitle, vCardPhone, vCardEmail, vCardUrl, newUrl, username]);

  // Button change effect in editor
  useEffect(() => {
    setLinks(prev => prev.map(l => ({
      ...l,
      bgColor: btnBgColor || null,
      textColor: btnTextColor || null,
      borderColor: btnBorderColor || null,
      borderStyle: btnBorderStyle || null,
      borderWidth: btnBorderWidth || null,
      borderRadius: btnBorderRadius || null,
      shadow: btnShadow || null,
      fontWeight: btnFontWeight || null
    })));
  }, [btnBgColor, btnTextColor, btnBorderColor, btnBorderStyle, btnBorderWidth, btnBorderRadius, btnShadow, btnFontWeight]);

  // Handlers
   const handleAddLink = async (e: React.FormEvent) => {
 e.preventDefault();

 // Client-side gating based on simulatedPlan
 if (simulatedPlan === "FREE" && links.length >= 5) {
 triggerUpgradeModal(
 lang === "tr" ? "Link Sınırına Ulaştınız 🔒" : "Link Limit Reached 🔒",
 lang === "tr" 
 ? "Ücretsiz planda en fazla 5 link oluşturabilirsiniz. Sınırları kaldırmak için Premium pakete geçin!" 
 : "Free tier is limited to 5 links. Upgrade your plan to add unlimited links!"
 );
 return;
 }

 if (!newTitle) return;

 // For BEFORE_AFTER blocks, url is optional, so we can pass "#" if it's empty
 const finalUrl = (blockType === "BEFORE_AFTER") ? (newUrl || "#") : (computedLinkValue || newUrl);
 if (!finalUrl) return;

 setErrorMsg("");
 setSuccessMsg("");
 setBlockFileError("");

 startTransition(async () => {
 try {
 const typeParam = linkSelectedTemplate || newLinkIcon;
 
 // Construct block metadata payload
 let metaString: string | null = null;
 if (blockType === "BEFORE_AFTER") {
 if (!beforeImage || !afterImage) {
 throw new Error(lang === "tr" ? "Before/After blokları için iki görselin de yüklenmesi zorunludur!" : "Both images are required for Before/After blocks!");
 }
 metaString = JSON.stringify({ beforeImage, afterImage });
 }

 await addLink(
 initialUser.id, 
 newTitle, 
 finalUrl, 
 typeParam, 
 "", 
 blockType, 
 metaString
 );

 const tempId = Math.random().toString();
 setLinks([
 ...links, 
 { 
 id: tempId, 
 title: newTitle, 
 url: finalUrl, 
 isActive: true, 
 type: typeParam, 
 clicks: [],
 blockType,
 metadata: metaString,
 bgColor: btnBgColor || null,
 textColor: btnTextColor || null,
 borderColor: btnBorderColor || null,
 borderStyle: btnBorderStyle || null,
 borderWidth: btnBorderWidth || null,
 borderRadius: btnBorderRadius || null,
 shadow: btnShadow || null,
 fontWeight: btnFontWeight || null
 }
 ]);
 
 setNewTitle("");
 setNewUrl("");
 setNewLinkIcon("WEBSITE");
 setLinkSelectedTemplate(null);
 setBlockType("TEXT_LINK");
 setBeforeImage("");
 setAfterImage("");
 setWifiSsid("");
 setWifiPassword("");
 setWhatsAppPhone("");
 setWhatsAppMessage("");
 setVCardName("");
 setVCardPhone("");
 setVCardEmail("");
 setVCardOrg("");
 setVCardTitle("");
 setVCardUrl("");
 
 setSuccessMsg(lang === "tr" ? "Bağlantı başarıyla eklendi!" : "Link added successfully!");
 } catch (err: any) {
 setErrorMsg(err.message || "Failed to add link");
 }
 });
 };
   const handleDelete = async (id: string) => {
 setErrorMsg("");
 setSuccessMsg("");

 startTransition(async () => {
 try {
 await deleteLink(id);
 setLinks(links.filter((l) => l.id !== id));
 setSuccessMsg("Link deleted successfully.");
 } catch (err: any) {
 setErrorMsg("Failed to delete link.");
 }
 });
 };
   const handleToggleActive = async (id: string, currentStatus: boolean) => {
 startTransition(async () => {
 try {
 await toggleLinkActive(id, !currentStatus);
 setLinks(
 links.map((l) => (l.id === id ? { ...l, isActive: !currentStatus } : l))
 );
 } catch (err: any) {
 setErrorMsg("Failed to update status.");
 }
 });
 };
   const handleUpdateAnimation = async (id: string, animation: string) => {
 startTransition(async () => {
 try {
 await updateLinkAnimation(id, animation);
 setLinks(
 links.map((l) => (l.id === id ? { ...l, animation } : l))
 );
 setSuccessMsg(lang === "tr" ? "Bağlantı animasyonu güncellendi." : "Link animation updated.");
 } catch (err: any) {
 setErrorMsg(lang === "tr" ? "Animasyon güncellenirken hata oluştu." : "Failed to update animation.");
 }
 });
 };
   const handleUpdateLinkStyle = (
 linkId: string,
 key: "bgColor" | "textColor" | "borderColor" | "borderStyle" | "borderWidth" | "borderRadius" | "shadow" | "fontWeight",
 value: string | null
 ) => {
 setLinks((prev) =>
 prev.map((l) => (l.id === linkId ? { ...l, [key]: value } : l))
 );

 startTransition(async () => {
 try {
 const currentLink = links.find((l) => l.id === linkId);
 if (!currentLink) return;

 const nextStyles = {
 bgColor: currentLink.bgColor ?? null,
 textColor: currentLink.textColor ?? null,
 borderColor: currentLink.borderColor ?? null,
 borderStyle: currentLink.borderStyle ?? null,
 borderWidth: currentLink.borderWidth ?? null,
 borderRadius: currentLink.borderRadius ?? null,
 shadow: currentLink.shadow ?? null,
 fontWeight: currentLink.fontWeight ?? null,
 [key]: value
 };

 await updateLinkCustomStyle(
 linkId,
 nextStyles.bgColor,
 nextStyles.textColor,
 nextStyles.borderColor,
 nextStyles.borderStyle,
 nextStyles.borderWidth,
 nextStyles.borderRadius,
 nextStyles.shadow,
 nextStyles.fontWeight
 );
 setSuccessMsg(lang === "tr" ? "Bağlantı kutu tasarımı güncellendi!" : "Link box custom styles updated!");
 } catch (err: any) {
 setErrorMsg(lang === "tr" ? "Tasarım güncellenirken hata oluştu." : "Failed to update link styling.");
 }
 });
 };
   const applyPresetTheme = (
 linkId: string,
 preset: {
 bgColor: string | null;
 textColor: string | null;
 borderColor: string | null;
 borderStyle: string | null;
 borderWidth: string | null;
 borderRadius: string | null;
 shadow: string | null;
 fontWeight: string | null;
 }
 ) => {
 setLinks((prev) =>
 prev.map((l) => (l.id === linkId ? { ...l, ...preset } : l))
 );

 startTransition(async () => {
 try {
 await updateLinkCustomStyle(
 linkId,
 preset.bgColor,
 preset.textColor,
 preset.borderColor,
 preset.borderStyle,
 preset.borderWidth,
 preset.borderRadius,
 preset.shadow,
 preset.fontWeight
 );
 setSuccessMsg(lang === "tr" ? "Hazır stil teması uygulandı!" : "Preset theme style applied!");
 } catch (err) {
 setErrorMsg(lang === "tr" ? "Stil uygulanırken hata oluştu." : "Failed to apply styling.");
 }
 });
 };
   const handleSaveProfile = async () => {
 setErrorMsg("");
 setSuccessMsg("");

 // Typography gating validation on client side
 const currentFontObj = initialFonts.find(f => f.value === fontStyle) || { name: fontStyle, value: fontStyle, tier: "FREE" };
 const currentFontLocked = (
 currentFontObj.tier === "STARTER" && simulatedPlan === "FREE"
 ) || (
 currentFontObj.tier === "CREATOR" && initialUser.plan !== "CREATOR" && initialUser.plan !== "PRO_BUSINESS"
 );

 if (currentFontLocked) {
 setErrorMsg(
 lang === "tr"
 ? `🔒 "${currentFontObj.name}" yazı tipi planınızda kilitlidir. Değişiklikleri kaydetmek için lütfen planınızı yükseltin!`
 : `🔒 "${currentFontObj.name}" is locked on your current plan. Please upgrade to save changes!`
 );
 return;
 }

 startTransition(async () => {
 try {
 await updateProfile(initialUser.id, bio, theme, username, avatarUrl, background, fontStyle, bioColor, usernameColor, activeTemplateCss, buttonClass, avatarShape);
 await updateAllLinksCustomStyle(
 initialUser.id,
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
 setSuccessMsg(lang === "tr" ? "Profil ayarlarınız başarıyla kaydedildi!" : "Profile saved successfully!");
 } catch (err: any) {
 setErrorMsg(err.message || "Failed to save profile");
 }
 });
 };

  const handleToggleTemplate = async (templateId: string, currentActive: boolean) => {
    setErrorMsg("");
    setSuccessMsg("");
    startTransition(async () => {
      try {
        const nextActive = !currentActive;
        const res = await toggleUserTemplateActive(initialUser.id, templateId, nextActive);
        if (res && res.success) {
          setOwnedTemplates(prev =>
            prev.map(t => ({
              ...t,
              isActive: t.id === templateId ? nextActive : false
            }))
          );

          if (nextActive) {
            const matched = ownedTemplates.find(t => t.id === templateId);
            if (matched) {
              setActiveTemplate({
                id: matched.id,
                name: matched.name,
                bgColor: matched.bgColor,
                fontStyle: matched.fontStyle,
                buttonStyle: matched.buttonStyle,
                isCoded: matched.isCoded,
                customCss: matched.customCss,
                configJson: matched.configJson
              });

              setBackground(matched.bgColor || "");
              setFontStyle(matched.fontStyle || "Inter");
              setActiveTemplateCss(matched.customCss || null);

              if (matched.buttonStyle) {
                const parsedBtn = parseButtonStyle(matched.buttonStyle);
                setBtnBgColor(parsedBtn.bgColor || "");
                setBtnTextColor(parsedBtn.textColor || "");
                setBtnBorderColor(parsedBtn.borderColor || "");
                setBtnBorderStyle(parsedBtn.borderStyle || "solid");
                setBtnBorderWidth(parsedBtn.borderWidth || "1px");
                setBtnBorderRadius(parsedBtn.borderRadius || "12px");
                setBtnShadow(parsedBtn.shadow || "none");
                setBtnFontWeight(parsedBtn.fontWeight || "font-bold");
              }
            }
            setSuccessMsg(lang === "tr" ? "Şablon başarıyla aktifleştirildi!" : "Template successfully activated!");
          } else {
            setActiveTemplate(null);
            setBackground("");
            setFontStyle("Inter");
            setActiveTemplateCss(null);
            setBtnBgColor("");
            setBtnTextColor("");
            setBtnBorderColor("");
            setBtnBorderStyle("solid");
            setBtnBorderWidth("1px");
            setBtnBorderRadius("12px");
            setBtnShadow("none");
            setBtnFontWeight("font-bold");
            setSuccessMsg(lang === "tr" ? "Şablon devre dışı bırakıldı." : "Template deactivated.");
          }
        }
      } catch (err: any) {
        setErrorMsg(err.message || "Failed to toggle template");
      }
    });
  };

  const handleSaveAsTemplateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!templateSaveName.trim()) return;

    setErrorMsg("");
    setSuccessMsg("");
    setSaveTemplateError("");

    const buttonStyleJson = JSON.stringify({
      bgColor: btnBgColor || null,
      textColor: btnTextColor || null,
      borderColor: btnBorderColor || null,
      borderStyle: btnBorderStyle || null,
      borderWidth: btnBorderWidth || null,
      borderRadius: btnBorderRadius || null,
      shadow: btnShadow || null,
      fontWeight: btnFontWeight || null,
    });

    startTransition(async () => {
      try {
        const res = await saveUserCustomTemplate(
          initialUser.id,
          templateSaveName.trim(),
          background || "",
          fontStyle || "Inter",
          buttonStyleJson,
          activeTemplateCss
        );

        if (res && res.success && res.template) {
          const newTmpl: TemplateItem = {
            userTemplateId: res.template.userTemplateId,
            isActive: res.template.isActive,
            customUrl: res.template.customUrl,
            id: res.template.id,
            name: res.template.name,
            price: res.template.price,
            category: res.template.category,
            coverUrl: res.template.coverUrl,
            bgColor: res.template.bgColor,
            fontStyle: res.template.fontStyle,
            buttonStyle: res.template.buttonStyle,
            isCoded: res.template.isCoded,
            customCss: res.template.customCss,
            configJson: res.template.configJson,
          };

          setOwnedTemplates(prev => [...prev, newTmpl]);
          setTemplateSaveName("");
          setIsSaveTemplateModalOpen(false);
          setSuccessMsg(lang === "tr" ? "Tasarımınız şablon olarak başarıyla kaydedildi!" : "Your design has been saved as a template!");
        }
      } catch (err: any) {
        setSaveTemplateError(err.message || "Failed to save template");
      }
    });
  };

  const handleDeleteTemplate = async (templateId: string) => {
    if (!confirm(lang === "tr" ? "Bu şablonu silmek istediğinize emin misiniz?" : "Are you sure you want to delete this template?")) {
      return;
    }
    setErrorMsg("");
    setSuccessMsg("");
    startTransition(async () => {
      try {
        const res = await deleteUserCustomTemplate(initialUser.id, templateId);
        if (res && res.success) {
          setOwnedTemplates(prev => prev.filter(t => t.id !== templateId));
          // If the deleted template was the active template, reset activeTemplate state
          if (activeTemplate?.id === templateId) {
            setActiveTemplate(null);
            setBackground("");
            setFontStyle("Inter");
            setBtnBgColor("");
            setBtnTextColor("");
            setBtnBorderColor("");
            setBtnBorderStyle("solid");
            setBtnBorderWidth("1px");
            setBtnBorderRadius("12px");
            setBtnShadow("none");
            setBtnFontWeight("font-bold");
            setActiveTemplateCss(null);
          }
          setSuccessMsg(lang === "tr" ? "Şablon başarıyla silindi." : "Template deleted successfully.");
        }
      } catch (err: any) {
         setErrorMsg(err.message || "Failed to delete template");
      }
    });
  };

  const handleGenerateAiSuggestions = async () => {
 if (!aiPrompt) return;
 setErrorMsg("");
 setSuccessMsg("");

 startTransition(async () => {
 try {
 const { generateAiCreatorSuggestions } = await import("@/app/actions");
 const suggestions = await generateAiCreatorSuggestions(aiPrompt);
 setAiResult(suggestions);
 setSuccessMsg("AI suggestions generated successfully!");
 } catch (err: any) {
 setErrorMsg("Failed to generate suggestions");
 }
 });
 };
   const handleApplyAiSuggestions = () => {
 if (!aiResult) return;
 setBio(aiResult.bio);
 setTheme(aiResult.theme);
 setAiResult(null);
 setAiPrompt("");
 setSuccessMsg("Applied AI Bio and theme suggestions! Don't forget to save profile.");
 };

  const t = {
    saveChanges: lang === "tr" ? "Değişiklikleri Kaydet" : "Save Changes",
    usernameLabel: lang === "tr" ? "Kullanıcı Adı" : "Username",
    bioLabel: lang === "tr" ? "Kısa Biyografi" : "Short Bio",
    bioPlaceholder: lang === "tr" ? "Kendinizden kısaca bahsedin..." : "Share a sentence about yourself...",
    aiAssistant: lang === "tr" ? "AI Profil Asistanı (Biyo & Tema)" : "AI Profile Assistant (Bio & Themes)",
    aiPromptPlaceholder: lang === "tr" ? "Örn: Hiphop beatleri üretiyorum..." : "e.g. producing trap beats...",
    generateVibe: lang === "tr" ? "Profil Oluştur" : "Generate Vibe",
    aiResultBio: lang === "tr" ? "Önerilen AI Biyografisi:" : "Generated Bio Suggestion:",
    aiResultTheme: lang === "tr" ? "Önerilen Tema:" : "Recommended Theme:",
    aiApply: lang === "tr" ? "Biyo & Temayı Uygula" : "Apply Bio & Theme",
    premiumThemes: lang === "tr" ? "Premium Tema Pazarı" : "Premium Theme Marketplace",
    addLink: lang === "tr" ? "Yeni Link Ekle" : "Add New Digital Asset or Link",
    linkTitle: lang === "tr" ? "Link Başlığı" : "Link Title",
    linkTitlePlaceholder: lang === "tr" ? "Örn: En Yeni Spotify Beatim" : "e.g. My Latest Spotify Beat",
    linkUrl: lang === "tr" ? "Hedef URL" : "Action Destination URL",
    addLinkBtn: lang === "tr" ? "Bağlantıyı Listeye Ekle" : "Add Link to Grid",
    activeLinks: lang === "tr" ? "Aktif Bağlantı Adresleriniz" : "Your Active Action Outposts",
    noLinks: lang === "tr" ? "Henüz aktif bağlantı adresi eklenmemiş." : "No active links listed yet.",
    profileCustomizer: lang === "tr" ? "Profil Özelleştirici" : "Profile Customizer",
  };

  const isTemplateUnlocked = (tier: string) => {
    if (simulatedPlan === "CREATOR" || simulatedPlan === "PRO_BUSINESS" || user.role === "ADMIN") return true;
    if (simulatedPlan === "STARTER") return tier === "FREE" || tier === "STARTER";
    return tier === "FREE";
  };

  // Preview Data computation
  const activeTemplateButtonOverrides = (activeTemplate && activeTemplate.buttonStyle)
    ? parseButtonStyle(activeTemplate.buttonStyle)
    : {};

  const effectiveTheme = activeTemplate ? activeTemplate.name : theme;
  const effectiveBackground = activeTemplate ? activeTemplate.bgColor : background;
  const effectiveFontStyle = activeTemplate ? activeTemplate.fontStyle : fontStyle;
  const effectiveButtonClass = activeTemplate ? activeTemplate.buttonStyle : buttonClass;
  const effectiveCustomCss = activeTemplate ? (activeTemplate.isCoded ? activeTemplate.customCss : null) : activeTemplateCss;

  const isLight = [
    "Minimalist Light", "Pastel Dream", "Abstract Fluid", 
    "Vintage Paper", "Vintage Journal", "Holographic Glass", "Aura Hologram"
  ].includes(effectiveTheme);

  const mappedLinks = links.map(link => {
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
    username: username || "username",
    bio: bio || "Enter profile bio details...",
    avatarUrl: avatarUrl,
    theme: effectiveTheme,
    customCss: effectiveCustomCss,
    background: effectiveBackground,
    buttonClass: effectiveButtonClass,
    fontStyle: effectiveFontStyle,
    usernameColor: usernameColor || (isLight ? "#0f172a" : "#ffffff"),
    bioColor: bioColor || (isLight ? "#475569" : "rgba(255,255,255,0.7)"),
    links: mappedLinks,
    systemSettings: systemSettings,
    plan: simulatedPlan,
    avatarShape: avatarShape,
  };

  return (
    <div className="flex flex-col lg:flex-row gap-4 md:gap-8 w-full max-w-full items-start justify-start overflow-hidden">
      {/* LEFT COLUMN: ACTIVE WORKSPACE CONTENT */}
      <div className="flex-1 space-y-5 md:space-y-8 w-full max-w-full md:max-w-3xl min-w-0 overflow-hidden">
        {(() => {return (
 <div className="w-full max-w-full space-y-5 md:space-y-8 animate-in fade-in slide-in-from-bottom-3 duration-350 overflow-hidden">
 
 {/* SUB-TABS NAVIGATION WITH TEMPLATE PREVIEW LINK */}
 <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between w-full max-w-full">
   <div className="flex gap-1.5 sm:gap-2 p-1 sm:p-1.5 bg-zinc-100 rounded-2xl border border-zinc-200 overflow-hidden shrink-0">
     <button
       type="button"
       onClick={() => setActiveSubTab("appearance")}
       className={`flex-1 flex items-center justify-center gap-1.5 sm:gap-2 px-4 py-2.5 rounded-xl text-[11px] sm:text-xs font-black transition-all cursor-pointer ${
         activeSubTab === "appearance"
           ? "bg-white text-zinc-950 shadow-sm"
           : "text-zinc-650 hover:text-zinc-950"
       }`}
     >
       <Palette className="h-3.5 w-3.5 text-teal-500" />
       {lang === "tr" ? "Görünüm" : "Look"}
     </button>
     <button
       type="button"
       onClick={() => setActiveSubTab("profile")}
       className={`flex-1 flex items-center justify-center gap-1.5 sm:gap-2 px-4 py-2.5 rounded-xl text-[11px] sm:text-xs font-black transition-all cursor-pointer ${
         activeSubTab === "profile"
           ? "bg-white text-zinc-950 shadow-sm"
           : "text-zinc-650 hover:text-zinc-950"
       }`}
     >
       <User className="h-3.5 w-3.5 text-teal-500" />
       {lang === "tr" ? "Profil" : "Profile"}
     </button>
   </div>

   <a
     href={`/${username}?previewTemplate=${activeTemplate ? activeTemplate.id : effectiveTheme}`}
     target="_blank"
     rel="noreferrer"
     className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-2xl border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-700 text-xs font-bold shadow-sm transition-all cursor-pointer whitespace-nowrap active:scale-95 hover:border-zinc-300"
   >
     <ExternalLink className="h-3.5 w-3.5 text-teal-500 animate-pulse" />
     <span>{lang === "tr" ? "Şablon Önizleme Linki" : "Template Preview Link"}</span>
   </a>
 </div>

 {/* SUB-TAB CONTENT: APPEARANCE */}
  {activeSubTab === "appearance" && (
    <div className="w-full max-w-full animate-in fade-in duration-200 overflow-hidden">
      <div className="flex gap-0 rounded-2xl border border-zinc-200 bg-white shadow-sm overflow-hidden min-h-[520px]">
        {/* Vertical Sidebar */}
        <div className="w-[140px] md:w-[160px] shrink-0 border-r border-zinc-100 bg-gray-50/60 py-4 px-2 space-y-1">
          {([
            { id: "theme" as const, label: "Şablon", labelEn: "Theme", icon: <Palette className="h-4 w-4" /> },
            { id: "links" as const, label: "Linkler", labelEn: "Links", icon: <Link2 className="h-4 w-4" /> },
            { id: "wallpaper" as const, label: "Arka Plan", labelEn: "Wallpaper", icon: <Image className="h-4 w-4" /> },
            { id: "typography" as const, label: "Yazı Tipi", labelEn: "Text", icon: <Type className="h-4 w-4" /> },
            { id: "buttons" as const, label: "Butonlar", labelEn: "Buttons", icon: <MousePointerClick className="h-4 w-4" /> },
            { id: "colors" as const, label: "Renkler", labelEn: "Colors", icon: <Sparkles className="h-4 w-4" /> }
          ]).map((item) => (
            <button key={item.id} type="button" onClick={() => setActiveAppSection(item.id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer text-left ${
                activeAppSection === item.id
                  ? "bg-white text-slate-900 shadow-sm border border-zinc-200"
                  : "text-slate-500 hover:bg-white/70 hover:text-slate-800 border border-transparent"
              }`}>
              <span className={activeAppSection === item.id ? "text-teal-500" : "text-slate-400"}>{item.icon}</span>
              {lang === "tr" ? item.label : item.labelEn}
            </button>
          ))}
          <div className="border-t border-zinc-200 pt-3 mt-3 px-1 space-y-2">
            <button type="button" onClick={handleSaveProfile} disabled={isPending}
              className="w-full flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-[11px] hover:bg-slate-800 transition-all disabled:opacity-50 cursor-pointer shadow-sm">
              {isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : <Check className="h-3 w-3" />}
              {t.saveChanges}
            </button>
            <button type="button" onClick={() => {
              setTemplateSaveName("");
              setSaveTemplateError("");
              setIsSaveTemplateModalOpen(true);
            }} disabled={isPending}
              className="w-full flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-teal-600 text-white font-bold text-[11px] hover:bg-teal-500 transition-all disabled:opacity-50 cursor-pointer shadow-sm">
              <Sparkles className="h-3 w-3" />
              {lang === "tr" ? "Şablonu Kaydet" : "Save as Template"}
            </button>
          </div>
        </div>
 {/* Form Content */}
 <div className="flex-1 p-5 md:p-8 overflow-y-auto max-h-[75vh]">

          {activeAppSection === "theme" && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div>
                <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">
                  {lang === "tr" ? "Şablonlarım" : "My Templates"}
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-1">
                  {lang === "tr" 
                    ? "Kayıtlı şablonlarınızı yönetin ve profilinize anında uygulayın." 
                    : "Manage your saved templates and apply them instantly to your profile."}
                </p>
              </div>

              {ownedTemplates.filter(t => t.category === "Özel").length === 0 ? (
                <div className="p-8 text-center rounded-2xl border border-dashed border-zinc-200 bg-white shadow-sm text-sm text-slate-500">
                  {lang === "tr" 
                    ? "Henüz kaydedilmiş bir özel şablonunuz bulunmuyor. Görünüm panelinden tasarımınızı özelleştirip 'Şablonu Kaydet' butonuyla şablon oluşturabilirsiniz." 
                    : "You don't have any custom templates saved yet. Customize your look and use 'Save as Template' button to create one."}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {ownedTemplates.filter(t => t.category === "Özel").map((tmpl) => {
                    const isSelected = activeTemplate?.id === tmpl.id || (tmpl.isActive);
                    let btnPreviewBg = "#ffffff";
                    let btnPreviewText = "#000000";
                    let btnPreviewBorder = "#e4e4e7";
                    try {
                      if (tmpl.buttonStyle) {
                        const parsed = parseButtonStyle(tmpl.buttonStyle);
                        btnPreviewBg = parsed.bgColor || "#ffffff";
                        btnPreviewText = parsed.textColor || "#000000";
                        btnPreviewBorder = parsed.borderColor || "#e4e4e7";
                      }
                    } catch (e) {}

                    const renderBgPreviewClass = () => {
                      if (tmpl.bgColor) {
                        if (tmpl.bgColor.startsWith("custom-img::")) {
                          return { backgroundImage: `url(${tmpl.bgColor.replace("custom-img::", "")})`, backgroundSize: "cover", backgroundPosition: "center" };
                        } else if (tmpl.bgColor.startsWith("custom-video::")) {
                          return { backgroundColor: "#1e293b" };
                        } else if (tmpl.bgColor.startsWith("bg-")) {
                          return {};
                        } else {
                          return { backgroundColor: tmpl.bgColor };
                        }
                      }
                      return { backgroundColor: "#0f172a" };
                    };

                    const bgPreviewStyles = renderBgPreviewClass();
                    const isTailwindBg = tmpl.bgColor && tmpl.bgColor.startsWith("bg-");

                    return (
                      <div
                        key={tmpl.id}
                        className={`rounded-2xl border bg-white shadow-sm overflow-hidden flex flex-col transition-all duration-200 ${
                          isSelected ? "border-teal-500 ring-2 ring-teal-500/10" : "border-zinc-200 hover:border-zinc-300"
                        }`}
                      >
                        <div 
                          className={`h-24 relative flex items-center justify-center border-b border-zinc-100 ${
                            isTailwindBg ? tmpl.bgColor : ""
                          }`}
                          style={bgPreviewStyles}
                        >
                          <div className="space-y-1.5 text-center px-4 max-w-full">
                            <div className="w-6 h-6 rounded-full bg-zinc-200 border border-white mx-auto shadow-sm" />
                            <div className="w-12 h-2 rounded bg-white/40 mx-auto" />
                            <div className="w-16 h-1.5 rounded bg-white/20 mx-auto" />
                            
                            <div 
                              className="px-4 py-1.5 rounded-md text-[6px] font-black w-24 mx-auto truncate border"
                              style={{ 
                                backgroundColor: btnPreviewBg === "transparent" ? "rgba(255,255,255,0.15)" : btnPreviewBg, 
                                color: btnPreviewText, 
                                borderColor: btnPreviewBorder 
                              }}
                            >
                              Sample Link
                            </div>
                          </div>
                          
                          {isSelected && (
                            <span className="absolute top-2 right-2 px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider bg-teal-500 text-white shadow-sm flex items-center gap-0.5">
                              <Check className="h-2 w-2" />
                              {lang === "tr" ? "Aktif" : "Active"}
                            </span>
                          )}
                        </div>

                        <div className="p-4 flex-1 flex flex-col justify-between space-y-3 bg-white">
                          <div>
                            <h4 className="font-extrabold text-xs text-zinc-900 truncate">{tmpl.name}</h4>
                            <div className="flex items-center gap-1.5 mt-1 text-[10px] text-slate-500 font-semibold">
                              <span>Font: <span className="font-bold text-zinc-700">{tmpl.fontStyle}</span></span>
                              <span>•</span>
                              <span>{tmpl.isCoded ? "Custom CSS" : "Standart"}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 w-full">
                            <button
                              type="button"
                              onClick={() => handleToggleTemplate(tmpl.id, isSelected)}
                              disabled={isPending}
                              className={`flex-1 py-2 rounded-xl text-[11px] font-black transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5 border shadow-sm ${
                                isSelected
                                  ? "bg-red-50 border-red-200 text-red-600 hover:bg-red-100"
                                  : "bg-zinc-950 border-zinc-900 text-white hover:bg-zinc-800"
                              }`}
                            >
                              {isPending ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                              ) : isSelected ? (
                                <>
                                  <X className="h-3.5 w-3.5" />
                                  {lang === "tr" ? "Devre Dışı Bırak" : "Deactivate"}
                                </>
                              ) : (
                                <>
                                  <Check className="h-3.5 w-3.5" />
                                  {lang === "tr" ? "Aktifleştir" : "Activate"}
                                </>
                              )}
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDeleteTemplate(tmpl.id)}
                              disabled={isPending}
                              title={lang === "tr" ? "Şablonu Sil" : "Delete Template"}
                              className="p-2.5 rounded-xl border border-zinc-200 text-zinc-500 hover:text-red-600 hover:bg-red-50 hover:border-red-200 transition-all duration-200 flex items-center justify-center cursor-pointer shadow-sm hover:scale-105 active:scale-95"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

           {activeAppSection === "links" && (
 <div className="w-full max-w-full space-y-5 md:space-y-8 animate-in fade-in duration-200 overflow-hidden">
 {/* Add New Link */}
 {(() => {
 const LINK_TEMPLATES = [
 { id: "WEBSITE", name: lang === "tr" ? "İnternet sitesi" : "Website", desc: lang === "tr" ? "Herhangi bir web sitesi URL'sine bağlantı" : "Link to any website URL", icon: Globe, tier: "FREE" },
 { id: "PDF", name: "PDF", desc: lang === "tr" ? "PDF göster" : "Display a PDF", icon: FileText, tier: "CREATOR" },
 { id: "LINK_LIST", name: lang === "tr" ? "Bağlantıların Listesi" : "Link List", desc: lang === "tr" ? "Birden fazla bağlantı paylaşın" : "Share multiple links", icon: List, tier: "CREATOR" },
 { id: "VCARD", name: "vCard", desc: lang === "tr" ? "Elektronik kartvizitinizi paylaşın" : "Share contact vCard", icon: User, tier: "STARTER" },
 { id: "BUSINESS", name: lang === "tr" ? "İşletme" : "Business", desc: lang === "tr" ? "İşletmenizle ilgili bilgileri paylaşın" : "Share business info", icon: Briefcase, tier: "CREATOR" },
 { id: "VIDEO", name: "Video", desc: lang === "tr" ? "Bir video göster" : "Display a video", icon: Play, tier: "STARTER" },
 { id: "IMAGES", name: lang === "tr" ? "Görseller" : "Images", desc: lang === "tr" ? "Birden fazla görsel paylaşın" : "Share multiple images", icon: Image, tier: "STARTER" },
 { id: "FACEBOOK", name: "Facebook", desc: lang === "tr" ? "Facebook sayfanızı paylaşın" : "Share Facebook page", icon: Globe, tier: "FREE" },
 { id: "INSTAGRAM", name: "Instagram", desc: lang === "tr" ? "Instagram'ınızı paylaşın" : "Share Instagram page", icon: Globe, tier: "FREE" },
 { id: "SOCIAL_MEDIA", name: lang === "tr" ? "Sosyal medya" : "Social Media", desc: lang === "tr" ? "Sosyal kanallarınızı paylaşın" : "Share social channels", icon: MessageCircle, tier: "STARTER" },
 { id: "WHATSAPP", name: "WhatsApp", desc: lang === "tr" ? "WhatsApp mesajlarını alın" : "Receive WhatsApp messages", icon: MessageCircle, tier: "FREE" },
 { id: "MP3", name: "MP3", desc: lang === "tr" ? "Bir ses dosyası paylaş" : "Share an audio file", icon: Music, tier: "CREATOR" },
 { id: "MENU", name: lang === "tr" ? "Menü" : "Menu", desc: lang === "tr" ? "Bir restoran menüsü oluşturun" : "Create restaurant menu", icon: Utensils, tier: "CREATOR" },
 { id: "APPS", name: lang === "tr" ? "Uygulamalar" : "Apps", desc: lang === "tr" ? "Bir uygulama mağazasına yönlendir" : "Redirect to app store", icon: Smartphone, tier: "CREATOR" },
 { id: "COUPON", name: lang === "tr" ? "Kupon" : "Coupon", desc: lang === "tr" ? "Kupon paylaş" : "Share promotional coupons", icon: Percent, tier: "STARTER" },
 { id: "WIFI", name: "Wifi", desc: lang === "tr" ? "Bir Wi-Fi ağına bağlanın" : "Connect to a Wi-Fi network", icon: Wifi, tier: "FREE" },
 ];

 const userPlan = initialUser.plan || "FREE";
 const isLinkTemplateUnlocked = (templateTier: string) => {
 if (userPlan === "CREATOR" || userPlan === "PRO_BUSINESS" || initialUser.role === "ADMIN") {
 return true;
 }
 if (userPlan === "STARTER") {
 return templateTier === "FREE" || templateTier === "STARTER";
 }
 return templateTier === "FREE";
 };

 return (
 <div className={`p-3 md:p-6 rounded-2xl border space-y-5 md:space-y-6 w-full max-w-full overflow-hidden ${
 "bg-white border-zinc-200 shadow-sm"
 }`}>
 <div className="flex flex-wrap items-center justify-between">
 <div className="flex items-center gap-3">
 <Plus className="h-5 w-5 text-emerald-400" />
 <h2 className={`font-extrabold text-lg ${"text-zinc-950"}`}>{t.addLink}</h2>
 </div>
 {linkSelectedTemplate && (
 <button
 type="button"
 onClick={() => {
 setLinkSelectedTemplate(null);
 setNewTitle("");
 setNewUrl("");
 }}
 className="px-3 py-2 rounded bg-gray-50 hover:bg-zinc-700 text-zinc-300 font-extrabold text-[10px] transition-all cursor-pointer"
 >
 {lang === "tr" ? "Şablon Seçimine Dön" : "Change Template"}
 </button>
 )}
 </div>

 {!linkSelectedTemplate ? (
 <div className="space-y-4">
 <div className="border-b pb-2 border-gray-100">
 <p className="text-xs text-slate-500 font-semibold">
 {lang === "tr" 
 ? "Kreatör profilinize özel premium şablonlardan birini seçerek başlayın."
 : "Start by selecting one of the premium green templates for your creator profile."}
 </p>
 </div>

 <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4 w-full">
 {LINK_TEMPLATES.map((tmpl) => {
 const Icon = tmpl.icon;
 const unlocked = isLinkTemplateUnlocked(tmpl.tier);
 return (
 <button
 key={tmpl.id}
 type="button"
 onClick={() => {
 if (!unlocked) {
 triggerUpgradeModal(
 lang === "tr" ? "Şablon Kilitli 🔒" : "Template Locked 🔒",
 lang === "tr"
 ? `Bu premium şablon (${tmpl.name}) sadece ${tmpl.tier} ve üzeri paketlerde kullanılabilir. Sınırları kaldırmak için yükseltin!`
 : `This premium template (${tmpl.name}) requires the ${tmpl.tier} plan or higher. Upgrade now to unlock!`
 );
 return;
 }
 setLinkSelectedTemplate(tmpl.id);
 setNewTitle(tmpl.name);
 }}
 className={`p-3 sm:p-4 md:p-5 rounded-2xl border text-center flex flex-col items-center justify-center gap-2 sm:gap-3 transition-all relative group cursor-pointer overflow-hidden ${
 unlocked 
 ? "bg-white border-zinc-200 hover:border-emerald-350 hover:shadow-md"
 : "opacity-40 cursor-not-allowed"
 }`}
 >
 {!unlocked && (
 <div className="absolute top-2.5 right-2.5 p-1 rounded-md bg-gray-50 border border-gray-100 text-slate-500">
 <Lock className="h-3 w-3" />
 </div>
 )}

 <div className={`h-12 w-12 rounded-full flex items-center justify-center transition-transform group-hover:scale-105 ${
 unlocked 
 ? "bg-emerald-50 text-emerald-500" 
 : "bg-gray-50 text-slate-500"
 }`}>
 <Icon className="h-5 w-5" />
 </div>

 <div className="space-y-0.5">
 <h4 className={`font-black text-xs ${"text-zinc-900"}`}>
 {tmpl.name}
 </h4>
 <p className="text-[9px] text-slate-500 font-medium line-clamp-2 leading-tight">
 {tmpl.desc}
 </p>
 </div>
 </button>
 );
 })}
 </div>
 </div>
 ) : (
 <form onSubmit={handleAddLink} className="space-y-4">
 <div className="flex items-center gap-3 p-3.5 rounded-xl bg-emerald-50/50 border border-emerald-100/50 text-emerald-800">
 <div className="h-9 w-9 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
 {(() => {
 const matched = LINK_TEMPLATES.find((t) => t.id === linkSelectedTemplate);
 const IconComp = matched?.icon || Globe;
 return <IconComp className="h-5 w-5" />;
 })()}
 </div>
 <div>
 <div className="text-xs font-black uppercase tracking-wider">{lang === "tr" ? "Seçilen Şablon" : "Selected Template"}</div>
 <div className="text-sm font-extrabold">{LINK_TEMPLATES.find(t => t.id === linkSelectedTemplate)?.name}</div>
 </div>
 </div>

 <div className="grid grid-cols-1 gap-4">
 <div>
 <label className="text-[10px] text-slate-500 uppercase tracking-wider font-extrabold block mb-1">
 {lang === "tr" ? "Bağlantı Başlığı" : "Link Title"}
 </label>
 <input
 type="text"
 value={newTitle}
 onChange={(e) => setNewTitle(e.target.value)}
 className={`w-full px-4 py-3 rounded-xl border focus:border-emerald-500/50 outline-none text-sm ${
 "bg-zinc-100 border-zinc-200 text-zinc-900"
 }`}
 placeholder={t.linkTitlePlaceholder}
 />
 </div>

 {linkSelectedTemplate === "WIFI" && (
 <div className="grid md:grid-cols-3 gap-4">
 <div>
 <label className="text-[10px] text-slate-500 uppercase tracking-wider font-extrabold block mb-1">Wi-Fi SSID</label>
 <input
 type="text"
 value={wifiSsid}
 onChange={(e) => setWifiSsid(e.target.value)}
 className={`w-full px-4 py-3 rounded-xl border focus:border-emerald-500/50 outline-none text-sm ${
 "bg-zinc-100 border-zinc-200 text-zinc-900"
 }`}
 placeholder="SSID (Ağ Adı)"
 />
 </div>
 <div>
 <label className="text-[10px] text-slate-500 uppercase tracking-wider font-extrabold block mb-1">{lang === "tr" ? "Wi-Fi Şifresi" : "Wi-Fi Password"}</label>
 <input
 type="password"
 value={wifiPassword}
 onChange={(e) => setWifiPassword(e.target.value)}
 className={`w-full px-4 py-3 rounded-xl border focus:border-emerald-500/50 outline-none text-sm ${
 "bg-zinc-100 border-zinc-200 text-zinc-900"
 }`}
 placeholder="Password"
 />
 </div>
 <div>
 <label className="text-[10px] text-slate-500 uppercase tracking-wider font-extrabold block mb-1">{lang === "tr" ? "Şifreleme" : "Encryption"}</label>
 <select
 value={wifiEncryption}
 onChange={(e: any) => setWifiEncryption(e.target.value)}
 className={`w-full px-4 py-3 rounded-xl border focus:border-emerald-500/50 outline-none text-sm ${
 "bg-zinc-100 border-zinc-200 text-zinc-900"
 }`}
 >
 <option value="WPA">WPA/WPA2</option>
 <option value="WEP">WEP</option>
 <option value="nopass">{lang === "tr" ? "Şifresiz" : "Unsecured"}</option>
 </select>
 </div>
 </div>
 )}

 {linkSelectedTemplate === "WHATSAPP" && (
 <div className="grid md:grid-cols-2 gap-4">
 <div>
 <label className="text-[10px] text-slate-500 uppercase tracking-wider font-extrabold block mb-1">{lang === "tr" ? "Telefon Numarası" : "Phone Number"}</label>
 <input
 type="text"
 value={whatsAppPhone}
 onChange={(e) => setWhatsAppPhone(e.target.value)}
 className={`w-full px-4 py-3 rounded-xl border focus:border-emerald-500/50 outline-none text-sm ${
 "bg-zinc-100 border-zinc-200 text-zinc-900"
 }`}
 placeholder="905300000000"
 />
 </div>
 <div>
 <label className="text-[10px] text-slate-500 uppercase tracking-wider font-extrabold block mb-1">{lang === "tr" ? "Varsayılan Mesaj" : "Default Message"}</label>
 <input
 type="text"
 value={whatsAppMessage}
 onChange={(e) => setWhatsAppMessage(e.target.value)}
 className={`w-full px-4 py-3 rounded-xl border focus:border-emerald-500/50 outline-none text-sm ${
 "bg-zinc-100 border-zinc-200 text-zinc-900"
 }`}
 placeholder={lang === "tr" ? "Örn: Merhaba, bilgi almak istiyorum." : "e.g. Hi! I want more info."}
 />
 </div>
 </div>
 )}

 {linkSelectedTemplate === "VCARD" && (
 <div className="grid md:grid-cols-3 gap-4">
 <div>
 <label className="text-[10px] text-slate-500 uppercase tracking-wider font-extrabold block mb-1">{lang === "tr" ? "Ad Soyad" : "Full Name"}</label>
 <input
 type="text"
 value={vCardName}
 onChange={(e) => setVCardName(e.target.value)}
 className={`w-full px-4 py-3 rounded-xl border focus:border-emerald-500/50 outline-none text-sm ${
 "bg-zinc-100 border-zinc-200 text-zinc-900"
 }`}
 placeholder="John Doe"
 />
 </div>
 <div>
 <label className="text-[10px] text-slate-500 uppercase tracking-wider font-extrabold block mb-1">{lang === "tr" ? "Telefon" : "Phone"}</label>
 <input
 type="text"
 value={vCardPhone}
 onChange={(e) => setVCardPhone(e.target.value)}
 className={`w-full px-4 py-3 rounded-xl border focus:border-emerald-500/50 outline-none text-sm ${
 "bg-zinc-100 border-zinc-200 text-zinc-900"
 }`}
 placeholder="+90 530 000 00 00"
 />
 </div>
 <div>
 <label className="text-[10px] text-slate-500 uppercase tracking-wider font-extrabold block mb-1">E-posta</label>
 <input
 type="email"
 value={vCardEmail}
 onChange={(e) => setVCardEmail(e.target.value)}
 className={`w-full px-4 py-3 rounded-xl border focus:border-emerald-500/50 outline-none text-sm ${
 "bg-zinc-100 border-zinc-200 text-zinc-900"
 }`}
 placeholder="john@example.com"
 />
 </div>
 <div>
 <label className="text-[10px] text-slate-500 uppercase tracking-wider font-extrabold block mb-1">{lang === "tr" ? "Şirket / Organizasyon" : "Company / Org"}</label>
 <input
 type="text"
 value={vCardOrg}
 onChange={(e) => setVCardOrg(e.target.value)}
 className={`w-full px-4 py-3 rounded-xl border focus:border-emerald-500/50 outline-none text-sm ${
 "bg-zinc-100 border-zinc-200 text-zinc-900"
 }`}
 placeholder="Acme Inc."
 />
 </div>
 <div>
 <label className="text-[10px] text-slate-500 uppercase tracking-wider font-extrabold block mb-1">{lang === "tr" ? "Ünvan" : "Job Title"}</label>
 <input
 type="text"
 value={vCardTitle}
 onChange={(e) => setVCardTitle(e.target.value)}
 className={`w-full px-4 py-3 rounded-xl border focus:border-emerald-500/50 outline-none text-sm ${
 "bg-zinc-100 border-zinc-200 text-zinc-900"
 }`}
 placeholder="CEO"
 />
 </div>
 <div>
 <label className="text-[10px] text-slate-500 uppercase tracking-wider font-extrabold block mb-1">Web Sitesi</label>
 <input
 type="text"
 value={vCardUrl}
 onChange={(e) => setVCardUrl(e.target.value)}
 className={`w-full px-4 py-3 rounded-xl border focus:border-emerald-500/50 outline-none text-sm ${
 "bg-zinc-100 border-zinc-200 text-zinc-900"
 }`}
 placeholder="https://example.com"
 />
 </div>
 </div>
 )}

 {/* Dynamic Block Type Select Selector */}
 <div className="grid grid-cols-1 gap-4">
 <div>
 <label className="text-[10px] text-slate-500 uppercase tracking-wider font-extrabold block mb-1">
 {lang === "tr" ? "Gelişmiş İçerik Kartı Türü" : "Advanced Content Block Type"}
 </label>
 <select
 value={blockType}
 onChange={(e) => {
 setBlockType(e.target.value);
 setBlockFileError("");
 }}
 className={`w-full px-4 py-3 rounded-xl border focus:border-emerald-500/50 outline-none text-sm font-extrabold ${
 "bg-zinc-100 border-zinc-200 text-zinc-900"
 }`}
 >
 <option value="TEXT_LINK">🔗 {lang === "tr" ? "Standart Bağlantı (Text)" : "Standard Link"}</option>
 <option value="VIDEO_PLAYER">🎬 {lang === "tr" ? "Sinematik Video Blok" : "Cinematic Video"}</option>
 <option value="AUDIO_PLAYER">🎵 {lang === "tr" ? "Ses / Beat Oynatıcı" : "Audio / Beat Player"}</option>
 <option value="BEFORE_AFTER">↕️ {lang === "tr" ? "Önce/Sonra Görsel Karşılaştırma" : "Before/After Image Comparison"}</option>
 </select>
 </div>
 </div>

 {/* Conditional Fields for BEFORE_AFTER */}
 {blockType === "BEFORE_AFTER" && (
 <div className="grid md:grid-cols-2 gap-4 p-4 rounded-xl border border-dashed border-gray-100 bg-white">
 <div>
 <label className="text-[10px] text-teal-500 uppercase tracking-wider font-extrabold block mb-1">
 {lang === "tr" ? "Önceki Görsel (Before - Sol)" : "Before Image (Left)"}
 </label>
 {beforeImage ? (
 <div className="relative aspect-video rounded-lg overflow-hidden border border-gray-100 bg-gray-50 mb-2">
 <img src={beforeImage} className="w-full h-full object-cover" />
 <button
 type="button"
 onClick={() => setBeforeImage("")}
 className="absolute top-1 right-1 p-1 bg-red-600 rounded-full text-slate-900 text-[10px] font-bold"
 >
 Sil
 </button>
 </div>
 ) : (
 <input
 type="file"
 accept="image/*"
 onChange={(e) => {
 const file = e.target.files?.[0];
 if (file) {
 if (file.size > 1024 * 1024) { // 1MB limit for starter plans
 setBlockFileError(lang === "tr" ? "Görsel boyutu 1MB'ı aşamaz!" : "Image size must not exceed 1MB!");
 return;
 }
 const reader = new FileReader();
 reader.onloadend = () => setBeforeImage(reader.result as string);
 reader.readAsDataURL(file);
 }
 }}
 className={`w-full text-xs px-2 py-3 rounded-lg border ${
 "bg-zinc-100 border-zinc-200 text-zinc-600"
 }`}
 />
 )}
 </div>

 <div>
 <label className="text-[10px] text-teal-500 uppercase tracking-wider font-extrabold block mb-1">
 {lang === "tr" ? "Sonraki Görsel (After - Sağ)" : "After Image (Right)"}
 </label>
 {afterImage ? (
 <div className="relative aspect-video rounded-lg overflow-hidden border border-gray-100 bg-gray-50 mb-2">
 <img src={afterImage} className="w-full h-full object-cover" />
 <button
 type="button"
 onClick={() => setAfterImage("")}
 className="absolute top-1 right-1 p-1 bg-red-600 rounded-full text-slate-900 text-[10px] font-bold"
 >
 Sil
 </button>
 </div>
 ) : (
 <input
 type="file"
 accept="image/*"
 onChange={(e) => {
 const file = e.target.files?.[0];
 if (file) {
 if (file.size > 1024 * 1024) {
 setBlockFileError(lang === "tr" ? "Görsel boyutu 1MB'ı aşamaz!" : "Image size must not exceed 1MB!");
 return;
 }
 const reader = new FileReader();
 reader.onloadend = () => setAfterImage(reader.result as string);
 reader.readAsDataURL(file);
 }
 }}
 className={`w-full text-xs px-2 py-3 rounded-lg border ${
 "bg-zinc-100 border-zinc-200 text-zinc-600"
 }`}
 />
 )}
 </div>

 {blockFileError && (
 <p className="md:col-span-2 text-[10px] font-bold text-red-500 mt-1">{blockFileError}</p>
 )}
 </div>
 )}

 {linkSelectedTemplate !== "WIFI" && linkSelectedTemplate !== "WHATSAPP" && linkSelectedTemplate !== "VCARD" && (
 <div>
 <label className="text-[10px] text-slate-500 uppercase tracking-wider font-extrabold block mb-1">
 {blockType === "VIDEO_PLAYER" 
 ? (lang === "tr" ? "Video Paylaşım Bağlantısı (Youtube / Vimeo / Direct URL)" : "Video Showcase Link (Youtube / Vimeo / Direct URL)")
 : blockType === "AUDIO_PLAYER"
 ? (lang === "tr" ? "Müzik / Beat Ses Linki (MP3/WAV/DataURL)" : "Audio / Beat Sound Link (MP3/WAV/DataURL)")
 : (lang === "tr" ? "Hedef URL Adresi" : "Target URL Link")
 }
 </label>
 <input
 type="text"
 value={newUrl}
 onChange={(e) => setNewUrl(e.target.value)}
 className={`w-full px-4 py-3 rounded-xl border focus:border-emerald-500/50 outline-none text-sm ${
 "bg-zinc-100 border-zinc-200 text-zinc-900"
 }`}
 placeholder={
 blockType === "VIDEO_PLAYER" ? "https://youtube.com/watch?v=..."
 : blockType === "AUDIO_PLAYER" ? "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
 : "https://example.com"
 }
 />
 </div>
 )}
 </div>

 <div className="pt-2 pb-3">
 <label className="text-[10px] text-slate-500 uppercase tracking-wider font-extrabold block mb-2">
 {lang === "tr" ? "İkon Seçimi" : "Icon Selection"}
 </label>
 <div className="flex flex-wrap gap-2">
 {[
 { id: "WEBSITE", label: "Web", icon: Globe },
 { id: "INSTAGRAM", label: "Instagram", icon: InstagramIcon },
 { id: "WHATSAPP", label: "WhatsApp", icon: MessageCircle },
 { id: "TIKTOK", label: "TikTok", icon: TiktokIcon },
 { id: "PINTEREST", label: "Pinterest", icon: PinterestIcon },
 { id: "YOUTUBE", label: "YouTube", icon: YoutubeIcon },
 { id: "X", label: "X", icon: TwitterIcon },
 { id: "REDDIT", label: "Reddit", icon: MessageCircle },
 { id: "LINKEDIN", label: "LinkedIn", icon: LinkedinIcon },
 ].map(iconOption => (
 <button
 key={iconOption.id}
 type="button"
 onClick={() => setNewLinkIcon(iconOption.id)}
 className={`px-3 py-2.5 md:py-2 rounded-xl flex items-center gap-1.5 text-xs font-bold transition-all ${
 newLinkIcon === iconOption.id 
 ? "bg-emerald-500 text-white shadow-md" 
 : "bg-slate-100 text-slate-600 hover:bg-slate-200"
 }`}
 >
 <iconOption.icon className="h-4 w-4" />
 {iconOption.label}
 </button>
 ))}
 </div>
 </div>

 <button
 type="submit"
 disabled={isPending || !newTitle || (blockType === "BEFORE_AFTER" ? (!beforeImage || !afterImage) : (!newUrl && !computedLinkValue))}
 className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-900 font-black text-sm transition-all disabled:opacity-50 cursor-pointer shadow-[0_0_20px_rgba(16,185,129,0.15)]"
 >
 {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
 {t.addLinkBtn}
 </button>
 </form>
 )}
 </div>
 );
 })()}

 {/* Active Links Manager */}
 <div className="space-y-4">
 <h2 className="font-extrabold uppercase tracking-wider text-xs px-2 text-slate-500">{t.activeLinks} ({links.length})</h2>

 <div className="space-y-3">
 {links.length === 0 ? (
 <div className={`p-4 md:p-8 text-center rounded-2xl border border-dashed text-sm text-slate-500 ${
 "bg-white border-zinc-200 shadow-sm"
 }`}>
 {t.noLinks}
 </div>
 ) : (
 links.map((link) => (
 <div
 key={link.id}
 className={`p-4 rounded-xl border flex flex-col gap-3 transition-all ${
 link.isActive 
 ? "bg-white border-zinc-200 shadow-sm text-zinc-800"
 : "bg-zinc-50 border-zinc-100 opacity-60 text-slate-500"
 }`}
 >
 <div className="flex flex-wrap items-center justify-between gap-4">
 <div
 onClick={() => setExpandedLinkCard(expandedLinkCard === link.id ? null : link.id)}
 className="flex items-center gap-3 cursor-pointer flex-1 min-w-0 select-none"
 >
 <GripVertical className="h-4 w-4 text-zinc-400 shrink-0 cursor-grab active:cursor-grabbing" />
 <div className="h-8 w-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100/50 shadow-sm">
 {getLinkIconHelper(link.type, link.url)}
 </div>

 <div className="space-y-1 overflow-hidden flex-1">
 <div className="flex items-center gap-2">
 <span className={`font-bold text-sm truncate ${"text-zinc-900"}`}>{link.title}</span>
 {!link.isActive && <span className="px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider bg-gray-50 text-slate-500">Draft</span>}
 </div>
 <span className="text-slate-500 text-xs truncate block">{link.url}</span>
 </div>
 </div>

 <div className="flex items-center gap-3">
 <button
 onClick={() => handleToggleActive(link.id, link.isActive)}
 className={`w-10 h-6 rounded-full p-1 cursor-pointer transition-all flex items-center ${
 link.isActive ? "bg-teal-500 justify-end" : "bg-zinc-850 justify-start"
 }`}
 >
 <div className="h-4 w-4 rounded-full bg-white shadow-sm" />
 </button>

 <button
 onClick={() => handleDelete(link.id)}
 className="p-2 rounded-lg bg-gray-50 hover:bg-red-950/20 text-slate-500 hover:text-red-400 border border-gray-100 hover:border-red-500/20 transition-all cursor-pointer"
 >
 <Trash2 className="h-4 w-4" />
 </button>

 <button
 type="button"
 onClick={() => setExpandedLinkCard(expandedLinkCard === link.id ? null : link.id)}
 className="p-2 rounded-lg bg-gray-50 hover:bg-zinc-200 text-zinc-500 border border-gray-100 transition-all cursor-pointer"
 >
 {expandedLinkCard === link.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
 </button>
 </div>
 </div>

 {expandedLinkCard === link.id && (
 <>
 <div className={`pt-3 border-t flex flex-col gap-1.5 ${"border-zinc-100"}`}>
 <span className={`text-[10px] uppercase font-bold tracking-wider ${"text-slate-500"}`}>
 {lang === "tr" ? "Link Animasyon Efekti:" : "Link Animation Effect:"}
 </span>
 <div className="flex flex-wrap gap-1.5">
 {animations.map((anim: any) => {
 const isUnlocked = isTemplateUnlocked(anim.tier);
 const isSelected = (link.animation || "anim-none") === anim.id;
 return (
 <button
 key={anim.id}
 onClick={() => {
 if (!isUnlocked) {
 setErrorMsg(lang === "tr" 
 ? `Bu animasyon ${anim.tier} paketine özeldir. Lütfen paketinizi yükseltin!` 
 : `This animation requires the ${anim.tier} plan. Please upgrade to unlock!`
 );
 return;
 }
 handleUpdateAnimation(link.id, anim.id);
 }}
 className={`px-2 py-2 rounded-md text-[10px] font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${
 isSelected
 ? "bg-teal-500 border-light-blue text-white shadow-sm"
 : "bg-zinc-50 hover:bg-zinc-100 text-zinc-650 border-zinc-200"
 }`}
 >
 {!isUnlocked && <Lock className="h-2.5 w-2.5 text-slate-500" />}
 <span>{anim.label}</span>
 {anim.tier === "FREE" && anim.giftLabel && (
 <span className="text-[7.5px] font-black tracking-wider uppercase bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-900 px-1.5 py-0.2 rounded-full shadow-sm animate-pulse">
 {anim.giftLabel}
 </span>
 )}
 </button>
 );
 })}
 </div>
 </div>

 {/* Box Style Customizations */}
 <div className={`pt-4 border-t flex flex-col gap-3.5 ${"border-zinc-100"}`}>
 <div className="flex flex-wrap items-center justify-between">
 <div className="flex items-center gap-1.5">
 <Palette className="h-3.5 w-3.5 text-teal-500" />
 <span className={`text-[10px] uppercase font-black tracking-wider ${"text-zinc-655"}`}>
 {lang === "tr" ? "KUTU TASARIM ÖZELLEŞTİRME" : "BOX STYLING CUSTOMIZATION"}
 </span>
 {simulatedPlan === "FREE" && initialUser.role !== "ADMIN" && (
 <span className="px-1.5 py-0.5 rounded text-[8px] font-black bg-purple-100 text-teal-500 uppercase flex items-center gap-0.5 animate-pulse">
 <Lock className="h-2 w-2" />
 PRO
 </span>
 )}
 </div>
 <span className="text-[9px] text-slate-500">
 {lang === "tr" ? "(Starter ve Creator Paketleri İçin)" : "(For Starter & Creator Plans)"}
 </span>
 </div>

 {/* 1-Click Preset Themes */}
 <div className="flex flex-col gap-1.5 p-3 rounded-xl bg-white border border-gray-100">
 <span className="text-[9px] font-extrabold text-slate-500 uppercase tracking-wider block">
 {lang === "tr" ? "⚡ Tek Tıkla Hazır Temalar" : "⚡ 1-Click Preset Themes"}
 </span>
 <div className="flex flex-wrap gap-2 mt-1">
 {[
 {
 name: lang === "tr" ? "Neon Mor" : "Neon Purple",
 bgColor: "#1e1b4b",
 textColor: "#ffffff",
 borderColor: "#a855f7",
 borderStyle: "solid",
 borderWidth: "2px",
 borderRadius: "12px",
 shadow: "glow-purple",
 fontWeight: "font-bold",
 },
 {
 name: lang === "tr" ? "Siber Yeşil" : "Cyber Emerald",
 bgColor: "#000000",
 textColor: "#10b981",
 borderColor: "#10b981",
 borderStyle: "solid",
 borderWidth: "2px",
 borderRadius: "9999px",
 shadow: "glow-emerald",
 fontWeight: "font-bold",
 },
 {
 name: lang === "tr" ? "Retro Brutal" : "Retro Brutal",
 bgColor: "#facc15",
 textColor: "#000000",
 borderColor: "#000000",
 borderStyle: "solid",
 borderWidth: "3px",
 borderRadius: "8px",
 shadow: "hard-3d",
 fontWeight: "font-bold",
 },
 {
 name: lang === "tr" ? "Klasik Cam" : "Classic Glass",
 bgColor: "transparent",
 textColor: "#ffffff",
 borderColor: "rgba(255,255,255,0.4)",
 borderStyle: "solid",
 borderWidth: "1px",
 borderRadius: "16px",
 shadow: "soft",
 fontWeight: "font-medium",
 },
 {
 name: lang === "tr" ? "Lavanta Rüyası" : "Lavender Dream",
 bgColor: "#f3e8ff",
 textColor: "#6b21a8",
 borderColor: "#d8b4fe",
 borderStyle: "solid",
 borderWidth: "1px",
 borderRadius: "12px",
 shadow: "soft",
 fontWeight: "font-bold",
 }
 ].map((presetTheme) => (
 <button
 key={presetTheme.name}
 type="button"
 disabled={simulatedPlan === "FREE" && initialUser.role !== "ADMIN"}
 onClick={() => applyPresetTheme(link.id, presetTheme)}
 className="px-2.5 py-2.5 rounded-lg text-[9px] font-black border border-gray-100 hover:border-teal-500/50 bg-gray-50 text-zinc-300 hover:text-slate-900 transition-all cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
 >
 <span className="w-2 h-2 rounded-full border border-zinc-700 shrink-0" style={{ backgroundColor: presetTheme.bgColor === "transparent" ? "#fff" : presetTheme.bgColor }} />
 {presetTheme.name}
 </button>
 ))}
 </div>
 </div>

 {/* Hazır Renk Paleti Kombinasyonları */}
 <div className="flex flex-col gap-2">
 <div className="flex items-center gap-1.5">
 <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">
 🎨 {lang === "tr" ? "Hazır Renk Paleti Şablonları" : "Preset Color Palettes"}
 </span>
 </div>
 <div className="flex flex-wrap gap-2">
 {[
 {
 name: lang === "tr" ? "Okyanus Rüzgarı" : "Ocean Breeze",
 bgColor: "#0ea5e9",
 textColor: "#ffffff",
 borderColor: "#38bdf8",
 },
 {
 name: lang === "tr" ? "Siber Neon" : "Cyber Neon",
 bgColor: "#09090b",
 textColor: "#34d399",
 borderColor: "#10b981",
 },
 {
 name: lang === "tr" ? "Kiraz Çiçeği" : "Cherry Blossom",
 bgColor: "#fdf2f8",
 textColor: "#be185d",
 borderColor: "#fbcfe8",
 },
 {
 name: lang === "tr" ? "Gece Moru" : "Midnight Purple",
 bgColor: "#3b0764",
 textColor: "#fae8ff",
 borderColor: "#701a75",
 },
 {
 name: lang === "tr" ? "Retro Brutal" : "Retro Brutal",
 bgColor: "#facc15",
 textColor: "#000000",
 borderColor: "#000000",
 }
 ].map((pTheme) => (
 <button
 key={pTheme.name}
 type="button"
 disabled={simulatedPlan === "FREE" && initialUser.role !== "ADMIN"}
 onClick={() => applyPresetTheme(link.id, {
 bgColor: pTheme.bgColor,
 textColor: pTheme.textColor,
 borderColor: pTheme.borderColor,
 borderStyle: link.borderStyle || "solid",
 borderWidth: link.borderWidth || "1px",
 borderRadius: link.borderRadius || "12px",
 shadow: link.shadow || "none",
 fontWeight: link.fontWeight || "font-bold",
 })}
 className="flex items-center gap-2 px-3 py-2.5 md:py-2 rounded-2xl border border-gray-100 bg-gray-50 hover:bg-gray-50 hover:border-zinc-700 hover:shadow-lg hover:shadow-zinc-950/20 transition-all duration-200 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed group"
 >
 {/* Color circles */}
 <div className="flex items-center gap-1 shrink-0">
 <span
 className="w-4 h-4 rounded-full border border-zinc-700 shadow-sm"
 style={{ backgroundColor: pTheme.bgColor }}
 />
 <span
 className="w-4 h-4 rounded-full border border-zinc-700 flex items-center justify-center bg-zinc-850"
 >
 <span className="text-[7px] font-black" style={{ color: pTheme.textColor }}>A</span>
 </span>
 <span
 className="w-4 h-4 rounded-full"
 style={{ border: `2.5px solid ${pTheme.borderColor}` }}
 />
 </div>
 <span className="text-[9px] font-black text-zinc-300 group-hover:text-slate-900 uppercase tracking-wide whitespace-nowrap">
 {pTheme.name}
 </span>
 </button>
 ))}
 </div>
 </div>

 <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
 {/* Color Selection Blocks */}
 
 {/* Background Color Customization */}
 <div className="flex flex-col gap-1.5 p-3 rounded-xl bg-gray-50 border border-gray-100">
 <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
 {lang === "tr" ? "Arka Plan Rengi" : "Bg Color"}
 </label>
 <div className="flex items-center gap-2">
 <div className="relative h-8 w-8 rounded-full border border-zinc-700 overflow-hidden cursor-pointer flex items-center justify-center bg-zinc-850 shadow-sm hover:scale-105 transition-transform" style={{ backgroundColor: link.bgColor || "#ffffff" }}>
 <input
 type="color"
 value={link.bgColor && link.bgColor !== "transparent" ? link.bgColor : "#ffffff"}
 disabled={simulatedPlan === "FREE" && initialUser.role !== "ADMIN"}
 onChange={(e) => handleUpdateLinkStyle(link.id, "bgColor", e.target.value)}
 className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
 />
 {link.bgColor === "transparent" && <div className="absolute inset-0 bg-[linear-gradient(45deg,#ccc_25%,transparent_25%),linear-gradient(-45deg,#ccc_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#ccc_75%),linear-gradient(-45deg,transparent_75%,#ccc_75%)] bg-[size:8px_8px] bg-[position:0_0,0_4px,4px_-4px,-4px_0]" />}
 </div>
 <div className="flex flex-col">
 <span className="text-[10px] font-mono font-bold text-slate-500 uppercase">{link.bgColor || (lang === "tr" ? "Varsayılan" : "Default")}</span>
 <button
 type="button"
 disabled={simulatedPlan === "FREE" && initialUser.role !== "ADMIN"}
 onClick={() => handleUpdateLinkStyle(link.id, "bgColor", null)}
 className="text-[9px] font-bold text-teal-500 hover:text-purple-300 underline text-left disabled:opacity-50 cursor-pointer"
 >
 {lang === "tr" ? "Sıfırla" : "Reset"}
 </button>
 </div>
 </div>
 {/* Color Quick Presets for Bg */}
 <div className="flex flex-wrap gap-1.5 pt-1.5 border-t border-gray-100 mt-1">
 {["transparent", "#000000", "#1e293b", "#3b82f6", "#ef4444", "#10b981", "#facc15", "#a855f7"].map((col) => {
 const isSelected = link.bgColor === col;
 return (
 <button
 key={col}
 type="button"
 disabled={simulatedPlan === "FREE" && initialUser.role !== "ADMIN"}
 onClick={() => handleUpdateLinkStyle(link.id, "bgColor", col)}
 className={`h-5 w-5 rounded-full border hover:scale-110 transition-transform cursor-pointer relative overflow-hidden ${isSelected ? "ring-2 ring-purple-500 ring-offset-1 border-white" : "border-gray-100"}`}
 style={col !== "transparent" ? { backgroundColor: col } : undefined}
 title={col}
 >
 {col === "transparent" && <div className="absolute inset-0 bg-[linear-gradient(45deg,#ccc_25%,transparent_25%),linear-gradient(-45deg,#ccc_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#ccc_75%),linear-gradient(-45deg,transparent_75%,#ccc_75%)] bg-[size:4px_4px]" />}
 </button>
 );
 })}
 </div>
 </div>

 {/* Text Color Customization */}
 <div className="flex flex-col gap-1.5 p-3 rounded-xl bg-gray-50 border border-gray-100">
 <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
 {lang === "tr" ? "Metin Rengi" : "Text Color"}
 </label>
 <div className="flex items-center gap-2">
 <div className="relative h-8 w-8 rounded-full border border-zinc-700 overflow-hidden cursor-pointer flex items-center justify-center bg-zinc-850 shadow-sm hover:scale-105 transition-transform" style={{ backgroundColor: link.textColor || "#000000" }}>
 <input
 type="color"
 value={link.textColor || "#000000"}
 disabled={simulatedPlan === "FREE" && initialUser.role !== "ADMIN"}
 onChange={(e) => handleUpdateLinkStyle(link.id, "textColor", e.target.value)}
 className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
 />
 </div>
 <div className="flex flex-col">
 <span className="text-[10px] font-mono font-bold text-slate-500 uppercase">{link.textColor || (lang === "tr" ? "Varsayılan" : "Default")}</span>
 <button
 type="button"
 disabled={simulatedPlan === "FREE" && initialUser.role !== "ADMIN"}
 onClick={() => handleUpdateLinkStyle(link.id, "textColor", null)}
 className="text-[9px] font-bold text-teal-500 hover:text-purple-300 underline text-left disabled:opacity-50 cursor-pointer"
 >
 {lang === "tr" ? "Sıfırla" : "Reset"}
 </button>
 </div>
 </div>
 {/* Color Quick Presets for Text */}
 <div className="flex flex-wrap gap-1.5 pt-1.5 border-t border-gray-100 mt-1">
 {["#ffffff", "#000000", "#6b7280", "#3b82f6", "#ef4444", "#10b981", "#facc15", "#a855f7"].map((col) => {
 const isSelected = link.textColor === col;
 return (
 <button
 key={col}
 type="button"
 disabled={simulatedPlan === "FREE" && initialUser.role !== "ADMIN"}
 onClick={() => handleUpdateLinkStyle(link.id, "textColor", col)}
 className={`h-5 w-5 rounded-full border hover:scale-110 transition-transform cursor-pointer ${isSelected ? "ring-2 ring-purple-500 ring-offset-1 border-white" : "border-gray-100"}`}
 style={{ backgroundColor: col }}
 title={col}
 />
 );
 })}
 </div>
 </div>

 {/* Border Color Customization */}
 <div className="flex flex-col gap-1.5 p-3 rounded-xl bg-gray-50 border border-gray-100">
 <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
 {lang === "tr" ? "Kenarlık Rengi" : "Border Color"}
 </label>
 <div className="flex items-center gap-2">
 <div className="relative h-8 w-8 rounded-full border border-zinc-700 overflow-hidden cursor-pointer flex items-center justify-center bg-zinc-850 shadow-sm hover:scale-105 transition-transform" style={{ backgroundColor: link.borderColor || "#e4e4e7" }}>
 <input
 type="color"
 value={link.borderColor || "#e4e4e7"}
 disabled={simulatedPlan === "FREE" && initialUser.role !== "ADMIN"}
 onChange={(e) => handleUpdateLinkStyle(link.id, "borderColor", e.target.value)}
 className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
 />
 </div>
 <div className="flex flex-col">
 <span className="text-[10px] font-mono font-bold text-slate-500 uppercase">{link.borderColor || (lang === "tr" ? "Varsayılan" : "Default")}</span>
 <button
 type="button"
 disabled={simulatedPlan === "FREE" && initialUser.role !== "ADMIN"}
 onClick={() => handleUpdateLinkStyle(link.id, "borderColor", null)}
 className="text-[9px] font-bold text-teal-500 hover:text-purple-300 underline text-left disabled:opacity-50 cursor-pointer"
 >
 {lang === "tr" ? "Sıfırla" : "Reset"}
 </button>
 </div>
 </div>
 {/* Color Quick Presets for Border */}
 <div className="flex flex-wrap gap-1.5 pt-1.5 border-t border-gray-100 mt-1">
 {["#ffffff", "#000000", "#e4e4e7", "#3b82f6", "#ef4444", "#10b981", "#facc15", "#a855f7"].map((col) => {
 const isSelected = link.borderColor === col;
 return (
 <button
 key={col}
 type="button"
 disabled={simulatedPlan === "FREE" && initialUser.role !== "ADMIN"}
 onClick={() => handleUpdateLinkStyle(link.id, "borderColor", col)}
 className={`h-5 w-5 rounded-full border hover:scale-110 transition-transform cursor-pointer ${isSelected ? "ring-2 ring-purple-500 ring-offset-1 border-white" : "border-gray-100"}`}
 style={{ backgroundColor: col }}
 title={col}
 />
 );
 })}
 </div>
 </div>
 </div>

 {/* Secondary style controls grid */}
 <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 gap-3.5 p-3.5 rounded-xl bg-gray-50 border border-gray-100">
 {/* Border Style */}
 <div className="flex flex-col gap-1.5">
 <label className="text-[9px] font-extrabold text-zinc-450 uppercase tracking-wider">
 {lang === "tr" ? "Kenarlık Stili" : "Border Style"}
 </label>
 <select
 value={link.borderStyle || "solid"}
 disabled={simulatedPlan === "FREE" && initialUser.role !== "ADMIN"}
 onChange={(e) => handleUpdateLinkStyle(link.id, "borderStyle", e.target.value)}
 className="text-[10px] font-bold py-2.5 md:py-2 px-2.5 rounded-lg border focus:outline-none focus:ring-1 focus:ring-teal-500 bg-gray-50 border-gray-100 text-slate-900 disabled:opacity-50 cursor-pointer"
 >
 <option value="solid">{lang === "tr" ? "Düz (Solid)" : "Solid"}</option>
 <option value="dashed">{lang === "tr" ? "Kesikli (Dashed)" : "Dashed"}</option>
 <option value="dotted">{lang === "tr" ? "Noktalı (Dotted)" : "Dotted"}</option>
 <option value="double">{lang === "tr" ? "Çift (Double)" : "Double"}</option>
 <option value="none">{lang === "tr" ? "Yok (None)" : "None"}</option>
 </select>
 </div>

 {/* Border Width */}
 <div className="flex flex-col gap-1.5">
 <label className="text-[9px] font-extrabold text-zinc-455 uppercase tracking-wider">
 {lang === "tr" ? "Kenarlık Kalınlığı" : "Border Width"}
 </label>
 <select
 value={link.borderWidth || "1px"}
 disabled={simulatedPlan === "FREE" && initialUser.role !== "ADMIN"}
 onChange={(e) => handleUpdateLinkStyle(link.id, "borderWidth", e.target.value)}
 className="text-[10px] font-bold py-2.5 md:py-2 px-2.5 rounded-lg border focus:outline-none focus:ring-1 focus:ring-teal-500 bg-gray-50 border-gray-100 text-slate-900 disabled:opacity-50 cursor-pointer"
 >
 <option value="1px">1px</option>
 <option value="2px">2px</option>
 <option value="3px">3px</option>
 <option value="4px">4px</option>
 </select>
 </div>

 {/* Border Radius */}
 <div className="flex flex-col gap-1.5">
 <label className="text-[9px] font-extrabold text-zinc-455 uppercase tracking-wider">
 {lang === "tr" ? "Köşe Yumuşaklığı" : "Border Radius"}
 </label>
 <select
 value={link.borderRadius || "12px"}
 disabled={simulatedPlan === "FREE" && initialUser.role !== "ADMIN"}
 onChange={(e) => handleUpdateLinkStyle(link.id, "borderRadius", e.target.value)}
 className="text-[10px] font-bold py-2.5 md:py-2 px-2.5 rounded-lg border focus:outline-none focus:ring-1 focus:ring-teal-500 bg-gray-50 border-gray-100 text-slate-900 disabled:opacity-50 cursor-pointer"
 >
 <option value="0px">{lang === "tr" ? "Keskin (0px)" : "Sharp (0px)"}</option>
 <option value="8px">8px</option>
 <option value="12px">12px</option>
 <option value="16px">16px</option>
 <option value="9999px">{lang === "tr" ? "Yuvarlak (Pill)" : "Pill"}</option>
 </select>
 </div>

 {/* Box Shadow Effect */}
 <div className="flex flex-col gap-1.5">
 <label className="text-[9px] font-extrabold text-zinc-455 uppercase tracking-wider">
 {lang === "tr" ? "Gölge Efekti" : "Shadow Effect"}
 </label>
 <select
 value={link.shadow || "none"}
 disabled={simulatedPlan === "FREE" && initialUser.role !== "ADMIN"}
 onChange={(e) => handleUpdateLinkStyle(link.id, "shadow", e.target.value)}
 className="text-[10px] font-bold py-2.5 md:py-2 px-2.5 rounded-lg border focus:outline-none focus:ring-1 focus:ring-teal-500 bg-gray-50 border-gray-100 text-slate-900 disabled:opacity-50 cursor-pointer"
 >
 <option value="none">{lang === "tr" ? "Gölgesiz" : "No Shadow"}</option>
 <option value="soft">{lang === "tr" ? "Yumuşak Gölge" : "Soft Shadow"}</option>
 <option value="hard-3d">{lang === "tr" ? "Retro 3D Gölge" : "Retro 3D Shadow"}</option>
 <option value="glow-purple">{lang === "tr" ? "Neon Mor Işıma" : "Neon Purple Glow"}</option>
 <option value="glow-emerald">{lang === "tr" ? "Neon Yeşil Işıma" : "Neon Emerald Glow"}</option>
 </select>
 </div>

 {/* Font Weight Style */}
 <div className="flex flex-col gap-1.5">
 <label className="text-[9px] font-extrabold text-zinc-455 uppercase tracking-wider">
 {lang === "tr" ? "Yazı Kalınlığı" : "Font Weight"}
 </label>
 <select
 value={link.fontWeight || "font-bold"}
 disabled={simulatedPlan === "FREE" && initialUser.role !== "ADMIN"}
 onChange={(e) => handleUpdateLinkStyle(link.id, "fontWeight", e.target.value)}
 className="text-[10px] font-bold py-2.5 md:py-2 px-2.5 rounded-lg border focus:outline-none focus:ring-1 focus:ring-teal-500 bg-gray-50 border-gray-100 text-slate-900 disabled:opacity-50 cursor-pointer"
 >
 <option value="font-normal">{lang === "tr" ? "Normal" : "Normal"}</option>
 <option value="font-medium">{lang === "tr" ? "Orta (Medium)" : "Medium"}</option>
 <option value="font-bold">{lang === "tr" ? "Kalın (Bold)" : "Bold"}</option>
 </select>
 </div>
 </div>
 </div>
 </>
 )}
 </div>
 ))
 )}
 </div>
 </div>
 </div>
 )}
 {/* TYPOGRAPHY */}
 {activeAppSection === "typography" && (
 <div className="space-y-6 animate-in fade-in duration-150">
 <div>
 <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">{lang === "tr" ? "Yazı Tipi" : "Typography"}</h3>
 <p className="text-xs text-slate-500 font-medium mt-1">{lang === "tr" ? "Kreatör profilinizin ve bağlantı kartlarınızın yazı tipini seçin." : "Choose the typography style for your profile and link cards."}</p>
 </div>
 <div className="space-y-2">
 <label className="text-sm font-semibold text-slate-800 block">{lang === "tr" ? "Yazı Tipi Seçin" : "Select Font"}</label>
 <select value={fontStyle} onChange={(e) => {
 const selectedVal = e.target.value;
 const selected = initialFonts.find(f => f.value === selectedVal);
 if (selected) {
 const locked = (selected.tier === "STARTER" && simulatedPlan === "FREE") || (selected.tier === "CREATOR" && initialUser.plan !== "CREATOR" && initialUser.plan !== "PRO_BUSINESS");
 if (locked) { setErrorMsg(lang === "tr" ? `🔒 "${selected.name}" yazı tipi planınızda kilitlidir.` : `🔒 "${selected.name}" is locked on your plan.`); setSuccessMsg(""); } else { setErrorMsg(""); }
 setFontStyle(selectedVal);
 }
 }} className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none text-sm font-semibold text-slate-900 bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all">
 <optgroup label={lang === "tr" ? "Ücretsiz (FREE)" : "Free Fonts (FREE)"}>{initialFonts.filter(f => f.tier === "FREE").map(f => (<option key={f.value} value={f.value}>{f.giftLabel ? `⭐ ${f.name} (${f.giftLabel})` : f.name}</option>))}</optgroup>
 <optgroup label={lang === "tr" ? "Starter (STARTER)" : "Starter (STARTER)"}>{initialFonts.filter(f => f.tier === "STARTER").map(f => (<option key={f.value} value={f.value}>{simulatedPlan === "FREE" ? "🔒 " : ""}{f.name}</option>))}</optgroup>
 <optgroup label={lang === "tr" ? "Creator (CREATOR)" : "Creator (CREATOR)"}>{initialFonts.filter(f => f.tier === "CREATOR").map(f => (<option key={f.value} value={f.value}>{(initialUser.plan !== "CREATOR" && initialUser.plan !== "PRO_BUSINESS") ? "🔒 " : ""}{f.name}</option>))}</optgroup>
 </select>
 </div>
 <div className="p-5 rounded-2xl border border-gray-100 bg-gray-50 text-center space-y-2">
 <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400 block">{lang === "tr" ? "Canlı Önizleme" : "Live Preview"}</span>
 <div style={{ fontFamily: fontStyle }} className="text-xl md:text-2xl py-2 font-bold text-slate-800 tracking-tight">Abcde 12345 — {fontStyle}</div>
 <p style={{ fontFamily: fontStyle }} className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">{lang === "tr" ? "Hızlı kahverengi tilki tembel köpeğin üstünden atlar." : "The quick brown fox jumps over the lazy dog."}</p>
 </div>
 {(() => {
 const activeFont = initialFonts.find(f => f.value === fontStyle);
 const locked = activeFont && ((activeFont.tier === "STARTER" && simulatedPlan === "FREE") || (activeFont.tier === "CREATOR" && initialUser.plan !== "CREATOR" && initialUser.plan !== "PRO_BUSINESS"));
 if (!locked || !activeFont) return null;
 return (<div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
 <div className="space-y-1"><span className="text-xs font-bold text-amber-700 flex items-center gap-1.5"><Lock className="h-3.5 w-3.5" />{lang === "tr" ? "Plan Yükseltme Gerekli" : "Upgrade Required"}</span><p className="text-[11px] text-slate-600 font-medium">{lang === "tr" ? `"${activeFont.name}" ${activeFont.tier} paketine özeldir.` : `"${activeFont.name}" is exclusive to ${activeFont.tier}.`}</p></div>
 <Link href="/dashboard/billing" className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-lg transition-all whitespace-nowrap">{lang === "tr" ? "Yükselt" : "Upgrade"}</Link>
 </div>);
 })()}
 <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
 <div className="space-y-0.5"><div className="text-xs font-bold text-slate-700 flex items-center gap-1.5"><Sparkles className="h-3.5 w-3.5 text-teal-500" />{lang === "tr" ? "Plan Simülatörü" : "Plan Simulator"}</div></div>
 <div className="flex gap-1.5">{["FREE", "STARTER", "CREATOR"].filter((p) => { if (initialUser.plan === "FREE") return p === "FREE"; if (initialUser.plan === "STARTER") return p === "FREE" || p === "STARTER"; return true; }).map((p) => (
 <button key={p} type="button" onClick={() => setSimulatedPlan(p)} className={`px-3 py-2 rounded-lg text-[11px] font-bold transition-all border cursor-pointer ${simulatedPlan === p ? "bg-teal-500 border-teal-500 text-white shadow-sm" : "bg-white border-gray-200 text-slate-600 hover:bg-gray-50"}`}>{p}</button>
 ))}</div>
 </div>
 </div>
 )}

 {/* WALLPAPER */}
 {activeAppSection === "wallpaper" && (
 <div className="space-y-6 animate-in fade-in duration-150">
 <div className="flex items-center justify-between">
 <div>
 <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">{lang === "tr" ? "Arka Plan" : "Wallpaper"}</h3>
 <p className="text-xs text-slate-500 font-medium mt-1">{lang === "tr" ? "Profil sayfanızın arka plan gradyanını veya görselini seçin." : "Choose a background gradient or image."}</p>
 </div>
 {background && (<button onClick={() => setBackground("")} className="px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-slate-600 font-bold text-[11px] transition-all cursor-pointer">{lang === "tr" ? "Sıfırla" : "Reset"}</button>)}
 </div>

 {simulatedPlan === "FREE" && (
 <div className="space-y-4">
 <label className="text-sm font-semibold text-slate-800 block">{lang === "tr" ? "Ücretsiz Arka Planlar" : "Free Backgrounds"} <span className="text-slate-400 font-normal text-xs">(5)</span></label>
 <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">{FREE_BACKGROUNDS.map((bg: any) => (
 <button key={bg.id} type="button" onClick={() => setBackground(bg.css)} className={`h-20 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-end p-2.5 relative overflow-hidden group hover:scale-[1.03] hover:shadow-md ${background === bg.css ? "border-slate-900 ring-2 ring-slate-900/10 shadow-md" : "border-gray-100 hover:border-gray-300"} ${bg.css}`}>
 <span className="text-[9px] font-bold text-white z-10 block drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">{bg.name}</span></button>
 ))}</div>
 <div className="p-4 rounded-2xl border border-dashed border-gray-200 bg-gray-50/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
 <div className="space-y-1"><div className="flex items-center gap-1.5 text-xs font-bold text-slate-600"><Image className="h-3.5 w-3.5" />{lang === "tr" ? "Özel Fotoğraf Yükle" : "Custom Photo"}<span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-amber-50 border border-amber-200 text-[8px] text-amber-600 uppercase tracking-wide font-black"><Lock className="h-2 w-2" /> PREMIUM</span></div></div>
 <button type="button" onClick={() => triggerUpgradeModal(lang === "tr" ? "Özel Arka Plan Kilidi 🔒" : "Custom Background Locked 🔒", lang === "tr" ? "Kendi özel resimlerinizi veya videolarınızı arka plan olarak kullanmak Premium pakete özeldir." : "Custom backgrounds are exclusive to Premium plans.")} className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-amber-200 bg-amber-50 hover:bg-amber-100 text-amber-700 font-bold text-xs transition-all cursor-pointer"><Lock className="h-3.5 w-3.5" />{lang === "tr" ? "Yükselt" : "Upgrade"}</button>
 </div>
 </div>
 )}

 {simulatedPlan === "STARTER" && (
 <div className="space-y-4">
 <label className="text-sm font-semibold text-slate-800 block">{lang === "tr" ? "Starter Arka Planları" : "Starter Backgrounds"} <span className="text-slate-400 font-normal text-xs">(10)</span></label>
 <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">{STARTER_BACKGROUNDS.map((bg: any) => (
 <button key={bg.id} type="button" onClick={() => setBackground(bg.css)} className={`h-20 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-end p-2.5 relative overflow-hidden group hover:scale-[1.03] hover:shadow-md ${background === bg.css ? "border-slate-900 ring-2 ring-slate-900/10 shadow-md" : "border-gray-100 hover:border-gray-300"} ${bg.css}`}>
 <span className="text-[9px] font-bold text-white z-10 block drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">{bg.name}</span></button>
 ))}</div>
 <div className="p-4 rounded-2xl border border-dashed border-gray-200 bg-gray-50/50 flex flex-col sm:flex-row items-start sm:items-center gap-4">
 <div className="flex-1 space-y-1"><div className="flex items-center gap-1.5 text-xs font-bold text-slate-700"><Image className="h-3.5 w-3.5 text-indigo-500" />{lang === "tr" ? "Özel Fotoğraf Yükle" : "Custom Photo"}</div><p className="text-[10px] text-slate-500 font-medium">{lang === "tr" ? "PNG veya JPEG — Maks. 1 MB" : "PNG or JPEG — Max 1 MB"}</p>{customBgError && (<p className="text-[10px] text-red-500 font-bold mt-1">{customBgError}</p>)}</div>
 <label className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-indigo-200 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 cursor-pointer font-bold text-xs transition-all"><Image className="h-3.5 w-3.5" />{lang === "tr" ? "Fotoğraf Seç" : "Choose Photo"}
 <input type="file" accept="image/png,image/jpeg,image/jpg,image/webp" className="hidden" onChange={(e) => { const file = e.target.files?.[0]; if (!file) return; if (file.size > 1 * 1024 * 1024) { setCustomBgError(lang === "tr" ? "Dosya boyutu 1 MB'ı geçemez!" : "File must be under 1 MB!"); e.target.value = ""; return; } setCustomBgError(""); const reader = new FileReader(); reader.onload = (ev) => { setBackground(`custom-img::${ev.target?.result as string}`); }; reader.readAsDataURL(file); }} /></label>
 {background?.startsWith("custom-img::") && (<button type="button" onClick={() => setBackground("")} className="text-[10px] font-bold text-red-500 hover:text-red-700 transition-colors cursor-pointer">✕ {lang === "tr" ? "Kaldır" : "Remove"}</button>)}
 </div>
 </div>
 )}

 {(simulatedPlan === "CREATOR" || simulatedPlan === "PRO_BUSINESS") && (
 <div className="space-y-4">
 <label className="text-sm font-semibold text-slate-800 block">{lang === "tr" ? "Creator Arka Planları" : "Creator Backgrounds"} <span className="text-slate-400 font-normal text-xs">(20)</span></label>
 <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">{[...STARTER_BACKGROUNDS, ...CREATOR_BACKGROUNDS].map((bg) => (
 <button key={bg.id} type="button" onClick={() => setBackground(bg.css)} className={`h-20 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-end p-2.5 relative overflow-hidden group hover:scale-[1.03] hover:shadow-md ${background === bg.css ? "border-slate-900 ring-2 ring-slate-900/10 shadow-md" : "border-gray-100 hover:border-gray-300"} ${bg.css}`}>
 <span className="text-[9px] font-bold text-white z-10 block drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">{bg.name}</span></button>
 ))}</div>
 <div className="grid sm:grid-cols-2 gap-3">
 <div className="p-4 rounded-2xl border border-dashed border-purple-200 bg-purple-50/30 flex flex-col gap-3">
 <div className="space-y-1"><div className="flex items-center gap-1.5 text-xs font-bold text-purple-700"><Image className="h-3.5 w-3.5" />{lang === "tr" ? "Özel Fotoğraf" : "Custom Photo"}</div><p className="text-[10px] text-slate-500 font-medium">{lang === "tr" ? "PNG / JPEG / WebP — Maks. 1 MB" : "Max 1 MB"}</p>{customBgError && customBgError.includes("foto") && (<p className="text-[10px] text-red-500 font-bold">{customBgError}</p>)}</div>
 <label className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-purple-200 bg-purple-100 hover:bg-purple-200 text-purple-800 cursor-pointer font-bold text-xs transition-all"><Image className="h-3.5 w-3.5" />{lang === "tr" ? "Fotoğraf Seç" : "Choose Photo"}
 <input type="file" accept="image/png,image/jpeg,image/jpg,image/webp" className="hidden" onChange={(e) => { const file = e.target.files?.[0]; if (!file) return; if (file.size > 1 * 1024 * 1024) { setCustomBgError(lang === "tr" ? "📸 Fotoğraf 1 MB sınırını aşıyor!" : "📸 Photo exceeds 1 MB!"); e.target.value = ""; return; } setCustomBgError(""); const reader = new FileReader(); reader.onload = (ev) => { setBackground(`custom-img::${ev.target?.result as string}`); }; reader.readAsDataURL(file); }} /></label>
 {background?.startsWith("custom-img::") && (<button type="button" onClick={() => setBackground("")} className="text-[10px] font-bold text-red-500 hover:text-red-700 transition-colors cursor-pointer text-center">✕ {lang === "tr" ? "Kaldır" : "Remove"}</button>)}
 </div>
 <div className="p-4 rounded-2xl border border-dashed border-amber-200 bg-amber-50/30 flex flex-col gap-3">
 <div className="space-y-1"><div className="flex items-center gap-1.5 text-xs font-bold text-amber-700"><Play className="h-3.5 w-3.5" />{lang === "tr" ? "Özel Video" : "Custom Video"}</div><p className="text-[10px] text-slate-500 font-medium">{lang === "tr" ? "MP4 / WebM — Maks. 5 MB" : "Max 5 MB"}</p>{customBgError && customBgError.includes("video") && (<p className="text-[10px] text-red-500 font-bold">{customBgError}</p>)}</div>
 <label className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-amber-200 bg-amber-100 hover:bg-amber-200 text-amber-800 cursor-pointer font-bold text-xs transition-all"><Play className="h-3.5 w-3.5" />{lang === "tr" ? "Video Seç" : "Choose Video"}
 <input type="file" accept="video/mp4,video/webm" className="hidden" onChange={(e) => { const file = e.target.files?.[0]; if (!file) return; if (file.size > 5 * 1024 * 1024) { setCustomBgError(lang === "tr" ? "🎬 Video 5 MB sınırını aşıyor!" : "🎬 Video exceeds 5 MB!"); e.target.value = ""; return; } setCustomBgError(""); const reader = new FileReader(); reader.onload = (ev) => { setBackground(`custom-video::${ev.target?.result as string}`); }; reader.readAsDataURL(file); }} /></label>
 {background?.startsWith("custom-video::") && (<button type="button" onClick={() => setBackground("")} className="text-[10px] font-bold text-red-500 hover:text-red-700 transition-colors cursor-pointer text-center">✕ {lang === "tr" ? "Kaldır" : "Remove"}</button>)}
 </div>
 </div>
 </div>
 )}

 <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
 <div className="text-xs font-bold text-slate-700 flex items-center gap-1.5"><Sparkles className="h-3.5 w-3.5 text-teal-500" />{lang === "tr" ? "Plan Simülatörü" : "Plan Simulator"}</div>
 <div className="flex gap-1.5">{["FREE", "STARTER", "CREATOR"].filter((p) => { if (initialUser.plan === "FREE") return p === "FREE"; if (initialUser.plan === "STARTER") return p === "FREE" || p === "STARTER"; return true; }).map((p) => (
 <button key={p} type="button" onClick={() => setSimulatedPlan(p)} className={`px-3 py-2 rounded-lg text-[11px] font-bold transition-all border cursor-pointer ${simulatedPlan === p ? "bg-teal-500 border-teal-500 text-white shadow-sm" : "bg-white border-gray-200 text-slate-600 hover:bg-gray-50"}`}>{p}</button>
 ))}</div>
 </div>
 </div>
 )}

 {/* BUTTONS */}
 {activeAppSection === "buttons" && (
 <div className="space-y-6 animate-in fade-in duration-150">
 <div>
 <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">{lang === "tr" ? "Buton Stilleri" : "Button Styles"}</h3>
 <p className="text-xs text-slate-500 font-medium mt-1">{lang === "tr" ? "Bağlantı kartlarınızın varsayılan görünümünü belirleyin." : "Set the default appearance for all your link cards."}</p>
 </div>
 <div className="space-y-5">
 <div className="grid sm:grid-cols-2 gap-5">
 <div className="space-y-2"><label className="text-sm font-semibold text-slate-800 block">{lang === "tr" ? "Buton Arka Planı" : "Button Background"}</label><div className="flex gap-2"><input type="color" value={btnBgColor || "#ffffff"} onChange={(e) => setBtnBgColor(e.target.value)} className="h-10 w-12 rounded-xl border border-gray-200 cursor-pointer" /><input type="text" value={btnBgColor || ""} onChange={(e) => setBtnBgColor(e.target.value)} className="flex-1 px-3 py-2 border border-gray-200 rounded-xl text-sm font-mono text-slate-800 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none bg-white transition-all" /></div></div>
 <div className="space-y-2"><label className="text-sm font-semibold text-slate-800 block">{lang === "tr" ? "Buton Yazı Rengi" : "Button Text"}</label><div className="flex gap-2"><input type="color" value={btnTextColor || "#000000"} onChange={(e) => setBtnTextColor(e.target.value)} className="h-10 w-12 rounded-xl border border-gray-200 cursor-pointer" /><input type="text" value={btnTextColor || ""} onChange={(e) => setBtnTextColor(e.target.value)} className="flex-1 px-3 py-2 border border-gray-200 rounded-xl text-sm font-mono text-slate-800 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none bg-white transition-all" /></div></div>
 </div>
 <div className="grid sm:grid-cols-2 gap-5">
 <div className="space-y-2"><label className="text-sm font-semibold text-slate-800 block">{lang === "tr" ? "Çerçeve Rengi" : "Border Color"}</label><div className="flex gap-2"><input type="color" value={btnBorderColor || "#000000"} onChange={(e) => setBtnBorderColor(e.target.value)} className="h-10 w-12 rounded-xl border border-gray-200 cursor-pointer" /><input type="text" value={btnBorderColor || ""} onChange={(e) => setBtnBorderColor(e.target.value)} className="flex-1 px-3 py-2 border border-gray-200 rounded-xl text-sm font-mono text-slate-800 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none bg-white transition-all" /></div></div>
 <div className="space-y-2"><label className="text-sm font-semibold text-slate-800 block">{lang === "tr" ? "Çerçeve Stili" : "Border Style"}</label><select value={btnBorderStyle} onChange={(e) => setBtnBorderStyle(e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-slate-900 outline-none bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"><option value="solid">{lang === "tr" ? "Düz (Solid)" : "Solid"}</option><option value="dashed">{lang === "tr" ? "Kesikli" : "Dashed"}</option><option value="double">{lang === "tr" ? "Çift" : "Double"}</option><option value="dotted">{lang === "tr" ? "Noktalı" : "Dotted"}</option><option value="none">{lang === "tr" ? "Yok" : "None"}</option></select></div>
 </div>
 <div className="grid sm:grid-cols-2 gap-5">
 <div className="space-y-2"><label className="text-sm font-semibold text-slate-800 block">{lang === "tr" ? "Çerçeve Kalınlığı" : "Border Width"}</label><select value={btnBorderWidth} onChange={(e) => setBtnBorderWidth(e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-slate-900 outline-none bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"><option value="0px">0px</option><option value="1px">1px</option><option value="2px">2px</option><option value="3px">3px</option><option value="4px">4px</option><option value="5px">5px</option></select></div>
 <div className="space-y-2"><label className="text-sm font-semibold text-slate-800 block">{lang === "tr" ? "Köşe Yuvarlaklığı" : "Border Radius"}</label><select value={btnBorderRadius} onChange={(e) => setBtnBorderRadius(e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-slate-900 outline-none bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"><option value="0px">{lang === "tr" ? "Keskin (0px)" : "Sharp"}</option><option value="4px">4px</option><option value="8px">8px</option><option value="12px">12px</option><option value="16px">16px</option><option value="20px">20px</option><option value="24px">24px</option><option value="9999px">{lang === "tr" ? "Yuvarlak" : "Round"}</option></select></div>
 </div>
 <div className="grid sm:grid-cols-2 gap-5">
 <div className="space-y-2"><label className="text-sm font-semibold text-slate-800 block">{lang === "tr" ? "Gölge Efekti" : "Shadow"}</label><select value={btnShadow} onChange={(e) => setBtnShadow(e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-slate-900 outline-none bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"><option value="none">{lang === "tr" ? "Yok" : "None"}</option><option value="soft">{lang === "tr" ? "Yumuşak" : "Soft"}</option><option value="glow-purple">{lang === "tr" ? "Mor Işıma" : "Glow Purple"}</option><option value="glow-emerald">{lang === "tr" ? "Yeşil Işıma" : "Glow Emerald"}</option><option value="hard-3d">{lang === "tr" ? "Sert 3D" : "Hard 3D"}</option></select></div>
 <div className="space-y-2"><label className="text-sm font-semibold text-slate-800 block">{lang === "tr" ? "Yazı Kalınlığı" : "Font Weight"}</label><select value={btnFontWeight} onChange={(e) => setBtnFontWeight(e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-slate-900 outline-none bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"><option value="font-normal">Normal</option><option value="font-medium">Medium</option><option value="font-bold">Bold</option><option value="font-black">Black</option></select></div>
 </div>
 </div>
 <div className="p-5 rounded-2xl border border-gray-100 bg-gray-50 space-y-3">
 <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400 block text-center">{lang === "tr" ? "Buton Önizlemesi" : "Button Preview"}</span>
 <div className="flex justify-center"><div className={`px-6 py-3 text-sm ${btnFontWeight || "font-bold"}`} style={{ backgroundColor: btnBgColor || "#ffffff", color: btnTextColor || "#000000", borderColor: btnBorderColor || "#000000", borderStyle: btnBorderStyle || "solid", borderWidth: btnBorderWidth || "1px", borderRadius: btnBorderRadius || "12px", boxShadow: btnShadow === "soft" ? "0 4px 12px rgba(0,0,0,0.1)" : btnShadow === "glow-purple" ? "0 0 20px rgba(168,85,247,0.4)" : btnShadow === "glow-emerald" ? "0 0 20px rgba(16,185,129,0.4)" : btnShadow === "hard-3d" ? "4px 4px 0px rgba(0,0,0,0.8)" : "none" }}>{lang === "tr" ? "Örnek Buton" : "Sample Button"}</div></div>
 </div>
 </div>
 )}

 {/* COLORS */}
 {activeAppSection === "colors" && (
 <div className="space-y-6 animate-in fade-in duration-150">
 <div>
 <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">{lang === "tr" ? "Renk Paleti" : "Color Palette"}</h3>
 <p className="text-xs text-slate-500 font-medium mt-1">{lang === "tr" ? "Kullanıcı adı ve biyografi yazı renklerini özgürce seçin." : "Customize your username and bio text colors."}</p>
 </div>
 <div className="grid sm:grid-cols-2 gap-6">
 <div className="p-5 rounded-2xl border border-gray-100 bg-gray-50 space-y-4">
 <div className="flex justify-between items-center"><label className="text-sm font-semibold text-slate-800">{lang === "tr" ? "Kullanıcı Adı Rengi" : "Username Color"}</label><div className="flex items-center gap-1.5"><input type="text" value={usernameColor} onChange={(e) => setUsernameColor(e.target.value)} className="w-[72px] px-2 py-1 border border-gray-200 rounded-lg bg-white font-mono text-[11px] font-bold text-center text-slate-800 outline-none focus:border-teal-500" /><div className="relative w-6 h-6 rounded-full overflow-hidden border border-gray-200 cursor-pointer shrink-0"><input type="color" value={usernameColor} onChange={(e) => setUsernameColor(e.target.value)} className="absolute inset-0 w-full h-full p-0 border-none cursor-pointer scale-150" /></div></div></div>
 <div className="flex flex-wrap gap-2">{["#ffffff", "#000000", "#f59e0b", "#ec4899", "#22c55e", "#a855f7", "#3b82f6", "#ef4444"].map((c) => (<button key={c} type="button" onClick={() => setUsernameColor(c)} className={`w-7 h-7 rounded-full border-2 shadow-sm transition-transform cursor-pointer hover:scale-110 ${usernameColor === c ? "ring-2 ring-teal-500 ring-offset-2 scale-105" : "border-gray-200"}`} style={{ backgroundColor: c }} title={c} />))}</div>
 </div>
 <div className="p-5 rounded-2xl border border-gray-100 bg-gray-50 space-y-4">
 <div className="flex justify-between items-center"><label className="text-sm font-semibold text-slate-800">{lang === "tr" ? "Biyografi Rengi" : "Bio Color"}</label><div className="flex items-center gap-1.5"><input type="text" value={bioColor} onChange={(e) => setBioColor(e.target.value)} className="w-[72px] px-2 py-1 border border-gray-200 rounded-lg bg-white font-mono text-[11px] font-bold text-center text-slate-800 outline-none focus:border-teal-500" /><div className="relative w-6 h-6 rounded-full overflow-hidden border border-gray-200 cursor-pointer shrink-0"><input type="color" value={bioColor} onChange={(e) => setBioColor(e.target.value)} className="absolute inset-0 w-full h-full p-0 border-none cursor-pointer scale-150" /></div></div></div>
 <div className="flex flex-wrap gap-2">{["#888888", "#ffffff", "#000000", "#f59e0b", "#ec4899", "#22c55e", "#a855f7", "#3b82f6"].map((c) => (<button key={c} type="button" onClick={() => setBioColor(c)} className={`w-7 h-7 rounded-full border-2 shadow-sm transition-transform cursor-pointer hover:scale-110 ${bioColor === c ? "ring-2 ring-teal-500 ring-offset-2 scale-105" : "border-gray-200"}`} style={{ backgroundColor: c }} title={c} />))}</div>
 </div>
 </div>
 </div>
 )}

 </div>
 </div>
 </div>
 )}


  {activeSubTab === "profile" && (
    <div className="w-full max-w-full space-y-5 md:space-y-8 animate-in fade-in duration-200 overflow-hidden">
      {/* Profile customizer */}
      <div className="p-3 sm:p-4 md:p-8 rounded-2xl border space-y-5 md:space-y-6 w-full max-w-full overflow-hidden bg-white border-zinc-200 shadow-sm">
        <div className="flex flex-wrap items-center justify-between">
          <div className="flex items-center gap-3">
            <User className="h-5 w-5 text-teal-500" />
            <h2 className="font-extrabold text-lg text-zinc-950">{t.profileCustomizer}</h2>
          </div>
          <button
            onClick={handleSaveProfile}
            disabled={isPending}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-full font-extrabold text-xs transition-all disabled:opacity-50 cursor-pointer bg-zinc-900 text-white hover:bg-zinc-800 shadow-md shadow-zinc-950/15"
          >
            {isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
            {t.saveChanges}
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-4 md:gap-6">
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider block text-slate-500">{t.usernameLabel}</label>
            <div className="flex items-center rounded-xl border focus-within:border-teal-500/50 overflow-hidden px-3 bg-zinc-100 border-zinc-200">
              <span className="text-slate-500 text-[11px] sm:text-sm shrink-0">clinkor.com/</span>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="flex-1 bg-transparent py-2.5 outline-none text-sm text-zinc-900"
                placeholder="username"
              />
            </div>
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-xs font-semibold uppercase tracking-wider block text-slate-500">
              {lang === "tr" ? "Profil Fotoğrafı Yükle" : "Upload Profile Photo"}
            </label>
            <div className="p-4 md:p-5 rounded-xl border flex items-center gap-5 bg-zinc-100 border-zinc-200">
              <div className="w-16 h-16 rounded-full border flex items-center justify-center overflow-hidden shrink-0 bg-white border-zinc-300 shadow-inner">
                {avatarUrl ? (
                  <img src={avatarUrl} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <User className="h-6 w-6 text-slate-500" />
                )}
              </div>
              <div className="space-y-1.5">
                <div className="flex gap-2">
                  <label className="px-3.5 py-2.5 rounded-lg border text-xs font-bold transition-all cursor-pointer select-none bg-white hover:bg-zinc-50 border-zinc-300 text-zinc-700 shadow-sm">
                    {lang === "tr" ? "Fotoğraf Seç" : "Select Photo"}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          if (file.size > 2.5 * 1024 * 1024) {
                            alert(lang === "tr" ? "Lütfen 2.5MB'den küçük bir fotoğraf seçin!" : "Please select an image smaller than 2.5MB!");
                            return;
                          }
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            if (event.target?.result) {
                              setAvatarUrl(event.target.result as string);
                            }
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>
                  {avatarUrl && (
                    <button
                      type="button"
                      onClick={() => setAvatarUrl("")}
                      className="px-3.5 py-2.5 rounded-lg border text-xs font-bold transition-all cursor-pointer select-none bg-red-50 hover:bg-red-100 border-red-200 text-red-600"
                    >
                      {lang === "tr" ? "Kaldır" : "Remove"}
                    </button>
                  )}
                </div>
                <p className="text-[10px] text-slate-500 font-semibold">
                  {lang === "tr" ? "Maksimum 2.5MB (PNG, JPG). Fotoğraf veri tabanına güvenle işlenecektir." : "Max 2.5MB (PNG, JPG). Image will be safely encrypted."}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-xs font-semibold uppercase tracking-wider block text-slate-500">
              {lang === "tr" ? "FOTOĞRAF ŞEKLİ" : "AVATAR SHAPE"}
            </label>
            <div className="grid grid-cols-5 gap-3 p-4 rounded-xl border bg-zinc-100 border-zinc-200">
              {[
                { id: "circle", label: lang === "tr" ? "Yuvarlak" : "Circle", class: "rounded-full" },
                { id: "squircle", label: lang === "tr" ? "Yumuşak Kare" : "Squircle", class: "rounded-2xl" },
                { id: "square", label: lang === "tr" ? "Keskin Kare" : "Square", class: "rounded-none" },
                { id: "leaf", label: lang === "tr" ? "Yaprak" : "Leaf", class: "rounded-tl-3xl rounded-br-3xl" },
                { id: "arch", label: lang === "tr" ? "Kemer" : "Arch", class: "rounded-t-full rounded-b-xl" }
              ].map((shapeOption) => (
                <button
                  key={shapeOption.id}
                  type="button"
                  onClick={() => setAvatarShape(shapeOption.id)}
                  className={`flex flex-col items-center justify-center p-2 rounded-xl border bg-white cursor-pointer select-none transition-all duration-200 h-20 shadow-sm ${
                    avatarShape === shapeOption.id
                      ? "border-teal-500 ring-2 ring-teal-500/20"
                      : "border-zinc-300 hover:border-zinc-400"
                  }`}
                >
                  <div className={`w-8 h-8 bg-zinc-400 border border-zinc-500/30 ${shapeOption.class} mb-1.5`} />
                  <span className="text-[9px] font-extrabold text-zinc-600 truncate max-w-full text-center">
                    {shapeOption.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-xs font-semibold uppercase tracking-wider block text-slate-500">{t.bioLabel}</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border focus:outline-none focus:border-teal-500/50 text-sm bg-zinc-100 border-zinc-200 text-zinc-900"
              placeholder={t.bioPlaceholder}
              rows={3}
            />
          </div>
        </div>
      </div>
    </div>
  )}

 </div>
 )})()}

 {/* TAB 5: OWNED TEMPLATES (ŞABLONLARIM) */}

      </div>

      {/* RIGHT COLUMN: STICKY SIMULATOR PREVIEW */}
      <PhonePreview mode="editor" data={previewData} />

      {isSaveTemplateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl border border-zinc-200 p-6 w-full max-w-md mx-4 shadow-xl space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-lg text-zinc-950 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-teal-500" />
                {lang === "tr" ? "Şablon Olarak Kaydet" : "Save as Template"}
              </h3>
              <button
                type="button"
                onClick={() => setIsSaveTemplateModalOpen(false)}
                className="p-1 rounded-lg hover:bg-gray-100 text-zinc-500 transition-all cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleSaveAsTemplateSubmit} className="space-y-4">
              <div>
                <label className="text-[10px] text-slate-500 uppercase tracking-wider font-extrabold block mb-1">
                  {lang === "tr" ? "Şablon Adı" : "Template Name"}
                </label>
                <input
                  type="text"
                  required
                  value={templateSaveName}
                  onChange={(e) => setTemplateSaveName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:border-teal-500/50 outline-none text-sm bg-zinc-50 text-zinc-900 font-medium"
                  placeholder={lang === "tr" ? "Örn: Yaz Temam" : "e.g. My Summer Theme"}
                />
              </div>

              {saveTemplateError && (
                <p className="text-xs font-bold text-red-500">{saveTemplateError}</p>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsSaveTemplateModalOpen(false)}
                  className="flex-1 py-3 rounded-xl border border-zinc-200 hover:bg-gray-50 text-zinc-700 font-bold text-sm transition-all cursor-pointer"
                >
                  {lang === "tr" ? "İptal" : "Cancel"}
                </button>
                <button
                  type="submit"
                  disabled={isPending || !templateSaveName.trim()}
                  className="flex-1 py-3 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-black text-sm transition-all disabled:opacity-50 cursor-pointer shadow-md shadow-teal-500/10"
                >
                  {isPending ? <Loader2 className="h-4 w-4 animate-spin mx-auto" /> : (lang === "tr" ? "Kaydet" : "Save")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
