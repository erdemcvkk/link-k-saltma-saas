import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { db } from "@/lib/db";
import AddonsClient from "./addons-client";
import { getAddonSettings, getAddonDummyProducts } from "../../actions";

export const metadata = {
 title: "Eklenti Yönetimi | Creator.hub",
 description: "Platform eklentileri ve mağaza vitrini konfigürasyonu",
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

export default async function AdminAddonsPage() {
 const auth = await checkAdminAuth();
 if (!auth) {
 redirect("/admin-login");
 }

 const settings = await getAddonSettings();
 const products = await getAddonDummyProducts();

 return <AddonsClient adminUserId={auth.id} initialSettings={settings} initialProducts={products} />;
}
