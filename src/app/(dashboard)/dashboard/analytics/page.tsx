import { redirect } from "next/navigation";
import { checkAndSyncUser } from "@/lib/user-sync";
import { db } from "@/lib/db";
import AnalyticsClient from "./analytics-client";

export const revalidate = 0;

export default async function AnalyticsPage() {
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

  // Fetch page views
  const pageViews = await db.pageView.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "asc" },
  });

  const serializedLinks = links.map((l) => ({
    id: l.id,
    title: l.title,
    url: l.url,
    clicks: l.clicks.map((c) => ({
      id: c.id,
      createdAt: c.createdAt.toISOString(),
    })),
  }));

  const serializedPageViews = pageViews.map((pv) => ({
    id: pv.id,
    device: pv.device,
    browser: pv.browser,
    country: pv.country,
    referrer: pv.referrer,
    createdAt: pv.createdAt.toISOString(),
  }));

  return (
    <AnalyticsClient
      initialLinks={serializedLinks}
      initialPageViews={serializedPageViews}
    />
  );
}
