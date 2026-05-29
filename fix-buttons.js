const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    // Fix Forest Whisper
    await prisma.template.updateMany({
      where: { name: 'Forest Whisper' },
      data: { buttonStyle: 'bg-green-950/80 hover:bg-green-900 text-green-100 border border-green-800/40 rounded-xl' }
    });

    // Fix Bright Gold
    await prisma.template.updateMany({
      where: { name: 'Bright Gold' },
      data: { buttonStyle: 'bg-amber-500 hover:bg-amber-400 text-stone-950 rounded-full font-bold shadow-md shadow-amber-500/10' }
    });

    // Fix Luxury Emerald
    await prisma.template.updateMany({
      where: { name: 'Luxury Emerald' },
      data: { buttonStyle: 'bg-green-500 hover:bg-green-600 text-white rounded-xl border border-green-400/50 shadow-[0_4px_20px_rgba(22,163,74,0.2)]' }
    });

    // Fix Royal Velvet
    await prisma.template.updateMany({
      where: { name: 'Royal Velvet' },
      data: { buttonStyle: 'bg-amber-500 hover:bg-amber-600 text-stone-950 rounded-lg shadow-lg border border-amber-400/40' }
    });

    console.log("Fixed template button styles in DB.");
  } catch (error) {
    console.error("Error updating templates:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
