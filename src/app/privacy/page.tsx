import { db } from "@/lib/db";
import Link from "next/link";
import { Shield, ArrowLeft } from "lucide-react";

export const revalidate = 0;

export default async function PrivacyPolicyPage() {
 const setting = await db.globalSetting.findUnique({
 where: { key: "page_privacy_policy" },
 });

 const content = setting?.value || `
<h2>1. Giriş</h2>
<p>Clinkor ("biz", "bizim" veya "platform") olarak, gizliliğinize saygı duyuyor ve kişisel verilerinizin korunmasına önem veriyoruz. Bu Gizlilik Politikası, platformumuzu kullandığınızda hangi verileri topladığımızı, nasıl kullandığımızı ve nasıl koruduğumuzu açıklamaktadır.</p>

<h2>2. Topladığımız Veriler</h2>
<p>Platformumuzu kullanırken aşağıdaki kişisel verileri toplayabiliriz:</p>
<ul>
 <li><strong>Hesap Bilgileri:</strong> Ad, e-posta adresi ve kullanıcı adı.</li>
 <li><strong>Profil Bilgileri:</strong> Biyografi, profil fotoğrafı ve sosyal medya bağlantıları.</li>
 <li><strong>Kullanım Verileri:</strong> Ziyaret ettiğiniz sayfalar, tıkladığınız bağlantılar ve platform etkileşimleri.</li>
 <li><strong>Teknik Veriler:</strong> IP adresi, tarayıcı türü, cihaz bilgisi ve coğrafi konum (ülke düzeyi).</li>
</ul>

<h2>3. Verilerinizi Nasıl Kullanıyoruz</h2>
<p>Topladığımız verileri şu amaçlarla kullanıyoruz:</p>
<ul>
 <li>Hesabınızı oluşturmak ve yönetmek,</li>
 <li>Platform hizmetlerini sunmak ve geliştirmek,</li>
 <li>Analitik ve performans ölçümleri yapmak,</li>
 <li>Müşteri desteği sağlamak,</li>
 <li>Yasal yükümlülükleri yerine getirmek.</li>
</ul>

<h2>4. Veri Paylaşımı</h2>
<p>Kişisel verilerinizi, açık onayınız olmadan üçüncü taraflarla paylaşmıyoruz. Yalnızca hizmetlerimizi sunmak için gerekli olan ve gizlilik taahhüdü veren iş ortaklarımızla (ödeme sağlayıcıları, kimlik doğrulama servisleri) çalışıyoruz.</p>

<h2>5. Verilerinizin Güvenliği</h2>
<p>Verilerinizin güvenliğini sağlamak için endüstri standardı şifreleme ve güvenlik protokolleri kullanıyoruz. Ancak hiçbir internet iletiminin %100 güvenli olmadığını belirtmek isteriz.</p>

<h2>6. Haklarınız</h2>
<p>KVKK ve GDPR kapsamında aşağıdaki haklara sahipsiniz:</p>
<ul>
 <li>Verilerinize erişim ve kopyasını talep etme hakkı,</li>
 <li>Hatalı verilerin düzeltilmesini talep etme hakkı,</li>
 <li>Verilerinizin silinmesini talep etme hakkı ("unutulma hakkı"),</li>
 <li>Veri işlemenin kısıtlanmasını talep etme hakkı,</li>
 <li>Veri taşınabilirliği hakkı.</li>
</ul>

<h2>7. İletişim</h2>
<p>Gizlilik politikamız hakkında sorularınız veya talepleriniz için: <a href="mailto:privacy@clinkor.com">privacy@clinkor.com</a> adresine ulaşabilirsiniz.</p>

<h2>8. Politika Güncellemeleri</h2>
<p>Bu politikayı zaman zaman güncelleyebiliriz. Önemli değişiklikler olduğunda size e-posta veya platform bildirimi ile bilgi vereceğiz. Son güncelleme tarihi: Mayıs 2026.</p>
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
 Gizlilik Politikası
 </h1>
 <p className="text-xs text-zinc-400 font-semibold mt-0.5">
 Son güncelleme: Mayıs 2026 &bull; Clinkor
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
