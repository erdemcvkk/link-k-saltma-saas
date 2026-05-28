const fs = require('fs');
const path = 'src/components/storefront-preview.tsx';

const content = `
"use client";

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

export type StoreThemeType = "dark-drill" | "glassmorphism" | "minimalist" | "vibrant-pop" | "classic";

interface StorefrontPreviewProps {
  theme: StoreThemeType;
  products: DummyProduct[];
  storeTitle?: string; // We'll use this as fallback if no username
  storeCoverUrl?: string; // Used as banner
  username?: string;
  bio?: string;
  avatarUrl?: string | null;
}

export default function StorefrontPreview({ theme, products, storeTitle = "Digital Store", storeCoverUrl, username, bio, avatarUrl }: StorefrontPreviewProps) {
  const [layout, setLayout] = useState<"GRID" | "LIST">("GRID");
  const [clickedItem, setClickedItem] = useState<string | null>(null);

  const handlePurchase = (id: string) => {
    setClickedItem(id);
    setTimeout(() => setClickedItem(null), 300);
  };

  // Theme Engine
  const getThemeStyles = () => {
    switch (theme) {
      case "dark-drill":
        return {
          wrapper: "bg-black text-zinc-100 font-mono",
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
        };
      case "glassmorphism":
        return {
          wrapper: "bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white font-serif",
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
        };
      case "minimalist":
        return {
          wrapper: "bg-white text-zinc-800 font-sans",
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
        };
      case "vibrant-pop":
        return {
          wrapper: "bg-orange-50 text-orange-950 font-sans",
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
        };
      case "classic":
      default:
        return {
          wrapper: "bg-gray-50 text-gray-800 font-sans",
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
        };
    }
  };

  const styles = getThemeStyles();
  const displayName = username || storeTitle;
  const displayBio = bio || (theme === "dark-drill" ? "Müzik Prodüktörü & Tasarımcı" : 
                            theme === "glassmorphism" ? "Dijital Sanatçı" : 
                            theme === "minimalist" ? "Yazar & Danışman" :
                            theme === "vibrant-pop" ? "İçerik Üreticisi" : "Premium Mağaza");

  // Determine if we should show a banner based on the theme rules
  // "Premium Glassmorphism" asks for a blurred banner image.
  // "Minimalist & Clean" explicitly asks for NO banner.
  const shouldShowBanner = theme === "glassmorphism" || theme === "classic";

  return (
    <div className={\`relative w-full h-full overflow-y-auto no-scrollbar \${styles.wrapper}\`}>
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
              <img src={avatarUrl} className="w-full h-full object-cover rounded-inherit" alt={displayName} />
            ) : (
              <div className="w-full h-full bg-zinc-800 flex items-center justify-center rounded-inherit">
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
          <div className="flex gap-1 shrink-0 bg-black/5 rounded-lg p-1">
            <button 
              onClick={() => setLayout("GRID")} 
              className={\`p-1.5 rounded-md \${layout === "GRID" ? "bg-black/10 shadow-sm" : "opacity-50"}\`}
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button 
              onClick={() => setLayout("LIST")} 
              className={\`p-1.5 rounded-md \${layout === "LIST" ? "bg-black/10 shadow-sm" : "opacity-50"}\`}
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
                <h4 className={\`mt-1.5 text-xs leading-tight \${styles.titleColor} \${layout === "LIST" ? "line-clamp-1" : "line-clamp-2"}\`}>
                  {product.title}
                </h4>
              </div>
              <div className={\`mt-3 flex \${layout === "LIST" ? "flex-row items-center justify-between" : "flex-col items-start"} gap-2\`}>
                <span className={\`text-sm \${styles.priceColor}\`}>{product.price}₺</span>
                <button 
                  onClick={() => handlePurchase(product.id)}
                  className={\`w-full \${layout === "LIST" ? "w-auto px-3" : ""} py-2 text-[10px] flex items-center justify-center gap-1.5 \${styles.btnClass} \${
                    clickedItem === product.id ? (theme === "vibrant-pop" ? "" : "scale-95 opacity-80") : ""
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

fs.writeFileSync(path, content.trim() + '\\n');
`;

fs.writeFileSync('rewrite-storefront.js', content);
console.log('Script written');
