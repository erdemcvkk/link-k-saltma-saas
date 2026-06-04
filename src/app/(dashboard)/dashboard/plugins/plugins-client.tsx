"use client";

import React, { useState } from "react";
import { Puzzle, ShoppingBag, Settings, Globe } from "lucide-react";
import AddonConfigModal from "@/components/addons/addon-config-modal";
import { useDashboard } from "../dashboard-context";

interface AddonItem {
  id: string;
  addonType: string;
  isActive: boolean;
  config: string | null;
}

interface ProductItem {
  id: string;
  title: string;
  type: string;
  price: number;
  description: string | null;
  fileUrl?: string;
  isActive: boolean;
  salesCount: number;
  createdAt: string;
}

interface PluginsClientProps {
  initialAddons: AddonItem[];
  initialProducts: ProductItem[];
}

export default function PluginsClient({
  initialAddons,
  initialProducts,
}: PluginsClientProps) {
  const { user, lang } = useDashboard();
  const [addons, setAddons] = useState<AddonItem[]>(initialAddons);
  const [editingAddon, setEditingAddon] = useState<AddonItem | null>(null);

  const getDefaultSlug = (type: string) => {
    if (type === "MINI_STORE") return "store";
    if (type === "NEO_BRUTAL") return "neo-brutal";
    if (type === "ORGANIC") return "organic";
    if (type === "RETRO") return "retro";
    if (type === "ACADEMIA") return "academia";
    if (type === "Y2K") return "y2k";
    if (type === "BOOKING") return "booking";
    if (type === "NEWSLETTER") return "newsletter";
    if (type === "QA") return "qa";
    if (type === "DONATION") return "donation";
    if (type === "PREMIUM_CREATOR") return "creator-store";
    if (type === "PREMIUM_VIDEO") return "masterclass";
    return type.toLowerCase();
  };

  return (
    <div className="flex flex-col lg:flex-row gap-4 md:gap-8 w-full max-w-full items-start justify-start overflow-hidden">
      {/* LEFT COLUMN: ACTIVE WORKSPACE CONTENT */}
      <div className="flex-1 space-y-5 md:space-y-8 w-full max-w-full md:max-w-3xl min-w-0 overflow-hidden">
        
        {/* Active Addons Section */}
        <div className="p-3 md:p-6 rounded-2xl border space-y-5 md:space-y-6 w-full max-w-full overflow-hidden bg-white border-zinc-200 shadow-sm">
          <div className="flex items-center gap-3 border-b border-zinc-150 pb-4 md:pb-5">
            <Puzzle className="h-5 w-5 text-rose-500" />
            <div>
              <h2 className="font-extrabold text-lg text-zinc-950">
                {lang === "tr" ? "Aktif Eklentilerim" : "My Active Add-ons"}
              </h2>
              <p className="text-xs text-slate-500">
                {lang === "tr" 
                  ? "Satın alıp aktif ettiğiniz eklentileri buradan yapılandırabilirsiniz."
                  : "Configure and manage the premium plug-ins you have added to your profile."}
              </p>
            </div>
          </div>

          {addons.length === 0 ? (
            <div className="text-center py-8 space-y-3">
              <div className="w-12 h-12 rounded-full bg-zinc-100 flex items-center justify-center mx-auto text-zinc-400">
                <Puzzle className="h-6 w-6" />
              </div>
              <p className="text-sm font-bold text-zinc-800">
                {lang === "tr" ? "Henüz aktif bir eklentiniz bulunmuyor." : "No active add-ons yet."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
              {addons.map((addon) => {
                let addonLink = `/${user.username}/store`;
                try {
                  const config = addon.config ? JSON.parse(addon.config) : {};
                  addonLink = `/${user.username}/${(config.customSlug || getDefaultSlug(addon.addonType)).toLowerCase()}`;
                } catch (e) {}

                return (
                  <div key={addon.id} className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 flex flex-col justify-between h-44 transition-all hover:border-zinc-300">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center border border-zinc-200">
                          <Puzzle className="h-5 w-5 text-rose-500" />
                        </div>
                        <div>
                          <h3 className="text-sm font-black text-zinc-900">{addon.addonType}</h3>
                          {addon.isActive ? (
                            <span className="text-[10px] font-bold text-emerald-500 mt-0.5 px-2 py-0.5 rounded-md bg-emerald-50 inline-block border border-emerald-100">
                              {lang === "tr" ? "Yayında" : "Published"}
                            </span>
                          ) : (
                            <span className="text-[10px] font-bold text-zinc-500 mt-0.5 px-2 py-0.5 rounded-md bg-zinc-100 inline-block border border-zinc-200">
                              {lang === "tr" ? "Taslak" : "Draft"}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-zinc-200/60 flex items-center gap-2">
                      <button
                        onClick={() => setEditingAddon(addon)}
                        className="flex-1 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold transition-colors flex items-center justify-center gap-2"
                      >
                        <Settings className="h-3.5 w-3.5" />
                        <span>{lang === "tr" ? "Ayarla" : "Config"}</span>
                      </button>
                      {addon.isActive && (
                        <a
                          href={addonLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors flex items-center justify-center gap-2"
                        >
                          <Globe className="h-3.5 w-3.5" />
                          <span>{lang === "tr" ? "Linke Git" : "Visit Link"}</span>
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Integrated Store CTA Card */}
        <div className="p-4 md:p-8 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-6 bg-indigo-50/40 border-indigo-100/50 shadow-sm">
          <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
            <div className="h-14 w-14 rounded-2xl bg-indigo-50 flex items-center justify-center shrink-0 border border-indigo-100">
              <ShoppingBag className="h-7 w-7 text-indigo-500 animate-pulse" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-black text-indigo-950">
                {lang === "tr" ? "Profilinize Yeni Eklentiler Katın 🚀" : "Power Up Your Profile 🚀"}
              </h3>
              <p className="text-xs text-indigo-700/80 font-medium max-w-md leading-relaxed">
                {lang === "tr" 
                  ? "Premium eklentiler ve şablonlarla profilinizi bir dijital mağazaya, rezervasyon merkezine veya mini CRM'e dönüştürün."
                  : "Turn your landing page into a full digital store, booking agent, or customer form capture tool."}
              </p>
            </div>
          </div>
          <a
            href="/eklentiler"
            target="_blank"
            className="w-full sm:w-auto px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs rounded-xl shadow-md shadow-indigo-600/10 text-center transition-colors shrink-0"
          >
            {lang === "tr" ? "Eklenti Mağazasını Keşfet" : "Explore Add-on Store"}
          </a>
        </div>

      </div>

      {/* RIGHT COLUMN: INVISIBLE SPACER */}
      <div className="hidden lg:block lg:w-[360px] shrink-0 sticky top-32 self-start pointer-events-none opacity-0" />

      {editingAddon && (
        <AddonConfigModal
          addon={editingAddon}
          products={initialProducts}
          onClose={() => setEditingAddon(null)}
          lang={lang}
          username={user.username || ""}
        />
      )}
    </div>
  );
}
