import { checkAndSyncUser } from "@/lib/user-sync";

export async function buyAddonAction(addonType: string) {
  const user = await checkAndSyncUser();
  if (!user) throw new Error("Unauthorized");
  return await purchaseAddon(user.id, addonType);
}
