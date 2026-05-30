const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const user = await prisma.user.findFirst({
    where: { username: 'takipcikasma0987qnn' },
    include: { profile: true, purchasedTemplates: { include: { template: true } } }
  });
  if (!user) { console.log('User not found'); return; }
  console.log('Profile customCss:\n', user.profile.customCss);
  const activeTemplates = user.purchasedTemplates.filter(pt => pt.isActive);
  console.log('Active templates:', activeTemplates.map(pt => pt.template.name));
  console.log('User Templates customUrls:', user.purchasedTemplates.map(pt => pt.customUrl));
  activeTemplates.forEach(pt => console.log('Template customCss:', pt.template.name, pt.template.customCss ? 'YES' : 'NO', pt.template.customCss));
}
main().finally(() => prisma.$disconnect());
