const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const addons = await prisma.userAddon.findMany();
  console.log('UserAddons in DB:', addons);
  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
