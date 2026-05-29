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
      include: {
        profile: true,
        links: {
          where: { isActive: true },
          orderBy: { order: "asc" },
        },
        purchasedTemplates: {
          include: { template: true }
        },
        ownedAddons: {
          where: { isActive: true }
        }
      },
    });
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

    const baseUsername = email.split("@")[0].replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
    const uniqueSuffix = Math.random().toString(36).substring(2, 6);
    const username = `${baseUsername}${uniqueSuffix}`;

    dbUser = await db.user.create({
      data: {
        clerkUserId: clerkUser.id,
        email: email,
        username: username,
        plan: "FREE", 
        role: "USER",
        profile: {
          create: {
            theme: "dark",
            bio: "Merhaba, Link ağacıma hoş geldiniz!",
          },
        },
      },
      include: { profile: true },
    });
  } else {
    // Check if subscription has expired
    const checkedUser = await checkAndEnforcePlanExpiration(dbUser);
    dbUser = checkedUser as any;
  }

  return dbUser;
}
