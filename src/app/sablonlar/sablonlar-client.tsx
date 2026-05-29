"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Search, Eye, ShoppingCart, X, Check, Laptop, Smartphone, ExternalLink, Sparkles, CreditCard, Lock, Loader2 } from "lucide-react";
import GlobalOverlayManager from "@/components/global-overlay-manager";
import { purchaseTemplate } from "@/app/actions";

interface Template {
  id: string;
  name: string;
  price: number;
  category: string;
  coverUrl: string;
  bgColor: string;
  fontStyle: string;
  buttonStyle: string;
  paymentLink?: string | null;
  isActive: boolean;
  isCoded: boolean;
  customCss?: string | null;
  configJson?: string | null;
  createdAt: Date;
}

interface SablonlarClientProps {
  initialTemplates: Template[];
  userId: string | null;
  initialOwnedTemplateIds?: string[];
}

export default function SablonlarClient({ initialTemplates, userId, initialOwnedTemplateIds = [] }: SablonlarClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tümü");
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);
  const [ownedTemplateIds, setOwnedTemplateIds] = useState<string[]>(initialOwnedTemplateIds);
  const [isPending, setIsPending] = useState(false);
  const [visibleCount, setVisibleCount] = useState(12);

  // Simulated Payment Modal States
  const [checkoutTemplate, setCheckoutTemplate] = useState<Template | null>(null);
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentPending, setPaymentPending] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Handle URL intent
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const intent = urlParams.get("intent");
      if (intent && intent.startsWith("purchase_")) {
        const templateId = intent.replace("purchase_", "");
        const targetTemplate = initialTemplates.find(t => t.id === templateId);
        if (targetTemplate && userId) {
          // Remove intent from URL so it doesn't trigger again on reload
          window.history.replaceState({}, document.title, window.location.pathname);
          // Small delay to allow UI to render first
          setTimeout(() => {
            handlePurchase(targetTemplate);
          }, 500);
        }
      }
    }
  }, [initialTemplates, userId]);

  const handleSelectTemplate = (template: Template | null) => {
    setSelectedTemplate(template);
    setErrorMsg("");
  };

  // Extract unique categories
  const categories = ["Tümü", ...Array.from(new Set(initialTemplates.map((t) => t.category)))];

  // Filter templates
  const filteredTemplates = initialTemplates.filter((t) => {
    const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          t.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "Tümü" || t.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handlePurchase = (template: Template) => {
    if (!userId) {
      alert("Şablon satın almak veya kullanmak için lütfen giriş yapın.");
      window.location.href = `/sign-in?redirect_url=/sablonlar?intent=purchase_${template.id}`;
      return;
    }

    // If it's a paid template, open the simulated credit card modal instead of direct checkout!
    if (template.price > 0) {
      setCheckoutTemplate(template);
      return;
    }

    setIsPending(true);
    // Register simulated free template purchase instantly
    const triggerFreePurchase = async () => {
      try {
        await purchaseTemplate(userId, template.id);
        setOwnedTemplateIds(prev => [...prev, template.id]);
        setPurchaseSuccess(true);
        setIsPending(false);
        setTimeout(() => {
          setPurchaseSuccess(false);
          setSelectedTemplate(null);
        }, 2000);
      } catch (err: any) {
        console.error("Free Purchase error:", err);
        setErrorMsg(err.message || "Şablon tanımlanırken hata oluştu.");
        setIsPending(false);
      }
    };
    triggerFreePurchase();
  };

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkoutTemplate || !userId) return;

    setErrorMsg("");
    setPaymentPending(true);

    try {
      // Premium feel simulated payment delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      await purchaseTemplate(userId, checkoutTemplate.id);
      setOwnedTemplateIds(prev => [...prev, checkoutTemplate.id]);
      
      setPaymentSuccess(true);
      setPaymentPending(false);
      setPurchaseSuccess(true);

      setTimeout(() => {
        setPaymentSuccess(false);
        setCheckoutTemplate(null);
        setSelectedTemplate(null);
        setPurchaseSuccess(false);
        // Clear card inputs
        setCardNumber("");
        setCardExpiry("");
        setCardCvc("");
      }, 2000);
    } catch (err: any) {
      setErrorMsg(err.message || "Ödeme işlemi gerçekleştirilemedi.");
      setPaymentPending(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans relative overflow-hidden pb-16">
      <GlobalOverlayManager />
      
      {/* Decorative Glow Elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <nav className="border-b border-zinc-800 bg-zinc-950/90 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-[1800px] mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="font-black text-xl tracking-tighter text-white">
            Link.SaaS
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-sm font-bold text-zinc-400 hover:text-white">
              Dashboard'a Dön
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Header */}
      <div className="max-w-[1800px] mx-auto px-6 pt-16 pb-6">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose-500/10 text-rose-500 font-bold text-sm mb-6">
            <Sparkles className="h-4 w-4" />
            <span>Premium Şablon Vitrini</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight mb-6">
            Sayfanıza <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-orange-500">Güç Katın</span>
          </h1>
          <p className="text-lg text-zinc-400 font-medium">
            Kreatörler, müzisyenler ve gamerlar için tasarlanmış şık şablonları inceleyin, anında profilinizde uygulayın.
          </p>
        </div>
      </div>

      {/* Search and Filters Section */}
      <div className="max-w-[1800px] mx-auto px-6 py-6 space-y-12">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-zinc-900/40 p-4 rounded-3xl border border-zinc-800 backdrop-blur-sm max-w-5xl mx-auto">
          {/* Categories Tab */}
          <div className="flex flex-wrap gap-2 justify-center md:justify-start w-full md:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  setVisibleCount(12); // Reset on category change
                }}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-gradient-to-r from-rose-500 to-orange-500 text-white shadow-md shadow-rose-500/20"
                    : "bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search bar */}
          <div className="relative w-full md:w-72">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
              <Search className="h-4 w-4" />
            </span>
            <input
              type="text"
              placeholder="Şablon ara..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setVisibleCount(12); // Reset on search
              }}
              className="w-full pl-10 pr-4 py-2 rounded-full bg-zinc-950 border border-zinc-800 text-sm font-semibold focus:outline-none focus:border-rose-500 text-white placeholder-zinc-500 transition-colors"
            />
          </div>
        </div>

        {/* Templates Grid */}
        {filteredTemplates.length === 0 ? (
          <div className="text-center py-20 bg-zinc-900/20 border border-dashed border-zinc-800 rounded-3xl max-w-5xl mx-auto">
            <p className="text-zinc-500 text-sm font-semibold">Aradığınız kriterlere uygun şablon bulunamadı.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-12">
              {filteredTemplates.slice(0, visibleCount).map((template) => {
                const isPurchased = ownedTemplateIds.includes(template.id);
                return (
                  <div key={template.id} className="flex flex-col items-center">
                    <div className="text-center mb-4 px-2">
                      <h3 className="text-lg font-bold text-white mb-1">{template.name}</h3>
                      <p className="text-xs text-zinc-400 font-medium">{template.category}</p>
                    </div>

                    {/* Phone Mockup Frame */}
                    <div 
                      className="relative w-full aspect-[9/19] max-h-[600px] bg-zinc-900 rounded-[2.5rem] p-2.5 shadow-2xl border-4 border-zinc-800 overflow-hidden shrink-0 group mb-4 cursor-pointer" 
                      onClick={() => handleSelectTemplate(template)}
                    >
                      <div className="absolute top-0 inset-x-0 h-5 bg-zinc-900 z-20 rounded-b-2xl w-[40%] mx-auto shadow-sm" />
                      <div className="relative w-full h-full bg-zinc-950 rounded-[1.5rem] overflow-hidden">
                        <img 
                          src={template.coverUrl} 
                          alt={template.name} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                        />
                        {template.isCoded && (
                          <div className="absolute top-6 right-3 bg-purple-500/90 px-2 py-0.5 rounded-full text-[9px] font-bold text-white z-30">
                            KODLANMIŞ
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-30">
                          <div className="px-4 py-2 bg-white/20 backdrop-blur-md border border-white/30 rounded-full text-white text-sm font-bold flex items-center gap-2">
                            <Eye className="h-4 w-4" /> İncele
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Section */}
                    <div className="w-full bg-zinc-900 rounded-2xl p-3 border border-zinc-800 text-center flex flex-col gap-2">
                      <div className="text-xl font-black text-white">{template.price === 0 ? "Ücretsiz" : `₺${template.price}`}</div>
                      {isPurchased ? (
                        <button disabled className="w-full py-2.5 rounded-xl bg-green-500/20 text-green-500 font-bold flex items-center justify-center gap-2 text-sm">
                          <Check className="h-4 w-4" /> Tanımlı
                        </button>
                      ) : (
                        <button 
                          onClick={() => handlePurchase(template)}
                          disabled={isPending}
                          className="w-full py-2.5 rounded-xl bg-rose-600 text-white font-bold flex items-center justify-center gap-2 hover:bg-rose-500 transition-colors disabled:opacity-50 text-sm"
                        >
                          {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShoppingCart className="h-4 w-4" />} Satın Al
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {visibleCount < filteredTemplates.length && (
              <div className="flex justify-center pt-8">
                <button
                  onClick={() => setVisibleCount(prev => prev + 4)}
                  className="px-8 py-3 rounded-full bg-zinc-900 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800 text-white font-bold transition-all flex items-center gap-2"
                >
                  Devamını Gör
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Live Preview Modal */}
      {selectedTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/85 backdrop-blur-md" onClick={() => handleSelectTemplate(null)} />

          {/* Modal Container */}
          <div className="relative w-full max-w-4xl bg-slate-950 border border-slate-800 rounded-3xl p-6 overflow-hidden flex flex-col md:flex-row gap-8 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            
            {/* Close button */}
            <button 
              onClick={() => handleSelectTemplate(null)} 
              className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white transition-all cursor-pointer z-10"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Mobile Mockup Preview (Left Side) */}
            <div className="flex-1 flex justify-center items-center">
              <div className="relative w-[280px] h-[540px] bg-slate-900 rounded-[2.5rem] p-2.5 shadow-2xl border-4 border-slate-800 overflow-hidden shrink-0">
                {/* Notch */}
                <div className="absolute top-0 inset-x-0 h-4 bg-slate-900 z-20 rounded-b-2xl w-1/3 mx-auto" />
                
                {/* Live Mock Screen Container */}
                <div 
                  className="w-full h-full rounded-[2rem] overflow-hidden flex flex-col items-center pt-10 px-4 relative"
                  style={{
                    background: selectedTemplate.bgColor.includes("gradient") ? undefined : selectedTemplate.bgColor,
                    backgroundImage: selectedTemplate.bgColor.includes("gradient") ? selectedTemplate.bgColor : undefined,
                    fontFamily: selectedTemplate.fontStyle,
                  }}
                >
                  {/* Dynamic Custom CSS injection inside preview */}
                  {selectedTemplate.isCoded && selectedTemplate.customCss && (
                    <style dangerouslySetInnerHTML={{ __html: selectedTemplate.customCss }} />
                  )}

                  {/* Profile Elements */}
                  <div className="profile-card flex flex-col items-center w-full text-center">
                    <div className="w-16 h-16 rounded-full bg-slate-800 border-2 border-white/10 shadow-md mb-2.5 overflow-hidden">
                      <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&h=150&fit=crop" className="w-full h-full object-cover" />
                    </div>
                    <div className="text-sm font-bold text-white mb-1">@kullaniciadi</div>
                    <div className="text-[10px] text-white/70 max-w-[180px] leading-relaxed mb-6">
                      Bu harika şablonun canlı önizlemesidir. Kendi sayfanızda uygulamak için hemen sahip olun!
                    </div>
                  </div>

                  {/* Dummy styled links */}
                  <div className="w-full space-y-3.5 z-10">
                    {[
                      "📸 Instagram Hesabım",
                      "🎵 Yeni Spotify Albümüm",
                      "🛍️ Mağaza Vitrinim"
                    ].map((title, idx) => (
                      <div 
                        key={idx}
                        className={`btn-link w-full py-2.5 px-4 text-xs font-bold text-center border transition-all cursor-pointer ${selectedTemplate.buttonStyle}`}
                      >
                        {title}
                      </div>
                    ))}
                  </div>

                  {/* Footer logo remove status preview */}
                  <div className="absolute bottom-4 text-[9px] text-white/50 tracking-wider">
                    Powered by Link.SaaS
                  </div>
                </div>
              </div>
            </div>

            {/* Template Purchase Info (Right Side) */}
            <div className="flex-1 flex flex-col justify-between py-2 text-left">
              <div>
                <span className="px-2.5 py-1 bg-slate-900 border border-slate-800 rounded-full text-[10px] font-black text-neon-blue uppercase tracking-wider">
                  {selectedTemplate.category} Şablonu
                </span>
                
                <h2 className="text-3xl font-black tracking-tight text-white mt-3.5">
                  {selectedTemplate.name}
                </h2>
                
                <div className="text-2xl font-black text-neon-blue mt-2">
                  {selectedTemplate.price === 0 ? "Ücretsiz Plan" : `${selectedTemplate.price} ₺`}
                </div>

                <div className="border-t border-slate-900 my-5 pt-4 space-y-3">
                  <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-300">
                    <Check className="h-4 w-4 text-neon-blue shrink-0" />
                    <span>Dinamik {selectedTemplate.fontStyle} yazı tipi desteği</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-300">
                    <Check className="h-4 w-4 text-neon-blue shrink-0" />
                    <span>Gelişmiş buton animasyonları ve düzenleri</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-300">
                    <Check className="h-4 w-4 text-neon-blue shrink-0" />
                    <span>Tüm tarayıcılar ve mobil cihazlar ile tam uyumluluk</span>
                  </div>
                  {selectedTemplate.isCoded && (
                    <div className="flex items-center gap-2.5 text-xs font-semibold text-purple-400">
                      <Check className="h-4 w-4 text-purple-500 shrink-0" />
                      <span>Custom CSS stili ve JSON yapılandırmaları aktif</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action area */}
              <div className="space-y-3.5 pt-4">
                {purchaseSuccess ? (
                  <div className="w-full py-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-center font-bold text-sm flex items-center justify-center gap-2 animate-pulse">
                    <Check className="h-5 w-5" />
                    Şablon Hesabınıza Tanımlandı!
                  </div>
                ) : ownedTemplateIds.includes(selectedTemplate.id) ? (
                  <Link
                    href="/dashboard"
                    className="w-full py-3.5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-750 text-white font-black text-sm tracking-wide transition-all flex items-center justify-center gap-2 cursor-pointer text-center"
                  >
                    <Check className="h-4 w-4 text-emerald-450" />
                    Hesabınızda Tanımlı (Panele Git)
                  </Link>
                ) : (
                  <button
                    onClick={() => handlePurchase(selectedTemplate)}
                    disabled={isPending}
                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-neon-blue to-light-blue hover:opacity-95 disabled:opacity-50 text-white font-black text-sm tracking-wide transition-all shadow-lg shadow-neon-blue/20 flex items-center justify-center gap-2 cursor-pointer border-0"
                  >
                    {isPending ? (
                      <Loader2 className="h-4.5 w-4.5 animate-spin" />
                    ) : (
                      <>
                        <ShoppingCart className="h-4 w-4" />
                        {selectedTemplate.price === 0 ? "Hemen Ücretsiz Kullan" : `${selectedTemplate.name} Satın Al`}
                      </>
                    )}
                  </button>
                )}

                {errorMsg && (
                  <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold text-center">
                    {errorMsg}
                  </div>
                )}

                <button
                  onClick={() => handleSelectTemplate(null)}
                  className="w-full py-2.5 rounded-2xl bg-transparent border border-slate-900 hover:bg-slate-900/30 text-slate-400 hover:text-slate-300 text-xs font-bold transition-all cursor-pointer text-center"
                >
                  Geri Dön
                </button>
              </div>
            </div>
            
          </div>
        </div>
      )}
      {/* 💳 Simulated Checkout Modal */}
      {checkoutTemplate && (
        <div className="fixed inset-0 z-55 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm rounded-[2rem] bg-zinc-950 border border-zinc-900 shadow-2xl relative overflow-hidden p-6 space-y-6">
            
            {/* Header close trigger */}
            <button
              onClick={() => setCheckoutTemplate(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-white cursor-pointer transition-colors"
            >
              <X className="h-4 w-4" />
            </button>

            {!paymentSuccess ? (
              <>
                <div className="space-y-1">
                  <span className="text-[10px] text-neon-blue uppercase tracking-wider font-extrabold block">Güvenli Ödeme Geçidi</span>
                  <h3 className="text-lg font-black text-white leading-tight text-left">{checkoutTemplate.name} Şablonu</h3>
                  <div className="flex items-center gap-2 pt-1">
                    <span className="px-2 py-0.5 rounded-full bg-neon-blue/20 text-[9px] font-bold text-neon-blue border border-neon-blue/30">
                      {checkoutTemplate.category}
                    </span>
                    <span className="text-xs font-mono text-zinc-400">Toplam Tutar: <span className="text-emerald-400 font-extrabold">{checkoutTemplate.price} ₺</span></span>
                  </div>
                </div>

                {errorMsg && (
                  <div className="p-3 rounded-lg bg-red-950/20 border border-red-500/20 text-[11px] text-red-400 font-semibold">
                    {errorMsg}
                  </div>
                )}

                <form onSubmit={handleCheckoutSubmit} className="space-y-4 pt-2 text-left">
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold block">Kredi Kartı Numarası</label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="4242 4242 4242 4242"
                        maxLength={19}
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 focus:border-neon-blue/50 outline-none text-white text-xs font-mono"
                        required
                      />
                      <CreditCard className="absolute left-3.5 top-3.5 h-4 w-4 text-zinc-500" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold block">Son Kullanma Tarihi</label>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        maxLength={5}
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 focus:border-neon-blue/50 outline-none text-white text-xs font-mono"
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
                        className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 focus:border-neon-blue/50 outline-none text-white text-xs font-mono"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-[10px] text-zinc-500 border-t border-zinc-900 pt-4">
                    <Lock className="h-3.5 w-3.5 text-emerald-450" />
                    <span>Güvenli simüle edilmiş 3D Secure altyapısı.</span>
                  </div>

                  <button
                    type="submit"
                    disabled={paymentPending}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-neon-blue to-light-blue hover:opacity-95 disabled:from-zinc-900 disabled:to-zinc-950 text-white disabled:text-zinc-500 font-extrabold text-xs transition-all cursor-pointer flex items-center justify-center gap-2 border-0"
                  >
                    {paymentPending ? (
                      <Loader2 className="h-4.5 w-4.5 animate-spin" />
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4" />
                        Ödemeyi Tamamla ({checkoutTemplate.price} ₺)
                      </>
                    )}
                  </button>
                </form>
              </>
            ) : (
              <div className="text-center py-6 space-y-5">
                <div className="w-14 h-14 rounded-full bg-emerald-950/20 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.15)] animate-bounce">
                  <Check className="h-7 w-7" />
                </div>

                <div className="space-y-1">
                  <h3 className="text-lg font-black text-white">Ödeme Başarıyla Alındı!</h3>
                  <p className="text-xs text-zinc-500 leading-relaxed">
                    Simüle edilen transferiniz sisteme işlendi. Satın aldığınız şablon hesabınıza tanımlandı. Panele giderek hemen kullanabilirsiniz!
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
