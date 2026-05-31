"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Plus, Edit, Trash2, Check, X, Shield, Lock, Save, Loader2, LayoutGrid } from "lucide-react";
import { createFeature, updateFeature, deleteFeature } from "@/app/actions";

interface Feature {
 id: string;
 key: string;
 title: string;
 description: string | null;
 plans: string[];
 createdAt: string;
}

interface FeaturesClientProps {
 adminUserId: string;
 adminRole: string;
 initialFeatures: Feature[];
}

export default function FeaturesClient({ adminUserId, adminRole, initialFeatures }: FeaturesClientProps) {
 const [features, setFeatures] = useState<Feature[]>(initialFeatures);
 const [isModalOpen, setIsModalOpen] = useState(false);
 const [editingFeature, setEditingFeature] = useState<Feature | null>(null);
 
 // Form state
 const [key, setKey] = useState("");
 const [title, setTitle] = useState("");
 const [description, setDescription] = useState("");
 const [selectedPlans, setSelectedPlans] = useState<string[]>([]);
 const [isPending, setIsPending] = useState(false);
 const [errorMsg, setErrorMsg] = useState("");
 const [successMsg, setSuccessMsg] = useState("");

 const availablePlans = ["FREE", "STARTER", "CREATOR", "PRO_BUSINESS"];

 const resetForm = () => {
 setKey("");
 setTitle("");
 setDescription("");
 setSelectedPlans([]);
 setEditingFeature(null);
 setErrorMsg("");
 };

 const handleOpenCreate = () => {
 resetForm();
 setIsModalOpen(true);
 };

 const handleOpenEdit = (feature: Feature) => {
 setEditingFeature(feature);
 setKey(feature.key);
 setTitle(feature.title);
 setDescription(feature.description || "");
 setSelectedPlans(feature.plans);
 setIsModalOpen(true);
 };

 const handleTogglePlan = (plan: string) => {
 if (selectedPlans.includes(plan)) {
 setSelectedPlans(selectedPlans.filter(p => p !== plan));
 } else {
 setSelectedPlans([...selectedPlans, plan]);
 }
 };

 const handleSubmit = async (e: React.FormEvent) => {
 e.preventDefault();
 if (!key || !title) {
 setErrorMsg("Anahtar (Key) ve Başlık zorunludur.");
 return;
 }

 setIsPending(true);
 setErrorMsg("");

 try {
 if (editingFeature) {
 const updated = await updateFeature(editingFeature.id, { key, title, description }, selectedPlans);
 setFeatures(features.map(f => f.id === updated.id ? { ...f, key: updated.key, title: updated.title, description: updated.description, plans: selectedPlans } : f));
 setSuccessMsg("Özellik başarıyla güncellendi.");
 } else {
 const created = await createFeature({ key, title, description }, selectedPlans);
 setFeatures([{
 id: created.id,
 key: created.key,
 title: created.title,
 description: created.description,
 plans: selectedPlans,
 createdAt: created.createdAt.toISOString()
 }, ...features]);
 setSuccessMsg("Özellik başarıyla oluşturuldu.");
 }
 setIsModalOpen(false);
 setTimeout(() => setSuccessMsg(""), 3000);
 } catch (err: any) {
 setErrorMsg(err.message || "İşlem başarısız oldu.");
 } finally {
 setIsPending(false);
 }
 };

 const handleDelete = async (id: string) => {
 if (!confirm("Bu özelliği silmek istediğinize emin misiniz? (Özelliğe bağlı yetkilendirmeler kalkar)")) return;
 
 try {
 await deleteFeature(id);
 setFeatures(features.filter(f => f.id !== id));
 setSuccessMsg("Özellik başarıyla silindi.");
 setTimeout(() => setSuccessMsg(""), 3000);
 } catch (err: any) {
 alert("Silme işlemi başarısız: " + err.message);
 }
 };

 return (
 <div className="min-h-screen bg-slate-50 font-corporate text-slate-900 pb-20">
 {/* Admin Header */}
 <header className="bg-slate-900 text-white sticky top-0 z-40 border-b border-slate-800 shadow-sm">
 <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
 <div className="flex items-center gap-4">
 <Link href="/admin" className="p-2 -ml-2 rounded-lg hover:bg-slate-800 transition-colors text-slate-400 hover:text-white">
 <ArrowLeft className="h-5 w-5" />
 </Link>
 <div className="h-6 w-px bg-slate-700" />
 <Shield className="h-5 w-5 text-neon-blue" />
 <h1 className="font-bold text-lg tracking-tight">Dinamik Özellik ve Paket Yönetimi</h1>
 </div>
 <button 
 onClick={handleOpenCreate}
 className="px-4 py-3 md:py-2 bg-neon-blue hover:bg-light-blue text-white rounded-lg text-sm font-bold flex items-center gap-2 transition-colors shadow-sm shadow-neon-blue/20"
 >
 <Plus className="h-4 w-4" />
 Yeni Özellik
 </button>
 </div>
 </header>

 {/* Main Content */}
 <main className="max-w-7xl mx-auto px-6 mt-8">
 {successMsg && (
 <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center gap-3">
 <Check className="h-5 w-5" />
 <span className="font-semibold text-sm">{successMsg}</span>
 </div>
 )}

 <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
 <div className="p-3 md:p-6 border-b border-slate-100 flex items-center gap-3">
 <div className="p-2 bg-slate-50 text-slate-500 rounded-lg">
 <LayoutGrid className="h-5 w-5" />
 </div>
 <div>
 <h2 className="text-lg font-bold text-slate-900">Platform Özellikleri (Feature Gating)</h2>
 <p className="text-sm text-slate-500">Sistemdeki kilitli özelliklerin hangi paketlerde aktif olacağını buradan yönetin.</p>
 </div>
 </div>

 <div className="overflow-x-auto">
 <table className="w-full text-left border-collapse">
 <thead>
 <tr className="bg-slate-50/50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
 <th className="py-4 px-6 font-black uppercase tracking-wider">Özellik / Anahtar (Key)</th>
 <th className="py-4 px-6 font-black uppercase tracking-wider">Açıklama</th>
 <th className="py-4 px-6 font-black uppercase tracking-wider">Aktif Paketler</th>
 <th className="py-4 px-6 font-black uppercase tracking-wider text-right">İşlemler</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-slate-100">
 {features.map((feature) => (
 <tr key={feature.id} className="hover:bg-slate-50/50 transition-colors">
 <td className="py-4 px-6">
 <div className="font-bold text-sm text-slate-900">{feature.title}</div>
 <div className="text-xs font-mono text-slate-500 mt-1">{feature.key}</div>
 </td>
 <td className="py-4 px-6 text-sm text-slate-600 max-w-xs truncate">
 {feature.description || "-"}
 </td>
 <td className="py-4 px-6">
 <div className="flex flex-wrap gap-1.5">
 {feature.plans.length === 0 ? (
 <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-500 text-[10px] font-bold">HİÇBİRİ</span>
 ) : (
 feature.plans.map(plan => (
 <span key={plan} className="px-2 py-0.5 rounded bg-purple-50 border border-purple-100 text-purple-600 text-[10px] font-black uppercase tracking-wider">
 {plan}
 </span>
 ))
 )}
 </div>
 </td>
 <td className="py-4 px-6 text-right">
 <div className="flex items-center justify-end gap-2">
 <button 
 onClick={() => handleOpenEdit(feature)}
 className="p-2 text-slate-400 hover:text-neon-blue hover:bg-slate-50 rounded-lg transition-colors"
 title="Düzenle"
 >
 <Edit className="h-4 w-4" />
 </button>
 <button 
 onClick={() => handleDelete(feature.id)}
 className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
 title="Sil"
 >
 <Trash2 className="h-4 w-4" />
 </button>
 </div>
 </td>
 </tr>
 ))}
 {features.length === 0 && (
 <tr>
 <td colSpan={4} className="py-12 text-center text-slate-500 text-sm">
 Henüz tanımlı bir özellik (feature) bulunmuyor.
 </td>
 </tr>
 )}
 </tbody>
 </table>
 </div>
 </div>
 </main>

 {/* Create/Edit Modal */}
 {isModalOpen && (
 <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
 <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
 <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
 <div className="p-3 md:p-6 border-b border-slate-100 flex items-center justify-between">
 <h2 className="text-xl font-bold text-slate-900">
 {editingFeature ? "Özellik Düzenle" : "Yeni Özellik Ekle"}
 </h2>
 <button onClick={() => setIsModalOpen(false)} className="p-2 text-slate-400 hover:bg-slate-100 rounded-lg transition-colors">
 <X className="h-5 w-5" />
 </button>
 </div>
 
 <form onSubmit={handleSubmit} className="p-3 md:p-6 space-y-5">
 {errorMsg && (
 <div className="p-3 bg-red-50 text-red-600 text-sm font-semibold rounded-lg">
 {errorMsg}
 </div>
 )}

 <div className="space-y-4">
 <div>
 <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider block mb-1.5">Anahtar (Key) *</label>
 <input
 type="text"
 value={key}
 onChange={(e) => setKey(e.target.value)}
 placeholder="Örn: custom_domain"
 className="w-full px-3 py-3 md:py-2 rounded-xl border border-slate-200 focus:border-neon-blue focus:ring-2 focus:ring-neon-blue/20 outline-none text-sm text-slate-900 font-mono transition-all"
 required
 />
 <p className="text-[10px] text-slate-400 mt-1">Kod içerisinde kontrol edilecek eşsiz anahtar kelime.</p>
 </div>

 <div>
 <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider block mb-1.5">Başlık *</label>
 <input
 type="text"
 value={title}
 onChange={(e) => setTitle(e.target.value)}
 placeholder="Örn: Özel Alan Adı (Custom Domain)"
 className="w-full px-3 py-3 md:py-2 rounded-xl border border-slate-200 focus:border-neon-blue focus:ring-2 focus:ring-neon-blue/20 outline-none text-sm text-slate-900 transition-all"
 required
 />
 </div>

 <div>
 <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider block mb-1.5">Açıklama</label>
 <textarea
 value={description}
 onChange={(e) => setDescription(e.target.value)}
 placeholder="Özellik hakkında kısa bilgi..."
 rows={2}
 className="w-full px-3 py-3 md:py-2 rounded-xl border border-slate-200 focus:border-neon-blue focus:ring-2 focus:ring-neon-blue/20 outline-none text-sm text-slate-900 transition-all resize-none"
 />
 </div>

 <div>
 <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider block mb-2.5">Erişim İzni Olan Paketler</label>
 <div className="flex flex-wrap gap-2">
 {availablePlans.map(plan => {
 const isSelected = selectedPlans.includes(plan);
 return (
 <div
 key={plan}
 onClick={() => handleTogglePlan(plan)}
 className={`flex items-center gap-2 px-3 py-3 md:py-2 rounded-xl border text-xs font-bold cursor-pointer transition-all ${
 isSelected 
 ? "bg-purple-50 border-purple-200 text-purple-700 shadow-sm" 
 : "bg-white border-slate-200 text-slate-500 hover:border-slate-300"
 }`}
 >
 <div className={`w-4 h-4 rounded-md border flex items-center justify-center ${isSelected ? 'bg-purple-500 border-purple-600' : 'bg-slate-50 border-slate-300'}`}>
 {isSelected && <Check className="h-3 w-3 text-white" />}
 </div>
 {plan}
 </div>
 );
 })}
 </div>
 </div>
 </div>

 <div className="pt-4 flex justify-end gap-3">
 <button
 type="button"
 onClick={() => setIsModalOpen(false)}
 className="px-4 py-3 md:py-2 text-sm font-bold text-slate-600 hover:text-slate-900"
 >
 İptal
 </button>
 <button
 type="submit"
 disabled={isPending}
 className="px-6 py-3 md:py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-bold flex items-center gap-2 transition-colors disabled:opacity-50"
 >
 {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
 {editingFeature ? "Güncelle" : "Oluştur"}
 </button>
 </div>
 </form>
 </div>
 </div>
 )}
 </div>
 );
}
