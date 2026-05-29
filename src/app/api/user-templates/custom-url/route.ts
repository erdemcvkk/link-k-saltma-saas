import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { userTemplateId, customUrl } = await req.json();

    if (!userTemplateId) {
      return NextResponse.json({ error: "Missing userTemplateId" }, { status: 400 });
    }

    const user = await db.user.findUnique({
      where: { clerkUserId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userTemplate = await db.userTemplate.findFirst({
      where: { id: userTemplateId, userId: user.id },
    });

    if (!userTemplate) {
      return NextResponse.json({ error: "User template not found or not owned" }, { status: 403 });
    }

    // If customUrl is empty or null, we just remove it
    if (!customUrl || customUrl.trim() === "") {
      await db.userTemplate.update({
        where: { id: userTemplateId },
        data: { customUrl: null },
      });
      return NextResponse.json({ success: true, customUrl: null });
    }

    const sanitizedUrl = customUrl.trim().toLowerCase();
    
    // Basic validation
    if (!/^[a-z0-9-]+$/.test(sanitizedUrl)) {
      return NextResponse.json({ error: "Sadece küçük harf, rakam ve tire (-) kullanabilirsiniz." }, { status: 400 });
    }

    if (sanitizedUrl === userTemplate.customUrl) {
      return NextResponse.json({ success: true, customUrl: sanitizedUrl });
    }

    // Check uniqueness across User.username, Profile.customDomain, UserTemplate.customUrl
    const existingUsername = await db.user.findFirst({ where: { username: sanitizedUrl } });
    if (existingUsername) {
      return NextResponse.json({ error: "Bu bağlantı adresi (kullanıcı adı) zaten kullanımda." }, { status: 400 });
    }

    const existingDomain = await db.profile.findFirst({ where: { customDomain: sanitizedUrl } });
    if (existingDomain) {
      return NextResponse.json({ error: "Bu bağlantı adresi (domain) zaten kullanımda." }, { status: 400 });
    }

    const existingCustomUrl = await db.userTemplate.findFirst({ where: { customUrl: sanitizedUrl } });
    if (existingCustomUrl) {
      return NextResponse.json({ error: "Bu şablon bağlantısı başka biri tarafından kullanılıyor." }, { status: 400 });
    }

    const updated = await db.userTemplate.update({
      where: { id: userTemplateId },
      data: { customUrl: sanitizedUrl },
    });

    return NextResponse.json({ success: true, customUrl: updated.customUrl });

  } catch (error: any) {
    console.error("[CUSTOM_URL_UPDATE]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
