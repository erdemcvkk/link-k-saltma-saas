import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const moduleId = searchParams.get("moduleId");

    if (!userId || !moduleId) {
      return new NextResponse("Eksik parametre: userId ve moduleId gereklidir.", { status: 400 });
    }

    // Webhook URL'sini dinamik olarak belirle (istek atılan host/origin üzerinden)
    const origin = new URL(req.url).origin;
    const webhookUrl = `${origin}/api/webhooks/payment`;

    console.log(`[CHECKOUT MOCK] Webhook tetikleniyor: ${webhookUrl} (userId: ${userId}, moduleId: ${moduleId})`);

    // Webhook endpoint'ine POST isteği göndererek ödemeyi simüle et
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, moduleId }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[CHECKOUT MOCK] Webhook hatası:", errorText);
      return new NextResponse(`Ödeme doğrulanırken hata oluştu: ${errorText}`, { status: 500 });
    }

    const responseData = await response.text();
    console.log("[CHECKOUT MOCK] Webhook başarılı yanıtı:", responseData);

    // Ödeme başarılı sayfasına yönlendir
    return NextResponse.redirect(
      new URL(`/checkout-success?userId=${userId}&moduleId=${moduleId}`, req.url)
    );
  } catch (error: any) {
    console.error("[CHECKOUT_GET_ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
