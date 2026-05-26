import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { db } from "@/lib/db";
import TemplatesClient from "./templates-client";

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

export default async function AdminTemplatesPage() {
  const auth = await checkAdminAuth();

  if (!auth) {
    redirect("/admin-login");
  }

  const templates = await db.template.findMany({
    orderBy: { createdAt: "desc" },
  });

  const serializedTemplates = templates.map((t) => ({
    id: t.id,
    name: t.name,
    price: t.price,
    category: t.category,
    coverUrl: t.coverUrl,
    bgColor: t.bgColor,
    fontStyle: t.fontStyle,
    buttonStyle: t.buttonStyle,
    paymentLink: t.paymentLink,
    isActive: t.isActive,
    isCoded: t.isCoded,
    customCss: t.customCss,
    configJson: t.configJson,
    createdAt: t.createdAt.toISOString(),
  }));

  return (
    <TemplatesClient
      adminUserId={auth.id}
      adminRole={auth.role}
      initialTemplates={serializedTemplates}
    />
  );
}
