"use client";

import React, { useState, useEffect, useTransition } from "react";
import { Puzzle, ShoppingBag, Settings, Globe, ExternalLink, Copy, Check } from "lucide-react";
import AddonConfigModal from "@/components/addons/addon-config-modal";
import PhonePreview from "@/components/dashboard/phone-preview";
import { parseButtonStyle } from "@/lib/parse-button-style";
import { useDashboard } from "../dashboard-context";
import { saveAddonConfig } from "@/app/actions";

interface AddonItem {
  id: string;
  addonType: string;
  isActive: boolean;
  settings: any;
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
  initialLinks?: any[];
  systemSettings?: {
    adScript?: string | null;
    customImageUrl?: string | null;
    customTargetUrl?: string | null;
    isActive: boolean;
  } | null;
}

export default function PluginsClient({
  initialAddons,
  initialProducts,
  initialLinks = [],
  systemSettings,
}: PluginsClientProps) {
  const { user, lang, activeTemplate, simulatedPlan, setSuccessMsg, setErrorMsg } = useDashboard();
  const [addons, setAddons] = useState<AddonItem[]>(initialAddons);
  const firstActiveAddon = initialAddons.find(a => a.isActive) || initialAddons[0];
  const [activeAddonId, setActiveAddonId] = useState<string | undefined>(firstActiveAddon?.id);
  const [editingAddon, setEditingAddon] = useState<AddonItem | null>(null);
  const [isPending, startTransition] = useTransition();
  const [origin, setOrigin] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setOrigin(window.location.origin);
    }
  }, []);

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

  const getPreviewLink = () => {
    const activeAddon = addons.find(a => a.isActive);
    const targetAddon = activeAddon || addons[0];
    if (targetAddon) {
      let slug = getDefaultSlug(targetAddon.addonType);
      try {
        const config = targetAddon.settings ? (typeof targetAddon.settings === "string" ? JSON.parse(targetAddon.settings) : targetAddon.settings) : {};
        if (config.customSlug) {
          slug = config.customSlug;
        }
      } catch (e) {}
      
      return `${origin}/@${user.username}/${slug.toLowerCase()}`;
    }
    return `${origin}/@${user.username}`;
  };

  return (
    <div className="flex flex-col lg:flex-row gap-4 md:gap-8 w-full max-w-full items-start justify-start overflow-hidden">
      {/* LEFT COLUMN: ACTIVE WORKSPACE CONTENT */}
      <div className="flex-1 space-y-5 md:space-y-8 w-full max-w-full md:max-w-3xl min-w-0 overflow-hidden">
        
        {/* Active Addons Section */}
        <div className="p-3 md:p-6 rounded-2xl border space-y-5 md:space-y-6 w-full max-w-full overflow-hidden bg-white border-zinc-200 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-zinc-150 pb-4 md:pb-5">
            <div className="flex items-center gap-3">
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

            <div className="flex items-center gap-2">
              <a
                href={getPreviewLink()}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-2xl border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-700 text-xs font-bold shadow-sm transition-all cursor-pointer whitespace-nowrap active:scale-95 hover:border-zinc-300"
              >
                <ExternalLink className="h-3.5 w-3.5 text-rose-500 animate-pulse" />
                <span>{lang === "tr" ? "Eklenti Önizleme Linki" : "Add-on Preview Link"}</span>
              </a>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(getPreviewLink());
                  setSuccessMsg(lang === "tr" ? "Eklenti linki kopyalandı!" : "Add-on link copied!");
                  setTimeout(() => setSuccessMsg(""), 3000);
                }}
                className="p-2.5 rounded-2xl border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-500 hover:text-rose-500 shadow-sm transition-all cursor-pointer hover:border-zinc-300 flex items-center justify-center"
                title={lang === "tr" ? "Kopyala" : "Copy"}
              >
                <Copy className="h-4 w-4" />
              </button>
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
                let addonLink = `${origin}/@${user.username}/store`;
                try {
                  const config = addon.settings ? (typeof addon.settings === "string" ? JSON.parse(addon.settings) : addon.settings) : {};
                  addonLink = `${origin}/@${user.username}/${(config.customSlug || getDefaultSlug(addon.addonType)).toLowerCase()}`;
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

                      {/* Toggle Switch */}
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-zinc-400">
                          {addon.isActive ? (lang === "tr" ? "Aktif" : "Active") : (lang === "tr" ? "Pasif" : "Inactive")}
                        </span>
                        <button
                          type="button"
                          disabled={isPending}
                          onClick={() => {
                            const nextActive = !addon.isActive;
                            
                            // Optimistically update active preview addon and status list
                            setActiveAddonId(addon.id);
                            setAddons(prev => prev.map(a => a.id === addon.id ? { ...a, isActive: nextActive } : a));

                            startTransition(async () => {
                              try {
                                const res = await saveAddonConfig(addon.id, addon.settings || {}, nextActive);
                                if (res.error) {
                                  setErrorMsg(res.error);
                                  setTimeout(() => setErrorMsg(""), 3000);
                                  setAddons(initialAddons);
                                } else {
                                  setSuccessMsg(lang === "tr" ? "Durum güncellendi!" : "Status updated!");
                                  setTimeout(() => {
                                    setSuccessMsg("");
                                    window.location.reload();
                                  }, 500);
                                }
                              } catch (err: any) {
                                setErrorMsg(err.message || "Error");
                                setTimeout(() => setErrorMsg(""), 3000);
                                setAddons(initialAddons);
                              }
                            });
                          }}
                          className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-200 focus:outline-none cursor-pointer flex items-center ${
                            addon.isActive ? "bg-rose-500" : "bg-zinc-300"
                          }`}
                        >
                          <div
                            className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${
                              addon.isActive ? "translate-x-4" : "translate-x-0"
                            }`}
                          />
                        </button>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-zinc-200/60 flex items-center gap-2">
                      <button
                        onClick={() => setEditingAddon(addon)}
                        className="flex-1 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold transition-colors flex items-center justify-center gap-2"
                      >
                        <Settings className="h-3.5 w-3.5" />
                        <span>{lang === "tr" ? "Ayarları Düzenle" : "Edit Settings"}</span>
                      </button>
                      {addon.isActive ? (
                        <div className="flex flex-1 gap-1">
                          <a
                            href={addonLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors flex items-center justify-center gap-2"
                          >
                            <Globe className="h-3.5 w-3.5" />
                            <span>{lang === "tr" ? "Linke Git" : "Visit Link"}</span>
                          </a>
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText(addonLink);
                              setSuccessMsg(lang === "tr" ? "Link kopyalandı!" : "Link copied!");
                              setTimeout(() => setSuccessMsg(""), 3000);
                            }}
                            className="px-2.5 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-500 hover:text-rose-500 transition-colors flex items-center justify-center cursor-pointer hover:border-zinc-300"
                            title={lang === "tr" ? "Kopyala" : "Copy"}
                          >
                            <Copy className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex flex-1 gap-1">
                          <a
                            href={`${addonLink}?previewAddons=true`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-colors flex items-center justify-center gap-2"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                            <span>{lang === "tr" ? "Önizle" : "Preview"}</span>
                          </a>
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText(`${addonLink}?previewAddons=true`);
                              setSuccessMsg(lang === "tr" ? "Önizleme linki kopyalandı!" : "Preview link copied!");
                              setTimeout(() => setSuccessMsg(""), 3000);
                            }}
                            className="px-2.5 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-500 hover:text-rose-500 transition-colors flex items-center justify-center cursor-pointer hover:border-zinc-300"
                            title={lang === "tr" ? "Önizleme Linkini Kopyala" : "Copy Preview Link"}
                          >
                            <Copy className="h-3.5 w-3.5" />
                          </button>
                        </div>
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
 
      {/* RIGHT COLUMN: PREVIEW */}
      {(() => {
        const activeTemplateButtonOverrides = (activeTemplate && activeTemplate.buttonStyle)
          ? parseButtonStyle(activeTemplate.buttonStyle)
          : {};

        const effectiveTheme = activeTemplate ? activeTemplate.name : (user.profile?.theme ?? "dark");
        const effectiveBackground = activeTemplate ? activeTemplate.bgColor : (user.profile?.background ?? "");
        const effectiveFontStyle = activeTemplate ? activeTemplate.fontStyle : (user.profile?.fontStyle ?? "Inter");
        const effectiveButtonClass = activeTemplate ? activeTemplate.buttonStyle : (user.profile?.buttonClass ?? null);
        const effectiveCustomCss = activeTemplate ? (activeTemplate.isCoded ? activeTemplate.customCss : null) : (user.profile?.customCss ?? null);

        const isLight = [
          "Minimalist Light", "Pastel Dream", "Abstract Fluid", 
          "Vintage Paper", "Vintage Journal", "Holographic Glass", "Aura Hologram"
        ].includes(effectiveTheme);

        const mappedLinks = (initialLinks || []).map((link: any) => {
          let blockMeta = {};
          if (link.metadata) {
            try { blockMeta = JSON.parse(link.metadata); } catch (e) {}
          }
          return {
            ...link,
            ...(activeTemplate ? activeTemplateButtonOverrides : {}),
            metadata: blockMeta
          };
        });

        const previewData = {
          username: user.username || "username",
          bio: user.profile?.bio || "Enter profile bio details...",
          avatarUrl: user.profile?.avatarUrl,
          theme: effectiveTheme,
          customCss: effectiveCustomCss,
          background: effectiveBackground,
          buttonClass: effectiveButtonClass,
          fontStyle: effectiveFontStyle,
          usernameColor: isLight ? "#0f172a" : "#ffffff",
          bioColor: isLight ? "#475569" : "rgba(255,255,255,0.7)",
          links: mappedLinks,
          addons: addons,
          products: initialProducts,
          systemSettings: systemSettings,
          plan: simulatedPlan,
        };

        return <PhonePreview mode="plugin" data={previewData} activeAddonId={activeAddonId} label={lang === "tr" ? "Eklenti Sandbox Önizleme" : "Add-on Sandbox Preview"} />;
      })()}

      {editingAddon && (
        <AddonConfigModal
          addon={editingAddon}
          products={initialProducts}
          onClose={(updatedSettings, updatedIsActive) => {
            if (updatedSettings !== undefined || updatedIsActive !== undefined) {
              window.location.reload();
            } else {
              setEditingAddon(null);
            }
          }}
          lang={lang}
          username={user.username || ""}
        />
      )}
    </div>
  );
}
