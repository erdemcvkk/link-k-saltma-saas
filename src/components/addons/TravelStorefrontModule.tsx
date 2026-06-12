"use client";

import React, { useState, useMemo } from "react";
import { 
  Compass, 
  MapPin, 
  Clock, 
  Star, 
  Search, 
  BookOpen, 
  Heart, 
  ChevronRight, 
  Sparkles,
  ArrowRight,
  Info,
  Calendar
} from "lucide-react";

export interface TravelTour {
  id: string;
  image: string;
  title: string;
  duration: string;
  price: number;
  rating: number;
  buyLink?: string;
  category?: string;
}

export interface TravelPromo {
  id: string;
  image: string;
  title: string;
  discountBadge: string;
  price: number;
  buyLink?: string;
}

interface TravelStorefrontModuleProps {
  avatarUrl?: string;
  username?: string;
  bio?: string;
  config?: any;
}

export default function TravelStorefrontModule({
  avatarUrl,
  username = "traveler",
  bio,
  config = {}
}: TravelStorefrontModuleProps) {
  // Parse configurations
  const primaryColor = config.primaryColor || "#0284c7"; // Ocean Blue
  const accentColor = config.accentColor || "#ea580c"; // Orange
  const heroBgImage = config.heroBgImage || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80";
  const heroTitle = config.heroTitle || "Dünyayı Keşfetmeye Hazır Mısın?";
  const searchPlaceholder = config.searchPlaceholder || "Nereyi keşfetmek istersiniz?";

  // Category options
  const categories = useMemo(() => {
    if (config.categories && Array.isArray(config.categories) && config.categories.length > 0) {
      return config.categories;
    }
    return [
      { id: "c1", label: "Tüm Turlar" },
      { id: "c2", label: "Yaz Tatili" },
      { id: "c3", label: "Doğa Turları" },
      { id: "c4", label: "Kültür Gezileri" }
    ];
  }, [config.categories]);

  // Featured Tours (Array)
  const featuredTours: TravelTour[] = useMemo(() => {
    if (config.featuredTours && Array.isArray(config.featuredTours) && config.featuredTours.length > 0) {
      return config.featuredTours.map((t: any) => ({
        id: t.id || Math.random().toString(36).substr(2, 9),
        image: t.image || "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=400&q=80",
        title: t.title || "Gizemli Tur",
        duration: t.duration || "2 Gece 3 Gün",
        price: Number(t.price) || 0,
        rating: Number(t.rating) || 5.0,
        buyLink: t.buyLink || "",
        category: t.category || "Yaz Tatili"
      }));
    }
    return [
      {
        id: "ft1",
        image: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=400&q=80",
        title: "Maldivler Balayı Cenneti",
        duration: "5 Gece 6 Gün",
        price: 45000,
        rating: 4.9,
        category: "Yaz Tatili",
        buyLink: ""
      },
      {
        id: "ft2",
        image: "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=400&q=80",
        title: "Karadeniz Yaylaları Doğa Turu",
        duration: "3 Gece 4 Gün",
        price: 12500,
        rating: 4.8,
        category: "Doğa Turları",
        buyLink: ""
      },
      {
        id: "ft3",
        image: "https://images.unsplash.com/photo-1533105079780-92b9be482077?w=400&q=80",
        title: "Antik Ege & Efes Harikaları",
        duration: "4 Gece 5 Gün",
        price: 18000,
        rating: 4.7,
        category: "Kültür Gezileri",
        buyLink: ""
      }
    ];
  }, [config.featuredTours]);

  // Last Minute Deals (Array)
  const lastMinuteDeals: TravelPromo[] = useMemo(() => {
    if (config.lastMinuteDeals && Array.isArray(config.lastMinuteDeals) && config.lastMinuteDeals.length > 0) {
      return config.lastMinuteDeals.map((d: any) => ({
        id: d.id || Math.random().toString(36).substr(2, 9),
        image: d.image || "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=400&q=80",
        title: d.title || "Fırsat Turu",
        discountBadge: d.discountBadge || "Son Koltuklar",
        price: Number(d.price) || 0,
        buyLink: d.buyLink || ""
      }));
    }
    return [
      {
        id: "lmd1",
        image: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=200&q=80",
        title: "Kapadokya Balon Turu Paket",
        discountBadge: "Son 3 Koltuk",
        price: 8900,
        buyLink: ""
      },
      {
        id: "lmd2",
        image: "https://images.unsplash.com/photo-1513407030348-c983a97b98d8?w=200&q=80",
        title: "Klasik Tokyo Gezisi",
        discountBadge: "%20 İndirim",
        price: 62000,
        buyLink: ""
      }
    ];
  }, [config.lastMinuteDeals]);

  // States
  const [activeTab, setActiveTab] = useState<"explore" | "myTours" | "guide">("explore");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tüm Turlar");
  const [wishlist, setWishlist] = useState<string[]>([]);

  // Filter Tours Lojik
  const filteredTours = useMemo(() => {
    return featuredTours.filter(tour => {
      const matchesSearch = tour.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            (tour.category && tour.category.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory = selectedCategory === "Tüm Turlar" || tour.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [featuredTours, searchQuery, selectedCategory]);

  const toggleWishlist = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setWishlist(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleTourClick = (tour: TravelTour | TravelPromo) => {
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
    <div className="w-full min-h-screen overflow-x-hidden flex flex-col font-sans relative pb-24 bg-slate-50 text-slate-800">
      {/* ── 1. EXPLORE TAB ── */}
      {activeTab === "explore" && (
        <div className="flex-1 flex flex-col justify-start w-full">
          
          {/* Hero Banner Area */}
          <div className="w-full relative aspect-[4/3] min-h-[240px] flex flex-col justify-end p-6 bg-zinc-900 border-b border-black/5">
            <img 
              src={heroBgImage} 
              alt="Hero Travel Banner" 
              className="absolute inset-0 w-full h-full object-cover opacity-75"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
            
            <div className="relative z-10 space-y-4 text-left w-full">
              <span className="text-[9px] font-mono tracking-widest uppercase text-white/90 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 inline-flex items-center gap-1.5 shadow-sm">
                <Sparkles size={10} style={{ color: accentColor }} /> Macera Seni Çağırıyor
              </span>
              <h1 className="text-xl md:text-2xl font-black text-white leading-tight drop-shadow-sm max-w-[90%] font-serif">
                {heroTitle}
              </h1>
              
              {/* Glassmorphic Search Bar */}
              <div className="relative w-full flex items-center bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-1.5 shadow-xl">
                <Search size={16} className="text-white/60 ml-3 shrink-0" />
                <input 
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={searchPlaceholder}
                  className="w-full bg-transparent pl-2.5 pr-4 py-2 text-xs text-white placeholder-white/50 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Categories Horizontal Pills */}
          <div className="px-6 py-4">
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
              {categories.map((cat: any) => {
                const isSelected = selectedCategory === cat.label;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.label)}
                    className="px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-300 border active:scale-95 shadow-sm"
                    style={{
                      backgroundColor: isSelected ? primaryColor : "#ffffff",
                      borderColor: isSelected ? primaryColor : "rgba(0, 0, 0, 0.05)",
                      color: isSelected ? "#ffffff" : "#475569"
                    }}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Carousel Title */}
          <div className="px-6 flex items-center justify-between pb-3">
            <h3 className="text-sm font-black tracking-wide text-slate-800 uppercase flex items-center gap-1.5">
              <Compass size={14} style={{ color: primaryColor }} /> Öne Çıkan Turlar
            </h3>
            <span className="text-[10px] font-semibold text-slate-400">
              {filteredTours.length} tur listelendi
            </span>
          </div>

          {/* Featured Tours Carousel */}
          {filteredTours.length === 0 ? (
            <div className="py-12 text-center bg-white border border-zinc-100 rounded-3xl mx-6 shadow-sm">
              <span className="text-2xl block">🗺️</span>
              <p className="text-xs text-slate-500 mt-2">Aramanıza uygun tur bulunamadı.</p>
            </div>
          ) : (
            <div className="flex gap-4 overflow-x-auto no-scrollbar px-6 pb-6 scroll-smooth select-none">
              {filteredTours.map((tour) => (
                <div 
                  key={tour.id}
                  onClick={() => handleTourClick(tour)}
                  className="bg-white border border-zinc-100/80 rounded-[24px] p-3 flex flex-col justify-between w-64 shrink-0 relative shadow-md hover:border-zinc-200 transition-all cursor-pointer group"
                >
                  {/* Heart / Wishlist Button Overlay */}
                  <button
                    onClick={(e) => toggleWishlist(tour.id, e)}
                    className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm border border-zinc-100 flex items-center justify-center text-slate-600 hover:text-red-500 transition-colors z-20 shadow"
                  >
                    <Heart 
                      size={14} 
                      className={wishlist.includes(tour.id) ? "fill-red-500 text-red-500" : ""}
                    />
                  </button>

                  <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100 mb-3 relative">
                    <img 
                      src={tour.image} 
                      alt={tour.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span 
                      className="absolute bottom-2.5 left-2.5 px-2.5 py-1 text-[9px] font-bold text-white rounded-lg flex items-center gap-1 shadow-sm"
                      style={{ backgroundColor: primaryColor }}
                    >
                      <MapPin size={9} /> {tour.category}
                    </span>
                  </div>

                  <div className="text-left space-y-2.5 flex-1 flex flex-col justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[10px] text-slate-400 font-semibold">
                        <span className="flex items-center gap-1">
                          <Clock size={10} /> {tour.duration}
                        </span>
                        <span className="flex items-center gap-0.5 text-amber-500">
                          <Star size={10} className="fill-amber-500" /> {tour.rating.toFixed(1)}
                        </span>
                      </div>
                      <h4 className="text-xs font-black text-slate-800 tracking-tight leading-snug line-clamp-2">
                        {tour.title}
                      </h4>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-zinc-50">
                      <div className="flex flex-col">
                        <span className="text-[8px] text-slate-400 uppercase tracking-widest font-semibold">Kişi Başı</span>
                        <span className="text-xs font-black" style={{ color: accentColor }}>
                          {formatPrice(tour.price)}
                        </span>
                      </div>
                      <span 
                        className="p-2 rounded-xl text-white shadow-md active:scale-95 transition-transform flex items-center justify-center"
                        style={{ backgroundColor: primaryColor }}
                      >
                        <ArrowRight size={14} />
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Last Minute Deals Compakt List Title */}
          <div className="px-6 pt-2 pb-3">
            <h3 className="text-sm font-black tracking-wide text-slate-800 uppercase flex items-center gap-1.5">
              <Sparkles size={14} style={{ color: accentColor }} /> Son Dakika Fırsatları
            </h3>
          </div>

          {/* Deals Compakt List */}
          <div className="px-6 space-y-3">
            {lastMinuteDeals.map((deal) => (
              <div 
                key={deal.id}
                onClick={() => handleTourClick(deal)}
                className="bg-white border border-zinc-100 rounded-2xl p-2.5 flex gap-3.5 relative shadow-sm items-center cursor-pointer hover:border-zinc-200 transition-colors"
              >
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                  <img src={deal.image} alt={deal.title} className="w-full h-full object-cover" />
                </div>
                
                <div className="flex-1 text-left min-w-0 flex flex-col justify-between py-0.5">
                  <div className="space-y-1">
                    <span 
                      className="inline-block px-2 py-0.5 text-[8px] font-extrabold text-white rounded uppercase tracking-wider"
                      style={{ backgroundColor: accentColor }}
                    >
                      {deal.discountBadge}
                    </span>
                    <h4 className="text-xs font-black text-slate-800 truncate pr-6">
                      {deal.title}
                    </h4>
                  </div>
                  
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="text-[10px] text-slate-400">Başlangıç:</span>
                    <span className="text-xs font-black" style={{ color: primaryColor }}>
                      {formatPrice(deal.price)}
                    </span>
                  </div>
                </div>
                
                <ChevronRight size={16} className="text-slate-400 pr-1" />
              </div>
            ))}
          </div>

        </div>
      )}

      {/* ── 2. MY TOURS TAB ── */}
      {activeTab === "myTours" && (
        <div className="flex-1 flex flex-col justify-start px-6 pt-6 text-left">
          <div className="mb-6">
            <h3 className="text-lg font-black tracking-tight text-slate-800 font-serif">Favori Rotan</h3>
            <p className="text-xs text-slate-400 font-medium">Takip ettiğiniz ve rezerve etmek istediğiniz maceralar ({wishlist.length})</p>
          </div>

          {wishlist.length === 0 ? (
            <div className="py-20 text-center bg-white border border-zinc-150 rounded-[32px] shadow-sm space-y-4 px-6">
              <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                <Heart size={22} />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-black text-slate-800">Henüz Kaydedilmiş Tur Yok</h4>
                <p className="text-xs text-slate-400 leading-normal">Turları incelerken beğendiğiniz paketleri kalp ikonuna dokunarak buraya kaydedebilirsiniz.</p>
              </div>
              <button 
                onClick={() => setActiveTab("explore")}
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-white shadow"
                style={{ backgroundColor: primaryColor }}
              >
                Gezileri Keşfet
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {featuredTours
                .filter(t => wishlist.includes(t.id))
                .map((tour) => (
                  <div 
                    key={tour.id}
                    onClick={() => handleTourClick(tour)}
                    className="bg-white border border-zinc-100 rounded-[24px] p-3 flex gap-3 relative shadow-sm cursor-pointer hover:border-zinc-200 transition-colors"
                  >
                    <div className="w-24 h-24 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                      <img src={tour.image} alt={tour.title} className="w-full h-full object-cover" />
                    </div>
                    
                    <div className="flex-1 min-w-0 flex flex-col justify-between py-1 text-left">
                      <div className="space-y-1">
                        <h4 className="text-xs font-black text-slate-800 truncate pr-6">
                          {tour.title}
                        </h4>
                        <div className="flex items-center gap-3 text-[10px] text-slate-400 font-semibold">
                          <span className="flex items-center gap-0.5">
                            <Clock size={10} /> {tour.duration}
                          </span>
                          <span className="flex items-center gap-0.5 text-amber-500">
                            <Star size={10} className="fill-amber-500" /> {tour.rating.toFixed(1)}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black" style={{ color: accentColor }}>
                          {formatPrice(tour.price)}
                        </span>
                        <button 
                          onClick={(e) => toggleWishlist(tour.id, e)}
                          className="text-red-500 text-xs font-bold bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg border border-red-100"
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

      {/* ── 3. GUIDE TAB ── */}
      {activeTab === "guide" && (
        <div className="flex-1 flex flex-col justify-start px-6 pt-6 text-left">
          <div className="mb-6">
            <h3 className="text-lg font-black tracking-tight text-slate-800 font-serif">Seyahat Rehberi</h3>
            <p className="text-xs text-slate-400 font-medium">Rezervasyon süreci ve tur detayları hakkında sıkça sorulan sorular</p>
          </div>

          <div className="space-y-4">
            <div className="bg-white border border-zinc-100 rounded-2xl p-4 shadow-sm flex gap-3.5 items-start">
              <Info size={16} className="shrink-0 mt-0.5" style={{ color: primaryColor }} />
              <div className="space-y-1">
                <h4 className="text-xs font-black text-slate-800">Rezervasyonumu Nasıl Yapabilirim?</h4>
                <p className="text-[11px] text-slate-500 leading-normal">
                  İlgilendiğiniz tur kartının sağ altındaki ok butonuna tıklayarak doğrudan acentemizin resmi rezervasyon ve biletleme sayfasına yönlendirilirsiniz.
                </p>
              </div>
            </div>

            <div className="bg-white border border-zinc-100 rounded-2xl p-4 shadow-sm flex gap-3.5 items-start">
              <Calendar size={16} className="shrink-0 mt-0.5" style={{ color: primaryColor }} />
              <div className="space-y-1">
                <h4 className="text-xs font-black text-slate-800">Ödeme ve İptal Şartları Nelerdir?</h4>
                <p className="text-[11px] text-slate-500 leading-normal">
                  Tüm turlarımızda tura son 72 saat kalana kadar koşulsuz iptal ve %100 ücret iade garantisi bulunmaktadır. Detayları yönlendirildiğiniz sayfadan inceleyebilirsiniz.
                </p>
              </div>
            </div>

            <div className="bg-white border border-zinc-100 rounded-2xl p-4 shadow-sm flex gap-3.5 items-start">
              <Compass size={16} className="shrink-0 mt-0.5" style={{ color: primaryColor }} />
              <div className="space-y-1">
                <h4 className="text-xs font-black text-slate-800">Kişiye Özel Tur Planlanabilir Mi?</h4>
                <p className="text-[11px] text-slate-500 leading-normal">
                  Evet, arkadaş gruplarınız veya kurumsal organizasyonlarınız için bizimle doğrudan iletişime geçerek özel rota talebinde bulunabilirsiniz.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── 4. GLASSMORPHIC BOTTOM NAV BAR ── */}
      <div className="fixed bottom-0 left-0 right-0 z-30 max-w-md mx-auto px-4 pb-4">
        <div className="w-full h-16 rounded-3xl backdrop-blur-md bg-white/75 border border-zinc-200/50 flex items-center justify-around px-2 shadow-xl">
          <button 
            onClick={() => setActiveTab("explore")}
            className="flex flex-col items-center justify-center gap-1 w-14 h-12 rounded-xl transition-all duration-300"
            style={{ color: activeTab === "explore" ? primaryColor : "#94a3b8" }}
          >
            <Compass size={18} />
            <span className="text-[9px] uppercase tracking-wider font-bold">Keşfet</span>
          </button>
          
          <button 
            onClick={() => setActiveTab("myTours")}
            className="flex flex-col items-center justify-center gap-1 w-14 h-12 rounded-xl transition-all duration-300 relative"
            style={{ color: activeTab === "explore" && wishlist.length > 0 ? primaryColor : activeTab === "myTours" ? primaryColor : "#94a3b8" }}
          >
            <Heart size={18} />
            {wishlist.length > 0 && (
              <span 
                className="absolute top-2 right-3 w-4 h-4 rounded-full text-[8px] font-extrabold text-white flex items-center justify-center shadow animate-scaleIn"
                style={{ backgroundColor: accentColor }}
              >
                {wishlist.length}
              </span>
            )}
            <span className="text-[9px] uppercase tracking-wider font-bold">Turlarım</span>
          </button>
          
          <button 
            onClick={() => setActiveTab("guide")}
            className="flex flex-col items-center justify-center gap-1 w-14 h-12 rounded-xl transition-all duration-300"
            style={{ color: activeTab === "guide" ? primaryColor : "#94a3b8" }}
          >
            <BookOpen size={18} />
            <span className="text-[9px] uppercase tracking-wider font-bold">Rehber</span>
          </button>
        </div>
      </div>

    </div>
  );
}
