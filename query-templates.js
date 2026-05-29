const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const templates = await prisma.template.findMany({
    where: { name: { contains: 'Artistic Vector' } }
  });
  console.log(templates.map(t => t.customCss));
}

main().finally(() => prisma.$disconnect());
