import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { Metadata } from "next";
import { ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const blog = await db.blog.findUnique({
    where: { slug },
  });

  if (!blog) {
    return {
      title: "Blog Yazısı Bulunamadı | Clinkor",
    };
  }

  const snippet = blog.content.replace(/<[^>]*>/g, '').substring(0, 150);

  return {
    title: `Clinkor | ${blog.title}`,
    description: snippet,
    openGraph: {
      title: blog.title,
      description: snippet,
      type: "article",
      images: blog.imageUrl ? [{ url: blog.imageUrl }] : undefined,
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const blog = await db.blog.findUnique({
    where: { slug },
  });

  if (!blog) {
    notFound();
  }

  const settings = await db.globalSetting.findMany();
  const serializedSettings = settings.reduce((acc, curr) => {
    acc[curr.key] = curr.value;
    return acc;
  }, {} as Record<string, string>);

  const siteLogo = serializedSettings["site_logo"] || "";

  return (
    <div className="relative min-h-screen bg-slate-50 text-slate-900 font-corporate pb-20">
      {/* Main Container */}
      <main className="max-w-4xl mx-auto px-6 pt-12">
        <div className="mb-8">
          <Link
            href="/blog"
            className="flex items-center gap-1.5 text-xs font-bold text-zinc-400 hover:text-rose-500 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Blog Listesine Geri Dön
          </Link>
        </div>

        <article className="bg-white rounded-3xl border border-zinc-100 shadow-sm p-6 md:p-12 space-y-8">
          {blog.imageUrl && (
            <img src={blog.imageUrl} alt={blog.title} className="w-full h-80 object-cover rounded-2xl border" />
          )}

          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-zinc-400">
              <span>Yayınlanma Tarihi:</span>
              <span>
                {new Date(blog.publishedAt).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" })}
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-zinc-900 tracking-tight leading-tight">
              {blog.title}
            </h1>
          </div>

          <div className="border-t border-zinc-100 pt-8">
            <div className="prose prose-zinc max-w-none prose-headings:font-black prose-headings:text-zinc-900 prose-p:text-zinc-650 prose-p:leading-relaxed prose-li:text-zinc-600 prose-a:text-rose-500 prose-a:no-underline hover:prose-a:underline prose-h2:text-xl prose-h2:mt-8 prose-h2:mb-3 prose-ul:mt-2 whitespace-pre-line">
              {blog.content}
            </div>
          </div>
        </article>
      </main>
    </div>
  );
}
