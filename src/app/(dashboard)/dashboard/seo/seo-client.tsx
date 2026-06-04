"use client";

import { useState, useTransition } from "react";
import {
  saveSeoProfile,
  saveCustomDomain
} from "@/app/actions";
import {
  Settings,
  Globe,
  Copy,
  Lock,
  Loader2,
  Check
} from "lucide-react";
import { useDashboard } from "../dashboard-context";

export default function SeoClient() {
  const {
    user,
    lang,
    isPremium,
    isCreator,
    triggerUpgradeModal,
    setSuccessMsg,
    setErrorMsg,
    isPending,
    startTransition
  } = useDashboard();

  const username = user.username || "";
  const bio = user.profile?.bio || "";
  const initialUser = user;

  // States
  const [seoTitle, setSeoTitle] = useState(user.profile?.seoTitle ?? "");
  const [seoDescription, setSeoDescription] = useState(user.profile?.seoDescription ?? "");
  const [seoKeywords, setSeoKeywords] = useState(user.profile?.seoKeywords ?? "");
  const [customDomain, setCustomDomain] = useState(user.profile?.customDomain ?? "");

  // Handlers
  const handleSaveSeo = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    startTransition(async () => {
      try {
        await saveSeoProfile(initialUser.id, seoTitle, seoDescription, seoKeywords);
        setSuccessMsg("SEO parameters saved successfully!");
      } catch (err: any) {
        setErrorMsg(err.message || "Failed to save SEO");
      }
    });
  };

  const handleSaveDomain = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    startTransition(async () => {
      try {
        await saveCustomDomain(initialUser.id, customDomain);
        setSuccessMsg("Custom domain configuration updated successfully!");
      } catch (err: any) {
        setErrorMsg(err.message || "Failed to save custom domain");
      }
    });
  };

  const t = {
    tabSeo: lang === "tr" ? "SEO & Domain Ayarları" : "SEO & Domain Settings",
  };

  return (
    <div className="flex flex-col lg:flex-row gap-4 md:gap-8 w-full max-w-full items-start justify-start overflow-hidden">
      {/* LEFT COLUMN: ACTIVE WORKSPACE CONTENT */}
      <div className="flex-1 space-y-5 md:space-y-8 w-full max-w-full md:max-w-3xl min-w-0 overflow-hidden">
        <div className="w-full max-w-full space-y-5 md:space-y-8 animate-in fade-in slide-in-from-bottom-3 duration-350 overflow-hidden">
          
          {/* COLUMN 1: Social SEO Control */}
          <div className={`p-3 md:p-6 rounded-2xl border space-y-5 md:space-y-6 w-full max-w-full overflow-hidden relative ${!isPremium ? "min-h-[300px]" : ""} bg-white border-zinc-200 shadow-sm`}>
            <div className="flex items-center gap-3">
              <Settings className="h-5 w-5 text-teal-500" />
              <h2 className="font-extrabold text-lg text-zinc-950">{t.tabSeo}</h2>
            </div>

            <form onSubmit={handleSaveSeo} className="space-y-4 border-t pt-5 border-zinc-150">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider block text-zinc-550">{lang === "tr" ? "Meta Başlık (SEO)" : "Meta Title"}</label>
                <input
                  type="text"
                  value={seoTitle}
                  onChange={(e) => setSeoTitle(e.target.value)}
                  disabled={!isPremium}
                  placeholder={`@${username} | CREATOR.HUB`}
                  className="w-full px-4 py-3 rounded-xl border focus:border-teal-500/50 outline-none text-xs disabled:opacity-50 disabled:cursor-not-allowed bg-zinc-100 border-zinc-200 text-zinc-900"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider block text-zinc-550">{lang === "tr" ? "Meta Açıklama (SEO)" : "Meta Description"}</label>
                <textarea
                  value={seoDescription}
                  onChange={(e) => setSeoDescription(e.target.value)}
                  disabled={!isPremium}
                  placeholder={bio || "Welcome to my link page!"}
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border focus:border-teal-500/50 outline-none text-xs disabled:opacity-50 disabled:cursor-not-allowed bg-zinc-100 border-zinc-200 text-zinc-900"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider block text-zinc-550">{lang === "tr" ? "Arama Kelimeleri" : "Search Keywords"}</label>
                <input
                  type="text"
                  value={seoKeywords}
                  onChange={(e) => setSeoKeywords(e.target.value)}
                  disabled={!isPremium}
                  placeholder="beats, developer, portfolio, trap"
                  className="w-full px-4 py-3 rounded-xl border focus:border-teal-500/50 outline-none text-xs disabled:opacity-50 disabled:cursor-not-allowed bg-zinc-100 border-zinc-200 text-zinc-900"
                />
              </div>

              <button
                type="submit"
                disabled={!isPremium || isPending}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-teal-500 hover:bg-teal-400 disabled:bg-zinc-400 text-slate-900 disabled:text-zinc-700 font-extrabold text-xs transition-colors cursor-pointer disabled:cursor-not-allowed"
              >
                {isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
                {lang === "tr" ? "SEO Ayarlarını Kaydet" : "Save SEO Parameters"}
              </button>
            </form>

            {/* Locked overlay */}
            {!isPremium && (
              <div className="absolute inset-0 bg-black/85 backdrop-blur-sm flex flex-col items-center justify-center p-3 md:p-6 text-center space-y-4">
                <Lock className="h-10 w-10 text-teal-500" />
                <div className="space-y-1 max-w-xs">
                  <h3 className="text-sm font-extrabold text-slate-900">{lang === "tr" ? "SEO Özelleştirmeleri Kilitli" : "SEO Customs are Locked"}</h3>
                  <p className="text-[10px] text-slate-500 leading-relaxed">
                    {lang === "tr" ? "HTML başlık verilerinizi, sosyal medya paylaşım açıklamalarını ve arama motoru dizin anahtar kelimelerini özelleştirmek için premium plana yükseltin!" : "Upgrade to a premium plan to custom define your HTML header metadata, social share descriptions, and search indexing keywords."}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => triggerUpgradeModal(
                    lang === "tr" ? "SEO Ayarları Kilitli 🔒" : "SEO Customs Locked 🔒",
                    lang === "tr"
                      ? "Meta başlık, açıklama ve anahtar kelime özelleştirmeleri gibi gelişmiş arama motoru optimizasyonu ayarlarını kullanmak Premium pakete özeldir."
                      : "Customizing SEO meta title, description and indexing keywords is exclusive to our Premium plans."
                  )}
                  className="px-4 py-2.5 md:py-2 rounded-full bg-teal-500 hover:bg-teal-400 text-slate-900 font-bold text-[10px] transition-colors cursor-pointer"
                >
                  {lang === "tr" ? "SEO Özelliklerinin Kilidini Aç" : "Unlock SEO Settings"}
                </button>
              </div>
            )}
          </div>

          {/* COLUMN 2: Custom Domains Manager */}
          <div className={`p-3 md:p-6 rounded-2xl border space-y-5 md:space-y-6 w-full max-w-full overflow-hidden relative ${!isCreator ? "min-h-[300px]" : ""} bg-white border-zinc-200 shadow-sm`}>
            <div className="flex items-center gap-3">
              <Globe className="h-5 w-5 text-emerald-400" />
              <h2 className="font-extrabold text-lg text-zinc-950">{lang === "tr" ? "Özel Alan Adı (Domain)" : "Custom Domain Manager"}</h2>
            </div>

            <div className="space-y-6 border-t pt-5 border-zinc-150">
              <form onSubmit={handleSaveDomain} className="flex gap-2">
                <div className="flex-1 flex items-center rounded-xl border px-3 overflow-hidden focus-within:border-emerald-500/50 bg-zinc-100 border-zinc-200">
                  <span className="text-slate-500 text-xs">https://</span>
                  <input
                    type="text"
                    value={customDomain}
                    onChange={(e) => setCustomDomain(e.target.value)}
                    placeholder="links.erdem.com"
                    className="bg-transparent border-none outline-none py-2.5 text-xs flex-1 text-zinc-900"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-900 font-extrabold text-xs transition-colors cursor-pointer"
                >
                  {lang === "tr" ? "Yapılandır" : "Configure"}
                </button>
              </form>

              {/* DNS Setup Card */}
              {initialUser.profile?.customDomain && (
                <div className="p-4 rounded-xl border space-y-4 bg-zinc-50 border-zinc-200">
                  <div className="flex justify-between items-center text-[10px] font-bold">
                    <span className="text-zinc-700">{lang === "tr" ? "DNS Kurulum Talimatları" : "DNS Setup Instructions"}</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">DNS Connected</span>
                  </div>

                  <p className="text-[10px] text-slate-500 leading-relaxed">
                    {lang === "tr" ? "Özel alan adınızı profil sayfanıza yönlendirmek için DNS sağlayıcınızda (Cloudflare, GoDaddy, vb.) bir CNAME kaydı oluşturun:" : "To point your custom domain name to our creator grid, create a CNAME record with your DNS provider (Cloudflare, GoDaddy, etc.):"}
                  </p>

                  <div className="overflow-x-auto text-[10px] font-mono">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="border-b text-slate-500 border-zinc-200">
                          <th className="pb-2">Type</th>
                          <th className="pb-2">Name</th>
                          <th className="pb-2">Target Value</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="text-zinc-800">
                          <td className="py-2.5 md:py-2">CNAME</td>
                          <td className="py-2.5 md:py-2">links</td>
                          <td className="py-2.5 md:py-2 flex items-center gap-1.5 font-bold text-purple-650">
                            cname.creator.hub
                            <button
                              type="button"
                              onClick={() => navigator.clipboard.writeText("cname.creator.hub")}
                              className="p-1 rounded bg-gray-50 hover:bg-zinc-700 text-slate-500 cursor-pointer"
                            >
                              <Copy className="h-3 w-3" />
                            </button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            {/* Locked overlay */}
            {!isCreator && (
              <div className="absolute inset-0 bg-black/85 backdrop-blur-sm flex flex-col items-center justify-center p-3 md:p-6 text-center space-y-4">
                <Lock className="h-10 w-10 text-emerald-400" />
                <div className="space-y-1 max-w-xs">
                  <h3 className="text-sm font-extrabold text-slate-900">{lang === "tr" ? "Özel Alan Adları Kilitli" : "Custom Domains are Locked"}</h3>
                  <p className="text-[10px] text-zinc-450 leading-relaxed">
                    {lang === "tr" ? "Kendi alan adınızı bağlamak, DNS kayıtlarını otomatik eşlemek ve beyaz etiketli (white-label) markalama oluşturmak için CREATOR paketine geçin." : "Upgrade to our CREATOR enterprise package to map dynamic custom domains, bind DNS records, and build white-label branding."}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => triggerUpgradeModal(
                    lang === "tr" ? "Özel Alan Adı Kilitli 🔒" : "Custom Domain Locked 🔒",
                    lang === "tr"
                      ? "Kendi özel alan adınızı (cname) bağlamak ve beyaz etiketli (white-label) markalama oluşturmak Creator paketine özeldir."
                      : "Mapping custom domains and utilizing white-label branding requires the CREATOR plan."
                  )}
                  className="px-4 py-2.5 md:py-2 rounded-full bg-emerald-600 hover:bg-emerald-500 text-slate-900 font-bold text-[10px] transition-colors cursor-pointer"
                >
                  {lang === "tr" ? "Alan Adı Kilidini Aç" : "Unlock Domains"}
                </button>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* RIGHT COLUMN: INVISIBLE SPACER */}
      <div className="hidden lg:block lg:w-[360px] shrink-0 sticky top-32 self-start pointer-events-none opacity-0" />
    </div>
  );
}
