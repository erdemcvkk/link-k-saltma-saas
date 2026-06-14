"use client";

import React, { useState } from "react";
import Link from "next/link";
import { HelpCircle, ArrowLeft, ChevronDown, Search, BookOpen, Key, DollarSign, Puzzle } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQCategory {
  title: string;
  icon: React.ComponentType<any>;
  items: FAQItem[];
}

const FAQ_DATA: FAQCategory[] = [
  {
    title: "Hesap & Üyelik",
    icon: Key,
    items: [
      {
        question: "Hesabımı nasıl açarım?",
        answer: "Ana sayfada bulunan 'Ücretsiz Başla' veya 'Hemen Üye Ol' butonuna tıklayarak e-posta adresinizle saniyeler içinde kaydolabilirsiniz. Clerk güvencesiyle hızlı giriş yapabilirsiniz."
      },
      {
        question: "Kullanıcı adımı sonradan değiştirebilir miyim?",
        answer: "Evet! Yönetim panelinizdeki 'Profil Editörü' sekmesinden istediğiniz zaman benzersiz ve boşta olan yeni bir kullanıcı adı belirleyebilirsiniz. Değişiklik anında profil linkinize yansır."
      }
    ]
  },
  {
    title: "Özelleştirme & Tasarım",
    icon: BookOpen,
    items: [
      {
        question: "Profil özelleştirmelerini nasıl yaparım?",
        answer: "Panelinizdeki 'Link & Tema Editörü' sekmesinden arka plan renginizi, yazı tipinizi (font), buton şekillerini ve link animasyonlarını canlı simülatör eşliğinde kolayca değiştirebilirsiniz."
      },
      {
        question: "Özel şablonları nasıl kullanabilirim?",
        answer: "Sistemde yer alan ücretsiz veya premium hazır şablonlardan birini seçerek profilinize uygulayabilirsiniz. Premium şablonları tek seferlik ödeme ile kalıcı olarak profilinize tanımlayabilirsiniz."
      }
    ]
  },
  {
    title: "Abonelik & Ödemeler",
    icon: DollarSign,
    items: [
      {
        question: "Aboneliğimi nasıl iptal edebilirim?",
        answer: "Yönetim panelinizde yer alan 'Planlar & Faturalar' sekmesinden mevcut aboneliğinizi dilediğiniz zaman tek tıkla iptal edebilirsiniz. İptal sonrasında dönem sonuna kadar premium özellikleri kullanmaya devam edersiniz."
      },
      {
        question: "İade politikanız nedir?",
        answer: "Clinkor premium planları ve eklentileri dijital olarak anında teslim edilen servisler olduğu için yasal mevzuat gereğince (Mesafeli Sözleşmeler Yönetmeliği m.15) iade yapılamamaktadır. Ancak aboneliğinizi sonlandırarak sonraki dönemlerde çekim yapılmasını engelleyebilirsiniz."
      }
    ]
  },
  {
    title: "Eklentiler & Domain",
    icon: Puzzle,
    items: [
      {
        question: "Eklenti (Add-on) nedir ve nasıl eklenir?",
        answer: "Eklentiler, profilinize 'Müzik Oynatıcı', 'Bento Seyahat Vitrini', 'Dijital Mağaza' gibi ekstra işlevsel alanlar eklemenizi sağlar. 'Eklentilerim' sekmesinden istediğiniz modülü satın alıp aktif edebilirsiniz."
      },
      {
        question: "Kendi özel alan adımı (domain) bağlayabilir miyim?",
        answer: "Evet, premium planlarımız kapsamında 'SEO & Domain Ayarları' sekmesinden kendi özel alan adınızı (örn: link.siteniz.com) DNS CNAME yönlendirmesi yaparak Clinkor profilinize tanımlayabilirsiniz."
      }
    ]
  }
];

export default function YardimPage() {
  const [openIndex, setOpenIndex] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const toggleFAQ = (catIndex: number, itemIndex: number) => {
    const key = `${catIndex}-${itemIndex}`;
    setOpenIndex(openIndex === key ? null : key);
  };

  const filteredCategories = FAQ_DATA.map((category, catIdx) => {
    const filteredItems = category.items.filter(
      (item) =>
        item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.answer.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return { ...category, items: filteredItems, catIdx };
  }).filter((category) => category.items.length > 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 pb-16">
      {/* Hero Header */}
      <div className="bg-white border-b border-zinc-100 shadow-sm">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="flex items-center gap-3 mb-4">
            <Link
              href="/"
              className="flex items-center gap-1.5 text-xs font-bold text-zinc-400 hover:text-emerald-500 transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Ana Sayfa
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-500">
              <HelpCircle className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-zinc-900 tracking-tight">
                Yardım & Destek Merkezi
              </h1>
              <p className="text-xs text-zinc-400 font-semibold mt-0.5">
                Clinkor hakkında merak ettiğiniz tüm soruların yanıtları
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="max-w-4xl mx-auto px-6 mt-12">
        <div className="relative">
          <Search className="absolute left-4 top-3.5 h-5 w-5 text-zinc-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Sorunuzu arayın... (örn: iade, domain, hesap)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white border border-zinc-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none text-sm font-semibold shadow-sm transition-all"
          />
        </div>
      </div>

      {/* FAQ Categories & Accordions */}
      <div className="max-w-4xl mx-auto px-6 mt-8 space-y-8">
        {filteredCategories.length === 0 ? (
          <div className="bg-white rounded-3xl border border-zinc-100 shadow-sm p-12 text-center">
            <p className="text-zinc-500 font-semibold">Aramanıza uygun bir soru bulunamadı. Lütfen başka anahtar kelimeler deneyin.</p>
          </div>
        ) : (
          filteredCategories.map((category) => {
            const Icon = category.icon;
            return (
              <div key={category.title} className="bg-white rounded-3xl border border-zinc-100 shadow-sm p-6 md:p-8 space-y-4">
                <div className="flex items-center gap-3 border-b border-zinc-50 pb-4">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <Icon className="h-4 w-4" />
                  </div>
                  <h2 className="text-lg font-black text-zinc-900">{category.title}</h2>
                </div>

                <div className="space-y-3">
                  {category.items.map((item, itemIdx) => {
                    const key = `${category.catIdx}-${itemIdx}`;
                    const isOpen = openIndex === key;
                    return (
                      <div
                        key={item.question}
                        className="border border-zinc-100 rounded-2xl overflow-hidden transition-all duration-200"
                      >
                        <button
                          onClick={() => toggleFAQ(category.catIdx, itemIdx)}
                          className="w-full px-5 py-4 flex items-center justify-between gap-4 text-left font-bold text-zinc-800 hover:text-emerald-600 hover:bg-zinc-50/50 transition-colors cursor-pointer"
                        >
                          <span className="text-sm">{item.question}</span>
                          <ChevronDown
                            className={`h-4 w-4 text-zinc-400 shrink-0 transition-transform duration-200 ${
                              isOpen ? "rotate-180 text-emerald-500" : ""
                            }`}
                          />
                        </button>
                        <div
                          className={`transition-all duration-300 ease-in-out overflow-hidden ${
                            isOpen ? "max-h-96 border-t border-zinc-50" : "max-h-0"
                          }`}
                        >
                          <div className="px-5 py-4 text-sm text-zinc-600 bg-zinc-50/30 leading-relaxed">
                            {item.answer}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer Support Note */}
      <div className="max-w-4xl mx-auto px-6 mt-12 text-center space-y-3">
        <p className="text-xs text-zinc-400 font-semibold">
          Aradığınız cevabı bulamadınız mı?
        </p>
        <p className="text-sm">
          Bize doğrudan yazın:{" "}
          <a href="mailto:support@clinkor.com" className="text-emerald-600 font-bold hover:underline">
            support@clinkor.com
          </a>
        </p>
      </div>
    </div>
  );
}
