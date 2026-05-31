"use client";

import { useState } from "react";
import { Sparkles, X, ArrowRight, ExternalLink } from "lucide-react";
import Link from "next/link";

interface FloatingUpgradePromptProps {
 currentPlan: string;
 globalSettings?: Record<string, string>;
}

export default function FloatingUpgradePrompt({ currentPlan, globalSettings }: FloatingUpgradePromptProps) {
 const [isVisible, setIsVisible] = useState(true);

 // Render only if the user is on the FREE plan and the component is set to visible
 if (currentPlan !== "FREE" || !isVisible) return null;

 const starterLink = globalSettings?.["payment_link_starter"];
 const creatorLink = globalSettings?.["payment_link_creator"];

 // Best available payment link for the CTA button
 const bestPaymentLink = starterLink || creatorLink;

 return (
 <div className="fixed bottom-4 right-4 z-50 max-w-sm w-full p-0.5 rounded-3xl bg-gradient-to-tr from-purple-600 via-fuchsia-500 to-indigo-500 shadow-[0_10px_30px_rgba(168,85,247,0.3)] hover:shadow-[0_12px_40px_rgba(168,85,247,0.45)] transition-all duration-300 animate-in fade-in slide-in-from-bottom-5">
 <div className="relative bg-zinc-950 p-4 md:p-5 rounded-[22px] overflow-hidden space-y-4">
 
 {/* Soft Ambient Light inside Card */}
 <div className="absolute -top-12 -right-12 w-24 h-24 bg-purple-500/20 rounded-full blur-2xl pointer-events-none" />

 {/* Header with Title and Close Button */}
 <div className="flex items-start justify-between gap-4">
 <div className="flex items-center gap-2">
 <div className="w-7 h-7 rounded-full bg-purple-950/40 border border-purple-500/30 flex items-center justify-center text-purple-400 animate-pulse">
 <Sparkles className="h-4 w-4" />
 </div>
 <span className="text-xs font-black tracking-widest text-purple-400 uppercase">
 Premium Yükseltme
 </span>
 </div>
 <button 
 onClick={() => setIsVisible(false)}
 className="p-1 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-white transition-all cursor-pointer"
 >
 <X className="h-3 w-3" />
 </button>
 </div>

 {/* Content */}
 <div className="space-y-1.5">
 <h4 className="text-sm font-extrabold text-white leading-snug">
 ⚡ Sınırları Kaldır!
 </h4>
 <p className="text-zinc-400 text-[10px] leading-relaxed">
 Premium'a geçerek sınırsız link, premium neon temalar, gelişmiş analizler ve akıllı iletişim butonlarını hemen etkinleştirin.
 </p>
 </div>

 {/* Action Button - Direct payment link if available */}
 <div className="pt-1">
 {bestPaymentLink ? (
 <a
 href={bestPaymentLink}
 target="_blank"
 rel="noopener noreferrer"
 className="w-full py-3 md:py-2.5 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 text-white font-extrabold text-[11px] tracking-wider transition-all flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(168,85,247,0.2)]"
 >
 HEMEN SATIN AL
 <ExternalLink className="h-3 w-3 opacity-60" />
 </a>
 ) : (
 <Link
 href="/dashboard/billing"
 className="w-full py-3 md:py-2.5 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 text-white font-extrabold text-[11px] tracking-wider transition-all flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(168,85,247,0.2)]"
 >
 PAKETLERİ İNCELE
 <ArrowRight className="h-3.5 w-3.5" />
 </Link>
 )}
 </div>
 </div>
 </div>
 );
}
