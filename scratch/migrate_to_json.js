const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Renaming config to settings...');
    await prisma.$executeRawUnsafe('ALTER TABLE "UserAddon" RENAME COLUMN "config" TO "settings";');
    console.log('Renamed successfully.');
  } catch (e) {
    console.log('Rename failed (maybe already renamed):', e.message);
  }

  try {
    console.log('Converting settings type to jsonb...');
    await prisma.$executeRawUnsafe('ALTER TABLE "UserAddon" ALTER COLUMN "settings" TYPE jsonb USING "settings"::jsonb;');
    console.log('Converted successfully.');
  } catch (e) {
    console.log('Type conversion failed:', e.message);
  }

  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
