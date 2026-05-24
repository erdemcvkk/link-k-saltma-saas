"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

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
  if (user.plan === "FREE" && linkCount >= 20) {
    throw new Error("FREE plan is limited to 20 links. Please upgrade to STARTER or CREATOR plan to add more links!");
  }

  if (user.plan === "STARTER" && linkCount >= 100) {
    throw new Error("STARTER plan is limited to 100 links. Please upgrade to CREATOR plan for unlimited links!");
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

  await db.link.create({
    data: {
      userId,
      title,
      url: formattedUrl,
      type,
      order: nextOrder,
      isActive: true,
      animation,
      blockType,
      metadata,
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

