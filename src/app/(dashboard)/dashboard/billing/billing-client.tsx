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
      } catch (err: any) {
        setErrorMsg(err.message || "Failed to process payment");
      }
    });
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 max-w-5xl mx-auto space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-zinc-900 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-purple-400 uppercase tracking-widest mb-1.5">
            <Sparkles className="h-3 w-3" />
            Billing Portal
          </div>
          <h1 className="text-3xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-fuchsia-500">
            PLANS & BILLING
          </h1>
          <p className="text-zinc-500 text-sm">Manage your subscription and billing logs.</p>
        </div>

        <Link
          href="/dashboard"
          className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 text-xs font-semibold transition-all"
        >
          <ArrowRight className="h-3.5 w-3.5 rotate-180" />
          Back to Dashboard
        </Link>
      </div>

      {/* Notifications */}
      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-950/20 border border-red-500/20 text-red-400 text-sm font-semibold">
          {errorMsg}
        </div>
      )}
      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/20 text-emerald-400 text-sm font-semibold">
          {successMsg}
        </div>
      )}

      {/* Active Subscription Details with Premium Live Countdown */}
      {currentPlan !== "FREE" && planExpiresAt && (
        <div className="p-6 rounded-2xl bg-zinc-950 border border-purple-500/20 shadow-[0_0_20px_rgba(168,85,247,0.05)] space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <span className="px-2 py-0.5 rounded-full bg-purple-500/20 border border-purple-500/30 text-[9px] font-bold text-purple-400 uppercase tracking-wide">
                Aktif Abonelik Süresi
              </span>
              <h2 className="text-xl font-bold text-white mt-1">
                {currentPlan} Üyeliğiniz Aktif!
              </h2>
              {planStartedAt && (
                <p className="text-zinc-500 text-[10px] mt-1 font-semibold">
                  Satın Alım Tarihi: {new Date(planStartedAt).toLocaleString("tr-TR")}
                </p>
              )}
            </div>
            
            <div className="bg-zinc-900 border border-zinc-800 px-4 py-3 rounded-xl min-w-[240px] text-center sm:text-right">
              <span className="text-[10px] font-black uppercase text-zinc-500 block mb-1">
                Kalan Abonelik Süresi (30 Günlük)
              </span>
              <span className="font-mono text-xs font-bold text-purple-400 animate-pulse">
                {timeLeft || "Hesaplanıyor..."}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Plans Comparison */}
      <div className="grid md:grid-cols-3 gap-8">
        {/* FREE PLAN */}
        <div className={`p-6 rounded-2xl bg-zinc-950 border transition-all ${
          currentPlan === "FREE" ? "border-purple-500/40 ring-1 ring-purple-500/20 shadow-[0_0_20px_rgba(168,85,247,0.05)]" : "border-zinc-900"
        } flex flex-col justify-between`}>
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">Starter Tier</span>
              {currentPlan === "FREE" && <span className="px-2 py-0.5 rounded-full bg-purple-500/20 border border-purple-500/30 text-[9px] font-bold text-purple-400 uppercase tracking-wide">Active Plan</span>}
            </div>
            <h3 className="text-xl font-bold mb-1">FREE</h3>
            <div className="text-3xl font-black mb-4">0₺ <span className="text-xs font-normal text-zinc-500">/ forever</span></div>
            
            <ul className="space-y-3 text-xs text-zinc-400 border-t border-zinc-900 pt-4 mb-6">
              <li className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-purple-400" /> Up to 20 Links</li>
              <li className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-purple-400" /> Default Theme Only</li>
              <li className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-purple-400" /> Standard QR Code</li>
            </ul>
          </div>

          <button
            disabled
            className="w-full py-2.5 rounded-xl bg-zinc-900 text-zinc-500 font-bold text-xs transition-colors cursor-not-allowed"
          >
            {currentPlan === "FREE" ? "Current Plan" : "Free Plan"}
          </button>
        </div>

        {/* STARTER PLAN */}
        <div className={`p-6 rounded-2xl bg-zinc-950 border transition-all ${
          currentPlan === "STARTER" ? "border-purple-500 ring-1 ring-purple-500/20 shadow-[0_0_30px_rgba(168,85,247,0.15)]" : "border-zinc-900"
        } flex flex-col justify-between`}>
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-400">Popular</span>
              {currentPlan === "STARTER" && <span className="px-2 py-0.5 rounded-full bg-purple-500/20 border border-purple-500/30 text-[9px] font-bold text-purple-400 uppercase tracking-wide">Active Plan</span>}
            </div>
            <h3 className="text-xl font-bold mb-1">STARTER</h3>
            <div className="text-3xl font-black mb-4">99₺ <span className="text-xs font-normal text-zinc-500">/ month</span></div>
            
            <ul className="space-y-3 text-xs text-zinc-400 border-t border-zinc-900 pt-4 mb-6">
              <li className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-purple-400" /> Up to 100 Links</li>
              <li className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-purple-400" /> Premium Neon Themes</li>
              <li className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-purple-400" /> Animated Glow Buttons</li>
              <li className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-purple-400" /> Advanced Analytics</li>
            </ul>
          </div>

          {currentPlan === "STARTER" ? (
            <button disabled className="w-full py-2.5 rounded-xl bg-purple-900/30 border border-purple-500/30 text-purple-300 font-bold text-xs cursor-not-allowed">
              Current Plan
            </button>
          ) : (
            <button
              onClick={() => handleUpgrade("STARTER", 99)}
              disabled={isPending}
              className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-black text-xs transition-colors shadow-[0_0_15px_rgba(168,85,247,0.25)] flex items-center justify-center gap-2 cursor-pointer"
            >
              {isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : <CreditCard className="h-3.5 w-3.5" />}
              {globalSettings?.["payment_link_starter"] ? "Secure Stripe/Shopier (99₺)" : "Mock Checkout (99₺)"}
            </button>
          )}
        </div>

        {/* CREATOR PLAN */}
        <div className={`p-6 rounded-2xl bg-zinc-950 border transition-all ${
          currentPlan === "CREATOR" ? "border-purple-500 ring-1 ring-purple-500/20 shadow-[0_0_30px_rgba(168,85,247,0.15)]" : "border-zinc-900"
        } flex flex-col justify-between`}>
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">Enterprise</span>
              {currentPlan === "CREATOR" && <span className="px-2 py-0.5 rounded-full bg-purple-500/20 border border-purple-500/30 text-[9px] font-bold text-purple-400 uppercase tracking-wide">Active Plan</span>}
            </div>
            <h3 className="text-xl font-bold mb-1">CREATOR</h3>
            <div className="text-3xl font-black mb-4">249₺ <span className="text-xs font-normal text-zinc-500">/ month</span></div>
            
            <ul className="space-y-3 text-xs text-zinc-400 border-t border-zinc-900 pt-4 mb-6">
              <li className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-purple-400" /> Unlimited Links</li>
              <li className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-purple-400" /> All Premium Themes</li>
              <li className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-purple-400" /> Custom Domain Support</li>
              <li className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-purple-400" /> Digital Beat Shop Integration</li>
            </ul>
          </div>

          {currentPlan === "CREATOR" ? (
            <button disabled className="w-full py-2.5 rounded-xl bg-purple-900/30 border border-purple-500/30 text-purple-300 font-bold text-xs cursor-not-allowed">
              Current Plan
            </button>
          ) : (
            <button
              onClick={() => handleUpgrade("CREATOR", 249)}
              disabled={isPending}
              className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-black text-xs transition-colors shadow-[0_0_15px_rgba(168,85,247,0.25)] flex items-center justify-center gap-2 cursor-pointer"
            >
              {isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : <CreditCard className="h-3.5 w-3.5" />}
              {globalSettings?.["payment_link_creator"] ? "Secure Stripe/Shopier (249₺)" : "Mock Checkout (249₺)"}
            </button>
          )}
        </div>
      </div>

      {/* Transaction History */}
      <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-900 space-y-4">
        <div className="flex items-center gap-2 text-sm font-extrabold uppercase tracking-wider text-zinc-400">
          <Receipt className="h-4 w-4" />
          Transaction Logs ({payments.length})
        </div>

        {payments.length === 0 ? (
          <div className="p-8 text-center text-xs text-zinc-500 italic border border-dashed border-zinc-800/80 rounded-xl">
            No mock payments recorded yet. Upgrade your plan to create a transaction log.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-zinc-900 text-zinc-500">
                  <th className="py-3 px-4 font-bold">Transaction ID</th>
                  <th className="py-3 px-4 font-bold">Plan</th>
                  <th className="py-3 px-4 font-bold">Amount</th>
                  <th className="py-3 px-4 font-bold">Status</th>
                  <th className="py-3 px-4 font-bold">Date</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p) => (
                  <tr key={p.id} className="border-b border-zinc-900/60 hover:bg-zinc-900/20 transition-all">
                    <td className="py-3 px-4 font-mono text-[10px] text-zinc-400">{p.id}</td>
                    <td className="py-3 px-4 font-bold text-purple-400">{p.package}</td>
                    <td className="py-3 px-4 font-bold">{p.amount}₺</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-[9px] font-bold text-emerald-400 uppercase tracking-wide border border-emerald-500/30">
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
