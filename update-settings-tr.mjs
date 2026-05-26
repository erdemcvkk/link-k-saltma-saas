// update-seed-settings.mjs
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  console.log("Updating home page settings in DB...");

  // Update or create site_title
  await prisma.globalSetting.upsert({
    where: { key: "site_title" },
    update: { value: "Link.SaaS" },
    create: { key: "site_title", value: "Link.SaaS" },
  });

  // Update or create hero_title
  await prisma.globalSetting.upsert({
    where: { key: "hero_title" },
    update: { value: "İnternetteki" },
    create: { key: "hero_title", value: "İnternetteki" },
  });

  // Update or create hero_highlight
  await prisma.globalSetting.upsert({
    where: { key: "hero_highlight" },
    update: { value: "yeni eviniz" },
    create: { key: "hero_highlight", value: "yeni eviniz" },
  });

  // Update or create hero_subtitle
  await prisma.globalSetting.upsert({
    where: { key: "hero_subtitle" },
    update: { value: "Öne çıkmak isteyen içerik üreticileri için tasarlanmış en gelişmiş bio link platformu. Ürettiğiniz, sattığınız ve paylaştığınız her şeyi tek bir yerde, göz alıcı bir tasarımla sergileyin." },
    create: { key: "hero_subtitle", value: "Öne çıkmak isteyen içerik üreticileri için tasarlanmış en gelişmiş bio link platformu. Ürettiğiniz, sattığınız ve paylaştığınız her şeyi tek bir yerde, göz alıcı bir tasarımla sergileyin." },
  });

  console.log("Successfully updated Turkish settings!");
}

main().catch(console.error).finally(() => prisma.$disconnect());
