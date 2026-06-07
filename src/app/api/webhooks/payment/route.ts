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
    if (moduleId === "ADVANCED_STOREFRONT") defaultTheme = "classic";

    let defaultSettings: any = { theme: defaultTheme };
    if (moduleId === "ADVANCED_STOREFRONT") {
      defaultSettings = {
        banners: [
          {
            heroBgUrl: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80",
            heroSub: "SPRING COLLECTION",
            heroTitle: "20% OFF",
            heroDesc: "For Selected Spring Style",
            heroBtnText: "Shop now",
            heroBtnLink: "#"
          },
          {
            heroBgUrl: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80",
            heroSub: "NEW ARRIVALS",
            heroTitle: "LIMITED EDITION",
            heroDesc: "Discover our new seasonal designer pieces.",
            heroBtnText: "Explore Collection",
            heroBtnLink: "#"
          }
        ],
        brandName: "Moda Boutique",
        brandDescription: "Premium Wear & Design Studio since 2018.",
        brandLogoUrl: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=150&q=80",
        brandContact: "mailto:info@modaboutique.com",
        collections: [
          {
            id: "col-1",
            title: "Designer Collection",
            showAllLink: "#",
            displayType: "horizontal-scroll",
            products: [
              {
                id: "p-1",
                title: "Main Title",
                price: "44.99",
                imageUrl: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80",
                badge: "New",
                isFavorite: true,
                buyLink: "#"
              },
              {
                id: "p-2",
                title: "Atom Dress",
                price: "44.99",
                imageUrl: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=600&q=80",
                badge: "",
                isFavorite: false,
                buyLink: "#"
              }
            ]
          },
          {
            id: "col-2",
            title: "Top Trends",
            showAllLink: "#",
            displayType: "vertical-list",
            products: [
              {
                id: "p-3",
                title: "KOR Slim-Fit Shirt",
                price: "24.99",
                imageUrl: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&q=80",
                badge: "",
                isFavorite: false,
                buyLink: "#"
              },
              {
                id: "p-4",
                title: "West Side Blouse",
                price: "24.99",
                imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&q=80",
                badge: "",
                isFavorite: false,
                buyLink: "#"
              }
            ]
          }
        ],
        bottomNav: {
          show: true,
          items: [
            { label: "Shop", link: "#", icon: "Shop" },
            { label: "Explore", link: "#", icon: "Explore" },
            { label: "Brands", link: "#", icon: "Brands" }
          ]
        }
      };
    }

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
        settings: defaultSettings
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
