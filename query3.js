const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const user = await prisma.user.findUnique({ where: { id: 'cf627054-2494-48b6-bb5a-5b7b235e4478' } });
  console.log(user.plan);
}
main().finally(() => prisma.$disconnect());
