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

  return (
    <PluginsClient
      initialAddons={serializedAddons}
      initialProducts={serializedProducts}
    />
  );
}
