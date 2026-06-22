import { db } from "@/lib/db";
import { checkAndSyncUser } from "@/lib/user-sync";
import { serializeTemplate } from "@/lib/template-utils";
import DiscoverClient from "./discover-client";

export const revalidate = 0; // Load live templates every time

export default async function DiscoverPage() {
  const user = await checkAndSyncUser();
  const userId = user ? user.id : null;

  // Fetch all active templates
  const templates = await db.template.findMany({
    where: {
      isActive: true,
      category: { not: "Özel" }
    },
    orderBy: { createdAt: "desc" },
  });

  const serializedTemplates = templates.map((t) => serializeTemplate(t)).filter((t): t is any => t !== null);

  // Fetch global settings
  const settings = await db.globalSetting.findMany();
  const serializedSettings = settings.reduce((acc, curr) => {
    acc[curr.key] = curr.value;
    return acc;
  }, {} as Record<string, string>);

  const siteTitle = serializedSettings["site_title"] || "Clinkor";
  const siteLogo = serializedSettings["site_logo"] || "";

  return (
    <DiscoverClient
      initialTemplates={serializedTemplates}
      userId={userId}
      siteTitle={siteTitle}
      siteLogo={siteLogo}
    />
  );
}
