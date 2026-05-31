"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import FeatureZigzag from "@/components/feature-zigzag";
import GlobalOverlayManager from "@/components/global-overlay-manager";
import { ArrowRight, CheckCircle2, BarChart3, TrendingUp, Users } from "lucide-react";

interface HomeClientProps {
  userId: string | null;
  siteTitle: string;
  siteLogo: string;
  heroTitle: string;
  heroHighlight: string;
  heroSubtitle: string;
  featuresData?: any[];
  sliderItems?: any[];
  paymentLinkStarter?: string;
  paymentLinkCreator?: string;
  paymentLinkPro?: string;
  priceStarter?: string;
  priceCreator?: string;
}

export default function HomeClient({
  userId,
  siteTitle,
  siteLogo,
  heroTitle,
  heroHighlight,
  heroSubtitle,
  featuresData = [],
  sliderItems = [],
  paymentLinkStarter = "",
  paymentLinkCreator = "",
  paymentLinkPro = "",
  priceStarter = "150",
  priceCreator = "450",
}: HomeClientProps) {
  const [usernameInput, setUsernameInput] = useState("");
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (sliderItems.length > 1) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % sliderItems.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [sliderItems]);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (usernameInput.trim()) {
      window.location.href = `/sign-up?username=${encodeURIComponent(usernameInput.trim())}`;
    } else {
      window.location.href = `/sign-up`;
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-white text-slate-900 selection:bg-neon-blue/15 selection:text-neon-blue font-corporate">
      <GlobalOverlayManager />

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2 cursor-pointer hover:opacity-80 transition-opacity">
            {siteLogo ? (
              <img src={siteLogo} alt={siteTitle} className="h-8 w-auto object-contain" />
            ) : (
              <span className="text-2xl font-extrabold tracking-tight text-slate-900">
                {siteTitle}
              </span>
            )}
          </Link>

          <nav className="hidden md:flex items-center space-x-8 text-sm font-semibold text-slate-600">
            <a href="#analytics" className="hover:text-slate-900 transition-colors">Analizler</a>
            <a href="#pricing" className="hover:text-slate-900 transition-colors">Fiyatlandırma</a>
            <Link href="/sablonlar" className="hover:text-slate-900 transition-colors">Şablonlar</Link>
            <Link href="/eklentiler" className="hover:text-slate-900 transition-colors flex items-center gap-1">
              Eklentiler
              <span className="px-1.5 py-0.5 rounded-md bg-rose-100 text-rose-600 text-[9px] font-black uppercase tracking-wider">Yeni</span>
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            {userId ? (
              <Link
                href="/dashboard"
                className="flex items-center space-x-2 px-5 py-3 md:py-2.5 rounded-full bg-slate-900 text-white font-bold text-sm hover:bg-slate-800 transition-colors shadow-sm"
              >
                <span>Yönetim Paneli</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            ) : (
              <>
                <Link
                  href="/sign-in"
                  className="text-sm font-bold text-slate-900 hover:text-light-blue transition-colors hidden sm:block"
                >
                  Giriş Yap
                </Link>
                <Link
                  href="/sign-up"
                  className="px-5 py-3 md:py-2.5 rounded-full bg-slate-900 text-white font-bold text-sm hover:bg-slate-800 transition-colors shadow-sm"
                >
                  Hemen Başla
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-12 items-center">
          {/* Hero Content */}
          <div className="text-left">
            <h1 className="text-3xl md:text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight text-slate-900 leading-[1.1] mb-6">
              {heroTitle} <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-neon-blue to-light-blue block mt-2">{heroHighlight}</span>
            </h1>
            
            <p className="text-lg md:text-xl text-slate-500 mb-10 leading-relaxed font-medium">
              {heroSubtitle}
            </p>

            <form onSubmit={handleCreate} className="max-w-md flex flex-col sm:flex-row items-center p-2 bg-white rounded-full border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center flex-1 px-4 py-3 md:py-2 w-full">
                <span className="text-slate-400 font-medium whitespace-nowrap">link.saas/</span>
                <input 
                  type="text" 
                  placeholder="isminiz"
                  className="w-full bg-transparent border-none outline-none font-bold text-slate-900 placeholder:text-slate-300 ml-1"
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                />
              </div>
              <button 
                type="submit"
                className="w-full sm:w-auto mt-2 sm:mt-0 px-6 py-3 rounded-full bg-slate-900 text-white font-bold text-sm hover:bg-slate-800 transition-colors whitespace-nowrap"
              >
                Bağlantını Al
              </button>
            </form>
          </div>

            {/* Hero Phone Mockup with Profile Animation */}
            <div className="flex justify-center lg:justify-end relative animate-slide-down">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-neon-blue/5 rounded-full blur-3xl opacity-50 -z-10" />
              
              <div className="relative w-full max-w-sm lg:w-[300px] h-[600px] bg-slate-900 rounded-[3rem] p-3 shadow-2xl border-4 border-slate-900 overflow-hidden">
                <div className="absolute top-0 inset-x-0 h-6 bg-slate-900 z-20 rounded-b-3xl w-1/2 mx-auto" />
                
                <div className="relative w-full h-full bg-gray-50 rounded-[2rem] overflow-hidden flex flex-col items-center pt-16 px-4">
                {/* Profile Header Animation */}
                <div className="w-20 h-20 rounded-full bg-slate-200 overflow-hidden border-2 border-white shadow-sm mb-3 animate-pulse-slow">
                  <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&h=256&fit=crop" className="w-full h-full object-cover" />
                </div>
                <div className="h-4 w-32 bg-slate-200 rounded-full mb-2 animate-pulse-slow"></div>
                <div className="h-3 w-24 bg-slate-200 rounded-full mb-8 animate-pulse-slow"></div>

                {/* Animated Link Cards – shows up to 4 slider items or default fallback */}
                <div className="w-full space-y-3">
                  {(sliderItems.length > 0 ? sliderItems : [
                    { id: "mock-1", title: "📸 Instagram Hesabım" },
                    { id: "mock-2", title: "🎵 Yeni Spotify Albümüm" },
                    { id: "mock-3", title: "🛍️ Shopier Mağazam" },
                    { id: "mock-4", title: "📺 YouTube Kanalım" }
                  ]).slice(0, 4).map((item, idx) => (
                    <div key={item.id}
                         className={`w-full h-12 rounded-xl shadow-sm border border-gray-100 flex items-center justify-center bg-white transition-all hover:scale-[1.02] duration-300 animate-[slideUp_1s_ease-out_${idx * 0.2}s_forwards]`}
                    >
                      <span className="text-xs font-bold text-slate-800 truncate max-w-full px-3">{item.title}</span>
                    </div>
                  ))}
                </div>

                {/* Optional overlay from DB */}
                {sliderItems.length > 0 && (
                  <div className="absolute inset-0 z-10 pointer-events-none opacity-20">
                    {sliderItems.map((item, idx) => (
                      <img 
                        key={item.id}
                        src={item.imageUrl}
                        alt={item.title}
                        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${idx === currentSlide ? 'opacity-100' : 'opacity-0'}`}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Analytics Section (Animated Phone Mockup) */}
      <section id="analytics" className="relative py-24 px-6 max-w-7xl mx-auto overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Phone Mockup (Left) */}
          <div className="flex justify-center lg:justify-start relative order-2 lg:order-1">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-blue-50 rounded-full blur-3xl opacity-60 -z-10" />
            
            <div className="relative w-full max-w-sm lg:w-[300px] h-[600px] bg-slate-900 rounded-[3rem] p-3 shadow-2xl border-4 border-slate-900 overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-6 bg-slate-900 z-20 rounded-b-3xl w-1/2 mx-auto" />
              
              <div className="relative w-full h-full bg-gray-50 rounded-[2rem] overflow-hidden flex flex-col p-4 md:p-5 pt-12">
                <h4 className="text-slate-900 font-extrabold text-lg mb-1">Analizler</h4>
                <p className="text-slate-500 text-xs font-medium mb-3">Son 7 Günlük Performans</p>
                
                {/* Total Views Card */}
                <div className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100 mb-3 transform transition-all hover:scale-105">
                  <div className="flex items-center gap-2 mb-1">
                    <Users className="h-4 w-4 text-neon-blue" />
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Toplam Görüntülenme</span>
                  </div>
                  <div className="text-2xl font-black text-slate-900">42.5K</div>
                  <div className="text-[10px] font-bold text-neon-blue mt-0.5 flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" /> %12 Artış
                  </div>
                </div>

                {/* Animated Bar Chart */}
                <div className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100 flex-1 flex flex-col justify-end gap-1.5">
                  <div className="flex items-center gap-2 mb-auto">
                    <BarChart3 className="h-4 w-4 text-neon-blue" />
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tıklamalar</span>
                  </div>
                  <div className="flex items-end justify-between h-36 gap-1.5 mt-4">
                    {[40, 70, 45, 90, 65, 100, 85].map((height, i) => (
                      <div key={i} className="w-full bg-slate-100 rounded-t-md relative overflow-hidden flex-1 group">
                        <div 
                          className="absolute bottom-0 left-0 w-full bg-light-blue rounded-t-md transition-all duration-1000 ease-out origin-bottom animate-[growUp_1.5s_ease-out_forwards]"
                          style={{ height: `${height}%`, animationDelay: `${i * 0.1}s` }}
                        ></div>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between text-[7px] font-bold text-slate-400 mt-1 px-1">
                    <span>Pzt</span><span>Sal</span><span>Çar</span><span>Per</span><span>Cum</span><span>Cmt</span><span>Paz</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Text Content (Right) */}
          <div className="text-left order-1 lg:order-2 space-y-8">
            <div>
              <div className="inline-flex items-center space-x-2 px-3 py-3 md:py-2.5 md:py-1 rounded-full bg-neon-blue/5 text-neon-blue text-xs font-bold uppercase tracking-wider mb-4">
                <TrendingUp className="h-3.5 w-3.5" />
                <span>Gelişmiş Analizler</span>
              </div>
              <h2 className="text-2xl md:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
                Kitlenizi Anlayın.<br/>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-neon-blue to-light-blue">Performansınızı Ölçün.</span>
              </h2>
              <p className="text-lg text-slate-500 leading-relaxed mt-4">
                Bağlantılarınıza kimin, ne zaman ve nereden tıkladığını gerçek zamanlı olarak takip edin. Detaylı istatistiklerle stratejinizi geliştirin ve etkileşiminizi artırın.
              </p>
            </div>

            {/* High-fidelity analytics layout updated with brand colors */}
            <div className="space-y-4 bg-neon-blue/5 p-4 md:p-5 rounded-[2.5rem] border border-neon-blue/10 shadow-inner">
              
              {/* Row 1: 3 Column Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* Block 1: Görüntülenme Artışı (Market Size Growth) */}
                <div className="bg-white p-4 rounded-3xl border border-neon-blue/10 shadow-sm flex flex-col justify-between">
                  <div className="bg-neon-blue text-white text-center py-3 md:py-2.5 md:py-1 px-3 rounded-full text-[10px] font-bold tracking-wider mb-3">
                    Görüntülenme Artışı
                  </div>
                  <div className="h-32 flex items-end justify-center relative px-2">
                    {/* Line Chart Graphic representation */}
                    <svg className="w-full h-full text-neon-blue" viewBox="0 0 100 50">
                      <polyline
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        points="10,40 30,20 50,25 70,12 90,5"
                      />
                      <circle cx="10" cy="40" r="3.5" fill="currentColor" />
                      <circle cx="30" cy="20" r="3.5" fill="currentColor" />
                      <circle cx="50" cy="25" r="3.5" fill="currentColor" />
                      <circle cx="70" cy="12" r="3.5" fill="currentColor" />
                      <circle cx="90" cy="5" r="3.5" fill="currentColor" />
                    </svg>
                  </div>
                  <div className="flex justify-between text-[8px] font-bold text-slate-400 mt-2 px-1">
                    <span>Sal</span><span>Çar</span><span>Per</span><span>Cum</span><span>Cum</span>
                  </div>
                </div>

                {/* Block 2: Ziyaretçi Yaş Dağılımı (Consumer Demographics) */}
                <div className="bg-white p-4 rounded-3xl border border-neon-blue/10 shadow-sm flex flex-col justify-between items-center text-center">
                  <div className="bg-neon-blue text-white text-center py-3 md:py-2.5 md:py-1 px-3 rounded-full text-[10px] font-bold tracking-wider mb-3 w-full">
                    Yaş Dağılımı
                  </div>
                  <div className="relative w-20 h-20 mb-2">
                    {/* Pie Chart SVG representation */}
                    <svg className="w-full h-full" viewBox="0 0 36 36">
                      <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#e2e8f0" strokeWidth="4" />
                      {/* 35% slice */}
                      <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#000000" strokeWidth="4.2" strokeDasharray="35 65" strokeDashoffset="25" />
                      {/* 25% slice */}
                      <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#3c3cfa" strokeWidth="4.2" strokeDasharray="25 75" strokeDashoffset="90" />
                      {/* 20% slice */}
                      <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#4158ff" strokeWidth="4.2" strokeDasharray="20 80" strokeDashoffset="115" />
                    </svg>
                  </div>
                  <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-1 text-[9px] font-bold text-slate-600 mt-1">
                    <div className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-true-black"></span> %35 (18-24)</div>
                    <div className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-neon-blue"></span> %25 (25-34)</div>
                    <div className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-light-blue"></span> %20 (35-44)</div>
                    <div className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-slate-300"></span> %20 Diğer</div>
                  </div>
                </div>

                {/* Block 3: Tıklama Trendleri (Product Demand Trends) */}
                <div className="bg-white p-4 rounded-3xl border border-neon-blue/10 shadow-sm flex flex-col justify-between">
                  <div className="bg-neon-blue text-white text-center py-3 md:py-2.5 md:py-1 px-3 rounded-full text-[10px] font-bold tracking-wider mb-3">
                    Tıklama Trendleri
                  </div>
                  <div className="h-32 flex items-end justify-between gap-1.5 px-2">
                    {[
                      { height: 60, val: "6K", label: "Ins" },
                      { height: 90, val: "9K", label: "Yt" },
                      { height: 50, val: "5K", label: "Tik" },
                      { height: 40, val: "4K", label: "Shop" }
                    ].map((bar, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center justify-end h-full group">
                        <span className="text-[8px] font-black text-neon-blue mb-1 opacity-0 group-hover:opacity-100 transition-opacity">{bar.val}</span>
                        <div 
                          className="w-full bg-light-blue/80 rounded-t-md transition-all duration-700" 
                          style={{ height: `${bar.height}%` }}
                        />
                        <span className="text-[8px] font-bold text-slate-500 mt-1">{bar.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Row 2: Competitive Market Share style arc meters */}
              <div className="bg-white p-4 md:p-5 rounded-3xl border border-neon-blue/10 shadow-sm space-y-4">
                <div className="bg-neon-blue text-white text-center py-3 md:py-2.5 md:py-1 px-4 rounded-full text-[10px] font-bold tracking-wider w-fit mx-auto">
                  Bağlantı Tıklama Oranları
                </div>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-3 pt-2 text-center">
                  {[
                    { name: "Instagram", pct: 40, offset: 150 },
                    { name: "YouTube", pct: 25, offset: 190 },
                    { name: "TikTok", pct: 15, offset: 215 },
                    { name: "Shopier", pct: 10, offset: 227 },
                    { name: "Diğer", pct: 10, offset: 227 }
                  ].map((item, idx) => (
                    <div key={idx} className="flex flex-col items-center">
                      <div className="relative w-16 h-8 overflow-hidden flex items-end justify-center">
                        <svg className="w-16 h-16 absolute -bottom-8" viewBox="0 0 100 100">
                          <circle cx="50" cy="50" r="40" fill="transparent" stroke="#f1f5f9" strokeWidth="12" />
                          <circle cx="50" cy="50" r="40" fill="transparent" stroke="#3c3cfa" strokeWidth="12" 
                                  strokeDasharray="251.2" strokeDashoffset={item.offset} strokeLinecap="round" />
                        </svg>
                        <span className="text-xs font-black text-slate-800 z-10">{item.pct}%</span>
                      </div>
                      <span className="text-[9px] font-bold text-slate-500 mt-1">{item.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Row 3: Regional Market Growth (Bölgesel Büyüme) */}
              <div className="bg-white rounded-3xl border border-neon-blue/10 shadow-sm overflow-hidden divide-y md:divide-y-0 md:divide-x divide-slate-100 flex flex-col md:flex-row text-center">
                {[
                  { region: "Marmara", growth: "%12" },
                  { region: "İç Anadolu", growth: "%8" },
                  { region: "Ege", growth: "%15" },
                  { region: "Akdeniz", growth: "%6" },
                  { region: "Diğer", growth: "%4" }
                ].map((reg, idx) => (
                  <div key={idx} className="flex-1 p-3.5">
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">{reg.region}</p>
                    <p className="text-lg font-black text-neon-blue mt-0.5">{reg.growth}</p>
                  </div>
                ))}
              </div>

            </div>

            <ul className="space-y-4 pt-2">
              <li className="flex items-center gap-3">
                <div className="bg-neon-blue/5 p-2 rounded-lg"><Users className="h-5 w-5 text-neon-blue" /></div>
                <span className="text-slate-700 font-semibold text-sm">Gerçek Zamanlı Ziyaretçi Demografisi</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="bg-neon-blue/5 p-2 rounded-lg"><BarChart3 className="h-5 w-5 text-neon-blue" /></div>
                <span className="text-slate-700 font-semibold text-sm">Gelişmiş Cihaz, Tarayıcı ve Konum Raporları</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 px-6 bg-gray-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-2xl md:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 mb-4">
              Basit ve Şeffaf Fiyatlandırma
            </h2>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto">
              İhtiyacınıza en uygun planı seçin. İstediğiniz zaman yükseltin veya iptal edin.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 max-w-5xl mx-auto">
            {/* FREE TIER */}
            <div className="bg-white rounded-3xl p-4 md:p-8 border border-gray-100 shadow-sm flex flex-col">
              <div className="mb-6">
                <span className="px-3 py-3 md:py-2.5 md:py-1 bg-slate-100 text-slate-600 text-xs font-bold uppercase tracking-wider rounded-full">Ücretsiz</span>
                <h3 className="text-2xl md:text-4xl font-extrabold text-slate-900 mt-4">0 ₺ <span className="text-base text-slate-500 font-medium">/ ömür boyu</span></h3>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-center gap-3 text-slate-600 text-sm">
                  <CheckCircle2 className="h-5 w-5 text-neon-blue flex-shrink-0" />
                  <span>1 Adet Aktif Bio Link Sayfası (link.saas/kullaniciadi)</span>
                </li>
                <li className="flex items-center gap-3 text-slate-600 text-sm">
                  <CheckCircle2 className="h-5 w-5 text-neon-blue flex-shrink-0" />
                  <span>Sınırlı Bağlantı (Link) Ekleme (Maksimum 5 adet link)</span>
                </li>
                <li className="flex items-center gap-3 text-slate-600 text-sm">
                  <CheckCircle2 className="h-5 w-5 text-neon-blue flex-shrink-0" />
                  <span>Standart Hazır Temalar (Temel renk ve düzen seçenekleri)</span>
                </li>
                <li className="flex items-center gap-3 text-slate-600 text-sm">
                  <CheckCircle2 className="h-5 w-5 text-neon-blue flex-shrink-0" />
                  <span>Temel Analizler (Sadece toplam sayfa görüntülenme sayısı)</span>
                </li>
                <li className="flex items-center gap-3 text-slate-600 text-sm">
                  <CheckCircle2 className="h-5 w-5 text-neon-blue flex-shrink-0" />
                  <span>Sistem Logosu (Sayfa altında "Link.SaaS" ibaresi yer alır)</span>
                </li>
              </ul>
              <Link
                href="/sign-up"
                className="w-full py-3 px-4 rounded-xl border-2 border-slate-200 text-slate-900 font-bold text-center hover:border-slate-900 transition-colors"
              >
                Hemen Başla
              </Link>
            </div>

            {/* STARTER TIER */}
            <div className="bg-slate-900 rounded-3xl p-4 md:p-8 border-2 border-slate-900 shadow-xl flex flex-col relative transform md:-translate-y-4">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-3 md:py-2.5 md:py-1 bg-gradient-to-r from-neon-blue to-light-blue text-white text-xs font-black uppercase tracking-widest rounded-full">
                En Popüler
              </div>
              <div className="mb-6 mt-2">
                <span className="px-3 py-3 md:py-2.5 md:py-1 bg-slate-800 text-slate-300 text-xs font-bold uppercase tracking-wider rounded-full">Başlangıç</span>
                <h3 className="text-2xl md:text-4xl font-extrabold text-white mt-4">{priceStarter} ₺ <span className="text-base text-slate-400 font-medium">/ ay</span></h3>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-center gap-3 text-slate-300 text-sm">
                  <CheckCircle2 className="h-5 w-5 text-light-blue flex-shrink-0" />
                  <span>Ücretsiz Plandaki Tüm Özellikler</span>
                </li>
                <li className="flex items-center gap-3 text-slate-300 text-sm">
                  <CheckCircle2 className="h-5 w-5 text-light-blue flex-shrink-0" />
                  <span>Sınırsız Bağlantı (Link) Ekleme</span>
                </li>
                <li className="flex items-center gap-3 text-slate-300 text-sm">
                  <CheckCircle2 className="h-5 w-5 text-light-blue flex-shrink-0" />
                  <span>Premium Temalar ve Yazı Tipleri (Özel font kütüphanesi)</span>
                </li>
                <li className="flex items-center gap-3 text-slate-300 text-sm">
                  <CheckCircle2 className="h-5 w-5 text-light-blue flex-shrink-0" />
                  <span>Özel Renk ve Düzen Seçenekleri (Buton stilleri, gradient arka planlar)</span>
                </li>
                <li className="flex items-center gap-3 text-slate-300 text-sm">
                  <CheckCircle2 className="h-5 w-5 text-light-blue flex-shrink-0" />
                  <span>Gelişmiş Analiz Paneli (Trendler ve Grafikler)</span>
                </li>
                <li className="flex items-center gap-3 text-slate-300 text-sm">
                  <CheckCircle2 className="h-5 w-5 text-light-blue flex-shrink-0" />
                  <span>Akıllı İletişim Butonları (WhatsApp, Telegram veya E-posta)</span>
                </li>
                <li className="flex items-center gap-3 text-slate-300 text-sm">
                  <CheckCircle2 className="h-5 w-5 text-light-blue flex-shrink-0" />
                  <span>Medya Entegrasyonları (YouTube, Spotify, SoundCloud)</span>
                </li>
                <li className="flex items-center gap-3 text-slate-300 text-sm">
                  <CheckCircle2 className="h-5 w-5 text-light-blue flex-shrink-0" />
                  <span>Buton Animasyonları (Hareket Efektleri)</span>
                </li>
              </ul>
              <a
                href={paymentLinkStarter || "#"}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-neon-blue to-light-blue text-white font-bold text-center hover:opacity-90 transition-opacity"
              >
                Başlangıç Planına Geç
              </a>
            </div>

            {/* CREATOR TIER */}
            <div className="bg-white rounded-3xl p-4 md:p-8 border border-gray-100 shadow-sm flex flex-col">
              <div className="mb-6">
                <span className="px-3 py-3 md:py-2.5 md:py-1 bg-slate-100 text-slate-600 text-xs font-bold uppercase tracking-wider rounded-full">Üretici</span>
                <h3 className="text-2xl md:text-4xl font-extrabold text-slate-900 mt-4">{priceCreator} ₺ <span className="text-base text-slate-500 font-medium">/ ay</span></h3>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-center gap-3 text-slate-600 text-sm">
                  <CheckCircle2 className="h-5 w-5 text-neon-blue flex-shrink-0" />
                  <span>Başlangıç Planındaki Tüm Özellikler</span>
                </li>
                <li className="flex items-center gap-3 text-slate-600 text-sm">
                  <CheckCircle2 className="h-5 w-5 text-neon-blue flex-shrink-0" />
                  <span>Platform Logosunu Kaldırma (Whitelabel)</span>
                </li>
                <li className="flex items-center gap-3 text-slate-600 text-sm">
                  <CheckCircle2 className="h-5 w-5 text-neon-blue flex-shrink-0" />
                  <span>E-ticaret Entegrasyonları (Shopier vitrini)</span>
                </li>
                <li className="flex items-center gap-3 text-slate-600 text-sm">
                  <CheckCircle2 className="h-5 w-5 text-neon-blue flex-shrink-0" />
                  <span>İletişim ve Veri Toplama Formları</span>
                </li>
                <li className="flex items-center gap-3 text-slate-600 text-sm">
                  <CheckCircle2 className="h-5 w-5 text-neon-blue flex-shrink-0" />
                  <span>Pazarlama ve Piksel Entegrasyonları</span>
                </li>
                <li className="flex items-center gap-3 text-slate-600 text-sm">
                  <CheckCircle2 className="h-5 w-5 text-neon-blue flex-shrink-0" />
                  <span>Gelişmiş Kitle Analitiği</span>
                </li>
                <li className="flex items-center gap-3 text-slate-600 text-sm">
                  <CheckCircle2 className="h-5 w-5 text-neon-blue flex-shrink-0" />
                  <span>Özel SEO ve Favicon Ayarları</span>
                </li>
                <li className="flex items-center gap-3 text-slate-600 text-sm">
                  <CheckCircle2 className="h-5 w-5 text-neon-blue flex-shrink-0" />
                  <span>Görsel Galeri / Carousel Kaydırıcı</span>
                </li>
                <li className="flex items-center gap-3 text-slate-600 text-sm">
                  <CheckCircle2 className="h-5 w-5 text-neon-blue flex-shrink-0" />
                  <span>Öncelikli Destek</span>
                </li>
              </ul>
              <a
                href={paymentLinkCreator || "#"}
                className="w-full py-3 px-4 rounded-xl border-2 border-slate-200 text-slate-900 font-bold text-center hover:border-slate-900 transition-colors"
              >
                Üretici Planına Geç
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Simple CTA Footer */}
      <section className="py-24 px-6 text-center bg-white border-t border-gray-100">
        <div className="max-w-3xl mx-auto bg-gray-50 rounded-3xl p-4 md:p-12 shadow-sm border border-gray-100">
          <h2 className="text-2xl md:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 mb-6">
            Kitlenizi büyütmeye hazır mısınız?
          </h2>
          <p className="text-slate-500 mb-8 max-w-lg mx-auto">
            Takipçilerini müşteriye ve sadık bir kitleye dönüştüren binlerce üreticiye katılın.
          </p>
          <Link
            href="/sign-up"
            className="inline-flex items-center space-x-2 px-4 md:px-8 py-4 rounded-full bg-slate-900 text-white font-bold text-base hover:bg-slate-800 transition-colors shadow-sm"
          >
            <span>Ücretsiz Başla</span>
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* True Footer */}
      <footer className="py-12 px-6 border-t border-gray-100 text-center text-sm text-slate-500 bg-white">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            © {new Date().getFullYear()} {siteTitle}. Tüm hakları saklıdır.
          </div>
          <div className="flex space-x-6">
            <a href="#" className="hover:text-slate-900 transition-colors">Gizlilik</a>
            <a href="#" className="hover:text-slate-900 transition-colors">Şartlar</a>
            <a href="#" className="hover:text-slate-900 transition-colors">Yardım</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
