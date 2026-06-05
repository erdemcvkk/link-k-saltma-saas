import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { db } from "@/lib/db";
import AdsClient from "./ads-client";
import { getSystemSettings } from "@/app/actions";

export const metadata = {
  title: "Reklam Yönetimi | Creator.hub",
  description: "Platform genelinde reklam scriptleri ve özel banner yönetimi",
};

export const dynamic = "force-dynamic";

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

export default async function AdminAdsPage() {
  const auth = await checkAdminAuth();
  if (!auth) {
    redirect("/admin-login");
  }

  const settings = await getSystemSettings();

  return (
    <AdsClient 
      adminUserId={auth.id} 
      initialSettings={settings ? {
        id: settings.id,
        adScript: settings.adScript || "",
        customImageUrl: settings.customImageUrl || "",
        customTargetUrl: settings.customTargetUrl || "",
        isActive: settings.isActive,
        qrAdScript: settings.qrAdScript || "",
        qrCustomImageUrl: settings.qrCustomImageUrl || "",
        qrCustomTargetUrl: settings.qrCustomTargetUrl || "",
        isQrActive: settings.isQrActive !== undefined ? settings.isQrActive : true,
      } : {
        id: "",
        adScript: "",
        customImageUrl: "",
        customTargetUrl: "",
        isActive: false,
        qrAdScript: "",
        qrCustomImageUrl: "",
        qrCustomTargetUrl: "",
        isQrActive: true,
      }} 
    />
  );
}
