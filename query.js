const { PrismaClient } = require('@prisma/client'); 
const prisma = new PrismaClient(); 
async function main() { 
  const links = await prisma.link.findMany(); 
  console.log(links.slice(0,4)); 
  const user = await prisma.profile.findFirst();
  console.log("Profile theme:", user.theme);
} 
main().finally(() => prisma.$disconnect());
