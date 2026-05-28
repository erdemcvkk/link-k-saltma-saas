const fs = require('fs');

// ─────────────────────────────────────────────────────────────────
// STEP 1: Add new CSS to globals.css
// ─────────────────────────────────────────────────────────────────
const newCSS = `
/* ═══════════════════════════════════════════════════════════════════
   THEMES 6-10: New Premium Store Themes
   ═══════════════════════════════════════════════════════════════════ */

/* Google Fonts for new themes */
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Lora:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Press+Start+2P&family=Merriweather:ital,wght@0,400;0,700;0,900;1,400&family=Outfit:wght@300;400;500;600;700;800;900&display=swap');

/* Neo-Brutalism button press effect */
.neo-brutal-btn {
  box-shadow: 4px 4px 0px 0px #000;
  transition: transform 0.1s ease, box-shadow 0.1s ease;
}
.neo-brutal-btn:active {
  transform: translate(4px, 4px);
  box-shadow: 0px 0px 0px 0px #000;
}
.neo-brutal-card {
  box-shadow: 6px 6px 0px 0px #000;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}
.neo-brutal-card:hover {
  transform: translate(-2px, -2px);
  box-shadow: 8px 8px 0px 0px #000;
}

/* Organic Blob Avatar Clip Path */
.blob-avatar {
  clip-path: path('M47.5,0 C59.5,0 70.1,4.3 78.1,11.5 C86.7,19.2 92.5,30 95.2,42.5 C97.7,54 96.8,65.5 92.2,75.5 C87.4,85.9 78.8,93.8 68.5,97.7 C58.3,101.5 47,101.3 37,97.2 C27.2,93.2 19,85.5 13.5,75.5 C8.1,65.8 5.2,54.3 6.5,43.0 C7.9,31.2 13.8,20.5 22.5,12.8 C31.1,5.2 41.5,1.2 47.5,0Z');
  width: 100px;
  height: 100px;
}

/* Retro 8-Bit CRT scanline overlay */
.retro-crt-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    rgba(0,0,0,0) 50%, rgba(0,0,0,0.12) 50%
  );
  background-size: 100% 3px;
  pointer-events: none;
  z-index: 5;
  mix-blend-mode: multiply;
}

/* Retro Grid Floor */
.retro-grid-bg {
  background-image:
    linear-gradient(rgba(0,255,200,0.06) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0,255,200,0.06) 1px, transparent 1px);
  background-size: 20px 20px;
}

/* Retro 8-bit pixel button */
.pixel-btn {
  box-shadow: inset -3px -3px 0px 0px rgba(0,0,0,0.3), 3px 3px 0px 0px rgba(0,0,0,0.5);
  transition: transform 0.05s ease, box-shadow 0.05s ease;
  image-rendering: pixelated;
}
.pixel-btn:active {
  transform: translate(2px, 2px);
  box-shadow: inset 2px 2px 0px 0px rgba(0,0,0,0.3), 0px 0px 0px 0px rgba(0,0,0,0.5);
}

/* Dark Academia vintage frame */
.academia-frame {
  box-shadow:
    inset 0 0 0 2px rgba(180,140,60,0.5),
    inset 0 0 0 4px rgba(120,80,20,0.3),
    0 4px 12px rgba(0,0,0,0.3);
}

/* Parchment texture */
.parchment-bg {
  background-color: #f4ede4;
  background-image:
    radial-gradient(circle at 20% 50%, rgba(180,150,100,0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(160,130,80,0.08) 0%, transparent 50%),
    radial-gradient(circle at 50% 80%, rgba(140,120,80,0.06) 0%, transparent 40%);
}

/* Y2K Holographic iridescent effect */
@keyframes y2kHoloShift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.y2k-holo-ring {
  background: linear-gradient(135deg, #ff6ec7, #7873f5, #4de8f4, #ff6ec7, #ffd700, #ff6ec7);
  background-size: 400% 400%;
  animation: y2kHoloShift 4s ease infinite;
}

.y2k-holo-card {
  background: linear-gradient(135deg, rgba(255,110,199,0.08), rgba(120,115,245,0.08), rgba(77,232,244,0.08));
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255,255,255,0.3);
}

@keyframes y2kShimmer {
  0% { left: -100%; }
  50%, 100% { left: 100%; }
}
.y2k-shimmer::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 60%;
  height: 100%;
  background: linear-gradient(to right, transparent, rgba(255,255,255,0.3) 50%, transparent);
  transform: skewX(-20deg);
  animation: y2kShimmer 3s ease-in-out infinite;
  pointer-events: none;
}

/* Scrollbar hiding utility */
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
`;

let globalsCss = fs.readFileSync('src/app/globals.css', 'utf8');
if (!globalsCss.includes('neo-brutal-btn')) {
  globalsCss += newCSS;
  fs.writeFileSync('src/app/globals.css', globalsCss);
  console.log('✅ globals.css updated with new theme CSS');
} else {
  console.log('⏭️ globals.css already has new theme CSS');
}

// ─────────────────────────────────────────────────────────────────
// STEP 2: Rewrite the entire StorefrontPreview component
// ─────────────────────────────────────────────────────────────────
const storefrontCode = `"use client";

import React, { useState } from "react";
import { ShoppingBag, ChevronRight, Search, LayoutGrid, List, User } from "lucide-react";

export interface DummyProduct {
  id: string;
  title: string;
  type: string;
  price: string;
  imageUrl: string | null;
  description?: string;
}

export type StoreThemeType =
  | "dark-drill" | "glassmorphism" | "minimalist" | "vibrant-pop" | "classic"
  | "neo-brutalism" | "organic-earth" | "retro-arcade" | "dark-academia" | "y2k-holographic";

interface StorefrontPreviewProps {
  theme: StoreThemeType;
  products: DummyProduct[];
  storeTitle?: string;
  storeCoverUrl?: string;
  username?: string;
  bio?: string;
  avatarUrl?: string | null;
}

export default function StorefrontPreview({ theme, products, storeTitle = "Digital Store", storeCoverUrl, username, bio, avatarUrl }: StorefrontPreviewProps) {
  const [layout, setLayout] = useState<"GRID" | "LIST">("GRID");
  const [clickedItem, setClickedItem] = useState<string | null>(null);

  const handlePurchase = (id: string) => {
    setClickedItem(id);
    setTimeout(() => setClickedItem(null), 400);
  };

  const getThemeStyles = () => {
    switch (theme) {
      case "dark-drill":
        return {
          wrapper: "bg-black text-zinc-100",
          wrapperFont: "'JetBrains Mono', monospace",
          headerBg: "bg-black border-b border-red-500/20",
          heroContainer: "flex flex-col items-center justify-center pt-8 pb-6 px-4 text-center",
          avatarWrapper: "w-24 h-24 mb-4 rounded-none border border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.4)] overflow-hidden",
          nameText: "text-white font-black tracking-tighter uppercase text-xl drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]",
          bioText: "text-zinc-400 text-xs mt-2 max-w-[250px]",
          searchBg: "bg-zinc-900 border border-zinc-800 focus-within:border-red-500/50 rounded-none",
          cardBg: "bg-zinc-950 border border-zinc-800 rounded-none hover:border-red-500/50 hover:shadow-[0_0_15px_rgba(239,68,68,0.15)] transition-all",
          titleColor: "text-white font-bold",
          priceColor: "text-red-500 font-black",
          btnClass: "bg-transparent border border-red-500 text-red-500 hover:bg-red-500 hover:text-white rounded-none uppercase font-black transition-all",
          badgeClass: "bg-red-500/10 text-red-400 border border-red-500/20 rounded-none",
          extraOverlay: null,
        };
      case "glassmorphism":
        return {
          wrapper: "bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white",
          wrapperFont: "'Playfair Display', serif",
          headerBg: "bg-white/5 backdrop-blur-md border-b border-white/10 relative",
          heroContainer: "flex flex-col items-center justify-center pt-10 pb-6 px-4 text-center relative z-10",
          avatarWrapper: "w-24 h-24 mb-4 rounded-full border-2 border-white/40 shadow-[0_0_15px_rgba(255,255,255,0.2)] backdrop-blur-sm overflow-hidden p-0.5",
          nameText: "text-white font-bold tracking-wide drop-shadow-md text-xl",
          bioText: "text-purple-200 text-xs mt-2 max-w-[250px]",
          searchBg: "bg-white/5 border border-white/10 focus-within:bg-white/10 focus-within:border-white/20 rounded-2xl backdrop-blur-md",
          cardBg: "bg-white/5 border border-white/10 rounded-3xl backdrop-blur-md hover:bg-white/10 transition-all",
          titleColor: "text-purple-100 font-bold",
          priceColor: "text-white font-bold tracking-wider",
          btnClass: "bg-white/10 border border-white/20 text-white hover:bg-white/20 hover:-translate-y-0.5 rounded-full backdrop-blur-md transition-all shadow-[0_4px_15px_rgba(0,0,0,0.1)]",
          badgeClass: "bg-purple-500/20 text-purple-200 border border-purple-500/30 rounded-full",
          extraOverlay: null,
        };
      case "minimalist":
        return {
          wrapper: "bg-white text-zinc-800",
          wrapperFont: "'Inter', sans-serif",
          headerBg: "bg-white border-b border-zinc-100",
          heroContainer: "flex flex-col items-center justify-center pt-10 pb-6 px-4 text-center",
          avatarWrapper: "w-24 h-24 mb-4 rounded-full overflow-hidden border-0 shadow-none",
          nameText: "text-zinc-900 font-medium tracking-tight text-xl",
          bioText: "text-zinc-500 text-sm mt-1 max-w-[250px]",
          searchBg: "bg-zinc-50 border border-transparent focus-within:border-zinc-200 focus-within:bg-white rounded-lg",
          cardBg: "bg-white rounded-lg hover:shadow-md border border-transparent transition-all shadow-sm",
          titleColor: "text-zinc-800 font-medium",
          priceColor: "text-zinc-900 font-medium",
          btnClass: "bg-zinc-900 text-white hover:bg-zinc-800 rounded-lg transition-colors font-medium",
          badgeClass: "bg-zinc-100 text-zinc-600 border border-zinc-100 rounded-md",
          extraOverlay: null,
        };
      case "vibrant-pop":
        return {
          wrapper: "bg-orange-50 text-orange-950",
          wrapperFont: "'Outfit', sans-serif",
          headerBg: "bg-orange-100/50 border-b border-orange-200",
          heroContainer: "flex flex-col items-center justify-center pt-10 pb-6 px-4 text-center",
          avatarWrapper: "w-24 h-24 mb-4 rounded-full overflow-hidden p-1 bg-gradient-to-tr from-orange-500 via-pink-500 to-purple-500 shadow-xl shadow-orange-500/20",
          nameText: "text-orange-900 font-black tracking-tight text-xl",
          bioText: "text-orange-700 text-sm mt-1 font-medium max-w-[250px]",
          searchBg: "bg-white border-2 border-orange-200 focus-within:border-orange-400 rounded-3xl",
          cardBg: "bg-white border-2 border-orange-100 rounded-3xl hover:-translate-y-1 hover:shadow-xl shadow-orange-900/5 transition-all duration-300",
          titleColor: "text-orange-950 font-bold",
          priceColor: "text-orange-600 font-black text-lg",
          btnClass: "bg-orange-500 text-white hover:bg-orange-400 rounded-2xl font-bold animate-jelly shadow-lg shadow-orange-500/30",
          badgeClass: "bg-orange-100 text-orange-600 border-none rounded-xl font-bold",
          extraOverlay: null,
        };
      // ─────── NEW THEMES 6–10 ───────
      case "neo-brutalism":
        return {
          wrapper: "bg-[#caff4a] text-black",
          wrapperFont: "'Space Grotesk', sans-serif",
          headerBg: "bg-[#caff4a] border-b-4 border-black",
          heroContainer: "flex flex-col items-center justify-center pt-8 pb-5 px-4 text-center",
          avatarWrapper: "w-24 h-24 mb-4 rounded-none border-4 border-black overflow-hidden shadow-[4px_4px_0px_0px_#000]",
          nameText: "text-black font-black uppercase text-xl tracking-tight",
          bioText: "text-black/60 text-xs mt-1 font-medium max-w-[250px]",
          searchBg: "bg-white border-2 border-black rounded-none shadow-[3px_3px_0px_0px_#000]",
          cardBg: "bg-white border-2 border-black rounded-none neo-brutal-card",
          titleColor: "text-black font-bold",
          priceColor: "text-black font-black text-lg",
          btnClass: "bg-black text-[#caff4a] hover:bg-zinc-800 rounded-none font-black uppercase neo-brutal-btn",
          badgeClass: "bg-black text-[#caff4a] rounded-none font-bold border-none",
          extraOverlay: null,
        };
      case "organic-earth":
        return {
          wrapper: "bg-[#f5efe6] text-[#5c4033]",
          wrapperFont: "'Lora', serif",
          headerBg: "bg-[#f5efe6] border-b border-[#e0d5c4]",
          heroContainer: "flex flex-col items-center justify-center pt-10 pb-6 px-4 text-center",
          avatarWrapper: "w-[100px] h-[100px] mb-4 blob-avatar overflow-hidden border-0",
          nameText: "text-[#5c4033] font-semibold text-xl tracking-tight",
          bioText: "text-[#8b7355] text-sm mt-1 italic max-w-[250px]",
          searchBg: "bg-[#ede5d8] border border-[#d9cebf] focus-within:border-[#b5a48f] rounded-full",
          cardBg: "bg-[#ede5d8] rounded-2xl border-none hover:bg-[#e8dfd0] transition-colors shadow-none",
          titleColor: "text-[#5c4033] font-semibold",
          priceColor: "text-[#8b5e3c] font-bold",
          btnClass: "bg-[#8fbc6a] text-white hover:bg-[#7aab55] rounded-full font-medium transition-colors",
          badgeClass: "bg-[#e0d5c4] text-[#8b7355] border-none rounded-full",
          extraOverlay: null,
        };
      case "retro-arcade":
        return {
          wrapper: "bg-[#0a0a2e] text-[#00ffc8] retro-grid-bg",
          wrapperFont: "'Press Start 2P', monospace",
          headerBg: "bg-[#0a0a2e]/90 border-b-2 border-[#00ffc8]/30 relative",
          heroContainer: "flex flex-col items-center justify-center pt-8 pb-5 px-4 text-center relative z-10",
          avatarWrapper: "w-24 h-24 mb-4 rounded-none border-2 border-[#00ffc8] overflow-hidden shadow-[0_0_12px_rgba(0,255,200,0.4)] p-1 bg-[#0a0a2e]",
          nameText: "text-[#00ffc8] font-normal text-xs uppercase tracking-widest drop-shadow-[0_0_6px_rgba(0,255,200,0.6)]",
          bioText: "text-[#7a8ba5] text-[8px] mt-2 max-w-[250px] uppercase tracking-wider",
          searchBg: "bg-[#111145] border border-[#00ffc8]/30 focus-within:border-[#00ffc8] rounded-none",
          cardBg: "bg-[#111145] border border-[#00ffc8]/20 rounded-none hover:border-[#00ffc8]/60 hover:shadow-[0_0_10px_rgba(0,255,200,0.1)] transition-all",
          titleColor: "text-white font-normal text-[9px]",
          priceColor: "text-[#ffcc00] font-normal",
          btnClass: "bg-[#00ffc8] text-[#0a0a2e] hover:bg-[#66ffd9] rounded-none font-normal pixel-btn uppercase",
          badgeClass: "bg-[#00ffc8]/10 text-[#00ffc8] border border-[#00ffc8]/30 rounded-none",
          extraOverlay: "retro-crt-overlay",
        };
      case "dark-academia":
        return {
          wrapper: "bg-[#1a1a1a] text-[#e8dcc8]",
          wrapperFont: "'Merriweather', serif",
          headerBg: "bg-[#1a1a1a] border-b border-[#3a3020]",
          heroContainer: "flex flex-col items-center justify-center pt-10 pb-6 px-4 text-center",
          avatarWrapper: "w-24 h-24 mb-4 rounded-sm overflow-hidden academia-frame",
          nameText: "text-[#e8dcc8] font-bold text-xl tracking-tight italic",
          bioText: "text-[#a89878] text-xs mt-2 italic max-w-[250px]",
          searchBg: "bg-[#2a2218] border border-[#4a3a28] focus-within:border-[#b4963c] rounded-sm",
          cardBg: "bg-[#2a2218] rounded-sm border border-[#3a3020] hover:border-[#b4963c]/40 transition-all shadow-md",
          titleColor: "text-[#e8dcc8] font-bold",
          priceColor: "text-[#b4963c] font-bold",
          btnClass: "bg-[#b4963c] text-[#1a1a1a] hover:bg-[#c8a84e] rounded-sm font-bold transition-colors shadow-sm",
          badgeClass: "bg-[#b4963c]/15 text-[#b4963c] border border-[#b4963c]/30 rounded-sm",
          extraOverlay: null,
        };
      case "y2k-holographic":
        return {
          wrapper: "bg-gradient-to-br from-[#ffe6f7] via-[#e8e0ff] to-[#d4f7ff] text-[#4a2d6b]",
          wrapperFont: "'Outfit', sans-serif",
          headerBg: "bg-white/40 backdrop-blur-md border-b border-white/50 relative",
          heroContainer: "flex flex-col items-center justify-center pt-10 pb-6 px-4 text-center relative z-10",
          avatarWrapper: "w-24 h-24 mb-4 rounded-full overflow-hidden p-1.5 y2k-holo-ring shadow-xl",
          nameText: "text-transparent bg-clip-text bg-gradient-to-r from-[#ff6ec7] via-[#7873f5] to-[#4de8f4] font-extrabold text-xl tracking-tight",
          bioText: "text-[#8a6aad] text-sm mt-1 font-medium max-w-[250px]",
          searchBg: "bg-white/50 border border-white/60 focus-within:border-[#ff6ec7]/50 rounded-full backdrop-blur-sm",
          cardBg: "y2k-holo-card rounded-3xl hover:-translate-y-1 hover:shadow-xl transition-all duration-300 relative overflow-hidden y2k-shimmer",
          titleColor: "text-[#4a2d6b] font-bold",
          priceColor: "text-[#ff6ec7] font-extrabold text-lg",
          btnClass: "bg-gradient-to-r from-[#ff6ec7] to-[#7873f5] text-white hover:opacity-90 rounded-full font-bold transition-all shadow-lg shadow-[#ff6ec7]/20",
          badgeClass: "bg-[#ff6ec7]/10 text-[#ff6ec7] border border-[#ff6ec7]/20 rounded-full",
          extraOverlay: null,
        };
      case "classic":
      default:
        return {
          wrapper: "bg-gray-50 text-gray-800",
          wrapperFont: "'Inter', sans-serif",
          headerBg: "bg-white border-b border-gray-200 shadow-sm relative",
          heroContainer: "flex flex-col items-center justify-center pt-10 pb-6 px-4 text-center z-10 relative",
          avatarWrapper: "w-24 h-24 mb-4 rounded-full overflow-hidden border-2 border-white shadow-md",
          nameText: "text-gray-900 font-bold text-xl",
          bioText: "text-gray-600 text-sm mt-1 max-w-[250px]",
          searchBg: "bg-white border border-gray-300 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 rounded-md shadow-sm",
          cardBg: "bg-white border border-gray-200 rounded-xl hover:shadow-md transition-shadow",
          titleColor: "text-gray-900 font-semibold",
          priceColor: "text-blue-600 font-bold",
          btnClass: "bg-blue-600 text-white hover:bg-blue-700 rounded-lg font-medium transition-colors shadow-sm",
          badgeClass: "bg-gray-100 text-gray-600 border border-gray-200 rounded",
          extraOverlay: null,
        };
    }
  };

  const styles = getThemeStyles();
  const displayName = username || storeTitle;

  const defaultBios: Record<string, string> = {
    "dark-drill": "Müzik Prodüktörü & Tasarımcı",
    "glassmorphism": "Dijital Sanatçı",
    "minimalist": "Yazar & Danışman",
    "vibrant-pop": "İçerik Üreticisi",
    "classic": "Güvenilir Satıcı",
    "neo-brutalism": "Full-Stack Geliştirici",
    "organic-earth": "Holistik Sağlık Koçu",
    "retro-arcade": "Indie Oyun Geliştiricisi",
    "dark-academia": "Yazar & Şair",
    "y2k-holographic": "Moda & Lifestyle Influencer",
  };
  const displayBio = bio || defaultBios[theme] || "Premium Mağaza";

  const shouldShowBanner = theme === "glassmorphism" || theme === "classic";

  // Retro theme uses tiny font size for product text
  const isRetro = theme === "retro-arcade";
  const textSizeClass = isRetro ? "text-[8px] leading-tight" : "text-xs leading-tight";
  const priceSizeClass = isRetro ? "text-[10px]" : "text-sm";

  return (
    <div className={\`relative w-full h-full overflow-y-auto no-scrollbar \${styles.wrapper}\`} style={{ fontFamily: styles.wrapperFont }}>
      {/* Extra overlay (CRT for retro) */}
      {styles.extraOverlay && <div className={styles.extraOverlay} />}

      {/* Hero Section */}
      <div className={\`sticky top-0 z-10 \${styles.headerBg}\`}>
        {shouldShowBanner && storeCoverUrl && (
          <div className="absolute inset-0 w-full h-full overflow-hidden z-0">
            <img
              src={storeCoverUrl}
              className={\`w-full h-full object-cover \${theme === "glassmorphism" ? "blur-md scale-110 opacity-40" : "opacity-30"}\`}
              alt="Banner"
            />
            {theme === "glassmorphism" && <div className="absolute inset-0 bg-slate-900/40 mix-blend-multiply" />}
          </div>
        )}

        <div className={styles.heroContainer}>
          <div className={styles.avatarWrapper}>
            {avatarUrl ? (
              <img src={avatarUrl} className="w-full h-full object-cover" alt={displayName} />
            ) : (
              <div className="w-full h-full bg-zinc-800 flex items-center justify-center">
                <User className="w-10 h-10 text-zinc-400" />
              </div>
            )}
          </div>
          <h1 className={styles.nameText}>{displayName}</h1>
          <p className={styles.bioText}>{displayBio}</p>
        </div>

        {/* Controls */}
        <div className="px-4 pb-4 flex gap-2 relative z-10">
          <div className={\`flex-1 flex items-center px-3 py-2 gap-2 \${styles.searchBg} transition-all\`}>
            <Search className="h-4 w-4 opacity-50" />
            <input
              type="text"
              placeholder="Ürünlerde ara..."
              className="bg-transparent border-none outline-none w-full text-xs font-medium placeholder:opacity-50"
            />
          </div>
          <div className={\`flex gap-1 shrink-0 rounded-lg p-1 \${theme === "neo-brutalism" ? "bg-black/10 border border-black" : theme === "retro-arcade" ? "bg-[#111145] border border-[#00ffc8]/20" : "bg-black/5"}\`}>
            <button
              onClick={() => setLayout("GRID")}
              className={\`p-1.5 rounded-md \${layout === "GRID" ? (theme === "neo-brutalism" ? "bg-black text-[#caff4a]" : "bg-black/10 shadow-sm") : "opacity-50"}\`}
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setLayout("LIST")}
              className={\`p-1.5 rounded-md \${layout === "LIST" ? (theme === "neo-brutalism" ? "bg-black text-[#caff4a]" : "bg-black/10 shadow-sm") : "opacity-50"}\`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Product Feed */}
      <div className={\`p-4 \${layout === "GRID" ? "grid grid-cols-2 gap-3" : "flex flex-col gap-3"}\`}>
        {products.map((product) => (
          <div
            key={product.id}
            className={\`overflow-hidden flex \${layout === "LIST" ? "flex-row items-center gap-4 p-3" : "flex-col"} \${styles.cardBg}\`}
          >
            {product.imageUrl && (
              <div className={\`\${layout === "LIST" ? "w-16 h-16 shrink-0 rounded-lg" : "w-full h-28"} relative overflow-hidden bg-black/5\`}>
                <img src={product.imageUrl} className="w-full h-full object-cover" alt={product.title} />
              </div>
            )}
            <div className={\`\${layout === "LIST" ? "flex-1" : "p-3"} flex flex-col justify-between h-full\`}>
              <div>
                <span className={\`px-1.5 py-0.5 text-[8px] uppercase tracking-wider \${styles.badgeClass}\`}>
                  {product.type}
                </span>
                <h4 className={\`mt-1.5 \${textSizeClass} \${styles.titleColor} \${layout === "LIST" ? "line-clamp-1" : "line-clamp-2"}\`}>
                  {product.title}
                </h4>
              </div>
              <div className={\`mt-3 flex \${layout === "LIST" ? "flex-row items-center justify-between" : "flex-col items-start"} gap-2\`}>
                <span className={\`\${priceSizeClass} \${styles.priceColor}\`}>{product.price}₺</span>
                <button
                  onClick={() => handlePurchase(product.id)}
                  className={\`w-full \${layout === "LIST" ? "w-auto px-3" : ""} py-2 text-[10px] flex items-center justify-center gap-1.5 \${styles.btnClass} \${
                    clickedItem === product.id ? "scale-95 opacity-80" : ""
                  }\`}
                >
                  <ShoppingBag className="h-3 w-3" />
                  Satın Al
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
`;

fs.writeFileSync('src/components/storefront-preview.tsx', storefrontCode);
console.log('✅ storefront-preview.tsx rewritten with 10 themes');

// ─────────────────────────────────────────────────────────────────
// STEP 3: Rewrite the magaza-temalari showcase page
// ─────────────────────────────────────────────────────────────────
const showcasePage = `import React from "react";
import StorefrontPreview, { StoreThemeType, DummyProduct } from "@/components/storefront-preview";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Mağaza Temaları Showcase",
};

interface ThemeShowcaseData {
  id: StoreThemeType;
  name: string;
  desc: string;
  color: string;
  username: string;
  bio: string;
  avatarUrl: string;
  coverUrl?: string;
  products: DummyProduct[];
}

const THEMES: ThemeShowcaseData[] = [
  // ── Original 5 ──
  {
    id: "dark-drill",
    name: "Dark Drill / Cyberpunk",
    desc: "Beatmaker & Oyuncular İçin",
    color: "bg-red-500",
    username: "@darkbeat_prod",
    bio: "Müzik Prodüktörü & Tasarımcı",
    avatarUrl: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=200&q=80",
    products: [
      { id: "dd1", title: "Karanlık Drill Beat Paketi", type: "Beat", price: "499", imageUrl: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=500&q=80" },
      { id: "dd2", title: "808 Bass Loop Kit", type: "Müzik", price: "350", imageUrl: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=500&q=80" },
      { id: "dd3", title: "Trap Vocal Preset", type: "Preset", price: "200", imageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500&q=80" },
      { id: "dd4", title: "FL Studio Şablon Paketi", type: "Şablon", price: "650", imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=500&q=80" },
    ],
  },
  {
    id: "glassmorphism",
    name: "Premium Glassmorphism",
    desc: "Tasarımcılar & Sanatçılar İçin",
    color: "bg-purple-500",
    username: "@artisan.studio",
    bio: "Dijital Sanatçı & Fotoğrafçı",
    avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&q=80",
    coverUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1000&q=80",
    products: [
      { id: "gm1", title: "Obsidian Lightroom Presetleri", type: "Preset", price: "300", imageUrl: "https://images.unsplash.com/photo-1554046920-90dcac024a13?w=500&q=80" },
      { id: "gm2", title: "Soyut Sanat Duvar Kağıdı Seti", type: "Tasarım", price: "150", imageUrl: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=500&q=80" },
      { id: "gm3", title: "Moody Film LUT Paketi", type: "Video", price: "450", imageUrl: "https://images.unsplash.com/photo-1533628635777-112b2239b1c7?w=500&q=80" },
      { id: "gm4", title: "Minimalist Logo Şablonu", type: "Tasarım", price: "500", imageUrl: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=500&q=80" },
    ],
  },
  {
    id: "minimalist",
    name: "Minimalist & Clean",
    desc: "Yazarlar & Danışmanlar İçin",
    color: "bg-zinc-800",
    username: "@coach.mehmet",
    bio: "Yazar & Kariyer Danışmanı",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80",
    products: [
      { id: "mn1", title: "1 Saatlik Birebir Danışmanlık", type: "Hizmet", price: "850", imageUrl: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=500&q=80" },
      { id: "mn2", title: "Minimalist Notion Şablonu", type: "Şablon", price: "150", imageUrl: "https://images.unsplash.com/photo-1611224885990-ab7363d1f2a9?w=500&q=80" },
      { id: "mn3", title: "E-Kitap: Üretkenlik Rehberi", type: "E-Kitap", price: "120", imageUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&q=80" },
      { id: "mn4", title: "Haftalık Planlayıcı PDF", type: "Şablon", price: "75", imageUrl: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=500&q=80" },
    ],
  },
  {
    id: "vibrant-pop",
    name: "Vibrant Creator Pop",
    desc: "Influencer'lar & Yayıncılar İçin",
    color: "bg-orange-500",
    username: "@creative.zeynep",
    bio: "İçerik Üreticisi & YouTuber",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80",
    products: [
      { id: "vp1", title: "Video Düzenleme Masterclass'ı", type: "Kurs", price: "750", imageUrl: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=500&q=80" },
      { id: "vp2", title: "Sosyal Medya İçerik Takvimi", type: "Şablon", price: "200", imageUrl: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=500&q=80" },
      { id: "vp3", title: "Canva Tasarım Kit'i", type: "Tasarım", price: "350", imageUrl: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=500&q=80" },
      { id: "vp4", title: "Podcast Intro Müzikleri", type: "Müzik", price: "180", imageUrl: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=500&q=80" },
    ],
  },
  {
    id: "classic",
    name: "Classic E-Commerce",
    desc: "Güven Odaklı Satıcılar İçin",
    color: "bg-blue-500",
    username: "@pixelcraft.design",
    bio: "Premium Dijital Ürün Mağazası",
    avatarUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&q=80",
    coverUrl: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1000&q=80",
    products: [
      { id: "cl1", title: "Premium UX/UI Kit", type: "Tasarım", price: "900", imageUrl: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=500&q=80" },
      { id: "cl2", title: "E-Ticaret Figma Şablonu", type: "Şablon", price: "600", imageUrl: "https://images.unsplash.com/photo-1559028012-481c04fa702d?w=500&q=80" },
      { id: "cl3", title: "İkon Paketi (500+ Adet)", type: "Asset", price: "250", imageUrl: "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=500&q=80" },
      { id: "cl4", title: "Web Sitesi Wireframe Seti", type: "Şablon", price: "400", imageUrl: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=500&q=80" },
    ],
  },
  // ── NEW 5 THEMES ──
  {
    id: "neo-brutalism",
    name: "Neo-Brutalism Manifesto",
    desc: "Geliştiriciler & Sokak Modası İçin",
    color: "bg-[#caff4a]",
    username: "@dev.manifest",
    bio: "Full-Stack Geliştirici & Tasarımcı",
    avatarUrl: "https://images.unsplash.com/photo-1599566150163-29194dcabd9c?w=200&q=80",
    products: [
      { id: "nb1", title: "Terminal Temalı VS Code Eklentisi", type: "Eklenti", price: "120", imageUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=500&q=80" },
      { id: "nb2", title: "Mono CLI Dashboard Kit", type: "Araç", price: "350", imageUrl: "https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=500&q=80" },
      { id: "nb3", title: "Brutalist React Komponent Kiti", type: "Kod", price: "500", imageUrl: "https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=500&q=80" },
      { id: "nb4", title: "Neon ASCII Art Paketi", type: "Asset", price: "90", imageUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=500&q=80" },
    ],
  },
  {
    id: "organic-earth",
    name: "Organic Earth",
    desc: "Sağlık Koçları & El Yapımı Ürünler",
    color: "bg-[#8fbc6a]",
    username: "@naturel.coach",
    bio: "Holistik Sağlık & Beslenme Koçu",
    avatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80",
    products: [
      { id: "oe1", title: "Holistik Beslenme Rehberi", type: "E-Kitap", price: "180", imageUrl: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=500&q=80" },
      { id: "oe2", title: "30 Günlük Detoks Programı", type: "Program", price: "450", imageUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&q=80" },
      { id: "oe3", title: "Meditasyon Sesli Rehber", type: "Ses", price: "120", imageUrl: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=500&q=80" },
      { id: "oe4", title: "El Yapımı Sabun Tarifi PDF", type: "Şablon", price: "75", imageUrl: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=500&q=80" },
    ],
  },
  {
    id: "retro-arcade",
    name: "Retro 8-Bit Arcade",
    desc: "Indie Geliştiriciler & Çizerler İçin",
    color: "bg-[#00ffc8]",
    username: "@PIXEL_DEV",
    bio: "Indie Oyun Geliştiricisi",
    avatarUrl: "https://images.unsplash.com/photo-1566753323558-f4e0952af115?w=200&q=80",
    products: [
      { id: "ra1", title: "16-Bit Karakter Sprite Paketi", type: "Asset", price: "250", imageUrl: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=500&q=80" },
      { id: "ra2", title: "Chiptune Müzik Paketi", type: "Müzik", price: "200", imageUrl: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=500&q=80" },
      { id: "ra3", title: "Piksel Sanatı Tileset Seti", type: "Asset", price: "350", imageUrl: "https://images.unsplash.com/photo-1579373903781-fd5c0c30d4cd?w=500&q=80" },
      { id: "ra4", title: "Retro UI Kit (Godot)", type: "Eklenti", price: "400", imageUrl: "https://images.unsplash.com/photo-1535223289827-42f1e9919769?w=500&q=80" },
    ],
  },
  {
    id: "dark-academia",
    name: "Dark Academia & Vintage",
    desc: "Yazarlar & Tarih Üreticileri İçin",
    color: "bg-[#b4963c]",
    username: "@the.quill",
    bio: "Yazar & Şair",
    avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80",
    products: [
      { id: "da1", title: "Gotik Şiir Derlemesi (PDF)", type: "E-Kitap", price: "150", imageUrl: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=500&q=80" },
      { id: "da2", title: "Antik Felsefe Okuma Listesi", type: "Rehber", price: "90", imageUrl: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=500&q=80" },
      { id: "da3", title: "Daktilo Yazı Fontu Koleksiyonu", type: "Font", price: "200", imageUrl: "https://images.unsplash.com/photo-1504691342899-4d92b50853e1?w=500&q=80" },
      { id: "da4", title: "Vintage Kağıt Dokuları Paketi", type: "Asset", price: "120", imageUrl: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=500&q=80" },
    ],
  },
  {
    id: "y2k-holographic",
    name: "Y2K Holographic",
    desc: "Moda Influencer'ları & Pop Sanatçıları",
    color: "bg-gradient-to-r from-[#ff6ec7] to-[#7873f5]",
    username: "@glitter.queen",
    bio: "Moda & Lifestyle Influencer",
    avatarUrl: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=200&q=80",
    products: [
      { id: "y1", title: "2000'ler Nostalji Fotoğraf Filtreleri", type: "Filtre", price: "200", imageUrl: "https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=500&q=80" },
      { id: "y2", title: "Holografik Sticker Paketi", type: "Tasarım", price: "120", imageUrl: "https://images.unsplash.com/photo-1550684376-efcbd6e3f031?w=500&q=80" },
      { id: "y3", title: "Y2K Aesthetic Preset Seti", type: "Preset", price: "300", imageUrl: "https://images.unsplash.com/photo-1618172193622-10473b66bce1?w=500&q=80" },
      { id: "y4", title: "Candy Pop Müzik Jingle'ları", type: "Müzik", price: "180", imageUrl: "https://images.unsplash.com/photo-1563396983906-b3795482a59a?w=500&q=80" },
    ],
  },
];

export default function StoreThemesShowcase() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans selection:bg-rose-500/30">
      <nav className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-[1800px] mx-auto px-6 h-20 flex items-center justify-between">
          <div>
            <h1 className="font-black text-2xl tracking-tighter text-white">
              Vitrin<span className="text-rose-500">.Temaları</span>
            </h1>
            <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mt-1">10 Premium Mağaza Tasarım Konsepti</p>
          </div>
          <Link href="/dashboard" className="flex items-center gap-2 text-sm font-bold text-zinc-400 hover:text-white transition-colors">
            <ArrowLeft className="h-4 w-4" /> Panele Dön
          </Link>
        </div>
      </nav>

      <main className="max-w-[1800px] mx-auto px-6 py-12">
        <div className="flex overflow-x-auto pb-12 gap-10 snap-x snap-mandatory no-scrollbar">
          {THEMES.map((theme) => (
            <div key={theme.id} className="snap-center shrink-0 flex flex-col items-center">

              <div className="text-center mb-8 h-20 flex flex-col items-center justify-end">
                <div className={\`w-3 h-3 rounded-full mb-3 \${theme.color} animate-pulse\`} />
                <h2 className="text-2xl font-black text-white mb-1">{theme.name}</h2>
                <p className="text-sm font-medium text-zinc-400">{theme.desc}</p>
              </div>

              {/* Phone Mockup Frame */}
              <div className="relative w-[340px] h-[680px] bg-zinc-900 rounded-[3rem] p-3 shadow-2xl border-4 border-zinc-800 overflow-hidden shrink-0 group">
                <div className="absolute top-0 inset-x-0 h-7 bg-zinc-900 z-20 rounded-b-3xl w-[40%] mx-auto shadow-sm" />

                <div className="relative w-full h-full bg-[#f8f9fa] rounded-[2rem] overflow-hidden">
                  <StorefrontPreview
                    theme={theme.id}
                    products={theme.products}
                    storeTitle={theme.username}
                    username={theme.username}
                    bio={theme.bio}
                    avatarUrl={theme.avatarUrl}
                    storeCoverUrl={theme.coverUrl}
                  />
                </div>
              </div>

            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
`;

fs.writeFileSync('src/app/magaza-temalari/page.tsx', showcasePage);
console.log('✅ magaza-temalari/page.tsx rewritten with 10 themes');

// ─────────────────────────────────────────────────────────────────
// STEP 4: Update dashboard theme dropdown to include new themes
// ─────────────────────────────────────────────────────────────────
let dashboardClient = fs.readFileSync('src/app/(dashboard)/dashboard/dashboard-client.tsx', 'utf8');

// Find and replace the theme select options
const oldOptions = `<option value="dark-drill">Dark Drill / Cyberpunk</option>
                          <option value="glassmorphism">Premium Glassmorphism</option>
                          <option value="minimalist">Minimalist & Clean</option>
                          <option value="vibrant-pop">Vibrant Creator Pop</option>
                          <option value="classic">Classic E-Commerce</option>`;

const newOptions = `<option value="dark-drill">Dark Drill / Cyberpunk</option>
                          <option value="glassmorphism">Premium Glassmorphism</option>
                          <option value="minimalist">Minimalist & Clean</option>
                          <option value="vibrant-pop">Vibrant Creator Pop</option>
                          <option value="classic">Classic E-Commerce</option>
                          <option value="neo-brutalism">Neo-Brutalism Manifesto</option>
                          <option value="organic-earth">Organic Earth</option>
                          <option value="retro-arcade">Retro 8-Bit Arcade</option>
                          <option value="dark-academia">Dark Academia & Vintage</option>
                          <option value="y2k-holographic">Y2K Holographic</option>`;

if (dashboardClient.includes(oldOptions)) {
  dashboardClient = dashboardClient.replace(oldOptions, newOptions);
  fs.writeFileSync('src/app/(dashboard)/dashboard/dashboard-client.tsx', dashboardClient);
  console.log('✅ dashboard-client.tsx theme dropdown updated');
} else {
  console.log('⚠️ Could not find exact dropdown match in dashboard-client.tsx, searching...');
  // Try a simpler replacement
  if (dashboardClient.includes('<option value="classic">Classic E-Commerce</option>') && !dashboardClient.includes('Neo-Brutalism')) {
    dashboardClient = dashboardClient.replace(
      '<option value="classic">Classic E-Commerce</option>',
      `<option value="classic">Classic E-Commerce</option>
                          <option value="neo-brutalism">Neo-Brutalism Manifesto</option>
                          <option value="organic-earth">Organic Earth</option>
                          <option value="retro-arcade">Retro 8-Bit Arcade</option>
                          <option value="dark-academia">Dark Academia & Vintage</option>
                          <option value="y2k-holographic">Y2K Holographic</option>`
    );
    fs.writeFileSync('src/app/(dashboard)/dashboard/dashboard-client.tsx', dashboardClient);
    console.log('✅ dashboard-client.tsx theme dropdown updated (fallback)');
  } else {
    console.log('⏭️ dropdown already updated or not found');
  }
}

console.log('\\n🎉 All 5 new themes added successfully!');
