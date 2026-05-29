const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const profile = await prisma.profile.findFirst();
  console.log("Profile theme is:", profile.theme);
  
  // Actually, wait, maybe the active user is not the first one. Let's list all:
  const profiles = await prisma.profile.findMany();
  console.log(profiles.map(p => ({ user: p.userId, theme: p.theme })));
}
main().finally(() => prisma.$disconnect());
