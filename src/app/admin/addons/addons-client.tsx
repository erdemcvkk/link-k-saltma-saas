"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import { 
 ArrowLeft, Plus, Trash2, Edit2, Settings, LayoutGrid, CheckCircle, 
 X, Info, Store, SlidersHorizontal
} from "lucide-react";
import { saveAddonSetting } from "../../actions";
import EklentilerClient, { ADDON_TYPES } from "../../eklentiler/eklentiler-client";

interface AddonsClientProps {
 adminUserId: string;
 initialSettings: Record<string, string>;
 initialProducts: any[];
}

export default function AddonsClient({ adminUserId, initialSettings, initialProducts }: AddonsClientProps) {
 const [settings, setSettings] = useState(initialSettings);
 const [isPending, startTransition] = useTransition();
 const [msg, setMsg] = useState({ text: "", type: "" });
 const [activeTab, setActiveTab] = useState("themes"); 

 // Form State
 const [isFormOpen, setIsFormOpen] = useState(false);
 const [editingId, setEditingId] = useState<string | null>(null);
 const [form, setForm] = useState({
 name: "", desc: "", price: "", paymentUrl: ""
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

 const closeForm = () => {
 setIsFormOpen(false);
 setEditingId(null);
 };

 const handleEdit = (addon: any) => {
 setEditingId(addon.id);
 const nameKey = `theme_NAME_${addon.id}`;
 const descKey = `theme_DESC_${addon.id}`;
 const priceKey = `theme_PRICE_${addon.id}`;
 const paymentKey = `theme_PAYMENT_${addon.id}`;

 setForm({
 name: settings[nameKey] || addon.name,
 desc: settings[descKey] || addon.desc,
 price: settings[priceKey] || addon.price.toString(),
 paymentUrl: settings[paymentKey] || ""
 });
 setIsFormOpen(true);
 };

 const handleSaveTheme = (e: React.FormEvent) => {
 e.preventDefault();
 if (!editingId) return;

 startTransition(async () => {
 try {
 const nameKey = `theme_NAME_${editingId}`;
 const descKey = `theme_DESC_${editingId}`;
 const priceKey = `theme_PRICE_${editingId}`;
 const paymentKey = `theme_PAYMENT_${editingId}`;

 await saveAddonSetting(adminUserId, nameKey, form.name);
 await saveAddonSetting(adminUserId, descKey, form.desc);
 await saveAddonSetting(adminUserId, priceKey, form.price);
 await saveAddonSetting(adminUserId, paymentKey, form.paymentUrl);

 setSettings({
 ...settings,
 [nameKey]: form.name,
 [descKey]: form.desc,
 [priceKey]: form.price,
 [paymentKey]: form.paymentUrl
 });

 showMsg("Tema başarıyla güncellendi.", "success");
 closeForm();
 } catch (err: any) {
 showMsg("Tema kaydedilirken bir hata oluştu.", "error");
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

 <div className="w-full max-w-full md:w-[1500px] h-[90vh] min-h-[800px] rounded-[32px] border border-white/10 bg-zinc-950 flex overflow-hidden shadow-2xl">
 
 {/* Left Control Panel */}
 <div className="w-full md:w-[500px] flex flex-col border-r border-white/5 bg-zinc-950 shrink-0 relative">
 
 <div className="p-4 md:p-8 border-b border-white/5 flex items-start justify-between">
 <div>
 <Link href="/admin" className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors mb-4 text-sm font-medium">
 <ArrowLeft className="h-4 w-4" /> Admin Paneli
 </Link>
 <h1 className="text-xl md:text-3xl font-black text-white tracking-tight flex items-center gap-3">
 <Store className="h-7 w-7 text-rose-500" /> Platform Temaları
 </h1>
 <p className="text-sm text-zinc-400 font-medium mt-2">Müşterilerinize sunduğunuz temaları ve eklentileri yönetin.</p>
 </div>
 </div>

 <div className="flex border-b border-white/5 bg-zinc-900/20">
 <button
 onClick={() => setActiveTab("themes")}
 className={`flex-1 py-4 text-sm font-bold tracking-wide flex items-center justify-center gap-2 transition-colors ${
 activeTab === "themes" ? "text-rose-500 border-b-2 border-rose-500 bg-rose-500/5" : "text-zinc-500 hover:text-zinc-300"
 }`}
 >
 <Store className="h-5 w-5" /> Temalar (Satılanlar)
 </button>
 <button
 onClick={() => setActiveTab("config")}
 className={`flex-1 py-4 text-sm font-bold tracking-wide flex items-center justify-center gap-2 transition-colors ${
 activeTab === "config" ? "text-rose-500 border-b-2 border-rose-500 bg-rose-500/5" : "text-zinc-500 hover:text-zinc-300"
 }`}
 >
 <SlidersHorizontal className="h-5 w-5" /> Ayarlar
 </button>
 </div>

 <div className="flex-1 overflow-y-auto p-4 md:p-8 relative no-scrollbar">
 {activeTab === "themes" ? (
 <div className="space-y-6 animate-fadeIn">
 <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-start gap-3">
 <Info className="h-5 w-5 text-rose-400 shrink-0 mt-0.5" />
 <p className="text-xs text-rose-200 leading-relaxed font-medium">
 Kullanıcılara sunduğunuz <strong>10 Premium Tema / Eklenti</strong> ürününüz bunlardır. İsimlerini, açıklamalarını ve satış fiyatlarını düzenleyebilirsiniz.
 </p>
 </div>

 <div className="flex flex-wrap items-center justify-between">
 <h3 className="text-lg font-bold text-white flex items-center gap-2">
 <LayoutGrid className="h-5 w-5 text-zinc-500" /> Tema Listesi ({ADDON_TYPES.length})
 </h3>
 </div>

 <div className="space-y-3">
 {ADDON_TYPES.map(addon => {
 const nameKey = `theme_NAME_${addon.id}`;
 const descKey = `theme_DESC_${addon.id}`;
 const priceKey = `theme_PRICE_${addon.id}`;
 
 const currentName = settings[nameKey] || addon.name;
 const currentDesc = settings[descKey] || addon.desc;
 const currentPrice = settings[priceKey] || addon.price;

 return (
 <div key={addon.id} className="group p-3 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-between hover:border-zinc-700 transition-all hover:shadow-lg">
 <div className="flex items-center gap-4">
 <div className={`w-14 h-14 rounded-xl flex items-center justify-center shadow-sm ${addon.color}`}>
 <div className="text-white opacity-80 mix-blend-overlay font-bold text-xl">
 {currentName.charAt(0)}
 </div>
 </div>
 <div>
 <div className="text-sm font-bold text-white group-hover:text-rose-400 transition-colors">{currentName}</div>
 <div className="text-xs text-zinc-400 font-medium mt-1 truncate max-w-[200px]">
 {currentDesc}
 </div>
 <div className="text-xs font-bold text-emerald-400 mt-1">
 {currentPrice} ₺
 </div>
 </div>
 </div>
 <div className="flex gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity pr-2">
 <button type="button" onClick={() => handleEdit(addon)} className="p-2.5 rounded-xl bg-zinc-800 hover:bg-white text-zinc-400 hover:text-black transition-colors" title="Düzenle">
 <Edit2 className="h-4 w-4" />
 </button>
 </div>
 </div>
 );
 })}
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
 </div>
 </div>
 )}
 </div>

 {/* Slide-up Form Overlay for Themes */}
 {isFormOpen && (
 <div className="absolute inset-0 z-20 bg-zinc-950 flex flex-col animate-in slide-in-from-bottom-8 duration-300">
 <div className="p-3 md:p-6 border-b border-white/5 flex items-center justify-between bg-zinc-900">
 <h2 className="text-lg font-bold text-white flex items-center gap-2">
 <Edit2 className="h-5 w-5 text-rose-500" /> Temayı Düzenle
 </h2>
 <button type="button" onClick={closeForm} className="p-2 bg-zinc-800 hover:bg-zinc-700 rounded-full text-zinc-400 hover:text-white transition-colors">
 <X className="h-5 w-5" />
 </button>
 </div>
 <div className="flex-1 overflow-y-auto p-3 md:p-6">
 <form onSubmit={handleSaveTheme} className="space-y-5">
 <div className="space-y-1.5">
 <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Tema / Eklenti Adı</label>
 <input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required className="w-full px-4 py-3 rounded-xl bg-black border border-zinc-800 text-sm focus:border-rose-500 focus:ring-1 focus:ring-rose-500 outline-none transition-all" />
 </div>
 
 <div className="space-y-1.5">
 <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Açıklama (Subtitle)</label>
 <input type="text" value={form.desc} onChange={e => setForm({...form, desc: e.target.value})} required className="w-full px-4 py-3 rounded-xl bg-black border border-zinc-800 text-sm focus:border-rose-500 focus:ring-1 focus:ring-rose-500 outline-none transition-all" />
 </div>
 
 <div className="space-y-1.5">
 <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Satış Fiyatı (₺)</label>
 <input type="number" value={form.price} onChange={e => setForm({...form, price: e.target.value})} required className="w-full px-4 py-3 rounded-xl bg-black border border-zinc-800 text-sm focus:border-rose-500 focus:ring-1 focus:ring-rose-500 outline-none transition-all" />
 </div>

 <div className="space-y-1.5">
 <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Ödeme Linki (İsteğe Bağlı)</label>
 <input type="url" placeholder="https://buy.stripe.com/..." value={form.paymentUrl} onChange={e => setForm({...form, paymentUrl: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-black border border-zinc-800 text-sm focus:border-rose-500 focus:ring-1 focus:ring-rose-500 outline-none transition-all text-emerald-400" />
 <p className="text-[10px] text-zinc-500 mt-1">Stripe, Iyzico veya Shopier ödeme linki ekleyebilirsiniz. Boş bırakırsanız sistem simülasyonu çalışır.</p>
 </div>

 <div className="pt-6 border-t border-white/5 flex gap-3">
 <button type="submit" disabled={isPending} className="flex-1 py-3.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-sm font-bold transition-colors shadow-lg shadow-rose-500/20 disabled:opacity-50">
 {isPending ? "Kaydediliyor..." : "Değişiklikleri Kaydet"}
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
 
 <div className="absolute top-6 left-6 flex items-center gap-3 px-5 py-3 md:py-2.5 rounded-2xl bg-zinc-900/90 backdrop-blur border border-white/10 z-10 shadow-2xl">
 <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
 <span className="text-xs font-black uppercase tracking-widest text-zinc-300">Live Simulator</span>
 </div>

 <div className="flex-1 overflow-y-auto no-scrollbar relative flex items-center justify-center p-4 md:p-8 z-0">
 {/* A subtle glow behind the simulator */}
 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full md:w-[800px] h-[400px] bg-rose-500/10 blur-[120px] rounded-full pointer-events-none" />
 
 <div className="w-full md:w-[1600px] transform scale-[0.6] lg:scale-[0.8] 2xl:scale-[0.9] origin-center transition-transform duration-500">
 <EklentilerClient products={initialProducts.filter(p => p.isActive)} settings={settings} />
 </div>
 </div>
 </div>

 </div>
 </div>
 );
}
