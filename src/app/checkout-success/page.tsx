import React from "react";
import Link from "next/link";
import { CheckCircle2, ArrowRight, ShieldCheck, LayoutDashboard, Sparkles } from "lucide-react";
import { db } from "@/lib/db";

export const metadata = {
  title: "Ödeme Başarılı | Link.SaaS",
  description: "Eklentiniz başarıyla tanımlandı.",
};

interface PageProps {
  searchParams: Promise<{
    userId?: string;
    moduleId?: string;
  }>;
}

export default async function CheckoutSuccessPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const { userId, moduleId } = resolvedParams;

  // Modül bilgilerini eşleştir
  const moduleNames: Record<string, string> = {
    MINI_STORE: "Dijital Mağaza Modülü",
    CORP_EXEC: "Kurumsal Yönetici Kartı",
    COMIC_MANGA: "Şık & Sade Mağaza",
    RETRO: "Klasik Retro Mağaza",
    ACADEMIA: "Kolej Modülü",
    NEO_BRUTAL: "Neo Brutalist Vitrin",
    ORGANIC: "Organik & Doğal Vitrin",
    Y2K: "Neon & Gece Hayatı Vitrin",
    EDITORIAL_LUX: "Editöryel & Lüks Vitrin",
    GAMER_HUB: "Canlı & Popüler Vitrin",
    PREMIUM_CREATOR: "Premium Creator Vitrini",
    PREMIUM_VIDEO: "Premium Video Eğitimi",
    MUSIC_PODCAST: "Müzik & Podcast Çalar",
    PORTFOLIO_GALLERY: "Portfolyo & Galeri",
    COUNTDOWN_LAUNCH: "Geri Sayım & Lansman",
    TESTIMONIALS: "Müşteri Yorumları",
    SPOTIFY_CLASSIC: "Spotify Classic Player",
    VINYL_RETRO: "Retro Plak Oynatıcı",
    GLASS_AUDIO: "Modern Cam Efekti",
    NEON_CYBERPUNK: "Neon Cyberpunk Player",
    MINIMAL_LIGHT_AUDIO: "Minimalist Light Player",
    WEB3_NFT: "Web3 & NFT Koleksiyonu",
    FAQ: "Sıkça Sorulan Sorular",
    BOOKING: "Randevu & İletişim",
    NEWSLETTER: "Bülten Aboneliği",
    DONATION: "Dijital Kahve İkramı",
  };

  const currentModuleName = moduleId ? (moduleNames[moduleId] || moduleId) : "Premium Eklenti";

  return (
    <div className="min-h-screen bg-black text-white font-sans flex flex-col items-center justify-center relative overflow-hidden px-4">
      {/* Background gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-r from-neon-blue/20 to-light-blue/20 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-10 left-10 w-[300px] h-[300px] bg-purple-500/10 rounded-full blur-[100px] pointer-events-none z-0" />

      {/* Main card */}
      <div className="relative z-10 w-full max-w-md bg-zinc-950/80 backdrop-blur-2xl border border-zinc-800/80 rounded-[2.5rem] p-8 text-center shadow-2xl shadow-neon-blue/5">
        
        {/* Animated Check Icon */}
        <div className="mx-auto w-24 h-24 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-6 relative">
          <div className="absolute inset-0 rounded-full bg-emerald-500/5 animate-ping" />
          <CheckCircle2 className="h-12 w-12 text-emerald-400" />
        </div>

        {/* Header */}
        <div className="space-y-2 mb-6">
          <h1 className="text-3xl font-black tracking-tight text-white flex items-center justify-center gap-2">
            Ödeme Başarılı <Sparkles className="h-6 w-6 text-yellow-400 fill-yellow-400" />
          </h1>
          <p className="text-zinc-400 font-medium text-sm">
            İşleminiz onaylandı ve eklenti hesabınıza tanımlandı.
          </p>
        </div>

        {/* Details section */}
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5 mb-8 text-left space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-zinc-800/60">
            <span className="text-zinc-400 text-xs font-bold uppercase tracking-wider">Satın Alınan Modül</span>
            <span className="text-white text-sm font-black text-right">{currentModuleName}</span>
          </div>

          <div className="flex justify-between items-center pb-3 border-b border-zinc-800/60">
            <span className="text-zinc-400 text-xs font-bold uppercase tracking-wider">Durum</span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold">
              <ShieldCheck className="h-3.5 w-3.5" /> Aktif Edildi
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-zinc-400 text-xs font-bold uppercase tracking-wider">İşlem</span>
            <span className="text-zinc-500 text-xs font-mono font-bold">Mock Payment (Test)</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <Link
            href="/dashboard"
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-neon-blue to-light-blue hover:opacity-90 text-white font-bold flex items-center justify-center gap-2 transition-all border-0 shadow-lg shadow-neon-blue/15 cursor-pointer text-sm"
          >
            <LayoutDashboard className="h-4 w-4" /> Yönetim Paneline Git <ArrowRight className="h-4 w-4" />
          </Link>

          <Link
            href="/eklentiler"
            className="w-full py-4 rounded-2xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white font-bold transition-all border border-zinc-800 cursor-pointer text-sm"
          >
            Eklenti Mağazasına Dön
          </Link>
        </div>
      </div>
      
      {/* Footer copyright */}
      <div className="relative z-10 mt-12 text-zinc-650 text-xs font-bold tracking-wider">
        &copy; 2026 Link.SaaS. Tüm hakları saklıdır.
      </div>
    </div>
  );
}
