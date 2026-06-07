"use client";

import React, { useState } from "react";
import { Heart, ShoppingBag, Zap, Eye, Bookmark, User, Plus } from "lucide-react";

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

export interface StorefrontConfig {
  heroBgUrl?: string;
  heroSub?: string;
  heroTitle?: string;
  heroDesc?: string;
  heroBtnText?: string;
  heroBtnLink?: string;
  collections?: StorefrontCollection[];
  bottomNav?: {
    show: boolean;
    items?: Array<{
      label: string;
      link: string;
      icon: "Shop" | "Explore" | "Brands" | "Profile";
    }>;
  };
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
  // Default fallback values
  const heroBgUrl = config.heroBgUrl || "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80";
  const heroSub = config.heroSub || "SPRING COLLECTION";
  const heroTitle = config.heroTitle || "20% OFF";
  const heroDesc = config.heroDesc || "For Selected Spring Style";
  const heroBtnText = config.heroBtnText || "Shop now";
  const heroBtnLink = config.heroBtnLink || "#";

  const collections = config.collections || [
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

  const bottomNavShow = config.bottomNav?.show !== false;
  const bottomNavItems = config.bottomNav?.items || [
    { label: "Shop", link: "#", icon: "Shop" as const },
    { label: "Explore", link: "#", icon: "Explore" as const },
    { label: "Brands", link: "#", icon: "Brands" as const },
    { label: "Profile", link: "#", icon: "Profile" as const },
  ];

  const renderNavIcon = (iconType: string) => {
    switch (iconType) {
      case "Shop":
        return <Zap className="h-5 w-5" />;
      case "Explore":
        return <Eye className="h-5 w-5" />;
      case "Brands":
        return <Bookmark className="h-5 w-5" />;
      case "Profile":
        return <User className="h-5 w-5" />;
      default:
        return <Zap className="h-5 w-5" />;
    }
  };

  const handleProductClick = (product: StorefrontProduct) => {
    if (onProductClick) {
      onProductClick(product);
      return;
    }
    if (product.buyLink && product.buyLink !== "#") {
      window.open(product.buyLink, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div className="w-full h-full bg-white flex flex-col relative overflow-hidden font-sans select-none text-slate-900">
      {/* Scrollable Container */}
      <div className="flex-1 overflow-y-auto no-scrollbar pb-24">
        {/* Hero Section */}
        <div 
          className="w-full h-[360px] md:h-[400px] relative bg-cover bg-center flex flex-col justify-between p-6"
          style={{ backgroundImage: `url(${heroBgUrl})` }}
        >
          {/* Dark overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/10 to-black/40 z-0 pointer-events-none" />

          {/* Hero Header Icons */}
          <div className="w-full flex justify-end gap-4 relative z-10">
            <button type="button" className="w-9 h-9 rounded-full bg-black/10 backdrop-blur-md hover:bg-black/20 flex items-center justify-center transition-colors border-0">
              <Heart className="h-4.5 w-4.5 text-white" />
            </button>
            <button type="button" className="w-9 h-9 rounded-full bg-black/10 backdrop-blur-md hover:bg-black/20 flex items-center justify-center transition-colors border-0">
              <ShoppingBag className="h-4.5 w-4.5 text-white" />
            </button>
          </div>

          {/* Hero Typography & Content */}
          <div className="w-full space-y-4 relative z-10 mt-auto">
            <div className="space-y-1">
              <span className="text-[10px] tracking-[0.25em] font-extrabold text-white/95 uppercase select-none">
                {heroSub}
              </span>
              <div className="w-16 h-[1.5px] bg-white/80" />
            </div>

            <h1 className="text-4xl md:text-5xl font-black text-white leading-none tracking-tight">
              {heroTitle}
            </h1>
            <p className="text-sm font-semibold text-white/90 leading-tight">
              {heroDesc}
            </p>

            <div className="flex items-center justify-between pt-1">
              {/* Pagination indicators mockup */}
              <div className="flex gap-1.5 items-center">
                <span className="w-1.5 h-1.5 rounded-full bg-white/40"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-white flex items-center justify-center p-0.5 shadow-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-900"></span>
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-white/40"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-white/40"></span>
              </div>

              {/* Shop now button */}
              <a 
                href={heroBtnLink} 
                target={heroBtnLink !== "#" ? "_blank" : undefined}
                rel="noopener noreferrer"
                className="px-6 py-2.5 bg-[#17181a] hover:bg-black text-white font-bold text-xs rounded-full tracking-wide transition-all border-0 shadow-lg shadow-black/20 text-center"
              >
                {heroBtnText}
              </a>
            </div>
          </div>
        </div>

        {/* Collections */}
        <div className="p-6 space-y-8">
          {collections.map((col) => (
            <div key={col.id} className="space-y-4">
              {/* Collection Header */}
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-black tracking-tight text-slate-800">
                  {col.title}
                </h3>
                {col.showAllLink && (
                  <a 
                    href={col.showAllLink} 
                    className="text-xs font-bold text-gray-400 hover:text-slate-600 transition-colors uppercase tracking-wider"
                  >
                    {lang === "tr" ? "Tümünü Gör" : "Show all"}
                  </a>
                )}
              </div>

              {/* Products Render */}
              {col.displayType === "horizontal-scroll" ? (
                /* Horizontal Scroll View */
                <div className="flex overflow-x-auto gap-4 snap-x snap-mandatory no-scrollbar pb-2 -mx-6 px-6">
                  {col.products.map((p) => (
                    <div 
                      key={p.id} 
                      className="w-[160px] flex-shrink-0 snap-start space-y-2 cursor-pointer group"
                      onClick={() => handleProductClick(p)}
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

                        {/* Heart Button */}
                        <button 
                          type="button" 
                          onClick={(e) => {
                            e.stopPropagation();
                            // Optional local state toggle or callback
                          }}
                          className="absolute top-2.5 right-2.5 w-7.5 h-7.5 rounded-full bg-white flex items-center justify-center shadow-md border-0 hover:scale-105 transition-transform"
                        >
                          <Heart 
                            className={`h-3.5 w-3.5 ${p.isFavorite ? "text-red-500 fill-red-500" : "text-gray-400"}`} 
                          />
                        </button>

                        {/* Badge */}
                        {p.badge && (
                          <span className="absolute bottom-2.5 left-2.5 bg-white text-[9px] font-black text-slate-800 px-2.5 py-1 rounded-md shadow-sm uppercase tracking-wide">
                            {p.badge}
                          </span>
                        )}
                      </div>

                      {/* Product Name & Price */}
                      <div className="px-1 text-left">
                        <h4 className="text-xs font-bold text-slate-800 truncate leading-tight">
                          {p.title}
                        </h4>
                        <span className="text-[11px] font-black text-slate-500 block mt-0.5">
                          ${p.price}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                /* Grid / Vertical Columns View */
                <div className="grid grid-cols-2 gap-4">
                  {col.products.map((p) => (
                    <div 
                      key={p.id} 
                      className="flex flex-col space-y-2 cursor-pointer group"
                      onClick={() => handleProductClick(p)}
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

                        {/* Heart Button */}
                        <button 
                          type="button" 
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                          className="absolute top-2.5 right-2.5 w-7.5 h-7.5 rounded-full bg-white flex items-center justify-center shadow-md border-0 hover:scale-105 transition-transform"
                        >
                          <Heart 
                            className={`h-3.5 w-3.5 ${p.isFavorite ? "text-red-500 fill-red-500" : "text-gray-400"}`} 
                          />
                        </button>

                        {/* Badge */}
                        {p.badge && (
                          <span className="absolute bottom-2.5 left-2.5 bg-white text-[9px] font-black text-slate-800 px-2.5 py-1 rounded-md shadow-sm uppercase tracking-wide">
                            {p.badge}
                          </span>
                        )}
                      </div>

                      {/* Product Name & Price */}
                      <div className="px-1 text-left">
                        <h4 className="text-xs font-bold text-slate-800 truncate leading-tight">
                          {p.title}
                        </h4>
                        <span className="text-[11px] font-black text-slate-500 block mt-0.5">
                          ${p.price}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Navigation */}
      {bottomNavShow && (
        <div 
          className="absolute bottom-0 left-0 right-0 h-16 bg-white/95 backdrop-blur-md border-t border-gray-100 flex items-center justify-around px-4 shadow-[0_-4px_10px_rgba(0,0,0,0.03)] z-30"
        >
          {bottomNavItems.map((item, idx) => (
            <a 
              key={idx}
              href={item.link}
              className={`flex flex-col items-center justify-center flex-1 text-gray-400 hover:text-slate-800 transition-colors py-1 ${
                idx === 0 ? "text-slate-800 font-bold" : "text-gray-400"
              }`}
            >
              {renderNavIcon(item.icon)}
              <span className="text-[9px] font-bold mt-1 tracking-wider uppercase">
                {item.label}
              </span>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
