const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const user = await prisma.user.findFirst({ where: { username: 'takipcikasma0987qnn' }, include: { links: true } });
  console.log(user.links.map(l => ({ title: l.title, bgColor: l.bgColor, textColor: l.textColor })));
}
main().finally(() => prisma.$disconnect());
