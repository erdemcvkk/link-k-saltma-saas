import React from "react";
import Link from "next/link";
import { ArrowLeft, FileText } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Clinkor | Kullanım Şartları",
  description: "Clinkor kullanıcı sözleşmesi ve kullanım koşullarını inceleyin.",
};

export default function KullanimSartlariPage() {
  return (
    <div className="min-h-screen font-sans text-[#1a1a1a] pt-10 pb-16 px-6" style={{ backgroundColor: "#ffffff" }}>
      <div className="max-w-[800px] mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-zinc-100 border border-zinc-200 flex items-center justify-center text-[#1a1a1a]">
              <FileText className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-[#1a1a1a] tracking-tight">
                Clinkor Kullanım Şartları
              </h1>
              <p className="text-xs text-zinc-500 font-semibold mt-1">
                Son güncelleme: Haziran 2026 &bull; Clinkor
              </p>
            </div>
          </div>
        </div>

        {/* Legal Text Content */}
        <div className="rounded-3xl border border-zinc-200 bg-[#f9f9f9] p-8 md:p-12 shadow-sm">
          <div className="space-y-8 text-sm md:text-base leading-[1.8] text-[#1a1a1a]">
            <div className="space-y-3">
              <h2 className="text-lg md:text-xl font-bold text-[#1a1a1a] tracking-tight">1. Taraflar ve Amaç</h2>
              <p className="text-zinc-700">
                Bu Kullanıcı Sözleşmesi (&quot;Sözleşme&quot;), <strong>Clinkor</strong> (&quot;Platform&quot;) ile Platform hizmetlerinden yararlanan kullanıcı (&quot;Kullanıcı&quot;) arasında, Platform&apos;un kullanım şartlarını belirlemek amacıyla akdedilmiştir. Platform&apos;a üye olarak veya hizmetleri kullanarak bu şartları kabul etmiş sayılırsınız.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="text-lg md:text-xl font-bold text-[#1a1a1a] tracking-tight">2. Hizmet Tanımı ve Kapsamı</h2>
              <p className="text-zinc-700">
                Clinkor, kullanıcılara sosyal medya bağlantılarını, dijital mağazalarını, eklentilerini ve diğer etkileşimli içeriklerini tek bir profil altında toplama ve yönetme (SaaS) imkanı sunar. Platform, hizmet özelliklerini, planlarını ve eklentilerini dilediği zaman değiştirme hakkını saklı tutar.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="text-lg md:text-xl font-bold text-[#1a1a1a] tracking-tight">3. Hesap Güvenliği ve Kullanıcı Sorumluluğu</h2>
              <ul className="list-disc pl-5 space-y-2 text-zinc-700">
                <li>Kullanıcı, hesap oluştururken verdiği bilgilerin doğruluğundan sorumludur.</li>
                <li>Hesap şifresinin ve üyelik bilgilerinin güvenliğinin sağlanması tamamen Kullanıcı&apos;nın sorumluluğundadır.</li>
                <li>Platform üzerinde paylaşılan veya satışı yapılan her türlü içerik, link, ürün ve görselin yasal sorumluluğu Kullanıcı&apos;ya aittir. Türkiye Cumhuriyeti kanunlarına aykırı, telif hakkı ihlali içeren veya illegal içerik barındıran hesaplar askıya alınabilir.</li>
              </ul>
            </div>

            <div className="space-y-3">
              <h2 className="text-lg md:text-xl font-bold text-[#1a1a1a] tracking-tight">4. Fikri Mülkiyet Hakları</h2>
              <p className="text-zinc-700">
                Platform&apos;un tasarımı, yazılımı, logoları ve markası Clinkor&apos;a aittir. Kullanıcı, Platform&apos;un kaynak kodlarını kopyalayamaz, tersine mühendislik yapamaz veya fikri mülkiyet haklarını ihlal edecek faaliyetlerde bulunamaz.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="text-lg md:text-xl font-bold text-[#1a1a1a] tracking-tight">5. Hizmet Kesintileri ve Sınırlamalar</h2>
              <p className="text-zinc-700">
                Clinkor, hizmetlerin 7/24 kesintisiz çalışması için gerekli teknik çabayı gösterir. Ancak sunucu güncellemeleri, altyapı çalışmaları veya mücbir sebeplerden kaynaklı geçici kesintilerden Platform sorumlu tutulamaz.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="text-lg md:text-xl font-bold text-[#1a1a1a] tracking-tight">6. Ücretlendirme, Abonelik ve İade Koşulları</h2>
              <p className="text-zinc-700">
                Premium üyelikler ve eklentiler ücretlidir. Satın alınan paketler ve eklentiler dijital (anında ifa edilen) hizmet niteliğindedir. 6502 sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmeler Yönetmeliği uyarınca; <strong>elektronik ortamda anında ifa edilen hizmetler ve tüketiciye anında teslim edilen gayrimaddi mallara ilişkin sözleşmeler cayma hakkının istisnası kapsamında olduğundan iade yapılamamaktadır.</strong> Kullanıcı dilediği zaman bir sonraki dönem için aboneliğini iptal edebilir.
              </p>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-8 text-center text-xs text-zinc-500 font-semibold space-y-2">
          <p>
            Kişisel verilerinizin korunması için:{" "}
            <Link href="/gizlilik" className="text-zinc-600 hover:text-zinc-900 underline transition-colors">
              Gizlilik Politikası
            </Link>
          </p>
          <p>&copy; 2026 Clinkor. Tüm Hakları Saklıdır.</p>
        </div>
      </div>
    </div>
  );
}
