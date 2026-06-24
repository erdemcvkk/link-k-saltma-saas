import React from "react";
import { Shield } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Clinkor | Gizlilik Politikası ve KVKK Aydınlatma Metni",
  description: "Clinkor kullanıcı gizlilik sözleşmesi, kişisel verilerin korunması kanunu (KVKK) aydınlatma metni ve veri güvenliği politikası.",
};

export default function GizlilikPolitikasiPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-purple-50">
      {/* Hero Header */}
      <div className="bg-white border-b border-zinc-100 shadow-sm">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-500">
              <Shield className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-zinc-900 tracking-tight">
                Gizlilik Politikası ve KVKK Aydınlatma Metni
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
            <p>6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") uyarınca, kişisel verileriniz; veri sorumlusu olarak <strong>Clinkor</strong> ("Platform") tarafından aşağıda açıklanan kapsamda işlenmektedir.</p>

            <h2>2. İşlenen Kişisel Verileriniz ve Toplanma Amaçları</h2>
            <p>Platformumuzu kullandığınızda aşağıdaki kişisel verileriniz toplanabilmekte ve işlenebilmektedir:</p>
            <ul>
              <li><strong>Hesap ve Kimlik Bilgileri:</strong> Üye olurken paylaştığınız ad, soyad ve e-posta adresi. Bu veriler hesap oluşturulması, kullanıcı kimlik doğrulaması ve iletişim amaçlarıyla işlenir.</li>
              <li><strong>Profil ve İçerik Bilgileri:</strong> Biyografi, profil fotoğrafı, eklediğiniz bağlantılar ve sosyal medya hesapları. Bu veriler profilinizin oluşturulması ve ziyaretçilerinize sunulması amacıyla işlenir.</li>
              <li><strong>Kullanım ve Analitik Veriler:</strong> Profilinizin ziyaretçi sayıları, bağlantı tıklama istatistikleri, IP adresi, cihaz ve tarayıcı bilgileri. Bu veriler platform analizleri, performans ölçümü ve raporlama amaçlarıyla işlenir.</li>
            </ul>

            <h2>3. Kişisel Verilerin Aktarılması</h2>
            <p>Kişisel verileriniz, açık rızanız olmaksızın üçüncü kişilere ticari veya reklam amacıyla aktarılmaz. Ancak, Platform hizmetlerinin sunulması için gerekli olan teknik altyapı sağlayıcıları (kimlik doğrulama, hosting) ve yasal yükümlülüklerin yerine getirilmesi amacıyla yetkili kamu kurum ve kuruluşları ile paylaşılabilecektir.</p>

            <h2>4. Kişisel Veri Toplamanın Yöntemi ve Hukuki Sebebi</h2>
            <p>Kişisel verileriniz, Platform'u kullanırken veya kayıt olurken tamamen otomatik yöntemlerle elektronik ortamda toplanmaktadır. Verilerinizin işlenmesi, KVKK'nın 5/2 maddesinde yer alan "sözleşmenin kurulması ve ifası", "veri sorumlusunun hukuki yükümlülüğü" ve "meşru menfaat" hukuki sebeplerine dayanmaktadır.</p>

            <h2>5. İlgili Kişi Olarak Haklarınız (KVKK Madde 11)</h2>
            <p>KVKK'nın 11. maddesi uyarınca veri sorumlusuna başvurarak aşağıdaki haklarınızı kullanabilirsiniz:</p>
            <ul>
              <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme,</li>
              <li>Kişisel verileriniz işlenmişse buna ilişkin bilgi talep etme,</li>
              <li>Kişisel verilerinizin işlenme amacını ve bunların amacına uygun kullanılıp kullanılmadığını öğrenme,</li>
              <li>Yurt içinde veya yurt dışında kişisel verilerin aktarıldığı üçüncü kişileri bilme,</li>
              <li>Kişisel verilerin eksik veya yanlış işlenmiş olması hâlinde bunların düzeltilmesini isteme,</li>
              <li>Kişisel verilerin silinmesini veya yok edilmesini isteme,</li>
              <li>Münhasıran otomatik sistemler vasıtasıyla analiz edilmesi suretiyle aleyhe bir sonucun ortaya çıkmasına itiraz etme,</li>
              <li>Kanuna aykırı olarak işlenmesi sebebiyle zarara uğraması hâlinde zararın giderilmesini talep etme.</li>
            </ul>

            <h2>6. Veri Güvenliği</h2>
            <p>Clinkor, kişisel verilerinizin yetkisiz erişime, kayba veya ifşaya karşı korunması için gerekli teknik ve idari güvenlik önlemlerini almaktadır. Verileriniz şifreli veritabanlarında güvenle saklanmaktadır.</p>

            <h2>7. İletişim</h2>
            <p>Politikaya dair tüm soru, görüş ve KVKK kapsamındaki talepleriniz için <a href="mailto:privacy@clinkor.com">privacy@clinkor.com</a> e-posta adresi üzerinden veri sorumlusu ile iletişime geçebilirsiniz.</p>
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
