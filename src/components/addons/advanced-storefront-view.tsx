"use client";

import React, { useState, useEffect } from "react";
import { Heart, ShoppingBag, Zap, Bookmark, User, Store, ArrowLeft } from "lucide-react";

export interface StorefrontProduct {
  id: string;
  title: string;
  price: string;
  imageUrl: string | null;
  badge?: string;
  isFavorite?: boolean;
  buyLink?: string;
}

export interface StorefrontCollection {
  id: string;
  title: string;
  showAllLink?: string;
  displayType: "horizontal-scroll" | "vertical-list";
  products: StorefrontProduct[];
}

export interface StorefrontBanner {
  heroBgUrl?: string;
  heroSub?: string;
  heroTitle?: string;
  heroDesc?: string;
  heroBtnText?: string;
  heroBtnLink?: string;
  textColor?: string;
}


export interface StorefrontConfig {
  heroBgUrl?: string;
  heroSub?: string;
  heroTitle?: string;
  heroDesc?: string;
  heroBtnText?: string;
  heroBtnLink?: string;
  banners?: StorefrontBanner[];
  brandName?: string;
  brandDescription?: string;
  brandLogoUrl?: string;
  brandContact?: string;
  collections?: StorefrontCollection[];
  bottomNav?: {
    show: boolean;
  };
  textColor?: string;
  fontFamily?: string;
}

interface AdvancedStorefrontViewProps {
  config: StorefrontConfig;
  lang?: string;
  onProductClick?: (product: StorefrontProduct) => void;
}

export default function AdvancedStorefrontView({
  config,
  lang = "tr",
  onProductClick,
}: AdvancedStorefrontViewProps) {
  const [selectedCollectionId, setSelectedCollectionId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"shop" | "explore" | "brands">("shop");
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);

  const safeConfig = config || {};
  const globalTextColor = safeConfig.textColor || "#1e293b";
  const globalFontFamily = safeConfig.fontFamily || "Inter";

  // Fallback banners construction
  const banners: StorefrontBanner[] = Array.isArray(safeConfig.banners) && safeConfig.banners.length > 0
    ? safeConfig.banners
    : [
        {
          heroBgUrl: safeConfig.heroBgUrl || "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80",
          heroSub: safeConfig.heroSub || "SPRING COLLECTION",
          heroTitle: safeConfig.heroTitle || "20% OFF",
          heroDesc: safeConfig.heroDesc || "For Selected Spring Style",
          heroBtnText: safeConfig.heroBtnText || "Shop now",
          heroBtnLink: safeConfig.heroBtnLink || "#",
        },
      ];

  // Autoplay effect
  useEffect(() => {
    if (banners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentBannerIndex((prev) => (prev + 1) % banners.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [banners.length]);

  // Brand Info
  const brandName = safeConfig.brandName || "Moda Boutique";
  const brandDescription = safeConfig.brandDescription || "Premium Wear & Design Studio since 2018.";
  const brandLogoUrl = safeConfig.brandLogoUrl || "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=150&q=80";
  const brandContact = safeConfig.brandContact || "mailto:info@modaboutique.com";

  const collections = Array.isArray(safeConfig.collections)
    ? safeConfig.collections
    : [
        {
          id: "demo-col-1",
          title: "Designer Collection",
          showAllLink: "#",
          displayType: "horizontal-scroll" as const,
          products: [
            {
              id: "demo-p-1",
              title: "Main Title",
              price: "44.99",
              imageUrl: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80",
              badge: "New",
              isFavorite: true,
              buyLink: "#",
            },
            {
              id: "demo-p-2",
              title: "Atom Dress",
              price: "44.99",
              imageUrl: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=600&q=80",
              badge: "",
              isFavorite: false,
              buyLink: "#",
            },
            {
              id: "demo-p-3",
              title: "Main Blouse",
              price: "44.99",
              imageUrl: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&q=80",
              badge: "Sale",
              isFavorite: false,
              buyLink: "#",
            }
          ],
        },
        {
          id: "demo-col-2",
          title: "Top Trends",
          showAllLink: "#",
          displayType: "vertical-list" as const,
          products: [
            {
              id: "demo-p-4",
              title: "KOR Slim-Fit Shirt",
              price: "24.99",
              imageUrl: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&q=80",
              badge: "",
              isFavorite: false,
              buyLink: "#",
            },
            {
              id: "demo-p-5",
              title: "West Side Blouse",
              price: "24.99",
              imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&q=80",
              badge: "",
              isFavorite: false,
              buyLink: "#",
            }
          ],
        }
      ];

  const bottomNavShow = safeConfig.bottomNav?.show !== false;

  const handleProductClick = (product: StorefrontProduct) => {
    if (onProductClick) {
      onProductClick(product);
      return;
    }
    if (product.buyLink && product.buyLink !== "#") {
      window.open(product.buyLink, "_blank", "noopener,noreferrer");
    }
  };

  const selectedCollection = collections.filter(Boolean).find(c => c && c.id === selectedCollectionId);

  // Combine all products for All Products tab
  const allProducts = collections.filter(Boolean).reduce<StorefrontProduct[]>((acc, col) => {
    return [...acc, ...(((col && col.products) || []).filter(Boolean))];
  }, []);

  const renderTabContent = () => {
    if (activeTab === "explore") {
      return (
        /* Tüm Ürünler View */
        <div className="flex-1 overflow-y-auto no-scrollbar pb-24 animate-in fade-in duration-300">
          <div className="p-4 sticky top-0 bg-white/95 backdrop-blur-md border-b border-gray-100 z-10 text-center">
            <h2 className="text-sm font-black tracking-tight" style={{ color: globalTextColor }}>
              {lang === "tr" ? "Tüm Ürünler" : "All Products"}
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-4 p-4">
            {allProducts.filter(Boolean).map((p) => (
              <a 
                key={p.id} 
                href={p.buyLink || "#"}
                target={(p.buyLink && p.buyLink !== "#") ? "_blank" : undefined}
                rel="noopener noreferrer"
                onClick={(e) => {
                  if (onProductClick) {
                    e.preventDefault();
                    onProductClick(p);
                  } else if (!p.buyLink || p.buyLink === "#") {
                    e.preventDefault();
                  }
                }}
                className="flex flex-col space-y-2 cursor-pointer group hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 block"
              >
                <div className="w-full aspect-[4/5] rounded-2xl bg-gray-100 relative overflow-hidden shadow-sm">
                  {p.imageUrl ? (
                    <img 
                      src={p.imageUrl} 
                      alt={p.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                      <ShoppingBag className="h-10 w-10" />
                    </div>
                  )}



                  {p.badge && (
                    <span className="absolute bottom-2.5 left-2.5 bg-white text-[9px] font-black text-slate-800 px-2.5 py-1 rounded-md shadow-sm uppercase tracking-wide">
                      {p.badge}
                    </span>
                  )}
                </div>

                <div className="px-1 text-left">
                  <h4 className="text-xs font-bold truncate leading-tight" style={{ color: globalTextColor }}>
                    {p.title}
                  </h4>
                  <span className="text-[11px] font-black block mt-0.5" style={{ color: globalTextColor, opacity: 0.7 }}>
                    ${p.price}
                  </span>
                </div>
              </a>
            ))}
            {allProducts.length === 0 && (
              <div className="col-span-2 text-center py-12 text-sm text-gray-400">
                {lang === "tr" ? "Henüz ürün eklenmemiş." : "No products added yet."}
              </div>
            )}
          </div>
        </div>
      );
    }

    if (activeTab === "brands") {
      return (
        /* Marka Bilgileri (Hakkımızda) View */
        <div className="flex-1 overflow-y-auto no-scrollbar pb-24 p-6 flex flex-col items-center text-center space-y-6 animate-in fade-in duration-300">
          <div className="w-24 h-24 rounded-full border border-gray-150 overflow-hidden shadow-sm bg-gray-50 flex items-center justify-center mt-12 shrink-0">
            {brandLogoUrl ? (
              <img src={brandLogoUrl} alt={brandName} className="w-full h-full object-cover" />
            ) : (
              <Store className="h-10 w-10 text-gray-400" />
            )}
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-black tracking-tight" style={{ color: globalTextColor }}>
              {brandName}
            </h2>
            <div className="w-12 h-1 mx-auto rounded-full" style={{ backgroundColor: globalTextColor }} />
          </div>

          <p className="text-sm font-medium leading-relaxed max-w-[280px]" style={{ color: globalTextColor, opacity: 0.85 }}>
            {brandDescription}
          </p>

          <div className="w-full max-w-[200px] h-[1px] bg-gray-100 pt-2" />

          {brandContact && (
            <a 
              href={brandContact}
              target={brandContact.startsWith("mailto:") ? undefined : "_blank"}
              rel="noopener noreferrer"
              className="w-full max-w-[280px] py-3.5 bg-slate-900 hover:bg-black hover:scale-[1.02] active:scale-98 text-white font-bold text-sm rounded-xl tracking-wide transition-all border-0 shadow-lg shadow-black/15 text-center block"
            >
              {lang === "tr" ? "İletişime Geç" : "Contact Us"}
            </a>
          )}
        </div>
      );
    }

    // 'shop' Tab
    if (selectedCollection) {
      return (
        /* Collection Detail View */
        <div className="flex-1 overflow-y-auto no-scrollbar pb-24 animate-in fade-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-100 sticky top-0 bg-white/95 backdrop-blur-md z-10">
            <button 
              type="button" 
              onClick={() => setSelectedCollectionId(null)}
              className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors border-0 cursor-pointer"
            >
              <ArrowLeft className="h-5 w-5 text-slate-800" />
            </button>
            <h2 className="text-sm font-black tracking-tight" style={{ color: globalTextColor }}>
              {selectedCollection.title}
            </h2>
            <div className="w-9 h-9" />
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-2 gap-4 p-4">
            {((selectedCollection && selectedCollection.products) || []).filter(Boolean).map((p) => (
              <a 
                key={p.id} 
                href={p.buyLink || "#"}
                target={(p.buyLink && p.buyLink !== "#") ? "_blank" : undefined}
                rel="noopener noreferrer"
                onClick={(e) => {
                  if (onProductClick) {
                    e.preventDefault();
                    onProductClick(p);
                  } else if (!p.buyLink || p.buyLink === "#") {
                    e.preventDefault();
                  }
                }}
                className="flex flex-col space-y-2 cursor-pointer group hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 block"
              >
                <div className="w-full aspect-[4/5] rounded-2xl bg-gray-100 relative overflow-hidden shadow-sm">
                  {p.imageUrl ? (
                    <img 
                      src={p.imageUrl} 
                      alt={p.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                      <ShoppingBag className="h-10 w-10" />
                    </div>
                  )}



                  {p.badge && (
                    <span className="absolute bottom-2.5 left-2.5 bg-white text-[9px] font-black text-slate-800 px-2.5 py-1 rounded-md shadow-sm uppercase tracking-wide">
                      {p.badge}
                    </span>
                  )}
                </div>

                <div className="px-1 text-left">
                  <h4 className="text-xs font-bold text-slate-800 truncate leading-tight">
                    {p.title}
                  </h4>
                  <span className="text-[11px] font-black text-slate-500 block mt-0.5">
                    ${p.price}
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      );
    }

    return (
      /* Main Shop Feed View (Hero + Horizontal Collections) */
      <div className="flex-1 overflow-y-auto no-scrollbar pb-24">
        {/* Hero Slider Section */}
        <div className="w-full h-[360px] md:h-[400px] relative overflow-hidden bg-zinc-950">
          {banners.filter(Boolean).map((banner, index) => {
            const isActive = index === currentBannerIndex;
            const bgUrl = (banner && banner.heroBgUrl) || "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80";
            const sub = (banner && banner.heroSub) || "SPRING COLLECTION";
            const title = (banner && banner.heroTitle) || "20% OFF";
            const desc = (banner && banner.heroDesc) || "For Selected Spring Style";
            const btnText = (banner && banner.heroBtnText) || "Shop now";
            const btnLink = (banner && banner.heroBtnLink) || "#";

            return (
              <div
                key={index}
                className={`absolute inset-0 bg-cover bg-center flex flex-col justify-between p-6 transition-all duration-700 ease-in-out ${
                  isActive ? "opacity-100 pointer-events-auto scale-100" : "opacity-0 pointer-events-none scale-105"
                }`}
                style={{ backgroundImage: `url(${bgUrl})`, fontFamily: globalFontFamily }}
              >
                {/* Dark overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/10 to-black/40 z-0 pointer-events-none" />

                {/* Spacer (Header icons removed) */}
                <div className="h-10 relative z-10" />

                {/* Hero Typography & Content */}
                <div className="w-full space-y-4 relative z-10 mt-auto">
                  {(() => {
                    const textColor = banner.textColor || "#ffffff";
                    return (
                      <>
                        <div className="space-y-1">
                          <span className="text-[10px] tracking-[0.25em] font-extrabold uppercase select-none" style={{ color: textColor }}>
                            {sub}
                          </span>
                          <div className="w-16 h-[1.5px]" style={{ backgroundColor: textColor, opacity: 0.8 }} />
                        </div>

                        <h1 className="text-4xl md:text-5xl font-black leading-none tracking-tight" style={{ color: textColor }}>
                          {title}
                        </h1>
                        <p className="text-sm font-semibold leading-tight" style={{ color: textColor, opacity: 0.9 }}>
                          {desc}
                        </p>
                      </>
                    );
                  })()}

                  <div className="flex items-center justify-between pt-1">
                    {/* Pagination indicators */}
                    <div className="flex gap-1.5 items-center">
                      {banners.map((_, dotIdx) => (
                        <button
                          key={dotIdx}
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            setCurrentBannerIndex(dotIdx);
                          }}
                          className={`w-2 h-2 rounded-full transition-all border-0 cursor-pointer ${
                            dotIdx === currentBannerIndex
                              ? "scale-125 shadow-sm"
                              : "hover:scale-110"
                          }`}
                          style={{
                            backgroundColor: dotIdx === currentBannerIndex 
                              ? (banner.textColor || "#ffffff") 
                              : `${banner.textColor || "#ffffff"}80`
                          }}
                        />
                      ))}
                    </div>

                    {/* Shop now button */}
                    <a 
                      href={btnLink || "#"} 
                      target={(btnLink && btnLink !== "#" && typeof btnLink === "string" && !btnLink.startsWith("#")) ? "_blank" : undefined}
                      rel="noopener noreferrer"
                      onClick={(e) => {
                        if (btnLink === "#" || !btnLink) {
                          e.preventDefault();
                        }
                      }}
                      className="px-6 py-2.5 bg-[#17181a] hover:bg-black hover:scale-[1.05] active:scale-95 text-white font-bold text-xs rounded-full tracking-wide transition-all border-0 shadow-lg shadow-black/20 text-center"
                    >
                      {btnText}
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Collections */}
        <div className="p-6 space-y-8">
          {collections.filter(Boolean).map((col) => (
            <div key={col.id} id={col.id} className="space-y-4 scroll-mt-6">
              {/* Collection Header */}
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-black tracking-tight" style={{ color: globalTextColor }}>
                  {col.title}
                </h3>
                <a 
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setSelectedCollectionId(col.id);
                  }}
                  className="text-xs font-bold transition-colors uppercase tracking-wider cursor-pointer"
                  style={{ color: globalTextColor, opacity: 0.6 }}
                >
                  {lang === "tr" ? "Tümünü Gör" : "Show all"}
                </a>
              </div>

              {/* Products Render */}
              {col.displayType === "horizontal-scroll" ? (
                /* Horizontal Scroll View */
                <div className="flex overflow-x-auto gap-4 snap-x snap-mandatory no-scrollbar pb-2 -mx-6 px-6">
                  {((col && col.products) || []).filter(Boolean).map((p) => (
                    <a 
                      key={p.id} 
                      href={p.buyLink || "#"}
                      target={(p.buyLink && p.buyLink !== "#") ? "_blank" : undefined}
                      rel="noopener noreferrer"
                      onClick={(e) => {
                        if (onProductClick) {
                          e.preventDefault();
                          onProductClick(p);
                        } else if (!p.buyLink || p.buyLink === "#") {
                          e.preventDefault();
                        }
                      }}
                      className="w-[160px] flex-shrink-0 snap-start space-y-2 cursor-pointer group block hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
                    >
                      {/* Product Image Wrapper */}
                      <div className="w-[160px] h-[200px] rounded-2xl bg-gray-100 relative overflow-hidden shadow-sm">
                        {p.imageUrl ? (
                          <img 
                            src={p.imageUrl} 
                            alt={p.title} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-300">
                            <ShoppingBag className="h-10 w-10" />
                          </div>
                        )}



                        {/* Badge */}
                        {p.badge && (
                          <span className="absolute bottom-2.5 left-2.5 bg-white text-[9px] font-black text-slate-800 px-2.5 py-1 rounded-md shadow-sm uppercase tracking-wide">
                            {p.badge}
                          </span>
                        )}
                      </div>

                      {/* Product Name & Price */}
                      <div className="px-1 text-left">
                        <h4 className="text-xs font-bold truncate leading-tight" style={{ color: globalTextColor }}>
                          {p.title}
                        </h4>
                        <span className="text-[11px] font-black block mt-0.5" style={{ color: globalTextColor, opacity: 0.7 }}>
                          ${p.price}
                        </span>
                      </div>
                    </a>
                  ))}
                </div>
              ) : (
                /* Grid / Vertical Columns View */
                <div className="grid grid-cols-2 gap-4">
                  {((col && col.products) || []).filter(Boolean).map((p) => (
                    <a 
                      key={p.id} 
                      href={p.buyLink || "#"}
                      target={(p.buyLink && p.buyLink !== "#") ? "_blank" : undefined}
                      rel="noopener noreferrer"
                      onClick={(e) => {
                        if (onProductClick) {
                          e.preventDefault();
                          onProductClick(p);
                        } else if (!p.buyLink || p.buyLink === "#") {
                          e.preventDefault();
                        }
                      }}
                      className="flex flex-col space-y-2 cursor-pointer group hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 block"
                    >
                      {/* Product Image Wrapper */}
                      <div className="w-full aspect-[4/5] rounded-2xl bg-gray-100 relative overflow-hidden shadow-sm">
                        {p.imageUrl ? (
                          <img 
                            src={p.imageUrl} 
                            alt={p.title} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-300">
                            <ShoppingBag className="h-10 w-10" />
                          </div>
                        )}



                        {/* Badge */}
                        {p.badge && (
                          <span className="absolute bottom-2.5 left-2.5 bg-white text-[9px] font-black text-slate-800 px-2.5 py-1 rounded-md shadow-sm uppercase tracking-wide">
                            {p.badge}
                          </span>
                        )}
                      </div>

                      {/* Product Name & Price */}
                      <div className="px-1 text-left">
                        <h4 className="text-xs font-bold truncate leading-tight" style={{ color: globalTextColor }}>
                          {p.title}
                        </h4>
                        <span className="text-[11px] font-black block mt-0.5" style={{ color: globalTextColor, opacity: 0.7 }}>
                          ${p.price}
                        </span>
                      </div>
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full h-full bg-white flex flex-col relative overflow-hidden font-sans select-none text-slate-900">
      {renderTabContent()}

      {/* Bottom Navigation */}
      {bottomNavShow && (
        <div 
          className="absolute bottom-0 left-0 right-0 h-16 bg-white/95 backdrop-blur-md border-t border-gray-100 grid grid-cols-3 items-center px-4 shadow-[0_-4px_10px_rgba(0,0,0,0.03)] z-30"
        >
          <button
            onClick={() => {
              setSelectedCollectionId(null);
              setActiveTab("shop");
            }}
            className={`flex flex-col items-center justify-center flex-1 transition-all py-1 border-0 bg-transparent cursor-pointer hover:scale-[1.05] active:scale-95 ${
              activeTab === "shop" ? "font-extrabold" : "text-gray-400"
            }`}
            style={{ color: activeTab === "shop" ? globalTextColor : undefined }}
          >
            <Zap className="h-5 w-5" />
            <span className="text-[9px] font-black mt-1 tracking-wider uppercase">
              {lang === "tr" ? "Mağaza" : "Shop"}
            </span>
          </button>

          <button
            onClick={() => {
              setSelectedCollectionId(null);
              setActiveTab("explore");
            }}
            className={`flex flex-col items-center justify-center flex-1 transition-all py-1 border-0 bg-transparent cursor-pointer hover:scale-[1.05] active:scale-95 ${
              activeTab === "explore" ? "font-extrabold" : "text-gray-400"
            }`}
            style={{ color: activeTab === "explore" ? globalTextColor : undefined }}
          >
            <ShoppingBag className="h-5 w-5" />
            <span className="text-[9px] font-black mt-1 tracking-wider uppercase">
              {lang === "tr" ? "Tüm Ürünler" : "All Products"}
            </span>
          </button>

          <button
            onClick={() => {
              setSelectedCollectionId(null);
              setActiveTab("brands");
            }}
            className={`flex flex-col items-center justify-center flex-1 transition-all py-1 border-0 bg-transparent cursor-pointer hover:scale-[1.05] active:scale-95 ${
              activeTab === "brands" ? "font-extrabold" : "text-gray-400"
            }`}
            style={{ color: activeTab === "brands" ? globalTextColor : undefined }}
          >
            <Bookmark className="h-5 w-5" />
            <span className="text-[9px] font-black mt-1 tracking-wider uppercase">
              {lang === "tr" ? "Marka" : "Brand"}
            </span>
          </button>
        </div>
      )}
    </div>
  );
}
