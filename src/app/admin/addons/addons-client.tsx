"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import { ArrowLeft, Save, Plus, Trash2, Edit2, Play, Settings, Smartphone, LayoutGrid, CheckCircle } from "lucide-react";
import { saveAddonSetting, createAddonDummyProduct, updateAddonDummyProduct, deleteAddonDummyProduct } from "../../actions";
import EklentilerClient from "../../eklentiler/eklentiler-client";

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
  const [activeTab, setActiveTab] = useState("products"); // "products" or "config"

  // Form State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: "", price: "", imageUrl: "", buttonText: "", order: 0, isActive: true
  });

  const showMsg = (text: string, type: "success" | "error") => {
    setMsg({ text, type });
    setTimeout(() => setMsg({ text: "", type: "" }), 3000);
  };

  const handleSettingChange = (key: string, value: string) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    startTransition(async () => {
      try {
        await saveAddonSetting(adminUserId, key, value);
        showMsg("Ayar kaydedildi.", "success");
      } catch (err: any) {
        showMsg("Kaydedilemedi.", "error");
      }
    });
  };

  const resetForm = () => {
    setEditingId(null);
    setForm({ title: "", price: "", imageUrl: "", buttonText: "", order: 0, isActive: true });
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
          showMsg("Ürün güncellendi.", "success");
        } else {
          const created = await createAddonDummyProduct(adminUserId, payload);
          setProducts([...products, created]);
          showMsg("Ürün eklendi.", "success");
        }
        resetForm();
      } catch (err: any) {
        showMsg("İşlem başarısız.", "error");
      }
    });
  };

  const handleDeleteProduct = (id: string) => {
    if (!confirm("Emin misiniz?")) return;
    startTransition(async () => {
      try {
        await deleteAddonDummyProduct(adminUserId, id);
        setProducts(products.filter(p => p.id !== id));
        showMsg("Silindi.", "success");
      } catch (err: any) {
        showMsg("Hata oluştu.", "error");
      }
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-zinc-950 text-white font-sans overflow-hidden">
      <div className="w-full max-w-[1400px] h-[850px] rounded-[32px] border border-zinc-800 bg-zinc-900/50 flex overflow-hidden shadow-2xl backdrop-blur-xl">
        
        {/* Left Control Panel */}
        <div className="w-[500px] flex flex-col border-r border-zinc-800 bg-zinc-950/80 shrink-0">
          <div className="p-6 border-b border-zinc-800 flex items-center justify-between">
            <div>
              <h1 className="text-xl font-black text-white">Eklenti & Vitrin</h1>
              <p className="text-xs text-zinc-400 font-medium">Mockup ve animasyon yönetimi</p>
            </div>
            <Link href="/admin" className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 transition-colors">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </div>

          <div className="flex border-b border-zinc-800">
            <button
              onClick={() => setActiveTab("products")}
              className={`flex-1 py-4 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 ${
                activeTab === "products" ? "text-rose-500 border-b-2 border-rose-500" : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              <LayoutGrid className="h-4 w-4" /> Dummy Ürünler
            </button>
            <button
              onClick={() => setActiveTab("config")}
              className={`flex-1 py-4 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 ${
                activeTab === "config" ? "text-rose-500 border-b-2 border-rose-500" : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              <Settings className="h-4 w-4" /> Konfigürasyon
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 relative">
            {msg.text && (
              <div className={`absolute top-4 right-4 left-4 p-3 rounded-xl text-xs font-bold flex items-center gap-2 z-10 shadow-lg ${
                msg.type === "success" ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "bg-red-500/20 text-red-400 border border-red-500/30"
              }`}>
                <CheckCircle className="h-4 w-4" /> {msg.text}
              </div>
            )}

            {activeTab === "products" ? (
              <div className="space-y-8 animate-fadeIn">
                <form onSubmit={handleSaveProduct} className="space-y-4 p-5 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-inner">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    {editingId ? <Edit2 className="h-4 w-4 text-rose-500" /> : <Plus className="h-4 w-4 text-rose-500" />}
                    {editingId ? "Ürünü Düzenle" : "Yeni Dummy Ürün Ekle"}
                  </h3>
                  
                  <div className="space-y-3">
                    <input type="text" placeholder="Ürün Başlığı" value={form.title} onChange={e => setForm({...form, title: e.target.value})} required className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-sm focus:border-rose-500 outline-none" />
                    <div className="flex gap-3">
                      <input type="number" placeholder="Fiyat (₺)" value={form.price} onChange={e => setForm({...form, price: e.target.value})} required className="w-1/2 px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-sm focus:border-rose-500 outline-none" />
                      <input type="number" placeholder="Sıra" value={form.order} onChange={e => setForm({...form, order: parseInt(e.target.value)||0})} className="w-1/2 px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-sm focus:border-rose-500 outline-none" />
                    </div>
                    <input type="text" placeholder="Görsel URL" value={form.imageUrl} onChange={e => setForm({...form, imageUrl: e.target.value})} className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-sm focus:border-rose-500 outline-none" />
                    <input type="text" placeholder="Buton Metni (Örn: Satın Al)" value={form.buttonText} onChange={e => setForm({...form, buttonText: e.target.value})} className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-sm focus:border-rose-500 outline-none" />
                  </div>
                  
                  <div className="flex gap-3 pt-2">
                    <button type="submit" disabled={isPending} className="flex-1 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-colors">
                      {editingId ? "Güncelle" : "Ekle"}
                    </button>
                    {editingId && <button type="button" onClick={resetForm} className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-bold transition-colors">İptal</button>}
                  </div>
                </form>

                <div className="space-y-3">
                  <h3 className="text-xs font-bold uppercase text-zinc-500 tracking-wider">Mevcut Dummy Ürünler</h3>
                  {products.sort((a,b) => a.order - b.order).map(prod => (
                    <div key={prod.id} className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-between hover:border-zinc-700 transition-colors">
                      <div className="flex items-center gap-3">
                        {prod.imageUrl ? (
                          <img src={prod.imageUrl} className="w-10 h-10 rounded-lg object-cover bg-zinc-800" />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-600">...</div>
                        )}
                        <div>
                          <div className="text-sm font-bold text-white">{prod.title}</div>
                          <div className="text-xs text-rose-500 font-mono">{prod.price} ₺</div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => handleEdit(prod)} className="p-2 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"><Edit2 className="h-4 w-4" /></button>
                        <button onClick={() => handleDeleteProduct(prod.id)} className="p-2 rounded-lg hover:bg-red-500/20 text-zinc-400 hover:text-red-400 transition-colors"><Trash2 className="h-4 w-4" /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-8 animate-fadeIn">
                <div className="space-y-6">
                  {/* Scroll Speed */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-zinc-500 tracking-wider">Scroll Hızı (Satış Sayfası)</label>
                    <select 
                      value={settings["storefront_scroll_speed"] || "normal"}
                      onChange={e => handleSettingChange("storefront_scroll_speed", e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 focus:border-rose-500 outline-none text-sm text-white"
                    >
                      <option value="slow">Yavaş (45ms)</option>
                      <option value="normal">Normal (30ms)</option>
                      <option value="fast">Hızlı (15ms)</option>
                    </select>
                  </div>

                  {/* Fade-in Style */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-zinc-500 tracking-wider">Ürün Giriş Animasyonu</label>
                    <select 
                      value={settings["storefront_fade_in_style"] || "fade-in-up"}
                      onChange={e => handleSettingChange("storefront_fade_in_style", e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 focus:border-rose-500 outline-none text-sm text-white"
                    >
                      <option value="fade-in-up">Aşağıdan Yukarı (Fade-in-up)</option>
                      <option value="zoom-in">İçeri Büyüyerek (Zoom-in)</option>
                    </select>
                  </div>

                  {/* Theme Inheritance Toggle */}
                  <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-white">Theme Inheritance</h4>
                      <p className="text-xs text-zinc-400 mt-0.5">Mağaza modülü profilin temasını (renk, buton) miras alsın mı?</p>
                    </div>
                    <button
                      onClick={() => handleSettingChange("storefront_theme_inheritance", settings["storefront_theme_inheritance"] === "true" ? "false" : "true")}
                      className={`w-12 h-6 rounded-full transition-colors relative flex items-center px-1 ${
                        settings["storefront_theme_inheritance"] === "true" ? "bg-emerald-500" : "bg-zinc-700"
                      }`}
                    >
                      <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${
                        settings["storefront_theme_inheritance"] === "true" ? "translate-x-6" : "translate-x-0"
                      }`} />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Live Simulator */}
        <div className="flex-1 bg-zinc-950 flex flex-col relative">
          <div className="absolute top-6 left-6 flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900 border border-zinc-800 z-10">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-zinc-300">Live Simulator</span>
          </div>

          <div className="flex-1 overflow-y-auto no-scrollbar relative flex items-center justify-center p-8">
            <div className="w-[1200px] transform scale-[0.6] lg:scale-[0.8] origin-center pointer-events-none">
              <EklentilerClient />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
