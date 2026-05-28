"use client";

import React, { useState, useTransition } from "react";
import { saveAddonConfig } from "@/app/actions";
import { X, Loader2, Save, Store, Calendar, FileQuestion, Mail, Heart, Clock, Briefcase, HelpCircle, MapPin, MessageCircle } from "lucide-react";
import { toast } from "react-hot-toast";

interface AddonConfigModalProps {
  addon: {
    id: string;
    addonType: string;
    isActive: boolean;
    config: string | null;
  };
  onClose: () => void;
  lang: string;
}

export default function AddonConfigModal({ addon, onClose, lang }: AddonConfigModalProps) {
  const [isPending, startTransition] = useTransition();
  
  // Parse initial config safely
  const initialConfig = React.useMemo(() => {
    if (!addon.config) return {};
    try {
      return JSON.parse(addon.config);
    } catch (e) {
      return {};
    }
  }, [addon.config]);

  const [configData, setConfigData] = useState<Record<string, any>>(initialConfig);

  const handleSave = () => {
    startTransition(async () => {
      try {
        await saveAddonConfig(addon.id, JSON.stringify(configData));
        toast.success(lang === "tr" ? "Eklenti ayarları kaydedildi" : "Add-on settings saved");
        onClose();
      } catch (err: any) {
        toast.error(err.message || "Error");
      }
    });
  };

  const updateConfig = (key: string, value: any) => {
    setConfigData(prev => ({ ...prev, [key]: value }));
  };

  const getAddonTitleIcon = (type: string) => {
    switch(type) {
      case "MINI_STORE": return { icon: <Store className="h-5 w-5 text-orange-500" />, title: lang === "tr" ? "Mağaza Ayarları" : "Store Settings" };
      case "BOOKING": return { icon: <Calendar className="h-5 w-5 text-zinc-800" />, title: lang === "tr" ? "Randevu Ayarları" : "Booking Settings" };
      case "QA": return { icon: <FileQuestion className="h-5 w-5 text-indigo-500" />, title: lang === "tr" ? "Soru & Cevap Ayarları" : "Q&A Settings" };
      case "NEWSLETTER": return { icon: <Mail className="h-5 w-5 text-emerald-500" />, title: lang === "tr" ? "Bülten Ayarları" : "Newsletter Settings" };
      case "DONATION": return { icon: <Heart className="h-5 w-5 text-rose-500" />, title: lang === "tr" ? "Bağış Ayarları" : "Donation Settings" };
      case "COUNTDOWN": return { icon: <Clock className="h-5 w-5 text-purple-500" />, title: lang === "tr" ? "Geri Sayım Ayarları" : "Countdown Settings" };
      case "PORTFOLIO": return { icon: <Briefcase className="h-5 w-5 text-blue-500" />, title: lang === "tr" ? "Portfolyo Ayarları" : "Portfolio Settings" };
      case "FAQ": return { icon: <HelpCircle className="h-5 w-5 text-teal-500" />, title: lang === "tr" ? "SSS Ayarları" : "FAQ Settings" };
      case "MAP": return { icon: <MapPin className="h-5 w-5 text-green-500" />, title: lang === "tr" ? "Harita Ayarları" : "Map Settings" };
      case "WHATSAPP": return { icon: <MessageCircle className="h-5 w-5 text-emerald-400" />, title: lang === "tr" ? "WhatsApp Ayarları" : "WhatsApp Settings" };
      default: return { icon: <Store className="h-5 w-5 text-zinc-500" />, title: lang === "tr" ? "Ayarlar" : "Settings" };
    }
  };

  const { icon, title } = getAddonTitleIcon(addon.addonType);

  // Reusable Field Inputs
  const renderInput = (key: string, label: string, placeholder: string, type: "text" | "color" | "number" = "text") => (
    <div className="space-y-1.5" key={key}>
      <label className="text-xs font-semibold uppercase tracking-wider block text-zinc-500">{label}</label>
      <input
        type={type}
        value={configData[key] || ""}
        onChange={(e) => updateConfig(key, e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-zinc-100 text-zinc-900 focus:border-rose-500/50 outline-none text-xs transition-colors"
      />
    </div>
  );

  const renderTextarea = (key: string, label: string, placeholder: string) => (
    <div className="space-y-1.5" key={key}>
      <label className="text-xs font-semibold uppercase tracking-wider block text-zinc-500">{label}</label>
      <textarea
        value={configData[key] || ""}
        onChange={(e) => updateConfig(key, e.target.value)}
        placeholder={placeholder}
        rows={3}
        className="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-zinc-100 text-zinc-900 focus:border-rose-500/50 outline-none text-xs transition-colors resize-none"
      />
    </div>
  );

  const renderToggle = (key: string, label: string) => (
    <div className="flex items-center justify-between p-4 rounded-xl border border-zinc-200 bg-zinc-50" key={key}>
      <span className="text-sm font-bold text-zinc-900">{label}</span>
      <button
        onClick={() => updateConfig(key, !configData[key])}
        className={`w-12 h-6 rounded-full transition-colors relative ${configData[key] ? 'bg-emerald-500' : 'bg-zinc-300'}`}
      >
        <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${configData[key] ? 'left-7' : 'left-1'}`} />
      </button>
    </div>
  );

  const renderFaqEditor = () => {
    const faqs = configData.faqs || [{ q: "", a: "" }];
    
    const updateFaq = (index: number, field: "q" | "a", val: string) => {
      const newFaqs = [...faqs];
      newFaqs[index][field] = val;
      updateConfig("faqs", newFaqs);
    };

    const addFaq = () => {
      updateConfig("faqs", [...faqs, { q: "", a: "" }]);
    };

    return (
      <div className="space-y-4">
        {faqs.map((faq: any, i: number) => (
          <div key={i} className="p-4 rounded-xl border border-zinc-200 bg-zinc-50 space-y-3">
            <input
              type="text"
              value={faq.q}
              onChange={(e) => updateFaq(i, "q", e.target.value)}
              placeholder={lang === "tr" ? "Soru..." : "Question..."}
              className="w-full px-3 py-2 rounded-lg border border-zinc-200 text-xs"
            />
            <textarea
              value={faq.a}
              onChange={(e) => updateFaq(i, "a", e.target.value)}
              placeholder={lang === "tr" ? "Cevap..." : "Answer..."}
              rows={2}
              className="w-full px-3 py-2 rounded-lg border border-zinc-200 text-xs resize-none"
            />
          </div>
        ))}
        <button onClick={addFaq} className="text-xs font-bold text-rose-500 hover:text-rose-600">
          + {lang === "tr" ? "Yeni Soru Ekle" : "Add Question"}
        </button>
      </div>
    );
  };

  // Switch fields dynamically
  const renderFields = () => {
    switch(addon.addonType) {
      case "MINI_STORE":
        return (
          <>
            {renderInput("storeTitle", lang === "tr" ? "Mağaza Başlığı" : "Store Title", lang === "tr" ? "Premium İçeriklerim" : "My Premium Content")}
            {renderInput("currency", lang === "tr" ? "Para Birimi Sembolü" : "Currency Symbol", "₺, $, €")}
            {renderInput("themeColor", lang === "tr" ? "Tema Rengi (HEX)" : "Theme Color (HEX)", "#FF5733")}
            {renderTextarea("customData", lang === "tr" ? "Ürün Verisi (JSON)" : "Product Data (JSON)", "[{\"id\":1, \"name\":\"Urun\"}]")}
          </>
        );
      case "BOOKING":
        return (
          <>
            {renderInput("calendarUrl", lang === "tr" ? "Takvim Linki (Calendly vb.)" : "Calendar URL", "https://calendly.com/yourname")}
            {renderInput("title", lang === "tr" ? "Randevu Başlığı" : "Booking Title", lang === "tr" ? "Birebir Danışmanlık" : "1-on-1 Consultation")}
            {renderTextarea("description", lang === "tr" ? "Açıklama" : "Description", lang === "tr" ? "Benimle bir toplantı ayarlayın." : "Book a meeting with me.")}
            {renderInput("themeColor", lang === "tr" ? "Tema Rengi (HEX)" : "Theme Color (HEX)", "#000000")}
          </>
        );
      case "QA":
        return (
          <>
            {renderInput("title", lang === "tr" ? "Kutu Başlığı" : "Box Title", lang === "tr" ? "Bana Soru Sor!" : "Ask me anything!")}
            {renderToggle("allowAnonymous", lang === "tr" ? "Anonim Sorulara İzin Ver" : "Allow Anonymous Questions")}
          </>
        );
      case "NEWSLETTER":
        return (
          <>
            {renderInput("title", lang === "tr" ? "Bülten Başlığı" : "Newsletter Title", lang === "tr" ? "Haftalık Bültenime Katıl" : "Join my newsletter")}
            {renderInput("actionUrl", lang === "tr" ? "Form Aksiyon Linki (Mailchimp)" : "Form Action URL", "https://mailchimp...")}
            {renderInput("buttonText", lang === "tr" ? "Abone Ol Buton Yazısı" : "Subscribe Button Text", lang === "tr" ? "Abone Ol" : "Subscribe")}
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
              <label className="text-xs font-semibold uppercase tracking-wider block text-zinc-500 mb-2">
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
          <div className="p-4 bg-zinc-100 text-zinc-600 rounded-xl text-sm text-center">
            {lang === "tr" ? "Bu eklenti için özel ayar bulunmuyor." : "No specific settings for this add-on."}
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-zinc-100 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-zinc-100/80">
              {icon}
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900">{title}</h3>
              <p className="text-[10px] font-bold text-emerald-500 mt-0.5 uppercase tracking-wider">
                {lang === "tr" ? "Eklenti Ayarları" : "Addon Settings"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-zinc-100 text-zinc-400 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-6 overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-200">
          {renderFields()}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-zinc-100 bg-zinc-50 shrink-0">
          <button
            onClick={handleSave}
            disabled={isPending}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:bg-zinc-400 text-white font-extrabold text-sm transition-colors shadow-lg shadow-slate-900/20"
          >
            {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {lang === "tr" ? "Ayarları Kaydet" : "Save Settings"}
          </button>
        </div>
      </div>
    </div>
  );
}
