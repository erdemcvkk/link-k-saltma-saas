"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Search, Eye, ShoppingCart, X, Check, Laptop, Smartphone, ExternalLink } from "lucide-react";
import GlobalOverlayManager from "@/components/global-overlay-manager";

interface Template {
  id: string;
  name: string;
  price: number;
  category: string;
  coverUrl: string;
  bgColor: string;
  fontStyle: string;
  buttonStyle: string;
  isActive: boolean;
  isCoded: boolean;
  customCss?: string | null;
  configJson?: string | null;
  createdAt: Date;
}

interface SablonlarClientProps {
  initialTemplates: Template[];
}

export default function SablonlarClient({ initialTemplates }: SablonlarClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tümü");
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);

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
    // Simulate checkout redirection or success
    setPurchaseSuccess(true);
    setTimeout(() => {
      setPurchaseSuccess(false);
      setSelectedTemplate(null);
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white font-corporate relative overflow-hidden pb-16">
      <GlobalOverlayManager />
      
      {/* Decorative Glow Elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-neon-blue/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <header className="border-b border-slate-900 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2 text-zinc-400 hover:text-white transition-colors">
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm font-semibold">Ana Sayfaya Dön</span>
          </Link>
          <div className="text-xl font-black bg-clip-text text-transparent bg-gradient-to-r from-neon-blue to-light-blue tracking-tight">
            ŞABLON VİTRİNİ
          </div>
          <Link 
            href="/dashboard" 
            className="px-4 py-2 rounded-full bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs font-bold transition-all"
          >
            Yönetim Paneli
          </Link>
        </div>
      </header>

      {/* Hero Header */}
      <div className="max-w-7xl mx-auto px-6 pt-12 pb-6 text-center">
        <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">
          Bio Link Sayfanızı <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-neon-blue to-light-blue">
            Profesyonel Şablonlarla Süsleyin
          </span>
        </h1>
        <p className="text-slate-400 max-w-xl mx-auto text-sm mt-3 font-medium">
          Kreatörler, müzisyenler ve gamerlar için tasarlanmış şık şablonları inceleyin, canlı önizleyin ve anında profilinizde uygulayın.
        </p>
      </div>

      {/* Search and Filters Section */}
      <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-slate-900/40 p-4 rounded-3xl border border-slate-900 backdrop-blur-sm">
          {/* Categories Tab */}
          <div className="flex flex-wrap gap-2 justify-center md:justify-start w-full md:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-gradient-to-r from-neon-blue to-light-blue text-white shadow-md shadow-neon-blue/20"
                    : "bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search bar */}
          <div className="relative w-full md:w-72">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Search className="h-4 w-4" />
            </span>
            <input
              type="text"
              placeholder="Şablon ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-full bg-slate-950 border border-slate-800 text-sm font-semibold focus:outline-none focus:border-neon-blue text-white placeholder-slate-500 transition-colors"
            />
          </div>
        </div>

        {/* Templates Grid */}
        {filteredTemplates.length === 0 ? (
          <div className="text-center py-20 bg-slate-900/20 border border-dashed border-slate-900 rounded-3xl">
            <p className="text-slate-500 text-sm font-semibold">Aradığınız kriterlere uygun şablon bulunamadı.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredTemplates.map((template) => (
              <div 
                key={template.id} 
                className="group bg-slate-900/30 border border-slate-900 hover:border-slate-800 rounded-3xl p-4 transition-all hover:scale-[1.02] shadow-lg flex flex-col justify-between"
              >
                <div>
                  {/* Template Cover */}
                  <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-slate-950 border border-slate-900">
                    <img 
                      src={template.coverUrl} 
                      alt={template.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                    <div className="absolute top-3 left-3 bg-slate-950/80 border border-slate-800 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider text-neon-blue">
                      {template.category}
                    </div>
                    {template.isCoded && (
                      <div className="absolute top-3 right-3 bg-purple-950/80 border border-purple-800 px-2 py-0.5 rounded-full text-[9px] font-bold text-purple-300">
                        CODED
                      </div>
                    )}
                  </div>

                  {/* Title & Info */}
                  <div className="mt-4">
                    <h3 className="font-extrabold text-base text-white group-hover:text-neon-blue transition-colors">
                      {template.name}
                    </h3>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between gap-2 border-t border-slate-900/60 pt-3">
                  <span className="font-black text-sm text-slate-300">
                    {template.price === 0 ? "Ücretsiz" : `${template.price} ₺`}
                  </span>
                  
                  <button
                    onClick={() => setSelectedTemplate(template)}
                    className="px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 hover:text-neon-blue text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    Önizle
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Live Preview Modal */}
      {selectedTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/85 backdrop-blur-md" onClick={() => setSelectedTemplate(null)} />

          {/* Modal Container */}
          <div className="relative w-full max-w-4xl bg-slate-950 border border-slate-800 rounded-3xl p-6 overflow-hidden flex flex-col md:flex-row gap-8 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            
            {/* Close button */}
            <button 
              onClick={() => setSelectedTemplate(null)} 
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
                ) : (
                  <button
                    onClick={() => handlePurchase(selectedTemplate)}
                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-neon-blue to-light-blue hover:opacity-95 text-white font-black text-sm tracking-wide transition-all shadow-lg shadow-neon-blue/20 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <ShoppingCart className="h-4 w-4" />
                    {selectedTemplate.price === 0 ? "Hemen Ücretsiz Kullan" : `${selectedTemplate.name} Satın Al`}
                  </button>
                )}

                <button
                  onClick={() => setSelectedTemplate(null)}
                  className="w-full py-2.5 rounded-2xl bg-transparent border border-slate-900 hover:bg-slate-900/30 text-slate-400 hover:text-slate-300 text-xs font-bold transition-all cursor-pointer text-center"
                >
                  Geri Dön
                </button>
              </div>
            </div>
            
          </div>
        </div>
      )}
    </div>
  );
}
