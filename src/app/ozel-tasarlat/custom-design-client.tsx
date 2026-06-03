"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Sparkles, 
  QrCode, 
  Link as LinkIcon, 
  BarChart3, 
  ShoppingBag, 
  ArrowLeft, 
  ArrowRight,
  CheckCircle2, 
  Send,
  Loader2,
  Phone,
  Laptop,
  Palette,
  Layers,
  Zap,
  Globe
} from "lucide-react";
import GlobalOverlayManager from "@/components/global-overlay-manager";

interface CustomDesignClientProps {
  userId: string | null;
  siteTitle: string;
  siteLogo: string;
}

type StylePreset = {
  id: string;
  name: string;
  bgColor: string;
  textColor: string;
  accentColor: string;
  bgGradient: string;
  btnStyle: string;
  fontFamily: string;
  badgeText: string;
  avatarUrl: string;
  links: { title: string; subtitle?: string; anim?: string }[];
};

export default function CustomDesignClient({ userId, siteTitle, siteLogo }: CustomDesignClientProps) {
  const [activePresetIndex, setActivePresetIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Form states
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [socialLink, setSocialLink] = useState("");
  const [details, setDetails] = useState("");

  const presets: StylePreset[] = [
    {
      id: "glassmorphism",
      name: "Glassmorphism",
      bgColor: "#0f172a",
      textColor: "#ffffff",
      accentColor: "#38bdf8",
      bgGradient: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)",
      btnStyle: "bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 shadow-lg shadow-black/10",
      fontFamily: "'Inter', sans-serif",
      badgeText: "Lüks & Derinlik",
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&h=150&fit=crop",
      links: [
        { title: "⚡ Yeni Teklimi Dinleyin", subtitle: "Tüm platformlarda yayında" },
        { title: "📸 Son Instagram Paylaşımlarım" },
        { title: "🎧 Spotify Çalma Listem" }
      ]
    },
    {
      id: "synthwave",
      name: "Neon Synthwave",
      bgColor: "#09090b",
      textColor: "#ffffff",
      accentColor: "#f43f5e",
      bgGradient: "radial-gradient(circle at center, #1e1b4b 0%, #09090b 100%)",
      btnStyle: "bg-black border border-rose-500 text-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.3)] hover:bg-rose-500 hover:text-white transition-all duration-300",
      fontFamily: "'Courier New', monospace",
      badgeText: "Retro & Enerjik",
      avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&h=150&fit=crop",
      links: [
        { title: "🔥 RGB Sound Kit v2 (Çıktı!)", subtitle: "Sınırlı sayıda lisans" },
        { title: "📺 YouTube Beat Videoları" },
        { title: "💬 Discord Topluluğumuz" }
      ]
    },
    {
      id: "cyberpunk",
      name: "3D Cyberpunk",
      bgColor: "#000000",
      textColor: "#00ffcc",
      accentColor: "#ff007f",
      bgGradient: "linear-gradient(180deg, #000000 0%, #0c0a09 100%)",
      btnStyle: "bg-zinc-900 border-2 border-[#00ffcc] text-[#00ffcc] shadow-[4px_4px_0px_#ff007f] hover:translate-x-1 hover:translate-y-1 hover:shadow-none duration-150",
      fontFamily: "system-ui, sans-serif",
      badgeText: "Fütüristik & Dikkat Çekici",
      avatarUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=150&h=150&fit=crop",
      links: [
        { title: "💎 1-on-1 Beatmaster Eğitim", subtitle: "Sınırlı Kontenjan" },
        { title: "🛍️ Shopier Dijital Mağazam" },
        { title: "✨ Soundcloud Demolarım" }
      ]
    },
    {
      id: "minimalist",
      name: "Nordic Minimalist",
      bgColor: "#ffffff",
      textColor: "#0f172a",
      accentColor: "#0f172a",
      bgGradient: "linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)",
      btnStyle: "bg-white border border-slate-200 text-slate-800 hover:border-slate-900 shadow-sm",
      fontFamily: "'Outfit', sans-serif",
      badgeText: "Sade & Profesyonel",
      avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&h=150&fit=crop",
      links: [
        { title: "📖 E-Kitap: Bağımsız Müzik Dağıtımı", subtitle: "Hemen İndirin" },
        { title: "✉️ Haftalık Bültene Abone Ol" },
        { title: "💼 LinkedIn Profilim" }
      ]
    }
  ];

  // Rotate mockup presets automatically
  useEffect(() => {
    const timer = setInterval(() => {
      setActivePresetIndex((prev) => (prev + 1) % presets.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !details) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1500);
  };

  const activePreset = presets[activePresetIndex];

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-white text-slate-900 font-sans selection:bg-neon-blue/15 selection:text-neon-blue">
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
            <Link href="/" className="hover:text-slate-900 transition-colors">Ana Sayfa</Link>
            <Link href="/sablonlar" className="hover:text-slate-900 transition-colors">Şablonlar</Link>
            <Link href="/eklentiler" className="hover:text-slate-900 transition-colors flex items-center gap-1">
              Eklentiler
              <span className="px-1.5 py-0.5 rounded-md bg-rose-100 text-rose-600 text-[9px] font-black uppercase tracking-wider">Yeni</span>
            </Link>
            <Link href="/qr-olusturucu" className="hover:text-slate-900 transition-colors flex items-center gap-1">
              QR Oluşturucu
              <span className="px-1.5 py-0.5 rounded-md bg-neon-blue/10 text-neon-blue text-[9px] font-black uppercase tracking-wider">Ücretsiz</span>
            </Link>
            <Link href="/ozel-tasarlat" className="hover:text-slate-900 transition-colors flex items-center gap-1 text-slate-900">
              Özel Tasarlat
              <span className="px-1.5 py-0.5 rounded-md bg-violet-100 text-violet-600 text-[9px] font-black uppercase tracking-wider">Tasarım</span>
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
                  href="/sign-in"
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
      <section className="relative pt-36 md:pt-44 pb-20 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left: Headline & Information */}
          <div className="text-left lg:col-span-7 space-y-6">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-violet-50 text-violet-600 text-xs font-bold uppercase tracking-wider">
              <Palette className="h-3.5 w-3.5" />
              <span>Kişiye Özel Tasarım Hizmeti</span>
            </div>
            
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-[1.1]">
              Sıra dışı olun.<br/> Size Özel Bir <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-indigo-600">Şablon Tasarlayalım.</span>
            </h1>

            <p className="text-base md:text-lg text-slate-500 leading-relaxed font-medium max-w-2xl">
              Standart şablonlar markanızın gücünü yansıtmaya yetmiyor mu? Kimsede olmayan animasyonlar, göz alıcı 3D derinlikler, neon efektler ve markanıza özel kodlanmış benzersiz düzenlerle biyo link sayfanızı baştan yaratalım.
            </p>

            {/* Core features listing */}
            <div className="grid sm:grid-cols-2 gap-4 pt-4">
              <div className="flex items-start space-x-3">
                <div className="h-8 w-8 rounded-lg bg-teal-50 flex items-center justify-center text-teal-600 shrink-0 mt-0.5">
                  <Zap className="h-4.5 w-4.5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Benzersiz Animasyonlar</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Dilediğiniz buton veya görsele özel hareket efektleri yerleştirelim.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="h-8 w-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0 mt-0.5">
                  <Layers className="h-4.5 w-4.5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">3D & Cam Derinliği</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Modern cam (glassmorphism) efektleriyle sayfanızı üç boyutlu hissettirin.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="h-8 w-8 rounded-lg bg-rose-50 flex items-center justify-center text-rose-600 shrink-0 mt-0.5">
                  <Palette className="h-4.5 w-4.5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Sınırsız Renk & Font</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Kurumsal kimliğinizi, logolarınızı ve özel fontlarınızı entegre edelim.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="h-8 w-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0 mt-0.5">
                  <Globe className="h-4.5 w-4.5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Özel Alan Adı (Domain)</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Kendi internet siteniz üzerinden (link.siteniz.com) tek tıkla yayına alın.</p>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <a 
                href="#request-form"
                className="inline-flex items-center space-x-2 px-6 py-3.5 rounded-full bg-slate-900 text-white font-bold text-sm hover:bg-slate-800 transition-colors shadow-lg hover:shadow-xl shadow-slate-900/10 cursor-pointer"
              >
                <span>Hemen Tasarım Talebi Oluştur</span>
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Right: Interactive, Animated Smartphone Mockup */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] bg-violet-100 rounded-full blur-3xl opacity-50 -z-10" />

            {/* Presets Selector tabs */}
            <div className="flex flex-wrap gap-1.5 mb-6 bg-slate-100 p-1 rounded-full relative z-10">
              {presets.map((preset, idx) => (
                <button
                  key={preset.id}
                  onClick={() => setActivePresetIndex(idx)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    activePresetIndex === idx 
                      ? "bg-white text-slate-900 shadow-sm" 
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  {preset.name}
                </button>
              ))}
            </div>

            {/* Smartphone Container */}
            <div className="relative w-full max-w-sm lg:w-[280px] h-[550px] bg-slate-900 rounded-[2.5rem] p-2.5 shadow-2xl border-4 border-slate-800 overflow-hidden transition-all duration-500">
              {/* Speaker Notch */}
              <div className="absolute top-0 inset-x-0 h-5 bg-slate-900 z-20 rounded-b-2xl w-1/3 mx-auto" />

              {/* Dynamic Styled Screen View */}
              <div 
                className="relative w-full h-full rounded-[1.8rem] overflow-hidden flex flex-col items-center pt-12 px-4 transition-all duration-700"
                style={{ 
                  background: activePreset.bgGradient,
                  backgroundColor: activePreset.bgColor,
                  color: activePreset.textColor,
                  fontFamily: activePreset.fontFamily
                }}
              >
                {/* Visual Accent Badge */}
                <div 
                  className="px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-wider mb-4 border"
                  style={{ 
                    borderColor: `${activePreset.accentColor}30`, 
                    color: activePreset.accentColor,
                    backgroundColor: `${activePreset.accentColor}08`
                  }}
                >
                  {activePreset.badgeText}
                </div>

                {/* Avatar with dynamic outline */}
                <div 
                  className="w-16 h-16 rounded-full overflow-hidden border-2 shadow-md mb-2 shrink-0 transition-transform duration-500 hover:scale-105"
                  style={{ borderColor: activePreset.accentColor }}
                >
                  <img src={activePreset.avatarUrl} alt="Avatar Mockup" className="w-full h-full object-cover" />
                </div>

                {/* Bio Details */}
                <div className="text-center mb-6 space-y-1">
                  <div className="text-xs font-black tracking-tight" style={{ color: activePreset.textColor }}>@kreator.hub</div>
                  <div className="text-[9px] opacity-70 max-w-[180px] mx-auto leading-normal">
                    Size özel tasarlanmış tamamen dinamik, göz alıcı biyo linki.
                  </div>
                </div>

                {/* Simulated Custom Designed Buttons */}
                <div className="w-full space-y-3 flex-1 overflow-y-auto pr-0.5 scrollbar-thin">
                  {activePreset.links.map((link, idx) => (
                    <div
                      key={idx}
                      className={`w-full p-2.5 rounded-xl flex flex-col items-center justify-center text-center transition-all ${activePreset.btnStyle}`}
                    >
                      <span className="text-[10px] font-extrabold tracking-tight truncate max-w-full">{link.title}</span>
                      {link.subtitle && (
                        <span className="text-[8px] opacity-60 mt-0.5 truncate max-w-full font-medium">{link.subtitle}</span>
                      )}
                    </div>
                  ))}
                </div>

                {/* System Watermark */}
                <div className="mt-auto pb-4 pt-2 text-[8px] opacity-40 uppercase tracking-widest font-black">
                  {siteTitle}
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Steps process section */}
      <section className="py-20 bg-slate-50 border-y border-slate-100 px-6">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-2xl md:text-4xl font-extrabold text-slate-900">Nasıl Çalışır?</h2>
            <p className="text-slate-500 text-sm max-w-xl mx-auto font-medium">Hayalinizdeki biyo link tasarımına kavuşmak 3 basit adımda mümkündür.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
              <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center font-black text-sm">
                1
              </div>
              <h3 className="font-extrabold text-slate-900 text-base">Fikrinizi Paylaşın</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                Aşağıdaki formu doldurarak istediğiniz renkleri, şablon fikirlerini ve varsa beğendiğiniz diğer sayfaların linklerini bize iletin.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-sm">
                2
              </div>
              <h3 className="font-extrabold text-slate-900 text-base">Tasarım & Kodlama</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                Tasarım ekibimiz size özel grafik arayüzü tasarlayıp doğrudan kod bloklarına aktarır, sayfanıza entegre eder.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-black text-sm">
                3
              </div>
              <h3 className="font-extrabold text-slate-900 text-base">Yayına Alın</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                Şablonunuz hesabınıza eklenir. Tek tıkla aktif edip kendi alan adınız üzerinden dünyaya duyurmaya başlayabilirsiniz.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section id="request-form" className="py-24 px-6 max-w-xl mx-auto">
        <div className="bg-white p-6 md:p-10 rounded-[2.5rem] border border-slate-100 shadow-xl space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Tasarım Talep Formu</h2>
            <p className="text-xs text-slate-500 font-medium">Fikirlerinizi bizimle paylaşın, 24 saat içinde dönüş yapalım.</p>
          </div>

          {isSubmitted ? (
            <div className="text-center py-8 space-y-4 animate-in fade-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center mx-auto shadow-md shadow-emerald-500/10">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <div className="space-y-1">
                <h3 className="font-black text-slate-900 text-lg">Talebiniz Alındı!</h3>
                <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
                  Tasarım talebinizi başarıyla kaydettik. Ekibimiz en kısa sürede belirttiğiniz e-posta adresi üzerinden sizinle iletişime geçecektir. Teşekkürler!
                </p>
              </div>
              <button
                onClick={() => {
                  setIsSubmitted(false);
                  setFullName("");
                  setEmail("");
                  setSocialLink("");
                  setDetails("");
                }}
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-full text-xs font-bold transition-all shadow-sm"
              >
                Yeni Talep Gönder
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">Adınız Soyadınız *</label>
                <input
                  type="text"
                  required
                  placeholder="Örn: Erdem Çevik"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-xs focus:bg-white focus:border-slate-900 focus:ring-2 focus:ring-slate-900/5 transition-all text-slate-900"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">E-posta Adresiniz *</label>
                <input
                  type="email"
                  required
                  placeholder="Örn: iletisin@siteniz.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-xs focus:bg-white focus:border-slate-900 focus:ring-2 focus:ring-slate-900/5 transition-all text-slate-900"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">Mevcut Sosyal Medya Hesabınız (Seçenek)</label>
                <input
                  type="text"
                  placeholder="Örn: instagram.com/kullaniciadi"
                  value={socialLink}
                  onChange={(e) => setSocialLink(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-xs focus:bg-white focus:border-slate-900 focus:ring-2 focus:ring-slate-900/5 transition-all text-slate-900"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">Hayalinizdeki Şablon Tasarımı (Detaylar) *</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Nasıl renkler, buton animasyonları, arka plan resimleri veya düzenler hayal ediyorsunuz? İstediğiniz detayları detaylıca yazın..."
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-xs resize-none focus:bg-white focus:border-slate-900 focus:ring-2 focus:ring-slate-900/5 transition-all text-slate-900 leading-relaxed"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-xs shadow-lg hover:shadow-xl shadow-slate-900/10 cursor-pointer disabled:opacity-50 transition-all flex items-center justify-center gap-2"
              >
                {isSubmitting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
                Tasarım Talebini İlet
              </button>
            </form>
          )}
        </div>
      </section>

      {/* Footer */}
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
