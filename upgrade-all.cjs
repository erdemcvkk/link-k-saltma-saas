const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  console.log("🚀 Upgrading all database users to premium CREATOR plan and ADMIN role...");
  
  const result = await prisma.user.updateMany({
    data: {
      plan: "CREATOR",
      role: "ADMIN",
      isBanned: false
    }
  });
  
  console.log(`Successfully upgraded ${result.count} users in the database to premium CREATOR and ADMIN! 💎✨`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
