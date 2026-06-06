"use client";

import React, { useId } from "react";
import { User, Globe, MessageCircle, ArrowUpRight, Play, Image, Utensils, Smartphone, Percent, Wifi, Music, ShoppingBag, FileText, List, Briefcase, Zap, Calendar, FileQuestion, Mail, Heart, Clock, HelpCircle, MapPin, Store } from "lucide-react";
import { YoutubeIcon, TwitterIcon, LinkedinIcon, TiktokIcon, PinterestIcon, InstagramIcon } from "@/components/brand-icons";
import VideoPlayer from "@/components/blocks/video-player";
import BeforeAfterSlider from "@/components/blocks/before-after-slider";
import AudioPlayer from "@/components/blocks/audio-player";
import Link from "next/link";

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
}

interface UniversalProfileProps {
 data: UniversalProfileData;
 isCompactMode?: boolean; // If true, disable interactive popups/modals
 isDarkContext?: boolean; // For default fallback logic
 lang?: "tr" | "en";
 isDashboardPreview?: boolean;
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

export default function UniversalProfile({ data, isCompactMode = false, isDarkContext = true, lang = "tr", isDashboardPreview = false }: UniversalProfileProps) {
 // Generate a unique ID to safely scope CSS per instance
 const rawId = useId();
 const wrapperId = `univ-profile-${rawId.replace(/:/g, "")}`;

  const {
  username, bio, avatarUrl, theme = "dark", customCss, background, fontStyle = "Inter",
  bioColor, usernameColor, plan, links = [], products = [], addons = [], buttonClass, avatarShape = "circle",
  purchasedTemplates = [], purchasedModules = []
  } = data;

  const isDark = isDarkContext;

  const hasPurchasedPremiumTemplate = purchasedTemplates?.some(
    (pt: any) => pt.template && pt.template.price > 0
  ) ?? false;

  const hasPurchasedModule = (purchasedModules && purchasedModules.length > 0) ?? false;

  const shouldShowBranding = plan === "FREE" && !hasPurchasedPremiumTemplate && !hasPurchasedModule;

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
 const isCssBg = background && !isCustomImg && !isCustomVideo && !isTailwindBg;

 const bgClassName = (background && isTailwindBg && !isCustomImg && !isCustomVideo) 
 ? background 
 : (!background && !isCustomImg && !isCustomVideo ? currentStyles.bg : "");

 // Auto-Scope CSS to prevent bleeding into /sablonlar or dashboard
 let scopedCss = customCss || "";
 if (scopedCss) {
 // 1. Replace body with wrapperId
 scopedCss = scopedCss.replace(/body/gi, `#${wrapperId}`);
 
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
 return `${prefix} #${wrapperId} ${sel}`;
 });
 });

 // Quick fix for the Obsidian Luxe global transition bug:
 scopedCss = scopedCss.replace(/^\s*\*\s*\{/gm, `#${wrapperId} * {`);
 }

 if (scopedCss && isCompactMode) {
 // Disable custom scrollbars in compact mode to prevent "gri buçuklar"
 scopedCss = scopedCss.replace(/::-webkit-scrollbar/g, '.disabled-scrollbar-in-mockup');
 
 // BRUTE FORCE HIDE SCROLLBARS (Track, Thumb, Corner)
 scopedCss += `
 #${wrapperId}::-webkit-scrollbar, 
 #${wrapperId} *::-webkit-scrollbar { 
 display: none !important; 
 width: 0 !important; 
 height: 0 !important; 
 }
 #${wrapperId}::-webkit-scrollbar-track,
 #${wrapperId} *::-webkit-scrollbar-track,
 #${wrapperId}::-webkit-scrollbar-thumb,
 #${wrapperId} *::-webkit-scrollbar-thumb {
 display: none !important;
 background: transparent !important;
 }
 #${wrapperId} { 
 -ms-overflow-style: none !important; 
 scrollbar-width: none !important; 
 }
 `;

 // Force h1 font-size to be normal in mockup and prevent gigantic text
 scopedCss += `\n#${wrapperId} h1, #${wrapperId} .profile-card h1, #${wrapperId} .profile-name { font-size: 1.25rem !important; line-height: 1.2 !important; word-break: break-word !important; }`;
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
 id={wrapperId}
 className={`transition-all duration-500 ${bgClassName} ${isCompactMode ? 'h-full w-full relative flex flex-col overflow-y-auto overflow-x-hidden scrollbar-hide' : 'flex-1 min-h-screen min-h-full w-full relative flex flex-col overflow-x-hidden'}`}
 style={{
 fontFamily: fontStyle,
 ...(isCssBg ? { background: background } : {}),
 ...(customImgUrl ? { backgroundImage: `url(${customImgUrl})`, backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat" } : {})
 }}
 >
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
 @{username}
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
 @{username}
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
 @{username}
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

        if (showAd && idx === adIndex) {
          return (
            <React.Fragment key={`ad-frag-${link.id}`}>
              {renderSponsoredBlock()}
              {blockElement}
            </React.Fragment>
          );
        }

        return blockElement;
      });
    })()
  )}
 </div>

 {/* Addons Grid */}
 {addons && addons.length > 0 && (
   <div className="addons-container w-full flex flex-col gap-4 mt-6" style={{ position: 'relative', height: 'auto', minHeight: 'fit-content' }}>
     {addons.map((addon: any) => renderAddonBlockHelper(addon, currentStyles.cardBg, currentStyles.btnClass, isDark, products, username, isCompactMode))}
   </div>
 )}
 </main>

  {shouldShowBranding && (
    <Link 
      href="/" 
      className={`flex items-center justify-center gap-2 mt-12 pb-6 text-[11px] transition-opacity duration-200 relative z-10 hover:opacity-100 ${
        isDark ? "text-white/50 hover:text-white" : "text-zinc-500 hover:text-zinc-800"
      }`}
    >
      <span>{lang === "tr" ? "Kendi sayfanı oluştur:" : "Create your page:"}</span>
      <span className="font-extrabold tracking-wider">CREATOR.HUB</span>
    </Link>
  )}
 </div>
 );
}

function renderAddonBlockHelper(addon: any, cardBg: string, btnClass: string, isDark: boolean, products: any[], username: string, isCompactMode: boolean) {
  let configData: any = {};
  if (addon.settings) {
    configData = typeof addon.settings === "string" ? JSON.parse(addon.settings) : addon.settings;
  }

  const type = addon.addonType;

  const cardClassName = `p-4 w-full rounded-2xl border backdrop-blur-md flex flex-col gap-3 text-left ${cardBg}`;
  const btnClassName = `w-full py-2.5 rounded-xl text-xs font-bold text-center transition-all ${btnClass}`;
  
  const getSlug = (t: string, config: any) => {
    if (config.customSlug) return config.customSlug;
    if (t === "MINI_STORE") return "store";
    if (t === "NEO_BRUTAL") return "neo-brutal";
    if (t === "ORGANIC") return "organic";
    if (t === "RETRO") return "retro";
    if (t === "ACADEMIA") return "academia";
    if (t === "Y2K") return "y2k";
    if (t === "BOOKING") return "booking";
    if (t === "NEWSLETTER") return "newsletter";
    if (t === "QA") return "qa";
    if (t === "DONATION") return "donation";
    if (t === "PREMIUM_CREATOR") return "creator-store";
    if (t === "RETRO_CASSETTE") return "retro-cassette";
    if (t === "MINIMAL_DARK_AUDIO") return "minimal-dark-audio";
    if (t === "VINTAGE_RADIO") return "vintage-radio";
    if (t === "FUTURE_WAVE") return "future-wave";
    if (t === "CINEMATIC_THEATER") return "cinematic-theater";
    if (t === "PREMIUM_VIDEO") return "masterclass";
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
    case "BOOKING":
      return (
        <CardWrapper key={addon.id} slug={getSlug(type, configData)}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0">
              <Calendar className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-800">{configData.title || (isDark ? "Book a 1:1 Call" : "Birebir Görüşme Ayarla")}</h4>
              <p className="text-xs opacity-70 mt-0.5">{configData.description || "Sizinle tanışmak için sabırsızlanıyorum."}</p>
            </div>
          </div>
          <div className={btnClassName}>
            {configData.buttonText || "Takvimi Görüntüle"}
          </div>
        </CardWrapper>
      );
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
    case "DONATION":
      return (
        <CardWrapper key={addon.id} slug={getSlug(type, configData)}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-pink-500/10 flex items-center justify-center shrink-0">
              <Heart className="h-5 w-5 text-pink-500" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-800">{configData.title || "Bana Kahve Ismarla"}</h4>
              <p className="text-xs opacity-70 mt-0.5">{configData.thankYouMsg || "Desteğiniz için teşekkürler!"}</p>
            </div>
          </div>
          <div className={btnClassName}>
            {configData.buttonText || "Destek Ol"}
          </div>
        </CardWrapper>
      );
    case "NEWSLETTER":
      return (
        <CardWrapper key={addon.id} slug={getSlug(type, configData)}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
              <Mail className="h-5 w-5 text-emerald-500" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-800">{configData.title || "Haftalık Bülten"}</h4>
              <p className="text-xs opacity-70 mt-0.5">{configData.incentiveMsg || "Spam yok, sadece kaliteli içerik."}</p>
            </div>
          </div>
          <div className="w-full bg-black/5 border border-black/10 rounded-lg p-2 h-10 flex items-center">
            <span className="text-xs opacity-45">email@example.com</span>
          </div>
          <div className={btnClassName}>
            {configData.buttonText || "Abone Ol"}
          </div>
        </CardWrapper>
      );
    case "FUTURE_WAVE":
    case "CINEMATIC_THEATER":
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
    case "RETRO_CASSETTE":
    case "MINIMAL_DARK_AUDIO":
    case "VINTAGE_RADIO":
    case "SPOTIFY_CLASSIC":
    case "VINYL_RETRO":
    case "GLASS_AUDIO":
    case "NEON_CYBERPUNK":
    case "MINIMAL_LIGHT_AUDIO":
    case "MUSIC_PODCAST":
      return (
        <CardWrapper key={addon.id} slug={getSlug(type, configData)}>
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-550/10 flex items-center justify-center shrink-0">
                <Music className="h-5 w-5 text-purple-650" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-800">{configData.title || (type === "RETRO_CASSETTE" ? "Retro Kaset Çalar" : type === "MINIMAL_DARK_AUDIO" ? "Minimalist Dark Player" : type === "VINTAGE_RADIO" ? "Antika Radyo Oynatıcı" : type === "SPOTIFY_CLASSIC" ? "Classic Spotify Player" : type === "VINYL_RETRO" ? "Retro Plak Çalar" : type === "GLASS_AUDIO" ? "Modern Cam Efekti" : type === "NEON_CYBERPUNK" ? "Neon Cyberpunk Player" : type === "MINIMAL_LIGHT_AUDIO" ? "Minimalist Light Player" : "Müzik & Podcast Çalar")}</h4>
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
    case "TESTIMONIALS":
      return (
        <CardWrapper key={addon.id} slug={getSlug(type, configData)}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-teal-500/10 flex items-center justify-center shrink-0">
              <MessageCircle className="h-5 w-5 text-teal-500" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-800">{configData.title || "Müşteri Yorumları"}</h4>
              <p className="text-xs opacity-70 mt-0.5">{configData.description || "Müşterilerimizin yorumlarını okuyun."}</p>
            </div>
          </div>
          <div className={btnClassName}>
            {configData.buttonText || "Yorumları Gör"}
          </div>
        </CardWrapper>
      );
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
