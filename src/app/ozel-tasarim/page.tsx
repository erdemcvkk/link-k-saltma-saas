import React from "react";
import { Metadata } from "next";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import CustomDesignClient from "./custom-design-client";

export const metadata: Metadata = {
  title: "Clinkor | Özel Biyografi Sayfası Tasarlat",
  description: "Markanıza özel bir biyografi link sayfası tasarımı için uzman ekibimizle iletişime geçin.",
};

export const dynamic = "force-dynamic";

export default async function CustomDesignPage() {
  const { userId } = await auth();

  // Fetch global settings for site logo & title
  const settings = await db.globalSetting.findMany();
  const serializedSettings = settings.reduce((acc, curr) => {
    acc[curr.key] = curr.value;
    return acc;
  }, {} as Record<string, string>);

  const siteTitle = serializedSettings["site_title"] || "Clinkor";
  const siteLogo = serializedSettings["site_logo"] || "";

  return (
    <CustomDesignClient
      userId={userId}
      siteTitle={siteTitle}
      siteLogo={siteLogo}
    />
  );
}
