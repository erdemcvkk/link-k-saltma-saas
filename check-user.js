const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.findFirst({
    where: { username: 'takipcikasma0987qnn' }, // username from screenshot 2
    include: { profile: true }
  });
  console.log(JSON.stringify(user?.profile, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
