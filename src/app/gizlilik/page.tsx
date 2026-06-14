import { db } from "@/lib/db";
import Link from "next/link";
import { Shield, ArrowLeft } from "lucide-react";

export const revalidate = 0;

export default async function GizlilikPage() {
  const setting = await db.globalSetting.findUnique({
    where: { key: "page_privacy_policy" },
  });

  const content = setting?.value || `
<h2>1. Veri Sorumlusu</h2>
<p>6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") uyarınca, kişisel verileriniz; veri sorumlusu olarak <strong>Clinkor</strong> ("Platform" veya "Biz") tarafından aşağıda açıklanan kapsamda işlenebilecektir.</p>

<h2>2. Kişisel Verilerin Hangi Amaçla İşleneceği</h2>
<p>Toplanan kişisel verileriniz, Platform hizmetlerinin sunulması, üyelik işlemlerinin gerçekleştirilmesi, kullanıcı deneyiminin özelleştirilmesi, analitik analizlerin yapılması ve yasal yükümlülüklerin yerine getirilmesi amaçlarıyla işlenmektedir.</p>
<ul>
  <li><strong>Hesap Bilgileri:</strong> Üyelik kaydı, kullanıcı kimlik doğrulaması ve iletişim.</li>
  <li><strong>Profil Bilgileri:</strong> Link-in-bio sayfanızda sergilediğiniz biyografi, avatar ve linkler.</li>
  <li><strong>Analitik ve Cihaz Verileri:</strong> Ziyaretçi sayıları, tıklama oranları, IP adresi ve tarayıcı bilgileri.</li>
</ul>

<h2>3. İşlenen Kişisel Verilerin Aktarılması</h2>
<p>Kişisel verileriniz; açık rızanız olmaksızın üçüncü taraflarla ticari amaçlarla paylaşılmaz. Ancak, Platform hizmetlerinin yürütülebilmesi için teknik iş ortaklarımızla (Clerk.dev kimlik doğrulama, Stripe/Iyzico ödeme aracıları) ve yasal mercilerin talepleri doğrultusunda yetkili kamu kurumlarıyla paylaşılabilir.</p>

<h2>4. Kişisel Veri Toplamanın Yöntemi ve Hukuki Sebebi</h2>
<p>Kişisel verileriniz, Platform'a üye olurken veya Platform'u kullanırken tamamen otomatik yöntemlerle toplanmaktadır. Bu verilerin işlenmesi, KVKK Madde 5/2 uyarınca sözleşmenin kurulması, ifası ve veri sorumlusunun meşru menfaati hukuki sebeplerine dayanmaktadır.</p>

<h2>5. Veri Sahibinin KVKK Madde 11 Kapsamındaki Hakları</h2>
<p>Veri sahibi olarak dilediğiniz zaman Platform'a başvurarak aşağıdaki haklarınızı kullanabilirsiniz:</p>
<ul>
  <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme,</li>
  <li>Kişisel verileriniz işlenmişse buna ilişkin bilgi talep etme,</li>
  <li>Kişisel verilerinizin işlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme,</li>
  <li>Yurt içinde veya yurt dışında kişisel verilerin aktarıldığı üçüncü kişileri bilme,</li>
  <li>Kişisel verilerin eksik veya yanlış işlenmiş olması hâlinde bunların düzeltilmesini isteme,</li>
  <li>Kişisel verilerin silinmesini veya yok edilmesini isteme.</li>
</ul>

<h2>6. İletişim ve Talepler</h2>
<p>KVKK kapsamındaki haklarınızı kullanmak, soru sormak veya görüş bildirmek için veri sorumlumuza <strong>privacy@clinkor.com</strong> e-posta adresi üzerinden ulaşabilirsiniz.</p>
  `.trim();

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
          <div
            className="prose prose-zinc max-w-none prose-headings:font-black prose-headings:text-zinc-900 prose-p:text-zinc-600 prose-p:leading-relaxed prose-li:text-zinc-600 prose-a:text-rose-500 prose-a:no-underline hover:prose-a:underline prose-h2:text-lg prose-h2:mt-8 prose-h2:mb-3 prose-ul:mt-2"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </div>

        {/* Footer Note */}
        <div className="mt-8 text-center text-xs text-zinc-400 font-semibold space-y-2">
          <p>Çerez politikamız için: <Link href="/cookies" className="text-rose-500 hover:underline">Çerez Politikası</Link></p>
          <p>© 2026 Clinkor. Tüm Hakları Saklıdır.</p>
        </div>
      </div>
    </div>
  );
}
