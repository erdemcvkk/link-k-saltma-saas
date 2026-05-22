"use client";

import React, { useState } from "react";
import Link from "next/link";
import Slider from "@/components/Slider";
import { ArrowRight, Sparkles, Shield, BarChart3, Globe, Zap, Music, ShoppingBag, Eye } from "lucide-react";
import GlobalOverlayManager from "@/components/global-overlay-manager";

interface HomeClientProps {
  userId: string | null;
  siteTitle: string;
  siteLogo: string;
  heroTitle: string;
  heroSubtitle: string;
  accentColor: string;
  currentGradient: string;
  currentBadgeBg: string;
  currentBtnBg: string;
}

export default function HomeClient({
  userId,
  siteTitle,
  siteLogo,
  heroTitle,
  heroSubtitle,
  accentColor,
  currentGradient,
  currentBadgeBg,
  currentBtnBg,
}: HomeClientProps) {
  const [lang, setLang] = useState<"tr" | "en">("en");
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  const handleStateChange = (state: { lang: "tr" | "en"; theme: "dark" | "light" }) => {
    setLang(state.lang);
    setTheme(state.theme);
  };

  // Translations dictionary
  const t = {
    features: lang === "tr" ? "Özellikler" : "Features",
    showcase: lang === "tr" ? "Keşfet" : "Showcase",
    pricing: lang === "tr" ? "Fiyatlandırma" : "Pricing",
    dashboard: lang === "tr" ? "Stüdyo Paneli" : "Dashboard",
    login: lang === "tr" ? "Giriş Yap" : "Log In",
    getStarted: lang === "tr" ? "Kayıt Ol" : "Get Started",
    badgeText: lang === "tr" ? "Yeni Nesil Bio-Link Platformu" : "Next-Generation Bio-Link Platform",
    defaultHeroTitle: lang === "tr" ? "DİJİTAL İMPARATORLUĞUNUZ İÇİN TEK BİR LİNK" : "ONE LINK FOR YOUR DIGITAL EMPIRE",
    defaultHeroSubtitle: lang === "tr" 
      ? "Premium cam efektli kişisel profiller tasarlayın, beat ve presetlerinizi satın, ses kitleri barındırın ve gelişmiş gerçek zamanlı analitikler kullanın. Üreticiler için özel olarak tasarlandı."
      : "Craft premium glassmorphic personal hubs, sell beats & presets, host sample packs, and leverage robust real-time analytics. Built specifically for hiphop creators and digital designers.",
    createHubBtn: lang === "tr" ? "Hemen Hub'ını Oluştur" : "Create Your Hub Now",
    featuresTitle: lang === "tr" ? "KREATÖR EKONOMİSİ İÇİN" : "DESIGNED FOR THE",
    featuresTitleHighlight: lang === "tr" ? "TASARLANDI" : "CREATOR ECONOMY",
    feat1Title: lang === "tr" ? "Milisaniyelik Hızlar" : "Instant Load Times",
    feat1Desc: lang === "tr" 
      ? "Next.js Sunucu Bileşenleri ile tasarlandı. Sayfalarınız küresel olarak 100ms'nin altında yüklenir, kitlenizi elinizde tutar."
      : "Engineered with Next.js Server Components. Pages load sub-100ms globally, keeping your audience engaged.",
    feat2Title: lang === "tr" ? "Premium Özel Temalar" : "Premium Custom Themes",
    feat2Desc: lang === "tr"
      ? "Cam efekti (glassmorphism) stilleri, canlı geçişler, animasyonlu sınırlar ve neon parlama efektleriyle ziyaretçilerinizi büyüleyin."
      : "Dazzle visitors with custom glassmorphism styles, vibrant gradients, animated borders, and neon glow effects.",
    feat3Title: lang === "tr" ? "Gelişmiş Analitik Raporlama" : "Advanced Analytics",
    feat3Desc: lang === "tr"
      ? "Toplam tıklamaları, cihaz tiplerini, tarayıcı bilgilerini, bölgesel demografiyi ve dönüşüm verilerini gerçek zamanlı takip edin."
      : "Monitor total clicks, device types, browser info, regional demographics, and track dynamic conversion data.",
    pricingTitle: lang === "tr" ? "ADİL VE KOLAY FİYATLANDIRMA" : "FAIR & SIMPLE PRICING",
    pricingDesc: lang === "tr" ? "Kişisel markanızı güçlendirmek için en doğru planı seçin" : "Choose the right plan to amplify your personal brand",
    freePlanTitle: lang === "tr" ? "Ücretsiz" : "Free",
    freePlanPeriod: lang === "tr" ? "/ sonsuza dek" : "/ forever",
    freePlanDesc: lang === "tr" ? "Yolculuğunuza başlamak için mükemmel." : "Perfect to start your journey.",
    freePlanFeat1: lang === "tr" ? "20 Link'e Kadar" : "Up to 20 Links",
    freePlanFeat2: lang === "tr" ? "Standart Tema" : "Standard Theme",
    freePlanFeat3: lang === "tr" ? "Temel QR Kod" : "Basic QR Code",
    starterPlanTitle: lang === "tr" ? "Başlangıç" : "Starter",
    starterPlanPeriod: lang === "tr" ? "/ aylık" : "/ month",
    starterPlanDesc: lang === "tr" ? "Büyüyen içerik üreticileri için ideal." : "Ideal for growing content creators.",
    starterPlanFeat1: lang === "tr" ? "100 Link'e Kadar" : "Up to 100 Links",
    starterPlanFeat2: lang === "tr" ? "Premium Neon Temalar" : "Premium Neon Themes",
    starterPlanFeat3: lang === "tr" ? "Gelişmiş Analitikler" : "Advanced Analytics",
    starterPlanFeat4: lang === "tr" ? "Hareketli Butonlar" : "Animated Buttons",
    creatorPlanTitle: lang === "tr" ? "Kreatör" : "Creator",
    creatorPlanPeriod: lang === "tr" ? "/ aylık" : "/ month",
    creatorPlanDesc: lang === "tr" ? "Yapımcılar ve dijital mağaza sahipleri için en üst düzey paket." : "The ultimate tool for producers & shop owners.",
    creatorPlanFeat1: lang === "tr" ? "Sınırsız Link Ekranı" : "Unlimited Links",
    creatorPlanFeat2: lang === "tr" ? "Özel Domain Bağlama" : "Custom Domain",
    creatorPlanFeat3: lang === "tr" ? "Video Arkaplanlar" : "Video Backgrounds",
    creatorPlanFeat4: lang === "tr" ? "Dijital Ürün Mağazası" : "Digital Product Store",
    unlockStarter: lang === "tr" ? "Başlangıç Paketini Aç" : "Unlock Starter",
    claimCreator: lang === "tr" ? "Kreatör Paketini Al" : "Claim Creator",
    popularBadge: lang === "tr" ? "Popüler" : "Popular",
    footerText: lang === "tr" 
      ? `© ${new Date().getFullYear()} ${siteTitle}. Next.js & SQLite ile Güçlendirildi.`
      : `© ${new Date().getFullYear()} ${siteTitle}. Powered by Next.js & SQLite.`,
    footerTerms: lang === "tr" ? "Koşullar" : "Terms",
    footerPrivacy: lang === "tr" ? "Gizlilik" : "Privacy",
    footerSupport: lang === "tr" ? "Destek" : "Support",
  };

  const isDark = theme === "dark";

  return (
    <div className={`relative min-h-screen transition-colors duration-500 overflow-hidden ${
      isDark ? "bg-black text-white selection:bg-purple-500 selection:text-black" : "bg-zinc-50 text-zinc-900 selection:bg-purple-200"
    }`}>
      <GlobalOverlayManager onStateChange={handleStateChange} />

      {/* Dynamic Background Glows */}
      <div className={`absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full blur-[120px] pointer-events-none transition-opacity duration-500 ${
        isDark ? "bg-purple-900/20 opacity-100" : "bg-purple-400/10 opacity-70"
      }`} />
      <div className={`absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full blur-[120px] pointer-events-none transition-opacity duration-500 ${
        isDark ? "bg-fuchsia-900/20 opacity-100" : "bg-fuchsia-400/10 opacity-70"
      }`} />

      {/* Header */}
      <header className={`sticky top-0 z-50 backdrop-blur-md border-b px-6 py-4 transition-colors duration-300 ${
        isDark ? "border-zinc-900/80 bg-black/50" : "border-zinc-200/80 bg-white/50"
      }`}>
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2 cursor-pointer hover:opacity-90 transition-opacity">
            {siteLogo ? (
              <img src={siteLogo} alt={siteTitle} className="h-7 w-auto object-contain" />
            ) : (
              <span className={`text-xl font-black tracking-wider bg-clip-text text-transparent bg-gradient-to-r ${currentGradient}`}>
                {siteTitle}
              </span>
            )}
          </Link>

          <nav className={`hidden md:flex items-center space-x-8 text-sm font-medium transition-colors ${
            isDark ? "text-zinc-400" : "text-zinc-600"
          }`}>
            <a href="#features" className={`transition-colors ${isDark ? "hover:text-white" : "hover:text-black"}`}>{t.features}</a>
            <a href="#showcase" className={`transition-colors ${isDark ? "hover:text-white" : "hover:text-black"}`}>{t.showcase}</a>
            <a href="#pricing" className={`transition-colors ${isDark ? "hover:text-white" : "hover:text-black"}`}>{t.pricing}</a>
          </nav>

          <div className="flex items-center space-x-4">
            {userId ? (
              <Link
                href="/dashboard"
                className={`flex items-center space-x-2 px-4 py-2 rounded-full bg-gradient-to-r font-semibold text-sm transition-all ${currentBtnBg}`}
              >
                <span>{t.dashboard}</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            ) : (
              <>
                <Link
                  href="/sign-in"
                  className={`text-sm font-semibold transition-colors ${isDark ? "hover:text-purple-400" : "hover:text-purple-600"}`}
                >
                  {t.login}
                </Link>
                <Link
                  href="/sign-up"
                  className={`px-5 py-2 rounded-full font-bold text-sm transition-all ${
                    isDark ? "bg-white text-black hover:bg-zinc-200" : "bg-zinc-900 text-white hover:bg-zinc-800"
                  }`}
                >
                  {t.getStarted}
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative max-w-6xl mx-auto px-6 pt-24 pb-20 text-center">
        <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full border text-xs font-semibold mb-8 animate-pulse ${
          isDark ? currentBadgeBg : "bg-purple-50 border-purple-100 text-purple-600"
        }`}>
          <Sparkles className="h-3.5 w-3.5" />
          <span>{t.badgeText}</span>
        </div>

        <h1 className="text-5xl md:text-8xl font-extrabold tracking-tight mb-8 bg-clip-text text-transparent bg-gradient-to-b from-white to-zinc-500 leading-none">
          {heroTitle === "ONE LINK FOR YOUR DIGITAL EMPIRE" ? (
            <>
              {lang === "tr" ? "DİJİTAL İMPARATORLUĞUNUZ İÇİN" : "ONE LINK FOR YOUR"} <br />
              <span className={`bg-clip-text text-transparent bg-gradient-to-r ${currentGradient}`}>
                {lang === "tr" ? "TEK BİR LİNK" : "DIGITAL EMPIRE"}
              </span>
            </>
          ) : (
            <span className={`bg-clip-text text-transparent bg-gradient-to-r ${currentGradient}`}>
              {heroTitle}
            </span>
          )}
        </h1>

        <p className={`max-w-2xl mx-auto text-lg md:text-xl leading-relaxed mb-12 transition-colors ${
          isDark ? "text-zinc-400" : "text-zinc-600"
        }`}>
          {heroSubtitle === "Craft premium glassmorphic personal hubs, sell beats & presets, host sample packs, and leverage robust real-time analytics."
            ? t.defaultHeroSubtitle
            : heroSubtitle}
        </p>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 max-w-md mx-auto">
          <Link
            href="/sign-up"
            className={`w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r hover:opacity-90 font-extrabold text-base transition-all text-center ${currentBtnBg}`}
          >
            {t.createHubBtn}
          </Link>
        </div>

        {/* Premium Mobile Mockup / Showcase */}
        <div id="showcase" className={`mt-20 relative max-w-xs mx-auto rounded-[3rem] p-4 transition-all duration-300 ${
          isDark ? "bg-zinc-950 border-4 border-zinc-800 shadow-[0_0_50px_rgba(168,85,247,0.15)]" : "bg-white border-4 border-zinc-200 shadow-xl"
        } overflow-hidden`}>
          <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 rounded-b-xl z-20 ${isDark ? "bg-zinc-800" : "bg-zinc-200"}`} />
          
          <div className={`relative rounded-[2.5rem] aspect-[9/18] overflow-hidden p-6 flex flex-col justify-between transition-colors ${
            isDark ? "bg-zinc-900/90" : "bg-zinc-50"
          }`}>
            {/* Mockup Profile */}
            <div className="space-y-4 pt-8 text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 mx-auto border-2 border-white/20 shadow-md flex items-center justify-center">
                <Music className="h-8 w-8 text-white" />
              </div>
              <div>
                <h3 className={`font-bold text-sm ${isDark ? "text-white" : "text-zinc-800"}`}>@metro_beats</h3>
                <p className="text-zinc-500 text-[10px]">{lang === "tr" ? "Çoklu Platin Plak Beat Üreticisi" : "Multi-Platinum Beat Maker"}</p>
              </div>
            </div>

            {/* Mockup Buttons */}
            <div className="space-y-3 my-auto">
              <div className={`w-full py-2.5 rounded-xl border text-xs font-semibold hover:bg-white/10 transition-all cursor-pointer backdrop-blur-md flex items-center justify-center gap-2 ${
                isDark ? "bg-white/5 border-white/10 text-white" : "bg-white border-zinc-200 text-zinc-700 shadow-sm"
              }`}>
                <Music className="h-3.5 w-3.5 text-purple-500" />
                {lang === "tr" ? "Spotify'da Dinle" : "Listen on Spotify"}
              </div>
              <div className={`w-full py-2.5 rounded-xl border text-xs font-semibold hover:bg-white/10 transition-all cursor-pointer backdrop-blur-md flex items-center justify-center gap-2 ${
                isDark ? "bg-white/5 border-white/10 text-white" : "bg-white border-zinc-200 text-zinc-700 shadow-sm"
              }`}>
                <ShoppingBag className="h-3.5 w-3.5 text-fuchsia-500" />
                {lang === "tr" ? "Sound Kit Satın Al ($29.99)" : "Buy Sound Kit ($29.99)"}
              </div>
              <div className={`w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-600/80 to-fuchsia-600/80 text-xs font-semibold hover:opacity-90 transition-all cursor-pointer flex items-center justify-center gap-2 text-white`}>
                <Sparkles className="h-3.5 w-3.5" />
                {lang === "tr" ? "İşbirliği Talepleri" : "Collab Inquiries"}
              </div>
            </div>

            {/* Mockup Stats */}
            <div className={`flex justify-around border-t pt-3 ${isDark ? "text-zinc-500 border-zinc-800/80" : "text-zinc-400 border-zinc-200"}`}>
              <div className="text-center">
                <span className={`block text-xs font-bold ${isDark ? "text-white" : "text-zinc-800"}`}>12K</span>
                <span className="text-[8px] uppercase tracking-wider">{lang === "tr" ? "Tıklama" : "Clicks"}</span>
              </div>
              <div className="text-center">
                <span className={`block text-xs font-bold ${isDark ? "text-white" : "text-zinc-800"}`}>4.2%</span>
                <span className="text-[8px] uppercase tracking-wider">CTR</span>
              </div>
            </div>
          </div>
        </div>
      </section>
        {/* Slider Carousel */}
        <Slider />

      {/* Features Grid */}
      <section id="features" className={`max-w-6xl mx-auto px-6 py-20 border-t transition-colors ${
        isDark ? "border-zinc-900" : "border-zinc-200"
      }`}>
        <h2 className="text-3xl md:text-5xl font-black text-center mb-16">
          {t.featuresTitle}{" "}
          <span className={`bg-clip-text text-transparent bg-gradient-to-r ${currentGradient}`}>
            {t.featuresTitleHighlight}
          </span>
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className={`p-8 rounded-2xl border transition-all hover:scale-[1.02] ${
            isDark ? "bg-zinc-950/50 border-zinc-900/80 hover:border-purple-500/20" : "bg-white border-zinc-200/80 shadow-sm hover:shadow-md"
          }`}>
            <Zap className="h-8 w-8 text-purple-500 mb-6 animate-pulse" />
            <h3 className="text-xl font-bold mb-3">{t.feat1Title}</h3>
            <p className={`text-sm leading-relaxed ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>
              {t.feat1Desc}
            </p>
          </div>

          {/* Card 2 */}
          <div className={`p-8 rounded-2xl border transition-all hover:scale-[1.02] ${
            isDark ? "bg-zinc-950/50 border-zinc-900/80 hover:border-fuchsia-500/20" : "bg-white border-zinc-200/80 shadow-sm hover:shadow-md"
          }`}>
            <Sparkles className="h-8 w-8 text-fuchsia-500 mb-6" />
            <h3 className="text-xl font-bold mb-3">{t.feat2Title}</h3>
            <p className={`text-sm leading-relaxed ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>
              {t.feat2Desc}
            </p>
          </div>

          {/* Card 3 */}
          <div className={`p-8 rounded-2xl border transition-all hover:scale-[1.02] ${
            isDark ? "bg-zinc-950/50 border-zinc-900/80 hover:border-pink-500/20" : "bg-white border-zinc-200/80 shadow-sm hover:shadow-md"
          }`}>
            <BarChart3 className="h-8 w-8 text-pink-500 mb-6" />
            <h3 className="text-xl font-bold mb-3">{t.feat3Title}</h3>
            <p className={`text-sm leading-relaxed ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>
              {t.feat3Desc}
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className={`max-w-6xl mx-auto px-6 py-20 border-t transition-colors ${
        isDark ? "border-zinc-900" : "border-zinc-200"
      }`}>
        <div className="text-center max-w-xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-black mb-4">{t.pricingTitle}</h2>
          <p className={isDark ? "text-zinc-400 text-sm" : "text-zinc-600 text-sm"}>{t.pricingDesc}</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Free Plan */}
          <div className={`p-8 rounded-2xl border flex flex-col justify-between ${
            isDark ? "bg-zinc-950 border-zinc-900" : "bg-white border-zinc-200 shadow-sm"
          }`}>
            <div>
              <h3 className="text-lg font-bold uppercase tracking-wider text-zinc-400 mb-2">{t.freePlanTitle}</h3>
              <div className="text-4xl font-extrabold mb-4">0₺ <span className="text-sm font-normal text-zinc-500">{t.freePlanPeriod}</span></div>
              <p className={`text-sm mb-6 ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>{t.freePlanDesc}</p>
              <ul className={`space-y-3 text-sm mb-8 ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>
                <li className="flex items-center gap-2"><ArrowRight className="h-3 w-3 text-purple-500" /> {t.freePlanFeat1}</li>
                <li className="flex items-center gap-2"><ArrowRight className="h-3 w-3 text-purple-500" /> {t.freePlanFeat2}</li>
                <li className="flex items-center gap-2"><ArrowRight className="h-3 w-3 text-purple-500" /> {t.freePlanFeat3}</li>
              </ul>
            </div>
            <Link href="/sign-up" className={`w-full py-3 rounded-full text-center font-bold text-sm transition-colors ${
              isDark ? "bg-zinc-900 hover:bg-zinc-800 text-white" : "bg-zinc-100 hover:bg-zinc-200 text-zinc-800"
            }`}>
              {t.getStarted}
            </Link>
          </div>

          {/* Starter Plan */}
          <div className={`p-8 rounded-2xl border relative flex flex-col justify-between shadow-sm transition-all duration-300 ${
            isDark ? "bg-gradient-to-b from-purple-950/20 to-zinc-950 border-purple-500/20" : "bg-white border-purple-500/30 shadow-[0_0_30px_rgba(168,85,247,0.05)]"
          }`}>
            <div className="absolute -top-3 right-6 px-3 py-1 rounded-full bg-purple-500 text-black text-[10px] font-black uppercase tracking-wider">
              {t.popularBadge}
            </div>
            <div>
              <h3 className="text-lg font-bold uppercase tracking-wider text-purple-500 mb-2">{t.starterPlanTitle}</h3>
              <div className="text-4xl font-extrabold mb-4">99₺ <span className="text-sm font-normal text-zinc-500">{t.starterPlanPeriod}</span></div>
              <p className={`text-sm mb-6 ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>{t.starterPlanDesc}</p>
              <ul className={`space-y-3 text-sm mb-8 ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>
                <li className="flex items-center gap-2"><ArrowRight className="h-3 w-3 text-purple-500" /> {t.starterPlanFeat1}</li>
                <li className="flex items-center gap-2"><ArrowRight className="h-3 w-3 text-purple-500" /> {t.starterPlanFeat2}</li>
                <li className="flex items-center gap-2"><ArrowRight className="h-3 w-3 text-purple-500" /> {t.starterPlanFeat3}</li>
                <li className="flex items-center gap-2"><ArrowRight className="h-3 w-3 text-purple-500" /> {t.starterPlanFeat4}</li>
              </ul>
            </div>
            <Link href="/sign-up" className="w-full py-3 rounded-full bg-purple-600 hover:bg-purple-500 text-center font-bold text-sm transition-colors text-white shadow-[0_0_15px_rgba(168,85,247,0.3)]">
              {t.unlockStarter}
            </Link>
          </div>

          {/* Creator Plan */}
          <div className={`p-8 rounded-2xl border flex flex-col justify-between ${
            isDark ? "bg-zinc-950 border-zinc-900" : "bg-white border-zinc-200 shadow-sm"
          }`}>
            <div>
              <h3 className="text-lg font-bold uppercase tracking-wider text-zinc-400 mb-2">{t.creatorPlanTitle}</h3>
              <div className="text-4xl font-extrabold mb-4">249₺ <span className="text-sm font-normal text-zinc-500">{t.creatorPlanPeriod}</span></div>
              <p className={`text-sm mb-6 ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>{t.creatorPlanDesc}</p>
              <ul className={`space-y-3 text-sm mb-8 ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>
                <li className="flex items-center gap-2"><ArrowRight className="h-3 w-3 text-purple-500" /> {t.creatorPlanFeat1}</li>
                <li className="flex items-center gap-2"><ArrowRight className="h-3 w-3 text-purple-500" /> {t.creatorPlanFeat2}</li>
                <li className="flex items-center gap-2"><ArrowRight className="h-3 w-3 text-purple-500" /> {t.creatorPlanFeat3}</li>
                <li className="flex items-center gap-2"><ArrowRight className="h-3 w-3 text-purple-500" /> {t.creatorPlanFeat4}</li>
              </ul>
            </div>
            <Link href="/sign-up" className={`w-full py-3 rounded-full text-center font-bold text-sm transition-colors ${
              isDark ? "bg-zinc-900 hover:bg-zinc-800 text-white" : "bg-zinc-100 hover:bg-zinc-200 text-zinc-800"
            }`}>
              {t.claimCreator}
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={`border-t py-12 px-6 text-center text-xs transition-colors ${
        isDark ? "border-zinc-900 bg-zinc-950/40 text-zinc-500" : "border-zinc-200 bg-zinc-100/50 text-zinc-500"
      }`}>
        <p className="mb-4">{t.footerText}</p>
        <div className="flex justify-center space-x-6">
          <a href="#" className={`transition-colors ${isDark ? "hover:text-white" : "hover:text-zinc-800"}`}>{t.footerTerms}</a>
          <a href="#" className={`transition-colors ${isDark ? "hover:text-white" : "hover:text-zinc-800"}`}>{t.footerPrivacy}</a>
          <a href="#" className={`transition-colors ${isDark ? "hover:text-white" : "hover:text-zinc-800"}`}>{t.footerSupport}</a>
        </div>
      </footer>
    </div>
  );
}
