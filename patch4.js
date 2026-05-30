const fs = require('fs');
const path = 'src/app/admin/templates/templates-client.tsx';

const content = `"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import { 
  createTemplate, 
  updateTemplate, 
  deleteTemplate, 
  seedTemplates 
} from "@/app/actions";
import { 
  ArrowLeft, Plus, Trash2, CheckCircle, X, 
  Store, Code, Layout, Edit2, Info, LayoutGrid, Check, Settings
} from "lucide-react";
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
  paymentLink?: string | null;
  isActive: boolean;
  isCoded: boolean;
  customCss?: string | null;
  configJson?: string | null;
  createdAt: string;
}

interface TemplatesClientProps {
  adminUserId: string;
  adminRole: string;
  initialTemplates: Template[];
}

export default function TemplatesClient({ adminUserId, adminRole, initialTemplates }: TemplatesClientProps) {
  const [templates, setTemplates] = useState<Template[]>(initialTemplates);
  const [isPending, startTransition] = useTransition();
  const [msg, setMsg] = useState({ text: "", type: "" });
  
  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

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

  const handleDelete = async (id: string) => {
    if (!confirm("Bu şablonu silmek istediğinize emin misiniz?")) return;

    startTransition(async () => {
      try {
        await deleteTemplate(adminUserId, id);
        setTemplates(prev => prev.filter(t => t.id !== id));
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
          showMsg(\`Başarıyla \${res.count} adet örnek şablon eklendi!\`, "success");
          setTimeout(() => window.location.reload(), 1500);
        } else {
          showMsg(res.message || "Zaten şablonlar mevcut.", "error");
        }
      } catch (err: any) {
        showMsg(err.message || "Örnek şablonlar eklenirken hata oluştu.", "error");
      }
    });
  };

  const handleAddTemplate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.price) {
      showMsg("Lütfen zorunlu tüm alanları doldurun.", "error");
      return;
    }

    startTransition(async () => {
      try {
        const result = await createTemplate(adminUserId, {
          name: formData.name,
          price: Number(formData.price),
          category: formData.category,
          coverUrl: "", // Hidden in UI, defaulted to empty
          bgColor: formData.bgColor,
          fontStyle: formData.fontStyle,
          buttonStyle: formData.buttonStyle,
          paymentLink: formData.paymentLink,
          isActive: true,
          isCoded: formMode === "code",
          customCss: formMode === "code" ? formData.customCss : undefined,
          configJson: formMode === "code" ? formData.configJson : undefined,
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
          customCss: result.customCss,
          configJson: result.configJson,
          createdAt: result.createdAt.toISOString(),
        };

        setTemplates(prev => [newT, ...prev]);
        showMsg("Şablon başarıyla eklendi!", "success");
        setIsAddModalOpen(false);
        setFormData({
          name: "", price: "", category: "Genel", bgColor: "#09090b",
          fontStyle: "Inter", buttonStyle: "bg-white hover:bg-slate-100 text-slate-900 rounded-xl",
          paymentLink: "", customCss: "", configJson: "",
        });
      } catch (err: any) {
        showMsg(err.message || "Şablon eklenirken hata oluştu.", "error");
      }
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 md:p-8 bg-black text-white font-sans overflow-hidden">
      <GlobalOverlayManager />
      
      {/* Messages */}
      {msg.text && (
        <div className={\`fixed top-8 left-1/2 -translate-x-1/2 px-6 py-3 rounded-full text-sm font-bold flex items-center gap-3 z-50 shadow-2xl animate-in slide-in-from-top-4 \${
          msg.type === "success" ? "bg-emerald-500 text-white" : "bg-red-500 text-white"
        }\`}>
          <CheckCircle className="h-5 w-5" /> {msg.text}
        </div>
      )}

      <div className="w-full max-w-[1500px] h-[90vh] min-h-[800px] rounded-[32px] border border-white/10 bg-zinc-950 flex overflow-hidden shadow-2xl">
        
        {/* Left Control Panel */}
        <div className="w-[600px] flex flex-col border-r border-white/5 bg-zinc-950 shrink-0 relative">
          
          <div className="p-8 border-b border-white/5 flex items-start justify-between">
            <div>
              <Link href="/admin" className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors mb-4 text-sm font-medium">
                <ArrowLeft className="h-4 w-4" /> Admin Paneli
              </Link>
              <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
                <LayoutGrid className="h-7 w-7 text-neon-blue" /> Şablon Yönetimi
              </h1>
              <p className="text-sm text-zinc-400 font-medium mt-2">Sistemdeki genel ve özel şablonları yönetin.</p>
            </div>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-neon-blue hover:opacity-90 text-white text-xs font-black tracking-wider transition-all shadow-md cursor-pointer"
            >
              <Plus className="h-4 w-4" /> YENİ ŞABLON
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-8 relative no-scrollbar">
            <div className="space-y-6 animate-fadeIn">
              <div className="p-4 rounded-2xl bg-neon-blue/10 border border-neon-blue/20 flex items-start gap-3">
                <Info className="h-5 w-5 text-neon-blue shrink-0 mt-0.5" />
                <p className="text-xs text-blue-200 leading-relaxed font-medium">
                  Kullanıcılara sunduğunuz şablonlar burada listelenir. Telefon veya görsel gösterimi kullanılmaz, modern ve temiz bir liste tasarımı ile yönetebilirsiniz.
                </p>
              </div>

              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <LayoutGrid className="h-5 w-5 text-zinc-500" /> Şablon Listesi ({templates.length})
                </h3>
                {templates.length === 0 && (
                  <button onClick={handleSeed} disabled={isPending} className="text-xs text-neon-blue hover:underline">
                    10 Örnek Yükle
                  </button>
                )}
              </div>

              <div className="space-y-3">
                {templates.length === 0 ? (
                   <div className="p-8 text-center border border-dashed border-zinc-800 rounded-2xl">
                     <p className="text-zinc-500 text-sm">Henüz şablon bulunmuyor.</p>
                   </div>
                ) : templates.map(template => {
                  const firstLetter = template.name.charAt(0).toUpperCase();

                  return (
                    <div key={template.id} className="group p-3 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-between hover:border-zinc-700 transition-all hover:shadow-lg">
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
                            {template.price > 0 ? \`\${template.price} ₺\` : 'Ücretsiz'}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity pr-2">
                        <button 
                          onClick={() => handleToggleActive(template.id, template.isActive)} 
                          className={\`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-colors \${template.isActive ? 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20' : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'}\`}
                        >
                          {template.isActive ? "Aktif" : "Pasif"}
                        </button>
                        <button 
                          onClick={() => handleDelete(template.id)} 
                          className="px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-[10px] font-bold transition-colors"
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
        </div>

        {/* Right Decorative Space (No Phone Simulator) */}
        <div className="flex-1 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-black flex flex-col relative items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-tr from-neon-blue/10 via-transparent to-purple-500/5" />
          
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-neon-blue/10 blur-[150px] rounded-full pointer-events-none" />
          
          <div className="relative z-10 flex flex-col items-center opacity-40">
            <LayoutGrid className="w-32 h-32 text-zinc-800 mb-6" />
            <h2 className="text-2xl font-black tracking-widest text-zinc-700 uppercase">ŞABLON YÖNETİMİ</h2>
            <p className="text-zinc-600 mt-2 font-medium">Telefon görseli devre dışı bırakıldı.</p>
          </div>
        </div>

      </div>

      {/* Add Template Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsAddModalOpen(false)} />
          
          <div className="relative w-full max-w-xl bg-zinc-950 border border-zinc-800 rounded-[24px] p-8 shadow-2xl overflow-y-auto max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
            <button 
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-full bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="text-xl font-black text-white flex items-center gap-2 mb-8">
              <Plus className="h-6 w-6 text-neon-blue" /> YENİ ŞABLON EKLE
            </h3>

            {/* Mode Tabs */}
            <div className="flex bg-zinc-900 p-1.5 rounded-2xl border border-zinc-800 mb-6">
              <button
                type="button"
                onClick={() => setFormMode("no-code")}
                className={\`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all \${
                  formMode === "no-code"
                    ? "bg-zinc-800 text-white shadow-sm"
                    : "text-zinc-500 hover:text-white"
                }\`}
              >
                No-Code (Kodsuz)
              </button>
              <button
                type="button"
                onClick={() => setFormMode("code")}
                className={\`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all \${
                  formMode === "code"
                    ? "bg-purple-500/20 text-purple-400"
                    : "text-zinc-500 hover:text-white"
                }\`}
              >
                Advanced Code (Kodlu)
              </button>
            </div>

            <form onSubmit={handleAddTemplate} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
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

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Kategori</label>
                  <select
                    value={formData.category} onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl bg-black border border-zinc-800 text-sm focus:border-neon-blue focus:ring-1 focus:ring-neon-blue outline-none transition-all text-white"
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

              <div className="pt-6 border-t border-zinc-800 flex gap-3">
                <button type="submit" disabled={isPending} className="flex-1 py-3.5 rounded-xl bg-neon-blue hover:opacity-90 text-white text-sm font-bold transition-colors shadow-lg shadow-neon-blue/20">
                  Şablonu Oluştur
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
`;

fs.writeFileSync(path, content);
console.log('templates-client.tsx rewritten');
