import { db } from "@/lib/db";
import DiscoverClient from "./discover-client";

export const revalidate = 0; // Load live creators every time

export default async function DiscoverPage() {
 // Query all creators with username and active profile
 const users = await db.user.findMany({
 where: {
 username: { not: null },
 isBanned: false,
 },
 include: {
 profile: true,
 products: {
 where: { isActive: true },
 },
 },
 orderBy: {
 createdAt: "desc",
 },
 });

 // Map to matching client list items
 const creators = users.map((u) => ({
 id: u.id,
 username: u.username!,
 bio: u.profile?.bio || "Welcome to my space!",
 theme: u.profile?.theme || "dark",
 productCount: u.products.length,
 plan: u.plan,
 featuredProducts: u.products.slice(0, 2).map((p) => ({
 id: p.id,
 title: p.title,
 price: p.price,
 type: p.type,
 })),
 }));

 // Fetch global settings
 const settings = await db.globalSetting.findMany();
 const serializedSettings = settings.reduce((acc, curr) => {
 acc[curr.key] = curr.value;
 return acc;
 }, {} as Record<string, string>);

 const siteTitle = serializedSettings["site_title"] || "CREATOR.HUB";
 const siteLogo = serializedSettings["site_logo"] || "";

 return <DiscoverClient initialCreators={creators} siteTitle={siteTitle} siteLogo={siteLogo} />;
}
