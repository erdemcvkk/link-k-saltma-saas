import React from "react";
import Link from "next/link";
import { db } from "@/lib/db";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Clinkor | Blog",
  description: "Sosyal medya yönetimi, biyografi linkleri optimizasyonu ve dijital içerik üreticiliği hakkında rehber içeriklerimiz.",
};

export const dynamic = "force-dynamic";

export default async function BlogListingPage() {
  const settings = await db.globalSetting.findMany();
  const serializedSettings = settings.reduce((acc, curr) => {
    acc[curr.key] = curr.value;
    return acc;
  }, {} as Record<string, string>);

  const siteTitle = serializedSettings["site_title"] || "Clinkor";
  const siteLogo = serializedSettings["site_logo"] || "";

  const blogs = await db.blog.findMany({
    orderBy: { publishedAt: "desc" },
  });

  return (
    <div className="relative min-h-screen bg-slate-50 text-slate-900 font-corporate pb-20">
      {/* Hero Section */}
      <section className="relative pt-12 pb-12 px-6 max-w-5xl mx-auto text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
          Clinkor Blog & Rehber
        </h1>
        <p className="text-sm md:text-base text-slate-500 font-semibold max-w-xl mx-auto">
          Profilinizi büyütmek, e-ticaret satışlarınızı artırmak ve link yönetimini profesyonelce yapmak için ihtiyacınız olan tüm ipuçları.
        </p>
      </section>

      {/* Blog Cards List */}
      <main className="max-w-5xl mx-auto px-6 mt-6">
        {blogs.length === 0 ? (
          <div className="bg-white rounded-3xl border border-zinc-150 p-16 text-center shadow-sm">
            <p className="text-zinc-550 font-bold text-sm">Henüz yayınlanmış bir blog yazısı bulunmuyor. Daha sonra tekrar kontrol edin.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.map((b) => {
              const snippet = b.content.replace(/<[^>]*>/g, '').substring(0, 120) + "...";
              return (
                <div key={b.id} className="bg-white rounded-3xl border border-zinc-100 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-md hover:scale-[1.01] transition-all duration-300">
                  <div>
                    {b.imageUrl ? (
                      <img src={b.imageUrl} alt={b.title} className="w-full h-48 object-cover border-b" />
                    ) : (
                      <div className="w-full h-48 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white font-black text-lg p-6 text-center border-b">
                        {b.title}
                      </div>
                    )}
                    <div className="p-6 space-y-3">
                      <span className="text-[10px] font-bold text-zinc-400">
                        {new Date(b.publishedAt).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" })}
                      </span>
                      <h2 className="text-lg font-black text-zinc-900 tracking-tight leading-tight hover:text-rose-500 transition-colors">
                        <Link href={`/blog/${b.slug}`}>
                          {b.title}
                        </Link>
                      </h2>
                      <p className="text-zinc-500 text-xs font-semibold leading-relaxed font-corporate">
                        {snippet}
                      </p>
                    </div>
                  </div>
                  <div className="p-6 pt-0">
                    <Link
                      href={`/blog/${b.slug}`}
                      className="inline-block text-xs font-black text-rose-500 hover:text-rose-600 transition-colors"
                    >
                      Devamını Oku &rarr;
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
