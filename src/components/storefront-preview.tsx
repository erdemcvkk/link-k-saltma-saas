"use client";

import React, { useState, useRef } from "react";
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
 | "neo-brutalism" | "organic-earth" | "retro-arcade" | "dark-academia" | "y2k-holographic" | "premium-creator" | "premium-video";

interface StorefrontPreviewProps {
 theme: StoreThemeType;
 products: DummyProduct[];
 storeTitle?: string;
 storeCoverUrl?: string;
 username?: string;
 bio?: string;
 avatarUrl?: string | null;
 onProductClick?: (id: string) => void;
 buyButtonText?: string;
}

export default function StorefrontPreview({ theme, products, storeTitle = "Digital Store", storeCoverUrl, username, bio, avatarUrl, onProductClick, buyButtonText = "Satın Al" }: StorefrontPreviewProps) {
 const [layout, setLayout] = useState<"GRID" | "LIST">("GRID");
 const [clickedItem, setClickedItem] = useState<string | null>(null);

 const scrollContainerRef = useRef<HTMLDivElement>(null);
 const [isDragging, setIsDragging] = useState(false);
 const [startY, setStartY] = useState(0);
 const [scrollTop, setScrollTop] = useState(0);
 const [hasDragged, setHasDragged] = useState(false);

 const handleMouseDown = (e: React.MouseEvent) => {
 if (!scrollContainerRef.current) return;
 setIsDragging(true);
 setHasDragged(false);
 setStartY(e.pageY - scrollContainerRef.current.offsetTop);
 setScrollTop(scrollContainerRef.current.scrollTop);
 };

 const handleMouseLeave = () => {
 setIsDragging(false);
 };

 const handleMouseUp = () => {
 setIsDragging(false);
 };

 const handleMouseMove = (e: React.MouseEvent) => {
 if (!isDragging || !scrollContainerRef.current) return;
 e.preventDefault();
 setHasDragged(true);
 const y = e.pageY - scrollContainerRef.current.offsetTop;
 const walk = (y - startY) * 2;
 scrollContainerRef.current.scrollTop = scrollTop - walk;
 };

 const handlePurchase = (id: string) => {
 if (hasDragged) return;
 setClickedItem(id);
 const prod = products.find(p => p.id === id);
 if (prod && (prod as any).buyLink) {
   setTimeout(() => {
     setClickedItem(null);
     window.open((prod as any).buyLink, "_blank", "noopener,noreferrer");
   }, 200);
   return;
 }
 if (onProductClick) {
 setTimeout(() => {
 setClickedItem(null);
 onProductClick(id);
 }, 200);
 } else {
 setTimeout(() => setClickedItem(null), 300);
 }
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
 case "premium-creator":
 return {
 wrapper: "bg-[#fdfdfd] text-zinc-900",
 wrapperFont: "'Inter', sans-serif",
 headerBg: "bg-white/80 backdrop-blur-xl border-b border-zinc-100",
 heroContainer: "flex flex-col items-center justify-center pt-12 pb-8 px-4 text-center",
 avatarWrapper: "w-[120px] h-[120px] mb-5 rounded-full overflow-hidden border border-zinc-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white p-1",
 nameText: "text-zinc-900 font-bold tracking-tight text-2xl",
 bioText: "text-zinc-500 text-sm mt-2 max-w-[280px] font-medium leading-relaxed",
 searchBg: "bg-white border border-zinc-200 focus-within:border-zinc-300 focus-within:shadow-[0_4px_20px_rgb(0,0,0,0.03)] rounded-2xl shadow-sm transition-all",
 cardBg: "bg-white border border-zinc-100/80 rounded-[20px] hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:-translate-y-0.5 transition-all duration-300",
 titleColor: "text-zinc-800 font-semibold tracking-tight text-lg",
 priceColor: "text-zinc-900 font-semibold text-lg",
 btnClass: "bg-zinc-900 text-white hover:bg-zinc-800 rounded-xl font-medium transition-colors shadow-[0_4px_14px_0_rgb(0,0,0,0.1)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.15)]",
 badgeClass: "bg-zinc-100 text-zinc-600 border-none rounded-lg text-[10px] uppercase font-bold tracking-wider",
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
 <div 
 ref={scrollContainerRef}
 onMouseDown={handleMouseDown}
 onMouseLeave={handleMouseLeave}
 onMouseUp={handleMouseUp}
 onMouseMove={handleMouseMove}
 className={`relative w-full h-full overflow-y-auto no-scrollbar ${styles.wrapper} ${isDragging ? 'cursor-grabbing' : 'cursor-auto'}`} 
 style={{ fontFamily: styles.wrapperFont }}
 >
 {/* Extra overlay (CRT for retro) */}
 {styles.extraOverlay && <div className={styles.extraOverlay} />}

 {/* Hero Section */}
 <div className={`sticky top-0 z-10 ${styles.headerBg}`}>
 {shouldShowBanner && storeCoverUrl && (
 <div className="absolute inset-0 w-full h-full overflow-hidden z-0">
 <img
 src={storeCoverUrl}
 className={`w-full h-full object-cover ${theme === "glassmorphism" ? "blur-md scale-110 opacity-40" : "opacity-30"}`}
 alt="Banner"
 />
 {theme === "glassmorphism" && <div className="absolute inset-0 bg-slate-900/40 mix-blend-multiply" />}
 </div>
 )}

 <div className={styles.heroContainer}>
 <div className={styles.avatarWrapper}>
 {avatarUrl ? (
 <img src={avatarUrl} className="w-full h-full object-cover" alt={storeTitle || username || "Avatar"} />
 ) : (
 <div className="w-full h-full bg-zinc-800 flex items-center justify-center">
 <User className="w-10 h-10 text-zinc-400" />
 </div>
 )}
 </div>
 <h1 className={styles.nameText}>{storeTitle || username || "Digital Store"}</h1>
 {username && <p className="text-sm opacity-70 font-medium mb-1">{username}</p>}
 <p className={styles.bioText}>{displayBio}</p>
 </div>

 {/* Controls */}
 <div className="px-4 pb-4 flex gap-2 relative z-10">
 <div className={`flex-1 flex items-center px-3 py-3 md:py-2 gap-2 ${styles.searchBg} transition-all`}>
 <Search className="h-4 w-4 opacity-50" />
 <input
 type="text"
 placeholder="Ürünlerde ara..."
 className="bg-transparent border-none outline-none w-full text-xs font-medium placeholder:opacity-50"
 />
 </div>
 <div className={`flex gap-1 shrink-0 rounded-lg p-1 ${theme === "neo-brutalism" ? "bg-black/10 border border-black" : theme === "retro-arcade" ? "bg-[#111145] border border-[#00ffc8]/20" : "bg-black/5"}`}>
 <button
 onClick={() => setLayout("GRID")}
 className={`p-1.5 rounded-md ${layout === "GRID" ? (theme === "neo-brutalism" ? "bg-black text-[#caff4a]" : "bg-black/10 shadow-sm") : "opacity-50"}`}
 >
 <LayoutGrid className="h-4 w-4" />
 </button>
 <button
 onClick={() => setLayout("LIST")}
 className={`p-1.5 rounded-md ${layout === "LIST" ? (theme === "neo-brutalism" ? "bg-black text-[#caff4a]" : "bg-black/10 shadow-sm") : "opacity-50"}`}
 >
 <List className="h-4 w-4" />
 </button>
 </div>
 </div>
 </div>

 {/* Product Feed */}
 <div className={`p-4 ${layout === "GRID" ? "grid grid-cols-1 md:grid-cols-2 gap-3" : "flex flex-col gap-3"}`}>
 {products.map((product) => (
 <div
 key={product.id}
 className={`overflow-hidden flex ${layout === "LIST" ? "flex-row items-center gap-4 p-3" : "flex-col"} ${styles.cardBg}`}
 >
 {product.imageUrl && (
 <div className={`${layout === "LIST" ? "w-16 h-16 shrink-0 rounded-lg" : "w-full h-28"} relative overflow-hidden bg-black/5`}>
 <img src={product.imageUrl} className="w-full h-full object-cover" alt={product.title} />
 </div>
 )}
 <div className={`${layout === "LIST" ? "flex-1" : "p-3"} flex flex-col justify-between h-full`}>
 <div>
 <span className={`px-1.5 py-0.5 text-[8px] uppercase tracking-wider ${styles.badgeClass}`}>
 {product.type}
 </span>
 <h4 className={`mt-1.5 ${textSizeClass} ${styles.titleColor} ${layout === "LIST" ? "line-clamp-1" : "line-clamp-2"}`}>
 {product.title}
 </h4>
 </div>
 <div className={`mt-3 flex ${layout === "LIST" ? "flex-row items-center justify-between" : "flex-col items-start"} gap-2`}>
 <span className={`${priceSizeClass} ${styles.priceColor}`}>{product.price}₺</span>
 <button
 onClick={() => handlePurchase(product.id)}
 className={`w-full ${layout === "LIST" ? "w-auto px-3" : ""} py-3 md:py-2 text-[10px] flex items-center justify-center gap-1.5 ${styles.btnClass} ${
 clickedItem === product.id ? "scale-95 opacity-80" : ""
 }`}
 >
 {buyButtonText}
 </button>
 </div>
 </div>
 </div>
 ))}
 </div>
 </div>
 );
}
