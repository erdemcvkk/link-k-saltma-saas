import React from "react";
import { Cookie } from "lucide-react";

export default function CerezPolitikasiPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50">
      {/* Hero Header */}
      <div className="bg-white border-b border-zinc-100 shadow-sm">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-500">
              <Cookie className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-zinc-900 tracking-tight">
                Çerez Politikası
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
          <div className="prose prose-zinc max-w-none prose-headings:font-black prose-headings:text-zinc-900 prose-p:text-zinc-600 prose-p:leading-relaxed prose-li:text-zinc-600 prose-a:text-amber-500 prose-a:no-underline hover:prose-a:underline prose-h2:text-lg prose-h2:mt-8 prose-h2:mb-3 prose-h3:text-base prose-h3:font-bold prose-h3:text-zinc-800 prose-h3:mt-5 prose-table:text-sm prose-thead:bg-zinc-50 prose-th:font-bold prose-th:text-zinc-700 prose-td:text-zinc-600 prose-code:text-amber-600 prose-code:bg-amber-50 prose-code:px-1 prose-code:rounded">
            <h2>1. Çerez Nedir?</h2>
            <p>Çerezler (Cookies), ziyaret ettiğiniz internet siteleri tarafından tarayıcınıza veya cihazınıza yerleştirilen küçük metin dosyalarıdır. Çerezler, web sitesinin daha verimli çalışmasını sağlamak ve ziyaretçilerin tercihlerini hatırlamak amacıyla kullanılır.</p>

            <h2>2. Çerez Türleri ve Kullanım Amaçlarımız</h2>
            <p>Clinkor olarak platformumuzda aşağıdaki amaçlarla çerezler kullanmaktayız:</p>
            <ul>
              <li><strong>Zorunlu Çerezler:</strong> Platformun çalışması, güvenliği ve oturum yönetimi için kesinlikle gerekli olan çerezlerdir. Kimlik doğrulama işlemleri (Clerk) bu çerezler vasıtasıyla yapılır ve devre dışı bırakılamazlar.</li>
              <li><strong>İşlevsel Çerezler:</strong> Dil tercihiniz, tema ayarlarınız (karanlık/aydınlık mod) gibi kişisel seçimlerinizi hatırlayarak size daha iyi bir deneyim sunmak için kullanılır.</li>
              <li><strong>Analitik Çerezler:</strong> Ziyaretçilerin platformu nasıl kullandığını, hangi sayfaları ziyaret ettiğini analiz etmek ve performansı optimize etmek amacıyla anonim olarak veri toplar.</li>
            </ul>

            <h2>3. Kullanılan Belirli Çerezler</h2>
            <table>
              <thead>
                <tr>
                  <th>Çerez Adı</th>
                  <th>Amaç</th>
                  <th>Geçerlilik Süresi</th>
                  <th>Tür</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><code>__session</code></td>
                  <td>Kullanıcı oturum yönetimi ve kimlik doğrulama (Clerk)</td>
                  <td>Tarayıcı Oturumu</td>
                  <td>Zorunlu</td>
                </tr>
                <tr>
                  <td><code>clinkor_theme</code></td>
                  <td>Seçilen tema tercihini (karanlık/aydınlık) hatırlama</td>
                  <td>1 Yıl</td>
                  <td>İşlevsel</td>
                </tr>
                <tr>
                  <td><code>clinkor_lang</code></td>
                  <td>Seçilen dil tercihini hatırlama</td>
                  <td>1 Yıl</td>
                  <td>İşlevsel</td>
                </tr>
                <tr>
                  <td><code>cookie_consent</code></td>
                  <td>Çerez tercih onayı durumunu kaydetme</td>
                  <td>1 Yıl</td>
                  <td>Zorunlu</td>
                </tr>
              </tbody>
            </table>

            <h2>4. Çerezleri Nasıl Kontrol Edebilir veya Silebilirsiniz?</h2>
            <p>Tarayıcınızın ayarlarını değiştirerek çerezleri dilediğiniz gibi engelleyebilir veya silebilirsiniz. Ancak zorunlu çerezleri engellemeniz durumunda, platformumuzun bazı özellikleri düzgün çalışmayabilir. Popüler tarayıcılarda çerez yönetim bilgileri:</p>
            <ul>
              <li><strong>Google Chrome:</strong> Ayarlar &rarr; Gizlilik ve Güvenlik &rarr; Üçüncü Taraf Çerezleri</li>
              <li><strong>Mozilla Firefox:</strong> Ayarlar &rarr; Gizlilik ve Güvenlik &rarr; Çerezler ve Site Verileri</li>
              <li><strong>Apple Safari:</strong> Ayarlar &rarr; Gizlilik &rarr; Çerezleri Engelle</li>
              <li><strong>Microsoft Edge:</strong> Ayarlar &rarr; Çerezler ve Site İzinleri</li>
            </ul>

            <h2>5. Kişisel Verilerin Korunması Kapsamındaki Haklarınız</h2>
            <p>Çerezler vasıtasıyla işlenen kişisel verilerinizle ilgili olarak, KVKK'nın 11. maddesi kapsamındaki haklarınızı <a href="mailto:privacy@clinkor.com">privacy@clinkor.com</a> adresine başvurarak kullanabilirsiniz.</p>
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
