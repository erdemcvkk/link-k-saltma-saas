import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { User, Music, ShoppingBag, Globe, Zap, ArrowUpRight } from "lucide-react";
import { headers } from "next/headers";
import { trackPageView } from "@/app/actions";
import { Metadata } from "next";
import { checkAndEnforcePlanExpiration } from "@/lib/user-sync";

export const revalidate = 0; // Disable caching to fetch live links

// Dynamic SEO Metadata Generator
export async function generateMetadata({ params }: { params: Promise<{ username: string }> }): Promise<Metadata> {
  const { username } = await params;
  const cleanUsername = username.replace("%40", "").replace(/^@/, "");
  
  const user = await db.user.findFirst({
    where: { username: cleanUsername.toLowerCase() },
    include: { profile: true },
  });

  if (!user || !user.profile) {
    return {
      title: `${username} - CREATOR.HUB`,
    };
  }

  // Gated SEO: Only premium plans can override default metadata
  const hasPremiumSEO = user.plan !== "FREE";
  const title = hasPremiumSEO && user.profile.seoTitle ? user.profile.seoTitle : `@${user.username} | CREATOR.HUB`;
  const description = hasPremiumSEO && user.profile.seoDescription ? user.profile.seoDescription : user.profile.bio || "Welcome to my link page!";
  const keywords = hasPremiumSEO && user.profile.seoKeywords ? user.profile.seoKeywords : "creators, links, socials";

  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

import ProfileClient from "./profile-client";

export default async function PublicProfilePage({ params, searchParams }: { params: Promise<{ username: string }>, searchParams?: Promise<{ previewTemplate?: string }> }) {
  const { username } = await params;
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const previewTemplateId = resolvedSearchParams.previewTemplate;
  const cleanUsername = username.replace("%40", "").replace(/^@/, "");

  let forcedTemplateId: string | null = null;

  // Search for the user
  let user = await db.user.findFirst({
    where: {
      username: {
        equals: cleanUsername.toLowerCase(),
      },
    },
    include: {
      profile: true,
      links: {
        where: { isActive: true },
        orderBy: { order: "asc" },
      },
      purchasedTemplates: {
        include: { template: true }
      },
      ownedAddons: {
        where: { isActive: true }
      }
    },
  });

  // If not found by username, check if it's a custom template URL
  if (!user) {
    const userTemplate = await db.userTemplate.findFirst({
      where: { customUrl: cleanUsername.toLowerCase() },
      include: {
        user: {
          include: {
            profile: true,
            links: {
              where: { isActive: true },
              orderBy: { order: "asc" },
            },
            purchasedTemplates: {
              include: { template: true }
            },
            ownedAddons: {
              where: { isActive: true }
            }
          }
        }
      }
    });

    if (userTemplate && userTemplate.user) {
      user = userTemplate.user as any;
      forcedTemplateId = userTemplate.templateId;
    }
  }

  if (!user) {
    notFound();
  }

  // Check if subscription has expired
  const checkedUser = await checkAndEnforcePlanExpiration(user);
  if (!checkedUser) {
    notFound();
  }
  const activeUser = checkedUser as any;

  if (activeUser.isBanned) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-6 text-center">
        <div className="max-w-md p-8 rounded-3xl bg-zinc-950 border border-red-500/20 shadow-[0_0_30px_rgba(239,68,68,0.1)] space-y-6">
          <div className="w-16 h-16 rounded-full bg-red-950/20 border border-red-500/30 flex items-center justify-center mx-auto text-red-500 animate-pulse">
            <span className="text-xl font-bold">!</span>
          </div>
          <h1 className="text-xl font-extrabold text-red-400">Account Suspended</h1>
          <p className="text-zinc-500 text-xs leading-relaxed">
            The profile of @{cleanUsername} has been suspended by administration due to community guidelines violation.
          </p>
          <a href="/" className="inline-block text-xs font-bold text-zinc-400 hover:text-white underline transition-colors">
            Back to CREATOR.HUB
          </a>
        </div>
      </div>
    );
  }

  // Parse headers to record real-time page views
  const headersList = await headers();
  const userAgent = headersList.get("user-agent") || "";
  
  // Basic device detection
  const isMobile = /mobile|android|iphone|ipad|phone/i.test(userAgent);
  const isTablet = /ipad|tablet/i.test(userAgent);
  const device = isTablet ? "Tablet" : isMobile ? "Mobile" : "Desktop";

  // Basic browser detection
  let browser = "Other";
  if (/chrome|crios/i.test(userAgent)) browser = "Chrome";
  else if (/safari/i.test(userAgent)) browser = "Safari";
  else if (/firefox|iceweasel/i.test(userAgent)) browser = "Firefox";
  else if (/edge|edg/i.test(userAgent)) browser = "Edge";

  // Country from Vercel headers (or local default)
  const country = headersList.get("x-vercel-ip-country") || "TR";

  // Referrer parsing
  const rawReferrer = headersList.get("referer") || "";
  let referrer = "Direct";
  if (rawReferrer.includes("instagram.com")) referrer = "Instagram";
  else if (rawReferrer.includes("t.co") || rawReferrer.includes("twitter.com")) referrer = "Twitter";
  else if (rawReferrer.includes("youtube.com")) referrer = "YouTube";
  else if (rawReferrer.includes("tiktok.com")) referrer = "TikTok";
  else if (rawReferrer.includes("linkedin.com")) referrer = "LinkedIn";

  // Async pageview tracking (does not block page rendering)
  trackPageView(activeUser.username!, device, browser, country, referrer);

  // Fetch active digital products for this user
  const products = await db.product.findMany({
    where: { userId: activeUser.id, isActive: true },
    orderBy: { createdAt: "desc" }
  });

  const theme = activeUser.profile?.theme ?? "dark";
  const bio = activeUser.profile?.bio ?? "";

  // Priority 1: Active Template (Şablon)
  // Priority 2: Active Addon (Eklenti)
  // Priority 3: Custom Profile CSS (Kullanıcının Oluşturduğu)
  
  let customCss = null;
  let activeTemplate = activeUser.purchasedTemplates?.find((ot: any) => ot.isActive)?.template;
  
  if (previewTemplateId || forcedTemplateId) {
    const targetId = forcedTemplateId || previewTemplateId;
    const previewMatch = activeUser.purchasedTemplates?.find((ot: any) => ot.template?.id === targetId);
    if (previewMatch) activeTemplate = previewMatch.template;
  }

  if (activeTemplate && activeTemplate.isCoded && activeTemplate.customCss) {
    customCss = activeTemplate.customCss;
  } else {
    customCss = activeUser.profile?.customCss ?? null;
    
    // Fallback for legacy profiles that didn't copy the customCss
    if (!customCss && theme && theme !== "custom") {
      const template = await db.template.findFirst({
        where: { name: theme }
      });
      if (template && template.isCoded) {
        customCss = template.customCss;
      }
    }
  }

  // Serialize models for standard client prop constraints
  // Map links, and optionally override button styles if a template is active
  const parseButtonStyle = (styleStr: string) => {
    try {
      const parsed = JSON.parse(styleStr);
      return (parsed && typeof parsed === "object") ? parsed : {};
    } catch {
      return {};
    }
  };

  const templateButtonOverrides = (activeTemplate && activeTemplate.buttonStyle) 
    ? parseButtonStyle(activeTemplate.buttonStyle)
    : {};

  const serializedLinks = activeUser.links.map((l: any) => ({
    id: l.id,
    title: l.title,
    url: l.url,
    isActive: l.isActive,
    type: l.type,
    animation: l.animation || "",
    bgColor: activeTemplate ? (templateButtonOverrides.bgColor ?? null) : (l.bgColor ?? null),
    textColor: activeTemplate ? (templateButtonOverrides.textColor ?? null) : (l.textColor ?? null),
    borderColor: activeTemplate ? (templateButtonOverrides.borderColor ?? null) : (l.borderColor ?? null),
    borderStyle: activeTemplate ? (templateButtonOverrides.borderStyle ?? null) : (l.borderStyle ?? null),
    borderWidth: activeTemplate ? (templateButtonOverrides.borderWidth ?? null) : (l.borderWidth ?? null),
    borderRadius: activeTemplate ? (templateButtonOverrides.borderRadius ?? null) : (l.borderRadius ?? null),
    shadow: activeTemplate ? (templateButtonOverrides.shadow ?? null) : (l.shadow ?? null),
    fontWeight: activeTemplate ? (templateButtonOverrides.fontWeight ?? null) : (l.fontWeight ?? null),
    blockType: l.blockType || "TEXT_LINK",
    metadata: l.metadata ?? null
  }));

  const serializedProducts = products.map((p) => ({
    id: p.id,
    title: p.title,
    type: p.type,
    price: p.price,
    description: p.description,
    fileUrl: p.fileUrl,
    isActive: p.isActive,
    salesCount: p.salesCount
  }));

  // Fetch active addons for this user
  const addons = await db.userAddon.findMany({
    where: { userId: activeUser.id, isActive: true }
  });
  const serializedAddons = addons.map(a => ({
    id: a.id,
    addonType: a.addonType,
    config: a.config
  }));

  return (
    <ProfileClient
      username={activeUser.username!}
      bio={bio}
      theme={activeTemplate ? activeTemplate.name : theme}
      links={serializedLinks}
      products={serializedProducts}
      addons={serializedAddons}
      avatarUrl={activeUser.profile?.avatarUrl ?? null}
      background={activeTemplate ? activeTemplate.bgColor : (activeUser.profile?.background ?? null)}
      fontStyle={activeTemplate && activeTemplate.fontStyle ? activeTemplate.fontStyle : (activeUser.profile?.fontStyle ?? "Inter")}
      bioColor={activeUser.profile?.bioColor ?? null}
      usernameColor={activeUser.profile?.usernameColor ?? null}
      plan={activeUser.plan}
      storeTitle={activeUser.profile?.storeTitle ?? null}
      storeCoverUrl={activeUser.profile?.storeCoverUrl ?? null}
      storeLayout={activeUser.profile?.storeLayout ?? "GRID"}
      customCss={customCss}
    />
  );
}
