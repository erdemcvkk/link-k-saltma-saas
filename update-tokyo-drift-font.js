const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const updated = await prisma.template.updateMany({
      where: { name: 'Tokyo Drift' },
      data: { fontStyle: 'Space Grotesk' }
    });
    console.log(`Updated ${updated.count} templates in the database.`);
  } catch (error) {
    console.error("Error updating template:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
