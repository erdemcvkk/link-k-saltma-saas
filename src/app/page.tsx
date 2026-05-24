import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import HomeClient from "./home-client";

export default async function Home() {
  const { userId } = await auth();

  // Fetch global settings
  const settings = await db.globalSetting.findMany();
  const serializedSettings = settings.reduce((acc, curr) => {
    acc[curr.key] = curr.value;
    return acc;
  }, {} as Record<string, string>);

  const dbSliderItems = await db.sliderItem.findMany({ orderBy: { createdAt: "asc" } });
  const serializedSliderItems = dbSliderItems.map((item) => ({
    id: item.id,
    title: item.title,
    imageUrl: item.imageUrl,
    link: item.link || undefined,
  }));

  const siteTitle = serializedSettings["site_title"] || "CREATOR.HUB";
  const siteLogo = serializedSettings["site_logo"] || "";
  const heroTitle = serializedSettings["hero_title"] || "ONE LINK FOR YOUR DIGITAL EMPIRE";
  const heroSubtitle = serializedSettings["hero_subtitle"] || "Craft premium glassmorphic personal hubs, sell beats & presets, host sample packs, and leverage robust real-time analytics.";
  const accentColor = serializedSettings["accent_color"] || "purple";

  // Map dynamic accent styles for headers and gradients!
  const getAccentGradient = (color: string) => {
    switch (color) {
      case "emerald":
        return "from-emerald-400 via-teal-500 to-cyan-500";
      case "pink":
        return "from-pink-400 via-rose-500 to-red-500";
      case "cyan":
        return "from-cyan-400 via-blue-500 to-indigo-500";
      default: // purple
        return "from-purple-400 via-fuchsia-500 to-pink-500";
    }
  };

  const getAccentBgClass = (color: string) => {
    switch (color) {
      case "emerald":
        return "bg-emerald-950/20 border-emerald-500/30 text-emerald-400";
      case "pink":
        return "bg-pink-950/20 border-pink-500/30 text-pink-400";
      case "cyan":
        return "bg-cyan-950/20 border-cyan-500/30 text-cyan-400";
      default: // purple
        return "bg-purple-950/20 border-purple-500/30 text-purple-400";
    }
  };

  const getAccentBtnClass = (color: string) => {
    switch (color) {
      case "emerald":
        return "from-emerald-600 via-teal-600 to-cyan-600 shadow-[0_0_30px_rgba(16,185,129,0.3)]";
      case "pink":
        return "from-pink-600 via-rose-600 to-red-600 shadow-[0_0_30px_rgba(244,63,94,0.3)]";
      case "cyan":
        return "from-cyan-600 via-blue-600 to-indigo-600 shadow-[0_0_30px_rgba(6,182,212,0.3)]";
      default: // purple
        return "from-purple-600 via-fuchsia-600 to-pink-600 shadow-[0_0_30px_rgba(219,39,119,0.3)]";
    }
  };

  const currentGradient = getAccentGradient(accentColor);
  const currentBadgeBg = getAccentBgClass(accentColor);
  const currentBtnBg = getAccentBtnClass(accentColor);

  return (
    <HomeClient
      userId={userId}
      siteTitle={siteTitle}
      siteLogo={siteLogo}
      heroTitle={heroTitle}
      heroSubtitle={heroSubtitle}
      accentColor={accentColor}
      currentGradient={currentGradient}
      currentBadgeBg={currentBadgeBg}
      currentBtnBg={currentBtnBg}
      paymentLinkStarter={serializedSettings["payment_link_starter"] || ""}
      paymentLinkCreator={serializedSettings["payment_link_creator"] || ""}
      paymentLinkPro={serializedSettings["payment_link_pro"] || ""}
      feature1Title={serializedSettings["feature_1_title"] || ""}
      feature1Desc={serializedSettings["feature_1_desc"] || ""}
      feature2Title={serializedSettings["feature_2_title"] || ""}
      feature2Desc={serializedSettings["feature_2_desc"] || ""}
      feature3Title={serializedSettings["feature_3_title"] || ""}
      feature3Desc={serializedSettings["feature_3_desc"] || ""}
      sliderItems={serializedSliderItems}
    />
  );
}
