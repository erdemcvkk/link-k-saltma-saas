"use client";

import React from "react";
import { 
  Globe, 
  MessageCircle, 
  Mail, 
  CheckCircle2,
  ArrowUpRight,
  ExternalLink
} from "lucide-react";

export interface PremiumLink {
  id: string;
  title: string;
  url: string;
  iconUrl?: string;
  animation?: "pulse" | "bounce" | "none";
}

export interface PremiumSocialLink {
  id: string;
  platformName: "instagram" | "twitter" | "youtube" | "linkedin" | "github" | "whatsapp" | "email" | "website";
  url: string;
}

interface PremiumProfileModuleProps {
  avatarUrl?: string;
  username?: string;
  bio?: string;
  config?: any;
}

const GRADIENT_PRESETS: { [key: string]: string } = {
  "slate-dark": "bg-gradient-to-tr from-slate-950 via-zinc-900 to-slate-900",
  "royal-purple": "bg-gradient-to-br from-purple-950 via-slate-900 to-indigo-950",
  "emerald-forest": "bg-gradient-to-tr from-emerald-950 via-stone-900 to-zinc-950",
  "sunset-fire": "bg-gradient-to-br from-rose-950 via-zinc-900 to-slate-950",
  "neon-blue": "bg-gradient-to-tr from-cyan-950 via-slate-950 to-blue-950"
};

export default function PremiumProfileModule({
  avatarUrl,
  username = "creative",
  bio,
  config = {}
}: PremiumProfileModuleProps) {
  // Config variables
  const displayName = config.displayName || "@" + username;
  const bioText = config.bioText || bio || "Premium Link Hub'a hoş geldiniz.";
  const showVerifiedBadge = !!config.showVerifiedBadge;
  const bgGradientKey = config.bgGradient || "slate-dark";
  const bgClass = GRADIENT_PRESETS[bgGradientKey] || GRADIENT_PRESETS["slate-dark"];

  // Premium links
  const links: PremiumLink[] = config.premiumLinks || [
    {
      id: "pl1",
      title: "🔥 En Son YouTube Videomu İzleyin",
      url: "https://youtube.com",
      animation: "pulse"
    },
    {
      id: "pl2",
      title: "📚 E-Kitap & Şablon Mağazam",
      url: "https://google.com",
      animation: "bounce"
    },
    {
      id: "pl3",
      title: "💼 İş Birlikleri & İletişim Formu",
      url: "https://linkedin.com",
      animation: "none"
    }
  ];

  // Social Links
  const socialLinks: PremiumSocialLink[] = config.socialLinks || [
    { id: "s1", platformName: "instagram", url: "https://instagram.com" },
    { id: "s2", platformName: "twitter", url: "https://twitter.com" },
    { id: "s3", platformName: "youtube", url: "https://youtube.com" }
  ];

  const getSocialIcon = (platform: string) => {
    const cls = "w-[18px] h-[18px]";
    switch (platform.toLowerCase()) {
      case "instagram": return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
        </svg>
      );
      case "twitter": return (
        <svg className={cls} viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      );
      case "youtube": return (
        <svg className={cls} viewBox="0 0 24 24" fill="currentColor">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
        </svg>
      );
      case "linkedin": return (
        <svg className={cls} viewBox="0 0 24 24" fill="currentColor">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
      );
      case "github": return (
        <svg className={cls} viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
        </svg>
      );
      case "whatsapp": return <MessageCircle size={18} />;
      case "email": return <Mail size={18} />;
      default: return <Globe size={18} />;
    }
  };

  const getAnimationClass = (anim?: string) => {
    if (anim === "pulse") return "animate-pulse shadow-[0_0_15px_rgba(255,255,255,0.15)]";
    if (anim === "bounce") return "animate-bounce";
    return "";
  };

  return (
    <div className={`w-full min-h-screen h-full overflow-x-hidden flex flex-col font-sans relative pb-24 text-white px-6 pt-12 ${bgClass}`}>
      
      {/* ── PROFILE HEADER CARD ── */}
      <div className="flex flex-col items-center text-center space-y-4 mb-10 mt-4">
        {/* Glowing Avatar */}
        <div className="relative group">
          <div className="absolute inset-0 rounded-full bg-white/10 blur-md group-hover:bg-white/20 transition-all duration-300 scale-105" />
          <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-white/20 shadow-2xl relative z-10 bg-zinc-900 flex items-center justify-center shrink-0">
            {avatarUrl || config.avatarUrl ? (
              <img 
                src={config.avatarUrl || avatarUrl} 
                alt={displayName} 
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-xl font-extrabold tracking-widest text-white/70">VIP</span>
            )}
          </div>
        </div>

        {/* Display Name + Verified Check */}
        <div className="flex items-center justify-center gap-1.5 z-10">
          <h2 className="text-xl font-extrabold tracking-tight text-white">{displayName}</h2>
          {showVerifiedBadge && (
            <CheckCircle2 size={16} className="text-sky-400 fill-sky-400/10 shrink-0" />
          )}
        </div>

        {/* Bio Text */}
        <p className="text-xs text-white/70 font-medium leading-relaxed max-w-[85%] z-10">
          {bioText}
        </p>
      </div>

      {/* ── PREMIUM GLASSMORPHIC LINKS ── */}
      <div className="flex-1 w-full max-w-md mx-auto space-y-4 z-10">
        {links.map((link) => {
          const animClass = getAnimationClass(link.animation);
          return (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`w-full py-4 px-5 rounded-2xl bg-white/10 backdrop-blur-lg border border-white/15 flex items-center justify-between shadow-lg hover:bg-white/15 hover:border-white/25 hover:scale-[1.02] active:scale-95 transition-all duration-300 group ${animClass}`}
            >
              <div className="flex items-center gap-4 min-w-0">
                {link.iconUrl ? (
                  <div className="w-10 h-10 rounded-full overflow-hidden border border-white/10 shrink-0 bg-white/5 flex items-center justify-center">
                    <img src={link.iconUrl} alt="" className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-full border border-white/10 bg-white/5 flex items-center justify-center shrink-0">
                    <ExternalLink size={14} className="text-white/60 group-hover:text-white transition-colors" />
                  </div>
                )}
                <span className="text-xs md:text-sm font-bold tracking-wide text-white truncate text-left">
                  {link.title}
                </span>
              </div>
              <ArrowUpRight size={16} className="text-white/50 group-hover:text-white transition-colors shrink-0 ml-2" />
            </a>
          );
        })}
      </div>

      {/* ── MINIMALIST SOCIAL GRID ── */}
      {socialLinks.length > 0 && (
        <div className="w-full max-w-xs mx-auto mt-12 pb-6 z-10">
          <div className="flex flex-wrap items-center justify-center gap-4">
            {socialLinks.map((social) => (
              <a
                key={social.id}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 hover:border-white/20 flex items-center justify-center text-white/70 hover:text-white transition-all shadow-sm active:scale-90"
                title={social.platformName}
              >
                {getSocialIcon(social.platformName)}
              </a>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
