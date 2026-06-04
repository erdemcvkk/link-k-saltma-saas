"use client";

import React, { useId } from "react";
import { User, Globe, MessageCircle, ArrowUpRight, Play, Image, Utensils, Smartphone, Percent, Wifi, Music, ShoppingBag, FileText, List, Briefcase, Zap, Calendar, FileQuestion, Mail, Heart, Clock, HelpCircle, MapPin, Store } from "lucide-react";
import { YoutubeIcon, TwitterIcon, LinkedinIcon, TiktokIcon, PinterestIcon, InstagramIcon } from "@/components/brand-icons";
import VideoPlayer from "@/components/blocks/video-player";
import BeforeAfterSlider from "@/components/blocks/before-after-slider";
import AudioPlayer from "@/components/blocks/audio-player";

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
 links: any[];
 products?: any[];
 addons?: any[];
}

interface UniversalProfileProps {
 data: UniversalProfileData;
 isCompactMode?: boolean; // If true, disable interactive popups/modals
 isDarkContext?: boolean; // For default fallback logic
}

export default function UniversalProfile({ data, isCompactMode = false, isDarkContext = true }: UniversalProfileProps) {
 // Generate a unique ID to safely scope CSS per instance
 const rawId = useId();
 const wrapperId = `univ-profile-${rawId.replace(/:/g, "")}`;

 const {
 username, bio, avatarUrl, theme = "dark", customCss, background, fontStyle = "Inter",
 bioColor, usernameColor, plan, links = [], products = [], addons = [], buttonClass
 } = data;

 const isDark = isDarkContext;

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
 <div className={`w-16 h-16 rounded-full bg-gradient-to-tr ${currentStyles.avatarBg} border-2 border-white/10 shadow-md flex items-center justify-center overflow-hidden shrink-0`}>
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
 
 <div className={`w-20 h-20 rounded-full bg-gradient-to-tr ${currentStyles.avatarBg} border-4 border-white/15 shadow-xl flex items-center justify-center overflow-hidden -mt-10 z-10`}>
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
 <div className={`w-20 h-20 rounded-full bg-gradient-to-tr ${currentStyles.avatarBg} border-4 border-white/10 shadow-lg flex items-center justify-center overflow-hidden`}>
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
 <div className={`text-center py-6 text-xs rounded-2xl border border-dashed ${isDark ? "text-zinc-500 bg-zinc-950/20 border-zinc-900" : "text-zinc-600 bg-zinc-100 border-zinc-200"}`}>
 No active links found.
 </div>
 ) : (
 links.map((link, idx) => {
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

 if (link.blockType === "VIDEO_PLAYER") {
 return <VideoPlayer key={link.id} title={link.title} url={link.url} isDark={isDark} boxStyle={customStyle} className={dynamicBlockClass} />;
 }
 if (link.blockType === "BEFORE_AFTER") {
 return <BeforeAfterSlider key={link.id} title={link.title} beforeImage={blockMeta.beforeImage||""} afterImage={blockMeta.afterImage||""} isDark={isDark} boxStyle={customStyle} className={dynamicBlockClass} />;
 }
 if (link.blockType === "AUDIO_PLAYER") {
 return <AudioPlayer key={link.id} title={link.title} url={link.url} isDark={isDark} boxStyle={customStyle} className={dynamicBlockClass} />;
 }

 return (
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
 })
 )}
 </div>

 {/* Addons Grid */}
 {addons && addons.length > 0 && (
   <div className="addons-container w-full flex flex-col gap-4 mt-6" style={{ position: 'relative', height: 'auto', minHeight: 'fit-content' }}>
     {addons.map((addon: any) => renderAddonBlockHelper(addon, currentStyles.cardBg, currentStyles.btnClass, isDark, products))}
   </div>
 )}
 </main>

 {(plan !== "CREATOR" && plan !== "PRO_BUSINESS" && !isCompactMode) && (
 <footer className="text-center text-[10px] text-zinc-600 uppercase tracking-widest font-black py-4 relative z-10">
 Powered by CREATOR.HUB
 </footer>
 )}
 </div>
 );
}

function renderAddonBlockHelper(addon: any, cardBg: string, btnClass: string, isDark: boolean, products: any[]) {
 let configData: any = {};
 try {
   if (addon.config) configData = JSON.parse(addon.config);
 } catch (e) {}

 const type = addon.addonType;

 const cardClassName = `p-4 w-full rounded-2xl border backdrop-blur-md flex flex-col gap-3 text-left ${cardBg}`;
 const btnClassName = `w-full py-2.5 rounded-xl text-xs font-bold text-center transition-all ${btnClass}`;
 
 switch (type) {
   case "BOOKING":
     return (
       <div key={addon.id} className={cardClassName}>
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
       </div>
     );
   case "QA":
     return (
       <div key={addon.id} className={cardClassName}>
         <div className="flex items-center gap-3">
           <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center shrink-0">
             <FileQuestion className="h-5 w-5 text-amber-500" />
           </div>
           <h4 className="text-sm font-bold text-slate-800">{configData.boxTitle || "Bana Soru Sor!"}</h4>
         </div>
         <p className="text-xs opacity-75 bg-black/5 p-2 rounded-lg">
           {configData.welcomeMessage || "Sorularınızı anonim olarak sorabilirsiniz."}
         </p>
         <div className="w-full bg-black/5 border border-black/10 rounded-lg p-2 h-16">
           <span className="text-[10px] opacity-45">{configData.placeholderText || "Sorunuzu buraya yazın..."}</span>
         </div>
         <div className={btnClassName}>
           {configData.buttonText || "Gönder"}
         </div>
       </div>
     );
   case "DONATION":
     return (
       <div key={addon.id} className={cardClassName}>
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
       </div>
     );
   case "NEWSLETTER":
     return (
       <div key={addon.id} className={cardClassName}>
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
       </div>
     );
   case "PREMIUM_VIDEO":
     return (
       <div key={addon.id} className={cardClassName}>
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
       </div>
     );
   case "COUNTDOWN":
     return (
       <div key={addon.id} className={cardClassName}>
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
       </div>
     );
   case "FAQ":
     const qas = (configData.questionsText || "Soru Örneği?|Cevap Örneği.;")
       .split(';')
       .map((pair: string) => pair.split('|'))
       .filter((pair: string[]) => pair.length === 2 && pair[0].trim() !== "");
     return (
       <div key={addon.id} className={cardClassName}>
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
       </div>
     );
   case "MAP":
     return (
       <div key={addon.id} className={cardClassName}>
         <h4 className="text-sm font-bold text-slate-800">{configData.title || "Bizi Ziyaret Edin"}</h4>
         <div className="bg-black/5 p-2 rounded-lg flex items-center gap-2">
           <span className="text-red-500">📍</span>
           <span className="text-xs truncate">{configData.address || "İstanbul, Türkiye"}</span>
         </div>
         <div className={btnClassName}>
           {configData.buttonText || "Yol Tarifi Al"}
         </div>
       </div>
     );
   case "WHATSAPP":
     return (
       <div key={addon.id} className={cardClassName}>
         <h4 className="text-sm font-bold text-slate-800">{configData.title || "WhatsApp İletişim"}</h4>
         <p className="text-xs opacity-70 bg-green-500/5 p-2 rounded-lg border border-green-500/10 text-green-600">
           {configData.welcomeMessage || "Merhaba, size nasıl yardımcı olabilirim?"}
         </p>
         <div className={btnClassName}>
           {configData.buttonText || "Sohbete Başla"}
         </div>
       </div>
     );
   case "MINI_STORE":
   case "NEO_BRUTAL":
   case "ORGANIC":
   case "RETRO":
   case "ACADEMIA":
   case "Y2K":
   case "PREMIUM_CREATOR":
     return null;
   default:
     return null;
 }
}
