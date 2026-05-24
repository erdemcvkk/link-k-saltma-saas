import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { db } from "@/lib/db";
import AdminClient from "./admin-client";

export const revalidate = 0;

async function checkAdminAuth() {
  const cookieStore = await cookies();
  const superAdminSession = cookieStore.get("super-admin-session")?.value;
  const adminSession = cookieStore.get("admin-session")?.value;

  // Süper admin kontrolü
  if (superAdminSession && superAdminSession === process.env.SUPER_ADMIN_TOKEN) {
    return { role: "SUPER_ADMIN", id: "super-admin" };
  }

  // Admin session kontrolü
  if (adminSession) {
    const adminId = cookieStore.get("admin-id")?.value;
    if (adminId) {
      const adminUser = await db.adminUser.findUnique({
        where: { id: adminId, isActive: true },
      });
      if (adminUser) {
        return { role: adminUser.role, id: adminUser.id };
      }
    }
  }

  return null;
}

export default async function AdminPage() {
  const auth = await checkAdminAuth();

  if (!auth) {
    redirect("/admin-login");
  }

  // Fetch all users
  const users = await db.user.findMany({
    orderBy: { createdAt: "desc" },
  });

  const totalUsers = users.length;
  const starterCount = users.filter((u) => u.plan === "STARTER").length;
  const creatorCount = users.filter((u) => u.plan === "CREATOR").length;

  const paymentsSum = await db.payment.aggregate({
    where: { status: "SUCCESS" },
    _sum: { amount: true },
  });
  const totalRevenue = paymentsSum._sum.amount ?? 0;

  const settings = await db.globalSetting.findMany();
  const serializedSettings = settings.reduce((acc, curr) => {
    acc[curr.key] = curr.value;
    return acc;
  }, {} as Record<string, string>);

  const serializedUsers = users.map((u) => ({
    id: u.id,
    email: u.email,
    username: u.username,
    plan: u.plan,
    role: u.role,
    isBanned: u.isBanned,
    planStartedAt: u.planStartedAt ? u.planStartedAt.toISOString() : null,
    planExpiresAt: u.planExpiresAt ? u.planExpiresAt.toISOString() : null,
    createdAt: u.createdAt,
  }));

  const stats = { totalUsers, starterCount, creatorCount, totalRevenue };

  const dbFonts = await db.managedFont.findMany({ orderBy: { name: "asc" } });
  const serializedFonts = dbFonts.map((f) => ({
    id: f.id,
    name: f.name,
    value: f.value,
    tier: f.tier,
    createdAt: f.createdAt.toISOString(),
  }));

  const dbSliderItems = await db.sliderItem.findMany({ orderBy: { createdAt: "asc" } });
  const serializedSliderItems = dbSliderItems.map((item) => ({
    id: item.id,
    title: item.title,
    imageUrl: item.imageUrl,
    link: item.link || undefined,
  }));

  return (
    <AdminClient
      adminUserId={auth.id}
      adminRole={auth.role}
      initialUsers={serializedUsers}
      initialSettings={serializedSettings}
      stats={stats}
      initialFonts={serializedFonts}
      initialSliderItems={serializedSliderItems}
    />
  );
}
