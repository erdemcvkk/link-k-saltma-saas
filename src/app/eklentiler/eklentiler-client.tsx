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
 username: string;
 bio: string;
 avatarUrl: string;
 coverUrl?: string;
}

export const ADDON_TYPES: AddonTypeData[] = [
 // ── Original 5 ──
 { 
 id: "MINI_STORE", 
 name: "Dijital Mağaza Modülü", 
 desc: "Ürünlerinizi doğrudan profilinizde satın.", 
 color: "bg-orange-500",
 theme: "vibrant-pop",
 price: "349",
 username: "@creative.zeynep",
 bio: "İçerik Üreticisi & YouTuber",
 avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80",
 mockProducts: [
 { id: "p1", title: "Video Düzenleme Masterclass'ı", type: "Kurs", price: "750", imageUrl: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=500&q=80" },
 { id: "p2", title: "Sosyal Medya İçerik Takvimi", type: "Şablon", price: "200", imageUrl: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=500&q=80" },
 ]
 },
 { 
 id: "BOOKING", 
 name: "Randevu & Danışmanlık", 
 desc: "1-1 Görüşmeler ve toplantılar ayarlayın.", 
 color: "bg-zinc-800",
 theme: "minimalist",
 price: "249",
 username: "@coach.mehmet",
 bio: "Yazar & Kariyer Danışmanı",
 avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80",
 mockProducts: [
 { id: "b1", title: "1 Saatlik UI/UX Danışmanlığı", type: "Toplantı", price: "850", imageUrl: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=500&q=80" },
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
 username: "@artisan.studio",
 bio: "Dijital Sanatçı & Fotoğrafçı",
 avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&q=80",
 coverUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1000&q=80",
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
 username: "@darkbeat_prod",
 bio: "Müzik Prodüktörü & Tasarımcı",
 avatarUrl: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=200&q=80",
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
 username: "@pixelcraft.design",
 bio: "Premium Dijital Ürün Mağazası",
 avatarUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&q=80",
 coverUrl: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1000&q=80",
 mockProducts: [
 { id: "d1", title: "Bana Bir Kahve Ismarla", type: "Destek", price: "50", imageUrl: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500&q=80" },
 { id: "d2", title: "Büyük Destek", type: "Destek", price: "250", imageUrl: "https://images.unsplash.com/photo-1556740749-887f6717d7e4?w=500&q=80" },
 ]
 },
 // ── NEW 5 THEMES ──
 {
 id: "NEO_BRUTAL",
 name: "Neo-Brutalism Vitrini",
 desc: "Geliştiriciler ve sokak modası için sert tasarım.",
 color: "bg-[#caff4a]",
 theme: "neo-brutalism",
 price: "299",
 username: "@dev.manifest",
 bio: "Full-Stack Geliştirici & Tasarımcı",
 avatarUrl: "https://images.unsplash.com/photo-1599566150163-29194dcabd9c?w=200&q=80",
 mockProducts: [
 { id: "nb1", title: "Terminal VS Code Eklentisi", type: "Eklenti", price: "120", imageUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=500&q=80" },
 { id: "nb2", title: "Brutalist React Kit", type: "Kod", price: "500", imageUrl: "https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=500&q=80" },
 ]
 },
 {
 id: "ORGANIC",
 name: "Organic Earth Vitrini",
 desc: "Sağlık koçları ve el yapımı ürünler için.",
 color: "bg-[#8fbc6a]",
 theme: "organic-earth",
 price: "249",
 username: "@naturel.coach",
 bio: "Holistik Sağlık & Beslenme Koçu",
 avatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80",
 mockProducts: [
 { id: "oe1", title: "Holistik Beslenme Rehberi", type: "E-Kitap", price: "180", imageUrl: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=500&q=80" },
 { id: "oe2", title: "30 Günlük Detoks Programı", type: "Program", price: "450", imageUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&q=80" },
 ]
 },
 {
 id: "RETRO",
 name: "Retro 8-Bit Arcade Vitrini",
 desc: "Indie geliştiriciler ve çizerler için.",
 color: "bg-[#00ffc8]",
 theme: "retro-arcade",
 price: "199",
 username: "@PIXEL_DEV",
 bio: "Indie Oyun Geliştiricisi",
 avatarUrl: "https://images.unsplash.com/photo-1566753323558-f4e0952af115?w=200&q=80",
 mockProducts: [
 { id: "ra1", title: "16-Bit Sprite Paketi", type: "Asset", price: "250", imageUrl: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=500&q=80" },
 { id: "ra2", title: "Chiptune Müzik Paketi", type: "Müzik", price: "200", imageUrl: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=500&q=80" },
 ]
 },
 {
 id: "ACADEMIA",
 name: "Dark Academia Vitrini",
 desc: "Yazarlar ve tarih/sanat üreticileri için.",
 color: "bg-[#b4963c]",
 theme: "dark-academia",
 price: "199",
 username: "@the.quill",
 bio: "Yazar & Şair",
 avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80",
 mockProducts: [
 { id: "da1", title: "Gotik Şiir Derlemesi (PDF)", type: "E-Kitap", price: "150", imageUrl: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=500&q=80" },
 { id: "da2", title: "Daktilo Yazı Fontu", type: "Font", price: "200", imageUrl: "https://images.unsplash.com/photo-1504691342899-4d92b50853e1?w=500&q=80" },
 ]
 },
 {
 id: "Y2K",
 name: "Y2K Holographic Vitrini",
 desc: "Moda influencer'ları ve pop sanatçıları için.",
 color: "bg-gradient-to-r from-[#ff6ec7] to-[#7873f5]",
 theme: "y2k-holographic",
 price: "299",
 username: "@glitter.queen",
 bio: "Moda & Lifestyle Influencer",
 avatarUrl: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=200&q=80",
 mockProducts: [
 { id: "y1", title: "2000'ler Nostalji Filtreleri", type: "Filtre", price: "200", imageUrl: "https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=500&q=80" },
 { id: "y2", title: "Holografik Sticker Paketi", type: "Tasarım", price: "120", imageUrl: "https://images.unsplash.com/photo-1550684376-efcbd6e3f031?w=500&q=80" },
 ]
 },
 {
 id: "PREMIUM_CREATOR",
 name: "Premium Creator Vitrini",
 desc: "Dijital ürünlerinizi en zarif ve lüks şekilde sunun.",
 color: "bg-zinc-900",
 theme: "premium-creator",
 price: "899",
 username: "@kreator",
 bio: "Premium Beatmaker & Eğitmen",
 avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80",
 mockProducts: [
 { id: "pc1", title: "Mastering Eğitimi (Video)", type: "Eğitim", price: "450", imageUrl: "https://images.unsplash.com/photo-1516280440503-66f837ce5b97?w=500&q=80" },
 { id: "pc2", title: "Özel Lo-Fi Beat Paketi", type: "Beat", price: "300", imageUrl: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=500&q=80" },
 ]
 },
 {
 id: "PREMIUM_VIDEO",
 name: "Premium Video Vitrini",
 desc: "Eğitim veya Masterclass videolarınızı sinematik şekilde sunun.",
 color: "bg-red-500",
 theme: "premium-video",
 price: "0",
 username: "@masterclass",
 bio: "Video Eğitimi",
 avatarUrl: "",
 mockProducts: []
 }
];

interface EklentilerClientProps {
 products?: DummyProduct[];
 settings?: Record<string, string>;
}

export default function EklentilerClient({ products, settings }: EklentilerClientProps = {}) {
 const [purchasing, setPurchasing] = useState<string | null>(null);
 const [purchased, setPurchased] = useState<string[]>([]);
 const [visibleCount, setVisibleCount] = useState(12);

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
 <div className="max-w-full md:w-[1800px] mx-auto px-6 h-16 flex items-center justify-between">
 <Link href="/" className="font-black text-xl tracking-tighter text-white">
 Link.SaaS
 </Link>
 <div className="flex items-center gap-4">
 <Link href="/dashboard" className="text-sm font-bold text-zinc-400 hover:text-white">
 Dashboard&apos;a Dön
 </Link>
 </div>
 </div>
 </nav>

 <main className="max-w-full md:w-[1800px] mx-auto px-6 py-16">
 <div className="text-center max-w-2xl mx-auto mb-16">
 <div className="inline-flex items-center gap-2 px-4 py-3 md:py-2 rounded-full bg-rose-500/10 text-rose-500 font-bold text-sm mb-6">
 <Zap className="h-4 w-4" />
 <span>10 Premium Eklenti Vitrini</span>
 </div>
 <h1 className="text-2xl md:text-4xl md:text-6xl font-black text-white tracking-tight mb-6">
 Profilinize <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-orange-500">Güç Katın</span>
 </h1>
 <p className="text-lg text-zinc-400 font-medium">
 İhtiyacınıza uygun modülü seçin, tek seferlik ödemeyle ömür boyu kullanın. 10 farklı premium tema arasından seçim yapın.
 </p>
 </div>

 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12 pb-12">
 {ADDON_TYPES.slice(0, visibleCount).map((addon) => {
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
 <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80')] bg-cover bg-center opacity-80 group-hover:scale-105 transition-transform duration-700" />
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
 <div className="text-2xl font-black text-white">₺{displayPrice}</div>
 {isPurchased ? (
 <button disabled className="w-full py-3 rounded-xl bg-green-500/20 text-green-500 font-bold flex items-center justify-center gap-2">
 <ShoppingBag className="h-4 w-4" /> Satın Alındı
 </button>
 ) : (
 <button 
 onClick={() => {
 if (paymentUrl) {
 window.location.href = paymentUrl;
 } else {
 handlePurchase(addon.id);
 }
 }}
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
