"use client";

import { useState, useTransition, useEffect } from "react";
import { upgradeUserPlan } from "@/app/actions";
import { CreditCard, Check, ArrowRight, Loader2, Sparkles, Receipt } from "lucide-react";
import Link from "next/link";

type PaymentItem = {
  id: string;
  amount: number;
  status: string;
  package: string;
  createdAt: Date;
};

interface BillingClientProps {
  userId: string;
  currentPlan: string;
  planStartedAt?: string | null;
  planExpiresAt?: string | null;
  payments: PaymentItem[];
  globalSettings?: Record<string, string>;
}

export default function BillingClient({ userId, currentPlan, planStartedAt, planExpiresAt, payments, globalSettings }: BillingClientProps) {
  const priceStarter = globalSettings?.price_starter || "150";
  const priceCreator = globalSettings?.price_creator || "450";
  const starterPriceNum = parseInt(priceStarter, 10) || 150;
  const creatorPriceNum = parseInt(priceCreator, 10) || 450;

  const [isPending, startTransition] = useTransition();
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [timeLeft, setTimeLeft] = useState<string>("");

  useEffect(() => {
    if (currentPlan === "FREE" || !planExpiresAt) {
      setTimeLeft("");
      return;
    }

    const updateTimer = () => {
      const expiry = new Date(planExpiresAt).getTime();
      const now = new Date().getTime();
      const diff = expiry - now;

      if (diff <= 0) {
        setTimeLeft("Süresi Doldu (Sayfayı Yenileyin)");
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft(`${days} gün, ${hours} saat, ${minutes} dakika, ${seconds} saniye`);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [currentPlan, planExpiresAt]);

  const handleUpgrade = (planName: string, price: number) => {
    const configKey = `payment_link_${planName.toLowerCase()}`;
    const customLink = globalSettings?.[configKey];

    if (customLink) {
      window.open(customLink, "_blank");
      return;
    }

    setErrorMsg("");
    setSuccessMsg("");

    startTransition(async () => {
      try {
        await upgradeUserPlan(userId, planName, price);
        setSuccessMsg(`Congratulations! You have successfully upgraded to the ${planName} plan!`);
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } catch (err: any) {
        setErrorMsg(err.message || "Failed to process payment");
      }
    });
  };

  return (
    <div className="min-h-screen bg-white text-zinc-900 p-3 md:p-6 max-w-5xl mx-auto space-y-10 font-corporate">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-zinc-200 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-neon-blue uppercase tracking-widest mb-1.5">
            <Sparkles className="h-3 w-3" />
            Billing Portal
          </div>
          <h1 className="text-xl md:text-3xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-neon-blue to-light-blue">
            PLANS & BILLING
          </h1>
          <p className="text-zinc-500 text-sm">Manage your subscription and billing logs.</p>
        </div>

        <Link
          href="/dashboard"
          className="flex items-center gap-1.5 px-4 py-3 md:py-2 rounded-full bg-white border border-zinc-200 hover:bg-zinc-50 text-zinc-700 text-xs font-semibold transition-all shadow-sm"
        >
          <ArrowRight className="h-3.5 w-3.5 rotate-180" />
          Back to Dashboard
        </Link>
      </div>

      {/* Notifications */}
      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm font-semibold">
          {errorMsg}
        </div>
      )}
      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600 text-sm font-semibold">
          {successMsg}
        </div>
      )}

      {/* Active Subscription Details with Premium Live Countdown */}
      {currentPlan !== "FREE" && planExpiresAt && (
        <div className="p-3 md:p-6 rounded-2xl bg-zinc-50 border border-zinc-200 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <span className="px-2 py-0.5 rounded-full bg-neon-blue/15 border border-neon-blue/20 text-[9px] font-bold text-neon-blue uppercase tracking-wide">
                Aktif Abonelik Süresi
              </span>
              <h2 className="text-xl font-bold text-zinc-900 mt-1">
                {currentPlan} Üyeliğiniz Aktif!
              </h2>
              {planStartedAt && (
                <p className="text-zinc-500 text-[10px] mt-1 font-semibold">
                  Satın Alım Tarihi: {new Date(planStartedAt).toLocaleString("tr-TR")}
                </p>
              )}
            </div>
            
            <div className="bg-white border border-zinc-200 px-4 py-3 rounded-xl min-w-[240px] text-center sm:text-right shadow-sm">
              <span className="text-[10px] font-black uppercase text-zinc-500 block mb-1">
                Kalan Abonelik Süresi (30 Günlük)
              </span>
              <span className="font-mono text-xs font-bold text-neon-blue animate-pulse">
                {timeLeft || "Hesaplanıyor..."}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Plans Comparison */}
      <div className="grid md:grid-cols-3 gap-8">
        {/* FREE PLAN */}
        <div className={`p-3 md:p-6 rounded-2xl bg-white border transition-all ${
          currentPlan === "FREE" ? "border-neon-blue ring-1 ring-neon-blue/20 shadow-md" : "border-zinc-200"
        } flex flex-col justify-between`}>
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">Free Tier</span>
              {currentPlan === "FREE" && <span className="px-2 py-0.5 rounded-full bg-neon-blue/10 border border-neon-blue/20 text-[9px] font-bold text-neon-blue uppercase tracking-wide">Active Plan</span>}
            </div>
            <h3 className="text-xl font-bold mb-1 text-zinc-900">FREE</h3>
            <div className="text-xl md:text-3xl font-black mb-4 text-zinc-900">0₺ <span className="text-xs font-normal text-zinc-400">/ forever</span></div>
            
            <ul className="space-y-3 text-xs text-zinc-600 border-t border-zinc-100 pt-4 mb-6">
              <li className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-neon-blue" /> 1 Adet Aktif Bio Link Sayfası (link.saas/kullaniciadi)</li>
              <li className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-neon-blue" /> Sınırlı Bağlantı Ekleme (Maksimum 5 Adet)</li>
              <li className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-neon-blue" /> Standart Hazır Temalar (Temel renk/düzen)</li>
              <li className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-neon-blue" /> Temel Analizler (Toplam sayfa görüntülenmesi)</li>
              <li className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-neon-blue" /> Sistem Logosu ("Link.SaaS" ibaresi yer alır)</li>
            </ul>
          </div>

          <button
            disabled
            className="w-full py-3 md:py-2.5 rounded-xl bg-zinc-100 text-zinc-450 font-bold text-xs transition-colors cursor-not-allowed"
          >
            {currentPlan === "FREE" ? "Current Plan" : "Free Plan"}
          </button>
        </div>

        {/* STARTER PLAN */}
        <div className={`p-3 md:p-6 rounded-2xl bg-white border transition-all ${
          currentPlan === "STARTER" ? "border-neon-blue ring-1 ring-neon-blue/20 shadow-md" : "border-zinc-200"
        } flex flex-col justify-between`}>
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-neon-blue">Popular</span>
              {currentPlan === "STARTER" && <span className="px-2 py-0.5 rounded-full bg-neon-blue/10 border border-neon-blue/20 text-[9px] font-bold text-neon-blue uppercase tracking-wide">Active Plan</span>}
            </div>
            <h3 className="text-xl font-bold mb-1 text-zinc-900">STARTER</h3>
            <div className="text-xl md:text-3xl font-black mb-4 text-zinc-900">{priceStarter}₺ <span className="text-xs font-normal text-zinc-400">/ month</span></div>
            
            <ul className="space-y-3 text-xs text-zinc-600 border-t border-zinc-100 pt-4 mb-6">
              <li className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-neon-blue" /> Ücretsiz Plandaki Tüm Özellikler</li>
              <li className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-neon-blue" /> Sınırsız Bağlantı (Link) Ekleme</li>
              <li className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-neon-blue" /> Premium Temalar ve Yazı Tipleri (Özel Font Kütüphanesi)</li>
              <li className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-neon-blue" /> Özel Renk ve Düzen Seçenekleri (Buton stilleri, gradient arka planlar)</li>
              <li className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-neon-blue" /> Gelişmiş Analiz Paneli (Trendler ve Grafikler)</li>
              <li className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-neon-blue" /> Akıllı İletişim Butonları (WhatsApp, Telegram veya E-posta)</li>
              <li className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-neon-blue" /> Medya Entegrasyonları (YouTube, Spotify, SoundCloud)</li>
              <li className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-neon-blue" /> Buton Animasyonları (Hareket Efektleri)</li>
            </ul>
          </div>

          {currentPlan === "STARTER" ? (
            <button disabled className="w-full py-3 md:py-2.5 rounded-xl bg-neon-blue/10 border border-neon-blue/20 text-neon-blue font-bold text-xs cursor-not-allowed">
              Current Plan
            </button>
          ) : (
            <button
              onClick={() => handleUpgrade("STARTER", starterPriceNum)}
              disabled={isPending}
              className="w-full py-3 md:py-2.5 rounded-xl bg-gradient-to-r from-neon-blue to-light-blue text-white font-black text-xs transition-opacity hover:opacity-90 flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            >
              {isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : <CreditCard className="h-3.5 w-3.5" />}
              {globalSettings?.["payment_link_starter"] ? `Secure Stripe/Shopier (${priceStarter}₺)` : `Mock Checkout (${priceStarter}₺)`}
            </button>
          )}
        </div>

        {/* CREATOR PLAN */}
        <div className={`p-3 md:p-6 rounded-2xl bg-white border transition-all ${
          currentPlan === "CREATOR" ? "border-neon-blue ring-1 ring-neon-blue/20 shadow-md" : "border-zinc-200"
        } flex flex-col justify-between`}>
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">Enterprise</span>
              {currentPlan === "CREATOR" && <span className="px-2 py-0.5 rounded-full bg-neon-blue/10 border border-neon-blue/20 text-[9px] font-bold text-neon-blue uppercase tracking-wide">Active Plan</span>}
            </div>
            <h3 className="text-xl font-bold mb-1 text-zinc-900">CREATOR</h3>
            <div className="text-xl md:text-3xl font-black mb-4 text-zinc-900">{priceCreator}₺ <span className="text-xs font-normal text-zinc-400">/ month</span></div>
            
            <ul className="space-y-3 text-xs text-zinc-600 border-t border-zinc-100 pt-4 mb-6">
              <li className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-neon-blue" /> Başlangıç Planındaki Tüm Özellikler</li>
              <li className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-neon-blue" /> Platform Logosunu Kaldırma (Whitelabel / Temiz Sayfa)</li>
              <li className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-neon-blue" /> E-ticaret Entegrasyonları (Shopier vitrini ve envanter)</li>
              <li className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-neon-blue" /> İletişim ve Veri Toplama Formları (İsim, E-posta toplama)</li>
              <li className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-neon-blue" /> Pazarlama ve Piksel Entegrasyonları (Facebook Pixel, Google Analytics)</li>
              <li className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-neon-blue" /> Gelişmiş Kitle Analitiği (Cihaz, konum, tarayıcı demografisi)</li>
              <li className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-neon-blue" /> Özel SEO ve Favicon Ayarları</li>
              <li className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-neon-blue" /> Görsel Galeri / Carousel Kaydırıcı (Resimli Slider)</li>
              <li className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-neon-blue" /> Öncelikli Destek (Hızlı teknik destek)</li>
            </ul>
          </div>

          {currentPlan === "CREATOR" ? (
            <button disabled className="w-full py-3 md:py-2.5 rounded-xl bg-neon-blue/10 border border-neon-blue/20 text-neon-blue font-bold text-xs cursor-not-allowed">
              Current Plan
            </button>
          ) : (
            <button
              onClick={() => handleUpgrade("CREATOR", creatorPriceNum)}
              disabled={isPending}
              className="w-full py-3 md:py-2.5 rounded-xl bg-gradient-to-r from-neon-blue to-light-blue text-white font-black text-xs transition-opacity hover:opacity-90 flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            >
              {isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : <CreditCard className="h-3.5 w-3.5" />}
              {globalSettings?.["payment_link_creator"] ? `Secure Stripe/Shopier (${priceCreator}₺)` : `Mock Checkout (${priceCreator}₺)`}
            </button>
          )}
        </div>
      </div>

      {/* Transaction History */}
      <div className="p-3 md:p-6 rounded-2xl bg-white border border-zinc-200 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-sm font-extrabold uppercase tracking-wider text-zinc-500">
          <Receipt className="h-4 w-4 text-zinc-400" />
          Transaction Logs ({payments.length})
        </div>

        {payments.length === 0 ? (
          <div className="p-4 md:p-8 text-center text-xs text-zinc-400 italic border border-dashed border-zinc-200 rounded-xl">
            No mock payments recorded yet. Upgrade your plan to create a transaction log.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-zinc-200 text-zinc-400">
                  <th className="py-3 px-4 font-bold">Transaction ID</th>
                  <th className="py-3 px-4 font-bold">Plan</th>
                  <th className="py-3 px-4 font-bold">Amount</th>
                  <th className="py-3 px-4 font-bold">Status</th>
                  <th className="py-3 px-4 font-bold">Date</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p) => (
                  <tr key={p.id} className="border-b border-zinc-200/60 hover:bg-zinc-50/50 transition-all">
                    <td className="py-3 px-4 font-mono text-[10px] text-zinc-500">{p.id}</td>
                    <td className="py-3 px-4 font-bold text-neon-blue">{p.package}</td>
                    <td className="py-3 px-4 font-bold text-zinc-800">{p.amount}₺</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-[9px] font-bold text-emerald-600 uppercase tracking-wide border border-emerald-200">
                        {p.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-zinc-500">{new Date(p.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
