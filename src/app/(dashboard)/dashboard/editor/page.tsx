import { redirect } from "next/navigation";
import { checkAndSyncUser } from "@/lib/user-sync";
import { db } from "@/lib/db";
import EditorClient from "./editor-client";

export const revalidate = 0;

export default async function EditorPage() {
  const user = await checkAndSyncUser();

  if (!user) {
    redirect("/sign-in");
  }

  // Fetch user's links including link clicks
  const links = await db.link.findMany({
    where: { userId: user.id },
    include: {
      clicks: {
        select: {
          id: true,
          createdAt: true,
        },
      },
    },
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
    clicks: l.clicks.map((c) => ({
      id: c.id,
      createdAt: c.createdAt.toISOString(),
    })),
  }));

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
    id: ot.template.id,
    name: ot.template.name,
    price: ot.template.price,
    category: ot.template.category,
    coverUrl: ot.template.coverUrl,
    bgColor: ot.template.bgColor,
    fontStyle: ot.template.fontStyle,
    buttonStyle: ot.template.buttonStyle,
    isCoded: ot.template.isCoded,
    customCss: ot.template.customCss,
    configJson: ot.template.configJson,
  }));

  const systemSettings = await db.systemSettings.findFirst();
  const serializedSystemSettings = systemSettings ? {
    adScript: systemSettings.adScript,
    customImageUrl: systemSettings.customImageUrl,
    customTargetUrl: systemSettings.customTargetUrl,
    isActive: systemSettings.isActive
  } : null;

  return (
    <EditorClient
      initialLinks={serializedLinks}
      initialOwnedTemplates={serializedOwnedTemplates}
      systemSettings={serializedSystemSettings}
    />
  );
}
