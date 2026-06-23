"use client";

import React, { useState } from 'react';
import { Plus, Edit2, Trash2, LayoutGrid, ArrowLeft } from 'lucide-react';
import TemplateEditor from './template-editor';
import { deleteTemplate } from '@/app/actions';

interface Template {
  id: string;
  name: string;
  price: number;
  category: string;
  bgColor: string;
  isActive: boolean;
  isComingSoon: boolean;
  [key: string]: any;
}

interface TemplateManagerProps {
  adminUserId: string;
  initialTemplates: Template[];
}

export default function TemplateManager({ adminUserId, initialTemplates }: TemplateManagerProps) {
  const [view, setView] = useState<'list' | 'editor'>('list');
  const [templates, setTemplates] = useState<Template[]>(initialTemplates);
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);

  const handleCreateNew = () => {
    setEditingTemplate(null);
    setView('editor');
  };

  const handleEdit = (template: Template) => {
    setEditingTemplate(template);
    setView('editor');
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bu şablonu tamamen silmek istediğinize emin misiniz? Bu işlem geri alınamaz.')) return;
    
    try {
      await deleteTemplate(adminUserId, id);
      setTemplates(prev => prev.filter(t => t.id !== id));
    } catch (err: any) {
      alert("Şablon silinirken hata oluştu: " + err.message);
    }
  };

  const handleSaveSuccess = (savedTemplate: Template) => {
    if (editingTemplate) {
      setTemplates(prev => prev.map(t => t.id === savedTemplate.id ? savedTemplate : t));
    } else {
      setTemplates(prev => [savedTemplate, ...prev]);
    }
    setView('list');
  };

  if (view === 'editor') {
    const categories = Array.from(
      new Set(
        templates
          .map(t => t.category || "Genel")
          .filter((cat): cat is string => typeof cat === 'string' && cat.trim() !== '')
      )
    );

    return (
      <TemplateEditor 
        adminUserId={adminUserId}
        initialTemplate={editingTemplate}
        existingCategories={categories}
        onBack={() => setView('list')}
        onSaveSuccess={handleSaveSuccess}
      />
    );
  }

  return (
    <div className="flex flex-col h-screen bg-zinc-950 text-zinc-100 p-8 overflow-y-auto no-scrollbar selection:bg-indigo-500/30">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
        <div>
          <button 
            onClick={() => window.history.back()} 
            className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors mb-4 text-xs font-bold uppercase tracking-wider"
          >
            <ArrowLeft className="w-4 h-4" /> Admin Paneli
          </button>
          <h1 className="text-3xl font-black flex items-center gap-3 text-white tracking-tight">
            <LayoutGrid className="w-8 h-8 text-indigo-500" /> Şablon Yönetimi
          </h1>
          <p className="text-zinc-500 font-medium mt-2">Mağaza vitrinini ve sistem şablonlarını Zen Mode konforuyla yönetin.</p>
        </div>
        <button 
          onClick={handleCreateNew} 
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-indigo-600/20 active:scale-95 cursor-pointer"
        >
          <Plus className="w-5 h-5" /> YENİ ŞABLON OLUŞTUR
        </button>
      </div>

      {/* TEMPLATES GRID */}
      {templates.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-zinc-800 rounded-3xl">
          <LayoutGrid className="w-12 h-12 text-zinc-700 mb-4" />
          <h3 className="text-xl font-bold text-zinc-400">Henüz hiç şablon yok</h3>
          <p className="text-zinc-600 mt-2">Sistemde oluşturulmuş bir şablon bulunmuyor.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-in fade-in duration-500">
          {templates.map(t => (
            <div 
              key={t.id} 
              className="bg-zinc-900/40 border border-zinc-800/80 rounded-[2rem] p-6 flex flex-col hover:border-indigo-500/50 hover:bg-zinc-900/80 transition-all duration-300 group shadow-xl"
            >
              <div className="flex justify-between items-start mb-6">
                <div 
                  className="w-16 h-16 rounded-2xl flex items-center justify-center font-black text-2xl shadow-inner border border-white/5" 
                  style={{ backgroundColor: t.bgColor || '#18181b', color: '#ffffff' }}
                >
                  {t.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-all">
                  <button 
                    onClick={() => handleEdit(t)} 
                    className="p-2.5 bg-zinc-800 hover:bg-indigo-500 hover:text-white rounded-xl text-zinc-400 transition-colors cursor-pointer shadow-sm"
                    title="Düzenle"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleDelete(t.id)} 
                    className="p-2.5 bg-zinc-800 hover:bg-rose-500 hover:text-white rounded-xl text-zinc-400 transition-colors cursor-pointer shadow-sm"
                    title="Sil"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <h3 className="text-lg font-bold text-white mb-1 truncate" title={t.name}>{t.name}</h3>
              <p className="text-xs font-semibold text-zinc-500 mb-6 uppercase tracking-wider">{t.category}</p>
              
              <div className="flex items-center justify-between mt-auto pt-5 border-t border-zinc-800/60">
                <div className="flex gap-2">
                  {t.isActive && !t.isComingSoon && (
                    <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-400 text-[10px] font-black tracking-wider rounded-lg border border-emerald-500/20">AKTİF</span>
                  )}
                  {t.isComingSoon && (
                    <span className="px-2.5 py-1 bg-amber-500/10 text-amber-400 text-[10px] font-black tracking-wider rounded-lg border border-amber-500/20">YAKINDA</span>
                  )}
                  {!t.isActive && (
                    <span className="px-2.5 py-1 bg-rose-500/10 text-rose-400 text-[10px] font-black tracking-wider rounded-lg border border-rose-500/20">PASİF</span>
                  )}
                </div>
                <div className="font-black text-indigo-400 text-sm tracking-tight">
                  {t.price === 0 ? 'ÜCRETSİZ' : `₺${t.price}`}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
