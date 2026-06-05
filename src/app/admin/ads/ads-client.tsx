"use client";

import React, { useState, useTransition } from "react";
import { ArrowLeft, Save, Code, Image as ImageIcon, AlertCircle, Sparkles, ExternalLink, ShieldCheck, CheckCircle2 } from "lucide-react";
import { saveSystemSettings } from "@/app/actions";

interface SystemSettingsData {
  id: string;
  adScript: string;
  customImageUrl: string;
  customTargetUrl: string;
  isActive: boolean;
}

interface AdsClientProps {
  adminUserId: string;
  initialSettings: SystemSettingsData;
}

export default function AdsClient({ adminUserId, initialSettings }: AdsClientProps) {
  const [adScript, setAdScript] = useState(initialSettings.adScript);
  const [customImageUrl, setCustomImageUrl] = useState(initialSettings.customImageUrl);
  const [customTargetUrl, setCustomTargetUrl] = useState(initialSettings.customTargetUrl);
  const [isActive, setIsActive] = useState(initialSettings.isActive);

  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<{ type: "success" | "error" | null; message: string }>({
    type: null,
    message: "",
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ type: null, message: "" });

    startTransition(async () => {
      try {
        const res = await saveSystemSettings(
          adminUserId,
          adScript || null,
          customImageUrl || null,
          customTargetUrl || null,
          isActive
        );

        if (res) {
          setStatus({
            type: "success",
            message: "Reklam ayarları başarıyla kaydedildi.",
          });
          // Auto clear success message after 3 seconds
          setTimeout(() => {
            setStatus({ type: null, message: "" });
          }, 3000);
        } else {
          setStatus({
            type: "error",
            message: "Ayarlar kaydedilirken bir hata oluştu.",
          });
        }
      } catch (err: any) {
        setStatus({
          type: "error",
          message: err.message || "Bir sunucu hatası oluştu.",
        });
      }
    });
  };

  return (
    <div className="min-h-screen bg-black text-zinc-200 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Üst Kısım / Geri Dönüş */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800 pb-6">
          <div className="space-y-1">
            <a 
              href="/admin" 
              className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-white transition-colors group mb-2"
            >
              <ArrowLeft className="h-3.5 w-3.5 group-hover:-translate-x-0.5 transition-transform" />
              Admin Paneline Dön
            </a>
            <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-teal-400" />
              Reklam Yönetim Alanı
            </h1>
            <p className="text-xs text-zinc-400">
              Ücretsiz (FREE) paketteki tüm kullanıcı profillerinde ve QR Oluşturucu (/qr-olusturucu) sayfasında yayınlanacak global reklamları yönetin.
            </p>
          </div>

          {/* Global Aktif/Pasif Toggle Switch */}
          <div className="flex items-center gap-3 bg-zinc-950 border border-zinc-800/80 p-3 rounded-2xl shrink-0">
            <div className="space-y-0.5">
              <span className="text-xs font-bold block text-white">Global Reklam Yayını</span>
              <span className="text-[10px] text-zinc-500 block">Tüm reklama kapalı profilleri etkiler</span>
            </div>
            <button
              type="button"
              onClick={() => setIsActive(!isActive)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                isActive ? "bg-teal-500" : "bg-zinc-800"
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  isActive ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        </div>

        {/* Form Alanı */}
        <form onSubmit={handleSave} className="space-y-6">
          
          {/* Bölüm 1: Script Entegrasyonu (AdSense) */}
          <div className="bg-zinc-950 border border-zinc-900 rounded-3xl p-5 md:p-6 space-y-4 shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-teal-500/5 rounded-full blur-2xl pointer-events-none" />
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-2xl bg-teal-950/30 text-teal-400 flex items-center justify-center border border-teal-500/20">
                <Code className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-white">Google AdSense / Harici Script Kodu</h3>
                <p className="text-[10px] text-zinc-500">Platforma entegre etmek istediğiniz reklam JS kodunu girin.</p>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-400 block">HTML / Javascript Kodu</label>
              <textarea
                value={adScript}
                onChange={(e) => setAdScript(e.target.value)}
                placeholder="<!-- Google AdSense Code -->&#10;<script async src='https://pagead2.googlesyndication.com/...'></script>"
                rows={6}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-4 text-xs font-mono text-emerald-400 focus:outline-none focus:border-teal-500 transition-colors focus:ring-1 focus:ring-teal-500/20 placeholder-zinc-700"
              />
              <div className="flex items-start gap-2 text-[10px] text-zinc-500 bg-zinc-900/40 p-3 rounded-xl border border-zinc-800/20">
                <AlertCircle className="h-4 w-4 text-zinc-400 shrink-0" />
                <span>
                  <strong>Not:</strong> Bu alana eklenen script kodu, önizleme çerçevesinde veya canlı sayfada güvenlik denetimleri (`dangerouslySetInnerHTML`) ile render edilecektir. Script girdikten sonra yedek görsel ayarlarına ihtiyaç duyulmaz ancak boş bırakılırsa yedek banner devralacaktır.
                </span>
              </div>
            </div>
          </div>

          {/* Bölüm 2: Özel Banner (Yedek Plan) */}
          <div className="bg-zinc-950 border border-zinc-900 rounded-3xl p-5 md:p-6 space-y-4 shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-full blur-2xl pointer-events-none" />
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-2xl bg-purple-950/30 text-purple-400 flex items-center justify-center border border-purple-500/20">
                <ImageIcon className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-white">Özel Görsel Banner (Alternatif)</h3>
                <p className="text-[10px] text-zinc-500">Eğer yukarıda bir script girilmediyse gösterilecek olan özel görsel reklam. Bu reklam ücretsiz profillerde yatay banner, QR Oluşturucu sayfasında ise yanlarda dikey gökdelen (skyscraper) reklamı olarak gösterilir.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-400 block">Banner Görsel URL'si</label>
                <input
                  type="url"
                  value={customImageUrl}
                  onChange={(e) => setCustomImageUrl(e.target.value)}
                  placeholder="https://example.com/banner.jpg"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-purple-500 transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-400 block">Hedef Yönlendirme URL'si</label>
                <input
                  type="url"
                  value={customTargetUrl}
                  onChange={(e) => setCustomTargetUrl(e.target.value)}
                  placeholder="https://hedefsite.com/kampanya"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-purple-500 transition-colors"
                />
              </div>
            </div>

            {/* Önizleme Alanı */}
            {customImageUrl && (
              <div className="mt-4 p-4 bg-zinc-900/30 rounded-2xl border border-zinc-800/40 space-y-2">
                <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider block">Görsel Önizlemesi</span>
                <div className="relative rounded-xl overflow-hidden border border-zinc-800 aspect-[5/1] bg-black max-w-md">
                  <img 
                    src={customImageUrl} 
                    alt="Banner Önizleme" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                  <div className="absolute top-1 right-2 bg-black/60 text-[8px] text-zinc-400 px-1 py-0.5 rounded border border-zinc-500/20">
                    AD / Reklam
                  </div>
                  {customTargetUrl && (
                    <a 
                      href={customTargetUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 text-white text-xs font-bold"
                    >
                      Hedefe Git <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Feedback & Kaydet Butonu */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-zinc-950 border border-zinc-900 p-4 rounded-3xl">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-teal-400 shrink-0" />
              <span className="text-[10px] text-zinc-500">
                Güvenli Admin Paneli. Değişiklikler anında tüm ücretsiz sayfalara yansır.
              </span>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto shrink-0">
              {status.type && (
                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 ${
                  status.type === "success" ? "bg-teal-500/10 border border-teal-500/20 text-teal-400" : "bg-red-500/10 border border-red-500/20 text-red-400"
                }`}>
                  {status.type === "success" ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                  {status.message}
                </div>
              )}

              <button
                disabled={isPending}
                type="submit"
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-white hover:bg-zinc-200 text-black font-extrabold text-sm rounded-2xl transition-all shadow-lg active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
              >
                {isPending ? (
                  <span className="h-4 w-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                Ayarları Kaydet
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
