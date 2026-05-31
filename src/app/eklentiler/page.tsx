import EklentilerClient from "./eklentiler-client";
import { getAddonSettings, getAddonDummyProducts } from "../actions";

export const metadata = {
 title: "Premium Eklentiler | Link.SaaS",
 description: "Link.SaaS profilinize ekstra özellikler katarak işinizi büyütün.",
};

export const dynamic = "force-dynamic";

export default async function AddonsPage() {
 const settings = await getAddonSettings();
 const products = await getAddonDummyProducts();
 
 return <EklentilerClient settings={settings} products={products.map((p: any) => ({ ...p, type: p.type || "PRODUCT", imageUrl: p.imageUrl || null }))} />;
}
