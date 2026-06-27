"use client";

import React, { useId, useMemo } from "react";
import { User, Globe, MessageCircle, ArrowUpRight, Play, Image, Utensils, Smartphone, Percent, Wifi, Music, ShoppingBag, FileText, List, Briefcase, Zap, Calendar, FileQuestion, Mail, Heart, Clock, HelpCircle, MapPin, Store, Laptop, Volume2, ListMusic, Compass } from "lucide-react";
import { YoutubeIcon, TwitterIcon, LinkedinIcon, TiktokIcon, PinterestIcon, InstagramIcon } from "@/components/brand-icons";
import VideoPlayer from "@/components/blocks/video-player";
import BeforeAfterSlider from "@/components/blocks/before-after-slider";
import AudioPlayer from "@/components/blocks/audio-player";
import Link from "next/link";
import { parseTailwindBgToCss } from "@/lib/utils";
import { renderTemplate } from "@/lib/template-engine";

// Safelist for Tailwind background gradient classes so that they are compiled by Tailwind and available on the public profile page
const TAILWIND_BACKGROUNDS_SAFELIST = [
  // Free
  "bg-gradient-to-tr from-slate-900 via-zinc-900 to-slate-900",
  "bg-gradient-to-br from-zinc-900 to-black",
  "bg-gradient-to-tr from-zinc-950 to-stone-900",
  "bg-gradient-to-r from-zinc-900 via-zinc-955 to-zinc-900",
  "bg-gradient-to-b from-purple-950/20 via-zinc-955 to-black",
  // Starter
  "bg-gradient-to-tr from-indigo-950 via-zinc-955 to-indigo-900",
  "bg-gradient-to-br from-emerald-950 via-zinc-955 to-teal-900",
  "bg-gradient-to-r from-purple-950 via-zinc-955 to-pink-955",
  "bg-gradient-to-tr from-slate-900 via-zinc-955 to-zinc-900",
  "bg-gradient-to-b from-rose-950 via-zinc-955 to-violet-955",
  "bg-gradient-to-tr from-cyan-950 via-zinc-955 to-blue-955",
  "bg-gradient-to-r from-orange-950 via-zinc-955 to-red-955",
  "bg-gradient-to-b from-zinc-955 to-stone-900",
  "bg-gradient-to-tr from-violet-955 to-zinc-955",
  "bg-gradient-to-br from-blue-955 via-slate-955 to-black",
  // Creator
  "bg-gradient-to-tr from-pink-600 via-rose-500 to-yellow-500",
  "bg-gradient-to-br from-green-400 via-emerald-500 to-cyan-500",
  "bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600",
  "bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-fuchsia-500 via-purple-600 to-zinc-955",
  "bg-gradient-to-tr from-red-500 via-orange-500 to-yellow-400",
  "bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-teal-400 via-emerald-600 to-zinc-955",
  "bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-500",
  "bg-gradient-to-tr from-orange-400 via-pink-500 to-purple-600",
  "bg-[conic-gradient(at_top,_var(--tw-gradient-stops))] from-purple-600 via-indigo-600 to-black",
  "bg-gradient-to-r from-yellow-500 via-amber-500 to-orange-600",
];

export interface UniversalProfileData {
 username: string;
 displayName?: string | null;
 bio?: string | null;
 avatarUrl?: string | null;
 theme?: string;
 customCss?: string | null;
 background?: string | null;
 fontStyle?: string;
 bioColor?: string | null;
 usernameColor?: string | null;
 plan?: string | null;
 storeTitle?: string | null;
 storeCoverUrl?: string | null;
 storeLayout?: string | null;
 buttonClass?: string | null;
  avatarShape?: string | null;
 links: any[];
 products?: any[];
 addons?: any[];
  systemSettings?: {
    adScript?: string | null;
    customImageUrl?: string | null;
    customTargetUrl?: string | null;
    isActive: boolean;
  } | null;
  purchasedTemplates?: any[];
  purchasedModules?: any[];
  isActiveTemplatePremium?: boolean;
  hasActivePremiumModule?: boolean;
  isCoded?: boolean;
  customHtml?: string | null;
  masterLayoutHtml?: string | null;
  avatarHtml?: string | null;
  headerHtml?: string | null;
  socialHtml?: string | null;
  linksHtml?: string | null;
  backgroundHtml?: string | null;
  containerClasses?: string | null;
  jsonConfig?: string | null;
  isPremiumTemplateActive?: boolean;
  templateSettings?: Record<string, any> | null;
  socialLinks?: any;
  socials?: any[];
  templateId?: string | null;
}

interface UniversalProfileProps {
 data: UniversalProfileData;
 isCompactMode?: boolean; // If true, disable interactive popups/modals
 isDarkContext?: boolean; // For default fallback logic
 lang?: "tr" | "en";
 isDashboardPreview?: boolean;
 forcePremiumRender?: boolean;
 showBadge?: boolean;
}

const getAvatarShapeClass = (shape: string | undefined | null) => {
  switch (shape) {
    case "squircle":
      return "rounded-2xl";
    case "square":
      return "rounded-none";
    case "leaf":
      return "rounded-tl-3xl rounded-br-3xl";
    case "arch":
      return "rounded-t-full rounded-b-xl";
    case "circle":
    default:
      return "rounded-full";
  }
};

const scopeCssWithClass = (css: string, className: string): string => {
  let scoped = css || "";
  if (!scoped) return "";

  // 1. Clean comments first to prevent parsing issues
  let cleanCss = scoped.replace(/\/\*[\s\S]*?\*\//g, "");

  // 2. Match blocks of CSS: selector { rules }
  let result = cleanCss.replace(/([^{}]+)\s*({[^{}]*})/g, (match, selectorStr, ruleStr) => {
    const trimmedSelector = selectorStr.trim();
    
    if (trimmedSelector.startsWith("@")) {
      return match;
    }

    const scopedSelectors = selectorStr.split(",").map((selector: string) => {
      let sel = selector.trim();
      if (!sel) return "";

      const trimmedSel = sel.toLowerCase();
      if (trimmedSel === "from" || trimmedSel === "to" || /^\d+%\s*$/.test(trimmedSel)) {
        return sel;
      }

      if (trimmedSel === "body" || trimmedSel === "html" || trimmedSel === ":root" || trimmedSel === "[data-template-root]") {
        return `.${className}`;
      }

      if (trimmedSel === "*") {
        return `.${className} *`;
      }

      if (sel.startsWith("body ") || sel.startsWith("html ") || sel.startsWith(":root ") || sel.startsWith("[data-template-root] ")) {
        return sel.replace(/^(body|html|:root|\[data-template-root\])\s+/, `.${className} `);
      }

      return `.${className} ${sel}`;
    });

    return scopedSelectors.filter(Boolean).join(", ") + " " + ruleStr;
  });

  return result;
};

export default function UniversalProfile({ data, isCompactMode = false, isDarkContext = true, lang = "tr", isDashboardPreview = false, forcePremiumRender = false, showBadge = false }: UniversalProfileProps) {
 // Generate a unique ID to safely scope CSS per instance
 const rawId = useId();
 const wrapperId = `univ-profile-${rawId.replace(/:/g, "")}`;

  const {
  username, displayName, bio, avatarUrl, theme = "dark", customCss, background, fontStyle = "Inter",
  bioColor, usernameColor, plan, links = [], products = [], addons = [], buttonClass, avatarShape = "circle",
  socialLinks, socials,
  purchasedTemplates = [], purchasedModules = [],
  isActiveTemplatePremium = false,
  hasActivePremiumModule = false,
  isCoded = false,
  customHtml = null,
  masterLayoutHtml = null,
  avatarHtml = null,
  headerHtml = null,
  socialHtml = null,
  linksHtml = null,
  backgroundHtml = null,
  containerClasses = null,
  jsonConfig = null,
  isPremiumTemplateActive = false,
  templateSettings = null,
  templateId = null
  } = data || {} as any;

  const isDark = isDarkContext;
  const isWhiteLabelUser = plan === "PREMIUM" || (templateId && purchasedTemplates.includes(templateId));
  const shouldShowBranding = !isWhiteLabelUser && !isDashboardPreview && !isCompactMode;
  const prefixId = isDashboardPreview ? "clinkor-phone-preview" : wrapperId;

 // Fallback styling for backward compatibility when customCss is empty or "Start from Scratch"
 const getFallbackStyles = (themeId: string) => {
 switch (themeId) {
 case "neon-purple":
 return {
 bg: isDark ? "bg-gradient-to-b from-purple-950 via-zinc-950 to-black text-purple-200" : "bg-gradient-to-b from-purple-50 via-zinc-100 to-white text-purple-950",
 cardBg: isDark ? "bg-purple-950/10 border-purple-500/20 shadow-[0_0_30px_rgba(168,85,247,0.1)]" : "bg-white/80 border-purple-200 shadow-md text-zinc-800",
 glowText: isDark ? "text-purple-400 font-bold tracking-wide drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]" : "text-purple-700 font-bold tracking-wide",
 avatarBg: "from-purple-500 to-pink-500",
 btnClass: isDark ? "bg-purple-950/20 border border-purple-500/30 text-purple-200" : "bg-purple-50 border border-purple-200 text-purple-700"
 };
 case "glow-green":
 return {
 bg: isDark ? "bg-gradient-to-b from-emerald-950/40 via-zinc-950 to-black text-emerald-200" : "bg-gradient-to-b from-emerald-50 via-zinc-100 to-white text-emerald-950",
 cardBg: isDark ? "bg-emerald-950/10 border-emerald-500/20 shadow-[0_0_30px_rgba(16,185,129,0.1)]" : "bg-white/80 border-emerald-200 shadow-md text-zinc-800",
 glowText: isDark ? "text-emerald-400 font-bold tracking-wide drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]" : "text-emerald-700 font-bold tracking-wide",
 avatarBg: "from-emerald-500 to-teal-500",
 btnClass: isDark ? "bg-emerald-950/20 border border-emerald-500/30 text-emerald-300" : "bg-emerald-50 border border-emerald-200 text-emerald-700"
 };
 case "brutalism":
 return {
 bg: "bg-[#facc15] text-black",
 cardBg: "bg-white border-4 border-black rounded-none shadow-brutal text-black",
 glowText: "text-black font-bold uppercase",
 avatarBg: "from-zinc-900 to-black",
 btnClass: "bg-[#ff007f] border-4 border-black rounded-none shadow-brutal-sm text-black font-bold"
 };
 case "terminal":
 return {
 bg: "bg-black text-[#22c55e] font-mono",
 cardBg: "bg-black border-2 border-[#22c55e] rounded-none text-[#22c55e]",
 glowText: "text-[#22c55e] font-mono font-bold uppercase",
 avatarBg: "from-zinc-950 to-zinc-900 border-[#22c55e]",
 btnClass: "bg-black border-2 border-[#22c55e] rounded-none text-[#22c55e] font-mono"
 };
 default:
 // If it's a coded template, we force the baseline to dark/transparent to avoid a glaring white box in light mode.
 const effectiveDark = (customCss || theme !== "light") ? true : isDark;
 return {
 bg: effectiveDark ? "bg-black text-zinc-200" : "bg-zinc-50 text-zinc-800",
 cardBg: effectiveDark ? "bg-zinc-900/40 border-zinc-800" : "bg-white/60 border-white/20 backdrop-blur-md shadow-md",
 glowText: effectiveDark ? "text-white" : "text-zinc-900 font-bold",
 avatarBg: "from-zinc-400 to-zinc-500",
 btnClass: effectiveDark ? "bg-zinc-900/50 border border-zinc-800 text-zinc-200" : "bg-white/70 border border-white/20 backdrop-blur-md text-zinc-700 hover:bg-white/80"
 };
 }
 };

 const currentStyles = getFallbackStyles(theme);

 // Background resolution
 const isCustomImg = background?.startsWith("custom-img::") || background?.startsWith("http://") || background?.startsWith("https://") || background?.startsWith("/");
 const isCustomVideo = background?.startsWith("custom-video::");
 const customImgUrl = isCustomImg ? (background!.startsWith("custom-img::") ? background!.replace("custom-img::", "") : background) : null;
 const customVideoUrl = isCustomVideo ? background!.replace("custom-video::", "") : null;
 const isTailwindBg = background?.includes("bg-") || background?.includes("from-") || background?.includes("to-");
 const parsedTailwindBg = isTailwindBg ? parseTailwindBgToCss(background || "") : null;
 const isCssBg = background && !isCustomImg && !isCustomVideo && !isTailwindBg;

 const bgClassName = (background && isTailwindBg && !isCustomImg && !isCustomVideo && !parsedTailwindBg) 
 ? background 
 : (!background && !isCustomImg && !isCustomVideo ? currentStyles.bg : "");

  // Dinamik sablon HTML'ini merkezi motor uzerinden isle
  const renderedCodedTemplate = useMemo(() => {
    if (!isCoded || (!customHtml && !masterLayoutHtml)) return null;

    const templateParts = {
      customHtml,
      masterLayoutHtml,
      avatarHtml,
      headerHtml,
      socialHtml,
      linksHtml,
      backgroundHtml,
      customCss
    };

    return renderTemplate(
      templateParts,
      { username, displayName: displayName || username, bio, avatarUrl, plan },
      links || [],
      jsonConfig,
      socials || socialLinks || null,
      templateSettings || null
    );
  }, [isPremiumTemplateActive, forcePremiumRender, isCoded, customHtml, masterLayoutHtml, avatarHtml, headerHtml, socialHtml, linksHtml, backgroundHtml, customCss, jsonConfig, username, displayName, bio, avatarUrl, links, socialLinks, socials, templateSettings, plan]);

  const isCodedRender = !!((isPremiumTemplateActive || forcePremiumRender) && (customHtml || masterLayoutHtml));

  const resolvedCssBg = useMemo(() => {
    if (customImgUrl) return null;
    if (isCodedRender) {
      const codedBg = (() => {
        switch (theme) {
          case "TTT": return templateSettings?.bgColor || "#ffde4d";
          case "EEE": return templateSettings?.baseColor || "#0f1014";
          case "RRR": return templateSettings?.bgColor || "#030712";
          case "WWW": return `linear-gradient(180deg, ${templateSettings?.bgColor || '#12141c'} 0%, ${templateSettings?.bgColor2 || '#0b0c0e'} 100%)`;
          case "YYY": return templateSettings?.bgColor || "#ffffff";
          case "UUU": return templateSettings?.bgColor || "#23262b";
          default: return null;
        }
      })();
      if (codedBg) return codedBg;
    }
    if (isCssBg && background) return background;
    if (parsedTailwindBg) return parsedTailwindBg;
    if (bgClassName) {
      return parseTailwindBgToCss(bgClassName);
    }
    return null;
  }, [isCodedRender, theme, templateSettings, customImgUrl, isCssBg, background, parsedTailwindBg, bgClassName]);

  const globalStyleInjection = useMemo(() => {
    if (isCompactMode || isDashboardPreview) return null;

    let bgRule = '';
    if (customImgUrl) {
      bgRule = `background-image: url(${customImgUrl}) !important; background-size: cover !important; background-position: center !important; background-repeat: no-repeat !important; background-attachment: fixed !important;`;
    } else if (isCodedRender && theme === "TTT") {
      const baseColor = templateSettings?.bgColor || "#ffde4d";
      const dotColor = baseColor === "#ffde4d" ? "#f4ce14" : "rgba(0,0,0,0.06)";
      bgRule = `background-color: ${baseColor} !important; background-image: radial-gradient(${dotColor} 20%, transparent 20%) !important; background-size: 16px 16px !important;`;
    } else if (resolvedCssBg) {
      bgRule = `background: ${resolvedCssBg} !important; background-color: ${resolvedCssBg} !important;`;
    }

    const overflowRule = isCodedRender
      ? `
        height: 100% !important;
        min-height: 100vh !important;
        min-height: 100dvh !important;
        margin: 0 !important;
        padding: 0 !important;
        overflow: hidden !important;
        background-color: transparent !important;
      `
      : '';

    if (!bgRule && !overflowRule) return null;

    return (
      <style dangerouslySetInnerHTML={{ __html: `
        html, body {
          ${bgRule}
          ${overflowRule}
        }
      `}} />
    );
  }, [isCompactMode, isDashboardPreview, customImgUrl, isCodedRender, theme, templateSettings, resolvedCssBg]);

  // Render V8 Template Engine if isPremiumTemplateActive is TRUE or forcePremiumRender is TRUE
  if ((isPremiumTemplateActive || forcePremiumRender) && (customHtml || masterLayoutHtml)) {
    // Son katman: KESIN COZUM PARSER'I
    let finalParsedHtml = renderedCodedTemplate?.html || "";

    // Social Loop Parser
    finalParsedHtml = finalParsedHtml.replace(/\[SOCIAL_LOOP\]([\s\S]*?)\[\/SOCIAL_LOOP\]/g, (match, inner) => {
      let socialsToUse = socials || socialLinks;
      if (!socialsToUse && templateSettings?.socialLinks) {
        socialsToUse = templateSettings.socialLinks;
      }
      
      let entries: { socialPlatform: string; socialUrl: string }[] = [];
      if (Array.isArray(socialsToUse)) {
        entries = socialsToUse
          .filter((s: any) => s && (s.socialPlatform || s.platform) && (s.socialUrl || s.url) && String(s.socialUrl || s.url).trim() !== "")
          .map((s: any) => ({ socialPlatform: s.socialPlatform || s.platform, socialUrl: s.socialUrl || s.url }));
      } else if (socialsToUse && typeof socialsToUse === 'object') {
        entries = Object.entries(socialsToUse)
          .filter(([platform, url]) => url && String(url).trim() !== "")
          .map(([platform, url]) => ({ socialPlatform: platform, socialUrl: url as string }));
      }

      if (!entries || entries.length === 0) return '';
      return entries.map(s => 
        inner.replace(/{{socialPlatform}}/g, s.socialPlatform || '')
             .replace(/{{socialUrl}}/g, s.socialUrl || '')
      ).join('');
    });

    // Inject Media Banner if configured
    let mediaBannerHtml = "";
    const mType = templateSettings?.mediaBannerType;
    const mImg = templateSettings?.mediaBannerImage;
    const mVideo = templateSettings?.mediaBannerVideo;

    if (mType === "image" && mImg) {
      mediaBannerHtml = `
        <div class="clinkor-media-banner w-full mb-4 rounded-2xl overflow-hidden shadow-sm" style="max-width: 100%; width: 100%; display: block; border-radius: 16px;">
          <img src="${mImg}" class="w-full h-auto object-cover rounded-2xl" style="width: 100%; height: auto; display: block; border-radius: 16px;" alt="Media Banner" />
        </div>
      `;
    } else if (mType === "video" && mVideo) {
      const regExpYt = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
      const matchYt = mVideo.match(regExpYt);
      const regExpVm = /vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/(?:[^\/]*)\/videos\/|album\/(?:\d+)\/video\/|video\/|)(\d+)(?:$|\/|\?)/;
      const matchVm = mVideo.match(regExpVm);

      if (matchYt && matchYt[2].length === 11) {
        mediaBannerHtml = `
          <div class="clinkor-media-banner w-full mb-4 rounded-2xl overflow-hidden aspect-video bg-black shadow-sm" style="max-width: 100%; width: 100%; display: block; aspect-ratio: 16/9; position: relative; border-radius: 16px;">
            <iframe src="https://www.youtube.com/embed/${matchYt[2]}" class="w-full h-full border-none rounded-2xl" style="position: absolute; top:0; left:0; width:100%; height:100%; border-radius: 16px;" allowfullscreen></iframe>
          </div>
        `;
      } else if (matchVm && matchVm[1]) {
        mediaBannerHtml = `
          <div class="clinkor-media-banner w-full mb-4 rounded-2xl overflow-hidden aspect-video bg-black shadow-sm" style="max-width: 100%; width: 100%; display: block; aspect-ratio: 16/9; position: relative; border-radius: 16px;">
            <iframe src="https://player.vimeo.com/video/${matchVm[1]}" class="w-full h-full border-none rounded-2xl" style="position: absolute; top:0; left:0; width:100%; height:100%; border-radius: 16px;" allowfullscreen></iframe>
          </div>
        `;
      } else {
        mediaBannerHtml = `
          <div class="clinkor-media-banner w-full mb-4 rounded-2xl overflow-hidden shadow-sm" style="max-width: 100%; width: 100%; display: block; border-radius: 16px;">
            <video src="${mVideo}" controls class="w-full h-auto object-contain rounded-2xl" style="width: 100%; height: auto; display: block; border-radius: 16px;"></video>
          </div>
        `;
      }
    }

    if (mediaBannerHtml) {
      const mPos = templateSettings?.mediaBannerPosition || "top";
      const isBottom = mPos === "bottom";
      const isTop = mPos === "top";

      if (isTop || isBottom) {
        if (finalParsedHtml.includes("[LINK_LOOP]")) {
          if (isBottom && finalParsedHtml.includes("[/LINK_LOOP]")) {
            finalParsedHtml = finalParsedHtml.replace("[/LINK_LOOP]", "[/LINK_LOOP]" + mediaBannerHtml);
          } else {
            finalParsedHtml = finalParsedHtml.replace("[LINK_LOOP]", mediaBannerHtml + "[LINK_LOOP]");
          }
        } else if (finalParsedHtml.includes("[LINKS_SECTION]")) {
          if (isBottom) {
            finalParsedHtml = finalParsedHtml.replace("[LINKS_SECTION]", "[LINKS_SECTION]" + mediaBannerHtml);
          } else {
            finalParsedHtml = finalParsedHtml.replace("[LINKS_SECTION]", mediaBannerHtml + "[LINKS_SECTION]");
          }
        } else {
          if (isBottom) {
            finalParsedHtml = finalParsedHtml + mediaBannerHtml;
          } else {
            finalParsedHtml = mediaBannerHtml + finalParsedHtml;
          }
        }
      }
    }

    // Link Loop Parser
    finalParsedHtml = finalParsedHtml.replace(/\[LINK_LOOP\]([\s\S]*?)\[\/LINK_LOOP\]/g, (match, inner) => {
      if (!links || links.length === 0) return '';
      const mPos = templateSettings?.mediaBannerPosition;
      const parsedPos = parseInt(mPos || "");
      const hasBetweenBanner = mType && mType !== "none" && !isNaN(parsedPos);

      return links.map((l: any, idx: number) => {
        let linkHtml = inner
             .replace(/{{linkTitle}}/g, l.title || '')
             .replace(/{{linkUrl}}/g, l.url || '');
             
        if (hasBetweenBanner && (idx + 1) === parsedPos && mediaBannerHtml) {
          linkHtml = linkHtml + "\n" + mediaBannerHtml;
        }
        return linkHtml;
      }).join('');
    });

    // Standart verileri de ekle
    const hasBadge = showBadge || (plan && plan !== "FREE");
    const proBadgeSvg = `<span class="clinkor-pro-badge"><svg class="clinkor-pro-svg" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="12" fill="#1D9BF0"/><path d="M9.5 12.5L11 14L15 10" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></span>`;
    const nameText = displayName || username || '';
    const finalDisplayNameText = hasBadge ? `${nameText}${proBadgeSvg}` : nameText;

    finalParsedHtml = finalParsedHtml.replace(/{{displayName}}/g, finalDisplayNameText)
                           .replace(/{{bio}}/g, bio || '')
                           .replace(/{{avatarUrl}}/g, avatarUrl || '');

    // Statik reklam alanlarını temizle
    let cleanedHtml = finalParsedHtml;
    cleanedHtml = cleanedHtml.replace(/<(div|footer)\s+class="[^"]*(branding|footer)[^"]*">\s*<a\s+href="[^"]*(register|sign-in)[^"]*"[^>]*>[\s\S]*?<\/a>\s*<\/\1>/gi, "");
    cleanedHtml = cleanedHtml.replace(/<a\s+href="[^"]*(register|sign-in)[^"]*"[^>]*>[\s\S]*?<\/a>/gi, "");

    // Dinamik branding enjeksiyonu (Eğer white-label değilse)
    if (!isWhiteLabelUser) {
      const dynamicBrandingHtml = `
        <a href="https://www.clinkor.com/sign-in" target="_blank" rel="noopener noreferrer" class="clinkor-global-branding" style="position: absolute !important; bottom: 24px !important; left: 50% !important; transform: translateX(-50%) !important; z-index: 9999 !important; background: rgba(255, 255, 255, 0.95) !important; color: #000 !important; padding: 8px 24px !important; border-radius: 50px !important; font-size: 11px !important; font-weight: 700 !important; text-decoration: none !important; box-shadow: 0 4px 20px rgba(0,0,0,0.15) !important; white-space: nowrap !important; font-family: sans-serif !important; display: inline-block !important; visibility: visible !important; opacity: 1 !important; cursor: pointer !important;">
          ${lang === "tr" ? "Clinkor'da Kendi Sayfanı Oluştur" : "Create Your Own Page on Clinkor"}
        </a>
      `;
      const lastDivIndex = cleanedHtml.lastIndexOf("</div>");
      if (lastDivIndex !== -1) {
        cleanedHtml = cleanedHtml.substring(0, lastDivIndex) + dynamicBrandingHtml + cleanedHtml.substring(lastDivIndex);
      } else {
        cleanedHtml = cleanedHtml + dynamicBrandingHtml;
      }
    }

    const cleanTemplateId = templateId 
      ? String(templateId).replace(/[^a-zA-Z0-9-]/g, "") 
      : theme.replace(/[^a-zA-Z0-9-]/g, "").replace(/\s+/g, "-");
    const templateClass = `template-id-${cleanTemplateId}`;
    const scopedHtml = `<div class="clinkor-template-isolated ${templateClass}">${cleanedHtml}</div>`;
    const scopedCodedCss = renderedCodedTemplate?.css 
      ? scopeCssWithClass(renderedCodedTemplate.css, templateClass) 
      : "";

    if (isDashboardPreview || isCompactMode) {
      const iframeSrcDoc = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" crossorigin="anonymous" referrerpolicy="no-referrer" />
          <style>
            html, body {
              height: 100% !important;
              min-height: 100vh !important;
              min-height: 100dvh !important;
              margin: 0 !important;
              padding: 0 !important;
              overflow: hidden !important;
              background-color: transparent !important;
              font-family: '${fontStyle}', sans-serif;
            }
            * { box-sizing: border-box; }
            
            .renderer-wrapper { 
                position: absolute !important; 
                inset: 0 !important; 
                width: 100% !important; 
                height: 100% !important; 
                overflow: hidden !important; 
                border-radius: inherit !important; 
                display: flex !important; 
                flex-direction: column !important; 
            }
            .renderer-scroll-area { 
                flex: 1 !important; 
                overflow-y: auto !important; 
                overflow-x: hidden !important; 
                scrollbar-width: none !important; 
            }
            .renderer-scroll-area::-webkit-scrollbar { display: none !important; }
            .renderer-scroll-area { padding-bottom: 60px !important; }
            .injected-background {
                position: fixed !important; 
                z-index: -1 !important; 
                width: 100vw !important; 
                height: 100dvh !important; 
                ${theme === "TTT" && isCodedRender
                  ? `background-color: ${resolvedCssBg || "#ffde4d"} !important; background-image: radial-gradient(${resolvedCssBg === "#ffde4d" ? "#f4ce14" : "rgba(0,0,0,0.06)"} 20%, transparent 20%) !important; background-size: 16px 16px !important;`
                  : `background: ${resolvedCssBg || "#09090b"} !important;`
                }
                background-size: cover !important; 
                background-position: center !important;
                top: 0 !important;
                left: 0 !important;
            }
            .clinkor-template-isolated { width: 100% !important; min-height: 100% !important; display: flex !important; flex-direction: column !important; position: relative !important; }
            ${scopedCodedCss}
            .renderer-scroll-area { background: transparent !important; }
          </style>
        </head>
        <body>
          <div class="renderer-wrapper">
              <div class="injected-background"></div>
              <div class="renderer-scroll-area">
                  ${scopedHtml}
              </div>
          </div>
        </body>
        </html>
      `;

      return (
        <iframe
          id={prefixId}
          srcDoc={iframeSrcDoc}
          style={{ 
            width: "100%", 
            height: "100%", 
            border: "none", 
            display: "block",
            ...(!isCompactMode ? { minHeight: "100vh" } : {})
          }}
          sandbox="allow-scripts allow-same-origin allow-popups"
        />
      );
    }

    return (
      <div className={`w-full flex justify-center relative overflow-hidden ${isCompactMode ? "h-full" : "min-h-screen"} ${bgClassName}`} style={{
        ...(isCssBg && !isTailwindBg ? { background: background } : {}),
        ...(parsedTailwindBg ? { background: parsedTailwindBg } : {}),
        ...(customImgUrl ? { backgroundImage: `url(${customImgUrl})`, backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat", ...(!isCompactMode ? { backgroundAttachment: "fixed" } : {}) } : {})
      }}>
        {globalStyleInjection}
        {theme === "terminal" && <div className="crt-scanlines absolute inset-0 pointer-events-none" />}
        {customVideoUrl && (
          <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover pointer-events-none z-0" src={customVideoUrl} />
        )}
        <style dangerouslySetInnerHTML={{ __html: `
            #${prefixId} .renderer-wrapper { 
                position: absolute !important; 
                inset: 0 !important; 
                width: 100% !important; 
                height: 100% !important; 
                overflow: hidden !important; 
                border-radius: inherit !important; 
                display: flex !important; 
                flex-direction: column !important; 
            }
            #${prefixId} .renderer-scroll-area { 
                flex: 1 !important; 
                overflow-y: auto !important; 
                overflow-x: hidden !important; 
                scrollbar-width: none !important; 
            }
            #${prefixId} .renderer-scroll-area::-webkit-scrollbar { display: none !important; }
            #${prefixId} .renderer-scroll-area { padding-bottom: 60px !important; }
            #${prefixId} .injected-background {
                position: ${isCompactMode ? "absolute" : "fixed"} !important; 
                z-index: -1 !important; 
                width: ${isCompactMode ? "100%" : "100vw"} !important; 
                height: ${isCompactMode ? "100%" : "100dvh"} !important; 
                background-size: cover !important; 
                background-position: center !important;
                top: 0 !important;
                left: 0 !important;
            }
            .clinkor-template-isolated { width: 100% !important; min-height: 100% !important; display: flex !important; flex-direction: column !important; position: relative !important; }
            ${scopedCodedCss}
            #${prefixId} .renderer-scroll-area { background: transparent !important; }
        `}} />
        <div 
          id={prefixId}
          data-template-root="true"
          className={`w-full ${isCompactMode ? "max-w-[420px] shadow-[0_0_50px_rgba(0,0,0,0.8)]" : ""} min-h-screen relative overflow-hidden`}
          style={{ fontFamily: fontStyle, position: 'relative' }}
        >
          <div className="renderer-wrapper">
              <div 
                className={`injected-background ${bgClassName}`}
                style={{
                  ...(isCssBg ? { background: background } : {}),
                  ...(parsedTailwindBg ? { background: parsedTailwindBg } : {}),
                  ...(customImgUrl ? { backgroundImage: `url(${customImgUrl})`, backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat" } : {})
                }}
              ></div>
              <div
                className="renderer-scroll-area"
                dangerouslySetInnerHTML={{ __html: scopedHtml }}
              />
          </div>
        </div>
      </div>
    );
  }

  // Auto-Scope CSS to prevent bleeding into /sablonlar or dashboard
  let scopedCss = customCss || "";
  if (scopedCss) {
  // 1. Replace body with prefixId
  scopedCss = scopedCss.replace(/body/gi, `#${prefixId}`);
  
  // 2. Prevent fixed positioning which escapes the mockup frame
  scopedCss = scopedCss.replace(/position\s*:\s*fixed/gi, 'position: absolute');
  
  // 3. Prevent viewport units from breaking the mockup width/height
  if (isCompactMode) {
  scopedCss = scopedCss.replace(/100vw/gi, '100%').replace(/100vh/gi, '100%');
  scopedCss = scopedCss.replace(/height\s*:\s*100vh/gi, 'min-height: 100%');
  }

  // 4. Force scope for all known generic tags and classes to prevent global CSS leaks
  const tagsToScope = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'a', 'span', '\\*', 'div', 'img', 'svg'];
  const classesToScope = ['profile-card', 'profile-name', 'profile-avatar', 'profile-title', 'profile-bio', 'social-icon', 'btn-link', 'link-item', 'ambient-glow'];
  
  const allSelectors = [...tagsToScope, ...classesToScope.map(c => `\\.${c}`)];
  
  allSelectors.forEach(selector => {
  // Regex explanation: Match start of string, }, or , followed by spaces, then the selector
  const regex = new RegExp(`(^|\\}|,)\\s*(${selector})(?=[\\s{,:]|$)`, 'gi');
  scopedCss = scopedCss.replace(regex, (match, prefix, sel) => {
  return `${prefix} #${prefixId} ${sel}`;
  });
  });

  // Quick fix for the Obsidian Luxe global transition bug:
  scopedCss = scopedCss.replace(/^\s*\*\s*\{/gm, `#${prefixId} * {`);
  }

  // Disable custom scrollbars in compact mode to prevent "gri buçuklar"
  scopedCss = scopedCss.replace(/::-webkit-scrollbar/g, '.disabled-scrollbar-in-mockup');
  
  // BRUTE FORCE HIDE SCROLLBARS (Track, Thumb, Corner) and apply master wrapper constraints
  scopedCss += `
  #${prefixId}::-webkit-scrollbar, 
  #${prefixId} *::-webkit-scrollbar { 
    display: none !important; 
    width: 0 !important; 
    height: 0 !important; 
  }
  #${prefixId}::-webkit-scrollbar-track,
  #${prefixId} *::-webkit-scrollbar-track,
  #${prefixId}::-webkit-scrollbar-thumb,
  #${prefixId} *::-webkit-scrollbar-thumb {
    display: none !important;
    background: transparent !important;
  }
  #${prefixId} { 
    -ms-overflow-style: none !important; 
    scrollbar-width: none !important; 
  }

  /* Master Wrapper Constraints */
  #${prefixId} {
    width: 100% !important;
    min-height: 100% !important;
    border-radius: inherit !important;
    position: relative !important;
    overflow-x: hidden;
    overflow-y: auto;
    padding-bottom: ${isCompactMode ? '0' : '60px'} !important;
  }
  
  #${prefixId} .clinkor-branding-footer {
     position: absolute !important;
     bottom: 24px !important;
     left: 50% !important;
     transform: translateX(-50%) !important;
     z-index: 9999 !important;
     background: rgba(255, 255, 255, 0.95) !important;
     color: #000 !important;
     padding: 8px 24px !important;
     border-radius: 50px !important;
     box-shadow: 0 4px 20px rgba(0,0,0,0.15) !important;
     white-space: nowrap !important;
     font-size: 11px !important;
     font-weight: 700 !important;
     text-decoration: none !important;
     border: 1px solid rgba(0,0,0,0.05) !important;
     font-family: sans-serif !important;
  }
  #${prefixId} .branding-link { text-decoration: none !important; color: #000 !important; }
  
  /* Auto-enforce absolute positioning for background layers */
  #${prefixId} > .bg-layer,
  #${prefixId} > .background-layer,
  #${prefixId} > .template-bg {
    position: absolute !important;
    top: 0 !important;
    left: 0 !important;
    width: 100% !important;
    height: 100% !important;
    background-size: cover !important;
    background-position: center !important;
    background-repeat: no-repeat !important;
    z-index: 0 !important;
    pointer-events: none !important;
  }
  
  /* Ensure content stays above the auto-background */
  #${prefixId} > *:not(.bg-layer):not(.background-layer):not(.template-bg) {
    position: relative;
    z-index: 10;
  }
  `;

  if (isCompactMode) {
    // Force h1 font-size to be normal in mockup and prevent gigantic text
    scopedCss += `\n#${prefixId} h1, #${prefixId} .profile-card h1, #${prefixId} .profile-name { font-size: 1.25rem !important; line-height: 1.2 !important; word-break: break-word !important; }`;
  }

 const getLinkIcon = (type?: string, url?: string) => {
 switch (type) {
 case "WEBSITE": return <Globe className="h-5 w-5" />;
 case "FACEBOOK": return <Globe className="h-5 w-5" />;
 case "INSTAGRAM": return <InstagramIcon className="h-5 w-5" />;
 case "WHATSAPP": return <MessageCircle className="h-5 w-5" />;
 case "YOUTUBE": return <YoutubeIcon className="h-5 w-5" />;
 case "TWITTER":
 case "X": return <TwitterIcon className="h-5 w-5" />;
 case "LINKEDIN": return <LinkedinIcon className="h-5 w-5" />;
 case "TIKTOK": return <TiktokIcon className="h-5 w-5" />;
 case "VIDEO": return <Play className="h-5 w-5" />;
 default: return <Zap className="h-5 w-5" />;
 }
 };

    const renderSponsoredBlock = () => {
      // Reklam kısmını yalnızca kullanıcı panelindeki telefon önizlemelerinde göster
      if (!isDashboardPreview) {
        return null;
      }

      const settings = data.systemSettings;
      // Eğer reklam global olarak kapalıysa reklam alanını tamamen gizle
      if (settings && !settings.isActive) {
        return null;
      }

     const defaultLinkForStyle = links[0] || {};
     const adCustomStyle: React.CSSProperties = data.buttonClass ? {} : {
       backgroundColor: defaultLinkForStyle.bgColor || undefined,
       color: defaultLinkForStyle.textColor || undefined,
       borderColor: defaultLinkForStyle.borderColor || undefined,
       borderStyle: defaultLinkForStyle.borderStyle as any || undefined,
       borderWidth: defaultLinkForStyle.borderWidth || undefined,
       borderRadius: defaultLinkForStyle.borderRadius || undefined,
       boxShadow: defaultLinkForStyle.shadow === "glow-purple" ? "0 0 15px rgba(168,85,247,0.5)"
         : defaultLinkForStyle.shadow === "glow-emerald" ? "0 0 15px rgba(16,185,129,0.5)"
         : defaultLinkForStyle.shadow === "hard-3d" ? "4px 4px 0px 0px rgba(0,0,0,1)"
         : undefined
     };

     const adDynamicBlockClass = data.buttonClass 
       ? `link-item btn-link ${data.buttonClass} ${defaultLinkForStyle.animation || ""} ${defaultLinkForStyle.fontWeight || ""}`
       : `link-item btn-link ${!defaultLinkForStyle.bgColor ? currentStyles.btnClass : ""} ${!defaultLinkForStyle.borderRadius ? (theme === "brutalism" || theme === "terminal" ? "rounded-none" : "rounded-2xl") : ""} ${defaultLinkForStyle.animation || ""} ${defaultLinkForStyle.fontWeight || "font-bold"}`;

     const handleUpgradeRedirect = (e: React.MouseEvent) => {
       e.stopPropagation();
       e.preventDefault();
       if (isCompactMode) {
         alert(lang === "tr" ? "Bu özellik planınızı yükseltmenizi gerektirir." : "This feature requires upgrading your plan.");
       } else {
         window.location.href = "/dashboard/billing";
       }
     };

     // 1. Google AdSense / Script Entegrasyonu
     if (settings?.adScript) {
       return (
         <div 
           className="w-full flex justify-center overflow-hidden" 
           dangerouslySetInnerHTML={{ __html: settings.adScript }} 
         />
       );
     }

     // 2. Özel Banner Reklamı
     if (settings?.customImageUrl) {
       return (
         <a 
           href={isCompactMode ? "#" : (settings.customTargetUrl || "/dashboard/billing")} 
           target={isCompactMode ? "_self" : "_blank"} 
           rel="noopener noreferrer" 
           style={adCustomStyle} 
           className={`flex flex-col p-0 overflow-hidden relative group ${adDynamicBlockClass}`}
         >
           <div className="absolute top-2.5 right-3 flex items-center gap-1 z-20 bg-black/40 backdrop-blur-md px-1.5 py-0.5 rounded border border-white/10">
             <span 
               onClick={handleUpgradeRedirect}
               className="text-[8.5px] font-semibold text-zinc-350 hover:text-white cursor-pointer underline transition-colors"
             >
               {lang === "tr" ? "Reklamı Kaldır" : "Remove Ad"}
             </span>
             <span className="h-3 w-[1px] bg-zinc-500/20" />
             <span className="text-[7.5px] font-bold tracking-wider uppercase text-zinc-300">
               Ad
             </span>
           </div>
           <img 
             src={settings.customImageUrl} 
             alt="Sponsored Ad" 
             className="w-full h-auto object-cover max-h-32 transition-transform duration-300 group-hover:scale-105" 
           />
         </a>
       );
     }

     // 3. Yedek Plan: Varsayılan Native Reklam
     return (
       <div 
         style={adCustomStyle} 
         className={`flex flex-col p-4 text-xs transition-all relative overflow-hidden group ${adDynamicBlockClass}`}
       >
         <div className="absolute top-2.5 right-3 flex items-center gap-1 z-20">
           <span 
             onClick={handleUpgradeRedirect}
             className="text-[8.5px] font-semibold text-zinc-400 hover:text-zinc-350 cursor-pointer underline transition-colors"
           >
             {lang === "tr" ? "Reklamı Kaldır" : "Remove Ad"}
           </span>
           <span className="h-3 w-[1px] bg-zinc-500/20" />
           <span className="text-[7.5px] font-bold tracking-wider uppercase bg-zinc-400/10 text-zinc-400 px-1 py-0.2 rounded border border-zinc-500/10">
             Ad
           </span>
         </div>

         <div className="flex items-start gap-3 mt-1 text-left w-full pr-16">
           <div className="h-9 w-9 rounded-full bg-teal-500/10 text-teal-400 flex items-center justify-center shrink-0 border border-teal-500/20">
             <Zap className="h-4.5 w-4.5 animate-pulse text-teal-500" />
           </div>
           <div className="space-y-0.5">
             <h4 className="font-extrabold text-xs tracking-tight" style={{ color: defaultLinkForStyle.textColor || 'inherit' }}>
               {lang === "tr" ? "Kendi Biyo Link Sayfanı Ücretsiz Oluştur!" : "Build Your Free Link Bio Page!"}
             </h4>
             <p className="text-[10px] leading-snug opacity-75" style={{ color: defaultLinkForStyle.textColor || 'inherit' }}>
               {lang === "tr" 
                 ? "Saniyeler içinde sosyal medya hesaplarını tek bir yerde topla ve analiz et." 
                 : "Unify all your social links and view page traffic metrics in seconds."}
             </p>
           </div>
         </div>
       </div>
     );
   };

  const isLayoutLeft = buttonClass?.includes("layout-left");
  const isLayoutHero = buttonClass?.includes("layout-hero");

 return (
 <div 
   id={prefixId}
   className={`transition-all duration-500 ${bgClassName} ${isCompactMode ? 'min-h-full w-full relative flex flex-col overflow-y-auto overflow-x-hidden scrollbar-hide' : 'flex-1 min-h-screen min-h-full w-full relative flex flex-col overflow-x-hidden'}`}
   style={{
     fontFamily: fontStyle,
     position: 'relative',
     ...(isCssBg ? { background: background } : {}),
     ...(parsedTailwindBg ? { background: parsedTailwindBg } : {}),
     ...(customImgUrl ? { backgroundImage: `url(${customImgUrl})`, backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat" } : {})
   }}
 >
 {globalStyleInjection}
 {scopedCss && (
 <style dangerouslySetInnerHTML={{ __html: scopedCss }} />
 )}

 {/* Advanced Theme Overlays */}
 {theme === "terminal" && <div className="crt-scanlines absolute inset-0 pointer-events-none" />}
 {customVideoUrl && (
 <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover pointer-events-none z-0" src={customVideoUrl} />
 )}

 <main className="flex flex-col items-center justify-start w-full px-4 py-8 gap-4 max-w-md mx-auto relative z-10 overflow-x-hidden">
 {/* Profile Card */}
 {isLayoutLeft ? (
 <div className={`profile-card p-4 w-full rounded-3xl border backdrop-blur-md flex items-center gap-4 text-left ${currentStyles.cardBg}`} style={{ position: 'relative', height: 'auto', minHeight: 'fit-content' }}>
 <div className={`w-16 h-16 ${getAvatarShapeClass(avatarShape)} bg-gradient-to-tr ${currentStyles.avatarBg} border-2 border-white/10 shadow-md flex items-center justify-center overflow-hidden shrink-0`}>
 {avatarUrl ? (
 <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
 ) : (
 <User className="h-8 w-8 text-white" />
 )}
 </div>
 <div className="space-y-0.5 flex-1 min-w-0">
 <h1 style={usernameColor ? { color: usernameColor } : undefined} className={`text-base font-black truncate leading-tight ${currentStyles.glowText}`}>
 <span className="inline-flex items-center gap-1">@{username}{showBadge && <svg className="inline-block w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="12" fill="#1D9BF0"/><path d="M9.5 12.5L11 14L15 10" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}</span>
 </h1>
 {bio && (
 <p style={bioColor ? { color: bioColor } : undefined} className={`text-xs leading-normal line-clamp-2 ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>
 {bio}
 </p>
 )}
 </div>
 </div>
 ) : isLayoutHero ? (
 <div className={`profile-card w-full rounded-[2.5rem] border overflow-hidden backdrop-blur-md flex flex-col items-center pb-5 text-center ${currentStyles.cardBg}`} style={{ position: 'relative', height: 'auto', minHeight: 'fit-content' }}>
 {/* Banner Background */}
 <div className="w-full h-24 bg-gradient-to-r from-teal-500/25 via-purple-500/25 to-pink-500/25 border-b border-white/5 relative flex items-center justify-center">
 {avatarUrl && (
 <div className="absolute inset-0 bg-cover bg-center opacity-30 blur-[2px]" style={{ backgroundImage: `url(${avatarUrl})` }} />
 )}
 </div>
 
 <div className={`w-20 h-20 ${getAvatarShapeClass(avatarShape)} bg-gradient-to-tr ${currentStyles.avatarBg} border-4 border-white/15 shadow-xl flex items-center justify-center overflow-hidden -mt-10 z-10`}>
 {avatarUrl ? (
 <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
 ) : (
 <User className="h-10 w-10 text-white" />
 )}
 </div>
 
 <div className="space-y-1 w-full px-4 mt-2">
 <h1 style={usernameColor ? { color: usernameColor } : undefined} className={`text-lg font-black tracking-tight ${currentStyles.glowText}`}>
 <span className="inline-flex items-center gap-1 justify-center">@{username}{showBadge && <svg className="inline-block w-[18px] h-[18px] shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="12" fill="#1D9BF0"/><path d="M9.5 12.5L11 14L15 10" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}</span>
 </h1>
 {bio && (
 <p style={bioColor ? { color: bioColor } : undefined} className={`text-xs leading-relaxed max-w-xs mx-auto px-2 ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>
 {bio}
 </p>
 )}
 </div>
 </div>
 ) : (
 <div className={`profile-card p-3 md:p-6 w-full rounded-[2.5rem] border text-center backdrop-blur-md flex flex-col items-center gap-4 ${currentStyles.cardBg}`} style={{ position: 'relative', height: 'auto', minHeight: 'fit-content' }}>
 <div className={`w-20 h-20 ${getAvatarShapeClass(avatarShape)} bg-gradient-to-tr ${currentStyles.avatarBg} border-4 border-white/10 shadow-lg flex items-center justify-center overflow-hidden`}>
 {avatarUrl ? (
 <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
 ) : (
 <User className="h-10 w-10 text-white" />
 )}
 </div>
 <div className="space-y-1 w-full">
 <h1 style={usernameColor ? { color: usernameColor } : undefined} className={`text-xl font-bold ${currentStyles.glowText}`}>
 <span className="inline-flex items-center gap-1 justify-center">@{username}{showBadge && <svg className="inline-block w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="12" fill="#1D9BF0"/><path d="M9.5 12.5L11 14L15 10" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}</span>
 </h1>
 {bio && (
 <p style={bioColor ? { color: bioColor } : undefined} className={`text-xs leading-relaxed max-w-xs mx-auto px-2 ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>
 {bio}
 </p>
 )}
 </div>
 </div>
 )}

 {/* Links Grid */}
  <div className="links-container w-full flex flex-col gap-3" style={{ position: 'relative', height: 'auto', minHeight: 'fit-content' }}>
    {/* Media Banner Section (if configured to top) */}
    {(() => {
      const mType = templateSettings?.mediaBannerType;
      const mImg = templateSettings?.mediaBannerImage;
      const mVideo = templateSettings?.mediaBannerVideo;
      const mPos = templateSettings?.mediaBannerPosition || "top";

      if (!mType || mType === "none" || mPos === "bottom" || !isNaN(parseInt(mPos))) return null;

      if (mType === "image" && mImg) {
        return (
          <div className="w-full mb-3 rounded-2xl overflow-hidden shadow-sm">
            <img src={mImg} className="w-full h-auto object-cover rounded-2xl" style={{ width: '100%', height: 'auto', display: 'block', borderRadius: '16px' }} alt="Media Banner" />
          </div>
        );
      }

      if (mType === "video" && mVideo) {
        return (
          <div className="w-full mb-3 rounded-2xl overflow-hidden shadow-sm">
            <VideoPlayer title={lang === "tr" ? "Tanıtım Videosu" : "Promo Video"} url={mVideo} isDark={isDark} />
          </div>
        );
      }

      return null;
    })()}

  {links.length > 0 && <h3 className={`text-[10px] uppercase tracking-widest font-bold mb-1 ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>Links</h3>}
  {links.length === 0 ? (
    <>
      <div className={`text-center py-6 text-xs rounded-2xl border border-dashed ${isDark ? "text-zinc-500 bg-zinc-950/20 border-zinc-900" : "text-zinc-600 bg-zinc-100 border-zinc-200"}`}>
      No active links found.
      </div>
      {/* Removed sponsored block inside the profile container */}
    </>
  ) : (
    (() => {
      const showAd = false; // Ads are displayed outside the phone simulator frame now
      const adIndex = Math.floor(links.length / 2);
      
      return links.map((link, idx) => {
        let blockMeta: any = {};
        if (link.metadata) try { blockMeta = JSON.parse(link.metadata); } catch(e) {}

        const customStyle: React.CSSProperties = {
          backgroundColor: link.bgColor || undefined,
          color: link.textColor || undefined,
          borderColor: link.borderColor || undefined,
          borderStyle: link.borderStyle as any || undefined,
          borderWidth: link.borderWidth || undefined,
          borderRadius: link.borderRadius || undefined,
          boxShadow: link.shadow === "glow-purple" ? "0 0 15px rgba(168,85,247,0.5)"
            : link.shadow === "glow-emerald" ? "0 0 15px rgba(16,185,129,0.5)"
            : link.shadow === "hard-3d" ? "4px 4px 0px 0px rgba(0,0,0,1)"
            : undefined
        };

        const dynamicBlockClass = data.buttonClass 
          ? `link-item btn-link ${data.buttonClass} ${link.animation || ""} ${link.fontWeight || ""}`
          : `link-item btn-link ${!link.bgColor ? currentStyles.btnClass : ""} ${!link.borderRadius ? (theme === "brutalism" || theme === "terminal" ? "rounded-none" : "rounded-2xl") : ""} ${link.animation || ""} ${link.fontWeight || "font-bold"}`;

        let blockElement = null;

        if (link.blockType === "VIDEO_PLAYER") {
          blockElement = <VideoPlayer key={link.id} title={link.title} url={link.url} isDark={isDark} boxStyle={customStyle} className={dynamicBlockClass} />;
        } else if (link.blockType === "BEFORE_AFTER") {
          blockElement = <BeforeAfterSlider key={link.id} title={link.title} beforeImage={blockMeta.beforeImage||""} afterImage={blockMeta.afterImage||""} isDark={isDark} boxStyle={customStyle} className={dynamicBlockClass} />;
        } else if (link.blockType === "AUDIO_PLAYER") {
          blockElement = <AudioPlayer key={link.id} title={link.title} url={link.url} isDark={isDark} boxStyle={customStyle} className={dynamicBlockClass} />;
        } else {
          blockElement = (
            <a key={link.id} href={isCompactMode ? "#" : `/click/${link.id}`} target={isCompactMode ? "_self" : "_blank"} rel="noopener noreferrer" style={customStyle} className={`flex flex-wrap items-center justify-between p-3 text-sm transition-all hover:scale-[1.02] ${dynamicBlockClass}`}>
              <div className="flex items-center gap-3 flex-1 overflow-hidden">
                <div className="h-8 w-8 rounded-full bg-black/10 flex items-center justify-center shrink-0 border border-white/5" style={blockMeta.iconColor ? { color: blockMeta.iconColor } : undefined}>
                  {getLinkIcon(link.type, link.url)}
                </div>
                <span className="link-title truncate flex-1 font-semibold" style={{ color: link.textColor || 'inherit', display: 'block', visibility: 'visible', opacity: 1 }}>{link.title}</span>
              </div>
              <ArrowUpRight className="h-4 w-4 opacity-50 shrink-0" style={link.textColor ? { color: link.textColor } : undefined} />
            </a>
          );
        }

        const mPos = templateSettings?.mediaBannerPosition;
        const parsedPos = parseInt(mPos || "");
        const isAfterThisLink = !isNaN(parsedPos) && (idx + 1) === parsedPos;

        const renderedBlock = (
          <React.Fragment key={link.id}>
            {blockElement}
            {isAfterThisLink && (() => {
              const mType = templateSettings?.mediaBannerType;
              const mImg = templateSettings?.mediaBannerImage;
              const mVideo = templateSettings?.mediaBannerVideo;

              if (!mType || mType === "none") return null;

              if (mType === "image" && mImg) {
                return (
                  <div className="w-full mt-3 mb-3 rounded-2xl overflow-hidden shadow-sm">
                    <img src={mImg} className="w-full h-auto object-cover rounded-2xl" style={{ width: '100%', height: 'auto', display: 'block', borderRadius: '16px' }} alt="Media Banner" />
                  </div>
                );
              }

              if (mType === "video" && mVideo) {
                return (
                  <div className="w-full mt-3 mb-3 rounded-2xl overflow-hidden shadow-sm">
                    <VideoPlayer title={lang === "tr" ? "Tanıtım Videosu" : "Promo Video"} url={mVideo} isDark={isDark} />
                  </div>
                );
              }

              return null;
            })()}
          </React.Fragment>
        );

        if (showAd && idx === adIndex) {
          return (
            <React.Fragment key={`ad-frag-${link.id}`}>
              {renderSponsoredBlock()}
              {renderedBlock}
            </React.Fragment>
          );
        }

        return renderedBlock;
      });
    })()
  )}
    {/* Media Banner Section (if configured to bottom) */}
    {(() => {
      const mType = templateSettings?.mediaBannerType;
      const mImg = templateSettings?.mediaBannerImage;
      const mVideo = templateSettings?.mediaBannerVideo;
      const mPos = templateSettings?.mediaBannerPosition || "top";

      if (!mType || mType === "none" || mPos !== "bottom") return null;

      if (mType === "image" && mImg) {
        return (
          <div className="w-full mt-3 rounded-2xl overflow-hidden shadow-sm">
            <img src={mImg} className="w-full h-auto object-cover rounded-2xl" style={{ width: '100%', height: 'auto', display: 'block', borderRadius: '16px' }} alt="Media Banner" />
          </div>
        );
      }

      if (mType === "video" && mVideo) {
        return (
          <div className="w-full mt-3 rounded-2xl overflow-hidden shadow-sm">
            <VideoPlayer title={lang === "tr" ? "Tanıtım Videosu" : "Promo Video"} url={mVideo} isDark={isDark} />
          </div>
        );
      }

      return null;
    })()}
  </div>

 {/* Addons Grid */}
 {addons && addons.length > 0 && (
   <div className="addons-container w-full flex flex-col gap-4 mt-6" style={{ position: 'relative', height: 'auto', minHeight: 'fit-content' }}>
     {addons.map((addon: any) => renderAddonBlockHelper(addon, currentStyles.cardBg, currentStyles.btnClass, isDark, products, username, isCompactMode))}
   </div>
 )}
 </main>

  {shouldShowBranding && (
     <div 
       className="clinkor-branding-footer"
       style={{
         position: "absolute",
         bottom: "24px",
         left: "50%",
         transform: "translateX(-50%)",
         zIndex: 9999,
         background: "rgba(255, 255, 255, 0.95)",
         color: "#000",
         padding: "8px 24px",
         borderRadius: "50px",
         fontSize: "11px",
         fontWeight: 700,
         textDecoration: "none",
         boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
         whiteSpace: "nowrap",
         fontFamily: "sans-serif"
       }}
     >
         <Link href="https://www.clinkor.com/sign-in" target="_blank" rel="noopener noreferrer" className="branding-link" style={{ color: "#000", textDecoration: "none" }}>
             {lang === "tr" ? "Clinkor'da Kendi Sayfanı Oluştur" : "Create Your Own Page on Clinkor"}
         </Link>
     </div>
   )}
 </div>
 );
}

function renderAddonBlockHelper(addon: any, cardBg: string, btnClass: string, isDark: boolean, products: any[], username: string, isCompactMode: boolean) {
  let configData: any = {};
  if (addon.settings) {
    const parsed = typeof addon.settings === "string" ? JSON.parse(addon.settings) : addon.settings;
    configData = parsed || {};
  }

  const type = addon.addonType;

  const cardClassName = `p-4 w-full rounded-2xl border backdrop-blur-md flex flex-col gap-3 text-left ${cardBg}`;
  const btnClassName = `w-full py-2.5 rounded-xl text-xs font-bold text-center transition-all ${btnClass}`;
  
  const getSlug = (t: string, config: any) => {
    if (config.customSlug) return config.customSlug;
    if (t === "MINI_STORE") return "store";
    if (t === "ADVANCED_STOREFRONT") return "advanced-storefront";
    if (t === "NEO_BRUTAL") return "neo-brutal";
    if (t === "ORGANIC") return "organic";
    if (t === "RETRO") return "retro";
    if (t === "Y2K") return "y2k";
    if (t === "QA") return "qa";
    if (t === "RETRO_CASSETTE") return "retro-cassette";
    if (t === "PREMIUM_VIDEO") return "masterclass";
    if (t === "AUDIO_PLAYER") return "audio-player";
    if (t === "SPOTIFY_CLASSIC") return "spotify-player";
    if (t === "VINYL_RETRO") return "vinyl-player";
    if (t === "GLASS_AUDIO") return "glass-audio";
    if (t === "NEON_CYBERPUNK") return "neon-player";
    if (t === "MUSIC_PODCAST") return "music-podcast";
    if (t === "PORTFOLIO_GALLERY") return "portfolio-gallery";
    if (t === "COUNTDOWN_LAUNCH") return "countdown";
    if (t === "TRAVEL_STOREFRONT") return "travel-store";
    if (t === "ELITE_TRAVEL") return "elite-travel";
    if (t === "PREMIUM_PROFILE") return "premium-hub";
    if (t === "CORP_EXEC") return "corporate";
    return t.toLowerCase();
  };

  const CardWrapper = ({ children, slug }: { children: React.ReactNode, slug: string }) => {
    const href = `/@${username}/${slug.toLowerCase()}`;
    if (isCompactMode) {
      return <div className={cardClassName}>{children}</div>;
    }
    return (
      <a href={href} className={cardClassName + " transition-transform hover:scale-[1.01] block cursor-pointer"}>
        {children}
      </a>
    );
  };

  switch (type) {

    case "QA":
      {
        const qaPairs = configData.qaPairs || [];
        return (
          <div key={addon.id} className={cardClassName}>
            <div className="flex items-center justify-between border-b border-black/5 pb-2.5 mb-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center shrink-0">
                  <FileQuestion className="h-5 w-5 text-amber-500" />
                </div>
                <h4 className="text-sm font-bold text-slate-800">{configData.boxTitle || "Soru & Cevap (AMA)"}</h4>
              </div>
              {!isCompactMode && (
                <a href={`/@${username}/${getSlug(type, configData)}`} className="text-slate-400 hover:text-slate-600 transition-colors" title="Detaylar">
                  <ArrowUpRight className="h-4 w-4" />
                </a>
              )}
            </div>
            {qaPairs.length > 0 ? (
              <div className="space-y-2.5 w-full">
                {qaPairs.map((p: any, idx: number) => (
                  <details key={idx} className="group border border-slate-100 rounded-xl bg-black/5 p-3 [&_summary::-webkit-details-marker]:hidden">
                    <summary className="flex items-center justify-between cursor-pointer focus:outline-none">
                      <span className="text-xs font-bold text-slate-855 pr-4">{p.q || "Soru"}</span>
                      <span className="transition group-open:rotate-180 text-slate-400 shrink-0">
                        <svg fill="none" height="16" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="16" className="h-3 w-3"><path d="M6 9l6 6 6-6"></path></svg>
                      </span>
                    </summary>
                    <p className="text-xs text-slate-655 mt-2 pl-1 leading-relaxed border-t border-black/5 pt-2 whitespace-pre-wrap">{p.a || "Cevap..."}</p>
                  </details>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 text-center py-2">
                {isDark ? "No questions or answers yet." : "Henüz soru ve cevap bulunmuyor."}
              </p>
            )}
          </div>
        );
      }

    case "PREMIUM_VIDEO":
      return (
        <CardWrapper key={addon.id} slug={getSlug(type, configData)}>
          <div className="w-full aspect-video rounded-xl bg-zinc-900 overflow-hidden relative border border-white/5">
            {configData.coverUrl ? (
              <img src={configData.coverUrl} alt="Cover" className="w-full h-full object-cover opacity-80" />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-zinc-650">
                <Play className="h-8 w-8" />
              </div>
            )}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/30">
                <span className="ml-1">▶</span>
              </div>
            </div>
          </div>
          <h4 className="text-sm font-bold text-slate-800">{configData.title || "Premium Video"}</h4>
          <p className="text-xs opacity-70">{configData.description || "Video açıklaması."}</p>
          <div className={btnClassName}>
            {configData.buttonText || "Tamamını İzle"}
          </div>
        </CardWrapper>
      );
    case "COUNTDOWN":
      return (
        <CardWrapper key={addon.id} slug={getSlug(type, configData)}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center shrink-0">
              <Clock className="h-5 w-5 text-purple-500" />
            </div>
            <h4 className="text-sm font-bold text-slate-800">{configData.title || "Geri Sayım"}</h4>
          </div>
          <p className="text-xs opacity-70">{configData.description}</p>
          <div className="grid grid-cols-4 gap-2 w-full">
            {['14', '08', '45', '22'].map((val, i) => (
              <div key={i} className="bg-black/10 rounded-lg py-2 flex flex-col items-center">
                <span className="text-sm font-bold font-mono">{val}</span>
                <span className="text-[8px] opacity-60">{['Gün', 'Saat', 'Dk', 'Sn'][i]}</span>
              </div>
            ))}
          </div>
          {configData.buttonText && (
            <div className={btnClassName}>
              {configData.buttonText}
            </div>
          )}
        </CardWrapper>
      );
    case "FAQ":
      {
        const qas = (configData.questionsText || "Soru Örneği?|Cevap Örneği.;")
          .split(';')
          .map((pair: string) => pair.split('|'))
          .filter((pair: string[]) => pair.length === 2 && pair[0].trim() !== "");
        return (
          <CardWrapper key={addon.id} slug={getSlug(type, configData)}>
            <h4 className="text-sm font-bold text-slate-800">{configData.title || "FAQ"}</h4>
            <div className="space-y-2 w-full">
              {qas.map(([q, a]: [string, string], i: number) => (
                <div key={i} className="bg-black/5 p-2 rounded-lg">
                  <p className="text-xs font-bold text-slate-800">{q.trim()}</p>
                  <p className="text-[11px] opacity-75 mt-0.5">{a.trim()}</p>
                </div>
              ))}
            </div>
            {configData.contactUrl && (
              <div className={btnClassName}>
                {configData.buttonText || "Bize Ulaşın"}
              </div>
            )}
          </CardWrapper>
        );
      }
    case "MAP":
      return (
        <CardWrapper key={addon.id} slug={getSlug(type, configData)}>
          <h4 className="text-sm font-bold text-slate-800">{configData.title || "Bizi Ziyaret Edin"}</h4>
          <div className="bg-black/5 p-2 rounded-lg flex items-center gap-2">
            <span className="text-red-500">📍</span>
            <span className="text-xs truncate">{configData.address || "İstanbul, Türkiye"}</span>
          </div>
          <div className={btnClassName}>
            {configData.buttonText || "Yol Tarifi Al"}
          </div>
        </CardWrapper>
      );
    case "WHATSAPP":
      return (
        <CardWrapper key={addon.id} slug={getSlug(type, configData)}>
          <h4 className="text-sm font-bold text-slate-800">{configData.title || "WhatsApp İletişim"}</h4>
          <p className="text-xs opacity-70 bg-green-500/5 p-2 rounded-lg border border-green-500/10 text-green-600">
            {configData.welcomeMessage || "Merhaba, size nasıl yardımcı olabilirim?"}
          </p>
          <div className={btnClassName}>
            {configData.buttonText || "Sohbete Başla"}
          </div>
        </CardWrapper>
      );
    case "TRAVEL_STOREFRONT":
      return (
        <CardWrapper key={addon.id} slug={getSlug(type, configData)}>
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-sky-500/10 flex items-center justify-center shrink-0">
                <Compass className="h-5 w-5 text-sky-600" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-800">{configData.heroTitle || "Seyahat & Tur Rezervasyon"}</h4>
                <p className="text-xs opacity-70 mt-0.5 truncate max-w-[200px]">{isDark ? "Click to discover new tours." : "Yeni turları keşfetmek için tıklayın."}</p>
              </div>
            </div>
            <div className="w-8 h-8 rounded-full bg-sky-600 flex items-center justify-center text-white shrink-0">
              <span className="text-[10px] ml-0.5">▶</span>
            </div>
          </div>
        </CardWrapper>
      );
    case "ELITE_TRAVEL":
      return (
        <CardWrapper key={addon.id} slug={getSlug(type, configData)}>
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                <Compass className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-800">{configData.heroTitle || "Elite Seyahat & Bento Rotalar"}</h4>
                <p className="text-xs opacity-70 mt-0.5 truncate max-w-[200px]">{isDark ? "Exclusive Bento Travel Grid." : "Seçkin Bento kutusu seyahat vitrini."}</p>
              </div>
            </div>
            <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-white shrink-0">
              <span className="text-[10px] ml-0.5">▶</span>
            </div>
          </div>
        </CardWrapper>
      );
    case "PREMIUM_PROFILE":
      return (
        <CardWrapper key={addon.id} slug={getSlug(type, configData)}>
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-violet-500/10 flex items-center justify-center shrink-0">
                <User className="h-5 w-5 text-violet-600" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-800">{configData.displayName || "Premium Profil & Linkler"}</h4>
                <p className="text-xs opacity-70 mt-0.5 truncate max-w-[200px]">{isDark ? "VIP Glassmorphism Link Hub" : "VIP Cam Efektli Link Merkezi"}</p>
              </div>
            </div>
            <div className="w-8 h-8 rounded-full bg-violet-600 flex items-center justify-center text-white shrink-0">
              <span className="text-[10px] ml-0.5">▶</span>
            </div>
          </div>
        </CardWrapper>
      );
    case "AUDIO_PLAYER":
      return (
        <CardWrapper key={addon.id} slug={getSlug(type, configData)}>
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center shrink-0">
                <Music className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-800">{configData.trackName || "Premium Müzik Oynatıcı"}</h4>
                <p className="text-xs opacity-70 mt-0.5 truncate max-w-[200px]">{configData.artistName || "Müzik dinlemek için tıklayın."}</p>
              </div>
            </div>
            <div className="w-8 h-8 rounded-full bg-green-550 flex items-center justify-center text-white shrink-0">
              <span className="text-[10px] ml-0.5">▶</span>
            </div>
          </div>
        </CardWrapper>
      );
    case "RETRO_CASSETTE":
    case "SPOTIFY_CLASSIC":
    case "VINYL_RETRO":
    case "GLASS_AUDIO":
    case "NEON_CYBERPUNK":
    case "MUSIC_PODCAST":
      return (
        <CardWrapper key={addon.id} slug={getSlug(type, configData)}>
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-550/10 flex items-center justify-center shrink-0">
                <Music className="h-5 w-5 text-purple-650" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-800">{configData.title || (type === "RETRO_CASSETTE" ? "Retro Kaset Çalar" : type === "SPOTIFY_CLASSIC" ? "Classic Spotify Player" : type === "VINYL_RETRO" ? "Retro Plak Çalar" : type === "GLASS_AUDIO" ? "Modern Cam Efekti" : type === "NEON_CYBERPUNK" ? "Neon Cyberpunk Player" : "Müzik & Podcast Çalar")}</h4>
                <p className="text-xs opacity-70 mt-0.5 truncate max-w-[200px]">{configData.description || "Müziklerimi dinlemek için tıklayın."}</p>
              </div>
            </div>
            <div className="w-8 h-8 rounded-full bg-pink-500 flex items-center justify-center text-white shrink-0">
              <span className="text-[10px] ml-0.5">▶</span>
            </div>
          </div>
        </CardWrapper>
      );
    case "PORTFOLIO_GALLERY":
      return (
        <CardWrapper key={addon.id} slug={getSlug(type, configData)}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-500/10 flex items-center justify-center shrink-0">
              <Image className="h-5 w-5 text-slate-500" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-800">{configData.title || "Portfolyo & Galeri"}</h4>
              <p className="text-xs opacity-70 mt-0.5">{configData.description || "Çalışmalarımı ve galerimi inceleyin."}</p>
            </div>
          </div>
          <div className={btnClassName}>
            {configData.buttonText || "Galeriyi Gör"}
          </div>
        </CardWrapper>
      );
    case "COUNTDOWN_LAUNCH":
      return (
        <CardWrapper key={addon.id} slug={getSlug(type, configData)}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center shrink-0">
              <Clock className="h-5 w-5 text-orange-500" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-800">{configData.title || "Geri Sayım & Lansman"}</h4>
              <p className="text-xs opacity-70 mt-0.5">{configData.description || "Lansmanımız için geri sayım başladı."}</p>
            </div>
          </div>
          <div className={btnClassName}>
            {configData.buttonText || "Lansmanı İncele"}
          </div>
        </CardWrapper>
      );

    case "ADVANCED_STOREFRONT":
      return (
        <CardWrapper key={addon.id} slug={getSlug(type, configData)}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-violet-500/10 flex items-center justify-center shrink-0">
              <ShoppingBag className="h-5 w-5 text-violet-500" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-800">{configData.heroTitle || "Gelişmiş E-Ticaret Vitrini"}</h4>
              <p className="text-xs opacity-70 mt-0.5">{configData.heroSub || "Yeni ürün koleksiyonlarımızı keşfedin."}</p>
            </div>
          </div>
          <div className={btnClassName}>
            {configData.heroBtnText || "Vitrine Git"}
          </div>
        </CardWrapper>
      );

    case "MINI_STORE":
    case "NEO_BRUTAL":
    case "ORGANIC":
    case "RETRO":
    case "Y2K":
      return (
        <CardWrapper key={addon.id} slug={getSlug(type, configData)}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
              <Store className="h-5 w-5 text-emerald-500" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-800">{configData.storeTitle || "Dijital Mağaza"}</h4>
              <p className="text-xs opacity-70 mt-0.5">{configData.storeBio || "Ürünlerimi incelemek için tıklayın."}</p>
            </div>
          </div>
          <div className={btnClassName}>
            {configData.buyButtonText || "Mağazayı Gör"}
          </div>
        </CardWrapper>
      );
    case "CORP_EXEC":
      const mainTitle = configData.title || (configData.cards && configData.cards[0] && configData.cards[0].title) || "Kurumsal Yönetici Kartı";
      const mainDesc = configData.description || (configData.cards && configData.cards[0] && configData.cards[0].description) || "Görüşme ve detaylar için tıklayın.";
      const mainBtnText = configData.buttonText || (configData.cards && configData.cards[0] && configData.cards[0].buttonText) || "Görüşme Ayarla";

      return (
        <CardWrapper key={addon.id} slug={getSlug(type, configData)}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0">
              <Briefcase className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-800">{mainTitle}</h4>
              <p className="text-xs opacity-70 mt-0.5">{mainDesc}</p>
            </div>
          </div>
          <div className={btnClassName}>
            {mainBtnText}
          </div>
        </CardWrapper>
      );
    default:
      return null;
  }
}

function getMediaEmbed(url: string, accentColor?: string) {
  if (!url) return null;
  const trimmed = url.trim();
  
  // Spotify track/album/playlist/episode
  const spotifyMatch = trimmed.match(/open\.spotify\.com\/(?:[a-zA-Z0-9_-]+\/)?(track|album|playlist|episode)\/([a-zA-Z0-9]+)/i);
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
  const ytMatch = trimmed.match(/(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|v\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/i);
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
  const appleMusicMatch = trimmed.match(/music\.apple\.com\/([a-z]{2})\/(?:album|playlist)\/(?:[^/]+\/)?([a-zA-Z0-9.]+)/i);
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
    case "AUDIO_PLAYER":
      return (
        <div className="w-full h-full bg-[#f8f9fa] flex flex-col p-4 relative z-0 justify-between select-none">
          <div className="w-full bg-white rounded-3xl overflow-hidden border border-zinc-200/80 flex flex-col shadow-md mt-6">
            <div className="p-4 bg-white flex flex-col items-center">
              <div className="w-full flex items-center justify-between text-zinc-400 mb-3">
                <span className="text-[9px] font-bold uppercase tracking-wider text-zinc-500">Now playing</span>
                <div className="flex items-center gap-2">
                  <Laptop size={11} />
                  <Volume2 size={11} />
                </div>
              </div>

              <div className="relative w-28 h-28 mx-auto mb-3 flex items-center justify-center">
                <div className="w-28 h-28 rounded-full bg-zinc-950 border-4 border-zinc-800 flex items-center justify-center relative shadow-md animate-[spin_6s_linear_infinite]">
                  <div className="absolute inset-2 rounded-full border border-zinc-900 opacity-60"></div>
                  <div className="absolute inset-4 rounded-full border border-zinc-900 opacity-60"></div>
                  <div className="absolute inset-6 rounded-full border border-zinc-900 opacity-60"></div>
                  <img src={config.albumCoverUrl || avatarUrl || "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=200&q=80"} className="w-12 h-12 rounded-full object-cover border border-zinc-950" />
                  <div className="absolute w-2.5 h-2.5 rounded-full bg-white flex items-center justify-center">
                    <div className="w-1 h-1 rounded-full bg-zinc-950"></div>
                  </div>
                </div>
                
                <div className="absolute inset-0 flex items-center justify-center">
                  <button className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-zinc-900 shadow border border-zinc-200/30 pointer-events-none">
                    <span className="text-[10px] ml-0.5">▶</span>
                  </button>
                </div>
              </div>

              <div className="text-center mb-3">
                <h4 className="text-[11px] font-black text-zinc-900 leading-tight">{config.trackName || title}</h4>
                <p className="text-[9px] text-zinc-500 font-bold mt-0.5">{config.artistName || desc}</p>
              </div>

              <div className="w-full space-y-1">
                <div className="w-full h-1 bg-zinc-200 rounded-full overflow-hidden">
                  <div className="w-1/3 h-full bg-[#22c55e] rounded-full" style={{ backgroundColor: config.accentColor || "#22c55e" }}></div>
                </div>
                <div className="flex justify-between text-[7px] text-zinc-400 font-mono font-bold">
                  <span>0:00</span>
                  <span>{config.trackDuration || "3:45"}</span>
                </div>
              </div>
            </div>

            <div className="bg-zinc-900 px-4 py-2.5 flex items-center justify-center text-zinc-400">
              <ListMusic size={12} />
            </div>
          </div>
        </div>
      );
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
      {
        const galleryImages = Array.isArray(config.galleryImages) && config.galleryImages.length > 0
          ? config.galleryImages
          : [
              config.galleryImage1,
              config.galleryImage2,
              config.galleryImage3,
              config.galleryImage4
            ].filter(Boolean);

        const effectiveGalleryImages = galleryImages.length > 0 ? galleryImages : [
          "https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=200&q=80",
          "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&q=80",
          "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=200&q=80",
          "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=200&q=80"
        ];

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
              {effectiveGalleryImages.map((imgUrl: string, idx: number) => (
                <div key={idx} className="aspect-square bg-white/60 backdrop-blur-md border border-slate-200/50 rounded-xl p-1.5 overflow-hidden shadow-sm">
                  <img src={imgUrl} className="w-full h-full object-cover rounded-lg" />
                </div>
              ))}
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
      }
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

    case "TRAVEL_STOREFRONT":
      return (
        <div className="w-full h-full bg-[#f8f9fa] flex flex-col p-4 relative z-0 justify-between select-none">
          <div className="w-full bg-white rounded-3xl overflow-hidden border border-zinc-200/80 flex flex-col shadow-md mt-6">
            <div className="relative aspect-[4/3] min-h-[120px] flex flex-col justify-end p-4 bg-zinc-900">
              <img src={config.heroBgImage || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80"} className="absolute inset-0 w-full h-full object-cover opacity-60" />
              <div className="relative z-10 text-left">
                <span className="text-[7px] font-mono tracking-widest text-sky-400 bg-sky-950/40 px-2 py-0.5 rounded-full inline-block mb-1">Macera Seni Çağırıyor</span>
                <h4 className="text-[10px] font-black text-white leading-tight font-serif truncate max-w-[200px]">{config.heroTitle || "Dünyayı Keşfetmeye Hazır Mısın?"}</h4>
              </div>
            </div>
            <div className="p-3 bg-white space-y-2.5">
              <div className="flex justify-between items-center text-[8px] font-bold text-slate-800 uppercase">
                <span>📍 Öne Çıkan Turlar</span>
                <span className="text-sky-500">Tümünü Gör</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="border border-zinc-100 rounded-xl p-1.5 space-y-1">
                  <div className="h-14 bg-slate-100 rounded-lg overflow-hidden">
                    <img src="https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=200&q=80" className="w-full h-full object-cover" />
                  </div>
                  <h5 className="text-[8px] font-black text-slate-800 truncate">Maldivler Balayı</h5>
                  <span className="text-[8px] font-black text-orange-600">45.000 TL</span>
                </div>
                <div className="border border-zinc-100 rounded-xl p-1.5 space-y-1">
                  <div className="h-14 bg-slate-100 rounded-lg overflow-hidden">
                    <img src="https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=200&q=80" className="w-full h-full object-cover" />
                  </div>
                  <h5 className="text-[8px] font-black text-slate-800 truncate">Karadeniz Yaylaları</h5>
                  <span className="text-[8px] font-black text-orange-600">12.500 TL</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    case "ELITE_TRAVEL":
      return (
        <div className="w-full h-full bg-[#f8fafc] flex flex-col p-4 relative z-0 justify-between select-none">
          <div className="w-full bg-white rounded-3xl overflow-hidden border border-zinc-200/80 flex flex-col shadow-md mt-6 p-4">
            <div className="flex items-center justify-between mb-4 border-b pb-2 border-slate-100">
              <div className="flex items-center gap-1.5">
                <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center text-white text-[8px]">⭐</div>
                <span className="text-[9px] font-black text-slate-800 uppercase tracking-tight">{config.brandName || "Elite Travel"}</span>
              </div>
              <span className="text-[9px] text-slate-400">🔔</span>
            </div>
            <div className="text-left mb-4 space-y-1">
              <h4 className="text-sm font-black text-slate-900 font-sans tracking-tight uppercase leading-none">{config.heroTitle || "Sınırları Aşın"}</h4>
              <p className="text-[8px] text-slate-400">{config.heroSubtitle || "Size özel bento kutusu konseptli lüks seyahatler."}</p>
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              <div className="col-span-2 relative aspect-[1.8] rounded-2xl overflow-hidden bg-slate-900 flex flex-col justify-end p-2.5">
                <img src="https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=200&q=80" className="absolute inset-0 w-full h-full object-cover opacity-60" />
                <h5 className="text-[8px] font-black text-white relative z-10 leading-tight">Maldivler VIP</h5>
                <span className="text-[8px] font-black text-emerald-400 relative z-10">95.000 TL</span>
              </div>
              <div className="col-span-1 relative aspect-[1.1] rounded-2xl overflow-hidden bg-slate-900 flex flex-col justify-end p-2">
                <img src="https://images.unsplash.com/photo-1513407030348-c983a97b98d8?w=200&q=80" className="absolute inset-0 w-full h-full object-cover opacity-60" />
                <h5 className="text-[7px] font-black text-white relative z-10 leading-tight">Tokyo Turu</h5>
                <span className="text-[7px] font-black text-emerald-400 relative z-10">64.000 TL</span>
              </div>
              <div className="col-span-1 relative aspect-[1.1] rounded-2xl overflow-hidden bg-slate-900 flex flex-col justify-end p-2">
                <img src="https://images.unsplash.com/photo-1533105079780-92b9be482077?w=200&q=80" className="absolute inset-0 w-full h-full object-cover opacity-60" />
                <h5 className="text-[7px] font-black text-white relative z-10 leading-tight">Ege Yat Turu</h5>
                <span className="text-[7px] font-black text-emerald-400 relative z-10">32.000 TL</span>
              </div>
            </div>
          </div>
        </div>
      );
    case "PREMIUM_PROFILE":
      return (
        <div className="w-full h-full bg-slate-900 flex flex-col p-4 relative z-0 justify-between select-none">
          <div className="w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl overflow-hidden flex flex-col shadow-md mt-6 p-4 text-center items-center space-y-3">
            <div className="w-12 h-12 rounded-full ring-2 ring-white/20 bg-zinc-800 flex items-center justify-center text-white text-xs font-bold shrink-0">
              VIP
            </div>
            <div className="flex items-center gap-1">
              <span className="text-[10px] font-bold text-white">{config.displayName || "Premium Hub"}</span>
              {config.showVerifiedBadge && <span className="text-[8px] text-sky-400">🔵</span>}
            </div>
            <div className="w-full space-y-2">
              <div className="w-full py-2.5 px-4 rounded-xl bg-white/10 border border-white/10 text-[8px] text-white font-bold flex justify-between items-center">
                <span>🔥 En Son Videom</span>
                <span>↗</span>
              </div>
              <div className="w-full py-2.5 px-4 rounded-xl bg-white/10 border border-white/10 text-[8px] text-white font-bold flex justify-between items-center">
                <span>📚 Şablon Mağazam</span>
                <span>↗</span>
              </div>
            </div>
          </div>
        </div>
      );
    default:
      return null;
  }
}
