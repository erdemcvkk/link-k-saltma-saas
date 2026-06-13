"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SignOutButton } from "@clerk/nextjs";
import {
  Laptop,
  TrendingUp,
  QrCode,
  Globe,
  Palette,
  Puzzle,
  Lock,
  ExternalLink,
  Copy,
} from "lucide-react";
import { useDashboard } from "./dashboard-context";
import GlobalOverlayManager from "@/components/global-overlay-manager";
import UpgradeModal from "@/components/dashboard/upgrade-modal";
import FloatingUpgradePrompt from "@/components/dashboard/floating-upgrade-prompt";

export default function DashboardLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const {
    user,
    globalSettings,
    lang,
    setLang,
    setActiveTheme,
    simulatedPlan,
    triggerUpgradeModal,
    successMsg,
    errorMsg,
    isUpgradeModalOpen,
    setIsUpgradeModalOpen,
    upgradeModalTitle,
    upgradeModalDesc,
  } = useDashboard();
 
  const [copied, setCopied] = React.useState(false);

  const handleCopyLink = () => {
    if (!user.username) return;
    const profileUrl = `${window.location.protocol}//${window.location.host}/${user.username}`;
    navigator.clipboard.writeText(profileUrl);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  const handleStateChange = (state: { lang: "tr" | "en"; theme: "dark" | "light" }) => {
    setLang(state.lang);
    setActiveTheme(state.theme);
  };

  const t = {
    creatorStudioTitle: lang === "tr" ? "CLINKOR STÜDYOSU" : "CLINKOR STUDIO",
    creatorStudioDesc: lang === "tr" ? "Dijital dünyanızı özelleştirin, analiz edin ve ürünlerinizi yönetin." : "Customize, analyze, and build your digital landing center.",
    adminStudio: lang === "tr" ? "Admin Paneli" : "Admin Studio",
    billingPlans: lang === "tr" ? "Planlar & Faturalar" : "Billing & Plans",
    liveSite: lang === "tr" ? "Profili Gör" : "Live Site",
    tabEditor: lang === "tr" ? "Link & Tema Editörü" : "Link & Theme Editor",
    tabAnalytics: lang === "tr" ? "Trafik Analizleri" : "Traffic Analytics",
    tabQr: lang === "tr" ? "Dinamik QR Kodu" : "Dynamic QR Code",
    tabSeo: lang === "tr" ? "SEO & Domain Ayarları" : "SEO & Domain Settings",
  };

  const tabs = [
    {
      path: "/dashboard/editor",
      label: t.tabEditor,
      icon: Laptop,
    },
    {
      path: "/dashboard/analytics",
      label: t.tabAnalytics,
      icon: TrendingUp,
      onClick: (e: React.MouseEvent) => {
        if (simulatedPlan === "FREE") {
          e.preventDefault();
          triggerUpgradeModal(
            lang === "tr" ? "Gelişmiş Analitik Kilitli 🔒" : "Advanced Analytics Locked 🔒",
            lang === "tr"
              ? "Detaylı trafik analizleri, cihaz/tarayıcı raporları ve coğrafi istatistikler Premium plana özeldir. Hemen yükseltin!"
              : "Detailed traffic analytics, device reports and country breakdown are exclusive to our Premium plans. Upgrade now to unlock!"
          );
        }
      },
      badge: simulatedPlan === "FREE" ? <Lock className="h-3 w-3 text-teal-500 shrink-0" /> : null,
    },
    {
      path: "/dashboard/qr",
      label: t.tabQr,
      icon: QrCode,
    },
    {
      path: "/dashboard/seo",
      label: t.tabSeo,
      icon: Globe,
    },
    {
      path: "/dashboard/templates",
      label: lang === "tr" ? "Şablonlarım" : "My Templates",
      icon: Palette,
    },
    {
      path: "/dashboard/plugins",
      label: lang === "tr" ? "Eklentilerim" : "My Add-ons",
      icon: Puzzle,
      color: "rose",
    },
  ];

  return (
    <div className="min-h-screen w-full max-w-full md:max-w-7xl transition-colors duration-500 px-3 py-3 sm:p-4 md:p-6 mx-auto flex flex-col gap-3 sm:gap-4 md:gap-6 font-corporate overflow-x-hidden box-border bg-white text-zinc-900">
      <GlobalOverlayManager onStateChange={handleStateChange} />

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-4 md:pb-6 border-zinc-200">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-lg sm:text-xl md:text-3xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-fuchsia-500 break-words">
              {t.creatorStudioTitle}
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-teal-400/20 border border-teal-500/30 text-[9px] font-extrabold text-teal-500 uppercase tracking-widest">
              {simulatedPlan}
            </span>
          </div>
          <p className="text-slate-500 text-xs sm:text-sm break-words">{t.creatorStudioDesc}</p>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 w-full sm:w-auto">
          {user.role === "ADMIN" && (
            <Link
              href="/admin"
              className="flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-full bg-red-950/20 border border-red-500/20 hover:border-red-400 text-red-400 text-xs font-bold transition-all"
            >
              <span>{t.adminStudio}</span>
            </Link>
          )}

          <Link
            href="/dashboard/billing"
            className="flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-full border text-xs font-semibold transition-all bg-white border-zinc-200 hover:border-zinc-300 text-zinc-700 shadow-sm"
          >
            <span>{t.billingPlans}</span>
          </Link>

          {user.username && (
            <>
              <button
                onClick={handleCopyLink}
                className="flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-full border text-xs font-semibold transition-all bg-white border-zinc-200 hover:border-zinc-300 text-zinc-700 shadow-sm cursor-pointer"
              >
                {copied ? (
                  <span>{lang === "tr" ? "Kopyalandı! ✅" : "Copied! ✅"}</span>
                ) : (
                  <>
                    <Copy className="h-3 w-3 text-slate-500" />
                    <span>{lang === "tr" ? "Linki Kopyala" : "Copy Link"}</span>
                  </>
                )}
              </button>

              <a
                href={`/${user.username}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-full border text-xs font-semibold transition-all bg-white border-zinc-200 hover:border-zinc-300 text-zinc-700 shadow-sm"
              >
                <span>{t.liveSite}</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </>
          )}

          {/* Logout Button */}
          <SignOutButton>
            <button className="flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-full border text-xs font-semibold transition-all bg-red-50 border-red-200 hover:bg-red-100 text-red-600 shadow-sm">
              <span>{lang === "tr" ? "Çıkış Yap" : "Sign Out"}</span>
            </button>
          </SignOutButton>
        </div>
      </div>

      {/* Dynamic Tab Bar */}
      <div className="flex gap-2 border-b pb-3 overflow-x-auto scrollbar-none border-zinc-200">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = pathname === tab.path;
          const isRose = tab.color === "rose";

          let buttonClass = "bg-white border-zinc-200 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900";
          if (isActive) {
            buttonClass = isRose
              ? "bg-rose-500 border-rose-500 text-white shadow-sm"
              : "bg-teal-500 border-teal-500 text-white shadow-sm";
          } else if (isRose) {
            buttonClass = "bg-white border-zinc-200 text-zinc-600 hover:bg-zinc-50";
          }

          return (
            <Link
              key={tab.path}
              href={tab.path}
              onClick={tab.onClick}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2.5 md:py-2 rounded-full text-xs font-bold transition-all border cursor-pointer whitespace-nowrap ${buttonClass}`}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{tab.label}</span>
              {tab.badge}
            </Link>
          );
        })}
      </div>

      {/* Global Notifications */}
      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-950/20 border border-red-500/20 text-red-400 text-sm font-semibold">
          {errorMsg}
        </div>
      )}
      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/20 text-emerald-400 text-sm font-semibold">
          {successMsg}
        </div>
      )}

      {/* Children Content */}
      <div className="w-full flex-1 min-h-0">
        {children}
      </div>

      <FloatingUpgradePrompt currentPlan={simulatedPlan} globalSettings={globalSettings} />

      <UpgradeModal
        isOpen={isUpgradeModalOpen}
        onClose={() => setIsUpgradeModalOpen(false)}
        title={upgradeModalTitle}
        description={upgradeModalDesc}
      />
    </div>
  );
}
