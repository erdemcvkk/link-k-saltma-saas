import { PrismaClient } from "@prisma/client";
import { config } from "dotenv";
config();
const prisma = new PrismaClient();

try {
  const admins = await prisma.adminUser.findMany();
  console.log("Admins count:", admins.length);
  for (const admin of admins) {
    console.log(`- name=${admin.name} | email=${admin.email} | active=${admin.isActive} | role=${admin.role} | lastLogin=${admin.lastLoginAt}`);
  }
} catch (error) {
  console.error("Error fetching admins:", error);
} finally {
  await prisma.$disconnect();
}
