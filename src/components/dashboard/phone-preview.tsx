"use client";

import React from "react";
import { Laptop } from "lucide-react";
import UniversalProfile, { UniversalProfileData } from "@/components/universal-profile";

interface PhonePreviewProps {
  mode: "editor" | "template" | "plugin";
  data: UniversalProfileData;
  label?: string;
}

export default function PhonePreview({ mode, data, label }: PhonePreviewProps) {
  const { theme = "dark" } = data;
  
  const isLight = [
    "Minimalist Light", "Pastel Dream", "Abstract Fluid", 
    "Vintage Paper", "Vintage Journal", "Holographic Glass", "Aura Hologram"
  ].includes(theme);

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
          />
        </div>
      </div>
    </div>
  );
}
