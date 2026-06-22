"use client";

import { useState, useEffect, useTransition, useMemo } from "react";
import Link from "next/link";
import {
  toggleUserTemplateActive,
  updateProfile,
  updateAllLinksCustomStyle,
  applyTemplateToProfile,
  addLink,
  deleteLink,
  removeUserTemplateRelation,
  saveTemplateSettings
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
  Search,
  ArrowUpDown,
  ChevronDown,
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
  createdAt: string;
  customHtml?: string | null;
  masterLayoutHtml?: string | null;
  avatarHtml?: string | null;
  headerHtml?: string | null;
  socialHtml?: string | null;
  linksHtml?: string | null;
  backgroundHtml?: string | null;
  containerClasses?: string | null;
  jsonConfig?: string | null;
  customSchema?: string | null;
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
    updateUserProfile,
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
  const [displayName, setDisplayName] = useState(user.profile?.displayName ?? "");
  const [bio, setBio] = useState(user.profile?.bio ?? "");

  const [templateSettings, setTemplateSettings] = useState<Record<string, any>>(() => {
    try {
      return (user.profile as any)?.templateSettings || {};
    } catch (e) {
      return {};
    }
  });
  const [activeCategory, setActiveCategory] = useState<string>("masterLayout");
  const [newLinkTitle, setNewLinkTitle] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("default");
  const [selectedCategory, setSelectedCategory] = useState("Tümü");

  const categories = useMemo(() => {
    return ["Tümü", ...Array.from(new Set(ownedTemplates.map((t) => t.category || "Genel")))];
  }, [ownedTemplates]);

  const sortedTemplates = useMemo(() => {
    return [...ownedTemplates]
      .filter((template) => {
        const matchesQuery = template.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
          (template.category || "Genel").toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === "Tümü" || (template.category || "Genel") === selectedCategory;
        return matchesQuery && matchesCategory;
      })
      .sort((a, b) => {
        const isActiveA = activeTemplate?.id === a.id;
        const isActiveB = activeTemplate?.id === b.id;

        if (sortOption === "active-first") {
          if (isActiveA && !isActiveB) return -1;
          if (!isActiveA && isActiveB) return 1;
        } else if (sortOption === "name-asc") {
          return a.name.localeCompare(b.name);
        } else if (sortOption === "name-desc") {
          return b.name.localeCompare(a.name);
        } else if (sortOption === "custom-first") {
          const isCustomA = a.category === "Özel";
          const isCustomB = b.category === "Özel";
          if (isCustomA && !isCustomB) return -1;
          if (!isCustomA && isCustomB) return 1;
        } else if (sortOption === "purchased-first") {
          const isCustomA = a.category === "Özel";
          const isCustomB = b.category === "Özel";
          if (!isCustomA && isCustomB) return -1;
          if (isCustomA && !isCustomB) return 1;
        } else if (sortOption === "date-desc") {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        } else if (sortOption === "date-asc") {
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        }
        
        // Default sort (active first, then alphabetical)
        if (isActiveA && !isActiveB) return -1;
        if (!isActiveA && isActiveB) return 1;
        return a.name.localeCompare(b.name);
      });
  }, [ownedTemplates, searchQuery, sortOption, activeTemplate]);

  const handleDeleteOwnedTemplate = async (templateId: string) => {
    if (!confirm(lang === "tr" ? "Bu şablonu hesabınızdan silmek istediğinize emin misiniz? (Bu işlem sadece sizin hesabınızı etkiler, şablon sistemden silinmez)" : "Are you sure you want to delete this template from your account? (This only affects your account, the template will not be deleted from the system)")) {
      return;
    }
    setErrorMsg("");
    setSuccessMsg("");
    startTransition(async () => {
      try {
        const res = await removeUserTemplateRelation(templateId);
        if (res && res.success) {
          setOwnedTemplates(prev => prev.filter(t => t.id !== templateId));
          if (activeTemplate?.id === templateId) {
            setActiveTemplate(null);
            setBackground("");
            setFontStyle("Inter");
            setTheme("dark");
            setActiveTemplateCss(null);
          }
          setSuccessMsg(lang === "tr" ? "Şablon hesabınızdan başarıyla silindi." : "Template deleted from your account successfully.");
        } else {
          setErrorMsg(res.error || "Failed to delete template");
        }
      } catch (err: any) {
        setErrorMsg(err.message || "Failed to delete template");
      }
    });
  };
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

    const dbSocialLinks = (user.profile as any)?.socialLinks || {};
    let socialLinksArr: Array<{ socialPlatform: string; socialUrl: string }> = [];
    if (Array.isArray(dbSocialLinks)) {
      socialLinksArr = dbSocialLinks;
    } else if (typeof dbSocialLinks === 'object' && dbSocialLinks !== null) {
      socialLinksArr = Object.entries(dbSocialLinks).map(([platform, url]) => ({
        socialPlatform: platform.toLowerCase(),
        socialUrl: String(url)
      })).filter(item => item.socialUrl);
    }

    if (customizingTemplateId) {
      const template = ownedTemplates.find(t => t.id === customizingTemplateId);
      if (template) {
        setBackground(template.bgColor);
        setFontStyle(template.fontStyle);
        setTheme(template.name);
        setActiveTemplateCss(template.customCss || null);
        setAvatarUrl(user.profile?.avatarUrl ?? "");
        setDisplayName(user.profile?.displayName ?? "");
        setBio(user.profile?.bio ?? "");

        const defaultSettings = {
          fontStyle: template.fontStyle || user.profile?.fontStyle || "Inter",
          pagePadding: "py-12 px-6",
          containerClasses: "max-w-md mx-auto",
          globalTextColor: "#ffffff",
          bgColor: template.bgColor || user.profile?.background || "#09090b",
          bgGradient: "",
          bgImage: "",
          background: template.bgColor || user.profile?.background || "#09090b",
          avatarBorderColor: "#ffffff",
          avatarSize: "w-24 h-24",
          avatarRadius: "rounded-full",
          usernameColor: user.profile?.usernameColor || "#ffffff",
          bioColor: user.profile?.bioColor || "rgba(255,255,255,0.7)",
          usernameSize: "text-lg",
          bioSize: "text-sm",
          socialLinks: socialLinksArr,
          socialIconColor: null,
          socialIconSize: "w-6 h-6",
          btnBgColor: firstLink?.bgColor || "#ffffff",
          btnTextColor: firstLink?.textColor || "#000000",
          btnBorderColor: firstLink?.borderColor || "transparent",
          btnBorderStyle: firstLink?.borderStyle || "solid",
          btnBorderWidth: firstLink?.borderWidth || "0px",
          btnBorderRadius: firstLink?.borderRadius || "12px",
          btnShadow: firstLink?.shadow || "none",
          btnFontWeight: firstLink?.fontWeight || "font-bold",
          btnHoverEffect: "hover:scale-[1.02] transition-transform",
        };

        const savedSettings = (user.profile as any)?.templateSettings || {};
        const mergedSettings = {
          ...defaultSettings,
          ...savedSettings
        };
        if (!mergedSettings.socialLinks || mergedSettings.socialLinks.length === 0) {
          mergedSettings.socialLinks = socialLinksArr;
        }
        setTemplateSettings(mergedSettings);

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
      setBackground(user.profile?.background ?? "");
      setFontStyle(user.profile?.fontStyle ?? "Inter");
      setTheme(user.profile?.theme ?? "dark");
      setActiveTemplateCss(user.profile?.customCss ?? null);
      setUsernameColor(user.profile?.usernameColor ?? "#ffffff");
      setBioColor(user.profile?.bioColor ?? "#888888");
      setAvatarUrl(user.profile?.avatarUrl ?? "");

      const defaultSettings = {
        displayName: user.profile?.displayName || "",
        bio: user.profile?.bio || "",
        fontStyle: user.profile?.fontStyle || "Inter",
        pagePadding: "py-12 px-6",
        containerClasses: "max-w-md mx-auto",
        globalTextColor: "#ffffff",
        bgColor: user.profile?.background || "#09090b",
        bgGradient: "",
        bgImage: "",
        background: user.profile?.background || "#09090b",
        avatarBorderColor: "#ffffff",
        avatarSize: "w-24 h-24",
        avatarRadius: "rounded-full",
        usernameColor: user.profile?.usernameColor || "#ffffff",
        bioColor: user.profile?.bioColor || "#888888",
        usernameSize: "text-lg",
        bioSize: "text-sm",
        socialLinks: socialLinksArr,
        socialIconColor: null,
        socialIconSize: "w-6 h-6",
        btnBgColor: firstLink?.bgColor || "",
        btnTextColor: firstLink?.textColor || "",
        btnBorderColor: firstLink?.borderColor || "",
        btnBorderStyle: firstLink?.borderStyle || "solid",
        btnBorderWidth: firstLink?.borderWidth || "1px",
        btnBorderRadius: firstLink?.borderRadius || "12px",
        btnShadow: firstLink?.shadow || "none",
        btnFontWeight: firstLink?.fontWeight || "font-bold",
        btnHoverEffect: "hover:scale-[1.02] transition-transform",
      };

      const savedSettings = (user.profile as any)?.templateSettings || {};
      const mergedSettings = {
        ...defaultSettings,
        ...savedSettings
      };
      if (!mergedSettings.socialLinks || mergedSettings.socialLinks.length === 0) {
        mergedSettings.socialLinks = socialLinksArr;
      }
      setTemplateSettings(mergedSettings);

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
    const iconColor = customizingTemplateId ? (templateSettings.socialIconColor || templateSettings.btnTextColor) : btnIconColor;
    if (iconColor) {
      (blockMeta as any).iconColor = iconColor;
    } else {
      delete (blockMeta as any).iconColor;
    }
    return {
      ...link,
      bgColor: customizingTemplateId ? (templateSettings.btnBgColor || null) : (btnBgColor || null),
      textColor: customizingTemplateId ? (templateSettings.btnTextColor || null) : (btnTextColor || null),
      borderColor: customizingTemplateId ? (templateSettings.btnBorderColor || null) : (btnBorderColor || null),
      borderStyle: customizingTemplateId ? (templateSettings.btnBorderStyle || null) : (btnBorderStyle || null),
      borderWidth: customizingTemplateId ? (templateSettings.btnBorderWidth || null) : (btnBorderWidth || null),
      borderRadius: customizingTemplateId ? (templateSettings.btnBorderRadius || null) : (btnBorderRadius || null),
      shadow: customizingTemplateId ? (templateSettings.btnShadow || null) : (btnShadow || null),
      fontWeight: customizingTemplateId ? (templateSettings.btnFontWeight || null) : (btnFontWeight || null),
      metadata: blockMeta
    };
  });

  const activeTmplForPreview = customizingTemplateId 
    ? ownedTemplates.find((t: any) => t.id === customizingTemplateId)
    : ownedTemplates.find((t: any) => t.id === activeTemplate?.id) || ownedTemplates.find((t: any) => t.isActive);

  const dbSocialLinks = customizingTemplateId 
    ? (templateSettings.socialLinks || []) 
    : (user.profile?.socialLinks || {});

  let instagram = "";
  let twitter = "";
  let youtube = "";
  let tiktok = "";
  let whatsapp = "";
  let facebook = "";
  let linkedin = "";
  let pinterest = "";

  if (Array.isArray(dbSocialLinks)) {
    dbSocialLinks.forEach((item: any) => {
      const platform = item.socialPlatform || item.platform;
      const url = item.socialUrl || item.url;
      if (platform === "instagram") instagram = url;
      if (platform === "twitter") twitter = url;
      if (platform === "youtube") youtube = url;
      if (platform === "tiktok") tiktok = url;
      if (platform === "whatsapp") whatsapp = url;
      if (platform === "facebook") facebook = url;
      if (platform === "linkedin") linkedin = url;
      if (platform === "pinterest") pinterest = url;
    });
  } else if (dbSocialLinks && typeof dbSocialLinks === "object") {
    instagram = (dbSocialLinks as any).instagram || "";
    twitter = (dbSocialLinks as any).twitter || "";
    youtube = (dbSocialLinks as any).youtube || "";
    tiktok = (dbSocialLinks as any).tiktok || "";
    whatsapp = (dbSocialLinks as any).whatsapp || "";
    facebook = (dbSocialLinks as any).facebook || "";
    linkedin = (dbSocialLinks as any).linkedin || "";
    pinterest = (dbSocialLinks as any).pinterest || "";
  }

  const userMapped = {
    ...user,
    instagram,
    twitter,
    youtube,
    tiktok,
    whatsapp,
    facebook,
    linkedin,
    pinterest,
  };

  const mappedSocials: Array<{ socialPlatform: string; socialUrl: string }> = [];
  if (userMapped.instagram) mappedSocials.push({ socialPlatform: 'instagram', socialUrl: userMapped.instagram });
  if (userMapped.twitter) mappedSocials.push({ socialPlatform: 'twitter', socialUrl: userMapped.twitter });
  if (userMapped.youtube) mappedSocials.push({ socialPlatform: 'youtube', socialUrl: userMapped.youtube });
  if (userMapped.tiktok) mappedSocials.push({ socialPlatform: 'tiktok', socialUrl: userMapped.tiktok });
  if (userMapped.whatsapp) mappedSocials.push({ socialPlatform: 'whatsapp', socialUrl: userMapped.whatsapp });
  if (userMapped.facebook) mappedSocials.push({ socialPlatform: 'facebook', socialUrl: userMapped.facebook });
  if (userMapped.linkedin) mappedSocials.push({ socialPlatform: 'linkedin', socialUrl: userMapped.linkedin });
  if (userMapped.pinterest) mappedSocials.push({ socialPlatform: 'pinterest', socialUrl: userMapped.pinterest });

  const previewData = {
    username: user.username || "username",
    displayName: customizingTemplateId ? displayName : (user.profile?.displayName || user.username || "username"),
    bio: customizingTemplateId ? bio : (user.profile?.bio || ""),
    avatarUrl: avatarUrl || "",
    theme: theme,
    customCss: activeTmplForPreview ? activeTmplForPreview.customCss : activeTemplateCss,
    background: customizingTemplateId ? (templateSettings.bgColor || templateSettings.background || background) : background,
    buttonClass: customizingTemplateId ? templateSettings.btnBorderRadius : user.profile?.buttonClass,
    fontStyle: customizingTemplateId ? (templateSettings.fontStyle || fontStyle) : fontStyle,
    usernameColor: customizingTemplateId ? (templateSettings.usernameColor || usernameColor) : usernameColor,
    bioColor: customizingTemplateId ? (templateSettings.bioColor || bioColor) : bioColor,
    links: mappedLinks,
    systemSettings: systemSettings,
    plan: simulatedPlan,
    socialLinks: dbSocialLinks,
    socials: mappedSocials,
    isCoded: activeTmplForPreview ? activeTmplForPreview.isCoded : false,
    customHtml: activeTmplForPreview ? activeTmplForPreview.customHtml : null,
    masterLayoutHtml: activeTmplForPreview ? activeTmplForPreview.masterLayoutHtml : null,
    avatarHtml: activeTmplForPreview ? activeTmplForPreview.avatarHtml : null,
    headerHtml: activeTmplForPreview ? activeTmplForPreview.headerHtml : null,
    socialHtml: activeTmplForPreview ? activeTmplForPreview.socialHtml : null,
    linksHtml: activeTmplForPreview ? activeTmplForPreview.linksHtml : null,
    backgroundHtml: activeTmplForPreview ? activeTmplForPreview.backgroundHtml : null,
    containerClasses: activeTmplForPreview ? activeTmplForPreview.containerClasses : null,
    jsonConfig: activeTmplForPreview ? (activeTmplForPreview.jsonConfig || activeTmplForPreview.configJson) : null,
    isPremiumTemplateActive: activeTmplForPreview ? true : (user.profile?.isPremiumTemplateActive ?? false),
    templateSettings: templateSettings,
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
                      {/* 1. MASTER LAYOUT */}
                      <div className="border border-zinc-200 rounded-2xl overflow-hidden shadow-sm bg-white">
                        <button
                          type="button"
                          onClick={() => setActiveCategory(activeCategory === "masterLayout" ? "" : "masterLayout")}
                          className="w-full px-5 py-4 flex items-center justify-between bg-zinc-50 hover:bg-zinc-100 transition-colors text-left"
                        >
                          <div className="flex items-center gap-3 text-zinc-800">
                            <Settings className="h-5 w-5 text-teal-500" />
                            <span className="font-extrabold text-sm uppercase tracking-wider">
                              {lang === "tr" ? "1. Genel Yerleşim (Master Layout)" : "1. Master Layout"}
                            </span>
                          </div>
                          <ChevronDown className={`h-5 w-5 text-zinc-400 transition-transform duration-300 ${activeCategory === "masterLayout" ? "rotate-180" : ""}`} />
                        </button>
                        {activeCategory === "masterLayout" && (
                          <div className="p-5 border-t border-zinc-150 space-y-4 animate-in fade-in duration-200">
                            <div className="space-y-1.5">
                              <label className="text-xs font-bold text-zinc-700 block">
                                {lang === "tr" ? "Yazı Tipi (Font)" : "Font Style"}
                              </label>
                              <select
                                value={templateSettings.fontStyle || "Inter"}
                                onChange={(e) => setTemplateSettings(prev => ({ ...prev, fontStyle: e.target.value }))}
                                className="w-full px-3.5 py-2.5 bg-white border border-zinc-200 rounded-xl text-sm outline-none focus:border-teal-500 cursor-pointer font-semibold text-zinc-800"
                              >
                                <optgroup label={lang === "tr" ? "Ücretsiz Fonts" : "Free Fonts"}>
                                  {fonts.filter((f: any) => f.tier === "FREE").map((f: any) => (
                                    <option key={f.value} value={f.value}>{f.name}</option>
                                  ))}
                                </optgroup>
                                <optgroup label="Starter Fonts">
                                  {fonts.filter((f: any) => f.tier === "STARTER").map((f: any) => (
                                    <option key={f.value} value={f.value} disabled={simulatedPlan === "FREE"}>
                                      {simulatedPlan === "FREE" ? "[Starter] " : ""}{f.name}
                                    </option>
                                  ))}
                                </optgroup>
                                <optgroup label="Creator Fonts">
                                  {fonts.filter((f: any) => f.tier === "CREATOR").map((f: any) => (
                                    <option key={f.value} value={f.value} disabled={simulatedPlan !== "CREATOR" && simulatedPlan !== "PRO_BUSINESS"}>
                                      {(simulatedPlan !== "CREATOR" && simulatedPlan !== "PRO_BUSINESS") ? "[Creator] " : ""}{f.name}
                                    </option>
                                  ))}
                                </optgroup>
                              </select>
                            </div>

                            <div className="space-y-1.5">
                              <label className="text-xs font-bold text-zinc-700 block">
                                {lang === "tr" ? "Sayfa Boşlukları" : "Page Padding"}
                              </label>
                              <input
                                type="text"
                                value={templateSettings.pagePadding || ""}
                                readOnly
                                disabled
                                placeholder="örn: py-12 px-6"
                                className="w-full px-3.5 py-2.5 bg-zinc-100 border border-zinc-200 rounded-xl text-sm outline-none font-semibold text-zinc-500 cursor-not-allowed opacity-60"
                              />
                            </div>

                            <div className="space-y-1.5">
                              <label className="text-xs font-bold text-zinc-700 block">
                                {lang === "tr" ? "Kapsayıcı Sınıfları" : "Container Classes"}
                              </label>
                              <input
                                type="text"
                                value={templateSettings.containerClasses || ""}
                                readOnly
                                disabled
                                placeholder="örn: max-w-md mx-auto"
                                className="w-full px-3.5 py-2.5 bg-zinc-100 border border-zinc-200 rounded-xl text-sm outline-none font-semibold text-zinc-500 cursor-not-allowed opacity-60"
                              />
                            </div>

                            <div className="space-y-1.5">
                              <label className="text-xs font-bold text-zinc-700 block">
                                {lang === "tr" ? "Genel Metin Rengi" : "Global Text Color"}
                              </label>
                              <div className="flex gap-2">
                                <input
                                  type="color"
                                  value={templateSettings.globalTextColor || "#ffffff"}
                                  onChange={(e) => setTemplateSettings(prev => ({ ...prev, globalTextColor: e.target.value }))}
                                  className="h-10 w-12 rounded-xl cursor-pointer border border-zinc-200 shrink-0"
                                />
                                <input
                                  type="text"
                                  value={templateSettings.globalTextColor || ""}
                                  onChange={(e) => setTemplateSettings(prev => ({ ...prev, globalTextColor: e.target.value }))}
                                  className="flex-1 min-w-0 px-3 border border-zinc-200 rounded-xl text-sm font-mono text-zinc-800 bg-white uppercase font-bold"
                                />
                              </div>
                            </div>

                            {(() => {
                              const schema = activeTemplateToCustomize.customSchema;
                              let parsedSchema: any[] = [];
                              if (schema) {
                                try {
                                  parsedSchema = typeof schema === 'string' ? JSON.parse(schema) : schema;
                                } catch (e) {}
                              }

                              if (!Array.isArray(parsedSchema) || parsedSchema.length === 0) return null;

                              return (
                                <div className="space-y-4 pt-4 border-t border-zinc-150">
                                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-1">
                                    {lang === "tr" ? "Şablon Özel Ayarları (Schema)" : "Template Custom Fields (Schema)"}
                                  </label>
                                  {parsedSchema.map((field: any) => {
                                    if (!field.name || !field.type) return null;
                                    const fieldLabel = field.label || field.name;
                                    const currentVal = templateSettings[field.name] !== undefined ? templateSettings[field.name] : (field.defaultValue || "");

                                    const handleFieldChange = (val: any) => {
                                      setTemplateSettings(prev => ({
                                        ...prev,
                                        [field.name]: val
                                      }));
                                    };

                                    return (
                                      <div key={field.name} className="space-y-1.5">
                                        <label className="text-xs font-bold text-zinc-700 block">
                                          {fieldLabel}
                                        </label>
                                        {field.type === "color" && (
                                          <div className="flex gap-2">
                                            <input
                                              type="color"
                                              value={currentVal || "#ffffff"}
                                              onChange={(e) => handleFieldChange(e.target.value)}
                                              className="h-10 w-12 rounded-xl cursor-pointer border border-zinc-200 shrink-0"
                                            />
                                            <input
                                              type="text"
                                              value={currentVal}
                                              onChange={(e) => handleFieldChange(e.target.value)}
                                              className="flex-1 min-w-0 px-3 border border-zinc-200 rounded-xl text-sm font-mono text-zinc-800 bg-white uppercase font-bold"
                                            />
                                          </div>
                                        )}
                                        {field.type === "url" && (
                                          <input
                                            type="url"
                                            placeholder="https://"
                                            value={currentVal}
                                            onChange={(e) => handleFieldChange(e.target.value)}
                                            className="w-full px-3.5 py-2.5 bg-white border border-zinc-200 rounded-xl text-sm outline-none focus:border-teal-500 font-semibold text-zinc-800"
                                          />
                                        )}
                                        {field.type === "text" && (
                                          <input
                                            type="text"
                                            value={currentVal}
                                            onChange={(e) => handleFieldChange(e.target.value)}
                                            className="w-full px-3.5 py-2.5 bg-white border border-zinc-200 rounded-xl text-sm outline-none focus:border-teal-500 font-semibold text-zinc-800"
                                          />
                                        )}
                                        {field.type === "textarea" && (
                                          <textarea
                                            rows={3}
                                            value={currentVal}
                                            onChange={(e) => handleFieldChange(e.target.value)}
                                            className="w-full px-3.5 py-2.5 bg-white border border-zinc-200 rounded-xl text-sm outline-none focus:border-teal-500 font-semibold text-zinc-800"
                                          />
                                        )}
                                        {field.type === "select" && Array.isArray(field.options) && (
                                          <select
                                            value={currentVal}
                                            onChange={(e) => handleFieldChange(e.target.value)}
                                            className="w-full px-3.5 py-2.5 bg-white border border-zinc-200 rounded-xl text-sm outline-none focus:border-teal-500 cursor-pointer font-semibold text-zinc-800"
                                          >
                                            <option value="">{lang === "tr" ? "Seçiniz..." : "Select..."}</option>
                                            {field.options.map((opt: any) => {
                                              const optVal = typeof opt === 'object' ? opt.value : opt;
                                              const optLabel = typeof opt === 'object' ? opt.label : opt;
                                              return (
                                                <option key={optVal} value={optVal}>{optLabel}</option>
                                              );
                                            })}
                                          </select>
                                        )}
                                      </div>
                                    );
                                  })}
                                </div>
                              );
                            })()}
                          </div>
                        )}
                      </div>

                      {/* 2. BACKGROUND LAYER */}
                      <div className="border border-zinc-200 rounded-2xl overflow-hidden shadow-sm bg-white">
                        <button
                          type="button"
                          onClick={() => setActiveCategory(activeCategory === "backgroundLayer" ? "" : "backgroundLayer")}
                          className="w-full px-5 py-4 flex items-center justify-between bg-zinc-50 hover:bg-zinc-100 transition-colors text-left"
                        >
                          <div className="flex items-center gap-3 text-zinc-800">
                            <Palette className="h-5 w-5 text-teal-500" />
                            <span className="font-extrabold text-sm uppercase tracking-wider">
                              {lang === "tr" ? "2. Arka Plan Katmanı" : "2. Background Layer"}
                            </span>
                          </div>
                          <ChevronDown className={`h-5 w-5 text-zinc-400 transition-transform duration-300 ${activeCategory === "backgroundLayer" ? "rotate-180" : ""}`} />
                        </button>
                        {activeCategory === "backgroundLayer" && (
                          <div className="p-5 border-t border-zinc-150 space-y-4 animate-in fade-in duration-200">
                            <div className="space-y-1.5">
                              <label className="text-xs font-bold text-zinc-700 block">
                                {lang === "tr" ? "Arka Plan Rengi" : "Background Color"}
                              </label>
                              <div className="flex gap-2">
                                <input
                                  type="color"
                                  value={templateSettings.bgColor || "#09090b"}
                                  onChange={(e) => setTemplateSettings(prev => ({ ...prev, bgColor: e.target.value, background: e.target.value }))}
                                  className="h-10 w-12 rounded-xl cursor-pointer border border-zinc-200 shrink-0"
                                />
                                <input
                                  type="text"
                                  value={templateSettings.bgColor || ""}
                                  onChange={(e) => setTemplateSettings(prev => ({ ...prev, bgColor: e.target.value, background: e.target.value }))}
                                  className="flex-1 min-w-0 px-3 border border-zinc-200 rounded-xl text-sm font-mono text-zinc-800 bg-white uppercase font-bold"
                                />
                              </div>
                            </div>

                            <div className="space-y-1.5">
                              <label className="text-xs font-bold text-zinc-700 block">
                                {lang === "tr" ? "Gradient Ayarları (Sınıflar)" : "Gradient Settings (Classes)"}
                              </label>
                              <input
                                type="text"
                                value={templateSettings.bgGradient || ""}
                                onChange={(e) => setTemplateSettings(prev => ({ ...prev, bgGradient: e.target.value, background: e.target.value || prev.bgColor }))}
                                placeholder="örn: bg-gradient-to-tr from-slate-900 via-zinc-900 to-slate-900"
                                className="w-full px-3.5 py-2.5 bg-white border border-zinc-200 rounded-xl text-sm outline-none focus:border-teal-500 font-semibold text-zinc-800"
                              />
                            </div>

                            <div className="space-y-1.5">
                              <label className="text-xs font-bold text-zinc-700 block">
                                {lang === "tr" ? "Arka Plan Görsel URL" : "Background Image URL"}
                              </label>
                              <input
                                type="url"
                                value={templateSettings.bgImage || ""}
                                onChange={(e) => setTemplateSettings(prev => ({ ...prev, bgImage: e.target.value }))}
                                placeholder="https://..."
                                className="w-full px-3.5 py-2.5 bg-white border border-zinc-200 rounded-xl text-sm outline-none focus:border-teal-500 font-semibold text-zinc-800"
                              />
                            </div>
                          </div>
                        )}
                      </div>

                      {/* 3. AVATAR SECTION */}
                      <div className="border border-zinc-200 rounded-2xl overflow-hidden shadow-sm bg-white">
                        <button
                          type="button"
                          onClick={() => setActiveCategory(activeCategory === "avatarSection" ? "" : "avatarSection")}
                          className="w-full px-5 py-4 flex items-center justify-between bg-zinc-50 hover:bg-zinc-100 transition-colors text-left"
                        >
                          <div className="flex items-center gap-3 text-zinc-800">
                            <User className="h-5 w-5 text-teal-500" />
                            <span className="font-extrabold text-sm uppercase tracking-wider">
                              {lang === "tr" ? "3. Avatar Bölümü" : "3. Avatar Section"}
                            </span>
                          </div>
                          <ChevronDown className={`h-5 w-5 text-zinc-400 transition-transform duration-300 ${activeCategory === "avatarSection" ? "rotate-180" : ""}`} />
                        </button>
                        {activeCategory === "avatarSection" && (
                          <div className="p-5 border-t border-zinc-150 space-y-4 animate-in fade-in duration-200">
                            <div className="space-y-2">
                              <label className="text-xs font-bold text-zinc-700 block">
                                {lang === "tr" ? "Profil Fotoğrafı Yükle" : "Upload Profile Photo"}
                              </label>
                              <div className="p-4 rounded-xl border flex flex-col sm:flex-row items-center gap-4 bg-zinc-50 border-zinc-200">
                                <div className="w-16 h-16 rounded-full border flex items-center justify-center overflow-hidden shrink-0 bg-white border-zinc-300 shadow-inner">
                                  {avatarUrl ? (
                                    <img src={avatarUrl} alt="Preview" className="w-full h-full object-cover" />
                                  ) : (
                                    <User className="h-6 w-6 text-slate-500" />
                                  )}
                                </div>
                                <div className="space-y-1.5">
                                  <div className="flex gap-2">
                                    <label className="px-3 py-2 rounded-lg border text-xs font-bold transition-all cursor-pointer select-none bg-white hover:bg-zinc-50 border-zinc-300 text-zinc-700 shadow-sm">
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
                                        className="px-3 py-2 rounded-lg border text-xs font-bold transition-all cursor-pointer select-none bg-red-50 hover:bg-red-100 border-red-200 text-red-600"
                                      >
                                        {lang === "tr" ? "Kaldır" : "Remove"}
                                      </button>
                                    )}
                                  </div>
                                  <p className="text-[10px] text-slate-500 font-semibold">
                                    {lang === "tr" ? "Maksimum 2.5MB (PNG, JPG)." : "Max 2.5MB (PNG, JPG)."}
                                  </p>
                                </div>
                              </div>
                            </div>

                            <div className="space-y-1.5">
                              <label className="text-xs font-bold text-zinc-700 block">
                                {lang === "tr" ? "Avatar Çerçeve Rengi" : "Avatar Border Color"}
                              </label>
                              <div className="flex gap-2">
                                <input
                                  type="color"
                                  value={templateSettings.avatarBorderColor || "#ffffff"}
                                  disabled
                                  className="h-10 w-12 rounded-xl border border-zinc-200 shrink-0 cursor-not-allowed opacity-60 bg-zinc-100 pointer-events-none"
                                />
                                <input
                                  type="text"
                                  value={templateSettings.avatarBorderColor || ""}
                                  readOnly
                                  className="flex-1 min-w-0 px-3 border border-zinc-200 rounded-xl text-sm font-mono text-zinc-500 uppercase font-bold cursor-not-allowed opacity-60 bg-zinc-100 pointer-events-none"
                                />
                              </div>
                            </div>

                            <div className="space-y-1.5">
                              <label className="text-xs font-bold text-zinc-700 block">
                                {lang === "tr" ? "Profil Fotoğrafı Boyutu" : "Profile Picture Size"}
                              </label>
                              <select
                                value={templateSettings.avatarSize || "w-24 h-24"}
                                disabled
                                className="w-full px-3.5 py-2.5 border border-zinc-200 rounded-xl text-sm outline-none font-semibold text-zinc-500 cursor-not-allowed opacity-60 bg-zinc-100 pointer-events-none"
                              >
                                <option value="w-16 h-16">64px</option>
                                <option value="w-20 h-20">80px</option>
                                <option value="w-24 h-24">96px</option>
                                <option value="w-28 h-28">112px</option>
                                <option value="w-32 h-32">128px</option>
                              </select>
                            </div>

                            <div className="space-y-1.5">
                              <label className="text-xs font-bold text-zinc-700 block">
                                {lang === "tr" ? "Avatar Kavis Ayarları" : "Avatar Shape/Radius"}
                              </label>
                              <select
                                value={templateSettings.avatarRadius || "rounded-full"}
                                disabled
                                className="w-full px-3.5 py-2.5 border border-zinc-200 rounded-xl text-sm outline-none font-semibold text-zinc-500 cursor-not-allowed opacity-60 bg-zinc-100 pointer-events-none"
                              >
                                <option value="rounded-full">{lang === "tr" ? "Daire (Circle)" : "Circle"}</option>
                                <option value="rounded-none">{lang === "tr" ? "Kare (Square)" : "Square"}</option>
                                <option value="rounded-2xl">{lang === "tr" ? "Yumuşatılmış Kare (Squircle)" : "Squircle"}</option>
                                <option value="rounded-tl-3xl rounded-br-3xl">{lang === "tr" ? "Yaprak (Leaf)" : "Leaf"}</option>
                              </select>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* 4. HEADER & BIO */}
                      <div className="border border-zinc-200 rounded-2xl overflow-hidden shadow-sm bg-white">
                        <button
                          type="button"
                          onClick={() => setActiveCategory(activeCategory === "headerBio" ? "" : "headerBio")}
                          className="w-full px-5 py-4 flex items-center justify-between bg-zinc-50 hover:bg-zinc-100 transition-colors text-left"
                        >
                          <div className="flex items-center gap-3 text-zinc-800">
                            <FileText className="h-5 w-5 text-teal-500" />
                            <span className="font-extrabold text-sm uppercase tracking-wider">
                              {lang === "tr" ? "4. Başlık ve Bio" : "4. Header & Bio"}
                            </span>
                          </div>
                          <ChevronDown className={`h-5 w-5 text-zinc-400 transition-transform duration-300 ${activeCategory === "headerBio" ? "rotate-180" : ""}`} />
                        </button>
                        {activeCategory === "headerBio" && (
                          <div className="p-5 border-t border-zinc-150 space-y-4 animate-in fade-in duration-200">
                            <div className="space-y-1.5">
                              <label className="text-xs font-bold text-zinc-700 block">
                                {lang === "tr" ? "Görüntülenen İsim" : "Display Name"}
                              </label>
                              <input
                                type="text"
                                value={displayName}
                                onChange={(e) => setDisplayName(e.target.value)}
                                className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm outline-none focus:border-teal-500 font-semibold text-zinc-800"
                                placeholder={lang === "tr" ? "İsminizi girin..." : "Enter your name..."}
                              />
                            </div>

                            <div className="space-y-1.5">
                              <label className="text-xs font-bold text-zinc-700 block">
                                {lang === "tr" ? "Biyografi" : "Bio"}
                              </label>
                              <textarea
                                value={bio}
                                onChange={(e) => setBio(e.target.value)}
                                className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm outline-none focus:border-teal-500 font-semibold text-zinc-800 resize-none"
                                rows={3}
                                placeholder={lang === "tr" ? "Kendinizden kısaca bahsedin..." : "Write a short bio..."}
                              />
                            </div>

                            <div className="space-y-1.5">
                              <label className="text-xs font-bold text-zinc-700 block">
                                {lang === "tr" ? "İsim Rengi" : "Name Color"}
                              </label>
                              <div className="flex gap-2">
                                <input
                                  type="color"
                                  value={templateSettings.usernameColor || "#ffffff"}
                                  onChange={(e) => setTemplateSettings(prev => ({ ...prev, usernameColor: e.target.value }))}
                                  className="h-10 w-12 rounded-xl cursor-pointer border border-zinc-200 shrink-0"
                                />
                                <input
                                  type="text"
                                  value={templateSettings.usernameColor || ""}
                                  onChange={(e) => setTemplateSettings(prev => ({ ...prev, usernameColor: e.target.value }))}
                                  className="flex-1 min-w-0 px-3 border border-zinc-200 rounded-xl text-sm font-mono text-zinc-800 bg-white uppercase font-bold"
                                />
                              </div>
                            </div>

                            <div className="space-y-1.5">
                              <label className="text-xs font-bold text-zinc-700 block">
                                {lang === "tr" ? "Biyografi Rengi" : "Bio Color"}
                              </label>
                              <div className="flex gap-2">
                                <input
                                  type="color"
                                  value={templateSettings.bioColor || "#888888"}
                                  onChange={(e) => setTemplateSettings(prev => ({ ...prev, bioColor: e.target.value }))}
                                  className="h-10 w-12 rounded-xl cursor-pointer border border-zinc-200 shrink-0"
                                />
                                <input
                                  type="text"
                                  value={templateSettings.bioColor || ""}
                                  onChange={(e) => setTemplateSettings(prev => ({ ...prev, bioColor: e.target.value }))}
                                  className="flex-1 min-w-0 px-3 border border-zinc-200 rounded-xl text-sm font-mono text-zinc-800 bg-white uppercase font-bold"
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-1.5">
                                <label className="text-xs font-bold text-zinc-700 block">
                                  {lang === "tr" ? "İsim Boyutu" : "Name Size"}
                                </label>
                                <select
                                  value={templateSettings.usernameSize || "text-lg"}
                                  onChange={(e) => setTemplateSettings(prev => ({ ...prev, usernameSize: e.target.value }))}
                                  className="w-full px-3.5 py-2.5 bg-white border border-zinc-200 rounded-xl text-sm outline-none focus:border-teal-500 cursor-pointer font-semibold text-zinc-800"
                                >
                                  <option value="text-sm">Small</option>
                                  <option value="text-base">Medium</option>
                                  <option value="text-lg">Large</option>
                                  <option value="text-xl">X-Large</option>
                                  <option value="text-2xl">2X-Large</option>
                                </select>
                              </div>
                              <div className="space-y-1.5">
                                <label className="text-xs font-bold text-zinc-700 block">
                                  {lang === "tr" ? "Biyografi Boyutu" : "Bio Size"}
                                </label>
                                <select
                                  value={templateSettings.bioSize || "text-sm"}
                                  onChange={(e) => setTemplateSettings(prev => ({ ...prev, bioSize: e.target.value }))}
                                  className="w-full px-3.5 py-2.5 bg-white border border-zinc-200 rounded-xl text-sm outline-none focus:border-teal-500 cursor-pointer font-semibold text-zinc-800"
                                >
                                  <option value="text-[10px]">X-Small</option>
                                  <option value="text-xs">Small</option>
                                  <option value="text-sm">Medium</option>
                                  <option value="text-base">Large</option>
                                </select>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* 5. SOCIAL MEDIA ICONS */}
                      <div className="border border-zinc-200 rounded-2xl overflow-hidden shadow-sm bg-white">
                        <button
                          type="button"
                          onClick={() => setActiveCategory(activeCategory === "socialIcons" ? "" : "socialIcons")}
                          className="w-full px-5 py-4 flex items-center justify-between bg-zinc-50 hover:bg-zinc-100 transition-colors text-left"
                        >
                          <div className="flex items-center gap-3 text-zinc-800">
                            <Globe className="h-5 w-5 text-teal-500" />
                            <span className="font-extrabold text-sm uppercase tracking-wider">
                              {lang === "tr" ? "5. Sosyal Medya İkonları" : "5. Social Media Icons"}
                            </span>
                          </div>
                          <ChevronDown className={`h-5 w-5 text-zinc-400 transition-transform duration-300 ${activeCategory === "socialIcons" ? "rotate-180" : ""}`} />
                        </button>
                        {activeCategory === "socialIcons" && (
                          <div className="p-5 border-t border-zinc-150 space-y-4 animate-in fade-in duration-200">
                            <div className="space-y-3">
                              <label className="text-xs font-bold text-zinc-700 block">
                                {lang === "tr" ? "Sosyal Medya Hesaplarınız" : "Your Social Media Accounts"}
                              </label>
                              <div className="space-y-3">
                                {[
                                  { id: "instagram", name: "Instagram", placeholder: "kullanıcıadı veya link" },
                                  { id: "whatsapp", name: "WhatsApp", placeholder: "+905... veya link" },
                                  { id: "tiktok", name: "TikTok", placeholder: "kullanıcıadı veya link" },
                                  { id: "youtube", name: "YouTube", placeholder: "kanal veya link" },
                                  { id: "x", name: "Twitter/X", placeholder: "kullanıcıadı veya link" },
                                  { id: "linkedin", name: "LinkedIn", placeholder: "profil linki" },
                                  { id: "facebook", name: "Facebook", placeholder: "profil linki" }
                                ].map(platform => {
                                  const socialArr = templateSettings.socialLinks || [];
                                  const existingItem = socialArr.find((item: any) => item.socialPlatform === platform.id);
                                  const currentVal = existingItem ? existingItem.socialUrl : "";

                                  const handleSocialChange = (val: string) => {
                                    const cleanVal = val.trim();
                                    setTemplateSettings(prev => {
                                      const arr = prev.socialLinks ? [...prev.socialLinks] : [];
                                      const idx = arr.findIndex((item: any) => item.socialPlatform === platform.id);
                                      if (idx > -1) {
                                        if (!cleanVal) {
                                          arr.splice(idx, 1);
                                        } else {
                                          arr[idx] = { ...arr[idx], socialUrl: cleanVal };
                                        }
                                      } else if (cleanVal) {
                                        arr.push({ socialPlatform: platform.id, socialUrl: cleanVal });
                                      }
                                      return { ...prev, socialLinks: arr };
                                    });
                                  };

                                  const handleSocialBlur = (val: string) => {
                                    const formatted = formatSocialUrl(platform.id.toUpperCase(), val);
                                    if (formatted) {
                                      handleSocialChange(formatted);
                                    }
                                  };

                                  return (
                                    <div key={platform.id} className="space-y-1.5">
                                      <label className="text-[11px] font-bold text-zinc-500 block">
                                        {platform.name}
                                      </label>
                                      <input
                                        type="text"
                                        value={currentVal}
                                        onChange={(e) => handleSocialChange(e.target.value)}
                                        onBlur={(e) => handleSocialBlur(e.target.value)}
                                        placeholder={platform.placeholder}
                                        className="w-full px-3.5 py-2 bg-white border border-zinc-200 rounded-xl text-xs outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all font-semibold text-zinc-800"
                                      />
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* 6. LINK BUTTONS */}
                      <div className="border border-zinc-200 rounded-2xl overflow-hidden shadow-sm bg-white">
                        <button
                          type="button"
                          onClick={() => setActiveCategory(activeCategory === "linkButtons" ? "" : "linkButtons")}
                          className="w-full px-5 py-4 flex items-center justify-between bg-zinc-50 hover:bg-zinc-100 transition-colors text-left"
                        >
                          <div className="flex items-center gap-3 text-zinc-800">
                            <Code className="h-5 w-5 text-teal-500" />
                            <span className="font-extrabold text-sm uppercase tracking-wider">
                              {lang === "tr" ? "6. Link Butonları" : "6. Link Buttons"}
                            </span>
                          </div>
                          <ChevronDown className={`h-5 w-5 text-zinc-400 transition-transform duration-300 ${activeCategory === "linkButtons" ? "rotate-180" : ""}`} />
                        </button>
                        {activeCategory === "linkButtons" && (
                          <div className="p-5 border-t border-zinc-150 space-y-4 animate-in fade-in duration-200">
                            <div className="space-y-1.5">
                              <label className="text-xs font-bold text-zinc-700 block">
                                {lang === "tr" ? "Buton Arka Plan Rengi" : "Button Background Color"}
                              </label>
                              <div className="flex gap-2">
                                <input
                                  type="color"
                                  value={templateSettings.btnBgColor || "#ffffff"}
                                  onChange={(e) => setTemplateSettings(prev => ({ ...prev, btnBgColor: e.target.value }))}
                                  className="h-10 w-12 rounded-xl cursor-pointer border border-zinc-200 shrink-0"
                                />
                                <input
                                  type="text"
                                  value={templateSettings.btnBgColor || ""}
                                  onChange={(e) => setTemplateSettings(prev => ({ ...prev, btnBgColor: e.target.value }))}
                                  className="flex-1 min-w-0 px-3 border border-zinc-200 rounded-xl text-sm font-mono text-zinc-800 bg-white uppercase font-bold"
                                />
                              </div>
                            </div>

                            <div className="space-y-1.5">
                              <label className="text-xs font-bold text-zinc-700 block">
                                {lang === "tr" ? "Buton Metin Rengi" : "Button Text Color"}
                              </label>
                              <div className="flex gap-2">
                                <input
                                  type="color"
                                  value={templateSettings.btnTextColor || "#000000"}
                                  onChange={(e) => setTemplateSettings(prev => ({ ...prev, btnTextColor: e.target.value }))}
                                  className="h-10 w-12 rounded-xl cursor-pointer border border-zinc-200 shrink-0"
                                />
                                <input
                                  type="text"
                                  value={templateSettings.btnTextColor || ""}
                                  onChange={(e) => setTemplateSettings(prev => ({ ...prev, btnTextColor: e.target.value }))}
                                  className="flex-1 min-w-0 px-3 border border-zinc-200 rounded-xl text-sm font-mono text-zinc-800 bg-white uppercase font-bold"
                                />
                              </div>
                            </div>

                            <div className="space-y-1.5">
                              <label className="text-xs font-bold text-zinc-700 block">
                                {lang === "tr" ? "Buton Çerçeve Rengi" : "Button Border Color"}
                              </label>
                              <div className="flex gap-2">
                                <input
                                  type="color"
                                  value={templateSettings.btnBorderColor || "transparent"}
                                  onChange={(e) => setTemplateSettings(prev => ({ ...prev, btnBorderColor: e.target.value }))}
                                  className="h-10 w-12 rounded-xl cursor-pointer border border-zinc-200 shrink-0"
                                />
                                <input
                                  type="text"
                                  value={templateSettings.btnBorderColor || ""}
                                  onChange={(e) => setTemplateSettings(prev => ({ ...prev, btnBorderColor: e.target.value }))}
                                  className="flex-1 min-w-0 px-3 border border-zinc-200 rounded-xl text-sm font-mono text-zinc-800 bg-white uppercase font-bold"
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-1.5">
                                <label className="text-xs font-bold text-zinc-700 block">
                                  {lang === "tr" ? "Çerçeve Stili" : "Border Style"}
                                </label>
                                <select
                                  value={templateSettings.btnBorderStyle || "solid"}
                                  onChange={(e) => setTemplateSettings(prev => ({ ...prev, btnBorderStyle: e.target.value }))}
                                  className="w-full px-3.5 py-2.5 bg-white border border-zinc-200 rounded-xl text-sm outline-none focus:border-teal-500 cursor-pointer font-semibold text-zinc-800"
                                >
                                  <option value="solid">Solid</option>
                                  <option value="dashed">Dashed</option>
                                  <option value="dotted">Dotted</option>
                                  <option value="none">None</option>
                                </select>
                              </div>
                              <div className="space-y-1.5">
                                <label className="text-xs font-bold text-zinc-700 block">
                                  {lang === "tr" ? "Çerçeve Kalınlığı" : "Border Width"}
                                </label>
                                <select
                                  value={templateSettings.btnBorderWidth || "0px"}
                                  onChange={(e) => setTemplateSettings(prev => ({ ...prev, btnBorderWidth: e.target.value }))}
                                  className="w-full px-3.5 py-2.5 bg-white border border-zinc-200 rounded-xl text-sm outline-none focus:border-teal-500 cursor-pointer font-semibold text-zinc-800"
                                >
                                  <option value="0px">0px</option>
                                  <option value="1px">1px</option>
                                  <option value="2px">2px</option>
                                  <option value="3px">3px</option>
                                </select>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-1.5">
                                <label className="text-xs font-bold text-zinc-700 block">
                                  {lang === "tr" ? "Buton Kavis Ayarı" : "Button Border Radius"}
                                </label>
                                <select
                                  value={templateSettings.btnBorderRadius || "12px"}
                                  onChange={(e) => setTemplateSettings(prev => ({ ...prev, btnBorderRadius: e.target.value }))}
                                  className="w-full px-3.5 py-2.5 bg-white border border-zinc-200 rounded-xl text-sm outline-none focus:border-teal-500 cursor-pointer font-semibold text-zinc-800"
                                >
                                  <option value="0px">{lang === "tr" ? "Keskin (None)" : "None"}</option>
                                  <option value="8px">Small (8px)</option>
                                  <option value="12px">Medium (12px)</option>
                                  <option value="20px">Large (20px)</option>
                                  <option value="9999px">{lang === "tr" ? "Tam Oval (Full)" : "Full"}</option>
                                </select>
                              </div>
                              <div className="space-y-1.5">
                                <label className="text-xs font-bold text-zinc-700 block">
                                  {lang === "tr" ? "Hover Efekti" : "Hover Effect"}
                                </label>
                                <select
                                  value={templateSettings.btnHoverEffect || "hover:scale-[1.02] transition-transform"}
                                  onChange={(e) => setTemplateSettings(prev => ({ ...prev, btnHoverEffect: e.target.value }))}
                                  className="w-full px-3.5 py-2.5 bg-white border border-zinc-200 rounded-xl text-sm outline-none focus:border-teal-500 cursor-pointer font-semibold text-zinc-800"
                                >
                                  <option value="none">{lang === "tr" ? "Yok" : "None"}</option>
                                  <option value="hover:scale-[1.02] transition-transform">{lang === "tr" ? "Büyüme" : "Scale Up"}</option>
                                  <option value="hover:opacity-90 transition-opacity">{lang === "tr" ? "Opaklık Azalması" : "Opacity Fade"}</option>
                                  <option value="hover:shadow-lg transition-shadow">{lang === "tr" ? "Gölge Parlaması" : "Shadow Glow"}</option>
                                </select>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-1.5">
                                <label className="text-xs font-bold text-zinc-700 block">
                                  {lang === "tr" ? "Buton Gölgesi" : "Button Shadow"}
                                </label>
                                <select
                                  value={templateSettings.btnShadow || "none"}
                                  onChange={(e) => setTemplateSettings(prev => ({ ...prev, btnShadow: e.target.value }))}
                                  className="w-full px-3.5 py-2.5 bg-white border border-zinc-200 rounded-xl text-sm outline-none focus:border-teal-500 cursor-pointer font-semibold text-zinc-800"
                                >
                                  <option value="none">None</option>
                                  <option value="shadow-sm">Small</option>
                                  <option value="shadow">Medium</option>
                                  <option value="shadow-md">Large</option>
                                  <option value="shadow-lg">X-Large</option>
                                </select>
                              </div>
                              <div className="space-y-1.5">
                                <label className="text-xs font-bold text-zinc-700 block">
                                  {lang === "tr" ? "Buton Yazı Kalınlığı" : "Button Font Weight"}
                                </label>
                                <select
                                  value={templateSettings.btnFontWeight || "font-bold"}
                                  onChange={(e) => setTemplateSettings(prev => ({ ...prev, btnFontWeight: e.target.value }))}
                                  className="w-full px-3.5 py-2.5 bg-white border border-zinc-200 rounded-xl text-sm outline-none focus:border-teal-500 cursor-pointer font-semibold text-zinc-800"
                                >
                                  <option value="font-normal">Normal</option>
                                  <option value="font-medium">Medium</option>
                                  <option value="font-semibold">Semibold</option>
                                  <option value="font-bold">Bold</option>
                                  <option value="font-black">Black</option>
                                </select>
                              </div>
                            </div>

                            <div className="space-y-2.5 pt-4 border-t border-zinc-200/65">
                              <label className="text-xs font-bold text-zinc-750 block">
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
                        )}
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
                               const socialLinksArr = templateSettings.socialLinks || [];

                               // 3. Save templateSettings
                               const payloadSettings = {
                                 ...templateSettings,
                                 socialLinks: socialLinksArr
                               };
                               await saveTemplateSettings(
                                 user.id,
                                 payloadSettings,
                                 displayName || undefined,
                                 bio || undefined,
                                 avatarUrl || undefined
                               );

                               // 4. Update Profile settings
                               await updateProfile(
                                 user.id,
                                 bio || "",
                                 activeTemplateToCustomize.name, // theme
                                 user.username || "",
                                 avatarUrl || undefined, // dynamic profile photo
                                 templateSettings.bgColor || background || undefined,
                                 templateSettings.fontStyle || fontStyle || undefined,
                                 templateSettings.bioColor || bioColor || undefined,
                                 templateSettings.usernameColor || usernameColor || undefined,
                                 activeTemplateCss || null,
                                 activeTemplateToCustomize.buttonStyle,
                                 user.profile?.avatarShape || undefined,
                                 displayName || undefined,
                                 socialLinksArr
                               );

                               // Update local context
                               updateUserProfile({
                                 avatarUrl: avatarUrl || null,
                                 displayName: displayName || null,
                                 bio: bio || null,
                                 theme: activeTemplateToCustomize.name,
                                 background: templateSettings.bgColor || background || undefined,
                                 fontStyle: templateSettings.fontStyle || fontStyle || undefined,
                                 bioColor: templateSettings.bioColor || bioColor || undefined,
                                 usernameColor: templateSettings.usernameColor || usernameColor || undefined,
                                 customCss: activeTemplateCss || null,
                                 buttonClass: activeTemplateToCustomize.buttonStyle,
                               });

                               // 5. Update Links custom styling
                               await updateAllLinksCustomStyle(
                                 user.id,
                                 templateSettings.btnBgColor || btnBgColor || null,
                                 templateSettings.btnTextColor || btnTextColor || null,
                                 templateSettings.btnBorderColor || btnBorderColor || null,
                                 templateSettings.btnBorderStyle || btnBorderStyle || null,
                                 templateSettings.btnBorderWidth || btnBorderWidth || null,
                                 templateSettings.btnBorderRadius || btnBorderRadius || null,
                                 templateSettings.btnShadow || btnShadow || null,
                                 templateSettings.btnFontWeight || btnFontWeight || null,
                                 templateSettings.socialIconColor || btnIconColor || null
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
                                 bgColor: templateSettings.bgColor || background,
                                 fontStyle: templateSettings.fontStyle || fontStyle,
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

    {/* Search + Sort row */}
    {ownedTemplates.length > 0 && (
      <div className="flex flex-col sm:flex-row gap-3 items-center pb-2">
        <div className="relative flex-1 w-full">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
            <Search className="h-4 w-4" />
          </span>
          <input
            type="text"
            placeholder={lang === "tr" ? "Şablon ara..." : "Search templates..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-200 focus:border-teal-500/50 outline-none text-sm bg-zinc-50 text-zinc-900 font-medium transition-colors"
          />
        </div>

        <div className="relative w-full sm:w-56">
          <ArrowUpDown className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 pointer-events-none" />
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="w-full pl-10 pr-8 py-2.5 rounded-xl border border-zinc-200 focus:border-teal-500/50 outline-none text-sm bg-zinc-50 text-zinc-900 font-medium appearance-none cursor-pointer transition-colors"
          >
            <option value="default">{lang === "tr" ? "Varsayılan Sıralama" : "Default Sorting"}</option>
            <option value="active-first">{lang === "tr" ? "Aktifler Önce" : "Active First"}</option>
            <option value="name-asc">{lang === "tr" ? "İsim: A → Z" : "Name: A → Z"}</option>
            <option value="name-desc">{lang === "tr" ? "İsim: Z → A" : "Name: Z → A"}</option>
            <option value="custom-first">{lang === "tr" ? "Özel Şablonlar Önce" : "Custom Templates First"}</option>
            <option value="purchased-first">{lang === "tr" ? "Satın Alınanlar Önce" : "Purchased Templates First"}</option>
            <option value="date-desc">{lang === "tr" ? "Yeniden Eskiye" : "Newest First"}</option>
            <option value="date-asc">{lang === "tr" ? "Eskiden Yeniye" : "Oldest First"}</option>
          </select>
          <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 pointer-events-none" />
        </div>
      </div>
    )}

    {/* Category Tabs */}
    {ownedTemplates.length > 0 && (
      <div className="flex flex-wrap gap-1.5 justify-start pb-4 border-b border-zinc-100 mb-4">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              selectedCategory === cat
                ? "bg-zinc-900 text-white shadow-sm"
                : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 border border-zinc-200"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
    )}

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
 ) : sortedTemplates.length === 0 ? (
   <div className="text-center py-10 space-y-2 border border-dashed border-zinc-200 rounded-2xl bg-zinc-50/50 w-full">
     <p className="text-xs font-bold text-zinc-500">
       {lang === "tr" ? "Aramanızla eşleşen şablon bulunamadı." : "No templates match your search query."}
     </p>
   </div>
 ) : (
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
 {sortedTemplates.map((template) => {
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

 <button
 type="button"
 onClick={() => handleDeleteOwnedTemplate(template.id)}
 disabled={isPending}
 className="px-2.5 py-2.5 md:py-2 rounded-xl border border-zinc-200 hover:border-red-200 hover:bg-red-50 text-zinc-500 hover:text-red-600 transition-all cursor-pointer flex items-center justify-center shadow-sm disabled:opacity-50"
 title={lang === "tr" ? "Şablonu Sil" : "Delete Template"}
 >
 <Trash2 className="h-3.5 w-3.5" />
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
 <span className="text-xs font-bold text-zinc-400 whitespace-nowrap">clinkor.com/</span>
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
