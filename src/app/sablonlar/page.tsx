import React from "react";
import { Metadata } from "next";
import { db } from "@/lib/db";
import { seedTemplates } from "@/app/actions";
import { checkAndSyncUser } from "@/lib/user-sync";
import { serializeTemplate } from "@/lib/template-utils";
import SablonlarClient from "./sablonlar-client";

export const metadata: Metadata = {
  title: "Clinkor | Şablonlar",
  description: "Profil sayfanız için profesyonel tasarımları ve temaları inceleyin.",
};

export const dynamic = "force-dynamic";

export default async function SablonlarPage() {
 // Get current user session
 const user = await checkAndSyncUser();
 const userId = user ? user.id : null;

 // Fetch all active templates
 const templates = await db.template.findMany({
   where: {
     isActive: true,
     category: { not: "Özel" }
   },
   orderBy: { createdAt: "desc" },
 });

 // Fetch owned templates of this user
 let ownedTemplateIds: string[] = [];
 if (userId) {
 const owned = await db.userTemplate.findMany({
 where: { userId },
 select: { templateId: true }
 });
 ownedTemplateIds = owned.map(o => o.templateId);
 }

 const serializedTemplates = templates.map((t) => serializeTemplate(t)).filter((t): t is any => t !== null);

 return (
 <SablonlarClient
 initialTemplates={serializedTemplates}
 userId={userId}
 initialOwnedTemplateIds={ownedTemplateIds}
 />
 );
}
