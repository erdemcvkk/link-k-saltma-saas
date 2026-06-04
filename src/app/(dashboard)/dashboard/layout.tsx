import { redirect } from "next/navigation";
import { checkAndSyncUser } from "@/lib/user-sync";
import { db } from "@/lib/db";
import { DashboardProvider } from "./dashboard-context";
import DashboardLayoutClient from "./dashboard-layout-client";

export const revalidate = 0;

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await checkAndSyncUser();

  if (!user) {
    redirect("/sign-in");
  }

  if (user.isBanned) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-3 md:p-6 text-center">
        <div className="max-w-md p-4 md:p-8 rounded-3xl bg-zinc-950 border border-red-500/20 shadow-[0_0_30px_rgba(239,68,68,0.1)] space-y-6">
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

  // Fetch global settings
  const settings = await db.globalSetting.findMany();
  const serializedSettings = settings.reduce((acc, curr) => {
    acc[curr.key] = curr.value;
    return acc;
  }, {} as Record<string, string>);

  // Map user with profile details
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
      customCss: user.profile.customCss,
      buttonClass: user.profile.buttonClass,
    } : null,
  };

  // Fetch managed fonts
  let dbFonts: any[] = [];
  try {
    dbFonts = await db.managedFont.findMany({
      orderBy: { name: "asc" },
    });
  } catch (err) {
    dbFonts = [
      { id: "1", name: "Inter", value: "Inter", tier: "FREE", giftLabel: null },
      { id: "2", name: "Roboto", value: "Roboto", tier: "FREE", giftLabel: null },
      { id: "3", name: "Outfit", value: "Outfit", tier: "FREE", giftLabel: null },
      { id: "4", name: "Playfair Display", value: "Playfair Display", tier: "FREE", giftLabel: null },
      { id: "5", name: "Montserrat", value: "Montserrat", tier: "FREE", giftLabel: null },
      { id: "6", name: "Poppins", value: "Poppins", tier: "FREE", giftLabel: null },
      { id: "7", name: "Open Sans", value: "Open Sans", tier: "FREE", giftLabel: null },
      { id: "8", name: "Lato", value: "Lato", tier: "FREE", giftLabel: null },
      { id: "9", name: "Oswald", value: "Oswald", tier: "FREE", giftLabel: null },
      { id: "10", name: "Raleway", value: "Raleway", tier: "FREE", giftLabel: null }
    ];
  }

  const serializedFonts = dbFonts.map(f => ({
    id: f.id,
    name: f.name,
    value: f.value,
    tier: f.tier,
    giftLabel: f.giftLabel,
  }));

  // Fetch features
  const features = await db.feature.findMany({
    include: { plans: true }
  });
  const serializedFeatures = features.map(f => ({
    key: f.key,
    plans: f.plans.map(p => p.plan)
  }));

  // Fetch active user template
  const activeUserTemplate = await db.userTemplate.findFirst({
    where: { userId: user.id, isActive: true },
    include: { template: true }
  });

  const serializedActiveTemplate = activeUserTemplate ? {
    id: activeUserTemplate.template.id,
    name: activeUserTemplate.template.name,
    bgColor: activeUserTemplate.template.bgColor,
    fontStyle: activeUserTemplate.template.fontStyle,
    buttonStyle: activeUserTemplate.template.buttonStyle,
    isCoded: activeUserTemplate.template.isCoded,
    customCss: activeUserTemplate.template.customCss,
    configJson: activeUserTemplate.template.configJson
  } : null;

  return (
    <DashboardProvider
      initialUser={serializedUser}
      globalSettings={serializedSettings}
      initialFonts={serializedFonts}
      initialFeatures={serializedFeatures}
      initialActiveTemplate={serializedActiveTemplate}
    >
      <DashboardLayoutClient>{children}</DashboardLayoutClient>
    </DashboardProvider>
  );
}
