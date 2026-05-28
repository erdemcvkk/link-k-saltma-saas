"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowLeft, ShoppingBag, Zap, CreditCard, ChevronRight } from "lucide-react";

interface DummyProduct {
  id: string;
  title: string;
  price: number;
  imageUrl: string | null;
  buttonText: string | null;
  order: number;
}

interface EklentilerClientProps {
  products: DummyProduct[];
  settings: Record<string, string>;
}

export default function EklentilerClient({ products, settings }: EklentilerClientProps) {
  const [isHovering, setIsHovering] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const scrollSpeed = settings["storefront_scroll_speed"] || "normal";
  const fadeInStyle = settings["storefront_fade_in_style"] || "fade-in-up";
  
  // Auto-scroll simulation
  useEffect(() => {
    if (isHovering) return;
    const interval = setInterval(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollTop += 1;
        if (
          scrollRef.current.scrollTop >=
          scrollRef.current.scrollHeight - scrollRef.current.clientHeight
        ) {
          scrollRef.current.scrollTop = 0;
        }
      }
    }, scrollSpeed === "fast" ? 15 : scrollSpeed === "slow" ? 45 : 30);
    return () => clearInterval(interval);
  }, [isHovering, scrollSpeed]);

  const [clickedItem, setClickedItem] = useState<string | null>(null);

  const handlePurchase = (id: string) => {
    setClickedItem(id);
    setTimeout(() => setClickedItem(null), 300);
  };

  return (
    <div className="min-h-screen bg-zinc-50 font-sans">
      <nav className="border-b border-zinc-200 bg-white sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="font-black text-xl tracking-tighter text-slate-900">
            Link.SaaS
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-sm font-bold text-slate-500 hover:text-slate-900">
              Dashboard
            </Link>
          </div>
        </div>
      </nav>

      <main className="pt-24 pb-24 px-4 max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Side: Copy & CTA */}
          <div className="space-y-8 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose-500/10 text-rose-600 font-bold text-sm">
              <Zap className="h-4 w-4" />
              <span>Mini Mağaza Modülü</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight">
              Kendi Ürünlerinizi <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-orange-500">
                Saniyeler İçinde Satın
              </span>
            </h1>
            <p className="text-lg text-slate-500 max-w-md mx-auto lg:mx-0 font-medium">
              E-kitap, beat, preset, danışmanlık veya fiziksel ürünlerinizi doğrudan profilinizde sergileyin. Müşterileriniz profilden ayrılmadan satın alsın.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
              <button className="px-8 py-4 rounded-xl bg-slate-900 text-white font-black hover:bg-slate-800 transition-all flex items-center justify-center gap-2 shadow-xl shadow-slate-900/20 hover:-translate-y-1">
                Eklentiyi Satın Al (₺349)
                <ShoppingBag className="h-5 w-5" />
              </button>
            </div>
            
            <div className="flex items-center justify-center lg:justify-start gap-6 pt-8 text-slate-400">
              <div className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                <span className="text-xs font-bold uppercase tracking-wider">Tek Seferlik Ödeme</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                <span className="text-xs font-bold uppercase tracking-wider">Hemen Aktif</span>
              </div>
            </div>
          </div>

          {/* Right Side: Giant Interactive Phone Mockup */}
          <div className="flex justify-center relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-rose-500/10 rounded-full blur-3xl -z-10" />
            
            <div className="relative w-[340px] h-[680px] bg-slate-900 rounded-[3rem] p-3 shadow-2xl border-4 border-slate-900 overflow-hidden transform transition-transform hover:scale-[1.02] duration-500">
              <div className="absolute top-0 inset-x-0 h-7 bg-slate-900 z-20 rounded-b-3xl w-[40%] mx-auto" />
              
              <div 
                className="relative w-full h-full bg-[#f8f9fa] rounded-[2rem] overflow-y-auto no-scrollbar"
                ref={scrollRef}
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
                style={{ scrollBehavior: 'smooth' }}
              >
                {/* Mockup Header */}
                <div className="bg-white p-6 pb-8 text-center border-b border-gray-100 shadow-sm sticky top-0 z-10">
                  <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-tr from-rose-400 to-orange-400 p-1 mb-3">
                    <div className="w-full h-full rounded-full bg-white flex items-center justify-center font-black text-xl text-slate-800">
                      JS
                    </div>
                  </div>
                  <h3 className="font-black text-lg text-slate-900">Jane's Store</h3>
                  <p className="text-xs font-bold text-slate-400">Digital Creator & Designer</p>
                </div>

                {/* Mockup Product Feed */}
                <div className="p-4 space-y-4">
                  {products.length === 0 ? (
                    <div className="text-center text-slate-400 text-sm font-medium py-10">
                      Ürün bulunamadı. Admin panelinden örnek ürün ekleyin.
                    </div>
                  ) : (
                    products.map((product, idx) => (
                      <div 
                        key={product.id}
                        className={`bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 transition-all duration-700 ${
                          fadeInStyle === 'zoom-in' ? 'animate-[zoomIn_0.5s_ease-out_forwards]' : 'animate-[slideUp_0.5s_ease-out_forwards]'
                        }`}
                        style={{ animationDelay: `${idx * 0.15}s` }}
                      >
                        {product.imageUrl && (
                          <div className="h-32 w-full bg-gray-100 relative overflow-hidden group cursor-pointer">
                            <img 
                              src={product.imageUrl} 
                              alt={product.title} 
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                          </div>
                        )}
                        <div className="p-4">
                          <h4 className="font-bold text-slate-800 mb-1 leading-tight">{product.title}</h4>
                          <div className="text-rose-500 font-black text-lg mb-3">₺{product.price.toLocaleString("tr-TR")}</div>
                          
                          <button 
                            onClick={() => handlePurchase(product.id)}
                            className={`w-full py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold flex items-center justify-center gap-2 transition-all duration-200 ${
                              clickedItem === product.id ? "scale-95 bg-rose-500" : "hover:bg-slate-800"
                            }`}
                          >
                            {product.buttonText || "Satın Al"}
                            <ChevronRight className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                
                {/* Mockup Footer */}
                <div className="py-8 text-center text-[10px] font-bold text-slate-300">
                  Powered by Link.SaaS
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
