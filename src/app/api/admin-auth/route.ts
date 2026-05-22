import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { createHash } from "crypto";
import { cookies } from "next/headers";

function hashPassword(password: string): string {
  return createHash("sha256").update(password + process.env.ADMIN_TOKEN).digest("hex");
}

// POST /api/admin-auth/login
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, type } = body;

    // Süper Admin girişi - sadece şifre
    if (type === "super") {
      const superToken = process.env.SUPER_ADMIN_TOKEN;
      if (!superToken || password !== superToken) {
        return NextResponse.json({ error: "Geçersiz şifre" }, { status: 401 });
      }
      const response = NextResponse.json({ success: true, role: "SUPER_ADMIN" });
      response.cookies.set("super-admin-session", superToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24, // 24 saat
        path: "/",
      });
      return response;
    }

    // Admin girişi - email + şifre
    if (type === "admin") {
      if (!email || !password) {
        return NextResponse.json({ error: "E-posta ve şifre gereklidir" }, { status: 400 });
      }

      const adminUser = await db.adminUser.findUnique({
        where: { email: email.toLowerCase().trim() },
      });

      if (!adminUser || !adminUser.isActive) {
        return NextResponse.json({ error: "Geçersiz e-posta veya şifre" }, { status: 401 });
      }

      const hashedPassword = hashPassword(password);
      if (adminUser.passwordHash !== hashedPassword) {
        return NextResponse.json({ error: "Geçersiz e-posta veya şifre" }, { status: 401 });
      }

      // Son giriş zamanını güncelle
      await db.adminUser.update({
        where: { id: adminUser.id },
        data: { lastLoginAt: new Date() },
      });

      const sessionToken = createHash("sha256")
        .update(adminUser.id + adminUser.email + Date.now())
        .digest("hex");

      const response = NextResponse.json({ success: true, role: adminUser.role });
      response.cookies.set("admin-session", sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 8, // 8 saat
        path: "/",
      });
      // Admin ID'sini de saklayalım
      response.cookies.set("admin-id", adminUser.id, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 8,
        path: "/",
      });
      return response;
    }

    return NextResponse.json({ error: "Geçersiz giriş tipi" }, { status: 400 });
  } catch (error) {
    console.error("Admin login error:", error);
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}

// POST /api/admin-auth/logout
export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.delete("admin-session");
  response.cookies.delete("super-admin-session");
  response.cookies.delete("admin-id");
  return response;
}
