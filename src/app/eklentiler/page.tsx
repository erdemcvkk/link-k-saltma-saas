import Link from "next/link";
import { ArrowLeft, ShoppingBag, Zap, Shield, Mail, Calendar, CreditCard } from "lucide-react";

export const metadata = {
  title: "Eklentiler | Link.SaaS",
  description: "Link.SaaS profilinize ekstra özellikler katarak işinizi büyütün.",
};

const ADDONS = [
  {
    id: "crm",
    title: "Mini CRM & Lead Generation",
    description: "Profilinizi ziyaret eden müşterilerin iletişim bilgilerini toplayın ve yönetin.",
    price: "₺199",
    icon: Shield,
    color: "bg-indigo-500",
  },
  {
    id: "newsletter",
    title: "Newsletter Aboneliği",
    description: "Ziyaretçilerinizi e-posta bülteninize abone yapın, otomatik mail gönderin.",
    price: "₺149",
    icon: Mail,
    color: "bg-teal-500",
  },
  {
    id: "booking",
    title: "Randevu & Takvim",
    description: "Müşterilerinizin takviminiz üzerinden anında randevu almasını sağlayın.",
    price: "₺299",
    icon: Calendar,
    color: "bg-rose-500",
  },
  {
    id: "payments",
    title: "Hızlı Ödeme Alma",
    description: "Stripe/Iyzico entegrasyonu ile dijital ürünlerinizi profilinizden satın.",
    price: "₺349",
    icon: CreditCard,
    color: "bg-blue-500",
  }
];

export default function AddonsPage() {
  return (
    <div className="min-h-screen bg-zinc-50 font-sans">
      <nav className="border-b border-zinc-200 bg-white sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="font-black text-xl tracking-tighter text-slate-900">
            Link.SaaS
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-sm font-bold text-slate-500 hover:text-slate-900">
              Dashboard
            </Link>
          </div>
        </div>
      </nav>
      
      <main className="pt-32 pb-24 px-4 max-w-6xl mx-auto">
        <div className="text-center space-y-6 mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-500/10 text-teal-600 font-bold text-sm">
            <Zap className="h-4 w-4" />
            <span>Premium Eklentiler</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight">
            Profilinizi Bir <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-indigo-500">
              Uygulamaya Dönüştürün
            </span>
          </h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto font-medium">
            Link.SaaS sadece bir link sayfası değil. İhtiyacınız olan modülleri ekleyerek işinizi tek bir sayfadan yönetin.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {ADDONS.map((addon) => {
            const Icon = addon.icon;
            return (
              <div key={addon.id} className="p-8 rounded-3xl bg-white border border-zinc-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group">
                <div className={`w-14 h-14 rounded-2xl ${addon.color} text-white flex items-center justify-center mb-6 shadow-lg`}>
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-3">{addon.title}</h3>
                <p className="text-sm text-slate-500 font-medium mb-6 leading-relaxed">
                  {addon.description}
                </p>
                <div className="flex items-center justify-between mt-auto">
                  <span className="text-2xl font-black text-slate-900">{addon.price}<span className="text-xs text-slate-400 font-medium block">/ tek seferlik</span></span>
                  <Link href="/dashboard" className="h-10 w-10 rounded-full bg-slate-900 text-white flex items-center justify-center hover:bg-slate-800 transition-colors">
                    <ShoppingBag className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-24 p-12 rounded-3xl bg-slate-900 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-teal-500/20 via-slate-900 to-slate-900"></div>
          <div className="relative z-10 space-y-6">
            <h2 className="text-3xl font-black text-white">Dashboard'unuza Dönün</h2>
            <p className="text-slate-400 font-medium">Eklentilerinizi Kreatör Stüdyosu'ndan hemen yönetmeye başlayın.</p>
            <Link href="/dashboard" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-teal-500 text-slate-900 font-black hover:bg-teal-400 transition-colors">
              Stüdyoya Git
              <ArrowLeft className="h-4 w-4 rotate-180" />
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
