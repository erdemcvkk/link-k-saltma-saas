"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

async function ensureAdmin(adminUserId: string) {
  const cookieStore = await cookies();
  const superAdminSession = cookieStore.get("super-admin-session")?.value;
  const adminSession = cookieStore.get("admin-session")?.value;
  const superAdminToken = process.env.SUPER_ADMIN_TOKEN;

  // 1. Super Admin Session Cookie Verification
  if (superAdminSession && superAdminToken && superAdminSession === superAdminToken) {
    return; // Authorized
  }

  // 2. Admin User Session Verification
  if (adminSession) {
    const adminId = cookieStore.get("admin-id")?.value;
    if (adminId) {
      const adminUser = await db.adminUser.findUnique({
        where: { id: adminId, isActive: true },
        select: { role: true },
      });
      if (adminUser && adminUser.role === "ADMIN") {
        return; // Authorized
      }
    }
  }

  // 3. Fallback: User Table verification for backward compatibility
  if (adminUserId && adminUserId !== "super-admin") {
    const user = await db.user.findUnique({
      where: { id: adminUserId },
      select: { role: true },
    });
    if (user && user.role === "ADMIN") {
      return; // Authorized
    }
  }

  throw new Error("Unauthorized: Admin privilege required");
}

export async function createTemplateAction(
  adminUserId: string,
  data: {
    name: string;
    price: number;
    category: string;
    coverUrl: string;
    bgColor: string;
    fontStyle: string;
    buttonStyle: string;
    paymentLink?: string;
    paymentUrl?: string;
    isActive: boolean;
    isCoded: boolean;
    customCss?: string;
    configJson?: string;
    customHtml?: string;
    masterLayoutHtml?: string;
    avatarHtml?: string;
    headerHtml?: string;
    socialHtml?: string;
    linksHtml?: string;
    backgroundHtml?: string;
    containerClasses?: string;
    jsonConfig?: string;
    customSchema?: string;
    isComingSoon?: boolean;
  }
) {
  await ensureAdmin(adminUserId);
  if (!data.name || data.price === undefined || !data.category) {
    throw new Error("Missing required fields for template creation.");
  }

  let parsedSchema: any = null;
  if (data.customSchema !== undefined && data.customSchema !== null) {
    if (typeof data.customSchema === "string") {
      try {
        parsedSchema = data.customSchema.trim() ? JSON.parse(data.customSchema) : [];
      } catch (e) {
        throw new Error("Invalid customSchema JSON format");
      }
    } else {
      parsedSchema = data.customSchema;
    }
  }

  const template = await db.template.create({
    data: {
      name: data.name,
      price: Number(data.price),
      category: data.category,
      coverUrl: data.coverUrl,
      bgColor: data.bgColor || "#09090b",
      fontStyle: data.fontStyle || "Inter",
      buttonStyle: data.buttonStyle || "rounded-xl",
      paymentLink: data.paymentLink || null,
      paymentUrl: data.paymentUrl || null,
      isActive: data.isActive !== false,
      isCoded: !!data.isCoded,
      customCss: data.customCss || null,
      configJson: data.configJson || null,
      customHtml: data.customHtml || null,
      masterLayoutHtml: data.masterLayoutHtml || null,
      avatarHtml: data.avatarHtml || null,
      headerHtml: data.headerHtml || null,
      socialHtml: data.socialHtml || null,
      linksHtml: data.linksHtml || null,
      backgroundHtml: data.backgroundHtml || null,
      containerClasses: data.containerClasses || null,
      jsonConfig: data.jsonConfig || null,
      customSchema: parsedSchema,
      isComingSoon: !!data.isComingSoon,
    },
  });

  revalidatePath("/sablonlar");
  revalidatePath("/admin/templates");
  return template;
}
