import Link from "next/link";
import { FileText, ArrowLeft } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Clinkor | Kullanım Şartları",
  description: "Clinkor kullanıcı sözleşmesi ve kullanım koşullarını inceleyin.",
};

export default function SartlarPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-sky-50">
      {/* Hero Header */}
      <div className="bg-white border-b border-zinc-100 shadow-sm">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="flex items-center gap-3 mb-4">
            <Link
              href="/"
              className="flex items-center gap-1.5 text-xs font-bold text-zinc-400 hover:text-indigo-500 transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Ana Sayfa
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-500">
              <FileText className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-zinc-900 tracking-tight">
                Kullanıcı Sözleşmesi ve Kullanım Koşulları
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
          <div className="prose prose-zinc max-w-none prose-headings:font-black prose-headings:text-zinc-900 prose-p:text-zinc-600 prose-p:leading-relaxed prose-li:text-zinc-600 prose-a:text-indigo-500 prose-a:no-underline hover:prose-a:underline prose-h2:text-lg prose-h2:mt-8 prose-h2:mb-3 prose-ul:mt-2">
            <h2>1. Taraflar ve Amaç</h2>
            <p>Bu Kullanıcı Sözleşmesi ("Sözleşme"), <strong>Clinkor</strong> ("Platform") ile Platform hizmetlerinden yararlanan kullanıcı ("Kullanıcı") arasında, Platform'un kullanım şartlarını belirlemek amacıyla akdedilmiştir. Platform'a üye olarak veya hizmetleri kullanarak bu şartları kabul etmiş sayılırsınız.</p>

            <h2>2. Hizmet Tanımı ve Kapsamı</h2>
            <p>Clinkor, kullanıcılara sosyal medya bağlantılarını, dijital mağazalarını, eklentilerini ve diğer etkileşimli içeriklerini tek bir profil altında toplama ve yönetme (SaaS) imkanı sunar. Platform, hizmet özelliklerini, planlarını ve eklentilerini dilediği zaman değiştirme hakkını saklı tutar.</p>

            <h2>3. Hesap Güvenliği ve Kullanıcı Sorumluluğu</h2>
            <ul>
              <li>Kullanıcı, hesap oluştururken verdiği bilgilerin doğruluğundan sorumludur.</li>
              <li>Hesap şifresinin ve üyelik bilgilerinin güvenliğinin sağlanması tamamen Kullanıcı'nın sorumluluğundadır.</li>
              <li>Platform üzerinde paylaşılan veya satışı yapılan her türlü içerik, link, ürün ve görselin yasal sorumluluğu Kullanıcı'ya aittir. Türkiye Cumhuriyeti kanunlarına aykırı, telif hakkı ihlali içeren veya illegal içerik barındıran hesaplar askıya alınabilir.</li>
            </ul>

            <h2>4. Fikri Mülkiyet Hakları</h2>
            <p>Platform'un tasarımı, yazılımı, logoları ve markası Clinkor'a aittir. Kullanıcı, Platform'un kaynak kodlarını kopyalayamaz, tersine mühendislik yapamaz veya fikri mülkiyet haklarını ihlal edecek faaliyetlerde bulunamaz.</p>

            <h2>5. Hizmet Kesintileri ve Sınırlamalar</h2>
            <p>Clinkor, hizmetlerin 7/24 kesintisiz çalışması için gerekli teknik çabayı gösterir. Ancak sunucu güncellemeleri, altyapı çalışmaları veya mücbir sebeplerden kaynaklı geçici kesintilerden Platform sorumlu tutulamaz.</p>

            <h2>6. Ücretlendirme, Abonelik ve İade Koşulları</h2>
            <p>Premium üyelikler ve eklentiler ücretlidir. Satın alınan paketler ve eklentiler dijital (anında ifa edilen) hizmet niteliğindedir. 6502 sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmeler Yönetmeliği uyarınca; <strong>elektronik ortamda anında ifa edilen hizmetler ve tüketiciye anında teslim edilen gayrimaddi mallara ilişkin sözleşmeler cayma hakkının istisnası kapsamında olduğundan iade yapılamamaktadır.</strong> Kullanıcı dilediği zaman bir sonraki dönem için aboneliğini iptal edebilir.</p>

            <h2>7. İletişim</h2>
            <p>Sözleşme şartları ile ilgili her türlü destek ve sorunuz için <strong>support@clinkor.com</strong> üzerinden bizimle iletişime geçebilirsiniz.</p>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-8 text-center text-xs text-zinc-400 font-semibold space-y-2">
          <p>Kişisel verilerinizin korunması için: <Link href="/gizlilik" className="text-indigo-500 hover:underline">Gizlilik Politikası</Link></p>
          <p>© 2026 Clinkor. Tüm Hakları Saklıdır.</p>
        </div>
      </div>
    </div>
  );
}
