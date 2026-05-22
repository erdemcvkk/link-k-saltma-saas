import { currentUser } from "@clerk/nextjs/server";
import { db } from "./db";
import { revalidatePath } from "next/cache";

export async function checkAndEnforcePlanExpiration(user: { id: string; plan: string; planExpiresAt: Date | null }) {
  if (user.plan !== "FREE" && user.planExpiresAt && new Date() > user.planExpiresAt) {
    // Plan expired! Demote to FREE
    const updatedUser = await db.user.update({
      where: { id: user.id },
      data: {
        plan: "FREE",
        planStartedAt: null,
        planExpiresAt: null,
      },
      include: { profile: true },
    });

    revalidatePath("/admin");
    revalidatePath("/dashboard");
    revalidatePath("/");
    
    return updatedUser;
  }
  return user;
}

export async function checkAndSyncUser() {
  let clerkUser: any = await currentUser();
  if (!clerkUser) {
    if (process.env.NODE_ENV === "production") {
      return null;
    }
    // Auto-login Guest Developer Bypass for Local Testing!
    clerkUser = {
      id: "mock_user_developer_bypass",
      emailAddresses: [{ emailAddress: "developer@example.com" }],
    };
  }

  // Check if user exists in database
  let dbUser = await db.user.findUnique({
    where: { clerkUserId: clerkUser.id },
    include: { profile: true },
  });

  if (!dbUser) {
    const email = clerkUser.emailAddresses[0]?.emailAddress;
    if (!email) {
      throw new Error("User has no email address.");
    }

    dbUser = await db.user.create({
      data: {
        clerkUserId: clerkUser.id,
        email: email,
        username: "developer_hub",
        plan: "CREATOR", // Give full premium access!
        role: "ADMIN",   // Give admin privileges!
        profile: {
          create: {
            theme: "dark",
            bio: "Welcome to my developer workspace!",
          },
        },
      },
      include: { profile: true },
    });
  } else if (dbUser.clerkUserId === "mock_user_developer_bypass" && (dbUser.plan !== "CREATOR" || dbUser.role !== "ADMIN")) {
    // Always keep developer mock account upgraded!
    dbUser = await db.user.update({
      where: { id: dbUser.id },
      data: { plan: "CREATOR", role: "ADMIN" },
      include: { profile: true },
    });
  } else {
    // Check if subscription has expired
    const checkedUser = await checkAndEnforcePlanExpiration(dbUser);
    dbUser = checkedUser as any;
  }

  return dbUser;
}
