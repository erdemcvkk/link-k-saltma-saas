import { redirect } from "next/navigation";
import { checkAndSyncUser } from "@/lib/user-sync";
import { db } from "@/lib/db";
import PluginsClient from "./plugins-client";

export const revalidate = 0;

export default async function PluginsPage() {
  const user = await checkAndSyncUser();

  if (!user) {
    redirect("/sign-in");
  }

  // Fetch user addons
  const userAddons = await db.userAddon.findMany({
    where: { userId: user.id }
  });

  const serializedAddons = userAddons.map(a => ({
    id: a.id,
    addonType: a.addonType,
    isActive: a.isActive,
    config: a.config
  }));

  // Fetch products (needed for config modal)
  const products = await db.product.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  const serializedProducts = products.map((p) => ({
    id: p.id,
    title: p.title,
    type: p.type,
    price: p.price,
    description: p.description,
    fileUrl: p.fileUrl || undefined,
    isActive: p.isActive,
    salesCount: p.salesCount,
    createdAt: p.createdAt.toISOString(),
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
    <PluginsClient
      initialAddons={serializedAddons}
      initialProducts={serializedProducts}
      initialLinks={serializedLinks}
      systemSettings={serializedSystemSettings}
    />
  );
}
