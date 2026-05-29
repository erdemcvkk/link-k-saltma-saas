const { PrismaClient } = require('@prisma/client'); 
const prisma = new PrismaClient(); 
async function main() { 
  const template = await prisma.template.findFirst({ where: { name: 'Artistic Vector Poster' }, select: { customCss: true } }); 
  console.log(template); 
} 
main().finally(() => prisma.$disconnect());
