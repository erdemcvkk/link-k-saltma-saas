import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const clerkUser = await currentUser();
    if (!clerkUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch user from DB
    const dbUser = await db.user.findUnique({
      where: { clerkUserId: clerkUser.id },
    });

    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const body = await req.json();
    const { title, url, type = "WEBSITE", blockType = "TEXT_LINK" } = body;

    if (!title || !url) {
      return NextResponse.json({ error: "Title and URL are required" }, { status: 400 });
    }

    // Count existing links
    const linkCount = await db.link.count({
      where: { userId: dbUser.id },
    });

    // Feature gating check
    if (dbUser.plan === "FREE" && linkCount >= 20) {
      return NextResponse.json(
        { error: "Limit aşıldı. Ücretsiz plan limitiniz 20 linktir. Lütfen Premium plana yükseltin." },
        { status: 403 }
      );
    }

    if (dbUser.plan === "STARTER" && linkCount >= 100) {
      return NextResponse.json(
        { error: "Limit aşıldı. Starter plan limitiniz 100 linktir. Lütfen Creator plana yükseltin." },
        { status: 403 }
      );
    }

    // Template gating validation
    const isTemplateUnlocked = (templateType: string, plan: string, role: string) => {
      if (plan === "CREATOR" || plan === "PRO_BUSINESS" || role === "ADMIN") return true;
      
      const starterTemplates = ["WEBSITE", "FACEBOOK", "INSTAGRAM", "WHATSAPP", "WIFI", "VCARD", "IMAGES", "SOCIAL_MEDIA", "VIDEO", "COUPON"];
      const freeTemplates = ["WEBSITE", "FACEBOOK", "INSTAGRAM", "WHATSAPP", "WIFI"];
      
      if (plan === "STARTER") {
        return starterTemplates.includes(templateType);
      }
      return freeTemplates.includes(templateType);
    };

    if (!isTemplateUnlocked(type, dbUser.plan, dbUser.role)) {
      return NextResponse.json(
        { error: `The "${type}" link action requires a premium plan. Please upgrade to unlock!` },
        { status: 403 }
      );
    }

    // Create the link
    const newLink = await db.link.create({
      data: {
        userId: dbUser.id,
        title,
        url,
        type,
        blockType,
        order: linkCount,
        isActive: true,
      },
    });

    return NextResponse.json(newLink, { status: 201 });
  } catch (error: any) {
    console.error("API link creation error:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
