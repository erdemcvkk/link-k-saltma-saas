import { db } from "@/lib/db";
import Link from "next/link";
import { Cookie, ArrowLeft } from "lucide-react";
import { Metadata } from "next";

export const revalidate = 0;

export const metadata: Metadata = {
  title: "Clinkor | Çerez Politikası",
  description: "Platformumuzda kullanılan çerez türleri, kullanım amaçları ve çerez yönetimi hakkında bilgiler.",
};

export default async function CookiePolicyPage() {
 const setting = await db.globalSetting.findUnique({
 where: { key: "page_cookie_policy" },
 });

 const content = setting?.value || `
<h2>1. Çerezler Nedir?</h2>
<p>Çerezler, web sitelerinin tarayıcınıza yerleştirdiği küçük metin dosyalarıdır. Clinkor, platformu daha iyi çalıştırmak, deneyiminizi kişiselleştirmek ve güvenliği sağlamak için çerezler kullanmaktadır.</p>

<h2>2. Kullandığımız Çerez Türleri</h2>

<h3>🔒 Zorunlu Çerezler</h3>
<p>Bu çerezler olmadan platform temel işlevlerini yerine getiremez. Oturum yönetimi, güvenlik ve kimlik doğrulama için kullanılır. Bu çerezleri devre dışı bırakamazsınız.</p>

<h3>📊 Analitik Çerezler</h3>
<p>Platformun nasıl kullanıldığını anlamamıza yardımcı olur. Hangi sayfaların en çok ziyaret edildiğini, ziyaretçilerin nereden geldiğini ve hangi özelliklerin kullanıldığını analiz eder. Bu veriler anonimleştirilmiş olarak işlenir.</p>

<h3>⚡ İşlevsel Çerezler</h3>
<p>Dil tercihiniz, tema ayarınız (açık/koyu mod) ve diğer kişiselleştirme seçeneklerinizi hatırlamak için kullanılır.</p>

<h3>🎯 Hedefleme / Pazarlama Çerezleri</h3>
<p>Clinkor şu anda üçüncü taraf pazarlama çerezleri kullanmamaktadır. Bu politika değişirse, önceden bilgilendirileceksiniz.</p>

<h2>3. Kullandığımız Belirli Çerezler</h2>
<table>
 <thead>
 <tr>
 <th>Çerez Adı</th>
 <th>Amaç</th>
 <th>Süre</th>
 <th>Tür</th>
 </tr>
 </thead>
 <tbody>
 <tr>
 <td><code>__session</code></td>
 <td>Kimlik doğrulama oturumu (Clerk)</td>
 <td>Oturum</td>
 <td>Zorunlu</td>
 </tr>
 <tr>
 <td><code>clinkor_theme</code></td>
 <td>Kullanıcı tema tercihi</td>
 <td>1 yıl</td>
 <td>İşlevsel</td>
 </tr>
 <tr>
 <td><code>clinkor_lang</code></td>
 <td>Dil tercihi</td>
 <td>1 yıl</td>
 <td>İşlevsel</td>
 </tr>
 <tr>
 <td><code>cookie_consent</code></td>
 <td>Çerez onayı kaydı</td>
 <td>1 yıl</td>
 <td>Zorunlu</td>
 </tr>
 </tbody>
</table>

<h2>4. Çerezleri Nasıl Kontrol Edebilirsiniz?</h2>
<p>Tarayıcınızın ayarlarından çerezleri yönetebilir, engelleyebilir veya silebilirsiniz:</p>
<ul>
 <li><strong>Chrome:</strong> Ayarlar → Gizlilik ve güvenlik → Çerezler</li>
 <li><strong>Firefox:</strong> Ayarlar → Gizlilik ve Güvenlik → Çerezler ve Site Verileri</li>
 <li><strong>Safari:</strong> Tercihler → Gizlilik → Çerezleri Yönet</li>
 <li><strong>Edge:</strong> Ayarlar → Çerezler ve site izinleri</li>
</ul>
<p><em>Not: Zorunlu çerezleri devre dışı bırakırsanız platform bazı özellikleri düzgün çalışmayabilir.</em></p>

<h2>5. Üçüncü Taraf Çerezleri</h2>
<p>Kimlik doğrulama için Clerk.dev hizmetini kullanıyoruz. Bu hizmet kendi gizlilik politikaları çerçevesinde çerezler yerleştirebilir. Detaylar için: <a href="https://clerk.com/privacy" target="_blank" rel="noopener">Clerk Gizlilik Politikası</a></p>

<h2>6. Çerez Tercihlerinizi Değiştirme</h2>
<p>Çerez tercihlerinizi herhangi bir zamanda platform ayarlarından veya tarayıcınız aracılığıyla değiştirebilirsiniz. Değişiklikler hemen geçerli olacaktır.</p>

<h2>7. İletişim</h2>
<p>Çerez politikamız hakkında sorularınız için: <a href="mailto:privacy@clinkor.com">privacy@clinkor.com</a></p>
 `.trim();

 return (
 <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50">
 {/* Hero Header */}
 <div className="bg-white border-b border-zinc-100 shadow-sm">
 <div className="max-w-4xl mx-auto px-6 py-8">
 <div className="flex items-center gap-3 mb-4">
 <Link
 href="/"
 className="flex items-center gap-1.5 text-xs font-bold text-zinc-400 hover:text-amber-500 transition-colors"
 >
 <ArrowLeft className="h-3.5 w-3.5" />
 Ana Sayfa
 </Link>
 </div>
 <div className="flex items-center gap-4">
 <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-500">
 <Cookie className="h-6 w-6" />
 </div>
 <div>
 <h1 className="text-2xl font-black text-zinc-900 tracking-tight">
 Çerez Politikası
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
 className="prose prose-zinc max-w-none prose-headings:font-black prose-headings:text-zinc-900 prose-p:text-zinc-600 prose-p:leading-relaxed prose-li:text-zinc-600 prose-a:text-amber-500 prose-a:no-underline hover:prose-a:underline prose-h2:text-lg prose-h2:mt-8 prose-h2:mb-3 prose-h3:text-base prose-h3:font-bold prose-h3:text-zinc-800 prose-h3:mt-5 prose-table:text-sm prose-thead:bg-zinc-50 prose-th:font-bold prose-th:text-zinc-700 prose-td:text-zinc-600 prose-code:text-amber-600 prose-code:bg-amber-50 prose-code:px-1 prose-code:rounded"
 dangerouslySetInnerHTML={{ __html: content }}
 />
 </div>

 {/* Footer Note */}
 <div className="mt-8 text-center text-xs text-zinc-400 font-semibold space-y-2">
 <p>Kişisel veri işleme için: <Link href="/privacy" className="text-amber-500 hover:underline">Gizlilik Politikası</Link></p>
 <p>© 2026 Clinkor. Tüm Hakları Saklıdır.</p>
 </div>
 </div>
 </div>
 );
}
