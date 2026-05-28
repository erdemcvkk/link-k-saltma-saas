import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import StorefrontPreview from "@/components/storefront-preview";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ username: string; addonSlug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const username = resolvedParams.username.replace("%40", "");

  const user = await db.user.findUnique({
    where: { username },
    include: { profile: true },
  });

  if (!user || !user.profile) return { title: "Not Found" };

  return {
    title: `${user.profile.displayName || user.username} - Addon`,
    description: user.profile.bio || "Link-in-bio addon",
  };
}

export default async function AddonPage({ params }: { params: Promise<{ username: string; addonSlug: string }> }) {
  const resolvedParams = await params;
  const username = resolvedParams.username.replace("%40", "");
  const addonSlug = resolvedParams.addonSlug;

  const user = await db.user.findUnique({
    where: { username },
    include: { profile: true },
  });

  if (!user || !user.profile) {
    notFound();
  }

  // Find active addons
  const addons = await db.userAddon.findMany({
    where: { userId: user.id, isActive: true },
  });

  // Find the addon that matches this slug
  // The slug is stored in config.customSlug
  const matchingAddon = addons.find(a => {
    try {
      if (!a.config) return false;
      const parsed = JSON.parse(a.config);
      return parsed.customSlug && parsed.customSlug.toLowerCase() === addonSlug.toLowerCase();
    } catch {
      return false;
    }
  });

  if (!matchingAddon) {
    notFound();
  }

  let parsedConfig: any = { theme: 'classic' };
  try { if (matchingAddon.config) parsedConfig = JSON.parse(matchingAddon.config); } catch (e) {}

  if (matchingAddon.addonType === "MINI_STORE") {
    const products = await db.product.findMany({
      where: { userId: user.id, isActive: true },
      orderBy: { createdAt: "desc" },
    });

    return (
      <div className="w-full min-h-screen bg-[#f8f9fa] overflow-hidden">
        <StorefrontPreview 
          theme={parsedConfig.theme as any} 
          onProductClick={undefined}
          products={products.map(p => ({
            id: p.id,
            title: p.title,
            type: p.type,
            price: p.price.toString(),
            imageUrl: p.imageUrl || p.fileUrl,
            description: p.description || ""
          }))} 
          storeTitle={parsedConfig.storeTitle || user.profile.displayName || "Mağazam"}
          storeCoverUrl={parsedConfig.storeCoverUrl || user.profile.background || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1000&q=80"}
          avatarUrl={parsedConfig.storeAvatarUrl || user.profile.avatarUrl}
          username={parsedConfig.storeUsername || ("@" + user.username)}
          bio={parsedConfig.storeBio || user.profile.bio}
          buyButtonText={parsedConfig.buyButtonText || "Satın Al"}
        />
      </div>
    );
  }

  // Fallback for other addon types
  return (
    <div className="flex items-center justify-center min-h-screen">
      <h1>Addon: {matchingAddon.addonType}</h1>
    </div>
  );
}
