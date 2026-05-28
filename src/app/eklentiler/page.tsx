import EklentilerClient from "./eklentiler-client";
import { getAddonSettings, getAddonDummyProducts } from "../actions";

export const metadata = {
  title: "Eklentiler & Mağaza | Link.SaaS",
  description: "Link.SaaS profilinize ekstra özellikler katarak işinizi büyütün.",
};

export const dynamic = "force-dynamic"; // To ensure it fetches fresh data

export default async function AddonsPage() {
  const settings = await getAddonSettings();
  const products = await getAddonDummyProducts();
  
  // Sadece aktif ürünleri frontend'e gönder
  const activeProducts = products.filter(p => p.isActive);

  return <EklentilerClient products={activeProducts} settings={settings} />;
}
