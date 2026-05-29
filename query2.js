const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const profile = await prisma.profile.findFirst({ where: { userId: 'cf627054-2494-48b6-bb5a-5b7b235e4478' } });
  console.log(profile);
}
main().finally(() => prisma.$disconnect());
