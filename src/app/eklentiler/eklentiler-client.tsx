"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ShoppingBag, Zap, CreditCard, ChevronRight, Search, ArrowUpDown, ChevronDown, Rewind, FastForward, Play, Airplay, SlidersHorizontal, Volume2, MoreHorizontal, Laptop, ListMusic } from "lucide-react";
import StorefrontPreview, { StoreThemeType, DummyProduct } from "@/components/storefront-preview";
import { buyAddonAction } from "../actions";

interface AddonTypeData {
 id: string;
 name: string;
 desc: string;
 color: string;
 theme: StoreThemeType;
 mockProducts: DummyProduct[];
 price: string;
 username: string;
 bio: string;
 avatarUrl: string;
 coverUrl?: string;
 category: string;
}

export const ADDON_TYPES: AddonTypeData[] = [
  { 
    id: "MINI_STORE", 
    name: "Dijital Mağaza Modülü", 
    desc: "Dijital veya fiziksel ürünlerinizi doğrudan profilinizde satmaya başlayın.", 
    color: "bg-orange-500",
    theme: "vibrant-pop",
    price: "99",
    username: "@creative.zeynep",
    bio: "İçerik Üreticisi & YouTuber",
    avatarUrl: "/placeholder.png",
    category: "Satış & Gelir",
    mockProducts: [
      { id: "p1", title: "Video Düzenleme Masterclass'ı", type: "Kurs", price: "99", imageUrl: "/placeholder.png" },
      { id: "p2", title: "Sosyal Medya İçerik Takvimi", type: "Şablon", price: "99", imageUrl: "/placeholder.png" },
    ]
  },
  { 
    id: "CORP_EXEC", 
    name: "Kurumsal Yönetici Kartı", 
    desc: "Yönetici profilinizi, kartvizit ve görüşme detaylarınızı şık bir şekilde sergileyin.", 
    color: "bg-blue-600",
    theme: "classic",
    price: "99",
    username: "@ceo.exec",
    bio: "C-Level Executive Consultant",
    avatarUrl: "/placeholder.png",
    category: "Premium Temalar",
    mockProducts: [
      { id: "ce1", title: "Q3 Business Strategy Plan", type: "Şablon", price: "99", imageUrl: "/placeholder.png" },
      { id: "ce2", title: "Corporate Restructuring Guide", type: "E-Kitap", price: "99", imageUrl: "/placeholder.png" }
    ]
  },
  { 
    id: "RETRO", 
    name: "Klasik Retro Mağaza", 
    desc: "8-bit atari ve retro oyun estetiğine sahip nostaljik mağaza tasarımı.", 
    color: "bg-[#00ffc8]",
    theme: "retro-arcade",
    price: "99",
    username: "@PIXEL_DEV",
    bio: "Indie Oyun Geliştiricisi",
    avatarUrl: "/placeholder.png",
    category: "Premium Temalar",
    mockProducts: [
      { id: "ra1", title: "16-Bit Sprite Paketi", type: "Asset", price: "99", imageUrl: "/placeholder.png" },
      { id: "ra2", title: "Chiptune Müzik Paketi", type: "Müzik", price: "99", imageUrl: "/placeholder.png" },
    ]
  },
  { 
    id: "NEO_BRUTAL", 
    name: "Neo Brutalist Vitrin", 
    desc: "Kalın çizgiler ve yüksek kontrastlı renklerle modern brutalist tasarım.", 
    color: "bg-[#caff4a]",
    theme: "neo-brutalism",
    price: "99",
    username: "@dev.manifest",
    bio: "Full-Stack Geliştirici & Tasarımcı",
    avatarUrl: "/placeholder.png",
    category: "Premium Temalar",
    mockProducts: [
      { id: "nb1", title: "Terminal VS Code Eklentisi", type: "Eklenti", price: "99", imageUrl: "/placeholder.png" },
      { id: "nb2", title: "Brutalist React Kit", type: "Kod", price: "99", imageUrl: "/placeholder.png" },
    ]
  },
  { 
    id: "ORGANIC", 
    name: "Organik & Doğal Vitrin", 
    desc: "Doğal tonlar ve yumuşak hatlarla organik ürünleriniz için yeşil tasarım.", 
    color: "bg-[#8fbc6a]",
    theme: "organic-earth",
    price: "99",
    username: "@naturel.coach",
    bio: "Holistik Sağlık & Beslenme Koçu",
    avatarUrl: "/placeholder.png",
    category: "Premium Temalar",
    mockProducts: [
      { id: "oe1", title: "Holistik Beslenme Rehberi", type: "E-Kitap", price: "99", imageUrl: "/placeholder.png" },
      { id: "oe2", title: "30 Günlük Detoks Programı", type: "Program", price: "99", imageUrl: "/placeholder.png" },
    ]
  },
  { 
    id: "Y2K", 
    name: "Neon & Gece Hayatı Vitrin", 
    desc: "Fütüristik neon ışıkları ve holografik esintiler sunan özel tasarım.", 
    color: "bg-gradient-to-r from-[#ff6ec7] to-[#7873f5]",
    theme: "y2k-holographic",
    price: "99",
    username: "@glitter.queen",
    bio: "Moda & Lifestyle Influencer",
    avatarUrl: "/placeholder.png",
    category: "Premium Temalar",
    mockProducts: [
      { id: "y1", title: "2000'ler Nostalji Filtreleri", type: "Filtre", price: "99", imageUrl: "/placeholder.png" },
      { id: "y2", title: "Holografik Sticker Paketi", type: "Tasarım", price: "99", imageUrl: "/placeholder.png" },
    ]
  },
  { 
    id: "PREMIUM_VIDEO", 
    name: "Premium Video Eğitimi", 
    desc: "Eğitim veya masterclass videolarınızı sinematik şekilde sunup izletin.", 
    color: "bg-red-500",
    theme: "premium-video",
    price: "99",
    username: "@masterclass",
    bio: "Video Eğitimi",
    avatarUrl: "",
    category: "Satış & Gelir",
    mockProducts: []
  },
  { 
    id: "MUSIC_PODCAST", 
    name: "Müzik & Podcast Çalar", 
    desc: "Beat'lerinizi ve podcast'lerinizi doğrudan sayfanızda dinletin.", 
    color: "bg-purple-600",
    theme: "classic",
    price: "99",
    username: "@podcast.wave",
    bio: "Beatmaker & Podcaster",
    avatarUrl: "/placeholder.png",
    category: "Müzik & Audio",
    mockProducts: []
  },
  { 
    id: "PORTFOLIO_GALLERY", 
    name: "Portfolyo & Galeri", 
    desc: "Tasarımlarınızı ve fotoğraflarınızı şık bir ızgara (grid) yapısında sergileyin.", 
    color: "bg-slate-400",
    theme: "classic",
    price: "99",
    username: "@art.portfolio",
    bio: "Visual Artist & Designer",
    avatarUrl: "/placeholder.png",
    category: "Premium Temalar",
    mockProducts: []
  },
  { 
    id: "COUNTDOWN_LAUNCH", 
    name: "Geri Sayım & Lansman", 
    desc: "Yeni ürün veya içerikleriniz için heyecan yaratacak dinamik sayaç.", 
    color: "bg-orange-500",
    theme: "classic",
    price: "99",
    username: "@launch.timer",
    bio: "Product Launcher & Innovator",
    avatarUrl: "/placeholder.png",
    category: "Premium Temalar",
    mockProducts: []
  },
  { 
    id: "SPOTIFY_CLASSIC", 
    name: "Spotify Classic Player", 
    desc: "Orijinal ve ikonik Spotify görünümünde parça veya çalma listesi oynatıcısı.", 
    color: "bg-[#1db954]",
    theme: "classic",
    price: "99",
    username: "@spotify.classic",
    bio: "Original Spotify Look",
    avatarUrl: "/placeholder.png",
    category: "Müzik & Audio",
    mockProducts: []
  },
  { 
    id: "VINYL_RETRO", 
    name: "Retro Plak Oynatıcı", 
    desc: "Nostaljik ruhu yaşatan, şarkı çalarken dönen retro plak görünümlü oynatıcı.", 
    color: "bg-amber-700",
    theme: "classic",
    price: "99",
    username: "@vinyl.collector",
    bio: "Vintage Plak Sever",
    avatarUrl: "/placeholder.png",
    category: "Müzik & Audio",
    mockProducts: []
  },
  { 
    id: "GLASS_AUDIO", 
    name: "Modern Cam Efekti", 
    desc: "Albüm renklerine uyum sağlayan yarı saydam lüks cam tasarımı.", 
    color: "bg-indigo-400",
    theme: "classic",
    price: "99",
    username: "@glass.synth",
    bio: "Ambient & Synthwave Producer",
    avatarUrl: "/placeholder.png",
    category: "Müzik & Audio",
    mockProducts: []
  },
  { 
    id: "NEON_CYBERPUNK", 
    name: "Neon Cyberpunk Player", 
    desc: "Elektronik müzik ve synthwave tutkunları için parlayan neon tasarımlı oynatıcı.", 
    color: "bg-pink-500",
    theme: "classic",
    price: "99",
    username: "@cyberpunk.wave",
    bio: "Synthwave & Cyberpunk Creator",
    avatarUrl: "/placeholder.png",
    category: "Müzik & Audio",
    mockProducts: []
  },
  { 
    id: "FAQ", 
    name: "Sıkça Sorulan Sorular", 
    desc: "Sıkça sorulan soruları profilinizde listeleyerek kullanıcılarınızı bilgilendirin.", 
    color: "bg-emerald-500",
    theme: "classic",
    price: "99",
    username: "@pixelcraft.design",
    bio: "Sıkça Sorulan Sorular",
    avatarUrl: "/placeholder.png",
    category: "Etkileşim & Araçlar",
    mockProducts: []
  },
  { 
    id: "RETRO_CASSETTE", 
    name: "Retro Kaset Çalar", 
    desc: "90'ların nostaljik kaset görünümünde, dönen makaralı ses oynatıcısı.", 
    color: "bg-amber-600",
    theme: "classic",
    price: "99",
    username: "@vintage.tapes",
    bio: "90s Music Curator",
    avatarUrl: "/placeholder.png",
    category: "Müzik & Audio",
    mockProducts: []
  }
];

interface EklentilerClientProps {
  products?: DummyProduct[];
  settings?: Record<string, string>;
  userId?: string | null;
  dbUserId?: string | null;
  purchasedAddons?: string[];
}

export default function EklentilerClient({ products, settings, userId = null, dbUserId = null, purchasedAddons = [] }: EklentilerClientProps = {}) {
  const lang = "tr";
  const [purchasing, setPurchasing] = useState<string | null>(null);
  const [purchased, setPurchased] = useState<string[]>(purchasedAddons);
  const [visibleCount, setVisibleCount] = useState(26);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("default");
  const [selectedCategory, setSelectedCategory] = useState("Tümü");

  const handlePurchase = async (addonType: string) => {
    setPurchasing(addonType);
    try {
      await buyAddonAction(addonType);
      setPurchased(prev => [...prev, addonType]);
      alert("Eklenti başarıyla satın alındı ve paneline eklendi!");
    } catch (err) {
      alert("Satın alma sırasında bir hata oluştu veya oturumunuz açık değil.");
    } finally {
      setPurchasing(null);
    }
  };

  return (
    <div className="min-h-screen bg-black font-sans">
      <nav className="border-b border-zinc-900 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2 cursor-pointer hover:opacity-80 transition-all">
            <ArrowLeft className="h-5 w-5 text-zinc-400" />
            <span className="text-xl font-black tracking-tight text-white">Ana Sayfa</span>
          </Link>
          <div className="flex items-center space-x-4">
            {userId ? (
              <Link
                href="/dashboard"
                className="px-4 py-2 rounded-full bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-white font-bold text-xs md:text-sm transition-all"
              >
                Yönetim Paneli
              </Link>
            ) : (
              <Link
                href="/sign-up"
                className="px-4 py-2 rounded-full bg-gradient-to-r from-neon-blue to-light-blue text-white font-bold text-xs md:text-sm transition-all"
              >
                Hemen Üye Ol
              </Link>
            )}
          </div>
        </div>
      </nav>

 <main className="max-w-full md:w-[1800px] mx-auto px-6 py-16">
 <div className="text-center max-w-2xl mx-auto mb-16">
 <div className="inline-flex items-center gap-2 px-4 py-3 md:py-2 rounded-full bg-neon-blue/10 text-neon-blue font-bold text-sm mb-6">
 <Zap className="h-4 w-4" />
 <span>26 Premium Eklenti Vitrini</span>
 </div>
 <h1 className="text-2xl md:text-4xl md:text-6xl font-black text-white tracking-tight mb-6">
 Profilinize <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-light-blue">Güç Katın</span>
 </h1>
 <p className="text-lg text-zinc-400 font-medium">
 İhtiyacınıza uygun modülü seçin, tek seferlik ödemeyle ömür boyu kullanın. 26 farklı premium eklenti ve tema arasından seçim yapın.
 </p>
 </div>

 {/* Search + Sort bar */}
 <div className="flex flex-col gap-4 bg-zinc-900/40 p-4 rounded-3xl border border-zinc-800 backdrop-blur-sm max-w-4xl mx-auto mb-12">
 <div className="flex flex-col sm:flex-row gap-3 items-center">
 <div className="relative flex-1 w-full">
 <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
 <Search className="h-4 w-4" />
 </span>
 <input
 type="text"
 placeholder="Eklenti ara..."
 value={searchQuery}
 onChange={(e) => {
 setSearchQuery(e.target.value);
 setVisibleCount(26);
 }}
 className="w-full pl-10 pr-4 py-3 md:py-2.5 rounded-full bg-zinc-950 border border-zinc-800 text-sm font-semibold focus:outline-none focus:border-neon-blue text-white placeholder-zinc-500 transition-colors"
 />
 </div>

 <div className="relative w-full sm:w-56">
 <ArrowUpDown className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 pointer-events-none" />
 <select
 value={sortOption}
 onChange={(e) => {
 setSortOption(e.target.value);
 setVisibleCount(26);
 }}
 className="w-full pl-10 pr-8 py-3 md:py-2.5 rounded-full bg-zinc-950 border border-zinc-800 text-sm font-semibold focus:outline-none focus:border-neon-blue text-white appearance-none cursor-pointer transition-colors"
 >
 <option value="default">Varsayılan Sıralama</option>
 <option value="name-asc">A → Z (İsim)</option>
 <option value="name-desc">Z → A (İsim)</option>
 <option value="price-asc">Fiyat: Düşükten Yükseğe</option>
 <option value="price-desc">Fiyat: Yüksekten Düşüğe</option>
 </select>
 <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 pointer-events-none" />
 </div>
 </div>
  {/* Category Pills */}
  <div className="flex flex-wrap gap-2 justify-center pt-2 border-t border-zinc-800/60 mt-1">
    {["Tümü", "Müzik & Audio", "Satış & Gelir", "Etkileşim & Araçlar", "Premium Temalar"].map((cat) => (
      <button
        key={cat}
        type="button"
        onClick={() => {
          setSelectedCategory(cat);
          setVisibleCount(26);
        }}
        className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
          selectedCategory === cat
            ? "bg-gradient-to-r from-neon-blue to-light-blue text-white shadow-md shadow-neon-blue/10"
            : "bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-900"
        }`}
      >
        {cat}
      </button>
    ))}
  </div>

 <div className="text-center">
 <span className="text-xs font-bold text-zinc-500">
 {(() => {
 const filtered = ADDON_TYPES.filter(a => {
  const name = (settings?.[ `theme_NAME_${a.id}` ] || a.name).toLowerCase();
  const desc = (settings?.[ `theme_DESC_${a.id}` ] || a.desc).toLowerCase();
  const matchesSearch = name.includes(searchQuery.toLowerCase()) || desc.includes(searchQuery.toLowerCase());
  const matchesCategory = selectedCategory === "Tümü" || a.category === selectedCategory;
  return matchesSearch && matchesCategory;
  });
 return `${filtered.length} eklenti bulundu`;
 })()}
 </span>
 </div>
 </div>

 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12 pb-12">
 {ADDON_TYPES
 .filter((addon) => {
  const name = (settings?.[ `theme_NAME_${addon.id}` ] || addon.name).toLowerCase();
  const desc = (settings?.[ `theme_DESC_${addon.id}` ] || addon.desc).toLowerCase();
  const matchesSearch = name.includes(searchQuery.toLowerCase()) || desc.includes(searchQuery.toLowerCase());
  const matchesCategory = selectedCategory === "Tümü" || addon.category === selectedCategory;
  return matchesSearch && matchesCategory;
  })
 .sort((a, b) => {
 const nameA = settings?.[`theme_NAME_${a.id}`] || a.name;
 const nameB = settings?.[`theme_NAME_${b.id}`] || b.name;
 const priceA = Number(settings?.[`theme_PRICE_${a.id}`] || a.price);
 const priceB = Number(settings?.[`theme_PRICE_${b.id}`] || b.price);
 switch (sortOption) {
 case "name-asc": return nameA.localeCompare(nameB, "tr");
 case "name-desc": return nameB.localeCompare(nameA, "tr");
 case "price-asc": return priceA - priceB;
 case "price-desc": return priceB - priceA;
 default: return 0;
 }
 })
 .slice(0, visibleCount).map((addon) => {
 const isPurchased = purchased.includes(addon.id);
 const isProcessing = purchasing === addon.id;
 
 // Eğer veritabanından gelen products varsa ve bu MINI_STORE ise (veya hepsi için), ürünleri ez:
 const displayProducts = (products && products.length > 0 && addon.id === "MINI_STORE") 
 ? products 
 : addon.mockProducts;
 
 // Eğer admin panelinden fiyat güncellendiyse (override) onu kullan
 const displayPrice = settings?.[`theme_PRICE_${addon.id}`] || addon.price;
 const displayName = settings?.[`theme_NAME_${addon.id}`] || addon.name;
 const displayDesc = settings?.[`theme_DESC_${addon.id}`] || addon.desc;
 const paymentUrl = settings?.[`theme_PAYMENT_${addon.id}`];
 
 return (
 <div key={addon.id} className="flex flex-col items-center">
 
 <div className="text-center mb-6 px-4">
 <div className={`w-3 h-3 rounded-full mb-3 mx-auto ${addon.color} animate-pulse`} />
 <h3 className="text-xl font-bold text-white mb-2">{displayName}</h3>
 <p className="text-sm text-zinc-400 font-medium leading-relaxed h-[40px] flex items-center justify-center">
 {displayDesc}
 </p>
 </div>

 {/* Phone Mockup Frame */}
 <div className="relative w-full aspect-[1/2] max-w-full max-w-sm lg:w-[340px] mx-auto bg-zinc-900 rounded-[3rem] p-3 shadow-2xl border-4 border-zinc-800 overflow-hidden shrink-0 group mb-6">
 <div className="absolute top-0 inset-x-0 h-6 bg-zinc-900 z-20 rounded-b-3xl w-[40%] mx-auto shadow-sm" />
 
 <div className="relative w-full h-full bg-[#f8f9fa] rounded-[2rem] overflow-hidden">
 {addon.id === "PREMIUM_VIDEO" ? (
  <div className="w-full h-full bg-black flex flex-col p-4 relative z-0">
  {/* 16:9 Media Player Area */}
  <div className="w-full aspect-video rounded-2xl bg-zinc-900 mt-6 relative shadow-[0_0_40px_rgba(255,255,255,0.1)] overflow-hidden group">
  {/* Mock Cover Image */}
  <div className="absolute inset-0 bg-[url('/placeholder.png')] bg-cover bg-center opacity-80 group-hover:scale-105 transition-transform duration-700" />
  {/* Glassmorphism Play Button */}
  <div className="absolute inset-0 flex items-center justify-center">
  <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:bg-white/30 transition-all cursor-pointer">
  <span className="text-2xl ml-1">▶</span>
  </div>
  </div>
  </div>
  
  {/* Text Content */}
  <div className="flex flex-col mt-6 flex-1">
  <h1 className="text-xl font-bold text-white tracking-tight mb-2">UI/UX Masterclass Bölüm 1</h1>
  <p className="text-zinc-400 text-sm leading-relaxed mb-6">Tasarım sistemleri ve ileri düzey prototipleme tekniklerini keşfedin.</p>
  
  <div className="mt-auto pb-4">
  <button className="w-full py-4 rounded-xl bg-white text-black font-bold text-sm hover:bg-zinc-200 transition-colors pointer-events-none">
  Tamamını İzle
  </button>
  </div>
  </div>
  </div>
  ) : addon.id === "SPOTIFY_CLASSIC" ? (
  <div className="w-full h-full bg-zinc-950 flex flex-col p-6 text-white relative z-0">
    <div className="flex flex-col items-center mt-6 mb-4">
      <div className="w-20 h-20 bg-zinc-800 rounded-md overflow-hidden border border-zinc-800 shadow-lg">
        <img src={addon.avatarUrl} className="w-full h-full object-cover" />
      </div>
      <span className="text-xs font-bold mt-2 text-white">{addon.username}</span>
      <p className="text-[10px] text-green-500 font-bold mt-0.5">{addon.bio}</p>
    </div>
    
    <div className="bg-zinc-900 rounded-2xl p-4 mt-2 border border-zinc-800 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-xs font-bold text-white">Classic Track</h4>
          <p className="text-[9px] text-zinc-400">Artists & Friends</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-green-500 text-sm cursor-pointer">⏮</span>
          <button className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-black border-0 shadow-[0_0_12px_rgba(34,197,94,0.4)] cursor-pointer">
            <span className="text-xs ml-0.5">▶</span>
          </button>
          <span className="text-green-500 text-sm cursor-pointer">⏭</span>
        </div>
      </div>
      
      {/* Progress Bar */}
      <div className="space-y-1">
        <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden">
          <div className="w-1/3 h-full bg-green-500 rounded-full"></div>
        </div>
        <div className="flex justify-between text-[8px] text-zinc-500 font-mono">
          <span>1:12</span>
          <span>3:45</span>
        </div>
      </div>
    </div>
  </div>
  ) : addon.id === "VINYL_RETRO" ? (
  <div className="w-full h-full bg-stone-900 flex flex-col p-6 text-orange-400 relative z-0">
    <div className="flex flex-col items-center mt-6 mb-2">
      <span className="text-xs font-bold text-stone-200">{addon.username}</span>
      <p className="text-[9px] text-orange-400/70 mt-0.5">{addon.bio}</p>
    </div>
    
    {/* Vinyl Record */}
    <div className="flex justify-center my-2">
      <div className="w-24 h-24 rounded-full bg-zinc-950 border-4 border-black flex items-center justify-center relative shadow-2xl animate-[spin_6s_linear_infinite]">
        {/* Record Grooves */}
        <div className="absolute inset-2 rounded-full border border-stone-850"></div>
        <div className="absolute inset-4 rounded-full border border-stone-850"></div>
        {/* Record Label */}
        <div className="w-8 h-8 rounded-full bg-orange-400 flex items-center justify-center p-0.5">
          <div className="w-2 h-2 rounded-full bg-stone-900"></div>
        </div>
      </div>
    </div>
    
    <div className="bg-stone-950/80 rounded-2xl p-3 border border-stone-800 text-center space-y-2 mt-auto">
      <h4 className="text-[10px] font-bold text-stone-300">Retro Vinyl Selection</h4>
      <div className="flex items-center justify-center gap-4 text-orange-400">
        <span className="text-xs cursor-pointer">⏮</span>
        <button className="w-8 h-8 rounded-full bg-orange-400 flex items-center justify-center text-stone-900 border-0 cursor-pointer">
          <span className="text-[10px] ml-0.5">▶</span>
        </button>
        <span className="text-xs cursor-pointer">⏭</span>
      </div>
    </div>
  </div>
  ) : addon.id === "GLASS_AUDIO" ? (
  <div className="w-full h-full bg-gradient-to-br from-indigo-400 to-purple-400 flex flex-col p-6 text-white relative z-0">
    <div className="flex flex-col items-center mt-6 mb-4">
      <div className="w-16 h-16 bg-white/20 rounded-full overflow-hidden border border-white/20 shadow-lg">
        <img src={addon.avatarUrl} className="w-full h-full object-cover" />
      </div>
      <span className="text-xs font-bold mt-2 text-white">{addon.username}</span>
    </div>
    
    {/* Glassmorphism Player Card */}
    <div className="bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl p-4 mt-2 space-y-3 shadow-xl">
      <div className="text-center">
        <h4 className="text-xs font-extrabold text-white">Glass Ambient Track</h4>
        <p className="text-[9px] text-purple-100/80">Lofi & Chillwave</p>
      </div>
      <div className="flex items-center justify-center gap-4 text-white">
        <span className="text-xs cursor-pointer">⏮</span>
        <button className="w-9 h-9 rounded-full bg-white text-purple-600 flex items-center justify-center border-0 shadow-lg cursor-pointer">
          <span className="text-xs ml-0.5">▶</span>
        </button>
        <span className="text-xs cursor-pointer">⏭</span>
      </div>
    </div>
  </div>
  ) : addon.id === "NEON_CYBERPUNK" ? (
  <div className="w-full h-full bg-black flex flex-col p-6 text-white relative z-0">
    <div className="flex flex-col items-center mt-6 mb-4">
      <div className="w-20 h-20 bg-zinc-900 rounded-none overflow-hidden border border-pink-500 shadow-[0_0_10px_rgba(236,72,153,0.5)]">
        <img src={addon.avatarUrl} className="w-full h-full object-cover" />
      </div>
      <span className="text-xs font-black mt-2 uppercase tracking-widest text-pink-500">{addon.username}</span>
    </div>
    
    {/* Neon Cyberpunk Player Card */}
    <div className="bg-black border border-pink-500 shadow-[0_0_15px_rgba(236,72,153,0.6)] rounded-none p-4 mt-2 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-[10px] font-black uppercase tracking-widest text-cyan-400">Cyber City Beats</h4>
          <p className="text-[8px] text-pink-400 uppercase">Synthwave mix</p>
        </div>
        <button className="w-9 h-9 rounded-none bg-pink-500 flex items-center justify-center text-black border-0 shadow-[0_0_10px_rgba(236,72,153,0.8)] cursor-pointer">
          <span className="text-xs">▶</span>
        </button>
      </div>
      
      {/* Cyan/Pink neon accent lines */}
      <div className="w-full h-0.5 bg-zinc-900 relative">
        <div className="absolute left-0 top-0 w-2/3 h-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]"></div>
      </div>
    </div>
  </div>

  ) : addon.id === "MUSIC_PODCAST" ? (
  <div 
    className="w-full h-full flex flex-col justify-between p-4 text-white relative z-0 select-none overflow-hidden"
    style={{ background: "radial-gradient(circle at 50% 30%, #d47e1d 0%, #613306 60%, #170d02 100%)" }}
  >
    {/* Spotify Branding Logo */}
    <div className="flex items-center justify-center gap-1.5 mt-2 opacity-90">
      <svg viewBox="0 0 24 24" className="w-5 h-5 fill-[#1DB954]" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.586 14.424c-.18.295-.565.387-.86.207-2.377-1.454-5.37-1.783-8.893-.982-.336.075-.668-.135-.744-.47-.075-.336.135-.668.47-.743 3.856-.88 7.15-.506 9.822 1.13.295.178.387.563.205.858zm1.225-2.72c-.227.367-.707.487-1.074.26-2.72-1.672-6.87-2.157-10.077-1.182-.413.125-.85-.107-.975-.52-.125-.413.107-.85.52-.975 3.667-1.112 8.24-.57 11.346 1.343.366.227.485.707.26 1.074zm.106-2.833C14.384 8.71 8.563 8.52 5.175 9.548c-.513.155-1.053-.137-1.208-.65-.155-.514.137-1.054.65-1.208 3.882-1.178 10.314-.955 14.373 1.453.46.273.61.867.337 1.328-.273.46-.867.61-1.328.337z"/>
      </svg>
      <span className="text-white text-xs font-bold tracking-tight">Spotify</span>
    </div>

    {/* 3D Cover Flow Carousel Mock */}
    <div className="relative w-full h-36 flex items-center justify-center my-3" style={{ perspective: "1000px" }}>

      {/* Middle Cover (Active) */}
      <div 
        className="absolute w-26 h-26 rounded-xl overflow-hidden shadow-2xl border-2 border-white/40 z-10"
        style={{
          transform: "translateX(0) translateZ(0) rotateY(0) scale(1)",
        }}
      >
        <img src={addon.avatarUrl || "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=150&q=80"} className="w-full h-full object-cover" />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent p-2 flex flex-col justify-end text-left h-2/3">
          <span className="text-white text-[8px] font-black truncate leading-tight">Summer Beats 2026</span>
          <span className="text-zinc-300 text-[6px] font-medium truncate mt-0.5">Podcast & Instrumental</span>
        </div>
      </div>

      {/* Right Cover */}
      <div 
        className="absolute w-22 h-22 rounded-xl overflow-hidden shadow-lg border border-white/10"
        style={{
          transform: "translateX(45px) translateZ(-60px) rotateY(-25deg) scale(0.8)",
          zIndex: 5,
        }}
      >
        <img src="https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=150&q=80" className="w-full h-full object-cover" />
      </div>
    </div>

    {/* Active Track Details */}
    <div className="flex flex-col items-center justify-center w-full mb-3">
      <div className="text-center px-4">
        <h3 className="text-sm font-extrabold text-white tracking-wide truncate max-w-[200px] mx-auto">
          Summer Beats 2026
        </h3>
        <p className="text-[10px] text-zinc-350 truncate max-w-[200px] mx-auto mt-0.5">
          Podcast & Instrumental
        </p>
      </div>
    </div>

    {/* Glassmorphic Player Controls Bar */}
    <div className="w-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-full py-1.5 px-3.5 flex items-center justify-between shadow-2xl relative z-10 mt-auto">
      {/* Left Controls */}
      <div className="flex items-center gap-2.5 shrink-0">
        <Rewind size={14} className="text-white/80 fill-current" />
        <div className="w-6 h-6 rounded-full bg-white text-black flex items-center justify-center shadow-lg">
          <Play size={10} className="fill-black text-black ml-0.5" />
        </div>
        <FastForward size={14} className="text-white/80 fill-current" />
      </div>
      
      {/* Center: Mini Status Pill */}
      <div className="flex-1 flex justify-center px-1.5">
        <div className="w-full max-w-[130px] bg-black/60 border border-white/10 rounded-xl px-1.5 py-0.5 flex items-center gap-1.5 relative overflow-hidden h-7">
          <div className="w-5 h-5 rounded overflow-hidden shrink-0 bg-zinc-800">
            <img
              src={addon.avatarUrl || "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=50&q=80"}
              className="w-full h-full object-cover"
              alt="mini cover"
            />
          </div>
          <div className="flex-1 min-w-0 flex flex-col justify-center text-left">
            <span className="text-[7px] font-bold text-white truncate leading-tight">Summer Beats</span>
            <span className="text-[6px] text-zinc-400 truncate leading-none mt-0.5">Podcast & Inst.</span>
          </div>
          
          <div className="flex items-end gap-[1px] h-2.5 shrink-0 pr-0.5">
            <span className="w-[1px] bg-[#1DB954] h-1.5 rounded-full"></span>
            <span className="w-[1px] bg-[#1DB954] h-2.5 rounded-full"></span>
            <span className="w-[1px] bg-[#1DB954] h-1.5 rounded-full"></span>
          </div>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 text-white/75 shrink-0">
        <Laptop size={11} />
        <ListMusic size={11} />
        <Volume2 size={11} />
      </div>
    </div>
  </div>
  ) : addon.id === "RETRO_CASSETTE" ? (
  <div className="w-full h-full bg-[#1e1a17] flex flex-col p-6 text-amber-500 relative z-0">
    <div className="flex flex-col items-center mt-6 mb-4">
      <span className="text-xs font-bold text-amber-400">{addon.username}</span>
      <p className="text-[9px] text-amber-500/70 mt-0.5">{addon.bio}</p>
    </div>
    
    {/* Cassette Tape Shape */}
    <div className="bg-[#2c221e] border-2 border-amber-900/60 rounded-2xl p-3 mx-auto w-full max-w-[240px] space-y-3 shadow-lg">
      <div className="bg-zinc-950 rounded-lg p-2 flex items-center justify-between border border-amber-900/40">
        <div className="w-8 h-8 rounded-full border border-dashed border-amber-500/30 flex items-center justify-center animate-[spin_8s_linear_infinite]">
          <div className="w-2.5 h-2.5 rounded-full bg-zinc-900 border border-amber-500"></div>
        </div>
        <div className="w-14 h-4 bg-amber-500/10 border border-amber-500/20 rounded text-[7px] text-amber-400 flex items-center justify-center font-mono uppercase tracking-widest">
          90s MIX
        </div>
        <div className="w-8 h-8 rounded-full border border-dashed border-amber-500/30 flex items-center justify-center animate-[spin_8s_linear_infinite]">
          <div className="w-2.5 h-2.5 rounded-full bg-zinc-900 border border-amber-500"></div>
        </div>
      </div>
      <div className="text-center">
        <h4 className="text-[10px] font-black uppercase tracking-wider text-amber-300">Retro Cassette Track</h4>
        <p className="text-[8px] text-amber-500/60 mt-0.5">Analog Tape Vibes</p>
      </div>
    </div>
    
    {/* Cassette Controls */}
    <div className="flex items-center justify-center gap-3 mt-auto pb-4 text-amber-500">
      <span className="text-xs cursor-pointer">⏮</span>
      <button className="w-8 h-8 rounded-full bg-amber-500 text-[#1e1a17] flex items-center justify-center border-0 cursor-pointer shadow-md">
        <span className="text-[10px] ml-0.5">▶</span>
      </button>
      <span className="text-xs cursor-pointer">⏭</span>
    </div>
  </div>
  ) : addon.id === "PORTFOLIO_GALLERY" ? (
  <div className="w-full h-full bg-slate-50 flex flex-col p-6 text-slate-800 relative z-0">
    <div className="flex flex-col items-center mt-6 mb-4">
      <div className="w-20 h-20 bg-zinc-200 rounded-none overflow-hidden border border-slate-300">
        <img src={addon.avatarUrl} className="w-full h-full object-cover" />
      </div>
      <span className="text-xs font-bold mt-2 text-slate-600">{addon.username}</span>
      <p className="text-[10px] text-slate-400 mt-0.5">{addon.bio}</p>
    </div>
    
    <div className="grid grid-cols-2 gap-2 mt-2">
      <div className="aspect-square bg-white/60 backdrop-blur-md border border-slate-200/50 rounded-xl p-1 overflow-hidden shadow-sm">
        <img src="/placeholder.png" className="w-full h-full object-cover rounded-lg" />
      </div>
      <div className="aspect-square bg-white/60 backdrop-blur-md border border-slate-200/50 rounded-xl p-1 overflow-hidden shadow-sm">
        <img src="/placeholder.png" className="w-full h-full object-cover rounded-lg" />
      </div>
      <div className="aspect-square bg-white/60 backdrop-blur-md border border-slate-200/50 rounded-xl p-1 overflow-hidden shadow-sm">
        <img src="/placeholder.png" className="w-full h-full object-cover rounded-lg" />
      </div>
      <div className="aspect-square bg-white/60 backdrop-blur-md border border-slate-200/50 rounded-xl p-1 overflow-hidden shadow-sm">
        <img src="/placeholder.png" className="w-full h-full object-cover rounded-lg" />
      </div>
    </div>
  </div>
  ) : addon.id === "COUNTDOWN_LAUNCH" ? (
  <div className="w-full h-full bg-orange-500 flex flex-col p-6 text-black relative z-0">
    <div className="flex flex-col items-center mt-6 mb-4">
      <div className="w-20 h-20 bg-zinc-950 rounded-tl-3xl rounded-br-3xl overflow-hidden border border-black/20">
        <img src={addon.avatarUrl} className="w-full h-full object-cover" />
      </div>
      <span className="text-xs font-black mt-2 uppercase tracking-wide">{addon.username}</span>
      <p className="text-[10px] text-zinc-900/70 font-semibold mt-0.5">{addon.bio}</p>
    </div>
    
    <div className="bg-black text-white rounded-3xl p-4 mt-2 border border-black/10 text-center space-y-3 shadow-lg">
      <h4 className="text-[10px] font-black uppercase tracking-widest text-orange-500">Lansmana Kalan Süre</h4>
      <div className="flex items-center justify-center gap-2">
        <div className="bg-zinc-900 px-2 py-1.5 rounded-lg border border-zinc-800">
          <span className="text-sm font-black font-mono text-white">03</span>
        </div>
        <span className="text-zinc-650 font-bold">:</span>
        <div className="bg-zinc-900 px-2 py-1.5 rounded-lg border border-zinc-800">
          <span className="text-sm font-black font-mono text-white">14</span>
        </div>
        <span className="text-zinc-650 font-bold">:</span>
        <div className="bg-zinc-900 px-2 py-1.5 rounded-lg border border-zinc-800">
          <span className="text-sm font-black font-mono text-white">59</span>
        </div>
      </div>
    </div>
  </div>

  ) : addon.id === "FAQ" ? (
  <div className="w-full h-full bg-[#fcfcfd] flex flex-col p-6 text-zinc-800 relative z-0">
    <div className="bg-white rounded-2xl p-4 mt-8 border border-zinc-200 shadow-md">
      <h1 className="text-[10px] font-black text-slate-800 tracking-tight text-center mb-3">Sıkça Sorulan Sorular</h1>
      <div className="space-y-2 mb-2 max-h-[140px] overflow-y-auto no-scrollbar">
        <div className="bg-zinc-50 border border-zinc-150 rounded-xl p-2.5 text-left">
          <p className="text-[9px] font-bold text-slate-800">Kargo ne zaman ulaşır?</p>
          <p className="text-[8px] text-slate-600 mt-1">Siparişiniz 2-3 iş günü içinde adresinize teslim edilir.</p>
        </div>
      </div>
      <button className="w-full py-2 rounded-xl bg-emerald-500 text-white font-bold text-[10px] hover:bg-emerald-600 transition-colors shadow-sm pointer-events-none">
        İletişim
      </button>
    </div>
  </div>
  ) : addon.id === "CORP_EXEC" ? (
    <div className="w-full h-full bg-slate-50 flex flex-col relative z-0 text-slate-800 overflow-hidden">
      <div className="bg-slate-900 h-28 w-full flex flex-col justify-end p-4 relative">
        <div className="absolute top-2 right-2 px-2 py-0.5 bg-blue-600 text-[8px] font-bold text-white rounded">PRO</div>
      </div>
      
      <div className="flex flex-col items-center -mt-10 px-6 mb-4 relative z-10">
        <div className="w-20 h-20 bg-white rounded-full border-4 border-white overflow-hidden shadow-md">
          <img src={addon.avatarUrl} className="w-full h-full object-cover" />
        </div>
        <span className="text-xs font-extrabold mt-2 text-slate-800">{addon.username}</span>
        <p className="text-[9px] text-slate-500 font-medium tracking-tight mt-0.5">{addon.bio}</p>
      </div>
      
      <div className="bg-white shadow-md rounded-xl p-4 mx-6 mt-1 border border-slate-100 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-[10px] font-bold text-slate-800">Q3 Executive Briefing</h4>
            <p className="text-[8px] text-slate-400">Corporate & Strategy</p>
          </div>
        </div>
        <button className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-[10px] rounded-lg tracking-wide transition-colors border-0 cursor-pointer">
          Schedule Consultation
        </button>
      </div>
    </div>
  ) : (
  <StorefrontPreview 
  theme={addon.theme as any} 
  products={displayProducts} 
  storeTitle={addon.name}
  username={addon.username}
  bio={addon.bio}
  avatarUrl={addon.avatarUrl}
  storeCoverUrl={addon.coverUrl}
  />
  )}
 </div>
 </div>

  {/* Buy Section */}
  <div className="w-full bg-zinc-900 rounded-2xl p-4 border border-zinc-800 text-center flex flex-col gap-3">
    <div className="text-2xl font-black text-white">
      {displayPrice === "0" ? (lang === "tr" ? "Ücretsiz" : "Free") : `₺${displayPrice}`}
    </div>
    {isPurchased ? (
      <button disabled className="w-full py-3 rounded-xl bg-green-500/20 text-green-500 font-bold flex items-center justify-center gap-2">
        <ShoppingBag className="h-4 w-4" /> Satın Alındı
      </button>
    ) : (
      <button 
        onClick={() => {
          if (displayPrice === "0") {
            if (paymentUrl) {
              window.location.href = paymentUrl;
            } else {
              handlePurchase(addon.id);
            }
          } else {
            if (!userId || !dbUserId) {
              alert(lang === "tr" ? "Satın almak için lütfen önce giriş yapın." : "Please sign in to purchase.");
              window.location.href = "/sign-in";
              return;
            }
            // "Hemen Satın Al" redirect to checkout API route
            window.location.href = `/api/checkout?userId=${dbUserId}&moduleId=${addon.id}`;
          }
        }}
        disabled={isProcessing}
        className="w-full py-3 rounded-xl bg-gradient-to-r from-neon-blue to-light-blue hover:opacity-90 text-white font-bold flex items-center justify-center gap-2 transition-all border-0 shadow-lg shadow-neon-blue/10 disabled:opacity-50 cursor-pointer"
      >
        {isProcessing 
          ? "İşleniyor..." 
          : displayPrice === "0" 
            ? (lang === "tr" ? "Aktif Et" : "Activate Now") 
            : (lang === "tr" ? "Hemen Satın Al" : "Buy Now")}
      </button>
    )}
    <p className="text-xs text-zinc-500 font-medium">
      {displayPrice === "0" ? (lang === "tr" ? "Sınırsız Kullanım" : "Lifetime Free") : (lang === "tr" ? "Tek Seferlik Ödeme" : "One-Time Payment")}
    </p>
  </div>

 </div>
 );
 })}
 </div>

 {visibleCount < ADDON_TYPES.length && (
 <div className="flex justify-center pt-4 pb-8">
 <button
 onClick={() => setVisibleCount(prev => prev + 4)}
 className="px-4 md:px-8 py-3 rounded-full bg-zinc-900 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800 text-white font-bold transition-all flex items-center gap-2"
 >
 Devamını Gör
 </button>
 </div>
 )}
 </main>
 </div>
 );
}
