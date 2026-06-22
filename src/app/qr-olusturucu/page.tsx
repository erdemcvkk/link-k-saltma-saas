import React from "react";
import { Metadata } from "next";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import QrClient from "./qr-client";

export const metadata: Metadata = {
  title: "Clinkor | Ücretsiz QR Kod Oluşturucu",
  description: "Profiliniz, işletmeniz veya web siteniz için özel tasarımlı dinamik QR kodlar oluşturun.",
};

export const dynamic = "force-dynamic";

export default async function QrGeneratorPage() {
  const { userId } = await auth();

  // Fetch global settings for site logo & title
  const settings = await db.globalSetting.findMany();
  const serializedSettings = settings.reduce((acc, curr) => {
    acc[curr.key] = curr.value;
    return acc;
  }, {} as Record<string, string>);

  const siteTitle = serializedSettings["site_title"] || "Clinkor";
  const siteLogo = serializedSettings["site_logo"] || "";

  // Fetch system settings for ads
  const systemSettings = await db.systemSettings.findFirst();

  return (
    <QrClient
      userId={userId}
      siteTitle={siteTitle}
      siteLogo={siteLogo}
      systemSettings={systemSettings}
    />
  );
}
