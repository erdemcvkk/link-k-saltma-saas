"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import { 
  createTemplate, 
  updateTemplate, 
  deleteTemplate, 
  seedTemplates 
} from "@/app/actions";
import { 
  ArrowLeft, 
  Plus, 
  Trash2, 
  Check, 
  X, 
  Sparkles, 
  Eye, 
  Code, 
  Layout, 
  DollarSign, 
  ToggleLeft, 
  ToggleRight,
  RefreshCw,
  FolderOpen
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
  
  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditPriceOpen, setIsEditPriceOpen] = useState<string | null>(null);
  const [newPrice, setNewPrice] = useState("");
  const [isEditLinkOpen, setIsEditLinkOpen] = useState<string | null>(null);
  const [newPaymentLink, setNewPaymentLink] = useState("");

  // Form states
  const [formMode, setFormMode] = useState<"no-code" | "code">("no-code");
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "Genel",
    coverUrl: "",
    bgColor: "#09090b",
    fontStyle: "Inter",
    buttonStyle: "bg-white hover:bg-slate-100 text-slate-900 rounded-xl",
    paymentLink: "",
    customCss: "",
    configJson: "",
  });

  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    setErrorMsg("");
    setSuccessMsg("");
    startTransition(async () => {
      try {
        await updateTemplate(adminUserId, id, { isActive: !currentStatus });
        setTemplates(prev => 
          prev.map(t => t.id === id ? { ...t, isActive: !currentStatus } : t)
        );
        setSuccessMsg("Şablon durumu güncellendi!");
      } catch (err: any) {
        setErrorMsg(err.message || "Durum güncellenirken hata oluştu.");
      }
    });
  };

  const handleUpdatePrice = async (id: string) => {
    setErrorMsg("");
    setSuccessMsg("");
    if (!newPrice || isNaN(Number(newPrice))) {
      setErrorMsg("Lütfen geçerli bir fiyat girin.");
      return;
    }

    startTransition(async () => {
      try {
        await updateTemplate(adminUserId, id, { price: Number(newPrice) });
        setTemplates(prev => 
          prev.map(t => t.id === id ? { ...t, price: Number(newPrice) } : t)
        );
        setSuccessMsg("Fiyat güncellendi!");
        setIsEditPriceOpen(null);
        setNewPrice("");
      } catch (err: any) {
        setErrorMsg(err.message || "Fiyat güncellenirken hata oluştu.");
      }
    });
  };

  const handleUpdatePaymentLink = async (id: string) => {
    setErrorMsg("");
    setSuccessMsg("");
    startTransition(async () => {
      try {
        await updateTemplate(adminUserId, id, { paymentLink: newPaymentLink });
        setTemplates(prev => 
          prev.map(t => t.id === id ? { ...t, paymentLink: newPaymentLink } : t)
        );
        setSuccessMsg("Ödeme linki güncellendi!");
        setIsEditLinkOpen(null);
        setNewPaymentLink("");
      } catch (err: any) {
        setErrorMsg(err.message || "Ödeme linki güncellenirken hata oluştu.");
      }
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bu şablonu silmek istediğinize emin misiniz?")) return;
    setErrorMsg("");
    setSuccessMsg("");

    startTransition(async () => {
      try {
        await deleteTemplate(adminUserId, id);
        setTemplates(prev => prev.filter(t => t.id !== id));
        setSuccessMsg("Şablon başarıyla silindi!");
      } catch (err: any) {
        setErrorMsg(err.message || "Şablon silinirken hata oluştu.");
      }
    });
  };

  const handleSeed = async () => {
    setErrorMsg("");
    setSuccessMsg("");

    startTransition(async () => {
      try {
        const res = await seedTemplates(adminUserId);
        if (res.seeded) {
          setSuccessMsg(`Başarıyla ${res.count} adet örnek şablon veritabanına eklendi!`);
          setTimeout(() => window.location.reload(), 1500);
        } else {
          setErrorMsg(res.message || "Zaten şablonlar mevcut.");
        }
      } catch (err: any) {
        setErrorMsg(err.message || "Örnek şablonlar eklenirken hata oluştu.");
      }
    });
  };

  const handleAddTemplate = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!formData.name || !formData.price) {
      setErrorMsg("Lütfen zorunlu tüm alanları doldurun.");
      return;
    }

    startTransition(async () => {
      try {
        const result = await createTemplate(adminUserId, {
          name: formData.name,
          price: Number(formData.price),
          category: formData.category,
          coverUrl: formData.coverUrl,
          bgColor: formData.bgColor,
          fontStyle: formData.fontStyle,
          buttonStyle: formData.buttonStyle,
          paymentLink: formData.paymentLink,
          isActive: true,
          isCoded: formMode === "code",
          customCss: formMode === "code" ? formData.customCss : undefined,
          configJson: formMode === "code" ? formData.configJson : undefined,
        });

        // Add to state
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
        setSuccessMsg("Şablon başarıyla eklendi!");
        setIsAddModalOpen(false);
        setFormData({
          name: "",
          price: "",
          category: "Genel",
          coverUrl: "",
          bgColor: "#09090b",
          fontStyle: "Inter",
          buttonStyle: "bg-white hover:bg-slate-100 text-slate-900 rounded-xl",
          paymentLink: "",
          customCss: "",
          configJson: "",
        });
      } catch (err: any) {
        setErrorMsg(err.message || "Şablon eklenirken hata oluştu.");
      }
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white font-corporate p-6 max-w-7xl mx-auto space-y-8 relative">
      <GlobalOverlayManager />
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-900 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-black text-neon-blue uppercase tracking-widest mb-1.5">
            <Sparkles className="h-3 w-3" />
            Admin Panel
          </div>
          <h1 className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-neon-blue to-light-blue tracking-tight">
            ŞABLON YÖNETİMİ
          </h1>
          <p className="text-slate-400 text-xs mt-1">Sistemdeki genel ve özel şablonları yönetin.</p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin"
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs font-bold transition-all"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Admin Paneline Dön
          </Link>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-gradient-to-r from-neon-blue to-light-blue hover:opacity-90 text-white text-xs font-black tracking-wider transition-all shadow-md shadow-neon-blue/20 cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            YENİ ŞABLON EKLE
          </button>
        </div>
      </div>

      {/* Notifications */}
      {errorMsg && (
        <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold">
          {errorMsg}
        </div>
      )}
      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold">
          {successMsg}
        </div>
      )}

      {/* Empty Database Helper Seed Box */}
      {templates.length === 0 && (
        <div className="p-8 rounded-3xl bg-slate-900/30 border border-dashed border-slate-900 text-center space-y-4">
          <FolderOpen className="h-10 w-10 text-slate-500 mx-auto" />
          <h3 className="text-base font-extrabold">Henüz hiç şablon eklenmemiş!</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Sistemin başlangıçta dolu görünmesi ve test yapabilmeniz için otomatik olarak 10 adet örnek şablon oluşturabilirsiniz.
          </p>
          <button
            onClick={handleSeed}
            disabled={isPending}
            className="px-5 py-2 rounded-full bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs font-bold text-neon-blue transition-all cursor-pointer flex items-center gap-1.5 mx-auto"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isPending ? "animate-spin" : ""}`} />
            10 Örnek Şablonu Otomatik Yükle
          </button>
        </div>
      )}

      {/* Templates List */}
      {templates.length > 0 && (
        <div className="space-y-3">
          {templates.map((template) => {
            const firstLetter = template.name.charAt(0).toUpperCase();
            
            return (
              <div key={template.id} className="group p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between hover:border-slate-700 transition-all hover:shadow-lg">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-sm" style={{ background: template.bgColor || "#1e293b" }}>
                    <div className="text-white opacity-90 mix-blend-overlay font-bold text-lg">
                      {firstLetter}
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="text-sm font-bold text-white group-hover:text-neon-blue transition-colors">{template.name}</div>
                      <span className="px-2 py-0.5 rounded-full bg-slate-950 border border-slate-800 text-[9px] font-bold text-slate-400">
                        {template.category}
                      </span>
                      {template.isCoded ? (
                        <span className="px-2 py-0.5 rounded-full bg-purple-950/40 border border-purple-800 text-[9px] font-bold text-purple-300 flex items-center gap-1">
                          <Code className="h-3 w-3" /> Kodlu
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-slate-950 border border-slate-800 text-[9px] font-bold text-slate-400 flex items-center gap-1">
                          <Layout className="h-3 w-3" /> Kodsuz
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-4 mt-2">
                      <div className="text-xs font-bold text-emerald-400">
                        {isEditPriceOpen === template.id ? (
                          <div className="flex items-center gap-1.5 inline-flex">
                            <input
                              type="text"
                              value={newPrice}
                              onChange={(e) => setNewPrice(e.target.value)}
                              className="w-14 px-1.5 py-0.5 rounded bg-slate-950 border border-slate-800 text-xs font-semibold focus:outline-none focus:border-neon-blue text-white"
                            />
                            <button onClick={() => handleUpdatePrice(template.id)} className="p-0.5 rounded bg-neon-blue text-white hover:opacity-90">
                              <Check className="h-3 w-3" />
                            </button>
                            <button onClick={() => setIsEditPriceOpen(null)} className="p-0.5 rounded bg-slate-800 text-slate-400 hover:text-white">
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ) : (
                          <span onClick={() => { setIsEditPriceOpen(template.id); setNewPrice(String(template.price)); }} className="cursor-pointer hover:underline">
                            {template.price} ₺
                          </span>
                        )}
                      </div>
                      
                      {template.price > 0 && (
                        <div className="text-xs text-slate-400">
                          {isEditLinkOpen === template.id ? (
                            <div className="flex items-center gap-1.5 inline-flex">
                              <input
                                type="text"
                                value={newPaymentLink}
                                onChange={(e) => setNewPaymentLink(e.target.value)}
                                className="w-24 px-1.5 py-0.5 rounded bg-slate-950 border border-slate-800 text-[10px] font-semibold focus:outline-none focus:border-neon-blue text-white"
                              />
                              <button onClick={() => handleUpdatePaymentLink(template.id)} className="p-0.5 rounded bg-neon-blue text-white hover:opacity-90">
                                <Check className="h-3 w-3" />
                              </button>
                              <button onClick={() => setIsEditLinkOpen(null)} className="p-0.5 rounded bg-slate-800 text-slate-400 hover:text-white">
                                <X className="h-3 w-3" />
                              </button>
                            </div>
                          ) : (
                            <span onClick={() => { setIsEditLinkOpen(template.id); setNewPaymentLink(template.paymentLink || ""); }} className="cursor-pointer hover:underline flex items-center gap-1">
                              <DollarSign className="h-3 w-3" />
                              {template.paymentLink ? "Link Aktif" : "Link Ekle"}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity pr-2">
                  <button
                    onClick={() => handleToggleActive(template.id, template.isActive)}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white transition-colors flex items-center gap-1.5 text-xs font-bold"
                  >
                    {template.isActive ? <ToggleRight className="h-4 w-4 text-emerald-400" /> : <ToggleLeft className="h-4 w-4 text-slate-400" />}
                    {template.isActive ? "Aktif" : "Pasif"}
                  </button>
                  <button
                    onClick={() => handleDelete(template.id)}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Template Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsAddModalOpen(false)} />
          
          <div className="relative w-full max-w-xl bg-slate-950 border border-slate-800 rounded-3xl p-6 shadow-2xl overflow-y-auto max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
            <button 
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>

            <h3 className="text-xl font-black bg-clip-text text-transparent bg-gradient-to-r from-neon-blue to-light-blue tracking-tight mb-6">
              YENİ ŞABLON EKLE
            </h3>

            {/* Mode Tabs */}
            <div className="flex bg-slate-900 p-1.5 rounded-2xl border border-slate-850 mb-6">
              <button
                type="button"
                onClick={() => setFormMode("no-code")}
                className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                  formMode === "no-code"
                    ? "bg-slate-950 border border-slate-800 text-white shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                No-Code (Kodsuz)
              </button>
              <button
                type="button"
                onClick={() => setFormMode("code")}
                className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                  formMode === "code"
                    ? "bg-purple-900/30 border border-purple-800/40 text-purple-300"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Advanced Code (Kodlu)
              </button>
            </div>

            <form onSubmit={handleAddTemplate} className="space-y-4 text-left">
              <div className="grid grid-cols-2 gap-4">
                {/* Name */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Şablon Adı *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="örn: Cyberpunk Glow"
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold focus:outline-none focus:border-neon-blue"
                  />
                </div>

                {/* Price */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Fiyat (₺) *</label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                    placeholder="örn: 149"
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold focus:outline-none focus:border-neon-blue"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Category */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Kategori</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold focus:outline-none focus:border-neon-blue"
                  >
                    <option value="Genel">Genel</option>
                    <option value="Gamer">Gamer</option>
                    <option value="Kreatör">Kreatör</option>
                    <option value="Müzisyen">Müzisyen</option>
                    <option value="Kurumsal">Kurumsal</option>
                    <option value="Yazar">Yazar</option>
                  </select>
                </div>


              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Background (Color Picker or text input) */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Arka Plan Rengi / Gradiyent</label>
                  <input
                    type="text"
                    value={formData.bgColor}
                    onChange={(e) => setFormData(prev => ({ ...prev, bgColor: e.target.value }))}
                    placeholder="#09090b veya linear-gradient(...)"
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold focus:outline-none focus:border-neon-blue"
                  />
                </div>

                {/* Font Style */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Yazı Tipi (Font)</label>
                  <select
                    value={formData.fontStyle}
                    onChange={(e) => setFormData(prev => ({ ...prev, fontStyle: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold focus:outline-none focus:border-neon-blue"
                  >
                    <option value="Inter">Inter</option>
                    <option value="Roboto">Roboto</option>
                    <option value="Arial">Arial</option>
                    <option value="Courier New">Courier New</option>
                    <option value="Georgia">Georgia</option>
                    <option value="Impact">Impact</option>
                  </select>
                </div>
              </div>

              {/* Button Style selector */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Buton Stili Sınıfları (Tailwind/CSS)</label>
                <input
                  type="text"
                  value={formData.buttonStyle}
                  onChange={(e) => setFormData(prev => ({ ...prev, buttonStyle: e.target.value }))}
                  placeholder="örn: bg-white text-slate-900 border border-pink-200 rounded-full shadow-lg"
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold focus:outline-none focus:border-neon-blue"
                />
              </div>

              {/* Payment Link */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Ödeme Linki (Shopier / Stripe vb.)</label>
                <input
                  type="url"
                  value={formData.paymentLink}
                  onChange={(e) => setFormData(prev => ({ ...prev, paymentLink: e.target.value }))}
                  placeholder="https://shopier.com/..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold focus:outline-none focus:border-neon-blue text-white"
                />
              </div>

              {/* CODED SPECIFIC FIELDS */}
              {formMode === "code" && (
                <>
                  {/* Custom CSS */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] font-black text-purple-400 uppercase tracking-wider block">Özel CSS (Custom CSS)</label>
                      <span className="text-[9px] text-slate-500">.profile-card, .btn-link vb. sınıfları hedefleyin</span>
                    </div>
                    <textarea
                      value={formData.customCss}
                      onChange={(e) => setFormData(prev => ({ ...prev, customCss: e.target.value }))}
                      placeholder=".btn-link { border: 2px solid #a855f7; border-radius: 99px; }"
                      rows={4}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  {/* JSON Config */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-purple-400 uppercase tracking-wider block">JSON Konfigürasyonu (İsteğe Bağlı)</label>
                    <textarea
                      value={formData.configJson}
                      onChange={(e) => setFormData(prev => ({ ...prev, configJson: e.target.value }))}
                      placeholder='{ "glowColor": "#ec4899", "accent": "#a855f7" }'
                      rows={3}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </>
              )}

              {/* Submit Area */}
              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-900">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-850 text-xs font-bold cursor-pointer"
                >
                  Vazgeç
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-neon-blue to-light-blue hover:opacity-95 text-white text-xs font-black tracking-wider transition-all cursor-pointer"
                >
                  Şablonu Yayınla
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
}
