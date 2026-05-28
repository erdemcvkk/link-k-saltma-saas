"use client";

import { useState, useTransition } from "react";
import { buyProductSimulated } from "@/app/actions";
import {
  User,
  Music,
  ShoppingBag,
  Globe,
  Zap,
  ArrowUpRight,
  Loader2,
  CheckCircle,
  CreditCard,
  Lock,
  X,
  Download,
  Sparkles,
  FileText,
  List,
  Briefcase,
  Play,
  Image,
  MessageCircle,
  Utensils,
  Smartphone,
  Percent,
  Wifi
} from "lucide-react";
import GlobalOverlayManager from "@/components/global-overlay-manager";
import VideoPlayer from "@/components/blocks/video-player";
import BeforeAfterSlider from "@/components/blocks/before-after-slider";
import AudioPlayer from "@/components/blocks/audio-player";

type LinkItem = {
  id: string;
  title: string;
  url: string;
  isActive: boolean;
  type?: string;
  animation?: string;
  bgColor?: string | null;
  textColor?: string | null;
  borderColor?: string | null;
  borderStyle?: string | null;
  borderWidth?: string | null;
  borderRadius?: string | null;
  shadow?: string | null;
  fontWeight?: string | null;
  blockType?: string;
  metadata?: string | null;
};

type ProductItem = {
  id: string;
  title: string;
  type: string;
  price: number;
  description: string | null;
  fileUrl: string;
  isActive: boolean;
  salesCount: number;
};

interface ProfileClientProps {
  username: string;
  bio: string;
  theme: string;
  links: LinkItem[];
  products: ProductItem[];
  avatarUrl: string | null;
  background: string | null;
  fontStyle: string;
  bioColor?: string | null;
  usernameColor?: string | null;
  plan?: string | null;
  storeTitle?: string | null;
  storeCoverUrl?: string | null;
  storeLayout?: string | null;
}

export default function ProfileClient({ username, bio, theme, links, products, avatarUrl, background, fontStyle, bioColor, usernameColor, plan, storeTitle, storeCoverUrl, storeLayout }: ProfileClientProps) {
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  
  const [isPending, startTransition] = useTransition();
  const [errorMsg, setErrorMsg] = useState("");
  const [lang, setLang] = useState<"tr" | "en">("en");
  const [activeTheme, setActiveTheme] = useState<"dark" | "light">("dark");

  const handleStateChange = (state: { lang: "tr" | "en"; theme: "dark" | "light" }) => {
    setLang(state.lang);
    setActiveTheme(state.theme);
  };

  const isDark = activeTheme === "dark";

  // Get matching styles for current theme based on dark/light context!
  const getThemeStyles = (themeId: string) => {
    switch (themeId) {
      case "neon-purple":
        return {
          bg: isDark 
            ? "bg-gradient-to-b from-purple-950 via-zinc-950 to-black text-purple-200"
            : "bg-gradient-to-b from-purple-50 via-zinc-100 to-white text-purple-950",
          cardBg: isDark
            ? "bg-purple-950/10 border-purple-500/20 shadow-[0_0_30px_rgba(168,85,247,0.1)]"
            : "bg-white/80 border-purple-200 shadow-md text-zinc-800",
          glowText: isDark
            ? "text-purple-400 font-bold tracking-wide drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]"
            : "text-purple-700 font-bold tracking-wide",
          avatarBg: "from-purple-500 to-pink-500",
          btnClass: isDark
            ? "bg-purple-950/20 border border-purple-500/30 text-purple-200 hover:bg-purple-900/30 hover:border-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.05)]"
            : "bg-purple-50 border border-purple-200 text-purple-700 hover:bg-purple-100/50 shadow-sm",
          accentColor: isDark ? "text-purple-400" : "text-purple-600",
          badgeClass: "bg-purple-500/20 text-purple-300 border-purple-500/30",
        };
      case "glow-green":
        return {
          bg: isDark
            ? "bg-gradient-to-b from-emerald-950/40 via-zinc-950 to-black text-emerald-200"
            : "bg-gradient-to-b from-emerald-50 via-zinc-100 to-white text-emerald-950",
          cardBg: isDark
            ? "bg-emerald-950/10 border-emerald-500/20 shadow-[0_0_30px_rgba(16,185,129,0.1)]"
            : "bg-white/80 border-emerald-200 shadow-md text-zinc-800",
          glowText: isDark
            ? "text-emerald-400 font-bold tracking-wide drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]"
            : "text-emerald-700 font-bold tracking-wide",
          avatarBg: "from-emerald-500 to-teal-500",
          btnClass: isDark
            ? "bg-emerald-950/20 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-900/30 hover:border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.05)]"
            : "bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-100/50 shadow-sm",
          accentColor: isDark ? "text-emerald-400" : "text-emerald-600",
          badgeClass: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
        };
      case "pink-retro":
        return {
          bg: isDark
            ? "bg-gradient-to-b from-pink-950/40 via-zinc-950 to-black text-pink-200"
            : "bg-gradient-to-b from-pink-50 via-zinc-100 to-white text-pink-950",
          cardBg: isDark
            ? "bg-pink-950/10 border-pink-500/20 shadow-[0_0_30px_rgba(244,63,94,0.1)]"
            : "bg-white/80 border-pink-200 shadow-md text-zinc-800",
          glowText: isDark
            ? "text-pink-400 font-bold tracking-wide drop-shadow-[0_0_8px_rgba(244,63,94,0.5)]"
            : "text-pink-700 font-bold tracking-wide",
          avatarBg: "from-pink-500 to-rose-500",
          btnClass: isDark
            ? "bg-pink-950/20 border border-pink-500/30 text-pink-200 hover:bg-pink-900/30 hover:border-pink-400 shadow-[0_0_15px_rgba(244,63,94,0.05)]"
            : "bg-pink-50 border border-pink-200 text-pink-700 hover:bg-pink-100/50 shadow-sm",
          accentColor: isDark ? "text-pink-400" : "text-pink-600",
          badgeClass: "bg-pink-500/20 text-pink-300 border-pink-500/30",
        };
      case "glassmorphism":
        return {
          bg: "bg-slate-950 text-white",
          cardBg: "bg-white/10 border-white/20 backdrop-blur-md shadow-2xl text-white",
          glowText: "text-white font-bold tracking-wide drop-shadow-[0_0_12px_rgba(255,255,255,0.4)]",
          avatarBg: "from-purple-500/50 to-pink-500/50",
          btnClass: "bg-white/10 border border-white/20 backdrop-blur-md hover:bg-white/20 text-white shadow-lg",
          accentColor: "text-white",
          badgeClass: "bg-white/20 text-white border-white/30",
        };
      case "brutalism":
        return {
          bg: "bg-[#facc15] text-black",
          cardBg: "bg-white border-4 border-black rounded-none shadow-brutal text-black",
          glowText: "text-black font-bold uppercase",
          avatarBg: "from-zinc-900 to-black",
          btnClass: "bg-[#ff007f] border-4 border-black rounded-none shadow-brutal-sm hover:shadow-none hover:translate-x-1 hover:translate-y-1 text-black font-bold transition-all",
          accentColor: "text-black",
          badgeClass: "bg-[#ff007f] text-black border-2 border-black rounded-none",
        };
      case "terminal":
        return {
          bg: "bg-black text-[#22c55e] font-mono",
          cardBg: "bg-black border-2 border-[#22c55e] rounded-none shadow-[0_0_15px_rgba(34,197,94,0.15)] text-[#22c55e]",
          glowText: "text-[#22c55e] font-mono font-bold tracking-widest uppercase",
          avatarBg: "from-zinc-950 to-zinc-900 border-[#22c55e]",
          btnClass: "bg-black border-2 border-[#22c55e] rounded-none text-[#22c55e] hover:bg-[#22c55e]/10 font-mono transition-all",
          accentColor: "text-[#22c55e]",
          badgeClass: "bg-[#22c55e]/20 text-[#22c55e] border-[#22c55e]/30 rounded-none",
        };
      default: // dark default
        return {
          bg: isDark ? "bg-black text-zinc-200" : "bg-zinc-50 text-zinc-800",
          cardBg: isDark ? "bg-zinc-900/40 border-zinc-800" : "bg-white border-zinc-200 shadow-md",
          glowText: isDark ? "text-white" : "text-zinc-900 font-bold",
          avatarBg: "from-zinc-400 to-zinc-500",
          btnClass: isDark
            ? "bg-zinc-900/50 border border-zinc-800 hover:bg-zinc-900 hover:border-zinc-700 text-zinc-200"
            : "bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-100 shadow-sm",
          accentColor: isDark ? "text-white" : "text-zinc-800",
          badgeClass: "bg-zinc-800 text-zinc-400 border-zinc-700",
        };
    }
  };

  const currentStyles = getThemeStyles(theme);
  const getLinkIcon = (type?: string, url?: string) => {
    switch (type) {
      case "WEBSITE":
      case "FACEBOOK":
      case "INSTAGRAM":
        return <Globe className="h-5 w-5" />;
      case "PDF":
        return <FileText className="h-5 w-5" />;
      case "LINK_LIST":
        return <List className="h-5 w-5" />;
      case "VCARD":
        return <User className="h-5 w-5" />;
      case "BUSINESS":
        return <Briefcase className="h-5 w-5" />;
      case "VIDEO":
        return <Play className="h-5 w-5" />;
      case "IMAGES":
        return <Image className="h-5 w-5" />;
      case "SOCIAL_MEDIA":
      case "WHATSAPP":
        return <MessageCircle className="h-5 w-5" />;
      case "MP3":
        return <Music className="h-5 w-5" />;
      case "MENU":
        return <Utensils className="h-5 w-5" />;
      case "APPS":
        return <Smartphone className="h-5 w-5" />;
      case "COUPON":
        return <Percent className="h-5 w-5" />;
      case "WIFI":
        return <Wifi className="h-5 w-5" />;
      default:
        if (url) {
          const lowerUrl = url.toLowerCase();
          if (lowerUrl.includes("spotify") || lowerUrl.includes("soundcloud") || lowerUrl.includes("music")) {
            return <Music className="h-5 w-5" />;
          }
          if (lowerUrl.includes("shop") || lowerUrl.includes("store") || lowerUrl.includes("presets")) {
            return <ShoppingBag className="h-5 w-5" />;
          }
          if (lowerUrl.includes("website") || lowerUrl.includes("portfolio")) {
            return <Globe className="h-5 w-5" />;
          }
        }
        return <Zap className="h-5 w-5" />;
    }
  };
  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;

    setErrorMsg("");
    startTransition(async () => {
      try {
        await buyProductSimulated(selectedProduct.id);
        setDownloadUrl(selectedProduct.fileUrl);
        setCheckoutSuccess(true);
      } catch (err: any) {
        setErrorMsg(lang === "tr" ? "Simüle edilen transfer işlemi başarısız." : "Simulated payment transaction failed.");
      }
    });
  };

  const closeCheckoutModal = () => {
    setSelectedProduct(null);
    setCardNumber("");
    setCardExpiry("");
    setCardCvc("");
    setCheckoutSuccess(false);
    setDownloadUrl(null);
    setErrorMsg("");
  };

  // Translations
  const t = {
    socialOutposts: lang === "tr" ? "Sosyal Medya Linkleri" : "Social Outposts",
    noLinks: lang === "tr" ? "Henüz aktif bağlantı adresi eklenmemiş." : "No active links found.",
    shopCatalog: lang === "tr" ? "Dijital Ürün Mağazası" : "Digital Shop Catalog",
    noDesc: lang === "tr" ? "Bu ürün için bir açıklama girilmemiş." : "No description provided.",
    downloadGlow: lang === "tr" ? "Anında Dosya Teslimat" : "Instant File Download",
    microGate: lang === "tr" ? "Güvenli Ödeme Geçidi" : "Micro-Checkout Gate",
    totalPrice: lang === "tr" ? "Toplam Tutar" : "Total Price",
    cardNum: lang === "tr" ? "Kredi Kartı Numarası" : "Credit Card Number",
    expiry: lang === "tr" ? "Son Kullanma Tarihi" : "Expiry Date",
    secureSim: lang === "tr" ? "Güvenli simüle edilmiş 3D Secure altyapısı." : "Secure simulated 3D Secure checkout environment.",
    completePay: lang === "tr" ? "Ödemeyi Tamamla" : "Complete Payment",
    confirmed: lang === "tr" ? "Ödeme Başarıyla Alındı!" : "Payment Confirmed!",
    confirmedDesc: lang === "tr" 
      ? "Simüle edilen transferiniz sisteme işlendi. Satın aldığınız dijital dosyaya aşağıdaki butondan anında ulaşabilirsiniz."
      : "Your simulated transfer has been logged. You can instantly access the download link below.",
    downloadInstantly: lang === "tr" ? "Dosyayı Şimdi İndir" : "Download File Instantly",
  };

  // Determine background rendering mode
  const isCustomImg = background?.startsWith("custom-img::") || background?.startsWith("http://") || background?.startsWith("https://") || background?.startsWith("/");
  const isCustomVideo = background?.startsWith("custom-video::");
  const customImgUrl = isCustomImg ? (background!.startsWith("custom-img::") ? background!.replace("custom-img::", "") : background) : null;
  const customVideoUrl = isCustomVideo ? background!.replace("custom-video::", "") : null;
  
  const isTailwindBg = background?.includes("bg-") || background?.includes("from-") || background?.includes("to-");
  const isCssBg = background && !isCustomImg && !isCustomVideo && !isTailwindBg;

  const bgClassName = (background && isTailwindBg && !isCustomImg && !isCustomVideo) 
    ? background 
    : (!background && !isCustomImg && !isCustomVideo ? currentStyles.bg : "");

  return (
    <div 
      className={`min-h-screen relative flex flex-col justify-between py-20 px-4 transition-all duration-500 ${bgClassName}`}
      style={{
        fontFamily: fontStyle,
        ...(isCssBg ? { background: background } : {}),
        ...(customImgUrl ? { backgroundImage: `url(${customImgUrl})`, backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat" } : {})
      }}
    >
      <GlobalOverlayManager onStateChange={handleStateChange} />

      {/* Advanced Theme Overlays */}
      {theme === "glassmorphism" && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <div className="glass-sphere glass-sphere-purple w-[300px] h-[300px] top-[10%] left-[-50px]" />
          <div className="glass-sphere glass-sphere-emerald w-[280px] h-[280px] bottom-[15%] right-[-50px]" />
          <div className="glass-sphere glass-sphere-pink w-[220px] h-[220px] top-[50%] left-[30%]" />
        </div>
      )}

      {theme === "terminal" && <div className="crt-scanlines" />}

      {theme === "brutalism" && (
        <div className="absolute top-0 left-0 right-0 h-10 bg-black text-[#facc15] font-black text-xs uppercase flex items-center overflow-hidden border-b-4 border-black z-20">
          <div className="animate-marquee">
            {" 🔥 WEB3 BRUTALISM // PORTFOLIO SITE CREATOR // ULTRA-DYNAMIC UX // NO CORNERS ALLOWED // ".repeat(4)}
          </div>
        </div>
      )}

      {/* Custom Video Background */}
      {customVideoUrl && (
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover pointer-events-none z-0"
          src={customVideoUrl}
        />
      )}

      {/* Decorative Grid Overlays */}
      <div className={`absolute inset-0 bg-[linear-gradient(to_right,#80808007_1px,transparent_1px),linear-gradient(to_bottom,#80808007_1px,transparent_1px)] bg-[size:24px_36px] pointer-events-none z-[1]`} />

      <main className="max-w-md w-full mx-auto space-y-10 relative z-10 flex-1 flex flex-col justify-center">
        {/* Profile Card */}
        <div className={`p-8 rounded-[2.5rem] border text-center backdrop-blur-md flex flex-col items-center gap-6 ${currentStyles.cardBg}`}>
          <div className={`w-24 h-24 rounded-full bg-gradient-to-tr ${currentStyles.avatarBg} border-4 border-white/10 shadow-lg flex items-center justify-center overflow-hidden`}>
            {avatarUrl ? (
              <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <User className="h-12 w-12 text-white" />
            )}
          </div>

          <div className="space-y-2 w-full">
            <h1 
              style={usernameColor ? { color: usernameColor } : undefined}
              className={`text-2xl font-bold ${currentStyles.glowText}`}
            >
              @{username}
            </h1>
            {bio && (
              <p 
                style={bioColor ? { color: bioColor } : undefined}
                className={`text-sm leading-relaxed max-w-xs mx-auto px-2 ${isDark ? "text-zinc-400" : "text-zinc-600"}`}
              >
                {bio}
              </p>
            )}
          </div>
        </div>

        {/* Links Grid */}
        <div className="space-y-4 w-full">
          {links.length > 0 && <h3 className={`text-xs uppercase tracking-widest font-bold mb-1 ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>{t.socialOutposts}</h3>}
          {links.length === 0 ? (
            <div className={`text-center py-6 text-xs rounded-2xl border border-dashed ${
              isDark ? "text-zinc-500 bg-zinc-950/20 border-zinc-900" : "text-zinc-600 bg-zinc-100 border-zinc-200"
            }`}>
              {t.noLinks}
            </div>
          ) : (
            links.map((link, idx) => {
              // Parse optional block metadata safely
              let blockMeta: any = {};
              if (link.metadata) {
                try {
                  blockMeta = JSON.parse(link.metadata);
                } catch (e) {
                  console.error("Failed to parse link block metadata: ", e);
                }
              }

              const customStyle: React.CSSProperties = {
                backgroundColor: link.bgColor || undefined,
                color: link.textColor || undefined,
                borderColor: link.borderColor || undefined,
                borderStyle: link.borderStyle as any || undefined,
                borderWidth: link.borderWidth || undefined,
                borderRadius: link.borderRadius || undefined,
                boxShadow: link.shadow === "glow-purple" ? "0 0 15px rgba(168,85,247,0.5)"
                         : link.shadow === "glow-emerald" ? "0 0 15px rgba(16,185,129,0.5)"
                         : link.shadow === "soft" ? "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)"
                         : link.shadow === "hard-3d" ? "4px 4px 0px 0px rgba(0,0,0,1)"
                         : undefined,
                animationDelay: `${idx * 0.12}s`, // staggered entrance delay!
              };

              const dynamicBlockClass = `stagger-item ${
                !link.bgColor ? currentStyles.btnClass : ""
              } ${!link.borderRadius ? (theme === "brutalism" || theme === "terminal" ? "rounded-none" : "rounded-[1.25rem]") : ""} ${link.animation || ""} ${
                link.fontWeight === "font-normal" ? "font-normal"
                : link.fontWeight === "font-medium" ? "font-medium"
                : link.fontWeight === "font-bold" ? "font-bold"
                : link.fontWeight === "font-black" ? "font-black"
                : "font-bold"
              }`;

              if (link.blockType === "VIDEO_PLAYER") {
                return (
                  <VideoPlayer
                    key={link.id}
                    title={link.title}
                    url={link.url}
                    isDark={isDark}
                    boxStyle={customStyle}
                    className={dynamicBlockClass}
                  />
                );
              }

              if (link.blockType === "BEFORE_AFTER") {
                return (
                  <BeforeAfterSlider
                    key={link.id}
                    title={link.title}
                    beforeImage={blockMeta.beforeImage || ""}
                    afterImage={blockMeta.afterImage || ""}
                    isDark={isDark}
                    boxStyle={customStyle}
                    className={dynamicBlockClass}
                  />
                );
              }

              if (link.blockType === "AUDIO_PLAYER") {
                return (
                  <AudioPlayer
                    key={link.id}
                    title={link.title}
                    url={link.url}
                    isDark={isDark}
                    boxStyle={customStyle}
                    className={dynamicBlockClass}
                  />
                );
              }

              // Standard TEXT_LINK fallback
              return (
                <a
                  key={link.id}
                  href={`/click/${link.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={customStyle}
                  className={`flex items-center justify-between p-3 transition-all text-sm select-none hover:scale-[1.025] hover:shadow-lg ${dynamicBlockClass}`}
                >
                  <div className="flex items-center gap-3.5">
                    <div className="h-9 w-9 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100 shadow-sm">
                      {getLinkIcon(link.type, link.url)}
                    </div>
                    <span style={link.textColor ? { color: link.textColor } : undefined}>{link.title}</span>
                  </div>
                  <ArrowUpRight className="h-4 w-4 opacity-50 shrink-0" style={link.textColor ? { color: link.textColor } : undefined} />
                </a>
              );
            })
          )}
        </div>

        {/* 🛒 Digital Shop Products Grid */}
        {products.length > 0 && (
          <div className="space-y-6 w-full pt-6 border-t border-white/10 mt-6">
            
            {storeCoverUrl && (
              <div className="w-full h-32 md:h-48 rounded-[2rem] overflow-hidden mb-4 relative shadow-lg">
                <img src={storeCoverUrl} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              </div>
            )}

            <div className="flex flex-col items-center justify-center gap-1 text-center mb-6">
              <ShoppingBag className={`h-8 w-8 mb-2 ${currentStyles.accentColor}`} />
              <h3 className={`text-2xl font-black ${isDark ? "text-white" : "text-slate-900"}`}>
                {storeTitle || (lang === "tr" ? "Mağazam" : "My Store")}
              </h3>
              <p className={`text-sm ${isDark ? "text-zinc-400" : "text-zinc-500"}`}>{t.shopCatalog}</p>
            </div>
            
            <div className={`grid gap-4 ${storeLayout === "GRID" ? "grid-cols-2 md:grid-cols-2" : "grid-cols-1"}`}>
              {products.map((prod) => (
                <div
                  key={prod.id}
                  onClick={() => setSelectedProduct(prod)}
                  className={`p-5 rounded-[1.25rem] border backdrop-blur-sm cursor-pointer transition-all hover:-translate-y-0.5 select-none ${currentStyles.cardBg}`}
                >
                  <div className="flex justify-between items-start gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className={`px-1.5 py-0.5 rounded border text-[8px] font-bold uppercase tracking-wider ${
                          isDark ? "bg-zinc-900 border-zinc-800 text-zinc-400" : "bg-zinc-100 border-zinc-200 text-zinc-600"
                        }`}>
                          {prod.type}
                        </span>
                        <h4 className={`text-sm font-bold leading-tight ${isDark ? "text-white" : "text-zinc-800"}`}>{prod.title}</h4>
                      </div>
                      <p className={`text-xs line-clamp-2 pr-4 ${isDark ? "text-zinc-500" : "text-zinc-600"}`}>{prod.description || t.noDesc}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className={`text-sm font-black font-mono block ${currentStyles.accentColor}`}>{prod.price}₺</span>
                      <span className="text-[9px] text-zinc-500 block font-bold font-mono">{t.downloadGlow}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* 💳 Micro-Checkout Modal Backdrop */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm rounded-[2rem] bg-zinc-950 border border-zinc-900 shadow-2xl relative overflow-hidden p-6 space-y-6">
            
            {/* Header close trigger */}
            <button
              onClick={closeCheckoutModal}
              className="absolute top-4 right-4 p-2 rounded-full bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-white cursor-pointer transition-colors"
            >
              <X className="h-4 w-4" />
            </button>

            {!checkoutSuccess ? (
              <>
                <div className="space-y-1">
                  <span className="text-[10px] text-purple-400 uppercase tracking-wider font-extrabold block">{t.microGate}</span>
                  <h3 className="text-lg font-black text-white leading-tight">{selectedProduct.title}</h3>
                  <div className="flex items-center gap-2 pt-1">
                    <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-[9px] font-bold text-purple-400 border border-purple-500/30">
                      {selectedProduct.type}
                    </span>
                    <span className="text-xs font-mono text-zinc-400">{t.totalPrice}: <span className="text-emerald-400 font-extrabold">{selectedProduct.price}₺</span></span>
                  </div>
                </div>

                {errorMsg && (
                  <div className="p-3 rounded-lg bg-red-950/20 border border-red-500/20 text-[11px] text-red-400 font-semibold">
                    {errorMsg}
                  </div>
                )}

                <form onSubmit={handleCheckoutSubmit} className="space-y-4 pt-2">
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold block">{t.cardNum}</label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="4242 4242 4242 4242"
                        maxLength={19}
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 focus:border-purple-500/50 outline-none text-white text-xs font-mono"
                        required
                      />
                      <CreditCard className="absolute left-3.5 top-3.5 h-4 w-4 text-zinc-500" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold block">{t.expiry}</label>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        maxLength={5}
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 focus:border-purple-500/50 outline-none text-white text-xs font-mono"
                        required
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold block">CVC</label>
                      <input
                        type="password"
                        placeholder="***"
                        maxLength={3}
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 focus:border-purple-500/50 outline-none text-white text-xs font-mono"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-[10px] text-zinc-500 border-t border-zinc-900 pt-4">
                    <Lock className="h-3.5 w-3.5 text-emerald-400" />
                    <span>{t.secureSim}</span>
                  </div>

                  <button
                    type="submit"
                    disabled={isPending}
                    className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:bg-zinc-900 text-white disabled:text-zinc-500 font-extrabold text-xs transition-colors cursor-pointer flex items-center justify-center gap-2"
                  >
                    {isPending ? (
                      <Loader2 className="h-4.5 w-4.5 animate-spin" />
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4" />
                        {t.completePay} ({selectedProduct.price}₺)
                      </>
                    )}
                  </button>
                </form>
              </>
            ) : (
              <div className="text-center py-6 space-y-5">
                <div className="w-14 h-14 rounded-full bg-emerald-950/20 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.15)]">
                  <CheckCircle className="h-7 w-7" />
                </div>

                <div className="space-y-1">
                  <h3 className="text-lg font-black text-white">{t.confirmed}</h3>
                  <p className="text-xs text-zinc-500 leading-relaxed">
                    {t.confirmedDesc}
                  </p>
                </div>

                {downloadUrl && (
                  <a
                    href={downloadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs transition-colors cursor-pointer shadow-[0_0_15px_rgba(16,185,129,0.25)]"
                  >
                    <Download className="h-4.5 w-4.5" />
                    {t.downloadInstantly}
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Brand Watermark */}
      {(plan !== "CREATOR" && plan !== "PRO_BUSINESS") && (
        <footer className="text-center text-[10px] text-zinc-600 uppercase tracking-widest font-black py-8 relative z-10">
          <a href="/" className="hover:text-zinc-500 transition-colors">
            Powered by CREATOR.HUB
          </a>
        </footer>
      )}
    </div>
  );
}
