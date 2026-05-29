const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const updated = await prisma.template.updateMany({
      where: { name: 'Forest Fog' },
      data: { buttonStyle: 'bg-green-950/70 border border-green-800 text-green-100 hover:bg-green-900 rounded-full' }
    });
    console.log(`Updated ${updated.count} templates in the database.`);
  } catch (error) {
    console.error("Error updating template:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
