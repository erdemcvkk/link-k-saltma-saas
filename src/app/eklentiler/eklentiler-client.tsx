"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ShoppingBag, Zap, CreditCard, ChevronRight } from "lucide-react";
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
}

const ADDON_TYPES: AddonTypeData[] = [
  { 
    id: "MINI_STORE", 
    name: "Dijital Mağaza Modülü", 
    desc: "Ürünlerinizi doğrudan profilinizde satın.", 
    color: "bg-orange-500",
    theme: "vibrant-pop",
    price: "349",
    mockProducts: [
      { id: "p1", title: "Karanlık Drill Beat Paketi", type: "Müzik", price: "499", imageUrl: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=500&q=80" },
      { id: "p2", title: "Minimalist Notion Şablonu", type: "Şablon", price: "150", imageUrl: "https://images.unsplash.com/photo-1611224885990-ab7363d1f2a9?w=500&q=80" },
    ]
  },
  { 
    id: "BOOKING", 
    name: "Randevu & Danışmanlık", 
    desc: "1-1 Görüşmeler ve toplantılar ayarlayın.", 
    color: "bg-zinc-800",
    theme: "minimalist",
    price: "249",
    mockProducts: [
      { id: "b1", title: "1 Saatlik UI/UX Danışmanlığı", type: "Toplantı", price: "850", imageUrl: "https://images.unsplash.com/photo-1573164713988-8665fc963095?w=500&q=80" },
      { id: "b2", title: "Hızlı Kod İncelemesi", type: "Toplantı", price: "400", imageUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=500&q=80" },
    ]
  },
  { 
    id: "NEWSLETTER", 
    name: "Bülten & Abonelik", 
    desc: "Takipçilerinizden e-posta toplayın.", 
    color: "bg-purple-500",
    theme: "glassmorphism",
    price: "199",
    mockProducts: [
      { id: "n1", title: "Haftalık Tasarım Bülteni", type: "Abonelik", price: "0", imageUrl: "https://images.unsplash.com/photo-1554046920-90dcac024a13?w=500&q=80" },
    ]
  },
  { 
    id: "QA", 
    name: "Soru & Cevap (AMA)", 
    desc: "Ücretli veya ücretsiz sorular alın.", 
    color: "bg-red-500",
    theme: "dark-drill",
    price: "149",
    mockProducts: [
      { id: "q1", title: "Öncelikli Soru Sor", type: "Soru", price: "50", imageUrl: "https://images.unsplash.com/photo-1516259762381-22954d7d3ad2?w=500&q=80" },
    ]
  },
  { 
    id: "DONATION", 
    name: "Bağış & Destek", 
    desc: "Takipçilerinizden destek alın (Kahve Ismarla).", 
    color: "bg-blue-500",
    theme: "classic",
    price: "99",
    mockProducts: [
      { id: "d1", title: "Bana Bir Kahve Ismarla", type: "Destek", price: "50", imageUrl: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500&q=80" },
      { id: "d2", title: "Büyük Destek", type: "Destek", price: "250", imageUrl: "https://images.unsplash.com/photo-1556740749-887f6717d7e4?w=500&q=80" },
    ]
  }
];

export default function EklentilerClient() {
  const [purchasing, setPurchasing] = useState<string | null>(null);
  const [purchased, setPurchased] = useState<string[]>([]);

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
    <div className="min-h-screen bg-zinc-950 font-sans">
      <nav className="border-b border-zinc-800 bg-zinc-950/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-[1600px] mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="font-black text-xl tracking-tighter text-white">
            Link.SaaS
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-sm font-bold text-zinc-400 hover:text-white">
              Dashboard'a Dön
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-[1600px] mx-auto px-6 py-16">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose-500/10 text-rose-500 font-bold text-sm mb-6">
            <Zap className="h-4 w-4" />
            <span>Premium Eklentiler</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight mb-6">
            Profilinize <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-orange-500">Güç Katın</span>
          </h1>
          <p className="text-lg text-zinc-400 font-medium">
            İhtiyacınıza uygun modülü seçin, tek seferlik ödemeyle ömür boyu kullanın. Üstelik dashboard'unuzdan dilediğiniz temayı seçebilirsiniz.
          </p>
        </div>

        <div className="flex overflow-x-auto pb-12 gap-12 snap-x snap-mandatory no-scrollbar">
          {ADDON_TYPES.map((addon) => {
            const isPurchased = purchased.includes(addon.id);
            const isProcessing = purchasing === addon.id;
            
            return (
              <div key={addon.id} className="snap-center shrink-0 flex flex-col items-center w-[340px]">
                
                <div className="text-center mb-8 h-20 flex flex-col items-center justify-end">
                  <div className={`w-3 h-3 rounded-full mb-3 ${addon.color} animate-pulse`} />
                  <h2 className="text-2xl font-black text-white mb-1">{addon.name}</h2>
                  <p className="text-sm font-medium text-zinc-400">{addon.desc}</p>
                </div>

                {/* Phone Mockup Frame */}
                <div className="relative w-full h-[680px] bg-zinc-900 rounded-[3rem] p-3 shadow-2xl border-4 border-zinc-800 overflow-hidden shrink-0 group mb-6">
                  <div className="absolute top-0 inset-x-0 h-7 bg-zinc-900 z-20 rounded-b-3xl w-[40%] mx-auto shadow-sm" />
                  
                  <div className="relative w-full h-full bg-[#f8f9fa] rounded-[2rem] overflow-hidden">
                    <StorefrontPreview 
                      theme={addon.theme} 
                      products={addon.mockProducts} 
                      storeTitle={addon.name} 
                      username={"@creator_" + addon.theme.split('-')[0]}
                      avatarUrl={
                        addon.theme === "dark-drill" ? "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=200&q=80" :
                        addon.theme === "glassmorphism" ? "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&q=80" :
                        addon.theme === "minimalist" ? "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80" :
                        addon.theme === "vibrant-pop" ? "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80" :
                        "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&q=80"
                      }
                      storeCoverUrl={
                        addon.theme === "glassmorphism" ? "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1000&q=80" :
                        addon.theme === "classic" ? "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1000&q=80" : undefined
                      }
                    />
                  </div>
                </div>

                {/* Buy Section */}
                <div className="w-full bg-zinc-900 rounded-2xl p-4 border border-zinc-800 text-center flex flex-col gap-3">
                  <div className="text-2xl font-black text-white">₺{addon.price}</div>
                  {isPurchased ? (
                    <button disabled className="w-full py-3 rounded-xl bg-green-500/20 text-green-500 font-bold flex items-center justify-center gap-2">
                      <ShoppingBag className="h-4 w-4" /> Satın Alındı
                    </button>
                  ) : (
                    <button 
                      onClick={() => handlePurchase(addon.id)}
                      disabled={isProcessing}
                      className="w-full py-3 rounded-xl bg-rose-600 text-white font-bold flex items-center justify-center gap-2 hover:bg-rose-500 transition-colors disabled:opacity-50"
                    >
                      {isProcessing ? "İşleniyor..." : "Hemen Satın Al"}
                    </button>
                  )}
                  <p className="text-xs text-zinc-500 font-medium">Tek Seferlik Ödeme</p>
                </div>

              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
