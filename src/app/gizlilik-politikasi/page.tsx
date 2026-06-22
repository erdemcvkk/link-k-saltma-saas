import React from "react";
import Link from "next/link";
import { Shield, ArrowLeft } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Clinkor | Gizlilik Sözleşmesi",
  description: "Clinkor kullanıcı gizlilik sözleşmesi ve veri güvenliği politikası.",
};

export default function GizlilikPolitikasiPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-purple-50">
      {/* Hero Header */}
      <div className="bg-white border-b border-zinc-100 shadow-sm">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="flex items-center gap-3 mb-4">
            <Link
              href="/"
              className="flex items-center gap-1.5 text-xs font-bold text-zinc-400 hover:text-rose-500 transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Ana Sayfa
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-500">
              <Shield className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-zinc-900 tracking-tight">
                Gizlilik Politikası
              </h1>
              <p className="text-xs text-zinc-400 font-semibold mt-0.5">
                Son güncelleme: Haziran 2026 &bull; Clinkor
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-white rounded-3xl border border-zinc-100 shadow-sm p-4 md:p-10">
          <div className="prose prose-zinc max-w-none prose-headings:font-black prose-headings:text-zinc-900 prose-p:text-zinc-600 prose-p:leading-relaxed prose-li:text-zinc-600 prose-a:text-rose-500 prose-a:no-underline hover:prose-a:underline prose-h2:text-lg prose-h2:mt-8 prose-h2:mb-3 prose-ul:mt-2">
            <h2>1. Veri Sorumlusu</h2>
            <p>Clinkor Platformu olarak, kullanıcılarımızın kişisel verilerinin korunmasına büyük önem veriyoruz. Bu metin, hangi verileri ne amaçla işlediğimizi açıklamaktadır.</p>
            
            <h2>2. Toplanan Veriler</h2>
            <p>Hizmetlerimizi sunabilmek amacıyla üyelik esnasında ad, e-posta adresi ve profil özelleştirme bilgilerinizi topluyoruz.</p>
            
            <h2>3. Verilerin İşlenme Amaçları</h2>
            <p>Kişisel verileriniz, Platform hizmetlerinin sunulması, üyelik işlemlerinin yürütülmesi ve kullanıcı deneyiminin iyileştirilmesi amacıyla işlenmektedir.</p>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-8 text-center text-xs text-zinc-400 font-semibold space-y-2">
          <p>© 2026 Clinkor. Tüm Hakları Saklıdır.</p>
        </div>
      </div>
    </div>
  );
}
