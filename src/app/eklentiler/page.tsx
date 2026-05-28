import EklentilerClient from "./eklentiler-client";

export const metadata = {
  title: "Premium Eklentiler | Link.SaaS",
  description: "Link.SaaS profilinize ekstra özellikler katarak işinizi büyütün.",
};

export const dynamic = "force-dynamic";

export default async function AddonsPage() {
  return <EklentilerClient />;
}
