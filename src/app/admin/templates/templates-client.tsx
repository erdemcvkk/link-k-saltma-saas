"use client";

import React, { useState, useTransition, useEffect } from "react";
import Link from "next/link";
import { 
 createTemplate, 
 updateTemplate, 
 deleteTemplate, 
 seedTemplates 
} from "@/app/actions";
import { 
 ArrowLeft, Plus, Trash2, CheckCircle, X, 
 Store, Code, Layout, Edit2, Info, LayoutGrid, Check, Settings, Gift
} from "lucide-react";
import GlobalOverlayManager from "@/components/global-overlay-manager";
import UniversalProfile from "@/components/universal-profile";

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
 isComingSoon: boolean;
 customCss?: string | null;
 configJson?: string | null;
 createdAt: string;
}

interface TemplatesClientProps {
 adminUserId: string;
 adminRole: string;
 initialTemplates: Template[];
 fonts: { name: string; value: string }[];
}

export default function TemplatesClient({ adminUserId, adminRole, initialTemplates, fonts }: TemplatesClientProps) {
 const [templates, setTemplates] = useState<Template[]>(initialTemplates);
 const [isPending, startTransition] = useTransition();
 const [msg, setMsg] = useState({ text: "", type: "" });
 
 // Modals state
 const [isAddModalOpen, setIsAddModalOpen] = useState(false);
 const [previewTemplate, setPreviewTemplate] = useState<Template | null>(initialTemplates[0] || null);
 const [editingTemplateId, setEditingTemplateId] = useState<string | null>(null);

 // Form states
 const [formMode, setFormMode] = useState<"no-code" | "code">("no-code");
 const [formData, setFormData] = useState({
 name: "",
 price: "",
 category: "Genel",
 bgColor: "#09090b",
 fontStyle: "Inter",
 buttonStyle: "bg-white hover:bg-slate-100 text-slate-900 rounded-xl",
 paymentLink: "",
 customCss: "",
 configJson: "",
 isComingSoon: false,
 });

 const showMsg = (text: string, type: "success" | "error") => {
 setMsg({ text, type });
 setTimeout(() => setMsg({ text: "", type: "" }), 4000);
 };

 const handleToggleActive = async (id: string, currentStatus: boolean) => {
 startTransition(async () => {
 try {
 await updateTemplate(adminUserId, id, { isActive: !currentStatus });
 setTemplates(prev => 
 prev.map(t => t.id === id ? { ...t, isActive: !currentStatus } : t)
 );
 showMsg("Şablon durumu güncellendi!", "success");
 } catch (err: any) {
 showMsg(err.message || "Durum güncellenirken hata oluştu.", "error");
 }
 });
 };

  const handleToggleComingSoon = async (id: string, currentComingSoon: boolean) => {
    startTransition(async () => {
      try {
        await updateTemplate(adminUserId, id, { isComingSoon: !currentComingSoon });
        setTemplates(prev => 
          prev.map(t => t.id === id ? { ...t, isComingSoon: !currentComingSoon } : t)
        );
        showMsg("Şablon 'Çok Yakında' durumu güncellendi!", "success");
      } catch (err: any) {
        showMsg(err.message || "Durum güncellenirken hata oluştu.", "error");
      }
    });
  };

 const handleDelete = async (id: string) => {
 if (!confirm("Bu şablonu silmek istediğinize emin misiniz?")) return;

 startTransition(async () => {
 try {
 await deleteTemplate(adminUserId, id);
 setTemplates(prev => prev.filter(t => t.id !== id));
 if (previewTemplate?.id === id) setPreviewTemplate(null);
 showMsg("Şablon başarıyla silindi!", "success");
 } catch (err: any) {
 showMsg(err.message || "Şablon silinirken hata oluştu.", "error");
 }
 });
 };

 const handleSeed = async () => {
 startTransition(async () => {
 try {
 const res = await seedTemplates(adminUserId);
 if (res.seeded) {
 showMsg(res.message || "Örnek şablonlar başarıyla eklendi!", "success");
 setTimeout(() => window.location.reload(), 1500);
 } else {
 showMsg(res.message || "Zaten şablonlar mevcut.", "error");
 }
 } catch (err: any) {
 showMsg(err.message || "Örnek şablonlar eklenirken hata oluştu.", "error");
 }
 });
 };

 const handleToggleFree = async (id: string, currentPrice: number) => {
  const newPrice = currentPrice > 0 ? 0 : 149;
  startTransition(async () => {
   try {
    await updateTemplate(adminUserId, id, { price: newPrice });
    setTemplates(prev =>
     prev.map(t => t.id === id ? { ...t, price: newPrice } : t)
    );
    showMsg(newPrice === 0 ? "Şablon ücretsiz yapıldı!" : "Şablon ücretli yapıldı!", "success");
   } catch (err: any) {
    showMsg(err.message || "Fiyat güncellenirken hata oluştu.", "error");
   }
  });
 };

  const handleEditClick = (template: Template) => {
   setEditingTemplateId(template.id);
   setFormMode(template.isCoded ? "code" : "no-code");
   setFormData({
     name: template.name,
     price: template.price.toString(),
     category: template.category,
     bgColor: template.bgColor || "#09090b",
     fontStyle: template.fontStyle || "Inter",
     buttonStyle: template.buttonStyle || "",
     paymentLink: template.paymentLink || "",
     customCss: template.customCss || "",
     configJson: template.configJson || "",
     isComingSoon: template.isComingSoon || false,
   });
   setIsAddModalOpen(true);
  };

 const handleAddTemplate = async (e: React.FormEvent) => {
 e.preventDefault();

 if (!formData.name || !formData.price) {
 showMsg("Lütfen zorunlu tüm alanları doldurun.", "error");
 return;
 }

 startTransition(async () => {
 try {
 if (editingTemplateId) {
  const result = await updateTemplate(adminUserId, editingTemplateId, {
    name: formData.name,
    price: Number(formData.price),
    category: formData.category,
    bgColor: formData.bgColor,
    fontStyle: formData.fontStyle,
    buttonStyle: formData.buttonStyle,
    paymentLink: formData.paymentLink || undefined,
    isCoded: formMode === "code",
    customCss: formMode === "code" ? formData.customCss : undefined,
    configJson: formMode === "code" ? formData.configJson : undefined,
    isComingSoon: formData.isComingSoon,
  });

  const updatedT: Template = {
    id: result.id,
    name: result.name,
    price: result.price,
    category: result.category,
    coverUrl: result.coverUrl,
    bgColor: result.bgColor,
    fontStyle: result.fontStyle,
    buttonStyle: result.buttonStyle,
    paymentLink: result.paymentLink,
    isActive: result.isActive,
    isCoded: result.isCoded,
    isComingSoon: result.isComingSoon,
    customCss: result.customCss,
    configJson: result.configJson,
    createdAt: result.createdAt.toISOString(),
  };

  setTemplates(prev => prev.map(t => t.id === editingTemplateId ? updatedT : t));
  setPreviewTemplate(updatedT);
  showMsg("Şablon başarıyla güncellendi!", "success");
  setIsAddModalOpen(false);
  setEditingTemplateId(null);
  setFormData({
    name: "", price: "", category: "Genel", bgColor: "#09090b",
    fontStyle: "Inter", buttonStyle: "bg-white hover:bg-slate-100 text-slate-900 rounded-xl",
    paymentLink: "", customCss: "", configJson: "", isComingSoon: false,
  });
 } else {
  const result = await createTemplate(adminUserId, {
    name: formData.name,
    price: Number(formData.price),
    category: formData.category,
    coverUrl: "",
    bgColor: formData.bgColor,
    fontStyle: formData.fontStyle,
    buttonStyle: formData.buttonStyle,
    paymentLink: formData.paymentLink || undefined,
    isActive: true,
    isCoded: formMode === "code",
    customCss: formMode === "code" ? formData.customCss : undefined,
    configJson: formMode === "code" ? formData.configJson : undefined,
    isComingSoon: formData.isComingSoon,
  });

  const newT: Template = {
    id: result.id,
    name: result.name,
    price: result.price,
    category: result.category,
    coverUrl: result.coverUrl,
    bgColor: result.bgColor,
    fontStyle: result.fontStyle,
    buttonStyle: result.buttonStyle,
    paymentLink: result.paymentLink,
    isActive: result.isActive,
    isCoded: result.isCoded,
    isComingSoon: result.isComingSoon,
    customCss: result.customCss,
    configJson: result.configJson,
    createdAt: result.createdAt.toISOString(),
  };

  setTemplates(prev => [newT, ...prev]);
  setPreviewTemplate(newT);
  showMsg("Şablon başarıyla eklendi!", "success");
  setIsAddModalOpen(false);
  setFormData({
    name: "", price: "", category: "Genel", bgColor: "#09090b",
    fontStyle: "Inter", buttonStyle: "bg-white hover:bg-slate-100 text-slate-900 rounded-xl",
    paymentLink: "", customCss: "", configJson: "", isComingSoon: false,
  });
 }
 } catch (err: any) {
 showMsg(err.message || "Şablon kaydedilirken hata oluştu.", "error");
 }
 });
 };

 const currentPreviewData = isAddModalOpen ? {
 theme: formData.name || "Yeni Şablon",
 customCss: formMode === "code" ? formData.customCss : null,
 background: formData.bgColor,
 buttonClass: formData.buttonStyle,
 fontStyle: formData.fontStyle,
 } : previewTemplate ? {
 theme: previewTemplate.name,
 customCss: previewTemplate.customCss,
 background: previewTemplate.bgColor,
 buttonClass: previewTemplate.buttonStyle,
 fontStyle: previewTemplate.fontStyle,
 } : null;

 return (
 <div className="min-h-screen flex items-center justify-center p-4 md:p-8 bg-black text-white font-sans overflow-hidden">
 <GlobalOverlayManager />
 
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
 <div className="w-full md:w-[600px] flex flex-col border-r border-white/5 bg-zinc-950 shrink-0 relative overflow-hidden">
 
 <div className="p-4 md:p-8 border-b border-white/5 flex items-start justify-between">
 <div>
 <Link href="/admin" className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors mb-4 text-sm font-medium">
 <ArrowLeft className="h-4 w-4" /> Admin Paneli
 </Link>
 <h1 className="text-xl md:text-3xl font-black text-white tracking-tight flex items-center gap-3">
 <LayoutGrid className="h-7 w-7 text-neon-blue" /> Şablon Yönetimi
 </h1>
 <p className="text-sm text-zinc-400 font-medium mt-2">Sistemdeki genel ve özel şablonları yönetin.</p>
 </div>
 <button
 onClick={() => {
    setEditingTemplateId(null);
    setFormData({
      name: "", price: "", category: "Genel", bgColor: "#09090b",
      fontStyle: "Inter", buttonStyle: "bg-white hover:bg-slate-100 text-slate-900 rounded-xl",
      paymentLink: "", customCss: "", configJson: "", isComingSoon: false,
    });
    setIsAddModalOpen(true);
  }}
 className="flex items-center gap-1.5 px-4 py-3 md:py-2 rounded-xl bg-neon-blue hover:opacity-90 text-white text-xs font-black tracking-wider transition-all shadow-md cursor-pointer"
 >
 <Plus className="h-4 w-4" /> YENİ ŞABLON
 </button>
 </div>

 <div className="flex-1 overflow-y-auto p-4 md:p-8 relative no-scrollbar">
 <div className="space-y-6 animate-fadeIn">
 <div className="p-4 rounded-2xl bg-neon-blue/10 border border-neon-blue/20 flex items-start gap-3">
 <Info className="h-5 w-5 text-neon-blue shrink-0 mt-0.5" />
 <p className="text-xs text-blue-200 leading-relaxed font-medium">
 Şablonları yönetin ve sağ taraftaki önizlemede eş zamanlı test edin.
 </p>
 </div>

 <div className="flex flex-wrap items-center justify-between">
 <h3 className="text-lg font-bold text-white flex items-center gap-2">
 <LayoutGrid className="h-5 w-5 text-zinc-500" /> Şablon Listesi ({templates.length})
 </h3>
 {templates.length === 0 && (
 <button onClick={handleSeed} disabled={isPending} className="text-xs text-neon-blue hover:underline cursor-pointer">
 10 Örnek Yükle
 </button>
 )}
 </div>

 <div className="space-y-3">
 {templates.length === 0 ? (
 <div className="p-4 md:p-8 text-center border border-dashed border-zinc-800 rounded-2xl">
 <p className="text-zinc-500 text-sm">Henüz şablon bulunmuyor.</p>
 </div>
 ) : templates.map(template => {
 const firstLetter = template.name.charAt(0).toUpperCase();
 const isActivePreview = previewTemplate?.id === template.id && !isAddModalOpen;

 return (
 <div 
 key={template.id} 
 onClick={() => setPreviewTemplate(template)}
 className={`group p-3 rounded-2xl border flex items-center justify-between transition-all cursor-pointer ${
 isActivePreview 
 ? "bg-neon-blue/5 border-neon-blue/50 shadow-[0_0_15px_rgba(56,189,248,0.1)]" 
 : "bg-zinc-900 border-zinc-800 hover:border-zinc-700 hover:shadow-lg"
 }`}
 >
 <div className="flex items-center gap-4">
 <div className="w-14 h-14 rounded-xl flex items-center justify-center shadow-sm relative overflow-hidden" style={{ background: template.bgColor || "#1e293b" }}>
 <div className="absolute inset-0 bg-black/20" />
 <div className="text-white opacity-90 font-black text-xl relative z-10">
 {firstLetter}
 </div>
 </div>
 <div>
 <div className="flex items-center gap-2">
 <div className="text-sm font-bold text-white group-hover:text-neon-blue transition-colors">{template.name}</div>
 {template.isComingSoon && (
   <span className="px-1.5 py-0.5 rounded text-[8px] font-bold bg-amber-500/20 text-amber-500 border border-amber-500/30">YAKINDA</span>
 )}
 {template.isCoded ? (
 <span className="px-1.5 py-0.5 rounded text-[8px] font-bold bg-purple-500/20 text-purple-400 border border-purple-500/30">KODLU</span>
 ) : (
 <span className="px-1.5 py-0.5 rounded text-[8px] font-bold bg-zinc-800 text-zinc-400 border border-zinc-700">KODSUZ</span>
 )}
 </div>
 <div className="text-xs text-zinc-400 font-medium mt-1 truncate max-w-[200px]">
 {template.category}
 </div>
 <div className="text-xs font-bold text-emerald-400 mt-1">
 {template.price > 0 ? `${template.price} ₺` : 'Ücretsiz'}
 </div>
 </div>
 </div>
 <div className="flex flex-col gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity pr-2">
 <button 
 onClick={(e) => { e.stopPropagation(); handleToggleFree(template.id, template.price); }} 
 className={`px-3 py-3 md:py-2.5 md:py-1.5 rounded-lg text-[10px] font-bold transition-colors cursor-pointer flex items-center justify-center gap-1 ${
  template.price === 0
   ? "bg-amber-500/20 hover:bg-amber-500/30 text-amber-400"
   : "bg-zinc-800 hover:bg-amber-500/20 text-zinc-400 hover:text-amber-400"
 }`}
 >
 <Gift className="h-3 w-3" /> {template.price === 0 ? "Ücretli Yap" : "Ücretsiz Yap"}
 </button>
 <button 
 onClick={(e) => { e.stopPropagation(); handleEditClick(template); }} 
 className="px-3 py-3 md:py-2.5 md:py-1.5 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 text-[10px] font-bold transition-colors cursor-pointer flex items-center justify-center gap-1"
 >
 <Edit2 className="h-3 w-3" /> Düzenle
 </button>
 <button 
 onClick={(e) => { e.stopPropagation(); handleToggleComingSoon(template.id, template.isComingSoon); }} 
 className={`px-3 py-3 md:py-2.5 md:py-1.5 rounded-lg text-[10px] font-bold transition-colors cursor-pointer ${template.isComingSoon ? 'bg-amber-500/25 text-amber-400 border border-amber-500/30' : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-750'}`}
 >
 {template.isComingSoon ? "Çok Yakında: Aktif" : "Çok Yakında Yap"}
 </button>
 <button 
 onClick={(e) => { e.stopPropagation(); handleToggleActive(template.id, template.isActive); }} 
 className={`px-3 py-3 md:py-2.5 md:py-1.5 rounded-lg text-[10px] font-bold transition-colors cursor-pointer ${template.isActive ? 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20' : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'}`}
 >
 {template.isActive ? "Aktif" : "Pasif"}
 </button>
 <button 
 onClick={(e) => { e.stopPropagation(); handleDelete(template.id); }} 
 className="px-3 py-3 md:py-2.5 md:py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-[10px] font-bold transition-colors cursor-pointer"
 >
 Sil
 </button>
 </div>
 </div>
 );
 })}
 </div>
 </div>
 </div>

 {/* Add Template Modal (Slide-up over left panel) */}
 {isAddModalOpen && (
 <div className="absolute inset-0 z-20 bg-zinc-950 flex flex-col animate-in slide-in-from-bottom-8 duration-300">
 <div className="p-3 md:p-6 border-b border-white/5 flex items-center justify-between bg-zinc-900">
 <h2 className="text-lg font-bold text-white flex items-center gap-2">
 {editingTemplateId ? (
    <>
      <Edit2 className="h-5 w-5 text-neon-blue" /> Şablonu Düzenle
    </>
  ) : (
    <>
      <Plus className="h-5 w-5 text-neon-blue" /> Yeni Şablon Ekle
    </>
  )}
 </h2>
 <button type="button" onClick={() => { setIsAddModalOpen(false); setEditingTemplateId(null); }} className="p-2 bg-zinc-800 hover:bg-zinc-700 rounded-full text-zinc-400 hover:text-white transition-colors cursor-pointer">
 <X className="h-5 w-5" />
 </button>
 </div>
 
 <div className="flex-1 overflow-y-auto p-3 md:p-6 no-scrollbar">
 {/* Mode Tabs */}
 <div className="flex bg-zinc-900 p-1.5 rounded-2xl border border-zinc-800 mb-6">
 <button
 type="button"
 onClick={() => setFormMode("no-code")}
 className={`flex-1 py-3 md:py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
 formMode === "no-code"
 ? "bg-zinc-800 text-white shadow-sm"
 : "text-zinc-500 hover:text-white"
 }`}
 >
 No-Code (Kodsuz)
 </button>
 <button
 type="button"
 onClick={() => setFormMode("code")}
 className={`flex-1 py-3 md:py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
 formMode === "code"
 ? "bg-purple-500/20 text-purple-400"
 : "text-zinc-500 hover:text-white"
 }`}
 >
 Advanced Code (Kodlu)
 </button>
 </div>

 <form onSubmit={handleAddTemplate} className="space-y-5">
 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
 <div className="space-y-1.5">
 <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Şablon Adı *</label>
 <input
 type="text" required value={formData.name} onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
 className="w-full px-4 py-3 rounded-xl bg-black border border-zinc-800 text-sm focus:border-neon-blue focus:ring-1 focus:ring-neon-blue outline-none transition-all"
 />
 </div>

 <div className="space-y-1.5">
 <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Fiyat (₺) *</label>
 <input
 type="number" required value={formData.price} onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
 className="w-full px-4 py-3 rounded-xl bg-black border border-zinc-800 text-sm focus:border-neon-blue focus:ring-1 focus:ring-neon-blue outline-none transition-all"
 />
 </div>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
 <div className="space-y-1.5">
 <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Kategori</label>
 <select
 value={formData.category} onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
 className="w-full px-4 py-3 rounded-xl bg-black border border-zinc-800 text-sm focus:border-neon-blue focus:ring-1 focus:ring-neon-blue outline-none transition-all text-white cursor-pointer"
 >
 <option value="Genel">Genel</option>
 <option value="Gamer">Gamer</option>
 <option value="Kreatör">Kreatör</option>
 <option value="Müzisyen">Müzisyen</option>
 <option value="Kurumsal">Kurumsal</option>
 <option value="Yazar">Yazar</option>
 </select>
 </div>
 <div className="space-y-1.5">
 <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Arka Plan Rengi</label>
 <input
 type="text" value={formData.bgColor} onChange={(e) => setFormData(prev => ({ ...prev, bgColor: e.target.value }))}
 placeholder="#09090b"
 className="w-full px-4 py-3 rounded-xl bg-black border border-zinc-800 text-sm focus:border-neon-blue focus:ring-1 focus:ring-neon-blue outline-none transition-all"
 />
 </div>
 </div>

 
 <div className="space-y-1.5">
 <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Yazı Tipi (Font)</label>
 <select
 value={formData.fontStyle} onChange={(e) => setFormData(prev => ({ ...prev, fontStyle: e.target.value }))}
 className="w-full px-4 py-3 rounded-xl bg-black border border-zinc-800 text-sm focus:border-neon-blue focus:ring-1 focus:ring-neon-blue outline-none transition-all text-white cursor-pointer"
 >
 {fonts.map(f => (
   <option key={f.value} value={f.value}>{f.name}</option>
 ))}
 </select>
 </div>

<div className="space-y-1.5">
 <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Buton Stili (Tailwind CSS)</label>
 <input
 type="text" value={formData.buttonStyle} onChange={(e) => setFormData(prev => ({ ...prev, buttonStyle: e.target.value }))}
 placeholder="bg-white text-black hover:bg-zinc-200 rounded-full"
 className="w-full px-4 py-3 rounded-xl bg-black border border-zinc-800 text-sm focus:border-neon-blue focus:ring-1 focus:ring-neon-blue outline-none transition-all"
 />
 </div>

 <div className="space-y-1.5">
 <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Ödeme Linki (İsteğe Bağlı)</label>
 <input
 type="url" value={formData.paymentLink} onChange={(e) => setFormData(prev => ({ ...prev, paymentLink: e.target.value }))}
 placeholder="https://buy.stripe.com/..."
 className="w-full px-4 py-3 rounded-xl bg-black border border-zinc-800 text-sm focus:border-neon-blue focus:ring-1 focus:ring-neon-blue outline-none transition-all text-emerald-400"
 />
 </div>

  <div className="flex items-center justify-between p-4 rounded-xl bg-zinc-900 border border-zinc-800">
    <div className="space-y-0.5">
      <label className="text-xs font-bold text-zinc-350 uppercase tracking-wider block">Çok Yakında Modu</label>
      <span className="text-[10px] text-zinc-500">Bu şablonu "Çok Yakında" olarak işaretleyip kilitleyin.</span>
    </div>
    <button 
      type="button" 
      onClick={() => setFormData(prev => ({ ...prev, isComingSoon: !prev.isComingSoon }))}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${formData.isComingSoon ? 'bg-rose-600' : 'bg-zinc-800'}`}
    >
      <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${formData.isComingSoon ? 'translate-x-5' : 'translate-x-0'}`} />
    </button>
  </div>

 {formMode === "code" && (
 <>
 <div className="space-y-1.5">
 <label className="text-xs font-bold text-purple-400 uppercase tracking-wider">Özel CSS</label>
 <textarea
 value={formData.customCss} onChange={(e) => setFormData(prev => ({ ...prev, customCss: e.target.value }))}
 rows={3}
 className="w-full px-4 py-3 rounded-xl bg-black border border-zinc-800 text-xs font-mono focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-all"
 />
 </div>
 <div className="space-y-1.5">
 <label className="text-xs font-bold text-purple-400 uppercase tracking-wider">JSON Config</label>
 <textarea
 value={formData.configJson} onChange={(e) => setFormData(prev => ({ ...prev, configJson: e.target.value }))}
 rows={2}
 className="w-full px-4 py-3 rounded-xl bg-black border border-zinc-800 text-xs font-mono focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-all"
 />
 </div>
 </>
 )}

 <div className="pt-6 border-t border-zinc-800 flex gap-3 pb-8">
 <button type="submit" disabled={isPending} className="flex-1 py-3.5 rounded-xl bg-neon-blue hover:opacity-90 text-white text-sm font-bold transition-colors shadow-lg shadow-neon-blue/20 cursor-pointer">
 {editingTemplateId ? "Şablonu Güncelle" : "Şablonu Oluştur"}
 </button>
 </div>
 </form>
 </div>
 </div>
 )}
 </div>

 {/* Right Live Simulator */}
 <div className="flex-1 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-black flex flex-col relative items-center justify-center overflow-hidden">
 <div className="absolute inset-0 bg-gradient-to-tr from-neon-blue/5 via-transparent to-purple-500/5" />
 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full md:w-[800px] h-[400px] bg-neon-blue/10 blur-[150px] rounded-full pointer-events-none" />
 
 <div className="absolute top-6 left-6 flex items-center gap-3 px-5 py-3 md:py-2.5 rounded-2xl bg-zinc-900/90 backdrop-blur border border-white/10 z-10 shadow-2xl">
 <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
 <span className="text-xs font-black uppercase tracking-widest text-zinc-300">Live Simulator</span>
 </div>

 <div className="relative z-10 w-full max-w-sm lg:w-[300px] h-[600px] rounded-[2.5rem] border-8 border-zinc-800 shadow-2xl bg-zinc-950 overflow-hidden transform transition-all duration-300">
 {currentPreviewData ? (
 <UniversalProfile 
 data={{
 username: "preview_user",
 bio: currentPreviewData.theme + " şablon önizlemesi. Harika içeriklerinizi burada sergileyebilirsiniz.",
 avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=preview",
 theme: currentPreviewData.theme,
 customCss: currentPreviewData.customCss,
 background: currentPreviewData.background,
 buttonClass: currentPreviewData.buttonClass,
 fontStyle: currentPreviewData.fontStyle,
 usernameColor: "#ffffff",
 bioColor: "rgba(255,255,255,0.7)",
 links: [
 { id: "1", title: "En Yeni Projelerim", url: "#", isActive: true, type: "link", animation: "" },
 { id: "2", title: "Sosyal Medya Hesaplarım", url: "#", isActive: true, type: "link", animation: "pulse" },
 { id: "3", title: "Bana Kahve Ismarla", url: "#", isActive: true, type: "link", animation: "bounce" },
 ],
 }}
 isCompactMode={true}
 isDarkContext={true}
 />
 ) : (
 <div className="w-full h-full flex flex-col items-center justify-center p-3 md:p-6 text-center text-zinc-500">
 <LayoutGrid className="w-12 h-12 mb-4 opacity-50" />
 <p className="text-sm font-medium">Önizleme yapmak için bir şablon seçin veya yeni ekleyin.</p>
 </div>
 )}
 </div>
 </div>

 </div>
 </div>
 );
}
