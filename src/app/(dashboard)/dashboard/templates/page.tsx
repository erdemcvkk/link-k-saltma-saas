import { redirect } from "next/navigation";
import { checkAndSyncUser } from "@/lib/user-sync";
import { db } from "@/lib/db";
import { serializeTemplate } from "@/lib/template-utils";
import TemplatesClient from "./templates-client";

export const revalidate = 0;

export default async function TemplatesPage() {
  const user = await checkAndSyncUser();

  if (!user) {
    redirect("/sign-in");
  }

  // Fetch owned templates of this user
  const ownedTemplates = await db.userTemplate.findMany({
    where: { userId: user.id },
    include: {
      template: true,
    },
  });

  const serializedOwnedTemplates = ownedTemplates.map((ot) => ({
    userTemplateId: ot.id,
    isActive: ot.isActive,
    customUrl: ot.customUrl,
    ...(serializeTemplate(ot.template) as any)
  }));

  // Fetch user's links for preview
  const links = await db.link.findMany({
    where: { userId: user.id },
    orderBy: { order: "asc" },
  });

  const serializedLinks = links.map((l) => ({
    id: l.id,
    title: l.title,
    url: l.url,
    isActive: l.isActive,
    type: l.type,
    animation: l.animation || "",
    bgColor: l.bgColor ?? null,
    textColor: l.textColor ?? null,
    borderColor: l.borderColor ?? null,
    borderStyle: l.borderStyle ?? null,
    borderWidth: l.borderWidth ?? null,
    borderRadius: l.borderRadius ?? null,
    shadow: l.shadow ?? null,
    fontWeight: l.fontWeight ?? null,
    blockType: l.blockType || "TEXT_LINK",
    metadata: l.metadata ?? null,
  }));

  const systemSettings = await db.systemSettings.findFirst();
  const serializedSystemSettings = systemSettings ? {
    adScript: systemSettings.adScript,
    customImageUrl: systemSettings.customImageUrl,
    customTargetUrl: systemSettings.customTargetUrl,
    isActive: systemSettings.isActive
  } : null;

  return (
    <TemplatesClient
      initialOwnedTemplates={serializedOwnedTemplates}
      initialLinks={serializedLinks}
      systemSettings={serializedSystemSettings}
    />
  );
}
