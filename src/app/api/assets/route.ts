import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import fs from "fs";
import path from "path";

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

    // Gating check: Only premium plans (STARTER, CREATOR, PRO_BUSINESS) can upload assets
    if (dbUser.plan === "FREE") {
      return NextResponse.json(
        { error: "Özel dosya/asset yükleme özelliği Premium planlara özeldir. Lütfen planınızı yükseltin!" },
        { status: 403 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;
    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    await fs.promises.mkdir(uploadsDir, { recursive: true });

    const ext = path.extname(file.name || ".bin");
    const newFileName = `${crypto.randomUUID()}${ext}`;
    const newPath = path.join(uploadsDir, newFileName);

    await fs.promises.writeFile(newPath, buffer);
    const url = `/uploads/${newFileName}`;

    // Add to Media log in DB
    const media = await db.media.create({
      data: {
        filename: file.name ?? newFileName,
        url,
        mimeType: file.type ?? "application/octet-stream",
        size: file.size,
      },
    });

    return NextResponse.json(media, { status: 201 });
  } catch (error: any) {
    console.error("Asset upload error:", error);
    return NextResponse.json({ error: error.message || "File upload failed" }, { status: 500 });
  }
}
