import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { db } from "@/lib/db";
import FeaturesClient from "./features-client";

export const revalidate = 0;

async function checkAdminAuth() {
  const cookieStore = await cookies();
  const superAdminSession = cookieStore.get("super-admin-session")?.value;
  const adminSession = cookieStore.get("admin-session")?.value;

  if (superAdminSession && superAdminSession === process.env.SUPER_ADMIN_TOKEN) {
    return { role: "SUPER_ADMIN", id: "super-admin" };
  }

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

export default async function AdminFeaturesPage() {
  const auth = await checkAdminAuth();

  if (!auth) {
    redirect("/admin-login");
  }

  const features = await db.feature.findMany({
    include: {
      plans: true,
    },
    orderBy: { createdAt: "desc" },
  });

  const serializedFeatures = features.map((f) => ({
    id: f.id,
    key: f.key,
    title: f.title,
    description: f.description,
    plans: f.plans.map(p => p.plan),
    createdAt: f.createdAt.toISOString(),
  }));

  return (
    <FeaturesClient
      adminUserId={auth.id}
      adminRole={auth.role}
      initialFeatures={serializedFeatures}
    />
  );
}
