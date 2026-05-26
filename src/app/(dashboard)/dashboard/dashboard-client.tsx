"use client";

import {
  useState, useEffect, useTransition, useMemo, useRef } from "react";
import Link from "next/link";
import { SignOutButton } from "@clerk/nextjs";
import { QRCodeSVG } from "qrcode.react";
import {
  addLink,
  deleteLink,
  toggleLinkActive,
  updateProfile,
  generateMockTraffic,
  saveSeoProfile,
  saveCustomDomain,
  addProduct,
  deleteProduct,
  
  createQrCode,
  updateQrCode,
  deleteQrCode,
  updateLinkAnimation,
  updateLinkCustomStyle,
  applyTemplateToProfile
} from "@/app/actions";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
  BarChart,
  Bar
} from "recharts";
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
  ChevronUp
} from "lucide-react";
import GlobalOverlayManager from "@/components/global-overlay-manager";
import VideoPlayer from "@/components/blocks/video-player";
import BeforeAfterSlider from "@/components/blocks/before-after-slider";
import AudioPlayer from "@/components/blocks/audio-player";
import UpgradeModal from "@/components/dashboard/upgrade-modal";
import FloatingUpgradePrompt from "@/components/dashboard/floating-upgrade-prompt";


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

type PageViewItem = {
  id: string;
  device: string | null;
  browser: string | null;
  country: string | null;
  referrer: string | null;
  createdAt: string;
};

type UserProfile = {
  theme: string;
  bio: string | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
  seoKeywords?: string | null;
  customDomain?: string | null;
  avatarUrl?: string | null;
  background?: string | null;
  fontStyle?: string | null;
  bioColor?: string | null;
  usernameColor?: string | null;
};

type UserData = {
  id: string;
  username: string | null;
  plan: string;
  role: string;
  profile: UserProfile | null;
};

type ProductItem = {
  id: string;
  title: string;
  type: string;
  price: number;
  description: string | null;
  fileUrl: string;
  isActive: boolean;
  salesCount: number;
  createdAt: string;
};

type QrCodeItem = {
  id: string;
  name: string;
  type: string;
  value: string;
  fgColor: string;
  bgColor: string;
  logoUrl: string | null;
  createdAt: string;
};

interface DashboardClientProps {
  initialUser: UserData;
  initialLinks: LinkItem[];
  initialPageViews: PageViewItem[];
  initialProducts: ProductItem[];
  globalSettings?: Record<string, string>;
  initialFonts?: { id?: string; name: string; value: string; tier: string; giftLabel?: string | null }[];
  initialQrCodes?: QrCodeItem[];
  initialOwnedTemplates?: {
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
  }[];
}



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

export const FONTS_CATALOG = [
  // FREE FONTS (10)
  { name: "Inter", value: "Inter", tier: "FREE" },
  { name: "Roboto", value: "Roboto", tier: "FREE" },
  { name: "Outfit", value: "Outfit", tier: "FREE" },
  { name: "Playfair Display", value: "Playfair Display", tier: "FREE" },
  { name: "Courier Prime", value: "Courier Prime", tier: "FREE" },
  { name: "Fira Sans", value: "Fira Sans", tier: "FREE" },
  { name: "Plus Jakarta Sans", value: "Plus Jakarta Sans", tier: "FREE" },
  { name: "Merriweather", value: "Merriweather", tier: "FREE" },
  { name: "Lora", value: "Lora", tier: "FREE" },
  { name: "Montserrat", value: "Montserrat", tier: "FREE" },

  // STARTER FONTS (10)
  { name: "Syne", value: "Syne", tier: "STARTER" },
  { name: "Space Grotesk", value: "Space Grotesk", tier: "STARTER" },
  { name: "DM Sans", value: "DM Sans", tier: "STARTER" },
  { name: "Cormorant Garamond", value: "Cormorant Garamond", tier: "STARTER" },
  { name: "Cinzel", value: "Cinzel", tier: "STARTER" },
  { name: "Bebas Neue", value: "Bebas Neue", tier: "STARTER" },
  { name: "Sora", value: "Sora", tier: "STARTER" },
  { name: "Cabinet Grotesk", value: "Cabinet Grotesk", tier: "STARTER" },
  { name: "Clash Display", value: "Clash Display", tier: "STARTER" },
  { name: "Cabinet", value: "Cabinet", tier: "STARTER" },

  // CREATOR FONTS (12 more, 32 total)
  { name: "Calistoga", value: "Calistoga", tier: "CREATOR" },
  { name: "Lexend", value: "Lexend", tier: "CREATOR" },
  { name: "Archivo Black", value: "Archivo Black", tier: "CREATOR" },
  { name: "Pacifico", value: "Pacifico", tier: "CREATOR" },
  { name: "Lobster", value: "Lobster", tier: "CREATOR" },
  { name: "Permanent Marker", value: "Permanent Marker", tier: "CREATOR" },
  { name: "Righteous", value: "Righteous", tier: "CREATOR" },
  { name: "Satisfy", value: "Satisfy", tier: "CREATOR" },
  { name: "Unbounded", value: "Unbounded", tier: "CREATOR" },
];

const getLinkIconHelper = (type?: string, url?: string) => {
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

export default function DashboardClient({
  initialUser,
  initialLinks,
  initialPageViews,
  initialProducts,
  globalSettings,
  initialFonts = FONTS_CATALOG,
  initialQrCodes = [],
  initialOwnedTemplates = []
}: DashboardClientProps) {
  const [ownedTemplates, setOwnedTemplates] = useState(initialOwnedTemplates);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [upgradeModalTitle, setUpgradeModalTitle] = useState("");
  const [upgradeModalDesc, setUpgradeModalDesc] = useState("");

  const triggerUpgradeModal = (title: string, desc: string) => {
    setUpgradeModalTitle(title);
    setUpgradeModalDesc(desc);
    setIsUpgradeModalOpen(true);
  };

  const [simulatedPlan, setSimulatedPlan] = useState(initialUser.plan);
  const isTemplateUnlocked = (templateTier: string) => {
    const userPlan = simulatedPlan;
    if (userPlan === "CREATOR" || userPlan === "PRO_BUSINESS" || initialUser.role === "ADMIN") {
      return true;
    }
    if (userPlan === "STARTER") {
      return templateTier === "FREE" || templateTier === "STARTER";
    }
    return templateTier === "FREE";
  };

  const FREE_BACKGROUNDS = useMemo<{ id: string; name: string; css: string }[]>(() => {
    return globalSettings?.["backgrounds_free"] 
      ? JSON.parse(globalSettings["backgrounds_free"]) 
      : DEFAULT_FREE_BACKGROUNDS;
  }, [globalSettings]);

  const STARTER_BACKGROUNDS = useMemo<{ id: string; name: string; css: string }[]>(() => {
    return globalSettings?.["backgrounds_starter"] 
      ? JSON.parse(globalSettings["backgrounds_starter"]) 
      : DEFAULT_STARTER_BACKGROUNDS;
  }, [globalSettings]);

  const CREATOR_BACKGROUNDS = useMemo<{ id: string; name: string; css: string }[]>(() => {
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
      const freeList = globalSettings?.["animations_free"] 
        ? JSON.parse(globalSettings["animations_free"]) 
        : defaultFree;
      const starterList = globalSettings?.["animations_starter"] 
        ? JSON.parse(globalSettings["animations_starter"]) 
        : defaultStarter;
      const creatorList = globalSettings?.["animations_creator"] 
        ? JSON.parse(globalSettings["animations_creator"]) 
        : defaultCreator;
      
      const allAnims = [...freeList, ...starterList, ...creatorList];
      const userPlan = simulatedPlan;
      if (userPlan === "CREATOR" || userPlan === "PRO_BUSINESS") {
        return allAnims;
      }
      if (userPlan === "STARTER") {
        return allAnims.filter(a => a.tier === "FREE" || a.tier === "STARTER");
      }
      return allAnims.filter(a => a.tier === "FREE");
    } catch (e) {
      const defaultAll = [...defaultFree, ...defaultStarter, ...defaultCreator];
      const userPlan = simulatedPlan;
      if (userPlan === "CREATOR" || userPlan === "PRO_BUSINESS") {
        return defaultAll;
      }
      if (userPlan === "STARTER") {
        return defaultAll.filter(a => a.tier === "FREE" || a.tier === "STARTER");
      }
      return defaultAll.filter(a => a.tier === "FREE");
    }
  }, [globalSettings, simulatedPlan, initialUser.role]);

  
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);

  useEffect(() => {
    if (initialUser.plan === "FREE") {
      const timer = setInterval(() => {
        setShowUpgradePrompt(true);
        setTimeout(() => setShowUpgradePrompt(false), 15000);
      }, 60000 * 3); // Every 3 minutes
      
      const initialTimer = setTimeout(() => {
        setShowUpgradePrompt(true);
        setTimeout(() => setShowUpgradePrompt(false), 15000);
      }, 5000); // First time after 5 seconds

      return () => {
        clearInterval(timer);
        clearTimeout(initialTimer);
      };
    }
  }, [initialUser.plan]);

  const [activeTab, setActiveTab] = useState<"editor" | "analytics" | "qr" | "seo" | "templates">("editor");
  const [activeSubTab, setActiveSubTab] = useState<"links" | "appearance" | "profile">("links");
  const [expandedLinkCard, setExpandedLinkCard] = useState<string | null>(null);

  useEffect(() => {
    setSimulatedPlan(initialUser.plan);
  }, [initialUser.plan]);

  const [links, setLinks] = useState<LinkItem[]>(initialLinks);
  const [bio, setBio] = useState(initialUser.profile?.bio ?? "");
  const [avatarUrl, setAvatarUrl] = useState(initialUser.profile?.avatarUrl ?? "");
  const [background, setBackground] = useState(initialUser.profile?.background ?? "");
  const [theme, setTheme] = useState(initialUser.profile?.theme ?? "dark");
  const [fontStyle, setFontStyle] = useState(initialUser.profile?.fontStyle ?? "Inter");
  const [bioColor, setBioColor] = useState(initialUser.profile?.bioColor ?? "#888888");
  const [usernameColor, setUsernameColor] = useState(initialUser.profile?.usernameColor ?? "#ffffff");
  const [username, setUsername] = useState(initialUser.username ?? "");

  // Products State
  const [products, setProducts] = useState<ProductItem[]>(initialProducts);
  const [qrCodes, setQrCodes] = useState<QrCodeItem[]>(initialQrCodes);
  const [prodTitle, setProdTitle] = useState("");
  const [prodPrice, setProdPrice] = useState("");
  const [prodType, setProdType] = useState("BEAT");
  const [prodDesc, setProdDesc] = useState("");
  const [prodFileUrl, setProdFileUrl] = useState("");

  // AI Assistant State
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiResult, setAiResult] = useState<{ bio: string; theme: string; sampleLinks: { title: string; url: string }[] } | null>(null);

  const [newTitle, setNewTitle] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [linkSelectedTemplate, setLinkSelectedTemplate] = useState<string | null>(null);
  
  // Extended Block Types State
  const [blockType, setBlockType] = useState("TEXT_LINK"); // TEXT_LINK, VIDEO_PLAYER, AUDIO_PLAYER, BEFORE_AFTER
  const [beforeImage, setBeforeImage] = useState("");
  const [afterImage, setAfterImage] = useState("");
  const [blockFileError, setBlockFileError] = useState("");

  // SEO Form State
  const [seoTitle, setSeoTitle] = useState(initialUser.profile?.seoTitle ?? "");
  const [seoDescription, setSeoDescription] = useState(initialUser.profile?.seoDescription ?? "");
  const [seoKeywords, setSeoKeywords] = useState(initialUser.profile?.seoKeywords ?? "");

  // Domain Form State
  const [customDomain, setCustomDomain] = useState(initialUser.profile?.customDomain ?? "");

  // QR Code Styles State
  const [qrFgColor, setQrFgColor] = useState("#a855f7"); // default purple
  const [qrBgColor, setQrBgColor] = useState("#000000"); // black bg
  const [qrSize, setQrSize] = useState(200); // fixed preview size
  const [qrDownloadSize, setQrDownloadSize] = useState(1000); // custom high-res download size
  const [qrIncludeLogo, setQrIncludeLogo] = useState(false);
  const [qrLogoFile, setQrLogoFile] = useState<string | null>(null);

  // Custom Background Upload State
  const [customBgError, setCustomBgError] = useState<string>("");

  // QR Code Custom States
  const [qrMode, setQrMode] = useState<"catalog" | "create">("catalog");
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [qrName, setQrName] = useState("");
  const [qrValueText, setQrValueText] = useState("");
  
  // Specific Wifi inputs
  const [wifiSsid, setWifiSsid] = useState("");
  const [wifiPassword, setWifiPassword] = useState("");
  const [wifiEncryption, setWifiEncryption] = useState<"WEP" | "WPA" | "nopass">("WPA");

  // Specific WhatsApp inputs
  const [whatsAppPhone, setWhatsAppPhone] = useState("");
  const [whatsAppMessage, setWhatsAppMessage] = useState("");

  // Specific vCard inputs
  const [vCardName, setVCardName] = useState("");
  const [vCardPhone, setVCardPhone] = useState("");
  const [vCardEmail, setVCardEmail] = useState("");
  const [vCardOrg, setVCardOrg] = useState("");
  const [vCardTitle, setVCardTitle] = useState("");
  const [vCardUrl, setVCardUrl] = useState("");
  const computedQrValue = useMemo(() => {
    if (!selectedTemplate) return `https://creator.hub/${username}`;
    
    switch (selectedTemplate) {
      case "WIFI":
        return `WIFI:S:${wifiSsid};T:${wifiEncryption};P:${wifiPassword};;`;
      case "WHATSAPP":
        return `https://wa.me/${whatsAppPhone.replace(/\s+/g, "")}?text=${encodeURIComponent(whatsAppMessage)}`;
      case "VCARD":
        return `BEGIN:VCARD\nVERSION:3.0\nN:${vCardName}\nORG:${vCardOrg}\nTITLE:${vCardTitle}\nTEL:${vCardPhone}\nEMAIL:${vCardEmail}\nURL:${vCardUrl || `https://creator.hub/${username}`}\nEND:VCARD`;
      default:
        return qrValueText || `https://creator.hub/${username}`;
    }
  }, [selectedTemplate, wifiSsid, wifiPassword, wifiEncryption, whatsAppPhone, whatsAppMessage, vCardName, vCardOrg, vCardTitle, vCardPhone, vCardEmail, vCardUrl, qrValueText, username]);

  const computedLinkValue = useMemo(() => {
    if (!linkSelectedTemplate) return "";
    
    switch (linkSelectedTemplate) {
      case "WIFI":
        return `WIFI:S:${wifiSsid};T:${wifiEncryption};P:${wifiPassword};;`;
      case "WHATSAPP":
        return `https://wa.me/${whatsAppPhone.replace(/\s+/g, "")}?text=${encodeURIComponent(whatsAppMessage)}`;
      case "VCARD":
        return `BEGIN:VCARD\nVERSION:3.0\nN:${vCardName}\nORG:${vCardOrg}\nTITLE:${vCardTitle}\nTEL:${vCardPhone}\nEMAIL:${vCardEmail}\nURL:${vCardUrl || `https://creator.hub/${username}`}\nEND:VCARD`;
      default:
        return newUrl || "";
    }
  }, [linkSelectedTemplate, wifiSsid, wifiPassword, wifiEncryption, whatsAppPhone, whatsAppMessage, vCardName, vCardOrg, vCardTitle, vCardPhone, vCardEmail, vCardUrl, newUrl, username]);

  const [isPending, startTransition] = useTransition();
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const qrRef = useRef<HTMLDivElement>(null);

  const [lang, setLang] = useState<"tr" | "en">("en");
  const [activeTheme, setActiveTheme] = useState<"dark" | "light">("dark");

  const handleStateChange = (state: { lang: "tr" | "en"; theme: "dark" | "light" }) => {
    setLang(state.lang);
    setActiveTheme(state.theme);
  };

  const handleCreateQr = async () => {
    if (!qrName.trim()) {
      alert(lang === "tr" ? "Lütfen QR koduna bir isim verin." : "Please name your QR code.");
      return;
    }

    startTransition(async () => {
      try {
        const newQr = await createQrCode(
          initialUser.id,
          qrName,
          selectedTemplate!,
          computedQrValue,
          isPremium ? qrFgColor : "#000000",
          isPremium ? qrBgColor : "#ffffff",
          qrIncludeLogo && isPremium ? (qrLogoFile || "watermark") : undefined
        );
        
        // Update local QRs state
        setQrCodes((prev) => [
          {
            id: newQr.id,
            name: newQr.name,
            type: newQr.type,
            value: newQr.value,
            fgColor: newQr.fgColor,
            bgColor: newQr.bgColor,
            logoUrl: newQr.logoUrl,
            createdAt: newQr.createdAt.toISOString(),
          },
          ...prev
        ]);
        setSuccessMsg(lang === "tr" ? "QR Kod başarıyla oluşturuldu!" : "QR Code successfully generated!");
        
        // Reset states
        setQrMode("catalog");
        setSelectedTemplate(null);
        setQrName("");
        setQrValueText("");
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
      } catch (err: any) {
        setErrorMsg(err.message || "An error occurred.");
      }
    });
  };

  const handleDeleteQr = async (qrId: string) => {
    if (!confirm(lang === "tr" ? "Bu QR kodunu silmek istediğinizden emin misiniz?" : "Are you sure you want to delete this QR code?")) {
      return;
    }

    startTransition(async () => {
      try {
        await deleteQrCode(initialUser.id, qrId);
        setQrCodes((prev) => prev.filter((q) => q.id !== qrId));
        setSuccessMsg(lang === "tr" ? "QR Kod silindi." : "QR Code deleted.");
      } catch (err: any) {
        setErrorMsg(err.message || "An error occurred.");
      }
    });
  };

  const isDark = activeTheme === "dark";

  // Translations
  const t = {
    // Top Bar
    creatorStudioTitle: lang === "tr" ? "KREATÖR STÜDYOSU" : "CREATOR STUDIO",
    creatorStudioDesc: lang === "tr" ? "Dijital dünyanızı özelleştirin, analiz edin ve ürünlerinizi yönetin." : "Customize, analyze, and build your digital landing center.",
    adminStudio: lang === "tr" ? "Admin Paneli" : "Admin Studio",
    billingPlans: lang === "tr" ? "Planlar & Faturalar" : "Billing & Plans",
    liveSite: lang === "tr" ? "Profili Gör" : "Live Site",

    // Tabs
    tabEditor: lang === "tr" ? "Link & Tema Editörü" : "Link & Theme Editor",
    tabAnalytics: lang === "tr" ? "Trafik Analizleri" : "Traffic Analytics",
    tabQr: lang === "tr" ? "Dinamik QR Kodu" : "Dynamic QR Code",
    tabSeo: lang === "tr" ? "SEO & Domain Ayarları" : "SEO & Domain Settings",
    tabShop: lang === "tr" ? "Dijital Mağaza" : "Digital Shop",
    tabApi: lang === "tr" ? "Geliştirici API" : "Developer API",

    // Editor Panel
    profileCustomizer: lang === "tr" ? "Profil Özelleştirici" : "Profile Customizer",
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

    // Analytics
    performanceInsights: lang === "tr" ? "Performans İstatistikleri" : "Performance Insights",
    trafficOverTime: lang === "tr" ? "Zaman İçindeki Ziyaret ve Tıklanmalar" : "Views & Clicks Over Time",
    simTraffic: lang === "tr" ? "Trafik Simülasyonu Çalıştır" : "Simulate Traffic Action",
    totalViews: lang === "tr" ? "Toplam Profil Ziyareti" : "Total Profile Views",
    totalClicks: lang === "tr" ? "Toplam Link Tıklanması" : "Total Link Clicks",
    referrers: lang === "tr" ? "Ziyaret Kaynakları (Referrers)" : "Referral Traffic",
    devices: lang === "tr" ? "Cihaz Türleri" : "Devices",
    browsers: lang === "tr" ? "Kullanılan Tarayıcılar" : "Browsers",
    countries: lang === "tr" ? "Ziyaretçi Ülkeleri" : "Countries",

    // QR Tab
    qrTitle: lang === "tr" ? "Dinamik QR Kod Oluşturucu" : "Dynamic QR Code Generator",
    qrDesc: lang === "tr" ? "Kreatör profilinize yönlendiren yüksek çözünürlüklü dynamic QR kodları tasarlayın." : "Design custom interactive QR codes pointing directly to your creative hub.",
    qrColors: lang === "tr" ? "Renk Seçimi & Özelleştirme" : "QR Color Settings & Branding",
    qrFg: lang === "tr" ? "QR Kod Rengi" : "QR Foreground Color",
    qrBg: lang === "tr" ? "QR Arka Plan Rengi" : "QR Background Color",
    qrLogoText: lang === "tr" ? "Logo Yükleme & Yerleştirme (Premium)" : "Logo Customizer & Asset Upload (Premium)",
    qrLogoDesc: lang === "tr" ? "QR kodunuzun tam merkezine yerleştirmek için şeffaf bir PNG logo yükleyin." : "Upload a PNG logo asset to display directly in the center of your generated QR code grid.",
    qrLogoBtn: lang === "tr" ? "Logo Resmini Seç" : "Select Brand Logo",
    qrLogoRemove: lang === "tr" ? "Logoyu Kaldır" : "Remove Logo",
    qrLogoActive: lang === "tr" ? "Logoyu QR Koda Dahil Et" : "Include Logo Overlay",
    qrDownloadRes: lang === "tr" ? "İndirme Çözünürlüğü (Genişlik/Yükseklik)" : "Target Resolution for Download (Width/Height)",
    qrDownloadPNG: lang === "tr" ? "PNG Formatında İndir (400px - 2000px)" : "Download High-Res PNG (400px - 2000px)",
    qrDownloadSVG: lang === "tr" ? "SVG Formatında İndir" : "Download SVG Vector",
    qrPreview: lang === "tr" ? "Dinamik QR Kod Önizleme" : "Dynamic QR Code Sandbox",

    // SEO Tab
    seoEngine: lang === "tr" ? "Arama Motoru Optimizasyonu (SEO)" : "Search Engine Optimization (SEO)",
    seoDesc: lang === "tr" ? "Google arama sonuçlarındaki görünürlüğünüzü ve meta etiketlerinizi düzenleyin." : "Fine-tune how search crawlers interpret your hub's metadata and descriptions.",
    seoTitleLabel: lang === "tr" ? "Arama Motoru Başlığı (SEO Title)" : "SEO Title Meta",
    seoTitleDesc: lang === "tr" ? "Arama sonuçlarında görünecek ana başlık." : "Appears as the search snippet title.",
    seoMetaDesc: lang === "tr" ? "Meta Açıklaması (Meta Description)" : "SEO Description Meta",
    seoMetaPlaceholder: lang === "tr" ? "Profilinizi arama motorlarında tanıtan 160 karakterlik açıklama..." : "Provide a clean description summarizing your creative portfolio...",
    seoKeywordsLabel: lang === "tr" ? "SEO Anahtar Kelimeler (Virgülle ayırın)" : "SEO Meta Keywords (Comma separated)",
    seoKeywordsPlaceholder: lang === "tr" ? "beatmaker, preset, muzisyen..." : "beatmaker, presets, loops...",
    customDomainLabel: lang === "tr" ? "Özel Domain Eşleme (Custom Domain)" : "Custom Domain Mapping (Enterprise)",
    customDomainPlaceholder: lang === "tr" ? "link.kendiadresiniz.com" : "link.mybrand.com",
    saveSeo: lang === "tr" ? "SEO Ayarlarını Kaydet" : "Save SEO & Domain Parameters",

    // Shop Tab
    shopInventory: lang === "tr" ? "Dijital Ürün Mağazası ve Envanter" : "Digital Shop Catalog & Inventory",
    shopInventoryDesc: lang === "tr" ? "Sanal envanterinize beat, preset, e-kitap veya ders paketleri ekleyerek anında satmaya başlayın." : "Add music beats, visual presets, sample loops, or instructional files directly to start collecting digital sales.",
    productTitleLabel: lang === "tr" ? "Ürün Başlığı" : "Product Title",
    productTitlePlaceholder: lang === "tr" ? "Örn: Chill Trap Loop Kit v1" : "e.g. Cyberpunk Sample Pack vol 1",
    productPriceLabel: lang === "tr" ? "Satış Fiyatı (TL)" : "Target Price (₺)",
    productTypeLabel: lang === "tr" ? "Ürün Kategorisi" : "Product Category / Type",
    productDescLabel: lang === "tr" ? "Ürün Açıklaması" : "Product Description",
    productDescPlaceholder: lang === "tr" ? "Satın alan kişinin göreceği kısa açıklama..." : "Let buyers know what's included inside...",
    productFileLabel: lang === "tr" ? "İndirilebilir Dosya URL Adresi" : "Downloadable Target File URL",
    productFilePlaceholder: lang === "tr" ? "https://dropbox.com/s/kitap.zip" : "https://dropbox.com/s/myfiles.zip",
    listProductBtn: lang === "tr" ? "Ürünü Mağazada Yayınla" : "List Product in Catalog",
    liveCatalog: lang === "tr" ? "Yayınlanan Aktif Mağaza Envanteriniz" : "Active listed catalog",
    noProducts: lang === "tr" ? "Henüz mağazaya dijital ürün yüklenmemiş." : "No digital products listed yet.",
    salesCountText: lang === "tr" ? "Satış adeti" : "Sales count",

    // API Tab
    developerApi: lang === "tr" ? "Geliştirici API Entegrasyonu" : "Developer API Integrations",
    developerApiDesc: lang === "tr" ? "Kreatör profil istatistiklerinizi ve envanterinizi kendi internet sitenize veya özel panellere entegre edin." : "Securely retrieve your live creative hub's views, links analytics, and products inventory from external dashboards.",
    apiKeys: lang === "tr" ? "Geliştirici API Erişim Anahtarları" : "Secret Read-Only API Keys",
    jsonSimulator: lang === "tr" ? "Gerçek Zamanlı JSON Yanıt Simülatörü" : "Analytics JSON Response Simulator",
    sandboxPreview: lang === "tr" ? "Canlı Kreatör Sayfa Sandbox Önizlemesi" : "Live Creator Hub Sandbox View",
  };

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
        const typeParam = linkSelectedTemplate || "WEBSITE";
        
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
            metadata: metaString
          }
        ]);
        
        setNewTitle("");
        setNewUrl("");
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
        await updateProfile(initialUser.id, bio, theme, username, avatarUrl, background, fontStyle, bioColor, usernameColor);
        setSuccessMsg(lang === "tr" ? "Profil ayarlarınız başarıyla kaydedildi!" : "Profile saved successfully!");
      } catch (err: any) {
        setErrorMsg(err.message || "Failed to save profile");
      }
    });
  };

  const handleSaveSeo = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    startTransition(async () => {
      try {
        await saveSeoProfile(initialUser.id, seoTitle, seoDescription, seoKeywords);
        setSuccessMsg("SEO parameters saved successfully!");
      } catch (err: any) {
        setErrorMsg(err.message || "Failed to save SEO");
      }
    });
  };

  const handleSaveDomain = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    startTransition(async () => {
      try {
        await saveCustomDomain(initialUser.id, customDomain);
        setSuccessMsg("Custom domain configuration updated successfully!");
      } catch (err: any) {
        setErrorMsg(err.message || "Failed to save custom domain");
      }
    });
  };

  const handleMockTraffic = () => {
    setErrorMsg("");
    setSuccessMsg("");

    startTransition(async () => {
      try {
        await generateMockTraffic(initialUser.id);
        setSuccessMsg("Simulated traffic logs successfully generated! Refreshing page charts...");
        // Fast reload page
        window.location.reload();
      } catch (err: any) {
        setErrorMsg(err.message || "Mock traffic generation failed");
      }
    });
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodTitle || !prodPrice || !prodFileUrl) return;

    setErrorMsg("");
    setSuccessMsg("");

    startTransition(async () => {
      try {
        await addProduct(
          initialUser.id,
          prodTitle,
          prodType,
          Number(prodPrice),
          prodDesc,
          prodFileUrl
        );
        const tempId = Math.random().toString();
        setProducts([
          {
            id: tempId,
            title: prodTitle,
            type: prodType,
            price: Number(prodPrice),
            description: prodDesc || null,
            fileUrl: prodFileUrl,
            isActive: true,
            salesCount: 0,
            createdAt: new Date().toISOString()
          },
          ...products
        ]);
        setProdTitle("");
        setProdPrice("");
        setProdType("BEAT");
        setProdDesc("");
        setProdFileUrl("");
        setSuccessMsg("Product listed successfully!");
      } catch (err: any) {
        setErrorMsg(err.message || "Failed to add product");
      }
    });
  };

  const handleDeleteProduct = async (id: string) => {
    setErrorMsg("");
    setSuccessMsg("");

    startTransition(async () => {
      try {
        await deleteProduct(id);
        setProducts(products.filter((p) => p.id !== id));
        setSuccessMsg("Product deleted successfully!");
      } catch (err: any) {
        setErrorMsg("Failed to delete product");
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

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setQrLogoFile(event.target.result as string);
          setQrIncludeLogo(true);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveLogo = () => {
    setQrLogoFile(null);
    setQrIncludeLogo(false);
  };

  const handleDownloadPNG = () => {
    if (!qrRef.current) return;
    const svgElement = qrRef.current.querySelector("svg");
    if (!svgElement) return;

    const svgString = new XMLSerializer().serializeToString(svgElement);
    const svgBlob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
    const URL = window.URL || window.webkitURL || window;
    const blobURL = URL.createObjectURL(svgBlob);
    
    const image = new window.Image();
    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = qrDownloadSize;
      canvas.height = qrDownloadSize;
      const context = canvas.getContext("2d");
      if (context) {
        context.fillStyle = isPremium ? qrBgColor : "#ffffff";
        context.fillRect(0, 0, qrDownloadSize, qrDownloadSize);
        context.drawImage(image, 0, 0, qrDownloadSize, qrDownloadSize);
        const pngURL = canvas.toDataURL("image/png");
        const downloadLink = document.createElement("a");
        downloadLink.href = pngURL;
        downloadLink.download = `qr-code-${username || "profile"}-${qrDownloadSize}x${qrDownloadSize}.png`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
      }
    };
    image.src = blobURL;
  };

  const handleDownloadSVG = () => {
    if (!qrRef.current) return;
    const svgElement = qrRef.current.querySelector("svg");
    if (!svgElement) return;

    const svgString = new XMLSerializer().serializeToString(svgElement);
    const svgBlob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
    const URL = window.URL || window.webkitURL || window;
    const blobURL = URL.createObjectURL(svgBlob);

    const downloadLink = document.createElement("a");
    downloadLink.href = blobURL;
    downloadLink.download = `qr-code-${username || "profile"}.svg`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  // ==========================================
  // METRICS & ANALYTICS AGGREGATIONS
  // ==========================================
  const totalViews = initialPageViews.length;
  const totalClicks = useMemo(() => {
    return links.reduce((sum, link) => sum + (link.clicks?.length || 0), 0);
  }, [links]);

  const averageCTR = useMemo(() => {
    if (totalViews === 0) return 0;
    return Number(((totalClicks / totalViews) * 100).toFixed(1));
  }, [totalViews, totalClicks]);

  // Aggregate pageviews and clicks by date
  const chartData = useMemo(() => {
    const datesMap: { [key: string]: { date: string; Views: number; Clicks: number } } = {};
    
    // Fill past 30 days with zeros so the chart looks continuous
    const now = new Date();
    for (let i = 30; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(now.getDate() - i);
      const dateString = d.toLocaleDateString("tr-TR", { month: "short", day: "numeric" });
      datesMap[dateString] = { date: dateString, Views: 0, Clicks: 0 };
    }

    initialPageViews.forEach((pv) => {
      const dateString = new Date(pv.createdAt).toLocaleDateString("tr-TR", { month: "short", day: "numeric" });
      if (datesMap[dateString]) {
        datesMap[dateString].Views += 1;
      }
    });

    links.forEach((link) => {
      link.clicks?.forEach((c) => {
        const dateString = new Date(c.createdAt).toLocaleDateString("tr-TR", { month: "short", day: "numeric" });
        if (datesMap[dateString]) {
          datesMap[dateString].Clicks += 1;
        }
      });
    });

    return Object.values(datesMap);
  }, [initialPageViews, links]);

  // Pie chart aggregations
  const aggregateMetric = (items: any[], key: string) => {
    const map: { [key: string]: number } = {};
    items.forEach((item) => {
      const val = item[key] || "Unknown";
      map[val] = (map[val] || 0) + 1;
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  };

  const deviceData = useMemo(() => aggregateMetric(initialPageViews, "device"), [initialPageViews]);
  const browserData = useMemo(() => aggregateMetric(initialPageViews, "browser"), [initialPageViews]);
  const countryData = useMemo(() => aggregateMetric(initialPageViews, "country"), [initialPageViews]);
  const referrerData = useMemo(() => {
    const data = aggregateMetric(initialPageViews, "referrer");
    return data.sort((a, b) => b.value - a.value).slice(0, 5); // top 5
  }, [initialPageViews]);

  // Colors for Recharts
  const COLORS = ["#a855f7", "#ec4899", "#10b981", "#3b82f6", "#f59e0b", "#6366f1"];

  // Theme styles for Simulator
  const getThemePreviewStyles = (themeId: string) => {
    switch (themeId) {
      case "neon-purple":
        return {
          bg: "bg-gradient-to-b from-purple-950 via-zinc-950 to-black",
          card: "bg-purple-950/20 border-teal-500/30 text-purple-200 shadow-[0_0_10px_rgba(168,85,247,0.1)] hover:border-purple-400",
          glowText: "text-teal-500 font-extrabold tracking-wide",
          avatarBg: "from-purple-500 to-pink-500",
        };
      case "glow-green":
        return {
          bg: "bg-gradient-to-b from-emerald-950/50 via-zinc-950 to-black",
          card: "bg-emerald-950/20 border-emerald-500/30 text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.1)] hover:border-emerald-400",
          glowText: "text-emerald-400 font-extrabold tracking-wide",
          avatarBg: "from-emerald-500 to-teal-500",
        };
      case "pink-retro":
        return {
          bg: "bg-gradient-to-b from-pink-950/50 via-zinc-950 to-black",
          card: "bg-pink-950/20 border-pink-500/30 text-pink-200 shadow-[0_0_10px_rgba(244,63,94,0.1)] hover:border-pink-400",
          glowText: "text-pink-400 font-extrabold tracking-wide",
          avatarBg: "from-pink-500 to-rose-500",
        };
      case "glassmorphism":
        return {
          bg: "bg-slate-950 text-slate-900",
          card: "bg-white/10 border border-white/20 backdrop-blur-md text-slate-900 shadow-lg hover:bg-white/20",
          glowText: "text-slate-900 font-extrabold tracking-wide drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]",
          avatarBg: "from-purple-500/50 to-pink-500/50",
        };
      case "brutalism":
        return {
          bg: "bg-[#facc15] text-black",
          card: "bg-white border-4 border-black rounded-none shadow-brutal-sm text-black font-extrabold hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all",
          glowText: "text-black font-black tracking-tighter uppercase",
          avatarBg: "from-zinc-900 to-black",
        };
      case "terminal":
        return {
          bg: "bg-black text-[#22c55e] font-mono",
          card: "bg-black border-2 border-[#22c55e] rounded-none text-[#22c55e] font-mono hover:bg-[#22c55e]/10",
          glowText: "text-[#22c55e] font-mono font-bold tracking-widest uppercase",
          avatarBg: "from-zinc-950 to-zinc-900 border-[#22c55e]",
        };
      default:
        return {
          bg: "bg-black",
          card: "bg-gray-50 border-gray-100 text-zinc-200 hover:border-zinc-700",
          glowText: "text-slate-900",
          avatarBg: "from-zinc-800 to-zinc-700",
        };
    }
  };

  const previewStyles = getThemePreviewStyles(theme);

  // Check plan levels
  const isPremium = simulatedPlan !== "FREE";
  const isCreator = simulatedPlan === "CREATOR" || simulatedPlan === "PRO_BUSINESS";

  const renderSimulator = () => {
    return (
      <div className="hidden lg:block w-[360px] shrink-0 sticky top-32 self-start">
        <div className="text-center mb-4">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wider ${
            "bg-white border-zinc-200 text-zinc-700 shadow-sm"
          }`}>
            <Laptop className="h-3 w-3" />
            {t.sandboxPreview}
          </span>
        </div>

        <div className={`relative mx-auto rounded-[3rem] p-4 border-4 shadow-[0_0_50px_rgba(0,0,0,0.15)] overflow-hidden ${
          "bg-white border-zinc-200"
        }`}>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-gray-50 rounded-b-xl z-20" />

          {(() => {
            const isCustomImg = background?.startsWith("custom-img::");
            const isCustomVideo = background?.startsWith("custom-video::");
            const customImgUrl = isCustomImg ? background.replace("custom-img::", "") : null;
            const customVideoUrl = isCustomVideo ? background.replace("custom-video::", "") : null;
            const bgClassName = (!isCustomImg && !isCustomVideo && background) ? background : (!isCustomImg && !isCustomVideo ? previewStyles.bg : "");

            return (
              <div 
                className={`relative rounded-[2.5rem] aspect-[9/18] overflow-hidden p-6 flex flex-col justify-between transition-all duration-300 ${bgClassName}`}
                style={{
                  fontFamily: fontStyle,
                  ...(customImgUrl ? { backgroundImage: `url(${customImgUrl})`, backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat" } : {})
                }}
              >
                {customVideoUrl && (
                  <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover pointer-events-none z-0"
                    src={customVideoUrl}
                  />
                )}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] pointer-events-none z-[1]" />

                <div className="space-y-4 pt-10 text-center relative z-10">
                  <div className={`w-20 h-20 rounded-full bg-gradient-to-tr ${previewStyles.avatarBg} mx-auto border-2 border-white/10 flex items-center justify-center overflow-hidden`}>
                    {avatarUrl ? (
                      <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <User className="h-10 w-10 text-slate-900" />
                    )}
                  </div>
                  <div className="space-y-1">
                    <h3 
                      style={usernameColor ? { color: usernameColor } : undefined}
                      className={`text-base font-bold transition-all ${previewStyles.glowText}`}
                    >
                      @{username || "username"}
                    </h3>
                    <p 
                      style={bioColor ? { color: bioColor } : undefined}
                      className="text-slate-500 text-xs px-4 truncate max-w-full"
                    >
                      {bio || "Enter profile bio details..."}
                    </p>
                  </div>
                </div>

                <div className="space-y-3.5 my-auto overflow-y-auto max-h-[250px] relative z-10 px-2 scrollbar-none">
                  {links.filter((l) => l.isActive).length === 0 ? (
                    <div className="text-center py-8 text-xs text-zinc-600 font-semibold italic border border-dashed border-gray-100 rounded-xl">
                      No active links published
                    </div>
                  ) : (
                    links
                      .filter((l) => l.isActive)
                      .map((link) => {
                        let blockMeta: any = {};
                        if (link.metadata) {
                          try {
                            blockMeta = JSON.parse(link.metadata);
                          } catch (e) {}
                        }

                        const customStyle: React.CSSProperties = {
                          backgroundColor: link.bgColor || undefined,
                          color: link.textColor || undefined,
                          borderColor: link.borderColor || undefined,
                          borderStyle: link.borderStyle as any || undefined,
                          borderWidth: link.borderWidth || undefined,
                          borderRadius: link.borderRadius || undefined,
                          boxShadow: link.shadow === "glow-purple" ? "0 0 15px rgba(168,85,247,0.5)"
                                   : link.shadow === "glow-emerald" ? "0 0 15px rgba(16,185,129,0.5)"
                                   : link.shadow === "soft" ? "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)"
                                   : link.shadow === "hard-3d" ? "4px 4px 0px 0px rgba(0,0,0,1)"
                                   : undefined,
                        };

                        const dynamicBlockClass = `${
                          !link.bgColor ? previewStyles.card : ""
                        } ${!link.borderRadius ? (theme === "brutalism" || theme === "terminal" ? "rounded-none" : "rounded-xl") : ""} ${link.animation || ""} ${
                          link.fontWeight === "font-normal" ? "font-normal"
                          : link.fontWeight === "font-medium" ? "font-medium"
                          : link.fontWeight === "font-bold" ? "font-bold"
                          : link.fontWeight === "font-black" ? "font-black"
                          : "font-bold"
                        }`;

                        if (link.blockType === "VIDEO_PLAYER") {
                          return (
                            <VideoPlayer
                              key={link.id}
                              title={link.title}
                              url={link.url}
                              isDark={isDark}
                              boxStyle={customStyle}
                              className={dynamicBlockClass}
                            />
                          );
                        }

                        if (link.blockType === "BEFORE_AFTER") {
                          return (
                            <BeforeAfterSlider
                              key={link.id}
                              title={link.title}
                              beforeImage={blockMeta.beforeImage || ""}
                              afterImage={blockMeta.afterImage || ""}
                              isDark={isDark}
                              boxStyle={customStyle}
                              className={dynamicBlockClass}
                            />
                          );
                        }

                        if (link.blockType === "AUDIO_PLAYER") {
                          return (
                            <AudioPlayer
                              key={link.id}
                              title={link.title}
                              url={link.url}
                              isDark={isDark}
                              boxStyle={customStyle}
                              className={dynamicBlockClass}
                            />
                          );
                        }

                        // Standard text link preview
                        return (
                          <div
                            key={link.id}
                            style={customStyle}
                            className={`w-full p-2.5 border text-left text-xs transition-all flex items-center gap-3 backdrop-blur-md cursor-pointer ${dynamicBlockClass}`}
                          >
                            <div className="h-6 w-6 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100/50">
                              {getLinkIconHelper(link.type, link.url)}
                            </div>
                            <span className="truncate flex-1" style={link.textColor ? { color: link.textColor } : undefined}>{link.title}</span>
                          </div>
                        );
                      })
                  )}
                </div>

                <div className="text-center text-[9px] text-zinc-600 uppercase tracking-widest font-black py-4 border-t border-gray-100 relative z-10">
                  CREATOR.HUB
                </div>
              </div>
            );
          })()}
        </div>
      </div>
    );
  };

  return (
    <div className={`min-h-screen transition-colors duration-500 p-6 max-w-7xl mx-auto flex flex-col gap-6 font-corporate ${
      "bg-white text-zinc-900"
    }`}>
      <GlobalOverlayManager onStateChange={handleStateChange} />

      {/* Top Header */}
      <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-6 ${
        "border-zinc-200"
      }`}>
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-3xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-fuchsia-500">
              {t.creatorStudioTitle}
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-teal-400/20 border border-teal-500/30 text-[9px] font-extrabold text-teal-500 uppercase tracking-widest">
              {initialUser.plan}
            </span>
          </div>
          <p className={"text-slate-500 text-sm"}>{t.creatorStudioDesc}</p>
        </div>

        <div className="flex items-center gap-2">
          {initialUser.role === "ADMIN" && (
            <Link
              href="/admin"
              className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-red-950/20 border border-red-500/20 hover:border-red-400 text-red-400 text-xs font-bold transition-all"
            >
              <span>{t.adminStudio}</span>
            </Link>
          )}

          <Link
            href="/dashboard/billing"
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full border text-xs font-semibold transition-all ${
              "bg-white border-zinc-200 hover:border-zinc-300 text-zinc-700 shadow-sm"
            }`}
          >
            <span>{t.billingPlans}</span>
          </Link>

          {username && (
            <a
              href={`/${username}`}
              target="_blank"
              rel="noreferrer"
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full border text-xs font-semibold transition-all ${
                "bg-white border-zinc-200 hover:border-zinc-300 text-zinc-700 shadow-sm"
              }`}
            >
              <span>{t.liveSite}</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          )}

          {/* Logout Button */}
          <SignOutButton>
            <button
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full border text-xs font-semibold transition-all ${
                "bg-red-50 border-red-200 hover:bg-red-100 text-red-600 shadow-sm"
              }`}
            >
              <span>{lang === "tr" ? "Çıkış Yap" : "Sign Out"}</span>
            </button>
          </SignOutButton>

        </div>
      </div>

      {/* Dynamic Tab Bar */}
      <div className={`flex gap-2 border-b pb-3 overflow-x-auto scrollbar-none ${
        "border-zinc-200"
      }`}>
        <button
          onClick={() => setActiveTab("editor")}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all border cursor-pointer ${
            activeTab === "editor"
              ? "bg-teal-500 border-teal-500 text-white shadow-sm"
              : "bg-white border-zinc-200 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
          }`}
        >
          <Laptop className="h-3.5 w-3.5" />
          {t.tabEditor}
        </button>

        <button
          onClick={() => {
            if (simulatedPlan === "FREE") {
              triggerUpgradeModal(
                lang === "tr" ? "Gelişmiş Analitik Kilitli 🔒" : "Advanced Analytics Locked 🔒",
                lang === "tr"
                  ? "Detaylı trafik analizleri, cihaz/tarayıcı raporları ve coğrafi istatistikler Premium plana özeldir. Hemen yükseltin!"
                  : "Detailed traffic analytics, device reports and country breakdown are exclusive to our Premium plans. Upgrade now to unlock!"
              );
              return;
            }
            setActiveTab("analytics");
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all border cursor-pointer ${
            activeTab === "analytics"
              ? "bg-teal-500 border-teal-500 text-white shadow-sm"
              : "bg-white border-zinc-200 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
          }`}
        >
          <TrendingUp className="h-3.5 w-3.5" />
          {t.tabAnalytics}
          {simulatedPlan === "FREE" && <Lock className="h-3 w-3 text-teal-500 shrink-0" />}
        </button>

        <button
          onClick={() => setActiveTab("qr")}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all border cursor-pointer ${
            activeTab === "qr"
              ? "bg-teal-500 border-teal-500 text-white shadow-sm"
              : "bg-white border-zinc-200 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
          }`}
        >
          <QrCode className="h-3.5 w-3.5" />
          {t.tabQr}
        </button>

        <button
          onClick={() => setActiveTab("seo")}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all border cursor-pointer ${
            activeTab === "seo"
              ? "bg-teal-500 border-teal-500 text-white shadow-sm"
              : "bg-white border-zinc-200 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
          }`}
        >
          <Globe className="h-3.5 w-3.5" />
          {t.tabSeo}
        </button>

        <button
          onClick={() => setActiveTab("templates")}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all border cursor-pointer ${
            activeTab === "templates"
              ? "bg-teal-500 border-teal-500 text-white shadow-sm"
              : "bg-white border-zinc-200 text-zinc-650 hover:bg-zinc-100 hover:text-zinc-900"
          }`}
        >
          <Palette className="h-3.5 w-3.5" />
          {lang === "tr" ? "Şablonlarım" : "My Templates"}
        </button>

        </div>

      {/* Global Notifications */}
      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-950/20 border border-red-500/20 text-red-400 text-sm font-semibold">
          {errorMsg}
        </div>
      )}
      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/20 text-emerald-400 text-sm font-semibold">
          {successMsg}
        </div>
      )}

      {/* Core Tabs Workspaces */}
      <div className="flex flex-col lg:flex-row gap-8 w-full items-start justify-start">
        
        {/* LEFT COLUMN: ACTIVE WORKSPACE CONTENT */}
        <div className="flex-1 space-y-8 max-w-3xl w-full">
          
          {/* TAB 1: LINKS & THEME EDITOR */}
          {activeTab === "editor" && (
            <div className="w-full space-y-8 animate-in fade-in slide-in-from-bottom-3 duration-350">
              
              {/* SUB-TABS NAVIGATION */}
              <div className="flex gap-2 p-1.5 bg-zinc-100 rounded-2xl border border-zinc-200">
                <button
                  type="button"
                  onClick={() => setActiveSubTab("links")}
                  className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                    activeSubTab === "links"
                      ? "bg-white text-zinc-950 shadow-sm"
                      : "text-zinc-650 hover:text-zinc-950"
                  }`}
                >
                  <Plus className="h-3.5 w-3.5 text-teal-500" />
                  {lang === "tr" ? "Linkler" : "Links"}
                </button>
                <button
                  type="button"
                  onClick={() => setActiveSubTab("appearance")}
                  className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
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
                  className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                    activeSubTab === "profile"
                      ? "bg-white text-zinc-950 shadow-sm"
                      : "text-zinc-650 hover:text-zinc-950"
                  }`}
                >
                  <User className="h-3.5 w-3.5 text-teal-500" />
                  {lang === "tr" ? "Profil" : "Profile"}
                </button>
              </div>

              {/* SUB-TAB CONTENT: PROFILE */}
              {activeSubTab === "profile" && (
                <div className="w-full space-y-8 animate-in fade-in duration-200">
                  {/* Profile customizer */}
                  <div className={`p-8 rounded-2xl border space-y-6 ${
                    "bg-white border-zinc-200 shadow-sm"
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <User className="h-5 w-5 text-teal-500" />
                        <h2 className={`font-extrabold text-lg ${"text-zinc-950"}`}>{t.profileCustomizer}</h2>
                      </div>
                      <button
                        onClick={handleSaveProfile}
                        disabled={isPending}
                        className={`flex items-center gap-1.5 px-4.5 py-2.5 rounded-full font-extrabold text-xs transition-all disabled:opacity-50 cursor-pointer ${
                          "bg-zinc-900 text-white hover:bg-zinc-800 shadow-md shadow-zinc-950/15"
                        }`}
                      >
                        {isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
                        {t.saveChanges}
                      </button>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className={`text-xs font-semibold uppercase tracking-wider block ${"text-slate-500"}`}>{t.usernameLabel}</label>
                        <div className={`flex items-center rounded-xl border focus-within:border-teal-500/50 overflow-hidden px-3 ${
                          "bg-zinc-100 border-zinc-200"
                        }`}>
                          <span className="text-slate-500 text-sm">hub.com/</span>
                          <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className={`flex-1 bg-transparent py-2.5 outline-none text-sm ${"text-zinc-900"}`}
                            placeholder="username"
                          />
                        </div>
                      </div>

                      <div className="space-y-2 md:col-span-2">
                        <label className={`text-xs font-semibold uppercase tracking-wider block ${"text-slate-500"}`}>
                          {lang === "tr" ? "Profil Fotoğrafı Yükle" : "Upload Profile Photo"}
                        </label>
                        <div className={`p-5 rounded-xl border flex items-center gap-5 ${
                          "bg-zinc-100 border-zinc-200"
                        }`}>
                          <div className={`w-16 h-16 rounded-full border flex items-center justify-center overflow-hidden shrink-0 ${
                            "bg-white border-zinc-300 shadow-inner"
                          }`}>
                            {avatarUrl ? (
                              <img src={avatarUrl} alt="Preview" className="w-full h-full object-cover" />
                            ) : (
                              <User className="h-6 w-6 text-slate-500" />
                            )}
                          </div>
                          <div className="space-y-1.5">
                            <div className="flex gap-2">
                              <label className={`px-3.5 py-1.5 rounded-lg border text-xs font-bold transition-all cursor-pointer select-none ${
                                "bg-white hover:bg-zinc-55 border-zinc-300 text-zinc-700 shadow-sm"
                              }`}>
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
                                  className={`px-3.5 py-1.5 rounded-lg border text-xs font-bold transition-all cursor-pointer select-none ${
                                    "bg-red-50 hover:bg-red-100 border-red-200 text-red-600"
                                  }`}
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

                      <div className="space-y-2">
                        <label className={`text-xs font-semibold uppercase tracking-wider block ${"text-slate-500"}`}>{t.bioLabel}</label>
                        <textarea
                          value={bio}
                          onChange={(e) => setBio(e.target.value)}
                          className={`w-full px-4 py-2.5 rounded-xl border focus:border-teal-500/50 outline-none text-sm ${
                            "bg-zinc-100 border-zinc-200 text-zinc-900"
                          }`}
                          placeholder={t.bioPlaceholder}
                          rows={2}
                        />
                      </div>

                      {/* Custom Colors Palette Selector */}
                      <div className="space-y-4 md:col-span-2 border-t border-zinc-200/50 pt-5">
                        <h3 className={`text-xs font-black uppercase tracking-wider ${"text-slate-500"}`}>
                          {lang === "tr" ? "Kişisel Renk Paletiniz" : "Personal Typography Color Palette"}
                        </h3>
                        <p className="text-[10px] text-slate-500 font-semibold mt-0.5">
                          {lang === "tr" 
                            ? "@Kullanıcı adı ve Biyografi yazınızın renklerini özgürce seçin. Tüm üyelik planları için tamamen ücretsizdir!" 
                            : "Select custom colors for your username and bio details. 100% unlocked for all membership tiers!"}
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          {/* Username Color Selector */}
                          <div className={`p-4 rounded-xl border space-y-3 ${"bg-zinc-50 border-zinc-200"}`}>
                            <div className="flex justify-between items-center">
                              <label className={`text-[10px] font-black uppercase ${"text-zinc-650"}`}>
                                {lang === "tr" ? "@ Kullanıcı Adı Rengi" : "@ Username Text Color"}
                              </label>
                              
                              {/* Color Hex Input & Custom Color Picker */}
                              <div className="flex items-center gap-1.5">
                                <input 
                                  type="text" 
                                  value={usernameColor} 
                                  onChange={(e) => setUsernameColor(e.target.value)}
                                  className={`w-16 px-1.5 py-0.5 border border-zinc-300/40 rounded bg-transparent font-mono text-[10px] font-bold text-center ${
                                    "text-zinc-800"
                                  }`}
                                />
                                <div className="relative w-5 h-5 rounded-full overflow-hidden border border-white/20 cursor-pointer shrink-0">
                                  <input 
                                    type="color" 
                                    value={usernameColor} 
                                    onChange={(e) => setUsernameColor(e.target.value)}
                                    className="absolute inset-0 w-full h-full p-0 border-none cursor-pointer scale-150"
                                  />
                                </div>
                              </div>
                            </div>

                            {/* Fast Select Brand Palette */}
                            <div className="flex flex-wrap gap-2 pt-1">
                              {["#ffffff", "#000000", "#f59e0b", "#ec4899", "#22c55e", "#a855f7", "#3b82f6", "#ef4444"].map((c) => (
                                <button
                                  key={c}
                                  type="button"
                                  onClick={() => setUsernameColor(c)}
                                  className={`w-6.5 h-6.5 rounded-full border border-white/30 shadow-sm transition-transform cursor-pointer hover:scale-110 ${
                                    usernameColor === c ? "ring-2 ring-purple-500 scale-105" : ""
                                  }`}
                                  style={{ backgroundColor: c }}
                                  title={c}
                                />
                              ))}
                            </div>
                          </div>

                          {/* Bio Color Selector */}
                          <div className={`p-4 rounded-xl border space-y-3 ${"bg-zinc-50 border-zinc-200"}`}>
                            <div className="flex justify-between items-center">
                              <label className={`text-[10px] font-black uppercase ${"text-zinc-650"}`}>
                                {lang === "tr" ? "Biyografi Yazı Rengi" : "Bio Paragraph Color"}
                              </label>

                              {/* Color Hex Input & Custom Color Picker */}
                              <div className="flex items-center gap-1.5">
                                <input 
                                  type="text" 
                                  value={bioColor} 
                                  onChange={(e) => setBioColor(e.target.value)}
                                  className={`w-16 px-1.5 py-0.5 border border-zinc-300/40 rounded bg-transparent font-mono text-[10px] font-bold text-center ${
                                    "text-zinc-800"
                                  }`}
                                />
                                <div className="relative w-5 h-5 rounded-full overflow-hidden border border-white/20 cursor-pointer shrink-0">
                                  <input 
                                    type="color" 
                                    value={bioColor} 
                                    onChange={(e) => setBioColor(e.target.value)}
                                    className="absolute inset-0 w-full h-full p-0 border-none cursor-pointer scale-150"
                                  />
                                </div>
                              </div>
                            </div>

                            {/* Fast Select Brand Palette */}
                            <div className="flex flex-wrap gap-2 pt-1">
                              {["#888888", "#ffffff", "#000000", "#f59e0b", "#ec4899", "#22c55e", "#a855f7", "#3b82f6"].map((c) => (
                                <button
                                  key={c}
                                  type="button"
                                  onClick={() => setBioColor(c)}
                                  className={`w-6.5 h-6.5 rounded-full border border-white/30 shadow-sm transition-transform cursor-pointer hover:scale-110 ${
                                    bioColor === c ? "ring-2 ring-purple-500 scale-105" : ""
                                  }`}
                                  style={{ backgroundColor: c }}
                                  title={c}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* SUB-TAB CONTENT: APPEARANCE */}
              {activeSubTab === "appearance" && (
                <div className="w-full space-y-8 animate-in fade-in duration-200">
                  {/* Yazı Tipi Özelleştirici */}
                  <div className={`p-8 rounded-2xl border space-y-6 ${
                    "bg-white border-zinc-200 shadow-sm"
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Sparkles className="h-5 w-5 text-teal-500" />
                        <div>
                          <h2 className={`font-extrabold text-lg ${"text-zinc-950"}`}>
                            {lang === "tr" ? "Yazı Tipi Özelleştirici" : "Typography Customizer"}
                          </h2>
                          <p className="text-[10px] text-slate-500 font-semibold mt-0.5">
                            {lang === "tr" 
                              ? "Kreatör profilinizin ve bağlantı kartlarınızın yazı tipini değiştirin." 
                              : "Choose custom typography styles for your profile details and link actions."}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={handleSaveProfile}
                        disabled={isPending}
                        className={`flex items-center gap-1.5 px-4.5 py-2.5 rounded-full font-extrabold text-xs transition-all disabled:opacity-50 cursor-pointer ${
                          "bg-zinc-900 text-white hover:bg-zinc-800 shadow-md shadow-zinc-950/15"
                        }`}
                      >
                        {isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
                        {t.saveChanges}
                      </button>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className={`text-xs font-semibold uppercase tracking-wider block ${"text-slate-500"}`}>
                          {lang === "tr" ? "Yazı Tipi Seçin" : "Select Typography Style"}
                        </label>
                        <select
                          value={fontStyle}
                          onChange={(e) => {
                            const selectedVal = e.target.value;
                            const selected = initialFonts.find(f => f.value === selectedVal);
                            if (selected) {
                              const locked = (selected.tier === "STARTER" && simulatedPlan === "FREE") ||
                                             (selected.tier === "CREATOR" && initialUser.plan !== "CREATOR" && initialUser.plan !== "PRO_BUSINESS");
                              if (locked) {
                                setErrorMsg(
                                  lang === "tr"
                                    ? `🔒 "${selected.name}" yazı tipi planınızda kilitlidir. Canlı önizlemede inceleyebilirsiniz, ancak kaydetmek için planınızı yükseltmeniz gerekir!`
                                    : `🔒 "${selected.name}" is locked on your plan. You can view the live preview, but you must upgrade to save changes!`
                                );
                                setSuccessMsg("");
                              } else {
                                setErrorMsg("");
                              }
                              setFontStyle(selectedVal);
                            }
                          }}
                          className={`w-full px-4 py-3.5 rounded-xl border outline-none text-sm font-bold ${
                            "bg-zinc-100 border-zinc-200 text-zinc-900"
                          }`}
                        >
                          <optgroup label={lang === "tr" ? "Ücretsiz Yazı Tipleri (FREE)" : "Free Typography Styles (FREE)"}>
                            {initialFonts.filter(f => f.tier === "FREE").map(f => (
                              <option key={f.value} value={f.value}>
                                {f.giftLabel ? `⭐ ${f.name} (${f.giftLabel})` : f.name}
                              </option>
                            ))}
                          </optgroup>
                          <optgroup label={lang === "tr" ? "Starter Paket Yazı Tipleri (STARTER)" : "Starter Plan Exclusives (STARTER)"}>
                            {initialFonts.filter(f => f.tier === "STARTER").map(f => {
                              const isLocked = simulatedPlan === "FREE";
                              return (
                                <option key={f.value} value={f.value}>
                                  {isLocked ? "🔒 " : ""}{f.name}
                                </option>
                              );
                            })}
                          </optgroup>
                          <optgroup label={lang === "tr" ? "Creator Paket Yazı Tipleri (CREATOR)" : "Creator Deluxe Fonts (CREATOR)"}>
                            {initialFonts.filter(f => f.tier === "CREATOR").map(f => {
                              const isLocked = initialUser.plan !== "CREATOR" && initialUser.plan !== "PRO_BUSINESS";
                              return (
                                <option key={f.value} value={f.value}>
                                  {isLocked ? "🔒 " : ""}{f.name}
                                </option>
                              );
                            })}
                          </optgroup>
                        </select>
                      </div>

                      {/* Canlı Tipografi Önizleme Kartı */}
                      <div className={`p-5 rounded-xl border space-y-2 text-center transition-all ${
                        "bg-zinc-50 border-zinc-150"
                      }`}>
                        <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 block">
                          {lang === "tr" ? "Canlı Yazı Tipi Önizlemesi" : "Typography Live Specimen"}
                        </span>
                        <div 
                          style={{ fontFamily: fontStyle }}
                          className={`text-xl md:text-2xl py-3 font-bold break-words tracking-tight ${"text-purple-750"}`}
                        >
                          Abcde 12345 - {fontStyle} Font Style
                        </div>
                        <p 
                          style={{ fontFamily: fontStyle }}
                          className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed"
                        >
                          {lang === "tr"
                            ? "Hızlı kahverengi tilki tembel köpeğin üstünden atlar. Creator.Hub ile özelleştirilmiş dijital kimliğiniz."
                            : "The quick brown fox jumps over the lazy dog. Your customized digital identity powered by Creator.Hub."}
                        </p>
                      </div>

                      {/* Locked Upgrade Alert banner if active font style selected is above tier */}
                      {(() => {
                        const activeFont = initialFonts.find(f => f.value === fontStyle);
                        const locked = activeFont && (
                          (activeFont.tier === "STARTER" && simulatedPlan === "FREE") ||
                          (activeFont.tier === "CREATOR" && initialUser.plan !== "CREATOR" && initialUser.plan !== "PRO_BUSINESS")
                        );
                        if (!locked || !activeFont) return null;

                        return (
                          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 flex flex-col sm:flex-row items-center justify-between gap-3 text-left">
                            <div className="space-y-0.5">
                              <span className="text-xs font-bold text-amber-400 block uppercase tracking-wider flex items-center gap-1.5">
                                <Lock className="h-3.5 w-3.5" />
                                {lang === "tr" ? "Plan Yükseltme Gerekli" : "Membership Upgrade Required"}
                              </span>
                              <p className="text-[10px] text-slate-500 leading-relaxed font-semibold">
                                {lang === "tr"
                                  ? `"${activeFont.name}" yazı tipi ${activeFont.tier} paketine özeldir. Canlı simülatörde test edebilirsiniz ancak kaydetmek için planınızı yükseltmeniz gerekir.`
                                  : `"${activeFont.name}" is exclusive to the ${activeFont.tier} plan. You can test it live in simulator, but you must upgrade your plan to save changes.`}
                              </p>
                            </div>
                            <Link
                              href="/dashboard/billing"
                              className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-black font-extrabold text-[10px] uppercase rounded-xl transition-all whitespace-nowrap"
                            >
                              {lang === "tr" ? "Şimdi Yükselt" : "Upgrade Now"}
                            </Link>
                          </div>
                        );
                      })()}
                    </div>
                  </div>

              {/* Plan Switcher Simulator Bar */}
              <div className={`p-4 rounded-2xl border flex flex-col md:flex-row items-center justify-between gap-4 ${
                "bg-purple-50 border-purple-200"
              }`}>
                <div className="space-y-0.5">
                  <div className={`flex items-center gap-2 text-xs font-extrabold ${"text-purple-800"}`}>
                    <Sparkles className="h-4 w-4 animate-pulse text-teal-500" />
                    {lang === "tr" ? "Hızlı Plan Simülatörü (Test Modu)" : "Instant Plan Simulator (Testing Mode)"}
                  </div>
                  <p className="text-[10px] text-slate-500 font-semibold">
                    {lang === "tr" ? "Arayüzün ve arka plan sınırlarının değiştiğini görmek için anında plan değiştirin:" : "Toggle your active profile plan in real-time to check locked background sets:"}
                  </p>
                </div>
                <div className="flex gap-2">
                  {["FREE", "STARTER", "CREATOR"]
                    .filter((p) => {
                      if (initialUser.plan === "FREE") return p === "FREE";
                      if (initialUser.plan === "STARTER") return p === "FREE" || p === "STARTER";
                      return true;
                    })
                    .map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setSimulatedPlan(p)}
                        className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all border cursor-pointer select-none ${
                          simulatedPlan === p
                            ? "bg-teal-500 border-teal-500 text-white shadow-md"
                            : "bg-white border-zinc-200 text-zinc-700 hover:bg-zinc-50 shadow-sm"
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                </div>
              </div>

              {/* Refined Custom Backgrounds Selector */}
              <div className={`p-6 rounded-2xl border space-y-4 relative overflow-hidden ${
                "bg-white border-zinc-200 shadow-sm"
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Laptop className="h-5 w-5 text-indigo-400" />
                    <h2 className={`font-extrabold text-lg ${"text-zinc-950"}`}>
                      {lang === "tr" ? "Arka Plan Özelleştirici" : "Background Customizer"}
                    </h2>
                  </div>
                  {background && (
                    <button
                      onClick={() => setBackground("")}
                      className={`px-3 py-1 rounded bg-zinc-850 hover:bg-gray-50 text-zinc-300 font-extrabold text-[10px] transition-all cursor-pointer`}
                    >
                      {lang === "tr" ? "Varsayılana Sıfırla" : "Reset to Default"}
                    </button>
                  )}
                </div>

                {simulatedPlan === "FREE" && (
                  <div className="space-y-3">
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider font-extrabold block">
                      {lang === "tr" ? "Ücretsiz Arka Planlar (5 Adet)" : "Free Plan Backdrops (5 Colors)"}
                    </span>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                      {FREE_BACKGROUNDS.map((bg) => (
                        <button
                          key={bg.id}
                          type="button"
                          onClick={() => setBackground(bg.css)}
                          className={`h-16 rounded-xl border text-left cursor-pointer transition-all flex flex-col justify-end p-2.5 relative overflow-hidden group ${
                            background === bg.css ? "border-indigo-500 ring-2 ring-indigo-500/20" : "border-gray-100"
                          } ${bg.css}`}
                        >
                          <span className="text-[9px] font-bold text-slate-900 z-10 block drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">{bg.name}</span>
                        </button>
                      ))}
                    </div>

                    {/* Locked Custom Upload Button for Free Plan */}
                    <div className={`mt-2 p-4 rounded-xl border border-dashed flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                      "border-zinc-200 bg-zinc-50/50"
                    }`}>
                      <div className="space-y-0.5">
                        <div className={`flex items-center gap-1.5 text-xs font-extrabold ${"text-slate-500"}`}>
                          <Image className="h-3.5 w-3.5" />
                          {lang === "tr" ? "Kendi Fotoğrafını Yükle" : "Upload Custom Photo"}
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-teal-400/10 border border-teal-500/20 text-[8px] text-teal-500 uppercase tracking-wide font-black">
                            <Lock className="h-2 w-2" /> PREMIUM
                          </span>
                        </div>
                        <p className="text-[9px] text-slate-500 font-semibold">
                          {lang === "tr" ? "Kendi arka plan görsellerinizi veya videolarınızı yükleyin" : "Upload your own background images or loops"}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => triggerUpgradeModal(
                          lang === "tr" ? "Özel Arka Plan Kilidi 🔒" : "Custom Background Locked 🔒",
                          lang === "tr"
                            ? "Kendi özel resimlerinizi veya videolarınızı arka plan olarak kullanmak Premium pakete özeldir. Hemen yükseltin!"
                            : "Uploading custom background assets is exclusive to our Premium plans. Upgrade now to unlock!"
                        )}
                        className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-teal-500/30 bg-purple-950/15 hover:bg-purple-900/30 text-teal-500 font-extrabold text-xs transition-all cursor-pointer"
                      >
                        <Lock className="h-3.5 w-3.5" />
                        {lang === "tr" ? "Görsel Yükle" : "Upload Photo"}
                      </button>
                    </div>
                  </div>
                )}

                {simulatedPlan === "STARTER" && (
                  <div className="space-y-3">
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider font-extrabold block">
                      {lang === "tr" ? "Starter Paket Arka Planları (10 Adet)" : "Starter Plan Backdrops (10 Colors)"}
                    </span>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                      {STARTER_BACKGROUNDS.map((bg) => (
                        <button
                          key={bg.id}
                          type="button"
                          onClick={() => setBackground(bg.css)}
                          className={`h-16 rounded-xl border text-left cursor-pointer transition-all flex flex-col justify-end p-2.5 relative overflow-hidden group ${
                            background === bg.css ? "border-indigo-500 ring-2 ring-indigo-500/20" : "border-gray-100"
                          } ${bg.css}`}
                        >
                          <span className="text-[9px] font-bold text-slate-900 z-10 block drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">{bg.name}</span>
                        </button>
                      ))}
                    </div>

                    {/* Starter: Custom Photo Upload */}
                    <div className={`mt-2 p-4 rounded-xl border border-dashed flex flex-col sm:flex-row items-start sm:items-center gap-4 ${
                      "border-zinc-300 bg-zinc-50"
                    }`}>
                      <div className="flex-1 space-y-0.5">
                        <div className={`flex items-center gap-1.5 text-xs font-extrabold ${"text-zinc-700"}`}>
                          <Image className="h-3.5 w-3.5 text-indigo-400" />
                          {lang === "tr" ? "Kendi Fotoğrafını Yükle" : "Upload Custom Photo"}
                        </div>
                        <p className="text-[10px] text-slate-500 font-semibold">
                          {lang === "tr" ? "PNG veya JPEG — Maks. 1 MB" : "PNG or JPEG — Max 1 MB"}
                        </p>
                        {customBgError && (
                          <p className="text-[10px] text-red-400 font-bold mt-1">{customBgError}</p>
                        )}
                      </div>
                      <label className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border cursor-pointer font-extrabold text-xs transition-all select-none ${
                        "bg-indigo-50 hover:bg-indigo-100 border-indigo-200 text-indigo-700"
                      }`}>
                        <Image className="h-3.5 w-3.5" />
                        {lang === "tr" ? "Fotoğraf Seç" : "Choose Photo"}
                        <input
                          type="file"
                          accept="image/png,image/jpeg,image/jpg,image/webp"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            if (file.size > 1 * 1024 * 1024) {
                              setCustomBgError(lang === "tr" ? "Dosya boyutu 1 MB'ı geçemez!" : "File must be under 1 MB!");
                              e.target.value = "";
                              return;
                            }
                            setCustomBgError("");
                            const reader = new FileReader();
                            reader.onload = (ev) => {
                              const dataUrl = ev.target?.result as string;
                              setBackground(`custom-img::${dataUrl}`);
                            };
                            reader.readAsDataURL(file);
                          }}
                        />
                      </label>
                      {background?.startsWith("custom-img::") && (
                        <button
                          type="button"
                          onClick={() => setBackground("")}
                          className="text-[10px] font-black text-slate-500 hover:text-red-400 transition-colors cursor-pointer"
                        >
                          ✕ {lang === "tr" ? "Kaldır" : "Remove"}
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {(simulatedPlan === "CREATOR" || simulatedPlan === "PRO_BUSINESS") && (
                  <div className="space-y-4">
                    <span className="text-[10px] text-teal-500 uppercase tracking-wider font-extrabold block">
                      {lang === "tr" ? "Creator Plana Özel Arka Planlar (20 Adet)" : "Creator Exclusive Backdrops (20 Colors)"}
                    </span>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                      {[...STARTER_BACKGROUNDS, ...CREATOR_BACKGROUNDS].map((bg) => (
                        <button
                          key={bg.id}
                          type="button"
                          onClick={() => setBackground(bg.css)}
                          className={`h-16 rounded-xl border text-left cursor-pointer transition-all flex flex-col justify-end p-2.5 relative overflow-hidden group ${
                            background === bg.css ? "border-teal-500 ring-2 ring-purple-500/20" : "border-gray-100"
                          } ${bg.css}`}
                        >
                          <span className="text-[9px] font-bold text-slate-900 z-10 block drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">{bg.name}</span>
                        </button>
                      ))}
                    </div>

                    {/* Creator: Custom Photo + Video Upload */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {/* Photo Upload */}
                      <div className={`p-4 rounded-xl border border-dashed flex flex-col gap-3 ${
                        "border-purple-200 bg-purple-50/50"
                      }`}>
                        <div className="space-y-0.5">
                          <div className={`flex items-center gap-1.5 text-xs font-extrabold ${"text-purple-700"}`}>
                            <Image className="h-3.5 w-3.5" />
                            {lang === "tr" ? "Özel Fotoğraf Arka Plan" : "Custom Photo Background"}
                          </div>
                          <p className="text-[10px] text-slate-500 font-semibold">
                            {lang === "tr" ? "PNG / JPEG / WebP — Maks. 1 MB" : "PNG / JPEG / WebP — Max 1 MB"}
                          </p>
                          {customBgError && customBgError.includes("foto") && (
                            <p className="text-[10px] text-red-400 font-bold">{customBgError}</p>
                          )}
                        </div>
                        <label className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border cursor-pointer font-extrabold text-xs transition-all select-none ${
                          "bg-purple-100 hover:bg-purple-200 border-purple-300 text-purple-800"
                        }`}>
                          <Image className="h-3.5 w-3.5" />
                          {lang === "tr" ? "Fotoğraf Seç" : "Choose Photo"}
                          <input
                            type="file"
                            accept="image/png,image/jpeg,image/jpg,image/webp"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              if (file.size > 1 * 1024 * 1024) {
                                setCustomBgError(lang === "tr" ? "📷 Fotoğraf 1 MB sınırını aşıyor!" : "📷 Photo exceeds 1 MB limit!");
                                e.target.value = "";
                                return;
                              }
                              setCustomBgError("");
                              const reader = new FileReader();
                              reader.onload = (ev) => {
                                setBackground(`custom-img::${ev.target?.result as string}`);
                              };
                              reader.readAsDataURL(file);
                            }}
                          />
                        </label>
                        {background?.startsWith("custom-img::") && (
                          <button type="button" onClick={() => setBackground("")} className="text-[10px] font-black text-slate-500 hover:text-red-400 transition-colors cursor-pointer text-center">
                            ✕ {lang === "tr" ? "Kaldır" : "Remove"}
                          </button>
                        )}
                      </div>

                      {/* Video Upload */}
                      <div className={`p-4 rounded-xl border border-dashed flex flex-col gap-3 ${
                        "border-amber-200 bg-amber-50/50"
                      }`}>
                        <div className="space-y-0.5">
                          <div className={`flex items-center gap-1.5 text-xs font-extrabold ${"text-amber-700"}`}>
                            <Play className="h-3.5 w-3.5" />
                            {lang === "tr" ? "Özel Video Arka Plan" : "Custom Video Background"}
                          </div>
                          <p className="text-[10px] text-slate-500 font-semibold">
                            {lang === "tr" ? "MP4 / WebM — Maks. 5 MB" : "MP4 / WebM — Max 5 MB"}
                          </p>
                          {customBgError && customBgError.includes("video") && (
                            <p className="text-[10px] text-red-400 font-bold">{customBgError}</p>
                          )}
                        </div>
                        <label className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border cursor-pointer font-extrabold text-xs transition-all select-none ${
                          "bg-amber-100 hover:bg-amber-200 border-amber-300 text-amber-800"
                        }`}>
                          <Play className="h-3.5 w-3.5" />
                          {lang === "tr" ? "Video Seç" : "Choose Video"}
                          <input
                            type="file"
                            accept="video/mp4,video/webm"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              if (file.size > 5 * 1024 * 1024) {
                                setCustomBgError(lang === "tr" ? "🎬 Video 5 MB sınırını aşıyor!" : "🎬 Video exceeds 5 MB limit!");
                                e.target.value = "";
                                return;
                              }
                              setCustomBgError("");
                              const reader = new FileReader();
                              reader.onload = (ev) => {
                                setBackground(`custom-video::${ev.target?.result as string}`);
                              };
                              reader.readAsDataURL(file);
                            }}
                          />
                        </label>
                        {background?.startsWith("custom-video::") && (
                          <button type="button" onClick={() => setBackground("")} className="text-[10px] font-black text-slate-500 hover:text-red-400 transition-colors cursor-pointer text-center">
                            ✕ {lang === "tr" ? "Kaldır" : "Remove"}
                          </button>
                        )}
                      </div>
                    </div>

                    <p className="text-[9px] text-teal-500 font-extrabold italic text-right">
                      {lang === "tr" ? "+ Dahası Çok Yakında! (Creator Hub Plus)" : "+ More Premium Layouts Coming Soon!"}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeSubTab === "links" && (
            <div className="w-full space-y-8 animate-in fade-in duration-200">
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
                  <div className={`p-6 rounded-2xl border space-y-6 ${
                    "bg-white border-zinc-200 shadow-sm"
                  }`}>
                    <div className="flex items-center justify-between">
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
                          className="px-3 py-1 rounded bg-gray-50 hover:bg-zinc-700 text-zinc-300 font-extrabold text-[10px] transition-all cursor-pointer"
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

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
                                className={`p-5 rounded-2xl border text-center flex flex-col items-center justify-center gap-3 transition-all relative group cursor-pointer ${
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
                    <div className={`p-8 text-center rounded-2xl border border-dashed text-sm text-slate-500 ${
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
                        <div className="flex items-center justify-between gap-4">
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
                                  className={`px-2 py-1 rounded-md text-[10px] font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${
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
                          <div className="flex items-center justify-between">
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
                                  fontWeight: "font-black",
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
                                  fontWeight: "font-black",
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
                                  className="px-2.5 py-1.5 rounded-lg text-[9px] font-black border border-gray-100 hover:border-teal-500/50 bg-gray-50 text-zinc-300 hover:text-slate-900 transition-all cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
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
                                  className="flex items-center gap-2 px-3 py-2 rounded-2xl border border-gray-100 bg-gray-50 hover:bg-gray-50 hover:border-zinc-700 hover:shadow-lg hover:shadow-zinc-950/20 transition-all duration-200 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed group"
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
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3.5 p-3.5 rounded-xl bg-gray-50 border border-gray-100">
                            {/* Border Style */}
                            <div className="flex flex-col gap-1.5">
                              <label className="text-[9px] font-extrabold text-zinc-450 uppercase tracking-wider">
                                {lang === "tr" ? "Kenarlık Stili" : "Border Style"}
                              </label>
                              <select
                                value={link.borderStyle || "solid"}
                                disabled={simulatedPlan === "FREE" && initialUser.role !== "ADMIN"}
                                onChange={(e) => handleUpdateLinkStyle(link.id, "borderStyle", e.target.value)}
                                className="text-[10px] font-bold py-2 px-2.5 rounded-lg border focus:outline-none focus:ring-1 focus:ring-teal-500 bg-gray-50 border-gray-100 text-slate-900 disabled:opacity-50 cursor-pointer"
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
                                className="text-[10px] font-bold py-2 px-2.5 rounded-lg border focus:outline-none focus:ring-1 focus:ring-teal-500 bg-gray-50 border-gray-100 text-slate-900 disabled:opacity-50 cursor-pointer"
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
                                className="text-[10px] font-bold py-2 px-2.5 rounded-lg border focus:outline-none focus:ring-1 focus:ring-teal-500 bg-gray-50 border-gray-100 text-slate-900 disabled:opacity-50 cursor-pointer"
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
                                className="text-[10px] font-bold py-2 px-2.5 rounded-lg border focus:outline-none focus:ring-1 focus:ring-teal-500 bg-gray-50 border-gray-100 text-slate-900 disabled:opacity-50 cursor-pointer"
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
                                className="text-[10px] font-bold py-2 px-2.5 rounded-lg border focus:outline-none focus:ring-1 focus:ring-teal-500 bg-gray-50 border-gray-100 text-slate-900 disabled:opacity-50 cursor-pointer"
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
            </div>
        )}

          {/* TAB 5: OWNED TEMPLATES (ŞABLONLARIM) */}
        {activeTab === "templates" && (
          <div className="w-full space-y-8 animate-in fade-in slide-in-from-bottom-3 duration-350">
            <div className={`p-6 rounded-2xl border space-y-6 ${
              "bg-white border-zinc-200 shadow-sm"
            }`}>
              <div className="flex items-center justify-between border-b border-zinc-150 pb-5">
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
                <Link
                  href="/sablonlar"
                  className="px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-900 text-xs font-black transition-colors cursor-pointer"
                >
                  {lang === "tr" ? "Yeni Şablon Al" : "Browse Showcase"}
                </Link>
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
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-900 text-xs font-black transition-colors cursor-pointer"
                  >
                    <span>{lang === "tr" ? "Şablon Vitrinine Git" : "Go to Showcase"}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {ownedTemplates.map((template) => {
                    const isCurrentlyApplied = background === template.bgColor && fontStyle === template.fontStyle;
                    return (
                      <div 
                        key={template.id} 
                        className={`p-5 rounded-2xl border transition-all flex flex-col justify-between gap-5 ${
                          isCurrentlyApplied 
                            ? "bg-teal-50/20 border-teal-500 shadow-md shadow-teal-500/5" 
                            : "bg-zinc-50/50 border-zinc-200 hover:border-zinc-300 hover:shadow-sm"
                        }`}
                      >
                        <div className="space-y-3">
                          {/* Mini design preview card */}
                          <div 
                            className="h-28 rounded-xl flex flex-col items-center justify-center p-4 border border-zinc-200/60 relative overflow-hidden shadow-inner"
                            style={{ background: template.bgColor }}
                          >
                            {/* Glass overlay button preview */}
                            <div 
                              className={`px-4 py-2 rounded-xl text-[10px] font-bold text-center w-3/4 truncate max-w-xs ${template.buttonStyle}`}
                            >
                              {template.name}
                            </div>
                            <span className="absolute bottom-2 right-2 text-[9px] font-mono text-zinc-400 bg-black/45 px-2 py-0.5 rounded backdrop-blur-sm">
                              {template.fontStyle}
                            </span>
                          </div>

                          <div className="space-y-1">
                            <div className="flex items-center justify-between">
                              <h3 className="font-extrabold text-sm text-zinc-950">
                                {template.name}
                              </h3>
                              <span className="text-[10px] font-bold text-teal-600 bg-teal-50 border border-teal-100 px-2 py-0.5 rounded-full">
                                {template.category}
                              </span>
                            </div>
                            <p className="text-[10px] text-slate-500">
                              {template.isCoded 
                                ? (lang === "tr" ? "Özel CSS/Kod Yapısı" : "Custom Encoded Layout") 
                                : (lang === "tr" ? "Hazır Görsel Düzen" : "Visual Grid Template")}
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          disabled={isCurrentlyApplied || isPending}
                          onClick={async () => {
                            try {
                              setIsPending(true);
                              const res = await applyTemplateToProfile(initialUser.id, template.id);
                              if (res.success) {
                                setBackground(template.bgColor);
                                if (template.fontStyle) {
                                  setFontStyle(template.fontStyle);
                                }
                                setSuccessMsg(lang === "tr" ? "Şablon başarıyla uygulandı!" : "Template applied successfully!");
                                setTimeout(() => setSuccessMsg(""), 3000);
                              }
                            } catch (e: any) {
                              setErrorMsg(e.message || "An error occurred");
                              setTimeout(() => setErrorMsg(""), 4000);
                            } finally {
                              setIsPending(false);
                            }
                          }}
                          className={`w-full py-2.5 rounded-xl font-extrabold text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
                            isCurrentlyApplied 
                              ? "bg-zinc-100 text-zinc-400 border border-zinc-200 cursor-not-allowed" 
                              : "bg-teal-500 hover:bg-teal-400 text-slate-900"
                          }`}
                        >
                          {isCurrentlyApplied ? (
                            <>
                              <Check className="h-3.5 w-3.5" />
                              <span>{lang === "tr" ? "Aktif Olarak Uygulandı" : "Currently Active"}</span>
                            </>
                          ) : (
                            <>
                              <Sparkles className="h-3.5 w-3.5" />
                              <span>{lang === "tr" ? "Profili Güncelle (Uygula)" : "Apply to Profile"}</span>
                            </>
                          )}
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: TRAFFIC ANALYTICS */}
        {activeTab === "analytics" && (
          <div className="w-full space-y-8 animate-in fade-in slide-in-from-bottom-3 duration-350">
            {/* Top Summaries Grids */}
            <div className="grid md:grid-cols-4 gap-6">
              <div className={`p-6 rounded-2xl border flex items-center justify-between ${
                "bg-white border-zinc-200 shadow-sm"
              }`}>
                <div className="space-y-1">
                  <span className="text-xs text-slate-500 uppercase font-bold tracking-wider block">{t.totalViews}</span>
                  <div className={`text-3xl font-black ${"text-zinc-950"}`}>{totalViews}</div>
                </div>
                <div className="p-3 rounded-xl bg-teal-400/10 border border-teal-500/20 text-teal-500">
                  <Eye className="h-5 w-5" />
                </div>
              </div>

              <div className={`p-6 rounded-2xl border flex items-center justify-between ${
                "bg-white border-zinc-200 shadow-sm"
              }`}>
                <div className="space-y-1">
                  <span className="text-xs text-slate-500 uppercase font-bold tracking-wider block">{t.totalClicks}</span>
                  <div className={`text-3xl font-black ${"text-zinc-950"}`}>{totalClicks}</div>
                </div>
                <div className="p-3 rounded-xl bg-pink-500/10 border border-pink-500/20 text-pink-400">
                  <MousePointerClick className="h-5 w-5" />
                </div>
              </div>

              <div className={`p-6 rounded-2xl border flex items-center justify-between ${
                "bg-white border-zinc-200 shadow-sm"
              }`}>
                <div className="space-y-1">
                  <span className="text-xs text-slate-500 uppercase font-bold tracking-wider block">Average CTR</span>
                  <div className="text-3xl font-black text-emerald-400">{averageCTR}%</div>
                </div>
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                  <Percent className="h-5 w-5" />
                </div>
              </div>

              <div className={`p-6 rounded-2xl border flex flex-col justify-center space-y-2 ${
                "bg-white border-zinc-200 shadow-sm"
              }`}>
                <span className="text-xs text-slate-500 uppercase font-bold tracking-wider block">{lang === "tr" ? "Test Araçları" : "Verification Testing"}</span>
                <button
                  onClick={handleMockTraffic}
                  disabled={isPending}
                  className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-900 font-extrabold text-xs transition-colors cursor-pointer shadow-[0_0_15px_rgba(45,212,191,0.25)]"
                >
                  {isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
                  {t.simTraffic}
                </button>
              </div>
            </div>

            {totalViews === 0 ? (
              <div className={`p-12 text-center rounded-2xl border border-dashed space-y-3 ${
                "bg-white border-zinc-200"
              }`}>
                <div className="text-slate-500 text-sm font-semibold italic">
                  {lang === "tr" ? "Henüz trafik kaydı bulunmuyor. Sayfa linkinizi paylaşarak veya yukarıdaki 'Trafik Simülasyonu Çalıştır' butonuna tıklayarak grafikleri anında inceleyebilirsiniz!" : "No traffic logged yet. Promote your link page or click the 'Simulate Traffic Action' button to see analytics charts instantly!"}
                </div>
              </div>
            ) : (
              <>
                {/* Chart 1: Daily views & clicks */}
                <div className={`p-6 rounded-2xl border space-y-4 ${
                  "bg-white border-zinc-200 shadow-sm"
                }`}>
                  <h3 className={`font-extrabold text-sm uppercase tracking-wider ${"text-zinc-800"}`}>{t.trafficOverTime}</h3>
                  <div className="h-80 w-full text-xs">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData}>
                        <defs>
                          <linearGradient id="viewsGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#a855f7" stopOpacity={0.2}/>
                            <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                          </linearGradient>
                          <linearGradient id="clicksGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#ec4899" stopOpacity={0.2}/>
                            <stop offset="95%" stopColor="#ec4899" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="date" stroke="#52525b" fontSize={10} />
                        <YAxis stroke="#52525b" fontSize={10} />
                        <Tooltip contentStyle={{ backgroundColor: "#ffffff", borderColor: "#e4e4e7", color: "#000", borderRadius: "12px" }} />
                        <Legend />
                        <Area type="monotone" dataKey="Views" stroke="#a855f7" strokeWidth={2.5} fillOpacity={1} fill="url(#viewsGrad)" />
                        <Area type="monotone" dataKey="Clicks" stroke="#ec4899" strokeWidth={2.5} fillOpacity={1} fill="url(#clicksGrad)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Sub aggregations grid */}
                <div className="grid md:grid-cols-3 gap-6">
                  {/* Device and Browser splits */}
                  <div className={`p-6 rounded-2xl border space-y-4 flex flex-col justify-between ${
                    "bg-white border-zinc-200 shadow-sm"
                  }`}>
                    <h3 className={`font-extrabold text-xs uppercase tracking-wider ${"text-zinc-800"}`}>{t.devices} & {t.browsers}</h3>
                    <div className="h-56 flex items-center justify-center text-xs">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={deviceData}
                            cx="50%"
                            cy="50%"
                            innerRadius={50}
                            outerRadius={70}
                            paddingAngle={4}
                            dataKey="value"
                          >
                            {deviceData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip contentStyle={{ backgroundColor: "#ffffff", borderColor: "#e4e4e7", color: "#000" }} />
                          <Legend verticalAlign="bottom" height={36} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Top Referrals split */}
                  <div className={`p-6 rounded-2xl border space-y-4 ${
                    "bg-white border-zinc-200 shadow-sm"
                  }`}>
                    <h3 className={`font-extrabold text-xs uppercase tracking-wider ${"text-zinc-800"}`}>{t.referrers}</h3>
                    <div className="h-56 text-xs">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={referrerData} layout="vertical">
                          <XAxis type="number" stroke="#52525b" />
                          <YAxis dataKey="name" type="category" stroke="#52525b" width={80} />
                          <Tooltip contentStyle={{ backgroundColor: "#ffffff", borderColor: "#e4e4e7", color: "#000" }} />
                          <Bar dataKey="value" fill="#a855f7" radius={[0, 4, 4, 0]}>
                            {referrerData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Geolocation splits */}
                  <div className={`p-6 rounded-2xl border space-y-4 flex flex-col justify-between ${
                    "bg-white border-zinc-200 shadow-sm"
                  }`}>
                    <h3 className={`font-extrabold text-xs uppercase tracking-wider ${"text-zinc-800"}`}>{t.countries}</h3>
                    <div className="h-56 flex items-center justify-center text-xs">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={countryData}
                            cx="50%"
                            cy="50%"
                            outerRadius={65}
                            dataKey="value"
                            label={({ name, percent }) => `${name} ${percent ? (percent * 100).toFixed(0) : 0}%`}
                          >
                            {countryData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip contentStyle={{ backgroundColor: "#ffffff", borderColor: "#e4e4e7", color: "#000" }} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                {/* Table: Links Performance */}
                <div className={`p-6 rounded-2xl border space-y-4 ${
                  "bg-white border-zinc-200 shadow-sm"
                }`}>
                  <h3 className={`font-extrabold text-sm uppercase tracking-wider ${"text-zinc-800"}`}>{t.performanceInsights}</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className={`border-b text-slate-500 ${"border-zinc-200"}`}>
                          <th className="py-3 px-4 font-bold">{t.linkTitle}</th>
                          <th className="py-3 px-4 font-bold">{t.linkUrl}</th>
                          <th className="py-3 px-4 font-bold text-center">{lang === "tr" ? "Tıklama Sayısı" : "Click Count"}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {links.map((lnk) => (
                          <tr key={lnk.id} className={`border-b hover:bg-zinc-550/10 transition-all ${
                            "border-zinc-100"
                          }`}>
                            <td className={`py-3.5 px-4 font-bold ${"text-zinc-800"}`}>
                              <div className="flex items-center gap-2">
                                <div className="h-6 w-6 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100/50">
                                  {getLinkIconHelper(lnk.type, lnk.url)}
                                </div>
                                <span>{lnk.title}</span>
                              </div>
                            </td>
                            <td className="py-3.5 px-4 text-slate-500 font-mono">{lnk.url}</td>
                            <td className="py-3.5 px-4 font-extrabold text-teal-500 text-center">{lnk.clicks?.length || 0}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {activeTab === "qr" && (() => {
          const QR_TEMPLATES = [
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
          const qrLimitMax = userPlan === "FREE" ? 5 : userPlan === "STARTER" ? 15 : Infinity;
          const qrCount = qrCodes.length;
          const isQuotaReached = qrCount >= qrLimitMax;

          const isTemplateUnlocked = (templateTier: string) => {
            if (userPlan === "CREATOR" || userPlan === "PRO_BUSINESS" || initialUser.role === "ADMIN") {
              return true;
            }
            if (userPlan === "STARTER") {
              return templateTier === "FREE" || templateTier === "STARTER";
            }
            return templateTier === "FREE";
          };

          const getQrTypeMeta = (type: string) => {
            const found = QR_TEMPLATES.find((t) => t.id === type);
            return found || { name: type, desc: "", icon: QrCode, tier: "FREE" };
          };

          return (
            <div className="w-full space-y-8 animate-in fade-in slide-in-from-bottom-3 duration-350">
              {/* Top Banner Alert / Quotas */}
              <div className={`p-6 rounded-2xl border flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden ${
                "bg-white border-zinc-200 shadow-sm"
              }`}>
                <div className="space-y-2 flex-1 w-full">
                  <div className="flex items-center gap-2.5">
                    <QrCode className="h-5 w-5 text-teal-500" />
                    <h2 className={`font-black text-lg ${"text-zinc-950"}`}>
                      {lang === "tr" ? "Dinamik QR Kod Stüdyosu" : "Dynamic QR Code Studio"}
                    </h2>
                  </div>
                  <p className="text-xs text-slate-500 font-medium">
                    {lang === "tr" 
                      ? "Kreatör profiliniz ve özel şablonlarınız için yüksek çözünürlüklü dynamic QR kodları oluşturun."
                      : "Create custom high-resolution dynamic QR codes for your profiles and template assets."}
                  </p>

                  {/* Quota Progress Bar */}
                  <div className="space-y-1.5 pt-2 max-w-md">
                    <div className="flex justify-between items-center text-[10px] font-black uppercase text-slate-500">
                      <span>{lang === "tr" ? "QR OLUŞTURMA LİMİTİ" : "QR USAGE LIMIT"}</span>
                      <span>
                        {qrCount} / {qrLimitMax === Infinity ? (lang === "tr" ? "SINIRSIZ" : "UNLIMITED") : `${qrLimitMax}`}
                      </span>
                    </div>
                    <div className={`w-full h-2 rounded-full overflow-hidden ${"bg-zinc-100"}`}>
                      <div 
                        className="h-full bg-gradient-to-r from-purple-500 to-rose-500 rounded-full transition-all duration-500" 
                        style={{ width: `${Math.min((qrCount / (qrLimitMax === Infinity ? 100 : qrLimitMax)) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>

                {qrMode === "catalog" && (
                  <button
                    onClick={() => {
                      if (isQuotaReached) {
                        alert(lang === "tr" ? "Oluşturma limitine ulaştınız. Lütfen paketinizi yükseltin!" : "You have reached your creation limit. Please upgrade your plan!");
                        return;
                      }
                      setQrMode("create");
                    }}
                    className={`px-5 py-3 rounded-xl font-bold text-xs cursor-pointer transition-all flex items-center gap-2 text-slate-900 bg-gradient-to-r from-purple-600 to-rose-600 hover:opacity-90 shadow-md ${
                      isQuotaReached ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    <Plus className="h-4 w-4" />
                    {lang === "tr" ? "Yeni QR Kodu Oluştur" : "Create New QR Code"}
                  </button>
                )}
              </div>

              {/* MODE 1: CATALOG VIEW */}
              {qrMode === "catalog" && (
                <>
                  {qrCodes.length === 0 ? (
                    <div className={`p-16 rounded-2xl border text-center flex flex-col items-center gap-4 ${
                      "bg-white border-zinc-200 shadow-sm"
                    }`}>
                      <div className="h-16 w-16 rounded-full bg-teal-400/10 flex items-center justify-center border border-teal-500/20">
                        <QrCode className="h-8 w-8 text-teal-500" />
                      </div>
                      <div className="space-y-1">
                        <h3 className={`font-black text-sm ${"text-zinc-900"}`}>
                          {lang === "tr" ? "Henüz QR Kod Oluşturmadınız" : "No QR Codes Created Yet"}
                        </h3>
                        <p className="text-xs text-slate-500 max-w-sm mx-auto">
                          {lang === "tr" 
                            ? "Yukarıdaki 'Yeni QR Kodu Oluştur' butonuna basarak 16 şablondan birini seçip ilk dinamik QR kodunuzu oluşturabilirsiniz!"
                            : "Click the 'Create New QR Code' button above to select from 16 green templates and generate your first dynamic code!"}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {qrCodes.map((qr) => {
                        const meta = getQrTypeMeta(qr.type);
                        const MetaIcon = meta.icon;
                        return (
                          <div 
                            key={qr.id} 
                            className={`p-5 rounded-2xl border flex flex-col justify-between gap-5 relative overflow-hidden transition-all hover:-translate-y-0.5 hover:shadow-md ${
                              "bg-white border-zinc-200 shadow-sm hover:border-zinc-350"
                            }`}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="space-y-1">
                                <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[9px] font-black uppercase tracking-wider flex items-center gap-1.5 w-fit">
                                  <MetaIcon className="h-2.5 w-2.5" />
                                  {meta.name}
                                </span>
                                <h4 className={`font-black text-sm leading-snug ${"text-zinc-900"}`}>{qr.name}</h4>
                                <p className="text-[10px] text-slate-500 font-semibold">{new Date(qr.createdAt).toLocaleDateString("tr-TR")}</p>
                              </div>

                              <button
                                onClick={() => handleDeleteQr(qr.id)}
                                className="p-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-all cursor-pointer"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>

                            {/* Center Preview QR Code */}
                            <div className="flex justify-center py-2 bg-white rounded-xl p-3 border border-zinc-100">
                              <QRCodeSVG
                                value={qr.value}
                                size={140}
                                fgColor={qr.fgColor}
                                bgColor={qr.bgColor}
                                level="H"
                              />
                            </div>

                            {/* Download Action Bar */}
                            <div className="grid grid-cols-2 gap-2">
                              <button
                                onClick={() => {
                                  const link = document.createElement("a");
                                  const canvas = document.createElement("canvas");
                                  canvas.width = 1000;
                                  canvas.height = 1000;
                                  const ctx = canvas.getContext("2d");
                                  if (!ctx) return;
                                  ctx.fillStyle = qr.bgColor;
                                  ctx.fillRect(0, 0, 1000, 1000);

                                  // Draw QR Code
                                  const img = new window.Image();
                                  const svgString = new XMLSerializer().serializeToString(
                                    document.createElementNS("http://www.w3.org/2000/svg", "svg")
                                  );
                                  const svgBlob = new Blob([
                                    `<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="1000" viewBox="0 0 200 200">
                                      <rect width="200" height="200" fill="${qr.bgColor}"/>
                                      ${document.createElementNS("http://www.w3.org/2000/svg", "path").outerHTML}
                                     </svg>`
                                  ], { type: "image/svg+xml;charset=utf-8" });

                                  // Download Simple Base64 PNG fallback
                                  const qrImg = new window.Image();
                                  qrImg.onload = () => {
                                    ctx.drawImage(qrImg, 100, 100, 800, 800);
                                    link.href = canvas.toDataURL("image/png");
                                    link.download = `qr-${qr.name.toLowerCase().replace(/\s+/g, "-")}.png`;
                                    link.click();
                                  };
                                  qrImg.src = `data:image/svg+xml;utf8,${encodeURIComponent(
                                    `<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="1000" viewBox="0 0 200 200">
                                      <rect width="200" height="200" fill="${qr.bgColor}"/>
                                      <g transform="scale(1)">
                                        <rect width="200" height="200" fill="none"/>
                                      </g>
                                     </svg>`
                                  )}`;

                                  // Let browser download via secondary simplified anchor
                                  const fallbackUrl = `https://api.qrserver.com/v1/create-qr-code/?size=1000x1000&data=${encodeURIComponent(qr.value)}&color=${qr.fgColor.replace("#", "")}&ecc=H`;
                                  link.href = fallbackUrl;
                                  link.download = `qr-${qr.name}.png`;
                                  link.target = "_blank";
                                  link.click();
                                }}
                                className={`flex items-center justify-center gap-1.5 py-2 rounded-xl border font-bold text-[10px] transition-colors cursor-pointer ${
                                  "bg-zinc-50 border-zinc-200 text-zinc-700 hover:bg-zinc-100"
                                }`}
                              >
                                <Download className="h-3 w-3" />
                                PNG
                              </button>
                              <button
                                onClick={() => {
                                  const link = document.createElement("a");
                                  link.href = `https://api.qrserver.com/v1/create-qr-code/?size=1000x1000&data=${encodeURIComponent(qr.value)}&color=${qr.fgColor.replace("#", "")}&ecc=H&format=svg`;
                                  link.download = `qr-${qr.name}.svg`;
                                  link.target = "_blank";
                                  link.click();
                                }}
                                className={`flex items-center justify-center gap-1.5 py-2 rounded-xl border font-bold text-[10px] transition-colors cursor-pointer ${
                                  "bg-zinc-50 border-zinc-200 text-zinc-700 hover:bg-zinc-100"
                                }`}
                              >
                                <Download className="h-3 w-3" />
                                SVG
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </>
              )}

              {/* MODE 2: CREATION BUILDER VIEW */}
              {qrMode === "create" && (
                <div className="space-y-8 animate-in fade-in zoom-in-95 duration-200">
                  {/* Cancel Header Bar */}
                  <div className="flex justify-between items-center">
                    <button
                      onClick={() => {
                        setQrMode("catalog");
                        setSelectedTemplate(null);
                      }}
                      className={`px-4 py-2 rounded-full border text-xs font-bold transition-all cursor-pointer ${
                        "bg-white border-zinc-200 text-zinc-600 hover:bg-zinc-50"
                      }`}
                    >
                      &larr; {lang === "tr" ? "Listeye Geri Dön" : "Back to List"}
                    </button>

                    {selectedTemplate && (
                      <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-black uppercase flex items-center gap-1.5">
                        {lang === "tr" ? "Aktif Şablon" : "Active Template"}: {selectedTemplate}
                      </span>
                    )}
                  </div>

                  {/* 1. SELECT TEMPLATE GRID (IF NOT YET SELECTED) */}
                  {!selectedTemplate ? (
                    <div className="space-y-4">
                      <div className="border-b pb-2">
                        <h3 className={`font-black text-sm uppercase tracking-wider ${"text-zinc-800"}`}>
                          {lang === "tr" ? "Bir Şablon Tipi Seçin" : "Select a Template Type"}
                        </h3>
                        <p className="text-[10px] text-slate-500">
                          {lang === "tr" 
                            ? "Kreatör planınıza dahil olan 16 premium şablondan birini seçerek başlayın."
                            : "Start by selecting one of the 16 premium green templates included in your subscription."}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {QR_TEMPLATES.map((tmpl) => {
                          const Icon = tmpl.icon;
                          const unlocked = isTemplateUnlocked(tmpl.tier);
                          return (
                            <button
                              key={tmpl.id}
                              onClick={() => {
                                if (!unlocked) {
                                  alert(lang === "tr" 
                                    ? `Bu şablon ${tmpl.tier} planı gerektiriyor! Lütfen profilinizi yükseltin.` 
                                    : `This template requires ${tmpl.tier} plan! Please upgrade your subscription.`);
                                  return;
                                }
                                setSelectedTemplate(tmpl.id);
                                setQrName(tmpl.name);
                              }}
                              className={`p-5 rounded-2xl border text-center flex flex-col items-center justify-center gap-3 transition-all relative group cursor-pointer ${
                                unlocked 
                                  ? "bg-white border-zinc-200 hover:border-emerald-350 hover:shadow-md"
                                  : "opacity-40 cursor-not-allowed"
                              }`}
                            >
                              {/* Locked Overlay badge */}
                              {!unlocked && (
                                <div className="absolute top-2.5 right-2.5 p-1 rounded-md bg-gray-50 border border-gray-100 text-slate-500">
                                  <Lock className="h-3 w-3" />
                                </div>
                              )}

                              {/* Green background circle identical to screenshot icon colors */}
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
                                <p className="text-[9px] text-slate-500 font-semibold leading-normal line-clamp-2">
                                  {tmpl.desc}
                                </p>
                              </div>

                              {tmpl.tier !== "FREE" && (
                                <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full select-none ${
                                  tmpl.tier === "STARTER" 
                                    ? "bg-blue-500/10 text-blue-400 border border-blue-500/20" 
                                    : "bg-teal-400/10 text-teal-500 border border-teal-500/20"
                                }`}>
                                  {tmpl.tier}
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    /* 2. DYNAMIC TEMPLATE DESIGNER BUILDER */
                    <div className="flex flex-col lg:flex-row gap-8">
                      {/* Left: Input parameters */}
                      <div className="flex-1 space-y-6">
                        <div className={`p-6 rounded-2xl border space-y-6 ${
                          "bg-white border-zinc-200 shadow-sm"
                        }`}>
                          <div className="border-b pb-3 flex items-center gap-3">
                            <span className="p-2 rounded-lg bg-emerald-50 text-emerald-500">
                              {(() => {
                                const MetaIcon = getQrTypeMeta(selectedTemplate).icon;
                                return <MetaIcon className="h-5 w-5" />;
                              })()}
                            </span>
                            <div className="space-y-0.5">
                              <h3 className={`font-black text-sm uppercase tracking-wider ${"text-zinc-900"}`}>
                                {lang === "tr" ? "Şablon Ayrıntılarını Doldurun" : "Fill Template Details"}
                              </h3>
                              <p className="text-[10px] text-slate-500">
                                {lang === "tr" ? "Seçtiğiniz şablon tipine göre aşağıdaki form alanlarını girin." : "Fill the template fields below to automatically encode your custom code."}
                              </p>
                            </div>
                          </div>

                          {/* QR General Name */}
                          <div className="space-y-2">
                            <label className={`text-[10px] font-black uppercase tracking-wider block ${"text-zinc-550"}`}>
                              {lang === "tr" ? "QR Kod İsmi" : "QR Code Label Name"}
                            </label>
                            <input
                              type="text"
                              value={qrName}
                              onChange={(e) => setQrName(e.target.value)}
                              placeholder={lang === "tr" ? "Örn: Portfolyo Linkim" : "e.g., My Portfolio Link"}
                              className={`w-full px-4 py-3 rounded-xl border focus:border-teal-500/50 outline-none text-xs ${
                                "bg-zinc-50 border-zinc-200 text-zinc-900"
                              }`}
                            />
                          </div>

                          {/* DYNAMIC TEMPLATE FORMS */}

                          {/* DYNAMIC FORM: WIFI */}
                          {selectedTemplate === "WIFI" && (
                            <div className="space-y-4 pt-2">
                              <div className="space-y-2">
                                <label className={`text-[10px] font-black uppercase tracking-wider block ${"text-zinc-550"}`}>Network SSID (Ağ Adı)</label>
                                <input
                                  type="text"
                                  value={wifiSsid}
                                  onChange={(e) => setWifiSsid(e.target.value)}
                                  placeholder="e.g. Creator_Guest_Wifi"
                                  className={`w-full px-4 py-3 rounded-xl border focus:border-teal-500/50 outline-none text-xs ${
                                    "bg-zinc-50 border-zinc-200 text-zinc-900"
                                  }`}
                                />
                              </div>

                              <div className="space-y-2">
                                <label className={`text-[10px] font-black uppercase tracking-wider block ${"text-zinc-550"}`}>Wi-Fi Şifresi</label>
                                <input
                                  type="password"
                                  value={wifiPassword}
                                  onChange={(e) => setWifiPassword(e.target.value)}
                                  placeholder="••••••••"
                                  className={`w-full px-4 py-3 rounded-xl border focus:border-teal-500/50 outline-none text-xs ${
                                    "bg-zinc-50 border-zinc-200 text-zinc-900"
                                  }`}
                                />
                              </div>

                              <div className="space-y-2">
                                <label className={`text-[10px] font-black uppercase tracking-wider block ${"text-zinc-550"}`}>Şifreleme Tipi</label>
                                <select
                                  value={wifiEncryption}
                                  onChange={(e: any) => setWifiEncryption(e.target.value)}
                                  className={`w-full px-4 py-3 rounded-xl border focus:border-teal-500/50 outline-none text-xs font-semibold ${
                                    "bg-zinc-50 border-zinc-200 text-zinc-900"
                                  }`}
                                >
                                  <option value="WPA">WPA / WPA2</option>
                                  <option value="WEP">WEP</option>
                                  <option value="nopass">{lang === "tr" ? "Şifresiz (Açık)" : "Open (No Password)"}</option>
                                </select>
                              </div>
                            </div>
                          )}

                          {/* DYNAMIC FORM: WHATSAPP */}
                          {selectedTemplate === "WHATSAPP" && (
                            <div className="space-y-4 pt-2">
                              <div className="space-y-2">
                                <label className={`text-[10px] font-black uppercase tracking-wider block ${"text-zinc-550"}`}>Telefon Numarası</label>
                                <input
                                  type="text"
                                  value={whatsAppPhone}
                                  onChange={(e) => setWhatsAppPhone(e.target.value)}
                                  placeholder="Örn: +905321234567"
                                  className={`w-full px-4 py-3 rounded-xl border focus:border-teal-500/50 outline-none text-xs ${
                                    "bg-zinc-50 border-zinc-200 text-zinc-900"
                                  }`}
                                />
                              </div>

                              <div className="space-y-2">
                                <label className={`text-[10px] font-black uppercase tracking-wider block ${"text-zinc-550"}`}>Hazır Mesaj (Seçenekli)</label>
                                <textarea
                                  value={whatsAppMessage}
                                  onChange={(e) => setWhatsAppMessage(e.target.value)}
                                  placeholder={lang === "tr" ? "Örn: Merhaba, beatler hakkında bilgi almak istiyorum." : "e.g. Hi! I'd like to check licensing prices."}
                                  className={`w-full px-4 py-3 rounded-xl border focus:border-teal-500/50 outline-none text-xs min-h-[80px] resize-y ${
                                    "bg-zinc-50 border-zinc-200 text-zinc-900"
                                  }`}
                                />
                              </div>
                            </div>
                          )}

                          {/* DYNAMIC FORM: VCARD */}
                          {selectedTemplate === "VCARD" && (
                            <div className="space-y-4 pt-2">
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <label className={`text-[10px] font-black uppercase tracking-wider block ${"text-zinc-550"}`}>Tam İsim</label>
                                  <input
                                    type="text"
                                    value={vCardName}
                                    onChange={(e) => setVCardName(e.target.value)}
                                    placeholder="Jane Doe"
                                    className={`w-full px-4 py-3 rounded-xl border focus:border-teal-500/50 outline-none text-xs ${
                                      "bg-zinc-50 border-zinc-200 text-zinc-900"
                                    }`}
                                  />
                                </div>
                                <div className="space-y-2">
                                  <label className={`text-[10px] font-black uppercase tracking-wider block ${"text-zinc-550"}`}>Telefon</label>
                                  <input
                                    type="text"
                                    value={vCardPhone}
                                    onChange={(e) => setVCardPhone(e.target.value)}
                                    placeholder="+90555..."
                                    className={`w-full px-4 py-3 rounded-xl border focus:border-teal-500/50 outline-none text-xs ${
                                      "bg-zinc-50 border-zinc-200 text-zinc-900"
                                    }`}
                                  />
                                </div>
                              </div>

                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <label className={`text-[10px] font-black uppercase tracking-wider block ${"text-zinc-550"}`}>E-posta Adresi</label>
                                  <input
                                    type="email"
                                    value={vCardEmail}
                                    onChange={(e) => setVCardEmail(e.target.value)}
                                    placeholder="jane@company.com"
                                    className={`w-full px-4 py-3 rounded-xl border focus:border-teal-500/50 outline-none text-xs ${
                                      "bg-zinc-50 border-zinc-200 text-zinc-900"
                                    }`}
                                  />
                                </div>
                                <div className="space-y-2">
                                  <label className={`text-[10px] font-black uppercase tracking-wider block ${"text-zinc-550"}`}>İşletme / Kurum</label>
                                  <input
                                    type="text"
                                    value={vCardOrg}
                                    onChange={(e) => setVCardOrg(e.target.value)}
                                    placeholder="Creator Corp"
                                    className={`w-full px-4 py-3 rounded-xl border focus:border-teal-500/50 outline-none text-xs ${
                                      "bg-zinc-50 border-zinc-200 text-zinc-900"
                                    }`}
                                  />
                                </div>
                              </div>

                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <label className={`text-[10px] font-black uppercase tracking-wider block ${"text-zinc-550"}`}>Başlık / Ünvan</label>
                                  <input
                                    type="text"
                                    value={vCardTitle}
                                    onChange={(e) => setVCardTitle(e.target.value)}
                                    placeholder="Lead Producer"
                                    className={`w-full px-4 py-3 rounded-xl border focus:border-teal-500/50 outline-none text-xs ${
                                      "bg-zinc-50 border-zinc-200 text-zinc-900"
                                    }`}
                                  />
                                </div>
                                <div className="space-y-2">
                                  <label className={`text-[10px] font-black uppercase tracking-wider block ${"text-zinc-550"}`}>İnternet Adresi</label>
                                  <input
                                    type="text"
                                    value={vCardUrl}
                                    onChange={(e) => setVCardUrl(e.target.value)}
                                    placeholder="https://example.com"
                                    className={`w-full px-4 py-3 rounded-xl border focus:border-teal-500/50 outline-none text-xs ${
                                      "bg-zinc-50 border-zinc-200 text-zinc-900"
                                    }`}
                                  />
                                </div>
                              </div>
                            </div>
                          )}

                          {/* DEFAULT REDIRECT URL INPUT FOR ALL BASIC/URL SHABLONS */}
                          {selectedTemplate !== "WIFI" && selectedTemplate !== "WHATSAPP" && selectedTemplate !== "VCARD" && (
                            <div className="space-y-2 pt-2">
                              <label className={`text-[10px] font-black uppercase tracking-wider block ${"text-zinc-550"}`}>
                                {lang === "tr" ? "Bağlantı / Hedef Adresi" : "Destination URL / Asset Target"}
                              </label>
                              <input
                                type="text"
                                value={qrValueText}
                                onChange={(e) => setQrValueText(e.target.value)}
                                placeholder="https://example.com/asset.pdf"
                                className={`w-full px-4 py-3 rounded-xl border focus:border-teal-500/50 outline-none text-xs ${
                                  "bg-zinc-50 border-zinc-200 text-zinc-900"
                                }`}
                              />
                              <p className="text-[9px] text-slate-500 font-semibold italic">
                                {lang === "tr"
                                  ? "Dinamik yönlendirme adresi. İstediğiniz zaman güncelleyebilirsiniz."
                                  : "Dynamic target link. Updatable at any time from this dashboard."}
                              </p>
                            </div>
                          )}

                          {/* 2. STYLE CUSTOMIZATIONS SECTION */}
                          <div className={`space-y-6 border-t pt-6 ${"border-zinc-150"}`}>
                            <h4 className={`font-black text-xs uppercase tracking-wider ${"text-zinc-900"}`}>
                              {lang === "tr" ? "QR Kod Tasarımını Özelleştir" : "Customize QR Code Aesthetics"}
                            </h4>

                            <div className="grid md:grid-cols-2 gap-6">
                              {/* FG Color */}
                              <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <label className={`text-[10px] font-black uppercase tracking-wider block ${"text-zinc-550"}`}>
                                    {lang === "tr" ? "Ön Plan Rengi" : "Foreground Color"}
                                  </label>
                                  {!isPremium && <Lock className="h-3 w-3 text-slate-500" />}
                                </div>
                                <div className="flex gap-2">
                                  <input
                                    type="color"
                                    value={qrFgColor}
                                    onChange={(e) => isPremium && setQrFgColor(e.target.value)}
                                    disabled={!isPremium}
                                    className="h-10 w-12 rounded-lg bg-gray-50 border border-gray-100 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                  />
                                  <input
                                    type="text"
                                    value={qrFgColor}
                                    onChange={(e) => isPremium && setQrFgColor(e.target.value)}
                                    disabled={!isPremium}
                                    className={`flex-1 border rounded-lg px-3 text-xs outline-none focus:border-teal-500 disabled:opacity-50 disabled:cursor-not-allowed ${
                                      "bg-zinc-100 border-zinc-200 text-zinc-900"
                                    }`}
                                  />
                                </div>
                              </div>

                              {/* BG Color */}
                              <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <label className={`text-[10px] font-black uppercase tracking-wider block ${"text-zinc-550"}`}>
                                    {lang === "tr" ? "Arka Plan Rengi" : "Background Color"}
                                  </label>
                                  {!isPremium && <Lock className="h-3 w-3 text-slate-500" />}
                                </div>
                                <div className="flex gap-2">
                                  <input
                                    type="color"
                                    value={qrBgColor}
                                    onChange={(e) => isPremium && setQrBgColor(e.target.value)}
                                    disabled={!isPremium}
                                    className="h-10 w-12 rounded-lg bg-gray-50 border border-gray-100 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                  />
                                  <input
                                    type="text"
                                    value={qrBgColor}
                                    onChange={(e) => isPremium && setQrBgColor(e.target.value)}
                                    disabled={!isPremium}
                                    className={`flex-1 border rounded-lg px-3 text-xs outline-none focus:border-teal-500 disabled:opacity-50 disabled:cursor-not-allowed ${
                                      "bg-zinc-100 border-zinc-200 text-zinc-900"
                                    }`}
                                  />
                                </div>
                              </div>
                            </div>

                            {/* Watermark Branding overlay checkbox */}
                            <div className={`flex items-center justify-between p-3.5 rounded-xl border ${
                              "bg-zinc-50 border-zinc-200 text-zinc-850"
                            }`}>
                              <div className="space-y-0.5">
                                <div className="text-xs font-black flex items-center gap-1.5">
                                  {lang === "tr" ? "Marka Logosu Yerleşimi" : "Brand Watermark Placement"}
                                  {!isPremium && <Lock className="h-3 w-3 text-slate-500" />}
                                </div>
                                <p className="text-[9px] text-slate-500 font-semibold">{lang === "tr" ? "QR kodunun tam ortasına küçük bir marka ikonu yerleştirir." : "Place a tiny brand icon exactly inside the center of your generated QR."}</p>
                              </div>
                              <button
                                type="button"
                                onClick={() => isPremium && setQrIncludeLogo(!qrIncludeLogo)}
                                disabled={!isPremium}
                                className={`w-10 h-6 rounded-full p-1 cursor-pointer transition-all flex items-center ${
                                  qrIncludeLogo ? "bg-emerald-600 justify-end" : "bg-gray-50 justify-start"
                                } disabled:opacity-50 disabled:cursor-not-allowed`}
                              >
                                <div className="h-4 w-4 rounded-full bg-white shadow-sm" />
                              </button>
                            </div>

                            {!isPremium && (
                              <div className="p-4 rounded-xl bg-purple-950/20 border border-teal-500/20 flex gap-3 items-start">
                                <Lock className="h-4 w-4 text-teal-500 shrink-0 mt-0.5" />
                                <div className="space-y-1">
                                  <div className="text-xs font-black text-purple-300">
                                    {lang === "tr" ? "Tasarım Özellikleri Kilitli" : "Design Customizations Locked"}
                                  </div>
                                  <p className="text-[9px] text-slate-500 leading-normal">
                                    {lang === "tr"
                                      ? "QR kod renklerini özelleştirmek ve ortasına logo eklemek için STARTER veya CREATOR planına geçiş yapın."
                                      : "Upgrade your subscription package to STARTER or CREATOR to configure custom colors and icons."}
                                  </p>
                                  <Link href="/dashboard/billing" className="text-[9px] font-black text-teal-500 hover:underline block mt-1">
                                    {lang === "tr" ? "Hemen Yükselt &rarr;" : "Upgrade now &rarr;"}
                                  </Link>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Submit Actions */}
                          <div className="pt-4 flex gap-4">
                            <button
                              type="button"
                              onClick={handleCreateQr}
                              disabled={isPending}
                              className={`flex-1 py-3 rounded-xl font-bold text-xs text-slate-900 bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-95 transition-opacity shadow-md shadow-emerald-950/10 cursor-pointer flex items-center justify-center gap-2 ${
                                isPending ? "opacity-50 cursor-not-allowed" : ""
                              }`}
                            >
                              {isPending ? (
                                <>
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                  {lang === "tr" ? "Oluşturuluyor..." : "Generating..."}
                                </>
                              ) : (
                                <>
                                  <Check className="h-4 w-4" />
                                  {lang === "tr" ? "QR Kodunu Kaydet ve Oluştur" : "Save and Create QR Code"}
                                </>
                              )}
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedTemplate(null);
                                setQrName("");
                              }}
                              className={`px-6 py-3 rounded-xl font-bold text-xs border cursor-pointer ${
                                "bg-white border-zinc-200 text-zinc-600 hover:bg-zinc-50"
                              }`}
                            >
                              {lang === "tr" ? "İptal" : "Cancel"}
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Right: Live Responsive Preview Sticky Canvas */}
                      <div className="w-full lg:w-[320px] shrink-0 sticky top-32 self-start flex flex-col items-center gap-6">
                        <div className="text-center">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[9px] font-black uppercase tracking-wider ${
                            "bg-white border-zinc-200 text-zinc-700 shadow-sm"
                          }`}>
                            {lang === "tr" ? "Canlı Önizleme" : "Live Real-Time Preview"}
                          </span>
                        </div>

                        <div className={`p-6 rounded-3xl border flex flex-col items-center gap-5 w-full ${
                          "bg-white border-zinc-200 shadow-sm"
                        }`}>
                          <div className="p-4 bg-white rounded-2xl flex items-center justify-center border border-zinc-100 overflow-hidden shadow-sm">
                            <QRCodeSVG
                              value={computedQrValue}
                              size={180}
                              fgColor={isPremium ? qrFgColor : "#000000"}
                              bgColor={isPremium ? qrBgColor : "#ffffff"}
                              level="H"
                              imageSettings={
                                qrIncludeLogo && isPremium
                                  ? {
                                      src: qrLogoFile || "https://t3.ftcdn.net/jpg/05/73/06/07/360_F_573060714_U5R88yvP1T2o8kQ4x05u5hVfC6L9U7oU.jpg",
                                      x: undefined,
                                      y: undefined,
                                      height: 35,
                                      width: 35,
                                      excavate: true,
                                    }
                                  : undefined
                              }
                            />
                          </div>

                          <div className="text-center space-y-1 w-full px-2">
                            <div className={`text-xs font-black truncate ${"text-zinc-900"}`}>
                              {qrName || (lang === "tr" ? "Yeni QR Kod" : "Unnamed QR")}
                            </div>
                            <p className="text-[9px] text-slate-500 font-bold leading-normal truncate font-mono">
                              {computedQrValue}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })()}

        {/* TAB 4: SEO & CUSTOM DOMAINS */}
        {activeTab === "seo" && (
          <div className="w-full space-y-8 animate-in fade-in slide-in-from-bottom-3 duration-350">
            
            {/* COLUMN 1: Social SEO Control */}
            <div className={`p-6 rounded-2xl border space-y-6 relative overflow-hidden ${!isPremium ? "min-h-[300px]" : ""} ${
              "bg-white border-zinc-200 shadow-sm"
            }`}>
              <div className="flex items-center gap-3">
                <Settings className="h-5 w-5 text-teal-500" />
                <h2 className={`font-extrabold text-lg ${"text-zinc-950"}`}>{t.tabSeo}</h2>
              </div>

              <form onSubmit={handleSaveSeo} className={`space-y-4 border-t pt-5 ${"border-zinc-150"}`}>
                <div className="space-y-1.5">
                  <label className={`text-xs font-semibold uppercase tracking-wider block ${"text-zinc-550"}`}>{lang === "tr" ? "Meta Başlık (SEO)" : "Meta Title"}</label>
                  <input
                    type="text"
                    value={seoTitle}
                    onChange={(e) => setSeoTitle(e.target.value)}
                    disabled={!isPremium}
                    placeholder={`@${username} | CREATOR.HUB`}
                    className={`w-full px-4 py-3 rounded-xl border focus:border-teal-500/50 outline-none text-xs disabled:opacity-50 disabled:cursor-not-allowed ${
                      "bg-zinc-100 border-zinc-200 text-zinc-900"
                    }`}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className={`text-xs font-semibold uppercase tracking-wider block ${"text-zinc-550"}`}>{lang === "tr" ? "Meta Açıklama (SEO)" : "Meta Description"}</label>
                  <textarea
                    value={seoDescription}
                    onChange={(e) => setSeoDescription(e.target.value)}
                    disabled={!isPremium}
                    placeholder={bio || "Welcome to my link page!"}
                    rows={3}
                    className={`w-full px-4 py-3 rounded-xl border focus:border-teal-500/50 outline-none text-xs disabled:opacity-50 disabled:cursor-not-allowed ${
                      "bg-zinc-100 border-zinc-200 text-zinc-900"
                    }`}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className={`text-xs font-semibold uppercase tracking-wider block ${"text-zinc-550"}`}>{lang === "tr" ? "Arama Kelimeleri" : "Search Keywords"}</label>
                  <input
                    type="text"
                    value={seoKeywords}
                    onChange={(e) => setSeoKeywords(e.target.value)}
                    disabled={!isPremium}
                    placeholder="beats, developer, portfolio, trap"
                    className={`w-full px-4 py-3 rounded-xl border focus:border-teal-500/50 outline-none text-xs disabled:opacity-50 disabled:cursor-not-allowed ${
                      "bg-zinc-100 border-zinc-200 text-zinc-900"
                    }`}
                  />
                </div>

                <button
                  type="submit"
                  disabled={!isPremium || isPending}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-teal-500 hover:bg-teal-400 disabled:bg-zinc-400 text-slate-900 disabled:text-zinc-700 font-extrabold text-xs transition-colors cursor-pointer disabled:cursor-not-allowed"
                >
                  {isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
                  {lang === "tr" ? "SEO Ayarlarını Kaydet" : "Save SEO Parameters"}
                </button>
              </form>

              {/* Locked overlay */}
              {!isPremium && (
                <div className="absolute inset-0 bg-black/85 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center space-y-4">
                  <Lock className="h-10 w-10 text-teal-500" />
                  <div className="space-y-1 max-w-xs">
                    <h3 className="text-sm font-extrabold text-slate-900">{lang === "tr" ? "SEO Özelleştirmeleri Kilitli" : "SEO Customs are Locked"}</h3>
                    <p className="text-[10px] text-slate-500 leading-relaxed">
                      {lang === "tr" ? "HTML başlık verilerinizi, sosyal medya paylaşım açıklamalarını ve arama motoru dizin anahtar kelimelerini özelleştirmek için premium plana yükseltin!" : "Upgrade to a premium plan to custom define your HTML header metadata, social share descriptions, and search indexing keywords."}
                    </p>
                  </div>
                  <button
                    onClick={() => triggerUpgradeModal(
                      lang === "tr" ? "SEO Ayarları Kilitli 🔒" : "SEO Customs Locked 🔒",
                      lang === "tr"
                        ? "Meta başlık, açıklama ve anahtar kelime özelleştirmeleri gibi gelişmiş arama motoru optimizasyonu ayarlarını kullanmak Premium pakete özeldir."
                        : "Customizing SEO meta title, description and indexing keywords is exclusive to our Premium plans."
                    )}
                    className="px-4 py-2 rounded-full bg-teal-500 hover:bg-teal-400 text-slate-900 font-bold text-[10px] transition-colors cursor-pointer"
                  >
                    {lang === "tr" ? "SEO Özelliklerinin Kilidini Aç" : "Unlock SEO Settings"}
                  </button>
                </div>
              )}
            </div>

            {/* COLUMN 2: Custom Domains Manager */}
            <div className={`p-6 rounded-2xl border space-y-6 relative overflow-hidden ${!isCreator ? "min-h-[300px]" : ""} ${
              "bg-white border-zinc-200 shadow-sm"
            }`}>
              <div className="flex items-center gap-3">
                <Globe className="h-5 w-5 text-emerald-400" />
                <h2 className={`font-extrabold text-lg ${"text-zinc-950"}`}>{lang === "tr" ? "Özel Alan Adı (Domain)" : "Custom Domain Manager"}</h2>
              </div>

              <div className={`space-y-6 border-t pt-5 ${"border-zinc-150"}`}>
                <form onSubmit={handleSaveDomain} className="flex gap-2">
                  <div className={`flex-1 flex items-center rounded-xl border px-3 overflow-hidden focus-within:border-emerald-500/50 ${
                    "bg-zinc-100 border-zinc-200"
                  }`}>
                    <span className="text-slate-500 text-xs">https://</span>
                    <input
                      type="text"
                      value={customDomain}
                      onChange={(e) => setCustomDomain(e.target.value)}
                      placeholder="links.erdem.com"
                      className={`bg-transparent border-none outline-none py-2.5 text-xs flex-1 ${
                        "text-zinc-900"
                      }`}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isPending}
                    className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-900 font-extrabold text-xs transition-colors cursor-pointer"
                  >
                    {lang === "tr" ? "Yapılandır" : "Configure"}
                  </button>
                </form>

                {/* DNS Setup Card */}
                {initialUser.profile?.customDomain && (
                  <div className={`p-4 rounded-xl border space-y-4 ${
                    "bg-zinc-50 border-zinc-200"
                  }`}>
                    <div className="flex justify-between items-center text-[10px] font-bold">
                      <span className={`${"text-zinc-700"}`}>{lang === "tr" ? "DNS Kurulum Talimatları" : "DNS Setup Instructions"}</span>
                      <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">DNS Connected</span>
                    </div>

                    <p className="text-[10px] text-slate-500 leading-relaxed">
                      {lang === "tr" ? "Özel alan adınızı profil sayfanıza yönlendirmek için DNS sağlayıcınızda (Cloudflare, GoDaddy, vb.) bir CNAME kaydı oluşturun:" : "To point your custom domain name to our creator grid, create a CNAME record with your DNS provider (Cloudflare, GoDaddy, etc.):"}
                    </p>

                    <div className="overflow-x-auto text-[10px] font-mono">
                      <table className="w-full text-left">
                        <thead>
                          <tr className={`border-b ${"text-slate-500 border-zinc-200"}`}>
                            <th className="pb-2">Type</th>
                            <th className="pb-2">Name</th>
                            <th className="pb-2">Target Value</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className={"text-zinc-800"}>
                            <td className="py-2">CNAME</td>
                            <td className="py-2">links</td>
                            <td className="py-2 flex items-center gap-1.5 font-bold text-purple-650">
                              cname.creator.hub
                              <button onClick={() => navigator.clipboard.writeText("cname.creator.hub")} className="p-1 rounded bg-gray-50 hover:bg-zinc-700 text-slate-500 cursor-pointer">
                                <Copy className="h-3 w-3" />
                              </button>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>

              {/* Locked overlay */}
              {!isCreator && (
                <div className="absolute inset-0 bg-black/85 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center space-y-4">
                  <Lock className="h-10 w-10 text-emerald-400" />
                  <div className="space-y-1 max-w-xs">
                    <h3 className="text-sm font-extrabold text-slate-900">{lang === "tr" ? "Özel Alan Adları Kilitli" : "Custom Domains are Locked"}</h3>
                    <p className="text-[10px] text-zinc-450 leading-relaxed">
                      {lang === "tr" ? "Kendi alan adınızı bağlamak, DNS kayıtlarını otomatik eşlemek ve beyaz etiketli (white-label) markalama oluşturmak için CREATOR paketine geçin." : "Upgrade to our CREATOR enterprise package to map dynamic custom domains, bind DNS records, and build white-label branding."}
                    </p>
                  </div>
                  <button
                    onClick={() => triggerUpgradeModal(
                      lang === "tr" ? "Özel Alan Adı Kilitli 🔒" : "Custom Domain Locked 🔒",
                      lang === "tr"
                        ? "Kendi özel alan adınızı (cname) bağlamak ve beyaz etiketli (white-label) markalama oluşturmak Creator paketine özeldir."
                        : "Mapping custom domains and utilizing white-label branding requires the CREATOR plan."
                    )}
                    className="px-4 py-2 rounded-full bg-emerald-600 hover:bg-emerald-500 text-slate-900 font-bold text-[10px] transition-colors cursor-pointer"
                  >
                    {lang === "tr" ? "Alan Adı Kilidini Aç" : "Unlock Domains"}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
        </div>

        {/* RIGHT COLUMN: STICKY SIMULATOR PREVIEW OR INVISIBLE SPACER FOR EXACT ALIGNMENT & PROPORTIONS */}
        {activeTab === "editor" ? (
          renderSimulator()
        ) : (
          <div className="hidden lg:block w-[360px] shrink-0 sticky top-32 self-start pointer-events-none opacity-0" />
        )}

      </div>

      {/* Floating Upgrade Prompt for FREE tier users */}
      <FloatingUpgradePrompt currentPlan={simulatedPlan} globalSettings={globalSettings} />

      {/* Upgrade Modal for Locked Features */}
      <UpgradeModal
        isOpen={isUpgradeModalOpen}
        onClose={() => setIsUpgradeModalOpen(false)}
        title={upgradeModalTitle}
        description={upgradeModalDesc}
        globalSettings={globalSettings}
      />
    </div>
  );
}
