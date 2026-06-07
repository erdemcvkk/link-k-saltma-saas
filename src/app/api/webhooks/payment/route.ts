import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, moduleId } = body;

    if (!userId || !moduleId) {
      return new NextResponse("Eksik bilgi: userId ve moduleId gereklidir.", { status: 400 });
    }

    console.log(`[PAYMENT WEBHOOK] Ödeme doğrulama isteği alındı. Kullanıcı: ${userId}, Modül: ${moduleId}`);

    // Kullanıcıyı bul (Dahili UUID ya da Clerk User ID ile)
    let user = await db.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      user = await db.user.findUnique({
        where: { clerkUserId: userId }
      });
    }

    if (!user) {
      console.error(`[PAYMENT WEBHOOK] Kullanıcı bulunamadı: ${userId}`);
      return new NextResponse("Kullanıcı bulunamadı.", { status: 404 });
    }

    // 1. UserPurchasedModule kaydı ekle (Eğer yoksa)
    const existingPurchase = await db.userPurchasedModule.findUnique({
      where: {
        userId_moduleId: {
          userId: user.id,
          moduleId
        }
      }
    });

    if (!existingPurchase) {
      await db.userPurchasedModule.create({
        data: {
          userId: user.id,
          moduleId
        }
      });
      console.log(`[PAYMENT WEBHOOK] Satın alma işlemi UserPurchasedModule tablosuna kaydedildi.`);
    } else {
      console.log(`[PAYMENT WEBHOOK] Modül zaten satın alınmış, kayıt eklenmedi.`);
    }

    // 2. Modülün varsayılan temasını belirle
    let defaultTheme = "classic";
    if (moduleId === "MINI_STORE") defaultTheme = "vibrant-pop";
    if (moduleId === "QA") defaultTheme = "dark-drill";
    if (moduleId === "NEO_BRUTAL") defaultTheme = "neo-brutalism";
    if (moduleId === "ORGANIC") defaultTheme = "organic-earth";
    if (moduleId === "RETRO") defaultTheme = "retro-arcade";
    if (moduleId === "Y2K") defaultTheme = "y2k-holographic";

    // 3. Kullanıcının diğer tüm eklentilerini pasif yap (aktif eklenti tek olmalı kuralı)
    await db.userAddon.updateMany({
      where: { userId: user.id },
      data: { isActive: false }
    });

    // 4. İlgili eklentiyi UserAddon tablosunda oluştur veya güncelle
    await db.userAddon.upsert({
      where: {
        userId_addonType: {
          userId: user.id,
          addonType: moduleId
        }
      },
      update: {
        isActive: true
      },
      create: {
        userId: user.id,
        addonType: moduleId,
        isActive: true,
        settings: { theme: defaultTheme }
      }
    });
    console.log(`[PAYMENT WEBHOOK] Eklenti başarıyla aktif edildi: ${moduleId}`);

    // 5. Sayfa önbelleklerini temizle
    revalidatePath("/dashboard");
    revalidatePath("/eklentiler");
    if (user.username) {
      revalidatePath(`/${user.username}`);
    }

    return new NextResponse("Aldım ve onayladım", { status: 200 });
  } catch (error: any) {
    console.error("[PAYMENT_WEBHOOK_ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
