const { PrismaClient } = require('@prisma/client'); 
const prisma = new PrismaClient(); 

async function main() { 
  const users = await prisma.user.findMany(); 
  
  for (let u of users) {
    const activeAddons = await prisma.userAddon.findMany({
      where: { userId: u.id, isActive: true },
      orderBy: { createdAt: 'desc' }
    });
    
    if (activeAddons.length > 1) {
      console.log(`User ${u.username} has ${activeAddons.length} active addons. Deactivating older ones.`);
      
      // Keep the first one (newest), deactivate the rest
      const [newest, ...rest] = activeAddons;
      const idsToDeactivate = rest.map(a => a.id);
      
      await prisma.userAddon.updateMany({
        where: { id: { in: idsToDeactivate } },
        data: { isActive: false }
      });
    }
  }
  console.log("Finished enforcing single active addon per user.");
} 
main();
