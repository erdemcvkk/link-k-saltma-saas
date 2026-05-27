const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany({
    include: {
      profile: true,
      purchasedTemplates: {
        include: {
          template: true
        }
      }
    }
  });
  console.log('USERS IN DATABASE:');
  console.dir(users, { depth: null });
  
  const templates = await prisma.template.findMany();
  console.log('TEMPLATES IN DATABASE COUNT:', templates.length);
}

main().finally(async () => {
  await prisma.$disconnect();
});
