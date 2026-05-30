const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const t = await prisma.template.findFirst({ where: { name: 'Artistic Vector Poster' } });
  console.log(t.customCss);
}
main().finally(() => prisma.$disconnect());
