"use client";

import React, { useState, useMemo } from "react";
import { 
  Compass, 
  MapPin, 
  Star, 
  Search, 
  Home,
  MessageCircle,
  Bell,
  Heart,
  ChevronRight,
  ArrowRight,
  User
} from "lucide-react";

export interface BentoTour {
  id: string;
  image: string;
  title: string;
  price: number;
  isLarge: boolean;
  rating?: number;
  location?: string;
  buyLink?: string;
}

interface EliteTravelModuleProps {
  avatarUrl?: string;
  username?: string;
  bio?: string;
  config?: any;
}

export default function EliteTravelModule({
  avatarUrl,
  username = "traveler",
  bio,
  config = {}
}: EliteTravelModuleProps) {
  // Parse configurations
  const bgColor = config.bgColor || "#f8fafc";
  const cardColor = config.cardColor || "#ffffff";
  const accentColor = config.accentColor || "#10b981"; // Emerald green
  const brandName = config.brandName || "Elite Travel";
  const brandLogoUrl = config.brandLogoUrl || "";
  const heroTitle = config.heroTitle || "Sınırları Aşın";
  const heroSubtitle = config.heroSubtitle || "Size özel bento kutusu konseptli seçkin seyahat deneyimleri.";

  // Bento Tours
  const tours: BentoTour[] = useMemo(() => {
    if (config.bentoTours && Array.isArray(config.bentoTours) && config.bentoTours.length > 0) {
      return config.bentoTours.map((t: any) => ({
        id: t.id || Math.random().toString(36).substr(2, 9),
        image: t.image || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80",
        title: t.title || "Gizemli Rota",
        price: Number(t.price) || 0,
        isLarge: !!t.isLarge,
        rating: Number(t.rating) || 4.9,
        location: t.location || "Dünya",
        buyLink: t.buyLink || ""
      }));
    }
    return [
      {
        id: "bt1",
        image: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=800&q=80",
        title: "Maldivler Özel Bungalov Konaklama",
        price: 95000,
        isLarge: true,
        rating: 5.0,
        location: "Maldiv Takımadaları"
      },
      {
        id: "bt2",
        image: "https://images.unsplash.com/photo-1513407030348-c983a97b98d8?w=400&q=80",
        title: "Tokyo & Kyoto Kültür Turu",
        price: 64000,
        isLarge: false,
        rating: 4.8,
        location: "Japonya"
      },
      {
        id: "bt3",
        image: "https://images.unsplash.com/photo-1533105079780-92b9be482077?w=400&q=80",
        title: "Ege Adaları Lüks Yat Turu",
        price: 32000,
        isLarge: false,
        rating: 4.9,
        location: "Yunanistan"
      },
      {
        id: "bt4",
        image: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&q=80",
        title: "Kapadokya Mağara Oteli & Balon Turu VIP",
        price: 18500,
        isLarge: true,
        rating: 4.7,
        location: "Nevşehir, Türkiye"
      }
    ];
  }, [config.bentoTours]);

  // States
  const [activeTab, setActiveTab] = useState<"home" | "explore" | "contact">("home");
  const [searchQuery, setSearchQuery] = useState("");
  const [favorites, setFavorites] = useState<string[]>([]);

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleTourClick = (tour: BentoTour) => {
    if (tour.buyLink) {
      window.open(tour.buyLink, "_blank", "noopener,noreferrer");
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("tr-TR", {
      style: "currency",
      currency: "TRY",
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <div 
      className="w-full h-full min-h-screen overflow-x-hidden flex flex-col font-sans relative pb-20 text-slate-800"
      style={{ backgroundColor: bgColor }}
    >
      
      {/* ── HEADER (BRAND LOGO AND NAME) ── */}
      <div className="w-full h-16 px-6 flex items-center justify-between border-b border-black/5 bg-white/45 backdrop-blur-sm sticky top-0 z-20">
        <div className="flex items-center gap-2.5">
          {brandLogoUrl ? (
            <img 
              src={brandLogoUrl} 
              alt={brandName} 
              className="h-8 w-auto object-contain"
            />
          ) : (
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white" style={{ backgroundColor: accentColor }}>
              <Compass size={16} />
            </div>
          )}
          <span className="font-extrabold tracking-tight text-sm uppercase text-slate-800">{brandName}</span>
        </div>
        <div className="flex items-center gap-3">
          <button className="p-2 rounded-full hover:bg-slate-100/50 transition-colors relative">
            <Bell size={16} className="text-slate-600" />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-red-500" />
          </button>
          <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-200 border border-slate-300 flex items-center justify-center shrink-0">
            {avatarUrl ? (
              <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <User size={14} className="text-slate-500" />
            )}
          </div>
        </div>
      </div>

      {/* ── 1. HOME TAB ── */}
      {activeTab === "home" && (
        <div className="flex-1 flex flex-col justify-start px-6 pt-6">
          
          {/* Welcome Typographic Area */}
          <div className="text-left space-y-2 mb-6">
            <h1 className="text-3xl font-black text-slate-900 leading-none tracking-tight font-sans uppercase">
              {heroTitle}
            </h1>
            <p className="text-xs text-slate-400 font-medium leading-relaxed max-w-[90%]">
              {heroSubtitle}
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative w-full flex items-center bg-white border border-zinc-150 rounded-2xl p-1 mb-6 shadow-sm">
            <Search size={16} className="text-slate-400 ml-3 shrink-0" />
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rota veya destinasyon ara..."
              className="w-full bg-transparent pl-2.5 pr-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 outline-none"
            />
          </div>

          {/* Bento Asymmetric Grid Showcase */}
          <div className="grid grid-cols-2 gap-4 pb-6">
            {tours
              .filter(tour => tour.title.toLowerCase().includes(searchQuery.toLowerCase()) || (tour.location || "").toLowerCase().includes(searchQuery.toLowerCase()))
              .map((tour) => {
                const isLarge = tour.isLarge;
                return (
                  <div
                    key={tour.id}
                    onClick={() => handleTourClick(tour)}
                    className={`relative rounded-[2.5rem] overflow-hidden group shadow-md hover:shadow-xl transition-all cursor-pointer aspect-[1.1] ${
                      isLarge ? "col-span-2 aspect-[1.8]" : "col-span-1"
                    }`}
                  >
                    {/* Background Tour Image */}
                    <img 
                      src={tour.image} 
                      alt={tour.title} 
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />

                    {/* Favorite Heart Button Overlay */}
                    <button
                      onClick={(e) => toggleFavorite(tour.id, e)}
                      className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/20 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-white/30 transition-colors z-10"
                    >
                      <Heart 
                        size={14} 
                        className={favorites.includes(tour.id) ? "fill-red-500 text-red-500" : ""}
                      />
                    </button>

                    {/* Bottom Info text overlay */}
                    <div className="absolute bottom-0 inset-x-0 p-5 flex flex-col justify-end text-left space-y-1">
                      <div className="flex items-center gap-1.5 text-[9px] font-bold text-white/80">
                        <MapPin size={9} style={{ color: accentColor }} />
                        <span>{tour.location}</span>
                      </div>
                      <h4 className={`font-black text-white leading-tight ${isLarge ? "text-sm md:text-base max-w-[70%]" : "text-xs max-w-[90%]"}`}>
                        {tour.title}
                      </h4>
                      <div className="flex items-center justify-between pt-1">
                        <span className="text-xs font-black text-white" style={{ color: accentColor }}>
                          {formatPrice(tour.price)}
                        </span>
                        {isLarge && (
                          <span className="flex items-center gap-1 text-[10px] font-bold text-white bg-white/10 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                            İncele <ArrowRight size={10} />
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>

        </div>
      )}

      {/* ── 2. EXPLORE TAB ── */}
      {activeTab === "explore" && (
        <div className="flex-1 flex flex-col justify-start px-6 pt-6 text-left">
          <div className="mb-6">
            <h3 className="text-xl font-black tracking-tight text-slate-950 uppercase font-sans">Favori Rotan</h3>
            <p className="text-xs text-slate-400 font-medium">Bento kutunuzdaki özel seçilmiş favoriler ({favorites.length})</p>
          </div>

          {favorites.length === 0 ? (
            <div className="py-20 text-center bg-white border border-zinc-150 rounded-[2.5rem] shadow-sm space-y-4 px-6">
              <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                <Heart size={22} />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-black text-slate-800">Boş Favori Kutusu</h4>
                <p className="text-xs text-slate-400 leading-normal">Turları incelerken beğendiğiniz destinasyonları bento kutunuza ekleyin.</p>
              </div>
              <button 
                onClick={() => setActiveTab("home")}
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-white shadow"
                style={{ backgroundColor: accentColor }}
              >
                Gezileri İncele
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {tours
                .filter(t => favorites.includes(t.id))
                .map((tour) => (
                  <div 
                    key={tour.id}
                    onClick={() => handleTourClick(tour)}
                    className="bg-white border border-zinc-100 rounded-[2rem] p-3 flex gap-3 relative shadow-sm cursor-pointer hover:border-zinc-200 transition-colors"
                  >
                    <div className="w-20 h-20 rounded-[1.5rem] overflow-hidden bg-slate-100 shrink-0">
                      <img src={tour.image} alt={tour.title} className="w-full h-full object-cover" />
                    </div>
                    
                    <div className="flex-1 min-w-0 flex flex-col justify-between py-1 text-left">
                      <div className="space-y-1">
                        <h4 className="text-xs font-black text-slate-900 truncate pr-6">
                          {tour.title}
                        </h4>
                        <div className="flex items-center gap-2 text-[9px] text-slate-400 font-semibold">
                          <MapPin size={9} /> {tour.location}
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black" style={{ color: accentColor }}>
                          {formatPrice(tour.price)}
                        </span>
                        <button 
                          onClick={(e) => toggleFavorite(tour.id, e)}
                          className="text-red-500 text-[10px] font-bold bg-red-50 hover:bg-red-100 px-3 py-1 rounded-lg"
                        >
                          Kaldır
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      )}

      {/* ── 3. CONTACT TAB ── */}
      {activeTab === "contact" && (
        <div className="flex-1 flex flex-col justify-start px-6 pt-6 text-left space-y-6">
          <div>
            <h3 className="text-xl font-black tracking-tight text-slate-950 uppercase font-sans">İletişim</h3>
            <p className="text-xs text-slate-400 font-medium">Bize ulaşarak kişiye özel lüks tur programı tasarlatabilirsiniz.</p>
          </div>

          <div className="space-y-4">
            <div className="bg-white border border-zinc-100 rounded-[2rem] p-5 shadow-sm space-y-3">
              <span className="inline-block p-3 rounded-2xl bg-emerald-50 text-emerald-600">
                <MessageCircle size={20} />
              </span>
              <h4 className="text-sm font-bold text-slate-800">Doğrudan İletişim Hattı</h4>
              <p className="text-xs text-slate-500 leading-normal">
                WhatsApp veya telefon üzerinden VIP seyahat rehberlerimizle anında görüşmeye başlayın.
              </p>
              <button 
                className="w-full py-2.5 rounded-xl text-white font-bold text-xs shadow-sm hover:opacity-95 transition-opacity"
                style={{ backgroundColor: accentColor }}
              >
                Görüşme Başlat
              </button>
            </div>

            <div className="bg-white border border-zinc-100 rounded-[2rem] p-5 shadow-sm space-y-3">
              <span className="inline-block p-3 rounded-2xl bg-sky-50 text-sky-600">
                <Compass size={20} />
              </span>
              <h4 className="text-sm font-bold text-slate-800">Ofis ve Acentelik Bilgisi</h4>
              <p className="text-xs text-slate-500 leading-normal">
                TÜRSAB A Grubu Seyahat Acentesi Belge No: 12490.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── ABSOLUTE BOTTOM MENU BAR (GLASSMORPHIC) ── */}
      <div className="absolute bottom-0 left-0 right-0 z-35 px-4 pb-4">
        <div className="w-full h-16 rounded-[2rem] backdrop-blur-md bg-white/70 border border-zinc-200/50 flex items-center justify-around px-2 shadow-lg">
          <button 
            onClick={() => setActiveTab("home")}
            className="flex flex-col items-center justify-center gap-1 w-14 h-12 rounded-xl transition-all duration-300"
            style={{ color: activeTab === "home" ? accentColor : "#94a3b8" }}
          >
            <Home size={18} />
            <span className="text-[9px] uppercase tracking-wider font-extrabold">Ana Sayfa</span>
          </button>
          
          <button 
            onClick={() => setActiveTab("explore")}
            className="flex flex-col items-center justify-center gap-1 w-14 h-12 rounded-xl transition-all duration-300 relative"
            style={{ color: activeTab === "explore" ? accentColor : "#94a3b8" }}
          >
            <Compass size={18} />
            {favorites.length > 0 && (
              <span 
                className="absolute top-2 right-3 w-4 h-4 rounded-full text-[8px] font-extrabold text-white flex items-center justify-center shadow animate-scaleIn"
                style={{ backgroundColor: accentColor }}
              >
                {favorites.length}
              </span>
            )}
            <span className="text-[9px] uppercase tracking-wider font-extrabold">Keşfet</span>
          </button>
          
          <button 
            onClick={() => setActiveTab("contact")}
            className="flex flex-col items-center justify-center gap-1 w-14 h-12 rounded-xl transition-all duration-300"
            style={{ color: activeTab === "contact" ? accentColor : "#94a3b8" }}
          >
            <MessageCircle size={18} />
            <span className="text-[9px] uppercase tracking-wider font-extrabold">İletişim</span>
          </button>
        </div>
      </div>

    </div>
  );
}
