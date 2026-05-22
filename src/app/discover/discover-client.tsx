"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Music, ShoppingBag, User, ArrowRight, Sparkles } from "lucide-react";
import GlobalOverlayManager from "@/components/global-overlay-manager";

type FeaturedProduct = {
  id: string;
  title: string;
  price: number;
  type: string;
};

type CreatorItem = {
  id: string;
  username: string;
  bio: string;
  theme: string;
  productCount: number;
  plan: string;
  featuredProducts: FeaturedProduct[];
};

interface DiscoverClientProps {
  initialCreators: CreatorItem[];
  siteTitle: string;
  siteLogo: string;
}

export default function DiscoverClient({ initialCreators, siteTitle, siteLogo }: DiscoverClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<"all" | "beats" | "premium" | "kits">("all");
  const [lang, setLang] = useState<"tr" | "en">("en");
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  const handleStateChange = (state: { lang: "tr" | "en"; theme: "dark" | "light" }) => {
    setLang(state.lang);
    setTheme(state.theme);
  };

  const isDark = theme === "dark";

  // Dynamic Filtering logic
  const filteredCreators = initialCreators.filter((c) => {
    const matchesSearch =
      c.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.bio.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (selectedFilter === "beats") {
      return c.featuredProducts.some((p) => p.type === "BEAT");
    }
    if (selectedFilter === "kits") {
      return c.featuredProducts.some((p) => p.type === "SAMPLE_PACK" || p.type === "PRESET");
    }
    if (selectedFilter === "premium") {
      return c.plan === "CREATOR" || c.plan === "PRO_BUSINESS";
    }

    return true;
  });

  const getThemeBadgeColor = (themeId: string) => {
    switch (themeId) {
      case "neon-purple":
        return isDark ? "bg-purple-950/30 border-purple-500/30 text-purple-400" : "bg-purple-50 border-purple-200 text-purple-600";
      case "glow-green":
        return isDark ? "bg-emerald-950/30 border-emerald-500/30 text-emerald-400" : "bg-emerald-50 border-emerald-200 text-emerald-600";
      case "pink-retro":
        return isDark ? "bg-pink-950/30 border-pink-500/30 text-pink-400" : "bg-pink-50 border-pink-200 text-pink-600";
      default:
        return isDark ? "bg-zinc-900 border-zinc-800 text-zinc-400" : "bg-zinc-100 border-zinc-200 text-zinc-600";
    }
  };

  const getCardHoverStyle = (themeId: string) => {
    switch (themeId) {
      case "neon-purple":
        return isDark 
          ? "hover:border-purple-500/40 hover:shadow-[0_0_30px_rgba(168,85,247,0.1)]"
          : "hover:border-purple-300 hover:shadow-md";
      case "glow-green":
        return isDark 
          ? "hover:border-emerald-500/40 hover:shadow-[0_0_30px_rgba(16,185,129,0.1)]"
          : "hover:border-emerald-300 hover:shadow-md";
      case "pink-retro":
        return isDark 
          ? "hover:border-pink-500/40 hover:shadow-[0_0_30px_rgba(244,63,94,0.1)]"
          : "hover:border-pink-300 hover:shadow-md";
      default:
        return "hover:border-zinc-400 hover:shadow-md";
    }
  };

  // Translations
  const t = {
    searchPlaceholder: lang === "tr" 
      ? "Üreticileri kullanıcı adı, biyografi anahtar kelimeleri veya beat adına göre arayın..."
      : "Search creators by username, bio keywords, trap beats...",
    allSpaces: lang === "tr" ? "Tüm Alanlar" : "All Spaces",
    beats: lang === "tr" ? "🎹 Beat / Döngüler" : "🎹 Beats / Loops",
    kits: lang === "tr" ? "📦 Paketler / Presetler" : "📦 Packs / Presets",
    premium: lang === "tr" ? "⭐ VIP Kreatörler" : "⭐ VIP Creators",
    noMatch: lang === "tr"
      ? "Filtre kriterlerinize uyan üretici bulunamadı. Aramanızı genişletmeyi deneyin!"
      : "No dynamic creators matched your custom filter parameters. Try expanding your search queries!",
    featuredListings: lang === "tr" ? "Öne Çıkan Dükkan Ürünleri" : "Featured Listings",
    enterHub: lang === "tr" ? "Stüdyoya Giriş Yap" : "Enter Creator Hub",
  };

  return (
    <div className={`min-h-screen transition-colors duration-500 relative overflow-hidden ${
      isDark ? "bg-black text-white" : "bg-zinc-50 text-zinc-900"
    }`}>
      <GlobalOverlayManager onStateChange={handleStateChange} />

      {/* Mesh glow effects */}
      <div className={`absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full blur-[120px] pointer-events-none transition-opacity duration-500 ${
        isDark ? "bg-purple-500/10 opacity-100" : "bg-purple-300/10 opacity-70"
      }`} />
      <div className={`absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full blur-[120px] pointer-events-none transition-opacity duration-500 ${
        isDark ? "bg-emerald-500/5 opacity-100" : "bg-emerald-300/5 opacity-70"
      }`} />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808005_1px,transparent_1px),linear-gradient(to_bottom,#80808005_1px,transparent_1px)] bg-[size:24px_36px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 py-16 relative z-10 space-y-12">
        {/* Navigation / Header */}
        <div className={`flex justify-between items-center border-b pb-6 ${
          isDark ? "border-zinc-900" : "border-zinc-200"
        }`}>
          <Link href="/" className="flex items-center space-x-2 cursor-pointer hover:opacity-90 transition-opacity">
            {siteLogo ? (
              <img src={siteLogo} alt={siteTitle} className="h-7 w-auto object-contain" />
            ) : (
              <span className={`text-sm font-black tracking-widest transition-colors ${
                isDark ? "text-zinc-400 hover:text-white" : "text-zinc-500 hover:text-black"
              }`}>
                {siteTitle}
              </span>
            )}
          </Link>
          <div className="flex gap-4">
            <Link href="/dashboard" className={`px-4 py-2 rounded-full text-xs font-bold transition-all border ${
              isDark ? "bg-zinc-900 hover:bg-zinc-800 border-zinc-800 text-zinc-300" : "bg-white hover:bg-zinc-100 border-zinc-200 text-zinc-700 shadow-sm"
            }`}>
              {lang === "tr" ? "Yaratıcı Stüdyosu" : "Creator Studio"}
            </Link>
          </div>
        </div>

        {/* Hero Section */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-extrabold uppercase tracking-widest ${
            isDark ? "bg-purple-950/20 border-purple-500/30 text-purple-400" : "bg-purple-50 border-purple-200 text-purple-600"
          }`}>
            <Sparkles className="h-3.5 w-3.5" />
            {lang === "tr" ? "Kreatör Keşif Gridi" : "Discover Community Grid"}
          </div>
          <h1 className={`text-4xl md:text-5xl font-black tracking-tight leading-tight bg-clip-text text-transparent bg-gradient-to-r ${
            isDark ? "from-zinc-100 via-zinc-300 to-zinc-500" : "from-zinc-900 via-zinc-700 to-zinc-500"
          }`}>
            {lang === "tr" ? "PREMIUM KREATÖRLERLE BAĞLANTI KURUN" : "CONNECT WITH MODERN CREATORS"}
          </h1>
          <p className={`text-sm leading-relaxed max-w-lg mx-auto ${
            isDark ? "text-zinc-500" : "text-zinc-600"
          }`}>
            {lang === "tr"
              ? "Dünyanın dört bir yanından premium yaratıcıları keşfedin, müzik beat'leri, synthesizer presetleri ve dijital mağaza vitrinlerini inceleyin."
              : "Explore premium profiles, list shop beats, presets, custom themes, and trade digital file nodes globally."}
          </p>
        </div>

        {/* Controls Bar */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
          {/* Search Input */}
          <div className={`flex items-center rounded-2xl border px-4 py-3 flex-1 ${
            isDark ? "bg-zinc-950 border-zinc-900" : "bg-white border-zinc-200 shadow-sm"
          }`}>
            <Search className="h-4.5 w-4.5 text-zinc-500 mr-3" />
            <input
              type="text"
              placeholder={t.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`bg-transparent border-none outline-none text-xs w-full placeholder-zinc-500 ${
                isDark ? "text-white" : "text-zinc-800"
              }`}
            />
          </div>

          {/* Filters */}
          <div className="flex gap-2 overflow-x-auto pb-1 md:pb-0 shrink-0">
            <button
              onClick={() => setSelectedFilter("all")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                selectedFilter === "all"
                  ? "bg-purple-600 border-purple-500 text-white shadow-md shadow-purple-500/25"
                  : isDark ? "bg-zinc-950 border-zinc-900 text-zinc-400 hover:text-white" : "bg-zinc-100 border-zinc-200 text-zinc-600 hover:text-black"
              }`}
            >
              {t.allSpaces}
            </button>
            <button
              onClick={() => setSelectedFilter("beats")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                selectedFilter === "beats"
                  ? "bg-purple-600 border-purple-500 text-white shadow-md shadow-purple-500/25"
                  : isDark ? "bg-zinc-950 border-zinc-900 text-zinc-400 hover:text-white" : "bg-zinc-100 border-zinc-200 text-zinc-600 hover:text-black"
              }`}
            >
              {t.beats}
            </button>
            <button
              onClick={() => setSelectedFilter("kits")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                selectedFilter === "kits"
                  ? "bg-purple-600 border-purple-500 text-white shadow-md shadow-purple-500/25"
                  : isDark ? "bg-zinc-950 border-zinc-900 text-zinc-400 hover:text-white" : "bg-zinc-100 border-zinc-200 text-zinc-600 hover:text-black"
              }`}
            >
              {t.kits}
            </button>
            <button
              onClick={() => setSelectedFilter("premium")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                selectedFilter === "premium"
                  ? "bg-purple-600 border-purple-500 text-white shadow-md shadow-purple-500/25"
                  : isDark ? "bg-zinc-950 border-zinc-900 text-zinc-400 hover:text-white" : "bg-zinc-100 border-zinc-200 text-zinc-600 hover:text-black"
              }`}
            >
              {t.premium}
            </button>
          </div>
        </div>

        {/* Grid List */}
        <div className="grid md:grid-cols-3 gap-6">
          {filteredCreators.length === 0 ? (
            <div className={`md:col-span-3 text-center py-20 text-xs italic border rounded-3xl border-dashed ${
              isDark ? "text-zinc-500 bg-zinc-950/20 border-zinc-900" : "text-zinc-600 bg-zinc-100/30 border-zinc-300"
            }`}>
              {t.noMatch}
            </div>
          ) : (
            filteredCreators.map((creator) => (
              <div
                key={creator.id}
                className={`p-6 rounded-[2rem] border backdrop-blur-md flex flex-col justify-between gap-6 transition-all duration-300 relative overflow-hidden group ${
                  isDark ? "bg-zinc-950 border-zinc-900/60" : "bg-white border-zinc-200 shadow-sm"
                } ${getCardHoverStyle(creator.theme)}`}
              >
                {/* VIP Sparkles badge */}
                {(creator.plan === "CREATOR" || creator.plan === "PRO_BUSINESS") && (
                  <span className="absolute top-4 right-4 text-[9px] font-extrabold text-purple-500 flex items-center gap-1">
                    <Sparkles className="h-3 w-3 text-purple-500 animate-pulse" />
                    VIP
                  </span>
                )}

                <div className="space-y-4">
                  {/* Identity Header */}
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full border flex items-center justify-center transition-colors ${
                      isDark ? "bg-zinc-900 border-zinc-800 text-zinc-400 group-hover:text-purple-400" : "bg-zinc-50 border-zinc-200 text-zinc-600 group-hover:text-purple-600"
                    }`}>
                      <User className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className={`text-sm font-black transition-colors ${
                        isDark ? "text-white group-hover:text-purple-300" : "text-zinc-800 group-hover:text-purple-600"
                      }`}>
                        @{creator.username}
                      </h3>
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full border text-[7.5px] font-bold uppercase tracking-widest mt-0.5 ${getThemeBadgeColor(
                          creator.theme
                        )}`}
                      >
                        {creator.theme.replace("-", " ")}
                      </span>
                    </div>
                  </div>

                  {/* Bio text */}
                  <p className={`text-xs leading-relaxed line-clamp-3 ${
                    isDark ? "text-zinc-500" : "text-zinc-600"
                  }`}>
                    {creator.bio}
                  </p>

                  {/* Featured Digital Products list inside card */}
                  {creator.featuredProducts.length > 0 && (
                    <div className={`space-y-2 pt-2 border-t ${isDark ? "border-zinc-900/60" : "border-zinc-100"}`}>
                      <div className="text-[9px] text-zinc-500 uppercase font-black tracking-wider flex items-center gap-1">
                        <ShoppingBag className="h-3 w-3" />
                        {t.featuredListings} ({creator.productCount})
                      </div>
                      <div className="space-y-1.5">
                        {creator.featuredProducts.map((p) => (
                          <div
                            key={p.id}
                            className={`flex justify-between items-center px-2.5 py-1.5 rounded-lg border text-[10px] ${
                              isDark ? "bg-zinc-900/60 border-zinc-800" : "bg-zinc-50 border-zinc-200 text-zinc-700"
                            }`}
                          >
                            <span className="font-bold truncate pr-3">{p.title}</span>
                            <span className="text-purple-500 font-black font-mono shrink-0">{p.price}₺</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Outbound click link */}
                <Link
                  href={`/${creator.username}`}
                  className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl border font-extrabold text-xs transition-all cursor-pointer ${
                    isDark 
                      ? "bg-zinc-900 border-zinc-800 hover:border-zinc-700 text-zinc-300 group-hover:bg-purple-600 group-hover:border-purple-500 group-hover:text-white" 
                      : "bg-zinc-100 border-zinc-200 hover:bg-zinc-200 text-zinc-700 group-hover:bg-purple-600 group-hover:border-purple-500 group-hover:text-white group-hover:shadow-md"
                  }`}
                >
                  {t.enterHub}
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}
