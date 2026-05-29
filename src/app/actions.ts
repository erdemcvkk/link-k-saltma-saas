"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { parseButtonStyle } from "@/lib/parse-button-style";

// Helper to ensure caller is admin
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

export async function addLink(
  userId: string,
  title: string,
  url: string,
  type: string = "WEBSITE",
  animation: string = "",
  blockType: string = "TEXT_LINK",
  metadata: string | null = null
) {
  if (!title || !url) throw new Error("Title and URL are required");

  // Get user details for plan validation
  const user = await db.user.findUnique({
    where: { id: userId },
    select: { plan: true, role: true },
  });

  if (!user) throw new Error("User not found");

  // Get current links count
  const linkCount = await db.link.count({
    where: { userId },
  });

  // Gating check
  if (user.plan === "FREE" && linkCount >= 5) {
    throw new Error("FREE plan is limited to 5 links. Please upgrade to STARTER or CREATOR plan to add more links!");
  }

  // Template restrictions checks
  const isTemplateUnlocked = (templateType: string, plan: string, isAdmin: boolean) => {
    if (plan === "CREATOR" || plan === "PRO_BUSINESS" || isAdmin) return true;
    
    const starterTemplates = ["WEBSITE", "FACEBOOK", "INSTAGRAM", "WHATSAPP", "WIFI", "VCARD", "IMAGES", "SOCIAL_MEDIA", "VIDEO", "COUPON"];
    const freeTemplates = ["WEBSITE", "FACEBOOK", "INSTAGRAM", "WHATSAPP", "WIFI"];
    
    if (plan === "STARTER") {
      return starterTemplates.includes(templateType);
    }
    return freeTemplates.includes(templateType);
  };

  if (!isTemplateUnlocked(type, user.plan, user.role === "ADMIN")) {
    throw new Error(`The "${type}" link action requires a premium plan. Please upgrade to unlock!`);
  }

  // Format URL if it doesn't have http/https, but ONLY if it's not a custom protocol like WIFI: or BEGIN:VCARD
  let formattedUrl = url;
  const isCustomProtocol = /^WIFI:/i.test(url) || /^BEGIN:VCARD/i.test(url) || /^wa\.me/i.test(url) || /^mailto:/i.test(url) || /^tel:/i.test(url);
  if (!isCustomProtocol && !/^https?:\/\//i.test(url)) {
    formattedUrl = `https://${url}`;
  }

  // Get max order
  const maxOrderLink = await db.link.findFirst({
    where: { userId },
    orderBy: { order: "desc" },
  });
  const nextOrder = maxOrderLink ? maxOrderLink.order + 1 : 0;

  // Inherit styling from existing links if they exist
  const existingLink = await db.link.findFirst({
    where: { userId },
    select: {
      bgColor: true,
      textColor: true,
      borderColor: true,
      borderStyle: true,
      borderWidth: true,
      borderRadius: true,
      shadow: true,
      fontWeight: true,
      animation: true,
    }
  });

  let linkBgColor = null;
  let linkTextColor = null;
  let linkBorderColor = null;
  let linkBorderStyle = null;
  let linkBorderWidth = null;
  let linkBorderRadius = null;
  let linkShadow = null;
  let linkFontWeight = null;
  let linkAnimation = animation;

  if (existingLink) {
    linkBgColor = existingLink.bgColor;
    linkTextColor = existingLink.textColor;
    linkBorderColor = existingLink.borderColor;
    linkBorderStyle = existingLink.borderStyle;
    linkBorderWidth = existingLink.borderWidth;
    linkBorderRadius = existingLink.borderRadius;
    linkShadow = existingLink.shadow;
    linkFontWeight = existingLink.fontWeight;
    if (!linkAnimation) linkAnimation = existingLink.animation || "";
  } else {
    // If no existing links, query user's profile and check if they have a theme/template.
    const profile = await db.profile.findUnique({
      where: { userId },
      select: { theme: true }
    });
    if (profile && profile.theme && profile.theme !== "custom") {
      const template = await db.template.findFirst({
        where: {
          OR: [
            { category: { equals: profile.theme, mode: 'insensitive' } },
            { name: { equals: profile.theme, mode: 'insensitive' } }
          ]
        }
      });
      if (template && template.buttonStyle) {
        const parsed = parseButtonStyle(template.buttonStyle);
        linkBgColor = parsed.bgColor;
        linkTextColor = parsed.textColor;
        linkBorderColor = parsed.borderColor;
        linkBorderStyle = parsed.borderStyle;
        linkBorderWidth = parsed.borderWidth;
        linkBorderRadius = parsed.borderRadius;
        linkShadow = parsed.shadow;
        linkFontWeight = parsed.fontWeight;
        if (!linkAnimation) linkAnimation = parsed.animation;
      }
    }
  }

  await db.link.create({
    data: {
      userId,
      title,
      url: formattedUrl,
      type,
      order: nextOrder,
      isActive: true,
      animation: linkAnimation,
      blockType,
      metadata,
      bgColor: linkBgColor,
      textColor: linkTextColor,
      borderColor: linkBorderColor,
      borderStyle: linkBorderStyle,
      borderWidth: linkBorderWidth,
      borderRadius: linkBorderRadius,
      shadow: linkShadow,
      fontWeight: linkFontWeight,
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/[username]", "page");
}

export async function updateLinkAnimation(linkId: string, animation: string) {
  await db.link.update({
    where: { id: linkId },
    data: { animation },
  });

  revalidatePath("/dashboard");
  revalidatePath("/[username]", "page");
}

export async function updateLinkCustomStyle(
  linkId: string,
  bgColor: string | null,
  textColor: string | null,
  borderColor: string | null,
  borderStyle: string | null,
  borderWidth: string | null,
  borderRadius: string | null,
  shadow: string | null,
  fontWeight: string | null
) {
  await db.link.update({
    where: { id: linkId },
    data: {
      bgColor,
      textColor,
      borderColor,
      borderStyle,
      borderWidth,
      borderRadius,
      shadow,
      fontWeight
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/[username]", "page");
}

export async function updateAllLinksCustomStyle(
  userId: string,
  bgColor: string | null,
  textColor: string | null,
  borderColor: string | null,
  borderStyle: string | null,
  borderWidth: string | null,
  borderRadius: string | null,
  shadow: string | null,
  fontWeight: string | null
) {
  await db.link.updateMany({
    where: { userId },
    data: {
      bgColor,
      textColor,
      borderColor,
      borderStyle,
      borderWidth,
      borderRadius,
      shadow,
      fontWeight
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/[username]", "page");
}

export async function deleteLink(linkId: string) {
  await db.link.delete({
    where: { id: linkId },
  });

  revalidatePath("/dashboard");
  revalidatePath("/[username]", "page");
}

export async function toggleLinkActive(linkId: string, isActive: boolean) {
  await db.link.update({
    where: { id: linkId },
    data: { isActive },
  });

  revalidatePath("/dashboard");
  revalidatePath("/[username]", "page");
}

export async function updateProfile(
  userId: string,
  bio: string,
  theme: string,
  username: string,
  avatarUrl?: string,
  background?: string,
  fontStyle?: string,
  bioColor?: string,
  usernameColor?: string
) {
  // Get user plan
  const user = await db.user.findUnique({
    where: { id: userId },
    select: { plan: true },
  });

  if (!user) throw new Error("User not found");

  // Theme gating validation
  if (user.plan === "FREE" && theme !== "dark") {
    throw new Error(`The theme "${theme}" is a Premium Feature. Please upgrade your plan to unlock premium themes!`);
  }

  if (user.plan === "STARTER" && theme === "glow-green") {
    throw new Error('The "Cyberpunk Acid (glow-green)" theme is only available in the CREATOR plan. Please upgrade your plan!');
  }

  // Background and Asset gating validations
  if (background) {
    const isBase64Image = background.startsWith("data:image/");
    const isUploadedImage = background.startsWith("/uploads/");
    const isBase64Video = background.startsWith("data:video/");
    
    if (user.plan === "FREE" && (isBase64Image || isUploadedImage || isBase64Video)) {
      throw new Error("Özel arka plan resmi yükleme özelliği Premium planlara özeldir. Lütfen planınızı yükseltin!");
    }
    
    if (user.plan === "STARTER" && isBase64Video) {
      throw new Error("Video arka plan özelliği yalnızca CREATOR planında mevcuttur. Lütfen planınızı yükseltin!");
    }
  }

  // Color customization gating validations
  if (user.plan === "FREE") {
    if (bioColor && bioColor !== "#888888" && bioColor !== "#888" && bioColor.toLowerCase() !== "rgb(136, 136, 136)") {
      throw new Error("Biyografi renk özelleştirme özelliği Premium planlara özeldir. Lütfen planınızı yükseltin!");
    }
    if (usernameColor && usernameColor !== "#ffffff" && usernameColor !== "#fff" && usernameColor.toLowerCase() !== "rgb(255, 255, 255)") {
      throw new Error("Kullanıcı adı renk özelleştirme özelliği Premium planlara özeldir. Lütfen planınızı yükseltin!");
    }
  }

  // Typography gating validation
  if (fontStyle) {
    const fontRecord = await db.managedFont.findFirst({
      where: { value: fontStyle }
    });
    if (fontRecord) {
      if (user.plan === "FREE" && fontRecord.tier !== "FREE") {
        throw new Error(`The font style "${fontStyle}" is a Premium Feature. Please upgrade your plan to unlock premium typography styles!`);
      }
      if (user.plan === "STARTER" && fontRecord.tier === "CREATOR") {
        throw new Error(`The font style "${fontStyle}" is a Creator Feature. Please upgrade to the CREATOR plan to unlock deluxe fonts!`);
      }
    }
  }

  // Validate username
  const cleanUsername = username.trim().toLowerCase().replace(/[^a-zA-Z0-9_-]/g, "");
  if (!cleanUsername) throw new Error("Invalid username");

  // Check if username is taken by another user
  const existingUser = await db.user.findFirst({
    where: {
      username: cleanUsername,
      id: { not: userId },
    },
  });
  if (existingUser) {
    throw new Error("Username already taken");
  }

  // Update user username
  await db.user.update({
    where: { id: userId },
    data: { username: cleanUsername },
  });

  // Update or create profile
  await db.profile.upsert({
    where: { userId },
    update: { bio, theme, avatarUrl, background, fontStyle, bioColor, usernameColor },
    create: { userId, bio, theme, avatarUrl, background, fontStyle: fontStyle || "Inter", bioColor: bioColor || "#888888", usernameColor: usernameColor || "#ffffff" },
  });

  revalidatePath("/dashboard");
  revalidatePath("/[username]", "page");
}

// Mock Payment & Plan Upgrade action
export async function upgradeUserPlan(userId: string, newPlan: string, amount: number) {
  // Validate plan name
  const validPlans = ["FREE", "STARTER", "CREATOR", "PRO_BUSINESS"];
  if (!validPlans.includes(newPlan)) {
    throw new Error("Invalid plan name");
  }

  const now = new Date();
  const expiresAt = newPlan === "FREE" ? null : new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

  // Update plan in DB
  await db.user.update({
    where: { id: userId },
    data: {
      plan: newPlan,
      planStartedAt: newPlan === "FREE" ? null : now,
      planExpiresAt: expiresAt,
    },
  });

  // Create payment record
  await db.payment.create({
    data: {
      userId,
      amount,
      status: "SUCCESS",
      package: newPlan,
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/billing");
  revalidatePath("/[username]", "page");
}

// ==========================================
// ANALYTICS & SEO ACTIONS
// ==========================================

export async function trackPageView(username: string, device: string, browser: string, country: string, referrer: string) {
  try {
    const user = await db.user.findUnique({
      where: { username },
      select: { id: true, isBanned: true },
    });

    if (!user || user.isBanned) return;

    await db.pageView.create({
      data: {
        userId: user.id,
        device: device || "Desktop",
        browser: browser || "Chrome",
        country: country || "TR",
        referrer: referrer || "Direct",
      },
    });
  } catch (err) {
    console.error("PageView tracking error:", err);
  }
}

export async function trackLinkClick(linkId: string) {
  try {
    await db.linkClick.create({
      data: { linkId },
    });
  } catch (err) {
    console.error("LinkClick tracking error:", err);
  }
}

export async function saveSeoProfile(userId: string, seoTitle: string, seoDescription: string, seoKeywords: string) {
  await db.profile.update({
    where: { userId },
    data: {
      seoTitle: seoTitle || null,
      seoDescription: seoDescription || null,
      seoKeywords: seoKeywords || null,
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/[username]", "page");
}

export async function saveCustomDomain(userId: string, domain: string) {
  // Clean domain name
  const cleanDomain = domain.trim().toLowerCase().replace(/https?:\/\//i, "");

  await db.profile.update({
    where: { userId },
    data: {
      customDomain: cleanDomain || null,
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/[username]", "page");
}

// Generate 30 days of highly realistic visitor & click data
export async function generateMockTraffic(userId: string) {
  // Clear existing mock data first
  await db.pageView.deleteMany({ where: { userId } });
  
  const userLinks = await db.link.findMany({
    where: { userId },
    select: { id: true },
  });

  if (userLinks.length === 0) {
    throw new Error("Please add at least one link before generating mock traffic!");
  }

  const devices = ["Mobile", "Desktop", "Tablet"];
  const deviceProbs = [0.70, 0.25, 0.05]; // 70% Mobile, 25% Desktop, 5% Tablet

  const browsers = ["Chrome", "Safari", "Firefox", "Edge"];
  const browserProbs = [0.55, 0.30, 0.10, 0.05];

  const countries = ["TR", "US", "DE", "GB", "NL", "AZ"];
  const countryProbs = [0.75, 0.10, 0.06, 0.04, 0.03, 0.02];

  const referrers = ["Instagram", "Direct", "Twitter", "YouTube", "TikTok", "LinkedIn"];
  const referrerProbs = [0.45, 0.20, 0.15, 0.10, 0.07, 0.03];

  const selectRandom = (items: string[], probabilities: number[]) => {
    const r = Math.random();
    let sum = 0;
    for (let i = 0; i < items.length; i++) {
      sum += probabilities[i];
      if (r <= sum) return items[i];
    }
    return items[items.length - 1];
  };

  const now = new Date();
  
  // PageViews and Clicks array for batch inserting
  const pageViewsData = [];
  const linkClicksData = [];

  for (let dayOffset = 30; dayOffset >= 0; dayOffset--) {
    const targetDate = new Date(now);
    targetDate.setDate(now.getDate() - dayOffset);

    // Random page views per day (between 15 and 80)
    const viewsCount = Math.floor(15 + Math.random() * 65);

    for (let j = 0; j < viewsCount; j++) {
      // Add random minutes and seconds to spread page views throughout the day
      const pvTime = new Date(targetDate);
      pvTime.setHours(Math.floor(Math.random() * 24));
      pvTime.setMinutes(Math.floor(Math.random() * 60));

      const device = selectRandom(devices, deviceProbs);
      const browser = selectRandom(browsers, browserProbs);
      const country = selectRandom(countries, countryProbs);
      const referrer = selectRandom(referrers, referrerProbs);

      pageViewsData.push({
        userId,
        device,
        browser,
        country,
        referrer,
        createdAt: pvTime,
      });

      // 40% probability that the user clicks one or two links
      if (Math.random() < 0.40) {
        const clickCount = Math.random() < 0.80 ? 1 : 2;
        for (let c = 0; c < clickCount; c++) {
          const randomLink = userLinks[Math.floor(Math.random() * userLinks.length)];
          const clickTime = new Date(pvTime);
          clickTime.setSeconds(clickTime.getSeconds() + Math.floor(Math.random() * 120));

          linkClicksData.push({
            linkId: randomLink.id,
            createdAt: clickTime,
          });
        }
      }
    }
  }

  // Batch create PageViews
  // SQLite batch creation
  for (const pv of pageViewsData) {
    await db.pageView.create({
      data: pv,
    });
  }

  // Batch create LinkClicks
  for (const lc of linkClicksData) {
    await db.linkClick.create({
      data: lc,
    });
  }

  revalidatePath("/dashboard");
}

// ==========================================
// ADMIN ACTIONS
// ==========================================

export async function adminToggleBanUser(adminUserId: string, targetUserId: string, isBanned: boolean) {
  await ensureAdmin(adminUserId);

  await db.user.update({
    where: { id: targetUserId },
    data: { isBanned },
  });

  revalidatePath("/admin");
  revalidatePath("/dashboard");
  revalidatePath("/[username]", "page");
}

export async function adminChangeUserPlan(adminUserId: string, targetUserId: string, newPlan: string) {
  await ensureAdmin(adminUserId);

  const validPlans = ["FREE", "STARTER", "CREATOR", "PRO_BUSINESS"];
  if (!validPlans.includes(newPlan)) {
    throw new Error("Invalid plan name");
  }

  const now = new Date();
  const expiresAt = newPlan === "FREE" ? null : new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

  await db.user.update({
    where: { id: targetUserId },
    data: {
      plan: newPlan,
      planStartedAt: newPlan === "FREE" ? null : now,
      planExpiresAt: expiresAt,
    },
  });

  revalidatePath("/admin");
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/billing");
  revalidatePath("/[username]", "page");
}

export async function adminToggleUserRole(adminUserId: string, targetUserId: string, newRole: string) {
  await ensureAdmin(adminUserId);

  const validRoles = ["USER", "ADMIN"];
  if (!validRoles.includes(newRole)) {
    throw new Error("Invalid role");
  }

  await db.user.update({
    where: { id: targetUserId },
    data: { role: newRole },
  });

  revalidatePath("/admin");
  revalidatePath("/dashboard");
}

export async function addProduct(userId: string, title: string, type: string, price: number, description: string, fileUrl: string) {
  if (!title || !price || !fileUrl) {
    throw new Error("Title, price, and file URL are required");
  }

  const user = await db.user.findUnique({
    where: { id: userId },
    select: { plan: true },
  });

  if (!user) throw new Error("User not found");

  if (user.plan === "FREE" || user.plan === "STARTER") {
    throw new Error("Digital Store features are only available in the CREATOR or PRO BUSINESS plans! Please upgrade your plan.");
  }

  await db.product.create({
    data: {
      userId,
      title,
      type,
      price: Number(price),
      description: description || null,
      fileUrl,
      isActive: true,
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/[username]", "page");
  revalidatePath("/discover");
}

export async function deleteProduct(productId: string) {
  await db.product.delete({
    where: { id: productId },
  });

  revalidatePath("/dashboard");
  revalidatePath("/[username]", "page");
  revalidatePath("/discover");
}

export async function buyProductSimulated(productId: string) {
  try {
    const product = await db.product.update({
      where: { id: productId },
      data: {
        salesCount: { increment: 1 }
      },
      select: {
        id: true,
        userId: true,
        price: true,
        title: true,
      }
    });

    // Create simulated successful payment transaction for user earnings graph!
    await db.payment.create({
      data: {
        userId: product.userId,
        amount: product.price,
        status: "SUCCESS",
        package: `SALE: ${product.title.substring(0, 15)}...`,
      }
    });

    revalidatePath("/dashboard");
    revalidatePath("/[username]", "page");
  } catch (err) {
    console.error("buyProductSimulated error:", err);
  }
}

export async function saveGlobalSetting(adminUserId: string, key: string, value: string) {
  await ensureAdmin(adminUserId);

  // Payment link keys are restricted to Super Admin only
  if (key.startsWith("payment_link_")) {
    const cookieStore = await cookies();
    const superAdminSession = cookieStore.get("super-admin-session")?.value;
    const superAdminToken = process.env.SUPER_ADMIN_TOKEN;
    if (!superAdminSession || !superAdminToken || superAdminSession !== superAdminToken) {
      throw new Error("Unauthorized: Only Super Admin can modify payment gateway links.");
    }
  }

  await db.globalSetting.upsert({
    where: { key },
    update: { value },
    create: { key, value },
  });

  revalidatePath("/admin");
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/billing");
  revalidatePath("/");
  revalidatePath("/discover");
}

export async function getGlobalSetting(key: string): Promise<string | null> {
  try {
    const setting = await db.globalSetting.findUnique({
      where: { key }
    });
    return setting ? setting.value : null;
  } catch (e) {
    return null;
  }
}

export async function generateAiCreatorSuggestions(prompt: string) {
  if (!prompt) throw new Error("Prompt is required");

  const lowerPrompt = prompt.toLowerCase();
  
  let bio = "";
  let palette = {
    primary: "#a855f7",   // Neon purple
    secondary: "#ec4899", // Neon pink
    background: "#09090b" // Deep space black
  };
  let theme = "neon-purple";
  let sampleLinks = [];

  if (lowerPrompt.includes("beat") || lowerPrompt.includes("producer") || lowerPrompt.includes("rap") || lowerPrompt.includes("trap") || lowerPrompt.includes("hiphop")) {
    bio = "🔥 Trap & Hiphop Music Producer | Certified 808s, dark atmospheres, and heavy drums. Let's cook up some heat. 🎹🚀";
    palette = {
      primary: "#a855f7",
      secondary: "#ec4899",
      background: "#000000"
    };
    theme = "neon-purple";
    sampleLinks = [
      { title: "🎧 Lease Beat Catalog (BeatStars)", url: "https://beatstars.com" },
      { title: "🎹 Free Loop kit & Drumkits (Download)", url: "https://dropbox.com" }
    ];
  } else if (lowerPrompt.includes("design") || lowerPrompt.includes("grafik") || lowerPrompt.includes("art") || lowerPrompt.includes("cyberpunk") || lowerPrompt.includes("3d")) {
    bio = "🎨 3D & Cyberpunk Visual Artist | Crafting high-contrast virtual realities and digital assets. Dark mode forever. 👁💥";
    palette = {
      primary: "#10b981", // Cyber green
      secondary: "#06b6d4", // Cyan
      background: "#09090b"
    };
    theme = "glow-green";
    sampleLinks = [
      { title: "🖼 Behance Portfolio", url: "https://behance.net" },
      { title: "⚡ Buy Premium Photoshop Brushes", url: "https://shop.com" }
    ];
  } else if (lowerPrompt.includes("yayın") || lowerPrompt.includes("gamer") || lowerPrompt.includes("stream") || lowerPrompt.includes("twitch") || lowerPrompt.includes("kick")) {
    bio = "🎮 Kick Partner & Competitive Gamer | Live almost every day. Join the gang for some pro plays and pure chaos! ⚡🔴";
    palette = {
      primary: "#f43f5e", // Synth pink
      secondary: "#fbbf24", // Yellow glow
      background: "#0c0a09"
    };
    theme = "pink-retro";
    sampleLinks = [
      { title: "🔴 Live on Kick (Subscribe)", url: "https://kick.com" },
      { title: "💬 Join Discord Server", url: "https://discord.gg" }
    ];
  } else {
    bio = `✨ Digital Creator & Curator | Crafting high-fidelity experiences, presets, and sharing my journey. Connect with me! 🌐🎯`;
    palette = {
      primary: "#a855f7",
      secondary: "#ec4899",
      background: "#09090b"
    };
    theme = "neon-purple";
    sampleLinks = [
      { title: "🔗 Personal website", url: "https://mysite.com" },
      { title: "📬 Weekly Newsletter", url: "https://substack.com" }
    ];
  }

  return {
    bio,
    palette,
    theme,
    sampleLinks
  };
}

export async function adminClearCache(adminUserId: string) {
  await ensureAdmin(adminUserId);

  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/dashboard");
  revalidatePath("/discover");
  revalidatePath("/privacy");
  revalidatePath("/cookies");
  revalidatePath("/[username]", "page");
}

export async function adminDeleteGlobalSetting(adminUserId: string, key: string) {
  await ensureAdmin(adminUserId);

  await db.globalSetting.delete({
    where: { key },
  });

  revalidatePath("/admin");
  revalidatePath("/dashboard");
  revalidatePath("/");
}

export async function adminAddFont(adminUserId: string, name: string, value: string, tier: string, giftLabel?: string) {
  await ensureAdmin(adminUserId);
  if (!name || !value || !tier) {
    throw new Error("Name, value, and tier are required.");
  }
  const cleanName = name.trim();
  const cleanValue = value.trim();
  const cleanGiftLabel = giftLabel?.trim() || null;
  
  await db.managedFont.create({
    data: {
      name: cleanName,
      value: cleanValue,
      tier,
      giftLabel: cleanGiftLabel
    }
  });

  revalidatePath("/admin");
  revalidatePath("/dashboard");
  revalidatePath("/");
  revalidatePath("/[username]", "page");
}

export async function adminDeleteFont(adminUserId: string, fontId: string) {
  await ensureAdmin(adminUserId);
  if (!fontId) {
    throw new Error("Font ID is required.");
  }

  await db.managedFont.delete({
    where: { id: fontId }
  });

  revalidatePath("/admin");
  revalidatePath("/dashboard");
  revalidatePath("/");
  revalidatePath("/[username]", "page");
}

export async function adminUpdateFont(adminUserId: string, fontId: string, name: string, value: string, tier: string, giftLabel?: string) {
  await ensureAdmin(adminUserId);
  if (!fontId || !name || !value || !tier) {
    throw new Error("Font ID, name, value, and tier are required.");
  }
  const cleanName = name.trim();
  const cleanValue = value.trim();
  const cleanGiftLabel = giftLabel?.trim() || null;

  await db.managedFont.update({
    where: { id: fontId },
    data: {
      name: cleanName,
      value: cleanValue,
      tier,
      giftLabel: cleanGiftLabel
    }
  });

  revalidatePath("/admin");
  revalidatePath("/dashboard");
  revalidatePath("/");
  revalidatePath("/[username]", "page");
}

// ==========================================
// QR CODE ACTIONS WITH PLAN QUOTA LIMITS
// ==========================================

export async function createQrCode(
  userId: string,
  name: string,
  type: string,
  value: string,
  fgColor: string = "#000000",
  bgColor: string = "#ffffff",
  logoUrl?: string
) {
  if (!userId || !name || !type || !value) {
    throw new Error("Missing required fields for QR Code registration.");
  }

  // 1. Fetch user to check active plan
  const user = await db.user.findUnique({
    where: { id: userId },
    include: { qrCodes: true }
  });

  if (!user) {
    throw new Error("User session not found.");
  }

  const existingCount = user.qrCodes.length;
  const userPlan = user.plan || "FREE";

  // 2. Validate QR Count limits
  if (userPlan === "FREE" && existingCount >= 5) {
    throw new Error("Free plan is limited to a maximum of 5 QR Codes. Upgrade to create more!");
  }
  if (userPlan === "STARTER" && existingCount >= 15) {
    throw new Error("Starter plan is limited to a maximum of 15 QR Codes. Upgrade to Creator for unlimited creation!");
  }

  // 3. Validate template type restrictions
  const freeAllowed = ["WEBSITE", "FACEBOOK", "INSTAGRAM", "WHATSAPP", "WIFI"];
  const starterAllowed = [...freeAllowed, "VCARD", "IMAGES", "SOCIAL_MEDIA", "VIDEO", "COUPON"];

  if (userPlan === "FREE" && !freeAllowed.includes(type)) {
    throw new Error(`The template type "${type}" is locked on the FREE plan. Upgrade your plan to unlock!`);
  }
  if (userPlan === "STARTER" && !starterAllowed.includes(type)) {
    throw new Error(`The template type "${type}" is locked on the STARTER plan. Upgrade to CREATOR plan to unlock!`);
  }

  // 4. Commit creation to Database
  const newQr = await db.qrCode.create({
    data: {
      userId,
      name: name.trim(),
      type,
      value: value.trim(),
      fgColor,
      bgColor,
      logoUrl: logoUrl || null
    }
  });

  revalidatePath("/dashboard");
  return newQr;
}

export async function updateQrCode(
  userId: string,
  qrId: string,
  name: string,
  value: string,
  fgColor: string,
  bgColor: string,
  logoUrl?: string
) {
  if (!userId || !qrId || !name || !value) {
    throw new Error("Missing required fields for QR Code modification.");
  }

  // Verify ownership
  const existingQr = await db.qrCode.findUnique({
    where: { id: qrId }
  });

  if (!existingQr || existingQr.userId !== userId) {
    throw new Error("Unauthorized or QR Code not found.");
  }

  const updated = await db.qrCode.update({
    where: { id: qrId },
    data: {
      name: name.trim(),
      value: value.trim(),
      fgColor,
      bgColor,
      logoUrl: logoUrl || null
    }
  });

  revalidatePath("/dashboard");
  return updated;
}

export async function deleteQrCode(userId: string, qrId: string) {
  if (!userId || !qrId) {
    throw new Error("Missing required parameters for deletion.");
  }

  // Verify ownership
  const existingQr = await db.qrCode.findUnique({
    where: { id: qrId }
  });

  if (!existingQr || existingQr.userId !== userId) {
    throw new Error("Unauthorized or QR Code not found.");
  }

  await db.qrCode.delete({
    where: { id: qrId }
  });

  revalidatePath("/dashboard");
  return { success: true };
}

// ===========================
// Slider Item Management
// ===========================

export async function addSliderItem(adminUserId: string, title: string, imageUrl: string, link?: string) {
  await ensureAdmin(adminUserId);

  if (!title || !imageUrl) {
    throw new Error("Title and image URL are required.");
  }

  const item = await db.sliderItem.create({
    data: { title, imageUrl, link: link || null },
  });

  revalidatePath("/");
  revalidatePath("/admin");
  return item;
}

export async function deleteSliderItem(adminUserId: string, itemId: string) {
  await ensureAdmin(adminUserId);

  await db.sliderItem.delete({
    where: { id: itemId },
  });

  revalidatePath("/");
  revalidatePath("/admin");
  return { success: true };
}

export async function updateSliderItem(adminUserId: string, itemId: string, title: string, imageUrl: string, link?: string) {
  await ensureAdmin(adminUserId);

  const item = await db.sliderItem.update({
    where: { id: itemId },
    data: { title, imageUrl, link: link || null },
  });

  revalidatePath("/");
  revalidatePath("/admin");
  return item;
}

// ==========================================
// TEMPLATE ACTIONS
// ==========================================

export async function getTemplates() {
  return await db.template.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function getAllTemplatesAdmin(adminUserId: string) {
  await ensureAdmin(adminUserId);
  return await db.template.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export async function createTemplate(
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
    isActive: boolean;
    isCoded: boolean;
    customCss?: string;
    configJson?: string;
  }
) {
  await ensureAdmin(adminUserId);
  if (!data.name || data.price === undefined || !data.category || !data.coverUrl) {
    throw new Error("Missing required fields for template creation.");
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
      isActive: data.isActive !== false,
      isCoded: !!data.isCoded,
      customCss: data.customCss || null,
      configJson: data.configJson || null,
    },
  });

  revalidatePath("/sablonlar");
  revalidatePath("/admin/templates");
  return template;
}

export async function updateTemplate(
  adminUserId: string,
  templateId: string,
  data: {
    name?: string;
    price?: number;
    category?: string;
    coverUrl?: string;
    bgColor?: string;
    fontStyle?: string;
    buttonStyle?: string;
    paymentLink?: string;
    isActive?: boolean;
    isCoded?: boolean;
    customCss?: string;
    configJson?: string;
  }
) {
  await ensureAdmin(adminUserId);
  const updateData: any = { ...data };
  if (data.price !== undefined) {
    updateData.price = Number(data.price);
  }

  const template = await db.template.update({
    where: { id: templateId },
    data: updateData,
  });

  revalidatePath("/sablonlar");
  revalidatePath("/admin/templates");
  return template;
}

export async function deleteTemplate(adminUserId: string, templateId: string) {
  await ensureAdmin(adminUserId);
  await db.template.delete({
    where: { id: templateId },
  });

  revalidatePath("/sablonlar");
  revalidatePath("/admin/templates");
  return { success: true };
}

export async function purchaseTemplate(userId: string, templateId: string) {
  if (!userId || !templateId) {
    throw new Error("Missing parameters");
  }

  await db.userTemplate.upsert({
    where: {
      userId_templateId: {
        userId,
        templateId,
      },
    },
    update: {},
    create: {
      userId,
      templateId,
    },
  });

  // Apply template immediately after purchasing it
  await applyTemplateToProfile(userId, templateId);

  revalidatePath("/dashboard");
  revalidatePath("/sablonlar");
  return { success: true };
}

export async function applyTemplateToProfile(userId: string, templateId: string) {
  if (!userId || !templateId) {
    throw new Error("Missing parameters");
  }

  const template = await db.template.findUnique({
    where: { id: templateId }
  });

  if (!template) {
    throw new Error("Template not found");
  }

  // Make sure user owns this template (or it is free)
  const isFree = template.price === 0;
  if (!isFree) {
    const ownership = await db.userTemplate.findUnique({
      where: {
        userId_templateId: {
          userId,
          templateId
        }
      }
    });
    if (!ownership) {
      throw new Error("You do not own this template. Please purchase it first!");
    }
  }

  // Apply properties to the user's Profile
  await db.profile.update({
    where: { userId },
    data: {
      background: template.bgColor,
      fontStyle: template.fontStyle,
      theme: "custom"
    }
  });

  // Apply button styling from template's buttonStyle to all user's links
  if (template.buttonStyle) {
    const parsed = parseButtonStyle(template.buttonStyle);
    await db.link.updateMany({
      where: { userId },
      data: {
        bgColor: parsed.bgColor,
        textColor: parsed.textColor,
        borderColor: parsed.borderColor,
        borderStyle: parsed.borderStyle,
        borderWidth: parsed.borderWidth,
        borderRadius: parsed.borderRadius,
        shadow: parsed.shadow,
        fontWeight: parsed.fontWeight,
        animation: parsed.animation || ""
      }
    });
  }

  revalidatePath("/dashboard");
  revalidatePath("/[username]", "page");
  return { success: true };
}

// parseButtonStyle and tailwindToHex are imported from @/lib/parse-button-style

export async function seedTemplates(adminUserId?: string) {
  if (adminUserId) {
    await ensureAdmin(adminUserId);
  }

  const existingTemplates = await db.template.findMany({
    select: { name: true }
  });
  const existingNames = new Set(existingTemplates.map(t => t.name));

  const sampleTemplates = [
    {
      name: "Cyberpunk Glow",
      price: 199.0,
      category: "Gamer",
      coverUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=400&h=300&fit=crop",
      bgColor: "linear-gradient(135deg, #09090b 0%, #1e1b4b 100%)",
      fontStyle: "Courier New",
      buttonStyle: "border-2 border-neon-blue bg-transparent text-neon-blue shadow-[0_0_15px_rgba(59,130,246,0.5)]",
      isActive: true,
      isCoded: true,
      customCss: `.profile-card { border: 2px solid #3b82f6; box-shadow: 0 0 20px #3b82f6; }\n.btn-link { text-transform: uppercase; letter-spacing: 0.1em; }`,
      configJson: `{"accentColor": "#3b82f6", "glowColor": "#a855f7"}`,
    },
    {
      name: "Pastel Dream",
      price: 99.0,
      category: "Kreatör",
      coverUrl: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=400&h=300&fit=crop",
      bgColor: "linear-gradient(135deg, #fef08a 0%, #fbcfe8 100%)",
      fontStyle: "Inter",
      buttonStyle: "bg-white/80 hover:bg-white text-slate-800 rounded-full border border-pink-200 backdrop-blur-sm",
      isActive: true,
      isCoded: false,
    },
    {
      name: "Retro Synth",
      price: 149.0,
      category: "Müzisyen",
      coverUrl: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=400&h=300&fit=crop",
      bgColor: "linear-gradient(135deg, #180026 0%, #3d0066 100%)",
      fontStyle: "Impact",
      buttonStyle: "bg-gradient-to-r from-fuchsia-600 to-pink-600 text-white rounded-lg shadow-lg",
      isActive: true,
      isCoded: false,
    },
    {
      name: "Minimalist Light",
      price: 0.0,
      category: "Kurumsal",
      coverUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=400&h=300&fit=crop",
      bgColor: "#ffffff",
      fontStyle: "Arial",
      buttonStyle: "bg-slate-900 text-white rounded-none hover:bg-slate-800",
      isActive: true,
      isCoded: false,
    },
    {
      name: "Luxury Emerald",
      price: 249.0,
      category: "Kreatör",
      coverUrl: "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?q=80&w=400&h=300&fit=crop",
      bgColor: "linear-gradient(135deg, #022c22 0%, #064e3b 100%)",
      fontStyle: "Georgia",
      buttonStyle: "bg-emerald-500 hover:bg-emerald-400 text-white rounded-xl border border-emerald-300",
      isActive: true,
      isCoded: false,
    },
    {
      name: "Dark Neon Pink",
      price: 129.0,
      category: "Gamer",
      coverUrl: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=400&h=300&fit=crop",
      bgColor: "#09090b",
      fontStyle: "Inter",
      buttonStyle: "border border-pink-500 bg-black text-pink-500 shadow-[0_0_10px_#ec4899]",
      isActive: true,
      isCoded: false,
    },
    {
      name: "Warm Autumn",
      price: 79.0,
      category: "Yazar",
      coverUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=400&h=300&fit=crop",
      bgColor: "linear-gradient(135deg, #78350f 0%, #b45309 100%)",
      fontStyle: "Georgia",
      buttonStyle: "bg-amber-100 text-amber-900 rounded-2xl hover:bg-amber-50",
      isActive: true,
      isCoded: false,
    },
    {
      name: "Ocean breeze",
      price: 0.0,
      category: "Genel",
      coverUrl: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=400&h=300&fit=crop",
      bgColor: "linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%)",
      fontStyle: "Inter",
      buttonStyle: "bg-white text-sky-900 rounded-xl hover:bg-sky-50 shadow-md",
      isActive: true,
      isCoded: false,
    },
    {
      name: "Monochrome Pro",
      price: 199.0,
      category: "Kurumsal",
      coverUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=400&h=300&fit=crop",
      bgColor: "#121212",
      fontStyle: "Inter",
      buttonStyle: "border border-zinc-700 bg-zinc-900 hover:bg-zinc-800 text-white rounded-md",
      isActive: true,
      isCoded: true,
      customCss: `body { background-color: #121212; }\n.link-item { border-radius: 4px; border: 1px solid #333; }`,
      configJson: `{"themeMode": "dark", "borderColor": "#333"}`,
    },
    {
      name: "Sweet Lavender",
      price: 89.0,
      category: "Genel",
      coverUrl: "https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?q=80&w=400&h=300&fit=crop",
      bgColor: "linear-gradient(135deg, #c084fc 0%, #818cf8 100%)",
      fontStyle: "Inter",
      buttonStyle: "bg-white hover:bg-purple-50 text-indigo-900 rounded-xl shadow-lg",
      isActive: true,
      isCoded: false,
    },
    {
      name: "Cyberpunk Magenta",
      price: 179.0,
      category: "Gamer",
      coverUrl: "https://images.unsplash.com/photo-1563089145-599997674d42?q=80&w=400&h=300&fit=crop",
      bgColor: "linear-gradient(to right, #ec4899, #8b5cf6)",
      fontStyle: "Space Grotesk",
      buttonStyle: "bg-black/90 hover:bg-black text-pink-400 border border-pink-500 rounded-md",
      isActive: true,
      isCoded: false,
    },
    {
      name: "Sunset Dream",
      price: 0.0,
      category: "Genel",
      coverUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=400&h=300&fit=crop",
      bgColor: "linear-gradient(135deg, #f97316 0%, #e11d48 100%)",
      fontStyle: "Outfit",
      buttonStyle: "bg-white/95 text-red-650 rounded-full hover:bg-white",
      isActive: true,
      isCoded: false,
    },
    {
      name: "Forest Whisper",
      price: 69.0,
      category: "Yazar",
      coverUrl: "https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=400&h=300&fit=crop",
      bgColor: "linear-gradient(135deg, #064e3b 0%, #15803d 100%)",
      fontStyle: "Georgia",
      buttonStyle: "bg-emerald-950 text-emerald-250 border border-emerald-800 rounded-lg",
      isActive: true,
      isCoded: false,
    },
    {
      name: "Electric Blue",
      price: 159.0,
      category: "Gamer",
      coverUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=400&h=300&fit=crop",
      bgColor: "#0f172a",
      fontStyle: "Courier New",
      buttonStyle: "border border-cyan-500 bg-transparent text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.3)]",
      isActive: true,
      isCoded: false,
    },
    {
      name: "Vintage Paper",
      price: 99.0,
      category: "Yazar",
      coverUrl: "https://images.unsplash.com/photo-1586075010923-2dd4570fb338?q=80&w=400&h=300&fit=crop",
      bgColor: "#fcfbf7",
      fontStyle: "Playfair Display",
      buttonStyle: "text-slate-800 border border-slate-800 bg-transparent hover:bg-slate-50",
      isActive: true,
      isCoded: false,
    },
    {
      name: "Midnight Purple",
      price: 219.0,
      category: "Müzisyen",
      coverUrl: "https://images.unsplash.com/photo-1506157786151-b8491531f063?q=80&w=400&h=300&fit=crop",
      bgColor: "linear-gradient(135deg, #3b0764 0%, #1e1b4b 100%)",
      fontStyle: "Arial",
      buttonStyle: "bg-gradient-to-r from-fuchsia-600 to-indigo-650 text-white rounded-xl",
      isActive: true,
      isCoded: false,
    },
    {
      name: "Bright Gold",
      price: 299.0,
      category: "Kurumsal",
      coverUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=400&h=300&fit=crop",
      bgColor: "linear-gradient(to right, #fbbf24, #f59e0b)",
      fontStyle: "Inter",
      buttonStyle: "bg-slate-950 hover:bg-slate-900 text-amber-400 rounded-full font-bold",
      isActive: true,
      isCoded: false,
    },
    {
      name: "Holographic Glass",
      price: 189.0,
      category: "Kreatör",
      coverUrl: "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=400&h=300&fit=crop",
      bgColor: "linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 100%)",
      fontStyle: "Syne",
      buttonStyle: "bg-white/20 hover:bg-white/30 text-white border border-white/20 backdrop-blur-md rounded-2xl",
      isActive: true,
      isCoded: false,
    },
    {
      name: "Tokyo Drift",
      price: 0.0,
      category: "Gamer",
      coverUrl: "https://images.unsplash.com/photo-1547082299-de196ea013d6?q=80&w=400&h=300&fit=crop",
      bgColor: "#09090b",
      fontStyle: "Impact",
      buttonStyle: "bg-red-600 text-white font-bold skew-x-3 hover:bg-red-700",
      isActive: true,
      isCoded: false,
    },
    {
      name: "Royal Velvet",
      price: 249.0,
      category: "Kurumsal",
      coverUrl: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=400&h=300&fit=crop",
      bgColor: "linear-gradient(135deg, #1e1b4b 0%, #311042 100%)",
      fontStyle: "Lora",
      buttonStyle: "bg-amber-500 hover:bg-amber-450 text-white rounded-md shadow-lg",
      isActive: true,
      isCoded: false,
    },
    {
      name: "Cyberpunk City",
      price: 229.0,
      category: "Gamer",
      coverUrl: "https://images.unsplash.com/photo-1515621061946-eff1c2a352bd?q=80&w=400&h=300&fit=crop",
      bgColor: "https://images.unsplash.com/photo-1515621061946-eff1c2a352bd?q=80&w=600&h=800&fit=crop",
      fontStyle: "Courier New",
      buttonStyle: "border-2 border-pink-500 bg-black/60 backdrop-blur-md text-pink-400 hover:text-pink-300 font-bold rounded-xl",
      isActive: true,
      isCoded: false,
    },
    {
      name: "Cosmic Nebula",
      price: 189.0,
      category: "Kreatör",
      coverUrl: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=400&h=300&fit=crop",
      bgColor: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=600&h=800&fit=crop",
      fontStyle: "Inter",
      buttonStyle: "bg-purple-900/40 backdrop-blur-md border border-purple-500/30 text-purple-200 hover:bg-purple-850 rounded-full",
      isActive: true,
      isCoded: false,
    },
    {
      name: "Sahara Sunset",
      price: 0.0,
      category: "Genel",
      coverUrl: "https://images.unsplash.com/photo-1509316975850-ff9c5edd0cd9?q=80&w=400&h=300&fit=crop",
      bgColor: "https://images.unsplash.com/photo-1509316975850-ff9c5edd0cd9?q=80&w=600&h=800&fit=crop",
      fontStyle: "Arial",
      buttonStyle: "bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 rounded-2xl",
      isActive: true,
      isCoded: false,
    },
    {
      name: "Vintage Journal",
      price: 119.0,
      category: "Yazar",
      coverUrl: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=400&h=300&fit=crop",
      bgColor: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=600&h=800&fit=crop",
      fontStyle: "Georgia",
      buttonStyle: "bg-amber-950/80 text-amber-100 hover:bg-amber-900 border border-amber-800 rounded-lg",
      isActive: true,
      isCoded: false,
    },
    {
      name: "Tokyo Neon",
      price: 199.0,
      category: "Gamer",
      coverUrl: "https://images.unsplash.com/photo-1540959733332-eab4deceeaf7?q=80&w=400&h=300&fit=crop",
      bgColor: "https://images.unsplash.com/photo-1540959733332-eab4deceeaf7?q=80&w=600&h=800&fit=crop",
      fontStyle: "Impact",
      buttonStyle: "bg-gradient-to-r from-red-600 to-indigo-650 text-white font-bold rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5",
      isActive: true,
      isCoded: false,
    },
    {
      name: "Abstract Fluid",
      price: 149.0,
      category: "Kreatör",
      coverUrl: "https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=400&h=300&fit=crop",
      bgColor: "https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=600&h=800&fit=crop",
      fontStyle: "Inter",
      buttonStyle: "bg-white/90 text-zinc-800 hover:bg-white rounded-2xl border border-zinc-200 shadow-sm",
      isActive: true,
      isCoded: false,
    },
    {
      name: "Forest Fog",
      price: 0.0,
      category: "Yazar",
      coverUrl: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=400&h=300&fit=crop",
      bgColor: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=600&h=800&fit=crop",
      fontStyle: "Georgia",
      buttonStyle: "bg-emerald-950/70 border border-emerald-800 text-emerald-100 hover:bg-emerald-900 rounded-full",
      isActive: true,
      isCoded: false,
    },
    {
      name: "Minimalist Slate",
      price: 99.0,
      category: "Kurumsal",
      coverUrl: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=400&h=300&fit=crop",
      bgColor: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=600&h=800&fit=crop",
      fontStyle: "Inter",
      buttonStyle: "bg-black text-white hover:bg-zinc-900 rounded-none border border-zinc-800",
      isActive: true,
      isCoded: false,
    },
    {
      name: "Synthwave Sunset",
      price: 169.0,
      category: "Müzisyen",
      coverUrl: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=400&h=300&fit=crop",
      bgColor: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=600&h=800&fit=crop",
      fontStyle: "Impact",
      buttonStyle: "bg-fuchsia-600 hover:bg-fuchsia-500 text-white border-2 border-cyan-400 rounded-xl",
      isActive: true,
      isCoded: false,
    },
    {
      name: "Aura Hologram",
      price: 139.0,
      category: "Kreatör",
      coverUrl: "https://images.unsplash.com/photo-1538370965046-79c0d6907d47?q=80&w=400&h=300&fit=crop",
      bgColor: "https://images.unsplash.com/photo-1538370965046-79c0d6907d47?q=80&w=600&h=800&fit=crop",
      fontStyle: "Inter",
      buttonStyle: "bg-white/25 border border-white/30 text-white hover:bg-white/35 backdrop-blur-md rounded-3xl",
      isActive: true,
      isCoded: false,
    },
  ];

  for (const template of sampleTemplates) {
    const existing = await db.template.findFirst({
      where: { name: template.name }
    });

    if (existing) {
      await db.template.update({
        where: { id: existing.id },
        data: template,
      });
    } else {
      await db.template.create({
        data: template,
      });
    }
  }

  revalidatePath("/sablonlar");
  return { success: true, seeded: true, message: "All 30 templates seeded and updated to premium aesthetics successfully." };
}

// FEATURE ACTIONS
export async function getFeatures() {
  return await db.feature.findMany({
    include: {
      plans: true
    },
    orderBy: { createdAt: "desc" }
  });
}

export async function createFeature(data: { key: string; title: string; description?: string }, plans: string[]) {
  const feature = await db.feature.create({
    data: {
      key: data.key,
      title: data.title,
      description: data.description,
      plans: {
        create: plans.map(plan => ({ plan }))
      }
    }
  });
  revalidatePath("/admin/features");
  return feature;
}

export async function updateFeature(id: string, data: { key: string; title: string; description?: string }, plans: string[]) {
  await db.featurePlan.deleteMany({
    where: { featureId: id }
  });

  const feature = await db.feature.update({
    where: { id },
    data: {
      key: data.key,
      title: data.title,
      description: data.description,
      plans: {
        create: plans.map(plan => ({ plan }))
      }
    }
  });
  revalidatePath("/admin/features");
  return feature;
}

export async function deleteFeature(id: string) {
  await db.feature.delete({
    where: { id }
  });
  revalidatePath("/admin/features");
}
// Addon Settings
export async function getAddonSettings() {
  const settings = await db.addonSetting.findMany();
  const settingsMap: Record<string, string> = {};
  for (const s of settings) {
    settingsMap[s.key] = s.value;
  }
  return settingsMap;
}

export async function saveAddonSetting(adminUserId: string, key: string, value: string) {
  if (adminUserId !== "super-admin") {
    const admin = await db.adminUser.findUnique({ where: { id: adminUserId } });
    if (!admin || !admin.isActive) throw new Error("Unauthorized");
  }
  
  await db.addonSetting.upsert({
    where: { key },
    update: { value },
    create: { key, value }
  });
}

// Addon Dummy Products
export async function getAddonDummyProducts() {
  return await db.addonDummyProduct.findMany({
    orderBy: { order: 'asc' }
  });
}

export async function createAddonDummyProduct(adminUserId: string, data: any) {
  if (adminUserId !== "super-admin") {
    const admin = await db.adminUser.findUnique({ where: { id: adminUserId } });
    if (!admin || !admin.isActive) throw new Error("Unauthorized");
  }

  return await db.addonDummyProduct.create({
    data: {
      title: data.title,
      price: data.price,
      imageUrl: data.imageUrl,
      buttonText: data.buttonText,
      order: data.order || 0,
      isActive: data.isActive !== undefined ? data.isActive : true
    }
  });
}

export async function updateAddonDummyProduct(adminUserId: string, productId: string, data: any) {
  if (adminUserId !== "super-admin") {
    const admin = await db.adminUser.findUnique({ where: { id: adminUserId } });
    if (!admin || !admin.isActive) throw new Error("Unauthorized");
  }

  return await db.addonDummyProduct.update({
    where: { id: productId },
    data: {
      title: data.title,
      price: data.price,
      imageUrl: data.imageUrl,
      buttonText: data.buttonText,
      order: data.order,
      isActive: data.isActive
    }
  });
}

export async function deleteAddonDummyProduct(adminUserId: string, productId: string) {
  if (adminUserId !== "super-admin") {
    const admin = await db.adminUser.findUnique({ where: { id: adminUserId } });
    if (!admin || !admin.isActive) throw new Error("Unauthorized");
  }

  await db.addonDummyProduct.delete({
    where: { id: productId }
  });
}

// User Addon Management
export async function purchaseAddon(userId: string, addonType: string) {
  if (!userId) throw new Error("Unauthorized");

  const existing = await db.userAddon.findUnique({
    where: {
      userId_addonType: {
        userId: userId,
        addonType
      }
    }
  });

  if (existing) return existing;

  let defaultTheme = "classic";
  if (addonType === "MINI_STORE") defaultTheme = "vibrant-pop";
  if (addonType === "BOOKING") defaultTheme = "minimalist";
  if (addonType === "NEWSLETTER") defaultTheme = "glassmorphism";
  if (addonType === "QA") defaultTheme = "dark-drill";
  if (addonType === "DONATION") defaultTheme = "classic";
  if (addonType === "NEO_BRUTAL") defaultTheme = "neo-brutalism";
  if (addonType === "ORGANIC") defaultTheme = "organic-earth";
  if (addonType === "RETRO") defaultTheme = "retro-arcade";
  if (addonType === "ACADEMIA") defaultTheme = "dark-academia";
  if (addonType === "Y2K") defaultTheme = "y2k-holographic";

  // Deactivate all other addons first to ensure only 1 active addon exists
  await db.userAddon.updateMany({
    where: { userId: userId },
    data: { isActive: false }
  });

  return await db.userAddon.create({
    data: {
      userId: userId,
      addonType,
      isActive: true,
      config: JSON.stringify({ theme: defaultTheme })
    }
  });
}

export async function updateUserAddonConfig(userId: string, addonType: string, config: string) {
  if (!userId) throw new Error("Unauthorized");

  return await db.userAddon.update({
    where: {
      userId_addonType: {
        userId: userId,
        addonType
      }
    },
    data: {
      config
    }
  });
}

import { checkAndSyncUser } from "@/lib/user-sync";

export async function buyAddonAction(addonType: string) {
  const user = await checkAndSyncUser();
  if (!user) throw new Error("Unauthorized");
  
  const res = await purchaseAddon(user.id, addonType);
  revalidatePath("/dashboard");
  revalidatePath("/[username]", "page");
  return res;
}

export async function saveAddonConfig(addonId: string, configJson: string, isActive?: boolean) {
  const user = await checkAndSyncUser();
  if (!user) throw new Error("Unauthorized");

  const addon = await db.userAddon.findUnique({
    where: { id: addonId }
  });

  if (!addon || addon.userId !== user.id) {
    throw new Error("Addon not found or unauthorized");
  }

  const updated = await db.userAddon.update({
    where: { id: addonId },
    data: { 
      config: configJson,
      ...(isActive !== undefined ? { isActive } : {})
    }
  });

  // If this addon is being activated, deactivate all other addons for the user
  if (isActive === true) {
    await db.userAddon.updateMany({
      where: { userId: user.id, id: { not: addonId } },
      data: { isActive: false }
    });
  }

  revalidatePath("/dashboard");
  revalidatePath("/[username]", "page");
  if (user.username) {
    revalidatePath(`/${user.username}`, "page");
    revalidatePath(`/${user.username}`, "layout");
  }
  return updated;
}

export async function addAddonProduct(title: string, type: string, price: number, description: string, fileUrl: string, imageUrl?: string) {
  const user = await checkAndSyncUser();
  if (!user) throw new Error("Unauthorized");

  const product = await db.product.create({
    data: {
      userId: user.id,
      title,
      type,
      price,
      description,
      fileUrl,
      imageUrl,
      isActive: true,
      salesCount: 0
    }
  });

  revalidatePath("/dashboard");
  revalidatePath("/[username]", "page");
  return product;
}

export async function deleteAddonProduct(productId: string) {
  const user = await checkAndSyncUser();
  if (!user) throw new Error("Unauthorized");

  const existing = await db.product.findUnique({ where: { id: productId } });
  if (!existing || existing.userId !== user.id) {
    throw new Error("Unauthorized");
  }

  await db.product.delete({ where: { id: productId } });
  
  revalidatePath("/dashboard");
  revalidatePath("/[username]", "page");
  return true;
}
