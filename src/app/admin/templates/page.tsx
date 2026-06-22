import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { db } from "@/lib/db";
import { serializeTemplate } from "@/lib/template-utils";
import TemplateManager from "@/components/dashboard/template-manager";

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

  const serializedTemplates = templates.map((t) => serializeTemplate(t)).filter((t): t is any => t !== null);

  return <TemplateManager adminUserId={auth.id} initialTemplates={serializedTemplates} />;
}
