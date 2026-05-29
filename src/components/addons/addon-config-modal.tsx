"use client";

import React, { useState, useTransition, useEffect } from "react";
import { saveAddonConfig, addAddonProduct, deleteAddonProduct } from "@/app/actions";
import { X, Loader2, Save, Store, Calendar, FileQuestion, Mail, Heart, Clock, Briefcase, HelpCircle, MapPin, MessageCircle, Trash2, Plus, ShoppingBag } from "lucide-react";
import StorefrontPreview from "@/components/storefront-preview";

interface AddonConfigModalProps {
  addon: {
    id: string;
    addonType: string;
    isActive: boolean;
    config: string | null;
  };
  products?: any[];
  onClose: () => void;
  lang: string;
  username: string;
}

export default function AddonConfigModal({ addon, products = [], onClose, lang, username }: AddonConfigModalProps) {
  const [isPending, startTransition] = useTransition();
  const [domain, setDomain] = useState("link-saas.com");
  
  useEffect(() => {
    if (typeof window !== "undefined") {
      setDomain(window.location.host);
    }
  }, []);

  const [configData, setConfigData] = useState<any>(() => {
    try {
      return addon.config ? JSON.parse(addon.config) : {};
    } catch (e) {
      return {};
    }
  });
  const [isActive, setIsActive] = useState<boolean>(addon.isActive);

  const handleFileUpload = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          let { width, height } = img;
          const MAX_SIZE = 800;
          if (width > height && width > MAX_SIZE) {
            height *= MAX_SIZE / width;
            width = MAX_SIZE;
          } else if (height > MAX_SIZE) {
            width *= MAX_SIZE / height;
            height = MAX_SIZE;
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          if (!ctx) return reject("Canvas error");
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL("image/jpeg", 0.7));
        };
        img.onerror = () => reject("Image load error");
      };
      reader.onerror = () => reject("File read error");
    });
  };

  const handleSave = () => {
    startTransition(async () => {
      try {
        await saveAddonConfig(addon.id, JSON.stringify(configData), isActive);
        alert(lang === "tr" ? "Ayarlar başarıyla kaydedildi!" : "Settings saved!");
      } catch (err: any) {
        alert(err.message || "Error");
      }
    });
  };

  const renderInput = (key: string, label: string, placeholder: string, type = "text") => (
    <div className="space-y-1.5 mb-4">
      <label className="text-xs font-bold text-slate-700 block uppercase tracking-wide">{label}</label>
      <input
        type={type}
        value={configData[key] || ""}
        onChange={(e) => setConfigData({ ...configData, [key]: e.target.value })}
        placeholder={placeholder}
        className="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-zinc-50 text-sm text-slate-800 font-medium focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all shadow-sm"
      />
    </div>
  );

  const renderTextarea = (key: string, label: string, placeholder: string) => (
    <div className="space-y-1.5 mb-4">
      <label className="text-xs font-bold text-slate-700 block uppercase tracking-wide">{label}</label>
      <textarea
        value={configData[key] || ""}
        onChange={(e) => setConfigData({ ...configData, [key]: e.target.value })}
        placeholder={placeholder}
        rows={3}
        className="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-zinc-50 text-sm text-slate-800 font-medium focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all shadow-sm resize-none custom-scrollbar"
      />
    </div>
  );

  const renderFaqEditor = () => {
    const pairs = configData.faqPairs || [];
    return (
      <div className="space-y-3">
        {pairs.map((p: any, idx: number) => (
          <div key={idx} className="p-3 rounded-xl border border-zinc-200 bg-zinc-50 relative group">
            <button
              type="button"
              onClick={() => {
                const newPairs = [...pairs];
                newPairs.splice(idx, 1);
                setConfigData({ ...configData, faqPairs: newPairs });
              }}
              className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="h-3 w-3" />
            </button>
            <input
              type="text"
              placeholder="Soru"
              value={p.q}
              onChange={(e) => {
                const newPairs = [...pairs];
                newPairs[idx].q = e.target.value;
                setConfigData({ ...configData, faqPairs: newPairs });
              }}
              className="w-full p-2 text-sm font-bold bg-transparent border-b border-zinc-200 focus:border-indigo-500 outline-none mb-2"
            />
            <textarea
              placeholder="Cevap"
              value={p.a}
              onChange={(e) => {
                const newPairs = [...pairs];
                newPairs[idx].a = e.target.value;
                setConfigData({ ...configData, faqPairs: newPairs });
              }}
              className="w-full p-2 text-xs bg-transparent outline-none resize-none h-16"
            />
          </div>
        ))}
        <button
          type="button"
          onClick={() => {
            const newPairs = [...pairs, { q: "", a: "" }];
            setConfigData({ ...configData, faqPairs: newPairs });
          }}
          className="w-full py-2.5 rounded-xl border-2 border-dashed border-indigo-200 text-indigo-600 font-bold text-xs hover:bg-indigo-50 transition-colors"
        >
          + Soru Ekle
        </button>
      </div>
    );
  };

  const getAddonDetails = () => {
    switch (addon.addonType) {
      case "MINI_STORE": return { icon: <Store className="h-5 w-5" />, title: lang === "tr" ? "Mağaza" : "Store" };
      case "BOOKING": return { icon: <Calendar className="h-5 w-5" />, title: lang === "tr" ? "Randevu" : "Booking" };
      case "QA": return { icon: <FileQuestion className="h-5 w-5" />, title: lang === "tr" ? "Soru Cevap" : "Q&A" };
      case "NEWSLETTER": return { icon: <Mail className="h-5 w-5" />, title: lang === "tr" ? "Haber Bülteni" : "Newsletter" };
      case "DONATION": return { icon: <Heart className="h-5 w-5" />, title: lang === "tr" ? "Bağış" : "Donation" };
      case "COUNTDOWN": return { icon: <Clock className="h-5 w-5" />, title: lang === "tr" ? "Geri Sayım" : "Countdown" };
      case "PORTFOLIO": return { icon: <Briefcase className="h-5 w-5" />, title: lang === "tr" ? "Portfolyo" : "Portfolio" };
      case "FAQ": return { icon: <HelpCircle className="h-5 w-5" />, title: "FAQ" };
      case "MAP": return { icon: <MapPin className="h-5 w-5" />, title: lang === "tr" ? "Harita" : "Map" };
      case "WHATSAPP": return { icon: <MessageCircle className="h-5 w-5" />, title: "WhatsApp" };
      default: return { icon: <Store className="h-5 w-5" />, title: "Add-on" };
    }
  };

  const { icon, title } = getAddonDetails();

  const renderFields = () => {
    switch (addon.addonType) {
      case "MINI_STORE":
        return (
          <>
            <div className="space-y-4 pt-2 border-b border-zinc-200 pb-6 mb-6">
              <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <Store className="h-4 w-4" />
                {lang === "tr" ? "Mağaza Genel Ayarları" : "Store Settings"}
              </h4>
              {renderInput("storeTitle", lang === "tr" ? "Mağaza Başlığı" : "Store Title", lang === "tr" ? "Örn: Premium İçeriklerim" : "Store Name")}
              <div className="space-y-1.5 mb-4">
                <label className="text-xs font-bold text-slate-700 block uppercase tracking-wide">{lang === "tr" ? "Eklenti Linki (Opsiyonel)" : "Addon Link (Optional)"}</label>
                <div className="flex gap-0 items-center">
                  <span className="px-3 py-3 bg-zinc-100 border border-zinc-200 border-r-0 rounded-l-xl text-sm text-zinc-500 font-medium whitespace-nowrap">
                    {domain}/@{username}/
                  </span>
                  <input
                    type="text"
                    value={configData["customSlug"] || ""}
                    onChange={(e) => setConfigData({ ...configData, customSlug: e.target.value })}
                    placeholder={lang === "tr" ? "magazam" : "store"}
                    className="w-full px-4 py-3 border-y border-zinc-200 bg-zinc-50 text-sm text-slate-800 font-medium focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all shadow-sm"
                  />
                  <a
                    href={`http://${domain}/@${username}/${configData.customSlug || ""}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold transition-colors border border-indigo-600 whitespace-nowrap"
                  >
                    {lang === "tr" ? "Git" : "Go"}
                  </a>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(`http://${domain}/@${username}/${configData.customSlug || ""}`);
                      alert(lang === "tr" ? "Link kopyalandı!" : "Link copied!");
                    }}
                    className="px-4 py-3 bg-zinc-200 hover:bg-zinc-300 text-zinc-800 text-sm font-bold rounded-r-xl transition-colors border-y border-r border-zinc-300 whitespace-nowrap"
                  >
                    {lang === "tr" ? "Kopyala" : "Copy"}
                  </button>
                </div>
              </div>
              
              {/* NEW FIELDS */}
              <div className="space-y-1.5 mb-4">
                <label className="text-xs font-bold text-slate-700 block uppercase tracking-wide">{lang === "tr" ? "Profil Fotoğrafı (URL veya Dosya)" : "Profile Image"}</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={configData["storeAvatarUrl"] || ""}
                    onChange={(e) => setConfigData({ ...configData, storeAvatarUrl: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-zinc-50 text-sm text-slate-800 font-medium focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all shadow-sm"
                  />
                  <label className="flex items-center justify-center px-4 py-3 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-sm font-bold rounded-xl cursor-pointer border border-zinc-200 transition-colors whitespace-nowrap">
                    {lang === "tr" ? "Dosya Seç" : "Upload"}
                    <input 
                      type="file" 
                      className="hidden" 
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          try {
                            const url = await handleFileUpload(file);
                            setConfigData({ ...configData, storeAvatarUrl: url });
                          } catch (err: any) { alert(err.message); }
                        }
                      }}
                    />
                  </label>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {renderInput("storeUsername", lang === "tr" ? "Mağaza Kullanıcı Adı" : "Store Username", "@username")}
                {renderInput("buyButtonText", lang === "tr" ? "Satın Al Butonu Metni" : "Buy Button Text", "Satın Al")}
              </div>
              {renderTextarea("storeBio", lang === "tr" ? "Mağaza Açıklaması (Bio)" : "Store Bio", lang === "tr" ? "Yazar & Kariyer Danışmanı" : "Author & Consultant")}

              <div className="grid grid-cols-2 gap-3">
                {renderInput("currency", lang === "tr" ? "Para Birimi" : "Currency", "₺, $, €")}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block uppercase tracking-wide">{lang === "tr" ? "Mağaza Teması" : "Store Theme"}</label>
                  <select
                    value={configData["theme"] || "classic"}
                    onChange={(e) => setConfigData({ ...configData, theme: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-zinc-50 text-sm text-slate-800 font-medium focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all shadow-sm"
                  >
                    <option value="classic">Classic Minimal</option>
                    <option value="vibrant-pop">Vibrant Pop</option>
                    <option value="glassmorphism">Glassmorphism</option>
                    <option value="neo-brutalism">Neo Brutalism</option>
                    <option value="dark-drill">Dark Drill</option>
                    <option value="organic-earth">Organic Earth</option>
                    <option value="retro-arcade">Retro Arcade</option>
                    <option value="dark-academia">Dark Academia</option>
                    <option value="y2k-holographic">Y2K Holographic</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <ShoppingBag className="h-4 w-4" />
                  {lang === "tr" ? "Ürün Yönetimi" : "Product Management"}
                </h4>
              </div>

              {/* Add New Product Form */}
              <div className="p-5 rounded-2xl border-2 border-dashed border-indigo-200 bg-indigo-50/50 space-y-4">
                <h5 className="text-sm font-bold text-indigo-700 flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  {lang === "tr" ? "Yeni Ürün Ekle" : "Add New Product"}
                </h5>
                <div className="space-y-3">
                  <input type="text" id="newProdTitle" placeholder={lang === "tr" ? "Ürün Adı" : "Product Name"} className="w-full p-3 rounded-xl border border-indigo-100 bg-white text-sm font-medium focus:border-indigo-500 outline-none" />
                  <div className="flex gap-2">
                    <input type="number" id="newProdPrice" placeholder={lang === "tr" ? "Fiyat (₺)" : "Price"} className="w-1/3 p-3 rounded-xl border border-indigo-100 bg-white text-sm font-medium focus:border-indigo-500 outline-none" />
                    <select id="newProdType" className="w-2/3 p-3 rounded-xl border border-indigo-100 bg-white text-sm font-medium focus:border-indigo-500 outline-none">
                      <option value="PRESET">Lightroom Preset</option>
                      <option value="EBOOK">E-Book (PDF)</option>
                      <option value="BEAT">Audio Beat</option>
                      <option value="SAMPLE_PACK">Sample Pack</option>
                      <option value="VIDEO_COURSE">Video Course</option>
                      <option value="SOFTWARE">Software/App</option>
                      <option value="OTHER">Diğer</option>
                    </select>
                  </div>
                  <div className="flex gap-2">
                    <div className="w-1/2 flex gap-1 relative">
                      <input type="text" id="newProdImageUrl" placeholder={lang === "tr" ? "Ürün Görseli (URL)" : "Product Image (URL)"} className="w-full p-3 rounded-xl border border-indigo-100 bg-white text-sm font-medium focus:border-indigo-500 outline-none pr-24" />
                      <label className="absolute right-1 top-1 bottom-1 flex items-center justify-center px-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 text-[11px] font-bold rounded-lg cursor-pointer transition-colors">
                        {lang === "tr" ? "Dosya Seç" : "Upload"}
                        <input 
                          type="file" 
                          className="hidden" 
                          accept="image/*"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              try {
                                const url = await handleFileUpload(file);
                                (document.getElementById("newProdImageUrl") as HTMLInputElement).value = url;
                              } catch (err: any) { alert(err.message); }
                            }
                          }}
                        />
                      </label>
                    </div>
                    <div className="w-1/2 flex gap-1 relative">
                      <input type="text" id="newProdFileUrl" placeholder={lang === "tr" ? "İndirme Linki (Dosya)" : "Download Link (File)"} className="w-full p-3 rounded-xl border border-indigo-100 bg-white text-sm font-medium focus:border-indigo-500 outline-none pr-24" />
                      <label className="absolute right-1 top-1 bottom-1 flex items-center justify-center px-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 text-[11px] font-bold rounded-lg cursor-pointer transition-colors">
                        {lang === "tr" ? "Dosya Seç" : "Upload"}
                        <input 
                          type="file" 
                          className="hidden" 
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              try {
                                const url = await handleFileUpload(file);
                                (document.getElementById("newProdFileUrl") as HTMLInputElement).value = url;
                              } catch (err: any) { alert(err.message); }
                            }
                          }}
                        />
                      </label>
                    </div>
                  </div>
                  <textarea id="newProdDesc" placeholder={lang === "tr" ? "Ürün Açıklaması (Opsiyonel)" : "Description (Optional)"} className="w-full p-3 rounded-xl border border-indigo-100 bg-white text-sm font-medium focus:border-indigo-500 outline-none h-20 resize-none" />
                  <button 
                    type="button"
                    onClick={async () => {
                      const title = (document.getElementById("newProdTitle") as HTMLInputElement).value;
                      const price = (document.getElementById("newProdPrice") as HTMLInputElement).value;
                      const type = (document.getElementById("newProdType") as HTMLSelectElement).value;
                      const fileUrl = (document.getElementById("newProdFileUrl") as HTMLInputElement).value;
                      const imageUrl = (document.getElementById("newProdImageUrl") as HTMLInputElement).value;
                      const desc = (document.getElementById("newProdDesc") as HTMLTextAreaElement).value;
                      
                      if(!title || !price || !fileUrl) {
                        alert(lang === "tr" ? "Lütfen gerekli alanları (Ad, Fiyat, Link) doldurun." : "Please fill required fields.");
                        return;
                      }
                      
                      startTransition(async () => {
                        try {
                          await addAddonProduct(title, type, Number(price), desc, fileUrl, imageUrl);
                          (document.getElementById("newProdTitle") as HTMLInputElement).value = "";
                          (document.getElementById("newProdPrice") as HTMLInputElement).value = "";
                          (document.getElementById("newProdFileUrl") as HTMLInputElement).value = "";
                          (document.getElementById("newProdImageUrl") as HTMLInputElement).value = "";
                          (document.getElementById("newProdDesc") as HTMLTextAreaElement).value = "";
                        } catch(e:any) {
                          alert(e.message);
                        }
                      });
                    }}
                    className="w-full py-3 bg-indigo-600 text-white font-bold text-sm rounded-xl hover:bg-indigo-500 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-indigo-200"
                  >
                    {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    {lang === "tr" ? "Ürünü Kaydet" : "Save Product"}
                  </button>
                </div>
              </div>

              {/* Product List */}
              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {products.length === 0 ? (
                  <p className="text-sm text-center text-zinc-500 py-6">{lang === "tr" ? "Henüz eklenmiş ürün yok." : "No products added yet."}</p>
                ) : (
                  products.map(p => (
                    <div key={p.id} className="flex items-center justify-between p-4 rounded-xl border border-zinc-200 bg-white shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-3">
                        {p.imageUrl ? (
                          <img src={p.imageUrl} alt={p.title} className="w-10 h-10 rounded-lg object-cover bg-zinc-100" />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-300">
                            <ShoppingBag className="w-5 h-5" />
                          </div>
                        )}
                        <div className="space-y-1.5">
                          <h6 className="text-sm font-bold text-slate-800 line-clamp-1">{p.title}</h6>
                          <div className="flex items-center gap-2 text-[11px] text-zinc-500 font-medium">
                            <span className="font-mono bg-zinc-100 px-1.5 py-0.5 rounded text-zinc-700">{p.price}₺</span>
                            <span className="bg-indigo-50 text-indigo-600 px-1.5 py-0.5 rounded">{p.type}</span>
                          </div>
                        </div>
                      </div>
                      <button 
                        type="button"
                        onClick={() => {
                          if(confirm(lang === "tr" ? "Ürünü silmek istediğinize emin misiniz?" : "Are you sure?")) {
                            startTransition(async () => {
                              try {
                                await deleteAddonProduct(p.id);
                              } catch(e:any) {
                                alert(e.message);
                              }
                            });
                          }
                        }}
                        className="p-2.5 rounded-xl bg-red-50 text-red-500 hover:bg-red-100 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </>
        );
      case "BOOKING":
        return (
          <>
            {renderInput("calendarLink", lang === "tr" ? "Takvim/Randevu Linki (Calendly vb.)" : "Calendar Link", "https://calendly.com/yourname")}
            {renderInput("title", lang === "tr" ? "Başlık" : "Title", lang === "tr" ? "Birebir Görüşme Ayarla" : "Book a 1:1 call")}
            {renderTextarea("description", lang === "tr" ? "Açıklama" : "Description", lang === "tr" ? "Sizinle tanışmak için sabırsızlanıyorum." : "Looking forward to meeting you.")}
          </>
        );
      case "QA":
        return (
          <>
            {renderInput("boxTitle", lang === "tr" ? "Soru Kutusu Başlığı" : "Box Title", lang === "tr" ? "Bana Soru Sor!" : "Ask me anything!")}
            {renderTextarea("welcomeMessage", lang === "tr" ? "Hoş Geldin Mesajı" : "Welcome Message", lang === "tr" ? "Sorularınızı anonim olarak sorabilirsiniz." : "Ask anonymously.")}
            <div className="flex items-center gap-2 mt-4">
              <input type="checkbox" id="allowAnonymous" className="rounded" checked={configData.allowAnonymous ?? true} onChange={(e) => setConfigData({ ...configData, allowAnonymous: e.target.checked })} />
              <label htmlFor="allowAnonymous" className="text-sm font-medium text-slate-700">
                {lang === "tr" ? "Anonim sorulara izin ver" : "Allow anonymous questions"}
              </label>
            </div>
          </>
        );
      case "NEWSLETTER":
        return (
          <>
            {renderInput("serviceUrl", lang === "tr" ? "Mailchimp/Revue Abonelik Linki" : "Newsletter URL", "https://mailchimp.com/...")}
            {renderInput("buttonText", lang === "tr" ? "Buton Yazısı" : "Subscribe Button Text", lang === "tr" ? "Abone Ol" : "Subscribe")}
            {renderTextarea("incentiveMsg", lang === "tr" ? "Teşvik Mesajı" : "Incentive Message", lang === "tr" ? "Spam yok, sadece kaliteli içerik." : "No spam, just good content.")}
          </>
        );
      case "DONATION":
        return (
          <>
            {renderInput("platformUrl", lang === "tr" ? "Bağış Platformu Linki" : "Donation URL", "https://patreon.com/yourname")}
            {renderInput("title", lang === "tr" ? "Başlık" : "Title", lang === "tr" ? "Bana Kahve Ismarla" : "Buy me a coffee")}
            {renderTextarea("thankYouMsg", lang === "tr" ? "Teşekkür Mesajı" : "Thank You Message", lang === "tr" ? "Desteğiniz için teşekkürler!" : "Thank you for your support!")}
            {renderInput("goalAmount", lang === "tr" ? "Hedef Tutar (İsteğe Bağlı)" : "Goal Amount (Optional)", "1000", "number")}
          </>
        );
      case "COUNTDOWN":
        return (
          <>
            {renderInput("eventName", lang === "tr" ? "Etkinlik Adı" : "Event Name", lang === "tr" ? "Yeni Albüm Çıkışı" : "Album Release")}
            {renderInput("targetDate", lang === "tr" ? "Hedef Tarih ve Saat (YYYY-MM-DD HH:MM)" : "Target Date", "2025-01-01 00:00")}
            {renderTextarea("endMessage", lang === "tr" ? "Bitiş Mesajı" : "End Message", lang === "tr" ? "Etkinlik Başladı!" : "Event Started!")}
          </>
        );
      case "PORTFOLIO":
        return (
          <>
            {renderInput("title", lang === "tr" ? "Portfolyo Başlığı" : "Portfolio Title", lang === "tr" ? "Çalışmalarım" : "My Work")}
            {renderInput("columns", lang === "tr" ? "Sütun Sayısı (1-3)" : "Columns (1-3)", "2", "number")}
            {renderTextarea("itemsJson", lang === "tr" ? "Portfolyo Verisi (JSON)" : "Portfolio Data (JSON)", "[{\"img\":\"url\", \"title\":\"Proje\"}]")}
          </>
        );
      case "FAQ":
        return (
          <>
            {renderInput("title", lang === "tr" ? "SSS Başlığı" : "FAQ Title", lang === "tr" ? "Sıkça Sorulan Sorular" : "Frequently Asked Questions")}
            <div className="pt-2">
              <label className="text-xs font-bold uppercase tracking-wide block text-slate-700 mb-3">
                {lang === "tr" ? "Sorular ve Cevaplar" : "Questions & Answers"}
              </label>
              {renderFaqEditor()}
            </div>
          </>
        );
      case "MAP":
        return (
          <>
            {renderInput("title", lang === "tr" ? "Konum Başlığı" : "Location Title", lang === "tr" ? "Bizi Ziyaret Edin" : "Visit Us")}
            {renderTextarea("mapEmbedUrl", lang === "tr" ? "Google Haritalar Embed Kodu veya Linki" : "Google Maps Embed URL", "<iframe src=\"...\"></iframe>")}
          </>
        );
      case "WHATSAPP":
        return (
          <>
            {renderInput("phoneNumber", lang === "tr" ? "Telefon Numarası (+90...)" : "Phone Number", "+905554443322")}
            {renderInput("buttonText", lang === "tr" ? "Buton Yazısı" : "Button Text", lang === "tr" ? "Bana Mesaj At" : "Message Me")}
            {renderTextarea("prefilledMessage", lang === "tr" ? "Hazır Başlangıç Mesajı" : "Prefilled Message", lang === "tr" ? "Merhaba, bilgi almak istiyorum." : "Hello, I want some information.")}
          </>
        );
      default:
        return (
          <div className="p-6 bg-zinc-50 border border-zinc-200 text-zinc-600 rounded-2xl text-sm text-center">
            {lang === "tr" ? "Bu eklenti için özel ayar bulunmuyor." : "No specific settings for this add-on."}
          </div>
        );
    }
  };

  const renderLivePreview = () => {
    switch (addon.addonType) {
      case "MINI_STORE":
        return (
          <div className="w-full h-full bg-[#f8f9fa] overflow-hidden flex flex-col">
            {/* Mock Header to give it a profile feel */}
            <div className="w-full h-24 bg-gradient-to-b from-black/5 to-transparent flex-shrink-0" />
            <div className="px-4 pb-12 w-full flex-1">
              <div className="w-full bg-white rounded-[2rem] overflow-hidden border border-zinc-200 shadow-xl pb-6">
                <StorefrontPreview 
                  theme={configData.theme || "classic"} 
                  products={products.map(p => ({
                    id: p.id,
                    title: p.title,
                    type: p.type,
                    price: p.price.toString(),
                    imageUrl: p.imageUrl || p.fileUrl,
                    description: p.description || ""
                  }))}
                  storeTitle={configData.storeTitle || (lang === "tr" ? "Mağazam" : "My Store")}
                  username={configData.storeUsername}
                  bio={configData.storeBio}
                  avatarUrl={configData.storeAvatarUrl}
                  buyButtonText={configData.buyButtonText}
                />
              </div>
            </div>
          </div>
        );
      // For other addons, we render a generic card that reacts to configData in real time.
      case "BOOKING":
        return (
          <div className="w-full h-full bg-zinc-50 flex items-center justify-center p-6">
            <div className="w-full p-6 bg-white rounded-3xl border border-zinc-200 shadow-lg flex flex-col items-center text-center space-y-4 transition-all">
              <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center">
                <Calendar className="h-8 w-8" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-slate-800">{configData.title || (lang === "tr" ? "Birebir Görüşme Ayarla" : "Book a 1:1 call")}</h3>
                <p className="text-sm text-slate-500 mt-1">{configData.description || (lang === "tr" ? "Sizinle tanışmak için sabırsızlanıyorum." : "Looking forward to meeting you.")}</p>
              </div>
              <div className="w-full py-3 mt-2 rounded-xl bg-slate-900 text-white font-bold text-sm shadow-md">
                {lang === "tr" ? "Takvimi Görüntüle" : "View Calendar"}
              </div>
            </div>
          </div>
        );
      case "QA":
        return (
          <div className="w-full h-full bg-zinc-50 flex items-center justify-center p-6">
            <div className="w-full p-6 bg-white rounded-3xl border border-zinc-200 shadow-lg flex flex-col space-y-4 transition-all">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center shrink-0">
                  <FileQuestion className="h-6 w-6" />
                </div>
                <h3 className="font-bold text-slate-800">{configData.boxTitle || (lang === "tr" ? "Bana Soru Sor!" : "Ask me anything!")}</h3>
              </div>
              <p className="text-sm text-slate-500 bg-amber-50/50 p-3 rounded-xl border border-amber-100">
                {configData.welcomeMessage || (lang === "tr" ? "Sorularınızı anonim olarak sorabilirsiniz." : "Ask anonymously.")}
              </p>
              <div className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-3 h-24">
                <span className="text-xs text-zinc-400">{lang === "tr" ? "Sorunuzu buraya yazın..." : "Type your question..."}</span>
              </div>
              <div className="w-full py-3 rounded-xl bg-slate-900 text-white text-center font-bold text-sm shadow-md">
                {lang === "tr" ? "Gönder" : "Send"}
              </div>
            </div>
          </div>
        );
      case "FAQ":
        return (
          <div className="w-full h-full bg-zinc-50 flex flex-col pt-16 px-4">
            <h3 className="font-black text-2xl text-slate-800 mb-6 px-2">{configData.title || (lang === "tr" ? "Sıkça Sorulan Sorular" : "FAQ")}</h3>
            <div className="space-y-3 w-full">
              {(configData.faqPairs && configData.faqPairs.length > 0) ? (
                configData.faqPairs.map((p: any, idx: number) => (
                  <div key={idx} className="w-full p-4 bg-white rounded-2xl border border-zinc-200 shadow-sm">
                    <h4 className="font-bold text-sm text-slate-800 mb-1">{p.q || "Soru?"}</h4>
                    <p className="text-xs text-slate-500">{p.a || "Cevap..."}</p>
                  </div>
                ))
              ) : (
                <div className="w-full p-4 bg-white rounded-2xl border border-zinc-200 shadow-sm">
                  <h4 className="font-bold text-sm text-slate-800 mb-1">Soru Örneği?</h4>
                  <p className="text-xs text-slate-500">Cevap Örneği...</p>
                </div>
              )}
            </div>
          </div>
        );
      default:
        return (
          <div className="w-full h-full bg-zinc-50 flex items-center justify-center p-6 text-center">
             <div className="space-y-4">
              <div className="w-20 h-20 mx-auto rounded-3xl bg-indigo-50 text-indigo-500 flex items-center justify-center shadow-inner">
                {icon}
              </div>
              <div>
                <h3 className="font-bold text-xl text-slate-800">{configData.title || configData.storeTitle || addon.addonType}</h3>
                <p className="text-sm text-slate-500 mt-2 max-w-[250px] mx-auto leading-relaxed">
                  {lang === "tr" ? "Bu eklenti için canlı önizleme şu an desteklenmiyor, ancak ayarlarınız kaydedilecektir." : "Live preview not supported yet, but your settings will be saved."}
                </p>
              </div>
             </div>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-slate-900/60 backdrop-blur-md">
      <div className="relative w-full max-w-[1200px] h-[90vh] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200 border border-white/20">
        
        {/* Header (Top Bar) */}
        <div className="px-6 md:px-8 py-5 border-b border-zinc-100 flex flex-col sm:flex-row sm:items-center justify-between bg-white shrink-0 z-20 gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3.5 rounded-2xl bg-indigo-50 text-indigo-600 shadow-inner">
              {icon}
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">
                {title} {lang === "tr" ? "Ayarları" : "Settings"}
              </h2>
              <p className="text-sm text-slate-500 font-medium mt-0.5">
                {lang === "tr" ? "Gerçek zamanlı eklenti düzenleyicisi" : "Real-time addon editor"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 md:gap-5 self-end sm:self-auto">
            {/* Status Toggle */}
            <div className="flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-zinc-50 border border-zinc-200/80 shadow-sm cursor-pointer" onClick={() => setIsActive(!isActive)}>
              <span className={`text-xs uppercase tracking-wider font-bold transition-colors ${isActive ? 'text-emerald-600' : 'text-zinc-400'}`}>
                {isActive ? (lang === "tr" ? "Yayında" : "Published") : (lang === "tr" ? "Taslak" : "Draft")}
              </span>
              <button 
                type="button"
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-300 ${isActive ? 'bg-emerald-500 shadow-md shadow-emerald-500/20' : 'bg-zinc-300'}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-all duration-300 shadow-sm ${isActive ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>

            <button
              onClick={handleSave}
              disabled={isPending}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold text-sm rounded-2xl transition-all flex items-center gap-2 shadow-lg shadow-indigo-600/20 disabled:opacity-50"
            >
              {isPending ? <Loader2 className="h-4.5 w-4.5 animate-spin" /> : <Save className="h-4.5 w-4.5" />}
              {lang === "tr" ? "Kaydet & Kapat" : "Save & Close"}
            </button>
            
            <button
              onClick={onClose}
              className="p-3 rounded-2xl bg-zinc-100 hover:bg-zinc-200 text-zinc-600 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Split Screen Body */}
        <div className="flex flex-col lg:flex-row flex-1 overflow-hidden bg-zinc-50/30">
          
          {/* Left Panel: Editor Form */}
          <div className="w-full lg:w-[45%] h-full overflow-y-auto p-6 md:p-8 bg-white border-r border-zinc-100 custom-scrollbar relative z-10 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
            <div className="max-w-[420px] mx-auto space-y-2">
              {renderFields()}
            </div>
          </div>

          {/* Right Panel: Live Mockup Preview */}
          <div className="hidden lg:flex flex-1 items-center justify-center p-8 relative overflow-hidden bg-zinc-100/50">
            {/* Ambient Background Glow matching the active state */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] blur-[120px] rounded-full transition-colors duration-1000 ${isActive ? 'bg-emerald-500/10' : 'bg-indigo-500/5'}`} />
            </div>
            
            {/* iPhone Mockup Frame */}
            <div className="relative w-[360px] h-[740px] bg-black rounded-[3.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.2)] border-[12px] border-black flex flex-col overflow-hidden z-10 shrink-0 ring-1 ring-white/10">
              {/* Notch */}
              <div className="absolute top-0 inset-x-0 h-7 flex justify-center z-50">
                <div className="w-36 h-7 bg-black rounded-b-3xl relative">
                  <div className="absolute top-2.5 right-6 w-2 h-2 rounded-full bg-blue-900/40 border border-blue-400/20" />
                </div>
              </div>
              
              {/* Status Bar */}
              <div className="h-12 w-full bg-white flex justify-between items-center px-8 pt-3 text-[10px] font-medium z-40 text-black">
                <span>9:41</span>
                <div className="flex items-center gap-1.5">
                  <div className="w-4 h-2.5 bg-black rounded-sm relative">
                    <div className="absolute right-[-2px] top-0.5 bottom-0.5 w-[2px] bg-black rounded-r-sm" />
                  </div>
                </div>
              </div>

              {/* Screen Content */}
              <div className="flex-1 w-full bg-white overflow-y-auto custom-scrollbar relative">
                {renderLivePreview()}
              </div>
              
              {/* Home Indicator */}
              <div className="absolute bottom-2 inset-x-0 h-1.5 flex justify-center z-50">
                <div className="w-32 h-1.5 bg-black/20 rounded-full" />
              </div>
            </div>

            {/* Hint label */}
            <div className="absolute bottom-8 text-xs font-bold uppercase tracking-widest text-zinc-400 bg-white/50 backdrop-blur-md px-4 py-2 rounded-full shadow-sm">
              {lang === "tr" ? "Canlı Önizleme Modu" : "Live Preview Mode"}
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
