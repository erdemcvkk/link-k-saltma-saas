import React from "react";
import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Clinkor Hakkında: Dijital Kimliğinizi Tasarlayın",
  description: "2026 yılında İstanbul'da kurulan Clinkor, sosyal medya linklerinizi profesyonel bir portfolyoya dönüştüren premium link-in-bio platformudur.",
};

export default function HakkimizdaPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 transition-colors duration-300">


      {/* Hero Section */}
      <section className="max-w-4xl mx-auto px-6 pt-16 pb-12 text-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-400 mb-6">
          <Sparkles className="h-3.5 w-3.5 text-indigo-500" />
          Bizim Hikayemiz
        </div>
        <h1 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight max-w-2xl mx-auto">
          Clinkor Hakkında: Dijital Kimliğinizi Tasarlayın
        </h1>
        <p className="text-sm text-slate-400 dark:text-slate-500 font-semibold mt-4">
          İstanbul &bull; Kurulma Yılı: 2026
        </p>
      </section>

      {/* Main Content Container */}
      <main className="max-w-4xl mx-auto px-6 pb-24">
        <div className="bg-white dark:bg-slate-900/40 rounded-3xl border border-slate-100 dark:border-slate-900 shadow-sm p-8 md:p-14">
          <article className="max-w-[700px] mx-auto">
            {/* Story Text */}
            <div className="space-y-8 text-slate-600 dark:text-slate-300 text-base md:text-lg leading-[1.8] font-sans">
              <p className="font-semibold text-slate-800 dark:text-slate-100 text-lg md:text-xl leading-relaxed">
                2026 yılının o dijital karmaşasında, İstanbul’un bitmek bilmeyen temposunda bir akşamüstü oturduk ve şunu sorduk: "Neden dijital kimliğimiz, gerçek hayattaki enerjimizden daha yavaş olsun?"
              </p>
              
              <p>
                O gün, sadece bir link aracı değil, dijital varlığınızı adeta bir sanat eserine dönüştürecek bir fikir filizlendi. Clinkor, basit bir 'link-in-bio' platformu olmanın çok ötesinde bir amaçla yola çıktı. Biz, insanların kendi markalarını anlatırken karşılaştıkları o teknik duvarları yıkmak istedik. Tasarımcıların vizyonunu, içerik üreticilerinin enerjisini ve küçük işletmelerin o büyük hayallerini, birkaç saniyede hayata geçebilecekleri bir dijital sahneye çevirmeyi hedefledik.
              </p>

              <p>
                Clinkor, bir garaj projesi ya da büyük bir holdingin alt birimi değil; biz, internetin o soğuk ve standart kutucuklarından sıkılmış, "dijitalde de şık durmak bizim hakkımız" diyen bir avuç tasarımcı ve yazılımcıyız. 2026 yılı, teknolojinin artık estetikle tamamen bütünleştiği bir yıl; biz de bu yılın imkanlarını kullanarak, karmaşık kodlarla uğraşmanıza gerek kalmadan, sadece hayalinizdeki o 'premium' duruşu yakalayabileceğiniz bir platform inşa ettik.
              </p>

              <p>
                Amacımız çok net: Sizin o eşsiz hikayenizi, ekrana en estetik haliyle yansıtmak. İster bir sanatçı, ister bir girişimci olun; dijital alanınız sizi en iyi şekilde temsil etmeli.
              </p>

              <p className="border-l-4 border-indigo-500 pl-6 py-2 italic font-medium text-slate-700 dark:text-slate-200">
                Çünkü biliyoruz ki; iyi bir tasarım sadece göze hitap etmez, aynı zamanda kapıları açar. Biz kapıyı açmanız için gerekli o dijital tasarımı yapıyoruz, içeri girip hikayenizi anlatmak ise tamamen size kalmış.
              </p>

              <p className="font-bold text-slate-900 dark:text-white pt-4 text-center md:text-left">
                Clinkor'a hoş geldiniz. Hikayenizi, tam da olması gerektiği gibi sergilemeye hazırız.
              </p>
            </div>
          </article>
        </div>
      </main>
    </div>
  );
}
