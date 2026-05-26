"use client";

import { useState, useTransition } from "react";
import { adminToggleBanUser, adminChangeUserPlan, adminToggleUserRole, saveGlobalSetting, adminClearCache, adminDeleteGlobalSetting, adminAddFont, adminDeleteFont, adminUpdateFont, addSliderItem, deleteSliderItem } from "@/app/actions";
import {
  ShieldAlert,
  Users,
  CreditCard,
  Ban,
  CheckCircle,
  Search,
  UserCheck,
  UserX,
  TrendingUp,
  Loader2,
  ArrowRight,
  Sparkles,
  Palette,
  Plus,
  Trash2,
  MoreVertical,
  Bell,
  Settings,
  Grid,
  Percent,
  Check,
  FileText,
  ExternalLink,
  Shield,
  Cookie,
  RefreshCw,
  Code
} from "lucide-react";
import Link from "next/link";
import GlobalOverlayManager from "@/components/global-overlay-manager";

type UserItem = {
  id: string;
  email: string;
  username: string | null;
  plan: string;
  role: string;
  isBanned: boolean;
  planStartedAt: string | null;
  planExpiresAt: string | null;
  createdAt: Date;
};

interface AdminClientProps {
  adminUserId: string;
  adminRole: string;
  initialUsers: UserItem[];
  initialSettings: Record<string, string>;
  stats: {
    totalUsers: number;
    starterCount: number;
    creatorCount: number;
    totalRevenue: number;
  };
  initialFonts: { id: string; name: string; value: string; tier: string; giftLabel?: string | null; createdAt: string }[];
  initialSliderItems?: { id: string; title: string; imageUrl: string; link?: string }[];
}

const DEFAULT_FREE_BGS = [
  { id: "bg-slate-free", name: "Slate Minimal", css: "bg-gradient-to-tr from-slate-900 via-zinc-900 to-slate-900" },
  { id: "bg-black-free", name: "Obsidian Black", css: "bg-gradient-to-br from-zinc-900 to-black" },
  { id: "bg-stone-free", name: "Stone Dust", css: "bg-gradient-to-tr from-zinc-955 to-stone-900" },
  { id: "bg-metal-free", name: "Anthracite", css: "bg-gradient-to-r from-zinc-900 via-zinc-950 to-zinc-900" },
  { id: "bg-purple-free", name: "Deep Amethyst", css: "bg-gradient-to-b from-purple-950/20 via-zinc-950 to-black" },
];

const DEFAULT_STARTER_BGS = [
  { id: "bg-indigo-space", name: "Indigo Space", css: "bg-gradient-to-tr from-indigo-950 via-zinc-950 to-indigo-900" },
  { id: "bg-emerald-acid", name: "Acid Emerald", css: "bg-gradient-to-br from-emerald-955 via-zinc-950 to-teal-900" },
  { id: "bg-nebula-glow", name: "Nebula Glow", css: "bg-gradient-to-r from-purple-950 via-zinc-950 to-pink-950" },
  { id: "bg-anthracite-metal", name: "Anthracite Metal", css: "bg-gradient-to-tr from-slate-900 via-zinc-955 to-zinc-900" },
  { id: "bg-cyber-rose", name: "Cyber Rose", css: "bg-gradient-to-b from-rose-955 via-zinc-950 to-violet-955" },
  { id: "bg-deep-ocean", name: "Deep Ocean", css: "bg-gradient-to-tr from-cyan-955 via-zinc-950 to-blue-955" },
  { id: "bg-sunset-lava", name: "Sunset Lava", css: "bg-gradient-to-r from-orange-955 via-zinc-950 to-red-955" },
  { id: "bg-obsidian-stone", name: "Obsidian Stone", css: "bg-gradient-to-b from-zinc-955 to-stone-900" },
  { id: "bg-fuchsia-dust", name: "Fuchsia Dust", css: "bg-gradient-to-tr from-violet-955 to-zinc-955" },
  { id: "bg-midday-twilight", name: "Midday Twilight", css: "bg-gradient-to-br from-blue-955 via-slate-955 to-black" },
];

const DEFAULT_CREATOR_BGS = [
  { id: "bg-hyper-sunset", name: "Hyper Sunset", css: "bg-gradient-to-tr from-pink-600 via-rose-500 to-yellow-500" },
  { id: "bg-neon-lime", name: "Acid Neon", css: "bg-gradient-to-br from-green-400 via-emerald-500 to-cyan-500" },
  { id: "bg-radioactive-cyan", name: "Neon Cyan", css: "bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600" },
  { id: "bg-electric-purple", name: "Cyber Magenta", css: "bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-fuchsia-500 via-purple-600 to-zinc-950" },
  { id: "bg-solar-flare", name: "Solar Flare", css: "bg-gradient-to-tr from-red-500 via-orange-500 to-yellow-400" },
  { id: "bg-aurora-glow", name: "Vivid Aurora", css: "bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-teal-400 via-emerald-600 to-zinc-950" },
  { id: "bg-barbie-pink", name: "Barbie Pink", css: "bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-500" },
  { id: "bg-miami-beach", name: "Miami Sunset", css: "bg-gradient-to-tr from-orange-400 via-pink-500 to-purple-600" },
  { id: "bg-electric-vortex", name: "Liquid Violet", css: "bg-[conic-gradient(at_top,_var(--tw-gradient-stops))] from-purple-600 via-indigo-600 to-black" },
  { id: "bg-cyber-gold", name: "Hyperion Gold", css: "bg-gradient-to-r from-yellow-500 via-amber-500 to-orange-600" },
];

const STANDARD_SETTINGS_METADATA: Record<string, { title: string; desc: string }> = {
  site_title: {
    title: "Site Başlığı (site_title)",
    desc: "Platformun tarayıcı sekmesindeki başlığı ve sol üst köşedeki logo metni."
  },
  site_logo: {
    title: "Logo Resim Adresi (site_logo)",
    desc: "Sol üst köşede görüntülenecek logonun görsel URL'si (örneğin SVG veya PNG). Boşsa metin logo gösterilir."
  },
  site_favicon: {
    title: "Favicon İkon Adresi (site_favicon)",
    desc: "Tarayıcı sekmesinde görüntülenecek küçük ikonun (.ico/.png) adresi."
  },
  hero_title: {
    title: "Giriş Manşeti (hero_title)",
    desc: "Ziyaretçileri karşılayan en üstteki büyük, kalın manşet yazısı."
  },
  hero_subtitle: {
    title: "Giriş Alt Başlığı (hero_subtitle)",
    desc: "Giriş manşetinin hemen altındaki açıklayıcı alt metin."
  },
  accent_color: {
    title: "Neon Vurgu Rengi (accent_color)",
    desc: "Butonlar, çizgiler ve neon temalar için kullanılan birincil renk (purple, emerald, pink, cyan)."
  },
  light_mode_bg: {
    title: "Açık Tema Arka Planı (light_mode_bg)",
    desc: "Açık tema (Light mode) için kullanılan ana arka plan renginin HEX kodu (Örn: #f4f4f5)."
  },
  dark_mode_bg: {
    title: "Koyu Tema Arka Planı (dark_mode_bg)",
    desc: "Koyu tema (Dark mode) için kullanılan ana arka plan renginin HEX kodu (Örn: #000000)."
  },
  footer_copyright: {
    title: "Footer Telif Hakkı (footer_copyright)",
    desc: "Platformun en altında gösterilen telif hakkı ve marka tescil yazısı."
  },
  custom_css: {
    title: "Özel CSS Kodları (custom_css)",
    desc: "Sitenin tamamına enjekte edilecek ham CSS kodları (Tasarımı özelleştirmek için kullanılır)."
  },
  payment_link_starter: {
    title: "Starter Plan Ödeme Geçidi (payment_link_starter)",
    desc: "Starter plana yükselmek isteyenlerin yönlendirileceği Shopier/Stripe ödeme URL'si."
  },
  payment_link_creator: {
    title: "Creator Plan Ödeme Geçidi (payment_link_creator)",
    desc: "Creator plana yükselmek isteyenlerin yönlendirileceği Shopier/Stripe ödeme URL'si."
  },
  payment_link_pro: {
    title: "Pro Business Ödeme Geçidi (payment_link_pro)",
    desc: "Pro Business plana yükselmek isteyenlerin yönlendirileceği Shopier/Stripe ödeme URL'si."
  },
  page_privacy_policy: {
    title: "Gizlilik Politikası (page_privacy_policy)",
    desc: "Gizlilik Sözleşmesi sayfasının zengin HTML içeriği."
  },
  page_cookie_policy: {
    title: "Çerez Politikası (page_cookie_policy)",
    desc: "Çerez Politikası sayfasının zengin HTML içeriği."
  },
  backgrounds_free: {
    title: "Ücretsiz Arka Planlar (backgrounds_free)",
    desc: "Free plan kullanıcılarının seçebileceği arka planların JSON listesi."
  },
  backgrounds_starter: {
    title: "Starter Arka Planları (backgrounds_starter)",
    desc: "Starter plan kullanıcılarının seçebileceği arka planların JSON listesi."
  },
  backgrounds_creator: {
    title: "Creator Arka Planları (backgrounds_creator)",
    desc: "Creator plan kullanıcılarının seçebileceği premium arka planların JSON listesi."
  }
};

export default function AdminClient({ 
  adminUserId, 
  adminRole, 
  initialUsers, 
  initialSettings, 
  stats, 
  initialFonts,
  initialSliderItems = [],
}: AdminClientProps) {
  const isSuperAdmin = adminRole === "SUPER_ADMIN";
  const [users, setUsers] = useState<UserItem[]>(initialUsers);
  const [searchQuery, setSearchQuery] = useState("");
  const [isPending, startTransition] = useTransition();
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [lang, setLang] = useState<"tr" | "en">("en");
  const [activeTheme, setActiveTheme] = useState<"dark" | "light">("light");
  const [sidebarTab, setSidebarTab] = useState<"directory" | "stats" | "backgrounds" | "homepage" | "settings" | "legal" | "code" | "fonts" | "animations">("directory");

  // Dynamic Fonts state
  const [fonts, setFonts] = useState(initialFonts);

  // Slider items state
  const [sliderItems, setSliderItems] = useState(initialSliderItems);
  const [newSliderTitle, setNewSliderTitle] = useState("");
  const [newSliderLink, setNewSliderLink] = useState("");
  const [newSliderFile, setNewSliderFile] = useState<File | null>(null);
  const [isUploadingSlider, setIsUploadingSlider] = useState(false);
  const [isSavingFeatures, setIsSavingFeatures] = useState(false);
  const [featureForm, setFeatureForm] = useState({
    feature_1_title: initialSettings["feature_1_title"] || "",
    feature_1_desc: initialSettings["feature_1_desc"] || "",
    feature_2_title: initialSettings["feature_2_title"] || "",
    feature_2_desc: initialSettings["feature_2_desc"] || "",
    feature_3_title: initialSettings["feature_3_title"] || "",
    feature_3_desc: initialSettings["feature_3_desc"] || "",
  });
  const [fontSearchQuery, setFontSearchQuery] = useState("");
  
  // Font Form state
  const [newFontName, setNewFontName] = useState("");
  const [newFontValue, setNewFontValue] = useState("");
  const [newFontTier, setNewFontTier] = useState("FREE");
  const [newFontGiftLabel, setNewFontGiftLabel] = useState("");
  const [activeFontTab, setActiveFontTab] = useState<"FREE" | "STARTER" | "CREATOR">("FREE");

  // Dynamic Animations state
  const [animSearchQuery, setAnimSearchQuery] = useState("");
  const [activeAnimTab, setActiveAnimTab] = useState<"FREE" | "STARTER" | "CREATOR">("FREE");
  const [newAnimGiftLabel, setNewAnimGiftLabel] = useState("");

  // Filtering users by active plan pills
  const [planFilter, setPlanFilter] = useState<string>("ALL");

  // Action Menu dropdown state
  const [activeUserMenu, setActiveUserMenu] = useState<string | null>(null);

  // Busy/Maintenance mode state
  const [isMaintenanceMode, setIsMaintenanceMode] = useState(false);
  const [pendingPlans, setPendingPlans] = useState<Record<string, string>>({});

  const handleStateChange = (state: { lang: "tr" | "en"; theme: "dark" | "light" }) => {
    setLang(state.lang);
    setActiveTheme(state.theme);
  };

  const isDark = false;

  // Global Settings state
  const [starterLink, setStarterLink] = useState(initialSettings["payment_link_starter"] || "");
  const [creatorLink, setCreatorLink] = useState(initialSettings["payment_link_creator"] || "");
  const [proLink, setProLink] = useState(initialSettings["payment_link_pro"] || "");
  const [priceStarter, setPriceStarter] = useState(initialSettings["price_starter"] || "150");
  const [priceCreator, setPriceCreator] = useState(initialSettings["price_creator"] || "450");
  const [pricePro, setPricePro] = useState(initialSettings["price_pro"] || "950");

  // Brand Asset Settings State
  const [siteTitle, setSiteTitle] = useState(initialSettings["site_title"] || "CREATOR.HUB");
  const [siteLogo, setSiteLogo] = useState(initialSettings["site_logo"] || "");
  const [siteFavicon, setSiteFavicon] = useState(initialSettings["site_favicon"] || "/favicon.ico");
  const [heroTitle, setHeroTitle] = useState(initialSettings["hero_title"] || "ONE LINK FOR YOUR DIGITAL EMPIRE");
  const [heroSubtitle, setHeroSubtitle] = useState(initialSettings["hero_subtitle"] || "Craft premium glassmorphic personal hubs, sell beats & presets, host sample packs, and leverage robust real-time analytics.");
  const [accentColor, setAccentColor] = useState(initialSettings["accent_color"] || "purple");

  // Advanced Visuals State
  const [lightModeBg, setLightModeBg] = useState(initialSettings["light_mode_bg"] || "#f4f4f5");
  const [darkModeBg, setDarkModeBg] = useState(initialSettings["dark_mode_bg"] || "#000000");
  const [footerCopyright, setFooterCopyright] = useState(initialSettings["footer_copyright"] || "© 2026 CREATOR.HUB. All rights reserved.");
  const [customCSS, setCustomCSS] = useState(initialSettings["custom_css"] || "");

  // Custom Backgrounds Admin State
  const [freeBgs, setFreeBgs] = useState<any[]>(() => {
    return initialSettings["backgrounds_free"] ? JSON.parse(initialSettings["backgrounds_free"]) : DEFAULT_FREE_BGS;
  });
  const [starterBgs, setStarterBgs] = useState<any[]>(() => {
    return initialSettings["backgrounds_starter"] ? JSON.parse(initialSettings["backgrounds_starter"]) : DEFAULT_STARTER_BGS;
  });
  const [creatorBgs, setCreatorBgs] = useState<any[]>(() => {
    return initialSettings["backgrounds_creator"] ? JSON.parse(initialSettings["backgrounds_creator"]) : DEFAULT_CREATOR_BGS;
  });

  // Background Creator fields
  const [newBgName, setNewBgName] = useState("");
  const [newBgCss, setNewBgCss] = useState("");
  const [newBgPlan, setNewBgPlan] = useState<"FREE" | "STARTER" | "CREATOR">("FREE");

  // Custom Animations Admin State
  const [freeAnims, setFreeAnims] = useState<any[]>(() => {
    return initialSettings["animations_free"] 
      ? JSON.parse(initialSettings["animations_free"]) 
      : [
          { id: "anim-none", label: "Sabit (None)", tier: "FREE" },
          { id: "anim-hover-scale", label: "Büyüme (Hover Scale)", tier: "FREE" },
          { id: "anim-hover-lift", label: "Kaldırma (Hover Lift)", tier: "FREE" },
          { id: "anim-pulse-slow", label: "Yavaş Nabız (Pulse)", tier: "FREE" },
          { id: "anim-fade-in", label: "Giriş Efekti (Fade In)", tier: "FREE" }
        ];
  });
  
  const [starterAnims, setStarterAnims] = useState<any[]>(() => {
    return initialSettings["animations_starter"] 
      ? JSON.parse(initialSettings["animations_starter"]) 
      : [
          { id: "anim-hover-wobble", label: "Sallanma (Hover Wobble)", tier: "STARTER" },
          { id: "anim-bounce-infinite", label: "Zıplama (Bounce)", tier: "STARTER" },
          { id: "anim-shake-horizontal", label: "Sarsıntı (Hover Shake)", tier: "STARTER" },
          { id: "anim-neon-glow-emerald", label: "Yeşil Neon (Emerald Glow)", tier: "STARTER" },
          { id: "anim-border-draw", label: "Kenarlık Çizgisi (Border Draw)", tier: "STARTER" }
        ];
  });

  const [creatorAnims, setCreatorAnims] = useState<any[]>(() => {
    return initialSettings["animations_creator"] 
      ? JSON.parse(initialSettings["animations_creator"]) 
      : [
          { id: "anim-rgb-wave", label: "🔥 RGB Dalga (RGB Wave)", tier: "CREATOR" },
          { id: "anim-holographic", label: "✨ Hologram (Holographic)", tier: "CREATOR" },
          { id: "anim-neon-pulse", label: "⚡ Neon Nabız (Neon Pulse)", tier: "CREATOR" },
          { id: "anim-float-3d", label: "💎 3D Havada Kalma (3D Float)", tier: "CREATOR" },
          { id: "anim-magnetic", label: "🧲 Manyetik Aura (Magnetic)", tier: "CREATOR" }
        ];
  });

  // Animation Creator fields
  const [newAnimId, setNewAnimId] = useState("");
  const [newAnimLabel, setNewAnimLabel] = useState("");
  const [newAnimPlan, setNewAnimPlan] = useState<"FREE" | "STARTER" | "CREATOR">("FREE");

  // Legal Pages State
  const [privacyContent, setPrivacyContent] = useState(
    initialSettings["page_privacy_policy"] ||
    `<h2>1. Giriş</h2>\n<p>Creator.Hub olarak gizliliğinize saygı duyuyor ve kişisel verilerinizin korunmasına önem veriyoruz.</p>\n\n<h2>2. Topladığımız Veriler</h2>\n<p>Hesap bilgileri, profil bilgileri ve kullanım verileri.</p>\n\n<h2>3. İletişim</h2>\n<p>Sorularınız için: <a href="mailto:privacy@creator.hub">privacy@creator.hub</a></p>`
  );
  const [cookieContent, setCookieContent] = useState(
    initialSettings["page_cookie_policy"] ||
    `<h2>1. Çerezler Nedir?</h2>\n<p>Çerezler, web sitelerinin tarayıcınıza yerleştirdiği küçük metin dosyalarıdır.</p>\n\n<h2>2. Kullandığımız Çerezler</h2>\n<p>Zorunlu çerezler ve analitik çerezler kullanıyoruz.</p>\n\n<h2>3. İletişim</h2>\n<p>Sorularınız için: <a href="mailto:privacy@creator.hub">privacy@creator.hub</a></p>`
  );

  // Dynamic Settings Control Panel States
  const [settingsMap, setSettingsMap] = useState<Record<string, string>>(initialSettings);
  const [newCodeKey, setNewCodeKey] = useState("");
  const [newCodeVal, setNewCodeVal] = useState("");
  const [newCodeDesc, setNewCodeDesc] = useState("");
  const [codeSearchQuery, setCodeSearchQuery] = useState("");

  const handleAddBg = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBgName || !newBgCss) return;

    const newBg = {
      id: "bg-" + Math.random().toString(36).substring(2, 9),
      name: newBgName,
      css: newBgCss
    };

    if (newBgPlan === "FREE") {
      setFreeBgs([...freeBgs, newBg]);
    } else if (newBgPlan === "STARTER") {
      setStarterBgs([...starterBgs, newBg]);
    } else {
      setCreatorBgs([...creatorBgs, newBg]);
    }

    setNewBgName("");
    setNewBgCss("");
    setSuccessMsg(lang === "tr" ? "Arka plan listeye eklendi! Kaydetmek için aşağıdaki butona tıklayın." : "Background added to list! Click Save at the bottom to write to DB.");
  };

  const handleDeleteBg = (id: string, plan: "FREE" | "STARTER" | "CREATOR") => {
    if (plan === "FREE") {
      setFreeBgs(freeBgs.filter(b => b.id !== id));
    } else if (plan === "STARTER") {
      setStarterBgs(starterBgs.filter(b => b.id !== id));
    } else {
      setCreatorBgs(creatorBgs.filter(b => b.id !== id));
    }
  };

  const handleSaveBackgrounds = () => {
    setErrorMsg("");
    setSuccessMsg("");

    startTransition(async () => {
      try {
        await saveGlobalSetting(adminUserId, "backgrounds_free", JSON.stringify(freeBgs));
        await saveGlobalSetting(adminUserId, "backgrounds_starter", JSON.stringify(starterBgs));
        await saveGlobalSetting(adminUserId, "backgrounds_creator", JSON.stringify(creatorBgs));
        setSuccessMsg(lang === "tr" ? "Tüm özel arka plan modelleri veritabanına başarıyla kaydedildi!" : "All premium backgrounds successfully written to database!");
      } catch (err: any) {
        setErrorMsg(err.message || "Failed to save custom backgrounds.");
      }
    });
  };

  const handleAddAnim = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAnimId || !newAnimLabel) return;

    const formattedId = newAnimId.trim().toLowerCase().replace(/[^a-z0-9_-]/g, "-");
    const formattedIdWithPrefix = formattedId.startsWith("anim-") ? formattedId : `anim-${formattedId}`;

    const newAnim = {
      id: formattedIdWithPrefix,
      label: newAnimLabel,
      tier: newAnimPlan,
      giftLabel: newAnimPlan === "FREE" && newAnimGiftLabel ? newAnimGiftLabel : null
    };

    if (newAnimPlan === "FREE") {
      setFreeAnims([...freeAnims, newAnim]);
    } else if (newAnimPlan === "STARTER") {
      setStarterAnims([...starterAnims, newAnim]);
    } else {
      setCreatorAnims([...creatorAnims, newAnim]);
    }

    setNewAnimId("");
    setNewAnimLabel("");
    setNewAnimGiftLabel("");
    setSuccessMsg(lang === "tr" ? "Animasyon listeye eklendi! Kaydetmek için aşağıdaki butona tıklayın." : "Animation added to list! Click Save at the bottom to write to DB.");
  };

  const handleUpdateAnim = (id: string, label: string, tier: string, giftLabel?: string) => {
    // Find the animation
    const inFree = freeAnims.find(a => a.id === id);
    const inStarter = starterAnims.find(a => a.id === id);
    const inCreator = creatorAnims.find(a => a.id === id);

    const originalTier = inFree ? "FREE" : inStarter ? "STARTER" : "CREATOR";
    const currentObj = inFree || inStarter || inCreator;

    if (!currentObj) return;

    const updatedAnim = {
      ...currentObj,
      label,
      tier,
      giftLabel: tier === "FREE" ? (giftLabel || null) : null
    };

    // Remove from original tier array
    if (originalTier === "FREE") setFreeAnims(freeAnims.filter(a => a.id !== id));
    else if (originalTier === "STARTER") setStarterAnims(starterAnims.filter(a => a.id !== id));
    else setCreatorAnims(creatorAnims.filter(a => a.id !== id));

    // Add to new tier array
    if (tier === "FREE") setFreeAnims(prev => [...prev.filter(a => a.id !== id), updatedAnim]);
    else if (tier === "STARTER") setStarterAnims(prev => [...prev.filter(a => a.id !== id), updatedAnim]);
    else setCreatorAnims(prev => [...prev.filter(a => a.id !== id), updatedAnim]);

    setSuccessMsg(lang === "tr" ? "Animasyon güncellendi! Kaydetmek için yukarıdaki veya aşağıdaki kaydet butonuna tıklayın." : "Animation updated! Click Save to write to DB.");
  };

  const handleDeleteAnim = (id: string, plan: "FREE" | "STARTER" | "CREATOR") => {
    if (plan === "FREE") {
      setFreeAnims(freeAnims.filter(a => a.id !== id));
    } else if (plan === "STARTER") {
      setStarterAnims(starterAnims.filter(a => a.id !== id));
    } else {
      setCreatorAnims(creatorAnims.filter(a => a.id !== id));
    }
  };

  const handleSaveAnimations = () => {
    setErrorMsg("");
    setSuccessMsg("");

    startTransition(async () => {
      try {
        await saveGlobalSetting(adminUserId, "animations_free", JSON.stringify(freeAnims));
        await saveGlobalSetting(adminUserId, "animations_starter", JSON.stringify(starterAnims));
        await saveGlobalSetting(adminUserId, "animations_creator", JSON.stringify(creatorAnims));
        setSuccessMsg(lang === "tr" ? "Tüm animasyon modelleri veritabanına başarıyla kaydedildi!" : "All animations successfully saved to database!");
      } catch (err: any) {
        setErrorMsg(err.message || "Failed to save animations.");
      }
    });
  };

  const handleAddFont = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFontName || !newFontValue || !newFontTier) return;
    setErrorMsg("");
    setSuccessMsg("");

    startTransition(async () => {
      try {
        const giftLabelToSave = newFontTier === "FREE" ? newFontGiftLabel : undefined;
        await adminAddFont(adminUserId, newFontName, newFontValue, newFontTier, giftLabelToSave);
        
        // Refresh local fonts list
        const tempId = Math.random().toString();
        setFonts([
          {
            id: tempId,
            name: newFontName,
            value: newFontValue,
            tier: newFontTier,
            giftLabel: giftLabelToSave || null,
            createdAt: new Date().toISOString()
          },
          ...fonts
        ]);

        setNewFontName("");
        setNewFontValue("");
        setNewFontTier("FREE");
        setNewFontGiftLabel("");
        setSuccessMsg(
          lang === "tr"
            ? `"${newFontName}" yazı tipi başarıyla kütüphaneye eklendi! Google Fonts CDN preloading anında aktif edildi.`
            : `"${newFontName}" typography style successfully registered in the platform library!`
        );
      } catch (err: any) {
        setErrorMsg(err.message || "Failed to add font");
      }
    });
  };

  const handleDeleteFont = async (id: string, fontName: string) => {
    setErrorMsg("");
    setSuccessMsg("");

    startTransition(async () => {
      try {
        await adminDeleteFont(adminUserId, id);
        setFonts(fonts.filter(f => f.id !== id));
        setSuccessMsg(
          lang === "tr"
            ? `"${fontName}" yazı tipi başarıyla silindi.`
            : `"${fontName}" typography style successfully removed.`
        );
      } catch (err: any) {
        setErrorMsg(err.message || "Failed to delete font");
      }
    });
  };

  const handleUpdateFont = async (id: string, name: string, value: string, tier: string, giftLabel?: string) => {
    setErrorMsg("");
    setSuccessMsg("");

    startTransition(async () => {
      try {
        await adminUpdateFont(adminUserId, id, name, value, tier, giftLabel);
        setFonts(fonts.map(f => f.id === id ? { ...f, name, value, tier, giftLabel: giftLabel || null } : f));
        setSuccessMsg(
          lang === "tr"
            ? "Yazı tipi başarıyla güncellendi."
            : "Typography style successfully updated."
        );
      } catch (err: any) {
        setErrorMsg(err.message || "Failed to update font");
      }
    });
  };

  const handleToggleBan = (userId: string, currentBanStatus: boolean) => {
    setErrorMsg("");
    setSuccessMsg("");
    setActiveUserMenu(null);

    startTransition(async () => {
      try {
        await adminToggleBanUser(adminUserId, userId, !currentBanStatus);
        setUsers(
          users.map((u) => (u.id === userId ? { ...u, isBanned: !currentBanStatus } : u))
        );
        setSuccessMsg(lang === "tr" ? "Kullanıcının yasaklanma durumu başarıyla güncellendi." : "User ban status updated successfully.");
      } catch (err: any) {
        setErrorMsg(err.message || "Failed to update ban status");
      }
    });
  };

  const handlePendingPlanChange = (userId: string, newPlan: string) => {
    setPendingPlans(prev => ({ ...prev, [userId]: newPlan }));
    setUsers(users.map((u) => (u.id === userId ? { ...u, plan: newPlan } : u)));
  };

  const handleSaveUserPlans = () => {
    if (Object.keys(pendingPlans).length === 0) return;
    setErrorMsg("");
    setSuccessMsg("");

    startTransition(async () => {
      try {
        for (const [userId, newPlan] of Object.entries(pendingPlans)) {
          await adminChangeUserPlan(adminUserId, userId, newPlan);
        }
        setPendingPlans({});
        setSuccessMsg(lang === "tr" ? "Kullanıcı üyelik planı değişiklikleri başarıyla kaydedildi." : "User subscription plan changes saved successfully.");
      } catch (err: any) {
        setErrorMsg(err.message || "Failed to save user plan changes");
      }
    });
  };

  const handleToggleRole = (userId: string, currentRole: string) => {
    setErrorMsg("");
    setSuccessMsg("");
    setActiveUserMenu(null);
    const newRole = currentRole === "ADMIN" ? "USER" : "ADMIN";

    startTransition(async () => {
      try {
        await adminToggleUserRole(adminUserId, userId, newRole);
        setUsers(users.map((u) => (u.id === userId ? { ...u, role: newRole } : u)));
        setSuccessMsg(lang === "tr" ? `Kullanıcı rolü başarıyla ${newRole} olarak güncellendi.` : `User role successfully changed to ${newRole}.`);
      } catch (err: any) {
        setErrorMsg(err.message || "Failed to toggle role");
      }
    });
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    startTransition(async () => {
      try {
        await saveGlobalSetting(adminUserId, "payment_link_starter", starterLink);
        await saveGlobalSetting(adminUserId, "payment_link_creator", creatorLink);
        await saveGlobalSetting(adminUserId, "payment_link_pro", proLink);
        await saveGlobalSetting(adminUserId, "price_starter", priceStarter);
        await saveGlobalSetting(adminUserId, "price_creator", priceCreator);
        await saveGlobalSetting(adminUserId, "price_pro", pricePro);
        setSuccessMsg(lang === "tr" ? "Global ayarlar ve fiyatlar başarıyla kaydedildi!" : "Global settings and prices updated successfully!");
      } catch (err: any) {
        setErrorMsg(err.message || "Failed to save settings");
      }
    });
  };

  const handleSaveBrandingSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    startTransition(async () => {
      try {
        await saveGlobalSetting(adminUserId, "site_title", siteTitle);
        await saveGlobalSetting(adminUserId, "site_logo", siteLogo);
        await saveGlobalSetting(adminUserId, "site_favicon", siteFavicon);
        await saveGlobalSetting(adminUserId, "hero_title", heroTitle);
        await saveGlobalSetting(adminUserId, "hero_subtitle", heroSubtitle);
        await saveGlobalSetting(adminUserId, "accent_color", accentColor);

        // Advanced Visuals
        await saveGlobalSetting(adminUserId, "light_mode_bg", lightModeBg);
        await saveGlobalSetting(adminUserId, "dark_mode_bg", darkModeBg);
        await saveGlobalSetting(adminUserId, "footer_copyright", footerCopyright);
        await saveGlobalSetting(adminUserId, "custom_css", customCSS);

        setSuccessMsg(lang === "tr" ? "Platform görsel marka kimliği, Favicon ve tema ayarları başarıyla güncellendi!" : "Global brand assets, logo, favicon, and theme styles saved successfully!");
      } catch (err: any) {
        setErrorMsg(err.message || "Failed to save branding settings");
      }
    });
  };

  const handleSaveLegalPages = () => {
    setErrorMsg("");
    setSuccessMsg("");

    startTransition(async () => {
      try {
        await saveGlobalSetting(adminUserId, "page_privacy_policy", privacyContent);
        await saveGlobalSetting(adminUserId, "page_cookie_policy", cookieContent);
        setSuccessMsg(lang === "tr" ? "Gizlilik ve Çerez Politikası sayfaları başarıyla kaydedildi!" : "Privacy Policy and Cookie Policy pages saved successfully!");
      } catch (err: any) {
        setErrorMsg(err.message || "Failed to save legal pages");
      }
    });
  };

  const handleClearCache = () => {
    setErrorMsg("");
    setSuccessMsg("");

    startTransition(async () => {
      try {
        await adminClearCache(adminUserId);
        setSuccessMsg(lang === "tr" ? "Sistem önbelleği (Next.js Cache) başarıyla temizlendi!" : "System Next.js cache has been successfully purged!");
      } catch (err: any) {
        setErrorMsg(err.message || "Failed to clear cache.");
      }
    });
  };

  const handleSaveCode = (key: string, value: string) => {
    setErrorMsg("");
    setSuccessMsg("");

    startTransition(async () => {
      try {
        await saveGlobalSetting(adminUserId, key, value);
        setSettingsMap(prev => ({ ...prev, [key]: value }));
        setSuccessMsg(lang === "tr" ? `"${key}" değişkeni başarıyla güncellendi!` : `Setting "${key}" updated successfully!`);
      } catch (err: any) {
        setErrorMsg(err.message || "Failed to update setting");
      }
    });
  };

  const handleDeleteCode = (key: string) => {
    if (!confirm(lang === "tr" ? `"${key}" değişkenini silmek istediğinize emin misiniz?` : `Are you sure you want to delete setting "${key}"?`)) {
      return;
    }
    setErrorMsg("");
    setSuccessMsg("");

    startTransition(async () => {
      try {
        await adminDeleteGlobalSetting(adminUserId, key);
        
        let currentMetadata: Record<string, { title: string; desc: string }> = {};
        if (settingsMap["settings_metadata"]) {
          try {
            currentMetadata = JSON.parse(settingsMap["settings_metadata"]);
          } catch (e) {}
        }
        delete currentMetadata[key];
        const updatedMetadataStr = JSON.stringify(currentMetadata);
        
        await saveGlobalSetting(adminUserId, "settings_metadata", updatedMetadataStr);

        setSettingsMap(prev => {
          const next = { ...prev };
          delete next[key];
          next["settings_metadata"] = updatedMetadataStr;
          return next;
        });

        setSuccessMsg(lang === "tr" ? `"${key}" değişkeni başarıyla silindi!` : `Setting "${key}" was successfully deleted!`);
      } catch (err: any) {
        setErrorMsg(err.message || "Failed to delete setting");
      }
    });
  };

  const handleCreateCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCodeKey || !newCodeVal) return;

    const cleanedKey = newCodeKey.trim().toLowerCase().replace(/[^a-z0-9_-]/g, "_");
    if (!cleanedKey) return;

    setErrorMsg("");
    setSuccessMsg("");

    startTransition(async () => {
      try {
        await saveGlobalSetting(adminUserId, cleanedKey, newCodeVal);

        let currentMetadata: Record<string, { title: string; desc: string }> = {};
        if (settingsMap["settings_metadata"]) {
          try {
            currentMetadata = JSON.parse(settingsMap["settings_metadata"]);
          } catch (e) {}
        }
        currentMetadata[cleanedKey] = {
          title: cleanedKey,
          desc: newCodeDesc || (lang === "tr" ? "Özel tanımlanmış admin değişkeni." : "Custom declared administrator variable.")
        };
        const updatedMetadataStr = JSON.stringify(currentMetadata);
        await saveGlobalSetting(adminUserId, "settings_metadata", updatedMetadataStr);

        setSettingsMap(prev => ({
          ...prev,
          [cleanedKey]: newCodeVal,
          "settings_metadata": updatedMetadataStr
        }));

        setNewCodeKey("");
        setNewCodeVal("");
        setNewCodeDesc("");
        setSuccessMsg(lang === "tr" ? `Yeni "${cleanedKey}" değişkeni başarıyla oluşturuldu!` : `New setting "${cleanedKey}" created successfully!`);
      } catch (err: any) {
        setErrorMsg(err.message || "Failed to create setting");
      }
    });
  };

  // Filter users based on query and planFilter
  const filteredUsers = users.filter((u) => {
    const queryMatch =
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.username && u.username.toLowerCase().includes(searchQuery.toLowerCase()));
    
    if (planFilter === "ALL") return queryMatch;
    return queryMatch && u.plan === planFilter;
  });

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 md:p-8 transition-colors duration-500 relative overflow-hidden font-sans ${
      isDark 
        ? "bg-zinc-950 text-white" 
        : "bg-[#f5f3ff] bg-[radial-gradient(circle_at_top_left,_#fef08a_0%,_transparent_25%),radial-gradient(circle_at_bottom_right,_#fbcfe8_0%,_transparent_30%),radial-gradient(circle_at_top_right,_#e9d5ff_0%,_transparent_25%)] text-zinc-900"
    }`}>
      <GlobalOverlayManager onStateChange={handleStateChange} />

      {/* Main Glassmorphic Card Container */}
      <div className="w-full max-w-7xl h-[780px] rounded-[32px] shadow-[0_30px_80px_rgba(0,0,0,0.06)] border flex overflow-hidden backdrop-blur-xl bg-white/80 border-white/60">
        
        {/* Sidebar Nav (Ehsanmoin style) */}
        <aside className={`w-64 shrink-0 p-6 flex flex-col justify-between border-r ${
          isDark ? "border-zinc-800 bg-zinc-950/20" : "border-zinc-150 bg-white/40"
        }`}>
          <div className="space-y-8">
            {/* Logo */}
            <div className="flex items-center gap-2.5">
              {siteLogo ? (
                <img src={siteLogo} alt="Site Logo" className="w-8.5 h-8.5 rounded-xl object-contain" />
              ) : (
                <div className="w-8.5 h-8.5 rounded-xl bg-rose-500 flex items-center justify-center text-white font-black text-sm shadow-md shadow-rose-500/20">CH</div>
              )}
              <span className="font-extrabold text-lg text-zinc-800 tracking-tight flex items-center gap-0.5">
                {siteTitle?.trim() || "Creator."}
                <span className="text-rose-500 font-black">hub</span>
              </span>
            </div>


            {/* Sidebar navigation list */}
            <nav className="space-y-1">
              <button
                onClick={() => setSidebarTab("directory")}
                className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
                  sidebarTab === "directory"
                    ? "bg-rose-50 border-l-4 border-rose-500 text-rose-600"
                    : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100/50"
                }`}
              >
                <Users className="h-4 w-4" />
                {lang === "tr" ? "Kullanıcı Rehberi" : "User Directory"}
              </button>

              <button
                onClick={() => setSidebarTab("stats")}
                className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
                  sidebarTab === "stats"
                    ? "bg-rose-50 border-l-4 border-rose-500 text-rose-600"
                    : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100/50"
                }`}
              >
                <TrendingUp className="h-4 w-4" />
                {lang === "tr" ? "İstatistikler" : "Stats & Analytics"}
              </button>

              <button
                onClick={() => setSidebarTab("backgrounds")}
                className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
                  sidebarTab === "backgrounds"
                    ? "bg-rose-50 border-l-4 border-rose-500 text-rose-600"
                    : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100/50"
                }`}
              >
                <Palette className="h-4 w-4" />
                {lang === "tr" ? "Arka Plan Tasarımcısı" : "Backdrop Designer"}
              </button>

              <button
                onClick={() => setSidebarTab("homepage")}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  sidebarTab === "homepage"
                    ? activeTheme === "dark" ? "bg-white/10 text-white" : "bg-zinc-200 text-zinc-900"
                    : activeTheme === "dark" ? "text-zinc-400 hover:text-white hover:bg-white/5" : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Grid className="h-4 w-4" />
                  Homepage
                </div>
              </button>

              <button
                onClick={() => setSidebarTab("settings")}
                className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
                  sidebarTab === "settings"
                    ? "bg-rose-50 border-l-4 border-rose-500 text-rose-600"
                    : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100/50"
                }`}
              >
                <Settings className="h-4 w-4" />
                {lang === "tr" ? "Sistem Ayarları" : "System Settings"}
              </button>

              <button
                onClick={() => setSidebarTab("legal")}
                className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
                  sidebarTab === "legal"
                    ? "bg-rose-50 border-l-4 border-rose-500 text-rose-600"
                    : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100/50"
                }`}
              >
                <FileText className="h-4 w-4" />
                {lang === "tr" ? "Yasal Sayfalar" : "Legal Pages"}
              </button>

              <button
                onClick={() => setSidebarTab("code")}
                className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
                  sidebarTab === "code"
                    ? "bg-rose-50 border-l-4 border-rose-500 text-rose-600"
                    : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100/50"
                }`}
              >
                <Code className="h-4 w-4" />
                {lang === "tr" ? "Kod & Değişkenler" : "Code & Configs"}
              </button>

              <button
                onClick={() => setSidebarTab("fonts")}
                className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
                  sidebarTab === "fonts"
                    ? "bg-rose-50 border-l-4 border-rose-500 text-rose-600"
                    : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100/50"
                }`}
              >
                <Sparkles className="h-4 w-4" />
                {lang === "tr" ? "Yazı Tipi Yönetimi" : "Font Management"}
              </button>

              <button
                onClick={() => setSidebarTab("animations")}
                className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
                  sidebarTab === "animations"
                    ? "bg-rose-50 border-l-4 border-rose-500 text-rose-600"
                    : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100/50"
                }`}
              >
                <Grid className="h-4 w-4" />
                {lang === "tr" ? "Animasyon Tasarımcısı" : "Animation Designer"}
              </button>
            </nav>
          </div>

          {/* Maintenance Mode switcher matching "Busy Mode" from mockup */}
          <div className="pt-4 border-t border-zinc-100 flex items-center justify-between">
            <span className="text-[11px] font-bold text-zinc-550">
              {lang === "tr" ? "Bakım Modu" : "Busy Mode"}
            </span>
            <button
              onClick={() => setIsMaintenanceMode(!isMaintenanceMode)}
              className={`w-10 h-5.5 rounded-full p-0.5 transition-colors duration-300 relative focus:outline-none ${
                isMaintenanceMode ? "bg-rose-500" : "bg-zinc-200"
              }`}
            >
              <div className={`w-4.5 h-4.5 rounded-full bg-white shadow-sm transform transition-transform duration-300 ${
                isMaintenanceMode ? "translate-x-4.5" : "translate-x-0"
              }`} />
            </button>
          </div>
        </aside>

        {/* Workspace Area */}
        <main className="flex-1 flex flex-col min-w-0">
          
          {/* Header Bar */}
          <header className={`px-8 py-5 border-b flex items-center justify-between ${
            isDark ? "border-zinc-800" : "border-zinc-150"
          }`}>
            {/* Search Input matching top left search from mockup */}
            <div className={`flex items-center rounded-2xl border px-3.5 py-2 w-64 ${
              isDark ? "bg-zinc-900 border-zinc-800" : "bg-zinc-50 border-zinc-200"
            }`}>
              <Search className="h-4 w-4 text-zinc-400 mr-2 shrink-0" />
              <input
                type="text"
                placeholder={lang === "tr" ? "E-posta veya kullanıcı adı..." : "Search..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent border-none outline-none text-xs w-full text-inherit placeholder-zinc-400"
              />
            </div>

            {/* Quick Actions (Cache Clear & View Site) */}
            <div className="flex items-center gap-3">
              {/* Siteyi Görüntüle / View Site */}
              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs font-bold bg-white text-zinc-700 hover:text-zinc-950 border border-zinc-200 shadow-sm hover:shadow transition-all cursor-pointer"
              >
                <ExternalLink className="h-3.5 w-3.5 text-zinc-550" />
                {lang === "tr" ? "Siteyi Görüntüle" : "View Site"}
              </a>

              {/* Önbelleği Temizle / Clear Cache */}
              <button
                onClick={handleClearCache}
                disabled={isPending}
                className="flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs font-bold bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-100 shadow-sm hover:shadow transition-all cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${isPending ? "animate-spin" : ""}`} />
                {lang === "tr" ? "Önbelleği Temizle" : "Clear Cache"}
              </button>
            </div>

            {/* Right-aligned Notifications, profile badge */}
            <div className="flex items-center gap-6">
              {/* Notification icon */}
              <div className="relative cursor-pointer">
                <Bell className="h-4.5 w-4.5 text-zinc-500 hover:text-rose-500 transition-colors" />
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-rose-500" />
              </div>

              {/* Admin Profile dropdown */}
              <div className="flex items-center gap-3 border-l pl-6 border-zinc-100">
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-rose-500 to-pink-500 flex items-center justify-center text-white font-extrabold text-xs shadow-md shadow-rose-500/10 relative">
                  E
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white" />
                </div>
                <div className="hidden sm:block text-left">
                  <div className="text-xs font-black text-zinc-800">Erdem</div>
                  <div className="text-[10px] text-zinc-400 font-extrabold uppercase tracking-wider">Super Admin</div>
                </div>
              </div>
            </div>
          </header>

          {/* Body Content Container */}
          <div className="p-8 flex-1 overflow-y-auto">
            {/* Notifications */}
            {errorMsg && (
              <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-650 text-xs font-semibold mb-6">
                {errorMsg}
              </div>
            )}
            {successMsg && (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-250 text-emerald-650 text-xs font-semibold mb-6">
                {successMsg}
              </div>
            )}

            {sidebarTab === "directory" && (
              /* GORGEOUS DIRECTORY VIEW (Ehsanmoin Table Style) */
              <div className="space-y-6">
                {/* Title and Filter Pills */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h2 className="text-2xl font-black text-zinc-850 tracking-tight">
                      {lang === "tr" ? "Kayıtlı Kullanıcı Listesi" : "Registered User Directory"}
                    </h2>
                    <p className="text-xs text-zinc-400 font-bold mt-1">
                      {lang === "tr" ? "Sistemdeki tüm kayıtlı yaratıcıların üyeliklerini ve rollerini yönetin." : "Manage subscriptions, roles, and suspension blocks."}
                    </p>
                  </div>
                  
                  {/* Test Simulator back Link */}
                  <Link
                    href="/dashboard"
                    className="flex items-center gap-1.5 px-4.5 py-2.5 rounded-2xl text-xs font-bold bg-zinc-900 text-white hover:bg-zinc-850 shadow-md shadow-zinc-950/10 cursor-pointer"
                  >
                    <ArrowRight className="h-3.5 w-3.5 rotate-180" />
                    {lang === "tr" ? "Stüdyoya Git" : "Back to Studio"}
                  </Link>
                </div>

                {/* Filter tabs and Save Changes button */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-1 gap-4">
                  <div className="flex gap-6 text-xs font-bold text-zinc-400">
                    <button
                      onClick={() => setPlanFilter("ALL")}
                      className={`pb-2.5 relative cursor-pointer ${planFilter === "ALL" ? "text-rose-500 border-b-2 border-rose-500 font-black" : "hover:text-zinc-700"}`}
                    >
                      {lang === "tr" ? "Tüm Yaratıcılar" : "All Members"}
                    </button>
                    <button
                      onClick={() => setPlanFilter("FREE")}
                      className={`pb-2.5 relative cursor-pointer ${planFilter === "FREE" ? "text-rose-500 border-b-2 border-rose-500 font-black" : "hover:text-zinc-700"}`}
                    >
                      FREE
                    </button>
                    <button
                      onClick={() => setPlanFilter("STARTER")}
                      className={`pb-2.5 relative cursor-pointer ${planFilter === "STARTER" ? "text-rose-500 border-b-2 border-rose-500 font-black" : "hover:text-zinc-700"}`}
                    >
                      STARTER
                    </button>
                    <button
                      onClick={() => setPlanFilter("CREATOR")}
                      className={`pb-2.5 relative cursor-pointer ${planFilter === "CREATOR" ? "text-rose-500 border-b-2 border-rose-500 font-black" : "hover:text-zinc-700"}`}
                    >
                      CREATOR
                    </button>
                  </div>

                  {Object.keys(pendingPlans).length > 0 && (
                    <button
                      onClick={handleSaveUserPlans}
                      disabled={isPending}
                      className="flex items-center gap-2 px-5 py-2 rounded-2xl text-xs font-black bg-rose-500 hover:bg-rose-600 text-white shadow-md shadow-rose-500/10 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-all animate-bounce"
                    >
                      {isPending ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Check className="h-3.5 w-3.5" />
                      )}
                      {lang === "tr" ? "Değişiklikleri Kaydet" : "Save Changes"}
                      <span className="bg-white/20 px-1.5 py-0.5 rounded-full text-[10px]">
                        {Object.keys(pendingPlans).length}
                      </span>
                    </button>
                  )}
                </div>

                {/* Spacious elegant table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b text-zinc-400 uppercase tracking-wider text-[10px] font-extrabold">
                        <th className="py-4 px-4">{lang === "tr" ? "Kreatör" : "Creator Profile"}</th>
                        <th className="py-4 px-4">{lang === "tr" ? "Kullanıcı Adı" : "Username"}</th>
                        <th className="py-4 px-4">{lang === "tr" ? "Üyelik Planı" : "Tier Plan"}</th>
                        <th className="py-4 px-4">{lang === "tr" ? "Satın Alım" : "Purchase Date"}</th>
                        <th className="py-4 px-4">{lang === "tr" ? "Kalan Süre" : "Remaining Time"}</th>
                        <th className="py-4 px-4">{lang === "tr" ? "Rol" : "Role"}</th>
                        <th className="py-4 px-4 text-center">{lang === "tr" ? "Platform Durumu" : "Status"}</th>
                        <th className="py-4 px-4 text-right">{lang === "tr" ? "Aksiyon" : "Action"}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.length === 0 ? (
                        <tr>
                          <td colSpan={8} className="py-16 text-center text-zinc-400 italic">
                            {lang === "tr" ? "Aranan kriterlere uygun kullanıcı bulunamadı." : "No creators match this selection."}
                          </td>
                        </tr>
                      ) : (
                        filteredUsers.map((user) => {
                          const getRemainingText = (expiresAt: string | null) => {
                            if (!expiresAt) return "-";
                            const diff = new Date(expiresAt).getTime() - new Date().getTime();
                            if (diff <= 0) return lang === "tr" ? "Süresi Doldu" : "Expired";
                            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
                            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                            return lang === "tr" ? `${days}g ${hours}s ${minutes}d` : `${days}d ${hours}h ${minutes}m`;
                          };

                          return (
                            <tr
                              key={user.id}
                              className={`border-b transition-all relative ${
                                user.isBanned 
                                  ? "bg-red-50/20 opacity-80" 
                                  : "hover:bg-zinc-50/50"
                              }`}
                            >
                              {/* Email/ID */}
                              <td className="py-4 px-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-rose-100 to-rose-200 border border-rose-250 flex items-center justify-center text-rose-500 font-bold shrink-0">
                                    {user.email.substring(0, 1).toUpperCase()}
                                  </div>
                                  <div>
                                    <div className="font-extrabold text-zinc-800 text-sm">{user.email}</div>
                                    <div className="text-[10px] text-zinc-400 font-mono mt-0.5">{user.id}</div>
                                  </div>
                                </div>
                              </td>

                              {/* Username */}
                              <td className="py-4 px-4 font-semibold text-zinc-700">
                                {user.username ? `@${user.username}` : <span className="text-zinc-300 italic font-normal">None</span>}
                              </td>

                              {/* Subscription select */}
                              <td className="py-4 px-4">
                                <select
                                  value={user.plan}
                                  onChange={(e) => handlePendingPlanChange(user.id, e.target.value)}
                                  disabled={isPending}
                                  className="px-2.5 py-1.5 rounded-xl border border-zinc-200 text-xs font-black text-rose-500 outline-none bg-white cursor-pointer hover:border-rose-300 focus:ring-2 focus:ring-rose-500/10 transition-all"
                                >
                                  <option value="FREE">FREE</option>
                                  <option value="STARTER">STARTER</option>
                                  <option value="CREATOR">CREATOR</option>
                                  <option value="PRO_BUSINESS">PRO BUSINESS</option>
                                </select>
                              </td>

                              {/* Purchase date */}
                              <td className="py-4 px-4 font-mono text-[10px] text-zinc-500 whitespace-nowrap">
                                {user.planStartedAt ? (
                                  <div>
                                    <span className="font-semibold text-zinc-700 block">
                                      {new Date(user.planStartedAt).toLocaleDateString("tr-TR")}
                                    </span>
                                    <span className="text-[9px] text-zinc-400">
                                      {new Date(user.planStartedAt).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })}
                                    </span>
                                  </div>
                                ) : (
                                  <span className="text-zinc-300 italic">-</span>
                                )}
                              </td>

                              {/* Remaining time */}
                              <td className="py-4 px-4 whitespace-nowrap">
                                {user.planExpiresAt ? (
                                  <div>
                                    <span className="font-extrabold text-purple-600 bg-purple-50 border border-purple-100 px-2 py-0.5 rounded-lg text-[10px] inline-block mb-0.5">
                                      {getRemainingText(user.planExpiresAt)}
                                    </span>
                                    <span className="text-[9px] text-zinc-400 block font-mono">
                                      Bitiş: {new Date(user.planExpiresAt).toLocaleDateString("tr-TR")} {new Date(user.planExpiresAt).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })}
                                    </span>
                                  </div>
                                ) : (
                                  <span className="text-zinc-300 italic">-</span>
                                )}
                              </td>

                            {/* Role Select */}
                            <td className="py-4 px-4">
                              <button
                                onClick={() => handleToggleRole(user.id, user.role)}
                                disabled={isPending}
                                className={`px-2.5 py-1.5 rounded-xl text-[10px] font-bold border transition-colors cursor-pointer ${
                                  user.role === "ADMIN"
                                    ? "bg-red-50 border-red-200 text-red-500 font-extrabold"
                                    : "bg-zinc-50 border-zinc-200 text-zinc-550"
                                }`}
                              >
                                {user.role}
                              </button>
                            </td>

                            {/* Active suspension status */}
                            <td className="py-4 px-4 text-center">
                              {user.isBanned ? (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-[10px] font-black text-red-500 border border-red-200">
                                  <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                                  {lang === "tr" ? "Askıya Alındı" : "Banned"}
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-[10px] font-black text-emerald-500 border border-emerald-200">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                  {lang === "tr" ? "Aktif" : "Active"}
                                </span>
                              )}
                            </td>

                            {/* Action Menu (Ehsanmoin 3-dot style) */}
                            <td className="py-4 px-4 text-right relative">
                              <button
                                onClick={() => setActiveUserMenu(activeUserMenu === user.id ? null : user.id)}
                                className="p-2 rounded-xl hover:bg-zinc-150 transition-colors text-zinc-500 cursor-pointer"
                              >
                                <MoreVertical className="h-4.5 w-4.5" />
                              </button>

                              {/* Dropdown overlay */}
                              {activeUserMenu === user.id && (
                                <>
                                  <div className="fixed inset-0 z-20" onClick={() => setActiveUserMenu(null)} />
                                  <div className="absolute right-4 mt-2 w-40 rounded-2xl bg-white border border-zinc-150 shadow-lg p-2 text-left z-30 space-y-1">
                                    <button
                                      onClick={() => handleToggleBan(user.id, user.isBanned)}
                                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-2 ${
                                        user.isBanned
                                          ? "text-emerald-600 hover:bg-emerald-50"
                                          : "text-red-650 hover:bg-red-50"
                                      }`}
                                    >
                                      {user.isBanned ? <UserCheck className="h-3.5 w-3.5" /> : <UserX className="h-3.5 w-3.5" />}
                                      {user.isBanned ? (lang === "tr" ? "Etkinleştir" : "Unban") : (lang === "tr" ? "Askıya Al" : "Suspend")}
                                    </button>
                                    <button
                                      onClick={() => handleToggleRole(user.id, user.role)}
                                      className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-zinc-700 hover:bg-zinc-50 flex items-center gap-2"
                                    >
                                      <ShieldAlert className="h-3.5 w-3.5 text-zinc-400" />
                                      {lang === "tr" ? "Rol Değiştir" : "Toggle Role"}
                                    </button>
                                  </div>
                                </>
                              )}
                            </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {sidebarTab === "stats" && (
              /* GORGEOUS METRIC CARDS AND CHARTS */
              <div className="space-y-8 animate-fadeIn">
                <div>
                  <h2 className="text-2xl font-black text-zinc-850 tracking-tight">{lang === "tr" ? "Sistem Genel İstatistikleri" : "Global Platform Analytics"}</h2>
                  <p className="text-xs text-zinc-400 font-bold mt-1">{lang === "tr" ? "SaaS gelirlerini ve kayıt dağılımlarını izleyin." : "Monitor SaaS mock revenues and registrations distribution."}</p>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Card 1 */}
                  <div className="p-6 bg-white border border-zinc-150 rounded-[24px] shadow-sm flex items-center justify-between">
                    <div className="space-y-1">
                      <span className="text-[10px] text-zinc-400 uppercase tracking-widest font-black">{lang === "tr" ? "Toplam Kreatör" : "Total Creators"}</span>
                      <div className="text-3xl font-black text-zinc-800">{stats.totalUsers}</div>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-500">
                      <Users className="h-6 w-6" />
                    </div>
                  </div>

                  {/* Card 2 */}
                  <div className="p-6 bg-white border border-zinc-150 rounded-[24px] shadow-sm flex items-center justify-between">
                    <div className="space-y-1">
                      <span className="text-[10px] text-zinc-400 uppercase tracking-widest font-black">{lang === "tr" ? "Starter Planlar" : "Starter Plans"}</span>
                      <div className="text-3xl font-black text-purple-600">{stats.starterCount}</div>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-600">
                      <CreditCard className="h-6 w-6" />
                    </div>
                  </div>

                  {/* Card 3 */}
                  <div className="p-6 bg-white border border-zinc-150 rounded-[24px] shadow-sm flex items-center justify-between">
                    <div className="space-y-1">
                      <span className="text-[10px] text-zinc-400 uppercase tracking-widest font-black">{lang === "tr" ? "Creator Planlar" : "Creator Plans"}</span>
                      <div className="text-3xl font-black text-fuchsia-600">{stats.creatorCount}</div>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-fuchsia-50 flex items-center justify-center text-fuchsia-650">
                      <Sparkles className="h-6 w-6" />
                    </div>
                  </div>

                  {/* Card 4 */}
                  <div className="p-6 bg-gradient-to-tr from-rose-500 to-pink-500 border-0 rounded-[24px] shadow-sm flex items-center justify-between text-white">
                    <div className="space-y-1">
                      <span className="text-[10px] text-rose-100 uppercase tracking-widest font-black">{lang === "tr" ? "Toplam Simüle Kazanç" : "Total Revenue"}</span>
                      <div className="text-3xl font-black">{stats.totalRevenue}₺</div>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center text-white">
                      <TrendingUp className="h-6 w-6" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {sidebarTab === "backgrounds" && (
              /* CUSTOM BACKGROUND DESIGNER */
              <div className="space-y-8 animate-fadeIn">
                <div>
                  <h2 className="text-2xl font-black text-zinc-850 tracking-tight">{lang === "tr" ? "Arka Plan Tasarım Stüdyosu" : "Backdrop Design Studio"}</h2>
                  <p className="text-xs text-zinc-400 font-bold mt-1">{lang === "tr" ? "Paketlere ait renk geçişlerini (Tailwind) canlı olarak ekleyin veya düzenleyin." : "Manage responsive background CSS configurations."}</p>
                </div>

                {/* Add new background card */}
                <div className="p-6 bg-white border border-zinc-150 rounded-[24px] shadow-sm space-y-6">
                  <div className="flex items-center gap-3">
                    <Palette className="h-5 w-5 text-rose-500" />
                    <h3 className="font-extrabold text-sm text-zinc-800">{lang === "tr" ? "Yeni Arka Plan Degradesi Oluştur" : "Create New Backdrop"}</h3>
                  </div>
                  
                  <form onSubmit={handleAddBg} className="grid md:grid-cols-4 gap-6 items-end">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase text-zinc-400 block">{lang === "tr" ? "Arka Plan Adı" : "Backdrop Title"}</label>
                      <input
                        type="text"
                        value={newBgName}
                        onChange={(e) => setNewBgName(e.target.value)}
                        placeholder="Cyber Solar Flare"
                        className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl outline-none text-xs focus:ring-2 focus:ring-rose-500/10 transition-all text-zinc-750"
                        required
                      />
                    </div>
                    <div className="space-y-1.5 md:col-span-2">
                      <label className="text-[10px] font-black uppercase text-zinc-400 block">{lang === "tr" ? "Tailwind CSS Renk Sınıfları" : "Tailwind CSS Gradients"}</label>
                      <input
                        type="text"
                        value={newBgCss}
                        onChange={(e) => setNewBgCss(e.target.value)}
                        placeholder="bg-gradient-to-tr from-pink-650 via-rose-500 to-yellow-500"
                        className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl outline-none text-xs font-mono focus:ring-2 focus:ring-rose-500/10 transition-all text-zinc-750"
                        required
                      />
                    </div>
                    <div className="space-y-1.5 flex gap-3 items-end">
                      <div className="flex-1 space-y-1.5">
                        <label className="text-[10px] font-black uppercase text-zinc-400 block">{lang === "tr" ? "Hedef Paket" : "Target Plan"}</label>
                        <select
                          value={newBgPlan}
                          onChange={(e) => setNewBgPlan(e.target.value as any)}
                          className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl outline-none text-xs font-bold cursor-pointer text-zinc-750"
                        >
                          <option value="FREE">FREE</option>
                          <option value="STARTER">STARTER</option>
                          <option value="CREATOR">CREATOR</option>
                        </select>
                      </div>
                      <button
                        type="submit"
                        className="px-5 py-3.5 bg-rose-500 hover:bg-rose-600 text-white font-extrabold text-xs rounded-xl shadow-md shadow-rose-500/10 cursor-pointer flex items-center gap-1 shrink-0"
                      >
                        <Plus className="h-4 w-4" />
                        {lang === "tr" ? "Ekle" : "Add"}
                      </button>
                    </div>
                  </form>
                </div>

                {/* List categories grid */}
                <div className="grid lg:grid-cols-3 gap-6">
                  {/* FREE section */}
                  <div className="p-6 bg-white border border-zinc-150 rounded-[24px] shadow-sm space-y-4">
                    <div className="flex justify-between items-center border-b pb-3">
                      <span className="font-extrabold text-sm text-zinc-800">🆓 {lang === "tr" ? "FREE Seçenekleri" : "FREE Choices"}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 bg-zinc-100 rounded-full text-zinc-500 font-bold">{freeBgs.length}</span>
                    </div>
                    <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                      {freeBgs.map((b) => (
                        <div key={b.id} className="p-3 bg-zinc-50/50 rounded-2xl border border-zinc-150 flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3 overflow-hidden">
                            <div className={`w-8.5 h-8.5 rounded-xl border shrink-0 ${b.css}`} />
                            <div className="truncate">
                              <div className="font-extrabold text-xs text-zinc-700">{b.name}</div>
                              <div className="text-[9px] text-zinc-400 font-mono truncate">{b.css}</div>
                            </div>
                          </div>
                          <button
                            onClick={() => handleDeleteBg(b.id, "FREE")}
                            className="p-2 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white border border-red-100 cursor-pointer transition-colors"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* STARTER section */}
                  <div className="p-6 bg-white border border-zinc-150 rounded-[24px] shadow-sm space-y-4">
                    <div className="flex justify-between items-center border-b pb-3">
                      <span className="font-extrabold text-sm text-indigo-600">⚡ {lang === "tr" ? "STARTER Seçenekleri" : "STARTER Choices"}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 bg-indigo-50 rounded-full text-indigo-600 font-bold border border-indigo-100">{starterBgs.length}</span>
                    </div>
                    <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                      {starterBgs.map((b) => (
                        <div key={b.id} className="p-3 bg-zinc-50/50 rounded-2xl border border-zinc-150 flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3 overflow-hidden">
                            <div className={`w-8.5 h-8.5 rounded-xl border shrink-0 ${b.css}`} />
                            <div className="truncate">
                              <div className="font-extrabold text-xs text-zinc-700">{b.name}</div>
                              <div className="text-[9px] text-zinc-400 font-mono truncate">{b.css}</div>
                            </div>
                          </div>
                          <button
                            onClick={() => handleDeleteBg(b.id, "STARTER")}
                            className="p-2 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white border border-red-100 cursor-pointer transition-colors"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* CREATOR section */}
                  <div className="p-6 bg-white border border-zinc-150 rounded-[24px] shadow-sm space-y-4">
                    <div className="flex justify-between items-center border-b pb-3">
                      <span className="font-extrabold text-sm text-fuchsia-600">👑 {lang === "tr" ? "CREATOR Seçenekleri" : "CREATOR Choices"}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 bg-fuchsia-50 rounded-full text-fuchsia-600 font-bold border border-fuchsia-100">{creatorBgs.length}</span>
                    </div>
                    <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                      {creatorBgs.map((b) => (
                        <div key={b.id} className="p-3 bg-zinc-50/50 rounded-2xl border border-zinc-150 flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3 overflow-hidden">
                            <div className={`w-8.5 h-8.5 rounded-xl border shrink-0 ${b.css}`} />
                            <div className="truncate">
                              <div className="font-extrabold text-xs text-zinc-700">{b.name}</div>
                              <div className="text-[9px] text-zinc-400 font-mono truncate">{b.css}</div>
                            </div>
                          </div>
                          <button
                            onClick={() => handleDeleteBg(b.id, "CREATOR")}
                            className="p-2 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white border border-red-100 cursor-pointer transition-colors"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Save to DB */}
                <div className="flex justify-end pt-4 border-t">
                  <button
                    onClick={handleSaveBackgrounds}
                    disabled={isPending}
                    className="px-6 py-4 bg-rose-500 hover:bg-rose-600 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-rose-500/10 cursor-pointer flex items-center gap-2"
                  >
                    {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
                    {lang === "tr" ? "Tüm Arka Plan Ayarlarını Veritabanına Kaydet" : "Save Backgrounds to Database"}
                  </button>
                </div>
              </div>
            )}

            
            {/* --- HOMEPAGE MANAGEMENT (Hoo.be Style) --- */}
            {sidebarTab === "homepage" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold">Landing Page Yönetimi (Hoo.be Stili)</h2>
                  <p className="text-sm mt-1 text-slate-500">
                    Ana sayfa metinlerini, kayan slider (Creator Carousel) ve özellik bloklarını (Zig-zag) yönetin.
                  </p>
                </div>

                {/* Hero Section Ayarları */}
                <div className="p-6 rounded-xl border bg-white border-gray-100 shadow-sm">
                  <h3 className="text-lg font-semibold mb-4 text-slate-900">Hero (Giriş) Alanı</h3>
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700">Ana Başlık (Örn: Your home)</label>
                      <input
                        type="text"
                        value={heroTitle}
                        onChange={(e) => setHeroTitle(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border bg-white border-gray-200 text-slate-900 text-sm"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700">Vurgulu Kelime (Teal Rengi - Örn: on the web)</label>
                      <input
                        type="text"
                        value={settingsMap["hero_highlight"] || "on the web"}
                        onChange={(e) => setSettingsMap(prev => ({ ...prev, hero_highlight: e.target.value }))}
                        className="w-full px-3 py-2 rounded-lg border bg-white border-gray-200 text-slate-900 text-sm"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700">Alt Açıklama (Subtitle)</label>
                      <textarea
                        value={heroSubtitle}
                        onChange={(e) => setHeroSubtitle(e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 rounded-lg border bg-white border-gray-200 text-slate-900 text-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* Slider Linkleri Yönetimi (Yeni İstek) */}
                <div className="p-6 rounded-xl border bg-white border-gray-100 shadow-sm space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">Slider Bağlantıları (Önizleme Link Kartları)</h3>
                    <p className="text-xs text-slate-500 mt-1">Giriş sayfasındaki telefonda görünecek örnek link kartlarını yönetin. (En az 3-4 adet olması önerilir)</p>
                  </div>

                  {/* Yeni Link Ekleme Formu */}
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-4">
                    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Yeni Örnek Link Kartı Ekle</h4>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-slate-650">Link Başlığı</label>
                        <input
                          type="text"
                          placeholder="Örn: Instagram Hesabım"
                          value={newSliderTitle}
                          onChange={(e) => setNewSliderTitle(e.target.value)}
                          className="w-full px-3 py-1.5 rounded-lg border bg-white border-gray-200 text-slate-900 text-xs"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-slate-650">Görsel URL</label>
                        <input
                          type="text"
                          placeholder="Örn: https://images.unsplash.com/..."
                          value={newSliderLink}
                          onChange={(e) => setNewSliderLink(e.target.value)}
                          className="w-full px-3 py-1.5 rounded-lg border bg-white border-gray-200 text-slate-900 text-xs"
                        />
                      </div>
                      <div className="flex items-end">
                        <button
                          type="button"
                          onClick={async () => {
                            if (!newSliderTitle || !newSliderLink) {
                              alert("Başlık ve Görsel URL alanları zorunludur.");
                              return;
                            }
                            setIsUploadingSlider(true);
                            try {
                              const created = await addSliderItem(adminUserId, newSliderTitle, newSliderLink);
                              setSliderItems(prev => [...prev, {
                                id: created.id,
                                title: created.title,
                                imageUrl: created.imageUrl,
                                link: created.link || undefined
                              }]);
                              setNewSliderTitle("");
                              setNewSliderLink("");
                              setSuccessMsg("Yeni slider öğesi başarıyla eklendi!");
                              setTimeout(() => setSuccessMsg(""), 3000);
                            } catch (err: any) {
                              alert(err.message || "Ekleme başarısız oldu.");
                            } finally {
                              setIsUploadingSlider(false);
                            }
                          }}
                          disabled={isUploadingSlider}
                          className="w-full py-2 bg-zinc-900 hover:bg-zinc-800 text-white rounded-lg font-bold text-xs cursor-pointer flex items-center justify-center gap-1.5 transition-colors"
                        >
                          {isUploadingSlider && <Loader2 className="h-3 w-3 animate-spin" />}
                          <Plus className="h-3.5 w-3.5" />
                          Kart Ekle
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Mevcut Link Kartları Listesi */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Kayıtlı Örnek Link Kartları ({sliderItems.length})</h4>
                    {sliderItems.length === 0 ? (
                      <p className="text-xs text-slate-400 italic">Henüz örnek link kartı eklenmemiş.</p>
                    ) : (
                      <div className="border border-slate-100 rounded-xl overflow-hidden divide-y divide-slate-100">
                        {sliderItems.map((item) => (
                          <div key={item.id} className="p-3 bg-white hover:bg-slate-50 flex items-center justify-between text-xs transition-colors">
                            <div className="flex items-center gap-3">
                              {item.imageUrl && (
                                <img src={item.imageUrl} alt={item.title} className="w-8 h-8 rounded-lg object-cover border" />
                              )}
                              <div>
                                <p className="font-semibold text-slate-800">{item.title}</p>
                                <p className="text-[10px] text-slate-400 truncate max-w-xs">{item.imageUrl}</p>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={async () => {
                                if (!confirm("Bu slider öğesini silmek istediğinize emin misiniz?")) return;
                                try {
                                  await deleteSliderItem(adminUserId, item.id);
                                  setSliderItems(prev => prev.filter(x => x.id !== item.id));
                                  setSuccessMsg("Slider öğesi başarıyla silindi!");
                                  setTimeout(() => setSuccessMsg(""), 3000);
                                } catch (err: any) {
                                  alert(err.message || "Silme başarısız.");
                                }
                              }}
                              className="p-1.5 bg-red-50 hover:bg-red-500 text-red-500 hover:text-white rounded-lg transition-colors cursor-pointer"
                              title="Sil"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Creator Carousel Ayarları */}
                <div className="p-6 rounded-xl border bg-white border-gray-100 shadow-sm">
                  <h3 className="text-lg font-semibold mb-4 text-slate-900">Creator Carousel (Yatay Kayan Slider)</h3>
                  <p className="text-xs text-slate-500 mb-4">Görselleri ve isimleri JSON formatında düzenleyin.</p>
                  <textarea
                    value={settingsMap["creators_data"] || ""}
                    onChange={(e) => setSettingsMap(prev => ({ ...prev, creators_data: e.target.value }))}
                    rows={8}
                    placeholder={'[\n  { "id": "1", "name": "Metro Beats", "username": "metro_beats", "imageUrl": "https://..." }\n]'}
                    className="w-full px-3 py-2 rounded-lg border bg-white border-gray-200 text-slate-900 text-sm font-mono"
                  />
                </div>

                {/* Zigzag Features Ayarları */}
                <div className="p-6 rounded-xl border bg-white border-gray-100 shadow-sm">
                  <h3 className="text-lg font-semibold mb-4 text-slate-900">Özellik Blokları (Zig-Zag)</h3>
                  <p className="text-xs text-slate-500 mb-4">Özellikleri JSON formatında düzenleyin.</p>
                  <textarea
                    value={settingsMap["features_data"] || ""}
                    onChange={(e) => setSettingsMap(prev => ({ ...prev, features_data: e.target.value }))}
                    rows={12}
                    placeholder={'[\n  { "id": "feat-1", "title": "Build your page", "highlightWords": "in minutes.", "description": "...", "imageUrl": "...", "listItems": [ { "text": "...", "icon": "layout" } ] }\n]'}
                    className="w-full px-3 py-2 rounded-lg border bg-white border-gray-200 text-slate-900 text-sm font-mono"
                  />
                </div>

                <button
                  onClick={async () => {
                    setIsSavingFeatures(true);
                    try {
                      await saveGlobalSetting(adminUserId, "hero_title", heroTitle);
                      await saveGlobalSetting(adminUserId, "hero_highlight", settingsMap["hero_highlight"] || "on the web");
                      await saveGlobalSetting(adminUserId, "hero_subtitle", heroSubtitle);
                      await saveGlobalSetting(adminUserId, "creators_data", settingsMap["creators_data"] || "");
                      await saveGlobalSetting(adminUserId, "features_data", settingsMap["features_data"] || "");
                      
                      setSuccessMsg("Landing Page ayarları başarıyla kaydedildi!");
                      setTimeout(() => setSuccessMsg(""), 3000);
                    } catch (e) {
                      alert(e.message || "Kaydedilemedi");
                    } finally {
                      setIsSavingFeatures(false);
                    }
                  }}
                  disabled={isSavingFeatures}
                  className="px-6 py-3 rounded-lg bg-teal-500 hover:bg-teal-400 text-white font-bold text-sm transition-colors flex items-center gap-2"
                >
                  {isSavingFeatures && <Loader2 className="h-4 w-4 animate-spin" />}
                  Değişiklikleri Kaydet
                </button>
              </div>
            )}
\n            {sidebarTab === "settings" && (
              /* DETAILED SYSTEM AND BILLING GATEWAY CONFIGS */
              <div className="space-y-8 animate-fadeIn">
                <div>
                  <h2 className="text-2xl font-black text-zinc-850 tracking-tight">{lang === "tr" ? "Genel Sistem Ayarları" : "Platform Global Configurations"}</h2>
                  <p className="text-xs text-zinc-400 font-bold mt-1">{lang === "tr" ? "Fatura ödeme geçitlerini ve görsel marka varlıklarını özelleştirin." : "Configure subscription checkout hooks and branding logotypes."}</p>
                </div>

                {/* Payment gateway section - SUPER ADMIN ONLY */}
                {isSuperAdmin ? (
                <div className="p-6 bg-white border border-zinc-150 rounded-[24px] shadow-sm space-y-4">
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-rose-500" />
                    <h3 className="font-extrabold text-sm text-zinc-800">{lang === "tr" ? "Üyelik Ödeme Altyapı Bağlantıları" : "Checkout Gateways Configuration"}</h3>
                    <span className="ml-auto px-2 py-0.5 rounded-full bg-red-50 border border-red-200 text-[9px] font-black text-red-500 uppercase tracking-wide">Süper Admin</span>
                  </div>
                  <form onSubmit={handleSaveSettings} className="space-y-6">
                    <div className="grid md:grid-cols-3 gap-6 items-end">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase text-zinc-400 block">{lang === "tr" ? "Starter Plan Ödeme Bağlantısı" : "Starter Plan Checkout URL"}</label>
                        <input
                          type="url"
                          value={starterLink}
                          onChange={(e) => setStarterLink(e.target.value)}
                          placeholder="https://shopier.com/starter_pay..."
                          className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl outline-none text-xs focus:ring-2 focus:ring-rose-500/10 transition-all text-zinc-750"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase text-zinc-400 block">{lang === "tr" ? "Creator Plan Ödeme Bağlantısı" : "Creator Plan Checkout URL"}</label>
                        <input
                          type="url"
                          value={creatorLink}
                          onChange={(e) => setCreatorLink(e.target.value)}
                          placeholder="https://shopier.com/creator_pay..."
                          className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl outline-none text-xs focus:ring-2 focus:ring-rose-500/10 transition-all text-zinc-750"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase text-zinc-400 block">{lang === "tr" ? "Pro Plan Ödeme Bağlantısı" : "Pro Plan Checkout URL"}</label>
                        <input
                          type="url"
                          value={proLink}
                          onChange={(e) => setProLink(e.target.value)}
                          placeholder="https://shopier.com/pro_pay..."
                          className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl outline-none text-xs focus:ring-2 focus:ring-rose-500/10 transition-all text-zinc-750"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-4 gap-6 items-end">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase text-zinc-400 block">{lang === "tr" ? "Starter Plan Fiyatı (₺)" : "Starter Plan Price (₺)"}</label>
                        <input
                          type="text"
                          value={priceStarter}
                          onChange={(e) => setPriceStarter(e.target.value)}
                          placeholder="150"
                          className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl outline-none text-xs focus:ring-2 focus:ring-rose-500/10 transition-all text-zinc-750"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase text-zinc-400 block">{lang === "tr" ? "Creator Plan Fiyatı (₺)" : "Creator Plan Price (₺)"}</label>
                        <input
                          type="text"
                          value={priceCreator}
                          onChange={(e) => setPriceCreator(e.target.value)}
                          placeholder="450"
                          className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl outline-none text-xs focus:ring-2 focus:ring-rose-500/10 transition-all text-zinc-750"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase text-zinc-400 block">{lang === "tr" ? "Pro Plan Fiyatı (₺)" : "Pro Plan Price (₺)"}</label>
                        <input
                          type="text"
                          value={pricePro}
                          onChange={(e) => setPricePro(e.target.value)}
                          placeholder="950"
                          className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl outline-none text-xs focus:ring-2 focus:ring-rose-500/10 transition-all text-zinc-750"
                        />
                      </div>
                      <div className="flex justify-end">
                        <button
                          type="submit"
                          disabled={isPending}
                          className="w-full px-5 py-3.5 bg-rose-500 hover:bg-rose-600 text-white font-extrabold text-xs rounded-xl shadow-md shadow-rose-500/10 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                          {isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : (lang === "tr" ? "Ayarları ve Fiyatları Kaydet" : "Save Settings & Prices")}
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
                ) : (
                <div className="p-6 bg-zinc-50 border border-zinc-200 rounded-[24px] shadow-sm space-y-3 opacity-60">
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-zinc-400" />
                    <h3 className="font-extrabold text-sm text-zinc-500">{lang === "tr" ? "Üyelik Ödeme Altyapı Bağlantıları" : "Checkout Gateways Configuration"}</h3>
                    <span className="ml-auto px-2 py-0.5 rounded-full bg-zinc-100 border border-zinc-300 text-[9px] font-black text-zinc-500 uppercase tracking-wide">🔒 Kilitli</span>
                  </div>
                  <p className="text-xs text-zinc-400">{lang === "tr" ? "Bu bölüm yalnızca Süper Admin tarafından yönetilebilir. Ödeme geçidi bağlantılarını düzenlemek için Süper Admin girişi yapmanız gerekmektedir." : "This section is restricted to Super Admins only. Please log in as Super Admin to manage payment gateway links."}</p>
                </div>
                )}

                {/* Branding section */}
                <div className="p-6 bg-white border border-zinc-150 rounded-[24px] shadow-sm space-y-4">
                  <div className="flex items-center gap-2">
                    <Palette className="h-5 w-5 text-rose-500" />
                    <h3 className="font-extrabold text-sm text-zinc-800">{lang === "tr" ? "Platform Markalama & Görsel Temalandırma" : "Branding Visual Settings"}</h3>
                  </div>

                  <form onSubmit={handleSaveBrandingSettings} className="space-y-6">
                    <div className="grid md:grid-cols-3 gap-6">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase text-zinc-400 block">{lang === "tr" ? "Site Başlığı" : "Site Title Name"}</label>
                        <input
                          type="text"
                          value={siteTitle}
                          onChange={(e) => setSiteTitle(e.target.value)}
                          className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl outline-none text-xs focus:ring-2 focus:ring-rose-500/10 transition-all text-zinc-750 font-bold"
                          required
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase text-zinc-400 block flex items-center justify-between">
                          <span>{lang === "tr" ? "Platform Logo URL'si (PNG)" : "Logo Image URL (PNG)"}</span>
                          <span className="text-[9px] text-rose-500 font-extrabold uppercase select-none">
                            {lang === "tr" ? "Önerilen: 200x50px • Maks: 2MB" : "Rec: 200x50px • Max: 2MB"}
                          </span>
                        </label>
                        <input
                          type="text"
                          value={siteLogo}
                          onChange={(e) => setSiteLogo(e.target.value)}
                          placeholder={lang === "tr" ? "Örn: https://site.com/logo.png" : "e.g., https://site.com/logo.png"}
                          className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl outline-none text-xs focus:ring-2 focus:ring-rose-500/10 transition-all text-zinc-750"
                        />
                        <p className="text-[9px] text-zinc-400 font-bold leading-normal">
                          {lang === "tr" 
                            ? "Şeffaf arka plana sahip PNG formatı önerilir. İdeal boyut: yükseklik 40px, genişlik maks 240px. Görsel boyutu 2MB'ın altında olmalıdır." 
                            : "PNG format with transparent background is highly recommended. Ideal size: 40px height, max 240px width. File size must be under 2MB."}
                        </p>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase text-zinc-400 block">{lang === "tr" ? "Favicon Adresi" : "Browser Favicon URL"}</label>
                        <input
                          type="text"
                          value={siteFavicon}
                          onChange={(e) => setSiteFavicon(e.target.value)}
                          className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl outline-none text-xs focus:ring-2 focus:ring-rose-500/10 transition-all text-zinc-750"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase text-zinc-400 block">{lang === "tr" ? "Birincil Neon Vurgu Rengi" : "Accent Neon Accent"}</label>
                        <select
                          value={accentColor}
                          onChange={(e) => setAccentColor(e.target.value)}
                          className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl outline-none text-xs font-bold text-zinc-750 cursor-pointer"
                        >
                          <option value="purple">{lang === "tr" ? "Neon Mor" : "Neon Purple"}</option>
                          <option value="emerald">{lang === "tr" ? "Siber Teal Yeşili" : "Cyber Emerald"}</option>
                          <option value="pink">{lang === "tr" ? "Retro Gül Pembesi" : "Synthwave Pink"}</option>
                          <option value="cyan">{lang === "tr" ? "Okyanus Turkuazı" : "Oceans Cyan"}</option>
                        </select>
                      </div>
                      <div className="space-y-1.5 md:col-span-2">
                        <label className="text-[10px] font-black uppercase text-zinc-400 block">{lang === "tr" ? "Hero Alanı Başlığı" : "Hero Headline"}</label>
                        <input
                          type="text"
                          value={heroTitle}
                          onChange={(e) => setHeroTitle(e.target.value)}
                          className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl outline-none text-xs focus:ring-2 focus:ring-rose-500/10 transition-all text-zinc-750"
                          required
                        />
                      </div>
                    </div>

                    {/* Background configuration */}
                    <div className="grid md:grid-cols-3 gap-6 border-t pt-5 border-dashed border-zinc-150">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase text-zinc-400 block">{lang === "tr" ? "Açık Tema Arkaplan Rengi (Hex)" : "Light Background Hex"}</label>
                        <div className="flex gap-2">
                          <input
                            type="color"
                            value={lightModeBg.startsWith("#") ? lightModeBg : "#f4f4f5"}
                            onChange={(e) => setLightModeBg(e.target.value)}
                            className="h-10 w-10 p-0 rounded-xl bg-transparent border-0 outline-none cursor-pointer"
                          />
                          <input
                            type="text"
                            value={lightModeBg}
                            onChange={(e) => setLightModeBg(e.target.value)}
                            className="flex-1 px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl outline-none text-xs text-zinc-750"
                          />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase text-zinc-400 block">{lang === "tr" ? "Koyu Tema Arkaplan Rengi (Hex)" : "Dark Background Hex"}</label>
                        <div className="flex gap-2">
                          <input
                            type="color"
                            value={darkModeBg.startsWith("#") ? darkModeBg : "#000000"}
                            onChange={(e) => setDarkModeBg(e.target.value)}
                            className="h-10 w-10 p-0 rounded-xl bg-transparent border-0 outline-none cursor-pointer"
                          />
                          <input
                            type="text"
                            value={darkModeBg}
                            onChange={(e) => setDarkModeBg(e.target.value)}
                            className="flex-1 px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl outline-none text-xs text-zinc-750"
                          />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase text-zinc-400 block">{lang === "tr" ? "Footer Telif Hakkı Yazısı" : "Footer Copyright Text"}</label>
                        <input
                          type="text"
                          value={footerCopyright}
                          onChange={(e) => setFooterCopyright(e.target.value)}
                          className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl outline-none text-xs focus:ring-2 focus:ring-rose-500/10 transition-all text-zinc-750"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase text-zinc-400 block">{lang === "tr" ? "Hero Açıklama Alt Başlığı" : "Hero Description"}</label>
                      <textarea
                        rows={2}
                        value={heroSubtitle}
                        onChange={(e) => setHeroSubtitle(e.target.value)}
                        className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl outline-none text-xs resize-none text-zinc-750"
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase text-zinc-400 block">{lang === "tr" ? "Özel CSS Kod Enjeksiyonu" : "Custom CSS Injection Portal"}</label>
                      <textarea
                        rows={3}
                        value={customCSS}
                        onChange={(e) => setCustomCSS(e.target.value)}
                        className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl outline-none text-xs font-mono resize-none text-zinc-750"
                        placeholder="/* custom css */"
                      />
                    </div>

                    <div className="flex justify-end pt-2">
                      <button
                        type="submit"
                        disabled={isPending}
                        className="px-6 py-4 bg-rose-500 hover:bg-rose-600 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-rose-500/10 cursor-pointer flex items-center gap-2"
                      >
                        {isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
                        {lang === "tr" ? "Marka & Görsel Ayarları Kaydet" : "Save Brand configurations"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {sidebarTab === "legal" && (
              /* LEGAL PAGES EDITOR */
              <div className="space-y-6 animate-fadeIn">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h2 className="text-2xl font-black text-zinc-850 tracking-tight">
                      {lang === "tr" ? "Yasal Sayfa Editörü" : "Legal Pages Editor"}
                    </h2>
                    <p className="text-xs text-zinc-400 font-bold mt-1">
                      {lang === "tr" ? "Gizlilik ve çerez politikası içeriklerini HTML formatında düzenleyin." : "Edit privacy and cookie policy content as HTML. Changes go live instantly."}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Link
                      href="/privacy"
                      target="_blank"
                      className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold rounded-2xl border border-zinc-200 bg-white hover:border-rose-300 hover:text-rose-500 transition-all"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      {lang === "tr" ? "Gizlilik" : "Privacy"}
                    </Link>
                    <Link
                      href="/cookies"
                      target="_blank"
                      className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold rounded-2xl border border-zinc-200 bg-white hover:border-amber-300 hover:text-amber-500 transition-all"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      {lang === "tr" ? "Çerez" : "Cookies"}
                    </Link>
                  </div>
                </div>

                {/* Privacy Policy Editor */}
                <div className="p-6 bg-white border border-zinc-150 rounded-[24px] shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-rose-50 flex items-center justify-center text-rose-500">
                        <Shield className="h-4 w-4" />
                      </div>
                      <div>
                        <h3 className="font-extrabold text-sm text-zinc-800">{lang === "tr" ? "Gizlilik Politikası" : "Privacy Policy"}</h3>
                        <p className="text-[10px] text-zinc-400">{lang === "tr" ? "HTML formatında düzenleyin" : "Edit as raw HTML"}</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 bg-rose-50 rounded-full text-rose-500 border border-rose-200 font-bold">/privacy</span>
                  </div>

                  <div className="rounded-2xl border border-zinc-200 overflow-hidden">
                    {/* Mini toolbar hint */}
                    <div className="px-4 py-2.5 bg-zinc-50 border-b border-zinc-200 flex gap-3 text-[10px] font-bold text-zinc-400">
                      <span className="font-mono">&lt;h2&gt;</span>
                      <span className="font-mono">&lt;p&gt;</span>
                      <span className="font-mono">&lt;ul&gt;&lt;li&gt;</span>
                      <span className="font-mono">&lt;strong&gt;</span>
                      <span className="font-mono">&lt;a href=""&gt;</span>
                      <span className="ml-auto italic">HTML editör &bull; Canlı önizleme için {lang === "tr" ? "Gizlilik" : "Privacy"} sayfasını açın</span>
                    </div>
                    <textarea
                      rows={14}
                      value={privacyContent}
                      onChange={(e) => setPrivacyContent(e.target.value)}
                      className="w-full px-5 py-4 bg-white outline-none text-xs font-mono resize-none text-zinc-700 leading-relaxed"
                      placeholder="<h2>1. Giriş</h2>\n<p>...</p>"
                    />
                  </div>
                </div>

                {/* Cookie Policy Editor */}
                <div className="p-6 bg-white border border-zinc-150 rounded-[24px] shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center text-amber-500">
                        <Cookie className="h-4 w-4" />
                      </div>
                      <div>
                        <h3 className="font-extrabold text-sm text-zinc-800">{lang === "tr" ? "Çerez Politikası" : "Cookie Policy"}</h3>
                        <p className="text-[10px] text-zinc-400">{lang === "tr" ? "HTML formatında düzenleyin" : "Edit as raw HTML"}</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 bg-amber-50 rounded-full text-amber-500 border border-amber-200 font-bold">/cookies</span>
                  </div>

                  <div className="rounded-2xl border border-zinc-200 overflow-hidden">
                    {/* Mini toolbar hint */}
                    <div className="px-4 py-2.5 bg-zinc-50 border-b border-zinc-200 flex gap-3 text-[10px] font-bold text-zinc-400">
                      <span className="font-mono">&lt;h2&gt;</span>
                      <span className="font-mono">&lt;p&gt;</span>
                      <span className="font-mono">&lt;table&gt;</span>
                      <span className="font-mono">&lt;ul&gt;&lt;li&gt;</span>
                      <span className="font-mono">&lt;code&gt;</span>
                      <span className="ml-auto italic">HTML editör &bull; Canlı önizleme için {lang === "tr" ? "Çerez" : "Cookies"} sayfasını açın</span>
                    </div>
                    <textarea
                      rows={14}
                      value={cookieContent}
                      onChange={(e) => setCookieContent(e.target.value)}
                      className="w-full px-5 py-4 bg-white outline-none text-xs font-mono resize-none text-zinc-700 leading-relaxed"
                      placeholder="<h2>1. Çerezler Nedir?</h2>\n<p>...</p>"
                    />
                  </div>
                </div>

                {/* Save button */}
                <div className="flex justify-between items-center pt-2 border-t border-zinc-100">
                  <p className="text-[10px] text-zinc-400 font-semibold">
                    {lang === "tr" ? "Değişiklikler kaydedildiğinde ilgili sayfalar anında güncellenecektir." : "Pages update instantly after saving."}
                  </p>
                  <button
                    type="button"
                    onClick={handleSaveLegalPages}
                    disabled={isPending}
                    className="px-6 py-4 bg-rose-500 hover:bg-rose-600 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-rose-500/10 cursor-pointer flex items-center gap-2 disabled:opacity-50"
                  >
                    {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
                    {lang === "tr" ? "İki Sayfayı da Kaydet" : "Save Both Pages"}
                  </button>
                </div>
              </div>
            )}

            {sidebarTab === "code" && (
              /* DYNAMIC CODE & CONFIG CONTROL CENTER */
              <div className="space-y-6 animate-fadeIn pb-8">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h2 className="text-2xl font-black text-zinc-850 tracking-tight">
                      {lang === "tr" ? "Kod & Değişken Kontrol Merkezi" : "Code & Configurations Center"}
                    </h2>
                    <p className="text-xs text-zinc-400 font-bold mt-1">
                      {lang === "tr" 
                        ? "Sitedeki tüm dinamik parametreleri basit anahtar kodlarla ve açıklamalarıyla yönetin." 
                        : "Manage all site dynamic properties using simplified key-codes with inline guides."}
                    </p>
                  </div>
                </div>

                {/* Add New Custom Parameter Card */}
                <div className="p-6 bg-white border border-zinc-150 rounded-[24px] shadow-sm space-y-4">
                  <h3 className="font-extrabold text-sm text-zinc-800 flex items-center gap-2">
                    <Plus className="h-4.5 w-4.5 text-rose-500" />
                    {lang === "tr" ? "Yeni Değişken (Kod) Ekle" : "Add New Config Parameter"}
                  </h3>
                  <form onSubmit={handleCreateCode} className="grid sm:grid-cols-3 gap-4 items-end">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase text-zinc-400 block">
                        {lang === "tr" ? "Anahtar Kod (Key)" : "Parameter Key-Code"}
                      </label>
                      <input
                        type="text"
                        required
                        value={newCodeKey}
                        onChange={(e) => setNewCodeKey(e.target.value)}
                        placeholder="Orn: customer_support_email"
                        className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl outline-none text-xs text-zinc-750 font-mono"
                      />
                    </div>
                    <div className="space-y-1.5 font-sans">
                      <label className="text-[10px] font-black uppercase text-zinc-400 block">
                        {lang === "tr" ? "Açıklama (Ne İşe Yarar?)" : "Turkish Explanation"}
                      </label>
                      <input
                        type="text"
                        required
                        value={newCodeDesc}
                        onChange={(e) => setNewCodeDesc(e.target.value)}
                        placeholder={lang === "tr" ? "Müşterilere gösterilecek destek e-posta adresi." : "Human guide on what this changes."}
                        className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl outline-none text-xs text-zinc-750"
                      />
                    </div>
                    <div className="space-y-1.5 flex gap-2">
                      <div className="flex-1">
                        <label className="text-[10px] font-black uppercase text-zinc-400 block">
                          {lang === "tr" ? "Başlangıç Değeri (Value)" : "Initial Value"}
                        </label>
                        <input
                          type="text"
                          required
                          value={newCodeVal}
                          onChange={(e) => setNewCodeVal(e.target.value)}
                          placeholder="Orn: support@hub.com"
                          className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl outline-none text-xs text-zinc-750"
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={isPending}
                        className="px-5 py-3.5 bg-rose-500 hover:bg-rose-600 text-white font-extrabold text-xs rounded-xl shadow-md shadow-rose-500/10 cursor-pointer disabled:opacity-50"
                      >
                        {isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : (lang === "tr" ? "Ekle" : "Add")}
                      </button>
                    </div>
                  </form>
                </div>

                {/* Parameters List */}
                <div className="p-6 bg-white border border-zinc-150 rounded-[24px] shadow-sm space-y-4">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b pb-4">
                    <h3 className="font-extrabold text-sm text-zinc-800">
                      {lang === "tr" ? "Aktif Değişken Kütüphanesi" : "Registered Configuration Library"}
                    </h3>
                    {/* Inline Filter Search */}
                    <div className="flex items-center rounded-xl border border-zinc-200 px-3 py-1.5 bg-zinc-50 w-full sm:w-64">
                      <Search className="h-3.5 w-3.5 text-zinc-400 mr-2 shrink-0" />
                      <input
                        type="text"
                        placeholder={lang === "tr" ? "Kod veya açıklama ara..." : "Search key or guide..."}
                        value={codeSearchQuery}
                        onChange={(e) => setCodeSearchQuery(e.target.value)}
                        className="bg-transparent border-none outline-none text-xs w-full text-zinc-700 placeholder-zinc-400 font-sans"
                      />
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-zinc-100 text-[10px] font-black uppercase text-zinc-400 tracking-wider">
                          <th className="py-3 px-2 w-[220px]">{lang === "tr" ? "Kod / Parametre" : "Key / Code"}</th>
                          <th className="py-3 px-2">{lang === "tr" ? "İşlev & Açıklama" : "Inline Guide / Purpose"}</th>
                          <th className="py-3 px-2 w-[350px]">{lang === "tr" ? "Mevcut Değer" : "Current Value"}</th>
                          <th className="py-3 px-2 w-[100px] text-right">{lang === "tr" ? "İşlemler" : "Actions"}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-50">
                        {Object.entries(settingsMap)
                          .filter(([key]) => key !== "settings_metadata") // hide metadata key from itself
                          .filter(([key, val]) => {
                            let customMeta: Record<string, { title: string; desc: string }> = {};
                            if (settingsMap["settings_metadata"]) {
                              try {
                                customMeta = JSON.parse(settingsMap["settings_metadata"]);
                              } catch (e) {}
                            }
                            const standardMeta = STANDARD_SETTINGS_METADATA[key];
                            const desc = customMeta[key]?.desc || standardMeta?.desc || "";
                            
                            const query = codeSearchQuery.toLowerCase();
                            return key.toLowerCase().includes(query) || desc.toLowerCase().includes(query) || val.toLowerCase().includes(query);
                          })
                          .map(([key, val]) => {
                            let customMeta: Record<string, { title: string; desc: string }> = {};
                            if (settingsMap["settings_metadata"]) {
                              try {
                                customMeta = JSON.parse(settingsMap["settings_metadata"]);
                              } catch (e) {}
                            }
                            const standardMeta = STANDARD_SETTINGS_METADATA[key];
                            const desc = customMeta[key]?.desc || standardMeta?.desc || (lang === "tr" ? "Sistem değişkeni." : "System property.");

                            const isCustom = !STANDARD_SETTINGS_METADATA[key];

                            return (
                              <tr key={key} className="hover:bg-zinc-50/40 transition-colors">
                                <td className="py-3.5 px-2 align-top">
                                  <span className="font-mono text-xs font-black text-rose-500 bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-100/50 block w-fit truncate max-w-[200px]" title={key}>
                                    {key}
                                  </span>
                                  {isCustom && (
                                    <span className="text-[8px] font-black uppercase tracking-wider text-fuchsia-500 bg-fuchsia-50 border border-fuchsia-100 px-1 py-0.5 rounded mt-1.5 block w-fit">
                                      {lang === "tr" ? "Özel Eklenen" : "Custom Param"}
                                    </span>
                                  )}
                                </td>
                                <td className="py-3.5 px-2 text-xs text-zinc-500 font-medium align-top leading-relaxed max-w-[280px]">
                                  {desc}
                                </td>
                                <td className="py-3.5 px-2 align-top">
                                  <textarea
                                    rows={val.length > 55 || val.includes("\n") ? 3 : 1}
                                    defaultValue={val}
                                    onBlur={(e) => {
                                      if (e.target.value !== val) {
                                        handleSaveCode(key, e.target.value);
                                      }
                                    }}
                                    className="w-full px-3 py-2 bg-zinc-50 border border-zinc-150 rounded-xl outline-none text-xs text-zinc-700 font-mono focus:bg-white focus:border-rose-400 focus:ring-2 focus:ring-rose-500/10 transition-all resize-y"
                                  />
                                </td>
                                <td className="py-3.5 px-2 text-right align-top space-y-1">
                                  {isCustom ? (
                                    <button
                                      onClick={() => handleDeleteCode(key)}
                                      disabled={isPending}
                                      className="p-2 bg-red-50 hover:bg-red-500 text-red-500 hover:text-white rounded-xl border border-red-100 transition-colors cursor-pointer disabled:opacity-50 inline-block"
                                      title={lang === "tr" ? "Değişkeni Sil" : "Delete Parameter"}
                                    >
                                      <Trash2 className="h-3.5 w-3.5" />
                                    </button>
                                  ) : (
                                    <span className="text-[9px] font-black uppercase text-zinc-300 block py-2 select-none">
                                      {lang === "tr" ? "Sistem" : "System Only"}
                                    </span>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )
            }

            {sidebarTab === "fonts" && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h2 className="text-2xl font-black text-zinc-850 tracking-tight">
                      {lang === "tr" ? "Google Yazı Tipleri Yönetimi" : "Google Fonts Library Management"}
                    </h2>
                    <p className="text-xs text-zinc-400 font-bold mt-1">
                      {lang === "tr" 
                        ? "Platformdaki yazı tiplerini ekleyin, düzenleyin veya kaldırın. Eklenen yazı tipleri Google Fonts üzerinden anında pre-load edilir." 
                        : "Manage registered typography styles. New fonts automatically preload from Google Fonts CDN."}
                    </p>
                  </div>
                  
                  <Link
                    href="/dashboard"
                    className="flex items-center gap-1.5 px-4.5 py-2.5 rounded-2xl text-xs font-bold bg-zinc-900 text-white hover:bg-zinc-850 shadow-md shadow-zinc-950/10 cursor-pointer"
                  >
                    <ArrowRight className="h-3.5 w-3.5 rotate-180" />
                    {lang === "tr" ? "Stüdyoya Git" : "Back to Studio"}
                  </Link>
                </div>

                <div className="grid lg:grid-cols-3 gap-6">
                  {/* Left Column: Add Font Form */}
                  <div className="lg:col-span-1 p-6 bg-white border border-zinc-150 rounded-[24px] shadow-sm space-y-6 self-start">
                    <div>
                      <h3 className="font-extrabold text-sm text-zinc-800">
                        {lang === "tr" ? "Yeni Yazı Tipi Ekle" : "Register New Typography Style"}
                      </h3>
                      <p className="text-[10px] text-zinc-400 font-bold mt-0.5">
                        {lang === "tr" 
                          ? "Yeni bir Google Font tanımlayarak tüm kullanıcıların erişimine açın." 
                          : "Define new Google Font configurations accessible on the creator dashboard."}
                      </p>
                    </div>

                    <form onSubmit={handleAddFont} className="space-y-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase text-zinc-400 block">
                          {lang === "tr" ? "Yazı Tipi Adı (Arayüzde Görünür)" : "Typography Name (Visible)"}
                        </label>
                        <input
                          type="text"
                          required
                          value={newFontName}
                          onChange={(e) => setNewFontName(e.target.value)}
                          placeholder="Orn: Poppins, Space Grotesk"
                          className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl outline-none text-xs text-zinc-750 font-bold"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase text-zinc-400 block">
                          {lang === "tr" ? "Google Fonts Değeri (Boşlukları Koru)" : "Google Fonts Family Value (Keep spaces)"}
                        </label>
                        <input
                          type="text"
                          required
                          value={newFontValue}
                          onChange={(e) => setNewFontValue(e.target.value)}
                          placeholder="Orn: Poppins, Playfair Display"
                          className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl outline-none text-xs text-zinc-750 font-mono"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase text-zinc-400 block">
                          {lang === "tr" ? "Plan Seviyesi / Tier" : "Membership Plan Tier"}
                        </label>
                        <select
                          value={newFontTier}
                          onChange={(e) => setNewFontTier(e.target.value)}
                          className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl outline-none text-xs text-zinc-750 font-bold"
                        >
                          <option value="FREE">FREE</option>
                          <option value="STARTER">STARTER</option>
                          <option value="CREATOR">CREATOR</option>
                        </select>
                      </div>

                      {newFontTier === "FREE" && (
                        <div className="space-y-1.5 animate-fadeIn">
                          <label className="text-[10px] font-black uppercase text-zinc-400 block flex items-center gap-1">
                            <span>⭐ {lang === "tr" ? "Hediye Rozet Yazısı (İsteğe Bağlı)" : "Gift Badge Label (Optional)"}</span>
                          </label>
                          <input
                            type="text"
                            value={newFontGiftLabel}
                            onChange={(e) => setNewFontGiftLabel(e.target.value)}
                            placeholder={lang === "tr" ? "Örn: Hediye, Popüler" : "e.g. Gift, Popular"}
                            className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl outline-none text-xs text-zinc-750 font-bold border-dashed border-rose-200 focus:border-rose-450 focus:ring-rose-500/10 transition-all placeholder:font-normal"
                          />
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={isPending}
                        className="w-full py-3.5 bg-rose-500 hover:bg-rose-600 text-white font-extrabold text-xs rounded-xl shadow-md shadow-rose-500/10 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1.5"
                      >
                        {isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Plus className="h-3.5 w-3.5" />}
                        {lang === "tr" ? "Yazı Tipini Kaydet" : "Register Font"}
                      </button>
                    </form>
                  </div>

                  {/* Right Column: Categorized Fonts Catalog */}
                  <div className="lg:col-span-2 p-6 bg-white border border-zinc-150 rounded-[24px] shadow-sm space-y-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-4">
                      <div>
                        <h3 className="font-extrabold text-sm text-zinc-800">
                          {lang === "tr" ? "Kayıtlı Yazı Tipi Portföyü" : "Registered Typography Catalog"}
                        </h3>
                        <p className="text-[10px] text-zinc-400 font-bold mt-0.5">
                          {lang === "tr" ? "Paket seviyelerine göre ayrılmış yazı tipleri." : "Typography styles grouped by membership tier."}
                        </p>
                      </div>
                      
                      {/* Segmented plan selection */}
                      <div className="flex gap-1.5 p-1 bg-zinc-100 rounded-xl w-fit shrink-0">
                        {(["FREE", "STARTER", "CREATOR"] as const).map((t) => (
                          <button
                            key={t}
                            type="button"
                            onClick={() => setActiveFontTab(t)}
                            className={`px-4 py-2 text-[10px] font-black uppercase rounded-lg transition-all cursor-pointer ${
                              activeFontTab === t
                                ? t === "FREE"
                                  ? "bg-zinc-850 text-white shadow-sm"
                                  : t === "STARTER"
                                    ? "bg-purple-600 text-white shadow-sm"
                                    : "bg-amber-50 text-white shadow-sm"
                                : "text-zinc-500 hover:text-zinc-800"
                            }`}
                          >
                            {t === "FREE" ? (lang === "tr" ? "Free" : "Free") : t === "STARTER" ? (lang === "tr" ? "Starter" : "Starter") : (lang === "tr" ? "Creator" : "Creator")}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center rounded-xl border border-zinc-200 px-3 py-1.5 bg-zinc-50 w-full">
                      <Search className="h-3.5 w-3.5 text-zinc-400 mr-2 shrink-0" />
                      <input
                        type="text"
                        placeholder={lang === "tr" ? "Yazı tipi ara..." : "Search fonts..."}
                        value={fontSearchQuery}
                        onChange={(e) => setFontSearchQuery(e.target.value)}
                        className="bg-transparent border-none outline-none text-xs w-full text-zinc-700 placeholder-zinc-400 font-sans"
                      />
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-zinc-100 text-[10px] font-black uppercase text-zinc-400 tracking-wider">
                            <th className="py-3 px-2 w-[160px]">{lang === "tr" ? "Yazı Tipi Adı" : "Font Name"}</th>
                            <th className="py-3 px-2 w-[110px]">{lang === "tr" ? "Paket" : "Tier"}</th>
                            <th className="py-3 px-2 w-[130px]">{lang === "tr" ? "Özel Hediye Rozeti" : "Gift Badge"}</th>
                            <th className="py-3 px-2">{lang === "tr" ? "Tipografik Önizleme" : "Visual Specimen Preview"}</th>
                            <th className="py-3 px-2 w-[80px] text-right">{lang === "tr" ? "İşlemler" : "Actions"}</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-50">
                          {fonts
                            .filter(f => {
                              if (f.tier !== activeFontTab) return false;
                              const query = fontSearchQuery.toLowerCase();
                              return f.name.toLowerCase().includes(query) || f.value.toLowerCase().includes(query);
                            })
                            .map((f) => {
                              return (
                                <tr key={f.id} className="hover:bg-zinc-50/40 transition-colors">
                                  <td className="py-3.5 px-2 align-middle">
                                    <div className="space-y-0.5">
                                      <div className="flex items-center gap-1.5 flex-wrap">
                                        <span className="font-extrabold text-xs text-zinc-800 block">{f.name}</span>
                                        {f.tier === "FREE" && f.giftLabel && (
                                          <span className="text-[9px] font-black tracking-wider uppercase bg-gradient-to-r from-amber-500 to-yellow-400 text-white px-2 py-0.5 rounded-full flex items-center gap-0.5 shadow-sm animate-pulse">
                                            <span>⭐</span>
                                            <span>{f.giftLabel}</span>
                                          </span>
                                        )}
                                      </div>
                                      <span className="font-mono text-[9px] text-zinc-400 block">{f.value}</span>
                                    </div>
                                  </td>
                                  <td className="py-3.5 px-2 align-middle">
                                    <select
                                      defaultValue={f.tier}
                                      onChange={(e) => handleUpdateFont(f.id, f.name, f.value, e.target.value, f.giftLabel || undefined)}
                                      className={`text-[9px] font-extrabold px-2 py-1 rounded-md border cursor-pointer ${
                                        f.tier === "FREE" 
                                          ? "bg-zinc-100 border-zinc-200 text-zinc-650"
                                          : f.tier === "STARTER"
                                            ? "bg-purple-50 border-purple-200 text-purple-600"
                                            : "bg-amber-50 border-amber-250 text-amber-600"
                                      }`}
                                    >
                                      <option value="FREE">FREE</option>
                                      <option value="STARTER">STARTER</option>
                                      <option value="CREATOR">CREATOR</option>
                                    </select>
                                  </td>
                                  <td className="py-3.5 px-2 align-middle">
                                    {f.tier === "FREE" ? (
                                      <input
                                        type="text"
                                        defaultValue={f.giftLabel || ""}
                                        placeholder={lang === "tr" ? "Örn: Hediye" : "e.g. Gift"}
                                        onBlur={(e) => {
                                          if (e.target.value !== (f.giftLabel || "")) {
                                            handleUpdateFont(f.id, f.name, f.value, f.tier, e.target.value || undefined);
                                          }
                                        }}
                                        className="w-24 px-2 py-1 bg-zinc-50 border border-zinc-200 rounded-lg outline-none text-[10px] font-black text-zinc-700 placeholder-zinc-300 focus:bg-white focus:border-rose-450 focus:ring-2 focus:ring-rose-500/10 transition-all font-sans"
                                      />
                                    ) : (
                                      <span className="text-[10px] font-bold text-zinc-350 italic select-none">
                                        {lang === "tr" ? "Sadece Free" : "Free Only"}
                                      </span>
                                    )}
                                  </td>
                                  <td className="py-3.5 px-2 align-middle">
                                    <div className="py-2.5 px-3 rounded-lg bg-zinc-50 border border-zinc-100/50 text-center max-w-[280px]">
                                      <span 
                                        style={{ fontFamily: f.value }}
                                        className="text-sm font-bold text-zinc-700 block truncate"
                                      >
                                        Abc 123 - {f.name}
                                      </span>
                                    </div>
                                  </td>
                                  <td className="py-3.5 px-2 align-middle text-right space-x-1.5 whitespace-nowrap">
                                    <button
                                      onClick={() => handleDeleteFont(f.id, f.name)}
                                      disabled={isPending}
                                      className="p-2 bg-red-50 hover:bg-red-500 text-red-500 hover:text-white rounded-xl border border-red-100 transition-colors cursor-pointer disabled:opacity-50 inline-block"
                                      title={lang === "tr" ? "Yazı Tipini Kaldır" : "Delete Font"}
                                    >
                                      <Trash2 className="h-3.5 w-3.5" />
                                    </button>
                                  </td>
                                </tr>
                              );
                            })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {sidebarTab === "animations" && (
              <div className="space-y-6 overflow-y-auto max-h-[620px] pr-2 scrollbar-thin">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h2 className="text-2xl font-black text-zinc-850 tracking-tight">
                      {lang === "tr" ? "Animasyon Efektleri Yönetimi" : "Animation Effects Library"}
                    </h2>
                    <p className="text-xs text-zinc-400 font-bold mt-1">
                      {lang === "tr" 
                        ? "Platformdaki animasyonları ekleyin, düzenleyin veya kaldırın. Eklenen animasyonlar tüm kullanıcılara anında sunulur." 
                        : "Add, edit or remove animation effects. Registered animations are immediately served to creators."}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleSaveAnimations}
                      disabled={isPending}
                      className="flex items-center gap-1.5 px-5 py-2.5 rounded-2xl text-xs font-bold bg-rose-500 text-white hover:bg-rose-600 shadow-md shadow-rose-500/10 cursor-pointer disabled:opacity-50 transition-all"
                    >
                      {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                      {lang === "tr" ? "Değişiklikleri Veritabanına Kaydet" : "Save Animations to DB"}
                    </button>

                    <Link
                      href="/dashboard"
                      className="flex items-center gap-1.5 px-4.5 py-2.5 rounded-2xl text-xs font-bold bg-zinc-900 text-white hover:bg-zinc-850 shadow-md shadow-zinc-950/10 cursor-pointer"
                    >
                      <ArrowRight className="h-3.5 w-3.5 rotate-180" />
                      {lang === "tr" ? "Stüdyoya Git" : "Back to Studio"}
                    </Link>
                  </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-6">
                  {/* Left Column: Add Animation Form */}
                  <div className="lg:col-span-1 p-6 bg-white border border-zinc-150 rounded-[24px] shadow-sm space-y-6 self-start">
                    <div>
                      <h3 className="font-extrabold text-sm text-zinc-800">
                        {lang === "tr" ? "Yeni Animasyon Ekle" : "Register New Animation Preset"}
                      </h3>
                      <p className="text-[10px] text-zinc-400 font-bold mt-0.5">
                        {lang === "tr" 
                          ? "Yeni bir CSS animasyon sınıfı tanımlayarak tüm kullanıcıların erişimine açın." 
                          : "Define new CSS animation class configs accessible on the creator dashboard."}
                      </p>
                    </div>

                    <form onSubmit={handleAddAnim} className="space-y-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase text-zinc-400 block">
                          {lang === "tr" ? "Animasyon Adı (Arayüzde Görünür)" : "Animation Name (Visible)"}
                        </label>
                        <input
                          type="text"
                          required
                          value={newAnimLabel}
                          onChange={(e) => setNewAnimLabel(e.target.value)}
                          placeholder="Orn: RGB Dalga, Sallantı"
                          className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl outline-none text-xs text-zinc-750 font-bold"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase text-zinc-400 block">
                          {lang === "tr" ? "CSS Sınıfı / Class (anim-...)" : "CSS Class Selector"}
                        </label>
                        <input
                          type="text"
                          required
                          value={newAnimId}
                          onChange={(e) => setNewAnimId(e.target.value)}
                          placeholder="Orn: anim-pulse-glow"
                          className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl outline-none text-xs text-zinc-750 font-mono"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase text-zinc-400 block">
                          {lang === "tr" ? "Plan Seviyesi / Tier" : "Membership Plan Tier"}
                        </label>
                        <select
                          value={newAnimPlan}
                          onChange={(e) => setNewAnimPlan(e.target.value as any)}
                          className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl outline-none text-xs text-zinc-750 font-bold"
                        >
                          <option value="FREE">FREE</option>
                          <option value="STARTER">STARTER</option>
                          <option value="CREATOR">CREATOR</option>
                        </select>
                      </div>

                      {newAnimPlan === "FREE" && (
                        <div className="space-y-1.5 animate-fadeIn">
                          <label className="text-[10px] font-black uppercase text-zinc-400 block flex items-center gap-1">
                            <span>⭐ {lang === "tr" ? "Hediye Rozet Yazısı (İsteğe Bağlı)" : "Gift Badge Label (Optional)"}</span>
                          </label>
                          <input
                            type="text"
                            value={newAnimGiftLabel}
                            onChange={(e) => setNewAnimGiftLabel(e.target.value)}
                            placeholder={lang === "tr" ? "Örn: Hediye, Popüler" : "e.g. Gift, Popular"}
                            className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl outline-none text-xs text-zinc-750 font-bold border-dashed border-rose-200 focus:border-rose-450 focus:ring-rose-500/10 transition-all placeholder:font-normal"
                          />
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={isPending}
                        className="w-full py-3.5 bg-rose-500 hover:bg-rose-600 text-white font-extrabold text-xs rounded-xl shadow-md shadow-rose-500/10 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1.5"
                      >
                        {isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Plus className="h-3.5 w-3.5" />}
                        {lang === "tr" ? "Animasyonu Kaydet" : "Register Animation"}
                      </button>
                    </form>
                  </div>

                  {/* Right Column: Categorized Animations Catalog */}
                  <div className="lg:col-span-2 p-6 bg-white border border-zinc-150 rounded-[24px] shadow-sm space-y-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-4">
                      <div>
                        <h3 className="font-extrabold text-sm text-zinc-800">
                          {lang === "tr" ? "Kayıtlı Animasyon Portföyü" : "Registered Animation Portfolio"}
                        </h3>
                        <p className="text-[10px] text-zinc-400 font-bold mt-0.5">
                          {lang === "tr" ? "Paket seviyelerine göre ayrılmış animasyonlar." : "Animation presets grouped by membership tier."}
                        </p>
                      </div>
                      
                      {/* Segmented plan selection */}
                      <div className="flex gap-1.5 p-1 bg-zinc-100 rounded-xl w-fit shrink-0">
                        {(["FREE", "STARTER", "CREATOR"] as const).map((t) => {
                          const list = t === "FREE" ? freeAnims : t === "STARTER" ? starterAnims : creatorAnims;
                          const limit = t === "FREE" ? 5 : t === "STARTER" ? 10 : 15;
                          return (
                            <button
                              key={t}
                              type="button"
                              onClick={() => setActiveAnimTab(t)}
                              className={`px-4 py-2 text-[10px] font-black uppercase rounded-lg transition-all cursor-pointer ${
                                activeAnimTab === t
                                  ? t === "FREE"
                                    ? "bg-zinc-850 text-white shadow-sm"
                                    : t === "STARTER"
                                      ? "bg-purple-600 text-white shadow-sm"
                                      : "bg-amber-500 text-white shadow-sm"
                                  : "text-zinc-500 hover:text-zinc-800"
                              }`}
                            >
                              {t} ({list.length}/{limit})
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="flex items-center rounded-xl border border-zinc-200 px-3 py-1.5 bg-zinc-50 w-full">
                      <Search className="h-3.5 w-3.5 text-zinc-400 mr-2 shrink-0" />
                      <input
                        type="text"
                        placeholder={lang === "tr" ? "Animasyon ara..." : "Search animations..."}
                        value={animSearchQuery}
                        onChange={(e) => setAnimSearchQuery(e.target.value)}
                        className="bg-transparent border-none outline-none text-xs w-full text-zinc-700 placeholder-zinc-400 font-sans"
                      />
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-zinc-100 text-[10px] font-black uppercase text-zinc-400 tracking-wider">
                            <th className="py-3 px-2 w-[160px]">{lang === "tr" ? "Animasyon Adı" : "Animation Name"}</th>
                            <th className="py-3 px-2 w-[110px]">{lang === "tr" ? "Paket" : "Tier"}</th>
                            <th className="py-3 px-2 w-[130px]">{lang === "tr" ? "Özel Hediye Rozeti" : "Gift Badge"}</th>
                            <th className="py-3 px-2">{lang === "tr" ? "Dinamik Önizleme" : "Live Visual Preview"}</th>
                            <th className="py-3 px-2 w-[80px] text-right">{lang === "tr" ? "İşlemler" : "Actions"}</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-50">
                          {(() => {
                            const list = activeAnimTab === "FREE" ? freeAnims : activeAnimTab === "STARTER" ? starterAnims : creatorAnims;
                            const query = animSearchQuery.toLowerCase();
                            const filtered = list.filter(a => a.label.toLowerCase().includes(query) || a.id.toLowerCase().includes(query));
                            
                            if (filtered.length === 0) {
                              return (
                                <tr>
                                  <td colSpan={5} className="py-8 text-center text-zinc-400 italic text-xs">
                                    {lang === "tr" ? "Aranan kriterlere uygun animasyon bulunamadı." : "No animations found."}
                                  </td>
                                </tr>
                              );
                            }

                            return filtered.map((anim) => (
                              <tr key={anim.id} className="hover:bg-zinc-50/40 transition-colors">
                                <td className="py-3.5 px-2 align-middle">
                                  <div className="space-y-0.5">
                                    <div className="flex items-center gap-1.5 flex-wrap">
                                      <span className="font-extrabold text-xs text-zinc-800 block">{anim.label}</span>
                                      {anim.tier === "FREE" && anim.giftLabel && (
                                        <span className="text-[9px] font-black tracking-wider uppercase bg-gradient-to-r from-amber-500 to-yellow-400 text-white px-2 py-0.5 rounded-full flex items-center gap-0.5 shadow-sm animate-pulse">
                                          <span>⭐</span>
                                          <span>{anim.giftLabel}</span>
                                        </span>
                                      )}
                                    </div>
                                    <span className="font-mono text-[9px] text-zinc-400 block">{anim.id}</span>
                                  </div>
                                </td>
                                <td className="py-3.5 px-2 align-middle">
                                  <select
                                    defaultValue={anim.tier}
                                    onChange={(e) => handleUpdateAnim(anim.id, anim.label, e.target.value, anim.giftLabel || undefined)}
                                    className={`text-[9px] font-extrabold px-2 py-1 rounded-md border cursor-pointer ${
                                      anim.tier === "FREE" 
                                        ? "bg-zinc-100 border-zinc-200 text-zinc-650"
                                        : anim.tier === "STARTER"
                                          ? "bg-purple-50 border-purple-200 text-purple-600"
                                          : "bg-amber-50 border-amber-250 text-amber-600"
                                    }`}
                                  >
                                    <option value="FREE">FREE</option>
                                    <option value="STARTER">STARTER</option>
                                    <option value="CREATOR">CREATOR</option>
                                  </select>
                                </td>
                                <td className="py-3.5 px-2 align-middle">
                                  {anim.tier === "FREE" ? (
                                    <input
                                      type="text"
                                      defaultValue={anim.giftLabel || ""}
                                      placeholder={lang === "tr" ? "Örn: Hediye" : "e.g. Gift"}
                                      onBlur={(e) => {
                                        if (e.target.value !== (anim.giftLabel || "")) {
                                          handleUpdateAnim(anim.id, anim.label, anim.tier, e.target.value || undefined);
                                        }
                                      }}
                                      className="w-24 px-2 py-1 bg-zinc-50 border border-zinc-200 rounded-lg outline-none text-[10px] font-black text-zinc-700 placeholder-zinc-300 focus:bg-white focus:border-rose-450 focus:ring-2 focus:ring-rose-500/10 transition-all font-sans"
                                    />
                                  ) : (
                                    <span className="text-[10px] font-bold text-zinc-350 italic select-none">
                                      {lang === "tr" ? "Sadece Free" : "Free Only"}
                                    </span>
                                  )}
                                </td>
                                <td className="py-3.5 px-2 align-middle">
                                  {(() => {
                                    const presets = [
                                      { name: lang === "tr" ? "Okyanus Rüzgarı" : "Ocean Breeze", bg: "#0ea5e9", text: "#ffffff", border: "#38bdf8" },
                                      { name: lang === "tr" ? "Siber Neon" : "Cyber Neon",   bg: "#09090b", text: "#34d399", border: "#10b981" },
                                      { name: lang === "tr" ? "Kiraz Çiçeği" : "Cherry",      bg: "#fdf2f8", text: "#be185d", border: "#fbcfe8" },
                                      { name: lang === "tr" ? "Gece Moru" : "Midnight",       bg: "#3b0764", text: "#fae8ff", border: "#701a75" },
                                      { name: lang === "tr" ? "Retro Brutal" : "Retro Brutal", bg: "#facc15", text: "#000000", border: "#000000" },
                                    ];

                                    // Use a local state via dataset attribute workaround: we track selected preset via the row's data-key
                                    const rowKey = `preview-${anim.id}`;

                                    return (
                                      <div className="flex flex-col gap-2 min-w-[260px]" id={rowKey}>
                                        {/* Hazır Şablon Seçici (palette pill butonları) */}
                                        <div className="flex flex-col gap-1 p-2 rounded-xl bg-zinc-950/5 border border-zinc-100">
                                          <span className="text-[8px] font-black text-zinc-400 uppercase tracking-wider">
                                            🎨 {lang === "tr" ? "Hazır Kutu Şablonu Seç" : "Select Box Style"}
                                          </span>
                                          <div className="grid grid-cols-5 gap-1 mt-1">
                                            {presets.map((p) => (
                                              <button
                                                key={p.name}
                                                type="button"
                                                title={p.name}
                                                onClick={(e) => {
                                                  // Apply colors to sibling preview via DOM
                                                  const row = document.getElementById(rowKey);
                                                  if (!row) return;
                                                  const preview = row.querySelector("[data-preview]") as HTMLElement;
                                                  if (preview) {
                                                    preview.style.backgroundColor = p.bg;
                                                    preview.style.color = p.text;
                                                    preview.style.borderColor = p.border;
                                                  }
                                                  // Mark active
                                                  row.querySelectorAll("[data-preset-btn]").forEach(b => b.classList.remove("ring-2", "ring-rose-400"));
                                                  (e.currentTarget as HTMLElement).classList.add("ring-2", "ring-rose-400");
                                                }}
                                                data-preset-btn
                                                className="p-1.5 rounded-lg border border-zinc-200 bg-white hover:border-rose-300 hover:scale-105 transition-all cursor-pointer text-left"
                                              >
                                                <span className="text-[7px] font-black text-zinc-500 block truncate mb-1">{p.name}</span>
                                                <div className="flex items-center gap-0.5">
                                                  <span className="w-2.5 h-2.5 rounded-full border border-zinc-300" style={{ backgroundColor: p.bg }} />
                                                  <span className="w-2.5 h-2.5 rounded-full border border-zinc-300 flex items-center justify-center" style={{ backgroundColor: "#f4f4f5" }}>
                                                    <span className="text-[5px] font-black" style={{ color: p.text }}>A</span>
                                                  </span>
                                                  <span className="w-2.5 h-2.5 rounded-full" style={{ border: `2px solid ${p.border}` }} />
                                                </div>
                                              </button>
                                            ))}
                                          </div>
                                        </div>

                                        {/* Canlı Animasyon Önizleme Butonu */}
                                        <div
                                          data-preview
                                          style={{
                                            backgroundColor: presets[0].bg,
                                            color: presets[0].text,
                                            borderColor: presets[0].border,
                                          }}
                                          className={`px-4 py-3 rounded-xl border-2 text-sm font-bold text-center select-none cursor-pointer transition-all duration-300 shadow-sm ${anim.id}`}
                                        >
                                          {anim.label}
                                        </div>
                                      </div>
                                    );
                                  })()}
                                </td>
                                <td className="py-3.5 px-2 align-middle text-right space-x-1.5 whitespace-nowrap">
                                  <button
                                    onClick={() => handleDeleteAnim(anim.id, anim.tier)}
                                    disabled={isPending}
                                    className="p-2 bg-red-50 hover:bg-red-500 text-red-500 hover:text-white rounded-xl border border-red-100 transition-colors cursor-pointer disabled:opacity-50 inline-block"
                                    title={lang === "tr" ? "Animasyonu Kaldır" : "Delete Preset"}
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </button>
                                </td>
                              </tr>
                            ));
                          })()}
                        </tbody>
                      </table>
                    </div>

                    {/* Exceeded warnings */}
                    {activeAnimTab === "FREE" && freeAnims.length > 5 && (
                      <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-550 font-bold text-[10px] animate-pulse">
                        ⚠️ {lang === "tr" ? "Maksimum Free paket limiti aşıldı (En fazla 5 adet olmalıdır). Lütfen bazılarını silin veya paketini değiştirin." : "Maximum Free plan limit exceeded (Max 5). Please delete or change tiers."}
                      </div>
                    )}
                    {activeAnimTab === "STARTER" && starterAnims.length > 10 && (
                      <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-550 font-bold text-[10px] animate-pulse">
                        ⚠️ {lang === "tr" ? "Maksimum Starter paket limiti aşıldı (En fazla 10 adet olmalıdır). Lütfen bazılarını silin veya paketini değiştirin." : "Maximum Starter plan limit exceeded (Max 10). Please delete or change tiers."}
                      </div>
                    )}
                    {activeAnimTab === "CREATOR" && creatorAnims.length > 15 && (
                      <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-550 font-bold text-[10px] animate-pulse">
                        ⚠️ {lang === "tr" ? "Maksimum Creator paket limiti aşıldı (En fazla 15 adet olmalıdır). Lütfen bazılarını silin veya paketini değiştirin." : "Maximum Creator plan limit exceeded (Max 15). Please delete or change tiers."}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
