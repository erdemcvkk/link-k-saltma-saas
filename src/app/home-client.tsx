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
    <div className="relative min-h-screen overflow-hidden bg-white text-slate-900 selection:bg-teal-100 selection:text-teal-900 font-sans">
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
            <a href="#features" className="hover:text-slate-900 transition-colors">Özellikler</a>
            <a href="#analytics" className="hover:text-slate-900 transition-colors">Analizler</a>
            <a href="#pricing" className="hover:text-slate-900 transition-colors">Fiyatlandırma</a>
          </nav>

          <div className="flex items-center space-x-4">
            {userId ? (
              <Link
                href="/dashboard"
                className="flex items-center space-x-2 px-5 py-2.5 rounded-full bg-slate-900 text-white font-bold text-sm hover:bg-slate-800 transition-colors shadow-sm"
              >
                <span>Yönetim Paneli</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            ) : (
              <>
                <Link
                  href="/sign-in"
                  className="text-sm font-bold text-slate-900 hover:text-teal-600 transition-colors hidden sm:block"
                >
                  Giriş Yap
                </Link>
                <Link
                  href="/sign-up"
                  className="px-5 py-2.5 rounded-full bg-slate-900 text-white font-bold text-sm hover:bg-slate-800 transition-colors shadow-sm"
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Hero Content */}
          <div className="text-left">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight text-slate-900 leading-[1.1] mb-6">
              {heroTitle} <br />
              <span className="text-teal-400 block mt-2">{heroHighlight}</span>
            </h1>
            
            <p className="text-lg md:text-xl text-slate-500 mb-10 leading-relaxed font-medium">
              {heroSubtitle}
            </p>

            <form onSubmit={handleCreate} className="max-w-md flex flex-col sm:flex-row items-center p-2 bg-white rounded-full border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center flex-1 px-4 py-2 w-full">
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
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-teal-50 rounded-full blur-3xl opacity-50 -z-10" />
              
              <div className="relative w-[300px] h-[600px] bg-slate-900 rounded-[3rem] p-3 shadow-2xl border-4 border-slate-900 overflow-hidden">
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

      {/* Zigzag Features */}
      <section id="features" className="w-full">
        {featuresData && featuresData.length > 0 && (
          <FeatureZigzag features={featuresData} />
        )}
      </section>

      {/* Analytics Section (Animated Phone Mockup) */}
      <section id="analytics" className="relative py-24 px-6 max-w-7xl mx-auto overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Phone Mockup (Left) */}
          <div className="flex justify-center lg:justify-start relative order-2 lg:order-1">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-blue-50 rounded-full blur-3xl opacity-60 -z-10" />
            
            <div className="relative w-[300px] h-[600px] bg-slate-900 rounded-[3rem] p-3 shadow-2xl border-4 border-slate-900 overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-6 bg-slate-900 z-20 rounded-b-3xl w-1/2 mx-auto" />
              
              <div className="relative w-full h-full bg-gray-50 rounded-[2rem] overflow-hidden flex flex-col p-5 pt-12">
                <h4 className="text-slate-900 font-extrabold text-lg mb-1">Analizler</h4>
                <p className="text-slate-500 text-xs font-medium mb-6">Son 7 Günlük Performans</p>
                
                {/* Total Views Card */}
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-4 transform transition-all hover:scale-105">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="h-4 w-4 text-teal-500" />
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Görüntülenme</span>
                  </div>
                  <div className="text-3xl font-black text-slate-900">42.5K</div>
                  <div className="text-xs font-bold text-teal-500 mt-1 flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" /> %12 Artış
                  </div>
                </div>

                {/* Animated Bar Chart */}
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex-1 flex flex-col justify-end gap-2">
                  <div className="flex items-center gap-2 mb-auto">
                    <BarChart3 className="h-4 w-4 text-teal-500" />
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tıklamalar</span>
                  </div>
                  <div className="flex items-end justify-between h-32 gap-1.5 mt-4">
                    {[40, 70, 45, 90, 65, 100, 85].map((height, i) => (
                      <div key={i} className="w-full bg-slate-100 rounded-t-md relative overflow-hidden flex-1 group">
                        <div 
                          className="absolute bottom-0 left-0 w-full bg-teal-400 rounded-t-md transition-all duration-1000 ease-out origin-bottom animate-[growUp_1.5s_ease-out_forwards]"
                          style={{ height: `${height}%`, animationDelay: `${i * 0.15}s` }}
                        ></div>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between text-[8px] font-bold text-slate-400 mt-2 px-1">
                    <span>Pzt</span><span>Sal</span><span>Çar</span><span>Per</span><span>Cum</span><span>Cmt</span><span>Paz</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Text Content (Right) */}
          <div className="text-left order-1 lg:order-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-teal-50 text-teal-600 text-xs font-bold uppercase tracking-wider mb-4">
              <TrendingUp className="h-3.5 w-3.5" />
              <span>Gelişmiş Analizler</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight mb-6">
              Kitlenizi Anlayın.<br/>
              <span className="text-teal-400">Performansınızı Ölçün.</span>
            </h2>
            <p className="text-lg text-slate-500 leading-relaxed mb-8">
              Bağlantılarınıza kimin, ne zaman ve nereden tıkladığını gerçek zamanlı olarak takip edin. Detaylı istatistiklerle stratejinizi geliştirin ve etkileşiminizi artırın.
            </p>
            <ul className="space-y-4">
              <li className="flex items-center gap-3">
                <div className="bg-teal-50 p-2 rounded-lg"><Users className="h-5 w-5 text-teal-500" /></div>
                <span className="text-slate-700 font-semibold text-sm">Ziyaretçi Demografisi</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="bg-teal-50 p-2 rounded-lg"><BarChart3 className="h-5 w-5 text-teal-500" /></div>
                <span className="text-slate-700 font-semibold text-sm">Cihaz ve Konum Raporları</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 px-6 bg-gray-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 mb-4">
              Basit ve Şeffaf Fiyatlandırma
            </h2>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto">
              İhtiyacınıza en uygun planı seçin. İstediğiniz zaman yükseltin veya iptal edin.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* FREE TIER */}
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm flex flex-col">
              <div className="mb-6">
                <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold uppercase tracking-wider rounded-full">Ücretsiz</span>
                <h3 className="text-4xl font-extrabold text-slate-900 mt-4">0 ₺ <span className="text-base text-slate-500 font-medium">/ ömür boyu</span></h3>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-center gap-3 text-slate-600 text-sm">
                  <CheckCircle2 className="h-5 w-5 text-teal-500 flex-shrink-0" />
                  <span>Temel Bio Link</span>
                </li>
                <li className="flex items-center gap-3 text-slate-600 text-sm">
                  <CheckCircle2 className="h-5 w-5 text-teal-500 flex-shrink-0" />
                  <span>Standart Temalar</span>
                </li>
                <li className="flex items-center gap-3 text-slate-600 text-sm">
                  <CheckCircle2 className="h-5 w-5 text-teal-500 flex-shrink-0" />
                  <span>Standart Analizler</span>
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
            <div className="bg-slate-900 rounded-3xl p-8 border-2 border-slate-900 shadow-xl flex flex-col relative transform md:-translate-y-4">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-1 bg-teal-400 text-teal-950 text-xs font-black uppercase tracking-widest rounded-full">
                En Popüler
              </div>
              <div className="mb-6 mt-2">
                <span className="px-3 py-1 bg-slate-800 text-slate-300 text-xs font-bold uppercase tracking-wider rounded-full">Başlangıç</span>
                <h3 className="text-4xl font-extrabold text-white mt-4">150 ₺ <span className="text-base text-slate-400 font-medium">/ ay</span></h3>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-center gap-3 text-slate-300 text-sm">
                  <CheckCircle2 className="h-5 w-5 text-teal-400 flex-shrink-0" />
                  <span>Premium Tema ve Yazı Tipleri</span>
                </li>
                <li className="flex items-center gap-3 text-slate-300 text-sm">
                  <CheckCircle2 className="h-5 w-5 text-teal-400 flex-shrink-0" />
                  <span>Gelişmiş Analizler</span>
                </li>
                <li className="flex items-center gap-3 text-slate-300 text-sm">
                  <CheckCircle2 className="h-5 w-5 text-teal-400 flex-shrink-0" />
                  <span>Özel Renkler</span>
                </li>
              </ul>
              <a
                href={paymentLinkStarter || "#"}
                className="w-full py-3 px-4 rounded-xl bg-teal-400 text-teal-950 font-bold text-center hover:bg-teal-300 transition-colors"
              >
                Başlangıç Planına Geç
              </a>
            </div>

            {/* CREATOR TIER */}
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm flex flex-col">
              <div className="mb-6">
                <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold uppercase tracking-wider rounded-full">Üretici</span>
                <h3 className="text-4xl font-extrabold text-slate-900 mt-4">450 ₺ <span className="text-base text-slate-500 font-medium">/ ay</span></h3>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-center gap-3 text-slate-600 text-sm">
                  <CheckCircle2 className="h-5 w-5 text-teal-500 flex-shrink-0" />
                  <span>Tüm Başlangıç Özellikleri</span>
                </li>
                <li className="flex items-center gap-3 text-slate-600 text-sm">
                  <CheckCircle2 className="h-5 w-5 text-teal-500 flex-shrink-0" />
                  <span>E-ticaret Entegrasyonları</span>
                </li>
                <li className="flex items-center gap-3 text-slate-600 text-sm">
                  <CheckCircle2 className="h-5 w-5 text-teal-500 flex-shrink-0" />
                  <span>Platform Logosunu Kaldır</span>
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
        <div className="max-w-3xl mx-auto bg-gray-50 rounded-3xl p-12 shadow-sm border border-gray-100">
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 mb-6">
            Kitlenizi büyütmeye hazır mısınız?
          </h2>
          <p className="text-slate-500 mb-8 max-w-lg mx-auto">
            Takipçilerini müşteriye ve sadık bir kitleye dönüştüren binlerce üreticiye katılın.
          </p>
          <Link
            href="/sign-up"
            className="inline-flex items-center space-x-2 px-8 py-4 rounded-full bg-slate-900 text-white font-bold text-base hover:bg-slate-800 transition-colors shadow-sm"
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
