import React from "react";
import { Metadata } from "next";
import { db } from "@/lib/db";
import YardimClient from "./yardim-client";
import SchemaMarkup from "@/components/SchemaMarkup";

export const metadata: Metadata = {
  title: "Clinkor | Yardım ve Destek",
  description: "Clinkor kullanımı, üyelik işlemleri ve eklenti yönetimi ile ilgili sorularınızın cevaplarını bulun.",
};

export const dynamic = "force-dynamic";

export default async function YardimPage() {
  const dbFaqs = await db.faq.findMany({ orderBy: { createdAt: "asc" } });
  const serializedFaqs = dbFaqs.map((f) => ({
    question: f.question,
    answer: f.answer,
  }));

  return (
    <>
      <SchemaMarkup type="faq" faqs={serializedFaqs} />
      <YardimClient faqs={serializedFaqs} />
    </>
  );
}
