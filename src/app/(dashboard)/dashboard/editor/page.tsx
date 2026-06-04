import { redirect } from "next/navigation";
import { checkAndSyncUser } from "@/lib/user-sync";
import { db } from "@/lib/db";
import EditorClient from "./editor-client";

export const revalidate = 0;

export default async function EditorPage() {
  const user = await checkAndSyncUser();

  if (!user) {
    redirect("/sign-in");
  }

  // Fetch user's links including link clicks
  const links = await db.link.findMany({
    where: { userId: user.id },
    include: {
      clicks: {
        select: {
          id: true,
          createdAt: true,
        },
      },
    },
    orderBy: { order: "asc" },
  });

  const serializedLinks = links.map((l) => ({
    id: l.id,
    title: l.title,
    url: l.url,
    isActive: l.isActive,
    type: l.type,
    animation: l.animation || "",
    bgColor: l.bgColor ?? null,
    textColor: l.textColor ?? null,
    borderColor: l.borderColor ?? null,
    borderStyle: l.borderStyle ?? null,
    borderWidth: l.borderWidth ?? null,
    borderRadius: l.borderRadius ?? null,
    shadow: l.shadow ?? null,
    fontWeight: l.fontWeight ?? null,
    blockType: l.blockType || "TEXT_LINK",
    metadata: l.metadata ?? null,
    clicks: l.clicks.map((c) => ({
      id: c.id,
      createdAt: c.createdAt.toISOString(),
    })),
  }));

  return <EditorClient initialLinks={serializedLinks} />;
}
