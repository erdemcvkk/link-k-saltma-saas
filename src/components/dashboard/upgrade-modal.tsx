"use client";

import { X, Sparkles, ShieldCheck, Zap, Heart } from "lucide-react";
import Link from "next/link";

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
}

export default function UpgradeModal({ isOpen, onClose, title, description }: UpgradeModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl bg-zinc-950 border border-purple-500/30 p-6 text-center shadow-[0_0_50px_rgba(168,85,247,0.15)] animate-in fade-in zoom-in-95 duration-200">
        
        {/* Decorative Light Glow */}
        <div className="absolute -top-16 -left-16 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -right-16 w-32 h-32 bg-fuchsia-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-white transition-all cursor-pointer"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Premium Icon Header */}
        <div className="mx-auto w-12 h-12 rounded-full bg-gradient-to-tr from-purple-600 to-fuchsia-500 flex items-center justify-center text-white mb-4 shadow-[0_0_20px_rgba(168,85,247,0.4)]">
          <Sparkles className="h-6 w-6 animate-pulse" />
        </div>

        {/* Modal Text */}
        <h3 className="text-xl font-black bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-fuchsia-400 uppercase tracking-wide">
          {title || "PREMIUM ÖZELLİK"}
        </h3>
        
        <p className="mt-3 text-zinc-400 text-xs leading-relaxed">
          {description || "Bu özellik Premium pakete özeldir. Sınırları kaldırarak sınırsız link, özel temalar, gelişmiş analitik ve kendi alan adınızı ekleme fırsatını yakalayın!"}
        </p>

        {/* Mini Features List */}
        <div className="mt-5 space-y-2.5 text-left bg-zinc-900/50 border border-zinc-900 p-4 rounded-2xl">
          <div className="flex items-center gap-2 text-[10px] text-zinc-300 font-bold">
            <Zap className="h-3.5 w-3.5 text-purple-400 shrink-0" />
            <span>Sınırsız Link Ekleme & Şablonlar</span>
          </div>
          <div className="flex items-center gap-2 text-[10px] text-zinc-300 font-bold">
            <Heart className="h-3.5 w-3.5 text-purple-400 shrink-0" />
            <span>Gelişmiş RGB & Neon Temalar</span>
          </div>
          <div className="flex items-center gap-2 text-[10px] text-zinc-300 font-bold">
            <ShieldCheck className="h-3.5 w-3.5 text-purple-400 shrink-0" />
            <span>Kendi Özel Alan Adınız (Custom Domain)</span>
          </div>
        </div>

        {/* Upgrade Button */}
        <div className="mt-6 flex flex-col gap-2">
          <Link
            href="/dashboard/billing"
            onClick={onClose}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 text-white font-extrabold text-xs tracking-wider transition-all shadow-[0_0_20px_rgba(168,85,247,0.3)] hover:shadow-[0_0_25px_rgba(168,85,247,0.4)] flex items-center justify-center gap-1.5"
          >
            <Sparkles className="h-4 w-4" />
            HEMEN PLANLARI İNCELE
          </Link>
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-transparent border border-zinc-900 hover:bg-zinc-900/50 text-zinc-500 hover:text-zinc-300 font-bold text-xs transition-all cursor-pointer"
          >
            Daha Sonra
          </button>
        </div>
      </div>
    </div>
  );
}
