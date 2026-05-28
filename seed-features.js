const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const features = [
    { key: "seo_customization", title: "SEO Özelleştirmeleri", description: "Meta başlık, açıklama ve anahtar kelime özelleştirmesi.", plans: ["STARTER", "CREATOR", "PRO_BUSINESS"] },
    { key: "qr_customization", title: "QR Kod Özelleştirme", description: "QR kod renkleri ve ortasına logo ekleme.", plans: ["STARTER", "CREATOR", "PRO_BUSINESS"] },
    { key: "custom_domain", title: "Özel Alan Adı (Custom Domain)", description: "Kendi alan adınızı (domain) bağlayabilme.", plans: ["CREATOR", "PRO_BUSINESS"] },
    { key: "advanced_analytics", title: "Gelişmiş Analitik", description: "Detaylı sayfa ve tıklama istatistikleri.", plans: ["CREATOR", "PRO_BUSINESS"] },
  ];

  for (const f of features) {
    const existing = await prisma.feature.findUnique({ where: { key: f.key } });
    if (!existing) {
      await prisma.feature.create({
        data: {
          key: f.key,
          title: f.title,
          description: f.description,
          plans: {
            create: f.plans.map(plan => ({ plan }))
          }
        }
      });
      console.log(`Created feature: ${f.key}`);
    }
  }
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
