const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

function checkSerializable(obj, path = '') {
  if (obj === null || obj === undefined) return;
  if (typeof obj === 'function') {
    console.log(`Function at ${path}`);
  }
  if (obj instanceof Date) {
    console.log(`Date at ${path}`);
  }
  if (typeof obj === 'object') {
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        checkSerializable(obj[key], path ? `${path}.${key}` : key);
      }
    }
  }
}

async function main() {
  const userId = 'cf627054-2494-48b6-bb5a-5b7b235e4478';
  
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { profile: true },
  });

  const serializedUser = {
    id: user.id,
    username: user.username,
    plan: user.plan,
    role: user.role,
    planStartedAt: user.planStartedAt ? user.planStartedAt.toISOString() : null,
    planExpiresAt: user.planExpiresAt ? user.planExpiresAt.toISOString() : null,
    profile: user.profile ? {
      theme: user.profile.theme,
      bio: user.profile.bio,
      avatarUrl: user.profile.avatarUrl,
      background: user.profile.background,
      seoTitle: user.profile.seoTitle,
      seoDescription: user.profile.seoDescription,
      seoKeywords: user.profile.seoKeywords,
      customDomain: user.profile.customDomain,
      fontStyle: user.profile.fontStyle,
      bioColor: user.profile.bioColor,
      usernameColor: user.profile.usernameColor,
    } : null,
  };
  checkSerializable(serializedUser, 'serializedUser');

  const links = await prisma.link.findMany({
    where: { userId },
    include: {
      clicks: {
        select: { id: true, createdAt: true },
      },
    },
  });
  
  const serializedLinks = links.map((l) => ({
    id: l.id,
    title: l.title,
    url: l.url,
    isActive: l.isActive,
    type: l.type,
    animation: l.animation || "",
    bgColor: l.bgColor ?? null,
    textColor: l.textColor ?? null,
    borderColor: l.borderColor ?? null,
    borderStyle: l.borderStyle ?? null,
    borderWidth: l.borderWidth ?? null,
    borderRadius: l.borderRadius ?? null,
    shadow: l.shadow ?? null,
    fontWeight: l.fontWeight ?? null,
    blockType: l.blockType || "TEXT_LINK",
    metadata: l.metadata ?? null,
    clicks: l.clicks.map((c) => ({
      id: c.id,
      createdAt: c.createdAt.toISOString(),
    })),
  }));
  checkSerializable(serializedLinks, 'serializedLinks');

  const pageViews = await prisma.pageView.findMany({ where: { userId } });
  const serializedPageViews = pageViews.map((pv) => ({
    id: pv.id,
    device: pv.device,
    browser: pv.browser,
    country: pv.country,
    referrer: pv.referrer,
    createdAt: pv.createdAt.toISOString(),
  }));
  checkSerializable(serializedPageViews, 'serializedPageViews');

  const products = await prisma.product.findMany({ where: { userId } });
  const serializedProducts = products.map((p) => ({
    id: p.id,
    title: p.title,
    type: p.type,
    price: p.price,
    description: p.description,
    fileUrl: p.fileUrl,
    isActive: p.isActive,
    salesCount: p.salesCount,
    createdAt: p.createdAt.toISOString(),
  }));
  checkSerializable(serializedProducts, 'serializedProducts');

  const qrCodes = await prisma.qrCode.findMany({ where: { userId } });
  const serializedQrCodes = qrCodes.map((qr) => ({
    id: qr.id,
    name: qr.name,
    type: qr.type,
    value: qr.value,
    fgColor: qr.fgColor,
    bgColor: qr.bgColor,
    logoUrl: qr.logoUrl,
    createdAt: qr.createdAt.toISOString(),
  }));
  checkSerializable(serializedQrCodes, 'serializedQrCodes');

  const ownedTemplates = await prisma.userTemplate.findMany({
    where: { userId },
    include: { template: true },
  });
  const serializedOwnedTemplates = ownedTemplates.map((ot) => ({
    id: ot.template.id,
    name: ot.template.name,
    price: ot.template.price,
    category: ot.template.category,
    coverUrl: ot.template.coverUrl,
    bgColor: ot.template.bgColor,
    fontStyle: ot.template.fontStyle,
    buttonStyle: ot.template.buttonStyle,
    isCoded: ot.template.isCoded,
    customCss: ot.template.customCss,
    configJson: ot.template.configJson,
  }));
  checkSerializable(serializedOwnedTemplates, 'serializedOwnedTemplates');

  const features = await prisma.feature.findMany({ include: { plans: true } });
  const serializedFeatures = features.map(f => ({
    key: f.key,
    plans: f.plans.map(p => p.plan)
  }));
  checkSerializable(serializedFeatures, 'serializedFeatures');

  const userAddons = await prisma.userAddon.findMany({ where: { userId } });
  const serializedAddons = userAddons.map(a => ({
    id: a.id,
    addonType: a.addonType,
    isActive: a.isActive,
    config: a.config
  }));
  checkSerializable(serializedAddons, 'serializedAddons');

  console.log("Done checking");
}

main().finally(() => prisma.$disconnect());
