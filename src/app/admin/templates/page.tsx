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

  let fonts: any[] = [];
  try {
    fonts = await db.managedFont.findMany({
      orderBy: { name: "asc" },
    });
  } catch (err) {
    fonts = [
      { name: "Inter", value: "Inter" },
      { name: "Roboto", value: "Roboto" },
      { name: "Outfit", value: "Outfit" },
      { name: "Playfair Display", value: "Playfair Display" },
      { name: "Montserrat", value: "Montserrat" },
      { name: "Poppins", value: "Poppins" },
      { name: "Open Sans", value: "Open Sans" },
      { name: "Lato", value: "Lato" },
      { name: "Oswald", value: "Oswald" },
      { name: "Raleway", value: "Raleway" }
    ];
  }

 const serializedFonts = fonts.map(f => ({
   name: f.name,
   value: f.value,
 }));

 return (
 <TemplatesClient
 adminUserId={auth.id}
 adminRole={auth.role}
 initialTemplates={serializedTemplates}
 fonts={serializedFonts}
 />
 );
}
