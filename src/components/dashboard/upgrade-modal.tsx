"use client";

import { X, Sparkles, ShieldCheck, Zap, Heart, ExternalLink } from "lucide-react";
import Link from "next/link";

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  globalSettings?: Record<string, string>;
}

export default function UpgradeModal({ isOpen, onClose, title, description, globalSettings }: UpgradeModalProps) {
  if (!isOpen) return null;

  const starterLink = globalSettings?.["payment_link_starter"];
  const creatorLink = globalSettings?.["payment_link_creator"];
  const proLink = globalSettings?.["payment_link_pro"];

  const hasAnyPaymentLink = !!(starterLink || creatorLink || proLink);

  const priceStarter = globalSettings?.["price_starter"] || "150";
  const priceCreator = globalSettings?.["price_creator"] || "450";
  const pricePro = globalSettings?.["price_pro"] || "950";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 font-corporate">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl bg-zinc-950 border border-slate-800 p-3 md:p-6 text-center shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        
        {/* Decorative Light Glow */}
        <div className="absolute -top-16 -left-16 w-32 h-32 bg-neon-blue/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -right-16 w-32 h-32 bg-light-blue/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-white transition-all cursor-pointer"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Premium Icon Header */}
        <div className="mx-auto w-12 h-12 rounded-full bg-gradient-to-tr from-neon-blue to-light-blue flex items-center justify-center text-white mb-4 shadow-lg shadow-neon-blue/25">
          <Sparkles className="h-6 w-6 animate-pulse" />
        </div>

        {/* Modal Text */}
        <h3 className="text-xl font-black bg-clip-text text-transparent bg-gradient-to-r from-neon-blue to-light-blue uppercase tracking-wide">
          {title || "PREMIUM ÖZELLİK"}
        </h3>
        
        <p className="mt-3 text-zinc-400 text-xs leading-relaxed font-semibold">
          {description || "Bu özellik Premium pakete özeldir. Sınırları kaldırarak sınırsız link, özel temalar, gelişmiş analitik ve kendi alan adınızı ekleme fırsatını yakalayın!"}
        </p>

        {/* Mini Features List */}
        <div className="mt-5 space-y-2.5 text-left bg-zinc-900/50 border border-zinc-900/80 p-4 rounded-2xl">
          <div className="flex items-center gap-2 text-[10px] text-zinc-300 font-bold">
            <Zap className="h-3.5 w-3.5 text-neon-blue shrink-0" />
            <span>Sınırsız Bağlantı Ekleme, Premium Temalar & Animasyonlar</span>
          </div>
          <div className="flex items-center gap-2 text-[10px] text-zinc-300 font-bold">
            <Heart className="h-3.5 w-3.5 text-neon-blue shrink-0" />
            <span>Gelişmiş Analiz Paneli & Medya Entegrasyonları</span>
          </div>
          <div className="flex items-center gap-2 text-[10px] text-zinc-300 font-bold">
            <ShieldCheck className="h-3.5 w-3.5 text-neon-blue shrink-0" />
            <span>Platform Logosunu Kaldırma (Whitelabel) & Shopier Vitrini</span>
          </div>
        </div>

        {/* Payment Links - Direct checkout buttons when available */}
        {hasAnyPaymentLink ? (
          <div className="mt-6 space-y-2">
            {starterLink && (
              <a
                href={starterLink}
                target="_blank"
                rel="noopener noreferrer"
                onClick={onClose}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 text-white font-extrabold text-xs tracking-wider transition-all shadow-[0_0_20px_rgba(168,85,247,0.3)] hover:shadow-[0_0_25px_rgba(168,85,247,0.4)] flex items-center justify-center gap-1.5"
              >
                <Sparkles className="h-4 w-4" />
                STARTER PLAN – {priceStarter}₺/Ay
                <ExternalLink className="h-3 w-3 ml-1 opacity-60" />
              </a>
            )}
            {creatorLink && (
              <a
                href={creatorLink}
                target="_blank"
                rel="noopener noreferrer"
                onClick={onClose}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-extrabold text-xs tracking-wider transition-all shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:shadow-[0_0_25px_rgba(99,102,241,0.4)] flex items-center justify-center gap-1.5"
              >
                <Sparkles className="h-4 w-4" />
                CREATOR PLAN – {priceCreator}₺/Ay
                <ExternalLink className="h-3 w-3 ml-1 opacity-60" />
              </a>
            )}
            {proLink && (
              <a
                href={proLink}
                target="_blank"
                rel="noopener noreferrer"
                onClick={onClose}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-extrabold text-xs tracking-wider transition-all shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:shadow-[0_0_25px_rgba(245,158,11,0.4)] flex items-center justify-center gap-1.5"
              >
                <Sparkles className="h-4 w-4" />
                PRO BUSINESS – {pricePro}₺/Ay
                <ExternalLink className="h-3 w-3 ml-1 opacity-60" />
              </a>
            )}
            <button
              onClick={onClose}
              className="w-full py-3 md:py-2.5 rounded-xl bg-transparent border border-zinc-900 hover:bg-zinc-900/50 text-zinc-500 hover:text-zinc-300 font-bold text-xs transition-all cursor-pointer"
            >
              Daha Sonra
            </button>
          </div>
        ) : (
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
              className="w-full py-3 md:py-2.5 rounded-xl bg-transparent border border-zinc-900 hover:bg-zinc-900/50 text-zinc-500 hover:text-zinc-300 font-bold text-xs transition-all cursor-pointer"
            >
              Daha Sonra
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
