"use client";

import React from "react";
import { Laptop, Zap } from "lucide-react";
import UniversalProfile, { UniversalProfileData } from "@/components/universal-profile";

interface PhonePreviewProps {
  mode: "editor" | "template" | "plugin";
  data: UniversalProfileData;
  label?: string;
}

export default function PhonePreview({ mode, data, label }: PhonePreviewProps) {
  const { theme = "dark", plan, systemSettings } = data;
  
  const isLight = [
    "Minimalist Light", "Pastel Dream", "Abstract Fluid", 
    "Vintage Paper", "Vintage Journal", "Holographic Glass", "Aura Hologram"
  ].includes(theme);

  const renderAdBlock = () => {
    // Sadece FREE planındaysa ve reklam yayını aktifse göster
    if (plan !== "FREE") return null;
    if (!systemSettings || !systemSettings.isActive) return null;

    const handleUpgradeRedirect = (e: React.MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();
      window.location.href = "/dashboard/billing";
    };

    // 1. Google AdSense / Script Entegrasyonu
    if (systemSettings.adScript) {
      return (
        <div className="mt-6 w-full flex justify-center overflow-hidden rounded-2xl border border-zinc-200 bg-white p-2 shadow-sm">
          <div dangerouslySetInnerHTML={{ __html: systemSettings.adScript }} />
        </div>
      );
    }

    // 2. Özel Banner Reklamı
    if (systemSettings.customImageUrl) {
      return (
        <div className="mt-6 w-full flex flex-col rounded-3xl border border-zinc-200 bg-white overflow-hidden shadow-sm relative group">
          <div className="absolute top-2.5 right-3 flex items-center gap-1.5 z-20 bg-black/60 backdrop-blur-md px-1.5 py-0.5 rounded border border-white/10">
            <span 
              onClick={handleUpgradeRedirect}
              className="text-[8.5px] font-semibold text-zinc-300 hover:text-white cursor-pointer underline transition-colors"
            >
              Reklamı Kaldır
            </span>
            <span className="h-3 w-[1px] bg-zinc-500/20" />
            <span className="text-[7.5px] font-bold tracking-wider uppercase text-zinc-400">
              Ad
            </span>
          </div>
          <a 
            href={systemSettings.customTargetUrl || "/dashboard/billing"} 
            target="_blank" 
            rel="noopener noreferrer"
            className="block w-full overflow-hidden"
          >
            <img 
              src={systemSettings.customImageUrl} 
              alt="Sponsored Ad" 
              className="w-full h-auto object-cover max-h-32 transition-transform duration-300 group-hover:scale-105" 
            />
          </a>
        </div>
      );
    }

    // 3. Varsayılan Native Reklam
    return (
      <div className="mt-6 w-full flex flex-col rounded-3xl border border-zinc-200 bg-white p-4 shadow-sm relative overflow-hidden group">
        <div className="absolute top-2.5 right-3 flex items-center gap-1.5 z-20">
          <span 
            onClick={handleUpgradeRedirect}
            className="text-[8.5px] font-semibold text-zinc-500 hover:text-zinc-700 cursor-pointer underline transition-colors"
          >
            Reklamı Kaldır
          </span>
          <span className="h-3 w-[1px] bg-zinc-300/20" />
          <span className="text-[7.5px] font-bold tracking-wider uppercase bg-zinc-100 text-zinc-400 px-1 py-0.2 rounded border border-zinc-200">
            Ad
          </span>
        </div>
        <div className="flex items-start gap-3 mt-1 pr-16 text-left">
          <div className="h-9 w-9 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0 border border-teal-100">
            <Zap className="h-4.5 w-4.5 animate-pulse text-teal-500" />
          </div>
          <div className="space-y-0.5">
            <h4 className="font-extrabold text-xs tracking-tight text-zinc-800">
              Kendi Biyo Link Sayfanı Ücretsiz Oluştur!
            </h4>
            <p className="text-[10px] leading-snug text-zinc-500">
              Saniyeler içinde sosyal medya hesaplarını tek bir yerde topla ve analiz et.
            </p>
          </div>
        </div>
        <a 
          href="/dashboard/billing"
          className="mt-3 w-full block text-center py-2 bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-[10px] rounded-xl transition-colors shadow-sm"
        >
          Kayıt Ol / Pro'ya Yükselt
        </a>
      </div>
    );
  };

  return (
    <div className="hidden lg:block w-full max-w-sm lg:w-[360px] shrink-0 sticky top-32 self-start">
      <div className="text-center mb-4">
        <span className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full border text-[10px] font-bold uppercase tracking-wider bg-white border-zinc-200 text-zinc-700 shadow-sm">
          <Laptop className="h-3 w-3" />
          {label || (mode === "editor" ? "Live Phone Sandbox" : mode === "template" ? "Template Preview" : "Add-on Sandbox")}
        </span>
      </div>

      <div className="relative mx-auto rounded-[3rem] p-4 border-4 shadow-[0_0_50px_rgba(0,0,0,0.15)] overflow-hidden bg-white border-zinc-200">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-gray-50 rounded-b-xl z-20" />
        <div id="sandbox-preview" className="relative rounded-[2.5rem] aspect-[9/18] overflow-y-auto overflow-x-hidden bg-zinc-950 flex flex-col justify-between transition-all duration-300 w-full h-full pointer-events-none p-0 border-0 scrollbar-none">
          <UniversalProfile 
            data={data} 
            isCompactMode={true} 
            isDarkContext={!isLight}
            isDashboardPreview={true}
          />
        </div>
      </div>

      {/* Reklam Alanı Telefon Cihazının Altında Render Edilir */}
      {renderAdBlock()}
    </div>
  );
}
