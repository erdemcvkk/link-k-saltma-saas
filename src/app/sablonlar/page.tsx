import React from "react";
import { db } from "@/lib/db";
import { seedTemplates } from "@/app/actions";
import { checkAndSyncUser } from "@/lib/user-sync";
import SablonlarClient from "./sablonlar-client";

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

 const serializedTemplates = templates.map((t) => ({
 id: t.id,
 name: t.name,
 price: t.price,
 category: t.category,
 coverUrl: t.coverUrl,
 bgColor: t.bgColor,
 fontStyle: t.fontStyle,
 buttonStyle: t.buttonStyle,
 paymentLink: t.paymentLink,
 isActive: t.isActive,
 isCoded: t.isCoded,
 customCss: t.customCss,
 configJson: t.configJson,
 createdAt: t.createdAt.toISOString(),
 }));

 return (
 <SablonlarClient
 initialTemplates={serializedTemplates}
 userId={userId}
 initialOwnedTemplateIds={ownedTemplateIds}
 />
 );
}
