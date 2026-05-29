const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const fs = require('fs');

async function main() {
  try {
    const templates = await prisma.template.findMany({
      select: { name: true, buttonStyle: true, bgColor: true }
    });
    fs.writeFileSync('templates-dump.json', JSON.stringify(templates, null, 2));
    console.log("Dumped templates to templates-dump.json");
  } catch (error) {
    console.error("Error dumping templates:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
