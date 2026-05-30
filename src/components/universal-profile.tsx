"use client";

import React, { useId } from "react";
import { User, Globe, MessageCircle, ArrowUpRight, Play, Image, Utensils, Smartphone, Percent, Wifi, Music, ShoppingBag, FileText, List, Briefcase, Zap } from "lucide-react";
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
    bioColor, usernameColor, plan, links = [], products = [], addons = []
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
        return {
          bg: isDark ? "bg-black text-zinc-200" : "bg-zinc-50 text-zinc-800",
          cardBg: isDark ? "bg-zinc-900/40 border-zinc-800" : "bg-white border-zinc-200 shadow-md",
          glowText: isDark ? "text-white" : "text-zinc-900 font-bold",
          avatarBg: "from-zinc-400 to-zinc-500",
          btnClass: isDark ? "bg-zinc-900/50 border border-zinc-800 text-zinc-200" : "bg-white border border-zinc-200 text-zinc-700"
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
  let scopedCss = customCss 
    ? customCss
        .replace(/body/g, `#${wrapperId}`)
        .replace(/\.profile-card/g, `#${wrapperId} .profile-card`)
        .replace(/\.btn-link/g, `#${wrapperId} .btn-link`)
        .replace(/\.link-item/g, `#${wrapperId} .link-item`)
        .replace(/height\s*:\s*100vh/g, 'min-height: 100vh')
    : null;

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
    scopedCss += `\n#${wrapperId} h1, #${wrapperId} .profile-card h1 { font-size: 1.25rem !important; line-height: 1.2 !important; word-break: break-all !important; margin: 0 !important; padding: 0 !important; }`;
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
        <div className={`profile-card p-6 w-full rounded-[2.5rem] border text-center backdrop-blur-md flex flex-col items-center gap-4 ${currentStyles.cardBg}`} style={{ position: 'relative', height: 'auto', minHeight: 'fit-content' }}>
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

              const dynamicBlockClass = `link-item btn-link ${!link.bgColor ? currentStyles.btnClass : ""} ${!link.borderRadius ? (theme === "brutalism" || theme === "terminal" ? "rounded-none" : "rounded-2xl") : ""} ${link.animation || ""} ${link.fontWeight || "font-bold"}`;

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
                <a key={link.id} href={isCompactMode ? "#" : `/click/${link.id}`} target={isCompactMode ? "_self" : "_blank"} rel="noopener noreferrer" style={customStyle} className={`flex items-center justify-between p-3 text-sm transition-all hover:scale-[1.02] ${dynamicBlockClass}`}>
                  <div className="flex items-center gap-3 flex-1 overflow-hidden">
                    <div className="h-8 w-8 rounded-full bg-black/10 flex items-center justify-center shrink-0 border border-white/5">
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
      </main>

      {(plan !== "CREATOR" && plan !== "PRO_BUSINESS" && !isCompactMode) && (
        <footer className="text-center text-[10px] text-zinc-600 uppercase tracking-widest font-black py-4 relative z-10">
          Powered by CREATOR.HUB
        </footer>
      )}
    </div>
  );
}
