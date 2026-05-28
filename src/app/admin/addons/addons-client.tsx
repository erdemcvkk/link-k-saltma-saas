"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import { 
  ArrowLeft, Plus, Trash2, Edit2, Settings, LayoutGrid, CheckCircle, 
  X, Info, Store, SlidersHorizontal, PackageOpen
} from "lucide-react";
import { saveAddonSetting, createAddonDummyProduct, updateAddonDummyProduct, deleteAddonDummyProduct } from "../../actions";
import EklentilerClient, { ADDON_TYPES } from "../../eklentiler/eklentiler-client";

interface AddonsClientProps {
  adminUserId: string;
  initialSettings: Record<string, string>;
  initialProducts: any[];
}

export default function AddonsClient({ adminUserId, initialSettings, initialProducts }: AddonsClientProps) {
  const [settings, setSettings] = useState(initialSettings);
  const [products, setProducts] = useState(initialProducts);
  const [isPending, startTransition] = useTransition();
  const [msg, setMsg] = useState({ text: "", type: "" });
  const [activeTab, setActiveTab] = useState("themes"); 

  // Form State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: "", price: "", imageUrl: "", buttonText: "", order: 0, isActive: true
  });

  const showMsg = (text: string, type: "success" | "error") => {
    setMsg({ text, type });
    setTimeout(() => setMsg({ text: "", type: "" }), 4000);
  };

  const handleSettingChange = (key: string, value: string) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    startTransition(async () => {
      try {
        await saveAddonSetting(adminUserId, key, value);
        showMsg("Ayar başarıyla kaydedildi.", "success");
      } catch (err: any) {
        showMsg("Ayar kaydedilemedi.", "error");
      }
    });
  };

  const openNewForm = () => {
    setEditingId(null);
    setForm({ title: "", price: "", imageUrl: "", buttonText: "Satın Al", order: products.length + 1, isActive: true });
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingId(null);
  };

  const handleEdit = (prod: any) => {
    setEditingId(prod.id);
    setForm({
      title: prod.title,
      price: prod.price.toString(),
      imageUrl: prod.imageUrl || "",
      buttonText: prod.buttonText || "",
      order: prod.order,
      isActive: prod.isActive
    });
    setIsFormOpen(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      try {
        const payload = {
          ...form,
          price: parseFloat(form.price) || 0
        };

        if (editingId) {
          const updated = await updateAddonDummyProduct(adminUserId, editingId, payload);
          setProducts(products.map(p => p.id === editingId ? updated : p));
          showMsg("Ürün başarıyla güncellendi.", "success");
        } else {
          const created = await createAddonDummyProduct(adminUserId, payload);
          setProducts([...products, created]);
          showMsg("Yeni dummy ürün eklendi.", "success");
        }
        closeForm();
      } catch (err: any) {
        showMsg("Ürün kaydedilirken bir hata oluştu.", "error");
      }
    });
  };

  const handleDeleteProduct = (id: string) => {
    if (!confirm("Bu ürünü silmek istediğinize emin misiniz?")) return;
    startTransition(async () => {
      try {
        await deleteAddonDummyProduct(adminUserId, id);
        setProducts(products.filter(p => p.id !== id));
        showMsg("Ürün silindi.", "success");
      } catch (err: any) {
        showMsg("Ürün silinirken bir hata oluştu.", "error");
      }
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 md:p-8 bg-black text-white font-sans overflow-hidden">
      
      {/* Messages */}
      {msg.text && (
        <div className={`fixed top-8 left-1/2 -translate-x-1/2 px-6 py-3 rounded-full text-sm font-bold flex items-center gap-3 z-50 shadow-2xl animate-in slide-in-from-top-4 ${
          msg.type === "success" ? "bg-emerald-500 text-white" : "bg-red-500 text-white"
        }`}>
          <CheckCircle className="h-5 w-5" /> {msg.text}
        </div>
      )}

      <div className="w-full max-w-[1500px] h-[90vh] min-h-[800px] rounded-[32px] border border-white/10 bg-zinc-950 flex overflow-hidden shadow-2xl">
        
        {/* Left Control Panel */}
        <div className="w-[500px] flex flex-col border-r border-white/5 bg-zinc-950 shrink-0 relative">
          
          <div className="p-8 border-b border-white/5 flex items-start justify-between">
            <div>
              <Link href="/admin" className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors mb-4 text-sm font-medium">
                <ArrowLeft className="h-4 w-4" /> Admin Paneli
              </Link>
              <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
                <Store className="h-7 w-7 text-rose-500" /> Eklenti Vitrini
              </h1>
              <p className="text-sm text-zinc-400 font-medium mt-2">Vitrin simülatörünü ve dummy verileri yönetin.</p>
            </div>
          </div>

          <div className="flex border-b border-white/5 bg-zinc-900/20">
            <button
              onClick={() => setActiveTab("themes")}
              className={`flex-1 py-4 text-xs font-bold tracking-wide flex items-center justify-center gap-2 transition-colors ${
                activeTab === "themes" ? "text-rose-500 border-b-2 border-rose-500 bg-rose-500/5" : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              <Store className="h-4 w-4" /> Temalar (Satılan)
            </button>
            <button
              onClick={() => setActiveTab("products")}
              className={`flex-1 py-4 text-xs font-bold tracking-wide flex items-center justify-center gap-2 transition-colors ${
                activeTab === "products" ? "text-rose-500 border-b-2 border-rose-500 bg-rose-500/5" : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              <PackageOpen className="h-4 w-4" /> Dummy Ürünler
            </button>
            <button
              onClick={() => setActiveTab("config")}
              className={`flex-1 py-4 text-xs font-bold tracking-wide flex items-center justify-center gap-2 transition-colors ${
                activeTab === "config" ? "text-rose-500 border-b-2 border-rose-500 bg-rose-500/5" : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              <SlidersHorizontal className="h-4 w-4" /> Ayarlar
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-8 relative no-scrollbar">
            {activeTab === "themes" ? (
              <div className="space-y-6 animate-fadeIn">
                <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-start gap-3">
                  <Info className="h-5 w-5 text-rose-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-rose-200 leading-relaxed font-medium">
                    Sistemdeki gerçek <strong>10 Premium Tema / Eklenti</strong> ürününüz bunlardır. Satış fiyatlarını buradan güncelleyebilirsiniz. Değişiklikler anında yansır.
                  </p>
                </div>

                <div className="space-y-3">
                  {ADDON_TYPES.map(addon => {
                    const priceKey = `theme_PRICE_${addon.id}`;
                    const currentPrice = settings[priceKey] || addon.price;
                    return (
                      <div key={addon.id} className="group p-4 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-all">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <div className="text-sm font-bold text-white flex items-center gap-2">
                              <div className={`w-3 h-3 rounded-full ${addon.color}`} />
                              {addon.name}
                            </div>
                            <div className="text-xs text-zinc-500 font-medium mt-1">{addon.desc}</div>
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <input 
                            type="number" 
                            defaultValue={currentPrice}
                            onBlur={(e) => {
                              if (e.target.value !== currentPrice) {
                                handleSettingChange(priceKey, e.target.value);
                              }
                            }}
                            className="w-1/3 px-3 py-2 rounded-xl bg-black border border-zinc-800 text-sm focus:border-rose-500 outline-none transition-all text-emerald-400 font-bold"
                            placeholder="Fiyat (₺)"
                          />
                          <div className="text-[10px] text-zinc-500 flex items-center flex-1">
                            Fiyatı değiştirip boşluğa tıklayınca otomatik kaydedilir.
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : activeTab === "products" ? (
              <div className="space-y-6 animate-fadeIn">
                
                <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-start gap-3">
                  <Info className="h-5 w-5 text-indigo-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-indigo-200 leading-relaxed font-medium">
                    Buraya eklediğiniz ürünler, yandaki simülatörde <strong>"Dijital Mağaza Modülü"</strong> temasında gösterilir. Vitrin görselleştirmesini zenginleştirmek için kullanılır.
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <LayoutGrid className="h-5 w-5 text-zinc-500" /> Ürün Listesi ({products.length})
                  </h3>
                  <button 
                    onClick={openNewForm}
                    className="p-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl transition-colors shadow-lg shadow-rose-500/20"
                  >
                    <Plus className="h-5 w-5" />
                  </button>
                </div>

                <div className="space-y-3">
                  {products.length === 0 ? (
                    <div className="text-center py-10 text-zinc-500 text-sm font-medium border border-dashed border-white/10 rounded-2xl">
                      Henüz hiç dummy ürün eklenmemiş.
                    </div>
                  ) : (
                    products.sort((a,b) => a.order - b.order).map(prod => (
                      <div key={prod.id} className="group p-3 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-between hover:border-zinc-700 transition-all hover:shadow-lg">
                        <div className="flex items-center gap-4">
                          {prod.imageUrl ? (
                            <img src={prod.imageUrl} alt={prod.title} className="w-14 h-14 rounded-xl object-cover bg-zinc-800 shadow-sm" />
                          ) : (
                            <div className="w-14 h-14 rounded-xl bg-zinc-800 flex items-center justify-center text-zinc-600 font-bold text-xs">Foto</div>
                          )}
                          <div>
                            <div className="text-sm font-bold text-white group-hover:text-rose-400 transition-colors">{prod.title}</div>
                            <div className="text-xs text-zinc-400 font-medium mt-1 flex items-center gap-2">
                              <span className="text-emerald-400 font-bold">{prod.price} ₺</span>
                              <span className="text-zinc-600">•</span>
                              <span>Sıra: {prod.order}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity pr-2">
                          <button type="button" onClick={() => handleEdit(prod)} className="p-2.5 rounded-xl bg-zinc-800 hover:bg-white text-zinc-400 hover:text-black transition-colors" title="Düzenle">
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button type="button" onClick={() => handleDeleteProduct(prod.id)} className="p-2.5 rounded-xl bg-zinc-800 hover:bg-red-500 text-zinc-400 hover:text-white transition-colors" title="Sil">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-8 animate-fadeIn">
                <div className="space-y-6">
                  {/* Scroll Speed */}
                  <div className="space-y-3">
                    <label className="text-sm font-bold text-zinc-300 flex items-center gap-2">
                      <Settings className="h-4 w-4 text-rose-500" /> Otomatik Kaydırma Hızı
                    </label>
                    <select 
                      value={settings["storefront_scroll_speed"] || "normal"}
                      onChange={e => handleSettingChange("storefront_scroll_speed", e.target.value)}
                      className="w-full px-4 py-3.5 rounded-xl bg-zinc-900 border border-zinc-800 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 outline-none text-sm text-white font-medium"
                    >
                      <option value="slow">Yavaş (Rahat Okunur)</option>
                      <option value="normal">Normal (Standart)</option>
                      <option value="fast">Hızlı (Dinamik)</option>
                    </select>
                    <p className="text-xs text-zinc-500">Kullanıcılar vitrin sayfasına geldiğinde ürünlerin otomatik kayma hızı.</p>
                  </div>

                  <hr className="border-white/5" />

                  {/* Fade-in Style */}
                  <div className="space-y-3">
                    <label className="text-sm font-bold text-zinc-300 flex items-center gap-2">
                      <Settings className="h-4 w-4 text-rose-500" /> Ürün Giriş Animasyonu
                    </label>
                    <select 
                      value={settings["storefront_fade_in_style"] || "fade-in-up"}
                      onChange={e => handleSettingChange("storefront_fade_in_style", e.target.value)}
                      className="w-full px-4 py-3.5 rounded-xl bg-zinc-900 border border-zinc-800 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 outline-none text-sm text-white font-medium"
                    >
                      <option value="fade-in-up">Aşağıdan Yukarı Süzülme (Fade Up)</option>
                      <option value="zoom-in">İçeri Büyüyerek (Zoom In)</option>
                    </select>
                  </div>

                  <hr className="border-white/5" />

                  {/* Theme Inheritance Toggle */}
                  <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-between cursor-pointer hover:border-zinc-700 transition-colors" onClick={() => handleSettingChange("storefront_theme_inheritance", settings["storefront_theme_inheritance"] === "true" ? "false" : "true")}>
                    <div className="pr-4">
                      <h4 className="text-sm font-bold text-white">Tema Mirası (Theme Inheritance)</h4>
                      <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed">Mağaza modülü, profilin ana renklerini ve buton tasarımlarını otomatik olarak miras alsın mı?</p>
                    </div>
                    <button
                      type="button"
                      className={`w-14 h-7 rounded-full transition-colors relative flex items-center px-1 shrink-0 ${
                        settings["storefront_theme_inheritance"] === "true" ? "bg-rose-500" : "bg-zinc-700"
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-300 ${
                        settings["storefront_theme_inheritance"] === "true" ? "translate-x-7" : "translate-x-0"
                      }`} />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Slide-up Form Overlay for Products */}
          {isFormOpen && (
            <div className="absolute inset-0 z-20 bg-zinc-950 flex flex-col animate-in slide-in-from-bottom-8 duration-300">
              <div className="p-6 border-b border-white/5 flex items-center justify-between bg-zinc-900">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  {editingId ? <Edit2 className="h-5 w-5 text-rose-500" /> : <Plus className="h-5 w-5 text-rose-500" />}
                  {editingId ? "Ürünü Düzenle" : "Yeni Dummy Ürün"}
                </h2>
                <button type="button" onClick={closeForm} className="p-2 bg-zinc-800 hover:bg-zinc-700 rounded-full text-zinc-400 hover:text-white transition-colors">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-6">
                <form onSubmit={handleSaveProduct} className="space-y-5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Ürün Başlığı</label>
                    <input type="text" placeholder="Örn: Lightroom Preset Paketi" value={form.title} onChange={e => setForm({...form, title: e.target.value})} required className="w-full px-4 py-3 rounded-xl bg-black border border-zinc-800 text-sm focus:border-rose-500 focus:ring-1 focus:ring-rose-500 outline-none transition-all" />
                  </div>
                  
                  <div className="flex gap-4">
                    <div className="space-y-1.5 flex-1">
                      <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Fiyat (₺)</label>
                      <input type="number" placeholder="0" value={form.price} onChange={e => setForm({...form, price: e.target.value})} required className="w-full px-4 py-3 rounded-xl bg-black border border-zinc-800 text-sm focus:border-rose-500 focus:ring-1 focus:ring-rose-500 outline-none transition-all" />
                    </div>
                    <div className="space-y-1.5 flex-1">
                      <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Sıralama</label>
                      <input type="number" placeholder="1" value={form.order} onChange={e => setForm({...form, order: parseInt(e.target.value)||0})} className="w-full px-4 py-3 rounded-xl bg-black border border-zinc-800 text-sm focus:border-rose-500 focus:ring-1 focus:ring-rose-500 outline-none transition-all" />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Görsel URL (İsteğe Bağlı)</label>
                    <input type="text" placeholder="https://..." value={form.imageUrl} onChange={e => setForm({...form, imageUrl: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-black border border-zinc-800 text-sm focus:border-rose-500 focus:ring-1 focus:ring-rose-500 outline-none transition-all" />
                    {form.imageUrl && (
                      <div className="mt-3 w-full h-32 rounded-xl overflow-hidden border border-zinc-800 bg-zinc-900 relative">
                        <img src={form.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Buton Metni</label>
                    <input type="text" placeholder="Örn: Satın Al" value={form.buttonText} onChange={e => setForm({...form, buttonText: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-black border border-zinc-800 text-sm focus:border-rose-500 focus:ring-1 focus:ring-rose-500 outline-none transition-all" />
                  </div>

                  <div className="pt-6 border-t border-white/5 flex gap-3">
                    <button type="submit" disabled={isPending} className="flex-1 py-3.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-sm font-bold transition-colors shadow-lg shadow-rose-500/20 disabled:opacity-50">
                      {isPending ? "Kaydediliyor..." : (editingId ? "Değişiklikleri Kaydet" : "Ürünü Ekle")}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

        </div>

        {/* Right Live Simulator */}
        <div className="flex-1 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-black flex flex-col relative">
          <div className="absolute inset-0 bg-gradient-to-tr from-rose-500/5 via-transparent to-indigo-500/5" />
          
          <div className="absolute top-6 left-6 flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-zinc-900/90 backdrop-blur border border-white/10 z-10 shadow-2xl">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
            <span className="text-xs font-black uppercase tracking-widest text-zinc-300">Live Simulator</span>
          </div>

          <div className="flex-1 overflow-y-auto no-scrollbar relative flex items-center justify-center p-8 z-0">
            {/* A subtle glow behind the simulator */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-rose-500/10 blur-[120px] rounded-full pointer-events-none" />
            
            <div className="w-[1600px] transform scale-[0.6] lg:scale-[0.8] 2xl:scale-[0.9] origin-center transition-transform duration-500">
              <EklentilerClient products={products.filter(p => p.isActive)} settings={settings} />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
