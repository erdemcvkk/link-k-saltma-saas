import React from "react";
import StorefrontPreview, { StoreThemeType, DummyProduct } from "@/components/storefront-preview";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Mağaza Temaları Showcase",
};

const DUMMY_PRODUCTS: DummyProduct[] = [
  {
    id: "p1",
    title: "Karanlık Drill Beat Paketi",
    type: "Müzik / Beat",
    price: "499",
    imageUrl: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=500&q=80",
  },
  {
    id: "p2",
    title: "Minimalist Notion Şablonu",
    type: "Dijital Dosya",
    price: "150",
    imageUrl: "https://images.unsplash.com/photo-1611224885990-ab7363d1f2a9?w=500&q=80",
  },
  {
    id: "p3",
    title: "1 Saatlik Danışmanlık",
    type: "Hizmet",
    price: "850",
    imageUrl: "https://images.unsplash.com/photo-1573164713988-8665fc963095?w=500&q=80",
  },
  {
    id: "p4",
    title: "Lightroom Preset Paketi",
    type: "Tasarım",
    price: "200",
    imageUrl: "https://images.unsplash.com/photo-1554046920-90dcac024a13?w=500&q=80",
  }
];

const THEMES: { id: StoreThemeType; name: string; desc: string; color: string }[] = [
  { id: "dark-drill", name: "Dark Drill / Cyberpunk", desc: "Beatmaker & Oyuncular İçin", color: "bg-red-500" },
  { id: "glassmorphism", name: "Premium Glassmorphism", desc: "Tasarımcılar & Sanatçılar İçin", color: "bg-purple-500" },
  { id: "minimalist", name: "Minimalist & Clean", desc: "Yazarlar & Danışmanlar İçin", color: "bg-zinc-800" },
  { id: "vibrant-pop", name: "Vibrant Creator Pop", desc: "Influencer'lar & Yayıncılar İçin", color: "bg-orange-500" },
  { id: "classic", name: "Classic E-Commerce", desc: "Fiziksel Ürün Satanlar İçin", color: "bg-blue-500" }
];

export default function StoreThemesShowcase() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans selection:bg-rose-500/30">
      <nav className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-[1600px] mx-auto px-6 h-20 flex items-center justify-between">
          <div>
            <h1 className="font-black text-2xl tracking-tighter text-white">
              Vitrin<span className="text-rose-500">.Temaları</span>
            </h1>
            <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mt-1">Mini Mağaza Tasarım Konseptleri</p>
          </div>
          <Link href="/admin" className="flex items-center gap-2 text-sm font-bold text-zinc-400 hover:text-white transition-colors">
            <ArrowLeft className="h-4 w-4" /> Admin'e Dön
          </Link>
        </div>
      </nav>

      <main className="max-w-[1600px] mx-auto px-6 py-12">
        <div className="flex overflow-x-auto pb-12 gap-12 snap-x snap-mandatory no-scrollbar">
          {THEMES.map((theme) => (
            <div key={theme.id} className="snap-center shrink-0 flex flex-col items-center">
              
              <div className="text-center mb-8 h-20 flex flex-col items-center justify-end">
                <div className={`w-3 h-3 rounded-full mb-3 ${theme.color} animate-pulse`} />
                <h2 className="text-2xl font-black text-white mb-1">{theme.name}</h2>
                <p className="text-sm font-medium text-zinc-400">{theme.desc}</p>
              </div>

              {/* Phone Mockup Frame */}
              <div className="relative w-[340px] h-[680px] bg-zinc-900 rounded-[3rem] p-3 shadow-2xl border-4 border-zinc-800 overflow-hidden shrink-0 group">
                <div className="absolute top-0 inset-x-0 h-7 bg-zinc-900 z-20 rounded-b-3xl w-[40%] mx-auto shadow-sm" />
                
                <div className="relative w-full h-full bg-[#f8f9fa] rounded-[2rem] overflow-hidden">
                  <StorefrontPreview 
                    theme={theme.id} 
                    products={DUMMY_PRODUCTS} 
                    storeTitle="Sana Özel Vitrin" 
                    storeCoverUrl="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000"
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
