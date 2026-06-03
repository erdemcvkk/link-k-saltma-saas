"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  ArrowRight,
  Send,
  Loader2,
  Palette,
  Layers,
  Zap,
  Globe,
  CheckCircle2
} from "lucide-react";
import GlobalOverlayManager from "@/components/global-overlay-manager";

interface CustomDesignClientProps {
  userId: string | null;
  siteTitle: string;
  siteLogo: string;
}

type MockupPreset = {
  id: string;
  name: string;
  bgColor: string;
  bgGradient: string;
  accentColor: string;
  textColor: string;
  headingColor: string;
  btnBg: string;
  btnText: string;
  btnBorder: string;
  avatarUrl: string;
  displayName: string;
  bio: string;
  scriptHeading: string;
  links: string[];
  leafColor: string;
  leafOpacity: number;
};

/* Decorative Leaf SVG component */
function LeafDecoration({ color, opacity, className, flip }: { color: string; opacity: number; className?: string; flip?: boolean }) {
  return (
    <svg
      viewBox="0 0 120 180"
      fill="none"
      className={className}
      style={{ opacity, transform: flip ? "scaleX(-1)" : undefined }}
    >
      <path
        d="M60 10C30 40 10 80 15 130C20 160 40 175 60 170C80 175 100 160 105 130C110 80 90 40 60 10Z"
        fill={color}
        fillOpacity={0.15}
      />
      <path
        d="M60 10C60 60 60 110 60 170"
        stroke={color}
        strokeOpacity={0.25}
        strokeWidth={1.5}
      />
      <path
        d="M60 50C45 65 30 80 25 100"
        stroke={color}
        strokeOpacity={0.18}
        strokeWidth={1}
      />
      <path
        d="M60 70C75 85 90 95 95 110"
        stroke={color}
        strokeOpacity={0.18}
        strokeWidth={1}
      />
      <path
        d="M60 100C50 110 38 118 30 130"
        stroke={color}
        strokeOpacity={0.15}
        strokeWidth={1}
      />
    </svg>
  );
}

/* Small branch/twig decoration */
function TwigDecoration({ color, opacity, className }: { color: string; opacity: number; className?: string }) {
  return (
    <svg viewBox="0 0 60 80" fill="none" className={className} style={{ opacity }}>
      <path d="M30 75C30 50 30 25 30 5" stroke={color} strokeOpacity={0.3} strokeWidth={1.2} />
      <path d="M30 20C22 12 15 8 8 6" stroke={color} strokeOpacity={0.25} strokeWidth={1} />
      <path d="M30 35C38 27 45 23 52 21" stroke={color} strokeOpacity={0.25} strokeWidth={1} />
      <path d="M30 50C24 44 18 40 12 38" stroke={color} strokeOpacity={0.2} strokeWidth={1} />
      <circle cx="8" cy="6" r="3" fill={color} fillOpacity={0.12} />
      <circle cx="52" cy="21" r="3" fill={color} fillOpacity={0.12} />
      <circle cx="12" cy="38" r="2.5" fill={color} fillOpacity={0.1} />
    </svg>
  );
}

export default function CustomDesignClient({ userId, siteTitle, siteLogo }: CustomDesignClientProps) {
  const [activePresetIndex, setActivePresetIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Form states
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [socialLink, setSocialLink] = useState("");
  const [details, setDetails] = useState("");

  const presets: MockupPreset[] = [
    {
      id: "sage",
      name: "Sage Garden",
      bgColor: "#f0f5f0",
      bgGradient: "linear-gradient(180deg, #e8f0e8 0%, #f5f9f5 40%, #ffffff 100%)",
      accentColor: "#7ab38a",
      textColor: "#3d5a45",
      headingColor: "#2d4a35",
      btnBg: "#ffffff",
      btnText: "#3d5a45",
      btnBorder: "#c8dcc8",
      avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&h=150&fit=crop",
      displayName: "Ayşe Demir",
      bio: "İçerik Üretici & Blogger ✨",
      scriptHeading: "hello!",
      links: ["Web Sitem", "Blog Yazılarım", "Mağazam", "İletişim"],
      leafColor: "#7ab38a",
      leafOpacity: 0.7
    },
    {
      id: "mint",
      name: "Mint Breeze",
      bgColor: "#f0faf6",
      bgGradient: "linear-gradient(180deg, #e0f5ed 0%, #f0faf6 40%, #ffffff 100%)",
      accentColor: "#48b88c",
      textColor: "#2a5448",
      headingColor: "#1d4038",
      btnBg: "#2a5448",
      btnText: "#ffffff",
      btnBorder: "#2a5448",
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&h=150&fit=crop",
      displayName: "Zeynep Kaya",
      bio: "Dijital Pazarlama & Sosyal Medya",
      scriptHeading: "freebies",
      links: ["Ücretsiz Rehber", "YouTube Kanalım", "Podcast", "Hakkımda"],
      leafColor: "#48b88c",
      leafOpacity: 0.65
    },
    {
      id: "olive",
      name: "Olive Elegance",
      bgColor: "#f5f3ee",
      bgGradient: "linear-gradient(180deg, #eae7df 0%, #f5f3ee 40%, #faf9f6 100%)",
      accentColor: "#8a9a6c",
      textColor: "#4a5240",
      headingColor: "#3a4230",
      btnBg: "#ffffff",
      btnText: "#4a5240",
      btnBorder: "#c4ccb8",
      avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&h=150&fit=crop",
      displayName: "Emre Yılmaz",
      bio: "Fotoğrafçı & Görsel Sanatçı",
      scriptHeading: "welcome",
      links: ["Portfolyo", "Randevu Al", "Galeri", "Fiyatlar"],
      leafColor: "#8a9a6c",
      leafOpacity: 0.6
    },
    {
      id: "rose",
      name: "Rose Petal",
      bgColor: "#fdf2f5",
      bgGradient: "linear-gradient(180deg, #fce8ee 0%, #fdf2f5 40%, #ffffff 100%)",
      accentColor: "#d4728c",
      textColor: "#6b3a4a",
      headingColor: "#5a2a3a",
      btnBg: "#ffffff",
      btnText: "#6b3a4a",
      btnBorder: "#e8c0cc",
      avatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=150&h=150&fit=crop",
      displayName: "Selin Arslan",
      bio: "Güzellik & Yaşam Koçu 🌸",
      scriptHeading: "beauty",
      links: ["Online Kurs", "E-Kitap", "Instagram", "Randevu"],
      leafColor: "#d4728c",
      leafOpacity: 0.55
    }
  ];

  // Rotate mockup presets automatically
  useEffect(() => {
    const timer = setInterval(() => {
      setActivePresetIndex((prev) => (prev + 1) % presets.length);
    }, 5000);
    return () => clearInterval(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] rounded-full blur-3xl opacity-40 -z-10 transition-colors duration-700" style={{ backgroundColor: `${activePreset.accentColor}30` }} />

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
            <div className="relative w-full max-w-sm lg:w-[280px] h-[560px] bg-slate-900 rounded-[2.5rem] p-2.5 shadow-2xl border-4 border-slate-800 overflow-hidden transition-all duration-500">
              {/* Speaker Notch */}
              <div className="absolute top-0 inset-x-0 h-6 bg-slate-900 z-20 rounded-b-2xl w-1/3 mx-auto" />

              {/* Dynamic Styled Screen View - Bio Link Template */}
              <div 
                className="relative w-full h-full rounded-[1.8rem] overflow-hidden flex flex-col items-center transition-all duration-700"
                style={{ 
                  background: activePreset.bgGradient,
                  backgroundColor: activePreset.bgColor,
                  color: activePreset.textColor
                }}
              >
                {/* Decorative Leaf SVGs */}
                <LeafDecoration 
                  color={activePreset.leafColor} 
                  opacity={activePreset.leafOpacity} 
                  className="absolute -top-2 -left-3 w-16 h-24 pointer-events-none"
                />
                <LeafDecoration 
                  color={activePreset.leafColor} 
                  opacity={activePreset.leafOpacity} 
                  className="absolute -top-2 -right-3 w-16 h-24 pointer-events-none"
                  flip
                />
                <TwigDecoration 
                  color={activePreset.leafColor} 
                  opacity={activePreset.leafOpacity * 0.7} 
                  className="absolute top-16 -right-1 w-10 h-14 pointer-events-none"
                />
                <TwigDecoration 
                  color={activePreset.leafColor} 
                  opacity={activePreset.leafOpacity * 0.5} 
                  className="absolute bottom-28 -left-1 w-8 h-12 pointer-events-none rotate-[30deg]"
                />

                {/* Scattered gold dots */}
                <div className="absolute top-10 right-6 w-1 h-1 rounded-full opacity-40" style={{ backgroundColor: activePreset.accentColor }} />
                <div className="absolute top-20 left-5 w-1.5 h-1.5 rounded-full opacity-25" style={{ backgroundColor: activePreset.accentColor }} />
                <div className="absolute bottom-36 right-8 w-1 h-1 rounded-full opacity-30" style={{ backgroundColor: activePreset.accentColor }} />

                {/* Content area */}
                <div className="relative z-10 flex flex-col items-center w-full h-full pt-10 pb-4 px-5">
                  
                  {/* Script-style heading */}
                  <div 
                    className="text-2xl mb-3 italic tracking-wide"
                    style={{ 
                      fontFamily: "'Georgia', 'Times New Roman', serif",
                      color: activePreset.headingColor,
                      fontWeight: 400,
                      letterSpacing: "0.02em"
                    }}
                  >
                    {activePreset.scriptHeading}
                  </div>

                  {/* Avatar with decorative ring */}
                  <div className="relative mb-2 shrink-0">
                    {/* Outer decorative circle */}
                    <div 
                      className="absolute -inset-1.5 rounded-full"
                      style={{ 
                        border: `2px solid ${activePreset.accentColor}40`,
                        background: `${activePreset.accentColor}08`
                      }}
                    />
                    <div 
                      className="relative w-16 h-16 rounded-full overflow-hidden border-[2.5px] shadow-lg"
                      style={{ borderColor: activePreset.accentColor }}
                    >
                      <img src={activePreset.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                    </div>
                    {/* Small accent dot on avatar */}
                    <div 
                      className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full flex items-center justify-center text-white text-[7px] font-black shadow-sm"
                      style={{ backgroundColor: activePreset.accentColor }}
                    >
                      ✓
                    </div>
                  </div>

                  {/* Name & Bio */}
                  <div className="text-center mb-1 mt-1">
                    <div 
                      className="text-[11px] font-black tracking-tight uppercase"
                      style={{ color: activePreset.headingColor }}
                    >
                      {activePreset.displayName}
                    </div>
                  </div>
                  <div 
                    className="text-[8px] text-center mb-4 max-w-[160px] leading-relaxed font-medium"
                    style={{ color: `${activePreset.textColor}aa` }}
                  >
                    {activePreset.bio}
                  </div>

                  {/* Link Buttons */}
                  <div className="w-full space-y-2.5 flex-1">
                    {activePreset.links.map((link, idx) => (
                      <div
                        key={idx}
                        className="w-full py-2.5 px-3 rounded-lg flex items-center justify-center text-center transition-all duration-200 cursor-pointer hover:scale-[1.02] hover:shadow-md"
                        style={{
                          backgroundColor: activePreset.btnBg,
                          color: activePreset.btnText,
                          border: `1.5px solid ${activePreset.btnBorder}`,
                          boxShadow: "0 1px 3px rgba(0,0,0,0.06)"
                        }}
                      >
                        <span className="text-[10px] font-bold tracking-tight">{link}</span>
                      </div>
                    ))}
                  </div>

                  {/* Social Icons Row */}
                  <div className="flex items-center justify-center gap-3 mt-3 mb-1">
                    {/* Facebook */}
                    <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ backgroundColor: `${activePreset.accentColor}20` }}>
                      <svg viewBox="0 0 24 24" className="w-2.5 h-2.5" fill={activePreset.accentColor}>
                        <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
                      </svg>
                    </div>
                    {/* Instagram */}
                    <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ backgroundColor: `${activePreset.accentColor}20` }}>
                      <svg viewBox="0 0 24 24" className="w-2.5 h-2.5" fill="none" stroke={activePreset.accentColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                        <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/>
                        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                      </svg>
                    </div>
                    {/* Twitter/X */}
                    <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ backgroundColor: `${activePreset.accentColor}20` }}>
                      <svg viewBox="0 0 24 24" className="w-2.5 h-2.5" fill={activePreset.accentColor}>
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                      </svg>
                    </div>
                    {/* Pinterest */}
                    <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ backgroundColor: `${activePreset.accentColor}20` }}>
                      <svg viewBox="0 0 24 24" className="w-2.5 h-2.5" fill={activePreset.accentColor}>
                        <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z"/>
                      </svg>
                    </div>
                  </div>

                  {/* Watermark */}
                  <div 
                    className="text-[7px] uppercase tracking-[0.2em] font-bold mt-1 pb-1"
                    style={{ color: `${activePreset.textColor}50` }}
                  >
                    {siteTitle}
                  </div>
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
