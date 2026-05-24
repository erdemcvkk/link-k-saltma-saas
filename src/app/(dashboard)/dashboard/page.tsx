import { redirect } from "next/navigation";
import { checkAndSyncUser } from "@/lib/user-sync";
import { db } from "@/lib/db";
import DashboardClient from "./dashboard-client";

export const revalidate = 0; // Disable cache to fetch real-time pageviews and clicks

export default async function DashboardPage() {
  const user = await checkAndSyncUser();

  if (!user) {
    redirect("/sign-in");
  }

  if (user.isBanned) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-6 text-center">
        <div className="max-w-md p-8 rounded-3xl bg-zinc-950 border border-red-500/20 shadow-[0_0_30px_rgba(239,68,68,0.1)] space-y-6">
          <div className="w-16 h-16 rounded-full bg-red-950/20 border border-red-500/30 flex items-center justify-center mx-auto text-red-500 animate-pulse">
            <span className="text-xl font-bold">!</span>
          </div>
          <h1 className="text-xl font-extrabold text-red-400">Studio Access Suspended</h1>
          <p className="text-zinc-500 text-xs leading-relaxed">
            Your creator workspace has been suspended due to violations of our community guidelines.
          </p>
          <p className="text-zinc-600 text-[10px]">
            Please contact support if you believe this is an error.
          </p>
        </div>
      </div>
    );
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

  // Fetch page views
  const pageViews = await db.pageView.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "asc" },
  });

  // Fetch products
  const products = await db.product.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  // Fetch QR codes
  const qrCodes = await db.qrCode.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  // Fetch global settings
  const settings = await db.globalSetting.findMany();
  const serializedSettings = settings.reduce((acc, curr) => {
    acc[curr.key] = curr.value;
    return acc;
  }, {} as Record<string, string>);

  // Map user with full Profile SEO and custom domain properties
  const serializedUser = {
    id: user.id,
    username: user.username,
    plan: user.plan,
    role: user.role,
    planStartedAt: user.planStartedAt ? user.planStartedAt.toISOString() : null,
    planExpiresAt: user.planExpiresAt ? user.planExpiresAt.toISOString() : null,
    profile: user.profile ? {
      theme: user.profile.theme,
      bio: user.profile.bio,
      avatarUrl: user.profile.avatarUrl,
      background: user.profile.background,
      seoTitle: user.profile.seoTitle,
      seoDescription: user.profile.seoDescription,
      seoKeywords: user.profile.seoKeywords,
      customDomain: user.profile.customDomain,
      fontStyle: user.profile.fontStyle,
      bioColor: user.profile.bioColor,
      usernameColor: user.profile.usernameColor,
    } : null,
  };

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

  const serializedPageViews = pageViews.map((pv) => ({
    id: pv.id,
    device: pv.device,
    browser: pv.browser,
    country: pv.country,
    referrer: pv.referrer,
    createdAt: pv.createdAt.toISOString(),
  }));

  const serializedProducts = products.map((p) => ({
    id: p.id,
    title: p.title,
    type: p.type,
    price: p.price,
    description: p.description,
    fileUrl: p.fileUrl,
    isActive: p.isActive,
    salesCount: p.salesCount,
    createdAt: p.createdAt.toISOString(),
  }));

  const serializedQrCodes = qrCodes.map((qr) => ({
    id: qr.id,
    name: qr.name,
    type: qr.type,
    value: qr.value,
    fgColor: qr.fgColor,
    bgColor: qr.bgColor,
    logoUrl: qr.logoUrl,
    createdAt: qr.createdAt.toISOString(),
  }));

  // Fetch managed fonts from database
  const dbFonts = await db.managedFont.findMany({
    orderBy: { name: "asc" },
  });
  const serializedFonts = dbFonts.map(f => ({
    id: f.id,
    name: f.name,
    value: f.value,
    tier: f.tier,
    giftLabel: f.giftLabel,
  }));

  return (
    <DashboardClient
      initialUser={serializedUser}
      initialLinks={serializedLinks}
      initialPageViews={serializedPageViews}
      initialProducts={serializedProducts}
      globalSettings={serializedSettings}
      initialFonts={serializedFonts}
      initialQrCodes={serializedQrCodes}
    />
  );
}
