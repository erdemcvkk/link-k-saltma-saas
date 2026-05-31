import { redirect } from "next/navigation";
import { checkAndSyncUser } from "@/lib/user-sync";
import { db } from "@/lib/db";
import BillingClient from "./billing-client";

export const revalidate = 0; // Fresh results every load

export default async function BillingPage() {
  const user = await checkAndSyncUser();

  if (!user) {
    redirect("/sign-in");
  }

  if (user.isBanned) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-6 text-center">
        <div className="max-w-md p-4 md:p-8 rounded-3xl bg-zinc-950 border border-red-500/20 shadow-[0_0_30px_rgba(239,68,68,0.1)] space-y-6">
          <div className="w-16 h-16 rounded-full bg-red-950/20 border border-red-500/30 flex items-center justify-center mx-auto text-red-500 animate-pulse">
            <span className="text-xl font-bold">!</span>
          </div>
          <h1 className="text-xl font-extrabold text-red-400">Billing Access Suspended</h1>
          <p className="text-zinc-500 text-xs leading-relaxed">
            Your billing portal access has been suspended due to violations of our community guidelines.
          </p>
        </div>
      </div>
    );
  }

  // Fetch payment logs
  const payments = await db.payment.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  // Fetch global settings
  const settings = await db.globalSetting.findMany();
  const serializedSettings = settings.reduce((acc, curr) => {
    acc[curr.key] = curr.value;
    return acc;
  }, {} as Record<string, string>);

  return (
    <BillingClient
      userId={user.id}
      currentPlan={user.plan}
      planStartedAt={user.planStartedAt ? user.planStartedAt.toISOString() : null}
      planExpiresAt={user.planExpiresAt ? user.planExpiresAt.toISOString() : null}
      payments={payments}
      globalSettings={serializedSettings}
    />
  );
}
