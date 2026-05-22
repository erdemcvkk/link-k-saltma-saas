import { redirect } from "next/navigation";
import { checkAndSyncUser } from "@/lib/user-sync";
import { db } from "@/lib/db";
import AdminClient from "./admin-client";

export const revalidate = 0; // Load fresh stats every time

export default async function AdminPage() {
  const admin = await checkAndSyncUser();

  // Authentication check
  if (!admin) {
    redirect("/sign-in");
  }

  // Authorization check
  if (admin.role !== "ADMIN") {
    redirect("/dashboard");
  }

  // Fetch all users in directory
  const users = await db.user.findMany({
    orderBy: { createdAt: "desc" },
  });

  // Calculate platform metrics
  const totalUsers = users.length;
  const starterCount = users.filter((u) => u.plan === "STARTER").length;
  const creatorCount = users.filter((u) => u.plan === "CREATOR").length;

  const paymentsSum = await db.payment.aggregate({
    where: { status: "SUCCESS" },
    _sum: {
      amount: true,
    },
  });
  const totalRevenue = paymentsSum._sum.amount ?? 0;

  // Fetch global settings
  const settings = await db.globalSetting.findMany();
  const serializedSettings = settings.reduce((acc, curr) => {
    acc[curr.key] = curr.value;
    return acc;
  }, {} as Record<string, string>);

  // Map database users to match AdminClient UserItem types
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

  const stats = {
    totalUsers,
    starterCount,
    creatorCount,
    totalRevenue,
  };

  // Fetch managed fonts
  const dbFonts = await db.managedFont.findMany({
    orderBy: { name: "asc" }
  });
  const serializedFonts = dbFonts.map(f => ({
    id: f.id,
    name: f.name,
    value: f.value,
    tier: f.tier,
    createdAt: f.createdAt.toISOString(),
  }));

  return (
    <AdminClient
      adminUserId={admin.id}
      initialUsers={serializedUsers}
      initialSettings={serializedSettings}
      stats={stats}
      initialFonts={serializedFonts}
    />
  );
}
