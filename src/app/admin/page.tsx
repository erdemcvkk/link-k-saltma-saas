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

  let dbFonts: any[] = [];
  try {
    dbFonts = await db.managedFont.findMany({ orderBy: { name: "asc" } });
  } catch (err) {
    dbFonts = [
      { id: "1", name: "Inter", value: "Inter", tier: "FREE", createdAt: new Date() },
      { id: "2", name: "Roboto", value: "Roboto", tier: "FREE", createdAt: new Date() },
      { id: "3", name: "Outfit", value: "Outfit", tier: "FREE", createdAt: new Date() }
    ];
  }

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

  const dbBlogs = await db.blog.findMany({ orderBy: { publishedAt: "desc" } });
  const serializedBlogs = dbBlogs.map((b) => ({
    id: b.id,
    title: b.title,
    slug: b.slug,
    content: b.content,
    imageUrl: b.imageUrl || null,
    publishedAt: b.publishedAt.toISOString(),
    createdAt: b.createdAt.toISOString(),
  }));

  const dbFaqs = await db.faq.findMany({ orderBy: { createdAt: "desc" } });
  const serializedFaqs = dbFaqs.map((f) => ({
    id: f.id,
    question: f.question,
    answer: f.answer,
  }));

  const dbFooterSections = await db.footerSection.findMany({
    include: { links: true },
    orderBy: { order: "asc" },
  });

  const serializedFooterSections = dbFooterSections.map((sec) => ({
    id: sec.id,
    title: sec.title,
    order: sec.order,
    links: sec.links
      .sort((a, b) => a.order - b.order)
      .map((link) => ({
        id: link.id,
        label: link.label,
        url: link.url,
        order: link.order,
        sectionId: link.sectionId,
      })),
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
      initialBlogs={serializedBlogs}
      initialFaqs={serializedFaqs}
      initialFooterSections={serializedFooterSections}
    />
  );
}
