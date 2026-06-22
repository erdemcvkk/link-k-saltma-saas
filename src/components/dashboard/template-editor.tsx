"use client";

import React, { useState, useEffect } from 'react';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { createTemplate, updateTemplate } from '@/app/actions';

interface TemplateEditorProps {
  adminUserId?: string;
  initialTemplate?: any;
  onBack?: () => void;
  onSaveSuccess?: (template: any) => void;
}

export default function TemplateEditor({ adminUserId, initialTemplate, onBack, onSaveSuccess }: TemplateEditorProps) {
  // Tabs and Architecture States
  const [activeTab, setActiveTab] = useState('html');
  const [masterHtml, setMasterHtml] = useState(
    initialTemplate?.masterLayoutHtml || 
    '<div class="v11-wrapper">\n  [BACKGROUND_SECTION]\n  <div class="v11-container">\n    [AVATAR_SECTION]\n    [HEADER_SECTION]\n    [SOCIAL_ICONS_SECTION]\n    <div class="v11-links">\n      [LINKS_SECTION]\n    </div>\n  </div>\n</div>'
  );
  
  const [scopedCss, setScopedCss] = useState(
    initialTemplate?.customCss || 
    '.v11-wrapper {\n  position: absolute !important;\n  inset: 0 !important;\n  background: #0f172a !important;\n  display: flex !important;\n  align-items: center !important;\n  justify-content: center !important;\n  overflow-y: auto !important;\n  overflow-x: hidden !important;\n}\n\n.v11-container {\n  display: flex !important;\n  flex-direction: column !important;\n  gap: 20px !important;\n  width: 100% !important;\n  max-width: 400px !important;\n  padding: 40px 20px !important;\n  z-index: 10 !important;\n}\n\n.v11-avatar-wrap {\n  display: flex !important;\n  justify-content: center !important;\n}\n\n.v11-img {\n  width: 96px !important;\n  height: 96px !important;\n  border-radius: 50% !important;\n  object-fit: cover !important;\n}\n\n.v11-name {\n  font-size: 24px !important;\n  font-weight: 700 !important;\n  color: #ffffff !important;\n  text-align: center !important;\n}\n\n.v11-bio {\n  font-size: 14px !important;\n  color: #94a3b8 !important;\n  text-align: center !important;\n  line-height: 1.5 !important;\n}\n\n.v11-socials {\n  display: flex !important;\n  gap: 12px !important;\n  justify-content: center !important;\n  color: #ffffff !important;\n  font-size: 24px !important;\n}\n\n.v11-links {\n  display: flex !important;\n  flex-direction: column !important;\n  gap: 16px !important;\n  width: 100% !important;\n}\n\n.v11-btn {\n  display: flex !important;\n  align-items: center !important;\n  justify-content: center !important;\n  padding: 16px !important;\n  background: rgba(255, 255, 255, 0.1) !important;\n  border-radius: 12px !important;\n  color: #ffffff !important;\n  font-weight: 600 !important;\n  text-decoration: none !important;\n}\n\n.v11-btn-text {\n  white-space: nowrap !important;\n  overflow: hidden !important;\n  text-overflow: ellipsis !important;\n}'
  );

  const [jsonSchema, setJsonSchema] = useState(
    initialTemplate?.customSchema 
      ? JSON.stringify(initialTemplate.customSchema, null, 2) 
      : '[\n  { "name": "accentColor", "type": "color", "label": "Vurgu Rengi" }\n]'
  );
  
  const [iframeContent, setIframeContent] = useState('');

  // Settings Form States
  const [templateName, setTemplateName] = useState(initialTemplate?.name || "");
  const [templatePrice, setTemplatePrice] = useState(initialTemplate?.price?.toString() || "");
  const [isFree, setIsFree] = useState(initialTemplate ? initialTemplate.price === 0 : false);
  const [isComingSoon, setIsComingSoon] = useState(initialTemplate?.isComingSoon || false);
  const [paymentUrl, setPaymentUrl] = useState(initialTemplate?.paymentUrl || "");

  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    const mockData = {
      displayName: "Jane Doe",
      bio: "Modern template preview. Showcasing isolated CSS design patterns.",
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200"
    };

    const mockLinks = [
      { title: "Kişisel Portfolyom", url: "#" },
      { title: "Yeni Koleksiyon", url: "#" },
      { title: "Bana Ulaşın", url: "#" }
    ];

    const mockSocials = [
      { socialPlatform: "instagram", socialUrl: "#" },
      { socialPlatform: "twitter", socialUrl: "#" },
      { socialPlatform: "youtube", socialUrl: "#" }
    ];

    let previewHtml = masterHtml;

    // 1. LINK LOOP PARSER
    const linkRegex = /\[LINK_LOOP\]([\s\S]*?)\[\/LINK_LOOP\]/g;
    previewHtml = previewHtml.replace(linkRegex, (match: string, innerHtml: string) => {
      return mockLinks.map(link => 
        innerHtml
          .replace(/\{\{linkTitle\}\}/g, link.title)
          .replace(/\{\{linkUrl\}\}/g, link.url)
      ).join('');
    });

    // 2. SOCIAL LOOP PARSER
    const socialRegex = /\[SOCIAL_LOOP\]([\s\S]*?)\[\/SOCIAL_LOOP\]/g;
    previewHtml = previewHtml.replace(socialRegex, (match: string, innerHtml: string) => {
      return mockSocials.map(social => 
        innerHtml
          .replace(/\{\{socialPlatform\}\}/g, social.socialPlatform)
          .replace(/\{\{socialUrl\}\}/g, social.socialUrl)
      ).join('');
    });

    // 3. STANDART DEĞİŞKENLER (Variables)
    previewHtml = previewHtml
      .replace(/\{\{displayName\}\}/g, mockData.displayName)
      .replace(/\{\{bio\}\}/g, mockData.bio)
      .replace(/\{\{avatarUrl\}\}/g, mockData.avatarUrl);

    // (Opsiyonel) Eski slot sistemi kalıntılarını temizlemek / fallback sağlamak
    previewHtml = previewHtml
      .replace(/\[BACKGROUND_SECTION\]/g, '<div class="v11-bg"></div>')
      .replace(/\[AVATAR_SECTION\]/g, `<div class="v11-avatar-wrap"><img src="${mockData.avatarUrl}" class="v11-img" /></div>`)
      .replace(/\[HEADER_SECTION\]/g, `<div class="v11-name">${mockData.displayName}</div><div class="v11-bio">${mockData.bio}</div>`)
      .replace(/\[SOCIAL_ICONS_SECTION\]/g, '<div class="v11-socials"><i class="fab fa-instagram"></i><i class="fab fa-twitter"></i></div>')
      .replace(/\[LINKS_SECTION\]/g, '<a class="v11-btn"><span class="v11-btn-text">Örnek Link</span></a>');

    const srcDoc = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" crossorigin="anonymous" referrerpolicy="no-referrer" />
        <style>
          body, html { margin: 0; padding: 0; width: 100%; height: 100%; overflow: hidden; font-family: 'Inter', sans-serif; background: #000; }
          * { box-sizing: border-box; }
          ${scopedCss}
        </style>
      </head>
      <body>
        ${previewHtml}
      </body>
      </html>
    `;
    setIframeContent(srcDoc);
  }, [masterHtml, scopedCss]);

  const handleSave = async () => {
    if (!adminUserId) {
      alert("Admin yetkisi bulunamadı!");
      return;
    }
    if (!templateName.trim()) {
      alert("Şablon adı zorunludur!");
      setActiveTab('settings');
      return;
    }

    setIsPending(true);
    
    try {
      let parsedSchema: any = [];
      const trimmedSchema = jsonSchema.trim();

      if (trimmedSchema) {
        try {
          parsedSchema = JSON.parse(trimmedSchema);
        } catch (err) {
          alert("SCHEMA CONFIG sekmesindeki JSON formatı hatalı. Lütfen virgülleri ve çift tırnakları kontrol edin.");
          setIsPending(false);
          return;
        }
      }

      const payload = {
        name: templateName,
        price: isFree ? 0 : Number(templatePrice) || 0,
        category: initialTemplate?.category || "Genel",
        coverUrl: initialTemplate?.coverUrl || "",
        bgColor: initialTemplate?.bgColor || "#000000",
        fontStyle: initialTemplate?.fontStyle || "Inter",
        buttonStyle: initialTemplate?.buttonStyle || "",
        paymentUrl: paymentUrl || null,
        isActive: true,
        isCoded: true,
        customCss: scopedCss,
        masterLayoutHtml: masterHtml,
        isComingSoon: isComingSoon,
        customSchema: parsedSchema,
        jsonConfig: jsonSchema,
      };

      let result;
      if (initialTemplate?.id) {
        result = await updateTemplate(adminUserId, initialTemplate.id, payload);
      } else {
        result = await createTemplate(adminUserId, payload);
      }
      
      alert("Şablon başarıyla kaydedildi!");
      if (onSaveSuccess) onSaveSuccess(result);
      
    } catch (error: any) {
      alert("Hata oluştu: " + (error.message || "Bilinmeyen bir hata"));
    } finally {
      setIsPending(false);
    }
  };

  const handleGoBack = () => {
    if (onBack) {
      onBack();
    } else {
      window.history.back();
    }
  };

  return (
    <div className="flex h-screen bg-zinc-950 text-zinc-100 antialiased selection:bg-indigo-500/30">
      {/* SOL TARAF: ZEN EDITÖR PANELİ */}
      <div className="w-2/3 flex flex-col border-r border-zinc-800/80 bg-zinc-900/40">
        <div className="h-16 px-8 border-b border-zinc-800/80 flex justify-between items-center backdrop-blur-md">
          <div className="flex items-center gap-6">
            <button 
              onClick={handleGoBack} 
              className="flex items-center justify-center p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800/50 transition-all cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <span className="text-sm font-semibold tracking-wider text-zinc-400 uppercase">Clinkor Studio V2</span>
            <div className="h-4 w-px bg-zinc-800" />
            <div className="flex gap-2 p-1 bg-zinc-950 rounded-xl border border-zinc-800/50">
              <button 
                onClick={() => setActiveTab('html')}
                className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 cursor-pointer ${activeTab === 'html' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-400 hover:text-zinc-200'}`}
              >
                MASTER HTML
              </button>
              <button 
                onClick={() => setActiveTab('css')}
                className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 cursor-pointer ${activeTab === 'css' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-400 hover:text-zinc-200'}`}
              >
                SCOPED CSS
              </button>
              <button 
                onClick={() => setActiveTab('json')}
                className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 cursor-pointer ${activeTab === 'json' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-400 hover:text-zinc-200'}`}
              >
                SCHEMA CONFIG
              </button>
              <button 
                onClick={() => setActiveTab('settings')}
                className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 cursor-pointer ${activeTab === 'settings' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-400 hover:text-zinc-200'}`}
              >
                AYARLAR
              </button>
            </div>
          </div>
          <button 
            onClick={handleSave}
            disabled={isPending}
            className="flex items-center justify-center min-w-[150px] px-5 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl text-xs font-semibold tracking-wide transition-all duration-200 shadow-lg shadow-indigo-600/10 active:scale-98 cursor-pointer"
          >
            {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Değişiklikleri Yayınla'}
          </button>
        </div>

        <div className="flex-1 p-8 overflow-hidden bg-zinc-950/20">
          <div className="h-full rounded-2xl border border-zinc-800/60 bg-zinc-950/40 overflow-hidden backdrop-blur-sm relative shadow-2xl">
            {activeTab === 'html' && (
              <textarea
                value={masterHtml}
                onChange={(e) => setMasterHtml(e.target.value)}
                className="w-full h-full bg-transparent p-8 font-mono text-[13px] text-emerald-400/90 leading-relaxed resize-none focus:outline-none focus:ring-0 selection:bg-emerald-500/20"
                spellCheck={false}
              />
            )}
            {activeTab === 'css' && (
              <textarea
                value={scopedCss}
                onChange={(e) => setScopedCss(e.target.value)}
                className="w-full h-full bg-transparent p-8 font-mono text-[13px] text-sky-400/90 leading-relaxed resize-none focus:outline-none focus:ring-0 selection:bg-sky-500/20"
                spellCheck={false}
              />
            )}
            {activeTab === 'json' && (
              <textarea
                value={jsonSchema}
                onChange={(e) => setJsonSchema(e.target.value)}
                className="w-full h-full bg-transparent p-8 font-mono text-[13px] text-amber-400/90 leading-relaxed resize-none focus:outline-none focus:ring-0 selection:bg-amber-500/20"
                spellCheck={false}
              />
            )}
            {activeTab === 'settings' && (
              <div className="w-full h-full p-8 overflow-y-auto no-scrollbar flex flex-col gap-8 animate-in fade-in duration-300">
                <div>
                  <h2 className="text-xl font-bold text-white mb-2">Şablon Metadata Ayarları</h2>
                  <p className="text-sm text-zinc-500">Mağaza vitrini detaylarını, fiyatlandırmayı ve sistem durumunu yönetin.</p>
                </div>

                <div className="grid grid-cols-1 gap-6 max-w-xl">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Şablon Adı</label>
                    <input 
                      type="text"
                      value={templateName}
                      onChange={(e) => setTemplateName(e.target.value)}
                      placeholder="Örn: Karanlık Neo-Glassmorphism"
                      className="w-full bg-zinc-950/50 border border-zinc-800/80 rounded-xl px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-zinc-950/50 border border-zinc-800/80 rounded-xl">
                    <div className="flex flex-col">
                      <label className="text-sm font-bold text-zinc-300">Ücretsiz Şablon</label>
                      <span className="text-xs text-zinc-500 mt-0.5">Bu şablon sistemde herkese ücretsiz olarak sunulsun.</span>
                    </div>
                    <button 
                      type="button"
                      onClick={() => setIsFree(!isFree)}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${isFree ? 'bg-indigo-600' : 'bg-zinc-800'}`}
                    >
                      <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${isFree ? 'translate-x-5' : 'translate-x-0'}`} />
                    </button>
                  </div>

                  {!isFree && (
                    <div className="flex flex-col gap-2 animate-in fade-in duration-300">
                      <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Fiyat (₺)</label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 font-medium">₺</span>
                        <input 
                          type="number"
                          value={templatePrice}
                          onChange={(e) => setTemplatePrice(e.target.value)}
                          placeholder="149"
                          className="w-full bg-zinc-950/50 border border-zinc-800/80 rounded-xl pl-8 pr-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                        />
                      </div>
                    </div>
                  )}

                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Ödeme Linki (İsteğe Bağlı)</label>
                    <input 
                      type="url"
                      value={paymentUrl}
                      onChange={(e) => setPaymentUrl(e.target.value)}
                      placeholder="https://buy.stripe.com/..."
                      className="w-full bg-zinc-950/50 border border-zinc-800/80 rounded-xl px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-zinc-950/50 border border-zinc-800/80 rounded-xl">
                    <div className="flex flex-col">
                      <label className="text-sm font-bold text-zinc-300">Çok Yakında Modu</label>
                      <span className="text-xs text-zinc-500 mt-0.5">Şablon kilitli kalır, satın alınamaz ancak vitrinde lansman olarak görünür.</span>
                    </div>
                    <button 
                      type="button"
                      onClick={() => setIsComingSoon(!isComingSoon)}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${isComingSoon ? 'bg-amber-600' : 'bg-zinc-800'}`}
                    >
                      <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${isComingSoon ? 'translate-x-5' : 'translate-x-0'}`} />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* SAĞ TARAF: SIZDIRMAZ TELEFON SİMÜLATÖRÜ */}
      <div className="w-1/3 flex flex-col items-center justify-center bg-zinc-950 relative p-8">
        <div className="w-[340px] h-[680px] bg-zinc-900 rounded-[50px] p-3 shadow-2xl border border-zinc-800/80 flex justify-center items-center relative">
          <div className="absolute top-6 left-1/2 -translate-x-1/2 w-32 h-4 bg-zinc-900 rounded-full z-30" />
          <div className="w-full h-full bg-zinc-950 rounded-[38px] overflow-hidden relative border border-zinc-800/40">
            <iframe
              srcDoc={iframeContent}
              title="live-preview"
              className="w-full h-full border-none bg-zinc-950"
              sandbox="allow-scripts allow-same-origin"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
