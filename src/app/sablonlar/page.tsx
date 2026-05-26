import React from "react";
import { db } from "@/lib/db";
import { seedTemplates } from "@/app/actions";
import SablonlarClient from "./sablonlar-client";

export const dynamic = "force-dynamic";

export default async function SablonlarPage() {
  // Check if any templates exist, if not, automatically seed them
  const count = await db.template.count();
  if (count === 0) {
    try {
      await seedTemplates();
    } catch (e) {
      console.error("Auto-seeding templates failed:", e);
    }
  }

  // Fetch all active templates
  const templates = await db.template.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "desc" },
  });

  return <SablonlarClient initialTemplates={templates} />;
}
